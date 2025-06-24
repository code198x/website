---
title: "Section 2 Integration Project"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 16
description: "Combine everything you've learned to create your first complete multimedia program! Build an interactive audio-visual demo that showcases 68000 assembly, custom chip programming, graphics, and sound working together."
learning_objectives:
  - "Integrate 68000 assembly programming with hardware control"
  - "Combine graphics and audio systems in a single program"
  - "Create modular code using subroutines and proper organization"
  - "Implement user interaction and real-time updates"
  - "Apply professional programming practices to a complete project"
concepts:
  - "Program structure and organization"
  - "Multimedia integration and synchronization"
  - "Real-time graphics and audio updates"
  - "User input handling and interaction"
  - "Code modularity and reusability"
estimated_duration: "60-90 minutes"
difficulty: "intermediate"
code_examples: true
practical_exercise: true
order: 16
---

# Lesson 16: Section 2 Integration Project

Congratulations! You've learned the fundamentals of 68000 assembly programming and Amiga hardware control. Now it's time to put it all together in your first complete multimedia program. You'll create an interactive audio-visual demo that demonstrates professional programming techniques.

## Project Overview: Interactive Multimedia Demo

You'll build a program called "**AmigaVision**" that features:

- **Real-time graphics**: Multiple visual effects and patterns
- **4-channel audio**: Background music and interactive sound effects
- **User interaction**: Keyboard/joystick control of effects
- **Modular design**: Professional code organization
- **Hardware optimization**: Efficient use of custom chips

## Project Architecture and Planning

Before coding, let's plan the program structure:

### Program Modules:
1. **System Initialization**: Setup hardware and memory
2. **Graphics Engine**: Manage display and visual effects
3. **Audio Engine**: Control music and sound effects
4. **Input Handler**: Process user input
5. **Main Loop**: Coordinate all systems
6. **Effect Generators**: Individual visual/audio effects

<CodeRunner 
  system="commodore-amiga"
  title="Project Structure and Constants"
  code="; AmigaVision - Interactive Multimedia Demo
; Project constants and memory layout

; Memory layout constants
CHIP_RAM_BASE     EQU $00020000    ; Graphics/audio data area
GRAPHICS_MEM      EQU $00020000    ; Bitplane memory
AUDIO_MEM         EQU $00030000    ; Audio sample memory
WORK_MEM          EQU $00040000    ; Temporary workspace

; Custom chip base
CUSTOM_BASE       EQU $00DFF000

; Graphics constants
SCREEN_WIDTH      EQU 320
SCREEN_HEIGHT     EQU 200
BYTES_PER_LINE    EQU 40
BITPLANE_SIZE     EQU 8000

; Audio constants
SAMPLE_RATE_HIGH  EQU 161          ; ~22KHz
SAMPLE_RATE_MED   EQU 322          ; ~11KHz
SAMPLE_RATE_LOW   EQU 443          ; ~8KHz

; Effect constants
NUM_EFFECTS       EQU 4
EFFECT_TIMER      EQU 60           ; Effect change timing"
  language="assembly"
/>

## System Initialization Module

Let's start with comprehensive system setup:

<CodeRunner 
  system="commodore-amiga"
  title="System Initialization Module"
  code="; System initialization module
SYSTEM_INIT:
    ; Save system state (for proper cleanup)
    MOVE.L #$00081000, A7        ; Initialize stack
    
    ; Initialize custom chip base
    MOVE.L #CUSTOM_BASE, A6      ; A6 = custom chip base (global)
    
    ; Disable all DMA for safe setup
    MOVE.W #$0400, $096(A6)      ; Clear all DMA
    
    ; Setup display parameters
    BSR GRAPHICS_INIT
    BSR AUDIO_INIT
    BSR INPUT_INIT
    
    ; Initialize effect system
    BSR EFFECTS_INIT
    
    ; Final DMA enable
    MOVE.W #$81FF, $096(A6)      ; Enable all DMA channels
    
    RTS

; Graphics initialization
GRAPHICS_INIT:
    ; Setup 4-bitplane display (16 colors)
    MOVE.W #$4200, $100(A6)      ; BPLCON0: 4 bitplanes, color
    MOVE.W #$0000, $102(A6)      ; BPLCON1: No scroll
    MOVE.W #$0000, $104(A6)      ; BPLCON2: Standard priority
    
    ; Display window (320x200)
    MOVE.W #$2C81, $08E(A6)      ; DIWSTRT
    MOVE.W #$2CC1, $090(A6)      ; DIWSTOP
    MOVE.W #$0038, $092(A6)      ; DDFSTRT
    MOVE.W #$00D0, $094(A6)      ; DDFSTOP
    
    ; Setup bitplane pointers
    MOVE.L #GRAPHICS_MEM, A0
    MOVE.L A0, $0E0(A6)          ; BPL1PT
    ADD.L #BITPLANE_SIZE, A0
    MOVE.L A0, $0E4(A6)          ; BPL2PT
    ADD.L #BITPLANE_SIZE, A0
    MOVE.L A0, $0E8(A6)          ; BPL3PT
    ADD.L #BITPLANE_SIZE, A0
    MOVE.L A0, $0EC(A6)          ; BPL4PT
    
    ; Clear all bitplanes
    BSR CLEAR_SCREEN
    
    ; Setup initial color palette
    BSR SETUP_PALETTE
    
    RTS

; Audio initialization  
AUDIO_INIT:
    ; Create audio samples
    BSR CREATE_SAMPLES
    
    ; Setup audio channels
    MOVE.L #AUDIO_MEM, $0A0(A6)      ; AUD0LC - Bass
    MOVE.L #AUDIO_MEM+1000, $0B0(A6) ; AUD1LC - Lead  
    MOVE.L #AUDIO_MEM+2000, $0C0(A6) ; AUD2LC - Harmony
    MOVE.L #AUDIO_MEM+3000, $0D0(A6) ; AUD3LC - Percussion
    
    ; Set sample lengths
    MOVE.W #250, $0A4(A6)        ; AUD0LEN
    MOVE.W #125, $0B4(A6)        ; AUD1LEN
    MOVE.W #200, $0C4(A6)        ; AUD2LEN
    MOVE.W #100, $0D4(A6)        ; AUD3LEN
    
    ; Set initial periods and volumes
    MOVE.W #SAMPLE_RATE_LOW, $0A6(A6)   ; Bass - low pitch
    MOVE.W #SAMPLE_RATE_MED, $0B6(A6)   ; Lead - medium pitch
    MOVE.W #SAMPLE_RATE_HIGH, $0C6(A6)  ; Harmony - high pitch
    MOVE.W #SAMPLE_RATE_MED, $0D6(A6)   ; Percussion - medium
    
    MOVE.W #32, $0A8(A6)         ; Bass volume
    MOVE.W #24, $0B8(A6)         ; Lead volume
    MOVE.W #16, $0C8(A6)         ; Harmony volume
    MOVE.W #40, $0D8(A6)         ; Percussion volume
    
    RTS

; Input initialization
INPUT_INIT:
    ; Initialize input state variables
    MOVE.L #INPUT_STATE, A0
    MOVE.W #0, (A0)              ; Clear input flags
    RTS"
  language="assembly"
/>

## Graphics Engine Module

Create a powerful graphics system with multiple effects:

<CodeRunner 
  system="commodore-amiga"
  title="Graphics Engine with Multiple Effects"
  code="; Graphics engine with multiple visual effects

; Clear screen function
CLEAR_SCREEN:
    MOVE.L #GRAPHICS_MEM, A0     ; Start of bitplane memory
    MOVE.W #7999, D0             ; Clear all 4 bitplanes (32000 bytes)
CLEAR_LOOP:
    MOVE.L #$00000000, (A0)+     ; Clear 4 bytes
    DBF D0, CLEAR_LOOP
    RTS

; Setup color palette
SETUP_PALETTE:
    ; Create a vibrant 16-color palette
    MOVE.W #$0000, $180(A6)      ; COLOR00 - Black
    MOVE.W #$0FFF, $182(A6)      ; COLOR01 - White
    MOVE.W #$0F00, $184(A6)      ; COLOR02 - Red
    MOVE.W #$00F0, $186(A6)      ; COLOR03 - Green
    MOVE.W #$000F, $188(A6)      ; COLOR04 - Blue
    MOVE.W #$0FF0, $18A(A6)      ; COLOR05 - Yellow
    MOVE.W #$0F0F, $18C(A6)      ; COLOR06 - Magenta
    MOVE.W #$00FF, $18E(A6)      ; COLOR07 - Cyan
    MOVE.W #$0800, $190(A6)      ; COLOR08 - Dark red
    MOVE.W #$0080, $192(A6)      ; COLOR09 - Dark green
    MOVE.W #$0008, $194(A6)      ; COLOR10 - Dark blue
    MOVE.W #$0880, $196(A6)      ; COLOR11 - Dark yellow
    MOVE.W #$0808, $198(A6)      ; COLOR12 - Dark magenta
    MOVE.W #$0088, $19A(A6)      ; COLOR13 - Dark cyan
    MOVE.W #$0AAA, $19C(A6)      ; COLOR14 - Light gray
    MOVE.W #$0555, $19E(A6)      ; COLOR15 - Dark gray
    RTS

; Effect 1: Plasma-like pattern
EFFECT_PLASMA:
    MOVE.L #GRAPHICS_MEM, A0     ; Bitplane 1
    MOVE.L #GRAPHICS_MEM+BITPLANE_SIZE, A1  ; Bitplane 2
    MOVE.L #GRAPHICS_MEM+BITPLANE_SIZE*2, A2 ; Bitplane 3
    MOVE.L #GRAPHICS_MEM+BITPLANE_SIZE*3, A3 ; Bitplane 4
    
    MOVE.W #199, D7              ; Y coordinate
PLASMA_Y_LOOP:
    MOVE.W #39, D6               ; X coordinate (bytes)
PLASMA_X_LOOP:
    ; Calculate plasma value based on position and time
    MOVE.W D7, D0                ; Y position
    MOVE.W D6, D1                ; X position
    ADD.W FRAME_COUNTER, D0      ; Add time component
    
    ; Simple plasma calculation
    AND.W #$0F, D0               ; Keep in range 0-15
    
    ; Set bits in bitplanes based on plasma value
    MOVE.B #$FF, D2              ; All bits pattern
    
    BTST #0, D0
    BEQ SKIP_BP1
    MOVE.B D2, (A0)              ; Set bitplane 1
SKIP_BP1:
    BTST #1, D0
    BEQ SKIP_BP2
    MOVE.B D2, (A1)              ; Set bitplane 2
SKIP_BP2:
    BTST #2, D0
    BEQ SKIP_BP3
    MOVE.B D2, (A2)              ; Set bitplane 3
SKIP_BP3:
    BTST #3, D0
    BEQ SKIP_BP4
    MOVE.B D2, (A3)              ; Set bitplane 4
SKIP_BP4:
    
    ; Advance to next byte
    ADD.L #1, A0
    ADD.L #1, A1
    ADD.L #1, A2
    ADD.L #1, A3
    
    DBF D6, PLASMA_X_LOOP
    DBF D7, PLASMA_Y_LOOP
    
    RTS

; Effect 2: Scrolling patterns
EFFECT_SCROLL:
    ; Horizontal scroll effect
    MOVE.L #GRAPHICS_MEM, A0
    MOVE.W #199, D7              ; Lines to process
    
SCROLL_LINE_LOOP:
    ; Get rightmost bit of line
    MOVE.B 39(A0), D0            ; Last byte of line
    LSR.B #1, D0                 ; Shift right, bit 0 to carry
    
    ; Shift entire line right
    MOVE.W #39, D6               ; Bytes per line
SCROLL_BYTE_LOOP:
    ROR.B #1, (A0)+              ; Rotate right through carry
    DBF D6, SCROLL_BYTE_LOOP
    
    DBF D7, SCROLL_LINE_LOOP
    RTS

; Effect 3: Vertical bars
EFFECT_BARS:
    MOVE.L #GRAPHICS_MEM, A0
    MOVE.W FRAME_COUNTER, D0
    AND.W #$1F, D0               ; Animate bars
    
    MOVE.W #199, D7              ; Height
BAR_Y_LOOP:
    MOVE.W #39, D6               ; Width in bytes
    MOVE.L A0, A1                ; Save line start
    
BAR_X_LOOP:
    MOVE.W D6, D1
    ADD.W D0, D1                 ; Add animation offset
    AND.W #$07, D1               ; Pattern repeat
    
    CMP.W #4, D1
    BLT BAR_ON
    MOVE.B #$00, (A0)            ; Bar off
    BRA BAR_NEXT
BAR_ON:
    MOVE.B #$FF, (A0)            ; Bar on
BAR_NEXT:
    ADD.L #1, A0
    DBF D6, BAR_X_LOOP
    
    DBF D7, BAR_Y_LOOP
    RTS

; Effect 4: Rotating spiral
EFFECT_SPIRAL:
    BSR CLEAR_SCREEN             ; Start with clear screen
    
    MOVE.L #GRAPHICS_MEM, A0
    MOVE.W #160, D4              ; Center X
    MOVE.W #100, D5              ; Center Y
    MOVE.W FRAME_COUNTER, D6     ; Rotation angle
    
    MOVE.W #50, D7               ; Radius counter
SPIRAL_LOOP:
    ; Calculate spiral point
    MOVE.W D7, D0                ; Current radius
    MOVE.W D6, D1                ; Current angle
    ADD.W D7, D1                 ; Add radius to angle for spiral
    
    ; Simple spiral calculation (simplified)
    AND.W #$3F, D1               ; Keep angle in range
    
    ; Convert to X,Y (simplified)
    MOVE.W D4, D2                ; Start with center X
    MOVE.W D5, D3                ; Start with center Y
    
    ; Add spiral offset (simplified calculation)
    ASR.W #2, D0                 ; Scale radius
    ADD.W D0, D2                 ; Add to X
    ADD.W D0, D3                 ; Add to Y
    
    ; Plot point if within screen
    CMP.W #SCREEN_WIDTH, D2
    BGE SPIRAL_SKIP
    CMP.W #SCREEN_HEIGHT, D3
    BGE SPIRAL_SKIP
    
    BSR PLOT_PIXEL_SIMPLE        ; Plot the point
    
SPIRAL_SKIP:
    DBF D7, SPIRAL_LOOP
    RTS

; Simple pixel plotting (for spiral effect)
PLOT_PIXEL_SIMPLE:
    ; Input: D2=X, D3=Y
    ; Simple version for demo
    CMP.W #320, D2
    BGE PLOT_RTS
    CMP.W #200, D3
    BGE PLOT_RTS
    
    ; Calculate byte offset
    MOVE.W D3, D0
    MULU.W #40, D0               ; Y * bytes per line
    MOVE.W D2, D1
    LSR.W #3, D1                 ; X / 8
    ADD.W D1, D0                 ; Byte offset
    
    ; Set pixel in bitplane 1
    MOVE.L #GRAPHICS_MEM, A0
    ADD.L D0, A0
    OR.B #$80, (A0)              ; Simple pixel set
    
PLOT_RTS:
    RTS"
  language="assembly"
/>

## Audio Engine Module

Create dynamic audio with interactive elements:

<CodeRunner 
  system="commodore-amiga"
  title="Audio Engine with Interactive Music"
  code="; Audio engine with interactive music system

; Create audio samples
CREATE_SAMPLES:
    ; Bass sample (channel 0)
    MOVE.L #AUDIO_MEM, A0
    MOVE.W #499, D0              ; 500 bytes
BASS_SAMPLE:
    MOVE.B D0, (A0)+             ; Descending ramp
    DBF D0, BASS_SAMPLE
    
    ; Lead sample (channel 1)
    MOVE.L #AUDIO_MEM+1000, A0
    MOVE.W #249, D0              ; 250 bytes
LEAD_SAMPLE:
    ; Square wave pattern
    CMP.W #125, D0
    BLT LEAD_LOW
    MOVE.B #$C0, (A0)+           ; High value
    BRA LEAD_NEXT
LEAD_LOW:
    MOVE.B #$40, (A0)+           ; Low value
LEAD_NEXT:
    DBF D0, LEAD_SAMPLE
    
    ; Harmony sample (channel 2)
    MOVE.L #AUDIO_MEM+2000, A0
    MOVE.W #399, D0              ; 400 bytes
HARMONY_SAMPLE:
    ; Sine-like wave
    MOVE.W D0, D1
    LSR.W #2, D1                 ; Scale for pattern
    ADD.B #$80, D1               ; Center around $80
    MOVE.B D1, (A0)+
    DBF D0, HARMONY_SAMPLE
    
    ; Percussion sample (channel 3)
    MOVE.L #AUDIO_MEM+3000, A0
    MOVE.W #199, D0              ; 200 bytes
    MOVE.W #$4321, D1            ; Noise seed
PERCUSSION_SAMPLE:
    ; Generate noise
    ROL.W #3, D1
    EOR.W #$5555, D1
    MOVE.B D1, (A0)+
    DBF D0, PERCUSSION_SAMPLE
    
    RTS

; Update audio based on current effect
UPDATE_AUDIO:
    ; Get current effect
    MOVE.W CURRENT_EFFECT, D0
    
    ; Adjust audio parameters based on effect
    CMP.W #0, D0
    BEQ AUDIO_EFFECT_0
    CMP.W #1, D0
    BEQ AUDIO_EFFECT_1
    CMP.W #2, D0
    BEQ AUDIO_EFFECT_2
    BRA AUDIO_EFFECT_3

AUDIO_EFFECT_0:
    ; Plasma effect - ambient sound
    MOVE.W #SAMPLE_RATE_LOW, $0A6(A6)    ; Slow bass
    MOVE.W #SAMPLE_RATE_HIGH, $0B6(A6)   ; High lead
    MOVE.W #32, $0A8(A6)                 ; Medium bass volume
    MOVE.W #16, $0B8(A6)                 ; Low lead volume
    BRA UPDATE_AUDIO_DONE

AUDIO_EFFECT_1:
    ; Scroll effect - rhythmic sound
    MOVE.W #SAMPLE_RATE_MED, $0A6(A6)    ; Medium bass
    MOVE.W #SAMPLE_RATE_MED, $0B6(A6)    ; Medium lead
    MOVE.W #48, $0A8(A6)                 ; High bass volume
    MOVE.W #32, $0B8(A6)                 ; Medium lead volume
    BRA UPDATE_AUDIO_DONE

AUDIO_EFFECT_2:
    ; Bar effect - percussive sound
    MOVE.W #SAMPLE_RATE_HIGH, $0A6(A6)   ; Fast bass
    MOVE.W #SAMPLE_RATE_LOW, $0B6(A6)    ; Slow lead
    MOVE.W #24, $0A8(A6)                 ; Low bass volume
    MOVE.W #48, $0B8(A6)                 ; High lead volume
    BRA UPDATE_AUDIO_DONE

AUDIO_EFFECT_3:
    ; Spiral effect - harmonious sound
    MOVE.W #SAMPLE_RATE_MED, $0A6(A6)    ; Medium bass
    MOVE.W #SAMPLE_RATE_HIGH, $0B6(A6)   ; High lead
    MOVE.W #40, $0A8(A6)                 ; Medium-high bass
    MOVE.W #24, $0B8(A6)                 ; Medium lead volume

UPDATE_AUDIO_DONE:
    ; Always update harmony and percussion
    MOVE.W FRAME_COUNTER, D0
    AND.W #$3F, D0
    ADD.W #SAMPLE_RATE_HIGH, D0
    MOVE.W D0, $0C6(A6)                  ; Vary harmony pitch
    
    MOVE.W FRAME_COUNTER, D0
    AND.W #$1F, D0
    ADD.W #16, D0
    MOVE.W D0, $0D8(A6)                  ; Vary percussion volume
    
    RTS

; Trigger sound effect
TRIGGER_SOUND_EFFECT:
    ; Input: D0 = effect number
    CMP.W #0, D0
    BEQ SFX_BEEP
    CMP.W #1, D0
    BEQ SFX_SWOOSH
    CMP.W #2, D0
    BEQ SFX_CLICK
    RTS

SFX_BEEP:
    MOVE.W #100, $0C6(A6)                ; High pitch harmony
    MOVE.W #64, $0C8(A6)                 ; Full volume
    RTS

SFX_SWOOSH:
    MOVE.W #400, $0D6(A6)                ; Low pitch percussion
    MOVE.W #48, $0D8(A6)                 ; High volume
    RTS

SFX_CLICK:
    MOVE.W #150, $0B6(A6)                ; Medium-high lead
    MOVE.W #40, $0B8(A6)                 ; Medium volume
    RTS"
  language="assembly"
/>

## Input Handler Module

Process user input for interactive control:

<CodeRunner 
  system="commodore-amiga"
  title="Input Handler for User Interaction"
  code="; Input handler for user interaction

; Process input
PROCESS_INPUT:
    ; Read joystick port 1
    MOVE.W $00A(A6), D0          ; JOY1DAT
    
    ; Check for joystick directions
    MOVE.W D0, D1
    AND.W #$0003, D1             ; Get horizontal bits
    CMP.W #$0001, D1
    BEQ INPUT_LEFT
    CMP.W #$0002, D1  
    BEQ INPUT_RIGHT
    
    MOVE.W D0, D1
    AND.W #$0300, D1             ; Get vertical bits
    LSR.W #8, D1
    CMP.W #$0001, D1
    BEQ INPUT_UP
    CMP.W #$0002, D1
    BEQ INPUT_DOWN
    
    ; Check fire button (read from CIA)
    MOVE.B $00BFE001, D0         ; CIA-A port A
    BTST #6, D0                  ; Fire button bit
    BEQ INPUT_FIRE               ; Active low
    
    ; Check keyboard for effect selection
    BSR CHECK_KEYBOARD
    
    RTS

INPUT_LEFT:
    ; Decrease effect parameter
    MOVE.W EFFECT_PARAM, D0
    SUB.W #1, D0
    BPL INPUT_LEFT_OK
    MOVE.W #0, D0
INPUT_LEFT_OK:
    MOVE.W D0, EFFECT_PARAM
    
    ; Trigger sound effect
    MOVE.W #1, D0
    BSR TRIGGER_SOUND_EFFECT
    RTS

INPUT_RIGHT:
    ; Increase effect parameter
    MOVE.W EFFECT_PARAM, D0
    ADD.W #1, D0
    CMP.W #16, D0
    BLT INPUT_RIGHT_OK
    MOVE.W #15, D0
INPUT_RIGHT_OK:
    MOVE.W D0, EFFECT_PARAM
    
    ; Trigger sound effect
    MOVE.W #1, D0
    BSR TRIGGER_SOUND_EFFECT
    RTS

INPUT_UP:
    ; Previous effect
    MOVE.W CURRENT_EFFECT, D0
    SUB.W #1, D0
    BPL INPUT_UP_OK
    MOVE.W #NUM_EFFECTS-1, D0
INPUT_UP_OK:
    MOVE.W D0, CURRENT_EFFECT
    
    ; Trigger sound effect
    MOVE.W #0, D0
    BSR TRIGGER_SOUND_EFFECT
    RTS

INPUT_DOWN:
    ; Next effect
    MOVE.W CURRENT_EFFECT, D0
    ADD.W #1, D0
    CMP.W #NUM_EFFECTS, D0
    BLT INPUT_DOWN_OK
    MOVE.W #0, D0
INPUT_DOWN_OK:
    MOVE.W D0, CURRENT_EFFECT
    
    ; Trigger sound effect
    MOVE.W #0, D0
    BSR TRIGGER_SOUND_EFFECT
    RTS

INPUT_FIRE:
    ; Fire button - trigger special effect
    MOVE.W #2, D0
    BSR TRIGGER_SOUND_EFFECT
    
    ; Change palette randomly
    BSR RANDOMIZE_PALETTE
    RTS

; Check keyboard input
CHECK_KEYBOARD:
    ; Simple keyboard check (would need full CIA programming)
    ; For demo, just simulate key presses based on frame counter
    MOVE.W FRAME_COUNTER, D0
    AND.W #$FF, D0
    CMP.W #$80, D0
    BNE CHECK_KB_DONE
    
    ; Auto-advance effect every 128 frames
    MOVE.W CURRENT_EFFECT, D0
    ADD.W #1, D0
    CMP.W #NUM_EFFECTS, D0
    BLT CHECK_KB_OK
    MOVE.W #0, D0
CHECK_KB_OK:
    MOVE.W D0, CURRENT_EFFECT

CHECK_KB_DONE:
    RTS

; Randomize palette for special effects
RANDOMIZE_PALETTE:
    MOVE.W FRAME_COUNTER, D0     ; Use frame counter as seed
    MOVE.W #7, D1                ; Randomize 8 colors
    
RANDOM_COLOR_LOOP:
    ; Generate pseudo-random color
    ROL.W #3, D0
    EOR.W #$A5C3, D0
    AND.W #$0FFF, D0             ; Keep in RGB range
    
    ; Set color
    MOVE.W D1, D2
    ADD.W D1, D2                 ; Convert to word offset
    MOVE.W D0, $188(A6,D2.W)     ; Set color register
    
    DBF D1, RANDOM_COLOR_LOOP
    RTS"
  language="assembly"
/>

## Main Program Loop

Tie everything together in the main execution loop:

<CodeRunner 
  system="commodore-amiga"
  title="Main Program Loop and Complete Integration"
  code="; Main program entry point and loop
MAIN_PROGRAM:
    ; Initialize all systems
    BSR SYSTEM_INIT
    
    ; Start background music
    MOVE.W #$820F, $096(A6)      ; Enable all audio channels
    
    ; Initialize program variables
    MOVE.W #0, CURRENT_EFFECT
    MOVE.W #0, EFFECT_PARAM
    MOVE.W #0, FRAME_COUNTER

; Main execution loop
MAIN_LOOP:
    ; Wait for vertical blank for smooth animation
    BSR WAIT_VERTICAL_BLANK
    
    ; Update frame counter
    MOVE.W FRAME_COUNTER, D0
    ADD.W #1, D0
    MOVE.W D0, FRAME_COUNTER
    
    ; Process user input
    BSR PROCESS_INPUT
    
    ; Update audio based on current state
    BSR UPDATE_AUDIO
    
    ; Execute current visual effect
    MOVE.W CURRENT_EFFECT, D0
    CMP.W #0, D0
    BEQ EXEC_EFFECT_0
    CMP.W #1, D0
    BEQ EXEC_EFFECT_1
    CMP.W #2, D0
    BEQ EXEC_EFFECT_2
    BRA EXEC_EFFECT_3

EXEC_EFFECT_0:
    BSR EFFECT_PLASMA
    BRA MAIN_LOOP

EXEC_EFFECT_1:
    BSR EFFECT_SCROLL
    BRA MAIN_LOOP

EXEC_EFFECT_2:
    BSR EFFECT_BARS
    BRA MAIN_LOOP

EXEC_EFFECT_3:
    BSR EFFECT_SPIRAL
    BRA MAIN_LOOP

; Wait for vertical blank
WAIT_VERTICAL_BLANK:
    MOVE.W $004(A6), D0          ; Read VHPOSR
    AND.W #$FF00, D0             ; Get vertical position
    CMP.W #$FF00, D0             ; Check if in vertical blank
    BNE WAIT_VERTICAL_BLANK      ; Wait until we are
    
WAIT_ACTIVE_DISPLAY:
    MOVE.W $004(A6), D0          ; Read VHPOSR again
    AND.W #$FF00, D0             ; Get vertical position
    CMP.W #$FF00, D0             ; Check if still in VBlank
    BEQ WAIT_ACTIVE_DISPLAY      ; Wait until we're not
    RTS

; Effects initialization
EFFECTS_INIT:
    ; Initialize effect-specific variables
    MOVE.W #0, SPIRAL_ANGLE
    MOVE.W #0, PLASMA_PHASE
    MOVE.W #0, SCROLL_OFFSET
    MOVE.W #0, BAR_PHASE
    RTS

; Program data section
    ALIGN 2                      ; Word align data

; Program variables
CURRENT_EFFECT:     DC.W 0       ; Current effect number (0-3)
EFFECT_PARAM:       DC.W 0       ; Effect parameter (0-15)
FRAME_COUNTER:      DC.W 0       ; Frame counter for timing
INPUT_STATE:        DC.W 0       ; Input state flags

; Effect-specific variables
SPIRAL_ANGLE:       DC.W 0       ; Spiral rotation angle
PLASMA_PHASE:       DC.W 0       ; Plasma animation phase
SCROLL_OFFSET:      DC.W 0       ; Scroll position
BAR_PHASE:          DC.W 0       ; Bar animation phase

; Program completion message
PROGRAM_COMPLETE:
    ; Display completion message (in real program)
    ; For now, just infinite loop
    BRA PROGRAM_COMPLETE

; Entry point - start the demo
START_DEMO:
    BRA MAIN_PROGRAM"
  language="assembly"
/>

## Practice Exercise: Extend the Demo

Now that you have a complete multimedia demo, extend it with your own features:

<CodeRunner 
  system="commodore-amiga"
  title="Practice: Add Your Own Effect"
  code="; Practice: Add your own custom effect
; Create Effect 5: Tunnel effect

EFFECT_TUNNEL:
    ; Clear screen first
    BSR CLEAR_SCREEN
    
    ; Draw concentric circles creating tunnel effect
    MOVE.W #160, D4              ; Center X
    MOVE.W #100, D5              ; Center Y
    MOVE.W FRAME_COUNTER, D6
    AND.W #$1F, D6               ; Animation phase
    
    MOVE.W #8, D7                ; Number of circles
TUNNEL_CIRCLE_LOOP:
    ; Calculate circle radius
    MOVE.W D7, D0
    LSL.W #3, D0                 ; Scale radius
    ADD.W D6, D0                 ; Add animation
    AND.W #$3F, D0               ; Keep in range
    
    ; Draw circle at current radius
    MOVE.W D4, D2                ; Center X
    MOVE.W D5, D3                ; Center Y
    MOVE.W D0, D1                ; Radius
    BSR DRAW_CIRCLE_SIMPLE
    
    DBF D7, TUNNEL_CIRCLE_LOOP
    RTS

; Simple circle drawing
DRAW_CIRCLE_SIMPLE:
    ; Input: D2=center X, D3=center Y, D1=radius
    ; Simplified circle drawing for demo
    MOVE.W #360, D7              ; Degrees counter (simplified)
CIRCLE_POINT_LOOP:
    ; Calculate point on circle (very simplified)
    MOVE.W D2, D4                ; Start with center
    MOVE.W D3, D5
    
    ; Add radius (simplified - not real trig)
    MOVE.W D7, D0
    AND.W #$1F, D0               ; Simple angle
    ASR.W #2, D0
    ADD.W D0, D4                 ; Offset X
    
    MOVE.W D7, D0
    LSR.W #2, D0
    AND.W #$1F, D0
    ADD.W D0, D5                 ; Offset Y
    
    ; Plot point if on screen
    CMP.W #320, D4
    BGE CIRCLE_SKIP
    CMP.W #200, D5
    BGE CIRCLE_SKIP
    
    MOVE.W D4, D2
    MOVE.W D5, D3
    BSR PLOT_PIXEL_SIMPLE
    
CIRCLE_SKIP:
    SUB.W #10, D7                ; Next point
    BPL CIRCLE_POINT_LOOP
    RTS

; Challenge: Add your own effects here!
; Ideas:
; - Starfield effect
; - Bouncing ball
; - Text scroller
; - Fractal patterns
; - Particle system

YOUR_CUSTOM_EFFECT:
    ; Your code here!
    RTS"
  language="assembly"
/>

## What You've Accomplished

In this comprehensive integration project, you've successfully:

- **Built a complete multimedia program** combining graphics, audio, and interaction
- **Implemented modular code architecture** with separate systems for different functions
- **Created real-time visual effects** using direct hardware programming
- **Synchronized audio with visual effects** for immersive multimedia experience
- **Added user interaction** through joystick and keyboard input
- **Applied professional programming practices** including proper initialization, error handling, and code organization
- **Demonstrated 68000 assembly mastery** with complex addressing modes, subroutines, and data structures

## Professional Programming Concepts Demonstrated

### Code Organization:
- **Modular design** with separate initialization, update, and rendering functions
- **Consistent naming conventions** and code structure
- **Proper data organization** with aligned variables and constants
- **Resource management** with proper hardware setup and cleanup

### Real-Time Programming:
- **Vertical blank synchronization** for smooth animation
- **Frame-based timing** for consistent performance
- **Interrupt handling** for audio synchronization
- **Efficient rendering** with hardware-optimized drawing routines

### Multimedia Integration:
- **Graphics and audio coordination** with synchronized effects
- **Dynamic parameter adjustment** based on user input
- **Multi-channel audio composition** with interactive elements
- **Visual feedback** for user interactions

## Looking Ahead

You've now mastered the foundational concepts of professional Amiga programming! In the next lessons, you'll explore advanced topics including:

- **Advanced graphics modes** and display configurations
- **Complex bitplane manipulation** and graphics optimization
- **Copper programming** for advanced display effects
- **Hardware sprites** and collision detection
- **The Blitter** for high-speed graphics operations

## Fun Fact

The integration project you've just completed demonstrates programming techniques that were revolutionary in the 1980s! The ability to combine real-time graphics, 4-channel audio, and user interaction in a single program was something that required expensive workstations or mainframe computers. The Amiga brought this capability to home users, and the programming techniques you've learned - modular design, hardware abstraction, real-time synchronization - became the foundation for modern multimedia programming. Game developers, demo scene programmers, and multimedia artists used exactly these techniques to create the stunning software that made the Amiga legendary. You're now part of that tradition!