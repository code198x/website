# Vault homepage: discovery and connections

We want readers to discover interesting subjects and understand the connections between them. Keep the approved family identity and Vault category colours. This is a homepage composition decision, not a new visual identity or a site-wide relationship graph.

## Current evidence

The homepage has a curated colour-clash feature, related article links, title search and a complete subject directory. The related links do not explain their relationships. `src/lib/backlinks.ts` concerns lesson backlinks, not relationships between Vault articles.

The reviewed articles `games/commando`, `people/rob-hubbard`, `hardware/sid-chip` and `techniques/arpeggio` offer a real example: Hubbard composed the C64 game's music; SID is the C64 sound chip; arpeggios are one technique used in its music. Copy must preserve the distinction between the arcade game and its C64 conversion. Other features must show the library's breadth, rather than making this one thread stand for the whole Vault.

## Selected composition

Approved in chat: “The Roll”, subject explorer (candidate 3). Build code-first. The full directory occupies the left column, a Commando editorial introduction occupies the centre and explained connections occupy the right. On phones, search and a folded directory precede the story, followed by the connections in reading order. The existing illustrated colour-clash feature follows the explorer; further discoveries broaden the selection.

User correction during review: the design was wider than the actual page. Match the existing 1264px outer frame and 1200px inner desktop content width, including the masthead. Remove obsolete homepage column/capture overrides from `src/styles/site-frame.css` and `src/styles/editorial.css`; preserve their other surfaces. Prevent automatic grid minimums from letting captures widen the page. Actual Dizzy image files are 512×384; correct selection metadata and retain that width unless the viewport itself is narrower.

The 320px browser check also reproduced an 8px document overflow in the shared header: its non-shrinking wordmark left the menu button at x=328. In `src/styles/design-rollout.css`, allow the wordmark to shrink below 360px while retaining both 44px controls. The first recheck exposed stale Vite CSS (the served stylesheet still contained the old rule), so final width verification uses the production artefact.

The Commando introduction is a text-led connected story, not a replacement entry in the illustrated feature array: its article has no approved imagery. Keep the existing illustrated feature and its validation unchanged. Add `vaultExploration` and `vaultDiscoveries` beside that array, resolved by a narrow helper in the same library. Render connections through `src/components/VaultExplorer.astro`, shared with `/catalogue/vault-discovery/` in the existing catalogue route. Add negative validation cases to `src/lib/vault-features.test.ts` for missing, unreviewed and unconnected selections.

Candidate order recorded before the surface deal:

1. Editorial spread: annotated lead feature and three explained relationships.
2. Relationship map: linked subject clusters and a reading panel.
3. Subject explorer: an index beside a featured subject and explained connections.
4. Reading trails: curated routes through people, games, hardware and techniques.
5. Paired subjects: two subjects with their connection explained between them.
6. Cross-section: people, machines and media linked across columns.
7. Spotlight: one subject surrounded by grouped related links.

Impeccable surface/read seed `07685763` dealt 3, 4 and 5, with 3 leading. Present equal wireframes within the existing identity; code-first remains the default. No production UI changes before the composition is selected.

## Implementation plan after selection

1. Record the selected composition and responsive behaviour here. Preserve the specification's curated feature, related reading, full subject directory and title search.
2. Update `src/pages/vault/index.astro` and homepage rules in `src/styles/vault.css`. Keep category pages and article reading layouts outside scope. Preserve native capture sizes, every border pixel, and figure-width captions; reflow before shrinking.
3. If the selected composition needs authored relationship explanations, extend the existing selection in `src/data/vault-features.ts` and its validation in `src/lib/vault-features.ts` narrowly. Verify each relationship against reviewed article prose. Confirm the exact component-preview file before adding the preview. No dependencies or automatic graph inference.
4. Run the relevant feature validation, tests and production build. Check actual generated links, title search, keyboard use, mobile directory and no horizontal overflow. Inspect desktop and narrow browser renders, then make one combined correction pass.
5. Complete the Impeccable finish review and record the actual outcome. Publication is a separate next step; this plan does not claim the proposed homepage has shipped.

## System adoption note

This extends the incumbent family system within the [Vault surface contract](../../../../.impeccable/surfaces/vault-homepage.md). Source inspection confirms family paper and dark ink, Nebula Sans reading/UI type, Fira Sans Condensed heavy italic editorial headings, and JetBrains Mono counts and masthead metadata. The existing five labelled Vault colour families remain local: green play introduces Commando; destination categories supply the connection marks and labels. Square controls, open columns and thin rules carry the structure without a new shadow or motion vocabulary.

The selected subject explorer uses the site's 1264px outer / 1200px inner desktop frame. The full directory sits left, the Commando story centre and explained connections right. Below 1000px the directory moves above the story and initially folds when JavaScript runs; below 650px the story and connections stack. The illustrated colour-clash feature and four further discoveries follow. Capture rules retain the complete 512×384 images at 512px width, reclaiming surrounding space before permitting proportional reduction below a 512px viewport; captions stay within their figures.

Native links expose each reading destination, with hover underlines and visible focus outlines. Title search keeps its label, polite result count, empty state, Clear action and Escape handling. The directory uses native `details`, so its subjects remain available without JavaScript. There is no entrance animation.

`/catalogue/vault-discovery/` uses the same `VaultExplorer` and `VaultFeature` renderers, real selections and validation helpers as the homepage. Its route returns no production paths. Connection validation requires reviewed entries and an existing source-article link; the authored explanations still require editorial judgement. The feature retains article-owned images and captions. This note records inspected implementation and the selected direction: final verification is recorded below; this remains an unpublished local preview. Root `DESIGN.md`, `.impeccable/design.json`, `PRODUCT.md` and the family visual decision were not changed by this documentation pass.


## Verification outcome

- `npm test`: 174 passed, 9 existing skips. Feature selection validation has eight passing tests, including rejected invalid selections.
- `npm run build`: exit 0; 2443 generated pages, Pagefind completed. Existing Pagefind notices concern the emulator template without an outer HTML element and its supported default search UI.
- Production browser evidence at 1504, 1280, 512, 390 and 320px: header and mast align; document fits viewport; complete captures retain native width unless the viewport is narrower; captions fit figures. The new width assertion first failed on the actual 320px header overflow, then passed against the corrected production CSS.
- Desktop and mobile title search, phone subject-directory expansion and Commando navigation passed. The development component preview rendered both shared components. Eight production browser cases passed across the original run and targeted rechecks; six project/viewport combinations are intentionally skipped. Two image checks initially read an unloaded image; explicit loading waits and targeted rechecks passed. No page-image source changed for those rechecks.
- All 68 unique internal homepage link targets exist in the built output. Development catalogue routes are absent from production. `git diff --check` passed.
- Final screenshots and geometry: `198x/.impeccable/review/vault-homepage/{1504,1280,512,390,320}.{png,json}`. Opening: `opening.png`.
- Independent Impeccable review: **ship**, covering the local surface. Review: `198x/.impeccable/review/vault-homepage/review.md`. No remaining material fixes. No deployment or commit was made.
