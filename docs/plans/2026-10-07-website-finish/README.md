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

- [x] Game previews
- [x] Timeline
- [x] Remaining page-family review and fixes
- [x] Release checklist reconciliation
- [ ] Verification, review and publication

## Timeline direction — approved

Connected stories first, then chronology. Mode: Read. The existing paper,
Nebula/Fira hierarchy and Code spot ink remain fixed. Code-first, no new identity.
The opening pairs a concrete question and real machine photograph with a short
sequence of linked, dated subjects. Three story choices connect sound, arcade
movement and game-making tools. Dates come from reviewed Vault metadata; the
selection text names the relationship rather than claiming a causal lineage.
Chronology remains complete for recorded dates, with query/subject/source filters,
year anchors and adjacent decades. Components preview at `/catalogue/timeline/`.

Old Timeline failure modes to verify against the replacement: duplicated event
extraction; totals that exclude categories shown elsewhere; omitted dated
software/language/scene subjects; missing birth/founding years printed as unknown;
no subject lookup; long undifferentiated card lists; loss of context between Vault
and chronology. Preserve company ending mechanisms, legacy decade/year URLs,
world context and access without JavaScript. Label unreviewed entries and exclude
them from Pagefind; only reviewed articles may lead a curated story.

## Implemented and checked

Game-list captures now use their native width when space permits: the first
Spectrum BASIC capture renders at 352px instead of 98px on desktop. Rows reflow
around the image; mobile captions stay within its width. Complete frames and
aspect ratios are preserved. Regression checks cover Spectrum BASIC, C64 assembly
and Amiga assembly at desktop and mobile widths.

Timeline now connects reviewed Vault subjects through sound, arcade movement and
game-making tools before the decade browser. Dates come from the same Vault
fields used by article pages. One extractor produces both totals and rows, adding
previously omitted dated subjects and retaining births, deaths, company endings,
world events and legacy decade URLs. Unknown dates remain absent. Story choices
and filters survive navigation; all stories and events remain readable without
JavaScript. The development-only `/catalogue/timeline/` previews both components
and real game rows.

The remaining template review covered `/about/`, `/teaching/`, `/press/`,
`/colophon/`, `/contribute/`, `/systems/by-region/`, `/family/asm198x/`,
`/family/emu198x/`, `/family/build198x/`, `/family/cat198x/`,
`/field-notes/the-sheep-that-slid-off-the-hay-bale/`,
`/from-the-metal/the-stack/`, `/experiments/bright-spark/wrong-note/`,
`/timeline/`, `/timeline/1980s/` and `/timeline/1920s/`.
The utility templates had repeated headings and inconsistent frames; contribution
footer prose ran across the full page. The fixes bound the frame/prose, remove
repeated mastheads and simplify headings. Editorial layouts retain one title and
a 65ch measure. Colophon now names Oxanium Extra Bold and Caveat Bold and serves
their existing licences. Independent review also found above-title labels on About, teaching and family
explainers, plus an ineffective reading-width rule on the Bright Spark experiment.
The bounded correction removes redundant labels, retains useful audience/machine
context in prose, and restores the experiment’s intended reading column. This
is representative template coverage, not a fact-check of every article or an
inspection of every game state.

## Verification — 7 October 2026

- `PLAYWRIGHT_PORT=4431 npm run check:release`: 187 unit tests, seven announcement
  regressions, content/prepared-player checks, production build and 202 browser
  cases passed. Offline links: 221,603 references, 16,438 unique, zero errors;
  the command's existing asset/image/mail/localhost exclusions remain.
- Focused production suites (`track-previews`, `timeline`, `website-finish`,
  `site-review-search`): 82 passed, including 64 page/theme/device accessibility
  checks with no exceptions. The initial run passed 80; two exact-label test
  locators did not match the Subject select. Role-based locators fixed the
  harness, and both cases passed on rerun. No browser assertion was removed.
- Existing WebKit 2336: 30 passed on desktop and iPhone emulation for Timeline,
  search, Setup/lesson-tool routes and game previews. Physical devices, audible
  quality and an uncoached learner trial remain separate acceptance work.
- Twenty initial final route/width captures report zero horizontal overflow; two mobile
  lower-section captures supplement the openings. All final files were opened
  for validity. The component specimen uses the dev server; other captures use
  the production build. The manual detector ran once and found one existing
  thick quotation border on Press, reduced to 1px. No ignore was added.
- Live/build RSS comparison: zero newly live items; no announcement is introduced.

Local verification used Node 24.21.0, npm 11.19.0, code-samples
`38fd09a15868f5d3e45aa0d9bf0fb32583891833`, Play198x
`dd2496a90ad70150f2add46a19c760ec0b2384b6`, and shared UI pin
`7eda45e1c2f8b8f919359c971b2e210822e431f2`. The website lockfile supplies
Spectrum emulator 0.4.2 and Z80 assembler 0.3.0. The release command sets the
prepared decoder path; an earlier plain check passed 178 with nine decoder skips.

The Code198x docs release checklist now separates this evidence from earlier
native checks, human listening/play trials, full-route accessibility and
physical-device acceptance. Those broader items are not silently marked complete.

## Independent finish review

A fresh agent applied the Impeccable reviewer contract because the named reviewer
role is not exposed by this harness. Its four material findings are recorded in
`finish-review.md`: selected-story inverse video, remaining above-title labels,
experiment reading measure and the Press quotation rule/padding. The correction
keeps the approved composition and content. The four family explainers shared the
same label issue, so the correction covers all four.

The first Press capture still contained the old 3px rule: the source correction
landed after that page had been compiled in the running build. The correction
batch explicitly sets the final 1px rule and padding in the owning support style
and rebuilds after all edits. The final verdict uses fresh captures.

All four findings are resolved in `finish-verdict.md` (`disposition: ship`). The
verdict covers the listed fixes, not a new whole-site audit. `documentation-check.md`
confirms the source changes preserve the inherited system; the named documenter
was likewise substituted by a fresh independent agent. No new system tokens or
sidecar changes were needed. The post-correction production build and all 82
focused Chromium checks passed. This later batch covers the final markup/CSS;
the earlier full release and WebKit results are retained at their stated scope.

Portable screenshots, capture measurements and test summaries are in `evidence/`.
Source commits: preview sizing `759c8e909`, Timeline `3c1afc75`, utility/editorial
finish `03874f58`. Shared capture policy was merged in
[umbrella PR #54](https://github.com/stevehill1981/198x/pull/54).
