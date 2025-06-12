---
title: "Stack Operations and Memory Management"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 11
description: "Learn the 6502 stack - a special memory area for temporary storage, subroutine calls, and interrupt handling. Learn stack operations and memory management fundamentals."
learning_objectives:
  - "Understand the stack concept and its location in C64 memory"
  - "Learn stack instructions: PHA, PLA, PHP, and PLP"
  - "Learn about the Stack Pointer (SP) register"
  - "Practice saving and restoring register states"
  - "Understand stack's role in subroutines and interrupts"
concepts:
  - "Stack memory ($0100-$01FF)"
  - "Stack Pointer (SP) register"
  - "Push operations (PHA, PHP)"
  - "Pull operations (PLA, PLP)"
  - "LIFO (Last In, First Out) principle"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 11
---

# Lesson 11: Stack Operations and Memory Management

Welcome to one of the most important concepts in computing - the **stack**! The stack is a special memory area that enables temporary storage, subroutine calls, and sophisticated program organisation. Today you'll master stack operations and understand how they enable advanced programming.

## What Is the Stack?

The **stack** is a special area of memory that works like a stack of plates:
- **Last In, First Out (LIFO)**: The last item you put on is the first one you take off
- **Automatic management**: The processor tracks the "top" of the stack for you
- **Temporary storage**: Perfect for saving values you need to restore later

In the 6502, the stack:
- **Location**: Always at $0100-$01FF (page 1 of memory)
- **Size**: 256 bytes maximum
- **Direction**: Grows downward (from $01FF toward $0100)
- **Pointer**: Stack Pointer (SP) register tracks the current top

## The Stack Pointer (SP) Register

The **Stack Pointer** is a special 8-bit register that points to the current top of the stack:

- **Initial value**: $FF (stack starts at $01FF)
- **Decrements**: When you push something onto the stack
- **Increments**: When you pull something off the stack
- **Full address**: SP always refers to $01xx (page 1)

```text
; Stack starts at $01FF (SP = $FF)
; After one push: $01FE (SP = $FE)  
; After two pushes: $01FD (SP = $FD)
```

## Push Operations

**Push** operations store values on the stack and decrement the Stack Pointer.

### PHA - Push Accumulator

**Syntax**: `PHA`
**Effect**: Pushes A register onto stack, decrements SP

```text
LDA #$42        ; Load 'B' into A
PHA             ; Push A onto stack
                ; A is now saved on stack
                ; SP decremented by 1
```

<CodeRunner 
  system="commodore-64"
  title="Push Accumulator Example"
  code="LDA #$42        ; Load 'B' into A register
PHA             ; Push A onto stack (saves 'B')
LDA #$48        ; Load 'H' into A (overwrites previous value)
; A now contains 'H', but 'B' is safely stored on stack"
  language="assembly"
/>

### PHP - Push Processor Status

**Syntax**: `PHP`  
**Effect**: Pushes status register (flags) onto stack

```text
LDA #$80        ; Load value that sets Negative flag
PHP             ; Push status register onto stack
                ; Status flags are now saved
```

<CodeRunner 
  system="commodore-64"
  title="Push Processor Status Example"
  code="LDA #$80        ; Load $80 (sets Negative flag)
PHP             ; Push status register onto stack
LDA #$01        ; Load $01 (clears Negative flag)
; Status flags from before are saved on stack"
  language="assembly"
/>

## Pull Operations

**Pull** operations retrieve values from the stack and increment the Stack Pointer.

### PLA - Pull Accumulator

**Syntax**: `PLA`
**Effect**: Pulls value from stack into A register, increments SP

```text
PLA             ; Pull value from stack into A
                ; SP incremented by 1
                ; A now contains the pulled value
```

<CodeRunner 
  system="commodore-64"
  title="Push and Pull Accumulator"
  code="LDA #$42        ; Load 'B'
PHA             ; Push 'B' onto stack
LDA #$48        ; Load 'H' (overwrites A)
STA $0400       ; Display 'H' on screen

PLA             ; Pull 'B' back from stack into A
STA $0401       ; Display 'B' on screen"
  language="assembly"
/>

### PLP - Pull Processor Status

**Syntax**: `PLP`
**Effect**: Pulls status register from stack, restoring flags

```text
PLP             ; Pull status register from stack
                ; All flags restored to previous state
```

<CodeRunner 
  system="commodore-64"
  title="Push and Pull Processor Status"
  code="LDA #$80        ; Set Negative flag
PHP             ; Save status flags
LDA #$01        ; Clear Negative flag
PLP             ; Restore status flags (Negative flag restored)"
  language="assembly"
/>

## Stack Visualization

Here's how the stack works with multiple operations:

```
Initial state:    SP = $FF, Stack at $01FF
                  $01FF: [empty]
                  $01FE: [empty]
                  $01FD: [empty]

After PHA #$42:   SP = $FE  
                  $01FF: $42
                  $01FE: [empty] ← SP points here
                  $01FD: [empty]

After PHA #$48:   SP = $FD
                  $01FF: $42
                  $01FE: $48
                  $01FD: [empty] ← SP points here

After PLA:        SP = $FE, A = $48
                  $01FF: $42
                  $01FE: [empty] ← SP points here
                  $01FD: [empty]

After PLA:        SP = $FF, A = $42
                  $01FF: [empty] ← SP points here
                  $01FE: [empty]
                  $01FD: [empty]
```

## Saving and Restoring Register States

The stack is perfect for temporarily saving register contents:

```text
; Save all registers before complex operation
PHA             ; Save A
LDA #$48        ; Use A for something else
STA $0400       ; Do work with A

PLA             ; Restore original A value
; A is back to its original state
```

<CodeRunner 
  system="commodore-64"
  title="Register State Management"
  code="; Demonstrate saving and restoring registers
LDA #$42        ; Load 'B' into A
PHA             ; Save A on stack

; Do some work that changes A
LDA #$48        ; Load 'H' 
STA $0400       ; Display 'H'

LDA #$45        ; Load 'E'
STA $0401       ; Display 'E'

; Restore original A value
PLA             ; Pull 'B' back into A
STA $0402       ; Display 'B' - shows original value restored"
  language="assembly"
/>

## Multiple Register Preservation

Save multiple registers in sequence:

```text
; Save current state
PHA             ; Save A
PHP             ; Save status flags

; Do complex work here
LDA #$FF
AND #$0F
STA $D020       ; Change border colour

; Restore original state  
PLP             ; Restore status flags
PLA             ; Restore A
; All registers back to original state
```

<CodeRunner 
  system="commodore-64"
  title="Multiple Register Preservation"
  code="; Save multiple things
LDA #$42        ; Load 'B'
PHA             ; Save A
PHP             ; Save status flags

; Do work that changes everything
LDA #$FF        ; Load $FF
AND #$0F        ; AND with $0F (changes flags)
STA $D020       ; Change border colour

; Restore everything
PLP             ; Restore status flags  
PLA             ; Restore A register
STA $0400       ; Display restored 'B'"
  language="assembly"
/>

## Stack Overflow and Underflow

**Stack Overflow**: Pushing too many items (SP goes below $00)
**Stack Underflow**: Pulling from empty stack (SP goes above $FF)

```text
; Stack overflow example (don't do this!)
; If you push 256 items without pulling, SP wraps to $FF
; This overwrites the bottom of the stack!

; Stack underflow example (don't do this!)
; If you pull from empty stack, you get garbage data
; SP wraps to $FF and pulls from $01FF
```

**Best Practice**: Always match pushes with pulls!

## Building a Register Save/Restore System

Create a systematic approach to register management:

```text
SaveRegisters:
    PHA             ; Save A
    PHP             ; Save status
    ; X and Y can't be pushed directly
    ; We'll learn how to save them in later lessons
    RTS             ; Return (we'll learn this soon)

RestoreRegisters:
    PLP             ; Restore status  
    PLA             ; Restore A
    RTS             ; Return
```

## Practical Stack Applications

### Temporary Variable Storage

```text
; Complex calculation requiring temporary storage
LDA $80         ; Load first value
PHA             ; Save it on stack
LDA $81         ; Load second value  
PHA             ; Save it on stack

; Do calculations with different values
LDA #$10
ADC #$20        ; A = $30

; Retrieve saved values
PLA             ; Get second value
STA $82         ; Store result
PLA             ; Get first value
STA $83         ; Store result
```

<CodeRunner 
  system="commodore-64"
  title="Temporary Variable Storage"
  code="; Setup some data
LDA #$41        ; 'A'
STA $80
LDA #$42        ; 'B'  
STA $81

; Save values on stack
LDA $80         ; Load 'A'
PHA             ; Save on stack
LDA $81         ; Load 'B'
PHA             ; Save on stack

; Do other work
LDA #$48        ; Load 'H'
STA $0400       ; Display

; Retrieve saved values
PLA             ; Get 'B' back
STA $0401       ; Display 'B'
PLA             ; Get 'A' back  
STA $0402       ; Display 'A'"
  language="assembly"
/>

### Nested Operations

The stack enables nested operations where inner operations don't disturb outer ones:

```text
OuterOperation:
    PHA             ; Save A for outer operation
    
    ; Call inner operation
    LDA #$FF
    JSR InnerOperation  ; We'll learn JSR soon
    
    PLA             ; Restore A for outer operation
    ; Continue outer operation
    
InnerOperation:
    PHA             ; Save A for inner operation
    ; Do inner work
    PLA             ; Restore A for inner operation
    RTS
```

## Stack Memory Layout

The 6502 stack has specific characteristics:

```
$01FF  ← Stack starts here (SP = $FF)
$01FE  ← After first push (SP = $FE)  
$01FD  ← After second push (SP = $FD)
...
$0100  ← Stack bottom (SP = $00)
```

**Key Points**:
- Stack is always in page 1 ($0100-$01FF)
- Grows downward (toward lower addresses)
- SP is only 8 bits (always refers to page 1)
- 256 bytes maximum capacity

## Practice Exercise

Create a program that:

1. Stores your initials in A register and pushes each to stack
2. Overwrites A with different values and displays them
3. Pulls the initials back from stack and displays them in reverse order
4. Demonstrates that stack is LIFO (Last In, First Out)

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Stack LIFO Demonstration"
  code="; Push initials onto stack
LDA #$53        ; 'S' (first initial)
PHA             ; Push onto stack
LDA #$48        ; 'H' (second initial)  
PHA             ; Push onto stack
LDA #$21        ; '!' (exclamation)
PHA             ; Push onto stack

; Do other work (overwrite A)
LDA #$31        ; '1'
STA $0400       ; Display '1'
LDA #$32        ; '2'
STA $0401       ; Display '2'
LDA #$33        ; '3'  
STA $0402       ; Display '3'

; Pull from stack (LIFO order)
PLA             ; Gets '!' (last pushed, first pulled)
STA $0404       ; Display '!'
PLA             ; Gets 'H' 
STA $0405       ; Display 'H'
PLA             ; Gets 'S' (first pushed, last pulled)
STA $0406       ; Display 'S'

; Result shows: 123!HS (reverse order due to LIFO)"
  language="assembly"
/>

## Why the Stack Matters

The stack is fundamental to:

**Subroutines**: Function calls save return addresses on stack
**Interrupts**: System events preserve processor state on stack  
**Recursion**: Nested function calls each get their own stack space
**Parameter passing**: Function arguments passed via stack
**Local variables**: Temporary function storage

## What You've Learned

In this lesson, you've mastered:

- Stack concept and LIFO (Last In, First Out) principle
- Stack location in C64 memory ($0100-$01FF)
- Stack Pointer (SP) register and its operation
- Push instructions (PHA, PHP) for saving data
- Pull instructions (PLA, PLP) for restoring data
- Register state preservation techniques
- Stack applications for temporary storage and nested operations

## Looking Ahead

In the next lesson, you'll learn about **subroutines and the JSR/RTS instructions** - where the stack really shows its power! Subroutines enable modular programming and code reuse, building on everything you've learned about memory management and the stack.

## Fun Fact

The stack you've just learned is the foundation of every function call in every programming language! When you call a function in Python, Java, C++, or JavaScript, the computer uses stack operations just like the ones you've mastered. The concept of "stack overflow" (when a program runs out of stack space) comes directly from the hardware limitation you've just learned about. You now understand one of the most fundamental concepts in all of computing!