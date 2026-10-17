# The Vault connected-history opening

## User-approved direction

The user rejected the C64-led opening as too narrow, selected a connected constellation over a chronological panorama, and clarified that women are one example within the whole history, not the organising theme. The user approved recording the broad scope in the Vault specification (companion docs branch codex/vault-connected-history).

## Direction contract

THESIS: Make relationships between different entities and decades visible, including subjects whose biographies or entries are not published yet.
OWN-WORLD: Existing paper, ink and magazine typography. Live names and precise vector relationship lines form an explanatory constellation; no invented portraits, decorative archival material or new dependencies.
STORY: Move among people, institutions, machines, languages, games and music. Each connection states a documented relationship; the arrangement does not claim a single chain of influence.
FIRST VIEWPORT: Large live title amid six open, connected groupings of named subjects. A compact legend distinguishes published links from future subjects. A direct search jump remains visible. On phones, the constellation reflows into the same readable named relationships.
FORM: Replace only the section opening within the established Vault surface. User-selected connected constellation; no new visual identity or concept tournament.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Tasks

1. Replace src/components/VaultOpening.astro with a broad typographic constellation; curate source-backed relationships in src/data/vault-constellation.ts. Verify current entry identifiers against getCollection at build time; unpublished subjects get plain labels, never invented article links.
2. Keep src/pages/vault/index.astro search, directory and features; add an anchor for the search jump. Update tests/vault-opening.spec.ts for the corrected intent, relationship scope, future coverage and search.
3. Run repository checks/build, one batched desktop/phone/320px inspection and accessibility/overflow checks. Apply one correction batch, confirm, obtain independent finish/documentation reviews.
4. Push an additive correction to existing PR810, rewrite its title/body around the final change, retain screenshot evidence and clean task workspaces/processes. Publish the approved specification clarification as a separate docs PR.

## Source scope

Ada Lovelace’s 1843 notes: Computer History Museum’s institutional account. Hamilton/MIT/Apollo: NASA institutional account. Dartmouth/BASIC/Kemeny/Kurtz: Dartmouth history. Contemporary article sources already cited by the reviewed Vault entries support Pajitnov/Tetris, Tramiel/Commodore/Atari, and Xenon 2/Bitmap Brothers/Bomb the Bass/David Whittaker. Credit shared work accurately; do not imply Hamilton worked for NASA, that the Bitmap Brothers wrote Xenon 2’s code, or that musicians directly composed every game arrangement. Full source URLs/locators belong with the curated data and rendered source notes.

## Review corrections

- Independent finish review: `fix` for relationship labels covered by node backgrounds. Reserve clear label coordinates and route each line through its own label so its association remains explicit.
- Documentation/source review: convert all opening font sizes and clamp endpoints to rem; use a font-relative container threshold so enlarged text receives the narrative layout. Remove the unsourced extra claim about the Engine never being built; the remaining Lovelace statement is directly supported by the linked CHM account.
- Confirm desktop, phone and 320px views plus medium width, 950px narrative adaptation and enlarged root text. Keep search directly available and all six source-backed paths intact.

## Final evidence

- Production build: 2,459 pages, 41 shared-frame families, search index complete. Repository checks: 33 test files, 239 passed and 9 skipped; content, imagery, links and prepared tools pass.
- Browser suite: 25 passed, 7 intentional device-specific skips. Existing Vault native capture/frame checks remain; new checks cover broad scope, no invented future links, source availability, title search, 150% root text and label clearance at 1200/1440px.
- Nine rendered cases: desktop, Pixel 7, 320px in both colour preferences, 1200px diagram, 950px narrative and 1440px with 24px root text. No accessibility violations or horizontal overflow. Label/node and label/label checks pass. An isolated browser fault injection confirms the clearance detector fails when a label is moved over a node.
- Independent full finish review identified label masking; post-fix verdict: `ship`, that finding resolved with no material regressions. All 18 supplied captures were valid. Documentation/source findings on font scaling and the extra Engine claim are resolved; final disposition: pass. Inherited DESIGN.md remains unchanged.
- Approved scope rule recorded in companion https://github.com/code198x/docs/pull/104. Website work updates existing PR810. No images, dependencies or new backlog issues were introduced.
