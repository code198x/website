/**
 * Platform utilities - helpers for working with the platforms collection
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Platform = CollectionEntry<'platforms'>;
export type PlatformData = Platform['data'];

/**
 * Get all platforms, sorted by navOrder
 */
export async function getAllPlatforms(): Promise<Platform[]> {
  const platforms = await getCollection('platforms');
  return platforms.sort((a, b) => a.data.navOrder - b.data.navOrder);
}

/**
 * Get only active platforms (not coming-soon)
 */
export async function getActivePlatforms(): Promise<Platform[]> {
  const platforms = await getAllPlatforms();
  return platforms.filter(p => p.data.status === 'active');
}

/**
 * Get a single platform by its slug (filename without extension)
 */
export async function getPlatformBySlug(slug: string): Promise<Platform | undefined> {
  const platforms = await getCollection('platforms');
  return platforms.find(p => p.id === slug);
}

/**
 * Group platforms by a specific field
 */
export async function getPlatformsGroupedBy<K extends keyof PlatformData>(
  field: K
): Promise<Map<PlatformData[K], Platform[]>> {
  const platforms = await getAllPlatforms();
  const grouped = new Map<PlatformData[K], Platform[]>();

  for (const platform of platforms) {
    const key = platform.data[field];
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(platform);
  }

  return grouped;
}

/**
 * Get platforms grouped by bit-ness (8-bit, 16-bit, 32-bit)
 */
export async function getPlatformsByBits(): Promise<Map<string, Platform[]>> {
  return getPlatformsGroupedBy('bits');
}

/**
 * Get platforms grouped by CPU architecture
 */
export async function getPlatformsByCpuArchitecture(): Promise<Map<string, Platform[]>> {
  return getPlatformsGroupedBy('cpuArchitecture');
}

/**
 * Get platforms grouped by region
 */
export async function getPlatformsByRegion(): Promise<Map<string, Platform[]>> {
  return getPlatformsGroupedBy('region');
}

/**
 * Get platform color by slug (useful for components that just need the color)
 */
export async function getPlatformColor(slug: string): Promise<string> {
  const platform = await getPlatformBySlug(slug);
  return platform?.data.color ?? '#888888';
}

/**
 * Get platform display name by slug
 */
export async function getPlatformName(slug: string): Promise<string> {
  const platform = await getPlatformBySlug(slug);
  return platform?.data.name ?? slug;
}

/**
 * Get platform short name by slug
 */
export async function getPlatformShortName(slug: string): Promise<string> {
  const platform = await getPlatformBySlug(slug);
  return platform?.data.shortName ?? slug;
}
