import type { BreadcrumbItem } from '../components/Breadcrumb.astro';
import { getCategoryInfo } from './categoryInfo';
import { VAULT_CATEGORIES } from '../data/vault-categories';

type VaultCategory = keyof typeof VAULT_CATEGORIES;

/**
 * Generate breadcrumbs for vault pages
 */
export function generateVaultBreadcrumbs(category?: VaultCategory | string, entryName?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'The Vault', href: '/vault', icon: '🗄️' }
  ];

  if (category) {
    const categoryInfo = getCategoryInfo(category);
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

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for lesson pages
 */
export interface LessonBreadcrumbParams {
  systemName: string;
  systemSlug: string;
  phaseNumber?: number;
  tierNumber?: number;
  lessonNumber?: number;
  lessonTitle?: string;
}

export function generateLessonBreadcrumbs(params: LessonBreadcrumbParams): BreadcrumbItem[] {
  const { systemName, systemSlug, phaseNumber, tierNumber, lessonNumber, lessonTitle } = params;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Lessons', href: '/lessons', icon: '📚' },
    { label: systemName, href: `/lessons/${systemSlug}`, icon: '🖥️' }
  ];

  if (phaseNumber) {
    breadcrumbs.push({
      label: `Phase ${phaseNumber}`,
      href: tierNumber ? `/lessons/${systemSlug}/phase-${phaseNumber}` : undefined,
      icon: '📖'
    });

    if (tierNumber) {
      breadcrumbs.push({
        label: `Tier ${tierNumber}`,
        href: lessonNumber ? `/lessons/${systemSlug}/phase-${phaseNumber}/tier-${tierNumber}` : undefined,
        icon: '🎯'
      });

      if (lessonNumber && lessonTitle) {
        breadcrumbs.push({
          label: `Lesson ${lessonNumber}: ${lessonTitle}`,
          icon: '✏️'
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