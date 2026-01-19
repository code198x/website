#!/usr/bin/env node

/**
 * Migrate vault entries from generic `years` field to category-specific date fields.
 *
 * Usage:
 *   node scripts/migrate-vault-years.js --dry-run    # Preview changes
 *   node scripts/migrate-vault-years.js              # Apply changes
 *
 * Conversions:
 *   - people: years → born, died
 *   - companies: years → founded, dissolved
 *   - games: years → released
 *   - techniques: years → originated, deprecated
 *   - culture: years → emerged, ended
 *   - hardware/systems: years → introduced, discontinued
 *
 * If the end year is 2024 (the "present day" placeholder used previously),
 * the end field is omitted (null = still active/alive/ongoing).
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VAULT_DIR = join(__dirname, '..', 'src', 'content', 'vault');
const DRY_RUN = process.argv.includes('--dry-run');
const PRESENT_YEAR = 2024; // Year used as "present day" placeholder

// Category to field mapping
const FIELD_MAP = {
  people: { start: 'born', end: 'died' },
  companies: { start: 'founded', end: 'dissolved' },
  games: { start: 'released', end: null }, // Games only have release year
  techniques: { start: 'originated', end: 'deprecated' },
  culture: { start: 'emerged', end: 'ended' },
  hardware: { start: 'introduced', end: 'discontinued' },
  systems: { start: 'introduced', end: 'discontinued' },
};

async function getAllMdxFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllMdxFiles(fullPath)));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = match[1];
  const body = content.slice(match[0].length);

  return { frontmatter, body, fullMatch: match[0] };
}

function extractCategory(frontmatter) {
  const match = frontmatter.match(/^category:\s*["']?(\w+)["']?\s*$/m);
  return match ? match[1] : null;
}

function extractYears(frontmatter) {
  // Match years: [1980, 2024] or years: [1980, null] patterns
  const match = frontmatter.match(/^years:\s*\[(.*?)\]\s*$/m);
  if (!match) return null;

  const yearsStr = match[1];
  const years = yearsStr.split(',').map((y) => {
    const trimmed = y.trim();
    if (trimmed === 'null') return null;
    const num = parseInt(trimmed, 10);
    return isNaN(num) ? null : num;
  });

  return years.length > 0 ? years : null;
}

function convertYearsToFields(category, years) {
  const mapping = FIELD_MAP[category];
  if (!mapping || !years || years.length === 0) return null;

  const result = {};
  const startYear = years[0];
  const endYear = years.length > 1 ? years[years.length - 1] : null;

  // Start field (born, founded, released, etc.)
  if (startYear !== null) {
    result[mapping.start] = startYear;
  }

  // End field (died, dissolved, etc.) - only if mapping has an end field
  if (mapping.end && endYear !== null) {
    // If end year equals PRESENT_YEAR, omit it (null = ongoing)
    if (endYear !== PRESENT_YEAR) {
      result[mapping.end] = endYear;
    }
    // else: omit the field entirely (active/alive/ongoing)
  }

  return Object.keys(result).length > 0 ? result : null;
}

function updateFrontmatter(frontmatter, newFields) {
  // Remove the years line
  let updated = frontmatter.replace(/^years:\s*\[.*?\]\s*\n?/m, '');

  // Find where to insert new fields (after tags, or at end of frontmatter)
  const lines = updated.split('\n');
  const tagsIndex = lines.findIndex((l) => l.startsWith('tags:'));
  const insertIndex = tagsIndex !== -1 ? tagsIndex + 1 : lines.length;

  // Create new field lines
  const newLines = Object.entries(newFields).map(([key, value]) => {
    return `${key}: ${value}`;
  });

  // Insert new fields
  lines.splice(insertIndex, 0, ...newLines);

  return lines.join('\n');
}

async function migrateFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    return { skipped: true, reason: 'No frontmatter found' };
  }

  const category = extractCategory(parsed.frontmatter);
  if (!category) {
    return { skipped: true, reason: 'No category found' };
  }

  const years = extractYears(parsed.frontmatter);
  if (!years) {
    return { skipped: true, reason: 'No years field' };
  }

  const newFields = convertYearsToFields(category, years);
  if (!newFields) {
    return { skipped: true, reason: 'Could not convert years' };
  }

  const updatedFrontmatter = updateFrontmatter(parsed.frontmatter, newFields);
  const newContent = `---\n${updatedFrontmatter}\n---${parsed.body}`;

  if (!DRY_RUN) {
    await writeFile(filePath, newContent, 'utf-8');
  }

  return {
    migrated: true,
    category,
    oldYears: years,
    newFields,
  };
}

async function main() {
  console.log(`\nVault Years Migration Script`);
  console.log(`============================`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);
  console.log(`Vault directory: ${VAULT_DIR}\n`);

  const files = await getAllMdxFiles(VAULT_DIR);
  console.log(`Found ${files.length} MDX files\n`);

  const stats = {
    migrated: 0,
    skipped: 0,
    errors: 0,
    byCategory: {},
  };

  for (const file of files) {
    const relativePath = relative(VAULT_DIR, file);
    try {
      const result = await migrateFile(file);

      if (result.migrated) {
        stats.migrated++;
        stats.byCategory[result.category] = (stats.byCategory[result.category] || 0) + 1;
        console.log(`✓ ${relativePath}`);
        console.log(`  ${result.category}: years ${JSON.stringify(result.oldYears)} → ${JSON.stringify(result.newFields)}`);
      } else {
        stats.skipped++;
        // Only log skips that aren't "no years field" (most files)
        if (result.reason !== 'No years field') {
          console.log(`○ ${relativePath} (${result.reason})`);
        }
      }
    } catch (error) {
      stats.errors++;
      console.error(`✗ ${relativePath}: ${error.message}`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Migrated: ${stats.migrated}`);
  console.log(`Skipped:  ${stats.skipped}`);
  console.log(`Errors:   ${stats.errors}`);

  if (Object.keys(stats.byCategory).length > 0) {
    console.log(`\nBy category:`);
    for (const [cat, count] of Object.entries(stats.byCategory).sort()) {
      console.log(`  ${cat}: ${count}`);
    }
  }

  if (DRY_RUN && stats.migrated > 0) {
    console.log(`\nRun without --dry-run to apply changes.`);
  }
}

main().catch(console.error);
