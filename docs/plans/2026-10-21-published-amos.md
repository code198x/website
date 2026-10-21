# Adopt the published AMOS highlighting preview

Steve approved adding the exact dependency @lang198x/amos@0.3.0. Preserve the
current amos language tag, Sätteri/static-span renderer and page styles. Do not
add optional language modes, change lessons or touch unrelated site-review work.

1. Add a focused regression to src/lib/kit-highlight.test.ts for whole scientific
   literals, single-quoted strings and command boundaries. Run it against the
   existing local grammar to establish the failure before adoption.
2. Pin the published package in package.json/package-lock.json. Replace AMOS
   imports in src/lib/kit-highlight.ts and src/lib/load-custom-languages.ts.
   Remove src/syntax/amos.tmLanguage.json only after verifying both imports moved
   and no consumer still needs it.
3. Add tests/amos-highlighting.spec.ts for real built lesson text/roles and
   narrow/wide light/dark views. Run focused static-span and retained Shiki API tests, the website check/build
   and inspect actual built AMOS lesson output for readable roles and exact text.
   Verify a real lesson sample through the published registration. Record scope
   and failures in docs/plans/2026-10-21-published-amos.md.
4. Commit/push only this change, read CI/deployment outcome, preserve unrelated
   review files and clean task-owned temporary outputs/processes. Report any
   required broader check blocked by existing infrastructure separately.

## Verification so far

The baseline regression fails with:
`AssertionError: expected [ 'kw:Print', 'num:3', …(2) ] to include 'num:1E+3'`.
After adoption, 12 focused checks and the website's 229 unit checks pass; nine
existing tests remain skipped. Production build succeeds. The built greeting
source and hl-kw/hl-str roles match the maintained sample. Registry integrity
matches the approved archive. The four new AMOS browser cases pass at 390/1440px
in both themes. An isolated Marketplace editor installs 0.3.1 and selects AMOS
for real lesson/prototype text without changing user settings or trusting files.

The first full release browser suite reports 469 passes and one homepage
navigation timeout: `Error: page.goto: Test timeout of 30000ms exceeded.` The
same case passes in isolation in 17.5 seconds. No baseline/timeout is changed;
[issue #901](https://github.com/code198x/website/issues/901) tracks the observation.
A manual lower-concurrency run initially omitted CODE_SAMPLES_PATH and fails
native-image setup with `TypeError: The "paths[0]" argument must be of type string.
Received undefined`. That invalid task-owned run is stopped and the correctly
configured full browser suite is rerun with two workers.

The broader edition inventory belongs to Lang198x; no manual or runtime behaviour
was inferred from website rendering. Existing unrelated review files remain intact.

## Outcome

The correctly configured complete browser rerun passes all 478 checks with two
workers, including all eight AMOS width/theme/project cases. Offline lychee
reports 228144 total links, 17918 unique and zero errors. This completes the
release checks in stages: the production build/content/unit/media checks passed
in the initial run, and the full browser/offline stages passed on the existing
unchanged build. Original failures remain recorded above and in issue #901.

A direct live RSS read returns `HTTP Error 403: Forbidden`; no live-site
verification or deployment claim is made. The website adoption is retained in
a separate PR for review. Existing .impeccable review directories and
tests/site-review-evidence.spec.ts remain untouched in the original checkout.

## Merge verification

Resolve the package manifest and lockfile conflict by retaining current main's
emulator/player versions and the approved AMOS 0.3.0 pin. No renderer conflict
exists. Run npm ci, npm run check and npm run check:release on the merged tree,
including the AMOS browser regression. Push the merge commit, read CI and merge
PR #902 when checks pass. Clean the isolated worktree after verifying retention.

The new checkout exposed two baseline entries whose missing-declaration messages
include an absolute node_modules path. The errors themselves are unchanged; the
comparison reported two additions and two removals solely from the checkout path.
Normalise that path in both current and recorded keys, retaining file, code,
message, package and subpath. Regression checks compare two checkout roots and
ensure different package paths, diagnostic codes and source files still differ.
No baseline entries are added and no type error is suppressed.

## Current-main reconciliation

Main independently merged its own checkout-independent type-baseline fix while
this PR was being checked. Retain main's implementation and remove this PR's
duplicate helper/tests. The adoption diff again changes only the approved
AMOS consumer. On the preceding combined tree, 232 unit checks and the existing
75-error type baseline pass, production builds 2634 pages, and the release
browser run reports 529 passes and one 1920px Systems-link click timeout. All
310 frame-plus-AMOS checks pass in the two-worker rerun, including that case
in 941ms. Offline links report 249610 total, 19278 unique and zero errors.

The new main also adds text-layout patterns. Verify its baseline helper tests
and the AMOS tests after reconciliation. GitHub's full browser workflow is
separate pending evidence; do not claim its completion or a merge yet. The
original failures are retained in PR #902 and navigation issue #901.
