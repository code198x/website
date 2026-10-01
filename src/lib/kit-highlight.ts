/**
 * Syntax colour for lesson listings, in the kit's small fixed set.
 *
 * The House198x Listing (`_198x-ui/components/Listing.astro`) colours a
 * listing with four roles and nothing else: keywords in the accent ink,
 * strings, numbers and addresses, and comments in the muted ink. Each role is
 * a token measured to clear 4.5:1 on every surface a listing produces, in
 * both themes (family-visual-identity.md §3, §4). The kit finds those roles
 * with a deliberately small scanner. Lessons already have real grammars for
 * every machine they teach (src/syntax), so this keeps the grammars and maps
 * their scopes onto the kit's roles, and the page carries the kit's colours.
 *
 * How the mapping works: a private shiki theme gives each role a sentinel
 * colour, shiki tokenises with it, and each sentinel becomes a class. A
 * TextMate theme already resolves "most specific scope wins", so
 * `keyword.operator` stays plain ink while `keyword.mnemonic` is a keyword.
 *
 * The output is static spans. It replaces the CSS Custom Highlight API path
 * (shiki-highlight-api), whose per-block registration scripts pinned WebKit's
 * main thread on the longest lessons: Gloaming unit 19 carries four of them,
 * about 480 KB, and never reached DOMContentLoaded in WebKit. Spans cost more
 * elements and no script, and they print.
 */
import { createHighlighter, bundledLanguages, type Highlighter, type ThemeRegistration } from 'shiki';
import asmLang from 'shiki/langs/asm.mjs';
import basicGrammar from '../syntax/basic.tmLanguage.json';
import asm6502Grammar from '../syntax/6502.tmLanguage.json';
import amosGrammar from '../syntax/amos.tmLanguage.json';
import blitzGrammar from '../syntax/blitz.tmLanguage.json';
import sinclairBasicGrammar from '../syntax/sinclair-basic.tmLanguage.json';
import ca65Grammar from '../syntax/ca65.tmLanguage.json';
import z80Grammar from '../syntax/z80.tmLanguage.json';
import m68kGrammar from '../syntax/m68k.tmLanguage.json';
import forthGrammar from '../syntax/forth.tmLanguage.json';

export type Role = 'kw' | 'str' | 'num' | 'c' | 'ln';
export interface Token { role?: Role; text: string }

/* Sentinels: never rendered, only read back. */
const SENTINEL: Record<string, Role | undefined> = {
  '#000001': 'c',
  '#000002': 'str',
  '#000003': 'num',
  '#000004': 'kw',
  '#000005': 'ln',
};

const houseTheme: ThemeRegistration = {
  name: 'house-roles',
  type: 'dark',
  fg: '#000000',
  bg: '#ffffff',
  settings: [
    { settings: { foreground: '#000000', background: '#ffffff' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#000001' } },
    { scope: ['string', 'punctuation.definition.string', 'constant.character.escape', 'constant.character'], settings: { foreground: '#000002' } },
    { scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#000003' } },
    // A BASIC line number is part of the program, drawn muted as the kit's
    // `numbers="source"` draws it.
    { scope: ['constant.numeric.line-number'], settings: { foreground: '#000005' } },
    { scope: ['keyword', 'storage', 'support.function'], settings: { foreground: '#000004' } },
    // Operators are punctuation to a reader: plain ink.
    { scope: ['keyword.operator', 'constant.numeric.operator', 'constant.language.operator'], settings: { foreground: '#000000' } },
  ],
};

const custom = [
  [basicGrammar, ['basic', 'commodore-basic', 'c64basic']],
  [asm6502Grammar, ['6502']],
  [amosGrammar, ['amos']],
  [blitzGrammar, ['blitz']],
  [sinclairBasicGrammar, ['sinclair-basic']],
  [ca65Grammar, ['ca65']],
  [z80Grammar, ['z80']],
  [m68kGrammar, ['m68k', '68000']],
  [forthGrammar, ['forth', 'ace-forth']],
] as const;

let ready: Promise<Highlighter> | undefined;

function highlighter(): Promise<Highlighter> {
  ready ??= createHighlighter({
    themes: [houseTheme],
    langs: [
      ...custom.flatMap(([grammar, names]) => names.map((name) => ({ ...(grammar as object), name }) as never)),
      ...asmLang,
      { ...(asmLang[0] as object), name: 'nasm' } as never,
    ],
  });
  return ready;
}

/** Tokenise `code` into lines of role-tagged tokens. Unknown languages come
 *  back as plain text rather than failing the build. */
export async function tokenise(code: string, lang = 'text'): Promise<Token[][]> {
  const hl = await highlighter();
  let use = lang;
  if (!hl.getLoadedLanguages().includes(use)) {
    if (use in bundledLanguages) {
      try { await hl.loadLanguage(use as keyof typeof bundledLanguages); } catch { use = 'text'; }
    } else {
      use = 'text';
    }
  }
  if (use === 'text' || use === 'plaintext' || use === 'txt') {
    return code.split('\n').map((line) => [{ text: line }]);
  }
  // No time limit: a busy build machine must not leave the end of a long
  // line uncoloured, which would differ from run to run.
  const { tokens } = hl.codeToTokens(code, { lang: use, theme: 'house-roles', tokenizeTimeLimit: 0 });
  return tokens.map((line) => {
    const out: Token[] = [];
    for (const t of line) {
      const role = SENTINEL[(t.color ?? '').toLowerCase()];
      const last = out.at(-1);
      if (last && last.role === role) last.text += t.content;
      else out.push({ role, text: t.content });
    }
    return out;
  });
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** One line's tokens as HTML, roles as `hl-*` classes (styles/lesson.css). */
export function tokensHtml(tokens: Token[]): string {
  return tokens.map((t) => (t.role ? `<span class="hl-${t.role}">${escapeHtml(t.text)}</span>` : escapeHtml(t.text))).join('');
}

/** A whole listing's lines, each in its own element so a line can be marked. */
export async function listingHtml(code: string, lang?: string): Promise<string> {
  const lines = await tokenise(code, lang);
  const last = lines.length - 1;
  return lines
    .map((tokens, i) => `<span class="ll-line"><span class="ll-text">${tokensHtml(tokens)}${i < last ? '\n' : ''}</span></span>`)
    .join('');
}
