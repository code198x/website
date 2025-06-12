---
title: "Arithmetic Operations"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 5
description: "Learn addition and subtraction in 6502 assembly with ADC and SBC instructions. Learn how the carry flag enables multi-byte arithmetic and overflow detection."
learning_objectives:
  - "Learn the ADC (Add with Carry) instruction"
  - "Learn the SBC (Subtract with Carry) instruction"
  - "Understand how the carry flag works in arithmetic"
  - "Practice clearing and setting the carry flag"
  - "Perform multi-byte arithmetic operations"
concepts:
  - "ADC (Add with Carry) instruction"
  - "SBC (Subtract with Carry) instruction"
  - "Carry flag in arithmetic operations"
  - "CLC (Clear Carry) and SEC (Set Carry) instructions"
  - "Multi-byte arithmetic"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 5
---

# Lesson 5: Arithmetic Operations

Now that you understand flags, it's time to put them to work! The 6502 performs all arithmetic using just two instructions: **ADC** (Add with Carry) and **SBC** (Subtract with Carry). Today you'll master these essential operations.

## Why "With Carry"?

You might wonder why the 6502 doesn't have simple ADD and SUB instructions. The answer is brilliant: by always including the carry flag, the processor can handle numbers larger than 8 bits! This design choice makes the 6502 incredibly versatile.

**ADC** always adds three things:
1. The value in the A register
2. The value you specify
3. The current carry flag (0 or 1)

**SBC** always subtracts two things from A and adds the carry:
1. A register - the value you specify + carry flag

## The ADC Instruction

**ADC** means "Add with Carry." It adds a value to the A register, plus the carry flag.

```text
LDA #$10    ; Load 16 into A
CLC         ; Clear carry flag (make it 0)
ADC #$05    ; Add 5: A = 16 + 5 + 0 = 21 ($15)
```

<CodeRunner 
  system="commodore-64"
  title="Basic Addition with ADC"
  code="LDA #$10    ; Load 16 into A
CLC         ; Clear carry flag
ADC #$05    ; Add 5: result = 21 ($15)
STA $0400   ; Store result on screen (will show ASCII character)"
  language="assembly"
/>

**Important**: Always use `CLC` (Clear Carry) before ADC unless you specifically want to include the carry!

## The CLC Instruction

**CLC** (Clear Carry) sets the carry flag to 0. This is essential before addition when you want a clean result.

```text
CLC         ; Carry flag = 0
LDA #$20    ; Load 32
ADC #$10    ; Add 16: 32 + 16 + 0 = 48
```

## Addition Examples

Let's explore different addition scenarios:

```text
; Simple addition
LDA #$30    ; Load 48 ('0' character)
CLC         ; Clear carry
ADC #$01    ; Add 1: result = 49 ('1' character)
STA $0400   ; Display on screen

; Adding larger numbers
LDA #$64    ; Load 100
CLC         ; Clear carry  
ADC #$32    ; Add 50: result = 150
STA $80     ; Store in Zero Page
```

<CodeRunner 
  system="commodore-64"
  title="Addition Examples"
  code="; Simple addition - convert '0' to '1'
LDA #$30    ; Load 48 ('0' character)
CLC         ; Clear carry
ADC #$01    ; Add 1: result = 49 ('1' character)
STA $0400   ; Display on screen

; Adding larger numbers
LDA #$64    ; Load 100
CLC         ; Clear carry  
ADC #$32    ; Add 50: result = 150
STA $0401   ; Store result (will show as ASCII character)"
  language="assembly"
/>

## When Addition Overflows

What happens when addition exceeds 255? The result wraps around and sets the carry flag:

```text
LDA #$FF    ; Load 255
CLC         ; Clear carry
ADC #$02    ; Add 2: 255 + 2 = 257
            ; A register = $01 (257 - 256)
            ; Carry flag = SET (overflow occurred)
```

<CodeRunner 
  system="commodore-64"
  title="Addition Overflow"
  code="LDA #$FF    ; Load 255
CLC         ; Clear carry
ADC #$02    ; Add 2: 255 + 2 = 257, but A = $01, Carry = SET
STA $0400   ; Store low byte ($01) on screen"
  language="assembly"
/>

The carry flag tells you that the result was larger than 8 bits!

## The SBC Instruction

**SBC** means "Subtract with Carry." It subtracts a value from the A register. The carry flag works as a "borrow" indicator.

```text
LDA #$20    ; Load 32
SEC         ; Set carry flag (no borrow needed)
SBC #$10    ; Subtract 16: A = 32 - 16 = 16
```

<CodeRunner 
  system="commodore-64"
  title="Basic Subtraction with SBC"
  code="LDA #$20    ; Load 32
SEC         ; Set carry flag (no borrow)
SBC #$10    ; Subtract 16: result = 16
STA $0400   ; Store result on screen"
  language="assembly"
/>

**Important**: Always use `SEC` (Set Carry) before SBC unless you specifically want to include a borrow!

## The SEC Instruction

**SEC** (Set Carry) sets the carry flag to 1. For subtraction, think of this as "no borrow needed."

```text
SEC         ; Carry flag = 1 (no borrow)
LDA #$50    ; Load 80
SBC #$30    ; Subtract 48: 80 - 48 = 32
```

## Subtraction Examples

```text
; Simple subtraction
LDA #$35    ; Load 53 ('5' character)
SEC         ; Set carry (no borrow)
SBC #$01    ; Subtract 1: result = 52 ('4' character)
STA $0400   ; Display on screen

; Larger subtraction
LDA #$64    ; Load 100
SEC         ; Set carry
SBC #$32    ; Subtract 50: result = 50
STA $0401   ; Store result
```

<CodeRunner 
  system="commodore-64"
  title="Subtraction Examples"
  code="; Simple subtraction - convert '5' to '4'
LDA #$35    ; Load 53 ('5' character)
SEC         ; Set carry (no borrow)
SBC #$01    ; Subtract 1: result = 52 ('4' character)
STA $0400   ; Display on screen

; Larger subtraction
LDA #$64    ; Load 100
SEC         ; Set carry
SBC #$32    ; Subtract 50: result = 50
STA $0401   ; Store result"
  language="assembly"
/>

## When Subtraction Underflows

When you subtract a larger number from a smaller one, you get underflow:

```text
LDA #$05    ; Load 5
SEC         ; Set carry
SBC #$10    ; Subtract 16: 5 - 16 = -11
            ; A register = $F5 (256 - 11 = 245)
            ; Carry flag = CLEAR (borrow occurred)
```

<CodeRunner 
  system="commodore-64"
  title="Subtraction Underflow"
  code="LDA #$05    ; Load 5
SEC         ; Set carry
SBC #$10    ; Subtract 16: 5 - 16 = -11, but A = $F5, Carry = CLEAR
STA $0400   ; Store result ($F5) on screen"
  language="assembly"
/>

The carry flag being clear tells you that a borrow was needed (result was negative).

## Multi-Byte Addition

Here's where the carry flag shines! You can add 16-bit numbers by adding the low bytes first, then the high bytes with carry:

```text
; Add $1234 + $0567 = $179B
; Low bytes: $34 + $67
LDA #$34    ; Load low byte of first number
CLC         ; Clear carry
ADC #$67    ; Add low byte of second number
STA $80     ; Store low byte result

; High bytes: $12 + $05 + carry
LDA #$12    ; Load high byte of first number  
ADC #$05    ; Add high byte + carry from previous operation
STA $81     ; Store high byte result
```

<CodeRunner 
  system="commodore-64"
  title="16-bit Addition"
  code="; Add $1234 + $0567 (16-bit addition)
; Low bytes first
LDA #$34    ; Load $34 (low byte of $1234)
CLC         ; Clear carry
ADC #$67    ; Add $67 (low byte of $0567)
STA $80     ; Store low byte result ($9B)

; High bytes with carry
LDA #$12    ; Load $12 (high byte of $1234)
ADC #$05    ; Add $05 + carry from low byte
STA $81     ; Store high byte result ($17)
; Result: $179B stored as $81=$17, $80=$9B"
  language="assembly"
/>

## Practical Example: Simple Calculator

Let's create a simple on-screen calculator:

```text
; Display first number
LDA #$33    ; '3'
STA $0400   ; Screen position 0

; Display plus sign  
LDA #$2B    ; '+'
STA $0401   ; Screen position 1

; Display second number
LDA #$32    ; '2'  
STA $0402   ; Screen position 2

; Display equals sign
LDA #$3D    ; '='
STA $0403   ; Screen position 3

; Calculate result (3 + 2 = 5)
LDA #$03    ; Load 3 (numeric value)
CLC         ; Clear carry
ADC #$02    ; Add 2
ADC #$30    ; Convert to ASCII ('0' + result)
STA $0404   ; Display result
```

<CodeRunner 
  system="commodore-64"
  title="Simple On-Screen Calculator"
  code="; Display: 3 + 2 = 5
LDA #$33    ; '3'
STA $0400   
LDA #$2B    ; '+'
STA $0401   
LDA #$32    ; '2'  
STA $0402   
LDA #$3D    ; '='
STA $0403   

; Calculate 3 + 2
LDA #$03    ; Numeric 3
CLC         
ADC #$02    ; Add numeric 2 = 5
ADC #$30    ; Convert to ASCII: 5 + 48 = 53 ('5')
STA $0404   ; Display result"
  language="assembly"
/>

## Practice Exercise

Create a program that:

1. Displays "8-3=" on screen
2. Calculates 8 - 3 using SBC
3. Converts the result to ASCII and displays it
4. Uses Zero Page memory to store intermediate values

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Subtraction Calculator"
  code="; Display: 8 - 3 = 5
LDA #$38    ; '8'
STA $0400   
LDA #$2D    ; '-'
STA $0401   
LDA #$33    ; '3'  
STA $0402   
LDA #$3D    ; '='
STA $0403   

; Calculate 8 - 3
LDA #$08    ; Numeric 8
SEC         ; Set carry (no borrow)
SBC #$03    ; Subtract numeric 3 = 5
STA $80     ; Store in Zero Page
ADC #$30    ; Convert to ASCII: 5 + 48 = 53 ('5')
STA $0404   ; Display result"
  language="assembly"
/>

## Common Arithmetic Mistakes

**Mistake 1**: Forgetting to clear/set carry
```text
LDA #$10
ADC #$05    ; WRONG: carry might be set from previous operation
```

**Mistake 2**: Using wrong carry state for operation
```text
LDA #$10
CLC         ; WRONG for subtraction
SBC #$05    ; Should use SEC before SBC
```

**Mistake 3**: Not handling overflow/underflow
```text
LDA #$FF
CLC
ADC #$01    ; Result overflows - check carry flag!
```

## What You've Learned

In this lesson, you've mastered:

- ADC instruction for addition with carry
- SBC instruction for subtraction with carry  
- CLC instruction to clear the carry flag before addition
- SEC instruction to set the carry flag before subtraction
- How overflow and underflow affect the carry flag
- Multi-byte arithmetic using the carry flag
- Converting between numeric values and ASCII characters

## Looking Ahead

In the next lesson, you'll learn about **increment and decrement** operations (INC/DEC) and how they differ from addition and subtraction. You'll also explore more addressing modes with arithmetic!

## Fun Fact

The 6502's "always with carry" arithmetic design was so elegant that it influenced many later processors. By making the carry flag an integral part of every arithmetic operation, the 6502 could perform 16-bit, 32-bit, or even 64-bit arithmetic using simple 8-bit operations. This made it possible to write incredibly sophisticated mathematical software on what was considered a "simple" 8-bit processor!