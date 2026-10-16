# Assessment B — implementation and browser evidence

Independent reviewer: `/root/site_implementation_review`. Completed 2026-10-06 against the complete production build served at `http://127.0.0.1:4396`. Assessment A was not read or received. Findings were held until the parent confirmed A had finished.

## Scope and method

Read umbrella `PRINCIPLES.md`, `PRODUCT.md`, `DESIGN.md`, `decisions/family-visual-identity.md`, `decisions/code198x-dev-tooling-migration.md`, Code198x org context, relevant page/component/style source and the Pattern Library specification. The existing server and build were preserved. No production source, dependencies or deployment changed.

The detector ran once with `detect --json src/pages src/layouts` (72 Astro markup files in these directories, below the 500-file limit). Exit 2 signifies findings. Raw JSON is `.impeccable/review/site-review/detector.json`. No site-local `.impeccable/critique/ignore.md` was present.

Native browser: a new independent Chrome tab inspected Commando, Pattern Library, the 1980s timeline and C64 native setup. `iab` was unavailable. Chrome worked. Its documented evaluate surface is read-only: no mutable injection mechanism was available, so no live overlay server was started, no overlay was injected, and no user-visible detector overlay is claimed. The user-authorised repository Playwright suite supplied reproducible measurements and screenshots, rather than replacing an available native browser for initial visual inspection.

`tests/site-review-evidence.spec.ts` covers 38 representative routes in both installed desktop Chromium (1440 × 900) and the existing Pixel 7 profile. It records image dimensions, paragraph widths, document overflow, local fragment targets, client exceptions and WCAG A/AA results. Images are explicitly decoded; animations/transitions are stopped before accessibility measurements. No accessibility debt baseline is applied. Six of the key routes also received 320px, 768px and 1280px bounds checks.

This is template sampling, not a browser audit of all 2,443 generated pages. The parent owns complete static route/link coverage. No external software was installed or command copied from a setup page executed.

### Route coverage

- Homepage, Start Here, Systems, Systems by region, Spectrum system, BASIC route, Meet BASIC overview and first lesson.
- Vault index, games/hardware category lists, Commando, SID chip, Screen Memory and Spectrum articles.
- Pattern index, platform/category/difficulty lists and C64 Hardware Sprites detail.
- Timeline index, 1980s and 1920s.
- Setup index, ROM guide, all four native assembler guides and Spectrum Getting Started.
- Foundations, Craft, From the Metal, Field Notes, Updates, Family, About and 404.

### Verified positive results

All 76 settled route/viewport observations had exactly one h1, no document-width overflow, no broken decoded main-content images, no missing local fragment targets, no client exceptions and no automated WCAG A/AA violations. The 404 page correctly returned 404; the other tested pages returned 200. This is automated sample evidence, not a claim of complete accessibility.

All 18 additional bounds observations (six routes × 320/768/1280px) fit their viewport. These include both Vault article types, Pattern detail, the 1980s timeline, Setup index and C64 native setup.

Vault subject disclosure on mobile and the featured-story link worked. The 1985 timeline anchor worked. Pattern category-to-detail navigation worked on desktop and mobile. The final discovery-only run passed both tests (`discovery.log`).

The existing Asm198x link suite passed all six desktop/mobile tests, including live HEAD requests for every mapped instruction page. See `playwright.log`.

## Findings

### P1 — Setup tabs stop working when the reader follows the site's own link

All four native setup pages select Windows correctly on a direct load. When reached by clicking “Alternative assembler setup” on `/setup/`, clicking Windows leaves `aria-selected="false"` and the active panel remains `macos`. Reproduced for C64, Amiga, Spectrum and NES on desktop and Pixel 7: eight failing route/device cases. A refresh is the workaround.

The source explanation is concrete: each native guide attaches its tab listeners inside `DOMContentLoaded`. Astro's client navigation inserts the next page after that one-time event has already fired. The direct-load pass and followed-link failure distinguish this from a styling or click-target failure.

Source: `src/pages/setup/commodore-64/native.astro:194`, Amiga `:198`, Spectrum `:189`, NES `:187`. Fix the page lifecycle binding using the site's existing Astro navigation convention and verify both entry paths. Also give the tab widget its expected keyboard/association semantics when repairing it; source currently supplies click listeners without arrow-key handling or panel associations.

Evidence: `responsive-tabs.log`, `{desktop,mobile}-tabs-<platform>.json` and corresponding `-false.png`/`-true.png` screenshots. Verbatim assertion: `Error: Windows selection viaLink=true` / `Expected string: "true"` / `Received string: "false"`. All eight cases were rerun with awaited assertions and still failed.

### P1 — Global search cannot reach a search field in this production build

Native Chrome and both Playwright projects show the dialog's fallback: “Search is only available in production builds. Run npm run build to enable search.” The build is already production and contains Pagefind assets. The first query cannot be entered because `.pagefind-ui__search-input` never mounts. SID, no-results and Escape assertions after that point were therefore not reached; they must not be reported as tested successes.

Source: `src/components/Search.astro:147` dynamically imports the UI script, then constructs `new pagefind.PagefindUI(...)`. The emitted `dist/pagefind/pagefind-ui.js` is an IIFE ending in `window.PagefindUI=mt`, not an ES module exporting that constructor. The import can load while the namespace lookup fails. The catch then misdiagnoses this integration failure as a missing production build and exposes an internal build command to the reader.

Fix the constructor loading contract and replace the public fallback with a usable explanation/recovery action. Test initial entry, keyboard opening, results, no-results, dismiss and navigation/reopen. The parent independently owns expanded search coverage, including Asm198x and Vault local search.

Evidence: `playwright.log`; verbatim failure: `Error: locator.fill: Test timeout of 30000ms exceeded.` / `- waiting for locator('.pagefind-ui__search-input')`.

### P2 — Reading measures diverge substantially across detail templates

At 1440px viewport, Commando/Screen Memory body paragraphs are about 793px at 20px; the article itself is bounded to 840px. C64 Hardware Sprites paragraphs are 1060px at 20px. The C64 native guide has a 1382px-wide note at 14px and a 1350px-wide ROM paragraph at 20px. The 1980s timeline uses 878px-wide excerpt blocks at 14px. These widths do not overflow, but they make the reading rhythm inconsistent and small timeline/native copy especially sparse and stretched.

`src/styles/editorial.css:119` explicitly expands Pattern detail `.content` to 1060px, while native setup's container loses its previous bound in the broad editorial rules. The site's shared reading token is 65ch. Keep browsing grids broad and constrain their paragraph/list measure independently; allow genuinely wide code/tables to have their own treatment. Vault article measure is a useful existing reference.

Evidence: `desktop-_patterns_commodore-64_assembly_rendering_hardware-sprites_.json`, `desktop-_setup_commodore-64_native_.json`, `desktop-_timeline_1980s_.json`, and matching viewport screenshots. This is a readability judgement supported by measurement; the widths alone are not an accessibility failure.

### P2 — Asm198x exists and is named, but the alternative setup path strands its recommendation

The site does already expose Asm198x:

- All four launch assembly landing pages name it. Spectrum's landing explains the browser lessons include Asm198x.
- All four Getting Started guides supply Asm198x installation/build commands. Spectrum explicitly calls it recommended. C64 uses `--dialect acme --prg`; NES `--dialect ca65`; Amiga `--dialect vasm --exe` followed by Build198x; Spectrum `--dialect pasmo --cpu z80 --tapbas`.
- `/setup/` explains its assembler role; `/family/asm198x` describes the toolchain; system stubs link mapped CPU instruction references.
- The existing link suite confirms every mapped live instruction endpoint resolves, and confirms a card appears only for mapped CPUs.

These facts should survive any redesign. Local Asm198x README and CLI dispatch confirm the named dialect/output flag families exist. The binding migration record says all four launch builds cut over to family tooling by 2026-07-10. I did not execute package installation or validate every lesson build; the link tests do not establish either.

The discoverability problem is narrower: `/setup/` offers “Getting started” beside “Alternative assembler setup” without naming the primary tool there. All four alternative pages say Asm198x builds the same bytes and installs in one command, but that sentence is plain text. They proceed directly into ACME/Pasmo/vasm/ca65 instructions without a direct Asm198x installation or recommended-setup link in that introduction. A reader arriving from search or a bookmark can miss the existing simpler route.

Name Asm198x on the primary setup choice and link the alternative-page introduction directly to the relevant Getting Started/Asm198x installation instructions. Keep the reference assemblers as explicitly labelled alternatives; do not invent a new setup system. This is a navigation/copy repair to an existing working direction, not a claim Asm198x is absent.

Source: `src/pages/setup/index.astro:56`, native guide introductions around lines 38–42, `src/content/curriculum/<platform>/getting-started.mdx`, four assembly index pages, `tests/asm198x-links.spec.ts`.

### P2 — Spectrum BASIC screenshots are downsampled despite a wide viewport

All 16 captures on `/systems/sinclair-zx-spectrum/basic/` have decoded native width 352px but render at 98px in the 1440px desktop observation. They are proportionally contained, not cropped: do not describe this as cropping. The family visual rule permits downscaling only when the viewport is narrower than the native capture, so this is a specific remaining compliance gap.

The capture-width custom property is present, but scoped `.house .gthumb` rules in `src/components/TrackGames.astro:178` still prescribe 100px with a one-pixel border; its content image becomes 98px. The broad rollout aims for native dimensions but does not win this case. Reflow these rows around native-size captures and verify both the final image dimensions and caption bounds.

Evidence: `desktop-_systems_sinclair-zx-spectrum_basic_.json` contains all 16 actual/native width pairs. Hardware photographs are excluded from this finding; their large natural dimensions do not make responsive photographic scaling a violation. Hidden zero-size images are also excluded.

### P2/P3 — Pattern browsing retains category colour outside its permitted scope

The Pattern index shows several machine-colour bars simultaneously and separate green/yellow/red difficulty icons. Native Chrome confirms these are visible, not dead styles. This conflicts with the one-spot rule for page furniture and the explicit rule that labels, not new colours, distinguish chips/categories. The Vault's five labelled category palettes and the Timeline's category-data colours are sanctioned exceptions; neither exception extends to Pattern browsing. The Amiga platform bar also uses the legacy orange rather than the current curated Workbench blue.

Use the page's spot ink for browse furniture, retaining machine/level names and meaningful icons. On a machine-specific detail, resolve the contextual machine ink from the existing curated source. Do not remove the approved cream ground, Vault category colours or real machine pixel colours.

Source: `src/pages/patterns/index.astro:69` and skill-level `--pc`/icon usage; platform/difficulty data supplies the colours. This is consistency/rule drift, not proof that the product is generic or that its content lacks value.

### Smaller observations

- The Setup index hides its whole sidebar below 1100px, so the reusable collapsible ToC never appears there on mobile. This was initially a test assumption failure, not a broken visible control. Long-page navigation would benefit from retaining the mobile disclosure.
- Native setup tabs show selected state through accent text/underline rather than the agreed inverse-video treatment. Treat that with the tab repair rather than a separate redesign.
- Pattern detail has a long breadcrumb, masthead, title, summary, three metadata chips and three tags before its Overview on mobile. It fits, but the repeated scaffolding delays the reusable technique. Consider consolidating metadata when polishing this section.
- Commando's desktop article is bounded and has useful local navigation, category and provenance. The first-view hierarchy is much clearer than raw detector warnings imply.

## Detector findings and interpretation

The raw scan returned 16 findings: 12 `side-tab` warnings and four `codex-grid-background` advisories. These are source-pattern matches, not 16 verified defects.

| Rule | Source location | Assessment |
| --- | --- | --- |
| side-tab | `src/pages/family/build198x.astro:103` | Border match; low-priority styling evidence, no demonstrated usability defect. |
| side-tab | `src/pages/patterns/[...slug].astro:170` | Code-block border, not a generic card; do not automatically remove a useful listing delimiter. |
| side-tab | `src/pages/patterns/category/[slug].astro:162` | Pattern-card stripe. Review with actual colour and reading hierarchy, not blanket anti-border advice. |
| side-tab | `src/pages/patterns/difficulty/[slug].astro:168` | Same pattern-card stripe. |
| side-tab | `src/pages/patterns/platform/[slug].astro:160` | Same pattern-card stripe. |
| side-tab | `src/pages/press.astro:132` | Neutral quotation border; semantic delimiter, not evidence of generated design. |
| codex-grid-background | `src/pages/setup/commodore-64/native.astro:304` | Hidden `.hero-grid` by `editorial.css`; false positive for the rendered page. |
| codex-grid-background | `src/pages/setup/commodore-amiga/native.astro:306` | Same hidden legacy treatment. |
| codex-grid-background | `src/pages/setup/nintendo-entertainment-system/native.astro:295` | Same hidden legacy treatment. |
| codex-grid-background | `src/pages/setup/sinclair-zx-spectrum/native.astro:297` | Same hidden legacy treatment. |
| side-tab | `src/pages/systems/nintendo-entertainment-system/assembly/index.astro:114` | Entry callout border; no demonstrated failure from the border itself. |
| side-tab | `src/pages/systems/sinclair-zx-spectrum/assembly/index.astro:130` | Same entry callout treatment. |
| side-tab | `src/pages/timeline/[decade].astro:335` | Category encoding in the timeline, expressly allowed by the visual decision. Do not remove just because the scanner dislikes stripes. |
| side-tab | `src/pages/vault/[...slug].astro:618` | Blockquote treatment; semantic delimiter. |
| side-tab | `src/pages/vault/[...slug].astro:634` | Code-block treatment; semantic delimiter. |
| side-tab | `src/pages/vault/[...slug].astro:452` | Inline Table of Contents border; low-priority style match. |

The detector does not discover the most important real failures here: broken search initialization and page-lifecycle tab binding. Browser interaction is essential.

## Evidence integrity and limitations

The first exploratory pass reported images before decode completed and one contrast value during a transition. These did not reproduce after explicit decoding and animation freeze; they are excluded. The initial test also incorrectly required HTTP 200 from `/404/` and expected a mobile setup sidebar which source intentionally hides. Those expectations were corrected, not counted as site defects.

Stable results are in per-route JSON files, `playwright.log` (76 geometry/axe passes plus Asm tests, with search/tab and one subsequently corrected ToC expectation failure), `responsive-tabs.log` (eight genuine tab failures, three explicit-width tests pass, three duplicate mobile matrix cases intentionally skipped), and `discovery.log` (two passes after correcting the sidebar assumption). `playwright-initial.log` is retained to show the measurement history. The tests demonstrably fail on user-visible broken interactions; they are not always-green collectors.

No evidence establishes when these defects were introduced. Existing uncommitted Vault/rollout work was present at assessment start, and there was no before/after comparison. Call these current findings, not attributed regressions.

The evidence folder is `.impeccable/review/site-review/`. It contains durable JSON and PNG evidence; it is not a temporary overlay directory. No critique-only server was started, so none needs stopping. The pre-existing production preview remains running as requested. No screenshot overlays or mutable injection succeeded or are claimed. No unrelated cleanup, dependency change or production UI edit was performed.
