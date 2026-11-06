#!/usr/bin/env node
/**
 * Check what lessons say they want from the Vault.
 *
 * A lesson's `wants` lists pages it would link to for depth but can't yet: a
 * Vault entry still awaiting review (`category/slug`) or a Vault candidate
 * (`VC-0123`). The content factory ranks the Vault queue by them, so a want
 * that has gone stale distorts the queue.
 *
 * Fails when a wanted entry doesn't exist (a typo, or a candidate that should
 * be cited by its VC ID). Warns, but passes, when a wanted entry is already
 * reviewed: the want is satisfied and the lesson should link instead. That
 * happens when a Vault review batch marks an entry reviewed, and failing would
 * block the batch over lessons it never touched; the docs queue lists these
 * (`--wanted-reviews`) for the factory's link pass. Candidate IDs are checked
 * against the queue by code198x/docs, which owns it.
 *
 *   node scripts/check-lesson-wants.mjs
 */
import { globSync, readFileSync, existsSync } from 'node:fs';
import { load } from 'js-yaml';

const problems = [];
const satisfied = [];
let wants = 0;
const lessons = globSync('src/content/curriculum/**/unit-*.mdx').sort();
for (const file of lessons) {
  const front = readFileSync(file, 'utf8').split('---')[1] ?? '';
  const data = load(front) ?? {};
  for (const want of data.wants ?? []) {
    wants++;
    if (/^VC-[0-9]{4,}$/.test(want)) continue;
    const entry = `src/content/vault/${want}.mdx`;
    if (!existsSync(entry)) {
      problems.push(`${file}: wants ${want}, which isn't a Vault entry (cite a candidate by its VC ID)`);
      continue;
    }
    const reviewed = load(readFileSync(entry, 'utf8').split('---')[1] ?? '')?.reviewed;
    if (reviewed === true) satisfied.push(`${file}: wants ${want}, which is now reviewed — link to it instead`);
  }
}
if (problems.length) {
  console.error(`Lesson wants: ${problems.length} problem(s).\n`);
  for (const p of problems) console.error(`  · ${p}`);
  console.error();
  process.exit(1);
}
for (const s of satisfied) console.warn(`  ⚠ ${s}`);
console.log(`Lesson wants: ${wants} across ${lessons.length} lessons; ${satisfied.length} satisfied and ready to become links.`);
