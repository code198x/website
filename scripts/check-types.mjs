#!/usr/bin/env node
// Type-check the site with `astro check` and fail on any error that is not in
// scripts/type-baseline.json. The baseline holds the errors that predate this
// check; it may only shrink. Fixing one without removing it fails too, so the
// list stays true. New code, including the layout primitives' typed props, is
// checked in full.
//
// Usage: node scripts/check-types.mjs            (part of npm run check)
//        node scripts/check-types.mjs --update   (rewrite the baseline; only
//                                                 after fixing errors)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const baselineFile = path.join(root, 'scripts/type-baseline.json');
const update = process.argv.includes('--update');

const run = spawnSync('npx', ['astro', 'check', '--minimumSeverity', 'error'], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
  maxBuffer: 64 * 1024 * 1024,
});
const output = `${run.stdout}${run.stderr}`.replace(/\x1b\[[0-9;]*m/g, '');
const summary = output.match(/- (\d+) errors?/);
if (!summary) {
  // No result line means astro check itself failed to run: that must not pass.
  console.error(output.slice(-4000));
  console.error('astro check produced no result.');
  process.exit(2);
}

// An error is its file, code and first message line. Line numbers are left
// out so unrelated edits above an old error do not count as a new one.
const current = {};
for (const [, file, code, message] of output.matchAll(/^(\S+):\d+:\d+ - error (ts\(\d+\)): (.*)$/gm)) {
  const key = `${file} ${code} ${message.trim()}`;
  current[key] = (current[key] ?? 0) + 1;
}
const total = Object.values(current).reduce((sum, n) => sum + n, 0);
if (total !== Number(summary[1])) {
  console.error(`Parsed ${total} errors but astro check reported ${summary[1]}; the output format has changed.`);
  process.exit(2);
}

if (update) {
  const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(baselineFile, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`Baseline rewritten: ${total} errors.`);
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
const added = [];
const fixed = [];
for (const key of new Set([...Object.keys(current), ...Object.keys(baseline)])) {
  const now = current[key] ?? 0;
  const before = baseline[key] ?? 0;
  if (now > before) added.push(`${now - before}× ${key}`);
  if (now < before) fixed.push(`${before - now}× ${key}`);
}
if (added.length) {
  console.error(`New type errors (${added.length}):\n${added.map(line => `  ${line}`).join('\n')}`);
  console.error('\nFull astro check output:\n' + output.split('\n').filter(line => / - error /.test(line)).join('\n'));
}
if (fixed.length) {
  console.error(`Fixed, so remove them from scripts/type-baseline.json (node scripts/check-types.mjs --update):\n${fixed.map(line => `  ${line}`).join('\n')}`);
}
if (added.length || fixed.length) process.exit(1);
console.log(`astro check: ${total} errors, all in the baseline.`);
