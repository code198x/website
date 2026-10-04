import { describe, expect, it } from 'vitest';
import { playerFirmwareNote } from './player-firmware';

describe('player build firmware notes', () => {
  const entry = (firmware: Array<{ optional?: boolean; bundled?: boolean }>, demo?: string) => ({ variants: [{ id: 'model', firmware }], demo });
  it('recognises included required firmware without requiring optional files', () => {
    expect(playerFirmwareNote(entry([{ bundled: true }, { optional: true }]), 'model')).toBe('ROM included · no files needed');
  });
  it('still requires missing firmware when only some files are bundled', () => {
    expect(playerFirmwareNote(entry([{ bundled: true }, { bundled: false }]), 'model')).toContain('Needs your own ROM');
  });
  it('distinguishes no-ROM and demo builds from bring-your-own firmware', () => {
    expect(playerFirmwareNote(entry([]), 'model')).toContain('Runs without ROM');
    expect(playerFirmwareNote(entry([{}], 'demo'), 'model')).toContain('Runs a built-in demo');
    expect(playerFirmwareNote(entry([{}]), 'model')).toContain('Needs your own ROM');
    expect(playerFirmwareNote(undefined, undefined)).toContain('Needs your own ROM');
  });
});
