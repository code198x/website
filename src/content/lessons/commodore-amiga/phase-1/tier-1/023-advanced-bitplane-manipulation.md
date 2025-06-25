---
title: "Advanced Bitplane Manipulation"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 23
description: "Master sophisticated bitplane techniques for professional graphics programming. Learn advanced manipulation methods, create complex visual effects, and implement efficient algorithms that push the Amiga's planar graphics system to its limits."
learning_objectives:
  - "Implement complex bitplane algorithms for advanced effects"
  - "Master bitplane rotation, scaling, and transformation"
  - "Create efficient chunky-to-planar conversion routines"
  - "Build advanced color cycling and palette effects"
  - "Optimize bitplane operations for maximum performance"
concepts:
  - "Complex bitplane algorithms and transformations"
  - "Chunky-to-planar conversion techniques"
  - "Advanced color manipulation and effects"
  - "Bitplane-based 3D and perspective effects"
  - "Professional optimization strategies"
estimated_duration: "45-60 minutes"
difficulty: "hard"
code_examples: true
practical_exercise: true
order: 23
---

# Lesson 23: Advanced Bitplane Manipulation

Welcome to advanced bitplane programming! Today you'll learn sophisticated techniques that professional Amiga programmers used to create stunning visual effects. These methods push the planar graphics system beyond its apparent limitations.

## Complex Bitplane Transformations

Implement advanced transformation algorithms using bitplane manipulation:

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Bitplane Transformation Algorithms"
  code="; Advanced bitplane transformation and manipulation techniques

; Rotate bitplane using software transformation
RotateBitplane:
    ; A0 = source bitplane
    ; A1 = destination bitplane  
    ; D0 = rotation angle (0-255, where 256 = 360 degrees)
    ; D1 = center X, D2 = center Y
    
    MOVEM.L D3-D7/A2-A5, -(SP)
    
    ; Get sin/cos values for rotation
    LEA     SineTable, A2
    MOVE.B  (A2,D0.W), D6       ; sin(angle)
    ADD.W   #64, D0             ; cos = sin(angle + 90°)
    AND.W   #$FF, D0
    MOVE.B  (A2,D0.W), D7       ; cos(angle)
    
    ; Convert to signed 8.8 fixed point
    EXT.W   D6
    SUB.W   #128, D6            ; -128 to +127
    EXT.W   D7
    SUB.W   #128, D7
    
    ; Clear destination bitplane
    MOVE.L  A1, A3
    MOVE.W  #1999, D0           ; 8000 bytes / 4
ClearDest:
    CLR.L   (A3)+
    DBF     D0, ClearDest
    
    ; Transform each pixel
    MOVEQ   #0, D4              ; Y counter
    
RotateY:
    MOVEQ   #0, D5              ; X counter
    
RotateX:
    ; Calculate relative position from center
    MOVE.W  D5, D0              ; X
    SUB.W   D1, D0              ; X - centerX
    MOVE.W  D4, D3              ; Y  
    SUB.W   D2, D3              ; Y - centerY
    
    ; Rotate point: X' = X*cos - Y*sin, Y' = X*sin + Y*cos
    MOVE.W  D0, A4              ; Save original X
    MULS    D7, D0              ; X * cos
    MOVE.W  D3, A5              ; Save original Y
    MULS    D6, D3              ; Y * sin
    SUB.L   D3, D0              ; X*cos - Y*sin
    ASR.L   #7, D0              ; Convert from fixed point
    ADD.W   D1, D0              ; Add center back
    
    MOVE.L  A4, D3              ; Restore original X
    MULS    D6, D3              ; X * sin
    MOVE.L  A5, A4              ; Restore original Y
    MULS    D7, A4              ; Y * cos
    ADD.L   A4, D3              ; X*sin + Y*cos
    ASR.L   #7, D3              ; Convert from fixed point
    ADD.W   D2, D3              ; Add center back
    
    ; Check if rotated point is within source bounds
    CMP.W   #0, D0
    BLT     NextRotatePixel
    CMP.W   #319, D0
    BGT     NextRotatePixel
    CMP.W   #0, D3
    BLT     NextRotatePixel
    CMP.W   #199, D3
    BGT     NextRotatePixel
    
    ; Sample source pixel
    BSR     GetBitplanePixel    ; D0=X, D3=Y, A0=source -> D0=pixel
    TST.W   D0
    BEQ     NextRotatePixel
    
    ; Set destination pixel
    MOVE.W  D5, D0              ; Current dest X
    MOVE.W  D4, D3              ; Current dest Y
    BSR     SetBitplanePixel    ; D0=X, D3=Y, A1=dest
    
NextRotatePixel:
    ADDQ.W  #1, D5              ; Next X
    CMP.W   #320, D5
    BLT     RotateX
    
    ADDQ.W  #1, D4              ; Next Y
    CMP.W   #200, D4
    BLT     RotateY
    
    MOVEM.L (SP)+, D3-D7/A2-A5
    RTS

; Scale bitplane with filtering
ScaleBitplane:
    ; A0 = source bitplane
    ; A1 = destination bitplane
    ; D0 = scale factor X (8.8 fixed point)
    ; D1 = scale factor Y (8.8 fixed point)
    
    MOVEM.L D2-D7/A2-A3, -(SP)
    
    ; Clear destination
    MOVE.L  A1, A2
    MOVE.W  #1999, D2
ClearScale:
    CLR.L   (A2)+
    DBF     D2, ClearScale
    
    ; Scale each destination pixel
    MOVEQ   #0, D4              ; Dest Y
    
ScaleY:
    MOVEQ   #0, D5              ; Dest X
    
ScaleX:
    ; Calculate source coordinates
    MOVE.W  D5, D2              ; Dest X
    LSL.W   #8, D2              ; Convert to 8.8
    DIVU    D0, D2              ; Scale back to source
    MOVE.W  D2, D6              ; Source X
    
    MOVE.W  D4, D3              ; Dest Y
    LSL.W   #8, D3              ; Convert to 8.8
    DIVU    D1, D3              ; Scale back to source
    MOVE.W  D3, D7              ; Source Y
    
    ; Check bounds
    CMP.W   #320, D6
    BGE     NextScalePixel
    CMP.W   #200, D7
    BGE     NextScalePixel
    
    ; Bilinear filtering for smooth scaling
    BSR     BilinearSample      ; D6=X, D7=Y, A0=source -> D0=pixel
    
    TST.W   D0
    BEQ     NextScalePixel
    
    ; Set destination pixel
    MOVE.W  D5, D2              ; Dest X
    MOVE.W  D4, D3              ; Dest Y
    BSR     SetBitplanePixel
    
NextScalePixel:
    ADDQ.W  #1, D5
    CMP.W   #320, D5
    BLT     ScaleX
    
    ADDQ.W  #1, D4
    CMP.W   #200, D4
    BLT     ScaleY
    
    MOVEM.L (SP)+, D2-D7/A2-A3
    RTS

; Helper functions for pixel manipulation
GetBitplanePixel:
    ; Get pixel from bitplane
    ; D2 = X, D3 = Y, A0 = bitplane
    ; Returns: D0 = pixel value (0 or 1)
    
    MOVEM.L D1/A2, -(SP)
    
    ; Calculate byte offset
    MOVE.W  D3, D0
    MULU    #40, D0             ; Y * bytes per line
    MOVE.W  D2, D1
    LSR.W   #3, D1              ; X / 8
    ADD.W   D1, D0              ; Byte offset
    LEA     (A0,D0.W), A2       ; Byte address
    
    ; Calculate bit position
    MOVE.W  D2, D1
    AND.W   #7, D1              ; X mod 8
    MOVEQ   #7, D0
    SUB.W   D1, D0              ; Bit position (MSB first)
    
    ; Test bit
    BTST    D0, (A2)
    SNE     D0
    AND.W   #1, D0
    
    MOVEM.L (SP)+, D1/A2
    RTS

SetBitplanePixel:
    ; Set pixel in bitplane
    ; D2 = X, D3 = Y, A1 = bitplane
    
    MOVEM.L D0-D1/A2, -(SP)
    
    ; Calculate byte offset
    MOVE.W  D3, D0
    MULU    #40, D0             ; Y * bytes per line
    MOVE.W  D2, D1
    LSR.W   #3, D1              ; X / 8
    ADD.W   D1, D0              ; Byte offset
    LEA     (A1,D0.W), A2       ; Byte address
    
    ; Calculate bit position
    MOVE.W  D2, D1
    AND.W   #7, D1              ; X mod 8
    MOVEQ   #7, D0
    SUB.W   D1, D0              ; Bit position
    
    ; Set bit
    BSET    D0, (A2)
    
    MOVEM.L (SP)+, D0-D1/A2
    RTS

BilinearSample:
    ; Bilinear filtering sample
    ; D6 = source X, D7 = source Y, A0 = source
    ; Returns: D0 = filtered pixel value
    
    ; For bitplane graphics, this is simplified
    ; Just return nearest neighbor for now
    MOVE.W  D6, D2
    MOVE.W  D7, D3
    BSR     GetBitplanePixel
    RTS

; Sine table for rotation
SineTable:
    DC.B    128,131,134,137,140,143,146,149,152,156,159,162,165,168,171,174
    DC.B    176,179,182,185,188,191,193,196,199,201,204,206,209,211,213,216
    DC.B    218,220,222,224,226,228,230,232,234,235,237,238,240,241,243,244
    DC.B    245,246,247,248,249,249,250,251,251,252,252,252,253,253,253,253
    DC.B    253,253,253,253,252,252,252,251,251,250,249,249,248,247,246,245
    DC.B    244,243,241,240,238,237,235,234,232,230,228,226,224,222,220,218
    DC.B    216,213,211,209,206,204,201,199,196,193,191,188,185,182,179,176
    DC.B    174,171,168,165,162,159,156,152,149,146,143,140,137,134,131,128
    DC.B    125,122,119,116,113,110,107,104,100,97,94,91,88,85,82,79
    DC.B    77,74,71,68,65,62,60,57,54,52,49,47,44,42,40,37
    DC.B    35,33,31,29,27,25,23,21,19,18,16,15,13,12,10,9
    DC.B    8,7,6,5,4,4,3,2,2,1,1,1,0,0,0,0
    DC.B    0,0,0,0,1,1,1,2,2,3,4,4,5,6,7,8
    DC.B    9,10,12,13,15,16,18,19,21,23,25,27,29,31,33,35
    DC.B    37,40,42,44,47,49,52,54,57,60,62,65,68,71,74,77
    DC.B    79,82,85,88,91,94,97,100,104,107,110,113,116,119,122,125"
  language="assembly"
/>

## Chunky-to-Planar Conversion

Convert chunky pixel data to Amiga planar format efficiently:

<CodeRunner 
  system="commodore-amiga"
  title="Efficient Chunky-to-Planar Conversion"
  code="; High-speed chunky to planar conversion routines

; Fast chunky-to-planar conversion for 4-bit pixels
; Each chunky pixel = 4 bits (16 colors)
; Must be converted to 4 separate bitplanes
ChunkyToPlanar4:
    ; A0 = chunky pixel data (4 bits per pixel, packed)
    ; A1 = planar bitplane base address
    ; D0 = width in pixels (must be multiple of 8)
    ; D1 = height in lines
    
    MOVEM.L D2-D7/A2-A6, -(SP)
    
    ; Calculate bitplane addresses
    MOVE.L  A1, A2              ; Bitplane 0
    LEA     8000(A1), A3        ; Bitplane 1
    LEA     16000(A1), A4       ; Bitplane 2
    LEA     24000(A1), A5       ; Bitplane 3
    
    ; Process line by line
    MOVE.W  D1, D7              ; Line counter
    
ChunkyLineLoop:
    ; Process 8 pixels at a time (1 byte per bitplane)
    MOVE.W  D0, D6              ; Pixel counter
    LSR.W   #3, D6              ; Convert to byte counter
    SUBQ.W  #1, D6              ; Adjust for DBF
    
ChunkyByteLoop:
    ; Process 8 chunky pixels into 1 byte per bitplane
    MOVEQ   #0, D2              ; Clear bitplane accumulators
    MOVEQ   #0, D3
    MOVEQ   #0, D4
    MOVEQ   #0, D5
    
    ; Process 8 pixels (4 pixels per chunky byte)
    MOVE.B  (A0)+, D0           ; First chunky byte (2 pixels)
    
    ; Pixel 0 (upper nibble)
    MOVE.B  D0, D1
    LSR.B   #4, D1              ; Get upper nibble
    BSR     ExtractBitplaneBits ; D1 -> bitplane bits
    OR.B    D1, D2              ; Add to bitplane 0
    ROR.B   #1, D2              ; Shift for next pixel
    
    ; Pixel 1 (lower nibble)
    MOVE.B  D0, D1
    AND.B   #$0F, D1            ; Get lower nibble
    BSR     ExtractBitplaneBits
    OR.B    D1, D2
    ROR.B   #1, D2
    
    ; Continue for remaining 6 pixels...
    ; (Process second chunky byte)
    MOVE.B  (A0)+, D0
    
    ; Pixel 2
    MOVE.B  D0, D1
    LSR.B   #4, D1
    BSR     ExtractBitplaneBits
    OR.B    D1, D2
    ROR.B   #1, D2
    
    ; Pixel 3
    MOVE.B  D0, D1
    AND.B   #$0F, D1
    BSR     ExtractBitplaneBits
    OR.B    D1, D2
    ROR.B   #1, D2
    
    ; Continue for pixels 4-7...
    ; (Similar processing for remaining pixels)
    
    ; Store bitplane bytes
    MOVE.B  D2, (A2)+           ; Bitplane 0
    MOVE.B  D3, (A3)+           ; Bitplane 1
    MOVE.B  D4, (A4)+           ; Bitplane 2
    MOVE.B  D5, (A5)+           ; Bitplane 3
    
    DBF     D6, ChunkyByteLoop
    
    DBF     D7, ChunkyLineLoop
    
    MOVEM.L (SP)+, D2-D7/A2-A6
    RTS

; Extract individual bits for bitplanes
ExtractBitplaneBits:
    ; D1 = 4-bit color value (0-15)
    ; Returns: bits distributed to D2-D5 (bitplanes 0-3)
    
    ; Bit 0 to bitplane 0
    BTST    #0, D1
    BEQ     NoBit0
    BSET    #7, D2              ; Set bit in current position
NoBit0:
    
    ; Bit 1 to bitplane 1
    BTST    #1, D1
    BEQ     NoBit1
    BSET    #7, D3
NoBit1:
    
    ; Bit 2 to bitplane 2
    BTST    #2, D1
    BEQ     NoBit2
    BSET    #7, D4
NoBit2:
    
    ; Bit 3 to bitplane 3
    BTST    #3, D1
    BEQ     NoBit3
    BSET    #7, D5
NoBit3:
    
    RTS

; Optimized chunky-to-planar using lookup table
ChunkyToPlanarOptimized:
    ; A0 = chunky data
    ; A1 = planar destination
    ; D0 = pixel count
    ; Uses pre-computed lookup table for speed
    
    MOVEM.L D1-D7/A2-A5, -(SP)
    
    ; Setup bitplane pointers
    MOVE.L  A1, A2              ; BP0
    LEA     8000(A1), A3        ; BP1
    LEA     16000(A1), A4       ; BP2
    LEA     24000(A1), A5       ; BP3
    
    ; Setup lookup table
    LEA     ChunkyLookupTable, A6
    
    ; Convert pixels
    LSR.W   #3, D0              ; Convert to byte count
    SUBQ.W  #1, D0              ; Adjust for DBF
    
OptimizedLoop:
    ; Get 2 chunky pixels (1 byte)
    MOVE.B  (A0)+, D1
    
    ; Process upper nibble (pixel 0)
    MOVE.B  D1, D2
    LSR.B   #4, D2              ; Upper nibble
    LSL.W   #2, D2              ; Convert to table offset
    LEA     (A6,D2.W), A6       ; Table entry
    
    ; Get pre-computed bitplane values
    MOVE.B  (A6)+, D3           ; BP0 contribution
    MOVE.B  (A6)+, D4           ; BP1 contribution
    MOVE.B  (A6)+, D5           ; BP2 contribution
    MOVE.B  (A6)+, D6           ; BP3 contribution
    
    ; Shift for upper half of byte
    LSL.B   #4, D3
    LSL.B   #4, D4
    LSL.B   #4, D5
    LSL.B   #4, D6
    
    ; Process lower nibble (pixel 1)
    AND.B   #$0F, D1            ; Lower nibble
    LSL.W   #2, D1              ; Table offset
    LEA     ChunkyLookupTable, A6
    LEA     (A6,D1.W), A6
    
    ; Add lower nibble contributions
    OR.B    (A6)+, D3           ; BP0
    OR.B    (A6)+, D4           ; BP1
    OR.B    (A6)+, D5           ; BP2
    OR.B    (A6)+, D6           ; BP3
    
    ; Store to bitplanes
    MOVE.B  D3, (A2)+
    MOVE.B  D4, (A3)+
    MOVE.B  D5, (A4)+
    MOVE.B  D6, (A5)+
    
    DBF     D0, OptimizedLoop
    
    MOVEM.L (SP)+, D1-D7/A2-A5
    RTS

; Reverse conversion: Planar-to-chunky
PlanarToChunky:
    ; A0 = planar bitplane base
    ; A1 = chunky destination
    ; D0 = width in pixels
    ; D1 = height in lines
    
    MOVEM.L D2-D7/A2-A5, -(SP)
    
    ; Setup bitplane pointers
    MOVE.L  A0, A2              ; BP0
    LEA     8000(A0), A3        ; BP1
    LEA     16000(A0), A4       ; BP2
    LEA     24000(A0), A5       ; BP3
    
    MOVE.W  D1, D7              ; Line counter
    
PlanarToChunkyLine:
    MOVE.W  D0, D6              ; Pixel counter
    LSR.W   #3, D6              ; Byte counter
    SUBQ.W  #1, D6
    
PlanarToChunkyByte:
    ; Read bitplane bytes
    MOVE.B  (A2)+, D2           ; BP0
    MOVE.B  (A3)+, D3           ; BP1
    MOVE.B  (A4)+, D4           ; BP2
    MOVE.B  (A5)+, D5           ; BP3
    
    ; Convert 8 pixels to chunky format
    MOVEQ   #7, D1              ; Bit counter
    MOVEQ   #0, D0              ; Output accumulator
    
BitLoop:
    ; Extract bit from each bitplane
    LSL.B   #1, D0              ; Make room for next pixel
    
    BTST    D1, D5              ; Test BP3
    BEQ     NoBP3
    OR.B    #$08, D0            ; Set bit 3
NoBP3:
    
    BTST    D1, D4              ; Test BP2
    BEQ     NoBP2
    OR.B    #$04, D0            ; Set bit 2
NoBP2:
    
    BTST    D1, D3              ; Test BP1
    BEQ     NoBP1
    OR.B    #$02, D0            ; Set bit 1
NoBP1:
    
    BTST    D1, D2              ; Test BP0
    BEQ     NoBP0
    OR.B    #$01, D0            ; Set bit 0
NoBP0:
    
    ; Process 2 pixels per byte
    SUBQ.B  #1, D1
    BPL     BitLoop
    
    ; Store chunky byte (2 pixels)
    MOVE.B  D0, (A1)+
    
    DBF     D6, PlanarToChunkyByte
    DBF     D7, PlanarToChunkyLine
    
    MOVEM.L (SP)+, D2-D7/A2-A5
    RTS

; Pre-computed lookup table for chunky conversion
; For each 4-bit color value (0-15), stores the bit pattern
; for each bitplane
ChunkyLookupTable:
    ; Color 0: %0000
    DC.B    %00000000, %00000000, %00000000, %00000000
    ; Color 1: %0001
    DC.B    %00001111, %00000000, %00000000, %00000000
    ; Color 2: %0010
    DC.B    %00000000, %00001111, %00000000, %00000000
    ; Color 3: %0011
    DC.B    %00001111, %00001111, %00000000, %00000000
    ; Color 4: %0100
    DC.B    %00000000, %00000000, %00001111, %00000000
    ; Color 5: %0101
    DC.B    %00001111, %00000000, %00001111, %00000000
    ; Color 6: %0110
    DC.B    %00000000, %00001111, %00001111, %00000000
    ; Color 7: %0111
    DC.B    %00001111, %00001111, %00001111, %00000000
    ; Color 8: %1000
    DC.B    %00000000, %00000000, %00000000, %00001111
    ; Color 9: %1001
    DC.B    %00001111, %00000000, %00000000, %00001111
    ; Color 10: %1010
    DC.B    %00000000, %00001111, %00000000, %00001111
    ; Color 11: %1011
    DC.B    %00001111, %00001111, %00000000, %00001111
    ; Color 12: %1100
    DC.B    %00000000, %00000000, %00001111, %00001111
    ; Color 13: %1101
    DC.B    %00001111, %00000000, %00001111, %00001111
    ; Color 14: %1110
    DC.B    %00000000, %00001111, %00001111, %00001111
    ; Color 15: %1111
    DC.B    %00001111, %00001111, %00001111, %00001111"
  language="assembly"
/>

## Advanced Color and Palette Effects

Create sophisticated color manipulation techniques:

**Advanced Color Cycling and Palette Effects:**

```assembly
; Advanced color cycling and palette manipulation

; Smooth color interpolation between palettes
InterpolatePalettes:
    ; A0 = source palette (32 colors)
    ; A1 = destination palette (32 colors)
    ; A2 = output palette (32 colors)
    ; D0 = interpolation factor (0-255)
    
    MOVEM.L D1-D7, -(SP)
    
    MOVEQ   #31, D7             ; 32 colors
    
InterpolateLoop:
    ; Get source and destination colors
    MOVE.W  (A0)+, D1           ; Source color
    MOVE.W  (A1)+, D2           ; Destination color
    
    ; Extract RGB components from source
    MOVE.W  D1, D3              ; Red component
    AND.W   #$F00, D3
    LSR.W   #8, D3
    
    MOVE.W  D1, D4              ; Green component
    AND.W   #$0F0, D4
    LSR.W   #4, D4
    
    MOVE.W  D1, D5              ; Blue component
    AND.W   #$00F, D5
    
    ; Extract RGB components from destination
    MOVE.W  D2, D6              ; Red component
    AND.W   #$F00, D6
    LSR.W   #8, D6
    SUB.W   D3, D6              ; Delta red
    
    MOVE.W  D2, D1              ; Green component
    AND.W   #$0F0, D1
    LSR.W   #4, D1
    SUB.W   D4, D1              ; Delta green
    
    MOVE.W  D2, D2              ; Blue component
    AND.W   #$00F, D2
    SUB.W   D5, D2              ; Delta blue
    
    ; Interpolate each component
    ; Red: source + (delta * factor / 256)
    MULS    D0, D6              ; Delta * factor
    ASR.L   #8, D6              ; / 256
    ADD.W   D6, D3              ; Add to source
    
    ; Green
    MULS    D0, D1
    ASR.L   #8, D1
    ADD.W   D1, D4
    
    ; Blue
    MULS    D0, D2
    ASR.L   #8, D2
    ADD.W   D2, D5
    
    ; Clamp to valid range (0-15)
    CMP.W   #15, D3
    BLE     RedOK
    MOVE.W  #15, D3
RedOK:
    TST.W   D3
    BPL     RedPos
    MOVEQ   #0, D3
RedPos:
    
    CMP.W   #15, D4
    BLE     GreenOK
    MOVE.W  #15, D4
GreenOK:
    TST.W   D4
    BPL     GreenPos
    MOVEQ   #0, D4
GreenPos:
    
    CMP.W   #15, D5
    BLE     BlueOK
    MOVE.W  #15, D5
BlueOK:
    TST.W   D5
    BPL     BluePos
    MOVEQ   #0, D5
BluePos:
    
    ; Combine back to RGB word
    LSL.W   #8, D3              ; Red to bits 11-8
    LSL.W   #4, D4              ; Green to bits 7-4
    OR.W    D4, D3              ; Combine
    OR.W    D5, D3              ; Add blue
    
    ; Store interpolated color
    MOVE.W  D3, (A2)+
    
    DBF     D7, InterpolateLoop
    
    MOVEM.L (SP)+, D1-D7
    RTS

; Advanced color cycling with multiple cycles
MultiColorCycle:
    ; Implements multiple independent color cycles
    ; A0 = base palette
    ; A1 = output palette
    ; Uses global cycle counters
    
    MOVEM.L D0-D7/A2-A4, -(SP)
    
    ; Copy base palette to output
    MOVE.L  A0, A2
    MOVE.L  A1, A3
    MOVEQ   #31, D7
CopyPalette:
    MOVE.W  (A2)+, (A3)+
    DBF     D7, CopyPalette
    
    ; Cycle 1: Colors 1-8 (fast cycle)
    MOVE.W  CycleCounter1, D0
    ADDQ.W  #2, D0              ; Fast speed
    AND.W   #$1F, D0            ; Keep in range
    MOVE.W  D0, CycleCounter1
    
    LEA     (A1), A2            ; Color 1
    ADD.L   #2, A2
    BSR     RotateColorRange    ; A2=start, D0=offset, D1=count
    
    ; Cycle 2: Colors 9-16 (medium cycle)
    MOVE.W  CycleCounter2, D0
    ADDQ.W  #1, D0              ; Medium speed
    AND.W   #$0F, D0            ; Different range
    MOVE.W  D0, CycleCounter2
    
    LEA     (A1), A2            ; Color 9
    ADD.L   #18, A2             ; Skip to color 9
    MOVEQ   #8, D1              ; 8 colors
    BSR     RotateColorRange
    
    ; Cycle 3: Colors 17-24 (slow cycle)
    MOVE.W  CycleCounter3, D0
    BTST    #0, FrameCounter    ; Every other frame
    BEQ     NoCycle3Update
    
    ADDQ.W  #1, D0
    AND.W   #$07, D0            ; Slow cycle
    MOVE.W  D0, CycleCounter3
    
NoCycle3Update:
    LEA     (A1), A2            ; Color 17
    ADD.L   #34, A2             ; Skip to color 17
    MOVEQ   #8, D1              ; 8 colors
    BSR     RotateColorRange
    
    MOVEM.L (SP)+, D0-D7/A2-A4
    RTS

; Rotate a range of colors
RotateColorRange:
    ; A2 = start of color range
    ; D0 = rotation offset
    ; D1 = number of colors
    
    MOVEM.L D2-D5/A3-A4, -(SP)
    
    ; Create temporary buffer for rotation
    LEA     TempPalette, A3
    
    ; Copy colors to temp buffer
    MOVE.L  A2, A4
    MOVE.W  D1, D2
    SUBQ.W  #1, D2
CopyToTemp:
    MOVE.W  (A4)+, (A3)+
    DBF     D2, CopyToTemp
    
    ; Copy back with rotation
    LEA     TempPalette, A3
    MOVE.W  D1, D2
    SUBQ.W  #1, D2
    
RotateBack:
    ; Calculate source index with rotation
    MOVE.W  D2, D3              ; Current position
    ADD.W   D0, D3              ; Add rotation
    CMP.W   D1, D3              ; Check bounds
    BLT     RotateOK
    SUB.W   D1, D3              ; Wrap around
RotateOK:
    
    ; Copy rotated color
    LSL.W   #1, D3              ; Convert to word offset
    MOVE.W  (A3,D3.W), (A2)
    ADD.L   #2, A2              ; Next destination
    
    DBF     D2, RotateBack
    
    MOVEM.L (SP)+, D2-D5/A3-A4
    RTS

; Plasma palette generation
GeneratePlasmaColors:
    ; Generate colors for plasma effect
    ; A0 = output palette
    ; D0 = animation phase
    
    MOVEM.L D1-D7/A1, -(SP)
    
    LEA     SineTable, A1
    MOVEQ   #31, D7             ; 32 colors
    MOVEQ   #0, D6              ; Color index
    
PlasmaColorLoop:
    ; Calculate color based on index and phase
    MOVE.W  D6, D1              ; Color index
    LSL.W   #3, D1              ; Scale up
    ADD.W   D0, D1              ; Add animation phase
    AND.W   #$FF, D1            ; Keep in sine table range
    
    ; Red component
    MOVE.B  (A1,D1.W), D2       ; Get sine value
    LSR.B   #4, D2              ; Scale to 0-15
    LSL.W   #8, D2              ; Shift to red position
    
    ; Green component (phase shifted)
    MOVE.W  D1, D3
    ADD.W   #85, D3             ; 120 degree phase shift
    AND.W   #$FF, D3
    MOVE.B  (A1,D3.W), D3
    LSR.B   #4, D3
    LSL.W   #4, D3              ; Shift to green position
    OR.W    D3, D2
    
    ; Blue component (another phase shift)
    MOVE.W  D1, D4
    ADD.W   #170, D4            ; 240 degree phase shift
    AND.W   #$FF, D4
    MOVE.B  (A1,D4.W), D4
    LSR.B   #4, D4              ; Blue component
    OR.W    D4, D2
    
    ; Store color
    MOVE.W  D2, (A0)+
    
    ADDQ.W  #1, D6
    DBF     D7, PlasmaColorLoop
    
    MOVEM.L (SP)+, D1-D7/A1
    RTS

; HSV to RGB color conversion
HSVToRGB:
    ; Convert HSV color to RGB
    ; D0 = Hue (0-359)
    ; D1 = Saturation (0-255)
    ; D2 = Value (0-255)
    ; Returns: D0 = RGB color (Amiga format)
    
    MOVEM.L D3-D7, -(SP)
    
    ; Normalize inputs
    CMP.W   #360, D0
    BLT     HueOK
    SUB.W   #360, D0
HueOK:
    
    ; Calculate which sector of color wheel
    MOVE.W  D0, D3
    DIVU    #60, D3             ; Sector (0-5)
    MOVE.W  D3, D4              ; Save sector
    SWAP    D3
    MOVE.W  D3, D5              ; Remainder (position in sector)
    
    ; Calculate intermediate values
    MOVE.W  D2, D6              ; Value
    MULU    D1, D6              ; V * S
    LSR.L   #8, D6              ; / 256
    MOVE.W  D2, D7
    SUB.W   D6, D7              ; V - (V*S) = min
    
    ; Calculate sector-specific values
    MOVE.W  D5, D3              ; Position in sector
    MULU    D6, D3              ; * (V*S)
    DIVU    #60, D3             ; / 60
    
    ; Calculate RGB based on sector
    AND.W   #7, D4              ; Ensure valid sector
    ADD.W   D4, D4              ; Convert to word offset
    MOVE.W  HSVJumpTable(PC,D4.W), D4
    JMP     HSVJumpTable(PC,D4.W)
    
HSVJumpTable:
    DC.W    HSVSector0-HSVJumpTable
    DC.W    HSVSector1-HSVJumpTable
    DC.W    HSVSector2-HSVJumpTable
    DC.W    HSVSector3-HSVJumpTable
    DC.W    HSVSector4-HSVJumpTable
    DC.W    HSVSector5-HSVJumpTable
    
HSVSector0:     ; Red to Yellow
    MOVE.W  D2, D4              ; R = V
    ADD.W   D7, D3              ; G = min + intermediate
    MOVE.W  D7, D5              ; B = min
    BRA     HSVCombine
    
HSVSector1:     ; Yellow to Green
    SUB.W   D3, D2              ; R = V - intermediate
    MOVE.W  D2, D4              ; G = V
    MOVE.W  D7, D5              ; B = min
    BRA     HSVCombine
    
HSVSector2:     ; Green to Cyan
    MOVE.W  D7, D4              ; R = min
    MOVE.W  D2, D3              ; G = V
    ADD.W   D7, D3              ; B = min + intermediate
    MOVE.W  D3, D5
    BRA     HSVCombine
    
HSVSector3:     ; Cyan to Blue
    MOVE.W  D7, D4              ; R = min
    SUB.W   D3, D2              ; G = V - intermediate
    MOVE.W  D2, D5              ; B = V
    BRA     HSVCombine
    
HSVSector4:     ; Blue to Magenta
    ADD.W   D7, D3              ; R = min + intermediate
    MOVE.W  D3, D4
    MOVE.W  D7, D3              ; G = min
    MOVE.W  D2, D5              ; B = V
    BRA     HSVCombine
    
HSVSector5:     ; Magenta to Red
    MOVE.W  D2, D4              ; R = V
    MOVE.W  D7, D3              ; G = min
    SUB.W   D3, D2              ; B = V - intermediate
    MOVE.W  D2, D5
    
HSVCombine:
    ; Convert to Amiga RGB format (4 bits per component)
    LSR.W   #4, D4              ; Scale R to 0-15
    LSR.W   #4, D3              ; Scale G to 0-15
    LSR.W   #4, D5              ; Scale B to 0-15
    
    ; Combine into Amiga color word
    LSL.W   #8, D4              ; Red to bits 11-8
    LSL.W   #4, D3              ; Green to bits 7-4
    OR.W    D3, D4              ; Combine
    OR.W    D5, D4              ; Add blue
    MOVE.W  D4, D0              ; Return value
    
    MOVEM.L (SP)+, D3-D7
    RTS

; Data and variables
CycleCounter1:      DC.W    0
CycleCounter2:      DC.W    0
CycleCounter3:      DC.W    0
FrameCounter:       DC.W    0
TempPalette:        DS.W    32      ; Temporary palette buffer
```

## 3D and Perspective Effects

Implement pseudo-3D effects using bitplane manipulation:

**3D and Perspective Effects with Bitplanes:**

```assembly
; 3D perspective and pseudo-3D effects using bitplanes

; Mode 7-style perspective floor
PerspectiveFloor:
    ; A0 = texture bitplane
    ; A1 = destination bitplane
    ; D0 = horizon Y position
    ; D1 = camera height
    ; D2 = viewing angle
    
    MOVEM.L D3-D7/A2-A4, -(SP)
    
    ; Clear destination
    MOVE.L  A1, A2
    MOVE.W  #1999, D3
ClearPerspFloor:
    CLR.L   (A2)+
    DBF     D3, ClearPerspFloor
    
    ; Render floor line by line
    MOVE.W  D0, D4              ; Start at horizon
    
PerspFloorLoop:
    CMP.W   #200, D4            ; End of screen?
    BGE     PerspFloorDone
    
    ; Calculate distance for this line
    MOVE.W  D4, D3              ; Current Y
    SUB.W   D0, D3              ; Distance from horizon
    BEQ     NextPerspLine       ; Skip horizon
    
    ; Calculate perspective scale
    MOVE.W  D1, D5              ; Camera height
    LSL.W   #8, D5              ; Convert to 8.8 fixed
    DIVU    D3, D5              ; Height / distance = scale
    
    ; Limit scale
    CMP.W   #$0800, D5          ; Max scale
    BLE     PerspScaleOK
    MOVE.W  #$0800, D5
PerspScaleOK:
    
    ; Render this line with perspective
    MOVEQ   #0, D6              ; X counter
    
PerspXLoop:
    ; Calculate texture coordinates
    MOVE.W  D6, D7              ; Screen X
    SUB.W   #160, D7            ; Center X
    MULS    D5, D7              ; Apply perspective scale
    ASR.L   #8, D7              ; Convert from fixed point
    ADD.W   #160, D7            ; Add center back
    
    ; Add texture offset based on viewing angle
    ADD.W   D2, D7              ; Add camera angle
    
    ; Wrap texture coordinates
    AND.W   #255, D7            ; 256x256 texture
    
    ; Sample texture
    MOVE.W  D7, D2              ; Texture X
    MOVE.W  D4, D3              ; Use screen Y for texture Y
    SUB.W   D0, D3              ; Relative to horizon
    AND.W   #255, D3            ; Wrap texture Y
    BSR     SampleTexture       ; Sample texture at D2,D3
    
    TST.W   D0                  ; Got a pixel?
    BEQ     NextPerspX
    
    ; Plot to destination
    MOVE.W  D6, D2              ; Screen X
    MOVE.W  D4, D3              ; Screen Y
    BSR     SetBitplanePixel
    
NextPerspX:
    ADDQ.W  #1, D6
    CMP.W   #320, D6
    BLT     PerspXLoop
    
NextPerspLine:
    ADDQ.W  #1, D4
    BRA     PerspFloorLoop
    
PerspFloorDone:
    MOVEM.L (SP)+, D3-D7/A2-A4
    RTS

; Voxel landscape rendering
VoxelLandscape:
    ; Simple voxel-style landscape
    ; A0 = height map (64x64 bytes)
    ; A1 = color map (64x64 bytes)
    ; A2 = destination bitplane
    ; D0 = camera X, D1 = camera Y, D2 = camera height
    ; D3 = viewing angle
    
    MOVEM.L D4-D7/A3-A5, -(SP)
    
    ; Clear destination
    MOVE.L  A2, A3
    MOVE.W  #1999, D4
ClearVoxel:
    CLR.L   (A3)+
    DBF     D4, ClearVoxel
    
    ; Render from camera position outward
    MOVEQ   #1, D7              ; Distance from camera
    
VoxelDistanceLoop:
    CMP.W   #64, D7             ; Maximum distance
    BGE     VoxelDone
    
    ; Cast rays for this distance
    MOVEQ   #0, D6              ; Angle counter
    
VoxelAngleLoop:
    ; Calculate world position for this ray
    MOVE.W  D3, D4              ; Viewing angle
    ADD.W   D6, D4              ; Add ray angle
    SUB.W   #160, D4            ; Center angle range
    AND.W   #$FF, D4            ; Wrap to 0-255
    
    ; Get sin/cos for ray direction
    LEA     SineTable, A3
    MOVE.B  (A3,D4.W), D5       ; sin(angle)
    ADD.W   #64, D4             ; cos(angle)
    AND.W   #$FF, D4
    MOVE.B  (A3,D4.W), D4       ; cos(angle)
    
    ; Convert to signed values
    EXT.W   D5
    SUB.W   #128, D5
    EXT.W   D4
    SUB.W   #128, D4
    
    ; Calculate world position
    MULS    D7, D5              ; Distance * sin
    ASR.L   #7, D5              ; Scale
    ADD.W   D1, D5              ; Add camera Y
    
    MULS    D7, D4              ; Distance * cos
    ASR.L   #7, D4              ; Scale
    ADD.W   D0, D4              ; Add camera X
    
    ; Check bounds
    CMP.W   #0, D4
    BLT     NextVoxelAngle
    CMP.W   #63, D4
    BGT     NextVoxelAngle
    CMP.W   #0, D5
    BLT     NextVoxelAngle
    CMP.W   #63, D5
    BGT     NextVoxelAngle
    
    ; Sample height map
    LSL.W   #6, D5              ; Y * 64
    ADD.W   D4, D5              ; Add X
    LEA     (A0,D5.W), A4       ; Height map address
    MOVE.B  (A4), D5            ; Get height
    EXT.W   D5
    
    ; Calculate screen Y position
    SUB.W   D2, D5              ; Subtract camera height
    MULS    #100, D5            ; Scale for perspective
    DIVS    D7, D5              ; Divide by distance
    ADD.W   #100, D5            ; Add horizon
    
    ; Check if visible on screen
    CMP.W   #0, D5
    BLT     NextVoxelAngle
    CMP.W   #199, D5
    BGT     NextVoxelAngle
    
    ; Plot voxel column
    MOVE.W  D6, D4              ; Screen X
    ADD.W   #80, D4             ; Center on screen
    MOVE.W  D5, D3              ; Screen Y
    
    ; Sample color and plot
    LEA     (A1,D5.W), A4       ; Color map (reuse height offset)
    MOVE.B  (A4), D0            ; Get color
    AND.W   #1, D0              ; Convert to bit
    
    TST.W   D0
    BEQ     NextVoxelAngle
    
    ; Draw vertical line from horizon to calculated Y
    MOVE.W  #100, D1            ; Horizon Y
VoxelColumnLoop:
    CMP.W   D5, D1              ; Reached calculated Y?
    BGT     NextVoxelAngle
    
    MOVE.W  D4, D2              ; X position
    MOVE.W  D1, D3              ; Y position
    BSR     SetBitplanePixel
    
    ADDQ.W  #1, D1
    BRA     VoxelColumnLoop
    
NextVoxelAngle:
    ADDQ.W  #1, D6
    CMP.W   #320, D6
    BLT     VoxelAngleLoop
    
    ADDQ.W  #1, D7              ; Next distance
    BRA     VoxelDistanceLoop
    
VoxelDone:
    MOVEM.L (SP)+, D4-D7/A3-A5
    RTS

; Tunnel effect using bitplane manipulation
TunnelEffect:
    ; A0 = destination bitplane
    ; D0 = tunnel depth animation
    ; D1 = rotation animation
    
    MOVEM.L D2-D7/A1-A2, -(SP)
    
    ; Clear destination
    MOVE.L  A0, A1
    MOVE.W  #1999, D2
ClearTunnel:
    CLR.L   (A1)+
    DBF     D2, ClearTunnel
    
    ; Generate tunnel pattern
    MOVEQ   #0, D6              ; Y counter
    
TunnelYLoop:
    MOVEQ   #0, D7              ; X counter
    
TunnelXLoop:
    ; Calculate distance from center
    MOVE.W  D7, D2              ; X
    SUB.W   #160, D2            ; Center X
    MOVE.W  D6, D3              ; Y
    SUB.W   #100, D3            ; Center Y
    
    ; Calculate squared distance
    MULS    D2, D2              ; X^2
    MULS    D3, D3              ; Y^2
    ADD.L   D3, D2              ; X^2 + Y^2
    
    ; Convert to distance (approximate)
    BSR     SquareRoot          ; D2 = distance
    
    ; Calculate tunnel pattern
    ADD.W   D0, D2              ; Add depth animation
    AND.W   #$1F, D2            ; Create pattern repeat
    
    ; Create tunnel rings
    CMP.W   #16, D2
    BLT     TunnelPixelSet
    
    ; Add rotation effect
    MOVE.W  D7, D3              ; X
    SUB.W   #160, D3            ; Center
    MOVE.W  D6, D4              ; Y
    SUB.W   #100, D4            ; Center
    
    ; Simple rotation check
    ADD.W   D1, D3              ; Add rotation
    AND.W   #$0F, D3            ; Pattern
    CMP.W   #8, D3
    BGE     NextTunnelPixel
    
TunnelPixelSet:
    ; Set pixel
    MOVE.W  D7, D2              ; X
    MOVE.W  D6, D3              ; Y
    BSR     SetBitplanePixel
    
NextTunnelPixel:
    ADDQ.W  #1, D7
    CMP.W   #320, D7
    BLT     TunnelXLoop
    
    ADDQ.W  #1, D6
    CMP.W   #200, D6
    BLT     TunnelYLoop
    
    MOVEM.L (SP)+, D2-D7/A1-A2
    RTS

; Simple square root approximation
SquareRoot:
    ; D2 = input value
    ; Returns: D2 = approximate square root
    
    MOVEM.L D0-D1, -(SP)
    
    ; Newton-Raphson method (simplified)
    MOVE.L  D2, D0              ; Input
    MOVE.L  D2, D1              ; Initial guess
    LSR.L   #1, D1              ; / 2
    
    ; One iteration (more could be added for accuracy)
    DIVU    D1, D0              ; Input / guess
    ADD.W   D0, D1              ; Add to guess
    LSR.W   #1, D1              ; Average
    
    MOVE.W  D1, D2              ; Return result
    
    MOVEM.L (SP)+, D0-D1
    RTS

; Sample texture helper function
SampleTexture:
    ; D2 = texture X, D3 = texture Y, A0 = texture bitplane
    ; Returns: D0 = pixel value
    
    ; Simple texture sampling
    MOVE.W  D3, D0
    LSL.W   #5, D0              ; Y * 32 (assuming 256x256 texture stored as 32 bytes/line)
    MOVE.W  D2, D1
    LSR.W   #3, D1              ; X / 8
    ADD.W   D1, D0              ; Byte offset
    
    AND.W   #7, D2              ; Bit position
    MOVEQ   #7, D1
    SUB.W   D2, D1              ; MSB first
    
    LEA     (A0,D0.W), A2       ; Byte address
    BTST    D1, (A2)
    SNE     D0
    AND.W   #1, D0
    
    RTS
```

## Practice Exercise: Advanced Graphics Demo

Create a comprehensive demonstration of advanced bitplane techniques:

**Practice: Advanced Bitplane Graphics Showcase:**

```assembly
; Complete advanced bitplane graphics demonstration
; Showcases all advanced techniques in one demo

AdvancedBitplaneDemo:
    ; Initialize graphics system
    BSR     InitAdvancedGraphics
    
    ; Main demo loop
DemoMainLoop:
    BSR     WaitVBlank
    
    ; Update animation counters
    MOVE.W  DemoFrameCounter, D0
    ADDQ.W  #1, D0
    MOVE.W  D0, DemoFrameCounter
    
    ; Demo sequence control
    LSR.W   #7, D0              ; Change effect every 128 frames
    AND.W   #7, D0              ; 8 different effects
    
    ; Execute current effect
    ADD.W   D0, D0              ; Convert to word offset
    MOVE.W  EffectJumpTable(PC,D0.W), D0
    JMP     EffectJumpTable(PC,D0.W)
    
EffectJumpTable:
    DC.W    Effect1_Rotation-EffectJumpTable
    DC.W    Effect2_Scaling-EffectJumpTable
    DC.W    Effect3_Perspective-EffectJumpTable
    DC.W    Effect4_Chunky-EffectJumpTable
    DC.W    Effect5_ColorCycle-EffectJumpTable
    DC.W    Effect6_Voxel-EffectJumpTable
    DC.W    Effect7_Tunnel-EffectJumpTable
    DC.W    Effect8_Combined-EffectJumpTable

Effect1_Rotation:
    ; Rotating bitplane demo
    LEA     SourceBitplane, A0
    LEA     DestBitplane, A1
    MOVE.W  DemoFrameCounter, D0
    LSR.W   #2, D0              ; Slow rotation
    MOVE.W  #160, D1            ; Center X
    MOVE.W  #100, D2            ; Center Y
    BSR     RotateBitplane
    BRA     ContinueDemo
    
Effect2_Scaling:
    ; Scaling bitplane demo
    LEA     SourceBitplane, A0
    LEA     DestBitplane, A1
    
    ; Animated scaling
    MOVE.W  DemoFrameCounter, D0
    AND.W   #$7F, D0            ; 0-127
    ADD.W   #64, D0             ; 64-191
    LSL.W   #1, D0              ; Scale to 128-382 (0.5x to 1.5x)
    MOVE.W  D0, D1              ; Same X and Y scale
    BSR     ScaleBitplane
    BRA     ContinueDemo
    
Effect3_Perspective:
    ; Perspective floor effect
    LEA     TextureBitplane, A0
    LEA     DestBitplane, A1
    MOVE.W  #120, D0            ; Horizon
    MOVE.W  #100, D1            ; Camera height
    MOVE.W  DemoFrameCounter, D2
    BSR     PerspectiveFloor
    BRA     ContinueDemo
    
Effect4_Chunky:
    ; Chunky to planar demonstration
    BSR     GenerateChunkyData
    LEA     ChunkyBuffer, A0
    LEA     PlanarBuffer, A1
    MOVE.W  #320, D0            ; Width
    MOVE.W  #200, D1            ; Height
    BSR     ChunkyToPlanar4
    BRA     ContinueDemo
    
Effect5_ColorCycle:
    ; Advanced color cycling
    LEA     BasePalette, A0
    LEA     OutputPalette, A1
    BSR     MultiColorCycle
    
    ; Apply to hardware
    BSR     SetPalette
    BRA     ContinueDemo
    
Effect6_Voxel:
    ; Voxel landscape
    LEA     HeightMap, A0
    LEA     ColorMap, A1
    LEA     DestBitplane, A2
    MOVE.W  DemoFrameCounter, D0
    LSR.W   #3, D0              ; Slow movement
    AND.W   #63, D0             ; Camera X
    MOVE.W  #32, D1             ; Camera Y
    MOVE.W  #20, D2             ; Camera height
    MOVE.W  DemoFrameCounter, D3
    LSR.W   #4, D3              ; Slow rotation
    BSR     VoxelLandscape
    BRA     ContinueDemo
    
Effect7_Tunnel:
    ; Tunnel effect
    LEA     DestBitplane, A0
    MOVE.W  DemoFrameCounter, D0
    MOVE.W  DemoFrameCounter, D1
    LSR.W   #1, D1              ; Different speed for rotation
    BSR     TunnelEffect
    BRA     ContinueDemo
    
Effect8_Combined:
    ; Combined effects
    BSR     Effect1_Rotation
    BSR     Effect5_ColorCycle
    
ContinueDemo:
    ; Display result
    BSR     DisplayBitplane
    
    ; Check exit
    BTST    #6, $BFE001
    BNE     DemoMainLoop
    
    RTS

InitAdvancedGraphics:
    ; Setup graphics system for demo
    
    ; Create test source image
    BSR     CreateSourceImage
    
    ; Create test texture
    BSR     CreateTexture
    
    ; Generate height map for voxels
    BSR     GenerateHeightMap
    
    ; Setup initial palette
    BSR     CreateBasePalette
    
    RTS

CreateSourceImage:
    ; Create test image for transformation demos
    LEA     SourceBitplane, A0
    
    ; Draw test pattern
    MOVE.W  #199, D6            ; Y counter
    
SourceYLoop:
    MOVE.W  #39, D7             ; X counter (bytes)
    MOVE.L  A0, A1              ; Save line start
    
SourceXLoop:
    ; Create checkerboard pattern
    MOVE.W  D6, D0              ; Y position
    ADD.W   D7, D0              ; Add X
    BTST    #2, D0              ; Test bit for pattern
    BEQ     SourceClear
    
    MOVE.B  #$FF, (A0)          ; Set byte
    BRA     SourceNext
    
SourceClear:
    MOVE.B  #$00, (A0)          ; Clear byte
    
SourceNext:
    ADDQ.L  #1, A0
    DBF     D7, SourceXLoop
    
    DBF     D6, SourceYLoop
    
    RTS

CreateTexture:
    ; Create test texture for perspective effects
    LEA     TextureBitplane, A0
    
    ; Create concentric squares pattern
    MOVEQ   #0, D6              ; Y counter
    
TextureYLoop:
    MOVEQ   #0, D7              ; X counter
    
TextureXLoop:
    ; Calculate distance from center
    MOVE.W  D7, D0
    SUB.W   #128, D0            ; Center X
    BPL     AbsX
    NEG.W   D0
AbsX:
    
    MOVE.W  D6, D1
    SUB.W   #128, D1            ; Center Y
    BPL     AbsY
    NEG.W   D1
AbsY:
    
    ; Use maximum of X and Y distance
    CMP.W   D0, D1
    BLE     UseX
    MOVE.W  D1, D0
UseX:
    
    ; Create pattern based on distance
    AND.W   #$1F, D0
    CMP.W   #16, D0
    BLT     TextureSet
    
    ; Clear pixel
    MOVE.W  D7, D2
    MOVE.W  D6, D3
    BSR     ClearTexturePixel
    BRA     NextTexturePixel
    
TextureSet:
    ; Set pixel
    MOVE.W  D7, D2
    MOVE.W  D6, D3
    BSR     SetTexturePixel
    
NextTexturePixel:
    ADDQ.W  #1, D7
    CMP.W   #256, D7
    BLT     TextureXLoop
    
    ADDQ.W  #1, D6
    CMP.W   #256, D6
    BLT     TextureYLoop
    
    RTS

GenerateHeightMap:
    ; Generate random-ish height map for voxel demo
    LEA     HeightMap, A0
    LEA     ColorMap, A1
    
    MOVE.W  #4095, D7           ; 64x64 = 4096 pixels
    MOVE.W  #$1234, D6          ; Random seed
    
HeightMapLoop:
    ; Generate pseudo-random height
    ROL.W   #3, D6
    EOR.W   #$5A5A, D6
    MOVE.B  D6, D0
    AND.B   #$3F, D0            ; Height 0-63
    MOVE.B  D0, (A0)+
    
    ; Generate corresponding color
    LSR.B   #4, D0
    AND.B   #$07, D0            ; Color pattern
    MOVE.B  D0, (A1)+
    
    DBF     D7, HeightMapLoop
    
    RTS

GenerateChunkyData:
    ; Generate test chunky data
    LEA     ChunkyBuffer, A0
    
    MOVE.W  #199, D6            ; Y counter
    
ChunkyYLoop:
    MOVE.W  #159, D7            ; X counter (2 pixels per byte)
    
ChunkyXLoop:
    ; Generate gradient pattern
    MOVE.W  D6, D0              ; Y component
    LSR.W   #4, D0              ; Scale down
    MOVE.W  D7, D1              ; X component
    LSR.W   #4, D1
    ADD.W   D1, D0              ; Combine
    AND.W   #$0F, D0            ; Keep in 4-bit range
    
    ; Create byte with two pixels
    LSL.B   #4, D0              ; Upper nibble
    OR.B    D0, D0              ; Duplicate to lower nibble
    MOVE.B  D0, (A0)+
    
    DBF     D7, ChunkyXLoop
    DBF     D6, ChunkyYLoop
    
    RTS

CreateBasePalette:
    ; Create base palette for color cycling
    LEA     BasePalette, A0
    
    MOVEQ   #31, D7             ; 32 colors
    MOVEQ   #0, D6              ; Color counter
    
PaletteLoop:
    ; Create HSV-based palette
    MOVE.W  D6, D0              ; Hue
    LSL.W   #3, D0              ; Scale to 0-248
    MOVE.W  #255, D1            ; Full saturation
    MOVE.W  #255, D2            ; Full value
    BSR     HSVToRGB
    MOVE.W  D0, (A0)+
    
    ADDQ.W  #1, D6
    DBF     D7, PaletteLoop
    
    RTS

SetPalette:
    ; Set hardware palette
    LEA     OutputPalette, A0
    LEA     $DFF180, A1         ; Color registers
    MOVEQ   #31, D7
    
SetPaletteLoop:
    MOVE.W  (A0)+, (A1)+
    DBF     D7, SetPaletteLoop
    
    RTS

DisplayBitplane:
    ; Copy destination bitplane to visible screen
    ; (Implementation would copy to actual display memory)
    RTS

SetTexturePixel:
ClearTexturePixel:
    ; Helper functions for texture creation
    RTS

; Data buffers
DemoFrameCounter:   DC.W    0
SourceBitplane:     DS.B    8000
DestBitplane:       DS.B    8000
TextureBitplane:    DS.B    8192        ; 256x256 texture
PlanarBuffer:       DS.B    32000       ; 4 bitplanes
ChunkyBuffer:       DS.B    16000       ; Chunky pixel data
HeightMap:          DS.B    4096        ; 64x64 height map
ColorMap:           DS.B    4096        ; 64x64 color map
BasePalette:        DS.W    32
OutputPalette:      DS.W    32

; Run the advanced demo!
BSR     AdvancedBitplaneDemo
```

## What You've Learned

In this lesson, you've mastered advanced bitplane manipulation:

- **Complex transformations** including rotation, scaling, and perspective effects
- **Efficient chunky-to-planar conversion** for working with external graphics data
- **Advanced color techniques** including interpolation, cycling, and HSV conversion
- **3D and perspective effects** using software transformation
- **Optimization strategies** for maximum performance
- **Professional graphics programming** techniques used in commercial software

## Looking Ahead

Next, you'll learn about graphics integration projects where you'll combine all the graphics techniques you've learned - bitplanes, Copper, sprites, and Blitter - into complete multimedia applications that showcase the full power of the Amiga's graphics architecture!

## Fun Fact

The advanced bitplane techniques you've learned were the foundation of many legendary Amiga graphics applications and games. The chunky-to-planar conversion routines were essential for porting graphics from other platforms and for real-time 3D rendering. Many of the color cycling and palette techniques became standard practices in the video game industry. The perspective and 3D effects you've implemented were used in classic games like "Another World" and the early "Wolfenstein 3D" prototype. These techniques were so advanced that they influenced the development of later graphics standards - modern graphics APIs still use similar concepts of planar organization, color space conversion, and perspective transformation, just implemented in hardware rather than software!