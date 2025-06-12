---
title: "Branching and Program Flow Control"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 13
description: "Master conditional branching and program flow control. Learn branch instructions, create loops, make decisions, and build dynamic programs that respond to conditions."
learning_objectives:
  - "Understand conditional branching and program flow"
  - "Master branch instructions (BEQ, BNE, BCC, BCS, etc.)"
  - "Learn to create loops and conditional logic"
  - "Practice building interactive and responsive programs"
  - "Combine branching with flags, subroutines, and memory operations"
concepts:
  - "Conditional branching"
  - "Branch instructions (BEQ, BNE, BCC, BCS, BMI, BPL)"
  - "Program flow control"
  - "Loops and iteration"
  - "Decision making in assembly"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 13
---

# Lesson 13: Branching and Program Flow Control

Welcome to dynamic programming! Until now, your programs have executed instructions in sequence. Today you'll learn **branching** - making decisions and creating loops that bring programs to life. This is where assembly programming becomes truly powerful and interactive.

## What Is Branching?

**Branching** lets your program make decisions and change its flow based on conditions:
- **Conditional execution**: "If this condition is true, do this; otherwise, do that"
- **Loops**: "Keep doing this until a condition changes"
- **Interactive programs**: "Respond differently based on input or state"

Think of branching like a choose-your-own-adventure book - the story changes based on decisions!

## How Branching Works

Branching uses the **status flags** you learned in lesson 4:
1. **An operation sets flags** (comparison, arithmetic, etc.)
2. **A branch instruction tests a flag** 
3. **If the condition is true**: Jump to a different location
4. **If the condition is false**: Continue to the next instruction

```assembly
LDA #$05        ; Load 5
CMP #$05        ; Compare with 5 (sets Zero flag)
BEQ Equal       ; Branch if Equal (Zero flag set)
; This code runs if NOT equal
JMP Done
Equal:
; This code runs if equal
Done:
```

## Branch Instructions Overview

The 6502 has eight branch instructions that test different flags:

| Instruction | Meaning | Flag Tested | Branches When |
|-------------|---------|-------------|---------------|
| **BEQ** | Branch if Equal | Zero flag | Z = 1 |
| **BNE** | Branch if Not Equal | Zero flag | Z = 0 |
| **BCC** | Branch if Carry Clear | Carry flag | C = 0 |
| **BCS** | Branch if Carry Set | Carry flag | C = 1 |
| **BMI** | Branch if Minus | Negative flag | N = 1 |
| **BPL** | Branch if Plus | Negative flag | N = 0 |
| **BVC** | Branch if Overflow Clear | Overflow flag | V = 0 |
| **BVS** | Branch if Overflow Set | Overflow flag | V = 1 |

## BEQ and BNE - Testing for Equality

**BEQ** (Branch if Equal) and **BNE** (Branch if Not Equal) are the most commonly used:

```assembly
; Test if A register equals $42
LDA #$42        ; Load 'B'
CMP #$42        ; Compare with 'B'
BEQ Match       ; Branch if they match
; Code here runs if NOT equal
JMP Done
Match:
; Code here runs if equal
LDA #$59        ; Load 'Y' (Yes)
STA $0400       ; Display "Y" for match
Done:
```

<CodeRunner 
  system="commodore-64"
  title="BEQ and BNE Examples"
  code="; Test equality
LDA #$42        ; Load 'B'
CMP #$42        ; Compare with 'B'
BEQ Match       ; Branch if equal
; Not equal case
LDA #$4E        ; 'N' for No
STA $0400       ; Display
JMP Done
Match:
; Equal case  
LDA #$59        ; 'Y' for Yes
STA $0400       ; Display
Done:"
  language="assembly"
/>

## Simple Decision Making

Create programs that respond to different values:

```assembly
; Display different messages based on value
LDA #$01        ; Load test value
CMP #$01        ; Compare with 1
BEQ ShowOne     ; Branch if it's 1
CMP #$02        ; Compare with 2
BEQ ShowTwo     ; Branch if it's 2
; Default case - not 1 or 2
LDA #$3F        ; '?' for unknown
STA $0400
JMP Done

ShowOne:
LDA #$31        ; '1'
STA $0400
JMP Done

ShowTwo:
LDA #$32        ; '2'  
STA $0400
JMP Done

Done:
```

<CodeRunner 
  system="commodore-64"
  title="Multi-Way Decision Making"
  code="; Test with different values
LDA #$02        ; Try value 2
CMP #$01        ; Is it 1?
BEQ ShowOne     
CMP #$02        ; Is it 2?
BEQ ShowTwo     
; Default case
LDA #$3F        ; '?' for unknown
STA $0400
JMP Done

ShowOne:
LDA #$31        ; '1'
STA $0400
JMP Done

ShowTwo:
LDA #$32        ; '2'  
STA $0400
; Fall through to Done

Done:"
  language="assembly"
/>

## Your First Loop

Create a simple counting loop using BNE:

```assembly
; Count from 0 to 4
LDX #$00        ; Start counter at 0
Loop:
    TXA         ; Transfer X to A
    ADC #$30    ; Convert to ASCII ('0' + number)
    STA $0400,X ; Display digit at position X
    INX         ; Increment counter
    CPX #$05    ; Compare with 5
    BNE Loop    ; Branch if Not Equal (continue loop)
; Loop ends when X = 5
```

<CodeRunner 
  system="commodore-64"
  title="Simple Counting Loop"
  code="; Count from 0 to 4 and display
LDX #$00        ; Start at 0
Loop:
    TXA         ; Copy X to A
    CLC
    ADC #$30    ; Convert to ASCII
    STA $0400,X ; Display at position X
    INX         ; Increment counter  
    CPX #$05    ; Compare with 5
    BNE Loop    ; Continue if not 5
; Displays: 01234"
  language="assembly"
/>

## Carry Flag Branching

Use BCC and BCS for arithmetic overflow detection:

```assembly
; Add two numbers and check for overflow
LDA #$FF        ; Load 255
CLC             ; Clear carry
ADC #$02        ; Add 2 (255 + 2 = 257)
BCC NoOverflow  ; Branch if Carry Clear (no overflow)

; Overflow occurred
LDA #$4F        ; 'O' for Overflow
STA $0400
JMP Done

NoOverflow:
; No overflow
LDA #$4E        ; 'N' for No overflow
STA $0400
Done:
```

<CodeRunner 
  system="commodore-64"
  title="Overflow Detection with BCC/BCS"
  code="; Test arithmetic overflow
LDA #$FF        ; 255
CLC
ADC #$02        ; Add 2 (causes overflow)
BCC NoOverflow  ; Branch if no carry

; Overflow case
LDA #$4F        ; 'O' for Overflow
STA $0400
JMP Done

NoOverflow:
LDA #$4E        ; 'N' for No overflow  
STA $0400
Done:"
  language="assembly"
/>

## Negative Flag Branching

Use BMI and BPL to test for positive/negative values:

```assembly
; Test if a value is positive or negative
LDA #$80        ; Load $80 (128, or -128 in signed)
BMI Negative    ; Branch if Minus (Negative flag set)

; Positive case
LDA #$2B        ; '+' for positive
STA $0400
JMP Done

Negative:
LDA #$2D        ; '-' for negative
STA $0400
Done:
```

<CodeRunner 
  system="commodore-64"
  title="Positive/Negative Testing"
  code="; Test sign of value
LDA #$80        ; Load $80 (negative in signed arithmetic)
BMI Negative    ; Branch if bit 7 set

; Positive case
LDA #$2B        ; '+' 
STA $0400
JMP Done

Negative:
LDA #$2D        ; '-'
STA $0400
Done:"
  language="assembly"
/>

## Building Complex Loops

Create more sophisticated loops with multiple conditions:

```assembly
; Fill screen with pattern, stop at edge
LDX #$00        ; Position counter
LDA #$2A        ; '*' character

FillLoop:
    STA $0400,X     ; Display at position X
    INX             ; Move to next position
    CPX #$28        ; Compare with 40 (screen width)
    BCC FillLoop    ; Continue if less than 40
    
; Loop ends when we reach screen edge
```

<CodeRunner 
  system="commodore-64"
  title="Screen Filling Loop"
  code="; Fill first row with stars
LDX #$00        ; Start position
LDA #$2A        ; '*' character

FillLoop:
    STA $0400,X     ; Place star at position X
    INX             ; Next position
    CPX #$0A        ; Stop at position 10 (for demo)
    BCC FillLoop    ; Continue if X < 10

; Result: **********"
  language="assembly"
/>

## Nested Loops

Combine loops for more complex patterns:

```assembly
; Nested loop: fill multiple rows
LDY #$00        ; Row counter (outer loop)

RowLoop:
    LDX #$00        ; Column counter (inner loop)
    
    ColumnLoop:
        LDA #$41        ; 'A'
        STA $0400,X     ; Display at position X
        INX             ; Next column
        CPX #$05        ; 5 columns
        BNE ColumnLoop  ; Continue inner loop
    
    INY             ; Next row
    CPY #$03        ; 3 rows
    BNE RowLoop     ; Continue outer loop
```

<CodeRunner 
  system="commodore-64"
  title="Nested Loop Example"
  code="; Simple nested loop demonstration
LDY #$00        ; Outer counter

OuterLoop:
    LDX #$00        ; Inner counter
    
    InnerLoop:
        TYA         ; Get outer counter
        CLC
        ADC #$41    ; Convert to letter (A, B, C...)
        STA $0400,X ; Display letter
        INX         ; Next position
        CPX #$03    ; 3 positions per row
        BNE InnerLoop
    
    INY         ; Next outer iteration
    CPY #$02    ; 2 iterations
    BNE OuterLoop
; Result shows pattern based on counters"
  language="assembly"
/>

## Conditional Subroutine Calls

Combine branching with subroutines for modular code:

```assembly
; Call different subroutines based on conditions
LDA #$01        ; Test value
CMP #$01        ; Is it 1?
BEQ CallSub1    ; Yes - call subroutine 1
CMP #$02        ; Is it 2?  
BEQ CallSub2    ; Yes - call subroutine 2
JMP DefaultCase ; Neither - use default

CallSub1:
JSR Subroutine1
JMP Done

CallSub2:
JSR Subroutine2
JMP Done

DefaultCase:
JSR DefaultSubroutine
JMP Done

Done:
; Continue main program
```

## Interactive Input Simulation

Create programs that respond to simulated input:

```assembly
; Simulate simple menu system
LDA #$32        ; Simulate user chose option '2'
CMP #$31        ; Option 1?
BEQ Option1
CMP #$32        ; Option 2?
BEQ Option2
CMP #$33        ; Option 3?
BEQ Option3
JMP InvalidOption

Option1:
LDA #$41        ; Display 'A' for option 1
STA $0400
JMP Done

Option2:
LDA #$42        ; Display 'B' for option 2
STA $0400
JMP Done

Option3:
LDA #$43        ; Display 'C' for option 3
STA $0400
JMP Done

InvalidOption:
LDA #$3F        ; Display '?' for invalid
STA $0400
Done:
```

<CodeRunner 
  system="commodore-64"
  title="Menu System Simulation"
  code="; Simulate menu selection
LDA #$32        ; Simulate choosing option '2'
CMP #$31        ; Option 1?
BEQ Option1
CMP #$32        ; Option 2?
BEQ Option2
CMP #$33        ; Option 3?
BEQ Option3
; Invalid option
LDA #$3F        ; '?'
STA $0400
JMP Done

Option1:
LDA #$41        ; 'A'
STA $0400
JMP Done

Option2:
LDA #$42        ; 'B'
STA $0400
JMP Done

Option3:
LDA #$43        ; 'C'
STA $0400
Done:"
  language="assembly"
/>

## Branch Range Limitations

**Important**: Branch instructions can only jump ±127 bytes from the current location!

```assembly
; If your branch target is too far:
LDA #$05
CMP #$05
BEQ VeryFarLabel    ; This might fail if VeryFarLabel is > 127 bytes away

; Solution: Use intermediate jumps
LDA #$05
CMP #$05
BNE NotEqual
JMP VeryFarLabel    ; JMP has no range limit

NotEqual:
; Continue here
```

## Practice Exercise

Create a program that:

1. Sets up a counter starting at 0
2. Creates a loop that:
   - Displays the current counter value as ASCII
   - Increments the counter  
   - Checks if counter reached 5
   - If not, continues loop
   - If yes, branches to cleanup
3. After the loop, displays "DONE" message
4. Uses proper branching and flow control

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Complete Loop with Branching"
  code="; Complete counting program with branching
LDX #$00        ; Initialize counter

CountLoop:
    ; Display current count
    TXA         ; Transfer counter to A
    CLC
    ADC #$30    ; Convert to ASCII
    STA $0400,X ; Display at position X
    
    ; Increment and test
    INX         ; Increment counter
    CPX #$05    ; Compare with 5
    BNE CountLoop ; Branch if not equal (continue)
    
    ; Loop finished - display completion message
    LDA #$44        ; 'D'
    STA $0405
    LDA #$4F        ; 'O'  
    STA $0406
    LDA #$4E        ; 'N'
    STA $0407
    LDA #$45        ; 'E'
    STA $0408

; Program complete - displays: 01234DONE"
  language="assembly"
/>

## Flow Control Best Practices

1. **Plan your logic**: Draw flowcharts before coding complex branching
2. **Use meaningful labels**: `InputLoop` instead of `Loop1`
3. **Watch branch distances**: Keep related code close together
4. **Test all paths**: Make sure every branch works correctly
5. **Avoid infinite loops**: Always have exit conditions

## What You've Learned

In this lesson, you've mastered:

- Conditional branching and program flow control
- Branch instructions for testing different flags (BEQ, BNE, BCC, BCS, BMI, BPL)
- Creating loops and iterative structures
- Decision making and conditional execution
- Combining branching with subroutines and memory operations
- Building interactive and responsive programs
- Nested loops and complex flow control patterns

## Looking Ahead

In the next lesson, you'll learn **advanced memory techniques and optimization** - putting together everything you've learned to create efficient, professional-quality assembly programs. You're now ready to build sophisticated software!

## Fun Fact

The branching instructions you've just mastered are the foundation of every `if` statement, `while` loop, and `for` loop in every programming language! When you write `if (x == 5)` in Python or JavaScript, the computer ultimately uses instructions just like `CMP #$05` followed by `BEQ`. You now understand the hardware reality behind all program control structures - the fundamental building blocks that make interactive software possible!