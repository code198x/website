---
title: "Simple Melody Programming"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 21
description: "Learn to create and sequence melodies on the NES. Master timing systems, note sequences, musical phrases, and build the melody engine for your Sprite Symphony project."
learning_objectives:
  - "Understand melody structure and musical phrases"
  - "Create timing systems for musical sequences"
  - "Program note sequences and melodic patterns"
  - "Build reusable melody playback systems"
  - "Develop the Sprite Symphony melody engine"
concepts:
  - "Melody structure and musical phrases"
  - "Timing and rhythm in digital music"
  - "Note sequence programming"
  - "Melody data structures"
  - "Musical phrase management"
estimated_duration: "55-70 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 21
---

# Lesson 21: Simple Melody Programming

Welcome to melody creation! Today you'll learn how to sequence musical notes over time to create melodies - the heart of any musical composition. This is where your NES games truly come alive with memorable tunes.

## What Makes a Melody?

A melody is a sequence of musical notes arranged in time with specific characteristics:

- **Pitch**: Which notes to play (frequency/tone)
- **Duration**: How long each note lasts
- **Timing**: When each note starts and stops
- **Phrasing**: How notes group into musical ideas
- **Expression**: Volume, attack, and musical character

Great NES melodies like those in Super Mario Bros. combine simple note sequences with memorable rhythmic patterns.

## Musical Timing Systems

Before creating melodies, we need reliable timing:

### Frame-Based Timing
The NES updates at exactly 60 FPS, giving us precise timing:
- **1 frame** = 1/60 second (~16.67 ms)
- **60 frames** = 1 second
- **30 frames** = 0.5 seconds (eighth note at 120 BPM)
- **15 frames** = 0.25 seconds (sixteenth note at 120 BPM)

### Musical Note Durations
```text
; Common note durations in frames (at 120 BPM)
WHOLE_NOTE     = 240    ; 4 seconds
HALF_NOTE      = 120    ; 2 seconds  
QUARTER_NOTE   = 60     ; 1 second
EIGHTH_NOTE    = 30     ; 0.5 seconds
SIXTEENTH_NOTE = 15     ; 0.25 seconds
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Basic Melody Timing"
  code="; Simple melody with frame-based timing
JSR play_timed_melody

play_timed_melody:
    ; Setup audio
    LDA #%00000001  ; Enable pulse 1
    STA $4015
    LDA #%10111111  ; Configure pulse 1
    STA $4000
    
    ; Initialize timing
    LDA #$00
    STA $0500       ; frame_counter
    LDA #$00
    STA $0501       ; current_note
    
    ; Play 4-note sequence with timing
    JSR update_melody_timer
    
    RTS

update_melody_timer:
    ; Simple timing system
    INC $0500       ; Increment frame counter
    LDA $0500
    CMP #$3C        ; 60 frames = 1 second per note
    BNE no_note_change
    
    ; Time for next note
    LDA #$00
    STA $0500       ; Reset frame counter
    INC $0501       ; Next note
    
    ; Play current note
    LDA $0501
    CMP #$00
    BEQ play_note_c
    CMP #$01
    BEQ play_note_e
    CMP #$02
    BEQ play_note_g
    CMP #$03
    BEQ play_note_c_high
    
    ; Reset sequence
    LDA #$00
    STA $0501
    
no_note_change:
    RTS

play_note_c:
    LDA #$F1        ; C frequency
    STA $4002
    LDA #$07
    STA $4003
    RTS

play_note_e:
    LDA #$B0        ; E frequency
    STA $4002
    LDA #$06
    STA $4003
    RTS

play_note_g:
    LDA #$82        ; G frequency
    STA $4002
    LDA #$05
    STA $4003
    RTS

play_note_c_high:
    LDA #$F8        ; High C frequency
    STA $4002
    LDA #$03
    STA $4003
    RTS

; Simple C-E-G-C melody with 1-second notes!"
  language="assembly"
/>

## Melody Data Structures

Organizing melody data efficiently is crucial for complex music:

### Simple Note/Duration Pairs
```text
; Melody data: note, duration, note, duration...
simple_melody:
    .byte NOTE_C, QUARTER_NOTE    ; C for quarter note
    .byte NOTE_E, QUARTER_NOTE    ; E for quarter note
    .byte NOTE_G, QUARTER_NOTE    ; G for quarter note
    .byte NOTE_C, HALF_NOTE       ; C for half note
    .byte $FF, $00                ; End marker

; Playback state
melody_position = $0510
melody_timer    = $0511
```

### Advanced Melody Structure
```text
; Melody data: note, duration, volume, effect
advanced_melody:
    .byte NOTE_C, QUARTER_NOTE, VOL_MED, EFF_NONE
    .byte NOTE_E, EIGHTH_NOTE,  VOL_HIGH, EFF_NONE
    .byte NOTE_G, EIGHTH_NOTE,  VOL_HIGH, EFF_NONE
    .byte NOTE_C, HALF_NOTE,    VOL_MAX, EFF_VIBRATO
    .byte $FF, $00, $00, $00    ; End marker
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Melody Data Structure"
  code="; Melody using data structure approach
JSR init_melody_system

init_melody_system:
    ; Setup audio
    LDA #%00000001
    STA $4015
    LDA #%10111111
    STA $4000
    
    ; Create melody data in memory
    ; Note, Duration pairs
    ; C quarter note
    LDA #$00        ; Note C (index)
    STA $0520       ; melody_data[0]
    LDA #$3C        ; Quarter note (60 frames)
    STA $0521       ; melody_data[1]
    
    ; E quarter note
    LDA #$02        ; Note E (index)
    STA $0522       ; melody_data[2]
    LDA #$3C        ; Quarter note
    STA $0523       ; melody_data[3]
    
    ; G quarter note
    LDA #$04        ; Note G (index)
    STA $0524       ; melody_data[4]
    LDA #$3C        ; Quarter note
    STA $0525       ; melody_data[5]
    
    ; C half note
    LDA #$00        ; Note C (index)
    STA $0526       ; melody_data[6]
    LDA #$78        ; Half note (120 frames)
    STA $0527       ; melody_data[7]
    
    ; End marker
    LDA #$FF        ; End of melody
    STA $0528       ; melody_data[8]
    
    ; Initialize playback
    LDA #$00
    STA $0530       ; melody_position
    STA $0531       ; melody_timer
    
    ; Note frequency table
    ; C note
    LDA #$F1
    STA $0540       ; note_freq_low[0]
    LDA #$07
    STA $0548       ; note_freq_high[0]
    
    ; E note
    LDA #$B0
    STA $0542       ; note_freq_low[2]
    LDA #$06
    STA $054A       ; note_freq_high[2]
    
    ; G note
    LDA #$82
    STA $0544       ; note_freq_low[4]
    LDA #$05
    STA $054C       ; note_freq_high[4]
    
    RTS

; Update melody playback (call every frame)
update_melody:
    ; Check if melody finished
    LDX $0530       ; melody_position
    LDA $0520,X     ; Get current note
    CMP #$FF        ; End marker?
    BEQ melody_finished
    
    ; Check timer
    LDA $0531       ; melody_timer
    BEQ start_new_note
    
    ; Continue current note
    DEC $0531       ; Decrease timer
    RTS
    
start_new_note:
    ; Get note index
    LDX $0530       ; melody_position
    LDA $0520,X     ; Get note
    TAY             ; Use as index for frequency table
    
    ; Set frequency
    LDA $0540,Y     ; Get frequency low
    STA $4002       ; Set pulse 1 frequency low
    LDA $0548,Y     ; Get frequency high
    STA $4003       ; Set pulse 1 frequency high
    
    ; Get duration
    INX             ; Next position (duration)
    LDA $0520,X     ; Get duration
    STA $0531       ; Set timer
    
    ; Advance to next note
    INX             ; Move to next note position
    STX $0530       ; Store position
    
    RTS

melody_finished:
    ; Melody complete, could loop or stop
    LDA #$00
    STA $0530       ; Reset to beginning
    RTS

; Test melody system
JSR update_melody

; Melody data structure system working!"
  language="assembly"
/>

## Creating Musical Phrases

Musical phrases are groups of notes that form complete musical ideas:

### Phrase Structure
- **Motif**: Short musical idea (2-4 notes)
- **Phrase**: Complete musical sentence (4-8 measures)
- **Period**: Two phrases that complement each other
- **Section**: Multiple periods forming song sections

### Example Phrases
```text
; Famous 4-note motif (like Beethoven's 5th)
motif_1:
    .byte NOTE_G, EIGHTH_NOTE
    .byte NOTE_G, EIGHTH_NOTE
    .byte NOTE_G, EIGHTH_NOTE
    .byte NOTE_Eb, HALF_NOTE

; Answer phrase
motif_2:
    .byte NOTE_F, EIGHTH_NOTE
    .byte NOTE_F, EIGHTH_NOTE
    .byte NOTE_F, EIGHTH_NOTE
    .byte NOTE_D, HALF_NOTE
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Musical Phrases"
  code="; Create and play musical phrases
JSR demo_musical_phrases

demo_musical_phrases:
    ; Setup audio
    LDA #%00000001
    STA $4015
    LDA #%10111111
    STA $4000
    
    ; Create phrase A (ascending)
    ; C-D-E-F
    LDA #$00        ; C
    STA $0560
    LDA #$1E        ; 30 frames (half second)
    STA $0561
    LDA #$01        ; D
    STA $0562
    LDA #$1E        ; 30 frames
    STA $0563
    LDA #$02        ; E
    STA $0564
    LDA #$1E        ; 30 frames
    STA $0565
    LDA #$03        ; F
    STA $0566
    LDA #$3C        ; 60 frames (longer ending)
    STA $0567
    
    ; Create phrase B (descending)
    ; F-E-D-C
    LDA #$03        ; F
    STA $0568
    LDA #$1E        ; 30 frames
    STA $0569
    LDA #$02        ; E
    STA $056A
    LDA #$1E        ; 30 frames
    STA $056B
    LDA #$01        ; D
    STA $056C
    LDA #$1E        ; 30 frames
    STA $056D
    LDA #$00        ; C
    STA $056E
    LDA #$3C        ; 60 frames (longer ending)
    STA $056F
    
    ; Note frequencies
    ; C
    LDA #$F1
    STA $0580
    LDA #$07
    STA $0590
    ; D
    LDA #$D2
    STA $0581
    LDA #$07
    STA $0591
    ; E
    LDA #$B0
    STA $0582
    LDA #$06
    STA $0592
    ; F
    LDA #$A0
    STA $0583
    LDA #$06
    STA $0593
    
    RTS

; Play phrase A
play_phrase_a:
    LDX #$00        ; Start of phrase A
    LDY #$08        ; 8 bytes (4 note/duration pairs)
    JSR play_phrase_data
    RTS

; Play phrase B  
play_phrase_b:
    LDX #$08        ; Start of phrase B
    LDY #$08        ; 8 bytes
    JSR play_phrase_data
    RTS

play_phrase_data:
    ; X = start offset, Y = length
    STX $0570       ; phrase_offset
    STY $0571       ; phrase_length
    LDA #$00
    STA $0572       ; phrase_position
    STA $0573       ; phrase_timer
    RTS

; Musical phrase system ready for use!"
  language="assembly"
/>

## Sprite Symphony Melody Engine

Let's create a comprehensive melody system for our music project:

```text
init_sprite_symphony_melody:
    ; Initialize the Sprite Symphony melody engine
    LDA #%00000011  ; Enable pulse 1 and 2
    STA $4015
    
    ; Configure pulse 1 for lead melody
    LDA #%10111111  ; 50% duty, max volume
    STA $4000
    
    ; Configure pulse 2 for harmony
    LDA #%01111000  ; 25% duty, medium volume
    STA $4004
    
    ; Setup melody data structures
    JSR setup_symphony_melodies
    
    ; Initialize playback state
    JSR init_melody_playback
    
    RTS

setup_symphony_melodies:
    ; Create multiple melody sequences for the game
    
    ; Main theme melody
    JSR create_main_theme
    
    ; Victory melody
    JSR create_victory_melody
    
    ; Background harmony patterns
    JSR create_harmony_patterns
    
    RTS

create_main_theme:
    ; 8-note ascending/descending melody
    ; C-D-E-F-G-F-E-C
    LDA #$00        ; C
    STA main_melody+0
    LDA #$1E        ; Duration (30 frames)
    STA main_melody+1
    
    LDA #$02        ; D
    STA main_melody+2
    LDA #$1E
    STA main_melody+3
    
    LDA #$04        ; E
    STA main_melody+4
    LDA #$1E
    STA main_melody+5
    
    LDA #$05        ; F
    STA main_melody+6
    LDA #$1E
    STA main_melody+7
    
    LDA #$07        ; G
    STA main_melody+8
    LDA #$3C        ; Longer note
    STA main_melody+9
    
    LDA #$05        ; F
    STA main_melody+10
    LDA #$1E
    STA main_melody+11
    
    LDA #$04        ; E
    STA main_melody+12
    LDA #$1E
    STA main_melody+13
    
    LDA #$00        ; C
    STA main_melody+14
    LDA #$78        ; Long ending note
    STA main_melody+15
    
    LDA #$FF        ; End marker
    STA main_melody+16
    
    RTS

play_sprite_symphony_melody:
    ; A = melody type (0=main, 1=victory, 2=harmony)
    CMP #$00
    BEQ play_main
    CMP #$01
    BEQ play_victory
    CMP #$02
    BEQ play_harmony
    RTS
    
play_main:
    ; Set up main melody playback
    LDA #$00
    STA melody_position
    LDA #LOW(main_melody)
    STA melody_ptr_lo
    LDA #HIGH(main_melody)
    STA melody_ptr_hi
    RTS
    
play_victory:
    ; Set up victory melody playback
    RTS
    
play_harmony:
    ; Set up harmony playback
    RTS

update_sprite_symphony:
    ; Call this every frame to update melody
    JSR update_melody_playback
    JSR update_harmony_playback
    JSR update_visual_sync
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Sprite Symphony Melody Engine"
  code="; Sprite Symphony Melody Engine Demo
JSR init_symphony_melody_demo

init_symphony_melody_demo:
    ; Setup audio for Sprite Symphony
    LDA #%00000011  ; Enable pulse 1 and 2
    STA $4015
    LDA #%10111111  ; Pulse 1 for melody
    STA $4000
    LDA #%01111000  ; Pulse 2 for harmony
    STA $4004
    
    ; Create Sprite Symphony main theme
    ; Energetic 8-note melody
    ; C-E-G-C-G-E-C-C
    
    ; Note sequence
    LDA #$00        ; C
    STA $05A0
    LDA #$02        ; E
    STA $05A1
    LDA #$04        ; G
    STA $05A2
    LDA #$00        ; C (octave higher in implementation)
    STA $05A3
    LDA #$04        ; G
    STA $05A4
    LDA #$02        ; E
    STA $05A5
    LDA #$00        ; C
    STA $05A6
    LDA #$00        ; C (held)
    STA $05A7
    
    ; Duration sequence (frames)
    LDA #$20        ; 32 frames (~0.5 sec)
    STA $05B0
    LDA #$20
    STA $05B1
    LDA #$20
    STA $05B2
    LDA #$20
    STA $05B3
    LDA #$20
    STA $05B4
    LDA #$20
    STA $05B5
    LDA #$40        ; 64 frames (~1 sec)
    STA $05B6
    LDA #$40        ; Long final note
    STA $05B7
    
    ; Note frequencies
    ; C
    LDA #$F1
    STA $05C0
    LDA #$07
    STA $05C8
    ; E
    LDA #$B0
    STA $05C2
    LDA #$06
    STA $05CA
    ; G
    LDA #$82
    STA $05C4
    LDA #$05
    STA $05CC
    
    ; Initialize playback
    LDA #$00
    STA $05D0       ; melody_position
    STA $05D1       ; melody_timer
    
    RTS

; Update Sprite Symphony melody (call every frame)
update_symphony_melody:
    ; Check timer
    LDA $05D1       ; melody_timer
    BEQ start_symphony_note
    
    ; Continue current note
    DEC $05D1
    RTS
    
start_symphony_note:
    ; Check if melody finished
    LDX $05D0       ; melody_position
    CPX #$08        ; 8 notes total?
    BCC play_symphony_note
    
    ; Loop melody
    LDA #$00
    STA $05D0
    LDX #$00
    
play_symphony_note:
    ; Get note
    LDA $05A0,X     ; Get note index
    TAY             ; Use as frequency table index
    
    ; Set frequency on pulse 1
    LDA $05C0,Y     ; Get frequency low
    STA $4002       ; Pulse 1 frequency low
    LDA $05C8,Y     ; Get frequency high
    STA $4003       ; Pulse 1 frequency high
    
    ; Set duration
    LDA $05B0,X     ; Get duration
    STA $05D1       ; Set timer
    
    ; Advance position
    INC $05D0
    
    RTS

; Test the melody system
JSR update_symphony_melody
JSR update_symphony_melody
JSR update_symphony_melody

; Sprite Symphony melody engine working!"
  language="assembly"
/>

## Advanced Melody Techniques

### Melody Variations
```text
; Create variations on basic melodies
create_melody_variation:
    ; Original: C-E-G-C
    ; Variation 1: C-E-G-E (different ending)
    ; Variation 2: C-D-E-F (stepwise motion)
    ; Variation 3: C-E-G-C with different rhythm
    RTS
```

### Dynamic Expression
```text
; Add expression to melodies
add_melody_expression:
    ; Volume changes
    ; Duty cycle changes for timbre
    ; Subtle frequency modulation
    ; Attack/decay patterns
    RTS
```

## Practical Exercise: Complete Melody System

Create a comprehensive melody system with:

1. Multi-melody data storage (3 different melodies)
2. Melody selection and switching
3. Loop and one-shot playback modes
4. Two-channel harmony (melody + bass line)
5. Tempo control (adjustable playback speed)

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Complete Melody System"
  code="; Complete Melody System with Multiple Melodies
JSR init_complete_melody_system

init_complete_melody_system:
    ; Setup audio
    LDA #%00000111  ; Enable pulse 1, 2, triangle
    STA $4015
    LDA #%10111111  ; Pulse 1 - melody
    STA $4000
    LDA #%01111000  ; Pulse 2 - harmony
    STA $4004
    LDA #%11000000  ; Triangle - bass
    STA $4008
    
    ; 1. Create melody data storage
    JSR create_melody_1  ; Happy melody
    JSR create_melody_2  ; Sad melody
    JSR create_melody_3  ; Victory melody
    
    ; Initialize system
    LDA #$00
    STA $0600       ; current_melody (0-2)
    STA $0601       ; melody_position
    STA $0602       ; melody_timer
    STA $0603       ; playback_mode (0=loop, 1=oneshot)
    LDA #$20        ; Default tempo
    STA $0604       ; tempo_multiplier
    
    RTS

; 1. Melody 1: Happy tune (C-E-G-E)
create_melody_1:
    LDA #$00        ; C
    STA $0610
    LDA #$02        ; E
    STA $0611
    LDA #$04        ; G
    STA $0612
    LDA #$02        ; E
    STA $0613
    LDA #$FF        ; End
    STA $0614
    RTS

; Melody 2: Sad tune (A-F-D-C)
create_melody_2:
    LDA #$05        ; A (using index 5)
    STA $0620
    LDA #$03        ; F
    STA $0621
    LDA #$01        ; D
    STA $0622
    LDA #$00        ; C
    STA $0623
    LDA #$FF        ; End
    STA $0624
    RTS

; Melody 3: Victory tune (C-G-C-G-C)
create_melody_3:
    LDA #$00        ; C
    STA $0630
    LDA #$04        ; G
    STA $0631
    LDA #$00        ; C
    STA $0632
    LDA #$04        ; G
    STA $0633
    LDA #$00        ; C
    STA $0634
    LDA #$FF        ; End
    STA $0635
    RTS

; 2. Melody selection (A = melody number 0-2)
select_melody:
    STA $0600       ; Store current_melody
    LDA #$00
    STA $0601       ; Reset position
    STA $0602       ; Reset timer
    RTS

; 3. Set playback mode (A = 0 for loop, 1 for oneshot)
set_playback_mode:
    STA $0603       ; Store playback_mode
    RTS

; 4. Update melody playback
update_complete_melody:
    ; Check timer
    LDA $0602       ; melody_timer
    BEQ start_next_note
    
    ; Continue current note
    DEC $0602
    RTS

start_next_note:
    ; Get current melody base address
    LDA $0600       ; current_melody
    CMP #$00
    BEQ use_melody_1
    CMP #$01
    BEQ use_melody_2
    ; Must be melody 3
    LDX #$30        ; Melody 3 offset
    JMP get_melody_note
    
use_melody_1:
    LDX #$10        ; Melody 1 offset
    JMP get_melody_note
    
use_melody_2:
    LDX #$20        ; Melody 2 offset
    
get_melody_note:
    ; Add position to base
    TXA
    CLC
    ADC $0601       ; melody_position
    TAX
    
    ; Get note
    LDA $0600,X     ; Get note from melody
    CMP #$FF        ; End of melody?
    BEQ handle_melody_end
    
    ; Play note (simplified - just set frequency)
    TAY
    LDA note_frequencies,Y
    STA $4002       ; Pulse 1 frequency
    
    ; Set duration based on tempo
    LDA $0604       ; tempo_multiplier
    STA $0602       ; melody_timer
    
    ; Advance position
    INC $0601       ; melody_position
    RTS

handle_melody_end:
    ; Check playback mode
    LDA $0603       ; playback_mode
    BEQ loop_melody ; 0 = loop
    
    ; One-shot mode - stop
    RTS
    
loop_melody:
    LDA #$00
    STA $0601       ; Reset position
    RTS

; 5. Set tempo (A = tempo multiplier)
set_tempo:
    STA $0604       ; tempo_multiplier
    RTS

; Note frequency table (simplified)
note_frequencies:
    .byte $F1, $D2, $B0, $A0, $82, $68  ; C,D,E,F,G,A

; Test the complete system
; Select melody 1 (happy)
LDA #$00
JSR select_melody

; Set loop mode
LDA #$00
JSR set_playback_mode

; Set medium tempo
LDA #$30
JSR set_tempo

; Update melody a few times
JSR update_complete_melody
JSR update_complete_melody
JSR update_complete_melody

; Switch to victory melody
LDA #$02
JSR select_melody

; Complete melody system with multiple melodies working!"
  language="assembly"
/>

## What You've Learned

In this comprehensive lesson, you've mastered:

- Melody structure and musical phrase organization
- Frame-based timing systems for precise musical control
- Note sequence programming and data structures
- Musical phrase creation and management
- Advanced melody engines with multiple sequences
- Playback control (looping, one-shot, tempo)
- Foundation for the Sprite Symphony melody system

## Looking Ahead

Next lesson, you'll learn controller input basics - how to read button presses and create responsive game controls. This will let you make your Sprite Symphony interactive, allowing players to control the music!

## Fun Fact

Many classic NES melodies were created using exactly the techniques you've learned today! Composers like Koji Kondo (Super Mario Bros.) and Hirokazu Tanaka (Metroid) worked within the same frame-based timing systems and note sequence structures. The 60 FPS timing of the NES made it natural to think in terms of frames per note, leading to the distinctive rhythmic feel of 8-bit music. The constraint of limited polyphony (few channels) forced composers to create strong, memorable single-line melodies - which is why NES tunes are often easier to hum and remember than complex modern soundtracks!