#!/usr/bin/env node
// Falsify dated claims against the reference corpus.
//
// Every entry that says `released: 1987` or `founded: 1985` is making a claim
// nothing checks. This cannot confirm one — the corpus is a British magazine
// archive, so silence about a Japanese console or a 2005 company means nothing.
// It can REFUTE one, which is the half worth automating: a game reviewed in 1985
// was not released in 1990, and a company advertising in 1982 was not founded in
// 1987.
//
// Output is a ranked list of contradictions to read, not a verdict. The corpus
// carries OCR noise and name collisions; every flag needs a person.
//
//   node scripts/check-vault-dates.mjs [--min-gap 2] [--category games]

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const CORPUS = '/Users/stevehill/Projects/198x/reference/_tools/search.sqlite';
const VAULT = 'src/content/vault';

const args = process.argv.slice(2);
const argVal = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : dflt;
};
const MIN_GAP = Number(argVal('--min-gap', 2));
const ONLY_CAT = argVal('--category', null);

// The field that dates the START of the thing, per category. An `ended` or
// `discontinued` year cannot be refuted by an early corpus hit, so it is not
// tested here.
const START_FIELD = {
  companies: 'founded', groups: 'founded', magazines: 'founded',
  games: 'released', demos: 'released', books: 'released',
  tools: 'released', emulators: 'released',
  hardware: 'introduced', systems: 'introduced',
  culture: 'emerged', phenomena: 'emerged', events: 'emerged',
  communities: 'emerged', distribution: 'emerged', genres: 'emerged',
  techniques: 'originated',
  people: 'born',
};

// Titles too generic to search as a phrase: the corpus would match the ordinary
// word, not the entity. Same failure the entity-linking pass hit, same fix.
const TOO_GENERIC = new Set([
  'adventure', 'elite', 'rare', 'players', 'sprites', 'input', 'assembly',
  'scrolling', 'edge', 'the one', 'commodore format', 'imagine', 'pool',
  'defender', 'gauntlet', 'paradroid', 'sentinel', 'nemesis', 'darwin',
  'the games machine', 'demo', 'shareware', 'emulation', 'piracy', 'arcade',
]);

function entries() {
  const out = [];
  for (const cat of readdirSync(VAULT)) {
    const dir = join(VAULT, cat);
    if (!statSync(dir).isDirectory()) continue;
    if (ONLY_CAT && cat !== ONLY_CAT) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.mdx')) continue;
      const text = readFileSync(join(dir, file), 'utf8');
      const fm = text.split('---')[1] ?? '';
      const field = START_FIELD[cat];
      if (!field) continue;
      const year = fm.match(new RegExp(`^${field}:\\s*(\\d{4})\\s*$`, 'm'));
      const title = fm.match(/^title:\s*["'](.+?)["']\s*$/m);
      if (!year || !title) continue;
      out.push({ cat, slug: file.slice(0, -4), field, year: Number(year[1]), title: title[1] });
    }
  }
  return out;
}

// One query per entry, asking when the corpus STARTS CARING about the phrase.
//
// "Does it appear earlier?" does not work. FTS5 is case-blind and the corpus is
// OCR'd English, so "Half-Life" matches half-life the physics term from 1968,
// "Out Run" matches "out, run!", and "Black and White" matches every mention of
// a monitor. Those phrases return thousands of pre-release pages. Sustained
// presence does not separate them either: ordinary English is sustained.
//
// What does separate them is the SHAPE of the coverage. A game is barely
// mentioned, then reviewed everywhere, then fades. An ordinary phrase has a flat
// rate across thirty years. So: take the yearly counts, find the peak, and call
// the ONSET the first year reaching a quarter of it. For a real title the onset
// is release year (or the preview a year before). For ordinary English the onset
// sits decades early and the run is flat — which the flatness test discards.
const ONSET_FRACTION = 0.25;
const FLAT_RATIO = 3;   // peak must exceed the early-years mean by this much

function coverageShape(phrase) {
  const escaped = phrase.replace(/"/g, '""').replace(/'/g, "''");
  const sql = `select cast(year as integer) y, count(*) n from pages
               where pages match '"${escaped}"'
                 and year glob '[0-9][0-9][0-9][0-9]'
               group by y order by y;`;
  let rows;
  try {
    const r = execFileSync('sqlite3', [CORPUS, sql], { encoding: 'utf8', timeout: 180000 }).trim();
    if (!r) return null;
    rows = r.split('\n').map(l => l.split('|').map(Number));
  } catch {
    return null;
  }
  const total = rows.reduce((s, [, n]) => s + n, 0);
  if (total < 6) return null;              // too thin to have a shape
  const peak = Math.max(...rows.map(([, n]) => n));
  const onset = rows.find(([, n]) => n >= peak * ONSET_FRACTION)[0];

  // Flatness: if the years before onset already average a decent share of the
  // peak, the phrase is ordinary English rather than a title.
  const before = rows.filter(([y]) => y < onset);
  const beforeMean = before.length ? before.reduce((s, [, n]) => s + n, 0) / before.length : 0;
  const flat = beforeMean > 0 && peak / beforeMean < FLAT_RATIO;

  return { onset, peak, total, flat, span: [rows[0][0], rows[rows.length - 1][0]] };
}

const all = entries();
const flags = [];
let searched = 0, skipped = 0, flat = 0;

for (const e of all) {
  // A parenthetical disambiguator is ours, not the subject's name. A one-word
  // title is not distinctive enough to phrase-search a case-blind index.
  const phrase = e.title.replace(/\s*\(\d{4}\)\s*$/, '').trim();
  const distinctive = phrase.split(/\s+/).length >= 2 || phrase.length >= 9;
  if (!distinctive || TOO_GENERIC.has(phrase.toLowerCase())) { skipped++; continue; }
  searched++;
  const s = coverageShape(phrase);
  if (!s) continue;
  if (s.flat) { flat++; continue; }
  const gap = e.year - s.onset;
  if (Math.abs(gap) < MIN_GAP) continue;
  flags.push({ ...e, phrase, onset: s.onset, gap, total: s.total, peak: s.peak });
}

flags.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
console.log(`\nDated claims tested: ${searched}  (${skipped} titles too generic, ${flat} phrases too flat to be titles)`);
console.log(`Onset disagrees with the entry by ${MIN_GAP}+ years: ${flags.length}\n`);
console.log(`  ${'gap'.padStart(4)}  ${'entry'.padEnd(44)} ${'claims'.padEnd(15)} ${'corpus onset'.padEnd(13)} pages`);
for (const f of flags) {
  const dir = f.gap > 0 ? 'late by' : 'early by';
  console.log(`  ${(dir === 'late by' ? '+' : '-') + Math.abs(f.gap)}`.padEnd(8) + `${(f.cat + '/' + f.slug).padEnd(44)} ${(f.field + ' ' + f.year).padEnd(15)} ${String(f.onset).padEnd(13)} ${f.total}`);
}
console.log(`\n  + the entry dates it later than the press was covering it.`);
console.log(`  - the entry dates it earlier than the press noticed, which is usually`);
console.log(`    a non-British or post-corpus subject rather than an error.`);
console.log(`  Onset is an estimate from coverage shape. Read before believing.\n`);
