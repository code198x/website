import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { captureGrid } from './capture-grid';

const has = (src: string) => fs.existsSync(path.join('public', src));
const spectrum = '/images/sinclair-zx-spectrum/basic/meet-basic/opening/immediate.png';
const amiga = '/images/commodore-amiga/assembly/meet-the-machine/unit-02/screenshot.png';

describe('captureGrid', () => {
  it.runIf(has(spectrum))('keeps a native Spectrum capture at its stored grid', () => {
    expect(captureGrid(spectrum)).toEqual({ w: 352, h: 296, width: 352, height: 296 });
  });

  it.runIf(has(amiga))('halves an Amiga capture stored with every pixel doubled', () => {
    const g = captureGrid(amiga)!;
    expect([g.width, g.height]).toEqual([768, 576]);
    expect([g.w, g.h]).toEqual([384, 288]);
  });

  it('returns null for something that is not a readable PNG', () => {
    expect(captureGrid('/no/such/file.png')).toBeNull();
  });
});
