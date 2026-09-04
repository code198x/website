import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

/**
 * MDX parses the children of a JSX element as markdown. An <Output> block holds
 * a transcript of what a program printed, where markdown characters are just
 * characters — so `----------` under a line of text is a setext heading
 * underline that markdown eats, and `--` becomes an en dash on the way past.
 *
 * That failure deletes content rather than restyling it, and it is silent: the
 * page builds, and the missing lines only show up if somebody reads the page.
 *
 * Passing the text as a template literal expression hands MDX a string instead
 * of markup to parse. These tests hold every call site to that form.
 */

function mdxFiles(): string[] {
  return execSync('find src/content -name "*.mdx" -type f', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

describe('Output blocks', () => {
  const files = mdxFiles().filter(f => readFileSync(f, 'utf8').includes('<Output'));

  it('finds files using the component', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('passes its text as an expression, never as markdown children', () => {
    const offenders: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      // An opening tag whose first child is not `{`.
      const bare = /<Output(?:\s[^>]*)?>(?!\{)/g;
      if (bare.test(source)) offenders.push(file);
    }

    expect(offenders).toEqual([]);
  });

  it('keeps every line of the transcript', () => {
    // A template literal is opaque to markdown, so what the source holds is
    // what the page shows. Guard the specific case that failed: a run of
    // hyphens on its own line, which markdown reads as a heading underline.
    const withRules = files
      .map(f => ({ file: f, source: readFileSync(f, 'utf8') }))
      .filter(({ source }) => /<Output(?:\s[^>]*)?>\{`[^`]*\n-{3,}\s*\n/.test(source));

    for (const { file, source } of withRules) {
      const blocks = source.match(/<Output(?:\s[^>]*)?>\{`[^`]*`\}<\/Output>/g) ?? [];
      expect(blocks.length, `${file} has a rule inside an unclosed Output`).toBeGreaterThan(0);
    }
  });
});
