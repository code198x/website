#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CODE_DIR = path.join(dirname(__dirname), 'code-samples');
const DOCKER_IMAGE = 'code198x/assemblers'; // Assuming Docker image with all assemblers

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

// Test results storage
const results = {
  passed: [],
  failed: [],
  skipped: []
};

// Assembly commands for each system
const assemblers = {
  'commodore-64': {
    command: 'acme -o test.prg',
    extension: '.prg',
    docker: 'docker run --rm -v $(pwd):/workspace code198x/acme'
  },
  'sinclair-zx-spectrum': {
    command: 'sjasmplus --nologo',
    extension: '.bin',
    docker: 'docker run --rm -v $(pwd):/workspace code198x/sjasmplus'
  },
  'nintendo-entertainment-system': {
    command: 'ca65 -o test.o && ld65 test.o -C nes.cfg -o test.nes',
    extension: '.nes',
    docker: 'docker run --rm -v $(pwd):/workspace code198x/ca65'
  },
  'commodore-amiga': {
    command: 'vasmm68k_mot -Fhunkexe -o test',
    extension: '',
    docker: 'docker run --rm -v $(pwd):/workspace code198x/vasm'
  }
};

// Function to test a single assembly file
async function testAssembly(filePath, system) {
  const assembler = assemblers[system];
  if (!assembler) {
    console.log(`${colors.yellow}⚠${colors.reset}  No assembler configured for ${system}`);
    results.skipped.push(filePath);
    return false;
  }

  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);

  try {
    // Try to assemble using Docker
    const command = `cd "${dirName}" && ${assembler.docker} ${assembler.command} ${fileName}`;

    console.log(`${colors.gray}  Testing: ${fileName}${colors.reset}`);

    const { stdout, stderr } = await execAsync(command, {
      timeout: 10000 // 10 second timeout
    });

    // Check if output file was created
    const outputFile = path.join(dirName, `test${assembler.extension}`);
    if (fs.existsSync(outputFile)) {
      // Clean up test file
      fs.unlinkSync(outputFile);
      console.log(`${colors.green}  ✓ ${fileName} assembled successfully${colors.reset}`);
      results.passed.push(filePath);
      return true;
    } else {
      console.log(`${colors.red}  ✗ ${fileName} did not produce output${colors.reset}`);
      if (stderr) console.log(`${colors.gray}    ${stderr}${colors.reset}`);
      results.failed.push({ file: filePath, error: 'No output file' });
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}  ✗ ${fileName} failed to assemble${colors.reset}`);
    console.log(`${colors.gray}    ${error.message}${colors.reset}`);
    results.failed.push({ file: filePath, error: error.message });
    return false;
  }
}

// Function to capture screenshot using VICE
async function captureScreenshot(prgPath, outputPath) {
  try {
    // VICE can be run in batch mode to capture screenshots
    const command = `x64sc -default \
      -autostart "${prgPath}" \
      -autostartdelayframes 60 \
      -screenshot "${outputPath}" \
      -screenshotfile "${outputPath}" \
      -warp \
      -limitcycles 1000000 \
      -exitscreenshot`;

    await execAsync(command, { timeout: 5000 });

    if (fs.existsSync(outputPath)) {
      console.log(`${colors.blue}  📸 Screenshot captured${colors.reset}`);
      return true;
    }
  } catch (error) {
    console.log(`${colors.gray}  Could not capture screenshot${colors.reset}`);
    return false;
  }
}

// Function to generate test report
function generateReport() {
  const reportPath = path.join(dirname(__dirname), 'test-report.md');

  const report = `# Code Samples Test Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Tests**: ${results.passed.length + results.failed.length + results.skipped.length}
- **Passed**: ${results.passed.length} ✅
- **Failed**: ${results.failed.length} ❌
- **Skipped**: ${results.skipped.length} ⚠️
- **Success Rate**: ${((results.passed.length / (results.passed.length + results.failed.length)) * 100).toFixed(1)}%

## Passed Tests

${results.passed.map(f => `- ✅ ${f.replace(CODE_DIR, '.')}`).join('\n')}

## Failed Tests

${results.failed.map(f => `- ❌ ${f.file.replace(CODE_DIR, '.')}\n  - Error: ${f.error}`).join('\n')}

## Skipped Tests

${results.skipped.map(f => `- ⚠️ ${f.replace(CODE_DIR, '.')}`).join('\n')}

## Recommendations

${results.failed.length > 0 ? '1. Fix failing assemblies before deployment' : ''}
${results.skipped.length > 0 ? '2. Configure assemblers for skipped systems' : ''}
${results.passed.length === results.passed.length + results.failed.length ? '🎉 All tests passing! Ready for deployment.' : ''}
`;

  fs.writeFileSync(reportPath, report);
  console.log(`\n📊 Test report written to: ${reportPath}`);
}

// Main verification process
async function main() {
  console.log(`${colors.blue}🔍 Verifying Code Samples${colors.reset}\n`);

  // Check if Docker is available
  try {
    await execAsync('docker --version');
    console.log(`${colors.green}✓ Docker is available${colors.reset}\n`);
  } catch {
    console.log(`${colors.red}✗ Docker is not available - tests will be limited${colors.reset}\n`);
  }

  // Find all assembly files
  const systems = fs.readdirSync(CODE_DIR)
    .filter(f => fs.statSync(path.join(CODE_DIR, f)).isDirectory());

  for (const system of systems) {
    console.log(`${colors.blue}📂 Testing ${system}${colors.reset}`);

    const systemPath = path.join(CODE_DIR, system);

    // Recursively find all .asm files
    const findAsmFiles = (dir) => {
      const files = [];
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...findAsmFiles(fullPath));
        } else if (item.endsWith('.asm') && item === 'main.asm') {
          files.push(fullPath);
        }
      }

      return files;
    };

    const asmFiles = findAsmFiles(systemPath);

    for (const asmFile of asmFiles) {
      await testAssembly(asmFile, system);

      // For C64, try to capture screenshot if assembly passed
      if (system === 'commodore-64' && results.passed.includes(asmFile)) {
        const prgFile = asmFile.replace('.asm', '.prg');
        const screenshotFile = asmFile.replace('.asm', '.png');

        if (fs.existsSync(prgFile)) {
          await captureScreenshot(prgFile, screenshotFile);
        }
      }
    }

    console.log('');
  }

  // Generate report
  generateReport();

  // Print summary
  console.log(`\n${colors.blue}📊 Test Summary${colors.reset}`);
  console.log(`${colors.green}  Passed: ${results.passed.length}${colors.reset}`);
  console.log(`${colors.red}  Failed: ${results.failed.length}${colors.reset}`);
  console.log(`${colors.yellow}  Skipped: ${results.skipped.length}${colors.reset}`);

  // Exit with error if any tests failed
  if (results.failed.length > 0) {
    process.exit(1);
  }
}

// Run the verification
main().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});