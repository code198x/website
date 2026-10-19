# The breadcrumb becomes the section bar

**Date:** 2026-10-19
**Decision:** umbrella `decisions/family-visual-identity.md` §7, "The breadcrumb is the page's section bar" (`90d5c258`), approved by Steve from mock-ups on live pages.
**Scope:** the breadcrumb only. The wider title-case rollout (navigation, buttons, kickers, labels) is a separate PR.

## What changes for readers

- Every page except the home page opens under the navigation with one full-bleed black bar: the section in a spot-ink block in the magazine face, then the trail in the Nebula Sans label style.
- Home and the current page are not shown, but stay in the markup for screen readers. A section front shows only its own block.
- On a phone the bar shows the section block and a `‹` link to the parent.
- The separate black label bar ("THE CRAFT", "WHAT'S NEW") goes, and so does any eyebrow that only repeats the section.
- The navigation loses its bottom border.
- The game studies stop putting the trail inside their artwork.

## Steps

1. **`Breadcrumbs.astro`:** render the bar. Give each item a role (home, section, trail, parent, current), keep hidden items visually hidden rather than removed, drop the `over-art` presentation, and move the `end` slot (lesson progress) to its own row below the bar. Bring section names into line with the decision, in title case.
   *Check:* bar height 56 px desktop, 48 px phone; section block in `--h-spot`; trail 16/15 px; full list in the accessibility tree.
2. **`Layout.astro`:** remove the navigation's bottom border; stop rendering `PageMasthead` as a label bar; remove the `masthead` and `breadcrumbPlacement` props and their section-label table.
   *Check:* no page shows a black label bar under the breadcrumb.
3. **Callers:** remove `masthead={…}` and `breadcrumbPlacement` from pages and layouts; `ArticleOpening` stops rendering a trail; "Game studies" becomes "Game Studies".
   *Check:* `astro check` and the build pass; no remaining references.
4. **Repeated section eyebrows:** remove eyebrows that only restate the section.
   *Check:* by page, in the screenshots.
5. **Vault category pages:** drop the small "The Vault" link that repeats the bar.
6. **Verify:** screenshot all 46 census page types at 1280 and 390 px, before and after; confirm no horizontal scroll, tap targets at least 44 px, and keyboard focus visible on the bar.

## Coordination

The game-study components (`AdventureStudy`, `PairedGameStudy`, `SpacewarStudy`, `ArticleOpening`, `vault/studies/index`) belong to the studies work in another session. Steve ruled breadcrumbs inside artwork an error, so this PR moves them; the PR description says so.
