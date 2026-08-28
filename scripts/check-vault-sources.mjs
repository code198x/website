#!/usr/bin/env node
// How much of what this Vault says is cited, and what to ground next.
//
// Every entry carries dated frontmatter — released, founded, introduced — and
// those are the claims a reader is most likely to repeat and least able to
// check. This counts how many of them have a source behind them, and ranks what
// is left by how far the error would travel if it were wrong.
//
// It reports; it does not fail. Grounding is a long job and a red build helps
// nobody. `--queue N` prints the next N entries worth working on.
//
//   node scripts/check-vault-sources.mjs
//   node scripts/check-vault-sources.mjs --queue 20

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const VAULT = 'src/content/vault';
const args = process.argv.slice(2);
const qi = args.indexOf('--queue');
const QUEUE = qi >= 0 ? Number(args[qi + 1] ?? 15) : 0;

const DATED = ['released', 'founded', 'introduced', 'emerged', 'originated', 'born'];
const LINK = /\]\(\/vault\/([a-z0-9-]+\/[a-z0-9-]+)\)/g;

const entries = [];
const inbound = new Map();

for (const cat of readdirSync(VAULT)) {
  const dir = join(VAULT, cat);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.mdx')) continue;
    const ref = `${cat}/${file.slice(0, -4)}`;
    const text = readFileSync(join(dir, file), 'utf8');
    const fm = text.split('---')[1] ?? '';
    const claims = DATED.filter((f) => new RegExp(`^${f}:\\s*\\d{4}\\s*$`, 'm').test(fm));
    // Which dated fields actually have evidence, rather than whether the entry
    // has a sources block at all: an entry can cite its founding and say nothing
    // about how it ended.
    const sourced = claims.filter((f) => new RegExp(`^  ${f}:\\s*$`, 'm').test(fm));
    entries.push({ ref, cat, claims, sourced });
    for (const m of text.matchAll(LINK)) {
      if (m[1] !== ref) inbound.set(m[1], (inbound.get(m[1]) ?? 0) + 1);
    }
  }
}

const withClaims = entries.filter((e) => e.claims.length);
const totalClaims = withClaims.reduce((n, e) => n + e.claims.length, 0);
const totalSourced = withClaims.reduce((n, e) => n + e.sourced.length, 0);
const fullyCited = withClaims.filter((e) => e.sourced.length === e.claims.length).length;

console.log(`\nEntries: ${entries.length}`);
console.log(`  making a dated claim   ${withClaims.length}`);
console.log(`  every claim cited      ${fullyCited}`);
console.log(`Dated claims: ${totalClaims}`);
console.log(`  cited                  ${totalSourced}  (${Math.round((100 * totalSourced) / totalClaims)}%)`);
console.log(`  uncited                ${totalClaims - totalSourced}\n`);

const byCat = new Map();
for (const e of withClaims) {
  const c = byCat.get(e.cat) ?? { n: 0, claims: 0, sourced: 0 };
  c.n++; c.claims += e.claims.length; c.sourced += e.sourced.length;
  byCat.set(e.cat, c);
}
console.log(`  ${'category'.padEnd(14)} ${'entries'.padStart(7)} ${'claims'.padStart(7)} ${'cited'.padStart(6)}`);
for (const [cat, c] of [...byCat].sort((a, b) => b[1].claims - a[1].claims)) {
  console.log(`  ${cat.padEnd(14)} ${String(c.n).padStart(7)} ${String(c.claims).padStart(7)} ${String(c.sourced).padStart(6)}`);
}

if (QUEUE) {
  // Rank by reach, not by count. An uncited claim on an entry nothing links to
  // is a smaller problem than the same claim on one that 150 entries lean on.
  const queue = withClaims
    .filter((e) => e.sourced.length < e.claims.length)
    .map((e) => ({ ...e, reach: inbound.get(e.ref) ?? 0 }))
    .sort((a, b) => b.reach - a.reach)
    .slice(0, QUEUE);
  console.log(`\nNext ${queue.length}, ranked by how far an error would travel:\n`);
  for (const e of queue) {
    const missing = e.claims.filter((c) => !e.sourced.includes(c));
    console.log(`  ${String(e.reach).padStart(4)} inbound  ${e.ref.padEnd(40)} uncited: ${missing.join(', ')}`);
  }
}
console.log();
