---
title: "Color and Bitmap Graphics"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 20
description: "Learn bitmap graphics and advanced colour techniques on the C64. Learn pixel-level drawing, bitmap modes, colour management, and sophisticated graphics programming for professional visual effects."
learning_objectives:
  - "Understand bitmap graphics modes and pixel manipulation"
  - "Learn colour theory and C64 colour limitations"
  - "Learn bitmap memory organisation and addressing"
  - "Practice pixel-level drawing and graphics algorithms"
  - "Build advanced graphics effects and visual systems"
concepts:
  - "Bitmap graphics modes (hi-res and multicolor)"
  - "Pixel addressing and memory organisation"
  - "Color RAM and attribute management"
  - "Drawing algorithms and graphics primitives"
  - "Advanced colour and visual effects"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 20
---

# Lesson 20: Color and Bitmap Graphics

**See how bitmap mode gives you direct control over every pixel:**

```
; This enables 320x200 bitmap mode where you control each individual pixel
; by setting bits in memory - much more detailed than character graphics

    LDA $D011
    ORA #%00100000  ; Enable bitmap mode
    STA $D011       ; Now you control every pixel!
    
    LDA #%11111111  ; Draw horizontal line (8 pixels)
    STA $2000       ; Direct pixel control
    LDA #%10000001  ; Draw vertical borders
    STA $2001       ; Each bit is one pixel
    ; 320x200 pixels of detailed graphics control!
```

That's the power of **bitmap graphics** - direct pixel-level control for detailed drawing! Today you'll learn to use bitmap mode to create precise graphics and visual feedback for your Number Quest game.

## Bitmap Graphics Overview

**Bitmap graphics** give you direct control over individual pixels on the screen:

- **Pixel-level control**: Draw points, lines, and shapes exactly where you want
- **High detail**: Much finer control than character-based graphics
- **Two bitmap modes**: Hi-resolution (320×200) and multicolor (160×200)
- **Memory intensive**: Requires 8000 bytes for full-screen bitmap
- **Complex addressing**: Each pixel maps to specific bit in memory

Unlike character graphics, bitmap mode lets you draw **anything** - limited only by resolution and colour constraints.

## Bitmap Mode Selection

Bitmap modes are enabled through VIC-II control registers:

### Control Bits
- **$D011 bit 5 (BMM)**: Bitmap Mode (1=bitmap, 0=text)
- **$D016 bit 4 (MCM)**: Multicolor Mode (affects bitmap interpretation)

### Bitmap Modes
| BMM | MCM | Mode | Resolution | Colors |
|-----|-----|------|------------|--------|
| 1 | 0 | **Hi-Res Bitmap** | 320×200 | 2 colors per 8×8 block |
| 1 | 1 | **Multicolor Bitmap** | 160×200 | 4 colors per 4×8 block |

**Enabling Bitmap Mode:**

```assembly
; Enable hi-resolution bitmap mode
; Clear screen and switch to bitmap graphics

; Enable bitmap mode (BMM=1, MCM=0)
LDA $D011       ; Read control register 1
ORA #%00100000  ; Set BMM bit (bit 5)
STA $D011       ; Enable bitmap mode

LDA $D016       ; Read control register 2
AND #%11101111  ; Clear MCM bit (bit 4) for hi-res
STA $D016       ; Hi-res bitmap mode active

; Set bitmap and screen memory locations
LDA $D018       ; Memory control register
AND #%00000111  ; Clear bitmap pointer bits
ORA #%00001000  ; Set bitmap at $2000
STA $D018       ; Bitmap memory configured
```

## Hi-Resolution Bitmap Mode

**Hi-res bitmap mode** provides 320×200 pixel resolution:

- **Resolution**: 320×200 pixels (full screen detail)
- **Colors**: 2 colors per 8×8 pixel block
- **Memory**: 8000 bytes for bitmap data ($2000-$3F3F)
- **Screen memory**: Controls colour for each 8×8 block
- **Addressing**: Complex bit-level pixel addressing

### Bitmap Memory Organization

The bitmap is organised as **25 rows of 40 character blocks**:
- Each **8×8 block** uses 8 bytes (one byte per row)
- Each **bit** represents one pixel (0=background, 1=foreground)
- **Total**: 40×25×8 = 8000 bytes

### Pixel Address Calculation

To set a pixel at coordinate (X, Y):

```text
; Calculate bitmap address for pixel at (X, Y)
; Formula: Address = $2000 + (Y & $F8) * 40 + (Y & $07) + (X / 8) * 8

CalculatePixelAddress:
    ; Input: X in $80, Y in $81
    ; Output: Address in $82/$83, bit mask in $84
    
    ; Calculate row component: (Y & $F8) * 40
    LDA $81         ; Y coordinate
    AND #%11111000  ; Keep upper 5 bits (character row)
    STA $82         ; Store temporarily
    
    ; Multiply by 40 (character row width)
    ; $82 * 40 = $82 * 32 + $82 * 8
    ASL             ; * 2
    ASL             ; * 4  
    ASL             ; * 8
    STA $83         ; Store * 8
    LDA $82
    ASL             ; * 2
    ASL             ; * 4
    ASL             ; * 8
    ASL             ; * 16
    ASL             ; * 32
    CLC
    ADC $83         ; Add * 8 to get * 40
    STA $82         ; Low byte of row offset
    
    ; Add column component: (X / 8) * 8
    LDA $80         ; X coordinate
    LSR             ; Divide by 8 (character column)
    LSR
    LSR
    ASL             ; Multiply by 8 (bytes per character)
    ASL
    ASL
    CLC
    ADC $82         ; Add to row offset
    STA $82         ; Low byte of address
    
    ; Add fine Y component: (Y & $07)
    LDA $81         ; Y coordinate
    AND #%00000111  ; Keep lower 3 bits (row within character)
    CLC
    ADC $82         ; Add to address
    STA $82         ; Final low byte
    
    ; Add bitmap base address $2000
    LDA #$20        ; High byte of $2000
    ADC #$00        ; Add any carry
    STA $83         ; High byte of address
    
    ; Calculate bit mask for pixel
    LDA $80         ; X coordinate
    AND #%00000111  ; Keep lower 3 bits (bit position)
    TAX
    LDA BitMaskTable,X ; Get bit mask
    STA $84         ; Store bit mask
    
    RTS

BitMaskTable:
    .byte %10000000, %01000000, %00100000, %00010000
    .byte %00001000, %00000100, %00000010, %00000001
```

**Bitmap Pixel Addressing:**

```assembly
; Simplified pixel setting for demonstration
; Set individual pixels in bitmap mode

; Set bitmap memory at $2000
LDA $D018
AND #%00000111  ; Clear bitmap bits
ORA #%00001000  ; Point to $2000
STA $D018

; Simple pixel plotting (conceptual)
; Draw pixel at position (100, 50)

; Calculate byte address (simplified)
; For pixel at (100, 50):
; Byte = $2000 + (50 / 8) * 320 + (50 % 8) + (100 / 8) * 8

; Set a few pixels to create a pattern
LDA #%10000000  ; Set leftmost pixel
STA $2000       ; First byte of bitmap

LDA #%01000000  ; Set second pixel  
STA $2001       ; Second byte

LDA #%00100000  ; Set third pixel
STA $2002       ; Third byte

; Set colors for the 8x8 blocks
; Screen memory controls colors for each block
LDA #%00010000  ; White foreground (bit 3-0), black background (bit 7-4)
STA $0400       ; Color for first 8x8 block

LDA #%00100000  ; Red foreground, black background
STA $0401       ; Color for second block
```

## Multicolor Bitmap Mode

**Multicolor bitmap mode** provides 4 colors but at lower resolution:

- **Resolution**: 160×200 pixels (half horizontal resolution)
- **Colors**: 4 colors per 4×8 pixel block  
- **Memory**: Same 8000 bytes, but 2 bits per pixel
- **Color sources**: Background, screen memory, colour RAM, $D021

### Multicolor Pixel Interpretation

In multicolor mode, each **2-bit pair** selects a colour:
- **00**: Background colour ($D021)
- **01**: Upper 4 bits of screen memory
- **10**: Lower 4 bits of screen memory  
- **11**: Color RAM value

```text
; Enable multicolor bitmap mode
EnableMulticolorBitmap:
    ; Enable bitmap mode with multicolor
    LDA $D011
    ORA #%00100000  ; Set BMM (bitmap mode)
    STA $D011
    
    LDA $D016
    ORA #%00010000  ; Set MCM (multicolor mode)
    STA $D016
    
    RTS

; Set multicolor bitmap colors
SetMulticolorColors:
    ; Background colour (00)
    LDA #$00        ; Black
    STA $D021
    
    ; Set colors for first 4x8 block
    LDA #%00010010  ; Upper=white(1), Lower=red(2)
    STA $0400       ; Screen memory controls colors 01 and 10
    
    LDA #$05        ; Green
    STA $D800       ; Color RAM controls colour 11
    
    RTS
```

**Multicolor Bitmap Mode:**

```assembly
; Enable and demonstrate multicolor bitmap mode

EnableMulticolorMode:
    ; Enable bitmap mode
    LDA $D011
    ORA #%00100000  ; Set bitmap mode bit
    STA $D011
    
    ; Enable multicolor mode
    LDA $D016
    ORA #%00010000  ; Set multicolor bit
    STA $D016
    
    ; Setup bitmap at $2000
    LDA $D018
    AND #%00000111
    ORA #%00001000  ; Bitmap at $2000
    STA $D018
    RTS

SetupMulticolorDemo:
    JSR EnableMulticolorMode
    
    ; Set background colour (pixel value 00)
    LDA #$00        ; Black background
    STA $D021
    
    ; Setup colors for first block
    LDA #%00010010  ; Upper nibble=1 (white), lower=2 (red)
    STA $0400       ; Screen memory for first 8x8 block
    
    LDA #$05        ; Green colour
    STA $D800       ; Color RAM for first block (pixel value 11)
    
    ; Create multicolor pixel pattern
    ; Each byte contains 4 pixels (2 bits each)
    LDA #%00011011  ; Pixels: 00,01,10,11 = black,white,red,green
    STA $2000       ; First row of first block
    
    LDA #%01100110  ; Pixels: 01,10,01,10 = white,red,white,red
    STA $2001       ; Second row
    
    LDA #%10011001  ; Pixels: 10,01,10,01 = red,white,red,white
    STA $2002       ; Third row
    
    RTS

; Run the demo
JSR SetupMulticolorDemo
```

## Drawing Algorithms

### Pixel Plotting Routine
```text
; Plot pixel at (X, Y) with error checking
; Input: X in $80, Y in $81
PlotPixel:
    ; Check bounds
    LDA $80         ; X coordinate
    CMP #320        ; Check X bound (would need 16-bit compare)
    BCS OutOfBounds ; Skip if out of bounds
    
    LDA $81         ; Y coordinate  
    CMP #200        ; Check Y bound
    BCS OutOfBounds
    
    ; Calculate address and bit mask
    JSR CalculatePixelAddress
    
    ; Set the pixel
    LDY #$00
    LDA ($82),Y     ; Load current byte
    ORA $84         ; Set pixel bit
    STA ($82),Y     ; Store back
    
OutOfBounds:
    RTS

; Clear pixel at (X, Y)
ClearPixel:
    ; Similar to PlotPixel but clear bit
    JSR CalculatePixelAddress
    
    LDY #$00
    LDA ($82),Y     ; Load current byte
    EOR $84         ; Flip bit mask
    AND $84         ; Clear only our bit
    EOR $84         ; Flip back
    STA ($82),Y     ; Store back
    RTS
```

### Line Drawing (Bresenham Algorithm)
```text
; Draw line from (X1,Y1) to (X2,Y2)
; Simplified Bresenham line algorithm
DrawLine:
    ; Calculate deltas
    LDA X2
    SEC
    SBC X1
    STA DeltaX      ; DX = X2 - X1
    
    LDA Y2
    SEC  
    SBC Y1
    STA DeltaY      ; DY = Y2 - Y1
    
    ; Setup line drawing variables
    LDA X1
    STA CurrentX    ; Start at X1
    LDA Y1
    STA CurrentY    ; Start at Y1
    
    LDA DeltaX
    CMP DeltaY
    BCC SteepLine   ; If DX < DY, steep line
    
    ; Shallow line (step in X)
ShallowLoop:
    ; Plot current pixel
    LDA CurrentX
    STA $80
    LDA CurrentY
    STA $81
    JSR PlotPixel
    
    ; Step to next X
    INC CurrentX
    LDA CurrentX
    CMP X2
    BEQ LineDone    ; Reached end
    
    ; Calculate Y step (simplified)
    ; Real Bresenham would use error terms
    JMP ShallowLoop
    
SteepLine:
    ; Similar but step in Y direction
    
LineDone:
    RTS

; Variables
X1: .byte 0
Y1: .byte 0  
X2: .byte 0
Y2: .byte 0
CurrentX: .byte 0
CurrentY: .byte 0
DeltaX: .byte 0
DeltaY: .byte 0
```

**Basic Drawing Algorithms:**

```assembly
; Simple drawing demonstration
; Draw basic shapes and patterns

; Setup bitmap mode for drawing
InitDrawing:
    ; Enable hi-res bitmap mode
    LDA $D011
    ORA #%00100000  ; Set bitmap mode
    STA $D011
    
    LDA $D016
    AND #%11101111  ; Clear multicolor for hi-res
    STA $D016
    
    ; Clear bitmap memory
    LDX #$00
    LDA #$00
ClearLoop:
    STA $2000,X     ; Clear bitmap data
    STA $2100,X
    STA $2200,X
    STA $2300,X
    INX
    BNE ClearLoop
    
    ; Set colors (white on black)
    LDA #%00010000  ; White foreground, black background
    LDX #$00
ColorLoop:
    STA $0400,X     ; Set screen colors
    STA $0500,X
    STA $0600,X
    STA $0700,X
    INX
    BNE ColorLoop
    
    RTS

; Draw simple patterns
DrawPatterns:
    JSR InitDrawing
    
    ; Draw horizontal lines
    LDA #%11111111  ; Solid line
    STA $2000       ; Top of first 8x8 block
    STA $2001       ; Second row
    
    ; Draw vertical line pattern
    LDA #%10000000  ; Leftmost pixel
    STA $2008       ; Second 8x8 block, row 0
    STA $2009       ; Row 1
    STA $200A       ; Row 2
    STA $200B       ; Row 3
    
    ; Draw diagonal pattern
    LDA #%10000000  ; Top-left pixel
    STA $2010       ; Third block
    LDA #%01000000  ; One right
    STA $2011
    LDA #%00100000  ; One more right
    STA $2012
    LDA #%00010000  ; Continuing diagonal
    STA $2013
    
    RTS

; Run the drawing demo
JSR DrawPatterns
```

## Color Management

### C64 Color Palette

The C64 has a **fixed 16-colour palette**:

| Value | Color | Value | Color |
|-------|-------|-------|-------|
| 0 | Black | 8 | Orange |
| 1 | White | 9 | Brown |
| 2 | Red | 10 | Light Red |
| 3 | Cyan | 11 | Dark Gray |
| 4 | Purple | 12 | Medium Gray |
| 5 | Green | 13 | Light Green |
| 6 | Blue | 14 | Light Blue |
| 7 | Yellow | 15 | Light Gray |

### Color Clash Limitations

The C64 has **colour clash** - colour limitations that affect bitmap graphics:

**Hi-Res Bitmap:**
- Only **2 colors per 8×8 block**
- Colors defined by screen memory byte
- Upper 4 bits = foreground, lower 4 bits = background

**Multicolor Bitmap:**
- **4 colors per 4×8 block**
- More colors but half horizontal resolution
- Color sources: $D021, screen memory nibbles, colour RAM

```text
; Manage colour clash in hi-res mode
SetBlockColors:
    ; Set colors for 8x8 block at screen position (X, Y)
    ; Input: Block X in $80, Block Y in $81, Colors in $82
    
    ; Calculate screen memory address
    LDA $81         ; Block Y
    ASL             ; Multiply by 40 (screen width)
    ASL
    ASL
    ASL
    ASL
    CLC
    ADC $80         ; Add block X
    TAY             ; Use as index
    
    LDA $82         ; Color byte (fg in upper, bg in lower)
    STA $0400,Y     ; Set block colors
    
    RTS
```

### Advanced Color Techniques

```text
; Color cycling for animation effects
ColorCycleDemo:
    LDX #$00        ; Color index
    
CycleLoop:
    ; Create cycling colour pattern
    TXA
    AND #$0F        ; Keep in palette range
    STA BaseColor
    
    ; Set gradient colors
    LDY #$00        ; Block counter
GradientLoop:
    LDA BaseColor
    CLC
    ADC #$01        ; Next colour
    AND #$0F        ; Wrap around palette
    ASL             ; Shift to upper nibble (foreground)
    ASL
    ASL
    ASL
    ORA #$00        ; Add black background
    STA $0400,Y     ; Set block colour
    
    INY
    CPY #$28        ; First row (40 blocks)
    BNE GradientLoop
    
    ; Delay
    JSR ShortDelay
    
    INX             ; Next colour base
    JMP CycleLoop

ShortDelay:
    LDY #$FF
DelayLoop:
    DEY
    BNE DelayLoop
    RTS

BaseColor: .byte 0
```

**Color Management and Effects:**

```assembly
; Demonstrate colour management and visual effects

; Color palette demonstration
ColorPaletteDemo:
    ; Setup bitmap mode
    LDA $D011
    ORA #%00100000  ; Enable bitmap
    STA $D011
    
    ; Display colour palette as colored blocks
    LDX #$00        ; Color counter
    LDY #$00        ; Screen position
    
PaletteLoop:
    ; Create colour byte (same colour for fg and bg)
    TXA             ; Get colour index
    ASL             ; Shift to upper nibble
    ASL
    ASL
    ASL
    STA $85         ; Store shifted colour
    TXA             ; Get colour again
    ORA $85         ; Combine with upper nibble
    STA $0400,Y     ; Set screen colour
    
    ; Fill corresponding bitmap area with solid pattern
    TYA             ; Get screen position
    ASL             ; Convert to bitmap offset
    ASL
    ASL
    TAX             ; Use as bitmap index
    
    LDA #%11111111  ; Solid pattern
    STA $2000,X     ; Fill 8 rows
    STA $2001,X
    STA $2002,X
    STA $2003,X
    STA $2004,X
    STA $2005,X
    STA $2006,X
    STA $2007,X
    
    ; Next palette entry
    TYA
    CLC
    ADC #$01        ; Next screen position
    TAY
    TXA
    LSR             ; Restore colour index
    LSR
    LSR
    CLC
    ADC #$01        ; Next colour
    TAX
    CMP #$10        ; All 16 colors done?
    BNE PaletteLoop
    
    RTS

; Animated colour effects
AnimatedColors:
    LDX #$00        ; Animation frame
    
AnimLoop:
    ; Create wave pattern with colors
    LDY #$00        ; Position counter
    
WaveLoop:
    ; Calculate colour based on position and time
    TYA             ; Position
    CLC
    ADC #$01        ; Add frame offset
    AND #$0F        ; Keep in colour range
    
    ; Create colour byte
    ASL             ; Foreground colour
    ASL
    ASL
    ASL
    ORA #$00        ; Black background
    STA $0400,Y     ; Set colour
    
    INY             ; Next position
    CPY #$28        ; First row only
    BNE WaveLoop
    
    ; Simple delay
    LDA #$FF
DelayAnim:
    SEC
    SBC #$01
    BNE DelayAnim
    
    INX             ; Next frame
    JMP AnimLoop

; Run colour demonstrations
JSR ColorPaletteDemo
```

## Advanced Graphics Techniques

### Double Buffering
```text
; Double buffering for smooth animation
Buffer1 = $2000     ; First bitmap buffer
Buffer2 = $4000     ; Second bitmap buffer

CurrentBuffer = $90 ; 0=Buffer1, 1=Buffer2

SwapBuffers:
    LDA CurrentBuffer
    EOR #$01        ; Toggle buffer
    STA CurrentBuffer
    
    BEQ UseBuffer1
    
UseBuffer2:
    ; Point VIC-II to Buffer2
    LDA $D018
    AND #%00000111
    ORA #%00100000  ; $4000 bitmap
    STA $D018
    RTS
    
UseBuffer1:
    ; Point VIC-II to Buffer1  
    LDA $D018
    AND #%00000111
    ORA #%00001000  ; $2000 bitmap
    STA $D018
    RTS
```

### Raster Effects
```text
; Raster-timed colour changes
RasterColorBars:
    ; Wait for specific raster line
    LDA $D012
    CMP #$30        ; Line 48
    BNE RasterColorBars
    
    ; Change colors during display
    LDA #$02        ; Red
    STA $D021       ; Background
    
    ; Wait for next line
WaitNext:
    LDA $D012
    CMP #$60        ; Line 96
    BNE WaitNext
    
    LDA #$05        ; Green
    STA $D021       ; Background
    
    JMP RasterColorBars ; Continue effect
```

### Mixed Mode Graphics
```text
; Combine bitmap and sprite graphics
MixedModeDemo:
    ; Setup bitmap background
    JSR InitDrawing
    JSR DrawPatterns
    
    ; Add sprites over bitmap
    LDA #$80        ; Sprite data pointer
    STA $07F8       ; Sprite 0
    
    LDA #%00000001  ; Enable sprite 0
    STA $D015
    
    ; Position sprite over bitmap graphics
    LDA #160        ; Center X
    STA $D000
    LDA #100        ; Center Y
    STA $D001
    
    ; Sprite appears over bitmap
    RTS
```

## Practice Exercise

Create a comprehensive graphics demonstration that showcases:

1. Both hi-res and multicolor bitmap modes
2. Pixel-level drawing with basic shapes
3. Color management and palette effects
4. Animation and visual effects
5. Integration with sprites

**Practice Exercise - Complete Graphics Demo:**

```assembly
; Comprehensive bitmap graphics demonstration
; Shows multiple modes, drawing, and effects

GraphicsDemo:
    JSR HiResDemo
    JSR DelayLong
    JSR MulticolorDemo
    JSR DelayLong
    JSR ColorEffectsDemo
    JMP GraphicsDemo ; Loop forever

HiResDemo:
    ; Setup hi-res bitmap mode
    LDA $D011
    ORA #%00100000  ; Enable bitmap
    STA $D011
    LDA $D016
    AND #%11101111  ; Disable multicolor
    STA $D016
    
    ; Clear bitmap
    JSR ClearBitmap
    
    ; Draw geometric patterns
    ; Draw border
    LDA #%11111111
    STA $2000       ; Top border
    STA $2320       ; Bottom area
    
    ; Draw vertical lines
    LDX #$00
VerticalLoop:
    LDA #%10000001  ; Left and right pixels
    STA $2000,X
    INX
    CPX #$40        ; Several rows
    BNE VerticalLoop
    
    ; Set colors
    LDA #%00010000  ; White on black
    LDX #$00
HiResColorLoop:
    STA $0400,X
    INX
    CPX #$FF
    BNE HiResColorLoop
    
    RTS

MulticolorDemo:
    ; Switch to multicolor bitmap mode
    LDA $D011
    ORA #%00100000  ; Keep bitmap mode
    STA $D011
    LDA $D016
    ORA #%00010000  ; Enable multicolor
    STA $D016
    
    ; Clear bitmap
    JSR ClearBitmap
    
    ; Create multicolor patterns
    LDA #%00011011  ; 4 different colors per byte
    STA $2000
    LDA #%01101001
    STA $2001
    LDA #%10010110
    STA $2002
    
    ; Set multicolor palette
    LDA #$00        ; Black background
    STA $D021
    LDA #%00010010  ; White and red
    STA $0400
    LDA #$05        ; Green
    STA $D800
    
    RTS

ColorEffectsDemo:
    ; Return to hi-res for colour cycling
    LDA $D016
    AND #%11101111  ; Disable multicolor
    STA $D016
    
    ; Animate colors
    LDX #$00
ColorCycleLoop:
    TXA
    AND #$0F
    ASL
    ASL
    ASL
    ASL
    ORA #$00        ; Black background
    
    LDY #$00
SetColors:
    STA $0400,Y
    INY
    CPY #$28        ; First row
    BNE SetColors
    
    JSR DelayShort
    INX
    CPX #$40        ; Cycle through colors
    BNE ColorCycleLoop
    
    RTS

ClearBitmap:
    ; Clear entire bitmap memory
    LDX #$00
    LDA #$00
ClearLoop:
    STA $2000,X
    STA $2100,X
    STA $2200,X
    STA $2300,X
    STA $2400,X
    STA $2500,X
    STA $2600,X
    STA $2700,X
    INX
    BNE ClearLoop
    RTS

DelayShort:
    LDY #$80
DelayS:
    DEY
    BNE DelayS
    RTS

DelayLong:
    LDX #$FF
DelayL1:
    LDY #$FF
DelayL2:
    DEY
    BNE DelayL2
    DEX
    BNE DelayL1
    RTS

; Start the comprehensive demo
JSR GraphicsDemo
```

## Bitmap Graphics Best Practices

### 1. Memory Management
```text
; Always clear bitmap memory before use
ClearBitmapSafely:
    ; Turn off display during clear
    LDA $D011
    AND #%11101111  ; Clear DEN bit
    STA $D011
    
    ; Clear memory
    JSR ClearBitmap
    
    ; Turn display back on
    LDA $D011
    ORA #%00010000  ; Set DEN bit
    STA $D011
    RTS
```

### 2. Color Planning
```text
; Plan colour usage to avoid clash
; Create colour maps before drawing
; Test on different displays
```

### 3. Performance Optimization
```text
; Use lookup tables for calculations
; Unroll critical drawing loops
; Consider double buffering for animation
```

## What You've Learned

In this lesson, you've mastered:

- Bitmap graphics modes (hi-res and multicolor)
- Pixel addressing and memory organisation
- Drawing algorithms and graphics primitives
- Color management and C64 palette limitations
- Advanced graphics effects and animation techniques
- Integration of bitmap graphics with sprites and text

## Looking Ahead

In the next lesson, you'll begin learning about the **SID sound chip** - the C64's revolutionary audio processor that enables music synthesis, sound effects, and audio programming. You'll discover how sound complements graphics for complete multimedia programming.

## Fun Fact

The bitmap graphics techniques you've learned were cutting-edge in the 1980s! The C64's ability to mix text, bitmap graphics, and sprites in the same display was revolutionary. Many of the algorithms you've studied - Bresenham line drawing, double buffering, raster effects - are still fundamental to modern graphics programming. Today's GPUs use the same core concepts for pixel shaders, framebuffers, and real-time rendering. You've learned the mathematical and technical foundations that power everything from retro games to modern 3D graphics engines!