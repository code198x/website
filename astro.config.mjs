// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import {
  code198xHighlightPlugin,
  code198xTableAccessibilityPlugin,
} from './src/lib/satteri-highlight.ts';
import { legacySystemRedirects } from './src/lib/legacy-system-redirects.mjs';
import { unreviewedVaultPaths } from './src/lib/unreviewed-vault-paths.mjs';

const unreviewedVault = unreviewedVaultPaths();
import { foundationsSplitRedirects } from './src/lib/foundations-split-redirects.mjs';

import { basicRetirementRedirects } from './src/lib/basic-retirement-redirects.mjs';
import { diceRollerRedirects } from './src/lib/dice-roller-redirects.mjs';
import { cipherRedirects } from './src/lib/cipher-redirects.mjs';
import { yearfallRedirects } from './src/lib/yearfall-redirects.mjs';
import { cavernsRedirects } from './src/lib/caverns-redirects.mjs';
import { threeInARowRedirects } from './src/lib/three-in-a-row-redirects.mjs';
import { locksmithRedirects } from './src/lib/locksmith-redirects.mjs';
import { cratesRedirects } from './src/lib/crates-redirects.mjs';
import { sonarRedirects } from './src/lib/sonar-redirects.mjs';
import { touchdownRedirects } from './src/lib/touchdown-redirects.mjs';
import { brightSparkRedirects } from './src/lib/bright-spark-redirects.mjs';
import { meetBasicRedirects } from './src/lib/meet-basic-redirects.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://code198x.com',
  // Local browser API trials can use an unpublished wasm-bindgen web build.
  // No local binaries or firmware are copied into the repository.
  vite: {
    resolve: { alias: process.env.SPECTRUM_WEB_PACKAGE ? {
      '@emu198x/zx-spectrum': `${process.env.SPECTRUM_WEB_PACKAGE}/emu198x_spectrum_web.js`,
    } : {} },
  },
  // Redirects from the pre-modules `game-NN-slug` landing URLs to the bare module
  // slugs. Base pages only (Astro can't validate a spread destination against our
  // statically-generated routes); focused on the shipped Spectrum BASIC games plus
  // the Shadowkeep flagship. Cheap insurance, not exhaustive — see
  // decisions/modules-not-games.md.
  redirects: {
    "/systems/sinclair-zx-spectrum/basic/volley/review": "/systems/sinclair-zx-spectrum/basic/volley/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/overview": "/systems/sinclair-zx-spectrum/basic/volley/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/unit-01-move-a-ball": "/systems/sinclair-zx-spectrum/basic/volley/unit-01-move-a-ball/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/unit-02-give-it-a-direction": "/systems/sinclair-zx-spectrum/basic/volley/unit-02-give-it-a-direction/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/unit-03-use-the-whole-court": "/systems/sinclair-zx-spectrum/basic/volley/unit-03-use-the-whole-court/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/unit-04-move-the-paddle": "/systems/sinclair-zx-spectrum/basic/volley/unit-04-move-the-paddle/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/unit-05-make-contact-matter": "/systems/sinclair-zx-spectrum/basic/volley/unit-05-make-contact-matter/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/unit-06-keep-score-and-play-again": "/systems/sinclair-zx-spectrum/basic/volley/unit-06-keep-score-and-play-again/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/unit-07-colour-the-court": "/systems/sinclair-zx-spectrum/basic/volley/unit-07-colour-the-court/",
    "/systems/sinclair-zx-spectrum/basic/volley/review/unit-08-keep-the-ball-visible": "/systems/sinclair-zx-spectrum/basic/volley/unit-08-keep-the-ball-visible/",

    ...legacySystemRedirects(),
    ...foundationsSplitRedirects(),
    ...meetBasicRedirects(),
    ...brightSparkRedirects,
    ...touchdownRedirects,
    ...sonarRedirects,
    ...cratesRedirects,
    ...locksmithRedirects,
    ...threeInARowRedirects,
    ...cavernsRedirects,
    ...yearfallRedirects,
    ...cipherRedirects,
    ...diceRollerRedirects,
    ...basicRetirementRedirects,
    // Renamed 2026-09-03: the nav said "START HERE" while the page and its URL
    // said "Who this is for". The nav was the better of the two.
    '/who-this-is-for': '/start-here',
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
    '/vault/phenomena/video-game-crash': '/vault/phenomena/1983-crash',
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
    '/sinclair-zx-spectrum/basic/game-01-story-builder': '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/',
    '/sinclair-zx-spectrum/basic/game-02-lucky-number': '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-05-give-a-useful-clue/',
    '/sinclair-zx-spectrum/basic/game-03-oracle-stone': '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-09-choose-an-answer/',
    '/sinclair-zx-spectrum/basic/game-04-reflex': '/systems/sinclair-zx-spectrum/basic/',
    '/sinclair-zx-spectrum/basic/game-06-bright-spark': '/sinclair-zx-spectrum/basic/bright-spark',
    '/sinclair-zx-spectrum/basic/game-07-hi-lo': '/systems/sinclair-zx-spectrum/basic/',
    '/sinclair-zx-spectrum/basic/game-08-touchdown': '/sinclair-zx-spectrum/basic/touchdown',
    '/sinclair-zx-spectrum/assembly/game-01-shadowkeep': '/sinclair-zx-spectrum/assembly/shadowkeep',
    // Machines filed under hardware/ moved to systems/, where whole machines
    // belong. hardware/ keeps components, peripherals and add-ons. Old slugs
    // redirect so existing links and bookmarks still resolve.
    '/vault/hardware/dreamcast': '/vault/systems/sega-dreamcast',
    '/vault/hardware/naomi': '/vault/systems/sega-naomi',
    '/vault/hardware/vectrex': '/vault/systems/vectrex',
    '/vault/hardware/sega-saturn': '/vault/systems/sega-saturn',
    // playstation-hardware duplicated systems/playstation, which covers the same
    // silicon better from Sony's own manual. Merged; its sound system survives there.
    '/vault/hardware/playstation-hardware': '/vault/systems/sony-playstation',
    // culture/uk-games-industry restated culture/british-game-development at summary
    // length — same subject, a third the size, with its "Industry evolution" and
    // "Regional strengths" duplicating that entry's fuller "The transitions" and
    // "Regional clusters". Merged; its tax-relief material had no counterpart there
    // and survives as a new section.
    '/vault/culture/uk-games-industry': '/vault/culture/british-game-development',
    // culture/experimental-games and genres/art-games were the same subject: both
    // led on Passage, both ran the "are these really games?" debate, and each cited
    // the other as an overlap without being able to state a distinction. Merged into
    // art-games, which was the fuller entry; the tooling, distribution route and
    // later works came across.
    '/vault/culture/experimental-games': '/vault/genres/art-games',
    // Genre articles filed under culture/ moved to genres/, where a form of game
    // belongs; culture/ keeps subcultures, practices and business models. Three
    // more went to the category that describes them rather than the one they were
    // filed in. mmorpg-history and mud-history are retitled MMORPGs and MUDs,
    // because the entries describe genres rather than narrate histories.
    '/vault/culture/action-rpg': '/vault/genres/action-rpg',
    '/vault/culture/tactical-rpg': '/vault/genres/tactical-rpg',
    '/vault/culture/metroidvania': '/vault/genres/metroidvania',
    '/vault/culture/god-games': '/vault/genres/god-games',
    '/vault/culture/tycoon-games': '/vault/genres/tycoon-games',
    '/vault/culture/survival-games': '/vault/genres/survival-games',
    '/vault/culture/racing-simulation': '/vault/genres/racing-simulation',
    '/vault/culture/rail-shooters': '/vault/genres/rail-shooters',
    '/vault/culture/mmorpg-history': '/vault/genres/mmorpg-history',
    '/vault/culture/mud-history': '/vault/genres/mud-history',
    '/vault/culture/split-screen': '/vault/techniques/split-screen',
    '/vault/culture/episodic-gaming': '/vault/distribution/episodic-gaming',
    '/vault/culture/bbs-door-games': '/vault/communities/bbs-door-games',
    // culture/coverdisks and distribution/magazine-cover-disks covered the same
    // subject. Merged into the distribution entry, which is where cover-tapes
    // already lives; the 16-bit material and the £800 commissioning rate survive
    // there.
    '/vault/culture/coverdisks': '/vault/distribution/magazine-cover-disks',
    '/vault/hardware/galaksija': '/vault/systems/galaksija',
    '/vault/hardware/trs-80-color-computer': '/vault/systems/tandy-coco',
    '/vault/hardware/famiclone': '/vault/systems/famiclone',
    '/vault/hardware/game-and-watch': '/vault/systems/nintendo-game-and-watch',
    '/vault/hardware/nintendo-ds': '/vault/systems/nintendo-ds',
    // Vault system entries use the site's system ID where one exists, otherwise
    // the family's <manufacturer>-<model> convention (umbrella decision
    // by-system-slug-convention.md). The old slugs redirect.
    '/vault/systems/zx-spectrum': '/vault/systems/sinclair-zx-spectrum',
    '/vault/systems/zx81': '/vault/systems/sinclair-zx81',
    '/vault/systems/nes': '/vault/systems/nintendo-entertainment-system',
    '/vault/systems/n64': '/vault/systems/nintendo-64',
    '/vault/systems/dreamcast': '/vault/systems/sega-dreamcast',
    '/vault/systems/game-gear': '/vault/systems/sega-game-gear',
    '/vault/systems/vic-20': '/vault/systems/commodore-vic-20',
    '/vault/systems/playstation': '/vault/systems/sony-playstation',
    '/vault/systems/playstation-2': '/vault/systems/sony-playstation-2',
    '/vault/systems/trs-80-color-computer': '/vault/systems/tandy-coco',
    '/vault/systems/game-and-watch': '/vault/systems/nintendo-game-and-watch',
    '/vault/systems/naomi': '/vault/systems/sega-naomi',
    '/vault/systems/xbox': '/vault/systems/microsoft-xbox',
    // Processor entries use the bare part number, like 6502, 68000 and z80.
    '/vault/hardware/motorola-6809': '/vault/hardware/6809',
    // The ZX81's system ID follows the same convention.
    '/systems/zx81': '/systems/sinclair-zx81',
    '/zx81': '/systems/sinclair-zx81',
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
  integrations: [
    mdx(),
    // Unreviewed Vault entries carry a robots noindex tag; leave them out of
    // the sitemap too, so search engines are not invited to the same pages.
    sitemap({
      filter: (page) => !unreviewedVault.has(new URL(page).pathname),
    }),
  ],
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
