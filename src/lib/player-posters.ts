import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import catalog from '../../public/emulators/catalog.json';
import { pngSize } from './pixel-frame';

export type PosterKind = 'game' | 'boot' | 'demo';
export interface Poster { src: string; kind: PosterKind; caption: string; ceiling: number }
type Entry = { kind: PosterKind; src?: string; variant?: string; frame?: number; caption?: string; ceiling?: number };

/** A sensible width for the empty frame, when a family has no poster yet. */
const FALLBACK_STAGE_WIDTH = 704;

let cache: Record<string, Entry> | undefined;
export function posterEntries(): Record<string, Entry> {
  cache ??= load(readFileSync('src/data/player-posters.yaml', 'utf8')) as Record<string, Entry>;
  return cache;
}

/** The poster for a family, or null when it has no entry or no file yet. */
export function posterFor(familyId: string, machineName: string): Poster | null {
  const entry = posterEntries()[familyId];
  if (!entry) return null;
  const src = entry.src ?? `/images/systems/${familyId}/poster.png`;
  if (!existsSync(path.join('public', src))) return null;
  const caption = entry.caption ?? (entry.kind === 'demo'
    ? `A test cartridge we wrote, running on the ${machineName}.`
    : `The ${machineName} switched on, running its own firmware in our emulator.`);
  return { src, kind: entry.kind, caption, ceiling: entry.ceiling ?? 2 };
}

/**
 * The stage's target width: the poster's native width × its ceiling, the
 * largest size `PixelFrame` will ever render it at. `null` when the system
 * has no catalogue entry, so no stage renders at all. Falls back to
 * `FALLBACK_STAGE_WIDTH` for the empty frame, when a family has an entry but
 * no poster file yet.
 */
export function stageWidth(system: string, machineName: string): number | null {
  const entry = catalog.find((e) => e.id === system || e.aliases.includes(system));
  if (!entry) return null;
  const poster = posterFor(entry.id, machineName);
  if (!poster) return FALLBACK_STAGE_WIDTH;
  const { width } = pngSize(new Uint8Array(readFileSync(path.join('public', poster.src))));
  return width * poster.ceiling;
}
