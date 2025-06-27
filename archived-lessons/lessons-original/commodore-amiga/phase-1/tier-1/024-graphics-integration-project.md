---
title: "Graphics Integration Project"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 24
description: "Integrate all graphics techniques into a complete multimedia application. Combine bitplanes, Copper, sprites, and Blitter operations to create a professional-quality graphics demo that showcases the full power of the Amiga's architecture."
learning_objectives:
  - "Integrate all Amiga graphics subsystems into one application"
  - "Build a complete graphics engine combining all techniques"
  - "Implement professional multimedia programming patterns"
  - "Create smooth real-time graphics with multiple effects"
  - "Optimize performance for complex graphics applications"
concepts:
  - "Complete graphics system integration"
  - "Real-time multimedia programming"
  - "Professional graphics engine architecture"
  - "Performance optimization strategies"
  - "Complex visual effects coordination"
estimated_duration: "60-90 minutes"
difficulty: "hard"
code_examples: true
practical_exercise: true
order: 24
---

# Lesson 24: Graphics Integration Project

Today you'll integrate everything you've learned about Amiga graphics programming into a complete multimedia application. You'll build a sophisticated graphics engine that combines bitplanes, Copper effects, hardware sprites, and Blitter operations into a seamless, professional-quality demonstration.

## Project Overview: "AmigaVision Pro"

You'll create a comprehensive graphics demonstration featuring:
- **Multi-layer scrolling backgrounds** using bitplanes and Copper
- **Hardware sprite animation** with collision detection
- **Real-time visual effects** using Blitter operations
- **Dynamic color cycling** and palette effects
- **Interactive controls** and smooth transitions
- **Performance optimization** for 50fps operation

## Understanding Graphics Integration

The key to professional Amiga graphics is coordination between all subsystems:

**Complete Graphics Engine Framework:**

```assembly
; AmigaVision Pro - Complete Graphics Integration Engine

; Graphics engine structure
GraphicsEngine:
    dc.l    InitGraphics
    dc.l    UpdateGraphics
    dc.l    RenderFrame
    dc.l    CleanupGraphics

; Main graphics initialization
InitGraphics:
    LEA     $DFF000, A6
    
    ; Setup custom screen with 5 bitplanes
    LEA     ScreenData, A0
    MOVE.L  A0, $E0(A6)         ; BPL1PT
    ADD.L   #8000, A0
    MOVE.L  A0, $E4(A6)         ; BPL2PT
    ADD.L   #8000, A0
    MOVE.L  A0, $E8(A6)         ; BPL3PT
    ADD.L   #8000, A0
    MOVE.L  A0, $EC(A6)         ; BPL4PT
    ADD.L   #8000, A0
    MOVE.L  A0, $F0(A6)         ; BPL5PT
    
    ; Configure display mode
    MOVE.W  #$5000, $100(A6)    ; BPLCON0 - 5 bitplanes
    MOVE.W  #$0000, $102(A6)    ; BPLCON1 - no scroll
    MOVE.W  #$0024, $104(A6)    ; BPLCON2 - sprites priority
    
    ; Setup display window
    MOVE.W  #$2C81, $08E(A6)    ; DIWSTRT
    MOVE.W  #$2CC1, $090(A6)    ; DIWSTOP
    MOVE.W  #$0038, $092(A6)    ; DDFSTRT
    MOVE.W  #$00D0, $094(A6)    ; DDFSTOP
    
    ; Initialize Copper list
    LEA     CopperList, A0
    MOVE.L  A0, $080(A6)        ; COP1LC
    
    ; Setup sprites
    BSR     InitSprites
    
    ; Enable DMA
    MOVE.W  #$83E0, $096(A6)    ; Enable all graphics DMA
    
    RTS

; Advanced Copper effects list
CopperList:
    ; Wait for start of display
    dc.w    $3001, $FFFE
    
    ; Setup gradient background
    dc.w    $0180, $0000        ; Color 0 - black
    dc.w    $0182, $0001        ; Color 1 - dark blue
    dc.w    $0184, $0002        ; Color 2 - blue
    
    ; Horizontal gradient effect
    dc.w    $4001, $FFFE        ; Wait line 64
    dc.w    $0180, $0112        ; Shift colors
    
    dc.w    $5001, $FFFE        ; Wait line 80
    dc.w    $0180, $0223        ; Continue gradient
    
    dc.w    $6001, $FFFE        ; Wait line 96
    dc.w    $0180, $0334        ; More blue
    
    ; Plasma effect section
    dc.w    $8001, $FFFE        ; Wait line 128
    dc.w    $0180, $0F0F        ; Bright magenta
    dc.w    $0182, $0F0A        ; Pink
    dc.w    $0184, $0A0F        ; Purple
    
    ; Scrolling text area
    dc.w    $A001, $FFFE        ; Wait line 160
    dc.w    $0102, $0010        ; Scroll text left
    
    ; Sprite activation area
    dc.w    $C001, $FFFE        ; Wait line 192
    dc.w    $0120, $0F00        ; Enable sprite 0
    dc.w    $0122, $0F00        ; Sprite 0 data A
    
    ; End of frame
    dc.w    $FFFF, $FFFE        ; Wait for end
    dc.l    $00000000           ; End of list

; Sprite initialization and animation
InitSprites:
    LEA     $DFF000, A6
    
    ; Setup sprite 0 - main character
    LEA     SpriteData0, A0
    MOVE.L  A0, $120(A6)        ; SPR0PT
    
    ; Setup sprite 1 - power-up
    LEA     SpriteData1, A0
    MOVE.L  A0, $124(A6)        ; SPR1PT
    
    ; Initialize sprite positions
    MOVE.W  #$5050, SpriteX     ; Start position
    MOVE.W  #$8060, SpriteY
    
    RTS

; Real-time graphics update loop
UpdateGraphics:
    BSR     UpdateSprites
    BSR     UpdateBackground
    BSR     UpdateEffects
    
    ; Wait for vertical blank
.waitvb:
    BTST    #0, $DFF005         ; Check VPOSR
    BEQ.S   .waitvb
    
    RTS

; Sprite animation system
UpdateSprites:
    ; Animate main sprite
    MOVE.W  SpriteX, D0
    ADDQ.W  #2, D0              ; Move right
    CMP.W   #320, D0            ; Check bounds
    BLT.S   .inbounds
    CLR.W   D0                  ; Wrap around
.inbounds:
    MOVE.W  D0, SpriteX
    
    ; Update sprite hardware position
    LEA     $DFF000, A6
    MOVE.W  SpriteY, D1
    LSL.W   #8, D1
    OR.W    D0, D1
    MOVE.W  D1, $142(A6)        ; SPR0POS
    
    RTS

; Background scrolling and effects
UpdateBackground:
    LEA     $DFF000, A6
    
    ; Update scroll position
    MOVE.W  ScrollPos, D0
    ADDQ.W  #1, D0
    AND.W   #$0F, D0            ; Wrap at 16 pixels
    MOVE.W  D0, ScrollPos
    
    ; Apply to hardware
    LSL.W   #4, D0              ; Shift for BPLCON1
    MOVE.W  D0, $102(A6)        ; BPLCON1
    
    RTS

; Advanced Blitter effects
UpdateEffects:
    LEA     $DFF000, A6
    
    ; Wait for Blitter ready
.waitblit:
    BTST    #14, $002(A6)       ; Check DMACONR
    BNE.S   .waitblit
    
    ; Setup plasma effect using Blitter
    MOVE.L  #PlasmaSource, $050(A6)   ; BLTAPT
    MOVE.L  #ScreenData+16000, $054(A6) ; BLTDPT
    MOVE.W  #$0000, $064(A6)    ; BLTAMOD
    MOVE.W  #$0000, $066(A6)    ; BLTDMOD
    MOVE.W  #$09F0, $040(A6)    ; BLTCON0
    MOVE.W  #$0000, $042(A6)    ; BLTCON1
    MOVE.W  #$1004, $058(A6)    ; BLTSIZE (start)
    
    RTS

; Data sections
SpriteData0:
    dc.w    $5050, $6070        ; Position and control
    dc.w    $7FFE, $0000        ; Line 1 data
    dc.w    $4002, $7FFE        ; Line 2 data
    dc.w    $4002, $7FFE        ; Line 3 data
    dc.w    $7FFE, $0000        ; Line 4 data
    dc.w    $0000, $0000        ; End marker

SpriteData1:
    dc.w    $A080, $B090        ; Position and control
    dc.w    $3C3C, $0000        ; Power-up sprite data
    dc.w    $7E7E, $0000
    dc.w    $7E7E, $0000
    dc.w    $3C3C, $0000
    dc.w    $0000, $0000        ; End marker

; Variables
SpriteX:        dc.w    80
SpriteY:        dc.w    80
ScrollPos:      dc.w    0
FrameCounter:   dc.w    0

; Screen memory (allocated in Chip RAM)
ScreenData:     ds.b    40000   ; 5 bitplanes * 320x256
PlasmaSource:   ds.b    8000    ; Plasma effect data
```

## Building the Complete Integration

Let's implement the main application loop that coordinates all systems:

**Main Application Loop with Performance Optimization:**

```assembly
; AmigaVision Pro - Main Application Loop

MainLoop:
    ; Frame timing and synchronization
    BSR     WaitVerticalBlank
    
    ; Increment frame counter
    ADDQ.W  #1, FrameCounter
    
    ; Update all graphics subsystems
    BSR     UpdateGraphics
    
    ; Handle user input
    BSR     CheckInput
    
    ; Update audio synchronization
    BSR     UpdateAudioSync
    
    ; Performance monitoring
    BSR     CheckPerformance
    
    ; Continue loop
    BRA     MainLoop

; Precise vertical blank synchronization
WaitVerticalBlank:
    LEA     $DFF000, A6
    
    ; Wait for line 255 (end of display)
.wait1:
    MOVE.W  $004(A6), D0        ; Read VPOSR
    AND.W   #$01FF, D0          ; Mask line number
    CMP.W   #255, D0
    BNE.S   .wait1
    
    ; Now wait for line 0 (start of new frame)
.wait2:
    MOVE.W  $004(A6), D0
    AND.W   #$01FF, D0
    BNE.S   .wait2
    
    RTS

; Advanced input handling
CheckInput:
    LEA     $DFF000, A6
    
    ; Check joystick port 1
    MOVE.W  $00C(A6), D0        ; Read JOY1DAT
    
    ; Check fire button (left mouse button)
    BTST    #7, $BFE001         ; CIA-A port A
    BEQ.S   .firePressed
    
    ; Check direction
    MOVE.W  D0, D1
    ROR.W   #2, D1
    EOR.W   D0, D1
    AND.W   #$0303, D1
    
    ; Process horizontal movement
    BTST    #1, D1
    BNE.S   .moveRight
    BTST    #0, D1
    BNE.S   .moveLeft
    BRA.S   .checkVertical
    
.moveRight:
    MOVE.W  SpriteX, D2
    ADDQ.W  #4, D2
    CMP.W   #304, D2            ; Check right boundary
    BGT.S   .checkVertical
    MOVE.W  D2, SpriteX
    BRA.S   .checkVertical
    
.moveLeft:
    MOVE.W  SpriteX, D2
    SUBQ.W  #4, D2
    BMI.S   .checkVertical      ; Check left boundary
    MOVE.W  D2, SpriteX
    
.checkVertical:
    ; Process vertical movement
    BTST    #9, D1
    BNE.S   .moveDown
    BTST    #8, D1
    BNE.S   .moveUp
    BRA.S   .inputDone
    
.moveUp:
    MOVE.W  SpriteY, D2
    SUBQ.W  #4, D2
    CMP.W   #40, D2             ; Check top boundary
    BLT.S   .inputDone
    MOVE.W  D2, SpriteY
    BRA.S   .inputDone
    
.moveDown:
    MOVE.W  SpriteY, D2
    ADDQ.W  #4, D2
    CMP.W   #240, D2            ; Check bottom boundary
    BGT.S   .inputDone
    MOVE.W  D2, SpriteY
    
.inputDone:
    RTS
    
.firePressed:
    ; Trigger special effect
    MOVE.W  #1, EffectTrigger
    RTS

; Audio-visual synchronization
UpdateAudioSync:
    ; Sync color changes with beat
    MOVE.W  FrameCounter, D0
    AND.W   #$001F, D0          ; 32-frame cycle
    BNE.S   .nobeat
    
    ; Change palette on beat
    LEA     $DFF000, A6
    MOVE.W  #$0F0F, $180(A6)    ; Flash bright
    MOVE.W  #30, FlashCounter   ; Set flash duration
    
.nobeat:
    ; Fade flash effect
    TST.W   FlashCounter
    BEQ.S   .nofade
    SUBQ.W  #1, FlashCounter
    
    ; Calculate fade value
    MOVE.W  FlashCounter, D0
    LSR.W   #1, D0              ; Divide by 2
    LSL.W   #4, D0              ; Shift for color format
    OR.W    D0, D0              ; Combine RGB
    MOVE.W  D0, $180(A6)        ; Apply faded color
    
.nofade:
    RTS

; Performance monitoring and optimization
CheckPerformance:
    ; Monitor frame rate
    MOVE.W  FrameCounter, D0
    AND.W   #$003F, D0          ; Every 64 frames
    BNE.S   .noperf
    
    ; Check if we're maintaining 50fps
    ; Adjust quality settings if needed
    CMP.W   #50, LastFrameRate
    BGE.S   .perfok
    
    ; Reduce quality for performance
    MOVE.W  #1, QualityReduction
    BRA.S   .perfdone
    
.perfok:
    ; Restore full quality
    CLR.W   QualityReduction
    
.perfdone:
.noperf:
    RTS

; Variables for integration
EffectTrigger:      dc.w    0
FlashCounter:       dc.w    0
LastFrameRate:      dc.w    50
QualityReduction:   dc.w    0
```

## Professional Graphics Engine Architecture

Your complete graphics engine demonstrates advanced programming patterns:

**Modular Graphics System with Resource Management:**

```assembly
; Professional Graphics Engine Architecture

; Graphics system manager
GraphicsManager:
    dc.l    .Init
    dc.l    .Update
    dc.l    .Render
    dc.l    .Cleanup
    dc.l    .GetStats

.Init:
    ; Initialize all subsystems
    BSR     InitDisplay
    BSR     InitSprites
    BSR     InitCopper
    BSR     InitBlitter
    
    ; Setup resource management
    LEA     ResourceList, A0
    CLR.L   (A0)                ; Clear resource count
    
    ; Mark initialization complete
    MOVE.W  #1, SystemReady
    RTS

.Update:
    ; Only update if system ready
    TST.W   SystemReady
    BEQ.S   .skip
    
    ; Update all subsystems in order
    BSR     UpdateBackground
    BSR     UpdateSprites
    BSR     UpdateEffects
    BSR     UpdateCopper
    
.skip:
    RTS

.Render:
    ; Performance-aware rendering
    TST.W   QualityReduction
    BNE.S   .lowquality
    
    ; Full quality rendering
    BSR     RenderFullQuality
    BRA.S   .renderdone
    
.lowquality:
    ; Reduced quality for performance
    BSR     RenderReducedQuality
    
.renderdone:
    RTS

.Cleanup:
    ; Properly cleanup all resources
    BSR     CleanupSprites
    BSR     CleanupCopper
    BSR     CleanupBlitter
    BSR     FreeResources
    CLR.W   SystemReady
    RTS

.GetStats:
    ; Return performance statistics
    LEA     PerfStats, A0
    MOVE.W  FrameCounter, (A0)
    MOVE.W  LastFrameRate, 2(A0)
    RTS

; Resource management system
AllocResource:
    ; A0 = resource size
    ; Returns A0 = resource pointer or NULL
    
    MOVE.L  A1, -(SP)           ; Save registers
    MOVE.L  D0, -(SP)
    
    ; Find free resource slot
    LEA     ResourceList, A1
    MOVE.L  (A1), D0            ; Get count
    CMP.L   #MAX_RESOURCES, D0
    BGE.S   .allocfail
    
    ; Allocate memory (simplified - use OS calls in real code)
    ; ... allocation code ...
    
    ; Add to resource list
    ADDQ.L  #1, (A1)            ; Increment count
    
    MOVE.L  (SP)+, D0           ; Restore registers
    MOVE.L  (SP)+, A1
    RTS
    
.allocfail:
    CLR.L   A0                  ; Return NULL
    MOVE.L  (SP)+, D0
    MOVE.L  (SP)+, A1
    RTS

; Advanced effect coordination
EffectCoordinator:
    ; Coordinate multiple effects
    MOVE.W  FrameCounter, D0
    
    ; Plasma effect (every frame)
    BSR     UpdatePlasma
    
    ; Sprite trail effect (every 2 frames)
    BTST    #0, D0
    BNE.S   .notrail
    BSR     UpdateSpriteTrail
    
.notrail:
    ; Screen shake effect (when triggered)
    TST.W   EffectTrigger
    BEQ.S   .noshake
    BSR     ScreenShakeEffect
    CLR.W   EffectTrigger
    
.noshake:
    ; Color cycling (every 4 frames)
    AND.W   #$0003, D0
    BNE.S   .nocycle
    BSR     ColorCycleEffect
    
.nocycle:
    RTS

; System constants
MAX_RESOURCES   EQU     32
SCREEN_WIDTH    EQU     320
SCREEN_HEIGHT   EQU     256

; System variables
SystemReady:        dc.w    0
ResourceList:       ds.l    MAX_RESOURCES+1
PerfStats:          ds.w    4
```

## Putting It All Together

Your complete integration project demonstrates mastery of:

1. **Coordinated System Programming**: All Amiga graphics subsystems working together
2. **Performance Optimization**: Frame rate monitoring and adaptive quality
3. **Professional Architecture**: Modular design with proper resource management
4. **Real-time Effects**: Multiple synchronized visual effects
5. **Interactive Response**: Smooth user input handling

## Advanced Optimization Techniques

**Performance Optimization and Memory Management:**

```assembly
; Advanced optimization techniques for complex graphics

; Cache-friendly rendering order
OptimizedRender:
    ; Render in memory-access order for cache efficiency
    
    ; 1. Update all positions first (minimal memory access)
    BSR     UpdatePositions
    
    ; 2. Batch all Copper updates
    BSR     BatchCopperUpdates
    
    ; 3. Batch all Blitter operations
    BSR     BatchBlitterOps
    
    ; 4. Update sprite hardware last
    BSR     UpdateSpriteHardware
    
    RTS

; Memory-efficient double buffering
DoubleBufferSetup:
    ; Setup ping-pong buffers for smooth animation
    LEA     Buffer1, A0
    LEA     Buffer2, A1
    
    MOVE.L  A0, CurrentBuffer
    MOVE.L  A1, BackBuffer
    
    ; Clear both buffers
    BSR     ClearBuffer
    EXG     A0, A1
    BSR     ClearBuffer
    
    RTS

SwapBuffers:
    ; Atomic buffer swap during vertical blank
    MOVE.L  CurrentBuffer, D0
    MOVE.L  BackBuffer, CurrentBuffer
    MOVE.L  D0, BackBuffer
    
    ; Update hardware pointers
    MOVE.L  CurrentBuffer, A0
    LEA     $DFF000, A6
    MOVE.L  A0, $E0(A6)         ; BPL1PT
    ; ... update other bitplane pointers
    
    RTS

; Interrupt-driven updates for perfect timing
InterruptHandler:
    ; Save registers
    MOVEM.L D0-D7/A0-A6, -(SP)
    
    ; Check interrupt source
    LEA     $DFF000, A6
    MOVE.W  $01E(A6), D0        ; INTREQR
    
    ; Vertical blank interrupt?
    BTST    #5, D0
    BEQ.S   .notvblank
    
    ; Handle vertical blank
    BSR     VBlankUpdate
    MOVE.W  #$0020, $09C(A6)    ; Clear VBlank interrupt
    
.notvblank:
    ; Restore registers and exit
    MOVEM.L (SP)+, D0-D7/A0-A6
    RTE

; Data alignment for optimal performance
    CNOP    0, 4                ; Align to 4-byte boundary
Buffer1:        ds.b    40000
    CNOP    0, 4
Buffer2:        ds.b    40000
CurrentBuffer:  dc.l    0
BackBuffer:     dc.l    0
```

## What You've Learned

In this graphics integration project, you've successfully:
- **Combined all graphics subsystems** into a unified application
- **Built a professional graphics engine** with modular architecture
- **Implemented real-time effects** at full frame rate
- **Mastered performance optimization** for complex graphics
- **Created a complete multimedia experience** showcasing Amiga capabilities

## Looking Ahead

Next, you'll move into advanced audio programming, where you'll learn to control Paula's 4-channel audio system and create sophisticated sound effects and music that complement your graphics programming skills!

## Fun Fact

The integration techniques you've learned mirror those used in legendary Amiga software like Deluxe Paint, Video Toaster, and professional games. The modular graphics engine architecture you've built is similar to modern game engines, just implemented directly on the hardware level!