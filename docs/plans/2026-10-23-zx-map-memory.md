# Sinclair BASIC RAM measurements and 1 KiB variants

Update `src/content/patterns/sinclair-zx80/basic/rendering/tile-map.mdx` and the corresponding `sinclair-zx81` page. Preserve all readable CodeFromFile listings. Add measured tokenised component sizes, smallest successfully exercised RAM configuration, named checkpoint/sample headroom and an explicit distinction from an absolute peak/minimum claim.

Include the maintained `compact/` listings and their different storage/API trade-offs. ZX80 should reuse the generic routines/caller where verified; ZX81 may specialise dimensions/storage. Add verified stock-machine captures under `public/images/sinclair-zx{80,81}/patterns/basic-map/`. Update the shared `cross-platform/rendering/tile-map-queries.mdx` comparison and source pin after native checks pass.

Build using the exact samples revision, check content/types, compare all rendered code with source, and inspect phone/desktop layouts and native images. Push a review PR stacked on949, link the samples companion, update issue117 and retain the existing matrix’s coverage counts. Clean owned tools, preview, dependency caches and worktrees after verified remote retention.

Verified: 2,762 public pages build successfully against samples 829a0e098da2e5bf99b7385244d7b06dff650805. Content checks pass; type checking reports the existing 73-error baseline. Twelve route/viewport checks compare all maintained code inclusions (9/13), five native images per page, exact pushed source pins, outer overflow and mobile accessibility. Desktop/phone captures and test receipts are retained in the task outputs. Samples companion: code198x/code-samples#172.
