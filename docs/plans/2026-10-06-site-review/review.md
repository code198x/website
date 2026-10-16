Method: dual-agent (A: `/root/site_design_review` · B: `/root/site_implementation_review`).

# Code198x site review — 6 October 2026

The accepted identity works. The site needs consistent reading layouts and stronger routes between learning, reusable techniques, historical context and tools. Two functional failures take priority: global search does not initialise, and the four alternative setup guides lose their OS-tab handlers after client navigation. No production UI was changed during this review.

## Coverage

The complete build inventory contains 2,443 Astro pages, 1,264 redirects, three embedded experiment documents, one standalone emulator and one auxiliary emulator template. All content pages map to verified source owners; there are 63 Astro page-source files, including unbuilt development routes. `routes.csv`, `source-coverage.csv` and `inventory.json` account for the whole site.

Visual assessment inspected 21 desktop openings and two reliable phone openings. Independent browser checks covered 38 representative routes on desktop and Pixel 7: 76 settled geometry/accessibility observations. Six important routes also received 320, 768 and 1280px checks. This is comprehensive route accounting and representative template review, not a claim that every article's prose, every mobile state or every bespoke page was personally inspected.

The design assessment details its remaining visual gaps: individual editorial articles, teaching, press, colophon, contribution, some system facets, family explainers and experiments. These remain explicit items for implementation review batches. Existing approved homepage and lesson work should be retained, with regression checks when shared rules change.

## Design health

These are synthesised design judgements, not a WCAG certification. A's independent visual score was 25/40; the reproducible search and navigation failures reduce the combined score to 19/40. All ten heuristics apply to this learning/reference site.

| Heuristic | Score / 4 | Principal evidence |
| --- | ---: | --- |
| Visibility of system status | 2 | Search reports the wrong cause; lesson and page position otherwise clear. |
| Match with the real world | 3 | Concrete learning questions work; “Native setup” obscures the tool choice. |
| User control and freedom | 2 | Breadcrumbs work; setup tabs fail after normal navigation. |
| Consistency and standards | 2 | Recognisable identity, inconsistent page frames and reading measures. |
| Error prevention | 1 | A Windows choice can leave macOS instructions selected. |
| Recognition rather than recall | 2 | Readers must reconstruct the relationship between resources and tools. |
| Flexibility and efficiency | 1 | Global lookup is unavailable; taxonomy leads several discovery routes. |
| Aesthetic and minimalist design | 2 | Strong material, repeated framing before useful content. |
| Error recovery | 1 | Production search presents an internal build command rather than recovery. |
| Help and documentation | 3 | Substantial guidance exists, including Asm198x, but routes need clarity. |
| **Total** | **19/40** | **Major functional repairs and targeted design work required.** |

## Specificity and integrity

The paper, real-font wordmark, magazine headings, actual machine output and explained Vault connections belong to Code198x. Keep them. The weak pages share the surface identity but still behave like catalogues or long documents, with useful evidence arriving late.

The source detector returned 16 matches across 72 Astro files: 12 `side-tab` and four grid-background flags. These are not 16 verified design failures. All four grids are hidden legacy CSS; Timeline category marks are sanctioned chart encoding; several border matches delimit quotations or code. Pattern colour furniture needs reconciliation against the one-spot rule. The main functional defects came from browser interaction, not the detector. No ignore policy or family rule was changed.

## Five priorities

### 1. P0 — Restore site-wide search and its public error handling

Both desktop and mobile production checks fail before a search input appears. The separate Vault title search works. `src/components/Search.astro:150` imports the UI script and calls `new pagefind.PagefindUI(...)`; the built script exposes `window.PagefindUI`, not that ES-module export. The catch incorrectly tells readers to run `npm run build` even though the index exists.

Fix the integration contract and provide a reader-facing failure/retry state. Verify a genuine query, no results, clearing, keyboard opening/dismissal, focus return, result navigation and reopening after navigation. Include Asm198x and known pattern/Timeline content in result checks. Those downstream global-search behaviours are currently **blocked**, not passed.

The parent's additional suite produced two global-search failures and two Vault-search passes. Verbatim global assertion: `Expected: visible` / `Timeout: 5000ms` / `Error: element(s) not found` for `.search-modal input[type="search"]`. The independent suite reproduced the missing field on a Vault article. Screenshots and state are retained in the umbrella `.impeccable/review/site-review/`; structured results are `search-results.json` here.

Next command: `$impeccable harden`.

### 2. P1 — Repair setup navigation and make Asm198x the clear recommended assembly route

All four alternative guides work on a direct load but fail when opened through `/setup/`. The Windows tab remains unselected and macOS remains active, on desktop and phone. Their handlers are bound only inside `DOMContentLoaded`, which does not fire again on Astro client navigation. Sources: C64 `native.astro:194`, Amiga `:198`, Spectrum `:189`, NES `:187` under `src/pages/setup/`.

Repair lifecycle handling and keyboard tab behaviour using current conventions. Test both entry paths. Then distinguish the recommended assembler from reference-tool alternatives at the choice itself. The user specifically wants Asm198x recognised: name it, explain that it turns source into machine code, and link to the applicable installation/build guidance beside local setup and supported browser assembly controls.

Asm198x is already named in all four assembly introductions and all four main Getting Started guides. Its mapped live instruction links passed all six existing desktop/mobile tests. The alternative guides mention it in plain text but do not directly lead to its installation route there. Preserve existing working commands and keep ACME, Pasmo, vasm and ca65 as clearly labelled alternatives. Do not imply that every language or browser activity uses an assembler, or claim that installations were executed in this review.

Next commands: `$impeccable harden`, `$impeccable onboard`, `$impeccable clarify`.

### 3. P1 — Enforce the approved screenshot rule in track listings

The Spectrum BASIC route renders all 16 decoded 352px-wide captures at 98px in a 1440px viewport. This is downsampling, not cropping. `src/components/TrackGames.astro:178` still gives the scoped house thumbnail a 100px box including borders, overriding the intended native-size treatment.

Reflow the rows around native captures; shrink only below the native viewport threshold and keep captions within figures. Inspect other consumers of this component when implementing. The homepage's specifically approved equal-width showcase exception does not authorise these thumbnails.

Next command: `$impeccable adapt`.

### 4. P1 — Redesign Vault inner-page hierarchy and reconcile shared reading frames

The Vault contents page invites discovery; the inner pages lead with category band, title, subtitle, summary and introductory prose before substantial evidence. Keep sources, provenance and contents. Give an illustrated technique its existing evidence early; give a biography without suitable imagery a strong text opening. Do not force identical hero media onto unlike articles. Replace overlapping introductory roles and provide a few explained onward connections.

Build the preview with an illustrated technique, a text-led biography/game and a hardware entry, plus one category page. Use real content and the existing article/subject palette. Colour Clash, Commando and SID offer suitable existing material without inventing imagery.

Measured reading widths also need reconciliation: Vault paragraphs are about 793px at 20px; Hardware Sprites reaches 1060px at 20px; a C64 setup note reaches 1382px at 14px. These fit the viewport but do not provide an equally comfortable reading measure. Constrain prose independently of broad grids, code and tables. `src/styles/editorial.css:119` is one confirmed Pattern override.

Next commands: `$impeccable layout`, `$impeccable typeset`.

### 5. P1 — Give Pattern Library and Timeline a reason to enter beyond classification

Homepage links already exist. Their destination pages need to demonstrate their value.

For the **Pattern Library**, lead with a concrete problem, a verified result and the machine/language assumptions. Keep platform/category/difficulty lookup for readers who know what they need. Structure detail pages around problem, contract, implementation, trade-offs and a lesson using it. Replace the unqualified “production-ready” promise with actual validation. Connect a relevant Vault explanation to the implementation, and a lesson back to the reusable technique. The current five platforms, five categories and three difficulty levels require too much classification before an example.

For the **Timeline**, preserve complete chronological browsing but add a short, evidence-backed orientation and useful connections for each period. Give visitors a way to follow a subject through time. Clarify totals: the 1980s count includes categories not represented in the displayed subtotals. Review extraction in both `src/pages/timeline/index.astro` and `[decade].astro`: only seven Vault categories contribute start dates, while other categories also have dated schema fields. Decide and describe the intended coverage before claiming completeness. Timeline chart colours remain sanctioned.

Next commands: `$impeccable shape`, `$impeccable clarify`, `$impeccable distill`.

## Strengths, cognitive load and reader experience

Keep the result-first homepage, independent learning entry points, real screenshots, labelled Vault palette and explained Commando connections. The 76 settled route/device checks found no automated WCAG A/AA violations, no document overflow, no broken decoded main-content images and no missing local anchors. All 18 supplementary width observations fit. This is useful sample evidence, not whole-site accessibility certification.

Pattern and Timeline entries present many equally weighted choices before an example, creating high exploratory load. A novice choosing local setup must carry machine, language and preferred tool between pages; an experienced programmer needs a quick route to code and its assumptions; a phone reader can spend the first screen on repeated headings before reaching a control. The stronger pages make something possible early. The weaker transitions postpone that reward with classification or setup prose. These are design judgements, not measured abandonment rates.

Smaller issues include raw system slugs in some breadcrumbs, Pattern detail highlighting Systems, mobile Setup contents being hidden entirely, and coloured Pattern skill markers outside the sanctioned exceptions. Treat these with their owning page family rather than opening separate cosmetic projects.

## Recommended implementation order

1. Restore global search and setup-tab behaviour; add regression checks for real navigation and failure recovery.
2. Correct shared frame/reading/image rules, using fixed representative comparisons and the existing approved homepage as the baseline.
3. Preview Vault article/category changes with real content and shared component specimens.
4. Make the recommended Asm198x setup journey explicit, with verified first output and a return to the lesson.
5. Preview the Pattern Library and Timeline entry/detail pairs, including purposeful connections back into learning.
6. Apply the accepted patterns to remaining editorial, utility, family and bespoke pages, checking the source inventory so none is silently omitted. Finish with `$impeccable polish` and targeted regression checks.

No evidence establishes when the current defects were introduced. They are findings in the current build, not attributed regressions. No design-system rules, schemas, dependencies or production pages were changed by this review.

Questions for the next decision: should the first visual preview be the Vault article/category pair, or the Asm198x-led setup journey? The functional failures should be repaired first in either case.
