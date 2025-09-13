# Lesson 3: Keyboard Control

## Opening Hook

The joystick may be the C64's iconic controller, but the keyboard was where the magic began. Before we had gamepads, before we had mice, we had keys. And on the C64, reading the keyboard is like playing a piano - you need to know which keys to press and when to listen.

Today, you become the puppeteer. Your fingers on the keys will guide our star through digital space. Welcome to interactive computing, where the machine finally listens to you!

## Code Walkthrough

### The Keyboard Matrix

The C64 keyboard is an 8×8 matrix. We don't read keys directly - we scan rows and columns:

```assembly
; Keyboard registers
; $DC00 - Column select (write)
; $DC01 - Row read (read)

; To read a key:
; 1. Write column mask to $DC00
; 2. Read row result from $DC01
; 3. Check which bits are clear (pressed)
```

### Reading WASD Keys

Let's implement classic WASD controls:

```assembly
read_keyboard:
    ; Check 'A' key (Row 1, Column 2)
    lda #%11111101  ; Select column 2
    sta $dc00
    lda $dc01
    and #%00000010  ; Check row 1
    bne check_d     ; Not pressed? Check next

    ; 'A' pressed - move left
    dec player_x
    jmp check_boundaries

check_d:
    ; Check 'D' key (Row 2, Column 2)
    lda #%11111101  ; Same column
    sta $dc00
    lda $dc01
    and #%00000100  ; Check row 2
    bne check_w

    ; 'D' pressed - move right
    inc player_x
    jmp check_boundaries
```

### The Key Matrix Map

Here's a portion of the C64 key matrix:

```
        Col 0   Col 1   Col 2   Col 3   Col 4   Col 5   Col 6   Col 7
Row 0:  DELETE  RETURN  RIGHT   F7      F1      F3      F5      DOWN
Row 1:  3       W       A       4       Z       S       E       SHIFT
Row 2:  5       R       D       6       C       F       T       X
Row 3:  7       Y       G       8       B       H       U       V
```

### Complete WASD Implementation

```assembly
read_keyboard:
    ; Select column 2 (for A/D) and column 1 (for W/S)

    ; Check W (Row 1, Column 1)
    lda #%11111110  ; Column 1
    sta $dc00
    lda $dc01
    and #%00000010  ; Row 1
    bne check_s
    dec player_y    ; Move up

check_s:
    ; Check S (Row 5, Column 1)
    lda #%11111110  ; Column 1
    sta $dc00
    lda $dc01
    and #%00100000  ; Row 5
    bne check_a
    inc player_y    ; Move down

check_a:
    ; Check A (Row 1, Column 2)
    lda #%11111101  ; Column 2
    sta $dc00
    lda $dc01
    and #%00000010  ; Row 1
    bne check_d
    dec player_x    ; Move left

check_d:
    ; Check D (Row 2, Column 2)
    lda #%11111101  ; Column 2
    sta $dc00
    lda $dc01
    and #%00000100  ; Row 2
    bne done_keys
    inc player_x    ; Move right

done_keys:
    rts
```

### Debouncing

Keys can "bounce" - register multiple presses from one tap:

```assembly
; Simple debounce using delay
key_pressed:
    jsr read_keyboard

    ; Small delay
    ldx #10
debounce:
    dex
    bne debounce

    ; Continue main loop
```

## Interactive Elements

### Experiment 1: Different Key Layouts

Try arrow keys instead:

```assembly
; Arrow keys are special - different scanning
; RIGHT: Row 0, Column 2
; DOWN:  Row 0, Column 7
; Requires different approach!
```

### Experiment 2: Diagonal Movement

Allow multiple keys:

```assembly
; Don't use 'jmp' after each key
; Check all keys every frame
; Player can press W+D for diagonal!
```

### Experiment 3: Speed Control

Hold SHIFT for turbo:

```assembly
; Check SHIFT (Row 1, Column 7)
lda #%01111111
sta $dc00
lda $dc01
and #%00000010
bne normal_speed
inc player_x    ; Extra movement!
```

## Deep Dive: Why Matrix Scanning?

Why not one wire per key? Math:

- 64 keys × 2 wires = 128 connections (impossible!)
- 8×8 matrix = 16 connections (doable!)

The scanning happens so fast (thousands of times per second) that it appears instantaneous.

### Multiple Key Presses

The matrix can detect multiple keys, but with limitations:

```assembly
; Ghosting example:
; If A+S+D pressed, the matrix might also see W!
; This is why games use specific key combinations
```

Pro tip: Choose keys that don't share rows/columns for simultaneous press.

## Challenge Extensions

1. **Key Repeat**: Hold key for continuous movement

   ```assembly
   key_repeat_timer: !byte 0

   ; If key held, decrease timer
   ; When timer = 0, allow movement
   ```

2. **Custom Controls**: Let player choose keys

3. **Turbo Fire**: Rapid fire with space bar

4. **Key Recording**: Record and replay movements

## Common Pitfalls

- **Column Confusion**: Writing wrong value to $DC00
- **Active Low**: Keys pressed = 0, not 1!
- **No Debouncing**: Hyper-sensitive controls
- **Matrix Conflicts**: Some key combinations don't work

## Performance Considerations

Keyboard scanning timing:

- Full matrix scan: ~64 cycles
- Single key check: ~10 cycles
- Our WASD check: ~40 cycles

Still faster than one frame of delay!

## Historical Context

Famous C64 keyboard games:

- **Way of the Exploding Fist**: Complex key combinations for moves
- **Boulder Dash**: Precise keyboard control
- **Elite**: Full keyboard flight controls
- **The Sentinel**: Keyboard-only 3D navigation

Many players preferred keyboard over joystick for precision!

## Hardware Details

The CIA (Complex Interface Adapter) chip handles keyboard:

- 6526 CIA #1 at $DC00-$DCFF
- Also handles joysticks
- Generates interrupts
- Contains timers

We're directly talking to this chip!

## Debugging Tip

Visualize key presses:

```assembly
; Show which keys are pressed
lda $dc01
sta $0400       ; Display raw keyboard data
; Watch the screen characters change as you type!
```

## Next Steps

We can control our star, but it's lonely in the void. What if we added an obstacle? An enemy? Something to dodge?

Next lesson introduces a second moving object. The game begins when you're not alone in the digital space. Prepare for your first adversary!
