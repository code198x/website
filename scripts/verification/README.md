# Browser lesson checks

## Spectrum source and download audit

From the website directory, with Asm198x and Build198x on PATH:

```sh
node scripts/check-spectrum-samples.mjs --build --report /tmp/spectrum-audit.json
```

`--samples`, `--asm` and `--build198x` override the sample root and executables.
Without `--build`, the check only reads the catalogues, pages and maintained
sources. Build mode copies tracked Spectrum samples to a new temporary
directory, removes existing build products from that copy, forces every
Makefile to build, lints BASIC and checks unit downloads. It also validates
TAP checksums, checks BASIC Makefile sources against lesson listings, and
compares Meteor Storm's downloadable machine code with each lesson's
interactive checkpoint. It keeps the temporary copy for inspection and records
its location, tool versions and source/output hashes in the JSON report.

This is delivery evidence, not execution evidence. Follow it with the native
checks in the sample repository: Meet BASIC's
`basic/meet-basic/opening/verification/verify.py`, Meet Assembly's
`assembly/meet-assembly/opening/verification/verify.py`, and Meteor Storm's
`assembly/meteor-storm/verification/{checkpoints,endpoint,boundaries}.py`.
Those scripts take `--emulator` and `--output`; Meet Assembly additionally
requires `--pasmo`, and Meteor Storm's endpoint accepts
`--checkpoint colour-bands`. Run `--help` for each command's arguments. Native
checks require a configured Spectrum 48K ROM and report the configuration they
actually exercise. Retained BASIC `teaching/verification/audit.py` checks
validate recorded source lineage and tapes; they do not rerun the games.

## Browser execution

Serve a production website build, then run a check from the website directory:

```sh
node scripts/verification/byte-pixels.mjs http://127.0.0.1:1986 /tmp/byte-check
```

Use the same arguments for `eight-rows`, `row-loop`, `drawing-routine`,
`movement`, `clocked-movement`, `guided-debugger` and `meet-assembly-release`.
Run them sequentially. They use the installed Chrome browser through Playwright.
The release check also reads the maintained sample sources; `CODE_SAMPLES_PATH`
overrides the sibling `code-samples` directory.

The focused checks exercise edits and real machine state. The release check
covers the entry link, first program, eight-lesson navigation, maintained source,
light/dark accessibility, narrow/desktop/wide layouts and an existing lesson URL.
It settles theme transitions before measuring contrast. A passed assembly is
followed by waiting for actual rendered or inspected state, not a fixed delay.

`evidence/meet-assembly-release/` records the npm 0.4.0 release checks and hashes.
The code-samples repository retains the independent assembler and fresh-tape
verification. Browser observations do not establish original-hardware behaviour.

`lesson-sound` checks the runners' Sound toggle. It ticks Sound in Meteor
Storm unit 24's panel and in a BASIC panel, copies every sample the page posts
to its AudioWorklet, and measures the pitch from crossings of the square wave's
midpoint: the impact tone should read about 523 Hz for 105 cycles, and
`BEEP 1,12` about 523 Hz for a second. It also checks the choice carries to the
next lesson, that Stop suspends the AudioContext and that unticking closes it.
It measures delivered samples, not what reaches a listener's ears.

`sound-beep` checks the maintained beeper pattern: both editable includes, actual
completion, four separated sounds delivered to the AudioWorklet, source and
include downloads, tape download, changed-source execution, revert, Sound off
and narrow-screen overflow. Listening remains a separate check.
