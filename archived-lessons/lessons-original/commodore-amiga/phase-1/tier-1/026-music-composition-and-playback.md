---
title: "Music Composition and Playback"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 26
description: "Create complete musical compositions using Paula's 4-channel system. Learn music theory fundamentals, implement tracker-style music systems, and build sophisticated playback engines for professional-quality Amiga music."
learning_objectives:
  - "Master music composition for the Amiga's 4-channel system"
  - "Implement tracker-style music playback engines"
  - "Learn music theory applied to chip music composition"
  - "Create dynamic music that responds to gameplay"
  - "Build professional music systems for applications"
concepts:
  - "4-channel music composition techniques"
  - "Tracker format implementation"
  - "Music theory for chip music"
  - "Dynamic music and interactive audio"
  - "Professional music system architecture"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 26
---

# Lesson 26: Music Composition and Playback

Today you'll master music composition and playback for your Copper Dreams game. You'll learn to create sophisticated musical compositions that enhance the gaming experience and build dynamic music systems that respond to gameplay.

## Understanding Amiga Music Architecture

The Amiga's 4-channel audio system enables sophisticated musical compositions. Each channel can play independent samples with individual volume and period control:

**Professional Music System Architecture:**

```assembly
; Amiga Professional Music System

; Music engine structure
MusicEngine:
    dc.l    .Init
    dc.l    .Play
    dc.l    .Stop
    dc.l    .Update
    dc.l    .SetPattern
    dc.l    .SetTempo

; Music system initialization
.Init:
    LEA     $DFF000, A6
    
    ; Disable audio DMA
    MOVE.W  #$000F, $096(A6)
    
    ; Initialize music variables
    CLR.W   CurrentPattern
    CLR.W   CurrentRow
    CLR.W   PatternDelay
    MOVE.W  #6, TicksPerRow     ; Default tempo
    CLR.W   TickCounter
    
    ; Initialize channel states
    LEA     ChannelData, A0
    MOVE.W  #3, D0              ; 4 channels
.initLoop:
    CLR.W   (A0)+               ; Clear sample number
    CLR.W   (A0)+               ; Clear period
    CLR.W   (A0)+               ; Clear volume
    CLR.W   (A0)+               ; Clear effect
    CLR.L   (A0)+               ; Clear sample pointer
    CLR.W   (A0)+               ; Clear sample length
    DBRA    D0, .initLoop
    
    RTS

; Music playback system
.Play:
    ; A0 = Song data pointer
    MOVE.L  A0, SongPointer
    
    ; Load song header
    MOVE.W  (A0)+, SongLength    ; Number of patterns
    MOVE.W  (A0)+, PatternCount  ; Total patterns
    MOVE.W  (A0)+, SampleCount   ; Number of samples
    
    ; Load pattern order table
    LEA     PatternOrder, A1
    MOVE.W  SongLength, D0
    SUBQ.W  #1, D0
.orderLoop:
    MOVE.B  (A0)+, (A1)+
    DBRA    D0, .orderLoop
    
    ; Setup sample table
    LEA     SampleTable, A1
    MOVE.W  SampleCount, D0
    SUBQ.W  #1, D0
.sampleLoop:
    MOVE.L  (A0)+, (A1)+        ; Sample pointer
    MOVE.W  (A0)+, (A1)+        ; Sample length
    MOVE.W  (A0)+, (A1)+        ; Repeat start
    MOVE.W  (A0)+, (A1)+        ; Repeat length
    DBRA    D0, .sampleLoop
    
    ; Start playback
    MOVE.W  #1, MusicPlaying
    
    ; Enable audio DMA
    MOVE.W  #$800F, $096(A6)    ; Enable all audio channels
    
    RTS

; Music update (call every frame)
.Update:
    TST.W   MusicPlaying
    BEQ     .notPlaying
    
    ; Update tick counter
    SUBQ.W  #1, TickCounter
    BPL     .notPlaying
    
    ; Reset tick counter
    MOVE.W  TicksPerRow, TickCounter
    
    ; Process next row
    BSR     ProcessRow
    
    ; Advance to next row
    ADDQ.W  #1, CurrentRow
    CMP.W   #64, CurrentRow     ; 64 rows per pattern
    BLT.S   .samePattern
    
    ; Advance to next pattern
    CLR.W   CurrentRow
    ADDQ.W  #1, CurrentPattern
    
    ; Check if song finished
    MOVE.W  CurrentPattern, D0
    CMP.W   SongLength, D0
    BLT.S   .samePattern
    
    ; Loop song
    CLR.W   CurrentPattern
    
.samePattern:
.notPlaying:
    RTS

; Process current row of music data
ProcessRow:
    ; Get current pattern number
    MOVE.W  CurrentPattern, D0
    LEA     PatternOrder, A0
    MOVE.B  0(A0,D0.W), D1      ; Get pattern number
    
    ; Calculate pattern data address
    EXT.W   D1
    MULU    #1024, D1           ; Each pattern is 1024 bytes (64 rows * 16 bytes)
    LEA     PatternData, A0
    ADD.L   D1, A0
    
    ; Add current row offset
    MOVE.W  CurrentRow, D0
    MULU    #16, D0             ; Each row is 16 bytes (4 channels * 4 bytes)
    ADD.L   D0, A0
    
    ; Process all 4 channels
    LEA     ChannelData, A1
    LEA     $DFF000, A6
    MOVE.W  #3, D7              ; Channel counter
    
.channelLoop:
    ; Read note data
    MOVE.L  (A0)+, D0           ; Read 4 bytes of note data
    
    ; Extract components
    MOVE.L  D0, D1
    LSR.L   #8, D1
    LSR.L   #8, D1
    LSR.L   #4, D1
    AND.W   #$00F0, D1          ; Sample number (upper nibble)
    
    MOVE.L  D0, D2
    LSR.L   #8, D2
    LSR.L   #8, D2
    AND.W   #$000F, D2          ; Sample number (lower nibble)
    OR.W    D2, D1              ; Complete sample number
    
    MOVE.L  D0, D2
    LSR.L   #8, D2
    AND.W   #$0FFF, D2          ; Period value
    
    MOVE.W  D0, D3
    LSR.W   #8, D3
    AND.W   #$000F, D3          ; Effect number
    
    AND.W   #$00FF, D0          ; Effect parameter
    
    ; Process note if present
    TST.W   D2                  ; Check if period is set
    BEQ.S   .noNote
    
    ; Setup new note
    BSR     PlayNote            ; D1=sample, D2=period, A1=channel data
    
.noNote:
    ; Process effects
    BSR     ProcessEffects      ; D3=effect, D0=parameter
    
    ; Move to next channel
    ADD.W   #12, A1             ; Next channel data
    DBRA    D7, .channelLoop
    
    RTS

; Play a note on a channel
PlayNote:
    ; D1 = Sample number, D2 = Period, A1 = Channel data pointer
    
    ; Store note data
    MOVE.W  D1, (A1)            ; Sample number
    MOVE.W  D2, 2(A1)           ; Period
    MOVE.W  #64, 4(A1)          ; Default volume
    
    ; Get sample data
    SUBQ.W  #1, D1              ; Convert to 0-based index
    LSL.W   #3, D1              ; Each sample entry is 8 bytes
    LEA     SampleTable, A0
    ADD.W   D1, A0
    
    ; Setup hardware
    MOVE.L  (A0)+, 8(A1)        ; Sample pointer
    MOVE.W  (A0)+, 10(A1)       ; Sample length
    
    ; Calculate channel hardware address
    ; A1 points to channel data, calculate which channel this is
    LEA     ChannelData, A0
    SUB.L   A0, A1
    DIVU    #12, A1             ; Each channel data is 12 bytes
    
    ; Setup hardware registers
    LEA     $0A0(A6), A0        ; Audio channel 0 base
    MULU    #16, A1             ; Each hardware channel is 16 bytes apart
    ADD.L   A1, A0              ; A0 = Hardware channel base
    
    ; Program hardware
    MOVE.L  8(A1), (A0)         ; AUDxLCH/AUDxLCL
    MOVE.W  10(A1), 4(A0)       ; AUDxLEN
    MOVE.W  D2, 6(A0)           ; AUDxPER
    MOVE.W  #64, 8(A0)          ; AUDxVOL
    
    RTS

; Effect processing system
ProcessEffects:
    ; D3 = Effect number, D0 = Parameter
    
    ; Jump table for effects
    CMP.W   #16, D3
    BGE.S   .noEffect
    
    LSL.W   #2, D3
    LEA     EffectTable, A0
    MOVE.L  0(A0,D3.W), A0
    JMP     (A0)

EffectTable:
    dc.l    Effect00    ; Arpeggio
    dc.l    Effect01    ; Portamento up
    dc.l    Effect02    ; Portamento down
    dc.l    Effect03    ; Tone portamento
    dc.l    Effect04    ; Vibrato
    dc.l    Effect05    ; Continue + volume slide
    dc.l    Effect06    ; Continue + volume slide
    dc.l    Effect07    ; Tremolo
    dc.l    Effect08    ; Set panning
    dc.l    Effect09    ; Sample offset
    dc.l    Effect0A    ; Volume slide
    dc.l    Effect0B    ; Position jump
    dc.l    Effect0C    ; Set volume
    dc.l    Effect0D    ; Pattern break
    dc.l    Effect0E    ; Extended effects
    dc.l    Effect0F    ; Set speed

; Individual effect implementations
Effect00:   ; Arpeggio
    ; Cycle between base note and two higher notes
    TST.B   D0
    BEQ.S   .noEffect
    
    MOVE.W  TickCounter, D1
    AND.W   #3, D1
    BEQ.S   .baseNote
    
    ; Apply arpeggio
    MOVE.W  2(A1), D2           ; Get base period
    CMP.W   #1, D1
    BEQ.S   .firstArp
    
    ; Second arpeggio note
    MOVE.B  D0, D1
    AND.W   #$0F, D1            ; Lower nibble
    BRA.S   .applyArp
    
.firstArp:
    ; First arpeggio note  
    MOVE.B  D0, D1
    LSR.B   #4, D1              ; Upper nibble
    
.applyArp:
    ; Convert semitone offset to period change
    ; (simplified - use proper note table in real implementation)
    MULU    #60, D1             ; Approximate semitone spacing
    SUB.W   D1, D2
    
    ; Update hardware period
    ; ... hardware update code ...
    
.baseNote:
.noEffect:
    RTS

Effect0C:   ; Set volume
    ; D0 = New volume (0-64)
    CMP.B   #64, D0
    BLE.S   .volumeOK
    MOVE.B  #64, D0
.volumeOK:
    MOVE.W  D0, 4(A1)           ; Store in channel data
    
    ; Update hardware
    ; ... hardware volume update ...
    RTS

Effect0F:   ; Set speed/tempo
    CMP.B   #32, D0
    BLT.S   .setSpeed
    
    ; Set BPM (beats per minute)
    ; BPM to ticks conversion
    MOVE.W  #2500, D1           ; 50fps * 50 (base)
    DIVU    D0, D1
    MOVE.W  D1, TicksPerRow
    BRA.S   .speedDone
    
.setSpeed:
    ; Set ticks per row directly
    MOVE.W  D0, TicksPerRow
    
.speedDone:
    RTS

; Music data structures
MusicPlaying:       dc.w    0
SongPointer:        dc.l    0
CurrentPattern:     dc.w    0
CurrentRow:         dc.w    0
PatternDelay:       dc.w    0
TicksPerRow:        dc.w    6
TickCounter:        dc.w    6
SongLength:         dc.w    0
PatternCount:       dc.w    0
SampleCount:        dc.w    0

; Pattern order table (128 entries max)
PatternOrder:       ds.b    128

; Sample table (31 samples max, 8 bytes each)
SampleTable:        ds.l    31*2

; Channel data (4 channels, 12 bytes each)
ChannelData:        ds.w    4*6

; Pattern data area
PatternData:        ds.b    65536   ; Space for 64 patterns
```

## Advanced Music Composition Techniques

Learn to create sophisticated musical arrangements using tracker-style composition:

**Professional Music Composition System:**

```assembly
; Advanced Music Composition Tools

; Music composition helper functions
ComposeMusic:
    ; Initialize composition workspace
    LEA     CompositionData, A0
    
    ; Setup default pattern
    BSR     CreateBasePattern
    
    ; Add melody line
    BSR     AddMelodyTrack
    
    ; Add bass line
    BSR     AddBassTrack
    
    ; Add percussion
    BSR     AddPercussionTrack
    
    ; Add harmony
    BSR     AddHarmonyTrack
    
    RTS

; Create base rhythmic pattern
CreateBasePattern:
    LEA     CompositionData, A0
    
    ; Create 4/4 beat pattern
    MOVE.W  #63, D7             ; 64 rows minus 1
    
.patternLoop:
    ; Every 4th row gets a kick drum
    MOVE.W  D7, D0
    AND.W   #15, D0             ; Check position in 16-step cycle
    CMP.W   #12, D0             ; Kick on beats 1, 5, 9, 13
    BEQ.S   .addKick
    CMP.W   #4, D0
    BEQ.S   .addKick
    BRA.S   .checkHihat
    
.addKick:
    ; Add kick drum sample
    MOVE.B  #1, (A0)            ; Sample 1 = kick
    MOVE.W  #428, 1(A0)         ; C-3 period
    MOVE.B  #64, 3(A0)          ; Full volume
    BRA.S   .nextRow
    
.checkHihat:
    ; Hi-hat on off-beats
    BTST    #1, D0              ; Every other step
    BEQ.S   .nextRow
    
    ; Add hi-hat to channel 1
    MOVE.B  #2, 4(A0)           ; Sample 2 = hi-hat
    MOVE.W  #214, 5(A0)         ; C-4 period
    MOVE.B  #32, 7(A0)          ; Half volume
    
.nextRow:
    ADD.L   #16, A0             ; Next row (4 channels * 4 bytes)
    DBRA    D7, .patternLoop
    
    RTS

; Add melodic content
AddMelodyTrack:
    LEA     CompositionData, A0
    ADD.L   #8, A0              ; Channel 2 (melody)
    
    ; Simple melody in C major
    LEA     MelodyNotes, A1
    MOVE.W  #7, D7              ; 8 notes
    
.melodyLoop:
    ; Add note every 8 rows
    MOVE.W  (A1)+, D0           ; Get period
    BEQ.S   .skipNote           ; 0 = rest
    
    MOVE.B  #3, (A0)            ; Sample 3 = lead sound
    MOVE.W  D0, 1(A0)           ; Period
    MOVE.B  #48, 3(A0)          ; Volume
    
.skipNote:
    ADD.L   #128, A0            ; Advance 8 rows
    DBRA    D7, .melodyLoop
    
    RTS

; Create bass line
AddBassTrack:
    LEA     CompositionData, A0
    ADD.L   #12, A0             ; Channel 3 (bass)
    
    ; Bass pattern - root notes
    LEA     BassNotes, A1
    MOVE.W  #3, D7              ; 4 bass notes
    
.bassLoop:
    MOVE.B  #4, (A0)            ; Sample 4 = bass
    MOVE.W  (A1)+, 1(A0)        ; Bass period
    MOVE.B  #56, 3(A0)          ; Bass volume
    
    ADD.L   #256, A0            ; Advance 16 rows
    DBRA    D7, .bassLoop
    
    RTS

; Professional note tables for accurate tuning
MelodyNotes:
    dc.w    428     ; C-3
    dc.w    381     ; D-3
    dc.w    340     ; E-3
    dc.w    321     ; F-3
    dc.w    286     ; G-3
    dc.w    255     ; A-3
    dc.w    227     ; B-3
    dc.w    214     ; C-4

BassNotes:
    dc.w    856     ; C-2
    dc.w    642     ; F-2
    dc.w    571     ; G-2
    dc.w    856     ; C-2

; Advanced music theory implementation
CalculateChord:
    ; A0 = Chord data output
    ; D0 = Root note period
    ; D1 = Chord type (0=major, 1=minor, 2=dominant7)
    
    MOVE.W  D0, (A0)+           ; Root note
    
    ; Calculate third
    MOVE.W  D0, D2
    CMP.W   #1, D1
    BEQ.S   .minorThird
    
    ; Major third (4 semitones up)
    MULU    #85, D2             ; Approximate major third ratio
    DIVU    #107, D2
    BRA.S   .storeThird
    
.minorThird:
    ; Minor third (3 semitones up)
    MULU    #84, D2
    DIVU    #106, D2
    
.storeThird:
    MOVE.W  D2, (A0)+
    
    ; Calculate fifth (7 semitones up)
    MOVE.W  D0, D2
    MULU    #2, D2
    DIVU    #3, D2
    MOVE.W  D2, (A0)+
    
    ; Add seventh for dominant chords
    CMP.W   #2, D1
    BNE.S   .noSeventh
    
    MOVE.W  D0, D2
    MULU    #16, D2
    DIVU    #30, D2
    MOVE.W  D2, (A0)+
    
.noSeventh:
    RTS

; Dynamic music system
DynamicMusicUpdate:
    ; Change music based on game state
    ; D0 = Intensity level (0-100)
    
    CMP.W   #75, D0
    BGE.S   .highIntensity
    CMP.W   #50, D0
    BGE.S   .mediumIntensity
    
    ; Low intensity - calm music
    MOVE.W  #8, TicksPerRow     ; Slower tempo
    MOVE.W  #32, BassMasterVol  ; Quieter bass
    BRA.S   .intensityDone
    
.mediumIntensity:
    ; Medium intensity
    MOVE.W  #6, TicksPerRow     ; Normal tempo
    MOVE.W  #48, BassMasterVol  ; Normal bass
    BRA.S   .intensityDone
    
.highIntensity:
    ; High intensity - driving music
    MOVE.W  #4, TicksPerRow     ; Faster tempo
    MOVE.W  #64, BassMasterVol  ; Loud bass
    
    ; Add extra percussion
    MOVE.W  #1, ExtraPercussion
    
.intensityDone:
    RTS

; Music data storage
CompositionData:    ds.b    1024    ; One pattern worth of data
BassMasterVol:      dc.w    48
ExtraPercussion:    dc.w    0
```

## Interactive Music Systems

Learn to create music that responds dynamically to user interaction and program events:

**Interactive Music Response System:**

```assembly
; Interactive Music System

; Music response manager
MusicResponse:
    dc.l    .Init
    dc.l    .TriggerEvent
    dc.l    .UpdateMood
    dc.l    .CrossfadeTrack

.Init:
    ; Initialize response system
    CLR.W   CurrentMood
    CLR.W   TargetMood
    CLR.W   CrossfadeActive
    MOVE.W  #64, TrackAVolume
    CLR.W   TrackBVolume
    
    RTS

.TriggerEvent:
    ; D0 = Event type
    ; 0 = Success, 1 = Danger, 2 = Victory, 3 = Defeat
    
    LSL.W   #2, D0
    LEA     EventTable, A0
    MOVE.L  0(A0,D0.W), A0
    JMP     (A0)

EventTable:
    dc.l    EventSuccess
    dc.l    EventDanger
    dc.l    EventVictory
    dc.l    EventDefeat

EventSuccess:
    ; Play success chord progression
    LEA     SuccessChord, A0
    BSR     PlayChordProgression
    
    ; Brighten the mood slightly
    MOVE.W  CurrentMood, D0
    ADDQ.W  #10, D0
    CMP.W   #100, D0
    BLE.S   .moodOK
    MOVE.W  #100, D0
.moodOK:
    MOVE.W  D0, TargetMood
    RTS

EventDanger:
    ; Shift to tense music
    MOVE.W  #20, TargetMood     ; Dark mood
    
    ; Add tremolo effect to create tension
    MOVE.W  #1, TremoloActive
    MOVE.W  #4, TremoloSpeed
    
    ; Crossfade to danger track
    BSR     StartCrossfade
    RTS

EventVictory:
    ; Triumphant music
    MOVE.W  #90, TargetMood     ; Bright mood
    
    ; Play fanfare
    LEA     VictoryFanfare, A0
    BSR     PlayMelody
    
    ; Increase tempo temporarily
    MOVE.W  TicksPerRow, SavedTempo
    MOVE.W  #4, TicksPerRow     ; Faster
    MOVE.W  #200, TempoRestore  ; Restore after 200 ticks
    RTS

EventDefeat:
    ; Somber music
    MOVE.W  #10, TargetMood     ; Very dark
    
    ; Slow down and fade
    MOVE.W  #10, TicksPerRow    ; Much slower
    BSR     StartFadeOut
    RTS

.UpdateMood:
    ; Gradually adjust music to target mood
    MOVE.W  CurrentMood, D0
    MOVE.W  TargetMood, D1
    
    CMP.W   D0, D1
    BEQ.S   .moodStable
    BGT.S   .moodUp
    
    ; Mood going down
    SUBQ.W  #1, D0
    BRA.S   .updateMood
    
.moodUp:
    ; Mood going up
    ADDQ.W  #1, D0
    
.updateMood:
    MOVE.W  D0, CurrentMood
    
    ; Apply mood to music parameters
    BSR     ApplyMoodToMusic
    
.moodStable:
    RTS

ApplyMoodToMusic:
    ; D0 = Current mood (0-100)
    
    ; Adjust overall brightness (high frequencies)
    MOVE.W  D0, D1
    LSR.W   #2, D1              ; Scale to 0-25
    ADD.W   #20, D1             ; Base volume 20-45
    MOVE.W  D1, HighFreqVol
    
    ; Adjust bass presence
    MOVE.W  #70, D1
    SUB.W   D0, D1              ; Invert for bass
    LSR.W   #1, D1              ; Scale
    ADD.W   #20, D1             ; Base level
    MOVE.W  D1, BassPresence
    
    ; Adjust rhythm intensity
    CMP.W   #50, D0
    BGE.S   .highEnergy
    
    ; Low energy - simple rhythm
    MOVE.W  #8, RhythmDensity
    BRA.S   .rhythmDone
    
.highEnergy:
    ; High energy - complex rhythm
    MOVE.W  #16, RhythmDensity
    
.rhythmDone:
    RTS

; Crossfade system for smooth transitions
StartCrossfade:
    MOVE.W  #1, CrossfadeActive
    MOVE.W  #64, CrossfadeSteps
    CLR.W   CrossfadeCounter
    RTS

UpdateCrossfade:
    TST.W   CrossfadeActive
    BEQ.S   .noCrossfade
    
    ; Calculate crossfade position
    MOVE.W  CrossfadeCounter, D0
    MOVE.W  CrossfadeSteps, D1
    
    ; Track A volume (fade out)
    SUB.W   D0, D1
    MULU    #64, D1
    DIVU    CrossfadeSteps, D1
    MOVE.W  D1, TrackAVolume
    
    ; Track B volume (fade in)
    MULU    #64, D0
    DIVU    CrossfadeSteps, D0
    MOVE.W  D0, TrackBVolume
    
    ; Apply volumes to hardware
    BSR     ApplyCrossfadeVolumes
    
    ; Check if crossfade complete
    ADDQ.W  #1, CrossfadeCounter
    CMP.W   CrossfadeSteps, CrossfadeCounter
    BLT.S   .noCrossfade
    
    ; Crossfade complete
    CLR.W   CrossfadeActive
    
.noCrossfade:
    RTS

; Adaptive music based on player performance
AdaptiveMusic:
    ; A0 = Performance data
    ; 0(A0) = Score, 2(A0) = Combo, 4(A0) = Accuracy
    
    ; Calculate overall performance rating
    MOVE.W  (A0), D0            ; Score
    LSR.W   #8, D0              ; Scale down
    MOVE.W  2(A0), D1           ; Combo
    LSR.W   #2, D1              ; Scale
    ADD.W   D1, D0
    MOVE.W  4(A0), D1           ; Accuracy
    LSR.W   #1, D1              ; Scale
    ADD.W   D1, D0
    
    ; Limit to 0-100 range
    CMP.W   #100, D0
    BLE.S   .perfOK
    MOVE.W  #100, D0
.perfOK:
    
    ; Set target mood based on performance
    MOVE.W  D0, TargetMood
    
    ; Trigger special effects for high performance
    CMP.W   #80, D0
    BLT.S   .noSpecial
    
    ; High performance - add flourishes
    MOVE.W  #1, MusicalFlourish
    
.noSpecial:
    RTS

; Music system variables
CurrentMood:        dc.w    50      ; 0-100 scale
TargetMood:         dc.w    50
CrossfadeActive:    dc.w    0
CrossfadeCounter:   dc.w    0
CrossfadeSteps:     dc.w    64
TrackAVolume:       dc.w    64
TrackBVolume:       dc.w    0
TremoloActive:      dc.w    0
TremoloSpeed:       dc.w    4
HighFreqVol:        dc.w    30
BassPresence:       dc.w    40
RhythmDensity:      dc.w    8
SavedTempo:         dc.w    6
TempoRestore:       dc.w    0
MusicalFlourish:    dc.w    0

; Chord progressions for different moods
SuccessChord:
    dc.w    428, 340, 286, 214 ; C major chord
    
VictoryFanfare:
    dc.w    428, 381, 340, 321, 286, 255, 227, 214
    
; Music composition workspace
CompositionWorkspace: ds.b  2048
```

## What You've Learned

In this lesson, you've mastered music composition and playback:
- **4-channel music composition** techniques and arrangement
- **Tracker-style music systems** with pattern-based sequencing
- **Music theory** applied to chip music composition
- **Dynamic music systems** that respond to program events
- **Professional music architecture** for applications and games

## Looking Ahead

Next, you'll learn interactive input and UI programming, where you'll create sophisticated user interfaces that respond to mouse, keyboard, and joystick input!

## Fun Fact

The music composition techniques you've learned were used to create the legendary Amiga music that defined the chip music scene. Many famous musicians got their start composing tracker music on the Amiga!