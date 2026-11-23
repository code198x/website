# Semantic Web pilot — independent adoption contract review

**Status:** review findings, not an adopted vocabulary or release approval. Reviewed against `scripts/semantic-spectrum.mjs`, `scripts/semantic-federation.mjs`, the policy fixture and the draft identifier policy on `feat/semantic-zx-spectrum-pilot`.

## Decision

**Keep PR #1430 in draft.** The pilot proves a static JSON-LD projection can be parsed as RDF and that synthetic independent claims can coexist. It does **not** yet establish a reusable ontology, rights clearance, durable URI resolution, or general RDF federation. No new service or database is justified.

## Findings and disposition

| Priority | Finding | Why independent adopters care | Proposed disposition |
| --- | --- | --- | --- |
| Blocker | `x:HistoricalAssertion`, `x:SourceUsage` and all `x:` predicates have no normative definitions, domain/range, or lifecycle contract. | Other publishers cannot reliably interpret a term without depending on the generator's implementation. | Publish a small human-readable term table and RDF examples before declaring any vocabulary stable; prefer existing PROV-O/Dublin Core terms where semantics match exactly. |
| Blocker | `ENTITY + '/claims/introduced'` represents a mutable claim slot, not an immutable statement. | A corrected date could silently change what the same assertion URI means. | Mint stable assertion IDs distinct from predicate/value and preserve corrections as new, linked assertions. |
| Blocker | Evidence usage IDs depend on array indexes (`/source/1`). | Reordering or adding evidence silently reassigns identities. | Use explicit stable usage keys or treat usage nodes as nonpersistent blank nodes; do not promise stability for positional IDs. |
| Blocker | The publication manifest contains `publish: true` without rights evidence, reviewer, scope, decision date, or derivative-data classification. | A machine could confuse a test fixture with legal approval. | Keep test-only; require a separate release approval record covering each identity, assertion, relationship, and derived disclosure. |
| High | `schema:Product` conflates an individual product, computer model, and family of variants. | External sources may refer to a 16K unit, a 48K model, or the entire Spectrum family. | Define the subject's referent and class before assigning public type. |
| High | `x:year` encodes an introduction assertion as a special-case year rather than a generic assertion value with temporal precision. | Dates, ranges, disputed months, and uncertain evidence cannot be expressed consistently. | Specify assertion value datatype, precision, qualifiers and uncertainty; avoid forcing a single canonical date. |
| High | The entity node carries direct CPU/manufacturer links while the date is reified as an assertion. | Those direct edges are themselves contestable, sourced, and rights-sensitive, yet have no assertion-level provenance. | Decide which statements require first-class assertions; do not imply that direct edges are unquestioned facts. |
| High | `combinePublisherGraphs` compares JSON serialisation, not RDF graph equivalence, and rejects alternate descriptions of the same URI. | Independent RDF publishers can serialise equivalent statements differently or add compatible triples. | Label it a JSON fixture merger; future interoperability tests should union RDF triples and retain per-publisher named-graph/provenance boundaries. |
| High | `syntheticPublisherClaim` includes a publisher URI but no evidence or rights decision. | Publisher identity is not proof of authorship, authority, source independence, or permission to disclose. | Add explicit provenance and evidence modelling in a separate, synthetic example before production use. |
| High | Proposed `/id/`, `/ns/`, `/vault/` URIs are not demonstrated to resolve or be maintained. | External links could break or change meaning. | Decide static URI resolution, stewardship, tombstones and redirects before publishing. |
| Medium | `x:predicate` is a resource and `x:year` is a typed literal; semantics are only implicit in code. | Valid RDF syntax does not prove that consumers agree on meaning. | Specify vocabulary terms with examples and negative cases. |
| Medium | Source-kind labels and source identity are editorial classifications; multiple usages of one magazine do not imply independent corroboration. | Consumers might overstate evidence strength. | Document source vs occurrence vs quotation, and avoid any implied independence score. |
| Medium | The pilot is ZX Spectrum-specific, and source handling only supports one reviewed source family. | It is not a generic interchange format. | Keep it intentionally narrow until another independent dataset exposes actual reuse needs. |

## Minimum portable contract (proposed, not yet implemented)

1. **Entities:** opaque, publisher-controlled HTTP(S) identifiers with documented referents; labels are not identity. Never reuse an ID for a different referent.
2. **Assertions:** publisher-controlled immutable assertion identities; explicit subject, predicate, value, optional qualifiers, and provenance. A correction or withdrawal creates a separately identified event or assertion.
3. **Evidence:** separate evidence sources from particular *usages* of sources; cite only permitted identifiers and excerpts. Multiple citations do not imply independent witnesses.
4. **Disagreement:** consumers may preserve contradictory assertions and publisher attribution without selecting a winner. Identity alignment is explicit and revisable; avoid automatic `owl:sameAs`.
5. **Rights:** independent disclosure decisions for entity identity, claim/value, derivation, source identity, usage, excerpt and each edge. Unknown means do not publish. A test manifest cannot authorize public release.
6. **Vocabulary:** use existing W3C/RDF vocabulary where meaning fits; document each custom term's definition, expected object type, versioning and example.
7. **Transport:** ordinary static JSON-LD over HTTPS is enough for the pilot. No SPARQL endpoint, registry, database, Solid server or central authority is required.

## Concrete acceptance tests before promotion

- A renamed or reordered source does not silently change an identifier promised to be stable.
- Two publishers supply conflicting claims with distinct assertion IDs and provenance; an RDF consumer retains both.
- Two publishers provide different compatible RDF descriptions of the same entity; union preserves both without JSON-order sensitivity.
- A corrected assertion remains inspectable alongside its correction/withdrawal.
- Restricted derived edges are denied even when endpoints and cited source IDs are public.
- The candidate vocabulary and all advertised entity URIs have a documented resolution/stewardship plan.
- A third-party consumer can interpret the graph using only published contracts and standards, not Code198x source code.

## Scope control

**Do next:** agree the referent of the Spectrum ID, decide immutable assertion and evidence-usage identity rules, and write a compact vocabulary table with precise semantics. Then implement only the smallest test needed to verify these choices.

**Do not do yet:** expand to additional platforms, build a general-purpose policy engine, invent a broad historical ontology, deploy URI routes, or call the fixture legally cleared.

The existing CI success remains valuable evidence for the *implemented* tests; it is not evidence that these contract findings are resolved.
