#!/usr/bin/env node

/**
 * Migrate vault entries to new categories (groups, events, demos, magazines, books, phenomena)
 *
 * This script:
 * 1. Creates directories for new categories
 * 2. Moves entries to correct categories
 * 3. Updates the category field in frontmatter
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VAULT_DIR = path.join(__dirname, '../src/content/vault');

// Entries to migrate: { filename: { from: category, to: category } }
const MIGRATIONS = {
  // Scene groups: companies → groups
  'fairlight.mdx': { from: 'companies', to: 'groups' },
  'razor-1911.mdx': { from: 'companies', to: 'groups' },
  'triad.mdx': { from: 'companies', to: 'groups' },
  'future-crew.mdx': { from: 'companies', to: 'groups' },
  'farbrausch.mdx': { from: 'companies', to: 'groups' },

  // Demo parties: culture → events
  'assembly-party.mdx': { from: 'culture', to: 'events' },
  'revision-party.mdx': { from: 'culture', to: 'events' },
  'the-party.mdx': { from: 'culture', to: 'events' },

  // Demos: games → demos
  'second-reality.mdx': { from: 'games', to: 'demos' },
  'state-of-the-art.mdx': { from: 'games', to: 'demos' },
  'edge-of-disgrace.mdx': { from: 'games', to: 'demos' },
};

// New category directories to create
const NEW_CATEGORIES = ['groups', 'events', 'demos', 'magazines', 'books', 'phenomena'];

function ensureDirectories() {
  for (const cat of NEW_CATEGORIES) {
    const dir = path.join(VAULT_DIR, cat);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${cat}/`);
    }
  }
}

function migrateEntry(filename, migration) {
  const srcPath = path.join(VAULT_DIR, migration.from, filename);
  const destPath = path.join(VAULT_DIR, migration.to, filename);

  if (!fs.existsSync(srcPath)) {
    console.log(`  SKIP: ${filename} not found in ${migration.from}/`);
    return false;
  }

  // Read file content
  let content = fs.readFileSync(srcPath, 'utf8');

  // Update category in frontmatter
  content = content.replace(
    /^(category:\s*["']?)(\w+)(["']?)$/m,
    `$1${migration.to}$3`
  );

  // Write to new location
  fs.writeFileSync(destPath, content);

  // Remove from old location
  fs.unlinkSync(srcPath);

  console.log(`  MOVED: ${migration.from}/${filename} → ${migration.to}/${filename}`);
  return true;
}

function main() {
  console.log('Vault Category Migration');
  console.log('========================\n');

  // Create new category directories
  console.log('Creating directories...');
  ensureDirectories();
  console.log('');

  // Migrate entries
  console.log('Migrating entries...');
  let migrated = 0;
  let skipped = 0;

  for (const [filename, migration] of Object.entries(MIGRATIONS)) {
    if (migrateEntry(filename, migration)) {
      migrated++;
    } else {
      skipped++;
    }
  }

  console.log('');
  console.log(`Done: ${migrated} migrated, ${skipped} skipped`);
}

main();
