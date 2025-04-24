import { defineConfig } from 'astro/config';
import rss from '@astrojs/rss';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://code198x.stevehill.xyz',
  base: '/',
  siteMetadata: {
    title: 'Code198x',
    description: 'Exploring programming for vintage computers and consoles.',
  },
  integrations: [
    rss({
      // Custom configuration options here, if needed
      // See https://docs.astro.build/en/guides/integrations-guide/rss/
    }),
    sitemap(),
  ],
}); 