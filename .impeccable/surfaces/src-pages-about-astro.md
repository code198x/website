---
version: 1
slug: "src-pages-about-astro"
primary_target: "src/pages/about.astro"
related_targets: ["src/components/AboutOpening.astro"]
---

# About opening

Mode: Read; local extension. Audience: new visitors understanding the project. Concept and implementation/integration approved on 17 October 2026. Scope only opening; retain body, links and BitPicture.

## Direction contract

THESIS: Give the existing project purpose a visual counterpart through the approved imagined opened machine, rather than introduce a new technical claim.

OWN-WORLD: Paper/ink and live Fira heavy italic heading above Nebula reading. Original cream casing, green circuits, amber planes and paper pixels provide physical depth, not new UI colours.

STORY: Understand the invitation to investigate and make, then read the existing mission and try the BitPicture.

FIRST VIEWPORT: Full-width panorama, existing heading live on quiet left and opened machine on right. Square phone composition places the heading above the machine. Honest caption and existing lead follow in normal reading frame.

FORM: User-approved imagined computer layers; seed not applicable to a precisely pinned local extension. Code-led integration of original artwork, not a service diagram or whole-page comp.

FINISH: unreviewed and undocumented is unfinished; this local extension ends with the finish review, scoped verdict, a consistency check against the inherited design system, and provenance on every shipping raster. The inherited DESIGN.md and sidecar are preserved.

Preserve inherited DESIGN.md and sidecar; only verify consistency. Quality bar: exact heading/copy preserved, dimensional layers remain bold, no typography overlaps the machine on phones, all existing content and BitPicture work. No motion, dependency, claimed real machine or historical evidence.


## Built result and verification — 17 October 2026

The opening uses live Fira Sans Condensed heavy italic typography, inherited paper/ink tokens and a Nebula Sans italic caption. The original illustration carries its own physical shadows and colours; these are artwork, not new interface tokens or machine evidence. Desktop art is a 3:1 panorama. At the 700px phone breakpoint the title and image occupy normal-flow grid rows, with bounded image overlap into the quiet paper. Enlarged text grows the title row before the illustrated subject and caption, resolving the finish review's title/art/caption collision.

The scoped finish disposition is ship: the sole requested fix is resolved. Captures in `.impeccable/review/` cover this route at desktop, phone and narrow widths in light/dark, plus tablet, wide, enlarged desktop and enlarged phone. Across both routes the retained evidence records 30 passing tests, 20 capture measurements with no affected-main overflow or axe violations, unchanged body content/links against the live baseline, and an empty scoped detector result. Source body preservation was checked byte-for-byte; rendered comparison uses textContent so responsive table-of-contents visibility does not produce a false difference. This is local build evidence, not deployment verification.

Artwork provenance is in `public/images/about-opening/provenance.json`; each of its four WebP exports has the exact generation prompt embedded in XMP and a matching `.webp.json` prompt sidecar. The retained asset check verifies all eight exports across both routes for dimensions, embedded prompts and recorded hashes.

Verification evidence is retained with the task/PR: `tests-final.log`, `measurements.json`, `asset-checks.json` and `detector.json`. These records cover the local build and affected openings; they do not establish deployment verification.

System consistency check: this remains a page-specific editorial extension, with no new global component or token. The binding family visual identity at umbrella commit `47dab618b`, §4, takes precedence over inherited DESIGN.md/sidecar instructions for tracked uppercase mono labels: labels use Nebula Sans semibold, sentence case and no tracking; mono remains for code, data and machine output. That pre-existing documentation drift is not repaired or canonized here. The shared footer's baseline overflow at 320px with 200% text remains outside this opening's scope.
