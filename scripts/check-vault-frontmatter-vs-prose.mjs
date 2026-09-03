#!/usr/bin/env node
// Compare an entry's dated frontmatter against the dates in its own prose.
//
// This exists because 24 people entries had a career span in `born`/`died`.
// `born: 1989, died: 2021` on Takaya Imamura is his Nintendo service, and the
// page rendered "Lived 1989-2021" for a man who is alive and retired. Three
// entries said a living person had died. The correct birth year was sitting in
// the body of the same file, four lines below the wrong one, and nothing
// compared them.
//
// Frontmatter is data and prose is writing, so they are edited at different
// times by different passes and drift apart silently. Anywhere both state the
// same fact, they can be checked against each other for free.
//
//   node scripts/check-vault-frontmatter-vs-prose.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const VAULT = 'src/content/vault';

// field in frontmatter -> the label the prose uses for the same fact.
// The trailing (?!s) matters: "**Founded:** early 1990s" is a decade, not a
// year, and without it every such entry reads as a disagreement with its own
// frontmatter.
const PAIRS = [
  ['born', /\*\*Born:?\*\*[^0-9]{0,12}(\d{4})(?!s)/],
  ['died', /\*\*Died:?\*\*[^0-9]{0,12}(\d{4})(?!s)/],
  ['founded', /\*\*Founded:?\*\*[^0-9]{0,20}(\d{4})(?!s)/],
  ['released', /\*\*Released:?\*\*[^0-9]{0,20}(\d{4})(?!s)/],
  ['introduced', /\*\*Introduced:?\*\*[^0-9]{0,20}(\d{4})(?!s)/],
];

const findings = [];
let checked = 0;

for (const cat of readdirSync(VAULT)) {
  const dir = join(VAULT, cat);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.mdx')) continue;
    const text = readFileSync(join(dir, file), 'utf8');
    const [, fm, ...rest] = text.split('---');
    const body = rest.join('---');
    const ref = `${cat}/${file.slice(0, -4)}`;

    for (const [field, prose] of PAIRS) {
      const inFm = fm.match(new RegExp(`^${field}:[ \\t]*(\\d{4})[ \\t]*$`, 'm'));
      const inBody = body.match(prose);
      if (!inFm || !inBody) continue;
      checked++;
      if (inFm[1] !== inBody[1]) {
        findings.push({ ref, field, fm: inFm[1], body: inBody[1] });
      }
    }

    // A death year with nothing in the prose that describes a death. Retiring,
    // leaving a company and being acquired are all things a `died:` has been
    // used for, and all of them are survivable.
    // A closed "Lived: 1936-2007" line states the death without the word, and is
    // the tidier way to say it in a facts list.
    const died = fm.match(/^died:[ \t]*(\d{4})[ \t]*$/m);
    const saysSo = /\b(died|death|passed away|posthum|obituar)/i.test(body)
                || new RegExp(`\\*\\*Lived:?\\*\\*[^\n]*${died?.[1] ?? '\\d{4}'}`).test(body);
    if (died && cat === 'people' && !saysSo) {
      findings.push({ ref, field: 'died', fm: died[1], body: null });
    }
  }
}

console.log(`\nFacts stated in both frontmatter and prose: ${checked}`);
console.log(`Disagreements: ${findings.length}\n`);
for (const f of findings) {
  if (f.body === null) {
    console.log(`  ${f.ref}`);
    console.log(`    died: ${f.fm} — but the prose never describes a death`);
  } else {
    console.log(`  ${f.ref}`);
    console.log(`    ${f.field}: ${f.fm} in frontmatter, ${f.body} in the prose`);
  }
}
if (findings.length) {
  console.log(`\n  The prose is usually right: it is what a person read and wrote.`);
  console.log(`  Check before copying either way.\n`);
  process.exitCode = 1;
} else {
  console.log(`  No disagreements.\n`);
}
