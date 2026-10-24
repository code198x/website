# Three stacked deadline batches

Agreed approach: keep reusable countdowns separate from firmware sampling, input, turn arbitration and drawing. BASIC and assembly are independent routes. No merge or publication in this task.

1. Spectrum BASIC/assembly — docs issues 199/200. Reuse cross-platform/patterns/framework/elapsed-deadline/z80.inc and the maintained BASIC countdown; add sinclair-zx-spectrum/patterns/{assembly,basic}/framework/turn-deadline/{callers,adapters,loaders,customisations,mistakes,README,verification}. Verify six independent native cases per route (working/custom/wrong/repaired/arithmetic boundaries/wrong equality), exact assembled bytes or complete native BASIC inventory, normal firmware clock/input ownership, and real output. Add scripts/verify-spectrum-deadlines.py, retained checks and falsification tests, with CI coverage.
2. Atari 800XL assembly — issue 171. Reuse shared 6502 countdown and the existing USR/GRAPHICS 0/page-six conventions. Add atari-800xl/patterns/assembly/framework/turn-deadline plus verifier/checker/tests. Read RTCLOK coherently with NMI service retained; qualify input, wrap/expiry policy, custom/wrong/repaired and a second caller.
3. Atari 800XL BASIC — issue 172. Reuse the maintained BASIC helper only if its arithmetic contract is valid on native Atari numeric storage. Add atari-800xl/patterns/basic/framework/turn-deadline plus independent native verifier/checker/tests, line/variable inventory and measured costs.

For each batch: exact emulator/tool/firmware/source identities; generated loaders from actual emitted bytes; independent oracle and deliberately wrong control; owned RAM/stack/register/I/O contracts; no universal timing claims. Reproduce and explain bugs before fixes. Stop after repeated failed fixes and narrow scope rather than weaken guards.

Paired website layers: src/content/patterns/{sinclair-zx-spectrum,atari-800xl}/{basic,assembly}/framework/turn-deadline.mdx; own native images; CodeFromFile maintained listings; concise useful Maths/Craft links; tests for exact listings/captures, desktop/phone, internal links, discovery and overflow. Append natural comparisons to cross-platform/framework/game-loop-choices.mdx.

Commit/push each verified source layer before building the next, and pin original qualification commits on archive refs. Commit/push each paired website layer with child-closing refs. Use native GitHub stacks, three layers per repo; keep all checks visible and source-first publication dependency explicit. Run whole build/content and focused development/built browser checks on final combination. Retain evidence and remove task worktrees/tools/processes after positive remote or bundle retention checks.

## Implementation findings

- Spectrum requires END start for the generated USR tape entry. Keep fault drivers beside their includes so the legacy per-file build can compile them from their own directory. Seven assembly and six BASIC native cases cover these controls.
- Atari's complete 424-byte assembly caller exceeds page six. RAMTOP=124 plus GRAPHICS 0 leaves an explicit 1 KiB margin below $8000 code; state is separately owned at $8300. Wait for a fresh READY after the final loader POKE/NEXT before sending USR. Six native cases qualify this path.
- Atari BASIC reuses the unchanged decimal countdown and separately qualifies its own keyboard-entered program and native tables. The line-32768 immediate record is not numbered program text: it is three bytes empty and six after RUN. Keep that bounded record separate from program size.
- Website identity remains atari-800 while samples name the qualified atari-800xl model. No new platform identifier is needed.
