#!/usr/bin/env python3
"""Standards-based, offline JSON-LD to RDF validation for the static pilot.

Requires rdflib==7.4.0. Runs the existing Node generator without publishing.
"""
import json
import subprocess
from pathlib import Path

from rdflib import Graph, Literal, URIRef
from rdflib.namespace import RDF, XSD

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://code198x.com/id/systems/sinclair-zx-spectrum"
VOCAB = "https://code198x.com/ns/semantic#"
SCHEMA = "https://schema.org/"


def main():
    document = subprocess.run(
        ["node", "scripts/semantic-spectrum.mjs", "dist/semantic/sinclair-zx-spectrum.jsonld"],
        cwd=ROOT, capture_output=True, text=True, check=True,
    )
    assert "Wrote" in document.stdout
    output = ROOT / "dist/semantic/sinclair-zx-spectrum.jsonld"
    data = json.loads(output.read_text(encoding="utf-8"))
    assert len(data["@graph"]) >= 3
    graph = Graph()
    # All contexts are inline; no network context fetches required.
    graph.parse(data=json.dumps(data), format="json-ld")

    entity = URIRef(BASE)
    claim = URIRef(BASE + "/claims/introduced/1982")
    usages = [URIRef(node["@id"]) for node in data["@graph"] if node.get("@type") == VOCAB + "SourceUsage"]
    assert len(usages) == 2, "Expected two public evidence usages"
    source_usage = usages[0]
    expected = {
        (entity, RDF.type, URIRef(SCHEMA + "Product")),
        (entity, URIRef(VOCAB + "assertion"), claim),
        (claim, RDF.type, URIRef(VOCAB + "HistoricalAssertion")),
        (claim, URIRef(VOCAB + "subject"), entity),
        (claim, URIRef(VOCAB + "predicate"), URIRef(VOCAB + "introduced")),
        (claim, URIRef(VOCAB + "year"), Literal("1982", datatype=XSD.gYear)),
        (claim, URIRef(VOCAB + "evidenceUsage"), source_usage),
        (source_usage, RDF.type, URIRef(VOCAB + "SourceUsage")),
        (source_usage, URIRef(VOCAB + "source"), URIRef("https://code198x.com/vault/magazines/sinclair-user")),
    }
    missing = expected - set(graph)
    assert not missing, f"Missing expected RDF triples: {sorted(map(str, missing))}"
    assert all(isinstance(s, URIRef) for s, _, _ in graph), "Unexpected blank node identity"
    serialised = graph.serialize(format="nt")
    for prohibited in ("private quotation", "reference/by-system", "Private manufacturer document"):
        assert prohibited not in serialised, f"Prohibited content found: {prohibited}"
    print(f"RDF validation passed: {len(graph)} triples, {len(expected)} required triples")


if __name__ == "__main__":
    main()
