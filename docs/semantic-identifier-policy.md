# Semantic identifier policy — draft v1

**Status:** proposal for review, not a commitment that any URI currently resolves or will remain hosted forever.

## Authority and federation

Every publisher mints and maintains identifiers under a namespace it controls. The namespace `https://code198x.com/id/` is a *candidate* for Code198x-managed entities; `https://code198x.com/ns/semantic#` is an experimental vocabulary. No publisher needs permission from Code198x to publish its own assertions, cite Code198x entities, or disagree with Code198x.

Identifiers name entities, not editorial pages. Editorial titles, article paths, presentation labels and preferred dates may change without reassigning an entity ID. Never recycle an issued identifier for a different referent. A publisher should publish human-readable descriptions and machine-readable JSON-LD at its controlled URLs once URI hosting is approved; static hosting and content negotiation alternatives should be evaluated before adding infrastructure.

## Changes and disagreements

- **Rename:** retain the entity ID; change only the label and relevant page redirects.
- **Merge:** retain both legacy IDs and publish a *qualified, sourced* reconciliation assertion. Do not assert `owl:sameAs` without evidence of strict identity. Never silently rewrite history.
- **Split:** preserve the original identifier and its historical scope; mint IDs for the newly distinguished referents. Link them through explicit, dated and sourced disambiguation claims.
- **Retirement:** retain a tombstone/description explaining the retired identity and any successor. Do not reuse the URI.
- **Disputed assertions:** preserve separately minted assertion IDs and provenance, including incompatible values. Consumers choose their own evidence policy and must not infer a universal winner from merge order.
- **Cross-publisher identity:** exact shared subject URI means both publishers explicitly refer to that identifier. Similar labels or near-identical records are not sufficient to merge entities.

## Assertion identity

An assertion URI belongs to its publisher. Two publishers can claim incompatible years about one machine without sharing assertion IDs. A publisher must not mutate the meaning of an existing assertion ID; corrections and withdrawals should be separately recorded and linked to the prior assertion. The synthetic federation tests demonstrate coexistence and collision rejection, **not** a full trust model or automatic cross-publisher entity reconciliation.

## Publication boundary

A publicly resolvable identifier can itself reveal restricted information. Publication requires separate review of entity IDs, claim values, derived claims, source IDs, and graph edges. The pilot manifest only exercises fail-closed checks; its `publish: true` entries are **not legal authorisations**.

## Before public release

Confirm namespace ownership and operational stewardship; decide URI resolution, redirects and static representations; define versioning and term ranges; review rights for all published statements; test an external RDF consumer; and document what happens if Code198x hosting ceases. Until then the URLs are provisional and the PR stays in draft.
