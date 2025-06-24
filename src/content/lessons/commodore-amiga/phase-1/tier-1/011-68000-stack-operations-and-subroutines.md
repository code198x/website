---
title: "68000 Stack Operations and Subroutines"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 11
description: "Master the sophisticated stack operations and subroutine mechanisms of the 68000. Learn professional programming techniques including parameter passing, local variables, and modular code design."
learning_objectives:
  - "Understand the 68000 stack and stack pointer (A7/SP)"
  - "Learn BSR/RTS for subroutine calls and returns"
  - "Master parameter passing techniques using the stack"
  - "Implement local variables and stack frames"
  - "Create modular, reusable assembly code"
concepts:
  - "Stack pointer (A7/SP) and stack operations"
  - "BSR (Branch to Subroutine) and RTS (Return from Subroutine)"
  - "Parameter passing via stack and registers"
  - "Stack frames and local variables"
  - "Nested subroutine calls and recursion"
estimated_duration: "45-60 minutes"
difficulty: "intermediate"
code_examples: true
practical_exercise: true
order: 11
---

# Lesson 11: 68000 Stack Operations and Subroutines

The stack is one of the most powerful features of the 68000 processor, enabling sophisticated programming techniques like subroutines, parameter passing, and local variables. Today you'll learn how to write modular, professional assembly code using these advanced features.

## Understanding the 68000 Stack

The stack is a Last-In-First-Out (LIFO) data structure managed by the 68000's hardware:

- **Stack Pointer (SP)**: Address register A7 automatically points to the top of stack
- **Grows Downward**: Stack grows from high memory addresses to low addresses
- **Automatic Management**: Push/pop operations automatically adjust the stack pointer
- **Multiple Uses**: Subroutine calls, parameter passing, local variables, interrupt handling

## The Stack Pointer (A7/SP)

Address register A7 has a special role as the stack pointer:

```text
MOVE.L #$00081000, A7    ; Initialize stack at address $81000
; or equivalently:
MOVE.L #$00081000, SP    ; SP is an alias for A7
```

<CodeRunner 
  system="commodore-amiga"
  title="Stack Pointer Initialization"
  code="; Initialize the stack pointer
MOVE.L #$00081000, A7    ; Stack starts at $81000

; The stack is now ready for use
; All stack operations will use A7 automatically"
  language="assembly"
/>

## Basic Stack Operations

The 68000 provides several ways to work with the stack:

### Manual Stack Operations

```text
MOVE.W D0, -(A7)    ; Push D0 onto stack (pre-decrement)
MOVE.W (A7)+, D1    ; Pop from stack into D1 (post-increment)
```

<CodeRunner 
  system="commodore-amiga"
  title="Manual Stack Push and Pop"
  code="; Setup stack
MOVE.L #$00081000, A7

; Push values onto stack
MOVE.W #100, D0
MOVE.W D0, -(A7)    ; Push 100
MOVE.W #200, D0  
MOVE.W D0, -(A7)    ; Push 200
MOVE.W #300, D0
MOVE.W D0, -(A7)    ; Push 300

; Stack now contains: [300][200][100] (300 on top)

; Pop values from stack
MOVE.W (A7)+, D1    ; Pop 300 into D1
MOVE.W (A7)+, D2    ; Pop 200 into D2  
MOVE.W (A7)+, D3    ; Pop 100 into D3"
  language="assembly"
/>

## Subroutine Calls with BSR and RTS

The 68000 provides dedicated instructions for subroutine management:

- **BSR (Branch to Subroutine)**: Pushes return address and jumps to subroutine
- **RTS (Return from Subroutine)**: Pops return address and returns

```text
BSR SUBROUTINE_NAME    ; Call subroutine
; ... program continues here after return

SUBROUTINE_NAME:
    ; ... subroutine code ...
    RTS                ; Return to caller
```

<CodeRunner 
  system="commodore-amiga"
  title="Basic Subroutine Call"
  code="; Setup stack
MOVE.L #$00081000, A7

; Main program
MOVE.W #10, D0      ; Setup parameter
BSR MULTIPLY_BY_2   ; Call subroutine
; D0 now contains 20

MOVE.W #25, D0      ; Setup another parameter
BSR MULTIPLY_BY_2   ; Call again
; D0 now contains 50

BRA END_PROGRAM     ; Skip over subroutine

MULTIPLY_BY_2:
    LSL.W #1, D0    ; Shift left = multiply by 2
    RTS             ; Return to caller

END_PROGRAM:
    ; Program ends here"
  language="assembly"
/>

## Parameter Passing via Registers

The simplest way to pass parameters is through registers:

<CodeRunner 
  system="commodore-amiga"
  title="Parameter Passing via Registers"
  code="; Setup stack
MOVE.L #$00081000, A7

; Calculate area of rectangle (width * height)
MOVE.W #20, D0      ; Width parameter
MOVE.W #15, D1      ; Height parameter
BSR CALCULATE_AREA  ; Call subroutine
; D2 now contains the area (300)

BRA END_PROGRAM

CALCULATE_AREA:
    ; Parameters: D0 = width, D1 = height
    ; Result: D2 = area
    MOVE.W D0, D2   ; Copy width to result
    MULU.W D1, D2   ; Multiply by height
    RTS             ; Return with result in D2

END_PROGRAM:"
  language="assembly"
/>

## Parameter Passing via Stack

For complex functions, parameters can be passed on the stack:

<CodeRunner 
  system="commodore-amiga"
  title="Stack Parameter Passing"
  code="; Setup stack
MOVE.L #$00081000, A7

; Calculate volume of box (width * height * depth)
MOVE.W #10, -(A7)   ; Push depth parameter
MOVE.W #8, -(A7)    ; Push height parameter  
MOVE.W #12, -(A7)   ; Push width parameter
BSR CALCULATE_VOLUME
ADD.L #6, A7        ; Clean up stack (3 words = 6 bytes)
; Result is in D0

BRA END_PROGRAM

CALCULATE_VOLUME:
    ; Parameters on stack: [width][height][depth]
    ; Stack layout: 4(A7)=width, 6(A7)=height, 8(A7)=depth
    
    MOVE.W 4(A7), D0    ; Get width parameter
    MULU.W 6(A7), D0    ; Multiply by height
    MULU.W 8(A7), D0    ; Multiply by depth
    ; Result in D0
    RTS

END_PROGRAM:"
  language="assembly"
/>

## Local Variables Using Stack Frames

Professional subroutines often need local variables. Create a stack frame:

<CodeRunner 
  system="commodore-amiga"
  title="Stack Frame with Local Variables"
  code="; Setup stack
MOVE.L #$00081000, A7

; Call function with local variables
MOVE.W #5, D0       ; Parameter
BSR FACTORIAL       ; Calculate 5!
; Result in D0 (should be 120)

BRA END_PROGRAM

FACTORIAL:
    ; Create stack frame for local variables
    LINK A6, #-4        ; Create frame, reserve 4 bytes
    ; Local variables: -2(A6) = counter, -4(A6) = result
    
    ; Initialize local variables
    MOVE.W D0, -2(A6)   ; counter = input parameter
    MOVE.W #1, -4(A6)   ; result = 1
    
FACTORIAL_LOOP:
    ; Check if counter <= 1
    MOVE.W -2(A6), D1
    CMP.W #1, D1
    BLE FACTORIAL_DONE
    
    ; result = result * counter
    MOVE.W -4(A6), D0
    MULU.W -2(A6), D0
    MOVE.W D0, -4(A6)
    
    ; counter = counter - 1
    MOVE.W -2(A6), D1
    SUB.W #1, D1
    MOVE.W D1, -2(A6)
    
    BRA FACTORIAL_LOOP

FACTORIAL_DONE:
    MOVE.W -4(A6), D0   ; Return result in D0
    UNLK A6             ; Destroy stack frame
    RTS

END_PROGRAM:"
  language="assembly"
/>

## The LINK and UNLK Instructions

These specialized instructions manage stack frames efficiently:

```text
LINK A6, #-8    ; Create stack frame, reserve 8 bytes for locals
; ... use local variables at negative offsets from A6 ...
UNLK A6         ; Destroy stack frame and restore A6
```

The LINK instruction:
1. Pushes the old A6 value onto the stack
2. Copies A7 (stack pointer) to A6 (frame pointer)
3. Subtracts the displacement from A7 (allocates local space)

<CodeRunner 
  system="commodore-amiga"
  title="Understanding LINK and UNLK"
  code="; Setup stack
MOVE.L #$00081000, A7

BSR DEMO_FUNCTION

BRA END_PROGRAM

DEMO_FUNCTION:
    ; Before LINK: A7 = $81000, A6 = old value
    LINK A6, #-6        ; Create frame with 6 bytes local space
    ; After LINK: A6 = old A7, A7 = A6 - 6
    
    ; Local variables at negative offsets from A6:
    MOVE.W #100, -2(A6)     ; Local variable 1
    MOVE.W #200, -4(A6)     ; Local variable 2  
    MOVE.W #300, -6(A6)     ; Local variable 3
    
    ; Use local variables
    MOVE.W -2(A6), D0
    ADD.W -4(A6), D0
    ADD.W -6(A6), D0        ; D0 = 100 + 200 + 300 = 600
    
    UNLK A6         ; Restore stack and A6
    RTS

END_PROGRAM:"
  language="assembly"
/>

## Nested Subroutine Calls

The stack naturally handles nested subroutine calls:

<CodeRunner 
  system="commodore-amiga"
  title="Nested Subroutine Calls"
  code="; Setup stack
MOVE.L #$00081000, A7

; Main program calls Function A, which calls Function B
BSR FUNCTION_A

BRA END_PROGRAM

FUNCTION_A:
    MOVE.W #10, D0      ; Setup parameter for Function B
    BSR FUNCTION_B      ; Call Function B
    ADD.W #5, D0        ; Add 5 to result
    RTS                 ; Return to main

FUNCTION_B:
    MULU.W #3, D0       ; Multiply parameter by 3
    RTS                 ; Return to Function A

END_PROGRAM:
    ; Final result: (10 * 3) + 5 = 35"
  language="assembly"
/>

## Preserving Registers in Subroutines

Good subroutines preserve registers they modify:

<CodeRunner 
  system="commodore-amiga"
  title="Register Preservation"
  code="; Setup stack
MOVE.L #$00081000, A7

; Main program has important data in registers
MOVE.W #999, D1     ; Important data in D1
MOVE.W #777, D2     ; Important data in D2
MOVE.W #20, D0      ; Parameter for subroutine

BSR SAFE_MULTIPLY   ; Call subroutine

; D1 and D2 should still contain 999 and 777
BRA END_PROGRAM

SAFE_MULTIPLY:
    ; Save registers we're going to modify
    MOVE.W D1, -(A7)   ; Save D1
    MOVE.W D2, -(A7)   ; Save D2
    
    ; Use D1 and D2 for our calculations
    MOVE.W D0, D1      ; Copy parameter
    MOVE.W #5, D2      ; Multiply by 5
    MULU.W D2, D1      ; D1 = parameter * 5
    MOVE.W D1, D0      ; Return result in D0
    
    ; Restore registers (in reverse order)
    MOVE.W (A7)+, D2   ; Restore D2
    MOVE.W (A7)+, D1   ; Restore D1
    
    RTS

END_PROGRAM:"
  language="assembly"
/>

## Register Save/Restore with MOVEM

The 68000 provides MOVEM for efficient multi-register operations:

```text
MOVEM.L D0-D3/A0-A2, -(A7)    ; Save multiple registers
; ... subroutine code ...
MOVEM.L (A7)+, D0-D3/A0-A2    ; Restore multiple registers
```

<CodeRunner 
  system="commodore-amiga"
  title="Multiple Register Save/Restore"
  code="; Setup stack
MOVE.L #$00081000, A7

; Setup some register values
MOVE.L #$11111111, D0
MOVE.L #$22222222, D1  
MOVE.L #$33333333, D2
MOVE.L #$44444444, A0

BSR COMPLEX_FUNCTION

; All registers should be preserved
BRA END_PROGRAM

COMPLEX_FUNCTION:
    ; Save multiple registers at once
    MOVEM.L D0-D2/A0, -(A7)    ; Save D0, D1, D2, A0
    
    ; Use registers for complex calculations
    MOVE.L #$AAAAAAAA, D0
    MOVE.L #$BBBBBBBB, D1
    MOVE.L #$CCCCCCCC, D2
    MOVE.L #$DDDDDDDD, A0
    
    ; ... do complex work ...
    
    ; Restore all registers at once  
    MOVEM.L (A7)+, D0-D2/A0     ; Restore D0, D1, D2, A0
    
    RTS

END_PROGRAM:"
  language="assembly"
/>

## Recursive Subroutines

The stack enables recursive programming:

<CodeRunner 
  system="commodore-amiga"
  title="Recursive Fibonacci Function"
  code="; Setup stack
MOVE.L #$00081000, A7

; Calculate Fibonacci number F(6)
MOVE.W #6, D0
BSR FIBONACCI
; Result in D0 (should be 8)

BRA END_PROGRAM

FIBONACCI:
    ; Calculate Fibonacci number recursively
    ; Input: D0 = n, Output: D0 = F(n)
    
    ; Base cases: F(0)=0, F(1)=1
    CMP.W #0, D0
    BEQ FIB_RETURN      ; F(0) = 0, already in D0
    CMP.W #1, D0  
    BEQ FIB_RETURN      ; F(1) = 1, already in D0
    
    ; Recursive case: F(n) = F(n-1) + F(n-2)
    ; Save current n
    MOVE.W D0, -(A7)
    
    ; Calculate F(n-1)
    SUB.W #1, D0
    BSR FIBONACCI       ; D0 = F(n-1)
    MOVE.W D0, -(A7)    ; Save F(n-1)
    
    ; Calculate F(n-2)  
    MOVE.W 2(A7), D0    ; Get original n
    SUB.W #2, D0
    BSR FIBONACCI       ; D0 = F(n-2)
    
    ; Add F(n-1) + F(n-2)
    ADD.W (A7)+, D0     ; D0 = F(n-2) + F(n-1)
    ADD.L #2, A7        ; Clean up stack (remove original n)

FIB_RETURN:
    RTS

END_PROGRAM:"
  language="assembly"
/>

## Practice Exercise: String Length Function

Create a subroutine that calculates the length of a null-terminated string:

<CodeRunner 
  system="commodore-amiga"
  title="Practice: String Length Subroutine"
  code="; Setup stack
MOVE.L #$00081000, A7

; Test the string length function
LEA TEST_STRING(PC), A0     ; Get address of test string
BSR STRING_LENGTH           ; Call our function
; D0 now contains the length

BRA END_PROGRAM

STRING_LENGTH:
    ; Input: A0 = pointer to string
    ; Output: D0 = length of string
    ; Preserves: A0
    
    MOVE.L A0, -(A7)    ; Save A0 (preserve it)
    MOVE.W #0, D0       ; Initialize length counter
    
LENGTH_LOOP:
    MOVE.B (A0)+, D1    ; Get character, advance pointer
    BEQ LENGTH_DONE     ; If zero, end of string
    ADD.W #1, D0        ; Increment length counter
    BRA LENGTH_LOOP     ; Continue counting
    
LENGTH_DONE:
    MOVE.L (A7)+, A0    ; Restore A0
    RTS                 ; Return with length in D0

TEST_STRING:
    DC.B 'Hello Amiga World!',0

END_PROGRAM:"
  language="assembly"
/>

## Stack-Based Function Calling Convention

Professional assembly often uses calling conventions:

<CodeRunner 
  system="commodore-amiga"
  title="Professional Calling Convention Example"
  code="; Setup stack
MOVE.L #$00081000, A7

; Call function using standard convention
; Parameters: width=10, height=8, depth=6
MOVE.W #6, -(A7)    ; Push depth
MOVE.W #8, -(A7)    ; Push height  
MOVE.W #10, -(A7)   ; Push width
BSR BOX_VOLUME      ; Call function
ADD.L #6, A7        ; Clean up parameters (caller's responsibility)
; Result in D0

BRA END_PROGRAM

BOX_VOLUME:
    ; Standard function prologue
    LINK A6, #0         ; Create stack frame (no locals needed)
    
    ; Access parameters: 8(A6)=width, 10(A6)=height, 12(A6)=depth
    MOVE.W 8(A6), D0    ; Get width
    MULU.W 10(A6), D0   ; width * height
    MULU.W 12(A6), D0   ; * depth
    
    ; Standard function epilogue
    UNLK A6             ; Destroy stack frame
    RTS                 ; Return result in D0

END_PROGRAM:"
  language="assembly"
/>

## What You've Learned

In this comprehensive lesson, you've mastered:

- Stack fundamentals and the stack pointer (A7/SP)
- BSR and RTS instructions for subroutine calls
- Parameter passing through registers and stack
- Local variables using stack frames
- LINK and UNLK instructions for professional stack management
- Register preservation in subroutines
- MOVEM for efficient multi-register operations
- Recursive programming techniques
- Professional calling conventions

## Best Practices for 68000 Subroutines

1. **Always preserve registers** you modify (except return value registers)
2. **Use consistent calling conventions** throughout your program
3. **Document your subroutines** with parameter and return value descriptions
4. **Keep stack balanced** - every push should have a corresponding pop
5. **Use LINK/UNLK** for complex functions with local variables
6. **Initialize stack pointer** before using any stack operations

## Looking Ahead

In the next lesson, you'll be introduced to the revolutionary custom chips that make the Amiga special - Agnus, Denise, and Paula. You'll learn how to access their registers and begin programming the advanced graphics and sound capabilities that set the Amiga apart from all other computers of its era!

## Fun Fact

The 68000's stack and subroutine mechanisms were so well-designed that they became the foundation for modern operating systems! The Amiga's AmigaOS used these features extensively for multitasking - each running program (called a "task") had its own stack, and the operating system used subroutine calls to switch between tasks. This allowed the Amiga to run multiple programs simultaneously, something that was revolutionary for home computers in the 1980s. The sophisticated stack handling you're learning here is the same technique that powered the Amiga's legendary multitasking capabilities!