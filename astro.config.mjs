// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    mdx({
      syntaxHighlight: 'prism',
    })
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://code198x.stevehill.xyz',
  markdown: {
    syntaxHighlight: 'prism',
  },
});
