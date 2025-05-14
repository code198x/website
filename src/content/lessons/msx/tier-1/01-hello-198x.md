---
title: Hello, 198x
system: msx
tier: tier-1
lesson_number: 1
summary: Display your first greeting in MSX BASIC.
---

MSX BASIC is based on Microsoft BASIC but tailored to the standardised MSX hardware spec — think of it as a clean, slightly enhanced flavour. Let’s use it to write a colour-cycling welcome.

## Code

```basic
10 COLOR 15,4,4
20 PRINT "HELLO, 198X!"
30 FOR I=0 TO 255 STEP 16: COLOR I MOD 16,4,4: NEXT I
```

Type this into your emulator and run it.

Each iteration updates the text colour; the screen flashes as “HELLO, 198X!” gets printed again and again.

## Line-by-line

* Line 10 sets the foreground, background, and border colour.
* Line 20 prints your message.
* Line 30 cycles through different foreground colours.

## Did You Know?

Because MSX was a hardware standard, you could write code on a Sony MSX and run it unchanged on a Yamaha or Panasonic. That was a _big deal_ in the early '80s.

## Extra Credit

* Try changing the `STEP` to 1 or 32 — what effect does it have?
* Use `CLS` at the top of the loop to make the colour changes clearer.
* Print other strings in different colours using `LOCATE`.
