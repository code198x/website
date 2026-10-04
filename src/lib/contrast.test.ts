import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { spotStyle, contrastRatio, PAPER } from './contrast';
import { primaryColour, type MachineColour } from './machine-colours';

const read = (style: string, name: string) => style.match(new RegExp(`${name}: (#[0-9a-f]{6})`, 'i'))?.[1] ?? '';

describe('spotStyle', () => {
  it('returns nothing for an uncurated or non-hex colour', () => {
    expect(spotStyle(undefined)).toBe('');
    expect(spotStyle('firebrick')).toBe('');
  });

  it.each(['#ff6600', '#e30613', '#4a4dff', '#cc0000', '#f2d22e'])('derives a readable spot from %s', (hex) => {
    const style = spotStyle(hex);
    expect(contrastRatio(read(style, '--h-spot-ink'), PAPER)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#ffffff', read(style, '--h-spot'))).toBeGreaterThanOrEqual(4.5);
  });

  it('never passes the raw Amiga orange through as text', () => {
    expect(read(spotStyle('#ff6600'), '--h-spot-ink').toLowerCase()).not.toBe('#ff6600');
  });
});

const APPROVED_PRIMARY: Record<string, string> = {
  'sinclair-zx-spectrum': '#c20000',
  'commodore-64': '#706deb',
  'commodore-amiga': '#0055aa',
  'nintendo-entertainment-system': '#e60012',
};
const LAUNCH = ['sinclair-zx-spectrum', 'commodore-64', 'commodore-amiga', 'nintendo-entertainment-system'];

describe.each(LAUNCH)('%s curated spot ink', (id) => {
  const data = yaml.load(readFileSync(`src/content/systems/${id}.yaml`, 'utf8')) as { colours?: MachineColour[] };
  it('keeps the primary Steve approved on 2026-10-01', () => {
    expect(primaryColour(data.colours)?.hex.toLowerCase()).toBe(APPROVED_PRIMARY[id]);
  });
  it('has a primary colour that derives a readable spot', () => {
    const primary = primaryColour(data.colours);
    expect(primary, `${id} has no primary colour`).toBeDefined();
    const style = spotStyle(primary!.hex);
    expect(contrastRatio(read(style, '--h-spot-ink'), PAPER)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#ffffff', read(style, '--h-spot'))).toBeGreaterThanOrEqual(4.5);
  });
});
