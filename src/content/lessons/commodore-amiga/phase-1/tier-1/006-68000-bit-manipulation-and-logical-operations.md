---
title: "68000 Bit Manipulation and Logical Operations"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 6
description: "Master the 68000's comprehensive bit manipulation and logical operations. Learn advanced bit testing, setting, and clearing techniques for precise data control."
learning_objectives:
  - "Learn logical operations (AND, OR, EOR, NOT)"
  - "Master bit test and modify instructions (BTST, BSET, BCLR, BCHG)"
  - "Understand shift and rotate operations (LSL, LSR, ASL, ASR, ROL, ROR)"
  - "Practice complex bit manipulation patterns"
  - "Build programs using sophisticated bit control techniques"
concepts:
  - "Logical operations: AND, OR, EOR (exclusive OR), NOT"
  - "Bit test instructions: BTST, BSET, BCLR, BCHG"
  - "Shift operations: LSL, LSR (logical), ASL, ASR (arithmetic)"
  - "Rotate operations: ROL, ROR, ROXL, ROXR (with extend)"
  - "Bit masks and field manipulation techniques"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 6
---

# Lesson 6: 68000 Bit Manipulation and Logical Operations

The 68000's bit manipulation capabilities are far superior to 8-bit processors, offering sophisticated instructions for precise bit control, logical operations, and data field manipulation. Today you'll learn how these powerful features enable elegant solutions to complex programming problems on the Amiga!

## Logical Operations

The 68000 provides comprehensive logical operations for data manipulation:

### Basic Logical Instructions
- **AND**: Bitwise AND operation (bits set only where both operands have bits set)
- **OR**: Bitwise OR operation (bits set where either operand has bits set)
- **EOR**: Exclusive OR operation (bits set where operands differ)
- **NOT**: Bitwise complement (inverts all bits)

### Logical Operation Applications
- **Bit masking**: Isolate specific bits or fields
- **Bit setting**: Force specific bits to 1
- **Bit clearing**: Force specific bits to 0
- **Data filtering**: Remove unwanted information

<CodeRunner 
  system="commodore-amiga"
  title="Basic Logical Operations"
  code="; Demonstration of 68000 logical operations
; Shows fundamental bit manipulation techniques

LogicalOperationsDemo:
    ; === AND OPERATION - BIT MASKING ===
    ; AND operation clears bits where mask is 0, preserves where mask is 1
    
    MOVE.L  #%11010110101011010011110011001100, D0 ; Test data
    MOVE.L  #%00001111000011110000111100001111, D1 ; AND mask
    AND.L   D1, D0              ; Apply mask
    ; Result: clears bits where mask is 0
    MOVE.L  D0, AndResult1      ; Store result
    
    ; Practical example: extract lower nibbles
    MOVE.L  #$12345678, D2      ; Test value
    AND.L   #$0F0F0F0F, D2      ; Mask to get lower nibbles
    ; Result: $02040608 (extracts 2,4,6,8)
    MOVE.L  D2, AndResult2      ; Store result
    
    ; === OR OPERATION - BIT SETTING ===
    ; OR operation sets bits where mask is 1, preserves where mask is 0
    
    MOVE.L  #%00110011001100110011001100110011, D3 ; Base data
    MOVE.L  #%11110000111100001111000011110000, D4 ; OR mask
    OR.L    D4, D3              ; Set bits
    ; Result: sets bits where mask is 1
    MOVE.L  D3, OrResult1       ; Store result
    
    ; Practical example: set status flags
    MOVE.B  #%00000001, D5      ; Current flags (only bit 0 set)
    OR.B    #%00001100, D5      ; Set bits 2 and 3
    ; Result: %00001101 (bits 0, 2, 3 now set)
    MOVE.B  D5, OrResult2       ; Store result
    
    ; === EOR OPERATION - BIT TOGGLING ===
    ; EOR operation flips bits where mask is 1, preserves where mask is 0
    
    MOVE.L  #%10101010101010101010101010101010, D6 ; Base pattern
    MOVE.L  #%11110000111100001111000011110000, D7 ; EOR mask
    EOR.L   D7, D6              ; Toggle bits
    ; Result: flips bits where mask is 1
    MOVE.L  D6, EorResult1      ; Store result
    
    ; Practical example: simple encryption/decryption
    MOVE.L  #$12345678, D0      ; Original data
    MOVE.L  #$ABCDEF01, D1      ; XOR key
    EOR.L   D1, D0              ; Encrypt
    MOVE.L  D0, EncryptedData   ; Store encrypted
    EOR.L   D1, D0              ; Decrypt (XOR again with same key)
    MOVE.L  D0, DecryptedData   ; Should match original
    
    ; === NOT OPERATION - BIT INVERSION ===
    ; NOT operation inverts all bits
    
    MOVE.L  #%11110000111100001111000011110000, D2
    NOT.L   D2                  ; Invert all bits
    ; Result: %00001111000011110000111100001111
    MOVE.L  D2, NotResult1      ; Store result
    
    ; Practical example: create inverse mask
    MOVE.B  #%00001111, D3      ; Original mask
    MOVE.B  D3, D4              ; Copy for inverse
    NOT.B   D4                  ; Create inverse mask
    ; D3: %00001111, D4: %11110000
    MOVE.B  D3, OriginalMask    ; Store original
    MOVE.B  D4, InverseMask     ; Store inverse
    
    ; === COMBINING LOGICAL OPERATIONS ===
    ; Complex bit manipulation using multiple operations
    
    MOVE.L  #$FF00FF00, D5      ; Start value
    
    ; Clear bits 8-15, set bits 16-23, toggle bits 0-7
    AND.L   #$FF00FFFF, D5      ; Clear bits 8-15
    OR.L    #$00FF0000, D5      ; Set bits 16-23
    EOR.L   #$000000FF, D5      ; Toggle bits 0-7
    
    MOVE.L  D5, CombinedResult  ; Store complex result
    
    ; === BIT FIELD EXTRACTION ===
    ; Extract specific bit fields from data
    
    ; Extract RGB components from 16-bit colour value
    MOVE.W  #$F84A, D6          ; 16-bit colour (R=15, G=8, B=10)
    
    ; Extract red component (bits 12-15)
    MOVE.W  D6, D0              ; Copy colour value
    LSR.W   #8, D0              ; Shift right 8 positions
    LSR.W   #4, D0              ; Shift right 4 more (total 12)
    MOVE.B  D0, RedComponent    ; Store red (should be 15)
    
    ; Extract green component (bits 8-11)
    MOVE.W  D6, D1              ; Copy colour value
    LSR.W   #8, D1              ; Shift right 8 positions
    AND.W   #$0F, D1            ; Mask to 4 bits
    MOVE.B  D1, GreenComponent  ; Store green (should be 8)
    
    ; Extract blue component (bits 4-7)
    MOVE.W  D6, D2              ; Copy colour value
    LSR.W   #4, D2              ; Shift right 4 positions
    AND.W   #$0F, D2            ; Mask to 4 bits
    MOVE.B  D2, BlueComponent   ; Store blue (should be 4)
    
    ; Extract alpha component (bits 0-3)
    MOVE.W  D6, D3              ; Copy colour value
    AND.W   #$0F, D3            ; Mask to 4 bits
    MOVE.B  D3, AlphaComponent  ; Store alpha (should be 10)
    
    ; === BIT FIELD PACKING ===
    ; Pack multiple values into a single word
    
    CLR.W   D7                  ; Start with zero
    
    ; Pack 4 values (4 bits each) into a word
    MOVE.B  #12, D0             ; Value 1 (4 bits max)
    AND.B   #$0F, D0            ; Ensure 4 bits
    LSL.W   #4, D7              ; Make room for new value
    OR.B    D0, D7              ; Pack value 1
    
    MOVE.B  #7, D1              ; Value 2
    AND.B   #$0F, D1            ; Ensure 4 bits
    LSL.W   #4, D7              ; Make room
    OR.B    D1, D7              ; Pack value 2
    
    MOVE.B  #3, D2              ; Value 3
    AND.B   #$0F, D2            ; Ensure 4 bits
    LSL.W   #4, D7              ; Make room
    OR.B    D2, D7              ; Pack value 3
    
    MOVE.B  #9, D3              ; Value 4
    AND.B   #$0F, D3            ; Ensure 4 bits
    LSL.W   #4, D7              ; Make room
    OR.B    D3, D7              ; Pack value 4
    
    MOVE.W  D7, PackedValues    ; Store packed result
    
    RTS

; Data storage
AndResult1:         DC.L    0
AndResult2:         DC.L    0
OrResult1:          DC.L    0
OrResult2:          DC.B    0
EorResult1:         DC.L    0
EncryptedData:      DC.L    0
DecryptedData:      DC.L    0
NotResult1:         DC.L    0
OriginalMask:       DC.B    0
InverseMask:        DC.B    0
CombinedResult:     DC.L    0
RedComponent:       DC.B    0
GreenComponent:     DC.B    0
BlueComponent:      DC.B    0
AlphaComponent:     DC.B    0
PackedValues:       DC.W    0"
  language="assembly"
/>

## Bit Test and Modify Instructions

The 68000 offers sophisticated bit testing and modification instructions:

### Bit Test Instructions
- **BTST**: Test bit (set Z flag based on bit state)
- **BSET**: Test bit and set it to 1
- **BCLR**: Test bit and clear it to 0
- **BCHG**: Test bit and change it (toggle)

### Key Features
- Can test any bit position (0-31 for long, 0-15 for word, 0-7 for byte)
- Atomic operations (important for multi-tasking)
- Set condition codes based on original bit state
- Can use immediate bit numbers or register bit numbers

<CodeRunner 
  system="commodore-amiga"
  title="Bit Test and Modify Instructions"
  code="; Demonstration of 68000 bit test and modify instructions
; Shows sophisticated bit manipulation capabilities

BitTestModifyDemo:
    ; === BTST - BIT TEST ===
    ; Test specific bits without modifying the value
    
    MOVE.L  #%11010110101101001011110110010011, D0 ; Test pattern
    
    ; Test individual bits
    BTST    #0, D0              ; Test bit 0 (rightmost)
    BNE     Bit0IsSet           ; Branch if bit is set
    MOVE.B  #'0', Bit0State     ; Store '0' if clear
    BRA     TestBit5
    
Bit0IsSet:
    MOVE.B  #'1', Bit0State     ; Store '1' if set
    
TestBit5:
    BTST    #5, D0              ; Test bit 5
    BNE     Bit5IsSet           ; Branch if bit is set
    MOVE.B  #'0', Bit5State     ; Store '0' if clear
    BRA     TestBit15
    
Bit5IsSet:
    MOVE.B  #'1', Bit5State     ; Store '1' if set
    
TestBit15:
    BTST    #15, D0             ; Test bit 15
    BNE     Bit15IsSet          ; Branch if bit is set
    MOVE.B  #'0', Bit15State    ; Store '0' if clear
    BRA     BitSetOperations
    
Bit15IsSet:
    MOVE.B  #'1', Bit15State    ; Store '1' if set
    
BitSetOperations:
    ; === BSET - BIT SET ===
    ; Test bit and set it to 1 (Z flag reflects original state)
    
    MOVE.L  #%00000000000000000000000000000000, D1 ; Start with all bits clear
    
    ; Set various bits and check original state
    BSET    #3, D1              ; Set bit 3
    BEQ     Bit3WasClear        ; Branch if bit was originally clear
    MOVE.B  #'S', Bit3OrigState ; Was set
    BRA     SetBit7
    
Bit3WasClear:
    MOVE.B  #'C', Bit3OrigState ; Was clear
    
SetBit7:
    BSET    #7, D1              ; Set bit 7
    BEQ     Bit7WasClear        ; Branch if bit was originally clear
    MOVE.B  #'S', Bit7OrigState ; Was set
    BRA     SetBit3Again
    
Bit7WasClear:
    MOVE.B  #'C', Bit7OrigState ; Was clear
    
SetBit3Again:
    BSET    #3, D1              ; Set bit 3 again (already set)
    BEQ     Bit3SecondClear     ; Branch if bit was originally clear
    MOVE.B  #'S', Bit3SecondState ; Was set (should be this)
    BRA     BitClearOperations
    
Bit3SecondClear:
    MOVE.B  #'C', Bit3SecondState ; Was clear
    
BitClearOperations:
    ; === BCLR - BIT CLEAR ===
    ; Test bit and clear it to 0 (Z flag reflects original state)
    
    MOVE.L  #%11111111111111111111111111111111, D2 ; Start with all bits set
    
    ; Clear various bits and check original state
    BCLR    #5, D2              ; Clear bit 5
    BEQ     Bit5ClearWasClear   ; Branch if bit was originally clear
    MOVE.B  #'S', Bit5ClearOrigState ; Was set
    BRA     ClearBit10
    
Bit5ClearWasClear:
    MOVE.B  #'C', Bit5ClearOrigState ; Was clear
    
ClearBit10:
    BCLR    #10, D2             ; Clear bit 10
    BEQ     Bit10WasClear       ; Branch if bit was originally clear
    MOVE.B  #'S', Bit10OrigState ; Was set
    BRA     ClearBit5Again
    
Bit10WasClear:
    MOVE.B  #'C', Bit10OrigState ; Was clear
    
ClearBit5Again:
    BCLR    #5, D2              ; Clear bit 5 again (already clear)
    BEQ     Bit5SecondWasClear  ; Branch if bit was originally clear
    MOVE.B  #'S', Bit5SecondState ; Was set
    BRA     BitChangeOperations
    
Bit5SecondWasClear:
    MOVE.B  #'C', Bit5SecondState ; Was clear (should be this)
    
BitChangeOperations:
    ; === BCHG - BIT CHANGE (TOGGLE) ===
    ; Test bit and toggle it (Z flag reflects original state)
    
    MOVE.L  #%01010101010101010101010101010101, D3 ; Alternating pattern
    
    ; Toggle various bits and check original state
    BCHG    #0, D3              ; Toggle bit 0 (was 1, becomes 0)
    BEQ     Bit0ToggleWasClear  ; Branch if bit was originally clear
    MOVE.B  #'S', Bit0ToggleOrigState ; Was set
    BRA     ToggleBit1
    
Bit0ToggleWasClear:
    MOVE.B  #'C', Bit0ToggleOrigState ; Was clear
    
ToggleBit1:
    BCHG    #1, D3              ; Toggle bit 1 (was 0, becomes 1)
    BEQ     Bit1WasClear        ; Branch if bit was originally clear
    MOVE.B  #'S', Bit1ToggleOrigState ; Was set
    BRA     ToggleBit0Again
    
Bit1WasClear:
    MOVE.B  #'C', Bit1ToggleOrigState ; Was clear
    
ToggleBit0Again:
    BCHG    #0, D3              ; Toggle bit 0 again (was 0, becomes 1)
    BEQ     Bit0SecondWasClear  ; Branch if bit was originally clear
    MOVE.B  #'S', Bit0SecondToggleState ; Was set
    BRA     DynamicBitTesting
    
Bit0SecondWasClear:
    MOVE.B  #'C', Bit0SecondToggleState ; Was clear (should be this)
    
DynamicBitTesting:
    ; === DYNAMIC BIT POSITIONS ===
    ; Use register to specify bit position
    
    MOVE.L  #%10000000000000001000000000000001, D4 ; Test pattern
    MOVE.L  #0, D5              ; Bit position counter
    MOVE.L  #0, D6              ; Set bit counter
    
BitCountLoop:
    BTST    D5, D4              ; Test bit at position in D5
    BEQ     BitNotSet           ; Branch if bit is clear
    ADDQ.L  #1, D6              ; Increment set bit counter
    
BitNotSet:
    ADDQ.L  #1, D5              ; Next bit position
    CMP.L   #32, D5             ; Check all 32 bits
    BNE     BitCountLoop        ; Continue if not done
    
    MOVE.L  D6, SetBitCount     ; Store count of set bits
    
    ; === PRACTICAL EXAMPLE: FLAG MANAGEMENT ===
    ; Manage game object flags using bit operations
    
    MOVE.W  #%0000000000000001, D7 ; Object flags (only VISIBLE set)
    
    ; Check if object is visible
    BTST    #FLAG_VISIBLE, D7   ; Test visible flag
    BEQ     ObjectNotVisible    ; Branch if not visible
    
    ; Object is visible, now make it active
    BSET    #FLAG_ACTIVE, D7    ; Set active flag
    
    ; Make object an enemy
    BSET    #FLAG_ENEMY, D7     ; Set enemy flag
    
    ; Toggle invincible state
    BCHG    #FLAG_INVINCIBLE, D7 ; Toggle invincible flag
    
    ; Check final state
    BTST    #FLAG_ACTIVE, D7    ; Test if active
    BEQ     CheckComplete       ; Skip if not active
    BTST    #FLAG_ENEMY, D7     ; Test if enemy
    BEQ     CheckComplete       ; Skip if not enemy
    
    ; Object is visible, active, and enemy
    MOVE.B  #'A', ObjectState   ; Mark as active enemy
    BRA     MemoryBitOperations
    
ObjectNotVisible:
    MOVE.B  #'H', ObjectState   ; Mark as hidden
    BRA     MemoryBitOperations
    
CheckComplete:
    MOVE.B  #'P', ObjectState   ; Mark as partial state
    
MemoryBitOperations:
    ; === BIT OPERATIONS ON MEMORY ===
    ; Perform bit operations directly on memory locations
    
    MOVE.L  #$600000, A0        ; Memory address
    MOVE.L  #%11110000111100001111000011110000, (A0) ; Store test pattern
    
    ; Test bits in memory
    BTST    #15, (A0)           ; Test bit 15 in memory
    BNE     MemoryBit15Set      ; Branch if set
    MOVE.B  #'0', MemBit15State ; Store clear state
    BRA     SetMemoryBit
    
MemoryBit15Set:
    MOVE.B  #'1', MemBit15State ; Store set state
    
SetMemoryBit:
    ; Set bit in memory
    BSET    #8, (A0)            ; Set bit 8 in memory
    
    ; Clear bit in memory
    BCLR    #20, (A0)           ; Clear bit 20 in memory
    
    ; Toggle bit in memory
    BCHG    #0, (A0)            ; Toggle bit 0 in memory
    
    ; Read back modified value
    MOVE.L  (A0), D0            ; Load modified value
    MOVE.L  D0, ModifiedMemValue ; Store result
    
    RTS

; Flag bit definitions
FLAG_VISIBLE        EQU     0       ; Bit 0: object visible
FLAG_ACTIVE         EQU     1       ; Bit 1: object active
FLAG_ENEMY          EQU     2       ; Bit 2: object is enemy
FLAG_PLAYER         EQU     3       ; Bit 3: object is player
FLAG_INVINCIBLE     EQU     4       ; Bit 4: object is invincible
FLAG_COLLECTIBLE    EQU     5       ; Bit 5: object is collectible

; Data storage
Bit0State:              DC.B    0
Bit5State:              DC.B    0
Bit15State:             DC.B    0
Bit3OrigState:          DC.B    0
Bit7OrigState:          DC.B    0
Bit3SecondState:        DC.B    0
Bit5ClearOrigState:     DC.B    0
Bit10OrigState:         DC.B    0
Bit5SecondState:        DC.B    0
Bit0ToggleOrigState:    DC.B    0
Bit1ToggleOrigState:    DC.B    0
Bit0SecondToggleState:  DC.B    0
SetBitCount:            DC.L    0
ObjectState:            DC.B    0
MemBit15State:          DC.B    0
ModifiedMemValue:       DC.L    0"
  language="assembly"
/>

## Shift and Rotate Operations

The 68000 provides comprehensive shift and rotate instructions for bit manipulation:

### Logical Shift Operations
- **LSL**: Logical Shift Left (fill with zeros)
- **LSR**: Logical Shift Right (fill with zeros)

### Arithmetic Shift Operations
- **ASL**: Arithmetic Shift Left (same as LSL)
- **ASR**: Arithmetic Shift Right (preserve sign bit)

### Rotate Operations
- **ROL**: Rotate Left (bits wrap around)
- **ROR**: Rotate Right (bits wrap around)
- **ROXL**: Rotate Left through Extend (include X flag)
- **ROXR**: Rotate Right through Extend (include X flag)

<CodeRunner 
  system="commodore-amiga"
  title="Shift and Rotate Operations"
  code="; Demonstration of 68000 shift and rotate operations
; Shows comprehensive bit shifting and rotation capabilities

ShiftRotateDemo:
    ; === LOGICAL SHIFT LEFT (LSL) ===
    ; Shifts bits left, fills with zeros from right
    
    MOVE.L  #%00001111000011110000111100001111, D0 ; Test pattern
    LSL.L   #4, D0              ; Shift left 4 positions
    ; Result: zeros shift in from right
    MOVE.L  D0, LSLResult1      ; Store result
    
    ; Practical example: multiply by powers of 2
    MOVE.L  #100, D1            ; Start value
    LSL.L   #1, D1              ; Multiply by 2 (shift left 1)
    MOVE.L  D1, Multiply2       ; Store result (200)
    
    MOVE.L  #100, D2            ; Start value
    LSL.L   #3, D2              ; Multiply by 8 (shift left 3)
    MOVE.L  D2, Multiply8       ; Store result (800)
    
    ; === LOGICAL SHIFT RIGHT (LSR) ===
    ; Shifts bits right, fills with zeros from left
    
    MOVE.L  #%11110000111100001111000011110000, D3 ; Test pattern
    LSR.L   #4, D3              ; Shift right 4 positions
    ; Result: zeros shift in from left
    MOVE.L  D3, LSRResult1      ; Store result
    
    ; Practical example: divide by powers of 2 (unsigned)
    MOVE.L  #800, D4            ; Start value
    LSR.L   #3, D4              ; Divide by 8 (shift right 3)
    MOVE.L  D4, Divide8         ; Store result (100)
    
    ; === ARITHMETIC SHIFT LEFT (ASL) ===
    ; Same as LSL for positive numbers
    
    MOVE.L  #50, D5             ; Positive number
    ASL.L   #2, D5              ; Multiply by 4
    MOVE.L  D5, ASLPositive     ; Store result (200)
    
    ; === ARITHMETIC SHIFT RIGHT (ASR) ===
    ; Preserves sign bit for signed division
    
    MOVE.L  #-800, D6           ; Negative number
    ASR.L   #3, D6              ; Divide by 8, preserve sign
    MOVE.L  D6, ASRNegative     ; Store result (-100)
    
    MOVE.L  #800, D7            ; Positive number
    ASR.L   #3, D7              ; Divide by 8
    MOVE.L  D7, ASRPositive     ; Store result (100)
    
    ; === DEMONSTRATE SIGN PRESERVATION ===
    ; Compare LSR vs ASR for negative numbers
    
    MOVE.L  #-16, D0            ; Negative number
    MOVE.L  D0, D1              ; Copy for comparison
    
    LSR.L   #2, D0              ; Logical shift (treats as unsigned)
    ASR.L   #2, D1              ; Arithmetic shift (preserves sign)
    
    MOVE.L  D0, LSRNegative     ; Store LSR result (large positive)
    MOVE.L  D1, ASRNegativeComp ; Store ASR result (-4)
    
    ; === ROTATE LEFT (ROL) ===
    ; Bits rotate around, no bits lost
    
    MOVE.L  #%11110000000000000000000000001111, D2 ; Test pattern
    ROL.L   #8, D2              ; Rotate left 8 positions
    ; High bits wrap to low positions
    MOVE.L  D2, ROLResult1      ; Store result
    
    ; === ROTATE RIGHT (ROR) ===
    ; Bits rotate around to the left
    
    MOVE.L  #%11110000000000000000000000001111, D3 ; Test pattern
    ROR.L   #8, D3              ; Rotate right 8 positions
    ; Low bits wrap to high positions
    MOVE.L  D3, RORResult1      ; Store result
    
    ; === ROTATE WITH EXTEND (ROXL/ROXR) ===
    ; Include extend flag in rotation
    
    ; Set up extend flag
    MOVE.L  #$FFFFFFFF, D4      ; Maximum value
    ADD.L   #1, D4              ; This sets the X flag
    
    MOVE.L  #%01111111111111111111111111111111, D5 ; Test pattern
    ROXL.L  #1, D5              ; Rotate left through extend
    ; X flag becomes bit 0, bit 31 becomes new X
    MOVE.L  D5, ROXLResult1     ; Store result
    
    ; === VARIABLE SHIFT AMOUNTS ===
    ; Use register to specify shift count
    
    MOVE.L  #$12345678, D6      ; Test value
    MOVE.L  #5, D7              ; Shift count in register
    
    LSL.L   D7, D6              ; Shift left by amount in D7
    MOVE.L  D6, VariableShift   ; Store result
    
    ; === PRACTICAL EXAMPLE: BIT FIELD EXTRACTION ===
    ; Extract bit fields using shifts and masks
    
    ; Extract 12-bit value from bits 8-19 of a 32-bit word
    MOVE.L  #$12345678, D0      ; Source data
    
    ; Method 1: Shift then mask
    LSR.L   #8, D0              ; Shift right to position field
    AND.L   #$FFF, D0           ; Mask to 12 bits
    MOVE.L  D0, ExtractedField1 ; Store result
    
    ; Method 2: Mask then shift
    MOVE.L  #$12345678, D1      ; Source data again
    AND.L   #$FFF00, D1         ; Mask field in place
    LSR.L   #8, D1              ; Shift to right position
    MOVE.L  D1, ExtractedField2 ; Store result (should match)
    
    ; === PRACTICAL EXAMPLE: BIT FIELD INSERTION ===
    ; Insert bit field using shifts and masks
    
    MOVE.L  #$FF000000, D2      ; Destination with field cleared
    MOVE.L  #$123, D3           ; Value to insert (12 bits)
    
    ; Ensure value fits in field
    AND.L   #$FFF, D3           ; Mask to 12 bits
    LSL.L   #8, D3              ; Shift to target position
    OR.L    D3, D2              ; Insert into destination
    MOVE.L  D2, InsertedField   ; Store result
    
    ; === PRACTICAL EXAMPLE: ENDIAN CONVERSION ===
    ; Swap byte order using rotates
    
    MOVE.L  #$12345678, D4      ; Original value (big-endian)
    
    ; Swap to little-endian using rotates
    ROL.W   #8, D4              ; Swap bytes in low word
    SWAP    D4                  ; Swap words
    ROL.W   #8, D4              ; Swap bytes in new low word
    MOVE.L  D4, SwappedEndian   ; Store little-endian result
    
    ; === PRACTICAL EXAMPLE: CHECKSUM CALCULATION ===
    ; Calculate simple checksum using rotates
    
    MOVE.L  #ChecksumData, A0   ; Data to checksum
    MOVE.L  #0, D5              ; Initialize checksum
    MOVE.L  #7, D7              ; Process 8 bytes
    
ChecksumLoop:
    MOVE.B  (A0)+, D6           ; Load next byte
    ADD.L   D6, D5              ; Add to checksum
    ROL.L   #1, D5              ; Rotate checksum
    DBRA    D7, ChecksumLoop    ; Continue for all bytes
    
    MOVE.L  D5, CalculatedChecksum ; Store final checksum
    
    ; === PRACTICAL EXAMPLE: PSEUDO-RANDOM NUMBERS ===
    ; Generate pseudo-random numbers using shifts and XOR
    
    MOVE.L  RandomSeed, D0      ; Load current seed
    
    ; Linear feedback shift register algorithm
    MOVE.L  D0, D1              ; Copy seed
    LSL.L   #1, D0              ; Shift left
    EOR.L   D1, D0              ; XOR with original
    ROL.L   #7, D0              ; Rotate for mixing
    EOR.L   #$A3C5F7E9, D0      ; XOR with constant
    
    MOVE.L  D0, RandomSeed      ; Store new seed
    MOVE.L  D0, RandomNumber    ; Store generated number
    
    ; === MULTI-PRECISION SHIFTS ===
    ; Shift 64-bit value using two 32-bit registers
    
    MOVE.L  #$12345678, D0      ; High 32 bits
    MOVE.L  #$9ABCDEF0, D1      ; Low 32 bits
    
    ; Shift 64-bit value left by 4 positions
    MOVE.L  #4, D2              ; Shift count
    
MultiShiftLoop:
    LSL.L   #1, D1              ; Shift low word left
    ROXL.L  #1, D0              ; Rotate high word left with carry
    SUBQ.L  #1, D2              ; Decrement counter
    BNE     MultiShiftLoop      ; Continue shifting
    
    MOVE.L  D0, Shift64High     ; Store high result
    MOVE.L  D1, Shift64Low      ; Store low result
    
    RTS

; Data for examples
ChecksumData:       DC.B    $12,$34,$56,$78,$9A,$BC,$DE,$F0
RandomSeed:         DC.L    $12345678

; Results storage
LSLResult1:         DC.L    0
Multiply2:          DC.L    0
Multiply8:          DC.L    0
LSRResult1:         DC.L    0
Divide8:            DC.L    0
ASLPositive:        DC.L    0
ASRNegative:        DC.L    0
ASRPositive:        DC.L    0
LSRNegative:        DC.L    0
ASRNegativeComp:    DC.L    0
ROLResult1:         DC.L    0
RORResult1:         DC.L    0
ROXLResult1:        DC.L    0
VariableShift:      DC.L    0
ExtractedField1:    DC.L    0
ExtractedField2:    DC.L    0
InsertedField:      DC.L    0
SwappedEndian:      DC.L    0
CalculatedChecksum: DC.L    0
RandomNumber:       DC.L    0
Shift64High:        DC.L    0
Shift64Low:         DC.L    0"
  language="assembly"
/>

## Advanced Bit Manipulation Techniques

The 68000's bit manipulation capabilities enable sophisticated programming patterns:

### Complex Bit Patterns
- Multiple bit operations in sequence
- Bit field manipulation and extraction
- Data packing and unpacking

### Performance Considerations
- Bit operations are very fast on the 68000
- Prefer bit operations over arithmetic when appropriate
- Use immediate values for better performance

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Bit Manipulation Techniques"
  code="; Advanced bit manipulation programming techniques
; Demonstrates sophisticated bit manipulation patterns

AdvancedBitManipulation:
    ; === BIT FIELD MANIPULATION ===
    ; Advanced techniques for working with bit fields
    
    ; Extract RGB components from 24-bit colour
    MOVE.L  #$FF8040, D0        ; 24-bit RGB: R=$FF, G=$80, B=$40
    
    ; Extract red component (bits 16-23)
    MOVE.L  D0, D1              ; Copy colour
    LSR.L   #8, D1              ; Shift right 16 positions
    LSR.L   #8, D1              ; (done in steps for clarity)
    AND.L   #$FF, D1            ; Mask to 8 bits
    MOVE.B  D1, RGB24_Red       ; Store red component
    
    ; Extract green component (bits 8-15)
    MOVE.L  D0, D2              ; Copy colour
    LSR.L   #8, D2              ; Shift right 8 positions
    AND.L   #$FF, D2            ; Mask to 8 bits
    MOVE.B  D2, RGB24_Green     ; Store green component
    
    ; Extract blue component (bits 0-7)
    MOVE.L  D0, D3              ; Copy colour
    AND.L   #$FF, D3            ; Mask to 8 bits
    MOVE.B  D3, RGB24_Blue      ; Store blue component
    
    ; Convert 24-bit RGB to 12-bit RGB (4 bits per component)
    MOVE.B  RGB24_Red, D1       ; Load red
    LSR.B   #4, D1              ; Reduce from 8 to 4 bits
    MOVE.B  RGB24_Green, D2     ; Load green
    LSR.B   #4, D2              ; Reduce from 8 to 4 bits
    MOVE.B  RGB24_Blue, D3      ; Load blue
    LSR.B   #4, D3              ; Reduce from 8 to 4 bits
    
    ; Pack into 12-bit format
    CLR.W   D4                  ; Clear destination
    LSL.W   #4, D4              ; Make room for red
    OR.B    D1, D4              ; Pack red
    LSL.W   #4, D4              ; Make room for green
    OR.B    D2, D4              ; Pack green
    LSL.W   #4, D4              ; Make room for blue
    OR.B    D3, D4              ; Pack blue
    
    MOVE.W  D4, RGB12_Packed    ; Store 12-bit colour
    
    ; === BIT COUNTING ALGORITHMS ===
    ; Count number of set bits in a value
    
    MOVE.L  #$12345678, D0      ; Test value
    MOVE.L  #0, D1              ; Bit counter
    MOVE.L  #31, D7             ; Bit position counter
    
BitCountLoop:
    BTST    D7, D0              ; Test bit at position D7
    BEQ     BitNotSet           ; Branch if bit is clear
    ADDQ.L  #1, D1              ; Increment set bit counter
    
BitNotSet:
    DBRA    D7, BitCountLoop    ; Continue for all bits
    
    MOVE.L  D1, SetBitCount     ; Store count
    
    ; Alternative: Fast bit counting using Brian Kernighan's algorithm
    MOVE.L  #$12345678, D0      ; Test value (fresh copy)
    MOVE.L  #0, D2              ; Fast counter
    
FastBitCountLoop:
    TST.L   D0                  ; Check if any bits remain
    BEQ     FastCountDone       ; Exit if no bits set
    
    MOVE.L  D0, D3              ; Copy value
    SUBQ.L  #1, D3              ; Subtract 1
    AND.L   D3, D0              ; Clear lowest set bit
    ADDQ.L  #1, D2              ; Increment counter
    BRA     FastBitCountLoop    ; Continue
    
FastCountDone:
    MOVE.L  D2, FastBitCount    ; Store fast count
    
    ; === FIND FIRST SET BIT ===
    ; Find position of first (lowest) set bit
    
    MOVE.L  #$12345600, D0      ; Test value (lowest bits clear)
    MOVE.L  #0, D1              ; Position counter
    
FindFirstSetLoop:
    BTST    D1, D0              ; Test bit at current position
    BNE     FirstSetFound       ; Branch if bit is set
    ADDQ.L  #1, D1              ; Try next position
    CMP.L   #32, D1             ; Check all positions
    BNE     FindFirstSetLoop    ; Continue searching
    
    ; No set bit found
    MOVE.L  #-1, D1             ; Indicate not found
    
FirstSetFound:
    MOVE.L  D1, FirstSetPosition ; Store position
    
    ; === FIND LAST SET BIT ===
    ; Find position of last (highest) set bit
    
    MOVE.L  #$12345678, D0      ; Test value
    MOVE.L  #31, D1             ; Start from highest position
    
FindLastSetLoop:
    BTST    D1, D0              ; Test bit at current position
    BNE     LastSetFound        ; Branch if bit is set
    SUBQ.L  #1, D1              ; Try previous position
    BMI     NoLastSetFound      ; Branch if went below 0
    BRA     FindLastSetLoop     ; Continue searching
    
NoLastSetFound:
    MOVE.L  #-1, D1             ; Indicate not found
    
LastSetFound:
    MOVE.L  D1, LastSetPosition ; Store position
    
    ; === BIT REVERSAL ===
    ; Reverse bit order in a 32-bit value
    
    MOVE.L  #$12345678, D0      ; Source value
    MOVE.L  #0, D1              ; Destination
    MOVE.L  #31, D7             ; Bit counter
    
BitReverseLoop:
    LSL.L   #1, D1              ; Shift destination left
    LSR.L   #1, D0              ; Shift source right
    BCC     NoSetBit            ; Branch if no carry (bit was 0)
    BSET    #0, D1              ; Set bit 0 in destination
    
NoSetBit:
    DBRA    D7, BitReverseLoop  ; Continue for all bits
    
    MOVE.L  D1, ReversedBits    ; Store reversed value
    
    ; === GRAY CODE CONVERSION ===
    ; Convert binary to Gray code and vice versa
    
    MOVE.L  #42, D0             ; Binary value to convert
    
    ; Binary to Gray code
    MOVE.L  D0, D1              ; Copy binary value
    LSR.L   #1, D1              ; Shift right 1 position
    EOR.L   D1, D0              ; XOR with shifted version
    MOVE.L  D0, GrayCodeValue   ; Store Gray code
    
    ; Gray code back to binary
    MOVE.L  D0, D2              ; Copy Gray code
    MOVE.L  #1, D3              ; Shift amount
    
GrayToBinaryLoop:
    CMP.L   #32, D3             ; Check if done all shifts
    BGE     GrayConversionDone  ; Exit if done
    
    MOVE.L  D2, D4              ; Copy current value
    LSR.L   D3, D4              ; Shift by current amount
    EOR.L   D4, D2              ; XOR with shifted version
    LSL.L   #1, D3              ; Double shift amount
    BRA     GrayToBinaryLoop    ; Continue
    
GrayConversionDone:
    MOVE.L  D2, BinaryFromGray  ; Store converted binary
    
    ; === PARITY CALCULATION ===
    ; Calculate even/odd parity of a value
    
    MOVE.L  #$12345678, D0      ; Value to check
    MOVE.L  D0, D1              ; Copy for parity calculation
    
    ; XOR all bits together to get parity
    MOVE.L  D1, D2              ; Copy value
    LSR.L   #8, D2              ; Shift right 16
    LSR.L   #8, D2
    EOR.L   D2, D1              ; XOR with shifted
    
    MOVE.L  D1, D2              ; Copy result
    LSR.L   #8, D2              ; Shift right 8
    EOR.L   D2, D1              ; XOR with shifted
    
    MOVE.L  D1, D2              ; Copy result
    LSR.L   #4, D2              ; Shift right 4
    EOR.L   D2, D1              ; XOR with shifted
    
    MOVE.L  D1, D2              ; Copy result
    LSR.L   #2, D2              ; Shift right 2
    EOR.L   D2, D1              ; XOR with shifted
    
    MOVE.L  D1, D2              ; Copy result
    LSR.L   #1, D2              ; Shift right 1
    EOR.L   D2, D1              ; XOR with shifted
    
    AND.L   #1, D1              ; Mask to get parity bit
    MOVE.B  D1, ParityBit       ; Store parity (0=even, 1=odd)
    
    ; === MORTON CODE (Z-ORDER CURVE) ===
    ; Interleave bits of two 16-bit coordinates
    
    MOVE.W  #$1234, D0          ; X coordinate
    MOVE.W  #$5678, D1          ; Y coordinate
    
    ; Expand each 16-bit value to 32-bit with interleaved zeros
    JSR     ExpandBits          ; Expand D0 (X)
    MOVE.L  D0, D2              ; Save expanded X
    
    MOVE.L  D1, D0              ; Move Y to D0
    JSR     ExpandBits          ; Expand D1 (Y)
    LSL.L   #1, D0              ; Shift Y left 1 position
    
    OR.L    D2, D0              ; Combine X and Y
    MOVE.L  D0, MortonCode      ; Store Morton code
    
    RTS

; Subroutine to expand 16-bit value to 32-bit with interleaved zeros
ExpandBits:
    ; Input: D0 = 16-bit value
    ; Output: D0 = 32-bit expanded value
    
    AND.L   #$0000FFFF, D0      ; Ensure only 16 bits
    
    ; Spread bits using binary magic
    MOVE.L  D0, D1
    LSL.L   #8, D1
    OR.L    D1, D0
    AND.L   #$00FF00FF, D0
    
    MOVE.L  D0, D1
    LSL.L   #4, D1
    OR.L    D1, D0
    AND.L   #$0F0F0F0F, D0
    
    MOVE.L  D0, D1
    LSL.L   #2, D1
    OR.L    D1, D0
    AND.L   #$33333333, D0
    
    MOVE.L  D0, D1
    LSL.L   #1, D1
    OR.L    D1, D0
    AND.L   #$55555555, D0
    
    RTS

; Data storage
RGB24_Red:          DC.B    0
RGB24_Green:        DC.B    0
RGB24_Blue:         DC.B    0
RGB12_Packed:       DC.W    0
SetBitCount:        DC.L    0
FastBitCount:       DC.L    0
FirstSetPosition:   DC.L    0
LastSetPosition:    DC.L    0
ReversedBits:       DC.L    0
GrayCodeValue:      DC.L    0
BinaryFromGray:     DC.L    0
ParityBit:          DC.B    0
MortonCode:         DC.L    0"
  language="assembly"
/>

## Practice Exercise

<CodeRunner 
  system="commodore-amiga"
  title="Bit Manipulation Practice"
  code="; Practice Exercise: Amiga Graphics Bit Manipulation Engine
; Use bit operations for advanced graphics programming

GraphicsBitEngine:
    ; Initialize graphics bit manipulation system
    JSR     InitializeBitEngine
    
    ; Process bitmap graphics
    JSR     ProcessBitmapGraphics
    
    ; Generate bit patterns
    JSR     GenerateBitPatterns
    
    ; Implement image effects
    JSR     ImplementImageEffects
    
    ; Optimize sprite masks
    JSR     OptimizeSpriteMasks
    
    RTS

InitializeBitEngine:
    ; Set up graphics data areas
    MOVE.L  #BitmapData, A0     ; Bitmap data base
    MOVE.L  #PatternData, A1    ; Pattern generation area
    MOVE.L  #SpriteData, A2     ; Sprite data area
    MOVE.L  #MaskData, A3       ; Mask generation area
    
    ; Clear working registers
    MOVEQ   #0, D0
    MOVEQ   #0, D1
    MOVEQ   #0, D2
    MOVEQ   #0, D3
    
    RTS

ProcessBitmapGraphics:
    ; Process 8x8 pixel bitmap graphics using bit manipulation
    MOVE.L  #BITMAP_COUNT-1, D7 ; Process multiple bitmaps
    MOVE.L  A0, A4              ; Bitmap data pointer
    
BitmapProcessLoop:
    ; Load 8 bytes of bitmap data (8x8 pixels, 1 bit per pixel)
    MOVE.L  (A4)+, D0           ; Load first 4 bytes
    MOVE.L  (A4)+, D1           ; Load next 4 bytes
    
    ; Invert bitmap (create negative image)
    NOT.L   D0                  ; Invert first 4 bytes
    NOT.L   D1                  ; Invert next 4 bytes
    
    ; Store inverted bitmap
    MOVE.L  D0, (A3)+           ; Store inverted first 4 bytes
    MOVE.L  D1, (A3)+           ; Store inverted next 4 bytes
    
    ; Create horizontal mirror of original bitmap
    MOVE.L  (A4-8), D2          ; Reload original first 4 bytes
    MOVE.L  (A4-4), D3          ; Reload original next 4 bytes
    
    ; Mirror each byte horizontally
    JSR     MirrorByte          ; Mirror D2 bytes
    MOVE.L  D2, (A3)+           ; Store mirrored first 4 bytes
    
    MOVE.L  D3, D2              ; Move second half to D2
    JSR     MirrorByte          ; Mirror D3 bytes
    MOVE.L  D2, (A3)+           ; Store mirrored next 4 bytes
    
    DBRA    D7, BitmapProcessLoop ; Continue for all bitmaps
    
    RTS

; Subroutine to mirror bytes horizontally
MirrorByte:
    ; Input: D2 contains 4 bytes to mirror
    ; Output: D2 contains 4 mirrored bytes
    
    MOVE.L  #3, D6              ; Process 4 bytes
    
MirrorByteLoop:
    ; Extract one byte and mirror it
    MOVE.L  D2, D4              ; Copy data
    LSR.L   #8, D2              ; Shift to next byte
    AND.L   #$FF, D4            ; Mask to one byte
    
    ; Mirror 8 bits using lookup table
    LEA     BitMirrorTable, A5  ; Bit mirror lookup table
    MOVE.B  0(A5,D4.L), D5      ; Look up mirrored byte
    
    ; Reconstruct the long word
    LSL.L   #8, D3              ; Make room for mirrored byte
    OR.B    D5, D3              ; Insert mirrored byte
    
    DBRA    D6, MirrorByteLoop  ; Continue for all bytes
    
    MOVE.L  D3, D2              ; Return result in D2
    RTS

GenerateBitPatterns:
    ; Generate various bit patterns for graphics effects
    MOVE.L  #PATTERN_COUNT-1, D7 ; Generate multiple patterns
    MOVE.L  A1, A4              ; Pattern data pointer
    
PatternGenerateLoop:
    ; Generate checkerboard pattern
    MOVE.L  D7, D0              ; Use loop counter as seed
    
    ; Create 8x8 checkerboard
    MOVE.L  #7, D6              ; 8 rows
    
CheckerboardRowLoop:
    ; Alternate between $AA and $55 for checkerboard
    BTST    #0, D6              ; Test row parity
    BNE     OddCheckerRow       ; Branch if odd row
    
    ; Even row
    MOVE.B  #$AA, D1            ; Alternating pattern
    BRA     StoreCheckerRow
    
OddCheckerRow:
    ; Odd row
    MOVE.B  #$55, D1            ; Inverse alternating pattern
    
StoreCheckerRow:
    MOVE.B  D1, (A4)+           ; Store row pattern
    DBRA    D6, CheckerboardRowLoop ; Continue for all rows
    
    ; Generate gradient pattern
    MOVE.L  #7, D6              ; 8 rows
    MOVE.L  #0, D5              ; Start intensity
    
GradientRowLoop:
    ; Create gradient from top to bottom
    MOVE.L  D5, D1              ; Current intensity
    LSL.L   #5, D1              ; Scale intensity
    
    ; Create dither pattern based on intensity
    CMP.L   #64, D1             ; Check intensity level
    BLT     LowIntensity        ; Branch if low
    CMP.L   #128, D1            ; Check medium intensity
    BLT     MedIntensity        ; Branch if medium
    CMP.L   #192, D1            ; Check high intensity
    BLT     HighIntensity       ; Branch if high
    
    ; Very high intensity
    MOVE.B  #$FF, D1            ; Solid
    BRA     StoreGradientRow
    
HighIntensity:
    MOVE.B  #$F0, D1            ; Dense pattern
    BRA     StoreGradientRow
    
MedIntensity:
    MOVE.B  #$CC, D1            ; Medium pattern
    BRA     StoreGradientRow
    
LowIntensity:
    MOVE.B  #$88, D1            ; Sparse pattern
    
StoreGradientRow:
    MOVE.B  D1, (A4)+           ; Store gradient row
    ADDQ.L  #8, D5              ; Increase intensity
    DBRA    D6, GradientRowLoop ; Continue for all rows
    
    DBRA    D7, PatternGenerateLoop ; Continue for all patterns
    
    RTS

ImplementImageEffects:
    ; Implement various image effects using bit manipulation
    MOVE.L  #EffectData, A5     ; Source image data
    MOVE.L  #EffectOutput, A6   ; Output area
    
    ; === EDGE DETECTION EFFECT ===
    ; Simple edge detection using XOR with shifted image
    
    MOVE.L  #IMAGE_HEIGHT-1, D7 ; Process image rows
    
EdgeDetectLoop:
    MOVE.L  (A5), D0            ; Load current row
    MOVE.L  4(A5), D1           ; Load next row
    EOR.L   D1, D0              ; XOR for edge detection
    MOVE.L  D0, (A6)+           ; Store edge-detected row
    ADDQ.L  #4, A5              ; Move to next source row
    DBRA    D7, EdgeDetectLoop  ; Continue for all rows
    
    ; === EMBOSS EFFECT ===
    ; Create emboss effect using bit shifts and subtraction
    
    MOVE.L  #EffectData, A5     ; Reset source pointer
    MOVE.L  #IMAGE_HEIGHT-1, D7 ; Process image rows
    
EmbossLoop:
    MOVE.L  (A5), D0            ; Load current pixel data
    MOVE.L  D0, D1              ; Copy for processing
    
    ; Shift image diagonally
    LSR.L   #1, D1              ; Shift right (simulate light from top-left)
    SUB.L   D1, D0              ; Subtract shifted from original
    
    ; Ensure result stays in valid range
    BPL     EmbossPositive      ; Branch if positive
    CLR.L   D0                  ; Clamp negative to zero
    
EmbossPositive:
    MOVE.L  D0, (A6)+           ; Store embossed data
    ADDQ.L  #4, A5              ; Move to next source row
    DBRA    D7, EmbossLoop      ; Continue for all rows
    
    ; === PIXELATE EFFECT ===
    ; Create pixelation by repeating pixel blocks
    
    MOVE.L  #EffectData, A5     ; Reset source pointer
    MOVE.L  #IMAGE_HEIGHT/2-1, D7 ; Process every other row
    
PixelateLoop:
    MOVE.L  (A5), D0            ; Load source row
    
    ; Expand pixels horizontally (2x2 blocks)
    MOVE.L  #0, D1              ; Clear destination
    MOVE.L  #7, D6              ; Process 8 pixels (4 become 8)
    
PixelExpandLoop:
    LSL.L   #2, D1              ; Make room for 2 pixels
    LSR.L   #2, D0              ; Get next 2 source pixels
    MOVE.L  D0, D2              ; Copy source bits
    AND.L   #3, D2              ; Mask to 2 bits
    
    ; Replicate 2 bits to 4 bits
    LSL.L   #2, D2              ; Shift up
    OR.L    D2, D1              ; Combine with previous
    
    DBRA    D6, PixelExpandLoop ; Continue for all pixels
    
    ; Store pixelated row twice (vertical duplication)
    MOVE.L  D1, (A6)+           ; Store first copy
    MOVE.L  D1, (A6)+           ; Store second copy (2x2 blocks)
    
    ADDQ.L  #8, A5              ; Skip next source row (scaling)
    DBRA    D7, PixelateLoop    ; Continue for all rows
    
    RTS

OptimizeSpriteMasks:
    ; Generate optimized sprite masks for collision detection
    MOVE.L  A2, A5              ; Sprite data pointer
    MOVE.L  #SpriteCache, A6    ; Optimized cache area
    MOVE.L  #SPRITE_COUNT-1, D7 ; Process all sprites
    
SpriteMaskLoop:
    ; Load 16x16 sprite data (32 bytes)
    MOVE.L  #7, D6              ; Process 8 longs (32 bytes)
    MOVE.L  #0, D4              ; Combined mask accumulator
    
SpriteMaskRowLoop:
    MOVE.L  (A5)+, D0           ; Load 4 bytes of sprite data
    
    ; Create collision mask (any non-zero pixel becomes 1)
    TST.L   D0                  ; Test if any bits set
    BEQ     NoCollisionBits     ; Branch if no pixels
    
    ; Convert non-zero pixels to collision bits
    MOVE.L  D0, D1              ; Copy sprite data
    
    ; Use bit manipulation to create collision mask
    MOVE.L  D1, D2              ; Copy for processing
    LSR.L   #1, D2              ; Shift right
    OR.L    D2, D1              ; OR with shifted (spread bits)
    
    MOVE.L  D1, D2              ; Copy result
    LSR.L   #2, D2              ; Shift right 2
    OR.L    D2, D1              ; OR with shifted (spread more)
    
    MOVE.L  D1, D2              ; Copy result
    LSR.L   #4, D2              ; Shift right 4
    OR.L    D2, D1              ; OR with shifted (spread even more)
    
    ; Combine with accumulator
    OR.L    D1, D4              ; Add to combined mask
    
NoCollisionBits:
    DBRA    D6, SpriteMaskRowLoop ; Continue for all sprite rows
    
    ; Store optimized collision mask
    MOVE.L  D4, (A6)+           ; Store collision mask
    
    ; Generate bounding box
    JSR     CalculateBoundingBox ; Calculate tight bounding box
    MOVE.W  D0, (A6)+           ; Store min X, min Y
    MOVE.W  D1, (A6)+           ; Store max X, max Y
    
    DBRA    D7, SpriteMaskLoop  ; Continue for all sprites
    
    RTS

CalculateBoundingBox:
    ; Calculate tight bounding box for sprite
    ; Input: A5 points to sprite data
    ; Output: D0 = min X/Y, D1 = max X/Y
    
    MOVE.W  #$FFFF, D0          ; Initialize min values (high)
    MOVE.W  #$0000, D1          ; Initialize max values (low)
    
    ; Scan sprite data to find bounds
    MOVE.L  A5, A4              ; Copy sprite pointer
    SUBA.L  #32, A4             ; Go back to start of sprite
    
    MOVE.L  #15, D7             ; 16 rows
    MOVE.L  #0, D6              ; Current Y position
    
BoundingScanLoop:
    MOVE.W  (A4)+, D2           ; Load row data (16 pixels)
    TST.W   D2                  ; Test if any pixels in row
    BEQ     EmptyBoundingRow    ; Skip if empty row
    
    ; Find leftmost pixel
    MOVE.L  #15, D5             ; Start from left
    
FindLeftBound:
    BTST    D5, D2              ; Test pixel at position
    BNE     FoundLeftBound      ; Found leftmost pixel
    SUBQ.L  #1, D5              ; Move right
    BMI     EmptyBoundingRow    ; No pixels in row
    BRA     FindLeftBound       ; Continue searching
    
FoundLeftBound:
    ; Update minimum X if needed
    CMP.W   D0, D5              ; Compare with current min X
    BGE     CheckRightBound     ; Skip if not smaller
    MOVE.W  D5, D0              ; Update min X
    
CheckRightBound:
    ; Find rightmost pixel
    MOVE.L  #0, D5              ; Start from right
    
FindRightBound:
    BTST    D5, D2              ; Test pixel at position
    BNE     FoundRightBound     ; Found rightmost pixel
    ADDQ.L  #1, D5              ; Move left
    CMP.L   #16, D5             ; Check bounds
    BGE     EmptyBoundingRow    ; No more pixels
    BRA     FindRightBound      ; Continue searching
    
FoundRightBound:
    ; Update maximum X if needed
    SWAP    D1                  ; Access high word (max X)
    CMP.W   D1, D5              ; Compare with current max X
    BLE     CheckYBounds        ; Skip if not larger
    MOVE.W  D5, D1              ; Update max X
    
CheckYBounds:
    SWAP    D1                  ; Access low word (max Y)
    
    ; Update Y bounds
    SWAP    D0                  ; Access high word (min Y)
    CMP.W   D0, D6              ; Compare with current min Y
    BGE     CheckMaxY           ; Skip if not smaller
    MOVE.W  D6, D0              ; Update min Y
    
CheckMaxY:
    CMP.W   D1, D6              ; Compare with current max Y
    BLE     EmptyBoundingRow    ; Skip if not larger
    MOVE.W  D6, D1              ; Update max Y
    
EmptyBoundingRow:
    ADDQ.L  #1, D6              ; Next Y position
    DBRA    D7, BoundingScanLoop ; Continue for all rows
    
    ; Restore register format
    SWAP    D0                  ; D0 = min X, min Y
    SWAP    D1                  ; D1 = max X, max Y
    
    RTS

; Constants
BITMAP_COUNT        EQU     4
PATTERN_COUNT       EQU     8
SPRITE_COUNT        EQU     16
IMAGE_HEIGHT        EQU     64

; Data areas
BitmapData:         ; 4 bitmaps, 8 bytes each
    DC.L    $12345678, $9ABCDEF0
    DC.L    $FEDCBA09, $87654321
    DC.L    $11223344, $55667788
    DC.L    $99AABBCC, $DDEEFF00

PatternData:        DS.B    PATTERN_COUNT*8

SpriteData:         ; 16 sprites, 32 bytes each
    DS.B    SPRITE_COUNT*32

MaskData:           DS.B    BITMAP_COUNT*16  ; Space for processed bitmaps

EffectData:         ; Sample image data for effects
    DC.L    $FF000000, $00FF0000, $0000FF00, $000000FF
    DC.L    $F0F0F0F0, $0F0F0F0F, $CCCCCCCC, $33333333
    DC.L    $AAAAAAAA, $55555555, $12345678, $87654321
    DC.L    $FEDCBA09, $10203040, $50607080, $90A0B0C0

EffectOutput:       DS.B    IMAGE_HEIGHT*4

SpriteCache:        DS.B    SPRITE_COUNT*8   ; Optimized sprite data

; Bit mirror lookup table (mirrors 8 bits)
BitMirrorTable:
    DC.B    $00,$80,$40,$C0,$20,$A0,$60,$E0,$10,$90,$50,$D0,$30,$B0,$70,$F0
    DC.B    $08,$88,$48,$C8,$28,$A8,$68,$E8,$18,$98,$58,$D8,$38,$B8,$78,$F8
    DC.B    $04,$84,$44,$C4,$24,$A4,$64,$E4,$14,$94,$54,$D4,$34,$B4,$74,$F4
    DC.B    $0C,$8C,$4C,$CC,$2C,$AC,$6C,$EC,$1C,$9C,$5C,$DC,$3C,$BC,$7C,$FC
    DC.B    $02,$82,$42,$C2,$22,$A2,$62,$E2,$12,$92,$52,$D2,$32,$B2,$72,$F2
    DC.B    $0A,$8A,$4A,$CA,$2A,$AA,$6A,$EA,$1A,$9A,$5A,$DA,$3A,$BA,$7A,$FA
    DC.B    $06,$86,$46,$C6,$26,$A6,$66,$E6,$16,$96,$56,$D6,$36,$B6,$76,$F6
    DC.B    $0E,$8E,$4E,$CE,$2E,$AE,$6E,$EE,$1E,$9E,$5E,$DE,$3E,$BE,$7E,$FE
    DC.B    $01,$81,$41,$C1,$21,$A1,$61,$E1,$11,$91,$51,$D1,$31,$B1,$71,$F1
    DC.B    $09,$89,$49,$C9,$29,$A9,$69,$E9,$19,$99,$59,$D9,$39,$B9,$79,$F9
    DC.B    $05,$85,$45,$C5,$25,$A5,$65,$E5,$15,$95,$55,$D5,$35,$B5,$75,$F5
    DC.B    $0D,$8D,$4D,$CD,$2D,$AD,$6D,$ED,$1D,$9D,$5D,$DD,$3D,$BD,$7D,$FD
    DC.B    $03,$83,$43,$C3,$23,$A3,$63,$E3,$13,$93,$53,$D3,$33,$B3,$73,$F3
    DC.B    $0B,$8B,$4B,$CB,$2B,$AB,$6B,$EB,$1B,$9B,$5B,$DB,$3B,$BB,$7B,$FB
    DC.B    $07,$87,$47,$C7,$27,$A7,$67,$E7,$17,$97,$57,$D7,$37,$B7,$77,$F7
    DC.B    $0F,$8F,$4F,$CF,$2F,$AF,$6F,$EF,$1F,$9F,$5F,$DF,$3F,$BF,$7F,$FF

; Challenge exercises:
; 1. Implement fast bitmap scaling using bit manipulation
; 2. Create advanced dithering algorithms
; 3. Add compression/decompression using bit packing
; 4. Implement colour space conversions using bit fields"
  language="assembly"
/>

## What You've Learned

In this lesson, you've discovered:

1. **Logical Operations** - AND, OR, EOR, and NOT for comprehensive bit manipulation
2. **Bit Test Instructions** - BTST, BSET, BCLR, BCHG for precise bit control
3. **Shift Operations** - LSL, LSR, ASL, ASR for arithmetic and data movement
4. **Rotate Operations** - ROL, ROR, ROXL, ROXR for bit pattern manipulation
5. **Advanced Techniques** - Complex bit manipulation patterns for real-world applications

## Looking Ahead

Next, you'll learn about the 68000's program flow control mechanisms - how to structure your programs using branches, loops, and subroutines. You'll discover how the sophisticated condition codes and addressing modes make program control much more elegant than on 8-bit processors!

## Fun Fact

The 68000's bit manipulation instructions were revolutionary for their completeness and orthogonality. Unlike many processors where bit operations were limited or awkward, the 68000 allowed bit testing and modification on any bit position in memory or registers, with both immediate and register-specified bit positions. The atomic nature of BSET, BCLR, and BCHG made them invaluable for multi-tasking operating systems, as they could safely modify shared flags without race conditions. The comprehensive shift and rotate instructions, including operations through the extend flag, made multi-precision arithmetic and advanced bit manipulation algorithms much easier to implement. These capabilities made the 68000 particularly well-suited for graphics programming, where bit manipulation is essential for pixel operations, colour conversion, and image processing. Many of the techniques you've learned were used extensively in Amiga games and applications to achieve effects that seemed impossible on less capable processors!