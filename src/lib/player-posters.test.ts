import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { posterEntries, posterFor } from './player-posters';

const catalog: Array<{ id: string; name: string }> = existsSync('public/emulators/catalog.json')
  ? JSON.parse(readFileSync('public/emulators/catalog.json', 'utf8'))
  : [];

describe('player posters', () => {
  it.skipIf(catalog.length === 0)('has an entry for every browser-player family', () => {
    const missing = catalog.map(c => c.id).filter(id => !(id in posterEntries()));
    expect(missing).toEqual([]);
  });

  it('derives captions from the kind when none is given', () => {
    const entries = posterEntries();
    expect(entries['acorn-atom'].caption).toBeUndefined();
    const p = posterFor('acorn-atom', 'Acorn Atom');
    if (p) expect(p.caption).toBe('The Acorn Atom switched on, running its own firmware in our emulator.');
    const d = posterFor('sega-game-gear', 'Sega Game Gear');
    if (d) expect(d.caption).toBe('A test cartridge we wrote, running on the Sega Game Gear.');
  });

  it('returns null for an unknown family rather than a broken image', () => {
    expect(posterFor('not-a-machine', 'Nothing')).toBeNull();
  });

  it('uses the given caption for game posters', () => {
    expect(posterFor('sinclair-zx-spectrum', 'ZX Spectrum')?.caption).toMatch(/^Meteor Storm/);
  });
});
