# Setup journey

Status: design direction accepted on 7 October 2026. Browser first, with local
tools introduced only when needed. Implemented locally; independent design and documentation reviews complete.

## Job and outcome

Help a reader prepare for the lesson they want to follow. Start Here remains
the learning-route chooser. Setup answers “What do I need for this lesson?”
Success is running the lesson's small example, changing it and saving the work,
not merely installing a tool.

Visitor mode: Read, with a short preparation task.

## Direction

- Lead with starting in the browser wherever the actual lesson supports it.
  Link directly to working lesson entry points. Determine availability from the
  shipped lesson and player integration, not from machine or CPU support alone.
- Follow with working on your own computer: choose the machine and language,
  then see the relevant tools and instructions for the reader's operating system.
  Use ordinary links and visible sections rather than a compulsory wizard.
- Make Asm198x the primary assembly path at the point of installation and use.
  BASIC, AMOS and Blitz instructions remain distinct; they must not imply an
  assembler is required. For saved Spectrum and C64 BASIC listings, make
  Build198x the primary tokenisation path: `.bas` to `.tap` or `.prg`, respectively.
  Typing BASIC directly in the emulator does not require a local build tool.
  Keep AMOS and Blitz separate from this two-machine tokenisation capability.
- Keep the deprecated Docker containers out of the learner setup path. Their
  technical overhead conflicts with the intended simple start; introduce only
  the native tools needed for the chosen workflow.
- Give each machine guide the same sequence: browser availability, local
  requirements, install, run a real example, change/save it, return to the lesson.
  Put reference assemblers in clearly labelled alternative guides with a link
  back to the recommended path. Preserve their URLs.
- Use the agreed manual design: Nebula headings, shared type scale, readable
  text measure, machine spot colour, useful mobile contents and precise steps.
  Use real expected program output where it helps verify success, subject to
  the family's native-size, whole-image and caption rules. Keep component previews.

## Evidence and constraints

All four alternative guides bind OS tabs only on DOMContentLoaded. On 7 October,
eight browser cases (four machines, desktop and Pixel 7) passed direct-visit
Windows selection and failed selection after following the link from /setup/.
The built site was served through Astro preview at port 4401.

Failure verbatim:

```text
Error: Windows selection viaLink=true
expect(locator).toHaveAttribute(expected) failed
Expected: "true"
Received: "false"
```

Command: `PLAYWRIGHT_PORT=4401 npx playwright test tests/site-review-evidence.spec.ts --grep 'review setup tabs direct and followed' --workers=1 --output=/tmp/198x-setup-investigation`

The setup index hides its contents below 1100px. Its current structure mixes
learning-route selection with installation and workflow explanation. Spectrum's
Getting Started already explains a browser-first route; C64 opens with required
local tools. All four primary guides already mention Asm198x, so this is about
clarity and consistency, not introducing an absent project.

Local emulator recommendations differ between guides. Verify the actual learner
workflow before replacing any tool: an authoring/capture migration alone does
not demonstrate a complete reader-facing installation path. Do not invent download
availability, installer commands or cross-platform parity.

Build198x's README and active `decisions/demand-gate-basic.md` confirm the saved
BASIC listing path. The documented commands are:

```sh
build198x basic hello.bas --machine sinclair-zx-spectrum -o hello.tap
build198x basic hello.bas --machine commodore-c64 -o hello.prg
```

Note the CLI machine identifier `commodore-c64`, distinct from the website route
`commodore-64`. These commands were source-checked for this brief, not executed.
Update the current primary guides' `zmakebas` and `petcat` recommendations to the
verified Build198x workflow during implementation; preserve alternatives only
where deliberately useful. Build198x also lints listings before emitting output,
so the worked examples must pass the actual build, not just look plausible.

Binding sources: umbrella PRINCIPLES.md, DESIGN.md, decisions/family-visual-identity.md,
decisions/code198x-dev-tooling-migration.md, and Code198x/.github/AGENTS.md.
No new dependencies or architecture are proposed.

## Implementation sequence

1. Repair the known tab failure in
   `src/pages/setup/{commodore-64,commodore-amiga,sinclair-zx-spectrum,nintendo-entertainment-system}/native.astro`.
   Use navigation-safe initialisation and correctly associated keyboard-operable
   tabs. Add a focused `tests/setup.spec.ts`: direct and client navigation,
   repeated navigation, all OS choices, arrow/Home/End keys, and visible panels.
   Verify desktop and mobile. Keep this one self-contained change.
2. Restructure `src/pages/setup/index.astro` and the four
   `src/content/curriculum/<machine>/getting-started.mdx` guides. Include existing
   Amiga AMOS and Blitz setup routes where appropriate. Audit each proposed
   browser link and installation command before publishing it. Present a
   representative machine guide and reusable parts in the existing development
   preview catalogue before expanding the design to every guide.
3. Bring the four alternative guides into the manual layout. Label their tool
   role clearly, link back to Asm198x instructions, retain working commands and
   routes, and use accessible mobile contents. Inspect desktop and narrow-screen
   states together; correct the resulting issues in one batch.
4. Verify links, browser availability claims, tab behaviour, keyboard access,
   text measures, screenshots and caption bounds. Run the appropriate repository
   checks, independent design finish review and documentation handoff before
   requesting rollout. A command merely printed on the page is not an executed
   installation test; report the distinction.

Out of scope: a new Start Here flow, adding emulator capabilities, replacing
the approved homepage or lesson editor, Timeline design and TrackGames screenshot
layout. Those remain separate tasks.

## Implementation details

The browser-first destination now includes editing, assembling, BASIC tokenisation
and media preparation where integrated, not just emulation. The selected Setup
links describe current shipped interactions; missing integrations remain explicit
follow-ups, not promises on the public page. Docker is excluded.

Shared files: `src/layouts/SetupLayout.astro`, `src/styles/setup.css`,
`src/components/SetupBrowserStarts.astro`, `src/components/SetupToolInstall.astro`,
`src/scripts/setup-tabs.ts`; `src/layouts/GettingStartedLayout.astro` delegates to
the shared manual frame. Preview: `/catalogue/setup/` (development only).

The tab repair passed 8 desktop/mobile browser checks and the production build
before the guide redesign began. This includes direct and repeated client navigation
and Arrow/Home/End keyboard behaviour.

Release lookup found GitHub's Build198x latest link points to the separate
`build198x-adf` package. Full CLI downloads are linked to verified
`build198x-v0.2.9` explicitly. The macOS arm64 archive's SHA-256 matched its
published checksum and its executable reports `build198x 0.2.9`.

## Verification so far

- `npm run check`: 174 unit tests passed, 9 skipped (183 total); content and
  browser player/assembler checks passed.
- All seven documented native build commands succeeded against real lesson
  sources using Asm198x 0.0.58 and the checksum-verified Build198x 0.2.9 macOS
  arm64 release. C64 and NES assembly outputs match the shipped binaries exactly.
- Browser entry journeys reach running Spectrum BASIC, Spectrum assembly and
  NES assembly programs. OS selectors pass direct, repeated client navigation
  and keyboard checks, including no-JavaScript access to all OS instructions.
- The first layout check found missing listing accessibility initialisation and
  a legacy TOC active colour below 4.5:1. The layout now initialises existing
  listing behaviour and passes the derived spot text ink to its TOC.
- Development preview tested at desktop/390px; four representative routes have
  no page overflow at 320px. No new shipping raster assets were created.
- The development server retained stale modules after edits; it was restarted
  before final capture. The initial C64 tab and repeated-listing failures from
  the stale process are retained in local logs, not counted as a passing run.

Known boundary: native Windows/Linux installations and launching each third-party
emulator were not executed. Alternative tool commands were retained, not newly
certified. Some older lessons still describe legacy build commands; this Setup
change does not silently rewrite that curriculum.

Follow-up WASM integration scope: extend edit/build/export beyond the currently
integrated Spectrum BASIC/assembly and NES opening; investigate shared Build198x
BASIC/media conversion for lesson editors. Treat machine emulation, supplied
program playback and editable rebuilding as distinct verified capabilities.

## Final review and production checks

The independent finish reviewer scored all four requested fixes resolved
(`finish-verdict.md`, disposition `ship` at that scope). A separate documentation
review preserved the incumbent DESIGN.md and design.json. The harness had no
named specialist agent types; fresh independent agents used Impeccable's fallback
role instructions. No new ignores or design-system exceptions were added.

Final source changes also scope the shared contents initialiser to its own
`.toc[data-selector]` nodes. Navigating Setup to a lesson reproduced
`TypeError: Cannot set properties of null (setting 'textContent')`: the previous
selector also matched LessonContents, which uses different markup. The new
Setup-to-lesson regression asserts there are no page errors as all three browser
examples reach their running state.

- Production build: 2,443 pages; Pagefind: 2,445 indexed pages.
- Built-player check: 30 system stages, all browser modules, 90 runnable lesson pages.
- Local links: 221,092 references, zero errors; 27,926 existing-pattern exclusions.
- Production browser batch: 218 passed; the two native-image checks failed with
  `TypeError: The "paths[0]" argument must be of type string. Received undefined`.
  The invocation omitted CODE_SAMPLES_PATH and PLAY198X_WASM_PATH set by the
  release script; both checks passed on rerun with that environment (4.2s). All 220 browser
  checks therefore passed across the batch and corrected-environment rerun.
- All 14 Setup checks passed on the final production build, including the
  complete browser journey without JavaScript errors, all OS controls after
  navigation, keyboard operation, mobile contents, no-JavaScript instructions
  and accessibility checks across the twelve guide routes.

Preview at `http://127.0.0.1:4400/setup/`; component specimens at
`http://127.0.0.1:4400/catalogue/setup/`. Nothing from this change has been deployed.

## Homebrew clarification

The published `build198x/homebrew-tap` already contains `Formula/build198x.rb`
for 0.2.9, covering Apple Silicon/Intel macOS and Intel Linux. The release
configuration already publishes it through the reusable Homebrew workflow.
The macOS installation component now offers `brew install build198x/tap/build198x`
alongside Asm198x's existing Homebrew path. The explicit CLI release link remains
the archive fallback. Formula and remote history were verified; no tap or package
was installed into the user's Homebrew environment.

## Published package follow-through, 2026-10-07

Updated the approved Setup implementation for the released Homebrew packages.
Both Asm198x and Build198x now offer Homebrew in their macOS and Linux tabs,
with ARM64 and x86-64 archive guidance. The Build198x download link selects
0.2.10's full CLI explicitly. Spectrum guides include the per-machine Emu198x
formula and distinguish Homebrew commands from extracted archive paths.

The browser-first route and previously verified local emulator choices remain.
Verification after these updates: 183 unit tests, content and browser-module
checks, production build, all 14 Setup browser checks on the built site, and
221,093 offline link checks with zero errors. Chromium required execution
outside the macOS sandbox. A concurrent build briefly exhausted temporary disk
space; after it finished, the complete browser suite passed with two workers.

Publication is covered by the family Homebrew site rollout plan.
