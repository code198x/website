---
title: "Subroutines and the Stack"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 19
description: "Learn to organize code into reusable subroutines using CALL and RET instructions. Master the stack for parameter passing and local storage."
learning_objectives:
  - "Understand subroutine concepts and benefits"
  - "Master CALL and RET instructions for code organization"
  - "Learn stack operations with PUSH and POP"
  - "Practice parameter passing and return values"
  - "Build modular, reusable code libraries"
concepts:
  - "Subroutine definition and calling"
  - "Stack operation (PUSH, POP)"
  - "Parameter passing techniques"
  - "Return value handling"
  - "Code modularity and organization"
estimated_duration: "50-60 minutes"
difficulty: "medium-advanced"
code_examples: true
practical_exercise: true
order: 19
---

# Lesson 19: Subroutines and the Stack

As your programs grow larger, you need ways to organize code into manageable, reusable pieces. Subroutines (also called functions or procedures) let you break complex tasks into smaller, focused modules. The Z80's CALL/RET instructions and stack system provide powerful tools for building modular, maintainable programs.

## Understanding Subroutines

### What is a Subroutine?

A subroutine is a self-contained piece of code that:
- Performs a specific task
- Can be called from multiple places
- Returns control to the caller when finished
- Can accept input parameters and return results

```text
; Main program
MainProgram:
    LD A, 10
    LD B, 5
    CALL AddNumbers     ; Call subroutine
    ; A now contains result (15)
    ; Continue with main program...

; Subroutine definition
AddNumbers:
    ADD A, B            ; Add B to A
    RET                 ; Return to caller
```

### Benefits of Subroutines

- **Code reuse**: Write once, use many times
- **Organization**: Break complex problems into smaller parts
- **Maintenance**: Fix bugs in one place
- **Testing**: Test individual components separately
- **Readability**: Self-documenting code structure

## CALL and RET Instructions

### The CALL Instruction

CALL pushes the current address onto the stack and jumps to the subroutine:

```text
CALL SubroutineAddress  ; Unconditional call
CALL Z, SubroutineAddr  ; Conditional calls
CALL NZ, SubroutineAddr
CALL C, SubroutineAddr
CALL NC, SubroutineAddr
```

### The RET Instruction

RET pops the return address from the stack and jumps back:

```text
RET                     ; Unconditional return
RET Z                   ; Conditional returns
RET NZ
RET C
RET NC
```

<CodeRunner 
  system="zx-spectrum"
  title="Basic Subroutine Example"
  code="; Simple subroutine demonstration
MainCode:
    LD A, 7             ; First number
    LD B, 3             ; Second number
    CALL Multiply       ; Call multiplication subroutine
    ; A now contains 21 (7 × 3)
    
    LD C, A             ; Save result
    LD A, 100           ; New first number
    LD B, 2             ; New second number  
    CALL Multiply       ; Call same subroutine again
    ; A now contains 200 (100 × 2)
    
    ; Program continues...
    HALT                ; Stop for demonstration

; Multiplication subroutine (A = A × B)
Multiply:
    PUSH BC             ; Save original B (we'll modify it)
    LD C, A             ; Save original A
    LD A, 0             ; Result starts at 0
    
MultiplyLoop:
    ADD A, C            ; Add original A to result
    DJNZ MultiplyLoop   ; Repeat B times
    
    POP BC              ; Restore original B
    RET                 ; Return with result in A

; This subroutine can be called from anywhere
; and will multiply A by B, returning result in A"
  language="assembly"
/>

## The Stack System

### What is the Stack?

The stack is a Last-In-First-Out (LIFO) memory area used for:
- Storing return addresses (automatic with CALL/RET)
- Temporary storage with PUSH/POP
- Parameter passing
- Local variables

### Stack Operations

```text
PUSH BC             ; Push BC register pair onto stack
PUSH AF             ; Push AF register pair onto stack
POP HL              ; Pop from stack into HL
POP DE              ; Pop from stack into DE
```

**Important**: Stack operations work with register pairs only (AF, BC, DE, HL)

### Stack Pointer (SP)

The Stack Pointer (SP) tracks the top of the stack:
- Decrements when pushing (stack grows downward)
- Increments when popping (stack shrinks upward)
- Must be initialized before using subroutines

```text
LD SP, $8000        ; Initialize stack pointer
```

<CodeRunner 
  system="zx-spectrum"
  title="Stack Operations Demo"
  code="; Demonstrate PUSH and POP operations
LD SP, $8000        ; Initialize stack pointer

; Store some values in registers
LD BC, $1234
LD DE, $5678
LD HL, $9ABC

; Save registers on stack
PUSH BC             ; Stack now contains: $1234
PUSH DE             ; Stack now contains: $5678, $1234
PUSH HL             ; Stack now contains: $9ABC, $5678, $1234

; Modify registers
LD BC, $0000
LD DE, $0000
LD HL, $0000        ; All registers now zero

; Restore registers from stack (reverse order!)
POP AF              ; AF gets $9ABC (last pushed)
POP BC              ; BC gets $5678 (middle)  
POP DE              ; DE gets $1234 (first pushed)

; Note: We used different registers for POP to show flexibility
; AF = $9ABC, BC = $5678, DE = $1234
; Original HL value is now in AF!

; Practical example: Save all registers
SaveAllRegisters:
    PUSH AF
    PUSH BC
    PUSH DE
    PUSH HL
    ; Do some work that modifies registers
    LD A, 99
    LD BC, $FFFF
    ; Restore all registers
    POP HL
    POP DE
    POP BC
    POP AF
    RET             ; All registers restored to original values"
  language="assembly"
/>

## Parameter Passing Techniques

### Method 1: Register Parameters

The simplest approach - pass parameters in registers:

```text
; Calculate area of rectangle
; Input: A = width, B = height
; Output: HL = area
CalculateArea:
    PUSH BC             ; Save B (we'll modify it)
    LD C, A             ; Save width in C
    LD HL, 0            ; Initialize result
    
AreaLoop:
    ADD HL, BC          ; Add width to result
    DJNZ AreaLoop       ; Repeat height times
    
    POP BC              ; Restore B
    RET                 ; Return with area in HL

; Usage:
MainProgram:
    LD A, 12            ; Width = 12
    LD B, 8             ; Height = 8
    CALL CalculateArea  ; HL = 96
```

### Method 2: Stack Parameters

For more complex parameter passing:

```text
; Calculate (A + B) × C
; Parameters pushed onto stack before call
; Stack layout: [C][B][A][return address]
ComplexCalculation:
    ; Save current position  
    PUSH HL
    LD HL, 2            ; Skip return address
    ADD HL, SP          ; Point to parameters
    
    ; Get parameters from stack
    LD A, (HL)          ; Get first parameter (A)
    INC HL : INC HL
    LD B, (HL)          ; Get second parameter (B)
    INC HL : INC HL  
    LD C, (HL)          ; Get third parameter (C)
    
    ; Calculate (A + B) × C
    ADD A, B            ; A = A + B
    LD B, C             ; B = C
    CALL Multiply       ; A = A × B
    
    POP HL              ; Restore HL
    RET

; Usage (parameters in reverse order):
    LD HL, 5            ; Push C
    PUSH HL
    LD HL, 3            ; Push B
    PUSH HL
    LD HL, 7            ; Push A
    PUSH HL
    CALL ComplexCalculation
    ; Clean up stack
    POP HL : POP HL : POP HL
```

### Method 3: Memory Parameters

Using a dedicated parameter area:

```text
; Parameter block in memory
ParamBlock:
    DW 0                ; Parameter 1
    DW 0                ; Parameter 2
    DW 0                ; Result

; Subroutine that uses parameter block
ProcessData:
    LD HL, (ParamBlock)     ; Get parameter 1
    LD DE, (ParamBlock+2)   ; Get parameter 2
    ADD HL, DE              ; Add them
    LD (ParamBlock+4), HL   ; Store result
    RET

; Usage:
    LD HL, 100
    LD (ParamBlock), HL     ; Set parameter 1
    LD HL, 50
    LD (ParamBlock+2), HL   ; Set parameter 2
    CALL ProcessData
    LD HL, (ParamBlock+4)   ; Get result (150)
```

<CodeRunner 
  system="zx-spectrum"
  title="Parameter Passing Methods"
  code="; Demonstrate different parameter passing methods

; Method 1: Register parameters
; String length calculator (counts until zero terminator)
; Input: HL = pointer to string
; Output: A = string length
StringLength:
    PUSH BC             ; Save registers we'll use
    PUSH HL
    LD B, 0             ; Character counter
    
LengthLoop:
    LD A, (HL)          ; Get character
    OR A                ; Check if zero (end of string)
    JR Z, LengthDone    ; Exit if end found
    INC B               ; Count character
    INC HL              ; Next character
    JR LengthLoop       ; Continue
    
LengthDone:
    LD A, B             ; Return length in A
    POP HL              ; Restore registers
    POP BC
    RET

; Method 2: Multiple return values using stack
; Divide A by B, return quotient and remainder
; Input: A = dividend, B = divisor
; Output: A = quotient, B = remainder
DivideWithRemainder:
    PUSH HL             ; Save HL
    LD H, 0             ; Quotient counter
    LD L, A             ; Dividend copy
    
DivideLoop:
    CP B                ; Compare dividend with divisor
    JR C, DivideDone    ; Exit if dividend < divisor
    SUB B               ; Subtract divisor
    INC H               ; Increment quotient
    JR DivideLoop       ; Continue
    
DivideDone:
    LD B, A             ; Remainder in B
    LD A, H             ; Quotient in A
    POP HL              ; Restore HL
    RET

; Method 3: Using index register for parameters
; Process array element by element
; Input: IX = array address, B = array size
ProcessArray:
    PUSH BC             ; Save counter
    
ProcessLoop:
    LD A, (IX)          ; Get array element
    ; Process element (example: multiply by 2)
    SLA A               ; Shift left = multiply by 2
    LD (IX), A          ; Store back
    INC IX              ; Next element
    DJNZ ProcessLoop    ; Continue for all elements
    
    POP BC              ; Restore counter
    RET

; Usage examples:
TestSubroutines:
    ; Test string length
    LD HL, TestString   ; Point to string
    CALL StringLength   ; A = length
    LD C, A             ; Save length
    
    ; Test division
    LD A, 17            ; Dividend
    LD B, 5             ; Divisor
    CALL DivideWithRemainder ; A=3 (quotient), B=2 (remainder)
    
    ; Test array processing
    LD IX, TestArray    ; Point to array
    LD B, 5             ; Array size
    CALL ProcessArray   ; Process array elements
    RET

TestString:
    DB 'HELLO', 0       ; Test string with terminator

TestArray:
    DB 1, 2, 3, 4, 5    ; Test array"
  language="assembly"
/>

## Building Code Libraries

### Modular Code Organization

```text
; Math library
MathLib:
    ; Addition subroutine
    JP Add16Bit         ; Jump table for easy access
    JP Subtract16Bit
    JP Multiply8Bit
    JP Divide8Bit

Add16Bit:
    ; Add DE to HL, result in HL
    ADD HL, DE
    RET

Subtract16Bit:
    ; Subtract DE from HL, result in HL
    OR A                ; Clear carry
    SBC HL, DE
    RET

Multiply8Bit:
    ; Multiply A by B, result in HL
    LD HL, 0
    LD C, A
MultLoop:
    ADD HL, BC
    DJNZ MultLoop
    RET

Divide8Bit:
    ; Divide A by B, quotient in A, remainder in C
    LD C, 0             ; Quotient
DivLoop:
    CP B
    JR C, DivDone
    SUB B
    INC C
    JR DivLoop
DivDone:
    LD B, A             ; Remainder
    LD A, C             ; Quotient
    RET
```

### Graphics Library

```text
; Screen graphics library
GraphicsLib:
    JP ClearScreen
    JP DrawPixel
    JP DrawLine
    JP DrawRectangle

ClearScreen:
    LD HL, $4000        ; Screen memory
    LD DE, $4001
    LD BC, 6143         ; Screen size - 1
    LD (HL), 0          ; Clear first byte
    LDIR                ; Clear rest
    RET

DrawPixel:
    ; Input: B = X (0-255), C = Y (0-191)
    ; Calculate screen address and set pixel
    PUSH BC
    CALL CalcScreenAddr ; Calculate address in HL
    POP BC
    ; Set appropriate bit based on X position
    LD A, B
    AND 7               ; Get bit position (0-7)
    LD B, A
    LD A, %10000000     ; Start with leftmost bit
    JR Z, PixelReady
ShiftPixel:
    RRA                 ; Shift right
    DJNZ ShiftPixel
PixelReady:
    OR (HL)             ; Combine with existing pixels
    LD (HL), A          ; Store result
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Code Library Example"
  code="; Simple utility library with multiple subroutines

; Library jump table (for easy access)
UtilityLib:
    JP CopyBytes        ; Offset 0
    JP FillBytes        ; Offset 3  
    JP CompareBytes     ; Offset 6
    JP FindByte         ; Offset 9

; Copy BC bytes from HL to DE
CopyBytes:
    PUSH BC             ; Save count
    PUSH HL             ; Save pointers  
    PUSH DE
    
    LD A, B             ; Check if count is zero
    OR C
    JR Z, CopyDone      ; Exit if nothing to copy
    
    LDIR                ; Copy bytes efficiently
    
CopyDone:
    POP DE              ; Restore pointers
    POP HL
    POP BC
    RET

; Fill BC bytes at HL with value A
FillBytes:
    PUSH BC
    PUSH HL
    PUSH DE
    
    LD E, A             ; Save fill value
    LD A, B             ; Check if count is zero
    OR C
    JR Z, FillDone
    
    LD (HL), E          ; Fill first byte
    LD D, H             ; DE = HL + 1
    LD E, L
    INC DE
    DEC BC              ; One less byte to fill
    LD A, B
    OR C
    JR Z, FillDone      ; Exit if only one byte
    
    LDIR                ; Fill rest efficiently
    
FillDone:
    POP DE
    POP HL
    POP BC
    RET

; Compare BC bytes at HL with bytes at DE
; Returns: Z flag set if equal, clear if different
CompareBytes:
    PUSH BC
    PUSH HL
    PUSH DE
    
CompareLoop:
    LD A, B             ; Check if done
    OR C
    JR Z, CompareDone   ; Z flag set = equal
    
    LD A, (DE)          ; Get byte from second array
    CP (HL)             ; Compare with first array
    JR NZ, CompareDone  ; Exit if different (Z flag clear)
    
    INC HL              ; Next bytes
    INC DE
    DEC BC              ; Count down
    JR CompareLoop
    
CompareDone:
    POP DE
    POP HL  
    POP BC
    RET

; Find byte A in BC bytes starting at HL
; Returns: HL = address of byte (if found), Z flag = found/not found
FindByte:
    PUSH BC
    PUSH DE
    LD D, A             ; Save search byte
    
FindLoop:
    LD A, B             ; Check if done
    OR C
    JR Z, NotFound      ; Exit if not found
    
    LD A, (HL)          ; Get current byte
    CP D                ; Compare with search byte
    JR Z, FoundByte     ; Exit if found
    
    INC HL              ; Next byte
    DEC BC              ; Count down
    JR FindLoop
    
NotFound:
    OR 1                ; Clear Z flag (not found)
    JR FindDone
    
FoundByte:
    XOR A               ; Set Z flag (found)
    
FindDone:
    POP DE
    POP BC
    RET

; Usage examples:
TestLibrary:
    ; Test copy function
    LD HL, SourceData
    LD DE, DestData
    LD BC, 5
    CALL CopyBytes      ; Copy 5 bytes
    
    ; Test fill function
    LD HL, BufferData
    LD A, $AA           ; Fill pattern
    LD BC, 10
    CALL FillBytes      ; Fill 10 bytes with $AA
    
    ; Test find function
    LD HL, SourceData
    LD A, $33           ; Search for $33
    LD BC, 5
    CALL FindByte       ; Search in 5 bytes
    RET

SourceData:
    DB $11, $22, $33, $44, $55

DestData:
    DS 5                ; Space for copied data

BufferData:
    DS 10               ; Buffer for fill test"
  language="assembly"
/>

## Advanced Stack Techniques

### Nested Subroutine Calls

```text
; Subroutines can call other subroutines
CalculateExpression:
    ; Calculate (A + B) × (C + D)
    PUSH DE             ; Save C and D
    CALL AddAB          ; A = A + B
    LD E, A             ; Save first result
    POP BC              ; Get C and D back (D in B, C in C)
    LD A, C
    LD B, D
    CALL AddAB          ; A = C + D
    LD B, A             ; Second operand
    LD A, E             ; First operand
    CALL MultiplyAB     ; A = result
    RET

AddAB:
    ADD A, B
    RET

MultiplyAB:
    ; Multiply A by B
    LD C, A
    LD A, 0
MultLoop:
    ADD A, C
    DJNZ MultLoop
    RET
```

### Stack Frame Management

```text
; Advanced parameter passing with stack frames
CreateStackFrame:
    PUSH BC             ; Save old frame pointer
    LD BC, SP           ; New frame pointer
    ; Allocate local variables
    LD HL, -6           ; Reserve 6 bytes
    ADD HL, SP
    LD SP, HL
    ; Now: [locals][old BC][return addr][parameters]
    RET

DestroyStackFrame:
    LD SP, BC           ; Restore stack pointer
    POP BC              ; Restore old frame pointer
    RET
```

## Error Handling in Subroutines

### Return Status Codes

```text
; Division with error checking
; Input: A = dividend, B = divisor
; Output: A = result, Carry flag = error status
SafeDivide:
    LD C, 0             ; Quotient counter
    
    ; Check for division by zero
    LD A, B
    OR A
    JR Z, DivideError   ; Return error if B = 0
    
    ; Perform division
    LD A, (dividend)    ; Get dividend back
DivLoop:
    CP B
    JR C, DivDone
    SUB B
    INC C
    JR DivLoop
    
DivDone:
    LD A, C             ; Return quotient
    OR A                ; Clear carry (success)
    RET
    
DivideError:
    SCF                 ; Set carry flag (error)
    RET
```

### Exception Handling

```text
; Protected memory access
; Input: HL = address to read
; Output: A = value, Carry = error status
SafeRead:
    ; Check if address is in valid range
    LD A, H
    CP $40              ; Below screen memory?
    JR C, ReadError
    CP $60              ; Above safe area?
    JR NC, ReadError
    
    ; Safe to read
    LD A, (HL)
    OR A                ; Clear carry (success)
    RET
    
ReadError:
    LD A, 0             ; Return zero
    SCF                 ; Set carry (error)
    RET
```

## Practice Exercise

Create a comprehensive subroutine library that demonstrates:

1. Multiple parameter passing methods
2. Nested subroutine calls
3. Error handling and return codes
4. Code organization and modularity
5. Stack management techniques

<CodeRunner 
  system="zx-spectrum"
  title="Practice Exercise - Complete Subroutine System"
  code="; Comprehensive subroutine library demonstration

; Main program that uses the library
MainProgram:
    LD SP, $8000        ; Initialize stack
    
    ; Test 1: String processing
    LD HL, TestString
    CALL StringLength   ; Get string length
    LD B, A             ; Save length
    
    ; Test 2: Array processing  
    LD HL, TestArray
    LD C, 5             ; Array size
    CALL ArraySum       ; Sum array elements
    LD D, A             ; Save sum
    
    ; Test 3: Error handling
    LD A, 10
    LD B, 0             ; Division by zero!
    CALL SafeDivision   ; Should return error
    JR C, DivisionError ; Handle error
    
    ; Test 4: Nested calls
    LD A, 3
    LD B, 4
    LD C, 2
    CALL ComplexMath    ; Calculate A × B + C
    LD E, A             ; Save result
    
    HALT                ; End demonstration

DivisionError:
    LD A, 255           ; Error indicator
    LD E, A
    HALT

; Library Subroutines:

; 1. String length calculator
; Input: HL = string pointer
; Output: A = length
StringLength:
    PUSH BC
    PUSH HL
    LD B, 0             ; Counter
    
StrLenLoop:
    LD A, (HL)          ; Get character
    OR A                ; Check for zero terminator
    JR Z, StrLenDone
    INC B               ; Count character
    INC HL              ; Next character
    JR StrLenLoop
    
StrLenDone:
    LD A, B             ; Return length
    POP HL
    POP BC
    RET

; 2. Array sum calculator
; Input: HL = array pointer, C = size
; Output: A = sum (truncated to 8-bit)
ArraySum:
    PUSH BC
    PUSH HL
    LD A, 0             ; Initialize sum
    LD B, C             ; Loop counter
    
SumLoop:
    ADD A, (HL)         ; Add array element
    INC HL              ; Next element
    DJNZ SumLoop        ; Continue for all elements
    
    POP HL
    POP BC
    RET

; 3. Safe division with error checking
; Input: A = dividend, B = divisor
; Output: A = quotient, Carry = error flag
SafeDivision:
    PUSH BC
    
    ; Check for division by zero
    LD C, B             ; Save divisor
    OR A                ; Clear carry
    LD B, 0             ; Quotient counter
    
    LD A, C             ; Check divisor
    OR A
    JR Z, DivError      ; Error if zero
    
    ; Restore dividend and perform division
    POP BC
    PUSH BC
    
DivideLoop:
    CP C                ; Compare dividend with divisor
    JR C, DivSuccess    ; Done if dividend < divisor
    SUB C               ; Subtract divisor
    INC B               ; Increment quotient
    JR DivideLoop
    
DivSuccess:
    LD A, B             ; Return quotient
    OR A                ; Clear carry (success)
    POP BC
    RET
    
DivError:
    SCF                 ; Set carry (error)
    LD A, 0             ; Return zero
    POP BC
    RET

; 4. Complex math with nested calls
; Calculate A × B + C using multiplication subroutine
; Input: A, B, C values
; Output: A = result
ComplexMath:
    PUSH BC             ; Save C
    CALL Multiply       ; A = A × B
    POP BC              ; Restore C
    ADD A, C            ; A = A + C
    RET

; 5. 8-bit multiplication subroutine
; Input: A, B values
; Output: A = A × B (8-bit result)
Multiply:
    PUSH BC
    LD C, A             ; Save multiplier
    LD A, 0             ; Initialize result
    
    ; Check for zero
    LD A, B
    OR A
    JR Z, MultDone      ; Return 0 if B is 0
    
    LD A, 0             ; Reset result
    
MultLoop:
    ADD A, C            ; Add multiplier to result
    DJNZ MultLoop       ; Repeat B times
    
MultDone:
    POP BC
    RET

; Test data
TestString:
    DB 'HELLO WORLD', 0

TestArray:
    DB 10, 20, 30, 40, 50

; This library demonstrates:
; - Register parameter passing
; - Error handling with carry flag
; - Nested subroutine calls
; - Stack management
; - Modular code organization
; - Return value handling"
  language="assembly"
/>

## Subroutine Best Practices

### Design Principles

1. **Single Responsibility**: Each subroutine should do one thing well
2. **Clear Interface**: Document inputs, outputs, and side effects
3. **Preserve Registers**: Save and restore registers the caller expects
4. **Handle Errors**: Return status codes for error conditions
5. **Consistent Naming**: Use descriptive names for subroutines

### Performance Considerations

1. **Minimize Stack Usage**: Excessive PUSH/POP operations slow down code
2. **Avoid Deep Nesting**: Too many nested calls can overflow the stack
3. **Consider Inlining**: Very small subroutines might be faster if inlined
4. **Use Jump Tables**: For subroutines called based on calculated values

## What You've Learned

In this comprehensive lesson, you've mastered:

- Understanding subroutine concepts and their benefits for code organization
- Using CALL and RET instructions for modular programming
- Stack operations with PUSH and POP for temporary storage
- Multiple parameter passing techniques for flexible subroutine interfaces
- Building reusable code libraries with consistent interfaces
- Error handling and return value management in subroutines
- Advanced stack techniques and best practices for maintainable code

## Looking Ahead

Next, you'll learn about **program flow control structures** - combining your knowledge of conditionals, loops, and subroutines to create sophisticated control flow patterns like state machines and event handlers!

## Fun Fact

The concept of subroutines was revolutionary when it was first introduced in early computers. Before subroutines, programmers had to manually copy code wherever they needed it, leading to massive, unmaintainable programs. The Z80's stack-based CALL/RET system was particularly elegant because it handled the return address automatically, making recursive subroutines possible. This same basic mechanism - pushing return addresses onto a stack - is used in virtually every processor and programming language today. The subroutine patterns you've learned are the foundation of all modern programming, from simple functions to complex object-oriented methods. Every time you write a function in any programming language, you're using concepts that trace directly back to the assembly language techniques you've just mastered!