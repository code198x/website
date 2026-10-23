# Checked byte maps in Jupiter Ace FORTH

Fill the FORTH map-query gap alongside its existing assembly implementation. Reuse the existing stock-ROM keyboard/display transport, not a replacement firmware fixture. Keep the pending assembly batches unchanged.

1. Add jupiter-ace/patterns/forth/rendering/tile-map/{routines.fth,room.fth,customise.fth,demo.fth,README.md}. Supply explicit stack effects, descriptor ownership, dimensions/IDs, checked reads/writes, property lookup and non-negative signed-cell world-to-cell conversion. Use original byte data and measure dictionary space on the named RAM configuration.
2. Add maintained deliberately wrong stride and invalid-write variants under mistakes/. Execute the normal, changed-exit and both faulty variants from fresh stock-ROM starts; demand completed calls and documented symptoms. Include nonsquare rows, rejected bounds and IDs, conversion boundaries and stack/memory conservation checks.
3. Add scripts/{verify-ace-map.py,check-ace-map.py,test_ace_map.py}, retained source/ROM/emulator identities, observed screen/memory bytes and CI falsification controls. Verify every claimed result from the end of the actual ROM execution.
4. Add the FORTH website entry using CodeFromFile, explicit include/init/call examples, customisation, common mistakes, Maths for Games and assembly comparison links. Build and check exact rendered listings, desktop/phone layout, accessibility and source links.
5. Update the language-separated matrix and docs issue 117, push review PRs after verification, retain evidence and clean temporary worktrees/processes. Do not merge the earlier pending PRs without a new merge request.

No dependencies, schema changes, emulator fixes or new curriculum sequence are planned. The first target is the unexpanded Ace; if dictionary space proves insufficient, report the measured limit and explicitly qualify a larger configuration rather than claiming stock coverage.
