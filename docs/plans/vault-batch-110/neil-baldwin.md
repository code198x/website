# Neil Baldwin

Source and prose review complete; owner sign-off received through [PR #676](https://github.com/code198x/website/pull/676), merged on 12 October 2026.

| Claim | Verdict | Evidence (public citation) | Change made |
|---|---|---|---|
| Born in 1966 | REMOVED | No reliable birth source established | Remove frontmatter year. |
| British composer/programmer; early career | VERIFIED | Sorlie interview, authorised SID Media Lab translation | Add C64, Demon and shared Eurocom work. |
| Magician 1990 release | QUALIFIED | Baldwin's retrospective labels copyright/project year; Shrigley confirms first Eurocom game | Retain work without conflating production and release dates. |
| James Bond Jr. 1991 release | CORRECTED | Shrigley's developer archive explicitly says released 1992 | Use release year and distinguish development. |
| Hero Quest listed as released | CORRECTED | Baldwin retrospective; Shrigley labels project unreleased | State cancellation. |
| Maximum hardware use and exceptional mastery | REMOVED | Rankings and universal optimisation claim unsupported | Replace with a documented echo technique and workflow. |
| NTRQ only on hardware, not emulators | CORRECTED | NTRQ manual pp. 12–13 | Explain both and transferable saves. |
| NTRQ operation | VERIFIED | Manual pp. 15, 17–25, 30–32 | Describe patterns, tracks and controller editing. |
| Open source; game export | QUALIFIED | NTRQ 1.9 archive, readme, licence and utility C source | Public package contains utility source, compiled tracker and NSF player; do not imply complete tracker source or game integration. |
| Nijuu omitted | VERIFIED | Author's Nijuu manual | Add contrasting text/assembler workflow and resource limits. |
| Continues updating NTRQ and unspecified performances | QUALIFIED | Preserved release archive and current project site | Describe documented later projects without ongoing-support promise. |
| Later non-NES audio tools omitted | VERIFIED | Current projects and VOLDRED documentation | Add concrete modern work. |

Verdicts: 4 VERIFIED, 3 CORRECTED, 3 QUALIFIED, 2 REMOVED.

Prose: replace praise tables with tools, musical choices and collaboration. Explain source text, assembled program and song data without presenting them as interchangeable.

## Single-sourced claims

Personal history is participant testimony. The English interview host returned HTTP 520; the authorised Japanese translation was read instead. Baldwin's own 2009 project dates cannot alone establish retail release years. Shrigley's explicit release statement resolves James Bond Jr.; no exact Magician date is asserted. Period searches did not yield stronger biographical evidence.

## Released source code

Inspected the author's NTRQ 1.9 ZIP: PAL/NTSC ROMs, NTRQNSF.BIN, saves, manual, licence and two C utilities. Read ntrq2nsf.c: it combines the player binary, save data and sample data to export an NSF. This is not a release of the tracker engine's complete source. The included licence permits source/binary redistribution with notice retention. No build or compatibility claim made. Shrigley publishes original Magician, James Bond Jr. and Hero Quest project archives for educational, non-commercial use; his archive description was inspected, not a fresh build of each game.

## Candidate subjects

Eurocom, Tim Rogers, Chris Shrigley, Magician, James Bond Jr., Hero Quest (NES), Shadow Skimmer, NTRQ, Nijuu, Pulsar, PR8, LSDJ and VOLDRED (deduplicate).

Suggested commit: Explain Neil Baldwin's music tools and correct release claims.
