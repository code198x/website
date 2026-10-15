# Family project progress

`/family/progress` gives a source-backed assessment of Code198x, Emu198x and
Asm198x, demonstrated connections, gaps and adjustable next checkpoints.
`/family/progress/evidence` keeps the original configurations, measurements,
versions and fingerprints. Family and About link to the overview.

Both pages and `/family/progress/snapshot.json` read the same validated
`src/data/project-progress.json`. It is a reviewed generated snapshot, following
the colophon's committed-data convention. It is not a live status feed. The
snapshot date is visible; unchanged source labels describe the generator's
check on that date. Deployment does not fetch current GitHub state or rerun
runtime observers. A later website build does not make old evidence new.

## Refresh

1. Regenerate the family overview from its reviewed qualification records and
   current project/sample inputs. Resolve changed source assessments and
   revalidate affected runtime examples before claiming they pass. A deliberately
   stale or failed result can still be published with its truthful state.
2. Review the portable overview's **public** `overview.json`. Do not provide raw
   runtime reports, firmware, corpus records or credentials to this site.
3. From this repository, run:

   ```sh
   node scripts/import-project-progress.mjs /path/to/generated/overview.json
   npx vitest run src/lib/project-progress.test.ts
   npm run check
   npm run build
   ```

   The importer validates the public contract before writing. Invalid/empty input
   leaves the previous snapshot intact. Valid input is installed by an atomic
   rename, without changing its bytes. No software installation is required.
4. Inspect the changed assessment prose, checkpoints, source links, tool identities
   and result states. The input retains manifest and briefing fingerprints. Review
   both rendered pages and their download in light/dark OS preferences and narrow/wide layouts.
5. Open a PR with the changed snapshot and explain what it establishes. Merge and
   publish only through the existing reviewed website release workflow.

Do not edit generated snapshot prose or totals directly. Assessments and source
pins change together in the owning generator inputs. Working checkpoints are
recommendations for review, not newly adopted roadmaps. A changed checkpoint does
not change the meaning of a retained execution result.

The schema guard is a publication/consistency control, not an independent rerun
of the qualifications. It rejects incomplete membership, contradictory passing
states, malformed identities, private locations and unreviewed public links.
Maintainers still review the evidence and authored public text. There are no
new build-time network calls, credentials, analytics or client scripts for these
pages. Existing site navigation and paper palette continue to apply.

Focused browser check: `tests/family-progress.spec.ts`. Like the wider website
suite it can run against the development server; release review must also inspect
the production `dist/family/progress/` output. The pages use the existing `Layout`
and `PageFrame`; shared layouts and other family explainers are unchanged.
