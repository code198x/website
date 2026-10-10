# C64 raster splits — 10 October 2026

The Raster Splits page now consumes a complete maintained program through
CodeFromFile. It distinguishes the VIC compare event from the delayed colour
write, states KERNAL/CIA ownership, removes unsupported cycle/jitter claims,
and gives the measured 81-byte routine size and configuration-specific rows.

The sample plan and native evidence are in the samples repository at
`docs/plans/2026-10-10-c64-raster-splits.md`. The original algorithm produces
two regions correctly. Its compare-130 capture starts blue on raster 131;
compare 131 produces a partial blue line 132 and full blue line 133. Both
engines and standards agree on those row ranges. All 12 baseline captures,
48 maintained captures and 12 rejected colour mutations are recorded.

Website verification:

1. Build against the maintained sample checkout and its exact evidence pin.
2. Run the Pattern Library desktop/mobile tests, retaining an illustrative
   example in the status matrix after Raster Splits becomes executed.
3. Run the focused rendered-page check alongside this record: actual source
   includes, evidence and timing prose, no page errors or viewport overflow.
4. Audit all pattern status labels and pinned source hashes. Merge only after
   local checks and repository CI pass, then retain the merged sample pin.

This is a bounded pattern validation, not a full site release-acceptance run.

Samples PR #64 merged as `3247bfb1dfc1cf82c293ee3fd9faf46afe0f3e70`;
the initial page used that revision. All twelve Pattern Library browser checks pass,
and the evidence audit covers 71 patterns, 13 pins and 33 source hashes.

Final evidence review found that Emu198x debugger stepping alone leaves the
session screenshot stale. The sample verifier now refreshes normal frame
delivery and includes a live blue/black/blue control that reproduces the old
behaviour and verifies recovery. The page pins the corrected record.
The teaching assembly and independently observed VICE timings are unchanged.

Capture correction PR #65 merged as
`ffec9e93b5c1a537b91aeb67b4b26a81fd386421`, now pinned by the page.
All native checks pass after refresh, including both live capture controls.

Final production build, source audit and focused desktop/mobile checks pass
against the merged evidence pin. The rendered page includes both maintained
source files, has no page errors and stays within both viewports. Logs and
structured observations are retained alongside this plan.
