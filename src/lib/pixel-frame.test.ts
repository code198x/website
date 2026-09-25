import { describe, expect, it } from 'vitest';
import { integerScale, pngSize } from './pixel-frame';

function pngHeader(width: number, height: number): Uint8Array {
  const b = new Uint8Array(24);
  b.set([137, 80, 78, 71, 13, 10, 26, 10], 0);
  new DataView(b.buffer).setUint32(16, width);
  new DataView(b.buffer).setUint32(20, height);
  return b;
}

describe('pngSize', () => {
  it('reads width and height from the IHDR chunk', () => {
    expect(pngSize(pngHeader(352, 296))).toEqual({ width: 352, height: 296 });
  });
  it('rejects bytes that are not a PNG', () => {
    expect(() => pngSize(new Uint8Array(24))).toThrow(/not a PNG/);
  });
});

describe('integerScale', () => {
  it('takes the largest whole multiple that fits, up to the ceiling', () => {
    expect(integerScale(352, 800, 2)).toBe(2);
    expect(integerScale(352, 703, 2)).toBe(1);
    expect(integerScale(352, 2000, 2)).toBe(2);
  });
  it('never goes below 1, even when the frame is wider than its container', () => {
    expect(integerScale(768, 390, 2)).toBe(1);
  });
});
