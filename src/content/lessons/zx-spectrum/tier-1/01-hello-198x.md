---
title: Hello, 198x
system: zx-spectrum
tier: tier-1
lesson_number: 1
summary: Get your ZX Spectrum to say hello with a splash of colour and a beep.
---

The ZX Spectrum might only have rubber keys and a single-channel beeper, but it packed personality into every byte. In this first lesson, you’ll write and run a short BASIC program that prints a message and adds some colour and sound to the mix. This is our "hello world", 198x-style.

## Code

```basic
10 PRINT "HELLO, 198X!"
20 BEEP 1,10
30 FOR i=1 TO 10: PRINT INK i; "198X ";: NEXT i
```

Type this into your emulator and run it. You'll see a cascade of greetings endlessly filling the screen!

Press `Break` or reset the emulator to stop the program.

## Line-by-line

* Line 10 prints a greeting.
* Line 20 uses the built-in `BEEP` command to emit a 1-second tone.
* Line 30 loops through the first 10 colours, printing "198X" each time with a different ink colour.

## Did You Know?

The Spectrum’s colours were stored in a separate attribute memory — that’s why colour changes can feel oddly disconnected from pixels. You’ll run into this a lot later when doing graphics.

## Extra Credit

* Change the `BEEP` to a lower pitch or negative duration: `BEEP 0.5,-15`
* Swap out `INK` for `PAPER` to change background colours
* Make the loop go to line 15 instead of line 10 — what happens, and why?
