# Verification script semicolons

The user reports repeated GitHub Code Quality semicolon-insertion findings.
Review comments on website PRs #722 and #725 confirm the rule and locations.

1. Parse every JavaScript module in `scripts/verification/` with the already
   installed Acorn parser's automatic-semicolon-insertion callback. Record all
   insertion positions before editing; do not install a formatter or dependency.
2. Insert only the missing semicolons at those positions. Compare each original
   and edited syntax tree, ignoring source offsets, and require equality. Parse
   again and require zero inserted semicolons. Run `node --check` on every module
   and `git diff --check`. These source-only edits need no emulator/browser rerun.
3. Add `scripts/verification/AGENTS.md` documenting explicit semicolons, including
   compact callbacks and catch/finally bodies, to prevent repeating the convention
   mistake. Preserve archived evidence and keep it tied to its original source.
4. Push a focused follow-up PR for the existing main-branch scripts. Separately
   apply the same correction to `arithmetic-pilot.mjs` on the existing draft #725.
   No lesson edits, new dependency, general reformatting or evidence regeneration.
5. Verify both remote heads, retain the concrete counts and syntax-tree results in
   PR descriptions/comments, then remove the task worktree and scratch files.
