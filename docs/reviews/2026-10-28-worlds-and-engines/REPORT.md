# Game worlds and their engines — review evidence

Sixteen AI-generated drafts are ready for human review. All retain `reviewed: false`; none has been approved for publication. This branch is stacked on `vault/packing-and-authoring-20261028` (website base `fdfe241da1b4cdc5b0c21dc0fbcbf390284a69b4`). The companion docs branch retains every existing candidate identity.

## Scope

Two editorial groups share one website PR to reduce CI runs: six games and ten tools/engines. Fourteen original candidates earn sixteen entries: Worldcraft splits from GoldSrc as VC-3172, and GLQuake splits from QuakeWorld as VC-3173. Original combined names remain recorded in triage notes.

- VC-1504 — `games/ridge-racer` — https://github.com/code198x/website/issues/1369
- VC-1622 — `games/commander-keen` — https://github.com/code198x/website/issues/1370
- VC-2106 — `games/stunt-car-racer` — https://github.com/code198x/website/issues/1371
- VC-2224 — `games/ultima-underworld` — https://github.com/code198x/website/issues/1372
- VC-2236 — `games/virtua-racing` — https://github.com/code198x/website/issues/1373
- VC-2264 — `games/wolfenstein-3d` — https://github.com/code198x/website/issues/1374
- VC-2420 — `tools/brender` — https://github.com/code198x/website/issues/1375
- VC-2424 — `tools/build-engine` — https://github.com/code198x/website/issues/1376
- VC-2520 — `tools/goldsrc` — https://github.com/code198x/website/issues/1377
- VC-2521 — `tools/grime` — https://github.com/code198x/website/issues/1378
- VC-2533 — `tools/imuse` — https://github.com/code198x/website/issues/1379
- VC-2541 — `tools/insane` — https://github.com/code198x/website/issues/1380
- VC-2632 — `tools/quakeworld` — https://github.com/code198x/website/issues/1381
- VC-2739 — `tools/virtual-theatre` — https://github.com/code198x/website/issues/1382
- VC-3172 — `tools/worldcraft` — https://github.com/code198x/website/issues/1383
- VC-3173 — `tools/glquake` — https://github.com/code198x/website/issues/1384

## Evidence and limits

`triage.json` records referring paths, existing-context fingerprints, scope and open/closed issue checks. Closed website #369 is an earlier techniques/source handoff, not an existing writing commission. `claims.json` maps 64 claim groups to the public sources cited in the articles. `source-fingerprints.json` fingerprints 27 consulted documents and source files; connector text hashes identify the returned text, not a byte-identical Git checkout. Other cited web pages were read through the browser research tool and have bibliographic URLs rather than asserted download hashes.

Original manuals, released source, original technical documentation and participant testimony anchor the drafts. Multiple documents do not always supply independent witnesses: Argonaut's release notes and headers share a provenance, as do id's code and release notes. They support implementation claims directly; they are not presented as independent historical corroboration. ScummVM is explicitly identified as a later reimplementation. Reading released code is not a claim that we compiled or ran the historical games.

Important boundaries:

- Ridge Racer's 1993 arcade release and 1994 Japanese PlayStation conversion remain separate. The operator manual contains cabinet- and region-specific details; no universal lap count or exact console release day is asserted.
- Keen's game predates id's formal company founding. The PCjs instructions describe a preserved 1991 version; that version date is not used as the first release date.
- Stunt Car Racer's Computerlink is qualified to Amiga/ST. It is distinct from turn-taking championship play and later preservation-patch additions.
- Underworld's linked systems are explained without claiming it was the first immersive sim. Neurath's later account remains attributed.
- Virtua Racing's original arcade controls and operator settings are separated from Switch additions.
- GoldSrc's SDK is not the complete engine source. Build game-specific effects and later Polymost are distinguished from the original engine.
- Lua's historical game integration is separated from later language facilities. Credits include the language's Brazilian creators.
- INSANE, SMUSH and SCUMM are cooperating systems. The Lee interview and the 1997 technical excerpt are separate source items even though their preserved excerpts share a URL.
- Cecil explicitly says Broken Sword had no Virtual Theatre. The candidate rationale is corrected, and Beyond a Steel Sky is described as a later revival of ideas using Unreal.

Four original diagrams explain raycasting, iMUSE transitions, QuakeWorld prediction and GLQuake texture/lightmap contributions. Their SVG and PNG hashes are recorded in image manifests. They are labelled schematics, not game captures. We did not reproduce found screenshots or manual artwork. The twelve remaining drafts use text and related-entry links rather than decorative imagery.

`backlinks.json` records 77 added incoming links across 55 existing entries, two relationships already linked, and 18 proposed referrals with no suitable unlinked prose mention. It includes before/after paragraphs. Removing the inserted wrappers restores every changed existing file byte for byte (`backlink-preservation.json`), including frontmatter and review flags. Quoted source text is left intact.

The companion backlog records seven new uncommissioned follow-ups and reuses eight existing candidates. `followups.json` also records names kept as contextual credits rather than automatically commissioning biographies. No issue was created for those follow-ups.

## Verification

- Matching sample checkout: 1,429 units built; 3,156 artefacts staged.
- Full website check passed: 220 tests in 34 files; five baseline-key regression tests; no new type errors. The existing 73-error type baseline remains.
- Production build passed: 3,612 pages built, 3,614 indexed by Pagefind.
- Source, imagery and Vault-link checks passed. A deliberate nonexistent link made the link checker fail; exact restoration made it pass (`link-negative-control.json`).
- Vale returned zero findings across the sixteen authored drafts.
- Backlog: all 3,178 rows validate against this website checkout; all 19 checker tests pass.
- `verify-built.py`: sixteen source hashes, draft/noindex state, sitemap exclusion, incoming links/fragments and existing reviewed positive control pass. All 72 previous unreviewed drafts stay unreviewed.
- `verify-pages.mjs`: all sixteen entries pass on desktop and Pixel 7 (32 checks): HTTP 200, one main region, expected images loaded with alt text, no horizontal overflow, no page errors and zero Axe WCAG A/AA violations within main.
- Four diagram phone captures and representative full pages inspected visually. Portable browser scripts and screenshots are retained here.

The initial full check/build rejected quoted game years (`released: Expected type "number", received "string"`). The six years were corrected to numeric YAML values; the complete check and production build then passed. No schema changes were made.

The separate prose-date checker still fails on two pre-existing records, unchanged by this batch:

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

Human sign-off and publication tasks remain open on the sixteen writing issues. This evidence establishes drafts and checks, not live publication.
