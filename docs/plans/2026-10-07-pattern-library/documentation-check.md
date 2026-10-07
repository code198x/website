# Pattern Library documentation check

Documentation check complete after the bounded correction recheck. This is an ordinary extension of the approved Code198x world. The umbrella `DESIGN.md` and `.impeccable/design.json` remain unchanged. Pattern-specific layout and examples belong to this surface, not new family tokens.

The Impeccable documenter instructions were applied by a delegated general agent because this harness has no custom agent-type selector. The context loader found no site-local product or design files; the existing umbrella records were read directly, as directed by this task.

## Evidence checked

- Umbrella `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `decisions/family-visual-identity.md`, and `.impeccable/surfaces/pattern-library.md`.
- This plan's `README.md`; `src/components/PatternDirectory.astro`, `PatternExample.astro`; `src/styles/pattern-library.css`; all five route templates under `src/pages/patterns/`; and `src/pages/catalogue/[...slug].astro`.
- The supporting `_198x-ui/tokens.css`, site token declarations, Layout spot-ink assignment, `getSpotColour`, Progress Bar MDX and its maintained `Code198x/code-samples/sinclair-zx-spectrum/patterns/basic/progress-bar.bas` source.
- Existing production `dist/patterns/index.html` and Progress Bar HTML: each contains 84 SVG rectangles, the explicit illustration caption, and only the existing SVG wordmark as image elements. The Pattern Library catalogue is absent from `dist`, matching its development-only route guard.
- Desktop and mobile catalogue screenshots in `.impeccable/review/pattern-library/`, opened for inspection. Their timestamps follow the inspected stylesheet and production build. These show the real directory and illustration with the caption wrapping within the figure.

## Tokens and component documentation

The new stylesheet uses the shared rem type scale: body 1.25rem, controls and metadata 1rem, row titles 1.5rem, section headings 2.5rem, article and facet headings 3rem, and index hero 5rem. Narrow layouts use the existing 3rem and 2rem heading steps. Line heights use the matching family ratios. The 5rem hero is a fallback to the binding decision's value because the pinned paper kit still lacks a hero token. No root font-size override is introduced by the Pattern stylesheet. Pixel layout dimensions remain local implementation values; they are not a new family spacing specification.

Nebula Sans supplies reading, reference/directory/facet headings and controls; JetBrains Mono supplies the numerical example and code. Captions use Nebula Sans italic. Fira is scoped to the index opening, feature teaser and closing editorial sections. The illustration adds no font.

Neutral surfaces and rules use the existing paper, ground, ink, muted-ink and line tokens. Links and focus outlines bind to `--h-spot-ink`. The generic index, category and difficulty pages take Code's project ink. Machine routes and articles pass the curated machine primary through Layout's existing spot derivation, including the existing NES slug mapping. No machine-ink copies or category palette are added. Illustration colours stay within the labelled subject figure.

Directory controls have visible labels, square corners and focus outlines; results use ruled rows rather than tiles with independent colours. The source retains server-rendered facet defaults and supplies a no-script browse path. These are observed implementation details, not newly asserted global rules.

`/catalogue/pattern-library/` imports the same `PatternDirectory` and `PatternExample` components and stylesheet as the pages. It is a working development preview, not a screenshot replacement or duplicated mockup. The existing sidecar's nine static control specimens describe the incumbent family kit; adding a site directory and algorithm figure does not require promoting them to the umbrella component set.

## Illustration provenance

`PatternExample.astro` computes its three examples from values 0, 50 and 100, using `floor(value * 28 / 100)` and the maintained routine's 9/18/24 cell colour thresholds. These examples light 0, 14 and 28 cells. Its visible caption explicitly says it is an illustration, not an emulator capture; its accessible description states the values and lit-cell counts. The figure is schematic geometry, not a claim of screenshot fidelity or execution validation.

The new Pattern components and routes introduce no raster assets. Existing review PNGs are inspection evidence, not shipping imagery. Unrelated Vault raster modifications already present in the worktree are outside this review. This check does not certify the provenance or execution of every existing Pattern Library entry.

## Bounded correction recheck

Completed against the corrected stylesheet and maintained BASIC source, rebuilt HTML and refreshed screenshots. Magazine typography is scoped to the index's editorial sections; directory, facet and reference prose headings now use Nebula. The mobile contract screenshot shows an intact “Input” header with wrapping contract text, matching the new normal header wrapping rule. The BASIC usage comment now sets `br=15`, and the row comment calls 15 an example rather than a default. No family rule was rewritten to legitimise these findings.

The refreshed desktop catalogue screenshot shows the shared directory heading in Nebula, the same labelled illustration and the same working controls. The development catalogue's own title retains its existing catalogue-only magazine treatment; this is not a Pattern reading-heading rule. Screenshot and rebuilt HTML timestamps follow the corrected stylesheet. The final browser log reports 14 passing checks, and the saved accessibility log records six route/width combinations with zero violations; these are the implementation team's runs, read as supporting evidence rather than repeated here.

## Existing drift and limits

The existing umbrella adoption note already identifies the absent paper-kit hero token, legacy plate tokens, older navigation treatment and incomplete shared-kit migration. The existing sidecar also contains an Eyebrow specimen that the current Impeccable documenter would not newly canonise. They are preserved because this task is a surface extension with no authority to repair unrelated family documentation.

This is a documentation and provenance check, supported by source, built HTML and existing screenshots. It did not rerun the build, browser suite, contrast audit or BASIC program. The plan README records the implementation team's checks; independent finish review owns the current visual and interaction verdict. No production deployment is asserted.
