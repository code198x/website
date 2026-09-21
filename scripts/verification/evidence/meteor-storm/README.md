# Meteor Storm lesson review evidence

Local production build, 2026-09-21. Twenty-four lessons, nineteen runnable
programs, published Spectrum emulator package 0.4.0. Not a deployment record.

- `browser.json`: all lesson programs and the selected edit/debug/replay/download checks.
- `accessibility.json`: axe main-region checks for lessons 1, 5, 10, 12, 22 and 24 in both themes.
- `flight.json`: real keyboard-driven browser completion; read-only observations,
  no writes to game state. Includes bitmap/ROM/canvas agreement for the score line.
- `tape.json`: fresh native ROM load of the browser tape, native payload parity and replay checks.
- `meet-assembly-regression.json`: existing introductory module behaviour and layout.
- `win.png` and `loss.png`: inspected actual browser canvas, captured without page overlays.
- Lesson screenshots: inspected page layout at 390 and 1280 pixels; experiments have not been started.

The website production build passes its required checks and 72 unit tests (9 skipped).
Native source checkpoints and compiler parity are recorded in the sample repo.
The browser result is complete. The cause of incomplete earlier batched native
result captures remains undiagnosed; those images are not used in the lessons.
