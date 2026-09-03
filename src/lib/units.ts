import { getCollection, type CollectionEntry } from 'astro:content';

export type UnitsEntry = CollectionEntry<'units'>;
export type Phase = UnitsEntry['data']['phases'][number];
export type Unit = UnitsEntry['data']['units'][number];

/**
 * Get unit details for a specific game
 */
export async function getUnitsEntry(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz' | 'machine',
  moduleSlug: string
): Promise<UnitsEntry | undefined> {
  const allUnits = await getCollection('units');
  return allUnits.find(
    u => u.data.platform === platform &&
         u.data.track === track &&
         u.data.moduleSlug === moduleSlug
  );
}

/**
 * Get units array for a specific game
 */
export async function getUnits(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz' | 'machine',
  moduleSlug: string
): Promise<Unit[]> {
  const entry = await getUnitsEntry(platform, track, moduleSlug);
  return entry?.data.units ?? [];
}

/**
 * Get phases array for a specific game
 */
export async function getPhases(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz' | 'machine',
  moduleSlug: string
): Promise<Phase[]> {
  const entry = await getUnitsEntry(platform, track, moduleSlug);
  return entry?.data.phases ?? [];
}

/**
 * Count total units for a specific game
 */
export async function getTotalUnitsCount(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz' | 'machine',
  moduleSlug: string
): Promise<number> {
  const units = await getUnits(platform, track, moduleSlug);
  return units.length;
}

/**
 * Count available units for a specific game
 */
export async function getUnitsAvailableCount(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz' | 'machine',
  moduleSlug: string
): Promise<number> {
  const units = await getUnits(platform, track, moduleSlug);
  return units.filter(u => u.available).length;
}

/**
 * Get a specific unit by number
 */
export async function getUnit(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz' | 'machine',
  moduleSlug: string,
  unitNumber: number
): Promise<Unit | undefined> {
  const units = await getUnits(platform, track, moduleSlug);
  return units.find(u => u.number === unitNumber);
}

/**
 * Get all units entries across all games
 */
export async function getAllUnitsEntries(): Promise<UnitsEntry[]> {
  return getCollection('units');
}

/**
 * Check if a units entry exists for a game
 */
export async function hasUnitsEntry(
  platform: string,
  track: 'assembly' | 'basic' | 'amos' | 'blitz' | 'machine',
  moduleSlug: string
): Promise<boolean> {
  const entry = await getUnitsEntry(platform, track, moduleSlug);
  return entry !== undefined;
}
