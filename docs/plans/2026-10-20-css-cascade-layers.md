# CSS cascade layers and layout composition

Restructure the site's CSS so rules win by an explicit layer order instead of
specificity tricks, then remove the tricks and merge the two token
vocabularies. After that, rebuild layout from a small set of Every Layout
primitives, so pages compose layout instead of writing it, and name files by
purpose. The layer steps must leave every page looking exactly as it did; the
composition steps are **intended changes**, reviewed by screenshot.

Agreed with Steve on 2026-10-20:

- Approach 1 of three: layers first. The alternatives were moving every global
  rule into its component, and a rewrite from the kit.
- Layout composition from Every Layout primitives, organised by CUBE CSS
  (Composition, Utility, Block, Exception). Chosen over container queries on
  each component (a technique that complements this but doesn't replace it)
  and utility-first CSS (a new dependency, every template rewritten, and a
  second token system beside the kit's).
- The primitives are Astro components in the site first, and move to 198x-ui
  once they have settled across the page families.

**Target: half the CSS.** On 2026-10-20 the source held 476 KB of CSS
(`npm run css:size` at 7d2dba5: 173,510 bytes in stylesheets and 302,477 in
component `<style>` blocks). Steve's target is 238 KB or less. Layers alone
save little (the `body.magazine` prefixes are about 9 KB). Most of the cut has
to come from rules no page uses (step 1), duplicated rules (steps 3 and 4) and
hand-written layout that the primitives replace (step 6). Record each step's
change in size, measured against its own parent commit, and the number of
layout media queries.

## Progress

CSS source size from `npm run css:size`: every `.css` file under `src/` plus
the full contents of every `<style>` block. Each change is measured against
its own parent commit, because other work lands on main in between.

| Change | Bytes | Running total |
|---|---|---|
| Starting point (7d2dba5) | | 475,987 |
| Removed 18 components no page renders (#874) | −32,356 | |
| Removed selectors for 56 classes nothing renders (#875) | −24,037 | |
| Other work: the Pattern Library prototype (#837 and follow-ups) | +9,189 | |
| Wrapped every rule in a layer (step 2, #877) | +5,982 | 434,765 |
| Dropped 383 `body.magazine` prefixes (step 3) | −5,362 | 429,403 |

Removals so far: 61,755 bytes, 13.0% of the starting point.

**Correction.** Until 2026-10-20 evening this table used a line-based count
that missed one-line `<style>` blocks and counted script text after a
`<style>` mentioned in a comment. It put the start at 502,150 and #874 at
−20.9 KB; the commit messages and PR descriptions of #874 and #875 quote
those figures.

Layout media queries (an `@media` block that changes `grid-template-columns`,
`grid-column`, `flex-direction` or `display`): 113 of 195 media queries on
2026-10-20, across 62 files and no file with more than nine; 114 of 201 after
the Pattern Library prototype landed.

## Where it stands (main at 7d2dba5)

- 25 stylesheets in `src/styles/` and `src/lib/` (176 KB, mostly one-line
  rules), plus 7,532 lines of `<style>` in 141 `.astro` files. `Layout.astro`
  carries 754 of them, mostly `is:global`.
- 675 `body.magazine` prefixes. Every page renders `<body class="magazine">`,
  so the prefix only adds specificity. With it: 242 `:global(` and 53
  `!important`.
- Astro scopes component styles with its default `attribute` strategy, so a
  scoped selector gains (0,1,0) per compound. Global rules have been
  outbidding that with `body.magazine`.
- Pages and components import stylesheets themselves, and Vite bundles them per
  page. Stylesheet order therefore differs between `astro dev` and the build
  (`docs/page-layouts.md` already warns about this).
- Two token vocabularies: the kit's `--h-*` (1,932 uses) and the site's
  `--color-*`, `--space-*`, `--font-family-*` (1,610 uses). Most site tokens
  alias a kit token, but some are redefined per scope with different values
  (`--color-text` is `--h-ink-body` in one place and `--h-ink` in another).
- 328 raw hex colours; 210 media queries over about twenty breakpoints (600,
  740, 760, 767, 768, 860, 900, 1000, 1100 …).
- Layout is written per component: 258 `grid-template-columns`, 254
  `display: flex`, 1,209 `margin` and 581 `max-width` declarations, and one
  container query. The only shared layout piece is `PageFrame`, which is
  effectively a Center. The kit has no layout primitives (`Shell`, `Tile` and
  `Plate` are components).
- Light only: the kit sets `color-scheme: light`.
- The kit (`_198x-ui/`, pinned by `scripts/fetch-ui.sh`) is unlayered. So are
  `pagefind-ui.css` and any CSS the editor or player injects at runtime.
  **Unlayered CSS beats every layer**, so each of these needs a decision in
  step 2. The kit itself is not edited here; it is Steve's release.

## Target

```css
@layer kit, base, composition, utilities, blocks, exceptions, legacy;
```

- `kit`: `_198x-ui` tokens and fonts, imported with `layer(kit)`.
- `base`: site tokens, element defaults, typography.
- `composition`: the layout primitives (step 5), plus the page frame, header
  and footer. Nothing else sets layout.
- `utilities`: single-purpose classes generated from tokens, added only where
  a pattern repeats.
- `blocks`: components. A block styles its own look (colour, type, borders)
  and leaves its layout to composition.
- `exceptions`: variations of a block, expressed as data attributes
  (`[data-state="open"]`) rather than modifier classes.
- `legacy`: the starting bucket. Everything goes in here first and leaves as it
  is sorted, and it is deleted when empty.

The order statement goes in the first inline `<style>` in `Layout.astro`'s head.
The built pages already put that before every bundled stylesheet, which a test
will assert.

## Layout primitives

From Every Layout, as Astro components in `src/components/layout/`, each
rendering one element with a class and custom properties. The classes are the
single implementation and live in the `composition` layer.

| Primitive | Does | Replaces |
|---|---|---|
| `Stack` | Vertical rhythm between siblings | Most per-element `margin` declarations |
| `Box` | Padding and a border around content | Ad hoc padded panels |
| `Center` | A capped, centred measure | Scattered `max-width` + `margin-inline: auto`; `PageFrame` builds on it |
| `Cluster` | Wrapping rows of items (tags, buttons, links) | `flex-wrap` rows |
| `Sidebar` | Two panes that stack when the main pane gets too narrow | Two-column grids with a breakpoint |
| `Switcher` | Rows that become a column below a threshold, all at once | Grids that drop to one column at a breakpoint |
| `Grid` | Auto-filling columns with a minimum width | Fixed-column grids and their breakpoints |
| `Cover` | Vertically centred content in a minimum height | Hero and opening bands |
| `Reel` | A horizontal scroller | Hand-built overflow rows |
| `Frame` | Media cropped to an aspect ratio | Illustrations only (see below) |

- Spacing props take a step of the kit's scale (`space="4"` →
  `var(--h-space-4)`), so the primitives add no new tokens.
- Props are typed, so a wrong value fails the build.
- **`Frame` never holds a capture.** Captures render at a whole multiple of
  their native pixels, uncropped (`decisions/family-visual-identity.md`); they
  keep their existing components.
- Each primitive gets a specimen in the development catalogue and a browser
  test at 320, 768 and 1440 px.

## How each step is checked

- **Layer steps (2–4, 7):** a computed-style snapshot is the gate. A script
  serves the built site, visits a fixed route set and records
  `getComputedStyle` for every element and its `::before`/`::after`. Two
  snapshots are compared, and a step must produce **zero differences**.
- **Composition steps (5–6) and any value change in step 4:** these change
  geometry slightly, on purpose. Before and after screenshots at 320, 768 and
  1440 px of every route in the affected family, for Steve to review, plus the
  browser tests. The snapshot diff lists what moved, so nothing changes
  unseen.

Every step also runs `npm run check:release`, and its PR runs the browser CI.

## Steps

### 0. Measurement tools (done, #872)

1. `scripts/css-snapshot.mjs`: built site via `astro preview` on its own
   port, Chromium, desktop 1440×900 and Pixel 7, animations finished, every
   font face loaded, and the layout left to settle. Writes one JSON per route
   and viewport.
2. `scripts/css-diff.mjs`: compares two snapshot directories and prints the
   route, element path, property, before and after. Exits non-zero on any
   difference.
3. `scripts/css-routes.mjs` writes the route set (`scripts/css-routes.json`)
   from the build. It takes a greedy cover, the fewest pages that between them
   render every scoped component (by `data-astro-cid-*`) and every class the
   global stylesheets name. On 2026-10-20 that was 82 of 3,866 pages covering
   599 features. Hand-written entries with `steps` add the states a page load
   misses: mobile menu open, search open, a lesson with its editor open.
4. `npm run css:routes`, `css:snapshot` and `css:diff`, documented in
   `docs/page-layouts.md`.
5. The gate was verified both ways:
   - It can fail: changing one property in a built page (Field Notes card
     titles, `letter-spacing: 0` → `1px`) was reported with its layout
     knock-on effects (49 differences), and the diff exited 1.
   - It is deterministic: snapshots of separate builds of the same source
     match on all 169. This needed four fixes: Pagefind focusing its input
     late, random diagram marker ids, the Game Feel iframe resizing after load,
     and a display face still loading when `document.fonts.ready` resolved.

Not covered: `:hover` and `:focus` states. Add a forced-state pass through
CDP `CSS.forcePseudoState` if step 3 turns up rules that only show under them.

### 1. Remove CSS no page uses (in progress: #874, #875)

1. `scripts/css-coverage.mjs` loads every built page at 1440, 768 and Pixel 7
   widths with Chromium's CSS coverage on, and reports each rule that never
   matched anything. On 2026-10-20: 202 KB of 573 KB of distinct shipped CSS.
2. Removed 18 components nothing renders (#874), and selectors for 56 classes
   that nothing renders, no script adds and no source markup names (#875).
3. Left: rules that never matched although every class exists (about 108 KB
   shipped, mostly combinations that never occur). Telling those apart needs a
   selector-matching pass over every page.

### 2. Everything into `legacy` (done, this PR)

1. Add the order statement to the head's first inline style, and a browser
   test that it comes before every stylesheet in the built page.
2. Wrap each file in `src/styles/` and `src/lib/assembly-editor.css` in
   `@layer legacy { … }`.
3. Wrap each `.astro` `<style>` block's contents (including `is:global`) in
   `@layer legacy { … }`. Check on one component first that Astro still scopes
   selectors inside `@layer`.
4. Import the kit with `layer(kit)` instead of bare JS imports, in
   `Layout.astro` and `src/pages/catalogue/[...slug].astro`.
5. Run the gate. Every difference will come from unlayered CSS that site rules
   used to beat by specificity (pagefind, runtime-injected CSS, kit
   components). Fix each one by layering that CSS, or record why it stays
   unlayered. Finish at zero differences.

Outcome: zero differences on all 167 snapshots. The first attempt changed
31,666 computed values, all from the kit's component styles, which are
unlayered and so beat every layered override. 38 selectors that override a
kit component stay unlayered, after each layer block, with a note. These are
the ones that name a kit class, or whose subject carries a class the site
passes to a kit component. Pagefind and the editor's runtime CSS caused no
differences. **Proposed kit change:** wrap 198x-ui's component styles in
`@layer kit`, so the overrides can join the layers.

The release checks then caught what the gate missed:
`public/workbooks/…/workbook.css` is served as-is, so the wrap skipped it, and
unlayered it beat the page frame on the workbook pages. It is now in `legacy`
too. The route cover had dropped those pages because it counted only `src/`
stylesheets; it now counts `public/` ones, and main and this branch match on
all 169 snapshots of the new set.

### 3. Remove the specificity boosts (PRs by area)

Strip `body.magazine` prefixes, unnecessary `:global()` wrappers and
`!important`, one area at a time (Vault, lessons, patterns, editorial, family,
setup, shell). Zero differences per PR.

`body.magazine` (in progress): the prefix came off all 521 selectors at once,
and the gate showed which ones still decide a conflict by their weight. For
each changed value, Chromium's `CSS.getMatchedStylesForNode` on the main build
names the rule that supplied it. Rank candidates by layer, then specificity,
then order. Count longhands of a shorthand that holds `var()`, which Chromium
reports with empty values. Those prefixed selectors are kept, and the loop
repeats until the gate is clean. Eleven rounds kept 138 selectors (95
distinct) and removed 383. The kept ones go in step 6, when their rules move
from `legacy` into `blocks` and `exceptions`. `:global()` and `!important` follow the same way.

### 4. One token vocabulary (PRs by token group)

1. Replace site tokens that alias a kit token everywhere with the kit token.
   Zero differences.
2. Scoped redefinitions with different values (`--color-text`,
   `--color-primary`, …): name what each scope means and give it its own
   token. Zero differences.
3. Raw hex values: replace those identical to an existing token. List the rest
   for Steve. Any change of value is an **intended change** and needs
   screenshots and approval.

### 5. Build the primitives

Add the ten primitives above to `src/components/layout/`, their classes to the
`composition` layer, a catalogue specimen each and their browser tests.
Rebuild `PageFrame` on `Center`, which must leave its pages unchanged (zero
differences). No other page changes in this step.

### 6. Recompose page families (intended change, one PR per family)

Starting with the Vault (index, category and article templates, with their
own stylesheets, serving thousands of pages), then lessons, patterns,
editorial, system pages, family pages and setup. Per family:

1. Replace hand-written layout with primitives, and move what remains of the
   family's CSS from `legacy` into `blocks` and `exceptions`.
2. Delete the layout media queries the primitives make unnecessary.
3. Screenshots at 320, 768 and 1440 px before and after for Steve, and the
   source size and layout-media-query count for the progress table.

This replaces the earlier "settle a breakpoint scale" step: most breakpoints
go rather than being standardised. Any that remain (navigation, say) are
listed for Steve with a proposed scale.

### 7. Files by purpose

Rename or merge the files named after rollouts (`design-rollout.css`,
`approved-pages.css`, `approved-learning.css`) into files named for what they
style, one per layer where that helps. Delete `legacy`. Update
`docs/page-layouts.md` and the README's "Magazine presentation" section to
describe the layers and primitives. Zero differences.

### 8. Move the primitives to 198x-ui

Once step 6 has used them across every family, propose them to the kit as a
release for the other family sites, and switch the website to the kit's copy.
Steve owns the kit's releases.

## Risks

- **Runtime CSS outside our control** (editor, player, pagefind) is unlayered
  and will now beat site overrides. Step 2 finds every case on the route set;
  routes outside the set rely on the browser CI and the release checks.
- **The player's own CSS** (`public/emulators/player.css`, from
  `@emu198x/player`) is unlayered, like the kit's components. Its browser
  tests pass, but a site rule that overrides the player now loses to it.
  Override it from outside the layers, as with the kit, or ask Emu198x to
  layer it.
- **Route set coverage.** The cover guarantees every component and every
  global class appears at least once, but not every combination. An element
  selector in a particular context (a `table` inside `.prose`, say) is checked
  only if some chosen page happens to have one. The browser CI and release
  checks are the backstop.
- **Parallel work.** Other branches edit the same `<style>` blocks
  (`website-preview`, `design-system-v1`, `lesson-page-redesign` worktrees),
  and main moves under this work (the Pattern Library prototype landed during
  step 1). Step 2 touches all 141 files and will conflict with them. Land it
  quickly, and tell Steve before it merges. Recheck any rebased branch against
  main's new markup before merging.
- **Intended changes hide in volume.** A family recomposition moves many
  values at once. The screenshot review is the gate, so each PR stays to one
  family.
