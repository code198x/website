import type { VaultExplorationSelection, VaultFeatureSelection } from '../lib/vault-features';

/** Each connection paraphrases the reviewed source article named in `from`. */
export const vaultExploration = {
  article: 'games/commando',
  headline: 'The music behind the game.',
  deck: 'Commando brought Capcom’s arcade action to home computers. On the Commodore 64, Rob Hubbard’s soundtrack became a story of its own. Follow the game into the people, hardware and techniques behind its sound.',
  connections: [
    { from: 'games/commando', to: 'people/rob-hubbard', label: 'Music by', explanation: 'Hubbard wrote the C64 soundtrack in one long night. His account is part of the story behind the conversion.' },
    { from: 'games/commando', to: 'hardware/sid-chip', label: 'Sound from', explanation: 'The C64’s sound chip gave Hubbard three voices to work with, shared between music and effects.' },
    { from: 'hardware/sid-chip', to: 'techniques/arpeggio', label: 'One technique', explanation: 'Rapidly changing the notes on one voice lets SID music suggest a chord without using every channel.' },
    { from: 'hardware/sid-chip', to: 'communities/hvsc', label: 'Preserved by', explanation: 'The High Voltage SID Collection preserves the music beyond the games it was written for.' },
  ],
} satisfies VaultExplorationSelection;

export const vaultDiscoveries = ['games/tetris', 'people/gunpei-yokoi', 'software/protracker', 'communities/demo-scene'];

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
        width: 512, height: 384,
      },
      {
        src: '/images/vault/techniques/colour-clash/dizzy-sprite-two-inks.png',
        alt: 'Dizzy moving into the platform’s colour cells, with part of his sprite turning red.',
        caption: 'Move into another colour cell.',
        width: 512, height: 384,
      },
    ],
    related: ['techniques/raster-interrupts', 'techniques/attribute-aware-design', 'hardware/ula'],
  },
] satisfies VaultFeatureSelection[];
