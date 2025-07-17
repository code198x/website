# Lesson 10: Multiple Enemies

## Opening Hook

One enemy is a challenge. Three enemies? That's chaos! Welcome to the world of managing multiple game objects, where every byte counts and clever code organization makes the impossible possible.

In 1983, games like Robotron: 2084 filled the screen with dozens of enemies. How did they track all those positions, movements, and collisions on a machine with just 64KB of RAM? Let's find out!

## Code Walkthrough

### Expanding Our Variables

First, we need storage for three enemies instead of one:

```assembly
enemy1_x:       !byte 0
enemy1_y:       !byte 0
enemy1_active:  !byte 0
enemy2_x:       !byte 0
enemy2_y:       !byte 0
enemy2_active:  !byte 0
enemy3_x:       !byte 0
enemy3_y:       !byte 0
enemy3_active:  !byte 0
```

Notice the `active` flag? This lets us turn enemies on and off without complex logic.

### Updating Multiple Objects

Here's where things get interesting. We could copy our enemy update code three times, but that's wasteful. Instead:

```assembly
update_enemies:
    ; Update enemy 1
    lda enemy1_active
    beq skip_enemy1     ; Not active? Skip it
    
    dec enemy1_x        ; Move left
    lda enemy1_x
    cmp #255           ; Wrapped around?
    bne skip_enemy1
    lda #39            ; Reset to right edge
    sta enemy1_x
skip_enemy1:
```

This pattern repeats for each enemy. It's not the most elegant solution (we'll learn about loops and arrays later), but it's clear and works!

### Collision Detection Expanded

Now the real challenge - checking three enemies for collision:

```assembly
check_enemy1_collision:
    lda enemy1_active
    beq no_enemy1_collision
    lda player_x
    cmp enemy1_x
    bne no_enemy1_collision
    jsr handle_collision
no_enemy1_collision:
    
    ; Repeat for enemy2 and enemy3...
```

### Different Enemy Behaviors

What makes multiple enemies interesting is variety:

```assembly
    ; Enemy 2 moves slowly
    lda frame_counter
    and #$01           ; Every other frame
    bne skip_enemy2
    dec enemy2_x
    
    ; Enemy 3 moves fast
    dec enemy3_x
    dec enemy3_x       ; Move 2 pixels!
```

## Interactive Elements

### Experiment 1: Enemy Patterns
Try these movement patterns:
```assembly
; Sine wave movement
lda frame_counter
and #$07
tax
lda sine_table,x
sta enemy1_y

; Diagonal movement
dec enemy2_x
inc enemy2_y
```

### Experiment 2: Spawn Timing
Control when enemies appear:
```assembly
lda frame_counter
cmp #60         ; After 1 second
bne skip_spawn
lda #1
sta enemy2_active
```

### Experiment 3: Difficulty Scaling
Make enemies faster as the game progresses:
```assembly
lda level
clc
adc enemy3_x
sta enemy3_x    ; Speed increases with level
```

## Deep Dive: The Cost of Multiple Objects

Every enemy costs us:
- 3 bytes for position and state
- ~20 bytes of update code
- ~15 bytes of collision code
- ~10 bytes of drawing code

For 10 enemies, that's 480 bytes just for basic functionality! This is why C64 games often had limits like "8 enemies on screen" or used tricks like flickering sprites.

## Memory Layout Visualization

```
Memory Map:
$0900: player_x
$0901: player_y
$0902: enemy1_x
$0903: enemy1_y
$0904: enemy1_active
$0905: enemy2_x
...
```

See how our data is organized? Later we'll learn how to use indexed addressing to treat this as an array!

## Challenge Extensions

1. **Enemy Formations**: Make enemies move in synchronized patterns
   ```assembly
   lda enemy1_x
   clc
   adc #5
   sta enemy2_x    ; Enemy2 follows 5 pixels behind
   ```

2. **Smart Spawning**: Only activate new enemies when others are destroyed

3. **Enemy Types**: Use the active byte to store enemy type (1=slow, 2=fast, 3=smart)

4. **Chain Reactions**: When one enemy is hit, make nearby enemies speed up

## Common Pitfalls

- **Collision Check Order**: Always check active flag first, or you'll detect collisions with invisible enemies!
- **Boundary Bugs**: Each enemy needs its own boundary check
- **Performance**: Three enemies means 3x the CPU time - watch your frame rate!

## Optimization Tricks

The pros would use these techniques:

1. **Indexed Addressing**: 
   ```assembly
   ldx #0
   loop:
       lda enemy_x,x
       ; Process enemy
       inx
       cpx #3
       bne loop
   ```

2. **Bitwise Active Flags**: Store all active states in one byte

3. **Shared Routines**: One update routine that works on different data

## Next Steps

Three enemies are good, but what if enemies could appear dynamically? What if we had waves of enemies, each with different behaviors?

In lesson 11, we'll build a spawning system that brings enemies to life based on game conditions. Get ready to turn our static battlefield into a dynamic warzone!