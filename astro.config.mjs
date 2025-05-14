// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://code198x.stevehill.xyz',
  output: 'static',
  integrations: [mdx()],

  markdown: {
    syntaxHighlight: 'prism',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});