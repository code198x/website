/**
 * Lesson backlinks — the reverse of the inline /vault/ and /patterns/ links
 * that unit pages carry. IA v3 promises every Vault/Pattern entry shows which
 * lessons cite it ("Referenced in lessons").
 *
 * Built once per build by scanning every unit's raw body for outbound links,
 * memoised at module scope so each page render reuses the same index.
 */
import { getCollection } from 'astro:content';

export interface Backlink { title: string; url: string }

let cache: Map<string, Backlink[]> | null = null;

function titleCaseGame(segment: string): string {
  return segment.replace(/^game-\d+-/, '').split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function buildIndex(): Promise<Map<string, Backlink[]>> {
  if (cache) return cache;
  const index = new Map<string, Backlink[]>();
  const units = await getCollection('unit-pages');

  for (const unit of units) {
    const url = `/${unit.id}`; // e.g. /sinclair-zx-spectrum/assembly/game-01-shadowkeep/unit-06
    const parts = unit.id.split('/');
    const gameName = parts[2] ? titleCaseGame(parts[2]) : '';
    const unitNum = parts[3]?.match(/unit-(\d+)/)?.[1];
    const context = [gameName, unitNum ? `Unit ${parseInt(unitNum, 10)}` : null].filter(Boolean).join(' · ');
    const title = unit.data.title ? `${unit.data.title}` : context;

    const body = unit.body ?? '';
    const targets = body.match(/\/(?:vault|patterns)\/[a-z0-9/-]+/g) ?? [];
    const seen = new Set<string>();
    for (const raw of targets) {
      const key = raw.replace(/\/+$/, '');
      // only count entry-level links (at least category/slug depth), skip the bare index
      if (key === '/vault' || key === '/patterns' || key.split('/').length < 3) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      const list = index.get(key) ?? [];
      list.push({ title, url });
      index.set(key, list);
    }
  }
  cache = index;
  return index;
}

/** Units that link to the given /vault/... or /patterns/... path. */
export async function getBacklinks(targetPath: string): Promise<Backlink[]> {
  const index = await buildIndex();
  return index.get(targetPath.replace(/\/+$/, '')) ?? [];
}
