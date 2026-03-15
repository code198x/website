#!/usr/bin/env node

/**
 * Migrate MDX files from src/pages/ to src/content/pages/
 *
 * Strips computed frontmatter fields (layout, prevLesson, nextLesson,
 * totalUnits, system, gameName) that will be derived at render time
 * from the entry's path.
 *
 * Run: node scripts/migrate-pages.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const PAGES_DIR = 'src/pages';
const CONTENT_DIR = 'src/content/curriculum';
const DRY_RUN = process.argv.includes('--dry-run');

// Fields to strip from frontmatter (computed at render time)
const STRIP_FIELDS = new Set([
  'layout',
  'prevLesson',
  'nextLesson',
  'totalUnits',
  'system',
  'gameName',
]);

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: '', body: content, fields: {} };

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);

  // Parse YAML fields (simple line-by-line, handles multi-line arrays)
  const lines = frontmatterStr.split('\n');
  const keptLines = [];
  let skipping = false;

  for (const line of lines) {
    // Check if this is a top-level field (not indented, has a colon)
    const fieldMatch = line.match(/^(\w[\w-]*)\s*:/);
    if (fieldMatch) {
      const fieldName = fieldMatch[1];
      if (STRIP_FIELDS.has(fieldName)) {
        skipping = true;
        continue;
      }
      skipping = false;
    } else if (skipping) {
      // Continuation of a stripped field (indented line or array item)
      if (line.match(/^\s/) || line.match(/^$/)) {
        continue;
      }
      skipping = false;
    }

    if (!skipping) {
      keptLines.push(line);
    }
  }

  // Remove trailing empty lines from frontmatter
  while (keptLines.length > 0 && keptLines[keptLines.length - 1].trim() === '') {
    keptLines.pop();
  }

  return {
    frontmatter: keptLines.join('\n'),
    body,
  };
}

function findMdxFiles(dir) {
  const results = [];

  function walk(currentDir) {
    for (const entry of readdirSync(currentDir)) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith('.mdx')) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

// Find all MDX files in src/pages (excluding platform/track overview .astro files)
const mdxFiles = findMdxFiles(PAGES_DIR);

console.log(`Found ${mdxFiles.length} MDX files to migrate`);

let unitCount = 0;
let gameCount = 0;
let gettingStartedCount = 0;

for (const filePath of mdxFiles) {
  const relPath = relative(PAGES_DIR, filePath);
  const destPath = join(CONTENT_DIR, relPath);
  const content = readFileSync(filePath, 'utf-8');

  const { frontmatter, body } = parseFrontmatter(content);
  const newContent = `---\n${frontmatter}\n---${body}`;

  // Categorise
  const filename = filePath.split('/').pop();
  if (filename === 'getting-started.mdx') {
    gettingStartedCount++;
  } else if (filename === 'index.mdx') {
    gameCount++;
  } else if (filename.startsWith('unit-')) {
    unitCount++;
  }

  if (DRY_RUN) {
    console.log(`  [dry-run] ${relPath}`);
    // Show which fields would be stripped
    const stripped = [];
    for (const field of STRIP_FIELDS) {
      const regex = new RegExp(`^${field}\\s*:`, 'm');
      if (regex.test(content)) {
        stripped.push(field);
      }
    }
    if (stripped.length > 0) {
      console.log(`    Stripping: ${stripped.join(', ')}`);
    }
  } else {
    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, newContent, 'utf-8');
  }
}

console.log(`\nMigrated:`);
console.log(`  Getting started: ${gettingStartedCount}`);
console.log(`  Game indexes:    ${gameCount}`);
console.log(`  Units:           ${unitCount}`);
console.log(`  Total:           ${mdxFiles.length}`);

if (DRY_RUN) {
  console.log('\n(Dry run — no files written. Remove --dry-run to migrate.)');
}
