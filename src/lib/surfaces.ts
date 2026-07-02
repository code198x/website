/**
 * Family support surfaces — helpers over the per-system `emu198x` / `devReady`
 * flags (umbrella decision: 198x/decisions/support-surfaces.md).
 *
 * Pure module: no astro:content imports, so scripts/support-gaps.mjs can
 * import it directly under Node.
 */

/**
 * ISAs covered by the Asm198x `isa` spec crate. Per-CPU coverage is derived
 * from `cpuArchitecture`, never stored per-system: it means the assembler
 * speaks the CPU, not that a runnable artefact can be produced — that
 * end-to-end bar (assemble → frame program → master media) is `devReady`.
 */
// Keyed by the systems collection's cpuArchitecture values, one per isa-crate
// spec module.
export const ASM198X_ISAS: ReadonlySet<string> = new Set([
  '6502',
  'huc6280',
  'z80',
  'sm83',
  '68000',
  '6809',
  '65c816',
  '8080',
  '6800',
  '1802',
]);

export const asmCoversCpu = (cpuArchitecture: string): boolean =>
  ASM198X_ISAS.has(cpuArchitecture);
