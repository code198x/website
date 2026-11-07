import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { crc32, inflateSync } from 'node:zlib';
import { pngSize } from './pixel-frame';
import { posterEntries, posterFor, demoMediaFor } from './player-posters';

const catalog: Array<{ id: string; name: string }> = existsSync('public/emulators/catalog.json')
  ? JSON.parse(readFileSync('public/emulators/catalog.json', 'utf8'))
  : [];

describe('player posters', () => {
  it('resolves a complete PNG for every browser-player family', () => {
    expect(catalog.length).toBeGreaterThan(0);
    for (const family of catalog) {
      const poster = posterFor(family.id, family.name);
      expect(poster, family.id).not.toBeNull();
      const bytes = readFileSync(`public${poster!.src}`);
      const { width, height } = pngSize(bytes);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
      const image: Buffer[] = [];
      let end = false;
      let at = 8;
      while (at < bytes.length) {
        const size = bytes.readUInt32BE(at);
        const type = bytes.toString('ascii', at + 4, at + 8);
        const body = bytes.subarray(at + 4, at + 8 + size);
        expect(crc32(body) >>> 0, `${family.id} ${type}`).toBe(bytes.readUInt32BE(at + 8 + size));
        if (type === 'IDAT') image.push(bytes.subarray(at + 8, at + 8 + size));
        if (type === 'IEND') end = true;
        at += size + 12;
      }
      expect(end).toBe(true);
      expect(at).toBe(bytes.length);
      // Captures are 8-bit, non-interlaced RGB or RGBA (lesson posters).
      expect(bytes[24]).toBe(8);
      expect([2, 6]).toContain(bytes[25]);
      expect([...bytes.subarray(26, 29)]).toEqual([0, 0, 0]);
      expect(inflateSync(Buffer.concat(image)).length).toBe(height * (1 + width * (bytes[25] === 6 ? 4 : 3)));
    }
  });

  it('binds the three new images and staged sources to their capture receipt', () => {
    const receipt = JSON.parse(readFileSync('docs/reviews/2026-11-07-player-captures.json', 'utf8'));
    const hash = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
    const families = receipt.captures.map((capture: { family: string }) => capture.family);
    expect([...new Set(families)].sort()).toEqual(['msx2', 'sega-mega-drive', 'snk-neo-geo']);
    expect(new Set(families).size).toBe(families.length);
    for (const capture of receipt.captures) {
      const entry = posterEntries()[capture.family];
      const poster = posterFor(capture.family, capture.family);
      expect(entry.variant).toBe(capture.variant);
      expect(entry.frame).toBe(capture.frame);
      expect(hash(`public${poster!.src}`)).toBe(capture.pngSha256);
      if (entry.demo) {
        expect(capture.media).not.toBeNull();
        expect(capture.media.src).toBe(entry.demo.src);
        expect(capture.media.source?.src).toBe(entry.demo.src.replace(/\.bin$/, '.asm'));
        expect(hash(`public${capture.media.src}`)).toBe(capture.media.sha256);
        expect(hash(`public${entry.demo.src.replace(/\.bin$/, '.asm')}`)).toBe(capture.media.source.sha256);
        expect(hash(`public${entry.demo.src.replace(/demo\.bin$/, 'LICENSE')}`)).toBe(capture.media.source.licenseSha256);
      } else {
        expect(capture.media).toBeNull();
      }
    }
  });

  it('derives captions from the kind when none is given', () => {
    const entries = posterEntries();
    expect(entries['acorn-atom'].caption).toBeUndefined();
    const p = posterFor('acorn-atom', 'Acorn Atom');
    expect(p).not.toBeNull();
    expect(p!.caption).toBe('The Acorn Atom switched on, running its own firmware in our emulator.');
    const d = posterFor('sega-game-gear', 'Sega Game Gear');
    expect(d).not.toBeNull();
    expect(d!.caption).toBe('A test cartridge we wrote, running on the Sega Game Gear.');
  });

  it('keeps explicit lesson media ahead of family default displays', () => {
    const lesson = { src: '/lesson/program.bin', title: 'Lesson program' };
    expect(demoMediaFor('sega-mega-drive', lesson)).toBe(lesson);
    expect(demoMediaFor('snk-neo-geo')?.src).toBe('/code-samples/snk-neo-geo/demos/colour-screen/demo.bin');
    expect(demoMediaFor('nintendo-nes')).toBeUndefined();
  });

  it('returns null for an unknown family rather than a broken image', () => {
    expect(posterFor('not-a-machine', 'Nothing')).toBeNull();
  });

  it('uses the given caption for game posters', () => {
    expect(posterFor('sinclair-zx-spectrum', 'ZX Spectrum')?.caption).toMatch(/^Meteor Storm/);
  });

  it('caps a wide poster at 1× by default', () => {
    expect(posterFor('amstrad-cpc', 'Amstrad CPC')?.ceiling).toBe(1);
  });

  it('keeps the default 2× for a poster at or under the wide threshold', () => {
    expect(posterFor('acorn-atom', 'Acorn Atom')?.ceiling).toBe(2);
  });

  it('lets an explicit yaml ceiling win over the wide-poster default', () => {
    expect(posterFor('commodore-amiga', 'Commodore Amiga')?.ceiling).toBe(1);
  });
});
