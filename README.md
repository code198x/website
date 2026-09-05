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

## Commands

Run commands from this directory:

| Command | Action |
|---|---|
| `npm install` | Install dependencies. |
| `npm run ui:fetch` | Fetch the pinned House198x kit and provision its self-hosted fonts. |
| `npm run dev` | Start the Astro dev server at `localhost:4321`. |
| `npm run build` | Build the production site, run redirect noindex marking, and index with Pagefind. |
| `npm run build:wasm` | Build the `play198x-web` decoder that `NativeImage.astro` reads at build time. Run before `npm run build` on any page using `<NativeImage>`. |
| `npm run preview` | Preview the production build locally. |
| `npm test` | Run the Vitest unit tests under `src/**/*.test.ts`. |
| `npm run test:e2e` | Run Playwright end-to-end tests. |
| `npm run test:a11y` | Run accessibility-focused Playwright tests. |
| `npm run prose:check` | Run Vale prose checks and the prose readability report. |
| `npm run surfaces:gaps` | Report support-surface catalogue gaps. |

### House198x kit

The site consumes the shared [198x-ui](https://github.com/stevehill1981/198x-ui)
kit at the `v0.5.1` tag. `predev` and `prebuild` run `scripts/fetch-ui.sh`, which
checks out that tag into ignored `_198x-ui/` and copies its font files to the
ignored `public/fonts/` directory. This keeps local development and CI on the
same pinned components and preserves self-hosted font delivery. Override the
pin for a development session with `UI_REF=vX.Y.Z npm run dev` (or supply
the same variable to `npm run build`). Update the documented pin and validate
the site before changing the default.

### `<NativeImage>` needs a Rust toolchain

A page that imports `src/components/NativeImage.astro` decodes a retro image
file (ZX Spectrum `SCREEN$`, C64, Amiga) at build time using `play198x-web`, a
Rust/wasm crate from the sibling `play198x/play198x` repo — it is not an npm
dependency. Building that page locally needs:

1. A Rust toolchain (see `play198x/play198x/rust-toolchain.toml` for the pinned
   channel) with the `wasm32-unknown-unknown` target, and `wasm-pack`.
2. A checkout of `play198x/play198x` somewhere on disk.
3. Two environment variables: `PLAY198X_PATH` (for `npm run build:wasm`,
   pointing at that checkout) and `PLAY198X_WASM_PATH` (for `npm run build`
   and `npm test`, pointing at
   `<checkout>/crates/play198x-web/pkg-node`, the directory `build:wasm`
   writes to).

Tests that do not load the decoder can run without `PLAY198X_WASM_PATH`; decoder-dependent tests then skip. A production build containing native images needs the decoder. CI builds and supplies it before testing and rendering.

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
