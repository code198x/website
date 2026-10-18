# Feature article prototype

The opt-in components in `src/components/editorial/` extend the existing site identity and PageFrame geometry. The current long-form specimen is development-only at `/catalogue/editorial-study/`; its companion, capture-credit and second-specimen routes are also omitted from production. They do not establish a public Studies collection. Product and editorial authority remain in [code198x/docs](https://github.com/code198x/docs/blob/main/PROJECT.md).

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

## Review evidence and limits

The capture script writes its check record to `.impeccable/review/editorial-checks.json`. It contains 15 route/viewport observations: the study, second specimen, moving-shot companion, duel-design companion and capture credits, each at 1440px, 390px and 320px. The record shows one title, one integrated breadcrumb trail, `noindex`, loaded images and no horizontal overflow for those observations. The study has seven figures and two duplicate-hidden emphasis pulls. These are recorded observations, not a claim about every possible viewport or future article.

The same script writes visual evidence alongside the record: `desktop.png`, `mobile.png`, `user-320.png`, their `-opening`, `-figure` and `-quote` crops, and `specimen-1440.png` / `specimen-390.png`. The initial full-composition review accepted the approved composition across the three viewport classes and the second specimen. A later narrow review confirmed that the desktop bleed inset discrepancy was resolved, with no remaining finding for that fix. The study crops and specimen captures were refreshed after the correction; the 15-view evidence pass and eight desktop/phone browser tests passed, including exact frame-edge agreement and the native capture ceiling. The paper opening, reading and bleed figures in the second specimen demonstrate reuse without Spacewar-specific CSS selectors.

This is a draft composition. Publication needs human source/editorial review, placement agreement and website checks. No new dependency or automatic deployment is part of it; visual acceptance does not constitute historical sign-off or authorise publication.
