# Lesson 2: Making Things Move

## Opening Hook

Static displays are for museums. Games need movement! Today we breathe life into our star, making it glide across the screen like the spaceships in Defender or the ghosts in Pac-Man.

Movement is the soul of gaming. It's what separates a picture from an experience. And on the C64, movement is just math - beautiful, simple math that creates magic.

## Code Walkthrough

### Variables in Assembly

First, we need to track position:

```assembly
; At the end of our code, define storage
player_x:   !byte 20    ; X position (0-39)
player_y:   !byte 12    ; Y position (0-24)
```

These bytes are our variables. Unlike BASIC, we manually manage every byte of memory!

### Calculating Screen Position

The screen is linear in memory. Position = Y * 40 + X:

```assembly
draw_player:
    ; Calculate screen position
    lda player_y
    ; We need to multiply by 40
    ; 40 = 32 + 8, so we can use shifts
    asl             ; *2
    asl             ; *4  
    asl             ; *8
    sta temp        ; Save *8
    asl             ; *16
    asl             ; *32
    clc             ; Clear carry for addition
    adc temp        ; *32 + *8 = *40
    
    ; Add X position
    clc
    adc player_x
    
    ; Add screen base ($0400)
    clc
    adc #$00
    sta screen_lo
    lda #$04
    adc #$00        ; Add carry if any
    sta screen_hi
```

### The Movement Code

Now the magic - making it move:

```assembly
move_right:
    ; Clear current position
    ldy #0
    lda #$20        ; Space character
    sta (screen_lo),y
    
    ; Move position
    inc player_x    ; Increment X position
    
    ; Check boundary
    lda player_x
    cmp #40         ; Right edge?
    bne draw_new
    lda #0          ; Wrap to left
    sta player_x
    
draw_new:
    jsr draw_player
    
    ; Draw at new position  
    ldy #0
    lda #$2a        ; Star character
    sta (screen_lo),y
```

### Timing the Movement

Without delay, it moves too fast to see:

```assembly
    ; Simple delay
    ldx #$40
delay_outer:
    ldy #$00
delay_inner:
    dey
    bne delay_inner
    dex
    bne delay_outer
```

## Interactive Elements

### Experiment 1: Speed Control
Adjust the delay values:
```assembly
ldx #$20    ; Faster
ldx #$80    ; Slower
ldx #$FF    ; Very slow
```

### Experiment 2: Different Directions
Try vertical movement:
```assembly
inc player_y    ; Move down
dec player_y    ; Move up
```

### Experiment 3: Diagonal Movement
Move both X and Y:
```assembly
inc player_x
inc player_y    ; Diagonal down-right
```

## Deep Dive: Screen Memory Layout

The C64 screen memory is like a long ribbon folded into rows:

```
Memory:     Screen:
$0400 ----→ [Row 0, Col 0-39]
$0428 ----→ [Row 1, Col 0-39]
$0450 ----→ [Row 2, Col 0-39]
...
$07C0 ----→ [Row 24, Col 0-39]
```

Position formula: `address = $0400 + (Y * 40) + X`

### Optimization Note

Our multiplication by 40 is slow. Later we'll learn about lookup tables:

```assembly
; Instead of calculating, use a table:
row_table_lo:
    !byte <$0400, <$0428, <$0450...
row_table_hi:
    !byte >$0400, >$0428, >$0450...
```

## Challenge Extensions

1. **Bouncing Ball**: Reverse direction at edges
   ```assembly
   lda player_x
   cmp #39         ; At right edge?
   bne no_reverse
   lda #$ff        ; Set direction to -1
   sta direction
   ```

2. **Trail Effect**: Don't clear old positions immediately

3. **Wrap Both Axes**: Wrap vertically too

4. **Speed Ramping**: Gradually increase speed

## Common Pitfalls

- **Boundary Checking**: Forgetting to check edges = screen corruption
- **Clear Before Draw**: Not erasing old position = trail of stars
- **Y Overflow**: Y > 24 writes outside screen memory
- **Speed Issues**: No delay = invisible movement

## Performance Notes

Our current method:
- Clear old: ~20 cycles
- Calculate position: ~50 cycles  
- Draw new: ~20 cycles
- Delay: ~16,000 cycles

The delay dominates! This is why games use interrupts (coming later).

## Historical Context

Early movement techniques:
- **Space Invaders (1978)**: Moved entire formations as one
- **Pac-Man (1980)**: Tile-based movement (8×8 pixel jumps)
- **Defender (1981)**: Pixel-smooth horizontal scrolling

The C64 could do all of these and more!

## Next Steps

One moving star is cool. But what about controlling it? What if you could guide it with the keyboard, like piloting a ship through space?

Next lesson, we plug in the joystick (or keyboard) and put YOU in control. The star becomes your avatar in the digital realm!