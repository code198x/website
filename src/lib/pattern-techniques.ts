import {techniques, type Technique} from '../data/pattern-techniques';

interface PatternEntry { id: string; body?: string; data: {title: string; platform: string} }
export function resolveTechniques<T extends PatternEntry>(entries: T[]) {
  const ids = new Set(techniques.map(t => t.slug));
  if (ids.size !== techniques.length) throw Error('Duplicate technique identity');
  const patterns = new Map(entries.map(e => [e.id, e]));
  return techniques.map(technique => {
    for (const next of technique.next) if (!ids.has(next)) throw Error(`Unknown next technique: ${next}`);
    const implementations = technique.implementations.map(implementation => {
      const entry = patterns.get(implementation.id);
      if (!entry) throw Error(`Missing pattern: ${implementation.id}`);
      const expected = implementation.evidence === 'emulator-executed'
        ? '**Code status: assembled and emulator-executed.**' : '**Code status: illustrative';
      if (!entry.body?.includes(expected)) throw Error(`Evidence summary needs review: ${entry.id}`);
      return {...implementation, entry, language: entry.id.includes('/assembly/') ? 'Assembly' : entry.id.includes('/basic/') ? 'BASIC' : 'Pseudocode'};
    });
    return {...technique, implementations};
  });
}
export function techniqueBySlug(slug: string): Technique {
  const result = techniques.find(t => t.slug === slug);
  if (!result) throw Error(`Unknown technique: ${slug}`);
  return result;
}
