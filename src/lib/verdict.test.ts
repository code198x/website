import { describe, expect, it } from 'vitest';
import { classify, type MachineState, type ProgramExtent } from './verdict';

/** Unit 1's program: `org 32768`, and eleven bytes of it. */
const UNIT_1: ProgramExtent = { origin: 0x8000, length: 11 };

/** A machine doing nothing remarkable, for a test to vary one thing at a time. */
const running: MachineState = {
  pc: 0x8000,
  halted: false,
  interruptsEnabled: true,
  booted: false,
};

const at = (pc: number, rest: Partial<MachineState> = {}): MachineState => ({
  ...running,
  pc,
  ...rest,
});

describe('while the program has control', () => {
  it('says nothing at the first instruction', () => {
    expect(classify(at(0x8000), UNIT_1)).toBeNull();
  });

  it('says nothing at the last instruction', () => {
    expect(classify(at(0x800a), UNIT_1)).toBeNull();
  });

  it('speaks the moment the counter passes the end', () => {
    // One past the last byte is outside: the program has eleven bytes at
    // $8000, so $800B is the first address that is not its own.
    expect(classify(at(0x800b), UNIT_1)).toEqual({ kind: 'ran-off-the-end', pc: 0x800b });
  });
});

describe('when it goes wrong', () => {
  it('names running off the end, for a counter loose in RAM', () => {
    expect(classify(at(0xd2d1), UNIT_1)).toEqual({ kind: 'ran-off-the-end', pc: 0xd2d1 });
  });

  it('names a reset, for a counter back in the ROM after a reboot', () => {
    expect(classify(at(0x11cb, { booted: true }), UNIT_1)).toEqual({ kind: 'reset' });
  });

  it('names a halt that nothing can wake', () => {
    expect(classify(at(0x0038, { halted: true, interruptsEnabled: false }), UNIT_1)).toEqual({
      kind: 'halted-forever',
    });
  });

  it('says nothing for a halt that an interrupt will wake', () => {
    // The `halt` unit 1 asks for. Waiting for the next interrupt fifty times a
    // second is the program working, not failing.
    expect(classify(at(0x0038, { halted: true, interruptsEnabled: true }), UNIT_1)).toBeNull();
  });

  it('says nothing for a program that returned to BASIC', () => {
    // Counter in the ROM, no reset, not halted: where a program that ends
    // properly goes.
    expect(classify(at(0x1303), UNIT_1)).toBeNull();
  });
});

describe('the order it decides in', () => {
  it('prefers where the counter is over what the machine is doing', () => {
    // The case that made this order deliberate: a reader deletes the halt/jr
    // pair, the program runs off into RAM, and the machine eventually halts
    // with interrupts disabled. Both facts are true. Only one of them explains
    // how the machine got there, and telling someone who just removed their
    // halt that the machine halted is true and useless.
    const verdict = classify(
      at(0xd2d1, { halted: true, interruptsEnabled: false, booted: true }),
      UNIT_1,
    );
    expect(verdict).toEqual({ kind: 'ran-off-the-end', pc: 0xd2d1 });
  });

  it('prefers a reset over a halt, once the counter is back in the ROM', () => {
    const verdict = classify(
      at(0x0000, { halted: true, interruptsEnabled: false, booted: true }),
      UNIT_1,
    );
    expect(verdict).toEqual({ kind: 'reset' });
  });
});

describe('a program with no single load address', () => {
  it('says nothing, having no range to be outside of', () => {
    // A linked image's bytes are the linker's. Guessing at an origin here
    // would report every such program as broken.
    expect(classify(at(0xd2d1), { origin: null, length: 4096 })).toBeNull();
  });
});
