# Vault article and category

We are extending the approved Vault homepage into the reading and browsing templates. The local website is the reviewable preview; nothing is deployed.

## Direction

Use a compact magazine opening, original article-owned imagery where available, a calm reading column, and a useful contents rail. Text-led articles retain a deliberate text-led opening. Techniques pairs its illustrated lead with question-led reading routes, then the complete searchable A–Z directory. Preserve source text, citations, fact-check status, lesson backlinks and all entries.

## Work and checks

1. Repair the reproduced global-search loader failure in `src/components/Search.astro`: Pagefind emits a window constructor, not a module export. Verify with the existing `tests/site-review-search.spec.ts` against the built index. Other setup fixes stay in the site review backlog because this selected slice is Vault.
2. Add reusable `VaultArticleHeader.astro`, `VaultDirectory.astro` and `VaultReadingPaths.astro`; add reviewed editorial selections in `src/data/vault-reading-paths.ts`. Apply to `src/pages/vault/[...slug].astro` and `src/pages/vault/category/[slug].astro`, with page-owned `src/styles/vault-inner.css`. Preserve existing article date/citation logic and MDX content.
3. Add development-only `/catalogue/vault-reading/` component previews. Check Colour Clash, Commando, SID and Techniques, plus a category without curated features. Check responsive frame alignment, native captures/captions, contents links, search, keyboard controls and empty/reset states. Add a bounded browser regression in `tests/vault-reading.spec.ts`.
4. Run relevant unit tests and a production build. Batch desktop/mobile browser checks and screenshots; one correction batch if needed. Run the Impeccable finish reviewer and documenter, preserving the incumbent design system. Record evidence and remaining limitations here.

No new dependencies, content-schema changes, source-fact rewrites or deployment.

## Verification

- Final production build: 2,443 Astro pages; 1,264 redirect stubs marked noindex; Pagefind indexed 2,445 pages. Exit 0.
- `PLAYWRIGHT_PORT=4396 VAULT_REVIEW_PATH=.impeccable/review/vault-reading playwright test tests/vault-reading.spec.ts tests/site-review-search.spec.ts --workers=1`: 24 passed (23.3s). Saved output: `browser-checks.txt`.
- `vitest run src/lib/vault-features.test.ts`: 8 passed. These include negative cases rejecting unsupported article links, unreviewed selections and unowned imagery.
- Scoped Impeccable detector: empty findings (`.impeccable/review/vault-reading/detector.json`). No new ignore added.
- Representative pages: Colour Clash, Commando, SID, Techniques and People, desktop 1440×900 and mobile 412×839. Checked native captures/caption widths, document overflow, main-content axe checks, contents before prose on mobile, source status presence, combined directory search/A–Z, no-match/reset, client navigation and browser font scaling. Extra capture geometry at 512/600/900px.
- Global search: Asm198x query, result navigation, reopen, exact-phrase no results, clearing, Escape and focus return. Vault title lookup: punctuation, empty state, clear, Escape and back navigation.
- Five reused rasters carry repository-origin metadata. `asset-provenance.json` confirms their image-data hashes did not change. Four other pre-existing files in that directory are not used by this article and retain their existing metadata; they were not changed.
- Development catalogue contains article header, explained connections, question paths and full directory; confirmed 92 entries, 3 connections, 3 paths, Arpeggio query/reset and 412px document width. Catalogue route is absent from production output.

## Failures found and resolved

Initial mobile geometry failed with `Expected: 432 / Received: 412` on the article and `Expected: 452 / Received: 412` on Techniques: auto minimum grid tracks widened the document. Using `minmax(0, 1fr)` fixed the actual overflow while preserving the capture pixels.

The initial search check failed with `Locator: locator('.search-modal').locator('input[type="search"]')` and `Error: element(s) not found`. After fixing the real Pagefind loading contract, its accessible control is a textbox, so the test now uses that role. An unquoted nonsense query then produced `1 result for zzzxqnonexistentsearch198x`: direct Pagefind evidence showed a real prefix match to ZZ in ZZT. An exact quoted phrase gives a genuine no-result case and passes.

The independent finish review requested natural-height contents rows; this is fixed and asserted by a 28px gap to Details. The documenter identified new fixed-pixel type contrary to the binding family scale; new styles now use shared rem sizes and leading. A browser test confirms heading/body sizes grow 25% with a 25% larger reader root font.

Build advisories retained: `Some chunks are larger than 500 kB after minification`; Pagefind's supported Default UI notice; existing `emulators/template.html` lacks an outer HTML element. No dependency, bundling or emulator-template changes were made for this slice.

Source documentation: `documentation-check.md`. Review disposition and final fix scoring: `finish-review.md`. No deployment or commit performed. Native setup-tab repairs remain in the wider site-review backlog.

## Completed handoff

Independent review used the fallback reviewer workflow in a separate agent. Final disposition: **ship at the scored-fixes scope**. Desktop rail grouping, rem-scale correction and catalogue fidelity are resolved; see `finish-verdict.md`. The documenter verified the extension and preserved the family design files. Final catalogue comparison matches the production 80px heading and category/connection colours, with no mobile overflow. Production is served locally on 4396; component previews use the development server on 4400. Nothing deployed.
