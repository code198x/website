# Reproduce the first Amiga language greetings

Bounded follow-up to website #766 and docs #94, within umbrella #116.

1. Use actual FS-UAE observations in the paired docs qualification evidence.
2. Edit `src/content/curriculum/commodore-amiga/amos/getting-started.mdx`
   and `amos/meet-amos/unit-01.mdx` to name the distribution, OS and RAM,
   launch from the correct drawer, return through the requester and describe
   the observed error/repair behaviour.
3. Edit the matching Blitz setup and unit-01 pages only to the extent supported
   by the named AmiBlitz run. Keep PED distinct from original Ted; remove the
   untested whole-course compatibility guarantee. Record any remaining blocker.
4. Use existing dependencies; build the site and inspect the four changed routes
   at wide/narrow sizes, including wrapping and internal setup links. Do not
   alter shared UI, samples, later lessons or unrelated speed claims (#767).
5. Commit and push a draft PR with exact evidence limits, then clean task build
   files, worktrees and processes after remote retention is checked.

## Scope at the observed boundary

AMOS's baseline, edited output and fault/repair passed. AmiBlitz's window became
unavailable during compilation; no greeting output was observed. Keep both Blitz
pages unchanged and #766 open. This PR changes only the two AMOS pages and does
not claim the paired runtime qualification is complete.
