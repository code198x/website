---
title: "Adding the Player Ship"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 2
description: "Transform your starfield into a playable game world by adding a controllable harvesting ship with smooth movement and responsive controls."
learning_objectives:
  - "Understand C64 sprite system and hardware sprites"
  - "Learn keyboard input handling using CIA chip"
  - "Implement smooth player movement with boundary checking"
  - "Combine background effects with interactive gameplay"
  - "Create responsive game controls that feel good to play"
concepts:
  - "VIC-II sprite registers ($D000-$D02E)"
  - "CIA-1 keyboard matrix ($DC00-$DC01)"
  - "Sprite data format and pointers"
  - "Movement physics and boundary detection"
  - "Game loop structure"
difficulty: "beginner"
estimated_duration: "60-75 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "C64 Sprite Reference"
    url: "https://www.c64-wiki.com/wiki/Sprite"
    type: "reference"
  - title: "CIA Chip Documentation"
    url: "https://www.c64-wiki.com/wiki/CIA"
    type: "reference"
order: 2
---

# Lesson 2: Adding the Player Ship

Your starfield is beautiful, but it's not yet a game. In this lesson, you'll add the heart of **Cosmic Harvester** - a controllable player ship that can navigate through space. By the end, you'll have a responsive ship moving smoothly across your twinkling starfield.

## What You'll Build Today

- **Player-controlled harvesting ship** - A ship that responds to your keyboard
- **Smooth movement system** - Physics-based movement that feels natural
- **Boundary detection** - Keep the ship within the game area
- **Game loop integration** - Combine ship movement with starfield animation

## The C64 Sprite System

The Commodore 64 has 8 hardware sprites - dedicated graphics objects that can move independently of the background. Each sprite is 24×21 pixels and can be positioned anywhere on screen.

### Sprite Memory Layout

```
Sprite Data: 63 bytes per sprite (21 rows × 3 bytes each)
Sprite Pointers: Screen memory + $3F8-$3FF (sprites 0-7)
```

### Key Sprite Registers

- **$D000-$D00F**: Sprite X/Y positions (sprites 0-7)
- **$D010**: Sprite X position high bits
- **$D015**: Sprite enable register
- **$D027-$D02E**: Sprite colors (sprites 0-7)

## Designing the Player Ship

For our harvesting ship, we'll create a retro design with twin engines - perfect for navigating asteroid fields and collecting crystals:

```asm6502
; Ship sprite data - Retro Classic with Twin Engines
ship_sprite:
        !byte %00000000,%00000000,%00000000    ; Row 1
        !byte %00000000,%00000000,%00000000    ; Row 2
        !byte %00000000,%00000000,%00000000    ; Row 3
        !byte %00000001,%10001100,%00000000    ; Row 4  - Twin engines
        !byte %00000011,%11001111,%00000000    ; Row 5  - Engine exhausts
        !byte %00000011,%11111111,%00000000    ; Row 6  - Main body top
        !byte %00000111,%11111111,%10000000    ; Row 7
        !byte %00000111,%11111111,%10000000    ; Row 8
        !byte %00001111,%11111111,%11000000    ; Row 9
        !byte %00001100,%11111111,%00110000    ; Row 10 - Side indents
        !byte %01111111,%11111111,%11111110    ; Row 11 - Wide center
        !byte %00001100,%11111111,%00110000    ; Row 12 - Side indents
        !byte %00001111,%11111111,%11000000    ; Row 13
        !byte %00000111,%11111111,%10000000    ; Row 14
        !byte %00000111,%11111111,%10000000    ; Row 15
        !byte %00000011,%11111111,%00000000    ; Row 16
        !byte %00000001,%10001100,%00000000    ; Row 17 - Bottom engines
        !byte %00000001,%10001100,%00000000    ; Row 18 - Engine trails
        !byte %00000000,%00000000,%00000000    ; Row 19
        !byte %00000000,%00000000,%00000000    ; Row 20
        !byte %00000000,%00000000,%00000000    ; Row 21
```

## Setting Up the Ship

```asm6502
setup_ship:
        ; Copy ship sprite data to sprite memory location
        ; We'll use sprite data area at $2000
        ldx #$00
copy_ship_loop:
        lda ship_sprite,x
        sta $2000,x
        inx
        cpx #$3F            ; 63 bytes per sprite
        bne copy_ship_loop
        
        ; Set sprite pointer for sprite 0
        ; Screen memory + $3F8 = $07F8
        lda #$80            ; $2000 / 64 = $80
        sta $07F8
        
        ; Enable sprite 0
        lda #$01
        sta $D015
        
        ; Set sprite color (cyan for better visibility)
        lda #$03
        sta $D027
        
        ; Initial ship position (center of screen)
        lda ship_x
        sta $D000           ; X position
        lda ship_y
        sta $D001           ; Y position
        
        ; Clear X position high bit
        lda $D010
        and #%11111110      ; Clear bit 0 (sprite 0 X high bit)
        sta $D010
        
        rts
```

## Reading Keyboard Input

The C64 keyboard is organized as an 8×8 matrix. For authentic C64-era controls, we'll use the **Q/A/O/P** layout - a popular choice in British games:

- **Q** = Up
- **A** = Down  
- **O** = Left
- **P** = Right

```asm6502
read_keyboard:
        ; Classic C64 keyboard controls: Q/A/O/P
        ; Q = Up, A = Down, O = Left, P = Right
        
        ; Check 'O' key (row 4, bit 6)
        lda #$EF            ; Select row 4
        sta $DC00
        lda $DC01
        and #$40            ; Bit 6 = O
        bne check_p
        
        ; O pressed - move left
        lda ship_x
        sec
        sbc #$02
        cmp #$18            ; Left boundary
        bcc check_p
        sta ship_x
        
check_p:
        ; Check 'P' key (row 5, bit 1)
        lda #$DF            ; Select row 5
        sta $DC00
        lda $DC01
        and #$02            ; Bit 1 = P
        bne check_q
        
        ; P pressed - move right
        lda ship_x
        clc
        adc #$02
        cmp #$E0            ; Right boundary
        bcs check_q
        sta ship_x
        
check_q:
        ; Check 'Q' key (row 7, bit 6)
        lda #$7F            ; Select row 7
        sta $DC00
        lda $DC01
        and #$40            ; Bit 6 = Q
        bne check_a
        
        ; Q pressed - move up
        lda ship_y
        sec
        sbc #$02
        cmp #$32            ; Top boundary
        bcc check_a
        sta ship_y
        
check_a:
        ; Check 'A' key (row 1, bit 2)
        lda #$FD            ; Select row 1
        sta $DC00
        lda $DC01
        and #$04            ; Bit 2 = A
        bne keyboard_done
        
        ; A pressed - move down
        lda ship_y
        clc
        adc #$02
        cmp #$E0            ; Bottom boundary
        bcs keyboard_done
        sta ship_y
        
keyboard_done:
        rts
```

## Updating Ship Position

```asm6502
update_ship:
        ; Update sprite 0 position
        lda ship_x
        sta $D000           ; X position low byte
        
        ; For now, we keep X position < 255 so no high bit needed
        ; Clear high bit
        lda $D010
        and #$FE
        sta $D010
        
        lda ship_y
        sta $D001           ; Y position
        rts
```

## Complete Game Loop

```asm6502
; cosmic-harvester-lesson-02.asm
; Add player ship to starfield

        * = $0801           ; BASIC start address

        ; BASIC header: 10 SYS 2064
        !byte $0c,$08,$0a,$00,$9e
        !text "2064"
        !byte $00,$00,$00

        * = $0810           ; Our code starts here

start:
        jsr clear_screen
        jsr create_starfield
        jsr setup_ship
        jmp game_loop       ; Main game loop

game_loop:
        jsr wait_vblank
        jsr update_stars
        jsr read_keyboard
        jsr update_ship
        jmp game_loop

; Ship position variables
ship_x: !byte $A0          ; Ship X position (160 - center)
ship_y: !byte $80          ; Ship Y position (128 - center)

; Star animation variables
star_frame_counter: !byte $00
star_color_index: !byte $00

update_stars:
        ; Only change colors every 15 frames
        inc star_frame_counter
        lda star_frame_counter
        cmp #$0F
        bne stars_done
        
        ; Reset frame counter
        lda #$00
        sta star_frame_counter
        
        ; Update star colors
        ldx star_color_index
        lda twinkle_colors,x
        sta $d820           ; All star colors
        sta $d845
        sta $d8a3
        sta $d902
        sta $d967
        sta $d9c8
        sta $da23
        sta $da91
        sta $daf5
        sta $db38
        
        ; Next color
        inc star_color_index
        lda star_color_index
        cmp #$04
        bne stars_done
        lda #$00
        sta star_color_index
        
stars_done:
        rts

; [Include all subroutines: clear_screen, create_starfield, 
;  wait_vblank, setup_ship, read_keyboard, update_ship]

; Ship sprite data at end of program
ship_sprite:
        ; [Complete 63-byte sprite data as shown above]

twinkle_colors:
        !byte $01,$0F,$0C,$0B    ; White, Light Gray, Medium Gray, Dark Gray
```

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 2 Code](https://github.com/code198x/code-samples/tree/main/commodore-64/phase-1/tier-1/lesson-002)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `acme -f cbm -o cosmic-harvester-02.prg cosmic-harvester-02.asm`
3. **Run** in VICE: `x64sc cosmic-harvester-02.prg`

**Or use the included Makefile:**
```bash
make            # Build the program
make run        # Build and run in VICE
make clean      # Clean build files
```

## Testing Your Ship

When you run the program, you should see:
- **Twinkling starfield** background (from Lesson 1)
- **Cyan ship sprite** with visible twin engines
- **Q/A/O/P controls** - authentic C64-era keyboard layout
- **Smooth movement** - ship moves 2 pixels per frame when key held
- **Boundary detection** - ship stays within screen limits

### Control Scheme

```
    Q (Up)
      |
O (Left) -- P (Right)
      |
   A (Down)
```

## What You've Learned

**Sprite System**:
- Sprite data format and memory layout
- Sprite pointers and enable registers
- Sprite positioning and color control

**Input Handling**:
- CIA-1 keyboard matrix scanning
- Q/A/O/P control implementation
- Responsive movement implementation

**Game Structure**:
- Main game loop organization
- Separating concerns (stars, input, ship)
- Frame-based animation timing

## Your Challenge

Enhance your ship:
1. **Add diagonal movement** - Handle multiple keys pressed simultaneously
2. **Implement momentum** - Add acceleration and deceleration
3. **Change ship color** - Try yellow ($07) or green ($05)
4. **Add ship animation** - Make the engine exhausts flicker

## Next Lesson Preview

In **Lesson 3**, we'll add **asteroids** to avoid and **energy crystals** to collect. You'll learn about collision detection, random number generation, and the core gameplay mechanics that make Cosmic Harvester challenging and fun!

Your ship is ready for adventure! 🚀