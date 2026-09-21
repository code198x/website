# Aiming website integration

Local isolated production build, not a publication record. The snapshot contains
staged maths changes and committed website files, excluding unrelated local edits.
The required build passes: 72 tests passed, 9 decoder-dependent tests skipped.

`results.json` records both entry routes, independent sequence boundaries, scoped
controls, actual embedded results, progress markers and responsive height checks.
`accessibility.json` records axe checks for all six pages in light and dark themes,
including the embedded documents. Theme checks wait for colour transitions to
settle. Screenshots were inspected at desktop and mobile widths.

The accepted mathematical model and standalone experiment checks are maintained
in code-samples/craft/maths-for-games/aiming/verification/.
