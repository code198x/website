#!/usr/bin/env node
/**
 * Warn when a multi-format Vault entry is written as if it were single-format.
 *
 * 78% of the Vault's game entries carry more than one platform, averaging three.
 * That is the right model — the Vault indexes subjects, not releases, and
 * splitting Cybernoid into three pages would take 408 game entries past 1,100
 * and leave a reader searching "Cybernoid" at a disambiguation page.
 *
 * The failure the model allows is subtler: single-format prose wearing a
 * multi-format tag. Two entries found by hand on 2026-08-25 led on the C64 —
 * Cybernoid's summary on Jeroen Tel's SID soundtrack, Monty on the Run's on Rob
 * Hubbard's loading theme — for games CRASH reviewed on the Spectrum, where the
 * sound came from the beeper and neither theme existed. Both statements are true
 * of one port and false of the entry they sit in.
 *
 * The rule they break, and the only one worth enforcing here:
 *
 *   Never let an unqualified sentence carry a fact that is only true of one port.
 *
 * A script cannot check that. What it CAN check is the shape that hides it — an
 * entry tagged for several platforms whose prose only ever discusses one. This
 * reports those and leaves the judgement to a person.
 *
 * ⚠ It WARNS, it does not fail the build. A lopsided entry is often perfectly
 * correct: a game may genuinely matter on one machine and have been a poor port
 * elsewhere, and saying so is good writing rather than a defect. Failing on that
 * would teach people to pad entries with platforms they have nothing to say
 * about, which is worse than the problem.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VAULT = join(ROOT, 'src/content/vault');

// ⚠ Match on distinctive words only. An earlier pass counted "system" out of
// `nintendo-entertainment-system` and reported Battletoads and Castlevania as
// NES-dominated on the strength of the slug rather than the prose.
const PLATFORM_PATTERNS = {
  'sinclair-zx-spectrum': /\bspectrum\b|\bzx ?81\b/i,
  'commodore-64': /\bc64\b|\bcommodore 64\b|\bvic-ii\b|\bsid\b/i,
  'commodore-amiga': /\bamiga\b/i,
  'nintendo-entertainment-system': /\bnes\b|\bfamicom\b/i,
  'amstrad-cpc': /\bamstrad\b|\bcpc\b/i,
  'atari-st': /\batari st\b|\bst version\b/i,
  'sega-mega-drive': /\bmega ?drive\b|\bgenesis\b/i,
  'bbc-micro': /\bbbc micro\b|\bbbc b\b/i,
};

const MIN_MENTIONS = 4;   // below this there is not enough prose to judge
const DOMINANCE = 0.75;   // one platform holding this share of all mentions

function* entries(dir) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) yield* entries(p);
    else if (name.name.endsWith('.mdx')) yield p;
  }
}

const findings = [];
let multiFormat = 0;

for (const file of entries(VAULT)) {
  const text = readFileSync(file, 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;
  const body = text.slice(fm[0].length);
  const plat = fm[1].match(/platforms:\s*\[(.*?)\]/);
  if (!plat) continue;

  const tagged = plat[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter((s) => s && PLATFORM_PATTERNS[s]);
  if (tagged.length < 2) continue;
  multiFormat++;

  const counts = Object.fromEntries(
    tagged.map((p) => [p, (body.match(new RegExp(PLATFORM_PATTERNS[p], 'gi')) || []).length])
  );
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total < MIN_MENTIONS) continue;

  const [top, topCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const silent = tagged.filter((p) => p !== top && counts[p] === 0);
  if (topCount / total >= DOMINANCE && silent.length) {
    findings.push({
      entry: file.slice(VAULT.length + 1).replace(/\.mdx$/, ''),
      top,
      share: Math.round((topCount / total) * 100),
      silent,
    });
  }
}

if (findings.length) {
  console.warn(
    `\nVault platform balance: ${findings.length} of ${multiFormat} multi-format ` +
    `entries discuss only one of their platforms.\n`
  );
  for (const f of findings.sort((a, b) => a.entry.localeCompare(b.entry))) {
    console.warn(
      `  · ${f.entry} — ${f.share}% ${f.top}, never mentions: ${f.silent.join(', ')}`
    );
  }
  console.warn(
    '\n  Often fine: a game can matter on one machine and be a poor port elsewhere.\n' +
    '  Worth checking that no unqualified sentence states something true of one port only.\n'
  );
} else {
  console.log(`Vault platform balance: ${multiFormat} multi-format entries, none lopsided.`);
}
