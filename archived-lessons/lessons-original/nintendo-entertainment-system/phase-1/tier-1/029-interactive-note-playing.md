---
title: "Interactive Note Playing"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 29
description: "Add real-time interactive note playing to Sprite Symphony! Learn to create responsive musical interfaces where player input immediately generates coordinated audio and visual feedback."
learning_objectives:
  - "Implement real-time musical note triggering from controller input"
  - "Create responsive audio-visual feedback for musical interaction"
  - "Build polyphonic note management for multiple simultaneous sounds"
  - "Design intuitive musical interfaces and control schemes"
  - "Enhance Sprite Symphony with expressive musical capabilities"
concepts:
  - "Real-time audio triggering and management"
  - "Musical interface design and interaction"
  - "Polyphonic audio programming on NES"
  - "Expressive musical control systems"
  - "Interactive multimedia application development"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 29
---

# Lesson 29: Interactive Note Playing

Transform Sprite Symphony into a responsive musical instrument! This lesson teaches you how to create immediate, expressive musical interactions where every button press generates beautiful coordinated sound and visuals.

## Real-Time Musical Triggering

Create systems that respond instantly to player input with musical output:

```assembly
; Real-time musical triggering system
MAX_SIMULTANEOUS_NOTES = $04    ; 4 notes can play at once

; Note trigger system
NoteTriggerSystem:
    .struct
        ActiveChannels: .byte           ; Bitmask of active audio channels
        ChannelNotes: .byte * 4         ; Note index for each channel
        ChannelTimers: .byte * 4        ; Remaining time for each channel
        ChannelVolumes: .byte * 4       ; Current volume for each channel
        TriggerQueue: .byte * 8         ; Queue of notes to trigger
        QueueHead: .byte                ; Queue head pointer
        QueueTail: .byte                ; Queue tail pointer
    .endstruct

ProcessRealTimeInput:
    ; Process input for immediate musical response
    JSR ReadControllerState
    JSR DetectNewPresses
    JSR MapInputToNotes
    JSR TriggerMappedNotes
    JSR UpdateActiveNotes
    RTS

MapInputToNotes:
    ; Map controller input to musical notes
    LDA NewPresses
    BEQ NoNewNotes
    
    ; Check each button for note mapping
    LDX #$07                ; 8 possible inputs
    
CheckInputLoop:
    LDA NewPresses
    AND InputBitMasks,X
    BEQ NextInputCheck
    
    ; This input is pressed - get corresponding note
    LDA InputToNoteMap,X
    CMP #$FF                ; Valid note?
    BEQ NextInputCheck
    
    ; Queue note for triggering
    JSR QueueNoteForTrigger
    
NextInputCheck:
    DEX
    BPL CheckInputLoop
    
NoNewNotes:
    RTS

QueueNoteForTrigger:
    ; Queue note A for triggering
    LDX QueueTail
    STA TriggerQueue,X
    
    ; Advance queue tail
    INX
    TXA
    AND #$07                ; Wrap at 8 entries
    STA QueueTail
    
    ; Check for queue overflow
    CMP QueueHead
    BNE QueueNotFull
    
    ; Queue full - advance head to drop oldest
    LDA QueueHead
    CLC
    ADC #$01
    AND #$07
    STA QueueHead
    
QueueNotFull:
    RTS

TriggerMappedNotes:
    ; Trigger all queued notes
    LDA QueueHead
    CMP QueueTail
    BEQ NoNotesToTrigger    ; Queue empty
    
ProcessQueueLoop:
    ; Get note from queue
    LDX QueueHead
    LDA TriggerQueue,X
    
    ; Trigger this note
    JSR TriggerMusicalNote
    
    ; Advance queue head
    INX
    TXA
    AND #$07
    STA QueueHead
    
    ; Check if more notes in queue
    CMP QueueTail
    BNE ProcessQueueLoop
    
NoNotesToTrigger:
    RTS

TriggerMusicalNote:
    ; Trigger note A immediately
    ; Find available audio channel
    JSR FindAvailableChannel
    CPX #$FF
    BEQ NoChannelAvailable
    
    ; Set up audio channel
    STA ChannelNotes,X
    LDA #$40                ; Default duration
    STA ChannelTimers,X
    LDA #$0F                ; Full volume
    STA ChannelVolumes,X
    
    ; Configure NES audio registers
    JSR ConfigureAudioChannel
    
    ; Mark channel as active
    LDA ChannelBitMasks,X
    ORA ActiveChannels
    STA ActiveChannels
    
    ; Create visual feedback
    JSR CreateNoteVisual
    
NoChannelAvailable:
    RTS

; Input mapping data
InputBitMasks:
    .byte %10000000, %01000000, %00100000, %00010000    ; A, B, Select, Start
    .byte %00001000, %00000100, %00000010, %00000001    ; Up, Down, Left, Right

InputToNoteMap:
    ; Map buttons to musical notes (C major scale)
    .byte $00, $02, $04, $05    ; A=C, B=E, Select=G, Start=A
    .byte $07, $05, $02, $04    ; Up=C(high), Down=A, Left=E, Right=G

ChannelBitMasks:
    .byte %00000001, %00000010, %00000100, %00001000

; System variables
ActiveChannels: .byte $00
QueueHead: .byte $00
QueueTail: .byte $00
```

**Real-Time Musical Triggering:**

```assembly
; Real-time musical note triggering system
Main:
    JSR InitMusicSystem
    
GameLoop:
    JSR ProcessInput
    JSR UpdateAudio
    JSR UpdateVisuals
    JMP GameLoop

InitMusicSystem:
    ; Initialize musical system
    LDA #%00000001       ; Enable pulse 1
    STA $4015
    
    ; Clear system state
    LDA #$00
    STA ActiveNotes
    STA InputState
    STA PrevInput
    STA QueueHead
    STA QueueTail
    
    ; Initialize channels
    LDX #$03
InitChannelLoop:
    LDA #$00
    STA NoteTimers,X
    STA NoteVolumes,X
    LDA #$FF
    STA ChannelNotes,X
    DEX
    BPL InitChannelLoop
    
    RTS

ProcessInput:
    ; Process real-time input
    LDA InputState
    STA PrevInput
    JSR ReadController
    STA InputState
    
    ; Find new presses
    EOR PrevInput
    AND InputState
    STA NewPresses
    
    ; Process new presses
    JSR ProcessNewPresses
    RTS

ProcessNewPresses:
    ; Process each new button press
    LDA NewPresses
    BEQ NewPressesDone
    
    ; Check each button
    LDX #$07
CheckButtonLoop:
    LDA NewPresses
    AND ButtonMasks,X
    BEQ NextButton
    
    ; This button was pressed
    LDA ButtonToNote,X
    CMP #$FF
    BEQ NextButton
    
    ; Valid note - trigger it
    JSR TriggerNote
    
NextButton:
    DEX
    BPL CheckButtonLoop
    
NewPressesDone:
    RTS

TriggerNote:
    ; Trigger note A
    ; Find available channel
    LDX #$03
FindChannelLoop:
    LDA NoteTimers,X
    BEQ FoundChannel     ; Channel available
    DEX
    BPL FindChannelLoop
    
    ; No available channels - use channel 0
    LDX #$00
    
FoundChannel:
    ; Set up note on channel X
    STA ChannelNotes,X
    LDA #$30             ; Note duration
    STA NoteTimers,X
    LDA #$0F             ; Full volume
    STA NoteVolumes,X
    
    ; Configure audio
    JSR SetupAudioForNote
    
    ; Create visual
    JSR CreateVisualNote
    
    ; Mark note as active
    LDA NoteBitMask,X
    ORA ActiveNotes
    STA ActiveNotes
    
    RTS

SetupAudioForNote:
    ; Set up audio for note A on channel X
    ; Get frequency for note
    TAY
    LDA NoteFreqLow,Y
    STA $4002            ; Frequency low
    LDA NoteFreqHigh,Y
    STA $4003            ; Frequency high
    
    ; Set envelope
    LDA #%10111111       ; Duty, envelope
    STA $4000
    
    RTS

CreateVisualNote:
    ; Create visual for note A on channel X
    ; Calculate sprite position
    TXA
    ASL
    ASL                  ; * 4 bytes per sprite
    TAY
    
    ; Set sprite data
    LDA NotePosY,A       ; Y based on note pitch
    STA SpriteData,Y
    LDA NoteTiles,A      ; Tile based on note
    STA SpriteData+1,Y
    LDA #%00000001       ; Note palette
    STA SpriteData+2,Y
    
    ; X position based on channel
    TXA
    ASL
    ASL
    ASL                  ; * 8
    CLC
    ADC #$60             ; Base X
    STA SpriteData+3,Y
    
    RTS

UpdateAudio:
    ; Update all active audio channels
    LDX #$03
UpdateAudioLoop:
    LDA NoteTimers,X
    BEQ NextAudioChannel
    
    ; Update this channel
    DEC NoteTimers,X
    LDA NoteTimers,X
    BNE NextAudioChannel
    
    ; Note finished
    LDA NoteBitMask,X
    EOR #$FF
    AND ActiveNotes
    STA ActiveNotes
    
    ; Hide visual
    TXA
    ASL
    ASL
    TAY
    LDA #$FF
    STA SpriteData,Y
    
NextAudioChannel:
    DEX
    BPL UpdateAudioLoop
    
    ; Check if any notes still active
    LDA ActiveNotes
    BNE AudioUpdateDone
    
    ; No notes - silence audio
    LDA #$00
    STA $4000
    
AudioUpdateDone:
    RTS

UpdateVisuals:
    ; Update visual effects
    INC AnimCounter
    JSR AnimateActiveNotes
    RTS

AnimateActiveNotes:
    ; Animate sprites for active notes
    LDX #$03
AnimateLoop:
    LDA NoteTimers,X
    BEQ NextAnimate
    
    ; Animate this note
    TXA
    ASL
    ASL
    TAY
    
    ; Pulsing effect
    LDA AnimCounter
    AND #$07
    CMP #$04
    BCC PulseUp
    
    LDA ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    CLC
    ADC #$02
    JMP StorePulseY
    
PulseUp:
    LDA ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    SEC
    SBC #$02
    
StorePulseY:
    STA SpriteData,Y
    
NextAnimate:
    DEX
    BPL AnimateLoop
    RTS

ReadController:
    ; Simulate input for demonstration
    LDA AnimCounter
    AND #$1F             ; 32-frame cycle
    CMP #$08
    BEQ SimulateA
    CMP #$10
    BEQ SimulateUp
    CMP #$18
    BEQ SimulateB
    LDA #$FF             ; No input
    RTS
    
SimulateA:
    LDA #%01111111       ; A pressed
    RTS
    
SimulateUp:
    LDA #%11110111       ; Up pressed
    RTS
    
SimulateB:
    LDA #%10111111       ; B pressed
    RTS

; Data tables
ButtonMasks:
    .byte %10000000, %01000000, %00100000, %00010000
    .byte %00001000, %00000100, %00000010, %00000001

ButtonToNote:
    .byte $00, $02, $04, $05, $07, $05, $02, $04

NoteBitMask:
    .byte %00000001, %00000010, %00000100, %00001000

NoteFreqLow:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

NoteFreqHigh:
    .byte $08, $08, $08, $08, $08, $08, $08, $08

NotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

NoteTiles:
    .byte $10, $11, $12, $13, $14, $15, $16, $17

; Variables
ActiveNotes: .byte $00
InputState: .byte $FF
PrevInput: .byte $FF
NewPresses: .byte $00
QueueHead: .byte $00
QueueTail: .byte $00
AnimCounter: .byte $00

; Channel data
ChannelNotes: .byte $FF, $FF, $FF, $FF
NoteTimers: .byte $00, $00, $00, $00
NoteVolumes: .byte $00, $00, $00, $00

; Sprite data
SpriteData:
    .byte $FF, $10, $01, $60  ; Channel 0 sprite
    .byte $FF, $11, $01, $68  ; Channel 1 sprite
    .byte $FF, $12, $01, $70  ; Channel 2 sprite
    .byte $FF, $13, $01, $78  ; Channel 3 sprite
```

## Polyphonic Note Management

Create systems that can handle multiple simultaneous notes with proper channel management:

```assembly
; Advanced polyphonic system for NES limitations
NES_AUDIO_CHANNELS = $04    ; Pulse1, Pulse2, Triangle, Noise

; Channel management system
ChannelManager:
    .struct
        ChannelStates: .byte * 4        ; Current state of each channel
        ChannelPriorities: .byte * 4    ; Priority levels for channel allocation
        ChannelAges: .byte * 4          ; How long each note has been playing
        NextChannelIndex: .byte         ; Round-robin channel allocation
    .endstruct

; Channel states
CHANNEL_FREE = $00
CHANNEL_ATTACK = $01
CHANNEL_SUSTAIN = $02
CHANNEL_RELEASE = $03

AllocateAudioChannel:
    ; Allocate best available channel for new note
    ; Returns channel index in X, or $FF if none available
    
    ; First, look for free channels
    LDX #$00
    
FindFreeLoop:
    LDA ChannelStates,X
    CMP #CHANNEL_FREE
    BEQ FoundFreeChannel
    INX
    CPX #NES_AUDIO_CHANNELS
    BNE FindFreeLoop
    
    ; No free channels - find oldest, lowest priority
    JSR FindReplaceableChannel
    RTS
    
FoundFreeChannel:
    ; X contains free channel index
    RTS

FindReplaceableChannel:
    ; Find channel to replace when all are busy
    LDX #$00                ; Start with channel 0
    LDA ChannelAges
    STA OldestAge
    
    LDY #$01                ; Check remaining channels
    
CompareChannelsLoop:
    LDA ChannelAges,Y
    CMP OldestAge
    BCC CheckNextChannel    ; This channel is newer
    
    ; This channel is older
    STA OldestAge
    TYA
    TAX                     ; X = oldest channel index
    
CheckNextChannel:
    INY
    CPY #NES_AUDIO_CHANNELS
    BNE CompareChannelsLoop
    
    ; X contains channel to replace
    RTS

ConfigureChannelForNote:
    ; Configure channel X for note A
    ; Save note index
    STA ChannelNotes,X
    
    ; Set channel state
    LDA #CHANNEL_ATTACK
    STA ChannelStates,X
    
    ; Reset age counter
    LDA #$00
    STA ChannelAges,X
    
    ; Set priority (higher notes get higher priority)
    LDA ChannelNotes,X
    STA ChannelPriorities,X
    
    ; Configure NES audio registers based on channel
    JSR ConfigureNESChannel
    
    RTS

ConfigureNESChannel:
    ; Configure NES audio registers for channel X, note A
    CPX #$00
    BEQ ConfigurePulse1
    CPX #$01
    BEQ ConfigurePulse2
    CPX #$02
    BEQ ConfigureTriangle
    ; Channel 3 = Noise
    JSR ConfigureNoise
    RTS

ConfigurePulse1:
    ; Configure pulse channel 1
    LDA #%10111111          ; Duty cycle, envelope
    STA $4000
    LDA #%00000000          ; No sweep
    STA $4001
    
    LDA ChannelNotes,X
    TAY
    LDA NoteFrequencies,Y
    STA $4002               ; Frequency low
    LDA NoteFreqHigh,Y
    STA $4003               ; Frequency high, length counter
    RTS

ConfigurePulse2:
    ; Configure pulse channel 2
    LDA #%10111111          ; Duty cycle, envelope
    STA $4004
    LDA #%00000000          ; No sweep
    STA $4005
    
    LDA ChannelNotes,X
    TAY
    LDA NoteFrequencies,Y
    STA $4006               ; Frequency low
    LDA NoteFreqHigh,Y
    STA $4007               ; Frequency high, length counter
    RTS

ConfigureTriangle:
    ; Configure triangle channel
    LDA #%11111111          ; Linear counter
    STA $4008
    
    LDA ChannelNotes,X
    TAY
    LDA NoteFrequencies,Y
    STA $400A               ; Frequency low
    LDA NoteFreqHigh,Y
    STA $400B               ; Frequency high, length counter
    RTS

ConfigureNoise:
    ; Configure noise channel for percussion
    LDA #%00111111          ; Envelope
    STA $400C
    LDA #%00000000          ; Mode and period
    STA $400E
    LDA #%00001000          ; Length counter
    STA $400F
    RTS

UpdatePolyphonicSystem:
    ; Update all active channels
    LDX #$00
    
UpdateChannelLoop:
    LDA ChannelStates,X
    CMP #CHANNEL_FREE
    BEQ NextUpdateChannel
    
    ; Update this active channel
    JSR UpdateChannelState
    JSR UpdateChannelAge
    JSR UpdateChannelEnvelope
    
NextUpdateChannel:
    INX
    CPX #NES_AUDIO_CHANNELS
    BNE UpdateChannelLoop
    
    RTS

UpdateChannelState:
    ; Update state for channel X
    LDA ChannelStates,X
    CMP #CHANNEL_ATTACK
    BEQ UpdateAttackPhase
    CMP #CHANNEL_SUSTAIN
    BEQ UpdateSustainPhase
    CMP #CHANNEL_RELEASE
    BEQ UpdateReleasePhase
    RTS

UpdateAttackPhase:
    ; Update attack phase
    INC ChannelAttackTimers,X
    LDA ChannelAttackTimers,X
    CMP #$08                ; 8 frame attack
    BCC AttackPhaseDone
    
    ; Move to sustain phase
    LDA #CHANNEL_SUSTAIN
    STA ChannelStates,X
    LDA #$00
    STA ChannelSustainTimers,X
    
AttackPhaseDone:
    RTS

UpdateSustainPhase:
    ; Update sustain phase
    INC ChannelSustainTimers,X
    LDA ChannelSustainTimers,X
    CMP #$20                ; 32 frame sustain
    BCC SustainPhaseDone
    
    ; Move to release phase
    LDA #CHANNEL_RELEASE
    STA ChannelStates,X
    LDA #$00
    STA ChannelReleaseTimers,X
    
SustainPhaseDone:
    RTS

UpdateReleasePhase:
    ; Update release phase
    INC ChannelReleaseTimers,X
    LDA ChannelReleaseTimers,X
    CMP #$10                ; 16 frame release
    BCC ReleasePhaseDone
    
    ; Note finished - free channel
    LDA #CHANNEL_FREE
    STA ChannelStates,X
    JSR FreeChannelVisual
    
ReleasePhaseDone:
    RTS

; Channel management variables
ChannelStates: .byte CHANNEL_FREE, CHANNEL_FREE, CHANNEL_FREE, CHANNEL_FREE
ChannelPriorities: .byte $00, $00, $00, $00
ChannelAges: .byte $00, $00, $00, $00
ChannelAttackTimers: .byte $00, $00, $00, $00
ChannelSustainTimers: .byte $00, $00, $00, $00
ChannelReleaseTimers: .byte $00, $00, $00, $00
NextChannelIndex: .byte $00
OldestAge: .byte $00
```

## Expressive Musical Controls

Create control schemes that allow for musical expression and creativity:

```assembly
; Expressive musical control system
ExpressionSystem:
    .struct
        VelocitySensitivity: .byte      ; How sensitive to input timing
        ModulationDepth: .byte          ; Amount of vibrato/tremolo
        BendRange: .byte                ; Pitch bend range
        ScaleMode: .byte                ; Current musical scale
        OctaveShift: .byte              ; Octave transposition
    .endstruct

; Musical scales
SCALE_MAJOR = $00
SCALE_MINOR = $01
SCALE_PENTATONIC = $02
SCALE_CHROMATIC = $03

ProcessExpressiveInput:
    ; Process input for musical expression
    JSR CalculateVelocity
    JSR ProcessPitchBend
    JSR ProcessModulation
    JSR ProcessScaleChange
    JSR ProcessOctaveShift
    RTS

CalculateVelocity:
    ; Calculate note velocity based on input timing
    LDA ButtonRepeatTimer
    CMP #$04                ; Quick press = forte
    BCC ForteVelocity
    CMP #$08                ; Medium press = mezzo
    BCC MezzoVelocity
    ; Slow press = piano
    LDA #$04
    JMP StoreVelocity
    
MezzoVelocity:
    LDA #$08
    JMP StoreVelocity
    
ForteVelocity:
    LDA #$0F
    
StoreVelocity:
    STA CurrentVelocity
    RTS

ProcessPitchBend:
    ; Use shoulder buttons for pitch bend
    LDA CurrentInput
    AND #%00100000          ; Select button held?
    BEQ CheckBendDown
    
    ; Bend up
    LDA CurrentBend
    CMP #$10                ; Max bend up
    BCS BendDone
    INC CurrentBend
    JMP ApplyBend
    
CheckBendDown:
    LDA CurrentInput
    AND #%00010000          ; Start button held?
    BEQ BendRelease
    
    ; Bend down
    LDA CurrentBend
    CMP #$F0                ; Max bend down
    BCC BendDone
    DEC CurrentBend
    JMP ApplyBend
    
BendRelease:
    ; Return to center
    LDA CurrentBend
    CMP #$00
    BEQ BendDone
    BMI BendUpToCenter
    
    ; Bend down to center
    DEC CurrentBend
    JMP ApplyBend
    
BendUpToCenter:
    INC CurrentBend
    
ApplyBend:
    ; Apply bend to all active notes
    JSR ApplyBendToChannels
    
BendDone:
    RTS

ApplyBendToChannels:
    ; Apply current bend to all active channels
    LDX #$00
    
ApplyBendLoop:
    LDA ChannelStates,X
    CMP #CHANNEL_FREE
    BEQ NextBendChannel
    
    ; Apply bend to this channel
    JSR ApplyBendToChannel
    
NextBendChannel:
    INX
    CPX #NES_AUDIO_CHANNELS
    BNE ApplyBendLoop
    
    RTS

ApplyBendToChannel:
    ; Apply bend to channel X
    LDA ChannelNotes,X
    TAY
    LDA NoteFrequencies,Y
    CLC
    ADC CurrentBend         ; Add bend offset
    
    ; Store bent frequency based on channel
    CPX #$00
    BEQ BendPulse1
    CPX #$01
    BEQ BendPulse2
    CPX #$02
    BEQ BendTriangle
    RTS                     ; Can't bend noise
    
BendPulse1:
    STA $4002
    RTS
    
BendPulse2:
    STA $4006
    RTS
    
BendTriangle:
    STA $400A
    RTS

ProcessScaleChange:
    ; Change musical scale with D-pad combinations
    LDA NewPresses
    AND #%00001100          ; Up + Down together?
    CMP #%00001100
    BNE CheckOtherScales
    
    ; Cycle to next scale
    INC CurrentScale
    LDA CurrentScale
    CMP #$04                ; 4 scales available
    BCC ScaleChangeDone
    LDA #$00
    STA CurrentScale
    JMP ScaleChangeDone
    
CheckOtherScales:
    ; Individual scale selections could go here
    
ScaleChangeDone:
    ; Update note mapping for new scale
    JSR UpdateNoteMapping
    RTS

UpdateNoteMapping:
    ; Update note frequencies based on current scale
    LDA CurrentScale
    CMP #SCALE_MAJOR
    BEQ UseMajorScale
    CMP #SCALE_MINOR
    BEQ UseMinorScale
    CMP #SCALE_PENTATONIC
    BEQ UsePentatonicScale
    ; Default to chromatic
    JSR LoadChromaticScale
    RTS

UseMajorScale:
    JSR LoadMajorScale
    RTS
    
UseMinorScale:
    JSR LoadMinorScale
    RTS
    
UsePentatonicScale:
    JSR LoadPentatonicScale
    RTS

LoadMajorScale:
    ; Load C major scale frequencies
    LDX #$07
LoadMajorLoop:
    LDA MajorScaleFreqs,X
    STA NoteFrequencies,X
    DEX
    BPL LoadMajorLoop
    RTS

; Musical expression variables
CurrentVelocity: .byte $08
CurrentBend: .byte $00
BendRange: .byte $10
CurrentScale: .byte SCALE_MAJOR
OctaveShift: .byte $00
ButtonRepeatTimer: .byte $00

; Scale frequency tables
MajorScaleFreqs:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E    ; C D E F G A B C

MinorScaleFreqs:
    .byte $FE, $E5, $C8, $BA, $A8, $95, $85, $7E    ; C D Eb F G Ab Bb C

PentatonicFreqs:
    .byte $FE, $E5, $BA, $A8, $8A, $7E, $72, $65    ; C D F G A C D F
```

**Expressive Musical Controls:**

```assembly
; Expressive musical control system for Sprite Symphony
Main:
    JSR InitExpressiveSystem
    
MainLoop:
    JSR ProcessInput
    JSR UpdateExpression
    JSR UpdateAudio
    JSR UpdateVisuals
    JMP MainLoop

InitExpressiveSystem:
    ; Initialize expressive musical system
    LDA #%00001111       ; Enable all channels
    STA $4015
    
    ; Initialize expression system
    LDA #$08             ; Default velocity
    STA CurrentVelocity
    LDA #$00
    STA CurrentBend
    STA CurrentScale
    STA OctaveShift
    
    ; Initialize channels
    LDX #$03
InitExpLoop:
    LDA #$00
    STA ChannelStates,X
    STA ChannelTimers,X
    LDA #$FF
    STA ChannelNotes,X
    DEX
    BPL InitExpLoop
    
    ; Load default scale
    JSR LoadDefaultScale
    RTS

LoadDefaultScale:
    ; Load C major scale as default
    LDX #$07
LoadDefaultLoop:
    LDA MajorScale,X
    STA ActiveScale,X
    DEX
    BPL LoadDefaultLoop
    RTS

ProcessInput:
    ; Process input for expression
    LDA CurrentInput
    STA PreviousInput
    JSR ReadController
    STA CurrentInput
    
    ; Calculate new presses
    EOR PreviousInput
    AND CurrentInput
    STA NewPresses
    
    ; Process expression controls
    JSR ProcessExpressionControls
    
    ; Process note triggers
    JSR ProcessNoteTriggers
    RTS

ProcessExpressionControls:
    ; Handle expression controls
    JSR ProcessVelocityControl
    JSR ProcessBendControl
    JSR ProcessScaleControl
    RTS

ProcessVelocityControl:
    ; Calculate velocity based on input timing
    LDA NewPresses
    BEQ VelocityTimerUpdate
    
    ; New input - reset timer
    LDA #$00
    STA VelocityTimer
    JMP VelocityDone
    
VelocityTimerUpdate:
    ; Update velocity timer
    LDA CurrentInput
    AND #%11110000       ; Any face buttons held?
    BEQ VelocityDone
    
    INC VelocityTimer
    LDA VelocityTimer
    CMP #$10             ; Long hold = soft
    BCC VelocityDone
    
    LDA #$04             ; Soft velocity
    STA CurrentVelocity
    JMP VelocityDone
    
VelocityDone:
    ; Set velocity based on timer
    LDA VelocityTimer
    CMP #$04
    BCS MediumVelocity
    
    ; Quick press = loud
    LDA #$0F
    STA CurrentVelocity
    RTS
    
MediumVelocity:
    LDA #$08
    STA CurrentVelocity
    RTS

ProcessBendControl:
    ; Use Select/Start for pitch bend
    LDA CurrentInput
    AND #%00100000       ; Select held?
    BEQ CheckBendDown
    
    ; Bend up
    LDA CurrentBend
    CMP #$0F
    BCS BendControlDone
    INC CurrentBend
    JSR ApplyBendToActive
    JMP BendControlDone
    
CheckBendDown:
    LDA CurrentInput
    AND #%00010000       ; Start held?
    BEQ BendReturn
    
    ; Bend down
    LDA CurrentBend
    CMP #$F1
    BCC BendControlDone
    DEC CurrentBend
    JSR ApplyBendToActive
    JMP BendControlDone
    
BendReturn:
    ; Return to center
    LDA CurrentBend
    BEQ BendControlDone
    BMI BendReturnUp
    
    DEC CurrentBend
    JSR ApplyBendToActive
    JMP BendControlDone
    
BendReturnUp:
    INC CurrentBend
    JSR ApplyBendToActive
    
BendControlDone:
    RTS

ApplyBendToActive:
    ; Apply bend to all active channels
    LDX #$03
ApplyBendLoop:
    LDA ChannelStates,X
    BEQ NextBendApply
    
    ; Apply bend to this channel
    LDA ChannelNotes,X
    TAY
    LDA ActiveScale,Y
    CLC
    ADC CurrentBend
    
    ; Apply to appropriate channel
    CPX #$00
    BEQ ApplyBendPulse1
    CPX #$01
    BEQ ApplyBendPulse2
    ; Skip triangle and noise for this demo
    JMP NextBendApply
    
ApplyBendPulse1:
    STA $4002
    JMP NextBendApply
    
ApplyBendPulse2:
    STA $4006
    
NextBendApply:
    DEX
    BPL ApplyBendLoop
    RTS

ProcessScaleControl:
    ; Change scale with directional combinations
    LDA NewPresses
    AND #%00001100       ; Up + Down
    CMP #%00001100
    BNE ScaleControlDone
    
    ; Cycle scale
    INC CurrentScale
    LDA CurrentScale
    CMP #$03             ; 3 scales
    BCC ScaleChanged
    LDA #$00
    STA CurrentScale
    
ScaleChanged:
    JSR LoadCurrentScale
    
ScaleControlDone:
    RTS

LoadCurrentScale:
    ; Load scale based on CurrentScale
    LDA CurrentScale
    BNE CheckMinor
    
    ; Major scale
    LDX #$07
LoadMajorLoop:
    LDA MajorScale,X
    STA ActiveScale,X
    DEX
    BPL LoadMajorLoop
    RTS
    
CheckMinor:
    CMP #$01
    BNE LoadPentatonic
    
    ; Minor scale
    LDX #$07
LoadMinorLoop:
    LDA MinorScale,X
    STA ActiveScale,X
    DEX
    BPL LoadMinorLoop
    RTS
    
LoadPentatonic:
    ; Pentatonic scale
    LDX #$07
LoadPentLoop:
    LDA PentatonicScale,X
    STA ActiveScale,X
    DEX
    BPL LoadPentLoop
    RTS

ProcessNoteTriggers:
    ; Process note triggering
    LDA NewPresses
    AND #%00001111       ; Directional pad
    BEQ NoteTriggersDone
    
    ; Map directions to notes
    JSR MapDirectionToNote
    CMP #$FF
    BEQ NoteTriggersDone
    
    ; Trigger the note
    JSR TriggerExpressiveNote
    
NoteTriggersDone:
    RTS

MapDirectionToNote:
    ; Map directional input to scale notes
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ CheckDownPress
    LDA #$07             ; High note
    RTS
    
CheckDownPress:
    LDA NewPresses
    AND #%00000100       ; Down
    BEQ CheckLeftPress
    LDA #$00             ; Low note
    RTS
    
CheckLeftPress:
    LDA NewPresses
    AND #%00000010       ; Left
    BEQ CheckRightPress
    LDA #$02             ; Mid-low note
    RTS
    
CheckRightPress:
    LDA NewPresses
    AND #%00000001       ; Right
    BEQ NoNotePress
    LDA #$05             ; Mid-high note
    RTS
    
NoNotePress:
    LDA #$FF
    RTS

TriggerExpressiveNote:
    ; Trigger note A with current expression
    ; Find available channel
    LDX #$00
FindExpChannelLoop:
    LDA ChannelStates,X
    BEQ FoundExpChannel
    INX
    CPX #$02             ; Use first 2 channels
    BNE FindExpChannelLoop
    
    ; Use channel 0 if none available
    LDX #$00
    
FoundExpChannel:
    ; Set up channel
    STA ChannelNotes,X
    LDA #$01
    STA ChannelStates,X
    LDA #$40             ; Note duration
    STA ChannelTimers,X
    
    ; Configure audio with expression
    JSR ConfigureExpressiveAudio
    
    ; Create visual
    JSR CreateExpressiveVisual
    RTS

ConfigureExpressiveAudio:
    ; Configure audio for note A on channel X with expression
    ; Get frequency from current scale
    TAY
    LDA ActiveScale,Y
    CLC
    ADC CurrentBend      ; Apply bend
    STA TempFreq
    
    ; Configure based on channel
    CPX #$00
    BEQ ConfigExpPulse1
    
    ; Pulse 2
    LDA CurrentVelocity
    ASL
    ASL
    ORA #%10110000       ; Duty + volume
    STA $4004
    LDA TempFreq
    STA $4006
    LDA #$08
    STA $4007
    RTS
    
ConfigExpPulse1:
    LDA CurrentVelocity
    ASL
    ASL
    ORA #%10110000       ; Duty + volume
    STA $4000
    LDA TempFreq
    STA $4002
    LDA #$08
    STA $4003
    RTS

CreateExpressiveVisual:
    ; Create visual for expressive note
    TXA
    ASL
    ASL
    TAY
    
    ; Set sprite based on note and velocity
    LDA ChannelNotes,X
    CLC
    ADC #$10             ; Base tile
    STA SpriteData+1,Y
    
    ; Y position based on note
    LDA ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    STA SpriteData,Y
    
    ; Palette based on velocity
    LDA CurrentVelocity
    LSR
    LSR
    STA SpriteData+2,Y
    
    ; X position based on channel
    TXA
    ASL
    ASL
    ASL
    CLC
    ADC #$70
    STA SpriteData+3,Y
    
    RTS

UpdateExpression:
    ; Update expression system
    JSR UpdateChannelTimers
    JSR UpdateVisualExpression
    RTS

UpdateChannelTimers:
    ; Update all channel timers
    LDX #$03
UpdateTimerLoop:
    LDA ChannelStates,X
    BEQ NextTimerUpdate
    
    DEC ChannelTimers,X
    LDA ChannelTimers,X
    BNE NextTimerUpdate
    
    ; Channel finished
    LDA #$00
    STA ChannelStates,X
    
    ; Hide visual
    TXA
    ASL
    ASL
    TAY
    LDA #$FF
    STA SpriteData,Y
    
NextTimerUpdate:
    DEX
    BPL UpdateTimerLoop
    RTS

UpdateVisualExpression:
    ; Update visual expression effects
    INC ExpressionCounter
    
    ; Animate active notes based on expression
    LDX #$03
VisualExpLoop:
    LDA ChannelStates,X
    BEQ NextVisualExp
    
    ; Animate this note
    TXA
    ASL
    ASL
    TAY
    
    ; Velocity-based animation
    LDA CurrentVelocity
    CMP #$08
    BCC SubtleAnimation
    
    ; Strong animation
    LDA ExpressionCounter
    AND #$03
    CLC
    ADC ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    CLC
    ADC #$04
    JMP StoreExpY
    
SubtleAnimation:
    LDA ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    CLC
    ADC #$01
    
StoreExpY:
    STA SpriteData,Y
    
NextVisualExp:
    DEX
    BPL VisualExpLoop
    RTS

UpdateAudio:
    ; Ensure audio stays in sync
    LDA ChannelStates
    ORA ChannelStates+1
    BNE AudioActive
    
    ; No active channels - silence
    LDA #$00
    STA $4000
    STA $4004
    
AudioActive:
    RTS

UpdateVisuals:
    ; Update visual system
    ; Handled in UpdateExpression
    RTS

ReadController:
    ; Simulate expressive input
    LDA ExpressionCounter
    AND #$3F             ; 64-frame cycle
    CMP #$10
    BEQ SimExpUp
    CMP #$20
    BEQ SimExpRight
    CMP #$30
    BEQ SimExpSelect
    LDA #$FF
    RTS
    
SimExpUp:
    LDA #%11110111       ; Up
    RTS
    
SimExpRight:
    LDA #%11111110       ; Right
    RTS
    
SimExpSelect:
    LDA #%11011111       ; Select (bend)
    RTS

; Scale data
MajorScale:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

MinorScale:
    .byte $FE, $E5, $C8, $BA, $A8, $95, $85, $7E

PentatonicScale:
    .byte $FE, $E5, $BA, $A8, $8A, $7E, $72, $65

NotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

; Variables
CurrentInput: .byte $FF
PreviousInput: .byte $FF
NewPresses: .byte $00
CurrentVelocity: .byte $08
CurrentBend: .byte $00
CurrentScale: .byte $00
OctaveShift: .byte $00
VelocityTimer: .byte $00
ExpressionCounter: .byte $00
TempFreq: .byte $00

; Channel management
ChannelStates: .byte $00, $00, $00, $00
ChannelNotes: .byte $FF, $FF, $FF, $FF
ChannelTimers: .byte $00, $00, $00, $00

; Current active scale
ActiveScale: .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

; Sprite data
SpriteData:
    .byte $FF, $10, $00, $70  ; Channel 0
    .byte $FF, $11, $00, $78  ; Channel 1
    .byte $FF, $12, $00, $80  ; Channel 2
    .byte $FF, $13, $00, $88  ; Channel 3
```

## Visual Feedback Enhancement

Create rich visual feedback that responds to musical expression:

```assembly
; Enhanced visual feedback system
VisualExpressionSystem:
    .struct
        IntensityLevels: .byte * 4      ; Visual intensity per channel
        ColorModes: .byte * 4           ; Color scheme per channel
        AnimationStyles: .byte * 4      ; Animation type per channel
        EffectDurations: .byte * 4      ; Effect duration timers
        ParticleCount: .byte            ; Number of active particles
    .endstruct

CreateExpressiveVisualFeedback:
    ; Create visual feedback based on musical expression
    ; A = note index, X = channel, Y = velocity
    
    ; Calculate visual intensity based on velocity
    TYA                     ; Y = velocity
    LSR                     ; Divide by 2
    CLC
    ADC #$04                ; Minimum intensity
    STA IntensityLevels,X
    
    ; Choose color based on note pitch
    LDA NoteColorMap,A      ; A = note index
    STA ColorModes,X
    
    ; Choose animation style based on expression
    JSR DetermineAnimationStyle
    STA AnimationStyles,X
    
    ; Set effect duration based on velocity
    TYA                     ; Velocity
    ASL                     ; Double for duration
    STA EffectDurations,X
    
    ; Create primary note sprite
    JSR CreatePrimaryNoteSprite
    
    ; Create expression particles
    JSR CreateExpressionParticles
    
    RTS

DetermineAnimationStyle:
    ; Determine animation style based on current expression
    LDA CurrentBend
    CMP #$08
    BCS BendAnimation       ; High bend = wavy animation
    
    LDA CurrentVelocity
    CMP #$0C
    BCS PulseAnimation      ; High velocity = pulse animation
    
    ; Default smooth animation
    LDA #ANIM_SMOOTH
    RTS

BendAnimation:
    LDA #ANIM_WAVY
    RTS

PulseAnimation:
    LDA #ANIM_PULSE
    RTS

CreateExpressionParticles:
    ; Create particle effects based on expression level
    LDA CurrentVelocity
    CMP #$08
    BCC NoParticles         ; Low velocity = no particles
    
    ; Create 2-4 particles based on velocity
    LSR                     ; Divide velocity by 4
    LSR
    CLC
    ADC #$02                ; 2-6 particles
    STA ParticleCount
    
    ; Initialize particles
    LDY #$00
    
CreateParticleLoop:
    JSR InitializeParticle
    INY
    CPY ParticleCount
    BNE CreateParticleLoop
    
NoParticles:
    RTS

InitializeParticle:
    ; Initialize particle Y
    ; Calculate base position
    LDA ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    STA ParticleBaseY,Y
    
    ; Add random offset
    TYA
    ASL
    ASL                     ; * 4 for spread
    CLC
    ADC ParticleBaseY,Y
    SEC
    SBC #$08                ; Center around note
    STA ParticleY,Y
    
    ; X position with spread
    TXA
    ASL
    ASL
    ASL                     ; * 8
    CLC
    ADC #$78                ; Base X
    CLC
    ADC ParticleXOffsets,Y  ; Add offset
    STA ParticleX,Y
    
    ; Set particle properties
    LDA CurrentVelocity
    LSR                     ; Half velocity for particles
    STA ParticleVelocity,Y
    
    LDA #$20                ; Particle lifetime
    STA ParticleLife,Y
    
    RTS

UpdateVisualExpression:
    ; Update all visual expression effects
    JSR UpdateNoteAnimations
    JSR UpdateParticleEffects
    JSR UpdateColorCycling
    RTS

UpdateNoteAnimations:
    ; Update animations for all active notes
    LDX #$00
    
UpdateAnimLoop:
    LDA ChannelStates,X
    BEQ NextAnimUpdate
    
    ; Update animation for this channel
    LDA AnimationStyles,X
    CMP #ANIM_PULSE
    BEQ UpdatePulseAnim
    CMP #ANIM_WAVY
    BEQ UpdateWavyAnim
    ; Default smooth
    JSR UpdateSmoothAnim
    JMP NextAnimUpdate
    
UpdatePulseAnim:
    JSR UpdatePulseAnimation
    JMP NextAnimUpdate
    
UpdateWavyAnim:
    JSR UpdateWavyAnimation
    
NextAnimUpdate:
    INX
    CPX #$04
    BNE UpdateAnimLoop
    
    RTS

UpdatePulseAnimation:
    ; Pulse animation for channel X
    TXA
    ASL
    ASL
    TAY                     ; Y = sprite offset
    
    ; Pulse based on intensity
    LDA AnimationCounter
    AND #$07                ; 8-frame cycle
    CMP #$04
    BCC PulseOut
    
    ; Pulse in
    LDA ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    SEC
    SBC IntensityLevels,X   ; Subtract intensity
    JMP StorePulseY
    
PulseOut:
    LDA ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    CLC
    ADC IntensityLevels,X   ; Add intensity
    
StorePulseY:
    STA SpriteData,Y
    RTS

UpdateWavyAnimation:
    ; Wavy animation for channel X
    TXA
    ASL
    ASL
    TAY                     ; Y = sprite offset
    
    ; Create sine wave effect
    LDA AnimationCounter
    CLC
    ADC WavePhaseOffsets,X  ; Different phase per channel
    AND #$0F                ; 16-frame wave
    TAZ
    LDA SineTable,Z
    LSR                     ; Scale down
    LSR
    STA WaveOffset
    
    ; Apply to base position
    LDA ChannelNotes,X
    TAZ
    LDA NotePosY,Z
    CLC
    ADC WaveOffset
    STA SpriteData,Y
    
    RTS

UpdateParticleEffects:
    ; Update all active particles
    LDY #$00
    
UpdateParticleLoop:
    LDA ParticleLife,Y
    BEQ NextParticleUpdate
    
    ; Update this particle
    DEC ParticleLife,Y
    
    ; Move particle
    LDA ParticleY,Y
    SEC
    SBC ParticleVelocity,Y  ; Move up
    STA ParticleY,Y
    
    ; Update particle sprite
    JSR UpdateParticleSprite
    
NextParticleUpdate:
    INY
    CPY #$08                ; Max 8 particles
    BNE UpdateParticleLoop
    
    RTS

; Animation constants
ANIM_SMOOTH = $00
ANIM_PULSE = $01
ANIM_WAVY = $02

; Visual expression data
NoteColorMap:
    .byte $00, $01, $02, $03, $00, $01, $02, $03   ; Color per note

WavePhaseOffsets:
    .byte $00, $04, $08, $0C                       ; Phase offset per channel

SineTable:
    .byte $00, $02, $04, $06, $08, $06, $04, $02
    .byte $00, $FE, $FC, $FA, $F8, $FA, $FC, $FE

ParticleXOffsets:
    .byte $00, $04, $08, $0C, $10, $14, $18, $1C

; Visual system variables
IntensityLevels: .byte $00, $00, $00, $00
ColorModes: .byte $00, $00, $00, $00
AnimationStyles: .byte ANIM_SMOOTH, ANIM_SMOOTH, ANIM_SMOOTH, ANIM_SMOOTH
EffectDurations: .byte $00, $00, $00, $00
ParticleCount: .byte $00
AnimationCounter: .byte $00
WaveOffset: .byte $00

; Particle system
ParticleY: .byte $00, $00, $00, $00, $00, $00, $00, $00
ParticleX: .byte $00, $00, $00, $00, $00, $00, $00, $00
ParticleBaseY: .byte $00, $00, $00, $00, $00, $00, $00, $00
ParticleVelocity: .byte $00, $00, $00, $00, $00, $00, $00, $00
ParticleLife: .byte $00, $00, $00, $00, $00, $00, $00, $00
```

## Practice Exercise

Create a complete interactive note playing system that demonstrates all concepts:

1. Implement real-time note triggering with immediate audio-visual feedback
2. Add polyphonic note management that handles multiple simultaneous notes
3. Create expressive controls for velocity, pitch bend, and scale changes
4. Build rich visual feedback that responds to musical expression
5. Integrate everything into the Sprite Symphony foundation

**Practice: Complete Interactive Note Playing System:**

```assembly
; Complete interactive note playing system for Sprite Symphony
Main:
    JSR InitInteractiveSystem
    
MainLoop:
    JSR ProcessInteractiveInput
    JSR UpdatePolyphonicAudio
    JSR UpdateExpressiveVisuals
    JSR UpdateSystemState
    JMP MainLoop

InitInteractiveSystem:
    ; Initialize complete interactive system
    LDA #%00001111       ; Enable all audio channels
    STA $4015
    
    ; Initialize input system
    LDA #$FF
    STA CurrentInput
    STA PreviousInput
    LDA #$00
    STA NewPresses
    STA InputMode
    
    ; Initialize expression system
    LDA #$08
    STA Velocity
    LDA #$00
    STA PitchBend
    STA CurrentScale
    
    ; Initialize polyphonic system
    LDX #$03
InitPolyLoop:
    LDA #$00
    STA ChannelActive,X
    STA ChannelTimer,X
    LDA #$FF
    STA ChannelNote,X
    DEX
    BPL InitPolyLoop
    
    ; Initialize visual system
    JSR InitVisualFeedback
    
    ; Load default scale
    JSR LoadMajorScale
    RTS

InitVisualFeedback:
    ; Initialize visual feedback system
    LDA #$00
    STA VisualCounter
    STA ParticleCount
    
    ; Clear all sprites
    LDX #$00
    LDA #$FF
ClearSprites:
    STA SpriteOAM,X
    INX
    INX
    INX
    INX
    CPX #$80
    BNE ClearSprites
    
    ; Initialize mode indicator
    LDA #$20
    STA SpriteOAM+60     ; Mode indicator Y
    LDA #$4D             ; 'M' for Music mode
    STA SpriteOAM+61     ; Tile
    LDA #%00000011       ; Mode palette
    STA SpriteOAM+62     ; Attributes
    LDA #$10
    STA SpriteOAM+63     ; X position
    RTS

ProcessInteractiveInput:
    ; Process all input for interactive playing
    LDA CurrentInput
    STA PreviousInput
    JSR ReadController
    STA CurrentInput
    
    ; Calculate new presses
    EOR PreviousInput
    AND CurrentInput
    STA NewPresses
    
    ; Process different types of input
    JSR ProcessNoteInput
    JSR ProcessExpressionInput
    JSR ProcessModeInput
    RTS

ProcessNoteInput:
    ; Process note triggering input
    LDA NewPresses
    AND #%00001111       ; Directional pad
    BEQ NoteInputDone
    
    ; Map input to note
    JSR MapInputToNote
    CMP #$FF
    BEQ NoteInputDone
    
    ; Trigger the note
    JSR TriggerPolyphonicNote
    
NoteInputDone:
    RTS

MapInputToNote:
    ; Map directional input to scale notes
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ CheckNoteDown
    LDA #$07             ; Scale degree 7
    RTS
    
CheckNoteDown:
    LDA NewPresses
    AND #%00000100       ; Down
    BEQ CheckNoteLeft
    LDA #$00             ; Scale degree 0
    RTS
    
CheckNoteLeft:
    LDA NewPresses
    AND #%00000010       ; Left
    BEQ CheckNoteRight
    LDA #$02             ; Scale degree 2
    RTS
    
CheckNoteRight:
    LDA NewPresses
    AND #%00000001       ; Right
    BEQ NoNoteInput
    LDA #$04             ; Scale degree 4
    RTS
    
NoNoteInput:
    LDA #$FF
    RTS

TriggerPolyphonicNote:
    ; Trigger note A with polyphonic management
    STA TriggerNote
    
    ; Find available channel
    JSR FindFreeChannel
    CPX #$FF
    BEQ TriggerNoteDone
    
    ; Set up channel
    LDA TriggerNote
    STA ChannelNote,X
    LDA #$01
    STA ChannelActive,X
    LDA #$40             ; Note duration
    STA ChannelTimer,X
    
    ; Configure audio
    JSR ConfigureChannelAudio
    
    ; Create visual
    JSR CreateChannelVisual
    
TriggerNoteDone:
    RTS

FindFreeChannel:
    ; Find free audio channel, return in X
    LDX #$00
FindChannelLoop:
    LDA ChannelActive,X
    BEQ FoundFreeChannel
    INX
    CPX #$04
    BNE FindChannelLoop
    
    ; No free channels - use oldest
    LDX #$00             ; Use channel 0
    
FoundFreeChannel:
    RTS

ConfigureChannelAudio:
    ; Configure audio for note on channel X
    LDA ChannelNote,X
    TAY
    LDA ScaleFreqs,Y
    CLC
    ADC PitchBend        ; Apply pitch bend
    STA TempFreq
    
    ; Configure based on channel
    CPX #$00
    BEQ ConfigPulse1
    CPX #$01
    BEQ ConfigPulse2
    CPX #$02
    BEQ ConfigTriangle
    ; Skip noise for simplicity
    RTS
    
ConfigPulse1:
    LDA Velocity
    ASL
    ASL
    ORA #%10110000
    STA $4000
    LDA TempFreq
    STA $4002
    LDA #$08
    STA $4003
    RTS
    
ConfigPulse2:
    LDA Velocity
    ASL
    ASL
    ORA #%10110000
    STA $4004
    LDA TempFreq
    STA $4006
    LDA #$08
    STA $4007
    RTS
    
ConfigTriangle:
    LDA #%11111111
    STA $4008
    LDA TempFreq
    STA $400A
    LDA #$08
    STA $400B
    RTS

CreateChannelVisual:
    ; Create visual for channel X note
    TXA
    ASL
    ASL
    TAY
    
    ; Set sprite data
    LDA ChannelNote,X
    TAZ
    LDA ScalePosY,Z
    STA SpriteOAM,Y      ; Y position
    
    LDA ChannelNote,X
    CLC
    ADC #$10             ; Base tile
    STA SpriteOAM+1,Y    ; Tile
    
    ; Palette based on velocity
    LDA Velocity
    LSR
    LSR
    AND #%00000011
    STA SpriteOAM+2,Y    ; Attributes
    
    ; X position based on channel
    TXA
    ASL
    ASL
    ASL
    CLC
    ADC #$60
    STA SpriteOAM+3,Y    ; X position
    RTS

ProcessExpressionInput:
    ; Process expression controls
    JSR ProcessVelocityInput
    JSR ProcessBendInput
    JSR ProcessScaleInput
    RTS

ProcessVelocityInput:
    ; Adjust velocity based on button combinations
    LDA CurrentInput
    AND #%11000000       ; A + B together
    CMP #%00000000       ; Both pressed (inverted logic)
    BNE VelocityInputDone
    
    ; Adjust velocity
    INC VelocityAdjust
    LDA VelocityAdjust
    AND #$0F
    STA Velocity
    
VelocityInputDone:
    RTS

ProcessBendInput:
    ; Process pitch bend input
    LDA CurrentInput
    AND #%00100000       ; Select
    BEQ CheckBendDown
    
    ; Bend up
    LDA PitchBend
    CMP #$10
    BCS BendInputDone
    INC PitchBend
    JSR ApplyBendToAll
    JMP BendInputDone
    
CheckBendDown:
    LDA CurrentInput
    AND #%00010000       ; Start
    BEQ BendReturn
    
    ; Bend down
    LDA PitchBend
    CMP #$F0
    BCC BendInputDone
    DEC PitchBend
    JSR ApplyBendToAll
    JMP BendInputDone
    
BendReturn:
    ; Return to center
    LDA PitchBend
    BEQ BendInputDone
    BMI BendReturnUp
    DEC PitchBend
    JSR ApplyBendToAll
    JMP BendInputDone
    
BendReturnUp:
    INC PitchBend
    JSR ApplyBendToAll
    
BendInputDone:
    RTS

ApplyBendToAll:
    ; Apply current bend to all active channels
    LDX #$03
BendApplyLoop:
    LDA ChannelActive,X
    BEQ NextBendApply
    
    ; Apply bend to this channel
    LDA ChannelNote,X
    TAY
    LDA ScaleFreqs,Y
    CLC
    ADC PitchBend
    
    ; Apply to channel
    CPX #$00
    BEQ BendPulse1
    CPX #$01
    BEQ BendPulse2
    CPX #$02
    BEQ BendTriangle
    JMP NextBendApply
    
BendPulse1:
    STA $4002
    JMP NextBendApply
    
BendPulse2:
    STA $4006
    JMP NextBendApply
    
BendTriangle:
    STA $400A
    
NextBendApply:
    DEX
    BPL BendApplyLoop
    RTS

ProcessScaleInput:
    ; Change scale with Left+Right combination
    LDA NewPresses
    AND #%00000011       ; Left + Right
    CMP #%00000000       ; Both pressed
    BNE ScaleInputDone
    
    ; Cycle scale
    INC CurrentScale
    LDA CurrentScale
    CMP #$03
    BCC ScaleChanged
    LDA #$00
    STA CurrentScale
    
ScaleChanged:
    JSR LoadCurrentScale
    
ScaleInputDone:
    RTS

LoadCurrentScale:
    ; Load scale based on CurrentScale value
    LDA CurrentScale
    BNE CheckMinorScale
    
    ; Major scale
    JSR LoadMajorScale
    RTS
    
CheckMinorScale:
    CMP #$01
    BNE LoadPentatonic
    JSR LoadMinorScale
    RTS
    
LoadPentatonic:
    JSR LoadPentatonicScale
    RTS

LoadMajorScale:
    LDX #$07
LoadMajorLoop:
    LDA MajorScaleData,X
    STA ScaleFreqs,X
    DEX
    BPL LoadMajorLoop
    RTS

LoadMinorScale:
    LDX #$07
LoadMinorLoop:
    LDA MinorScaleData,X
    STA ScaleFreqs,X
    DEX
    BPL LoadMinorLoop
    RTS

LoadPentatonicScale:
    LDX #$07
LoadPentLoop:
    LDA PentatonicData,X
    STA ScaleFreqs,X
    DEX
    BPL LoadPentLoop
    RTS

ProcessModeInput:
    ; Handle mode switching (future expansion)
    RTS

UpdatePolyphonicAudio:
    ; Update all active audio channels
    LDX #$03
AudioUpdateLoop:
    LDA ChannelActive,X
    BEQ NextAudioUpdate
    
    ; Update this channel
    DEC ChannelTimer,X
    LDA ChannelTimer,X
    BNE NextAudioUpdate
    
    ; Channel finished
    LDA #$00
    STA ChannelActive,X
    
    ; Hide visual
    TXA
    ASL
    ASL
    TAY
    LDA #$FF
    STA SpriteOAM,Y
    
NextAudioUpdate:
    DEX
    BPL AudioUpdateLoop
    
    ; Check if any channels active
    LDA ChannelActive
    ORA ChannelActive+1
    ORA ChannelActive+2
    ORA ChannelActive+3
    BNE AudioUpdateDone
    
    ; No channels active - silence
    LDA #$00
    STA $4000
    STA $4004
    STA $4008
    
AudioUpdateDone:
    RTS

UpdateExpressiveVisuals:
    ; Update visual expression effects
    INC VisualCounter
    JSR UpdateNoteVisuals
    JSR UpdateExpressionIndicators
    RTS

UpdateNoteVisuals:
    ; Update visuals for all active notes
    LDX #$03
VisualUpdateLoop:
    LDA ChannelActive,X
    BEQ NextVisualUpdate
    
    ; Update this channel's visual
    TXA
    ASL
    ASL
    TAY
    
    ; Animate based on velocity
    LDA Velocity
    CMP #$08
    BCC SubtleVisual
    
    ; Strong visual
    LDA VisualCounter
    AND #$07
    CMP #$04
    BCC StrongPulseUp
    
    LDA ChannelNote,X
    TAZ
    LDA ScalePosY,Z
    CLC
    ADC #$04
    JMP StoreVisualY
    
StrongPulseUp:
    LDA ChannelNote,X
    TAZ
    LDA ScalePosY,Z
    SEC
    SBC #$04
    JMP StoreVisualY
    
SubtleVisual:
    LDA ChannelNote,X
    TAZ
    LDA ScalePosY,Z
    CLC
    ADC #$01
    
StoreVisualY:
    STA SpriteOAM,Y
    
NextVisualUpdate:
    DEX
    BPL VisualUpdateLoop
    RTS

UpdateExpressionIndicators:
    ; Update expression status indicators
    ; Velocity indicator
    LDA Velocity
    LSR
    LSR
    CLC
    ADC #$20
    STA SpriteOAM+64     ; Velocity indicator Y
    LDA #$56             ; 'V' tile
    STA SpriteOAM+65
    LDA #%00000001
    STA SpriteOAM+66
    LDA #$E0
    STA SpriteOAM+67
    
    ; Scale indicator
    LDA CurrentScale
    CLC
    ADC #$53             ; 'S' + scale number
    STA SpriteOAM+69
    LDA #$30
    STA SpriteOAM+68
    LDA #%00000010
    STA SpriteOAM+70
    LDA #$E8
    STA SpriteOAM+71
    RTS

UpdateSystemState:
    ; Update overall system state
    ; Could add tempo, global effects, etc.
    RTS

ReadController:
    ; Simulate controller input for demo
    LDA VisualCounter
    AND #$3F
    CMP #$10
    BEQ SimInteractiveUp
    CMP #$18
    BEQ SimInteractiveRight
    CMP #$20
    BEQ SimInteractiveA
    CMP #$30
    BEQ SimInteractiveBend
    LDA #$FF
    RTS
    
SimInteractiveUp:
    LDA #%11110111       ; Up
    RTS
    
SimInteractiveRight:
    LDA #%11111110       ; Right
    RTS
    
SimInteractiveA:
    LDA #%01111111       ; A
    RTS
    
SimInteractiveBend:
    LDA #%11011111       ; Select (bend)
    RTS

; Scale data
MajorScaleData:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

MinorScaleData:
    .byte $FE, $E5, $C8, $BA, $A8, $95, $85, $7E

PentatonicData:
    .byte $FE, $E5, $BA, $A8, $8A, $7E, $72, $65

ScalePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

; Variables
CurrentInput: .byte $FF
PreviousInput: .byte $FF
NewPresses: .byte $00
InputMode: .byte $00
TriggerNote: .byte $00
Velocity: .byte $08
PitchBend: .byte $00
CurrentScale: .byte $00
VelocityAdjust: .byte $08
VisualCounter: .byte $00
ParticleCount: .byte $00
TempFreq: .byte $00

; Polyphonic system
ChannelActive: .byte $00, $00, $00, $00
ChannelNote: .byte $FF, $FF, $FF, $FF
ChannelTimer: .byte $00, $00, $00, $00

; Current scale frequencies
ScaleFreqs: .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

; Sprite OAM data
SpriteOAM:
    .byte $FF, $10, $00, $60  ; Channel 0
    .byte $FF, $11, $00, $68  ; Channel 1
    .byte $FF, $12, $00, $70  ; Channel 2
    .byte $FF, $13, $00, $78  ; Channel 3
```

## What You've Learned

In this essential lesson, you've mastered:

- Real-time musical note triggering with immediate audio-visual feedback
- Polyphonic note management that handles multiple simultaneous sounds
- Expressive musical controls including velocity, pitch bend, and scale changes
- Rich visual feedback systems that respond to musical expression
- Complete integration of interactive musical capabilities into Sprite Symphony
- Professional patterns for building responsive musical applications

## Looking Ahead

In the next lesson, you'll complete Sprite Symphony by building your first complete NES game, integrating all the musical and visual systems into a polished, playable application!

## Fun Fact

The interactive note playing system you've built mirrors the core functionality of professional music software and hardware synthesizers. The polyphonic management, real-time triggering, and expressive controls represent the same fundamental concepts used in modern music production tools. The immediate audio-visual feedback and responsive interface design you've mastered are essential skills for any interactive audio application, from music games to digital audio workstations. The NES limitations you've worked within actually taught you to be more creative and efficient - skills that modern audio programmers still value!