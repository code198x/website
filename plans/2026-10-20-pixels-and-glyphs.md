# Reusable drawing foundations — docs #122 and #123

## Agreed scope

Six callable assembly components: pixels/spans/boxes on Spectrum 48K, BBC MODE 4,
Dragon PMODE 4; glyph installation/replacement and cell selection on unexpanded
PAL VIC-20, MSX1 Graphics I and DMG with LCD off. Preserve hardware differences.
Do not merge the pending character-region PRs as part of this work.

## Steps and verification

1. Inspect existing addressing, video setup, region callers and primary references.
   Reuse Spectrum bitmap-addressing helper and the three machines' existing native
   layout knowledge. Record contracts before writing implementations.
2. Add `cross-platform/patterns/rendering/drawing-foundations/` build/configuration
   and bitmap includes, plus each machine's `pixels-and-boxes/demo.asm` caller.
   Use bounded coordinates, byte masks and whole-byte span interiors. Check all
   operations, edge phases, empty/reversed ranges and untouched neighbours.
3. Add machine-specific `custom-glyphs/glyphs.inc` and complete original callers
   for VIC-20, MSX and DMG. Check first/last slots, counts, shared replacement vs
   individual cell selection; preserve ownership and native access constraints.
4. Add independent executable checks in `scripts/verify-drawing-foundations.py`:
   full destination memory, guards, read results, native frames and deliberate
   mask/slot faults in each released emulator. Retain tool/source hashes and raw
   evidence; separately report code/data/scratch and representative transfer work.
5. Add machine articles and comparison pages in website `src/content/patterns/`,
   with CodeFromFile, real include/init/call examples and locally explained maths.
   Link Place a point and Crates where appropriate. Verify source pins, build,
   links and desktop/phone rendering through the existing website checks.
6. Push verified commits and companion review PRs, update issues 122/123/131,
   copy review evidence into this chat's outputs, and clean task-owned processes,
   downloaded tools and worktrees after verifying remote retention.

## Evidence limits

Reset fixtures are original programs, not proof of stock-OS loading. Emulator
observations apply to each named mode and released binary. No live-VRAM queue,
frame-budget claim, proportional font or implicit colour-mode port is included.
