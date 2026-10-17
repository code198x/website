# Build and integrate Start Here and About openings

Approval: both concepts and implementation/integration authorised on 17 October 2026. Use the existing design system and original generated illustration; no new dependencies or shared hero architecture.

1. Prepare original approved panorama and separate phone images in public/images/start-here-opening/ and public/images/about-opening/ with WebP responsive exports, exact prompts embedded in XMP, hashes, dimensions and source records. Verify decoded pixels survive metadata insertion.
2. Add src/components/StartHereOpening.astro and src/components/AboutOpening.astro. Integrate only src/pages/start-here.astro and src/pages/about.astro using the existing full-bleed page-specific frame pattern. Keep headings live, preserve exact page copy, route anchors, real captures, About body and BitPicture. Compact Start phone image and first-session access take priority.
3. Record route contracts and run production build/content checks. Add tests/visitor-openings.spec.ts for correct responsive images, full-bleed bounds, route links/targets, failed imagery, enlarged text and the BitPicture diagram. Compare existing body/routes with live baseline.
4. Batch desktop/Pixel7/320px light/dark, tablet/wide and enlarged-text captures; scan affected main content with axe. Fix material defects in one batch, confirm once. Run scoped detector and independent finish/documentation handoffs.
5. Commit/push reviewed changes, create PR, wait for checks and merge using repository's rebase-only policy. Verify deployment and actual live images/links/activity, close #811/#814, update #802. Preserve evidence and clean all task-owned worktree/build processes/caches.
