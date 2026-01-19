#!/usr/bin/env node

/**
 * Migrate vault entries to tools, genres, and emulators categories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VAULT_DIR = path.join(__dirname, '../src/content/vault');

// Entries to migrate
const MIGRATIONS = {
  // Tools: culture → tools
  'protracker.mdx': { from: 'culture', to: 'tools' },
  'famitracker.mdx': { from: 'culture', to: 'tools' },
  'hvsc.mdx': { from: 'culture', to: 'tools' },
  'gamebase.mdx': { from: 'culture', to: 'tools' },
  'world-of-spectrum.mdx': { from: 'culture', to: 'tools' },

  // Emulators: culture → emulators
  'vice-emulator.mdx': { from: 'culture', to: 'emulators' },
  'emulation.mdx': { from: 'culture', to: 'emulators' },

  // Genres: culture → genres
  'jrpg.mdx': { from: 'culture', to: 'genres' },
  'western-rpg.mdx': { from: 'culture', to: 'genres' },
  'console-rpg.mdx': { from: 'culture', to: 'genres' },
  'roguelike.mdx': { from: 'culture', to: 'genres' },
  'immersive-sim.mdx': { from: 'culture', to: 'genres' },
  'survival-horror.mdx': { from: 'culture', to: 'genres' },
  'horror-games.mdx': { from: 'culture', to: 'genres' },
  'rts-genre.mdx': { from: 'culture', to: 'genres' },
  'simulation-games.mdx': { from: 'culture', to: 'genres' },
  'sports-games.mdx': { from: 'culture', to: 'genres' },
  'music-games.mdx': { from: 'culture', to: 'genres' },
  'puzzle-game-design.mdx': { from: 'culture', to: 'genres' },
  'fighting-game-community.mdx': { from: 'culture', to: 'genres' },
  'portable-gaming.mdx': { from: 'culture', to: 'genres' },
  'golden-age-arcade.mdx': { from: 'culture', to: 'genres' },
  'arcade-culture.mdx': { from: 'culture', to: 'genres' },
};

// Create directories
const NEW_CATEGORIES = ['tools', 'genres', 'emulators'];

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
  console.log('Vault Category Migration v3 (tools, genres, emulators)');
  console.log('======================================================\n');

  // Create directories
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
