# Roll out the approved Code198x design

Approved 2026-10-06 after the homepage, learning routes, lesson layouts and editable BASIC/modal previews were accepted. The reference is `198x/docs/plans/2026-10-05-code-visual-direction/`; the rejected curriculum-browser experiment is excluded. Scope is Code198x production source, with real content and existing route/data contracts. Publishing is a separate final step after release checks; no new content announcements.

1. **Identity and shared shell.** Replace the old plate in `src/layouts/Layout.astro` with the approved vector, copy identity artwork to `public/brand/`, migrate breadcrumb styling in `src/components/Breadcrumbs.astro`, retain search, responsive navigation, footer resources, family links and rights notice. Add scoped rollout CSS. Verify complete mark, current navigation, narrow breadcrumbs and keyboard focus.
2. **Homepage and entry routes.** Port approved homepage and Start Here composition to `src/pages/index.astro` and `start-here.astro`, reusing approved imagery with provenance and converting preview links to production routes. Migrate `systems.astro` and `foundations.astro` using their existing catalogues, keeping published/planned distinctions. Keep `/curriculum` reachable as the existing secondary map. Verify destination links and source-backed availability.
3. **Learning templates.** Bring `SystemOverview.astro`, `TrackGames.astro`, `SystemHero.astro`, `ModuleOverviewLayout.astro`, `ModuleLayout.astro` and `UnitLayout.astro` into the approved hierarchy. Keep complete authored lessons and catalogue-derived navigation. Preserve uncropped captures and bounded captions. Verify C64/Safe Cracker, Foundations/Basics and the four machine routes.
4. **Editable BASIC and modal.** Port BasicListing/change tracking to production `BasicAndRun.astro` without changing its author API. Generalise the accepted Spectrum modal to each instance and Astro navigation; keep download, sound, reset, transcript and optional input keys. Switch the generic `RunPanel.astro` from sidebar placement to the approved modal interaction while retaining the shared multi-system player. Verify errors before session replacement, edits, highlighting, snapshot restart, Escape/BREAK, close/pause/return, multiple instances and navigation disposal.
5. **Component previews and checks.** Extend the development-only catalogue with actual adopted components. Run unit/content/build/release checks appropriate to changed code; inspect a bounded batch of desktop/mobile pages and correct material issues. Record checks and any release blockers. No new dependencies, no kit release or sibling-site migration in this change.

## System adoption

This rollout applies the incumbent family system; `198x/DESIGN.md`, its sidecar and the family visual-identity decision retain authority. Production keeps Code’s existing `#a93800` page/control ink rather than the preview’s red; wordmark artwork retains its separately approved colours. The adopted Wordmark, credited hardware image and independent editable BASIC/modal instances can be inspected at `/catalogue/code-learning/` under `astro dev`; the route is excluded from production builds.

## Adopted exception

The user’s instruction to roll out the accepted pages carries the approved homepage showcase treatment into production: the three featured-game captures share a 768px display width and fit a narrower viewport proportionally. This narrowly overrides `198x/decisions/family-visual-identity.md` §7’s whole-number scaling for those three showcase figures, for the same equal-width purpose the user approved. It does not permit cropping, filtering, distortion or caption overflow. Opening, lesson and machine captures retain native-or-viewport sizing.

## Verification, 2026-10-06

- `npm run check`: 29 test files passed; all 179 tests passed with the release decoder configuration. Template, curriculum-route, Vault imagery/link and assembler checks passed. Existing Vault platform-balance advisories remain.
- Production build passed. Built-player validation checks all 30 system launch contracts, their variants and WASM files, plus runnable media on 90 lesson pages. It now accepts either a legacy stage or the new complete modal launcher contract.
- Seven Discord announcement regression tests passed. Offline built-site links: 216,485 references, 14,933 unique, zero errors (images and configured exclusions omitted by the existing release command).
- Browser checks use the connected Chrome through CUA: real BASIC output after editing, original-versus-edited highlighting, independent editors, invalid-source recovery preserving the last successful session, Escape retaining machine focus, native modal, close/pause/return, empty-machine launch, generic-player reuse and lesson navigation.
- Desktop and phone evidence: `198x/.impeccable/review/code-rollout/`. The first responsive screenshot API returned distorted composites; these were discarded and replaced by viewport clips using actual scroll coordinates.
- After integrating remote main through `bc036e2cf` and installing its lockfile (including Spectrum 0.4.2), `npm run check:release` passed end to end: 179 unit tests, seven announcement regression tests, content checks, production build, player/media contracts, all 202 browser cases and offline links. Browser coverage includes accessibility, native image pixels, player loading/retry/focus/navigation and edited BASIC/reset. Native-dialog tests permit focus in browser chrome while rejecting focus on the background lesson.
- Release checks caught an editable-listing selector collision with existing static listings and an implicit grid column overflowing a narrow Amiga lesson. Both were reproduced, fixed and covered by the passing browser checks.
- Independent Impeccable review resolved all seven material findings and returned `ship` for those scored fixes. Generic-agent fallbacks supplied the finish reviewer and documenter roles.
- Impeccable detector returned no findings on the scoped changed UI targets. Raster origins are preserved in the imagery and the copied provenance manifest; the touch icon records its deterministic vector origin.
- No dependency, sibling kit, deployment workflow or announcement was changed. Publication follows integration with the latest remote main and verification of that combined result.

## Release notes

The existing lockfile reports upstream advisories for `http-cache-semantics`, `source-map-js` and `smol-toml`, cascading through build/development dependencies; npm reports no available fix. Dependency remediation is separate from this visual migration. The deployment feed comparison contains zero newly live items, so this rollout introduces no Discord announcement.
