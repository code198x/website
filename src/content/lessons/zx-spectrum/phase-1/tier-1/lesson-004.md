---
title: "Collision Detection"
lesson_number: 4
phase_number: 1
tier_number: 1
system: "zx-spectrum"
description: "Add enemy ships and implement collision detection for space combat"
learning_objectives:
  - "Implement efficient collision detection algorithms"
  - "Manage multiple enemy objects with movement"
  - "Use Z80 index registers for data structures"
  - "Create explosion animations with color effects"
concepts:
  - "Index register programming (IX/IY)"
  - "Structured data arrays"
  - "Collision detection mathematics"
  - "Animation timing and effects"
estimated_duration: "45 minutes"
difficulty: "medium"
prerequisites:
  - "Lesson 3: Projectile systems"
  - "Understanding of Z80 registers"
  - "Basic game state concepts"
---

# Lesson 4: Collision Detection

## Space Combat Comes Alive

With our ship firing projectiles, it's time to add targets and create engaging combat. We'll implement enemy ships that move across the screen and a collision detection system that creates satisfying explosions when bullets meet enemies.

## Learning Objectives

By the end of this lesson, you'll master:

- Efficient collision detection on the ZX Spectrum
- Managing multiple game objects with the Z80's index registers
- Creating visual feedback with explosion animations
- Building interactive gameplay systems

## Enemy Management System

### Data Structure Design

We use parallel arrays for enemy data:

```assembly
; Enemy data (3 bytes per enemy)
MAX_ENEMIES     equ     5

enemy_active:   ds      MAX_ENEMIES * 3
; +0: active flag (0/1)
; +1: X position
; +2: Y position
```

This structure allows efficient access using index registers.

### Initializing Enemies

```assembly
init_enemies:
    ld      hl, enemy_active
    ld      b, MAX_ENEMIES
    ld      c, 0            ; Enemy index
    
init_enemy_loop:
    ld      a, 1
    ld      (hl), a         ; Set active
    inc     hl
    
    ; X position - start from right
    ld      a, 30
    sub     c               ; Stagger positions
    sub     c
    ld      (hl), a
    inc     hl
    
    ; Y position - spread vertically
    ld      a, c
    add     a, a            ; * 2
    add     a, a            ; * 4
    add     a, 4            ; Offset from top
    ld      (hl), a
    inc     hl
    
    inc     c
    djnz    init_enemy_loop
```

Enemies start staggered across the right side of the screen.

## Z80 Index Registers

### Understanding IX and IY

The Z80's index registers are perfect for working with data structures:

```assembly
check_collisions:
    ld      ix, bullet_active    ; IX points to bullets
    ld      iy, enemy_active     ; IY points to enemies
    
    ; Access data with offsets
    ld      a, (ix+0)           ; Bullet active flag
    ld      d, (ix+1)           ; Bullet X
    ld      e, (ix+2)           ; Bullet Y
```

### Advantages of Index Registers

1. **Direct offset addressing**: Access structure members easily
2. **Preserved base pointer**: No need to save/restore
3. **Clean code**: More readable than manual pointer arithmetic
4. **Efficient loops**: Increment pointer, not recalculate

## Collision Detection Algorithm

### Simple Distance Checking

Our collision detection uses rectangular bounds:

```assembly
; Check X collision
ld      a, (iy+1)       ; Enemy X
sub     d               ; Enemy X - Bullet X
jr      c, no_collision ; If negative, too far left
cp      2               ; Within 2 characters?
jr      nc, no_collision ; If >= 2, too far right

; Check Y collision
ld      a, (iy+2)       ; Enemy Y
sub     e               ; Enemy Y - Bullet Y
jr      c, no_collision ; If negative, too far up
cp      2               ; Within 2 characters?
jr      nc, no_collision ; If >= 2, too far down

; Collision detected!
```

### Why This Works

- Characters are 8×8 pixels
- 2-character threshold gives good visual overlap
- Simple subtraction avoids complex math
- Early exit optimizes non-collisions

## Complete Collision System

### Nested Loop Structure

```assembly
check_collisions:
    ld      ix, bullet_active
    ld      b, MAX_BULLETS
    
check_bullet_loop:
    push    bc
    
    ld      a, (ix+0)       ; Check if bullet active
    or      a
    jr      z, check_next_bullet
    
    ; Get bullet position
    ld      d, (ix+1)       ; Bullet X
    ld      e, (ix+2)       ; Bullet Y
    
    ; Check against enemies
    ld      iy, enemy_active
    ld      c, MAX_ENEMIES
    
check_enemy_loop:
    ld      a, (iy+0)       ; Check if enemy active
    or      a
    jr      z, check_next_enemy
    
    ; Collision detection here...
    
    ; If collision:
    xor     a
    ld      (ix+0), a       ; Deactivate bullet
    ld      (iy+0), a       ; Deactivate enemy
    
    ; Start explosion
    ld      a, (iy+1)       ; Enemy X
    ld      b, a
    ld      a, (iy+2)       ; Enemy Y
    call    start_explosion
    
    jr      check_next_bullet ; Bullet consumed
```

## Explosion Effects

### Animation System

```assembly
; Explosion data (4 bytes per explosion)
explosion_active: ds    MAX_ENEMIES * 4
; +0: timer (counts down from 8 to 0)
; +1: X position
; +2: Y position
; +3: unused (padding for alignment)
```

### Color Cycling Effect

```assembly
update_explosions:
    ; Draw explosion frame
    ld      b, CHAR_EXPLOSION
    
    ; Cycle colors based on timer
    ld      a, (hl)         ; Timer value
    and     3               ; Modulo 4
    add     a, YELLOW       ; Base color
    or      BRIGHT_BIT      ; Make it bright
    ld      d, a            ; Color in D
    
    call    draw_char
```

The explosion cycles through yellow, green, cyan, and blue.

## Performance Optimization

### Efficient Object Management

1. **Skip inactive objects**: Check active flag first
2. **Early loop exit**: Stop checking after collision
3. **Reuse slots**: Find first inactive slot for new objects
4. **Aligned data**: 4-byte structures for easier math

### Memory Access Patterns

```assembly
; Move to next object
ld      de, 3           ; Structure size
add     ix, de          ; Next bullet

; Or for 4-byte structures
inc     ixh             ; Add 256/4 = 64 objects
```

## Integration and Testing

### Main Game Loop

```assembly
game_loop:
    halt                    ; Wait for 50Hz interrupt
    
    call    update_starfield
    call    read_keyboard
    call    update_player
    call    update_bullets
    call    update_enemies
    call    check_collisions   ; After all movement
    call    update_explosions  ; Visual feedback
    
    jr      game_loop
```

### Order Matters

1. **Move all objects first**
2. **Then check collisions**
3. **Finally update visuals**

This prevents visual glitches and ensures consistent state.

## Common Issues and Solutions

### Problem: Ghost Collisions
**Symptom**: Collisions with inactive objects
**Solution**: Always check active flags first

### Problem: Multiple Hits
**Symptom**: One bullet destroys multiple enemies
**Solution**: Exit loop after first collision

### Problem: Visual Glitches
**Symptom**: Explosions in wrong place
**Solution**: Store position before deactivating

## Practice Challenges

1. **Adjust Collision Box**: Try different threshold values
2. **Add Sound**: BEEP when collision occurs
3. **Score System**: Award points for destroyed enemies
4. **Enemy Patterns**: Make enemies move in sine waves

## Next Steps

With collision detection working, we can enhance gameplay:
- Different enemy types with varied behaviors
- Power-ups that affect weapons
- Boss enemies with multiple hit points
- Chain reactions and combo scoring

The collision system is the heart of action games. Master this foundation, and you can build any type of shooter or action game on the Spectrum!