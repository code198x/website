# C64 movement pattern — 10 October 2026

The movement pattern now consumes a complete maintained program. Vertical
moves clamp to the edge instead of rejecting a step; opposite directions
cancel per axis; joystick port 2 is sampled once per frame. The page states
initial-state bounds, CIA/VIC ownership, diagonal and regional speed, and
replaces unsupported cost estimates with the assembled routine/state sizes.

Samples PR #63 merged as `301cb16b1ee2df7f5d6d383ae22dd45bf9807966`;
the page pins that revision.

The approved implementation plan and native evidence are in the samples
repository, `docs/plans/2026-10-10-c64-sprite-movement.md`. The original
listing's faults reproduce on both engines/standards. All 6,144 corrected
arithmetic/register cases and 48 live port-input captures pass in Emu198x
and VICE, PAL and NTSC; deliberately removing the clamp is rejected.

The website evidence audit now checks repository-relative shared sources
as well as local sample files. Its negative control changes a shared include
at the movement record's exact pin and must fail. This covers the reused
Hardware Sprites routine/shape and PNG reader without copying their code.

Website validation is retained alongside this record: production build,
twelve Pattern Library desktop/mobile checks, focused rendered-page checks,
and all 71 pattern labels and pinned source identities. This is not a new
full release-acceptance run or an original-hardware claim.
