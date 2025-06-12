---
title: "Increment and Decrement Operations"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 6
description: "Learn the INC and DEC instructions for efficient counting and memory manipulation. Learn register increments with INX, INY, DEX, and DEY."
learning_objectives:
  - "Learn INC and DEC instructions for memory locations"
  - "Learn INX, INY, DEX, DEY for register operations"
  - "Understand when to use increment/decrement vs addition/subtraction"
  - "Practice building counters and loops"
  - "Create animated screen effects"
concepts:
  - "INC (Increment Memory) instruction"
  - "DEC (Decrement Memory) instruction"
  - "INX, INY (Increment X/Y registers)"
  - "DEX, DEY (Decrement X/Y registers)"
  - "Counters and animation basics"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 6
---

# Lesson 6: Increment and Decrement Operations

Sometimes you just need to add or subtract 1. The 6502 provides special instructions that are faster and more convenient than using ADC and SBC for these common operations. Today you'll master the increment and decrement instructions!

## Why Special Instructions for +1 and -1?

Counting by ones is so common in programming that the 6502 designers included dedicated instructions:

- **Faster execution**: INC/DEC take fewer cycles than ADC/SBC
- **Simpler code**: No need to worry about carry flags
- **More readable**: `INC $80` is clearer than `LDA $80; CLC; ADC #$01; STA $80`
- **Memory efficient**: Work directly on memory locations

## Memory Increment: INC

The **INC** instruction increments (adds 1 to) a memory location:

```text
LDA #$05    ; Load 5
STA $80     ; Store in Zero Page location $80
INC $80     ; Increment $80: now contains 6
```

<CodeRunner 
  system="commodore-64"
  title="Basic Memory Increment"
  code="LDA #$05    ; Load 5
STA $80     ; Store in Zero Page
INC $80     ; Increment: $80 now contains 6
LDA $80     ; Load the result
STA $0400   ; Display on screen (ASCII character 6)"
  language="assembly"
/>

**Important**: INC works directly on memory - it doesn't use the A register!

## Memory Decrement: DEC

The **DEC** instruction decrements (subtracts 1 from) a memory location:

```text
LDA #$05    ; Load 5
STA $80     ; Store in Zero Page location $80
DEC $80     ; Decrement $80: now contains 4
```

<CodeRunner 
  system="commodore-64"
  title="Basic Memory Decrement"
  code="LDA #$05    ; Load 5
STA $80     ; Store in Zero Page
DEC $80     ; Decrement: $80 now contains 4
LDA $80     ; Load the result
STA $0400   ; Display on screen (ASCII character 4)"
  language="assembly"
/>

## Register Increment: INX and INY

For registers, use dedicated increment instructions:

- **INX**: Increment X register
- **INY**: Increment Y register

```text
LDX #$10    ; Load 16 into X
INX         ; Increment X: now contains 17
INX         ; Increment X again: now contains 18

LDY #$20    ; Load 32 into Y  
INY         ; Increment Y: now contains 33
```

<CodeRunner 
  system="commodore-64"
  title="Register Increment"
  code="LDX #$10    ; Load 16 into X
INX         ; X = 17
INX         ; X = 18
STX $0400   ; Display X on screen

LDY #$20    ; Load 32 into Y  
INY         ; Y = 33
STY $0401   ; Display Y on screen"
  language="assembly"
/>

## Register Decrement: DEX and DEY

Similarly, for register decrements:

- **DEX**: Decrement X register
- **DEY**: Decrement Y register

```text
LDX #$10    ; Load 16 into X
DEX         ; Decrement X: now contains 15
DEX         ; Decrement X again: now contains 14

LDY #$20    ; Load 32 into Y
DEY         ; Decrement Y: now contains 31
```

<CodeRunner 
  system="commodore-64"
  title="Register Decrement"
  code="LDX #$10    ; Load 16 into X
DEX         ; X = 15
DEX         ; X = 14
STX $0400   ; Display X on screen

LDY #$20    ; Load 32 into Y
DEY         ; Y = 31
STY $0401   ; Display Y on screen"
  language="assembly"
/>

## Flags and Overflow Behavior

INC and DEC instructions affect the Zero and Negative flags, but **not** the Carry flag:

```text
LDA #$FF    ; Load 255
STA $80     ; Store in memory
INC $80     ; Increment: $80 = $00, Zero flag SET

LDA #$00    ; Load 0
STA $81     ; Store in memory
DEC $81     ; Decrement: $81 = $FF, Negative flag SET
```

<CodeRunner 
  system="commodore-64"
  title="Increment/Decrement Overflow"
  code="; Test increment overflow
LDA #$FF    ; Load 255
STA $80     
INC $80     ; Increment: wraps to $00, Zero flag set
LDA $80     ; Load result ($00)
STA $0400   ; Display (will show null character)

; Test decrement underflow  
LDA #$00    ; Load 0
STA $81     
DEC $81     ; Decrement: wraps to $FF
LDA $81     ; Load result ($FF)
STA $0401   ; Display (will show character 255)"
  language="assembly"
/>

## Building a Counter

Let's create a simple counter that increments a value and displays it:

```text
; Initialize counter
LDA #$30    ; Load '0' (ASCII 48)
STA $80     ; Store counter in Zero Page
STA $0400   ; Display initial value

; Increment counter 5 times
INC $80     ; Counter = '1'
LDA $80     ; Load it
STA $0401   ; Display

INC $80     ; Counter = '2'  
LDA $80     ; Load it
STA $0402   ; Display

INC $80     ; Counter = '3'
LDA $80     ; Load it
STA $0403   ; Display
```

<CodeRunner 
  system="commodore-64"
  title="Building a Counter"
  code="; Initialize counter at '0'
LDA #$30    ; ASCII '0'
STA $80     ; Store in Zero Page
STA $0400   ; Display

; Count up: 0, 1, 2, 3, 4
INC $80     ; '1'
LDA $80
STA $0401   

INC $80     ; '2'
LDA $80
STA $0402   

INC $80     ; '3'
LDA $80
STA $0403   

INC $80     ; '4'
LDA $80
STA $0404"
  language="assembly"
/>

## Screen Position Counter

Here's a practical example - filling screen positions with incrementing characters:

```text
; Start with 'A' and count up
LDA #$41    ; Load 'A'
STA $80     ; Store in counter

; Fill first 5 screen positions
LDA $80     ; Load 'A'
STA $0400   ; Screen position 0
INC $80     ; Increment to 'B'

LDA $80     ; Load 'B'  
STA $0401   ; Screen position 1
INC $80     ; Increment to 'C'

LDA $80     ; Load 'C'
STA $0402   ; Screen position 2
INC $80     ; Increment to 'D'
```

<CodeRunner 
  system="commodore-64"
  title="Alphabet Counter"
  code="; Display alphabet: A B C D E
LDA #$41    ; Start with 'A'
STA $80     ; Counter in Zero Page

; Display A-E across screen
LDA $80     ; 'A'
STA $0400   
INC $80     

LDA $80     ; 'B'
STA $0401   
INC $80     

LDA $80     ; 'C'
STA $0402   
INC $80     

LDA $80     ; 'D'
STA $0403   
INC $80     

LDA $80     ; 'E'
STA $0404"
  language="assembly"
/>

## Using X and Y as Counters

Registers X and Y are perfect for counting operations:

```text
; Use X register as screen position counter
LDX #$00    ; Start at screen position 0
LDA #$2A    ; Load '*' character

; Place stars across screen using X as offset
STA $0400,X ; Store at $0400 + X
INX         ; Move to next position
STA $0400,X ; Store at $0401
INX         ; Move to next position  
STA $0400,X ; Store at $0402
```

*Note: The `,X` syntax is indexed addressing - we'll learn this in detail later!*

<CodeRunner 
  system="commodore-64"
  title="Using X Register as Counter"
  code="; Place stars using X as position counter
LDX #$00    ; Start at position 0
LDA #$2A    ; Load '*' character

; Note: This uses indexed addressing (coming in later lessons)
STA $0400   ; Position 0
INX         
STA $0401   ; Position 1  
INX         
STA $0402   ; Position 2
INX
STA $0403   ; Position 3"
  language="assembly"
/>

## Comparing INC/DEC vs ADC/SBC

Here's when to use each approach:

| Operation | Use INC/DEC | Use ADC/SBC |
|-----------|-------------|-------------|
| Add/subtract 1 | ✓ Faster, simpler | ✗ Slower, complex |
| Add/subtract other values | ✗ Can't do | ✓ Required |
| Need carry flag | ✗ Doesn't affect carry | ✓ Uses carry |
| Work on memory directly | ✓ Yes | ✗ Need load/store |

## Creative Exercise: Simple Animation

Let's create a simple animation by changing a character on screen:

```text
; Animation: cycle through characters
LDA #$41    ; Start with 'A'
STA $0400   ; Display at top-left

; Animate by incrementing the character
INC $0400   ; Changes 'A' to 'B' directly on screen!
INC $0400   ; Changes 'B' to 'C'
INC $0400   ; Changes 'C' to 'D'
INC $0400   ; Changes 'D' to 'E'
```

<CodeRunner 
  system="commodore-64"
  title="Simple Character Animation"
  code="; Animate character at screen position 0
LDA #$41    ; Start with 'A'
STA $0400   ; Display

; Directly increment the screen memory!
INC $0400   ; A -> B
INC $0400   ; B -> C  
INC $0400   ; C -> D
INC $0400   ; D -> E
INC $0400   ; E -> F"
  language="assembly"
/>

This technique of incrementing screen memory directly creates instant animation!

## Practice Exercise

Create a program that:

1. Uses a Zero Page counter starting at 0
2. Displays a countdown from '9' to '0' across the screen
3. Uses DEC to count down
4. Shows the pattern: 9 8 7 6 5 4 3 2 1 0

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Countdown"
  code="; Countdown from 9 to 0
LDA #$39    ; Start with '9' (ASCII 57)
STA $80     ; Store in Zero Page counter

; Display countdown: 9 8 7 6 5 4 3 2 1 0
LDA $80     ; '9'
STA $0400   
DEC $80     

LDA $80     ; '8'
STA $0401   
DEC $80     

LDA $80     ; '7'
STA $0402   
DEC $80     

LDA $80     ; '6'
STA $0403   
DEC $80     

LDA $80     ; '5'
STA $0404   
DEC $80

LDA $80     ; '4'
STA $0405   
DEC $80

LDA $80     ; '3'
STA $0406   
DEC $80

LDA $80     ; '2'
STA $0407   
DEC $80

LDA $80     ; '1'
STA $0408   
DEC $80

LDA $80     ; '0'
STA $0409"
  language="assembly"
/>

## Summary of Increment/Decrement Instructions

| Instruction | Purpose | Affects Flags |
|-------------|---------|---------------|
| `INC $addr` | Increment memory location | N, Z |
| `DEC $addr` | Decrement memory location | N, Z |
| `INX` | Increment X register | N, Z |
| `INY` | Increment Y register | N, Z |
| `DEX` | Decrement X register | N, Z |
| `DEY` | Decrement Y register | N, Z |

**Note**: None of these affect the Carry flag!

## What You've Learned

In this lesson, you've mastered:

- INC and DEC instructions for memory locations
- INX, INY, DEX, DEY for register operations
- When to use increment/decrement vs addition/subtraction
- Building counters and simple animations
- Flag behavior with increment/decrement operations
- Direct manipulation of screen memory for effects

## Looking Ahead

In the next lesson, you'll learn about **logical operations** - AND, OR, and XOR instructions that work on individual bits. These operations are essential for graphics programming and hardware control!

## Fun Fact

The 6502's increment and decrement instructions were inspired by the need for efficient loop counters. In 1975, memory was so expensive that saving even a few bytes per loop could make the difference between a program fitting in memory or not! The designers realized that counting by ones was so common that it deserved special, optimised instructions - a decision that made countless programs faster and smaller.