# Oric — review evidence

One AI-generated draft is ready for human review: `systems/oric`, the Oric family entry (VC-0010, https://github.com/code198x/website/issues/1417). It keeps `ai_generated: true` and `reviewed: false`. No approval is recorded in this directory.

## What the batch covers

The entry treats the Oric family as one systems entry, centred on the Oric-1 (1983) and the Oric Atmos (1984):

- Tangerine Computer Systems' design and British Car Auctions' backing;
- the late-1982 announcement, the January 1983 launch, and the slow deliveries and EPROM machines;
- the hardware: 6502A, AY-3-8912, 6522 VIA, serial attributes, 240 × 200 HIRES, 57 moving keys, Centronics and RGB, 2,400/300 baud tape, and the promised Prestel modem;
- the price war with the Spectrum, the Edenspring rescue and the 1983 sales figures;
- the Atmos and the Microdisc;
- the French market, the export markets (New Zealand, Greece, Yugoslavia), the Stratos/IQ164, receivership in February 1985, Eureka Informatique's purchase and the Telestrat.

It leaves out the Microtan 65 (VC-3015), a full Telestrat account, the Pravetz 8D (no source yet), deep video timing and game-by-game coverage.

## Decisions

- **Path and platform.** `systems/oric`, so the family entry is not tied to one model. Platform id `oric-atmos`, the existing identifier.
- **Dates.** `introduced: 1983`. `discontinued` is left unstated: Eureka assembled Atmoses in 1985 and the Telestrat followed in 1986, but no source dates the end of production.
- **Disagreements recorded, not resolved silently.**
  - Sound chip: the service manual's parts list and the schematic say AY-3-8912; *Retro Gamer* 29 says AY-3-8910. The entry follows the parts list and says so in its Sources.
  - Advance orders: *Your Computer* (January 1983) reported 250,000; *Retro Gamer* gives over 30,000. Both appear as reported figures.
  - Edenspring's rescue: *Personal Computer News* 97 gives 25 million new shares raising £750,000, with debts of £1.01 million; *Retro Gamer* gives £4 million. Both appear.
  - Debts at receivership: *Sinclair User* 37 estimates £5.5 million, "especially" to Edenspring; *Retro Gamer* says more than £5 million.
- **Scope axes** corrected to `region:uk;region:france;period:1980s`.

## Sources and their limits

Period sources anchor the entry: *Computer & Video Games* 13; *Your Computer* (January and February 1983, March 1984, January and July 1985); *Sinclair User* 13 and 37; *Personal Computer Games* 1 and 3; *Personal Computer News* 14, 90, 97, 99 and 2 June 1984; *Big K* 1; Bob Maunder's *The Oric-1 Companion* (1983); Lupton and Robinson's *The Oric Atmos Handbook* (1984). Regional sources are first-class here: *Bits & Bytes* (New Zealand), *Pixel* (Greece) and *Svet kompjutera* (Yugoslavia).

Limits:

- The service manual and the circuit diagram come from the same company, so the AY-3-8912 part number is single-sourced in the strict sense. Two period reviews confirm a three-channel chip without naming it.
- *Retro Gamer* 29 (2006) is a secondary retrospective. Its single-source details are attributed in the prose: Tangerine's October 1979 founding, the Feltham fire, about 50,000 French sales in 1983, *Théoric*, and the Telestrat's Minitel design, September 1986 sale date, £400 price and 6,000 sales.
- *Your Computer*'s February 1988 retrospective wrongly gives the Oric-1 a "dead flesh" keyboard and 16K, so the entry uses it only for the corporate chronology and says so.
- There is no French period source yet. The French chapter rests on British reports from Paris, *Your Computer*'s Eureka report, *Svet kompjutera* and *Retro Gamer*.

## Connections

- **Backlinks** (`backlinks.json`): 13 added, one per proposed entry. Each wraps existing words only: *Oric*, *Oric-1*, *Oric 1*, *Oric 48K* or *Oric-1 and Atmos*. Where the proposed anchor was a longer phrase (*Personal Computer Games*, *Usborne*, *Football Manager*), only the machine name is linked. Three were not made:
  - `hardware/ay-3-8912` never mentions the Oric, so there are no words to wrap. Adding an Oric line is a review edit and is left as a followup.
  - `companies/silmarils` and `people/ian-andrew` mention the Oric but were not proposed. They are left unchanged.
- **Outgoing links** from the entry: the Spectrum, 6502, AY-3-8912, 6522 VIA, Microsoft BASIC, Éric Chahi, Silmarils, *The Hobbit*, *Pixel*, Ocean, Durell, Level 9, Melbourne House and the Dragon 32.
- **Queue** (`followups.json`): seven new needs-triage candidates, VC-3189 to VC-3195 (Tangerine Computer Systems, Tansoft, Oric Telestrat, Pravetz 8D, *Théoric*, IJK Software, *Bits & Bytes*). Eureka Informatique is folded into the Telestrat row. Five existing candidates gain `candidate:VC-0010` as a planned referrer: Loriciels (VC-1127), *L'Aigle d'Or* (VC-1841), Microtan 65 (VC-3015), *Personal Computer News* (VC-1318) and *Svet kompjutera* (VC-1412). No issues were created for followups.

## For the reviewer: the claim checker's concerns

1. **Sign-off flow.** Steve signs batches off in the batch's own pull request. The gates accept that when the approval is recorded as `approval.json` in this directory (who, when, how, and which entries); the approved entry then needs `reviewed: true`. Without it the entry must stay `reviewed: false`. The workflow's own run uses `--drafts-only` and fails if any approval exists, so only a person can add it.
2. **16K release month.** *Personal Computer News* 14 (June 1983) says the 16K "should at last reach outlets by early July"; *Retro Gamer* 29 p. 45 says it "didn't appear until May". The entry follows PCN and says "expected". £129.95 was a summer-sale bundle with software.
3. **48K launch price and the Spectrum comparison.** *Your Computer* (January 1983) gave a planned £175, while PCG, PCN and *Retro Gamer* give £169.95/£170. PCG calls it "slightly dearer than the 48k Spectrum"; *Retro Gamer* says "a fiver less". The entry attributes PCG's view but does not mention the conflict.
4. **Page numbers.** Several recorded pages were PDF pages rather than printed folios: PCG 1 (printed pp. 33–35), PCN 14 (printed p. 6), PCN 97 and 99 (printed p. 2). The entry uses printed pages. The printed folios of *Sinclair User* 13 p. 16 and PCN 99 were not checked against the page image.
5. **W H Smith advertisement** (*Your Computer*, February 1984, p. 8, £139.95). The price was checked on the scan. The entry's Sources item gives no page number; consider adding "p. 8".
6. **Microdisc size.** PCN's 2 June 1984 review reads "3.25 inch" Hitachi drives in its OCR, twice. The entry says 3-inch, which *Pixel* 4 supports. Check the PCN scan.
7. **Svet kompjutera, June 1986, p. 51.** The OCR is very poor. "Uskoro novi Oric telestrat" and ZOTKS Ljubljana are legible; confirm from the scan that the page is an Oric column.
8. **Archive.org URLs** in the entry were not opened, so their identifiers are untested (for example `Personal_Computer_News_1984_06_02.pdf` and `personal-computer-news-014`). Check each resolves before publishing.
9. **Chahi and *The Hobbit* sources.** The entry cites *Retro Gamer Collection* vol. 7 ("In the chair with... Eric Chahi") and PCG 3. These agree with the reviewed `people/eric-chahi` and `games/the-hobbit` entries.
10. **Ocean, Durell and IJK as Oric publishers** rest on *Retro Gamer* 29 alone ("pledged their support early on"). The reviewed Ocean and Durell entries do not mention Oric releases. Consider attributing that sentence or trimming it to the publishers with period evidence (Tansoft, Level 9, Melbourne House).
11. **General knowledge and inference.** "Prestel, British Telecom's viewdata service" is general knowledge. "The Which Computer? Show in January 1984" combines PCN (the show, and the Stratos debut near "the first anniversary of the Atmos") with *Retro Gamer* (the Oric-1 discontinued in January 1984). No single source puts the month next to the show name.

## Verification

- Batch gates (`vault_batch_gates.py --ids VC-0010`, first attempt): 13 of 13 checks passed, exit code 0. Result: 1 draft ready for review, 1 triage decision.
- The checks covered: no private paths; triage covers the batch; approval recording; entries new, AI-marked and reviewed only if approved; sources for every claim; an incoming link for every draft; existing entries changed only by added links; queue agrees with triage; the queue cites unpublished drafts by candidate ID; queue tests; a planted broken link fails; the website release check; built drafts hidden and approved entries indexed.
- Browser captures from the production build served by `astro preview`: 14 pages (the new `systems/oric` and the 13 entries that gained a link) at desktop 1440 × 1000 and Pixel 7, 28 full-page captures in `screenshots/`.
  - 28 of 28 returned HTTP 200, with 0 page errors, 0 broken images and 0 pages wider than the viewport.
  - `systems/oric` carries `noindex` at both sizes. Each of the 13 linked entries has exactly 1 link to `/vault/systems/oric` inside `main`.
  - Every capture was inspected: the Oric entry in full at both sizes, and the linked paragraph on each of the 13 entries. None renders wrongly.
- No approval is recorded, so `systems/oric` stays `reviewed: false`.
