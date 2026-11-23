import test from 'node:test';
import assert from 'node:assert/strict';
import { generate, buildSemanticGraph } from './semantic-spectrum.mjs';

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
  assert.throws(() => graph({ ...baseEntry, sources: { introduced: [{ ref: 'magazines/unreviewed-title', kind: 'magazine' }] } }), /not been approved/);
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
