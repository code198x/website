# Publish the reviewed project overview within Code198x

> Planning record. Rendering and refresh authority: `docs/family-progress.md`.

Agreed placement: `/family/progress` and `/family/progress/evidence`, linked from
Family and About. Use the existing site layout, frame, typography, navigation
and the active paper palette. Retain the approved emphasis on Code198x, Emu198x and Asm198x and
their adjustable working checkpoints. Build a reviewable change; do not deploy.

1. Import only the reviewed public `overview.json` into
   `src/data/project-progress.json`, following the committed generated-data
   convention used by the colophon. Add `src/lib/project-progress.mjs` and
   `scripts/import-project-progress.mjs` to reject empty/incomplete projections,
   unsafe links and private data before any write. Preserve prior data on error.
   No build-time network requests, new credentials or dependencies.
2. Add `src/pages/family/progress/index.astro`, `evidence.astro` and `snapshot.json.ts`
   using `Layout` and `PageFrame`. Render the same data, with the snapshot date
   and historical scope visible. Keep working checkpoints separate from committed
   plans. Use `src/styles/project-progress.css` for styles scoped to this surface.
3. Link the pages from `src/pages/family.astro` and `about.astro`. Document the
   regenerate → import → review refresh procedure in `docs/family-progress.md`.
   This is a dated generated snapshot, not a live status feed or separate store.
4. Add meaningful invalid-input/atomic-write controls and browser checks for
   three project sections, five detailed results, cross-links, dated freshness,
   keyboard disclosures, frame alignment, narrow layouts and both OS colour preferences.
   Add a focused validation gate to CI; run relevant unit/content checks and the
   production build. Inspect the actual built pages, not only a dev route.
5. Push a website PR for review, with local preview/screenshots and limitations.
   Do not merge/deploy. Preserve unrelated untracked site-review work.

Task scratch: `/tmp/code198x-family-progress`; use existing dependency/build
caches. Track and stop task-owned preview/browser processes. Retain review
screenshots and proof under umbrella `output/code198x-family-progress-review/`.
No temporary worktree or clone is planned.
