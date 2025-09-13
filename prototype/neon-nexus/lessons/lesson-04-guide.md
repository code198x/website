# Lesson 4: Adding an Enemy

## Opening Hook

A hero needs a villain. Mario has Bowser. Pac-Man has ghosts. Your star needs... something to make life interesting. Today, we populate your digital universe with its first autonomous inhabitant - an enemy that moves with purpose and menace.

This is where programming becomes game design. How fast should enemies move? Where should they appear? How should they behave? Every decision shapes the player's experience. Let's create your first digital adversary!

## Code Walkthrough

### Enemy Variables

Just like our player, enemies need position:

```assembly
; Enemy data
enemy_x:    !byte 35    ; Start near right edge
enemy_y:    !byte 12    ; Same row as player
enemy_char: !byte $56   ; Different character (box)
```

### Basic Enemy Movement

Let's make it move left while the player moves right:

```assembly
move_enemy:
    ; Clear current position
    jsr calculate_enemy_pos
    ldy #0
    lda #$20            ; Space
    sta (screen_lo),y

    ; Move left
    dec enemy_x

    ; Check left boundary
    lda enemy_x
    cmp #255            ; Wrapped around?
    bne draw_enemy

    ; Respawn at right
    lda #39
    sta enemy_x

draw_enemy:
    jsr calculate_enemy_pos
    ldy #0
    lda enemy_char
    sta (screen_lo),y

    ; Make it red
    lda #$02
    sta (color_lo),y
    rts
```

### Calculating Enemy Position

We need a separate routine for enemy screen position:

```assembly
calculate_enemy_pos:
    ; Same math as player, but for enemy
    lda enemy_y
    asl
    asl
    asl
    sta temp
    asl
    asl
    clc
    adc temp        ; Y * 40

    clc
    adc enemy_x

    ; Store in screen pointer
    clc
    adc #$00
    sta screen_lo
    lda #$04
    adc #$00
    sta screen_hi

    ; Also calculate color RAM
    lda screen_lo
    sta color_lo
    lda #$d8        ; Color RAM high byte
    sta color_hi
    rts
```

### The Main Game Loop

Now we update both objects:

```assembly
game_loop:
    ; Read player input
    jsr read_keyboard
    jsr check_boundaries

    ; Update player
    jsr clear_player
    jsr draw_player

    ; Update enemy
    jsr move_enemy

    ; Delay
    jsr delay

    jmp game_loop
```

### Creating Variety

Different enemy types with different behaviors:

```assembly
enemy_type: !byte 0     ; 0=left, 1=diagonal, 2=seeking

move_enemy:
    lda enemy_type
    cmp #0
    beq move_left
    cmp #1
    beq move_diagonal
    ; Fall through to seeking

move_seeking:
    ; Move toward player!
    lda player_x
    cmp enemy_x
    beq check_y
    bcc enemy_left
    inc enemy_x     ; Player is right
    jmp check_y
enemy_left:
    dec enemy_x     ; Player is left

check_y:
    lda player_y
    cmp enemy_y
    beq draw_enemy
    bcc enemy_up
    inc enemy_y
    jmp draw_enemy
enemy_up:
    dec enemy_y
    jmp draw_enemy
```

## Interactive Elements

### Experiment 1: Enemy Speed

Make enemy move at different rates:

```assembly
enemy_speed: !byte 2

; Only move every N frames
dec enemy_speed
bne skip_enemy_move
lda #2              ; Reset counter
sta enemy_speed
jsr move_enemy
skip_enemy_move:
```

### Experiment 2: Multiple Enemies

Add a second enemy:

```assembly
enemy2_x: !byte 5
enemy2_y: !byte 20

; Update both in game loop
jsr move_enemy
jsr move_enemy2
```

### Experiment 3: Enemy Patterns

Create movement patterns:

```assembly
; Sine wave movement
inc enemy_phase
lda enemy_phase
and #$0f        ; 0-15
tax
lda sine_table,x
sta enemy_y
```

## Deep Dive: Game Balance

Enemy design is game design:

**Speed Balance:**

- Too slow = boring
- Too fast = impossible
- Just right = tension

**Spawn Position:**

- Too close = unfair
- Too far = no challenge
- Edge spawning = predictable but fair

**Movement Patterns:**

- Straight line = predictable
- Random = frustrating
- Patterns = learnable challenge

## Challenge Extensions

1. **Enemy Waves**: Spawn enemies in groups

   ```assembly
   wave_counter: !byte 3

   ; Spawn 3 enemies with delay
   dec wave_counter
   beq spawn_enemy
   ```

2. **Smart Enemies**: Predict player movement

   ```assembly
   ; Check player direction
   ; Move to intercept!
   ```

3. **Enemy States**: Patrol, chase, retreat

   ```assembly
   enemy_state: !byte 0
   ; 0 = patrol
   ; 1 = spotted player
   ; 2 = chasing
   ```

4. **Environmental Enemies**: Enemies that use the screen layout

## Common Pitfalls

- **Same Position Conflicts**: Player and enemy in same spot
- **No Respawn Logic**: Enemy disappears forever
- **Movement Overflow**: Enemy coordinates going negative
- **Visual Confusion**: Enemy looks too similar to player

## Performance Impact

Adding enemies costs:

- Position storage: 3 bytes per enemy
- Movement logic: ~50 cycles per enemy
- Drawing: ~40 cycles per enemy

With 5 enemies: ~450 cycles (2% of frame time)

## Historical Examples

Famous first enemies:

- **Space Invaders**: Marching formation
- **Pac-Man**: Four ghosts, four personalities
- **Donkey Kong**: Barrels with physics
- **Defender**: Landers that steal humans

Each defined their game's identity!

## Enemy Design Philosophy

Good enemies:

1. **Readable**: Player can predict behavior
2. **Fair**: Avoidable with skill
3. **Interesting**: Not just obstacles
4. **Escalating**: Increase challenge over time

## Debugging Enemies

Visual debugging helps:

```assembly
; Show enemy target
lda #'X'
sta target_position

; Show enemy state
lda enemy_state
clc
adc #$30        ; Convert to digit
sta $0400       ; Display in corner
```

## Next Steps

We have a player and an enemy, but they pass through each other like ghosts. In the real world (and good games), things collide. Objects bounce, explode, or stop when they meet.

Next lesson adds collision detection - where the game truly begins. When objects can touch, everything changes. Ready to make contact?
