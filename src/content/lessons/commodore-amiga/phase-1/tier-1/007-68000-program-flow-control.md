---
title: "68000 Program Flow Control"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 7
description: "Master 68000 program flow control with sophisticated branching, looping, and subroutine mechanisms. Learn how elegant control structures make complex programs manageable."
learning_objectives:
  - "Learn conditional branching with comprehensive Bcc instructions"
  - "Master loop structures using DBRA and other techniques"
  - "Understand subroutine calls with JSR/BSR and RTS"
  - "Practice jump tables and computed branches"
  - "Build structured programs using advanced flow control"
concepts:
  - "Conditional branches: Bcc family (BEQ, BNE, BLT, BGT, etc.)"
  - "Loop control: DBRA, FOR loops, WHILE loops"
  - "Subroutines: JSR/BSR (call), RTS (return), parameter passing"
  - "Unconditional jumps: JMP and computed jumps"
  - "Advanced patterns: jump tables, state machines, nested calls"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 7
---

# Lesson 7: 68000 Program Flow Control

The 68000's program flow control capabilities are far more sophisticated than 8-bit processors, offering elegant solutions for conditional execution, loops, and structured programming. Today you'll learn how these powerful features enable you to write complex, maintainable programs on the Amiga!

## Conditional Branching

The 68000 provides a comprehensive set of conditional branch instructions based on condition codes:

### Bcc Instruction Family
All conditional branches use the format `Bcc label` where `cc` represents the condition:

#### Equality Conditions
- **BEQ**: Branch if Equal (Z=1)
- **BNE**: Branch if Not Equal (Z=0)

#### Signed Comparisons
- **BLT**: Branch if Less Than (N⊕V=1)
- **BLE**: Branch if Less or Equal ((Z+(N⊕V))=1)
- **BGT**: Branch if Greater Than ((Z+(N⊕V))=0)
- **BGE**: Branch if Greater or Equal (N⊕V=0)

#### Unsigned Comparisons
- **BCC/BHS**: Branch if Carry Clear/Higher or Same (C=0)
- **BCS/BLO**: Branch if Carry Set/Lower (C=1)
- **BHI**: Branch if Higher ((C+Z)=0)
- **BLS**: Branch if Lower or Same ((C+Z)=1)

<CodeRunner 
  system="commodore-amiga"
  title="Conditional Branching Fundamentals"
  code="; Demonstration of 68000 conditional branching
; Shows comprehensive condition testing and program flow

ConditionalBranchingDemo:
    ; === BASIC EQUALITY TESTING ===
    ; Test for equality and inequality
    
    MOVE.L  #42, D0             ; Load test value
    CMP.L   #42, D0             ; Compare with same value
    BEQ     ValuesEqual         ; Branch if equal
    BNE     ValuesNotEqual      ; Branch if not equal (won't execute)
    
ValuesEqual:
    MOVE.B  #'E', EqualityTest  ; Mark as Equal
    BRA     SignedComparison    ; Continue to next test
    
ValuesNotEqual:
    MOVE.B  #'N', EqualityTest  ; Mark as Not Equal
    
SignedComparison:
    ; === SIGNED COMPARISONS ===
    ; Compare signed integers
    
    MOVE.L  #-10, D1            ; Negative value
    MOVE.L  #5, D2              ; Positive value
    CMP.L   D2, D1              ; Compare D1 with D2 (-10 vs 5)
    
    BLT     FirstLess           ; Branch if D1 < D2
    BGE     FirstGreaterEqual   ; Branch if D1 >= D2
    
FirstLess:
    MOVE.B  #'L', SignedTest    ; Mark as Less
    BRA     UnsignedComparison
    
FirstGreaterEqual:
    MOVE.B  #'G', SignedTest    ; Mark as Greater/Equal
    
UnsignedComparison:
    ; === UNSIGNED COMPARISONS ===
    ; Compare unsigned values (important for addresses/sizes)
    
    MOVE.L  #$FFFFFFF0, D3      ; Large unsigned value
    MOVE.L  #$00000010, D4      ; Small unsigned value
    CMP.L   D4, D3              ; Compare unsigned values
    
    BHI     FirstHigher         ; Branch if D3 > D4 (unsigned)
    BLS     FirstLowerSame      ; Branch if D3 <= D4 (unsigned)
    
FirstHigher:
    MOVE.B  #'H', UnsignedTest  ; Mark as Higher
    BRA     RangeChecking
    
FirstLowerSame:
    MOVE.B  #'L', UnsignedTest  ; Mark as Lower/Same
    
RangeChecking:
    ; === RANGE CHECKING ===
    ; Check if value falls within specified range
    
    MOVE.L  #75, D5             ; Test value
    
    ; Check if D5 is between 50 and 100 (inclusive)
    CMP.L   #50, D5             ; Compare with lower bound
    BLT     OutOfRange          ; Branch if below range
    CMP.L   #100, D5            ; Compare with upper bound
    BGT     OutOfRange          ; Branch if above range
    
    ; Value is in range
    MOVE.B  #'I', RangeTest     ; Mark as In range
    BRA     MultipleConditions
    
OutOfRange:
    MOVE.B  #'O', RangeTest     ; Mark as Out of range
    
MultipleConditions:
    ; === MULTIPLE CONDITION TESTING ===
    ; Complex logic using multiple conditions
    
    MOVE.L  #25, D6             ; Test value
    
    ; Check if value is positive AND even
    TST.L   D6                  ; Test if positive
    BMI     NotPositiveEven     ; Branch if negative
    
    BTST    #0, D6              ; Test bit 0 (odd/even)
    BNE     NotPositiveEven     ; Branch if odd (bit 0 set)
    
    ; Value is positive and even
    MOVE.B  #'Y', MultiCondTest ; Mark as Yes
    BRA     NestedConditions
    
NotPositiveEven:
    MOVE.B  #'N', MultiCondTest ; Mark as No
    
NestedConditions:
    ; === NESTED CONDITIONAL STRUCTURES ===
    ; Demonstrate nested if-then-else logic
    
    MOVE.L  #InputValue, A0     ; Address of input value
    MOVE.L  (A0), D7            ; Load input value
    
    ; Nested classification: negative/zero/positive, then even/odd
    TST.L   D7                  ; Test sign
    BMI     NegativeValue       ; Branch if negative
    BEQ     ZeroValue           ; Branch if zero
    
    ; Positive value
    BTST    #0, D7              ; Test if even
    BNE     PositiveOdd         ; Branch if odd
    
PositiveEven:
    MOVE.B  #'P', NestedResult1 ; Positive
    MOVE.B  #'E', NestedResult2 ; Even
    BRA     ConditionalChaining
    
PositiveOdd:
    MOVE.B  #'P', NestedResult1 ; Positive
    MOVE.B  #'O', NestedResult2 ; Odd
    BRA     ConditionalChaining
    
NegativeValue:
    MOVE.B  #'N', NestedResult1 ; Negative
    BTST    #0, D7              ; Test if even (even negative numbers)
    BNE     NegativeOdd         ; Branch if odd
    
NegativeEven:
    MOVE.B  #'E', NestedResult2 ; Even
    BRA     ConditionalChaining
    
NegativeOdd:
    MOVE.B  #'O', NestedResult2 ; Odd
    BRA     ConditionalChaining
    
ZeroValue:
    MOVE.B  #'Z', NestedResult1 ; Zero
    MOVE.B  #'E', NestedResult2 ; Even (zero is even)
    
ConditionalChaining:
    ; === CONDITIONAL CHAINING ===
    ; Chain multiple tests efficiently
    
    MOVE.L  #TestValue2, A1     ; Second test value
    MOVE.L  (A1), D0            ; Load test value
    
    ; Classify value: 0-25, 26-50, 51-75, 76-100, >100
    CMP.L   #25, D0             ; Compare with 25
    BLE     Range1              ; Branch if <= 25
    CMP.L   #50, D0             ; Compare with 50
    BLE     Range2              ; Branch if <= 50
    CMP.L   #75, D0             ; Compare with 75
    BLE     Range3              ; Branch if <= 75
    CMP.L   #100, D0            ; Compare with 100
    BLE     Range4              ; Branch if <= 100
    
    ; Value > 100
    MOVE.B  #'5', RangeClass    ; Range 5
    BRA     BranchingEnd
    
Range1:
    MOVE.B  #'1', RangeClass    ; Range 1 (0-25)
    BRA     BranchingEnd
    
Range2:
    MOVE.B  #'2', RangeClass    ; Range 2 (26-50)
    BRA     BranchingEnd
    
Range3:
    MOVE.B  #'3', RangeClass    ; Range 3 (51-75)
    BRA     BranchingEnd
    
Range4:
    MOVE.B  #'4', RangeClass    ; Range 4 (76-100)
    
BranchingEnd:
    RTS

; Test data
InputValue:         DC.L    -15
TestValue2:         DC.L    67

; Result storage
EqualityTest:       DC.B    0
SignedTest:         DC.B    0
UnsignedTest:       DC.B    0
RangeTest:          DC.B    0
MultiCondTest:      DC.B    0
NestedResult1:      DC.B    0
NestedResult2:      DC.B    0
RangeClass:         DC.B    0"
  language="assembly"
/>

## Loop Structures

The 68000 provides powerful loop control mechanisms that make iterative programming elegant:

### DBRA Instruction
- **Decrement and Branch if Not -1**: Most common loop instruction
- **Format**: `DBRA Dn, label`
- **Operation**: Decrements Dn, branches if result ≠ -1
- **Range**: 0 to 65535 iterations per loop

### Loop Patterns
- **Counted loops**: Use DBRA for fixed iterations
- **Conditional loops**: Use conditional branches with counters
- **Nested loops**: Multiple DBRA instructions for multi-dimensional iteration

<CodeRunner 
  system="commodore-amiga"
  title="Loop Structures and Control"
  code="; Demonstration of 68000 loop structures
; Shows various looping patterns and techniques

LoopStructuresDemo:
    ; === BASIC DBRA LOOP ===
    ; Simple counted loop using DBRA
    
    MOVE.L  #LoopData, A0       ; Data array address
    MOVE.L  #9, D7              ; Loop counter (10 iterations: 0-9)
    
BasicLoop:
    MOVE.B  D7, (A0)+           ; Store counter value and advance pointer
    DBRA    D7, BasicLoop       ; Decrement and branch if not -1
    
    ; === ARRAY PROCESSING LOOP ===
    ; Process array elements using DBRA
    
    MOVE.L  #ProcessArray, A1   ; Array to process
    MOVE.L  #ARRAY_SIZE-1, D6   ; Array size - 1 for DBRA
    
ArrayProcessLoop:
    MOVE.B  (A1), D0            ; Load array element
    ADD.B   #10, D0             ; Add 10 to element
    MOVE.B  D0, (A1)+           ; Store back and advance
    DBRA    D6, ArrayProcessLoop ; Continue for all elements
    
    ; === NESTED LOOPS ===
    ; Two-dimensional array processing
    
    MOVE.L  #Matrix2D, A2       ; 2D matrix address
    MOVE.L  #MATRIX_ROWS-1, D5  ; Outer loop counter (rows)
    
OuterLoop:
    MOVE.L  #MATRIX_COLS-1, D4  ; Inner loop counter (columns)
    
InnerLoop:
    MOVE.B  (A2), D0            ; Load matrix element
    NOT.B   D0                  ; Invert bits
    MOVE.B  D0, (A2)+           ; Store back and advance
    DBRA    D4, InnerLoop       ; Continue for all columns
    
    DBRA    D5, OuterLoop       ; Continue for all rows
    
    ; === WHILE LOOP EQUIVALENT ===
    ; Loop while condition is true
    
    MOVE.L  #WhileData, A3      ; Data pointer
    
WhileLoop:
    MOVE.B  (A3), D0            ; Load current byte
    BEQ     WhileLoopEnd        ; Exit if zero (end condition)
    
    ; Process the byte
    LSL.B   #1, D0              ; Shift left (multiply by 2)
    MOVE.B  D0, (A3)+           ; Store back and advance
    BRA     WhileLoop           ; Continue loop
    
WhileLoopEnd:
    
    ; === DO-WHILE LOOP EQUIVALENT ===
    ; Execute at least once, then check condition
    
    MOVE.L  #DoWhileData, A4    ; Data pointer
    MOVE.L  #0, D3              ; Accumulator
    
DoWhileLoop:
    MOVE.B  (A4)+, D0           ; Load byte and advance
    ADD.L   D0, D3              ; Add to accumulator
    TST.B   D0                  ; Test if zero
    BNE     DoWhileLoop         ; Continue if not zero
    
    MOVE.L  D3, DoWhileSum      ; Store final sum
    
    ; === FOR LOOP EQUIVALENT ===
    ; Classic for(i=start; i<end; i++) pattern
    
    MOVE.L  #10, D0             ; Start value
    MOVE.L  #50, D1             ; End value
    MOVE.L  #5, D2              ; Step value
    MOVE.L  #0, D3              ; Sum accumulator
    
ForLoop:
    CMP.L   D1, D0              ; Compare current with end
    BGE     ForLoopEnd          ; Exit if current >= end
    
    ; Loop body
    ADD.L   D0, D3              ; Add current to sum
    ADD.L   D2, D0              ; Increment by step
    BRA     ForLoop             ; Continue loop
    
ForLoopEnd:
    MOVE.L  D3, ForLoopSum      ; Store result
    
    ; === REVERSE ITERATION ===
    ; Loop backwards through array
    
    MOVE.L  #ReverseArray, A5   ; Array base
    MOVE.L  #REVERSE_SIZE-1, D7 ; Start from last element
    LEA     0(A5,D7.L), A5      ; Point to last element
    
ReverseLoop:
    MOVE.B  (A5), D0            ; Load element
    ADD.B   #1, D0              ; Increment
    MOVE.B  D0, (A5)            ; Store back
    SUBQ.L  #1, A5              ; Move to previous element
    DBRA    D7, ReverseLoop     ; Continue backwards
    
    ; === EARLY LOOP EXIT ===
    ; Loop with break condition
    
    MOVE.L  #SearchArray, A6    ; Array to search
    MOVE.L  #SEARCH_SIZE-1, D7  ; Array size
    MOVE.L  #SEARCH_VALUE, D6   ; Value to find
    MOVE.L  #-1, D5             ; Index (-1 = not found)
    
SearchLoop:
    CMP.B   (A6)+, D6           ; Compare with search value
    BEQ     FoundValue          ; Branch if found
    ADDQ.L  #1, D5              ; Increment index
    DBRA    D7, SearchLoop      ; Continue searching
    
    ; Not found
    MOVE.L  #-1, D5             ; Set not found indicator
    BRA     SearchEnd
    
FoundValue:
    ; Found at current index
    ADDQ.L  #1, D5              ; Adjust index (A6 was incremented)
    
SearchEnd:
    MOVE.L  D5, SearchIndex     ; Store found index
    
    ; === LOOP WITH SKIP CONDITIONS ===
    ; Process only certain elements (continue equivalent)
    
    MOVE.L  #FilterArray, A0    ; Array to filter
    MOVE.L  #FILTER_SIZE-1, D7  ; Array size
    MOVE.L  #0, D4              ; Count of processed elements
    
FilterLoop:
    MOVE.B  (A0), D0            ; Load element
    
    ; Skip if element is zero
    TST.B   D0                  ; Test element
    BEQ     SkipElement         ; Skip if zero
    
    ; Skip if element is negative
    BMI     SkipElement         ; Skip if negative
    
    ; Process element (positive, non-zero)
    LSL.B   #1, D0              ; Double the value
    MOVE.B  D0, (A0)            ; Store back
    ADDQ.L  #1, D4              ; Increment processed count
    
SkipElement:
    ADDQ.L  #1, A0              ; Move to next element
    DBRA    D7, FilterLoop      ; Continue for all elements
    
    MOVE.L  D4, ProcessedCount  ; Store count of processed elements
    
    ; === COMPLEX NESTED STRUCTURE ===
    ; Nested loops with complex logic
    
    MOVE.L  #ComplexMatrix, A0  ; Matrix base address
    MOVE.L  #COMPLEX_ROWS-1, D7 ; Outer loop counter
    MOVE.L  #0, D3              ; Total sum
    
ComplexOuterLoop:
    MOVE.L  #COMPLEX_COLS-1, D6 ; Inner loop counter
    MOVE.L  #0, D2              ; Row sum
    
ComplexInnerLoop:
    MOVE.B  (A0), D0            ; Load matrix element
    
    ; Only process even values
    BTST    #0, D0              ; Test if odd
    BNE     SkipComplexElement  ; Skip if odd
    
    ; Process even element
    LSR.B   #1, D0              ; Divide by 2
    ADD.L   D0, D2              ; Add to row sum
    
SkipComplexElement:
    ADDQ.L  #1, A0              ; Move to next element
    DBRA    D6, ComplexInnerLoop ; Continue inner loop
    
    ; Check if row sum exceeds threshold
    CMP.L   #ROW_THRESHOLD, D2  ; Compare with threshold
    BLT     SkipRowSum          ; Skip if below threshold
    
    ADD.L   D2, D3              ; Add row sum to total
    
SkipRowSum:
    DBRA    D7, ComplexOuterLoop ; Continue outer loop
    
    MOVE.L  D3, ComplexResult   ; Store final result
    
    RTS

; Constants
ARRAY_SIZE          EQU     10
MATRIX_ROWS         EQU     4
MATRIX_COLS         EQU     4
REVERSE_SIZE        EQU     8
SEARCH_SIZE         EQU     6
SEARCH_VALUE        EQU     $42
FILTER_SIZE         EQU     8
COMPLEX_ROWS        EQU     3
COMPLEX_COLS        EQU     3
ROW_THRESHOLD       EQU     20

; Data arrays
LoopData:           DS.B    10
ProcessArray:       DC.B    1,2,3,4,5,6,7,8,9,10
Matrix2D:           DC.B    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16
WhileData:          DC.B    2,4,6,8,0  ; Zero terminates
DoWhileData:        DC.B    10,20,30,40,0
ReverseArray:       DC.B    1,2,3,4,5,6,7,8
SearchArray:        DC.B    10,20,30,$42,50,60
FilterArray:        DC.B    -5,0,3,8,-2,12,0,7
ComplexMatrix:      DC.B    2,4,6,8,10,12,14,16,18

; Results storage
DoWhileSum:         DC.L    0
ForLoopSum:         DC.L    0
SearchIndex:        DC.L    0
ProcessedCount:     DC.L    0
ComplexResult:      DC.L    0"
  language="assembly"
/>

## Subroutines and Function Calls

The 68000 provides sophisticated subroutine mechanisms for structured programming:

### Subroutine Instructions
- **JSR**: Jump to Subroutine (pushes return address to stack)
- **BSR**: Branch to Subroutine (relative addressing)
- **RTS**: Return from Subroutine (pops return address from stack)

### Parameter Passing Methods
- **Registers**: Fast, limited number of parameters
- **Stack**: Unlimited parameters, follows calling conventions
- **Memory**: Global variables or parameter blocks

<CodeRunner 
  system="commodore-amiga"
  title="Subroutines and Function Calls"
  code="; Demonstration of 68000 subroutine mechanisms
; Shows various parameter passing and function call patterns

SubroutineDemo:
    ; === SIMPLE SUBROUTINE CALLS ===
    ; Basic subroutine calling with register parameters
    
    ; Call subroutine with register parameters
    MOVE.L  #100, D0            ; First parameter
    MOVE.L  #200, D1            ; Second parameter
    JSR     AddNumbers          ; Call subroutine
    MOVE.L  D0, AddResult       ; Store result
    
    ; Call subroutine with address parameter
    MOVE.L  #StringData, A0     ; String address parameter
    JSR     StringLength        ; Call string length function
    MOVE.L  D0, StringLen       ; Store length result
    
    ; === STACK-BASED PARAMETER PASSING ===
    ; Pass parameters on stack (C-style calling convention)
    
    ; Push parameters in reverse order
    MOVE.L  #75, -(A7)          ; Push second parameter
    MOVE.L  #25, -(A7)          ; Push first parameter
    JSR     SubtractNumbers     ; Call function
    ADDQ.L  #8, A7              ; Clean up stack (2 longs = 8 bytes)
    MOVE.L  D0, SubResult       ; Store result
    
    ; === COMPLEX PARAMETER PASSING ===
    ; Pass structure as parameter
    
    MOVE.L  #PlayerData, A0     ; Player structure address
    JSR     UpdatePlayer        ; Update player position
    
    ; === NESTED SUBROUTINE CALLS ===
    ; Subroutines calling other subroutines
    
    MOVE.L  #ArrayData, A0      ; Array address
    MOVE.L  #ARRAY_COUNT, D0    ; Array size
    JSR     ProcessArray        ; Process array (calls other subroutines)
    
    ; === RECURSIVE FUNCTION EXAMPLE ===
    ; Calculate factorial recursively
    
    MOVE.L  #5, D0              ; Calculate 5!
    JSR     Factorial           ; Call recursive function
    MOVE.L  D0, FactorialResult ; Store result
    
    ; === FUNCTION POINTER EXAMPLE ===
    ; Call function through pointer
    
    MOVE.L  #SquareFunction, A0 ; Function pointer
    MOVE.L  #12, D0             ; Parameter
    JSR     (A0)                ; Call through pointer
    MOVE.L  D0, SquareResult    ; Store result
    
    RTS

; === SUBROUTINE IMPLEMENTATIONS ===

AddNumbers:
    ; Add two numbers passed in D0 and D1
    ; Input: D0 = first number, D1 = second number
    ; Output: D0 = sum
    ADD.L   D1, D0              ; Add numbers
    RTS                         ; Return result in D0

StringLength:
    ; Calculate length of null-terminated string
    ; Input: A0 = string address
    ; Output: D0 = string length
    MOVE.L  A0, A1              ; Save start address
    MOVEQ   #0, D0              ; Initialize length counter
    
StringLenLoop:
    TST.B   (A0)+               ; Test character and advance
    BEQ     StringLenDone       ; Branch if null terminator
    ADDQ.L  #1, D0              ; Increment length
    BRA     StringLenLoop       ; Continue
    
StringLenDone:
    RTS                         ; Return length in D0

SubtractNumbers:
    ; Subtract numbers using stack parameters
    ; Stack layout: [return address][param1][param2]
    MOVE.L  4(A7), D0           ; Load first parameter
    SUB.L   8(A7), D0           ; Subtract second parameter
    RTS                         ; Return result in D0

UpdatePlayer:
    ; Update player position and state
    ; Input: A0 = player structure address
    ; Modifies player structure directly
    
    ; Update X position
    MOVE.W  PLAYER_VEL_X(A0), D0 ; Load X velocity
    ADD.W   D0, PLAYER_X(A0)    ; Add to X position
    
    ; Check X boundaries
    MOVE.W  PLAYER_X(A0), D0    ; Load new X position
    BPL     CheckRightBound     ; Branch if positive
    CLR.W   PLAYER_X(A0)        ; Clamp to left edge
    BRA     UpdateYPosition
    
CheckRightBound:
    CMP.W   #SCREEN_WIDTH, D0   ; Compare with screen width
    BLT     UpdateYPosition     ; Branch if within bounds
    MOVE.W  #SCREEN_WIDTH-1, PLAYER_X(A0) ; Clamp to right edge
    
UpdateYPosition:
    ; Update Y position
    MOVE.W  PLAYER_VEL_Y(A0), D0 ; Load Y velocity
    ADD.W   D0, PLAYER_Y(A0)    ; Add to Y position
    
    ; Check Y boundaries
    MOVE.W  PLAYER_Y(A0), D0    ; Load new Y position
    BPL     CheckBottomBound    ; Branch if positive
    CLR.W   PLAYER_Y(A0)        ; Clamp to top edge
    BRA     UpdatePlayerDone
    
CheckBottomBound:
    CMP.W   #SCREEN_HEIGHT, D0  ; Compare with screen height
    BLT     UpdatePlayerDone    ; Branch if within bounds
    MOVE.W  #SCREEN_HEIGHT-1, PLAYER_Y(A0) ; Clamp to bottom edge
    
UpdatePlayerDone:
    RTS

ProcessArray:
    ; Process array by calling helper functions
    ; Input: A0 = array address, D0 = array size
    MOVEM.L D0-D2/A0, -(A7)     ; Save registers
    
    MOVE.L  D0, D2              ; Save array size
    SUBQ.L  #1, D2              ; Adjust for DBRA
    
ProcessLoop:
    MOVE.B  (A0), D0            ; Load array element
    JSR     ValidateElement     ; Validate element
    TST.L   D0                  ; Check validation result
    BEQ     SkipElement         ; Skip if invalid
    
    MOVE.B  (A0), D0            ; Reload element
    JSR     TransformElement    ; Transform element
    MOVE.B  D0, (A0)            ; Store transformed element
    
SkipElement:
    ADDQ.L  #1, A0              ; Move to next element
    DBRA    D2, ProcessLoop     ; Continue for all elements
    
    MOVEM.L (A7)+, D0-D2/A0     ; Restore registers
    RTS

ValidateElement:
    ; Validate array element
    ; Input: D0 = element value
    ; Output: D0 = 1 if valid, 0 if invalid
    CMP.B   #10, D0             ; Check minimum value
    BLT     InvalidElement      ; Invalid if < 10
    CMP.B   #100, D0            ; Check maximum value
    BGT     InvalidElement      ; Invalid if > 100
    
    ; Valid element
    MOVEQ   #1, D0              ; Return valid
    RTS
    
InvalidElement:
    MOVEQ   #0, D0              ; Return invalid
    RTS

TransformElement:
    ; Transform array element
    ; Input: D0 = element value
    ; Output: D0 = transformed value
    LSL.B   #1, D0              ; Double the value
    ADD.B   #5, D0              ; Add offset
    RTS

Factorial:
    ; Calculate factorial recursively
    ; Input: D0 = number
    ; Output: D0 = factorial
    CMP.L   #1, D0              ; Check base case
    BLE     FactorialBase       ; Return 1 if n <= 1
    
    ; Recursive case: n * factorial(n-1)
    MOVE.L  D0, -(A7)           ; Save n on stack
    SUBQ.L  #1, D0              ; Calculate n-1
    JSR     Factorial           ; Recursive call
    MOVE.L  (A7)+, D1           ; Restore n from stack
    MULU.W  D1, D0              ; n * factorial(n-1)
    RTS
    
FactorialBase:
    MOVEQ   #1, D0              ; Base case: return 1
    RTS

SquareFunction:
    ; Square a number
    ; Input: D0 = number
    ; Output: D0 = square
    MULU.W  D0, D0              ; Multiply by itself
    RTS

; === ADVANCED SUBROUTINE PATTERNS ===

CallWithMultipleReturns:
    ; Function with multiple return points
    ; Input: D0 = test value
    ; Output: D0 = result code
    TST.L   D0                  ; Test input
    BMI     NegativeReturn      ; Branch if negative
    BEQ     ZeroReturn          ; Branch if zero
    
    ; Positive value
    MOVEQ   #1, D0              ; Return positive code
    RTS
    
NegativeReturn:
    MOVEQ   #-1, D0             ; Return negative code
    RTS
    
ZeroReturn:
    MOVEQ   #0, D0              ; Return zero code
    RTS

VariableParameterFunction:
    ; Function accepting variable number of parameters
    ; Stack layout: [return][count][param1][param2]...[paramN]
    MOVE.L  4(A7), D1           ; Load parameter count
    MOVEQ   #0, D0              ; Initialize sum
    MOVE.L  #8, A1              ; Start of parameters (skip return + count)
    SUBQ.L  #1, D1              ; Adjust for DBRA
    
VarParamLoop:
    ADD.L   0(A7,A1.L), D0      ; Add parameter to sum
    ADDQ.L  #4, A1              ; Move to next parameter
    DBRA    D1, VarParamLoop    ; Continue for all parameters
    
    RTS                         ; Return sum in D0

; Constants
SCREEN_WIDTH        EQU     320
SCREEN_HEIGHT       EQU     256
ARRAY_COUNT         EQU     8

; Player structure offsets
PLAYER_X            EQU     0       ; X position (word)
PLAYER_Y            EQU     2       ; Y position (word)
PLAYER_VEL_X        EQU     4       ; X velocity (word)
PLAYER_VEL_Y        EQU     6       ; Y velocity (word)

; Data areas
StringData:         DC.B    'Hello Amiga!',0
PlayerData:
    DC.W    100                 ; X position
    DC.W    150                 ; Y position
    DC.W    2                   ; X velocity
    DC.W    -1                  ; Y velocity

ArrayData:          DC.B    15,25,35,45,55,65,75,85

; Results storage
AddResult:          DC.L    0
StringLen:          DC.L    0
SubResult:          DC.L    0
FactorialResult:    DC.L    0
SquareResult:       DC.L    0"
  language="assembly"
/>

## Jump Tables and Computed Branches

The 68000 supports sophisticated jump table mechanisms for efficient multi-way branching:

### Jump Table Techniques
- **Absolute indirect jumps**: `JMP (address)`
- **Table-based dispatch**: Array of addresses
- **Computed jumps**: Calculate target address
- **State machines**: Dispatch based on current state

### Performance Benefits
- Faster than multiple conditional branches
- Constant-time dispatch regardless of case count
- Elegant solution for state machines and interpreters

<CodeRunner 
  system="commodore-amiga"
  title="Jump Tables and Computed Branches"
  code="; Demonstration of jump tables and computed branching
; Shows advanced program flow control techniques

JumpTableDemo:
    ; === BASIC JUMP TABLE ===
    ; Dispatch to different functions based on input value
    
    MOVE.L  #2, D0              ; Function selector (0-4)
    CMP.L   #MAX_FUNCTIONS, D0  ; Check range
    BCC     InvalidFunction     ; Branch if out of range
    
    ; Calculate jump table offset
    LSL.L   #2, D0              ; Multiply by 4 (long addresses)
    MOVE.L  FunctionTable(PC,D0.L), A0 ; Load function address
    JSR     (A0)                ; Call function through pointer
    MOVE.L  D0, JumpResult1     ; Store result
    BRA     StateDispatch
    
InvalidFunction:
    MOVEQ   #-1, D0             ; Error code
    MOVE.L  D0, JumpResult1     ; Store error
    
StateDispatch:
    ; === STATE MACHINE DISPATCH ===
    ; Implement state machine using jump table
    
    MOVE.L  CurrentState, D0    ; Load current state
    CMP.L   #MAX_STATES, D0     ; Check valid range
    BCC     InvalidState        ; Branch if invalid
    
    ; Dispatch to state handler
    LSL.L   #2, D0              ; Multiply by 4
    MOVE.L  StateTable(PC,D0.L), A0 ; Load state handler address
    JSR     (A0)                ; Call state handler
    MOVE.L  D0, CurrentState    ; Update state
    BRA     ComputedJump
    
InvalidState:
    MOVE.L  #STATE_IDLE, CurrentState ; Reset to idle state
    
ComputedJump:
    ; === COMPUTED JUMP EXAMPLE ===
    ; Calculate jump target based on complex expression
    
    MOVE.L  #JumpInput, A0      ; Input data address
    MOVE.L  (A0), D0            ; Load input value
    
    ; Complex calculation to determine jump target
    AND.L   #$0F, D0            ; Mask to 4 bits (0-15)
    CMP.L   #8, D0              ; Check if >= 8
    BCC     HighValueJump       ; Branch for high values
    
    ; Low values (0-7)
    LSL.L   #2, D0              ; Multiply by 4
    MOVE.L  LowJumpTable(PC,D0.L), A0 ; Get jump address
    JMP     (A0)                ; Jump to calculated address
    
HighValueJump:
    ; High values (8-15)
    SUB.L   #8, D0              ; Adjust to 0-7 range
    LSL.L   #2, D0              ; Multiply by 4
    MOVE.L  HighJumpTable(PC,D0.L), A0 ; Get jump address
    JMP     (A0)                ; Jump to calculated address
    
MenuDispatch:
    ; === MENU SYSTEM DISPATCH ===
    ; Handle menu selections using jump table
    
    MOVE.L  MenuSelection, D0   ; Get menu choice
    CMP.L   #MAX_MENU_ITEMS, D0 ; Check range
    BCC     InvalidMenuChoice   ; Branch if invalid
    
    ; Execute menu function
    LSL.L   #2, D0              ; Multiply by 4
    MOVE.L  MenuTable(PC,D0.L), A0 ; Load menu function
    JSR     (A0)                ; Call menu function
    BRA     EventDispatch
    
InvalidMenuChoice:
    JSR     ShowErrorMessage    ; Show error
    
EventDispatch:
    ; === EVENT HANDLING DISPATCH ===
    ; Handle different event types
    
    MOVE.L  EventType, D0       ; Get event type
    CMP.L   #MAX_EVENT_TYPES, D0 ; Check range
    BCC     UnknownEvent        ; Branch if unknown
    
    ; Dispatch to event handler
    LSL.L   #2, D0              ; Multiply by 4
    MOVE.L  EventTable(PC,D0.L), A0 ; Load event handler
    JSR     (A0)                ; Call event handler
    BRA     JumpTableEnd
    
UnknownEvent:
    JSR     DefaultEventHandler ; Handle unknown events
    
JumpTableEnd:
    RTS

; === FUNCTION IMPLEMENTATIONS ===

Function0:
    MOVEQ   #100, D0            ; Return value 100
    RTS

Function1:
    MOVEQ   #101, D0            ; Return value 101
    RTS

Function2:
    MOVEQ   #102, D0            ; Return value 102
    RTS

Function3:
    MOVEQ   #103, D0            ; Return value 103
    RTS

Function4:
    MOVEQ   #104, D0            ; Return value 104
    RTS

; === STATE HANDLERS ===

StateIdle:
    ; Idle state processing
    MOVE.L  InputFlags, D1      ; Check input
    BTST    #INPUT_BUTTON1, D1  ; Test button 1
    BNE     GoToStateActive     ; Transition to active
    MOVEQ   #STATE_IDLE, D0     ; Stay in idle
    RTS
    
GoToStateActive:
    MOVEQ   #STATE_ACTIVE, D0   ; Transition to active
    RTS

StateActive:
    ; Active state processing
    MOVE.L  Timer, D1           ; Check timer
    CMP.L   #TIMEOUT_VALUE, D1  ; Check if timeout
    BGE     GoToStateTimeout    ; Transition to timeout
    MOVEQ   #STATE_ACTIVE, D0   ; Stay in active
    RTS
    
GoToStateTimeout:
    MOVEQ   #STATE_TIMEOUT, D0  ; Transition to timeout
    RTS

StateTimeout:
    ; Timeout state processing
    MOVEQ   #STATE_IDLE, D0     ; Return to idle
    RTS

; === JUMP TARGET IMPLEMENTATIONS ===

LowTarget0:
    MOVEQ   #10, D0             ; Low range result
    MOVE.L  D0, ComputedResult  ; Store result
    BRA     MenuDispatch        ; Continue execution

LowTarget1:
    MOVEQ   #11, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

LowTarget2:
    MOVEQ   #12, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

LowTarget3:
    MOVEQ   #13, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

LowTarget4:
    MOVEQ   #14, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

LowTarget5:
    MOVEQ   #15, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

LowTarget6:
    MOVEQ   #16, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

LowTarget7:
    MOVEQ   #17, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

HighTarget0:
    MOVEQ   #20, D0             ; High range result
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

HighTarget1:
    MOVEQ   #21, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

HighTarget2:
    MOVEQ   #22, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

HighTarget3:
    MOVEQ   #23, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

HighTarget4:
    MOVEQ   #24, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

HighTarget5:
    MOVEQ   #25, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

HighTarget6:
    MOVEQ   #26, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

HighTarget7:
    MOVEQ   #27, D0
    MOVE.L  D0, ComputedResult
    BRA     MenuDispatch

; === MENU FUNCTIONS ===

MenuNewGame:
    MOVEQ   #1, D0              ; New game result
    MOVE.L  D0, MenuResult
    RTS

MenuLoadGame:
    MOVEQ   #2, D0              ; Load game result
    MOVE.L  D0, MenuResult
    RTS

MenuOptions:
    MOVEQ   #3, D0              ; Options result
    MOVE.L  D0, MenuResult
    RTS

MenuExit:
    MOVEQ   #4, D0              ; Exit result
    MOVE.L  D0, MenuResult
    RTS

ShowErrorMessage:
    MOVEQ   #-1, D0             ; Error indicator
    MOVE.L  D0, MenuResult
    RTS

; === EVENT HANDLERS ===

HandleKeyPress:
    MOVEQ   #10, D0             ; Key press handled
    MOVE.L  D0, EventResult
    RTS

HandleMouseClick:
    MOVEQ   #11, D0             ; Mouse click handled
    MOVE.L  D0, EventResult
    RTS

HandleTimer:
    MOVEQ   #12, D0             ; Timer handled
    MOVE.L  D0, EventResult
    RTS

DefaultEventHandler:
    MOVEQ   #0, D0              ; Default handling
    MOVE.L  D0, EventResult
    RTS

; === JUMP TABLES ===

FunctionTable:
    DC.L    Function0           ; Function 0 address
    DC.L    Function1           ; Function 1 address
    DC.L    Function2           ; Function 2 address
    DC.L    Function3           ; Function 3 address
    DC.L    Function4           ; Function 4 address

StateTable:
    DC.L    StateIdle           ; State 0: Idle
    DC.L    StateActive         ; State 1: Active
    DC.L    StateTimeout        ; State 2: Timeout

LowJumpTable:
    DC.L    LowTarget0          ; Low target 0
    DC.L    LowTarget1          ; Low target 1
    DC.L    LowTarget2          ; Low target 2
    DC.L    LowTarget3          ; Low target 3
    DC.L    LowTarget4          ; Low target 4
    DC.L    LowTarget5          ; Low target 5
    DC.L    LowTarget6          ; Low target 6
    DC.L    LowTarget7          ; Low target 7

HighJumpTable:
    DC.L    HighTarget0         ; High target 0
    DC.L    HighTarget1         ; High target 1
    DC.L    HighTarget2         ; High target 2
    DC.L    HighTarget3         ; High target 3
    DC.L    HighTarget4         ; High target 4
    DC.L    HighTarget5         ; High target 5
    DC.L    HighTarget6         ; High target 6
    DC.L    HighTarget7         ; High target 7

MenuTable:
    DC.L    MenuNewGame         ; Menu option 0
    DC.L    MenuLoadGame        ; Menu option 1
    DC.L    MenuOptions         ; Menu option 2
    DC.L    MenuExit            ; Menu option 3

EventTable:
    DC.L    HandleKeyPress      ; Event type 0
    DC.L    HandleMouseClick    ; Event type 1
    DC.L    HandleTimer         ; Event type 2

; Constants
MAX_FUNCTIONS       EQU     5
MAX_STATES          EQU     3
MAX_MENU_ITEMS      EQU     4
MAX_EVENT_TYPES     EQU     3
STATE_IDLE          EQU     0
STATE_ACTIVE        EQU     1
STATE_TIMEOUT       EQU     2
INPUT_BUTTON1       EQU     0
TIMEOUT_VALUE       EQU     1000

; Data areas
JumpInput:          DC.L    $A      ; Input for computed jump (10)
CurrentState:       DC.L    STATE_IDLE
MenuSelection:      DC.L    1
EventType:          DC.L    0
InputFlags:         DC.L    %00000001    ; Button 1 pressed
Timer:              DC.L    1500

; Results storage
JumpResult1:        DC.L    0
ComputedResult:     DC.L    0
MenuResult:         DC.L    0
EventResult:        DC.L    0"
  language="assembly"
/>

## Practice Exercise

<CodeRunner 
  system="commodore-amiga"
  title="Program Flow Control Practice"
  code="; Practice Exercise: Amiga Game Engine Control System
; Use advanced flow control for game logic management

GameEngineControl:
    ; Initialize game engine
    JSR     InitializeGameEngine
    
    ; Main game loop
    JSR     MainGameLoop
    
    ; Shutdown game engine
    JSR     ShutdownGameEngine
    
    RTS

InitializeGameEngine:
    ; Initialize all game subsystems
    MOVE.L  #GAME_STATE_MENU, GameState ; Start in menu
    CLR.L   GameTime            ; Reset game time
    CLR.L   Score               ; Reset score
    MOVE.L  #MAX_LIVES, Lives   ; Set initial lives
    
    ; Initialize player
    MOVE.W  #160, PlayerX       ; Center X
    MOVE.W  #200, PlayerY       ; Bottom area
    CLR.W   PlayerVelX          ; No initial velocity
    CLR.W   PlayerVelY
    MOVE.L  #PLAYER_STATE_IDLE, PlayerState
    
    ; Initialize enemies
    JSR     InitializeEnemies
    
    ; Initialize power-ups
    JSR     InitializePowerUps
    
    RTS

MainGameLoop:
    ; Main game loop with state-based dispatch
    MOVE.L  #MAIN_LOOP_COUNT-1, D7 ; Simulate limited game loop
    
GameLoopIteration:
    ; Dispatch based on current game state
    MOVE.L  GameState, D0       ; Load current state
    CMP.L   #MAX_GAME_STATES, D0 ; Check valid range
    BCC     InvalidGameState    ; Handle invalid state
    
    ; Dispatch to state handler
    LSL.L   #2, D0              ; Multiply by 4 for address table
    MOVE.L  GameStateTable(PC,D0.L), A0 ; Load state handler
    JSR     (A0)                ; Call state handler
    MOVE.L  D0, GameState       ; Update game state
    
    ; Update game time
    ADDQ.L  #1, GameTime        ; Increment frame counter
    
    ; Continue main loop
    DBRA    D7, GameLoopIteration
    RTS
    
InvalidGameState:
    MOVE.L  #GAME_STATE_MENU, GameState ; Reset to menu
    BRA     GameLoopIteration

; === GAME STATE HANDLERS ===

HandleMenuState:
    ; Handle menu interface
    MOVE.L  InputState, D0      ; Get input
    
    ; Check menu selections
    BTST    #INPUT_START, D0    ; Test start button
    BNE     StartNewGame        ; Branch to start game
    BTST    #INPUT_SELECT, D0   ; Test select button
    BNE     ToggleOptions       ; Branch to options
    
    ; Stay in menu
    MOVEQ   #GAME_STATE_MENU, D0
    RTS
    
StartNewGame:
    JSR     ResetGameData       ; Reset game state
    MOVEQ   #GAME_STATE_PLAYING, D0
    RTS
    
ToggleOptions:
    MOVEQ   #GAME_STATE_OPTIONS, D0
    RTS

HandlePlayingState:
    ; Handle active gameplay
    JSR     ProcessPlayerInput  ; Handle player input
    JSR     UpdateGameObjects   ; Update all game objects
    JSR     CheckCollisions     ; Check for collisions
    JSR     UpdateUI            ; Update user interface
    
    ; Check for state transitions
    TST.L   Lives               ; Check lives remaining
    BLE     GameOver            ; Transition to game over
    
    MOVE.L  InputState, D0      ; Check pause input
    BTST    #INPUT_PAUSE, D0    ; Test pause button
    BNE     PauseGame           ; Transition to pause
    
    ; Continue playing
    MOVEQ   #GAME_STATE_PLAYING, D0
    RTS
    
GameOver:
    MOVEQ   #GAME_STATE_GAMEOVER, D0
    RTS
    
PauseGame:
    MOVEQ   #GAME_STATE_PAUSED, D0
    RTS

HandlePausedState:
    ; Handle pause state
    MOVE.L  InputState, D0      ; Get input
    BTST    #INPUT_PAUSE, D0    ; Test pause button
    BNE     UnpauseGame         ; Resume if pause pressed again
    
    ; Stay paused
    MOVEQ   #GAME_STATE_PAUSED, D0
    RTS
    
UnpauseGame:
    MOVEQ   #GAME_STATE_PLAYING, D0
    RTS

HandleGameOverState:
    ; Handle game over
    MOVE.L  InputState, D0      ; Get input
    BTST    #INPUT_START, D0    ; Test start button
    BNE     RestartGame         ; Restart if start pressed
    BTST    #INPUT_SELECT, D0   ; Test select button
    BNE     ReturnToMenu        ; Return to menu
    
    ; Stay in game over
    MOVEQ   #GAME_STATE_GAMEOVER, D0
    RTS
    
RestartGame:
    JSR     ResetGameData       ; Reset everything
    MOVEQ   #GAME_STATE_PLAYING, D0
    RTS
    
ReturnToMenu:
    MOVEQ   #GAME_STATE_MENU, D0
    RTS

HandleOptionsState:
    ; Handle options menu
    MOVE.L  InputState, D0      ; Get input
    BTST    #INPUT_SELECT, D0   ; Test select button
    BNE     ExitOptions         ; Exit options
    
    ; Process option changes here
    MOVEQ   #GAME_STATE_OPTIONS, D0
    RTS
    
ExitOptions:
    MOVEQ   #GAME_STATE_MENU, D0
    RTS

; === GAME OBJECT PROCESSING ===

ProcessPlayerInput:
    ; Process player input using nested conditionals
    MOVE.L  InputState, D0      ; Load input state
    
    ; Check movement input
    BTST    #INPUT_LEFT, D0     ; Test left input
    BEQ     CheckRightInput     ; Skip if not pressed
    
    ; Move player left
    MOVE.W  PlayerVelX, D1      ; Load current X velocity
    SUB.W   #PLAYER_ACCEL, D1   ; Decrease velocity (move left)
    CMP.W   #-MAX_PLAYER_SPEED, D1 ; Check maximum left speed
    BGE     SetPlayerVelX       ; Branch if within limits
    MOVE.W  #-MAX_PLAYER_SPEED, D1 ; Clamp to maximum
    BRA     SetPlayerVelX
    
CheckRightInput:
    BTST    #INPUT_RIGHT, D0    ; Test right input
    BEQ     CheckJumpInput      ; Skip if not pressed
    
    ; Move player right
    MOVE.W  PlayerVelX, D1      ; Load current X velocity
    ADD.W   #PLAYER_ACCEL, D1   ; Increase velocity (move right)
    CMP.W   #MAX_PLAYER_SPEED, D1 ; Check maximum right speed
    BLE     SetPlayerVelX       ; Branch if within limits
    MOVE.W  #MAX_PLAYER_SPEED, D1 ; Clamp to maximum
    
SetPlayerVelX:
    MOVE.W  D1, PlayerVelX      ; Store new X velocity
    
CheckJumpInput:
    BTST    #INPUT_JUMP, D0     ; Test jump input
    BEQ     ApplyPlayerPhysics  ; Skip if not pressed
    
    ; Check if player can jump
    CMP.L   #PLAYER_STATE_GROUNDED, PlayerState
    BNE     ApplyPlayerPhysics  ; Can't jump if not grounded
    
    ; Start jump
    MOVE.W  #-JUMP_VELOCITY, PlayerVelY ; Set upward velocity
    MOVE.L  #PLAYER_STATE_JUMPING, PlayerState ; Change state
    
ApplyPlayerPhysics:
    ; Apply gravity and update position
    MOVE.W  PlayerVelY, D1      ; Load Y velocity
    ADD.W   #GRAVITY, D1        ; Apply gravity
    MOVE.W  D1, PlayerVelY      ; Store new Y velocity
    
    ; Update position
    MOVE.W  PlayerX, D2         ; Load X position
    ADD.W   PlayerVelX, D2      ; Add X velocity
    MOVE.W  D2, PlayerX         ; Store new X position
    
    MOVE.W  PlayerY, D3         ; Load Y position
    ADD.W   PlayerVelY, D3      ; Add Y velocity
    
    ; Check ground collision
    CMP.W   #GROUND_LEVEL, D3   ; Check if at or below ground
    BLE     PlayerInAir         ; Branch if still in air
    
    ; Player hit ground
    MOVE.W  #GROUND_LEVEL, D3   ; Clamp to ground
    CLR.W   PlayerVelY          ; Stop Y velocity
    MOVE.L  #PLAYER_STATE_GROUNDED, PlayerState ; Change state
    
PlayerInAir:
    MOVE.W  D3, PlayerY         ; Store new Y position
    
    RTS

UpdateGameObjects:
    ; Update all game objects using loops
    JSR     UpdateEnemies       ; Update enemy objects
    JSR     UpdatePowerUps      ; Update power-up objects
    JSR     UpdateProjectiles   ; Update projectile objects
    RTS

UpdateEnemies:
    ; Update all enemies using state machines
    MOVE.L  #MAX_ENEMIES-1, D7  ; Enemy counter
    MOVE.L  #EnemyArray, A0     ; Enemy array base
    
EnemyUpdateLoop:
    ; Check if enemy is active
    TST.L   ENEMY_ACTIVE(A0)    ; Test active flag
    BEQ     NextEnemy           ; Skip if inactive
    
    ; Dispatch to enemy AI state
    MOVE.L  ENEMY_STATE(A0), D0 ; Load enemy state
    CMP.L   #MAX_ENEMY_STATES, D0 ; Check valid range
    BCC     InvalidEnemyState   ; Handle invalid state
    
    ; Call enemy AI handler
    LSL.L   #2, D0              ; Multiply by 4
    MOVE.L  EnemyAITable(PC,D0.L), A1 ; Load AI handler
    JSR     (A1)                ; Call AI handler
    
    BRA     NextEnemy
    
InvalidEnemyState:
    MOVE.L  #ENEMY_STATE_PATROL, ENEMY_STATE(A0) ; Reset to patrol
    
NextEnemy:
    LEA     ENEMY_SIZE(A0), A0  ; Move to next enemy
    DBRA    D7, EnemyUpdateLoop ; Continue for all enemies
    
    RTS

UpdatePowerUps:
    ; Update power-ups with simple loop
    MOVE.L  #MAX_POWERUPS-1, D7 ; Power-up counter
    MOVE.L  #PowerUpArray, A0   ; Power-up array base
    
PowerUpUpdateLoop:
    ; Check if power-up is active
    TST.L   POWERUP_ACTIVE(A0)  ; Test active flag
    BEQ     NextPowerUp         ; Skip if inactive
    
    ; Update power-up animation/position
    MOVE.W  POWERUP_ANIM(A0), D0 ; Load animation frame
    ADDQ.W  #1, D0              ; Increment frame
    CMP.W   #MAX_POWERUP_FRAMES, D0 ; Check if wrapped
    BLT     StorePowerUpAnim    ; Branch if not wrapped
    CLR.W   D0                  ; Reset to frame 0
    
StorePowerUpAnim:
    MOVE.W  D0, POWERUP_ANIM(A0) ; Store new frame
    
NextPowerUp:
    LEA     POWERUP_SIZE(A0), A0 ; Move to next power-up
    DBRA    D7, PowerUpUpdateLoop ; Continue for all power-ups
    
    RTS

UpdateProjectiles:
    ; Update projectiles with early termination
    MOVE.L  #MAX_PROJECTILES-1, D7 ; Projectile counter
    MOVE.L  #ProjectileArray, A0 ; Projectile array base
    
ProjectileUpdateLoop:
    ; Check if projectile is active
    TST.L   PROJ_ACTIVE(A0)     ; Test active flag
    BEQ     NextProjectile      ; Skip if inactive
    
    ; Update projectile position
    MOVE.W  PROJ_X(A0), D0      ; Load X position
    ADD.W   PROJ_VEL_X(A0), D0  ; Add X velocity
    MOVE.W  D0, PROJ_X(A0)      ; Store new X position
    
    MOVE.W  PROJ_Y(A0), D1      ; Load Y position
    ADD.W   PROJ_VEL_Y(A0), D1  ; Add Y velocity
    MOVE.W  D1, PROJ_Y(A0)      ; Store new Y position
    
    ; Check if projectile is off-screen
    TST.W   D0                  ; Check left boundary
    BMI     DeactivateProjectile ; Deactivate if off-screen
    CMP.W   #SCREEN_WIDTH, D0   ; Check right boundary
    BGE     DeactivateProjectile ; Deactivate if off-screen
    TST.W   D1                  ; Check top boundary
    BMI     DeactivateProjectile ; Deactivate if off-screen
    CMP.W   #SCREEN_HEIGHT, D1  ; Check bottom boundary
    BGE     DeactivateProjectile ; Deactivate if off-screen
    
    BRA     NextProjectile      ; Continue if on-screen
    
DeactivateProjectile:
    CLR.L   PROJ_ACTIVE(A0)     ; Deactivate projectile
    
NextProjectile:
    LEA     PROJ_SIZE(A0), A0   ; Move to next projectile
    DBRA    D7, ProjectileUpdateLoop ; Continue for all projectiles
    
    RTS

; === ENEMY AI HANDLERS ===

EnemyPatrolAI:
    ; Simple patrol AI
    MOVEQ   #ENEMY_STATE_PATROL, D0
    RTS

EnemyChaseAI:
    ; Chase player AI
    MOVEQ   #ENEMY_STATE_CHASE, D0
    RTS

EnemyAttackAI:
    ; Attack AI
    MOVEQ   #ENEMY_STATE_ATTACK, D0
    RTS

; === HELPER FUNCTIONS ===

InitializeEnemies:
    ; Initialize enemy array
    MOVE.L  #EnemyArray, A0     ; Enemy array base
    MOVE.L  #MAX_ENEMIES-1, D7  ; Counter
    
InitEnemyLoop:
    CLR.L   ENEMY_ACTIVE(A0)    ; Mark as inactive
    LEA     ENEMY_SIZE(A0), A0  ; Move to next enemy
    DBRA    D7, InitEnemyLoop   ; Continue for all enemies
    RTS

InitializePowerUps:
    ; Initialize power-up array
    MOVE.L  #PowerUpArray, A0   ; Power-up array base
    MOVE.L  #MAX_POWERUPS-1, D7 ; Counter
    
InitPowerUpLoop:
    CLR.L   POWERUP_ACTIVE(A0)  ; Mark as inactive
    LEA     POWERUP_SIZE(A0), A0 ; Move to next power-up
    DBRA    D7, InitPowerUpLoop ; Continue for all power-ups
    RTS

CheckCollisions:
    ; Placeholder for collision detection
    RTS

UpdateUI:
    ; Placeholder for UI updates
    RTS

ResetGameData:
    ; Reset all game data for new game
    CLR.L   Score               ; Reset score
    MOVE.L  #MAX_LIVES, Lives   ; Reset lives
    MOVE.W  #160, PlayerX       ; Reset player position
    MOVE.W  #200, PlayerY
    CLR.W   PlayerVelX          ; Clear velocities
    CLR.W   PlayerVelY
    MOVE.L  #PLAYER_STATE_GROUNDED, PlayerState
    RTS

ShutdownGameEngine:
    ; Cleanup and shutdown
    RTS

; === JUMP TABLES ===

GameStateTable:
    DC.L    HandleMenuState     ; State 0: Menu
    DC.L    HandlePlayingState  ; State 1: Playing
    DC.L    HandlePausedState   ; State 2: Paused
    DC.L    HandleGameOverState ; State 3: Game Over
    DC.L    HandleOptionsState  ; State 4: Options

EnemyAITable:
    DC.L    EnemyPatrolAI       ; AI State 0: Patrol
    DC.L    EnemyChaseAI        ; AI State 1: Chase
    DC.L    EnemyAttackAI       ; AI State 2: Attack

; === CONSTANTS ===

; Game states
GAME_STATE_MENU         EQU     0
GAME_STATE_PLAYING      EQU     1
GAME_STATE_PAUSED       EQU     2
GAME_STATE_GAMEOVER     EQU     3
GAME_STATE_OPTIONS      EQU     4
MAX_GAME_STATES         EQU     5

; Player states
PLAYER_STATE_IDLE       EQU     0
PLAYER_STATE_GROUNDED   EQU     1
PLAYER_STATE_JUMPING    EQU     2

; Enemy states
ENEMY_STATE_PATROL      EQU     0
ENEMY_STATE_CHASE       EQU     1
ENEMY_STATE_ATTACK      EQU     2
MAX_ENEMY_STATES        EQU     3

; Input bits
INPUT_LEFT              EQU     0
INPUT_RIGHT             EQU     1
INPUT_JUMP              EQU     2
INPUT_START             EQU     3
INPUT_SELECT            EQU     4
INPUT_PAUSE             EQU     5

; Game constants
MAX_LIVES               EQU     3
MAIN_LOOP_COUNT         EQU     1000
PLAYER_ACCEL            EQU     2
MAX_PLAYER_SPEED        EQU     8
JUMP_VELOCITY           EQU     12
GRAVITY                 EQU     1
GROUND_LEVEL            EQU     200
SCREEN_WIDTH            EQU     320
SCREEN_HEIGHT           EQU     256

; Object limits
MAX_ENEMIES             EQU     8
MAX_POWERUPS            EQU     4
MAX_PROJECTILES         EQU     16
MAX_POWERUP_FRAMES      EQU     8

; Structure offsets
ENEMY_ACTIVE            EQU     0
ENEMY_STATE             EQU     4
ENEMY_SIZE              EQU     16

POWERUP_ACTIVE          EQU     0
POWERUP_ANIM            EQU     4
POWERUP_SIZE            EQU     12

PROJ_ACTIVE             EQU     0
PROJ_X                  EQU     4
PROJ_Y                  EQU     6
PROJ_VEL_X              EQU     8
PROJ_VEL_Y              EQU     10
PROJ_SIZE               EQU     12

; === DATA AREAS ===

; Game state
GameState:              DC.L    GAME_STATE_MENU
GameTime:               DC.L    0
Score:                  DC.L    0
Lives:                  DC.L    MAX_LIVES
InputState:             DC.L    %00001000    ; Start button pressed

; Player data
PlayerX:                DC.W    160
PlayerY:                DC.W    200
PlayerVelX:             DC.W    0
PlayerVelY:             DC.W    0
PlayerState:            DC.L    PLAYER_STATE_GROUNDED

; Object arrays
EnemyArray:             DS.B    MAX_ENEMIES*ENEMY_SIZE
PowerUpArray:           DS.B    MAX_POWERUPS*POWERUP_SIZE
ProjectileArray:        DS.B    MAX_PROJECTILES*PROJ_SIZE

; Challenge exercises:
; 1. Add more complex AI state machines with transitions
; 2. Implement nested menu systems with multiple levels
; 3. Create event-driven programming using jump tables
; 4. Add save/load game state functionality"
  language="assembly"
/>

## What You've Learned

In this lesson, you've discovered:

1. **Conditional Branching** - Comprehensive Bcc instruction family for all condition types
2. **Loop Structures** - DBRA and other efficient looping patterns
3. **Subroutines** - JSR/BSR calls with various parameter passing methods
4. **Jump Tables** - Computed branches and dispatch tables for efficient multi-way branching
5. **Advanced Patterns** - State machines, nested calls, and structured programming techniques

## Looking Ahead

Next, you'll explore Section 2 of Phase 1 - Memory and Hardware! You'll learn about advanced memory management, the Amiga's custom chips, and how to interface directly with the sophisticated hardware that makes the Amiga unique. You'll discover how the 68000's powerful addressing modes combine with the Amiga's advanced architecture!

## Fun Fact

The 68000's program flow control capabilities were revolutionary for their elegance and orthogonality. The comprehensive Bcc instruction family, with conditions for both signed and unsigned comparisons, eliminated much of the awkward branching logic required on simpler processors. The DBRA instruction was particularly innovative - combining decrement, test, and branch in a single instruction made loops incredibly efficient. The 68000's ability to perform indirect jumps through memory made jump tables and function pointers practical, enabling sophisticated software architectures like object-oriented programming and interpreter design. These capabilities were extensively used in AmigaOS, which featured one of the most advanced multitasking operating systems of its era. The clean separation between instruction execution and condition testing made 68000 assembly programming much more readable and maintainable than on other processors, contributing to the platform's reputation for elegant software design!
