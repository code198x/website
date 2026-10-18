# Editorial study extension

Mode: Read. Scope: opt-in extension of the existing editorial article system, not a replacement visual world.

The reader arrives to understand how Spacewar plays and why it mattered. The colourful original illustration invites them in; the real game appears early. Keep screenshots and their factual captions distinct from artwork. Explain motion through visible diagrams before linking outward to maths, design, people and culture. Sources and methods remain reachable, without making the prose a research log.

Owner-confirmed composition: familiar site identity, colourful full-bleed artwork, quiet breadcrumbs within the opening, readable text and occasional wide figures/pull quotes. Prototype plus draft website change, unpublished. The frame remains 1264px; full bleed means frame edges. No new global breadcrumb or article default.

Build directly in Astro/CSS for this reading document. Original raster artwork is an asset, not a page-layout comp. This is a session choice for a document, not a stored comp/code workflow default.

Direction contract: preserve house type, navigation, page ground and frame; create one expressive full-width opening with a large editorial title and a calm short deck. Body uses a consistent reading measure in a wider grid. Let one figure or quote span the grid at meaningful pauses; avoid making every paragraph a card. Pixel captures stay sharp and unmodified, without stretching beyond useful native scale. Mobile stacks in source order and retains contextual captions, sources and navigation. No gratuitous scroll effects.

Quality bar: the first viewport must contain a memorable, legible title/artwork composition and a clear route into the reading. Below it, text, capture and explanation should feel intentionally composed, with no repetitive boxes or unexplained empty areas. Existing editorial and reference pages retain their approved geometry. New components must also support a second short specimen without Spacewar-specific CSS selectors.

## Implemented extension and finish evidence

The finished composition uses `FeatureArticle`, `ArticleOpening`, `ArticleFigure` and `ArticlePullQuote` with opt-in styles in `src/styles/feature-article.css`. It retains the incumbent UI font, house ground, ink and rules, shared navigation and PageFrame. The artwork opening reaches frame edges. Figure `bleed` reaches frame edges, accounting for page gutters and the additional prose inset on desktop. Pixel captures remain capped at 512px, while vector diagrams can use the 640px figure width.

The second specimen at `/catalogue/editorial-study/specimen/` uses the paper opening and reading/bleed figures with the same components. It demonstrates that the extension does not depend on an illustrated Spacewar header or article-specific selectors. Usage, variants, source sync and provenance are recorded in `docs/editorial-articles.md`; this surface brief does not replace the product authority in code198x/docs.

The initial full-composition finish review disposition was ship for the authorised draft/prototype scope. A subsequent narrow review accepted the desktop bleed correction with no remaining finding for that fix. Fresh captures and the 15-view evidence pass followed the correction; all eight desktop/phone browser tests passed, including exact frame edges and the native capture ceiling. This narrow follow-up does not represent a second full-composition review. Evidence in `.impeccable/review/` covers 1440px, 390px and 320px study views and opening/figure/quote crops, plus second-specimen screenshots at 1440px and 390px. `editorial-checks.json` records all five development routes at all three widths, with no horizontal overflow, loaded images, one title, one integrated breadcrumb and `noindex` in each observation. This evidence supports the reviewed composition, not unrestricted viewport or content claims.

Historical/editorial sign-off, public placement and deployment remain outside this finish decision. The absent incumbent `DESIGN.md` is a documentation gap left untouched; this ordinary extension does not establish a replacement global design system.
