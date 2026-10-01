import { describe, it, expect } from 'vitest';
import { primaryColour, validateColours, machinesJson, type MachineColour } from './machine-colours';

const red: MachineColour = { name: 'Stripe red', hex: '#d40000', role: 'livery', primary: true, confidence: 'estimate', source: 'x' };
const blue: MachineColour = { name: 'Screen blue', hex: '#0000d7', role: 'screen', primary: false, confidence: 'exact', source: 'y' };

describe('primaryColour', () => {
  it('returns the colour marked primary', () => expect(primaryColour([blue, red])).toBe(red));
  it('returns undefined when none is curated', () => {
    expect(primaryColour(undefined)).toBeUndefined();
    expect(primaryColour([blue])).toBeUndefined();
  });
});

describe('validateColours', () => {
  it('accepts a set with one primary', () => expect(validateColours([red, blue])).toEqual([]));
  it('rejects two primaries', () =>
    expect(validateColours([red, { ...blue, primary: true }])).toContain('more than one primary colour'));
  it('rejects a value that is not #rrggbb', () =>
    expect(validateColours([{ ...red, hex: 'firebrick' }])[0]).toMatch(/not #rrggbb/));
  it('rejects a colour with no source', () =>
    expect(validateColours([{ ...red, source: '' }])[0]).toMatch(/no source/));
});

describe('machinesJson', () => {
  it('keys by id, stringifies the year and keeps curated colours', () => {
    const out = machinesJson([
      { id: 'sinclair-zx81', data: { name: 'Sinclair ZX81', shortName: 'ZX81', year: 1981, color: '#111111' } },
      { id: 'sinclair-zx-spectrum', data: { name: 'Sinclair ZX Spectrum', shortName: 'Spectrum', year: 1982, color: '#cc0000', colours: [red] } },
    ]);
    expect(Object.keys(out)).toEqual(['sinclair-zx-spectrum', 'sinclair-zx81']);
    expect(out['sinclair-zx81']).toEqual({ name: 'Sinclair ZX81', short: 'ZX81', year: '1981', color: '#111111', colours: [] });
    expect(out['sinclair-zx-spectrum'].colours).toEqual([red]);
  });
});
