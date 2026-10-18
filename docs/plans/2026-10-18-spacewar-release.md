# Release the first game study

Owner authorises shipping docs #106 and website #824, then beginning Adventure / Colossal Cave as the second study. Preserve unrelated primary checkout work and use isolated branches/worktrees.

1. Review the final diff and current PR checks, publication/review flags and source/asset records. Run documented local release checks using existing prepared sibling assets and pinned dependencies. Report actual failures and resolve regressions before merge; keep human-play/source limits honest.
2. Ready and merge docs #106 first so pinned source links resolve, then ready/merge website #824 after checks. Verify merged SHAs, GitHub Pages workflow and live index/article/companions/review notices. No synthetic release post, RSS announcement or message to another person.
3. Retain release evidence and stop owned processes/remove temporary release caches/worktrees once commits and outputs are safe. A separate Adventure plan/branch owns the second study; preserve current priorities and inspect existing Vault coverage before writing.

## Verification and approved test maintenance

The documented release pipeline passed unit/content/prepared-player checks, seven announcement regression tests, the production build (2,468 pages), built-player decoding and offline links (229,018 links, zero errors). Its browser phase initially hit macOS sandbox launch restrictions; the same phase was rerun outside that restriction. Of 518 checks, 454 passed and 64 layout checks failed.

Two unchanged origin/main baseline checks reproduced the full-width/boxed-frame mismatch. Existing page sources deliberately span the viewport for section openings, retain a 1,264px reading frame, and use compact About spacing; Updates retains a bounded title within its full-width main. The article opening intentionally integrates inset breadcrumbs. The owner explicitly approved updating these assertions on 18 October after automatic review rejected the initial proposal as potentially bypassing tests. No assertion changes were made before that approval.

The updated suite passes all 290 layout checks across desktop/mobile profiles and 390/1,440/1,920px widths, including actual navigation and playground interaction. The 228 other browser checks passed without changes. A deliberately narrowed About main fails the geometry assertion; its built file is restored immediately. No product layout, shared dependency, historical-review flag or test enablement changed in this maintenance.
