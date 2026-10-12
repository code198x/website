# Keyboard review of the introductory journey

Reviewed 12 October 2026 for [issue #410](https://github.com/code198x/website/issues/410). The route works with keyboard input, but Foundations module links had no visible focus indicator. Removing their local `outline: none` restores the shared focus ring.

## Environment and route

- macOS 27.0 (26A428), Chromium 151.0.7922.34.
- Desktop 1440 × 900 and narrow desktop 390 × 900; the narrow review uses a keyboard, not a simulated touch-only interaction.
- Published site: https://code198x.com, after the successful Pages deployment of `26bbf1550c7584ae4c398dff083f31024e261e30`.
- Corrected local production build from that revision plus this change.
- Start Here → Foundations → Counting in Twos → Ten Fingers, Two Wires.
- Interaction used Tab, Shift+Tab, Enter, Space, Escape and typed search text. DOM inspection and screenshots observed results; no scripted focusing or mouse clicks substituted for keyboard navigation.

## Finding and correction

On `/foundations/`, Tab to Counting in Twos. The element receives keyboard focus, but its outline, shadow and transform all provide no indicator. This occurs at both widths. The original page CSS suppresses the outline in favour of a shadow; `design-rollout.css` removes that shadow and transform for the adopted editorial layout. The correction lets the existing shared 2px outline apply without changing the page layout.

The production regression failed before the edit with `Expected: "solid"; Received: "none"` on the module's outline style. The keyboard menu control test passed on the same baseline. [Before](focus-before.png) and [after](focus-after.png) show the same focused module at narrow width.

## Other observations

- The first Tab exposes the skip link. Enter moves to the content anchor, and the next Tab reaches a link inside main content. Chromium leaves `document.activeElement` on the body at the non-focusable anchor; the sequential keyboard destination is correct.
- All three route transitions and first-lesson arrival work. The start link has a visible focus ring.
- Search opens from its keyboard trigger, focuses its input, returns results for `hexadecimal`, allows Tab to a result, and follows it with Enter. Escape closes search and restores the trigger.
- At narrow width, the menu opens with Enter or Space. Page content becomes inert while covered. Escape restores the toggle; the closed menu is skipped by Tab. Following a menu link releases the content, and the menu works again after navigation.
- Search can open over the mobile menu. Escape closes both and returns focus to Search. This review found no trapped or lost focus in that sequence.
- There is no theme switch. The family visual-identity decision specifies paper-only reading sites; the issue's theme-control instruction is stale, not evidence of a missing control.

The recorded observations are in `live-report.json` and `fixed-report.json`. Browser regression coverage lives in `tests/keyboard-learning-journey.spec.ts`.

## Validation

- `npm run check:release`: passed; 227 unit tests, content/prepared-player checks, 7 announcement tests, production build, 444 browser tests and offline links (0 errors).
- `A11Y_SWEEP=1 PLAYWRIGHT_PORT=4341 npx playwright test tests/keyboard-learning-journey.spec.ts`: 4 passed across desktop/mobile profiles. The first concurrent attempt could not start because the release suite owned Astro's preview lock; rerunning after that suite exited passed.
- Repeated the full recorded keyboard journey against the corrected production build and inspected settled screenshots. The release accessibility checks cover both light/dark preferences while asserting the agreed paper background.
- Browser and local preview processes were stopped. No accessibility baseline was changed.

This bounded Chromium keyboard review does not establish screen-reader support, behaviour in every browser, or full accessibility conformance.
