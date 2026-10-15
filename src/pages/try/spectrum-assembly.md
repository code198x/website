---
layout: ../../layouts/FirstSessionLayout.astro
title: Change the Spectrum border with assembly
description: Change a Spectrum border, follow an instruction and keep your assembly source.
---

Send a value to the Spectrum's hardware, then change that value to choose a
different border colour. You will use an assembler: a tool that translates the
instructions you write into bytes the processor can execute.

You do not need BASIC or previous programming experience. Use a browser and
internet connection, preferably on a computer with a keyboard. The activity
uses the tools in the lesson page; local installation is optional.

## Open the lesson

Open [Change the border](/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-01/).
Read from the opening through **Try it in the page**. The lesson explains the
complete starting program, including where it starts and why it stays in a loop.

Open **Source · view and edit** beneath the experiment to reach its editor.
Find `ld a,2` there. It puts the value 2 into register A, a small store
inside the processor. The following `out ($FE),a` sends that value to the
Spectrum's border-control port. The lesson's table maps values 0–7 to colours.

Before choosing **Assemble and run**, predict the border colour. Run and compare.
The border surrounds the main screen area; it is not the whole screen.

## Change one value

Replace only the 2 in `ld a,2` with 4. Keep the comma and the rest of the program.
Predict the new colour using the table before assembling and running again.

Explain the journey: the source names an instruction, the assembler produces
its bytes, and the Spectrum's processor executes those bytes. Which instruction
puts your chosen value in A, and which sends it to the hardware?

If colours are difficult to distinguish, use their numeric values and the table
to discuss the prediction. Ask a partner to describe the observed colour if
helpful; keep a prediction separate from an observation you cannot make.

## Keep your source and stop

Choose **Download source** to keep your edited `.asm` file. Open the downloaded
file in a plain-text editor and check that it contains `ld a,4`. This checks the
saved instructions; it does not run them.

The lesson explains how to build a tape locally if you want that route later.
You do not need to install those tools to finish this browser activity.
Keep the downloaded copy before using **Revert**, which discards your edits and
restores the starting program. Each **Assemble and run** starts a fresh Spectrum
for the program, so you can correct an edit and run again.

You have reached a stopping point when the changed program runs, you can explain
which value you changed and you have checked your downloaded source.

## Try another question

Choose a different value from 0–7. Write down its predicted colour, change only
the value loaded into A, then assemble and run to compare.

For a closer look, continue to **From source to bytes** in the same lesson.
It shows how to supply the same instruction bytes with `defb`. Before that
experiment, predict whether changing the written form while keeping the bytes
the same should change the machine's behaviour. Follow the lesson's exact
replacement and restore the readable instruction afterwards.

## Continue or work on paper

Continue with [A byte becomes pixels](/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-02/)
to copy a pattern into screen memory. This introduces a different operation
from sending a value to a port.

If the browser tools are unavailable, use the lesson's colour table and complete
program to mark the value loaded into A and the instruction that sends it out.
Write your changed instruction and predicted colour on paper. Check it on the
machine when tools are available; the paper prediction is still useful work.

[Return to the guide](/try/) · [Use the session sheet](/try/session-sheet/)
