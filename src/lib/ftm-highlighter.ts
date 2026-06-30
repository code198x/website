/**
 * Cached classic-shiki highlighter for "From the Metal" code figures.
 *
 * Unlike the site's default (shiki-highlight-api → CSS Custom Highlight API),
 * these figures use classic inline-span highlighting. Custom highlights are NOT
 * painted when printing, and the series exports to PDF with the figures intact —
 * inline spans carry their colour onto paper (and render identically in every
 * browser). One highlighter is created and reused across all figures.
 */
import { createHighlighter, type Highlighter } from 'shiki';
import asm6502 from '../syntax/6502.tmLanguage.json';
import z80 from '../syntax/z80.tmLanguage.json';
import m68k from '../syntax/m68k.tmLanguage.json';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['dark-plus'],
      langs: [
        { ...(asm6502 as any), name: '6502' },
        { ...(z80 as any), name: 'z80' },
        { ...(m68k as any), name: 'm68k' },
        { ...(m68k as any), name: '68000' },
      ],
    });
  }
  return highlighterPromise;
}

export async function highlightFtm(code: string, lang = '6502'): Promise<string> {
  const hl = await getHighlighter();
  const loaded = hl.getLoadedLanguages();
  const useLang = loaded.includes(lang) ? lang : 'text';
  return hl.codeToHtml(code, { lang: useLang, theme: 'dark-plus' });
}
