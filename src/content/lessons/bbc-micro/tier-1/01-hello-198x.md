---
title: Hello, 198x
system: bbc-micro
tier: tier-1
lesson_number: 1
summary: Use BBC BASIC to display a stylish welcome.
---

BBC BASIC is fast, structured, and surprisingly elegant. The BBC Micro was used in schools across the UK, and many of us first touched code on one. Let’s fire up a text-mode screen and get your first program running.

## Code

```basic
10 MODE 1
20 PRINT "HELLO, 198X!"
30 FOR I%=1 TO 10: PRINT I%;" ";: NEXT
```

## Line-by-line

* Line 10 switches to MODE 1 (4 colours, 320x256 resolution).
* Line 20 prints a welcome message.
* Line 30 prints numbers 1 to 10 on the same line.

## Did You Know?

BBC BASIC supports named procedures, inline assembly, and even recursion. It was far ahead of most 8-bit dialects.

## Extra Credit

* Try `MODE 0` or `MODE 7` — what changes?
* Replace `I%` with `I`, then re-run it — what happens?
* Add a delay using `TIME` and `WAIT`
