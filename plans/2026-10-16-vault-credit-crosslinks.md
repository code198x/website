# Vault credits and cross-links (#797)

1. Verify Matsumae's first Mega Man music and effects credit against the Brave Wave interview, and her two Shovel Knight pieces against Kaufman's original soundtrack listing. Inspect the existing articles for the remaining contextual links.
2. Edit only `src/content/vault/{companies/atari,games/mega-man,games/shovel-knight,magazines/papersoft,magazines/bajtek,culture/magazines-across-borders,systems/commodore-64}.mdx`. Add selective links and checked credits, keeping collaborators and source qualifications visible. Preserve review metadata; the PR requires the owner's editorial sign-off.
3. Run existing link/content checks and a production build. Inspect the seven rendered pages at desktop and phone widths and follow every new link; retain the distinction between a local preview and a deployed result.
4. Record source evidence and verification in the PR, commit and push, attach the PR to this chat, and link it from #797. Leave #797 open until approved, merged and live-verified. Remove the temporary worktree and task-owned preview after verifying the commit exists on the remote.

## Verification outcome

The seven articles now contain the seven requested links. The Mega Man and Shovel Knight additions cite the original interview and album release checked on 16 October 2026. No dates or review flags changed.

- `npm run check:content` passed; all 25,979 references resolve. Existing platform-balance advisories remain advisory.
- The source-coverage report still finds all 1,247 dated claims cited. This report is diagnostic, not historical verification.
- Production build passed: 2,459 pages generated, shared frames verified across 39 rendering families, Pagefind completed. The isolated checkout reused existing prepared assets and the configured sample/decoder sources; no dependencies were added.
- Fourteen local browser journeys passed (seven changed pages at 1440px and 390px): credit text present, every new link clicked to its intended article and no horizontal overflow. Screenshots were captured; phone credits and desktop related reading were visually inspected.
- The broader frontmatter/prose check exits 1 on the same two disagreements in both the baseline and this branch: `games/diablo` (released: 1996 in frontmatter, 1997 in the prose) and `people/louis-castle` (born: 1965 in frontmatter, 1964 in the prose). They are outside this change. The separate corpus-based date check initially could not locate its database from the isolated checkout; no date changes are claimed or validated by that unsuccessful run.

These are source and local-build checks. Human approval, merging and live publication checks remain outstanding; #797 stays open.
