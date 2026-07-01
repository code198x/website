/**
 * Platform utilities - helpers for working with the platforms collection
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Platform = CollectionEntry<'systems'>;
export type PlatformData = Platform['data'];
export type Architecture = CollectionEntry<'architectures'>;
export type ArchitectureData = Architecture['data'];

/**
 * Tiers that count as "active": the machine has real curriculum and a
 * hand-built landing page. Everything else is coming-soon. `tier` is the
 * single source of truth (see content.config.ts) — there is no separate
 * status field to keep in sync.
 */
export const ACTIVE_TIERS = ['live', 'next'] as const;
export const isActivePlatform = (p: Platform): boolean =>
  (ACTIVE_TIERS as readonly string[]).includes(p.data.tier);

/**
 * Get all platforms, sorted by navOrder
 */
export async function getAllPlatforms(): Promise<Platform[]> {
  const platforms = await getCollection('systems');
  return platforms.sort((a, b) => a.data.navOrder - b.data.navOrder);
}

/**
 * Get only active platforms (live or next), sorted by navOrder
 */
export async function getActivePlatforms(): Promise<Platform[]> {
  const platforms = await getAllPlatforms();
  return platforms.filter(isActivePlatform);
}

/**
 * Get coming-soon platforms (everything not live/next), sorted by year
 */
export async function getComingSoonPlatforms(): Promise<Platform[]> {
  const platforms = await getAllPlatforms();
  return platforms
    .filter(p => !isActivePlatform(p))
    .sort((a, b) => a.data.year - b.data.year || a.id.localeCompare(b.id));
}

/**
 * Get a single platform by its slug (filename without extension)
 */
export async function getPlatformBySlug(slug: string): Promise<Platform | undefined> {
  const platforms = await getCollection('systems');
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

/**
 * Get platforms formatted for the pattern library
 * Returns array with slug, name, color (as CSS var reference)
 * Includes 'cross-platform' as a special case
 * Note: Uses 'nintendo-nes' slug for pattern library routes (not full 'nintendo-entertainment-system')
 */
export async function getPlatformsForPatternLibrary(): Promise<Array<{
  slug: string;
  name: string;
  color: string;
  gradient?: string;
}>> {
  // Live systems only — next-tier machines have no patterns yet, so they'd show as
  // 0-pattern dead-ends. Cross-platform is added below regardless of this filter.
  const platforms = (await getActivePlatforms()).filter(p => p.data.tier === 'live');

  // Map collection IDs to pattern library slugs (NES uses shorter form)
  const patternSlugs: Record<string, string> = {
    'nintendo-entertainment-system': 'nintendo-nes',
  };

  // Map to pattern library format with CSS variable references
  const cssVarNames: Record<string, string> = {
    'commodore-64': '--c64-blue',
    'sinclair-zx-spectrum': '--zx-magenta',
    'commodore-amiga': '--amiga-orange',
    'nintendo-entertainment-system': '--nes-red',
  };

  // Gradients for platform pages
  const gradients: Record<string, string> = {
    'commodore-64': 'linear-gradient(135deg, #3b3b8f 0%, #5555bb 50%, #7777dd 100%)',
    'sinclair-zx-spectrum': 'linear-gradient(135deg, #8f3b5f 0%, #bb5577 50%, #dd7799 100%)',
    'commodore-amiga': 'linear-gradient(135deg, #cc5200 0%, #ff6600 50%, #ff8833 100%)',
    'nintendo-entertainment-system': 'linear-gradient(135deg, #b30613 0%, #e30613 50%, #ff4444 100%)',
  };

  const result = platforms.map(p => ({
    slug: patternSlugs[p.id] || p.id,
    name: p.data.name,
    color: cssVarNames[p.id] ? `var(${cssVarNames[p.id]})` : p.data.color,
    gradient: gradients[p.id] || `linear-gradient(135deg, ${p.data.color} 0%, ${p.data.color} 100%)`,
  }));

  // Add cross-platform as special case
  result.push({
    slug: 'cross-platform',
    name: 'Cross-Platform',
    color: 'var(--color-primary)',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #3d7ab5 100%)',
  });

  return result;
}

/**
 * Get all CPU architectures, sorted by order
 */
export async function getAllArchitectures(): Promise<Architecture[]> {
  const architectures = await getCollection('architectures');
  return architectures.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Get architecture by its ID (slug)
 */
export async function getArchitectureById(id: string): Promise<Architecture | undefined> {
  const architectures = await getCollection('architectures');
  return architectures.find(a => a.id === id);
}

// Manufacturer types and helpers
export type Manufacturer = CollectionEntry<'manufacturers'>;
export type ManufacturerData = Manufacturer['data'];

/**
 * Get all manufacturers
 */
export async function getAllManufacturers(): Promise<Manufacturer[]> {
  return await getCollection('manufacturers');
}

/**
 * Get manufacturer by ID
 */
export async function getManufacturerById(id: string): Promise<Manufacturer | undefined> {
  const manufacturers = await getCollection('manufacturers');
  return manufacturers.find(m => m.id === id);
}

/**
 * Get platforms grouped by manufacturer
 */
export async function getPlatformsByManufacturer(): Promise<Map<string, Platform[]>> {
  return getPlatformsGroupedBy('manufacturer');
}

/**
 * Get platforms grouped by type (computer, console, handheld)
 */
export async function getPlatformsByType(): Promise<Map<string, Platform[]>> {
  return getPlatformsGroupedBy('type');
}
