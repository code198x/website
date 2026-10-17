---
version: 1
slug: "src-pages-updates-index-astro"
primary_target: "src/pages/updates/index.astro"
related_targets: ["src/components/UpdatesOpening.astro"]
---

# What’s New opening

Mode: Read; local extension. User-approved compact masthead, 17 October 2026. Tracked in #818 under #802.

## Direction contract

THESIS: Give the changelog the character of a small publication while keeping recent entries close.

OWN-WORLD: The existing paper/ink magazine voice, expressed through live Fira heavy italic lettering and a small stack of CSS paper shapes.

STORY: Recognise the update feed, read the retained introduction, then browse recently published entries.

FIRST VIEWPORT: A compact live “What’s new.” title, publication motif and ink rule, followed by the existing introduction and feed. It is not another illustrated panorama.

FORM: User-approved typographic treatment, implemented with CSS rather than a generated raster or new dependency.

FINISH: Complete the scoped finish review and system consistency pass. Unreviewed and undocumented is unfinished.

## Built composition — 17 October 2026

The title uses Fira Sans Condensed heavy italic (900) at clamp(3.375rem, 9vw, 7rem), line-height .99 and -.025em tracking. The publication motif uses three rotated rectangular paper shapes, inherited surface/page/ink values and a local amber fill (#eec04d). That fill belongs to this small motif, not a new global spot-ink token. The motif is decorative and hidden from assistive technology; the h1 remains semantic text.

The masthead uses the shared width and gutters, a 2px ink rule and 2.25rem top padding. At 700px and below the typography and motif reduce; at 360px and below the motif disappears to preserve title space. There is no raster, motion or added interaction.

Keep the publication-date filter, feed ordering, entry text and links intact. The first viewport should lead into actual updates, rather than becoming a tall poster.

## Verification boundary

This brief records the inspected source composition; the task’s finish review, browser checks and deployment are still in progress. Retain the actual test/capture evidence and scoped disposition with the reviewed change.

This is an ordinary local extension; preserve inherited DESIGN.md and sidecar. Approved family identity at umbrella commit 47dab618b overrides older tracked-uppercase/mono label guidance. That existing documentation drift is neither repaired nor canonized here.
