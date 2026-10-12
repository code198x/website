# Reversi

Source and prose review complete; human sign-off pending.

| Claim | Verdict | Evidence (public citation) | Change made |
|---|---|---|---|
| Exact 1883 invention/release date | REMOVED | Historical research gives a different origin account; WOF histories are inconsistent | Remove exact release field; retain evidenced nineteenth-century context. |
| Reversi was simply trademarked as Othello | CORRECTED | WOF Seeley rules comparison; Michaelsen/Moss/Toft 2025 | Distinguish names and rulesets; omit unsupported legal-registration date. |
| Eight-by-eight board and directional outflanking | VERIFIED | WOF official rules; Rose chapter 1 | Explain mandatory flipping and fixed starting position. |
| Game ends only on a full board | CORRECTED | WOF official rules explicitly allow empty squares at the end | State neither player has a legal move; include draws. |
| All edge discs are stable | CORRECTED | Rose chapters 2–3 | Separate corners from potentially flippable edges. |
| Mobility can matter more than immediate disc count | VERIFIED | Rose; Frey's programming discussion | Explain choices created for both players. |
| Nearly every platform, unspecified ROM/bundled versions | QUALIFIED | Duda listing and Frey's named versions | Replace universal coverage claims with concrete examples. |
| Published type-in and programming strategies | VERIFIED | BYTE October 1977 pp. 60–62; July 1980 pp. 56–72 | Identify authors, code and approach. |
| Easy to implement/debug and a few kilobytes | REMOVED | No general measurement or evidence of ease | Distinguish legal play from strong play without promising trivial implementation. |

Verdicts: 3 VERIFIED, 3 CORRECTED, 1 QUALIFIED, 2 REMOVED.

Prose: explain the rule variant before strategy. Remove unsupported survey-scale claims and the tangential course promotion. The old date is not replaced with another confident exact date from a conflicting account.

## Single-sourced claims

Historical context uses a research paper which cites period advertisements and museum holdings. Those underlying advertisements were not independently inspected. Seeley's article supplies a rules distinction, but its broader origin narrative conflicts with newer historical work and is not repeated. WOF rules are authoritative for modern Othello, not every historical Reversi variant. Duda and Frey describe their own programs.

## Released source code

Duda's complete BASIC listing was published in BYTE October 1977 pp. 61–62. Board array, direction increments and move scoring inspected directly. Publication is not a claim of modern open-source licensing. Frey's article offers software and discusses algorithms; it is not treated as the same listing or as a release of all commercial Othello implementations.

## Vault candidates

Richard O. Duda, Peter W. Frey, Brian Rose, Othello, Goro Hasegawa; check existing entries/candidates.

## Commit title

Correct Reversi rules and explain early computer opponents
