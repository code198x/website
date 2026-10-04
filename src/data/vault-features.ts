import type { VaultFeatureSelection } from '../lib/vault-features';

/** Ordered editorial selections. Images must already belong to the linked article. */
export const vaultFeatures = [
  {
    article: 'techniques/colour-clash',
    headline: 'Why do the colours clash?',
    deck: 'On the Spectrum, shape and colour live in separate blocks of memory. When a sprite moves, they do not always agree.',
    linkText: 'Read about colour clash',
    images: [
      {
        src: '/images/vault/techniques/colour-clash/dizzy-sprite-single-ink.png',
        alt: 'Dizzy airborne and clear of the scenery, his sprite drawn entirely in white.',
        caption: 'A single ink for Dizzy.',
        width: 256, height: 192,
      },
      {
        src: '/images/vault/techniques/colour-clash/dizzy-sprite-two-inks.png',
        alt: 'Dizzy moving into the platform’s colour cells, with part of his sprite turning red.',
        caption: 'Move into another colour cell.',
        width: 256, height: 192,
      },
    ],
    related: ['techniques/raster-interrupts', 'techniques/attribute-aware-design', 'hardware/ula'],
  },
] satisfies VaultFeatureSelection[];
