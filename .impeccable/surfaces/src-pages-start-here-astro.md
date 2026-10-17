---
version: 1
slug: "src-pages-start-here-astro"
primary_target: "src/pages/start-here.astro"
related_targets: ["src/components/StartHereOpening.astro"]
---

# Start Here opening

Mode: Read; local extension. Audience: new visitors choosing something to try. Both concept and implementation/integration approved on 17 October 2026. Scope only opening presentation, not curriculum order or body routes.

## Direction contract

THESIS: Invite readers to begin with the approved kit of creative possibilities, keeping real route choices and first session easy to reach.

OWN-WORLD: Existing paper/ink, live Fira heavy italic heading, Nebula reading and labels. Tactile original cardboard, paper pixels and colourful pieces carry the art rather than extra interface chrome.

STORY: Recognise an open invitation, choose a first activity or independent route, and reach the existing teaching/history content.

FIRST VIEWPORT: Full-width desktop panorama with live Start Here title on the quiet left; compact 4:3 phone art with title upper left. Caption, first-session link, retained introduction and route links follow without a tall poster.

FORM: User-approved making-kit panorama; seed not applicable to this precisely pinned local extension. Code-led integration, artwork asset not a whole-page comp.

FINISH: unreviewed and undocumented is unfinished; this local extension ends with the finish review, scoped verdict, a consistency check against the inherited design system, and provenance on every shipping raster. The inherited DESIGN.md and sidecar are preserved.

Preserve the incumbent DESIGN.md and sidecar; documentation check rather than a system rewrite. Quality bar: physical depth and colour survive optimisation, heading legible without panels, phone choices stay close, six route targets and real captures preserved. No added motion, dependency or mandatory learning sequence.


## Built result and verification — 17 October 2026

The opening uses live Fira Sans Condensed heavy italic typography, inherited paper/ink tokens and a Nebula Sans italic caption. The original illustration carries its own physical shadows and colours; these are artwork, not new interface tokens or machine evidence. Desktop art is a 3:1 panorama. At the 700px phone breakpoint the title and image occupy normal-flow grid rows, with bounded image overlap into the quiet paper. Enlarged text grows the title row before the illustrated subject and caption, resolving the finish review's title/art/caption collision.

The scoped finish disposition is ship: the sole requested fix is resolved. Captures in `.impeccable/review/` cover this route at desktop, phone and narrow widths in light/dark, plus tablet, wide, enlarged desktop and enlarged phone. Across both routes the retained evidence records 30 passing tests, 20 capture measurements with no affected-main overflow or axe violations, unchanged body content/links against the live baseline, and an empty scoped detector result. Source body preservation was checked byte-for-byte; rendered comparison uses textContent so responsive table-of-contents visibility does not produce a false difference. This is local build evidence, not deployment verification.

Artwork provenance is in `public/images/start-here-opening/provenance.json`; each of its four WebP exports has the exact generation prompt embedded in XMP and a matching `.webp.json` prompt sidecar. The retained asset check verifies all eight exports across both routes for dimensions, embedded prompts and recorded hashes.

Verification evidence is retained with the task/PR: `tests-final.log`, `measurements.json`, `asset-checks.json` and `detector.json`. These records cover the local build and affected openings; they do not establish deployment verification.

System consistency check: this remains a page-specific editorial extension, with no new global component or token. The binding family visual identity at umbrella commit `47dab618b`, §4, takes precedence over inherited DESIGN.md/sidecar instructions for tracked uppercase mono labels: labels use Nebula Sans semibold, sentence case and no tracking; mono remains for code, data and machine output. That pre-existing documentation drift is not repaired or canonized here. The shared footer's baseline overflow at 320px with 200% text remains outside this opening's scope.
