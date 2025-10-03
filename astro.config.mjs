// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load custom BASIC syntax grammar
const basicGrammar = JSON.parse(
  readFileSync(join(__dirname, 'src/syntax/basic.tmLanguage.json'), 'utf-8')
);

// https://astro.build/config
export default defineConfig({
  site: 'https://code198x.stevehill.xyz',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      langs: [
        {
          id: 'basic',
          scopeName: 'source.basic.c64',
          grammar: basicGrammar,
          aliases: ['c64basic', 'commodore-basic']
        }
      ],
      theme: 'dark-plus'
    }
  }
});
