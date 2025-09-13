# Lesson 13: Proper Collision Detection

## Opening Hook

Remember that frustrating bug from lesson 9? When objects moving toward each other could pass right through? It's time for the truth: that wasn't a bug, it was a lesson in disguise!

Professional game developers in the 1980s faced this exact problem. The solution they found - bounding box collision detection - became the foundation for nearly every 2D game that followed. Today, we implement that same technique, fixing our collision system once and for all.

## Code Walkthrough

### Understanding the Problem

Our old collision code only checked if positions were exactly equal:

```assembly
; Old method - exact position matching
lda player_x
cmp enemy_x
bne no_collision
```

But what happens between frames? If the player is at position 10 moving right, and the enemy is at position 12 moving left, next frame they'll be at 11 and 11 - collision! But if the enemy starts at position 11, they'll jump to positions 11 and 10, missing each other completely.

### The Bounding Box Solution

Instead of checking exact positions, we check if objects will overlap:

```assembly
check_enemy1_bbox:
    ; First check Y position (must be same row)
    lda player_y
    cmp enemy1_y
    bne no_enemy1_collision

    ; Check if enemy is at player position
    lda enemy1_x
    cmp player_x
    beq collision_detected

    ; Check if enemy will be at player's next position
    lda player_x
    clc
    adc #1          ; Player's next position
    cmp enemy1_x
    beq collision_detected
```

This checks both current positions AND where the player will be next frame!

### Debug Mode Implementation

Want to see the collision zones? Press 'D' to toggle debug mode:

```assembly
check_keyboard:
    ; Check for 'D' key press
    lda #$12        ; Scan code for D
    sta $dc00
    lda $dc01
    and #$08
    bne no_d_key

    ; Toggle debug mode
    lda debug_mode
    eor #$01        ; Flip bit 0
    sta debug_mode
```

In debug mode, we draw dots showing each object's collision zone:

```assembly
draw_debug_info:
    ; Show collision zone around player
    lda player_x
    beq skip_left
    tax
    dex
    lda #$2e        ; Period character
    sta $0400+600,x ; One space to the left
```

### Register Preservation Bug

Here's a subtle bug that took hours to find. Our delay routine was corrupting the X register:

```assembly
short_delay:
    ; BUGFIX: Save X register!
    txa
    pha

    ldy #30
delay_loop:
    ldx #100    ; This overwrites X!
    ; ... delay code ...

    ; Restore X register
    pla
    tax
    rts
```

Without saving X, our game over sequence would get stuck in an infinite loop!

## Interactive Elements

### Experiment 1: Collision Zones

Modify the collision check distance:

```assembly
; Check 2 positions ahead
lda player_x
clc
adc #2
cmp enemy1_x
beq collision_detected
```

How does this affect gameplay difficulty?

### Experiment 2: Visual Debugging

Add more debug visualizations:

```assembly
; Show enemy collision zones in different colors
lda #$0f    ; Light gray for player
lda #$02    ; Red for enemy zones
```

### Experiment 3: Asymmetric Collision

What if enemies had bigger collision zones than the player?

```assembly
; Check 2 spaces around enemy, 1 around player
; This makes the game harder!
```

## Deep Dive: Frame-Perfect Collisions

In modern games, we interpolate positions between frames. On the C64, we work with discrete positions. This creates interesting phenomena:

1. **Frame Advantage**: Objects moving at different speeds have advantages at certain positions
2. **Pixel-Perfect Dodging**: Skilled players can thread between enemies by timing movement
3. **Collision Priority**: Which collision gets detected first matters for scoring

### Memory-Efficient Collision Maps

Some C64 games used lookup tables for collision detection:

```assembly
; Collision lookup table (not implemented in our code)
collision_table:
    !byte %00000001  ; Position 0: can hit enemy at position 1
    !byte %00000011  ; Position 1: can hit positions 0 and 2
    ; ... etc
```

## Challenge Extensions

1. **Predictive Collision**: Check where enemies will be in 2-3 frames

2. **Grazing Bonus**: Award points for near-misses (collision zone touched but not hit)

3. **Size Variation**: Give different enemies different collision box sizes

4. **Collision Particles**: Spawn visual effects at the exact collision point

## Common Pitfalls

- **Check Order Matters**: Always check active flags before positions
- **Register Corruption**: Any subroutine can corrupt A, X, or Y
- **Off-By-One Errors**: Screen boundaries are 0-39, not 1-40!
- **Multiple Hits**: Same collision detected multiple frames

## Performance Considerations

Our improved collision detection is more expensive:

- Old method: 2 comparisons per enemy
- New method: 4-5 comparisons per enemy
- With 8 enemies: 40 comparisons per frame!

This is why games limited enemy counts or used hardware sprites (coming next lesson).

## Next Steps

We've perfected character-based collision detection, but we're still using PETSCII characters for graphics. What if I told you the C64 has dedicated hardware for moving objects with pixel-perfect precision and automatic collision detection?

In lesson 14, we enter the world of hardware sprites - prepare to see your game transform!
