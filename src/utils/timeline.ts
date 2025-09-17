import type { CollectionEntry } from 'astro:content';
import { getCategoryInfo } from './categoryInfo';

export interface TimelineEvent {
  month: string;
  title: string;
  category: string;
  description: string;
  type: string;
  link: string;
}

export interface TimelineYear {
  year: number;
  events: TimelineEvent[];
}

interface TimelineConfig {
  yearField?: string;
  dateField?: string;
  titleFormat?: string;
  eventType?: string;
  customProcessor?: (item: any) => TimelineEvent | null;
}

// Category-specific timeline configurations
const TIMELINE_CONFIGS: Record<string, TimelineConfig> = {
  hardware: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  people: {
    dateField: 'birthDate',
    titleFormat: '{name} Born',
    eventType: 'birth'
  },
  companies: {
    yearField: 'founded',
    titleFormat: '{name} Founded',
    eventType: 'founding'
  },
  games: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  demos: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'demo'
  },
  groups: {
    yearField: 'formed',
    titleFormat: '{name} Formed',
    eventType: 'founding'
  },
  operatingSystems: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  programmingLanguages: {
    yearField: 'year',
    titleFormat: '{name} Created',
    eventType: 'creation'
  },
  applications: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  developmentTools: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  emulators: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  techniques: {
    yearField: 'year',
    titleFormat: '{name} Discovered',
    eventType: 'innovation'
  },
  formats: {
    yearField: 'year',
    titleFormat: '{name} Introduced',
    eventType: 'standard'
  },
  drivers: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  utilities: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  plugins: {
    yearField: 'year',
    titleFormat: '{name} Released',
    eventType: 'release'
  },
  publications: {
    customProcessor: (pub: any) => {
      // Publications have special handling for first/last issues
      const events: TimelineEvent[] = [];

      if (pub.data.firstIssue) {
        const year = new Date(pub.data.firstIssue).getFullYear();
        events.push({
          year,
          month: new Date(pub.data.firstIssue).toLocaleDateString('en-US', { month: 'long' }),
          title: `${pub.data.name} First Issue`,
          category: 'publications',
          description: pub.data.description,
          type: 'launch',
          link: `/vault/publications/${pub.slug || pub.id}`
        } as any);
      }

      if (pub.data.lastIssue) {
        const year = new Date(pub.data.lastIssue).getFullYear();
        events.push({
          year,
          month: new Date(pub.data.lastIssue).toLocaleDateString('en-US', { month: 'long' }),
          title: `${pub.data.name} Final Issue`,
          category: 'publications',
          description: `End of ${pub.data.name}`,
          type: 'closure',
          link: `/vault/publications/${pub.slug || pub.id}`
        } as any);
      }

      return events;
    }
  },
  culture: {
    customProcessor: (cult: any) => {
      // Culture uses period.start/end instead of year
      const events: TimelineEvent[] = [];

      if (cult.data.period?.start) {
        events.push({
          year: cult.data.period.start,
          month: '',
          title: cult.data.name,
          category: 'culture',
          description: cult.data.description,
          type: 'movement',
          link: `/vault/culture/${cult.slug || cult.id}`
        } as any);
      }

      if (cult.data.period?.end) {
        events.push({
          year: cult.data.period.end,
          month: '',
          title: `${cult.data.name} Ends`,
          category: 'culture',
          description: `End of ${cult.data.name}`,
          type: 'closure',
          link: `/vault/culture/${cult.slug || cult.id}`
        } as any);
      }

      return events;
    }
  },
  events: {
    dateField: 'date',
    titleFormat: '{name}',
    eventType: 'event'
  }
};

/**
 * Process a collection item into timeline events
 */
function processCollectionItem(
  item: any,
  category: string,
  config: TimelineConfig
): Array<TimelineEvent & { year: number }> {
  // Use custom processor if provided
  if (config.customProcessor) {
    const result = config.customProcessor(item);
    return Array.isArray(result) ? result : (result ? [result] : []);
  }

  // Extract year from the appropriate field
  let year: number | null = null;
  let month = '';

  if (config.yearField && item.data[config.yearField]) {
    year = item.data[config.yearField];
  } else if (config.dateField && item.data[config.dateField]) {
    const date = new Date(item.data[config.dateField]);
    year = date.getFullYear();
    month = date.toLocaleDateString('en-US', { month: 'long' });
  }

  if (!year) return [];

  // Format title
  const title = (config.titleFormat || '{name}')
    .replace('{name}', item.data.name || item.data.title || 'Unknown');

  // Get category slug for URL
  // Convert camelCase to kebab-case for category slugs
  const categorySlug = category.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');

  return [{
    year,
    month,
    title,
    category: categorySlug,
    description: item.data.description || '',
    type: config.eventType || 'general',
    link: `/vault/${categorySlug}/${item.slug || item.id}`
  }];
}

/**
 * Build timeline events from multiple collections
 */
export function buildTimelineEvents(
  collections: Record<string, any[]>
): TimelineYear[] {
  const timelineEvents: TimelineYear[] = [];

  // Process each collection
  Object.entries(collections).forEach(([category, items]) => {
    const config = TIMELINE_CONFIGS[category];
    if (!config || !items?.length) return;

    items.forEach(item => {
      const events = processCollectionItem(item, category, config);

      events.forEach(event => {
        const year = (event as any).year;
        delete (event as any).year;

        const existing = timelineEvents.find(e => e.year === year);
        if (existing) {
          existing.events.push(event);
        } else {
          timelineEvents.push({
            year,
            events: [event]
          });
        }
      });
    });
  });

  // Sort by year and then by month within each year
  timelineEvents.sort((a, b) => a.year - b.year);
  timelineEvents.forEach(yearGroup => {
    yearGroup.events.sort((a, b) => {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const aIndex = months.indexOf(a.month) !== -1 ? months.indexOf(a.month) : 99;
      const bIndex = months.indexOf(b.month) !== -1 ? months.indexOf(b.month) : 99;
      return aIndex - bIndex;
    });
  });

  return timelineEvents;
}

/**
 * Get color and icon mappings for timeline categories
 */
export function getTimelineCategoryStyles() {
  return {
    colors: {
      hardware: "blue",
      people: "green",
      companies: "purple",
      games: "orange",
      demos: "cyan",
      "operating-systems": "slate",
      "programming-languages": "emerald",
      applications: "amber",
      "development-tools": "rose",
      drivers: "stone",
      utilities: "teal",
      plugins: "fuchsia",
      emulators: "violet",
      techniques: "red",
      publications: "indigo",
      events: "pink",
      groups: "teal",
      formats: "orange",
      culture: "cyan",
      projects: "lime"
    },
    icons: {
      hardware: "🖥️",
      people: "👤",
      companies: "🏢",
      games: "🎮",
      demos: "🎬",
      "operating-systems": "💻",
      "programming-languages": "📝",
      applications: "💼",
      "development-tools": "🔧",
      drivers: "⚙️",
      utilities: "🛠️",
      plugins: "🧩",
      emulators: "🔄",
      techniques: "⚡",
      publications: "📖",
      events: "🎪",
      groups: "👥",
      formats: "💾",
      culture: "🌟",
      projects: "🎯"
    }
  };
}

/**
 * Filter timeline events by search query
 */
export function filterTimelineEvents(
  events: TimelineYear[],
  query: string,
  category?: string,
  eventType?: string
): TimelineYear[] {
  if (!query && !category && !eventType) return events;

  const filtered: TimelineYear[] = [];
  const searchLower = query?.toLowerCase() || '';

  events.forEach(yearGroup => {
    const filteredEvents = yearGroup.events.filter(event => {
      // Category filter
      if (category && category !== 'all' && event.category !== category) {
        return false;
      }

      // Event type filter
      if (eventType && eventType !== 'all' && event.type !== eventType) {
        return false;
      }

      // Search filter
      if (searchLower) {
        const titleMatch = event.title.toLowerCase().includes(searchLower);
        const descMatch = event.description.toLowerCase().includes(searchLower);
        if (!titleMatch && !descMatch) return false;
      }

      return true;
    });

    if (filteredEvents.length > 0) {
      filtered.push({
        year: yearGroup.year,
        events: filteredEvents
      });
    }
  });

  return filtered;
}

/**
 * Get all unique event types from timeline data
 */
export function getEventTypes(events: TimelineYear[]): string[] {
  const types = new Set<string>();
  events.forEach(yearGroup => {
    yearGroup.events.forEach(event => {
      if (event.type) types.add(event.type);
    });
  });
  return Array.from(types).sort();
}