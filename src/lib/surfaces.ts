/**
 * Family support surfaces — helpers over the per-system `emu198x` / `devReady`
 * flags (umbrella decision: 198x/decisions/support-surfaces.md).
 *
 * Pure module: no astro:content imports, so scripts/support-gaps.mjs can
 * import it directly under Node.
 */

/**
 * Where Asm198x documents each CPU.
 *
 * Asm198x publishes a generated instruction reference — one page per CPU,
 * built from its `isa` spec — under
 * `asm198x.github.io/docs/instructions/<page>.html`. The two projects name the
 * same chip differently (`6502` here, `mos6502` there; `mcs48` here, `i8048`
 * there), so the join is stated rather than guessed at from a prefix.
 *
 * Keyed by the systems collection's `cpuArchitecture` values. Coverage means
 * the assembler speaks the CPU — not that a runnable artefact can be produced.
 * That end-to-end bar (assemble → frame program → master media) is `devReady`.
 *
 * Asm198x also documents `pdp11`, `s2650`, `scmp`, `tms7000`, `z8000` and
 * `z80n`, which no system in the fleet currently declares. They are absent
 * here because nothing would look them up, not because they are unsupported.
 *
 * Seven architectures in the fleet have no page: `arm`, `mips`, `sh2`, `sh4`,
 * `tlcs900`, `v810` and `x86`. Those systems get no link rather than a guess.
 */
export const ASM198X_INSTRUCTION_PAGES: Readonly<Record<string, string>> = {
  '1802': 'cdp1802',
  '6502': 'mos6502',
  '65c816': 'mos65816',
  '6800': 'm6800',
  '6809': 'mos6809',
  '68000': 'm68k',
  '8080': 'i8080',
  cp1610: 'cp1610',
  f8: 'f8',
  huc6280: 'huc6280',
  mcs48: 'i8048',
  sm83: 'sm83',
  tms9900: 'tms9900',
  z80: 'z80',
};

/**
 * ISAs covered by the Asm198x `isa` spec crate, derived from the page map so
 * the two cannot disagree.
 *
 * This was previously a hand-kept list and had fallen four CPUs behind —
 * `cp1610`, `f8`, `mcs48` and `tms9900` were all covered by the spec and all
 * missing here. `scripts/support-gaps.mjs` therefore filed five systems under
 * "CPU not in the ISA spec" that the spec does cover: the TI-99/4A, the Tomy
 * Tutor, the Fairchild Channel F, the Intellivision and the Magnavox
 * Odyssey². Deriving the set from the page map is what stops it drifting
 * again.
 */
export const ASM198X_ISAS: ReadonlySet<string> = new Set(
  Object.keys(ASM198X_INSTRUCTION_PAGES),
);

export const asmCoversCpu = (cpuArchitecture: string): boolean =>
  ASM198X_ISAS.has(cpuArchitecture);

/**
 * The instruction-reference URL for a CPU, or `null` when Asm198x has no page
 * for it. Callers render a link only when this returns one.
 */
export const asmInstructionReference = (cpuArchitecture: string): string | null => {
  const page = ASM198X_INSTRUCTION_PAGES[cpuArchitecture];
  return page ? `https://asm198x.github.io/docs/instructions/${page}.html` : null;
};
