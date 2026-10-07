# Design documentation check — 7 October 2026

The source changes extend the existing family visual system. They do not need a
new site-level `DESIGN.md`, new token vocabulary or a regenerated family sidecar.
The umbrella `PRODUCT.md`, `DESIGN.md` and
`decisions/family-visual-identity.md` remain authoritative. This is a source
comparison during the final build/review correction, not final visual approval
or a claim that the changes have been published.

The named Impeccable documenter role was unavailable; a fresh independent agent
applied `reference/degraded/documenter.md` and `reference/document.md` instead.
Only this check record was written.

## Evidence checked

- Umbrella `PRINCIPLES.md`, `PRODUCT.md`, `DESIGN.md` and the family visual
  decision, including the approved 2026-10-07 capture refinement; Code198x's
  org-container `AGENTS.md` and this plan's agreed direction.
- The actual website kit at `_198x-ui/tokens.css`, `_198x-ui/fonts.css` and
  `_198x-ui/components/Tabs.astro`; `tsconfig.json` resolves `@198x-ui` to that
  kit, and `scripts/fetch-ui.sh` pins it to
  `7eda45e1c2f8b8f919359c971b2e210822e431f2`. The separate older
  `198x-ui` checkout was also sampled, but is not the website's token source.
- `src/layouts/Layout.astro`, `src/styles/site-tokens.css`,
  `src/styles/design-rollout.css`, `src/components/TrackGames.astro` and
  `src/components/HardwarePhoto.astro` for the incumbent shell, colour roles,
  capture presentation and image provenance.
- New Timeline components and `src/styles/timeline.css`, with both Timeline
  page templates; `src/styles/support-pages.css`; current diffs in About,
  Teaching, Press, Colophon, Contribute, the four family explainers,
  `FieldNotesLayout.astro`, `FromTheMetalLayout.astro` and the wrong-note
  experiment.

## System comparison

1. **Palette:** the pinned kit's paper (`#f6f4ee`), panel (`#fcfbf8`), strong ink
   (`#1b1a17`) and Code spot (`#a93800`) match the recorded family system.
   Timeline and support rules reference existing ink, line, ground and spot
   tokens. Timeline introduces no story/category palette; its subjects stay
   distinguishable through text.
2. **Type:** Nebula Sans remains the reading/UI face, Fira Sans Condensed the
   editorial display face, and JetBrains Mono the machine/code face. The kit's
   recorded micro-to-display scale and 1.25rem body remain intact. Timeline uses
   local responsive heading and reading sizes through those existing families;
   its 2.25rem story heading and 1.125rem prose are page choices, not additions
   to the family type scale. Colophon documents Oxanium and Caveat as existing
   outlined-logo sources, with licences, without adding either to reading/UI.
3. **Layout:** the new utility frame repeats the established 1264px outer width
   and responsive `--gutter`. Editorial and footer prose gains a 65ch bound.
   Timeline starts with connected stories, then chronology, and collapses its
   columns for narrow layouts. These compositions and breakpoints remain local
   to their surfaces; they are not new family layout rules.
4. **Controls and shape:** Timeline keeps square native buttons, selects and
   fields, labelled filters and a visible focus outline. Its pressed story
   button uses paper on strong ink, matching the existing Tabs component's
   inverse-video treatment for the current choice. Dividers and open lists
   preserve the paper vocabulary; no new shadow or motion system is introduced.
5. **Images and captures:** Timeline reuses `HardwarePhoto` and its existing
   attribution captions. It adds no imagery. Game rows use source width where
   space permits, `max-width:100%`, automatic image height and `object-fit:contain`;
   they reflow before reducing the frame, with captions inside the figure.
   These rules implement the approved complete-capture and responsive-fit
   policy. No deliberate crop is introduced by this extension.

## Not canonized or repaired

The umbrella adoption note already identifies the separate older kit's dark-first
tokens, the paper kit's missing hero token and its SiteNav current-state mismatch.
These remain historical adoption issues, not evidence for changing the family
rules. `Layout.astro` still has an older dark-leading comment, and TrackGames
retains older fixed-box/cropping defaults that the magazine rollout overrides;
neither is promoted here as the desired capture treatment. Existing eyebrow
specimens in the umbrella record are not expanded or endorsed by this pass.
The changed utility/editorial templates remove repeated eyebrow/masthead markup.

No umbrella design file, sidecar, shared-kit source, image or application code
was edited. Final rendered acceptance belongs to the separate finish review and
its verified build/captures; the source comparison alone cannot establish it.
