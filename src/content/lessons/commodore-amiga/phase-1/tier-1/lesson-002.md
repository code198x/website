---
title: "Adding the Player Ship"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 2
description: "Transform your starfield into a high-speed racing experience by adding a hardware sprite-based racing ship with smooth joystick controls and professional-grade graphics."
learning_objectives:
  - "Understand Amiga hardware sprite system and sprite DMA"
  - "Learn joystick input handling via hardware registers"
  - "Implement 16x16 sprite graphics with multiple bitplanes"
  - "Master copper list sprite management"
  - "Create smooth movement with real-time position updates"
concepts:
  - "Hardware sprites (SPR0-SPR7)"
  - "Sprite DMA and automatic fetching"
  - "Copper list sprite control"
  - "Joystick register decoding (JOY1DAT)"
  - "Multi-bitplane sprite graphics"
  - "Sprite position and control registers"
difficulty: "easy"
estimated_duration: "60-75 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "Amiga Hardware Sprites"
    url: "http://amigadev.elowar.com/read/ADCD_2.1/Hardware_Manual_guide/node0126.html"
    type: "documentation"
  - title: "Joystick Input on Amiga"
    url: "http://amigadev.elowar.com/read/ADCD_2.1/Hardware_Manual_guide/node0178.html"
    type: "documentation"
order: 2
---

# Lesson 2: Adding the Player Ship

Welcome back to **Turbo Horizon**! You've created a mesmerizing starfield, but now it's time to add the player - a sleek racing ship that can navigate at incredible speeds. In this lesson, you'll learn about the Amiga's revolutionary hardware sprite system and create the smoothest, most responsive controls possible.

## What You'll Build Today

- **Hardware sprite-based racing ship** - Using the Amiga's dedicated sprite hardware
- **Joystick controls** - Smooth, responsive movement in all directions
- **16×16 sprite graphics** - Multi-bitplane graphics with multiple colors
- **Professional game feel** - 50Hz updates with hardware acceleration

## The Big Picture

The Amiga was famous for its incredible sprite capabilities - hardware-accelerated graphics that could move independently of the background without any CPU intervention. In **Turbo Horizon**, you're racing through hyperspace at incredible speeds, and only the Amiga's hardware sprites can provide the smooth, flicker-free movement you need.

## Understanding Amiga Hardware Sprites

The Amiga has 8 hardware sprites that can be displayed simultaneously:

### Sprite System Overview

```
Hardware Sprites: 8 total (SPR0-SPR7)
Sprite size: 16 pixels wide, any height
Sprite data: 2 bitplanes (4 colors per sprite)
Sprite DMA: Automatic data fetching
Sprite priority: Configurable relative to background
```

### Sprite Registers

Each sprite has its own set of registers:

```
SPR0PTH/SPR0PTL: Sprite data pointer (high/low)
SPR0POS:         Sprite position (VSTART, HSTART)
SPR0CTL:         Sprite control (VSTOP, HSTART LSB, ATTACH)
SPR0DATA:        Sprite data (automatic DMA)
SPR0DATB:        Sprite data B (automatic DMA)
```

### Sprite Data Format

```
Each sprite line: 2 words (32 bits)
Word 1: Bitplane A data (16 bits)
Word 2: Bitplane B data (16 bits)
Combined: 4 colors per pixel (2 bits per pixel)
```

## Creating Your Racing Ship

Let's design a sleek, high-speed racing ship:

### 16×16 Sprite Design

```m68k
playerSprite:
        ; 16x16 sprite data (2 words per line, 16 lines)
        ; First bitplane (orange parts)
        dc.w    %0000000110000000,%0000000000000000  ; Row 0
        dc.w    %0000001111000000,%0000000000000000  ; Row 1
        dc.w    %0000011111100000,%0000000000000000  ; Row 2
        dc.w    %0000111111110000,%0000000000000000  ; Row 3
        dc.w    %0001111111111000,%0000000000000000  ; Row 4
        dc.w    %0011111111111100,%0000000000000000  ; Row 5
        dc.w    %0111111111111110,%0000000000000000  ; Row 6
        dc.w    %1111111111111111,%0000000000000000  ; Row 7
        dc.w    %1111111111111111,%0000000000000000  ; Row 8
        dc.w    %0111111111111110,%0000000000000000  ; Row 9
        dc.w    %0011111111111100,%0000000000000000  ; Row 10
        dc.w    %0001111111111000,%0000000000000000  ; Row 11
        dc.w    %0000111111110000,%0000000000000000  ; Row 12
        dc.w    %0000011111100000,%0000000000000000  ; Row 13
        dc.w    %0100000110000010,%0000000000000000  ; Row 14 (engines)
        dc.w    %1000000000000001,%0000000000000000  ; Row 15 (flames)
        
        ; Second bitplane (green details)
        dc.w    %0000000000000000,%0000000110000000  ; Row 0
        dc.w    %0000000000000000,%0000001001000000  ; Row 1
        dc.w    %0000000000000000,%0000010000100000  ; Row 2
        ; ... (full pattern creates ship outline)
        
        ; Sprite control words (end of sprite)
        dc.w    $0000,$0000
```

This creates a futuristic racing ship with:
- **Orange body** (bitplane A)
- **Green details** (bitplane B)
- **Engine flames** at the bottom
- **Aerodynamic design** for speed

## Sprite Position Calculation

The Amiga's sprite position system is quite sophisticated:

### Position Registers

```m68k
; SPR0POS format
; Upper 8 bits: VSTART (vertical start position)
; Lower 8 bits: HSTART/2 (horizontal start position divided by 2)

; SPR0CTL format
; Upper 8 bits: VSTOP (vertical stop position)
; Lower 8 bits: HSTART LSB + control bits

updatePlayerSprite:
        ; Calculate sprite position values
        move.w  playerX,d0
        move.w  playerY,d1
        
        ; Create SPR0POS value
        move.w  d1,d2
        lsl.w   #8,d2                   ; VSTART in upper 8 bits
        move.w  d0,d3
        lsr.w   #1,d3                   ; HSTART/2 in lower 8 bits
        or.w    d3,d2
        move.w  d2,spr0pos
        
        ; Create SPR0CTL value
        move.w  d1,d2
        add.w   #16,d2                  ; VSTOP = VSTART + 16
        lsl.w   #8,d2                   ; VSTOP in upper 8 bits
        move.w  d0,d3
        and.w   #1,d3                   ; HSTART LSB
        or.w    d3,d2
        move.w  d2,spr0ctl
        
        rts
```

### Why This Complexity?

- **9-bit horizontal resolution** - More precision than 8 bits
- **HSTART/2** - Allows positioning at any pixel
- **HSTART LSB** - Provides the odd-pixel positioning
- **VSTOP** - Defines sprite height automatically

## Joystick Input on the Amiga

The Amiga reads joystick input through a clever hardware system:

### Joystick Register Format

```
JOY1DAT register layout:
Bit 15-10: Unused
Bit 9:     Vertical direction (XOR with bit 8)
Bit 8:     Vertical position
Bit 1:     Horizontal direction (XOR with bit 9)
Bit 0:     Horizontal position
```

### Decoding Joystick Movement

```m68k
handleInput:
        ; Read joystick 1
        move.w  JOY1DAT(a5),d0
        
        ; Check for up (bit 8 XOR bit 9)
        move.w  d0,d1
        lsr.w   #8,d1
        eor.w   d0,d1
        lsr.w   #1,d1
        and.w   #1,d1
        beq.s   checkDown
        
        ; Move up
        move.w  playerY,d0
        cmp.w   #PLAYER_MIN_Y,d0
        ble.s   checkDown
        sub.w   #PLAYER_SPEED,d0
        move.w  d0,playerY
        
checkDown:
        ; Check for down (inverted logic)
        move.w  JOY1DAT(a5),d0
        move.w  d0,d1
        lsr.w   #8,d1
        eor.w   d0,d1
        lsr.w   #1,d1
        and.w   #1,d1
        bne.s   checkLeft
        
        ; Move down
        move.w  playerY,d0
        cmp.w   #PLAYER_MAX_Y,d0
        bge.s   checkLeft
        add.w   #PLAYER_SPEED,d0
        move.w  d0,playerY
        
        ; Continue for left/right...
```

### Why XOR Decoding?

The Amiga joystick uses quadrature encoding:
- **Two bits per axis** - Provides direction and position
- **XOR operation** - Determines direction of movement
- **High precision** - Detects even small movements
- **No debouncing needed** - Hardware handles contact bounce

## Copper List Sprite Management

The Copper automatically manages sprite data:

### Sprite Copper Setup

```m68k
copperList:
        dc.w    COLOR00,$0000   ; Background black
        dc.w    COLOR00+2,$0FFF ; Color 1 white (stars)
        dc.w    COLOR00+4,$0F80 ; Color 2 orange (ship body)
        dc.w    COLOR00+6,$08F0 ; Color 3 green (ship details)
        
        ; Bitplane pointer
        dc.w    BPL1PTH
bp1h:   dc.w    0
        dc.w    BPL1PTL
bp1l:   dc.w    0
        
        ; Sprite pointer
        dc.w    SPR0PTH
spr0h:  dc.w    0
        dc.w    SPR0PTL
spr0l:  dc.w    0
        
        ; Sprite position (updated in real-time)
        dc.w    SPR0POS
spr0pos: dc.w   0
        dc.w    SPR0CTL
spr0ctl: dc.w   0
        
        dc.w    $FFFF,$FFFE     ; End of copper list
```

### Automatic Sprite DMA

Once the Copper sets up the sprite pointer:
- **Hardware fetches** sprite data automatically
- **No CPU intervention** needed for display
- **Perfect timing** - Synchronized with raster beam
- **Smooth animation** - Hardware handles all updates

## Sprite Color Management

Sprites have their own color palette:

### Sprite Colors

```m68k
; In copper list
dc.w    COLOR00+4,$0F80 ; Color 2 orange (ship body)
dc.w    COLOR00+6,$08F0 ; Color 3 green (ship details)
```

**Sprite Color Mapping:**
- **Color 0**: Transparent (background shows through)
- **Color 1**: Not used by sprites
- **Color 2**: Orange ($0F80) - Ship body
- **Color 3**: Green ($08F0) - Ship details and engines

### Color Combinations

Each sprite pixel can be:
- **00**: Transparent (background)
- **01**: Not used
- **10**: Orange (ship body)
- **11**: Green (details)

## Movement Physics

Professional-grade movement requires careful handling:

### Movement Constants

```m68k
PLAYER_START_X  EQU     160     ; Starting X position (middle)
PLAYER_START_Y  EQU     200     ; Starting Y position (near bottom)
PLAYER_MIN_X    EQU     16      ; Minimum X position
PLAYER_MAX_X    EQU     304     ; Maximum X position
PLAYER_MIN_Y    EQU     32      ; Minimum Y position
PLAYER_MAX_Y    EQU     240     ; Maximum Y position
PLAYER_SPEED    EQU     2       ; Movement speed
```

### Boundary Checking

```m68k
; Move left
move.w  playerX,d0
cmp.w   #PLAYER_MIN_X,d0
ble.s   checkRight      ; Already at minimum
sub.w   #PLAYER_SPEED,d0
move.w  d0,playerX
```

This ensures the ship stays within screen bounds and provides consistent movement speed.

## The Complete Racing Experience

### Main Game Loop

```m68k
mainLoop:
        ; Wait for vertical blank
        bsr     waitVBlank
        
        ; Handle input
        bsr     handleInput
        
        ; Update animation
        bsr     animateStars
        
        ; Check for exit
        btst    #6,$BFE001              ; Left mouse button
        bne.s   mainLoop
```

### Hardware Acceleration Benefits

- **50Hz updates** - Perfectly smooth movement
- **No CPU overhead** - Hardware handles sprite display
- **Flicker-free** - Dedicated sprite hardware
- **Responsive controls** - Direct hardware register access

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 2 Code](https://github.com/code198x/code-samples/tree/main/commodore-amiga/phase-1/tier-1/lesson-002)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `vasmm68k_mot -Fhunkexe -o turbo-horizon-02 turbo-horizon-02.s`
3. **Create ADF**: Use the included `make-adf.sh` script
4. **Run** in emulator or real hardware

**Or use the included Makefile:**
```bash
make            # Build the executable
make run        # Build and prepare for emulator
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Display the animated starfield from Lesson 1
- Show an orange/green racing ship that responds to joystick input
- Provide incredibly smooth movement with hardware acceleration
- Maintain perfect 50Hz timing

### Controls
- **Joystick Up/Down** - Vertical movement
- **Joystick Left/Right** - Horizontal movement
- **Left Mouse Button** - Exit program

## What You've Learned

**Amiga Hardware Sprites**:
- Hardware sprite system and sprite DMA
- Multi-bitplane sprite graphics
- Sprite position and control registers

**Joystick Input**:
- Hardware register reading (JOY1DAT)
- Quadrature decoding with XOR operations
- Professional input handling

**Copper List Programming**:
- Sprite pointer management
- Real-time position updates
- Color palette control

**Game Programming**:
- Hardware-accelerated graphics
- Professional movement physics
- Frame-perfect timing

## Your Challenge

Enhance your racing ship:
1. **Add engine animation** - Alternate between flame sprites
2. **Variable speed** - Hold fire button for turbo mode
3. **Ship banking** - Tilt ship when turning left/right

## Next Lesson Preview

In **Lesson 3**, we'll add **energy weapons** to your racing ship! You'll learn about sprite bullets, collision detection, and multiple sprite management - taking your high-speed racing into combat territory.

You now have the smoothest, most responsive racing ship possible thanks to the Amiga's legendary hardware. The foundation of **Turbo Horizon** is reaching professional game quality!

Welcome to advanced Amiga game development! 🏁