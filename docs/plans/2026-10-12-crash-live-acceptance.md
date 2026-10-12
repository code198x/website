# Flyer to first program acceptance

Follow the deployed `/crash-live/` page to the first assembly lesson and the
Spectrum BASIC route. Check what a visitor can run, edit, download, recover and
continue to on desktop Chromium and touch-enabled Chromium/WebKit. Emulation
does not establish physical-device, Safari application or listening acceptance.

1. Record the deployed baseline and inspect the event links, first lessons and
   existing player checks. Retain browser observations and screenshots under
   `docs/plans/crash-live-acceptance/`.
2. Reproduce faults before changing their owning components. Add focused
   regressions in `tests/crash-live-journey.spec.ts` where a defect warrants one.
   Preserve the current page design and independent BASIC/assembly routes.
3. Once Emu198x PR #1742 merges and npm serves 0.4.3, update `package.json` and
   `package-lock.json`. Verify actual edited machine output, error recovery,
   source/tape downloads, touch input, pause/restart and route changes.
4. Run the focused checks on the production preview, then `npm run check:release`.
   Commit and push each bounded correction. Verify publication and the deployed
   route if merged; otherwise report the precise remaining release boundary.

Use the existing release and lesson-sound scripts where suitable. A fresh learner
trial and audible quality require human observation and remain separate.

## Hosted navigation follow-up

The hosted full WebKit journey exposed an 18.6-second lesson fetch timeout before
Astro recovered with a full navigation. Both profiles reproduced it. Changing
only the next link to the destination's canonical trailing-slash URL in the
browser reduced those journeys to 59 ms and 75 ms. Minimal navigation and isolated
tape downloads did not reproduce the timeout; the underlying browser/network
interaction is not yet established.

1. Compare the generated pager links with their destinations' canonical URLs in
   `tests/spectrum-learner-journey.spec.ts`; confirm the current build fails.
2. Add the missing slash in `computeUnitNav` in `src/pages/[...slug].astro`.
   This retains destinations and nearest-available-unit selection.
3. Build, run the pager regression and complete visitor journeys, then commit,
   push and merge after checks. Verify the hosted link and both WebKit journeys.
   Preserve the failed-fetch and canonical-link experiment evidence in the
   acceptance report; do not claim a general WebKit networking fix.
