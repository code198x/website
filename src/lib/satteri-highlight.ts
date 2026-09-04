/**
 * Sätteri HAST plugin that highlights fenced code blocks with the CSS Custom
 * Highlight API (via shiki-highlight-api), producing the same markup as the
 * unified-era `remark-shiki-highlight-api` pipeline and the CodeFromFile
 * component. Lets us move the markdown processor to Sätteri without changing
 * the highlighting output or the DOM-size optimisation.
 *
 * Sätteri wraps injected HTML as a `raw` node for `.md` and a `Fragment`
 * (mdxJsxFlowElement) for `.mdx`; the `mdx` option picks the right one.
 */
import { loadCustomLanguage } from 'shiki-highlight-api';
import { codeToThemedHighlight } from './themed-highlight';
import { bundledLanguages } from 'shiki';
import { loadCode198xLanguages } from './load-custom-languages';

// Meta-string parsing copied verbatim from remark-shiki-highlight-api for parity
// ({1,2-3} line highlights, lineNumbers, +/- diff lines, focus{…}).
function parseMetaString(meta?: string) {
  if (!meta) return {} as Record<string, unknown>;
  const options: Record<string, any> = {};
  const highlightMatch = meta.match(/\{([0-9,-]+)\}/);
  if (highlightMatch) options.highlightLines = highlightMatch[1];
  if (meta.includes('showLineNumbers') || meta.includes('lineNumbers')) {
    options.lineNumbers = true;
    const startMatch = meta.match(/(?:showLineNumbers|lineNumbers):(\d+)/);
    if (startMatch) options.lineNumbers = { start: parseInt(startMatch[1], 10) };
  }
  const diffAddMatch = meta.match(/\+([0-9,]+)/);
  const diffRemoveMatch = meta.match(/-([0-9,]+)/);
  if (diffAddMatch || diffRemoveMatch) {
    options.diffLines = {};
    if (diffAddMatch) options.diffLines.added = diffAddMatch[1].split(',').map((n) => parseInt(n.trim(), 10));
    if (diffRemoveMatch) options.diffLines.removed = diffRemoveMatch[1].split(',').map((n) => parseInt(n.trim(), 10));
  }
  const focusMatch = meta.match(/focus\{([0-9,-]+)\}/);
  if (focusMatch) {
    options.focusLines = focusMatch[1].split(',').flatMap((part) => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
      return [parseInt(part.trim(), 10)];
    });
  }
  return options;
}

let languagesReady: Promise<void> | undefined;
const loadedBundled = new Set<string>();
let blockCounter = 0;

interface Options {
  mdx?: boolean;
  lineNumbers?: boolean | { start: number };
}

export function code198xHighlightPlugin({ mdx = false, lineNumbers: globalLineNumbers }: Options = {}) {
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
        const meta = codeChild.data?.meta ?? undefined;

        if (!languagesReady) languagesReady = loadCode198xLanguages();
        await languagesReady;

        // Auto-load bundled Shiki languages on demand, mirroring the remark plugin.
        if (lang !== 'text' && !loadedBundled.has(lang) && lang in bundledLanguages) {
          try {
            await loadCustomLanguage(await (bundledLanguages as any)[lang]());
            loadedBundled.add(lang);
          } catch (error) {
            console.warn(`Failed to load language ${lang}:`, error);
          }
        }

        const code = ctx.textContent(codeChild).replace(/\n$/, '');
        const metaOptions = parseMetaString(meta);
        const blockId = `hl-${++blockCounter}`;
        const result = await codeToThemedHighlight(code, {
          lang,
          blockId,
          lineNumbers: (metaOptions as any).lineNumbers ?? globalLineNumbers,
          ...metaOptions,
        });

        // Make the scrollable <pre> keyboard-focusable (WCAG), matching rehypePreTabindex —
        // appended last so the tag matches the unified-era output attribute-for-attribute.
        const html =
          result.html.replace(/<pre\b(?![^>]*\btabindex)([^>]*)>/, '<pre$1 tabindex="0">') +
          result.css +
          result.script;
        return wrap(html);
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
