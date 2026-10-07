# Release approved discovery and reading changes

Authorised 2026-10-07: “Let's roll out these changes too then.”

Scope: the approved Vault homepage/article/category work, Pattern Library index/facets/reading pages and component previews, their shared search/contents/figure fixes, and the Progress Bar source-comment correction. Preserve unrelated umbrella changes.

1. Inspect owning repository diffs and remote heads; check there are no unreviewed changes in the release set.
2. Run `npm run check:release` and focused Vault/Pattern/search browser suites against the final build. Record failures and resolve within scope without bypassing checks.
3. Commit the comment-only sample correction in code-samples; commit the coherent website release in website. Keep review screenshots local and preserve existing hooks.
4. Push the sample correction before website main, then monitor the resulting CI and Pages run. Do not create or manually send announcements.
5. Verify live page content and search/filters on the actual deployed site, recording commit hashes, workflow and outcome.

## Pre-release evidence

- Sample correction committed and pushed as `38fd09a15868f5d3e45aa0d9bf0fb32583891833`; executable lines compared with the parent and unchanged. BASIC listings and Build Verification CI both passed.
- Full `npm run check:release` passed: 183 unit tests, source/content checks (22,192 Vault references), prepared assembler/player checks, seven announcement regression tests, production build, 202 browser checks and offline link audit (220,456 references; zero errors).
- Focused release checks: 40 passed on Astro preview; six intentional project-matrix skips (desktop width cases are not repeated in the mobile project). The development-only catalogue check passed separately on Astro dev.
- First source check reported `Vault links: 2 targets that do not exist.` Both were new test fixture links. Fixture IDs now refer to existing articles; missing/unreviewed/unsupported-link assertions are retained. The checker is unchanged.
- First focused run on the older Python server reported `net::ERR_CONNECTION_RESET` and `net::ERR_SOCKET_NOT_CONNECTED` for images. Rerunning the unchanged checks on Astro preview passed. A catalogue test returned 404 against production, where catalogue routes are deliberately absent; it passed on the development server.
- Screenshot dumps and the broader diagnostic review test stay local. No new RSS entries or manual announcements are part of this release.
