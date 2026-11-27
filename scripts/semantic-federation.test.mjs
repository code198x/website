import test from 'node:test';
import assert from 'node:assert/strict';
import { combinePublisherGraphs, syntheticPublisherClaim } from './semantic-federation.mjs';

const subject = 'https://code198x.com/id/systems/sinclair-zx-spectrum';
const a = syntheticPublisherClaim({ publisher: 'https://publisher-a.example/', year: 1982, subject });
const b = syntheticPublisherClaim({ publisher: 'https://publisher-b.example/', year: 1983, subject });

test('two independent publishers retain contradictory claims without selecting a winner', () => {
  const merged = combinePublisherGraphs([a, b]);
  assert.equal(merged['@graph'].length, 2);
  assert.deepEqual(merged['@graph'].map(n => n['https://code198x.com/ns/semantic#year']['@value']), ['1982', '1983']);
  assert.notEqual(merged['@graph'][0]['@id'], merged['@graph'][1]['@id']);
  assert.ok(merged['@graph'].every(n => n['https://code198x.com/ns/semantic#subject']['@id'] === subject));
});
test('same publisher node cannot silently be overwritten', () => {
  const changed = structuredClone(a);
  changed['@graph'][0]['https://code198x.com/ns/semantic#year']['@value'] = '1990';
  assert.throws(() => combinePublisherGraphs([a, changed]), /Conflicting definitions/);
});
test('untrusted malformed node IDs are rejected', () => {
  assert.throws(() => combinePublisherGraphs([{ '@graph': [{ '@id': 'relative-claim' }] }]), /Invalid publisher node ID/);
});
