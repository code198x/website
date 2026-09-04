/**
 * Syntax colours that follow the page theme.
 *
 * shiki-highlight-api emits colours as a stylesheet of `::highlight()` rules
 * rather than inline on each token, so one set of registered ranges can be
 * painted by whichever rule wins. That is what makes this possible at all: the
 * code is highlighted once, and the theme decides the colours in CSS.
 *
 * Why it was needed: dark-plus is the only palette the site had, and every one
 * of its tokens measures between 1.4:1 and 3.2:1 against the light surface —
 * all below the 4.5:1 floor. Code blocks were therefore stuck on a dark ground
 * in the middle of a light page. Swapping the background alone would have made
 * them less readable, not more; the palette had to move with it.
 *
 * The two passes cover the same text but not with the same ranges: each theme
 * merges neighbouring tokens that happen to share a colour, and they merge
 * differently — one real listing here splits into 4504 ranges under dark-plus
 * and 4499 under light-plus. So the passes are compared by character position
 * rather than by range index, and the light pass reduces to a colour
 * substitution over the dark pass's rules, leaving its HTML and registration
 * script untouched.
 */
import { codeToHighlightHtml, loadBundledTheme } from 'shiki-highlight-api';

export const DARK_THEME = 'dark-plus';
export const LIGHT_THEME = 'light-plus';

type HighlightOptions = Parameters<typeof codeToHighlightHtml>[1];

let themesReady: Promise<void> | undefined;

async function ensureThemes(): Promise<void> {
  themesReady ??= (async () => {
    await loadBundledTheme(LIGHT_THEME);
    await loadBundledTheme(DARK_THEME);
  })();
  return themesReady;
}

/** The generated script carries the token ranges; they are the only place the
 *  two passes can be compared. */
interface TokenRange {
  line: number;
  start: number;
  end: number;
  color: string;
}

function ranges(script: string, blockId: string): TokenRange[] {
  const match = script.match(/const ranges = (\[.*?\]);/s);
  if (!match) {
    throw new Error(`themed-highlight: no ranges in the script for block ${blockId}. ` +
      `shiki-highlight-api's output shape has changed and this needs updating.`);
  }
  return JSON.parse(match[1]) as TokenRange[];
}

/** Colour of every highlighted character, keyed `line:column`. */
function colourByPosition(list: TokenRange[]): Map<string, string> {
  const at = new Map<string, string>();
  for (const range of list) {
    for (let col = range.start; col < range.end; col++) at.set(`${range.line}:${col}`, range.color);
  }
  return at;
}

/**
 * Map each dark colour to its light counterpart, comparing the two passes
 * character by character because their range boundaries do not agree.
 *
 * Two ways this can fail, and both throw rather than guess. A dark range that
 * spans more than one light colour cannot be expressed, because the range is
 * one `::highlight()` name and a name carries one colour. And a dark colour
 * used for two different light colours has the same problem one level up.
 * Neither happens across the curriculum's languages today; the checks are here
 * so that neither can start happening quietly.
 */
function colourMap(dark: TokenRange[], light: TokenRange[], blockId: string): Map<string, string> {
  const lightAt = colourByPosition(light);
  const map = new Map<string, string>();

  for (const range of dark) {
    let colour: string | undefined;
    for (let col = range.start; col < range.end; col++) {
      const here = lightAt.get(`${range.line}:${col}`);
      if (here === undefined) continue;
      if (colour !== undefined && colour !== here) {
        throw new Error(`themed-highlight: block ${blockId}, line ${range.line}: one ${DARK_THEME} ` +
          `range spans two ${LIGHT_THEME} colours (${colour} and ${here}).`);
      }
      colour = here;
    }
    if (colour === undefined) continue;

    const seen = map.get(range.color);
    if (seen !== undefined && seen !== colour) {
      throw new Error(`themed-highlight: block ${blockId} maps ${DARK_THEME} ${range.color} to both ` +
        `${seen} and ${colour} in ${LIGHT_THEME}. One highlight name cannot carry two colours.`);
    }
    map.set(range.color, colour);
  }
  return map;
}

/**
 * Rewrite the dark stylesheet so the light colour is the default and the dark
 * one applies under an explicit dark choice or a system preference with no
 * choice made — the same two conditions the rest of the site's tokens use.
 */
function themedCss(css: string, map: Map<string, string>): string {
  const rules = [...css.matchAll(/::highlight\((?<name>[^)]+)\)\s*\{\s*color:\s*(?<colour>[^;}]+)\s*;?\s*\}/g)];

  const light: string[] = [];
  const dark: string[] = [];
  for (const { groups } of rules) {
    const name = groups!.name;
    const darkColour = groups!.colour.trim();
    const lightColour = map.get(darkColour) ?? darkColour;
    light.push(`::highlight(${name}) { color: ${lightColour}; }`);
    dark.push(`::highlight(${name}) { color: ${darkColour}; }`);
  }

  const scoped = (prefix: string) => dark.map((rule) => `${prefix} ${rule}`).join('\n');

  return `<style>\n${light.join('\n')}\n` +
    `${scoped(':root[data-theme="dark"]')}\n` +
    `@media (prefers-color-scheme: dark) {\n${scoped(':root:not([data-theme])')}\n}\n` +
    `</style>`;
}

/**
 * Highlight once, colour twice. Returns the dark pass's HTML and registration
 * script unchanged, with a stylesheet that carries both palettes.
 */
export async function codeToThemedHighlight(
  code: string,
  options: HighlightOptions,
): Promise<{ html: string; css: string; script: string }> {
  await ensureThemes();

  const blockId = options.blockId ?? 'block';
  const dark = await codeToHighlightHtml(code, { ...options, theme: DARK_THEME });
  const light = await codeToHighlightHtml(code, {
    ...options,
    theme: LIGHT_THEME,
    // A separate id keeps the light pass's own rules out of the way; only its
    // colours are used, never its markup.
    blockId: `${blockId}--light`,
  });

  const map = colourMap(ranges(dark.script, blockId), ranges(light.script, blockId), blockId);

  return { html: dark.html, css: themedCss(dark.css, map), script: dark.script };
}
