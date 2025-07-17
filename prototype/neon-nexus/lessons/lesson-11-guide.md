# Lesson 11: Enemy Spawning System

## Opening Hook

Static enemies are predictable. Predictable is boring. But what transformed games like Defender and Galaga into legends? Wave after wave of enemies, each more challenging than the last, appearing just when you thought you were safe.

Today we build a spawning system that breathes life into our game world. No more starting with three enemies and playing until they're gone. Instead, we'll create an endless stream of challenges that adapt to the player's skill level.

## Code Walkthrough

### The Spawn Timer

At the heart of our system is a simple timer:

```assembly
spawn_timer:     !byte 0
enemies_spawned: !byte 0

update_spawning:
    ; Decrement spawn timer
    lda spawn_timer
    beq check_spawn     ; Timer hit zero?
    dec spawn_timer
    rts
    
check_spawn:
    ; Time to spawn! But first, check if we can...
```

This timer counts down every frame. When it hits zero, we attempt to spawn a new enemy.

### Finding a Free Slot

We can't just create enemies infinitely - we need to find an inactive one to reuse:

```assembly
    ; Find first inactive enemy
    lda enemy1_active
    beq spawn_enemy1    ; Found one!
    
    lda enemy2_active
    beq spawn_enemy2
    
    lda enemy3_active
    beq spawn_enemy3
    
    rts                 ; All enemies active, wait
```

This is called "object pooling" - we reuse the same memory instead of allocating new space.

### Dynamic Difficulty

Here's where it gets interesting. The spawn rate increases with level:

```assembly
    ; Set next spawn timer based on level
    lda level
    cmp #5
    bcs fast_spawn      ; Level 5+? Fast!
    cmp #3
    bcs medium_spawn    ; Level 3-4? Medium
    
    lda #120           ; Levels 1-2: Slow (2 seconds)
    jmp set_timer
medium_spawn:
    lda #60            ; 1 second
    jmp set_timer
fast_spawn:
    lda #30            ; 0.5 seconds!
set_timer:
    sta spawn_timer
```

### Spawn Patterns

Not all enemies appear the same way:

```assembly
spawn_enemy1:
    ; Set random starting position
    lda frame_counter   ; Use as pseudo-random
    and #$03           ; 0-3
    asl                ; *2
    asl                ; *4
    asl                ; *8
    clc
    adc #8             ; Starting Y: 8, 16, 24, or 32
    sta enemy1_y
    
    lda #39            ; Always start at right edge
    sta enemy1_x
    lda #1
    sta enemy1_active
```

### UI Feedback

Players need to know the current challenge level:

```assembly
display_enemies:
    ; Show "ENEMIES:" label
    ldx #0
enemies_label_loop:
    lda enemies_text,x
    beq enemies_done
    sta $0400+30,x      ; Row 0, position 30
    inx
    jmp enemies_label_loop
enemies_done:
    
    ; Display count
    lda enemies_spawned
    and #$0f
    clc
    adc #$30           ; Convert to digit
    sta $0400+38
```

## Interactive Elements

### Experiment 1: Spawn Patterns
Try different spawn positions:
```assembly
; Spawn from top and bottom edges too
lda frame_counter
and #$01
beq spawn_top
lda #24         ; Bottom row
jmp set_y
spawn_top:
lda #0          ; Top row
set_y:
sta enemy1_y
```

### Experiment 2: Wave Spawning
Instead of one at a time, spawn groups:
```assembly
; Spawn all three enemies at once!
lda #1
sta enemy1_active
sta enemy2_active
sta enemy3_active
```

### Experiment 3: Smart Spawning
Make spawning respond to player position:
```assembly
; Spawn enemies away from player
lda player_y
cmp #12
bcs spawn_top   ; Player in bottom half? Spawn top
```

## Deep Dive: Random Number Generation

The C64 has no random number generator! Game developers used creative solutions:

1. **Frame Counter**: Our current approach - predictable but "random enough"
2. **User Input Timing**: Time between keypresses
3. **Hardware Noise**: Reading uninitialized memory or the SID chip
4. **Linear Feedback Shift Register**: Mathematical pseudo-randomness

Here's a simple LFSR implementation:
```assembly
random:
    lda seed
    asl
    bcc no_eor
    eor #$1d    ; Magic number for 8-bit LFSR
no_eor:
    sta seed
    rts
```

## Challenge Extensions

1. **Formation Spawning**: Create patterns like V-formations or lines
   ```assembly
   ; Spawn 3 enemies in diagonal line
   lda #39
   sta enemy1_x
   lda #35
   sta enemy2_x
   lda #31
   sta enemy3_x
   ```

2. **Spawn Warnings**: Flash the edge where enemies will appear

3. **Boss Enemies**: Every 10th spawn is a special enemy with more health

4. **Adaptive Difficulty**: Reduce spawn rate when player loses lives

## Common Pitfalls

- **Label Display Bug**: UI disappears after screen clear - always redraw!
- **Spawn Camping**: Enemies appearing on top of the player
- **Memory Leaks**: Not properly resetting enemy states
- **Timer Overflow**: Spawn timer going negative

## Performance Impact

Our spawning system is lightweight:
- Timer check: 3-4 cycles per frame
- Spawn attempt: ~50 cycles when timer expires
- Enemy search: 10-15 cycles

Even with complex patterns, we're using less than 1% of frame time!

## Historical Context

Famous C64 spawning systems:
- **Impossible Mission**: Robots appear based on room layout
- **Paradroid**: Enemies beam in with visual effects
- **Uridium**: Waves perfectly timed to music

Each game solved the same problem differently, creating unique gameplay feels.

## Next Steps

Our enemies spawn, but they're still pretty dumb - moving in straight lines, ignoring the player. What if enemies could hunt you down? What if they moved in formation? What if they had different AI personalities?

Lesson 12 will transform our mindless drones into cunning adversaries. The hunter becomes the hunted!