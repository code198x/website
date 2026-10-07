import type { CollectionEntry } from 'astro:content';

type VaultEntry = Pick<CollectionEntry<'vault'>, 'id' | 'data'>;
type WorldEntry = Pick<CollectionEntry<'timeline'>, 'id' | 'data'>;
export interface TimelineEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  summary: string;
  category: string;
  type: 'subject' | 'birth' | 'death' | 'closure' | 'world';
  url?: string;
  reviewed: boolean;
}

/** The same dated fields the Vault article template uses; missing dates stay absent. */
const startFields: Record<string, 'born' | 'founded' | 'released' | 'originated' | 'emerged' | 'introduced'> = {
  people: 'born', companies: 'founded', groups: 'founded', magazines: 'founded',
  games: 'released', demos: 'released', books: 'released', tools: 'released',
  languages: 'released', software: 'released', emulators: 'released',
  techniques: 'originated', design: 'originated', technologies: 'originated',
  culture: 'emerged', phenomena: 'emerged', events: 'emerged', genres: 'emerged',
  distribution: 'emerged', communities: 'emerged', hardware: 'introduced', systems: 'introduced',
};
export function startYear(entry: VaultEntry): number | undefined {
  const field = startFields[entry.data.category];
  const year = field ? entry.data[field] : undefined;
  return typeof year === 'number' && Number.isInteger(year) ? year : undefined;
}

export function timelineEvents(vault: VaultEntry[], world: WorldEntry[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  for (const entry of vault) {
    const d = entry.data;
    const common = { category: d.category, url: `/vault/${entry.id}/`, reviewed: d.reviewed };
    const year = startYear(entry);
    if (year !== undefined) events.push({
      ...common, id: `${entry.id}-start`, year,
      title: d.category === 'people' ? `${d.title} born` : d.title,
      summary: d.subtitle || d.summary,
      type: d.category === 'people' ? 'birth' : 'subject',
    });
    // Preserve the original chronology's extra events, including unknown birth/founding years.
    if (d.category === 'people' && typeof d.died === 'number') events.push({
      ...common, id: `${entry.id}-death`, year: d.died, type: 'death',
      title: `${d.title} dies`, summary: d.subtitle || d.summary,
    });
    if (d.category === 'companies' && typeof d.ended === 'number') {
      const endings = { acquired: 'is acquired', absorbed: 'is absorbed', renamed: 'is renamed', dissolved: 'is dissolved', liquidated: 'goes into liquidation', ceased: 'ends' };
      events.push({ ...common, id: `${entry.id}-end`, year: d.ended, type: 'closure',
        title: `${d.title} ${d.ended_as ? endings[d.ended_as] : 'ends'}`, summary: d.subtitle || d.summary });
    }
  }
  for (const entry of world) events.push({
    ...entry.data, id: `world-${entry.id}`, type: 'world', reviewed: true,
  });
  return events.sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0) || a.title.localeCompare(b.title));
}

// Keep all existing decade URLs and include dated records outside that range.
export function timelineDecades(events: TimelineEvent[]): number[] {
  return [...new Set([1920,1930,1940,1950,1960,1970,1980,1990,2000,2010,2020,
    ...events.map(event => Math.floor(event.year / 10) * 10)])].sort((a,b) => a-b);
}
export function decadeEvents(events: TimelineEvent[], decade: number): TimelineEvent[] {
  return events.filter(event => event.year >= decade && event.year < decade + 10);
}
export function eventTotals(events: TimelineEvent[]) {
  const world = events.filter(event => event.type === 'world').length;
  return { total: events.length, vault: events.length - world, world };
}

export interface StorySelection {
  id: string;
  label: string;
  title: string;
  description: string;
  machine?: string;
  steps: Array<{ article: string; connection: string }>;
}
export function resolveStories(selections: StorySelection[], entries: VaultEntry[]) {
  return selections.map(story => ({ ...story, steps: story.steps.map(step => {
    const entry = entries.find(entry => entry.id === step.article);
    if (!entry || !entry.data.reviewed) throw new Error(`Timeline story needs a reviewed article: ${step.article}`);
    const year = startYear(entry);
    if (year === undefined) throw new Error(`Timeline story needs a recorded date: ${step.article}`);
    return { ...step, year, title: entry.data.title, url: `/vault/${entry.id}/` };
  }) }));
}
