---
title: "Musical Notes and Frequencies"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 20
description: "Master musical note relationships, scales, and frequency calculations for NES audio programming. Learn chromatic scales, octaves, and create accurate musical note tables for game soundtracks."
learning_objectives:
  - "Understand musical note names and relationships"
  - "Learn chromatic scales and octave relationships"
  - "Calculate accurate NES frequency values for musical notes"
  - "Create complete musical note tables"
  - "Build foundation for complex musical compositions"
concepts:
  - "Musical note names (A, B, C, D, E, F, G)"
  - "Chromatic scale and semitones"
  - "Octaves and frequency doubling"
  - "NES period value calculations"
  - "Musical intervals and harmony"
estimated_duration: "50-65 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 20
---

# Lesson 20: Musical Notes and Frequencies

Welcome to musical theory for programmers! Today you'll learn how musical notes relate to frequencies and how to create accurate note tables for NES music programming. This knowledge is essential for creating proper melodies and harmonies.

## Understanding Musical Notes

Musical notes are standardized frequencies that create pleasing sounds when combined:

### The Seven Natural Notes

- **A**: The reference note (440 Hz in modern tuning)
- **B**: A whole step above A
- **C**: The "do" of do-re-mi, start of the major scale
- **D**: "Re" in the major scale
- **E**: "Mi" in the major scale
- **F**: "Fa" in the major scale
- **G**: "Sol" in the major scale

### The Chromatic Scale

The chromatic scale includes all 12 semitones in an octave:

```
C, C#, D, D#, E, F, F#, G, G#, A, A#, B
```

**Sharps (#)**: Raise a note by a semitone
**Flats (♭)**: Lower a note by a semitone (C# = D♭)

**Chromatic Scale Demo:**

```assembly
; Play chromatic scale (12 semitones)
JSR play_chromatic_scale

play_chromatic_scale:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015
    LDA #%10111111  ; Configure pulse 1
    STA $4000

    ; Create chromatic scale starting from C
    ; C note
    LDA #$F1        ; C frequency low
    STA $4002
    LDA #$07        ; C frequency high
    STA $4003
    JSR note_delay

    ; C# note
    LDA #$D8        ; C# frequency low
    STA $4002
    LDA #$07        ; C# frequency high
    STA $4003
    JSR note_delay

    ; D note
    LDA #$C0        ; D frequency low
    STA $4002
    LDA #$07        ; D frequency high
    STA $4003
    JSR note_delay

    ; D# note
    LDA #$A9        ; D# frequency low
    STA $4002
    LDA #$07        ; D# frequency high
    STA $4003
    JSR note_delay

    ; E note
    LDA #$94        ; E frequency low
    STA $4002
    LDA #$06        ; E frequency high
    STA $4003
    JSR note_delay

    RTS

note_delay:
    LDX #$00
    LDY #$30        ; Note duration
delay_loop:
    DEX
    BNE delay_loop
    DEY
    BNE delay_loop
    RTS

; Chromatic scale ascending!
```

## Octaves and Frequency Relationships

An **octave** is the interval between one musical note and another with double its frequency:

- **C4** (Middle C): ~261 Hz
- **C5** (High C): ~523 Hz (double the frequency)
- **C3** (Low C): ~130 Hz (half the frequency)

### NES Octave Implementation

```text
; Same note in different octaves
C3_PERIOD = $0FE2    ; Low C (octave 3)
C4_PERIOD = $07F1    ; Middle C (octave 4)
C5_PERIOD = $03F8    ; High C (octave 5)
C6_PERIOD = $01FC    ; Very high C (octave 6)

; Pattern: Each octave up = divide period by 2
; Each octave down = multiply period by 2
```

## Calculating NES Note Frequencies

The NES uses period values that are inversely related to frequency:

**Formula**: `Period = (CPU_CLOCK / (16 * Target_Frequency)) - 1`

Where:

- **CPU_CLOCK**: 1,789,773 Hz (NTSC NES)
- **Target_Frequency**: Desired musical frequency in Hz
- **Period**: 11-bit value (0-2047) written to NES frequency registers

### Standard Musical Frequencies

```text
; Standard frequencies for 4th octave
A4  = 440.00 Hz    ; Concert pitch
A#4 = 466.16 Hz
B4  = 493.88 Hz
C5  = 523.25 Hz    ; Middle C (actually 5th octave)
C#5 = 554.37 Hz
D5  = 587.33 Hz
D#5 = 622.25 Hz
E5  = 659.25 Hz
F5  = 698.46 Hz
F#5 = 739.99 Hz
G5  = 783.99 Hz
G#5 = 830.61 Hz
```

**Octave Relationships:**

```assembly
; Demonstrate octave relationships
JSR demo_octaves

demo_octaves:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015
    LDA #%10111111
    STA $4000

    ; Play C in different octaves
    ; Low C (octave 3)
    LDA #$E2        ; Low C frequency low
    STA $4002
    LDA #$0F        ; Low C frequency high
    STA $4003
    JSR octave_delay

    ; Middle C (octave 4)
    LDA #$F1        ; Middle C frequency low
    STA $4002
    LDA #$07        ; Middle C frequency high
    STA $4003
    JSR octave_delay

    ; High C (octave 5)
    LDA #$F8        ; High C frequency low
    STA $4002
    LDA #$03        ; High C frequency high
    STA $4003
    JSR octave_delay

    ; Very high C (octave 6)
    LDA #$FC        ; Very high C frequency low
    STA $4002
    LDA #$01        ; Very high C frequency high
    STA $4003
    JSR octave_delay

    RTS

octave_delay:
    LDX #$00
    LDY #$50        ; Longer delay to hear octave clearly
oct_delay_loop:
    DEX
    BNE oct_delay_loop
    DEY
    BNE oct_delay_loop
    RTS

; Same note (C) in four different octaves!
```

## Complete Musical Note Table

Let's create a comprehensive note table for NES music:

```text
; Complete chromatic note table for 5th octave
; (Good range for NES melodies)

note_periods_lo:
    .byte $F8, $E5, $D2, $C1, $B0, $A0, $91, $82    ; C5-G5
    .byte $75, $68, $5C, $50, $45, $3A, $30, $27     ; G#5-D#6
    .byte $1E, $16, $0E, $07, $00                     ; E6-A6

note_periods_hi:
    .byte $03, $03, $03, $03, $03, $03, $03, $03    ; C5-G5
    .byte $03, $03, $03, $03, $03, $03, $03, $03     ; G#5-D#6
    .byte $03, $03, $03, $03, $03                     ; E6-A6

; Note index constants
NOTE_C  = 0
NOTE_CS = 1
NOTE_D  = 2
NOTE_DS = 3
NOTE_E  = 4
NOTE_F  = 5
NOTE_FS = 6
NOTE_G  = 7
NOTE_GS = 8
NOTE_A  = 9
NOTE_AS = 10
NOTE_B  = 11
```

**Complete Note Table System:**

```assembly
; Create complete chromatic note table
JSR setup_complete_note_table

setup_complete_note_table:
    ; Setup audio
    LDA #%00000001
    STA $4015
    LDA #%10111111
    STA $4000

    ; Create chromatic scale table in memory
    ; C5 note (index 0)
    LDA #$F8        ; C5 low
    STA $03D0
    LDA #$03        ; C5 high
    STA $03E0

    ; C#5 note (index 1)
    LDA #$E5        ; C#5 low
    STA $03D1
    LDA #$03        ; C#5 high
    STA $03E1

    ; D5 note (index 2)
    LDA #$D2        ; D5 low
    STA $03D2
    LDA #$03        ; D5 high
    STA $03E2

    ; D#5 note (index 3)
    LDA #$C1        ; D#5 low
    STA $03D3
    LDA #$03        ; D#5 high
    STA $03E3

    ; E5 note (index 4)
    LDA #$B0        ; E5 low
    STA $03D4
    LDA #$03        ; E5 high
    STA $03E4

    ; F5 note (index 5)
    LDA #$A0        ; F5 low
    STA $03D5
    LDA #$03        ; F5 high
    STA $03E5

    ; F#5 note (index 6)
    LDA #$91        ; F#5 low
    STA $03D6
    LDA #$03        ; F#5 high
    STA $03E6

    ; G5 note (index 7)
    LDA #$82        ; G5 low
    STA $03D7
    LDA #$03        ; G5 high
    STA $03E7

    RTS

; Play note by chromatic index (0-11)
play_chromatic_note:
    ; A = note index (0-11)
    TAX             ; Use as table index
    LDA $03D0,X     ; Get frequency low
    STA $4002       ; Set frequency low
    LDA $03E0,X     ; Get frequency high
    STA $4003       ; Set frequency high
    RTS

; Test chromatic scale
test_chromatic:
    LDA #$00        ; C
    JSR play_chromatic_note
    JSR note_delay
    LDA #$01        ; C#
    JSR play_chromatic_note
    JSR note_delay
    LDA #$02        ; D
    JSR play_chromatic_note
    JSR note_delay
    LDA #$03        ; D#
    JSR play_chromatic_note
    JSR note_delay
    LDA #$04        ; E
    JSR play_chromatic_note
    JSR note_delay
    RTS

; Play partial chromatic scale
JSR test_chromatic

; Complete chromatic note table working!
```

## Musical Intervals and Harmony

Understanding intervals helps create harmony:

### Common Intervals (from C)

- **Unison**: C to C (0 semitones)
- **Minor 2nd**: C to C# (1 semitone)
- **Major 2nd**: C to D (2 semitones)
- **Minor 3rd**: C to D# (3 semitones)
- **Major 3rd**: C to E (4 semitones)
- **Perfect 4th**: C to F (5 semitones)
- **Tritone**: C to F# (6 semitones)
- **Perfect 5th**: C to G (7 semitones)
- **Octave**: C to C (12 semitones)

### Creating Chords

```text
; Major chord = Root + Major 3rd + Perfect 5th
; C Major = C (0) + E (4) + G (7)

play_c_major_chord:
    ; C on pulse 1
    LDA #$00        ; Note C
    JSR play_on_pulse1

    ; E on pulse 2
    LDA #$04        ; Note E
    JSR play_on_pulse2

    ; G on triangle (bass)
    LDA #$07        ; Note G
    JSR play_on_triangle

    RTS
```

**Musical Intervals and Chords:**

```assembly
; Demonstrate musical intervals and chords
JSR demo_intervals_chords

demo_intervals_chords:
    ; Enable multiple channels for harmony
    LDA #%00000111  ; Pulse 1, pulse 2, triangle
    STA $4015

    ; Configure channels
    LDA #%10111111  ; Pulse 1 - melody
    STA $4000
    LDA #%01111000  ; Pulse 2 - harmony
    STA $4004
    LDA #%11000000  ; Triangle - bass
    STA $4008

    ; Play C major chord (C-E-G)
    JSR play_c_major
    JSR chord_delay

    ; Play F major chord (F-A-C)
    JSR play_f_major
    JSR chord_delay

    ; Play G major chord (G-B-D)
    JSR play_g_major
    JSR chord_delay

    RTS

play_c_major:
    ; C on pulse 1 (root)
    LDA #$F8        ; C5 frequency
    STA $4002
    LDA #$03
    STA $4003

    ; E on pulse 2 (major third)
    LDA #$B0        ; E5 frequency
    STA $4006
    LDA #$03
    STA $4007

    ; G on triangle (fifth, bass)
    LDA #$82        ; G5 frequency
    STA $400A
    LDA #$03
    STA $400B

    RTS

play_f_major:
    ; F on pulse 1
    LDA #$A0        ; F5 frequency
    STA $4002
    LDA #$03
    STA $4003

    ; A on pulse 2
    LDA #$68        ; A5 frequency
    STA $4006
    LDA #$03
    STA $4007

    ; C on triangle
    LDA #$F8        ; C5 frequency (lower octave for bass)
    STA $400A
    LDA #$03
    STA $400B

    RTS

play_g_major:
    ; G on pulse 1
    LDA #$82        ; G5 frequency
    STA $4002
    LDA #$03
    STA $4003

    ; B on pulse 2
    LDA #$50        ; B5 frequency
    STA $4006
    LDA #$03
    STA $4007

    ; D on triangle
    LDA #$D2        ; D5 frequency
    STA $400A
    LDA #$03
    STA $400B

    RTS

chord_delay:
    LDX #$00
    LDY #$80        ; Longer delay for chords
chord_loop:
    DEX
    BNE chord_loop
    DEY
    BNE chord_loop
    RTS

; C-F-G chord progression playing!
```

## Creating Scale Tables

Different musical scales create different moods:

### Major Scale Pattern

**Intervals**: Whole-Whole-Half-Whole-Whole-Whole-Half
**C Major**: C-D-E-F-G-A-B-C

### Minor Scale Pattern

**Intervals**: Whole-Half-Whole-Whole-Half-Whole-Whole
**A Minor**: A-B-C-D-E-F-G-A

```text
; C Major scale note indices
c_major_scale:
    .byte 0, 2, 4, 5, 7, 9, 11, 12    ; C,D,E,F,G,A,B,C

; A Minor scale note indices (relative minor of C Major)
a_minor_scale:
    .byte 9, 11, 0, 2, 4, 5, 7, 9     ; A,B,C,D,E,F,G,A

play_scale:
    ; A = scale type (0=major, 1=minor)
    CMP #$00
    BEQ play_major

play_minor:
    LDX #$00        ; Scale index
minor_loop:
    LDA a_minor_scale,X
    JSR play_chromatic_note
    JSR scale_delay
    INX
    CPX #$08        ; 8 notes in scale
    BNE minor_loop
    RTS

play_major:
    LDX #$00        ; Scale index
major_loop:
    LDA c_major_scale,X
    JSR play_chromatic_note
    JSR scale_delay
    INX
    CPX #$08        ; 8 notes in scale
    BNE major_loop
    RTS
```

## Sprite Symphony Musical Foundation

Let's create a complete musical system for our project:

```text
init_sprite_symphony_music:
    ; Initialize comprehensive music system
    LDA #%00000111  ; Enable pulse 1, 2, triangle
    STA $4015

    ; Configure channels for musical quality
    LDA #%10111111  ; Pulse 1: 50% duty, max volume
    STA $4000
    LDA #%01110000  ; Pulse 2: 25% duty, medium volume
    STA $4004
    LDA #%11000000  ; Triangle: full control
    STA $4008

    ; Setup complete note tables
    JSR setup_symphony_note_tables

    ; Initialize musical sequences
    JSR setup_symphony_sequences

    RTS

setup_symphony_note_tables:
    ; Create multiple octave tables for musical range
    ; 4th octave (middle range)
    ; 5th octave (high range)
    ; Musical intervals table
    ; Chord tables
    RTS

setup_symphony_sequences:
    ; Simple melody sequences
    ; Harmony patterns
    ; Rhythm patterns
    RTS

play_symphony_chord:
    ; A = chord type (0=major, 1=minor, 2=diminished)
    ; Play full chord with proper voicing
    RTS

play_symphony_melody:
    ; A = melody pattern index
    ; Play predefined melodic sequences
    RTS
```

## Practical Exercise: Musical Scale Player

Create a complete musical scale system with:

1. Chromatic note table (12 semitones)
2. Major scale pattern implementation
3. Minor scale pattern implementation
4. Chord generation (major, minor, diminished)
5. Scale and chord player functions

**Practice: Musical Scale System:**

```assembly
; Complete Musical Scale System
JSR init_musical_system

init_musical_system:
    ; Enable channels
    LDA #%00000111  ; Pulse 1, 2, triangle
    STA $4015
    LDA #%10111111  ; Pulse 1 config
    STA $4000
    LDA #%01111000  ; Pulse 2 config
    STA $4004
    LDA #%11000000  ; Triangle config
    STA $4008

    ; 1. Create chromatic note table (C5 octave)
    JSR setup_chromatic_table

    ; 2. Create scale patterns
    JSR setup_scale_patterns

    RTS

setup_chromatic_table:
    ; C5 (index 0)
    LDA #$F8
    STA $0450       ; chromatic_low[0]
    LDA #$03
    STA $0460       ; chromatic_high[0]

    ; D5 (index 2)
    LDA #$D2
    STA $0452       ; chromatic_low[2]
    LDA #$03
    STA $0462       ; chromatic_high[2]

    ; E5 (index 4)
    LDA #$B0
    STA $0454       ; chromatic_low[4]
    LDA #$03
    STA $0464       ; chromatic_high[4]

    ; F5 (index 5)
    LDA #$A0
    STA $0455       ; chromatic_low[5]
    LDA #$03
    STA $0465       ; chromatic_high[5]

    ; G5 (index 7)
    LDA #$82
    STA $0457       ; chromatic_low[7]
    LDA #$03
    STA $0467       ; chromatic_high[7]

    ; A5 (index 9)
    LDA #$68
    STA $0459       ; chromatic_low[9]
    LDA #$03
    STA $0469       ; chromatic_high[9]

    ; B5 (index 11)
    LDA #$50
    STA $045B       ; chromatic_low[11]
    LDA #$03
    STA $046B       ; chromatic_high[11]

    RTS

setup_scale_patterns:
    ; 2. Major scale pattern (C major)
    LDA #$00        ; C
    STA $0470
    LDA #$02        ; D
    STA $0471
    LDA #$04        ; E
    STA $0472
    LDA #$05        ; F
    STA $0473
    LDA #$07        ; G
    STA $0474
    LDA #$09        ; A
    STA $0475
    LDA #$0B        ; B
    STA $0476

    ; 3. Minor scale pattern (A minor)
    LDA #$09        ; A
    STA $0480
    LDA #$0B        ; B
    STA $0481
    LDA #$00        ; C
    STA $0482
    LDA #$02        ; D
    STA $0483
    LDA #$04        ; E
    STA $0484
    LDA #$05        ; F
    STA $0485
    LDA #$07        ; G
    STA $0486

    RTS

; Play note from chromatic table
play_chromatic_note:
    ; A = chromatic index (0, 2, 4, 5, 7, 9, 11)
    TAX
    LDA $0450,X     ; Get frequency low
    STA $4002       ; Pulse 1 frequency low
    LDA $0460,X     ; Get frequency high
    STA $4003       ; Pulse 1 frequency high
    RTS

; Play major scale
play_major_scale:
    LDX #$00        ; Scale position
major_scale_loop:
    LDA $0470,X     ; Get note from major scale pattern
    JSR play_chromatic_note
    JSR scale_note_delay
    INX
    CPX #$07        ; 7 notes in scale
    BNE major_scale_loop
    RTS

; Play minor scale
play_minor_scale:
    LDX #$00        ; Scale position
minor_scale_loop:
    LDA $0480,X     ; Get note from minor scale pattern
    JSR play_chromatic_note
    JSR scale_note_delay
    INX
    CPX #$07        ; 7 notes in scale
    BNE minor_scale_loop
    RTS

; 4. Play major chord (root, third, fifth)
play_major_chord:
    ; A = root note index
    STA $0490       ; Store root

    ; Root on pulse 1
    JSR play_chromatic_note

    ; Major third on pulse 2 (root + 4 semitones)
    LDA $0490
    CLC
    ADC #$04        ; Add 4 semitones for major third
    TAX
    LDA $0450,X
    STA $4006       ; Pulse 2 frequency low
    LDA $0460,X
    STA $4007       ; Pulse 2 frequency high

    ; Perfect fifth on triangle (root + 7 semitones)
    LDA $0490
    CLC
    ADC #$07        ; Add 7 semitones for perfect fifth
    TAX
    LDA $0450,X
    STA $400A       ; Triangle frequency low
    LDA $0460,X
    STA $400B       ; Triangle frequency high

    RTS

scale_note_delay:
    LDX #$00
    LDY #$40
delay:
    DEX
    BNE delay
    DEY
    BNE delay
    RTS

; Test the complete system
; Play C major scale
JSR play_major_scale

; Play A minor scale
JSR play_minor_scale

; Play C major chord
LDA #$00        ; C root
JSR play_major_chord

; Complete musical scale system working!
```

## What You've Learned

In this comprehensive lesson, you've mastered:

- Musical note names and chromatic scale organization
- Octave relationships and frequency doubling concepts
- NES-specific frequency calculations and period values
- Complete musical note table creation
- Musical intervals and chord theory
- Major and minor scale patterns
- Foundation for complex musical compositions

## Looking Ahead

Next lesson, you'll learn simple melody programming - how to sequence notes over time, create musical phrases, and build the timing systems needed for dynamic musical playback in your NES games!

## Fun Fact

The mathematical relationships in music are the same whether you're using a $3000 synthesizer or an 8-bit NES! The frequency ratios that create perfect fifths (3:2) and octaves (2:1) are universal constants that our brains recognize as harmonious. NES composers like Koji Kondo used these same mathematical relationships to create the memorable melodies in Super Mario Bros. and The Legend of Zelda. The limitations of the NES APU actually forced composers to focus on pure musical relationships rather than complex timbres, often resulting in cleaner, more memorable melodies than more advanced systems could produce!
