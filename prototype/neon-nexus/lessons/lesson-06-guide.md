# Lesson 6: Score and UI

## Opening Hook

Numbers tell stories. In Pac-Man, 10 points meant a dot, 200 meant a ghost, and 1600 meant you just ate all four ghosts in a row. In Space Invaders, your score was your badge of honor, your proof of survival. Today, we add the universal language of games: the score.

But we're going beyond simple numbers. We're building a heads-up display (HUD) that transforms our tech demo into something that feels like a real game. Lives, level, score - the holy trinity of arcade gaming awaits!

## Code Walkthrough

### Score Variables

First, we need to track our game state:

```assembly
; Game state variables
score:      !byte 0     ; Current score (0-255)
level:      !byte 1     ; Current level
lives:      !byte 3     ; Remaining lives
```

### Displaying Text Labels

Let's put "SCORE:" at the top of the screen:

```assembly
display_ui:
    ; Display "SCORE:" at position 0
    ldx #0
score_loop:
    lda score_text,x
    beq score_done      ; End of string?
    sta $0400,x         ; Top line
    lda #$01            ; White color
    sta $d800,x
    inx
    jmp score_loop
score_done:
    rts

; Text data (PETSCII screen codes)
score_text:
    !byte $13,$03,$0f,$12,$05,$3a,$00  ; "SCORE:"
```

### The PETSCII Mystery

Here's where it gets tricky. PETSCII has different codes for:
- Keyboard input (what you type)
- Screen display (what you see)

```assembly
; ASCII 'A' = 65 ($41)
; PETSCII screen code 'A' = 1 ($01)
; PETSCII keyboard 'A' = 65 ($41)

; Quick conversion for letters:
; Screen code = ASCII - 64
```

### Displaying Numbers

Converting binary to decimal for display:

```assembly
display_score:
    ; Display score as two digits
    lda score
    
    ; Get tens digit
    ldx #0          ; Tens counter
divide_10:
    cmp #10
    bcc got_tens    ; Less than 10?
    sec
    sbc #10         ; Subtract 10
    inx             ; Count tens
    jmp divide_10
    
got_tens:
    ; X = tens, A = ones
    pha             ; Save ones
    txa             ; Get tens
    clc
    adc #$30        ; Convert to PETSCII digit
    sta $0400+7     ; After "SCORE:"
    
    pla             ; Get ones
    clc
    adc #$30        ; Convert to PETSCII
    sta $0400+8
    rts
```

### Complete UI Layout

Let's arrange our display:

```assembly
init_display:
    ; Row 0: Score and Level
    ; "SCORE:00     LEVEL:1"
    
    ; Row 24: Lives
    ; "LIVES:♥♥♥"
    
    ; Display labels
    jsr display_score_label
    jsr display_level_label
    jsr display_lives_label
    
    ; Update values
    jsr display_score
    jsr display_level
    jsr display_lives
    rts
```

### Incrementing Score

Make actions worth points:

```assembly
add_points:
    ; Add 10 points
    lda score
    clc
    adc #10
    sta score
    
    ; Check for overflow (new level?)
    bcc no_level_up
    inc level       ; Score wrapped, new level!
    
no_level_up:
    jsr display_score
    rts
```

### Visual Lives Display

Show hearts for lives:

```assembly
display_lives:
    ; Start position for lives
    ldx #0
    ldy lives
    
draw_hearts:
    cpy #0
    beq done_hearts
    
    lda #$53        ; Heart character
    sta $0400+960,x ; Bottom row
    lda #$02        ; Red color
    sta $d800+960,x
    
    inx
    dey
    jmp draw_hearts
    
done_hearts:
    ; Clear remaining positions
    cpx #3
    beq done_clear
    lda #$20        ; Space
    sta $0400+960,x
    inx
    jmp done_hearts
    
done_clear:
    rts
```

## Interactive Elements

### Experiment 1: Different Scoring Systems
Try various point values:
```assembly
; Survival points (every second alive)
; Enemy destroyed: 50 points
; Power-up collected: 100 points
; Level complete: 500 points
```

### Experiment 2: High Score Tracking
Remember the best score:
```assembly
high_score: !byte 0

check_high_score:
    lda score
    cmp high_score
    bcc not_high
    sta high_score
    ; Flash message!
```

### Experiment 3: UI Positioning
Try different layouts:
```assembly
; Centered score
; Side panels
; Bottom status bar
; Minimal corner display
```

## Deep Dive: Number Systems

Why do scores often max at 255 or 65535?

```assembly
; 8-bit score: 0-255
; Simple but limited

; 16-bit score: 0-65535
score_lo: !byte 0
score_hi: !byte 0

; BCD (Binary Coded Decimal): 0-99
; Each nibble is a digit
; $99 = 99 decimal, not 153!
```

### Screen Real Estate

The C64 screen is precious:
- 40×25 = 1000 characters total
- UI typically uses 80-120 characters
- That's 8-12% of your display!

Smart layouts maximize game area while showing vital info.

## Challenge Extensions

1. **Animated Score**: Numbers roll up when increasing
   ```assembly
   ; Increment displayed score gradually
   ; Creates slot machine effect
   ```

2. **Combo Multiplier**: Chain actions for more points
   ```assembly
   multiplier: !byte 1
   ; Reset on miss, increase on hit
   ```

3. **Level Progression**: Different level indicators
   ```assembly
   ; Level 1-9: Numbers
   ; Level 10+: Symbols
   ; Level 20+: Colors
   ```

4. **Status Effects**: Show temporary states
   ```assembly
   ; "POWER" when powered up
   ; "DANGER" when one life left
   ```

## Common Pitfalls

- **PETSCII Confusion**: Wrong character codes
- **Score Overflow**: Not handling > 255
- **UI Corruption**: Game objects overwriting UI
- **Update Lag**: Not refreshing display immediately

## Performance Optimization

UI updates can be expensive:
```assembly
; Bad: Update entire UI every frame
; Cost: ~500 cycles

; Good: Update only what changed
score_changed: !byte 0

; Set flag when score changes
inc score_changed

; Check flag in main loop
lda score_changed
beq skip_score_update
```

## Historical UI Examples

Classic C64 game UIs:
- **Boulder Dash**: Minimal but effective
- **Impossible Mission**: Speech bubble for time
- **Paradroid**: Innovative deck display
- **Elite**: Complex 3D radar in corner

Each found creative ways to show complex data simply.

## Color Psychology

UI colors matter:
- White: Neutral information
- Yellow: Important/changing
- Red: Danger/lives
- Green: Good/bonus
- Blue: Calm/status

## Debug Display

Use the UI area for debugging:

```assembly
; Show enemy count
lda enemy_count
clc
adc #$30
sta $0400+35    ; Corner display

; Show frame rate
; Show collision count
; Show any debug value!
```

## Next Steps

We have boundaries, we have scores, but our game still lacks structure. When does it end? When does it get harder? How do we create that addictive "just one more game" feeling?

Next lesson introduces game states - the invisible skeleton that holds everything together. Menu, playing, game over, high score entry... Let's build a complete game experience!