# Lesson 5: Boundary Checking

## Opening Hook

In space, no one can hear you scream. But on the C64, everyone can see your sprite wrap around the screen wrong! Today we tackle one of gaming's fundamental challenges: keeping things where they belong.

From Pong's paddles to Pac-Man's maze walls, boundary checking defines the playable space. It's the invisible fence that keeps our digital world coherent. Let's build those fences and make our game world solid.

## Code Walkthrough

### Understanding Screen Boundaries

The C64 text screen has clear limits:

```assembly
; Screen dimensions
; X: 0-39 (40 columns)
; Y: 0-24 (25 rows)
; Total characters: 1000
; Memory range: $0400-$07E7
```

But here's the tricky part - position 40 doesn't wrap to position 0, it goes to row 2, position 0!

### Basic Boundary Check

Let's fix our movement code:

```assembly
move_right:
    inc player_x
    lda player_x
    cmp #40         ; At right boundary?
    bcc draw_player ; If less than 40, we're OK

    ; Hit boundary - handle it
    lda #39         ; Stay at edge
    sta player_x
    ; OR wrap around:
    ; lda #0
    ; sta player_x
```

The `bcc` (Branch if Carry Clear) is key - it branches if A < 40.

### Complete Four-Direction Boundaries

Here's the full implementation:

```assembly
check_boundaries:
    ; Check right boundary
    lda player_x
    cmp #40
    bcc check_left
    lda #39         ; Clamp to edge
    sta player_x

check_left:
    lda player_x
    cmp #255        ; Wrapped around from 0?
    bne check_top
    lda #0          ; Clamp to left edge
    sta player_x

check_top:
    lda player_y
    cmp #255        ; Wrapped from 0?
    bne check_bottom
    lda #0
    sta player_y

check_bottom:
    lda player_y
    cmp #25         ; Past bottom?
    bcc boundaries_done
    lda #24         ; Clamp to bottom
    sta player_y

boundaries_done:
    rts
```

### Signed vs Unsigned

The 6502 treats bytes as unsigned (0-255). When we decrement from 0:

```assembly
    lda #0
    sec
    sbc #1      ; Result is 255, not -1!
```

This is why we check for 255 when moving left/up.

### Screen Corruption Example

Without boundary checking, this happens:

```assembly
; At position X=39, Y=12
inc player_x    ; Now X=40
; Calculate position: 12*40 + 40 = 520
; This draws at row 13, column 0!
```

## Interactive Elements

### Experiment 1: Wrapping vs Clamping

Try different boundary behaviors:

```assembly
; Wrapping (Pac-Man style)
cmp #40
bcc no_wrap
lda #0
sta player_x

; Clamping (wall style)
cmp #40
bcc no_clamp
lda #39
sta player_x
```

### Experiment 2: Screen Shake on Impact

Add visual feedback:

```assembly
hit_boundary:
    inc $d020       ; Flash border
    dec $d020       ; Quick flicker effect
```

### Experiment 3: Boundary Zones

Create "soft" boundaries:

```assembly
; Slow down near edges
lda player_x
cmp #35         ; Near right edge?
bcc normal_speed
lsr movement_speed  ; Half speed
```

## Deep Dive: Off-By-One Errors

The classic fence post problem:

- 40 columns numbered 0-39
- Position 40 is actually the 41st position
- Common mistake: `cmp #39` when you need `cmp #40`

Visual representation:

```
Columns: |0|1|2|...|38|39|
Valid X:  ✓ ✓ ✓ ... ✓  ✓
X = 40:                   ✗ (off screen!)
```

### Memory Safety

What happens if we write outside screen memory?

```
$07E7: Last screen byte
$07E8: Start of sprite pointers!
$07FF: Last sprite pointer
$0800: Start of BASIC program!
```

Writing past boundaries can:

- Corrupt sprite pointers
- Crash BASIC
- Create mysterious bugs

## Challenge Extensions

1. **Toroidal Wrapping**: Top wraps to bottom, left to right

   ```assembly
   ; Leaving top edge appears at bottom
   lda player_y
   cmp #255
   bne no_wrap_top
   lda #24
   sta player_y
   ```

2. **Bounce Physics**: Reverse direction on boundary hit

3. **Screen Regions**: Different boundaries for different areas

4. **Boundary Animation**: Character "squishes" against edges

## Common Pitfalls

- **Checking After Drawing**: Always check BEFORE updating screen
- **Wrong Comparison**: `cmp #40` vs `cmp #39`
- **Signed Confusion**: Forgetting 0-1 = 255
- **Asymmetric Checks**: Right works but left doesn't

## Optimization Techniques

Boundary checking can be expensive. Tricks:

```assembly
; Use bit tricks for power-of-2 boundaries
lda player_x
and #$1f        ; Automatic wrap at 32

; Table-based clamping
ldx player_x
lda clamp_table,x
sta player_x

clamp_table:
!byte 0,1,2...38,39,39,39...  ; Auto-clamps > 39
```

## Historical Examples

Boundary handling in classic games:

- **Asteroids**: Screen wrapping in all directions
- **Defender**: Horizontal wrapping only
- **Robotron**: Hard walls with visual feedback
- **Tempest**: Circular boundary with unique physics

Each choice created different gameplay!

## Debug Tip

Visual boundary debugging:

```assembly
; Draw boundary markers
lda #'|'
sta $0400       ; Top-left
sta $0427       ; Top-right
sta $07C0       ; Bottom-left
sta $07E7       ; Bottom-right
```

## Next Steps

Solid boundaries make a playable space, but an empty space is a lonely space. What if we could add a score? Show remaining lives? Display the current level?

Lesson 6 introduces UI elements - the vital information that turns a tech demo into a real game. Time to make those numbers count!
