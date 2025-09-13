# Lesson 12: Enhanced Enemy Behaviors

## Opening Hook

What made Pac-Man's ghosts terrifying wasn't their speed - it was their intelligence. Blinky chased you directly. Pinky tried to cut you off. Inky was unpredictable. Clyde... well, Clyde did his own thing. Each ghost had personality, making every game a unique dance of death.

Today, we give our enemies souls. No more mindless drones floating left. We're creating adversaries that hunt, dodge, coordinate, and surprise. Welcome to AI programming, 1980s style!

## Code Walkthrough

### Behavior Types

First, we add a behavior type to each enemy:

```assembly
enemy1_behavior:   !byte 0
enemy2_behavior:   !byte 0
enemy3_behavior:   !byte 0

; Behavior types:
; 0 = Standard (move left)
; 1 = Wave (sine wave motion)
; 2 = Tracking (follow player Y)
; 3 = Homing (aggressive pursuit)
```

### Wave Motion

Our first smart behavior - enemies that bob and weave:

```assembly
enemy1_wave:
    ; Sine wave movement
    dec enemy1_x        ; Still moving left

    lda frame_counter
    and #$08           ; Check bit 3 (changes every 8 frames)
    beq enemy1_wave_down

    dec enemy1_y       ; Move up
    lda enemy1_y
    cmp #8             ; Top boundary
    bcs check_enemy1_bounds
    lda #8
    sta enemy1_y
    jmp check_enemy1_bounds

enemy1_wave_down:
    inc enemy1_y       ; Move down
    lda enemy1_y
    cmp #22            ; Bottom boundary
    bcc check_enemy1_bounds
    lda #22
    sta enemy1_y
```

The magic is using frame_counter to create smooth, predictable motion without complex math!

### Tracking Behavior

Now for something scarier - enemies that follow you:

```assembly
enemy1_tracking:
    ; Move toward player Y position
    dec enemy1_x        ; Still moving left

    lda player_y
    cmp enemy1_y
    beq check_enemy1_bounds  ; Already aligned
    bcc enemy1_move_up       ; Player is above

    inc enemy1_y        ; Move down toward player
    jmp check_enemy1_bounds

enemy1_move_up:
    dec enemy1_y        ; Move up toward player
```

Simple but effective - the enemy always moves toward your vertical position!

### Homing Behavior

The ultimate predator - fast and relentless:

```assembly
enemy1_homing:
    ; Aggressive pursuit mode
    dec enemy1_x

    ; Move faster every other frame
    lda frame_counter
    and #$01
    beq skip_extra_move
    dec enemy1_x        ; Double speed!

skip_extra_move:
    ; Track Y position but with delay
    lda frame_counter
    and #$03           ; Only adjust every 4 frames
    bne check_enemy1_bounds

    ; Now track Y like before...
```

### Formation Spawning

Different enemy combinations create different challenges:

```assembly
spawn_wave:
    ; Spawn horizontal wave of 3 enemies
    lda #39
    sta enemy1_x
    sta enemy2_x
    sta enemy3_x

    lda #10
    sta enemy1_y
    lda #15
    sta enemy2_y       ; Staggered Y positions
    lda #20
    sta enemy3_y

    ; All use wave behavior
    lda #1
    sta enemy1_behavior
    sta enemy2_behavior
    sta enemy3_behavior
```

## Interactive Elements

### Experiment 1: Behavior Mixing

Combine behaviors for complex patterns:

```assembly
; Wave + Tracking = Serpentine hunter
lda frame_counter
and #$10
beq do_track
jsr enemy1_wave
jmp done
do_track:
jsr enemy1_tracking
```

### Experiment 2: Formation Movement

Make enemies move as a group:

```assembly
; Enemy 2 follows enemy 1
lda enemy1_y
clc
adc #3          ; 3 pixels below
sta enemy2_y
```

### Experiment 3: Adaptive AI

Make enemies smarter over time:

```assembly
; Increase tracking speed with level
lda level
cmp enemy_speed
bcc normal_speed
dec enemy1_x    ; Extra movement at higher levels
```

## Deep Dive: AI State Machines

Professional game AI uses state machines. Here's a simple example:

```assembly
; Enemy states
; 0 = Patrol
; 1 = Chase
; 2 = Retreat
; 3 = Attack

enemy_ai:
    lda enemy_state
    cmp #0
    beq patrol_mode
    cmp #1
    beq chase_mode
    ; etc...

patrol_mode:
    ; Check if player is near
    lda player_x
    sec
    sbc enemy_x
    cmp #10         ; Within 10 pixels?
    bcs keep_patrol

    ; Switch to chase mode!
    lda #1
    sta enemy_state
```

### Performance Tricks

The sine wave table saves precious cycles:

```assembly
sine_table:
    !byte 128,131,134,137,140,143,146,149...

; Using the table:
ldx enemy1_x
lda sine_table,x
lsr                 ; Scale down
lsr
clc
adc #140           ; Center position
sta enemy1_y
```

Pre-calculated values are always faster than real-time math!

## Challenge Extensions

1. **Personality System**: Give each enemy slot a permanent personality

   ```assembly
   ; Enemy 1 is always aggressive
   ; Enemy 2 is always cautious
   ; Enemy 3 is random
   ```

2. **Coordinated Attacks**: Enemies work together

   ```assembly
   ; If enemy1 is above player, enemy2 goes below
   ; Pincer movement!
   ```

3. **Learning AI**: Track player habits

   ```assembly
   player_prefers_top: !byte 0
   ; Increment when player stays in top half
   ; Spawn more enemies there!
   ```

4. **Boss Behaviors**: Special movement patterns
   ```assembly
   ; Figure-8 pattern
   ; Teleportation
   ; Shield phases
   ```

## Common Pitfalls

- **Branch Distance Errors**: Complex AI needs JMP, not BEQ/BNE
- **Frame Dependency**: Behavior tied too tightly to frame counter
- **Boundary Violations**: Smart movement forgetting screen limits
- **CPU Overhead**: Too much AI processing per frame

## Historical Examples

Classic C64 enemy behaviors:

- **Choplifter**: Tanks that aim at your future position
- **Beach Head**: Planes that dive-bomb in curves
- **Fort Apocalypse**: Robots with patrol routes
- **Dropzone**: Aliens with formation flying

Each pushed the 1MHz processor to create believable opponents.

## Optimization Notes

Our behavior system costs:

- Standard movement: ~10 cycles
- Wave movement: ~30 cycles
- Tracking: ~25 cycles
- Homing: ~40 cycles

With 3 enemies, worst case is 120 cycles - still under 1% of frame time!

## Next Steps

Our enemies are smart, but our collision detection is still using character positions. What if we could have pixel-perfect movement? What if the C64 could automatically detect collisions for us?

Next lesson, we leave the world of PETSCII behind and enter the realm of hardware sprites. Prepare for a massive upgrade in visual quality and performance!
