import type { BreadcrumbItem } from '../components/Breadcrumb.astro';

// Category information for breadcrumbs
const VAULT_CATEGORIES = {
  applications: { label: 'Applications', icon: '🎨' },
  companies: { label: 'Companies', icon: '🏢' },
  culture: { label: 'Culture', icon: '🌐' },
  demos: { label: 'Demos', icon: '🎬' },
  'development-tools': { label: 'Development Tools', icon: '🔧' },
  drivers: { label: 'Drivers', icon: '⚙️' },
  emulators: { label: 'Emulators', icon: '💾' },
  events: { label: 'Events', icon: '🎪' },
  formats: { label: 'Formats', icon: '💾' },
  games: { label: 'Games', icon: '🎮' },
  groups: { label: 'Groups', icon: '👥' },
  hardware: { label: 'Hardware', icon: '🖥️' },
  'operating-systems': { label: 'Operating Systems', icon: '💻' },
  people: { label: 'People', icon: '👤' },
  plugins: { label: 'Plugins', icon: '🧩' },
  'programming-languages': { label: 'Programming Languages', icon: '📝' },
  projects: { label: 'Projects', icon: '📁' },
  publications: { label: 'Publications', icon: '📚' },
  techniques: { label: 'Techniques', icon: '⚡' },
  utilities: { label: 'Utilities', icon: '🛠️' }
} as const;

type VaultCategory = keyof typeof VAULT_CATEGORIES;

/**
 * Generate breadcrumbs for vault pages
 */
export function generateVaultBreadcrumbs(category?: VaultCategory, entryName?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'The Vault', href: '/vault', icon: '🗄️' }
  ];

  if (category) {
    const categoryInfo = VAULT_CATEGORIES[category];
    if (categoryInfo) {
      breadcrumbs.push({
        label: categoryInfo.label,
        href: entryName ? `/vault/${category}` : undefined,
        icon: categoryInfo.icon
      });

      if (entryName) {
        breadcrumbs.push({
          label: entryName,
          icon: categoryInfo.icon
        });
      }
    }
  }

  return breadcrumbs;
}

/**
 * Convert content collection entry to vault data format for RelatedEntries
 */
export function convertToVaultData(entry: any, category: VaultCategory) {
  // Map different date fields based on category
  const yearFieldMap = {
    applications: 'year',
    companies: 'founded',
    culture: 'period',
    demos: 'year',
    'development-tools': 'year',
    drivers: 'year',
    emulators: 'year',
    events: 'date',
    formats: 'year',
    games: 'year',
    groups: 'formed',
    hardware: 'year',
    'operating-systems': 'year',
    people: 'birthDate',
    plugins: 'year',
    'programming-languages': 'year',
    projects: 'year',
    publications: 'firstIssue',
    techniques: 'year',
    utilities: 'year'
  };

  const yearField = yearFieldMap[category];
  let year = null;

  if (yearField && entry.data[yearField]) {
    const yearValue = entry.data[yearField];
    if (typeof yearValue === 'number') {
      year = yearValue;
    } else if (yearValue instanceof Date) {
      year = yearValue.getFullYear();
    } else if (typeof yearValue === 'object' && yearValue.start) {
      // For culture entries with period objects
      year = yearValue.start;
    }
  }

  return {
    c: category,
    s: entry.slug,
    n: entry.data.name,
    d: entry.data.description,
    g: entry.data.tags,
    t: entry.data.type,
    y: year
  };
}

/**
 * Get recently added entries (simulated - in a real app this would be based on creation date)
 */
export function getRecentEntries(vaultData: any[], maxEntries = 6) {
  // For demo purposes, select entries with interesting variety
  // In a real app, this would sort by creation/update date
  const featuredSlugs = [
    'commodore-64', 'elite', 'jack-tramiel', 'ocean-software',
    'deluxe-paint', 'sid-chip', 'assembly-demoscene', 'iff-format'
  ];

  return vaultData
    .filter(entry => featuredSlugs.includes(entry.s))
    .slice(0, maxEntries);
}

/**
 * Get featured entries (curated highlights)
 */
export function getFeaturedEntries(vaultData: any[], maxEntries = 6) {
  // Curated selection of significant entries across categories
  const featuredSlugs = [
    'commodore', 'zx-spectrum', 'shigeru-miyamoto', 'tracker-music',
    'wordperfect', 'assembly-programming', 'computer-graphics-pioneers', 'mod-format'
  ];

  return vaultData
    .filter(entry => featuredSlugs.includes(entry.s))
    .slice(0, maxEntries);
}