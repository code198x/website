---
title: "Copper Programming Fundamentals"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 18
description: "Discover the power of the Amiga's Copper coprocessor. Learn how to create stunning visual effects by programming the Copper to change display parameters in sync with the video beam, enabling effects impossible on other platforms."
learning_objectives:
  - "Understand the Copper's role in the Amiga's graphics system"
  - "Master Copper instruction format and timing"
  - "Learn to synchronize changes with the video beam"
  - "Create basic Copper lists for display effects"
  - "Implement color bars and raster effects"
concepts:
  - "Copper coprocessor architecture"
  - "WAIT and MOVE instructions"
  - "Video beam synchronization"
  - "Copper list programming"
  - "Raster timing and effects"
estimated_duration: "45-60 minutes"
difficulty: "intermediate"
code_examples: true
practical_exercise: true
order: 18
---

# Lesson 18: Copper Programming Fundamentals

Welcome to one of the Amiga's most revolutionary features - the Copper coprocessor! The Copper gives you precise control over the display, allowing you to change any hardware register at any point on the screen. This enables effects that were impossible on other home computers.

## What Is the Copper?

The Copper (coprocessor) is a simple but powerful programmable device that can:
- **Wait** for specific screen positions
- **Move** data into hardware registers
- Execute these operations in perfect sync with the video beam

This synchronization enables:
- Color changes at any scan line
- Resolution changes mid-screen
- Sprite repositioning during display
- Complex visual effects with zero CPU overhead

## Copper Instruction Format

The Copper has just three instruction types:

### WAIT Instruction
Waits for the video beam to reach a specific position:
```text
Bit 0: Always 1 (identifies WAIT instruction)
Bits 1-7: Horizontal position comparison enable
Bits 8-15: Horizontal beam position to wait for
Bits 16-22: Vertical position comparison enable  
Bits 24-31: Vertical beam position to wait for
```

### MOVE Instruction
Moves data into a hardware register:
```text
Bit 0: Always 0 (identifies MOVE instruction)
Bits 1-8: Register address (offset from $DFF000)
Bits 16-31: Data to write to register
```

### SKIP Instruction
Skips next instruction if beam position test fails (advanced use).

<CodeRunner 
  system="commodore-amiga"
  title="Basic Copper List Structure"
  code="; Understanding Copper list format
; Each Copper instruction is 32 bits (2 words)

; Example Copper list in memory
CopperList:
    ; WAIT for line 100 ($64)
    DC.W    $6401, $FFFE    ; VP=$64, HP=$01, wait enabled
    
    ; MOVE red color to background
    DC.W    $0180, $0F00    ; Register $180 (COLOR00), Data=$0F00
    
    ; WAIT for line 150 ($96)
    DC.W    $9601, $FFFE    ; VP=$96, HP=$01
    
    ; MOVE green color to background
    DC.W    $0180, $00F0    ; Register $180 (COLOR00), Data=$00F0
    
    ; WAIT for line 200 ($C8)
    DC.W    $C801, $FFFE    ; VP=$C8, HP=$01
    
    ; MOVE blue color to background
    DC.W    $0180, $000F    ; Register $180 (COLOR00), Data=$000F
    
    ; End of Copper list
    DC.W    $FFFF, $FFFE    ; Wait for impossible position

; Activate the Copper list
ActivateCopper:
    LEA     $DFF000, A6
    
    ; Set Copper list pointer
    MOVE.L  #CopperList, $080(A6)  ; COP1LCH/COP1LCL
    
    ; Start Copper
    MOVE.W  $088(A6), D0           ; COPJMP1 - restart Copper
    
    RTS"
  language="assembly"
/>

## Understanding Video Timing

To program the Copper effectively, you need to understand video timing:

<CodeRunner 
  system="commodore-amiga"
  title="Video Beam Timing Demonstration"
  code="; Video timing constants for PAL Amiga
; Screen coordinates and timing

; Vertical positions (PAL)
VBLANK_START    EQU $00     ; Line 0 - Start of vertical blank
DISPLAY_START   EQU $2C     ; Line 44 - First visible line  
DISPLAY_END     EQU $12C    ; Line 300 - Last visible line
VBLANK_END      EQU $138    ; Line 312 - End of frame

; Horizontal positions  
HBLANK_START    EQU $00     ; Position 0 - Start of line
DISPLAY_START_H EQU $81     ; Position 129 - First visible pixel
DISPLAY_END_H   EQU $C1     ; Position 193 - Last visible pixel
HBLANK_END      EQU $E3     ; Position 227 - End of line

; Create Copper list with timing markers
TimingDemo:
    ; Wait for start of display
    DC.W    $2C01, $FFFE    ; Line 44, Position 1
    
    ; Set initial background color
    DC.W    $0180, $0000    ; Black background
    
    ; Demonstrate horizontal timing
    DC.W    $5081, $FFFE    ; Line 80, Start of visible area
    DC.W    $0180, $00F0    ; Green at left edge
    
    DC.W    $50A0, $FFFE    ; Line 80, Middle of line
    DC.W    $0180, $0F00    ; Red in middle
    
    DC.W    $50C1, $FFFE    ; Line 80, End of visible area
    DC.W    $0180, $000F    ; Blue at right edge
    
    ; Show vertical divisions
    DC.W    $8001, $FFFE    ; Line 128 (middle of screen)
    DC.W    $0180, $0FFF    ; White
    
    DC.W    $8101, $FFFE    ; Line 129
    DC.W    $0180, $0000    ; Back to black
    
    DC.W    $FFFF, $FFFE    ; End of list

; Helper to visualize timing
ShowBeamPosition:
    LEA     $DFF000, A6
    
    ; Read current beam position
    MOVE.W  $004(A6), D0    ; VPOSR (high bits of vertical)
    LSL.W   #8, D0
    MOVE.W  $006(A6), D1    ; VHPOSR (low bits and horizontal)
    MOVE.W  D1, D2
    AND.W   #$FF, D1        ; Isolate vertical low bits
    OR.W    D1, D0          ; D0 = complete vertical position
    
    LSR.W   #8, D2          ; D2 = horizontal position
    
    ; D0 = vertical position (0-312)
    ; D2 = horizontal position (0-227)
    
    RTS"
  language="assembly"
/>

## Creating Color Bar Effects

One of the most common Copper effects is color bars:

<CodeRunner 
  system="commodore-amiga"
  title="Classic Copper Color Bars"
  code="; Create classic Amiga color bar effect

CreateColorBars:
    LEA     ColorBarList, A0
    MOVE.W  #$2C01, (A0)+   ; Start after vertical blank
    MOVE.W  #$FFFE, (A0)+
    
    ; Generate 16 color bars
    MOVE.W  #15, D7         ; 16 bars (0-15)
    MOVE.W  #$2C, D0        ; Starting line
    
ColorBarLoop:
    ; Calculate color gradient
    MOVE.W  D7, D1
    LSL.W   #8, D1          ; Shift to middle nibble
    LSL.W   #4, D1          ; Create gradient
    OR.W    D7, D1          ; Add to create color
    
    ; Wait for next bar position
    ADD.W   #12, D0         ; 12 lines per bar
    MOVE.B  D0, D2
    LSL.W   #8, D2
    OR.W    #$01, D2        ; Horizontal position 1
    MOVE.W  D2, (A0)+       ; Store wait position
    MOVE.W  #$FFFE, (A0)+
    
    ; Set background color
    MOVE.W  #$0180, (A0)+   ; COLOR00 register
    MOVE.W  D1, (A0)+       ; Color value
    
    DBF     D7, ColorBarLoop
    
    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Activate the list
    LEA     $DFF000, A6
    MOVE.L  #ColorBarList, $080(A6)
    MOVE.W  $088(A6), D0    ; COPJMP1
    
    RTS

; Create smooth gradient effect
SmoothGradient:
    LEA     GradientList, A0
    
    ; Start at line 44
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Create gradient for each scan line
    MOVE.W  #$2C, D0        ; Start line
    MOVE.W  #0, D1          ; Start color (black)
    
GradientLoop:
    ; Wait for line
    MOVE.B  D0, D2
    LSL.W   #8, D2
    OR.W    #$01, D2
    MOVE.W  D2, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Set color with smooth transition
    MOVE.W  #$0180, (A0)+
    MOVE.W  D1, (A0)+
    
    ; Increment color components
    ADD.W   #$0011, D1      ; Increment red and blue
    
    ; Next line
    ADDQ.W  #1, D0
    CMP.W   #$12C, D0       ; End of display?
    BLT     GradientLoop
    
    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    RTS

; Data buffers
ColorBarList:   DS.B    256     ; Space for color bar copper list
GradientList:   DS.B    1024    ; Space for gradient copper list"
  language="assembly"
/>

## Dynamic Copper Effects

The Copper can create dynamic effects by modifying multiple registers:

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Copper Effects"
  code="; Create complex Copper effects

; Plasma-like effect using Copper
PlasmaEffect:
    LEA     PlasmaList, A0
    
    ; Initialize effect parameters
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Generate plasma pattern
    MOVE.W  #$2C, D0        ; Start line
    MOVE.W  #0, D6          ; Phase offset
    
PlasmaLoop:
    ; Wait for line
    MOVE.B  D0, D1
    LSL.W   #8, D1
    OR.W    #$01, D1
    MOVE.W  D1, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Calculate plasma color
    MOVE.W  D0, D1          ; Use line number
    ADD.W   D6, D1          ; Add phase
    AND.W   #$3F, D1        ; Keep in range
    
    ; Create color from sine table
    LEA     SineTable, A1
    MOVE.B  (A1,D1.W), D2   ; Get sine value
    LSL.W   #4, D2          ; Scale up
    
    ; Set color
    MOVE.W  #$0180, (A0)+
    MOVE.W  D2, (A0)+
    
    ; Next line
    ADDQ.W  #1, D0
    CMP.W   #$C8, D0        ; Check limit
    BLT     PlasmaLoop
    
    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    RTS

; Split screen effect - different modes on same screen
SplitScreen:
    LEA     SplitList, A0
    
    ; Top section - Lowres 4 colors
    DC.W    $2C01, $FFFE    ; Line 44
    DC.W    $0100, $1200    ; BPLCON0: 1 bitplane, color
    DC.W    $0180, $0000    ; Background black
    DC.W    $0182, $0F00    ; Color 1 red
    
    ; Middle section - Hires 2 colors
    DC.W    $8001, $FFFE    ; Line 128
    DC.W    $0100, $8200    ; BPLCON0: Hires, 1 bitplane
    DC.W    $0180, $0008    ; Dark blue background
    DC.W    $0182, $0FFF    ; White foreground
    
    ; Bottom section - 16 colors
    DC.W    $C801, $FFFE    ; Line 200
    DC.W    $0100, $4200    ; BPLCON0: 4 bitplanes
    ; Set up 16-color palette
    DC.W    $0180, $0000    ; Color 0
    DC.W    $0182, $0F00    ; Color 1
    DC.W    $0184, $00F0    ; Color 2
    DC.W    $0186, $000F    ; Color 3
    ; ... continue for all 16 colors
    
    DC.W    $FFFF, $FFFE    ; End
    
    RTS

; Horizontal scrolling per line
CopperScroll:
    LEA     ScrollList, A0
    
    ; Create wave scroll effect
    MOVE.W  #$2C, D0        ; Start line
    MOVE.W  #0, D6          ; Initial phase
    
ScrollLoop:
    ; Wait for line
    MOVE.B  D0, D1
    LSL.W   #8, D1
    OR.W    #$01, D1
    MOVE.W  D1, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Calculate scroll offset
    MOVE.W  D0, D1
    SUB.W   #$2C, D1        ; Relative line
    ADD.W   D6, D1          ; Add phase
    AND.W   #$1F, D1        ; Keep in range
    
    ; Use sine for smooth wave
    LEA     SineTable, A1
    MOVE.B  (A1,D1.W), D2
    LSR.B   #4, D2          ; Scale to 0-15
    
    ; Set horizontal scroll
    MOVE.W  #$0102, (A0)+   ; BPLCON1
    MOVE.W  D2, (A0)+       ; Scroll value
    
    ; Next line
    ADDQ.W  #2, D0          ; Every other line
    CMP.W   #$12C, D0
    BLT     ScrollLoop
    
    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    RTS

; Sine table for effects
SineTable:
    DC.B    $80,$8C,$98,$A4,$B0,$BB,$C6,$D0
    DC.B    $DA,$E3,$EB,$F3,$FA,$FF,$FF,$FF
    DC.B    $FF,$FF,$FF,$FA,$F3,$EB,$E3,$DA
    DC.B    $D0,$C6,$BB,$B0,$A4,$98,$8C,$80
    DC.B    $74,$68,$5C,$50,$45,$3A,$30,$26
    DC.B    $1D,$15,$0D,$06,$01,$00,$00,$00
    DC.B    $00,$00,$01,$06,$0D,$15,$1D,$26
    DC.B    $30,$3A,$45,$50,$5C,$68,$74,$80

; Data buffers
PlasmaList:     DS.B    512
SplitList:      DS.B    256
ScrollList:     DS.B    1024"
  language="assembly"
/>

## Copper and CPU Synchronization

Coordinate Copper effects with CPU processing:

<CodeRunner 
  system="commodore-amiga"
  title="Copper-CPU Synchronization"
  code="; Synchronize Copper with CPU for advanced effects

; Double-buffered Copper lists
CopperDoubleBuffer:
    ; Initialize two Copper lists
    BSR     InitCopperList1
    BSR     InitCopperList2
    
    ; Set initial active list
    MOVE.L  #CopperList1, ActiveCopperList
    MOVE.L  #CopperList2, BuildCopperList
    
    RTS

; Update Copper list during vertical blank
UpdateCopperSync:
    ; Wait for vertical blank
    LEA     $DFF000, A6
VBWait:
    MOVE.W  $004(A6), D0    ; VPOSR
    AND.W   #$1FF00, D0
    CMP.W   #$13000, D0     ; Line 304?
    BNE     VBWait
    
    ; Swap Copper lists
    MOVE.L  ActiveCopperList, D0
    MOVE.L  BuildCopperList, D1
    MOVE.L  D1, ActiveCopperList
    MOVE.L  D0, BuildCopperList
    
    ; Activate new list
    MOVE.L  ActiveCopperList, $080(A6)  ; COP1LC
    MOVE.W  $088(A6), D0                ; COPJMP1
    
    RTS

; Generate dynamic Copper list
GenerateDynamicCopper:
    ; A0 = Copper list to build
    ; D0 = Frame counter for animation
    
    MOVE.L  BuildCopperList, A0
    
    ; Initial wait
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Generate animated bars
    MOVE.W  #7, D7          ; 8 bars
    MOVE.W  D0, D6          ; Frame counter
    AND.W   #$1F, D6        ; Animation phase
    
AnimBarLoop:
    ; Calculate bar position
    MOVE.W  D7, D1
    LSL.W   #4, D1          ; Bar spacing
    ADD.W   #$30, D1        ; Base position
    ADD.W   D6, D1          ; Add animation
    
    ; Wait for line
    MOVE.B  D1, D2
    LSL.W   #8, D2
    OR.W    #$01, D2
    MOVE.W  D2, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Set color based on bar number
    MOVE.W  #$0180, (A0)+
    MOVE.W  D7, D3
    LSL.W   #8, D3
    LSL.W   #4, D3
    MOVE.W  D3, (A0)+
    
    DBF     D7, AnimBarLoop
    
    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    RTS

; Copper interrupt handling
SetupCopperInterrupt:
    ; Set Copper interrupt at specific line
    LEA     InterruptList, A0
    
    ; Wait for line 100
    DC.W    $6401, $FFFE
    
    ; Trigger interrupt by writing to INTREQ
    DC.W    $009C, $8010    ; Set COPER bit in INTREQ
    
    ; Continue with display changes
    DC.W    $0180, $0F00    ; Red background
    
    ; Wait for line 200
    DC.W    $C801, $FFFE
    
    ; Another interrupt
    DC.W    $009C, $8010
    DC.W    $0180, $000F    ; Blue background
    
    DC.W    $FFFF, $FFFE
    
    ; Install interrupt handler
    LEA     $DFF000, A6
    MOVE.W  #$4010, $09A(A6)    ; INTENA - Enable Copper interrupt
    
    ; Set interrupt vector (in supervisor mode)
    LEA     CopperIntHandler, A0
    MOVE.L  A0, $6C             ; Level 3 interrupt vector
    
    RTS

; Copper interrupt handler
CopperIntHandler:
    MOVEM.L D0-D1/A0-A1, -(SP)
    
    ; Clear interrupt
    LEA     $DFF000, A6
    MOVE.W  #$0010, $09C(A6)    ; Clear COPER bit
    
    ; Do something useful
    ; For example, update animation counters
    ADDQ.W  #1, AnimationFrame
    
    MOVEM.L (SP)+, D0-D1/A0-A1
    RTE

; Data
ActiveCopperList:   DC.L    0
BuildCopperList:    DC.L    0
AnimationFrame:     DC.W    0

CopperList1:        DS.B    1024
CopperList2:        DS.B    1024
InterruptList:      DS.B    256"
  language="assembly"
/>

## Practice Exercise: Create a Copper Demo

Build a complete Copper effects demonstration:

<CodeRunner 
  system="commodore-amiga"
  title="Practice: Complete Copper Demo"
  code="; Create an impressive Copper effects demo
; Combine multiple techniques

CopperDemo:
    ; Initialize system
    BSR     SystemInit
    
    ; Create main demo Copper list
    BSR     BuildDemoList
    
    ; Main loop
DemoMainLoop:
    ; Wait for vertical blank
    BSR     WaitVBlank
    
    ; Update animation
    MOVE.W  FrameCounter, D0
    ADDQ.W  #1, D0
    MOVE.W  D0, FrameCounter
    
    ; Cycle through effects
    MOVE.W  D0, D1
    LSR.W   #8, D1          ; Change effect every 256 frames
    AND.W   #3, D1          ; 4 effects
    
    CMP.W   #0, D1
    BEQ     ShowRainbow
    CMP.W   #1, D1
    BEQ     ShowPlasma
    CMP.W   #2, D1
    BEQ     ShowSplitScreen
    BRA     ShowWaveScroll
    
ShowRainbow:
    BSR     CreateRainbowBars
    BRA     ContinueDemo
    
ShowPlasma:
    BSR     CreatePlasmaEffect
    BRA     ContinueDemo
    
ShowSplitScreen:
    BSR     CreateSplitScreen
    BRA     ContinueDemo
    
ShowWaveScroll:
    BSR     CreateWaveScroll
    
ContinueDemo:
    ; Check exit
    BTST    #6, $BFE001     ; Left mouse button
    BNE     DemoMainLoop
    
    RTS

; Rainbow bars with movement
CreateRainbowBars:
    LEA     DemoList, A0
    
    ; Initial setup
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Get animation offset
    MOVE.W  FrameCounter, D6
    AND.W   #$3F, D6
    
    ; Create moving rainbow
    MOVE.W  #15, D7         ; 16 colors
    MOVE.W  #$30, D0        ; Start position
    
RainbowLoop:
    ; Calculate animated position
    MOVE.W  D0, D1
    ADD.W   D6, D1          ; Add animation
    CMP.W   #$12C, D1       ; Wrap if needed
    BLT     RainbowOK
    SUB.W   #$100, D1
RainbowOK:
    
    ; Wait instruction
    MOVE.B  D1, D2
    LSL.W   #8, D2
    OR.W    #$01, D2
    MOVE.W  D2, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Calculate rainbow color
    MOVE.W  D7, D3
    ; Red component
    MOVE.W  D3, D4
    AND.W   #4, D4
    LSL.W   #6, D4
    ; Green component  
    MOVE.W  D3, D5
    AND.W   #2, D5
    LSL.W   #3, D5
    OR.W    D5, D4
    ; Blue component
    MOVE.W  D3, D5
    AND.W   #1, D5
    OR.W    D5, D4
    
    ; Brighten the color
    LSL.W   #4, D4
    OR.W    #$0888, D4
    
    ; Set color
    MOVE.W  #$0180, (A0)+
    MOVE.W  D4, (A0)+
    
    ; Next bar
    ADD.W   #8, D0
    DBF     D7, RainbowLoop
    
    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Activate
    LEA     $DFF000, A6
    MOVE.L  #DemoList, $080(A6)
    MOVE.W  $088(A6), D0
    
    RTS

; Wave scroll effect
CreateWaveScroll:
    LEA     DemoList, A0
    
    ; Setup
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Initial colors
    MOVE.W  #$0180, (A0)+
    MOVE.W  #$0048, (A0)+   ; Dark blue background
    MOVE.W  #$0182, (A0)+
    MOVE.W  #$08CF, (A0)+   ; Light blue text
    
    ; Create wave effect
    MOVE.W  FrameCounter, D6
    LSR.W   #2, D6          ; Slow down animation
    
    MOVE.W  #$30, D0        ; Start line
WaveLoop:
    ; Wait for line
    MOVE.B  D0, D1
    LSL.W   #8, D1
    OR.W    #$01, D1
    MOVE.W  D1, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Calculate wave offset
    MOVE.W  D0, D2
    ADD.W   D6, D2          ; Add animation
    AND.W   #$3F, D2        ; Keep in table range
    
    LEA     SineTable, A1
    MOVE.B  (A1,D2.W), D3
    LSR.B   #4, D3          ; Scale to 0-15
    
    ; Apply to horizontal scroll
    MOVE.W  #$0102, (A0)+   ; BPLCON1
    LSL.W   #4, D3          ; Duplicate for both playfields
    OR.W    D3, D3
    MOVE.W  D3, (A0)+
    
    ; Also modulate color
    MOVE.W  #$0180, (A0)+
    MOVE.W  D2, D4
    LSL.W   #2, D4
    ADD.W   #$0048, D4
    MOVE.W  D4, (A0)+
    
    ; Next line
    ADDQ.W  #2, D0
    CMP.W   #$100, D0
    BLT     WaveLoop
    
    ; End
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+
    
    ; Activate
    LEA     $DFF000, A6
    MOVE.L  #DemoList, $080(A6)
    MOVE.W  $088(A6), D0
    
    RTS

; Build initial demo list
BuildDemoList:
    ; Start with simple gradient
    BSR     SmoothGradient
    RTS

; Data
FrameCounter:   DC.W    0
DemoList:       DS.B    2048    ; Large buffer for complex lists

; Run the demo
BSR     CopperDemo"
  language="assembly"
/>

## What You've Learned

In this lesson, you've mastered Copper programming fundamentals:

- **Copper architecture** and its role in the Amiga's graphics system
- **WAIT and MOVE instructions** for synchronized hardware control
- **Video beam timing** and how to target specific screen positions
- **Color bar effects** and smooth gradients using the Copper
- **Dynamic effects** including plasma, split screens, and wave scrolling
- **CPU-Copper synchronization** for complex animated effects
- **Copper interrupts** for advanced timing control

## Looking Ahead

Next, you'll explore advanced Copper techniques including copper-controlled sprites, display list tricks, and how to create "impossible" effects by changing display parameters mid-scanline. The Copper's power goes far beyond simple color changes!

## Fun Fact

The Copper was so revolutionary that it single-handedly enabled the Amiga demoscene. Programmers discovered they could use the Copper to create effects that seemed to break the laws of physics - more than 8 sprites on a line, infinite colors, and even primitive 3D effects, all without using any CPU time! The famous "Boing Ball" demo that sold thousands of Amigas was largely a Copper effect. Even today, modern graphics programmers study Copper techniques to understand display synchronization and raster effects.