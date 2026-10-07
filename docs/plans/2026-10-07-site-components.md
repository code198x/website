# Share approved site components

Status: extraction approved on 7 October. Preserve the approved appearance and
behaviour, including deliberate full-width and bounded page variants. Keep page
composition in Code198x; this work adds no dependency or shared-kit release.

## Baseline and scope

Capture the current rendered geometry and screenshots at 390px and 1440px before
editing. Include About, Standards, Press, Teaching, the three editorial indexes
and one article from each series, the homepage, Patterns, a Vault category and
a Timeline decade. Existing page-frame tests cover 1920px and both themes.

1. Add `src/components/ReadingLayout.astro` for the repeated reading/contents
   grid. Migrate `src/pages/{about,standards,press,teaching}.astro`. Expand
   `PageFrame.astro` only with the existing compact opening, and adopt it in
   the three editorial indexes and remaining reading pages using explicit
   current widths. Remove the superseded local geometry rules.
2. Add `MagazineSectionHeading.astro` for the homepage's four repeated heading
   groups, preserving markup, text and approved responsive styles.
3. Add shared `DirectorySearch.astro` and `DirectoryStatus.astro` primitives
   for `PatternDirectory.astro`, `TimelineEvents.astro`, `VaultDirectory.astro`.
   Preserve each directory's query/facet rules and URL behaviour. Share reset
   control wiring where it is identical; test zero results, clear, keyboard
   focus and navigation reinitialisation. Keep no-JavaScript fallbacks.
4. Add `src/layouts/EditorialArticleLayout.astro` and an explicit shared prose
   stylesheet. Migrate FromTheMetalLayout, FieldNotesLayout and UpdatesLayout,
   preserving their metadata, hero, endings and series-specific details.
   Move only shared rules from `styles/editorial.css` into this owner.
5. Add actual-component previews to `/catalogue/site-components/` and document
   component responsibilities/variants in README.md. Add focused browser
   regression checks under `tests/site-components.spec.ts`.

## Verification and delivery

For each commit-sized extraction, run the build and relevant focused checks.
Compare all affected baseline captures and measured geometry in one batched
narrow/wide pass; resolve any changes together and confirm once. Test catalogue
instances and long headings, existing page-frame regressions, directory
interactions and editorial reading styles. Run the Impeccable detector once on
finished UI targets and triage against the approved visual identity. Complete
unit/content checks and production build, then review, publish and verify the
changed routes. Preserve unrelated untracked review files.

## Reading extraction evidence

Seven affected routes match the pre-change rendered heading, paragraph and input
geometry at 390px and 1440px, including full page height. Standards retains its
1264px frame and 32/20/12px editorial gutters; Press retains its actual full-width
frame with no opening padding. These differ from what the legacy selectors alone
suggested. Baseline captures and measurements are in `/tmp/198x-components-before`.
The production build, eight reading/navigation checks and seven existing frame
checks pass. The new test initially assumed heading margins could not collapse
inside a section; its corrected invariant checks column bounds and rail alignment.

## Component and browser checks

- Shared magazine headings, directory controls and editorial articles are extracted.
  Directory matching and URL rules remain with each owner. Series metadata and
  endings remain in their existing layouts.
- `/catalogue/site-components/` renders the actual components in the real site
  layout. The built `dist/` contains no catalogue routes.
- `npm run check`: 218 unit tests passed, 9 skipped; content, sample assembler
  and browser-player checks passed. Existing Vault balance advisories remain.
- Production build passed. Focused production Playwright run: 64 passed on an
  isolated Astro preview. Component-preview checks: 2 passed. The initial run
  against a reused static server had two failures (Systems font style and a
  Pattern Library control timeout); neither reproduced in the isolated run.
- The catalogue had no axe WCAG A/AA violations at 390px or 1440px. The current
  site exposes one palette, so changing an old localStorage theme preference is
  not evidence of dark-theme coverage.
- The detector found only the existing blockquote border moved into
  `editorial-article.css`. A file-scoped `side-tab` exception records why that
  approved quotation treatment stays.

The development comparison covers 28 captures and 3,977 elements. All measured
rectangles and full-page heights match; eight homepage headings differ only by
at most 0.0002px of computed line-height rounding. See the JSON report and selected
screenshots in `2026-10-07-site-components/`.

A separate build of the starting revision exposed existing development/production
frame differences. Standards was bounded in development but full-width in
production; Vault categories were the reverse. The approved follow-up is one centred 1264px frame on every public page, in
both development and production. See `2026-10-07-one-page-frame.md`; this
supersedes the earlier preservation of per-page width variants.
