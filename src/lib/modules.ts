import { getCollection, type CollectionEntry } from 'astro:content';
import { getTotalUnitsCount, getUnitsAvailableCount, hasUnitsEntry } from './units';

export type ModulesEntry = CollectionEntry<'modules'>;
export type Module = ModulesEntry['data']['modules'][number];

// Module with computed units counts (from units collection)
export type ModuleWithCounts = Omit<Module, 'units' | 'unitsAvailable'> & {
  units: number;
  unitsAvailable: number;
};

/**
 * Get games for a specific platform and track combination
 */
export async function getModules(platform: string, track: 'assembly' | 'basic' | 'amos' | 'blitz'): Promise<Module[]> {
  const allGames = await getCollection("modules");
  const entry = allGames.find(g => g.data.platform === platform && g.data.track === track);
  return entry?.data.modules ?? [];
}

/**
 * Get games with computed unit counts (from units collection)
 */
export async function getModulesWithCounts(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz'
): Promise<ModuleWithCounts[]> {
  const games = await getModules(platform, track);

  return Promise.all(games.map(async (game) => {
    // Compute from units collection
    const units = await getTotalUnitsCount(platform, track, game.slug);
    const unitsAvailable = await getUnitsAvailableCount(platform, track, game.slug);

    // Remove the old fields and add computed ones
    const { units: _units, unitsAvailable: _avail, ...rest } = game as Module & { units?: number; unitsAvailable?: number };

    return {
      ...rest,
      units,
      unitsAvailable,
    };
  }));
}

/**
 * @deprecated Use getModulesWithCounts instead
 */
export const getModulesWithAvailability = getModulesWithCounts;

/**
 * Get the full games entry (includes platform and track metadata)
 */
export async function getModulesEntry(platform: string, track: 'assembly' | 'basic' | 'amos' | 'blitz'): Promise<ModulesEntry | undefined> {
  const allGames = await getCollection("modules");
  return allGames.find(g => g.data.platform === platform && g.data.track === track);
}

/**
 * Get all games entries across all platforms
 */
export async function getAllGamesEntries(): Promise<ModulesEntry[]> {
  return getCollection("modules");
}

/**
 * Count total games across all platforms
 */
export async function getTotalGamesCount(): Promise<number> {
  const allEntries = await getCollection("modules");
  return allEntries.reduce((total, entry) => total + entry.data.modules.length, 0);
}

/**
 * Count games for a specific platform (across all tracks)
 */
export async function getModulesCountForPlatform(platform: string): Promise<number> {
  const allEntries = await getCollection("modules");
  return allEntries
    .filter(entry => entry.data.platform === platform)
    .reduce((total, entry) => total + entry.data.modules.length, 0);
}

/**
 * Count *shipped* (complete) modules for a platform, across all tracks — a
 * catalogue-derived proxy for "how much curriculum this machine has". Used to
 * rank the homepage feature band so the machines with the most content lead.
 */
export async function getCompleteModulesForPlatform(platform: string): Promise<number> {
  const allEntries = await getCollection("modules");
  return allEntries
    .filter(entry => entry.data.platform === platform)
    .reduce((total, entry) => total + entry.data.modules.filter(m => m.status === 'complete').length, 0);
}

/**
 * Catalogue-derived stat cards for a track's PathCard — honest by construction
 * (never hand-typed). Shows "complete / total modules" and the count of units
 * actually live, so the numbers can't overclaim coming-soon content. See
 * decisions/state-lives-in-catalogues.md.
 */
export async function getTrackStatCards(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz'
): Promise<Array<{ value: string; label: string }>> {
  const mods = await getModulesWithCounts(platform, track);
  const complete = mods.filter(m => m.status === 'complete');
  const unitsLive = complete.reduce((sum, m) => sum + (m.unitsAvailable ?? 0), 0);
  return [
    { value: `${complete.length}/${mods.length}`, label: 'Modules live' },
    { value: String(unitsLive), label: 'Units live' },
  ];
}
