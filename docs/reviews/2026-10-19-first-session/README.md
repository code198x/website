# First-session progress review — 19 October 2026

Selected first-program workflows now have evidence beyond building a supplied
example. Editing a colour, rebuilding and reopening the result works on the
named paths below. This is a review of retained observations, not a new runtime
campaign, a whole-course assessment or a general support certificate.

## Demonstrated workflows

| Route | Observation | Limit |
| --- | --- | --- |
| Spectrum | Browser source editing, error/repair and reopening an edited tape have retained checks. A macOS 48K checklist also received user-reported keyboard, listening and save/restore acceptance. | User confirmation is separate from automated observation. It does not identify an output device or qualify other hosts or releases. |
| C64 | The first PRG executes with red and edited green borders. The repaired BASIC starter is checked across twenty sources; Asm198x 0.0.71 and ACME agree. | This is the named PAL PRG import route, not a drive, disk or tape-fidelity result. |
| Amiga | The first assembly Makefile builds red and green executables and bootable ADFs using Asm198x 0.0.71 and Build198x 0.2.12. Native vasm bytes agree; Emu198x 0.38.1 boots both on A500 OCS PAL with Kickstart 1.3. | Cold-boot execution is automated. This is not native GUI disk replacement, another model or a new independent reference-runtime result. |
| NES | Browser red/blue builds, edited source/cartridge downloads, a local rebuild and fresh file selection pass. Asm198x 0.0.71 and ca65/ld65 agree; the downloaded cartridge executes in released Emu198x 0.38.1. | One NTSC mapper-0 cartridge. No additional mapper, region, host or independent runtime is qualified. |

For NES, [the public record](nes.json) retains the five browser handoff stages,
two independent build comparisons and three native runs. Each native run has
120 frames, the intended colour in RAM $00, the hold-loop instruction and the
corresponding backdrop. Browser and native checks compare all 61,440 pixels.
Only cartridge byte 47 changes between red and blue. Downloaded blue source
rebuilds to identical cartridge bytes. No firmware or save-state bytes are
included in this review.

The maintained NES verifier initially waited inside a closed source drawer,
then tried to download source behind the open emulator panel. The repaired
verifier opens/closes those existing controls and completes its runtime,
error/repair, Revert, narrow-width and multiple-player assertions. These were
verification-script failures; no learner-facing NES defect was reproduced.

## Corrections that changed the result

- The C64 BASIC next-line pointer was malformed despite successful SYS execution.
  [Samples PR #107](https://github.com/code198x/code-samples/pull/107) repairs the
  twenty starters and adds a check against an independent tokenised fixture.
- The Amiga lesson named vasm and a toolchain image although its Makefile used
  Asm198x and Build198x directly.
  [Website PR #838](https://github.com/code198x/website/pull/838) corrects the
  instructions and retains the red/green build and boot evidence.
- Failed native Spectrum quick-load and File → Open operations lacked visible
  recovery feedback. [Emu PR #1827](https://github.com/emu198x/emu198x/pull/1827)
  and [Emu PR #1844](https://github.com/emu198x/emu198x/pull/1844) add warning
  dialogs. Their named macOS candidates received user-reported checklist
  acceptance. Candidate acceptance does not qualify a subsequently published
  binary or another host.
- [Website PR #841](https://github.com/code198x/website/pull/841) repairs the
  stale NES verifier interactions. Its actual Chrome run passes.

## What remains unknown

An uncoached learner's ability to predict, explain, debug and create remains
unobserved. Screen-reader use, physical touch and the deferred Windows/Linux
manual walkthroughs are not passed by browser automation. Complete native
keyboard/audio/display/file workflows still need named configuration and
release evidence; the Spectrum listening confirmation is one bounded case.

The selected assembly comparisons do not establish arbitrary dialect
compatibility. Hosted Spectrum evidence retention remains blocked; a local
campaign or a public repository's successful upload does not resolve that
separate capacity problem. Retained records do not automatically qualify new
tool releases.

## Recommended next checkpoints

- **Code198x:** review the next NES lesson, “LDA Is Not LET”, against its running
  program. Check the explanation of registers, the predicted colour and the
  fault/repair task. Learner understanding stays unknown until observed.
- **Emu198x:** exercise truncated-cartridge rejection followed by valid-cartridge
  recovery in the published NES binary, with exact state and exit observations.
  Keep manual host and native dialog checks separate.
- **Asm198x:** compare that next NES program with ca65/ld65, including its segment
  placement and an invalid operand. First-program parity is already demonstrated.

These are proposed checkpoints for review, not new roadmap commitments. They
can form one bounded source-to-execution follow-up using the existing lesson.

## Public source records

- [C64 retained repair evidence](https://github.com/code198x/code-samples/tree/c0859dc53671ce92fb33f87d02db3e5bc08f3aee/commodore-64/assembly/meet-the-machine/verification/starter-repair)
- [Amiga retained build/boot evidence](https://github.com/code198x/website/tree/fdd6611cca5c7bf3799ad7fc4d18346df4251415/docs/plans/2026-10-19-amiga-first-build)
- [NES verifier and its assertions](https://github.com/code198x/website/blob/3337269fca8e11d3cc226e4162e3d6971226931c/scripts/verification/nes-assembly.mjs)
- [Spectrum warning/recovery candidate record](https://github.com/emu198x/emu198x/blob/f6038818e0c4f9f2057dfeead065177afe77838e/docs/plans/2026-10-19-visible-media-open-failures.md)
- [Spectrum native acceptance ownership](https://github.com/emu198x/emu198x/issues/1771)

The public progress page keeps these reviewed first-session observations in its
editorial assessment. Its detailed evidence table retains the original five
selected pattern results, dates, tested versions and states. This review adds
no pattern qualification and changes no completion count.
