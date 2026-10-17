---
layout: ../../layouts/FirstSessionLayout.astro
title: Sharing a first Code198x session
description: Preparation, hints and expected results for sharing a first Code198x session.
---

Help someone make a prediction, try a small change and explain what happened.
You do not need to know every answer. The linked lessons supply the programming
explanations; these notes help you prepare and support the session.

The [learner guide](/try/) offers BASIC and assembly independently.
Choose by interest: making messages or investigating processor instructions.
Previous programming experience can inform that choice without deciding it.

## Prepare the activity

Choose one [activity](/try/#choose-your-first-activity) and try its
exact steps yourself on the devices and network you will use. Check the editor,
run control, visible result and download. For BASIC, also check reopening a
saved text listing by replacing the whole editor contents and running it. Keep the session sheet or
paper available for predictions and notes.

The browser activities use an embedded Spectrum and require no local tool
installation. School devices may restrict scripts or downloads. Check this
before the session; use the paper alternative if the tools are unavailable.
Do not spend the whole session troubleshooting a restricted device.

Ask what would help the learner read, type or compare results. Allow larger
text, pauses and different ways to explain. For the border activity, a colour
name or table value can support discussion; do not treat a learner's inability
to distinguish colours as a programming error. A helper can describe the display.
Check access on the actual devices rather than assuming every tool fits every
learner.

Choose a stopping point before extending the activity. The first deliberate
change and a kept copy are enough for one session. No completion time is
promised. If working with a group, leave room for setup and for different paces.
Use your organisation's usual arrangements for supervision and sharing work;
no discussion-service account is required for the activities.

## Help without taking over

Let the learner predict before running or opening the lesson's explanation.
Ask what they expected, what appeared and which part of the program could
explain the difference. Offer one hint at a time and let them choose when to
read the answer. Help is part of learning, not a penalty.

In pairs, swap who operates the keyboard and who predicts. In a mixed group,
let people explain in words, drawings or code. Invite experienced programmers
to investigate the optional question without answering everyone else's core
activity for them.

Do not require the learner to invent a whole new project. The activity already
provides a guided change. A small variation of their own is an invitation after
they understand it.

## BASIC hints and expected results

The opening editor starts with line 10 printing `Welcome`, line 15 printing
`to you` and line 20 printing `from the Spectrum`. The result is those three
messages on separate lines, in that order. Changing only the quoted text in
line 10 changes the first message. The other lines still contain their original
instructions.

If the result is unexpected, ask the learner to point to each stored line in
turn. Then check quotation marks and whether they ran the edited listing.
**Back to the listing** returns from the Spectrum to the editor. The lesson's
**When the screen disagrees** section covers syntax and numbered-line behaviour.

For the optional text-editor change from line 15 to 25, the old third message
comes before the message now numbered 25. This program runs in increasing line
number order, not the order the text lines were edited. This instruction is for
the editable source listing. Typing `25 ...` into an existing Spectrum session
would add a line and leave line 15 in place until separately deleted.

For keeping work, copy the complete listing into a saved plain text file.
Reload the lesson, replace the whole editable listing with the saved text and
run it again. Check for the learner's chosen words. A successful save report
alone does not establish that the kept source can be recovered.

**Listing options → Download tape** also saves a `.tap` program for an emulator
with tape-loading controls. The current editable browser panel does not offer
a tape file picker. Typing BASIC `SAVE` into it is a separate workflow: that
screen has no recorder attached to retain the signal.

## Assembly hints and expected results

The starting `ld a,2` followed by `out ($FE),a` makes the border red. Changing
only 2 to 4 makes it green. The main screen is unaffected by these instructions.
The lesson explains the origin, labels and holding loop; keep those parts intact.

If the editor is hidden, open **Source · view and edit** beneath the experiment.
If the edit has no effect, ask whether they assembled and ran the edited source.
If assembly fails, read the diagnostic and check the named instruction, comma
and spelling. **Revert** restores the starting source, so download wanted edits
first. A fresh run replaces the previous machine session.

**Download source** keeps the readable `.asm` instructions. Opening that file
and checking for `ld a,4` verifies that the edited source was saved. It does not
verify tape loading or execute the file by itself.

In the optional byte experiment, the lesson's `defb $3E,$02` emits the same
bytes as `ld a,2`; the starting border result is therefore the same. This is an
assembler directive, not an extra instruction executed by the Z80. Follow the
lesson's complete experiment, including restoring `ld a,2` first if necessary.

## When to pause or continue

Look for an explanation of the change, not a particular choice of words. Can
the learner identify what they changed, describe the result and point to the
instruction responsible? A working copied program alone does not answer that
question. An incorrect prediction followed by a useful explanation can show
progress.

If the activity is frustrating, save what is worth keeping and stop. Note the
point where help became necessary. If the learner wants more, use that activity's
next lesson or optional question; there is no requirement to complete both routes.

For broader preparation and group guidance, see
[Teaching](/teaching/). Use the
[feedback prompts](/try/feedback/) if you want to share what helped or got in the way.
Keep learner names and other identifying information out of public reports.
