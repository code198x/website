#!/usr/bin/env node
// Compare two css-snapshot.mjs directories and report every computed property
// that differs. Exits 1 on any difference, so a restructure step that should
// change nothing can be gated on it.
//
// Usage: node scripts/css-diff.mjs <before-dir> <after-dir> [--limit <n>] [--removed <names>] [--added <names>]
//
// --removed takes a comma-separated list of custom properties the change
// deletes (`--color-surface,--space-4`). Their disappearing from an element
// is not reported; any other change to them is, and so is every real
// property they used to feed. --added is the same for custom properties the
// change introduces: their appearing is not reported.
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

const [before, after, ...rest] = process.argv.slice(2);
const option = name => { const i = rest.indexOf(name); return i === -1 ? undefined : rest[i + 1]; };
if (!before || !after) {
  console.error('Usage: node scripts/css-diff.mjs <before-dir> <after-dir> [--limit <n>] [--removed <names>] [--added <names>]');
  process.exit(2);
}
const limit = Number(option('--limit') ?? 20);
const removed = new Set((option('--removed') ?? '').split(',').filter(Boolean));
const added = new Set((option('--added') ?? '').split(',').filter(Boolean));

const read = async (dir, file) => JSON.parse(gunzipSync(await fs.readFile(path.join(dir, file))).toString());
const files = async dir => (await fs.readdir(dir)).filter(name => name.endsWith('.json.gz')).sort();

const beforeFiles = await files(before);
const afterFiles = await files(after);
let total = 0;
const unmatched = [...beforeFiles.filter(f => !afterFiles.includes(f)), ...afterFiles.filter(f => !beforeFiles.includes(f))];
for (const file of unmatched) console.log(`${file}: only in one snapshot`);
total += unmatched.length;
if (beforeFiles.length === 0) {
  console.error(`${before} holds no snapshots`);
  process.exit(2);
}

for (const file of beforeFiles.filter(f => afterFiles.includes(f))) {
  const a = (await read(before, file)).elements;
  const b = (await read(after, file)).elements;
  const lines = [];
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (!(key in a) || !(key in b)) {
      lines.push(`  ${key}: element ${key in a ? 'removed' : 'added'}`);
      continue;
    }
    for (const name of new Set([...Object.keys(a[key]), ...Object.keys(b[key])])) {
      if (removed.has(name) && b[key][name] === undefined) continue;
      if (added.has(name) && a[key][name] === undefined) continue;
      if (a[key][name] !== b[key][name]) {
        lines.push(`  ${key} ${name}: ${a[key][name] ?? '(default)'} → ${b[key][name] ?? '(default)'}`);
      }
    }
  }
  if (lines.length > 0) {
    console.log(`${file.replace('.json.gz', '')}: ${lines.length} differences`);
    for (const line of lines.slice(0, limit)) console.log(line);
    if (lines.length > limit) console.log(`  … ${lines.length - limit} more`);
  }
  total += lines.length;
}

console.log(total === 0 ? `No differences across ${beforeFiles.length} snapshots.` : `${total} differences.`);
process.exit(total === 0 ? 0 : 1);
