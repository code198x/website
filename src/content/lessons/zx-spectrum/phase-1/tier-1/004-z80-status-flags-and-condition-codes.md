---
title: "Z80 Status Flags and Condition Codes"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 4
description: "Learn how the Z80 keeps track of operation results using status flags, and how to use condition codes to make decisions in your programs."
learning_objectives:
  - "Understand what status flags are and why they're important"
  - "Learn the Z80's main status flags (Z, C, S, P/V)"
  - "Practice using condition codes for program decisions"
  - "Learn conditional jump instructions"
  - "Build programs that respond to different conditions"
concepts:
  - "Z80 Status Register (F register)"
  - "Zero flag (Z) and Sign flag (S)"
  - "Carry flag (C) and Parity/Overflow flag (P/V)"
  - "Conditional jump instructions (JR Z, JR NZ, etc.)"
  - "Program decision making and branching"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 4
---

# Lesson 4: Z80 Status Flags and Condition Codes

Every time the Z80 performs an operation, it keeps track of what happened using special status flags. Today, you'll learn how these flags work and how to use them to make your programs smart and responsive!

## What Are Status Flags?

Status flags are like indicator lights on the Z80's dashboard. They automatically turn on or off based on the results of operations, telling you important information:

- Was the result zero?
- Did an operation overflow?
- Was there a carry from an addition?
- Is the result positive or negative?

The Z80 stores these flags in a special register called the **F register** (Flags register).

## The Z80's Main Status Flags

### Zero Flag (Z)
**Set when**: The result of an operation is zero
**Clear when**: The result is non-zero

```text
LD A, 5
SUB 5           ; A = 0, so Zero flag is SET
LD B, 3
SUB 1           ; B = 2, so Zero flag is CLEAR
```

### Carry Flag (C)
**Set when**: An operation produces a carry (overflow from bit 7)
**Clear when**: No carry occurs

```text
LD A, $FF       ; A = 255
ADD A, 1        ; A = 0, Carry flag is SET (255 + 1 = 256, too big for 8 bits)
LD B, 100
ADD B, 50       ; B = 150, Carry flag is CLEAR (fits in 8 bits)
```

### Sign Flag (S)
**Set when**: The result is negative (bit 7 = 1)
**Clear when**: The result is positive (bit 7 = 0)

```text
LD A, $80       ; A = 128 (bit 7 = 1), Sign flag is SET
LD B, $7F       ; B = 127 (bit 7 = 0), Sign flag is CLEAR
```

### Parity/Overflow Flag (P/V)
**Set when**: The result has even parity OR arithmetic overflow occurs
**Clear when**: The result has odd parity OR no overflow

This flag has dual purposes depending on the operation performed.

<CodeRunner 
  system="zx-spectrum"
  title="Z80 Status Flags Demonstration"
  code="; Demonstration of Z80 status flags
; This program shows how different operations affect the flags

StatusFlagsDemo:
    ; === ZERO FLAG DEMONSTRATION ===
    LD A, 10            ; Load 10 into A
    SUB 10              ; Subtract 10: A = 0, Zero flag SET
    ; At this point, Z flag = 1 (set)
    
    LD A, 10            ; Load 10 into A  
    SUB 5               ; Subtract 5: A = 5, Zero flag CLEAR
    ; At this point, Z flag = 0 (clear)
    
    ; === CARRY FLAG DEMONSTRATION ===
    LD A, $FF           ; Load 255 into A
    ADD A, 1            ; Add 1: A = 0, Carry flag SET
    ; At this point, C flag = 1 (carry occurred)
    
    LD A, 100           ; Load 100 into A
    ADD A, 50           ; Add 50: A = 150, Carry flag CLEAR  
    ; At this point, C flag = 0 (no carry)
    
    ; === SIGN FLAG DEMONSTRATION ===
    LD A, $80           ; Load 128 (binary 10000000)
    OR A                ; Test A (sets flags without changing A)
    ; At this point, S flag = 1 (bit 7 is set)
    
    LD A, $7F           ; Load 127 (binary 01111111)
    OR A                ; Test A
    ; At this point, S flag = 0 (bit 7 is clear)
    
    ; === COMPARING VALUES ===
    LD A, 10            ; Load first value
    LD B, 5             ; Load second value
    CP B                ; Compare A with B (A - B, but don't store result)
    ; This sets flags based on the comparison:
    ; Z flag = 0 (10 ≠ 5)
    ; C flag = 0 (10 ≥ 5, no borrow needed)
    ; S flag = 0 (10 - 5 = 5, positive result)
    
    RET"
  language="assembly"
/>

## Conditional Jump Instructions

The real power of status flags comes when you use them to make decisions. The Z80 has conditional jump instructions that check flag states:

### Zero Flag Conditions
- `JR Z, label` - Jump if Zero flag is set (result was zero)
- `JR NZ, label` - Jump if Zero flag is clear (result was not zero)

### Carry Flag Conditions  
- `JR C, label` - Jump if Carry flag is set
- `JR NC, label` - Jump if Carry flag is clear

### Sign Flag Conditions
- `JR M, label` - Jump if Sign flag is set (result is minus/negative)
- `JR P, label` - Jump if Sign flag is clear (result is plus/positive)

<CodeRunner 
  system="zx-spectrum"
  title="Conditional Jumps Demo"
  code="; Demonstration of Z80 conditional jump instructions
; This program makes decisions based on flag states

ConditionalJumpsDemo:
    ; Test if a number is zero
    LD A, 0             ; Load test value
    OR A                ; Test A (sets zero flag if A = 0)
    JR Z, IsZero        ; Jump if zero flag is set
    JR NotZero          ; Jump if zero flag is clear
    
IsZero:
    LD B, $5A           ; Mark that we detected zero
    JR ContinueTest
    
NotZero:
    LD B, $A5           ; Mark that we detected non-zero
    
ContinueTest:
    ; Test if addition produces carry
    LD A, $FF           ; Load 255
    ADD A, 1            ; Add 1 (this will produce carry)
    JR C, HasCarry      ; Jump if carry flag is set
    JR NoCarry          ; Jump if carry flag is clear
    
HasCarry:
    LD C, $C1           ; Mark that carry occurred
    JR SignTest
    
NoCarry:
    LD C, $C0           ; Mark that no carry occurred
    
SignTest:
    ; Test if a number is negative
    LD A, $80           ; Load 128 (negative in signed arithmetic)
    OR A                ; Test the sign
    JR M, IsNegative    ; Jump if minus (sign flag set)
    JR IsPositive       ; Jump if plus (sign flag clear)
    
IsNegative:
    LD D, $EE           ; Mark as negative
    JR EndDemo
    
IsPositive:
    LD D, $77           ; Mark as positive
    
EndDemo:
    ; Display results on screen
    LD ($4000), B       ; Show zero test result
    LD ($4001), C       ; Show carry test result
    LD ($4002), D       ; Show sign test result
    
    RET"
  language="assembly"
/>

## Using CP (Compare) for Decision Making

The CP instruction is perfect for comparing values and making decisions:

```text
CP value            ; Compare A with value
CP (HL)             ; Compare A with value at address in HL
CP B                ; Compare A with B register
```

CP performs A - operand but doesn't store the result - it only sets the flags!

<CodeRunner 
  system="zx-spectrum"
  title="Compare and Decision Making"
  code="; Using CP instruction for comparisons and decision making
; This program creates a simple number classification system

CompareDemo:
    ; Classify numbers as small, medium, or large
    LD A, 150           ; Test value
    
    ; Check if small (< 50)
    CP 50               ; Compare A with 50
    JR C, IsSmall       ; Jump if A < 50 (carry set means A < operand)
    
    ; Check if medium (50-100)
    CP 100              ; Compare A with 100
    JR C, IsMedium      ; Jump if A < 100
    
    ; Must be large (≥ 100)
    JR IsLarge
    
IsSmall:
    LD B, $53           ; 'S' for Small
    LD ($4000), B       ; Display on screen
    JR EndClassify
    
IsMedium:
    LD B, $4D           ; 'M' for Medium
    LD ($4000), B       ; Display on screen
    JR EndClassify
    
IsLarge:
    LD B, $4C           ; 'L' for Large
    LD ($4000), B       ; Display on screen
    
EndClassify:
    ; Demonstrate equality testing
    LD A, 42            ; Test value
    CP 42               ; Compare with itself
    JR Z, AreEqual      ; Jump if equal (zero flag set)
    JR NotEqual
    
AreEqual:
    LD C, $45           ; 'E' for Equal
    LD ($4001), C
    JR BoundaryTest
    
NotEqual:
    LD C, $4E           ; 'N' for Not equal
    LD ($4001), C
    
BoundaryTest:
    ; Test boundary conditions
    LD A, 255           ; Maximum 8-bit value
    CP 255              ; Compare with maximum
    JR Z, AtMaximum     ; Equal to maximum?
    JR BelowMaximum
    
AtMaximum:
    LD D, $4D           ; 'M' for Maximum
    LD ($4002), D
    JR EndDemo
    
BelowMaximum:
    LD D, $42           ; 'B' for Below maximum
    LD ($4002), D
    
EndDemo:
    RET"
  language="assembly"
/>

## Building Smart Loops with Flags

Status flags are essential for creating efficient loops:

### Counting Down to Zero
```text
LD B, 10            ; Loop counter
CountDown:
    ; Do something here
    DEC B               ; Decrement counter (sets zero flag if B = 0)
    JR NZ, CountDown    ; Continue if not zero
```

### Searching Through Data
```text
LD HL, DataStart    ; Point to data
LD A, TargetValue   ; Value we're looking for
SearchLoop:
    CP (HL)             ; Compare with current data
    JR Z, Found         ; Jump if found
    INC HL              ; Move to next data
    ; Add bounds checking here
    JR SearchLoop
Found:
    ; Found the value!
```

<CodeRunner 
  system="zx-spectrum"
  title="Smart Loops with Flags"
  code="; Demonstration of using flags in loops
; This program shows practical loop patterns

SmartLoopsDemo:
    ; === COUNTDOWN LOOP ===
    ; Fill screen positions with countdown
    LD HL, $4000        ; Point to screen
    LD B, 10            ; Count from 10 down to 1
    
CountdownLoop:
    LD A, B             ; Get current count
    ADD A, $30          ; Convert to ASCII digit (0-9)
    LD (HL), A          ; Display on screen
    INC HL              ; Next screen position
    DEC B               ; Decrement counter (sets Z flag if B = 0)
    JR NZ, CountdownLoop ; Continue if not zero
    
    ; === SEARCH LOOP ===
    ; Search for a specific character in data
    LD HL, TestData     ; Point to our test data
    LD A, $58           ; Looking for 'X' character
    LD B, 0             ; Position counter
    
SearchLoop:
    CP (HL)             ; Compare A with data at HL
    JR Z, FoundTarget   ; Jump if found
    INC HL              ; Move to next data byte
    INC B               ; Increment position counter
    LD C, (HL)          ; Check if we've reached end marker
    CP C                ; Compare with current byte
    JR Z, NotFound      ; If we hit our search value as end, stop
    LD C, $00           ; Check for null terminator
    CP C
    JR Z, NotFound      ; End of data reached
    JR SearchLoop       ; Continue searching
    
FoundTarget:
    LD A, $46           ; 'F' for Found
    LD ($4020), A       ; Display result
    LD A, B             ; Get position where found
    ADD A, $30          ; Convert to ASCII
    LD ($4021), A       ; Display position
    JR SearchEnd
    
NotFound:
    LD A, $4E           ; 'N' for Not found
    LD ($4020), A
    
SearchEnd:
    ; === BOUNDED LOOP ===
    ; Loop with upper and lower bounds checking
    LD A, 5             ; Start value
    LD B, 15            ; Upper bound
    LD C, 0             ; Lower bound
    LD HL, $4040        ; Screen position for display
    
BoundedLoop:
    LD (HL), A          ; Display current value
    INC HL              ; Next display position
    INC A               ; Increment value
    CP B                ; Compare with upper bound
    JR Z, ReachedTop    ; If equal to upper bound, reverse
    CP C                ; Compare with lower bound  
    JR Z, ReachedBottom ; If equal to lower bound, reverse
    JR BoundedLoop      ; Continue
    
ReachedTop:
    LD A, $54           ; 'T' for Top
    LD (HL), A
    JR EndDemo
    
ReachedBottom:
    LD A, $42           ; 'B' for Bottom
    LD (HL), A
    
EndDemo:
    RET

; Test data for search example
TestData:
    DB $41, $42, $43, $58, $59, $5A, $00  ; 'ABC' + 'X' + 'YZ' + null"
  language="assembly"
/>

## Advanced Flag Combinations

You can combine flag tests for complex conditions:

### Testing Multiple Conditions
```text
; Check if A is between 10 and 20
CP 10               ; Compare with lower bound
JR C, TooSmall      ; Jump if A < 10
CP 21               ; Compare with upper bound + 1
JR NC, TooBig       ; Jump if A ≥ 21
; A is between 10 and 20
```

### Using Logical Operations
```text
; Test if a bit is set
LD A, (SomeFlag)
AND %00000001       ; Test bit 0
JR Z, BitClear      ; Jump if bit was 0
; Bit was 1
```

<CodeRunner 
  system="zx-spectrum"
  title="Advanced Flag Usage"
  code="; Advanced techniques using Z80 flags
; This program demonstrates complex decision making

AdvancedFlagsDemo:
    ; === RANGE CHECKING ===
    ; Check if a value is within a specific range
    LD A, 15            ; Test value
    
    ; Check if between 10 and 20 (inclusive)
    CP 10               ; Compare with lower bound
    JR C, OutOfRange    ; Jump if A < 10
    CP 21               ; Compare with upper bound + 1  
    JR NC, OutOfRange   ; Jump if A ≥ 21
    ; Value is in range
    LD B, $49           ; 'I' for In range
    JR RangeResult
    
OutOfRange:
    LD B, $4F           ; 'O' for Out of range
    
RangeResult:
    LD ($4000), B       ; Display result
    
    ; === BIT TESTING ===
    ; Test individual bits in a value
    LD A, %10110100     ; Test byte with mixed bits
    
    ; Test bit 7 (sign bit)
    AND %10000000       ; Mask bit 7
    JR Z, Bit7Clear     ; Jump if bit 7 was 0
    LD C, $37           ; '7' - bit 7 is set
    JR TestBit3
    
Bit7Clear:
    LD C, $30           ; '0' - bit 7 is clear
    
TestBit3:
    LD ($4001), C       ; Display bit 7 result
    
    LD A, %10110100     ; Reload test byte
    AND %00001000       ; Mask bit 3
    JR Z, Bit3Clear     ; Jump if bit 3 was 0
    LD D, $33           ; '3' - bit 3 is set
    JR TestComplete
    
Bit3Clear:
    LD D, $30           ; '0' - bit 3 is clear
    
TestComplete:
    LD ($4002), D       ; Display bit 3 result
    
    ; === ARITHMETIC OVERFLOW DETECTION ===
    ; Detect when addition overflows
    LD A, 200           ; Large positive number
    LD B, 100           ; Another positive number
    ADD A, B            ; Add them: 200 + 100 = 300 (but max is 255!)
    JR C, OverflowOccurred ; Jump if carry flag set
    LD E, $4E           ; 'N' for No overflow
    JR OverflowResult
    
OverflowOccurred:
    LD E, $59           ; 'Y' for Yes, overflow occurred
    
OverflowResult:
    LD ($4003), E       ; Display overflow result
    
    ; === PARITY CHECKING ===
    ; Check if a number has even or odd parity
    LD A, %10110110     ; Test byte (5 ones = odd parity)
    OR A                ; Test A (sets parity flag)
    JP PE, EvenParity   ; Jump if even parity
    LD H, $4F           ; 'O' for Odd parity
    JR ParityResult
    
EvenParity:
    LD H, $45           ; 'E' for Even parity
    
ParityResult:
    LD ($4004), H       ; Display parity result
    
    RET"
  language="assembly"
/>

## Common Flag Patterns

### Testing for Zero
```text
OR A                ; Quick way to test if A = 0 (sets Z flag)
JR Z, IsZero        ; Jump if A was zero
```

### Testing for Negative
```text
OR A                ; Test A (sets S flag if bit 7 = 1)
JR M, IsNegative    ; Jump if negative
```

### Setting/Clearing Flags
```text
OR A                ; Clear carry flag, set other flags based on A
SCF                 ; Set carry flag
CCF                 ; Complement (flip) carry flag
```

## Practice Exercise

<CodeRunner 
  system="zx-spectrum"
  title="Status Flags Practice"
  code="; Practice Exercise: Number Analysis Program
; Analyze a number and display information about it

PracticeExercise:
    ; Analyze this number - try changing it and see what happens!
    LD A, 128           ; Number to analyze
    
    ; Store original value for display
    LD ($4000), A       ; Show the number itself
    
    ; Test 1: Is it zero?
    OR A                ; Test A (affects all flags)
    JR Z, NumberIsZero
    LD B, $4E           ; 'N' for Not zero
    JR ZeroTestDone
NumberIsZero:
    LD B, $5A           ; 'Z' for Zero
ZeroTestDone:
    LD ($4001), B       ; Display zero test result
    
    ; Test 2: Is it negative? (bit 7 set)
    OR A                ; Test A again
    JR M, NumberIsNegative
    LD C, $50           ; 'P' for Positive
    JR SignTestDone
NumberIsNegative:
    LD C, $4E           ; 'N' for Negative
SignTestDone:
    LD ($4002), C       ; Display sign test result
    
    ; Test 3: Is it large? (> 127)
    CP 128              ; Compare with 128
    JR NC, NumberIsLarge ; Not carry = greater or equal
    LD D, $53           ; 'S' for Small
    JR SizeTestDone
NumberIsLarge:
    LD D, $4C           ; 'L' for Large
SizeTestDone:
    LD ($4003), D       ; Display size test result
    
    ; Test 4: Is it even or odd?
    AND %00000001       ; Test bit 0 (affects Z flag)
    JR Z, NumberIsEven  ; If bit 0 = 0, number is even
    LD E, $4F           ; 'O' for Odd
    JR ParityTestDone
NumberIsEven:
    LD E, $45           ; 'E' for Even
ParityTestDone:
    LD ($4004), E       ; Display parity test result
    
    ; Test 5: Range check (is it between 50 and 200?)
    LD A, 128           ; Reload original number
    CP 50               ; Compare with lower bound
    JR C, OutOfRange    ; Less than 50
    CP 201              ; Compare with upper bound + 1
    JR NC, OutOfRange   ; Greater than 200
    LD H, $49           ; 'I' for In range
    JR RangeTestDone
OutOfRange:
    LD H, $4F           ; 'O' for Out of range
RangeTestDone:
    LD ($4005), H       ; Display range test result
    
    RET

; Challenge: Try changing the test number to different values:
; - 0 (what patterns do you see?)
; - 255 (maximum value)
; - 127 (largest positive in signed arithmetic)
; - 64 (nice round number)
; 
; Can you add more tests? Try:
; - Multiple of 10?
; - Power of 2?
; - Prime number?"
  language="assembly"
/>

## What You've Learned

In this lesson, you've learned:

1. **Z80 Status Flags** - How the Z80 tracks operation results automatically
2. **Main Flags** - Zero (Z), Carry (C), Sign (S), and Parity/Overflow (P/V)
3. **Conditional Jumps** - Making program decisions based on flag states
4. **Compare Operations** - Using CP to test values without changing them
5. **Smart Programming** - Building responsive programs that adapt to conditions

## Looking Ahead

Next, you'll learn about Z80 arithmetic operations - how to perform mathematical calculations and manipulate numbers with precision. You'll discover how arithmetic operations interact with the status flags you've just learned!

## Fun Fact

The Z80's status flags were designed to make assembly programming more intuitive and powerful. The ability to test conditions with simple mnemonic instructions like JR Z (Jump if Zero) and JR C (Jump if Carry) made the Z80 much easier to program than many other processors of its era. This user-friendly design was one of the key factors that made the Z80 so popular with both professional developers and hobbyists, contributing to its use in everything from the ZX Spectrum to arcade games and industrial controllers!