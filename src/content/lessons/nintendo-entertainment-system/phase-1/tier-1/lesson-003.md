---
title: "Plasma Cannons"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 3
description: "Transform your ship into a plasma-powered war machine by adding a complete hardware sprite projectile system with OAM management and sprite DMA."
learning_objectives:
  - "Master hardware sprite-based projectile systems on the NES"
  - "Understand OAM (Object Attribute Memory) management"
  - "Implement sprite DMA transfers for smooth animation"
  - "Create object pooling systems for sprites"
  - "Build frame-perfect timing systems"
concepts:
  - "Hardware sprites and OAM management"
  - "Sprite DMA transfers and VBlank timing"
  - "Object pooling for sprite resources"
  - "Frame-based animation timing"
  - "Controller input handling"
  - "CHR-ROM graphics design"
difficulty: "easy"
estimated_duration: "60-75 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "NES Sprite System"
    url: "https://www.nesdev.org/wiki/Sprite"
    type: "documentation"
  - title: "OAM and Sprite DMA"
    url: "https://www.nesdev.org/wiki/PPU_OAM"
    type: "documentation"
order: 3
---

# Lesson 3: Plasma Cannons

Welcome back to **Underground Assault**! Your ship can navigate through the underground caverns, but what good is a combat vessel without weapons? In this lesson, you'll add a complete plasma cannon system using the NES's powerful hardware sprite capabilities. Get ready to unleash devastating firepower!

## What You'll Build Today

- **Hardware sprite projectile system** - Fire multiple plasma bolts simultaneously
- **OAM management** - Control all 64 hardware sprites efficiently
- **Sprite DMA transfers** - Smooth, flicker-free animation
- **Object pooling** - Efficiently manage up to 8 projectiles
- **Frame-perfect timing** - 60Hz responsive controls

## The Big Picture

The NES's hardware sprite system is legendary for enabling smooth, flicker-free animation that was impossible on other systems. By using dedicated sprite hardware for projectiles, you'll achieve professional-quality effects that made NES games so memorable.

## Understanding NES Hardware Sprites

The NES has 64 hardware sprites that can display independently of the background:

### Sprite System Overview

```
NES Sprite Capabilities:
- 64 total sprites (numbered 0-63)
- 8×8 pixel resolution each
- 4 colors per sprite (including transparent)
- Automatic priority handling
- DMA transfer for smooth updates
- No background corruption
```

### Object Attribute Memory (OAM)

```
OAM Layout (4 bytes per sprite):
Byte 0: Y position (0-239)
Byte 1: Tile number (0-255)
Byte 2: Attributes (palette, flip, priority)
Byte 3: X position (0-255)

Total: 256 bytes ($0200-$02FF)
```

### Sprite DMA Transfer

```assembly
; In NMI handler - transfer all sprites at once
lda #$00
sta OAMADDR     ; Start at OAM address 0
lda #$02
sta OAMDMA      ; Transfer from $0200 (256 bytes)
```

This transfers all sprite data during VBlank for smooth animation.

## Object Pooling for Sprites

Instead of managing sprites individually, we'll use an object pool system:

### Sprite Allocation Strategy

```
Sprite Usage:
- Sprite 0: Player ship (always active)
- Sprites 1-8: Bullet pool (8 simultaneous bullets)
- Sprites 9-63: Available for enemies/effects
```

### Parallel Array Structure

```assembly
; Bullet system constants
MAX_BULLETS = 8

; Bullet system variables (in BSS segment)
bullet_cooldown:  .res 1              ; Frames until next bullet
bullet_active:    .res MAX_BULLETS    ; 0 = inactive, 1 = active
bullet_x:         .res MAX_BULLETS    ; X positions
bullet_y:         .res MAX_BULLETS    ; Y positions
```

## Creating Custom Sprite Graphics

### Plasma Bolt Design

```assembly
; Tile 3 - Bullet/Plasma bolt
.byte %00011000    ; Row 0:   **
.byte %00111100    ; Row 1:  ****
.byte %01111110    ; Row 2: ******
.byte %11111111    ; Row 3: ********
.byte %11111111    ; Row 4: ********
.byte %01111110    ; Row 5: ******
.byte %00111100    ; Row 6:  ****
.byte %00011000    ; Row 7:   **
; Bit plane 2 (for color)
.byte %00000000    ; Additional color data
.byte %00011000
.byte %00111100
.byte %01111110
.byte %01111110
.byte %00111100
.byte %00011000
.byte %00000000
```

This creates a distinctive plasma bolt with a bright core and darker edges.

## The Firing System

### Finding Available Bullet Slots

```assembly
.proc FireBullet
  ; Check cooldown
  lda bullet_cooldown
  bne Done        ; Still cooling down
  
  ; Find an inactive bullet slot
  ldx #$00
FindSlot:
  lda bullet_active, x
  beq FoundSlot   ; Found inactive slot
  inx
  cpx #MAX_BULLETS
  bne FindSlot
  rts             ; No free slots
  
FoundSlot:
  ; Activate bullet
  lda #$01
  sta bullet_active, x
  
  ; Set bullet position (centered on player)
  lda player_x
  clc
  adc #4          ; Center bullet on player sprite
  sta bullet_x, x
  
  lda player_y
  sec
  sbc #8          ; Start bullet above player
  sta bullet_y, x
  
  ; Set cooldown
  lda #BULLET_COOLDOWN_TIME
  sta bullet_cooldown
  
Done:
  rts
.endproc
```

### Controller Input Enhancement

```assembly
CheckFire:
  ; Check A button for firing
  lda buttons
  and #BUTTON_A
  beq UpdateDone
  
  ; Fire bullet
  jsr FireBullet
```

The A button provides responsive firing controls.

## Sprite Animation System

### Frame-Based Movement

```assembly
.proc UpdateBullets
  ; Update cooldown
  lda bullet_cooldown
  beq UpdatePositions
  dec bullet_cooldown
  
UpdatePositions:
  ; Process each bullet
  ldx #$00
BulletLoop:
  ; Check if bullet is active
  lda bullet_active, x
  beq NextBullet
  
  ; Move bullet up
  lda bullet_y, x
  sec
  sbc #BULLET_SPEED    ; 4 pixels per frame
  cmp #8               ; Check if off screen
  bcc DeactivateBullet
  
  ; Update position
  sta bullet_y, x
  jmp NextBullet
  
DeactivateBullet:
  ; Deactivate bullet
  lda #$00
  sta bullet_active, x
  
NextBullet:
  inx
  cpx #MAX_BULLETS
  bne BulletLoop
  
  ; Update sprite positions
  jsr UpdateBulletSprites
  
  rts
.endproc
```

### OAM Sprite Updates

```assembly
.proc UpdateBulletSprites
  ; Process each bullet
  ldx #$00        ; Bullet index
  
BulletLoop:
  ; Calculate sprite index (bullet index + 1)
  txa
  clc
  adc #1
  tay             ; Y = sprite index
  
  ; Calculate OAM offset (sprite index * 4)
  tya
  asl
  asl
  tay             ; Y = OAM offset
  
  ; Check if bullet is active
  lda bullet_active, x
  beq HideSprite
  
  ; Set sprite data
  lda bullet_y, x
  sta $0200, y    ; Y position
  
  lda #BULLET_TILE
  sta $0201, y    ; Tile
  
  lda #%00000010  ; Palette 2, no flip
  sta $0202, y    ; Attributes
  
  lda bullet_x, x
  sta $0203, y    ; X position
  
  jmp NextSprite
  
HideSprite:
  ; Hide sprite by moving it off screen
  lda #$FE
  sta $0200, y    ; Y position (off screen)
  
NextSprite:
  inx
  cpx #MAX_BULLETS
  bne BulletLoop
  
  rts
.endproc
```

## NMI Handler Integration

### Sprite DMA Transfer

```assembly
.proc NMI
  pha              ; Save registers
  txa
  pha
  tya
  pha

  ; Sprite DMA transfer
  lda #$00
  sta OAMADDR
  lda #$02
  sta OAMDMA       ; Transfer sprites from $0200

  ; ... other NMI tasks ...

  pla              ; Restore registers
  tay
  pla
  tax
  pla
  rti
.endproc
```

This ensures all sprite updates happen during VBlank for smooth animation.

## Memory Management

### Zero Page Optimization

```assembly
.segment "ZEROPAGE"
; Critical variables in zero page for speed
frameCount:     .res 1
player_x:       .res 1
player_y:       .res 1
buttons:        .res 1
temp:           .res 1
bulletIndex:    .res 1

.segment "BSS"
; Bullet arrays in regular RAM to save zero page space
bullet_cooldown:  .res 1
bullet_active:    .res MAX_BULLETS
bullet_x:         .res MAX_BULLETS
bullet_y:         .res MAX_BULLETS
```

### CHR-ROM Graphics

```
CHR-ROM Layout:
Tile 0: Empty (black)
Tile 1: Small star
Tile 2: Player ship
Tile 3: Plasma bolt
Tiles 4-255: Available for enemies/effects
```

## Performance Considerations

### Frame-Perfect Timing

- **60Hz updates** - NMI occurs every 16.67ms
- **Sprite DMA** - All sprites updated in one operation
- **Object pooling** - No dynamic memory allocation
- **Efficient loops** - Skip inactive bullets

### Memory Efficiency

- **Zero page optimization** - Critical variables in fast memory
- **Parallel arrays** - Cache-friendly data layout
- **Fixed pool size** - Predictable memory usage
- **Sprite reuse** - Hide/show instead of create/destroy

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 3 Code](https://github.com/code198x/code-samples/tree/main/nintendo-entertainment-system/phase-1/tier-1/lesson-003)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `ca65 -g -o build/underground-assault-03.o underground-assault-03.s`
3. **Link** with: `ld65 -C nes.cfg -o build/underground-assault-03.nes build/underground-assault-03.o`
4. **Run** in emulator: Load the NES file

**Or use the included Makefile:**
```bash
make            # Build the NES file
make run        # Build and run in FCEUX
make test       # Build and verify creation
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Display the animated starfield and player ship from previous lessons
- Allow firing plasma bolts with the A button
- Show up to 8 bullets simultaneously
- Prevent rapid-fire spam with cooldowns
- Provide smooth 60Hz sprite animation

### Controls
- **D-Pad** - Move ship (all directions)
- **A Button** - Fire plasma bolt

## What You've Learned

**Hardware Sprites**:
- NES sprite system and OAM management
- Sprite DMA transfers for smooth animation
- CHR-ROM graphics design and tile creation

**Object Pooling**:
- Efficient sprite resource management
- Parallel array data structures
- Active/inactive state management

**Game Programming**:
- Frame-based animation systems
- Controller input handling
- Memory optimization techniques

**NES Development**:
- VBlank timing and NMI handling
- Zero page optimization
- CHR-ROM graphics pipeline

## Your Challenge

Enhance your plasma cannon system:
1. **Rapid-fire mode** - Hold A button for continuous firing
2. **Charged shots** - Hold A longer for more powerful bolts
3. **Bullet colors** - Cycle through different plasma colors
4. **Sound effects** - Add firing sounds using the APU

## Next Lesson Preview

In **Lesson 4**, we'll add **enemy drones** that swarm your ship! You'll learn about enemy AI patterns, sprite-to-sprite collision detection, and game state management. Your plasma cannons will finally have targets to destroy.

You now have a complete combat system that demonstrates professional NES sprite programming. The hardware acceleration of **Underground Assault** is reaching legendary status!

Lock and load, commander! 🚀⚡