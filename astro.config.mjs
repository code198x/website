// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { bundledLanguages } from 'shiki';

// Load custom BASIC syntax grammar
import basicGrammar from './src/syntax/basic.tmLanguage.json' assert { type: 'json' };

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
        }
      ],
      theme: 'dark-plus'
    }
  }
});
