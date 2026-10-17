---
version: 1
slug: "src-pages-setup-index-astro"
primary_target: "src/pages/setup/index.astro"
related_targets: ["src/components/SetupOpening.astro", "src/layouts/SetupLayout.astro"]
---

# Setup opening

Mode: Read; local extension. User-approved concept and implementation, 17 October 2026. Tracked in #817 under #802.

## Direction contract

THESIS: An imagined program becoming a visible result welcomes visitors to run their own work.

OWN-WORLD: The incumbent paper manual and magazine voice, with live Fira headings, Nebula reading and honest captions. Original imagined artwork hints at the subject without serving as archival or technical evidence.

STORY: Read the retained browser-first lead, choose an independent entry route, and use local setup when wanted.

FIRST VIEWPORT: Full-bleed original panorama with live type on the quiet left; at narrow widths the heading precedes the subject detail in normal flow. Caption and retained introduction follow in the reading frame.

FORM: Precisely pinned, user-approved original illustration and code-led integration. No new visual identity or concept tournament.

FINISH: Complete the scoped finish review, system consistency pass and provenance checks. Unreviewed and undocumented is unfinished.

## Scope to preserve

SetupLayout accepts an optional named opening slot. Only the overview supplies it; other setup routes keep their existing headers. The overview’s description stays live below the image, and the existing browser starts, platform selection and instructions remain.

Artwork records: `public/images/setup-opening/provenance.json` and adjacent prompt sidecars.

## Built composition — 17 October 2026

The live heading uses Fira Sans Condensed heavy italic (900), through the existing magazine token; the caption uses Nebula Sans italic at .875rem/1.6. Paper, ink and muted ink come from inherited tokens. Artwork colour and physical depth belong to the original illustration, not new interface tokens.

Desktop uses a 3:1 scene with a 20rem minimum, placing live text over the quiet left and the illustrated subject on the right. At widths up to 1000px, the title and image become separate normal-flow grid rows; the image shows a right-aligned subject detail at 1.8:1 below the heading. Growing text increases the heading row rather than covering the subject. The caption and original reading content follow in the shared width and gutters. No motion, new dependency or generic hero abstraction is introduced.

The artwork has empty alt text and is decorative; its visible caption identifies the original AI-generated illustration. Each image folder has two proportional WebP sizes, provenance, embedded exact-prompt XMP and matching prompt sidecars. Check these records whenever replacing an export.

## Verification boundary

The implementation and integration were approved by the user. This brief records the inspected source composition; it does not certify the in-progress finish review, PDF/browser checks or deployment. Keep the task’s test and capture evidence with the reviewed change, and record its actual disposition separately.

This is an ordinary local extension. Preserve the inherited DESIGN.md and sidecar. The approved family visual identity at umbrella commit 47dab618b takes precedence over older tracked-uppercase/mono label guidance: interface labels use Nebula Sans semibold, sentence case and no tracking; mono serves code, data and machine output. That pre-existing documentation drift is not repaired or canonized here.
