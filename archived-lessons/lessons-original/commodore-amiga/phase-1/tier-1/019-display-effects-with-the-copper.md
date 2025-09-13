---
title: "Display Effects with the Copper"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 19
description: "Master advanced Copper techniques to create stunning display effects. Learn to manipulate sprites, create plasma effects, implement smooth scrolling, and push the Amiga's display capabilities beyond their intended limits."
learning_objectives:
  - "Create advanced raster effects using Copper timing"
  - "Implement smooth multi-directional scrolling"
  - "Master sprite multiplexing with the Copper"
  - "Build complex plasma and interference patterns"
  - "Combine multiple effects for professional demos"
concepts:
  - "Advanced Copper timing techniques"
  - "Sprite multiplexing and repositioning"
  - "Multi-playfield effects"
  - "Plasma and interference patterns"
  - "Professional demo effects"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 19
---

# Lesson 19: Display Effects with the Copper

**See how the Copper creates precise display synchronization with perfect timing:**

```assembly
; This creates multiple sprites moving in formation while changing
; hundreds of colours per frame - the Copper's precise timing makes it possible

SpriteMultiplex:
    MOVE.W  #$4001, (A0)+   ; Wait for line 64
    MOVE.W  #$FFFE, (A0)+
    MOVE.L  #SpriteData2, $DFF120  ; Reposition sprite 0
    ; 8 sprites become many more through Copper repositioning!

PlasmaColors:
    MOVE.W  #$0180, (A0)+   ; Change background colour
    MOVE.W  D7, (A0)+       ; Many colour changes per frame
```

That's the power of **advanced Copper programming** - creating display effects with perfect synchronization! Today you'll learn these techniques to create impressive visual effects for your Copper Dreams game.

## Advanced Raster Effects

The Copper's precise timing enables effects impossible on other platforms:

**Advanced Raster Bar Techniques:**

```assembly
; Create smooth raster bars with sub-line precision

RasterBars:
    LEA     RasterList, A0

    ; Initialize with black background
    MOVE.W  #$2C01, (A0)+   ; Start of display
    MOVE.W  #$FFFE, (A0)+
    MOVE.W  #$0180, (A0)+   ; COLOR00
    MOVE.W  #$0000, (A0)+   ; Black

    ; Create 3 moving raster bars
    MOVE.W  FrameCounter, D6

    ; Bar 1 - Red gradient
    MOVE.W  D6, D0
    AND.W   #$FF, D0        ; Keep in range
    ADD.W   #$40, D0        ; Start position
    BSR     CreateGradientBar

    ; Bar 2 - Green gradient (offset)
    MOVE.W  D6, D0
    LSR.W   #1, D0          ; Different speed
    AND.W   #$FF, D0
    ADD.W   #$80, D0
    BSR     CreateGradientBar2

    ; Bar 3 - Blue gradient (reverse)
    MOVE.W  D6, D0
    NEG.W   D0              ; Reverse direction
    AND.W   #$FF, D0
    ADD.W   #$C0, D0
    BSR     CreateGradientBar3

    ; End copper list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Activate
    LEA     $DFF000, A6
    MOVE.L  #RasterList, $080(A6)
    MOVE.W  $088(A6), D0

    RTS

; Create smooth gradient bar
; D0 = Center line position
; A0 = Copper list pointer
CreateGradientBar:
    MOVEM.L D1-D4, -(SP)

    ; Calculate bar start (16 lines before center)
    MOVE.W  D0, D1
    SUB.W   #16, D1

    ; Create gradient up
    MOVEQ   #15, D3         ; 16 lines
GradientUp:
    ; Ensure valid line
    CMP.W   #$2C, D1
    BLT     SkipLineUp
    CMP.W   #$12C, D1
    BGE     SkipLineUp

    ; Wait for line
    MOVE.B  D1, D2
    LSL.W   #8, D2
    OR.W    #$01, D2
    MOVE.W  D2, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Calculate color intensity
    MOVE.W  #15, D4
    SUB.W   D3, D4          ; 0-15 intensity
    LSL.W   #8, D4          ; Red component

    ; Set color
    MOVE.W  #$0180, (A0)+
    MOVE.W  D4, (A0)+

SkipLineUp:
    ADDQ.W  #1, D1
    DBF     D3, GradientUp

    ; Create gradient down
    MOVEQ   #15, D3
GradientDown:
    CMP.W   #$2C, D1
    BLT     SkipLineDown
    CMP.W   #$12C, D1
    BGE     SkipLineDown

    ; Wait for line
    MOVE.B  D1, D2
    LSL.W   #8, D2
    OR.W    #$01, D2
    MOVE.W  D2, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Calculate fading color
    MOVE.W  D3, D4
    LSL.W   #8, D4

    ; Set color
    MOVE.W  #$0180, (A0)+
    MOVE.W  D4, (A0)+

SkipLineDown:
    ADDQ.W  #1, D1
    DBF     D3, GradientDown

    ; Return to black
    CMP.W   #$12C, D1
    BGE     BarDone

    MOVE.B  D1, D2
    LSL.W   #8, D2
    OR.W    #$01, D2
    MOVE.W  D2, (A0)+
    MOVE.W  #$FFFE, (A0)+
    MOVE.W  #$0180, (A0)+
    MOVE.W  #$0000, (A0)+   ; Black

BarDone:
    MOVEM.L (SP)+, D1-D4
    RTS

; Similar for green and blue bars
CreateGradientBar2:
    ; (Implementation similar but with green component)
    RTS

CreateGradientBar3:
    ; (Implementation similar but with blue component)
    RTS

; Data
FrameCounter:   DC.W    0
RasterList:     DS.B    4096    ; Large buffer for complex effects
```

## Sprite Multiplexing

Use the Copper to display more than 8 sprites:

**Copper Sprite Multiplexing:**

```assembly
; Display many sprites using Copper repositioning

SpriteMultiplex:
    ; First, setup sprite data
    BSR     InitSpriteData

    ; Create Copper list for sprite multiplexing
    LEA     MultiplexList, A0

    ; Initial sprite setup
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Position first row of sprites (hardware positions)
    MOVEQ   #7, D7          ; 8 sprites
    MOVE.W  #$40, D1        ; X position

FirstRowSprites:
    ; Calculate sprite control registers
    MOVE.W  D7, D0
    LSL.W   #2, D0          ; Sprite number * 4
    ADD.W   #$140, D0       ; SPR0POS offset

    ; Set sprite position
    MOVE.W  D0, (A0)+       ; Register
    MOVE.W  #$3040, (A0)+   ; Y=48, X=64

    ; Set sprite control
    ADDQ.W  #2, D0          ; SPRxCTL
    MOVE.W  D0, (A0)+
    MOVE.W  #$3840, (A0)+   ; Y stop = 56 (8 pixels high)

    ; Next sprite X position
    ADD.W   #20, D1
    DBF     D7, FirstRowSprites

    ; Wait for line 64 (after first sprites)
    MOVE.W  #$4001, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Reposition sprites for second row
    MOVEQ   #7, D7
    MOVE.W  #$40, D1

SecondRowSprites:
    MOVE.W  D7, D0
    LSL.W   #2, D0
    ADD.W   #$140, D0

    ; New position
    MOVE.W  D0, (A0)+
    MOVE.W  #$4840, (A0)+   ; Y=72, X=64

    ADDQ.W  #2, D0
    MOVE.W  D0, (A0)+
    MOVE.W  #$5040, (A0)+   ; Y stop = 80

    ADD.W   #20, D1
    DBF     D7, SecondRowSprites

    ; Continue for more rows...
    ; Can display 8 sprites × number of screen sections!

    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Point sprites to data
    LEA     $DFF000, A6
    LEA     SpriteData, A1
    MOVE.L  A1, $120(A6)    ; SPR0PT
    ADD.L   #64, A1         ; Each sprite is 64 bytes
    MOVE.L  A1, $124(A6)    ; SPR1PT
    ; ... continue for all sprites

    ; Activate Copper list
    MOVE.L  #MultiplexList, $080(A6)

    RTS

; Initialize sprite data
InitSpriteData:
    LEA     SpriteData, A0

    ; Create simple 16x8 ball sprite
    ; Sprite format: 2 words control, then 2 words per line
    MOVEQ   #7, D7          ; 8 sprites

InitSpriteLoop:
    ; Control words (filled by Copper)
    MOVE.L  #0, (A0)+
    MOVE.L  #0, (A0)+

    ; Sprite image data (8 lines)
    MOVE.W  #$0180, (A0)+   ; Bitplane 0: 0000000110000000
    MOVE.W  #$0180, (A0)+   ; Bitplane 1: same (color 3)
    MOVE.W  #$03C0, (A0)+   ; 0000001111000000
    MOVE.W  #$03C0, (A0)+
    MOVE.W  #$07E0, (A0)+   ; 0000011111100000
    MOVE.W  #$07E0, (A0)+
    MOVE.W  #$0FF0, (A0)+   ; 0000111111110000
    MOVE.W  #$0FF0, (A0)+
    MOVE.W  #$0FF0, (A0)+   ; 0000111111110000
    MOVE.W  #$0FF0, (A0)+
    MOVE.W  #$07E0, (A0)+   ; 0000011111100000
    MOVE.W  #$07E0, (A0)+
    MOVE.W  #$03C0, (A0)+   ; 0000001111000000
    MOVE.W  #$03C0, (A0)+
    MOVE.W  #$0180, (A0)+   ; 0000000110000000
    MOVE.W  #$0180, (A0)+

    ; End of sprite
    MOVE.L  #0, (A0)+

    ; Align to 64 bytes
    MOVE.L  #0, (A0)+
    MOVE.L  #0, (A0)+
    MOVE.L  #0, (A0)+

    DBF     D7, InitSpriteLoop

    RTS

; Data
MultiplexList:  DS.B    2048
SpriteData:     DS.B    64*8    ; 8 sprites × 64 bytes
```

## Plasma Effects

Create mesmerizing plasma patterns using the Copper:

**Real-time Plasma Effect:**

```assembly
; Create animated plasma effect using Copper

PlasmaEffect:
    ; Initialize plasma parameters
    MOVE.W  FrameCounter, D6
    LSR.W   #2, D6          ; Slow down animation

    LEA     PlasmaList, A0

    ; Start of display
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Generate plasma pattern
    MOVE.W  #$2C, D0        ; Start line

PlasmaYLoop:
    ; Wait for line
    MOVE.B  D0, D1
    LSL.W   #8, D1
    OR.W    #$01, D1
    MOVE.W  D1, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Calculate plasma value
    MOVE.W  D0, D1          ; Y coordinate
    ADD.W   D6, D1          ; Add time

    ; First sine component
    AND.W   #$3F, D1
    LEA     SineTable, A1
    MOVE.B  (A1,D1.W), D2

    ; Second sine component (different frequency)
    MOVE.W  D0, D3
    LSL.W   #1, D3          ; Double frequency
    ADD.W   D6, D3
    LSL.W   #1, D3          ; Different phase
    AND.W   #$3F, D3
    MOVE.B  (A1,D3.W), D3

    ; Combine components
    ADD.B   D3, D2
    LSR.B   #1, D2          ; Average

    ; Create color from plasma value
    MOVE.W  D2, D3
    LSR.W   #4, D3          ; Scale to 0-15

    ; Generate RGB components
    MOVE.W  D3, D4          ; Red
    LSL.W   #8, D4
    MOVE.W  D2, D5          ; Green
    AND.W   #$F0, D5
    OR.W    D5, D4
    MOVE.W  D3, D5          ; Blue
    LSR.W   #2, D5
    OR.W    D5, D4

    ; Set color
    MOVE.W  #$0180, (A0)+
    MOVE.W  D4, (A0)+

    ; Next line
    ADDQ.W  #1, D0
    CMP.W   #$12C, D0
    BLT     PlasmaYLoop

    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Activate
    LEA     $DFF000, A6
    MOVE.L  #PlasmaList, $080(A6)

    RTS

; Interference pattern effect
InterferencePattern:
    LEA     InterferenceList, A0

    ; Setup
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+

    MOVE.W  FrameCounter, D6

    ; Generate interference
    MOVE.W  #$2C, D0        ; Y position

InterferenceLoop:
    ; Wait for line
    MOVE.B  D0, D1
    LSL.W   #8, D1
    OR.W    #$01, D1
    MOVE.W  D1, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Calculate interference
    ; Wave 1 - vertical
    MOVE.W  D0, D1
    SUB.W   #$80, D1        ; Center
    MULS    D1, D1          ; Square for circular

    ; Wave 2 - horizontal (time-based)
    MOVE.W  D6, D2
    SUB.W   #$80, D2
    MULS    D2, D2

    ; Combine waves
    ADD.L   D2, D1
    LSR.L   #8, D1          ; Scale down
    AND.W   #$3F, D1

    ; Look up in sine table for smooth gradients
    LEA     SineTable, A1
    MOVE.B  (A1,D1.W), D3

    ; Create color
    LSR.B   #4, D3
    MOVE.W  D3, D4
    LSL.W   #8, D4          ; Red
    LSL.W   #4, D3
    OR.W    D3, D4          ; Green
    LSR.W   #8, D3
    OR.W    D3, D4          ; Blue

    ; Set color
    MOVE.W  #$0180, (A0)+
    MOVE.W  D4, (A0)+

    ; Next line
    ADDQ.W  #2, D0          ; Every other line for speed
    CMP.W   #$12C, D0
    BLT     InterferenceLoop

    ; End
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+

    RTS

; Sine table for smooth effects
SineTable:
    DC.B    $80,$86,$8C,$92,$98,$9E,$A4,$AA
    DC.B    $B0,$B5,$BB,$C0,$C5,$CA,$CF,$D4
    DC.B    $D8,$DC,$E0,$E4,$E7,$EA,$ED,$F0
    DC.B    $F2,$F4,$F6,$F7,$F8,$F9,$FA,$FA
    DC.B    $FA,$FA,$F9,$F8,$F7,$F6,$F4,$F2
    DC.B    $F0,$ED,$EA,$E7,$E4,$E0,$DC,$D8
    DC.B    $D4,$CF,$CA,$C5,$C0,$BB,$B5,$B0
    DC.B    $AA,$A4,$9E,$98,$92,$8C,$86,$80

; Data buffers
PlasmaList:         DS.B    4096
InterferenceList:   DS.B    4096
```

## Multi-Directional Scrolling

Implement smooth scrolling in any direction:

**8-Way Scrolling with Copper:**

```assembly
; Smooth 8-directional scrolling using Copper

MultiScroll:
    ; Initialize scroll positions
    MOVE.W  ScrollX, D0
    MOVE.W  ScrollY, D1

    ; Update based on input (example)
    ; D2 = joystick input
    BTST    #0, D2          ; Right?
    BEQ     NotRight
    ADDQ.W  #1, ScrollX
NotRight:
    BTST    #1, D2          ; Left?
    BEQ     NotLeft
    SUBQ.W  #1, ScrollX
NotLeft:
    BTST    #2, D2          ; Down?
    BEQ     NotDown
    ADDQ.W  #1, ScrollY
NotDown:
    BTST    #3, D2          ; Up?
    BEQ     NotUp
    SUBQ.W  #1, ScrollY
NotUp:

    ; Build Copper list for scrolling
    LEA     ScrollList, A0

    ; Initial setup
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Calculate fine scroll (0-15 pixels)
    MOVE.W  ScrollX, D0
    AND.W   #$F, D0         ; Fine X scroll

    ; Set horizontal scroll in BPLCON1
    LSL.W   #4, D0          ; Shift to PF1 position
    OR.W    D0, D0          ; Copy to PF2
    MOVE.W  #$0102, (A0)+   ; BPLCON1
    MOVE.W  D0, (A0)+

    ; Calculate coarse scroll (bytes)
    MOVE.W  ScrollX, D0
    LSR.W   #3, D0          ; Divide by 8
    AND.W   #$FFFE, D0      ; Word align

    ; Calculate Y offset
    MOVE.W  ScrollY, D1
    MULU    #BYTES_PER_LINE, D1
    ADD.L   D1, D0          ; Combined offset

    ; Set bitplane pointers with scroll offset
    MOVE.L  #SCROLL_BUFFER, D1
    ADD.L   D0, D1

    ; Bitplane 1
    MOVE.W  #$00E0, (A0)+   ; BPL1PTH
    SWAP    D1
    MOVE.W  D1, (A0)+
    MOVE.W  #$00E2, (A0)+   ; BPL1PTL
    SWAP    D1
    MOVE.W  D1, (A0)+

    ; Continue for other bitplanes...
    ADD.L   #BITPLANE_SIZE, D1
    ; (repeat pointer setup)

    ; Set modulo for virtual screen
    ; If virtual screen is wider than display
    MOVE.W  #(VIRTUAL_WIDTH-DISPLAY_WIDTH)/8, D0
    MOVE.W  #$0108, (A0)+   ; BPL1MOD
    MOVE.W  D0, (A0)+
    MOVE.W  #$010A, (A0)+   ; BPL2MOD
    MOVE.W  D0, (A0)+

    ; Advanced: Per-line scroll effects
    MOVE.W  #$40, D7        ; Start line

LineScrollLoop:
    ; Wait for line
    MOVE.B  D7, D0
    LSL.W   #8, D0
    OR.W    #$01, D0
    MOVE.W  D0, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Calculate line-specific scroll
    MOVE.W  D7, D0
    SUB.W   #$40, D0        ; Relative line
    LSR.W   #2, D0          ; Scale
    ADD.W   ScrollX, D0     ; Add base scroll
    AND.W   #$F, D0         ; Fine scroll

    ; Apply wave effect
    MOVE.W  D7, D1
    ADD.W   FrameCounter, D1
    AND.W   #$3F, D1
    LEA     SineTable, A1
    MOVE.B  (A1,D1.W), D1
    LSR.B   #5, D1          ; Scale to 0-7
    ADD.W   D1, D0
    AND.W   #$F, D0

    ; Set line scroll
    LSL.W   #4, D0
    OR.W    D0, D0
    MOVE.W  #$0102, (A0)+
    MOVE.W  D0, (A0)+

    ; Next line
    ADDQ.W  #4, D7          ; Every 4th line
    CMP.W   #$120, D7
    BLT     LineScrollLoop

    ; End list
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Activate
    LEA     $DFF000, A6
    MOVE.L  #ScrollList, $080(A6)

    RTS

; Constants
VIRTUAL_WIDTH   EQU 512         ; Virtual screen width
DISPLAY_WIDTH   EQU 320         ; Visible width
BYTES_PER_LINE  EQU 64          ; Virtual width / 8

; Variables
ScrollX:        DC.W    0
ScrollY:        DC.W    0

; Buffers
ScrollList:     DS.B    2048
SCROLL_BUFFER:  DS.B    BITPLANE_SIZE * 4 * 2  ; Larger virtual screen
```

## Combined Effects Showcase

Create a professional demo combining multiple effects:

**Professional Multi-Effect Demo:**

```assembly
; Complete demo combining all Copper effects

MegaDemo:
    ; Initialize all subsystems
    BSR     InitDemo

    ; Main demo loop
DemoLoop:
    ; Wait for vertical blank
    BSR     WaitVBlank

    ; Update frame counter
    MOVE.W  FrameCounter, D0
    ADDQ.W  #1, D0
    MOVE.W  D0, FrameCounter

    ; Demo timeline control
    LSR.W   #8, D0          ; Change scene every 256 frames
    AND.W   #7, D0          ; 8 scenes total

    ; Execute current scene
    LSL.W   #2, D0          ; Convert to longword offset
    LEA     SceneTable, A0
    MOVE.L  (A0,D0.W), A0
    JSR     (A0)

    ; Check exit
    BTST    #6, $BFE001
    BNE     DemoLoop

    RTS

; Scene 1: Opening with raster bars
Scene1_Rasters:
    BSR     RasterBars
    BSR     UpdateMusic
    RTS

; Scene 2: Sprite multiplexing
Scene2_Sprites:
    BSR     SpriteMultiplex
    BSR     AnimateSprites
    RTS

; Scene 3: Plasma transition
Scene3_Plasma:
    BSR     PlasmaEffect
    BSR     FadeInMusic
    RTS

; Scene 4: Multi-scroll with sprites
Scene4_MultiScroll:
    BSR     MultiScroll
    BSR     UpdateSprites
    BSR     ScrollBackground
    RTS

; Scene 5: Interference patterns
Scene5_Interference:
    BSR     InterferencePattern
    BSR     PulseMusic
    RTS

; Scene 6: Combined effects
Scene6_Combined:
    ; Build complex Copper list
    LEA     CombinedList, A0

    ; Top section: Raster bars
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+
    BSR     AddRasterSection

    ; Middle section: Plasma
    MOVE.W  #$8001, (A0)+
    MOVE.W  #$FFFE, (A0)+
    BSR     AddPlasmaSection

    ; Bottom section: Scrolling
    MOVE.W  #$C001, (A0)+
    MOVE.W  #$FFFE, (A0)+
    BSR     AddScrollSection

    ; Sprites throughout
    BSR     AddSpriteMovement

    ; End and activate
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+

    LEA     $DFF000, A6
    MOVE.L  #CombinedList, $080(A6)

    RTS

; Scene 7: Grand finale
Scene7_Finale:
    ; All effects at maximum!
    BSR     CreateFinaleEffect
    RTS

; Scene 8: Credits
Scene8_Credits:
    BSR     ScrollCredits
    BSR     FadeOutMusic
    RTS

; Helper functions
AnimateSprites:
    ; Update sprite positions
    MOVE.W  FrameCounter, D0
    AND.W   #$1F, D0

    ; Create circular motion
    LEA     SineTable, A0
    MOVE.B  (A0,D0.W), D1   ; X offset

    ADD.W   #16, D0
    AND.W   #$3F, D0
    MOVE.B  (A0,D0.W), D2   ; Y offset

    ; Apply to sprite positions
    ; (Update Copper list dynamically)
    RTS

CreateFinaleEffect:
    ; Combine everything!
    LEA     FinaleList, A0

    ; Rapid effect changes
    MOVE.W  FrameCounter, D6
    AND.W   #3, D6          ; Change every 4 frames

    CMP.W   #0, D6
    BEQ     FinalePlasma
    CMP.W   #1, D6
    BEQ     FinaleRasters
    CMP.W   #2, D6
    BEQ     FinaleScroll

    ; Interference
    BSR     InterferencePattern
    RTS

FinalePlasma:
    BSR     PlasmaEffect
    RTS

FinaleRasters:
    BSR     RasterBars
    RTS

FinaleScroll:
    BSR     MultiScroll
    RTS

; Scene table
SceneTable:
    DC.L    Scene1_Rasters
    DC.L    Scene2_Sprites
    DC.L    Scene3_Plasma
    DC.L    Scene4_MultiScroll
    DC.L    Scene5_Interference
    DC.L    Scene6_Combined
    DC.L    Scene7_Finale
    DC.L    Scene8_Credits

; Buffers
CombinedList:   DS.B    8192    ; Large buffer for complex scenes
FinaleList:     DS.B    4096

; Run the mega demo!
BSR     MegaDemo
```

## Practice Exercise: Create Your Own Effect

Design and implement a unique Copper effect:

**Practice: Design Your Copper Effect:**

```assembly
; Create your own unique Copper effect
; Combine techniques to create something new

MyCustomEffect:
    ; Your effect idea: Tunnel vision with color cycling

    LEA     CustomList, A0

    ; Setup
    MOVE.W  #$2C01, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Create tunnel effect
    MOVE.W  FrameCounter, D6
    LSR.W   #1, D6          ; Slow rotation

    ; Generate circular gradient from center
    MOVE.W  #0, D7          ; Line counter

TunnelLoop:
    ; Calculate line position
    MOVE.W  D7, D0
    ADD.W   #$2C, D0        ; Actual screen line

    ; Wait for line
    MOVE.B  D0, D1
    LSL.W   #8, D1
    OR.W    #$01, D1
    MOVE.W  D1, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Calculate distance from center
    MOVE.W  D7, D1
    SUB.W   #100, D1        ; Center Y = 100
    MULS    D1, D1          ; Square it

    ; Add rotation
    ADD.W   D6, D1

    ; Create tunnel depth effect
    AND.W   #$7F, D1        ; Keep in range
    LSR.W   #3, D1          ; Scale to 0-15

    ; Generate color based on depth
    MOVE.W  D1, D2
    LSL.W   #8, D2          ; Red component
    MOVE.W  D1, D3
    LSL.W   #4, D3
    OR.W    D3, D2          ; Green component
    MOVE.W  D1, D3
    OR.W    D3, D2          ; Blue component

    ; Apply color cycling
    MOVE.W  D6, D3
    AND.W   #$F, D3
    ADD.W   D3, D2

    ; Set color
    MOVE.W  #$0180, (A0)+
    MOVE.W  D2, (A0)+

    ; Add horizontal distortion for tunnel walls
    CMP.W   #50, D7
    BLT     NoDistortion
    CMP.W   #150, D7
    BGT     NoDistortion

    ; Calculate sine-based distortion
    MOVE.W  D7, D3
    ADD.W   D6, D3
    AND.W   #$3F, D3
    LEA     SineTable, A1
    MOVE.B  (A1,D3.W), D3
    LSR.B   #4, D3          ; Scale to 0-15

    ; Apply to horizontal scroll
    MOVE.W  #$0102, (A0)+
    LSL.W   #4, D3
    OR.W    D3, D3
    MOVE.W  D3, (A0)+

NoDistortion:
    ; Next line
    ADDQ.W  #2, D7          ; Every other line
    CMP.W   #200, D7
    BLT     TunnelLoop

    ; End effect
    MOVE.W  #$FFFF, (A0)+
    MOVE.W  #$FFFE, (A0)+

    ; Activate your creation!
    LEA     $DFF000, A6
    MOVE.L  #CustomList, $080(A6)

    RTS

; Challenge: Add these features to your effect
; 1. Sprite objects flying through the tunnel
; 2. Color palette animation
; 3. Music synchronization
; 4. Interactive control with joystick

; Your additional code here:
AddTunnelSprites:
    ; Add sprites that follow tunnel perspective
    RTS

AddPaletteAnimation:
    ; Cycle colors for motion effect
    RTS

SyncToMusic:
    ; Read audio levels and adjust effect
    RTS

; Buffer for your effect
CustomList:     DS.B    4096

; Test your effect
BSR     MyCustomEffect
```

## What You've Learned

In this lesson, you've mastered advanced Copper display effects:

- **Advanced raster effects** with smooth gradients and multiple bars
- **Sprite multiplexing** to display many more than 8 sprites
- **Plasma effects** using mathematical patterns and color cycling
- **Multi-directional scrolling** with per-line effects
- **Interference patterns** for mesmerizing visuals
- **Combined effects** for professional demo quality
- **Effect synchronization** and smooth transitions

## Looking Ahead

Next, you'll learn about hardware sprite programming, where you'll master the Amiga's sprite system and combine it with Copper effects for even more impressive visuals. You'll create complex sprite animations and learn professional game programming techniques!

## Fun Fact

The techniques you've learned were the foundation of the legendary Amiga demoscene. Groups like The Silents, Phenomena, and Sanity used these exact Copper techniques to create demos that seemed impossible. The famous "State of the Art" demo by Spaceballs used advanced Copper tricks to display full-screen animations that looked like video playback - but it was all real-time effects! These demos were so impressive that they influenced the development of modern graphics cards and shader programming. The Copper's concept of synchronized display updates lives on in modern GPU command buffers and display lists.
