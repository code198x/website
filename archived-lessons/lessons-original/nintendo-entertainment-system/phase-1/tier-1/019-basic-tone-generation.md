---
title: "Basic Tone Generation"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 19
description: "Learn fundamental tone generation techniques on the NES. Master frequency calculation, note relationships, and create your first musical tones for game audio and the Sprite Symphony project."
learning_objectives:
  - "Understand frequency and pitch relationships"
  - "Calculate NES frequency values for musical notes"
  - "Generate pure tones using all APU channels"
  - "Create tone sequences and basic melodies"
  - "Build the foundation for musical programming"
concepts:
  - "Frequency and pitch relationships"
  - "NES frequency calculation formulas"
  - "Tone generation on multiple channels"
  - "Basic musical intervals"
  - "Sound timing and duration"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 19
---

# Lesson 19: Basic Tone Generation

Welcome to musical programming! Today you'll learn how to generate pure tones on the NES - the building blocks of all music and sound effects. Understanding tone generation is essential for creating the audio that brings games to life.

## What Is a Tone?

A tone is a sound with a specific frequency that we perceive as a musical pitch:

- **Frequency**: How many times per second the sound wave cycles (measured in Hz)
- **Pitch**: How high or low the tone sounds to our ears
- **Relationship**: Higher frequency = higher pitch, lower frequency = lower pitch
- **Musical Context**: Specific frequencies correspond to musical notes (A, B, C, etc.)

The NES APU generates tones by creating precise waveforms at specific frequencies.

## NES Frequency Calculation

The NES uses a unique frequency system:

**Formula**: `APU_Frequency = CPU_CLOCK / (16 * (period + 1))`

Where:

- **CPU_CLOCK**: 1,789,773 Hz (NTSC NES)
- **period**: The 11-bit value you write to frequency registers
- **Actual frequency**: What you hear as a musical note

**Important**: Lower period values = higher pitch!

### Common Frequency Values

```text
; Approximate period values for musical notes
; (These create recognizable musical pitches)

C_NOTE   = $07F1    ; C note (~261 Hz)
D_NOTE   = $0780    ; D note (~294 Hz)
E_NOTE   = $06F1    ; E note (~330 Hz)
F_NOTE   = $0682    ; F note (~349 Hz)
G_NOTE   = $05C7    ; G note (~392 Hz)
A_NOTE   = $0506    ; A note (~440 Hz)
B_NOTE   = $0453    ; B note (~494 Hz)
C_HIGH   = $03F8    ; C note one octave higher
```

**Basic Tone Generation:**

```assembly
; Generate a simple tone on pulse 1
JSR generate_basic_tone

generate_basic_tone:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015       ; APU enable

    ; Configure pulse 1 for clear tone
    LDA #%10111111  ; 50% duty, constant volume 15
    STA $4000       ; Pulse 1 control

    ; Generate A note (440 Hz approximately)
    LDA #$06        ; Frequency low byte
    STA $4002       ; Pulse 1 frequency low
    LDA #$05        ; Frequency high byte (period = $0506)
    STA $4003       ; Pulse 1 frequency high

    RTS

; A clear A note (440 Hz) is now playing!
```

## Generating Tones on Different Channels

Each APU channel can generate tones with different characteristics:

### Pulse Wave Tones

```text
; Generate tone on pulse 1
play_pulse1_tone:
    LDA #%00000001  ; Enable pulse 1
    STA $4015
    LDA #%10111111  ; 50% duty, max volume
    STA $4000
    ; Set frequency registers $4002/$4003
    RTS

; Generate tone on pulse 2
play_pulse2_tone:
    LDA #%00000010  ; Enable pulse 2
    STA $4015
    LDA #%01111000  ; 25% duty, medium volume
    STA $4004
    ; Set frequency registers $4006/$4007
    RTS
```

### Triangle Wave Tones

```text
; Generate smooth tone on triangle
play_triangle_tone:
    LDA #%00000100  ; Enable triangle
    STA $4015
    LDA #%11000000  ; Linear counter control
    STA $4008
    ; Set frequency registers $400A/$400B
    RTS
```

**Multi-Channel Tone Generation:**

```assembly
; Generate tones on different channels
JSR demo_multichannel_tones

demo_multichannel_tones:
    ; Enable multiple channels
    LDA #%00000111  ; Pulse 1, pulse 2, triangle
    STA $4015

    ; Setup pulse 1 - high tone
    LDA #%10111111  ; 50% duty, max volume
    STA $4000
    LDA #$FE        ; High frequency
    STA $4002
    LDA #$01
    STA $4003

    ; Setup pulse 2 - medium tone
    LDA #%01111000  ; 25% duty, medium volume
    STA $4004
    LDA #$CA        ; Medium frequency
    STA $4006
    LDA #$01
    STA $4007

    ; Setup triangle - low tone
    LDA #%11000000  ; Triangle control
    STA $4008
    LDA #$A2        ; Low frequency
    STA $400A
    LDA #$01
    STA $400B

    RTS

; Three-part harmony playing!
```

## Creating Note Tables

Organizing frequencies in tables makes musical programming easier:

```text
; Note frequency table (low bytes)
note_freq_lo:
    .byte $F1, $80, $F1, $82, $C7, $06, $53, $F8  ; C,D,E,F,G,A,B,C

; Note frequency table (high bytes)
note_freq_hi:
    .byte $07, $07, $06, $06, $05, $05, $04, $03  ; C,D,E,F,G,A,B,C

play_note_from_table:
    ; A = note number (0-7)
    TAX                 ; Use as index
    LDA note_freq_lo,X  ; Get low byte
    STA $4002          ; Set frequency low
    LDA note_freq_hi,X  ; Get high byte
    STA $4003          ; Set frequency high
    RTS
```

**Note Table System:**

```assembly
; Create and use a note frequency table
JSR setup_note_table

setup_note_table:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015
    LDA #%10111111  ; Configure pulse 1
    STA $4000

    ; Create note table in memory
    ; C note
    LDA #$F1        ; C low byte
    STA $0380
    LDA #$07        ; C high byte
    STA $0388

    ; D note
    LDA #$80        ; D low byte
    STA $0381
    LDA #$07        ; D high byte
    STA $0389

    ; E note
    LDA #$F1        ; E low byte
    STA $0382
    LDA #$06        ; E high byte
    STA $038A

    ; G note
    LDA #$C7        ; G low byte
    STA $0383
    LDA #$05        ; G high byte
    STA $038B

    RTS

; Play note from table (A = note index)
play_table_note:
    TAX             ; Use note as index
    LDA $0380,X     ; Get frequency low byte
    STA $4002       ; Set pulse 1 frequency low
    LDA $0388,X     ; Get frequency high byte
    STA $4003       ; Set pulse 1 frequency high
    RTS

; Test the system
LDA #$00        ; Play C note
JSR play_table_note

LDA #$02        ; Play E note
JSR play_table_note

; Note table system working!
```

## Understanding Musical Intervals

Musical intervals are the relationships between different pitches:

### Basic Intervals

- **Unison**: Same note (frequency ratio 1:1)
- **Octave**: Double frequency (ratio 2:1)
- **Fifth**: 3:2 frequency ratio (very harmonious)
- **Fourth**: 4:3 frequency ratio
- **Major Third**: 5:4 frequency ratio

### NES Octaves

```text
; Same note in different octaves
C_LOW    = $0FE2    ; Low C
C_MIDDLE = $07F1    ; Middle C
C_HIGH   = $03F8    ; High C (half the period = double frequency)
```

**Musical Intervals Demo:**

```assembly
; Demonstrate musical intervals
JSR demo_intervals

demo_intervals:
    ; Enable pulse 1 and 2
    LDA #%00000011
    STA $4015

    ; Configure both channels
    LDA #%10111111  ; Pulse 1 setup
    STA $4000
    LDA #%01111000  ; Pulse 2 setup
    STA $4004

    ; Perfect octave (C and high C)
    ; Low C on pulse 2
    LDA #$F1        ; C low frequency
    STA $4006       ; Pulse 2 freq low
    LDA #$07        ; C high frequency
    STA $4007       ; Pulse 2 freq high

    ; High C on pulse 1 (double frequency)
    LDA #$F8        ; High C low (half the period)
    STA $4002       ; Pulse 1 freq low
    LDA #$03        ; High C high
    STA $4003       ; Pulse 1 freq high

    RTS

; Perfect octave harmony playing!
```

## Tone Duration and Timing

Controlling how long tones play is crucial for music:

### Simple Duration Control

```text
play_timed_tone:
    ; Start the tone
    JSR start_tone

    ; Wait for duration
    LDX #$60        ; Duration counter
wait_loop:
    DEX
    BNE wait_loop

    ; Stop the tone
    JSR stop_tone
    RTS

stop_tone:
    LDA #%00000000  ; Disable all channels
    STA $4015
    RTS
```

### Frame-Based Timing

```text
; Using frame counter for precise timing
tone_timer = $0390

play_timed_note:
    ; Set duration (60 frames = 1 second)
    LDA #$3C        ; 60 frames
    STA tone_timer

    ; Start tone
    JSR start_tone
    RTS

update_tone_timer:
    ; Call this every frame
    LDA tone_timer
    BEQ timer_done  ; Already finished
    DEC tone_timer  ; Decrease timer
    BNE timer_done  ; Still playing

    ; Timer reached 0, stop tone
    JSR stop_tone
timer_done:
    RTS
```

## Creating Simple Melodies

Combine tones in sequence to create melodies:

```text
; Simple melody: C-E-G-C
simple_melody:
    ; Note 1: C
    LDA #$00        ; Note index 0 (C)
    JSR play_table_note
    JSR short_delay

    ; Note 2: E
    LDA #$02        ; Note index 2 (E)
    JSR play_table_note
    JSR short_delay

    ; Note 3: G
    LDA #$04        ; Note index 4 (G)
    JSR play_table_note
    JSR short_delay

    ; Note 4: C (higher)
    LDA #$07        ; Note index 7 (high C)
    JSR play_table_note
    JSR short_delay

    RTS

short_delay:
    LDX #$40        ; Short delay
delay_loop:
    DEX
    BNE delay_loop
    RTS
```

**Simple Melody Generation:**

```assembly
; Create and play a simple melody
JSR play_simple_melody

play_simple_melody:
    ; Setup audio
    LDA #%00000001  ; Enable pulse 1
    STA $4015
    LDA #%10111111  ; Configure pulse 1
    STA $4000

    ; Play C-E-G-C melody
    JSR play_c
    JSR note_delay
    JSR play_e
    JSR note_delay
    JSR play_g
    JSR note_delay
    JSR play_c_high
    JSR note_delay

    RTS

play_c:
    LDA #$F1        ; C frequency low
    STA $4002
    LDA #$07        ; C frequency high
    STA $4003
    RTS

play_e:
    LDA #$F1        ; E frequency low
    STA $4002
    LDA #$06        ; E frequency high
    STA $4003
    RTS

play_g:
    LDA #$C7        ; G frequency low
    STA $4002
    LDA #$05        ; G frequency high
    STA $4003
    RTS

play_c_high:
    LDA #$F8        ; High C frequency low
    STA $4002
    LDA #$03        ; High C frequency high
    STA $4003
    RTS

note_delay:
    LDX #$00        ; Delay counter
    LDY #$20        ; Outer delay
delay_outer:
    DEX
    BNE delay_outer
    DEY
    BNE delay_outer
    RTS

; Simple C major arpeggio melody playing!
```

## Sprite Symphony Tone System

Let's create the tone generation system for our music project:

```text
init_symphony_tones:
    ; Initialize tone generation system
    LDA #%00000011  ; Enable pulse 1 and 2
    STA $4015

    ; Configure pulse 1 for melody
    LDA #%10111111  ; 50% duty, max volume
    STA $4000

    ; Configure pulse 2 for harmony
    LDA #%01111000  ; 25% duty, medium volume
    STA $4004

    ; Setup symphony note table
    JSR setup_symphony_notes
    RTS

setup_symphony_notes:
    ; Musical scale for Sprite Symphony
    ; C note (index 0)
    LDA #$F1
    STA symphony_notes_lo+0
    LDA #$07
    STA symphony_notes_hi+0

    ; D note (index 1)
    LDA #$80
    STA symphony_notes_lo+1
    LDA #$07
    STA symphony_notes_hi+1

    ; E note (index 2)
    LDA #$F1
    STA symphony_notes_lo+2
    LDA #$06
    STA symphony_notes_hi+2

    ; F note (index 3)
    LDA #$82
    STA symphony_notes_lo+3
    LDA #$06
    STA symphony_notes_hi+3

    ; G note (index 4)
    LDA #$C7
    STA symphony_notes_lo+4
    LDA #$05
    STA symphony_notes_hi+4

    RTS

play_symphony_note:
    ; A = note index, X = channel (0=pulse1, 1=pulse2)
    TAY                     ; Save note index
    CPX #$00
    BEQ use_pulse1

    ; Use pulse 2
    LDA symphony_notes_lo,Y
    STA $4006              ; Pulse 2 freq low
    LDA symphony_notes_hi,Y
    STA $4007              ; Pulse 2 freq high
    RTS

use_pulse1:
    LDA symphony_notes_lo,Y
    STA $4002              ; Pulse 1 freq low
    LDA symphony_notes_hi,Y
    STA $4003              ; Pulse 1 freq high
    RTS
```

## Practical Exercise: Tone Generator

Create a complete tone generation system with:

1. Note frequency table for one octave (C-B)
2. Function to play any note on any channel
3. Function to play two notes simultaneously (harmony)
4. Simple melody playback system
5. Tone duration control

**Practice: Complete Tone Generator:**

```assembly
; Complete Tone Generation System
JSR init_tone_generator

init_tone_generator:
    ; 1. Create note frequency table
    ; C note (index 0)
    LDA #$F1        ; C low
    STA $03A0
    LDA #$07        ; C high
    STA $03B0

    ; D note (index 1)
    LDA #$80        ; D low
    STA $03A1
    LDA #$07        ; D high
    STA $03B1

    ; E note (index 2)
    LDA #$F1        ; E low
    STA $03A2
    LDA #$06        ; E high
    STA $03B2

    ; F note (index 3)
    LDA #$82        ; F low
    STA $03A3
    LDA #$06        ; F high
    STA $03B3

    ; G note (index 4)
    LDA #$C7        ; G low
    STA $03A4
    LDA #$05        ; G high
    STA $03B4

    ; A note (index 5)
    LDA #$06        ; A low
    STA $03A5
    LDA #$05        ; A high
    STA $03B5

    ; B note (index 6)
    LDA #$53        ; B low
    STA $03A6
    LDA #$04        ; B high
    STA $03B6

    ; Enable channels
    LDA #%00000011  ; Pulse 1 and 2
    STA $4015
    LDA #%10111111  ; Configure pulse 1
    STA $4000
    LDA #%01111000  ; Configure pulse 2
    STA $4004

    RTS

; 2. Play note on specific channel
; A = note index (0-6), X = channel (0=pulse1, 1=pulse2)
play_note_on_channel:
    TAY             ; Save note index
    CPX #$00        ; Check channel
    BEQ channel_1

    ; Channel 2 (pulse 2)
    LDA $03A0,Y     ; Get frequency low
    STA $4006       ; Pulse 2 freq low
    LDA $03B0,Y     ; Get frequency high
    STA $4007       ; Pulse 2 freq high
    RTS

nchannel_1:
    ; Channel 1 (pulse 1)
    LDA $03A0,Y     ; Get frequency low
    STA $4002       ; Pulse 1 freq low
    LDA $03B0,Y     ; Get frequency high
    STA $4003       ; Pulse 1 freq high
    RTS

; 3. Play harmony (two notes at once)
play_harmony:
    ; A = note 1, Y = note 2
    STA $03C0       ; Store note 1
    STY $03C1       ; Store note 2

    ; Play note 1 on pulse 1
    LDA $03C0       ; Get note 1
    LDX #$00        ; Channel 0
    JSR play_note_on_channel

    ; Play note 2 on pulse 2
    LDA $03C1       ; Get note 2
    LDX #$01        ; Channel 1
    JSR play_note_on_channel

    RTS

; 4. Simple delay for melody timing
melody_delay:
    LDX #$00
    LDY #$40        ; Delay amount
delay_loop:
    DEX
    BNE delay_loop
    DEY
    BNE delay_loop
    RTS

; 5. Play test melody: C-D-E-F-G
play_test_melody:
    ; Note C
    LDA #$00        ; Note index 0
    LDX #$00        ; Channel 0
    JSR play_note_on_channel
    JSR melody_delay

    ; Note D
    LDA #$01        ; Note index 1
    LDX #$00        ; Channel 0
    JSR play_note_on_channel
    JSR melody_delay

    ; Note E
    LDA #$02        ; Note index 2
    LDX #$00        ; Channel 0
    JSR play_note_on_channel
    JSR melody_delay

    ; Note F
    LDA #$03        ; Note index 3
    LDX #$00        ; Channel 0
    JSR play_note_on_channel
    JSR melody_delay

    ; Note G
    LDA #$04        ; Note index 4
    LDX #$00        ; Channel 0
    JSR play_note_on_channel
    JSR melody_delay

    RTS

; Test harmony (C and E together)
LDA #$00        ; C note
LDY #$02        ; E note
JSR play_harmony

; Test melody
JSR play_test_melody

; Complete tone generation system working!
```

## What You've Learned

In this fundamental lesson, you've mastered:

- Frequency and pitch relationships in digital audio
- NES-specific frequency calculation and period values
- Tone generation on all APU channels
- Note frequency tables for musical programming
- Musical intervals and harmony concepts
- Timing and duration control for musical sequences
- Building blocks for melody and harmony creation

## Looking Ahead

Next lesson, you'll learn about musical notes and frequencies in detail - discovering how to create proper musical scales, understand note relationships, and build the foundation for complex musical compositions in your NES games!

## Fun Fact

The NES frequency system was designed to be simple for programmers while still allowing for accurate musical notes. The unusual "period" system (where lower values = higher pitch) was chosen because it maps directly to the hardware's countdown timer - the APU counts down from your period value to zero, then resets and flips the waveform. This design made the hardware simpler and cheaper to manufacture, while still giving composers the precision they needed to create the memorable soundtracks that defined the 8-bit era!
