---
title: "Adding the Player Ship"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 2
description: "Transform your starfield into a playable game world by adding a sprite-based assault ship with smooth movement and responsive controls."
learning_objectives:
  - "Understand NES sprite system and hardware sprites"
  - "Learn controller input handling and button reading"
  - "Implement smooth sprite movement with boundary checking"
  - "Master OAM management and sprite DMA transfers"
  - "Create responsive game controls that feel professional"
concepts:
  - "Hardware sprites and OAM ($0200-$02FF)"
  - "Controller reading via $4016/$4017"
  - "Sprite DMA transfers ($4014)"
  - "NMI-based sprite updates"
  - "Movement physics and boundary detection"
  - "Sprite palettes and attributes"
difficulty: "easy"
estimated_duration: "60-75 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "NES Sprite System"
    url: "https://www.nesdev.org/wiki/PPU_OAM"
    type: "documentation"
  - title: "NES Controller Reading"
    url: "https://www.nesdev.org/wiki/Controller_reading_code"
    type: "documentation"
order: 2
---

# Lesson 2: Adding the Player Ship

Welcome back to **Underground Assault**! You've created a mesmerizing starfield, but now it's time to add the player - a powerful assault ship that can navigate through the dangerous underground caverns. In this lesson, you'll learn about the NES's sophisticated sprite system and create fluid, responsive gameplay.

## What You'll Build Today

- **Sprite-based player ship** - Hardware-accelerated graphics
- **Responsive controls** - Classic NES D-pad movement
- **Smooth movement physics** - 60Hz fluid motion
- **Professional game loop** - Input, update, and render phases

## The Big Picture

Every great NES game starts with great sprites. In **Underground Assault**, you pilot a heavily-armed ship through treacherous underground tunnels, battling enemies and avoiding obstacles. Today we add that ship using the NES's powerful hardware sprite system.

## Understanding NES Sprites

The NES has dedicated hardware for rendering up to 64 sprites simultaneously:

### Sprite Hardware Overview

```
OAM (Object Attribute Memory): $0200-$02FF (256 bytes)
Each sprite: 4 bytes (Y, tile, attributes, X)
Maximum sprites: 64 (4 bytes × 64 = 256 bytes)
Sprite size: 8×8 or 8×16 pixels
```

### Sprite Data Format

Each sprite requires 4 bytes in OAM:

```
Byte 0: Y position (0-239)
Byte 1: Tile number (0-255)
Byte 2: Attributes (palette, priority, flip)
Byte 3: X position (0-255)
```

### Sprite Attributes (Byte 2)

```
Bit 7-6: Unused
Bit 5:   Priority (0=in front of BG, 1=behind BG)
Bit 4:   Horizontal flip
Bit 3:   Vertical flip
Bit 2:   Unused
Bit 1-0: Palette (0-3)
```

## Setting Up Your Player Ship

Let's create a sleek assault ship sprite:

### Player Ship Graphics

```asm6502
; Tile 2 - Player ship
.byte %00001000     ; Row 0:     *
.byte %00011100     ; Row 1:    ***
.byte %00111110     ; Row 2:   *****
.byte %01111111     ; Row 3:  *******
.byte %01111111     ; Row 4:  *******
.byte %00111110     ; Row 5:   *****
.byte %00100010     ; Row 6:   *   * (weapons)
.byte %01000001     ; Row 7:  *     * (engines)
; Bit plane 2 (for color detail)
.byte %00000000
.byte %00001000
.byte %00011100
.byte %00111110
.byte %00111110
.byte %00011100
.byte %00011100
.byte %00111110
```

This creates a military-style ship with visible weapons and engines.

### Initializing the Player Sprite

```asm6502
.proc InitPlayer
  ; Set starting position
  lda #PLAYER_START_X
  sta player_x
  lda #PLAYER_START_Y
  sta player_y
  
  ; Set up player sprite in OAM
  lda player_y
  sta $0200       ; Sprite 0 Y position
  lda #$02        ; Sprite tile (player ship)
  sta $0201       ; Sprite 0 tile
  lda #%00000001  ; Palette 1, no flip
  sta $0202       ; Sprite 0 attributes
  lda player_x
  sta $0203       ; Sprite 0 X position
  
  rts
.endproc
```

**Key Points:**
- We use sprite 0 (OAM addresses $0200-$0203)
- Tile #2 contains our ship graphics
- Palette 1 gives us orange/green colors
- No flipping or priority changes needed

## NES Controller Input

The NES controller is read through a clever shift register system:

### Controller Reading Process

```asm6502
.proc ReadController
  ; Store previous buttons
  lda buttons
  sta buttons_old
  
  ; Strobe controller
  lda #$01
  sta CONTROLLER1   ; Start reading
  lda #$00
  sta CONTROLLER1   ; Stop strobe
  
  ; Read 8 buttons
  ldx #$08
ReadLoop:
  lda CONTROLLER1
  lsr               ; Button state in carry
  rol buttons       ; Rotate into buttons
  dex
  bne ReadLoop
  
  rts
.endproc
```

### Button Order

The NES reads buttons in this order:
1. A
2. B
3. Select
4. Start
5. Up
6. Down
7. Left
8. Right

### Why This Works

- **Strobe pulse** tells the controller to load all button states
- **8 reads** shift each button state into the carry flag
- **ROL (Rotate Left)** builds our button byte bit by bit
- **Pressed buttons** read as 1, unpressed as 0

## Movement Physics

Smooth movement requires careful input handling:

### Movement Constants

```asm6502
PLAYER_START_X = 120    ; Starting X position (middle of screen)
PLAYER_START_Y = 200    ; Starting Y position (near bottom)
PLAYER_MIN_X   = 8      ; Minimum X position
PLAYER_MAX_X   = 240    ; Maximum X position
PLAYER_MIN_Y   = 16     ; Minimum Y position
PLAYER_MAX_Y   = 220    ; Maximum Y position
PLAYER_SPEED   = 2      ; Movement speed
```

### Update Logic

```asm6502
.proc UpdatePlayer
  ; Check for up movement
  lda buttons
  and #BUTTON_UP
  beq CheckDown
  
  ; Move up
  lda player_y
  cmp #PLAYER_MIN_Y
  bcc CheckDown   ; Already at minimum
  sec
  sbc #PLAYER_SPEED
  sta player_y
  
CheckDown:
  lda buttons
  and #BUTTON_DOWN
  beq CheckLeft
  
  ; Move down
  lda player_y
  cmp #PLAYER_MAX_Y
  bcs CheckLeft   ; Already at maximum
  clc
  adc #PLAYER_SPEED
  sta player_y
  
  ; Continue for left/right...
  
UpdateDone:
  ; Update sprite position in OAM
  lda player_y
  sta $0200       ; Sprite 0 Y position
  lda player_x
  sta $0203       ; Sprite 0 X position
  
  rts
.endproc
```

**Movement Features:**
- **Boundary checking** prevents ship from leaving screen
- **Configurable speed** allows fine-tuning
- **Immediate OAM update** for responsive feel

## Sprite DMA Transfer

The NES provides hardware DMA for efficient sprite updates:

### DMA in the NMI Handler

```asm6502
.proc NMI
  pha              ; Save registers
  txa
  pha
  tya
  pha

  ; Sprite DMA transfer
  lda #$00
  sta OAMADDR      ; Start at OAM address 0
  lda #$02
  sta OAMDMA       ; Transfer 256 bytes from $0200

  ; ... rest of NMI handler
  
  pla              ; Restore registers
  tay
  pla
  tax
  pla
  rti
.endproc
```

### Why Use DMA?

- **Hardware acceleration** - 256 bytes transferred in ~513 cycles
- **Timing critical** - Must happen during vblank
- **Atomic operation** - No interruption during transfer
- **Efficient** - Frees CPU for other tasks

## Sprite Palettes

The NES has 4 dedicated sprite palettes:

### Palette Setup

```asm6502
palette:
  ; Background palette
  .byte $0F,$30,$30,$30  ; BG palette 0 (black, white variations)
  .byte $0F,$0F,$0F,$0F  ; BG palette 1
  .byte $0F,$0F,$0F,$0F  ; BG palette 2
  .byte $0F,$0F,$0F,$0F  ; BG palette 3
  
  ; Sprite palette
  .byte $0F,$0C,$2C,$3C  ; Sprite palette 0 (black, red, light blue, light purple)
  .byte $0F,$16,$26,$36  ; Sprite palette 1 (black, orange, green, cyan)
  .byte $0F,$0F,$0F,$0F  ; Sprite palette 2
  .byte $0F,$0F,$0F,$0F  ; Sprite palette 3
```

**Our ship uses palette 1:**
- Color 0: Transparent (shows background)
- Color 1: Orange (ship body)
- Color 2: Green (weapons/details)
- Color 3: Cyan (engines/highlights)

## The Complete Game Loop

Modern NES game structure:

```asm6502
Forever:
  ; Wait for NMI
  lda #$00
  sta nmiFlag
WaitForNMI:
  lda nmiFlag
  beq WaitForNMI
  
  ; Read controller input
  jsr ReadController
  
  ; Update player position
  jsr UpdatePlayer
  
  ; Update animation
  jsr UpdateAnimation
  
  jmp Forever
```

This ensures:
- **60Hz timing** - One update per frame
- **Consistent input** - No missed button presses
- **Smooth graphics** - Sprite updates during vblank
- **Responsive feel** - Immediate reaction to input

## Memory Layout

Understanding where everything lives:

```
$0000-$00FF: Zero page (variables)
$0100-$01FF: Stack
$0200-$02FF: OAM (sprite data)
$0300-$07FF: General RAM
$8000-$FFFF: PRG-ROM (our code)
```

## Complete Working Program

Here's your complete assault ship program:

```asm6502
; underground-assault-02.s
; Complete sprite-based player ship

.segment "HEADER"
  .byte "NES", $1A
  .byte 2, 1, $01

.segment "ZEROPAGE"
player_x:       .res 1
player_y:       .res 1
buttons:        .res 1

.segment "CODE"
.proc RESET
  ; [Standard NES initialization]
  
  ; Initialize player
  jsr InitPlayer
  
  ; Main game loop
Forever:
  lda #$00
  sta nmiFlag
WaitForNMI:
  lda nmiFlag
  beq WaitForNMI
  
  jsr ReadController
  jsr UpdatePlayer
  jsr UpdateAnimation
  
  jmp Forever
.endproc

; [Include all subroutines from above]

.segment "CHARS"
  ; Tile 0 - Empty
  .byte $00,$00,$00,$00,$00,$00,$00,$00
  .byte $00,$00,$00,$00,$00,$00,$00,$00
  
  ; Tile 1 - Star
  ; [Star graphics from Lesson 1]
  
  ; Tile 2 - Player ship
  .byte %00001000, %00011100, %00111110, %01111111
  .byte %01111111, %00111110, %00100010, %01000001
  .byte %00000000, %00001000, %00011100, %00111110
  .byte %00111110, %00011100, %00011100, %00111110
```

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 2 Code](https://github.com/code198x/code-samples/tree/main/nintendo-entertainment-system/phase-1/tier-1/lesson-002)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble and link**:
   ```bash
   ca65 underground-assault-02.s -o underground-assault-02.o
   ld65 -C nes.cfg -o underground-assault-02.nes underground-assault-02.o
   ```
3. **Run** in emulator: Load the generated NES file

**Or use the included Makefile:**
```bash
make            # Build the ROM
make run        # Build and run in emulator
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Display the animated starfield from Lesson 1
- Show an orange/green ship sprite that responds to D-pad input
- Provide smooth movement with boundary checking
- Maintain 60Hz responsiveness

### Controls
- **D-pad Up/Down** - Vertical movement
- **D-pad Left/Right** - Horizontal movement

## What You've Learned

**NES Sprite System**:
- Hardware sprite capabilities and limitations
- OAM structure and sprite data format
- Sprite DMA transfers for efficiency

**Controller Input**:
- NES controller reading via shift register
- Button state management and input polling
- Responsive control schemes

**Movement Physics**:
- Boundary checking and collision detection
- Configurable movement speed
- Frame-based movement timing

**Game Programming**:
- Professional game loop structure
- Hardware-accelerated graphics
- Memory-efficient sprite management

## Your Challenge

Enhance your assault ship:
1. **Add diagonal movement** - Combine D-pad directions for 8-way movement
2. **Variable speed** - Hold A button for turbo mode
3. **Ship animation** - Cycle between ship tiles for engine flicker

## Next Lesson Preview

In **Lesson 3**, we'll add **energy projectiles** to your assault ship! You'll learn about object pools, projectile physics, and the foundations of combat systems - taking your first step toward intense underground battles.

You now have a fully controllable assault ship cruising through underground space. The foundation of **Underground Assault** is coming together!

Welcome to advanced NES game development! 🚀