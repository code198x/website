---
title: "68000 Arithmetic Operations"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 5
description: "Explore the 68000's comprehensive arithmetic capabilities. Learn addition, subtraction, multiplication, and division operations with support for multiple data sizes."
learning_objectives:
  - "Learn 68000 addition and subtraction instructions"
  - "Understand multiplication and division operations"
  - "Practice multi-precision arithmetic techniques"
  - "Explore arithmetic with different data sizes"
  - "Build mathematical programs using 68000 capabilities"
concepts:
  - "ADD, SUB, and extended arithmetic (ADDX, SUBX)"
  - "Multiplication (MULU, MULS) and division (DIVU, DIVS)"
  - "Multi-precision arithmetic using extend flag"
  - "Quick arithmetic operations (ADDQ, SUBQ)"
  - "Arithmetic with byte, word, and long operands"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 5
---

# Lesson 5: 68000 Arithmetic Operations

The 68000's arithmetic capabilities are far superior to 8-bit processors, offering native multiplication and division, multi-precision arithmetic, and sophisticated operand handling. Today you'll discover how these powerful arithmetic features make mathematical programming much easier on the Amiga!

## Basic Arithmetic Operations

The 68000 provides comprehensive arithmetic instructions:

### Addition Instructions
- **ADD**: Add operand to destination
- **ADDA**: Add to address register
- **ADDI**: Add immediate value
- **ADDQ**: Add quick (1-8 immediate)
- **ADDX**: Add with extend (for multi-precision)

### Subtraction Instructions
- **SUB**: Subtract operand from destination
- **SUBA**: Subtract from address register
- **SUBI**: Subtract immediate value
- **SUBQ**: Subtract quick (1-8 immediate)
- **SUBX**: Subtract with extend (for multi-precision)

<CodeRunner 
  system="commodore-amiga"
  title="Basic Arithmetic Operations"
  code="; Demonstration of 68000 basic arithmetic operations
; Shows addition and subtraction with different operand types

BasicArithmeticDemo:
    ; === BASIC ADDITION ===
    ; ADD instruction with various operand combinations
    
    MOVE.L  #100, D0            ; Load first operand
    MOVE.L  #250, D1            ; Load second operand
    ADD.L   D1, D0              ; Add D1 to D0 (D0 = 350)
    MOVE.L  D0, AddResult1      ; Store result
    
    ; Add immediate value
    MOVE.L  #500, D2            ; Load base value
    ADD.L   #150, D2            ; Add immediate (D2 = 650)
    MOVE.L  D2, AddResult2      ; Store result
    
    ; Add memory operand
    MOVE.L  #75, D3             ; Load value
    ADD.L   MemValue1, D3       ; Add memory value (D3 = 75 + 42 = 117)
    MOVE.L  D3, AddResult3      ; Store result
    
    ; === QUICK ARITHMETIC ===
    ; ADDQ/SUBQ for small immediate values (1-8)
    
    MOVE.L  #1000, D4           ; Load base value
    ADDQ.L  #5, D4              ; Add 5 quickly (D4 = 1005)
    SUBQ.L  #3, D4              ; Subtract 3 quickly (D4 = 1002)
    MOVE.L  D4, QuickResult     ; Store result
    
    ; === DIFFERENT DATA SIZES ===
    ; Arithmetic with byte, word, and long operands
    
    ; Byte arithmetic
    MOVE.B  #200, D5            ; Load byte value
    ADD.B   #100, D5            ; Add byte (result wraps: 300 -> 44)
    MOVE.B  D5, ByteResult      ; Store byte result
    
    ; Word arithmetic  
    MOVE.W  #30000, D6          ; Load word value
    ADD.W   #40000, D6          ; Add word (result wraps: 70000 -> 4464)
    MOVE.W  D6, WordResult      ; Store word result
    
    ; Long arithmetic (no wrapping for these values)
    MOVE.L  #2000000, D7        ; Load long value
    ADD.L   #1500000, D7        ; Add long (D7 = 3500000)
    MOVE.L  D7, LongResult      ; Store long result
    
    ; === BASIC SUBTRACTION ===
    ; SUB instruction with various operand combinations
    
    MOVE.L  #500, D0            ; Load first operand
    MOVE.L  #150, D1            ; Load second operand
    SUB.L   D1, D0              ; Subtract D1 from D0 (D0 = 350)
    MOVE.L  D0, SubResult1      ; Store result
    
    ; Subtract immediate value
    MOVE.L  #1000, D2           ; Load base value
    SUB.L   #300, D2            ; Subtract immediate (D2 = 700)
    MOVE.L  D2, SubResult2      ; Store result
    
    ; Subtract with underflow
    MOVE.B  #50, D3             ; Load small byte value
    SUB.B   #100, D3            ; Subtract larger value (underflows to 206)
    MOVE.B  D3, SubResult3      ; Store wrapped result
    
    ; === ADDRESS REGISTER ARITHMETIC ===
    ; ADDA/SUBA for address calculations
    
    MOVE.L  #$100000, A0        ; Load base address
    ADDA.L  #$1000, A0          ; Add offset (A0 = $101000)
    MOVE.L  A0, AddrResult1     ; Store address result
    
    SUBA.L  #$500, A0           ; Subtract from address (A0 = $100B00)
    MOVE.L  A0, AddrResult2     ; Store address result
    
    ; === CONDITION CODE EFFECTS ===
    ; Show how arithmetic affects flags
    
    MOVE.L  #0, D0              ; Load zero
    SUB.L   #1, D0              ; Subtract 1 (sets carry, negative flags)
    ; Carry flag SET (borrow occurred)
    ; Negative flag SET (result is negative)
    ; Zero flag CLEAR (result is not zero)
    
    MOVE.L  #$7FFFFFFF, D1      ; Load maximum positive signed value
    ADD.L   #1, D1              ; Add 1 (causes signed overflow)
    ; Overflow flag SET (positive + positive = negative)
    ; Negative flag SET (result appears negative)
    ; Carry flag CLEAR (no unsigned overflow)
    
    ; === MEMORY OPERAND ARITHMETIC ===
    ; Arithmetic with memory operands
    
    MOVE.L  #$200000, A1        ; Memory address
    MOVE.L  #500, (A1)          ; Store value in memory
    ADD.L   #250, (A1)          ; Add directly to memory (memory = 750)
    MOVE.L  (A1), MemResult1    ; Load result
    
    SUB.L   #100, (A1)          ; Subtract from memory (memory = 650)
    MOVE.L  (A1), MemResult2    ; Load result
    
    RTS

; Data values
MemValue1:      DC.L    42
AddResult1:     DC.L    0
AddResult2:     DC.L    0
AddResult3:     DC.L    0
QuickResult:    DC.L    0
ByteResult:     DC.B    0
WordResult:     DC.W    0
LongResult:     DC.L    0
SubResult1:     DC.L    0
SubResult2:     DC.L    0
SubResult3:     DC.B    0
AddrResult1:    DC.L    0
AddrResult2:    DC.L    0
MemResult1:     DC.L    0
MemResult2:     DC.L    0"
  language="assembly"
/>

## Multiplication and Division

The 68000 includes native multiplication and division instructions - a major advantage over 8-bit processors:

### Multiplication Instructions
- **MULU**: Unsigned multiply (16×16=32 result)
- **MULS**: Signed multiply (16×16=32 result)

### Division Instructions
- **DIVU**: Unsigned divide (32÷16=16 quotient, 16 remainder)
- **DIVS**: Signed divide (32÷16=16 quotient, 16 remainder)

### Key Features
- Hardware multiplication and division
- Automatic overflow detection
- Efficient single-instruction operation

<CodeRunner 
  system="commodore-amiga"
  title="Multiplication and Division"
  code="; Demonstration of 68000 multiplication and division
; Shows native hardware multiply and divide operations

MultiplyDivideDemo:
    ; === UNSIGNED MULTIPLICATION ===
    ; MULU performs 16-bit × 16-bit = 32-bit unsigned multiply
    
    MOVE.W  #200, D0            ; Load first factor (16-bit)
    MULU.W  #150, D0            ; Multiply by second factor
    ; Result: D0 = 30000 (32-bit result in D0)
    MOVE.L  D0, MulResult1      ; Store result
    
    ; Multiply with register operand
    MOVE.W  #500, D1            ; Load first factor
    MOVE.W  #40, D2             ; Load second factor
    MULU.W  D2, D1              ; Multiply D1 by D2
    ; Result: D1 = 20000 (32-bit result)
    MOVE.L  D1, MulResult2      ; Store result
    
    ; === SIGNED MULTIPLICATION ===
    ; MULS handles signed 16-bit multiplication
    
    MOVE.W  #-100, D3           ; Load negative factor
    MULS.W  #50, D3             ; Multiply by positive factor
    ; Result: D3 = -5000 (signed result)
    MOVE.L  D3, MulResult3      ; Store result
    
    ; Multiply two negative numbers
    MOVE.W  #-25, D4            ; Load first negative factor
    MOVE.W  #-80, D5            ; Load second negative factor
    MULS.W  D5, D4              ; Multiply negatives
    ; Result: D4 = 2000 (negative × negative = positive)
    MOVE.L  D4, MulResult4      ; Store result
    
    ; === UNSIGNED DIVISION ===
    ; DIVU performs 32-bit ÷ 16-bit = 16-bit quotient + 16-bit remainder
    
    MOVE.L  #100000, D6         ; Load 32-bit dividend
    DIVU.W  #300, D6            ; Divide by 16-bit divisor
    ; Result: D6 = quotient in low word, remainder in high word
    ; 100000 ÷ 300 = 333 remainder 100
    MOVE.W  D6, DivQuotient1    ; Store quotient (low word)
    SWAP    D6                  ; Swap words to access remainder
    MOVE.W  D6, DivRemainder1   ; Store remainder (high word)
    
    ; === SIGNED DIVISION ===
    ; DIVS handles signed division
    
    MOVE.L  #-50000, D7         ; Load negative dividend
    DIVS.W  #200, D7            ; Divide by positive divisor
    ; Result: -50000 ÷ 200 = -250 remainder 0
    MOVE.W  D7, DivQuotient2    ; Store quotient
    SWAP    D7                  ; Access remainder
    MOVE.W  D7, DivRemainder2   ; Store remainder
    
    ; === DIVISION BY ZERO HANDLING ===
    ; Division by zero causes a trap (exception)
    ; In real code, always check divisor before dividing
    
    MOVE.L  #1000, D0           ; Load dividend
    MOVE.W  TestDivisor, D1     ; Load divisor to test
    TST.W   D1                  ; Test if divisor is zero
    BEQ     DivisionByZero      ; Branch if zero
    
    ; Safe to divide
    DIVU.W  D1, D0              ; Perform division
    MOVE.W  D0, SafeDivResult   ; Store result
    BRA     LargeMultiply
    
DivisionByZero:
    MOVE.W  #$FFFF, SafeDivResult ; Error indicator
    
LargeMultiply:
    ; === LARGE NUMBER MULTIPLICATION ===
    ; Multiply large numbers that approach 16-bit limits
    
    MOVE.W  #65000, D0          ; Large 16-bit value
    MULU.W  #1000, D0           ; Multiply by 1000
    ; Result: 65,000,000 (32-bit result)
    MOVE.L  D0, LargeMulResult  ; Store result
    
    ; === EFFICIENT POWER-OF-2 OPERATIONS ===
    ; Compare multiplication/division with bit shifting
    
    ; Multiply by 8 using multiplication
    MOVE.W  #1000, D1           ; Load value
    MULU.W  #8, D1              ; Multiply by 8
    MOVE.L  D1, MulBy8Result    ; Store result
    
    ; Multiply by 8 using bit shifting (faster)
    MOVE.L  #1000, D2           ; Load value as long
    LSL.L   #3, D2              ; Shift left 3 positions (× 8)
    MOVE.L  D2, ShiftBy8Result  ; Store result
    
    ; Divide by 16 using division
    MOVE.L  #16000, D3          ; Load value
    DIVU.W  #16, D3             ; Divide by 16
    MOVE.W  D3, DivBy16Result   ; Store quotient
    
    ; Divide by 16 using bit shifting (faster)
    MOVE.L  #16000, D4          ; Load value
    LSR.L   #4, D4              ; Shift right 4 positions (÷ 16)
    MOVE.L  D4, ShiftDiv16Result ; Store result
    
    ; === PRACTICAL EXAMPLES ===
    ; Real-world arithmetic calculations
    
    ; Calculate area of rectangle
    MOVE.W  RectWidth, D0       ; Load width
    MULU.W  RectHeight, D0      ; Multiply by height
    MOVE.L  D0, RectArea        ; Store area
    
    ; Calculate average of three numbers
    MOVE.W  #150, D1            ; First number
    ADD.W   #200, D1            ; Add second number
    ADD.W   #100, D1            ; Add third number (total = 450)
    DIVU.W  #3, D1              ; Divide by 3
    MOVE.W  D1, Average         ; Store average (150)
    
    ; Calculate percentage
    MOVE.W  #75, D2             ; Score achieved
    MULU.W  #100, D2            ; Multiply by 100
    DIVU.W  #90, D2             ; Divide by maximum score
    MOVE.W  D2, Percentage      ; Store percentage (83%)
    
    ; === OVERFLOW DETECTION ===
    ; Check for multiplication overflow
    
    MOVE.W  #60000, D3          ; Large value
    MULU.W  #2000, D3           ; Large multiplication
    ; Check if result exceeds 32-bit signed range
    CMP.L   #$7FFFFFFF, D3      ; Compare with max signed long
    BLS     NoOverflow          ; Branch if no overflow
    
    ; Handle overflow
    MOVE.L  #$7FFFFFFF, D3      ; Clamp to maximum
    MOVE.B  #1, OverflowFlag    ; Set overflow indicator
    BRA     OverflowDone
    
NoOverflow:
    MOVE.B  #0, OverflowFlag    ; Clear overflow indicator
    
OverflowDone:
    MOVE.L  D3, OverflowResult  ; Store result
    
    RTS

; Test data
TestDivisor:        DC.W    25      ; Non-zero divisor for testing
RectWidth:          DC.W    30
RectHeight:         DC.W    20

; Results storage
MulResult1:         DC.L    0
MulResult2:         DC.L    0
MulResult3:         DC.L    0
MulResult4:         DC.L    0
DivQuotient1:       DC.W    0
DivRemainder1:      DC.W    0
DivQuotient2:       DC.W    0
DivRemainder2:      DC.W    0
SafeDivResult:      DC.W    0
LargeMulResult:     DC.L    0
MulBy8Result:       DC.L    0
ShiftBy8Result:     DC.L    0
DivBy16Result:      DC.W    0
ShiftDiv16Result:   DC.L    0
RectArea:           DC.L    0
Average:            DC.W    0
Percentage:         DC.W    0
OverflowResult:     DC.L    0
OverflowFlag:       DC.B    0"
  language="assembly"
/>

## Multi-Precision Arithmetic

The 68000's extend flag enables elegant multi-precision arithmetic for numbers larger than 32 bits:

### Extended Arithmetic Instructions
- **ADDX**: Add with extend flag
- **SUBX**: Subtract with extend flag
- **NEGX**: Negate with extend

### Multi-Precision Principles
- Extend flag preserves carry between operations
- Process from least significant to most significant
- Natural for implementing arbitrary precision arithmetic

<CodeRunner 
  system="commodore-amiga"
  title="Multi-Precision Arithmetic"
  code="; Demonstration of 68000 multi-precision arithmetic
; Shows how to work with numbers larger than 32 bits

MultiPrecisionDemo:
    ; === 64-BIT ADDITION ===
    ; Add two 64-bit numbers using ADDX
    
    ; First 64-bit number: $123456789ABCDEF0
    MOVE.L  #$9ABCDEF0, D0      ; Low 32 bits
    MOVE.L  #$12345678, D1      ; High 32 bits
    
    ; Second 64-bit number: $FEDCBA0987654321
    MOVE.L  #$87654321, D2      ; Low 32 bits
    MOVE.L  #$FEDCBA09, D3      ; High 32 bits
    
    ; Perform 64-bit addition
    ADD.L   D2, D0              ; Add low parts (sets carry in X)
    ADDX.L  D3, D1              ; Add high parts with extend
    
    ; Result is now in D1:D0
    MOVE.L  D0, Add64Low        ; Store low result
    MOVE.L  D1, Add64High       ; Store high result
    
    ; === 64-BIT SUBTRACTION ===
    ; Subtract two 64-bit numbers using SUBX
    
    ; First 64-bit number: $FEDCBA0987654321
    MOVE.L  #$87654321, D4      ; Low 32 bits
    MOVE.L  #$FEDCBA09, D5      ; High 32 bits
    
    ; Second 64-bit number: $123456789ABCDEF0
    MOVE.L  #$9ABCDEF0, D6      ; Low 32 bits  
    MOVE.L  #$12345678, D7      ; High 32 bits
    
    ; Perform 64-bit subtraction (first - second)
    SUB.L   D6, D4              ; Subtract low parts (sets borrow in X)
    SUBX.L  D7, D5              ; Subtract high parts with extend
    
    ; Result is now in D5:D4
    MOVE.L  D4, Sub64Low        ; Store low result
    MOVE.L  D5, Sub64High       ; Store high result
    
    ; === 96-BIT ADDITION ===
    ; Add two 96-bit numbers (3 × 32-bit words)
    
    ; First 96-bit number in memory
    MOVE.L  #$11111111, Num96A+0  ; Low word
    MOVE.L  #$22222222, Num96A+4  ; Middle word
    MOVE.L  #$33333333, Num96A+8  ; High word
    
    ; Second 96-bit number in memory
    MOVE.L  #$44444444, Num96B+0  ; Low word
    MOVE.L  #$55555555, Num96B+4  ; Middle word
    MOVE.L  #$66666666, Num96B+8  ; High word
    
    ; Perform 96-bit addition
    MOVE.L  Num96A+0, D0        ; Load first low word
    ADD.L   Num96B+0, D0        ; Add second low word
    MOVE.L  D0, Num96Result+0   ; Store result low word
    
    MOVE.L  Num96A+4, D1        ; Load first middle word
    ADDX.L  Num96B+4, D1        ; Add second middle word with extend
    MOVE.L  D1, Num96Result+4   ; Store result middle word
    
    MOVE.L  Num96A+8, D2        ; Load first high word
    ADDX.L  Num96B+8, D2        ; Add second high word with extend
    MOVE.L  D2, Num96Result+8   ; Store result high word
    
    ; === 128-BIT ADDITION USING LOOP ===
    ; Add two 128-bit numbers using a loop
    
    MOVE.L  #Num128A, A0        ; Source A address
    MOVE.L  #Num128B, A1        ; Source B address
    MOVE.L  #Num128Result, A2   ; Result address
    MOVE.L  #3, D7              ; Loop counter (4 words - 1)
    
    ; Clear extend flag for first addition
    MOVE.W  #0, CCR             ; Clear condition codes (including X)
    
Add128Loop:
    MOVE.L  (A0)+, D0           ; Load word from A
    ADDX.L  (A1)+, D0           ; Add word from B with extend
    MOVE.L  D0, (A2)+           ; Store result
    DBRA    D7, Add128Loop      ; Continue for all words
    
    ; === DECIMAL ARITHMETIC SIMULATION ===
    ; Implement BCD-like arithmetic for decimal calculations
    
    ; Add two 8-digit decimal numbers (stored as BCD-like)
    MOVE.L  #$12345678, D0      ; First decimal number
    MOVE.L  #$87654321, D1      ; Second decimal number
    
    JSR     AddBCDLike          ; Call BCD addition routine
    MOVE.L  D0, BCDResult       ; Store BCD result
    
    ; === SHIFT-BASED MULTIPLICATION ===
    ; Multiply 64-bit number by power of 2 using shifts
    
    MOVE.L  #$12345678, D0      ; 64-bit number high
    MOVE.L  #$9ABCDEF0, D1      ; 64-bit number low
    
    ; Multiply by 16 (shift left 4 positions)
    MOVE.L  #4, D2              ; Shift count
    
ShiftLoop:
    LSL.L   #1, D1              ; Shift low word left
    ROXL.L  #1, D0              ; Rotate high word left with carry
    SUBQ.L  #1, D2              ; Decrement shift count
    BNE     ShiftLoop           ; Continue shifting
    
    MOVE.L  D0, Shift64High     ; Store shifted high
    MOVE.L  D1, Shift64Low      ; Store shifted low
    
    ; === COMPARISON OF 64-BIT NUMBERS ===
    ; Compare two 64-bit numbers
    
    MOVE.L  #$80000000, D3      ; First number high
    MOVE.L  #$00000000, D4      ; First number low
    MOVE.L  #$7FFFFFFF, D5      ; Second number high
    MOVE.L  #$FFFFFFFF, D5      ; Second number low
    
    ; Compare 64-bit numbers (first vs second)
    CMP.L   D5, D3              ; Compare high words
    BNE     Compare64Done       ; Different if high words differ
    CMP.L   D6, D4              ; Compare low words if high equal
    
Compare64Done:
    ; Condition codes now reflect 64-bit comparison
    BGT     First64Greater      ; Branch if first > second
    BLT     First64Less         ; Branch if first < second
    ; If here, numbers are equal
    MOVE.B  #'E', Compare64Result
    BRA     MultiPrecisionEnd
    
First64Greater:
    MOVE.B  #'G', Compare64Result
    BRA     MultiPrecisionEnd
    
First64Less:
    MOVE.B  #'L', Compare64Result
    
MultiPrecisionEnd:
    RTS

; BCD-like addition routine
AddBCDLike:
    ; Simplified BCD addition for demonstration
    ; In real BCD, each nibble represents 0-9
    ; This is a simplified version
    
    MOVE.L  D0, D2              ; Save first number
    MOVE.L  D1, D3              ; Save second number
    
    ; Extract and add each decimal digit (simplified)
    ; For real BCD, would need to handle carry between digits
    ADD.L   D1, D0              ; Simple addition for demo
    
    ; Check for overflow in each digit position
    ; (Real BCD would adjust each nibble > 9)
    
    RTS

; Data storage for multi-precision numbers
Add64Low:           DC.L    0
Add64High:          DC.L    0
Sub64Low:           DC.L    0
Sub64High:          DC.L    0

; 96-bit numbers (3 × 32-bit words)
Num96A:             DC.L    0, 0, 0
Num96B:             DC.L    0, 0, 0
Num96Result:        DC.L    0, 0, 0

; 128-bit numbers (4 × 32-bit words)
Num128A:            DC.L    $11111111, $22222222, $33333333, $44444444
Num128B:            DC.L    $55555555, $66666666, $77777777, $88888888
Num128Result:       DC.L    0, 0, 0, 0

BCDResult:          DC.L    0
Shift64High:        DC.L    0
Shift64Low:         DC.L    0
Compare64Result:    DC.B    0"
  language="assembly"
/>

## Advanced Arithmetic Techniques

The 68000 enables sophisticated arithmetic programming patterns:

### Efficient Calculations
- Use bit shifting for powers of 2
- Combine operations for complex formulas
- Leverage addressing modes for array arithmetic

### Error Handling
- Check for division by zero
- Detect overflow conditions
- Validate input ranges

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Arithmetic Techniques"
  code="; Advanced arithmetic programming techniques
; Demonstrates sophisticated mathematical operations

AdvancedArithmeticDemo:
    ; === FIXED-POINT ARITHMETIC ===
    ; Implement fixed-point math for fractional values
    
    ; Fixed-point format: 16.16 (16 integer bits, 16 fractional bits)
    MOVE.L  #$00028000, D0      ; 2.5 in 16.16 format (2 + 0.5)
    MOVE.L  #$00034000, D1      ; 3.25 in 16.16 format (3 + 0.25)
    
    ; Add fixed-point numbers
    ADD.L   D1, D0              ; Add like regular integers
    MOVE.L  D0, FixedAddResult  ; Result: 5.75 in 16.16 format
    
    ; Multiply fixed-point numbers
    MOVE.L  #$00020000, D2      ; 2.0 in 16.16 format
    MOVE.L  #$00018000, D3      ; 1.5 in 16.16 format
    
    ; For fixed-point multiply: multiply then shift right 16
    MOVE.L  D2, D4              ; Copy first operand
    SWAP    D4                  ; Get high word (integer part)
    MULU.W  D3, D4              ; Multiply integer parts
    SWAP    D4                  ; Restore position
    
    ; Simplified fixed-point multiply (assuming small numbers)
    MULU.W  D3, D2              ; Multiply (result needs adjustment)
    LSR.L   #8, D2              ; Shift right 16 bits to adjust
    LSR.L   #8, D2              ; (done in two steps for clarity)
    MOVE.L  D2, FixedMulResult  ; Store result
    
    ; === SQUARE ROOT APPROXIMATION ===
    ; Calculate square root using Newton's method
    
    MOVE.L  #625, D0            ; Number to find square root of (√625 = 25)
    MOVE.L  #15, D1             ; Initial guess
    MOVE.L  #5, D7              ; Iteration counter
    
SqrtLoop:
    ; Newton's iteration: x = (x + n/x) / 2
    MOVE.L  D0, D2              ; Load number
    DIVU.W  D1, D2              ; Divide n by current guess
    ADD.W   D2, D1              ; Add to current guess
    LSR.W   #1, D1              ; Divide by 2
    DBRA    D7, SqrtLoop        ; Continue iterations
    
    MOVE.W  D1, SqrtResult      ; Store square root result
    
    ; === TRIGONOMETRIC APPROXIMATION ===
    ; Sine approximation using lookup table with interpolation
    
    MOVE.W  #45, D0             ; Angle in degrees (0-90)
    
    ; Scale angle to table index (0-90 -> 0-90)
    CMP.W   #90, D0             ; Check range
    BLE     AngleOK             ; Branch if in range
    MOVE.W  #90, D0             ; Clamp to maximum
    
AngleOK:
    ; Simple table lookup (every 10 degrees)
    DIVU.W  #10, D0             ; Divide by 10 for table index
    MOVE.W  D0, D1              ; Copy quotient
    AND.L   #$FFFF, D1          ; Clear high word
    SWAP    D0                  ; Get remainder
    AND.L   #$FFFF, D0          ; Clear high word
    
    ; Look up sine values
    LEA     SineTable, A0       ; Sine table address
    MOVE.W  0(A0,D1.W*2), D2    ; Get sine[index]
    MOVE.W  2(A0,D1.W*2), D3    ; Get sine[index+1]
    
    ; Simple linear interpolation
    SUB.W   D2, D3              ; Difference between values
    MULU.W  D0, D3              ; Multiply by remainder
    DIVU.W  #10, D3             ; Divide by 10 (interpolation)
    ADD.W   D3, D2              ; Add interpolated amount
    
    MOVE.W  D2, SineResult      ; Store sine result
    
    ; === POLYNOMIAL EVALUATION ===
    ; Evaluate polynomial: 3x³ + 2x² + 5x + 7
    
    MOVE.W  #4, D0              ; x value
    MOVE.W  D0, D1              ; Copy x
    
    ; Calculate x²
    MULU.W  D0, D1              ; x² = x × x
    MOVE.W  D1, D2              ; Copy x²
    
    ; Calculate x³
    MULU.W  D0, D2              ; x³ = x² × x
    
    ; Evaluate polynomial using Horner's method: ((3x + 2)x + 5)x + 7
    MOVE.W  #3, D3              ; Coefficient of x³
    MULU.W  D0, D3              ; 3x
    ADD.W   #2, D3              ; 3x + 2
    MULU.W  D0, D3              ; (3x + 2)x = 3x² + 2x
    ADD.W   #5, D3              ; 3x² + 2x + 5
    MULU.W  D0, D3              ; (3x² + 2x + 5)x = 3x³ + 2x² + 5x
    ADD.W   #7, D3              ; 3x³ + 2x² + 5x + 7
    
    MOVE.W  D3, PolyResult      ; Store polynomial result
    
    ; === GREATEST COMMON DIVISOR ===
    ; Calculate GCD using Euclidean algorithm
    
    MOVE.W  #48, D0             ; First number
    MOVE.W  #18, D1             ; Second number
    
GCDLoop:
    TST.W   D1                  ; Test if second number is zero
    BEQ     GCDDone             ; Done if zero
    
    MOVE.W  D0, D2              ; Copy first number
    DIVU.W  D1, D2              ; Divide first by second
    SWAP    D2                  ; Get remainder
    MOVE.W  D1, D0              ; Second becomes first
    MOVE.W  D2, D1              ; Remainder becomes second
    BRA     GCDLoop             ; Continue algorithm
    
GCDDone:
    MOVE.W  D0, GCDResult       ; Store GCD result
    
    ; === FIBONACCI SEQUENCE ===
    ; Calculate Fibonacci numbers
    
    MOVE.L  #0, D0              ; F(0) = 0
    MOVE.L  #1, D1              ; F(1) = 1
    MOVE.L  #10, D7             ; Calculate 10 terms
    MOVE.L  #FibArray, A0       ; Array to store results
    
    MOVE.L  D0, (A0)+           ; Store F(0)
    MOVE.L  D1, (A0)+           ; Store F(1)
    SUBQ.L  #2, D7              ; Adjust counter
    
FibLoop:
    MOVE.L  D1, D2              ; Save F(n)
    ADD.L   D0, D1              ; F(n+1) = F(n) + F(n-1)
    MOVE.L  D2, D0              ; F(n-1) = old F(n)
    MOVE.L  D1, (A0)+           ; Store F(n+1)
    DBRA    D7, FibLoop         ; Continue calculation
    
    ; === RANGE CHECKING WITH SATURATION ===
    ; Add with saturation (clamp to range)
    
    MOVE.L  #2000000000, D0     ; Large number
    MOVE.L  #500000000, D1      ; Number to add
    
    ADD.L   D1, D0              ; Add numbers
    BVC     NoSaturation        ; Branch if no overflow
    
    ; Overflow occurred - saturate to maximum
    MOVE.L  #$7FFFFFFF, D0      ; Maximum positive value
    MOVE.B  #1, SaturationFlag  ; Set saturation flag
    BRA     SaturationDone
    
NoSaturation:
    MOVE.B  #0, SaturationFlag  ; Clear saturation flag
    
SaturationDone:
    MOVE.L  D0, SaturatedResult ; Store result
    
    ; === AVERAGE WITHOUT OVERFLOW ===
    ; Calculate average of two numbers avoiding overflow
    
    MOVE.L  #$60000000, D0      ; Large number 1
    MOVE.L  #$70000000, D1      ; Large number 2
    
    ; Method: (a + b) / 2 = a/2 + b/2 + (a&1 + b&1)/2
    MOVE.L  D0, D2              ; Copy first number
    MOVE.L  D1, D3              ; Copy second number
    
    LSR.L   #1, D2              ; Divide first by 2
    LSR.L   #1, D3              ; Divide second by 2
    ADD.L   D3, D2              ; Add the halves
    
    ; Handle the remainder bits
    AND.L   #1, D0              ; Get bit 0 of first number
    AND.L   #1, D1              ; Get bit 0 of second number
    ADD.L   D1, D0              ; Add remainder bits
    LSR.L   #1, D0              ; Divide remainder sum by 2
    ADD.L   D0, D2              ; Add to main result
    
    MOVE.L  D2, AverageResult   ; Store overflow-safe average
    
    RTS

; Lookup tables and data
SineTable:          ; Sine values × 1000 for angles 0°, 10°, 20°, ..., 90°
    DC.W    0, 174, 342, 500, 643, 766, 866, 940, 985, 1000

; Results storage
FixedAddResult:     DC.L    0
FixedMulResult:     DC.L    0
SqrtResult:         DC.W    0
SineResult:         DC.W    0
PolyResult:         DC.W    0
GCDResult:          DC.W    0
FibArray:           DS.L    12      ; Space for 12 Fibonacci numbers
SaturatedResult:    DC.L    0
SaturationFlag:     DC.B    0
AverageResult:      DC.L    0"
  language="assembly"
/>

## Practice Exercise

<CodeRunner 
  system="commodore-amiga"
  title="Arithmetic Operations Practice"
  code="; Practice Exercise: Amiga Game Physics Engine
; Use arithmetic operations to implement game physics calculations

GamePhysicsEngine:
    ; Initialize physics system
    JSR     InitializePhysics
    
    ; Update object physics
    JSR     UpdateObjectPhysics
    
    ; Calculate collision responses
    JSR     CalculateCollisions
    
    ; Update particle system
    JSR     UpdateParticles
    
    ; Calculate camera tracking
    JSR     UpdateCamera
    
    RTS

InitializePhysics:
    ; Initialize physics constants and objects
    MOVE.L  #ObjectArray, A0    ; Object array
    MOVE.L  #MAX_OBJECTS-1, D7  ; Object counter
    
InitObjectLoop:
    ; Initialize object with random position and velocity
    MOVE.L  D7, D0              ; Use index for variety
    MULU.W  #37, D0             ; Multiply by prime for pseudo-random
    AND.L   #$1FF, D0           ; Mask to screen width range
    MOVE.L  D0, OBJ_X(A0)       ; Set X position
    
    MOVE.L  D7, D1              ; Use index for Y
    MULU.W  #43, D1             ; Different multiplier
    AND.L   #$FF, D1            ; Mask to screen height range
    MOVE.L  D1, OBJ_Y(A0)       ; Set Y position
    
    ; Set random velocity
    MOVE.L  D7, D2              ; Base velocity on index
    AND.L   #$F, D2             ; Mask to small range
    SUB.L   #8, D2              ; Center around zero (-8 to +7)
    MOVE.L  D2, OBJ_VEL_X(A0)   ; Set X velocity
    
    MOVE.L  D7, D3              ; Y velocity
    LSR.L   #2, D3              ; Different pattern
    AND.L   #$F, D3             ; Mask to range
    SUB.L   #8, D3              ; Center around zero
    MOVE.L  D3, OBJ_VEL_Y(A0)   ; Set Y velocity
    
    ; Set object properties
    MOVE.L  #100, OBJ_MASS(A0)  ; Set mass
    MOVE.L  #1, OBJ_ACTIVE(A0)  ; Set as active
    
    LEA     OBJ_SIZE(A0), A0    ; Move to next object
    DBRA    D7, InitObjectLoop  ; Continue for all objects
    
    RTS

UpdateObjectPhysics:
    ; Update physics for all active objects
    MOVE.L  #ObjectArray, A0    ; Object array
    MOVE.L  #MAX_OBJECTS-1, D7  ; Object counter
    
PhysicsLoop:
    ; Check if object is active
    TST.L   OBJ_ACTIVE(A0)      ; Test active flag
    BEQ     NextPhysicsObject   ; Skip if inactive
    
    ; Apply gravity to Y velocity
    MOVE.L  OBJ_VEL_Y(A0), D0   ; Load Y velocity
    ADD.L   #GRAVITY, D0        ; Add gravity constant
    
    ; Limit terminal velocity
    CMP.L   #MAX_VELOCITY, D0   ; Check maximum
    BLE     CheckMinVelocity    ; Branch if within range
    MOVE.L  #MAX_VELOCITY, D0   ; Clamp to maximum
    BRA     StoreYVelocity
    
CheckMinVelocity:
    CMP.L   #MIN_VELOCITY, D0   ; Check minimum
    BGE     StoreYVelocity      ; Branch if within range
    MOVE.L  #MIN_VELOCITY, D0   ; Clamp to minimum
    
StoreYVelocity:
    MOVE.L  D0, OBJ_VEL_Y(A0)   ; Store updated Y velocity
    
    ; Apply air resistance to X velocity
    MOVE.L  OBJ_VEL_X(A0), D1   ; Load X velocity
    
    ; Reduce velocity by friction factor
    ; velocity = velocity × (1000 - friction) / 1000
    MOVE.L  #1000, D2           ; Base factor
    SUB.L   #AIR_FRICTION, D2   ; Subtract friction
    MULS.W  D2, D1              ; Multiply velocity by factor
    DIVS.W  #1000, D1           ; Divide by 1000
    MOVE.L  D1, OBJ_VEL_X(A0)   ; Store reduced X velocity
    
    ; Update position based on velocity
    MOVE.L  OBJ_X(A0), D3       ; Load X position
    ADD.L   OBJ_VEL_X(A0), D3   ; Add X velocity
    
    ; Check X boundaries
    TST.L   D3                  ; Check left boundary
    BPL     CheckRightBound     ; Branch if positive
    CLR.L   D3                  ; Clamp to left edge
    NEG.L   OBJ_VEL_X(A0)       ; Reverse X velocity
    BRA     StoreXPosition
    
CheckRightBound:
    CMP.L   #SCREEN_WIDTH, D3   ; Check right boundary
    BLT     StoreXPosition      ; Branch if within bounds
    MOVE.L  #SCREEN_WIDTH-1, D3 ; Clamp to right edge
    NEG.L   OBJ_VEL_X(A0)       ; Reverse X velocity
    
StoreXPosition:
    MOVE.L  D3, OBJ_X(A0)       ; Store new X position
    
    ; Update Y position
    MOVE.L  OBJ_Y(A0), D4       ; Load Y position
    ADD.L   OBJ_VEL_Y(A0), D4   ; Add Y velocity
    
    ; Check Y boundaries
    TST.L   D4                  ; Check top boundary
    BPL     CheckBottomBound    ; Branch if positive
    CLR.L   D4                  ; Clamp to top edge
    NEG.L   OBJ_VEL_Y(A0)       ; Reverse Y velocity
    BRA     StoreYPosition
    
CheckBottomBound:
    CMP.L   #SCREEN_HEIGHT, D4  ; Check bottom boundary
    BLT     StoreYPosition      ; Branch if within bounds
    
    ; Hit ground - apply bounce with energy loss
    MOVE.L  #SCREEN_HEIGHT-1, D4 ; Clamp to bottom
    MOVE.L  OBJ_VEL_Y(A0), D5   ; Load Y velocity
    NEG.L   D5                  ; Reverse direction
    
    ; Apply bounce factor (reduce energy)
    MULS.W  #BOUNCE_FACTOR, D5  ; Multiply by bounce factor
    DIVS.W  #100, D5            ; Divide by 100 (percentage)
    MOVE.L  D5, OBJ_VEL_Y(A0)   ; Store bounced velocity
    
StoreYPosition:
    MOVE.L  D4, OBJ_Y(A0)       ; Store new Y position
    
NextPhysicsObject:
    LEA     OBJ_SIZE(A0), A0    ; Move to next object
    DBRA    D7, PhysicsLoop     ; Continue for all objects
    
    RTS

CalculateCollisions:
    ; Check collisions between all pairs of objects
    MOVE.L  #ObjectArray, A0    ; First object
    MOVE.L  #MAX_OBJECTS-1, D6  ; Outer loop counter
    
OuterCollisionLoop:
    TST.L   OBJ_ACTIVE(A0)      ; Check if object A is active
    BEQ     NextOuterObject     ; Skip if inactive
    
    LEA     OBJ_SIZE(A0), A1    ; Second object (next in array)
    MOVE.L  D6, D7              ; Inner loop counter
    SUBQ.L  #1, D7              ; Adjust for remaining objects
    BMI     NextOuterObject     ; Skip if no more objects
    
InnerCollisionLoop:
    TST.L   OBJ_ACTIVE(A1)      ; Check if object B is active
    BEQ     NextInnerObject     ; Skip if inactive
    
    ; Calculate distance between objects
    MOVE.L  OBJ_X(A0), D0       ; Object A X
    MOVE.L  OBJ_X(A1), D1       ; Object B X
    SUB.L   D1, D0              ; X difference
    BPL     XDiffPositive       ; Make absolute
    NEG.L   D0
    
XDiffPositive:
    MOVE.L  OBJ_Y(A0), D2       ; Object A Y
    MOVE.L  OBJ_Y(A1), D3       ; Object B Y
    SUB.L   D3, D2              ; Y difference
    BPL     YDiffPositive       ; Make absolute
    NEG.L   D2
    
YDiffPositive:
    ; Simple collision check (Manhattan distance)
    ADD.L   D2, D0              ; Total distance
    CMP.L   #COLLISION_RADIUS, D0 ; Compare with collision radius
    BGT     NextInnerObject     ; No collision if too far
    
    ; Collision detected - calculate response
    JSR     ResolveCollision    ; Resolve collision between A0 and A1
    
NextInnerObject:
    LEA     OBJ_SIZE(A1), A1    ; Move to next inner object
    DBRA    D7, InnerCollisionLoop ; Continue inner loop
    
NextOuterObject:
    LEA     OBJ_SIZE(A0), A0    ; Move to next outer object
    DBRA    D6, OuterCollisionLoop ; Continue outer loop
    
    RTS

ResolveCollision:
    ; Resolve collision between objects at A0 and A1
    ; Simple elastic collision calculation
    
    ; Exchange velocities (simplified elastic collision)
    MOVE.L  OBJ_VEL_X(A0), D0   ; Get velocity A X
    MOVE.L  OBJ_VEL_X(A1), D1   ; Get velocity B X
    MOVE.L  D1, OBJ_VEL_X(A0)   ; Store B velocity to A
    MOVE.L  D0, OBJ_VEL_X(A1)   ; Store A velocity to B
    
    MOVE.L  OBJ_VEL_Y(A0), D2   ; Get velocity A Y
    MOVE.L  OBJ_VEL_Y(A1), D3   ; Get velocity B Y
    MOVE.L  D3, OBJ_VEL_Y(A0)   ; Store B velocity to A
    MOVE.L  D2, OBJ_VEL_Y(A1)   ; Store A velocity to B
    
    ; Apply collision damping
    MOVE.L  OBJ_VEL_X(A0), D0   ; Load new velocity A X
    MULS.W  #COLLISION_DAMPING, D0 ; Apply damping
    DIVS.W  #100, D0            ; Divide by 100
    MOVE.L  D0, OBJ_VEL_X(A0)   ; Store damped velocity
    
    MOVE.L  OBJ_VEL_Y(A0), D1   ; Load new velocity A Y
    MULS.W  #COLLISION_DAMPING, D1 ; Apply damping
    DIVS.W  #100, D1            ; Divide by 100
    MOVE.L  D1, OBJ_VEL_Y(A0)   ; Store damped velocity
    
    ; Apply same damping to object B
    MOVE.L  OBJ_VEL_X(A1), D0   ; Load velocity B X
    MULS.W  #COLLISION_DAMPING, D0 ; Apply damping
    DIVS.W  #100, D0            ; Divide by 100
    MOVE.L  D0, OBJ_VEL_X(A1)   ; Store damped velocity
    
    MOVE.L  OBJ_VEL_Y(A1), D1   ; Load velocity B Y
    MULS.W  #COLLISION_DAMPING, D1 ; Apply damping
    DIVS.W  #100, D1            ; Divide by 100
    MOVE.L  D1, OBJ_VEL_Y(A1)   ; Store damped velocity
    
    RTS

UpdateParticles:
    ; Update particle system with physics
    MOVE.L  #ParticleArray, A0  ; Particle array
    MOVE.L  #MAX_PARTICLES-1, D7 ; Particle counter
    
ParticleLoop:
    ; Check particle life
    MOVE.L  PART_LIFE(A0), D0   ; Load particle life
    TST.L   D0                  ; Test if alive
    BEQ     NextParticle        ; Skip if dead
    
    ; Decrease particle life
    SUBQ.L  #1, D0              ; Decrement life
    MOVE.L  D0, PART_LIFE(A0)   ; Store new life
    
    ; Update particle position
    MOVE.L  PART_X(A0), D1      ; Load X position
    ADD.L   PART_VEL_X(A0), D1  ; Add X velocity
    MOVE.L  D1, PART_X(A0)      ; Store new X
    
    MOVE.L  PART_Y(A0), D2      ; Load Y position
    ADD.L   PART_VEL_Y(A0), D2  ; Add Y velocity
    MOVE.L  D2, PART_Y(A0)      ; Store new Y
    
    ; Apply gravity to particles
    MOVE.L  PART_VEL_Y(A0), D3  ; Load Y velocity
    ADD.L   #PARTICLE_GRAVITY, D3 ; Add gravity
    MOVE.L  D3, PART_VEL_Y(A0)  ; Store new Y velocity
    
NextParticle:
    LEA     PART_SIZE(A0), A0   ; Move to next particle
    DBRA    D7, ParticleLoop    ; Continue for all particles
    
    RTS

UpdateCamera:
    ; Calculate camera position to follow player (first object)
    MOVE.L  #ObjectArray, A0    ; Player object
    
    ; Get player position
    MOVE.L  OBJ_X(A0), D0       ; Player X
    MOVE.L  OBJ_Y(A0), D1       ; Player Y
    
    ; Calculate camera target (center player on screen)
    SUB.L   #SCREEN_WIDTH/2, D0 ; Center X on screen
    SUB.L   #SCREEN_HEIGHT/2, D1 ; Center Y on screen
    
    ; Apply camera smoothing
    MOVE.L  CameraX, D2         ; Current camera X
    SUB.L   D2, D0              ; Difference from target
    DIVS.W  #CAMERA_SMOOTHING, D0 ; Divide by smoothing factor
    ADD.L   D0, D2              ; Add to current position
    MOVE.L  D2, CameraX         ; Store new camera X
    
    MOVE.L  CameraY, D3         ; Current camera Y
    SUB.L   D3, D1              ; Difference from target
    DIVS.W  #CAMERA_SMOOTHING, D1 ; Divide by smoothing factor
    ADD.L   D1, D3              ; Add to current position
    MOVE.L  D3, CameraY         ; Store new camera Y
    
    RTS

; Physics constants
GRAVITY             EQU     1
AIR_FRICTION        EQU     5       ; Out of 1000
BOUNCE_FACTOR       EQU     70      ; Percentage
COLLISION_DAMPING   EQU     80      ; Percentage
COLLISION_RADIUS    EQU     16
PARTICLE_GRAVITY    EQU     2
CAMERA_SMOOTHING    EQU     8
MAX_VELOCITY        EQU     20
MIN_VELOCITY        EQU     -20
SCREEN_WIDTH        EQU     320
SCREEN_HEIGHT       EQU     256

; Object structure offsets
OBJ_X               EQU     0       ; X position (long)
OBJ_Y               EQU     4       ; Y position (long)
OBJ_VEL_X           EQU     8       ; X velocity (long)
OBJ_VEL_Y           EQU     12      ; Y velocity (long)
OBJ_MASS            EQU     16      ; Mass (long)
OBJ_ACTIVE          EQU     20      ; Active flag (long)
OBJ_SIZE            EQU     24      ; Structure size

; Particle structure offsets
PART_X              EQU     0       ; X position (long)
PART_Y              EQU     4       ; Y position (long)
PART_VEL_X          EQU     8       ; X velocity (long)
PART_VEL_Y          EQU     12      ; Y velocity (long)
PART_LIFE           EQU     16      ; Life counter (long)
PART_SIZE           EQU     20      ; Structure size

; Data arrays
MAX_OBJECTS         EQU     8
MAX_PARTICLES       EQU     32
ObjectArray:        DS.B    MAX_OBJECTS*OBJ_SIZE
ParticleArray:      DS.B    MAX_PARTICLES*PART_SIZE

; Camera position
CameraX:            DC.L    0
CameraY:            DC.L    0

; Challenge exercises:
; 1. Add spring forces between connected objects
; 2. Implement orbital mechanics with gravitational attraction
; 3. Add fluid dynamics simulation
; 4. Create advanced collision shapes (circles, rectangles)"
  language="assembly"
/>

## What You've Learned

In this lesson, you've discovered:

1. **Basic Arithmetic** - ADD, SUB, and their variants for comprehensive calculation
2. **Native Multiply/Divide** - Hardware MULU/MULS and DIVU/DIVS instructions
3. **Multi-Precision Arithmetic** - Using extend flag for numbers larger than 32 bits
4. **Advanced Techniques** - Fixed-point math, approximations, and error handling
5. **Practical Applications** - Real-world mathematical programming on the 68000

## Looking Ahead

Next, you'll learn about the 68000's bit manipulation and logical operations - powerful tools for controlling individual bits, implementing flags, and creating efficient algorithms. You'll discover how the 68000's bit operations are much more sophisticated than those on 8-bit processors!

## Fun Fact

The 68000's inclusion of native multiplication and division instructions was revolutionary in the late 1970s. While 8-bit processors required complex software routines to multiply or divide, the 68000 could perform these operations in hardware with single instructions. The MULU instruction could multiply two 16-bit numbers in just 38-54 clock cycles, compared to hundreds of cycles required for software multiplication on 8-bit processors. This capability made the 68000 ideal for applications requiring intensive mathematical calculations, such as 3D graphics, scientific computing, and game physics. The multi-precision arithmetic support through the extend flag was equally advanced, enabling elegant implementation of arbitrary precision arithmetic that would have been extremely difficult on simpler processors. These features helped establish the 68000 as the processor of choice for high-performance applications throughout the 1980s and early 1990s!