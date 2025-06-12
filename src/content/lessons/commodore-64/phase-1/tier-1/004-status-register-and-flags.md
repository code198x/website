---
title: "Status Register and Flags"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 4
description: "Discover the 6502's status register and learn how flags provide crucial information about operations. Learn the carry, zero, and negative flags."
learning_objectives:
  - "Understand what the status register is and why it exists"
  - "Learn about the most important flags: Carry, Zero, and Negative"
  - "See how operations automatically set flags"
  - "Practice reading flag states to make decisions"
  - "Learn the CMP instruction for comparisons"
concepts:
  - "Status register (P register)"
  - "Carry flag (C)"
  - "Zero flag (Z)" 
  - "Negative flag (N)"
  - "CMP instruction for comparisons"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 4
---

# Lesson 4: Status Register and Flags

The 6502 processor has a secret helper that's been working behind the scenes in all your previous programs - the **status register**. Today, you'll meet this invisible assistant and learn how it provides crucial information about your operations.

## What Is the Status Register?

The status register (also called the P register for "Processor Status") is a special 8-bit register that contains **flags** - individual bits that turn on or off based on what happens during operations.

Think of flags like dashboard warning lights in a car:
- **Zero flag**: "The result was zero"
- **Carry flag**: "The operation overflowed" 
- **Negative flag**: "The result was negative"

These flags help your program make decisions and understand what happened during the last operation.

## The Status Register Layout

The 6502 status register contains 8 flags:

```
Bit:  7  6  5  4  3  2  1  0
Flag: N  V  -  B  D  I  Z  C

N = Negative flag
V = Overflow flag  
- = Unused (always 1)
B = Break flag
D = Decimal mode flag
I = Interrupt disable flag
Z = Zero flag
C = Carry flag
```

Today we'll focus on the three most important flags: **N**, **Z**, and **C**.

## The Zero Flag (Z)

The zero flag is set (becomes 1) whenever an operation produces a result of zero.

```text
LDA #$00    ; Load zero into A register
            ; Zero flag is now SET (Z=1)

LDA #$41    ; Load 'A' into A register  
            ; Zero flag is now CLEAR (Z=0)
```

<CodeRunner 
  system="commodore-64"
  title="Zero Flag Examples"
  code="LDA #$00    ; Load zero - sets Zero flag
LDA #$41    ; Load non-zero - clears Zero flag
LDA #$00    ; Load zero again - sets Zero flag"
  language="assembly"
/>

**When the Zero flag is useful**:
- Checking if a counter reached zero
- Testing if two values are equal (after subtraction)
- Detecting empty/null values

## The Negative Flag (N)

The negative flag is set whenever bit 7 (the highest bit) of the result is 1. In two's complement arithmetic, this indicates a negative number.

```text
LDA #$7F    ; Load 127 ($7F = 01111111 binary)
            ; Negative flag is CLEAR (N=0, bit 7 = 0)

LDA #$80    ; Load 128 ($80 = 10000000 binary)  
            ; Negative flag is SET (N=1, bit 7 = 1)
```

<CodeRunner 
  system="commodore-64"
  title="Negative Flag Examples"
  code="LDA #$7F    ; Load 127 - clears Negative flag (bit 7 = 0)
LDA #$80    ; Load 128 - sets Negative flag (bit 7 = 1)
LDA #$41    ; Load 65 - clears Negative flag (bit 7 = 0)"
  language="assembly"
/>

**When the Negative flag is useful**:
- Checking if a signed number is negative
- Testing the high bit of any value
- Implementing signed comparisons

## The Carry Flag (C)

The carry flag is set when an operation produces a carry or borrow. This happens when:
- Addition produces a result > 255
- Subtraction requires borrowing
- Shift operations push a bit out

```text
LDA #$FF    ; Load 255
ADC #$01    ; Add 1: 255 + 1 = 256 (but register holds $00)
            ; Carry flag is SET (C=1) because 256 > 255
```

*Note: ADC is "Add with Carry" - we'll learn arithmetic instructions soon!*

**When the Carry flag is useful**:
- Detecting arithmetic overflow
- Multi-byte arithmetic (16-bit, 32-bit numbers)
- Implementing unsigned comparisons

## The CMP Instruction

One of the most useful instructions for working with flags is **CMP** (Compare). It subtracts a value from the A register but doesn't store the result - it only sets the flags!

```text
LDA #$50    ; Load 80 into A register
CMP #$50    ; Compare with 80
            ; Result: 80 - 80 = 0, so Zero flag SET

CMP #$30    ; Compare with 48  
            ; Result: 80 - 48 = 32, so Carry flag SET (no borrow)

CMP #$60    ; Compare with 96
            ; Result: 80 - 96 = -16, so Carry flag CLEAR (borrow needed)
```

<CodeRunner 
  system="commodore-64"
  title="CMP Instruction Examples"
  code="LDA #$50    ; Load 80 into A register

CMP #$50    ; Compare A with 80: equal (Zero flag set)
CMP #$30    ; Compare A with 48: A > value (Carry flag set)  
CMP #$60    ; Compare A with 96: A < value (Carry flag clear)"
  language="assembly"
/>

## Understanding CMP Results

After a CMP instruction, the flags tell you the relationship:

| Comparison | Zero Flag | Carry Flag | Meaning |
|------------|-----------|------------|---------|
| A = value | SET (Z=1) | SET (C=1) | A equals the value |
| A > value | CLEAR (Z=0) | SET (C=1) | A is greater than value |
| A < value | CLEAR (Z=0) | CLEAR (C=0) | A is less than value |

## Practical Example: Checking Screen Characters

Let's use CMP to check what character is at the first screen position:

```text
; Put a character on screen first
LDA #$41    ; Load 'A'
STA $0400   ; Store at screen position 0

; Now check what's there
LDA $0400   ; Load from screen position 0
CMP #$41    ; Compare with 'A'
            ; Zero flag will be SET if it matches

CMP #$42    ; Compare with 'B'  
            ; Zero flag will be CLEAR (they're different)
```

<CodeRunner 
  system="commodore-64"
  title="Checking Screen Characters"
  code="; Put 'H' on screen
LDA #$48    ; Load 'H'
STA $0400   ; Store at screen position 0

; Check what's there
LDA $0400   ; Load from screen
CMP #$48    ; Compare with 'H' - Zero flag will be SET
CMP #$41    ; Compare with 'A' - Zero flag will be CLEAR"
  language="assembly"
/>

## Other Instructions That Affect Flags

Many instructions automatically set flags based on their results:

```text
LDX #$00    ; Load X with 0 - sets Zero flag
LDY #$FF    ; Load Y with 255 - sets Negative flag
INC $80     ; Increment memory location - may set Zero/Negative flags
DEC $81     ; Decrement memory location - may set Zero/Negative flags
```

*Note: INC and DEC are increment/decrement instructions we'll learn soon!*

## Testing Your Understanding

Here's a sequence of operations. Try to predict what flags will be set:

```text
LDA #$7F    ; Load 127
CMP #$80    ; Compare with 128
; Prediction: Zero=CLEAR, Carry=CLEAR (127 < 128)

LDA #$FF    ; Load 255  
CMP #$FF    ; Compare with 255
; Prediction: Zero=SET, Carry=SET (255 = 255)

LDA #$41    ; Load 65
CMP #$30    ; Compare with 48
; Prediction: Zero=CLEAR, Carry=SET (65 > 48)
```

<CodeRunner 
  system="commodore-64"
  title="Flag Prediction Exercise"
  code="LDA #$7F    ; Load 127
CMP #$80    ; Compare with 128 - what flags are set?

LDA #$FF    ; Load 255  
CMP #$FF    ; Compare with 255 - what flags are set?

LDA #$41    ; Load 65
CMP #$30    ; Compare with 48 - what flags are set?"
  language="assembly"
/>

## Practice Exercise

Create a program that:

1. Stores the letter 'M' at screen position 0
2. Loads it back and compares it with 'M' (should set Zero flag)
3. Compares it with 'A' (should clear Zero flag) 
4. Stores different letters and tests various comparisons

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Character Comparisons"
  code="; Store 'M' on screen
LDA #$4D    ; Load 'M'
STA $0400   ; Store at screen position 0

; Load it back and test
LDA $0400   ; Load from screen
CMP #$4D    ; Compare with 'M' - Zero flag should be SET
CMP #$41    ; Compare with 'A' - Zero flag should be CLEAR

; Try with a different character
LDA #$48    ; Load 'H'
STA $0401   ; Store at screen position 1
LDA $0401   ; Load it back
CMP #$48    ; Compare with 'H' - Zero flag should be SET"
  language="assembly"
/>

## Flag Mnemonics

Here are helpful ways to remember what flags mean after CMP:

**Zero flag SET**: "They're the same!"
**Zero flag CLEAR**: "They're different!"

**Carry flag SET after CMP**: "A is greater than or equal to the compared value"
**Carry flag CLEAR after CMP**: "A is less than the compared value"

## What You've Learned

In this lesson, you've discovered:

- The status register contains flags that provide information about operations
- The Zero flag indicates when a result equals zero
- The Negative flag indicates when bit 7 is set (negative in signed arithmetic)
- The Carry flag indicates overflow or borrow conditions
- The CMP instruction compares values and sets flags without changing the A register
- How to interpret flag combinations to understand comparison results

## Looking Ahead

In the next lesson, you'll learn about **arithmetic operations** - addition and subtraction with the ADC and SBC instructions. You'll see how these operations interact with the carry flag for multi-byte arithmetic!

## Fun Fact

The 6502's flag system was so well-designed that it influenced many later processors! The idea that every operation should provide useful information through flags became a standard feature. Some programmers became so skilled at reading flags that they could write programs that made complex decisions with very few instructions - a crucial skill when memory was precious in 1982!