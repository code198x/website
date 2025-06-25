---
title: "6502 Increment, Decrement and Shift Operations"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 6
description: "Learn 6502 increment and decrement operations, and explore shift instructions for efficient data manipulation and mathematical operations in NES programming."
learning_objectives:
  - "Learn INC and DEC instructions for efficient counting"
  - "Understand shift operations (ASL, LSR, ROL, ROR)"
  - "Practice efficient loop counters and data processing"
  - "Learn bit manipulation for NES graphics and sound"
  - "Build programs using shift operations for fast arithmetic"
concepts:
  - "INC and DEC instructions for 8-bit values and memory"
  - "Shift left (ASL) and shift right (LSR) operations"
  - "Rotate left (ROL) and rotate right (ROR) operations"
  - "Using shifts for fast multiplication and division"
  - "Bit manipulation for NES hardware control"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 6
---

# Lesson 6: 6502 Increment, Decrement and Shift Operations

The 6502 excels at fine-grained data manipulation. Today you'll learn the increment and decrement operations for efficient counting, plus powerful shift instructions that give you precise control over bits and enable fast mathematical operations!

## Increment and Decrement Operations

### INC - Increment (Add 1)
**Format**: `INC address` or `INX` or `INY`
**Function**: Adds 1 to the specified location
**Speed**: Faster than ADC #1!

```text
LDX #10         ; X = 10
INX             ; X = 11
INX             ; X = 12
```

### DEC - Decrement (Subtract 1)
**Format**: `DEC address` or `DEX` or `DEY`
**Function**: Subtracts 1 from the specified location
**Speed**: Faster than SBC #1!

```text
LDY #5          ; Y = 5
DEY             ; Y = 4
DEY             ; Y = 3
```

These operations are faster and more efficient than using ADC/SBC with 1!

**Increment and Decrement Operations:**

```assembly
; Demonstration of 6502 increment and decrement instructions
; These operations are essential for counters and loops in NES programming

IncDecDemo:
    ; === REGISTER INCREMENT/DECREMENT ===
    LDX #10         ; Start X with 10
    INX             ; X = 11
    INX             ; X = 12
    STX $0200       ; Store result
    
    DEX             ; X = 11
    DEX             ; X = 10 (back to original)
    STX $0201       ; Store result
    
    LDY #5          ; Start Y with 5
    INY             ; Y = 6
    INY             ; Y = 7
    STY $0202       ; Store result
    
    DEY             ; Y = 6
    DEY             ; Y = 5 (back to original)
    STY $0203       ; Store result
    
    ; === MEMORY INCREMENT/DECREMENT ===
    LDA #50         ; Initialize value
    STA Counter     ; Store in memory
    
    INC Counter     ; Increment memory directly: 51
    INC Counter     ; Increment again: 52
    LDA Counter     ; Load the result
    STA $0204       ; Display result
    
    DEC Counter     ; Decrement memory: 51
    LDA Counter     ; Load the result
    STA $0205       ; Display result
    
    ; === LOOP COUNTER EXAMPLE ===
    LDX #5          ; Loop counter
    LDY #$00        ; Memory offset
    
CounterLoop:
    TXA             ; Transfer count to accumulator
    STA $0300,Y     ; Store count at memory + offset
    INY             ; Increment memory offset
    DEX             ; Decrement counter (affects Zero flag)
    BNE CounterLoop ; Continue if not zero
    
    ; === WRAPAROUND BEHAVIOR ===
    LDX #$FF        ; Maximum 8-bit value (255)
    INX             ; Increment: X = 0 (wraparound)
    STX $0210       ; Display wrapped result
    
    LDY #$00        ; Minimum 8-bit value (0)
    DEY             ; Decrement: Y = $FF (255, wraparound)
    STY $0211       ; Display wrapped result
    
    ; === NES-SPECIFIC: SPRITE COUNTER ===
    ; Manage sprite index with automatic wrapping
    LDA SpriteIndex ; Load current sprite index
    CMP #63         ; Check if at maximum sprite (64 sprites = 0-63)
    BEQ WrapSprite  ; Wrap if at maximum
    
    INC SpriteIndex ; Increment sprite index
    JMP SpriteIndexDone
    
WrapSprite:
    LDA #0          ; Reset to first sprite
    STA SpriteIndex
    
SpriteIndexDone:
    LDA SpriteIndex
    STA $0220       ; Display current sprite index
    
    ; === ANIMATION FRAME COUNTER ===
    INC FrameCounter ; Increment animation frame
    LDA FrameCounter
    CMP #8          ; Check if reached 8 frames
    BNE FrameOK     ; Continue if not at limit
    
    LDA #0          ; Reset to frame 0
    STA FrameCounter
    
FrameOK:
    LDA FrameCounter
    STA $0221       ; Display current frame
    
    RTS

; Memory locations for examples
Counter:        .byte 0
SpriteIndex:    .byte 0
FrameCounter:   .byte 0
```

## Shift Operations

The 6502 provides powerful shift instructions for bit manipulation and fast arithmetic:

### ASL - Arithmetic Shift Left
Shifts all bits left, bit 0 becomes 0, bit 7 goes to carry
**Effect**: Multiplies by 2

```text
LDA #%00001010  ; Binary 10 (decimal 10)
ASL A           ; Result: %00010100 (decimal 20)
```

### LSR - Logical Shift Right
Shifts all bits right, bit 7 becomes 0, bit 0 goes to carry
**Effect**: Divides by 2 (unsigned)

```text
LDA #%01000000  ; Binary 64 (decimal 64)
LSR A           ; Result: %00100000 (decimal 32)
```

**Shift Operations:**

```assembly
; Demonstration of 6502 shift instructions
; These operations are useful for fast arithmetic and bit manipulation

ShiftDemo:
    ; === ARITHMETIC SHIFT LEFT (ASL) ===
    ; Effectively multiplies by 2
    LDA #%00001010  ; Binary 10 (decimal 10)
    ASL A           ; Shift left: A = %00010100 (decimal 20)
    STA $0200       ; Display result (should be 20)
    
    ; === LOGICAL SHIFT RIGHT (LSR) ===
    ; Effectively divides by 2
    LDA #%01000000  ; Binary 64 (decimal 64)
    LSR A           ; Shift right: A = %00100000 (decimal 32)
    STA $0201       ; Display result (should be 32)
    
    ; === FAST MULTIPLICATION BY POWERS OF 2 ===
    ; Multiply by 2, 4, 8, 16, etc. using shifts
    LDA #7          ; Start with 7
    
    ; Multiply by 2 (7 × 2 = 14)
    ASL A           ; Shift left once
    STA $0210       ; Display: 14
    
    ; Multiply by 4 from original (7 × 4 = 28)
    LDA #7          ; Reload original
    ASL A           ; × 2
    ASL A           ; × 4
    STA $0211       ; Display: 28
    
    ; Multiply by 8 from original (7 × 8 = 56)
    LDA #7          ; Reload original
    ASL A           ; × 2
    ASL A           ; × 4  
    ASL A           ; × 8
    STA $0212       ; Display: 56
    
    ; === FAST DIVISION BY POWERS OF 2 ===
    ; Divide by 2, 4, 8, 16, etc. using shifts
    LDA #56         ; Start with 56
    
    ; Divide by 2 (56 ÷ 2 = 28)
    LSR A           ; Shift right once
    STA $0213       ; Display: 28
    
    ; Divide by 4 from original (56 ÷ 4 = 14)
    LDA #56         ; Reload original
    LSR A           ; ÷ 2
    LSR A           ; ÷ 4
    STA $0214       ; Display: 14
    
    ; === MEMORY SHIFT OPERATIONS ===
    ; Shift values directly in memory
    LDA #%10110100  ; Test pattern
    STA $0300       ; Store in memory
    
    ASL $0300       ; Shift memory location left
    LDA $0300       ; Load shifted result
    STA $0220       ; Display shifted pattern
    
    ; === BIT EXTRACTION USING SHIFTS ===
    ; Extract specific bits from a value
    LDA #%11010110  ; Source value
    
    ; Extract bits 4-6 (shift right to position 0-2)
    LSR A           ; Shift right
    LSR A           ; Shift right
    LSR A           ; Shift right
    LSR A           ; Shift right
    AND #%00000111  ; Mask to keep only 3 bits
    STA $0230       ; Display extracted bits
    
    ; === NES GRAPHICS: PIXEL DOUBLING ===
    ; Double pixel width by shifting and combining
    LDA #%00110011  ; Original pixel pattern
    STA OriginalPattern
    
    ASL A           ; Shift left to create doubled pattern
    ORA OriginalPattern ; Combine with original
    STA $0240       ; Display doubled pattern
    
    RTS

; Data for examples
OriginalPattern: .byte 0
```

## Rotate Operations

The 6502 also has rotate instructions that include the carry flag in the rotation:

### ROL - Rotate Left through Carry
Rotates all bits left through carry flag

### ROR - Rotate Right through Carry
Rotates all bits right through carry flag

**Rotate Operations:**

```assembly
; Demonstration of 6502 rotate instructions
; These operations rotate bits through the carry flag

RotateDemo:
    ; === ROTATE LEFT THROUGH CARRY (ROL) ===
    CLC             ; Clear carry flag
    LDA #%10110100  ; Test pattern
    ROL A           ; Rotate left: bit 7 → carry, carry → bit 0
    STA $0200       ; Display rotated result
    
    ; === ROTATE RIGHT THROUGH CARRY (ROR) ===
    SEC             ; Set carry flag
    LDA #%01101011  ; Test pattern  
    ROR A           ; Rotate right: bit 0 → carry, carry → bit 7
    STA $0201       ; Display rotated result
    
    ; === MULTI-BIT ROTATIONS ===
    ; Rotate a value multiple positions
    LDA #%00000001  ; Single bit set
    CLC             ; Clear carry
    
    ; Rotate left 3 positions
    ROL A           ; Position 1
    ROL A           ; Position 2
    ROL A           ; Position 3
    STA $0210       ; Display: bit now in position 3
    
    ; === 16-BIT ROTATE ===
    ; Rotate a 16-bit value left
    LDA #$12        ; High byte
    STA $0320
    LDA #$34        ; Low byte
    STA $0321
    
    ; Rotate 16-bit value left
    CLC             ; Clear carry
    ROL $0321       ; Rotate low byte left
    ROL $0320       ; Rotate high byte left (includes carry from low)
    
    ; Display 16-bit rotated result
    LDA $0320       ; High byte
    STA $0220
    LDA $0321       ; Low byte
    STA $0221
    
    ; === BARREL SHIFTER SIMULATION ===
    ; Rotate bits by any amount using loop
    LDA #%00000001  ; Single bit set
    LDX #5          ; Rotate 5 positions
    CLC             ; Clear carry
    
RotateLoop:
    ROL A           ; Rotate left once
    DEX             ; Decrement position counter
    BNE RotateLoop  ; Continue until done
    
    STA $0230       ; Display final position
    
    ; === NES SOUND: FREQUENCY DOUBLING ===
    ; Double a frequency value using rotates
    LDA FrequencyLow ; Load frequency low byte
    STA $0240       ; Store original
    
    CLC             ; Clear carry
    ROL A           ; Rotate left (multiply by 2)
    STA $0241       ; Store doubled frequency
    
    ; === CHECKSUM CALCULATION ===
    ; Simple checksum using rotating XOR
    LDA #0          ; Initialize checksum
    LDX #0          ; Initialize data index
    CLC             ; Clear carry
    
ChecksumLoop:
    ROL A           ; Rotate current checksum
    EOR TestData,X  ; XOR with data byte
    INX             ; Move to next byte
    CPX #TestDataSize ; Check if done
    BNE ChecksumLoop ; Continue if more data
    
    STA $0250       ; Store final checksum
    
    ; === BIT REVERSAL ===
    ; Reverse all bits in a byte using rotates
    LDA #%11010010  ; Test pattern
    LDX #8          ; Number of bits
    LDY #0          ; Accumulator for reversed bits
    CLC             ; Clear carry
    
ReverseBitsLoop:
    LSR A           ; Shift right: bit 0 → carry
    ROL Y           ; Rotate carry into Y
    DEX             ; Decrement bit counter
    BNE ReverseBitsLoop ; Continue for all 8 bits
    
    STY $0260       ; Display bit-reversed result
    
    RTS

; Data for examples
FrequencyLow:   .byte $80
TestData:       .byte $12, $34, $56, $78
TestDataSize = 4
```

## NES-Specific Applications

Shift and increment operations are particularly useful for NES programming:

### Graphics Programming
- **Sprite animation**: Increment frame counters
- **Scrolling**: Shift background positions
- **Pixel manipulation**: Extract and modify graphics data

### Sound Programming
- **Frequency control**: Shift values for octave changes
- **Volume fading**: Decrement volume levels
- **Rhythm timing**: Increment beat counters

**NES-Specific Applications:**

```assembly
; NES-specific applications of increment, decrement, and shift operations
; Demonstrates practical uses in graphics, sound, and game logic

NESApplications:
    ; === SPRITE ANIMATION SYSTEM ===
    JSR UpdateSpriteAnimation
    
    ; === BACKGROUND SCROLLING ===
    JSR UpdateScrolling
    
    ; === SOUND FREQUENCY CONTROL ===
    JSR UpdateSoundFrequency
    
    ; === CONTROLLER INPUT PROCESSING ===
    JSR ProcessControllerInput
    
    ; === GAME TIMER SYSTEM ===
    JSR UpdateGameTimer
    
    RTS

UpdateSpriteAnimation:
    ; Update animation frame for each sprite
    LDX #0          ; Initialize sprite index
    
SpriteAnimLoop:
    ; Increment animation counter
    INC SpriteAnimCounter,X
    
    ; Check if reached animation speed
    LDA SpriteAnimCounter,X
    CMP #4          ; Change frame every 4 updates
    BNE NextSprite  ; Continue if not time to change
    
    ; Reset counter and advance frame
    LDA #0
    STA SpriteAnimCounter,X
    
    INC SpriteFrame,X ; Advance to next frame
    LDA SpriteFrame,X
    CMP #4          ; Check if reached last frame (4 frames total)
    BNE NextSprite  ; Continue if not at end
    
    ; Reset to first frame
    LDA #0
    STA SpriteFrame,X
    
NextSprite:
    INX             ; Move to next sprite
    CPX #8          ; Check if processed all 8 sprites
    BNE SpriteAnimLoop ; Continue if more sprites
    
    RTS

UpdateScrolling:
    ; Update background scroll position
    INC ScrollFineX ; Increment fine X scroll
    LDA ScrollFineX
    CMP #8          ; Check if scrolled a full tile (8 pixels)
    BNE ScrollDone  ; Continue if not at tile boundary
    
    ; Reset fine scroll and increment coarse scroll
    LDA #0
    STA ScrollFineX
    
    INC ScrollCoarseX ; Increment coarse X position
    LDA ScrollCoarseX
    CMP #32         ; Check if reached edge of nametable (32 tiles)
    BNE ScrollDone  ; Continue if not at edge
    
    ; Wrap to other nametable
    LDA #0
    STA ScrollCoarseX
    
    ; Toggle nametable
    LDA CurrentNametable
    EOR #1          ; Toggle bit 0 (switch between nametables 0 and 1)
    STA CurrentNametable
    
ScrollDone:
    ; Store scroll values for PPU
    LDA ScrollFineX
    STA $0400       ; Store for PPU register
    LDA ScrollCoarseX
    STA $0401       ; Store for PPU register
    
    RTS

UpdateSoundFrequency:
    ; Create vibrato effect by oscillating frequency
    INC VibratoCounter
    LDA VibratoCounter
    AND #15         ; Create 16-step cycle
    CMP #8          ; Check which half of cycle
    BCC VibratoUp   ; First half: increase frequency
    
    ; Second half: decrease frequency
    LDA BaseFrequency
    SEC
    SBC VibratoDepth ; Subtract vibrato amount
    JMP StoreFrequency
    
VibratoUp:
    LDA BaseFrequency
    CLC
    ADC VibratoDepth ; Add vibrato amount
    
StoreFrequency:
    STA CurrentFrequency
    STA $0410       ; Store for APU register
    
    ; Update octave control using shifts
    LDA OctaveShift
    BEQ NoOctaveShift ; Skip if no octave change
    
    LDA CurrentFrequency
    LSR A           ; Divide by 2 for each octave up
    DEC OctaveShift
    BNE NoOctaveShift
    STA CurrentFrequency
    
NoOctaveShift:
    RTS

ProcessControllerInput:
    ; Read controller and process button presses
    LDA ControllerData ; Load controller state
    
    ; Check each button and increment counters
    LSR A           ; Shift A button into carry
    BCC CheckB      ; Skip if A button not pressed
    INC AButtonCounter
    
CheckB:
    LSR A           ; Shift B button into carry
    BCC CheckSelect ; Skip if B button not pressed
    INC BButtonCounter
    
CheckSelect:
    LSR A           ; Shift Select button into carry
    BCC CheckStart  ; Skip if Select not pressed
    INC SelectCounter
    
CheckStart:
    LSR A           ; Shift Start button into carry
    BCC CheckDirections ; Skip if Start not pressed
    INC StartCounter
    
CheckDirections:
    ; Process directional pad
    LSR A           ; Shift Up into carry
    BCC CheckDown
    INC UpCounter
    
CheckDown:
    LSR A           ; Shift Down into carry
    BCC CheckLeft
    INC DownCounter
    
CheckLeft:
    LSR A           ; Shift Left into carry
    BCC CheckRight
    INC LeftCounter
    
CheckRight:
    LSR A           ; Shift Right into carry
    BCC InputDone
    INC RightCounter
    
InputDone:
    ; Store button press counts for display
    LDA AButtonCounter
    STA $0500
    LDA BButtonCounter
    STA $0501
    ; ... store other counters
    
    RTS

UpdateGameTimer:
    ; Update game timer (minutes:seconds format)
    INC TimerFrames ; Increment frame counter
    LDA TimerFrames
    CMP #60         ; Check if reached 60 frames (1 second)
    BNE TimerDone   ; Continue if not a full second
    
    ; Reset frame counter and increment seconds
    LDA #0
    STA TimerFrames
    
    INC TimerSeconds
    LDA TimerSeconds
    CMP #60         ; Check if reached 60 seconds
    BNE TimerDone   ; Continue if not a full minute
    
    ; Reset seconds and increment minutes
    LDA #0
    STA TimerSeconds
    
    INC TimerMinutes
    LDA TimerMinutes
    CMP #99         ; Cap at 99 minutes
    BNE TimerDone
    
    ; Timer maxed out
    LDA #99
    STA TimerMinutes
    LDA #59
    STA TimerSeconds
    
TimerDone:
    ; Store timer for display
    LDA TimerMinutes
    STA $0600
    LDA TimerSeconds
    STA $0601
    
    RTS

; Animation data
SpriteAnimCounter: .byte 0, 0, 0, 0, 0, 0, 0, 0  ; 8 sprites
SpriteFrame:       .byte 0, 0, 0, 0, 0, 0, 0, 0  ; 8 sprites

; Scrolling data
ScrollFineX:       .byte 0
ScrollCoarseX:     .byte 0
CurrentNametable:  .byte 0

; Sound data
VibratoCounter:    .byte 0
BaseFrequency:     .byte $80
VibratoDepth:      .byte $04
CurrentFrequency:  .byte $80
OctaveShift:       .byte 0

; Controller data
ControllerData:    .byte $FF    ; Simulate all buttons pressed
AButtonCounter:    .byte 0
BButtonCounter:    .byte 0
SelectCounter:     .byte 0
StartCounter:      .byte 0
UpCounter:         .byte 0
DownCounter:       .byte 0
LeftCounter:       .byte 0
RightCounter:      .byte 0

; Timer data
TimerFrames:       .byte 0
TimerSeconds:      .byte 0
TimerMinutes:      .byte 0
```

## Advanced Techniques

### Combining Operations
```text
; Fast multiply by 10: (n × 8) + (n × 2)
LDA Value       ; Load number
ASL A           ; × 2
STA Temp        ; Save × 2
ASL A           ; × 4
ASL A           ; × 8
CLC
ADC Temp        ; Add × 2 result
; A now contains Value × 10
```

### Bit Field Manipulation
```text
; Extract 3-bit field from bits 2-4
LDA DataByte    ; Load source
LSR A           ; Shift out bits 0-1
LSR A
AND #%00000111  ; Mask to 3 bits
; A now contains bits 2-4 in positions 0-2
```

**Advanced Techniques:**

```assembly
; Advanced techniques combining increment, decrement, and shift operations
; Demonstrates sophisticated bit manipulation and arithmetic

AdvancedTechniques:
    ; === FAST MULTIPLICATION BY CONSTANTS ===
    JSR MultiplyBy10
    JSR MultiplyBy15
    JSR MultiplyBy9
    
    ; === BIT FIELD MANIPULATION ===
    JSR PackBitFields
    JSR UnpackBitFields
    
    ; === EFFICIENT COUNTERS ===
    JSR PowerOfTwoCounter
    JSR ModuloCounter
    
    ; === GRAPHICS BIT MANIPULATION ===
    JSR PixelDoubling
    JSR ColorExtraction
    
    RTS

MultiplyBy10:
    ; Fast multiply by 10 using: (n × 8) + (n × 2)
    LDA #7          ; Test value
    STA OriginalValue
    
    ASL A           ; × 2
    STA TempResult  ; Save × 2
    
    LDA OriginalValue
    ASL A           ; × 2
    ASL A           ; × 4
    ASL A           ; × 8
    CLC
    ADC TempResult  ; Add × 2 result
    ; A now contains 7 × 10 = 70
    
    STA $0600       ; Display result
    RTS

MultiplyBy15:
    ; Fast multiply by 15 using: (n × 16) - n
    LDA #4          ; Test value
    STA OriginalValue
    
    ASL A           ; × 2
    ASL A           ; × 4
    ASL A           ; × 8
    ASL A           ; × 16
    SEC
    SBC OriginalValue ; Subtract original (× 16 - × 1 = × 15)
    ; A now contains 4 × 15 = 60
    
    STA $0601       ; Display result
    RTS

MultiplyBy9:
    ; Fast multiply by 9 using: (n × 8) + n
    LDA #5          ; Test value
    STA OriginalValue
    
    ASL A           ; × 2
    ASL A           ; × 4
    ASL A           ; × 8
    CLC
    ADC OriginalValue ; Add original (× 8 + × 1 = × 9)
    ; A now contains 5 × 9 = 45
    
    STA $0602       ; Display result
    RTS

PackBitFields:
    ; Pack multiple small values into one byte
    ; Pack: 3-bit value A, 3-bit value B, 2-bit value C
    LDA #5          ; Value A (3 bits max: 0-7)
    AND #%00000111  ; Ensure only 3 bits
    ASL A           ; Shift to bits 5-3
    ASL A
    ASL A
    STA PackedData  ; Store shifted value A
    
    LDA #3          ; Value B (3 bits max: 0-7)
    AND #%00000111  ; Ensure only 3 bits
    ; Value B goes in bits 2-0, so no shift needed
    ORA PackedData  ; Combine with value A
    STA PackedData  ; Store combined A+B
    
    LDA #2          ; Value C (2 bits max: 0-3)
    AND #%00000011  ; Ensure only 2 bits
    ASL A           ; Shift to bits 7-6
    ASL A
    ASL A
    ASL A
    ASL A
    ASL A
    ORA PackedData  ; Combine with A+B
    STA PackedData  ; Store final packed result
    
    LDA PackedData
    STA $0610       ; Display packed result
    RTS

UnpackBitFields:
    ; Unpack the bit fields we just packed
    LDA PackedData  ; Load packed data
    
    ; Extract value C (bits 7-6)
    LSR A           ; Shift right to position
    LSR A
    LSR A
    LSR A
    LSR A
    LSR A
    AND #%00000011  ; Mask to 2 bits
    STA ValueC      ; Store extracted value C
    STA $0611       ; Display value C
    
    ; Extract value A (bits 5-3)
    LDA PackedData  ; Reload packed data
    LSR A           ; Shift right to position
    LSR A
    LSR A
    AND #%00000111  ; Mask to 3 bits
    STA ValueA      ; Store extracted value A
    STA $0612       ; Display value A
    
    ; Extract value B (bits 2-0)
    LDA PackedData  ; Reload packed data
    AND #%00000111  ; Mask to 3 bits (already in position)
    STA ValueB      ; Store extracted value B
    STA $0613       ; Display value B
    
    RTS

PowerOfTwoCounter:
    ; Efficient counter that only counts powers of 2
    INC PowerCounter ; Increment counter
    LDA PowerCounter
    
    ; Check if counter is a power of 2
    STA TempValue   ; Save counter
    DEC A           ; A = counter - 1
    AND TempValue   ; A = counter & (counter - 1)
    BNE NotPowerOfTwo ; If result ≠ 0, not a power of 2
    
    ; Counter is a power of 2
    LDA #1
    STA PowerOfTwoFlag
    JMP PowerCounterDone
    
NotPowerOfTwo:
    LDA #0
    STA PowerOfTwoFlag
    
PowerCounterDone:
    LDA PowerCounter
    STA $0620       ; Display counter
    LDA PowerOfTwoFlag
    STA $0621       ; Display power-of-2 flag
    RTS

ModuloCounter:
    ; Efficient modulo using bit operations (for powers of 2)
    INC ModCounter  ; Increment counter
    LDA ModCounter
    AND #%00000111  ; Modulo 8 using bit mask (2^3 = 8)
    STA ModResult   ; Store result (0-7)
    
    STA $0630       ; Display modulo result
    
    ; Also demonstrate modulo 16
    LDA ModCounter
    AND #%00001111  ; Modulo 16 using bit mask (2^4 = 16)
    STA $0631       ; Display modulo 16 result
    
    RTS

PixelDoubling:
    ; Double pixel width for graphics scaling
    LDA #%00110011  ; Original 4-pixel pattern
    STA OriginalPixels
    
    ; Method 1: Shift and OR
    ASL A           ; Shift left
    ORA OriginalPixels ; Combine with original
    STA DoubledPixels1
    STA $0640       ; Display doubled pattern
    
    ; Method 2: Bit-by-bit doubling
    LDA OriginalPixels
    LDX #0          ; Clear result
    LDY #4          ; Process 4 bits
    
PixelDoubleLoop:
    ASL A           ; Shift bit into carry
    ROL X           ; Rotate carry into result
    ROL X           ; Rotate again (double the bit)
    DEY             ; Decrement bit counter
    BNE PixelDoubleLoop ; Continue for all bits
    
    STX DoubledPixels2
    STX $0641       ; Display bit-doubled pattern
    
    RTS

ColorExtraction:
    ; Extract color components from packed color data
    ; Format: RRRGGGBB (3 red, 3 green, 2 blue bits)
    LDA #%11010110  ; Packed color data
    STA PackedColor
    
    ; Extract red component (bits 7-5)
    LSR A           ; Shift to position
    LSR A
    LSR A
    LSR A
    LSR A
    AND #%00000111  ; Mask to 3 bits
    STA RedComponent
    STA $0650       ; Display red
    
    ; Extract green component (bits 4-2)
    LDA PackedColor ; Reload original
    LSR A           ; Shift to position
    LSR A
    AND #%00000111  ; Mask to 3 bits
    STA GreenComponent
    STA $0651       ; Display green
    
    ; Extract blue component (bits 1-0)
    LDA PackedColor ; Reload original
    AND #%00000011  ; Mask to 2 bits (already in position)
    STA BlueComponent
    STA $0652       ; Display blue
    
    RTS

; Data storage
OriginalValue:     .byte 0
TempResult:        .byte 0
PackedData:        .byte 0
ValueA:            .byte 0
ValueB:            .byte 0
ValueC:            .byte 0
PowerCounter:      .byte 0
PowerOfTwoFlag:    .byte 0
TempValue:         .byte 0
ModCounter:        .byte 0
ModResult:         .byte 0
OriginalPixels:    .byte 0
DoubledPixels1:    .byte 0
DoubledPixels2:    .byte 0
PackedColor:       .byte 0
RedComponent:      .byte 0
GreenComponent:    .byte 0
BlueComponent:     .byte 0
```

## Practice Exercise

**Increment and Shift Practice:**

```assembly
; Practice Exercise: NES Game Object Manager
; Use increment, decrement, and shift operations for game object management

GameObjectPractice:
    ; Initialize game objects
    JSR InitializeObjects
    
    ; Update all objects
    JSR UpdateObjects
    
    ; Process object states
    JSR ProcessObjectStates
    
    ; Clean up inactive objects
    JSR CleanupObjects
    
    RTS

InitializeObjects:
    ; Initialize object array
    LDX #0          ; Object index
    
InitLoop:
    ; Clear object data
    LDA #0
    STA ObjectType,X     ; Clear object type
    STA ObjectX,X        ; Clear X position
    STA ObjectY,X        ; Clear Y position
    STA ObjectState,X    ; Clear object state
    
    INX             ; Move to next object
    CPX #MaxObjects ; Check if initialized all objects
    BNE InitLoop    ; Continue if more objects
    
    ; Create initial objects
    LDX #0          ; First object
    LDA #1          ; Object type 1 (player)
    STA ObjectType,X
    LDA #$80        ; Center X
    STA ObjectX,X
    LDA #$70        ; Center Y
    STA ObjectY,X
    LDA #$FF        ; Active state
    STA ObjectState,X
    
    INX             ; Second object
    LDA #2          ; Object type 2 (enemy)
    STA ObjectType,X
    LDA #$40        ; Left side
    STA ObjectX,X
    LDA #$60        ; Upper area
    STA ObjectY,X
    LDA #$FF        ; Active state
    STA ObjectState,X
    
    RTS

UpdateObjects:
    ; Update all active objects
    LDX #0          ; Object index
    
UpdateLoop:
    ; Check if object is active
    LDA ObjectState,X
    BEQ NextObject  ; Skip if inactive
    
    ; Update based on object type
    LDA ObjectType,X
    CMP #1          ; Player object?
    BEQ UpdatePlayer
    CMP #2          ; Enemy object?
    BEQ UpdateEnemy
    JMP NextObject  ; Unknown type, skip
    
UpdatePlayer:
    ; Update player object
    ; Move right slowly
    INC ObjectX,X   ; Increment X position
    
    ; Check right boundary
    LDA ObjectX,X
    CMP #$F0        ; Right edge
    BCC PlayerOK    ; Continue if within bounds
    
    ; Wrap to left side
    LDA #$10
    STA ObjectX,X
    
PlayerOK:
    JMP NextObject
    
UpdateEnemy:
    ; Update enemy object
    ; Move in circular pattern using bit manipulation
    INC EnemyAngle,X ; Increment angle
    
    ; Calculate new position using angle
    LDA EnemyAngle,X
    
    ; Extract X movement component (use upper bits)
    LSR A           ; Divide angle
    LSR A
    AND #%00000111  ; Mask to 3 bits (0-7 range)
    ASL A           ; Multiply by 2
    ASL A           ; Multiply by 4 (expand range)
    CLC
    ADC #$40        ; Add base position
    STA ObjectX,X   ; Store new X position
    
    ; Extract Y movement component (use lower bits)
    LDA EnemyAngle,X
    AND #%00000111  ; Mask to 3 bits
    ASL A           ; Multiply by 2
    CLC
    ADC #$60        ; Add base position
    STA ObjectY,X   ; Store new Y position
    
NextObject:
    INX             ; Move to next object
    CPX #MaxObjects ; Check if processed all objects
    BNE UpdateLoop  ; Continue if more objects
    
    RTS

ProcessObjectStates:
    ; Process object state changes and animations
    LDX #0          ; Object index
    
StateLoop:
    ; Check if object is active
    LDA ObjectState,X
    BEQ NextState   ; Skip if inactive
    
    ; Increment animation counter
    INC AnimCounter,X
    
    ; Check animation frame change (every 8 updates)
    LDA AnimCounter,X
    AND #%00000111  ; Modulo 8 using bit mask
    BNE NoFrameChange ; Skip if not frame change time
    
    ; Change animation frame
    INC AnimFrame,X
    LDA AnimFrame,X
    AND #%00000011  ; Modulo 4 (4 animation frames)
    STA AnimFrame,X
    
NoFrameChange:
    ; Process object lifetime
    DEC ObjectLifetime,X ; Decrement lifetime
    BNE NextState   ; Continue if still alive
    
    ; Object lifetime expired
    LDA #0
    STA ObjectState,X ; Deactivate object
    
NextState:
    INX             ; Move to next object
    CPX #MaxObjects ; Check if processed all objects
    BNE StateLoop   ; Continue if more objects
    
    RTS

CleanupObjects:
    ; Compact object array by removing inactive objects
    LDX #0          ; Source index
    LDY #0          ; Destination index
    
CleanupLoop:
    ; Check if source object is active
    LDA ObjectState,X
    BEQ SkipObject  ; Skip inactive objects
    
    ; Copy active object to destination
    CPX Y           ; Are source and destination the same?
    BEQ SamePosition ; Skip copy if same position
    
    ; Copy object data
    LDA ObjectType,X
    STA ObjectType,Y
    LDA ObjectX,X
    STA ObjectX,Y
    LDA ObjectY,X
    STA ObjectY,Y
    LDA ObjectState,X
    STA ObjectState,Y
    LDA AnimCounter,X
    STA AnimCounter,Y
    LDA AnimFrame,X
    STA AnimFrame,Y
    LDA ObjectLifetime,X
    STA ObjectLifetime,Y
    LDA EnemyAngle,X
    STA EnemyAngle,Y
    
SamePosition:
    INY             ; Increment destination index
    
SkipObject:
    INX             ; Increment source index
    CPX #MaxObjects ; Check if processed all source objects
    BNE CleanupLoop ; Continue if more objects
    
    ; Clear remaining slots
    CPY #MaxObjects ; Are we at the end?
    BEQ CleanupDone ; Skip clearing if array is full
    
ClearLoop:
    LDA #0
    STA ObjectType,Y
    STA ObjectState,Y
    INY
    CPY #MaxObjects
    BNE ClearLoop
    
CleanupDone:
    ; Store final object count
    STY ActiveObjectCount
    
    ; Display object data for verification
    LDX #0          ; Display first object
    LDA ObjectType,X
    STA $0700
    LDA ObjectX,X
    STA $0701
    LDA ObjectY,X
    STA $0702
    LDA ObjectState,X
    STA $0703
    
    LDA ActiveObjectCount
    STA $0710       ; Display active object count
    
    RTS

; Object data arrays
MaxObjects = 8
ObjectType:     .byte 0, 0, 0, 0, 0, 0, 0, 0
ObjectX:        .byte 0, 0, 0, 0, 0, 0, 0, 0
ObjectY:        .byte 0, 0, 0, 0, 0, 0, 0, 0
ObjectState:    .byte 0, 0, 0, 0, 0, 0, 0, 0
AnimCounter:    .byte 0, 0, 0, 0, 0, 0, 0, 0
AnimFrame:      .byte 0, 0, 0, 0, 0, 0, 0, 0
ObjectLifetime: .byte 255, 255, 255, 255, 255, 255, 255, 255
EnemyAngle:     .byte 0, 0, 0, 0, 0, 0, 0, 0

ActiveObjectCount: .byte 0

; Challenge exercises:
; 1. Add collision detection using bit manipulation
; 2. Implement object pooling with efficient allocation
; 3. Create particle effects using shift operations
; 4. Add object sorting by depth using increment operations
```

## What You've Learned

In this lesson, you've learned:

1. **Increment/Decrement** - Efficient counting with INC and DEC instructions
2. **Shift Operations** - ASL and LSR for fast multiplication and division
3. **Rotate Operations** - ROL and ROR for advanced bit manipulation
4. **NES Applications** - Using these operations for graphics, sound, and game logic
5. **Advanced Techniques** - Combining operations for complex algorithms

## Looking Ahead

Next, you'll learn about logical operations and advanced bit manipulation - the fine-grained control that makes the 6502 so powerful for detailed data processing and NES hardware control!

## Fun Fact

The 6502's shift and rotate instructions were revolutionary for their time. While many processors required multiple instructions to perform bit manipulation, the 6502 could shift, rotate, and modify bits in single instructions. This made it incredibly efficient for graphics programming, where individual pixels needed to be manipulated, and for sound programming, where frequency values needed to be shifted for octave changes. NES programmers became masters of bit manipulation, using these instructions to create everything from smooth scrolling backgrounds to complex sound effects. The combination of speed and simplicity made the 6502 ideal for real-time applications like video games!