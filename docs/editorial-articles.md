# Feature articles and Game Studies

The opt-in components in `src/components/editorial/` extend the existing site identity and PageFrame geometry. Game Studies now has its agreed initial home in the Vault: `/vault/studies/` lists Spacewar!, whose study and three companions are built at `/vault/studies/spacewar/`. The `/catalogue/editorial-study/` family remains development-only aliases and a reusable second specimen; it is omitted from production. Product and editorial authority remain in [code198x/docs](https://github.com/code198x/docs/blob/main/PROJECT.md).

## Relationship to the existing site

`src/styles/feature-article.css` uses the incumbent `--h-font-ui`, ink, paper-ground and line tokens. Its body rhythm (20px/1.7, reducing to 18px on phones) follows the existing editorial text treatment. The shared `PageFrame` still owns the 1264px maximum width and fluid gutters. Navigation, logo and page ground belong to the existing shell.

The larger opening title, artwork overlay, wider figure grid and ruled pull quotes are opt-in feature-article variants. The dark opening uses local space (`#071923`) and light paper (`#fff8e9`) colours, with cyan (`#52d2cf`) for selection. These are local treatments, not replacements for site tokens. The stylesheet also declares coral (`#f46a43`), but does not currently apply it as a component treatment.

The prototype does not introduce a replacement identity, global article style or global breadcrumb default. A root `DESIGN.md` is absent in the incumbent checkout; this task records the extension here rather than creating a new source of visual authority.

## Compose an article

Use `FeatureArticle` for the reading grid and `ArticleOpening` in its `opening` slot. Place article content in the default slot and sources, credits or onward reading in the `ending` slot. `FeatureArticle` imports its own stylesheet and renders a semantic article through `PageFrame`.

A `Layout` using this opening sets `breadcrumbPlacement="article"`; the opening supplies `Breadcrumbs` with `presentation="over-art"`. These props default to `shell` and `bar` respectively, so existing callers keep the standard breadcrumb bar. The integrated trail retains its navigation semantics, wrapping and visible keyboard focus; its colour follows the opening tone.

| Component | Inputs and deliberate variants |
| --- | --- |
| `FeatureArticle` | Optional `class`; named `opening` and `ending` slots around the default content slot. |
| `ArticleOpening` | Required `title`, `description` and `breadcrumbs`; optional `subtitle`, `metadata`, `image`, `imageSet`, `imageCredit`; `tone` is `ink` by default or `paper`. |
| `ArticleFigure` | Required `src`, `alt`, native `width`, native `height` and `caption`; optional `title`, `credit`, `size` and `pixels`. |
| `ArticlePullQuote` | Required `text`; `kind` defaults to `emphasis`. `quotation` requires `attribution` and accepts `source`. Both accept `duplicate`, defaulting to false. |

The illustrated opening reaches the frame edges, with an overlaid title and short deck. The image is decorative (`alt=""`); use `imageCredit` to label original editorial illustration, and put factual game evidence in figures. The overlay keeps the title independent of bright image regions. `imageSet` allows responsive artwork sources. The `paper` variant uses the house ground and ink, a bottom rule and a shorter opening without artwork; the second specimen demonstrates this quieter treatment.

The body centres a reading measure of up to 65ch within a wider grid. The title scales from a desktop maximum of 96px to a mobile minimum of 50px; the deck reduces from 21px to 19px. At 760px and below, figure asides stack in source order and body spacing contracts. Print styling removes opening artwork and navigation and restores a plain document flow. These measurements describe this component, not a new site-wide type scale.

## Figures and emphasis

Choose figure size according to what the image explains:

| `size` | Composition |
| --- | --- |
| `reading` | Shares the text column. |
| `wide` (default) | Spans the wider article grid; image and caption remain centred. |
| `aside` | Places image and caption side by side, within a 1000px maximum; stacks image then caption on phones. |
| `bleed` | Expands beyond the wide grid to the shared frame edges, including the additional prose inset on desktop. |

Wider composition does not imply a larger raster. The current captures are 512px wide: `pixels` applies pixelated rendering and a 512px ceiling. Other figures have a 640px image ceiling; vector movement diagrams may scale to that width. Supply each image's actual native dimensions, a descriptive alternative, a factual caption and relevant credit. The component's `bleed` variant expands its figure box without removing those image ceilings. Changing composition must not alter the evidence image.

`ArticlePullQuote` separates editorial emphasis from attributed historical quotation. Emphasis has no invented speaker or quotation marks and carries “From this study”. For a quotation, supply the real attribution; `source` links that attribution when provided. Set `duplicate` only when the same words remain accessible elsewhere in the body: the whole visual repetition is then hidden from assistive technology. Use pull quotes sparingly at meaningful pauses. They use the house ground and thin rules, without shadows, cards or scroll effects.

## Source sync and provenance

The documentation study is canonical. To regenerate the preview from a committed source checkout, run:

```sh
node scripts/sync-spacewar-preview.mjs --source-dir ../docs/studies/spacewar
node scripts/sync-spacewar-preview.mjs --source-dir ../docs/studies/spacewar --check
```

Use a checkout containing the study (currently docs PR #106). Commit text changes first. The sync records its revision, source hashes and copied asset hashes; it fails on uncommitted source or changed figure/pull-quote anchors. Check mode exits nonzero on drift. Do not edit generated MDX independently. The three PNGs and four SVGs are copied byte for byte; header artwork has its own prompt and provenance in `public/images/studies/spacewar/`.

## Vault placement and route ownership

`src/data/game-studies.mjs` owns stable study identities, current paths, companion slugs and review flags. The current built family is:

- `/vault/studies/`
- `/vault/studies/spacewar/`
- `/vault/studies/spacewar/moving-shot/`
- `/vault/studies/spacewar/duel-design/`
- `/vault/studies/spacewar/capture-credits/`

`src/components/SpacewarStudy.astro` renders the study, companions and development specimen with the approved article composition. Generated bodies remain in `src/previews/spacewar/`; that directory name does not make the Vault routes development-only. The documentation study remains canonical. Its source and generated bodies do not depend on Vault category membership or URL ancestry, so a later move can update central route metadata and add redirects without rewriting the study.

The Vault directory links to Game Studies, and Vault search includes both the index and Spacewar! study. The `space-war-apple-ii` and `star-control` game entries link to the study. The index uses the paper opening, house ground/type/frame and one illustrated available study, with an explicit original-art credit and review status. It adds no primary navigation item, Vault subject category or future-study placeholders.

Spacewar! currently has `reviewed: false`. The index, study and companions carry `noindex`; `unreviewedStudyPaths` also excludes those exact paths from the sitemap. `scripts/check-game-studies.mjs` checks the production artefact for all five declared routes, one title per route, review/indexing/sitemap agreement and absence of catalogue links/routes. `scripts/check-vault-links.mjs` accepts exact metadata-declared study paths rather than allowing an arbitrary `/vault/studies/` prefix.

## Review evidence and limits

The capture script writes its check record to `.impeccable/review/editorial-checks.json`. It contains 15 route/viewport observations: the study, second specimen, moving-shot companion, duel-design companion and capture credits, each at 1440px, 390px and 320px. The record shows one title, one integrated breadcrumb trail, `noindex`, loaded images and no horizontal overflow for those observations. The study has seven figures and two duplicate-hidden emphasis pulls. These are recorded observations, not a claim about every possible viewport or future article.

The same script writes visual evidence alongside the record: `desktop.png`, `mobile.png`, `user-320.png`, their `-opening`, `-figure` and `-quote` crops, and `specimen-1440.png` / `specimen-390.png`. The initial full-composition review accepted the approved composition across the three viewport classes and the second specimen. A later narrow review confirmed that the desktop bleed inset discrepancy was resolved, with no remaining finding for that fix. The study crops and specimen captures were refreshed after the correction; the 15-view evidence pass and eight desktop/phone browser tests passed, including exact frame-edge agreement and the native capture ceiling. The paper opening, reading and bleed figures in the second specimen demonstrate reuse without Spacewar-specific CSS selectors.

The later Vault-placement pass has separate evidence: `studies-index-{1440,390,320}.png`, `vault-study-opening-{1440,390,320}.png`, `vault-study-{1440,390,320}.png` and `vault-discovery-{1440,390,320}.png`. `vault-placement-checks.json` records six production index/article observations at those three widths, each with one title, integrated breadcrumbs, loaded images, `noindex`, zero horizontal overflow and zero axe findings. The pass also verified Vault search and companion navigation at all three widths and a 404 for an unknown study route. These checks extend the evidence to the real Vault placement; they do not replace or widen the earlier development-specimen review.

The Vault-placement finish review disposition was ship for the authorised draft scope, with all five direction-contract sections passing and no material fixes required. The production build produced 2,468 pages across 47 system families; eight article browser tests and 239 unit tests passed, with nine existing skips. These results describe the reviewed build and observed viewports. The final built-route check passed for all five declared paths, and the built study footer links to canonical documentation revision `355bb36`.

The initial placement is agreed and implemented. Human source/editorial review, merge and deployment approval remain open. No new dependency or automatic deployment is part of this extension; visual acceptance does not constitute historical sign-off or authorise publication.

## Monty Mole and Elite drafts

`PairedGameStudy.astro` composes the same editorial opening, body and ending for the next two whole-game studies. Their route wrappers supply a study slug, source record and six in-page contents links; `game-studies.mjs` continues to own discovery and review/indexing state. Both remain `reviewed: false` and require owner review before publication.

Sync from a clean committed documentation study with `node scripts/sync-paired-studies.mjs --slug monty-mole --source-dir ../docs/studies/monty-mole` (or `--slug elite` and its directory). Add `--check` to reject output drift. The adapter retains the source revision and per-file hashes, copies captures/diagrams/artwork byte for byte, creates bibliography targets and inserts two selectively duplicated prose pulls per study. Its mismatch check was verified with a changed generated body, then the original bytes were restored.

`paired-game-studies.css` keeps the contents navigation and phone opening local to these articles. Responsive explanatory SVGs fill their picture area; raster captures retain the shared 512px ceiling. Pixel captures identify game, platform, year and publisher in their captions and embedded provenance. Editorial openings are explicitly imagined, with exact generation prompts retained in their provenance records. No game media or audio is included.


The pair is pinned to documentation revision `79771c92913c51948bccd9588e7ef7221f6b410e`. Monty supplies two own Spectrum captures and six source targets; Elite supplies three own BBC Micro captures and eleven source targets. Each has one wide/phone explanatory SVG pair and two duplicate-hidden pulls. Nine shipping rasters retain embedded prompt/origin metadata; manifests and exact artwork prompts remain beside the copied assets. Selected early encounters support the captures; the ending explicitly disclaims a complete playthrough and an unfinished fact check.

The pair's finish record is `.impeccable/surfaces/monty-and-elite-studies.md`. Evidence in the task output directory `outputs/monty-and-elite/` includes portable reading copies, 24 opening/diagram/quote/ending crops, four stitched desktop/phone articles, `render-checks.json` and `visual-review.md`. Six observations at 1440px, 390px and 320px show loaded images, one title, intact anchors, two pulls and zero overflow. The independent disposition is ship for the authorised draft review, with no material finding; historical sources and portable HTML were not independently audited.

After the pair-local SVG cap correction, six pair/Adventure desktop and phone browser tests passed, including axe and an image/picture width invariant. Supplied verification records also report 239 unit passes (nine existing skips), eight built study routes, successful source sync with a rejected mismatch probe and zero errors across 228 checked links. The broader production browser run had 314 passes and two timeouts for the unchanged development-only bleed specimen; both original assertions passed unchanged on the development server. These are bounded records of the reviewed build, not a claim of a wholly green production regression or universal viewport coverage. Owner reading, historical/editorial sign-off, merge and deployment remain open.
