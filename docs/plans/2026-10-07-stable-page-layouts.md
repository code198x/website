# Preserve approved page spacing

Status: shared layout and preservation rule approved by the owner on 7 October; implemented and locally verified.

## Report and evidence

Systems, Foundations and About have lost the approved outer spacing. At a 1440px live viewport their content starts at 28.8px while the corrected breadcrumb starts at 116.8px. The spacing tokens resolve correctly; missing token definitions are not the cause.

Several global stylesheets own the same frame. `site-frame.css` gives `.systems` `max-width:none` and `margin-inline:0`; `editorial.css` does the same to `.wrap`; `design-rollout.css` attempts to restore the Systems and Foundations frames to 1264px. About inherits a `--container-max-width` that is also reset to 100%. This leaves accepted layouts subject to competing global selectors and stylesheet order. The exact introduction of each symptom is not yet established.

## Approved decision

> Approved page composition, content width, gutters and vertical spacing are part of the design contract. Shared layouts own these values. New pages reuse an existing layout; deliberate variants are explicit and documented. A change to shared layout styles must compare affected approved page families before and after, at narrow and wide widths. Technical checks alone do not approve a visual change.

Approved on 7 October and recorded in `Code198x/docs/PROJECT.md`.

## Implementation

1. Introduce a small `src/components/PageFrame.astro` with a scoped stylesheet owning the centred 1264px frame, responsive gutters and named opening/ending spacing. It must preserve the existing approved values rather than establish a new design.
2. Apply it first to `src/pages/systems.astro` / `src/components/FleetBoard.astro`, `src/pages/foundations.astro` and `src/pages/about.astro`. Retain their distinct editorial compositions and reading/sidebar arrangements.
3. Remove the superseded frame declarations for these consumers from `src/styles/site-frame.css`, `src/styles/editorial.css` and `src/styles/design-rollout.css`. Do not add another global specificity override. Keep other page families unchanged.
4. Give the existing component preview a frame specimen, including normal reading, directory and explicit full-width section examples. New pages should use the same source component.
5. Add focused browser assertions that the three page frames agree with the breadcrumb frame at desktop and mobile widths, and remain identical after direct load and client-side navigation. Include spacing relationships, not just absence of horizontal overflow.
6. Build and compare desktop/mobile screenshots with the approved previews; inspect the homepage, a lesson and Vault as shared-CSS regression controls. Publish only after the spacing correction is verified.

Alternative: restore three isolated page styles. Smaller immediately, but leaves the duplicated frame ownership that caused this class of problem.

## Verification

- Production build and `npm run check` passed.
- 18 production browser cases passed across installed Chrome, desktop WebKit and
  iPhone WebKit emulation: 390, 1440 and 1920px, both themes. Each covers all three
  pages, breadcrumb alignment, centred width, gutters, opening/ending spacing,
  overflow and direct versus client-side navigation. Systems also asserts the
  retained italic, weight-900 section headings.
- The tests caught a competing Foundations gutter (3.2px misalignment) before its
  removal. Visual inspection caught missing caller scope attributes; forwarding
  those attributes preserves existing page typography and now has an assertion.
- Before/after production measurements for the homepage, Safe Cracker unit 01
  and Commando Vault article agree at 390 and 1440px. These controls use the same
  prepared media on both sides.
- The reusable source is previewed at `/catalogue/page-frame/` in development.
  [Authoring guidance](../page-layouts.md) documents defaults and deliberate variants.

- Final desktop/mobile screenshots inspected for all three pages; the frame
  specimen inspected at both widths. Original typography and internal
  compositions are retained.
- Release checks: 187 unit tests, content/player preparation, seven announcement
  regressions, production build, 214 browser cases and 221,603 offline link
  references passed. Frame checks now run in `scripts/check-release.sh`.
  The initial browser launch failed with macOS `bootstrap_check_in … Permission
  denied (1100)` inside the sandbox. The authorised retry passed 212 checks;
  two native-image cases reported `TypeError: The "paths[0]" argument must be of
  type string. Received undefined` because the isolated command omitted the
  release script's environment paths. Both passed when rerun with those paths.
