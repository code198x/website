# Vault batch 110: evidence and verification

The owner signed off the 43 entry reviews by merging [website PR #676](https://github.com/code198x/website/pull/676) on 12 October 2026. All 43 entries are now marked `reviewed: true`. [Documentation PR #54](https://github.com/code198x/docs/pull/54) was merged the same day.

The claim tables record 464 decisions: **237 VERIFIED, 100 CORRECTED, 54 QUALIFIED and 73 REMOVED**. These are review decisions, not 464 independently corroborated facts. Each report distinguishes participant recollection, period evidence, secondary fallback and unresolved uncertainty.

## Principal changes

- Explain executable code, source text and data separately in the Howarth, Baldwin, arbitrary-code-execution and demo-tool accounts.
- Correct game rules and distinguish original releases, ports, sequels, remakes and later updates.
- Replace unsupported priority claims, rankings and causal stories with attributed evidence or remove them.
- Restore collaborators and distinguish personal work from studio credits.
- Follow continuing subjects into later work where sources support it.
- Explain cross-border software history through documented examples, without claiming a complete map of trade.

## Verification

### Owner sign-off follow-up

After approval, `npm run check` passed (227 tests in 31 files, content and link checks, assembler and player checks) and `npm run build` produced 2,448 pages with all 35 shared rendering families verified.

The [sign-off results](verification/signoff-results.json) verify all 43 built pages: checked status, no unreviewed notice, no robots exclusion, sitemap inclusion and a matching result from the generated Pagefind index when searching by title. A nonexistent exact phrase returned zero results. The first notice assertion rejected Astro's scoped attribute on `<strong>`; accepting that attribute fixed the check. Chromium needed to run outside the filesystem sandbox after macOS denied its bootstrap service.

The entry diffs contain only the 43 approved review-flag changes. All 1,486 Vault entries now have `reviewed: true`. The original source reviews, prose-date findings and pre-approval render captures below remain unchanged.

### Before owner sign-off

These pre-approval checks ran against the content at `6bc09c05`, after merging current main (`33f73438`).

| Check | Result |
|---|---|
| `npm run check` | PASS: 227 tests in 31 files; content checks; 25,970 internal references resolve; NES assembler comparison and source-error check; browser-player asset check |
| `npm run build` | PASS: 2,448 pages built; shared page frame verified across all 35 rendering families; Pagefind completed |
| `npm run check:sources` | No uncited dated frontmatter fields reported; all batch start/end dates checked individually |
| `npm run check:prose-dates` | FAIL: two existing disagreements outside this batch, quoted below; zero batch entries flagged |
| `check-vault-dates.mjs` | Completed; all five batch flags assessed below; heuristic, not a truth test |
| Batch audit | 43 unique entries, 43 non-empty reports, verdict totals match their tables, all review flags false |
| Built pages | PASS: 86 route/viewport checks, desktop 1440 × 1000 and mobile 390 × 844; successful responses, one heading, source material, review notice, no horizontal overflow, broken images or page-script errors |
| Visual inspection | All entry openings inspected in desktop/mobile screenshot sheets; representative complete pages checked for body, citations and footer |
| `git diff --check` | PASS |

The browser assertions reject a deliberately invalid response. Their initial citation assertion was too narrow: entries with rendered footnotes are valid even without a visible Sources heading. The corrected assertion accepts either source form. Build success is not treated as historical verification. Platform-balance notices and the existing large-bundle build warning are advisory; no layout or runtime code was changed here.

The prose-date check reports, verbatim:

```text
games/diablo
  released: 1996 in frontmatter, 1997 in the prose
people/louis-castle
  born: 1965 in frontmatter, 1964 in the prose
```

Both occur on main before this batch. They remain outside its scope.

### Date-scan decisions

- **Amiga User International:** a later title's coverage does not contradict the contemporary November 1986 editorial documenting its separately sold predecessor.
- **Arcade to Console:** the entry's 1975 example is Home Pong; later use of a generic phrase does not date the practice.
- **Dead Cells:** the apparent 1979 match concerns dead cells in cellular automata. It is not the Motion Twin game; publisher records distinguish 2017 Early Access and the 2018 full release.
- **Splatterhouse:** later home-version coverage does not contradict the licensed publisher's 1988 arcade year.
- **Sunset Riders:** later console coverage does not contradict the 1991 arcade release and contemporary review.

## Candidates and scope

[Documentation PR #54](https://github.com/code198x/docs/pull/54) adds 157 candidate subjects and backlinks to 17 existing rows. Aliases were consolidated; every new/changed backlink resolves. Names no longer present in finished articles were not automatically added. Natsume's connected company histories remain covered by its existing entry. Reversi/Othello and the NES/arcade TMNT distinction are handled within their stated scopes rather than silently merged.

Console RPG remains a platform/interface article, distinct from the existing JRPG history. No duplicate article was established that required a redirect in this batch.

## Review limits

Some exact dates and personal production stories remain single-sourced or retrospective. Those limits are recorded per entry. Public source availability is distinguished from a source build, a disassembly, a binary music file or an emulator implementation. No claim is made that every historical game or released source archive was rebuilt or run.

## Evidence reports

| Entry | Verified | Corrected | Qualified | Removed |
|---|---:|---:|---:|---:|
| [Comix Zone](comix-zone.md) | 10 | 2 | 2 | 2 |
| [Gunstar Heroes](gunstar-heroes.md) | 10 | 2 | 2 | 2 |
| [Judge Dredd](judge-dredd.md) | 6 | 3 | 2 | 1 |
| [NHL '94](nhl-94.md) | 7 | 3 | 1 | 0 |
| [Road Rash](road-rash.md) | 7 | 2 | 0 | 1 |
| [Skate or Die](skate-or-die.md) | 9 | 0 | 1 | 0 |
| [Tales of Phantasia](tales-of-phantasia.md) | 10 | 1 | 1 | 2 |
| [TMNT: The Arcade Game](tmnt-arcade.md) | 10 | 0 | 1 | 2 |
| [Vagrant Story](vagrant-story.md) | 8 | 2 | 1 | 1 |
| [Wario Land: Super Mario Land 3](wario-land.md) | 6 | 2 | 0 | 1 |
| [Wings of Fury](wings-of-fury.md) | 7 | 1 | 1 | 1 |
| [Amiga User International](amiga-user-international.md) | 3 | 4 | 0 | 2 |
| [Mark Ferrari](mark-ferrari.md) | 4 | 2 | 2 | 3 |
| [Tommy Tallarico](tommy-tallarico.md) | 3 | 4 | 2 | 3 |
| [Arbitrary Code Execution](arbitrary-code-execution.md) | 1 | 6 | 0 | 4 |
| [Client-Side Prediction](client-side-prediction.md) | 4 | 3 | 1 | 2 |
| [Ring Buffer](ring-buffer.md) | 4 | 4 | 2 | 1 |
| [Unit Pathfinding](unit-pathfinding.md) | 4 | 3 | 2 | 3 |
| [Cascade Games](cascade-games.md) | 5 | 3 | 3 | 1 |
| [Durell Software](durell.md) | 6 | 2 | 2 | 1 |
| [Natsume](natsume.md) | 6 | 4 | 1 | 1 |
| [Arcade to Console](arcade-to-console.md) | 3 | 1 | 2 | 3 |
| [Moon Logic](moon-logic.md) | 3 | 2 | 1 | 2 |
| [Software Crossed What Machines Could Not](software-crossed-what-machines-could-not.md) | 2 | 4 | 1 | 4 |
| [UK Gaming Boom](uk-gaming-boom.md) | 4 | 2 | 1 | 2 |
| [The Binding of Isaac](binding-of-isaac.md) | 6 | 3 | 1 | 1 |
| [Dead Cells](dead-cells.md) | 5 | 4 | 1 | 1 |
| [Jackal](jackal.md) | 4 | 3 | 1 | 1 |
| [The Legend of Zelda: Link's Awakening](links-awakening.md) | 5 | 2 | 1 | 1 |
| [Little Nemo: The Dream Master](little-nemo.md) | 4 | 4 | 0 | 1 |
| [Punch-Out!!](punch-out.md) | 8 | 1 | 1 | 1 |
| [Reversi](reversi.md) | 3 | 3 | 1 | 2 |
| [Snake](snake.md) | 3 | 4 | 2 | 1 |
| [Snake Rattle 'n' Roll](snake-rattle-n-roll.md) | 7 | 3 | 0 | 1 |
| [Splatterhouse](splatterhouse.md) | 5 | 2 | 1 | 3 |
| [Suikoden](suikoden.md) | 8 | 0 | 1 | 2 |
| [Sunset Riders](sunset-riders.md) | 6 | 0 | 1 | 2 |
| [Console RPG](console-rpg.md) | 3 | 3 | 1 | 1 |
| [Brian Howarth](brian-howarth.md) | 6 | 1 | 2 | 2 |
| [Gargaj](gargaj.md) | 7 | 0 | 2 | 2 |
| [Manami Matsumae](manami-matsumae.md) | 8 | 0 | 2 | 2 |
| [Neil Baldwin](neil-baldwin.md) | 4 | 3 | 3 | 2 |
| [Twister](twister.md) | 3 | 2 | 1 | 2 |

## Render evidence

The [browser results](verification/render-results.json) cover every entry at both sizes. Representative complete captures:

- Brian Howarth: [desktop](verification/brian-howarth-desktop.jpg), [mobile](verification/brian-howarth-mobile.jpg).
- Twister: [desktop](verification/twister-desktop.jpg), [mobile](verification/twister-mobile.jpg).
