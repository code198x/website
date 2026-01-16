import { getCollection, type CollectionEntry } from 'astro:content';

export type GamesEntry = CollectionEntry<'games'>;
export type Game = GamesEntry['data']['games'][number];

/**
 * Get games for a specific platform and track combination
 */
export async function getGames(platform: string, track: 'assembly' | 'basic' | 'amos'): Promise<Game[]> {
  const allGames = await getCollection('games');
  const entry = allGames.find(g => g.data.platform === platform && g.data.track === track);
  return entry?.data.games ?? [];
}

/**
 * Get the full games entry (includes platform and track metadata)
 */
export async function getGamesEntry(platform: string, track: 'assembly' | 'basic' | 'amos'): Promise<GamesEntry | undefined> {
  const allGames = await getCollection('games');
  return allGames.find(g => g.data.platform === platform && g.data.track === track);
}

/**
 * Get all games entries across all platforms
 */
export async function getAllGamesEntries(): Promise<GamesEntry[]> {
  return getCollection('games');
}

/**
 * Count total games across all platforms
 */
export async function getTotalGamesCount(): Promise<number> {
  const allEntries = await getCollection('games');
  return allEntries.reduce((total, entry) => total + entry.data.games.length, 0);
}

/**
 * Count games for a specific platform (across all tracks)
 */
export async function getGamesCountForPlatform(platform: string): Promise<number> {
  const allEntries = await getCollection('games');
  return allEntries
    .filter(entry => entry.data.platform === platform)
    .reduce((total, entry) => total + entry.data.games.length, 0);
}
