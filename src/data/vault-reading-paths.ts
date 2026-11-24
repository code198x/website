import type { VaultExplorationSelection } from '../lib/vault-features';

/** Questions grounded in the reviewed articles; the source remains the article. */
export const techniquePaths = [
  { article: 'techniques/attribute-aware-design', question: 'How do you work around colour clash?', description: 'Follow the constraint into the choices designers made.' },
  { article: 'techniques/arpeggio', question: 'Can one voice suggest a chord?', description: 'Hear how a shortage of sound channels became a musical technique.' },
  { article: 'techniques/software-scroll', question: 'What if the hardware cannot scroll?', description: 'Explore the work the processor has to do instead.' },
];

// Each explanation comes from Colour Clash and names a link in that entry.
export const colourClashConnections = {
  article: 'techniques/colour-clash',
  headline: 'Follow the connections.',
  deck: 'From the colour system to the games and the ways around it.',
  connections: [
    { from: 'techniques/colour-clash', to: 'hardware/ula', label: 'The hardware', explanation: 'The ULA applies the screen’s colour attributes and swaps ink and paper for FLASH.' },
    { from: 'techniques/colour-clash', to: 'techniques/attribute-aware-design', label: 'Working with it', explanation: 'See how designers arranged colour and movement around the two-colours-per-cell rule.' },
    { from: 'techniques/colour-clash', to: 'games/dizzy', label: 'The game', explanation: 'The two frames in this article come from Dizzy. Follow the effect back into the game.' },
  ],
};


// Ordered, authored paths. A branch compares examples without asserting shared causes.
export const vaultReadingPaths = [
  {
    id: 'records-composers-publishers',
    article: 'games/xenon-2',
    headline: 'How did records, composers and game publishers meet?',
    deck: 'Start with Xenon 2. Making a record, arranging it for a game and publishing the game were different jobs.',
    connections: [
      {
        from: 'games/xenon-2', to: 'companies/bitmap-brothers', label: 'Who made the game',
        explanation: 'The Bitmap Brothers designed Xenon 2 and The Assembly Line programmed it. Mirrorsoft’s Image Works published it.',
      },
      {
        from: 'games/xenon-2', to: 'people/david-whittaker', label: 'From record to game',
        explanation: 'Tim Simenon made the record as Bomb the Bass. Arranging it for the game was a different job from writing an original score; David Whittaker did both in his career.',
      },
      {
        from: 'companies/bitmap-brothers', to: 'companies/renegade', label: 'A later publishing venture',
        explanation: 'Working on Xenon 2 brought the team into contact with the record label Rhythm King. They later set up Renegade with Rhythm King and Tom Watson to publish games.',
      },
      {
        from: 'companies/renegade', to: 'phenomena/record-companies-in-software', label: 'Earlier context',
        explanation: 'Compare a separate wave in 1983–84, when firms such as Virgin and Thorn EMI began selling software. Publishing games is not the same as licensing a recording for use in one.',
      },
    ],
  },
  {
    id: 'software-across-borders',
    article: 'culture/the-c64-across-borders',
    headline: 'What crossed borders when machines could not?',
    deck: 'Start with the Commodore 64. Follow the software in magazines, or compare how Brazil and the Soviet Union got their own Spectrum compatibles.',
    connections: [
      {
        from: 'culture/the-c64-across-borders', to: 'magazines/bajtek', label: 'Prices across currencies',
        explanation: 'The Polish magazine Bajtek printed prices for the same computer in different markets. The magazine also gives a view of what its readers were playing.',
      },
      {
        from: 'magazines/bajtek', to: 'culture/software-crossed-what-machines-could-not', label: 'Software on the move',
        explanation: 'A London supplier provided prizes for Polish readers. Other magazines show an American program adapted in Italy and a Polish game reviewed in Germany.',
      },
      {
        from: 'culture/the-c64-across-borders', to: 'culture/brazilian-market-reserve', label: 'A different route to ownership',
        explanation: 'Brazil required approval for computer imports. Compare how Brazilian-made compatibles filled part of that market.',
      },
      {
        from: 'culture/brazilian-market-reserve', to: 'culture/brazil-gaming', label: 'More than translation',
        explanation: 'The Brazilian edition of the British part-work INPUT changed its examples for local machines as well as translating the text.',
      },
      {
        from: 'culture/brazilian-market-reserve', to: 'culture/spectrum-clones', label: 'A Brazilian compatible',
        explanation: 'Microdigital’s TK 90X ran Spectrum software. Compare that machine with compatibles made elsewhere under different conditions.',
      },
      {
        from: 'culture/spectrum-clones', to: 'culture/soviet-computing', label: 'A separate Soviet story',
        explanation: 'The Hobbit was designed in Leningrad. Follow the Soviet context alongside other home computers there, such as the Radio-86RK, which was not a Spectrum clone.',
      },
    ],
  },
] satisfies Array<VaultExplorationSelection & { id: string }>;
