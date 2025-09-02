// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    mdx({
      syntaxHighlight: 'prism',
    }),
    sitemap()
  ],
  site: 'https://code198x.stevehill.xyz',
  markdown: {
    syntaxHighlight: 'prism',
  },
});
