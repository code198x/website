# Release 88 approved Vault entries

Steve Hill approved **all batches for release** on 28 October 2026. Five pending website PRs (#1310, #1334, #1351, #1368 and #1385) cover 88 distinct entries: 17 chips/display entries, 23 languages/makers, 16 music/sharing, 16 compression/authoring and 16 games/engines. Earlier attached batches are already merged and published.

The exact release list and before/after hashes are in `entries.json`. Every entry retains `ai_generated: true` and now has `reviewed: true`. The other 1,533 article files remain byte-identical. Existing authoring reports record their then-unreviewed status; this report records the subsequent human sign-off.

For 82 articles, only the review flag changed. Six game articles also receive field-specific `sources.released` mappings to the evidence already cited under context. Wolfenstein 3D gains a corroborating original-publisher citation in its visible Sources list. No historical date or narrative claim changed. The source checker had missed those dates when they were quoted strings during an earlier draft check; after their numeric correction it correctly reported six unmapped claims. All 1,298 dated claims now have field-specific evidence. The permitted citation changes are individually recorded, and reversing them plus the review flags recovers all 88 approved originals byte for byte.

Current main's dependency updates were merged into the top branch without conflicts. The five existing PRs will merge from top to bottom so that only the final main merge triggers the full Pages deployment. This preserves each batch's review history.

## Verification

- Full check passes: 220 tests in 34 files; five baseline-key tests; the existing 73 type errors and no new ones. Sample build: 1,429 units and 3,156 staged artefacts.
- Production build passes: 3,612 routes. Source, Vault links and imagery checks pass; all dated fields are now cited.
- Built verification: all 88 approved source hashes, unchanged narrative, reviewed/indexable canonical pages, sitemap membership, 861 outgoing Vault links/fragments and 21 image hashes pass. The other 1,533 article source hashes are unchanged; Star Control remains an unreviewed/noindex control.
- All 176 desktop/Pixel 7 checks pass: HTTP 200, review/indexing state, expected loaded images with alt text, no horizontal overflow, no page exceptions and no WCAG A/AA article violations. Representative screenshots are retained.
- A deliberate false review flag is rejected by the source-hash control; byte-exact restoration passes.
- All 3,178 backlog rows validate against the matching site; all 19 regression tests pass.

The separate prose-date checker still reports two unrelated pre-existing disagreements, unchanged here:

```text
Facts stated in both frontmatter and prose: 398
Disagreements: 2

  games/diablo
    released: 1996 in frontmatter, 1997 in the prose
  people/louis-castle
    born: 1965 in frontmatter, 1964 in the prose

  The prose is usually right: it is what a person read and wrote.
  Check before copying either way.
```

## Publication handoff

A green build is readiness, not publication. After the final main merge and successful Pages deploy, `verify-live.py` checks all 88 live article texts against this build, their review/indexing/canonical state, incoming/outgoing links and fragments, all 21 image hashes and sitemap membership. Only successful positive evidence permits marking the 88 retained candidate records published and closing their writing issues. The companion docs audit will retain the deployment revision and live results.
