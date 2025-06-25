---
title: "Visual-Audio Synchronization"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 26
description: "Learn to synchronize visual elements with audio output for immersive multimedia experiences. Master timing relationships between sprites, sound, and player interaction for engaging NES games."
learning_objectives:
  - "Synchronize sprite animations with audio playback timing"
  - "Create visual feedback that responds to sound generation"
  - "Implement frame-perfect timing for multimedia experiences"
  - "Design coordinated audio-visual feedback systems"
  - "Build the multimedia foundation for Sprite Symphony"
concepts:
  - "Frame-based timing and synchronization"
  - "Audio-visual coordination patterns"
  - "Real-time multimedia programming"
  - "Timing-dependent visual effects"
  - "Interactive feedback system design"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 26
---

# Lesson 26: Visual-Audio Synchronization

Master the art of coordinating sight and sound! This lesson teaches you how to create perfectly synchronized multimedia experiences where visual elements respond to audio timing, creating the engaging feedback that makes great NES games memorable.

## Frame-Based Timing Fundamentals

The NES operates at exactly 60 frames per second, giving you a precise timing foundation for synchronization:

```text
NES Timing Basics:
- 60 FPS (frames per second)
- 1 frame = 1/60 second = 16.67 milliseconds
- 1 second = 60 frames
- Audio and visual updates happen during VBlank
- Synchronization requires frame-accurate timing
```

Basic audio-visual synchronization framework:

```assembly
; Frame-based synchronization system
FrameCounter: .byte $00
AudioTimer: .byte $00
VisualTimer: .byte $00
SyncActive: .byte $00

UpdateAudioVisualSync:
    INC FrameCounter
    
    ; Check for synchronized events
    LDA SyncActive
    BEQ NoSync
    
    ; Update both audio and visual timers
    LDA AudioTimer
    BNE DecAudioTimer
    JMP CheckVisualTimer
    
DecAudioTimer:
    DEC AudioTimer
    
CheckVisualTimer:
    LDA VisualTimer
    BNE DecVisualTimer
    JMP SyncDone
    
DecVisualTimer:
    DEC VisualTimer
    
    ; Check if both timers are done
    LDA AudioTimer
    ORA VisualTimer
    BNE SyncDone
    
    ; Both finished - trigger synchronized event
    JSR OnSyncComplete
    
SyncDone:
NoSync:
    RTS

StartSyncEvent:
    ; Begin synchronized audio-visual event
    LDA #$01
    STA SyncActive
    LDA #$30             ; 30 frame duration (0.5 seconds)
    STA AudioTimer
    STA VisualTimer
    
    ; Start audio
    JSR StartTone
    
    ; Start visual effect
    JSR StartVisualEffect
    RTS
```

**Basic Audio-Visual Synchronization:**

```assembly
; Frame-based synchronization demonstration
Main:
    JSR InitSync
    
GameLoop:
    JSR UpdateTimers
    JSR UpdateAudio
    JSR UpdateVisuals
    JMP GameLoop

InitSync:
    LDA #$00
    STA FrameCount
    STA AudioActive
    STA VisualActive
    STA SyncPhase
    RTS

UpdateTimers:
    INC FrameCount
    
    ; Trigger events every 60 frames (1 second)
    LDA FrameCount
    CMP #$3C             ; 60 frames
    BNE CheckSyncEvents
    
    LDA #$00
    STA FrameCount
    JSR StartSyncEvent
    
CheckSyncEvents:
    ; Update active timers
    LDA AudioActive
    BEQ CheckVisualTimer
    DEC AudioActive
    
CheckVisualTimer:
    LDA VisualActive
    BEQ TimersDone
    DEC VisualActive
    
TimersDone:
    RTS

StartSyncEvent:
    ; Start synchronized audio-visual event
    LDA #$20             ; 32 frame duration
    STA AudioActive
    LDA #$20
    STA VisualActive
    
    ; Reset sync phase
    LDA #$00
    STA SyncPhase
    
    ; Start audio tone
    JSR StartTone
    
    ; Start visual effect
    JSR StartVisualPulse
    RTS

UpdateAudio:
    ; Update audio based on timer
    LDA AudioActive
    BEQ AudioOff
    
    ; Calculate audio phase
    LDA #$20
    SEC
    SBC AudioActive      ; Calculate progress
    STA AudioPhase
    
    ; Simple frequency modulation
    LDA AudioPhase
    LSR                  ; Divide by 2
    CLC
    ADC #$80             ; Base frequency
    STA CurrentFreq
    
    JSR UpdateTone
    JMP AudioDone
    
AudioOff:
    JSR StopTone
    
AudioDone:
    RTS

UpdateVisuals:
    ; Update visuals based on timer
    LDA VisualActive
    BEQ VisualOff
    
    ; Calculate visual phase
    LDA #$20
    SEC
    SBC VisualActive     ; Calculate progress
    STA VisualPhase
    
    ; Update sprite based on audio phase
    LDA AudioPhase
    LSR                  ; Sync with audio
    CLC
    ADC #$80             ; Base position
    STA SpriteData+3     ; X position
    
    ; Pulsing Y position
    LDA VisualPhase
    AND #$07             ; 8-frame pulse cycle
    CMP #$04
    BCC PulseUp
    
    ; Pulse down
    LDA #$84
    JMP StoreSpriteY
    
PulseUp:
    LDA #$7C
    
StoreSpriteY:
    STA SpriteData+0
    JMP VisualDone
    
VisualOff:
    ; Hide sprite when not active
    LDA #$FF
    STA SpriteData+0
    
VisualDone:
    RTS

StartTone:
    ; Initialize audio registers for tone
    LDA #%10111111       ; Duty, length counter, envelope
    STA $4000
    LDA #%00000000       ; Sweep disabled
    STA $4001
    RTS

UpdateTone:
    ; Update tone frequency
    LDA CurrentFreq
    STA $4002            ; Frequency low
    LDA #$08
    STA $4003            ; Frequency high, length
    RTS

StopTone:
    ; Silence the tone
    LDA #$00
    STA $4000
    RTS

StartVisualPulse:
    ; Initialize sprite for visual effect
    LDA #$80
    STA SpriteData+0     ; Y position
    LDA #$01
    STA SpriteData+1     ; Tile
    LDA #$00
    STA SpriteData+2     ; Attributes
    LDA #$80
    STA SpriteData+3     ; X position
    RTS

; Variables
FrameCount: .byte $00
AudioActive: .byte $00
VisualActive: .byte $00
SyncPhase: .byte $00
AudioPhase: .byte $00
VisualPhase: .byte $00
CurrentFreq: .byte $80

; Sprite data
SpriteData: .byte $FF, $01, $00, $80
```

## Beat-Synchronized Visual Effects

Create visual effects that pulse and move in time with musical beats:

```assembly
; Beat detection and visualization system
BeatTimer: .byte $00
BeatInterval: .byte $3C      ; 60 frames = 1 beat per second
LastBeatFrame: .byte $00
BeatActive: .byte $00

DetectBeat:
    ; Check if it's time for next beat
    LDA FrameCounter
    SEC
    SBC LastBeatFrame
    CMP BeatInterval
    BCC NoBeat
    
    ; Beat detected!
    LDA FrameCounter
    STA LastBeatFrame
    
    JSR TriggerBeat
    
NoBeat:
    RTS

TriggerBeat:
    ; Start beat visualization
    LDA #$10             ; 16 frame beat effect
    STA BeatActive
    
    ; Trigger audio
    JSR PlayBeatSound
    
    ; Trigger visual effect
    JSR StartBeatVisual
    RTS

UpdateBeatVisual:
    LDA BeatActive
    BEQ BeatVisualDone
    
    DEC BeatActive
    
    ; Calculate beat phase (0-15, countdown)
    LDA BeatActive
    
    ; Create expanding circle effect with sprites
    JSR UpdateBeatSprites
    
    ; Flash background color on strong beats
    LDA BeatActive
    CMP #$0E             ; Just started?
    BNE BeatVisualDone
    JSR FlashBackground
    
BeatVisualDone:
    RTS

UpdateBeatSprites:
    ; A register contains beat phase (15 down to 0)
    STA BeatPhase
    
    ; Calculate expansion radius
    LDA #$0F
    SEC
    SBC BeatPhase        ; Invert (0 to 15)
    STA ExpansionRadius
    
    ; Position 4 sprites in circle around center
    ; Sprite 0 - Top
    LDA #$80             ; Center Y
    SEC
    SBC ExpansionRadius  ; Move up by radius
    STA SpriteData+0
    LDA #$80             ; Center X
    STA SpriteData+3
    
    ; Sprite 1 - Right
    LDA #$80             ; Center Y
    STA SpriteData+4
    LDA #$80             ; Center X
    CLC
    ADC ExpansionRadius  ; Move right by radius
    STA SpriteData+7
    
    ; Sprite 2 - Bottom
    LDA #$80             ; Center Y
    CLC
    ADC ExpansionRadius  ; Move down by radius
    STA SpriteData+8
    LDA #$80             ; Center X
    STA SpriteData+11
    
    ; Sprite 3 - Left
    LDA #$80             ; Center Y
    STA SpriteData+12
    LDA #$80             ; Center X
    SEC
    SBC ExpansionRadius  ; Move left by radius
    STA SpriteData+15
    
    ; Set tiles and attributes for all beat sprites
    LDX #$00
SetBeatSprites:
    LDA #$20             ; Beat effect tile
    STA SpriteData+1,X   ; Tile
    LDA BeatPhase
    LSR
    LSR                  ; Divide by 4 for palette
    STA SpriteData+2,X   ; Attributes (palette changes with phase)
    
    TXA
    CLC
    ADC #$04
    TAX
    CPX #$10             ; 4 sprites
    BNE SetBeatSprites
    
    RTS

; Variables for beat system
BeatPhase: .byte $00
ExpansionRadius: .byte $00
```

## Musical Note Visualization

Create sprites that represent musical notes and respond to audio:

```assembly
; Musical note sprite system
NoteFrequencies:
    ; Frequency values for different musical notes
    .byte $85, $90, $9C, $A8, $B5, $C3, $D2, $E2  ; C, D, E, F, G, A, B, C

NoteTiles:
    ; Different tiles for different note values
    .byte $30, $31, $32, $33, $34, $35, $36, $37   ; Visual note representations

PlayVisualNote:
    ; Play a note with synchronized visual
    LDX CurrentNoteIndex ; Index into note arrays
    
    ; Set audio frequency
    LDA NoteFrequencies,X
    STA $4002            ; Frequency low
    LDA #$08
    STA $4003            ; Frequency high
    
    ; Start envelope
    LDA #%10111111
    STA $4000
    
    ; Create visual note sprite
    LDA NoteTiles,X      ; Get tile for this note
    STA SpriteData+1     ; Set sprite tile
    
    ; Position based on note pitch (higher = higher on screen)
    LDA NoteFrequencies,X
    EOR #$FF             ; Invert (higher freq = lower Y value)
    LSR                  ; Scale down
    CLC
    ADC #$40             ; Base Y position
    STA SpriteData+0     ; Y position
    
    ; X position based on time
    LDA NoteTimer
    CLC
    ADC #$40             ; Base X position  
    STA SpriteData+3     ; X position
    
    ; Set note duration
    LDA #$20             ; 32 frame note
    STA NoteActive
    
    RTS

UpdateNoteVisualization:
    LDA NoteActive
    BEQ NoteVisDone
    
    DEC NoteActive
    
    ; Animate note sprite during playback
    LDA NoteActive
    
    ; Fade effect - change palette over time
    CMP #$18             ; 3/4 duration
    BCS NoteFull
    CMP #$10             ; 1/2 duration
    BCS NoteMid
    CMP #$08             ; 1/4 duration
    BCS NoteDim
    
    ; Very dim
    LDA #%00000011       ; Palette 3
    JMP StoreNotePalette
    
NoteDim:
    LDA #%00000010       ; Palette 2
    JMP StoreNotePalette
    
NoteMid:
    LDA #%00000001       ; Palette 1
    JMP StoreNotePalette
    
NoteFull:
    LDA #%00000000       ; Palette 0 (brightest)
    
StoreNotePalette:
    STA SpriteData+2     ; Store palette
    
    ; Move note across screen
    LDA SpriteData+3     ; Current X
    CLC
    ADC #$01             ; Move right
    STA SpriteData+3
    
    ; Hide sprite when note ends
    LDA NoteActive
    BNE NoteVisDone
    LDA #$FF             ; Hide sprite
    STA SpriteData+0
    
NoteVisDone:
    RTS

; Variables for note visualization
CurrentNoteIndex: .byte $00
NoteTimer: .byte $00
NoteActive: .byte $00
```

**Musical Note Visualization:**

```assembly
; Musical note visualization with audio sync
Main:
    JSR InitMusic
    
GameLoop:
    JSR UpdateMusicTimer
    JSR UpdateNoteDisplay
    JSR UpdateAudio
    JMP GameLoop

InitMusic:
    LDA #$00
    STA MusicTimer
    STA CurrentNote
    STA NoteActive
    STA SequenceIndex
    
    ; Enable audio
    LDA #%00000001       ; Enable pulse 1
    STA $4015
    RTS

UpdateMusicTimer:
    INC MusicTimer
    LDA MusicTimer
    CMP #$20             ; Play note every 32 frames
    BNE MusicTimerDone
    
    LDA #$00
    STA MusicTimer
    JSR PlayNextNote
    
MusicTimerDone:
    RTS

PlayNextNote:
    ; Get next note from sequence
    LDX SequenceIndex
    LDA MusicSequence,X
    CMP #$FF             ; End of sequence?
    BEQ ResetSequence
    
    STA CurrentNote
    JSR PlayNoteWithVisual
    
    INC SequenceIndex
    RTS
    
ResetSequence:
    LDA #$00
    STA SequenceIndex
    RTS

PlayNoteWithVisual:
    ; Play audio note
    LDX CurrentNote
    LDA NoteFreqTable,X
    STA $4002            ; Frequency low
    LDA #$08
    STA $4003            ; Frequency high
    
    ; Reset envelope
    LDA #%10111111       ; Duty, envelope
    STA $4000
    
    ; Create visual note
    JSR CreateNoteSprite
    
    ; Set note duration
    LDA #$1E             ; 30 frames
    STA NoteActive
    RTS

CreateNoteSprite:
    ; Position sprite based on note
    LDX CurrentNote
    
    ; Y position based on pitch (higher notes = higher on screen)
    LDA NotePitchY,X
    STA SpriteData+0
    
    ; Tile based on note
    LDA NoteTileTable,X
    STA SpriteData+1
    
    ; Palette based on note type
    LDA CurrentNote
    AND #$03             ; 4 different palettes
    STA SpriteData+2
    
    ; X position moves across screen
    LDA MusicTimer
    ASL                  ; * 2
    CLC
    ADC #$30             ; Base X
    STA SpriteData+3
    
    RTS

UpdateNoteDisplay:
    LDA NoteActive
    BEQ NoteDisplayDone
    
    DEC NoteActive
    
    ; Animate the note sprite
    LDA NoteActive
    
    ; Pulse effect - change Y position slightly
    AND #$07             ; 8-frame cycle
    CMP #$04
    BCC PulseDown
    
    ; Pulse up
    LDA SpriteData+0
    SEC
    SBC #$01
    JMP StoreNoteY
    
PulseDown:
    LDA SpriteData+0
    CLC
    ADC #$01
    
StoreNoteY:
    STA SpriteData+0
    
    ; Fade out near end
    LDA NoteActive
    CMP #$08             ; Last 8 frames
    BCS NoteDisplayDone
    
    ; Change to dimmer palette
    LDA SpriteData+2
    ORA #%00001000       ; Set dim bit
    STA SpriteData+2
    
    ; Hide when done
    LDA NoteActive
    BNE NoteDisplayDone
    LDA #$FF
    STA SpriteData+0
    
NoteDisplayDone:
    RTS

UpdateAudio:
    ; Fade out audio as note ends
    LDA NoteActive
    BEQ AudioSilent
    
    CMP #$10             ; Last half of note
    BCS AudioDone
    
    ; Reduce volume
    LDA #%10110000       ; Reduce envelope
    STA $4000
    JMP AudioDone
    
AudioSilent:
    LDA #$00             ; Silence
    STA $4000
    
AudioDone:
    RTS

; Music data
MusicSequence:
    .byte $00, $02, $04, $05, $04, $02, $00, $FF  ; Simple scale

NoteFreqTable:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E  ; Note frequencies

NoteTileTable:
    .byte $10, $11, $12, $13, $14, $15, $16, $17  ; Note tiles

NotePitchY:
    .byte $B0, $A8, $A0, $98, $90, $88, $80, $78  ; Y positions for pitches

; Variables
MusicTimer: .byte $00
CurrentNote: .byte $00
NoteActive: .byte $00
SequenceIndex: .byte $00

; Sprite data
SpriteData: .byte $FF, $10, $00, $30
```

## Rhythm-Based Animation

Create animations that follow musical rhythm and tempo:

```assembly
; Rhythm animation system
RhythmPatterns:
    ; Different animation patterns for different rhythms
    ; Pattern 0: Simple pulse (4 frames)
    .byte $00, $01, $02, $01
    ; Pattern 1: Bounce (8 frames)
    .byte $00, $01, $03, $05, $06, $05, $03, $01
    ; Pattern 2: Spin (16 frames)
    .byte $00, $01, $02, $03, $04, $05, $06, $07
    .byte $08, $09, $0A, $0B, $0C, $0D, $0E, $0F

UpdateRhythmAnimation:
    ; Get current beat position
    LDA BeatCounter
    AND BeatMask         ; Mask to pattern length
    
    ; Get animation frame from pattern
    LDX CurrentPattern
    CPX #$00
    BEQ Pattern0
    CPX #$01
    BEQ Pattern1
    ; Pattern 2
    CLC
    ADC #$10             ; Pattern 2 offset
    JMP GetPatternFrame
    
Pattern1:
    CLC
    ADC #$04             ; Pattern 1 offset
    JMP GetPatternFrame
    
Pattern0:
    ; Pattern 0 offset is 0
    
GetPatternFrame:
    TAX
    LDA RhythmPatterns,X
    STA AnimationFrame
    
    ; Apply animation to sprites
    JSR ApplyRhythmToSprites
    RTS

ApplyRhythmToSprites:
    ; Apply current animation frame to sprites
    LDA AnimationFrame
    
    ; Sprite 0 - Scale effect
    ASL                  ; * 2
    CLC
    ADC #$78             ; Base Y position
    STA SpriteData+0
    
    ; Sprite 1 - Rotation effect (change tile)
    LDA AnimationFrame
    CLC
    ADC #$20             ; Base tile + animation offset
    STA SpriteData+5
    
    ; Sprite 2 - Color cycling (change palette)
    LDA AnimationFrame
    LSR
    LSR                  ; Divide by 4
    STA SpriteData+10    ; Palette cycles
    
    RTS

; Variables for rhythm animation
BeatCounter: .byte $00
BeatMask: .byte $03      ; For 4-beat pattern
CurrentPattern: .byte $00
AnimationFrame: .byte $00
```

## Interactive Audio-Visual Feedback

Create systems where player input triggers synchronized audio-visual responses:

```assembly
; Interactive feedback system
ProcessInputFeedback:
    JSR ReadController
    STA ButtonState
    
    ; Detect new button presses
    EOR PreviousButtons  ; XOR to find changes
    AND ButtonState      ; AND with current to get new presses
    STA NewPresses
    
    ; Save current for next frame
    LDA ButtonState
    STA PreviousButtons
    
    ; Process each button
    LDA NewPresses
    AND #%10000000       ; A button
    BEQ CheckBButton
    JSR TriggerAResponse
    
CheckBButton:
    LDA NewPresses
    AND #%01000000       ; B button
    BEQ CheckDirections
    JSR TriggerBResponse
    
CheckDirections:
    LDA NewPresses
    AND #%00001111       ; Any direction
    BEQ InputFeedbackDone
    JSR TriggerDirectionResponse
    
InputFeedbackDone:
    RTS

TriggerAResponse:
    ; High-pitched tone with bright visual
    LDA #$90
    STA $4002            ; High frequency
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Bright sprite effect
    LDA #$70             ; High on screen
    STA SpriteData+0
    LDA #$21             ; Bright tile
    STA SpriteData+1
    LDA #%00000000       ; Bright palette
    STA SpriteData+2
    LDA #$80             ; Center X
    STA SpriteData+3
    
    ; Set effect duration
    LDA #$10
    STA EffectTimer
    RTS

TriggerBResponse:
    ; Low-pitched tone with warm visual
    LDA #$C0
    STA $4002            ; Low frequency
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Warm sprite effect
    LDA #$A0             ; Lower on screen
    STA SpriteData+4
    LDA #$22             ; Warm tile
    STA SpriteData+5
    LDA #%00000001       ; Warm palette
    STA SpriteData+6
    LDA #$80             ; Center X
    STA SpriteData+7
    
    LDA #$10
    STA EffectTimer
    RTS

TriggerDirectionResponse:
    ; Direction-based tone and visual
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ CheckDown
    
    ; Up = highest tone, top sprite
    LDA #$80
    STA $4002
    LDA #$60
    STA SpriteData+8
    JMP SetDirectionCommon
    
CheckDown:
    LDA NewPresses
    AND #%00000100       ; Down
    BEQ CheckLeft
    
    ; Down = lowest tone, bottom sprite
    LDA #$F0
    STA $4002
    LDA #$C0
    STA SpriteData+8
    JMP SetDirectionCommon
    
CheckLeft:
    LDA NewPresses
    AND #%00000010       ; Left
    BEQ CheckRight
    
    ; Left = medium-low tone, left sprite
    LDA #$D0
    STA $4002
    LDA #$80
    STA SpriteData+8
    LDA #$40
    STA SpriteData+11
    JMP SetDirectionCommon
    
CheckRight:
    ; Right = medium-high tone, right sprite
    LDA #$A0
    STA $4002
    LDA #$80
    STA SpriteData+8
    LDA #$C0
    STA SpriteData+11
    
SetDirectionCommon:
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    LDA #$23             ; Direction tile
    STA SpriteData+9
    LDA #%00000010       ; Direction palette
    STA SpriteData+10
    
    LDA #$10
    STA EffectTimer
    RTS

; Variables for interactive feedback
ButtonState: .byte $00
PreviousButtons: .byte $00
NewPresses: .byte $00
EffectTimer: .byte $00
```

## Practice Exercise

Create a complete audio-visual synchronization system that demonstrates all concepts:

1. Implement frame-based timing for synchronized events
2. Create beat-synchronized visual effects with expanding sprites
3. Add musical note visualization with pitch-based positioning
4. Include rhythm-based animations that follow tempo
5. Build interactive feedback that responds to input with coordinated audio-visual responses

**Practice: Complete Audio-Visual Synchronization:**

```assembly
; Complete audio-visual synchronization demonstration
Main:
    JSR InitAudioVisual
    
GameLoop:
    JSR UpdateTimers
    JSR ProcessInput
    JSR UpdateMusic
    JSR UpdateVisuals
    JSR UpdateEffects
    JMP GameLoop

InitAudioVisual:
    ; Initialize all systems
    LDA #$00
    STA FrameCount
    STA BeatCount
    STA MusicIndex
    STA EffectActive
    STA InputEffect
    
    ; Enable audio
    LDA #%00000001
    STA $4015
    
    ; Initialize sprites
    JSR InitAllSprites
    RTS

InitAllSprites:
    ; Hide all sprites initially
    LDX #$00
    LDA #$FF
HideLoop:
    STA SpriteData,X
    INX
    INX
    INX
    INX
    CPX #$20             ; 8 sprites
    BNE HideLoop
    RTS

UpdateTimers:
    INC FrameCount
    
    ; Beat timer (120 BPM = 30 frames per beat at 60 FPS)
    LDA FrameCount
    AND #$1F             ; 32 frame cycle
    BNE TimersDone
    
    ; Beat detected
    INC BeatCount
    JSR TriggerBeat
    
TimersDone:
    RTS

TriggerBeat:
    ; Start beat visualization
    LDA #$10             ; 16 frame beat effect
    STA BeatEffect
    
    ; Play beat sound
    LDA #$A0
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Trigger visual beat
    JSR StartBeatVisual
    RTS

StartBeatVisual:
    ; Create expanding circle effect
    LDA #$80             ; Center position
    STA BeatCenterX
    STA BeatCenterY
    
    ; Initialize beat sprites (sprites 0-3)
    LDX #$00
BeatSpriteLoop:
    LDA BeatCenterY
    STA SpriteData+0,X   ; Y position
    LDA #$30             ; Beat tile
    STA SpriteData+1,X   ; Tile
    LDA #%00000000       ; Bright palette
    STA SpriteData+2,X   ; Attributes
    LDA BeatCenterX
    STA SpriteData+3,X   ; X position
    
    TXA
    CLC
    ADC #$04
    TAX
    CPX #$10             ; 4 sprites
    BNE BeatSpriteLoop
    
    RTS

ProcessInput:
    JSR ReadController
    JSR DetectNewPresses
    
    ; Process input for interactive feedback
    LDA NewPresses
    AND #%10000000       ; A button
    BEQ CheckOtherInput
    JSR TriggerInputEffect
    
CheckOtherInput:
    LDA NewPresses
    AND #%00001111       ; Any direction
    BEQ InputDone
    JSR TriggerDirectionEffect
    
InputDone:
    RTS

TriggerInputEffect:
    ; High-pitched interactive sound
    LDA #$70
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Create input sprite (sprite 4)
    LDA #$60
    STA SpriteData+16    ; Y position
    LDA #$25             ; Input tile
    STA SpriteData+17    ; Tile
    LDA #%00000001       ; Input palette
    STA SpriteData+18    ; Attributes
    LDA #$80
    STA SpriteData+19    ; X position
    
    LDA #$18             ; 24 frame effect
    STA InputEffect
    RTS

TriggerDirectionEffect:
    ; Medium tone for directions
    LDA #$B0
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Direction sprite (sprite 5)
    LDA #$A0
    STA SpriteData+20    ; Y position
    LDA #$26             ; Direction tile
    STA SpriteData+21    ; Tile
    LDA #%00000010       ; Direction palette
    STA SpriteData+22    ; Attributes
    LDA #$80
    STA SpriteData+23    ; X position
    
    LDA #$18
    STA DirectionEffect
    RTS

UpdateMusic:
    ; Simple melody sequence
    LDA FrameCount
    AND #$3F             ; 64 frame cycle
    BNE MusicDone
    
    ; Play next note in sequence
    LDX MusicIndex
    LDA MelodySequence,X
    CMP #$FF             ; End marker?
    BEQ ResetMelody
    
    JSR PlayMelodyNote
    INC MusicIndex
    JMP MusicDone
    
ResetMelody:
    LDA #$00
    STA MusicIndex
    
MusicDone:
    RTS

PlayMelodyNote:
    ; Play note with visual
    STA CurrentNote
    
    ; Set audio frequency
    LDX CurrentNote
    LDA NoteFreqs,X
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Create note sprite (sprite 6)
    LDA NotePosY,X       ; Y based on pitch
    STA SpriteData+24
    LDA #$20             ; Note tile
    CLC
    ADC CurrentNote      ; Different tile per note
    STA SpriteData+25
    LDA #%00000011       ; Note palette
    STA SpriteData+26
    LDA FrameCount
    CLC
    ADC #$40             ; X based on time
    STA SpriteData+27
    
    LDA #$20             ; 32 frame note
    STA NoteEffect
    RTS

UpdateVisuals:
    ; Update beat effect
    LDA BeatEffect
    BEQ CheckNoteEffect
    
    DEC BeatEffect
    JSR UpdateBeatSprites
    
CheckNoteEffect:
    ; Update note effect
    LDA NoteEffect
    BEQ CheckInputEffect
    
    DEC NoteEffect
    JSR UpdateNoteSprite
    
CheckInputEffect:
    ; Update input effect
    LDA InputEffect
    BEQ CheckDirectionEffect
    
    DEC InputEffect
    JSR UpdateInputSprite
    
CheckDirectionEffect:
    ; Update direction effect
    LDA DirectionEffect
    BEQ VisualsDone
    
    DEC DirectionEffect
    JSR UpdateDirectionSprite
    
VisualsDone:
    RTS

UpdateBeatSprites:
    ; Create expanding beat effect
    LDA #$10
    SEC
    SBC BeatEffect       ; Calculate expansion
    STA Expansion
    
    ; Update beat sprites in formation
    ; Sprite 0 - Top
    LDA BeatCenterY
    SEC
    SBC Expansion
    STA SpriteData+0
    
    ; Sprite 1 - Right  
    LDA BeatCenterX
    CLC
    ADC Expansion
    STA SpriteData+7
    
    ; Sprite 2 - Bottom
    LDA BeatCenterY
    CLC
    ADC Expansion
    STA SpriteData+8
    
    ; Sprite 3 - Left
    LDA BeatCenterX
    SEC
    SBC Expansion
    STA SpriteData+15
    
    ; Hide when done
    LDA BeatEffect
    BNE BeatSpriteDone
    LDX #$00
HideBeatLoop:
    LDA #$FF
    STA SpriteData,X
    TXA
    CLC
    ADC #$04
    TAX
    CPX #$10
    BNE HideBeatLoop
    
BeatSpriteDone:
    RTS

UpdateNoteSprite:
    ; Animate note sprite
    LDA NoteEffect
    CMP #$10             ; First half
    BCS NoteFade
    
    ; Fade out
    LDA SpriteData+26    ; Current attributes
    ORA #%10000000       ; Set fade bit
    STA SpriteData+26
    
NoteFade:
    ; Move note across screen
    LDA SpriteData+27    ; Current X
    CLC
    ADC #$01
    STA SpriteData+27
    
    ; Hide when done
    LDA NoteEffect
    BNE NoteSpriteUpdated
    LDA #$FF
    STA SpriteData+24
    
NoteSpriteUpdated:
    RTS

UpdateInputSprite:
    ; Pulse input sprite
    LDA InputEffect
    AND #$03             ; 4-frame pulse
    CMP #$02
    BCC InputPulseUp
    
    LDA SpriteData+16    ; Y position
    CLC
    ADC #$02
    STA SpriteData+16
    JMP InputSpriteCheck
    
InputPulseUp:
    LDA SpriteData+16
    SEC
    SBC #$02
    STA SpriteData+16
    
InputSpriteCheck:
    ; Hide when done
    LDA InputEffect
    BNE InputSpriteUpdated
    LDA #$FF
    STA SpriteData+16
    
InputSpriteUpdated:
    RTS

UpdateDirectionSprite:
    ; Rotate direction sprite
    LDA DirectionEffect
    LSR
    CLC
    ADC #$26             ; Base direction tile
    STA SpriteData+21
    
    ; Hide when done
    LDA DirectionEffect
    BNE DirectionSpriteUpdated
    LDA #$FF
    STA SpriteData+20
    
DirectionSpriteUpdated:
    RTS

UpdateEffects:
    ; Update all active effects
    LDA BeatEffect
    ORA NoteEffect
    ORA InputEffect
    ORA DirectionEffect
    STA EffectActive
    
    ; Silence audio when no effects
    LDA EffectActive
    BNE EffectsDone
    LDA #$00
    STA $4000
    
EffectsDone:
    RTS

DetectNewPresses:
    LDA CurrentButtons
    STA PrevButtons
    JSR ReadController
    STA CurrentButtons
    
    EOR PrevButtons      ; Find changes
    AND CurrentButtons   ; Mask with current
    STA NewPresses
    RTS

ReadController:
    ; Simulate input pattern for demo
    LDA FrameCount
    AND #$7F             ; 128 frame cycle
    CMP #$20
    BEQ SimA
    CMP #$40
    BEQ SimUp
    CMP #$60
    BEQ SimA
    LDA #$FF             ; No input
    RTS
SimA:
    LDA #%01111111       ; A pressed
    RTS
SimUp:
    LDA #%11110111       ; Up pressed
    RTS

; Data tables
MelodySequence:
    .byte $00, $02, $04, $02, $00, $FF

NoteFreqs:
    .byte $FE, $E5, $CE, $BA, $A8

NotePosY:
    .byte $B0, $A0, $90, $80, $70

; Variables
FrameCount: .byte $00
BeatCount: .byte $00
MusicIndex: .byte $00
CurrentNote: .byte $00
BeatEffect: .byte $00
NoteEffect: .byte $00
InputEffect: .byte $00
DirectionEffect: .byte $00
EffectActive: .byte $00
BeatCenterX: .byte $80
BeatCenterY: .byte $80
Expansion: .byte $00
CurrentButtons: .byte $FF
PrevButtons: .byte $FF
NewPresses: .byte $00

; Sprite data (8 sprites)
SpriteData:
    .byte $FF, $30, $00, $80  ; Beat sprite 0
    .byte $FF, $30, $00, $80  ; Beat sprite 1
    .byte $FF, $30, $00, $80  ; Beat sprite 2
    .byte $FF, $30, $00, $80  ; Beat sprite 3
    .byte $FF, $25, $01, $80  ; Input sprite 4
    .byte $FF, $26, $02, $80  ; Direction sprite 5
    .byte $FF, $20, $03, $80  ; Note sprite 6
    .byte $FF, $FF, $FF, $FF  ; Unused sprite 7
```

## What You've Learned

In this essential lesson, you've mastered:

- Frame-based timing for precise audio-visual synchronization
- Beat-synchronized visual effects that pulse with music
- Musical note visualization with pitch-based positioning
- Rhythm-based animations that follow musical tempo
- Interactive feedback systems that coordinate sight and sound
- Foundation systems for creating immersive multimedia experiences

## Looking Ahead

In the next lesson, you'll learn to manage complex game states and create systems that can handle multiple gameplay modes, setting the stage for building complete interactive applications!

## Fun Fact

The audio-visual synchronization techniques you've learned were essential to many classic NES games. Games like Dance Dance Revolution (later ported to NES) and rhythm action games depended on frame-perfect timing between audio and visual cues. The coordination between sprites, sound, and player input you've mastered forms the foundation of what made games feel responsive and engaging - skills that are still crucial in modern game development where frame rates and input latency are paramount to player experience!