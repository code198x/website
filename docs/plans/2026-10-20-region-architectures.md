# Native regions: Oric, Atari, Game Boy and Amiga

Continue approved region-family work (docs#117); samples#131/website#868 are merged. Reuse existing map formats, CPU routines, original reset builders and verification transport. No dependencies, taxonomy or architectural changes.

1. Inspect source references and existing rendering samples. Select Oric HIRES (six-pixel cells with attribute reservation), Atari 800XL ANTIC bitmap mode, Game Boy background map with safe VRAM ownership, and Amiga A500 planar CPU/blitter variants.
2. Add four maintained reusable machine adapters plus original reset diagnostics under each machine's patterns/assembly/rendering/tile-region, and shared region-architectures build/config/contracts. Keep input/output/state/memory/interrupt/display ownership explicit. Record each configuration and limits.
3. Execute released-tool builds; compare whole destination memory/guards and independent native pixel models. Run rejected requests separately to prove no partial writes. Execute wrong-layout and unsafe-destination controls; compare Amiga CPU/blitter output. Preserve source/tool hashes and captures. Extend existing retained-evidence checks without weakening earlier invariants.
4. Add four library entries, update shared region guide, link existing queries and strengthen the existing Amiga blitter entry with the verified reusable component. Show actual includes/calls and costs, no unmeasured frame-budget claims. Run unit/content/build and desktop/phone checks.
5. Push task commits and create draft companion PRs; update issue117, preserve a downloadable review pack and previews, then remove temporary worktrees/builds/tools/processes after verifying remote retention. Do not merge/deploy this new tranche without approval.
