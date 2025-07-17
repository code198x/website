---
title: "Creating Your First Game World"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 1
description: "Welcome to Turbo Horizon! Create your first game world with an animated starfield background using authentic 68000 assembly programming and Amiga custom chips."
learning_objectives:
  - "Understand Amiga custom chip architecture"
  - "Learn 68000 assembly structure and syntax"
  - "Master copper list programming"
  - "Create smooth animations using hardware timing"
  - "Set up the foundation for your first complete game"
concepts:
  - "Custom chip registers ($DFF000)"
  - "Bitplane graphics system"
  - "68000 registers and instructions"
  - "Copper coprocessor"
  - "Raster beam synchronization"
  - "50Hz PAL timing"
difficulty: "beginner"
estimated_duration: "45-60 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "Amiga Hardware Reference Manual"
    url: "http://amigadev.elowar.com/read/ADCD_2.1/Hardware_Manual_guide/node0000.html"
    type: "reference"
  - title: "68000 Programmer's Reference Manual"
    url: "https://www.nxp.com/docs/en/reference-manual/M68000PRM.pdf"
    type: "reference"
order: 1
---

# Lesson 1: Creating Your First Game World

Welcome to **Turbo Horizon**! You're about to create your first complete retro game using authentic 68000 assembly language and the Amiga's legendary custom chips. This isn't just theory - by the end of this lesson, you'll have stars twinkling on your screen and the foundation of a real arcade racing game.

## What You'll Build Today

- **Animated starfield background** - Stars that twinkle and change color
- **Game world foundation** - The high-speed racing environment
- **Your first 68000 assembly program** - Real code that runs on the Amiga

## The Big Picture

Every great game starts with its world. In **Turbo Horizon**, you're racing at breakneck speeds through a futuristic landscape. Today we create that environment - a dynamic starfield that gives players the sensation of incredible velocity as they race toward the horizon.

## Understanding the Amiga Architecture

The Amiga's custom chip architecture was revolutionary for its time:

### The Custom Chips

```
Agnus:   DMA controller, manages memory access for all chips
Denise:  Display encoder, converts bitplane data to video
Paula:   Audio (4 channels) and I/O controller
Copper:  Display coprocessor, changes registers on specific scanlines
Blitter: 2D graphics acceleration (not used in this lesson)
```

### Display System

The Amiga uses a **planar graphics** system:
- Each bitplane represents one bit of color data
- 5 bitplanes = 32 colors (2^5)
- Bitplanes are combined to form the final pixel color
- **320×256 pixels** in PAL low-resolution mode
- **50Hz refresh rate** (PAL)

### Memory Architecture

```
Chip RAM:  Accessible by custom chips ($000000-$080000 on A500)
Fast RAM:  CPU-only access (if available)
ROM:       Kickstart ROM ($FC0000-$FFFFFF)
Custom:    Chip registers ($DFF000-$DFF1FF)
```

## Your First Assembly Program

Let's start with the essential structure:

```m68k
; turbo-horizon-01.s
; Create animated starfield for Turbo Horizon

        SECTION code,CODE

;----------------------------------------------------------------
; Constants
;----------------------------------------------------------------
CUSTOM          EQU     $DFF000         ; Custom chip base

; Important registers
DMACON          EQU     $096            ; DMA control
INTENA          EQU     $09A            ; Interrupt enable
BPLCON0         EQU     $100            ; Bitplane control
COLOR00         EQU     $180            ; Color palette start

; Screen dimensions
SCREEN_WIDTH    EQU     320
SCREEN_HEIGHT   EQU     256
SCREEN_BPL      EQU     1               ; 1 bitplane for now

;----------------------------------------------------------------
; Entry point
;----------------------------------------------------------------
start:
        ; Save system state
        move.l  4.w,a6                  ; ExecBase
        jsr     -132(a6)                ; Forbid() - stop multitasking
        
        lea     CUSTOM,a5               ; Custom chip base in a5
        
        ; Save current DMA/interrupt state
        move.w  DMACONR(a5),d0
        or.w    #$8000,d0               ; Set bit 15 for enable
        move.w  d0,oldDMA
        
        ; Take over the hardware
        move.w  #$7FFF,INTENA(a5)       ; Disable all interrupts
        move.w  #$7FFF,DMACON(a5)       ; Disable all DMA
        
        ; Now we own the machine!
```

### Understanding the Code

**SECTION code,CODE**: Defines a code section that AmigaDOS can load.

**EQU directives**: Define constants for readable code.

**Forbid()**: Stops AmigaDOS multitasking so we have exclusive hardware access.

**Custom chip base**: We keep this in register a5 for fast access.

## Setting Up the Display

The Amiga's display is incredibly flexible. We'll use the Copper to set it up:

```m68k
        ; Set up display
        move.w  #$1200,BPLCON0(a5)      ; 1 bitplane, color enabled
        move.w  #$0000,BPLCON1(a5)      ; No scroll
        move.w  #$0024,DDFSTRT(a5)      ; Display data fetch start
        move.w  #$00D0,DDFSTOP(a5)      ; Display data fetch stop
        move.w  #$2C81,DIWSTRT(a5)      ; Display window start
        move.w  #$2CC1,DIWSTOP(a5)      ; Display window stop
```

### Display Parameters Explained

**BPLCON0 = $1200**: 
- Bit 9 = 1: Color composite video
- Bit 12 = 1: Enable bitplane 1

**DDF (Display Data Fetch)**: Controls when Denise fetches graphics data.

**DIW (Display Window)**: Defines the visible screen area.

## The Copper List

The Copper is a simple coprocessor that can change chip registers at specific screen positions:

```m68k
copperList:
        dc.w    COLOR00,$0000   ; Background = black
        dc.w    COLOR00+2,$0FFF ; Color 1 = white (for stars)
        
        ; Set bitplane pointer
        dc.w    BPL1PTH
bp1h:   dc.w    0               ; High word of address
        dc.w    BPL1PTL
bp1l:   dc.w    0               ; Low word of address
        
        dc.w    $FFFF,$FFFE     ; End of copper list
```

Each Copper instruction is 4 bytes:
- 2 bytes: Register address
- 2 bytes: Value to write

The special instruction `$FFFF,$FFFE` marks the end of the list.

## Creating the Starfield

We'll set individual pixels in our bitplane:

```m68k
createStarfield:
        lea     screen,a0
        
        ; Star 1 - row 20, column 5 (byte)
        move.l  a0,a1
        add.w   #20*40+5,a1     ; 40 bytes per row
        bset    #7,(a1)         ; Set leftmost pixel
        
        ; Star 2 - row 40, column 15
        move.l  a0,a1
        add.w   #40*40+15,a1
        bset    #5,(a1)         ; Set bit 5
        
        ; Continue for more stars...
        rts
```

### Bitplane Layout

In a bitplane, each bit represents one pixel:
- Bit 7 = Leftmost pixel in byte
- Bit 0 = Rightmost pixel in byte
- 320 pixels / 8 = 40 bytes per row

## Smooth Animation

We synchronize with the video beam for smooth animation:

```m68k
waitVBlank:
.wait1:
        move.l  $DFF004,d0      ; VPOSR/VHPOSR
        and.l   #$1FF00,d0      ; Vertical position
        cmp.l   #$13700,d0      ; Line 311 (PAL)
        bne.s   .wait1
.wait2:
        move.l  $DFF004,d0
        and.l   #$1FF00,d0
        cmp.l   #$13700,d0
        beq.s   .wait2          ; Wait for line to pass
        rts
```

This ensures we update exactly once per frame at 50Hz.

## Animating Colors

We'll cycle through different star colors:

```m68k
animateStars:
        ; Increment frame counter
        addq.b  #1,frameCounter
        move.b  frameCounter,d0
        and.b   #$0F,d0         ; Every 16 frames
        bne.s   .done
        
        ; Cycle color index
        addq.b  #1,colorIndex
        and.b   #$03,d0         ; Keep in range 0-3
        
        ; Update color in copper list
        lea     starColors,a0
        moveq   #0,d0
        move.b  colorIndex,d0
        add.w   d0,d0           ; Word offset
        move.w  (a0,d0.w),col1  ; Update copper list
.done:
        rts

starColors:
        dc.w    $0FFF   ; White (R=15, G=15, B=15)
        dc.w    $0AAA   ; Light gray
        dc.w    $088F   ; Light blue
        dc.w    $0F8F   ; Light purple
```

### Amiga Color Format

Colors are 12-bit RGB:
- Bits 11-8: Red (0-15)
- Bits 7-4: Green (0-15)
- Bits 3-0: Blue (0-15)

## Main Loop

Our game loop is simple and efficient:

```m68k
mainLoop:
        ; Wait for vertical blank
        bsr     waitVBlank
        
        ; Update animation
        bsr     animateStars
        
        ; Check for exit (left mouse button)
        btst    #6,$BFE001
        bne.s   mainLoop
        
        ; Restore system and exit...
```

## Complete Working Program

The complete source creates:
- A black screen with 10 white pixel stars
- Stars that cycle through different colors
- Smooth 50Hz animation
- Clean exit on mouse click

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 1 Code](https://github.com/code198x/code-samples/tree/main/commodore-amiga/phase-1/tier-1/lesson-001)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `vasmm68k_mot -Fhunkexe -o turbo-horizon-01 turbo-horizon-01.s`
3. **Create ADF**: Put the executable on a bootable Amiga disk
4. **Run** in emulator or real hardware

**Or use the included Makefile:**
```bash
make            # Build the executable
make clean      # Clean build files
```

### Running on Emulator

1. Use FS-UAE, WinUAE, or similar
2. Configure as Amiga 500, 512KB Chip RAM
3. Mount the ADF with your executable
4. From CLI: `turbo-horizon-01`

## Testing Your Code

Your program should:
- Display a black background
- Show 10 white pixels as stars
- Animate star colors smoothly at 50Hz
- Exit cleanly on left mouse click

## What You've Learned

**68000 Assembly Basics**:
- Program structure with sections
- Essential instructions: MOVE, ADD, BSR, RTS, BTST
- Working with addresses and offsets

**Amiga Hardware**:
- Custom chip architecture
- Copper list programming
- Bitplane graphics fundamentals
- Hardware timing and synchronization

**Game Development**:
- Taking over the hardware safely
- Frame-synchronized animation
- Direct hardware programming

## Your Challenge

Enhance the starfield:
1. **Add more stars** - Try 30-50 stars
2. **Multiple speeds** - Use color cycling to simulate depth
3. **Add movement** - Make stars scroll horizontally

## Next Lesson Preview

In **Lesson 2**, we'll add your **racing car sprite** to this starfield. You'll learn about the Amiga's sprite system, the Blitter for fast graphics, and joystick input - bringing high-speed racing action to life!

You now have your first Amiga game world running in authentic 68000 assembly. Those twinkling stars aren't just pretty - they're the foundation of **Turbo Horizon**.

Welcome to Amiga game development! 🏁