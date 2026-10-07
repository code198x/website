# One page frame

Approved on 7 October: every public Code198x page uses a centred 1264px outer
frame with the same responsive gutters. Header, breadcrumbs, title bands and
footer align to it. Reading columns, figures and grids can be narrower inside.
This supersedes per-page bounded/full-width variants in the component extraction.

## Work

1. Record the approved rule in `Code198x/docs/PROJECT.md`, preserving unrelated
   documentation changes. Inventory every route/layout root and current geometry.
2. Make `src/layouts/Layout.astro`, `components/PageFrame.astro`,
   `components/Breadcrumbs.astro` and `styles/site-frame.css` own a single width
   and gutter. Remove the full-width/editorial-gutter variants and conflicting
   outer frame rules from page styles. Keep section composition and vertical
   spacing except where reflow requires changes.
3. Migrate page/layout roots to the common frame where needed, including lesson,
   setup, Vault, Pattern Library, Timeline and system routes. Update both component
   specimens and README guidance. Review narrow-width image behaviour against the
   approved complete-capture/fit/detail rules.
4. Add route-family coverage in `tests/page-frame.spec.ts` and/or a focused frame
   suite. Check the shared outer frame, gutter alignment, title bands, overflow,
   and direct versus Astro navigation at narrow, ordinary and wide viewports.
   Explicitly compare development and production builds.
5. Run unit/content checks, production build and relevant browser suites. Inspect
   representative screenshots and record evidence. Update PR #653 to describe the
   final implementation and validation; do not retain the superseded width question.

## Verification

A width change is now authorised, so old per-page widths are not the acceptance
criterion. Every page must agree with the shared 1264px frame and responsive
viewport limit. Existing typography, section rhythm, content and interactions
remain the baseline. Test representatives of every rendering template and
inventory the built public routes so omissions cannot silently pass.

## Completed

- Recorded the approved rule in the Code198x project charter. `Layout` now
  enforces the frame on all page roots; `PageFrame` no longer accepts an outer
  width or alternate gutter. Header, breadcrumbs, title bands and footer share
  the same tokens. Removed competing global width declarations and double
  gutters in system tracks.
- The public Game Feel playground now uses the site shell. Its maintained
  sample remains an isolated iframe, with automatic height and links that leave
  the frame. Lesson iframes and upstream browser-player documents are explicitly
  identified as application assets in the inventory, not omitted by a broad
  directory exclusion.
- Both component specimens and the README describe the single frame.
- `npm run check`: 218 passed, 9 existing skips; content and WASM checks passed.
  Production build passed. Its new guard checked 2,447 authored public pages in
  35 rendering families. Empty builds, unframed pages and a new unframed page
  beside a valid one were deliberately rejected; a valid fixture passed.
- The production frame suite passed 109 checks: all 35 templates at 390px,
  1440px and 1920px, navigation/spacing checks, and playground interactions.
  The wider browser selection passed 74 checks, with 6 existing conditional
  skips, after the two corrections below. The two development catalogue
  interaction checks passed. Catalogue axe checks found no A/AA violations at
  390px or 1440px.
- The initial wider run had two distinct failures on both browser profiles:
  the image decoder needed `CODE_SAMPLES_PATH` (rerun passed with the required
  environment), and an old homepage test expected Nebula Sans on the magazine
  heading. The same font failure reproduced on the unmodified starting build.
  The test now checks the approved Fira Sans Condensed heading and Nebula Sans
  introduction; both profiles pass.
- Development and production horizontal geometry agrees across 117 captures
  apiece (39 representative routes including additional core pages). This
  compares horizontal frame position, width and gutters. It does not claim
  vertical equivalence across all legacy templates or asynchronously loaded
  experiments.
- Inspected screenshots of Systems, Foundations, About, Vault, a narrow lesson,
  the playground and both component-preview widths. Evidence is in the adjacent
  `2026-10-07-one-page-frame/` folder. The focused design detector reported no
  new findings. Ruff and whitespace checks pass.
