import { getCollection, type CollectionEntry } from 'astro:content';
import { getUnitsAvailableCount, hasUnitsEntry } from './units';

export type GamesEntry = CollectionEntry<'games'>;
export type Game = GamesEntry['data']['games'][number];

// Game with guaranteed unitsAvailable (computed if from units collection)
export type GameWithAvailability = Omit<Game, 'unitsAvailable'> & { unitsAvailable: number };

/**
 * Get games for a specific platform and track combination
 */
export async function getGames(platform: string, track: 'assembly' | 'basic' | 'amos'): Promise<Game[]> {
  const allGames = await getCollection('games');
  const entry = allGames.find(g => g.data.platform === platform && g.data.track === track);
  return entry?.data.games ?? [];
}

/**
 * Get games with computed unitsAvailable (from units collection when available)
 */
export async function getGamesWithAvailability(
  platform: string,
  track: 'assembly' | 'basic' | 'amos'
): Promise<GameWithAvailability[]> {
  const games = await getGames(platform, track);

  return Promise.all(games.map(async (game) => {
    // Check if units collection has an entry for this game
    const hasUnits = await hasUnitsEntry(platform, track, game.slug);

    let unitsAvailable: number;
    if (hasUnits) {
      // Compute from units collection
      unitsAvailable = await getUnitsAvailableCount(platform, track, game.slug);
    } else {
      // Fall back to games collection value or 0
      unitsAvailable = game.unitsAvailable ?? 0;
    }

    return {
      ...game,
      unitsAvailable,
    };
  }));
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
