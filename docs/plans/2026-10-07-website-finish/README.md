# Finish the Code198x website rollout

Approved scope: improve game previews under the revised 2026-10-07 capture rule,
finish Timeline discovery, review the remaining page families, and reconcile
release acceptance with shipped evidence. Preserve the accepted homepage,
learning routes, lesson editor/player, Vault, Pattern Library and Setup.

The family PRODUCT.md, DESIGN.md and decisions/family-visual-identity.md at the
umbrella own the existing visual system. Code-first remains the agreed workflow.
The site-local Impeccable context loader does not discover these umbrella files;
this is an inherited surface, not a new brand or product interview.

## Work, files and verification

1. **Game previews:** fix conflicting scoped rules in
   `src/components/TrackGames.astro` and `src/styles/design-rollout.css`.
   Preserve complete captures and captions; use readable previews, proportional
   fitting and an obvious route into the game. Confirm desktop/mobile screenshot
   dimensions, aspect ratio, caption bounds and absence of horizontal overflow.
2. **Timeline:** agree the discovery/chronology balance; update
   `src/pages/timeline/index.astro` and `[decade].astro`, with shared event
   extraction in `src/lib/timeline.ts`, shared components/styles only where both
   routes need them, and a specimen in the existing `src/pages/catalogue/`
   routing. Preserve existing decade URLs, all existing event types and native
   navigation. Define coverage of dated Vault categories explicitly. Test index
   totals against actual decade events, date omission, filtering, navigation,
   keyboard access, empty results and narrow layouts.
3. **Remaining page families:** inspect About, teaching, press, colophon,
   contribution, system facets, family explainers, editorial articles and
   experiments against the source inventory. Record exact sampled routes and
   defects here; make only evidenced fixes in their owning templates. Check
   desktop/mobile, both themes, page headings, images, overflow and links.
4. **Release evidence:** reconcile `Code198x/docs/launch-readiness.md` with the
   October 6–7 rollout records, current source and new verification. Mark only
   outcomes actually demonstrated; retain real Safari/mobile, listening and
   learner-trial gaps where evidence is absent. Do not expand into curriculum
   rewrites or claim every Vault article has been fact-checked.
5. **Finish and publish:** run source/unit/content/build checks and the focused
   browser suites; inspect the required desktop/mobile captures in a bounded
   pass, apply material fixes together, and run the required independent finish
   review/documentation handoffs. Commit each coherent change without touching
   unrelated local review files. Publish the accepted changes through existing
   PR/CI and verify live pages and search. Record remaining human acceptance
   work separately from delivered code.

## Known baseline

Live Spectrum BASIC first game capture: 352px source rendered at 98px on desktop
and 78px on mobile. Scoped `.house .gthumb` rules override the intended rollout
layout. Timeline currently repeats extraction logic, reads only seven Vault
categories and displays incomplete category subtotals against its total.

## Status

- [ ] Game previews
- [ ] Timeline
- [ ] Remaining page-family review and fixes
- [ ] Release checklist reconciliation
- [ ] Verification, review and publication
