---
title: "Hardware Collision Detection"
lesson_number: 4
phase_number: 1
tier_number: 1
system: "commodore-amiga"
description: "Master the Amiga's unique hardware collision detection system"
learning_objectives:
  - "Understand hardware collision detection registers"
  - "Implement sprite-based collision systems"
  - "Create explosion effects with animation"
  - "Optimize sprite allocation strategies"
concepts:
  - "CLXDAT and CLXCON registers"
  - "Sprite collision groups"
  - "Hardware vs software collision"
  - "Efficient sprite management"
estimated_duration: "45 minutes"
difficulty: "medium"
prerequisites:
  - "Lesson 3: Sprite projectiles"
  - "Understanding of hardware sprites"
  - "Basic 68000 assembly"
order: 4
---

# Lesson 4: Hardware Collision Detection

## The Amiga's Secret Weapon

While other systems require complex calculations to detect collisions, the Amiga's custom chips do it automatically in hardware. This lesson reveals how to harness this unique capability for responsive, CPU-efficient gameplay.

## Learning Objectives

By the end of this lesson, you'll master:

- Using CLXDAT and CLXCON for collision detection
- Strategic sprite allocation for collision groups
- Creating visual feedback with explosion animations
- Building efficient collision response systems

## Hardware Collision Detection

### The Magic Registers

```assembly
CLXDAT  equ     $00e    * Collision data register (read-only)
CLXCON  equ     $098    * Collision control register
```

These two registers form the heart of Amiga collision detection.

### How It Works

1. **Denise checks every pixel**: As sprites are drawn, hardware compares pixels
2. **Non-transparent overlap**: When non-zero pixels overlap, collision detected
3. **Bits set in CLXDAT**: Each bit represents a specific sprite pair
4. **Software reads result**: Check CLXDAT during game loop

### CLXDAT Bit Assignments

```
Bit 0:  Sprite 0 ↔ Sprite 1
Bit 1:  Sprite 0 ↔ Sprite 2
Bit 2:  Sprite 0 ↔ Sprite 3
Bit 3:  Sprite 0 ↔ Sprite 4
...
Bit 14: Sprite 6 ↔ Sprite 7
```

## Strategic Sprite Allocation

### Organizing for Efficiency

```assembly
* Sprite allocation:
* Sprite 0: Player ship (always visible)
* Sprites 1-3: Player bullets
* Sprites 4-7: Enemies or explosions
```

This organization simplifies collision logic:
- Bullets (1-3) vs Enemies (4-7) = Easy to check
- Player (0) vs Enemies (4-7) = Shield/damage detection
- No bullet-to-bullet checks needed

### Collision Control Setup

```assembly
init_collision:
    * Enable sprite collisions
    move.w  #$00c0,CLXCON(a5)
    
    * Clear any pending collisions
    move.w  CLXDAT(a5),d0       * Read to clear
```

## Implementing Collision Detection

### The Main Collision Loop

```assembly
check_collisions:
    * Read collision register
    move.w  CLXDAT(a5),d0
    
    * Check bullets vs enemies
    * Bit pattern: bullets (1-3) hitting enemies (4-7)
    
    moveq   #0,d1               * Bullet index
    moveq   #1,d2               * Bit mask for sprite 1
    
.check_bullets:
    moveq   #0,d3               * Enemy index
    moveq   #$10,d4             * Bit mask for sprite 4
    
.check_enemies:
    * Calculate collision bit position
    move.w  d2,d5
    lsl.w   #4,d5               * Shift to enemy position
    and.w   d4,d5
    and.w   d0,d5               * Test collision bit
    beq     .no_collision
    
    * Collision detected!
    bsr     handle_collision
```

### Collision Response

```assembly
handle_collision:
    * Input: d1 = bullet index, d3 = enemy index
    
    * Deactivate bullet
    lea     bullet_active,a0
    move.w  d1,d0
    mulu    #5,d0               * Structure size
    add.w   d0,a0
    clr.b   (a0)                * Deactivate
    
    * Deactivate enemy and start explosion
    lea     enemy_active,a0
    move.w  d3,d0
    mulu    #5,d0
    add.w   d0,a0
    clr.b   (a0)+               * Deactivate
    move.w  (a0)+,d4            * Get X
    move.w  (a0),d5             * Get Y
    
    * Create explosion at enemy position
    bsr     start_explosion
```

## Explosion Effects

### Sprite Animation System

```assembly
explosion_sprite:
    dc.w    $6050,$7200         * Control words
    dc.w    $1008,$3018         * Frame 1 pattern
    dc.w    $783c,$fc7e
    dc.w    $fe7f,$ffff
    ; ... more data

explosion_sprite2:
    dc.w    $6050,$7200         * Control words
    dc.w    $0420,$0e70         * Frame 2 pattern
    dc.w    $1ff8,$3ffc
    dc.w    $7ffe,$ffff
    ; ... more data
```

### Animation Logic

```assembly
update_explosions:
    lea     explosion_active,a0
    moveq   #MAX_ENEMIES-1,d7
    
.loop:
    tst.b   (a0)
    beq     .next
    
    * Animate based on timer
    move.b  (a0),d2             * Timer
    and.b   #4,d2               * Alternate frames
    beq     .frame2
    
    lea     explosion_sprite,a1
    bra     .update_sprite
    
.frame2:
    lea     explosion_sprite2,a1
    
.update_sprite:
    * Update sprite pointer in copper list
```

## Performance Advantages

### Zero CPU Overhead
Traditional collision detection:
```assembly
* Software collision (other systems)
* For each object pair:
*   Calculate distance X
*   Calculate distance Y
*   Check boundaries
*   Total: ~50 cycles per check
```

Amiga hardware collision:
```assembly
* Hardware collision
move.w  CLXDAT(a5),d0   * 8 cycles total!
```

### Pixel-Perfect Accuracy
- Hardware checks actual sprite pixels
- Transparent areas don't trigger collisions
- No bounding box approximations needed

## Advanced Techniques

### Collision Groups

```assembly
* CLXCON settings for grouped collisions
* Bit 12: Match sprites in odd positions
* Bit 13: Match sprites in even positions
move.w  #$1000,CLXCON(a5)   * Odd sprites only
```

### Playfield Collisions

The system also detects sprite-to-playfield collisions:
```assembly
* Check if sprite hit playfield
btst    #0,CLXDAT+1(a5)     * Sprite 0 vs playfield
```

## Common Pitfalls and Solutions

### Problem: Missed Collisions
**Cause**: Not clearing CLXDAT
**Solution**: Always read CLXDAT each frame

### Problem: False Collisions
**Cause**: Previous frame's data
**Solution**: Clear at start of collision check

### Problem: Multiple Hits
**Cause**: Same collision detected multiple frames
**Solution**: Add cooldown or state tracking

## Optimization Strategies

1. **Sprite Allocation**: Group related sprites
2. **Early Exit**: Stop checking after handling collision
3. **Lookup Tables**: For complex collision responses
4. **State Machines**: Track object states efficiently

## Practice Exercises

1. **Add Sound Effects**: Play different sounds for explosions
2. **Scoring System**: Award points based on collision type
3. **Power-ups**: Collectible items using spare sprites
4. **Shield System**: Player temporary invincibility

## Next Steps

With hardware collision detection mastered:
- Implement different enemy types and behaviors
- Add boss enemies using attached sprites
- Create complex attack patterns
- Design multi-stage gameplay

The Amiga's hardware collision detection is a game-changer, literally! This unique feature allows you to focus on gameplay rather than mathematics, creating smooth, responsive games that would be CPU-intensive on other platforms.