# Field Notes opening — implementation plan

Issue: https://github.com/code198x/website/issues/812
Parent: https://github.com/code198x/website/issues/802
Date: 17 October 2026

## Decision and approval

Steve approved the workbench concept as the direction and requested this implementation plan. The concept and implementation are approved. Steve authorised building desktop and phone previews on 17 October; merging and deployment remain pending explicit approval. This plan does not authorise work on the other section openings.

## Intended result

A full-bleed, tactile editorial opening for `/field-notes/`: overlapping paper and abstract traces on the left, electronics and a magnifying glass on the right, connected by the loose rust-coloured thread. Keep the calm paper area for a large live **Field Notes.** heading in the existing Fira Sans Condensed Heavy Italic magazine voice. Keep “Development stories.” as supporting live text and preserve the existing introduction below the artwork.

The composition should feel like an investigation in progress. Abstract marks are decorative, not code, oscilloscope evidence or reproduced documents. Use the visible caption: “An imagined investigation workbench. Original AI-generated illustration.” No movement is needed; the depth comes from the artwork, overlaps and live type.

## Bounded tasks, files and verification

1. **Prepare the artwork in a separate design workspace.** Start from the approved 2172 × 724 concept and its saved exact prompt. Produce a desktop panorama and a separately composed phone variant, retaining the keyboard, paper, magnifier and thread without squeezing a desktop crop into a narrow viewport. Keep title text out of the raster. Compare desktop and phone proposals together before integration.
   - Proposed website destination after approval: `public/images/field-notes-opening/`, containing responsive WebP exports, source/prompt records, README and `provenance.json`.
   - Verify: inspect the art at actual intended sizes; no accidental letters, false technical figures or clipped essential elements; record dimensions, hashes, exact generation/edit prompts and processing. Embed prompts inside each delivered raster as well as sidecars. Compare optimised exports with the source and record their byte sizes.

2. **Build the opening after integration approval.** Add a narrowly scoped `src/components/FieldNotesOpening.astro`, following the existing Vault/Demoscene composition and frame conventions. Use an art-directed picture with explicit intrinsic dimensions, responsive sources, decorative empty alt text, a live h1 and the visible illustration caption. Prefer the approved composite and separate live typography; additional transparent raster layers are warranted only if needed for composition. Keep enlarged text free to grow rather than clipping it to a fixed-height image.
   - Verify: the title and introduction remain useful when images are unavailable; sensible heading order, contrast and keyboard navigation; no new dependencies, general hero framework or animation.

3. **Connect only the Field Notes index after approval.** Update `src/pages/field-notes/index.astro`: replace its PageHeader with the new opening, use the existing Layout masthead option to avoid a redundant section strip, and keep the story grid in its normal PageFrame. Retain the present introduction, collection queries, draft/date filtering, explicit `order`, article links and upcoming count. Change only opening-related imports/styles; article cards and article templates are outside this task.
   - Verify: compare rendered story destinations/order and upcoming visibility with the baseline; the opening must not change which stories publish. Check the first story remains easy to reach on phones, adding a live “Read the stories” anchor only if the composition benefits from it.

4. **Verify the reviewable implementation.** Run the existing build and applicable content/imagery checks. Use the existing section-opening browser-test conventions; add a focused Field Notes check only for meaningful new invariants such as live title, correct responsive image delivery and access to the preserved story list.
   - Inspect actual rendering at 320, 390/Pixel 7, 768, 1440 and 1920 CSS pixels, enlarged text/200% zoom, image failure and reduced-motion preference. Check both colour preferences against the existing site behaviour. Confirm no horizontal overflow, stable image space, correct phone source selection, readable title/caption, working links and acceptable image transfer sizes. Run an accessibility check on the affected main content.
   - Save desktop/phone screenshots and report the actual checks and image weights in the PR. Do not claim broad browser or device coverage from Chromium viewport checks alone.

5. **Present and ship only when authorised.** Provide the preview, desktop/phone captures, credits/provenance and a focused PR for #812. Preserve the approved composition through review. After explicit deployment/merge approval, merge, verify the live artwork delivery and story links, then close #812 and update #802. Clean up task-owned previews, caches and temporary worktrees after preserving the commits and evidence.

## Existing source anchors checked

- `src/pages/field-notes/index.astro`: current PageHeader, story collection gates and grid.
- `src/components/PageFrame.astro`: existing content-frame geometry.
- `src/components/VaultOpening.astro`: existing full-bleed art-directed picture and live title precedent.
- `tests/section-openings.spec.ts`: existing section-opening browser checks.
- Website main audited revision: `62552e4cca5c173a70da80c8d3551f35c97c4009`. Recheck main and binding visual/imagery decisions before implementation.

## Concept record

Approved direction: `field-notes-concept.png`, original generated editorial artwork. Its SHA-256 is `d9d0f2f595803a7b1a1349a25edf2caa0ca4c59c2a92637a34dd483e779b4690`. The exact prompt is saved in `field-notes-prompt.txt` and embedded in the PNG. No third-party imagery is required for this treatment.
