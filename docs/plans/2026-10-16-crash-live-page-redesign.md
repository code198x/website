# CRASH! Live page: act on the 16 October critique

Steve chose "go bigger" the evening before the event, after a dual-agent
Impeccable critique (20/32) and a tasteskill review (6.0/10) of /crash-live/.
Snapshot: `.impeccable/critique/2026-10-16T13-24-36Z__src-pages-crash-live-index-astro.md`.

Scope is `src/pages/crash-live/index.astro` and `src/lib/crash-typeins.ts` only.
`SystemHero` is shared by every platform page and stays untouched.

## Steps and evidence

1. Masthead of its own: readable event label, headline in the magazine voice,
   the 48K typing video as the machine-object hero at its native 2x size,
   replacing the stats strip. Spot ink is the approved Spectrum screen red
   `#C20000`; nothing carries a resting offset shadow.
2. Three doors, the same at top and bottom: never programmed (Meet BASIC unit
   1), typed listings in the 80s (Touchdown unit 1), curious about Z80 (Meet
   Assembly unit 1), each with a real capture.
3. "Got a card?" grouped by what the card leads to, numbered as printed. Type-in
   sections titled with their card headlines; the retired logo card leaves the
   page (its .bas download remains).
4. Shorter phone page: the assembly-only section folds into the doors; the
   games wall goes to compact columns on small screens.
5. Verify: astro build; vitest; screenshots at 1440 and 390 inspected; the
   impeccable in-page detector re-run; every link and anchor on the page
   resolves in the build. Then PR, and merge only with Steve's go-ahead.
