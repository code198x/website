/**
 * The true pixel grid of a capture, worked out at build time.
 *
 * family-visual-identity.md §7: a capture renders at a whole multiple of its
 * true grid, and one stored with every column or row doubled is halved on
 * that axis, which loses nothing. The kit's Screen detects doubling in the
 * browser, but only for shapes no real screen has (wider than 1.8:1, or
 * taller than 1.2:1), and says an Amiga screen has to declare its grid.
 * Lessons have dozens of Amiga captures, so the site reads each PNG once at
 * build time and declares the grid itself when both axes are doubled.
 *
 * Only both-axes doubling is declared. An Amiga hi-res screen doubles its
 * rows and not its columns; halving only the rows would squash it to half
 * height, because hi-res pixels are half as wide as they are tall. Shown at
 * its stored size it keeps the machine's own proportions.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

export interface Grid { w: number; h: number; width: number; height: number }

const cache = new Map<string, Grid | null>();

function decode(bytes: Buffer): { w: number; h: number; px: (x: number, y: number) => number } | null {
  if (bytes.readUInt32BE(12) !== 0x49484452) return null; // IHDR
  const w = bytes.readUInt32BE(16);
  const h = bytes.readUInt32BE(20);
  const depth = bytes[24];
  const type = bytes[25];
  const interlace = bytes[28];
  if (depth !== 8 || interlace !== 0) return null;
  const channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 } as Record<number, number>)[type];
  if (!channels) return null;
  const idat: Buffer[] = [];
  for (let off = 8; off + 8 <= bytes.length;) {
    const len = bytes.readUInt32BE(off);
    const kind = bytes.toString('ascii', off + 4, off + 8);
    if (kind === 'IDAT') idat.push(bytes.subarray(off + 8, off + 8 + len));
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * channels;
  const out = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? out[y * stride + i - channels] : 0;
      const b = y > 0 ? out[(y - 1) * stride + i] : 0;
      const c = i >= channels && y > 0 ? out[(y - 1) * stride + i - channels] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + i] = v & 0xff;
    }
  }
  // A pixel as one number, for comparing: up to four channels in 32 bits.
  return { w, h, px: (x, y) => { let n = 0; for (let k = 0; k < channels; k++) n = n * 256 + out[y * stride + x * channels + k]; return n; } };
}

function doubled(img: NonNullable<ReturnType<typeof decode>>, axis: 'x' | 'y'): boolean {
  const { w, h, px } = img;
  if ((axis === 'x' ? w : h) % 2) return false;
  for (let y = 0; y < h; y += axis === 'y' ? 2 : 1) {
    for (let x = 0; x < w; x += axis === 'x' ? 2 : 1) {
      if (px(x, y) !== (axis === 'x' ? px(x + 1, y) : px(x, y + 1))) return false;
    }
  }
  return true;
}

/** Stored size and true grid of a PNG under public/, or null if it cannot be
 *  read (not a PNG, or a format this reader does not decode). */
export function captureGrid(src: string): Grid | null {
  if (cache.has(src)) return cache.get(src)!;
  let result: Grid | null = null;
  try {
    const bytes = fs.readFileSync(path.join(process.cwd(), 'public', src));
    if (bytes.readUInt32BE(0) === 0x89504e47) {
      const width = bytes.readUInt32BE(16);
      const height = bytes.readUInt32BE(20);
      result = { w: width, h: height, width, height };
      const img = decode(bytes);
      if (img && doubled(img, 'x') && doubled(img, 'y')) result = { w: width / 2, h: height / 2, width, height };
    }
  } catch {
    result = null;
  }
  cache.set(src, result);
  return result;
}
