#!/usr/bin/env node

/**
 * Migrate existing vault entries to new categories (magazines, books, phenomena, events, groups)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VAULT_DIR = path.join(__dirname, '../src/content/vault');

// Entries to migrate: { filename: { from: category, to: category } }
const MIGRATIONS = {
  // Magazines: culture → magazines
  'ace-magazine.mdx': { from: 'culture', to: 'magazines' },
  'amiga-power.mdx': { from: 'culture', to: 'magazines' },
  'commodore-format.mdx': { from: 'culture', to: 'magazines' },
  'computer-gaming-world.mdx': { from: 'culture', to: 'magazines' },
  'crash-magazine.mdx': { from: 'culture', to: 'magazines' },
  'retro-gamer.mdx': { from: 'culture', to: 'magazines' },
  'sinclair-user.mdx': { from: 'culture', to: 'magazines' },
  'the-one.mdx': { from: 'culture', to: 'magazines' },
  'your-sinclair.mdx': { from: 'culture', to: 'magazines' },
  'zzap64.mdx': { from: 'culture', to: 'magazines' },
  'scene-diskmags.mdx': { from: 'culture', to: 'magazines' },

  // Books: culture → books
  'usborne-computing-books.mdx': { from: 'culture', to: 'books' },

  // Phenomena: culture → phenomena
  '1983-crash.mdx': { from: 'culture', to: 'phenomena' },
  'video-game-crash.mdx': { from: 'culture', to: 'phenomena' },
  'console-wars.mdx': { from: 'culture', to: 'phenomena' },
  'pokemon-phenomenon.mdx': { from: 'culture', to: 'phenomena' },
  'tetris-legal-battles.mdx': { from: 'culture', to: 'phenomena' },
  'sega-vs-nintendo.mdx': { from: 'culture', to: 'phenomena' },
  'nintendo-seal.mdx': { from: 'culture', to: 'phenomena' },

  // Events: culture → events
  'evo.mdx': { from: 'culture', to: 'events' },
  'twin-galaxies.mdx': { from: 'culture', to: 'events' },

  // Groups: culture → groups
  'crest.mdx': { from: 'culture', to: 'groups' },
};

// Files to delete (duplicates)
const DELETIONS = [
  // fairlight-group.mdx is duplicate of groups/fairlight.mdx
  { path: 'culture/fairlight-group.mdx', reason: 'Duplicate of groups/fairlight.mdx' },
];

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

function deleteEntry(deletion) {
  const fullPath = path.join(VAULT_DIR, deletion.path);

  if (!fs.existsSync(fullPath)) {
    console.log(`  SKIP: ${deletion.path} not found`);
    return false;
  }

  fs.unlinkSync(fullPath);
  console.log(`  DELETED: ${deletion.path} (${deletion.reason})`);
  return true;
}

function main() {
  console.log('Vault Category Migration v2');
  console.log('===========================\n');

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

  // Delete duplicates
  console.log('Removing duplicates...');
  let deleted = 0;

  for (const deletion of DELETIONS) {
    if (deleteEntry(deletion)) {
      deleted++;
    }
  }

  console.log('');
  console.log(`Done: ${migrated} migrated, ${skipped} skipped, ${deleted} deleted`);
}

main();
