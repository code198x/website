// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { bundledLanguages } from 'shiki';
import { remarkHighlightApi } from 'remark-shiki-highlight-api';
import { loadCode198xLanguages } from './src/lib/load-custom-languages.ts';

// Load custom syntax grammars
import basicGrammar from './src/syntax/basic.tmLanguage.json' assert { type: 'json' };
import asm6502Grammar from './src/syntax/6502.tmLanguage.json' assert { type: 'json' };
import amosGrammar from './src/syntax/amos.tmLanguage.json' assert { type: 'json' };
import sinclairBasicGrammar from './src/syntax/sinclair-basic.tmLanguage.json' assert { type: 'json' };
import ca65Grammar from './src/syntax/ca65.tmLanguage.json' assert { type: 'json' };
import z80Grammar from './src/syntax/z80.tmLanguage.json' assert { type: 'json' };
import m68kGrammar from './src/syntax/m68k.tmLanguage.json' assert { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: 'https://code198x.stevehill.xyz',
  integrations: [mdx(), sitemap(), icon()],
  markdown: {
    // Use CSS Custom Highlight API for syntax highlighting
    remarkPlugins: [
      [remarkHighlightApi, {
        theme: 'dark-plus',
        loadLanguages: loadCode198xLanguages
      }]
    ],
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
