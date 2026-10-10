# C64 joystick reading — 10 October 2026

The pattern now consumes a complete maintained caller and reader through
CodeFromFile. It distinguishes active-low pins, pressed masks, newly pressed
bits and physical debouncing. CIA ownership, keyboard interaction, reset
policy and the measured 100-byte routine size replace unsupported claims.

Native scope and evidence belong to the samples repository's
`docs/plans/2026-10-10-c64-joystick-reading.md`. The `$7F` keyboard-isolation
claim fails with `1` and Space in both emulators on PAL/NTSC. The new caller
uses exclusive input ports and requires keyboard keys released during play.
The record retains an open Emu198x reverse-keyboard-scan discrepancy, with
a forward-scan control proving the key is present. It is not counted as
reference parity or hidden by the executed-code label.

Verification plan:

1. Pin the final merged sample record, including 412 gated state/display
   observations, 48 native pictures and held-fire negative controls.
2. Build the complete site against the maintained sample checkout.
3. Run the Pattern Library desktop/mobile matrix, retaining an illustrative
   listing after Joystick Reading becomes executed.
4. Check this rendered page's real includes, counts, explicit limitation,
   page errors and viewport width. Audit all evidence pins and source hashes.
5. Retain logs here and merge after local checks and repository CI pass.

This is bounded pattern validation, not a full release-acceptance or original
hardware claim. It makes no changes to emulator code or unrelated work.

Samples PR #66 merged as `f67d4aeb6921d5fefa87b529f996c20bf39de211`;
the page pins that revision.

Validation passed:

- Complete production build against the merged samples checkout.
- All 12 Pattern Library browser tests on desktop and mobile.
- Focused rendered-page checks on both viewports: real source includes,
  execution counts, explicit emulator limitation, no page errors or overflow.
  Both full-page captures were inspected.
- Whole-library evidence audit: 71 patterns, 14 pinned links and 41 matching
  source hashes. Ten patterns now carry execution evidence.
- `git diff --check`.

The first browser attempt collided with the focused preview server. After
stopping that server, Chromium required access to macOS services outside the
sandbox (`bootstrap_check_in ... Permission denied (1100)`). The unchanged
suite passed when rerun with that access. No tests or hooks were disabled.
Build and passing browser logs, the rendered-page check and evidence-audit
results are retained in the adjacent evidence directory.
