#!/usr/bin/env node
/**
 * Report Vault entries that look like the same subject written twice.
 *
 * Three earlier passes missed duplicates, each for the same reason: they
 * compared NAMES. The first compared entries within a category, so
 * culture/arcade-ports and genres/arcade-conversion survived it. A later scan
 * compared titles, and its normaliser stripped digits, so "Commodore 1541" and
 * "Commodore 64" looked identical while genuine pairs did not.
 *
 * Names are the wrong signal, because these entries are paraphrases rather than
 * copies. bbs-culture and bbs-scene say the same things in different words, and
 * share almost no exact phrasing: a 5-gram shingle scan over all 1,408 entries
 * returned exactly one pair, and that pair was a real relationship.
 *
 * So this weights terms by rarity — TF-IDF, cosine between entries — which is
 * what catches a paraphrase. It found dune-2 against dune-ii, lucasfilm-games
 * against lucasarts, and epic-megagames against epic-games, none of which any
 * name-based check had reported.
 *
 * ⚠ This REPORTS, it does not fail the build, and that is deliberate. A high
 * score means "about the same things", which is also true of a person and the
 * company they founded, or a company and its best-known game. Around 600 pairs
 * score above 0.30 and most are legitimate. The output is a reading list.
 *
 * The tell for a real duplicate is agreement on identity, not similarity of
 * subject: both LucasArts entries claimed founded 1982 and ended 2013, and both
 * Epic entries claimed founded 1991. Two entries covering one lifespan are one
 * entry.
 *
 *   node scripts/find-vault-duplicates.mjs [minCosine]
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VAULT = join(ROOT, 'src/content/vault');
const MIN = Number(process.argv[2] ?? 0.45);

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.mdx')) yield p;
  }
}

const docs = [];
for (const f of walk(VAULT)) {
  const raw = readFileSync(f, 'utf8');
  const parts = raw.split('---');
  const front = parts[1] ?? '';
  let body = parts.slice(2).join('---');
  body = body.replace(/```[\s\S]*?```/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  const terms = body.toLowerCase().match(/\b[a-z][a-z0-9'-]{2,}\b|\b(?:19|20)\d\d\b/g) ?? [];
  const tf = new Map();
  for (const t of terms) tf.set(t, (tf.get(t) ?? 0) + 1);
  const life = ['founded', 'ended', 'born', 'died', 'released']
    .map((k) => front.match(new RegExp(`^${k}:\\s*(\\d{4})`, 'm'))?.[1])
    .filter(Boolean).join('-');
  docs.push({ id: relative(VAULT, f).slice(0, -4), tf, life });
}

const N = docs.length;
const df = new Map();
for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);

for (const d of docs) {
  const v = new Map();
  for (const [t, n] of d.tf) {
    const f = df.get(t);
    if (f < 2 || f > N * 0.08) continue;            // typos, and boilerplate
    v.set(t, (1 + Math.log(n)) * Math.log(N / f));
  }
  let norm = 0;
  for (const x of v.values()) norm += x * x;
  norm = Math.sqrt(norm) || 1;
  for (const [t, x] of v) v.set(t, x / norm);
  d.v = v;
  d.top = [...v].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([t]) => t);
}

// Only compare entries that share a distinctive term, or this is O(n²) on 1,400 docs.
const inv = new Map();
for (const d of docs) for (const t of d.top) {
  if (!inv.has(t)) inv.set(t, []);
  inv.get(t).push(d);
}
const seen = new Set(); const hits = [];
for (const list of inv.values()) {
  if (list.length > 25) continue;
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const [a, b] = [list[i], list[j]];
    const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    let s = 0;
    for (const [t, x] of a.v) s += x * (b.v.get(t) ?? 0);
    if (s >= MIN) hits.push({ s, a, b });
  }
}
hits.sort((x, y) => y.s - x.s);

console.log(`\nVault duplicates: ${docs.length} entries, ${hits.length} pairs at cosine ≥ ${MIN}.\n`);
for (const { s, a, b } of hits) {
  const same = a.life && a.life === b.life ? '  ⚠ SAME LIFESPAN' : '';
  console.log(`  ${s.toFixed(3)}  ${a.id.padEnd(38)} ${b.id.padEnd(38)}${same}`);
}
console.log(
  `\n  A high score means "about the same things", which a person and their\n` +
  `  company also are. Pairs marked SAME LIFESPAN agree on identity as well as\n` +
  `  subject, and are the ones worth opening first.\n`
);
