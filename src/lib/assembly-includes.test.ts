import { describe, expect, it } from 'vitest';
import { expandAssemblyIncludes } from './assembly-includes';
describe('browser assembly companion files', () => {
  it('expands the chosen editable data in place without touching comments', () => {
    expect(expandAssemblyIncludes('; include "no.asm"\n INCLUDE "assets.inc" ; art\n end start', {'assets.inc': 'shape: defb 129'}))
      .toBe('; include "no.asm"\n; Begin assets.inc\nshape: defb 129\n; End assets.inc\n end start');
  });
  it('rejects unprovided paths and inherited object names', () => {
    expect(() => expandAssemblyIncludes('include "../secret"', {})).toThrow('no companion');
    expect(() => expandAssemblyIncludes('include "toString"', {})).toThrow('no companion');
  });
  it('does not silently accept nested files', () => {
    expect(() => expandAssemblyIncludes('include "a"', {a: 'include "b"'})).toThrow('Nested');
  });
});
