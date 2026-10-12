# Distinguish participant accounts from community catalogues — #369

## Plan

1. Inventory `sources` across the Vault. Inspect database citations and existing community interviews; do not classify from a host name or warning label alone.
2. Clarify `interview`, `recollection` and `database` in the docs repository’s `specifications/vault.md`. Preserve dates, named speakers, attribution and uncertainty; explain mixed pages and mirrored sources. Keep the existing schema.
3. In `src/content/vault/demos/wonderland.mdx`, separate Bob’s 14 April 2021 comment from the CSDb catalogue citation in frontmatter and the visible Sources list. Check the original page before editing. Preserve prose and review flags.
4. Point the source-schema comment in `src/content.config.ts` at the convention. Validate YAML, the bounded diff, links, production build and generated Sources text. Push each repository’s commit and open linked PRs; update #369.
5. Remove the temporary docs worktree after verifying its commit on the remote. Preserve unrelated working changes in both normal checkouts.

## Inventory and evidence

The starting inventory parsed all 1,485 Vault entries: 213 database citations,
175 interviews and 38 recollections. None of the database citation titles names
an interview. Existing Codetapper and C64.com participant interviews already use
`interview`. The remaining “Community reference” labels are in five hardware
entries, not the participant interviews reported in the original issue.

Checked on 12 October 2026:

- [CSDb: Wonderland](https://csdb.dk/release/?id=4748): release metadata is followed by a separate user comment from Bob, dated 14 April 2021, describing his own discussion with Psycho. Split the comment into `recollection`; keep the release metadata as `database`.
- [Codetapper: Subzero of Skid Row](https://codetapper.com/amiga/interviews/subzero-of-skid-row/): participant answers to questions. The existing `interview` kind is appropriate.
- [Recollection: World Firsts and Records](https://www.atlantis-prophecy.org/recollection/?load=world_of_demos): a compiled list based on Codebase64, with requests for corrections. Its title does not make the list itself a participant recollection. Keep database citations to the list; identify any separately cited participant contribution as such.

This is a source-form check, not a new factual review of the articles or a full
audit of every source kind. No blanket migration of wiki or magazine citations.

## Validation

The production build passed for 2,451 pages, including shared-frame checks and
Pagefind. All 25,956 internal references resolve. Parsed the changed frontmatter,
checked the three separate source items and the account date, and confirmed a
negative control rejects classifying the participant comment as a database.
The article body before Sources and both review flags are unchanged. Inspected
the generated Sources text to confirm the dated recollection appears separately.
