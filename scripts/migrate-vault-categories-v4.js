#!/usr/bin/env node

/**
 * Migrate vault entries to distribution and communities categories
 * Also move some entries to techniques and phenomena
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VAULT_DIR = path.join(__dirname, '../src/content/vault');

// Entries to migrate
const MIGRATIONS = {
  // Distribution: culture → distribution
  'abandonware.mdx': { from: 'culture', to: 'distribution' },
  'budget-games.mdx': { from: 'culture', to: 'distribution' },
  'cover-tapes.mdx': { from: 'culture', to: 'distribution' },
  'magazine-cover-disks.mdx': { from: 'culture', to: 'distribution' },
  'mail-trading.mdx': { from: 'culture', to: 'distribution' },
  'type-in-listings.mdx': { from: 'culture', to: 'distribution' },
  'shareware.mdx': { from: 'culture', to: 'distribution' },
  'piracy.mdx': { from: 'culture', to: 'distribution' },

  // Communities: culture → communities
  'bbs-scene.mdx': { from: 'culture', to: 'communities' },
  'bbs-culture.mdx': { from: 'culture', to: 'communities' },
  'chiptune-scene.mdx': { from: 'culture', to: 'communities' },
  'chiptune.mdx': { from: 'culture', to: 'communities' },
  'crack-intros.mdx': { from: 'culture', to: 'communities' },
  'cracking-scene.mdx': { from: 'culture', to: 'communities' },
  'demo-parties.mdx': { from: 'culture', to: 'communities' },
  'demo-scene-101.mdx': { from: 'culture', to: 'communities' },
  'demo-scene.mdx': { from: 'culture', to: 'communities' },
  'esports-origins.mdx': { from: 'culture', to: 'communities' },
  'esports.mdx': { from: 'culture', to: 'communities' },
  'fan-translations.mdx': { from: 'culture', to: 'communities' },
  'modding.mdx': { from: 'culture', to: 'communities' },
  'speedrunning.mdx': { from: 'culture', to: 'communities' },
  'total-conversions.mdx': { from: 'culture', to: 'communities' },
  'lan-parties.mdx': { from: 'culture', to: 'communities' },

  // Techniques: culture → techniques
  'copy-protection.mdx': { from: 'culture', to: 'techniques' },

  // Phenomena: culture → phenomena
  'bedroom-coder.mdx': { from: 'culture', to: 'phenomena' },
  'crpg-renaissance.mdx': { from: 'culture', to: 'phenomena' },
  'rpg-golden-age.mdx': { from: 'culture', to: 'phenomena' },
};

// Create directories if needed
const NEW_CATEGORIES = ['distribution', 'communities'];

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
    /^(category:\s*["']?)([\w-]+)(["']?)$/m,
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
  console.log('Vault Category Migration v4 (distribution, communities)');
  console.log('========================================================\n');

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
