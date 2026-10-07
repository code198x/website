# Vault inner-page documentation check

The extension retains the recorded family palette, font roles, paper material and square controls. No changes to umbrella `DESIGN.md` or `.impeccable/design.json` are needed to describe a new visual world. Both remain untouched. This is a source-based documentation check, not an independent browser validation or production-release claim.

## Evidence checked

- Umbrella `PRINCIPLES.md`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `.impeccable/surfaces/vault-inner-pages.md` and the relevant palette, type, capture, table and drift provisions of `decisions/family-visual-identity.md`.
- Local `_198x-ui/tokens.css`, `_198x-ui/components/SiteNav.astro`, `src/styles/site-tokens.css`, `src/styles/editorial.css` and `src/styles/vault-inner.css`; the separate shared `198x-ui/tokens.css` was sampled to check recorded adoption drift.
- `VaultArticleHeader.astro`, `VaultArticleConnections.astro`, `VaultDirectory.astro` and `VaultReadingPaths.astro`; their use in `vault/[...slug].astro`, `vault/category/[slug].astro` and `catalogue/[...slug].astro`.
- This plan's `README.md`, `finish-review.md` and `asset-provenance.json`, plus the saved empty `.impeccable/review/vault-reading/detector.json`. The finish review reports inspection of 22 captures; this documentation pass did not independently inspect their pixels or repeat its browser checks.

The opening component preserves explicit image dimensions and supplies a caption within its figure. CSS uses native width limited by viewport width, proportional height, pixelated rendering, square corners and no crop. Wrapping remains inside table cells while table markup stays intact. These source rules support the recorded capture and table requirements; actual presentation remains a browser-check responsibility.

The article template still renders original MDX content and retains review-status, citation and metadata logic. Its desktop grid now declares `max-content minmax(0, 1fr)` rows, with `auto` rows below 900px, implementing the finish review's requested rail correction. This confirms the source change, not its final rendered outcome.

The category directory uses labelled search, pressed alphabet filters, count announcements, empty/reset states and native summary disclosures. All four new patterns have a preview in `/catalogue/vault-reading/`; `getStaticPaths()` returns no catalogue paths in production. No new family primitive or sidecar specimen is required for these page-owned patterns.

The owning agent reports completed catalogue browser checks at 1440px and 412px: the expected article header, three connections, three question paths and 92 directory entries; Arpeggio search and reset; and no overflow. `catalogue-desktop.png` and `catalogue-mobile.png` were refreshed. This pass confirmed that generic catalogue heading/link selectors now target only `main > h1` and `main > p a`, preserving the actual component styles. The owning agent's computed-style comparison with production reports an 80px title, category ink `rgb(112, 82, 0)` and connection ink `rgb(48, 92, 140)`. This pass did not repeat those browser checks.

The provenance manifest records five reused PNGs with origin descriptions, pixel-chunk hashes and `pixels_unchanged: true`. It explicitly leaves the diagrams' original generator unknown. This check read that record; it did not recompute hashes or establish historical provenance beyond the recorded source.

## Five-line system summary

1. Palette: paper `#f6f4ee`, established strong/body/muted inks, and the five labelled Vault category families remain local to their approved exception.
2. Type: Nebula Sans carries reading and controls; Fira Sans Condensed Heavy Italic carries magazine headings. The new stylesheet now uses the family's rem-based size tokens, with the binding 5rem hero and 84/80 leading supplied as fallbacks where the kit lacks them.
3. One Spot Ink Rule: contextual ink remains the family default, with the approved Vault category treatment supplying these pages' labelled subject colours.
4. Magazine Container Rule: editorial headings use the magazine face; article prose and directory descriptions retain the reading face.
5. Object and Interface / Real Glyph Rules: controls remain square; authentic capture pixels and the selected existing wordmark identity supply visual character without new logo construction.

## Drift and limits retained

The existing design record already flags the separate shared kit's older dark/reading tokens, the paper kit's absent hero step and SiteNav's non-inverse current state. The sampled source still supports those observations. The existing sidecar also includes an Eyebrow specimen; this pass neither extends nor canonizes that craft-floor conflict. None is repaired within this ordinary extension.

The earlier local pixel-size divergence has been corrected in `vault-inner.css`: opening titles now step through hero, display and h1 tokens at the responsive breakpoints; summary, descriptions, controls and headings use the established size and leading tokens. Scoped overrides also anchor inherited article prose, TOC, captions and category introduction/feature text. Existing pixel-based sizes elsewhere in `editorial.css` remain outside this slice and are not promoted into the family record.

The final source pairs the mobile subtitle's body size with body leading and the article h2's h3 size with h3 leading. The directory status uses a 16px top margin on the 4px spacing unit. These checks close the three reported source follow-through items without changing the family record.

Final verification is complete according to the owning agent: the production build generated 2,443 pages and exited successfully; post-correction captures were refreshed; and the desktop rail gap measures 28px. This pass read the saved `browser-checks.txt`, which records 24 passing desktop/mobile tests, including directory search and alphabet/reset controls, global Asm198x search and navigation, capture widths, reading layouts and proportional type growth with the reader's root font size. The build, geometry and computed-style results are attributed to the owning agent; this documentation pass did not rerun them. It makes no independent historical fact-check claim.

The extension is documented against the preserved family design system. Umbrella `DESIGN.md` and `.impeccable/design.json` remain unchanged; no new palette, font role or visual world has been adopted.
