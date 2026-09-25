# House UI preview: four Code198x pages with imagery and fewer boxes

**Status:** Draft design, 2026-09-21. Not yet approved. Written for review by a person and by a second agent that has no access to the conversation that produced it.

**Scope:** The representative House UI preview that `198x/decisions/family-visual-identity.md` authorises in its final drift trigger: homepage, Spectrum landing page, one BASIC lesson and one Vault entry. Nothing else.

**Repo:** `code198x/website`. The four routes are:

| Page | Route | Source |
|---|---|---|
| Homepage | `/` | `src/pages/index.astro` (383 lines) |
| Spectrum landing | `/systems/sinclair-zx-spectrum/` | `src/pages/systems/sinclair-zx-spectrum/index.astro`, which passes a data object to `src/components/SystemOverview.astro` |
| BASIC lesson | `/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/` | `src/content/curriculum/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer.mdx` rendered by `src/layouts/UnitLayout.astro` (427 lines) |
| Vault entry | `/vault/systems/zx-spectrum/` | `src/content/vault/systems/zx-spectrum.mdx` rendered by `src/pages/vault/[...slug].astro` |

## 1. The problem this preview answers

The site is warm and readable, and it is generic. Screenshots of the live site on 2026-09-21 at 1440px, both themes, show:

- The homepage carries no picture. Its hero is a headline beside a statistics box. Below it are nine bordered boxes for Foundations, ten for systems, three for What's New, six for decades, eight for "learn in layers", then two bands. Every content unit is the same object: a 1px-bordered box with the same radius and padding, laid in a column grid.
- The Spectrum landing page has no picture of a Spectrum and no game frame. It is prose, two track cards, four Vault cards.
- The Vault index is roughly a hundred identical cards in six sections of four columns.
- The BASIC lesson is the strongest page. Its captures already render large, and the right column holds a sticky contents list.
- Dark mode is the light layout with inverted grounds.
- The one element with personality is the "WANTED" stamp in the dark band at the foot of the homepage.

The project already holds the answer. `public/images/` contains 641 PNG captures the project made itself with its own emulator, which is tier one of `198x/decisions/publishing-third-party-imagery.md` ("we make the artefact"). The flagship pages use almost none of them above thumbnail size.

The preview therefore has two aims: **put the project's own captures on the page at a size that shows the pixel**, and **stop making every content unit a card**.

## 2. Binding constraints

These records bind this work. Read them before changing anything; the summaries below are digests, not substitutes.

**`198x/decisions/family-visual-identity.md`**

- Project colour (Code198x rust `#a93800`) appears in the plate's prefix cell and, at the ceiling, as an ambient ground tint. Never on anything attached to an object: no border, heading, link, rule, card accent or glow at rest.
- Machine colour is the *subject* axis. It may appear on content markers, cards, headings and platform badges. It is declared as `color:` in `src/content/systems/*.yaml` and is contrast-adjusted through `src/lib/contrast.ts` wherever it carries meaning. Never write a derived ink down.
- Three faces, three jobs: Nebula Sans for interface, Literata for reading and editorial display and all captions, JetBrains Mono for anything the machine said. A fourth face, including any pixel or bitmap font, is a drift trigger.
- Captions are Literata italic everywhere.
- Motion is one rule, the lift transition, and is off under `prefers-reduced-motion`.
- The type scale, 4px space unit and lift ladder in `_198x-ui/tokens.css` are the tokens to use. `--h-ink-faint` is decorative only, never small text. Text in the accent uses `--h-accent-ink`, never `--h-accent`.
- Extend adoption only after reviewing readability, navigation, mobile behaviour and both themes.

**`198x/decisions/publishing-third-party-imagery.md`**

- Our own captures and our own photographs of our own hardware: yes.
- Any image found online: never. This includes Wikimedia Commons.
- Box art, covers and magazine pages: small, once, in the entry about that work, or not at all. Not decoration.

**`Code198x/docs/website.md`, "Rendering and design"**

- One outer page frame: nav, breadcrumb, main containers and footer share `--container-max-width` (1440px) and `--gutter`. Keep prose at a readable measure inside that frame. Wider layouts may use contents columns or supplementary figures.
- Keep decorative motifs away from essential information. Maintain contrast, keyboard focus, narrow-screen layouts and reduced-motion support.
- Follow existing family tokens and components rather than the retired HTML mock-ups. Build the real pages.

**Project working rules (memory and `Code198x/CLAUDE.md`)**

- Captures are evidence, not decoration: no overlays, tints, scanlines, curvature or ligatures over a capture or a listing. A CRT look belongs at capture time, and this preview does not add one.
- Verify captures before using them in public-facing content. Do not present an illustrative mock-up as executed output.
- The website repo rejects direct pushes; work lands through a PR.
- British English, except "program".

## 3. Design principles for the preview

1. **The pixel is the brand.** Captures render at an integer multiple of their native pixel size with `image-rendering: pixelated`. Never fractional scale, never stretched to a column. Each placement names a *ceiling* scale; the rendered scale is the largest integer at or below the ceiling whose width fits the container, and never below 1. Container queries on the frame's wrapper select the scale, so no script is needed.
2. **The machine's geometry breaks the grid.** A Spectrum frame at 2x is 704px wide; a C64 frame at 2x is 832px. These sizes do not fit columns and are not made to. A frame may hang past the content measure into the gutter, occupy the margin, or sit beside prose that keeps its own measure. This gives the layout a reason to be irregular that a reader can feel.
3. **A card means something.** Cards remain for the four live systems only. Everything else that is a list becomes a list: numbered, ruled, or run-in prose.
4. **Marginalia at wide widths.** Above 1200px the right column carries figures, captions, dates and mono snippets beside the prose they belong to. Below that they flow inline.
5. **Nothing changes outside the four pages.** `src/layouts/Layout.astro`, the tokens, the kit and every shared component keep their current behaviour. New behaviour lives in new components or in page-scoped styles.

## 4. Assets and capture geometry

Native capture sizes in `public/images/`, measured 2026-09-21:

| Machine | Native capture | Notes |
|---|---|---|
| ZX Spectrum | 352 x 296 | 256 x 192 screen plus border, 1x |
| Commodore 64 | 416 x 312 | screen plus border, 1x |
| NES | 256 x 240 | 1x, no border |
| Amiga (assembly) | 640 x 512 | already 2x, or hi-res; treat as 2x |
| Amiga (AMOS) | 816 x 450 | not an integer frame; do not use in the preview |

Integer scale rule, restating principle 1: a placement gives a ceiling; the rendered scale is `min(ceiling, floor(container width / native width))`, and never below 1. The 640 x 512 Amiga captures are treated as already 2x, so their ceiling is 1 (native) everywhere. At phone width every frame renders at 1x (a Spectrum frame at 352px fits a 390px viewport inside 16px gutters) and is never cropped. Where a 1x frame is wider than the phone viewport (the Amiga at 640px) it scrolls horizontally inside its own wrapper rather than shrinking.

Native sizes are read at build time in the component frontmatter from the PNG header (bytes 16 to 23) with `node:fs`. No new dependency.

Candidate frames, all existing, all the project's own captures. The implementer should view each before use and may substitute a better frame from the same module:

| Use | File |
|---|---|
| Spectrum, BASIC | `public/images/sinclair-zx-spectrum/basic/brick-bash/teaching/complete.png` |
| Spectrum, assembly | `public/images/sinclair-zx-spectrum/assembly/meteor-storm/flight.png` |
| Spectrum, lesson step 1 | `public/images/sinclair-zx-spectrum/basic/meet-basic/unit-01/step-01-hello.png` |
| Spectrum, lesson step 2 | `public/images/sinclair-zx-spectrum/basic/meet-basic/unit-01/step-02-two-lines.png` |
| C64 | `public/images/commodore-64/assembly/starfield/starfield-hero.png` |
| NES | `public/images/nintendo-entertainment-system/assembly/dash/unit-13/screenshot.png` |
| Amiga | `public/images/commodore-amiga/assembly/signal/unit-13/screenshot.png` |

One new capture is required: the Spectrum 48K boot screen (the Sinclair copyright message) for the Vault entry header. Make it with the manifest-driven runner at `code-samples/_capture/capture.py`, which is the documented capture path; a cold boot with no program loaded, captured after the ROM has drawn its message. Commit the manifest beside the output so it is reproducible. This is a capture of our own emulator running the machine's firmware and is covered by `198x/decisions/capturing-published-software.md`.

**No photograph is available.** The only Spectrum photograph in the repo, `public/images/sinclair-zx-spectrum/machine/meet-the-machine/unit-01/zx-spectrum-48k.jpg`, is Bill Bertram's Wikimedia Commons image, credited in Meet the Machine unit 1. The imagery decision permits only the project's own photographs of its own hardware in a hero, so this preview uses game frames instead and leaves a clearly marked slot for a photograph Steve takes himself. That existing lesson use is out of scope here and is noted in section 10.

## 5. Page designs

### 5.1 Homepage (`src/pages/index.astro`)

Keep the outer frame, the nav, the footer, the headline "Make a real game, on a real old machine.", the two buttons, and the "An honest ask" band with its WANTED stamp. Change the rest.

**Hero.** Remove "The Ambition" statistics box. In its place, on the right, a single game frame with a ceiling of 2x (so 704px for the Spectrum, 832px for the C64, 512px for the NES, 640px native for the Amiga), with `image-rendering: pixelated`, a 2px border in the machine's contrast-adjusted colour (subject axis), and `--h-lift-2`. The hero is a two-column grid: the headline column has a minimum of 32rem, the frame column takes the rest, and the frame is right-aligned and may overflow its column into the right gutter by up to the gutter width. Below 1024px the frame stacks under the headline at whatever integer scale fits. Beneath the frame, a Literata italic caption: the game name, the machine, and a link to the lesson the frame comes from, for example "Brick Bash, running on a 48K Spectrum. From Sinclair BASIC, module 4."

The four live-machine frames rotate by build date: the UTC day of year modulo 4 chooses the machine. The site rebuilds daily on the publication cron, so the hero changes each day and is otherwise static. A build-time choice keeps the page free of client script.

The four statistics the box carried (machines catalogued, regions, live machines, contributors welcome) move into one line of mono small text beneath the buttons, in `--h-ink-muted`.

**Systems.** The four live machines become a shelf: four frames at 1x native size (ceiling 1) in a two-by-two grid above 1024px and a single column below, with no box around them, each with the machine name in Nebula Sans beneath, the CPU and year in mono micro text, and one line of description. Four 1x frames do not fit one row at 1440px (352 + 416 + 256 + 640 exceeds the content width), which is why the shelf is two by two. The machine-colour top rule the current cards carry stays, as a 4px rule above each frame. The six "next" machines become a two-column ruled list: name, year, one line, "Preview" link. No boxes.

**Foundations.** The "The Basics" feature stays as the single boxed element in this band. The nine Foundations modules become a numbered running list in two columns with one line each and a rule between rows.

**What's New.** The three latest updates become a ruled list: date in mono micro on the left, title and one line on the right. No boxes.

**Decades and "learn in layers".** These two grids collapse into one band with two ruled lists side by side: "Four decades" (six rows, count in mono, live marker) and "Reference" (eight rows). The counts stay derived from the manifest as they are now.

**Emulator.** The "Built in the open" band becomes one paragraph with a link. No box.

**Order** stays as now: hero, Foundations, systems, What's New, decades and reference, emulator, the ask.

### 5.2 Spectrum landing page (`SystemOverview.astro`, scoped to this page)

The page is a data object passed to `SystemOverview.astro`, which every system landing page shares. Do not change that component's default output. Add an optional `hero` prop and a `presentation: 'house'` flag mirroring the existing `presentation` field on module indexes (`src/content.config.ts` line 558). Only the Spectrum page passes them in this preview.

**Hero.** Title "Sinclair ZX Spectrum" in Literata at the display step. A 4px machine-colour rule beneath it. The introduction as lead text. On the right, a frame from the assembly track (Meteor Storm), rendered by `PlayerStage` (see `2026-09-25-browser-player-integration-design.md`), in its specimen-sheet treatment, in the same two-column hero grid as the homepage. At wide widths, a mono spec column in the right margin beneath the frame: 1982, Zilog Z80 at 3.5 MHz, 48K RAM, 256 x 192 pixels, 15 colours, 1-bit beeper. Take the figures from the existing `SystemHero.astro` specs pattern and the Vault entry's "Fast facts", which cite their sources.

A second, empty hero slot is reserved for the machine photograph: a dashed outline at 3x2 ratio with the text "Photograph of Steve's own 48K Spectrum goes here" in `--h-ink-muted`. It is removed before release, not left as decoration, and the spec records it so a reviewer knows why the hero is asymmetric.

**Choose a language.** The two track cards become two columns of prose, each headed in Nebula Sans, with a 2x frame from the track's first module (Meet BASIC step 2, Meet Assembly or Meteor Storm), the lesson-page count in mono, and the existing "Explore" link. No boxes. The "Counts reflect authored lesson pages" note stays.

**Prepare the right configuration** and **Follow a question further** stay as prose.

**Explore the machine and its games.** The four Vault reference cards become a ruled list with title and one line each.

### 5.3 BASIC lesson (`UnitLayout.astro` and `Figure.astro`, scoped)

`UnitLayout.astro` already lays out `1fr 220px` above 1200px with the contents list in the right column. `Figure.astro` already defaults to pixelated rendering and offers a `width` prop.

Changes:

- `Figure.astro` gains an optional `scale` prop, the ceiling from principle 1. When set, the image renders at the largest integer scale that fits its container, up to the ceiling, and the wrapper allows it to exceed the prose measure. The native size is read at build time from the PNG header with `node:fs`. The image keeps its intrinsic `width` and `height` attributes so space is reserved.
- `Figure.astro` gains an optional `place="margin"` prop. Above 1200px the figure is placed into the right column of the unit layout beneath the contents list, using grid placement on `.unit-layout`. Below 1200px it renders inline as today. The caption stays with the figure.
- Widen the right column of `.unit-layout` from 220px to 352px above 1200px, so a Spectrum frame sits there at 1x. Above 1440px, widen it to 704px only if the prose column still holds 65ch of Literata at the body size (about 600px); measure at 1440px and 1920px and record the chosen breakpoints in the component. At any width where the column is 352px the figures render at 1x by the ceiling rule, and at 2x where it is 704px. While the run panel is docked, margin figures render inline, as they already do below 1200px: the right column holds one of the contents list, margin figures or the running machine, never more than one at a time.
- Unit 1's two captures (`step-01-hello.png`, `step-02-two-lines.png`) use `scale={2}` and `place="margin"`.
- The captures lose the grey outlined box `Figure.astro` currently draws around them. The Spectrum's own border, which the capture already contains, is the frame.

No change to the prose, the callout, the milestones or the navigation.

### 5.4 Vault entry (`src/pages/vault/[...slug].astro`, scoped)

The Vault entry template already has a right column (`.vault-sidebar`, 260px above a breakpoint) carrying contents, details and references. The page is long and text-only.

Changes, gated on a `hero` field in the entry's frontmatter so other entries are untouched:

- A header capture: the Spectrum boot screen with a ceiling of 3x (1056px, which fits the article column at 1440px beside the 260px sidebar, and drops to 2x or 1x where it does not), machine-colour border, Literata italic caption "The 48K Spectrum, switched on. The ROM draws this before anything else runs." placed between the title block and the prose.
- Fast facts move from the prose into the sidebar as a mono definition list under "Details", keeping their existing citations. Remove the "Fast facts" section from the prose so it is not duplicated.
- One period pull quote at the h2 step in Literata, with a rule above and below, placed after "Why it mattered", **only if** a quotation with a citation can be found in the reference library (`198x/reference/`). Quoting text is permitted; reproducing the page is not. If no citable quotation is found, omit the pull quote and note that in the PR.

Add `hero` to the vault collection schema in `src/content.config.ts` as an optional object `{ src, alt, caption, scale }`.

## 6. Components and files touched

| File | Change |
|---|---|
| `src/components/PixelFrame.astro` | **Already built**, by the player-integration work (`2026-09-25-browser-player-integration-design.md` §6), not new here. Renders one capture at the largest integer scale that fits, up to a ceiling, with an optional 4px rule in the machine's colour and a Literata italic caption. Reads the native size from the PNG header at build time. Props: `src`, `alt`, `ceiling` (default 2), `rule` (the rule's colour), `caption`, `label` (the name of the capture's scrollable region; defaults to `alt`). Used by the homepage hero, the systems shelf, the Spectrum hero and the Vault header. `Figure.astro` delegates to it when `scale` is set. |
| `src/pages/index.astro` | Rewrite the hero, systems, Foundations, What's New, decades and emulator bands per 5.1. Data derivation stays as it is. |
| `src/components/SystemOverview.astro` | Add optional `hero` and `presentation` props; house rendering per 5.2 when set. Default output unchanged. |
| `src/pages/systems/sinclair-zx-spectrum/index.astro` | Pass `hero` and `presentation: 'house'`. |
| `src/components/Figure.astro` | Add `scale` and `place`. Remove the outline box when `scale` is set. |
| `src/layouts/UnitLayout.astro` | Wider right column above 1200px; grid placement for margin figures. |
| `src/content/curriculum/.../unit-01-make-the-spectrum-answer.mdx` | Pass `scale={2} place="margin"` on its two figures. |
| `src/pages/vault/[...slug].astro` | Render `hero` when present; fast facts in the sidebar when `hero` is present. |
| `src/content.config.ts` | Optional `hero` on the vault collection. |
| `src/content/vault/systems/zx-spectrum.mdx` | Add `hero`, move fast facts. |
| `public/images/vault/systems/zx-spectrum/boot.png` and its capture manifest | **New** capture. |

Not touched: `src/layouts/Layout.astro`, `_198x-ui/`, any other page or layout, any other system landing page, any other lesson, any other Vault entry.

## 7. What stays out, and why

- **No pixel or bitmap font.** Three faces, three jobs. The pixel is carried by the captures.
- **No project colour on anything attached.** Rust stays in the plate. Machine colour is the only attached colour, and only on the subject it names.
- **No overlays on captures.** No scanlines, curvature, phosphor tint or vignette.
- **No found imagery.** No Commons photographs, box art or magazine scans.
- **No per-machine marks.** The record notes that a per-machine mark is the right instrument for telling machines apart. It is a drawing job and a separate piece of work.
- **No listing-as-ornament, no stamp vocabulary beyond the existing WANTED stamp, no dark-mode glow on captures.** These are second-pass items after the preview is reviewed.
- **No change to the Vault index or the Systems index.** The record names four pages; the Vault index's card wall is the most visible offender and is the first candidate for the next pass.
- **No client-side script.** Rotation and scaling are decided at build time and in CSS.

## 8. Verification

All from the website repo. Report skipped or blocked checks accurately.

1. `npm run build` passes.
2. `npm test` passes.
3. Screenshots of the four routes before and after, at 390px, 1024px, 1440px and 1920px, in both themes, produced with Playwright and attached to the PR. Look at them. Check that no capture renders at a fractional scale (measure the rendered width against the native width), that prose holds its measure at every width, and that nothing overflows horizontally at 390px.
4. `npm run test:a11y` (Playwright, `tests/a11y.spec.ts`) with the four routes covered in both themes, with no new serious or critical findings against the existing baseline. `npm run test:a11y:sweep` is the full-site sweep and is the check to run before any release, not for the preview PR.
5. Keyboard walk of each page: every link and control reachable, focus visible, the hero caption link included.
6. `prefers-reduced-motion: reduce` shows no motion.
7. Confirm that a page outside the four (for example `/systems/commodore-64/` and any other lesson) renders identically before and after, by screenshot diff.
8. Confirm the boot-screen capture was produced from the manifest and that the manifest is committed.

## 9. Delivery

A branch from `main` in a worktree (the checkout carries uncommitted work from another session). A draft PR titled "Preview House UI on four representative pages", not merged by the implementer. The PR description links this spec, includes the screenshot grid, and lists any check that was skipped.

## 10. Open questions and follow-ups

- **Photograph.** The Spectrum hero wants a photograph of Steve's own machine. Until one exists the hero uses a game frame and a marked slot. This is the one input only Steve can supply.
- **Existing Commons photograph.** Meet the Machine unit 1 already publishes a Wikimedia Commons photograph with credit. That predates the imagery decision's "never" and is not changed here. It should be raised as its own issue.
- **Amiga capture sizes.** The AMOS captures at 816 x 450 are not integer frames. They are not used here, but the systems shelf will need a proper Amiga frame per track before the next pass.
- **Pull quote.** Depends on finding a citable period quotation about the Spectrum in the reference library.
- **Column width above 1500px.** Section 5.3 leaves the exact margin-column widths to measurement, with the constraint that prose keeps 65ch and captures stay at integer scale.
