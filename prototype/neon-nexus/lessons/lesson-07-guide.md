# Lesson 7: Game States

## Opening Hook

A game is more than its gameplay - it's a complete experience from the moment it loads. Remember the anticipation of watching a C64 game load, the title screen appearing, the high score table taunting you? Today we build that full journey, transforming our prototype into something that feels finished.

Game states are the director of your digital theater. They control when the curtain rises, when the action happens, and when to take a bow. Let's orchestrate your game's complete performance!

## Code Walkthrough

### Defining Game States

First, we enumerate our states:

```assembly
; Game state constants
STATE_MENU      = 0
STATE_PLAYING   = 1
STATE_GAMEOVER  = 2
STATE_HIGHSCORE = 3

; Current state
game_state:     !byte STATE_MENU
```

### The State Machine

Our main loop becomes a dispatcher:

```assembly
main_loop:
    lda game_state
    
    cmp #STATE_MENU
    bne check_playing
    jsr handle_menu
    jmp main_loop
    
check_playing:
    cmp #STATE_PLAYING
    bne check_gameover
    jsr handle_playing
    jmp main_loop
    
check_gameover:
    cmp #STATE_GAMEOVER
    bne check_highscore
    jsr handle_gameover
    jmp main_loop
    
check_highscore:
    jsr handle_highscore
    jmp main_loop
```

### Menu State

A simple but effective title screen:

```assembly
handle_menu:
    ; Clear screen once
    lda menu_drawn
    bne wait_for_key
    
    jsr clear_screen
    
    ; Draw title
    ldx #0
title_loop:
    lda title_text,x
    beq title_done
    sta $0400+280,x    ; Center of screen
    lda #$01           ; White
    sta $d800+280,x
    inx
    jmp title_loop
title_done:
    
    ; Draw "PRESS SPACE TO START"
    ldx #0
start_loop:
    lda start_text,x
    beq start_done
    sta $0400+480,x
    lda #$07           ; Yellow (flashing effect)
    sta $d800+480,x
    inx
    jmp start_loop
start_done:
    
    lda #1
    sta menu_drawn
    
wait_for_key:
    ; Check for space bar
    lda #%01111111     ; Row 7
    sta $dc00
    lda $dc01
    and #%00010000     ; Column 4
    bne flash_text
    
    ; Space pressed! Start game
    lda #STATE_PLAYING
    sta game_state
    lda #0
    sta menu_drawn     ; Reset flag
    
    ; Initialize game
    jsr init_game
    rts
    
flash_text:
    ; Make "PRESS START" flash
    lda flash_timer
    and #$20           ; Bit 5 = on/off every 32 frames
    beq hide_text
    lda #$07
    jmp show_text
hide_text:
    lda #$00           ; Black (invisible)
show_text:
    ldx #20
flash_loop:
    sta $d800+480,x
    dex
    bpl flash_loop
    
    inc flash_timer
    rts
```

### Playing State

This is our main game:

```assembly
handle_playing:
    ; All our game logic
    jsr read_keyboard
    jsr update_player
    jsr update_enemies
    jsr check_collisions
    jsr update_display
    
    ; Check game over condition
    lda lives
    bne still_playing
    
    ; No lives left!
    lda #STATE_GAMEOVER
    sta game_state
    
still_playing:
    rts
```

### Game Over State

The dramatic finale:

```assembly
handle_gameover:
    ; First time in game over?
    lda gameover_timer
    bne update_gameover
    
    ; Initialize game over sequence
    lda #120           ; 2 seconds
    sta gameover_timer
    
    ; Flash screen effect
    ldx #5
flash_screen:
    inc $d020          ; Cycle border
    jsr delay
    dex
    bne flash_screen
    
update_gameover:
    ; Draw "GAME OVER"
    ldx #0
gameover_loop:
    lda gameover_text,x
    beq gameover_done
    sta $0400+492,x    ; Center screen
    
    ; Pulsing color effect
    lda gameover_timer
    and #$0f
    sta $d800+492,x
    
    inx
    jmp gameover_loop
gameover_done:
    
    ; Count down timer
    dec gameover_timer
    bne still_gameover
    
    ; Timer expired - back to menu
    lda #STATE_MENU
    sta game_state
    lda #0
    sta gameover_timer
    
still_gameover:
    rts
```

### State Transitions

Clean transitions between states:

```assembly
init_game:
    ; Reset everything for new game
    lda #0
    sta score
    sta enemy_count
    lda #3
    sta lives
    lda #1
    sta level
    
    ; Clear screen
    jsr clear_screen
    
    ; Set up game display
    jsr init_display
    
    ; Place player
    lda #20
    sta player_x
    lda #12
    sta player_y
    
    rts
```

## Interactive Elements

### Experiment 1: Pause State
Add a pause feature:
```assembly
STATE_PAUSED = 4

; In playing state, check 'P'
lda #STATE_PAUSED
sta game_state
sta previous_state  ; Remember where we were
```

### Experiment 2: Attract Mode
Demo gameplay in menu:
```assembly
; After 10 seconds in menu
lda #STATE_DEMO
sta game_state
; Run AI-controlled game
```

### Experiment 3: Difficulty Selection
Menu with options:
```assembly
; Up/down to select
; Different starting speeds/lives
difficulty: !byte 1  ; 0=easy, 1=normal, 2=hard
```

## Deep Dive: State Machine Theory

State machines power everything from elevators to CPUs:

```
States: Distinct modes of operation
Transitions: Rules for changing states
Actions: What happens in each state

[MENU] --space--> [PLAYING] --lives=0--> [GAMEOVER]
  ^                                           |
  |----------------timeout--------------------|
```

### Memory Management

Different states need different memory:

```assembly
; Union approach - reuse memory
game_memory:
    ; In MENU: holds menu variables
    ; In PLAYING: holds game variables
    ; In GAMEOVER: holds animation data
    !fill 256, 0
```

## Challenge Extensions

1. **Level Complete State**: Celebration between levels
   ```assembly
   STATE_LEVELCOMPLETE = 5
   ; Bonus points countdown
   ; Fanfare animation
   ```

2. **Options Menu**: Configure controls/sound
   ```assembly
   ; Nested state machine for menus
   MENU_MAIN = 0
   MENU_OPTIONS = 1
   ```

3. **Continue System**: Insert coin to continue
   ```assembly
   continues: !byte 3
   ; In game over, offer continue
   ```

4. **Cutscenes**: Story between levels
   ```assembly
   STATE_CUTSCENE = 6
   ; Text crawl or animation
   ```

## Common Pitfalls

- **State Leak**: Variables from one state affecting another
- **Transition Bugs**: Getting stuck between states
- **Init Failures**: Not properly resetting when restarting
- **Input Bleed**: Keys from one state registering in next

## Performance Patterns

State machines are efficient:
```assembly
; Bad: Check everything every frame
jsr check_menu_input
jsr check_game_input
jsr check_gameover_input

; Good: Only check current state
lda game_state
; Jump table or compare chain
```

## Historical Examples

Classic C64 state systems:
- **Impossible Mission**: Elevator scenes between gameplay
- **Paradroid**: Transfer minigame state
- **Boulder Dash**: Title → Cave Select → Playing → Bonus
- **Elite**: Docked → Space → Hyperspace → Combat

Each used states to create variety with limited memory.

## Debug States

Hidden states for testing:

```assembly
STATE_DEBUG = 255

; Konami code to activate?
; Show collision boxes
; Invincibility
; Level skip
```

## Polish Details

State transitions need style:
- Fade effects between states
- Music changes
- Screen wipes
- Loading animations

## State Data Persistence

Some data survives state changes:

```assembly
; Persistent (survives state changes)
high_score: !byte 0
sound_on:   !byte 1

; Temporary (reset each game)
score:      !byte 0
lives:      !byte 3
```

## Next Steps

We have a complete game structure, but we're missing a crucial element for long-term play: progression. How do we make level 2 harder than level 1? How do we keep players coming back?

Next lesson adds the secret sauce of addictive gameplay: escalating challenge, enemy waves, and the careful balance that separates frustration from flow. Time to turn up the heat!