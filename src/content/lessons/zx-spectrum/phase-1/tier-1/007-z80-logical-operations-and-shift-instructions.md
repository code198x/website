---
title: "Z80 Logical Operations and Shift Instructions"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 7
description: "Master Z80 logical operations and advanced shift instructions. Learn bit masking, data manipulation, and efficient algorithms using Z80's powerful logical and shift capabilities."
learning_objectives:
  - "Master AND, OR, XOR, and CPL logical operations"
  - "Learn advanced shift and rotate instructions"
  - "Practice bit masking and data filtering techniques"
  - "Build efficient data processing algorithms"
  - "Create programs using logical and shift operations"
concepts:
  - "Logical operations (AND, OR, XOR, CPL)"
  - "Advanced shift operations (SRL, RLC, RRC)"
  - "Bit masking and data filtering"
  - "Data packing and unpacking techniques"
  - "Efficient algorithmic programming"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 7
---

# Lesson 7: Z80 Logical Operations and Shift Instructions

The Z80's logical and shift instructions are among its most powerful features. Today you'll master these operations and learn how they're used to create efficient algorithms, process data, and solve complex programming problems!

## Advanced Logical Operations

Building on what you've learned, let's explore the full power of Z80 logical operations:

### AND - Bit Masking and Filtering
AND is perfect for extracting specific bits or clearing unwanted ones:

```text
LD A, %11010110     ; Original data
AND %00001111       ; Keep only lower 4 bits → %00000110
```

### OR - Bit Setting and Combining  
OR is ideal for setting specific bits or combining data:

```text
LD A, %00010010     ; Original data
OR %10000001        ; Set bits 7 and 0 → %10010011
```

### XOR - Bit Toggling and Encryption
XOR toggles bits and is perfect for encryption and comparisons:

```text
LD A, %11010110     ; Original data
XOR %01010101       ; Toggle specific bits → %10000011
```

### CPL - Complement (Invert All Bits)
CPL flips every bit in the accumulator:

```text
LD A, %00110011     ; Original data
CPL                 ; Invert all bits → %11001100
```

<CodeRunner 
  system="zx-spectrum"
  title="Advanced Logical Operations"
  code="; Advanced logical operations for data processing
; This program demonstrates sophisticated bit manipulation techniques

AdvancedLogicalDemo:
    ; === BIT FIELD EXTRACTION ===
    ; Extract RGB values from a packed colour byte
    ; Format: RRRGGGBB (3 red, 3 green, 2 blue bits)
    LD A, %11010110     ; Packed colour: R=6, G=2, B=2
    
    ; Extract red component (bits 7-5)
    LD B, A             ; Save original
    AND %11100000       ; Mask red bits
    SRL A               ; Shift right
    SRL A
    SRL A
    SRL A
    SRL A               ; Red value now in bits 2-0
    LD (RedValue), A    ; Store red component
    LD ($4000), A       ; Display red value
    
    ; Extract green component (bits 4-2)
    LD A, B             ; Restore original
    AND %00011100       ; Mask green bits
    SRL A               ; Shift right
    SRL A               ; Green value now in bits 2-0
    LD (GreenValue), A  ; Store green component
    LD ($4001), A       ; Display green value
    
    ; Extract blue component (bits 1-0)
    LD A, B             ; Restore original
    AND %00000011       ; Mask blue bits (already in position)
    LD (BlueValue), A   ; Store blue component
    LD ($4002), A       ; Display blue value
    
    ; === BIT FIELD COMBINATION ===
    ; Combine separate values into packed format
    LD A, 5             ; New red value (0-7)
    LD B, 3             ; New green value (0-7)
    LD C, 1             ; New blue value (0-3)
    
    ; Pack red component (shift to bits 7-5)
    AND %00000111       ; Ensure only 3 bits
    SLA A               ; Shift left to position
    SLA A
    SLA A
    SLA A
    SLA A
    LD D, A             ; Save shifted red
    
    ; Pack green component (shift to bits 4-2)
    LD A, B             ; Get green value
    AND %00000111       ; Ensure only 3 bits
    SLA A               ; Shift left to position
    SLA A
    OR D                ; Combine with red
    LD D, A             ; Save combined red+green
    
    ; Pack blue component (bits 1-0, no shift needed)
    LD A, C             ; Get blue value
    AND %00000011       ; Ensure only 2 bits
    OR D                ; Combine with red+green
    LD ($4003), A       ; Display packed colour
    
    ; === DATA FILTERING ===
    ; Filter out noise from sensor data
    LD HL, SensorData   ; Point to sensor readings
    LD DE, FilteredData ; Point to output buffer
    LD B, 8             ; Number of readings
    
FilterLoop:
    LD A, (HL)          ; Get sensor reading
    AND %11111100       ; Remove lower 2 bits (noise)
    LD (DE), A          ; Store filtered value
    INC HL              ; Next input
    INC DE              ; Next output
    DJNZ FilterLoop     ; Continue for all readings
    
    ; Display first filtered value
    LD A, (FilteredData)
    LD ($4010), A
    
    ; === CHECKSUM CALCULATION ===
    ; Calculate XOR checksum of data
    LD HL, TestData     ; Point to data
    LD B, TestDataLen   ; Number of bytes
    LD A, 0             ; Initialize checksum
    
ChecksumLoop:
    XOR (HL)            ; XOR with next byte
    INC HL              ; Move to next byte
    DJNZ ChecksumLoop   ; Continue for all bytes
    
    LD ($4020), A       ; Display checksum
    
    ; === BIT COUNTING ===
    ; Count number of set bits in a byte
    LD A, %10110101     ; Test byte
    LD B, 8             ; Number of bits to check
    LD C, 0             ; Bit counter
    
BitCountLoop:
    SRL A               ; Shift right (bit 0 → carry)
    JR NC, BitNotSet    ; Skip if bit was 0
    INC C               ; Increment count if bit was 1
BitNotSet:
    DJNZ BitCountLoop   ; Check next bit
    
    LD A, C             ; Get bit count
    LD ($4030), A       ; Display count
    
    RET

; Data for examples
RedValue:    DB 0
GreenValue:  DB 0
BlueValue:   DB 0

SensorData:  DB $7F, $83, $91, $A5, $B2, $C8, $D4, $E9
FilteredData: DS 8

TestData:    DB $12, $34, $56, $78, $9A
TestDataLen  EQU 5"
  language="assembly"
/>

## Advanced Shift and Rotate Instructions

The Z80 has additional shift and rotate instructions for specialized operations:

### SRL - Shift Right Logical
Shifts all bits right, bit 7 becomes 0, bit 0 goes to carry:

```text
LD A, %10110100     ; Original value
SRL A               ; Result: %01011010, carry = 0
```

### RLC - Rotate Left Circular
Rotates all bits left, bit 7 wraps around to bit 0:

```text
LD A, %10110100     ; Original value
RLC A               ; Result: %01101001 (bit 7 → bit 0)
```

### RRC - Rotate Right Circular
Rotates all bits right, bit 0 wraps around to bit 7:

```text
LD A, %10110100     ; Original value
RRC A               ; Result: %01011010 (bit 0 → bit 7)
```

<CodeRunner 
  system="zx-spectrum"
  title="Advanced Shift and Rotate"
  code="; Advanced shift and rotate operations
; Demonstrating specialized bit manipulation techniques

AdvancedShiftDemo:
    ; === LOGICAL vs ARITHMETIC SHIFTS ===
    ; Compare SRL (logical) with SRA (arithmetic)
    
    ; Logical shift right - always fills with 0
    LD A, %11000110     ; Negative number in signed arithmetic
    SRL A               ; Logical shift: %01100011 (positive result)
    LD ($4000), A       ; Display logical shift result
    
    ; Arithmetic shift right - preserves sign
    LD A, %11000110     ; Same negative number
    SRA A               ; Arithmetic shift: %11100011 (still negative)
    LD ($4001), A       ; Display arithmetic shift result
    
    ; === CIRCULAR ROTATIONS ===
    LD A, %10110100     ; Test pattern
    
    ; Rotate left circular - bit 7 wraps to bit 0
    RLC A               ; Result: %01101001
    LD ($4002), A       ; Display RLC result
    
    ; Rotate right circular - bit 0 wraps to bit 7
    LD A, %10110100     ; Reset test pattern
    RRC A               ; Result: %01011010
    LD ($4003), A       ; Display RRC result
    
    ; === MULTI-BIT SHIFTS ===
    ; Shift multiple positions efficiently
    LD A, 100           ; Start with 100
    
    ; Divide by 8 using 3 right shifts
    SRL A               ; ÷ 2 = 50
    SRL A               ; ÷ 4 = 25
    SRL A               ; ÷ 8 = 12
    LD ($4004), A       ; Display result
    
    ; Multiply by 16 using 4 left shifts
    LD A, 5             ; Start with 5
    SLA A               ; × 2 = 10
    SLA A               ; × 4 = 20
    SLA A               ; × 8 = 40
    SLA A               ; × 16 = 80
    LD ($4005), A       ; Display result
    
    ; === BIT BARREL SHIFTER ===
    ; Rotate bits by any amount
    LD A, %00000001     ; Single bit set
    LD B, 3             ; Rotate 3 positions
    
RotateLoop:
    RLC A               ; Rotate left once
    DJNZ RotateLoop     ; Repeat B times
    ; A now has bit rotated 3 positions left
    LD ($4010), A       ; Display rotated bit
    
    ; === EFFICIENT BIT REVERSAL ===
    ; Reverse all bits in a byte
    LD A, %11010010     ; Test pattern
    LD B, 8             ; Number of bits
    LD C, 0             ; Accumulator for reversed bits
    
ReverseBitsLoop:
    SRL A               ; Get bit 0 into carry
    RL C                ; Rotate carry into C
    DJNZ ReverseBitsLoop ; Process all 8 bits
    
    LD A, C             ; Get reversed result
    LD ($4020), A       ; Display reversed bits
    
    ; === NIBBLE SWAPPING ===
    ; Swap upper and lower 4 bits
    LD A, %11010010     ; Test: upper=1101, lower=0010
    
    ; Method 1: Using rotates
    RLC A               ; Rotate 4 times to swap nibbles
    RLC A
    RLC A
    RLC A
    LD ($4030), A       ; Display swapped nibbles
    
    ; Method 2: Using shifts and OR (more efficient)
    LD A, %11010010     ; Reset test pattern
    LD B, A             ; Save original
    AND %00001111       ; Mask lower nibble
    SLA A               ; Shift lower nibble
    SLA A               ; to upper position
    SLA A
    SLA A
    LD C, A             ; Save shifted lower nibble
    
    LD A, B             ; Restore original
    AND %11110000       ; Mask upper nibble
    SRL A               ; Shift upper nibble
    SRL A               ; to lower position
    SRL A
    SRL A
    OR C                ; Combine with shifted lower nibble
    LD ($4031), A       ; Display swapped result
    
    ; === GRAY CODE CONVERSION ===
    ; Convert binary to Gray code
    LD A, %00001010     ; Binary value (10 decimal)
    LD B, A             ; Save original
    SRL A               ; Shift right
    XOR B               ; XOR with original
    LD ($4040), A       ; Display Gray code
    
    RET"
  language="assembly"
/>

## Data Packing and Unpacking

One of the most powerful uses of logical and shift operations is efficient data storage:

### Packing Multiple Values
Store several small values in one byte or word:

```text
; Pack four 2-bit values into one byte
LD A, 3             ; Value 1 (2 bits)
SLA A               ; Shift to position
SLA A
OR 1                ; Add value 2
SLA A               ; Shift again
SLA A
OR 2                ; Add value 3
SLA A
SLA A
OR 0                ; Add value 4
; A now contains all four values: 11|01|10|00
```

<CodeRunner 
  system="zx-spectrum"
  title="Data Packing and Unpacking"
  code="; Efficient data storage using bit packing
; Demonstrates how to store multiple values in minimal space

DataPackingDemo:
    ; === COORDINATE PACKING ===
    ; Pack X,Y coordinates into single 16-bit value
    ; X coordinate: 0-255 (8 bits)
    ; Y coordinate: 0-255 (8 bits)
    LD B, 120           ; X coordinate
    LD C, 80            ; Y coordinate
    
    ; Pack into HL: H=X, L=Y
    LD H, B             ; X in upper byte
    LD L, C             ; Y in lower byte
    
    ; Store packed coordinates
    LD (PackedCoords), HL
    
    ; Display packed result
    LD A, H
    LD ($4000), A       ; Display X
    LD A, L
    LD ($4001), A       ; Display Y
    
    ; === UNPACK COORDINATES ===
    ; Extract coordinates from packed value
    LD HL, (PackedCoords) ; Load packed coordinates
    LD A, H             ; Extract X coordinate
    LD (XCoord), A
    LD A, L             ; Extract Y coordinate
    LD (YCoord), A
    
    ; === GAME TILE PACKING ===
    ; Pack tile properties into single byte:
    ; Bits 7-5: Tile type (0-7)
    ; Bit 4: Solid flag
    ; Bit 3: Animated flag
    ; Bits 2-0: Colour (0-7)
    
    LD A, 3             ; Tile type
    SLA A               ; Shift to bits 7-5
    SLA A
    SLA A
    SLA A
    SLA A
    LD B, A             ; Save shifted tile type
    
    ; Add solid flag (set bit 4)
    LD A, 1             ; Solid = true
    SLA A               ; Shift to bit 4
    SLA A
    SLA A
    SLA A
    OR B                ; Combine with tile type
    LD B, A             ; Save combined result
    
    ; Add animated flag (set bit 3)
    LD A, 0             ; Animated = false (bit already 0)
    SLA A               ; Shift to bit 3
    SLA A
    SLA A
    OR B                ; Combine
    LD B, A             ; Save result
    
    ; Add colour (bits 2-0)
    LD A, 5             ; Colour value
    AND %00000111       ; Ensure only 3 bits
    OR B                ; Combine with other properties
    
    LD (TileProperties), A ; Store packed tile
    LD ($4010), A       ; Display packed tile
    
    ; === UNPACK TILE PROPERTIES ===
    LD A, (TileProperties) ; Load packed tile
    
    ; Extract tile type (bits 7-5)
    LD B, A             ; Save original
    AND %11100000       ; Mask tile type bits
    SRL A               ; Shift to position
    SRL A
    SRL A
    SRL A
    SRL A
    LD (TileType), A    ; Store tile type
    LD ($4011), A       ; Display tile type
    
    ; Extract solid flag (bit 4)
    LD A, B             ; Restore original
    AND %00010000       ; Mask solid bit
    JR Z, NotSolid      ; Jump if not solid
    LD C, $53           ; 'S' for Solid
    JR SolidDone
NotSolid:
    LD C, $4E           ; 'N' for Not solid
SolidDone:
    LD ($4012), C       ; Display solid flag
    
    ; Extract colour (bits 2-0)
    LD A, B             ; Restore original
    AND %00000111       ; Mask colour bits
    LD (TileColour), A  ; Store colour
    LD ($4013), A       ; Display colour
    
    ; === DATE/TIME PACKING ===
    ; Pack date into 16 bits: YYYYMMMMDDDDD
    ; Year: 0-63 (6 bits, offset from 2000)
    ; Month: 1-12 (4 bits)
    ; Day: 1-31 (5 bits)
    
    LD A, 24            ; Year 2024 (24 since 2000)
    LD H, A             ; Start building upper byte
    SLA H               ; Shift year to upper bits
    SLA H
    
    LD A, 12            ; Month (December)
    SRL A               ; Get upper 2 bits of month
    SRL A
    OR H                ; Combine with year
    LD H, A             ; Upper byte complete
    
    LD A, 12            ; Month again
    AND %00000011       ; Get lower 2 bits of month
    SLA A               ; Shift to position
    SLA A
    SLA A
    SLA A
    SLA A               ; Month bits now in position 6-5
    
    LD B, 25            ; Day
    AND %00011111       ; Ensure only 5 bits for day
    OR A                ; Combine month and day
    LD L, A             ; Lower byte complete
    
    LD (PackedDate), HL ; Store packed date
    
    ; Display packed date
    LD A, H
    LD ($4020), A       ; Display upper byte
    LD A, L
    LD ($4021), A       ; Display lower byte
    
    RET

; Storage for packed data
PackedCoords:   DW 0
XCoord:         DB 0
YCoord:         DB 0
TileProperties: DB 0
TileType:       DB 0
TileColour:     DB 0
PackedDate:     DW 0"
  language="assembly"
/>

## Algorithmic Applications

Logical and shift operations are the foundation of many efficient algorithms:

### Fast Division and Modulo
```text
; Fast division by powers of 2
LD A, 100           ; Dividend
SRL A               ; Divide by 2
SRL A               ; Divide by 4
SRL A               ; Divide by 8
; A now contains 100 ÷ 8 = 12

; Fast modulo with powers of 2
LD A, 100           ; Number
AND %00000111       ; Modulo 8 (keep lower 3 bits)
; A now contains 100 mod 8 = 4
```

### Bit Pattern Matching
```text
; Check if a pattern matches
LD A, (DataByte)    ; Data to test
XOR Pattern         ; XOR with expected pattern
AND Mask            ; Mask relevant bits
JR Z, PatternMatches ; Jump if pattern matches
```

<CodeRunner 
  system="zx-spectrum"
  title="Algorithmic Applications"
  code="; Algorithmic applications of logical and shift operations
; Efficient algorithms using bit manipulation

AlgorithmicDemo:
    ; === FAST POWER OF 2 TESTING ===
    ; Check if a number is a power of 2
    LD A, 16            ; Test number
    LD B, A             ; Save original
    DEC A               ; Subtract 1
    AND B               ; AND with original
    JR Z, IsPowerOf2    ; If result is 0, it's a power of 2
    LD C, $4E           ; 'N' for Not power of 2
    JR PowerTestDone
IsPowerOf2:
    LD C, $59           ; 'Y' for Yes, power of 2
PowerTestDone:
    LD ($4000), C       ; Display result
    
    ; === POPULATION COUNT (HAMMING WEIGHT) ===
    ; Count number of 1 bits in a byte
    LD A, %10110101     ; Test byte
    LD B, 0             ; Bit counter
    
PopCountLoop:
    OR A                ; Test if A is zero
    JR Z, PopCountDone  ; Exit if no more bits
    INC B               ; Increment counter
    LD C, A             ; Save A
    DEC A               ; A = A - 1
    AND C               ; A = A & (A-1) - clears lowest set bit
    JR PopCountLoop     ; Continue until no bits left
    
PopCountDone:
    LD A, B             ; Get count
    LD ($4001), A       ; Display bit count
    
    ; === FIND FIRST SET BIT ===
    ; Find position of first (lowest) set bit
    LD A, %00101000     ; Test byte (bits 5 and 3 set)
    LD B, 0             ; Position counter
    
FindFirstBitLoop:
    RRC A               ; Rotate right (bit 0 → carry)
    JR C, FoundFirstBit ; If carry set, found the bit
    INC B               ; Increment position
    OR A                ; Check if any bits left
    JR NZ, FindFirstBitLoop ; Continue if bits remain
    LD B, $FF           ; No bits found
    
FoundFirstBit:
    LD A, B             ; Get position
    LD ($4002), A       ; Display first bit position
    
    ; === REVERSE BITS EFFICIENTLY ===
    ; Reverse bit order using lookup table method
    LD A, %11010010     ; Test pattern
    
    ; Split into nibbles for table lookup
    LD B, A             ; Save original
    AND %00001111       ; Lower nibble
    LD C, A             ; Save lower nibble
    LD A, B             ; Restore original
    AND %11110000       ; Upper nibble
    SRL A               ; Shift to lower position
    SRL A
    SRL A
    SRL A
    
    ; Look up reversed nibbles (simplified - using calculation)
    CALL ReverseNibble  ; Reverse upper nibble
    SLA A               ; Shift back to upper position
    SLA A
    SLA A
    SLA A
    LD B, A             ; Save reversed upper nibble
    
    LD A, C             ; Get lower nibble
    CALL ReverseNibble  ; Reverse lower nibble
    OR B                ; Combine with reversed upper nibble
    LD ($4010), A       ; Display bit-reversed result
    
    ; === BINARY TO GRAY CODE ===
    ; Convert binary counter to Gray code
    LD B, 0             ; Counter
    LD HL, $4020        ; Display position
    
BinaryToGrayLoop:
    LD A, B             ; Get binary value
    LD C, A             ; Save binary
    SRL A               ; Shift right
    XOR C               ; XOR with original = Gray code
    LD (HL), A          ; Display Gray code
    INC HL              ; Next display position
    INC B               ; Next binary value
    LD A, B
    CP 16               ; Test 16 values
    JR NZ, BinaryToGrayLoop
    
    ; === FAST MULTIPLICATION BY CONSTANTS ===
    ; Multiply by 15 using shifts and adds: 15 = 16 - 1
    LD A, 7             ; Number to multiply
    LD B, A             ; Save original
    SLA A               ; × 2
    SLA A               ; × 4
    SLA A               ; × 8
    SLA A               ; × 16
    SUB B               ; × 16 - × 1 = × 15
    LD ($4030), A       ; Display result (7 × 15 = 105)
    
    ; Multiply by 10 using: 10 = 8 + 2
    LD A, 7             ; Number to multiply
    LD B, A             ; Save original
    SLA A               ; × 2
    LD C, A             ; Save × 2 result
    SLA A               ; × 4
    SLA A               ; × 8
    ADD A, C            ; × 8 + × 2 = × 10
    LD ($4031), A       ; Display result (7 × 10 = 70)
    
    RET

; Helper function to reverse a 4-bit nibble
ReverseNibble:
    ; Input: A = nibble (0-15)
    ; Output: A = reversed nibble
    LD C, A             ; Save input
    AND %00000001       ; Extract bit 0
    SLA A               ; Shift to bit 3 position
    SLA A
    SLA A
    LD B, A             ; Save bit 0 → bit 3
    
    LD A, C             ; Restore input
    AND %00000010       ; Extract bit 1
    SLA A               ; Shift to bit 2 position
    OR B                ; Combine
    LD B, A             ; Save result
    
    LD A, C             ; Restore input
    AND %00000100       ; Extract bit 2
    SRL A               ; Shift to bit 1 position
    OR B                ; Combine
    LD B, A             ; Save result
    
    LD A, C             ; Restore input
    AND %00001000       ; Extract bit 3
    SRL A               ; Shift to bit 0 position
    SRL A
    SRL A
    OR B                ; Combine with other bits
    RET"
  language="assembly"
/>

## Performance Optimization Tips

### Choose the Right Operation
- Use shifts instead of multiplication/division by powers of 2
- Use bit operations instead of complex arithmetic when possible
- Use XOR for toggling and simple comparisons

### Minimize Memory Access
- Keep frequently used values in registers
- Use register operations when possible
- Pack related data to improve cache locality

### Optimize for Common Cases
- Test the most likely conditions first
- Use lookup tables for complex calculations
- Precompute values when possible

## Practice Exercise

<CodeRunner 
  system="zx-spectrum"
  title="Logical Operations Practice"
  code="; Practice Exercise: Data Compression System
; Implement a simple compression system using bit manipulation

CompressionPractice:
    ; === RUN-LENGTH ENCODING ===
    ; Compress repeated values: store value + count
    LD HL, SourceData   ; Point to source
    LD DE, CompressedData ; Point to output
    LD A, (HL)          ; Get first byte
    LD B, 1             ; Count = 1
    INC HL              ; Move to next byte
    
CompressLoop:
    LD C, (HL)          ; Get next byte
    CP C                ; Compare with current value
    JR NZ, StorePair    ; Different value - store current pair
    
    INC B               ; Same value - increment count
    CP 255              ; Check maximum count
    JR Z, StorePair     ; Store if count reaches maximum
    INC HL              ; Move to next byte
    JR CompressLoop     ; Continue
    
StorePair:
    LD (DE), A          ; Store value
    INC DE
    LD (DE), B          ; Store count
    INC DE
    
    ; Check if more data
    LD A, C             ; Get new value
    LD B, 1             ; Reset count
    INC HL              ; Move to next
    ; Continue compression...
    
    ; === HUFFMAN-STYLE ENCODING ===
    ; Map common values to shorter bit patterns
    LD A, $41           ; Character 'A'
    
    ; Check if it's a common character
    CP $41              ; 'A'
    JR Z, EncodeA
    CP $45              ; 'E'
    JR Z, EncodeE
    CP $20              ; Space
    JR Z, EncodeSpace
    
    ; Uncommon character - use full 8 bits with prefix
    LD B, %11111111     ; Prefix for uncommon
    JR StoreEncoded
    
EncodeA:
    LD B, %01000000     ; Short code for 'A'
    JR StoreEncoded
    
EncodeE:
    LD B, %10000000     ; Short code for 'E'
    JR StoreEncoded
    
EncodeSpace:
    LD B, %11000000     ; Short code for space
    
StoreEncoded:
    LD (EncodedByte), B
    LD ($4000), B       ; Display encoded result
    
    ; === CHECKSUM WITH CRC ===
    ; Simple CRC-like checksum
    LD HL, TestData2    ; Point to data
    LD B, 8             ; Data length
    LD A, 0             ; Initialize CRC
    
CRCLoop:
    XOR (HL)            ; XOR with data byte
    LD C, 8             ; Process 8 bits
    
CRCBitLoop:
    SRL A               ; Shift right (bit 0 → carry)
    JR NC, CRCNoPoly    ; Skip if no carry
    XOR %10001001       ; XOR with polynomial if carry
CRCNoPoly:
    DEC C               ; Next bit
    JR NZ, CRCBitLoop   ; Process all bits
    
    INC HL              ; Next data byte
    DJNZ CRCLoop        ; Process all bytes
    
    LD ($4010), A       ; Display CRC result
    
    RET

; Data for compression examples
SourceData:     DB $AA, $AA, $AA, $BB, $BB, $CC, $CC, $CC, $CC
CompressedData: DS 20       ; Space for compressed output
EncodedByte:    DB 0
TestData2:      DB $12, $34, $56, $78, $9A, $BC, $DE, $F0

; Challenge exercises:
; 1. Implement a bit-packing system for game sprites
; 2. Create a fast integer square root using bit operations
; 3. Build a pattern matcher for text searching
; 4. Design a simple encryption system using XOR and shifts"
  language="assembly"
/>

## What You've Learned

In this lesson, you've mastered:

1. **Advanced Logical Operations** - Complex bit manipulation and data filtering
2. **Shift and Rotate Mastery** - All Z80 shift operations and their applications
3. **Data Packing** - Efficient storage of multiple values in minimal space
4. **Algorithmic Techniques** - Using bit operations for fast algorithms
5. **Performance Optimization** - Choosing the most efficient operations

## Looking Ahead

Next, you'll complete Section 1 with a comprehensive review that integrates all the data manipulation concepts you've learned. You'll build sophisticated programs that demonstrate your understanding of Z80 assembly fundamentals!

## Fun Fact

The Z80's comprehensive set of logical and shift instructions made it a favourite for applications requiring intensive bit manipulation, such as graphics processing, data compression, and cryptography. Many classic arcade games used these instructions for efficient sprite manipulation and collision detection. The ability to test, set, and clear individual bits with single instructions, combined with powerful shift and rotate operations, gave programmers unprecedented control over data at the bit level - capabilities that remain essential in modern embedded systems and performance-critical applications!