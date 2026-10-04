import { describe, expect, it } from 'vitest';
import { resolveVaultFeatures, type VaultFeatureSelection } from './vault-features';
import { vaultColourGroup } from './vault-colours';
const entries = [
  { id: 'techniques/example', body: '<Figure src="/images/example.png" />', data: { title: 'Example', category: 'techniques', reviewed: true } },
  { id: 'hardware/chip', data: { title: 'Chip', category: 'hardware', reviewed: false } },
];
const feature: VaultFeatureSelection = { article: 'techniques/example', headline: 'Why?', deck: 'An introduction.', linkText: 'Read more', images: [{ src: '/images/example.png', alt: 'Example capture.', caption: 'The example.', width: 256, height: 192 }], related: ['hardware/chip'] };
describe('Vault editorial selections', () => {
  it('derives colour from the linked article and preserves related order', () => {
    const [resolved] = resolveVaultFeatures([feature], entries);
    expect(resolved.colour).toBe('craft');
    expect(resolved.related.map(entry => entry.id)).toEqual(feature.related);
  });
  it('rejects stale links and unreviewed features', () => {
    expect(() => resolveVaultFeatures([{ ...feature, article: 'missing' }], entries)).toThrow('does not exist');
    expect(() => resolveVaultFeatures([{ ...feature, article: 'hardware/chip' }], entries)).toThrow('must be reviewed');
    expect(() => resolveVaultFeatures([{ ...feature, related: ['missing'] }], entries)).toThrow('does not exist');
  });
  it('rejects images that do not belong to the featured article', () => {
    expect(() => resolveVaultFeatures([{ ...feature, images: [{ ...feature.images[0], src: '/images/another.png' }] }], entries)).toThrow('must belong');
  });
  it('requires an explicit colour family for new categories', () => {
    expect(() => vaultColourGroup('new-category')).toThrow('needs a colour family');
  });
});
