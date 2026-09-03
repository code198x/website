/**
 * RGBA to PNG, using only `node:zlib`.
 *
 * A PNG encoder is not worth a dependency: this is IHDR + IDAT + IEND with
 * filter type 0, and Node ships the deflate. Hand-written binary formats are
 * where quiet corruption lives, so `png.test.ts` verifies the output three
 * ways — structure, chunk CRCs, and an inflate that must reproduce the exact
 * scanlines — and `tests/native-image.spec.ts` has a real browser decode one.
 */
import { deflateSync, crc32 } from 'node:zlib';

const SIGNATURE = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function chunk(type: string, data: Uint8Array): Uint8Array {
  const body = new Uint8Array(4 + data.length);
  for (let i = 0; i < 4; i += 1) body[i] = type.charCodeAt(i);
  body.set(data, 4);

  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  out.set(body, 4);
  view.setUint32(8 + data.length, crc32(body) >>> 0);
  return out;
}

/** Encode row-major RGBA8 as a PNG. */
export function encodePng(rgba: Uint8Array, width: number, height: number): Uint8Array {
  const expected = width * height * 4;
  if (rgba.length !== expected) {
    throw new Error(
      `${width}×${height} RGBA needs ${expected} bytes, got ${rgba.length}`,
    );
  }

  const header = new Uint8Array(13);
  const headerView = new DataView(header.buffer);
  headerView.setUint32(0, width);
  headerView.setUint32(4, height);
  header[8] = 8;   // bit depth
  header[9] = 6;   // colour type: truecolour with alpha
  header[10] = 0;  // compression: deflate
  header[11] = 0;  // filter: adaptive
  header[12] = 0;  // interlace: none

  // One filter byte per row, always 0 (None). Filtering would shrink the file;
  // these are small, and an unfiltered stream is one less thing to get wrong.
  const stride = width * 4;
  const raw = new Uint8Array(height * (1 + stride));
  for (let y = 0; y < height; y += 1) {
    raw[y * (1 + stride)] = 0;
    raw.set(rgba.subarray(y * stride, (y + 1) * stride), y * (1 + stride) + 1);
  }

  const ihdr = chunk('IHDR', header);
  const idat = chunk('IDAT', new Uint8Array(deflateSync(raw, { level: 9 })));
  const iend = chunk('IEND', new Uint8Array(0));

  const png = new Uint8Array(
    SIGNATURE.length + ihdr.length + idat.length + iend.length,
  );
  let at = 0;
  for (const part of [SIGNATURE, ihdr, idat, iend]) {
    png.set(part, at);
    at += part.length;
  }
  return png;
}
