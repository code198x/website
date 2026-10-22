# Fill four assembly map-query gaps

Reuse cross-platform/patterns/rendering/tile-map/6502.inc unchanged. Keep existing BASIC entries and the frozen original twenty-machine inventory intact.

1. Add acorn-atom, commodore-pet, commodore-vic-20 and oric-atmos patterns/assembly/rendering/tile-map/{demo.asm,Makefile,README.md}. Reuse the BBC diagnostic with explicit ROM origins, writable map/result locations and reset vectors. Reserve no interpreter-owned RAM implicitly.
2. Add docs/assembly-map-gaps.json and scripts/verify-assembly-map-gaps.py. Assemble original synthetic reset fixtures with released Asm198x, execute each with released Emu198x, compare all 44 result bytes to the existing independent row oracle, and prove completed wrong-stride and invalid-write variants fail. Keep source immutable during verification.
3. Bind source, observer, fixture and tool hashes in retained verification records; add scripts/check-assembly-map-gaps.py and falsification checks in scripts/test_assembly_map_gaps.py, wired into Pattern evidence CI.
4. Add four website assembly entries alongside the BASIC pages. Explain include/init/call, carry, array stride, units, valid flags, RAM ownership, customisation, common errors and Maths for Games links. Verify content, actual included code and desktop/mobile layout.
5. Update the matrix from explicit route/evidence inventory, push review PRs and update docs issue 117. Clean task worktrees, tools and processes after saving evidence.

These diagnostics replace firmware. They establish CPU/RAM routine behaviour, not stock-ROM loading, graphics, interrupt coexistence or a frame budget. No new dependency or emulator change is planned.

The current specification also requires a concrete customisation and maintained wrong/fixed fragments. Add properties.inc and customise-properties.inc to each port, plus shared tile-map/mistakes/{wrong-stride-6502,write-without-valid-6502}.inc. Execute the closed-exit data variant on each machine; require property 4 to become 5, all other 43 results to agree and complete fixture binaries to differ in exactly one data byte. Keep the property table at four bytes. Validate all four variants and include the exact fragments on the website.

Check the verifier CLI default as well as explicit paths. A regression test in scripts/test_assembly_map_gaps.py reproduces the default asm198x name incorrectly resolving under the working directory. Resolve executable names through PATH in scripts/verify-assembly-map-gaps.py, retain absolute-path support, rerun the regression and all 16 native executions before updating the bound records.
