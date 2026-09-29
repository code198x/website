import { describe, expect, it } from 'vitest';
import { readSoundPreference, writeSoundPreference } from './sound-preference';

const memory = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  };
};

const broken = {
  getItem: (): string | null => { throw new Error('blocked'); },
  setItem: () => { throw new Error('blocked'); },
};

describe('sound preference', () => {
  it('starts off for a new viewer', () => {
    expect(readSoundPreference(memory())).toBe(false);
  });

  it('remembers on and off', () => {
    const store = memory();
    expect(writeSoundPreference(true, store)).toBe(true);
    expect(readSoundPreference(store)).toBe(true);
    writeSoundPreference(false, store);
    expect(readSoundPreference(store)).toBe(false);
  });

  it('treats blocked or missing storage as off, without throwing', () => {
    expect(readSoundPreference(broken)).toBe(false);
    expect(writeSoundPreference(true, broken)).toBe(false);
    expect(readSoundPreference(null)).toBe(false);
    expect(writeSoundPreference(true, null)).toBe(false);
  });
});
