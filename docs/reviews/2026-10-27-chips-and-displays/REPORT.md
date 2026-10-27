# Seventeen hardware drafts after twenty-one candidate reviews

This batch explains processors, display controllers, sound hardware and I/O through the work each device performs and the limits a program encounters. Seventeen candidates need articles; four already have useful coverage. All seventeen new articles remain `ai_generated: true`, `reviewed: false`. This batch has not received human approval.

## Triage and retained coverage

The [triage record](triage.json) records scopes, source leads, proposed paths, issue identities and the existing coverage inspected. Candidate IDs, names, aliases, family sections, redirects and all 78 suggested referring contexts were inspected before commissioning. Open and closed issue searches used candidate IDs, names and bounded aliases. Related closed issues #789, #1283 and #1286 concern Sophie Wilson and parent systems, rather than duplicate chip-writing tasks. Canonical writing issues are #1293–#1309.

Four candidates remain in the CSV as **covered**, rather than being deleted or turned into repetitive overviews:

| Candidate | Existing coverage and decision |
|---|---|
| VC-0008 Yamaha YM2149 | AY-3-8910’s “One design, several packages” distinguishes Yamaha’s envelope and clock selection; AY-3-8912 and Atari ST provide machine context. |
| VC-0029 TIA | Atari 2600, raster-effects and audio-programming already explain the beam, object registers, playfield and sound. Useful incoming links now target the actual TIA section. |
| VC-0058 AGA | Amiga chipset’s “Three generations”, Denise and CD32 cover the family. Nexus 7 already links the useful chipset article. |
| VC-3057 8502 | The candidate’s commissioned question is C128 CPU modes and clock/display interaction, served by Commodore 128 plus 6502/6510 background. A pin-level study would be a different future scope. |

## Claim audit

The article frontmatter and visible Sources identify original publications and their uses. [Source fingerprints](source-fingerprints.json) identify consulted documents without publishing collection paths, corpus extracts or scans. The table below records the substantive claim groups checked and the boundaries applied. Practical consequences are explanations derived from the documented mechanism, not new measured benchmarks.

| Draft / candidate / issue | Verdict and evidence |
|---|---|
| Intel 8080 / VC-0009 / #1293 | Register pairs, M notation, external stack and separate I/O confirmed against Intel’s November 1978 programming manual. Zilog’s later CPU manual checks the corresponding Z80 operations and flags. Shared instructions do not establish whole-machine compatibility. No introduction date inferred from manual publication. |
| MOS 6560/6561 VIC / VC-0020 / #1294 | February 1980 MOS scan pp. 1–2 visibly confirms NTSC/PAL parts, character/colour pointers, the 22×23 example, tone/noise functions and control facilities. Commodore’s programmer guide supplies VIC-20 context. Chip layout capabilities are distinguished from the normal screen. No VIC-II sprite or interrupt features imported. |
| Motorola 6800 / VC-0024 / #1295 | Original Motorola data sheet and November 1976 programming reference confirm A/B, X, 16-bit addressing, stack and addressing modes. Contemporary SWTPC material supplies system context. Similar 6502/6809 heritage does not imply binary compatibility. |
| MC6883 SAM / VC-0025 / #1296 | Original Motorola block diagram and feature list visually checked: CPU/VDG/refresh multiplexing, clock and video-offset controls. Its 1984 copyright is not a launch date. Inside the Dragon pp. 171–172 explicitly separates VDGMOD and SAMMOD and lists mode exceptions. SAM’s 96KB memory-system range is not a flat 6809 address space. |
| SPC700 and S-DSP / VC-0037 / #1297 | Nintendo Book I sections 2-22 and 3 confirm separate CPU/DSP roles, four byte ports, audio memory, BRR block format, voices and echo. Section 3-9 warns of echo overwriting shared RAM. Modern SNESdev research corroborates component naming. Compressed 4-bit codes are not final output resolution; echo is not another sample voice. |
| TMS9918 / VC-0039 / #1298 | TI’s November 1982 manual confirms tables, indirect video-memory access, modes and four active sprites per line. The A-series qualification prevents assigning Graphics II to the original part. This entry’s detailed specifications rest on one manufacturer manual; no unread design paper is presented as corroboration. |
| Master System VDP / VC-0040 / #1299 | Sega manual pp. 6–10 visually checked: VRAM, two-byte map attributes, palette banks, scroll inhibition and eight sprites per line. Charles MacDonald’s independent hardware investigation distinguishes revisions. The 512-pattern index range is not 512 patterns plus free table storage; background flips are not sprite flips. |
| SN76489 / VC-0041 / #1300 | TI original scan pp. 1–3 visually confirms counters, attenuation, noise and latched interface. TI labels F0 as most significant, so modern bit-number assumptions were not copied onto its table. SMS Power investigation corroborates protocol and variant differences. Machine addresses and input clocks remain system-specific. |
| Mega Drive VDP / VC-0043 / #1301 | Sega’s actual February 1992 revision supplies tables, window and DMA; a catalogue filename is not its date. MacDonald’s original investigation independently distinguishes the window’s replacement of A and external-memory DMA’s CPU stop from VRAM fill/copy. No universal 315-5313 board claim or invented throughput benchmark. |
| MOS 6522 VIA / VC-0047 / #1302 | MOS November 1977 original extract and public transcription confirm per-bit directions, distinct timers, shift register and interrupt flags. Advanced User Guide chapter 22 confirms different BBC system/user VIA wiring. Later CMOS and other machines’ addresses are not assumed identical. |
| ANTIC and GTIA / VC-0064 / #1303 | De Re Atari chapters 2–6 and Appendix E establish fetching, interpretation, DMA, DLI and modes 9/10/11. The forty-byte/eighty-pixel example is bounded to normal-width ANTIC mode F. The preface credits Kathleen Pitta with Appendix E; no chip-design role is invented for her. Neubauer’s participant account supplies historical context, not register specifications. |
| ARM / VC-0067 / #1304 | VLSI’s column-aware original-manual extract confirms load/store, visible registers, barrel shifter and early 26-bit addressing. Arm’s history and CHM’s Wilson profile establish Wilson/Furber and Acorn context. Later handheld cores are identified as later generations, not an unchanged ARM2. |
| MC6845 CRTC / VC-0130 / #1305 | Motorola data sheet confirms timing/address outputs, cursor and light-pen capture. Advanced User Guide chapter 18 shows the BBC’s surrounding video circuitry. Finished RGB pixels, universal RAM formulas and identical compatible-part quirks are not attributed to the CRTC. |
| POKEY / VC-0152 / #1306 | De Re Atari chapter 7 confirms dividers, control, volume-only operation and paired 16-bit counters. ANALOG 47 pp. 89–90 supplies Neubauer’s account of keyboard/paddle/audio scope and serial addition. Paired counters spend independent channels; serial history does not establish every peripheral’s performance. |
| 8563 VDC / VC-3058 / #1307 | Commodore PRG title pages positively establish **February 1986**, correcting the initial 1985 assumption. Chapter 10 pp. 304–313 confirms private RAM, D600/D601, ready bit and block operations. The 1985 System Guide complements mode/output context; these two manufacturer sources are not independent authorship. Installed 16KB is not a universal family limit. |
| MARIA / VC-3059 / #1308 | Preserved Atari/GCC guide confirms alternating line buffers, CPU suspension, display lists, DLLs, offsets and zones. Detailed behaviour rests on that principal technical source; a period announcement does not independently verify timing. A flexible list is not unlimited sprites or DMA time. |
| DSP56001 / VC-3061 / #1309 | Motorola core ALU descriptions confirm 24-bit operands, 48-bit product, 56-bit accumulators and X/Y spaces. Later family additions are excluded. Atari’s owner and service documentation distinguish Falcon DSP integration from 16-bit stereo conversion. Internal word size is not converter resolution or a complete application benchmark. |

## Connections and imagery

The [backlink audit](backlinks.json) records all 78 suggestions: **60 links added across 47 existing articles**, seven useful links retained, three self-links avoided and eight suggestions left unchanged after finding no eligible specific mention. No quoted wording, code or existing frontmatter was rewritten; original frontmatter bytes match the starting revision. Links to covered topics use real built section IDs.

The [named-subject audit](followups.json) adds nine uncommissioned candidates, VC-3078–VC-3086: Kathleen Pitta, VLSI Technology, BRR, display lists, Inside the Dragon, the BBC Advanced User Guide, Charles MacDonald, the SNES Development Manual and the VIC-20 Programmer’s Reference Guide. Existing identities such as Steve Furber, Doug Neubauer and SALLY were reused. These are possibilities for triage, not promises of more articles.

Five original diagrams explain SNES audio memory, ANTIC/GTIA interpretation, the CRTC’s role, the VDC interface and the Mega Drive window. SVG sources and rendered PNGs live beside the articles’ image assets; five capture manifests carry purpose, source and both hashes. No third-party hardware photograph, datasheet page or decoration was republished. Captions bound schematic flow and mode assumptions. Other entries use prose where imagery would repeat the text without explaining another mechanism.

## Verification

- Production build completes: **3,541 routes**, with Game Study publication checks, page-frame checks and redirect marking passing. Pagefind indexes 3,543 pages. Its existing `/emulators/template.html` outer-HTML warning remains.
- All 220 unit tests in 34 files pass. All five type-baseline helper tests pass. **`npm run check` exits 1** at the type-baseline comparison: the unchanged shared UI `Chip.astro` ts(2322) diagnostic prints `name?:` where the stored elided type description prints `form?:`. [Exact diagnostic and baseline comparison](type-baseline-mismatch.txt). An untouched starting checkout, using the same installed dependencies and pinned UI after bundle staging, reports 73 errors, all in baseline. No UI source, baseline, tests or validation rules were changed to conceal this failure.
- The remaining content, imagery, link, NES assembler and browser-player checks pass independently. Imagery accounts for 48 images across 42 manifests. All seventeen drafts pass Vale with zero errors, warnings or suggestions.
- The link checker rejects an intentionally nonexistent target with exit 1; [negative-control output](link-negative-control.txt) is retained. Exact source bytes are restored in `finally`, and the normal check passes. The final built pages contain no negative-control marker.
- [Built results](built-results.json): all seventeen pages exist, declare unreviewed state, carry noindex and are absent from the sitemap. The reviewed VIC-II control is indexable and included. New links’ built fragments resolve.
- [Browser results](browser-results.json): all seventeen pages on genuine Pixel 7 and desktop profiles return HTTP 200, load article images, have no horizontal overflow, page exceptions or WCAG A/AA article violations. Screenshots cover all phone pages and five illustrated desktop pages. Accessibility scope is the article, not a new audit of the shared shell.
- All **3,086 backlog records** and existing-page references validate against this checkout; all 19 regression tests pass. Counts: 17 in-progress, 46 published, 12 covered, one ready and 3,010 needing triage. No prior record was removed.
- The source inventory and date-onset report run against the existing reference index. None of these new entries adds an unsupported introduction date. The date-onset report is a discovery heuristic, not proof of release or birth dates.

The prose/frontmatter date check still reports two unrelated disagreements, verbatim:

```text
games/diablo
  released: 1996 in frontmatter, 1997 in the prose
people/louis-castle
  born: 1965 in frontmatter, 1964 in the prose
```

Human review and subsequent publication remain pending. The successful build and authoring checks do not replace that approval, and the full-check baseline mismatch remains disclosed.
