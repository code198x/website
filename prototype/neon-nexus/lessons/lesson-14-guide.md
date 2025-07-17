# Lesson 14: Sprite-Based Graphics

## Opening Hook

Everything changes now. We've been painting with a typewriter, using PETSCII characters to represent our game world. But the Commodore 64 has a secret weapon that made it the gaming powerhouse of the 1980s: hardware sprites.

Imagine graphics that move pixel by pixel, not character by character. Objects that can be any shape, not just letters. Collision detection that happens automatically in silicon, not software. Welcome to the VIC-II's sprite system - prepare to see your game transform from ASCII art to arcade quality!

## Code Walkthrough

### Sprite Basics

First, let's understand what a sprite is:

```assembly
; Sprite = 24x21 pixel graphic that moves independently
; C64 has 8 hardware sprites (0-7)
; Each sprite needs:
; - 63 bytes of pattern data
; - X,Y position registers  
; - Color register
; - Enable bit

; VIC-II sprite registers
SPRITE_ENABLE     = $d015   ; Which sprites are on
SPRITE0_X         = $d000   ; Sprite 0 X position
SPRITE0_Y         = $d001   ; Sprite 0 Y position
SPRITE0_COLOR     = $d027   ; Sprite 0 color
```

### Creating Sprite Data

Let's design our player sprite - a star shape:

```assembly
player_sprite_data:
    ; 24x21 pixels = 63 bytes (3 bytes per row)
    !byte %00000000,%00011000,%00000000  ; Row 1
    !byte %00000000,%00011000,%00000000  ; Row 2
    !byte %00000000,%00111100,%00000000  ; Row 3
    !byte %00000000,%01111110,%00000000  ; Row 4
    !byte %11111111,%11111111,%11111111  ; Row 5 - full width
    ; ... 16 more rows
```

Each bit represents a pixel. 1 = pixel on, 0 = transparent!

### Initializing Sprites

The sprite data must be placed where the VIC-II can see it:

```assembly
init_sprites:
    ; Copy sprite data to $0340 (832 decimal)
    ldx #0
copy_loop:
    lda player_sprite_data,x
    sta $0340,x
    inx
    cpx #63
    bne copy_loop
    
    ; Tell VIC-II where the sprite data is
    lda #13         ; $0340 / 64 = 13
    sta $07f8       ; Sprite 0 pointer
```

### Enabling and Positioning

Now we bring our sprite to life:

```assembly
    ; Enable sprite 0
    lda #%00000001  ; Bit 0 = sprite 0
    sta SPRITE_ENABLE
    
    ; Set position
    lda #100
    sta SPRITE0_X
    lda #150
    sta SPRITE0_Y
    
    ; Set color
    lda #$01        ; White
    sta SPRITE0_COLOR
```

That's it! No more character drawing - the VIC-II handles everything!

### Hardware Collision Detection

Here's the magic part - automatic collision detection:

```assembly
check_sprite_collisions:
    ; Read sprite-to-sprite collision register
    lda SPRITE_COLLISION    ; $d01e
    and #%00000001         ; Did sprite 0 hit anything?
    beq no_collision
    
    ; Collision detected by hardware!
    jsr handle_collision
    
    ; Clear collision register by reading it
    lda SPRITE_COLLISION
```

The VIC-II sets bits in this register whenever sprite pixels overlap. No more position checking!

## Interactive Elements

### Experiment 1: Sprite Design
Create different sprite patterns:
```assembly
; Enemy sprite - solid square
enemy_sprite:
    !byte %11111111,%11111111,%11111111
    !byte %11111111,%11111111,%11111111
    ; Repeat for all 21 rows
```

### Experiment 2: Multicolor Sprites
Enable 4-color sprites:
```assembly
lda #%00000001
sta SPRITE_MULTICOLOR  ; $d01c
; Now each pixel pair selects from 4 colors!
```

### Experiment 3: Sprite Expansion
Double the size:
```assembly
lda #%00000001
sta SPRITE_X_EXPAND    ; $d01d - double width
sta SPRITE_Y_EXPAND    ; $d017 - double height
```

## Deep Dive: The VIC-II Architecture

The VIC-II chip is a marvel of 1982 engineering:

1. **Sprite Multiplexing**: It draws sprites during horizontal blank
2. **Priority System**: Sprites can be behind or in front of background
3. **Collision Detection**: Happens at the pixel level in hardware
4. **DMA Access**: Sprites don't slow down the CPU

Memory map for sprites:
```
$0340-$037F: Sprite 0 data (64 bytes)
$0380-$03BF: Sprite 1 data
... etc

$07F8: Sprite 0 pointer (points to data/64)
$07F9: Sprite 1 pointer
... etc
```

### X-Coordinate Limitations

Sprites can move 0-511 pixels horizontally, but the screen is only 320 wide:

```assembly
; For X > 255, set the high bit
lda player_x_high
beq no_high_bit
lda $d010
ora #%00000001      ; Set bit 0 for sprite 0
sta $d010
```

## Challenge Extensions

1. **Animated Sprites**: Change sprite pointers for animation
   ```assembly
   inc anim_frame
   lda anim_frame
   and #$03         ; 0-3
   clc
   adc #13          ; Base pointer
   sta $07f8        ; Animate sprite 0
   ```

2. **Sprite Multiplexing**: Reuse sprites on different scanlines

3. **Particle Effects**: Use all 8 sprites for explosions

4. **Sprite Overlays**: Combine sprites for larger objects

## Common Pitfalls

- **Wrong Memory Bank**: VIC can only see certain memory areas
- **Pointer Math**: Remember to divide addresses by 64
- **Color Clash**: Multicolor mode shares colors between sprites
- **Priority Issues**: Sprites appearing behind or in front wrongly

## Performance Revolution

Compare the performance:
- Character drawing: ~50 cycles per object
- Sprite movement: ~10 cycles to update position
- Collision detection: 0 cycles (hardware does it!)

We just got a 10x performance improvement!

## Historical Context

Games that defined sprite usage:
- **Impossible Mission**: Fluid animation with sprite overlays
- **International Karate**: Huge fighters using multiple sprites
- **Armalyte**: Sprite multiplexing for dozens of objects
- **Mayhem in Monsterland**: Pushed sprites beyond limits

## Memory Layout

```
$0000-$03FF: System area (no sprites here!)
$0400-$07FF: Screen memory
$0800-$0FFF: Good for sprite data
$1000-$1FFF: More sprite space
$2000-$3FFF: VIC bank 0 limit
```

## Next Steps

Static sprites are impressive, but animated sprites bring games to life. How do we create smooth animation? How do we synchronize movement with the screen refresh? How do we make sprites that respond instantly to player input?

Lesson 15 will unlock the secrets of professional animation techniques. Your sprites are about to start dancing!