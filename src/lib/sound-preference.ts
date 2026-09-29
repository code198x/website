/**
 * The lesson runners' Sound choice, kept per viewer so turning it on in one
 * lesson carries to the next. Browser storage can be missing or throw (private
 * windows, blocked site data); then the choice simply is not remembered.
 */
const PREFERENCE_KEY = 'code198x-lesson-sound';

type Store = Pick<Storage, 'getItem' | 'setItem'>;

function defaultStore(): Store | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Whether this viewer turned sound on. Off unless they chose it: a browser
 * plays nothing before a click anyway, and the player starts unticked too.
 */
export function readSoundPreference(store: Store | null = defaultStore()): boolean {
  try {
    return store?.getItem(PREFERENCE_KEY) === 'on';
  } catch {
    return false;
  }
}

/** Remembers the choice for the next lesson. Returns false if it could not. */
export function writeSoundPreference(on: boolean, store: Store | null = defaultStore()): boolean {
  try {
    if (!store) return false;
    store.setItem(PREFERENCE_KEY, on ? 'on' : 'off');
    return true;
  } catch {
    return false;
  }
}
