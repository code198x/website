/** Add a coloured mirror without replacing the native text editor. */
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import theme from 'shiki/themes/github-dark.mjs';
import grammar from '../syntax/z80.tmLanguage.json';
import basicGrammar from '../syntax/sinclair-basic.tmLanguage.json';
import './assembly-editor.css';

const highlighter = createHighlighterCore({
  themes: [{ ...theme, tokenColors: [
    ...theme.tokenColors,
    { scope: 'comment', settings: { foreground: '#9ba7b4' } },
  ] }],
  langs: [{ ...grammar, name: 'z80' }, { ...basicGrammar, name: 'sinclair-basic' }],
  engine: createOnigurumaEngine(import('shiki/wasm')),
});

export async function highlightAssemblyEditor(source: HTMLTextAreaElement, language: 'z80' | 'sinclair-basic' = 'z80') {
  const hl = await highlighter;
  if (!source.isConnected || source.closest('.assembly-editor')) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'assembly-editor';
  const mirror = document.createElement('pre');
  mirror.className = 'assembly-editor-colours';
  mirror.setAttribute('aria-hidden', 'true');
  source.before(wrapper);
  wrapper.append(mirror, source);
  source.wrap = 'off';
  const syncScroll = () => {
    mirror.scrollTop = source.scrollTop;
    mirror.scrollLeft = source.scrollLeft;
  };
  const refresh = () => {
    const fragment = document.createDocumentFragment();
    const lines = hl.codeToTokens(source.value, { lang: language, theme: 'github-dark' }).tokens;
    lines.forEach((line, index) => {
      for (const token of line) {
        const span = document.createElement('span');
        span.textContent = token.content;
        span.style.color = token.color ?? '#e6edf3';
        fragment.append(span);
      }
      if (index < lines.length - 1) fragment.append('\n');
    });
    // A final blank line needs a glyph to occupy its normal line height.
    fragment.append(' ');
    mirror.replaceChildren(fragment);
    syncScroll();
  };
  source.addEventListener('input', refresh);
  source.addEventListener('scroll', syncScroll);
  refresh();
}
