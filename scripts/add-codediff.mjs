#!/usr/bin/env node
/**
 * Add CodeDiff components to unit MDX files
 * Shows what changed from the previous unit
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '../src/pages');
const codeSamplesDir = join(__dirname, '../../code-samples');

// Configuration for each game
const GAMES = [
  {
    platform: 'sinclair-zx-spectrum',
    track: 'assembly',
    slug: 'game-01-ink-war',
    asmFile: 'inkwar.asm',
    units: 16
  },
  {
    platform: 'commodore-64',
    track: 'assembly',
    slug: 'game-01-sid-symphony',
    asmFile: 'symphony.asm',
    units: 32
  },
  {
    platform: 'commodore-amiga',
    track: 'assembly',
    slug: 'game-01-signal',
    asmFile: 'signal.asm',
    units: 16
  },
  {
    platform: 'nintendo-entertainment-system',
    track: 'assembly',
    slug: 'game-01-neon-nexus',
    asmFile: 'nexus.asm',
    units: 16
  }
];

// Check if code samples exist for a unit
function codeSamplesExist(platform, slug, unitNum, asmFile) {
  const unitPadded = String(unitNum).padStart(2, '0');
  const path = join(codeSamplesDir, platform, slug, `unit-${unitPadded}`, asmFile);
  return existsSync(path);
}

// Process a single unit file
function processUnit(game, unitNum, dryRun = false) {
  const unitPadded = String(unitNum).padStart(2, '0');
  const prevPadded = String(unitNum - 1).padStart(2, '0');

  const mdxPath = join(pagesDir, game.platform, game.track, game.slug, `unit-${unitPadded}.mdx`);

  if (!existsSync(mdxPath)) {
    console.log(`  Skip: ${mdxPath} not found`);
    return false;
  }

  // Check if code samples exist
  if (!codeSamplesExist(game.platform, game.slug, unitNum, game.asmFile) ||
      !codeSamplesExist(game.platform, game.slug, unitNum - 1, game.asmFile)) {
    console.log(`  Skip: Code samples missing for unit ${unitNum} or ${unitNum - 1}`);
    return false;
  }

  let content = readFileSync(mdxPath, 'utf-8');

  // Check if CodeDiff already imported
  if (content.includes('import CodeDiff from')) {
    console.log(`  Skip: CodeDiff already imported in unit ${unitNum}`);
    return false;
  }

  // Add CodeDiff import after CodeFromFile import
  if (content.includes('import CodeFromFile from')) {
    content = content.replace(
      /import CodeFromFile from "[^"]+";/,
      `$&\nimport CodeDiff from "@components/CodeDiff.astro";`
    );
  } else {
    // Add both imports after frontmatter
    content = content.replace(
      /---\n\n/,
      `---\n\nimport CodeFromFile from "@components/CodeFromFile.astro";\nimport CodeDiff from "@components/CodeDiff.astro";\n\n`
    );
  }

  // Prepare the diff component
  const diffComponent = `<CodeDiff
  title="Unit ${unitNum - 1} → Unit ${unitNum}"
  before="${game.platform}/${game.slug}/unit-${prevPadded}/${game.asmFile}"
  after="${game.platform}/${game.slug}/unit-${unitPadded}/${game.asmFile}"
  context={3}
/>`;

  // Find where to insert the diff
  // Priority: after "## What Changed", or create one before main content sections

  if (content.includes('## What Changed')) {
    // Insert after "## What Changed" heading
    if (!content.includes('## What Changed\n\n<CodeDiff')) {
      content = content.replace(
        /## What Changed\n\n/,
        `## What Changed\n\n${diffComponent}\n\n`
      );
    }
  } else {
    // Find a good insertion point - after "## Run It" section, before next main section
    // Look for patterns like "## The ...", "## Understanding...", "## How..."
    const insertPatterns = [
      /\n## (?!Run It)([A-Z][^#\n]+)\n/,  // First H2 after "Run It"
    ];

    let inserted = false;
    for (const pattern of insertPatterns) {
      const match = content.match(pattern);
      if (match) {
        const insertPoint = match.index;
        content = content.slice(0, insertPoint) +
          `\n## What Changed\n\n${diffComponent}\n` +
          content.slice(insertPoint);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      // Fallback: insert before "## The Complete Code" if it exists
      if (content.includes('## The Complete Code')) {
        content = content.replace(
          '## The Complete Code',
          `## What Changed\n\n${diffComponent}\n\n## The Complete Code`
        );
      } else {
        console.log(`  Warning: Couldn't find insertion point for unit ${unitNum}`);
        return false;
      }
    }
  }

  if (dryRun) {
    console.log(`  Would update: unit-${unitPadded}.mdx`);
    return true;
  }

  writeFileSync(mdxPath, content);
  console.log(`  Updated: unit-${unitPadded}.mdx`);
  return true;
}

// Main
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-n');
  const gameFilter = args.find(a => a.startsWith('--game='))?.split('=')[1];

  if (dryRun) {
    console.log('DRY RUN MODE - No files will be modified\n');
  }

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const game of GAMES) {
    if (gameFilter && !game.slug.includes(gameFilter)) continue;

    console.log(`\n${game.platform}/${game.slug}:`);

    // Start from unit 2 (unit 1 has no previous unit to diff)
    for (let unit = 2; unit <= game.units; unit++) {
      if (processUnit(game, unit, dryRun)) {
        totalUpdated++;
      } else {
        totalSkipped++;
      }
    }
  }

  console.log(`\n===================`);
  console.log(`Updated: ${totalUpdated}`);
  console.log(`Skipped: ${totalSkipped}`);
}

main();
