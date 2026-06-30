// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { satteri } from '@astrojs/markdown-satteri';
import { code198xHighlightPlugin } from './src/lib/satteri-highlight.ts';

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
    processor: satteri({ hastPlugins: [code198xHighlightPlugin({ mdx: true })] }),
    syntaxHighlight: false,
  },
});
