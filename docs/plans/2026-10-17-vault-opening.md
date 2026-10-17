# The Vault opening

Add one bounded section opening before the event. Preserve the existing search, subject directory, editorial features and article pages.

## Direction contract

THESIS: Make the Vault's connections visible before the reader starts browsing.
OWN-WORLD: Existing paper, ink and red magazine identity; Fira Sans Condensed display lettering, Nebula Sans labels, authentic hardware photography. No new fonts or dependencies.
STORY: Follow the Commodore 64 through its SID sound chip to Rob Hubbard's Commando soundtrack. All destinations already exist and the relationship is already documented by the current Vault exploration.
FIRST VIEWPORT: A full-width paper opening, huge live The Vault lettering on the left, a real C64 photograph on the right, and a labelled reading path underneath. Search immediately follows the opening.
FORM: Local extension of the existing Vault index and established family identity; no concept roll or replacement visual world. User delegated the section choice and approved layered imagery across the preceding section openings.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Tasks

1. Add `src/components/VaultOpening.astro`: live title, authentic existing C64 photograph, article connections, derived article/subject counts, and source credit. Reuse `public/images/systems-opening/c64-{480,960}.webp` and its existing provenance without modifying image content.
2. Replace only the index masthead in `src/pages/vault/index.astro`. Keep the existing `vault-index` reading frame, search script and directory. Scope full-width framing to this route and component.
3. Add behavioural checks in `tests/vault-opening.spec.ts`: meaningful linked destinations, accessible heading, source credit and search interaction. Preserve existing Vault frame/capture checks.
4. Run repository checks and production build. Inspect desktop, true mobile and 320px in both themes in a single batched pass; check overflow, image loading, keyboard interaction and accessibility. Correct material findings once, then confirm.
5. Obtain independent Impeccable finish and documentation reviews. Commit, push and open a reviewable PR. Remove task-owned worktree, inputs and preview process after confirming the remote retains the commit.

## Source and boundaries

C64 photograph: Evan-Amos, public domain, exact source and hashes in the existing Systems provenance record. The approved hardware-photo policy applies. No portrait, borrowed software capture, scanned artwork or generated hardware. No new historical claims or editorial feature selections.

## Verification and review

- Repository checks: 33 test files, 239 passed and 9 skipped; content, imagery, links and prepared browser tools pass. Production build: 2,459 pages and shared-frame validation pass.
- The new opening test fails against the previously published page, confirming it exercises the change. Production browser checks: 22 passed, 6 expected device-specific skips. The development-only component catalogue passes its separate check (1 passed); it is intentionally absent from production builds.
- Batched desktop, Pixel 7 and 320px captures, under light and dark browser preferences: no accessibility violations or horizontal overflow after correcting the rotated photo containment and background blend. The established paper palette remains the same under both preferences.
- Independent finish review: `ship`, no material fixes. Documentation review confirms inherited DESIGN remains appropriate and existing photo provenance is complete. Applied its label-weight correction against the current binding family identity §4 at umbrella main commit `47dab618b56fbb6a84d917ff3e29b22e84e36cd1`; the unrelated local umbrella branch carries an older copy.
- Final reviewed build and 22 production browser checks pass after the semibold correction. Documentation re-review confirms the finding is resolved, with no remaining source or documentation gaps.
