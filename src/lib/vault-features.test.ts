import { describe, expect, it } from 'vitest';
import { resolveVaultFeatures, resolveVaultExploration, resolveVaultDiscoveries, type VaultFeatureSelection } from './vault-features';
import { vaultColourGroup } from './vault-colours';
const entries = [
  { id: 'techniques/example', body: '<Figure src="/images/example.png" />', data: { title: 'Example', category: 'techniques', reviewed: true } },
  { id: 'hardware/sid-chip', data: { title: 'Chip', category: 'hardware', reviewed: false } },
];
const feature: VaultFeatureSelection = { article: 'techniques/example', headline: 'Why?', deck: 'An introduction.', linkText: 'Read more', images: [{ src: '/images/example.png', alt: 'Example capture.', caption: 'The example.', width: 256, height: 192 }], related: ['hardware/sid-chip'] };
describe('Vault editorial selections', () => {
  it('derives colour from the linked article and preserves related order', () => {
    const [resolved] = resolveVaultFeatures([feature], entries);
    expect(resolved.colour).toBe('craft');
    expect(resolved.related.map(entry => entry.id)).toEqual(feature.related);
  });
  it('rejects stale links and unreviewed features', () => {
    expect(() => resolveVaultFeatures([{ ...feature, article: 'missing' }], entries)).toThrow('does not exist');
    expect(() => resolveVaultFeatures([{ ...feature, article: 'hardware/sid-chip' }], entries)).toThrow('must be reviewed');
    expect(() => resolveVaultFeatures([{ ...feature, related: ['missing'] }], entries)).toThrow('does not exist');
  });
  it('rejects images that do not belong to the featured article', () => {
    expect(() => resolveVaultFeatures([{ ...feature, images: [{ ...feature.images[0], src: '/images/another.png' }] }], entries)).toThrow('must belong');
  });
  it('requires an explicit colour family for new categories', () => {
    expect(() => vaultColourGroup('new-category')).toThrow('needs a colour family');
  });
});

describe('Vault connections', () => {
  const linkedEntries = [
    { id: 'games/commando', body: '[Person](/vault/people/rob-hubbard)', data: { title: 'Game', category: 'games', reviewed: true } },
    { id: 'people/rob-hubbard', body: '[Chip](/vault/hardware/sid-chip/#music)', data: { title: 'Person', category: 'people', reviewed: true } },
    { id: 'hardware/sid-chip', body: '', data: { title: 'Chip', category: 'hardware', reviewed: true } },
  ];
  const selection = { article: 'games/commando', headline: 'A connected story', deck: 'Introduction', connections: [
    { from: 'games/commando', to: 'people/rob-hubbard', label: 'Created by', explanation: 'The person made the game.' },
    { from: 'people/rob-hubbard', to: 'hardware/sid-chip', label: 'Used', explanation: 'The person used the chip.' },
  ] };
  it('follows real article links in reading order, including fragments and trailing slashes', () => {
    const result = resolveVaultExploration(selection, linkedEntries);
    expect(result.connections.map(connection => [connection.from.data.title, connection.to.data.title])).toEqual([['Game', 'Person'], ['Person', 'Chip']]);
  });
  it('rejects a relationship unsupported by an existing article link', () => {
    const changed = linkedEntries.map(entry => ({ ...entry, body: '' }));
    expect(() => resolveVaultExploration(selection, changed)).toThrow('needs an article link');
  });
  it('rejects disconnected, repeated and unexplained connections', () => {
    expect(() => resolveVaultExploration({ ...selection, connections: [...selection.connections].reverse() }, linkedEntries)).toThrow('Disconnected');
    expect(() => resolveVaultExploration({ ...selection, connections: [selection.connections[0], selection.connections[0]] }, linkedEntries)).toThrow('repeated');
    expect(() => resolveVaultExploration({ ...selection, connections: [{ ...selection.connections[0], explanation: ' ' }] }, linkedEntries)).toThrow('needs an explanation');
  });
  it('rejects missing and unreviewed promoted entries, including connection endpoints', () => {
    expect(() => resolveVaultDiscoveries(['missing'], linkedEntries)).toThrow('does not exist');
    const changed = linkedEntries.map(entry => ({ ...entry, data: { ...entry.data, reviewed: entry.id !== 'hardware/sid-chip' } }));
    expect(() => resolveVaultDiscoveries(['hardware/sid-chip'], changed)).toThrow('must be reviewed');
    expect(() => resolveVaultExploration(selection, changed)).toThrow('must be reviewed');
    expect(() => resolveVaultDiscoveries(['games/commando', 'games/commando'], linkedEntries)).toThrow('Duplicate');
  });
});
