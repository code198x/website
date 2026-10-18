# Monty Mole and Elite study extension

Mode: Read. Extend the owner-approved Spacewar/Adventure article composition. The user approved developing both whole-game studies; these remain reviewable drafts, with no merge or deployment approval. Existing PRODUCT.md and the Spacewar/Adventure surface records provide visual authority. The absence of a global DESIGN.md is pre-existing and does not authorise a replacement design system.

## Direction contract

THESIS: Bring the player into a mine or a trading ship, then explain the whole game through concrete decisions and carefully sourced human history.

OWN-WORLD: Preserve house type, paper, ink, rules, 1264px PageFrame, 65ch reading track and shared editorial components. Original mine and space art supplies distinct atmosphere; genuine captures stay separate.

STORY: Readers follow play, investigate a diagram, then explore people and production. Sources and evidence limits stay reachable. No new navigation taxonomy or interaction.

FIRST VIEWPORT: Full-frame 3:1 artwork, quiet integrated breadcrumbs, large HTML title/subtitle and short deck. On phones preserve legibility, source order and room for text without clipping the credit.

FORM: Ordinary code-first extension of approved editorial reading form. No random seed or replacement comp applies; the original raster openings are illustrations, not layout comps. Two selectively duplicated pull quotes per study and responsive diagrams interrupt the calm text at meaningful points.

FINISH: unreviewed and undocumented is unfinished; this ordinary extension ends with the finish review, verdict, this surface record and every shipping raster carrying its provenance. The pre-existing absent DESIGN.md is disclosed rather than replaced.

For this ordinary extension, the documenter verifies inheritance and records the absent incumbent DESIGN.md without creating a new world. Ship means ready for owner review, not public historical sign-off.

## Built evidence

Canonical documentation revision: `79771c92913c51948bccd9588e7ef7221f6b410e` (draft PR code198x/docs#109). The built pages use the shared FeatureArticle, ArticleOpening, ArticleFigure and duplicate-hidden ArticlePullQuote components. Two own Monty frames and three own Elite frames sit within their related explanations. Each study has a wide/phone SVG pair and an original labelled raster opening. All nine raster assets retain embedded prompts/origins; the provenance scan found zero missing records.

The initial desktop pass identified an inherited screenshot cap on explanatory SVGs. The local responsive-diagram override now fills the existing picture area; raster caps remain in place. The final browser test compares picture and diagram widths so this defect can fail a check. No shared layout, typography, navigation, or article defaults were changed.

The existing development-only bleed specimen failed when requested from a production build: `locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exceeded`, waiting for `.article-figure[data-size="bleed"]`. The route is intentionally absent there. Both original assertions passed unchanged on the development server. This is recorded as a test-environment mismatch, not hidden by changing the assertions.

## Inherited composition

The implemented routes are `/vault/studies/monty-mole/` and `/vault/studies/elite/`, both rendered through `src/components/PairedGameStudy.astro`. Their wrappers provide six contents links each. `src/data/game-studies.mjs` retains route/discovery ownership and `reviewed: false`; the shared layout supplies `noindex`, with sitemap exclusion checked in the built-route pass.

The pair retains the Spacewar/Adventure visual authority: house UI type through `--h-font-ui`, house paper ground, body/heading/muted ink and thin rules. The shared article layer supplies deep space (`#071923`), warm paper (`#fff8e9`) and cyan selection (`#52d2cf`). It declares coral but this extension does not establish a new use for it. No palette, type system, dependency or global component default is introduced.

`PageFrame` still owns the 1264px maximum and responsive gutters. The shared 65ch reading track sits inside the wider figure grid. Titles use the inherited `clamp(56px,7.2vw,96px)` scale and separate subtitle; prose is 20px/1.7, section headings 34px/1.15 and captions 16px/1.6. At widths up to 760px prose becomes 18px, headings become 29px and the opening follows the shared phone title scale. These are inherited component values, not new global tokens.

`src/styles/paired-game-studies.css` limits its adaptation to local contents spacing, anchor offsets, explanatory figures and the phone opening. Contents links wrap above a house rule. Phone openings have a 700px minimum height, rightward artwork crop (74% centre) and extra copy space above the credit. Responsive diagram pictures allow up to 1120px on wide layouts and 500px on phones; their SVG fills the available picture width. Pixel captures keep the shared 512px ceiling. Thin rules and artwork shading carry separation and depth; no new card, shadow or motion vocabulary is established.

## Sources, adaptation and provenance

`src/previews/{monty-mole,elite}/source.json` pins the same full documentation revision and per-file hashes. `scripts/sync-paired-studies.mjs` adapts committed study text into presentation MDX, inserts bibliography targets and two selectively duplicated prose pulls per study, and copies source figures and artwork byte for byte. Check mode rejects output drift; an intentional generated-body mismatch was rejected before the original bytes were restored. Dirty source and unexpected adaptation anchors fail rather than silently producing an article.

Monty has two own Spectrum stills, one original timing diagram in wide/phone variants and six bibliography targets. Elite has three own BBC Micro stills, one original trading-journey diagram in wide/phone variants and eleven bibliography targets. Captioned game evidence remains separate from explanatory schematics and imagined opening art. The nine shipping rasters comprise five captures and four responsive WebP headers. Embedded prompt/origin metadata, capture manifests, artwork provenance and exact generation prompts are retained under `public/images/studies/{monty-mole,elite}/`; the supplied provenance scan found no missing records. Artwork records describe conversion and resizing, not alteration of game captures.

The two pulls in each study repeat nearby prose, use the shared ruled treatment and are hidden as duplicates from assistive technology. They do not introduce attributed testimony. The ending names game/platform/ownership, links canonical study and evidence records, and discloses that the studies have not yet been fact-checked. Only selected early encounters were observed; wider claims also depend on original documents and source analysis. A complete playthrough is not claimed.

## Evidence and review limits

Evidence directory: `/Users/stevehill/Documents/Codex/2026-10-16/referenced-chatgpt-conversation-this-is-an/outputs/monty-and-elite/`.

`render-checks.json` contains six observations: both studies at 1440px, 390px and 320px. Each records one title, two pulls, loaded images, intact contents/source anchors and zero horizontal overflow. Measured prose is 20px on desktop and 18px on phone/narrow views. The desktop diagrams measure about 1110px; phone/narrow variants fit the available 358px/288px widths. These are observations at named sizes, not unrestricted browser/viewport coverage.

`{monty-mole,elite}-{desktop,phone,narrow}-{opening,diagram,quote,ending}.png` supplies 24 detail crops. Four stitched desktop/phone article captures include the lower article and complete footer. Portable `monty-mole.html` and `elite.html` copies retain embedded fonts/images for owner reading; source bundles retain research, exact prompts and evidence limits.

`visual-review.md` records an independent disposition of **ship for the authorised draft review**, with no material finding. The reviewer inspected all 24 crops, all four stitched articles, the direction contract and sampled implementation. The phone opening and diagram reflow are accepted adaptations of the incumbent reading form. Historical sources and portable HTML were not independently audited. `detector.json` is empty; the review did not run a second detector.

The supplied logs/README record 239 unit tests passed with nine existing skips; eight built study/index/companion routes passed; canonical sync passed with its mismatch probe; targeted link checking found zero errors across 228 references. The broader production browser run reported 314 passes and the two development-specimen timeouts recorded above. Both unchanged specimen assertions passed on the development server. After the local SVG sizing correction, the six paired-study/Adventure desktop and phone tests passed, including axe, navigation, image loading, frame agreement, duplicate treatment and the diagram/picture width invariant. This documentation pass read those records and source; it did not rerun browsers or tests.

Owner reading, historical/editorial sign-off, merge and deployment remain open. The review disposition authorises readiness for owner review, not publication. Pre-existing drift not canonized or repaired: the absent incumbent `DESIGN.md`. This ordinary extension leaves global system records and configuration untouched; the corrected SVG cap is recorded as a resolved defect, not a design rule to reproduce.
