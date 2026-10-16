# Correct the progress-bar illustration and Amiga capture layout

1. Reproduce #803's colour mismatch and #804's 1440px overflow. Read the maintained BASIC routine, shared overview styles and capture geometry before changing them.
2. Fix PatternExample's fill-count/whole-bar colour model, show a low nonzero value and add focused regression checks against the routine's independently verified thresholds and clamping. Keep its illustration label and numeric values.
3. Apply the smallest SystemOverview media fix that respects the actual image grid, preserves the full frame and keeps image/caption within the available column. Check all four core-system landings and the two pattern placements at phone, intermediate and desktop widths.
4. Run focused failing-then-passing checks, relevant existing checks, a production build and a rendered browser review. Keep unrelated baseline failures explicit. Commit each fix as a self-contained change, push and open a linked PR; leave issue closure for approval, merge and live verification.
5. Stop task preview processes, verify the task commits on the remote, inspect tracked/untracked/ignored files and remove the temporary worktree and build outputs.

## Verification

- Reproduced the old positional-colour model in focused tests: eight cases failed, three passed. The corrected model passes all eleven cases, including the two colour boundaries, zero/low/middle/full values, clamping and monotonic fill.
- Against the first build (corrected bar, old overview layout), the two bar checks passed and all five system geometry cases failed. This establishes that the browser assertions detect the column defect.
- `npm run check` passed: 33 unit-test files, 248 tests, content checks, imagery checks, link checks, prepared assembler and player checks. Existing platform-balance advisories are unchanged.
- Production builds passed for each self-contained fix. The final build generated 2,459 pages, verified their shared frames and completed Pagefind.
- All 26 focused Playwright cases passed against the final built site served by Astro preview: both projects, the two bar placements, five widths (390, 850, 1024, 1440, 1920) across all four core-system landings, and the existing Pattern Library behaviour checks. Tests bring captures into view and require actual image loading before checking bounds, aspect ratio and caption alignment. Earlier concurrent runs on the ad hoc preview intermittently reported `Error: commodore-amiga: capture must finish loading`; the same checks passed serially there and concurrently on the standard Astro preview. Browser requests were pinned to the task's own preview address rather than an unrelated localhost listener.
- Screenshot review confirmed the empty/red/yellow/green bar states and the full Amiga frame with bounded caption. At 1440px the Amiga image displays at 384×288 (from a 768×576 PNG with doubled storage); document width is 1440 rather than 1499. At 390px it displays proportionally at 358×268.5 within its content column, with document width 390. [Measurements](2026-10-16-illustration-corrections/measurements.json), [phone bar](2026-10-16-illustration-corrections/bar-390.png), [desktop Amiga](2026-10-16-illustration-corrections/amiga-1440.png).
- Scoped Impeccable detection returned no findings. No dependency, source capture, BASIC routine or unrelated layout was changed.

The fixes are verified locally. Issues #803 and #804 remain open for approval, merge and deployed-page verification.
