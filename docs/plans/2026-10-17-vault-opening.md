# The Vault collage opening

## Approved direction

Steve: “I wanted this to be a visual, not an actual mapping of subjects ... the goal is to hint at the connectivity not explicitly show it here.” Followed by: “Yes, that’s it. Try a layered, full-bleed collage that hints at the connections without spelling them out.” This supersedes the earlier subject-map proposal. Broad scope remains: people, institutions, machines, software and culture across decades. Women are one part of the whole.

## Direction contract

THESIS: Suggest connected computing history through visual juxtaposition and overlapping material, not names, nodes, labels or relationship lines.
OWN-WORLD: Original tactile editorial collage, paper/ink with copper and blue-green fragments, set within the established family magazine world. Live Fira Sans Condensed title over quiet paper; existing reading/UI type below. No new fonts or dependencies.
STORY: People, paper, mechanisms, circuitry, music and screen culture belong in one visual field. The image is expressly illustrative, not an archival photograph or a claim about named subjects.
FIRST VIEWPORT: Full-bleed 3:1 landscape art with two-line live title in the central quiet area; a separately composed 4:5 phone image preserves the visual mix on narrow screens. Caption, article/subject counts and search jump sit in the normal reading frame. Search, directory and existing features follow.
FORM: User-approved local replacement of the opening within the established Vault surface. No new visual world or concept tournament. Artwork and live typography are separate rendering layers; no subject graph or mapping data remains.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Tasks and verification

1. Generate original landscape and portrait collage plates. Inspect both. Store delivery WebP variants under public/images/vault-opening with the exact prompts, tool/source identities, source hashes, dimensions, processing and delivery hashes. Embed origin metadata. No borrowed portraits, archival scans or historic software screenshots.
2. Replace src/components/VaultOpening.astro with responsive picture, live heading and concise illustration caption. Delete unused src/data/vault-constellation.ts. Keep index search, directory and features; update tests/vault-opening.spec.ts around responsive artwork, heading, search and enlarged text.
3. Amend the draft specification in existing docs PR104 to preserve the user's exact visual-vs-mapping distinction. Review diff and whitespace; push the approved clarification without touching unrelated primary docs changes.
4. Run repository checks and production build. Inspect desktop, Pixel 7 and 320px in both colour preferences in one batch, plus enlarged text. Check image loads, full bleed, title clearance, reading-frame invariants, search and accessibility. One correction batch and confirmation if necessary.
5. Obtain independent Impeccable finish and documentation reviews. Push an additive correction to existing website PR810; rewrite its title and body around the final collage. Retain preview evidence, verify remote retention, remove task worktrees/build inputs and stop task-owned preview processes.

## Imagery basis

Original AI-generated editorial illustrations, not reproductions or edits of third-party works. Anonymous imagined human figures and artefact fragments are not labelled as named historical people, real machines or archival evidence. The caption makes the illustration status explicit. No third-party media licence is asserted. Preserve exact generation prompts and source files' hashes; WebP production processing is proportional resizing/encoding only. The portrait uses the generated landscape as a composition/style reference. The existing hardware/portrait/capture rules are unchanged.

## Verification and review

- Repository checks: 33 files, 239 tests passed and 9 skipped; content, imagery, links and prepared browser tools pass. Production build: 2,459 pages and shared-frame checks pass.
- Browser suite: 24 passed and 6 device-specific skips. Responsive art selection, full bleed, live title, explicit illustration caption, direct search, no-match recovery, enlarged text and image-failure fallback pass.
- Six core desktop/Pixel 7/320px colour-preference captures: zero accessibility violations and horizontal overflow. Enlarged desktop also passes. At 320px with 150% root text, the collage/title remain within the viewport; a separate 8.734px footer overflow is pre-existing, with identical 16-element geometry reproduced on the unchanged published site. No global footer change is included.
- Independent full visual review: `ship`, no material fixes. Documentation review found the CLI's WebP sidecar fallback did not embed prompts; added exact XMP prompt metadata without pixel re-encoding and refreshed all delivery hashes/byte counts. Decoded-pixel hashes prove all four files are unchanged visually.
- All four shipping rasters have exact embedded prompts plus sidecars and the full provenance record. The original generated landscape and portrait remain retained at their generator source. No raster is represented as historical evidence or a licensed third-party photograph.
- Documentation re-review independently verified all four embedded prompts and refreshed hashes/byte counts: resolved, pass, no remaining material gaps. Built delivery hashes match the source record, embedded prompts survive the build, and all four WebPs decode in the browser.
