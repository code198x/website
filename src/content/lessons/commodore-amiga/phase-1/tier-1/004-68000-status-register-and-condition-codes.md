---
title: "68000 Status Register and Condition Codes"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 4
description: "Learn the 68000's comprehensive status register and condition code system. Discover how the sophisticated condition codes enable precise program flow control."
learning_objectives:
  - "Understand the 68000 status register structure"
  - "Learn condition code flags (N, Z, V, C, X)"
  - "Practice conditional branch instructions"
  - "Explore compare and test operations"
  - "Build programs using sophisticated condition testing"
concepts:
  - "Status Register (SR) and Condition Code Register (CCR)"
  - "Condition flags: Negative, Zero, Overflow, Carry, Extend"
  - "Conditional branch instructions (Bcc family)"
  - "Compare operations (CMP, CMPA, CMPI)"
  - "Test operations (TST, BTST) and bit manipulation"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 4
---

# Lesson 4: 68000 Status Register and Condition Codes

The 68000's status register and condition codes are much more sophisticated than those found in 8-bit processors. Today you'll learn how this comprehensive system enables precise program control and intelligent decision-making in your Amiga programs!

## 68000 Status Register Structure

The 68000 has a 16-bit Status Register (SR) divided into two parts:

### System Byte (Upper 8 bits) - Privileged
- **Trace Mode**: Single-step debugging support
- **Supervisor/User State**: System vs application mode
- **Interrupt Priority Level**: Hardware interrupt control

### Condition Code Register (CCR) - Lower 8 bits - User Accessible
- **X (Extend)**: Extended carry for multi-precision arithmetic
- **N (Negative)**: Set when result is negative
- **Z (Zero)**: Set when result is zero
- **V (Overflow)**: Set when signed overflow occurs
- **C (Carry)**: Set when unsigned overflow occurs

```text
Status Register Layout:
15 14 13 12 11 10  9  8  7  6  5  4  3  2  1  0
T1 T0 S  -  -  I2 I1 I0 -  -  -  X  N  Z  V  C
|  |  |           |  |  |           |  |  |  |  |
|  |  |           |  |  |           |  |  |  |  +-- Carry
|  |  |           |  |  |           |  |  |  +----- Overflow
|  |  |           |  |  |           |  |  +-------- Zero
|  |  |           |  |  |           |  +----------- Negative
|  |  |           |  |  |           +-------------- Extend
|  |  |           +--+--+-------------------------- Interrupt Level
|  |  +------------------------------------------------ Supervisor State
+--+--------------------------------------------------- Trace Mode
```

**Condition Code Basics:**

```assembly
; Demonstration of 68000 condition codes
; Shows how different operations affect the condition flags

ConditionCodeDemo:
    ; === ZERO FLAG DEMONSTRATION ===
    ; Z flag is set when result equals zero
    
    MOVE.L  #0, D0              ; Load zero
    ; Z flag is now SET (result is zero)
    ; N flag is CLEAR (result is not negative)
    
    MOVE.L  #42, D1             ; Load non-zero value
    ; Z flag is now CLEAR (result is non-zero)
    ; N flag is CLEAR (result is positive)
    
    SUB.L   D1, D1              ; Subtract register from itself
    ; Z flag is now SET (42 - 42 = 0)
    ; N flag is CLEAR, V flag is CLEAR, C flag is CLEAR
    
    ; === NEGATIVE FLAG DEMONSTRATION ===
    ; N flag is set when bit 31 (for long) is set
    
    MOVE.L  #$80000000, D2      ; Load largest negative long
    ; N flag is now SET (bit 31 is set)
    ; Z flag is CLEAR (result is not zero)
    
    MOVE.L  #$7FFFFFFF, D3      ; Load largest positive long
    ; N flag is now CLEAR (bit 31 is clear)
    ; Z flag is CLEAR (result is not zero)
    
    ; === CARRY FLAG DEMONSTRATION ===
    ; C flag is set when unsigned overflow occurs
    
    MOVE.L  #$FFFFFFFF, D4      ; Load maximum unsigned value
    ADDQ.L  #1, D4              ; Add 1 (causes unsigned overflow)
    ; C flag is now SET (carry out of bit 31)
    ; Z flag is SET (result wrapped to zero)
    ; V flag is CLEAR (no signed overflow: -1 + 1 = 0)
    
    ; === OVERFLOW FLAG DEMONSTRATION ===
    ; V flag is set when signed overflow occurs
    
    MOVE.L  #$7FFFFFFF, D5      ; Load maximum positive signed value
    ADDQ.L  #1, D5              ; Add 1 (causes signed overflow)
    ; V flag is now SET (positive + positive = negative)
    ; N flag is SET (result appears negative)
    ; C flag is CLEAR (no unsigned overflow)
    
    ; === EXTEND FLAG DEMONSTRATION ===
    ; X flag preserves carry for multi-precision arithmetic
    
    MOVE.L  #$FFFFFFFF, D6      ; Load maximum value
    ADD.L   #1, D6              ; Add 1 (sets both C and X)
    ; Both C and X flags are SET
    
    ADD.L   #0, D7              ; Add zero (C is cleared, X remains set)
    ; C flag is now CLEAR (no carry from this operation)
    ; X flag remains SET (preserves previous carry)
    
    ; === SIZE-SPECIFIC FLAG BEHAVIOR ===
    ; Flags are set based on operation size
    
    ; Byte operation
    MOVE.B  #$FF, D0            ; Load byte value
    ADD.B   #1, D0              ; Add to byte
    ; Flags set based on bit 7 (byte result)
    
    ; Word operation  
    MOVE.W  #$FFFF, D1          ; Load word value
    ADD.W   #1, D1              ; Add to word
    ; Flags set based on bit 15 (word result)
    
    ; Long operation
    MOVE.L  #$FFFFFFFF, D2      ; Load long value
    ADD.L   #1, D2              ; Add to long
    ; Flags set based on bit 31 (long result)
    
    RTS
```

## Conditional Branch Instructions

The 68000 offers a comprehensive set of conditional branches based on condition codes:

### Signed Conditions
- **BEQ**: Branch if Equal (Z=1)
- **BNE**: Branch if Not Equal (Z=0)
- **BLT**: Branch if Less Than (N⊕V=1)
- **BLE**: Branch if Less or Equal ((Z+(N⊕V))=1)
- **BGT**: Branch if Greater Than ((Z+(N⊕V))=0)
- **BGE**: Branch if Greater or Equal (N⊕V=0)

### Unsigned Conditions
- **BCC/BHS**: Branch if Carry Clear/Higher or Same (C=0)
- **BCS/BLO**: Branch if Carry Set/Lower (C=1)
- **BHI**: Branch if Higher ((C+Z)=0)
- **BLS**: Branch if Lower or Same ((C+Z)=1)

### Individual Flag Tests
- **BMI**: Branch if Minus (N=1)
- **BPL**: Branch if Plus (N=0)
- **BVS**: Branch if Overflow Set (V=1)
- **BVC**: Branch if Overflow Clear (V=0)

<CodeRunner 
  system="commodore-amiga"
  title="Conditional Branch Instructions"
  code="; Demonstration of 68000 conditional branch instructions
; Shows comprehensive condition testing capabilities

ConditionalBranchDemo:
    ; === EQUALITY TESTING ===
    ; Test if two values are equal
    
    MOVE.L  #42, D0             ; First value
    MOVE.L  #42, D1             ; Second value
    CMP.L   D1, D0              ; Compare D0 with D1
    BEQ     ValuesAreEqual      ; Branch if equal
    BNE     ValuesNotEqual      ; Branch if not equal
    
ValuesAreEqual:
    MOVE.B  #'E', EqualityResult ; Mark as Equal
    BRA     SignedComparison
    
ValuesNotEqual:
    MOVE.B  #'N', EqualityResult ; Mark as Not equal
    
SignedComparison:
    ; === SIGNED COMPARISON ===
    ; Compare signed values
    
    MOVE.L  #-10, D2            ; Negative value
    MOVE.L  #5, D3              ; Positive value
    CMP.L   D3, D2              ; Compare D2 with D3 (-10 vs 5)
    
    BLT     FirstIsLess         ; Branch if D2 < D3
    BGE     FirstIsGreaterEqual ; Branch if D2 >= D3
    
FirstIsLess:
    MOVE.B  #'L', SignedResult  ; Mark as Less
    BRA     UnsignedComparison
    
FirstIsGreaterEqual:
    MOVE.B  #'G', SignedResult  ; Mark as Greater/Equal
    
UnsignedComparison:
    ; === UNSIGNED COMPARISON ===
    ; Compare unsigned values
    
    MOVE.L  #$FFFFFFF0, D4      ; Large unsigned value
    MOVE.L  #$00000010, D5      ; Small unsigned value
    CMP.L   D5, D4              ; Compare as unsigned
    
    BHI     FirstIsHigher       ; Branch if D4 > D5 (unsigned)
    BLS     FirstIsLowerSame    ; Branch if D4 <= D5 (unsigned)
    
FirstIsHigher:
    MOVE.B  #'H', UnsignedResult ; Mark as Higher
    BRA     RangeCheck
    
FirstIsLowerSame:
    MOVE.B  #'L', UnsignedResult ; Mark as Lower/Same
    
RangeCheck:
    ; === RANGE CHECKING ===
    ; Check if value is within range
    
    MOVE.L  #75, D6             ; Test value
    
    ; Check if D6 is between 50 and 100
    CMP.L   #50, D6             ; Compare with lower bound
    BLT     OutOfRange          ; Branch if below range
    CMP.L   #100, D6            ; Compare with upper bound
    BGT     OutOfRange          ; Branch if above range
    
    ; Value is in range
    MOVE.B  #'I', RangeResult   ; Mark as In range
    BRA     ZeroTesting
    
OutOfRange:
    MOVE.B  #'O', RangeResult   ; Mark as Out of range
    
ZeroTesting:
    ; === ZERO TESTING ===
    ; Test for zero without comparison
    
    MOVE.L  #0, D7              ; Load zero
    TST.L   D7                  ; Test for zero
    BEQ     IsZero              ; Branch if zero
    BNE     IsNotZero           ; Branch if not zero
    
IsZero:
    MOVE.B  #'Z', ZeroResult    ; Mark as Zero
    BRA     NegativePositive
    
IsNotZero:
    MOVE.B  #'N', ZeroResult    ; Mark as Non-zero
    
NegativePositive:
    ; === SIGN TESTING ===
    ; Test if value is positive or negative
    
    MOVE.L  #-100, D0           ; Load negative value
    TST.L   D0                  ; Test sign
    BMI     IsNegative          ; Branch if negative
    BPL     IsPositive          ; Branch if positive or zero
    
IsNegative:
    MOVE.B  #'N', SignResult    ; Mark as Negative
    BRA     OverflowTesting
    
IsPositive:
    MOVE.B  #'P', SignResult    ; Mark as Positive
    
OverflowTesting:
    ; === OVERFLOW DETECTION ===
    ; Detect signed arithmetic overflow
    
    MOVE.L  #$7FFFFF00, D1      ; Large positive value
    ADD.L   #$000000FF, D1      ; Add to cause overflow
    BVS     OverflowOccurred    ; Branch if overflow
    BVC     NoOverflow          ; Branch if no overflow
    
OverflowOccurred:
    MOVE.B  #'V', OverflowResult ; Mark overflow
    BRA     CarryTesting
    
NoOverflow:
    MOVE.B  #'N', OverflowResult ; Mark no overflow
    
CarryTesting:
    ; === CARRY DETECTION ===
    ; Detect unsigned arithmetic overflow
    
    MOVE.L  #$FFFFFF00, D2      ; Large unsigned value
    ADD.L   #$000000FF, D2      ; Add to cause carry
    BCS     CarryOccurred       ; Branch if carry
    BCC     NoCarry             ; Branch if no carry
    
CarryOccurred:
    MOVE.B  #'C', CarryResult   ; Mark carry
    BRA     MultiCondition
    
NoCarry:
    MOVE.B  #'N', CarryResult   ; Mark no carry
    
MultiCondition:
    ; === MULTIPLE CONDITION TESTING ===
    ; Combine multiple conditions
    
    MOVE.L  #50, D3             ; Test value
    
    ; Check if value is positive AND even
    TST.L   D3                  ; Test if positive
    BMI     NotPositiveEven     ; Branch if negative
    
    BTST    #0, D3              ; Test bit 0 (even/odd)
    BNE     NotPositiveEven     ; Branch if odd
    
    ; Value is positive and even
    MOVE.B  #'Y', PositiveEvenResult
    BRA     EndDemo
    
NotPositiveEven:
    MOVE.B  #'N', PositiveEvenResult
    
EndDemo:
    RTS

; Result storage
EqualityResult:     DC.B    0
SignedResult:       DC.B    0
UnsignedResult:     DC.B    0
RangeResult:        DC.B    0
ZeroResult:         DC.B    0
SignResult:         DC.B    0
OverflowResult:     DC.B    0
CarryResult:        DC.B    0
PositiveEvenResult: DC.B    0"
  language="assembly"
/>

## Compare Operations

The 68000 provides several compare instructions for testing values:

### Compare Instructions
- **CMP**: Compare data register with operand
- **CMPA**: Compare address register with operand  
- **CMPI**: Compare immediate value with operand
- **CMPM**: Compare memory to memory (with postincrement)

### Compare Characteristics
- Performs subtraction without storing result
- Sets condition codes based on comparison
- Original values remain unchanged
- Supports all data sizes (.B, .W, .L)

<CodeRunner 
  system="commodore-amiga"
  title="Compare Operations"
  code="; Demonstration of 68000 compare operations
; Shows different types of comparisons and their uses

CompareOperationsDemo:
    ; === BASIC CMP INSTRUCTION ===
    ; Compare register with another register or immediate
    
    MOVE.L  #100, D0            ; Load test value
    CMP.L   #50, D0             ; Compare D0 with immediate 50
    BGT     GreaterThan50       ; Branch if D0 > 50
    BLE     LessEqual50         ; Branch if D0 <= 50
    
GreaterThan50:
    MOVE.B  #'G', CompResult1   ; Mark as Greater
    BRA     RegisterCompare
    
LessEqual50:
    MOVE.B  #'L', CompResult1   ; Mark as Less/Equal
    
RegisterCompare:
    ; === REGISTER TO REGISTER COMPARISON ===
    MOVE.L  #75, D1             ; First value
    MOVE.L  #125, D2            ; Second value
    CMP.L   D2, D1              ; Compare D1 with D2
    
    BEQ     RegistersEqual      ; Branch if equal
    BLT     FirstSmaller        ; Branch if D1 < D2
    BGT     FirstLarger         ; Branch if D1 > D2
    
RegistersEqual:
    MOVE.B  #'E', CompResult2   ; Equal
    BRA     MemoryCompare
    
FirstSmaller:
    MOVE.B  #'S', CompResult2   ; Smaller
    BRA     MemoryCompare
    
FirstLarger:
    MOVE.B  #'L', CompResult2   ; Larger
    
MemoryCompare:
    ; === MEMORY COMPARISON ===
    ; Compare values in memory
    
    MOVE.L  #$200000, A0        ; Memory address
    MOVE.L  #42, (A0)           ; Store test value
    
    CMP.L   #42, (A0)           ; Compare memory with immediate
    BEQ     MemoryMatch         ; Branch if match
    BNE     MemoryNoMatch       ; Branch if no match
    
MemoryMatch:
    MOVE.B  #'M', CompResult3   ; Mark as Match
    BRA     AddressCompare
    
MemoryNoMatch:
    MOVE.B  #'N', CompResult3   ; Mark as No match
    
AddressCompare:
    ; === ADDRESS REGISTER COMPARISON ===
    ; Compare address registers using CMPA
    
    MOVE.L  #$100000, A1        ; First address
    MOVE.L  #$200000, A2        ; Second address
    CMPA.L  A2, A1              ; Compare A1 with A2
    
    BEQ     AddressesEqual      ; Branch if addresses equal
    BLO     FirstAddressLower   ; Branch if A1 < A2
    BHI     FirstAddressHigher  ; Branch if A1 > A2
    
AddressesEqual:
    MOVE.B  #'E', CompResult4   ; Equal
    BRA     ImmediateCompare
    
FirstAddressLower:
    MOVE.B  #'L', CompResult4   ; Lower
    BRA     ImmediateCompare
    
FirstAddressHigher:
    MOVE.B  #'H', CompResult4   ; Higher
    
ImmediateCompare:
    ; === IMMEDIATE COMPARISON ===
    ; Compare immediate with memory using CMPI
    
    MOVE.L  #$300000, A3        ; Memory location
    MOVE.W  #500, (A3)          ; Store word value
    
    CMPI.W  #500, (A3)          ; Compare immediate with memory
    BEQ     ImmediateMatch      ; Branch if match
    BNE     ImmediateNoMatch    ; Branch if no match
    
ImmediateMatch:
    MOVE.B  #'M', CompResult5   ; Match
    BRA     MemoryToMemory
    
ImmediateNoMatch:
    MOVE.B  #'N', CompResult5   ; No match
    
MemoryToMemory:
    ; === MEMORY TO MEMORY COMPARISON ===
    ; Compare two memory blocks using CMPM
    
    MOVE.L  #Block1, A4         ; First block
    MOVE.L  #Block2, A5         ; Second block
    MOVE.L  #7, D7              ; Compare 8 bytes
    
CompareBlockLoop:
    CMPM.B  (A4)+, (A5)+        ; Compare bytes and increment
    BNE     BlocksDifferent     ; Branch if different
    DBRA    D7, CompareBlockLoop ; Continue comparison
    
    ; Blocks are identical
    MOVE.B  #'S', CompResult6   ; Same
    BRA     SizeComparison
    
BlocksDifferent:
    MOVE.B  #'D', CompResult6   ; Different
    
SizeComparison:
    ; === DIFFERENT SIZE COMPARISONS ===
    ; Show how size affects comparison
    
    MOVE.L  #$12345678, D3      ; Test value
    
    ; Compare as byte (only low 8 bits)
    CMP.B   #$78, D3            ; Compare low byte
    BEQ     ByteMatch           ; Branch if low byte matches
    BNE     ByteNoMatch         ; Branch if no match
    
ByteMatch:
    MOVE.B  #'B', SizeResult1   ; Byte match
    BRA     WordComparison
    
ByteNoMatch:
    MOVE.B  #'N', SizeResult1   ; No byte match
    
WordComparison:
    ; Compare as word (only low 16 bits)
    CMP.W   #$5678, D3          ; Compare low word
    BEQ     WordMatch           ; Branch if low word matches
    BNE     WordNoMatch         ; Branch if no match
    
WordMatch:
    MOVE.B  #'W', SizeResult2   ; Word match
    BRA     ArraySearch
    
WordNoMatch:
    MOVE.B  #'N', SizeResult2   ; No word match
    
ArraySearch:
    ; === ARRAY SEARCH EXAMPLE ===
    ; Search for value in array
    
    MOVE.L  #SearchArray, A6    ; Array address
    MOVE.L  #7, D7              ; Search 8 elements
    MOVE.L  #42, D6             ; Value to find
    
SearchLoop:
    CMP.L   (A6)+, D6           ; Compare with array element
    BEQ     ValueFound          ; Branch if found
    DBRA    D7, SearchLoop      ; Continue search
    
    ; Value not found
    MOVE.B  #'N', SearchResult  ; Not found
    BRA     StringComparison
    
ValueFound:
    MOVE.B  #'F', SearchResult  ; Found
    
StringComparison:
    ; === STRING COMPARISON ===
    ; Compare null-terminated strings
    
    MOVE.L  #String1, A0        ; First string
    MOVE.L  #String2, A1        ; Second string
    
StringCompareLoop:
    MOVE.B  (A0)+, D0           ; Load char from string 1
    MOVE.B  (A1)+, D1           ; Load char from string 2
    CMP.B   D1, D0              ; Compare characters
    BNE     StringsDifferent    ; Branch if different
    TST.B   D0                  ; Check for null terminator
    BNE     StringCompareLoop   ; Continue if not end
    
    ; Strings are identical
    MOVE.B  #'S', StringResult  ; Same
    BRA     EndDemo
    
StringsDifferent:
    MOVE.B  #'D', StringResult  ; Different
    
EndDemo:
    RTS

; Test data
Block1:         DC.B    1,2,3,4,5,6,7,8
Block2:         DC.B    1,2,3,4,5,6,7,8
SearchArray:    DC.L    10,20,30,42,50,60,70,80
String1:        DC.B    'Hello',0
String2:        DC.B    'Hello',0

; Results storage
CompResult1:    DC.B    0
CompResult2:    DC.B    0
CompResult3:    DC.B    0
CompResult4:    DC.B    0
CompResult5:    DC.B    0
CompResult6:    DC.B    0
SizeResult1:    DC.B    0
SizeResult2:    DC.B    0
SearchResult:   DC.B    0
StringResult:   DC.B    0"
  language="assembly"
/>

## Test Operations and Bit Testing

The 68000 provides sophisticated testing operations:

### Test Instructions
- **TST**: Test operand (compare with zero)
- **BTST**: Test specific bit
- **BSET**: Test and set bit
- **BCLR**: Test and clear bit
- **BCHG**: Test and change bit

### Bit Operations
- Can test any bit (0-31 for long, 0-15 for word, 0-7 for byte)
- Set Z flag based on tested bit state
- Atomic operations for multi-tasking safety

**Test Operations and Bit Testing:**

```assembly
; Demonstration of 68000 test and bit operations
; Shows comprehensive testing capabilities

TestOperationsDemo:
    ; === TST INSTRUCTION ===
    ; Test value against zero
    
    MOVE.L  #0, D0              ; Load zero
    TST.L   D0                  ; Test for zero
    BEQ     ValueIsZero         ; Branch if zero
    BNE     ValueNotZero        ; Branch if not zero
    
ValueIsZero:
    MOVE.B  #'Z', TstResult1    ; Mark as Zero
    BRA     PositiveTest
    
ValueNotZero:
    MOVE.B  #'N', TstResult1    ; Mark as Non-zero
    
PositiveTest:
    MOVE.L  #100, D1            ; Load positive value
    TST.L   D1                  ; Test value
    BMI     ValueNegative       ; Branch if negative
    BPL     ValuePositive       ; Branch if positive or zero
    
ValueNegative:
    MOVE.B  #'N', TstResult2    ; Negative
    BRA     BitTesting
    
ValuePositive:
    MOVE.B  #'P', TstResult2    ; Positive
    
BitTesting:
    ; === BTST - BIT TEST ===
    ; Test specific bits without changing value
    
    MOVE.L  #%11010110, D2      ; Load test pattern
    
    ; Test individual bits
    BTST    #0, D2              ; Test bit 0
    BNE     Bit0Set             ; Branch if bit is set
    BEQ     Bit0Clear           ; Branch if bit is clear
    
Bit0Set:
    MOVE.B  #'1', Bit0Result    ; Bit 0 is set
    BRA     TestBit3
    
Bit0Clear:
    MOVE.B  #'0', Bit0Result    ; Bit 0 is clear
    
TestBit3:
    BTST    #3, D2              ; Test bit 3
    BNE     Bit3Set             ; Branch if bit is set
    BEQ     Bit3Clear           ; Branch if bit is clear
    
Bit3Set:
    MOVE.B  #'1', Bit3Result    ; Bit 3 is set
    BRA     TestBit7
    
Bit3Clear:
    MOVE.B  #'0', Bit3Result    ; Bit 3 is clear
    
TestBit7:
    BTST    #7, D2              ; Test bit 7
    BNE     Bit7Set             ; Branch if bit is set
    BEQ     Bit7Clear           ; Branch if bit is clear
    
Bit7Set:
    MOVE.B  #'1', Bit7Result    ; Bit 7 is set
    BRA     BitSet
    
Bit7Clear:
    MOVE.B  #'0', Bit7Result    ; Bit 7 is clear
    
BitSet:
    ; === BSET - BIT SET ===
    ; Test bit and set it to 1
    
    MOVE.L  #%00000000, D3      ; Start with all bits clear
    
    BSET    #5, D3              ; Test and set bit 5
    BNE     Bit5WasSet          ; Branch if bit was already set
    BEQ     Bit5WasClear        ; Branch if bit was clear
    
Bit5WasSet:
    MOVE.B  #'S', SetResult1    ; Was already set
    BRA     SetAnother
    
Bit5WasClear:
    MOVE.B  #'C', SetResult1    ; Was clear (now set)
    
SetAnother:
    BSET    #5, D3              ; Test and set bit 5 again
    BNE     Bit5SecondSet       ; Branch if bit was set
    BEQ     Bit5SecondClear     ; Branch if bit was clear
    
Bit5SecondSet:
    MOVE.B  #'S', SetResult2    ; Was set (no change)
    BRA     BitClear
    
Bit5SecondClear:
    MOVE.B  #'C', SetResult2    ; Was clear
    
BitClear:
    ; === BCLR - BIT CLEAR ===
    ; Test bit and clear it to 0
    
    MOVE.L  #%11111111, D4      ; Start with all bits set
    
    BCLR    #3, D4              ; Test and clear bit 3
    BNE     Bit3ClearWasSet     ; Branch if bit was set
    BEQ     Bit3ClearWasClear   ; Branch if bit was clear
    
Bit3ClearWasSet:
    MOVE.B  #'S', ClearResult1  ; Was set (now clear)
    BRA     ClearAnother
    
Bit3ClearWasClear:
    MOVE.B  #'C', ClearResult1  ; Was already clear
    
ClearAnother:
    BCLR    #3, D4              ; Test and clear bit 3 again
    BNE     Bit3SecondClearSet  ; Branch if bit was set
    BEQ     Bit3SecondClearClear ; Branch if bit was clear
    
Bit3SecondClearSet:
    MOVE.B  #'S', ClearResult2  ; Was set
    BRA     BitChange
    
Bit3SecondClearClear:
    MOVE.B  #'C', ClearResult2  ; Was clear (no change)
    
BitChange:
    ; === BCHG - BIT CHANGE ===
    ; Test bit and toggle it
    
    MOVE.L  #%10101010, D5      ; Start with alternating pattern
    
    BCHG    #1, D5              ; Test and change bit 1
    BNE     Bit1ChangeWasSet    ; Branch if bit was set
    BEQ     Bit1ChangeWasClear  ; Branch if bit was clear
    
Bit1ChangeWasSet:
    MOVE.B  #'S', ChangeResult1 ; Was set (now clear)
    BRA     ChangeAnother
    
Bit1ChangeWasClear:
    MOVE.B  #'C', ChangeResult1 ; Was clear (now set)
    
ChangeAnother:
    BCHG    #1, D5              ; Test and change bit 1 again
    BNE     Bit1SecondChangeSet ; Branch if bit was set
    BEQ     Bit1SecondChangeClear ; Branch if bit was clear
    
Bit1SecondChangeSet:
    MOVE.B  #'S', ChangeResult2 ; Was set (now clear)
    BRA     FlagManipulation
    
Bit1SecondChangeClear:
    MOVE.B  #'C', ChangeResult2 ; Was clear (now set)
    
FlagManipulation:
    ; === FLAG MANIPULATION ===
    ; Manipulate game object flags using bit operations
    
    MOVE.W  #%0000000000000001, D6 ; Object flags: only visible
    
    ; Check if object is visible
    BTST    #FLAG_VISIBLE, D6   ; Test visible flag
    BEQ     ObjectInvisible     ; Branch if not visible
    
    ; Object is visible, check if active
    BTST    #FLAG_ACTIVE, D6    ; Test active flag
    BEQ     ObjectNotActive     ; Branch if not active
    
    ; Object is visible and active
    MOVE.B  #'A', FlagResult1   ; Active and visible
    BRA     SetObjectActive
    
ObjectInvisible:
    MOVE.B  #'I', FlagResult1   ; Invisible
    BRA     SetObjectActive
    
ObjectNotActive:
    MOVE.B  #'V', FlagResult1   ; Visible but not active
    
SetObjectActive:
    ; Set object as active
    BSET    #FLAG_ACTIVE, D6    ; Set active flag
    
    ; Set object as enemy
    BSET    #FLAG_ENEMY, D6     ; Set enemy flag
    
    ; Check combined flags
    BTST    #FLAG_VISIBLE, D6   ; Test visible
    BEQ     FinalFlagTest       ; Skip if not visible
    BTST    #FLAG_ACTIVE, D6    ; Test active
    BEQ     FinalFlagTest       ; Skip if not active
    BTST    #FLAG_ENEMY, D6     ; Test enemy
    BEQ     FinalFlagTest       ; Skip if not enemy
    
    ; Object is visible, active, and enemy
    MOVE.B  #'E', FlagResult2   ; Enemy object
    BRA     StatusRegisterTest
    
FinalFlagTest:
    MOVE.B  #'O', FlagResult2   ; Other state
    
StatusRegisterTest:
    ; === STATUS REGISTER TESTING ===
    ; Test condition codes directly
    
    MOVE.L  #-1, D7             ; Load -1
    ADD.L   #1, D7              ; Add 1 (result = 0)
    
    ; Test multiple conditions simultaneously
    BEQ     ZeroAndNotNegative  ; Z=1, N=0
    ; This branch will be taken
    
ZeroAndNotNegative:
    MOVE.B  #'Z', StatusResult  ; Zero result
    BRA     EndDemo
    
    ; Example of testing for specific condition combinations
    ; BGT tests for Z=0 AND N⊕V=0 (greater than zero)
    ; BLE tests for Z=1 OR N⊕V=1 (less than or equal to zero)
    
EndDemo:
    RTS

; Flag bit definitions
FLAG_VISIBLE        EQU     0       ; Bit 0: object visible
FLAG_ACTIVE         EQU     1       ; Bit 1: object active
FLAG_ENEMY          EQU     2       ; Bit 2: object is enemy
FLAG_PLAYER         EQU     3       ; Bit 3: object is player
FLAG_POWERUP        EQU     4       ; Bit 4: object is power-up
FLAG_COLLECTABLE    EQU     5       ; Bit 5: object is collectable

; Result storage
TstResult1:     DC.B    0
TstResult2:     DC.B    0
Bit0Result:     DC.B    0
Bit3Result:     DC.B    0
Bit7Result:     DC.B    0
SetResult1:     DC.B    0
SetResult2:     DC.B    0
ClearResult1:   DC.B    0
ClearResult2:   DC.B    0
ChangeResult1:  DC.B    0
ChangeResult2:  DC.B    0
FlagResult1:    DC.B    0
FlagResult2:    DC.B    0
StatusResult:   DC.B    0
```

## Advanced Condition Code Techniques

The 68000's condition codes enable sophisticated programming patterns:

### Multi-Precision Arithmetic
The X (extend) flag preserves carry across operations for multi-precision math.

### Condition Code Preservation
Some instructions preserve condition codes, allowing complex testing sequences.

### Efficient Decision Trees
Multiple conditional branches can create efficient decision-making structures.

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Condition Code Techniques"
  code="; Advanced condition code programming techniques
; Demonstrates sophisticated uses of the 68000's condition system

AdvancedConditionDemo:
    ; === MULTI-PRECISION ARITHMETIC ===
    ; Add two 64-bit numbers using extend flag
    
    ; First 64-bit number: $123456789ABCDEF0
    MOVE.L  #$9ABCDEF0, D0      ; Low 32 bits
    MOVE.L  #$12345678, D1      ; High 32 bits
    
    ; Second 64-bit number: $FEDCBA0987654321
    MOVE.L  #$87654321, D2      ; Low 32 bits
    MOVE.L  #$FEDCBA09, D3      ; High 32 bits
    
    ; Add 64-bit numbers
    ADD.L   D2, D0              ; Add low parts (sets carry)
    ADDX.L  D3, D1              ; Add high parts with extend
    
    ; Result is now in D1:D0
    MOVE.L  D0, Result64Low     ; Store low 32 bits
    MOVE.L  D1, Result64High    ; Store high 32 bits
    
    ; === CONDITION CODE CHAINS ===
    ; Chain multiple conditions efficiently
    
    MOVE.L  #InputValue, A0     ; Input value address
    MOVE.L  (A0), D4            ; Load input value
    
    ; Complex condition: (value > 10) AND (value < 100) AND (value is even)
    CMP.L   #10, D4             ; Compare with 10
    BLE     ConditionFailed     ; Failed if <= 10
    CMP.L   #100, D4            ; Compare with 100
    BGE     ConditionFailed     ; Failed if >= 100
    BTST    #0, D4              ; Test if even (bit 0 clear)
    BNE     ConditionFailed     ; Failed if odd
    
    ; All conditions passed
    MOVE.B  #'P', ChainResult   ; Passed
    BRA     RangeClassification
    
ConditionFailed:
    MOVE.B  #'F', ChainResult   ; Failed
    
RangeClassification:
    ; === EFFICIENT RANGE CLASSIFICATION ===
    ; Classify value into multiple ranges efficiently
    
    MOVE.L  #TestValue, A1      ; Test value address
    MOVE.L  (A1), D5            ; Load test value
    
    ; Classify into ranges: 0-25, 26-50, 51-75, 76-100, >100
    CMP.L   #25, D5             ; Compare with 25
    BLE     Range0to25          ; Branch if <= 25
    CMP.L   #50, D5             ; Compare with 50
    BLE     Range26to50         ; Branch if <= 50
    CMP.L   #75, D5             ; Compare with 75
    BLE     Range51to75         ; Branch if <= 75
    CMP.L   #100, D5            ; Compare with 100
    BLE     Range76to100        ; Branch if <= 100
    
    ; Value > 100
    MOVE.B  #'5', RangeClass    ; Range 5 (>100)
    BRA     ArraySorting
    
Range0to25:
    MOVE.B  #'1', RangeClass    ; Range 1 (0-25)
    BRA     ArraySorting
    
Range26to50:
    MOVE.B  #'2', RangeClass    ; Range 2 (26-50)
    BRA     ArraySorting
    
Range51to75:
    MOVE.B  #'3', RangeClass    ; Range 3 (51-75)
    BRA     ArraySorting
    
Range76to100:
    MOVE.B  #'4', RangeClass    ; Range 4 (76-100)
    
ArraySorting:
    ; === EFFICIENT ARRAY SORTING ===
    ; Simple bubble sort using conditions
    
    MOVE.L  #SortArray, A2      ; Array to sort
    MOVE.L  #ARRAY_SIZE-1, D6   ; Outer loop counter
    
OuterSortLoop:
    MOVE.L  #0, D7              ; Swap flag
    MOVE.L  A2, A3              ; Reset inner pointer
    MOVE.L  #ARRAY_SIZE-1, D0   ; Inner loop counter
    SUB.L   D6, D0              ; Adjust for outer loop
    
InnerSortLoop:
    MOVE.L  (A3), D1            ; Load current element
    MOVE.L  4(A3), D2           ; Load next element
    CMP.L   D2, D1              ; Compare elements
    BLE     NoSwapNeeded        ; Branch if in order
    
    ; Swap elements
    MOVE.L  D2, (A3)            ; Store smaller element first
    MOVE.L  D1, 4(A3)           ; Store larger element second
    MOVE.L  #1, D7              ; Set swap flag
    
NoSwapNeeded:
    ADDQ.L  #4, A3              ; Move to next element
    SUBQ.L  #1, D0              ; Decrement inner counter
    BGT     InnerSortLoop       ; Continue inner loop
    
    TST.L   D7                  ; Test swap flag
    BEQ     SortComplete        ; Exit if no swaps
    SUBQ.L  #1, D6              ; Decrement outer counter
    BGT     OuterSortLoop       ; Continue outer loop
    
SortComplete:
    ; Array is now sorted
    MOVE.B  #'S', SortResult    ; Mark as sorted
    
    ; === STATE MACHINE IMPLEMENTATION ===
    ; Use condition codes for state machine
    
    MOVE.L  CurrentState, D0    ; Load current state
    
    ; State dispatch using comparisons
    CMP.L   #STATE_IDLE, D0     ; Check if idle state
    BEQ     ProcessIdleState    ; Branch to idle handler
    CMP.L   #STATE_RUNNING, D0  ; Check if running state
    BEQ     ProcessRunningState ; Branch to running handler
    CMP.L   #STATE_JUMPING, D0  ; Check if jumping state
    BEQ     ProcessJumpingState ; Branch to jumping handler
    CMP.L   #STATE_FALLING, D0  ; Check if falling state
    BEQ     ProcessFallingState ; Branch to falling handler
    
    ; Unknown state - default to idle
    MOVE.L  #STATE_IDLE, CurrentState
    BRA     ProcessIdleState
    
ProcessIdleState:
    ; Process idle state logic
    MOVE.B  #'I', StateResult   ; Mark state
    
    ; Check transition conditions
    BTST    #INPUT_JUMP, InputFlags
    BNE     TransitionToJumping ; Jump if jump pressed
    BTST    #INPUT_LEFT, InputFlags
    BNE     TransitionToRunning ; Run if left pressed
    BTST    #INPUT_RIGHT, InputFlags
    BNE     TransitionToRunning ; Run if right pressed
    BRA     StateMachineDone    ; Stay in idle
    
ProcessRunningState:
    MOVE.B  #'R', StateResult   ; Mark state
    
    ; Check transition conditions
    BTST    #INPUT_JUMP, InputFlags
    BNE     TransitionToJumping ; Jump if jump pressed
    MOVE.L  InputFlags, D1      ; Load input flags
    AND.L   #(1<<INPUT_LEFT)|(1<<INPUT_RIGHT), D1 ; Test movement
    BEQ     TransitionToIdle    ; Idle if no movement
    BRA     StateMachineDone    ; Continue running
    
ProcessJumpingState:
    MOVE.B  #'J', StateResult   ; Mark state
    
    ; Check if reached peak (simplified)
    MOVE.L  PlayerVelocityY, D1 ; Load Y velocity
    TST.L   D1                  ; Test velocity
    BMI     StateMachineDone    ; Still going up
    BRA     TransitionToFalling ; Start falling
    
ProcessFallingState:
    MOVE.B  #'F', StateResult   ; Mark state
    
    ; Check if hit ground (simplified)
    MOVE.L  PlayerY, D1         ; Load Y position
    CMP.L   #GROUND_LEVEL, D1   ; Compare with ground
    BGE     TransitionToIdle    ; Idle if on ground
    BRA     StateMachineDone    ; Continue falling
    
TransitionToIdle:
    MOVE.L  #STATE_IDLE, CurrentState
    BRA     StateMachineDone
    
TransitionToRunning:
    MOVE.L  #STATE_RUNNING, CurrentState
    BRA     StateMachineDone
    
TransitionToJumping:
    MOVE.L  #STATE_JUMPING, CurrentState
    BRA     StateMachineDone
    
TransitionToFalling:
    MOVE.L  #STATE_FALLING, CurrentState
    
StateMachineDone:
    RTS

; Data definitions
InputValue:         DC.L    42
TestValue:          DC.L    67
Result64Low:        DC.L    0
Result64High:       DC.L    0
ChainResult:        DC.B    0
RangeClass:         DC.B    0
SortResult:         DC.B    0
StateResult:        DC.B    0

; Array to sort
ARRAY_SIZE          EQU     5
SortArray:          DC.L    50,20,80,10,60

; State machine constants
STATE_IDLE          EQU     0
STATE_RUNNING       EQU     1
STATE_JUMPING       EQU     2
STATE_FALLING       EQU     3

; Input bit definitions
INPUT_LEFT          EQU     0
INPUT_RIGHT         EQU     1
INPUT_JUMP          EQU     2

; Game state
CurrentState:       DC.L    STATE_IDLE
InputFlags:         DC.L    %00000100    ; Jump pressed
PlayerY:            DC.L    200
PlayerVelocityY:    DC.L    -5           ; Negative = upward
GROUND_LEVEL        EQU     200"
  language="assembly"
/>

## Practice Exercise

**Condition Codes Practice:**

```assembly
; Practice Exercise: Amiga Game Logic Engine
; Use condition codes to implement complex game logic

GameLogicEngine:
    ; Initialize game logic system
    JSR     InitializeGameLogic
    
    ; Process player logic
    JSR     ProcessPlayerLogic
    
    ; Process enemy AI logic
    JSR     ProcessEnemyAI
    
    ; Process collision detection
    JSR     ProcessCollisions
    
    ; Update game state
    JSR     UpdateGameState
    
    RTS

InitializeGameLogic:
    ; Initialize player
    MOVE.L  #160, PlayerX       ; Center X
    MOVE.L  #200, PlayerY       ; Center Y
    MOVE.L  #100, PlayerHealth  ; Full health
    MOVE.L  #0, PlayerScore     ; Zero score
    CLR.L   PlayerFlags         ; Clear flags
    
    ; Initialize enemies
    MOVE.L  #EnemyArray, A0     ; Enemy array
    MOVE.L  #MAX_ENEMIES-1, D7  ; Enemy counter
    
InitEnemyLoop:
    MOVE.L  #1, ENEMY_ACTIVE(A0) ; Set as active
    MOVE.L  D7, D0              ; Use counter as X position
    MULU.W  #50, D0             ; Space enemies apart
    MOVE.L  D0, ENEMY_X(A0)     ; Set X position
    MOVE.L  #50, ENEMY_Y(A0)    ; Set Y position
    MOVE.L  #25, ENEMY_HEALTH(A0) ; Set health
    CLR.L   ENEMY_STATE(A0)     ; Clear state
    
    LEA     ENEMY_SIZE(A0), A0  ; Move to next enemy
    DBRA    D7, InitEnemyLoop   ; Continue for all enemies
    
    RTS

ProcessPlayerLogic:
    ; Check if player is alive
    TST.L   PlayerHealth        ; Test player health
    BLE     PlayerDead          ; Branch if health <= 0
    
    ; Player is alive - process input
    MOVE.L  ControllerInput, D0 ; Load controller state
    
    ; Check movement input
    BTST    #CTRL_LEFT, D0      ; Test left button
    BEQ     CheckRightInput     ; Skip if not pressed
    
    ; Move player left with boundary check
    MOVE.L  PlayerX, D1         ; Load current X
    SUB.L   #PLAYER_SPEED, D1   ; Subtract speed
    BPL     SetPlayerX          ; Branch if positive
    CLR.L   D1                  ; Clamp to left edge
    
SetPlayerX:
    MOVE.L  D1, PlayerX         ; Store new X
    
CheckRightInput:
    BTST    #CTRL_RIGHT, D0     ; Test right button
    BEQ     CheckJumpInput      ; Skip if not pressed
    
    ; Move player right with boundary check
    MOVE.L  PlayerX, D1         ; Load current X
    ADD.L   #PLAYER_SPEED, D1   ; Add speed
    CMP.L   #SCREEN_WIDTH, D1   ; Compare with right edge
    BLT     SetPlayerX2         ; Branch if within bounds
    MOVE.L  #SCREEN_WIDTH-1, D1 ; Clamp to right edge
    
SetPlayerX2:
    MOVE.L  D1, PlayerX         ; Store new X
    
CheckJumpInput:
    BTST    #CTRL_JUMP, D0      ; Test jump button
    BEQ     ProcessPlayerDone   ; Skip if not pressed
    
    ; Check if player can jump (on ground)
    CMP.L   #GROUND_Y, PlayerY  ; Compare with ground level
    BNE     ProcessPlayerDone   ; Skip if not on ground
    
    ; Start jump
    MOVE.L  #-JUMP_VELOCITY, PlayerVelY ; Set upward velocity
    BSET    #PLAYER_JUMPING, PlayerFlags ; Set jumping flag
    
ProcessPlayerDone:
    ; Apply gravity if jumping
    BTST    #PLAYER_JUMPING, PlayerFlags ; Test jumping flag
    BEQ     PlayerPhysicsDone   ; Skip if not jumping
    
    ; Apply gravity
    MOVE.L  PlayerVelY, D1      ; Load Y velocity
    ADD.L   #GRAVITY, D1        ; Add gravity
    MOVE.L  D1, PlayerVelY      ; Store new velocity
    
    ; Apply velocity to position
    MOVE.L  PlayerY, D2         ; Load Y position
    ADD.L   D1, D2              ; Add velocity
    
    ; Check ground collision
    CMP.L   #GROUND_Y, D2       ; Compare with ground
    BLE     PlayerInAir         ; Branch if still in air
    
    ; Player hit ground
    MOVE.L  #GROUND_Y, D2       ; Clamp to ground
    CLR.L   PlayerVelY          ; Stop velocity
    BCLR    #PLAYER_JUMPING, PlayerFlags ; Clear jumping flag
    
PlayerInAir:
    MOVE.L  D2, PlayerY         ; Store new Y position
    
PlayerPhysicsDone:
    BRA     ProcessPlayerEnd
    
PlayerDead:
    ; Handle player death
    BSET    #PLAYER_DEAD, PlayerFlags ; Set dead flag
    
ProcessPlayerEnd:
    RTS

ProcessEnemyAI:
    ; Process each enemy's AI
    MOVE.L  #EnemyArray, A0     ; Enemy array
    MOVE.L  #MAX_ENEMIES-1, D7  ; Enemy counter
    
EnemyAILoop:
    ; Check if enemy is active
    TST.L   ENEMY_ACTIVE(A0)    ; Test active flag
    BEQ     NextEnemy           ; Skip if inactive
    
    ; Check enemy health
    TST.L   ENEMY_HEALTH(A0)    ; Test enemy health
    BLE     DeactivateEnemy     ; Branch if health <= 0
    
    ; Enemy is alive - process AI based on state
    MOVE.L  ENEMY_STATE(A0), D0 ; Load enemy state
    
    CMP.L   #AI_PATROL, D0      ; Check if patrolling
    BEQ     ProcessPatrol       ; Branch to patrol logic
    CMP.L   #AI_CHASE, D0       ; Check if chasing
    BEQ     ProcessChase        ; Branch to chase logic
    CMP.L   #AI_ATTACK, D0      ; Check if attacking
    BEQ     ProcessAttack       ; Branch to attack logic
    
    ; Default to patrol state
    MOVE.L  #AI_PATROL, ENEMY_STATE(A0)
    
ProcessPatrol:
    ; Simple patrol movement
    MOVE.L  ENEMY_X(A0), D1     ; Load enemy X
    BTST    #ENEMY_DIR, ENEMY_FLAGS(A0) ; Test direction flag
    BNE     PatrolRight         ; Branch if moving right
    
    ; Moving left
    SUB.L   #ENEMY_SPEED, D1    ; Move left
    BPL     SetEnemyX           ; Branch if positive
    BSET    #ENEMY_DIR, ENEMY_FLAGS(A0) ; Change direction
    CLR.L   D1                  ; Clamp position
    BRA     SetEnemyX
    
PatrolRight:
    ; Moving right
    ADD.L   #ENEMY_SPEED, D1    ; Move right
    CMP.L   #SCREEN_WIDTH, D1   ; Check boundary
    BLT     SetEnemyX           ; Branch if within bounds
    BCLR    #ENEMY_DIR, ENEMY_FLAGS(A0) ; Change direction
    MOVE.L  #SCREEN_WIDTH-1, D1 ; Clamp position
    
SetEnemyX:
    MOVE.L  D1, ENEMY_X(A0)     ; Store new X
    
    ; Check distance to player for state change
    MOVE.L  PlayerX, D2         ; Load player X
    SUB.L   D1, D2              ; Calculate X difference
    BPL     DistancePositive    ; Branch if positive
    NEG.L   D2                  ; Make positive (absolute value)
    
DistancePositive:
    CMP.L   #CHASE_DISTANCE, D2 ; Compare with chase threshold
    BGT     PatrolDone          ; Stay in patrol if too far
    
    ; Switch to chase state
    MOVE.L  #AI_CHASE, ENEMY_STATE(A0)
    BRA     NextEnemy
    
ProcessChase:
    ; Chase the player
    MOVE.L  PlayerX, D1         ; Load player X
    MOVE.L  ENEMY_X(A0), D2     ; Load enemy X
    CMP.L   D2, D1              ; Compare positions
    BEQ     ChaseVertical       ; Same X position
    BLT     ChaseLeft           ; Player is left
    
    ; Chase right
    ADD.L   #ENEMY_SPEED, D2    ; Move right
    CMP.L   D1, D2              ; Check if passed player
    BLE     SetChaseX           ; Branch if not passed
    MOVE.L  D1, D2              ; Stop at player position
    BRA     SetChaseX
    
ChaseLeft:
    ; Chase left
    SUB.L   #ENEMY_SPEED, D2    ; Move left
    CMP.L   D1, D2              ; Check if passed player
    BGE     SetChaseX           ; Branch if not passed
    MOVE.L  D1, D2              ; Stop at player position
    
SetChaseX:
    MOVE.L  D2, ENEMY_X(A0)     ; Store new X
    
ChaseVertical:
    ; Calculate distance for attack check
    MOVE.L  PlayerX, D3         ; Player X
    SUB.L   D2, D3              ; X difference
    BPL     ChaseDistPos        ; Make positive
    NEG.L   D3
    
ChaseDistPos:
    MOVE.L  PlayerY, D4         ; Player Y
    MOVE.L  ENEMY_Y(A0), D5     ; Enemy Y
    SUB.L   D5, D4              ; Y difference
    BPL     ChaseDistYPos       ; Make positive
    NEG.L   D4
    
ChaseDistYPos:
    ADD.L   D4, D3              ; Total distance (Manhattan)
    CMP.L   #ATTACK_DISTANCE, D3 ; Compare with attack threshold
    BGT     ChaseDone           ; Continue chasing if too far
    
    ; Switch to attack state
    MOVE.L  #AI_ATTACK, ENEMY_STATE(A0)
    BRA     NextEnemy
    
ProcessAttack:
    ; Attack logic (simplified)
    MOVE.L  #AI_PATROL, ENEMY_STATE(A0) ; Return to patrol
    BRA     NextEnemy
    
DeactivateEnemy:
    CLR.L   ENEMY_ACTIVE(A0)    ; Deactivate enemy
    
NextEnemy:
    LEA     ENEMY_SIZE(A0), A0  ; Move to next enemy
    
ChaseDone:
PatrolDone:
    DBRA    D7, EnemyAILoop     ; Continue for all enemies
    
    RTS

ProcessCollisions:
    ; Check player-enemy collisions
    MOVE.L  #EnemyArray, A0     ; Enemy array
    MOVE.L  #MAX_ENEMIES-1, D7  ; Enemy counter
    
CollisionLoop:
    ; Check if enemy is active
    TST.L   ENEMY_ACTIVE(A0)    ; Test active flag
    BEQ     NextCollision       ; Skip if inactive
    
    ; Check X overlap
    MOVE.L  PlayerX, D0         ; Player X
    MOVE.L  ENEMY_X(A0), D1     ; Enemy X
    SUB.L   D1, D0              ; X difference
    BPL     XDiffPositive       ; Make positive
    NEG.L   D0
    
XDiffPositive:
    CMP.L   #COLLISION_SIZE, D0 ; Compare with collision threshold
    BGT     NextCollision       ; No collision if too far
    
    ; Check Y overlap
    MOVE.L  PlayerY, D0         ; Player Y
    MOVE.L  ENEMY_Y(A0), D1     ; Enemy Y
    SUB.L   D1, D0              ; Y difference
    BPL     YDiffPositive       ; Make positive
    NEG.L   D0
    
YDiffPositive:
    CMP.L   #COLLISION_SIZE, D0 ; Compare with collision threshold
    BGT     NextCollision       ; No collision if too far
    
    ; Collision detected!
    MOVE.L  PlayerHealth, D0    ; Load player health
    SUB.L   #DAMAGE_AMOUNT, D0  ; Subtract damage
    BPL     SetPlayerHealth     ; Branch if positive
    CLR.L   D0                  ; Clamp to zero
    
SetPlayerHealth:
    MOVE.L  D0, PlayerHealth    ; Store new health
    
NextCollision:
    LEA     ENEMY_SIZE(A0), A0  ; Move to next enemy
    DBRA    D7, CollisionLoop   ; Continue for all enemies
    
    RTS

UpdateGameState:
    ; Update overall game state
    
    ; Check win condition (all enemies defeated)
    MOVE.L  #EnemyArray, A0     ; Enemy array
    MOVE.L  #MAX_ENEMIES-1, D7  ; Enemy counter
    
CheckEnemiesLoop:
    TST.L   ENEMY_ACTIVE(A0)    ; Test if enemy active
    BNE     EnemiesRemain       ; Branch if enemy still active
    LEA     ENEMY_SIZE(A0), A0  ; Move to next enemy
    DBRA    D7, CheckEnemiesLoop ; Continue checking
    
    ; All enemies defeated - player wins
    BSET    #GAME_WON, GameFlags ; Set win flag
    BRA     GameStateEnd
    
EnemiesRemain:
    ; Check lose condition (player health <= 0)
    TST.L   PlayerHealth        ; Test player health
    BGT     GameStateEnd        ; Continue if player alive
    
    ; Player died - game over
    BSET    #GAME_OVER, GameFlags ; Set game over flag
    
GameStateEnd:
    RTS

; Constants
MAX_ENEMIES         EQU     3
PLAYER_SPEED        EQU     3
ENEMY_SPEED         EQU     1
JUMP_VELOCITY       EQU     8
GRAVITY             EQU     1
SCREEN_WIDTH        EQU     320
GROUND_Y            EQU     200
CHASE_DISTANCE      EQU     80
ATTACK_DISTANCE     EQU     20
COLLISION_SIZE      EQU     16
DAMAGE_AMOUNT       EQU     10

; Controller input bits
CTRL_LEFT           EQU     0
CTRL_RIGHT          EQU     1
CTRL_JUMP           EQU     2

; Player flag bits
PLAYER_JUMPING      EQU     0
PLAYER_DEAD         EQU     1

; Enemy flag bits
ENEMY_DIR           EQU     0       ; Direction: 0=left, 1=right

; AI states
AI_PATROL           EQU     0
AI_CHASE            EQU     1
AI_ATTACK           EQU     2

; Game flag bits
GAME_OVER           EQU     0
GAME_WON            EQU     1

; Enemy structure offsets
ENEMY_ACTIVE        EQU     0       ; Active flag (long)
ENEMY_X             EQU     4       ; X position (long)
ENEMY_Y             EQU     8       ; Y position (long)
ENEMY_HEALTH        EQU     12      ; Health (long)
ENEMY_STATE         EQU     16      ; AI state (long)
ENEMY_FLAGS         EQU     20      ; Flags (long)
ENEMY_SIZE          EQU     24      ; Structure size

; Game data
PlayerX:            DC.L    0
PlayerY:            DC.L    0
PlayerVelY:         DC.L    0
PlayerHealth:       DC.L    0
PlayerScore:        DC.L    0
PlayerFlags:        DC.L    0

EnemyArray:         DS.B    MAX_ENEMIES*ENEMY_SIZE
ControllerInput:    DC.L    %00000001    ; Left pressed
GameFlags:          DC.L    0

; Challenge exercises:
; 1. Add more sophisticated AI states (fleeing, guarding)
; 2. Implement power-ups with condition-based effects
; 3. Add combo system using timing conditions
; 4. Create boss enemy with complex behavior patterns
```

## What You've Learned

In this lesson, you've discovered:

1. **68000 Status Register** - Comprehensive condition tracking system
2. **Condition Codes** - Five flags (X, N, Z, V, C) for precise program control
3. **Conditional Branches** - Rich set of signed and unsigned condition tests
4. **Compare Operations** - Flexible comparison instructions for decision making
5. **Test and Bit Operations** - Sophisticated bit testing and manipulation

## Looking Ahead

Next, you'll learn about 68000 arithmetic operations - how the powerful processor handles mathematical calculations with support for multiple data sizes and advanced arithmetic capabilities. You'll discover how much more capable the 68000 is compared to 8-bit processors!

## Fun Fact

The 68000's condition code system was designed to be both comprehensive and intuitive. The inclusion of both signed and unsigned conditional branches meant that programmers could easily work with both types of data without complex workarounds. The extend (X) flag was particularly innovative, enabling elegant multi-precision arithmetic that would have been cumbersome on simpler processors. The bit test and manipulation instructions (BTST, BSET, BCLR, BCHG) were also ahead of their time, providing atomic operations that were essential for multi-tasking operating systems. Many of these features influenced later processor designs and helped establish programming patterns that are still used today. The 68000's condition system was so well-designed that it remained virtually unchanged throughout the entire 68000 family evolution!