#!/usr/bin/env node
/**
 * Generate screenshots for units across all platforms
 *
 * Usage:
 *   node scripts/generate-screenshots.mjs                    # Generate all missing
 *   node scripts/generate-screenshots.mjs --platform c64     # Specific platform
 *   node scripts/generate-screenshots.mjs --game game-01-starfield --unit 8
 *   node scripts/generate-screenshots.mjs --force            # Regenerate existing
 *   node scripts/generate-screenshots.mjs --dry-run          # Show what would run
 */

import { readFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const projectRoot = join(rootDir, '..');
const unitsDir = join(rootDir, 'src/content/units');
const imagesDir = join(rootDir, 'public/images');
const codeSamplesDir = join(projectRoot, 'code-samples');

// Platform aliases
const PLATFORM_ALIASES = {
  'c64': 'commodore-64',
  'spectrum': 'sinclair-zx-spectrum',
  'zx': 'sinclair-zx-spectrum',
  'amiga': 'commodore-amiga',
  'nes': 'nintendo-entertainment-system'
};

// Platform configurations
const PLATFORMS = {
  'commodore-64': {
    docker: 'c64-dev:latest',
    extension: '.prg',
    screenshotScript: '/scripts/c64-screenshot.sh',
    romsMount: '/Users/stevehill/Projects/Code198x/commodore-64-dev/roms:/roms',
    scriptsMount: '/Users/stevehill/Projects/Code198x/commodore-64-dev/scripts:/scripts',
    getAsmName: (gameSlug) => {
      // Extract base name from slug (e.g., game-01-starfield -> starfield)
      const parts = gameSlug.split('-');
      return parts[parts.length - 1];
    }
  },
  'sinclair-zx-spectrum': {
    docker: 'ghcr.io/code198x/sinclair-zx-spectrum:latest',
    extension: '.sna',
    screenshotCmd: 'spectrum-screenshot',
    getAsmName: (gameSlug) => {
      const parts = gameSlug.split('-');
      return parts[parts.length - 1];
    }
  },
  'commodore-amiga': {
    docker: 'amiga-dev:latest',
    extension: '.adf',
    screenshotScript: '/scripts/amiga-screenshot.sh',
    romsMount: '/tmp/kickstart:/roms',
    scriptsMount: '/Users/stevehill/Projects/Code198x/commodore-amiga-dev/scripts:/scripts',
    getAsmName: (gameSlug) => {
      const parts = gameSlug.split('-');
      return parts[parts.length - 1];
    }
  },
  'nintendo-entertainment-system': {
    docker: 'code198x/nintendo-entertainment-system:latest',
    extension: '.nes',
    screenshotCmd: 'nes-screenshot',
    getAsmName: (gameSlug) => {
      const parts = gameSlug.split('-');
      return parts[parts.length - 1];
    }
  }
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    platform: null,
    game: null,
    unit: null,
    force: false,
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--platform' || arg === '-p') {
      const value = args[++i];
      options.platform = PLATFORM_ALIASES[value] || value;
    } else if (arg === '--game' || arg === '-g') {
      options.game = args[++i];
    } else if (arg === '--unit' || arg === '-u') {
      options.unit = parseInt(args[++i]);
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    } else if (arg === '--dry-run' || arg === '-n') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: node scripts/generate-screenshots.mjs [options]

Options:
  -p, --platform <name>  Filter by platform (c64, spectrum, amiga, nes)
  -g, --game <slug>      Filter by game slug (e.g., game-01-starfield)
  -u, --unit <number>    Filter by unit number
  -f, --force            Regenerate existing screenshots
  -n, --dry-run          Show what would be generated without running
  -h, --help             Show this help

Examples:
  node scripts/generate-screenshots.mjs
  node scripts/generate-screenshots.mjs --platform c64
  node scripts/generate-screenshots.mjs --game game-01-starfield --unit 8 --force
  node scripts/generate-screenshots.mjs --dry-run
`);
}

// Parse YAML file (simple parser for our format)
function parseUnitsYaml(content) {
  const lines = content.split('\n');
  const result = { units: [] };
  let currentUnit = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (line.startsWith('platform:')) {
      result.platform = line.split(':')[1].trim();
    } else if (line.startsWith('track:')) {
      result.track = line.split(':')[1].trim();
    } else if (line.startsWith('gameSlug:')) {
      result.gameSlug = line.split(':')[1].trim();
    } else if (trimmed.startsWith('- number:')) {
      if (currentUnit) result.units.push(currentUnit);
      currentUnit = { number: parseInt(trimmed.split(':')[1].trim()) };
    } else if (currentUnit) {
      if (trimmed.startsWith('title:')) {
        currentUnit.title = trimmed.split(':').slice(1).join(':').trim().replace(/^["']|["']$/g, '');
      } else if (trimmed.startsWith('available:')) {
        currentUnit.available = trimmed.split(':')[1].trim() === 'true';
      }
    }
  }
  if (currentUnit) result.units.push(currentUnit);

  return result;
}

// Read all units from content collection
function readAllUnits() {
  const allUnits = [];

  // Walk through nested directory structure: units/{platform}/{track}/{game}.yaml
  if (!existsSync(unitsDir)) {
    console.error(`Units directory not found: ${unitsDir}`);
    return allUnits;
  }

  const platforms = readdirSync(unitsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const platform of platforms) {
    const platformDir = join(unitsDir, platform);
    const tracks = readdirSync(platformDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const track of tracks) {
      const trackDir = join(platformDir, track);
      const files = readdirSync(trackDir).filter(f => f.endsWith('.yaml'));

      for (const file of files) {
        const content = readFileSync(join(trackDir, file), 'utf-8');
        const data = parseUnitsYaml(content);

        for (const unit of data.units) {
          allUnits.push({
            platform: data.platform,
            track: data.track,
            gameSlug: data.gameSlug,
            unitNumber: unit.number,
            title: unit.title,
            available: unit.available
          });
        }
      }
    }
  }

  return allUnits;
}

// Check if code sample exists for a unit
function hasCodeSample(platform, gameSlug, unitNumber) {
  const unitDir = join(codeSamplesDir, platform, gameSlug, `unit-${String(unitNumber).padStart(2, '0')}`);
  if (!existsSync(unitDir)) return false;

  const files = readdirSync(unitDir);
  const config = PLATFORMS[platform];
  if (!config) return false;

  const asmName = config.getAsmName(gameSlug);
  return files.some(f => f === `${asmName}.asm`);
}

// Check if screenshot exists
function hasScreenshot(platform, gameSlug, unitNumber) {
  const screenshotPath = join(
    imagesDir,
    platform,
    gameSlug,
    `unit-${String(unitNumber).padStart(2, '0')}`,
    'screenshot.png'
  );
  return existsSync(screenshotPath);
}

// Generate screenshot for a unit
function generateScreenshot(unit, options) {
  const { platform, gameSlug, unitNumber } = unit;
  const config = PLATFORMS[platform];

  if (!config) {
    console.log(`  Skipping: Unknown platform ${platform}`);
    return false;
  }

  const unitPadded = String(unitNumber).padStart(2, '0');
  const asmName = config.getAsmName(gameSlug);
  const unitDir = join(codeSamplesDir, platform, gameSlug, `unit-${unitPadded}`);
  const outputDir = join(imagesDir, platform, gameSlug, `unit-${unitPadded}`);
  const outputPath = join(outputDir, 'screenshot.png');

  // Ensure output directory exists
  if (!options.dryRun && !existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  let cmd;

  if (platform === 'commodore-64') {
    cmd = [
      'docker', 'run', '--rm',
      '-v', `${codeSamplesDir}:/code-samples`,
      '-v', `${imagesDir}:/images`,
      '-v', config.romsMount,
      '-v', config.scriptsMount,
      '-w', `/code-samples/${platform}/${gameSlug}/unit-${unitPadded}`,
      config.docker,
      'bash', config.screenshotScript,
      `${asmName}.asm`,
      `/images/${platform}/${gameSlug}/unit-${unitPadded}/screenshot.png`
    ];
  } else if (platform === 'sinclair-zx-spectrum') {
    const snaPath = `/code-samples/${platform}/${gameSlug}/unit-${unitPadded}/${asmName}.sna`;
    const imgPath = `/images/${platform}/${gameSlug}/unit-${unitPadded}/screenshot.png`;
    cmd = [
      'docker', 'run', '--rm',
      '-v', `${codeSamplesDir}:/code-samples`,
      '-v', `${imagesDir}:/images`,
      config.docker,
      config.screenshotCmd, snaPath, imgPath, '--wait', '1'
    ];
  } else if (platform === 'commodore-amiga') {
    const adfPath = `/code-samples/${platform}/${gameSlug}/unit-${unitPadded}/${asmName}.adf`;
    const imgPath = `/images/${platform}/${gameSlug}/unit-${unitPadded}/screenshot.png`;
    cmd = [
      'docker', 'run', '--rm', '--entrypoint=',
      '-v', `${codeSamplesDir}:/code-samples`,
      '-v', `${imagesDir}:/images`,
      '-v', config.romsMount,
      '-v', config.scriptsMount,
      config.docker,
      '/bin/bash', '-c', `${config.screenshotScript} ${adfPath} ${imgPath} --wait 12`
    ];
  } else if (platform === 'nintendo-entertainment-system') {
    const nesPath = `/code-samples/${platform}/${gameSlug}/unit-${unitPadded}/${asmName}.nes`;
    const imgPath = `/images/${platform}/${gameSlug}/unit-${unitPadded}/screenshot.png`;
    cmd = [
      'docker', 'run', '--rm',
      '-v', `${codeSamplesDir}:/code-samples`,
      '-v', `${imagesDir}:/images`,
      config.docker,
      config.screenshotCmd, nesPath, imgPath, '--wait', '2', '--crop'
    ];
  }

  if (options.dryRun) {
    console.log(`  Would run: ${cmd.join(' ')}`);
    return true;
  }

  console.log(`  Running screenshot capture...`);
  try {
    const result = spawnSync(cmd[0], cmd.slice(1), {
      stdio: 'inherit',
      timeout: 60000
    });

    if (result.status === 0) {
      console.log(`  Created: ${outputPath}`);
      return true;
    } else {
      console.log(`  Failed with exit code ${result.status}`);
      return false;
    }
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  const options = parseArgs();

  console.log('Screenshot Generator');
  console.log('====================\n');

  if (options.dryRun) {
    console.log('DRY RUN MODE - No screenshots will be generated\n');
  }

  // Read all units
  const allUnits = readAllUnits();
  console.log(`Found ${allUnits.length} total units\n`);

  // Filter units
  let units = allUnits.filter(u => u.available);

  if (options.platform) {
    units = units.filter(u => u.platform === options.platform);
  }
  if (options.game) {
    units = units.filter(u => u.gameSlug === options.game);
  }
  if (options.unit !== null) {
    units = units.filter(u => u.unitNumber === options.unit);
  }

  console.log(`Processing ${units.length} available units\n`);

  let generated = 0;
  let skipped = 0;
  let noCode = 0;
  let failed = 0;

  for (const unit of units) {
    const { platform, gameSlug, unitNumber, title } = unit;
    const unitPadded = String(unitNumber).padStart(2, '0');

    console.log(`${platform}/${gameSlug}/unit-${unitPadded}: ${title}`);

    // Check if code sample exists
    if (!hasCodeSample(platform, gameSlug, unitNumber)) {
      console.log(`  Skipping: No code sample found`);
      noCode++;
      continue;
    }

    // Check if screenshot already exists
    if (!options.force && hasScreenshot(platform, gameSlug, unitNumber)) {
      console.log(`  Skipping: Screenshot exists (use --force to regenerate)`);
      skipped++;
      continue;
    }

    // Generate screenshot
    if (generateScreenshot(unit, options)) {
      generated++;
    } else {
      failed++;
    }
  }

  console.log('\n====================');
  console.log(`Summary:`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Skipped (exists): ${skipped}`);
  console.log(`  Skipped (no code): ${noCode}`);
  console.log(`  Failed: ${failed}`);
}

main();
