---
title: "Quantum Blasters"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 3
description: "Transform your racing ship into a quantum destroyer by adding a complete hardware sprite projectile system with copper list automation and multi-sprite management."
learning_objectives:
  - "Master multiple hardware sprite management on the Amiga"
  - "Program copper lists for automatic sprite control"
  - "Implement object pooling for sprite resources"
  - "Create multi-bitplane sprite graphics"
  - "Build frame-perfect projectile systems"
concepts:
  - "Multiple hardware sprite coordination"
  - "Copper list programming for sprites"
  - "Object pooling for sprite management"
  - "Multi-bitplane sprite graphics"
  - "Frame-based animation timing"
  - "Joystick fire button handling"
difficulty: "easy"
estimated_duration: "75-90 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "Amiga Hardware Sprites"
    url: "http://amigadev.elowar.com/read/ADCD_2.1/Hardware_Manual_guide/node0126.html"
    type: "documentation"
  - title: "Copper List Programming"
    url: "http://amigadev.elowar.com/read/ADCD_2.1/Hardware_Manual_guide/node0121.html"
    type: "documentation"
order: 3
---

# Lesson 3: Quantum Blasters

Welcome back to **Turbo Horizon**! Your racing ship cuts through hyperspace with legendary smoothness, but what good is the ultimate racing machine without weapons? In this lesson, you'll add quantum blaster cannons using the Amiga's revolutionary hardware sprite system. Prepare to unleash devastating quantum firepower!

## What You'll Build Today

- **Multiple hardware sprite projectiles** - Fire 7 simultaneous quantum bolts
- **Copper list automation** - Let the hardware manage all sprites automatically
- **Object pooling system** - Efficiently manage sprite resources
- **Multi-bitplane graphics** - Create stunning quantum energy effects
- **Frame-perfect timing** - Maintain 50Hz responsive controls

## The Big Picture

The Amiga's hardware sprite system was legendary for enabling smooth, colorful graphics that no other home computer could match. By using multiple sprites for projectiles, you'll achieve the fluid, arcade-quality effects that made Amiga games so visually stunning.

## Understanding Amiga Multiple Sprites

The Amiga can display 8 hardware sprites simultaneously with full color and smooth movement:

### Sprite System Overview

```
Amiga Sprite Capabilities:
- 8 hardware sprites (SPR0-SPR7)
- 16 pixels wide, any height
- 4 colors per sprite (2 bitplanes)
- Automatic DMA handling
- Independent movement
- Copper list control
```

### Sprite Resource Allocation

```
Sprite Usage Strategy:
- Sprite 0: Player ship (always active)
- Sprites 1-7: Bullet pool (7 simultaneous bullets)
- Each sprite: Independent quantum bolt
```

### Multiple Sprite Registers

```m68k
; Each sprite has its own register set
SPR0PTH/SPR0PTL    ; Sprite 0 data pointer
SPR0POS/SPR0CTL    ; Sprite 0 position and control

SPR1PTH/SPR1PTL    ; Sprite 1 data pointer
SPR1POS/SPR1CTL    ; Sprite 1 position and control

; ... up to SPR7PTH/SPR7PTL, SPR7POS/SPR7CTL
```

## Object Pooling for Sprites

Instead of dynamically allocating sprites, we'll use a fixed pool system:

### Parallel Array Structure

```m68k
; Bullet system constants
MAX_BULLETS     EQU     7       ; Sprites 1-7 available for bullets

; Bullet data arrays (parallel arrays)
bulletActive:   ds.b    MAX_BULLETS     ; Active flags
bulletX:        ds.w    MAX_BULLETS     ; X positions
bulletY:        ds.w    MAX_BULLETS     ; Y positions
```

### Why Object Pooling?

- **Predictable performance** - No dynamic allocation overhead
- **Hardware friendly** - Fixed sprite assignments
- **Cache efficient** - Related data stored together
- **Simple management** - Array-based indexing

## Copper List Sprite Management

The copper list automatically manages all sprite registers:

### Sprite Pointer Setup

```m68k
copperList:
        ; Colors for sprites
        dc.w    COLOR00,$0000   ; Background black
        dc.w    COLOR00+4,$0F80 ; Color 2 orange (player ship)
        dc.w    COLOR00+6,$08F0 ; Color 3 green (player ship details)
        dc.w    COLOR00+8,$0FF0 ; Color 4 bright yellow (bullets)
        dc.w    COLOR00+10,$0F00 ; Color 5 bright red (bullet core)
        
        ; Player sprite (sprite 0)
        dc.w    SPR0PTH
spr0h:  dc.w    0
        dc.w    SPR0PTL
spr0l:  dc.w    0
        dc.w    SPR0POS
spr0pos: dc.w   0
        dc.w    SPR0CTL
spr0ctl: dc.w   0
        
        ; Bullet sprites (sprites 1-7)
        dc.w    SPR1PTH
spr1h:  dc.w    0
        dc.w    SPR1PTL
spr1l:  dc.w    0
        dc.w    SPR1POS
spr1pos: dc.w   0
        dc.w    SPR1CTL
spr1ctl: dc.w   0
        
        ; ... (similar blocks for sprites 2-7)
```

### Automatic Sprite Updates

The copper list runs automatically each frame, updating all sprite positions without CPU intervention.

## Creating Quantum Bolt Graphics

### Multi-Bitplane Sprite Design

```m68k
bulletSprite:
        ; 8x8 bullet sprite data (quantum energy bolt)
        ; First bitplane (bright yellow core)
        dc.w    %0001100000000000,%0000000000000000  ; Row 0
        dc.w    %0011110000000000,%0000000000000000  ; Row 1
        dc.w    %0111111000000000,%0000000000000000  ; Row 2
        dc.w    %1111111100000000,%0000000000000000  ; Row 3
        dc.w    %1111111100000000,%0000000000000000  ; Row 4
        dc.w    %0111111000000000,%0000000000000000  ; Row 5
        dc.w    %0011110000000000,%0000000000000000  ; Row 6
        dc.w    %0001100000000000,%0000000000000000  ; Row 7
        
        ; Second bitplane (bright red outer glow)
        dc.w    %0000000000000000,%0001100000000000  ; Row 0
        dc.w    %0000000000000000,%0001100000000000  ; Row 1
        dc.w    %0000000000000000,%0001100000000000  ; Row 2
        dc.w    %0000000000000000,%0001100000000000  ; Row 3
        dc.w    %0000000000000000,%0001100000000000  ; Row 4
        dc.w    %0000000000000000,%0001100000000000  ; Row 5
        dc.w    %0000000000000000,%0001100000000000  ; Row 6
        dc.w    %0000000000000000,%0001100000000000  ; Row 7
        
        ; Sprite control words (end of sprite)
        dc.w    $0000,$0000
```

This creates a quantum energy bolt with a bright yellow core and red outer glow.

## The Firing System

### Finding Available Bullet Slots

```m68k
fireBullet:
        ; Check cooldown
        move.w  bulletCooldown,d0
        bne.s   .done
        
        ; Find inactive bullet slot
        lea     bulletActive,a0
        moveq   #MAX_BULLETS-1,d0
        moveq   #0,d1                   ; Bullet index
        
.findSlot:
        tst.b   (a0)
        beq.s   .foundSlot
        addq.l  #5,a0                   ; Next bullet (1+2+2 bytes)
        addq.w  #1,d1
        dbf     d0,.findSlot
        rts                             ; No free slots
        
.foundSlot:
        ; Activate bullet
        move.b  #1,(a0)+
        
        ; Set bullet position (centered on player)
        move.w  playerX,d0
        add.w   #6,d0                   ; Center horizontally
        move.w  d0,(a0)+                ; bulletX
        
        move.w  playerY,d0
        sub.w   #8,d0                   ; Start above player
        move.w  d0,(a0)                 ; bulletY
        
        ; Set cooldown
        move.w  #BULLET_COOLDOWN_TIME,bulletCooldown
        
.done:
        rts
```

### Fire Button Input

```m68k
checkFire:
        ; Check fire button (joystick button = bit 7 of POTGOR)
        move.w  POTGOR(a5),d0
        btst    #7,d0                   ; Fire button
        bne.s   inputDone               ; Button not pressed (active low)
        
        ; Fire bullet
        bsr     fireBullet
```

The fire button provides responsive quantum blaster controls.

## Sprite Animation System

### Frame-Based Movement

```m68k
updateBullets:
        ; Update cooldown
        move.w  bulletCooldown,d0
        beq.s   .updatePositions
        subq.w  #1,d0
        move.w  d0,bulletCooldown
        
.updatePositions:
        ; Process each bullet
        lea     bulletActive,a0
        moveq   #MAX_BULLETS-1,d0
        
.bulletLoop:
        ; Check if bullet is active
        tst.b   (a0)
        beq.s   .nextBullet
        
        ; Move bullet up
        move.w  2(a0),d2                ; bulletY
        sub.w   #BULLET_SPEED,d2        ; 3 pixels per frame
        cmp.w   #16,d2                  ; Check if off screen
        blt.s   .deactivate
        
        ; Update position
        move.w  d2,2(a0)                ; bulletY
        bra.s   .nextBullet
        
.deactivate:
        ; Deactivate bullet
        clr.b   (a0)
        
.nextBullet:
        addq.l  #5,a0                   ; Next bullet
        dbf     d0,.bulletLoop
        
        ; Update sprite positions
        bsr     updateBulletSprites
        
        rts
```

### Sprite Position Updates

```m68k
updateBulletSprites:
        lea     bulletActive,a0
        lea     spr1pos,a1              ; Start with sprite 1 position
        moveq   #MAX_BULLETS-1,d0
        
.spriteLoop:
        ; Check if bullet is active
        tst.b   (a0)
        beq.s   .hideSprite
        
        ; Get bullet position
        move.w  1(a0),d1                ; bulletX
        move.w  3(a0),d2                ; bulletY
        
        ; Create sprite position value
        move.w  d2,d3
        lsl.w   #8,d3                   ; VSTART in upper 8 bits
        move.w  d1,d4
        lsr.w   #1,d4                   ; HSTART/2 in lower 8 bits
        or.w    d4,d3
        move.w  d3,(a1)                 ; SPRnPOS
        
        ; Create sprite control value
        move.w  d2,d3
        add.w   #BULLET_HEIGHT,d3       ; VSTOP = VSTART + height
        lsl.w   #8,d3                   ; VSTOP in upper 8 bits
        move.w  d1,d4
        and.w   #1,d4                   ; HSTART LSB
        or.w    d4,d3
        move.w  d3,8(a1)                ; SPRnCTL
        
        bra.s   .nextSprite
        
.hideSprite:
        ; Hide sprite (move off screen)
        move.w  #$0000,(a1)             ; SPRnPOS
        move.w  #$0000,8(a1)            ; SPRnCTL
        
.nextSprite:
        addq.l  #5,a0                   ; Next bullet
        add.l   #16,a1                  ; Next sprite registers
        dbf     d0,.spriteLoop
        
        rts
```

## Copper List Automation

### Sprite Pointer Setup

```m68k
setupBulletSprites:
        ; Set up bullet sprite pointers (sprites 1-7)
        lea     bulletSprite,a0
        move.l  a0,d0
        
        ; All bullets use the same sprite graphics
        move.w  d0,spr1l
        swap    d0
        move.w  d0,spr1h
        swap    d0
        
        ; Sprite 2
        move.w  d0,spr2l
        swap    d0
        move.w  d0,spr2h
        ; ... (repeat for sprites 3-7)
```

### DMA Enable for All Sprites

```m68k
; Enable DMA for all sprite channels
move.w  #$83FF,DMACON(a5)       ; COPPER, BITPLANE, SPRITE, MASTER
```

This enables all 8 hardware sprites for maximum firepower.

## Visual Effects and Polish

### Quantum Energy Colors

```m68k
; Sprite color palette
dc.w    COLOR00+8,$0FF0 ; Color 4 bright yellow (bullet core)
dc.w    COLOR00+10,$0F00 ; Color 5 bright red (bullet glow)
```

### Multi-Bitplane Effects

- **Bitplane A**: Bright yellow core
- **Bitplane B**: Red outer glow
- **Combined**: Stunning quantum energy effect

## Performance Considerations

### Hardware Acceleration

- **Automatic DMA** - Sprites move without CPU intervention
- **Copper list control** - Hardware updates all registers
- **Parallel processing** - Multiple sprites move simultaneously
- **50Hz timing** - Perfect frame rate synchronization

### Memory Efficiency

- **Shared graphics** - All bullets use same sprite data
- **CHIP RAM allocation** - Sprites and copper list in correct memory
- **Parallel arrays** - Cache-friendly bullet data
- **Fixed allocation** - No dynamic memory management

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 3 Code](https://github.com/code198x/code-samples/tree/main/commodore-amiga/phase-1/tier-1/lesson-003)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `vasmm68k_mot -Fhunkexe -nosym -kick1hunks -o turbo-horizon-03 turbo-horizon-03.s`
3. **Create ADF**: Use the included build system
4. **Run** in emulator or real hardware

**Or use the included Makefile:**
```bash
make            # Build the executable
make adf        # Create ADF disk image
make run        # Build and run in FS-UAE
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Display the animated starfield and player ship from previous lessons
- Allow firing quantum bolts with the fire button
- Show up to 7 bullets simultaneously
- Prevent rapid-fire spam with cooldowns
- Provide smooth 50Hz sprite animation

### Controls
- **Joystick** - Move ship (all directions)
- **Fire Button** - Fire quantum energy bolt
- **Left Mouse Button** - Exit program

## What You've Learned

**Multiple Sprite Management**:
- Coordinating 8 hardware sprites simultaneously
- Copper list programming for automatic control
- Sprite resource allocation and management

**Advanced Graphics**:
- Multi-bitplane sprite design
- Quantum energy visual effects
- Professional color palette design

**System Programming**:
- Hardware DMA coordination
- Frame-perfect timing systems
- Efficient memory management

**Game Programming**:
- Object pooling for sprite resources
- Frame-based animation systems
- Responsive input handling

## Your Challenge

Enhance your quantum blaster system:
1. **Spread shot** - Fire multiple bolts in different directions
2. **Charged blasters** - Hold fire for more powerful shots
3. **Energy effects** - Add sprite-based muzzle flashes
4. **Sound integration** - Add quantum blaster sound effects

## Next Lesson Preview

In **Lesson 4**, we'll add **enemy interceptors** that hunt your racing ship! You'll learn about enemy AI patterns, sprite-to-sprite collision detection, and advanced game state management. Your quantum blasters will finally have targets worthy of their power.

You now have a complete combat system that demonstrates the legendary sprite capabilities that made the Amiga the ultimate gaming machine. The quantum firepower of **Turbo Horizon** is ready to dominate hyperspace!

Engage quantum blasters! ⚡🚀