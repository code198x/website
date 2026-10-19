# First Amiga assembly build: red and green

The unchanged first-unit Makefile builds and boots the intended red picture.
Changing only `COLOR00,$0f00` to `COLOR00,$00f0` builds and boots green.
The lesson's references to a vasm executable and a toolchain image were stale:
the Makefile invokes Asm198x and Build198x directly.

## Evidence

- `tools.json` identifies downloaded release archives, verified against GitHub's
  SHA-256 asset digests before extraction; `method.json` identifies binaries,
  sample checkout and bounded runtime observations.
- `builds.json` records source, Makefile, executable and ADF hashes. Each colour
  was built with the actual Makefile using `make ASM=<asm198x> BUILD=<build198x>`.
  Both executables also matched native `vasmm68k_mot -Fhunkexe -kick1hunks -nosym`
  output byte for byte. Each clean rebuild reproduced the same disk bytes.
- `incremental-build.json` confirms editing the existing red build and running
  `make` again reruns both stages and matches the clean green disk.
- `red-build.txt` and `green-build.txt` retain the Makefile commands and output.
  `$TOOLS` replaces the disposable directory prefix.
- `runtime.json`, `red.png` and `green.png` retain independent cold boots in the
  released Emu198x 0.38.1, A500 OCS PAL, Kickstart 1.3 configuration. After 2,000
  frames, the CPU's instruction start points at `60fe` (the self-branch), and
  431,648 of 442,368 captured pixels have the expected colour. The remaining
  pixels are the black outer capture margin. Both screenshots were inspected.
  Each capture fails the opposite-colour assertion, so the check distinguishes
  red from green. No firmware bytes, snapshots or private paths are retained.

- `render.json` confirms the edited lesson renders with its maintained source,
  names both tools, explains replacing the rebuilt disk, and links to the working
  setup guide. A navigation assertion initially ran before the client-side page
  swap completed; waiting for the destination URL and load state passes. It also
  records the corrected C64 starter bytes read from the live download.

## Limits

This is a macOS arm64 automated build and cold-boot observation, not a manual
host installation walkthrough, native GUI disk-replacement test or learner
study. Windows/Linux manual checks remain deferred. Native vasm independently
checks executable bytes; no second emulator was run in this bounded audit.

Initial local page-render attempts returned `500 !== 200`: the isolated
checkout lacked generated `public/emulators/catalog.json`. After supplying it,
Astro also reported "No cached compile metadata found" through a symlink to
the shared dependencies. Reusing a local copy of the installed dependencies
and restarting resolves those checkout prerequisites; no application behaviour
was changed to bypass them. A sandboxed Chrome launch
also failed; the rendering check uses an approved unsandboxed headless process.
