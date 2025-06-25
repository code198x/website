---
title: "Building Your First NES Game"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 30
description: "Complete Sprite Symphony as your first fully-featured NES game! Integrate all Phase 1 concepts into a polished, playable application with multiple game modes, complete user interface, and professional game flow."
learning_objectives:
  - "Integrate all Phase 1 NES programming concepts into a complete game"
  - "Implement multiple game modes with smooth transitions"
  - "Create polished user interfaces and game flow"
  - "Add game-like features including menus, scoring, and progression"
  - "Build a complete, professional-quality NES application"
concepts:
  - "Complete game architecture and integration"
  - "Professional game development workflows"
  - "User experience design for interactive applications"
  - "Game state management and flow control"
  - "Polish, testing, and final application delivery"
estimated_duration: "45-60 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 30
---

# Lesson 30: Building Your First NES Game

Complete your first professional NES game! This lesson brings together everything you've learned to create Sprite Symphony - a fully-featured musical game with multiple modes, polished interface, and complete game flow that demonstrates mastery of NES development.

## Complete Game Architecture

Design Sprite Symphony as a complete game with multiple modes and professional flow:

```text
Sprite Symphony - Complete Game Design
=====================================

Game Modes:
1. Demo Mode: Automatic musical demonstration
2. Play Mode: Interactive note playing and jamming
3. Compose Mode: Create and edit musical sequences
4. Challenge Mode: Musical mini-games and challenges

Core Systems:
- Main Menu with mode selection
- Game state management with smooth transitions
- Audio engine with polyphonic playback
- Visual feedback with sprite animations
- Input system with multiple control schemes
- Save/load system for compositions
- Scoring and progression tracking

User Experience Flow:
Title Screen → Main Menu → Mode Selection → Gameplay → Results → Menu
```

Main game architecture with complete system integration:

```assembly
; Sprite Symphony - Complete Game Architecture
; ============================================

; Game mode constants
MODE_TITLE    = $00
MODE_MENU     = $01
MODE_DEMO     = $02
MODE_PLAY     = $03
MODE_COMPOSE  = $04
MODE_CHALLENGE = $05
MODE_RESULTS  = $06

; System state structure
GameSystem:
    .struct
        CurrentMode: .byte          ; Active game mode
        PreviousMode: .byte         ; Previous mode for transitions
        TransitionType: .byte       ; Type of transition
        TransitionTimer: .byte      ; Transition timing
        GameTimer: .byte            ; Global game timer
        Score: .word                ; Current score (2 bytes)
        HighScore: .word            ; High score
        PlayerLevel: .byte          ; Player progression level
        UnlockedModes: .byte        ; Bitmask of unlocked modes
    .endstruct

; Audio system enhanced for complete game
AudioSystem:
    .struct
        MasterVolume: .byte         ; Global volume control
        MusicTrack: .byte           ; Current background music
        SFXChannel: .byte           ; Sound effects channel
        SequenceBank: .byte         ; Current sequence bank
        TempoSetting: .byte         ; Global tempo
        KeySignature: .byte         ; Musical key
    .endstruct

; Visual system for complete game
VisualSystem:
    .struct
        BackgroundMode: .byte       ; Background visual style
        ParticleSystem: .byte       ; Particle effects state
        ColorScheme: .byte          ; Current color palette
        AnimationSpeed: .byte       ; Global animation rate
        EffectIntensity: .byte      ; Visual effects intensity
        UIMode: .byte               ; User interface mode
    .endstruct

InitCompleteGame:
    ; Initialize complete Sprite Symphony game
    JSR InitHardware
    JSR InitGameSystems
    JSR InitAudioEngine
    JSR InitVisualEngine
    JSR InitUserInterface
    JSR LoadGameData
    
    ; Start in title mode
    LDA #MODE_TITLE
    STA CurrentMode
    JSR InitTitleMode
    
    RTS

MainGameLoop:
    ; Main game loop with complete system updates
    JSR UpdateInput
    JSR UpdateCurrentMode
    JSR UpdateAudioEngine
    JSR UpdateVisualEngine
    JSR UpdateTransitions
    JSR UpdateUI
    JSR RenderFrame
    
    JMP MainGameLoop
```

**Complete Game Architecture Foundation:**

```assembly
; Sprite Symphony - Complete Game Foundation
Main:
    JSR InitGame
    
GameLoop:
    JSR UpdateInput
    JSR UpdateGameMode
    JSR UpdateAudio
    JSR UpdateVisuals
    JSR UpdateUI
    JMP GameLoop

InitGame:
    ; Initialize complete game
    JSR InitSystems
    JSR InitData
    JSR SetupInitialMode
    RTS

InitSystems:
    ; Initialize all game systems
    LDA #%00001111       ; Enable all audio
    STA $4015
    
    ; Initialize game state
    LDA #$00             ; Start in title mode
    STA GameMode
    STA GameTimer
    STA TransitionActive
    STA MenuCursor
    
    ; Initialize scores
    LDA #$00
    STA Score
    STA Score+1
    LDA #$50             ; Default high score
    STA HighScore
    STA HighScore+1
    
    ; Initialize player progress
    LDA #$01             ; Start with just demo unlocked
    STA UnlockedModes
    LDA #$01             ; Player level 1
    STA PlayerLevel
    
    RTS

InitData:
    ; Initialize game data
    JSR LoadMusicData
    JSR InitVisualData
    JSR SetupMenuData
    RTS

LoadMusicData:
    ; Load musical scales and sequences
    LDX #$07
LoadScaleLoop:
    LDA DefaultScale,X
    STA CurrentScale,X
    DEX
    BPL LoadScaleLoop
    
    ; Load demo sequence
    LDX #$0F
LoadSequenceLoop:
    LDA DemoSequence,X
    STA GameSequence,X
    DEX
    BPL LoadSequenceLoop
    RTS

InitVisualData:
    ; Initialize visual system
    LDA #$00
    STA VisualMode
    STA ParticleCount
    STA EffectTimer
    
    ; Clear sprites
    LDX #$00
    LDA #$FF
ClearSpriteLoop:
    STA SpriteOAM,X
    INX
    INX
    INX
    INX
    CPX #$80
    BNE ClearSpriteLoop
    RTS

SetupMenuData:
    ; Setup menu system
    LDA #$04             ; 4 menu options
    STA MenuItems
    LDA #$00
    STA MenuCursor
    
    ; Menu item positions
    LDX #$03
MenuPosLoop:
    LDA MenuYPositions,X
    STA MenuItemY,X
    DEX
    BPL MenuPosLoop
    RTS

SetupInitialMode:
    ; Setup title screen
    JSR InitTitleScreen
    RTS

UpdateInput:
    ; Update input system
    LDA CurrentInput
    STA PreviousInput
    JSR ReadController
    STA CurrentInput
    
    ; Calculate new presses
    EOR PreviousInput
    AND CurrentInput
    STA NewPresses
    RTS

UpdateGameMode:
    ; Update based on current game mode
    LDA GameMode
    CMP #$00             ; Title
    BEQ UpdateTitle
    CMP #$01             ; Menu
    BEQ UpdateMenu
    CMP #$02             ; Demo
    BEQ UpdateDemo
    CMP #$03             ; Play
    BEQ UpdatePlay
    RTS

UpdateTitle:
    ; Update title screen
    INC GameTimer
    JSR ProcessTitleInput
    
    ; Auto-advance after delay
    LDA GameTimer
    CMP #$78             ; 2 seconds
    BNE TitleDone
    JSR TransitionToMenu
    
TitleDone:
    RTS

ProcessTitleInput:
    ; Process title screen input
    LDA NewPresses
    AND #%10000000       ; A button
    BEQ TitleInputDone
    JSR TransitionToMenu
    
TitleInputDone:
    RTS

TransitionToMenu:
    ; Transition to main menu
    LDA #$01             ; Menu mode
    STA TargetMode
    JSR StartTransition
    RTS

UpdateMenu:
    ; Update main menu
    JSR ProcessMenuInput
    JSR UpdateMenuVisuals
    RTS

ProcessMenuInput:
    ; Process menu navigation
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ CheckMenuDown
    
    LDA MenuCursor
    BEQ WrapMenuUp
    DEC MenuCursor
    JSR PlayMenuSound
    JMP MenuInputDone
    
WrapMenuUp:
    LDA MenuItems
    SEC
    SBC #$01
    STA MenuCursor
    JSR PlayMenuSound
    JMP MenuInputDone
    
CheckMenuDown:
    LDA NewPresses
    AND #%00000100       ; Down
    BEQ CheckMenuSelect
    
    LDA MenuCursor
    CMP MenuItems
    BEQ WrapMenuDown
    INC MenuCursor
    JSR PlayMenuSound
    JMP MenuInputDone
    
WrapMenuDown:
    LDA #$00
    STA MenuCursor
    JSR PlayMenuSound
    JMP MenuInputDone
    
CheckMenuSelect:
    LDA NewPresses
    AND #%10000000       ; A button
    BEQ MenuInputDone
    
    JSR SelectMenuItem
    
MenuInputDone:
    RTS

SelectMenuItem:
    ; Select current menu item
    LDA MenuCursor
    CMP #$00
    BEQ SelectDemo
    CMP #$01
    BEQ SelectPlay
    CMP #$02
    BEQ SelectCompose
    CMP #$03
    BEQ SelectChallenge
    RTS

SelectDemo:
    LDA #$02             ; Demo mode
    STA TargetMode
    JSR StartTransition
    RTS

SelectPlay:
    ; Check if unlocked
    LDA UnlockedModes
    AND #%00000010       ; Play mode bit
    BEQ MenuSelectDone
    
    LDA #$03             ; Play mode
    STA TargetMode
    JSR StartTransition
    
MenuSelectDone:
    RTS

SelectCompose:
    ; Check if unlocked
    LDA UnlockedModes
    AND #%00000100       ; Compose mode bit
    BEQ MenuSelectDone
    
    LDA #$04             ; Compose mode
    STA TargetMode
    JSR StartTransition
    RTS

SelectChallenge:
    ; Check if unlocked
    LDA UnlockedModes
    AND #%00001000       ; Challenge mode bit
    BEQ MenuSelectDone
    
    LDA #$05             ; Challenge mode
    STA TargetMode
    JSR StartTransition
    RTS

UpdateDemo:
    ; Update demo mode
    INC GameTimer
    JSR PlayDemoSequence
    JSR ProcessDemoInput
    RTS

PlayDemoSequence:
    ; Play automatic demo sequence
    LDA GameTimer
    AND #$1F             ; Every 32 frames
    BNE DemoSequenceDone
    
    LDX SequencePosition
    LDA GameSequence,X
    CMP #$FF             ; End marker?
    BEQ ResetDemoSequence
    
    JSR PlayNote
    INC SequencePosition
    JMP DemoSequenceDone
    
ResetDemoSequence:
    LDA #$00
    STA SequencePosition
    
DemoSequenceDone:
    RTS

ProcessDemoInput:
    ; Process input during demo
    LDA NewPresses
    AND #%01000000       ; B button to return
    BEQ DemoInputDone
    
    ; Return to menu
    LDA #$01             ; Menu mode
    STA TargetMode
    JSR StartTransition
    
    ; Unlock play mode
    LDA UnlockedModes
    ORA #%00000010
    STA UnlockedModes
    
DemoInputDone:
    RTS

UpdatePlay:
    ; Update interactive play mode
    JSR ProcessPlayInput
    JSR UpdatePlayVisuals
    JSR UpdateScore
    RTS

ProcessPlayInput:
    ; Process interactive play input
    LDA NewPresses
    AND #%00001111       ; Directions
    BEQ CheckPlayExit
    
    JSR MapInputToNote
    CMP #$FF
    BEQ CheckPlayExit
    
    JSR PlayInteractiveNote
    JSR AddToScore
    
CheckPlayExit:
    LDA NewPresses
    AND #%01000000       ; B to exit
    BEQ PlayInputDone
    
    LDA #$01             ; Return to menu
    STA TargetMode
    JSR StartTransition
    
PlayInputDone:
    RTS

MapInputToNote:
    ; Map input to musical note
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ CheckPlayDown
    LDA #$07
    RTS
    
CheckPlayDown:
    LDA NewPresses
    AND #%00000100       ; Down
    BEQ CheckPlayLeft
    LDA #$00
    RTS
    
CheckPlayLeft:
    LDA NewPresses
    AND #%00000010       ; Left
    BEQ CheckPlayRight
    LDA #$02
    RTS
    
CheckPlayRight:
    LDA NewPresses
    AND #%00000001       ; Right
    BEQ NoPlayNote
    LDA #$04
    RTS
    
NoPlayNote:
    LDA #$FF
    RTS

PlayInteractiveNote:
    ; Play note with scoring
    JSR PlayNote
    JSR CreateNoteVisual
    
    ; Check for combo scoring
    JSR CheckCombo
    RTS

PlayNote:
    ; Play musical note A
    TAX
    LDA CurrentScale,X
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Set note timer
    LDA #$20
    STA NoteTimer
    RTS

CreateNoteVisual:
    ; Create visual for played note
    TAY
    TYA
    ASL
    ASL
    TAX
    
    LDA NotePosY,Y
    STA SpriteOAM,X
    LDA NoteTiles,Y
    STA SpriteOAM+1,X
    LDA #%00000001
    STA SpriteOAM+2,X
    LDA #$80
    STA SpriteOAM+3,X
    RTS

AddToScore:
    ; Add points to score
    LDA Score
    CLC
    ADC #$10
    STA Score
    LDA Score+1
    ADC #$00
    STA Score+1
    RTS

CheckCombo:
    ; Check for note combinations (future feature)
    RTS

UpdateScore:
    ; Update score display
    JSR DisplayScore
    JSR CheckNewHighScore
    RTS

DisplayScore:
    ; Display current score
    ; Convert score to display format
    LDA Score+1
    STA ScoreDisplay+1
    LDA Score
    STA ScoreDisplay
    RTS

CheckNewHighScore:
    ; Check if new high score achieved
    LDA Score+1
    CMP HighScore+1
    BCC NoNewHighScore
    BNE NewHighScore
    
    LDA Score
    CMP HighScore
    BCC NoNewHighScore
    
NewHighScore:
    ; New high score!
    LDA Score
    STA HighScore
    LDA Score+1
    STA HighScore+1
    
    ; Unlock compose mode
    LDA UnlockedModes
    ORA #%00000100
    STA UnlockedModes
    
NoNewHighScore:
    RTS

StartTransition:
    ; Start mode transition
    LDA #$01
    STA TransitionActive
    LDA #$20             ; 32 frame transition
    STA TransitionTimer
    RTS

UpdateAudio:
    ; Update audio system
    LDA NoteTimer
    BEQ AudioSilent
    
    DEC NoteTimer
    LDA NoteTimer
    BNE AudioDone
    
    ; Note finished
    LDA #$00
    STA $4000
    JMP AudioDone
    
AudioSilent:
    LDA #$00
    STA $4000
    
AudioDone:
    RTS

UpdateVisuals:
    ; Update visual system
    INC VisualCounter
    JSR UpdateSprites
    JSR UpdateEffects
    RTS

UpdateSprites:
    ; Update sprite animations
    LDA NoteTimer
    BEQ HideNoteSprites
    
    ; Animate active note
    LDA VisualCounter
    AND #$07
    CMP #$04
    BCC NotePulseUp
    
    ; Pulse effect
    RTS
    
NotePulseUp:
    RTS
    
HideNoteSprites:
    ; Hide finished note sprites
    LDA #$FF
    STA SpriteOAM+0
    RTS

UpdateEffects:
    ; Update visual effects
    LDA EffectTimer
    BEQ EffectsDone
    
    DEC EffectTimer
    
EffectsDone:
    RTS

UpdateUI:
    ; Update user interface
    JSR UpdateMenuCursor
    JSR UpdateModeIndicator
    JSR UpdateScoreDisplay
    RTS

UpdateMenuCursor:
    ; Update menu cursor position
    LDA GameMode
    CMP #$01             ; Menu mode
    BNE MenuCursorDone
    
    LDX MenuCursor
    LDA MenuItemY,X
    STA SpriteOAM+60     ; Cursor Y
    LDA #$7E             ; Arrow tile
    STA SpriteOAM+61
    LDA #%00000000
    STA SpriteOAM+62
    LDA #$30
    STA SpriteOAM+63     ; Cursor X
    JMP MenuCursorDone
    
MenuCursorDone:
    RTS

UpdateModeIndicator:
    ; Show current mode
    LDA GameMode
    CLC
    ADC #$40             ; Mode tiles start at $40
    STA SpriteOAM+65
    
    LDA #$20
    STA SpriteOAM+64     ; Y position
    LDA #%00000011
    STA SpriteOAM+66     ; Attributes
    LDA #$10
    STA SpriteOAM+67     ; X position
    RTS

UpdateScoreDisplay:
    ; Update score display sprites
    LDA ScoreDisplay+1
    CLC
    ADC #$30             ; Number tiles
    STA SpriteOAM+69
    LDA ScoreDisplay
    CLC
    ADC #$30
    STA SpriteOAM+73
    
    ; Position score sprites
    LDA #$20
    STA SpriteOAM+68
    STA SpriteOAM+72
    LDA #$E0
    STA SpriteOAM+71
    LDA #$E8
    STA SpriteOAM+75
    RTS

UpdateMenuVisuals:
    ; Update menu visual effects
    LDA VisualCounter
    AND #$0F
    CMP #$08
    BCC MenuVisualDim
    
    ; Bright menu
    LDA #%00000000
    JMP StoreMenuPalette
    
MenuVisualDim:
    LDA #%00100000       ; Dim
    
StoreMenuPalette:
    STA SpriteOAM+62     ; Cursor attributes
    RTS

PlayMenuSound:
    ; Play menu navigation sound
    LDA #$C0
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10110000
    STA $4000
    
    LDA #$08
    STA SoundTimer
    RTS

InitTitleScreen:
    ; Initialize title screen
    LDA #$60
    STA SpriteOAM+80     ; Title sprite Y
    LDA #$54             ; 'T' tile
    STA SpriteOAM+81
    LDA #%00000010       ; Title palette
    STA SpriteOAM+82
    LDA #$80
    STA SpriteOAM+83     ; Center X
    RTS

ReadController:
    ; Simulate controller input for demo
    LDA VisualCounter
    AND #$3F
    CMP #$10
    BEQ SimGameA
    CMP #$20
    BEQ SimGameUp
    CMP #$30
    BEQ SimGameB
    LDA #$FF
    RTS
    
SimGameA:
    LDA #%01111111       ; A
    RTS
    
SimGameUp:
    LDA #%11110111       ; Up
    RTS
    
SimGameB:
    LDA #%10111111       ; B
    RTS

; Game data
DefaultScale:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

DemoSequence:
    .byte $00, $02, $04, $05, $07, $05, $04, $02
    .byte $00, $04, $07, $04, $00, $02, $00, $FF

MenuYPositions:
    .byte $70, $80, $90, $A0

NotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

NoteTiles:
    .byte $10, $11, $12, $13, $14, $15, $16, $17

; Variables
GameMode: .byte $00
TargetMode: .byte $00
GameTimer: .byte $00
TransitionActive: .byte $00
TransitionTimer: .byte $00
MenuCursor: .byte $00
MenuItems: .byte $04
CurrentInput: .byte $FF
PreviousInput: .byte $FF
NewPresses: .byte $00
Score: .word $0000
HighScore: .word $0050
UnlockedModes: .byte $01
PlayerLevel: .byte $01
SequencePosition: .byte $00
NoteTimer: .byte $00
VisualCounter: .byte $00
VisualMode: .byte $00
ParticleCount: .byte $00
EffectTimer: .byte $00
SoundTimer: .byte $00
ScoreDisplay: .word $0000

; Data arrays
MenuItemY: .byte $70, $80, $90, $A0
CurrentScale: .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E
GameSequence: .byte $00, $02, $04, $05, $07, $05, $04, $02, $00, $04, $07, $04, $00, $02, $00, $FF

; Sprite OAM
SpriteOAM:
    .byte $80, $10, $01, $80  ; Note sprite
    .byte $FF, $FF, $FF, $FF  ; Unused
    .byte $FF, $FF, $FF, $FF  ; Unused
    .byte $FF, $FF, $FF, $FF  ; Unused
```

## Multiple Game Modes Implementation

Create distinct, engaging game modes that showcase different aspects of Sprite Symphony:

```assembly
; Multiple game modes for complete game experience
GameModeSystem:
    .struct
        ModeTimers: .byte * 6       ; Timer for each mode
        ModeStates: .byte * 6       ; State within each mode
        ModeProgress: .byte * 6     ; Progress/completion tracking
        ModeHighScores: .word * 6   ; High score for each mode
        ModeUnlockFlags: .byte      ; Which modes are unlocked
    .endstruct

; Demo Mode - Showcase the musical system
DemoModeUpdate:
    ; Automatic musical demonstration
    JSR UpdateDemoSequence
    JSR UpdateDemoVisuals
    JSR CheckDemoInteraction
    RTS

UpdateDemoSequence:
    ; Play scripted musical sequence
    INC DemoTimer
    LDA DemoTimer
    AND #$1F                ; 32-frame intervals
    BNE DemoSequenceDone
    
    ; Play next note in demo
    LDX DemoPosition
    LDA DemoScript,X
    CMP #$FE                ; Loop marker?
    BEQ LoopDemo
    CMP #$FF                ; End marker?
    BEQ EndDemo
    
    ; Play this note
    JSR PlayDemoNote
    INC DemoPosition
    JMP DemoSequenceDone
    
LoopDemo:
    LDA #$00
    STA DemoPosition
    JMP DemoSequenceDone
    
EndDemo:
    ; Demo complete - unlock play mode
    LDA ModeUnlockFlags
    ORA #%00000010          ; Unlock play mode
    STA ModeUnlockFlags
    
    ; Transition to menu
    LDA #MODE_MENU
    STA TargetMode
    JSR StartTransition
    
DemoSequenceDone:
    RTS

PlayDemoNote:
    ; Play demo note A with visual flair
    STA CurrentDemoNote
    
    ; Enhanced audio with effects
    TAX
    LDA DemoNoteFreqs,X
    STA $4002
    LDA DemoNoteFreqHigh,X
    STA $4003
    
    ; Demo uses special envelope
    LDA #%10111111
    STA $4000
    
    ; Create spectacular visual
    JSR CreateDemoVisual
    
    ; Set demo note duration
    LDA #$30                ; Longer notes for demo
    STA DemoNoteTimer
    
    RTS

CreateDemoVisual:
    ; Create enhanced visual for demo note
    LDA CurrentDemoNote
    ASL
    ASL
    TAY
    
    ; Main note sprite
    LDA DemoNotePosY,A
    STA SpriteOAM,Y
    LDA DemoNoteTiles,A
    STA SpriteOAM+1,Y
    LDA #%00000001          ; Demo palette
    STA SpriteOAM+2,Y
    LDA DemoPosition
    ASL
    ASL
    CLC
    ADC #$40
    STA SpriteOAM+3,Y
    
    ; Create accompanying particle effects
    JSR CreateDemoParticles
    
    RTS

; Play Mode - Interactive musical playing
PlayModeUpdate:
    ; Interactive note playing with scoring
    JSR ProcessPlayInput
    JSR UpdatePlayAudio
    JSR UpdatePlayVisuals
    JSR UpdatePlayScoring
    RTS

ProcessPlayInput:
    ; Enhanced input processing for play mode
    LDA NewPresses
    BEQ PlayInputDone
    
    ; Map input to musical notes
    JSR MapPlayInput
    CMP #$FF
    BEQ CheckPlaySpecial
    
    ; Play note with velocity sensitivity
    JSR CalculateVelocity
    JSR PlayScoredNote
    JMP PlayInputDone
    
CheckPlaySpecial:
    ; Check for special combinations
    JSR CheckChordInput
    JSR CheckScaleChange
    
PlayInputDone:
    RTS

CalculateVelocity:
    ; Calculate note velocity based on timing
    LDA InputTiming
    CMP #$04                ; Quick press
    BCC HighVelocity
    CMP #$08                ; Medium press  
    BCC MediumVelocity
    
    ; Slow press
    LDA #$04
    JMP StoreVelocity
    
MediumVelocity:
    LDA #$08
    JMP StoreVelocity
    
HighVelocity:
    LDA #$0C
    
StoreVelocity:
    STA CurrentVelocity
    RTS

PlayScoredNote:
    ; Play note with scoring calculation
    STA PlayedNote
    
    ; Configure audio with velocity
    TAX
    LDA PlayNoteFreqs,X
    STA $4002
    LDA PlayNoteFreqHigh,X  
    STA $4003
    
    ; Set volume based on velocity
    LDA CurrentVelocity
    ASL
    ORA #%10110000
    STA $4000
    
    ; Calculate score based on timing and velocity
    JSR CalculateNoteScore
    
    ; Create visual with velocity feedback
    JSR CreateVelocityVisual
    
    RTS

CalculateNoteScore:
    ; Calculate score for played note
    LDA CurrentVelocity
    ASL                     ; Base score from velocity
    CLC
    ADC TimingBonus         ; Add timing bonus
    CLC
    ADC ComboMultiplier     ; Add combo bonus
    
    ; Add to total score
    CLC
    ADC PlayScore
    STA PlayScore
    LDA PlayScore+1
    ADC #$00
    STA PlayScore+1
    
    ; Update combo
    JSR UpdateCombo
    
    RTS

; Compose Mode - Musical sequence creation
ComposeModeUpdate:
    ; Musical composition and editing
    JSR ProcessComposeInput
    JSR UpdateComposeDisplay
    JSR UpdateComposeAudio
    RTS

ProcessComposeInput:
    ; Input for musical composition
    LDA NewPresses
    AND #%00001111          ; Directional pad
    BEQ CheckComposeSpecial
    
    ; Add note to composition
    JSR MapComposeInput
    JSR AddNoteToComposition
    JMP ComposeInputDone
    
CheckComposeSpecial:
    ; Check for compose mode controls
    LDA NewPresses
    AND #%10000000          ; A = play composition
    BEQ CheckComposeDelete
    JSR PlayComposition
    JMP ComposeInputDone
    
CheckComposeDelete:
    LDA NewPresses
    AND #%01000000          ; B = delete last note
    BEQ ComposeInputDone
    JSR DeleteLastNote
    
ComposeInputDone:
    RTS

AddNoteToComposition:
    ; Add note A to current composition
    LDX CompositionLength
    CPX #$20                ; Max 32 notes
    BCS CompositionFull
    
    STA CompositionData,X
    INC CompositionLength
    
    ; Play note for feedback
    JSR PlayComposeNote
    
CompositionFull:
    RTS

PlayComposition:
    ; Play back the composed sequence
    LDA #$00
    STA PlaybackPosition
    LDA #$01
    STA PlaybackActive
    RTS

; Challenge Mode - Musical mini-games
ChallengeModeUpdate:
    ; Musical challenges and mini-games
    JSR UpdateCurrentChallenge
    JSR ProcessChallengeInput
    JSR UpdateChallengeProgress
    RTS

UpdateCurrentChallenge:
    ; Update active challenge
    LDA CurrentChallenge
    CMP #$00
    BEQ EchoChallenge
    CMP #$01
    BEQ RhythmChallenge
    CMP #$02
    BEQ ScaleChallenge
    RTS

EchoChallenge:
    ; Echo challenge - repeat musical patterns
    JSR UpdateEchoPattern
    JSR CheckEchoInput
    RTS

RhythmChallenge:
    ; Rhythm challenge - match timing
    JSR UpdateRhythmPattern
    JSR CheckRhythmInput
    RTS

ScaleChallenge:
    ; Scale challenge - play correct scales
    JSR UpdateScalePattern
    JSR CheckScaleInput
    RTS

; Mode data and variables
DemoTimer: .byte $00
DemoPosition: .byte $00
DemoNoteTimer: .byte $00
CurrentDemoNote: .byte $00

PlayScore: .word $0000
CurrentVelocity: .byte $08
InputTiming: .byte $00
TimingBonus: .byte $00
ComboMultiplier: .byte $01
PlayedNote: .byte $00

CompositionLength: .byte $00
CompositionData: .byte $00, $00, $00, $00, $00, $00, $00, $00
                 .byte $00, $00, $00, $00, $00, $00, $00, $00
                 .byte $00, $00, $00, $00, $00, $00, $00, $00
                 .byte $00, $00, $00, $00, $00, $00, $00, $00
PlaybackPosition: .byte $00
PlaybackActive: .byte $00

CurrentChallenge: .byte $00
ChallengeScore: .word $0000
ChallengeProgress: .byte $00

; Mode-specific data
DemoScript:
    .byte $00, $02, $04, $05, $07, $05, $04, $02
    .byte $00, $04, $07, $04, $00, $FE  ; Loop marker

DemoNoteFreqs:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

DemoNoteFreqHigh:
    .byte $08, $08, $08, $08, $08, $08, $08, $08

DemoNotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

DemoNoteTiles:
    .byte $20, $21, $22, $23, $24, $25, $26, $27

PlayNoteFreqs:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

PlayNoteFreqHigh:
    .byte $08, $08, $08, $08, $08, $08, $08, $08
```

## User Interface and Polish

Create a polished user interface with smooth navigation and feedback:

```assembly
; Complete user interface system
UISystem:
    .struct
        MenuState: .byte            ; Current menu state
        CursorPosition: .byte       ; Menu cursor position
        MenuAnimation: .byte        ; Menu animation frame
        TransitionEffect: .byte     ; UI transition effect
        StatusDisplay: .byte        ; Status information display
        HelpSystem: .byte           ; Help/tutorial state
    .endstruct

UpdateCompleteUI:
    ; Update complete user interface
    JSR UpdateMenuSystem
    JSR UpdateStatusDisplay
    JSR UpdateHelpSystem
    JSR UpdateTransitionEffects
    RTS

UpdateMenuSystem:
    ; Update menu navigation and display
    LDA GameMode
    CMP #MODE_MENU
    BNE MenuSystemDone
    
    ; Update menu animation
    INC MenuAnimation
    
    ; Update cursor animation
    JSR UpdateMenuCursor
    
    ; Update menu item highlights
    JSR UpdateMenuHighlights
    
    ; Update unlock indicators
    JSR UpdateUnlockIndicators
    
MenuSystemDone:
    RTS

UpdateMenuCursor:
    ; Animated menu cursor
    LDX MenuCursor
    LDA MenuPositions,X
    CLC
    ADC MenuAnimation
    AND #$07                ; 8-frame oscillation
    CMP #$04
    BCC CursorPulseIn
    
    ; Cursor pulse out
    LDA MenuPositions,X
    CLC
    ADC #$02
    JMP StoreCursorY
    
CursorPulseIn:
    LDA MenuPositions,X
    SEC
    SBC #$02
    
StoreCursorY:
    STA SpriteOAM+0         ; Cursor sprite Y
    LDA #$7E                ; Arrow tile
    STA SpriteOAM+1
    LDA #%00000000          ; Cursor palette
    STA SpriteOAM+2
    LDA #$28                ; Cursor X
    STA SpriteOAM+3
    
    RTS

UpdateMenuHighlights:
    ; Highlight available menu options
    LDX #$00
    
HighlightLoop:
    ; Check if mode is unlocked
    LDA UnlockBitMasks,X
    AND ModeUnlockFlags
    BEQ DimOption
    
    ; Option available - bright display
    TXA
    ASL
    ASL
    TAY
    LDA #%00000001          ; Bright palette
    STA SpriteOAM+6,Y       ; Menu item sprite
    JMP NextHighlight
    
DimOption:
    ; Option locked - dim display
    TXA
    ASL
    ASL
    TAY
    LDA #%00100000          ; Dim palette
    STA SpriteOAM+6,Y
    
NextHighlight:
    INX
    CPX #$04                ; 4 menu options
    BNE HighlightLoop
    
    RTS

UpdateUnlockIndicators:
    ; Show unlock progress indicators
    LDX #$00
    
UnlockIndicatorLoop:
    ; Position unlock indicator
    TXA
    ASL
    ASL
    ASL                     ; * 8
    CLC
    ADC #$70                ; Base Y
    STA UnlockIndicatorY,X
    
    ; Check unlock status
    LDA UnlockBitMasks,X
    AND ModeUnlockFlags
    BEQ ShowLockedIndicator
    
    ; Show unlocked indicator
    LDA #$55                ; Checkmark tile
    STA UnlockIndicatorTile,X
    JMP NextUnlockIndicator
    
ShowLockedIndicator:
    ; Show locked indicator
    LDA #$58                ; Lock tile
    STA UnlockIndicatorTile,X
    
NextUnlockIndicator:
    INX
    CPX #$04
    BNE UnlockIndicatorLoop
    
    ; Update sprites
    JSR RenderUnlockIndicators
    
    RTS

UpdateStatusDisplay:
    ; Update score, level, and status information
    JSR DisplayCurrentScore
    JSR DisplayPlayerLevel
    JSR DisplayHighScore
    JSR DisplayModeStatus
    RTS

DisplayCurrentScore:
    ; Display current score using sprites
    LDA Score+1             ; High byte
    JSR ConvertToDisplay
    STA ScoreDisplay+1
    
    LDA Score               ; Low byte
    JSR ConvertToDisplay
    STA ScoreDisplay
    
    ; Position score sprites
    LDA #$20                ; Score Y position
    STA SpriteOAM+40
    STA SpriteOAM+44
    
    LDA ScoreDisplay+1
    CLC
    ADC #$30                ; Number tiles start at $30
    STA SpriteOAM+41
    
    LDA ScoreDisplay
    CLC
    ADC #$30
    STA SpriteOAM+45
    
    LDA #$D0                ; Score X position
    STA SpriteOAM+43
    LDA #$D8
    STA SpriteOAM+47
    
    RTS

DisplayPlayerLevel:
    ; Display current player level
    LDA PlayerLevel
    CLC
    ADC #$30                ; Convert to tile
    STA SpriteOAM+49        ; Level tile
    
    LDA #$30                ; Level Y
    STA SpriteOAM+48
    LDA #%00000010          ; Level palette
    STA SpriteOAM+50
    LDA #$C0                ; Level X
    STA SpriteOAM+51
    
    RTS

UpdateHelpSystem:
    ; Update help and tutorial displays
    LDA GameMode
    CMP #MODE_PLAY
    BEQ ShowPlayHelp
    CMP #MODE_COMPOSE
    BEQ ShowComposeHelp
    
    ; Hide help
    JSR HideHelpDisplay
    JMP HelpSystemDone
    
ShowPlayHelp:
    ; Show play mode help
    JSR DisplayPlayHelp
    JMP HelpSystemDone
    
ShowComposeHelp:
    ; Show compose mode help
    JSR DisplayComposeHelp
    
HelpSystemDone:
    RTS

DisplayPlayHelp:
    ; Display play mode instructions
    LDA #$E0                ; Help Y position
    STA SpriteOAM+60
    LDA #$50                ; 'P' tile (for "Play")
    STA SpriteOAM+61
    LDA #%00000011          ; Help palette
    STA SpriteOAM+62
    LDA #$20                ; Help X position
    STA SpriteOAM+63
    
    RTS

UpdateTransitionEffects:
    ; Update transition visual effects
    LDA TransitionActive
    BEQ TransitionEffectsDone
    
    ; Create transition effect
    LDA TransitionTimer
    CMP #$10                ; Midpoint
    BCS FadeOut
    
    ; Fade in effect
    JSR ApplyFadeIn
    JMP TransitionEffectsDone
    
FadeOut:
    ; Fade out effect
    JSR ApplyFadeOut
    
TransitionEffectsDone:
    RTS

ApplyFadeOut:
    ; Apply fade out effect to all sprites
    LDX #$00
    
FadeOutLoop:
    LDA SpriteOAM+2,X       ; Get current attributes
    ORA #%01000000          ; Set fade bit
    STA SpriteOAM+2,X
    
    TXA
    CLC
    ADC #$04                ; Next sprite
    TAX
    CPX #$80                ; All sprites processed?
    BNE FadeOutLoop
    
    RTS

ApplyFadeIn:
    ; Apply fade in effect
    LDX #$00
    
FadeInLoop:
    LDA SpriteOAM+2,X       ; Get current attributes
    AND #%10111111          ; Clear fade bit
    STA SpriteOAM+2,X
    
    TXA
    CLC
    ADC #$04
    TAX
    CPX #$80
    BNE FadeInLoop
    
    RTS

ConvertToDisplay:
    ; Convert number in A to display format
    ; Simple conversion for demo
    AND #$0F                ; Keep low nibble
    RTS

; UI data and variables
MenuAnimation: .byte $00
MenuPositions: .byte $70, $80, $90, $A0

UnlockBitMasks:
    .byte %00000001, %00000010, %00000100, %00001000

ModeUnlockFlags: .byte %00000001    ; Start with demo unlocked

ScoreDisplay: .word $0000
UnlockIndicatorY: .byte $70, $80, $90, $A0
UnlockIndicatorTile: .byte $58, $58, $58, $58
```

## Practice Exercise

Create the complete Sprite Symphony game with all systems integrated:

1. Implement the complete game architecture with multiple modes
2. Add polished user interface with smooth navigation and feedback
3. Create distinct gameplay experiences for each mode
4. Include progression system with unlockable content
5. Build complete game flow from title to gameplay and back

**Practice: Complete Sprite Symphony Game:**

```assembly
; Complete Sprite Symphony NES Game
Main:
    JSR InitCompleteGame
    
MainGameLoop:
    JSR UpdateInput
    JSR UpdateGameState
    JSR UpdateAudio
    JSR UpdateVisuals
    JSR UpdateUI
    JSR ProcessTransitions
    JMP MainGameLoop

InitCompleteGame:
    ; Initialize complete game systems
    JSR InitHardware
    JSR InitGameData
    JSR InitUI
    JSR SetupTitleScreen
    RTS

InitHardware:
    ; Initialize NES hardware
    LDA #%00001111       ; Enable all audio channels
    STA $4015
    
    ; Initialize system variables
    LDA #$00             ; Start in title mode
    STA GameMode
    STA GameTimer
    STA TransitionActive
    
    RTS

InitGameData:
    ; Initialize game data
    LDA #$00
    STA PlayerScore
    STA PlayerScore+1
    LDA #$64             ; High score = 100
    STA HighScore
    STA HighScore+1
    
    ; Initialize progression
    LDA #%00000001       ; Only demo unlocked initially
    STA UnlockedModes
    LDA #$01
    STA PlayerLevel
    
    ; Initialize mode-specific data
    JSR InitDemoData
    JSR InitPlayData
    JSR InitComposeData
    
    RTS

InitDemoData:
    ; Initialize demo mode
    LDA #$00
    STA DemoPosition
    STA DemoTimer
    RTS

InitPlayData:
    ; Initialize play mode
    LDA #$00
    STA PlayScore
    STA PlayScore+1
    STA ComboCounter
    STA VelocityLevel
    RTS

InitComposeData:
    ; Initialize compose mode
    LDA #$00
    STA SequenceLength
    STA PlaybackPos
    STA EditMode
    RTS

InitUI:
    ; Initialize user interface
    LDA #$00
    STA MenuCursor
    STA UIAnimation
    
    ; Clear all sprites
    LDX #$00
    LDA #$FF
ClearUISprites:
    STA SpriteOAM,X
    INX
    INX
    INX
    INX
    CPX #$80
    BNE ClearUISprites
    
    RTS

SetupTitleScreen:
    ; Setup initial title screen
    LDA #$60
    STA SpriteOAM+0      ; Title Y
    LDA #$53             ; 'S' for Sprite Symphony
    STA SpriteOAM+1
    LDA #%00000010       ; Title palette
    STA SpriteOAM+2
    LDA #$80
    STA SpriteOAM+3      ; Center X
    RTS

UpdateInput:
    ; Update input system
    LDA CurrentInput
    STA PreviousInput
    JSR ReadController
    STA CurrentInput
    
    ; Calculate new presses
    EOR PreviousInput
    AND CurrentInput
    STA NewPresses
    
    ; Update input timing
    INC InputTimer
    
    RTS

UpdateGameState:
    ; Update based on current game mode
    INC GameTimer
    
    LDA GameMode
    CMP #$00             ; Title
    BEQ UpdateTitle
    CMP #$01             ; Menu
    BEQ UpdateMenu
    CMP #$02             ; Demo
    BEQ UpdateDemo
    CMP #$03             ; Play
    BEQ UpdatePlay
    CMP #$04             ; Compose
    BEQ UpdateCompose
    RTS

UpdateTitle:
    ; Update title screen
    JSR ProcessTitleInput
    
    ; Auto-advance after 3 seconds
    LDA GameTimer
    CMP #$B4
    BNE TitleDone
    JSR TransitionToMenu
    
TitleDone:
    RTS

ProcessTitleInput:
    ; Process title screen input
    LDA NewPresses
    AND #%10000000       ; A button
    BEQ TitleInputDone
    
    JSR TransitionToMenu
    
TitleInputDone:
    RTS

TransitionToMenu:
    ; Start transition to main menu
    LDA #$01             ; Menu mode
    STA TargetMode
    JSR StartTransition
    RTS

UpdateMenu:
    ; Update main menu
    JSR ProcessMenuInput
    JSR UpdateMenuAnimation
    RTS

ProcessMenuInput:
    ; Process menu navigation
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ CheckMenuDown
    
    ; Move cursor up
    LDA MenuCursor
    BEQ WrapMenuToBottom
    DEC MenuCursor
    JSR PlayMenuSound
    JMP MenuInputDone
    
WrapMenuToBottom:
    LDA #$03             ; 4 menu items (0-3)
    STA MenuCursor
    JSR PlayMenuSound
    JMP MenuInputDone
    
CheckMenuDown:
    LDA NewPresses
    AND #%00000100       ; Down
    BEQ CheckMenuSelect
    
    ; Move cursor down
    LDA MenuCursor
    CMP #$03
    BEQ WrapMenuToTop
    INC MenuCursor
    JSR PlayMenuSound
    JMP MenuInputDone
    
WrapMenuToTop:
    LDA #$00
    STA MenuCursor
    JSR PlayMenuSound
    JMP MenuInputDone
    
CheckMenuSelect:
    LDA NewPresses
    AND #%10000000       ; A button
    BEQ MenuInputDone
    
    JSR SelectMenuOption
    
MenuInputDone:
    RTS

SelectMenuOption:
    ; Select current menu option
    LDA MenuCursor
    CMP #$00
    BEQ SelectDemo
    CMP #$01
    BEQ SelectPlay
    CMP #$02
    BEQ SelectCompose
    CMP #$03
    BEQ SelectChallenge
    RTS

SelectDemo:
    ; Always available
    LDA #$02             ; Demo mode
    STA TargetMode
    JSR StartTransition
    RTS

SelectPlay:
    ; Check if unlocked
    LDA UnlockedModes
    AND #%00000010
    BEQ MenuSelectDone
    
    LDA #$03             ; Play mode
    STA TargetMode
    JSR StartTransition
    
MenuSelectDone:
    RTS

SelectCompose:
    ; Check if unlocked
    LDA UnlockedModes
    AND #%00000100
    BEQ MenuSelectDone
    
    LDA #$04             ; Compose mode
    STA TargetMode
    JSR StartTransition
    RTS

SelectChallenge:
    ; Future feature
    RTS

UpdateDemo:
    ; Update demo mode
    JSR RunDemoSequence
    JSR ProcessDemoInput
    RTS

RunDemoSequence:
    ; Run automatic demo sequence
    LDA GameTimer
    AND #$1F             ; Every 32 frames
    BNE DemoSequenceDone
    
    LDX DemoPosition
    LDA DemoSequence,X
    CMP #$FF             ; End marker?
    BEQ RestartDemo
    
    ; Play this note
    JSR PlayDemoNote
    INC DemoPosition
    JMP DemoSequenceDone
    
RestartDemo:
    LDA #$00
    STA DemoPosition
    
    ; Unlock play mode after first demo loop
    LDA UnlockedModes
    ORA #%00000010
    STA UnlockedModes
    
DemoSequenceDone:
    RTS

PlayDemoNote:
    ; Play demo note A
    TAX
    LDA DemoFreqs,X
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Create visual
    JSR CreateDemoVisual
    
    ; Set note timer
    LDA #$20
    STA NoteTimer
    
    RTS

CreateDemoVisual:
    ; Create visual for demo note
    TXA
    ASL
    ASL
    TAY
    
    LDA DemoNotePosY,A
    STA SpriteOAM,Y
    LDA DemoNoteTiles,A
    STA SpriteOAM+1,Y
    LDA #%00000001
    STA SpriteOAM+2,Y
    LDA DemoPosition
    ASL
    ASL
    CLC
    ADC #$50
    STA SpriteOAM+3,Y
    RTS

ProcessDemoInput:
    ; Process input during demo
    LDA NewPresses
    AND #%01000000       ; B button
    BEQ DemoInputDone
    
    ; Return to menu
    LDA #$01
    STA TargetMode
    JSR StartTransition
    
DemoInputDone:
    RTS

UpdatePlay:
    ; Update interactive play mode
    JSR ProcessPlayInput
    JSR UpdatePlayLogic
    JSR UpdatePlayDisplay
    RTS

ProcessPlayInput:
    ; Process play mode input
    LDA NewPresses
    AND #%00001111       ; Directions
    BEQ CheckPlayExit
    
    ; Map input to note
    JSR MapPlayInput
    CMP #$FF
    BEQ CheckPlayExit
    
    JSR PlayInteractiveNote
    JSR AddPlayScore
    
CheckPlayExit:
    LDA NewPresses
    AND #%01000000       ; B to exit
    BEQ PlayInputDone
    
    ; Check score for unlocks
    JSR CheckPlayUnlocks
    
    ; Return to menu
    LDA #$01
    STA TargetMode
    JSR StartTransition
    
PlayInputDone:
    RTS

MapPlayInput:
    ; Map directional input to notes
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ CheckPlayDown
    LDA #$07
    RTS
    
CheckPlayDown:
    LDA NewPresses
    AND #%00000100       ; Down
    BEQ CheckPlayLeft
    LDA #$00
    RTS
    
CheckPlayLeft:
    LDA NewPresses
    AND #%00000010       ; Left
    BEQ CheckPlayRight
    LDA #$02
    RTS
    
CheckPlayRight:
    LDA NewPresses
    AND #%00000001       ; Right
    BEQ NoPlayNote
    LDA #$04
    RTS
    
NoPlayNote:
    LDA #$FF
    RTS

PlayInteractiveNote:
    ; Play note with scoring
    TAX
    LDA PlayFreqs,X
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10111111
    STA $4000
    
    ; Create visual feedback
    JSR CreatePlayVisual
    
    ; Set note timer
    LDA #$18
    STA NoteTimer
    
    RTS

CreatePlayVisual:
    ; Create visual for played note
    TXA
    ASL
    ASL
    TAY
    
    LDA PlayNotePosY,A
    STA SpriteOAM,Y
    LDA PlayNoteTiles,A
    STA SpriteOAM+1,Y
    LDA #%00000010       ; Play palette
    STA SpriteOAM+2,Y
    LDA #$80             ; Center X
    STA SpriteOAM+3,Y
    RTS

AddPlayScore:
    ; Add score for played note
    LDA PlayScore
    CLC
    ADC #$05             ; 5 points per note
    STA PlayScore
    LDA PlayScore+1
    ADC #$00
    STA PlayScore+1
    RTS

CheckPlayUnlocks:
    ; Check if score unlocks new modes
    LDA PlayScore+1
    BNE HighScore
    LDA PlayScore
    CMP #$32             ; 50 points
    BCC NoPlayUnlock
    
HighScore:
    ; Unlock compose mode
    LDA UnlockedModes
    ORA #%00000100
    STA UnlockedModes
    
    ; Update high score if needed
    LDA PlayScore+1
    CMP HighScore+1
    BCC NoPlayUnlock
    BNE NewHighScore
    LDA PlayScore
    CMP HighScore
    BCC NoPlayUnlock
    
NewHighScore:
    LDA PlayScore
    STA HighScore
    LDA PlayScore+1
    STA HighScore+1
    
NoPlayUnlock:
    RTS

UpdateCompose:
    ; Update compose mode (basic implementation)
    JSR ProcessComposeInput
    RTS

ProcessComposeInput:
    ; Basic compose input
    LDA NewPresses
    AND #%01000000       ; B to exit
    BEQ ComposeInputDone
    
    LDA #$01             ; Return to menu
    STA TargetMode
    JSR StartTransition
    
ComposeInputDone:
    RTS

StartTransition:
    ; Start mode transition
    LDA #$01
    STA TransitionActive
    LDA #$20             ; 32-frame transition
    STA TransitionTimer
    RTS

UpdateAudio:
    ; Update audio system
    LDA NoteTimer
    BEQ SilenceAudio
    
    DEC NoteTimer
    LDA NoteTimer
    BNE AudioDone
    
SilenceAudio:
    LDA #$00
    STA $4000
    
AudioDone:
    RTS

UpdateVisuals:
    ; Update visual system
    INC UIAnimation
    JSR UpdateSpriteAnimations
    RTS

UpdateSpriteAnimations:
    ; Update sprite animations
    LDA NoteTimer
    BEQ HideNoteSprites
    
    ; Animate active note sprites
    LDA UIAnimation
    AND #$07
    CMP #$04
    BCC NotePulseUp
    
    ; Note sprites pulse effect
    RTS
    
NotePulseUp:
    RTS
    
HideNoteSprites:
    ; Hide finished note sprites
    LDA #$FF
    STA SpriteOAM+0
    STA SpriteOAM+4
    STA SpriteOAM+8
    STA SpriteOAM+12
    RTS

UpdateUI:
    ; Update user interface
    JSR UpdateMenuCursor
    JSR UpdateScoreDisplay
    JSR UpdateModeIndicator
    RTS

UpdateMenuCursor:
    ; Update menu cursor
    LDA GameMode
    CMP #$01             ; Menu mode
    BNE CursorDone
    
    LDX MenuCursor
    LDA MenuPositions,X
    STA SpriteOAM+60     ; Cursor Y
    LDA #$7E             ; Arrow
    STA SpriteOAM+61
    LDA #%00000000
    STA SpriteOAM+62
    LDA #$20
    STA SpriteOAM+63     ; Cursor X
    JMP CursorDone
    
CursorDone:
    RTS

UpdateScoreDisplay:
    ; Update score display
    LDA PlayScore
    LSR
    LSR
    LSR
    LSR                  ; High nibble
    CLC
    ADC #$30             ; Number tile
    STA SpriteOAM+65
    
    LDA PlayScore
    AND #$0F             ; Low nibble
    CLC
    ADC #$30
    STA SpriteOAM+69
    
    ; Position score
    LDA #$20
    STA SpriteOAM+64
    STA SpriteOAM+68
    LDA #$D0
    STA SpriteOAM+67
    LDA #$D8
    STA SpriteOAM+71
    RTS

UpdateModeIndicator:
    ; Show current mode
    LDA GameMode
    CLC
    ADC #$40             ; Mode tiles
    STA SpriteOAM+73
    
    LDA #$20
    STA SpriteOAM+72
    LDA #%00000011
    STA SpriteOAM+74
    LDA #$10
    STA SpriteOAM+75
    RTS

UpdateMenuAnimation:
    ; Update menu visual effects
    INC UIAnimation
    RTS

ProcessTransitions:
    ; Process mode transitions
    LDA TransitionActive
    BEQ TransitionsDone
    
    DEC TransitionTimer
    LDA TransitionTimer
    BNE TransitionsDone
    
    ; Transition complete
    LDA TargetMode
    STA GameMode
    LDA #$00
    STA TransitionActive
    STA GameTimer
    
    ; Initialize new mode
    JSR InitNewMode
    
TransitionsDone:
    RTS

InitNewMode:
    ; Initialize newly entered mode
    LDA GameMode
    CMP #$01
    BEQ InitMenuMode
    CMP #$02
    BEQ InitDemoMode
    CMP #$03
    BEQ InitPlayMode
    RTS

InitMenuMode:
    ; Initialize menu
    LDA #$00
    STA MenuCursor
    JSR SetupMenuDisplay
    RTS

InitDemoMode:
    ; Initialize demo
    LDA #$00
    STA DemoPosition
    STA DemoTimer
    RTS

InitPlayMode:
    ; Initialize play mode
    LDA #$00
    STA PlayScore
    STA PlayScore+1
    RTS

SetupMenuDisplay:
    ; Setup menu display
    LDX #$03
MenuDisplayLoop:
    TXA
    ASL
    ASL
    ASL                  ; * 8
    CLC
    ADC #$70             ; Base Y
    STA MenuSpriteY,X
    
    LDA MenuTiles,X
    STA MenuSpriteTile,X
    
    DEX
    BPL MenuDisplayLoop
    RTS

PlayMenuSound:
    ; Play menu navigation sound
    LDA #$B0
    STA $4002
    LDA #$08
    STA $4003
    LDA #%10110000
    STA $4000
    
    LDA #$08
    STA SoundTimer
    RTS

ReadController:
    ; Simulate controller input
    LDA UIAnimation
    AND #$3F
    CMP #$10
    BEQ SimA
    CMP #$20
    BEQ SimUp
    CMP #$30
    BEQ SimB
    LDA #$FF
    RTS
    
SimA:
    LDA #%01111111       ; A
    RTS
    
SimUp:
    LDA #%11110111       ; Up
    RTS
    
SimB:
    LDA #%10111111       ; B
    RTS

; Game data
DemoSequence:
    .byte $00, $02, $04, $05, $07, $05, $04, $02, $00, $FF

DemoFreqs:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

PlayFreqs:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

DemoNotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

PlayNotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

DemoNoteTiles:
    .byte $10, $11, $12, $13, $14, $15, $16, $17

PlayNoteTiles:
    .byte $20, $21, $22, $23, $24, $25, $26, $27

MenuPositions:
    .byte $70, $80, $90, $A0

MenuTiles:
    .byte $44, $50, $43, $48  ; D, P, C, H (Demo, Play, Compose, Help)

; Variables
GameMode: .byte $00
TargetMode: .byte $00
GameTimer: .byte $00
TransitionActive: .byte $00
TransitionTimer: .byte $00
CurrentInput: .byte $FF
PreviousInput: .byte $FF
NewPresses: .byte $00
InputTimer: .byte $00

MenuCursor: .byte $00
UIAnimation: .byte $00
NoteTimer: .byte $00
SoundTimer: .byte $00

PlayerScore: .word $0000
HighScore: .word $0064
PlayScore: .word $0000
UnlockedModes: .byte $01
PlayerLevel: .byte $01

DemoPosition: .byte $00
DemoTimer: .byte $00
ComboCounter: .byte $00
VelocityLevel: .byte $00
SequenceLength: .byte $00
PlaybackPos: .byte $00
EditMode: .byte $00

MenuSpriteY: .byte $70, $80, $90, $A0
MenuSpriteTile: .byte $44, $50, $43, $48

; Sprite OAM data
SpriteOAM:
    .byte $C0, $10, $01, $50  ; Note sprites
    .byte $FF, $FF, $FF, $FF
    .byte $FF, $FF, $FF, $FF
    .byte $FF, $FF, $FF, $FF
```

## What You've Learned

In this culminating lesson, you've achieved mastery of complete NES game development:

- Integrated all Phase 1 NES programming concepts into a complete, polished game
- Implemented multiple game modes with distinct gameplay experiences
- Created professional user interfaces with smooth navigation and feedback
- Built complete game flow from title screen through gameplay and back to menus
- Added progression systems with unlockable content and scoring
- Demonstrated professional game development patterns and practices
- Created a genuinely enjoyable and engaging interactive musical application

## Looking Ahead

Excellent work! You've built your first foundational NES game. In the next lesson, you'll learn optimization and performance techniques to make Sprite Symphony run even more efficiently and add polish to your creation as you continue developing your Phase 1 skills.

## Fun Fact

The complete game development skills you've mastered in creating Sprite Symphony represent the same fundamental competencies used by professional NES developers in the 1980s and 1990s. The multi-mode architecture, state management, user interface design, and integrated audio-visual systems you've built demonstrate sophisticated programming skills that transfer directly to modern game development. Many successful indie games today use exactly these same architectural patterns, just with more powerful hardware. You've learned to think like a complete game developer, not just a programmer!