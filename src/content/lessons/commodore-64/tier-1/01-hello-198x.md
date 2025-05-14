---
title: Hello, 198x
system: commodore-64
tier: tier-1
lesson_number: 1
summary: The canonical C64 hello, with a little character.
---

The C64 had a glorious quirk: PETSCII. That’s Commodore's version of ASCII, but with funky line-drawing characters. Let’s mix a traditional "HELLO" with a bit of visual flair, and get a taste of the C64's character set.

## Code

```basic
10 PRINT "HELLO, 198X!"
20 FOR I=1 TO 8: PRINT CHR$(205.5+RND(1));: NEXT I
```

## Line-by-line

* Line 10 prints the standard greeting.
* Line 20 prints 8 random PETSCII characters using a clever trick: adding a random number to a halfway character code gives a pseudo-random effect.

## Did You Know?

The C64's graphics and text all live in character ROM — which means a lot of early games used PETSCII for their entire UI. No bitmaps required!

## Extra Credit

* Replace `205.5` with another value like `100` and observe the character changes.
* Use `PRINT CHR$(INT(RND(1)*255))` instead — what happens?
* Change the colour with `POKE 646,1` (1 = red, 2 = cyan, etc.)
