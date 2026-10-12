# Reduce overlapping Vault articles (#369)

## Agreed scope

Merge Raster Tricks into Raster Effects. Keep the history/method, problem/response,
general/specialist and product/technology pairs separate, with concise cross-links.
Preserve unique examples, source attribution, images and executable code.
This is an editorial consolidation, not a new full factual review of these entries.

## Steps

1. In `src/content/vault/techniques/raster-effects.mdx`, absorb the unique history,
   linecrunch/AGSP descriptions, terminology and limitations from
   `src/content/vault/techniques/raster-tricks.mdx`, with their sources. Remove the
   latter only after checking that material is retained. Keep Raster Interrupts.
   In `astro.config.mjs`, redirect both `raster-tricks` and the older
   `raster-tricks-101` alias straight to Raster Effects. Update incoming links in
   `techniques/stable-raster.mdx`, `techniques/game-loop.mdx`,
   `techniques/raster-interrupts.mdx` and `hardware/vic-ii.mdx`.
2. Shorten the technical overview in `src/content/vault/emulators/emulation.mdx`;
   retain detailed engineering in `techniques/emulators.mdx` and move any unique
   technical detail there. Remove citations that no longer support retained text.
3. In `src/content/vault/techniques/attribute-aware-design.mdx`, replace the repeated
   attribute-memory/bit-table explanation with a brief reminder and a link to
   Colour Clash. Keep the design examples, captures and attribute-as-data material.
4. In `src/content/vault/technologies/physics-engines.mdx` and, where necessary,
   `techniques/ragdoll-physics.mdx`, keep general simulation/middleware in the former
   and character-animation detail in the latter. In `hardware/force-feedback.mdx`,
   shorten the Rumble Pak history in favour of its dedicated entry, retaining the
   distinction between vibration and directional resistance.
5. Verify retained code and image references against the baseline, check each moved
   source and unique paragraph, run content checks and the production build, inspect
   affected rendered pages on desktop/mobile, and exercise both legacy redirects.
6. Commit and push the bounded change, create a PR referencing #369 without closing
   it, follow checks and publication, and verify the live pages. Remove task-owned
   previews and temporary files. Preserve unrelated untracked work.

## Evidence boundaries

All affected entries already carry `reviewed: true`; preserve their existing review
state. This change does not claim a new human fact-check or reopen the broader
reference-library and candidate-entry inventory. Follow the restricted-provenance
decision for any manufacturer-manual wording encountered in the edited passages.

## Verification completed

- Content checks passed: 25,956 internal Vault references resolve. The platform
  balance report still emits advisory warnings for existing entries elsewhere.
- Production build passed: 2,451 pages; shared frame checked across all 36 rendering
  families; Pagefind generated. Vite reports its existing large-chunk warning.
- Compared against the baseline: all 28 code blocks, three Figure components and
  existing review flags in changed articles are unchanged.
- Chromium checked nine articles on desktop (1440px) and Pixel 7: headings and
  content render, no page overflow, no WCAG A/AA axe violations. Visually inspected
  the merged raster section at both sizes.
- Both retired raster URLs reach Raster Effects directly and retain `#the-tricks`.
  The other former section IDs are present, and incoming links target the VIC-II
  section. No source content still links to the retired article.
- Retained the earlier raster table's named credits and dates alongside linecrunch
  and AGSP. Checked the transferred ZZAP!64 quotations against the held reading
  text. Added direct source references for Crest's modes and the VSP investigation.
- Replaced the encountered restricted SNES-manual quotation with a paraphrase
  supported by Martin Korth's public Fullsnes reference.
