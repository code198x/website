# Keep typing when syntax highlighting arrives

The full F4 release run at `09bb156d` passed 441 browser checks but failed the
draft-reload case: after filling the source, the status remained “Edits are saved
in this browser” instead of “Draft saved”. Do not treat that run as a release pass.

The optional highlighter loads asynchronously. `highlightAssemblyEditor` moves
the existing textarea into a new wrapper with `append`, which causes the browser
to drop focus. If that happens between selecting the text and inserting the next
input, the keystroke misses the editor. This affects a learner typing while the
enhancement loads, not just the test's timing.

The new `tests/assembly-draft.spec.ts` case delays the highlighter module,
focuses the live editor and selects a range, then releases the module. Before
the fix it deterministically fails: “Expected: focused / Received: inactive”.

1. In `src/lib/assembly-editor.ts`, remember focus, selection and scroll before
   moving the textarea; restore them synchronously after the move, without
   focusing an editor that did not own focus. Keep the native editor and current
   source intact. No new state schema or dependency.
2. Rebuild and run the complete draft suite on desktop/mobile, checking the
   next edit replaces the selected range and reaches local storage.
3. Commit the bounded fix, capture exact source/UI/package/asset inputs, then
   rerun the full release command. Retain the initial failure and final report.
