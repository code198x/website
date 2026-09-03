# Code198x website

Astro 7 learning platform for Code198x: curriculum pages, module/unit catalogues, pattern library, systems pages, field notes, updates, and vault content.

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
| `npm run dev` | Start the Astro dev server at `localhost:4321`. |
| `npm run build` | Build the production site, run redirect noindex marking, and index with Pagefind. |
| `npm run build:wasm` | Build the `play198x-web` decoder that `NativeImage.astro` reads at build time. Run before `npm run build` on any page using `<NativeImage>`. |
| `npm run preview` | Preview the production build locally. |
| `npm test` | Run the Vitest unit tests under `src/**/*.test.ts`. |
| `npm run test:e2e` | Run Playwright end-to-end tests. |
| `npm run test:a11y` | Run accessibility-focused Playwright tests. |
| `npm run prose:check` | Run Vale prose checks and the prose readability report. |
| `npm run surfaces:gaps` | Report support-surface catalogue gaps. |

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

You only need any of this to build a page that uses `<NativeImage>`. Without
`PLAY198X_WASM_PATH` set, `npm run build` and `npm test` both work: the nine
unit tests that load the decoder skip, and the rest run. CI sets the variable
and builds the decoder first, so those nine still run for real on every pull
request — see code198x/website#385.

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
