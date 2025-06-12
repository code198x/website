---
title: "Subroutines and Function Calls"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 12
description: "Learn subroutines with JSR and RTS instructions. Learn to create reusable code modules, pass parameters, and build structured programs using the stack for function calls."
learning_objectives:
  - "Understand subroutines and modular programming concepts"
  - "Learn JSR (Jump to Subroutine) instruction"
  - "Learn RTS (Return from Subroutine) instruction"
  - "Practice parameter passing and return values"
  - "Build reusable code libraries and structured programs"
concepts:
  - "Subroutines and functions"
  - "JSR (Jump to Subroutine)"
  - "RTS (Return from Subroutine)"
  - "Return address and stack usage"
  - "Parameter passing techniques"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 12
---

# Lesson 12: Subroutines and Function Calls

Welcome to modular programming! Today you'll learn about **subroutines** - reusable blocks of code that you can call from anywhere in your program. Subroutines are the foundation of structured programming and enable you to build complex, organised software.

## What Are Subroutines?

A **subroutine** (also called a function or procedure) is a named block of code that:
- **Performs a specific task**: Like displaying a character or calculating a value
- **Can be called from anywhere**: Multiple parts of your program can use it
- **Returns to the caller**: After finishing, control returns to where it was called
- **Can be reused**: Write once, use many times

Think of subroutines like recipes in a cookbook - you can follow the same recipe from different meals!

## The JSR Instruction

**JSR** (Jump to Subroutine) calls a subroutine and automatically saves the return address.

**Syntax**: `JSR $address`
**Effect**: 
1. Pushes current Program Counter (PC) onto stack
2. Jumps to the specified address
3. Execution continues at the subroutine

```text
JSR PrintHello      ; Call the PrintHello subroutine
; When PrintHello finishes, execution continues here
```

## The RTS Instruction

**RTS** (Return from Subroutine) returns from a subroutine to the caller.

**Syntax**: `RTS`
**Effect**:
1. Pulls return address from stack
2. Sets Program Counter to return address + 1
3. Execution continues after the JSR instruction

```text
PrintHello:
    LDA #$48        ; Load 'H'
    STA $0400       ; Display on screen
    RTS             ; Return to caller
```

## Your First Subroutine

Let's create a simple subroutine that displays a character:

```text
; Main program
Main:
    JSR DisplayA    ; Call subroutine
    JSR DisplayB    ; Call another subroutine
    RTS             ; End program

; Subroutine to display 'A'
DisplayA:
    LDA #$41        ; Load 'A'
    STA $0400       ; Display at screen position 0
    RTS             ; Return to caller

; Subroutine to display 'B'  
DisplayB:
    LDA #$42        ; Load 'B'
    STA $0401       ; Display at screen position 1
    RTS             ; Return to caller
```

<CodeRunner 
  system="commodore-64"
  title="Your First Subroutines"
  code="; Main program
JSR DisplayA    ; Call first subroutine
JSR DisplayB    ; Call second subroutine
JMP EndProgram  ; Skip over subroutine definitions

; Subroutine to display 'A'
DisplayA:
    LDA #$41        ; Load 'A'
    STA $0400       ; Display at position 0
    RTS             ; Return to caller

; Subroutine to display 'B'
DisplayB:
    LDA #$42        ; Load 'B'  
    STA $0401       ; Display at position 1
    RTS             ; Return to caller

EndProgram:
    ; Program ends here"
  language="assembly"
/>

## How JSR and RTS Use the Stack

When you call a subroutine, here's what happens with the stack:

```
Before JSR:
Stack: [empty]
PC: $0800 (pointing to JSR instruction)

During JSR $0900:
1. Push return address ($0803) onto stack
2. Jump to $0900

Stack: [$0803] ← Return address saved
PC: $0900 (now executing subroutine)

During RTS:
1. Pull return address ($0803) from stack  
2. Set PC to $0803

Stack: [empty] ← Return address restored
PC: $0803 (continues after JSR)
```

## Subroutines with Parameters

Pass values to subroutines using registers:

```text
; Main program
Main:
    LDA #$48        ; Parameter: 'H'
    JSR DisplayChar ; Call with parameter
    
    LDA #$49        ; Parameter: 'I'  
    JSR DisplayChar ; Call with different parameter
    JMP EndProgram

; Subroutine: Display character in A register
; Input: A = character to display
DisplayChar:
    STA $0400       ; Display character at screen position 0
    RTS             ; Return to caller

EndProgram:
```

<CodeRunner 
  system="commodore-64"
  title="Subroutine with Parameters"
  code="; Main program - call subroutine with different parameters
LDA #$48        ; Load 'H'
JSR DisplayChar ; Display 'H'

LDA #$49        ; Load 'I'  
LDX #$01        ; Screen position 1
JSR DisplayCharAt ; Display 'I' at position 1

JMP EndProgram  ; Skip subroutines

; Subroutine: Display character at screen position 0
; Input: A = character to display
DisplayChar:
    STA $0400       ; Always display at position 0
    RTS

; Subroutine: Display character at specified position
; Input: A = character, X = screen position
DisplayCharAt:
    STA $0400,X     ; Display at position X
    RTS

EndProgram:"
  language="assembly"
/>

## Nested Subroutine Calls

Subroutines can call other subroutines! The stack handles multiple return addresses:

```text
Main:
    JSR PrintWord   ; Call main subroutine
    JMP EndProgram

PrintWord:
    JSR PrintH      ; Call first letter subroutine
    JSR PrintI      ; Call second letter subroutine
    RTS             ; Return to Main

PrintH:
    LDA #$48        ; Load 'H'
    STA $0400       ; Display
    RTS             ; Return to PrintWord

PrintI:
    LDA #$49        ; Load 'I'
    STA $0401       ; Display  
    RTS             ; Return to PrintWord

EndProgram:
```

<CodeRunner 
  system="commodore-64"
  title="Nested Subroutine Calls"
  code="; Demonstrate nested subroutine calls
JSR PrintWord   ; Call main subroutine
JMP EndProgram

PrintWord:
    JSR PrintH      ; Call first subroutine
    JSR PrintI      ; Call second subroutine
    RTS             ; Return to main

PrintH:
    LDA #$48        ; 'H'
    STA $0400       
    RTS             ; Return to PrintWord

PrintI:
    LDA #$49        ; 'I'
    STA $0401       
    RTS             ; Return to PrintWord

EndProgram:"
  language="assembly"
/>

## Preserving Registers in Subroutines

Good subroutines preserve registers they don't explicitly return:

```text
; Good subroutine - preserves A register
SafeSubroutine:
    PHA             ; Save A register
    
    ; Do work that changes A
    LDA #$FF
    STA $D020       ; Change border colour
    
    PLA             ; Restore A register
    RTS             ; Return with A unchanged

; Bad subroutine - destroys A register  
UnsafeSubroutine:
    LDA #$FF        ; Changes A register
    STA $D020       ; Change border colour
    RTS             ; Returns with A modified!
```

<CodeRunner 
  system="commodore-64"
  title="Register Preservation in Subroutines"
  code="; Demonstrate register preservation
LDA #$42        ; Load 'B' into A
JSR SafeRoutine ; Call subroutine that preserves A
STA $0400       ; Display - should still be 'B'

LDA #$43        ; Load 'C' into A  
JSR UnsafeRoutine ; Call subroutine that changes A
STA $0401       ; Display - will be different!

JMP EndProgram

SafeRoutine:
    PHA             ; Save A
    LDA #$01        ; Change A temporarily
    STA $D020       ; Use A for border colour
    PLA             ; Restore original A
    RTS

UnsafeRoutine:
    LDA #$48        ; Change A to 'H'
    STA $D020       ; Use for border  
    RTS             ; Return with A changed!

EndProgram:"
  language="assembly"
/>

## Return Values from Subroutines

Return values through registers:

```text
; Subroutine that returns a value
; Output: A = calculated result
AddTwoNumbers:
    PHA             ; Save input A
    CLC
    ADC #$05        ; Add 5 to the input
    ; A now contains the result
    RTS             ; Return with result in A

; Usage:
Main:
    LDA #$10        ; Input value
    JSR AddTwoNumbers ; Call function
    ; A now contains $15 (result)
    STA $0400       ; Display result
```

<CodeRunner 
  system="commodore-64"
  title="Subroutines with Return Values"
  code="; Function that adds 5 to input
LDA #$10        ; Input: 16
JSR AddFive     ; Call function
STA $0400       ; Display result (should be 21)

LDA #$20        ; Input: 32
JSR AddFive     ; Call again
STA $0401       ; Display result (should be 37)

JMP EndProgram

; Function: Add 5 to input value
; Input: A = number to add to
; Output: A = input + 5
AddFive:
    CLC
    ADC #$05        ; Add 5
    RTS             ; Return result in A

EndProgram:"
  language="assembly"
/>

## Building a Subroutine Library

Create reusable utility functions:

```text
; Screen utility library

; Clear screen subroutine
ClearScreen:
    PHA             ; Save A
    LDA #$93        ; Clear screen character
    STA $0400       ; Clear first position
    ; (In real implementation, would clear all 1000 positions)
    PLA             ; Restore A
    RTS

; Set border colour subroutine  
; Input: A = colour value
SetBorderColor:
    STA $D020       ; Set border colour register
    RTS

; Display character at cursor subroutine
; Input: A = character, X = position
DisplayAtPos:
    STA $0400,X     ; Display character at position X
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Subroutine Library Example"
  code="; Using a collection of utility subroutines
JSR ClearScreen     ; Clear the display

LDA #$02            ; Red colour
JSR SetBorderColor  ; Set border to red

LDA #$48            ; 'H'
LDX #$00            ; Position 0
JSR DisplayAtPos    ; Display 'H' at position 0

LDA #$49            ; 'I'  
LDX #$01            ; Position 1
JSR DisplayAtPos    ; Display 'I' at position 1

JMP EndProgram

; Utility subroutines
ClearScreen:
    PHA
    LDA #$20        ; Space character
    STA $0400       ; Clear first position  
    PLA
    RTS

SetBorderColor:
    STA $D020       ; Set border colour
    RTS

DisplayAtPos:
    STA $0400,X     ; Display at position
    RTS

EndProgram:"
  language="assembly"
/>

## Advanced Parameter Passing

For complex parameters, use memory locations:

```text
; Parameters in Zero Page
ParamChar = $80     ; Character to display
ParamX    = $81     ; X position
ParamY    = $82     ; Y position (row)

; Advanced display subroutine
DisplayCharAt:
    LDA ParamChar   ; Load character parameter
    LDY ParamY      ; Load Y position
    LDX ParamX      ; Load X position
    ; Calculate screen position: Y * 40 + X
    ; (Simplified - just use X for now)
    STA $0400,X     ; Display character
    RTS

; Usage:
Main:
    LDA #$48        ; 'H'
    STA ParamChar   ; Set character parameter
    LDA #$05        ; Position 5
    STA ParamX      ; Set X parameter
    JSR DisplayCharAt ; Call with parameters
```

## Recursive Subroutines

Subroutines can call themselves (with care!):

```text
; Countdown subroutine (simplified recursion)
Countdown:
    STA $0400       ; Display current number
    SEC
    SBC #$01        ; Subtract 1
    BNE Countdown   ; If not zero, call self again
    RTS             ; Base case: return when zero

; Usage:
Main:
    LDA #$35        ; Start with '5'
    JSR Countdown   ; Will display 5,4,3,2,1
```

## Practice Exercise

Create a program with these subroutines:

1. **InitSystem**: Sets up initial state (border colour, clear screen)
2. **DisplayMessage**: Displays "HI" at specified position  
3. **WaitABit**: Simple delay loop
4. **CleanUp**: Restores system to original state

Use proper parameter passing and register preservation.

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Complete Subroutine Program"
  code="; Main program using multiple subroutines
JSR InitSystem      ; Initialize
JSR DisplayMessage  ; Show message
JSR WaitABit       ; Pause
JSR CleanUp        ; Clean up
JMP EndProgram

; Initialize system
InitSystem:
    PHA
    LDA #$06        ; Blue border
    STA $D020
    LDA #$20        ; Clear with spaces
    STA $0400
    STA $0401
    PLA
    RTS

; Display 'HI' message
DisplayMessage:
    PHA
    LDA #$48        ; 'H'
    STA $0400
    LDA #$49        ; 'I'  
    STA $0401
    PLA
    RTS

; Simple delay
WaitABit:
    PHA
    LDA #$FF        ; Load delay value
DelayLoop:
    SEC
    SBC #$01        ; Count down
    BNE DelayLoop   ; Loop until zero
    PLA
    RTS

; Clean up system
CleanUp:
    PHA
    LDA #$0E        ; Light blue border
    STA $D020
    PLA
    RTS

EndProgram:"
  language="assembly"
/>

## Subroutine Best Practices

1. **Clear purpose**: Each subroutine should do one thing well
2. **Preserve registers**: Save and restore registers you modify
3. **Document parameters**: Make input/output requirements clear
4. **Consistent naming**: Use descriptive subroutine names
5. **Error handling**: Check for invalid parameters when possible

## What You've Learned

In this lesson, you've mastered:

- Subroutine concepts and modular programming principles
- JSR instruction for calling subroutines  
- RTS instruction for returning from subroutines
- How JSR/RTS use the stack for return addresses
- Parameter passing through registers and memory
- Register preservation in subroutines
- Nested subroutine calls and recursive functions
- Building reusable code libraries

## Looking Ahead

In the next lesson, you'll learn about **branching and program flow control** - making decisions and creating loops that bring your programs to life. Combined with subroutines, you'll be able to create sophisticated, interactive programs!

## Fun Fact

The JSR/RTS mechanism you've just learned is the foundation of every function call in every programming language! When you call a function in Python, JavaScript, C++, or any other language, the computer is using the same basic mechanism: save the return address, jump to the function, execute the code, then return to where you left off. The stack-based calling convention you've mastered is used by virtually all modern processors and programming languages!