# Vault candidates: early British micros

Create a bounded second batch from the current candidate backlog: VC-0003 MK14, VC-0004 Grundy NewBrain and VC-0005 Acorn Atom. All remain machine-written and unreviewed until owner approval. Preserve unrelated checkouts and files.

1. Read the referring entries and current charter, Vault, writing-voice and candidate specifications. Check current titles, aliases, redirects and open/closed issues before commissioning duplicate work.
2. Research manufacturer manuals, contemporary advertisements and independent period reviews. Record checkable claim evidence, price/date distinctions and source limitations below. Add new hardware source notes to the primary reference layer before using them here.
3. Write `src/content/vault/systems/science-of-cambridge-mk14.mdx`, `grundy-newbrain.mdx` and `acorn-atom.mdx`; use the existing Figure component for licensed, inspected documentary photographs. Record provenance in `capture/vault/systems-*.json`.
4. Add contextual backlinks from the ten candidate relationships across eight existing entries: Sinclair Research, Clive Sinclair, ZX80, BBC Computer Literacy Project, Acorn Computers, Bug-Byte, Acornsoft and MC6847. Correct immediate source-proven factual errors where they would mislead a reader following the new link.
5. Retain candidate IDs and mark only these three in progress in `code198x/docs`'s `vault-candidates.csv`, with triage notes and writing-issue URLs. Record new substantive candidates only if needed.
6. Run appropriate content/link/imagery checks, unit checks and a production build; inspect the built articles at phone and desktop widths, with decoded images, preserved proportions, sources, review status and working connections. Distinguish pre-existing failures from changes in this batch.
7. Commit only task files, push and create draft pull requests with evidence reports. Remove clean temporary worktrees and task-owned dependencies/builds after verifying remote retention; stop the preview process. Do not merge or mark reviewed without human approval.

## Admission and evidence

No current standalone titles, aliases or redirects cover these three machines. All referring entries were read. Open/closed issue searches by subject and candidate IDs found no existing task. Writing issues are website #1230 (MK14), #1231 (NewBrain) and #1232 (Atom). These are historical hardware entries using the existing template; they add no curriculum or emulator support claim.

| Claims | Evidence read | Verdict and limits |
|---|---|---|
| MK14 advertised by March 1978, £39.95 plus £3.20 VAT and 40p postage | Science of Cambridge advertisement, Wireless World March 1978 p.113 | Positive availability evidence before 1979. Do not infer an exact first shipment day from a later catalogue's 1977/1978 date. |
| MK14 256 bytes RAM and 512-byte monitor; keypad, LED readout | Same advertisement; manufacturer MK14 Manual part 1 sections 5–9 | Corroborated. Monitor here is control software, not a video display. No BASIC or TV output is claimed for the base kit. |
| SC/MP II, RAM expansion and optional interfaces | A.A. Berk, Practical Electronics May 1979; manufacturer manual | On-board extra 256 bytes plus 128 bytes in the I/O device gives 640 bytes. The advert's 4MHz crystal is not presented as an instruction rate. |
| Moon Landing's numerical instrument display, thrust keys, fuel; game and music listings, credits | Manufacturer manual part 2, Games and contents | Read the original instructions. Descriptive account only; no new execution claim or reproduced game media. |
| Keypad and delivery problems | Berk's owner review | Attribute the experience and avoid a universal delivery-time claim. |
| Existing Sinclair articles place the MK14 after the 1979 split | Compare their wording with March 1978 advert | Reproduced chronology error. Correct only the linked passages: the kit business already existed before Sinclair left Radionics. NewBrain paragraph now distinguishes 1982 sale from earlier development. |
| NewBrain 1982 availability, A/AD distinction, 32K RAM, £233/£267.50 prices | Simon Beesley, Your Computer September 1982 pp.86–89 | Date-specific review prices; no universal launch-price assertion. AD has 16-character display. |
| 4MHz Z80A, COP420M, monochrome graphics and planned battery model | BYTE January 1983, What's New in Britain p.47 and continuation; Grundy technical manual sections 1.3–1.4 | Distinguish base units from promised variants and expansions. No battery portability claim for standard A/AD. |
| Streams and device-driver organisation | Grundy Software Technical Manual, preface, sections 1.1–1.4 and 3; Beesley review | Manufacturer design corroborates the review's account. Copyright 1981–1983 is not treated as a precise publication date. |
| Path through Sinclair, Newbury and Grundy; hardware/software designers; August 1983 closure and Dutch continuation | Former GBS employee Gerald McMullon's undated notes reproduced with permission at Binary Dinosaurs; contemporary BYTE for Newbury/Grundy | Participant recollection remains attributed. Omit allegations about named directors, sales totals and counterfactual success. No universal hardware discontinuation date. |
| NewBrain in BBC planning | BYTE January 1983; referring BBC project entry and its period interview evidence | Consideration does not establish an awarded production contract. Production BBC Micro is the Acorn Proton. |
| Atom sold in 1980, kit and assembled; 1MHz 6502, memory and expansion | Atom Technical Manual issue 2 October 1980 pp.3,16–23; Jim Murray Practical Computing November 1980 pp.66–68 | Corroborated contemporary existence. No exact launch month or unsupported end date. |
| Atom basic 2K memory allocation | Technical manual circuit description p.16 and lower text extension p.21 | 1K system workspace plus 1K shared by 512-byte display and 512-byte program text. Avoid saying 1K user space. |
| Integer BASIC, integrated assembler and LINK; optional floating point | Atomic Theory and Practice chapters 1–2,13,17,22 | Read primary manual. No reproduced executable example or new execution claim. |
| MC6847 and expanded graphics | Technical manual and Murray review | Separate the reviewer's expanded/pre-production machine from base configuration. Colour output needs appropriate hardware. |
| Kevan Earl's kit purchase and Backgammon route to Bug-Byte | Science Museum Group object Y2002.13 | Attribute to the object's recorded history. £150.20 and one-to-two-week build belong to this owner, not all kits. |
| Acornsoft/Bug-Byte market and BBC connection | Existing publisher articles and their 1981 advertisements/reviews; BBC project's Chris Curry interview | Links supply the fuller existing accounts. Do not suggest Atom/BBC language or binary compatibility. |
| Three documentary photographs | Commons file pages MK14.JPG, Grundy newbrainAD.jpg, Acorn Atom.jpg; downloaded files inspected | MK14: Andrew Steers CC0. NewBrain: AlisonW, brightening Hohum, CC BY-SA 3.0. Atom: Jamesfcarter CC BY-SA 4.0. All unchanged; source URLs and hashes in manifests. Alt text checked against actual images. Use existing smooth Figure component. |

## Candidate records

Retain VC-0003–0005 as in-progress. Reuse VC-0283 for David Johnson-Davies and add the two new referring entries; do not duplicate him. Mike Wakefield and Basil Smith enter as VC-2942 and VC-2943, needs-triage only, with the NewBrain as the referring entry. Their mention does not commission biographies.

## Verification notes

The initial link check rejected a mistaken `magazines/your-computer` source reference. There is no such Vault entry; use the actual publication title as the schema allows. The check was not weakened.

The optional whole-backlog website check still reports the existing unrelated failure: `FAIL: VC-0493: missing link_from entry: studies/simcity`. Preserve that record and check this batch's referring relationships directly. Backlog schema validation passes for all 2,943 rows; all ten checker regression tests pass.

## Final verification

- `npm run check` passes: 230 unit tests; 73 pre-existing type errors match the accepted baseline; content, link, imagery, prepared NES assembler and player checks pass. No baseline or checks changed.
- Full production build passes: 2,788 public pages with the shared frame verified. No new dependencies, shared styles or templates.
- All ten required candidate relationships are present, plus an additional BBC-project-to-Atom link. The built articles' internal Vault destinations respond successfully.
- All 21 Vault images across 15 manifests are accounted for after the rebase. The three new images decode and preserve their original proportions at 390px and 1440px.
- Browser checks on all three entries at both widths verify titles, images, alt text, credits, sources, noindex/review status and no horizontal overflow. axe reports no main-content WCAG A/AA violations.
- The unreviewed articles are excluded from the built sitemap. Their publication/review status is not changed by automated checks.
- Manual visual review caught raw Markdown in an Atom caption; the caption is now plain text. Existing prose links carry the relationships. A regression assertion rejects raw link syntax in captions.
- Date/prose report has existing findings elsewhere, none for these new entries. Dates here were checked against dated primary documents directly; no corpus-wide date inference is claimed.
- A deliberate missing Vault target made the link checker fail; restored content passes. The initial browser helper needed an explicit browser context for axe; that harness error was corrected, without changing product checks.

Full release and broad browser suites are not claimed for this draft content batch. Existing wide-site platform-balance advisories and the unrelated `studies/simcity` backlog-reference failure remain outside it.


## Publication of the first batch

While preparing this batch, approved website PR #1229 merged and deployed successfully. Both live reviewed pages returned 200; all ten referring links were present; both photograph checksums matched their manifests; both entries appeared in the live sitemap. VC-0001 and VC-0002 are therefore recorded as published, with their covered paths retained. This does not approve VC-0003–0005.

The unpushed website branch was rebased onto current main after that merge. The three new article files and runtime components, styles and package versions were unchanged by the rebase. Content checks then passed with 26,087 resolving references and 1,492 Vault entries; a fresh 2,788-page production build passed on that base. The three new entries remain unreviewed.
