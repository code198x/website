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
}];
export function studyPath(slug, page = '') {
  return `${GAME_STUDIES_ROOT}${slug}/${page ? page + '/' : ''}`;
}
export const gameStudyPaths = [GAME_STUDIES_ROOT, ...gameStudies.flatMap(study => [studyPath(study.slug), ...study.companions.map(page => studyPath(study.slug, page))])];
export const unreviewedStudyPaths = new Set([
  ...(gameStudies.every(study => !study.reviewed) ? [GAME_STUDIES_ROOT] : []),
  ...gameStudies.filter(study => !study.reviewed).flatMap(study => [studyPath(study.slug), ...study.companions.map(page => studyPath(study.slug, page))]),
]);
