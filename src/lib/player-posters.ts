import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

export type PosterKind = 'game' | 'boot' | 'demo';
export interface Poster { src: string; kind: PosterKind; caption: string; ceiling: number }
type Entry = { kind: PosterKind; src?: string; variant?: string; frame?: number; caption?: string; ceiling?: number };

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
