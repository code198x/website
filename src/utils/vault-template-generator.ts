// Template generator for Vault pages
// Creates consistent layouts across all categories

import type { VaultEntry } from '../schemas/vault-schema';

// Generate filter options based on entry type
export function generateFilterOptions(entries: VaultEntry[], category: string) {
  switch (category) {
    case 'hardware':
      return {
        type: [...new Set(entries.map(e => e.type))],
        manufacturer: [...new Set(entries.map(e => (e as any).manufacturer).filter(Boolean))],
        cpu: [...new Set(entries.map(e => (e as any).cpu).filter(Boolean))],
        decade: getDecades(entries),
      };

    case 'people':
      return {
        type: [...new Set(entries.map(e => e.type))],
        nationality: [...new Set(entries.map(e => (e as any).nationality).filter(Boolean))],
        company: extractCompanies(entries),
      };

    case 'software':
      return {
        type: [...new Set(entries.map(e => e.type))],
        platform: [...new Set(entries.flatMap(e => (e as any).platforms || []))],
        genre: [...new Set(entries.flatMap(e => (e as any).genre || []))],
        developer: [...new Set(entries.map(e => (e as any).developer).filter(Boolean))],
      };

    case 'companies':
      return {
        type: [...new Set(entries.map(e => e.type))],
        status: ['active', 'defunct'],
        decade: getFoundedDecades(entries),
      };

    // Add more categories...
    default:
      return {
        type: [...new Set(entries.map(e => e.type))],
      };
  }
}

// Helper functions
function getDecades(entries: any[]): string[] {
  const years = entries.map(e => e.year).filter(Boolean);
  const decades = [...new Set(years.map(y => Math.floor(y / 10) * 10))];
  return decades.sort().map(d => `${d}s`);
}

function getFoundedDecades(entries: any[]): string[] {
  const years = entries.map(e => e.founded).filter(Boolean);
  const decades = [...new Set(years.map(y => Math.floor(y / 10) * 10))];
  return decades.sort().map(d => `${d}s`);
}

function extractCompanies(entries: any[]): string[] {
  const companies = entries.flatMap(e =>
    (e.companies || []).map((c: any) => c.name)
  );
  return [...new Set(companies)].sort();
}

// Generate breadcrumb trail
export function generateBreadcrumbs(category: string, entryName?: string) {
  const crumbs = [
    { text: 'The Vault', href: '/vault' },
    { text: getCategoryDisplayName(category), href: `/vault/${category}` }
  ];

  if (entryName) {
    crumbs.push({ text: entryName, href: null });
  }

  return crumbs;
}

// Get human-readable category names
export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    hardware: 'Hardware Archive',
    people: 'People & Pioneers',
    companies: 'Companies & Organizations',
    software: 'Software Library',
    techniques: 'Techniques & Tricks',
    publications: 'Publications & Media',
    events: 'Events & Gatherings',
    groups: 'Groups & Teams',
    formats: 'Formats & Standards',
    culture: 'Culture & Movements',
  };
  return names[category] || category;
}

// Generate related entries section
export function generateRelatedEntries(entry: VaultEntry): Record<string, any[]> {
  const related: Record<string, any[]> = {};

  if (entry.relatedEntries) {
    Object.entries(entry.relatedEntries).forEach(([category, items]) => {
      related[getCategoryDisplayName(category)] = items;
    });
  }

  return related;
}

// Generate timeline events from entries
export function generateTimelineEvents(entries: VaultEntry[]): any[] {
  const events: any[] = [];

  entries.forEach(entry => {
    // Add main entry event
    if ('year' in entry && entry.year) {
      events.push({
        date: new Date(entry.year, 0, 1),
        title: entry.name,
        category: entry.category,
        slug: entry.slug,
        description: entry.description,
      });
    }

    // Add founded date for companies
    if ('founded' in entry && entry.founded) {
      events.push({
        date: new Date(entry.founded, 0, 1),
        title: `${entry.name} Founded`,
        category: 'companies',
        slug: entry.slug,
        description: `${entry.name} was established`,
      });
    }

    // Add birth dates for people
    if ('birthDate' in entry && entry.birthDate) {
      events.push({
        date: entry.birthDate,
        title: `${entry.name} Born`,
        category: 'people',
        slug: entry.slug,
        description: `Birth of ${entry.name}`,
      });
    }
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Generate search index for client-side searching
export function generateSearchIndex(entries: VaultEntry[]) {
  return entries.map(entry => ({
    slug: entry.slug,
    name: entry.name,
    category: entry.category,
    description: entry.description,
    tags: entry.tags,
    searchText: [
      entry.name,
      entry.description,
      ...entry.tags,
      entry.content || '',
    ].join(' ').toLowerCase(),
  }));
}

// Format display values
export function formatValue(value: any, type: string): string {
  if (!value) return 'Unknown';

  switch (type) {
    case 'year':
      return value.toString();
    case 'price':
      return value;
    case 'date':
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'list':
      return Array.isArray(value) ? value.join(', ') : value;
    default:
      return value.toString();
  }
}

// Get entry icon based on category and type
export function getEntryIcon(category: string, type?: string): string {
  const icons: Record<string, Record<string, string>> = {
    hardware: {
      computer: '🖥️',
      console: '🎮',
      chip: '💾',
      peripheral: '🖱️',
      addon: '🔌',
      default: '🔧'
    },
    people: {
      engineer: '👷',
      designer: '🎨',
      executive: '💼',
      artist: '🎨',
      musician: '🎵',
      programmer: '💻',
      default: '👤'
    },
    companies: {
      manufacturer: '🏭',
      publisher: '📚',
      developer: '💻',
      distributor: '🚚',
      default: '🏢'
    },
    software: {
      game: '🎮',
      application: '💿',
      os: '🖥️',
      utility: '🔧',
      demo: '🎪',
      language: '📝',
      default: '💾'
    },
    techniques: {
      graphics: '🎨',
      sound: '🔊',
      optimization: '⚡',
      algorithm: '🧮',
      'hardware-trick': '🔧',
      default: '💡'
    },
    publications: {
      magazine: '📰',
      book: '📚',
      manual: '📖',
      newsletter: '📮',
      fanzine: '📄',
      default: '📖'
    },
    events: {
      'trade-show': '🎪',
      launch: '🚀',
      competition: '🏆',
      'demo-party': '🎉',
      conference: '🎤',
      default: '📅'
    },
    groups: {
      demo: '🎪',
      cracking: '🔓',
      development: '💻',
      music: '🎵',
      art: '🎨',
      default: '👥'
    },
    formats: {
      file: '📄',
      media: '💾',
      video: '📹',
      audio: '🔊',
      protocol: '📡',
      default: '📦'
    },
    culture: {
      scene: '🌟',
      movement: '🚀',
      phenomenon: '✨',
      community: '🤝',
      practice: '📋',
      default: '🎭'
    }
  };

  const categoryIcons = icons[category] || {};
  return categoryIcons[type || 'default'] || categoryIcons.default || '📁';
}