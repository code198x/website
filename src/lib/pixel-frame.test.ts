import { describe, expect, it } from 'vitest';
import { pngSize } from './pixel-frame';

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

