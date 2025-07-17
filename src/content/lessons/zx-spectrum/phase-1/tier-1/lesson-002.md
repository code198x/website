---
title: "Adding the Player Ship"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 2
description: "Transform your starfield into a playable game world by adding a controllable quantum ship with smooth movement and responsive controls."
learning_objectives:
  - "Understand ZX Spectrum character-based sprites"
  - "Learn keyboard input handling using port reading"
  - "Implement smooth player movement with boundary checking"
  - "Combine background effects with interactive gameplay"
  - "Create responsive game controls that feel authentic"
concepts:
  - "Character graphics and custom characters"
  - "Keyboard matrix scanning"
  - "Screen address calculation"
  - "Attribute memory manipulation"
  - "Game loop structure"
  - "Boundary collision detection"
difficulty: "easy"
estimated_duration: "60-75 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "ZX Spectrum Keyboard Matrix"
    url: "https://worldofspectrum.org/faq/reference/keyboard.htm"
    type: "documentation"
  - title: "Character Graphics on Spectrum"
    url: "https://worldofspectrum.org/faq/reference/charmap.htm"
    type: "documentation"
order: 2
---

# Lesson 2: Adding the Player Ship

Welcome back to **Quantum Shatter**! You've created a beautiful starfield, but now it's time to add the player - a sleek quantum ship that can navigate through the cosmic void. In this lesson, you'll learn how to create interactive gameplay using authentic ZX Spectrum programming techniques.

## What You'll Build Today

- **Controllable player ship** - Smooth movement in all directions
- **Responsive controls** - Classic QAOP control scheme
- **Collision boundaries** - Keep the ship safely on screen
- **Your first game loop** - Input, update, and draw phases

## The Big Picture

Every great game needs a player character. In **Quantum Shatter**, you pilot a quantum ship through dangerous space, harvesting energy crystals while avoiding deadly anomalies. Today we add that ship and make it respond to your commands.

## Understanding Character Graphics

The ZX Spectrum uses a character-based display system that's perfect for creating simple sprites:

### Character Memory Layout

```
Character Data: $4000 + (character_code * 8)
Each character: 8 bytes (8x8 pixels)
256 characters: $4000-$47FF (2048 bytes)
```

Unlike modern systems, the Spectrum stores custom characters directly in screen memory. We can create our own ship character by writing pixel data to the right memory location.

### Character vs. Pixel Graphics

**Character Mode Benefits:**
- Fast to draw and move
- Easy collision detection
- Memory efficient
- Hardware-accelerated (sort of!)

**Perfect for:**
- Player sprites
- Enemy characters
- Collectible items
- UI elements

## Creating Your Ship Character

Let's design a ship that looks fast and futuristic:

```z80
ship_data:
        ; Ship character bitmap (8x8 pixels)
        ; Simple ship design - triangle with engines
        DB      %00010000       ; Row 0:    *
        DB      %00111000       ; Row 1:   ***
        DB      %01111100       ; Row 2:  *****
        DB      %11111110       ; Row 3: *******
        DB      %01111100       ; Row 4:  *****
        DB      %00111000       ; Row 5:   ***
        DB      %01000010       ; Row 6:  *   *  (engines)
        DB      %10000001       ; Row 7: *     * (engine flames)
```

This creates a classic spaceship silhouette with visible engine flames.

### Installing the Character

```z80
SHIP_CHAR   EQU     $80         ; Character code for our ship

create_ship_character:
        ; Copy ship data to character memory
        ld      hl,ship_data
        ld      de,$4000 + (SHIP_CHAR * 8) ; Character location
        ld      bc,8            ; 8 bytes per character
        ldir                    ; Copy ship data
        ret
```

Now we can display our ship anywhere on screen by writing character $80 to the display.

## Keyboard Input on the Spectrum

The Spectrum's keyboard is organized as a matrix that we read through I/O ports:

### The Keyboard Matrix

```
Port    Keys
$FEFE   SHIFT Z X C V
$FDFE   A S D F G
$FBFE   Q W E R T
$F7FE   1 2 3 4 5
$EFFE   0 9 8 7 6
$DFFE   P O I U Y
$BFFE   ENTER L K J H
$7FFE   SPACE SYM M N B
```

### Reading Keys

```z80
handle_input:
        ; Check Q key (Up)
        ld      bc,$FEFE        ; Row 0
        in      a,(c)
        bit     4,a             ; Q key is bit 4
        jr      nz,check_a      ; Not pressed (bit is 1)
        
        ; Q is pressed - move up
        ld      a,(player_y)
        cp      SHIP_MIN_Y
        jr      z,check_a       ; At top boundary
        dec     a
        ld      (player_y),a
```

**Key Points:**
- Pressed keys read as 0, unpressed as 1
- Use `bit` instruction to test specific key bits
- Always check boundaries before moving

## Movement Physics

Smooth movement requires careful position tracking:

### Position Variables

```z80
player_x:       DB SHIP_START_X
player_y:       DB SHIP_START_Y
old_player_x:   DB SHIP_START_X
old_player_y:   DB SHIP_START_Y
```

We store both current and previous positions so we can erase the old ship before drawing the new one.

### Boundary Checking

```z80
SHIP_MIN_X  EQU     1           ; Minimum X position
SHIP_MAX_X  EQU     30          ; Maximum X position
SHIP_MIN_Y  EQU     1           ; Minimum Y position
SHIP_MAX_Y  EQU     22          ; Maximum Y position

; Example: Moving right
check_p:
        ; Check P key (Right)
        ld      bc,$DFFE        ; Row 4
        in      a,(c)
        bit     0,a             ; P key
        jr      nz,input_done
        
        ; Move right
        ld      a,(player_x)
        cp      SHIP_MAX_X
        jr      z,input_done    ; At right boundary
        inc     a
        ld      (player_x),a
```

This prevents the ship from disappearing off the screen edges.

## Screen Address Calculation

Converting X,Y coordinates to screen addresses is crucial for fast graphics:

```z80
calc_screen_pos:
        ; Input: H = Y, L = X
        ; Output: HL = screen address
        push    de
        
        ld      a,h             ; Y coordinate
        ld      h,0
        ld      d,h
        ld      e,a             ; DE = Y
        
        ; Multiply Y by 32 (shift left 5 times)
        sla     e
        rl      d
        sla     e
        rl      d
        sla     e
        rl      d
        sla     e
        rl      d
        sla     e
        rl      d
        
        ; Add X coordinate
        ld      a,l
        add     a,e
        ld      e,a
        jr      nc,no_carry
        inc     d
no_carry:
        
        ; Add screen base address
        ld      hl,$4000
        add     hl,de
        
        pop     de
        ret
```

**Why This Works:**
- Each screen row is 32 characters wide
- Y × 32 gives us the row start address
- Adding X gives us the exact character position
- Shifting left 5 times = multiplying by 32

## The Game Loop

Modern game structure with clear phases:

```z80
game_loop:
        halt                    ; Wait for interrupt (50Hz)
        call    animate_stars   ; Update background
        call    handle_input    ; Process player input
        call    update_player   ; Update player position
        jr      game_loop       ; Continue forever
```

### Update Logic

```z80
update_player:
        ; Check if player moved
        ld      a,(player_x)
        ld      b,a
        ld      a,(old_player_x)
        cp      b
        jr      nz,player_moved
        
        ld      a,(player_y)
        ld      b,a
        ld      a,(old_player_y)
        cp      b
        jr      z,no_movement
        
player_moved:
        ; Erase old position
        call    erase_player
        
        ; Update old position
        ld      a,(player_x)
        ld      (old_player_x),a
        ld      a,(player_y)
        ld      (old_player_y),a
        
        ; Draw new position
        call    draw_player
        
no_movement:
        ret
```

This efficient approach only redraws when the player actually moves.

## Drawing and Erasing

### Drawing the Ship

```z80
draw_player:
        ; Calculate screen position
        ld      a,(player_y)
        ld      h,a
        ld      a,(player_x)
        ld      l,a
        call    calc_screen_pos
        
        ; Draw ship character
        ld      a,SHIP_CHAR
        ld      (hl),a
        
        ; Set ship color (cyan on black)
        call    calc_attr_pos
        ld      a,$05           ; Cyan ink, black paper
        ld      (hl),a
        
        ret
```

### Erasing the Ship

```z80
erase_player:
        ; Calculate old screen position
        ld      a,(old_player_y)
        ld      h,a
        ld      a,(old_player_x)
        ld      l,a
        call    calc_screen_pos
        
        ; Erase ship character
        ld      a,0
        ld      (hl),a
        
        ; Reset color
        call    calc_attr_pos
        ld      a,0             ; Black ink, black paper
        ld      (hl),a
        
        ret
```

## Complete Working Program

Here's your complete quantum ship program:

```z80
; quantum-shatter-02.asm
; Complete controllable ship with starfield

        DEVICE ZXSPECTRUM48
        ORG     $8000

; Constants
ATTRS   EQU     $5800
SHIP_CHAR   EQU     $80
SHIP_START_X EQU    15
SHIP_START_Y EQU    20

; Entry point
start:
        di
        xor     a
        out     ($FE),a
        ld      (BORDCR),a
        
        call    clear_screen
        call    create_starfield
        call    create_ship_character
        call    init_player
        
game_loop:
        halt
        call    animate_stars
        call    handle_input
        call    update_player
        jr      game_loop

; [Include all subroutines from above]

; Data
ship_data:
        DB      %00010000
        DB      %00111000
        DB      %01111100
        DB      %11111110
        DB      %01111100
        DB      %00111000
        DB      %01000010
        DB      %10000001

; Variables
player_x:       DB SHIP_START_X
player_y:       DB SHIP_START_Y
old_player_x:   DB SHIP_START_X
old_player_y:   DB SHIP_START_Y

; Create TAP file
        EMPTYTAP "build/quantum-shatter-02.tap"
        SAVETAP "build/quantum-shatter-02.tap", BASIC, "loader", 10, 1, 10
        SAVETAP "build/quantum-shatter-02.tap", CODE, "quantum", start, program_end-start, start
```

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 2 Code](https://github.com/code198x/code-samples/tree/main/zx-spectrum/phase-1/tier-1/lesson-002)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `sjasmplus quantum-shatter-02.asm`
3. **Run** in emulator: Load the generated TAP file

**Or use the included Makefile:**
```bash
make            # Build the TAP file
make run        # Build and run in emulator
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Display the animated starfield from Lesson 1
- Show a cyan ship character that responds to QAOP keys
- Prevent the ship from moving off screen edges
- Provide smooth, responsive movement

### Controls
- **Q** - Move up
- **A** - Move down  
- **O** - Move left
- **P** - Move right

## What You've Learned

**Character Graphics**:
- Creating custom 8×8 pixel characters
- Installing characters in screen memory
- Character-based sprite system

**Input Handling**:
- Reading the ZX Spectrum keyboard matrix
- Port-based input scanning
- Bit manipulation for key detection

**Movement Physics**:
- Position tracking with old/new coordinates
- Boundary checking and collision detection
- Efficient screen updates

**Game Programming**:
- Game loop structure (input → update → draw)
- Separation of concerns in code organization
- Frame-based timing with HALT instruction

## Your Challenge

Enhance your quantum ship:
1. **Add diagonal movement** - Allow combinations like Q+P for up-right
2. **Variable speed** - Make the ship move faster when holding keys longer
3. **Ship animation** - Alternate between two ship characters for engine flicker

## Next Lesson Preview

In **Lesson 3**, we'll add **quantum projectiles** to your ship! You'll learn about object arrays, projectile physics, and the foundations of combat gameplay - taking your first step toward a complete game.

You now have a fully controllable ship floating through quantum space. The foundation of **Quantum Shatter** is taking shape!

Welcome to interactive ZX Spectrum game development! 🚀