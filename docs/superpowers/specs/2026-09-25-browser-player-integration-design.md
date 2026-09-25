# Browser players on system pages and lessons

**Status:** Design approved in conversation with Steve on 2026-09-25. This written spec awaits his review before an implementation plan is written.

**Scope:** How the shared Emu198x browser player sits on Code198x system pages (all 30 runtime families) and lesson pages. This is the follow-up design work that `198x/decisions/browser-player-rollout.md` leaves open: "How the players are integrated into pages for best effect is follow-up design work, not settled by this decision."

**Repo:** `code198x/website`. The player itself (`public/emulators/`, built from `emu198x/emu198x/web-player`) is not changed by this work.

**Out of scope, planned as project 2:** an inspector in the lesson panel that shows named registers, memory and anything else relevant to a unit. See section 9.

## 1. The problem

Screenshots of the live site at 1440px on 2026-09-25:

- **System pages** (`SystemOverview.astro` for the four curriculum machines, `systems/[platform].astro` for the other 26) place `BrowserPlayer` straight under the header. The player is about 1,100px tall. Its first state is a black box saying "Choose firmware: Select your ROM files to start this computer." Most readers have no ROM files, so the first thing the page offers is a request they cannot meet. On the Spectrum page it pushes "Choose a language", the page's actual job, below the fold.
- **Lessons** (`UnitLayout.astro`) end with a collapsed "Run this lesson" `<details>` from `LessonPlayer.astro`, after all the prose. Opening it shows the same 760px black box and firmware prompt. The reader never sees the program's output beside the text that explains it.
- Every system page loads `/emulators/embed.js` on arrival, whether or not the reader plays.

The rollout decision's own reason for publishing the players is the measure of success: "Letting readers play with the emulators shows what the project is far better than describing it does."

## 2. Success criteria

1. A first-time reader without ROM files understands what they are looking at and has one clear action, before any firmware request.
2. The page's main job (choosing a route on a system page, reading the lesson) stays prominent.
3. In a lesson, the reader can see the running program beside the text that explains it.
4. One treatment works for all 30 families, including machines much wider than a Spectrum.
5. Captures stay evidence: nothing is drawn over them, and they render at integer scale.

## 3. Binding constraints

These records bind the work. The summaries are digests, not substitutes.

- **`198x/decisions/browser-player-rollout.md`**: the player is BYO firmware on system pages, Spectrum included; existing permissioned curriculum embeds keep their ROMs. Firmware and media stay local and are never uploaded. Lesson launchers use staged unit artefacts, and missing artefacts never produce a launch button. The demo allowlist covers eight console families with project-owned programs.
- **`198x/decisions/family-visual-identity.md`**: machine colour is the subject axis (markers, headings, rules, badges); project colour (rust) never attaches to objects. Three faces with fixed jobs: Nebula Sans for interface, Literata for reading and all captions (italic), JetBrains Mono for anything the machine said. One motion rule, off under `prefers-reduced-motion`.
- **`198x/decisions/publishing-third-party-imagery.md`** and **`capturing-published-software.md`**: our own captures, yes; found images, never.
- **Captures are evidence**: no overlays, tints, scanlines or ligatures over a capture. Buttons and labels sit outside the picture, never on it.
- **`Code198x/docs/website.md`, "Rendering and design"**: one outer frame; prose keeps a readable measure; keep contrast, keyboard focus, narrow layouts and reduced motion.
- **The House UI preview spec** (`2026-09-21-house-ui-preview-design.md`, draft): overlaps this work; section 7 reconciles the two.

## 4. System pages

### 4.1 The stage

The player moves into the page hero as a **stage** that starts as our own capture and becomes the live player in place. The visual treatment is direction C, "specimen sheet", chosen from three rendered alternatives:

- A 4px rule in the machine's contrast-adjusted colour across the top of the stage.
- The **poster**: our capture, rendered by `PixelFrame` (section 6) at the largest integer scale that fits, with no border and no shadow. A poster whose native width is 416px or narrower has a ceiling of 2×; a wider poster defaults to a ceiling of 1×, so the Amstrad CPC, BBC Micro, Electron and Dragon render at 1×. A `ceiling` field in `player-posters.yaml` overrides the default for any family, narrow or wide. The stage's own width is the poster's native width times its ceiling, exposed as the `--stage-max` custom property so the hero column and the Play swap size to it.
- A **spec row** under the poster: a mono definition list ruled above and below showing released, CPU and model, taken from the system's data file and the player catalogue.
- A **Play** button in house ink (`--h-ink` on `--h-ground`), "▶ Play the ZX Spectrum", and beside it one line in `--h-ink-muted`:
  - families whose default model needs firmware and that have no demo: "Needs your own ROM files · nothing is uploaded";
  - families with a demo: "Runs a built-in demo · add your ROMs for the full machine";
  - families with no demo whose default model's firmware is all optional (the Atari 800XL): "Runs without ROM files · add yours for the original firmware".
- An italic Literata caption saying what the poster shows, for example "Meteor Storm, from the Z80 assembly track, on a 48K Spectrum."
- The "Download Emu198x for desktop" link, under the button.

**After Play**, the poster is replaced by `<emu198x-player>` at the same width, so nothing jumps. The player script is not on the page until this moment: pressing Play injects a `<script type="module" src="/emulators/embed.js">` (`src/lib/load-player.ts`), which every stage and run panel on the page shares once it resolves. If the script fails to load or times out, a status message appears beside the note ("The player couldn't load. Check your connection and try again.") and Play can be pressed again to retry. Firmware selection then happens as it does today. The player's Firmware, Save & resume, Controls, Preferences and Report sections stay collapsed below its screen.

### 4.2 Placement

- **The four curriculum machines** (`SystemOverview.astro`): the stage is the hero's right column, beside the title, lead and route links. Beside the route links, the hero's left column also carries a compact link per track ("Sinclair BASIC →", "Z80 assembly →"), so route choice stays above the fold beside a 2× poster rather than only in the "Choose a language" cards further down the page.
- **The 26 directory machines** (`systems/[platform].astro`): the stage sits in the hero beside the title and status line. Playing is the main thing these pages offer, so it leads.
- Below 1024px the stage stacks under the header text. At phone width the poster renders at 1× and scrolls inside its own frame if it is wider than the viewport, per the House UI rule.

### 4.3 Posters

30 families: 4 game posters, 19 boot posters and 7 demo posters.

| Kind | Families | Source |
|---|---|---|
| Game frame | ZX Spectrum, C64, Amiga, NES | An existing lesson capture from the family's track, as the House UI spec chooses. The Amiga poster is the 640px Signal capture (`assembly/signal/unit-13/screenshot.png`), with an explicit `ceiling: 1` since it is already a 2× frame |
| Boot screen | The other 19 firmware machines, including the ColecoVision title screen and the Sord M5 | The machine switched on, running its own firmware in our emulator, captured by `scripts/capture-posters.mjs`. The Sord M5 shows nothing without a cartridge, so its boot poster carries a caption explaining the blank screen ("The Sord M5 switched on with no cartridge: it shows nothing until one is inserted.") |
| Demo frame | Atari 2600, 5200, 7800, Game Boy, Game Gear, Master System and SG-1000 | The project-owned demo cartridge from the player's allowlist |

Captions say plainly what a poster is. A demo frame says it is a test cartridge we wrote ("A test cartridge we wrote, running on the Game Gear"), not a game. No family borrows another family's image. Until a family's poster exists, its stage shows an empty frame at the machine's aspect ratio in `--h-ground-base`, with the same button and note.

Known poster work, 2026-09-25: a prototype run captured all 30 families through the shipped worker. The VIC-20 poster was captured after emu198x/emu198x#1537 fixed an off-centre NTSC frame that clipped its 22nd column (emu198x/emu198x#1536). The Atari 800XL needs about 1,000 frames to reach READY. The Aquarius BIOS blanks its screen in cycles, so its poster must be a fixed frame in a title phase (frame 200).

## 5. Lessons

### 5.1 The run strip

A **run strip** (`RunIt.astro`) sits where the unit builds and runs its program, normally the "Assemble and run" section. It replaces `LessonPlayer.astro` and the end-of-page `<details>`.

- A 4px machine-colour rule on top.
- The unit's expected-result capture at 1×, the same capture the lesson already shows where it has one.
- Beside or above it (section 5.3): a short heading, "Run it here"; one sentence on what to watch, from a prop; a mono row naming the program and machine model; the **Run it here** button in house ink; the download link for the built files.
- An italic caption: "What you should see: …".

It appears only when the lesson build staged a runnable file, which keeps `LessonPlayer`'s existing rule. Authors place `<RunIt />` explicitly in the MDX. If a unit has staged files but no `<RunIt />`, `UnitLayout` renders one at the end of the unit, so coverage matches today while units migrate.

The inline `AssembleAndRun` sandboxes (Meet Assembly and similar) are editors, not players. They are unchanged, and so is the `inlinePlayer` frontmatter opt-out.

### 5.2 The panel

**Run it here** opens the lesson's single **run panel** (`RunPanel`, one per page):

- **Docked:** at widths where it fits (section 5.3), the panel takes the lesson's right column and sticks as the reader scrolls, as a labelled region (`role="region"`) of the page. The prose narrows, and the contents list steps aside until the panel closes.
- **Overlay:** where it does not fit, the panel slides over the prose from the right, below 768px fullscreen. Overlay and fullscreen both start below the sticky nav and the breadcrumb bar rather than under them, and both are dialogs (`role="dialog"`, `aria-modal="true"`), since they cover the prose. While either is open, the page content it covers is inert; the nav and breadcrumb bar stay usable.
- **Contents:** a title line (program name; machine and model), a **Close** button, the player's screen at 1×, the player's own controls, and its collapsed sections. An empty inspector area is reserved under the controls for project 2, so adding the inspector later does not reshuffle the layout.
- **Behaviour:**
  - One panel per page. A second **Run it here** replaces the running program rather than opening another panel.
  - Closing pauses the machine. Reopening the same program reuses the paused element rather than rebooting it; the player has no public resume of its own to call from the page, so the reader resumes playback with the player's own Resume button once the panel is visible again.
  - Firmware is requested in the panel, only after **Run it here**. Spectrum units that already use permissioned ROMs keep them.
  - Keyboard: Esc closes the panel when the emulator does not have focus. Tab leaves the screen, as the player already supports. Focus returns to the button that opened the panel.
  - The slide uses the family's single motion rule and is instant under `prefers-reduced-motion`.
  - The player script loads the same way as on system pages (section 4.1): a failed or timed-out load shows a status message in the panel, and pressing **Run it here** again retries.

### 5.3 Wide machines

One measured rule, not a per-machine table:

- **Strip:** a capture up to 416px wide at 1× (Spectrum, C64, NES, Game Boy and most 8-bit machines) sits **beside** the text. Anything wider (the Amiga's lesson frame at 768px at 1×; the CPC at 832px; the BBC Micro in mode 0 at 640px) sits **above** the text at the prose column's width.
- **Panel:** the panel is as wide as the machine's screen at 1×. The rule is measured, not a per-machine table: it docks only if the prose keeps at least 600px, about 65 characters of Literata at body size, and otherwise overlays, even on a large screen. An Amiga panel overlays at 1440px and docks from a viewport of about 1,560px. A C64 panel (416px) docks from about 1,120px.
- Captures never scale by a fraction.

## 6. Components and files

| File | Change |
|---|---|
| `src/components/PixelFrame.astro` | **New, shared with the House UI spec.** Renders one capture at the largest integer scale that fits, up to a ceiling, reading the native size from the PNG header at build time with `node:fs`. Optional machine-colour rule and italic caption. No client script. |
| `src/components/PlayerStage.astro` | **New.** The system-page stage (section 4). Resolves the catalogue entry, poster and spec row; renders the poster through `PixelFrame`; on Play, loads `/emulators/embed.js` and swaps in `<emu198x-player>` at the same size. |
| `src/components/RunIt.astro` | **New.** The run strip (section 5.1). Replaces `LessonPlayer.astro`, keeping its staged-file discovery. |
| `src/components/RunPanel.astro` | **New.** One per lesson page: a small custom element that owns the single player, chooses docked or overlay by measurement (section 5.3), and handles open, replace, close, pause and focus. |
| `src/components/SystemOverview.astro`, `src/pages/systems/[platform].astro` | Replace `BrowserPlayer` with `PlayerStage` in the hero. |
| `src/layouts/UnitLayout.astro` | Host `RunPanel`; render the fallback `RunIt` at the end of a unit that has staged files and no `<RunIt />`; let the docked panel take the right column. |
| `src/components/BrowserPlayer.astro`, `src/components/LessonPlayer.astro` | Removed once nothing uses them. |
| `src/data/player-posters.yaml` | **New.** For each family: poster file, kind (game, boot or demo), caption, and for captured posters the variant and frame number. |
| `public/images/systems/<slug>/poster.png` | **New.** One poster per family; the four curriculum machines may point at existing lesson captures instead. |
| `scripts/capture-posters.mjs` | **New.** Boots each family's variant through the site's own built worker (`public/emulators/worker.js`), runs to the manifest's fixed frame and writes the PNG. Firmware comes from a local ROM folder given by an environment variable; no ROM paths or bytes enter the repository or the output. |

## 7. Reconciliation with the House UI preview spec

This spec takes precedence where the two overlap, and the House UI spec is amended to match in the same pull request as the implementation:

- **Spectrum hero (House UI §5.2):** its hero frame becomes `PlayerStage`. Direction C replaces its "2px border in the machine's colour and `--h-lift-2`". Its reserved photograph slot is unaffected.
- **`PixelFrame` (House UI §6):** built by this work. The House UI spec uses it as written.
- **Lesson right column (House UI §5.3):** the House UI spec widens `UnitLayout`'s right column to 352px for margin figures; the run panel docks into the same column. While the panel is docked, margin figures render inline, as they already do below 1200px. The right column holds one of the contents list, margin figures or the running machine.

## 8. Verification

All from the website repo. Report skipped or blocked checks accurately.

1. `npm run build` and the unit tests pass. New unit tests cover: the integer-scale choice; the docked-or-overlay rule; no staged file, no strip; every catalogue family has a `player-posters.yaml` entry whose file exists. The build gate `node scripts/check-browser-player.mjs --built` checks every system stage and every lesson's run strip, and fails outright if it finds no strips to check, rather than passing vacuously.
2. The Playwright suite `tests/player-integration.spec.ts` runs under the default dev server: `npx playwright test tests/player-integration.spec.ts`. It is not part of CI; the build gate in item 1 is. Screenshots at 390, 1024, 1440 and 1920px, both themes, of: the Spectrum system page, the VIC-20 system page, the C64 Starfield unit 3 lesson and the Amiga Meet the Machine unit 2 lesson. No published Spectrum lesson has a run strip yet: only Meet the Machine unit 1 stages a program, and it keeps its permissioned `<Emulator>` (`inlinePlayer: true`). Look at them. Measure rendered capture widths against native widths (integer multiples only) and confirm no horizontal page scroll at 390px.
3. Behaviour, in a browser:
   - Play swaps in the player at the same size.
   - No request for `embed.js` happens before Play.
   - The panel docks and overlays at the measured widths.
   - Esc, Close and focus return work, and Tab leaves the screen.
   - A second Run it here replaces the running program.
   - Closing pauses the machine, and reopening the same program resumes it once the reader presses the player's own Resume button.
4. `npm run test:a11y` covers those routes with no new serious or critical findings; a keyboard walk-through; `prefers-reduced-motion: reduce` shows no motion.
5. `scripts/capture-posters.mjs` reproduces every captured poster from its manifest. Each poster is viewed before use, and none borrows another family's image.

## 9. Project 2: the inspector (separate spec)

Steve wants the panel to show named registers, memory and anything else relevant to a unit. That needs three things that do not exist yet:

1. **A register and memory interface in the shared player**, per family. The lesson sandbox can read memory today only through its own Spectrum runner. This is Emu198x work, designed with that session.
2. **Label names from the lesson build**: Asm198x writes Debug198x sidecars, which Emu198x reads. The lesson build would stage the sidecar beside the program.
3. **A per-unit declaration of what to show**, following the sandbox's `inspectSymbols` idea, for example `watch: { registers: [A, B], memory: [{ label: score, bytes: 2 }] }` in the unit frontmatter.

The inspector gets its own spec. This spec only reserves its place in the panel.

## 10. Open questions

- **Spectrum posters on the system page** use a game frame, while the Vault entry (House UI §5.4) uses the boot screen. Both are ours; the House UI review can confirm the split.
- **Deferred — memory, display and sound in the spec row.** Section 4.1 originally added memory, display and sound to the spec row for the four curriculum machines. Their system files hold no sourced values for these yet, so the row shows released, CPU and model until that data exists.
- **Deviation — panel title has no running/paused state.** Section 5.2 originally called for a running/paused state in the panel's title line. The shared player exposes no state API to read that from, so the built panel's title line carries only the program name, machine and model. Adding it needs an Emu198x change, tracked as follow-up work rather than blocking this rollout.
- **Deviation — the run strip links built files only.** Section 5.1 originally called for download links to both the built files and the source. Lesson sources are not staged under `public/` (only built output is), so there is nothing on the site for a source link to point at yet. Staging sources is a separate decision about what the site publishes, not settled here.
