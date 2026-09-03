import { test } from 'vitest';
import assert from 'node:assert';
import { inflateSync, crc32 } from 'node:zlib';
import { encodePng } from './png.ts';

/** A 2×2 image: red, green / blue, white — all fully opaque. */
function swatch(): Uint8Array {
  return new Uint8Array([
    255, 0, 0, 255,   0, 255, 0, 255,
    0, 0, 255, 255,   255, 255, 255, 255,
  ]);
}

test('the signature is the eight bytes every PNG starts with', () => {
  const png = encodePng(swatch(), 2, 2);
  assert.deepEqual([...png.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
});

test('IHDR declares 8-bit truecolour with alpha, uncompressed and uninterlaced', () => {
  const png = encodePng(swatch(), 2, 2);
  // 8 signature + 4 length + 4 type = byte 16 is the start of IHDR's data.
  const ihdr = png.subarray(16, 29);
  const view = new DataView(ihdr.buffer, ihdr.byteOffset, ihdr.byteLength);

  assert.equal(view.getUint32(0), 2, 'width');
  assert.equal(view.getUint32(4), 2, 'height');
  assert.equal(ihdr[8], 8, 'bit depth');
  assert.equal(ihdr[9], 6, 'colour type 6 = RGBA');
  assert.equal(ihdr[10], 0, 'compression method');
  assert.equal(ihdr[11], 0, 'filter method');
  assert.equal(ihdr[12], 0, 'interlace method');
});

test('every chunk carries the CRC32 zlib computes for it', () => {
  const png = encodePng(swatch(), 2, 2);
  let at = 8;
  let chunks = 0;

  while (at < png.length) {
    const view = new DataView(png.buffer, png.byteOffset + at, 8);
    const length = view.getUint32(0);
    const body = png.subarray(at + 4, at + 8 + length);      // type + data
    const stated = new DataView(png.buffer, png.byteOffset + at + 8 + length, 4).getUint32(0);

    assert.equal(stated, crc32(body) >>> 0, `chunk ${chunks} CRC`);
    at += 12 + length;
    chunks += 1;
  }

  assert.equal(chunks, 3, 'IHDR, IDAT, IEND');
});

test('the IDAT inflates back to the exact scanlines it was given', () => {
  const rgba = swatch();
  const png = encodePng(rgba, 2, 2);

  // Locate IDAT rather than assuming its offset.
  let at = 8;
  let idat: Uint8Array | null = null;
  while (at < png.length) {
    const length = new DataView(png.buffer, png.byteOffset + at, 4).getUint32(0);
    const type = String.fromCharCode(...png.subarray(at + 4, at + 8));
    if (type === 'IDAT') idat = png.subarray(at + 8, at + 8 + length);
    at += 12 + length;
  }
  assert.ok(idat, 'there is an IDAT');

  const raw = new Uint8Array(inflateSync(idat));
  // Each row is one filter byte (0 = None) then its pixels.
  assert.equal(raw.length, 2 * (1 + 2 * 4));
  assert.equal(raw[0], 0, 'row 0 filter is None');
  assert.deepEqual([...raw.subarray(1, 9)], [...rgba.subarray(0, 8)]);
  assert.equal(raw[9], 0, 'row 1 filter is None');
  assert.deepEqual([...raw.subarray(10, 18)], [...rgba.subarray(8, 16)]);
});

test('a byte count that disagrees with the dimensions is refused', () => {
  assert.throws(() => encodePng(new Uint8Array(15), 2, 2), /15/);
});
