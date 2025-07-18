---
title: "Collision Detection"
lesson_number: 4
phase_number: 1
tier_number: 1
system: "nintendo-entertainment-system"
description: "Implement sprite-based collision detection for engaging combat"
learning_objectives:
  - "Master pixel-precise collision detection"
  - "Manage enemy sprites with movement patterns"
  - "Create explosion animations with sprites"
  - "Optimize sprite usage within NES limits"
concepts:
  - "Sprite collision algorithms"
  - "Hit box design"
  - "Animation timing"
  - "Object state management"
estimated_duration: "45 minutes"
difficulty: "medium"
prerequisites:
  - "Lesson 3: Projectile systems"
  - "Understanding of sprite system"
  - "Basic 6502 assembly"
---

# Lesson 4: Collision Detection

## Bringing Combat to Life

With our ship firing projectiles, it's time to add enemies and create thrilling space combat. The NES's hardware sprite system allows for smooth, pixel-precise collision detection that creates satisfying gameplay.

## Learning Objectives

By the end of this lesson, you'll understand:

- How to implement efficient sprite collision detection
- Managing multiple enemy sprites with behaviors
- Creating visual feedback with explosion animations
- Working within the NES's sprite limitations

## The NES Collision Advantage

### Hardware Sprites vs. Characters

Unlike systems that use character-based graphics, the NES provides:
- **Pixel-precise positioning**: Sprites can be placed at any pixel
- **Automatic rendering**: No manual drawing needed
- **Independent movement**: Each sprite moves smoothly
- **Hardware priority**: Automatic sprite layering

### Collision Box Concept

```assembly
; Collision box sizes (in pixels)
COLLISION_WIDTH = 6
COLLISION_HEIGHT = 6
```

We use smaller hit boxes than the actual sprite size for better gameplay feel.

## Enemy Management System

### Data Structure

```assembly
; Enemy system variables (in BSS segment)
enemy_active:       .res MAX_ENEMIES
enemy_x:            .res MAX_ENEMIES
enemy_y:            .res MAX_ENEMIES
enemy_timer:        .res MAX_ENEMIES
```

Parallel arrays allow efficient iteration through all enemies.

### Enemy Initialization

```assembly
init_enemy_loop:
    lda #1                  ; Active
    sta enemy_active,x
    
    ; Starting X position (staggered)
    txa
    asl                     ; * 2
    asl                     ; * 4
    asl                     ; * 8
    asl                     ; * 16
    clc
    adc #200                ; Start from right
    sta enemy_x,x
    
    ; Starting Y position (spread out)
    txa
    asl                     ; * 2
    asl                     ; * 4
    asl                     ; * 8
    asl                     ; * 16
    clc
    adc #48                 ; Offset from top
    sta enemy_y,x
```

## Collision Detection Algorithm

### The Core Logic

```assembly
check_object_collision:
    ; Check X overlap
    lda obj1_x
    sec
    sbc obj2_x
    bcs @positive_x         ; obj1 >= obj2
    
    ; obj1 < obj2, make positive
    eor #$FF
    clc
    adc #1
    cmp #COLLISION_WIDTH
    bcs @no_collision       ; Too far apart
    jmp @check_y
    
@positive_x:
    ; obj1 >= obj2
    cmp #COLLISION_WIDTH
    bcs @no_collision       ; Too far apart
    
@check_y:
    ; Same logic for Y axis...
```

### Why This Works

1. **Calculate distance**: Subtract positions
2. **Handle sign**: Make distance positive
3. **Check threshold**: Compare to hit box size
4. **Both axes must overlap**: Check X and Y

## Complete Collision System

### Nested Loop Structure

```assembly
check_collisions:
    ; Check each bullet against each enemy
    ldx #0
@bullet_loop:
    lda bullet_active,x
    beq @next_bullet
    
    ; Store bullet position
    lda bullet_x,x
    sta obj1_x
    lda bullet_y,x
    sta obj1_y
    
    ; Check against enemies
    ldy #0
@enemy_loop:
    lda enemy_active,y
    beq @next_enemy
    
    ; Store enemy position
    lda enemy_x,y
    sta obj2_x
    lda enemy_y,y
    sta obj2_y
    
    ; Check collision
    jsr check_object_collision
    bcc @next_enemy         ; No collision
    
    ; Handle collision...
```

### Collision Response

When a collision is detected:
```assembly
; Deactivate both objects
lda #0
sta bullet_active,x
sta enemy_active,y

; Start explosion at enemy position
lda enemy_x,y
sta explosion_x,y
lda enemy_y,y
sta explosion_y,y
lda #EXPLOSION_TIME
sta explosion_timer,y
lda #1
sta explosion_active,y
```

## Explosion Effects

### Animation System

```assembly
update_explosions:
    ldx #0
@loop:
    lda explosion_active,x
    beq @next
    
    ; Decrement timer
    dec explosion_timer,x
    bne @next
    
    ; Explosion finished
    lda #0
    sta explosion_active,x
    
@next:
    inx
    cpx #MAX_ENEMIES
    bne @loop
```

### Sprite Animation

```assembly
; In sprite update routine
; Alternate explosion frames
lda explosion_timer,y
and #4
beq @explosion_frame2

lda #EXPLOSION_1
jmp @draw_explosion

@explosion_frame2:
lda #EXPLOSION_2
```

Timer-based frame selection creates dynamic animations.

## Sprite Management

### Efficient OAM Updates

```assembly
update_sprites:
    ; Clear OAM buffer
    ldx #0
    lda #$FF                ; Y = 255 hides sprite
@clear_loop:
    sta $0200,x
    inx
    bne @clear_loop
    
    ; Draw active sprites
    ldx #0                  ; OAM index
    
    ; Ship always first (highest priority)
    lda ship_y
    sta $0200,x             ; Y position
    lda #SHIP_SPRITE
    sta $0201,x             ; Tile
    lda #0
    sta $0202,x             ; Attributes
    lda #SHIP_X
    sta $0203,x             ; X position
```

### Sprite Priority

1. **Player ship**: Always visible
2. **Bullets**: High priority
3. **Explosions**: Override enemies
4. **Enemies**: Lower priority

## Performance Optimization

### Limiting Checks

- Only check active objects
- Exit early on first collision
- Use simple rectangular bounds
- Limit total object count

### NES Constraints

- **64 sprites total**: Plan your budget
- **8 sprites per scanline**: Avoid horizontal clustering
- **CPU cycles**: Balance accuracy vs. speed
- **60 FPS target**: Must complete in ~16ms

## Common Pitfalls

1. **Forgetting sprite 0**: Reserved for special uses
2. **OAM corruption**: Always use DMA
3. **Hit box too large**: Feels unfair to players
4. **Hit box too small**: Collisions missed

## Practice Exercises

1. **Adjust hit boxes**: Try different sizes
2. **Add enemy patterns**: Sine wave movement
3. **Multi-hit enemies**: Require multiple shots
4. **Score display**: Track destroyed enemies

## Next Steps

With collision detection working, we can enhance the game:
- Different enemy types with unique behaviors
- Power-ups that change weapons
- Boss enemies with complex patterns
- Chain reactions for bonus points

The collision system is the heart of action games. This foundation enables any type of shooter or action game on the NES!