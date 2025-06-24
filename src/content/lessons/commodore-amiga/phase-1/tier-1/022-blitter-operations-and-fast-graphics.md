---
title: "Blitter Operations and Fast Graphics"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 22
description: "Master the Amiga's Blitter coprocessor for lightning-fast graphics operations. Learn to use the Blitter for copying, filling, line drawing, and complex logical operations that achieve speeds impossible with CPU programming alone."
learning_objectives:
  - "Understand the Blitter's architecture and operation modes"
  - "Master Blitter setup for copy, fill, and line operations"
  - "Implement high-speed graphics routines using Blitter DMA"
  - "Create complex visual effects with Blitter logical operations"
  - "Optimize graphics performance for professional applications"
concepts:
  - "Blitter DMA architecture and channels"
  - "Logical operations and minterm calculations"
  - "Line drawing and area fill algorithms"
  - "Blitter synchronization and queuing"
  - "Professional graphics optimization"
estimated_duration: "45-60 minutes"
difficulty: "intermediate"
code_examples: true
practical_exercise: true
order: 22
---

# Lesson 22: Blitter Operations and Fast Graphics

Today you'll master the Blitter - the Amiga's dedicated graphics coprocessor that can perform complex graphics operations at incredible speed. The Blitter will enable you to create smooth, high-performance graphics for your Copper Dreams game while the CPU handles game logic.

## Understanding the Blitter Architecture

The Blitter has three DMA channels and can perform 256 different logical operations:

- **Channel A**: First source (optional)
- **Channel B**: Second source (optional)  
- **Channel C**: Third source (optional, often used for masking)
- **Channel D**: Destination (always used)

The Blitter combines inputs using programmable logic and outputs the result to the destination.

<CodeRunner 
  system="commodore-amiga"
  title="Blitter Architecture and Basic Setup"
  code="; Understanding Blitter registers and basic operations

; Blitter register offsets from $DFF000
BLTCON0     EQU $040        ; Control register 0
BLTCON1     EQU $042        ; Control register 1  
BLTAFWM     EQU $044        ; First word mask for source A
BLTALWM     EQU $046        ; Last word mask for source A
BLTCPTH     EQU $048        ; Source C pointer (high)
BLTCPTL     EQU $04A        ; Source C pointer (low)
BLTBPTH     EQU $04C        ; Source B pointer (high)
BLTBPTL     EQU $04E        ; Source B pointer (low)
BLTAPTH     EQU $050        ; Source A pointer (high)
BLTAPTL     EQU $052        ; Source A pointer (low)
BLTDPTH     EQU $054        ; Destination pointer (high)
BLTDPTL     EQU $056        ; Destination pointer (low)
BLTSIZE     EQU $058        ; Size and start
BLTCMOD     EQU $060        ; Source C modulo
BLTBMOD     EQU $062        ; Source B modulo
BLTAMOD     EQU $064        ; Source A modulo
BLTDMOD     EQU $066        ; Destination modulo

; Wait for Blitter to be ready
WaitBlitter:
    LEA     $DFF000, A6
BlitterWait:
    BTST    #14, $002(A6)       ; Test DMACON blitter busy bit
    BNE.S   BlitterWait
    RTS

; Basic Blitter copy operation
; Copy rectangular area from source to destination
BlitterCopy:
    ; A0 = source address
    ; A1 = destination address  
    ; D0 = width in words
    ; D1 = height in lines
    
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Disable all source channels except A and enable destination
    MOVE.W  #$09F0, BLTCON0(A6) ; A to D copy, no shifting
    MOVE.W  #$0000, BLTCON1(A6) ; No special modes
    
    ; Set word masks (all bits enabled)
    MOVE.W  #$FFFF, BLTAFWM(A6)
    MOVE.W  #$FFFF, BLTALWM(A6)
    
    ; Set source A pointer
    MOVE.L  A0, D2
    MOVE.W  D2, BLTAPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTAPTH(A6)
    
    ; Set destination pointer
    MOVE.L  A1, D2
    MOVE.W  D2, BLTDPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTDPTH(A6)
    
    ; Set modulos (0 for contiguous data)
    MOVE.W  #0, BLTAMOD(A6)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Calculate and set size (starts the operation)
    LSL.W   #6, D1              ; Height in bits 15-6
    OR.W    D0, D1              ; Width in bits 5-0
    MOVE.W  D1, BLTSIZE(A6)     ; Start the blit!
    
    RTS

; Fast screen clear using Blitter
ClearScreen:
    ; Clear entire 320x200 4-bitplane screen
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Setup for destination-only operation
    MOVE.W  #$0100, BLTCON0(A6) ; D channel only, fill with zeros
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Set destination to graphics memory
    MOVE.L  #GRAPHICS_MEMORY, D0
    MOVE.W  D0, BLTDPTL(A6)
    SWAP    D0
    MOVE.W  D0, BLTDPTH(A6)
    
    ; No modulo (contiguous memory)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Clear all 4 bitplanes: 320x200 = 8000 bytes = 4000 words per plane
    ; Total: 16000 words, but max blit size is 1024x64 = 65536 pixels
    ; So we can clear 40 words (1 line) x 800 lines
    MOVE.W  #$C828, BLTSIZE(A6) ; 800 lines x 40 words
    
    RTS

; Example graphics memory area
GRAPHICS_MEMORY:
    DS.B    32000               ; Space for 4 bitplanes"
  language="assembly"
/>

## Blitter Logical Operations (Minterms)

The Blitter can perform any of 256 logical operations using minterms:

<CodeRunner 
  system="commodore-amiga"
  title="Blitter Logical Operations and Minterms"
  code="; Blitter logical operations using minterms
; Each minterm bit represents one combination of A, B, C inputs

; Common minterm values
COPY_A      EQU $F0         ; Copy source A to destination
COPY_B      EQU $CC         ; Copy source B to destination  
COPY_C      EQU $AA         ; Copy source C to destination
OR_AB       EQU $FC         ; A OR B
AND_AB      EQU $C0         ; A AND B
XOR_AB      EQU $3C         ; A XOR B
NOT_A       EQU $0F         ; NOT A
FILL        EQU $FF         ; Fill with all 1s
CLEAR       EQU $00         ; Clear with all 0s

; Cookie-cut operation (mask with C)
; Copy A to D only where C is set
CookieCut:
    ; A0 = source A (image data)
    ; A1 = source C (mask)
    ; A2 = destination
    ; D0 = width in words
    ; D1 = height in lines
    
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Enable channels A, C, and D
    ; Minterm: (A AND C) = $C0
    MOVE.W  #$0DC0, BLTCON0(A6) ; A and C to D, minterm $C0
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Set masks
    MOVE.W  #$FFFF, BLTAFWM(A6)
    MOVE.W  #$FFFF, BLTALWM(A6)
    
    ; Set source A pointer
    MOVE.L  A0, D2
    MOVE.W  D2, BLTAPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTAPTH(A6)
    
    ; Set source C pointer (mask)
    MOVE.L  A1, D2
    MOVE.W  D2, BLTCPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTCPTH(A6)
    
    ; Set destination pointer
    MOVE.L  A2, D2
    MOVE.W  D2, BLTDPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTDPTH(A6)
    
    ; Set modulos
    MOVE.W  #0, BLTAMOD(A6)
    MOVE.W  #0, BLTCMOD(A6)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Start operation
    LSL.W   #6, D1
    OR.W    D0, D1
    MOVE.W  D1, BLTSIZE(A6)
    
    RTS

; Transparent sprite blitting
; Combine sprite with background, preserving transparency
TransparentBlit:
    ; A0 = sprite data
    ; A1 = sprite mask
    ; A2 = background
    ; A3 = destination
    ; D0 = width, D1 = height
    
    ; First pass: Clear sprite area in background
    ; Minterm: B AND (NOT C) = background AND (NOT mask)
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    MOVE.W  #$0C30, BLTCON0(A6) ; B and C to D, minterm $30
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Set background as source B
    MOVE.L  A2, D2
    MOVE.W  D2, BLTBPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTBPTH(A6)
    
    ; Set mask as source C
    MOVE.L  A1, D2
    MOVE.W  D2, BLTCPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTCPTH(A6)
    
    ; Set destination
    MOVE.L  A3, D2
    MOVE.W  D2, BLTDPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTDPTH(A6)
    
    ; Set modulos
    MOVE.W  #0, BLTBMOD(A6)
    MOVE.W  #0, BLTCMOD(A6)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Start first pass
    MOVE.W  D0, D3
    MOVE.W  D1, D4
    LSL.W   #6, D4
    OR.W    D3, D4
    MOVE.W  D4, BLTSIZE(A6)
    
    ; Wait for completion
    BSR     WaitBlitter
    
    ; Second pass: OR in sprite data
    ; Minterm: A OR D = sprite OR cleared_background
    MOVE.W  #$09FA, BLTCON0(A6) ; A and D to D, minterm $FA
    
    ; Set sprite as source A
    MOVE.L  A0, D2
    MOVE.W  D2, BLTAPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTAPTH(A6)
    
    ; Destination reads from itself (source D)
    MOVE.L  A3, D2
    MOVE.W  D2, BLTDPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTDPTH(A6)
    
    ; Set modulos
    MOVE.W  #0, BLTAMOD(A6)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Start second pass
    MOVE.W  D4, BLTSIZE(A6)
    
    RTS

; Pattern fill using Blitter
PatternFill:
    ; Fill area with repeating 16x16 pattern
    ; A0 = pattern data (16x16 bits)
    ; A1 = destination area
    ; D0 = width in words
    ; D1 = height in lines
    
    MOVEM.L D2-D7/A2-A3, -(SP)
    
    ; Fill line by line, repeating pattern
    MOVE.W  D1, D7              ; Line counter
    MOVE.L  A1, A2              ; Destination base
    
PatternFillLoop:
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Calculate pattern line (Y mod 16)
    MOVE.W  D7, D2
    AND.W   #15, D2             ; Pattern Y (0-15)
    LSL.W   #1, D2              ; Convert to word offset
    LEA     (A0,D2.W), A3       ; Pattern line address
    
    ; Setup pattern copy
    MOVE.W  #$09F0, BLTCON0(A6) ; A to D copy
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Set pattern as source
    MOVE.L  A3, D2
    MOVE.W  D2, BLTAPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTAPTH(A6)
    
    ; Set destination line
    MOVE.L  A2, D2
    MOVE.W  D2, BLTDPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTDPTH(A6)
    
    ; Set modulos for pattern repeat
    MOVE.W  #-2, BLTAMOD(A6)    ; Wrap after 1 word
    MOVE.W  #0, BLTDMOD(A6)     ; Contiguous destination
    
    ; Blit one line with pattern repeat
    MOVE.W  D0, D3              ; Width
    LSL.W   #6, D3              ; 1 line
    OR.W    D0, D3              ; Add width
    MOVE.W  D3, BLTSIZE(A6)
    
    ; Next destination line
    ADD.L   #40, A2             ; Next line (40 bytes)
    
    DBF     D7, PatternFillLoop
    
    MOVEM.L (SP)+, D2-D7/A2-A3
    RTS"
  language="assembly"
/>

## Blitter Line Drawing

The Blitter can draw lines using a built-in line algorithm:

<CodeRunner 
  system="commodore-amiga"
  title="Blitter Line Drawing Algorithm"
  code="; High-speed line drawing using Blitter line mode

; Draw line using Blitter line algorithm
BlitterLine:
    ; D0 = X1, D1 = Y1 (start point)
    ; D2 = X2, D3 = Y2 (end point)
    ; A0 = destination bitplane
    
    MOVEM.L D4-D7, -(SP)
    
    ; Calculate deltas
    MOVE.W  D2, D4
    SUB.W   D0, D4              ; DX = X2 - X1
    MOVE.W  D3, D5
    SUB.W   D1, D5              ; DY = Y2 - Y1
    
    ; Determine octant and make deltas positive
    MOVEQ   #0, D6              ; Octant flags
    
    TST.W   D4                  ; DX negative?
    BPL     DXPositive
    NEG.W   D4                  ; Make positive
    BSET    #2, D6              ; Set sign flag
DXPositive:
    
    TST.W   D5                  ; DY negative?
    BPL     DYPositive
    NEG.W   D5                  ; Make positive
    BSET    #1, D6              ; Set sign flag
DYPositive:
    
    ; Check if DY > DX (steep line)
    CMP.W   D4, D5
    BLE     NotSteep
    ; Swap DX and DY for steep lines
    EXG     D4, D5
    BSET    #0, D6              ; Set steep flag
NotSteep:
    
    ; Wait for Blitter
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Calculate starting address
    MOVE.W  D1, D7
    MULU    #40, D7             ; Y * bytes per line
    MOVE.W  D0, D2
    LSR.W   #3, D2              ; X / 8 (byte offset)
    ADD.W   D2, D7              ; Combined offset
    ADD.L   A0, D7              ; Final address
    
    ; Set line mode in BLTCON1
    MOVE.W  #$0001, D3          ; Line mode bit
    AND.W   #7, D0              ; Starting bit position
    LSL.W   #12, D0             ; Shift to BSHIFT position
    OR.W    D0, D3
    
    ; Add octant bits
    LSL.W   #2, D6              ; Shift octant to bits 4-2
    OR.W    D6, D3
    MOVE.W  D3, BLTCON1(A6)
    
    ; Set BLTCON0 for line drawing
    MOVE.W  #$0DCA, BLTCON0(A6) ; Line mode, A+D channels, OR mode
    
    ; Set line texture (solid line)
    MOVE.W  #$8000, BLTAFWM(A6) ; Line texture pattern
    MOVE.W  #$FFFF, BLTALWM(A6) ; Always enabled
    
    ; Calculate line parameters
    ; BLTBMOD = 4 * (DY - DX)
    MOVE.W  D5, D2
    SUB.W   D4, D2
    LSL.W   #2, D2
    MOVE.W  D2, BLTBMOD(A6)
    
    ; BLTAMOD = 4 * DY  
    MOVE.W  D5, D2
    LSL.W   #2, D2
    MOVE.W  D2, BLTAMOD(A6)
    
    ; BLTAPT = 4 * DY - 2 * DX (line error term)
    MOVE.W  D5, D2
    LSL.W   #2, D2              ; 4 * DY
    MOVE.W  D4, D3
    LSL.W   #1, D3              ; 2 * DX
    SUB.W   D3, D2              ; 4*DY - 2*DX
    EXT.L   D2
    MOVE.L  D2, BLTAPTH(A6)     ; Set error term
    
    ; Set destination
    MOVE.L  D7, BLTDPTH(A6)
    
    ; Set modulo
    MOVE.W  #40, BLTDMOD(A6)    ; Bytes per line
    
    ; Start line drawing
    ADDQ.W  #1, D4              ; DX + 1 (line length)
    LSL.W   #6, D4              ; Shift to height position
    OR.W    #$0002, D4          ; Width = 2 (for line mode)
    MOVE.W  D4, BLTSIZE(A6)     ; Start the line!
    
    MOVEM.L (SP)+, D4-D7
    RTS

; Draw circle using line segments
DrawCircle:
    ; D0 = center X, D1 = center Y
    ; D2 = radius
    ; A0 = destination bitplane
    
    MOVEM.L D3-D7/A1, -(SP)
    
    ; Use 32 line segments for smooth circle
    MOVEQ   #31, D7             ; 32 segments
    MOVEQ   #0, D6              ; Angle counter
    
    ; Calculate first point
    MOVE.W  D0, D4              ; Start X = center X + radius
    ADD.W   D2, D4
    MOVE.W  D1, D5              ; Start Y = center Y
    
CircleLoop:
    ; Calculate next point
    ADDQ.W  #8, D6              ; Next angle (8 * 32 = 256 = full circle)
    AND.W   #$FF, D6
    
    ; Get sin/cos from table
    LEA     SineTable, A1
    MOVE.B  (A1,D6.W), D3       ; sin(angle)
    EXT.W   D3
    SUB.W   #128, D3            ; -128 to +127
    MULS    D2, D3              ; Scale by radius
    ASR.L   #7, D3              ; Convert to pixels
    ADD.W   D1, D3              ; Add center Y
    
    MOVE.W  D6, D0
    ADD.W   #64, D0             ; cos = sin(angle + 90)
    AND.W   #$FF, D0
    MOVE.B  (A1,D0.W), D0
    EXT.W   D0
    SUB.W   #128, D0
    MULS    D2, D0
    ASR.L   #7, D0
    ADD.W   D0, D0              ; Add center X (reusing D0, calculate properly)
    
    ; Draw line from previous point to current point
    MOVE.W  D4, D0              ; Previous X
    MOVE.W  D5, D1              ; Previous Y
    ; D0, D3 = current point (calculated above, fix this)
    BSR     BlitterLine
    
    ; Update previous point
    MOVE.W  D0, D4              ; Current becomes previous
    MOVE.W  D3, D5
    
    DBF     D7, CircleLoop
    
    MOVEM.L (SP)+, D3-D7/A1
    RTS

; Sine table for circle calculations
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

## Advanced Blitter Techniques

Implement complex graphics operations for professional applications:

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Blitter Graphics Techniques"
  code="; Advanced Blitter operations for professional graphics

; Area fill using Blitter (flood fill)
BlitterAreaFill:
    ; A0 = bitplane to fill
    ; D0 = X coordinate of seed point
    ; D1 = Y coordinate of seed point
    ; Uses Blitter's area fill mode
    
    MOVEM.L D2-D5, -(SP)
    
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Calculate starting address
    MOVE.W  D1, D2
    MULU    #40, D2             ; Y * bytes per line
    MOVE.W  D0, D3
    LSR.W   #3, D3              ; X / 8
    ADD.W   D3, D2              ; Byte offset
    ADD.L   A0, D2              ; Final address
    
    ; Setup area fill mode
    MOVE.W  #$09F2, BLTCON0(A6) ; A to D, inclusive fill
    MOVE.W  #$0004, BLTCON1(A6) ; Fill mode enabled
    
    ; Set masks for starting bit
    AND.W   #7, D0              ; Starting bit position
    MOVEQ   #7, D3
    SUB.W   D0, D3              ; Bit position (MSB first)
    MOVEQ   #1, D4
    LSL.W   D3, D4              ; Create bit mask
    MOVE.W  D4, BLTAFWM(A6)     ; First word mask
    MOVE.W  #$FFFF, BLTALWM(A6) ; Last word mask
    
    ; Set pointers (A and D point to same place for fill)
    MOVE.L  D2, BLTAPTH(A6)
    MOVE.L  D2, BLTDPTH(A6)
    
    ; Set modulos
    MOVE.W  #0, BLTAMOD(A6)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Start fill (area determined by existing boundary)
    MOVE.W  #$0401, BLTSIZE(A6) ; 1 line, 1 word (fill expands)
    
    MOVEM.L (SP)+, D2-D5
    RTS

; Texture mapping using Blitter
TextureMap:
    ; Simple texture mapping for flat surfaces
    ; A0 = texture data
    ; A1 = destination
    ; D0 = dest width, D1 = dest height
    ; D2 = texture U scale, D3 = texture V scale
    
    MOVEM.L D4-D7/A2-A3, -(SP)
    
    MOVE.W  D1, D7              ; Line counter
    MOVE.L  A1, A2              ; Destination base
    MOVEQ   #0, D6              ; V coordinate
    
TextureMapLoop:
    ; Calculate texture V coordinate
    MOVE.W  D6, D4
    MULU    D3, D4              ; Scale V
    LSR.W   #8, D4              ; Convert from 8.8 fixed
    AND.W   #63, D4             ; Wrap to 64x64 texture
    LSL.W   #3, D4              ; Convert to byte offset (8 bytes/line)
    LEA     (A0,D4.W), A3       ; Texture line
    
    ; Blit texture line with horizontal repeat
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    MOVE.W  #$09F0, BLTCON0(A6) ; A to D copy
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Set texture line as source
    MOVE.L  A3, D4
    MOVE.W  D4, BLTAPTL(A6)
    SWAP    D4
    MOVE.W  D4, BLTAPTH(A6)
    
    ; Set destination
    MOVE.L  A2, D4
    MOVE.W  D4, BLTDPTL(A6)
    SWAP    D4
    MOVE.W  D4, BLTDPTH(A6)
    
    ; Set modulos for texture repeat
    MOVE.W  #-8, BLTAMOD(A6)    ; Wrap after 8 bytes (64 pixels)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Blit line with texture repeat
    MOVE.W  D0, D4              ; Width
    LSL.W   #6, D4              ; 1 line
    OR.W    D0, D4
    MOVE.W  D4, BLTSIZE(A6)
    
    ; Next line
    ADD.L   #40, A2             ; Next destination line
    ADD.W   D3, D6              ; Next V coordinate
    
    DBF     D7, TextureMapLoop
    
    MOVEM.L (SP)+, D4-D7/A2-A3
    RTS

; Blitter queue system for complex operations
BlitterQueue:
    ; Queue multiple Blitter operations for efficiency
    ; A0 = operation queue
    
    MOVEM.L D0-D2/A1-A2, -(SP)
    
    MOVE.L  A0, A1              ; Current operation
    
QueueLoop:
    MOVE.W  (A1)+, D0           ; Operation type
    CMP.W   #-1, D0             ; End marker?
    BEQ     QueueDone
    
    ; Wait for Blitter before starting new operation
    BSR     WaitBlitter
    
    CMP.W   #0, D0              ; Copy operation?
    BEQ     QueueCopy
    CMP.W   #1, D0              ; Fill operation?
    BEQ     QueueFill
    CMP.W   #2, D0              ; Line operation?
    BEQ     QueueLine
    
    BRA     NextQueueOp         ; Unknown operation
    
QueueCopy:
    ; Execute copy from queue data
    MOVE.L  (A1)+, A2           ; Source
    MOVE.L  (A1)+, A3           ; Destination
    MOVE.W  (A1)+, D1           ; Width
    MOVE.W  (A1)+, D2           ; Height
    
    ; Setup and execute copy
    LEA     $DFF000, A6
    MOVE.W  #$09F0, BLTCON0(A6)
    ; ... (complete copy setup)
    
    BRA     NextQueueOp
    
QueueFill:
    ; Execute fill from queue data
    ; ... (implement fill)
    BRA     NextQueueOp
    
QueueLine:
    ; Execute line from queue data
    ; ... (implement line)
    
NextQueueOp:
    BRA     QueueLoop
    
QueueDone:
    MOVEM.L (SP)+, D0-D2/A1-A2
    RTS

; Blitter performance optimization
OptimizeBlitterUsage:
    ; Tips for maximum Blitter performance:
    ; 1. Batch operations to minimize setup overhead
    ; 2. Use DMA-friendly memory layouts
    ; 3. Align data to word boundaries
    ; 4. Minimize CPU-Blitter synchronization
    ; 5. Use appropriate minterms for operations
    
    ; Example: Optimized sprite rendering system
    LEA     SpriteRenderQueue, A0
    MOVEQ   #MAX_SPRITES-1, D7
    
OptimizeLoop:
    ; Check if sprite needs rendering
    MOVE.W  SPRITE_FLAGS(A0), D0
    BTST    #0, D0              ; Visible flag
    BEQ     NextOptSprite
    
    ; Add to Blitter queue instead of immediate render
    BSR     QueueSpriteRender
    
NextOptSprite:
    ADD.L   #SPRITE_SIZE, A0
    DBF     D7, OptimizeLoop
    
    ; Execute entire queue in one batch
    BSR     ExecuteRenderQueue
    
    RTS

; Example queue structure
QueueSpriteRender:
    ; Add sprite render operation to queue
    ; Implementation would add operation data to queue
    RTS

ExecuteRenderQueue:
    ; Execute all queued operations efficiently
    ; Implementation would process queue with minimal waits
    RTS

; Constants and data
MAX_SPRITES         EQU 32
SPRITE_SIZE         EQU 32
SPRITE_FLAGS        EQU 0

SpriteRenderQueue:  DS.B    SPRITE_SIZE * MAX_SPRITES"
  language="assembly"
/>

## Blitter Synchronization and Optimization

Professional applications require efficient Blitter usage:

<CodeRunner 
  system="commodore-amiga"
  title="Blitter Synchronization and Performance"
  code="; Professional Blitter synchronization and optimization

; Interrupt-driven Blitter completion
SetupBlitterInterrupt:
    ; Setup interrupt for Blitter completion
    LEA     $DFF000, A6
    
    ; Enable Blitter interrupt
    MOVE.W  #$C040, $09A(A6)    ; Set BLTDONE in INTENA
    
    ; Install interrupt handler
    LEA     BlitterIntHandler, A0
    MOVE.L  A0, BlitterCompleteVector
    
    RTS

BlitterIntHandler:
    ; Blitter completion interrupt handler
    MOVEM.L A0-A1, -(SP)
    
    ; Clear interrupt
    LEA     $DFF000, A6
    MOVE.W  #$0040, $09C(A6)    ; Clear BLTDONE in INTREQ
    
    ; Signal completion
    MOVE.W  #1, BlitterComplete
    
    ; Start next queued operation if any
    BSR     ProcessBlitterQueue
    
    MOVEM.L (SP)+, A0-A1
    RTE

; Non-blocking Blitter operations
StartBlitterOperation:
    ; Start operation without waiting for completion
    ; A0 = operation parameters
    
    ; Check if Blitter is busy
    LEA     $DFF000, A6
    BTST    #14, $002(A6)       ; DMACON busy bit
    BNE     BlitterBusy
    
    ; Blitter is free, start operation immediately
    BSR     ExecuteBlitterOp
    MOVEQ   #1, D0              ; Success
    RTS
    
BlitterBusy:
    ; Queue operation for later
    BSR     QueueBlitterOp
    MOVEQ   #0, D0              ; Queued
    RTS

; Double-buffered graphics with Blitter
DoubleBufferedBlit:
    ; Efficient double buffering using Blitter
    
    ; Swap front and back buffers
    MOVE.L  FrontBuffer, D0
    MOVE.L  BackBuffer, D1
    MOVE.L  D1, FrontBuffer
    MOVE.L  D0, BackBuffer
    
    ; Update display to show new front buffer
    BSR     UpdateDisplayPointers
    
    ; Clear new back buffer
    MOVE.L  BackBuffer, A0
    BSR     FastClearBuffer
    
    RTS

FastClearBuffer:
    ; Ultra-fast buffer clear using Blitter
    ; A0 = buffer to clear
    
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Setup for fast clear
    MOVE.W  #$0100, BLTCON0(A6) ; D only, clear
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Set destination
    MOVE.L  A0, D0
    MOVE.W  D0, BLTDPTL(A6)
    SWAP    D0
    MOVE.W  D0, BLTDPTH(A6)
    
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Clear entire buffer in one operation
    MOVE.W  #$C828, BLTSIZE(A6) ; 800 lines x 40 words
    
    RTS

; Parallel CPU and Blitter processing
ParallelProcessing:
    ; Demonstrate CPU work while Blitter runs
    
    ; Start Blitter operation (non-blocking)
    LEA     BlitterParams, A0
    BSR     StartBlitterOperation
    
    ; Do CPU work while Blitter runs
    BSR     UpdateGameLogic
    BSR     ProcessAudio
    BSR     HandleInput
    
    ; Check if Blitter finished
    TST.W   BlitterComplete
    BNE     BlitterDone
    
    ; Do more CPU work
    BSR     UpdateAnimations
    BSR     ProcessAI
    
    ; Wait for Blitter if still not done
    BSR     WaitBlitter
    
BlitterDone:
    CLR.W   BlitterComplete
    
    RTS

; Memory-efficient Blitter operations
EfficientMemoryUsage:
    ; Use Blitter to reorganize memory efficiently
    
    ; Compact sprite data
    LEA     SpriteSource, A0
    LEA     SpriteCompact, A1
    
    ; Remove unused sprites using Blitter
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Use Blitter to copy only active sprites
    ; This is more efficient than CPU loops
    MOVE.W  #$09F0, BLTCON0(A6) ; A to D copy
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Set up for sprite compaction
    ; (Implementation would copy active sprites only)
    
    RTS

; Blitter-based data compression
CompressGraphics:
    ; Use Blitter for run-length encoding
    ; A0 = source data
    ; A1 = compressed output
    
    ; Blitter can help with pattern detection
    ; for compression algorithms
    
    ; Example: Use Blitter to find repeated patterns
    MOVEM.L D0-D3/A2-A3, -(SP)
    
    MOVE.L  A0, A2              ; Source
    MOVE.L  A1, A3              ; Destination
    
    ; Use Blitter to compare data blocks
CompressLoop:
    ; Compare current block with next block
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Setup comparison (XOR to find differences)
    MOVE.W  #$0C3C, BLTCON0(A6) ; A XOR B to D
    
    ; Set source A (current block)
    MOVE.L  A2, D0
    MOVE.W  D0, BLTAPTL(A6)
    SWAP    D0
    MOVE.W  D0, BLTAPTH(A6)
    
    ; Set source B (next block)
    MOVE.L  A2, D0
    ADD.L   #16, D0             ; Next block
    MOVE.W  D0, BLTBPTL(A6)
    SWAP    D0
    MOVE.W  D0, BLTBPTH(A6)
    
    ; Set temporary comparison buffer
    MOVE.L  #TempBuffer, D0
    MOVE.W  D0, BLTDPTL(A6)
    SWAP    D0
    MOVE.W  D0, BLTDPTH(A6)
    
    ; Compare 16 bytes
    MOVE.W  #$0404, BLTSIZE(A6) ; 4 lines x 4 words
    
    ; Check result (would need CPU to analyze)
    BSR     WaitBlitter
    BSR     AnalyzeComparison
    
    ADD.L   #16, A2             ; Next block
    ; Continue compression...
    
    MOVEM.L (SP)+, D0-D3/A2-A3
    RTS

AnalyzeComparison:
    ; Analyze Blitter comparison results
    ; Implementation would check for patterns
    RTS

; Data and variables
BlitterComplete:        DC.W    0
BlitterCompleteVector:  DC.L    0
FrontBuffer:            DC.L    0
BackBuffer:             DC.L    0
BlitterParams:          DS.B    32
SpriteSource:           DS.B    1024
SpriteCompact:          DS.B    512
TempBuffer:             DS.B    64

; Helper functions referenced above
UpdateDisplayPointers:
    RTS

UpdateGameLogic:
    RTS

ProcessAudio:
    RTS

HandleInput:
    RTS

UpdateAnimations:
    RTS

ProcessAI:
    RTS

ExecuteBlitterOp:
    RTS

QueueBlitterOp:
    RTS

ProcessBlitterQueue:
    RTS"
  language="assembly"
/>

## Practice Exercise: Create a Blitter Graphics Engine

Build a complete graphics engine using the Blitter:

<CodeRunner 
  system="commodore-amiga"
  title="Practice: Complete Blitter Graphics Engine"
  code="; Create a comprehensive graphics engine using Blitter
; Demonstrates all major Blitter techniques

BlitterGraphicsEngine:
    ; Initialize graphics engine
    BSR     InitGraphicsEngine
    
    ; Create demo scene
    BSR     CreateDemoScene
    
    ; Main rendering loop
EngineLoop:
    BSR     WaitVBlank
    
    ; Clear back buffer
    MOVE.L  BackBuffer, A0
    BSR     FastClearBuffer
    
    ; Render background
    BSR     RenderBackground
    
    ; Render sprites
    BSR     RenderSprites
    
    ; Apply effects
    BSR     ApplyVisualEffects
    
    ; Swap buffers
    BSR     DoubleBufferedBlit
    
    ; Update animation
    MOVE.W  FrameCounter, D0
    ADDQ.W  #1, D0
    MOVE.W  D0, FrameCounter
    
    ; Check exit
    BTST    #6, $BFE001
    BNE     EngineLoop
    
    RTS

InitGraphicsEngine:
    ; Setup double buffering
    MOVE.L  #Buffer1, FrontBuffer
    MOVE.L  #Buffer2, BackBuffer
    
    ; Initialize Blitter interrupt system
    BSR     SetupBlitterInterrupt
    
    ; Create graphics resources
    BSR     CreateTestGraphics
    
    RTS

CreateDemoScene:
    ; Setup demo objects
    LEA     DemoObjects, A0
    
    ; Object 1: Moving rectangle
    MOVE.W  #50, OBJ_X(A0)
    MOVE.W  #50, OBJ_Y(A0)
    MOVE.W  #2, OBJ_VX(A0)
    MOVE.W  #1, OBJ_VY(A0)
    MOVE.W  #OBJ_RECT, OBJ_TYPE(A0)
    
    ; Object 2: Bouncing circle
    ADD.L   #OBJ_SIZE, A0
    MOVE.W  #150, OBJ_X(A0)
    MOVE.W  #100, OBJ_Y(A0)
    MOVE.W  #3, OBJ_VX(A0)
    MOVE.W  #2, OBJ_VY(A0)
    MOVE.W  #OBJ_CIRCLE, OBJ_TYPE(A0)
    
    ; Object 3: Textured polygon
    ADD.L   #OBJ_SIZE, A0
    MOVE.W  #200, OBJ_X(A0)
    MOVE.W  #80, OBJ_Y(A0)
    MOVE.W  #1, OBJ_VX(A0)
    MOVE.W  #3, OBJ_VY(A0)
    MOVE.W  #OBJ_TEXTURE, OBJ_TYPE(A0)
    
    RTS

RenderBackground:
    ; Scrolling background using Blitter
    MOVE.W  FrameCounter, D0
    AND.W   #$1FF, D0           ; Scroll cycle
    
    ; Use Blitter to copy background with offset
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    MOVE.W  #$09F0, BLTCON0(A6) ; A to D copy
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Calculate background offset
    LEA     BackgroundData, A0
    MOVE.W  D0, D1
    LSR.W   #2, D1              ; Slow scroll
    ADD.W   D1, A0              ; Offset into background
    
    ; Set source
    MOVE.L  A0, D1
    MOVE.W  D1, BLTAPTL(A6)
    SWAP    D1
    MOVE.W  D1, BLTAPTH(A6)
    
    ; Set destination
    MOVE.L  BackBuffer, D1
    MOVE.W  D1, BLTDPTL(A6)
    SWAP    D1
    MOVE.W  D1, BLTDPTH(A6)
    
    ; Set modulos for wrap-around
    MOVE.W  #0, BLTAMOD(A6)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Copy background
    MOVE.W  #$C828, BLTSIZE(A6) ; Full screen
    
    RTS

RenderSprites:
    ; Render all demo objects
    LEA     DemoObjects, A0
    MOVEQ   #2, D7              ; 3 objects
    
RenderObjectLoop:
    ; Update object position
    MOVE.W  OBJ_X(A0), D0
    ADD.W   OBJ_VX(A0), D0
    MOVE.W  D0, OBJ_X(A0)
    
    MOVE.W  OBJ_Y(A0), D1
    ADD.W   OBJ_VY(A0), D1
    MOVE.W  D1, OBJ_Y(A0)
    
    ; Bounce off edges
    CMP.W   #300, D0
    BLT     NoRightBounce
    NEG.W   OBJ_VX(A0)
NoRightBounce:
    TST.W   D0
    BPL     NoLeftBounce
    NEG.W   OBJ_VX(A0)
NoLeftBounce:
    
    CMP.W   #180, D1
    BLT     NoBottomBounce
    NEG.W   OBJ_VY(A0)
NoBottomBounce:
    TST.W   D1
    BPL     NoTopBounce
    NEG.W   OBJ_VY(A0)
NoTopBounce:
    
    ; Render based on type
    MOVE.W  OBJ_TYPE(A0), D2
    CMP.W   #OBJ_RECT, D2
    BEQ     RenderRect
    CMP.W   #OBJ_CIRCLE, D2
    BEQ     RenderCircle
    CMP.W   #OBJ_TEXTURE, D2
    BEQ     RenderTexture
    
    BRA     NextObject
    
RenderRect:
    BSR     BlitterDrawRect
    BRA     NextObject
    
RenderCircle:
    BSR     BlitterDrawCircle
    BRA     NextObject
    
RenderTexture:
    BSR     BlitterDrawTexture
    
NextObject:
    ADD.L   #OBJ_SIZE, A0
    DBF     D7, RenderObjectLoop
    
    RTS

BlitterDrawRect:
    ; Draw filled rectangle using Blitter
    ; D0 = X, D1 = Y
    
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Calculate destination address
    MOVE.L  BackBuffer, A1
    MOVE.W  D1, D2
    MULU    #40, D2
    MOVE.W  D0, D3
    LSR.W   #3, D3
    ADD.W   D3, D2
    ADD.L   D2, A1
    
    ; Setup fill operation
    MOVE.W  #$09F0, BLTCON0(A6) ; A to D
    MOVE.W  #$0000, BLTCON1(A6)
    
    ; Set pattern
    MOVE.L  #RectPattern, D2
    MOVE.W  D2, BLTAPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTAPTH(A6)
    
    ; Set destination
    MOVE.L  A1, D2
    MOVE.W  D2, BLTDPTL(A6)
    SWAP    D2
    MOVE.W  D2, BLTDPTH(A6)
    
    ; Set modulos
    MOVE.W  #-2, BLTAMOD(A6)    ; Repeat pattern
    MOVE.W  #36, BLTDMOD(A6)    ; Next line
    
    ; Draw 20x20 rectangle
    MOVE.W  #$1404, BLTSIZE(A6) ; 20 lines x 4 words
    
    RTS

BlitterDrawCircle:
    ; Draw circle using line segments
    MOVE.W  #20, D2             ; Radius
    MOVE.L  BackBuffer, A1
    BSR     DrawCircle          ; From earlier example
    RTS

BlitterDrawTexture:
    ; Draw textured quad
    LEA     TextureData, A1
    MOVE.L  BackBuffer, A2
    MOVE.W  #32, D2             ; Width
    MOVE.W  #32, D3             ; Height
    MOVE.W  #$0100, D4          ; U scale
    MOVE.W  #$0100, D5          ; V scale
    BSR     TextureMap          ; From earlier example
    RTS

ApplyVisualEffects:
    ; Apply post-processing effects
    
    ; Effect 1: Motion blur trails
    BSR     CreateMotionTrails
    
    ; Effect 2: Screen distortion
    BSR     ApplyDistortion
    
    RTS

CreateMotionTrails:
    ; Blend current frame with previous
    BSR     WaitBlitter
    LEA     $DFF000, A6
    
    ; Blend operation: (Current AND $F0F0) OR (Previous AND $0F0F)
    MOVE.W  #$0DCA, BLTCON0(A6) ; A, C, and D channels
    
    ; Use pattern for masking
    MOVE.L  #BlendMask, D0
    MOVE.L  D0, BLTAPTH(A6)     ; Mask pattern
    
    MOVE.L  PreviousFrame, D0
    MOVE.L  D0, BLTCPTH(A6)     ; Previous frame
    
    MOVE.L  BackBuffer, D0
    MOVE.L  D0, BLTDPTH(A6)     ; Current frame (read and write)
    
    ; Set modulos
    MOVE.W  #0, BLTAMOD(A6)
    MOVE.W  #0, BLTCMOD(A6)
    MOVE.W  #0, BLTDMOD(A6)
    
    ; Apply to full screen
    MOVE.W  #$C828, BLTSIZE(A6)
    
    ; Copy current to previous for next frame
    BSR     WaitBlitter
    MOVE.L  BackBuffer, A0
    MOVE.L  PreviousFrame, A1
    MOVE.W  #40, D0             ; Width
    MOVE.W  #200, D1            ; Height
    BSR     BlitterCopy
    
    RTS

ApplyDistortion:
    ; Simple wave distortion effect
    MOVE.W  FrameCounter, D0
    AND.W   #$1F, D0            ; Distortion phase
    
    ; Use Blitter to shift lines horizontally
    ; (Implementation would distort each line)
    
    RTS

; Object structure
    RSRESET
OBJ_X       RS.W    1
OBJ_Y       RS.W    1
OBJ_VX      RS.W    1
OBJ_VY      RS.W    1
OBJ_TYPE    RS.W    1
OBJ_SIZE    RS.W    0

; Object types
OBJ_RECT    EQU 1
OBJ_CIRCLE  EQU 2
OBJ_TEXTURE EQU 3

; Data
FrameCounter:       DC.W    0
Buffer1:            DS.B    8000
Buffer2:            DS.B    8000
PreviousFrame:      DS.B    8000
DemoObjects:        DS.B    OBJ_SIZE * 8
BackgroundData:     DS.B    16000    ; Scrolling background
TextureData:        DS.B    2048     ; 64x64 texture
RectPattern:        DS.B    8        ; Rectangle fill pattern
BlendMask:          DS.B    8        ; Blending mask pattern

; Run the graphics engine!
BSR     BlitterGraphicsEngine"
  language="assembly"
/>

## What You've Learned

In this lesson, you've mastered the Blitter coprocessor:

- **Blitter architecture** with DMA channels and logical operations
- **Basic operations** including copy, fill, and clear functions  
- **Logical operations** using minterms for complex graphics effects
- **Line drawing** with the Blitter's built-in line algorithm
- **Advanced techniques** including area fill, texture mapping, and optimization
- **Professional synchronization** for maximum performance
- **Complete graphics engines** using all Blitter capabilities

## Looking Ahead

Next, you'll learn advanced bitplane manipulation techniques. You'll discover how to combine the Blitter with sophisticated bitplane operations to create stunning visual effects that showcase the full power of the Amiga's graphics architecture!

## Fun Fact

The Blitter was so advanced that it could perform operations faster than the CPU could set them up! This led to the development of "Blitter queues" where programmers would prepare multiple operations in advance. The Blitter's logical operations were so flexible that creative programmers discovered ways to use it for non-graphics tasks like data compression, memory copying, and even mathematical calculations. The Blitter's influence can be seen in modern GPUs, which use similar concepts of parallel processing and programmable operations. In fact, the Blitter was one of the first examples of what we now call "compute shaders" - using graphics hardware for general-purpose computing!