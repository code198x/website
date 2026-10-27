# Successor systems: nine new drafts and one covered candidate

Nine entries explain different approaches to extending an established machine: Commodore 128, SX-64 and CDTV; Atari 5200, 7800, Jaguar and Falcon030; Acorn Electron; and TI-99/4A. All nine remain `ai_generated: true`, `reviewed: false`. The owner clarified that their 27 October approval covers the **earlier nineteen entries in PR1262**, not these nine. This batch awaits its own review.

The Spectrum 128 candidate is **covered**, using the existing Spectrum model history and the hardware-port reference. A second overview would duplicate their model dates, paging, second-screen and AY coverage. Links now take readers to those sections. No candidate row has been removed.

## What each entry establishes

| Entry / candidate / issue | Evidence and boundaries |
|---|---|
| [Commodore 128](../../../src/content/vault/systems/commodore-128.mdx), VC-0011, #1283 | Commodore's 1985 System Guide: three modes, BASIC 7, banking, 40/80-column outputs and FAST/SLOW. The November 1987 service manual p.3 visibly labels an 8502, Z80A and separate 8563 display RAM. Halfhill's COMPUTE! June 1985 p.18 is a pre-production preview whose three-CPU account is contradicted by production documentation and the CCH held-object description. Anderson's Creative Computing August 1985 p.98 corroborates shipping operation. No parallel execution or universal speed-up claim. |
| [SX-64](../../../src/content/vault/systems/commodore-sx-64.mdx), VC-0013, #1284 | Commodore user guide, copyright 1983: integrated display/drive, installation and interfaces. CCH held UK unit distinguishes announcement from 1984 release. Butterfield's COMPUTE! July 1984 ROM column supplies disk-loading defaults and missing cassette connection. An ETI scan was inaccessible and is not claimed as read. Conflicting weight figures and priority claims omitted. |
| [TI-99/4A](../../../src/content/vault/systems/ti-99-4a.mdx), VC-0021, #1285 | TI User's Reference Guide, copyright 1979–1981: BASIC, character patterns, sound and peripherals. TI's Teach Yourself Extended BASIC p.3 positively documents CALL SPRITE in separate sprite chapters. CCH distinguishes 1981 /4A from its predecessor; C. Regena's COMPUTE! December 1983 p.252 independently documents expansion purchases. Video RAM is not presented as ordinary CPU RAM. No unsupported withdrawal chronology or price-war explanation added. |
| [Atari 7800](../../../src/content/vault/systems/atari-7800.mdx), VC-0030, #1286 | Preserved Atari/GCC Software Guide: SALLY, TIA, MARIA, display lists, line buffers and CPU suspension during DMA. COMPUTE! August 1984 p.32 documents the CES showing. Computer Entertainer July 1986 p.12, “They're Here!”, reports retail sightings from early June and a distributor report on 20 June. No assertion of a disputed 1984 retail test or universal cartridge compatibility. Introduced field uses retail year 1986; announcement is explicit in prose. |
| [Atari Jaguar](../../../src/content/vault/systems/atari-jaguar.mdx), VC-0031, #1287 | Original June 1993 Atari announcement preserved by Benj Edwards: rollout plans, attributed as plans. Tom & Jerry Technical Reference revision 8, 28 February 2001, preserves original 1992–93 engineering material: object processor, GPU, blitter, DSP, external 68000, local memory and differing word widths. Its edition date is explicit. No world-first, universal 64-bit arithmetic or measured performance claim. |
| [Falcon030](../../../src/content/vault/systems/atari-falcon030.mdx), VC-0032, #1288 | Atari Owner's Manual C302952-001 Rev B, 1992 copyright/January 1993 printing; Service Guide C303062-001, 1 October 1992. Processor/DSP roles, audio conversion and configurations are documented. Atari Explorer Online 2.4, 14 February 1993, carries prospective North American March stock statements, not delivery receipts. FPU, hard disk, MultiTOS and accelerated demos are not assumed standard. DSP arithmetic width is distinct from audio sample resolution. |
| [Acorn Electron](../../../src/content/vault/systems/acorn-electron.mdx), VC-0051, #1289 | Original Acorn User Guide part465606 issue1, June1983, read from scan with selective OCR; Neil Cryer's Your Computer September1983 review independently describes keyboard, BASIC, display modes and single-tone sound. No Mode7 or blanket BBC binary compatibility; no unmeasured comparative speed claim. |
| [Atari 5200](../../../src/content/vault/systems/atari-5200.mdx), VC-0068, #1290 | Atari Field Service Manual FD100127 revision3, June1983: chip family, analogue inputs, two/four-port revisions and separate accessories. Electronic Games December1982 hands-on account is attributed to its reviewers. No failure-rate claim, native 2600 cartridge compatibility or assumption that all games use analogue values alike. |
| [CDTV](../../../src/content/vault/systems/commodore-cdtv.mdx), VC-0079, #1291 | Commodore service manual PN400403-01, May1991: architecture, memory and interfaces. Doug Barney's AmigaWorld June1991 article starts p.21 and explicitly used a late prototype/beta software during selected-market rollout. The distinction remains visible. Disc capacity is storage, not working RAM; CD32 is a separate hardware generation. No unsupported sales-failure explanation. |

Public original scans/transcriptions and curatorial descriptions are linked in the articles. [Source fingerprints](source-fingerprints.json) identify downloaded copies; no research scans are republished. OCR was checked against source pages for key technical descriptions, including the C128 block diagram and MARIA DMA explanation. The TI Extended BASIC contents were read from its public original-manual transcription. Repeated copies are not counted as independent authors. No emulator or hardware execution was performed or implied.

## Connections and follow-ups

[Backlink decisions](backlinks.json) record all 76 suggestions: 62 gained useful links, across 56 existing articles; 14 had no suitable unlinked body mention and were not forced. Existing frontmatter, facts and review flags are unchanged by the new-entry changes. The Spectrum paging links target the actual built section. [Built-route results](built-results.json) verify every incoming link, every outgoing Vault route/fragment, publication state and a reviewed positive control.

Four existing candidate identities gain references: TMS9918 (VC-0039), Commodore1571/1581 (VC-0046), ANTIC/GTIA (VC-0064) and BBC BASIC (VC-2369). Eight new, uncommissioned candidates are retained as VC-3057–VC-3064: 8502, 8563 VDC, MARIA, Jaguar Tom/Jerry, Motorola56001, VIDEL, SALLY and TI BASIC/Extended BASIC. Exact identities and nearby names were checked; Jaguar chips are not merged with cartoon candidate VC-2925. These are `needs-triage`, not promises to write entries. See [follow-up records](followups.json).

## Imagery and rendered pages

Three original explanatory diagrams accompany C128 modes, MARIA's display path and Jaguar processing roles. Each has SVG source, a rendered PNG, alt text, a caption distinguishing a schematic from measured timing, and a provenance manifest with source and output hashes. No hardware photograph, borrowed artwork or manual-page illustration was republished. Other entries use prose where no suitable rights-cleared image was available.

[Browser results](browser-results.json) cover all nine pages at 390px and 1440px widths: HTTP200, loaded images, no horizontal overflow, no page exceptions and no WCAG A/AA article violations. Screenshots include every phone view and desktop views of the three illustrated articles. Fonts and images were ready before capture. Accessibility results cover the article, not a fresh audit of the shared site shell.

## Verification

- `npm run check`: 220 tests in 34 files pass; type checking has the same 73 accepted baseline errors, with no new error. Content, imagery, links, assembler and browser-player checks pass. The new nine draft files pass Vale with no errors, warnings or suggestions.
- Production build succeeds: 3,132 routes; Game Study publication checks and shared page-frame checks pass. Pagefind indexes 3,134 pages. Its existing warning about `/emulators/template.html` lacking an outer HTML element remains.
- Imagery check accounts for 43 images in 37 manifests, including the three new diagrams.
- Link checker passes after a deliberate nonexistent Vault route makes it fail with exit1; the exact article bytes are restored in `finally` and the normal checker then passes. This confirms the check can reject an introduced fault.
- All nine built draft routes are unreviewed, noindex and absent from the sitemap; existing reviewed VIC-II remains indexable and in the sitemap. Those controls establish publication state, not historical accuracy.
- Backlog: all 3,064 records and existing-page references validate against this checkout; all 19 regression tests pass. Counts at drafting: 28 in-progress, 18 published, eight covered, one ready, 3,009 needing triage. The separate approval/publication of the earlier nineteen will change those counts later.
- Date-source reporting includes citations under each new introduced field. The corpus onset heuristic flags the 7800's 1984 announcement against its 1986 retail year, a distinction expressly documented here. Its Falcon1986 hit comes from a misdated schematic catalogue record; it does not override Atari's dated 1992 service guide. No unrelated corpus record was changed.

The prose/frontmatter date check retains these two unrelated disagreements, verbatim:

```text
games/diablo
  released: 1996 in frontmatter, 1997 in the prose
people/louis-castle
  born: 1965 in frontmatter, 1964 in the prose
```

No dependencies, schemas or validation rules were changed. New drafts await human sign-off and publication; authoring checks are not that approval.
