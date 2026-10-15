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

`lesson-sound` checks delivered sound in Meteor Storm unit 24 and the editable
BASIC lesson modal. It copies samples posted to the AudioWorklet and measures
pitch from square-wave midpoint crossings: the impact tone should read about
523 Hz for 105 cycles, and `BEEP 1,12` about 523 Hz for a second. The BASIC
measurement starts after a printed readiness marker, excluding tape-loading
sound. It also checks that the sound choice carries to the next lesson, Pause
and closing the modal suspend audio, unticking Sound closes the context, and
leaving the lesson closes it. It measures delivered samples, not what reaches
a listener's ears.

`sound-beep` checks the maintained beeper pattern: both editable includes, actual
completion, four separated sounds delivered to the AudioWorklet, source and
include downloads, tape download, changed-source execution, revert, Sound off
and narrow-screen overflow. Listening remains a separate check.

`embedded-basic-values` qualifies the stored-value task in Meet BASIC unit 2.
It checks two reads of ONE, replacement with TWO, the original pilot's wrong
stored name and single-line repair, immediate wrong-name/repaired reads, RUN,
Restart and source reset. It waits for actual complete screen text, accounts for
the tape loader header and distinguishes a fresh restart from stale output.
Run it with a base URL and evidence directory like the checks above. Results
retain response hashes and failed assertions; passing this desktop task does not
establish learner understanding, latency or cross-platform accessibility.

`embedded-latency` measures the first-session greeting in Meet BASIC unit 1.
Pass a base URL, evidence directory and optional trial count (default five).
Each fresh context clears/disables browser HTTP cache, then measures an original
Run, a same-page unchanged Run and an edited greeting. The click capture event
starts the timer; complete ROM output, a fresh transcript transition, two animation
frame callbacks and nonblank canvas readback end it. Editing also records input
event to result, including the automation's submission gap. This is an observed
application endpoint, not first-pixel latency or a Core Web Vitals metric.
Results include individual timings, source/runtime hashes, network/cache records
and a missing-result timeout control. Warm means module reuse on the same page;
HTTP cache stays disabled. OS/DNS/CDN caches and other host load are uncontrolled.
