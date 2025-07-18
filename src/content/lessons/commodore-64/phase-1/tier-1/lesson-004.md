---
title: "Collision Detection"
lesson_number: 4
phase_number: 1
tier_number: 1
system: "commodore-64"
description: "Implement collision detection to create interactive gameplay"
learning_objectives:
  - "Design efficient collision detection algorithms"
  - "Manage object interactions and state changes"
  - "Create visual feedback with explosion animations"
  - "Understand game loop integration"
concepts:
  - "Bounding box collision detection"
  - "Object state management"
  - "Animation sequences"
  - "Game object relationships"
estimated_duration: "45 minutes"
difficulty: "medium"
prerequisites:
  - "Lesson 3: Shooting mechanics"
  - "Understanding of object arrays"
  - "Basic game state concepts"
---

# Lesson 4: Collision Detection

## Creating Interactive Gameplay

Now that we have a ship that shoots and a moving starfield, it's time to add obstacles and make the game interactive. We'll implement collision detection between bullets and asteroids, creating the foundation for engaging gameplay.

## Learning Objectives

By the end of this lesson, you'll understand:

- How to implement efficient collision detection in assembly
- Managing interactions between multiple game objects
- Creating visual feedback with explosion animations
- Integrating collision systems into the game loop

## The Collision Detection System

### Adding Asteroids

First, we need objects for our bullets to collide with:

```assembly
; Asteroid constants
MAX_ASTEROIDS = 8
CHAR_ASTEROID = 79  ; 'O' character
COLOR_BROWN = 9
ASTEROID_SPEED = 1

; Asteroid arrays
asteroid_active:   !fill MAX_ASTEROIDS, 0
asteroid_x:        !fill MAX_ASTEROIDS, 0
asteroid_y:        !fill MAX_ASTEROIDS, 0
```

We use parallel arrays to track each asteroid's state and position, similar to our bullet system.

### Collision Algorithm

Our collision detection uses simple bounding box checking:

```assembly
; Check collision between two objects
; Input: object1_x/y, object2_x/y
; Output: Carry set if collision
check_object_collision:
    ; Check X collision
    lda object1_x
    sec
    sbc object2_x
    bcs .positive_x
    ; Make positive
    eor #$ff
    clc
    adc #1
.positive_x:
    cmp #2              ; Within 2 characters
    bcs .no_collision
    
    ; Check Y collision
    lda object1_y
    sec
    sbc object2_y
    bcs .positive_y
    ; Make positive
    eor #$ff
    clc
    adc #1
.positive_y:
    cmp #2              ; Within 2 characters
    bcs .no_collision
    
    ; Collision!
    sec
    rts
    
.no_collision:
    clc
    rts
```

This algorithm:
1. Calculates the absolute distance between objects on X axis
2. Checks if X distance is within collision range
3. Repeats for Y axis
4. Returns with carry set if both axes are within range

### Checking All Collisions

We check every bullet against every asteroid:

```assembly
check_collisions:
    ldx #0              ; Bullet index
.collision_bullet_loop:
    lda bullet_active,x
    beq .collision_next_bullet
    
    ; Store bullet position
    lda bullet_x,x
    sta object1_x
    lda bullet_y,x
    sta object1_y
    
    ; Check against all asteroids
    ldy #0              ; Asteroid index
.collision_asteroid_loop:
    lda asteroid_active,y
    beq .collision_next_asteroid
    
    ; Check collision...
    jsr check_object_collision
    bcc .collision_next_asteroid
    
    ; Handle collision!
```

## Visual Feedback

### Explosion Animation

When a collision occurs, we create an explosion effect:

```assembly
; Explosion variables
explosion_active:  !byte 0
explosion_x:       !byte 0
explosion_y:       !byte 0
explosion_frame:   !byte 0

explosion_colors:
    !byte COLOR_YELLOW, COLOR_ORANGE, COLOR_PURPLE, COLOR_WHITE
```

The explosion cycles through colors to create a simple animation effect.

### Updating Explosions

```assembly
update_explosions:
    lda explosion_active
    beq .done
    
    ; Update animation frame
    inc explosion_frame
    lda explosion_frame
    cmp #8              ; Animation length
    bcc .draw_explosion
    
    ; End explosion
    lda #0
    sta explosion_active
    rts
    
.draw_explosion:
    ; Draw explosion character
    lda explosion_y
    jsr get_screen_address
    ldy explosion_x
    lda #CHAR_EXPLOSION
    sta (screen_ptr),y
    
    ; Cycle colors for effect
    lda explosion_frame
    and #3
    tax
    lda explosion_colors,x
    sta (color_ptr),y
```

## Game State Management

### Object Lifecycle

Each game object follows a lifecycle:
1. **Inactive**: Available for use
2. **Active**: Currently in game
3. **Colliding**: Interacting with another object
4. **Destroyed**: Being removed from game

### Collision Response

When a collision is detected:
```assembly
; Deactivate bullet
lda #0
sta bullet_active,x

; Deactivate asteroid
lda #0
sta asteroid_active,y

; Start explosion
lda asteroid_x,y
sta explosion_x
lda asteroid_y,y
sta explosion_y
lda #1
sta explosion_active
```

## Performance Considerations

### Optimization Strategies

1. **Early Exit**: Skip inactive objects
2. **Simple Math**: Avoid multiplication/division
3. **Efficient Loops**: Minimize iterations
4. **Zero Page**: Use for frequently accessed variables

### Collision Detection Trade-offs

- **Accuracy vs Speed**: Character-based collision is fast but coarse
- **Object Count**: O(n²) algorithm limits practical object counts
- **Spatial Partitioning**: Not needed for small object counts

## Integration Tips

### Game Loop Order

The order of operations matters:
```assembly
game_loop:
    jsr handle_input
    jsr update_ship
    jsr update_bullets
    jsr update_asteroids
    jsr check_collisions    ; After all movement
    jsr update_explosions   ; Visual feedback last
```

### State Consistency

Always update object states atomically:
- Clear old position
- Update position
- Check collisions
- Draw at new position

## Common Pitfalls

1. **Forgetting to clear old positions** - Leaves trails
2. **Checking inactive objects** - Wastes cycles and causes false collisions
3. **Not handling edge cases** - Screen boundaries, wraparound
4. **Complex collision shapes** - Keep it simple for performance

## Practice Exercises

1. **Adjust collision sensitivity**: Change the collision distance threshold
2. **Add sound effects**: Play a sound when collision occurs
3. **Implement scoring**: Award points for destroyed asteroids
4. **Create asteroid patterns**: Make asteroids move in formations

## Next Steps

With collision detection working, we can now:
- Add different asteroid types with varying points
- Implement power-ups the player can collect
- Create enemy ships that shoot back
- Add multiple lives and game over conditions

The collision system is the foundation for all gameplay interactions. Master this, and you can create any type of game!