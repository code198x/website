---
title: "Z80 Arithmetic Operations"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 5
description: "Learn Z80 arithmetic instructions for addition, subtraction, and mathematical operations. Learn how arithmetic affects status flags and build mathematical programs."
learning_objectives:
  - "Learn Z80 addition instructions (ADD, ADC)"
  - "Learn Z80 subtraction instructions (SUB, SBC)"
  - "Understand how arithmetic affects status flags"
  - "Practice 8-bit and 16-bit arithmetic operations"
  - "Build programs that perform mathematical calculations"
concepts:
  - "ADD and ADC (Add with Carry) instructions"
  - "SUB and SBC (Subtract with Carry) instructions"
  - "16-bit arithmetic with register pairs"
  - "Arithmetic status flag effects"
  - "Mathematical programming techniques"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 5
---

# Lesson 5: Z80 Arithmetic Operations

Now that you understand status flags, let's explore how the Z80 performs mathematical calculations. The Z80's arithmetic instructions are powerful and flexible, making it excellent for mathematical programming!

## Z80 Addition Instructions

The Z80 has two main addition instructions:

### ADD - Simple Addition
**Format**: `ADD A, operand`
**Function**: A = A + operand

```text
LD A, 10            ; A = 10
ADD A, 5            ; A = A + 5 = 15
```

### ADC - Add with Carry
**Format**: `ADC A, operand` 
**Function**: A = A + operand + carry flag

```text
LD A, 255           ; A = 255
ADD A, 1            ; A = 0, carry flag SET
LD B, 10            ; B = 10
ADC A, B            ; A = 0 + 10 + 1 (carry) = 11
```

ADC is essential for multi-byte arithmetic!

**Z80 Addition Operations:**

```assembly
; Demonstration of Z80 addition instructions
; This program shows ADD and ADC in action

AdditionDemo:
    ; === BASIC ADDITION ===
    LD A, 25            ; Start with 25
    ADD A, 30           ; Add 30: A = 55
    LD ($4000), A       ; Display result on screen
    
    ; === ADDITION WITH DIFFERENT OPERAND TYPES ===
    LD A, 10            ; Start fresh
    ADD A, 15           ; Add immediate value: A = 25
    LD B, 20            ; Load 20 into B
    ADD A, B            ; Add register: A = 45
    LD ($4001), A       ; Display result
    
    ; === ADDITION CAUSING CARRY ===
    LD A, 200           ; Large number
    ADD A, 100          ; Add 100: 200 + 100 = 300, but max is 255!
    ; Result: A = 44 (300 - 256), Carry flag SET
    LD ($4002), A       ; Display wrapped result
    
    ; === ADD WITH CARRY (ADC) ===
    ; Continuing from previous carry
    LD B, 10            ; Load 10 into B
    ADC A, B            ; A = 44 + 10 + 1 (previous carry) = 55
    LD ($4003), A       ; Display result
    
    ; === 16-BIT ADDITION ===
    ; Adding register pairs
    LD HL, 1000         ; HL = 1000
    LD DE, 2000         ; DE = 2000  
    ADD HL, DE          ; HL = HL + DE = 3000
    ; Store 16-bit result in memory (low byte first)
    LD A, L             ; Get low byte
    LD ($4004), A       ; Store low byte
    LD A, H             ; Get high byte
    LD ($4005), A       ; Store high byte
    
    ; === MEMORY ADDITION ===
    ; Adding value from memory
    LD A, 50            ; Start with 50
    LD (TempValue), A   ; Store in memory
    LD A, 25            ; New value
    ADD A, (TempValue)  ; Add value from memory: A = 75
    LD ($4006), A       ; Display result
    
    RET

; Memory location for temporary storage
TempValue: DB 0
```

## Z80 Subtraction Instructions

The Z80 also has two subtraction instructions:

### SUB - Simple Subtraction
**Format**: `SUB operand`
**Function**: A = A - operand

```text
LD A, 20            ; A = 20
SUB 5               ; A = A - 5 = 15
```

### SBC - Subtract with Carry (Borrow)
**Format**: `SBC A, operand`
**Function**: A = A - operand - carry flag

```text
LD A, 10            ; A = 10
SUB 15              ; A = -5 (251 in unsigned), carry flag SET
LD B, 5             ; B = 5
SBC A, B            ; A = 251 - 5 - 1 (carry) = 245
```

**Z80 Subtraction Operations:**

```assembly
; Demonstration of Z80 subtraction instructions
; This program shows SUB and SBC in action

SubtractionDemo:
    ; === BASIC SUBTRACTION ===
    LD A, 50            ; Start with 50
    SUB 20              ; Subtract 20: A = 30
    LD ($4000), A       ; Display result
    
    ; === SUBTRACTION WITH DIFFERENT OPERAND TYPES ===
    LD A, 100           ; Start with 100
    SUB 25              ; Subtract immediate: A = 75
    LD B, 15            ; Load 15 into B
    SUB B               ; Subtract register: A = 60
    LD ($4001), A       ; Display result
    
    ; === SUBTRACTION CAUSING BORROW ===
    LD A, 10            ; Small number
    SUB 20              ; Subtract larger number: 10 - 20 = -10
    ; Result: A = 246 (256 - 10), Carry flag SET (indicates borrow)
    LD ($4002), A       ; Display wrapped result
    
    ; === SUBTRACT WITH CARRY (SBC) ===
    ; Continuing from previous borrow
    LD B, 5             ; Load 5 into B
    SBC A, B            ; A = 246 - 5 - 1 (previous carry) = 240
    LD ($4003), A       ; Display result
    
    ; === 16-BIT SUBTRACTION ===
    ; Subtracting register pairs
    LD HL, 3000         ; HL = 3000
    LD DE, 1000         ; DE = 1000
    OR A                ; Clear carry flag
    SBC HL, DE          ; HL = HL - DE = 2000
    ; Store 16-bit result
    LD A, L             ; Get low byte
    LD ($4004), A       ; Store low byte
    LD A, H             ; Get high byte  
    LD ($4005), A       ; Store high byte
    
    ; === COMPARISON USING SUBTRACTION ===
    ; CP instruction is actually SUB without storing result
    LD A, 42            ; Test value
    CP 42               ; Compare with itself (A - 42)
    JR Z, ValuesEqual   ; Jump if equal (result was 0)
    LD B, $4E           ; 'N' for Not equal
    JR ComparisonDone
    
ValuesEqual:
    LD B, $45           ; 'E' for Equal
    
ComparisonDone:
    LD ($4006), B       ; Display comparison result
    
    RET
```

## Understanding Arithmetic Flags

Arithmetic operations affect status flags in predictable ways:

### Zero Flag (Z)
- **Set** when result equals zero
- **Clear** when result is non-zero

### Carry Flag (C) 
- **Addition**: Set when result > 255 (overflow)
- **Subtraction**: Set when result < 0 (underflow/borrow)

### Sign Flag (S)
- **Set** when bit 7 of result is 1 (negative in signed arithmetic)
- **Clear** when bit 7 of result is 0 (positive in signed arithmetic)

### Parity/Overflow Flag (P/V)
- **Set** when signed arithmetic overflow occurs
- **Clear** when no signed overflow

**Arithmetic Flags Demonstration:**

```assembly
; Understanding how arithmetic affects status flags
; This program demonstrates flag behavior with arithmetic

ArithmeticFlagsDemo:
    ; === ZERO FLAG EXAMPLES ===
    LD A, 15            ; Start with 15
    SUB 15              ; Subtract same value: A = 0, Zero flag SET
    JR Z, ResultIsZero  ; This jump will be taken
    LD B, $4E           ; 'N' for No (won't execute)
    JR ZeroFlagDone
ResultIsZero:
    LD B, $5A           ; 'Z' for Zero
ZeroFlagDone:
    LD ($4000), B       ; Display zero flag test
    
    ; === CARRY FLAG EXAMPLES ===
    ; Addition overflow
    LD A, 200           ; Large number
    ADD A, 100          ; 200 + 100 = 300 (> 255)
    JR C, AddOverflow   ; Jump if carry set
    LD C, $4E           ; 'N' for No carry
    JR CarryFlagDone
AddOverflow:
    LD C, $43           ; 'C' for Carry
CarryFlagDone:
    LD ($4001), C       ; Display carry test
    
    ; Subtraction underflow
    LD A, 10            ; Small number
    SUB 20              ; 10 - 20 = -10 (< 0)
    JR C, SubUnderflow  ; Jump if carry set (borrow occurred)
    LD D, $4E           ; 'N' for No borrow
    JR BorrowFlagDone
SubUnderflow:
    LD D, $42           ; 'B' for Borrow
BorrowFlagDone:
    LD ($4002), D       ; Display borrow test
    
    ; === SIGN FLAG EXAMPLES ===
    LD A, 100           ; Positive number
    ADD A, 200          ; 100 + 200 = 300, but wraps to 44
    OR A                ; Test result (sets flags)
    JR M, ResultNegative ; Jump if minus (bit 7 = 1)
    LD E, $50           ; 'P' for Positive
    JR SignFlagDone
ResultNegative:
    LD E, $4E           ; 'N' for Negative
SignFlagDone:
    LD ($4003), E       ; Display sign test
    
    ; === SIGNED vs UNSIGNED ARITHMETIC ===
    ; Same operation, different interpretation
    LD A, $80           ; 128 unsigned, -128 signed
    ADD A, $80          ; Add 128: result = 0
    ; Carry flag SET (unsigned overflow: 128 + 128 = 256)
    ; Overflow flag SET (signed overflow: -128 + (-128) = -256)
    
    JR C, UnsignedOverflow
    LD H, $4E           ; 'N' for No unsigned overflow
    JR OverflowDone
UnsignedOverflow:
    LD H, $55           ; 'U' for Unsigned overflow
OverflowDone:
    LD ($4004), H       ; Display unsigned overflow test
    
    RET
```

## 16-Bit Arithmetic

The Z80 can perform arithmetic on 16-bit register pairs:

### 16-Bit Addition
```text
LD HL, 1000         ; HL = 1000
LD DE, 2000         ; DE = 2000
ADD HL, DE          ; HL = HL + DE = 3000
```

### 16-Bit Subtraction
```text
LD HL, 3000         ; HL = 3000
LD DE, 1000         ; DE = 1000
OR A                ; Clear carry flag
SBC HL, DE          ; HL = HL - DE = 2000
```

**16-Bit Arithmetic:**

```assembly
; Demonstration of 16-bit arithmetic operations
; Working with larger numbers using register pairs

SixteenBitArithmetic:
    ; === 16-BIT ADDITION ===
    ; Add large numbers that won't fit in 8 bits
    LD HL, 12345        ; First large number
    LD DE, 23456        ; Second large number
    ADD HL, DE          ; HL = 12345 + 23456 = 35801
    
    ; Display the 16-bit result
    LD A, H             ; Get high byte
    LD ($4000), A       ; Display high byte
    LD A, L             ; Get low byte
    LD ($4001), A       ; Display low byte
    
    ; === 16-BIT SUBTRACTION ===
    LD HL, 50000        ; Large number
    LD DE, 20000        ; Subtract this
    OR A                ; Clear carry flag (important!)
    SBC HL, DE          ; HL = 50000 - 20000 = 30000
    
    ; Display the result
    LD A, H             ; Get high byte
    LD ($4002), A       ; Display high byte
    LD A, L             ; Get low byte
    LD ($4003), A       ; Display low byte
    
    ; === MULTI-BYTE ADDITION (24-bit example) ===
    ; Adding three-byte numbers
    LD HL, NumberA      ; Point to first number
    LD DE, NumberB      ; Point to second number
    LD IX, Result       ; Point to result storage
    
    ; Add low bytes
    LD A, (HL)          ; Get low byte of A
    ADD A, (DE)         ; Add low byte of B
    LD (IX), A          ; Store result low byte
    
    ; Add middle bytes with carry
    INC HL              ; Point to middle byte of A
    INC DE              ; Point to middle byte of B
    INC IX              ; Point to result middle byte
    LD A, (HL)          ; Get middle byte of A
    ADC A, (DE)         ; Add middle byte of B + carry
    LD (IX), A          ; Store result middle byte
    
    ; Add high bytes with carry
    INC HL              ; Point to high byte of A
    INC DE              ; Point to high byte of B
    INC IX              ; Point to result high byte
    LD A, (HL)          ; Get high byte of A
    ADC A, (DE)         ; Add high byte of B + carry
    LD (IX), A          ; Store result high byte
    
    ; Display 24-bit result
    LD A, (Result+2)    ; High byte
    LD ($4010), A
    LD A, (Result+1)    ; Middle byte
    LD ($4011), A
    LD A, (Result)      ; Low byte
    LD ($4012), A
    
    ; === 16-BIT COMPARISON ===
    ; Compare two 16-bit numbers
    LD HL, 1000         ; First number
    LD DE, 2000         ; Second number
    OR A                ; Clear carry
    SBC HL, DE          ; HL - DE (sets flags)
    ADD HL, DE          ; Restore HL (HL = HL + DE)
    
    JR Z, NumbersEqual  ; Jump if they were equal
    JR C, FirstSmaller  ; Jump if first < second
    ; First number is larger
    LD A, $47           ; 'G' for Greater
    JR CompareResult
FirstSmaller:
    LD A, $4C           ; 'L' for Less
    JR CompareResult
NumbersEqual:
    LD A, $45           ; 'E' for Equal
CompareResult:
    LD ($4020), A       ; Display comparison result
    
    RET

; Data for multi-byte arithmetic
NumberA:    DB $34, $12, $05    ; 24-bit number: $051234
NumberB:    DB $78, $56, $03    ; 24-bit number: $035678
Result:     DB $00, $00, $00    ; Space for 24-bit result
```

## Practical Mathematical Programs

Let's build some useful mathematical routines:

### Multiplication by Repeated Addition
```text
; Multiply A by B, result in HL
Multiply:
    LD HL, 0            ; Clear result
    OR B                ; Test if B = 0
    RET Z               ; Return if B = 0
MultiplyLoop:
    ADD HL, A           ; Add A to result
    DEC B               ; Decrement counter
    JR NZ, MultiplyLoop ; Continue until B = 0
    RET
```

### Division by Repeated Subtraction
```text
; Divide A by B, quotient in C, remainder in A
Divide:
    LD C, 0             ; Clear quotient
DivideLoop:
    CP B                ; Compare A with B
    RET C               ; Return if A < B (remainder in A)
    SUB B               ; Subtract B from A
    INC C               ; Increment quotient
    JR DivideLoop       ; Continue
```

**Mathematical Programs:**

```assembly
; Practical mathematical routines using Z80 arithmetic
; This program implements multiplication and division

MathPrograms:
    ; === MULTIPLICATION EXAMPLE ===
    ; Multiply 12 × 15 using repeated addition
    LD A, 12            ; First number
    LD B, 15            ; Second number
    CALL Multiply8Bit   ; Call multiplication routine
    ; Result is in A (low byte) and B (overflow)
    LD ($4000), A       ; Display low byte of result
    LD ($4001), B       ; Display high byte of result
    
    ; === DIVISION EXAMPLE ===
    ; Divide 100 ÷ 7 using repeated subtraction
    LD A, 100           ; Dividend
    LD B, 7             ; Divisor
    CALL Divide8Bit     ; Call division routine
    ; Quotient in C, remainder in A
    LD ($4002), C       ; Display quotient
    LD ($4003), A       ; Display remainder
    
    ; === SQUARE CALCULATION ===
    ; Calculate 13² (13 squared)
    LD A, 13            ; Number to square
    LD B, A             ; Copy for multiplication
    CALL Multiply8Bit   ; A × B = A²
    LD ($4004), A       ; Display low byte
    LD ($4005), B       ; Display high byte
    
    ; === AVERAGE CALCULATION ===
    ; Calculate average of three numbers: 20, 30, 40
    LD A, 20            ; First number
    ADD A, 30           ; Add second number: A = 50
    ADD A, 40           ; Add third number: A = 90
    LD B, 3             ; Number of values
    CALL Divide8Bit     ; Divide sum by count
    LD ($4006), C       ; Display average (quotient)
    
    RET

; Multiply two 8-bit numbers: A × B
; Input: A = multiplicand, B = multiplier
; Output: A = low byte of result, B = high byte of result
Multiply8Bit:
    LD C, A             ; Save multiplicand
    LD A, 0             ; Clear low byte of result
    LD D, 0             ; Clear high byte of result
    
    ; Check for zero multiplier
    OR B
    RET Z               ; Return 0 if B = 0
    
MultiplyLoop:
    ADD A, C            ; Add multiplicand to result
    JR NC, NoOverflow   ; Jump if no carry
    INC D               ; Increment high byte if carry
NoOverflow:
    DEC B               ; Decrement multiplier
    JR NZ, MultiplyLoop ; Continue if not zero
    
    LD B, D             ; Put high byte in B
    RET                 ; A = low byte, B = high byte

; Divide 8-bit number: A ÷ B
; Input: A = dividend, B = divisor
; Output: C = quotient, A = remainder
Divide8Bit:
    LD C, 0             ; Clear quotient
    
    ; Check for zero divisor
    OR B
    RET Z               ; Return if dividing by zero
    
DivideLoop:
    CP B                ; Compare dividend with divisor
    RET C               ; Return if dividend < divisor
    SUB B               ; Subtract divisor from dividend
    INC C               ; Increment quotient
    JR DivideLoop       ; Continue division
    
; === ADVANCED: 16-BIT MULTIPLICATION ===
; Multiply two 8-bit numbers with 16-bit result
; Input: A = multiplicand, B = multiplier
; Output: HL = 16-bit result
Multiply16Bit:
    LD HL, 0            ; Clear 16-bit result
    LD C, A             ; Save multiplicand
    
    ; Check for zero
    OR B
    RET Z
    
Multiply16Loop:
    ADD HL, BC          ; Add multiplicand to result (HL = HL + BC)
    DEC B               ; Decrement multiplier
    JR NZ, Multiply16Loop ; Continue until B = 0
    RET
```

## Binary-Coded Decimal (BCD) Arithmetic

The Z80 supports BCD arithmetic for working with decimal numbers:

### DAA - Decimal Adjust Accumulator
After BCD addition or subtraction, use DAA to correct the result:

```text
LD A, $09           ; BCD 9
ADD A, $08          ; Add BCD 8: result = $11 (not BCD!)
DAA                 ; Adjust to BCD: result = $17 (BCD 17)
```

**BCD Arithmetic Example:**

```assembly
; Binary-Coded Decimal arithmetic demonstration
; Working with decimal numbers in BCD format

BCDArithmetic:
    ; === BCD ADDITION ===
    ; Add 29 + 47 in BCD format
    LD A, $29           ; BCD 29 (2 tens, 9 units)
    ADD A, $47          ; Add BCD 47 (4 tens, 7 units)
    DAA                 ; Decimal adjust: result = $76 (BCD 76)
    LD ($4000), A       ; Display BCD result
    
    ; === BCD SUBTRACTION ===
    ; Subtract 25 from 83 in BCD format
    LD A, $83           ; BCD 83
    SUB $25             ; Subtract BCD 25
    DAA                 ; Decimal adjust: result = $58 (BCD 58)
    LD ($4001), A       ; Display BCD result
    
    ; === BCD COMPARISON ===
    ; Compare BCD numbers
    LD A, $45           ; BCD 45
    CP $67              ; Compare with BCD 67
    JR C, FirstSmaller  ; Jump if 45 < 67
    LD B, $47           ; 'G' for Greater
    JR BCDCompDone
FirstSmaller:
    LD B, $4C           ; 'L' for Less
BCDCompDone:
    LD ($4002), B       ; Display comparison
    
    ; === BCD COUNTER ===
    ; Count from 0 to 99 in BCD, display every 10th
    LD A, $00           ; Start at BCD 00
    LD HL, $4010        ; Screen position for display
    
BCDCountLoop:
    ; Check if multiple of 10 (units digit = 0)
    LD B, A             ; Save current value
    AND $0F             ; Mask units digit
    JR NZ, NotTen       ; Skip if not multiple of 10
    
    ; Display this BCD value
    LD (HL), B          ; Display the BCD number
    INC HL              ; Next display position
    
NotTen:
    LD A, B             ; Restore current value
    ADD A, $01          ; Add BCD 1
    DAA                 ; Decimal adjust
    CP $99              ; Check if reached 99
    JR NZ, BCDCountLoop ; Continue if not 99
    
    ; Display final 99
    LD (HL), A
    
    RET
```

## What You've Learned

In this lesson, you've learned:

1. **Z80 Addition** - ADD and ADC instructions for 8-bit and 16-bit arithmetic
2. **Z80 Subtraction** - SUB and SBC instructions with proper flag handling
3. **Arithmetic Flags** - How arithmetic operations affect status flags
4. **16-Bit Operations** - Working with larger numbers using register pairs
5. **Practical Mathematics** - Building multiplication, division, and BCD routines

## Looking Ahead

Next, you'll learn about Z80 increment, decrement, and bit operations - the fine-grained manipulations that make the Z80 so powerful for detailed data processing and control operations!

## Fun Fact

The Z80's arithmetic capabilities were quite advanced for an 8-bit processor. The inclusion of 16-bit arithmetic instructions (like ADD HL, DE) made it much more efficient for mathematical programming than many competing processors. The ADC and SBC instructions with automatic carry/borrow handling made multi-precision arithmetic straightforward, which was crucial for applications requiring precise calculations. Many early computer games, scientific calculators, and business applications relied on these capabilities to perform complex mathematics efficiently!