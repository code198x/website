import { getCollection } from 'astro:content';

/** Catalogue priorities are separate from authored lesson availability. */
export const systemStatus: Record<string, { label: string; description: string }> = {
  live: { label: 'Lessons available', description: 'Explore the published language tracks below. The curriculum continues to develop.' },
  next: { label: 'Prioritised', description: 'This system is prioritised for curriculum development. There is no published lesson sequence or release date yet.' },
  planned: { label: 'Planned', description: 'A curriculum for this system is planned. There is no published lesson sequence or release date yet.' },
  edge: { label: 'Under consideration', description: 'Curriculum coverage for this system is under consideration. There is no published lesson sequence yet.' },
  beyond: { label: 'Reference only', description: 'This system is included for reference. A curriculum is not currently planned.' },
};

export async function systemLessonCounts() {
  const counts = new Map<string, number>();
  for (const unit of await getCollection('unit-pages')) {
    const system = unit.id.split('/')[0];
    counts.set(system, (counts.get(system) ?? 0) + 1);
  }
  return counts;
}
