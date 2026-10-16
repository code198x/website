# Correct the progress-bar illustration and Amiga capture layout

1. Reproduce #803's colour mismatch and #804's 1440px overflow. Read the maintained BASIC routine, shared overview styles and capture geometry before changing them.
2. Fix PatternExample's fill-count/whole-bar colour model, show a low nonzero value and add focused regression checks against the routine's independently verified thresholds and clamping. Keep its illustration label and numeric values.
3. Apply the smallest SystemOverview media fix that respects the actual image grid, preserves the full frame and keeps image/caption within the available column. Check all four core-system landings and the two pattern placements at phone, intermediate and desktop widths.
4. Run focused failing-then-passing checks, relevant existing checks, a production build and a rendered browser review. Keep unrelated baseline failures explicit. Commit each fix as a self-contained change, push and open a linked PR; leave issue closure for approval, merge and live verification.
5. Stop task preview processes, verify the task commits on the remote, inspect tracked/untracked/ignored files and remove the temporary worktree and build outputs.
