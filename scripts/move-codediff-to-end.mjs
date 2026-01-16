#!/usr/bin/env node
/**
 * Move CodeDiff sections to the end of unit MDX files
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '../src/pages');

// Find all unit MDX files
function findUnitFiles(dir) {
  const results = [];
  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...findUnitFiles(fullPath));
    } else if (item.name.match(/^unit-\d+\.mdx$/)) {
      results.push(fullPath);
    }
  }
  return results;
}

// Process a single file
function processFile(filePath, dryRun = false) {
  let content = readFileSync(filePath, 'utf-8');

  // Check if file has CodeDiff
  if (!content.includes('<CodeDiff')) {
    return { changed: false, reason: 'no CodeDiff' };
  }

  // Extract the CodeDiff component with its "## What Changed" header
  // Pattern: ## What Changed\n\n<CodeDiff ... />\n\n (possibly followed by more content before next ##)
  const diffPattern = /\n## What Changed\n\n<CodeDiff[\s\S]*?\/>\n\n(?=##|$)/;
  const match = content.match(diffPattern);

  if (!match) {
    return { changed: false, reason: 'pattern not found' };
  }

  const diffSection = match[0];

  // Check if it's already at the end
  const afterDiff = content.slice(match.index + diffSection.length).trim();
  if (!afterDiff || afterDiff === '') {
    return { changed: false, reason: 'already at end' };
  }

  // Remove the diff section from its current location
  content = content.slice(0, match.index) + '\n' + content.slice(match.index + diffSection.length);

  // Clean up any double newlines
  content = content.replace(/\n{3,}/g, '\n\n');

  // Add the diff section at the end (before final newline)
  content = content.trimEnd() + '\n' + diffSection.trimEnd() + '\n';

  if (dryRun) {
    console.log(`Would update: ${filePath}`);
    return { changed: true };
  }

  writeFileSync(filePath, content);
  return { changed: true };
}

// Main
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-n');

  if (dryRun) {
    console.log('DRY RUN MODE\n');
  }

  const unitFiles = findUnitFiles(pagesDir);
  console.log(`Found ${unitFiles.length} unit files\n`);

  let changed = 0;
  let skipped = 0;

  for (const file of unitFiles) {
    const result = processFile(file, dryRun);
    if (result.changed) {
      changed++;
      if (!dryRun) console.log(`Updated: ${file.replace(pagesDir, '')}`);
    } else {
      skipped++;
    }
  }

  console.log(`\n==================`);
  console.log(`Changed: ${changed}`);
  console.log(`Skipped: ${skipped}`);
}

main();
