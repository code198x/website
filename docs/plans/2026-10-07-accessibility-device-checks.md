# Accessibility and emulator acceptance

Scope: verify the published design after breadcrumb fix `146a7776`; preserve the accepted identity and report reproducible failures. No new dependencies or expanded accessibility exceptions.

1. Inspect `tests/a11y-sweep.spec.ts`, `playwright.config.ts` and existing player checks. Confirm the sweep enumerates the production build and fails on serious/critical findings or route errors.
2. Run `npm run test:a11y:sweep`; retain its complete log and `a11y-sweep-report.json`. Verify actual route/job counts and investigate representative findings before drawing conclusions.
3. Inventory connected browsers and physical devices. Run the existing `tests/player-integration.spec.ts` against production output in installed Chrome and WebKit, explicitly recording emulation. Exercise live Safari if automation is available. Check modal focus, input, close/reopen, orientation, loading failure and audio lifecycle using existing verification scripts where applicable.
4. Record results, reproductions and exact environment limitations here. Physical-device behaviour and audible quality require their own evidence; do not infer them from synthetic touch or delivered audio samples.

## Evidence

- Full production sweep: 3,711 routes × two themes = 7,422 page loads;
  zero serious/critical axe findings and zero route errors. Completed in 43.8
  minutes against the build preceding the spacing correction. No exceptions
  added. Summary: [sweep.json](2026-10-07-accessibility-evidence/sweep.json).
- Existing player integration suite: 78 passed across installed Chrome 154,
  desktop WebKit and iPhone 13 WebKit emulation. Emulation is not physical-device
  evidence.
- Live desktop Safari 27 on macOS 27: the Spectrum BASIC modal executed a changed
  listing containing a comma, full stop and decimal; Escape retained the modal,
  Pause/Resume worked, and closing returned focus to the edited listing. The C64
  modal requested firmware; no C64 execution is claimed from this check.
- Synthetic touch in Chrome and WebKit entered 42 and produced 43 through the
  actual Spectrum BASIC program. Portrait → landscape → portrait retained the
  352×296 canvas, accessible Close control and zero horizontal overflow. Open
  modal axe checks returned no violations with reduced motion enabled.
  [Touch evidence](2026-10-07-accessibility-evidence/touch-orientation.json).
- Delivered audio checks passed: impact 522.2 Hz / 105 cycles, boost 1314.8 Hz /
  30 cycles, BASIC BEEP 523.2 Hz / 523 cycles. Pause and modal close suspended
  audio; Sound off and navigation closed the context. The verifier now uses the
  current modal controls and excludes tape leader sound with a program readiness
  marker. Original pitch and cycle tolerances remain.
  [Audio evidence](2026-10-07-accessibility-evidence/sound.json).
- Physical iPhone 16 Pro Max: paired, but mirroring repeatedly disconnected or
  remained at Connecting. No lesson execution was verified on the physical phone.
  Physical keyboard/touch feel, orientation and audible output remain unchecked.

These results establish the checks described, not complete WCAG conformance or
physical-device acceptance. The separate [layout correction](2026-10-07-stable-page-layouts.md)
records subsequent spacing changes and their production validation.
