---
title: "6502 Logical Operations and Bit Manipulation"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 7
description: "Learn 6502 logical operations and advanced bit manipulation techniques. Learn bit masking, data filtering, and efficient algorithms using the 6502's powerful logical capabilities for NES programming."
learning_objectives:
  - "Learn AND, OR, XOR, and BIT logical operations"
  - "Learn advanced bit testing and manipulation techniques"
  - "Practice bit masking and data filtering methods"
  - "Build efficient data processing algorithms"
  - "Create programs using logical operations for NES hardware control"
concepts:
  - "Logical operations (AND, OR, XOR)"
  - "BIT instruction for non-destructive testing"
  - "Bit masking and data filtering techniques"
  - "Data packing and unpacking methods"
  - "NES hardware register manipulation"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 7
---

# Lesson 7: 6502 Logical Operations and Bit Manipulation

The 6502's logical operations are among its most powerful features. Today you'll learn these operations and discover how they're used to create efficient algorithms, process data, and control NES hardware with precision!

## 6502 Logical Operations

### AND - Logical AND
Each bit is 1 only if both corresponding bits are 1
**Primary use**: Masking (clearing unwanted bits)

```text
LDA #%11010110     ; Original data
AND #%00001111     ; Keep only lower 4 bits → %00000110
```

### OR - Logical OR  
Each bit is 1 if either corresponding bit is 1
**Primary use**: Setting specific bits

```text
LDA #%00010010     ; Original data
ORA #%10000001     ; Set bits 7 and 0 → %10010011
```

### XOR - Logical Exclusive OR
Each bit is 1 if corresponding bits are different
**Primary use**: Toggling bits, encryption, comparisons

```text
LDA #%11010110     ; Original data
EOR #%01010101     ; Toggle specific bits → %10000011
```

**Basic Logical Operations:**

```assembly
; Demonstration of 6502 logical operations
; These operations are fundamental for bit manipulation in NES programming

LogicalOpsDemo:
    ; === LOGICAL AND - BIT MASKING ===
    ; Extract specific bits from data
    LDA #%11010110  ; Original value: bits 7,6,4,2,1 set
    AND #%00001111  ; Mask to keep only lower 4 bits
    STA $0200       ; Result: %00000110 (bits 2,1 remain)
    
    ; === LOGICAL OR - BIT SETTING ===
    ; Set specific bits in data
    LDA #%00010010  ; Original value: bits 4,1 set
    ORA #%10000001  ; Set bits 7 and 0
    STA $0201       ; Result: %10010011 (bits 7,4,1,0 set)
    
    ; === LOGICAL XOR - BIT TOGGLING ===
    ; Toggle specific bits in data
    LDA #%11010110  ; Original value
    EOR #%01010101  ; Toggle bits 6,4,2,0
    STA $0202       ; Result: %10000011 (bits toggled)
    
    ; === PRACTICAL EXAMPLE: NES PPU CONTROL ===
    ; Manipulate NES PPU control register bits
    LDA #%10000000  ; Base PPU control: NMI enabled
    
    ; Enable background rendering (set bit 3)
    ORA #%00001000  ; Set bit 3
    STA PPUControl  ; Store updated control
    
    ; Toggle sprite size (toggle bit 5)
    LDA PPUControl  ; Load current control
    EOR #%00100000  ; Toggle bit 5 (8x8 ↔ 8x16 sprites)
    STA PPUControl  ; Store toggled control
    
    ; Disable scrolling updates (clear bit 0)
    LDA PPUControl  ; Load current control
    AND #%11111110  ; Clear bit 0
    STA PPUControl  ; Store updated control
    
    LDA PPUControl
    STA $0203       ; Display final PPU control value
    
    ; === COLOUR COMPONENT EXTRACTION ===
    ; Extract RGB components from packed colour byte
    LDA #%11010110  ; Packed colour: R=6, G=2, B=2 (RRRGGGBB format)
    
    ; Extract red component (bits 7-5)
    AND #%11100000  ; Mask red bits
    LSR A           ; Shift to position
    LSR A
    LSR A
    LSR A
    LSR A
    STA RedValue    ; Store red component (0-7)
    STA $0210       ; Display red value
    
    ; Extract green component (bits 4-2)
    LDA #%11010110  ; Reload original
    AND #%00011100  ; Mask green bits
    LSR A           ; Shift to position
    LSR A
    STA GreenValue  ; Store green component (0-7)
    STA $0211       ; Display green value
    
    ; Extract blue component (bits 1-0)
    LDA #%11010110  ; Reload original
    AND #%00000011  ; Mask blue bits (already in position)
    STA BlueValue   ; Store blue component (0-3)
    STA $0212       ; Display blue value
    
    RTS

; Data storage
PPUControl:     .byte 0
RedValue:       .byte 0
GreenValue:     .byte 0
BlueValue:      .byte 0
```

## The BIT Instruction - Non-Destructive Testing

The BIT instruction is special - it tests bits without changing the accumulator:

**Format**: `BIT address`
**Function**: 
- Tests A AND address, sets Zero flag accordingly
- Copies bit 7 of address to Negative flag
- Copies bit 6 of address to Overflow flag

```text
LDA #%00001000     ; Load test pattern
BIT TestByte       ; Test against TestByte
BEQ NoMatch        ; Branch if no bits match
```

**BIT Instruction Demonstration:**

```assembly
; Demonstration of the BIT instruction for non-destructive testing
; BIT is perfect for testing hardware registers and flags

BITInstructionDemo:
    ; === BASIC BIT TESTING ===
    ; Test if specific bits are set without changing accumulator
    LDA #%00001000  ; Load test pattern (bit 3 set)
    STA TestPattern ; Store test pattern
    
    LDA #%10101111  ; Load data to test
    BIT TestPattern ; Test A against test pattern
    BEQ NoMatch     ; Branch if no bits match (bit 3 clear in A)
    
    ; Bit 3 is set in both A and test pattern
    LDA #$4D        ; 'M' for Match
    STA $0300
    JMP BitTestContinue
    
NoMatch:
    LDA #$4E        ; 'N' for No match
    STA $0300
    
BitTestContinue:
    
    ; === TESTING HARDWARE REGISTER STATUS ===
    ; Simulate testing NES PPU status register
    LDA #%10100000  ; Simulate PPU status: VBlank + Sprite 0 hit
    STA PPUStatus   ; Store simulated status
    
    ; Test for VBlank (bit 7)
    BIT PPUStatus   ; Test PPU status
    BMI VBlankActive ; Branch if bit 7 set (Negative flag = bit 7)
    
    LDA #$4E        ; 'N' for No VBlank
    STA $0301
    JMP SpriteTest
    
VBlankActive:
    LDA #$56        ; 'V' for VBlank
    STA $0301
    
SpriteTest:
    ; Test for Sprite 0 hit (bit 6)
    BIT PPUStatus   ; Test PPU status again
    BVS Sprite0Hit  ; Branch if bit 6 set (Overflow flag = bit 6)
    
    LDA #$4E        ; 'N' for No sprite hit
    STA $0302
    JMP MultiTest
    
Sprite0Hit:
    LDA #$53        ; 'S' for Sprite hit
    STA $0302
    
MultiTest:
    ; === TESTING MULTIPLE CONDITIONS ===
    ; Test multiple bits simultaneously
    LDA #%00000110  ; Test pattern: bits 2 and 1
    STA MultiPattern
    
    LDA #%10110110  ; Data: bits 7,5,4,2,1 set
    BIT MultiPattern ; Test bits 2 and 1
    BEQ NoBitsMatch ; Branch if neither bit 2 nor bit 1 match
    
    ; At least one of bits 2,1 matches
    LDA #$50        ; 'P' for Partial match
    STA $0303
    JMP ControllerTest
    
NoBitsMatch:
    LDA #$4E        ; 'N' for No match
    STA $0303
    
ControllerTest:
    ; === CONTROLLER INPUT TESTING ===
    ; Test controller buttons using BIT instruction
    LDA #%00000001  ; Test pattern for A button
    STA ButtonTest
    
    LDA #%10000001  ; Simulate controller: A button + Right pressed
    STA ControllerData
    
    BIT ButtonTest  ; Test A button
    BEQ AButtonNotPressed
    
    ; A button is pressed
    LDA #$41        ; 'A' for A button
    STA $0310
    JMP DirectionTest
    
AButtonNotPressed:
    LDA #$2D        ; '-' for not pressed
    STA $0310
    
DirectionTest:
    ; Test directional buttons
    LDA #%11110000  ; Test pattern for all directions
    STA DirectionTest
    
    LDA ControllerData ; Load controller state
    BIT DirectionTest  ; Test direction bits
    BEQ NoDirection    ; Branch if no directions pressed
    
    ; Some direction is pressed
    LDA #$44        ; 'D' for Direction
    STA $0311
    JMP EndDemo
    
NoDirection:
    LDA #$2D        ; '-' for no direction
    STA $0311
    
EndDemo:
    RTS

; Data storage
TestPattern:    .byte 0
PPUStatus:      .byte 0
MultiPattern:   .byte 0
ButtonTest:     .byte 0
ControllerData: .byte 0
DirectionTest:  .byte 0
```

## Advanced Bit Manipulation Techniques

### Data Packing and Unpacking
Efficiently store multiple values in single bytes:

```text
; Pack three values (3 bits, 3 bits, 2 bits) into one byte
LDA Value1      ; 3-bit value (0-7)
ASL A           ; Shift to position
ASL A
ASL A
ORA Value2      ; Add 3-bit value (bits 2-0)
ASL A           ; Shift again
ASL A
ORA Value3      ; Add 2-bit value
; Result: AAABBBCC format
```

### Bit Field Manipulation
Extract and modify specific bit ranges:

```text
; Extract bits 4-6 from a byte
LDA DataByte
AND #%01110000  ; Mask bits 4-6
LSR A           ; Shift to position 0-2
LSR A
LSR A
LSR A
; A now contains bits 4-6 in positions 0-2
```

**Advanced Bit Manipulation:**

```assembly
; Advanced bit manipulation techniques for NES programming
; Demonstrates data packing, unpacking, and bit field operations

AdvancedBitDemo:
    ; === DATA PACKING EXAMPLE ===
    ; Pack sprite data: X pos (8 bits), Y pos (8 bits), attributes (8 bits)
    ; into a more compact format for storage
    
    ; Original sprite data
    LDA #$80        ; X position
    STA SpriteX
    LDA #$60        ; Y position  
    STA SpriteY
    LDA #%00000101  ; Attributes: palette 1, no flip
    STA SpriteAttr
    
    ; Pack position data (compress to 4 bits each for demo)
    LDA SpriteX     ; Get X position
    LSR A           ; Divide by 16 to fit in 4 bits
    LSR A
    LSR A
    LSR A
    ASL A           ; Shift to upper nibble
    ASL A
    ASL A
    ASL A
    STA PackedPos   ; Store packed X
    
    LDA SpriteY     ; Get Y position
    LSR A           ; Divide by 16 to fit in 4 bits
    LSR A
    LSR A
    LSR A
    ORA PackedPos   ; Combine with packed X
    STA PackedPos   ; Store combined X,Y
    STA $0400       ; Display packed position
    
    ; === BIT FIELD EXTRACTION ===
    ; Extract sprite attributes from NES sprite byte
    ; NES sprite attribute format: VHPPPPPP
    ; V = vertical flip, H = horizontal flip, P = palette
    
    LDA #%11000010  ; Example sprite attributes
    STA SpriteAttrByte
    
    ; Extract vertical flip flag (bit 7)
    AND #%10000000  ; Mask bit 7
    BEQ NoVerticalFlip
    LDA #$56        ; 'V' for vertical flip
    STA $0410
    JMP TestHorizontalFlip
    
NoVerticalFlip:
    LDA #$2D        ; '-' for no flip
    STA $0410
    
TestHorizontalFlip:
    ; Extract horizontal flip flag (bit 6)
    LDA SpriteAttrByte
    AND #%01000000  ; Mask bit 6
    BEQ NoHorizontalFlip
    LDA #$48        ; 'H' for horizontal flip
    STA $0411
    JMP ExtractPalette
    
NoHorizontalFlip:
    LDA #$2D        ; '-' for no flip
    STA $0411
    
ExtractPalette:
    ; Extract palette number (bits 1-0)
    LDA SpriteAttrByte
    AND #%00000011  ; Mask palette bits
    STA SpritePalette
    STA $0412       ; Display palette number
    
    ; === NES NAMETABLE ATTRIBUTE MANIPULATION ===
    ; NES attribute bytes control 4 tiles each (2×2 tile groups)
    ; Each attribute byte: DDCCBBAA (2 bits per tile quadrant)
    
    LDA #%11100100  ; Example attribute byte
    STA AttributeByte
    
    ; Extract attribute for top-left tile (bits 1-0)
    AND #%00000011  ; Mask bits 1-0
    STA TileAttr_TL ; Store top-left attribute
    STA $0420       ; Display
    
    ; Extract attribute for top-right tile (bits 3-2)
    LDA AttributeByte
    AND #%00001100  ; Mask bits 3-2
    LSR A           ; Shift to position 0-1
    LSR A
    STA TileAttr_TR ; Store top-right attribute
    STA $0421       ; Display
    
    ; Extract attribute for bottom-left tile (bits 5-4)
    LDA AttributeByte
    AND #%00110000  ; Mask bits 5-4
    LSR A           ; Shift to position 0-1
    LSR A
    LSR A
    LSR A
    STA TileAttr_BL ; Store bottom-left attribute
    STA $0422       ; Display
    
    ; Extract attribute for bottom-right tile (bits 7-6)
    LDA AttributeByte
    AND #%11000000  ; Mask bits 7-6
    LSR A           ; Shift to position 0-1
    LSR A
    LSR A
    LSR A
    LSR A
    LSR A
    STA TileAttr_BR ; Store bottom-right attribute
    STA $0423       ; Display
    
    ; === CREATING NEW ATTRIBUTE BYTE ===
    ; Build new attribute byte from individual tile attributes
    LDA #1          ; New top-left attribute
    STA NewAttr     ; Start building new byte
    
    LDA #2          ; New top-right attribute
    ASL A           ; Shift to bits 3-2
    ASL A
    ORA NewAttr     ; Combine
    STA NewAttr
    
    LDA #0          ; New bottom-left attribute
    ASL A           ; Shift to bits 5-4
    ASL A
    ASL A
    ASL A
    ORA NewAttr     ; Combine
    STA NewAttr
    
    LDA #3          ; New bottom-right attribute
    ASL A           ; Shift to bits 7-6
    ASL A
    ASL A
    ASL A
    ASL A
    ASL A
    ORA NewAttr     ; Combine
    STA NewAttr
    
    LDA NewAttr
    STA $0430       ; Display new attribute byte
    
    ; === BIT COUNTING ===
    ; Count number of set bits in a byte
    LDA #%10110101  ; Test byte (5 bits set)
    LDX #8          ; Number of bits to check
    LDY #0          ; Bit counter
    
BitCountLoop:
    ASL A           ; Shift left (bit 7 → carry)
    BCC BitNotSet   ; Skip if bit was 0
    INY             ; Increment count if bit was 1
BitNotSet:
    DEX             ; Decrement bit position
    BNE BitCountLoop ; Continue for all 8 bits
    
    STY $0440       ; Display bit count
    
    ; === CHECKSUM CALCULATION ===
    ; Calculate XOR checksum of data
    LDX #0          ; Initialize data index
    LDA #0          ; Initialize checksum
    
ChecksumLoop:
    EOR TestData,X  ; XOR with next data byte
    INX             ; Move to next byte
    CPX #TestDataSize ; Check if done
    BNE ChecksumLoop ; Continue for all bytes
    
    STA $0450       ; Display checksum
    
    RTS

; Data storage
SpriteX:        .byte 0
SpriteY:        .byte 0
SpriteAttr:     .byte 0
PackedPos:      .byte 0
SpriteAttrByte: .byte 0
SpritePalette:  .byte 0
AttributeByte:  .byte 0
TileAttr_TL:    .byte 0
TileAttr_TR:    .byte 0
TileAttr_BL:    .byte 0
TileAttr_BR:    .byte 0
NewAttr:        .byte 0

TestData:       .byte $12, $34, $56, $78, $9A
TestDataSize = 5
```

## NES Hardware Control with Logical Operations

Logical operations are essential for controlling NES hardware registers:

### PPU Control Register ($2000)
- Bit manipulation for graphics settings
- Enable/disable various PPU features
- Control scrolling and nametables

### Controller Reading
- Extract individual button states
- Process multiple buttons efficiently
- Implement button combination detection

**NES Hardware Control:**

```assembly
; NES hardware control using logical operations
; Demonstrates real-world bit manipulation for NES programming

NESHardwareDemo:
    ; === PPU CONTROL REGISTER MANIPULATION ===
    ; Set up PPU control register ($2000) using bit operations
    
    LDA #%00000000  ; Start with all features disabled
    STA PPUCtrl     ; Initialize PPU control
    
    ; Enable NMI (Non-Maskable Interrupt) on VBlank
    LDA PPUCtrl
    ORA #%10000000  ; Set bit 7 (NMI enable)
    STA PPUCtrl
    
    ; Set master/slave select (uncommon, but for demonstration)
    LDA PPUCtrl
    ORA #%01000000  ; Set bit 6
    STA PPUCtrl
    
    ; Select sprite size (0 = 8x8, 1 = 8x16)
    LDA PPUCtrl
    ORA #%00100000  ; Set bit 5 for 8x16 sprites
    STA PPUCtrl
    
    ; Select background pattern table (0 = $0000, 1 = $1000)
    LDA PPUCtrl
    ORA #%00010000  ; Set bit 4 for $1000
    STA PPUCtrl
    
    ; Select sprite pattern table (0 = $0000, 1 = $1000)
    LDA PPUCtrl
    ORA #%00001000  ; Set bit 3 for $1000
    STA PPUCtrl
    
    ; Set VRAM increment (0 = add 1, 1 = add 32)
    LDA PPUCtrl
    ORA #%00000100  ; Set bit 2 for add 32 (vertical writing)
    STA PPUCtrl
    
    ; Set nametable select (bits 1-0)
    LDA PPUCtrl
    ORA #%00000001  ; Set nametable 1
    STA PPUCtrl
    
    ; Display final PPU control value
    LDA PPUCtrl
    STA $0500       ; Should be %11111101
    
    ; === PPU MASK REGISTER MANIPULATION ===
    ; Set up PPU mask register ($2001) for rendering control
    
    LDA #%00000000  ; Start with rendering disabled
    STA PPUMask
    
    ; Enable greyscale mode
    LDA PPUMask
    ORA #%00000001  ; Set bit 0
    STA PPUMask
    
    ; Show background in leftmost 8 pixels
    LDA PPUMask
    ORA #%00000010  ; Set bit 1
    STA PPUMask
    
    ; Show sprites in leftmost 8 pixels
    LDA PPUMask
    ORA #%00000100  ; Set bit 2
    STA PPUMask
    
    ; Enable background rendering
    LDA PPUMask
    ORA #%00001000  ; Set bit 3
    STA PPUMask
    
    ; Enable sprite rendering
    LDA PPUMask
    ORA #%00010000  ; Set bit 4
    STA PPUMask
    
    ; Emphasize red
    LDA PPUMask
    ORA #%00100000  ; Set bit 5
    STA PPUMask
    
    LDA PPUMask
    STA $0501       ; Display final PPU mask value
    
    ; === CONTROLLER INPUT PROCESSING ===
    ; Read and process controller input using bit operations
    
    LDA #%11111111  ; Simulate all buttons pressed
    STA ControllerState
    
    ; Process each button individually
    LDA ControllerState
    
    ; Check A button (bit 0)
    AND #%00000001  ; Test bit 0
    BEQ NoAButton   ; Branch if not pressed
    INC AButtonCount ; Increment A button counter
    
NoAButton:
    ; Check B button (bit 1)
    LDA ControllerState
    AND #%00000010  ; Test bit 1
    BEQ NoBButton   ; Branch if not pressed
    INC BButtonCount ; Increment B button counter
    
NoBButton:
    ; Check Select button (bit 2)
    LDA ControllerState
    AND #%00000100  ; Test bit 2
    BEQ NoSelect    ; Branch if not pressed
    INC SelectCount ; Increment Select counter
    
NoSelect:
    ; Check Start button (bit 3)
    LDA ControllerState
    AND #%00001000  ; Test bit 3
    BEQ NoStart     ; Branch if not pressed
    INC StartCount  ; Increment Start counter
    
NoStart:
    ; Check directional pad (bits 4-7)
    LDA ControllerState
    AND #%11110000  ; Mask direction bits
    BEQ NoDirection ; Branch if no directions
    
    ; At least one direction is pressed
    INC DirectionCount
    
    ; Check specific directions
    LDA ControllerState
    AND #%00010000  ; Test Up (bit 4)
    BEQ CheckDown
    INC UpCount
    
CheckDown:
    LDA ControllerState
    AND #%00100000  ; Test Down (bit 5)
    BEQ CheckLeft
    INC DownCount
    
CheckLeft:
    LDA ControllerState
    AND #%01000000  ; Test Left (bit 6)
    BEQ CheckRight
    INC LeftCount
    
CheckRight:
    LDA ControllerState
    AND #%10000000  ; Test Right (bit 7)
    BEQ NoDirection
    INC RightCount
    
NoDirection:
    
    ; === BUTTON COMBINATION DETECTION ===
    ; Detect specific button combinations
    
    ; Check for A + B combination
    LDA ControllerState
    AND #%00000011  ; Mask A and B buttons
    CMP #%00000011  ; Check if both pressed
    BNE NoABCombo
    INC ABComboCount
    
NoABCombo:
    ; Check for Start + Select combination (common reset)
    LDA ControllerState
    AND #%00001100  ; Mask Start and Select
    CMP #%00001100  ; Check if both pressed
    BNE NoResetCombo
    INC ResetComboCount
    
NoResetCombo:
    ; Check for diagonal movement (Up + Right)
    LDA ControllerState
    AND #%10010000  ; Mask Up and Right
    CMP #%10010000  ; Check if both pressed
    BNE NoDiagonal
    INC DiagonalCount
    
NoDiagonal:
    
    ; === SPRITE ATTRIBUTE MANIPULATION ===
    ; Manipulate sprite attributes for animation effects
    
    LDA #%00000000  ; Start with default attributes
    STA SpriteAttributes
    
    ; Set palette (bits 1-0)
    LDA SpriteAttributes
    ORA #%00000010  ; Set palette 2
    STA SpriteAttributes
    
    ; Toggle horizontal flip for animation
    LDA FrameCounter
    AND #%00000100  ; Test bit 2 of frame counter
    BEQ NoHFlip     ; Skip if bit clear
    
    LDA SpriteAttributes
    ORA #%01000000  ; Set horizontal flip (bit 6)
    STA SpriteAttributes
    
NoHFlip:
    ; Toggle vertical flip based on different timing
    LDA FrameCounter
    AND #%00001000  ; Test bit 3 of frame counter
    BEQ NoVFlip     ; Skip if bit clear
    
    LDA SpriteAttributes
    ORA #%10000000  ; Set vertical flip (bit 7)
    STA SpriteAttributes
    
NoVFlip:
    INC FrameCounter ; Increment frame counter
    
    ; Display results
    LDA AButtonCount
    STA $0510
    LDA BButtonCount
    STA $0511
    LDA ABComboCount
    STA $0512
    LDA SpriteAttributes
    STA $0513
    
    RTS

; Hardware registers (memory-mapped)
PPUCtrl:        .byte 0  ; $2000
PPUMask:        .byte 0  ; $2001

; Controller data
ControllerState: .byte 0
AButtonCount:   .byte 0
BButtonCount:   .byte 0
SelectCount:    .byte 0
StartCount:     .byte 0
DirectionCount: .byte 0
UpCount:        .byte 0
DownCount:      .byte 0
LeftCount:      .byte 0
RightCount:     .byte 0
ABComboCount:   .byte 0
ResetComboCount: .byte 0
DiagonalCount:  .byte 0

; Sprite data
SpriteAttributes: .byte 0
FrameCounter:   .byte 0
```

## Algorithmic Applications

Logical operations form the foundation of many efficient algorithms:

### Pattern Matching
```text
; Check if a pattern matches (with mask)
LDA DataByte
EOR ExpectedPattern ; XOR with expected
AND RelevantMask    ; Mask irrelevant bits
BEQ PatternMatches  ; Branch if result is zero
```

### Fast Modulo Operations
```text
; Fast modulo for powers of 2
LDA Number
AND #%00000111      ; Modulo 8 (keep lower 3 bits)
```

### Bit Rotation Algorithms
```text
; Rotate bits in a circular pattern
LDA BitPattern
ROL A               ; Rotate left
BCC NoWrap          ; Branch if bit 7 was 0
ORA #%00000001      ; Set bit 0 if bit 7 was 1
NoWrap:
```

**Algorithmic Applications:**

```assembly
; Algorithmic applications of logical and bit operations
; Demonstrates advanced algorithms using bit manipulation

AlgorithmicDemo:
    ; === PATTERN MATCHING WITH WILDCARDS ===
    ; Match patterns while ignoring specific bits
    
    LDA #%10110100  ; Data to test
    STA TestData
    
    LDA #%10110000  ; Expected pattern
    STA ExpectedPattern
    
    LDA #%11111000  ; Mask (ignore lower 3 bits)
    STA PatternMask
    
    ; Perform masked comparison
    LDA TestData
    AND PatternMask ; Apply mask to data
    STA MaskedData
    
    LDA ExpectedPattern
    AND PatternMask ; Apply mask to pattern
    
    CMP MaskedData  ; Compare masked values
    BEQ PatternMatch
    
    LDA #$4E        ; 'N' for No match
    STA $0600
    JMP HashTest
    
PatternMatch:
    LDA #$4D        ; 'M' for Match
    STA $0600
    
HashTest:
    ; === SIMPLE HASH FUNCTION ===
    ; Create hash value using XOR and rotation
    
    LDX #0          ; Initialize data index
    LDA #0          ; Initialize hash value
    
HashLoop:
    ; Add contribution from current byte
    EOR HashData,X  ; XOR with data byte
    ROL A           ; Rotate hash value
    EOR HashData,X  ; XOR again with rotated value
    
    INX             ; Move to next byte
    CPX #HashDataSize ; Check if done
    BNE HashLoop    ; Continue for all bytes
    
    STA HashResult  ; Store final hash
    STA $0601       ; Display hash result
    
    ; === FAST POWER-OF-2 DETECTION ===
    ; Check if a number is a power of 2
    
    LDA #16         ; Test number
    STA TestNumber
    
    LDA TestNumber  ; Load number
    BEQ NotPowerOf2 ; Zero is not a power of 2
    
    SEC             ; Set carry for subtraction
    SBC #1          ; Subtract 1
    AND TestNumber  ; AND with original number
    BEQ IsPowerOf2  ; If result is 0, it's a power of 2
    
NotPowerOf2:
    LDA #$4E        ; 'N' for Not power of 2
    STA $0602
    JMP GrayCode
    
IsPowerOf2:
    LDA #$59        ; 'Y' for Yes, power of 2
    STA $0602
    
GrayCode:
    ; === BINARY TO GRAY CODE CONVERSION ===
    ; Convert binary number to Gray code
    
    LDA #10         ; Binary number to convert
    STA BinaryValue
    
    TAX             ; Save binary value in X
    LSR A           ; Shift right
    EOR X           ; XOR with original = Gray code
    
    STA GrayValue   ; Store Gray code result
    STA $0603       ; Display Gray code
    
    ; === POPULATION COUNT (HAMMING WEIGHT) ===
    ; Count number of 1 bits in a byte
    
    LDA #%10110101  ; Test byte (5 bits set)
    LDX #0          ; Clear bit counter
    
PopCountLoop:
    BEQ PopCountDone ; Exit if no more bits
    
    INX             ; Increment counter
    SEC             ; Set carry for subtraction
    SBC #1          ; A = A - 1
    AND PopCountTemp ; A = A & (A-1) - clears lowest set bit
    JMP PopCountLoop ; Continue until no bits left
    
PopCountDone:
    STX PopCountResult
    STX $0604       ; Display bit count
    
    ; === BIT REVERSAL ===
    ; Reverse bit order in a byte
    
    LDA #%11010010  ; Test byte
    LDX #8          ; Number of bits
    LDY #0          ; Accumulator for reversed bits
    
ReverseBitsLoop:
    LSR A           ; Shift right (bit 0 → carry)
    ROL Y           ; Rotate carry into Y (building reversed result)
    DEX             ; Decrement bit counter
    BNE ReverseBitsLoop ; Continue for all 8 bits
    
    STY ReversedBits
    STY $0605       ; Display reversed bits
    
    ; === EFFICIENT MODULO FOR ANY NUMBER ===
    ; Modulo operation for non-power-of-2 values
    
    LDA #23         ; Number to reduce
    LDX #7          ; Modulo value
    
ModuloLoop:
    CMP X           ; Compare with modulo value
    BCC ModuloDone  ; Branch if A < X (result found)
    SEC             ; Set carry for subtraction
    SBC X           ; Subtract modulo value
    JMP ModuloLoop  ; Continue until A < X
    
ModuloDone:
    STA ModuloResult ; A now contains 23 mod 7 = 2
    STA $0606       ; Display modulo result
    
    ; === CYCLIC REDUNDANCY CHECK (CRC) ===
    ; Simple CRC calculation for error detection
    
    LDX #0          ; Initialize data index
    LDA #0          ; Initialize CRC
    
CRCLoop:
    EOR CRCData,X   ; XOR with data byte
    LDY #8          ; Process 8 bits
    
CRCBitLoop:
    ASL A           ; Shift left (bit 7 → carry)
    BCC CRCNoPoly   ; Skip if no carry
    EOR #%10001001  ; XOR with polynomial if carry
    
CRCNoPoly:
    DEY             ; Next bit
    BNE CRCBitLoop  ; Process all bits
    
    INX             ; Next data byte
    CPX #CRCDataSize ; Check if done
    BNE CRCLoop     ; Process all bytes
    
    STA CRCResult   ; Store final CRC
    STA $0607       ; Display CRC result
    
    ; === FIND FIRST SET BIT ===
    ; Find position of first (lowest) set bit
    
    LDA #%00101000  ; Test byte (bits 5 and 3 set)
    LDX #0          ; Position counter
    
FindFirstBitLoop:
    LSR A           ; Shift right (bit 0 → carry)
    BCS FoundFirstBit ; If carry set, found the bit
    INX             ; Increment position
    BNE FindFirstBitLoop ; Continue if more bits (and no overflow)
    
    LDX #$FF        ; No bits found
    
FoundFirstBit:
    STX FirstBitPos ; Store position of first set bit
    STX $0608       ; Display first bit position
    
    RTS

; Data for algorithms
TestData:       .byte 0
ExpectedPattern: .byte 0
PatternMask:    .byte 0
MaskedData:     .byte 0

HashData:       .byte $12, $34, $56, $78
HashDataSize = 4
HashResult:     .byte 0

TestNumber:     .byte 0
BinaryValue:    .byte 0
GrayValue:      .byte 0

PopCountTemp:   .byte 0
PopCountResult: .byte 0

ReversedBits:   .byte 0
ModuloResult:   .byte 0

CRCData:        .byte $AB, $CD, $EF, $01
CRCDataSize = 4
CRCResult:      .byte 0

FirstBitPos:    .byte 0
```

## Practice Exercise

**Logical Operations Practice:**

```assembly
; Practice Exercise: NES Graphics Engine
; Use logical operations to implement graphics processing routines

GraphicsEnginePractice:
    ; Initialize graphics system
    JSR InitGraphics
    
    ; Process sprite data
    JSR ProcessSprites
    
    ; Handle background tiles
    JSR ProcessBackground
    
    ; Apply visual effects
    JSR ApplyEffects
    
    RTS

InitGraphics:
    ; Initialize graphics engine state
    LDA #%00000000  ; Clear all graphics flags
    STA GraphicsFlags
    
    ; Enable basic rendering
    LDA GraphicsFlags
    ORA #%00000001  ; Set rendering enabled flag
    STA GraphicsFlags
    
    ; Set default palette
    LDA #%00000010  ; Set palette select flag
    ORA GraphicsFlags
    STA GraphicsFlags
    
    LDA GraphicsFlags
    STA $0700       ; Display graphics flags
    
    RTS

ProcessSprites:
    ; Process sprite attribute data
    LDX #0          ; Sprite index
    
SpriteLoop:
    ; Load sprite attributes
    LDA SpriteAttrData,X
    STA CurrentSpriteAttr
    
    ; Extract palette number (bits 1-0)
    AND #%00000011  ; Mask palette bits
    STA SpritePalette
    
    ; Check for horizontal flip (bit 6)
    LDA CurrentSpriteAttr
    AND #%01000000  ; Test horizontal flip bit
    BEQ NoHFlip
    
    ; Apply horizontal flip processing
    LDA ProcessingFlags
    ORA #%00000001  ; Set H-flip processing flag
    STA ProcessingFlags
    
NoHFlip:
    ; Check for vertical flip (bit 7)
    LDA CurrentSpriteAttr
    AND #%10000000  ; Test vertical flip bit
    BEQ NoVFlip
    
    ; Apply vertical flip processing
    LDA ProcessingFlags
    ORA #%00000010  ; Set V-flip processing flag
    STA ProcessingFlags
    
NoVFlip:
    ; Apply palette transformation
    LDA SpritePalette
    ASL A           ; Multiply by 4 (4 colours per palette)
    ASL A
    STA PaletteOffset
    
    ; Store processed sprite data
    LDA SpritePalette
    STA ProcessedSprites,X
    
    INX             ; Move to next sprite
    CPX #8          ; Process 8 sprites
    BNE SpriteLoop  ; Continue if more sprites
    
    ; Display first processed sprite
    LDA ProcessedSprites
    STA $0710
    LDA ProcessingFlags
    STA $0711
    
    RTS

ProcessBackground:
    ; Process background tile attributes
    LDX #0          ; Tile index
    
TileLoop:
    ; Load tile attribute byte
    LDA TileAttrData,X
    STA CurrentTileAttr
    
    ; Extract attributes for 4 tile quadrants
    ; Format: DDCCBBAA (2 bits per quadrant)
    
    ; Extract quadrant A (bits 1-0)
    AND #%00000011  ; Mask bits 1-0
    STA QuadrantA
    
    ; Extract quadrant B (bits 3-2)
    LDA CurrentTileAttr
    AND #%00001100  ; Mask bits 3-2
    LSR A           ; Shift to position 0-1
    LSR A
    STA QuadrantB
    
    ; Extract quadrant C (bits 5-4)
    LDA CurrentTileAttr
    AND #%00110000  ; Mask bits 5-4
    LSR A           ; Shift to position 0-1
    LSR A
    LSR A
    LSR A
    STA QuadrantC
    
    ; Extract quadrant D (bits 7-6)
    LDA CurrentTileAttr
    AND #%11000000  ; Mask bits 7-6
    LSR A           ; Shift to position 0-1
    LSR A
    LSR A
    LSR A
    LSR A
    LSR A
    STA QuadrantD
    
    ; Process special tile effects
    LDA QuadrantA
    CMP #3          ; Check for special attribute
    BNE NoSpecialA
    
    ; Apply special effect to quadrant A
    LDA EffectFlags
    ORA #%00000001  ; Set special effect flag
    STA EffectFlags
    
NoSpecialA:
    ; Store processed tile attributes
    LDA QuadrantA
    STA ProcessedTiles,X
    
    INX             ; Move to next tile
    CPX #4          ; Process 4 tiles
    BNE TileLoop    ; Continue if more tiles
    
    ; Display processed tile data
    LDA ProcessedTiles
    STA $0720
    LDA EffectFlags
    STA $0721
    
    RTS

ApplyEffects:
    ; Apply visual effects using bit manipulation
    
    ; === COLOUR CYCLING EFFECT ===
    INC CycleCounter ; Increment cycle counter
    
    ; Create cycling palette effect
    LDA CycleCounter
    AND #%00000011  ; Modulo 4 for 4-step cycle
    STA CyclePhase
    
    ; Modify palette based on cycle phase
    LDA BasePalette
    LDX CyclePhase
    
CycleEffect:
    CPX #0
    BEQ CyclePhase0
    CPX #1
    BEQ CyclePhase1
    CPX #2
    BEQ CyclePhase2
    ; Phase 3
    EOR #%00000110  ; Toggle bits 2,1
    JMP CycleDone
    
CyclePhase0:
    ; No change
    JMP CycleDone
    
CyclePhase1:
    EOR #%00000001  ; Toggle bit 0
    JMP CycleDone
    
CyclePhase2:
    EOR #%00000010  ; Toggle bit 1
    
CycleDone:
    STA CycledPalette
    STA $0730       ; Display cycled palette
    
    ; === SCREEN FADE EFFECT ===
    ; Create fade effect by manipulating colour intensity
    
    LDA FadeLevel   ; Load current fade level (0-3)
    
    ; Apply fade to each colour component
    LDA #%11100100  ; Original colour (high intensity)
    STA OriginalColour
    
    LDX FadeLevel
    
FadeLoop:
    CPX #0
    BEQ FadeDone    ; No fade needed
    
    ; Reduce colour intensity
    LDA OriginalColour
    AND #%11011011  ; Clear intensity bits selectively
    STA OriginalColour
    
    DEX
    JMP FadeLoop
    
FadeDone:
    LDA OriginalColour
    STA FadedColour
    STA $0731       ; Display faded colour
    
    ; === TRANSPARENCY EFFECT ===
    ; Combine two layers using bit operations
    
    LDA #%10101010  ; Background layer
    STA BackgroundLayer
    
    LDA #%01010101  ; Foreground layer
    STA ForegroundLayer
    
    LDA #%11110000  ; Transparency mask
    STA TransparencyMask
    
    ; Apply transparency
    LDA BackgroundLayer
    AND TransparencyMask ; Keep background where mask is set
    STA TempLayer
    
    LDA ForegroundLayer
    EOR #%11111111  ; Invert mask for foreground
    AND TransparencyMask
    ORA TempLayer   ; Combine layers
    
    STA CompositeLayer
    STA $0732       ; Display composite result
    
    ; === PATTERN GENERATION ===
    ; Generate animated patterns using XOR
    
    LDA PatternSeed ; Load pattern seed
    EOR #%01010101  ; XOR with pattern
    ROL A           ; Rotate for animation
    STA PatternSeed ; Store updated seed
    
    ; Create multiple pattern variations
    EOR #%11001100  ; Create variation 1
    STA Pattern1
    STA $0740
    
    LDA PatternSeed
    EOR #%00110011  ; Create variation 2
    STA Pattern2
    STA $0741
    
    RTS

; Graphics engine data
GraphicsFlags:      .byte 0
ProcessingFlags:    .byte 0
EffectFlags:        .byte 0

; Sprite data
SpriteAttrData:     .byte %11000010, %01000001, %10000000, %00000011
                    .byte %01000010, %10000001, %11000000, %00000001
CurrentSpriteAttr:  .byte 0
SpritePalette:      .byte 0
PaletteOffset:      .byte 0
ProcessedSprites:   .byte 0, 0, 0, 0, 0, 0, 0, 0

; Background tile data
TileAttrData:       .byte %11100100, %10010001, %01101000, %00011110
CurrentTileAttr:    .byte 0
QuadrantA:          .byte 0
QuadrantB:          .byte 0
QuadrantC:          .byte 0
QuadrantD:          .byte 0
ProcessedTiles:     .byte 0, 0, 0, 0

; Effect data
CycleCounter:       .byte 0
CyclePhase:         .byte 0
BasePalette:        .byte %00011100
CycledPalette:      .byte 0

FadeLevel:          .byte 2
OriginalColour:     .byte 0
FadedColour:        .byte 0

BackgroundLayer:    .byte 0
ForegroundLayer:    .byte 0
TransparencyMask:   .byte 0
TempLayer:          .byte 0
CompositeLayer:     .byte 0

PatternSeed:        .byte %10110100
Pattern1:           .byte 0
Pattern2:           .byte 0
```

## What You've Learned

In this lesson, you've learned:

1. **Logical Operations** - AND, OR, XOR for precise bit control
2. **BIT Instruction** - Non-destructive testing for hardware registers
3. **Advanced Bit Manipulation** - Data packing, unpacking, and field extraction
4. **NES Hardware Control** - Using bit operations for PPU and controller management
5. **Algorithmic Applications** - Efficient algorithms using logical operations

## Looking Ahead

Next, you'll complete Section 1 with a comprehensive review that integrates all the data manipulation concepts you've learned. You'll build sophisticated programs that demonstrate your understanding of 6502 assembly fundamentals!

## Fun Fact

The 6502's logical operations were designed to be both powerful and intuitive. The BIT instruction was particularly innovative - it allowed programmers to test hardware register bits without disturbing the accumulator, making it perfect for polling NES hardware status. The comprehensive set of logical operations (AND, OR, XOR) combined with efficient bit manipulation made the 6502 ideal for the bit-level control needed in NES programming. Many classic NES games relied heavily on these operations for everything from sprite attribute manipulation to controller input processing. The elegance of these operations influenced subsequent processor designs and remains fundamental to modern embedded programming!