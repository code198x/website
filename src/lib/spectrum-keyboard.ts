/** Host keys that need several contacts on the Spectrum's keyboard matrix. */
const chords: Record<string, readonly string[]> = {
  ShiftRight: ['ShiftLeft'],
  AltRight: ['AltLeft'],
  ControlLeft: ['AltLeft'],
  ControlRight: ['AltLeft'],
  Comma: ['AltLeft', 'KeyN'],
  Period: ['AltLeft', 'KeyM'],
  Slash: ['AltLeft', 'KeyV'],
  Minus: ['AltLeft', 'KeyJ'],
  Equal: ['AltLeft', 'KeyL'],
  Semicolon: ['AltLeft', 'KeyO'],
  Quote: ['AltLeft', 'Digit7'],
  Backspace: ['ShiftLeft', 'Digit0'],
  Escape: ['ShiftLeft', 'Space'],
  ArrowLeft: ['ShiftLeft', 'Digit5'],
  ArrowDown: ['ShiftLeft', 'Digit6'],
  ArrowUp: ['ShiftLeft', 'Digit7'],
  ArrowRight: ['ShiftLeft', 'Digit8'],
  NumpadEnter: ['Enter'],
};

export function spectrumKeyCodes(code: string): readonly string[] | null {
  return chords[code] ?? (/^(Key[A-Z]|Digit[0-9]|Enter|Space|ShiftLeft|ShiftRight|AltLeft|AltRight|ControlLeft|ControlRight)$/.test(code) ? [code] : null);
}

/** A synthetic chord must not release a modifier another host key still holds. */
export class SpectrumKeyboard {
  #held = new Map<string, readonly string[]>();
  #contacts = new Map<string, number>();
  constructor(private send: (code: string, down: boolean) => void) {}

  press(code: string): boolean {
    const mapped = spectrumKeyCodes(code);
    if (!mapped) return false;
    if (this.#held.has(code)) return true;
    this.#held.set(code, mapped);
    for (const contact of mapped) {
      const count = this.#contacts.get(contact) ?? 0;
      if (count === 0) this.send(contact, true);
      this.#contacts.set(contact, count + 1);
    }
    return true;
  }

  release(code: string): boolean {
    const mapped = this.#held.get(code);
    if (!mapped) return false;
    this.#held.delete(code);
    for (const contact of mapped) {
      const count = (this.#contacts.get(contact) ?? 1) - 1;
      if (count === 0) {this.#contacts.delete(contact); this.send(contact, false);}
      else this.#contacts.set(contact, count);
    }
    return true;
  }

  releaseAll(): void {
    for (const contact of this.#contacts.keys()) this.send(contact, false);
    this.#held.clear();
    this.#contacts.clear();
  }
}
