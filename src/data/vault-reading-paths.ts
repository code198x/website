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
