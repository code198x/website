# Lesson 8: Multiple Objects and Arrays

## Opening Hook

One enemy is a duel. Ten enemies is a war. But how do you manage ten, twenty, or fifty objects without writing code for each one? Welcome to the power of arrays and indexed addressing - the technique that let games like Galaga fill the screen with alien armadas.

Today we graduate from hardcoded enemies to dynamic swarms. We'll transform our one-on-one duel into a space battle worthy of an arcade cabinet. This is where assembly programming becomes elegant!

## Code Walkthrough

### From Variables to Arrays

Instead of individual variables:

```assembly
; Old way - doesn't scale
enemy1_x: !byte 0
enemy1_y: !byte 0
enemy2_x: !byte 0
enemy2_y: !byte 0
; ... imagine doing this 20 times!

; New way - arrays!
MAX_ENEMIES = 8
enemy_x:      !fill MAX_ENEMIES, 0
enemy_y:      !fill MAX_ENEMIES, 0
enemy_active: !fill MAX_ENEMIES, 0
enemy_type:   !fill MAX_ENEMIES, 0
```

### Indexed Addressing

The 6502's secret weapon - the X and Y registers as array indices:

```assembly
update_all_enemies:
    ldx #0              ; Start with enemy 0

enemy_loop:
    ; Check if active
    lda enemy_active,x  ; Array access!
    beq next_enemy      ; Skip if inactive

    ; Update this enemy
    dec enemy_x,x       ; Move left
    lda enemy_x,x
    cmp #255           ; Wrapped?
    bne next_enemy

    ; Respawn at right
    lda #39
    sta enemy_x,x

next_enemy:
    inx                 ; Next enemy
    cpx #MAX_ENEMIES
    bne enemy_loop      ; Continue until done

    rts
```

This loop handles ALL enemies with the same code!

### Drawing Multiple Objects

Same principle for rendering:

```assembly
draw_all_enemies:
    ldx #0

draw_loop:
    lda enemy_active,x
    beq skip_draw

    ; Calculate screen position
    lda enemy_y,x       ; Get Y for this enemy
    asl
    asl
    asl
    sta temp
    asl
    asl
    clc
    adc temp           ; Y * 40

    clc
    adc enemy_x,x      ; Add X position

    ; Store position
    clc
    adc #$00
    sta screen_lo
    lda #$04
    adc #$00
    sta screen_hi

    ; Draw enemy
    ldy #0
    lda #$55           ; Enemy character
    sta (screen_lo),y

skip_draw:
    inx
    cpx #MAX_ENEMIES
    bne draw_loop

    rts
```

### Finding Free Slots

When spawning new enemies:

```assembly
spawn_enemy:
    ; Find inactive enemy slot
    ldx #0

find_slot:
    lda enemy_active,x
    beq found_slot      ; Found empty slot!
    inx
    cpx #MAX_ENEMIES
    bne find_slot

    ; No free slots
    rts

found_slot:
    ; Initialize enemy in slot X
    lda #1
    sta enemy_active,x

    lda #39             ; Start position
    sta enemy_x,x

    ; Random Y position
    lda frame_counter
    and #$0f           ; 0-15
    clc
    adc #5             ; 5-20
    sta enemy_y,x

    rts
```

### Collision Checking with Arrays

Check player against all enemies:

```assembly
check_all_collisions:
    ldx #0

collision_loop:
    lda enemy_active,x
    beq next_collision

    ; Check X position
    lda player_x
    cmp enemy_x,x
    bne next_collision

    ; Check Y position
    lda player_y
    cmp enemy_y,x
    bne next_collision

    ; Collision detected!
    jsr handle_collision

    ; Deactivate this enemy
    lda #0
    sta enemy_active,x

next_collision:
    inx
    cpx #MAX_ENEMIES
    bne collision_loop

    rts
```

## Interactive Elements

### Experiment 1: Array Sizes

Try different maximum enemies:

```assembly
MAX_ENEMIES = 4   ; Conservative
MAX_ENEMIES = 16  ; Challenging
MAX_ENEMIES = 32  ; Chaos!
```

### Experiment 2: Enemy Patterns

Use array index for behavior:

```assembly
; Even enemies move straight
; Odd enemies wave
txa
and #$01
beq straight_move
; Wave movement code
```

### Experiment 3: Chain Reactions

Destroy adjacent enemies:

```assembly
; When enemy X dies, check X-1 and X+1
dex
lda enemy_active,x
beq skip_chain
; Destroy neighbor!
```

## Deep Dive: Memory Layout

Our array structure in memory:

```
Address   Data          Array
$0900:    [35]     enemy_x[0]
$0901:    [20]     enemy_x[1]
$0902:    [15]     enemy_x[2]
...
$0908:    [12]     enemy_y[0]
$0909:    [15]     enemy_y[1]
...
```

This layout is cache-friendly and fast!

### Alternative: Structures

Some games use interleaved data:

```assembly
; Structure approach
enemy_data:
; Enemy 0
!byte 35    ; X
!byte 12    ; Y
!byte 1     ; Active
!byte 0     ; Type

; Enemy 1
!byte 20    ; X
!byte 15    ; Y
; etc...

; Access: enemy_data + (index * 4) + offset
```

## Challenge Extensions

1. **Enemy Formations**: Synchronized movement

   ```assembly
   formation_x: !byte 20  ; Base position
   ; All enemies offset from base
   ```

2. **Priority System**: Important enemies update first

   ```assembly
   ; Sort by distance to player
   ; Update nearest enemies more often
   ```

3. **Object Pooling**: Reuse slots efficiently

   ```assembly
   next_slot: !byte 0
   ; Round-robin allocation
   ```

4. **Different Enemy Arrays**: Separate types
   ```assembly
   grunt_x: !fill 8, 0
   boss_x:  !fill 2, 0
   ; Different behaviors per type
   ```

## Common Pitfalls

- **Index Overflow**: X > MAX_ENEMIES crashes!
- **Inactive Updates**: Forgetting to check active flag
- **Array Alignment**: Crossing page boundaries
- **Allocation Bugs**: Same slot used twice

## Performance Analysis

Array processing performance:

```assembly
; 8 enemies, full update:
; 8 * 50 cycles = 400 cycles
; Still under 3% of frame time!

; Linear scaling:
; 16 enemies = 800 cycles
; 32 enemies = 1600 cycles
```

## Memory Optimization

Pack data efficiently:

```assembly
; Wasteful: 4 bytes per enemy
enemy_x:      !fill 8, 0
enemy_y:      !fill 8, 0
enemy_active: !fill 8, 0
enemy_type:   !fill 8, 0
; Total: 32 bytes

; Better: Pack into bits
enemy_data:   !fill 8, 0
; Bits 0-5: X position (0-39)
; Bit 6: Active
; Bit 7: Type
; Total: 8 bytes!
```

## Historical Techniques

How classic games managed objects:

- **Space Invaders**: Fixed grid, bit flags for alive/dead
- **Galaga**: Circular buffers for bullets
- **Robotron**: Separate arrays by enemy type
- **Defender**: Linked lists for dynamic spawning

Each pushed the boundaries of what was possible!

## Debugging Arrays

Visualize your arrays:

```assembly
; Display enemy count
ldx #0
ldy #0
count_loop:
    lda enemy_active,x
    beq skip_count
    iny
skip_count:
    inx
    cpx #MAX_ENEMIES
    bne count_loop

; Y = active enemies
tya
clc
adc #$30
sta $0400  ; Show in corner
```

## Next Steps

We've built the foundation of a real game. We can manage multiple objects, track score, handle states, and create escalating challenges. But something's missing - the visceral feedback that makes games feel alive.

In our next lessons, we'll add collision detection between objects, then dive into the C64's advanced features: smooth sprite graphics, sound effects, and the polish that transforms good games into great ones. The real journey is just beginning!
