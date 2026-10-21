# Game Studies within the Vault

The owner chose the Vault as the initial home, retaining the option of extracting Game Studies later. Build on the existing article composition, not a new visual identity. Keep the PR draft; no merge/deployment or historical sign-off.

1. Add src/data/game-studies.mjs with stable study slug, reviewed state, metadata and central current base/companion paths. Add /vault/studies/ and /vault/studies/spacewar/ plus three companion routes. Reuse FeatureArticle/ArticleOpening/ArticleFigure in SpacewarStudy.astro; preserve development-only specimen and aliases. Update the canonical-source sync links.
2. Add an illustrated house-style index with one available study. Add a Game Studies directory/search destination on /vault/ and contextual study links from the two supporting game entries. No new top-level nav, Vault category or coming-soon entries. Keep source text/assets independent of route ancestry.
3. Extend exact-route link and sitemap validation to the new family; reject unknown study paths. Retain noindex and human-review notice until the study is approved. Verify built output, metadata correspondence and routes, then desktop/phone capture, a bounded finish review and extension documentation.
4. Update canonical docs placement first, sync its committed revision and retain offline review exports. Push both existing draft PRs, verify remote SHAs, stop owned servers and clean task worktrees/caches. No dependencies, new artwork or unrelated sidebar repair.

## Verification and handoff

The final Astro build produces 2,468 pages. The built-route check passes all five declared study/index/companion paths, publication state and sitemap correspondence, and is included in the normal build command. Shared frames pass across 47 rendering families; whitespace checks cover 207 templates; all 25,997 Vault links resolve. A deliberate unknown-study link is rejected and removed after the probe. The first build check correctly rejected stale catalogue companion links; syncing before the final build resolved them. The final built footer matches docs revision 355bb36.

Eight desktop/Pixel 7 article tests and 239 unit tests pass, with nine existing skips. Six built index/article views at 1440/390/320 pixels pass loaded images, overflow, breadcrumbs, noindex and axe; Vault search and companion navigation work at each width and unknown study URLs return 404. The established 15-view article/companion/specimen pass also passes. The finish reviewer returned ship for the new index, placement and discovery with no material fixes; the documenter checked the final source/build evidence. Original artwork is reused and labelled; no new assets or dependencies. Existing shared Vault reference-sidebar heading-order evidence remains outside this extension.

The design context loader reported an unset comp/code preference for future showcase work; this Read-mode extension uses code directly and does not change configuration. A saved preference can be chosen for a later showcase task. Installed Astro 7.2.9 reports 7.4.0 available; no upgrade is included. No merge/deployment.
