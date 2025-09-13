# Lesson 16: Optimized Screen Updates

## Opening Hook

Here's a dirty secret: most C64 games cheat. They don't update the entire screen every frame. They don't redraw every sprite. They use every optimization trick in the book to maintain that crucial 50fps. Why? Because the difference between 50fps and 30fps isn't just numbers - it's the difference between responsive and sluggish, between professional and amateur.

Today we pull back the curtain on optimization. We'll implement dirty rectangles, unrolled loops, lookup tables, and efficient screen clearing. These techniques transformed the C64 from a home computer into an arcade machine killer.

## Code Walkthrough

### Fast Screen Clearing

Our old method cleared one byte at a time. Here's the optimized version:

```assembly
fast_clear_screen:
    ; Unrolled loop - 4x faster!
    lda #32             ; Space character
    ldx #0
clear_page1:
    sta $0400,x         ; Screen RAM page 1
    sta $0400+256,x     ; Page 2
    sta $0400+512,x     ; Page 3
    sta $0400+768-40,x  ; Page 4 (minus status line)
    inx
    bne clear_page1
```

Instead of 1000 iterations, we do 256. Instead of loop overhead each byte, we do it every 4 bytes. Result: 75% faster!

### Dirty Flag System

Why redraw text that hasn't changed?

```assembly
screen_dirty:   !byte 0

; In collision handler:
    dec lives
    inc screen_dirty    ; Mark UI as needing update

; In game loop:
    lda screen_dirty
    beq skip_display    ; Nothing changed? Skip!
    jsr display_score
    jsr display_lives
    lda #0
    sta screen_dirty    ; Clear flag
skip_display:
```

This simple flag can save thousands of cycles per frame!

### Lookup Tables for Speed

Calculate once, use many times:

```assembly
; Row lookup tables
row_lo:
    !byte <($0400+0), <($0400+40), <($0400+80)...
row_hi:
    !byte >($0400+0), >($0400+40), >($0400+80)...

; Using the table (OLD way - slow):
    lda y_position
    ; Multiply by 40... lots of code

; Using the table (NEW way - fast):
    ldy y_position
    lda row_lo,y        ; 4 cycles!
    sta pointer
    lda row_hi,y        ; 4 cycles!
    sta pointer+1
```

### VBLANK Updates Only

Critical updates happen during vertical blank:

```assembly
irq_handler:
    ; We're in VBLANK - screen isn't being drawn
    ; Perfect time for updates that would cause flicker

    jsr update_particles    ; Visual effects
    ; Particle updates here won't tear

    inc vblank_flag        ; Tell main loop we're ready
```

### Particle System Optimization

Our particle system shows advanced techniques:

```assembly
update_particles:
    ldx #0
particle_loop:
    lda particle_life,x
    beq next_particle   ; Dead? Skip it!

    ; Decay life
    dec particle_life,x

    ; Erase old position (smart clearing)
    ldy particle_old_pos,x
    lda #32
    sta $0400,y

    ; Calculate new position using tables
    lda particle_y,x
    lsr
    lsr
    lsr                 ; /8 for character row
    tay
    lda row_lo,y        ; Table lookup!
    clc
    adc particle_x,x
    sta particle_old_pos,x
```

## Interactive Elements

### Experiment 1: Loop Unrolling

Compare performance:

```assembly
; Slow version
    ldx #0
loop:
    sta $0400,x
    inx
    bne loop

; Fast version (unrolled 4x)
loop:
    sta $0400,x
    sta $0401,x
    sta $0402,x
    sta $0403,x
    inx
    inx
    inx
    inx
    bne loop
```

### Experiment 2: Dirty Regions

Track which parts of screen need updates:

```assembly
dirty_rows: !fill 25, 0

; Mark row 10 as dirty
lda #1
sta dirty_rows+10

; Only clear dirty rows
ldx #0
check_rows:
    lda dirty_rows,x
    beq skip_row
    jsr clear_row
skip_row:
    inx
    cpx #25
    bne check_rows
```

### Experiment 3: Frame Skipping

Maintain speed by skipping frames:

```assembly
    inc frame_skip
    lda frame_skip
    and #$01        ; Skip every other frame
    beq skip_expensive_stuff
    jsr expensive_routine
skip_expensive_stuff:
```

## Deep Dive: Cycle Counting

Let's count cycles for common operations:

```assembly
; Memory access cycles:
lda #$00        ; 2 cycles - immediate
lda $1000       ; 4 cycles - absolute
lda $10         ; 3 cycles - zero page
lda ($10),y     ; 5 cycles - indirect indexed

; Why it matters:
; 50 FPS = 19,656 cycles per frame
; Drawing 100 characters the slow way:
; 100 * 20 cycles = 2,000 cycles (10% of frame!)
; With optimization: 500 cycles (2.5% of frame)
```

### Memory Access Patterns

Cache-friendly access on modern CPUs applies here too:

```assembly
; Bad - jumping around memory
lda $0400
sta $d800
lda $0500
sta $d900

; Good - sequential access
ldx #0
loop:
    lda $0400,x
    sta $d800,x
    inx
    bne loop
```

## Challenge Extensions

1. **Double Buffering**: Draw to off-screen buffer, swap instantly

   ```assembly
   ; Page 1: $0400 (visible)
   ; Page 2: $0C00 (hidden)
   ; Swap by changing VIC register
   ```

2. **Sprite Multiplexing**: Reuse sprites on different scanlines

3. **Differential Updates**: Only send changes, not full state

4. **Compiled Sprites**: Generate custom code for each sprite

## Common Pitfalls

- **Over-Optimization**: Code becomes unreadable
- **Timing Dependencies**: Optimizations breaking on NTSC
- **Memory Corruption**: Lookup tables overwriting data
- **Update Order**: Visual glitches from wrong update sequence

## Profiling Results

Our optimizations in action:

```
Original frame time:
- Clear screen: 4,000 cycles
- Update sprites: 800 cycles
- Draw UI: 1,200 cycles
- Total: 6,000 cycles (30%)

Optimized frame time:
- Clear screen: 1,000 cycles
- Update sprites: 400 cycles
- Draw UI: 200 cycles (dirty flag)
- Total: 1,600 cycles (8%)
```

We just freed up 22% of our frame time!

## Historical Optimization Tricks

Legendary optimizations:

- **Impossible Mission**: Compiled sprite routines
- **Rescue on Fractalus**: Fractal landscape in real-time
- **Elite**: 3D universe in 64KB
- **Stunt Car Racer**: 3D physics at 25fps

Each game pioneered techniques still used today.

## The Optimization Mindset

Rules for C64 optimization:

1. **Measure First**: Don't guess, count cycles
2. **Optimize Hotspots**: 80/20 rule applies
3. **Trade Space for Speed**: Tables over calculation
4. **Minimize Memory Access**: Cache in registers
5. **Unroll Wisely**: Balance size vs speed

## Memory vs Speed Tradeoffs

```assembly
; Memory efficient (small, slow):
multiply_by_40:
    asl         ; *2
    asl         ; *4
    asl         ; *8
    sta temp
    asl         ; *16
    asl         ; *32
    clc
    adc temp    ; *32 + *8 = *40
    rts         ; Total: ~40 cycles

; Speed efficient (large, fast):
multiply_by_40_table:
    tax
    lda mult40_lo,x
    ldy mult40_hi,x
    rts         ; Total: 10 cycles!
```

## Next Steps

We've mastered the fundamentals. Our game runs smooth, looks great, and responds instantly. But we're only halfway through our journey. What about sound effects that make players jump? Background music that gets stuck in their heads? Power-ups that change everything?

The next lessons will add the polish that transforms a tech demo into a game people remember 40 years later. Ready to make some noise?
