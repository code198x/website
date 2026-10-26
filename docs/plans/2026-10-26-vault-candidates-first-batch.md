# Vault candidates: first batch

Create the first two candidates, Sinclair Microdrive and ZX Interface 2, as unreviewed machine-written entries. Preserve unrelated work.

1. Check Sinclair manuals and independent contemporary reporting; record claim evidence and image provenance here.
2. Write `src/content/vault/hardware/sinclair-microdrive.mdx` and `zx-interface-2.mdx`; include licensed documentary imagery where available.
3. Add contextual backlinks from the eight distinct existing pages named in `code198x/docs vault-candidates.csv`; retain VC-0001 and VC-0002 as in-progress in the current CSV, with issue links and scope notes.
4. Run site checks and production build, inspect built pages at narrow and wide widths, and check sources and imagery.
5. Commit only task files in each owning repository and push the task commits. New entries stay `reviewed: false` pending human sign-off.

Verification: check sources individually, all backlinks resolve, image attribution accompanies each figure, content/schema checks and build pass, built HTML contains both articles and images.


## Evidence and scope

Current candidate IDs: VC-0001 (website issue #1225) and VC-0002 (#1226). Both earn standalone hardware entries: existing pages explain the companies, games or register inputs, while these articles connect physical operation, purchase and use. Current main has no corresponding title, alias or redirect. Open and closed issue searches by name, ID and Interface II returned no existing task.

| Claims | Evidence read | Result and limits |
|---|---|---|
| Microdrive sold in 1983, £49.95, at least 85K, eight-drive chain | E&MM October 1983, News & Letters, ZX Microdrive; Sinclair September 1983 advert | Corroborated across contemporary publications. Product news may repeat manufacturer specifications; it is not a measured performance test. |
| £4.95 cartridge and £29.95 Interface 1 when bought with drive; nine-second 48K loading claim | Sinclair September 1983 advertisement, ZX Microdrive System preview | Attribute loading figure to advertising; do not present it as a guarantee. |
| Continuous loop, two tracks, one drive active | Sinclair service manual, Alford revision 1.1, sections 1.1.7–1.2, pp. 7–9 | Technical description supports the explanation of sequential access. |
| Named files, CAT, SAVE/LOAD syntax, formatting, minimum capacity, finite cartridge life and backups | Sinclair Interface 1/Microdrive manual, first edition 1983, chapters 2–4 | Checked against scan and transcription. Commands are historical examples, not newly executed demonstrations. |
| Two QL drives with integrated control | QL service manual, section 1 paragraph 7.1.1 | Confirmed from the primary text. Do not transfer Spectrum capacity figures to QL. |
| Dickinson's cartridge, grip and sleeve | Edge 137, June 2004, pp. 80–87, Rick Dickinson interview | Participant recollection; keep attributed to Dickinson. |
| Interface 2 late September 1983, £19.95, £14.95 cartridges | Sinclair User December 1983 news; Personal Computer News October 1983 | Two contemporary publications, preserved in one public transcription. Host is not a third source. |
| Cartridge ROM replaces BASIC; no paging, 16K limit | Sinclair service manual section 1.3 and Sinclair User review | Manual establishes electrical operation; contemporary review explains the practical limit. |
| Joystick number-key mapping and IN addresses; simultaneous input limitation of INKEY$ | Sinclair instruction card, Joystick Programming; Sinclair User review | Card transcription has 10 for the 0 key; cross-checked with its bit table and existing port reference. |
| Other peripherals go before Interface 2; printer-only rear connection; power-off cartridge changes | Sinclair instruction card, Connection and ROM software cartridges | Checked; do not confuse Interface 2 with the Microdrive controller. |
| Photographs and licences | Commons file pages for Sinclair ZX Microdrive.JPG and Zx interface 2.png | Viewed both downloaded originals; CC BY-SA 3.0 credits and licence links in captions, hashes and source URLs in manifests. No further edits. |

## Backlog validation

The schema checker validates all 2,941 records; ten checker regression tests pass. The optional all-record website check fails on an unrelated existing reference: `FAIL: VC-0493: missing link_from entry: studies/simcity`. Preserve that candidate. Independently verify all ten referring relationships for this batch (eight distinct articles).

## Checkout preparation

The original checkouts were behind current main. Move the task to current website and docs branches, restore only task edits in the original checkouts, retain existing unrelated files. The fresh website worktree needs pinned npm packages, its pinned UI kit and prepared sample downloads. An initial check before UI preparation reported missing UI components; the first build overlapped bundle staging and failed on `public/emulators/modules/jupiter-ace`. Subsequent checks run sequentially. Prepared sample downloads are reused from the existing site checkout; executable lessons are outside this content task's scope.


## Verification results

- `npm run check`: 230 unit tests pass, type errors match the accepted baseline, content checks and prepared NES/player checks pass after UI and sample preparation.
- Link check: 26,059 references resolve. All four Microdrive and six Interface 2 referring relationships checked directly.
- Image check: all 18 images across 12 manifests accounted for. Negative controls reject a missing target and a missing photograph, then return green after restoring the real content.
- Full production build passes: 2,785 pages; shared frame checked across all public pages; 14 study/index/companion routes pass state checks.
- Visual inspection caught stretched raw image tags. Both photographs now use the existing Figure component with smooth rendering; no shared styles changed. The browser check additionally asserts the original image aspect ratio.
- Frontmatter-versus-prose date report has existing findings elsewhere, none for either new entry. The optional corpus-wide date search was stopped after a bounded diagnostic run; the new dates were checked against the cited primary publications directly.
- Initial fresh-checkout failures resolved through normal preparation: missing UI kit; missing `public/code-samples/.../screen.asm`; concurrent bundle staging during build. No checks or hooks bypassed.
- Source-report limitations: reports and advertisements corroborate what was offered, not measured loading times or a universal reliability claim. No execution or guaranteed cartridge life is asserted.
