/**
 * Code Like It's 198x - Compilation API Server
 * Docker-based retro compilation service
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Redis = require('redis');
const Docker = require('dockerode');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// Initialize services
const app = express();
const docker = new Docker();
const redis = Redis.createClient({ url: 'redis://redis:6379' });

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'compilation.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 compilations per 15 minutes per IP
  message: 'Too many compilation requests, please try again later'
});
app.use('/api/compile', limiter);

// File upload configuration
const upload = multer({
  dest: '/app/temp/',
  limits: {
    fileSize: 1024 * 1024, // 1MB limit for source files
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Allow assembly source files
    const allowedExtensions = ['.asm', '.s', '.a', '.src', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only assembly source files allowed.'));
    }
  }
});

// System configurations
const SYSTEMS = {
  'commodore-64': {
    dockerImage: 'code198x/c64-compiler',
    assemblers: ['ca65', 'acme'],
    formats: ['prg', 'd64', 'tap'],
    defaultAssembler: 'ca65',
    defaultFormat: 'prg'
  },
  'zx-spectrum': {
    dockerImage: 'code198x/spectrum-compiler',
    assemblers: ['sjasmplus', 'pasmo'],
    formats: ['tap', 'tzx', 'sna'],
    defaultAssembler: 'sjasmplus',
    defaultFormat: 'tap'
  },
  'nintendo-entertainment-system': {
    dockerImage: 'code198x/nes-compiler',
    assemblers: ['ca65', 'nesasm'],
    formats: ['nes', 'nsf'],
    defaultAssembler: 'ca65',
    defaultFormat: 'nes'
  },
  'commodore-amiga': {
    dockerImage: 'code198x/amiga-compiler',
    assemblers: ['vasm', 'phxass'],
    formats: ['exe', 'adf'],
    defaultAssembler: 'vasm',
    defaultFormat: 'exe'
  }
};

// API Routes

/**
 * GET /api/systems
 * Get available compilation systems
 */
app.get('/api/systems', (req, res) => {
  const systems = Object.keys(SYSTEMS).map(key => ({
    id: key,
    name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    assemblers: SYSTEMS[key].assemblers,
    formats: SYSTEMS[key].formats,
    defaults: {
      assembler: SYSTEMS[key].defaultAssembler,
      format: SYSTEMS[key].defaultFormat
    }
  }));
  
  res.json({ systems });
});

/**
 * POST /api/compile
 * Compile assembly source code
 */
app.post('/api/compile', upload.single('source'), async (req, res) => {
  const jobId = uuidv4();
  
  try {
    const { system, assembler, format, filename } = req.body;
    const sourceFile = req.file;
    
    // Validate system
    if (!SYSTEMS[system]) {
      return res.status(400).json({
        error: 'Invalid system',
        available: Object.keys(SYSTEMS)
      });
    }
    
    const systemConfig = SYSTEMS[system];
    
    // Validate assembler
    const selectedAssembler = assembler || systemConfig.defaultAssembler;
    if (!systemConfig.assemblers.includes(selectedAssembler)) {
      return res.status(400).json({
        error: 'Invalid assembler',
        available: systemConfig.assemblers
      });
    }
    
    // Validate format
    const selectedFormat = format || systemConfig.defaultFormat;
    if (!systemConfig.formats.includes(selectedFormat)) {
      return res.status(400).json({
        error: 'Invalid format',
        available: systemConfig.formats
      });
    }
    
    // Validate source file
    if (!sourceFile) {
      return res.status(400).json({
        error: 'Source file required'
      });
    }
    
    logger.info('Starting compilation job', {
      jobId,
      system,
      assembler: selectedAssembler,
      format: selectedFormat,
      sourceFile: sourceFile.originalname
    });
    
    // Create job record
    const job = {
      id: jobId,
      system,
      assembler: selectedAssembler,
      format: selectedFormat,
      sourceFile: sourceFile.originalname,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await redis.set(`job:${jobId}`, JSON.stringify(job), { EX: 3600 }); // 1 hour TTL
    
    // Start compilation in background
    compileAsync(jobId, sourceFile, job).catch(error => {
      logger.error('Compilation failed', { jobId, error: error.message });
    });
    
    res.json({
      jobId,
      status: 'pending',
      message: 'Compilation started'
    });
    
  } catch (error) {
    logger.error('API error', { jobId, error: error.message });
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/jobs/:jobId
 * Get job status and results
 */
app.get('/api/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobData = await redis.get(`job:${jobId}`);
    
    if (!jobData) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }
    
    const job = JSON.parse(jobData);
    res.json(job);
    
  } catch (error) {
    logger.error('Job status error', { error: error.message });
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/download/:jobId/:filename
 * Download compiled output
 */
app.get('/api/download/:jobId/:filename', async (req, res) => {
  try {
    const { jobId, filename } = req.params;
    const filePath = path.join('/app/output', jobId, filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        error: 'File not found'
      });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(filePath);
    
  } catch (error) {
    logger.error('Download error', { error: error.message });
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * Background compilation function
 */
async function compileAsync(jobId, sourceFile, job) {
  try {
    // Update job status
    job.status = 'compiling';
    await redis.set(`job:${jobId}`, JSON.stringify(job), { EX: 3600 });
    
    const systemConfig = SYSTEMS[job.system];
    const outputDir = path.join('/app/output', jobId);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Copy source file to workspace
    const sourceDestination = path.join(outputDir, 'source.asm');
    await fs.copyFile(sourceFile.path, sourceDestination);
    
    // Run compilation container
    const container = await docker.createContainer({
      Image: systemConfig.dockerImage,
      Cmd: ['source.asm', 'program', job.assembler, job.format],
      WorkingDir: '/workspace',
      HostConfig: {
        Binds: [
          `${outputDir}:/workspace/src`,
          `${outputDir}:/output`
        ],
        Memory: 512 * 1024 * 1024, // 512MB limit
        CpuShares: 512,
        NetworkMode: 'none' // No network access for security
      }
    });
    
    await container.start();
    
    // Wait for completion (with timeout)
    const result = await container.wait();
    const logs = await container.logs({ stdout: true, stderr: true });
    
    await container.remove();
    
    // Clean up temp file
    await fs.unlink(sourceFile.path);
    
    if (result.StatusCode === 0) {
      // Compilation successful
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      
      // List output files
      const files = await fs.readdir(outputDir);
      job.outputFiles = files.filter(f => f !== 'source.asm');
      
      logger.info('Compilation completed', { jobId, outputFiles: job.outputFiles });
      
    } else {
      // Compilation failed
      job.status = 'failed';
      job.error = 'Compilation failed';
      job.logs = logs.toString();
      
      logger.error('Compilation failed', { jobId, statusCode: result.StatusCode });
    }
    
    await redis.set(`job:${jobId}`, JSON.stringify(job), { EX: 3600 });
    
  } catch (error) {
    job.status = 'failed';
    job.error = error.message;
    await redis.set(`job:${jobId}`, JSON.stringify(job), { EX: 3600 });
    
    logger.error('Compilation error', { jobId, error: error.message });
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await redis.ping();
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Error handling
app.use((error, req, res, next) => {
  logger.error('Unhandled error', { error: error.message });
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await redis.connect();
    logger.info('Connected to Redis');
    
    app.listen(PORT, () => {
      logger.info(`Compilation API server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

startServer();