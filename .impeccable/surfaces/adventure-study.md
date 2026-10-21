# Adventure study extension

Mode: Read. Scope: draft website integration of the approved editorial article world established by Spacewar. This record describes implemented source and observed review evidence. The independent verdict is ship for the scored maze-label correction; merge, deployment and historical/editorial sign-off remain outside the current approval.

## Overview

Adventure lives at `/vault/studies/adventure/`, rendered by `src/pages/vault/studies/adventure/index.astro` through `src/components/AdventureStudy.astro`. The reader enters an imagined cave, then follows a whole-game account of language, world state, mapping, puzzles, people and authorship. The existing Spacewar composition remains the visual authority: an expressive opening, quiet integrated breadcrumbs, a calm reading column and selective wide interruptions.

The opening explicitly labels its artwork “Original editorial illustration · an imagined cave”. It is neither an archival capture nor a surveyed reconstruction. The two responsive WebP assets, exact prompt, conversion metadata and provenance live in `public/images/studies/adventure/`. The original explanatory SVGs remain distinct from historical evidence; captions qualify the grate schematic, generic richer-parser model and maze-marker example.

## Colors

The extension inherits house ground, body ink, heading ink, muted ink and rules. The shared article composition supplies deep space (`#071923`), warm paper (`#fff8e9`) and cyan selection (`#52d2cf`); Adventure does not introduce a replacement palette or global token layer. Header shading supports readable HTML title and deck over the cave illustration.

## Typography

House UI type remains the article voice through `--h-font-ui`; code retains the incumbent monospace family. Shared article styles implement a desktop title at `clamp(56px,7.2vw,96px)` with a separately scaled subtitle, body at 20px/1.7, section headings at 34px/1.15 and captions at 16px/1.6. At widths up to 760px the body becomes 18px, section headings 29px and the title uses the shared phone scale. These describe the existing article implementation, not new global typography rules.

## Layout

`PageFrame` retains the 1264px maximum and shared responsive gutters. The opening reaches the frame edges; it does not widen the site. `FeatureArticle` preserves the 65ch text track within its wider grid, with integrated opening breadcrumbs, six in-page contents links and a narrow ending for editorial limits and credits.

Adventure-specific styles live in `src/styles/adventure-study.css`. They adapt the contents, wrapping tables and optional puzzle disclosures without replacing shared article defaults. On phones, the opening uses a 700px minimum height, adjusted copy padding and a rightward artwork crop. Wide explanatory figures use a maximum 1120px picture area; phone compositions use a maximum 500px picture area and fit the available reading width.

## Elevation & Depth

The article uses flat reading surfaces, thin rules and artwork shading. Pull quotes and disclosures are separated by house rules rather than raised cards. The opening overlay supplies contrast over imagery; it does not establish a new shadow vocabulary.

## Shapes

The composition preserves the existing editorial form language. Tables wrap within fixed columns; the disclosures use horizontal rules and native disclosure controls. The responsive SVG compositions explain relationships without adding a new application control system.

## Components

- `AdventureStudy.astro` composes the shared opening, reading body and ending. `src/data/game-studies.mjs` owns the identity and placement; `reviewed: false` preserves `noindex` and the established sitemap exclusion path.
- `src/previews/adventure/study.mdx` contains three selective pull quotes duplicated from nearby prose. The shared duplicate treatment marks them `aria-hidden="true"`; no invented speaker is attributed.
- The three explanatory figures each have wide and phone SVGs, descriptive alternative text and qualifying captions. Optional `phoneSrc`, `phoneWidth` and `phoneHeight` properties in `ArticleFigure.astro` supply the `<picture>` source at widths up to 760px. Other figures retain their existing rendering path.
- Three native puzzle disclosures start closed and can be opened by keyboard. Focus receives a visible house-ink outline. The sixteen numbered bibliography entries have anchors reached from inline source references.
- `scripts/sync-adventure-study.mjs` adapts the committed documentation into presentation MDX, adds the three duplicate quotes and source anchors, copies SVG bytes unchanged and records hashes and revision in `src/previews/adventure/source.json`. Its check mode fails on mismatches; the script rejects dirty source and unexpected figure/source counts.

The current canonical revision is `45ee69935bf94726a1cf6cbee383d8dc5336f7af`. The wide maze diagram’s route-label collision was corrected in that documentation revision and synced to the website; it is not a spacing defect to preserve as a design rule.

## Do's and Don'ts

- Do preserve Spacewar's approved article authority, shared frame, house type, reading measure and integrated breadcrumbs.
- Do keep imagined artwork and original explanatory schematics visibly distinguished from historical evidence.
- Do maintain phone compositions as readable explanations rather than shrink the wide diagrams indiscriminately.
- Do preserve the source hashes, canonical revision, sixteen source links and explicit account of execution limits when syncing.
- Don't treat repeated pull quotes as additional historical testimony or expose duplicate prose twice to assistive technology.
- Don't promote this surface record into a global visual-system replacement or treat draft integration as merge/deployment approval.

## Evidence and review limits

Evidence directory: `/Users/stevehill/Documents/Codex/2026-10-16/referenced-chatgpt-conversation-this-is-an/outputs/adventure-study/website-review/`.

`render-checks.json` records observations at 1440px, 390px and 320px: zero horizontal overflow, one title, loaded wide/phone variants for all three diagrams and no axe violations. All three puzzle disclosures were opened for those accessibility observations. These observations cover those states and widths, not every possible viewport.

`capture-checks.json` and `README.md` record the replacement of oversized single Chromium captures with stitched actual browser viewports, including the lower article and footer. Opening, diagram, pull-quote, full-article and sources/ending images accompany those records. The README records the canonical maze-label correction and verification results, including existing skips and environment-related failed attempts; this documentation pass did not rerun those checks.

`tests/adventure-study.spec.ts` checks the article frame, one title and integrated breadcrumb, in-page/source targets, all three responsive diagrams, keyboard disclosure opening, duplicate quote treatment, overflow, axe and `noindex`. The review README records the wider build, route, browser and regression evidence. `visual-review.md` records that the fresh full review matched the incumbent type, materials, ground, frame, story, opening and article form. The initial invalid full-article captures were replaced before that review. Its one material finding concerned the wide maze diagram's loop arrows and bottom labels. The verdict pass confirmed clear desktop separation, legible phone/narrow variants and no observed regression, with disposition ship for that scored correction. This narrow verdict does not substitute for historical sign-off or deployment approval.

Pre-existing documentation gap not canonized or repaired: the project lacks an incumbent `DESIGN.md`. This ordinary extension leaves `PRODUCT.md`, `.impeccable/design.json`, global configuration and system files untouched. The study remains explicitly not yet fact-checked; selected encounters were executed in a later C port, while the complete ending was inspected in source.
