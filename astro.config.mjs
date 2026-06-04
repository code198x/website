// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { bundledLanguages } from 'shiki';
import { remarkHighlightApi } from 'remark-shiki-highlight-api';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { loadCode198xLanguages } from './src/lib/load-custom-languages.ts';

// Code blocks scroll horizontally on overflow; make them keyboard-focusable so
// keyboard-only users can scroll them (WCAG scrollable-region-focusable).
function rehypePreTabindex() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre') {
        node.properties = node.properties || {};
        if (node.properties.tabindex === undefined) node.properties.tabindex = '0';
      }
    });
  };
}

// Load custom syntax grammars
import basicGrammar from './src/syntax/basic.tmLanguage.json' with { type: 'json' };
import asm6502Grammar from './src/syntax/6502.tmLanguage.json' with { type: 'json' };
import amosGrammar from './src/syntax/amos.tmLanguage.json' with { type: 'json' };
import sinclairBasicGrammar from './src/syntax/sinclair-basic.tmLanguage.json' with { type: 'json' };
import ca65Grammar from './src/syntax/ca65.tmLanguage.json' with { type: 'json' };
import z80Grammar from './src/syntax/z80.tmLanguage.json' with { type: 'json' };
import m68kGrammar from './src/syntax/m68k.tmLanguage.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: 'https://code198x.com',
  // Redirects from the pre-modules `game-NN-slug` landing URLs to the bare module
  // slugs. Base pages only (Astro can't validate a spread destination against our
  // statically-generated routes); focused on the shipped Spectrum BASIC games plus
  // the Shadowkeep flagship. Cheap insurance, not exhaustive — see
  // decisions/modules-not-games.md.
  redirects: {
    '/sinclair-zx-spectrum/basic/game-01-story-builder': '/sinclair-zx-spectrum/basic/story-builder',
    '/sinclair-zx-spectrum/basic/game-02-lucky-number': '/sinclair-zx-spectrum/basic/lucky-number',
    '/sinclair-zx-spectrum/basic/game-03-oracle-stone': '/sinclair-zx-spectrum/basic/oracle-stone',
    '/sinclair-zx-spectrum/basic/game-04-reflex': '/sinclair-zx-spectrum/basic/reflex',
    '/sinclair-zx-spectrum/basic/game-05-dice-roller': '/sinclair-zx-spectrum/basic/dice-roller',
    '/sinclair-zx-spectrum/basic/game-06-bright-spark': '/sinclair-zx-spectrum/basic/bright-spark',
    '/sinclair-zx-spectrum/basic/game-07-hi-lo': '/sinclair-zx-spectrum/basic/hi-lo',
    '/sinclair-zx-spectrum/basic/game-08-touchdown': '/sinclair-zx-spectrum/basic/touchdown',
    '/sinclair-zx-spectrum/assembly/game-01-shadowkeep': '/sinclair-zx-spectrum/assembly/shadowkeep',
  },
  experimental: {
    queuedRendering: { enabled: true },
  },
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-family-sans',
      provider: fontProviders.fontsource(),
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-family-mono',
      provider: fontProviders.fontsource(),
      fallbacks: ['Courier New', 'monospace'],
    },
    {
      name: 'Caveat',
      cssVariable: '--font-family-script',
      provider: fontProviders.fontsource(),
      weights: [600, 700],
      fallbacks: ['Bradley Hand', 'cursive'],
    },
  ],
  integrations: [mdx(), sitemap(), icon()],
  markdown: {
    // Use CSS Custom Highlight API for syntax highlighting
    remarkPlugins: [
      remarkGfm,
      [remarkHighlightApi, {
        theme: 'dark-plus',
        loadLanguages: loadCode198xLanguages
      }]
    ],
    rehypePlugins: [rehypePreTabindex],
    syntaxHighlight: false,
    shikiConfig: {
      langs: [
        ...Object.keys(bundledLanguages),
        {
          id: 'basic',
          scopeName: 'source.basic.c64',
          aliases: ['c64basic', 'commodore-basic'],
          ...basicGrammar,
        },
        {
          id: '6502',
          scopeName: 'source.asm.6502',
          aliases: ['6502asm', 'asm6502', 'c64asm'],
          ...asm6502Grammar,
        },
        {
          id: 'amos',
          scopeName: 'source.basic.amos',
          aliases: ['amos', 'amospro', 'amos-basic'],
          ...amosGrammar,
        },
        {
          id: 'sinclair-basic',
          scopeName: 'source.basic.sinclair',
          aliases: ['sinclair', 'zx-basic', 'spectrum-basic'],
          ...sinclairBasicGrammar,
        },
        {
          id: 'ca65',
          scopeName: 'source.asm.ca65',
          aliases: ['ca65', 'nes-asm', 'nes6502'],
          ...ca65Grammar,
        },
        {
          id: 'z80',
          scopeName: 'source.z80asm',
          aliases: ['z80asm', 'spectrum-asm', 'zx-asm'],
          ...z80Grammar,
        },
        {
          id: 'm68k',
          scopeName: 'source.asm.m68k',
          aliases: ['68000', '68k', 'amiga-asm', 'm68000'],
          ...m68kGrammar,
        }
      ],
      theme: 'dark-plus'
    }
  }
});
