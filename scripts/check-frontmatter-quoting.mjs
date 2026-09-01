// Catches the two YAML frontmatter mistakes that have actually broken this build:
//   1. \' inside a double-quoted scalar - not a valid escape.
//   2. an unescaped " inside a double-quoted scalar - ends the string early.
// Astro's content sync rejects the file, but `astro build` still exits 0 through a
// pipe, so nothing downstream notices. Run this first.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((e) => {
  const p = join(d, e);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.mdx') ? [p] : [];
});

const problems = [];
for (const file of walk('src/content/vault')) {
  const text = readFileSync(file, 'utf8');
  if (!text.startsWith('---')) continue;
  const end = text.indexOf('\n---', 3);
  if (end === -1) continue;
  const frontmatter = text.slice(0, end).split('\n');
  frontmatter.forEach((line, i) => {
    if (line.includes("\\'")) problems.push([file, i + 1, "invalid escape \\'", line]);
    const m = line.match(/^\s*[-\s]*\w+:\s*"(.*)"\s*$/);
    if (m && /(^|[^\\])"/.test(m[1])) {
      problems.push([file, i + 1, 'unescaped " inside scalar', line]);
    }
  });
}

if (problems.length) {
  console.error(`Frontmatter quoting: ${problems.length} problem(s).\n`);
  for (const [file, line, what, text] of problems.slice(0, 20)) {
    console.error(`  ${file}:${line}  ${what}`);
    console.error(`    ${text.trim().slice(0, 120)}`);
  }
  process.exit(1);
}
console.log('Frontmatter quoting: clean.');
