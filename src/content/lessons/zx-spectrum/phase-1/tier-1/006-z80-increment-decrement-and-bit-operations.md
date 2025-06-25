---
title: "Z80 Increment, Decrement and Bit Operations"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 6
description: "Learn Z80 increment and decrement operations, and explore powerful bit manipulation instructions for precise data control and efficient programming."
learning_objectives:
  - "Learn INC and DEC instructions for efficient counting"
  - "Understand bit manipulation with SET, RES, and BIT instructions"
  - "Practice bit shifting and rotation operations"
  - "Build efficient counters and bit-processing routines"
  - "Create programs using bitwise logic operations"
concepts:
  - "INC and DEC instructions for 8-bit and 16-bit values"
  - "Bit manipulation instructions (SET, RES, BIT)"
  - "Shift and rotate operations (SLA, SRA, RL, RR)"
  - "Logical operations (AND, OR, XOR)"
  - "Practical bit manipulation techniques"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 6
---

# Lesson 6: Z80 Increment, Decrement and Bit Operations

The Z80 excels at fine-grained data manipulation. Today you'll learn the increment and decrement operations for efficient counting, plus powerful bit manipulation instructions that give you precise control over individual bits!

## Increment and Decrement Operations

### INC - Increment (Add 1)
**Format**: `INC register` or `INC (HL)`
**Function**: Adds 1 to the specified location

```text
LD A, 10            ; A = 10
INC A               ; A = 11
INC A               ; A = 12
```

### DEC - Decrement (Subtract 1)
**Format**: `DEC register` or `DEC (HL)`
**Function**: Subtracts 1 from the specified location

```text
LD B, 5             ; B = 5
DEC B               ; B = 4
DEC B               ; B = 3
```

These operations are faster and more efficient than using ADD or SUB with 1!

**Increment and Decrement Operations:**

```assembly
; Demonstration of Z80 increment and decrement instructions
; These operations are essential for counters and loops

IncDecDemo:
    ; === 8-BIT INCREMENT/DECREMENT ===
    LD A, 10            ; Start with 10
    INC A               ; A = 11
    INC A               ; A = 12
    LD ($4000), A       ; Display result
    
    DEC A               ; A = 11
    DEC A               ; A = 10 (back to original)
    LD ($4001), A       ; Display result
    
    ; === 16-BIT INCREMENT/DECREMENT ===
    LD HL, 1000         ; HL = 1000
    INC HL              ; HL = 1001
    INC HL              ; HL = 1002
    
    ; Display 16-bit result
    LD A, H             ; High byte
    LD ($4002), A
    LD A, L             ; Low byte
    LD ($4003), A
    
    DEC HL              ; HL = 1001
    DEC HL              ; HL = 1000 (back to original)
    
    ; === MEMORY INCREMENT/DECREMENT ===
    LD HL, Counter      ; Point to memory location
    LD (HL), 50         ; Store initial value
    INC (HL)            ; Increment memory directly: 51
    INC (HL)            ; Increment again: 52
    
    LD A, (HL)          ; Read the result
    LD ($4004), A       ; Display result
    
    DEC (HL)            ; Decrement memory: 51
    LD A, (HL)          ; Read the result
    LD ($4005), A       ; Display result
    
    ; === COUNTER LOOP EXAMPLE ===
    LD B, 5             ; Loop counter
    LD HL, $4010        ; Screen position for output
    
CounterLoop:
    LD A, B             ; Get current count
    ADD A, $30          ; Convert to ASCII digit
    LD (HL), A          ; Display digit
    INC HL              ; Next screen position
    DEC B               ; Decrement counter (affects Zero flag)
    JR NZ, CounterLoop  ; Continue if not zero
    
    ; === WRAPAROUND BEHAVIOR ===
    LD A, $FF           ; Maximum 8-bit value (255)
    INC A               ; Increment: A = 0 (wraparound)
    LD ($4020), A       ; Display wrapped result
    
    LD A, $00           ; Minimum 8-bit value (0)
    DEC A               ; Decrement: A = $FF (255, wraparound)
    LD ($4021), A       ; Display wrapped result
    
    RET

; Memory location for counter example
Counter: DB 0
```

## Bit Manipulation Instructions

The Z80 has powerful instructions for working with individual bits:

### BIT - Test a Bit
**Format**: `BIT n, register` (n = 0-7)
**Function**: Tests if bit n is set, affects Zero flag

```text
LD A, %10110100     ; Binary value
BIT 7, A            ; Test bit 7 (Zero flag clear - bit is set)
BIT 0, A            ; Test bit 0 (Zero flag set - bit is clear)
```

### SET - Set a Bit
**Format**: `SET n, register` (n = 0-7)
**Function**: Sets bit n to 1

```text
LD A, %00000000     ; All bits clear
SET 3, A            ; Set bit 3: A = %00001000
SET 7, A            ; Set bit 7: A = %10001000
```

### RES - Reset a Bit
**Format**: `RES n, register` (n = 0-7)
**Function**: Clears bit n to 0

```text
LD A, %11111111     ; All bits set
RES 3, A            ; Clear bit 3: A = %11110111
RES 7, A            ; Clear bit 7: A = %01110111
```

**Bit Manipulation Instructions:**

```assembly
; Demonstration of Z80 bit manipulation instructions
; These give precise control over individual bits

BitManipulationDemo:
    ; === BIT TESTING ===
    LD A, %10110100     ; Test byte: bits 7,5,4,2 are set
    
    ; Test each bit and display result
    BIT 7, A            ; Test bit 7
    JR Z, Bit7Clear     ; Jump if bit 7 is 0
    LD B, $37           ; '7' - bit 7 is set
    JR TestBit6
Bit7Clear:
    LD B, $30           ; '0' - bit 7 is clear
    
TestBit6:
    LD ($4000), B       ; Display bit 7 result
    
    BIT 4, A            ; Test bit 4
    JR Z, Bit4Clear     ; Jump if bit 4 is 0
    LD C, $34           ; '4' - bit 4 is set
    JR TestBit0
Bit4Clear:
    LD C, $30           ; '0' - bit 4 is clear
    
TestBit0:
    LD ($4001), C       ; Display bit 4 result
    
    BIT 0, A            ; Test bit 0
    JR Z, Bit0Clear     ; Jump if bit 0 is 0
    LD D, $30           ; '0' - bit 0 is set (actually clear in our example)
    JR BitTestDone
Bit0Clear:
    LD D, $43           ; 'C' - bit 0 is clear
    
BitTestDone:
    LD ($4002), D       ; Display bit 0 result
    
    ; === BIT SETTING ===
    LD A, %00000000     ; Start with all bits clear
    SET 0, A            ; Set bit 0: A = %00000001
    SET 3, A            ; Set bit 3: A = %00001001
    SET 7, A            ; Set bit 7: A = %10001001
    LD ($4003), A       ; Display result
    
    ; === BIT CLEARING ===
    LD A, %11111111     ; Start with all bits set
    RES 1, A            ; Clear bit 1: A = %11111101
    RES 4, A            ; Clear bit 4: A = %11101101
    RES 6, A            ; Clear bit 6: A = %10101101
    LD ($4004), A       ; Display result
    
    ; === PRACTICAL EXAMPLE: FLAGS REGISTER ===
    ; Simulate a flags/options byte
    LD A, %00000000     ; Start with no flags set
    
    ; Set some option flags
    SET 0, A            ; Set \
```

## Shift and Rotate Operations

The Z80 provides several ways to shift and rotate bits:

### SLA - Shift Left Arithmetic
Shifts all bits left, bit 0 becomes 0, bit 7 goes to carry

### SRA - Shift Right Arithmetic  
Shifts all bits right, preserves sign bit (bit 7), bit 0 goes to carry

### RL - Rotate Left through Carry
Rotates all bits left through carry flag

### RR - Rotate Right through Carry
Rotates all bits right through carry flag

**Shift and Rotate Operations:**

```assembly
; Demonstration of Z80 shift and rotate instructions
; These operations are useful for multiplication, division, and bit processing

ShiftRotateDemo:
    ; === SHIFT LEFT ARITHMETIC (SLA) ===
    ; Effectively multiplies by 2
    LD A, %00001010     ; Binary 10 (decimal 10)
    SLA A               ; Shift left: A = %00010100 (decimal 20)
    LD ($4000), A       ; Display result (should be 20)
    
    ; === SHIFT RIGHT ARITHMETIC (SRA) ===
    ; Effectively divides by 2, preserving sign
    LD A, %01000000     ; Binary 64 (decimal 64)
    SRA A               ; Shift right: A = %00100000 (decimal 32)
    LD ($4001), A       ; Display result (should be 32)
    
    ; === NEGATIVE NUMBER SHIFT ===
    LD A, %11000000     ; Binary -64 (in two's complement)
    SRA A               ; Shift right: A = %11100000 (preserves sign bit)
    LD ($4002), A       ; Display result (still negative)
    
    ; === ROTATE LEFT THROUGH CARRY (RL) ===
    OR A                ; Clear carry flag
    LD A, %10110100     ; Test pattern
    RL A                ; Rotate left: bit 7 -> carry, carry -> bit 0
    LD ($4003), A       ; Display rotated result
    
    ; === ROTATE RIGHT THROUGH CARRY (RR) ===
    SCF                 ; Set carry flag
    LD A, %01101011     ; Test pattern  
    RR A                ; Rotate right: bit 0 -> carry, carry -> bit 7
    LD ($4004), A       ; Display rotated result
    
    ; === PRACTICAL: FAST MULTIPLICATION ===
    ; Multiply by powers of 2 using shifts
    LD A, 7             ; Start with 7
    
    ; Multiply by 2 (7 × 2 = 14)
    SLA A               ; Shift left once
    LD ($4010), A       ; Display: 14
    
    ; Multiply by 4 from original (7 × 4 = 28)
    LD A, 7             ; Reload original
    SLA A               ; × 2
    SLA A               ; × 4
    LD ($4011), A       ; Display: 28
    
    ; Multiply by 8 from original (7 × 8 = 56)
    LD A, 7             ; Reload original
    SLA A               ; × 2
    SLA A               ; × 4  
    SLA A               ; × 8
    LD ($4012), A       ; Display: 56
    
    ; === PRACTICAL: FAST DIVISION ===
    ; Divide by powers of 2 using shifts
    LD A, 56            ; Start with 56
    
    ; Divide by 2 (56 ÷ 2 = 28)
    SRA A               ; Shift right once
    LD ($4013), A       ; Display: 28
    
    ; Divide by 4 from original (56 ÷ 4 = 14)
    LD A, 56            ; Reload original
    SRA A               ; ÷ 2
    SRA A               ; ÷ 4
    LD ($4014), A       ; Display: 14
    
    ; === BIT EXTRACTION ===
    ; Extract specific bits from a value
    LD A, %11010110     ; Source value
    
    ; Extract bits 4-6 (middle 3 bits)
    AND %01110000       ; Mask bits 4-6
    SRA A               ; Shift right to position
    SRA A
    SRA A
    SRA A               ; Now bits 4-6 are in positions 0-2
    LD ($4020), A       ; Display extracted bits
    
    RET
```

## Logical Operations

The Z80 provides logical operations for combining bits:

### AND - Logical AND
Each bit is 1 only if both corresponding bits are 1

### OR - Logical OR  
Each bit is 1 if either corresponding bit is 1

### XOR - Logical Exclusive OR
Each bit is 1 if corresponding bits are different

**Logical Operations:**

```assembly
; Demonstration of Z80 logical operations
; These operations combine bits according to logical rules

LogicalOperationsDemo:
    ; === LOGICAL AND ===
    ; Used for masking (clearing unwanted bits)
    LD A, %11010110     ; Original value
    AND %00001111       ; Mask to keep only lower 4 bits
    LD ($4000), A       ; Display result: %00000110
    
    ; === LOGICAL OR ===
    ; Used for setting bits
    LD A, %00010010     ; Original value
    OR %10000001        ; Set bits 7 and 0
    LD ($4001), A       ; Display result: %10010011
    
    ; === LOGICAL XOR ===
    ; Used for toggling bits
    LD A, %11010110     ; Original value
    XOR %01010101       ; Toggle specific bits
    LD ($4002), A       ; Display result: %10000011
    
    ; === PRACTICAL: BIT MANIPULATION ===
    LD A, %00000000     ; Start with clear byte
    
    ; Set multiple bits using OR
    OR %00010001        ; Set bits 4 and 0
    LD ($4010), A       ; Display: %00010001
    
    ; Clear specific bits using AND
    AND %11110000       ; Clear lower 4 bits
    LD ($4011), A       ; Display: %00010000
    
    ; Toggle bits using XOR
    XOR %11111111       ; Flip all bits
    LD ($4012), A       ; Display: %11101111
    
    ; === BIT FIELD EXTRACTION ===
    ; Extract a field of bits from packed data
    LD A, %11010110     ; Packed data: bits 5-3 contain value
    AND %00111000       ; Mask to extract bits 5-3
    SRA A               ; Shift right to position
    SRA A
    SRA A               ; Value now in bits 2-0
    LD ($4020), A       ; Display extracted field value
    
    ; === COMBINING FIELDS ===
    ; Pack multiple values into one byte
    LD B, 5             ; First value (3 bits max: 0-7)
    LD C, 3             ; Second value (3 bits max: 0-7)
    LD D, 1             ; Third value (2 bits max: 0-3)
    
    ; Pack into single byte: DDCCCBBB
    LD A, B             ; Start with first value in bits 2-0
    AND %00000111       ; Ensure only 3 bits
    
    LD E, A             ; Save first value
    LD A, C             ; Get second value
    AND %00000111       ; Ensure only 3 bits
    SLA A               ; Shift to position (bits 5-3)
    SLA A
    SLA A
    OR E                ; Combine with first value
    
    LD E, A             ; Save combined result
    LD A, D             ; Get third value
    AND %00000011       ; Ensure only 2 bits
    SLA A               ; Shift to position (bits 7-6)
    SLA A
    SLA A
    SLA A
    SLA A
    SLA A
    OR E                ; Combine with previous result
    
    LD ($4030), A       ; Display packed result
    
    ; === ENCRYPTION EXAMPLE ===
    ; Simple XOR encryption
    LD HL, Message      ; Point to message
    LD DE, Encrypted    ; Point to encrypted storage
    LD B, MessageLen    ; Message length
    LD C, $AA           ; Encryption key
    
EncryptLoop:
    LD A, (HL)          ; Get character
    XOR C               ; Encrypt with key
    LD (DE), A          ; Store encrypted character
    INC HL              ; Next source character
    INC DE              ; Next destination
    DJNZ EncryptLoop    ; Continue for all characters
    
    ; Display first encrypted character
    LD A, (Encrypted)
    LD ($4040), A
    
    RET

; Data for encryption example
Message:    DB \
```

## Practical Applications

### Creating Bitmasks
```text
; Create a mask with bits 3, 5, and 7 set
LD A, 0
SET 3, A            ; A = %00001000
SET 5, A            ; A = %00101000  
SET 7, A            ; A = %10101000
```

### Efficient Flag Testing
```text
; Test multiple flags at once
LD A, (StatusByte)
AND %00000110       ; Test bits 1 and 2
CP %00000110        ; Are both set?
JR Z, BothFlagsSet
```

### Fast Mathematical Operations
```text
; Multiply by 10 efficiently: (x * 8) + (x * 2)
LD A, 7             ; Number to multiply
LD B, A             ; Save original
SLA A               ; × 2
SLA A               ; × 4
SLA A               ; × 8
LD C, A             ; Save × 8 result
LD A, B             ; Restore original
SLA A               ; × 2
ADD A, C            ; (× 2) + (× 8) = × 10
; A now contains 7 × 10 = 70
```

**Bit Operations Practice:**

```assembly
; Practice Exercise: Status Register Simulator
; Simulate a game status system using bit manipulation

BitOperationsPractice:
    ; Game status flags in one byte:
    ; Bit 7: Game paused
    ; Bit 6: Sound enabled
    ; Bit 5: Cheats enabled  
    ; Bit 4: Multiplayer mode
    ; Bit 3: High score achieved
    ; Bit 2: Bonus round
    ; Bit 1: Power-up active
    ; Bit 0: Player invincible
    
    LD A, %00000000     ; Start with all flags clear
    LD (GameStatus), A
    
    ; Player starts game - enable sound and multiplayer
    LD A, (GameStatus)
    SET 6, A            ; Enable sound
    SET 4, A            ; Enable multiplayer
    LD (GameStatus), A
    LD ($4000), A       ; Display status
    
    ; Player gets power-up - set power-up and invincible flags
    LD A, (GameStatus)
    SET 1, A            ; Power-up active
    SET 0, A            ; Player invincible
    LD (GameStatus), A
    LD ($4001), A       ; Display status
    
    ; Player achieves high score - set high score flag
    LD A, (GameStatus)
    SET 3, A            ; High score achieved
    LD (GameStatus), A
    LD ($4002), A       ; Display status
    
    ; Power-up expires - clear power-up and invincible flags
    LD A, (GameStatus)
    RES 1, A            ; Clear power-up flag
    RES 0, A            ; Clear invincible flag
    LD (GameStatus), A
    LD ($4003), A       ; Display status
    
    ; Player pauses game
    LD A, (GameStatus)
    SET 7, A            ; Set paused flag
    LD (GameStatus), A
    LD ($4004), A       ; Display status
    
    ; Check specific conditions
    LD A, (GameStatus)
    
    ; Is sound enabled?
    BIT 6, A
    JR Z, SoundOff
    LD B, $53           ; 'S' for Sound on
    JR SoundCheck
SoundOff:
    LD B, $4E           ; 'N' for No sound
SoundCheck:
    LD ($4010), B
    
    ; Is game paused?
    BIT 7, A
    JR Z, NotPaused
    LD C, $50           ; 'P' for Paused
    JR PauseCheck
NotPaused:
    LD C, $52           ; 'R' for Running
PauseCheck:
    LD ($4011), C
    
    ; Are any special modes active? (bits 5, 4, 3)
    AND %00111000       ; Mask special mode bits
    JR Z, NoSpecialModes
    LD D, $59           ; 'Y' for Yes, special modes active
    JR SpecialCheck
NoSpecialModes:
    LD D, $4E           ; 'N' for No special modes
SpecialCheck:
    LD ($4012), D
    
    RET

; Memory for game status
GameStatus: DB 0

; Challenge tasks:
; 1. Add a \
```

## What You've Learned

In this lesson, you've learned:

1. **Increment/Decrement** - Efficient counting with INC and DEC instructions
2. **Bit Testing** - Using BIT instruction to check individual bit states
3. **Bit Setting/Clearing** - Using SET and RES for precise bit control
4. **Shift/Rotate Operations** - Efficient multiplication, division, and bit manipulation
5. **Logical Operations** - AND, OR, XOR for combining and masking bits

## Looking Ahead

Next, you'll learn about Z80 logical operations and shift instructions in more detail, plus explore advanced bit manipulation techniques that make the Z80 a powerhouse for data processing and control applications!

## Fun Fact

The Z80's bit manipulation instructions were revolutionary when introduced. Unlike many 8-bit processors that required multiple instructions to test or modify individual bits, the Z80 could do it in a single instruction. The BIT, SET, and RES instructions made the Z80 extremely popular for control applications where individual flags and status bits needed frequent manipulation. This capability was so useful that it influenced the design of many subsequent processors, and these operations remain fundamental in modern embedded systems programming!