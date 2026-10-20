# CSS cascade layers

Restructure the site's CSS so rules win by an explicit layer order instead of
specificity tricks. Then remove the tricks, merge the two token vocabularies,
settle the breakpoints and name files by purpose. Every step except the two
marked **intended change** must leave every page looking exactly as it did.

Agreed with Steve on 2026-10-20 as approach 1 of three (layers first; not
component-scoping everything, not a rewrite from the kit).

**Target: half the CSS.** On 2026-10-20 the source held 502 KB of CSS: 174 KB
in stylesheets and 329 KB in component `<style>` blocks (1,981 + 8,002 lines).
Steve's target is 250 KB or less. Layers alone save little (the `body.magazine`
prefixes are about 9 KB); most of the cut has to come from rules no page uses
(step 1) and from duplicated rules (steps 4 and 5). Measure the source size at
the end of every step and record it here.

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
- Light only: the kit sets `color-scheme: light`.
- The kit (`_198x-ui/`, pinned by `scripts/fetch-ui.sh`) is unlayered. So are
  `pagefind-ui.css` and any CSS the editor or player injects at runtime.
  **Unlayered CSS beats every layer**, so each of these needs a decision in
  step 1. The kit itself is not edited here; it is Steve's release.

## Target

```css
@layer kit, base, layout, components, pages, legacy;
```

- `kit`: `_198x-ui` tokens and fonts, imported with `layer(kit)`.
- `base`: site tokens, element defaults, typography.
- `layout`: page frame, header, footer, breadcrumbs, grids.
- `components`: shared components' styles.
- `pages`: page- and section-specific rules.
- `legacy`: the starting bucket. Everything goes in here first and leaves
  as it is sorted, and it is deleted when empty.

The order statement goes in the first inline `<style>` in `Layout.astro`'s head.
The built pages already put that before every bundled stylesheet, which a test
will assert.

## How each step is checked

A computed-style snapshot is the gate. A script serves the built site, visits a
fixed route set and records `getComputedStyle` for every element and its
`::before`/`::after`. Two snapshots are compared, and a pure-restructure step
must produce **zero differences**. Screenshots back it up for a person to look
at, and they are the main evidence for the two intended-change steps.

Each step also runs `npm run check:release`, and its PR runs the browser CI.

## Steps

### 0. Measurement tools (PR 1, with this plan)

1. Add `scripts/css-snapshot.mjs`: built site via `astro preview` on its own
   port, Chromium, desktop 1440×900 and Pixel 7, animations frozen, fonts
   awaited. Writes one JSON per route and viewport.
2. Add `scripts/css-diff.mjs`: compares two snapshot directories and prints
   the route, element path, property, before and after. Exits non-zero on any
   difference.
3. Add `scripts/css-routes.mjs`, which writes the route set
   (`scripts/css-routes.json`) from the build. It takes a greedy cover, the
   fewest pages that between them render every scoped component (by
   `data-astro-cid-*`) and every class the global stylesheets name. On
   2026-10-20 that was 82 of 3,866 pages covering 599 features. Hand-written
   entries with `steps` add the states a page load misses: mobile menu open,
   search open, a lesson with its editor open. This replaces "one route per
   template", which would miss components used on only a few lessons.
4. Add `npm run css:routes`, `css:snapshot` and `css:diff`, and document them
   in `docs/page-layouts.md`.
5. Verify the gate. Two full snapshots of one build (169 page snapshots)
   matched except for the search box's focus ring, which Pagefind sets
   asynchronously. The search state now waits for focus, and four repeats then
   matched. Changing one property in a built page (Field Notes card titles,
   `letter-spacing: 0` → `1px`) was reported with its layout knock-on effects
   (49 differences), and the diff exited 1.

Not covered: `:hover` and `:focus` states. Add a forced-state pass through
CDP `CSS.forcePseudoState` if step 4 turns up rules that only show under them.

### 1. Remove CSS no page uses

1. Add `scripts/css-coverage.mjs`: load every built page at 1440, 768 and
   Pixel 7 widths with Chromium's CSS coverage on, and report each rule that
   never matched anything.
2. Group the unused rules by source file. Before deleting one, search `src/`
   for its classes and attributes: rules for `:hover`, `:focus`, open
   disclosures and classes added by scripts report as unused too.
3. Delete in PRs by area. Gate: `css:diff` shows zero differences, the browser
   CI passes, and a fresh coverage run shows the rule gone without new unused
   rules appearing.

### 2. Everything into `legacy`

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

### 3. Sort `legacy` into layers, lowest first (one PR per layer)

Moving a rule to a lower layer makes it lose to everything still in `legacy`,
so sort from the bottom up: `base` (site tokens, `lesson.css` defaults, the
global element rules in `Layout.astro`), then `layout`, `components`, `pages`.
When a move produces differences, the gate names the rule pair that competed.
Either move the competitor in the same PR, or leave both in `legacy` and list
them for step 4. Delete `legacy` when it is empty.

### 4. Remove the specificity boosts (PRs by area)

Strip `body.magazine` prefixes, unnecessary `:global()` wrappers and
`!important`, one area at a time (Vault, lessons, patterns, editorial, family,
setup, shell). Zero differences per PR.

### 5. One token vocabulary (PRs by token group)

1. Replace site tokens that alias a kit token everywhere with the kit token.
   Zero differences.
2. Scoped redefinitions with different values (`--color-text`,
   `--color-primary`, …): name what each scope means and give it its own
   token. Zero differences.
3. Raw hex values: replace those identical to an existing token. List the rest
   for Steve. Any change of value is an **intended change** and needs
   screenshots and approval.

### 6. Breakpoints (intended change)

Propose a scale (for example 600 / 900 / 1100) with screenshots of every page
whose layout shifts. Steve approves the scale before any code changes.

### 7. Files by purpose

Rename or merge the files named after rollouts (`design-rollout.css`,
`approved-pages.css`, `approved-learning.css`) into files named for what they
style, one per layer where that helps. Update `docs/page-layouts.md` and the
README's "Magazine presentation" section to describe the layers. Zero
differences.

## Risks

- **Runtime CSS outside our control** (editor, player, pagefind) is unlayered
  and will now beat site overrides. Step 1 finds every case on the route set;
  routes outside the set rely on the browser CI and the release checks.
- **Route set coverage.** The cover guarantees every component and every
  global class appears at least once, but not every combination. An element
  selector in a particular context (a `table` inside `.prose`, say) is checked
  only if some chosen page happens to have one. The browser CI and release
  checks are the backstop.
- **Parallel work.** Other branches edit the same `<style>` blocks
  (`website-preview`, `design-system-v1`, `lesson-page-redesign` worktrees).
  Step 1 touches all 141 files and will conflict with them. Land it quickly,
  and tell Steve before it merges.
