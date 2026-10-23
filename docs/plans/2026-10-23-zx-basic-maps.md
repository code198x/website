# ZX80/ZX81 BASIC maps

Companion to the samples plan of the same date. Stack on the pending Ace FORTH website branch; leave all previous PRs open.

- Add `src/content/patterns/sinclair-zx{80,81}/basic/rendering/tile-map.mdx` with maintained CodeFromFile routines, room, caller, customisation and wrong/fixed excerpts. State expanded RAM and distinct array/arithmetic contracts. Explain Maths for Games links and non-drawing scope.
- Add verified native output to `public/images/sinclair-zx{80,81}/patterns/basic-map/`; inspect both correct/fault captures before publishing. Link both language ports from `cross-platform/rendering/tile-map-queries.mdx`.
- Pin the reviewed samples commit, build with that exact checkout, check content and type baseline, and compare all rendered listings with maintained source. Inspect phone/desktop screenshots, loaded native images, narrow widths and mobile accessibility.
- Push a review PR; update issue117 and the existing matrix only for the two new BASIC map cells. Stop preview and remove the owned checkout/cache after positive remote and UI bundle retention checks.
