# Static semantic pilot: ZX Spectrum

This is an experimental **projection**, not a second authoritative data store. It reads the reviewed Vault entry and system YAML and produces a deterministic JSON-LD document. No service, database, runtime fetch, graph index or publication route is introduced.

## Local commands

```sh
node --test scripts/semantic-spectrum.test.mjs
node scripts/semantic-spectrum.mjs
```

The test suite is part of the existing `check:content` command. The generated file goes to `dist/semantic/sinclair-zx-spectrum.jsonld`; it is **not automatically published**. JSON-only independent-consumer tests check linked IDs. In addition, the existing CI job installs pinned RDFLib 7.4.0 and runs `python scripts/validate-semantic-spectrum.py` to parse the generated JSON-LD as RDF and assert expected triples. This requires no graph service or database.

## Pilot identity and publication manifest

`scripts/semantic-spectrum-policy.json` is a versioned **test fixture** for the rights gate, not evidence of legal permission or release authorisation. It records candidate identity URIs and separate decisions for entities, derived claims, source identities/usages, and each relationship. Missing or unknown decisions fail closed. Identities are stable across editorial metadata changes but remain provisional until a URI persistence policy is approved. Synthetic contradictory claims are demonstrated in `scripts/semantic-federation.test.mjs`; this is not yet general RDF federation or provenance verification. The model-family referent, pilot assertion IDs and evidence occurrence IDs are specified in `docs/semantic-vocabulary-contract.md`.

**No public release may be inferred from the manifest's `publish: true` test flags.** A separate human-reviewed rights and namespace decision is mandatory.

## Rights boundary

- The export selects known, reviewed fields; it never serialises entire source records or prose.
- Only explicitly listed public source identities may be projected. A valid-looking path alone is not publication approval.
- Source notes, quotations, titles without a reviewed public identity, source paths, issue/page locators, and arbitrary derived content are excluded.
- Restricted source identities, derivative facts and relationship edges each require their own approval. Approval of a citation or a Vault page is **not** approval of all graph edges derived from it.
- Synthetic negative tests check common failures; they do **not** prove exhaustive non-disclosure. A human rights review is mandatory before deploying the output.

## Identifier and semantic review required before publication

The `https://code198x.com/id/...` identifiers and `https://code198x.com/ns/semantic#` terms are **proposals**, not currently guaranteed to resolve. The organisation and CPU identities must be reconciled with existing Vault and Isa198x identities before treating them as canonical.

The `x:HistoricalAssertion`, `x:SourceUsage`, `x:subject`, `x:predicate`, `x:year`, `x:evidenceUsage`, `x:source`, `x:sourceKind`, `x:manufacturer`, `x:cpuArchitecture`, and `x:assertion` terms are experimental. Their meaning and range must be documented and tested with a standards-conformant JSON-LD processor before publishing them as a vocabulary. The `x:year` value is a string typed as `xsd:gYear`; the machine entity is distinct from the assertion about its introduction date. A cited source usage is not proof of independent corroboration.

## Exit criteria

1. Existing content CI and all pilot tests pass.
2. RDFLib parses the document as JSON-LD without errors, and the resulting RDF statements match the required triple assertions. The CI result must be green before claiming this gate is met.
3. An independent consumer resolves the proposed term meanings and follows the assertion/source links without depending on internal source files.
4. Rights review approves every exported identity, fact and edge, including derivative-data checks.
5. A stable URI policy and namespace documentation are approved, with no unsupported permanence claims.

Do not add new infrastructure unless these checks expose a specific requirement that cannot be met with static files and existing tooling.
