---
title: "Sprite Symphony Foundation"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 28
description: "Begin building the Sprite Symphony project! Create the foundational architecture that combines audio generation, visual feedback, and interactive control into a cohesive musical application."
learning_objectives:
  - "Design the complete Sprite Symphony architecture"
  - "Implement the core audio-visual synchronization system"
  - "Create the foundation for musical note management"
  - "Build the sprite-based visual feedback framework"
  - "Establish the project structure for future development"
concepts:
  - "Complete application architecture design"
  - "Integrated audio-visual system programming"
  - "Musical data structures and management"
  - "Visual feedback coordination systems"
  - "Project organization and scalability"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 28
---

# Lesson 28: Sprite Symphony Foundation

Welcome to the creation of Sprite Symphony! This lesson brings together everything you've learned to build the foundation of a complete musical application that demonstrates the power of coordinated audio-visual programming on the NES.

## Sprite Symphony Project Vision

Sprite Symphony is an interactive musical experience where:

```text
Core Features:
- Visual notes represented by sprites
- Real-time audio generation synchronized with visuals
- Interactive note placement and editing
- Multiple musical scales and modes
- Sprite-based animations that respond to music
- Complete game-like interface and controls

System Architecture:
- Audio Engine: NES APU programming for tone generation
- Visual Engine: Sprite coordination and animation
- Input System: Controller-based musical interaction
- State Manager: Different modes (play, edit, demo)
- Data Manager: Musical sequences and patterns

Educational Goals:
- Apply all Phase 1 NES programming concepts
- Create a complete, polished application
- Demonstrate professional development practices
- Build something genuinely enjoyable to use
```

## Core System Architecture

The foundation architecture integrates all major NES subsystems:

```assembly
; Sprite Symphony main system architecture
; =======================================

; System constants
MAX_NOTES = $08          ; Maximum simultaneous notes
MAX_SPRITES = $20        ; Maximum sprites (32)
SCREEN_WIDTH = $FF       ; Screen width
SCREEN_HEIGHT = $EF      ; Screen height

; Audio system
AudioEngine:
    .struct
        CurrentChannel: .byte    ; Active audio channel
        FrequencyLow: .byte     ; Current frequency low byte
        FrequencyHigh: .byte    ; Current frequency high byte
        Volume: .byte           ; Current volume level
        NoteTimer: .byte        ; Duration timer for current note
        EnvelopePhase: .byte    ; Envelope progression
    .endstruct

; Visual system  
VisualEngine:
    .struct
        ActiveSprites: .byte    ; Number of active sprites
        SpritePool: .byte * 4   ; Sprite data pool (4 bytes per sprite)
        AnimationTimer: .byte   ; Global animation timer
        EffectTimer: .byte      ; Visual effect timer
        SyncPhase: .byte        ; Audio-visual sync phase
    .endstruct

; Input system
InputEngine:
    .struct
        CurrentInput: .byte     ; Current frame input
        PreviousInput: .byte    ; Previous frame input
        NewPresses: .byte       ; Newly pressed buttons
        InputBuffer: .byte * 4  ; 4-frame input buffer
        RepeatTimer: .byte      ; Button repeat timing
    .endstruct

; Musical note system
NoteSystem:
    .struct
        ActiveNotes: .byte      ; Bitmask of active notes
        NotePositions: .byte * MAX_NOTES    ; X positions
        NotePitches: .byte * MAX_NOTES      ; Frequency values
        NoteTimers: .byte * MAX_NOTES       ; Duration timers
        NoteSprites: .byte * MAX_NOTES      ; Associated sprite indices
    .endstruct

; Initialize all subsystems
InitSpriteSymphony:
    JSR InitAudioEngine
    JSR InitVisualEngine
    JSR InitInputEngine
    JSR InitNoteSystem
    JSR InitGameState
    
    ; Set initial mode
    LDA #SYMPHONY_MODE_DEMO
    STA CurrentMode
    
    ; Start demo sequence
    JSR StartDemoMode
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Sprite Symphony Foundation Architecture"
  code="; Sprite Symphony foundation architecture
Main:
    JSR InitSpriteSymphony
    
MainLoop:
    JSR UpdateInput
    JSR UpdateAudio
    JSR UpdateVisuals
    JSR UpdateGameLogic
    JMP MainLoop

InitSpriteSymphony:
    ; Initialize all systems
    JSR InitAudioSystem
    JSR InitVisualSystem
    JSR InitNoteManager
    JSR InitDemoMode
    RTS

InitAudioSystem:
    ; Set up NES APU for music
    LDA #%00000001       ; Enable pulse channel 1
    STA $4015
    
    ; Initialize audio variables
    LDA #$00
    STA CurrentNote
    STA AudioTimer
    STA ChannelActive
    
    ; Set default envelope
    LDA #%10111111       ; Duty, length counter, envelope
    STA $4000
    LDA #%00000000       ; No sweep
    STA $4001
    RTS

InitVisualSystem:
    ; Initialize sprite system
    LDA #$00
    STA ActiveSprites
    STA AnimPhase
    STA EffectTimer
    
    ; Clear all sprites
    LDX #$00
    LDA #$FF             ; Y = 255 hides sprites
ClearSprites:
    STA SpriteData,X
    INX
    INX
    INX
    INX
    CPX #$80             ; 32 sprites * 4 bytes
    BNE ClearSprites
    
    RTS

InitNoteManager:
    ; Initialize musical note system
    LDA #$00
    STA ActiveNoteCount
    STA CurrentScale
    STA SequencePosition
    
    ; Clear note arrays
    LDX #$07             ; 8 notes max
ClearNotes:
    LDA #$00
    STA NoteActive,X
    STA NoteTimers,X
    LDA #$FF
    STA NoteSpriteY,X    ; Hide note sprites
    DEX
    BPL ClearNotes
    
    RTS

InitDemoMode:
    ; Set up demo sequence
    LDA #$00
    STA DemoStep
    STA DemoTimer
    
    ; Start first demo note
    JSR StartDemoSequence
    RTS

UpdateInput:
    ; Read controller and detect new presses
    JSR ReadController
    STA CurrentButtons
    
    ; Detect new button presses
    EOR PreviousButtons
    AND CurrentButtons
    STA NewPresses
    
    ; Save for next frame
    LDA CurrentButtons
    STA PreviousButtons
    
    ; Process demo input (auto-generates input)
    JSR ProcessDemoInput
    RTS

ProcessDemoInput:
    ; Generate automatic input for demo
    INC DemoTimer
    LDA DemoTimer
    AND #$1F             ; Every 32 frames
    BNE DemoInputDone
    
    ; Trigger next demo action
    JSR TriggerDemoNote
    
DemoInputDone:
    RTS

TriggerDemoNote:
    ; Play next note in demo sequence
    LDX SequencePosition
    LDA DemoSequence,X
    CMP #$FF             ; End marker?
    BEQ ResetDemoSequence
    
    ; Play this note
    JSR PlayMusicalNote
    
    ; Advance sequence
    INC SequencePosition
    RTS
    
ResetDemoSequence:
    ; Loop demo sequence
    LDA #$00
    STA SequencePosition
    RTS

PlayMusicalNote:
    ; A = note index (0-7)
    TAX
    
    ; Set audio frequency
    LDA NoteFrequencies,X
    STA $4002            ; Frequency low
    LDA NoteFreqHigh,X
    STA $4003            ; Frequency high
    
    ; Reset envelope
    LDA #%10111111
    STA $4000
    
    ; Set note duration
    LDA #$20             ; 32 frames
    STA AudioTimer
    
    ; Create visual note
    JSR CreateNoteSprite
    RTS

CreateNoteSprite:
    ; Create sprite for note X
    ; Find available sprite
    LDY #$00
FindSprite:
    LDA SpriteData,Y
    CMP #$FF             ; Hidden sprite?
    BEQ FoundSprite
    TYA
    CLC
    ADC #$04             ; Next sprite
    TAY
    CPY #$20             ; Check 8 sprites
    BNE FindSprite
    RTS                  ; No available sprites
    
FoundSprite:
    ; Set sprite position based on note
    LDA NotePosY,X       ; Y position based on pitch
    STA SpriteData+0,Y
    
    LDA NoteTiles,X      ; Tile based on note
    STA SpriteData+1,Y
    
    LDA #%00000001       ; Palette 1
    STA SpriteData+2,Y
    
    LDA SequencePosition ; X position based on sequence
    ASL                  ; * 2
    ASL                  ; * 4
    ASL                  ; * 8
    CLC
    ADC #$40             ; Base X position
    STA SpriteData+3,Y
    
    ; Mark note as active
    LDA #$01
    STA NoteActive,X
    LDA #$20
    STA NoteTimers,X
    
    ; Store sprite index for this note
    TYA
    LSR                  ; Divide by 4 to get sprite number
    LSR
    STA NoteSpriteIndex,X
    
    RTS

UpdateAudio:
    ; Update audio system
    LDA AudioTimer
    BEQ AudioSilent
    
    DEC AudioTimer
    
    ; Check if note should end
    LDA AudioTimer
    BNE AudioDone
    
    ; Silence audio
    LDA #$00
    STA $4000
    JMP AudioDone
    
AudioSilent:
    ; Ensure audio is off
    LDA #$00
    STA $4000
    
AudioDone:
    RTS

UpdateVisuals:
    ; Update visual system
    INC AnimPhase
    JSR UpdateNoteSprites
    JSR UpdateVisualEffects
    RTS

UpdateNoteSprites:
    ; Update all active note sprites
    LDX #$07             ; 8 possible notes
UpdateNoteLoop:
    LDA NoteActive,X
    BEQ NextNoteSprite
    
    ; Update this note's timer
    DEC NoteTimers,X
    LDA NoteTimers,X
    BNE AnimateNote
    
    ; Note finished - hide sprite
    LDA #$00
    STA NoteActive,X
    
    ; Hide the sprite
    LDA NoteSpriteIndex,X
    ASL                  ; * 2
    ASL                  ; * 4
    TAY
    LDA #$FF
    STA SpriteData,Y     ; Hide sprite
    JMP NextNoteSprite
    
AnimateNote:
    ; Animate the note sprite
    LDA NoteSpriteIndex,X
    ASL
    ASL
    TAY
    
    ; Pulsing animation
    LDA AnimPhase
    AND #$07             ; 8-frame pulse
    CMP #$04
    BCC PulseUp
    
    ; Pulse down
    LDA NotePosY,X
    CLC
    ADC #$02
    JMP StoreNoteY
    
PulseUp:
    LDA NotePosY,X
    SEC
    SBC #$02
    
StoreNoteY:
    STA SpriteData,Y     ; Update Y position
    
NextNoteSprite:
    DEX
    BPL UpdateNoteLoop
    RTS

UpdateVisualEffects:
    ; Update background visual effects
    LDA EffectTimer
    BEQ EffectsDone
    
    DEC EffectTimer
    
    ; Simple background sprite animation
    LDA AnimPhase
    LSR                  ; Slower animation
    AND #$0F             ; 16-frame cycle
    CLC
    ADC #$60             ; Base tile
    STA BackgroundTile
    
EffectsDone:
    RTS

UpdateGameLogic:
    ; Update overall game logic
    JSR UpdateSequencer
    JSR UpdateEffectTimers
    RTS

UpdateSequencer:
    ; Update music sequencer
    LDA AudioTimer
    BNE SequencerDone
    
    ; Check if we should play next note
    LDA DemoTimer
    AND #$1F
    BNE SequencerDone
    
    ; Time for next note handled in input
    
SequencerDone:
    RTS

UpdateEffectTimers:
    ; Update various effect timers
    LDA EffectTimer
    BNE EffectTimerDone
    
    ; Restart effect
    LDA #$40             ; 64 frame effect
    STA EffectTimer
    
EffectTimerDone:
    RTS

StartDemoSequence:
    ; Start the demo musical sequence
    LDA #$00
    STA SequencePosition
    LDA #$40
    STA EffectTimer
    RTS

ReadController:
    ; Simplified controller reading for demo
    LDA #$FF             ; No input (demo mode)
    RTS

; Musical data
NoteFrequencies:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E  ; C major scale

NoteFreqHigh:
    .byte $08, $08, $08, $08, $08, $08, $08, $08  ; High bytes

NotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88  ; Y positions (low to high)

NoteTiles:
    .byte $10, $11, $12, $13, $14, $15, $16, $17  ; Note tiles

DemoSequence:
    .byte $00, $02, $04, $05, $04, $02, $00, $FF  ; C-E-G-A-G-E-C

; Variables
CurrentButtons: .byte $FF
PreviousButtons: .byte $FF
NewPresses: .byte $00
CurrentNote: .byte $00
AudioTimer: .byte $00
ChannelActive: .byte $00
ActiveSprites: .byte $00
AnimPhase: .byte $00
EffectTimer: .byte $40
ActiveNoteCount: .byte $00
CurrentScale: .byte $00
SequencePosition: .byte $00
DemoStep: .byte $00
DemoTimer: .byte $00
BackgroundTile: .byte $60

; Note management arrays
NoteActive: .byte $00, $00, $00, $00, $00, $00, $00, $00
NoteTimers: .byte $00, $00, $00, $00, $00, $00, $00, $00
NoteSpriteIndex: .byte $00, $00, $00, $00, $00, $00, $00, $00
NoteSpriteY: .byte $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF

; Sprite data (32 sprites)
SpriteData:
    .byte $FF, $10, $01, $40  ; Note sprites start hidden
    .byte $FF, $11, $01, $48
    .byte $FF, $12, $01, $50
    .byte $FF, $13, $01, $58
    .byte $FF, $14, $01, $60
    .byte $FF, $15, $01, $68
    .byte $FF, $16, $01, $70
    .byte $FF, $17, $01, $78"
  language="assembly"
/>

## Musical Note Management System

Create a comprehensive system for managing musical notes and their visual representations:

```assembly
; Advanced note management system
NoteManager:
    .struct
        ActiveNotes: .byte          ; Bitmask of active notes (8 bits = 8 notes)
        NoteDurations: .byte * 8    ; Remaining duration for each note
        NoteVelocities: .byte * 8   ; Volume/intensity for each note
        VisualStates: .byte * 8     ; Visual animation state for each note
        SpriteIndices: .byte * 8    ; Sprite indices for each note
    .endstruct

CreateMusicalNote:
    ; Create a new musical note
    ; A = note index (0-7), X = duration, Y = velocity
    
    ; Check if note slot is available
    STA TempNoteIndex
    TAX
    LDA ActiveNotes
    AND NoteBitMasks,X
    BNE NoteSlotBusy        ; Note already active
    
    ; Activate note
    LDA ActiveNotes
    ORA NoteBitMasks,X
    STA ActiveNotes
    
    ; Set note properties
    LDX TempNoteIndex
    TYA                     ; Velocity
    STA NoteVelocities,X
    TXA                     ; Duration (passed in X)
    STA NoteDurations,X
    
    ; Initialize visual state
    LDA #$00
    STA VisualStates,X
    
    ; Create associated sprite
    JSR CreateNoteSprite
    
    ; Start audio for this note
    JSR StartNoteAudio
    
    RTS

NoteSlotBusy:
    ; Note slot already in use - could implement note replacement logic
    RTS

UpdateAllNotes:
    ; Update all active musical notes
    LDX #$07                ; 8 possible notes
    
UpdateNoteLoop:
    LDA ActiveNotes
    AND NoteBitMasks,X
    BEQ NextNote            ; Note not active
    
    ; Update this note
    JSR UpdateSingleNote
    
NextNote:
    DEX
    BPL UpdateNoteLoop
    RTS

UpdateSingleNote:
    ; Update note at index X
    ; Decrement duration
    LDA NoteDurations,X
    BEQ DeactivateNote      ; Duration expired
    
    DEC NoteDurations,X
    
    ; Update visual animation
    INC VisualStates,X
    
    ; Update sprite animation
    JSR UpdateNoteSprite
    
    ; Update audio envelope
    JSR UpdateNoteAudio
    
    RTS

DeactivateNote:
    ; Deactivate note at index X
    LDA ActiveNotes
    AND NoteBitMasks,X
    EOR #$FF                ; Invert bit mask
    AND ActiveNotes         ; Clear the bit
    STA ActiveNotes
    
    ; Hide associated sprite
    LDA SpriteIndices,X
    ASL
    ASL                     ; * 4 bytes per sprite
    TAY
    LDA #$FF                ; Y = 255 hides sprite
    STA SpriteData,Y
    
    ; Stop audio if no other notes active
    LDA ActiveNotes
    BNE SomeNotesActive
    JSR StopAllAudio
    
SomeNotesActive:
    RTS

NoteBitMasks:
    .byte %00000001, %00000010, %00000100, %00001000
    .byte %00010000, %00100000, %01000000, %10000000

TempNoteIndex: .byte $00
ActiveNotes: .byte $00
```

## Visual Feedback Coordination

Create sophisticated visual feedback that responds to musical elements:

```assembly
; Visual feedback coordination system
VisualCoordinator:
    .struct
        BeatPhase: .byte           ; Current beat phase (0-15)
        VisualizationType: .byte   ; Type of visualization
        IntensityLevel: .byte      ; Current visual intensity
        ColorPhase: .byte          ; Color cycling phase
        EffectMask: .byte          ; Active visual effects bitmask
    .endstruct

; Visualization types
VIZ_NOTES_ONLY = $00      ; Only show note sprites
VIZ_BEAT_PULSE = $01      ; Pulsing beat visualization
VIZ_SPECTRUM = $02        ; Frequency spectrum display
VIZ_PARTICLE = $03        ; Particle effects

UpdateVisualCoordination:
    ; Coordinate visuals with audio
    JSR UpdateBeatPhase
    JSR UpdateVisualizationEffects
    JSR UpdateColorCycling
    JSR UpdateParticleEffects
    RTS

UpdateBeatPhase:
    ; Track musical beat for visual sync
    INC BeatTimer
    LDA BeatTimer
    AND #$1F                ; 32-frame beat cycle
    STA BeatPhase
    
    ; Trigger beat visualization
    LDA BeatPhase
    BNE BeatPhaseDone
    JSR TriggerBeatVisual
    
BeatPhaseDone:
    RTS

TriggerBeatVisual:
    ; Create beat visualization effect
    LDA VisualizationType
    CMP #VIZ_BEAT_PULSE
    BNE BeatVisualDone
    
    ; Create pulsing beat sprites
    JSR CreateBeatPulseSprites
    
BeatVisualDone:
    RTS

CreateBeatPulseSprites:
    ; Create sprites that pulse with the beat
    LDX #$04                ; Start with sprite 4 (after note sprites)
    LDY #$00                ; Effect counter
    
BeatSpriteLoop:
    ; Position sprites in formation
    LDA BeatFormationX,Y
    STA SpriteData+3,X      ; X position
    LDA BeatFormationY,Y
    STA SpriteData+0,X      ; Y position
    LDA #$40                ; Beat effect tile
    STA SpriteData+1,X      ; Tile
    LDA #%00000010          ; Beat palette
    STA SpriteData+2,X      ; Attributes
    
    ; Next sprite
    TXA
    CLC
    ADC #$04
    TAX
    INY
    CPY #$04                ; 4 beat sprites
    BNE BeatSpriteLoop
    
    ; Set beat effect duration
    LDA #$10                ; 16 frames
    STA BeatEffectTimer
    
    RTS

UpdateVisualizationEffects:
    ; Update active visual effects
    LDA BeatEffectTimer
    BEQ VisualizationDone
    
    DEC BeatEffectTimer
    
    ; Animate beat effect sprites
    JSR AnimateBeatSprites
    
    ; Check if effect finished
    LDA BeatEffectTimer
    BNE VisualizationDone
    
    ; Hide beat sprites
    JSR HideBeatSprites
    
VisualizationDone:
    RTS

AnimateBeatSprites:
    ; Animate beat effect sprites
    LDA #$10
    SEC
    SBC BeatEffectTimer     ; Calculate expansion
    STA ExpansionRadius
    
    ; Update beat sprite positions
    LDX #$10                ; Sprite 4 data offset
    LDY #$00                ; Formation index
    
AnimateBeatLoop:
    ; Expand from center
    LDA #$80                ; Center X
    CLC
    ADC BeatExpansionX,Y
    CLC
    ADC ExpansionRadius
    STA SpriteData+3,X
    
    LDA #$80                ; Center Y
    CLC
    ADC BeatExpansionY,Y
    CLC
    ADC ExpansionRadius
    STA SpriteData+0,X
    
    ; Next sprite
    TXA
    CLC
    ADC #$04
    TAX
    INY
    CPY #$04
    BNE AnimateBeatLoop
    
    RTS

HideBeatSprites:
    ; Hide beat effect sprites
    LDX #$10                ; Start at sprite 4
    LDY #$04                ; 4 sprites to hide
    
HideBeatLoop:
    LDA #$FF                ; Y = 255 hides sprite
    STA SpriteData,X
    TXA
    CLC
    ADC #$04
    TAX
    DEY
    BNE HideBeatLoop
    
    RTS

; Beat formation data
BeatFormationX: .byte $80, $90, $80, $70    ; X positions relative to center
BeatFormationY: .byte $70, $80, $90, $80    ; Y positions relative to center

BeatExpansionX: .byte $00, $08, $00, $F8    ; X expansion vectors
BeatExpansionY: .byte $F8, $00, $08, $00    ; Y expansion vectors

; Visual coordination variables
BeatTimer: .byte $00
BeatPhase: .byte $00
VisualizationType: .byte VIZ_NOTES_ONLY
IntensityLevel: .byte $08
ColorPhase: .byte $00
EffectMask: .byte $00
BeatEffectTimer: .byte $00
ExpansionRadius: .byte $00
```

## Interactive Control Foundation

Build the foundation for interactive musical control:

```assembly
; Interactive control system
InteractionMode: .byte $00

; Interaction modes
MODE_DEMO = $00           ; Automatic demonstration
MODE_PLAY = $01           ; Interactive note playing
MODE_SEQUENCE = $02       ; Sequence editing
MODE_SCALE = $03          ; Scale selection

ProcessInteractiveInput:
    ; Process input based on current mode
    LDA InteractionMode
    CMP #MODE_DEMO
    BEQ ProcessDemoMode
    CMP #MODE_PLAY
    BEQ ProcessPlayMode
    CMP #MODE_SEQUENCE
    BEQ ProcessSequenceMode
    CMP #MODE_SCALE
    BEQ ProcessScaleMode
    RTS

ProcessDemoMode:
    ; Demo mode - check for mode switch
    LDA NewPresses
    AND #%10000000          ; A button
    BEQ DemoModeDone
    
    ; Switch to play mode
    LDA #MODE_PLAY
    STA InteractionMode
    JSR InitPlayMode
    
DemoModeDone:
    RTS

ProcessPlayMode:
    ; Interactive playing mode
    LDA NewPresses
    AND #%00001111          ; Directional buttons
    BEQ CheckPlayModeSwitch
    
    ; Map directions to notes
    JSR MapInputToNote
    JSR PlayInteractiveNote
    
CheckPlayModeSwitch:
    LDA NewPresses
    AND #%01000000          ; B button
    BEQ PlayModeDone
    
    ; Switch to sequence mode
    LDA #MODE_SEQUENCE
    STA InteractionMode
    JSR InitSequenceMode
    
PlayModeDone:
    RTS

MapInputToNote:
    ; Map directional input to musical notes
    LDA NewPresses
    AND #%00001000          ; Up
    BEQ CheckDown
    LDA #$07                ; Highest note
    JMP StoreSelectedNote
    
CheckDown:
    LDA NewPresses
    AND #%00000100          ; Down
    BEQ CheckLeft
    LDA #$00                ; Lowest note
    JMP StoreSelectedNote
    
CheckLeft:
    LDA NewPresses
    AND #%00000010          ; Left
    BEQ CheckRight
    LDA #$02                ; Mid-low note
    JMP StoreSelectedNote
    
CheckRight:
    LDA NewPresses
    AND #%00000001          ; Right
    BEQ NoNoteSelected
    LDA #$05                ; Mid-high note
    
StoreSelectedNote:
    STA SelectedNote
    RTS
    
NoNoteSelected:
    LDA #$FF                ; No note
    STA SelectedNote
    RTS

PlayInteractiveNote:
    ; Play the selected note interactively
    LDA SelectedNote
    CMP #$FF
    BEQ InteractiveNoteDone
    
    ; Create note with user timing
    TAX                     ; Note index
    LDA #$30                ; Default duration
    TAY                     ; Duration in Y
    LDA #$08                ; Default velocity
    TAX                     ; Velocity in X
    LDA SelectedNote        ; Note index in A
    JSR CreateMusicalNote
    
InteractiveNoteDone:
    RTS

InitPlayMode:
    ; Initialize interactive play mode
    LDA #$FF
    STA SelectedNote
    
    ; Visual feedback for mode change
    JSR ShowPlayModeIndicator
    RTS

InitSequenceMode:
    ; Initialize sequence editing mode
    LDA #$00
    STA SequenceEditPosition
    STA SequenceLength
    
    ; Visual feedback for mode change
    JSR ShowSequenceModeIndicator
    RTS

ShowPlayModeIndicator:
    ; Show visual indicator for play mode
    LDA #$30                ; Top of screen
    STA SpriteData+32       ; Mode indicator sprite Y
    LDA #$50                ; 'P' for Play
    STA SpriteData+33       ; Tile
    LDA #%00000011          ; Mode palette
    STA SpriteData+34       ; Attributes
    LDA #$10                ; Left side
    STA SpriteData+35       ; X position
    RTS

ShowSequenceModeIndicator:
    ; Show visual indicator for sequence mode
    LDA #$30
    STA SpriteData+32       ; Mode indicator sprite Y
    LDA #$53                ; 'S' for Sequence
    STA SpriteData+33       ; Tile
    LDA #%00000011          ; Mode palette
    STA SpriteData+34       ; Attributes
    LDA #$10                ; Left side
    STA SpriteData+35       ; X position
    RTS

; Interactive control variables
SelectedNote: .byte $FF
SequenceEditPosition: .byte $00
SequenceLength: .byte $00
```

## Practice Exercise

Create the complete Sprite Symphony foundation that integrates all systems:

1. Implement the core architecture with all major subsystems
2. Create the musical note management system with visual coordination
3. Add interactive control modes with input mapping
4. Build visual feedback that responds to audio timing
5. Integrate everything into a working musical application foundation

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Complete Sprite Symphony Foundation"
  code="; Complete Sprite Symphony foundation implementation
Main:
    JSR InitSpriteSymphony
    
MainLoop:
    JSR UpdateInput
    JSR UpdateAudioSystem
    JSR UpdateVisualSystem
    JSR UpdateInteraction
    JMP MainLoop

InitSpriteSymphony:
    ; Initialize complete Sprite Symphony system
    JSR InitAudio
    JSR InitVisuals
    JSR InitNotes
    JSR InitInteraction
    JSR StartDemoSequence
    RTS

InitAudio:
    ; Initialize audio system
    LDA #%00000001       ; Enable pulse 1
    STA $4015
    
    LDA #$00
    STA AudioChannel
    STA MasterVolume
    STA CurrentTone
    
    ; Set up pulse channel
    LDA #%10111111       ; Duty, envelope
    STA $4000
    LDA #%00000000       ; No sweep
    STA $4001
    RTS

InitVisuals:
    ; Initialize visual system
    LDA #$00
    STA VisualMode
    STA AnimationPhase
    STA EffectActive
    
    ; Clear all sprites
    LDX #$00
    LDA #$FF
ClearAllSprites:
    STA SpriteOAM,X
    INX
    INX
    INX
    INX
    CPX #$80             ; 32 sprites max
    BNE ClearAllSprites
    
    ; Initialize background effects
    JSR InitBackgroundEffects
    RTS

InitNotes:
    ; Initialize note management
    LDA #$00
    STA ActiveNotesMask
    STA NoteSequencePos
    STA SequenceTimer
    
    ; Clear note data
    LDX #$07
ClearNoteData:
    LDA #$00
    STA NoteDuration,X
    STA NoteVelocity,X
    LDA #$FF
    STA NoteSpriteY,X
    DEX
    BPL ClearNoteData
    
    RTS

InitInteraction:
    ; Initialize interaction system
    LDA #$00             ; Start in demo mode
    STA InteractionMode
    STA UserInput
    STA PrevInput
    
    ; Set up mode indicator
    JSR UpdateModeDisplay
    RTS

InitBackgroundEffects:
    ; Set up background visual effects
    LDA #$20             ; Background effect sprite
    STA SpriteOAM+64     ; Y position
    LDA #$60             ; Effect tile
    STA SpriteOAM+65     ; Tile
    LDA #%00000010       ; Background palette
    STA SpriteOAM+66     ; Attributes
    LDA #$F0             ; Right side
    STA SpriteOAM+67     ; X position
    RTS

UpdateInput:
    ; Update input system
    LDA UserInput
    STA PrevInput
    JSR ReadController
    STA UserInput
    
    ; Calculate new presses
    EOR PrevInput
    AND UserInput
    STA NewInputs
    
    ; Process mode-specific input
    JSR ProcessModeInput
    RTS

ProcessModeInput:
    ; Process input based on current mode
    LDA InteractionMode
    BNE CheckPlayMode
    
    ; Demo mode
    JSR ProcessDemoInput
    RTS
    
CheckPlayMode:
    CMP #$01
    BNE CheckSequenceMode
    
    ; Play mode
    JSR ProcessPlayInput
    RTS
    
CheckSequenceMode:
    ; Future: sequence mode
    RTS

ProcessDemoInput:
    ; Auto-generate demo input
    INC SequenceTimer
    LDA SequenceTimer
    AND #$1F             ; Every 32 frames
    BNE CheckModeSwitch
    
    ; Play next demo note
    JSR PlayDemoNote
    
CheckModeSwitch:
    ; Check for mode switch
    LDA NewInputs
    AND #%10000000       ; A button
    BEQ DemoInputDone
    
    ; Switch to play mode
    LDA #$01
    STA InteractionMode
    JSR UpdateModeDisplay
    
DemoInputDone:
    RTS

ProcessPlayInput:
    ; Process interactive play input
    LDA NewInputs
    AND #%00001111       ; Directions
    BEQ CheckPlayModeSwitch
    
    ; Map input to note
    JSR MapInputToNote
    JSR PlayUserNote
    
CheckPlayModeSwitch:
    LDA NewInputs
    AND #%01000000       ; B button
    BEQ PlayInputDone
    
    ; Switch back to demo
    LDA #$00
    STA InteractionMode
    JSR UpdateModeDisplay
    
PlayInputDone:
    RTS

PlayDemoNote:
    ; Play next note in demo sequence
    LDX NoteSequencePos
    LDA DemoScale,X
    CMP #$FF             ; End marker?
    BEQ ResetDemoSequence
    
    ; Play this note
    JSR CreateNote
    
    ; Advance sequence
    INC NoteSequencePos
    RTS
    
ResetDemoSequence:
    LDA #$00
    STA NoteSequencePos
    RTS

MapInputToNote:
    ; Map directional input to notes
    LDA NewInputs
    AND #%00001000       ; Up
    BEQ CheckDownInput
    LDA #$07             ; High note
    JMP StoreNote
    
CheckDownInput:
    LDA NewInputs
    AND #%00000100       ; Down
    BEQ CheckLeftInput
    LDA #$00             ; Low note
    JMP StoreNote
    
CheckLeftInput:
    LDA NewInputs
    AND #%00000010       ; Left
    BEQ CheckRightInput
    LDA #$02             ; Mid-low note
    JMP StoreNote
    
CheckRightInput:
    LDA NewInputs
    AND #%00000001       ; Right
    BEQ NoNote
    LDA #$05             ; Mid-high note
    JMP StoreNote
    
NoNote:
    LDA #$FF
    
StoreNote:
    STA SelectedNote
    RTS

PlayUserNote:
    ; Play user-selected note
    LDA SelectedNote
    CMP #$FF
    BEQ UserNoteDone
    
    JSR CreateNote
    
UserNoteDone:
    RTS

CreateNote:
    ; Create musical note (A = note index)
    TAX
    
    ; Set audio frequency
    LDA ScaleFreqLow,X
    STA $4002
    LDA ScaleFreqHigh,X
    STA $4003
    
    ; Reset envelope
    LDA #%10111111
    STA $4000
    
    ; Set note duration
    LDA #$20
    STA NoteDuration,X
    
    ; Create visual note
    JSR CreateNoteVisual
    
    ; Mark note as active
    LDA NoteBitMask,X
    ORA ActiveNotesMask
    STA ActiveNotesMask
    
    RTS

CreateNoteVisual:
    ; Create visual sprite for note X
    ; Find sprite slot
    TXA
    ASL
    ASL                  ; * 4 bytes per sprite
    TAY
    
    ; Set sprite data
    LDA ScalePosY,X      ; Y position based on pitch
    STA SpriteOAM,Y
    LDA ScaleTiles,X     ; Tile based on note
    STA SpriteOAM+1,Y
    LDA #%00000001       ; Note palette
    STA SpriteOAM+2,Y
    
    ; X position based on sequence or input
    LDA InteractionMode
    BNE UserNotePos
    
    ; Demo mode - position by sequence
    LDA NoteSequencePos
    ASL
    ASL
    ASL                  ; * 8
    CLC
    ADC #$40
    JMP StoreNoteX
    
UserNotePos:
    ; User mode - center position
    LDA #$80
    
StoreNoteX:
    STA SpriteOAM+3,Y
    RTS

UpdateAudioSystem:
    ; Update audio for all active notes
    LDX #$07
UpdateAudioLoop:
    LDA NoteBitMask,X
    AND ActiveNotesMask
    BEQ NextAudioNote
    
    ; Update this note's duration
    DEC NoteDuration,X
    LDA NoteDuration,X
    BNE NextAudioNote
    
    ; Note finished
    LDA NoteBitMask,X
    EOR #$FF
    AND ActiveNotesMask
    STA ActiveNotesMask
    
    ; Hide visual
    TXA
    ASL
    ASL
    TAY
    LDA #$FF
    STA SpriteOAM,Y
    
NextAudioNote:
    DEX
    BPL UpdateAudioLoop
    
    ; Check if any notes still active
    LDA ActiveNotesMask
    BNE AudioSystemDone
    
    ; No notes active - silence audio
    LDA #$00
    STA $4000
    
AudioSystemDone:
    RTS

UpdateVisualSystem:
    ; Update visual effects
    INC AnimationPhase
    JSR UpdateBackgroundEffects
    JSR UpdateNoteAnimations
    RTS

UpdateBackgroundEffects:
    ; Update background visual effects
    LDA AnimationPhase
    AND #$0F             ; 16-frame cycle
    CLC
    ADC #$60             ; Base tile
    STA SpriteOAM+65     ; Background effect tile
    
    ; Pulse position
    LDA AnimationPhase
    AND #$07
    CMP #$04
    BCC BGEffectUp
    
    LDA #$24             ; Lower position
    JMP StoreBGY
    
BGEffectUp:
    LDA #$1C             ; Higher position
    
StoreBGY:
    STA SpriteOAM+64
    RTS

UpdateNoteAnimations:
    ; Animate active note sprites
    LDX #$07
AnimateLoop:
    LDA NoteBitMask,X
    AND ActiveNotesMask
    BEQ NextAnimation
    
    ; Animate this note
    TXA
    ASL
    ASL
    TAY
    
    ; Pulsing animation
    LDA AnimationPhase
    AND #$07
    CMP #$04
    BCC NotePulseUp
    
    LDA ScalePosY,X
    CLC
    ADC #$02
    JMP StoreNoteY
    
NotePulseUp:
    LDA ScalePosY,X
    SEC
    SBC #$02
    
StoreNoteY:
    STA SpriteOAM,Y
    
NextAnimation:
    DEX
    BPL AnimateLoop
    RTS

UpdateInteraction:
    ; Update interaction system
    JSR UpdateModeEffects
    RTS

UpdateModeEffects:
    ; Update visual effects based on mode
    LDA InteractionMode
    BNE PlayModeEffects
    
    ; Demo mode effects
    LDA AnimationPhase
    AND #$1F
    BNE ModeEffectsDone
    JSR TriggerDemoEffect
    JMP ModeEffectsDone
    
PlayModeEffects:
    ; Play mode effects
    LDA NewInputs
    BEQ ModeEffectsDone
    JSR TriggerInputEffect
    
ModeEffectsDone:
    RTS

TriggerDemoEffect:
    ; Trigger demo visual effect
    LDA #$10
    STA EffectTimer
    RTS

TriggerInputEffect:
    ; Trigger input visual effect
    LDA #$08
    STA EffectTimer
    RTS

UpdateModeDisplay:
    ; Update mode indicator sprite
    LDA InteractionMode
    BNE ShowPlayMode
    
    ; Demo mode
    LDA #$44             ; 'D' tile
    JMP StoreModeIndicator
    
ShowPlayMode:
    ; Play mode
    LDA #$50             ; 'P' tile
    
StoreModeIndicator:
    STA SpriteOAM+69     ; Mode indicator tile
    
    ; Position mode indicator
    LDA #$20
    STA SpriteOAM+68     ; Y position
    LDA #%00000011       ; Mode palette
    STA SpriteOAM+70     ; Attributes
    LDA #$10
    STA SpriteOAM+71     ; X position
    RTS

StartDemoSequence:
    ; Start demo sequence
    LDA #$00
    STA NoteSequencePos
    JSR UpdateModeDisplay
    RTS

ReadController:
    ; Simulate controller input
    LDA SequenceTimer
    AND #$3F             ; 64-frame cycle
    CMP #$20
    BEQ SimA
    CMP #$30
    BEQ SimUp
    CMP #$40
    BEQ SimB
    LDA #$FF             ; No input
    RTS
    
SimA:
    LDA #%01111111       ; A pressed
    RTS
    
SimUp:
    LDA #%11110111       ; Up pressed
    RTS
    
SimB:
    LDA #%10111111       ; B pressed
    RTS

; Musical data
DemoScale:
    .byte $00, $02, $04, $05, $07, $05, $04, $02, $FF

ScaleFreqLow:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

ScaleFreqHigh:
    .byte $08, $08, $08, $08, $08, $08, $08, $08

ScalePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

ScaleTiles:
    .byte $10, $11, $12, $13, $14, $15, $16, $17

NoteBitMask:
    .byte %00000001, %00000010, %00000100, %00001000
    .byte %00010000, %00100000, %01000000, %10000000

; Variables
AudioChannel: .byte $00
MasterVolume: .byte $08
CurrentTone: .byte $00
VisualMode: .byte $00
AnimationPhase: .byte $00
EffectActive: .byte $00
EffectTimer: .byte $00
ActiveNotesMask: .byte $00
NoteSequencePos: .byte $00
SequenceTimer: .byte $00
InteractionMode: .byte $00
UserInput: .byte $FF
PrevInput: .byte $FF
NewInputs: .byte $00
SelectedNote: .byte $FF

; Note data arrays
NoteDuration: .byte $00, $00, $00, $00, $00, $00, $00, $00
NoteVelocity: .byte $00, $00, $00, $00, $00, $00, $00, $00
NoteSpriteY: .byte $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF

; Sprite OAM data (32 sprites)
SpriteOAM:
    .byte $FF, $10, $01, $40  ; Note sprites
    .byte $FF, $11, $01, $48
    .byte $FF, $12, $01, $50
    .byte $FF, $13, $01, $58
    .byte $FF, $14, $01, $60
    .byte $FF, $15, $01, $68
    .byte $FF, $16, $01, $70
    .byte $FF, $17, $01, $78
    .byte $FF, $FF, $FF, $FF  ; Additional sprites
    .byte $FF, $FF, $FF, $FF
    .byte $FF, $FF, $FF, $FF
    .byte $FF, $FF, $FF, $FF
    .byte $FF, $FF, $FF, $FF
    .byte $FF, $FF, $FF, $FF
    .byte $FF, $FF, $FF, $FF
    .byte $FF, $FF, $FF, $FF
    .byte $20, $60, $02, $F0  ; Background effect
    .byte $20, $44, $03, $10  ; Mode indicator"
  language="assembly"
/>

## What You've Learned

In this essential lesson, you've built the complete foundation for Sprite Symphony:

- Designed a comprehensive application architecture integrating all NES subsystems
- Created sophisticated musical note management with visual coordination
- Built interactive control modes with input mapping and mode switching
- Implemented visual feedback systems that respond to audio timing
- Established the project structure for future development and expansion
- Applied all Phase 1 concepts in a real, working application

## Looking Ahead

In the next lesson, you'll add interactive note playing capabilities to Sprite Symphony, allowing real-time musical creation and experimentation with the foundation you've built!

## Fun Fact

The Sprite Symphony architecture you've created follows the same design patterns used in professional music software and game audio engines. The separation of audio, visual, and input systems with coordinated communication between them is how modern Digital Audio Workstations (DAWs) and music games are built. The real-time coordination between audio generation and visual feedback you've implemented represents the core challenge of all interactive audio applications - from simple music games to complex music production software!