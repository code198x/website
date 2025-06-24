---
title: "Spectrum Display and Pixel Basics"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 25
description: "Master the ZX Spectrum's unique display system and learn fundamental pixel manipulation techniques. Begin your journey into graphics programming by understanding screen memory organization and direct pixel access."
learning_objectives:
  - "Understand the ZX Spectrum display architecture"
  - "Master screen memory addressing and layout"
  - "Learn pixel plotting fundamentals"
  - "Implement basic color attribute handling"
  - "Build foundation for graphics programming"
concepts:
  - "Display file structure and organization"
  - "Pixel memory addressing calculations"
  - "Color attribute system"
  - "Screen coordinate mapping"
  - "Direct video memory manipulation"
estimated_duration: "45-55 minutes"
difficulty: "intermediate"
code_examples: true
practical_exercise: true
order: 25
---

# Lesson 25: Spectrum Display and Pixel Basics

Welcome to the fascinating world of ZX Spectrum graphics programming! The Spectrum's display system is unique and clever, designed to maximize visual capabilities while minimizing memory usage. Understanding how pixels and colors work at the hardware level is your gateway to creating amazing visual applications, including our Pixel Painter project.

## The ZX Spectrum Display System

### Screen Architecture Overview

The ZX Spectrum display consists of:
- **256×192 pixel resolution** in the main display area
- **32×24 character cells** (8×8 pixels each)
- **Two colors per character cell**: INK (foreground) and PAPER (background)
- **8 colors** with two brightness levels (normal and bright)
- **Border area** surrounding the main display

### Memory Organization

The display uses two memory areas:

1. **Display File** (Screen RAM): 6144 bytes starting at address 16384 (0x4000)
2. **Attribute File**: 768 bytes starting at address 22528 (0x5800)

```text
; Memory map for display
DISPLAY_FILE    EQU 16384   ; Start of pixel data
ATTR_FILE       EQU 22528   ; Start of color attributes
DISPLAY_SIZE    EQU 6144    ; Size of pixel data
ATTR_SIZE       EQU 768     ; Size of attribute data
```

## Understanding Pixel Memory Layout

### The Spectrum's Unique Addressing

The Spectrum's screen memory layout is unconventional but ingenious:

```text
; Screen is divided into three thirds vertically
; Each third has 64 lines (192 ÷ 3 = 64)
; Within each third, lines are interleaved

; Memory address calculation for pixel at (x, y):
; High byte = 010TTYYY where:
;   TT = third number (00, 01, 10 for top, middle, bottom)
;   YYY = y coordinate within character row (0-7)
; Low byte = RRRCCCCC where:
;   RRR = character row within third (0-7)
;   CCCCC = x coordinate in characters (0-31)
```

### Pixel Plotting Algorithm

```text
; Plot a pixel at coordinates (B, C) where B = x (0-255), C = y (0-191)
PlotPixel:
    ; Calculate screen address
    LD A, C             ; y coordinate
    AND 7               ; y mod 8 = pixel row within character
    OR 64               ; Set bit 6 (0100 0000)
    LD H, A             ; Store in H (high byte partial)
    
    LD A, C             ; y coordinate again
    RRA                 ; Shift right (divide by 2)
    RRA
    RRA                 ; y / 8 = character row
    AND 24              ; Keep bits 3-4 (character row within third)
    OR H                ; Combine with pixel row
    LD H, A             ; H = high byte of address
    
    LD A, C             ; y coordinate
    RLA                 ; Shift left
    RLA                 ; × 4
    AND 224             ; Keep top 3 bits (third number)
    LD L, A             ; Store in L (low byte partial)
    
    LD A, B             ; x coordinate
    RRA                 ; Divide by 8
    RRA
    RRA
    AND 31              ; x / 8 = character column
    OR L                ; Combine with third info
    LD L, A             ; L = low byte of address
    
    ; Now HL points to the byte containing our pixel
    ; Calculate pixel mask
    LD A, B             ; x coordinate
    AND 7               ; x mod 8 = pixel within byte
    LD B, A             ; Save bit position
    LD A, 128           ; Start with leftmost bit
    JR Z, PlotBit       ; If bit 0, we're ready
    
ShiftLoop:
    RRA                 ; Shift right for each bit position
    DJNZ ShiftLoop
    
PlotBit:
    OR (HL)             ; Set the pixel
    LD (HL), A          ; Write back to screen
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Basic Pixel Plotting"
  code="; Demonstrate basic pixel plotting on ZX Spectrum
; Plot pixels at various coordinates

DISPLAY_FILE    EQU 16384   ; Screen memory start

; Plot pixel routine
; Input: B = x coordinate (0-255), C = y coordinate (0-191)
PlotPixel:
    ; Calculate screen address
    LD A, C             ; y coordinate
    AND 7               ; y mod 8 = pixel row within character
    OR 64               ; Set bit 6 (0100 0000)
    LD H, A             ; Store in H (high byte partial)
    
    LD A, C             ; y coordinate again
    RRA                 ; Shift right
    RRA
    RRA                 ; y / 8 = character row
    AND 24              ; Keep bits 3-4
    OR H                ; Combine with pixel row
    LD H, A             ; H = high byte of address
    
    LD A, C             ; y coordinate
    RLA                 ; Shift left
    RLA                 ; × 4
    AND 224             ; Keep top 3 bits (third number)
    LD L, A             ; Store in L
    
    LD A, B             ; x coordinate
    RRA                 ; Divide by 8
    RRA
    RRA
    AND 31              ; x / 8 = character column
    OR L                ; Combine with third info
    LD L, A             ; L = low byte of address
    
    ; Calculate pixel mask
    LD A, B             ; x coordinate
    AND 7               ; x mod 8 = pixel within byte
    LD B, A             ; Save bit position
    LD A, 128           ; Start with leftmost bit
    JR Z, PlotBit       ; If bit 0, we're ready
    
ShiftLoop:
    RRA                 ; Shift right for each bit position
    DJNZ ShiftLoop
    
PlotBit:
    OR (HL)             ; Set the pixel
    LD (HL), A          ; Write back to screen
    RET

; Clear screen routine
ClearScreen:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143         ; Screen size - 1
    LD (HL), 0          ; Clear first byte
    LDIR                ; Copy throughout screen
    RET

; Test pixel plotting
TestPixelPlot:
    CALL ClearScreen
    
    ; Plot a diagonal line
    LD D, 50            ; Starting position
DiagonalLoop:
    LD B, D             ; x = loop counter
    LD C, D             ; y = loop counter
    CALL PlotPixel
    INC D
    LD A, D
    CP 150              ; End at 150
    JR NZ, DiagonalLoop
    
    ; Plot a horizontal line
    LD C, 100           ; y = 100
    LD D, 20            ; x start
HorizontalLoop:
    LD B, D             ; x coordinate
    CALL PlotPixel
    INC D
    LD A, D
    CP 236              ; End at 235
    JR NZ, HorizontalLoop
    
    ; Plot a vertical line
    LD B, 128           ; x = 128 (center)
    LD D, 10            ; y start
VerticalLoop:
    LD C, D             ; y coordinate
    CALL PlotPixel
    INC D
    LD A, D
    CP 182              ; End at 181
    JR NZ, VerticalLoop
    
    ; Plot a square
    ; Top line
    LD C, 50            ; y = 50
    LD D, 80            ; x start
SquareTop:
    LD B, D
    CALL PlotPixel
    INC D
    LD A, D
    CP 176              ; 96 pixels wide
    JR NZ, SquareTop
    
    ; Right line
    LD B, 175           ; x = 175
    LD D, 50            ; y start
SquareRight:
    LD C, D
    CALL PlotPixel
    INC D
    LD A, D
    CP 115              ; 64 pixels tall
    JR NZ, SquareRight
    
    ; Bottom line
    LD C, 114           ; y = 114
    LD D, 80            ; x start
SquareBottom:
    LD B, D
    CALL PlotPixel
    INC D
    LD A, D
    CP 176
    JR NZ, SquareBottom
    
    ; Left line
    LD B, 80            ; x = 80
    LD D, 50            ; y start
SquareLeft:
    LD C, D
    CALL PlotPixel
    INC D
    LD A, D
    CP 115
    JR NZ, SquareLeft
    
    ; Return success indicator
    LD B, 255
    RET"
  language="assembly"
/>

## Color Attributes System

### Understanding Attributes

Each 8×8 character cell has one attribute byte controlling:
- **Bits 0-2**: INK color (foreground)
- **Bits 3-5**: PAPER color (background)
- **Bit 6**: BRIGHT (0 = normal, 1 = bright)
- **Bit 7**: FLASH (0 = steady, 1 = flashing)

```text
; Color values
BLACK       EQU 0
BLUE        EQU 1
RED         EQU 2
MAGENTA     EQU 3
GREEN       EQU 4
CYAN        EQU 5
YELLOW      EQU 6
WHITE       EQU 7

; Attribute byte construction
; Example: Bright white on blue
; PAPER = BLUE (1) << 3 = 8
; INK = WHITE (7) = 7
; BRIGHT = 1 << 6 = 64
; Total = 64 + 8 + 7 = 79
```

### Setting Color Attributes

```text
; Set attribute for character position (B, C)
; B = x in characters (0-31), C = y in characters (0-23)
; A = attribute value
SetAttribute:
    ; Calculate attribute address
    ; Address = 22528 + (y * 32) + x
    LD H, 0
    LD L, C             ; HL = y
    ADD HL, HL          ; × 2
    ADD HL, HL          ; × 4
    ADD HL, HL          ; × 8
    ADD HL, HL          ; × 16
    ADD HL, HL          ; × 32
    LD D, 0
    LD E, B             ; DE = x
    ADD HL, DE          ; HL = y * 32 + x
    LD DE, 22528        ; Attribute file start
    ADD HL, DE          ; HL = attribute address
    LD (HL), A          ; Set attribute
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Color Attributes Demo"
  code="; Demonstrate color attribute handling
; Create colorful patterns using the attribute system

ATTR_FILE       EQU 22528   ; Attribute memory start

; Color definitions
BLACK       EQU 0
BLUE        EQU 1
RED         EQU 2
MAGENTA     EQU 3
GREEN       EQU 4
CYAN        EQU 5
YELLOW      EQU 6
WHITE       EQU 7

; Set attribute at character position
; Input: B = x (0-31), C = y (0-23), A = attribute
SetAttribute:
    PUSH AF             ; Save attribute value
    
    ; Calculate attribute address
    LD H, 0
    LD L, C             ; HL = y
    ADD HL, HL          ; × 2
    ADD HL, HL          ; × 4
    ADD HL, HL          ; × 8
    ADD HL, HL          ; × 16
    ADD HL, HL          ; × 32
    LD D, 0
    LD E, B             ; DE = x
    ADD HL, DE          ; HL = y * 32 + x
    LD DE, ATTR_FILE
    ADD HL, DE          ; HL = attribute address
    
    POP AF              ; Restore attribute
    LD (HL), A          ; Set attribute
    RET

; Create colorful test patterns
TestAttributes:
    ; Clear attributes to black on white
    LD HL, ATTR_FILE
    LD DE, ATTR_FILE + 1
    LD BC, 767          ; Attribute size - 1
    LD A, WHITE << 3    ; White paper, black ink
    LD (HL), A
    LDIR
    
    ; Create rainbow columns
    LD C, 0             ; Start at top
RainbowLoop:
    LD B, 0             ; Start at left
    LD D, 0             ; Color counter
    
ColorColumnLoop:
    ; Calculate attribute: color on black
    LD A, D             ; Current color
    AND 7               ; Keep in range 0-7
    OR 64               ; Add bright bit
    PUSH BC
    PUSH DE
    CALL SetAttribute
    POP DE
    POP BC
    
    INC B               ; Next column
    INC D               ; Next color
    LD A, B
    CP 32               ; Check if done with row
    JR NZ, ColorColumnLoop
    
    INC C               ; Next row
    LD A, C
    CP 24               ; Check if done with screen
    JR NZ, RainbowLoop
    
    ; Create checkerboard pattern in center
    LD C, 8             ; Start row
CheckerLoop:
    LD B, 8             ; Start column
    
CheckerColumnLoop:
    ; Calculate checkerboard pattern
    LD A, B
    ADD A, C
    AND 1               ; Odd or even?
    JR Z, CheckerWhite
    
    ; Black square with white ink
    LD A, WHITE OR (BLACK << 3) OR 64  ; Bright white on black
    JR CheckerSet
    
CheckerWhite:
    ; White square with black ink
    LD A, BLACK OR (WHITE << 3) OR 64  ; Black on bright white
    
CheckerSet:
    PUSH BC
    CALL SetAttribute
    POP BC
    
    INC B
    LD A, B
    CP 24               ; 16 columns
    JR NZ, CheckerColumnLoop
    
    INC C
    LD A, C
    CP 16               ; 8 rows
    JR NZ, CheckerLoop
    
    ; Create gradient effect at bottom
    LD C, 20            ; Start at row 20
    LD D, 0             ; Brightness counter
    
GradientLoop:
    LD B, 0             ; Start at left
    
GradientColumnLoop:
    ; Create blue gradient
    LD A, BLUE << 3     ; Blue paper
    OR WHITE            ; White ink
    ; Add brightness based on position
    LD E, A
    LD A, B
    AND 16              ; Every 16 columns
    JR Z, NoBright
    LD A, E
    OR 64               ; Add bright bit
    JR GradientSet
    
NoBright:
    LD A, E
    
GradientSet:
    PUSH BC
    PUSH DE
    CALL SetAttribute
    POP DE
    POP BC
    
    INC B
    LD A, B
    CP 32
    JR NZ, GradientColumnLoop
    
    INC C
    LD A, C
    CP 24
    JR NZ, GradientLoop
    
    ; Return with pattern indicator
    LD B, 200
    RET"
  language="assembly"
/>

## Pixel Manipulation Techniques

### Reading Pixels

```text
; Read pixel at coordinates (B, C)
; Returns: A = 0 if pixel off, non-zero if on
ReadPixel:
    ; Calculate screen address (same as PlotPixel)
    CALL CalculateScreenAddress  ; Assume this returns address in HL
    
    ; Calculate pixel mask
    LD A, B             ; x coordinate
    AND 7               ; x mod 8
    LD B, A
    LD A, 128           ; Start with leftmost bit
    JR Z, ReadBit
    
ReadShiftLoop:
    RRA
    DJNZ ReadShiftLoop
    
ReadBit:
    AND (HL)            ; Test the pixel
    RET                 ; A = 0 if off, mask value if on
```

### Clearing Pixels

```text
; Clear pixel at coordinates (B, C)
ClearPixel:
    CALL CalculateScreenAddress
    
    ; Calculate pixel mask
    LD A, B             ; x coordinate
    AND 7               ; x mod 8
    LD B, A
    LD A, 128           ; Start with leftmost bit
    JR Z, ClearBit
    
ClearShiftLoop:
    RRA
    DJNZ ClearShiftLoop
    
ClearBit:
    CPL                 ; Complement to create clear mask
    AND (HL)            ; Clear the pixel
    LD (HL), A          ; Write back
    RET
```

### XOR Drawing Mode

```text
; XOR pixel - useful for cursors and temporary graphics
XORPixel:
    CALL CalculateScreenAddress
    
    ; Calculate pixel mask
    LD A, B             ; x coordinate
    AND 7               ; x mod 8
    LD B, A
    LD A, 128
    JR Z, XORBit
    
XORShiftLoop:
    RRA
    DJNZ XORShiftLoop
    
XORBit:
    XOR (HL)            ; Toggle the pixel
    LD (HL), A          ; Write back
    RET
```

## Building Graphics Primitives

### Optimized Pixel Address Calculation

```text
; Fast screen address calculation using lookup tables
; Input: B = x, C = y
; Output: HL = screen address, A = pixel mask
FastPixelAddr:
    ; Use lookup table for y coordinate
    LD H, 0
    LD L, C
    ADD HL, HL          ; × 2 for word table
    LD DE, YLookupTable
    ADD HL, DE
    LD A, (HL)          ; Get low byte
    INC HL
    LD H, (HL)          ; Get high byte
    LD L, A             ; HL = base address for line
    
    ; Add x offset
    LD A, B
    RRA
    RRA
    RRA
    AND 31              ; x / 8
    ADD L
    LD L, A             ; Add to low byte
    
    ; Calculate pixel mask
    LD A, B
    AND 7
    LD B, A
    LD A, 128
    RET Z               ; If bit 0, return mask
    
MaskLoop:
    RRA
    DJNZ MaskLoop
    RET                 ; A = pixel mask
```

<CodeRunner 
  system="zx-spectrum"
  title="Pixel Manipulation Demo"
  code="; Advanced pixel manipulation demonstration
; Shows reading, clearing, and XOR operations

DISPLAY_FILE    EQU 16384

; Calculate screen address for pixel
; Input: B = x, C = y
; Output: HL = address
CalculateScreenAddress:
    LD A, C             ; y coordinate
    AND 7               ; y mod 8
    OR 64               ; Set bit 6
    LD H, A
    
    LD A, C             ; y coordinate
    RRA
    RRA
    RRA                 ; y / 8
    AND 24              ; Keep bits 3-4
    OR H
    LD H, A
    
    LD A, C             ; y coordinate
    RLA
    RLA                 ; × 4
    AND 224             ; Keep top 3 bits
    LD L, A
    
    LD A, B             ; x coordinate
    RRA
    RRA
    RRA
    AND 31              ; x / 8
    OR L
    LD L, A
    RET

; XOR pixel for animation effects
; Input: B = x, C = y
XORPixel:
    CALL CalculateScreenAddress
    
    ; Calculate pixel mask
    LD A, B
    AND 7
    LD B, A
    LD A, 128
    JR Z, XORBit
    
XORShiftLoop:
    RRA
    DJNZ XORShiftLoop
    
XORBit:
    XOR (HL)            ; Toggle pixel
    LD (HL), A
    RET

; Clear pixel
; Input: B = x, C = y
ClearPixel:
    CALL CalculateScreenAddress
    
    ; Calculate pixel mask
    LD A, B
    AND 7
    LD B, A
    LD A, 128
    JR Z, ClearBit
    
ClearShiftLoop:
    RRA
    DJNZ ClearShiftLoop
    
ClearBit:
    CPL                 ; Complement for clearing
    AND (HL)
    LD (HL), A
    RET

; Test pixel operations
TestPixelOps:
    ; Clear screen first
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143
    LD (HL), 0
    LDIR
    
    ; Draw a pattern using XOR
    LD D, 0             ; Animation counter
    
AnimationLoop:
    PUSH DE
    
    ; Draw moving cross pattern
    LD B, D             ; x = animation counter
    LD E, 50            ; y counter
    
VerticalLine:
    LD C, E             ; y coordinate
    PUSH BC
    PUSH DE
    CALL XORPixel       ; Draw/erase pixel
    POP DE
    POP BC
    INC E
    LD A, E
    CP 150              ; 100 pixels tall
    JR NZ, VerticalLine
    
    ; Horizontal line
    LD C, 96            ; y = center
    LD E, D             ; x start offset
    
HorizontalLine:
    LD B, E             ; x coordinate
    PUSH BC
    PUSH DE
    CALL XORPixel
    POP DE
    POP BC
    INC E
    LD A, E
    SUB A, D
    CP 100              ; 100 pixels wide
    JR NZ, HorizontalLine
    
    ; Small delay for animation
    LD BC, 1000
DelayLoop:
    DEC BC
    LD A, B
    OR C
    JR NZ, DelayLoop
    
    POP DE
    INC D
    LD A, D
    CP 156              ; Animate across screen
    JR NZ, AnimationLoop
    
    ; Draw permanent pattern
    LD D, 40
PermLoop:
    LD B, D
    LD C, D
    PUSH DE
    CALL CalculateScreenAddress
    LD A, 128           ; Set leftmost pixel
    OR (HL)
    LD (HL), A
    POP DE
    INC D
    LD A, D
    CP 100
    JR NZ, PermLoop
    
    ; Test clearing pixels
    LD D, 60
ClearLoop:
    LD B, D
    LD C, 80
    PUSH DE
    CALL ClearPixel
    POP DE
    INC D
    INC D               ; Every other pixel
    LD A, D
    CP 100
    JR NZ, ClearLoop
    
    LD B, 250           ; Success indicator
    RET"
  language="assembly"
/>

## Practical Graphics Programming Tips

### Performance Optimization

1. **Pre-calculate addresses** when drawing multiple pixels in sequence
2. **Use lookup tables** for frequently used calculations
3. **Minimize screen address calculations** by incrementing pointers
4. **Batch similar operations** to reduce overhead

### Common Patterns

```text
; Drawing horizontal lines efficiently
DrawHorizontalLine:
    ; Input: B = x start, C = y, D = length
    CALL CalculateScreenAddress  ; Get starting address
    
    ; Handle full bytes first
    LD A, B
    AND 7               ; Starting bit position
    JR Z, FullBytes     ; Aligned to byte boundary
    
    ; Handle partial first byte
    ; ... (implementation)
    
FullBytes:
    ; Draw complete bytes
    LD A, D
    RRA
    RRA
    RRA                 ; Length / 8 = full bytes
    AND 31
    JR Z, LastByte
    LD B, A
    
ByteLoop:
    LD (HL), 255        ; Set all pixels in byte
    INC HL
    DJNZ ByteLoop
    
LastByte:
    ; Handle partial last byte
    ; ... (implementation)
    RET
```

## Integration Exercise: Simple Drawing Tool

Build a basic drawing tool that demonstrates all concepts:

<CodeRunner 
  system="zx-spectrum"
  title="Integration Exercise - Simple Drawing Tool"
  code="; Simple drawing tool demonstrating all pixel concepts
; Use a moving cursor to draw patterns

DISPLAY_FILE    EQU 16384
ATTR_FILE       EQU 22528

; Drawing state
CursorX:        DB 128
CursorY:        DB 96
DrawMode:       DB 1        ; 0=move, 1=draw
CurrentColor:   DB 71       ; White on black, bright

; Main drawing loop
DrawingTool:
    ; Initialize
    CALL ClearScreen
    CALL SetupColors
    
    LD B, 100           ; Run for 100 iterations
    
MainLoop:
    PUSH BC
    
    ; Draw cursor (XOR for visibility)
    LD A, (CursorX)
    LD B, A
    LD A, (CursorY)
    LD C, A
    CALL DrawCursor
    
    ; Simulate movement (diagonal pattern)
    CALL SimulateInput
    
    ; Update cursor position
    LD A, (CursorX)
    INC A
    CP 240              ; Wrap around
    JR C, XOK
    LD A, 16
XOK:
    LD (CursorX), A
    
    LD A, (CursorY)
    INC A
    CP 180              ; Wrap around
    JR C, YOK
    LD A, 12
YOK:
    LD (CursorY), A
    
    ; Small delay
    PUSH BC
    LD BC, 2000
Delay:
    DEC BC
    LD A, B
    OR C
    JR NZ, Delay
    POP BC
    
    POP BC
    DJNZ MainLoop
    
    ; Draw final pattern
    CALL DrawFinalPattern
    
    LD B, 255           ; Success
    RET

; Clear screen
ClearScreen:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143
    LD (HL), 0
    LDIR
    RET

; Setup initial colors
SetupColors:
    LD HL, ATTR_FILE
    LD DE, ATTR_FILE + 1
    LD BC, 767
    LD A, 56            ; Black on white
    LD (HL), A
    LDIR
    RET

; Draw cursor crosshair
DrawCursor:
    ; Draw small cross at cursor position
    ; Horizontal line
    PUSH BC
    DEC B
    CALL XORPixel
    INC B
    CALL XORPixel
    INC B
    CALL XORPixel
    POP BC
    
    ; Vertical line
    PUSH BC
    DEC C
    CALL XORPixel
    INC C
    CALL XORPixel
    INC C
    CALL XORPixel
    POP BC
    RET

; Simulate user input
SimulateInput:
    ; Check draw mode
    LD A, (DrawMode)
    OR A
    RET Z               ; Not drawing
    
    ; Draw at current position
    LD A, (CursorX)
    LD B, A
    LD A, (CursorY)
    LD C, A
    CALL PlotPixel
    
    ; Set color for this character cell
    ; Calculate character position
    LD A, B
    RRA
    RRA
    RRA
    AND 31              ; x / 8
    LD B, A
    LD A, C
    RRA
    RRA
    RRA
    AND 31              ; y / 8
    LD C, A
    LD A, (CurrentColor)
    CALL SetAttribute
    RET

; Screen address calculation
CalculateScreenAddress:
    LD A, C
    AND 7
    OR 64
    LD H, A
    
    LD A, C
    RRA
    RRA
    RRA
    AND 24
    OR H
    LD H, A
    
    LD A, C
    RLA
    RLA
    AND 224
    LD L, A
    
    LD A, B
    RRA
    RRA
    RRA
    AND 31
    OR L
    LD L, A
    RET

; Plot pixel
PlotPixel:
    CALL CalculateScreenAddress
    
    LD A, B
    AND 7
    LD B, A
    LD A, 128
    JR Z, PlotBit
    
PlotShiftLoop:
    RRA
    DJNZ PlotShiftLoop
    
PlotBit:
    OR (HL)
    LD (HL), A
    RET

; XOR pixel
XORPixel:
    CALL CalculateScreenAddress
    
    LD A, B
    AND 7
    LD B, A
    LD A, 128
    JR Z, XORBit
    
XORShiftLoop:
    RRA
    DJNZ XORShiftLoop
    
XORBit:
    XOR (HL)
    LD (HL), A
    RET

; Set attribute
SetAttribute:
    PUSH AF
    LD H, 0
    LD L, C
    ADD HL, HL
    ADD HL, HL
    ADD HL, HL
    ADD HL, HL
    ADD HL, HL
    LD D, 0
    LD E, B
    ADD HL, DE
    LD DE, ATTR_FILE
    ADD HL, DE
    POP AF
    LD (HL), A
    RET

; Draw final pattern
DrawFinalPattern:
    ; Draw a box
    LD B, 50            ; x start
    LD D, 50            ; x counter
BoxTop:
    LD C, 40            ; y
    PUSH DE
    CALL PlotPixel
    POP DE
    INC D
    LD B, D
    LD A, D
    CP 150
    JR NZ, BoxTop
    
    RET"
  language="assembly"
/>

## Key Takeaways

You've mastered the fundamentals of ZX Spectrum graphics:

1. **Display Architecture**: Understanding the unique screen memory layout
2. **Pixel Addressing**: Calculating screen addresses from coordinates
3. **Color Attributes**: Managing the color system effectively
4. **Pixel Operations**: Setting, clearing, and toggling pixels
5. **Performance**: Optimizing graphics operations for speed

## What's Next?

In the next lesson, we'll build on these foundations to create more sophisticated graphics primitives - lines, rectangles, and circles. You'll learn efficient algorithms for drawing these shapes and begin constructing the building blocks of our Pixel Painter application!

## Fun Fact

The ZX Spectrum's unusual screen memory layout was designed by hardware engineer Richard Altwasser to minimize the complexity of the ULA (Uncommitted Logic Array) chip. This clever design allowed the Spectrum to achieve its colorful graphics with minimal hardware cost - a key factor in making it the UK's best-selling computer! The non-linear memory layout that seems complex to programmers actually simplified the hardware design, reducing manufacturing costs and making computers affordable for millions of households. This is a perfect example of how hardware constraints drive software innovation!