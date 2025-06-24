---
title: "Controller Input Basics"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 22
description: "Master NES controller input programming. Learn to read button states, handle controller timing, and create responsive game controls for interactive gameplay and music systems."
learning_objectives:
  - "Understand NES controller hardware and input system"
  - "Learn to read controller registers and button states"
  - "Master input timing and debouncing techniques"
  - "Create responsive control systems for games"
  - "Build interactive controls for Sprite Symphony"
concepts:
  - "NES controller hardware (shift register)"
  - "Controller registers ($4016/$4017)"
  - "Button state reading and polling"
  - "Input timing and debouncing"
  - "Interactive control programming"
estimated_duration: "50-65 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 22
---

# Lesson 22: Controller Input Basics

Welcome to interactive programming! Today you'll learn how to read NES controller input - the foundation of all player interaction. This is what makes your games truly playable and responsive.

## NES Controller Hardware

The NES controller is a simple but clever device:

### Physical Buttons
- **D-Pad**: Up, Down, Left, Right (directional movement)
- **Action Buttons**: A, B (jump, fire, confirm, cancel)
- **System Buttons**: Select, Start (menu, pause)

### Internal Structure
The controller uses a **shift register** to send button data:
- **8 buttons** = 8 bits of data
- **Serial transmission**: One bit at a time
- **Polling system**: CPU requests current button states
- **Active low**: Pressed button = 0, released button = 1

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Basic Controller Reading"
  code="; Basic controller input reading
JSR test_controller_input

test_controller_input:
    ; Read controller 1
    JSR read_controller
    
    ; Store result for inspection
    STA $0400       ; Store button states
    
    RTS

read_controller:
    ; Pulse the controller latch
    LDA #$01
    STA $4016       ; Strobe controller (start reading)
    LDA #$00
    STA $4016       ; Stop strobe (begin serial data)
    
    ; Read 8 button states
    LDX #$08        ; 8 buttons to read
    LDA #$00        ; Clear accumulator
    
read_loop:
    LDA $4016       ; Read controller port 1
    LSR A           ; Shift right, button state into carry
    ROL $0401       ; Rotate carry into result byte
    DEX
    BNE read_loop   ; Continue for all 8 buttons
    
    LDA $0401       ; Load final button states
    RTS

; Controller reading system working!"
  language="assembly"
/>

## Controller Registers

The NES uses two memory-mapped registers for controller input:

### $4016 - Controller 1 & Strobe
- **Write**: Strobe bit (1=start reading, 0=read data)
- **Read**: Controller 1 button data (one bit per read)

### $4017 - Controller 2 & Frame Counter
- **Read**: Controller 2 button data
- **Write**: Frame counter control (audio system)

## Button Reading Process

Reading NES controllers requires a specific sequence:

1. **Strobe High**: Write $01 to $4016 (prepare controller)
2. **Strobe Low**: Write $00 to $4016 (start serial transmission)
3. **Read Buttons**: Read $4016 eight times (one bit per button)
4. **Process Data**: Interpret button states for gameplay

### Button Order
The buttons are read in this specific order:
```text
Read 1: A button
Read 2: B button  
Read 3: Select button
Read 4: Start button
Read 5: Up button
Read 6: Down button
Read 7: Left button
Read 8: Right button
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Detailed Controller Reading"
  code="; Detailed controller reading with button identification
JSR detailed_controller_read

detailed_controller_read:
    ; Initialize controller reading
    LDA #$01
    STA $4016       ; Strobe on
    LDA #$00
    STA $4016       ; Strobe off
    
    ; Read A button
    LDA $4016
    AND #$01        ; Mask off other bits
    STA $0410       ; Store A button state (0=pressed, 1=released)
    
    ; Read B button
    LDA $4016
    AND #$01
    STA $0411       ; Store B button state
    
    ; Read Select button
    LDA $4016
    AND #$01
    STA $0412       ; Store Select button state
    
    ; Read Start button
    LDA $4016
    AND #$01
    STA $0413       ; Store Start button state
    
    ; Read Up button
    LDA $4016
    AND #$01
    STA $0414       ; Store Up button state
    
    ; Read Down button
    LDA $4016
    AND #$01
    STA $0415       ; Store Down button state
    
    ; Read Left button
    LDA $4016
    AND #$01
    STA $0416       ; Store Left button state
    
    ; Read Right button
    LDA $4016
    AND #$01
    STA $0417       ; Store Right button state
    
    RTS

; Individual button states now available in $0410-$0417!"
  language="assembly"
/>

## Efficient Button Reading

For games, we usually want all button states in a single byte:

```text
; Efficient single-byte controller reading
read_controller_fast:
    LDA #$01
    STA $4016       ; Strobe controller
    STA controller_buttons  ; Store $01 as initial value
    LSR A           ; A = $00
    STA $4016       ; End strobe
    
    ; Read all 8 buttons into single byte
read_buttons:
    LDA $4016       ; Read button state
    LSR A           ; Move button bit to carry
    ROL controller_buttons  ; Rotate into button byte
    BCC read_buttons        ; Continue until original $01 bit rotates back
    
    RTS

; Result: controller_buttons contains all button states
; Bit 0 = A, Bit 1 = B, Bit 2 = Select, Bit 3 = Start
; Bit 4 = Up, Bit 5 = Down, Bit 6 = Left, Bit 7 = Right
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Efficient Controller Reading"
  code="; Efficient controller reading into single byte
JSR efficient_controller_read

efficient_controller_read:
    ; Fast controller reading method
    LDA #$01
    STA $4016       ; Strobe controller
    STA $0420       ; Use $0420 as button accumulator
    LSR A           ; A = $00
    STA $4016       ; End strobe
    
read_all_buttons:
    LDA $4016       ; Read controller port
    LSR A           ; Button state into carry
    ROL $0420       ; Rotate carry into button byte
    BCC read_all_buttons ; Continue until original $01 bit returns
    
    ; Now $0420 contains all button states in one byte
    ; Bit 0 = A, Bit 1 = B, Bit 2 = Select, Bit 3 = Start
    ; Bit 4 = Up, Bit 5 = Down, Bit 6 = Left, Bit 7 = Right
    
    RTS

; All buttons read into single byte at $0420!"
  language="assembly"
/>

## Button State Testing

Once you have button data, you need to test individual buttons:

```text
; Button bit masks
BUTTON_A      = %00000001
BUTTON_B      = %00000010
BUTTON_SELECT = %00000100
BUTTON_START  = %00001000
BUTTON_UP     = %00010000
BUTTON_DOWN   = %00100000
BUTTON_LEFT   = %01000000
BUTTON_RIGHT  = %10000000

test_specific_buttons:
    ; Test if A button is pressed
    LDA controller_buttons
    AND #BUTTON_A
    BEQ a_pressed       ; 0 = pressed
    
    ; Test if Start button is pressed
    LDA controller_buttons
    AND #BUTTON_START
    BEQ start_pressed   ; 0 = pressed
    
    RTS

a_pressed:
    ; Handle A button press
    LDA #$01
    STA player_jumping
    RTS
    
start_pressed:
    ; Handle Start button press
    LDA #$01
    STA game_paused
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Button State Testing"
  code="; Test individual button states
JSR test_button_states

test_button_states:
    ; Read controller first
    JSR read_controller_simple
    
    ; Test individual buttons
    JSR test_a_button
    JSR test_direction_buttons
    JSR test_start_button
    
    RTS

read_controller_simple:
    ; Simple controller read
    LDA #$01
    STA $4016
    LDA #$00
    STA $4016
    
    ; Read 8 buttons
    LDX #$08
    LDA #$00
read_simple_loop:
    PHA             ; Save accumulator
    LDA $4016       ; Read button
    LSR A           ; Button to carry
    PLA             ; Restore accumulator
    ROL A           ; Carry to accumulator
    DEX
    BNE read_simple_loop
    
    STA $0430       ; Store button states
    RTS

test_a_button:
    ; Test A button (bit 7 after reading)
    LDA $0430
    AND #%10000000  ; A button mask
    BNE a_not_pressed
    
    ; A button is pressed
    LDA #$FF
    STA $0440       ; Set A pressed flag
    RTS
    
a_not_pressed:
    LDA #$00
    STA $0440       ; Clear A pressed flag
    RTS

test_direction_buttons:
    ; Test directional buttons
    LDA $0430
    
    ; Test Up (bit 3)
    AND #%00001000
    BNE not_up
    LDA #$FF
    STA $0441       ; Up pressed
    JMP test_down
not_up:
    LDA #$00
    STA $0441
    
test_down:
    LDA $0430
    ; Test Down (bit 2)
    AND #%00000100
    BNE not_down
    LDA #$FF
    STA $0442       ; Down pressed
    JMP test_left
not_down:
    LDA #$00
    STA $0442
    
test_left:
    LDA $0430
    ; Test Left (bit 1)
    AND #%00000010
    BNE not_left
    LDA #$FF
    STA $0443       ; Left pressed
    JMP test_right
not_left:
    LDA #$00
    STA $0443
    
test_right:
    LDA $0430
    ; Test Right (bit 0)
    AND #%00000001
    BNE not_right
    LDA #$FF
    STA $0444       ; Right pressed
    RTS
not_right:
    LDA #$00
    STA $0444
    RTS

test_start_button:
    ; Test Start button (bit 4)
    LDA $0430
    AND #%00010000
    BNE start_not_pressed
    LDA #$FF
    STA $0445       ; Start pressed
    RTS
start_not_pressed:
    LDA #$00
    STA $0445
    RTS

; Button state testing complete!"
  language="assembly"
/>

## Input Timing and Debouncing

Raw controller input can be noisy and need proper timing:

### Button Debouncing
Prevent multiple triggers from single button press:

```text
; Button debouncing system
prev_buttons = $0450
curr_buttons = $0451
new_buttons  = $0452    ; Just pressed this frame
held_buttons = $0453    ; Held down

update_input:
    ; Save previous frame's buttons
    LDA curr_buttons
    STA prev_buttons
    
    ; Read current buttons
    JSR read_controller_fast
    STA curr_buttons
    
    ; Calculate newly pressed buttons
    ; new_buttons = curr_buttons AND NOT prev_buttons
    LDA prev_buttons
    EOR #$FF            ; Invert previous
    AND curr_buttons    ; AND with current
    STA new_buttons     ; Store newly pressed
    
    ; Calculate held buttons
    ; held_buttons = curr_buttons AND prev_buttons
    LDA prev_buttons
    AND curr_buttons
    STA held_buttons
    
    RTS
```

### Repeat Rate Control
For menu navigation, implement repeat timing:

```text
; Button repeat system
button_repeat_timer = $0460
button_repeat_rate  = $0461

handle_repeat_input:
    ; Check if direction held
    LDA held_buttons
    AND #(BUTTON_UP | BUTTON_DOWN | BUTTON_LEFT | BUTTON_RIGHT)
    BEQ no_repeat
    
    ; Direction held, check timer
    DEC button_repeat_timer
    BNE no_repeat
    
    ; Reset timer and treat as new press
    LDA button_repeat_rate
    STA button_repeat_timer
    
    ; Add held directions to new_buttons
    LDA held_buttons
    AND #(BUTTON_UP | BUTTON_DOWN | BUTTON_LEFT | BUTTON_RIGHT)
    ORA new_buttons
    STA new_buttons
    
no_repeat:
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Input Timing and Debouncing"
  code="; Input timing and debouncing system
JSR init_input_system

init_input_system:
    ; Initialize input variables
    LDA #$00
    STA $0450       ; prev_buttons
    STA $0451       ; curr_buttons
    STA $0452       ; new_buttons
    STA $0453       ; held_buttons
    
    ; Initialize repeat system
    LDA #$0F        ; 15 frame repeat rate
    STA $0461       ; button_repeat_rate
    STA $0460       ; button_repeat_timer
    
    RTS

update_input_system:
    ; Save previous buttons
    LDA $0451       ; curr_buttons
    STA $0450       ; prev_buttons
    
    ; Read current controller state
    JSR read_controller_debounced
    STA $0451       ; curr_buttons
    
    ; Calculate new presses (just pressed this frame)
    LDA $0450       ; prev_buttons
    EOR #$FF        ; Invert (NOT prev_buttons)
    AND $0451       ; AND with current
    STA $0452       ; new_buttons = curr AND NOT prev
    
    ; Calculate held buttons
    LDA $0450       ; prev_buttons
    AND $0451       ; AND with current
    STA $0453       ; held_buttons = curr AND prev
    
    ; Handle repeat for held directions
    JSR handle_direction_repeat
    
    RTS

read_controller_debounced:
    ; Standard controller read
    LDA #$01
    STA $4016
    LDA #$00
    STA $4016
    
    LDX #$08
    LDA #$00
debounce_loop:
    PHA
    LDA $4016
    LSR A
    PLA
    ROL A
    DEX
    BNE debounce_loop
    
    RTS

handle_direction_repeat:
    ; Check if any direction is held
    LDA $0453       ; held_buttons
    AND #%00001111  ; Direction bits (Up,Down,Left,Right)
    BEQ no_direction_repeat
    
    ; Direction held, decrease timer
    DEC $0460       ; button_repeat_timer
    BNE no_direction_repeat
    
    ; Timer expired, reset and add to new_buttons
    LDA $0461       ; button_repeat_rate
    STA $0460       ; Reset timer
    
    ; Add held directions to new presses
    LDA $0453       ; held_buttons
    AND #%00001111  ; Direction mask
    ORA $0452       ; OR with new_buttons
    STA $0452       ; Store combined new buttons
    
no_direction_repeat:
    RTS

; Test the debouncing system
; Simulate button press and hold
LDA #%10000000  ; Simulate A button press
STA $0451       ; Set as current
JSR update_input_system

; Check results
; $0452 should show new A press
; $0453 should be 0 (not held yet)

; Input timing and debouncing system working!"
  language="assembly"
/>

## Game Control Patterns

Different game types need different input handling:

### Platform Game Controls
```text
handle_platform_input:
    ; Left/Right movement
    LDA new_buttons
    AND #BUTTON_LEFT
    BEQ check_right
    JSR move_player_left
    
check_right:
    LDA new_buttons
    AND #BUTTON_RIGHT
    BEQ check_jump
    JSR move_player_right
    
check_jump:
    LDA new_buttons
    AND #BUTTON_A
    BEQ done_platform
    JSR player_jump
    
done_platform:
    RTS
```

### Menu Navigation
```text
handle_menu_input:
    ; Up/Down for menu selection
    LDA new_buttons
    AND #BUTTON_UP
    BEQ check_menu_down
    JSR menu_up
    
check_menu_down:
    LDA new_buttons
    AND #BUTTON_DOWN
    BEQ check_menu_select
    JSR menu_down
    
check_menu_select:
    LDA new_buttons
    AND #BUTTON_A
    BEQ done_menu
    JSR menu_select
    
done_menu:
    RTS
```

## Sprite Symphony Interactive Controls

Let's create interactive controls for our music project:

```text
init_sprite_symphony_input:
    ; Initialize input system for musical interaction
    JSR init_input_system
    
    ; Initialize musical control state
    LDA #$00
    STA current_note_selection  ; Which note is selected
    STA music_mode             ; 0=play, 1=edit
    
    ; Setup note selection limits
    LDA #$07                   ; 8 notes available (0-7)
    STA max_note_selection
    
    RTS

handle_sprite_symphony_input:
    ; Update input system
    JSR update_input_system
    
    ; Handle different modes
    LDA music_mode
    BEQ handle_play_mode
    JMP handle_edit_mode
    
handle_play_mode:
    ; Play mode: Simple controls
    ; A button = play current note
    LDA new_buttons
    AND #BUTTON_A
    BEQ check_note_selection
    JSR play_selected_note
    
check_note_selection:
    ; Left/Right = change note selection
    LDA new_buttons
    AND #BUTTON_LEFT
    BEQ check_right_note
    JSR select_previous_note
    
check_right_note:
    LDA new_buttons
    AND #BUTTON_RIGHT
    BEQ check_mode_switch
    JSR select_next_note
    
check_mode_switch:
    ; Start = switch modes
    LDA new_buttons
    AND #BUTTON_START
    BEQ done_play_input
    JSR switch_music_mode
    
done_play_input:
    RTS
    
handle_edit_mode:
    ; Edit mode: Advanced controls
    ; (More complex editing features)
    RTS

play_selected_note:
    ; Play the currently selected note
    LDA current_note_selection
    JSR play_symphony_note
    
    ; Update visual feedback
    JSR update_note_sprite
    RTS

select_previous_note:
    ; Move to previous note (with wrapping)
    DEC current_note_selection
    LDA current_note_selection
    BPL note_selection_ok
    LDA max_note_selection
    STA current_note_selection
note_selection_ok:
    JSR update_selection_display
    RTS

select_next_note:
    ; Move to next note (with wrapping)
    INC current_note_selection
    LDA current_note_selection
    CMP max_note_selection
    BCC next_note_ok
    LDA #$00
    STA current_note_selection
next_note_ok:
    JSR update_selection_display
    RTS

switch_music_mode:
    ; Toggle between play and edit modes
    LDA music_mode
    EOR #$01            ; Toggle bit 0
    STA music_mode
    JSR update_mode_display
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Sprite Symphony Interactive Controls"
  code="; Interactive controls for Sprite Symphony
JSR init_symphony_controls

init_symphony_controls:
    ; Setup input system
    LDA #$00
    STA $0480       ; prev_buttons
    STA $0481       ; curr_buttons
    STA $0482       ; new_buttons
    
    ; Setup musical control state
    LDA #$00
    STA $0490       ; current_note (0-7)
    STA $0491       ; music_playing (0=stopped, 1=playing)
    
    ; Setup audio
    LDA #%00000001  ; Enable pulse 1
    STA $4015
    LDA #%10111111  ; Configure pulse 1
    STA $4000
    
    ; Create note frequency table
    ; C, D, E, F, G, A, B, C
    LDA #$F1        ; C
    STA $04A0
    LDA #$D2        ; D
    STA $04A1
    LDA #$B0        ; E
    STA $04A2
    LDA #$A0        ; F
    STA $04A3
    LDA #$82        ; G
    STA $04A4
    LDA #$68        ; A
    STA $04A5
    LDA #$50        ; B
    STA $04A6
    LDA #$78        ; High C
    STA $04A7
    
    RTS

; Handle Symphony input (call every frame)
handle_symphony_input:
    ; Update input
    JSR update_symphony_input
    
    ; Handle controls
    JSR check_note_selection
    JSR check_play_controls
    
    RTS

update_symphony_input:
    ; Save previous
    LDA $0481
    STA $0480
    
    ; Read current
    LDA #$01
    STA $4016
    LDA #$00
    STA $4016
    
    LDX #$08
    LDA #$00
input_loop:
    PHA
    LDA $4016
    LSR A
    PLA
    ROL A
    DEX
    BNE input_loop
    
    STA $0481       ; Store current buttons
    
    ; Calculate new presses
    LDA $0480       ; Previous
    EOR #$FF        ; NOT previous
    AND $0481       ; AND current
    STA $0482       ; Store new presses
    
    RTS

check_note_selection:
    ; Left arrow = previous note
    LDA $0482       ; new_buttons
    AND #%00000010  ; Left button (bit 1)
    BEQ check_right_arrow
    
    ; Move to previous note
    DEC $0490       ; current_note--
    LDA $0490
    BPL note_ok     ; If positive, ok
    LDA #$07        ; Wrap to note 7
    STA $0490
note_ok:
    JSR update_note_display
    
check_right_arrow:
    ; Right arrow = next note
    LDA $0482
    AND #%00000001  ; Right button (bit 0)
    BEQ done_note_selection
    
    ; Move to next note
    INC $0490       ; current_note++
    LDA $0490
    CMP #$08        ; 8 notes total
    BCC next_note_ok
    LDA #$00        ; Wrap to note 0
    STA $0490
next_note_ok:
    JSR update_note_display
    
done_note_selection:
    RTS

check_play_controls:
    ; A button = play selected note
    LDA $0482       ; new_buttons
    AND #%10000000  ; A button (bit 7)
    BEQ check_stop
    
    ; Play current note
    LDX $0490       ; current_note
    LDA $04A0,X     ; Get frequency
    STA $4002       ; Set frequency low
    LDA #$05        ; High byte (simplified)
    STA $4003       ; Set frequency high
    
    LDA #$01
    STA $0491       ; Set playing flag
    
check_stop:
    ; B button = stop sound
    LDA $0482
    AND #%01000000  ; B button (bit 6)
    BEQ done_play_controls
    
    ; Stop sound
    LDA #%00000000
    STA $4015       ; Disable APU
    LDA #%00000001
    STA $4015       ; Re-enable APU (stops current note)
    
    LDA #$00
    STA $0491       ; Clear playing flag
    
done_play_controls:
    RTS

update_note_display:
    ; Update visual feedback for selected note
    ; This would update sprites to show current selection
    RTS

; Test the interactive system
JSR handle_symphony_input

; Interactive Sprite Symphony controls working!"
  language="assembly"
/>

## Practical Exercise: Complete Input System

Create a comprehensive input system with:

1. Multi-controller support (player 1 and 2)
2. Button debouncing and repeat timing
3. Input state history (3 frames of history)
4. Special move detection (fighting game style)
5. Configurable button mapping

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Complete Input System"
  code="; Complete Input System with Advanced Features
JSR init_complete_input_system

init_complete_input_system:
    ; 1. Initialize multi-controller support
    LDA #$00
    STA $0500       ; p1_prev_buttons
    STA $0501       ; p1_curr_buttons
    STA $0502       ; p1_new_buttons
    STA $0503       ; p2_prev_buttons
    STA $0504       ; p2_curr_buttons
    STA $0505       ; p2_new_buttons
    
    ; 2. Initialize repeat timing
    LDA #$0C        ; 12 frame initial delay
    STA $0510       ; p1_repeat_delay
    STA $0511       ; p2_repeat_delay
    LDA #$04        ; 4 frame repeat rate
    STA $0512       ; p1_repeat_rate
    STA $0513       ; p2_repeat_rate
    LDA #$00
    STA $0514       ; p1_repeat_timer
    STA $0515       ; p2_repeat_timer
    
    ; 3. Initialize input history (3 frames)
    LDA #$00
    STA $0520       ; p1_history[0] (current)
    STA $0521       ; p1_history[1] (1 frame ago)
    STA $0522       ; p1_history[2] (2 frames ago)
    
    ; 4. Initialize button mapping
    LDA #%10000000  ; A button default
    STA $0530       ; jump_button
    LDA #%01000000  ; B button default
    STA $0531       ; fire_button
    LDA #%00001000  ; Start button default
    STA $0532       ; pause_button
    
    RTS

; Update complete input system (call every frame)
update_complete_input:
    ; 1. Read both controllers
    JSR read_both_controllers
    
    ; 2. Update button history
    JSR update_input_history
    
    ; 3. Handle debouncing
    JSR update_debouncing
    
    ; 4. Handle repeat timing
    JSR update_repeat_timing
    
    ; 5. Detect special moves
    JSR detect_special_moves
    
    RTS

read_both_controllers:
    ; Read controller 1
    LDA #$01
    STA $4016       ; Strobe both controllers
    LDA #$00
    STA $4016       ; End strobe
    
    ; Read controller 1 (port $4016)
    LDX #$08
    LDA #$00
read_p1_loop:
    PHA
    LDA $4016
    LSR A
    PLA
    ROL A
    DEX
    BNE read_p1_loop
    
    STA $0501       ; Store P1 current buttons
    
    ; Read controller 2 (port $4017)
    LDX #$08
    LDA #$00
read_p2_loop:
    PHA
    LDA $4017
    LSR A
    PLA
    ROL A
    DEX
    BNE read_p2_loop
    
    STA $0504       ; Store P2 current buttons
    RTS

update_input_history:
    ; Shift P1 history
    LDA $0521       ; history[1]
    STA $0522       ; history[2] = history[1]
    LDA $0520       ; history[0]
    STA $0521       ; history[1] = history[0]
    LDA $0501       ; current buttons
    STA $0520       ; history[0] = current
    
    RTS

update_debouncing:
    ; Calculate new presses for P1
    LDA $0500       ; prev_buttons
    EOR #$FF        ; NOT prev
    AND $0501       ; AND current
    STA $0502       ; new_buttons
    
    ; Update previous for next frame
    LDA $0501       ; current
    STA $0500       ; becomes previous
    
    ; Same for P2
    LDA $0503       ; p2_prev
    EOR #$FF
    AND $0504       ; p2_current
    STA $0505       ; p2_new
    
    LDA $0504       ; p2_current
    STA $0503       ; becomes p2_previous
    
    RTS

update_repeat_timing:
    ; P1 repeat timing
    LDA $0501       ; current buttons
    AND #%00001111  ; Direction mask
    BEQ p1_no_repeat
    
    ; Direction held
    LDA $0514       ; repeat_timer
    BEQ p1_trigger_repeat
    DEC $0514       ; Decrease timer
    JMP p1_no_repeat
    
p1_trigger_repeat:
    ; Timer expired, add to new buttons
    LDA $0501       ; current
    AND #%00001111  ; directions only
    ORA $0502       ; OR with new buttons
    STA $0502       ; store combined
    
    ; Reset timer
    LDA $0512       ; repeat_rate
    STA $0514       ; reset timer
    JMP check_p2_repeat
    
p1_no_repeat:
    ; No direction held, reset timer
    LDA $0510       ; repeat_delay
    STA $0514       ; reset to initial delay
    
check_p2_repeat:
    ; Same logic for P2
    LDA $0504       ; p2_current
    AND #%00001111  ; Direction mask
    BEQ p2_no_repeat
    
    LDA $0515       ; p2_repeat_timer
    BEQ p2_trigger_repeat
    DEC $0515
    JMP done_repeat
    
p2_trigger_repeat:
    LDA $0504
    AND #%00001111
    ORA $0505
    STA $0505
    LDA $0513       ; p2_repeat_rate
    STA $0515
    JMP done_repeat
    
p2_no_repeat:
    LDA $0511       ; p2_repeat_delay
    STA $0515
    
done_repeat:
    RTS

detect_special_moves:
    ; 4. Detect special move patterns
    ; Example: Down, Forward, Punch (quarter circle forward)
    ; Check if pattern exists in history
    
    ; Look for Down -> Right -> A button sequence
    LDA $0522       ; 2 frames ago
    AND #%00000100  ; Down button
    BEQ no_special_move
    
    LDA $0521       ; 1 frame ago
    AND #%00000001  ; Right button
    BEQ no_special_move
    
    LDA $0502       ; New buttons this frame
    AND $0530       ; Jump button (A)
    BEQ no_special_move
    
    ; Special move detected!
    LDA #$01
    STA $0540       ; special_move_triggered
    RTS
    
no_special_move:
    LDA #$00
    STA $0540
    RTS

; 5. Test configurable button mapping
set_button_mapping:
    ; A = new jump button mask
    STA $0530       ; jump_button
    RTS

; Test the complete system
; Simulate input sequence
LDA #%00000100  ; Down
STA $0501
JSR update_complete_input

LDA #%00000001  ; Right
STA $0501
JSR update_complete_input

LDA #%10000000  ; A button
STA $0501
JSR update_complete_input

; Check if special move was detected
LDA $0540       ; Should be $01 if special move detected

; Complete advanced input system working!"
  language="assembly"
/>

## What You've Learned

In this comprehensive lesson, you've mastered:

- NES controller hardware and shift register operation
- Controller register usage ($4016/$4017) and timing
- Efficient button reading and state management
- Input debouncing and repeat timing techniques
- Multi-controller support and advanced input features
- Interactive control systems for game development
- Foundation for Sprite Symphony player interaction

## Looking Ahead

Next lesson, you'll learn about reading button states in detail - advanced techniques for responsive controls, input buffering, and creating professional-quality game feel through precise input handling!

## Fun Fact

The NES controller's shift register design was brilliant for its time! By using serial data transmission, Nintendo could send 8 buttons worth of data over just one wire, keeping the controller cable simple and cheap. This same basic design principle is still used in modern game controllers - even wireless controllers often convert their button states into serial data streams. The timing-sensitive nature of NES controller reading also taught early game programmers the importance of precise input timing, skills that remain crucial in modern game development where frame-perfect input can make the difference between responsive and sluggish controls!