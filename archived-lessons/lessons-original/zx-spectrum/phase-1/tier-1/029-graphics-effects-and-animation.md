---
title: "Graphics Effects and Animation"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 29
description: "Create stunning visual effects including gradients, transparency simulation, and smooth animations. Learn advanced techniques for bringing static graphics to life on the ZX Spectrum."
learning_objectives:
  - "Implement gradient and shading effects"
  - "Simulate transparency with patterns"
  - "Create smooth animation techniques"
  - "Build particle effects and transitions"
  - "Optimize effects for real-time performance"
concepts:
  - "Dithering and gradient patterns"
  - "Frame buffer animation"
  - "Sprite animation techniques"
  - "Visual effects algorithms"
  - "Performance optimization for effects"
estimated_duration: "50-60 minutes"
difficulty: "hard"
code_examples: true
practical_exercise: true
order: 29
---

# Lesson 29: Graphics Effects and Animation

Transform your static drawings into dynamic visual experiences! The ZX Spectrum's limited palette and monochrome pixels within each character cell require creative techniques to achieve effects that modern systems take for granted. Let's master these techniques and create stunning visual effects!

## Gradient and Shading Effects

### Dithering Patterns

Create the illusion of gradients using dithering:

```text
; Gradient dithering patterns (0% to 100% density)
DitherPatterns:
    ; 0% (white)
    DB 00000000b
    DB 00000000b
    DB 00000000b
    DB 00000000b
    DB 00000000b
    DB 00000000b
    DB 00000000b
    DB 00000000b

    ; 12.5%
    DB 00000000b
    DB 00010000b
    DB 00000000b
    DB 01000001b
    DB 00000000b
    DB 00010000b
    DB 00000000b
    DB 01000001b

    ; 25%
    DB 10001000b
    DB 00100010b
    DB 10001000b
    DB 00100010b
    DB 10001000b
    DB 00100010b
    DB 10001000b
    DB 00100010b

    ; 37.5%
    DB 10101010b
    DB 01010100b
    DB 10101010b
    DB 01010101b
    DB 10101010b
    DB 01010100b
    DB 10101010b
    DB 01010101b

    ; 50%
    DB 10101010b
    DB 01010101b
    DB 10101010b
    DB 01010101b
    DB 10101010b
    DB 01010101b
    DB 10101010b
    DB 01010101b

    ; 62.5%
    DB 01010101b
    DB 10101011b
    DB 01010101b
    DB 10101010b
    DB 01010101b
    DB 10101011b
    DB 01010101b
    DB 10101010b

    ; 75%
    DB 01110111b
    DB 11011101b
    DB 01110111b
    DB 11011101b
    DB 01110111b
    DB 11011101b
    DB 01110111b
    DB 11011101b

    ; 87.5%
    DB 11111111b
    DB 11101111b
    DB 11111111b
    DB 10111110b
    DB 11111111b
    DB 11101111b
    DB 11111111b
    DB 10111110b

    ; 100% (black)
    DB 11111111b
    DB 11111111b
    DB 11111111b
    DB 11111111b
    DB 11111111b
    DB 11111111b
    DB 11111111b
    DB 11111111b
```

### Drawing Gradients

**Gradient Effects:**

```assembly
; Gradient drawing demonstration
; Shows various gradient techniques

DISPLAY_FILE    EQU 16384

; Dither patterns for gradients
Pattern0:       DB 00000000b    ; 0%
Pattern1:       DB 00010000b    ; 12.5%
Pattern2:       DB 10001000b    ; 25%
Pattern3:       DB 10101010b    ; 50%
Pattern4:       DB 11101110b    ; 75%
Pattern5:       DB 11111111b    ; 100%

; Draw horizontal gradient
; Input: D = x start, E = y, B = width, C = height
DrawHGradient:
    LD A, C
    LD (GradHeight), A

HGradYLoop:
    PUSH BC
    PUSH DE

    ; Calculate gradient step
    LD A, B             ; Width
    RRA
    RRA
    RRA                 ; Divide by 8
    AND 31
    JR NZ, HGradDraw
    INC A               ; At least 1

HGradDraw:
    LD (GradStep), A
    LD A, 0             ; Pattern index
    LD (PatternIdx), A

    ; Draw gradient line
    LD B, D             ; X position

HGradXLoop:
    PUSH BC

    ; Get pattern for current position
    LD A, (PatternIdx)
    CP 6
    JR C, ValidPattern
    LD A, 5             ; Max pattern

ValidPattern:
    ; Get pattern byte
    PUSH AF
    LD HL, Pattern0
    LD D, 0
    LD E, A
    ADD HL, DE
    LD A, (HL)
    LD (CurrentPattern), A
    POP AF

    ; Draw column with pattern
    LD C, E             ; Y position
    LD A, (GradHeight)
    LD D, A

PatternColumn:
    PUSH BC
    PUSH DE

    ; Apply dither pattern
    LD A, C
    AND 7               ; Row within pattern
    LD D, A
    LD A, (CurrentPattern)

    ; Rotate pattern to current row
PatternRotate:
    OR A
    JR Z, ApplyPattern
    RRA
    DEC D
    JR PatternRotate

ApplyPattern:
    JR NC, SkipPixel    ; Pattern bit is 0

    CALL PlotPixel

SkipPixel:
    POP DE
    POP BC
    INC C               ; Next Y
    DEC D
    JR NZ, PatternColumn

    POP BC

    ; Move to next gradient step
    LD A, (GradStep)
    DEC A
    LD (GradStep), A
    JR NZ, SamePattern

    ; Next pattern
    LD A, (PatternIdx)
    INC A
    LD (PatternIdx), A

    ; Reset step counter
    POP DE
    PUSH DE
    LD A, B
    RRA
    RRA
    RRA
    AND 31
    LD (GradStep), A

SamePattern:
    INC B               ; Next X
    POP DE
    PUSH DE
    LD A, B
    SUB D               ; Check if done
    POP DE
    PUSH DE
    CP B                ; Width
    POP DE
    POP BC
    PUSH BC
    PUSH DE
    JR C, HGradXLoop

    POP DE
    POP BC

    ; Next line
    INC E               ; Next Y
    LD A, (GradHeight)
    DEC A
    LD (GradHeight), A
    JR NZ, HGradYLoop

    RET

; Storage
GradHeight:     DB 0
GradStep:       DB 0
PatternIdx:     DB 0
CurrentPattern: DB 0

; Screen routines
PlotPixel:
    ; Standard pixel plotting
    ; (Implementation as in previous lessons)
    RET

; Clear screen
ClearScreen:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143
    LD (HL), 0
    LDIR
    RET

; Test gradients
TestGradients:
    CALL ClearScreen

    ; Draw horizontal gradient
    LD D, 20            ; X start
    LD E, 20            ; Y start
    LD B, 200           ; Width
    LD C, 40            ; Height
    CALL DrawHGradient

    ; Draw vertical gradient (rotated)
    LD D, 20
    LD E, 80
    LD B, 40
    LD C, 80
    CALL DrawVGradient

    ; Draw radial gradient
    LD D, 150           ; Center X
    LD E, 120           ; Center Y
    LD B, 50            ; Radius
    CALL DrawRadialGradient

    LD B, 255           ; Success
    RET

; Vertical gradient
DrawVGradient:
    ; Similar to horizontal but pattern changes by Y
    ; (Implementation abbreviated)
    RET

; Radial gradient
DrawRadialGradient:
    ; Use distance from center to select pattern
    ; (Implementation abbreviated)
    RET
```

## Transparency Simulation

### Pattern-Based Transparency

Simulate transparency by alternating pixels:

```text
; Transparency patterns (50%, 25%, 75%)
TransparencyMasks:
    DB 10101010b    ; 50% checkerboard
    DB 01010101b

    DB 10001000b    ; 25% sparse
    DB 00100010b

    DB 11101110b    ; 75% dense
    DB 10111011b

; Draw with transparency
; Input: HL = source data, DE = screen position
DrawTransparent:
    LD A, (TransparencyLevel)
    OR A
    JP Z, DrawOpaque        ; 0% = fully opaque

    ; Get transparency mask
    DEC A
    ADD A, A                ; × 2 (2 bytes per pattern)
    LD BC, TransparencyMasks
    ADD C
    LD C, A
    LD A, (BC)              ; First mask byte
    LD (Mask1), A
    INC BC
    LD A, (BC)              ; Second mask byte
    LD (Mask2), A

    ; Apply transparency
    LD B, 8                 ; 8 lines

TransLoop:
    LD A, (HL)              ; Source byte
    PUSH AF

    ; Apply mask (alternating rows)
    LD A, B
    AND 1
    JR Z, UseMask1
    LD A, (Mask2)
    JR ApplyMask
UseMask1:
    LD A, (Mask1)

ApplyMask:
    LD C, A                 ; Save mask
    POP AF                  ; Source byte
    AND C                   ; Apply transparency

    ; Merge with background
    PUSH AF
    LD A, (DE)              ; Background byte
    CPL
    AND C                   ; Inverted mask
    LD C, A
    POP AF
    OR C                    ; Combine

    LD (DE), A              ; Write result
    INC HL
    INC DE
    DJNZ TransLoop
    RET

TransparencyLevel: DB 1     ; 0=opaque, 1=50%, 2=25%, 3=75%
Mask1: DB 0
Mask2: DB 0
```

**Transparency Effects:**

```assembly
; Transparency simulation demonstration
; Shows pattern-based transparency

DISPLAY_FILE    EQU 16384

; Transparency patterns
TRANS_50:       EQU 0
TRANS_25:       EQU 1
TRANS_75:       EQU 2

; Draw rectangle with transparency
; Input: D = x, E = y, B = width, C = height, A = transparency
DrawTransRect:
    LD (TransMode), A
    LD A, C
    LD (RectHeight), A

TransYLoop:
    PUSH BC
    PUSH DE

    LD A, B             ; Width
    LD (RectWidth), A

TransXLoop:
    PUSH BC
    PUSH DE

    ; Check transparency pattern
    LD A, (TransMode)
    OR A
    JR Z, Trans50
    DEC A
    JR Z, Trans25
    JR Trans75

Trans50:
    ; 50% checkerboard
    LD A, B
    ADD C               ; X + Y
    AND 1
    JR Z, SkipTransPixel
    JR DrawTransPixel

Trans25:
    ; 25% sparse
    LD A, B
    AND 1
    JR NZ, SkipTransPixel
    LD A, C
    AND 1
    JR NZ, SkipTransPixel
    JR DrawTransPixel

Trans75:
    ; 75% dense
    LD A, B
    AND 1
    JR NZ, DrawTransPixel
    LD A, C
    AND 1
    JR Z, DrawTransPixel
    JR SkipTransPixel

DrawTransPixel:
    CALL PlotPixel

SkipTransPixel:
    POP DE
    POP BC

    INC B               ; Next X
    LD A, (RectWidth)
    DEC A
    LD (RectWidth), A
    JR NZ, TransXLoop

    POP DE
    POP BC

    INC E               ; Next Y
    LD A, (RectHeight)
    DEC A
    LD (RectHeight), A
    JR NZ, TransYLoop

    RET

; Storage
TransMode:      DB 0
RectWidth:      DB 0
RectHeight:     DB 0

; Alpha blending simulation
; Blend two images using patterns
AlphaBlend:
    ; Input: HL = image1, DE = image2, BC = size
    ; A = blend level (0-7)
    LD (BlendLevel), A

BlendLoop:
    PUSH BC

    LD A, (HL)          ; Image 1 pixel
    LD B, A
    LD A, (DE)          ; Image 2 pixel
    LD C, A

    ; Simple blend based on pattern
    LD A, (BlendCounter)
    INC A
    AND 7
    LD (BlendCounter), A

    LD D, A
    LD A, (BlendLevel)
    CP D
    JR C, UseImage1
    LD A, C             ; Use image 2
    JR StoreBlend
UseImage1:
    LD A, B             ; Use image 1

StoreBlend:
    LD (HL), A
    INC HL
    INC DE

    POP BC
    DEC BC
    LD A, B
    OR C
    JR NZ, BlendLoop
    RET

BlendLevel:     DB 4
BlendCounter:   DB 0

; Screen routines
PlotPixel:
    ; (Standard implementation)
    RET

ClearScreen:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143
    LD (HL), 0
    LDIR
    RET

; Test transparency
TestTransparency:
    CALL ClearScreen

    ; Draw background pattern
    LD HL, DISPLAY_FILE
    LD B, 192
BackLoop:
    LD A, B
    AND 8
    JR Z, BackPattern1
    LD (HL), 11110000b
    JR NextBack
BackPattern1:
    LD (HL), 00001111b
NextBack:
    INC HL
    DJNZ BackLoop

    ; Draw transparent rectangles
    LD D, 20
    LD E, 20
    LD B, 60
    LD C, 40
    LD A, TRANS_50
    CALL DrawTransRect

    LD D, 50
    LD E, 40
    LD B, 60
    LD C, 40
    LD A, TRANS_25
    CALL DrawTransRect

    LD D, 80
    LD E, 60
    LD B, 60
    LD C, 40
    LD A, TRANS_75
    CALL DrawTransRect

    ; Overlapping transparent shapes
    LD D, 120
    LD E, 80
    LD B, 80
    LD C, 60
    LD A, TRANS_50
    CALL DrawTransRect

    LD D, 140
    LD E, 100
    LD B, 80
    LD C, 60
    LD A, TRANS_50
    CALL DrawTransRect

    LD B, 255           ; Success
    RET
```

## Animation Techniques

### Frame Buffer Animation

```text
; Double buffering for smooth animation
BUFFER1:        EQU 25000   ; Off-screen buffer
BUFFER2:        EQU 26000   ; Second buffer
CurrentBuffer:  DB 0        ; Which buffer is active

; Swap buffers
SwapBuffers:
    LD A, (CurrentBuffer)
    XOR 1
    LD (CurrentBuffer), A

    ; Copy buffer to screen
    OR A
    JR Z, CopyBuffer1

    ; Copy buffer 2
    LD HL, BUFFER2
    JR CopyToScreen

CopyBuffer1:
    LD HL, BUFFER1

CopyToScreen:
    LD DE, DISPLAY_FILE
    LD BC, 6144
    LDIR
    RET

; Get current drawing buffer
GetDrawBuffer:
    LD A, (CurrentBuffer)
    OR A
    JR Z, GetBuffer2    ; If showing 1, draw to 2
    LD HL, BUFFER1
    RET
GetBuffer2:
    LD HL, BUFFER2
    RET
```

### Sprite Animation

**Sprite Animation:**

```assembly
; Sprite animation system
; Demonstrates smooth character movement

DISPLAY_FILE    EQU 16384

; Sprite data (8x8 ball with animation frames)
SpriteFrames:
    ; Frame 0 - ball normal
    DB 00111100b
    DB 01111110b
    DB 11111111b
    DB 11111111b
    DB 11111111b
    DB 11111111b
    DB 01111110b
    DB 00111100b

    ; Frame 1 - ball squashed
    DB 00000000b
    DB 00111100b
    DB 01111110b
    DB 11111111b
    DB 11111111b
    DB 01111110b
    DB 00111100b
    DB 00000000b

    ; Frame 2 - ball stretched
    DB 00011000b
    DB 00111100b
    DB 01111110b
    DB 11111111b
    DB 11111111b
    DB 01111110b
    DB 00111100b
    DB 00011000b

; Animation state
AnimFrame:      DB 0
AnimX:          DB 20
AnimY:          DB 50
AnimDX:         DB 1        ; X velocity
AnimDY:         DB 1        ; Y velocity

; Draw sprite with XOR (for easy erasing)
; Input: B = x, C = y, HL = sprite data
DrawSprite:
    LD D, 8             ; 8 lines

SpriteLoop:
    PUSH BC
    PUSH DE
    PUSH HL

    ; Calculate screen position
    CALL CalculateByteAddr

    ; Draw sprite line
    LD A, (HL)          ; Sprite data
    XOR (DE)            ; XOR with screen
    LD (DE), A          ; Write back

    POP HL
    POP DE
    POP BC

    INC HL              ; Next sprite line
    INC C               ; Next Y
    DEC D
    JR NZ, SpriteLoop
    RET

; Calculate byte address for aligned sprite
; Input: B = x (must be multiple of 8), C = y
; Output: DE = screen address
CalculateByteAddr:
    LD A, C
    AND 192
    RRA
    RRA
    RRA
    OR 64
    LD D, A

    LD A, C
    AND 56
    RLA
    RLA
    LD E, A

    LD A, C
    AND 7
    OR D
    LD D, A

    LD A, B
    RRA
    RRA
    RRA
    AND 31
    OR E
    LD E, A
    RET

; Animate sprite
AnimateSprite:
    ; Erase at old position
    LD A, (AnimX)
    LD B, A
    LD A, (AnimY)
    LD C, A
    LD A, (AnimFrame)
    LD H, 0
    LD L, A
    ADD HL, HL          ; × 2
    ADD HL, HL          ; × 4
    ADD HL, HL          ; × 8 (8 bytes per frame)
    LD DE, SpriteFrames
    ADD HL, DE
    CALL DrawSprite     ; Erase with XOR

    ; Update position
    LD A, (AnimX)
    LD B, A
    LD A, (AnimDX)
    ADD B
    LD (AnimX), A

    ; Check X bounds
    CP 8
    JR NC, XOK1
    LD A, 1             ; Reverse direction
    LD (AnimDX), A
    LD A, 8
    LD (AnimX), A
    JR UpdateY

XOK1:
    CP 240
    JR C, UpdateY
    LD A, 255           ; Reverse direction
    LD (AnimDX), A
    LD A, 240
    LD (AnimX), A

UpdateY:
    LD A, (AnimY)
    LD B, A
    LD A, (AnimDY)
    ADD B
    LD (AnimY), A

    ; Check Y bounds
    CP 8
    JR NC, YOK1
    LD A, 1             ; Reverse direction
    LD (AnimDY), A
    LD A, 8
    LD (AnimY), A
    ; Change frame on bounce
    LD A, 1
    LD (AnimFrame), A
    JR DrawNewSprite

YOK1:
    CP 176
    JR C, UpdateFrame
    LD A, 255           ; Reverse direction
    LD (AnimDY), A
    LD A, 176
    LD (AnimY), A
    ; Change frame on bounce
    LD A, 1
    LD (AnimFrame), A
    JR DrawNewSprite

UpdateFrame:
    ; Cycle animation frames
    LD A, (AnimFrame)
    INC A
    CP 3
    JR C, FrameOK
    LD A, 0
FrameOK:
    LD (AnimFrame), A

DrawNewSprite:
    ; Draw at new position
    LD A, (AnimX)
    AND 248             ; Align to byte
    LD B, A
    LD A, (AnimY)
    LD C, A
    LD A, (AnimFrame)
    LD H, 0
    LD L, A
    ADD HL, HL
    ADD HL, HL
    ADD HL, HL
    LD DE, SpriteFrames
    ADD HL, DE
    CALL DrawSprite
    RET

; Clear screen
ClearScreen:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143
    LD (HL), 0
    LDIR
    RET

; Animation demo
AnimationDemo:
    CALL ClearScreen

    ; Animate for many frames
    LD B, 255

AnimLoop:
    PUSH BC

    CALL AnimateSprite

    ; Frame delay
    LD BC, 2000
DelayLoop:
    DEC BC
    LD A, B
    OR C
    JR NZ, DelayLoop

    POP BC
    DJNZ AnimLoop

    LD B, 255           ; Success
    RET
```

## Particle Effects

### Simple Particle System

```text
; Particle structure (4 bytes each)
; X, Y, VX, VY
MAX_PARTICLES:  EQU 32
Particles:      DS MAX_PARTICLES * 4
ParticleCount:  DB 0

; Emit new particle
; Input: B = x, C = y
EmitParticle:
    LD A, (ParticleCount)
    CP MAX_PARTICLES
    RET NC              ; Too many particles

    ; Find free slot
    LD HL, Particles
    LD D, MAX_PARTICLES

FindFreeLoop:
    LD A, (HL)          ; Check X
    CP 255              ; 255 = inactive
    JR Z, FoundFree
    INC HL
    INC HL
    INC HL
    INC HL              ; Next particle
    DEC D
    JR NZ, FindFreeLoop
    RET                 ; No free slots

FoundFree:
    ; Initialize particle
    LD (HL), B          ; X
    INC HL
    LD (HL), C          ; Y
    INC HL

    ; Random velocity
    CALL Random
    AND 7
    SUB 4               ; -4 to +3
    LD (HL), A          ; VX
    INC HL

    CALL Random
    AND 3
    NEG                 ; Upward velocity
    LD (HL), A          ; VY

    ; Increment count
    LD HL, ParticleCount
    INC (HL)
    RET

; Update all particles
UpdateParticles:
    LD HL, Particles
    LD B, MAX_PARTICLES

UpdateLoop:
    PUSH BC
    PUSH HL

    ; Check if active
    LD A, (HL)
    CP 255
    JP Z, NextParticle

    ; Update position
    LD B, (HL)          ; X
    INC HL
    LD C, (HL)          ; Y
    INC HL
    LD D, (HL)          ; VX
    INC HL
    LD E, (HL)          ; VY

    ; Apply velocity
    LD A, B
    ADD D
    LD B, A

    LD A, C
    ADD E
    LD C, A

    ; Apply gravity
    INC E               ; VY += 1

    ; Check bounds
    LD A, C
    CP 192
    JR NC, KillParticle

    ; Store updated values
    POP HL
    PUSH HL
    LD (HL), B          ; X
    INC HL
    LD (HL), C          ; Y
    INC HL
    LD (HL), D          ; VX
    INC HL
    LD (HL), E          ; VY

    ; Draw particle
    PUSH HL
    CALL PlotPixel
    POP HL
    JR NextParticle

KillParticle:
    POP HL
    PUSH HL
    LD (HL), 255        ; Mark as inactive
    LD HL, ParticleCount
    DEC (HL)

NextParticle:
    POP HL
    POP BC
    INC HL
    INC HL
    INC HL
    INC HL
    DJNZ UpdateLoop
    RET
```

## Visual Transitions

### Screen Wipe Effects

**Visual Transitions:**

```assembly
; Screen transition effects
; Various wipe and fade effects

DISPLAY_FILE    EQU 16384

; Horizontal wipe effect
HorizontalWipe:
    LD B, 32            ; 32 columns

HWipeLoop:
    PUSH BC

    ; Clear column
    LD A, 32
    SUB B               ; Current column
    LD D, A

    ; Clear all rows in column
    LD C, 192           ; All rows
    LD HL, DISPLAY_FILE

    ; Calculate column start
    LD A, D
    AND 31
    LD E, A
    LD D, 0
    ADD HL, DE

ClearColumn:
    LD (HL), 0          ; Clear byte

    ; Next row (complex calculation)
    PUSH DE
    LD DE, 32
    ADD HL, DE

    ; Check for third boundary
    LD A, H
    AND 7
    JR NZ, SameThird

    ; Crossed third boundary
    LD DE, 2048-256     ; Adjust
    ADD HL, DE

SameThird:
    POP DE
    DEC C
    JR NZ, ClearColumn

    ; Small delay for effect
    LD BC, 500
WipeDelay:
    DEC BC
    LD A, B
    OR C
    JR NZ, WipeDelay

    POP BC
    DJNZ HWipeLoop
    RET

; Spiral wipe effect
SpiralWipe:
    ; Start from center
    LD D, 16            ; Center X (chars)
    LD E, 12            ; Center Y (chars)
    LD B, 1             ; Initial radius

SpiralLoop:
    PUSH BC
    PUSH DE

    ; Draw spiral ring
    CALL DrawSpiralRing

    ; Delay
    LD BC, 1000
SpiralDelay:
    DEC BC
    LD A, B
    OR C
    JR NZ, SpiralDelay

    POP DE
    POP BC

    ; Increase radius
    INC B
    LD A, B
    CP 20               ; Max radius
    JR C, SpiralLoop
    RET

DrawSpiralRing:
    ; Simplified - just clear a square ring
    ; (Full implementation would draw actual spiral)
    RET

; Dissolve effect
DissolveEffect:
    ; Use pseudo-random pattern
    LD HL, 0            ; Random seed
    LD B, 100           ; Iterations

DissolveLoop:
    PUSH BC

    ; Generate random position
    ; Simple LFSR
    LD A, H
    RRA
    LD A, L
    RRA
    XOR H
    LD H, A

    ; Use as screen position
    LD A, H
    AND 31              ; X coordinate
    LD D, A
    LD A, L
    AND 191             ; Y coordinate
    LD E, A

    ; Clear 8x8 block at position
    LD B, 8

ClearBlock:
    PUSH BC
    PUSH DE

    ; Calculate screen address
    ; (Simplified for demo)
    LD HL, DISPLAY_FILE
    LD A, E
    AND 248
    LD L, A
    LD A, D
    ADD L
    LD L, A

    LD (HL), 0

    POP DE
    POP BC
    INC E
    DJNZ ClearBlock

    ; Update seed
    INC HL

    POP BC
    DJNZ DissolveLoop
    RET

; Test transitions
TestTransitions:
    ; Fill screen with pattern first
    LD HL, DISPLAY_FILE
    LD BC, 6144
    LD A, 10101010b
FillLoop:
    LD (HL), A
    INC HL
    DEC BC
    LD A, B
    OR C
    JR NZ, FillLoop

    ; Wait
    LD BC, 20000
Wait1:
    DEC BC
    LD A, B
    OR C
    JR NZ, Wait1

    ; Do horizontal wipe
    CALL HorizontalWipe

    ; Refill for next effect
    LD HL, DISPLAY_FILE
    LD BC, 6144
    LD A, 11110000b
FillLoop2:
    LD (HL), A
    INC HL
    DEC BC
    LD A, B
    OR C
    JR NZ, FillLoop2

    ; Wait
    LD BC, 20000
Wait2:
    DEC BC
    LD A, B
    OR C
    JR NZ, Wait2

    ; Do dissolve
    CALL DissolveEffect

    LD B, 255           ; Success
    RET

; Simple random number generator
Random:
    LD A, R             ; Use refresh register
    XOR 23
    RET

PlotPixel:
    ; (Standard implementation)
    RET
```

## Performance Optimization

### Effect Optimization Techniques

```text
; Optimized effect rendering
; 1. Unroll critical loops
UnrolledClear:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE+1
    LD BC, 6143
    LD (HL), 0
    LDIR
    RET

; 2. Use lookup tables for complex calculations
SinTable:
    DB 128, 140, 152, 164, 176, 187, 198, 208
    DB 218, 227, 235, 242, 248, 253, 255, 257
    ; ... etc

; 3. Precalculate animation frames
PreCalcFrames:
    ; Generate all rotation angles at startup
    LD B, 16            ; 16 angles
    LD HL, RotationData

CalcLoop:
    ; Calculate rotated sprite
    ; Store in buffer
    DJNZ CalcLoop
    RET

; 4. Dirty rectangle updates
UpdateDirtyOnly:
    ; Only redraw changed areas
    LD A, (DirtyFlag)
    OR A
    RET Z               ; Nothing to update

    ; Update only dirty region
    CALL UpdateDirtyRect

    XOR A
    LD (DirtyFlag), A
    RET
```

## Complete Effects System

**Complete Effects System:**

```assembly
; Integrated effects demonstration
; Combines gradients, transparency, animation, and particles

DISPLAY_FILE    EQU 16384

; Effect types
EFFECT_GRADIENT:    EQU 0
EFFECT_PARTICLES:   EQU 1
EFFECT_TRANSITION:  EQU 2
EFFECT_ANIMATION:   EQU 3

CurrentEffect:      DB 0
EffectTimer:        DW 0

; Main effects engine
EffectsEngine:
    ; Initialize
    CALL ClearScreen
    LD HL, 0
    LD (EffectTimer), HL

MainEffectLoop:
    ; Update current effect
    LD A, (CurrentEffect)
    OR A
    JP Z, RunGradient
    DEC A
    JP Z, RunParticles
    DEC A
    JP Z, RunTransition
    JP RunAnimation

RunGradient:
    ; Animated gradient effect
    LD HL, (EffectTimer)
    LD A, L
    AND 31              ; Use timer for animation
    LD D, A             ; Offset

    ; Draw moving gradient
    LD E, 50            ; Y position
    LD B, 200           ; Width
    LD C, 60            ; Height
    ; Would call gradient with offset

    JR UpdateEffect

RunParticles:
    ; Particle fountain effect
    LD HL, (EffectTimer)
    LD A, L
    AND 3
    JR NZ, UpdateParticlesOnly

    ; Emit new particle every 4 frames
    LD B, 128           ; Center X
    LD C, 150           ; Bottom Y
    ; Would call EmitParticle

UpdateParticlesOnly:
    ; Would call UpdateParticles
    JR UpdateEffect

RunTransition:
    ; Wipe transition
    LD HL, (EffectTimer)
    LD A, L
    CP 64
    JR NC, TransitionDone

    ; Progressive wipe based on timer
    ; Would implement transition step
    JR UpdateEffect

TransitionDone:
    ; Move to next effect
    LD A, (CurrentEffect)
    INC A
    AND 3               ; Wrap around
    LD (CurrentEffect), A
    LD HL, 0
    LD (EffectTimer), HL
    JR UpdateEffect

RunAnimation:
    ; Sprite animation
    ; Would update animated sprites

UpdateEffect:
    ; Increment timer
    LD HL, (EffectTimer)
    INC HL
    LD (EffectTimer), HL

    ; Check for effect change
    LD A, H
    CP 2                ; Change after 512 frames
    JR C, ContinueEffect

    ; Next effect
    LD A, (CurrentEffect)
    INC A
    AND 3
    LD (CurrentEffect), A
    LD HL, 0
    LD (EffectTimer), HL

ContinueEffect:
    ; Frame delay
    LD BC, 1000
FrameDelay:
    DEC BC
    LD A, B
    OR C
    JR NZ, FrameDelay

    ; Check exit (simplified)
    LD A, (EffectTimer)
    CP 255
    JR NZ, MainEffectLoop

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

; Demo of all effects
EffectsDemo:
    ; Run effects engine
    CALL EffectsEngine

    ; Show final message
    ; Would display 'Effects Complete!'

    LD B, 255
    RET
```

## Key Takeaways

You've mastered advanced graphics effects:

1. **Gradients**: Dithering patterns for smooth transitions
2. **Transparency**: Pattern-based alpha simulation
3. **Animation**: Frame buffers and sprite systems
4. **Particles**: Dynamic effect systems
5. **Transitions**: Professional screen wipes
6. **Optimization**: Performance techniques for real-time effects

## What's Next?

In the next lesson, we'll implement file operations to save and load artwork. You'll learn to persist drawings, create file formats, and build a complete save/load system for our Spectrum Saga!

## Fun Fact

The dithering techniques you learned were crucial for early computer graphics. Bill Atkinson's breakthrough dithering algorithm for the original Macintosh (1984) allowed stunning grayscale images on a 1-bit display. The ZX Spectrum community developed incredible tricks to simulate effects - the "multicolor" technique alternated two attribute colors every frame to create the illusion of new colors! Demo scene programmers pushed these techniques to extremes, creating effects that seemed impossible on such limited hardware. Many modern indie games deliberately use these retro techniques for their distinctive aesthetic!
