---
title: "Music and Advanced Audio Programming"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 23
description: "Learn musical composition and sequencing on the SID chip. Learn to create songs, implement music players, and build sophisticated audio systems for games and applications."
learning_objectives:
  - "Understand musical sequencing and composition programming"
  - "Learn interrupt-driven music players and timing"
  - "Learn pattern-based music systems and data structures"
  - "Practice real-time audio effects and dynamic music"
  - "Build complete musical applications and sound systems"
concepts:
  - "Musical sequencing and pattern programming"
  - "Interrupt-driven music players"
  - "Note tables and frequency calculations"
  - "Real-time effects and dynamic audio"
  - "Complete audio system architecture"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 23
---

# Lesson 23: Music and Advanced Audio Programming

**Listen to this impossible multi-voice composition created entirely with code:**

```
; This creates a complete 3-voice musical arrangement with harmony,
; bass line, and real-time effects - rivalling professional
; synthesizers and sequencers costing thousands of pounds!

MusicLoop:
    JSR PlayMelody      ; Voice 1: Lead melody with vibrato
    JSR PlayHarmony     ; Voice 2: Harmonic accompaniment  
    JSR PlayBass        ; Voice 3: Walking bass line
    JSR ApplyFilter     ; Real-time filter sweep
    BNE MusicLoop       ; Continue seamlessly

; All synchronized perfectly using interrupt-driven timing!
```

That's the power of **SID musical programming** - creating complete compositions with professional-quality arrangements! Today you'll learn to create background music and dynamic audio systems that will transform your Number Quest game into a complete audiovisual experience.

## Musical Programming Concepts

**Musical programming** involves organizing sound over time to create compositions:

- **Sequencing**: Playing notes in specific order and timing
- **Patterns**: Reusable musical phrases and rhythms
- **Tracks**: Independent musical lines (melody, bass, drums)
- **Timing**: Precise control of note duration and tempo
- **Real-time control**: Dynamic effects and interactive music

Think of musical programming as **conducting an orchestra** where each SID voice is an instrument, and your code is the conductor's score.

## Note Tables and Musical Mathematics

### Chromatic Note Table

Create a complete table of musical frequencies for all notes:

```text
; Complete chromatic note table (C-1 to B-8)
; Format: Low byte, High byte for each note

NoteTableLow:
    ; Octave 1 (C-1 to B-1)
    .byte $16, $27, $39, $4B, $5F, $74, $8A, $A1, $BA, $D4, $F0, $0E
    ; Octave 2 (C-2 to B-2)  
    .byte $2D, $4E, $72, $96, $BE, $E8, $14, $43, $74, $A9, $E1, $1C
    ; Octave 3 (C-3 to B-3)
    .byte $5A, $9C, $E4, $2D, $7C, $D0, $28, $86, $E8, $52, $C2, $39
    ; Octave 4 (C-4 to B-4) - Middle octave
    .byte $B4, $39, $C8, $5A, $F7, $A1, $50, $0C, $D1, $A4, $85, $72
    ; Continue for higher octaves...

NoteTableHigh:
    ; Octave 1
    .byte $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $02
    ; Octave 2
    .byte $02, $02, $02, $02, $02, $02, $03, $03, $03, $03, $03, $04
    ; Octave 3  
    .byte $04, $04, $04, $05, $05, $05, $06, $06, $06, $07, $07, $08
    ; Octave 4
    .byte $09, $0A, $0A, $0B, $0C, $0D, $0E, $0F, $10, $11, $13, $14
    ; Continue for higher octaves...

; Note constants for easy reference
NOTE_C  = 0
NOTE_CS = 1   ; C#/Db
NOTE_D  = 2
NOTE_DS = 3   ; D#/Eb
NOTE_E  = 4
NOTE_F  = 5
NOTE_FS = 6   ; F#/Gb
NOTE_G  = 7
NOTE_GS = 8   ; G#/Ab
NOTE_A  = 9
NOTE_AS = 10  ; A#/Bb
NOTE_B  = 11

; Calculate note index: (Octave * 12) + Note
; Example: C-4 = (4 * 12) + 0 = 48
```

### Note Playing Function

```text
; Play note on specified voice
; Input: A = note index, X = voice (0,1,2), Y = duration
PlayNote:
    ; Save parameters
    STA CurrentNote
    STX CurrentVoice
    STY NoteDuration
    
    ; Calculate note table offset
    ASL                 ; Multiply by 2 (2 bytes per note)
    TAY                 ; Use as index
    
    ; Get frequency from table
    LDA NoteTableLow,Y  ; Low byte
    STA NoteFreqLow
    LDA NoteTableHigh,Y ; High byte
    STA NoteFreqHigh
    
    ; Calculate voice register offset
    LDX CurrentVoice
    CPX #$00
    BEQ Voice0
    CPX #$01
    BEQ Voice1
    ; Voice 2
    LDA NoteFreqLow
    STA $D40E           ; Voice 2 frequency low
    LDA NoteFreqHigh
    STA $D40F           ; Voice 2 frequency high
    LDA #%00100001      ; Sawtooth + Gate
    STA $D412           ; Voice 2 control
    JMP PlayDone
    
Voice0:
    LDA NoteFreqLow
    STA $D400           ; Voice 0 frequency low
    LDA NoteFreqHigh
    STA $D401           ; Voice 0 frequency high
    LDA #%00100001      ; Sawtooth + Gate
    STA $D404           ; Voice 0 control
    JMP PlayDone
    
Voice1:
    LDA NoteFreqLow
    STA $D407           ; Voice 1 frequency low
    LDA NoteFreqHigh
    STA $D408           ; Voice 1 frequency high
    LDA #%00100001      ; Sawtooth + Gate
    STA $D40B           ; Voice 1 control
    
PlayDone:
    RTS

; Variables
CurrentNote:     .byte 0
CurrentVoice:    .byte 0
NoteDuration:    .byte 0
NoteFreqLow:     .byte 0
NoteFreqHigh:    .byte 0
```

<CodeRunner 
  system="commodore-64"
  title="Musical Note Programming"
  code="; Demonstrate musical note programming
; Play a simple melody using note tables

; Simplified note table (one octave)
NotesLow:
    .byte $20, $C4, $82, $B4, $18, $D6, $D8, $40  ; C,D,E,F,G,A,B,C
NotesHigh:
    .byte $48, $50, $5A, $60, $6E, $7C, $8C, $90

; Simple melody data (note indices)
MelodyData:
    .byte 0, 2, 4, 5, 7, 5, 4, 2, 0, $FF  ; C-E-G-A-B-A-G-E-C, $FF=end

PlaySimpleMelody:
    ; Setup voice 1 parameters
    LDA #%00110011  ; Medium attack/decay
    STA $D405
    LDA #%11110010  ; Full sustain, medium release
    STA $D406
    LDA #%00001111  ; Full volume
    STA $D418
    
    ; Play melody
    LDX #$00        ; Melody index
    
MelodyLoop:
    LDA MelodyData,X ; Get note index
    CMP #$FF        ; Check for end marker
    BEQ MelodyDone
    
    ; Convert note index to frequency
    TAY             ; Use note as index
    LDA NotesLow,Y  ; Get frequency low byte
    STA $D400       ; Voice 1 frequency low
    LDA NotesHigh,Y ; Get frequency high byte
    STA $D401       ; Voice 1 frequency high
    
    ; Start note
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404       ; Voice 1 control
    
    ; Hold note
    JSR NoteDelay
    
    ; Stop note
    LDA #%00100000  ; Sawtooth, Gate off
    STA $D404
    
    ; Short pause between notes
    JSR NotePause
    
    ; Next note
    INX
    JMP MelodyLoop
    
MelodyDone:
    RTS

NoteDelay:
    LDY #$FF        ; Note duration
NoteWait:
    DEY
    BNE NoteWait
    RTS

NotePause:
    LDY #$40        ; Pause between notes
PauseWait:
    DEY
    BNE PauseWait
    RTS

; Play the demonstration
JSR PlaySimpleMelody"
  language="assembly"
/>

## Interrupt-Driven Music Player

**Real-time music** requires precise timing using interrupts:

```text
; Interrupt-driven music system
MusicPlayerInit:
    ; Setup music player interrupt
    SEI                 ; Disable interrupts
    
    ; Save original IRQ vector
    LDA $0314
    STA OriginalIRQLow
    LDA $0315
    STA OriginalIRQHigh
    
    ; Install music player interrupt
    LDA #<MusicPlayerIRQ
    STA $0314
    LDA #>MusicPlayerIRQ
    STA $0315
    
    ; Setup CIA1 Timer A for music timing (50Hz)
    LDA #$7F
    STA $DC0D           ; Disable CIA1 interrupts
    
    LDA #$24            ; Timer value for 50Hz
    STA $DC04           ; Timer A low
    LDA #$40
    STA $DC05           ; Timer A high
    
    LDA #$81            ; Enable Timer A interrupt
    STA $DC0D
    LDA #$11            ; Start timer, continuous
    STA $DC0E
    
    ; Initialize music player variables
    LDA #$00
    STA MusicPosition   ; Current position in song
    STA MusicTicker     ; Timing counter
    LDA #$01
    STA MusicPlaying    ; Music playing flag
    
    CLI                 ; Re-enable interrupts
    RTS

MusicPlayerIRQ:
    ; Save registers
    PHA
    TXA
    PHA
    TYA
    PHA
    
    ; Check if music is playing
    LDA MusicPlaying
    BEQ IRQDone
    
    ; Update music ticker
    INC MusicTicker
    LDA MusicTicker
    CMP #$08            ; 8 ticks = 1 note (6.25 Hz note rate)
    BNE IRQDone
    
    ; Reset ticker and play next note
    LDA #$00
    STA MusicTicker
    JSR PlayNextNote
    
IRQDone:
    ; Clear interrupt source
    LDA $DC0D           ; Acknowledge CIA1
    
    ; Restore registers
    PLA
    TAY
    PLA
    TAX
    PLA
    
    RTI

; Variables
OriginalIRQLow:  .byte 0
OriginalIRQHigh: .byte 0
MusicPosition:   .byte 0
MusicTicker:     .byte 0
MusicPlaying:    .byte 0
```

### Pattern-Based Music System

```text
; Pattern-based music sequencer
; Each pattern contains note data for multiple voices

; Pattern data structure:
; Byte 0: Voice 1 note
; Byte 1: Voice 2 note  
; Byte 2: Voice 3 note
; Byte 3: Pattern length/flags

Pattern1:
    ; Voice1, Voice2, Voice3, Length
    .byte 48, 36, 24, 4     ; C-4, C-3, C-2, 4 beats
    .byte 50, 38, 26, 4     ; D-4, D-3, D-2, 4 beats
    .byte 52, 40, 28, 4     ; E-4, E-3, E-2, 4 beats
    .byte 48, 36, 24, 4     ; C-4, C-3, C-2, 4 beats
    .byte $FF, $FF, $FF, 0  ; End marker

Pattern2:
    .byte 55, 43, 31, 8     ; G-4, G-3, G-2, 8 beats
    .byte 53, 41, 29, 8     ; F-4, F-3, F-2, 8 beats
    .byte $FF, $FF, $FF, 0  ; End marker

; Song structure (pattern sequence)
SongData:
    .byte <Pattern1, >Pattern1     ; Pattern 1 address
    .byte <Pattern2, >Pattern2     ; Pattern 2 address
    .byte <Pattern1, >Pattern1     ; Pattern 1 again
    .byte $FF, $FF                 ; End of song

PlayNextNote:
    ; Get current pattern address
    LDX MusicPosition
    LDA SongData,X      ; Pattern address low
    STA PatternPtr
    INX
    LDA SongData,X      ; Pattern address high
    STA PatternPtr+1
    INX
    STX MusicPosition
    
    ; Check for end of song
    LDA PatternPtr
    CMP #$FF
    BEQ StopMusic
    
    ; Play pattern notes
    LDY #$00
    LDA (PatternPtr),Y  ; Voice 1 note
    CMP #$FF
    BEQ NextPattern
    JSR PlayVoice1Note
    
    INY
    LDA (PatternPtr),Y  ; Voice 2 note
    JSR PlayVoice2Note
    
    INY
    LDA (PatternPtr),Y  ; Voice 3 note
    JSR PlayVoice3Note
    
    RTS

NextPattern:
    ; Move to next pattern
    JMP PlayNextNote

StopMusic:
    LDA #$00
    STA MusicPlaying
    RTS

PatternPtr: .word 0
```

<CodeRunner 
  system="commodore-64"
  title="Pattern-Based Music Sequencer"
  code="; Simple pattern-based music system
; Demonstrates structured musical composition

; Simple song patterns (simplified for demo)
PatternA:
    ; Note, Duration pairs
    .byte 0, 4, 2, 4, 4, 4, 0, 4, $FF  ; C-E-G-C pattern
    
PatternB:
    .byte 5, 4, 4, 4, 2, 4, 0, 8, $FF  ; F-G-E-C pattern

; Song structure
SongSequence:
    .byte 0, 1, 0, $FF  ; Play PatternA, PatternB, PatternA, end

; Pattern lookup table
PatternTableLow:
    .byte <PatternA, <PatternB
PatternTableHigh:
    .byte >PatternA, >PatternB

PlayPatternSong:
    ; Initialize music system
    LDA #%00110011  ; Medium attack/decay
    STA $D405       ; Voice 1 envelope
    LDA #%11110010  ; Full sustain, medium release
    STA $D406
    LDA #%00001111  ; Full volume
    STA $D418
    
    ; Play song sequence
    LDX #$00        ; Song position
    
SongLoop:
    LDA SongSequence,X ; Get pattern number
    CMP #$FF        ; End of song?
    BEQ SongDone
    
    ; Play pattern
    JSR PlayPattern
    
    ; Next pattern in sequence
    INX
    JMP SongLoop
    
SongDone:
    RTS

PlayPattern:
    ; Input: A = pattern number
    ; Get pattern address
    TAY             ; Pattern number in Y
    LDA PatternTableLow,Y
    STA $80         ; Pattern pointer low
    LDA PatternTableHigh,Y
    STA $81         ; Pattern pointer high
    
    ; Play pattern
    LDY #$00        ; Note index in pattern
    
PatternLoop:
    LDA ($80),Y     ; Get note
    CMP #$FF        ; End of pattern?
    BEQ PatternDone
    
    ; Play note
    TAX             ; Note index
    LDA SimplerNotesLow,X
    STA $D400       ; Voice 1 frequency low
    LDA SimplerNotesHigh,X
    STA $D401       ; Voice 1 frequency high
    
    ; Start note
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Get duration
    INY
    LDA ($80),Y     ; Duration
    JSR PlayDuration
    
    ; Stop note
    LDA #%00100000  ; Gate off
    STA $D404
    
    ; Short pause
    JSR ShortPause
    
    ; Next note
    INY
    JMP PatternLoop
    
PatternDone:
    RTS

PlayDuration:
    ; Input: A = duration (in timing units)
    TAX             ; Duration counter
DurationLoop:
    JSR BeatDelay   ; One beat delay
    DEX
    BNE DurationLoop
    RTS

BeatDelay:
    LDA #$FF        ; Beat timing
BeatWait1:
    TAY
BeatWait2:
    DEY
    BNE BeatWait2
    SEC
    SBC #$01
    BNE BeatWait1
    RTS

ShortPause:
    LDY #$40
SPWait:
    DEY
    BNE SPWait
    RTS

; Simplified note table for demo
SimplerNotesLow:
    .byte $20, $C4, $82, $B4, $18, $D6  ; C,D,E,F,G,A
SimplerNotesHigh:
    .byte $48, $50, $5A, $60, $6E, $7C

; Start the pattern song demo
JSR PlayPatternSong"
  language="assembly"
/>

## Advanced Music Features

### Multi-Voice Harmony

```text
; Three-voice harmony system
PlayHarmony:
    ; Chord data: Root, Third, Fifth
    ChordC:     .byte 48, 52, 55   ; C major (C-E-G)
    ChordF:     .byte 53, 57, 60   ; F major (F-A-C)
    ChordG:     .byte 55, 59, 62   ; G major (G-B-D)
    
    ; Chord progression
    ChordSequence:
        .word ChordC, ChordF, ChordG, ChordC, $0000
    
PlayChordProgression:
    LDX #$00            ; Chord index
    
ChordLoop:
    ; Get chord address
    LDA ChordSequence,X
    STA ChordPtr
    INX
    LDA ChordSequence,X
    STA ChordPtr+1
    INX
    
    ; Check for end
    LDA ChordPtr
    ORA ChordPtr+1
    BEQ ChordsDone
    
    ; Play chord
    JSR PlayThreeVoiceChord
    JSR ChordDelay
    
    JMP ChordLoop
    
ChordsDone:
    ; Stop all voices
    LDA #%00000000
    STA $D404
    STA $D40B
    STA $D412
    RTS

PlayThreeVoiceChord:
    ; Get chord notes
    LDY #$00
    LDA (ChordPtr),Y    ; Root note
    JSR SetVoice1Freq
    
    INY
    LDA (ChordPtr),Y    ; Third
    JSR SetVoice2Freq
    
    INY
    LDA (ChordPtr),Y    ; Fifth
    JSR SetVoice3Freq
    
    ; Start all voices
    LDA #%00100001      ; Sawtooth + Gate
    STA $D404           ; Voice 1
    STA $D40B           ; Voice 2
    STA $D412           ; Voice 3
    
    RTS

ChordPtr:   .word 0
ChordDelay: ; Implementation depends on timing needs
    RTS
```

### Dynamic Music Effects

```text
; Real-time music effects
MusicEffects:
    ; Vibrato effect on lead voice
    VibratoCounter = $90
    VibratoDepth = $91
    
ApplyVibrato:
    ; Modulate frequency based on counter
    LDA VibratoCounter
    AND #%00001111      ; Keep in range
    STA VibratoDepth
    
    ; Apply to current frequency
    LDA BaseFrequency
    CLC
    ADC VibratoDepth    ; Add vibrato offset
    STA $D400           ; Update Voice 1 frequency
    
    ; Update vibrato counter
    INC VibratoCounter
    RTS

; Filter sweep during playback
FilterSweep:
    FilterPosition = $92
    
UpdateFilter:
    ; Route voice to filter
    LDA #%00100000      ; Voice 1 to filter
    STA $D417
    
    ; Update cutoff based on position
    LDA FilterPosition
    STA $D415           ; Filter cutoff low
    LSR
    LSR
    STA $D416           ; Filter cutoff high
    
    ; Enable low-pass filter
    LDA #%00010111      ; Low-pass + volume
    STA $D418
    
    ; Update filter position
    INC FilterPosition
    RTS

BaseFrequency: .byte 0
```

### Arpeggiation and Advanced Patterns

```text
; Arpeggiator system
ArpeggiatorDemo:
    ; Arpeggio pattern (chord notes played in sequence)
    ArpPattern:     .byte 0, 2, 4, 2    ; Root, third, fifth, third
    
    ArpIndex = $93
    ArpSpeed = $94
    
PlayArpeggio:
    ; Get current arpeggio note
    LDX ArpIndex
    LDA ArpPattern,X
    
    ; Convert to actual note (add to base chord)
    CLC
    ADC BaseChordNote
    
    ; Play note
    JSR PlayArpNote
    
    ; Update arpeggio position
    INC ArpIndex
    LDA ArpIndex
    CMP #$04            ; 4 notes in pattern
    BNE ArpContinue
    LDA #$00            ; Reset to start
    STA ArpIndex
    
ArpContinue:
    RTS

BaseChordNote: .byte 48    ; C-4 as base
```

<CodeRunner 
  system="commodore-64"
  title="Advanced Music Programming"
  code="; Advanced music system with multiple features
; Demonstrates harmony, effects, and dynamic control

AdvancedMusicDemo:
    JSR InitAdvancedMusic
    JSR PlayAdvancedSong
    RTS

InitAdvancedMusic:
    ; Setup all voices with different characteristics
    
    ; Voice 1: Lead melody with vibrato
    LDA #%01000100  ; Medium attack/decay
    STA $D405
    LDA #%11110010  ; Full sustain, medium release
    STA $D406
    
    ; Voice 2: Harmony voice
    LDA #%00100010  ; Slower attack/decay
    STA $D40C
    LDA #%10100010  ; Lower sustain
    STA $D40D
    
    ; Voice 3: Bass voice
    LDA #%10001000  ; Fast attack, slow decay
    STA $D413
    LDA #%11110001  ; Full sustain, slow release
    STA $D414
    
    ; Setup filter for dynamic effects
    LDA #%00100100  ; Voice 1 to filter + resonance
    STA $D417
    
    ; Set master volume
    LDA #%00001111  ; Full volume
    STA $D418
    
    ; Initialize effect counters
    LDA #$00
    STA $90         ; Vibrato counter
    STA $91         ; Filter sweep counter
    
    RTS

PlayAdvancedSong:
    ; Play chord progression with effects
    LDX #$00        ; Chord index
    
AdvancedChordLoop:
    LDA ChordRoots,X
    CMP #$FF        ; End marker?
    BEQ AdvancedSongDone
    
    ; Set up three-voice chord
    JSR SetupChord
    
    ; Play chord with effects for duration
    LDY #$40        ; Chord duration
    
ChordEffectLoop:
    ; Apply vibrato to lead voice
    JSR ApplySimpleVibrato
    
    ; Apply filter sweep
    JSR ApplyFilterSweep
    
    ; Timing delay
    JSR EffectDelay
    
    DEY
    BNE ChordEffectLoop
    
    ; Stop voices briefly between chords
    JSR StopAllVoices
    JSR ChordPause
    
    ; Next chord
    INX
    JMP AdvancedChordLoop
    
AdvancedSongDone:
    JSR StopAllVoices
    RTS

SetupChord:
    ; Input: A = root note index
    ; Setup three-voice chord (root, third, fifth)
    
    ; Voice 3: Bass (root note, one octave down)
    SEC
    SBC #$0C        ; Subtract 12 (one octave)
    TAY
    LDA SimpleNotesLow,Y
    STA $D40E       ; Voice 3 freq low
    LDA SimpleNotesHigh,Y
    STA $D40F       ; Voice 3 freq high
    
    ; Voice 2: Third (root + 4 semitones)
    TYA
    CLC
    ADC #$10        ; Add back octave + 4 semitones
    TAY
    LDA SimpleNotesLow,Y
    STA $D407       ; Voice 2 freq low
    LDA SimpleNotesHigh,Y
    STA $D408       ; Voice 2 freq high
    
    ; Voice 1: Fifth (root + 7 semitones)
    TYA
    SEC
    SBC #$04        ; Back to root
    CLC
    ADC #$07        ; Add 7 semitones (fifth)
    TAY
    LDA SimpleNotesLow,Y
    STA $D400       ; Voice 1 freq low
    LDA SimpleNotesHigh,Y
    STA $D401       ; Voice 1 freq high
    
    ; Start all voices with different waveforms
    LDA #%00100001  ; Sawtooth + Gate (lead)
    STA $D404       ; Voice 1
    LDA #%01000001  ; Pulse + Gate (harmony)
    STA $D40B       ; Voice 2
    LDA #%00010001  ; Triangle + Gate (bass)
    STA $D412       ; Voice 3
    
    RTS

ApplySimpleVibrato:
    ; Simple vibrato effect on voice 1
    LDA $90         ; Vibrato counter
    AND #%00000111  ; Keep in range 0-7
    
    ; Create offset based on counter
    CMP #$04
    BCC VibratoUp
    
    ; Vibrato down
    LDA $D400       ; Current frequency low
    SEC
    SBC #$02        ; Subtract small amount
    STA $D400
    JMP VibratoEnd
    
VibratoUp:
    ; Vibrato up
    LDA $D400       ; Current frequency low
    CLC
    ADC #$02        ; Add small amount
    STA $D400
    
VibratoEnd:
    INC $90         ; Update vibrato counter
    RTS

ApplyFilterSweep:
    ; Sweep filter cutoff
    LDA $91         ; Filter counter
    LSR             ; Slow down sweep
    LSR
    STA $D415       ; Filter cutoff low
    
    LDA $91
    LSR
    LSR
    LSR
    LSR
    STA $D416       ; Filter cutoff high
    
    ; Enable low-pass filter
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    
    INC $91         ; Update filter counter
    RTS

StopAllVoices:
    LDA #%00100000  ; Waveform on, Gate off
    STA $D404       ; Voice 1
    LDA #%01000000  ; Pulse, Gate off
    STA $D40B       ; Voice 2
    LDA #%00010000  ; Triangle, Gate off
    STA $D412       ; Voice 3
    RTS

ChordRoots:
    .byte 0, 5, 7, 0, $FF  ; C, F, G, C progression

SimpleNotesLow:
    .byte $20, $C4, $82, $B4, $18, $D6, $D8, $40  ; One octave
    .byte $40, $88, $04, $68, $30, $AC, $B0, $80  ; Next octave
SimpleNotesHigh:
    .byte $48, $50, $5A, $60, $6E, $7C, $8C, $90
    .byte $90, $A0, $B4, $C0, $DC, $F8, $18, $21

EffectDelay:
    LDA #$40        ; Small delay for smooth effects
EDWait:
    SEC
    SBC #$01
    BNE EDWait
    RTS

ChordPause:
    LDY #$80        ; Pause between chords
CPWait:
    DEY
    BNE CPWait
    RTS

; Start the advanced music demonstration
JSR AdvancedMusicDemo"
  language="assembly"
/>

## Complete Music System Architecture

### Professional Music Player Structure

```text
; Complete music system with all features
MusicSystem:
    ; System components:
    ; 1. Interrupt-driven timing
    ; 2. Multi-track sequencer  
    ; 3. Pattern-based composition
    ; 4. Real-time effects
    ; 5. Dynamic instrument changes

; Music data structures
TrackData:
    ; Track 1: Lead melody
    Track1Patterns: .word Pattern_Lead1, Pattern_Lead2, $0000
    Track1Instruments: .byte Instrument_Lead, Instrument_Lead
    
    ; Track 2: Harmony
    Track2Patterns: .word Pattern_Harm1, Pattern_Harm2, $0000
    Track2Instruments: .byte Instrument_Pad, Instrument_Pad
    
    ; Track 3: Bass
    Track3Patterns: .word Pattern_Bass1, Pattern_Bass2, $0000
    Track3Instruments: .byte Instrument_Bass, Instrument_Bass

; Instrument definitions
Instrument_Lead:
    .byte %01000100     ; Attack/Decay
    .byte %11110010     ; Sustain/Release
    .byte %00100001     ; Waveform (Sawtooth + Gate)
    .byte $08           ; Pulse width high
    .byte %00000100     ; Effects flags (vibrato)

Instrument_Pad:
    .byte %00010001     ; Slow attack/decay
    .byte %11000001     ; Medium sustain/release
    .byte %01000001     ; Waveform (Pulse + Gate)
    .byte $06           ; Pulse width high
    .byte %00000000     ; No effects

Instrument_Bass:
    .byte %11110000     ; Fast attack, no decay
    .byte %11110000     ; Full sustain, no release
    .byte %00010001     ; Waveform (Triangle + Gate)
    .byte $00           ; No pulse width
    .byte %00000000     ; No effects

; Song structure
SongHeader:
    .byte 120           ; Tempo (BPM)
    .byte 4             ; Time signature numerator
    .byte 4             ; Time signature denominator
    .byte 3             ; Number of tracks
    .word TrackData     ; Track data pointer

; Advanced playback system
PlaySong:
    ; Initialize all tracks
    JSR InitAllTracks
    
    ; Setup interrupt timing based on tempo
    JSR SetupMusicTiming
    
    ; Start music playback
    LDA #$01
    STA MusicPlaying
    
    RTS

; Real-time music control
ChangeTempo:
    ; Input: A = new tempo
    ; Recalculate timer values
    ; Update interrupt frequency
    RTS

ChangeInstrument:
    ; Input: A = track, X = instrument
    ; Update track instrument settings
    RTS

StopSong:
    LDA #$00
    STA MusicPlaying
    JSR SilenceAllVoices
    RTS
```

### Interactive Music Features

```text
; Interactive music system
InteractiveMusic:
    ; Music responds to user input or game events
    
GameEventMusic:
    ; Different music for different game states
    LDA GameState
    CMP #STATE_MENU
    BEQ PlayMenuMusic
    CMP #STATE_PLAYING
    BEQ PlayGameMusic
    CMP #STATE_GAMEOVER
    BEQ PlayGameOverMusic
    RTS

PlayMenuMusic:
    ; Calm, looping background music
    LDA #<MenuMusicData
    STA CurrentSong
    LDA #>MenuMusicData
    STA CurrentSong+1
    JSR StartMusic
    RTS

PlayGameMusic:
    ; Dynamic music that changes with action
    LDA ActionLevel     ; Game intensity
    CMP #$80
    BCS PlayIntenseMusic
    JSR PlayNormalMusic
    RTS

PlayIntenseMusic:
    ; Add percussion, increase tempo
    JSR AddPercussion
    JSR IncreaseTempo
    RTS

; Sound effect integration
PlaySoundEffect:
    ; Input: A = effect number
    ; Temporarily use voice 3 for effects
    PHA                 ; Save effect number
    
    ; Mute voice 3 music temporarily
    LDA #%00000000
    STA $D412
    
    ; Play effect
    PLA                 ; Restore effect number
    JSR TriggerEffect
    
    ; Schedule voice 3 music restoration
    LDA #$10            ; Effect duration
    STA EffectTimer
    
    RTS

; Variables for interactive system
GameState:      .byte 0
ActionLevel:    .byte 0
EffectTimer:    .byte 0
CurrentSong:    .word 0
```

## Practice Exercise

Create a complete musical composition system that demonstrates:

1. Multi-voice harmony and melody
2. Pattern-based song structure
3. Real-time effects (vibrato, filter sweeps)
4. Dynamic tempo and instrument changes
5. Integration of sound effects with music

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Complete Music Composition System"
  code="; Complete music composition demonstration
; Multi-track song with effects and dynamic control

CompleteMusicalDemo:
    JSR InitCompleteMusic
    JSR PlayCompleteComposition
    RTS

InitCompleteMusic:
    ; Setup SID for multi-voice composition
    
    ; Voice 1: Lead instrument (bright sawtooth)
    LDA #%01000100  ; Medium attack/decay
    STA $D405
    LDA #%11110010  ; Full sustain, medium release
    STA $D406
    
    ; Voice 2: Harmony instrument (warm pulse)
    LDA #%00100010  ; Slower attack/decay
    STA $D40C
    LDA #%10100010  ; Medium sustain/release
    STA $D40D
    
    ; Voice 3: Bass instrument (deep triangle)
    LDA #%11000000  ; Fast attack, slow decay
    STA $D413
    LDA #%11110001  ; Full sustain, slow release
    STA $D414
    
    ; Setup filter for effects
    LDA #%11100000  ; All voices to filter initially
    STA $D417
    
    ; Set master volume
    LDA #%00001111  ; Full volume
    STA $D418
    
    ; Initialize composition variables
    LDA #$00
    STA $80         ; Section counter
    STA $81         ; Effect counter
    STA $82         ; Vibrato counter
    
    RTS

PlayCompleteComposition:
    ; Multi-section composition
    
    ; Section 1: Simple melody introduction
    JSR PlayIntroSection
    JSR SectionPause
    
    ; Section 2: Add harmony
    JSR PlayHarmonySection
    JSR SectionPause
    
    ; Section 3: Full arrangement with bass
    JSR PlayFullSection
    JSR SectionPause
    
    ; Section 4: Effects showcase
    JSR PlayEffectsSection
    
    ; Finale: All elements combined
    JSR PlayFinaleSection
    
    RTS

PlayIntroSection:
    ; Simple melody line (Voice 1 only)
    LDX #$00        ; Note counter
    
IntroLoop:
    LDA IntroMelody,X
    CMP #$FF        ; End of melody?
    BEQ IntroEnd
    
    ; Play note on Voice 1
    TAY
    LDA CompositionNotesLow,Y
    STA $D400
    LDA CompositionNotesHigh,Y
    STA $D401
    
    ; Start note
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Hold note with subtle vibrato
    JSR PlayNoteWithVibrato
    
    ; Stop note
    LDA #%00100000  ; Gate off
    STA $D404
    JSR NotePause
    
    INX
    JMP IntroLoop
    
IntroEnd:
    RTS

PlayHarmonySection:
    ; Melody + harmony (Voices 1 & 2)
    LDX #$00
    
HarmonyLoop:
    LDA IntroMelody,X
    CMP #$FF
    BEQ HarmonyEnd
    
    ; Play melody on Voice 1
    TAY
    LDA CompositionNotesLow,Y
    STA $D400
    LDA CompositionNotesHigh,Y
    STA $D401
    
    ; Play harmony on Voice 2 (third below)
    TYA
    SEC
    SBC #$02        ; Third below
    TAY
    LDA CompositionNotesLow,Y
    STA $D407
    LDA CompositionNotesHigh,Y
    STA $D408
    
    ; Start both voices
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404       ; Voice 1
    LDA #%01000001  ; Pulse + Gate
    STA $D40B       ; Voice 2
    
    ; Hold notes with effects
    JSR PlayHarmonyWithEffects
    
    ; Stop voices
    LDA #%00100000  ; Gate off
    STA $D404
    STA $D40B
    JSR NotePause
    
    INX
    JMP HarmonyLoop
    
HarmonyEnd:
    RTS

PlayFullSection:
    ; All three voices: melody, harmony, bass
    LDX #$00
    
FullLoop:
    LDA IntroMelody,X
    CMP #$FF
    BEQ FullEnd
    
    ; Voice 1: Melody
    TAY
    LDA CompositionNotesLow,Y
    STA $D400
    LDA CompositionNotesHigh,Y
    STA $D401
    
    ; Voice 2: Harmony (third)
    TYA
    SEC
    SBC #$02
    TAY
    LDA CompositionNotesLow,Y
    STA $D407
    LDA CompositionNotesHigh,Y
    STA $D408
    
    ; Voice 3: Bass (root, octave down)
    LDA IntroMelody,X
    SEC
    SBC #$0C        ; One octave down
    TAY
    LDA CompositionNotesLow,Y
    STA $D40E
    LDA CompositionNotesHigh,Y
    STA $D40F
    
    ; Start all voices
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404       ; Voice 1 (melody)
    LDA #%01000001  ; Pulse + Gate
    STA $D40B       ; Voice 2 (harmony)
    LDA #%00010001  ; Triangle + Gate
    STA $D412       ; Voice 3 (bass)
    
    ; Hold with complex effects
    JSR PlayFullArrangement
    
    ; Stop all voices
    LDA #%00100000
    STA $D404
    STA $D40B
    STA $D412
    JSR NotePause
    
    INX
    JMP FullLoop
    
FullEnd:
    RTS

PlayEffectsSection:
    ; Showcase advanced effects
    
    ; Setup sustained chord
    LDA #$00        ; C note
    TAY
    LDA CompositionNotesLow,Y
    STA $D400
    LDA CompositionNotesHigh,Y
    STA $D401
    
    ; Harmony note
    LDA #$04        ; E note
    TAY
    LDA CompositionNotesLow,Y
    STA $D407
    LDA CompositionNotesHigh,Y
    STA $D408
    
    ; Bass note
    LDA #$07        ; G note (lower octave)
    SEC
    SBC #$0C
    TAY
    LDA CompositionNotesLow,Y
    STA $D40E
    LDA CompositionNotesHigh,Y
    STA $D40F
    
    ; Start sustained chord
    LDA #%00100001
    STA $D404
    STA $D40B
    STA $D412
    
    ; Apply various effects over time
    LDX #$60        ; Effect duration
    
EffectsLoop:
    ; Rotate through different effects
    TXA
    AND #%00001111
    
    CMP #$00
    BEQ ApplyVibrato
    CMP #$04
    BEQ ApplyFilterLow
    CMP #$08
    BEQ ApplyFilterHigh
    CMP #$0C
    BEQ ApplyFilterSweep
    
ApplyVibrato:
    JSR SimpleVibrato
    JMP EffectsContinue
    
ApplyFilterLow:
    LDA #%00100000  ; Route to filter
    STA $D417
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    JMP EffectsContinue
    
ApplyFilterHigh:
    LDA #%00100000  ; Route to filter
    STA $D417
    LDA #%01000111  ; High-pass + volume
    STA $D418
    JMP EffectsContinue
    
ApplyFilterSweep:
    TXA             ; Use X for sweep
    STA $D415       ; Filter cutoff
    LSR
    LSR
    STA $D416
    LDA #%00100100  ; Route + resonance
    STA $D417
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    
EffectsContinue:
    JSR EffectDelay
    DEX
    BNE EffectsLoop
    
    ; Stop effects section
    LDA #%00000000
    STA $D404
    STA $D40B
    STA $D412
    STA $D417       ; Clear filter
    RTS

PlayFinaleSection:
    ; Grand finale combining all techniques
    ; Fast arpeggiated pattern with effects
    
    LDX #$30        ; Pattern length
FinaleLoop:
    ; Arpeggiated chord pattern
    TXA
    AND #%00000011  ; 4-note pattern
    TAY
    LDA ArpeggioPattern,Y
    
    ; Play on all voices with different octaves
    TAY             ; Base note
    LDA CompositionNotesLow,Y
    STA $D400       ; Voice 1
    LDA CompositionNotesHigh,Y
    STA $D401
    
    TYA
    CLC
    ADC #$0C        ; Octave up
    TAY
    LDA CompositionNotesLow,Y
    STA $D407       ; Voice 2
    LDA CompositionNotesHigh,Y
    STA $D408
    
    TYA
    SEC
    SBC #$18        ; Octave down
    TAY
    LDA CompositionNotesLow,Y
    STA $D40E       ; Voice 3
    LDA CompositionNotesHigh,Y
    STA $D40F
    
    ; Start all with different waveforms
    LDA #%00100001  ; Sawtooth
    STA $D404
    LDA #%01000001  ; Pulse
    STA $D40B
    LDA #%00010001  ; Triangle
    STA $D412
    
    ; Quick effects
    JSR QuickEffects
    
    ; Brief note duration for arpeggio
    JSR ArpeggioDelay
    
    DEX
    BNE FinaleLoop
    
    ; Final sustained chord
    JSR PlayFinalChord
    
    RTS

; Data and utility functions
IntroMelody:
    .byte 0, 2, 4, 5, 7, 5, 4, 2, 0, $FF  ; C major scale pattern

ArpeggioPattern:
    .byte 0, 4, 7, 4  ; C-E-G-E arpeggio

CompositionNotesLow:
    .byte $20, $C4, $82, $B4, $18, $D6, $D8, $40  ; One octave
    .byte $40, $88, $04, $68, $30, $AC, $B0, $80  ; Next octave

CompositionNotesHigh:
    .byte $48, $50, $5A, $60, $6E, $7C, $8C, $90
    .byte $90, $A0, $B4, $C0, $DC, $F8, $18, $21

; Utility functions
PlayNoteWithVibrato:
    LDY #$40
VibratoLoop:
    JSR SimpleVibrato
    JSR VibratoPause
    DEY
    BNE VibratoLoop
    RTS

SimpleVibrato:
    INC $82         ; Vibrato counter
    LDA $82
    AND #%00000011
    BEQ VibratoDown
    
    LDA $D400
    CLC
    ADC #$01
    STA $D400
    RTS
    
VibratoDown:
    LDA $D400
    SEC
    SBC #$01
    STA $D400
    RTS

PlayHarmonyWithEffects:
    LDY #$60
HarmEffectLoop:
    JSR SimpleVibrato
    JSR VibratoPause
    DEY
    BNE HarmEffectLoop
    RTS

PlayFullArrangement:
    LDY #$80
FullEffectLoop:
    JSR SimpleVibrato
    
    ; Add subtle filter movement
    TYA
    LSR
    LSR
    STA $D415
    LDA #%11100000  ; All voices to filter
    STA $D417
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    
    JSR VibratoPause
    DEY
    BNE FullEffectLoop
    RTS

QuickEffects:
    JSR SimpleVibrato
    RTS

PlayFinalChord:
    ; Sustained final chord with filter sweep
    LDA #$00        ; C
    TAY
    LDA CompositionNotesLow,Y
    STA $D400
    LDA CompositionNotesHigh,Y
    STA $D401
    
    LDA #$04        ; E
    TAY
    LDA CompositionNotesLow,Y
    STA $D407
    LDA CompositionNotesHigh,Y
    STA $D408
    
    LDA #$07        ; G
    TAY
    LDA CompositionNotesLow,Y
    STA $D40E
    LDA CompositionNotesHigh,Y
    STA $D40F
    
    ; Start final chord
    LDA #%00100001
    STA $D404
    STA $D40B
    STA $D412
    
    ; Dramatic filter sweep
    LDX #$FF
FinalSweep:
    STX $D415
    TXA
    LSR
    LSR
    STA $D416
    LDA #%11101111  ; All voices + high resonance
    STA $D417
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    
    JSR FinalDelay
    DEX
    CPX #$20
    BNE FinalSweep
    
    ; Fade out
    LDX #$0F
FadeOut:
    TXA
    STA $D418       ; Reduce volume
    JSR FinalDelay
    DEX
    BPL FadeOut
    
    ; Complete silence
    LDA #%00000000
    STA $D404
    STA $D40B
    STA $D412
    STA $D417
    STA $D418
    
    RTS

; Timing functions
VibratoPause:
    LDA #$08
VPWait:
    SEC
    SBC #$01
    BNE VPWait
    RTS

NotePause:
    LDY #$40
NPWait:
    DEY
    BNE NPWait
    RTS

SectionPause:
    LDX #$FF
SPWait1:
    LDY #$80
SPWait2:
    DEY
    BNE SPWait2
    DEX
    BNE SPWait1
    RTS

EffectDelay:
    LDY #$30
EDWait:
    DEY
    BNE EDWait
    RTS

ArpeggioDelay:
    LDY #$20
ADWait:
    DEY
    BNE ADWait
    RTS

FinalDelay:
    LDY #$60
FDWait:
    DEY
    BNE FDWait
    RTS

; Start the complete musical composition
JSR CompleteMusicalDemo"
  language="assembly"
/>

## Music Programming Best Practices

### 1. Timing and Synchronization
```text
; Use consistent timing systems
; Plan note durations carefully
; Consider interrupt-driven playback for precision
```

### 2. Voice Management
```text
; Plan voice assignments:
; Voice 1: Lead melodies, effects
; Voice 2: Harmony, counter-melodies  
; Voice 3: Bass, percussion, modulation source
```

### 3. Data Organization
```text
; Use structured data formats
; Separate note data from timing data
; Plan for compression and efficiency
```

### 4. Memory Management
```text
; Keep frequently accessed data in zero page
; Use lookup tables for complex calculations
; Plan memory usage for long compositions
```

## What You've Learned

In this lesson, you've mastered complete musical programming:

- Musical sequencing and composition programming techniques
- Interrupt-driven music players with precise timing
- Pattern-based music systems and data structures
- Multi-voice harmony and arrangement programming
- Real-time effects and dynamic music control
- Complete music system architecture and best practices

## Looking Ahead

In the next lesson, you'll complete the I/O and Hardware Control section with a comprehensive review that integrates all graphics and audio programming concepts from lessons 17-23.

## Fun Fact

The music programming techniques you've learned were used to create some of the most memorable video game soundtracks of all time! Composers like Rob Hubbard, Martin Galway, and Ben Daglish used these exact methods to create C64 classics that are still celebrated today. The pattern-based sequencing, multi-voice arrangements, and real-time effects you've mastered are the foundation of all modern music software - from digital audio workstations like Logic and Ableton Live to game audio engines like Wwise and FMOD. You've learned the core principles that power all computer music, from chiptunes to film scores!