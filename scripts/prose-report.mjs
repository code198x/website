#!/usr/bin/env node
/**
 * Readability + long-sentence report for curriculum and vault prose.
 *
 * Vale (npm run prose:style) owns words, voice, and spelling. This owns the
 * thing Vale can't measure: sentence length and grade level. Both are advisory
 * — signals to weigh, not gates.
 *
 * What it does NOT do: penalise hard subject matter. Readability formulas
 * inflate grade level for unavoidable domain nouns ("Commodore", "emulator")
 * and choke on tables, so the absolute scores are noisy. The *useful* signal
 * is sentences over the length threshold — the avoidable kind of difficulty.
 *
 * Usage:
 *   node scripts/prose-report.mjs            # scan curriculum + vault
 *   node scripts/prose-report.mjs --long 25  # tighter long-sentence threshold
 *   node scripts/prose-report.mjs path/...   # scan specific files/dirs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
let LONG = 30;
const li = args.indexOf('--long');
if (li !== -1) {
  LONG = parseInt(args[li + 1], 10) || 30;
  args.splice(li, 2);
}
const ROOTS = args.length
  ? args
  : ['src/content/curriculum', 'src/content/vault'];

function walk(p, out = []) {
  let s;
  try {
    s = statSync(p);
  } catch {
    return out;
  }
  if (s.isDirectory()) {
    for (const e of readdirSync(p)) walk(join(p, e), out);
  } else if (/\.mdx?$/.test(p)) {
    out.push(p);
  }
  return out;
}

// Markdown/MDX -> plain prose. Strips everything that isn't sentence-prose so
// the formulas don't choke on code, tables, JSX, or frontmatter.
function toProse(src) {
  let s = src;
  s = s.replace(/^---\n[\s\S]*?\n---\n/, ' '); // frontmatter
  s = s.replace(/```[\s\S]*?```/g, ' '); // fenced code
  s = s.replace(/^(import|export) .+$/gm, ' '); // MDX imports
  s = s.replace(/<[^>]+>/g, ' '); // HTML/JSX tags
  s = s.replace(/^\s*\|.*\|\s*$/gm, ' '); // table rows
  s = s.replace(/`[^`]+`/g, ' '); // inline code
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' '); // images
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'); // links -> text
  s = s.replace(/^#{1,6}\s+/gm, ''); // heading markers
  s = s.replace(/^\s*[-*+]\s+/gm, ''); // bullet markers
  s = s.replace(/[*_~>]/g, ' '); // emphasis / quote marks
  s = s.replace(/&[a-z]+;|&#\d+;/g, ' '); // entities
  // Treat block boundaries as sentence boundaries so list items and headings
  // each count once rather than running together.
  s = s.replace(/\n{2,}/g, '. ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return w.length ? 1 : 0;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function analyse(prose) {
  const sentences = prose
    .split(/[.!?]+(?=\s|$)/)
    .map((x) => x.trim())
    .filter((x) => x.split(/\s+/).filter(Boolean).length >= 3);
  const words = [];
  for (const se of sentences)
    for (const w of se.split(/\s+/)) if (/[a-z]/i.test(w)) words.push(w);
  const W = words.length;
  const S = sentences.length;
  if (!W || !S) return null;
  const syl = words.reduce((a, w) => a + syllables(w), 0);
  const complex = words.filter((w) => syllables(w) >= 3).length;
  const grade = 0.39 * (W / S) + 11.8 * (syl / W) - 15.59;
  const ease = 206.835 - 1.015 * (W / S) - 84.6 * (syl / W);
  const fog = 0.4 * (W / S + 100 * (complex / W));
  const long = sentences
    .map((x) => ({ n: x.split(/\s+/).filter(Boolean).length, x }))
    .filter((o) => o.n > LONG)
    .sort((a, b) => b.n - a.n);
  return { W, S, wps: W / S, grade, ease, fog, long };
}

const files = ROOTS.flatMap((r) => walk(r));
const rows = [];
for (const f of files) {
  const r = analyse(toProse(readFileSync(f, 'utf8')));
  if (r) rows.push({ f, ...r });
}

// Report. Sort worst-first by long-sentence count, then grade.
rows.sort((a, b) => b.long.length - a.long.length || b.grade - a.grade);

const totalLong = rows.reduce((a, r) => a + r.long.length, 0);
console.log(
  `\nProse report — ${rows.length} files, threshold ${LONG} words/sentence\n` +
    '='.repeat(64),
);
console.log(
  `\nGrade level: avg ${(rows.reduce((a, r) => a + r.grade, 0) / rows.length).toFixed(1)}` +
    ` (lower = more accessible). Long sentences total: ${totalLong}.\n`,
);

const flagged = rows.filter((r) => r.long.length);
if (flagged.length) {
  console.log('Files with sentences over the threshold (split candidates):\n');
  for (const r of flagged) {
    console.log(
      `  ${relative('.', r.f)}  —  FK grade ${r.grade.toFixed(1)}, ${r.long.length} long`,
    );
    for (const o of r.long.slice(0, 2)) {
      const snip = o.x.length > 110 ? o.x.slice(0, 110) + '…' : o.x;
      console.log(`      ${o.n}w: ${snip}`);
    }
  }
} else {
  console.log('No sentences over the threshold. Nothing to split.');
}

console.log(
  `\nReminder: grade level is inflated by unavoidable domain nouns and tables.` +
    `\nThe actionable signal is long sentences — the avoidable kind of difficulty.\n`,
);
