# Native regions: Electron, PET, VIC-20 and Aquarius

Continue docs#117 after merging samples#132 and website#869. Preserve the common six-byte checked request, actual machine contracts and reusable maintained includes.

1. Inspect existing map/probe reset builders and primary display references. Select Electron MODE 4, PET 40-column screen codes, unexpanded VIC-20 character/colour cells and Aquarius character/colour cells. Record fixed-glyph versus writable-glyph capabilities.
2. Reuse the 6502 bitmap renderer for Electron; add maintained 6502/Z80 character-region routines with descriptor translation and optional colour planes. Original reset diagnostics remain separate from callable routines. Explain memory, register, stack, interrupt and video ownership.
3. Build with verified released tools. Execute whole-screen/colour/guard checks, native pixel comparisons, fifteen isolated rejections per system and deliberately broken controls. Retain source-locked evidence; extend independent retained guards and their failure tests without weakening existing gates.
4. Add machine library entries, shared guide links and map-query cross-links. Verify website content, build, desktop/phone listings, captures and accessibility.
5. Push verified commits, create companion draft PRs and update issue117. Preserve a downloadable review pack and clean up temporary workspaces/tools/processes after checking remote retention. Do not merge this new batch without approval.
