# Reusable geometry and CPC MODE 1 — docs #124, #127 and #131

Agreed scope: integer lines, circle/ellipse outlines and span fills on Spectrum
48K, BBC MODE 4 and Dragon PMODE 4; CPC MODE 1 pixel/span backend and the same
geometry; practical Maths for Games explanations. Reuse the existing Amiga line
component as a documented hardware comparison. No new dependencies or shared
site layout changes.

1. Reuse drawing-foundations/{z80,6502,6809}.inc unchanged. Add the CPC MODE 1
   backend under cross-platform/patterns/rendering/geometry/cpc.inc, with its
   own packed two-bit pen/mask/read contract, independent CRTC/Gate Array caller,
   and validation before using it for geometry. Full mode: 320x200 at $C000.
2. Add geometry/{6502,z80,6809}.inc. Separate caller-owned G scratch from BP.
   Geometry takes signed coordinates -512..511, radii 0..255, a caller-selected
   physical-screen scissor, operation and optional line endpoint ownership.
   Lines use integer accumulated error; clipping preserves the original raster
   phase by discarding off-scissor pixels, with bounded offscreen work.
   Ellipses use incremental integer decisions and axis symmetry; circle entries
   reuse equal-axis ellipses. Filled forms emit each row once as a clipped span;
   symmetry never repeats an XOR pixel/span. Use wide error intermediates and
   validate ranges before writes. Existing BP APIs and source evidence unchanged.
3. Add four machine rendering/geometry/ folders with complete buildable reset
   callers and Makefiles. Keep setup/mailbox separate from callable code; include
   ordinary direct calls the reader can copy. Retain existing row-address helpers.
4. Add scripts/verify-geometry.py and check-geometry.py plus meaningful failure
   controls. Independently check complete bitmap allocation and guards after
   every call, preserved request fields/status, all octants, reverse/tie rules,
   clipping/negative/extreme inputs, axis/degenerate/radius/overflow boundaries,
   all operations and CPC pens/packing phases. Compare native full frames with
   an independent composition; execute completed wrong-geometry and wrong-pen
   controls, and prove corrupt/missing retained observations fail. Pin released
   assembler/emulators, checksums and producer locks; no manufacturer ROM needed.
5. Add geometry family and four machine articles, CPC pixel/span article and
   a Maths for Games integer-rasterisation explanation using the existing shared
   layouts. Provide code/includes/callers, measured sizes/write work, original
   native images/diagrams, edge examples, aspect discussion, and reciprocal links.
   Compare actual Amiga/BASIC/AMOS/Blitz capabilities without new platform claims.
   Specify a bounded later polygon/flood-fill contract; do not implement it here.
6. Verify all four emulators, independent retained controls, source bindings,
   assembled label budgets; build website with current samples, run unit/content
   checks and targeted desktop/phone accessibility/code/image/discovery checks.
   Commit coherent changes, push companion PRs and attach them. Report actual
   evidence and remaining gates. Do not merge this new tranche without approval.

Task-owned worktrees: /private/tmp/198x-geometry-samples and
/private/tmp/198x-geometry-website. Tool downloads/builds are disposable; retain
verification and a review pack before removing completed worktrees. Primary
website has unrelated untracked review work and must remain untouched.
