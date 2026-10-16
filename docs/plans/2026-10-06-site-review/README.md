# Review every Code198x page

We have accepted the homepage and Vault discovery direction, but their surrounding pages need a coherent review. Start with Vault articles and categories, then the Pattern Library, Timeline and Setup Guides. Review the full site's navigation and page families so important resources do not remain isolated.

User addition: it is especially important that readers know Asm198x exists. Review its visibility and explanation at setup and assembly entry points, in relevant lessons, and in family navigation. Check current toolchain documentation before making availability or command claims; a footer link alone does not establish that readers understand which tool assembles their program.

User addition: test search. Exercise the built site's global Pagefind search and the separate Vault title search at desktop and mobile sizes: real queries, Asm198x discoverability, empty and no-result states, keyboard interaction, actual result destinations, dismissal and reopening after navigation. Record observed failures without hiding them behind a generic build pass. Parent owns `tests/site-review-search.spec.ts`; the implementation reviewer owns other browser evidence.

This pass produces evidence and a prioritised design plan. It does not redesign production pages or publish changes. Preserve the accepted family identity, exact Code Like It's 198x name, uncropped captures, native-or-viewport image sizing and bounded captions. Keep existing route and content contracts.

## Work and verification

1. Inventory every HTML artefact in the current completed `dist/`, separate redirects and auxiliary documents from content pages, and map content routes to `src/pages/**/*.astro`. Save `inventory.json`, `routes.csv` and `source-coverage.csv` here using `inventory.py`. Fail the inventory if there are no content routes; explicitly list unmatched routes.
2. Independently review the design and implementation. Assessment A reads the visual system, source templates and fresh browser views. Assessment B checks source/detector evidence and representative browser behaviour without seeing A's conclusions. The user approved these two reviewers. Keep B's findings out of the synthesis until A finishes.
3. Cover Vault home/category/article; Pattern Library index/facet/detail; Timeline index/decade; Setup index/native/ROM; approved homepage/Start Here; system/track/module/lesson/getting-started; shared-subject overview/lesson; editorial index/article; project/resource/utility pages. Record actual visual coverage separately from full route inventory. Desktop and narrow evidence should show hierarchy, reading measure, discoverability, complete imagery and interactions.
4. Synthesize confirmed issues into `review.md` with severity, exact source locations, affected page families, representative screenshots and a recommended sequence. Separate measured defects from design judgements and coverage gaps. Do not treat pre-existing findings as regressions without evidence.
5. Present the recommendations and choose the first redesign direction with the user. Any subsequent multi-page redesign gets a concrete preview before rollout, with shared component previews alongside it.

## Evidence baseline

- Current local production build: `http://127.0.0.1:4396/`, completed before this review (2443 generated pages; successful Pagefind step).
- Current source includes the accepted, unpublished Vault homepage change. Do not discard those working changes.
- Existing development server on 4400 is slow; use the completed static build for review. Neither server was started solely for this critique.
- Source and decision authority: umbrella `PRINCIPLES.md`, `PRODUCT.md`, `DESIGN.md`, `decisions/family-visual-identity.md`; Code198x `.github/AGENTS.md`, `docs/PROJECT.md`, and relevant specifications.
- Main task artefacts: this folder. Independent browser evidence: umbrella `.impeccable/review/site-review/`.

## Limits

An inventory of every route does not mean every article was visually read. Template-based review must name the inspected examples and reserve content-specific checks for further batches where needed. No new dependencies or architecture changes are authorised by this review.

## Completed review

- [Combined findings and implementation order](review.md).
- [Independent design assessment](design-assessment.md): 21 desktop openings and two reliable mobile openings, plus source inspection.
- [Independent implementation assessment](implementation-assessment.md): 38 routes on desktop and Pixel 7, 18 supplementary width observations, navigation checks and live Asm198x instruction links.
- Full inventory: 2443 Astro pages, 1264 redirects, three embedded experiment documents, one standalone emulator and one auxiliary template. No unmatched content-page owners or multiple/missing h1 elements in this static inventory.
- Search: two added Vault-search cases pass; two global-search cases fail before the input appears. The independent check reproduces global failure. Query ranking and subsequent global interaction remain blocked.
- Setup: eight route/device cases reproduce non-working OS tabs after client navigation. Direct loading works.
- Source assertions and browser evidence identify the root causes; no production changes were made. Failing review tests are preserved rather than converted into a passing baseline.
- Browser evidence from Assessment B lives in the website's `.impeccable/review/site-review/`; the parent's search captures live in umbrella `198x/.impeccable/review/site-review/`. Both are retained. No critique-only server or overlay remains running; the existing site previews were preserved.
