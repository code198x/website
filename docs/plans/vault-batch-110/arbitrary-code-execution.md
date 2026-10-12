# Arbitrary Code Execution

Source and prose review complete; owner sign-off received through [PR #676](https://github.com/code198x/website/pull/676), merged on 12 October 2026.

| Claim | Verdict | Evidence (public citation) | Change made |
|---|---|---|---|
| ACE always begins with unrestricted arbitrary writes | CORRECTED | TheZZAZZGlitch 8F account; Masterjun submission 4156S | Explain constrained control of data followed by redirected execution. |
| Item values become executable without a separate transfer of control | CORRECTED | Same accounts | Distinguish data preparation, machine instruction encoding and execution; explicitly distinguish compilation. |
| Red/Blue 8F is 0x5C and the same as Yellow ws m | CORRECTED | TheZZAZZGlitch's original 2013 thread | Use 0x5D; separate game-specific items. |
| Quantities alone encode a Z80 JP instruction | CORRECTED | 8F thread; pret item dispatch disassembly | Include identifiers and quantities; remove incorrect opcode and CPU claims. |
| Under one minute of preparation universally suffices | REMOVED | No supporting route/version evidence | Remove timing. |
| SMW uses only controller 2 and a generic stack glitch | CORRECTED | Masterjun 4156S explanation | Describe the documented sprite lookup and controller input chain. |
| Demonstration is an ordinary real-time speedrun | CORRECTED | 4156S and publication 2513M | Explain tool-assisted preparation and real-console replay. |
| SM64 parallel universes, Crystal Coin Case and Twilight Princess jar/torch examples | REMOVED | Draft supplies no matching exploit documentation | Remove misleading examples instead of retaining a catalogue of conflated techniques. |
| Any% means unrestricted methods everywhere | REMOVED | No game-specific rules established | Remove generic category table. |
| All memory is executable on all old hardware; modern jailbreaks share one mechanism | REMOVED | No primary hardware/security evidence for these universal claims | Remove sweeping architecture and security comparisons. |
| Item dispatch loads a handler address and jumps | VERIFIED | pret/pokered engine/items/item_effects.asm | Describe visible code and identify community disassembly provenance. |

Verdicts: 1 VERIFIED, 6 CORRECTED, 0 QUALIFIED, 4 REMOVED.

Prose: replace superlatives and the unsupported exploit catalogue with two documented examples. Explain the distinction between data, machine instructions and source compilation in beginner terms. No exploit recipe or unsupported completion-time claim remains.

## Single-sourced claims

The 8F details are attributed to their original researcher; the community disassembly independently supports the dispatch mechanism, but is not presented as an original Nintendo release. Masterjun's submission is a first-person technical account, with the separate publication record corroborating console verification and the event. Period-library searches did not establish contemporary coverage of these later demonstrations.

## Released source code

Link the community Red/Blue disassembly as reconstructed source, not an official source release.

## Vault candidates

TheZZAZZGlitch, Masterjun, TASBot, Glitch City Laboratories; check existing entries and candidates before adding.

## Commit title

Review arbitrary code execution: explain data, instruction bytes and documented exploits
