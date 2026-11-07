# Vault batch 2026-11-07: CP System, Magnavox Odyssey and VRC6

Three AI-generated drafts are ready for human review: Capcom's CP System arcade board, the Magnavox Odyssey and Konami's VRC6 Famicom chip. Each stays `ai_generated: true` and `reviewed: false`, and none is approved for publication. Each draft was written by one agent and then checked by another, which removed or qualified anything its sources didn't support. The claim checker's open questions are listed at the end for the reviewer.

| Candidate | Entry | Writing issue |
|---|---|---|
| VC-0053 | `hardware/cp-system` | https://github.com/code198x/website/issues/1410 |
| VC-0123 | `systems/magnavox-odyssey` | https://github.com/code198x/website/issues/1411 |
| VC-0026 | `hardware/vrc6` | https://github.com/code198x/website/issues/1412 |

## Decisions

All three candidates were triaged as **write**. Open and closed `code198x/website` issues were searched by candidate ID, subject and aliases before each writing issue was opened, and none matched. `triage.json` has the full notes.

- **CP System (VC-0053).** About a dozen reviewed entries mention the board but can only link to the survey in `hardware/arcade-hardware`. Its sections ("Capcom's CP System", "The suicide battery") and the CP System section of `companies/capcom` are too short for the board's architecture, layers, protection, games, home unit and emulation history. The entry is filed in `hardware/`, as Model 2 is: a non-consumer arcade board. `introduced: 1988`. `discontinued` is left unset because 1995 marks the last new game, not the end of production.
- **Magnavox Odyssey (VC-0123).** It is the first home console, and every referring entry calls it that, yet the product details are spread across `people/ralph-baer` and `games/pong`. The entry uses the existing platform ID `magnavox-odyssey`. `introduced: 1972`, `discontinued: 1975`. Baer's entry keeps the prototype and patent story.
- **VRC6 (VC-0026).** This combined row ("Konami VRC6 and Famicom expansion audio") is written as its main subject, the VRC6. The survey of expansion chips stays in the reviewed `hardware/apu` table. The less-known chips, the VRC7 and the Namco 163 are split into new candidates VC-3204, VC-3201 and VC-3202. VC-0026 keeps its original subject, and its notes point to the new IDs. `introduced: 1989` (22 December 1989, from two sources). `discontinued` is unset because Esper Dream 2 has no checkable release year.

Scope axes: VC-0053 is `region:japan;period:1980s;period:1990s`. VC-0026 gains `period:1990s`. VC-0123 keeps `region:us;period:1970s`.

## Sources and their limits

`claims.json` records 82 checked claims across the three entries. Each lists its evidence, whether it is single-sourced, and the checker's qualification.

**CP System.** Period coverage comes from:
- *The Games Machine* 19 (June 1989), the launch coverage;
- *ACE* 26 and *Computer and Video Games* 96 (November 1989);
- *Edge* 7 (1994) and 133 (2004).

The world-computing sources are *K* (Italy, December 1989), *The Games Machine* Italy 105 (1998) and *SuperGamePower* (Brazil, 1995 and 1999). *K* is a licensed edition of *ACE*, so the two count as one source. The technical claims rest on MAME's `cps1` driver and on Fabien Sanglard's *The Book of CP-System*, a modern self-published study that is publicly available. It is cited as a modern secondary source, not a period document.

Several quotes reach us only through Sanglard, and each is attributed and marked single-sourced:
- Okamoto and the Tsujimoto line, from *Gamest* #38;
- Akiman's 2018 account of the X68000 SDK;
- the 200,000 Mexican bootlegs, from Matt Leone's 2014 Polygon oral history.

The recorded source "Retro Gamer: The Ultimate Retro Companion" is in fact gamesTM's *Retro: The Ultimate Retro Companion* volume 2. It is undated and is not a Retro Gamer publication. The entry, the claims and this record now name it correctly.

**Magnavox Odyssey.** The core is Ralph Baer's own documented account, *Videogames: In the Beginning* (2005), and his February 1983 interview in *Video Games*. Corroboration comes from:
- Frank Lovece in *Video Games* (January 1984);
- *Electronic Games* (March 1982);
- Marty Goldberg's Retro Gamer Retroinspection;
- David Winter's PONG-Story;
- the Computer History Museum catalogue.

Winter follows Baer closely on marketing, and Baer cites Winter for the European details. Where they alone agree, the entry attributes the claim instead of treating it as corroborated. The Mexican Odisea and the Brazilian Planil version rest on Winter alone, and both are attributed to him.

**VRC6.** No period magazine coverage of the chip was found, and Konami's own VRC6 document is not publicly available. The technical claims rest on:
- Kevin Horton's VRCVI Chip Info (1999), measured on a real chip;
- Firebug's mapper document v0.80, which corroborates the banking independently;
- the NESdev wiki pages.

Several NESdev-only details are attributed in the prose: the $9003 control register, the pulse polarity, the linear DAC, the part numbers and die marking, and the rate limit of 42. The other sources are:
- Hidenori Maezawa's 2009 1UP.com interview, a participant account;
- Retro Gamer 119 (2013) for the release date;
- GAME Watch (2023) and Famitsu.com (2015), in Japanese.

The two Japanese sources disagree on the first VRC6 game, and the entry records the disagreement.

## Connections

`backlinks.json` records 29 incoming links, all added, with the paragraph before and after each change. No proposed link was rejected.

- **CP System (12):** arcade-hardware, capcom, street-fighter-ii, strider, final-fight, ghouls-n-ghosts, ghosts-n-goblins, captain-commando, tokuro-fujiwara, y-depth-sorting, fm-synthesis and mister-fpga.
- **Odyssey (10):** ralph-baer, pong, light-gun, light-pen, paddle-controller, horror-games, sports-games, nolan-bushnell, al-alcorn and analog-control.
- **VRC6 (7):** apu, mmc5, cartridge, famitracker, nintendo-entertainment-system, castlevania and shovel-knight.

Where the proposed text included words beyond the name (such as "On Capcom's CP System" or "the Odyssey in 1972"), the link wraps only the name, and the record notes it. Each change only wraps existing words in a link. With the links stripped, every changed file is identical to the base, frontmatter and review flags included.

`followups.json` records 41 follow-ups:
- 16 new `needs-triage` candidates, VC-3189 to VC-3204, each with `link_from` set to the new entry;
- 23 existing candidates that gained the new entry in `link_from`;
- 2 subjects not queued. The CPS Changer stays a section of the CP System entry. Esper Dream 2 waits for a checkable release year.

No issues were opened for follow-ups.

## Claim checker's concerns for the reviewer

### CP System

- **Order of the first games.** Sanglard's table lists Ghouls 'n Ghosts second, but his own prose pairs "Forgotten Worlds and Strider" as the first. *The Games Machine* names Strider second. The reviewed entries disagree among themselves: `strider` and `arcade-hardware` put Strider straight after Forgotten Worlds, while `ghouls-n-ghosts` says Ghouls was second. Retro Gamer 29 (2006), which the ghouls-n-ghosts entry cites, is the real support for "Ghouls second". Consider citing it here.
- **Swapping games on one base board.** Retro Gamer 42 (2007) says the CPS-1 base board and game board were "sold in its entirety for each arcade title", and that only CPS-2 sold them separately. That contradicts *Wireframe*'s "static unit" and the operator-swap story. The lede now states the swap as the design intention. A reviewer may prefer to state the disagreement outright and cite Retro Gamer 42.
- **The Tsujimoto quote.** Sanglard credits it to Tsujimoto as CEO, but footnotes it to the *Gamest* #38 Okamoto interview. The prose says so. The *Gamest* text, or the online translation Sanglard links, should be checked before the quote stays.
- **CPS Changer.** *SuperGamePower* bundles the unit with "SSF Turbo", a CPS-2 game, and calls it the "CPS II Changer", so that naming may not be an error. A Japanese period source is still needed for the Changer's date and game list.
- **CAT-1 or CAT-A.** Sanglard's text says CAT-1, but his bibliography titles Akiman's post "a.k.a CAT-A". Check Akiman's post.
- **Cadillacs and Dinosaurs' year.** Sanglard says 1992; MAME (World 930201) and the reviewed cadillacs-and-dinosaurs entry say 1993. The entry no longer says the Dash began with it. Fast facts date the Dash to 1992, which Warriors of Fate (MAME 921031) supports.
- **Page numbers.** The magazine page numbers (TGM 19 pp.24 and 30, ACE 26 p.22, K 12 pp.27-28, Wireframe pp.80-85) could not be confirmed from the copies read. The quotations themselves were all found verbatim.

### Magnavox Odyssey

- **Sound.** Lovece (*Video Games*, January 1984, p.42) says Pong "sounded like the Odyssey game". That cuts against the entry's flat "no sound", which rests on Bushnell's hedged court testimony and Baer's account of Alcorn adding sound. Decide whether "no sound" needs hedging.
- **Baer contradicts himself.** The 1972 run is 140,100 in one place, while another passage gives about 160,000 after 27,000 more in 1973. For 1974 he gives both 150,000 sold and a run that "topped 170,000". The game packs are "six additional game packs" on one page and "ten additional plug-in carts in two different game packs" on the next. The entry uses the headline figures.
- **New York show date.** Winter puts the New York (Bowling Greene) presentation in April 1972; Baer says 22 May. The entry gives Baer's date and notes Winter's April.
- **Corrections to the triage record.** The 140,100 figure that `genres/horror-games` cites is in Baer's book ("the 1972 run of 140,100 units"), so that citation stands. Baer does name San Diego for a July 1971 test.
- **Single-sourced details.** The 1978 date and the "Videopac G7000" name rest on Retro Gamer alone.
- **The entry's own framing.** Calling the cards "a set of jumpers" is a fair reading of Baer's interview and Retro Gamer's "jumper cards", but it is the entry's wording, not a source's.

### VRC6

- **Retro Gamer citation.** The Ueno quote and the 22 December 1989 date were read in a reprint of the same Szczepaniak article in an Imagine bookazine. Confirm the issue 119, pp.30-31 citation.
- **The Ueno paragraph.** It was corrected to the quote's real context, his team's move to the Super Famicom. Its link to the VRC6 is thin; consider dropping it.
- **MADARA's release date.** It is unsourced, so the disagreement with Famitsu stands without a date. A checkable release date (a period magazine or Konami's own listing) would settle it.
- **Firebug's date.** The document says "(C) 1997, 1998"; January 1999 is only the date of the file inside mappers.zip. The prose names version 0.80.
- **Horton against NESdev.** Horton numbers the pulse registers one off from NESdev and doesn't describe $9003. His reset model doesn't by itself explain his divide-by-14. The entry follows NESdev on these points and attributes them.
- **Glosses that go slightly beyond the evidence.** Accept or cut each:
  - the 75%-duty phase analogy taken from the APU entry;
  - the timbre words "thin", "nasal" and "hollow";
  - the generic sentence about IRQs for status bars and split scrolls;
  - "a general-purpose chip customised by its final wiring layer".
- **Sources outside the record.** The entry cites NESdev "VRC IRQ" and Nintendo Power (through the MMC5 entry), which are not in the recorded sources.

## Verification

`scripts/vault_batch_gates.py` (docs repository) ran all **11** gates against VC-0053, VC-0123 and VC-0026, with **11 passes and 0 failures**: "PASS: 3 drafts and 3 triage decisions ready for review".

| Gate | Result |
|---|---|
| Nothing names a private path | **0** hits in the lines the batch adds: 37 website files (2,007 lines) and 1 docs file (42 lines). Binary screenshots are not text and are not scanned. |
| Triage covers the batch | **3** records for **3** IDs, each with notes; all three are `write`. |
| Drafts are new, AI-marked and unreviewed | **3 of 3** have `ai_generated: true` and `reviewed: false`, and none exists on `origin/main`. |
| Every claim has its sources | **82** claims (cp-system 28, magnavox-odyssey 33, vrc6 21), **182** evidence items. **20** are marked single-sourced (8, 6 and 6); none has one source without that mark. |
| Every draft has an incoming link | **3 of 3**; `backlinks.json` records **29** incoming links (12, 10 and 7). |
| Existing entries only gained links | **29** modified entries, each identical to `origin/main` once Vault links are stripped. No file outside `src/content/vault/` and this directory changed. |
| Queue agrees with triage | **3 of 3** rows are `in-progress` and name the same writing issue (#1410, #1411, #1412). The queue holds **3,202** rows, including **16** new `needs-triage` rows VC-3189 to VC-3204. |
| Queue tests | **86** tests pass. |
| A planted broken link fails | The link check exits non-zero with the control link planted in `hardware/cp-system` and exits 0 once it is removed: **27,429** Vault link references across **1,624** entries and **187** redirects resolve. |
| Website release check | `npm run check:release` exits 0. The build holds **4,901** `index.html` files and **3,597** sitemap URLs. |
| Built drafts are noindex and out of the sitemap | **3 of 3** built pages carry `noindex`; **0** of them is in the sitemap. |

Screenshots: **64** full-page captures in `screenshots/` cover **32** entries (3 drafts, 29 linked entries). Each was captured at desktop 1440×1000 and on a Pixel 7, from the built site served by `astro preview`. Every page answered **200** with the expected heading. In all **64** views a DOM check found **0** broken images, **0** horizontally overflowing elements, **0** page errors and **0** fragments of raw Markdown or MDX. All **29** new incoming links render inline and are visible. Each capture was inspected by eye. On a phone, two table cells break a word mid-way: "Akumajō Densetsu" in `hardware/apu` and "background" in `games/shovel-knight`. Neither cell's text changed in this batch.

The automated results are not human approval. The three entries stay `reviewed: false` until a person approves them.

## Approval

Steve Hill approved all 3 entries in conversation on 7 November 2026: `hardware/cp-system`, `systems/magnavox-odyssey`, `hardware/vrc6`. They are now `reviewed: true`; the approval is recorded in [approval.json](approval.json). Publication is verified after the merge.
