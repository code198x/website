#!/usr/bin/env node
/** Import only a generated public projection; keep existing data on failure. */
import { readFile, writeFile, rename, rm } from 'node:fs/promises';
import { randomUUID, createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { validateProgressSnapshot } from '../src/lib/project-progress.mjs';

export async function importProgress(source, destination) {
  const bytes = await readFile(source);
  validateProgressSnapshot(JSON.parse(bytes.toString('utf8')));
  const temp = `${destination}.${randomUUID()}.tmp`;
  try {
    await writeFile(temp, bytes, { flag: 'wx' });
    await rename(temp, destination);
  } finally {
    await rm(temp, { force: true });
  }
  return createHash('sha256').update(bytes).digest('hex');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = process.argv[2];
  if (!source || process.argv.length !== 3) {
    console.error('Usage: node scripts/import-project-progress.mjs <generated-overview.json>');
    process.exitCode = 1;
  } else {
    try {
      const destination = fileURLToPath(new URL('../src/data/project-progress.json', import.meta.url));
      console.log(`Imported reviewed public snapshot: ${await importProgress(source, destination)}`);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
