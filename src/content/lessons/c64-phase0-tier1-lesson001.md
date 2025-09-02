---
title: "Hello, Computer!"
system: "c64"
platform: "c64"
phase_number: 0
phase: 0
tier_number: 1
tier: 1
lesson_number: 1
lesson: 1
description: "Your very first steps in programming. Learn to display text and do simple math on the Commodore 64."
challenges:
  - "Make it print your age"
  - "Calculate 1000/10"
  - "Print your name 5 times (use 5 lines)"
  - "Display '2+2=' and the answer"
common_problems:
  - problem: "See: ?SYNTAX ERROR"
    solution: "Check your spelling: PRINT not PRNT. Check your quotes: Need \" at start AND end"
  - problem: "Nothing happens when you type RUN"
    solution: "Did you press RETURN after each line? Did you use line numbers (10, 20, 30)?"
fun_fact: "In 1982, this is how EVERYONE learned to program. No internet, no tutorials - just you, the computer, and experimentation!"
next_lesson_preview: "Tomorrow you'll learn to change screen colors with a mysterious command called POKE..."
download_links:
  - name: "lesson001"
    url: "https://github.com/Code198x/learning-journey/blob/main/phase0-gateway/c64/tier1/lesson001.bas"
    type: "bas"
order: 1
---

```
╔════════════════════════════════════════╗
║                                        ║
║   LESSON 1: HELLO, COMPUTER!          ║
║                                        ║
║   Your journey begins here...         ║
║                                        ║
╚════════════════════════════════════════╝
```

Welcome, future programmer! Today you'll make the Commodore 64 obey your very first command.

## Your First Command

When you see the blinking cursor, type this EXACTLY:

```basic
PRINT "HELLO"
```

Press **RETURN**.

```
HELLO

READY.
```

**YOU DID IT!** The computer obeyed you!

---

## Program 1: One Line

Type **NEW** and press **RETURN** (this clears memory).

```basic
10 PRINT "HELLO"
```

Press **RETURN** after the line. Now type:

```basic
RUN
```

Press **RETURN**.

```
HELLO

READY.
```

You just wrote a PROGRAM!

---

## Program 2: Two Messages

Type **NEW**, then:

```basic
10 PRINT "HELLO"
20 PRINT "WORLD"
```

Type **RUN**.

```
HELLO
WORLD

READY.
```

The numbers tell the computer what order!

---

## Program 3: Your Name

Type **NEW**, then:

```basic
10 PRINT "YOUR NAME HERE"
```

But change **YOUR NAME HERE** to your actual name!

Type **RUN**.

The computer prints YOUR name!

---

## Program 4: Multiple Lines

Type **NEW**, then:

```basic
10 PRINT "I AM"
20 PRINT "COMMODORE 64"  
30 PRINT "READY TO WORK"
```

Type **RUN**.

Each line runs in order!

---

## Program 5: Math Magic

Type **NEW**, then:

```basic
10 PRINT 2+2
20 PRINT 10*5
30 PRINT 100-1
```

Type **RUN**.

```
4
50
99

READY.
```

No quotes = the computer calculates!

---

## Program 6: Mix It Up

Type **NEW**, then:

```basic
10 PRINT "THE ANSWER IS"
20 PRINT 6*7
30 PRINT "AMAZING!"
```

Type **RUN**.

You can mix text and math!