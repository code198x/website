# Code198x website

Astro 7 learning platform for Code198x: curriculum pages, module/unit catalogues, pattern library, systems pages, field notes, updates, and vault content.

The [project charter](https://github.com/code198x/docs/blob/main/PROJECT.md) defines the goals, audience and curriculum direction. Use the [current documentation index](https://github.com/code198x/docs/blob/main/README.md) for authoring specifications and the [component assessment](https://github.com/code198x/docs/blob/main/work.md#website-components) for proposed teaching interfaces.

Original prose is licensed under **CC BY 4.0**. See [LICENSE.md](LICENSE.md) for scope, attribution and exclusions; software and third-party material retain their own terms.

## Project structure

```text
website/
├── src/
│   ├── content.config.ts          # Astro content collection schemas
│   ├── content/
│   │   ├── modules/               # Module catalogue by platform
│   │   ├── units/                 # Unit catalogue by platform/module
│   │   ├── curriculum/            # Curriculum-facing prose
│   │   ├── patterns/              # Pattern library entries
│   │   ├── pattern-categories/
│   │   ├── pattern-difficulties/
│   │   ├── systems/               # System pages
│   │   ├── architectures/
│   │   ├── manufacturers/
│   │   ├── timeline/
│   │   ├── from-the-metal/
│   │   ├── field-notes/
│   │   ├── updates/
│   │   ├── vault/                 # Historical/reference articles
│   │   └── vault-categories/
│   ├── pages/                     # Astro routes
│   ├── layouts/
│   ├── components/
│   ├── lib/                       # Query/helper functions
│   └── syntax/
├── public/
├── scripts/
├── tests/
└── package.json
```

## Source of truth

- **Modules:** `src/content/modules/`
- **Units:** `src/content/units/`
- **Schemas:** `src/content.config.ts`
- **Query helpers:** `src/lib/modules.ts`, `src/lib/units.ts`, `src/lib/platforms.ts`, `src/lib/surfaces.ts`, and related files
- **Sample code:** sibling repo `../code-samples/`

Do not duplicate live module counts or availability in README files. Use the content collections as the current state.

The [family progress pages](docs/family-progress.md) consume a reviewed generated
public snapshot; that guide covers validation and refresh.

## Commands

Run commands from this directory:

| Command | Action |
|---|---|
| `npm install` | Install dependencies. |
| `npm run ui:fetch` | Fetch the pinned House198x kit and provision its self-hosted fonts. |
| `npm run dev` | Start the Astro dev server at `localhost:4321`. |
| `npm run build` | Build the production site, run redirect noindex marking, and index with Pagefind. |
| `npm run bundles` | Copy the pinned browser player and NES assembler from `node_modules` into `public/`. `dev`, `build` and `check` run it first. |
| `npm run workbook:build` | Rebuild the first-session learner and teacher PDFs; see [workbook editing instructions](public/workbooks/spectrum-basic-first-session/README.md). |
| `npm run preview` | Preview the production build locally. |
| `npm run check:content` | Run quick template, catalogue, imagery and Vault-link checks (also the small CI smoke check). |
| `npm run check:types` | Run `astro check` and fail on any type error not in `scripts/type-baseline.json` (the errors that predate it; the list may only shrink). |
| `npm run check` | Run local unit, type, content and prepared-player/assembler checks. |
| `npm run check:release` | Run local checks, announcement regressions, production build, focused browser/accessibility checks and offline built-site links. Needs prepared sibling assets, Playwright Chromium and lychee. |
| `npm test` | Run the Vitest unit tests under `src/**/*.test.ts`. |
| `npm run test:e2e` | Run Playwright end-to-end tests. |
| `npm run test:a11y` | Run accessibility-focused Playwright tests. |
| `npm run prose:check` | Run Vale prose checks and the prose readability report. |
| `npm run surfaces:gaps` | Report support-surface catalogue gaps. |

### Local release checks

Run `npm run check:release` before a release when you want the full local
check. Prepare the sample downloads with `scripts/build-artefacts.sh ../code-samples`;
the player, assembler and decoder come from `npm ci`. Install Playwright
Chromium with `npx playwright install chromium` and provide `lychee` on PATH.
`CODE_SAMPLES_PATH` overrides the usual family checkout path. The command stops
at the first failing check.

`npm run build` generates the site and search index; it does not run tests.
CI runs quick content checks only. Pages builds the required assets and site,
then publishes; browser tests, link audits and announcement regressions run
locally. The payload builder still validates messages as part of preparing
announcements. The wider end-to-end and full-site accessibility suites remain
available as separate local commands.

### House198x kit

The site consumes the shared [198x-ui](https://github.com/stevehill1981/198x-ui)
kit at commit `7eda45e1c2f8b8f919359c971b2e210822e431f2` (the approved paper and magazine foundation). `predev` and `prebuild` run `scripts/fetch-ui.sh`, which
checks out that revision into ignored `_198x-ui/` and copies its font files to the
ignored `public/fonts/` directory. This keeps local development and CI on the
same pinned components and preserves self-hosted font delivery. Override the
pin for a development session with `UI_REF=vX.Y.Z npm run dev` (or supply
the same variable to `npm run build`). Update the documented pin and validate
the site before changing the default.

### Magazine presentation

`Layout.astro` supplies the shared navigation, section mast and centred 1264px page frame.
`PageMasthead` and `PageHeader` serve system gateways, directories and editorial pages;
reading text keeps a bounded measure while browsing grids use the available width.
Site additions to the family palette live in `src/styles/site-tokens.css`; component
rules refer to those tokens rather than specifying their own colours.

Curate Vault features in `src/data/vault-features.ts`. Select a reviewed article,
write its placement headline and deck, choose images already used in that article,
and list related article identifiers in reading order. The build validates those
references. Category colours come from `src/lib/vault-colours.ts` and never recolour
captures.

`SourceDrawer` provides the same native source disclosure for BASIC, Spectrum
assembly and NES assembly. `LessonMachine` and `LessonExperimentButton` allow
several authored experiments to share one running machine and keep separate source
edits. Meteor Storm unit 28 uses this treatment on its canonical lesson route.
Existing download, keyboard, sound, inspection and run-panel behaviour remains in
the underlying player components.

### `<NativeImage>` needs a Rust toolchain

A page that imports `src/components/NativeImage.astro` decodes a retro image
file (ZX Spectrum `SCREEN$`, C64, Amiga) at build time with the Play198x
decoder, the `@play198x/web` npm dependency. `npm ci` is all it needs.

House module overviews can supply `entryAdvice: { message, label, href }` in frontmatter to place a useful route beside their start links. Keep it optional advice rather than a completion gate.

## Browser bundles

The browser player (`@emu198x/player`), the NES assembler (`@asm198x/mos6502`)
and the image decoder (`@play198x/web`) are npm dependencies at exact versions.
Each is built once by the project that owns it and published from that
project's release, with npm provenance (umbrella
`decisions/browser-bundles-ship-as-npm-packages.md`). This site compiles no
Rust and holds no firmware: the player's Spectrum module already carries the
48K ROM. Dependabot opens a pull request when a new version is published; the
deploy stages the pinned bundles, then checks the player and runs the NES
assembler against the lesson cartridge before building.

## Discord announcements

The Pages workflow announces newly live RSS entries after deployment. The feed-diff and payload builders live in `scripts/discord-new-items.py` and `scripts/discord-payloads.py`. Run their offline regression checks with `python3 -m unittest discover -s scripts -p 'test_discord_*.py'`.

The retained `new-items` artifact contains both the feed difference and prepared messages. Later deployments do not retry failed delivery. Inspect channel delivery before any recovery to avoid duplicates; see [the announcement guide](https://github.com/code198x/docs/blob/main/website.md#discord-announcements).

## Adding or changing content

1. Add or update the module entry under `src/content/modules/[platform]/`.
2. Add or update the unit catalogue under `src/content/units/[platform]/`.
3. Add or update routed page content/components under `src/pages/` when the module needs a public route or custom page.
4. Add or update learner-facing source in `../code-samples/` when a unit references runnable code.
5. Run `npm run build` and the relevant tests before publishing.

## Conventions

- Keep status in content collections, not prose mirrors.
- Keep historical/reference articles in `src/content/vault/` or explicit archive areas.
- Prefer shared helpers in `src/lib/` over per-page ad hoc catalogue queries.
- Follow the project British English convention except for technical terms such as `program`.

## Live site

[code198x.com](https://code198x.com)

## Browser players

The player is the pinned `@emu198x/player` package, staged into
`public/emulators/` by `npm run bundles`; that directory is generated and
ignored. To change the player, change Emu198x's `web-player/`, release Emu198x,
and take the new version through the Dependabot pull request. Both sites mount the same inline custom element, inheriting their typography
and theme colours. Cartridge selection starts play; firmware is disclosed only
for computer systems. Both sites use the same source
and catalogue in Emu198x's `web-player/`; change the player there, not here.
The local catalogue exposes 30 families and 91 selectable models, with runtime-owned
firmware/media setup. Broader software and real-browser performance validation are still
to be done, but no longer block publication. No proprietary firmware or
visitor media is copied into the site. The player offers explicit device saves, downloadable save files, supported
disk-image exports, optional remembered firmware and fullscreen. Storage is
local to this site and original files are never overwritten.

The shared player also provides owned demo cartridges, visible control help,
remembered presentation and console-key preferences, and diagnostic text for
user-submitted bug reports. Demo sources, provenance and licences ship beside
the binaries. Lessons with staged runnable outputs expose a Run this lesson player pinned
to the lesson model; cumulative-step units use their final built step.

The NES introductory lesson uses `NesAssembleAndRun`: the maintained source is
assembled in a worker by the pinned `@asm198x/mos6502` package, then handed to
the shared player's `loadMedia()` API. `npm run check` compares its output with
the native-built lesson download.
`inlinePlayer: true` on a unit means its authored content supplies the player,
so the layout omits the additional generic launcher.

`PLAYWRIGHT_BROWSERS_PATH=/path/to/browsers node scripts/verification/nes-assembly.mjs`
checks the live lesson in Chrome and WebKit against the local preview. `SITE_URL`,
`CODE_SAMPLES_PATH`, `BLUE_CARTRIDGE` and `OUTPUT_DIR` can override its inputs.
The worker loads only when assembling or downloading a cartridge; source edits
stay local. Downloads always assemble the current editor contents. Failed builds
leave the running machine intact and report source-line diagnostics.

## Shared site components

Preview the actual components at `/catalogue/site-components/` under `npm run dev`.
The preview uses the site layout; resize the browser to check narrow and wide
variants. Like the family catalogue, it emits no production page.

These components belong to Code198x. The pinned `198x-ui` kit owns family primitives;
page composition stays here. Keep approved page geometry when adopting a component.

| Component | Responsibility and deliberate variants |
| --- | --- |
| `PageFrame` | One centred 1264px outer frame with responsive gutters, enforced by `Layout` on every public page. Header, breadcrumbs, title bands and footer align. Narrower reading columns sit inside it; pages cannot select another outer width or gutter. `opening="compact"` supplies the 24px index opening. |
| `ReadingLayout` | Reading column and sticky contents rail, hidden below 1101px. Give each instance a unique `id`; its contents links scan only that instance. Page typography and sections remain in its slot. |
| `MagazineSectionHeading` | Paired magazine title and introduction. Named `title` slot accepts authored line breaks/emphasis; the default slot is introduction text. `ending="none"` supports the closing invitation. |
| `DirectorySearch` / `DirectoryStatus` | Labelled field and atomic live result summary. Search is a field, not a nested form. `filter` belongs inside the owner’s facet form; `inline` includes the search icon and clear button. Require a unique field `id`; pass `controls` when the results container has an ID. Owners supply surrounding layout and filtering rules. |
| `EditorialArticleLayout` | Site metadata, breadcrumbs and common article composition. Explicit `series` values preserve essay/Field Notes measures (65ch) and Updates (72ch); the header retains its separate measure. `metadata`, `hero` and `ending` slots preserve series content. `EditorialArticle` is the same inner composition used in previews. |

`npm run build` verifies that every authored public page uses the shared shell.
Build before running `tests/page-frame.spec.ts`: the browser checks choose a
representative from every rendering family in `dist/`, then test the frame at
390px, 1440px and 1920px.

Directory owners call `bindDirectoryReset(root, input, resetFilters)` once during
initialisation. It clears the query, lets the owner reset facets and results, then
returns focus. `{ escape: true }` preserves Vault’s Escape shortcut. URL handling,
matching, alphabet controls and year grouping remain with their directories.

For a reading page:

```astro
<PageFrame as="article">
  <PageHeader title="Page title" />
  <ReadingLayout id="page-reading">
    <section><h2 id="first-section">First section</h2><!-- content --></section>
  </ReadingLayout>
</PageFrame>
```

Run `npx playwright test tests/site-components.spec.ts tests/page-frame.spec.ts`
for component behaviour and frame checks. Directory regressions live in
`pattern-library.spec.ts`, `timeline.spec.ts` and `vault-reading.spec.ts`.
For spacing changes, compare the affected approved pages before and after; a
component preview alone cannot establish that the consuming pages stayed intact.
