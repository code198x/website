# Pattern execution evidence — 10 October 2026

Hardware Sprites now includes a complete maintained C64 example and an
explicit routine contract. The page explains sprite DMA's CPU bus cost,
64-byte pointers relative to a VIC bank, shared-register ownership and the
limits of initialising during display. The NES square-wave page now names
both emulated-time and WAV-playback checks.

The approved plan and native evidence live in samples PR #62, merged as
`daacb295441b54fc239b63c6229347308ec18dd2`. Website evidence links pin that
revision. Seven NES executions and twenty C64 captures passed; intentionally
wrong WAV headers and a missing sprite X-high-bit update were rejected.
No chip code, schema, dependencies or layout components changed.

## Website verification

- Production build completed with the pinned House UI
  `7eda45e1c2f8b8f919359c971b2e210822e431f2` and merged sample sources.
- Twelve existing Pattern Library Playwright checks passed on desktop/mobile.
- Four additional browser observations inspect the two changed pages on
  desktop/mobile: maintained source appears in code blocks, execution status
  is visible, pages fit the viewport, and no page errors occur.
- The existing evidence verifier checks all 71 pages: seven executed,
  four maintained BASIC subroutines, 49 illustrative code and eleven
  illustrative pseudocode. All eleven pinned links and twenty source hashes
  match the current samples and their pinned revisions.

Retained logs and browser observations are in `2026-10-10-pattern-validation/`.
These checks do not claim browser-emulator execution, listening quality,
original-hardware results or a new full release-acceptance run.
