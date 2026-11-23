# Semantic pilot vocabulary contract — draft v1

**Scope:** describes the *current* ZX Spectrum pilot projection, not a published standard. Namespace `https://code198x.com/ns/semantic#` is provisional and not promised to resolve.

## Referent decision

The entity `https://code198x.com/id/systems/sinclair-zx-spectrum` denotes the **original Sinclair ZX Spectrum 16K/48K computer model family introduced in 1982**, not an individual physical computer, the entire later Spectrum-branded lineage, a particular 128K/+2/+3 variant, a website page, or a commercial product listing. The current `schema:Product` type is a provisional broad classification, not a claim that every member has identical hardware. Separate variant identifiers will be needed if those distinctions become relevant.

## Terms used by the generator

| Term | Subject | Object | Meaning and limits |
| --- | --- | --- | --- |
| `schema:name` | machine-family entity | string | Human-readable preferred label; not identity |
| `x:cpuArchitecture` | machine-family entity | CPU-architecture URI | Editorially selected CPU architecture for the original family; not a claim about every later variant |
| `x:manufacturer` | machine-family entity | organisation URI | Editorially selected original manufacturer; not necessarily sole manufacturer throughout lineage |
| `x:assertion` | entity | HistoricalAssertion URI | Link to an assertion about the entity; not endorsement of universal truth |
| `x:HistoricalAssertion` | RDF type | — | Publisher-scoped historical statement; its identity must not silently change |
| `x:subject` | assertion | entity URI | Referent of the assertion |
| `x:predicate` | assertion | predicate URI | Property claimed about the subject |
| `x:introduced` | predicate resource | — | A model-family introduction event/date, not an individual machine's manufacture date |
| `x:year` | introduction assertion | `xsd:gYear` literal | Year-level claim, without implying a known exact day or month |
| `x:evidenceUsage` | assertion | SourceUsage URI | A cited use of a source for this assertion; no independence or reliability score implied |
| `x:SourceUsage` | RDF type | — | A specific evidence occurrence, not the publication itself |
| `x:source` | source usage | source URI | Referenced publication identity, subject to independent disclosure approval |
| `x:sourceKind` | source usage | string | Editorial evidence category, not proof of source independence |
| `x:publisher` | synthetic federation assertion | publisher URI | Claimed publisher attribution in a synthetic fixture; **not verified authorship** |

`x:` is shorthand for the provisional namespace above. All object URI fields are RDF resource links, not string literals. No custom term should be treated as stable until its meaning and governance are approved.

## Identity and revision rules

- Machine-family identity is independent of display labels.
- The pilot introduction assertion URI includes the asserted year (e.g. `.../claims/introduced/1982`), so a different asserted year receives a distinct URI. This is a **pilot strategy**, not a general immutable assertion-ID algorithm. Publisher authority, statement qualifiers and versioning still need a general contract.
- Evidence usage identifiers derive from source identity, kind, date, issue and page, **not array position**. These are opaque SHA-256 prefixes, not reversible publication metadata. Changing the identity-defining evidence occurrence changes its identifier; merely reordering evidence does not.
- Evidence usage IDs are stable only within this documented pilot algorithm; they are not suitable for indefinite cross-publisher commitments until the canonical evidence occurrence schema is agreed.
- Source titles, notes, excerpts and locators are not projected. Hashing restricted metadata is **not proof of non-disclosure**: public identifiers can still reveal or be correlated with sensitive material. Human rights review remains mandatory.
- Direct machine CPU/manufacturer edges are currently editorial claims without assertion-level provenance. Do not infer that they are incontrovertible.

## Deliberate omissions

No claim confidence, universal source-quality score, automatic reconciliation, uncertainty interval, canonical winner selection, `owl:sameAs` assertion, signature/authorship verification, or release-rights grant is implied. Contradictory claims in `semantic-federation.mjs` are synthetic and the merger is JSON-only, not a general RDF union algorithm.

## Future compatibility

Independent publishers may mint their own URIs and publish RDF assertions without using Code198x code. A future public vocabulary should favour existing standards (such as PROV-O for provenance) when they express exactly the intended meaning. Avoid breaking existing public URIs; the pilot URIs have not yet been approved for public release.
