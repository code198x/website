// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { bundledLanguages } from 'shiki';

// Load custom syntax grammars
import basicGrammar from './src/syntax/basic.tmLanguage.json' assert { type: 'json' };
import asm6502Grammar from './src/syntax/6502.tmLanguage.json' assert { type: 'json' };
import amosGrammar from './src/syntax/amos.tmLanguage.json' assert { type: 'json' };
import sinclairBasicGrammar from './src/syntax/sinclair-basic.tmLanguage.json' assert { type: 'json' };
import ca65Grammar from './src/syntax/ca65.tmLanguage.json' assert { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: 'https://code198x.stevehill.xyz',
  integrations: [mdx()],
  markdown: {
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
        }
      ],
      theme: 'dark-plus'
    }
  }
});
