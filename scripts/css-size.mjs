#!/usr/bin/env node
// Measure the site's CSS source: every .css file under src/ plus the full
// contents of every <style> block in src/**/*.astro, at a git ref.
// The CSS restructure (docs/plans/2026-10-20-css-cascade-layers.md) records
// this after each step.
//
// Usage: node scripts/css-size.mjs [ref]   (default HEAD)
import { execFileSync } from 'node:child_process';

const ref = process.argv[2] ?? 'HEAD';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
let sheets = 0;
let blocks = 0;
for (const file of git('ls-tree', '-r', '--name-only', ref, 'src').split('\n')) {
  if (file.endsWith('.css')) sheets += Buffer.byteLength(git('show', `${ref}:${file}`));
  else if (file.endsWith('.astro')) {
    for (const [, css] of git('show', `${ref}:${file}`).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) blocks += Buffer.byteLength(css);
  }
}
console.log(`${ref}: ${sheets + blocks} bytes (${sheets} in stylesheets, ${blocks} in <style> blocks)`);
