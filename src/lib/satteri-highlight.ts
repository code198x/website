/**
 * Sätteri HAST plugin that renders fenced code blocks as House198x listings:
 * the same panel and the same four syntax roles as CodeFromFile
 * (styles/lesson.css, src/lib/kit-highlight.ts), so a fence and a listing
 * read from a file cannot drift apart.
 *
 * Sätteri wraps injected HTML as a `raw` node for `.md` and a `Fragment`
 * (mdxJsxFlowElement) for `.mdx`; the `mdx` option picks the right one.
 *
 * Fence meta strings ({1,2} line highlights, lineNumbers, +/- diff lines,
 * focus{…}) were parsed for the CSS Highlight API pipeline. No page uses
 * one, so they are not carried over; a diff is CodeDiff's job.
 */
import { escapeHtml, listingHtml } from './kit-highlight';

interface Options {
  mdx?: boolean;
}

/** A fence's label: the language a reader would recognise, or "Code". */
const LABELS: Record<string, string> = {
  bash: 'Shell', sh: 'Shell', shell: 'Shell', powershell: 'PowerShell', text: 'Code',
  z80: 'Z80 assembly', ca65: '6502 assembly', '6502': '6502 assembly', asm: 'Assembly',
  m68k: '68000 assembly', '68000': '68000 assembly', basic: 'BASIC',
  'sinclair-basic': 'Sinclair BASIC', 'commodore-basic': 'Commodore BASIC', amos: 'AMOS',
  blitz: 'Blitz BASIC', forth: 'Forth',
};

export function code198xHighlightPlugin({ mdx = false }: Options = {}) {
  const wrap = mdx
    ? (html: string) => ({
        type: 'mdxJsxFlowElement',
        name: 'Fragment',
        attributes: [{ type: 'mdxJsxAttribute', name: 'set:html', value: html }],
        children: [],
      })
    : (html: string) => ({ type: 'raw', value: html });

  return {
    name: 'code198x-highlight',
    element: {
      filter: ['pre'],
      async visit(node: any, ctx: any) {
        const codeChild = node.children?.find((c: any) => c.type === 'element' && c.tagName === 'code');
        if (!codeChild) return;

        const lang = codeChild.data?.lang ?? 'text';
        const code = ctx.textContent(codeChild).replace(/\n+$/, '');
        const label = escapeHtml(LABELS[lang] ?? 'Code');
        const body = await listingHtml(code, lang);

        // Focusable and named while it scrolls; lesson-listing.ts drops both
        // when it does not. Shipping them means no-JS readers can scroll it.
        return wrap(
          `<div class="lesson-listing lesson-fence"><div class="ll-head"><span class="ll-label">${label}</span></div>` +
          `<div class="ll-scroll" data-ll-scroll data-label="${label}, listing" tabindex="0" role="region" aria-label="${label}, listing">` +
          `<pre class="ll-pre"><code>${body}</code></pre></div></div>`,
        );
      },
    },
  };
}

/** Make Markdown tables keyboard-focusable when responsive CSS turns them into
 * horizontal scroll regions on narrow viewports. */
export function code198xTableAccessibilityPlugin() {
  return {
    name: 'code198x-table-accessibility',
    element: {
      filter: ['table'],
      visit(node: any, ctx: any) {
        ctx.setProperty(node, 'tabIndex', 0);
      },
    },
  };
}
