# Lesson 15: Smooth Animation and Timing

## Opening Hook

Watch any classic C64 game closely. See how Mario's legs pump as he runs? How R-Type's ship banking feels natural? How explosions bloom and fade? This isn't just movement - it's the art of animation, where timing transforms static sprites into living entities.

The secret lies in synchronization. The C64's screen refreshes 50 times per second (60 in NTSC). By aligning our code with this rhythm, we achieve butter-smooth animation that feels responsive and alive. Today, we master the raster interrupt - the heartbeat of professional C64 games.

## Code Walkthrough

### Raster Interrupts Explained

The raster is the electron beam drawing your screen. We can trigger code at exact screen positions:

```assembly
setup_irq:
    sei                 ; Disable interrupts while setting up

    ; Set raster line where interrupt triggers
    lda #250            ; Bottom of screen
    sta $d012           ; Raster line register
    lda $d011
    and #$7f            ; Clear high bit of raster line
    sta $d011

    ; Point to our handler
    lda #<irq_handler
    sta $0314
    lda #>irq_handler
    sta $0315

    ; Enable raster interrupts
    lda #$01
    sta $d01a

    cli                 ; Enable interrupts
    rts
```

### The Interrupt Handler

This code runs automatically 50 times per second:

```assembly
irq_handler:
    ; Acknowledge interrupt immediately
    lda #$01
    sta $d019

    ; Set flag for main loop
    inc smooth_update

    ; Update time-critical tasks
    jsr update_particles    ; Visual effects

    ; Return to system
    jmp $ea31              ; Default handler
```

### Animation Frames

Now we can create smooth sprite animation:

```assembly
update_animations:
    ; Animation timer
    inc anim_timer
    lda anim_timer
    cmp #8              ; Change frame every 8 refreshes
    bcc no_anim_update

    ; Reset timer and advance frame
    lda #0
    sta anim_timer

    ; Cycle through 3 frames
    inc anim_frame
    lda anim_frame
    and #$03            ; Keep in range 0-3
    sta anim_frame

    ; Update sprite pointer
    clc
    adc #13             ; Base sprite number
    sta SPRITE0_PTR     ; Animate player
```

8 refreshes = 160ms per frame = smooth animation!

### Creating Animation Frames

Three frames for our star sprite - normal, rotating, pulsing:

```assembly
player_frame0:  ; Normal star
    !byte %00000000,%00011000,%00000000
    !byte %11111111,%11111111,%11111111
    ; ... rest of star shape

player_frame1:  ; Rotating star
    !byte %00000001,%10000000,%00000000
    !byte %01111111,%11111110,%00000000
    ; ... diagonal orientation

player_frame2:  ; Pulsing star
    !byte %00000000,%00000000,%00000000
    !byte %00111111,%11111111,%11111100
    ; ... smaller/larger version
```

### Smooth Movement

Instead of moving 1 pixel per frame, we use subpixel timing:

```assembly
update_player:
    ; Subpixel movement counter
    inc player_subpixel
    lda player_subpixel
    cmp #2              ; Move every 2nd frame
    bcc player_done

    lda #0
    sta player_subpixel

    ; Now move 1 pixel
    inc player_x
player_done:
    rts
```

This gives us 25 pixels/second instead of 50 - much more controllable!

### Synchronized Game Loop

The key is waiting for the raster interrupt:

```assembly
game_loop:
    ; Wait for smooth update flag
    lda smooth_update
    beq game_loop       ; Spin until interrupt sets it

    lda #0
    sta smooth_update   ; Clear flag

    ; Now do one frame of game logic
    jsr update_animations
    jsr update_positions
    jsr update_sprites

    jmp game_loop
```

## Interactive Elements

### Experiment 1: Animation Speed

Try different frame delays:

```assembly
cmp #4   ; Faster animation (80ms/frame)
cmp #16  ; Slower animation (320ms/frame)
```

### Experiment 2: Movement Curves

Use sine tables for smooth motion:

```assembly
ldx enemy_x
lda sine_table,x
lsr
lsr
clc
adc #100        ; Base Y position
sta enemy_y     ; Creates wave motion
```

### Experiment 3: Multi-Phase Animation

Chain animations together:

```assembly
; 0-3: Flying animation
; 4-7: Banking left
; 8-11: Banking right
; 12-15: Explosion
```

## Deep Dive: Frame Rate Mathematics

PAL C64: 50Hz refresh rate

- 1 frame = 20ms = 19,656 CPU cycles
- Visible screen: ~15,000 cycles
- VBLANK period: ~4,656 cycles

Timing calculations:

```assembly
; For 30 FPS animation:
; 50Hz / 30FPS = update every 1.67 frames
; Solution: alternate between 1 and 2 frame delays

fps_30_counter: !byte 0
    inc fps_30_counter
    lda fps_30_counter
    and #$01
    beq wait_one
    ; Wait 2 frames
    jmp wait_two
```

### Raster Timing Tricks

Different raster positions serve different purposes:

```assembly
; Line 0: Start of frame - game logic
; Line 50: After screen clear - sprite updates
; Line 250: Bottom border - prepare next frame
; Line 255: During VBLANK - heavy processing
```

## Challenge Extensions

1. **Parallax Scrolling**: Update different elements at different rates

   ```assembly
   ; Background: every 4 frames
   ; Midground: every 2 frames
   ; Foreground: every frame
   ```

2. **Interpolated Movement**: Smooth position between integer coordinates

3. **Animation State Machine**: Complex animations with transitions

   ```assembly
   ; Idle -> Run -> Jump -> Fall -> Land -> Idle
   ```

4. **Particle System**: Multiple animated effects simultaneously

## Common Pitfalls

- **Interrupt Conflicts**: Multiple interrupts fighting
- **Frame Drops**: Too much work in one frame
- **Animation Sync**: Different sprites out of phase
- **Raster Jitter**: Unstable timing from poor code

## Performance Profiling

Our frame budget (PAL):

```
Total: 19,656 cycles
- Interrupt overhead: 100 cycles
- Animation updates: 200 cycles
- Sprite positioning: 150 cycles
- Game logic: 2,000 cycles
- Available: 17,206 cycles
```

We're using less than 15% of frame time!

## Historical Masterpieces

Games with legendary animation:

- **Shadow of the Beast**: 12-frame walk cycles
- **Turrican**: Smooth rotation and scaling effects
- **First Samurai**: Film-quality sword animations
- **Creatures**: Cartoon-quality character expression

Each pushed the limits of what 64KB could achieve.

## Sine Table Magic

Pre-calculated tables save cycles:

```assembly
sine_table:
    !byte 128,131,134,137,140,143,146,149
    !byte 152,156,159,162,165,168,171,174
    ; ... 256 values total

; Usage: smooth wave motion
ldx frame_counter
lda sine_table,x
sta enemy_y
```

One table lookup vs. complex math = 100x faster!

## Next Steps

We've achieved smooth animation, but what about when things get hectic? What happens when 20 enemies fill the screen? How do we maintain that silky 50fps when explosions light up the display?

Lesson 16 introduces optimization techniques that separate amateur games from professional releases. Time to make every cycle count!
