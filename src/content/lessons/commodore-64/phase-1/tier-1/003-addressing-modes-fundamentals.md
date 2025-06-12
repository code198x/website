---
title: "Addressing Modes Fundamentals"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 3
description: "Master the different ways the 6502 can access data - immediate, absolute, and zero page addressing modes. Learn when and why to use each mode."
learning_objectives:
  - "Understand what addressing modes are and why they matter"
  - "Master immediate addressing mode (#$value)"
  - "Learn absolute addressing mode ($address)"
  - "Practice zero page addressing mode ($zp)"
  - "Compare the efficiency of different addressing modes"
concepts:
  - "Addressing modes overview"
  - "Immediate addressing (#$value)"
  - "Absolute addressing ($address)"
  - "Zero page addressing ($zp)"
  - "Instruction timing and efficiency"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 3
---

# Lesson 3: Addressing Modes Fundamentals

You've already been using addressing modes without knowing it! Today, you'll learn what they are, why they exist, and how to choose the right one for each situation.

## What Are Addressing Modes?

Addressing modes are different ways to tell the 6502 processor where to find the data it needs to work with. Think of them as different ways to give directions:

- "Take the number 5" (immediate)
- "Take whatever is in house number 1024" (absolute)
- "Take whatever is in house number 80 on Main Street" (zero page)

The 6502 has several addressing modes, but we'll focus on the three most important ones today.

## Immediate Addressing Mode (#$value)

**Symbol**: `#` (hash/pound sign)
**Format**: `LDA #$41`
**Meaning**: "Load the actual value that follows"

You've already been using this! When you write `LDA #$41`, you're telling the processor to load the literal value $41 (not what's stored at address $41).

```assembly
LDA #$48    ; Load the value $48 (letter 'H')
LDA #$100   ; ERROR! Can't load values > $FF into 8-bit register
LDA #65     ; You can use decimal, but hex is more common
```

<CodeRunner 
  system="commodore-64"
  title="Immediate Addressing Examples"
  code="LDA #$48    ; Load the value $48 (letter 'H')
LDX #$0F    ; Load the value $0F (15) into X
LDY #$20    ; Load the value $20 (32) into Y"
  language="assembly"
/>

**When to use**: When you know the exact value at programming time.

## Absolute Addressing Mode ($address)

**Symbol**: `$` (dollar sign only)
**Format**: `LDA $0400`
**Meaning**: "Load whatever value is stored at this memory address"

This is how you read from any memory location in the C64's 64KB address space.

```assembly
LDA $0400   ; Load whatever character is at screen position 0
STA $0401   ; Store A register contents to screen position 1
LDA $D020   ; Load from border color register
```

<CodeRunner 
  system="commodore-64"
  title="Absolute Addressing Examples"
  code="; First, put something in memory to read
LDA #$41    ; Load 'A'
STA $0400   ; Store it at screen position 0

; Now read it back
LDA $0400   ; Load whatever is at screen position 0
STA $0401   ; Store it at screen position 1 (copy the character)"
  language="assembly"
/>

**When to use**: When accessing screen memory, I/O registers, or any memory location above $FF.

## Zero Page Addressing Mode ($zp)

**Symbol**: `$` with values $00-$FF only
**Format**: `LDA $80`
**Meaning**: "Load from this address in Zero Page (first 256 bytes)"

Zero page addressing is special because it's faster and uses less memory than absolute addressing.

```assembly
LDA $80     ; Load from Zero Page location $80 (fast!)
STA $81     ; Store to Zero Page location $81 (fast!)
LDA $0080   ; Same as LDA $80, but slower absolute addressing
```

<CodeRunner 
  system="commodore-64"
  title="Zero Page Addressing Examples"
  code="; Store some values in Zero Page
LDA #$42    ; Load 'B'
STA $80     ; Store in Zero Page location $80
LDA #$43    ; Load 'C'  
STA $81     ; Store in Zero Page location $81

; Read them back
LDA $80     ; Load from Zero Page $80
STA $0400   ; Display on screen
LDA $81     ; Load from Zero Page $81
STA $0401   ; Display on screen"
  language="assembly"
/>

**When to use**: For variables, temporary storage, and frequently accessed data.

## Comparing Addressing Modes

Here's how the same LDA instruction differs based on addressing mode:

| Mode | Example | Machine Code | Bytes | Cycles |
|------|---------|-------------|-------|--------|
| Immediate | `LDA #$41` | `A9 41` | 2 | 2 |
| Zero Page | `LDA $80` | `A5 80` | 2 | 3 |
| Absolute | `LDA $0400` | `AD 00 04` | 3 | 4 |

**Key insights**:
- Immediate is fastest (data is right there)
- Zero page is faster than absolute
- Absolute uses more memory (3 bytes vs 2)

## Practical Example: Moving Screen Data

Let's copy the first character on screen to multiple positions using different addressing modes:

```assembly
; Read first screen character (absolute addressing)
LDA $0400   ; Load from screen position 0

; Store temporarily (zero page addressing)  
STA $80     ; Fast storage in Zero Page

; Copy to multiple screen positions (absolute addressing)
STA $0401   ; Screen position 1
STA $0402   ; Screen position 2
STA $0403   ; Screen position 3

; Load it back from Zero Page (zero page addressing)
LDA $80     ; Load our saved character
STA $0404   ; Screen position 4
```

<CodeRunner 
  system="commodore-64"
  title="Practical Example: Copying Screen Data"
  code="; First put a character on screen
LDA #$48    ; Load 'H' (immediate addressing)
STA $0400   ; Store to first screen position (absolute addressing)

; Now copy it around
LDA $0400   ; Load from screen position 0 (absolute addressing)
STA $80     ; Store temporarily in Zero Page (zero page addressing)  
STA $0401   ; Copy to screen position 1 (absolute addressing)
STA $0402   ; Copy to screen position 2 (absolute addressing)

; Demonstrate loading from Zero Page
LDA $80     ; Load from Zero Page (zero page addressing)
STA $0403   ; Copy to screen position 3 (absolute addressing)"
  language="assembly"
/>

## Memory Organization Review

Understanding where different addressing modes work:

```
$0000-$00FF : Zero Page (use $80, $81, etc.)
$0100-$01FF : Stack (system use)
$0200-$03FF : Free RAM (use $0200, $0300, etc.)
$0400-$07E7 : Screen Memory (use $0400, $0401, etc.)
$0800-$9FFF : Free RAM (use absolute addressing)
$A000-$FFFF : ROM (read-only, use absolute addressing)
```

## Common Addressing Mode Mistakes

**Mistake 1**: Using immediate when you want absolute
```assembly
LDA #$0400  ; ERROR: Loads value $00 (can't fit $0400 in 8 bits)
LDA $0400   ; CORRECT: Loads from screen memory
```

**Mistake 2**: Using absolute when zero page would work
```assembly
LDA $0080   ; Slower absolute addressing
LDA $80     ; Faster zero page addressing (same location!)
```

**Mistake 3**: Forgetting the # for immediate values
```assembly
LDA $41     ; Loads from memory location $41
LDA #$41    ; Loads the value $41 ('A')
```

## Practice Exercise

Create a program that demonstrates all three addressing modes:

1. Use immediate addressing to load the letter 'M' 
2. Use zero page addressing to store it temporarily at $85
3. Use absolute addressing to display it at screen position 5
4. Use zero page addressing to load it back
5. Use absolute addressing to display it at screen position 6

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - All Three Addressing Modes"
  code="; 1. Immediate addressing - load 'M'
LDA #$4D    ; Load 'M' using immediate addressing

; 2. Zero page addressing - store temporarily  
STA $85     ; Store in Zero Page using zero page addressing

; 3. Absolute addressing - display on screen
STA $0405   ; Display at screen position 5 using absolute addressing

; 4. Zero page addressing - load back
LDA $85     ; Load from Zero Page using zero page addressing

; 5. Absolute addressing - display again
STA $0406   ; Display at screen position 6 using absolute addressing"
  language="assembly"
/>

## When to Use Each Mode

**Immediate addressing** (`#$value`):
- Loading known values (character codes, colors, etc.)
- Setting up initial conditions
- Mathematical constants

**Zero page addressing** (`$zp`):
- Variables and temporary storage
- Frequently accessed data
- When you need maximum speed

**Absolute addressing** (`$address`):
- Screen memory and I/O registers
- Data stored above $FF
- ROM routines and tables

## What You've Learned

In this lesson, you've mastered:

- The concept of addressing modes and why they exist
- Immediate addressing for literal values (#$value)
- Absolute addressing for any memory location ($address)
- Zero page addressing for fast access to first 256 bytes ($zp)
- How to choose the right addressing mode for each situation
- Performance differences between addressing modes

## Looking Ahead

In the next lesson, you'll learn about the **status register** and **flags** - special bits that tell you about the results of operations. This opens the door to making decisions in your programs!

## Fun Fact

The 6502's zero page addressing was so useful that many programmers considered it essential for writing efficient code. The Apple II's Integer BASIC interpreter stored all its variables in zero page for maximum speed. Some programmers even called zero page locations "pseudo-registers" because they were almost as fast as the real registers!