import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// A unit that places <RunIt /> itself must say so, or the layout adds a second
// strip at the end. The flag and the tag must agree in both directions.
describe('RunIt placement', () => {
  const units = globSync('src/content/curriculum/**/*.mdx').map(f => ({ f, s: readFileSync(f, 'utf8') }));
  it('flags every unit that places <RunIt />', () => {
    const bad = units.filter(u => u.s.includes('<RunIt') && !/^runItPlaced:\s*true$/m.test(u.s)).map(u => u.f);
    expect(bad).toEqual([]);
  });
  it('places <RunIt /> in every flagged unit', () => {
    const bad = units.filter(u => /^runItPlaced:\s*true$/m.test(u.s) && !u.s.includes('<RunIt')).map(u => u.f);
    expect(bad).toEqual([]);
  });
});
