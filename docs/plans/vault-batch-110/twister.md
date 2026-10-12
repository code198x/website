# Twister

Source and prose review complete; human sign-off pending. Includes the recovered draft.

| Claim | Verdict | Evidence (public citation) | Change made |
|---|---|---|---|
| Originated in 1990 | REMOVED | Neither cited implementation establishes priority | Remove invented origin year. |
| Twisters require second-line FLI | CORRECTED | Papadopoulos's independent shader implementation | Separate effect from platform method. |
| Nothing rotates at runtime | CORRECTED | Both implementations' source | Remove universal assertion. |
| C64 example prepares graphics before display | VERIFIED | Bitbreaker's C generator and assembly | Distinguish preparation and display. |
| Exact cycle savings apply generally | REMOVED | Timing assertion lacks hardware-canon verification and necessary configuration scope | Omit numerical hardware explanation. |
| Cube and carpet use the same mechanism | QUALIFIED | Codebase64 examples | Scope shared approach to that author's examples. |
| Bitbreaker attribution | VERIFIED | Article byline | Retain credit. |
| Public source omitted | VERIFIED | Both pages contain source | Cite inspected examples without claiming new execution. |

Verdicts: 3 VERIFIED, 2 CORRECTED, 1 QUALIFIED, 2 REMOVED.

Prose: start with the visible result, then explain slices before the platform-specific example. Remove long quotations, unexplained registers and the duplicated frontmatter separator.

## Single-sourced claims

Each implementation is supported by its author's explanation and source; neither establishes historical invention. No first-demo claim is retained. The entry describes software behaviour rather than using an emulator implementation as hardware authority.

## Released source code

Read the published C/6502 example and GLSL function. No code copied or rebuilt, and no claim of validation on original hardware. Papadopoulos labels the example MIT; no licence is inferred for unrelated material.

## Candidate subjects

Bitbreaker and Codebase64 (check existing entries/candidates). A separate x-rotator or waving-carpet entry should earn its own scope rather than duplicate this explanation.

Suggested commit: Distinguish the twister effect from one C64 implementation.
