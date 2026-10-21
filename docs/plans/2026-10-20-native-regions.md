# Native tile-region library entries

Parent: code198x/docs#117. Existing tile queries are published by website#857.

1. Add `/patterns/cross-platform/rendering/tile-region/` and nine machine assembly entries, with actual maintained CodeFromFile includes/callers, native captures, precise mode/port/ownership contracts and links to map queries. No new routing or taxonomy.
2. Explain logical map IDs, pattern/colour ownership, checked rectangles, non-square source strides, destination name-table strides and Game Gear's visible window. Identify clipping, asynchronous queues and alternate modes as separate variants. Distinguish a reset diagnostic from a stock-OS loader and emulator evidence from hardware timing.
3. Pin source/evidence links to the verified samples commit. Update relevant query pages to link naturally to the native drawing variant.
4. Run content/unit checks, a production build, desktop/phone discovery and all ten new routes, code/capture loading, overflow and representative light/dark accessibility checks. Push and create a draft PR dependent on the samples change. Retain previews and evidence; do not deploy the new tranche without approval.
