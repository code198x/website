# Publish the qualified Ace pool and session words for review

Start from actual merged website main81337f7813839cad07a8fcf31856607e8227b735,
freshly fetched on27October. Source PR420 is open at
0741a4de4b7ba8d263032a2ff98283282f4a4a63. Both ports remain review-only.
Preserve the primary website's unrelated critique/review/test edits.

1. Write only the two missing pages:
   `src/content/patterns/jupiter-ace/forth/framework/object-pool.mdx` and
   `game-flow.mdx`. Use existing frontmatter, CodeFromFile and Figure.
   Explain load order, words and stack effects, reserved state, caller
   ownership, small customisation, meaningful wrong/repair, actual dictionary
   and numeric costs, original-ROM limits and relevant Maths/Craft links.
   Keep the components reusable; no new schema, dependency or architecture.
2. Copy four exact source publication PNGs to
   `public/images/patterns/jupiter-ace/forth-{topic}-{working,wrong}.png`.
   Require byte/SHA identity with reviewed source and320x288 native pixels.
   Pin every source link to0741a4de. Include maintained FTH through existing
   CodeFromFile; no duplicated program listings in the pages.
3. Add `tests/ace-depth-patterns.spec.ts`: both topics in dev/built modes on
   desktop and Pixel7. Verify every listing equals its feature-source file,
   captures are byte-identical/native-sized, links/pins, catalogue discovery,
   copy, keyboard listing scroll and no320px overflow. Retain screenshots.
4. Reuse isolated APFS copies of the exact-lock installed dependencies and
   positively qualified merged-source download cache. Record all copied
   paths, hashes and why source changes cannot invalidate those artefacts.
   Run the normal pinned UI fetch. This is cache reuse, not a fresh native
   rebuild. Use the supported CODE_SAMPLES_PATH to the reviewed Ace feature
   checkout. Keep existing remote workflow source policy unchanged.
5. Run normal site check (including unchanged type baseline), full production
   build and both browser modes, with owned unused ports4399/4401 and CI=1
   so an unrelated server cannot be adopted. Inspect actual built HTML and
   captures; retain logs and source/asset identities. Stop owned servers and
   positively verify both ports closed. Fix bugs before publishing.
6. Commit and push normally. Create a draft website PR dependent on source420
   and attach it. Remote CI still reads samplesmain, where these ports do not
   yet exist; do not merge either new PR or alter checkout policy to hide that
   dependency. Record exact heads and local verification limitations.

Retain this task workspace only while proof and review need it. Before normal
worktree removal, inspect tracked/untracked/ignored files and verify all unique
commits/evidence are retained. Remove disposable copied caches after proof.

Browser reproduction found a real content-layout bug: after desktop resize
to320px the three-column word/stack/contract table is371.86px wide, causing
68px document overflow. Four samples0/50/150/500ms remain68 with fonts loaded;
clipped code listings are not the cause. Preserve failed captures/logs and
source. Reduce this one table to word/stack columns and state its contracts
in adjacent prose. Keep strict overflow and keyboard-scroll assertions;
restore the diagnostic-only test instrumentation before rerun. Rebuild both
actual pages and rerun both browser modes after the content fix.
