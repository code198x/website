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
| `npm run preview` | Preview the production build locally. |
| `npm run test:e2e` | Run Playwright end-to-end tests. |
| `npm run test:a11y` | Run accessibility-focused Playwright tests. |
| `npm run prose:check` | Run Vale prose checks and the prose readability report. |
| `npm run surfaces:gaps` | Report support-surface catalogue gaps. |

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
