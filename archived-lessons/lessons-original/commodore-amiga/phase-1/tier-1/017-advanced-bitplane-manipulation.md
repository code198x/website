---
title: "Advanced Bitplane Manipulation"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 17
description: "Master the Amiga's revolutionary bitplane graphics system. Learn how to manipulate multiple bitplanes for stunning visual effects, work with different screen modes, and optimize graphics operations for professional results."
learning_objectives:
  - "Understand the Amiga's planar graphics architecture in depth"
  - "Master bitplane manipulation for multiple color depths"
  - "Learn screen mode configuration and optimization"
  - "Create efficient graphics routines using bitplane operations"
  - "Implement professional graphics techniques"
concepts:
  - "Planar graphics architecture"
  - "Bitplane interleaving and organization"
  - "Screen mode configuration (BPLCON0-2)"
  - "Modulo programming for graphics effects"
  - "Efficient bitplane manipulation techniques"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 17
---

# Lesson 17: Advanced Bitplane Manipulation

**See how the Amiga's bitplane system creates rich graphics with elegant code:**

```assembly
; This creates 64 simultaneous colours on screen using just 6 bitplanes
; by enabling Extra-HalfBrite mode - one of the Amiga's clever graphics tricks

    MOVE.W  #$6200, $DFF100    ; Enable Extra-HalfBrite mode
    ; 32 base colours + 32 half-bright = 64 colours total

    MOVE.L  #GRAPHICS_MEM, $DFF0E0  ; Bitplane 1
    MOVE.L  #GRAPHICS_MEM+8000, $DFF0E4  ; Bitplane 2
    ; Each bitplane adds exponential colour depth!
```

That's the power of **planar graphics architecture** - the innovative bitplane system that made Amiga graphics so impressive! Today you'll learn these advanced techniques to create stunning visual effects for your Copper Dreams game.

## Understanding Planar Graphics Architecture

The Amiga's graphics system uses **bitplanes** - separate memory areas where each stores one bit of color information for every pixel. This planar approach was key to the Amiga's graphics superiority:

### How Bitplanes Create Colors

```text
1 bitplane  = 2 colors  (2^1)
2 bitplanes = 4 colors  (2^2)
3 bitplanes = 8 colors  (2^3)
4 bitplanes = 16 colors (2^4)
5 bitplanes = 32 colors (2^5)
6 bitplanes = 64 colors (2^6) - Extra Half-Brite or HAM mode
```

Each pixel's color is determined by combining the corresponding bits from all active bitplanes:

```text
Pixel at (x,y):
Bitplane 0, bit at (x,y) = 1
Bitplane 1, bit at (x,y) = 0
Bitplane 2, bit at (x,y) = 1
Bitplane 3, bit at (x,y) = 1
Color index = 1101 binary = 13 decimal = COLOR13 register
```

## Bitplane Memory Organization

Understanding memory layout is crucial for efficient graphics programming:

**Bitplane Memory Layout Demonstration:**

```assembly
; Bitplane memory organization example
; Each bitplane is 320x200 pixels = 8000 bytes

; Calculate bitplane size
SCREEN_WIDTH    EQU 320
SCREEN_HEIGHT   EQU 200
BYTES_PER_LINE  EQU 40     ; 320 pixels / 8 bits per byte
BITPLANE_SIZE   EQU SCREEN_HEIGHT * BYTES_PER_LINE

; Setup bitplane pointers for 4-bitplane mode
SetupBitplanes:
    LEA     $DFF000, A6         ; Custom chip base

    ; Calculate and set bitplane addresses
    MOVE.L  #GRAPHICS_MEM, D0   ; Base graphics memory

    ; Bitplane 1
    MOVE.L  D0, $0E0(A6)        ; BPL1PTH/BPL1PTL
    ADD.L   #BITPLANE_SIZE, D0

    ; Bitplane 2
    MOVE.L  D0, $0E4(A6)        ; BPL2PTH/BPL2PTL
    ADD.L   #BITPLANE_SIZE, D0

    ; Bitplane 3
    MOVE.L  D0, $0E8(A6)        ; BPL3PTH/BPL3PTL
    ADD.L   #BITPLANE_SIZE, D0

    ; Bitplane 4
    MOVE.L  D0, $0EC(A6)        ; BPL4PTH/BPL4PTL

    RTS

GRAPHICS_MEM:
    DS.B    BITPLANE_SIZE * 4   ; Reserve space for 4 bitplanes
```

## Screen Mode Configuration

The BPLCON registers control how bitplanes are displayed:

**Advanced Screen Mode Configuration:**

```assembly
; Configure various screen modes using BPLCON registers

; Standard 16-color mode (4 bitplanes)
Setup16ColorMode:
    LEA     $DFF000, A6

    ; BPLCON0 - Basic mode control
    ; Bit 15: HIRES (0=lowres, 1=hires)
    ; Bit 14-12: BPU (Bitplanes used - 1)
    ; Bit 11: HAM (Hold and Modify)
    ; Bit 10: DPF (Dual Playfield)
    ; Bit 9: COLOR (1=color, 0=B&W)
    ; Bit 3: LPEN (Light pen enable)

    MOVE.W  #$4200, $100(A6)    ; 4 bitplanes, color enabled
    MOVE.W  #$0000, $102(A6)    ; BPLCON1: No scroll
    MOVE.W  #$0000, $104(A6)    ; BPLCON2: Standard priority

    RTS

; Dual playfield mode (independent backgrounds)
SetupDualPlayfield:
    LEA     $DFF000, A6

    ; Enable dual playfield with 2+2 bitplanes
    MOVE.W  #$4600, $100(A6)    ; 4 bitplanes total, DPF enabled

    ; BPLCON2 controls playfield priority
    ; Bits 6: PF2PRI (Playfield 2 priority)
    ; Bits 5-3: PF2P (Playfield 2 sprite priority)
    ; Bits 2-0: PF1P (Playfield 1 sprite priority)

    MOVE.W  #$0024, $104(A6)    ; PF2 has priority

    ; Assign bitplanes to playfields
    ; Odd bitplanes (1,3) = Playfield 1
    ; Even bitplanes (2,4) = Playfield 2

    RTS

; HAM (Hold and Modify) mode for 4096 colors
SetupHAMMode:
    LEA     $DFF000, A6

    ; Enable HAM with 6 bitplanes
    MOVE.W  #$6A00, $100(A6)    ; 6 bitplanes, HAM enabled, color

    RTS

; Extra Half-Brite mode for 64 colors
SetupEHBMode:
    LEA     $DFF000, A6

    ; Enable 6 bitplanes without HAM
    MOVE.W  #$6200, $100(A6)    ; 6 bitplanes, color (EHB automatic)

    ; Colors 32-63 are half brightness of 0-31
    RTS
```

## Efficient Bitplane Drawing Routines

Professional graphics require optimized drawing routines:

**Optimized Bitplane Drawing Functions:**

```assembly
; Professional bitplane drawing routines

; Plot pixel in multiple bitplanes
; D0 = X coordinate
; D1 = Y coordinate
; D2 = Color (0-15 for 4 bitplanes)
PlotPixel:
    ; Save registers
    MOVEM.L D3-D7/A0-A1, -(SP)

    ; Calculate byte offset
    MOVE.W  D1, D3              ; Y coordinate
    MULU.W  #BYTES_PER_LINE, D3 ; Y * bytes per line
    MOVE.W  D0, D4              ; X coordinate
    LSR.W   #3, D4              ; X / 8 = byte offset
    ADD.W   D4, D3              ; Total byte offset

    ; Calculate bit position
    MOVE.W  D0, D5              ; X coordinate
    AND.W   #7, D5              ; X mod 8 = bit position
    MOVE.B  #7, D6
    SUB.B   D5, D6              ; 7 - bit position (68000 is MSB first)

    ; Create bit mask
    MOVEQ   #1, D7
    LSL.B   D6, D7              ; Shift to correct position

    ; Plot in each bitplane based on color
    LEA     GRAPHICS_MEM, A0    ; Base bitplane address
    MOVEQ   #3, D4              ; 4 bitplanes (0-3)

PlotBitplaneLoop:
    ; Check if this bitplane bit is set in color
    BTST    D4, D2
    BEQ     ClearPixelBit

SetPixelBit:
    ; Set the bit
    OR.B    D7, (A0,D3.W)
    BRA     NextBitplane

ClearPixelBit:
    ; Clear the bit
    NOT.B   D7                  ; Invert mask
    AND.B   D7, (A0,D3.W)
    NOT.B   D7                  ; Restore mask

NextBitplane:
    ; Move to next bitplane
    ADD.L   #BITPLANE_SIZE, A0
    DBF     D4, PlotBitplaneLoop

    ; Restore registers
    MOVEM.L (SP)+, D3-D7/A0-A1
    RTS

; Fast horizontal line drawing
; D0 = X1
; D1 = Y
; D2 = X2 (must be >= X1)
; D3 = Color
DrawHorizontalLine:
    ; Save registers
    MOVEM.L D4-D7/A0-A2, -(SP)

    ; Calculate start byte and bit
    MOVE.W  D1, D4
    MULU.W  #BYTES_PER_LINE, D4 ; Y offset
    MOVE.W  D0, D5              ; Start X
    LSR.W   #3, D5              ; Start byte
    ADD.W   D5, D4              ; Start offset

    ; Calculate end byte
    MOVE.W  D2, D6              ; End X
    LSR.W   #3, D6              ; End byte

    ; Setup for each bitplane
    LEA     GRAPHICS_MEM, A0
    MOVEQ   #3, D7              ; 4 bitplanes

BitplaneLineLoop:
    LEA     (A0,D4.W), A1       ; Current position
    MOVE.W  D5, A2              ; Save start byte

    ; Check if color bit is set for this plane
    BTST    D7, D3
    BEQ     SkipPlaneLine

    ; Draw the line in this bitplane
    CMP.W   D5, D6              ; Same byte?
    BEQ     SingleByteLine

    ; Multi-byte line
    ; First byte (partial)
    MOVE.W  D0, D1
    AND.W   #7, D1              ; Start bit
    MOVE.B  #$FF, D2
    LSR.B   D1, D2              ; Create right mask
    OR.B    D2, (A1)+

    ; Middle bytes (full)
    MOVE.W  D6, D1
    SUB.W   D5, D1
    SUBQ.W  #2, D1              ; Adjust for first/last
    BMI     LastByteLine

FillLoop:
    MOVE.B  #$FF, (A1)+
    DBF     D1, FillLoop

LastByteLine:
    ; Last byte (partial)
    MOVE.W  D2, D1              ; End X
    AND.W   #7, D1              ; End bit
    MOVE.B  #$FF, D2
    LSL.B   D1, D2
    NOT.B   D2                  ; Create left mask
    OR.B    D2, (A1)
    BRA     NextPlaneLine

SingleByteLine:
    ; Line within single byte
    ; Create combined mask
    ; ... (implementation for single byte)

SkipPlaneLine:
NextPlaneLine:
    ADD.L   #BITPLANE_SIZE, A0
    DBF     D7, BitplaneLineLoop

    ; Restore registers
    MOVEM.L (SP)+, D4-D7/A0-A2
    RTS
```

## Bitplane Scrolling and Effects

The modulo registers enable powerful scrolling effects:

**Bitplane Scrolling Using Modulo:**

```assembly
; Advanced scrolling using bitplane modulo

; Smooth horizontal scrolling
SmoothHScroll:
    LEA     $DFF000, A6

    ; Fine scroll position (0-15 pixels)
    MOVE.W  ScrollX, D0
    AND.W   #$F, D0             ; Fine position

    ; Set in BPLCON1 (bits 7-4 for PF1, 3-0 for PF2)
    LSL.W   #4, D0              ; Duplicate for both playfields
    OR.W    D0, D0
    MOVE.W  D0, $102(A6)        ; BPLCON1

    ; Coarse scroll position (bytes)
    MOVE.W  ScrollX, D0
    LSR.W   #3, D0              ; Divide by 8
    AND.W   #$FFFE, D0          ; Word align

    ; Update bitplane pointers
    LEA     GRAPHICS_MEM, A0
    ADD.W   D0, A0
    MOVE.L  A0, $0E0(A6)        ; BPL1PT

    ADD.L   #BITPLANE_SIZE, A0
    MOVE.L  A0, $0E4(A6)        ; BPL2PT

    ; Continue for all bitplanes...

    RTS

; Vertical window effect using modulo
VerticalWindow:
    LEA     $DFF000, A6

    ; Create a window effect by skipping lines
    ; Display lines 50-150 of a 200-line image

    ; Set bitplane pointers to line 50
    LEA     GRAPHICS_MEM, A0
    ADD.L   #(50 * BYTES_PER_LINE), A0
    MOVE.L  A0, $0E0(A6)        ; BPL1PT

    ; Set modulo to skip lines
    ; Modulo = bytes to skip at end of each display line
    ; To skip every other line: modulo = BYTES_PER_LINE
    MOVE.W  #BYTES_PER_LINE, $108(A6)  ; BPL1MOD
    MOVE.W  #BYTES_PER_LINE, $10A(A6)  ; BPL2MOD

    RTS

; Interleaved bitplane setup for faster access
SetupInterleavedBitplanes:
    ; Instead of: BP1 BP1 BP1... BP2 BP2 BP2...
    ; Organize as: BP1 BP2 BP3 BP4 BP1 BP2 BP3 BP4...

    LEA     $DFF000, A6
    LEA     INTERLEAVED_MEM, A0

    ; Set bitplane pointers with interleave offset
    MOVE.L  A0, $0E0(A6)        ; BPL1PT
    ADDQ.L  #2, A0              ; Skip to next word
    MOVE.L  A0, $0E4(A6)        ; BPL2PT
    ADDQ.L  #2, A0
    MOVE.L  A0, $0E8(A6)        ; BPL3PT
    ADDQ.L  #2, A0
    MOVE.L  A0, $0EC(A6)        ; BPL4PT

    ; Set modulo for interleaved access
    ; Skip 3 words (6 bytes) to next line segment
    MOVE.W  #6, $108(A6)        ; BPL1MOD
    MOVE.W  #6, $10A(A6)        ; BPL2MOD

    RTS

ScrollX:    DC.W    0
INTERLEAVED_MEM:
    DS.B    BITPLANE_SIZE * 4   ; Space for interleaved bitplanes
```

## Advanced Graphics Techniques

Implement professional graphics effects using bitplane manipulation:

**Professional Bitplane Effects:**

```assembly
; Advanced bitplane manipulation techniques

; Color cycling using bitplane rotation
ColorCycle:
    ; Rotate colors 1-15 (preserve background)
    LEA     $DFF000, A6

    ; Save color 1
    MOVE.W  $182(A6), D0

    ; Shift colors 2-15 down
    LEA     $184(A6), A0        ; COLOR02
    LEA     $182(A6), A1        ; COLOR01
    MOVEQ   #13, D1             ; 14 colors to move

CycleLoop:
    MOVE.W  (A0)+, (A1)+
    DBF     D1, CycleLoop

    ; Wrap saved color to position 15
    MOVE.W  D0, $19E(A6)        ; COLOR15

    RTS

; Transparency effect using bitplane masking
TransparencyMask:
    ; Use bitplane 4 as transparency mask
    ; Only draw where bitplane 4 is set

    ; D0 = source graphics pointer
    ; D1 = destination screen pointer
    ; D2 = mask bitplane pointer
    ; D3 = lines to copy

    MOVEM.L D4-D7/A0-A3, -(SP)

    MOVE.L  D0, A0              ; Source
    MOVE.L  D1, A1              ; Destination
    MOVE.L  D2, A2              ; Mask

TransparencyLoop:
    MOVE.W  #(BYTES_PER_LINE/4)-1, D4  ; Words per line

LineLoop:
    ; Read mask
    MOVE.L  (A2)+, D5           ; Get mask bits

    ; Apply to each bitplane
    MOVE.L  (A0)+, D6           ; Source data
    MOVE.L  (A1), D7            ; Destination data

    ; Masked merge: dest = (source AND mask) OR (dest AND NOT mask)
    AND.L   D5, D6              ; Source AND mask
    NOT.L   D5
    AND.L   D5, D7              ; Dest AND NOT mask
    OR.L    D6, D7              ; Combine
    MOVE.L  D7, (A1)+           ; Store result

    DBF     D4, LineLoop
    DBF     D3, TransparencyLoop

    MOVEM.L (SP)+, D4-D7/A0-A3
    RTS

; Bitplane fill pattern effect
PatternFill:
    ; Fill bitplane with repeating 8x8 pattern
    ; A0 = bitplane address
    ; A1 = 8-byte pattern data
    ; D0 = lines to fill

    MOVEM.L D1-D3/A2, -(SP)

FillYLoop:
    ; Get pattern line (Y mod 8)
    MOVE.W  D0, D1
    AND.W   #7, D1              ; Y mod 8
    MOVE.B  (A1,D1.W), D2       ; Pattern byte

    ; Fill entire line with pattern
    MOVE.W  #BYTES_PER_LINE-1, D3
    MOVE.L  A0, A2

FillXLoop:
    MOVE.B  D2, (A2)+           ; Repeat pattern
    DBF     D3, FillXLoop

    ; Next line
    ADD.L   #BYTES_PER_LINE, A0
    DBF     D0, FillYLoop

    MOVEM.L (SP)+, D1-D3/A2
    RTS

; Double buffering setup
SetupDoubleBuffer:
    ; Allocate two screen buffers
    LEA     ScreenBuffer1, A0
    LEA     ScreenBuffer2, A1

    ; Store pointers
    MOVE.L  A0, FrontBuffer
    MOVE.L  A1, BackBuffer

    ; Display front buffer
    BSR     DisplayBuffer

    RTS

SwapBuffers:
    ; Exchange front and back buffers
    MOVE.L  FrontBuffer, D0
    MOVE.L  BackBuffer, D1
    MOVE.L  D1, FrontBuffer
    MOVE.L  D0, BackBuffer

    ; Display new front buffer
    BSR     DisplayBuffer
    RTS

DisplayBuffer:
    ; Set bitplane pointers to current front buffer
    LEA     $DFF000, A6
    MOVE.L  FrontBuffer, D0

    ; Set all bitplane pointers
    MOVE.L  D0, $0E0(A6)        ; BPL1PT
    ADD.L   #BITPLANE_SIZE, D0
    MOVE.L  D0, $0E4(A6)        ; BPL2PT
    ADD.L   #BITPLANE_SIZE, D0
    MOVE.L  D0, $0E8(A6)        ; BPL3PT
    ADD.L   #BITPLANE_SIZE, D0
    MOVE.L  D0, $0EC(A6)        ; BPL4PT

    RTS

; Data
FrontBuffer:    DC.L    0
BackBuffer:     DC.L    0
ScreenBuffer1:  DS.B    BITPLANE_SIZE * 4
ScreenBuffer2:  DS.B    BITPLANE_SIZE * 4
```

## Practice Exercise: Create a Bitplane Effects Demo

Build a demonstration showcasing various bitplane techniques:

**Practice: Bitplane Effects Demonstration:**

```assembly
; Complete bitplane effects demonstration
; Combine multiple techniques in an interactive demo

BitplaneDemo:
    ; Initialize system
    BSR     SystemInit
    BSR     SetupDoubleBuffer
    BSR     CreateTestPatterns

    ; Main demo loop
DemoLoop:
    BSR     WaitVBlank

    ; Update effects based on frame
    MOVE.W  FrameCounter, D0
    ADDQ.W  #1, D0
    MOVE.W  D0, FrameCounter

    ; Cycle through effects
    AND.W   #$FF, D0            ; Every 256 frames
    BNE     ContinueEffect

    ; Change effect
    ADDQ.W  #1, CurrentEffect
    AND.W   #3, CurrentEffect   ; 4 effects total

ContinueEffect:
    ; Execute current effect
    MOVE.W  CurrentEffect, D0
    LSL.W   #2, D0              ; Convert to longword offset
    LEA     EffectTable, A0
    MOVE.L  (A0,D0.W), A0
    JSR     (A0)                ; Call effect routine

    ; Update display
    BSR     SwapBuffers

    ; Check for exit
    BTST    #6, $BFE001         ; Left mouse button
    BNE     DemoLoop

    RTS

; Effect routines
Effect1_Patterns:
    ; Draw different patterns in each bitplane
    MOVE.L  BackBuffer, A0

    ; Bitplane 1 - Vertical stripes
    LEA     VerticalPattern, A1
    MOVEQ   #0, D0              ; Bitplane offset
    BSR     DrawPattern

    ; Bitplane 2 - Horizontal stripes
    ADD.L   #BITPLANE_SIZE, A0
    LEA     HorizontalPattern, A1
    BSR     DrawPattern

    ; Bitplane 3 - Diagonal pattern
    ADD.L   #BITPLANE_SIZE, A0
    LEA     DiagonalPattern, A1
    BSR     DrawPattern

    ; Bitplane 4 - Checkerboard
    ADD.L   #BITPLANE_SIZE, A0
    LEA     CheckerPattern, A1
    BSR     DrawPattern

    RTS

Effect2_Scroll:
    ; Smooth scrolling with modulo
    MOVE.W  FrameCounter, D0
    AND.W   #$1FF, D0           ; 0-511 range
    MOVE.W  D0, ScrollX
    BSR     SmoothHScroll

    ; Also do color cycling
    BSR     ColorCycle
    RTS

Effect3_Transparency:
    ; Demonstrate transparency masking
    ; Draw spinning shape with transparency

    MOVE.L  BackBuffer, A1
    MOVE.W  FrameCounter, D0
    AND.W   #$3F, D0            ; 64 positions

    ; Draw shape at rotating positions
    BSR     DrawTransparentShape
    RTS

Effect4_Windows:
    ; Multiple viewport windows
    BSR     VerticalWindow

    ; Draw different content in each window
    ; ... (implementation)
    RTS

; Helper routines
DrawPattern:
    ; Fill bitplane with 8x8 pattern
    ; A0 = bitplane address
    ; A1 = pattern data
    MOVE.W  #SCREEN_HEIGHT-1, D0
    BSR     PatternFill
    RTS

CreateTestPatterns:
    ; Generate pattern data
    LEA     VerticalPattern, A0
    MOVE.B  #$AA, (A0)+         ; 10101010
    MOVE.B  #$AA, (A0)+
    MOVE.B  #$AA, (A0)+
    MOVE.B  #$AA, (A0)+
    MOVE.B  #$AA, (A0)+
    MOVE.B  #$AA, (A0)+
    MOVE.B  #$AA, (A0)+
    MOVE.B  #$AA, (A0)+

    LEA     HorizontalPattern, A0
    MOVE.B  #$FF, (A0)+         ; 11111111
    MOVE.B  #$FF, (A0)+
    MOVE.B  #$FF, (A0)+
    MOVE.B  #$FF, (A0)+
    MOVE.B  #$00, (A0)+         ; 00000000
    MOVE.B  #$00, (A0)+
    MOVE.B  #$00, (A0)+
    MOVE.B  #$00, (A0)+

    ; Continue for other patterns...
    RTS

; Data section
CurrentEffect:  DC.W    0
FrameCounter:   DC.W    0

EffectTable:
    DC.L    Effect1_Patterns
    DC.L    Effect2_Scroll
    DC.L    Effect3_Transparency
    DC.L    Effect4_Windows

; Pattern data
VerticalPattern:    DS.B    8
HorizontalPattern:  DS.B    8
DiagonalPattern:    DS.B    8
CheckerPattern:     DS.B    8

; Execute the demo
BSR     BitplaneDemo
```

## What You've Learned

In this lesson, you've mastered advanced bitplane manipulation:

- **Planar graphics architecture** and how bitplanes combine to create colors
- **Memory organization** for efficient bitplane access and manipulation
- **Screen mode configuration** using BPLCON registers for various display modes
- **Optimized drawing routines** for pixels, lines, and patterns
- **Scrolling techniques** using hardware scroll and modulo registers
- **Professional effects** including transparency, double buffering, and color cycling
- **Advanced techniques** like interleaved bitplanes and pattern fills

## Looking Ahead

Next, you'll learn about the Copper - the Amiga's revolutionary display coprocessor. You'll discover how to create stunning effects by programming the Copper to change display parameters on specific scan lines, enabling effects impossible on other platforms!

## Fun Fact

The Amiga's bitplane architecture was so flexible that demo scene programmers discovered display modes Commodore never documented! By cleverly manipulating the bitplane pointers and modulo registers during the display, they created "impossible" effects like unlimited sprites, perspective scrolling, and even primitive 3D transformations - all without touching the CPU! This creativity pushed the hardware far beyond its intended limits and established techniques still studied by graphics programmers today.
