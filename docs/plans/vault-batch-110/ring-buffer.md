# Ring Buffer

Source and prose review complete; human sign-off pending.

| Claim | Verdict | Evidence (public citation) | Change made |
|---|---|---|---|
| Circular queue with independent input/output positions | VERIFIED | Gable, BYTE January 1977 pp. 108–109 | Explain wrapping and unused-slot convention. |
| BYTE diagram is on p. 107 | CORRECTED | Printed folios beside figure 2 and continuation | Correct to pp. 108–109. |
| Ring buffers necessarily use all allocated slots | QUALIFIED | BYTE's full/empty discussion | Explain one reserved slot for the stated queue convention. |
| Producer never waits | CORRECTED | Finite capacity; Exec's overflow warning | State the need for an explicit full-buffer policy. |
| Every ring buffer is a FIFO queue | CORRECTED | AGEXM.SRC rolling echo history | Distinguish a queue from retained history. |
| Sixteen three-byte entries, 49 bytes reserved, AND 15 wrapping | VERIFIED | AGEXM.SRC ECF1, ECTA, POINT, DELAY | Retain exact inspected structure. |
| Echo records are audio samples | CORRECTED | Source copies SMCC/SMXC/SCS operand values | Describe stored sound parameters. |
| This exact source is a beeper engine from a named shipped Agent X II version | QUALIFIED | Source has no title/version; archive labels are not a binary match | Identify the actual file and archive without assuming shipped provenance. |
| Updates are necessarily video frames, fixed fifteen-frame delay | REMOVED | DELAY operand is modifiable; timing not established here | Describe update-relative history without a frame/time claim. |
| Write position is self-modified instruction operand | VERIFIED | POINT stores into POINT+1 | Explain this specific implementation. |
| Wack can leave producers running while consumers stop | VERIFIED | Commodore Exec manual chapter 8 p. 84 | Retain bounded-buffer warning, remove unsupported twenty-year interval. |

Verdicts: 4 VERIFIED, 4 CORRECTED, 2 QUALIFIED, 1 REMOVED.

Prose: replace repeated quotations and generic efficiency promises with finite-capacity behaviour and a source-level example. Remove the unrelated game price/review and hardware-FIFO analogy.

## Single-sourced claims

The general structure has independent period magazine and Commodore documentation. Music implementation details come directly from the donated source, not from an inferred game credit. The archive's provenance is attributed to its maintainer. No assumption that each update equals a frame, or that a file name proves a shipped version.

## Released source code

Belfield's archive credits permission from the Follins and Ste Ruddy. Link the published source and describe the technique; do not reproduce the assembly listing. Directly checked allocation, initialisation, writes, delayed reads and operand updates.

## Vault candidates

Dean Belfield, Eloquent Little Monitor, G. H. Gable, Wack; check existing entries and candidates before adding.

## Commit title

Review ring buffers: explain capacity limits and verify the music history example
