---
title: "Creating Your First Game World"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 1
description: "Welcome to Cosmic Harvester! Create your first game world with an animated starfield background using authentic 6502 assembly programming."
learning_objectives:
  - "Understand C64 screen memory layout and character mode graphics"
  - "Learn basic 6502 assembly structure and syntax"
  - "Master memory-mapped I/O for graphics control"
  - "Create animated background effects using screen manipulation"
  - "Set up the foundation for your first complete game"
concepts:
  - "Screen memory ($0400-$07E7)"
  - "Color memory ($D800-$DBE7)"
  - "VIC-II graphics chip basics"
  - "6502 registers (A, X, Y)"
  - "Memory addressing modes"
  - "PETSCII character set"
difficulty: "beginner"
estimated_duration: "45-60 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "C64 Memory Map Reference"
    url: "https://www.c64-wiki.com/wiki/Memory_Map"
    type: "reference"
  - title: "PETSCII Character Set"
    url: "https://www.c64-wiki.com/wiki/PETSCII"
    type: "reference"
order: 1
---

# Lesson 1: Creating Your First Game World

Welcome to **Cosmic Harvester**! You're about to create your first complete retro game using authentic 6502 assembly language. This isn't just theory - by the end of this lesson, you'll have stars twinkling across your screen and the foundation of a real space arcade game.

## What You'll Build Today

- **Animated starfield background** - Stars that twinkle and move
- **Game world foundation** - The space environment for your game
- **Your first 6502 assembly program** - Real code that runs on the C64

## The Big Picture

Every great game starts with its world. In **Cosmic Harvester**, you're piloting a ship through dangerous space filled with asteroids and energy crystals. Today we create that space - a dynamic starfield that makes players feel like they're moving through the cosmos.

## Understanding the C64 Screen

The Commodore 64 displays text and graphics using **character mode** - think of it as a grid of 40×25 characters. Each position can display one of 256 different characters, each with its own color.

### Screen Memory Layout

```
Screen Memory: $0400-$07E7 (1000 bytes)
Color Memory:  $D800-$DBE7 (1000 bytes)
```

- **Screen memory** holds which character to display at each position (PETSCII code)
- **Color memory** holds the color for each character (0-15)
- **40 columns × 25 rows = 1000 positions**

## PETSCII Character Codes

The C64 uses PETSCII (PET Standard Code of Information Interchange):
- `$20` - Space character
- `$2A` - Asterisk (*) - perfect for stars
- `$2E` - Period (.) - smaller stars
- `$A0` - Shifted space (reverse video space)

## Your First Assembly Program

Let's start with the basic structure every C64 program needs:

```asm6502
; cosmic-harvester-lesson-01.asm
; Create animated starfield for Cosmic Harvester

        * = $0801           ; BASIC start address

        ; BASIC header: 10 SYS 2064
        !byte $0c,$08,$0a,$00,$9e
        !text "2064"
        !byte $00,$00,$00

        * = $0810           ; Our code starts here ($0810 = 2064 decimal)

start:
        ; Set up our game world
        jsr clear_screen
        jsr create_starfield
        jmp animate_stars       ; Jump directly to animation (no return)
```

### Understanding the Code

**BASIC Header**: The C64 needs this to run our assembly code. It creates a BASIC program that says "10 SYS 2064" - telling BASIC to jump to our assembly code at address $0810.

**JSR (Jump to SubRoutine)**: We organize our code into subroutines - like functions that do specific jobs.

## Creating the Starfield

Now let's create our animated starfield:

```asm6502
clear_screen:
        lda #$20            ; Space character (PETSCII 32)
        ldx #$00            ; Start at position 0
        
clear_loop:
        sta $0400,x         ; Store space in screen memory
        sta $0500,x         ; Continue through screen memory
        sta $0600,x         ; (screen memory spans $0400-$07E7)
        sta $0700,x         ; Last partial page
        
        lda #$00            ; Black color
        sta $d800,x         ; Store in color memory
        sta $d900,x         ; Continue through color memory
        sta $da00,x         ; (color memory spans $D800-$DBE7)
        sta $db00,x         ; Last partial page
        
        lda #$20            ; Reload space character
        inx                 ; Next position
        bne clear_loop      ; Loop until X wraps to 0 (256 iterations)
        
        ; Clear remaining screen memory (positions 256-999)
        ldx #$E7            ; End of screen memory offset
clear_remaining:
        sta $0400,x         ; Clear remaining screen positions
        lda #$00            ; Black color
        sta $d800,x         ; Clear remaining color positions
        lda #$20            ; Reload space character
        dex                 ; Previous position
        cpx #$FF            ; Have we gone past 255?
        bne clear_remaining ; If not, continue
        
        rts
```

### Key 6502 Concepts

**LDA (Load Accumulator)**: Loads a value into the A register
**STA (Store Accumulator)**: Stores the A register value to memory
**INX (Increment X)**: Adds 1 to the X register
**BNE (Branch if Not Equal)**: Loops while the zero flag is clear
**CPX (Compare X)**: Compares X register with a value

## Adding the Stars

```asm6502
create_starfield:
        lda #$2A            ; Asterisk character (our star)
        
        ; Place stars at various screen positions
        sta $0420           ; Row 1, column 0
        sta $0445           ; Row 1, column 37
        sta $04a3           ; Row 4, column 3
        sta $0502           ; Row 6, column 18
        sta $0567           ; Row 8, column 39
        sta $05c8           ; Row 11, column 16
        sta $0623           ; Row 13, column 27
        sta $0691           ; Row 16, column 17
        sta $06f5           ; Row 19, column 5
        sta $0738           ; Row 20, column 24
        
        ; Set star colors (white and light gray)
        lda #$01            ; White color
        sta $d820           ; Color for star at $0420
        sta $d845           ; Color for star at $0445
        sta $d8a3           ; Color for star at $04a3
        sta $d902           ; Color for star at $0502
        sta $d967           ; Color for star at $0567
        
        lda #$0F            ; Light gray color
        sta $d9c8           ; Color for star at $05c8
        sta $da23           ; Color for star at $0623
        sta $da91           ; Color for star at $0691
        sta $daf5           ; Color for star at $06f5
        sta $db38           ; Color for star at $0738
        
        rts
```

## Making Stars Twinkle

```asm6502
animate_stars:
        ldx #$00            ; Color index
        ldy #$00            ; Frame counter
animate_loop:
        ; Wait for vertical blank (raster line 255)
        jsr wait_vblank
        
        ; Only change colors every 15 frames (about 3 times per second)
        iny
        cpy #$0F            ; Have we waited 15 frames?
        bne animate_loop    ; If not, just wait another frame
        
        ldy #$00            ; Reset frame counter
        
        ; Cycle through colors for twinkling effect
        lda twinkle_colors,x
        sta $d820           ; First star
        sta $d845           ; Second star
        sta $d8a3           ; Third star
        sta $d902           ; Fourth star
        sta $d967           ; Fifth star
        sta $d9c8           ; Sixth star
        sta $da23           ; Seventh star
        sta $da91           ; Eighth star
        sta $daf5           ; Ninth star
        sta $db38           ; Tenth star
        
        inx
        cpx #$04            ; Check if we've gone through all 4 colors
        bne animate_loop    ; If not, continue with next color
        ldx #$00            ; Reset to first color
        jmp animate_loop    ; Continue looping forever

wait_vblank:
        ; Wait for raster line 255 (start of vertical blank)
wait_vb1:
        lda $d012           ; Read current raster line
        cmp #$ff            ; Are we at line 255?
        bne wait_vb1        ; If not, keep waiting
        
        ; Wait for raster line to change (ensures we catch the transition)
wait_vb2:
        lda $d012           ; Read current raster line
        cmp #$ff            ; Are we still at line 255?
        beq wait_vb2        ; If yes, keep waiting for it to change
        rts
        
twinkle_colors:
        !byte $01,$0F,$0C,$0B    ; White, Light Gray, Medium Gray, Dark Gray
```

## Vertical Sync Timing

Instead of using arbitrary delay loops, we synchronize our animation with the screen refresh rate by waiting for the **vertical blank** period. This ensures smooth animation without tearing or timing issues.

The `wait_vblank` routine reads the VIC-II raster register (`$D012`) and waits for raster line 255, which marks the start of the vertical blank period. This gives us perfectly timed animation that runs at exactly 50Hz (PAL) or 60Hz (NTSC).

## Complete Working Program

Here's your complete, tested program:

```asm6502
; cosmic-harvester-lesson-01.asm
; Create animated starfield for Cosmic Harvester

        * = $0801           ; BASIC start address

        ; BASIC header: 10 SYS 2064
        !byte $0c,$08,$0a,$00,$9e
        !text "2064"
        !byte $00,$00,$00

        * = $0810           ; Our code starts here

start:
        jsr clear_screen
        jsr create_starfield
        jmp animate_stars   ; Jump directly to animation (no return)

clear_screen:
        ; Set border and background colors to black
        lda #$00            ; Black color
        sta $d020           ; Border color
        sta $d021           ; Background color
        
        ; Clear screen memory (1000 bytes total)
        lda #$20            ; Space character (PETSCII 32)
        ldx #$00
clear_loop1:
        sta $0400,x         ; Screen memory page 1
        sta $0500,x         ; Screen memory page 2  
        sta $0600,x         ; Screen memory page 3
        sta $0700,x         ; Screen memory page 4 (partial)
        inx
        bne clear_loop1
        
        ; Clear color memory (1000 bytes total)
        lda #$00            ; Black color
        ldx #$00
clear_loop2:
        sta $d800,x         ; Color memory page 1
        sta $d900,x         ; Color memory page 2
        sta $da00,x         ; Color memory page 3
        sta $db00,x         ; Color memory page 4 (partial)
        inx
        bne clear_loop2
        rts

create_starfield:
        lda #$2A            ; Asterisk character (PETSCII 42)
        
        ; Place stars at various screen positions
        sta $0420           ; Row 1, column 0
        sta $0445           ; Row 1, column 37
        sta $04a3           ; Row 4, column 3
        sta $0502           ; Row 6, column 18
        sta $0567           ; Row 8, column 39
        sta $05c8           ; Row 11, column 16
        sta $0623           ; Row 13, column 27
        sta $0691           ; Row 16, column 17
        sta $06f5           ; Row 19, column 5
        sta $0738           ; Row 20, column 24
        
        ; Set star colors (white and light gray)
        lda #$01            ; White color
        sta $d820           ; Color for star at $0420
        sta $d845           ; Color for star at $0445
        sta $d8a3           ; Color for star at $04a3
        sta $d902           ; Color for star at $0502
        sta $d967           ; Color for star at $0567
        
        lda #$0F            ; Light gray color
        sta $d9c8           ; Color for star at $05c8
        sta $da23           ; Color for star at $0623
        sta $da91           ; Color for star at $0691
        sta $daf5           ; Color for star at $06f5
        sta $db38           ; Color for star at $0738
        rts

animate_stars:
        ldx #$00            ; Color index
        ldy #$00            ; Frame counter
animate_loop:
        ; Wait for vertical blank (raster line 255)
        jsr wait_vblank
        
        ; Only change colors every 15 frames (about 3 times per second)
        iny
        cpy #$0F            ; Have we waited 15 frames?
        bne animate_loop    ; If not, just wait another frame
        
        ldy #$00            ; Reset frame counter
        
        ; Cycle through colors for twinkling effect
        lda twinkle_colors,x
        sta $d820           ; First star
        sta $d845           ; Second star
        sta $d8a3           ; Third star
        sta $d902           ; Fourth star
        sta $d967           ; Fifth star
        sta $d9c8           ; Sixth star
        sta $da23           ; Seventh star
        sta $da91           ; Eighth star
        sta $daf5           ; Ninth star
        sta $db38           ; Tenth star
        
        inx
        cpx #$04            ; Check if we've gone through all 4 colors
        bne animate_loop    ; If not, continue with next color
        ldx #$00            ; Reset to first color
        jmp animate_loop    ; Continue looping forever

wait_vblank:
        ; Wait for raster line 255 (start of vertical blank)
wait_vb1:
        lda $d012           ; Read current raster line
        cmp #$ff            ; Are we at line 255?
        bne wait_vb1        ; If not, keep waiting
        
        ; Wait for raster line to change (ensures we catch the transition)
wait_vb2:
        lda $d012           ; Read current raster line
        cmp #$ff            ; Are we still at line 255?
        beq wait_vb2        ; If yes, keep waiting for it to change
        rts

twinkle_colors:
        !byte $01,$0F,$0C,$0B    ; White, Light Gray, Medium Gray, Dark Gray
```

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 1 Code](https://github.com/code198x/code-samples/tree/main/commodore-64/phase-1/tier-1/lesson-001)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `acme -f cbm -o cosmic-harvester-01.prg cosmic-harvester-01.asm`
3. **Run** in VICE: `x64sc cosmic-harvester-01.prg`

**Or use the included Makefile:**
```bash
make            # Build the program
make run        # Build and run in VICE
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Clear the screen to black
- Display 10 asterisk characters as stars
- Animate the star colors in a twinkling pattern
- Loop the animation continuously

## What You've Learned

**6502 Assembly Basics**:
- Program structure with BASIC headers
- Essential instructions: LDA, STA, INX, DEX, BNE, CPX, JSR, RTS
- Memory addressing and register usage

**C64 Graphics**:
- Screen memory layout ($0400-$07E7)
- Color memory layout ($D800-$DBE7)
- PETSCII character codes

**Game Development**:
- Organizing code into subroutines
- Creating animated backgrounds
- Building the foundation for a complete game

## Your Challenge

Modify the starfield to:
1. **Add more stars** - Place 5 additional stars around the screen
2. **Use different characters** - Try periods ($2E) for smaller stars
3. **Change the timing** - Adjust the delay routine for different speeds

## Next Lesson Preview

In **Lesson 2**, we'll add your **controllable harvesting ship** to this starfield. You'll learn about keyboard input, sprite basics, and smooth movement - bringing your game world to life!

You now have your first game world running in authentic 6502 assembly. Those twinkling stars aren't just pretty - they're the foundation of **Cosmic Harvester**. 

Welcome to retro game development! 🚀