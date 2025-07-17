---
title: "Creating Your First Game World"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 1
description: "Welcome to Quantum Shatter! Create your first game world with an animated starfield background using authentic Z80 assembly programming."
learning_objectives:
  - "Understand ZX Spectrum screen and attribute memory layout"
  - "Learn basic Z80 assembly structure and syntax"
  - "Master the Spectrum's unique display system"
  - "Create animated background effects using attribute cycling"
  - "Set up the foundation for your first complete game"
concepts:
  - "Screen memory ($4000-$57FF)"
  - "Attribute memory ($5800-$5AFF)"
  - "Z80 registers and instructions"
  - "HALT instruction for timing"
  - "Bitmap and attribute manipulation"
  - "50Hz interrupt synchronization"
difficulty: "easy"
estimated_duration: "45-60 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "ZX Spectrum Memory Map"
    url: "https://worldofspectrum.org/faq/reference/48kreference.htm"
    type: "documentation"
  - title: "Z80 Instruction Set"
    url: "https://clrhome.org/table/"
    type: "documentation"
order: 1
---

# Lesson 1: Creating Your First Game World

Welcome to **Quantum Shatter**! You're about to create your first complete retro game using authentic Z80 assembly language. This isn't just theory - by the end of this lesson, you'll have stars twinkling across your screen and the foundation of a real arcade game.

## What You'll Build Today

- **Animated starfield background** - Stars that twinkle and change color
- **Game world foundation** - The space environment for your game
- **Your first Z80 assembly program** - Real code that runs on the Spectrum

## The Big Picture

Every great game starts with its world. In **Quantum Shatter**, you're piloting through quantum space filled with energy crystals and dangerous anomalies. Today we create that space - a dynamic starfield that makes players feel like they're moving through the cosmos.

## Understanding the Spectrum Display

The ZX Spectrum has a unique display system that's quite different from modern computers:

### Display Memory Layout

```
Screen Bitmap:    $4000-$57FF (6144 bytes)
Attribute Memory: $5800-$5AFF (768 bytes)
```

- **Bitmap memory** holds pixel data (1 bit per pixel, 8 pixels per byte)
- **Attribute memory** holds color information (1 byte per 8×8 character block)
- **256×192 pixels** total display resolution
- **32×24 attribute blocks**

### Attribute Byte Format

Each attribute byte controls an 8×8 pixel block:
```
Bit 7: FLASH (0=steady, 1=flashing)
Bit 6: BRIGHT (0=normal, 1=bright)
Bits 5-3: PAPER (background color)
Bits 2-0: INK (foreground color)
```

## Your First Assembly Program

Let's start with the basic structure every Spectrum program needs:

```z80
; quantum-shatter-01.asm
; Create animated starfield for Quantum Shatter

        DEVICE ZXSPECTRUM48     ; Target device

        ORG     $8000           ; Start at address 32768

; System constants
ATTRS   EQU     $5800           ; Attribute memory
BORDCR  EQU     $5C48           ; Border color system variable

; Entry point
start:
        di                      ; Disable interrupts
        
        ; Set border to black
        xor     a               ; A = 0 (black)
        out     ($FE),a         ; Set border color
        ld      (BORDCR),a      ; Update system variable
        
        ; Set up our game world
        call    clear_screen
        call    create_starfield
        
        ; Main animation loop
animate_loop:
        halt                    ; Wait for interrupt (50Hz)
        call    animate_stars
        jr      animate_loop
```

### Understanding the Code

**ORG $8000**: Our code starts at address 32768, safely above BASIC.

**DI (Disable Interrupts)**: We take control from the system.

**HALT**: This clever instruction waits for the next screen refresh interrupt (50Hz on PAL systems), giving us perfect timing for smooth animation.

## Clearing the Screen

The Spectrum's screen memory isn't linear - it has a complex layout. But we can still clear it efficiently:

```z80
clear_screen:
        ; Clear display file
        ld      hl,$4000        ; Screen start
        ld      de,$4001
        ld      bc,$17FF        ; Screen size - 1
        ld      (hl),0          ; Clear first byte
        ldir                    ; Fill rest
        
        ; Clear attributes to black on black
        ld      hl,ATTRS
        ld      de,ATTRS+1
        ld      bc,767          ; 768 - 1
        ld      (hl),0          ; Black paper, black ink
        ldir
        
        ret
```

### Key Z80 Instructions

**LD (Load)**: Moves data between registers and memory
**LDIR (Load, Increment, Repeat)**: Block copy instruction - very efficient!
**RET (Return)**: Returns from subroutine

## Creating the Starfield

We'll place individual pixels as stars:

```z80
create_starfield:
        ; Place stars by setting individual pixels
        
        ; Star 1
        ld      hl,$4020        ; Screen position
        ld      a,%10000000     ; Leftmost pixel
        ld      (hl),a
        
        ; Star 2
        ld      hl,$4048
        ld      a,%00100000     ; Different pixel position
        ld      (hl),a
        
        ; Continue for more stars...
        ; (See complete code for all 10 stars)
        
        ; Set star colors (white on black)
        ld      a,$07           ; White ink, black paper
        ld      hl,ATTRS+33     ; Attribute positions
        ld      (hl),a
        ld      hl,ATTRS+72
        ld      (hl),a
        ; Continue for all star positions...
        
        ret
```

## Making Stars Twinkle

The magic happens with attribute cycling:

```z80
; Variables
frame_counter:  DB 0
color_index:    DB 0

animate_stars:
        ; Increment frame counter
        ld      a,(frame_counter)
        inc     a
        and     15              ; Every 16 frames
        ld      (frame_counter),a
        ret     nz              ; Only update every 16th frame
        
        ; Cycle through star colors
        call    update_star_colors
        ret

update_star_colors:
        ; Get current color index
        ld      a,(color_index)
        inc     a
        and     3               ; Keep in range 0-3
        ld      (color_index),a
        
        ; Select color based on index
        cp      0
        jr      z,use_white
        cp      1
        jr      z,use_bright_white
        cp      2
        jr      z,use_cyan
        
        ; Use yellow for variety
        ld      e,$46           ; Bright yellow on black
        jr      apply_colors
        
use_white:
        ld      e,$07           ; White on black
        jr      apply_colors
        
use_bright_white:
        ld      e,$47           ; Bright white on black
        jr      apply_colors
        
use_cyan:
        ld      e,$45           ; Bright cyan on black
        
apply_colors:
        ; Update all star attributes
        ld      hl,ATTRS+33
        ld      (hl),e
        ; Continue for all stars...
        ret
```

## Complete Working Program

Here's your complete starfield program:

```z80
; quantum-shatter-01.asm
; Complete animated starfield

        DEVICE ZXSPECTRUM48
        ORG     $8000

; Constants
ATTRS   EQU     $5800
BORDCR  EQU     $5C48

; Entry point
start:
        di
        xor     a
        out     ($FE),a
        ld      (BORDCR),a
        
        call    clear_screen
        call    create_starfield
        
animate_loop:
        halt
        call    animate_stars
        jr      animate_loop

; [Include all subroutines from above]

; Data
frame_counter:  DB 0
color_index:    DB 0
program_end:

; Create TAP file
        EMPTYTAP "build/quantum-shatter-01.tap"
        SAVETAP "build/quantum-shatter-01.tap", BASIC, "loader", 10, 1, 10
        SAVETAP "build/quantum-shatter-01.tap", CODE, "quantum", start, program_end-start, start
```

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 1 Code](https://github.com/code198x/code-samples/tree/main/zx-spectrum/phase-1/tier-1/lesson-001)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `sjasmplus quantum-shatter-01.asm`
3. **Run** in emulator: Load the generated TAP file

**Or use the included Makefile:**
```bash
make            # Build the TAP file
make run        # Build and run in emulator
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Clear the screen to black with black border
- Display 10 pixels as stars across the screen
- Animate star colors: white → bright white → cyan → yellow
- Loop the animation continuously at smooth 50Hz timing

## What You've Learned

**Z80 Assembly Basics**:
- Program structure and memory organization
- Essential instructions: LD, LDIR, INC, CP, JR, CALL, RET
- Using HALT for perfect frame timing

**Spectrum Graphics**:
- Screen bitmap memory ($4000-$57FF)
- Attribute memory ($5800-$5AFF)
- Color attribute format
- Pixel manipulation

**Game Development**:
- Organizing code into subroutines
- Frame-based animation timing
- Creating visual effects with minimal resources

## Your Challenge

Modify the starfield to:
1. **Add more stars** - Try 20 stars instead of 10
2. **Different twinkle speeds** - Make some stars twinkle faster
3. **Add movement** - Make stars slowly drift across screen

## Next Lesson Preview

In **Lesson 2**, we'll add your **player ship** to this starfield. You'll learn about keyboard input, sprite drawing techniques, and smooth movement - bringing your game world to life!

You now have your first game world running in authentic Z80 assembly. Those twinkling stars aren't just pretty - they're the foundation of **Quantum Shatter**. 

Welcome to Spectrum game development! 🚀