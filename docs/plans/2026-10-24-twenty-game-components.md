# Twenty further reusable game components

Continue ordinary dependent source/site stacks after samples #238 and website #1046. No merge or deployment.

- Inventory existing topics; retain the previous verification records and transport unchanged. Use `/private/tmp/code198x-gamekit-samples` and `/private/tmp/code198x-gamekit-site`.
- Add animation timeline, rational tick division, pause clock, input sequence, chord recognition, four-way arbitration, analogue dead zone, weighted choice, shuffle bag, waypoint route, inventory stacks, recipe transaction, dialogue gating, decimal parser, stable depth order, dirty-cell tracking, bounded flood fill, cardinal line of sight, reflected axis motion and slope-height lookup. Implement each in C64/Spectrum/NES/Amiga assembly; BASIC/FORTH and other machines remain distinct coverage.
- Each `cross-platform/patterns/<category>/<slug>/` supplies a shared MOS implementation and independent oracle. Each `<system>/patterns/assembly/<category>/<slug>/` supplies component, bindings, normal/custom/wrong/repaired callers, Makefile, README and observations. Isolate new qualification under `scripts/*gamekit*` and `cross-platform/patterns/framework/gamekit-models/`; do not change previous gates.
- Verify boundaries and retained sequential state, dirty reset, register ownership, wrong-caller divergence and exact repair. Assemble and execute all variants through existing real Emu198x loader paths; retain full observations and verified captures. Mutation checks must reject corrupt evidence. Keep firmware private.
- Author `src/content/patterns/<system>/assembly/<category>/<slug>.mdx` with usable code, caller explanation, costs, alternatives, customisation and mistakes/repairs. Reuse approved layouts and check publishing identity, build, desktop/phone rendering, discovery and links.
- Commit/push one topic per dependent source/site PR pair; update existing tracking issues. Read unfiltered CI. Verify all remote heads and recovery bundles, then clean only task-owned worktrees, processes, builds and tools.

No new dependencies, layout/schema changes, shared-history rewrites or fabricated performance claims.
