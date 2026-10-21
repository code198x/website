# Amiga first assembly build audit

Agreed scope: reconcile the first assembly lesson with its existing Asm198x/Build198x Makefile and verify red/green builds through boot and execution. No emulator or sample behaviour changes are planned.

1. Read unit-01.mdx, the getting-started guide and the sample Makefile/source. Record the stale assembler and toolchain-image references.
2. In a disposable build directory, run the unchanged Makefile with released, identified tools for the original red source and the single green colour edit. Reuse the existing Amiga runtime verifier for bounded boot and pixel/register checks; retain safe hashes, commands and results under docs/plans/2026-10-19-amiga-first-build/.
3. Correct src/content/curriculum/commodore-amiga/assembly/meet-the-machine/unit-01.mdx to name Asm198x and Build198x, link setup prerequisites and explain replacing the disk and resetting after a rebuild. Keep source and teaching structure intact.
4. Validate changed MDX and links, review the diff, commit and push a reviewable PR. Remove the isolated worktree and disposable binaries/builds after verifying remote retention. Record untested host/manual paths explicitly.

## Result

Red and green Makefile builds passed with Asm198x 0.0.71 and Build198x 0.2.12.
Both match native vasm executables and reproduce identical ADF bytes on clean
rebuilds. Both boot to the expected colour and hold loop in released Emu198x
0.38.1, A500 OCS PAL, Kickstart 1.3. Safe captures and results are retained in the
adjacent evidence directory. Manual host checks remain deferred.

Rendered lesson and setup-link navigation passed in headless Chrome. Template
whitespace (218 templates), curriculum routes (11 catalogues / 12 declared
edges) and diff whitespace checks passed. The full site build is left to CI.
