import { describe, it, expect } from 'vitest';
import { escapeHtml, inlineMarkdown } from './inline-markdown';

describe('escapeHtml', () => {
  it('escapes the four characters Astro escapes', () => {
    expect(escapeHtml(`a & b < c > d "e" f's`)).toBe(
      'a &amp; b &lt; c &gt; d &quot;e&quot; f&#39;s',
    );
  });

  it('escapes the ampersand before the rest, so entities are not double-built', () => {
    expect(escapeHtml('<')).toBe('&lt;');
    expect(escapeHtml('&lt;')).toBe('&amp;lt;');
  });
});

describe('inlineMarkdown', () => {
  it('leaves plain prose alone', () => {
    expect(inlineMarkdown('A box named score, holding zero.')).toBe('A box named score, holding zero.');
  });

  it('renders a code span', () => {
    expect(inlineMarkdown('One `PRINT` line, run ten times.')).toBe(
      'One <code>PRINT</code> line, run ten times.',
    );
  });

  it('renders several code spans', () => {
    expect(inlineMarkdown('`4` is less than `7`')).toBe(
      '<code>4</code> is less than <code>7</code>',
    );
  });

  it('renders bold and italic', () => {
    expect(inlineMarkdown('the first move is to *notice* it')).toBe(
      'the first move is to <em>notice</em> it',
    );
    expect(inlineMarkdown('**Everyone** starts here')).toBe('<strong>Everyone</strong> starts here');
  });

  // The real unit-11 caption. Lifting code spans out before emphasis runs is
  // the whole reason this does not become an italic run at the first star.
  it('protects an asterisk inside a code span', () => {
    expect(inlineMarkdown('One character — `+` to `*` — and it doubles.')).toBe(
      'One character — <code>+</code> to <code>*</code> — and it doubles.',
    );
  });

  // The real unit-07 caption: angle brackets must survive as text.
  it('escapes angle brackets inside a code span', () => {
    expect(inlineMarkdown('so `g < 7` was true')).toBe('so <code>g &lt; 7</code> was true');
  });

  it('escapes markup in the surrounding prose', () => {
    expect(inlineMarkdown('a <script>alert(1)</script> b')).toBe(
      'a &lt;script&gt;alert(1)&lt;/script&gt; b',
    );
  });

  it('escapes markup that arrives inside a code span', () => {
    expect(inlineMarkdown('type `<b>` to embolden')).toBe(
      'type <code>&lt;b&gt;</code> to embolden',
    );
  });

  it('leaves an unmatched backtick as itself', () => {
    expect(inlineMarkdown('a lone ` backtick')).toBe('a lone ` backtick');
  });

  it('leaves a lone asterisk alone', () => {
    expect(inlineMarkdown('i * 7 is worked out')).toBe('i * 7 is worked out');
  });

  it('escapes an apostrophe, as Astro does', () => {
    expect(inlineMarkdown("the machine isn't wrong")).toBe('the machine isn&#39;t wrong');
  });

  it('handles an empty string', () => {
    expect(inlineMarkdown('')).toBe('');
  });

  it('handles an absent optional prop', () => {
    expect(inlineMarkdown(undefined)).toBe('');
    expect(inlineMarkdown(null)).toBe('');
  });

  // MDX decodes entities in attribute values, so a prop arrives holding a real
  // quote character; it must come back out as one.
  it('re-escapes a quote that MDX already decoded', () => {
    expect(inlineMarkdown('SAVE"HELLO",8 writes the program')).toBe(
      'SAVE&quot;HELLO&quot;,8 writes the program',
    );
  });
});
