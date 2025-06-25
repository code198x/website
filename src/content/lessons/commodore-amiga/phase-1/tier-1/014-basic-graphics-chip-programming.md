---
title: "Basic Graphics Chip Programming"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 14
description: "Take your first steps into Amiga graphics programming by learning to control the display hardware directly. Set up screens, configure bitplanes, and create your first visual programs using the graphics chips."
learning_objectives:
  - "Set up a basic Amiga display using assembly language"
  - "Configure bitplane pointers and display parameters"
  - "Control screen resolution and color depth"
  - "Create simple graphics patterns and shapes"
  - "Understand the relationship between bitplanes and colors"
concepts:
  - "Display setup and initialization"
  - "Bitplane configuration and pointers"
  - "Resolution and display mode control"
  - "Basic pixel manipulation in bitplanes"
  - "Color depth and palette relationships"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 14
---

# Lesson 14: Basic Graphics Chip Programming

Now that you understand the Amiga's memory architecture and custom chips, it's time to create your first graphics programs! Today you'll learn to set up displays, configure bitplanes, and create visual patterns using direct hardware control.

## The Amiga Graphics System Overview

The Amiga's graphics system is built around several key concepts:

- **Bitplanes**: Separate memory areas that combine to create colors
- **Display List**: Hardware automatically scans bitplanes to create the image
- **Palette**: Color lookup table that defines actual RGB values
- **Copper**: Programmable display list processor for advanced effects
- **DMA**: Custom chips fetch graphics data without CPU intervention

## Setting Up Your First Display

Let's start by initializing a basic display:

<CodeRunner 
  system="commodore-amiga"
  title="Basic Display Initialization"
  code="; Initialize Amiga graphics system
MOVE.L #$00DFF000, A0        ; Custom chip base address

; First, disable all DMA for safe setup
MOVE.W #$0400, $096(A0)      ; Clear all DMA enables

; Setup display parameters
MOVE.W #$1200, $100(A0)      ; BPLCON0: 1 bitplane, color enable
MOVE.W #$0000, $102(A0)      ; BPLCON1: No horizontal scroll
MOVE.W #$0000, $104(A0)      ; BPLCON2: Standard priorities

; Setup display window (standard 320x200)
MOVE.W #$2C81, $08E(A0)      ; DIWSTRT: Display start ($2C,$81)
MOVE.W #$2CC1, $090(A0)      ; DIWSTOP: Display stop ($2C,$C1)
MOVE.W #$0038, $092(A0)      ; DDFSTRT: Data fetch start
MOVE.W #$00D0, $094(A0)      ; DDFSTOP: Data fetch stop

; Setup modulo (bytes to skip at end of each line)
MOVE.W #$0000, $108(A0)      ; BPL1MOD: No skip for bitplane 1
MOVE.W #$0000, $10A(A0)      ; BPL2MOD: No skip for bitplane 2

; Enable display DMA
MOVE.W #$8180, $096(A0)      ; Enable master DMA + bitplane DMA"
  language="assembly"
/>

## Creating and Using Bitplanes

Netplanes are the foundation of Amiga graphics. Each bitplane contains one bit per pixel:

<CodeRunner 
  system="commodore-amiga"
  title="Single Bitplane Setup"
  code="; Setup a single bitplane (1-bit, 2 colors)
MOVE.L #$00DFF000, A0        ; Custom chip base
MOVE.L #$00020000, A1        ; Bitplane memory in Chip RAM

; Clear the bitplane memory (320x200 = 8000 bytes)
MOVE.W #1999, D0             ; Loop counter (8000/4 - 1)
CLEAR_LOOP:
    MOVE.L #$00000000, (A1)+ ; Clear 4 bytes, advance pointer
    DBF D0, CLEAR_LOOP       ; Loop until done

; Reset bitplane pointer
MOVE.L #$00020000, A1        ; Back to start of bitplane

; Set bitplane pointer in custom chip
MOVE.L A1, $0E0(A0)          ; BPL1PT: Bitplane 1 pointer

; Configure for 1 bitplane
MOVE.W #$1200, $100(A0)      ; BPLCON0: 1 bitplane, color enable

; Set colors (2 colors for 1 bitplane)
MOVE.W #$0000, $180(A0)      ; COLOR00: Black (background)
MOVE.W #$0FFF, $182(A0)      ; COLOR01: White (foreground)

; Enable bitplane DMA
MOVE.W #$8100, $096(A0)      ; Master DMA + bitplane DMA"
  language="assembly"
/>

## Drawing Simple Patterns

Now let's create some visual patterns in the bitplane:

<CodeRunner 
  system="commodore-amiga"
  title="Creating Simple Graphics Patterns"
  code="; Create patterns in bitplane memory
MOVE.L #$00020000, A0        ; Bitplane memory
MOVE.L #$00DFF000, A1        ; Custom chip base

; Pattern 1: Horizontal stripes
MOVE.W #99, D0               ; 100 lines of stripes
STRIPE_LOOP:
    ; Odd lines: all pixels on
    MOVE.L #$FFFFFFFF, (A0)  ; 32 pixels on
    MOVE.L #$FFFFFFFF, 4(A0) ; Next 32 pixels on
    ; Even lines: all pixels off (already cleared)
    ADD.L #80, A0            ; Skip to next pair of lines
    DBF D0, STRIPE_LOOP

; Reset pointer for next pattern
MOVE.L #$00020000, A0

; Pattern 2: Vertical stripes
MOVE.W #199, D1              ; 200 lines
VERTICAL_LOOP:
    MOVE.L #$AAAAAAAA, (A0)  ; Alternating pixels
    MOVE.L #$AAAAAAAA, 4(A0) 
    ADD.L #40, A0            ; Next line (40 bytes per line)
    DBF D1, VERTICAL_LOOP

; Setup display for our pattern
MOVE.L #$00020000, $0E0(A1)  ; Point to our bitplane
MOVE.W #$8100, $096(A1)      ; Enable display"
  language="assembly"
/>

## Two-Bitplane Graphics (4 Colors)

Let's create a more colorful display with two bitplanes:

<CodeRunner 
  system="commodore-amiga"
  title="Two Bitplane Setup for 4 Colors"
  code="; Setup 2 bitplanes for 4-color graphics
MOVE.L #$00DFF000, A0        ; Custom chip base

; Bitplane memory layout
MOVE.L #$00020000, A1        ; Bitplane 1 (8000 bytes)
MOVE.L #$00022000, A2        ; Bitplane 2 (8000 bytes)

; Clear both bitplanes
MOVE.L A1, A3                ; Copy of bitplane 1 address
MOVE.W #3999, D0             ; Clear both bitplanes (16000 bytes total)
CLEAR_BOTH:
    MOVE.L #$00000000, (A3)+ ; Clear and advance
    DBF D0, CLEAR_BOTH

; Set bitplane pointers
MOVE.L A1, $0E0(A0)          ; BPL1PT: Bitplane 1
MOVE.L A2, $0E4(A0)          ; BPL2PT: Bitplane 2

; Configure for 2 bitplanes
MOVE.W #$2200, $100(A0)      ; BPLCON0: 2 bitplanes, color enable

; Set 4-color palette
MOVE.W #$0000, $180(A0)      ; COLOR00: Black    (00 binary)
MOVE.W #$00FF, $182(A0)      ; COLOR01: Blue     (01 binary)
MOVE.W #$0F00, $184(A0)      ; COLOR02: Red      (10 binary)  
MOVE.W #$0FF0, $186(A0)      ; COLOR03: Yellow   (11 binary)

; Create pattern: quarters of screen in different colors
; Top-left: Color 0 (both bitplanes = 0)
; Top-right: Color 1 (bitplane 1 = 1, bitplane 2 = 0)
; Bottom-left: Color 2 (bitplane 1 = 0, bitplane 2 = 1)
; Bottom-right: Color 3 (both bitplanes = 1)

; Top half - right side (color 1)
MOVE.W #99, D0               ; 100 lines
TOP_RIGHT:
    MOVE.W #$FFFF, 20(A1)    ; Right half of bitplane 1
    ; Bitplane 2 stays 0 for this area
    ADD.L #40, A1            ; Next line
    DBF D0, TOP_RIGHT

; Reset pointers
MOVE.L #$00020000, A1
MOVE.L #$00022000, A2

; Bottom half - left side (color 2)  
ADD.L #4000, A2              ; Start at line 100 of bitplane 2
MOVE.W #99, D0               ; 100 lines
BOTTOM_LEFT:
    MOVE.W #$FFFF, (A2)      ; Left half of bitplane 2
    ADD.L #40, A2            ; Next line
    DBF D0, BOTTOM_LEFT

; Bottom half - right side (color 3)
MOVE.L #$00020000, A1        ; Reset bitplane 1 pointer
MOVE.L #$00022000, A2        ; Reset bitplane 2 pointer
ADD.L #4000, A1              ; Start at line 100
ADD.L #4000, A2              ; Start at line 100
MOVE.W #99, D0               ; 100 lines
BOTTOM_RIGHT:
    MOVE.W #$FFFF, 20(A1)    ; Right half of bitplane 1
    MOVE.W #$FFFF, 20(A2)    ; Right half of bitplane 2
    ADD.L #40, A1            ; Next line
    ADD.L #40, A2
    DBF D0, BOTTOM_RIGHT

; Enable display
MOVE.W #$8100, $096(A0)      ; Master DMA + bitplane DMA"
  language="assembly"
/>

## Understanding Color Combinations

With multiple bitplanes, colors are formed by combining bits:

<CodeRunner 
  system="commodore-amiga"
  title="Color Bit Combinations"
  code="; Demonstration of how bitplanes combine to form colors
; With 2 bitplanes, we get 4 possible color combinations:

; Bitplane 2 | Bitplane 1 | Color Index | Color Register
;     0      |     0      |      0      | COLOR00
;     0      |     1      |      1      | COLOR01
;     1      |     0      |      2      | COLOR02
;     1      |     1      |      3      | COLOR03

MOVE.L #$00DFF000, A0        ; Custom chip base
MOVE.L #$00020000, A1        ; Bitplane 1
MOVE.L #$00022000, A2        ; Bitplane 2

; Create a test pattern to show all 4 colors
MOVE.W #49, D0               ; First 50 lines

; Lines 0-49: Color 0 (both bitplanes 0)
COLOR0_LINES:
    ; Both bitplanes already cleared, so color 0
    DBF D0, COLOR0_LINES

; Lines 50-99: Color 1 (bitplane 1 = 1, bitplane 2 = 0)
ADD.L #2000, A1              ; Move to line 50 of bitplane 1
MOVE.W #49, D0
COLOR1_LINES:
    MOVE.L #$FFFFFFFF, (A1)  ; All pixels on in bitplane 1
    MOVE.L #$FFFFFFFF, 4(A1)
    ADD.L #40, A1
    DBF D0, COLOR1_LINES

; Lines 100-149: Color 2 (bitplane 1 = 0, bitplane 2 = 1)
MOVE.L #$00022000, A2        ; Reset bitplane 2
ADD.L #4000, A2              ; Move to line 100
MOVE.W #49, D0
COLOR2_LINES:
    MOVE.L #$FFFFFFFF, (A2)  ; All pixels on in bitplane 2
    MOVE.L #$FFFFFFFF, 4(A2)
    ADD.L #40, A2
    DBF D0, COLOR2_LINES

; Lines 150-199: Color 3 (both bitplanes = 1)
MOVE.L #$00020000, A1        ; Reset pointers
MOVE.L #$00022000, A2
ADD.L #6000, A1              ; Line 150
ADD.L #6000, A2
MOVE.W #49, D0
COLOR3_LINES:
    MOVE.L #$FFFFFFFF, (A1)  ; Both bitplanes on
    MOVE.L #$FFFFFFFF, 4(A1)
    MOVE.L #$FFFFFFFF, (A2)
    MOVE.L #$FFFFFFFF, 4(A2)
    ADD.L #40, A1
    ADD.L #40, A2
    DBF D0, COLOR3_LINES"
  language="assembly"
/>

## Simple Pixel Plotting

Let's create a function to plot individual pixels:

<CodeRunner 
  system="commodore-amiga"
  title="Pixel Plotting Function"
  code="; Pixel plotting function for 2-bitplane display
; Input: D0 = X coordinate (0-319)
;        D1 = Y coordinate (0-199)  
;        D2 = Color (0-3)

PLOT_PIXEL:
    ; Calculate byte offset: Y * 40 + X/8
    MOVE.W D1, D3            ; Copy Y coordinate
    MULU.W #40, D3           ; Y * 40 (bytes per line)
    MOVE.W D0, D4            ; Copy X coordinate
    LSR.W #3, D4             ; X / 8 (byte within line)
    ADD.W D4, D3             ; D3 = byte offset

    ; Calculate bit position within byte
    MOVE.W D0, D4            ; Copy X coordinate
    AND.W #7, D4             ; D4 = bit position (0-7)
    MOVE.W #7, D5
    SUB.W D4, D5             ; D5 = bit number (7-0, left to right)

    ; Create bit mask
    MOVE.W #1, D4
    LSL.W D5, D4             ; D4 = bit mask

    ; Get addresses of both bitplanes
    MOVE.L #$00020000, A1    ; Bitplane 1 base
    MOVE.L #$00022000, A2    ; Bitplane 2 base
    ADD.L D3, A1             ; A1 = bitplane 1 byte address
    ADD.L D3, A2             ; A2 = bitplane 2 byte address

    ; Clear both bits first
    NOT.W D4                 ; Invert mask for clearing
    AND.B D4, (A1)           ; Clear bit in bitplane 1
    AND.B D4, (A2)           ; Clear bit in bitplane 2
    NOT.W D4                 ; Restore original mask

    ; Set bits based on color value
    BTST #0, D2              ; Test bit 0 of color
    BEQ SKIP_BP1
    OR.B D4, (A1)            ; Set bit in bitplane 1

SKIP_BP1:
    BTST #1, D2              ; Test bit 1 of color
    BEQ SKIP_BP2
    OR.B D4, (A2)            ; Set bit in bitplane 2

SKIP_BP2:
    RTS

; Test the pixel plotting function
PIXEL_TEST:
    MOVE.L #$00DFF000, A0    ; Setup display first
    MOVE.W #$2200, $100(A0)  ; 2 bitplanes
    MOVE.W #$8100, $096(A0)  ; Enable DMA

    ; Plot some test pixels
    MOVE.W #160, D0          ; X = center
    MOVE.W #50, D1           ; Y = 50
    MOVE.W #1, D2            ; Color 1 (blue)
    BSR PLOT_PIXEL

    MOVE.W #160, D0          ; X = center
    MOVE.W #100, D1          ; Y = 100  
    MOVE.W #2, D2            ; Color 2 (red)
    BSR PLOT_PIXEL

    MOVE.W #160, D0          ; X = center
    MOVE.W #150, D1          ; Y = 150
    MOVE.W #3, D2            ; Color 3 (yellow)
    BSR PLOT_PIXEL"
  language="assembly"
/>

## Drawing Lines

Let's create a simple line drawing function:

<CodeRunner 
  system="commodore-amiga"
  title="Simple Line Drawing"
  code="; Simple horizontal line drawing function
; Input: D0 = start X, D1 = end X, D2 = Y, D3 = color

DRAW_HORIZONTAL_LINE:
    MOVE.W D2, D4            ; Save Y coordinate
    MOVE.W D3, D5            ; Save color

HLINE_LOOP:
    CMP.W D1, D0             ; Compare current X with end X
    BGT HLINE_DONE           ; Done if X > end X
    
    MOVE.W D4, D1            ; Y coordinate
    MOVE.W D5, D2            ; Color
    BSR PLOT_PIXEL           ; Plot the pixel
    
    ADD.W #1, D0             ; Increment X
    BRA HLINE_LOOP

HLINE_DONE:
    RTS

; Vertical line drawing function
; Input: D0 = X, D1 = start Y, D2 = end Y, D3 = color

DRAW_VERTICAL_LINE:
    MOVE.W D0, D4            ; Save X coordinate
    MOVE.W D3, D5            ; Save color

VLINE_LOOP:
    CMP.W D2, D1             ; Compare current Y with end Y
    BGT VLINE_DONE           ; Done if Y > end Y
    
    MOVE.W D4, D0            ; X coordinate
    MOVE.W D5, D2            ; Color
    BSR PLOT_PIXEL           ; Plot the pixel
    
    ADD.W #1, D1             ; Increment Y
    BRA VLINE_LOOP

VLINE_DONE:
    RTS

; Test line drawing
LINE_TEST:
    ; Draw horizontal line
    MOVE.W #50, D0           ; Start X
    MOVE.W #270, D1          ; End X
    MOVE.W #100, D2          ; Y
    MOVE.W #1, D3            ; Color
    BSR DRAW_HORIZONTAL_LINE

    ; Draw vertical line
    MOVE.W #160, D0          ; X
    MOVE.W #50, D1           ; Start Y
    MOVE.W #150, D2          ; End Y
    MOVE.W #2, D3            ; Color
    BSR DRAW_VERTICAL_LINE"
  language="assembly"
/>

## Rectangle Drawing

Building on our line functions, let's draw rectangles:

<CodeRunner 
  system="commodore-amiga"
  title="Rectangle Drawing Function"
  code="; Rectangle drawing function
; Input: D0 = left X, D1 = top Y, D2 = right X, D3 = bottom Y
;        D4 = color

DRAW_RECTANGLE:
    ; Save parameters
    MOVE.W D0, -(A7)         ; Save left X
    MOVE.W D1, -(A7)         ; Save top Y
    MOVE.W D2, -(A7)         ; Save right X
    MOVE.W D3, -(A7)         ; Save bottom Y
    MOVE.W D4, -(A7)         ; Save color

    ; Draw top horizontal line
    MOVE.W D4, D3            ; Color parameter
    MOVE.W D1, D2            ; Y = top Y
    ; D0 = left X, D1 = right X already set
    MOVE.W 6(A7), D1         ; Get right X from stack
    BSR DRAW_HORIZONTAL_LINE

    ; Draw bottom horizontal line  
    MOVE.W (A7), D3          ; Color
    MOVE.W 2(A7), D2         ; Y = bottom Y
    MOVE.W 8(A7), D0         ; Left X
    MOVE.W 6(A7), D1         ; Right X
    BSR DRAW_HORIZONTAL_LINE

    ; Draw left vertical line
    MOVE.W (A7), D3          ; Color
    MOVE.W 8(A7), D0         ; X = left X
    MOVE.W 4(A7), D1         ; Start Y = top Y
    MOVE.W 2(A7), D2         ; End Y = bottom Y
    BSR DRAW_VERTICAL_LINE

    ; Draw right vertical line
    MOVE.W (A7), D3          ; Color
    MOVE.W 6(A7), D0         ; X = right X
    MOVE.W 4(A7), D1         ; Start Y = top Y
    MOVE.W 2(A7), D2         ; End Y = bottom Y
    BSR DRAW_VERTICAL_LINE

    ; Restore stack
    ADD.L #10, A7            ; Remove parameters

    RTS

; Test rectangle drawing
RECTANGLE_TEST:
    ; Draw a rectangle
    MOVE.W #50, D0           ; Left X
    MOVE.W #50, D1           ; Top Y
    MOVE.W #250, D2          ; Right X
    MOVE.W #150, D3          ; Bottom Y
    MOVE.W #3, D4            ; Color (yellow)
    BSR DRAW_RECTANGLE

    ; Draw a smaller rectangle inside
    MOVE.W #100, D0          ; Left X
    MOVE.W #75, D1           ; Top Y
    MOVE.W #200, D2          ; Right X
    MOVE.W #125, D3          ; Bottom Y
    MOVE.W #1, D4            ; Color (blue)
    BSR DRAW_RECTANGLE"
  language="assembly"
/>

## Practice Exercise: Simple Graphics Demo

Create a comprehensive graphics demonstration:

<CodeRunner 
  system="commodore-amiga"
  title="Practice: Complete Graphics Demo"
  code="; Complete graphics demonstration program

GRAPHICS_DEMO:
    ; Initialize display system
    MOVE.L #$00DFF000, A0    ; Custom chip base
    
    ; Disable DMA for setup
    MOVE.W #$0400, $096(A0)
    
    ; Setup 2-bitplane display
    MOVE.W #$2200, $100(A0)  ; BPLCON0: 2 bitplanes, color
    MOVE.W #$0000, $102(A0)  ; BPLCON1: No scroll
    
    ; Set display window
    MOVE.W #$2C81, $08E(A0)  ; DIWSTRT
    MOVE.W #$2CC1, $090(A0)  ; DIWSTOP
    MOVE.W #$0038, $092(A0)  ; DDFSTRT
    MOVE.W #$00D0, $094(A0)  ; DDFSTOP
    
    ; Clear bitplane memory
    MOVE.L #$00020000, A1    ; Bitplane 1
    MOVE.L #$00022000, A2    ; Bitplane 2
    MOVE.W #3999, D0         ; Clear both bitplanes
    
CLEAR_MEMORY:
    MOVE.L #$00000000, (A1)+
    MOVE.L #$00000000, (A2)+
    DBF D0, CLEAR_MEMORY
    
    ; Set bitplane pointers
    MOVE.L #$00020000, $0E0(A0)  ; BPL1PT
    MOVE.L #$00022000, $0E4(A0)  ; BPL2PT
    
    ; Set color palette
    MOVE.W #$0001, $180(A0)  ; COLOR00: Dark blue background
    MOVE.W #$0FFF, $182(A0)  ; COLOR01: White
    MOVE.W #$0F00, $184(A0)  ; COLOR02: Red
    MOVE.W #$0FF0, $186(A0)  ; COLOR03: Yellow
    
    ; Enable display
    MOVE.W #$8100, $096(A0)  ; Master DMA + bitplane DMA
    
    ; Draw demonstration graphics
    
    ; Draw border rectangle
    MOVE.W #10, D0           ; Left
    MOVE.W #10, D1           ; Top
    MOVE.W #310, D2          ; Right
    MOVE.W #190, D3          ; Bottom
    MOVE.W #1, D4            ; White color
    BSR DRAW_RECTANGLE
    
    ; Draw inner rectangle
    MOVE.W #30, D0           ; Left
    MOVE.W #30, D1           ; Top
    MOVE.W #290, D2          ; Right
    MOVE.W #170, D3          ; Bottom
    MOVE.W #2, D4            ; Red color
    BSR DRAW_RECTANGLE
    
    ; Draw cross in center
    MOVE.W #50, D0           ; Start X
    MOVE.W #270, D1          ; End X
    MOVE.W #100, D2          ; Y
    MOVE.W #3, D3            ; Yellow color
    BSR DRAW_HORIZONTAL_LINE
    
    MOVE.W #160, D0          ; X
    MOVE.W #50, D1           ; Start Y
    MOVE.W #150, D2          ; End Y
    MOVE.W #3, D3            ; Yellow color
    BSR DRAW_VERTICAL_LINE
    
    ; Draw some individual pixels
    MOVE.W #80, D0           ; X
    MOVE.W #80, D1           ; Y
    MOVE.W #1, D2            ; White
    BSR PLOT_PIXEL
    
    MOVE.W #240, D0          ; X  
    MOVE.W #80, D1           ; Y
    MOVE.W #1, D2            ; White
    BSR PLOT_PIXEL
    
    MOVE.W #80, D0           ; X
    MOVE.W #120, D1          ; Y
    MOVE.W #1, D2            ; White
    BSR PLOT_PIXEL
    
    MOVE.W #240, D0          ; X
    MOVE.W #120, D1          ; Y
    MOVE.W #1, D2            ; White
    BSR PLOT_PIXEL

DEMO_LOOP:
    ; Keep display running
    BRA DEMO_LOOP"
  language="assembly"
/>

## What You've Learned

In this foundational graphics lesson, you've mastered:

- Basic Amiga display initialization and setup
- Bitplane configuration and memory management
- Understanding how bitplanes combine to create colors
- Setting up color palettes for different color depths
- Creating simple graphics patterns and shapes
- Pixel plotting and basic drawing functions
- Line and rectangle drawing algorithms
- Complete graphics demonstration programming

## Key Graphics Programming Concepts

1. **Bitplanes are independent**: Each bitplane is a separate 1-bit image
2. **Colors are combinations**: Multiple bitplanes combine to create color indices
3. **Memory layout matters**: Graphics data must be in Chip RAM
4. **DMA enables display**: Custom chips fetch graphics data automatically
5. **Timing is important**: Display parameters must match hardware capabilities

## Best Practices for Graphics Programming

1. **Clear memory first** - Always initialize bitplane memory
2. **Setup DMA properly** - Enable only what you need
3. **Use efficient drawing** - Hardware operations are faster than pixel-by-pixel
4. **Plan memory usage** - Organize bitplanes for optimal access
5. **Test on real hardware** - Emulation may behave differently

## Looking Ahead

In the next lesson, you'll explore the audio capabilities of Paula, the Amiga's sound chip! You'll learn to play samples, control volume and pitch, and create your first audio programs to complement your graphics work.

## Fun Fact

The Amiga's bitplane graphics system was revolutionary because it allowed for much more efficient color graphics than the pixel-mapped systems used by most other computers. While a typical computer might use 8 bits per pixel for 256 colors (requiring 256KB for a 320x200 screen), the Amiga could display the same image using separate bitplanes that could be optimized for the actual number of colors used. A 4-color image only needed 2 bitplanes (80KB), and the hardware could manipulate each bitplane independently - perfect for animation and special effects! This efficiency was crucial when memory was expensive and limited.