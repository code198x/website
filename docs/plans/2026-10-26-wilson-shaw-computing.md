# Sophie Wilson, Carol Shaw and women's contributions to computing

Owner commissioned these three entries on 26 October 2026. Draft with `ai_generated: true`, `reviewed: false`; seek owner sign-off on completed articles before publication.

1. Recheck candidate identities VC-0738, VC-0247 and VC-2826; read their existing issues, referring entries, charter and Vault/voice specifications. Verify titles, aliases, redirects and issue history to avoid duplicates.
2. Research Wilson's and Shaw's work through attributable interviews, contemporary documents and independent institutional sources. Write claim-level evidence and limitations below. Research specific computing-workforce and recognition examples for the theme; avoid a universal or US-only account.
3. Add `src/content/vault/people/sophie-wilson.mdx`, `people/carol-shaw.mdx` and `culture/women-in-computing.mdx`. Use documented imagery where rights permit, with Figure components, credits, alt text and capture manifests. Do not use an online portrait without permission.
4. Add the twelve required referring relationships, reciprocal links and useful connections to the recently published Acorn Atom. Repair the directly related ENIAC timeline's dates, priority wording and programmer credit using checked sources. Do not link unwritten biographies.
5. In code198x/docs, retain all candidate IDs and mark only these three in progress. Keep the twelve planned theme references until reviewed publication, then replace them with the verified live source path; record useful missing subjects using existing candidates before adding any new identities.
6. Run existing content/link/imagery/source/date checks, full `npm run check`, whole-backlog validation and checker regressions. Build the production site and inspect the three articles at phone and desktop widths, including decoded imagery, credits, source sections, unreviewed/noindex state, sitemap exclusion, internal links and accessibility.
7. Commit and push bounded changes; open draft website/docs PRs with evidence reports. Verify remote retention and remove temporary workspaces, caches and processes before handing off for review.

## Evidence report

| Claim or choice | Evidence checked | Verdict / limit |
|---|---|---|
| Wilson's birth, student work and System 1 | CHM institutional biography; Wilson/Fairbairn oral history, 31 January 2012, pp. 10–12 | Corroborated. Do not adopt a precise degree/course chronology from the abbreviated biography. |
| Acorn languages and BBC BASIC | BCS 2020 career account; Wilson interview, pp. 16–20 | Corroborated responsibilities. Credit the prototype and wider engineering work separately. |
| Procedures, functions and resident assembler | Coll/Allen BBC Microcomputer System User Guide, issue 1 October 1984, chapters 17 and 44 | Read the actual PDF title page. The download's filename/catalogue describes it as an earlier guide; cite the 1984 edition actually read. |
| ARM roles and pre-silicon modelling | Wilson interview, pp. 20–23; Furber/Ronald Wilson interview, EDN/EE Times, 11 April 2005 | Independent participant accounts agree on the instruction-set / hardware distinction. No sole-inventor claim. |
| Load/store explanation | VLSI Technology ARM Family Data Manual, 1990, VL86C010 instruction tables and Load/Store Value from Memory section | Existing primary reference checked; public mirror downloaded and recognised as a PDF. Later ARM2 documentation, not a first-chip performance measurement. |
| First ARM and later career | Wilson interview, pp. 23–27; CHM biography; Royal Society profile | First silicon dated 26 April 1985; distinguish second processor and 1987 Archimedes. Follow FirePath beyond Acorn without recycling stale shipment totals or current job-title claims. |
| Shaw's education and early programming | Randi Hacker interview, Electronic Fun September 1983, PDF pp. 77–78; Berkeley EECS 2018 record | Degree years corroborated; puzzle exercise and placements are her contemporary account. No unqualified first-woman-game-designer claim. |
| Shaw's Atari projects and archival survival | The Strong, Carol Shaw Papers finding aid, January 2022, pp. 1–6 | Catalogue supports the listed original material and donation. Do not claim direct inspection of unpublished source printouts. |
| 2600 / computer River Raid distinction and collaborative design | Hacker interview, PDF pp. 78–80; Activision 1982 instructions, AX-020-03 | Contemporary platform distinction and named credit. Avoid resolving inconsistent later recollections about which colleague suggested a theme. |
| Repeatable river and Tandem | Shaw/Edwards interview conducted May 2011, published 12 October 2011 | Attributed retrospective account. The new diagram illustrates a principle; no actual code, level data, captured gameplay or execution claim. |
| Langley segregation and change | Shetterly/NASA biography; original Thompson memo, 5 May 1958, NARA 81215360, and archive context | Read the original ten assignments. Vaughan's line says Analytical Computing Branch; do not replace it with a later organisational name. Distinguish documented restriction from individual recollection. |
| ENIAC group, programming and dates | Penn 2021 institutional account; CHM collection account; APS 2022 history citing the December log; Weik 1961 BRL history | Credit all six original programmers. December 1945 calculation precedes 15 February 1946 dedication. Remove broad priority and UNIVAC-first claims instead of repeating them without qualification. |
| Visible timeline credit | Timeline schema, event builder and rendered 1940s page | Timeline cards render frontmatter summary, not the MDX body. Place the six names in the summary; keep fuller sources in the source document. Team biography remains unwritten, so no link to it. |
| Roberta Williams and Japanese game music | Byron/Williams, START March 1990, Atari Magazines transcription; Taher/Matsumae interview, translated by Aniel, Brave Wave | Distinguish design, programming, composition and sound effects. Participant accounts are attributed and the translation identified. |
| Different workplace experiences | Bailey/Alexander 2007 interview; Shaw/Edwards 2011 interview | Attributed recollections about particular teams. Do not generalise either experience or assert anonymous colleagues' comments as independently established facts. |
| British workers and archival recovery | Hicks, What Makes a History Hidden?, MIT Press, 29 March 2019 | Use the historian's actual research account about Gillespie, Sayce and the 1965 advertisement. Do not cite unread book passages as evidence. |
| Imagery | Existing Atom licence/manifest; original schematic SVG/PNG; unchanged NACA scan inspected | No portraits. Preserve Atom attribution, document original diagram and explicitly label it schematic, identify federal record and public-domain status. No shared component change for credits. |

## Candidate audit

Keep VC-0738, VC-0247 and VC-2826 in progress, with original issue URLs. Reuse VC-2028 River Raid, VC-0751 Steve Furber, VC-0067 ARM, VC-2369 BBC BASIC and VC-0512 John Coll for new references. Eight missing subjects enter needs-triage only (VC-2944–VC-2951): System 1, Tandem, 3-D Tic-Tac-Toe, Video Checkers, Happy Trails, Polo, FirePath and Instant Insanity. No additional biographies or game articles are commissioned. Ordinary workers mentioned in a historian's research are not automatically commissioned as individual biographies. Keep the twelve planned theme references until reviewed publication.

## Verification

- `npm run check` passes: 230 unit tests, 73 type findings matching the accepted baseline, content/imagery/link checks, prepared NES assembler and player checks. No baseline, dependency or test changes.
- `check:sources` completes; the frontmatter-versus-prose date report has no finding for these entries. The optional full-corpus date scan was stopped because of its runtime; it is not a completed check. New date claims were checked directly against sources.
- Initial production build failed with `CodeFromFile: missing code sample atari-800xl/patterns/assembly/framework/turn-deadline/demo.asm`. The ordinary sample checkout was behind current main. An isolated checkout of code-samples main (b814bc40) supplies the actual sample; a fresh build succeeds against it. No website check was weakened and no sample source edited.
- A deliberately missing Vault target makes the link checker fail; restored real content passes.
- Whole backlog validates 2,951 candidates against this website branch. All 19 checker regression tests pass.
- Initial rendered checks pass at 390px and 1440px: three titles, draft/noindex state, decoded images with preserved proportions, source sections, no horizontal overflow and six main-content WCAG A/AA axe checks. All 32 internal links from the entries respond. Sitemap exclusion is checked against a nonempty sitemap containing an approved control entry.
- Twelve required incoming relationships are present in built pages, plus Atom-to-Wilson. All entries remain AI-generated and unreviewed.
- Visual inspection caught a misleading generic Photo credit on the diagram/document; their credits now sit in captions. The final build and targeted browser checks are repeated after that edit and the visible timeline credit repair.

The wider full-site browser and release suites are not claimed for this bounded draft batch.

Final verification: the corrected build passes with 2,848 public pages and 50 shared-frame families checked. Repeated targeted Chromium checks pass for all three entries at both widths, including six axe checks and 32 internal links. The rendered 1940s timeline names all six original programmers. Both document and diagram credits are accurately labelled. The required twelve incoming links and the additional Atom link are present. No broad browser/release-suite result is claimed.
