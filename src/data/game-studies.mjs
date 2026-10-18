/** Stable study identities and current placement; bodies live outside Vault entries. */
export const GAME_STUDIES_ROOT = '/vault/studies/';
export const gameStudies = [{
  slug: 'spacewar',
  title: 'Spacewar!',
  subtitle: 'A universe worth playing in',
  description: 'Two ships, one star, and a universe of things to discover about games.',
  context: 'PDP-1 · 1962',
  image: '/images/studies/spacewar/header-2172.webp',
  reviewed: false,
  companions: ['moving-shot', 'duel-design', 'capture-credits'],
}, {
  slug: 'adventure',
  title: 'Adventure',
  subtitle: 'A world at the other end of a sentence',
  description: 'A lamp, a cave, and a conversation that changed what a game could be.',
  context: 'PDP-10 · 1970s',
  image: '/images/studies/adventure/header-2172.webp',
  reviewed: false,
  companions: [],
}, {
  slug: 'monty-mole',
  title: 'Wanted: Monty Mole',
  subtitle: 'A bucket of coal and a very bad idea',
  description: 'A little mole, a dangerous mine, and a game shaped by life above ground.',
  context: 'ZX Spectrum · 1984',
  image: '/images/studies/monty-mole/header-2172.webp',
  reviewed: false,
  companions: [],
}, {
  slug: 'elite',
  title: 'Elite',
  subtitle: 'Now make a living',
  description: 'A spaceship, a hundred credits, and a universe which leaves the next move to you.',
  context: 'BBC Micro · 1984',
  image: '/images/studies/elite/header-2172.webp',
  reviewed: false,
  companions: [],
}, {
  slug: 'manic-miner',
  title: 'Manic Miner',
  subtitle: 'A whole world in one room',
  description: 'Twenty caverns, a jump to commit to, and a very strange place to work.',
  context: 'ZX Spectrum · 1983',
  image: '/images/studies/manic-miner/header-2172.webp',
  reviewed: false,
  companions: [],
}, {
  slug: 'lemmings',
  title: 'Lemmings',
  subtitle: 'Looking after a small disaster',
  description: 'A few tools, a crowd that keeps walking, and the pleasure of getting everyone home.',
  context: 'Amiga · 1991',
  image: '/images/studies/lemmings/header-2172.webp',
  reviewed: false,
  companions: [],
}];
export function studyPath(slug, page = '') {
  return `${GAME_STUDIES_ROOT}${slug}/${page ? page + '/' : ''}`;
}
export const gameStudyPaths = [GAME_STUDIES_ROOT, ...gameStudies.flatMap(study => [studyPath(study.slug), ...study.companions.map(page => studyPath(study.slug, page))])];
export const unreviewedStudyPaths = new Set([
  ...(gameStudies.every(study => !study.reviewed) ? [GAME_STUDIES_ROOT] : []),
  ...gameStudies.filter(study => !study.reviewed).flatMap(study => [studyPath(study.slug), ...study.companions.map(page => studyPath(study.slug, page))]),
]);
