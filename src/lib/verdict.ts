/**
 * What to tell a reader whose program stopped doing what they asked.
 *
 * Kept apart from the machine that produces the evidence, because this is a
 * policy rather than a mechanism: the interesting part is the order it decides
 * in, and that should be readable — and testable — without instantiating a
 * Spectrum.
 */

/** Where a program was assembled to, so we can tell if it is still there. */
export interface ProgramExtent {
  /** Load address, or `null` for a linked image with no single one. */
  origin: number | null;
  length: number;
}

/** What the machine looked like at one check. */
export interface MachineState {
  pc: number;
  halted: boolean;
  interruptsEnabled: boolean;
  booted: boolean;
}

/**
 * Each verdict is a mistake a unit teaches against, which is the point: the
 * reader meets the explanation at the moment it applies to them rather than in
 * a troubleshooting list read before they had the problem.
 */
export type Verdict =
  | { kind: 'ran-off-the-end'; pc: number }
  | { kind: 'halted-forever' }
  | { kind: 'reset' };

/** The first address of Spectrum RAM. Below it is ROM. */
const RAM_BASE = 0x4000;

/**
 * Decides what to say, from where the counter is and what the machine is doing.
 *
 * The order is the opinion. **Where the counter is beats what the machine is
 * doing**, because where it is explains how it got there: a program that runs
 * off its own end usually ends up halted somewhere in RAM, and telling a reader
 * who just deleted their `halt` that the machine halted is true and useless.
 *
 * `null` means nothing worth saying — the counter is inside the program, or
 * back in the ROM where a program that ends properly returns to.
 */
export function classify(state: MachineState, extent: ProgramExtent): Verdict | null {
  // A linked image has no single load address, so there is no range to be
  // outside of and nothing here can be said honestly.
  if (extent.origin === null) return null;

  if (state.pc >= extent.origin && state.pc < extent.origin + extent.length) return null;

  if (state.pc >= RAM_BASE) return { kind: 'ran-off-the-end', pc: state.pc };
  if (state.booted) return { kind: 'reset' };
  if (state.halted && !state.interruptsEnabled) return { kind: 'halted-forever' };
  return null;
}
