import test from 'node:test';
import assert from 'node:assert/strict';
import { generate, buildSemanticGraph } from './semantic-spectrum.mjs';
import fs from 'node:fs';
const policy = JSON.parse(fs.readFileSync(new URL('./semantic-spectrum-policy.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(policy);

const baseEntry = {
  category: 'systems', reviewed: true, title: 'Sinclair ZX Spectrum',
  platforms: ['sinclair-zx-spectrum'], introduced: 1982,
  sources: { introduced: [{ ref: 'magazines/sinclair-user', kind: 'magazine', note: 'private quotation' }] },
};
const baseSystem = { name: 'Sinclair ZX Spectrum', year: 1982, cpuArchitecture: 'z80', manufacturer: 'sinclair' };
const graph = (entry = baseEntry, system = baseSystem) => buildSemanticGraph(entry, system);
test('projects existing content into a deterministic graph', () => {
  const result = graph();
  assert.equal(JSON.stringify(result), JSON.stringify(graph()));
  assert.equal(result['@graph'][1]['x:year'], '1982');
  assert.deepEqual(result['@graph'][1]['x:predicate'], { '@id': 'https://code198x.com/ns/semantic#introduced' });
  assert.equal(result['@graph'][2]['@type'], 'https://code198x.com/ns/semantic#SourceUsage');
});
test('private notes and arbitrary fields never enter the projection', () => {
  const serialized = JSON.stringify(graph({ ...baseEntry, secret: 'PRIVATE_VALUE' }));
  assert.doesNotMatch(serialized, /PRIVATE_VALUE|private quotation/);
});
test('unreviewed entries fail closed', () => {
  assert.throws(() => graph({ ...baseEntry, reviewed: false }), /Unreviewed/);
});
test('restricted-looking source refs fail closed', () => {
  assert.throws(() => graph({ ...baseEntry, sources: { introduced: [{ ref: 'reference/by-system/secret', kind: 'manual' }] } }), /not allowlisted/);
});
test('free-text titles cannot be automatically published', () => {
  assert.throws(() => graph({ ...baseEntry, sources: { introduced: [{ title: 'Private manufacturer document', kind: 'manual' }] } }), /No publicly identified evidence/);
});
test('conflicting claims fail closed', () => {
  assert.throws(() => graph(baseEntry, { ...baseSystem, year: 1983 }), /Conflicting/);
});
test('real checked-in content produces a projection', () => {
  const result = generate();
  assert.ok(result['@graph'].length >= 3);
});

test('a syntactically public-looking but unreviewed source identity fails closed', () => {
  assert.throws(() => graph({ ...baseEntry, sources: { introduced: [{ ref: 'magazines/unreviewed-title', kind: 'magazine' }] } }), /Publication decision denied/);
});
test('consumer can traverse typed assertion and evidence without Code198x source files', () => {
  const document = JSON.parse(JSON.stringify(graph())); // independent JSON-only consumer
  const byId = new Map(document['@graph'].map(node => [node['@id'], node]));
  const machine = document['@graph'].find(node => node['@type'] === 'schema:Product');
  const assertion = byId.get(machine['x:assertion']['@id']);
  assert.equal(assertion['x:year'], '1982');
  assert.equal(assertion['x:subject']['@id'], machine['@id']);
  assert.ok(assertion['x:evidenceUsage'].every(link => byId.has(link['@id'])));
});

test('unknown rights decisions fail closed', () => {
  const p = copy(); delete p.decisions.relationships.evidenceUsage;
  assert.throws(() => buildSemanticGraph(baseEntry, baseSystem, p), /relationship evidenceUsage/);
});
test('approved source does not authorise prohibited derivative', () => {
  const p = copy(); p.decisions.claim.introduced.derived = false;
  assert.throws(() => buildSemanticGraph(baseEntry, baseSystem, p), /derived introduction claim/);
});
test('approved entities do not authorise restricted edge', () => {
  const p = copy(); p.decisions.relationships.assertion.publish = false;
  assert.throws(() => buildSemanticGraph(baseEntry, baseSystem, p), /relationship assertion/);
});
test('identity remains stable across editorial metadata changes', () => {
  const altered = { ...baseEntry, subtitle: 'Renamed editorial subtitle' };
  assert.equal(graph(altered)['@graph'][0]['@id'], graph()['@graph'][0]['@id']);
});
test('unrecognised policy version fails closed', () => {
  const p = copy(); p.version = 2;
  assert.throws(() => buildSemanticGraph(baseEntry, baseSystem, p), /Unknown pilot policy/);
});

test('evidence identifiers do not depend on source order', () => {
  const a = { ref: 'magazines/sinclair-user', kind: 'magazine', date: '1986-06', issue: 51, page: '47' };
  const b = { ref: 'magazines/sinclair-user', kind: 'advertisement', date: '1982-11', issue: 8, page: '38' };
  const ids = sources => graph({ ...baseEntry, sources: { introduced: sources } })['@graph'].slice(2).map(n => n['@id']).sort();
  assert.deepEqual(ids([a,b]), ids([b,a]));
});
test('distinct claim values cannot silently reuse an assertion identifier', () => {
  const first = graph()['@graph'][1]['@id'];
  const changed = graph({ ...baseEntry, introduced: 1983 }, { ...baseSystem, year: 1983 })['@graph'][1]['@id'];
  assert.notEqual(first, changed);
});
test('duplicate evidence occurrence is rejected', () => {
  const source = { ref: 'magazines/sinclair-user', kind: 'magazine' };
  assert.throws(() => graph({ ...baseEntry, sources: { introduced: [source, source] } }), /Duplicate evidence occurrence/);
});
