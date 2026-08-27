// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import {
  code198xHighlightPlugin,
  code198xTableAccessibilityPlugin,
} from './src/lib/satteri-highlight.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://code198x.com',
  // Redirects from the pre-modules `game-NN-slug` landing URLs to the bare module
  // slugs. Base pages only (Astro can't validate a spread destination against our
  // statically-generated routes); focused on the shipped Spectrum BASIC games plus
  // the Shadowkeep flagship. Cheap insurance, not exhaustive — see
  // decisions/modules-not-games.md.
  redirects: {
    // Deluxe Paint was filed under both games/ and tools/. It is a tool.
    '/vault/games/deluxe-paint': '/vault/tools/deluxe-paint',
    // Vault duplicate merges: one entry per subject, old slugs preserved as
    // redirects so existing links and bookmarks still land on the right page.
    '/vault/companies/delphine': '/vault/companies/delphine-software',
    '/vault/systems/mega-drive': '/vault/systems/sega-mega-drive',
    '/vault/magazines/zzap64': '/vault/magazines/zzap-64',
    '/vault/communities/demo-scene-101': '/vault/communities/demo-scene',
    '/vault/techniques/raster-tricks-101': '/vault/techniques/raster-tricks',
    '/vault/people/tim-stamper': '/vault/people/stamper-brothers',
    // Duplicate entries merged 2026-08-25: each game had two pages differing
    // only in slug punctuation, both AI-drafted and unreviewed.
    '/vault/games/sonic': '/vault/games/sonic-the-hedgehog',
    '/vault/games/outrun': '/vault/games/out-run',
    '/vault/tools/sinclair-basic-tool': '/vault/tools/sinclair-basic',
    // Second pass 2026-08-25: hyphenated slug wins, richest body wins.
    '/vault/games/simcity': '/vault/games/sim-city',
    '/vault/games/rollercoaster-tycoon': '/vault/games/roller-coaster-tycoon',
    // xcom held a second copy of the 1994 original; the reboot era is now
    // x-com-ufo-defense's sibling rather than a section inside it.
    '/vault/games/xcom': '/vault/games/x-com-ufo-defense',
    // "Arcade conversion" is a provenance, not a genre — the entry said so
    // itself while filed under genres/. It is culture now, and culture/arcade-ports
    // was the same subject written twice.
    '/vault/genres/arcade-conversion': '/vault/culture/arcade-conversion',
    '/vault/culture/arcade-ports': '/vault/culture/arcade-conversion',
    // Singular/plural duplicates that survived the earlier pass because it only
    // compared entries within a category.
    '/vault/culture/racing-games': '/vault/genres/racing-game',
    '/vault/culture/arcade-games': '/vault/genres/arcade-game',
    // Filed under genres/ and not genres: a place, a period, a community and a
    // design topic.
    '/vault/genres/arcade-culture': '/vault/culture/arcade-culture',
    '/vault/genres/golden-age-arcade': '/vault/phenomena/golden-age-arcade',
    '/vault/genres/fighting-game-community': '/vault/communities/fighting-game-community',
    '/vault/genres/puzzle-game-design': '/vault/techniques/puzzle-game-design',
    // Duplicates within communities/, which the first pass also missed: both
    // BBS entries open "before the internet, dial in with a modem" and cite CBBS
    // 1978; both chiptune entries carry the same sound-chip table.
    '/vault/communities/bbs-culture': '/vault/communities/bbs-scene',
    '/vault/communities/chiptune': '/vault/communities/chiptune-scene',
    '/vault/communities/esports': '/vault/communities/esports-origins',
    // Found by content similarity rather than by name: all three pairs claim the
    // same lifespan, so they are one subject written twice, not a rename split.
    '/vault/games/dune-2': '/vault/games/dune-ii',
    '/vault/companies/lucasfilm-games': '/vault/companies/lucasarts',
    '/vault/companies/epic-megagames': '/vault/companies/epic-games',
    // The Quill is software, so it lives in tools/ with PAW and GAC.
    '/vault/techniques/quill': '/vault/tools/the-quill',
    '/vault/companies/williams': '/vault/companies/williams-electronics',
    '/vault/companies/williams-arcade': '/vault/companies/williams-electronics',
    '/vault/companies/black-isle': '/vault/companies/black-isle-studios',
    '/vault/companies/camelot': '/vault/companies/camelot-software',
    '/vault/companies/westwood': '/vault/companies/westwood-studios',
    '/vault/companies/midway-games': '/vault/companies/midway',
    '/vault/companies/squaresoft': '/vault/companies/square',
    // people/david-jones held two copies of the DMA Design founder and no entry
    // for the Mastertronic Magic Knight author of the same name. The bare slug
    // redirects to the person every existing link meant; the other is qualified.
    '/vault/people/david-jones': '/vault/people/dave-jones',
    '/sinclair-zx-spectrum/basic/game-01-story-builder': '/sinclair-zx-spectrum/basic/story-builder',
    '/sinclair-zx-spectrum/basic/game-02-lucky-number': '/sinclair-zx-spectrum/basic/lucky-number',
    '/sinclair-zx-spectrum/basic/game-03-oracle-stone': '/sinclair-zx-spectrum/basic/oracle-stone',
    '/sinclair-zx-spectrum/basic/game-04-reflex': '/sinclair-zx-spectrum/basic/reflex',
    '/sinclair-zx-spectrum/basic/game-05-dice-roller': '/sinclair-zx-spectrum/basic/dice-roller',
    '/sinclair-zx-spectrum/basic/game-06-bright-spark': '/sinclair-zx-spectrum/basic/bright-spark',
    '/sinclair-zx-spectrum/basic/game-07-hi-lo': '/sinclair-zx-spectrum/basic/hi-lo',
    '/sinclair-zx-spectrum/basic/game-08-touchdown': '/sinclair-zx-spectrum/basic/touchdown',
    '/sinclair-zx-spectrum/assembly/game-01-shadowkeep': '/sinclair-zx-spectrum/assembly/shadowkeep',
    // /browse retired — the fleet lenses (era/region/maker/tier) cover its live axes;
    // the genre/technique/difficulty scaffolds were never built. Technique's real home
    // is the Pattern Library.
    '/browse': '/systems',
    '/browse/by-platform': '/systems',
    '/browse/by-era': '/systems',
    '/browse/by-region': '/systems/by-region',
    '/browse/by-genre': '/systems',
    '/browse/by-difficulty': '/systems',
    '/browse/by-technique': '/patterns',
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
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: satteri({
      hastPlugins: [
        code198xHighlightPlugin({ mdx: true }),
        code198xTableAccessibilityPlugin(),
      ],
    }),
    syntaxHighlight: false,
  },
});
