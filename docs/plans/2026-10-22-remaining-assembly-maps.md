# Complete the remaining six assembly map-query ports

Keep BASIC and FORTH routes independent. Build on the pending four-port source PR #168 without changing its records or the original twenty-machine registry.

1. CPC and Aquarius: reuse tile-map/z80.inc unchanged; add each machine's assembly/rendering/tile-map/{demo.asm,properties.inc,customise-properties.inc,Makefile,README.md,verification/results.json}. Original replacement firmware and explicit RAM allocation qualify CPU/RAM only.
2. MSX and SVI-328: repeat that Z80 contract with explicit primary slot/reset configuration, mapped RAM and reserved stack. Execute each machine independently.
3. Atari XL and Dragon: reuse 6502.inc on the XL; add m6809.inc with the same byte-map contract, explicitly big-endian pointers and arithmetic division by eight. Keep 6502 decimal mode and 6809 register/stack ownership visible.
4. Add docs/remaining-assembly-maps.json and scripts/{verify-remaining-assembly-maps.py,check-remaining-assembly-maps.py,test_remaining_assembly_maps.py}. Build each positive, closed-exit customisation, wrong-stride and invalid-write fixture without editing source; compare complete 44-byte records with an independent host oracle and demand completed faulty callers. Bind source, observer, tools and fixture hashes. Test record corruption and missing/stale evidence before trusting green CI.
5. Add six machine-specific website entries with maintained CodeFromFile includes, include/init/call contracts, concrete customisation, common errors and Maths for Games links. Explain relevant memory/firmware differences and cite primary references. Verify rendered listings, links and desktop/mobile overflow/accessibility.
6. Update the language-separated coverage matrix and docs issue 117. Push source and website review PRs based on #168/#942, without merging unfinished dependent work. Retain evidence, remove task worktrees/build caches and stop task processes.

No new dependencies or emulator changes are planned. Memory-only diagnostics do not establish stock firmware loading, graphics, operating-system coexistence, frame deadlines or original hardware. Batches are separate coherent commits, with verification before advancing.
