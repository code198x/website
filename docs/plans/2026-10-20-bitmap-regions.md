# Bitmap-region expansion

Parent: code198x/docs#117. Continue the approved map/region family; no new architecture or dependencies. Previous native VDP samples#129 and website#866 are merged.

1. Inspect existing shared 6502/Z80 map routines, native reset builders and source references. Select BBC Micro MODE 4, Acorn Atom 256×192 monochrome, Dragon 32 PMODE 3 and Amstrad CPC MODE 1: 6502, 6809 and Z80 with distinct bitmap layouts.
2. Add caller-owned reusable checked region routines under each machine’s patterns/assembly/rendering/tile-region and shared bitmap-regions helpers. Retain map reads where available, explicit dimensions, whole-request validation before writes, and no hidden video or interrupt ownership. Original reset diagnostics configure video separately.
3. Execute with released Asm198x/Emu198x. Independently compare full framebuffer memory/guards, rejected-call no-write behaviour, native image output and completed wrong-layout/unsafe-bounds controls. Retain exact sources, tools and evidence. Add failure-control gates to existing pattern CI.
4. Add four machine library entries and expand the shared region guide with actual maintained code, native captures, mode/address/pixel-packing explanations and limits. Run content/build and desktop/phone checks.
5. Push reviewed task commits and draft companion PRs, update issue117, preserve a review/download pack, remove temporary worktrees/tools/processes after verifying remote retention. New work remains unmerged for review.
