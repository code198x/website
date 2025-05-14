---
title: Hello, 198x
system: amstrad-cpc
tier: tier-1
lesson_number: 1
summary: Use MODE 1 for retro-chic, and display a flashy greeting.
---

The Amstrad CPC was a proper all-in-one machine: keyboard, tape or disk drive, and RGB monitor. It also had great BASIC — fast, clean, and capable. This program will print a message in one of its colourful text modes.

## Code

```basic
10 MODE 1
20 INK 0,0: INK 1,6: INK 2,26: INK 3,18
30 PRINT "HELLO, 198X!"
40 FOR i=1 TO 10: PRINT CHR$(143);: NEXT i
```

## Line-by-line

* Line 10 sets text mode with 4 colours.
* Line 20 defines custom INK colours for palette slots 0–3.
* Line 30 prints your greeting.
* Line 40 prints a line of PETSCII-style block characters.

## Did You Know?

The CPC’s INK system allowed you to remap any of the 27 palette colours to any slot — letting you swap entire colour schemes on the fly.

## Extra Credit

* Change the `CHR$(143)` to a different block character
* Try `MODE 0` or `MODE 2` to see the difference in resolution and colours
* Use `INK` to create gradients or weird palettes