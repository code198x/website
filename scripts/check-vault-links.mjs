#!/usr/bin/env node
/**
 * Fail the build on a Vault link that goes nowhere.
 *
 * The Vault already had a dead-link check, but it only walked `.mdx` files under
 * `src/content/vault`. That is the wrong boundary: entries are linked from
 * `.astro` pages too, and those links are the ones a visitor is most likely to
 * meet first.
 *
 * On 2026-08-27 the CRASH! Live landing page and the NES platform page were both
 * found pointing at `/vault/culture/bedroom-coder` and
 * `/vault/culture/usborne-computing-books`, entries a deduplication pass had
 * deleted two days earlier. The entry-to-entry check reported the Vault clean
 * throughout, because it never looked at a page. This widens the boundary to all
 * of `src/`.
 *
 * ⚠ This FAILS the build, where check-vault-platform-balance only warns. The
 * difference is that a lopsided entry is a judgement call and a link to a
 * deleted page is not: it is broken for every visitor, and the fix is always
 * either to repoint it or to add a redirect.
 *
 * Three kinds of path are legitimate and must not be reported:
 *   · entry pages        /vault/<category>/<slug>  → an .mdx under src/content/vault
 *   · category listings  /vault/category/<slug>    → src/pages/vault/category/[slug].astro
 *   · the index          /vault
 * plus anything declared in the `redirects` block of astro.config.mjs, which is
 * how merged and renamed entries keep their old URLs working.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VAULT = join(ROOT, 'src/content/vault');
const SRC = join(ROOT, 'src');

const SCANNED = /\.(mdx|md|astro|ts|tsx|js|mjs|json)$/;

function* files(dir, filter) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* files(p, filter);
    else if (filter.test(e.name)) yield p;
  }
}

// --- what exists -----------------------------------------------------------

const entries = new Set();
for (const f of files(VAULT, /\.mdx$/)) {
  entries.add('/vault/' + relative(VAULT, f).replace(/\.mdx$/, '').split(/[\\/]/).join('/'));
}

// Redirect sources are valid links: that is the point of declaring them.
const config = readFileSync(join(ROOT, 'astro.config.mjs'), 'utf8');
const redirectBlock = config.match(/redirects:\s*\{([\s\S]*?)\n\s{2}\}/);
const redirects = new Set(
  [...(redirectBlock?.[1] ?? '').matchAll(/'([^']+)'\s*:/g)].map((m) => m[1])
);

const isCategory = (p) => /^\/vault\/category\/[a-z0-9-]+$/.test(p);

function resolves(path) {
  if (path === '/vault' || path === '/vault/') return true;
  if (isCategory(path)) return true;
  if (redirects.has(path)) return true;
  return entries.has(path);
}

// --- what is referenced ----------------------------------------------------

const dead = new Map();
let checked = 0;

// ⚠ Two traps, both of which produced false positives on the first run:
//
//   · `/images/vault/techniques/colour-clash/diagram.png` contains `/vault/...`
//     as a SUBSTRING. Every Figure asset in the Vault was reported as a dead
//     link. The lookbehind rejects a match preceded by a path or word character.
//   · `` `/vault/category/${key}` `` is a template literal. Matching stops at
//     the `$`, leaving the bare prefix `/vault/category`, which resolves to
//     nothing. Interpolated paths cannot be checked statically and are skipped.
const LINK = /(?<![\w.\-\/])\/vault\/[a-z0-9\-\/]*/g;

for (const f of files(SRC, SCANNED)) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(LINK)) {
    const path = m[0].replace(/[#?].*$/, '').replace(/\/$/, '');
    if (path === '/vault') continue;
    // An interpolated segment follows: nothing static to verify.
    if (text.slice(m.index + m[0].length).startsWith('$')) continue;
    checked++;
    if (!resolves(path)) {
      const where = relative(ROOT, f);
      if (!dead.has(path)) dead.set(path, new Set());
      dead.get(path).add(where);
    }
  }
}

// --- frontmatter entity references -----------------------------------------
//
// `sources[].ref`, `name_reused_by[].ref` and `continued_as[].ref` name a Vault
// entry as `category/slug`. They are relationships, so they have to resolve for
// the same reason a prose link does — and they are easier to get wrong, because
// nothing renders them yet.
//
// This is the failure the schema already warns about for `ai_generated` and
// `reviewed`: frontmatter absent from any check is frontmatter that can claim
// anything. A ref pointing at a deleted or renamed entry would sit there
// indefinitely, and the dedup passes of the last week renamed a dozen entries.

const REF = /^\s*(?:-\s*)?ref:\s*["']?([a-z0-9\-]+\/[a-z0-9\-]+)["']?\s*$/gm;
const badRefs = new Map();

for (const f of files(VAULT, /\.mdx$/)) {
  const text = readFileSync(f, 'utf8');
  const end = text.indexOf('\n---', 3);
  if (!text.startsWith('---') || end === -1) continue;
  const fm = text.slice(3, end);
  for (const m of fm.matchAll(REF)) {
    checked++;
    if (!resolves(`/vault/${m[1]}`)) {
      const where = relative(ROOT, f);
      if (!badRefs.has(m[1])) badRefs.set(m[1], new Set());
      badRefs.get(m[1]).add(where);
    }
  }
}

if (badRefs.size) {
  const plural = badRefs.size === 1 ? 'reference that does' : 'references that do';
  console.error(`\nVault frontmatter: ${badRefs.size} entity ${plural} not exist.\n`);
  for (const [ref, where] of [...badRefs].sort()) {
    console.error(`  \u00b7 ${ref}`);
    for (const w of [...where].sort()) console.error(`      ${w}`);
  }
  console.error(
    `\n  A ref names a Vault entry as category/slug. Fix by repointing it, or —\n` +
    `  where the successor has no entry and may never need one — use \`name:\`\n` +
    `  instead, which is free text and deliberately unchecked.\n`
  );
  process.exit(1);
}

// --- report ----------------------------------------------------------------

if (dead.size) {
  const plural = dead.size === 1 ? 'target that does' : 'targets that do';
  console.error(`\nVault links: ${dead.size} ${plural} not exist.\n`);
  for (const [path, where] of [...dead].sort()) {
    console.error(`  · ${path}`);
    for (const w of [...where].sort()) console.error(`      ${w}`);
  }
  console.error(
    `\n  Fix by repointing the link, or — if the entry moved and the old URL is\n` +
    `  public — adding a redirect to astro.config.mjs.\n`
  );
  process.exit(1);
}

console.log(
  `Vault links: ${checked} references across src/, ` +
  `${entries.size} entries, ${redirects.size} redirects. All resolve.`
);
