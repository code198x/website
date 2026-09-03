#!/usr/bin/env node
/**
 * Fail the build when a line break in a template would eat a space.
 *
 * Astro templates follow JSX whitespace rules: a line break between prose and
 * an inline tag collapses to nothing rather than to a space. So this
 *
 *     Two entry points: <b>Maths for Games</b> wants
 *     <a href="…">Numbers &amp; Bits</a> behind it
 *
 * ships as "wantsNumbers & Bits". The source is correct English, the editor
 * shows nothing wrong, and the words only run together in the browser — which
 * is why this survived proofreading on five pages for months.
 *
 * It goes both ways. Prose then a tag, and a tag then prose, break identically:
 *
 *     four decades</span>          →  "four decadesof context"
 *     of context
 *
 * The fix at each site is an explicit {' '} before the break. This script
 * refuses to let one through without it.
 *
 * WHY A CHECK RATHER THAN A SETTING. The whitespace rule is JSX semantics,
 * not an Astro option, so it cannot be turned off. A formatter that never
 * breaks those lines would also work, but that means adopting one across the
 * whole repo to fix one class of bug. This is the smaller instrument.
 *
 * WHY THE SOURCE AND NOT THE RENDERED PAGE. The rendered signature — a letter
 * hard against a tag — has legitimate uses: <abbr>ROM</abbr>s is a correctly
 * pluralised abbreviation, not a defect. In the source there is no legitimate
 * reason to break a line between prose and an inline tag without a guard, so
 * checking here has no false positives to explain away.
 */
import { globSync, readFileSync } from 'node:fs';

const INLINE = 'a|b|i|em|strong|code|span|abbr|small|sub|sup';

/** Prose, a line break, then an inline tag: "wants⏎<a>Numbers" */
const BEFORE_TAG = new RegExp(String.raw`[A-Za-z0-9,;:)]\n\s*<(?:${INLINE})\b`, 'g');
/** An inline tag, a line break, then prose: "decades</span>⏎of context" */
const AFTER_TAG = new RegExp(String.raw`</(?:${INLINE})>\n\s*[A-Za-z0-9(]`, 'g');

const files = globSync('src/**/*.astro').sort();
const findings = [];

for (const file of files) {
  const source = readFileSync(file, 'utf8');

  // Only the template. The frontmatter is TypeScript, and <style> blocks are CSS.
  const parts = source.split('---');
  const template = parts.length > 2 ? parts.slice(2).join('---') : source;
  const offset = source.length - template.length;
  const searchable = template.replace(/<style>[\s\S]*?<\/style>/g, (m) => ' '.repeat(m.length));

  for (const [pattern, shape] of [[BEFORE_TAG, 'before a tag'], [AFTER_TAG, 'after a tag']]) {
    pattern.lastIndex = 0;
    for (const match of searchable.matchAll(pattern)) {
      // An explicit guard immediately before the break is the fix, not a finding.
      const guarded = searchable.slice(Math.max(0, match.index - 8), match.index + 1).includes("{' '}");
      if (guarded) continue;
      const line = source.slice(0, offset + match.index).split('\n').length;
      findings.push({ file, line, shape, text: match[0].replace(/\n\s*/, ' ⏎ ') });
    }
  }
}

if (findings.length) {
  console.error(`\nTemplate whitespace: ${findings.length} line break(s) that would eat a space.\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line} — ${f.shape}`);
    console.error(`    …${f.text}…`);
  }
  console.error(
    `\n  Astro follows JSX whitespace rules: a line break between prose and an\n` +
    `  inline tag collapses to nothing, so the words run together in the browser\n` +
    `  while the source looks correct.\n\n` +
    `  Fix each one with an explicit {' '} before the break:\n\n` +
    `      Two entry points: <b>Maths for Games</b> wants{' '}\n` +
    `      <a href="…">Numbers &amp; Bits</a> behind it\n\n` +
    `  Or keep the phrase and the tag on the same line.\n`,
  );
  process.exit(1);
}

console.log(`Template whitespace: ${files.length} templates, no eaten spaces.`);
