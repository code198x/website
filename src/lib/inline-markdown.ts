/**
 * Inline markdown for component props that carry prose.
 *
 * Captions, titles and descriptions arrive as plain strings, and Astro's `{x}`
 * prints them verbatim. Authors write markdown in them anyway — reasonably, since
 * the surrounding MDX is markdown. The result was markers printed as themselves:
 * caption="One `PRINT` line" put the backticks on the page, and "the first move
 * is to *notice*" showed the stars.
 *
 * This renders the inline subset those props actually use — code spans, bold and
 * italic — and nothing else. Block markdown (lists, headings, links) has no
 * business in a caption, so it is unsupported; a prop needing more takes a slot.
 *
 * Output is inserted with set:html, so escaping is this module's job rather than
 * the caller's. Escape first, then mark up, so the escaping pass cannot eat the
 * tags this adds.
 */

/**
 * Exactly what Astro's {expr} does, so output is unchanged bar the new tags.
 * The apostrophe is in the set because Astro escapes it too: leaving it out made
 * every contraction on the site differ from the previous build for no reason.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Render code spans, **bold** and *italic* in a plain-text string.
 *
 * Code spans are lifted out before emphasis runs and put back afterwards, so a
 * literal asterisk inside one survives. A real caption depends on it: "One
 * character — `+` to `*` — and it doubles" must not open an italic run at that
 * star. U+0000 cannot occur in the source, so the placeholder cannot collide
 * with the text it is standing in for.
 */
export function inlineMarkdown(text: string | null | undefined): string {
  // Optional props reach here as undefined — Figure renders its figcaption for a
  // credit alone, with no caption — so absence is a normal input, not a fault.
  if (!text) return '';

  const codeSpans: string[] = [];
  const MARK = '\u0000';

  const lifted = escapeHtml(text).replace(
    /`([^`]+)`/g,
    (_, code: string) => `${MARK}${codeSpans.push(code) - 1}${MARK}`,
  );

  const emphasised = lifted
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return emphasised.replace(
    new RegExp(`${MARK}(\\d+)${MARK}`, 'g'),
    (_, index: string) => `<code>${codeSpans[Number(index)]}</code>`,
  );
}
