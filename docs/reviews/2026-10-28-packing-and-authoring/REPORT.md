# Two Vault batches: packing programs and making games

Sixteen new drafts are prepared in two groups. They remain `ai_generated: true`, `reviewed: false`, visibly unreviewed and excluded from indexing. Human sign-off and verified publication remain pending.

The compression group covers ByteBoozer, Crinkler, Exomizer, Pucrunch, kkrunchy, PowerPacker, Turbo Imploder and ProPack. The authoring group covers Adventuron, DAAD, Garry Kitchen’s GameMaker, HyperCard, Inform, MegaZeux, Repton Infinity and TADS.

## Triage and scope

Fourteen starting candidates were assessed against current titles, aliases, redirects, related sections and every proposed referring context. Open and closed website writing issues were searched by stable ID, subject and aliases. Related issue #1319 concerns Pasi Ojala’s biography and was not reused for his compression tool.

Two combined rows were split while retaining their identities: VC-2487 becomes Exomizer with Pucrunch at VC-3143; VC-2624 becomes PowerPacker with Turbo Imploder at VC-3144. The sixteen scoped articles have canonical issues #1352–#1367. Company/creator context for Aventuras AD and Graham Nelson belongs in the corresponding tool articles here; distinct biographies remain uncommissioned follow-ups.

The evidence is in [triage.json](triage.json), [entries.json](entries.json), [claims.json](claims.json) and [source-fingerprints.json](source-fingerprints.json). The claim report records eighty groups with their sources and qualifications. Hashes identify consulted copies; they do not themselves establish historical truth.

## Sources and writing

Original manuals, documented interfaces, distributed source and public announcements supply the technical account. Independent consuming tools corroborate integration where available: KickAss plug-ins, AMCAF, WHDLoad and the Elevated project. Contemporary and participant evidence adds context: Ainsley and Wilson in The Classic Adventurer, Robyn Miller’s interview, Foraker’s HyperCard 2.2 review and Waddilove’s Repton Infinity review.

Related editions and the same author’s retellings are not counted as independent witnesses. The Repton Infinity review was available as indexed OCR; command names were checked in the manual. Two near-identical 8BS manual downloads are copies of the same work, despite different catalogue labels. The original page image of the review was unavailable in this pass. MacTech was readable through the web tool; a terminal request rejected its expired certificate and was not forced. The C64 GameMaker manual was available through indexed transcription; the scanned Apple edition supplied edition-specific credits and comparable structure, not C64 hardware evidence.

Historical/current boundaries are explicit: Exomizer modes refer to its version 2 documentation; Crinkler’s SSE4.2 requirement belongs to version 3; HyperCard 2.2 is distinguished from 1987; Inform 6/7 and TADS 2/3 are separate generations. No compressor benchmarks, priority claims or quoted security assurances were adopted as measurements performed here. Turbo Imploder’s freely distributable status is distinguished from public domain.

The entries use the site’s concrete British English, explain unfamiliar concepts and keep editorial process out of the articles. Source notes identify editions, sections and supported topics. Vale reports zero errors, warnings or suggestions across the sixteen new entries.

## Connections and imagery

[backlinks.json](backlinks.json) records 37 added incoming links across 23 existing entries, together with inspected contexts where no suitable unlinked mention existed. Removing the new wrappers recovered each original file byte for byte; frontmatter, claims, quotations and sources were preserved. The method and original hashes are in [backlink-preservation.json](backlink-preservation.json).

Four original diagrams explain Crinkler’s combined workflow, Pucrunch’s two kinds of repetition, shared HyperCard backgrounds and Repton Infinity’s editor/linker roles. Each has an SVG source, rendered PNG, SHA-256 manifest and caption distinguishing a schematic from a historical screen. Phone-sized figure captures were visually inspected for legibility and correct relationships. No found portraits, borrowed screenshots or reconstructed historical interfaces were added.

The [named-subject audit](followups.json) records 36 decisions: 27 new uncommissioned candidates, four existing candidates, four contexts adequately introduced by these entries and one research-paper reference. No writing issues were created for untriaged follow-ups.

## Verification

- Full website check: 220 tests in 34 files pass, plus five baseline-key tests. The type checker reports 73 existing baseline errors and no additions. Content links, imagery, assembler and browser-player checks pass.
- Matching sample artefacts: 1,429 units built; 3,156 artefacts staged.
- Production build: 3,596 pages, all fourteen study/index/companion checks, page-frame checks and Pagefind complete successfully.
- Links: 27,195 references across 1,605 entries and 187 redirects resolve. A deliberate missing-target control failed, and restoring the exact file bytes returned the checker to green; see [link-control.json](link-control.json).
- Imagery: 60 images across 54 manifests pass the complete provenance/hash check.
- Browser: all sixteen entries checked at desktop 1440×1000 and Pixel 7 settings: HTTP 200, one main, correct review/noindex state, expected authored figures present, loaded images with alternative text, no horizontal overflow or page errors, and zero Axe WCAG 2 A/AA and 2.1 A/AA findings within main. Screenshots and [browser-results.json](browser-results.json) retain the evidence; [figure-results.json](figure-results.json) records the four phone figure captures. These automated checks do not replace human accessibility review.
- Built HTML: [built-results.json](built-results.json) verifies incoming links, local fragments, exact new-source hashes and sitemap exclusion. All 56 earlier unreviewed drafts remain unreviewed. The reviewed VIC-II entry remains reviewed and indexed as a positive control.
- Backlog: all 3,169 retained records validate against this website checkout, and all nineteen checker regression tests pass. Drafts remain in progress; publication has not been inferred from a successful build.

The existing prose-date diagnostic still fails on two unrelated entries. Its output is retained verbatim:

```text
Facts stated in both frontmatter and prose: 398
Disagreements: 2

  games/diablo
    released: 1996 in frontmatter, 1997 in the prose
  people/louis-castle
    born: 1965 in frontmatter, 1964 in the prose

  The prose is usually right: it is what a person read and wrote.
  Check before copying either way.
```

Neither existing date disagreement was changed by this content batch. The PR is stacked above music-and-sharing to preserve that batch’s independent review status. Local verification is reported separately from whichever remote checks the stacked branch triggers.
