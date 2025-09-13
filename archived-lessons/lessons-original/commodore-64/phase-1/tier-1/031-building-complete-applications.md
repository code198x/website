---
title: "Number Quest - Complete Game Development"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 31
description: "Complete the Number Quest game by integrating all Phase 1 skills. Learn to combine graphics, sound, input, and game logic into a polished number guessing game programmed entirely in 6502 assembly."
learning_objectives:
  - "Understand complete application architecture and design"
  - "Learn integration of multiple system components"
  - "Learn user interface design and implementation"
  - "Practice performance optimisation and polish"
  - "Build production-ready assembly applications"
concepts:
  - "Application architecture and component integration"
  - "User interface design and state management"
  - "Performance optimisation and profiling"
  - "Quality assurance and testing"
  - "Deployment and distribution"
estimated_duration: "45-60 minutes"
difficulty: "hard"
code_examples: true
practical_exercise: true
order: 31
---

# Lesson 31: Number Quest - Complete Game Development

Welcome to the culmination of Phase 1! Today you'll complete your Number Quest game by integrating everything you've learned about 6502 assembly programming. This lesson demonstrates how to build a complete, polished game that showcases professional assembly development techniques.

## Application Architecture Principles

**Complete applications** require coordinated systems working together:

- **Modular Design**: Independent components with clear interfaces
- **State Management**: Coordinated application state across systems
- **User Interface**: Intuitive, responsive user interaction
- **Performance**: Smooth, efficient operation under all conditions
- **Quality**: Robust error handling and graceful degradation

Think of building applications as **conducting an orchestra** - each section (graphics, sound, input) must perform excellently individually and harmonize perfectly together.

## Application Foundation and Structure

### Core Application Framework

Every complete application needs a solid foundation:

```text
; ========================================
; COMPLETE APPLICATION FRAMEWORK
; ========================================
; Architecture: Event-driven state machine
; Components: Input, Graphics, Audio, Logic, UI
; Performance: 60 FPS target, <32KB memory
; ========================================

ApplicationFramework:
    ; Application states
    APP_STATE_INIT      = $00
    APP_STATE_MENU      = $01
    APP_STATE_PLAYING   = $02
    APP_STATE_PAUSED    = $03
    APP_STATE_GAMEOVER  = $04
    APP_STATE_SHUTDOWN  = $05

; Main application entry point
MainApplication:
    JSR InitializeApplication
    JSR RunApplicationLoop
    JSR ShutdownApplication
    RTS

InitializeApplication:
    ; Initialize all subsystems in correct order
    JSR InitMemoryManager
    JSR InitGraphicsSystem
    JSR InitAudioSystem
    JSR InitInputSystem
    JSR InitGameLogic
    JSR InitUserInterface

    ; Set initial application state
    LDA #APP_STATE_INIT
    STA ApplicationState
    STA PreviousState

    ; Clear performance counters
    LDA #$00
    STA FrameCounter
    STA ErrorCount
    STA PerformanceFlags

    RTS

RunApplicationLoop:
    ; Main application loop
ApplicationLoop:
    ; Performance monitoring
    JSR StartFrameTimer

    ; Core loop operations
    JSR ProcessInput
    JSR UpdateApplicationState
    JSR UpdateGraphics
    JSR UpdateAudio
    JSR UpdateUserInterface

    ; Performance and quality checks
    JSR CheckPerformance
    JSR HandleErrors

    ; Frame synchronization
    JSR SynchronizeFrame

    ; Check for application exit
    LDA ApplicationState
    CMP #APP_STATE_SHUTDOWN
    BNE ApplicationLoop

    RTS

; ========================================
; MEMORY MANAGEMENT SUBSYSTEM
; ========================================

InitMemoryManager:
    ; Setup memory allocation tracking
    LDA #$00
    STA AllocatedBlocks
    STA MemoryUsage
    STA FragmentationLevel

    ; Initialize memory pools
    JSR InitZeroPagePool
    JSR InitMainMemoryPool
    JSR InitGraphicsMemoryPool

    RTS

InitZeroPagePool:
    ; Manage zero page allocations
    LDA #$FB            ; Start of available zero page
    STA ZeroPageStart
    LDA #$FE            ; End of available zero page
    STA ZeroPageEnd
    LDA #$00
    STA ZeroPageUsed
    RTS

AllocateMemory:
    ; Input: A = size needed
    ; Output: Address in $FC/$FD, carry set if failed
    CMP #$80            ; Large allocation?
    BCS AllocateLarge

    ; Small allocation - try zero page first
    JSR TryZeroPageAlloc
    BCC AllocationSuccess

    ; Fall back to main memory
AllocateLarge:
    JSR AllocateMainMemory

AllocationSuccess:
    INC AllocatedBlocks
    RTS

TryZeroPageAlloc:
    ; Try to allocate from zero page
    LDA ZeroPageUsed
    CLC
    ADC AllocSize       ; Size in A
    CMP #$04            ; Only 4 bytes available
    BCS ZeroPageFull

    ; Allocation successful
    LDA ZeroPageStart
    CLC
    ADC ZeroPageUsed
    STA $FC             ; Return address
    LDA #$00
    STA $FD

    LDA ZeroPageUsed
    CLC
    ADC AllocSize
    STA ZeroPageUsed

    CLC                 ; Success
    RTS

ZeroPageFull:
    SEC                 ; Failed
    RTS

; ========================================
; GRAPHICS SUBSYSTEM INTEGRATION
; ========================================

InitGraphicsSystem:
    ; Initialize VIC-II graphics
    JSR SetupVideoMode
    JSR InitSpriteSystem
    JSR InitBackgroundSystem
    JSR InitAnimationSystem

    RTS

SetupVideoMode:
    ; Configure optimal video mode
    LDA #$1B            ; Enable multicolor, 40 columns
    STA $D011           ; VIC control register 1

    LDA #$C8            ; Enable multicolor
    STA $D016           ; VIC control register 2

    ; Set memory pointers
    LDA #$18            ; Screen at $0400, charset at $2000
    STA $D018           ; Memory setup register

    RTS

InitSpriteSystem:
    ; Setup sprite management
    LDA #$00
    STA ActiveSprites   ; No sprites active initially
    STA SpriteCollisions

    ; Initialize sprite data structures
    LDX #$00
    LDA #$FF            ; Invalid position marker
ClearSpriteLoop:
    STA SpriteData,X
    INX
    CPX #$40            ; 8 sprites × 8 bytes each
    BNE ClearSpriteLoop

    RTS

UpdateGraphics:
    ; Update all graphics subsystems
    JSR UpdateSprites
    JSR UpdateBackground
    JSR UpdateAnimations
    JSR CheckCollisions
    RTS

UpdateSprites:
    ; Update active sprites
    LDX #$00            ; Sprite counter
SpriteUpdateLoop:
    ; Check if sprite is active
    LDA SpriteData,X
    CMP #$FF
    BEQ NextSprite

    ; Update sprite position
    JSR UpdateSpritePosition

    ; Update sprite animation
    JSR UpdateSpriteAnimation

NextSprite:
    TXA
    CLC
    ADC #$08            ; Next sprite (8 bytes each)
    TAX
    CMP #$40            ; All 8 sprites checked?
    BNE SpriteUpdateLoop

    RTS

; ========================================
; AUDIO SUBSYSTEM INTEGRATION
; ========================================

InitAudioSystem:
    ; Initialize SID sound system
    JSR SilenceAllVoices
    JSR InitMusicSystem
    JSR InitSoundEffects

    RTS

SilenceAllVoices:
    ; Clear all SID registers
    LDX #$00
    LDA #$00
SIDClearLoop:
    STA $D400,X
    INX
    CPX #$1D            ; 29 SID registers
    BNE SIDClearLoop

    ; Set volume
    LDA #$0F            ; Maximum volume
    STA $D418

    RTS

UpdateAudio:
    ; Update all audio subsystems
    JSR UpdateMusic
    JSR UpdateSoundEffects
    JSR ProcessAudioQueue
    RTS

PlaySoundEffect:
    ; Input: A = sound effect ID
    ; Queue sound effect for playback
    LDX SFXQueueWrite
    STA SFXQueue,X
    INC SFXQueueWrite
    LDA SFXQueueWrite
    AND #$07            ; Wrap at 8 entries
    STA SFXQueueWrite
    RTS

; ========================================
; INPUT SUBSYSTEM INTEGRATION
; ========================================

InitInputSystem:
    ; Initialize input handling
    LDA #$00
    STA InputState
    STA PreviousInput
    STA InputBuffer
    STA KeyRepeatTimer

    RTS

ProcessInput:
    ; Read and process all input
    JSR ReadJoystick
    JSR ReadKeyboard
    JSR ProcessInputBuffer
    JSR UpdateInputState
    RTS

ReadJoystick:
    ; Read joystick port 2
    LDA $DC00
    EOR #$FF            ; Active low to active high
    STA RawJoystick

    ; Debounce input
    JSR DebounceInput

    ; Detect input changes
    LDA DebouncedInput
    EOR PreviousInput
    AND DebouncedInput  ; Only new presses
    STA InputEvents

    ; Update previous input
    LDA DebouncedInput
    STA PreviousInput

    RTS

DebounceInput:
    ; Simple debouncing algorithm
    LDA RawJoystick
    CMP DebounceBuffer
    BNE InputChanged

    ; Input stable, update debounced value
    STA DebouncedInput
    RTS

InputChanged:
    ; Input changed, start debounce timer
    STA DebounceBuffer
    LDA #$03            ; Debounce delay
    STA DebounceTimer
    RTS

; ========================================
; GAME LOGIC INTEGRATION
; ========================================

InitGameLogic:
    ; Initialize game-specific logic
    JSR InitPlayerData
    JSR InitEnemySystem
    JSR InitCollisionSystem
    JSR InitScoreSystem

    RTS

UpdateApplicationState:
    ; Update based on current application state
    LDA ApplicationState
    CMP #APP_STATE_MENU
    BEQ UpdateMenuState
    CMP #APP_STATE_PLAYING
    BEQ UpdatePlayingState
    CMP #APP_STATE_PAUSED
    BEQ UpdatePausedState
    CMP #APP_STATE_GAMEOVER
    BEQ UpdateGameOverState
    RTS

UpdatePlayingState:
    ; Update active gameplay
    JSR UpdatePlayer
    JSR UpdateEnemies
    JSR UpdateProjectiles
    JSR CheckGameConditions
    RTS

UpdatePlayer:
    ; Update player based on input
    LDA InputEvents
    AND #JOY_LEFT
    BEQ CheckRight
    JSR MovePlayerLeft

CheckRight:
    LDA InputEvents
    AND #JOY_RIGHT
    BEQ CheckFire
    JSR MovePlayerRight

CheckFire:
    LDA InputEvents
    AND #JOY_FIRE
    BEQ PlayerUpdateDone
    JSR PlayerFire

PlayerUpdateDone:
    RTS

; ========================================
; USER INTERFACE SYSTEM
; ========================================

InitUserInterface:
    ; Initialize UI elements
    JSR InitMenuSystem
    JSR InitHUD
    JSR InitDialogs

    RTS

UpdateUserInterface:
    ; Update UI based on application state
    LDA ApplicationState
    CMP #APP_STATE_MENU
    BEQ UpdateMenu
    CMP #APP_STATE_PLAYING
    BEQ UpdateHUD
    RTS

UpdateHUD:
    ; Update heads-up display
    JSR DisplayScore
    JSR DisplayLives
    JSR DisplayLevel
    RTS

DisplayScore:
    ; Display current score
    LDA #2              ; Row 2
    STA $D6
    LDA #2              ; Column 2
    STA $D3

    LDX #0
ScoreTextLoop:
    LDA ScoreText,X
    BEQ ScoreTextDone
    JSR $FFD2
    INX
    JMP ScoreTextLoop
ScoreTextDone:

    ; Display score value
    LDA PlayerScore+1   ; High byte
    JSR DisplayByte
    LDA PlayerScore     ; Low byte
    JSR DisplayByte

    RTS

; ========================================
; PERFORMANCE AND QUALITY SYSTEMS
; ========================================

StartFrameTimer:
    ; Start performance monitoring
    LDA $A2             ; CIA timer
    STA FrameStartTime
    RTS

CheckPerformance:
    ; Monitor application performance
    LDA $A2
    SEC
    SBC FrameStartTime
    STA FrameTime

    ; Check if frame took too long
    CMP #$40            ; Performance threshold
    BCC PerformanceOK

    ; Performance issue detected
    INC PerformanceIssues
    LDA PerformanceFlags
    ORA #PERF_SLOW_FRAME
    STA PerformanceFlags

PerformanceOK:
    INC FrameCounter
    RTS

HandleErrors:
    ; Check for and handle application errors
    LDA PerformanceFlags
    BEQ NoErrors

    ; Handle performance issues
    AND #PERF_SLOW_FRAME
    BEQ CheckMemoryErrors
    JSR HandleSlowFrame

CheckMemoryErrors:
    LDA MemoryUsage
    CMP #$C0            ; Memory threshold
    BCC NoErrors
    JSR HandleMemoryPressure

NoErrors:
    RTS

HandleSlowFrame:
    ; Respond to performance issues
    ; Reduce visual effects, skip non-critical updates
    LDA PerformanceFlags
    AND #$FF - PERF_SLOW_FRAME  ; Clear flag
    STA PerformanceFlags
    RTS
```

**Complete Application Framework Demo:**

```assembly
; Complete application framework demonstration
; Shows integration of all major subsystems

CompleteApplicationDemo:
    JSR InitializeFramework
    JSR RunMiniApplication
    JSR DisplayApplicationStatus
    RTS

InitializeFramework:
    ; Initialize complete application framework

    ; Setup application state
    LDA #$01            ; Menu state
    STA AppState
    LDA #$00
    STA AppSubState
    STA ErrorFlags
    STA PerformanceScore

    ; Initialize subsystems
    JSR InitFrameworkGraphics
    JSR InitFrameworkAudio
    JSR InitFrameworkInput
    JSR InitFrameworkLogic

    RTS

InitFrameworkGraphics:
    ; Initialize graphics subsystem
    LDA #$00
    STA ActiveSprites
    STA GraphicsMode
    STA RenderFlags

    ; Setup basic graphics
    LDA #$93            ; Clear screen
    JSR $FFD2

    ; Set text colour
    LDA #$0E            ; Light blue
    STA $286

    RTS

InitFrameworkAudio:
    ; Initialize audio subsystem
    LDA #$00
    STA MusicPlaying
    STA SFXPlaying
    STA AudioVolume

    ; Clear SID (simplified)
    LDA #$00
    STA $D400           ; Clear voice 1 frequency
    LDA #$0F            ; Set volume
    STA $D418

    RTS

InitFrameworkInput:
    ; Initialize input subsystem
    LDA #$00
    STA CurrentInput
    STA PreviousInput
    STA InputBuffer
    STA InputEvents

    RTS

InitFrameworkLogic:
    ; Initialize game logic
    LDA #$64            ; 100 health
    STA PlayerHealth
    LDA #$00
    STA PlayerScore
    STA PlayerScore+1
    STA GameLevel
    STA EnemyCount

    RTS

RunMiniApplication:
    ; Run simplified application loop
    LDX #$10            ; Run for 16 frames

ApplicationLoop:
    ; Store frame counter
    STX FramesRemaining

    ; Application loop components
    JSR ProcessFrameworkInput
    JSR UpdateFrameworkLogic
    JSR UpdateFrameworkGraphics
    JSR UpdateFrameworkAudio
    JSR MonitorPerformance

    ; Simple frame delay
    LDY #$20
FrameDelay:
    DEY
    BNE FrameDelay

    ; Continue loop
    LDX FramesRemaining
    DEX
    BNE ApplicationLoop

    RTS

ProcessFrameworkInput:
    ; Read joystick input
    LDA $DC00           ; Joystick port 2
    EOR #$FF            ; Invert (active low to high)
    STA CurrentInput

    ; Detect changes (new button presses)
    EOR PreviousInput
    AND CurrentInput    ; Only new presses
    STA InputEvents

    ; Update previous input
    LDA CurrentInput
    STA PreviousInput

    RTS

UpdateFrameworkLogic:
    ; Update application logic based on state
    LDA AppState
    CMP #$01            ; Menu state
    BEQ UpdateMenuLogic
    CMP #$02            ; Game state
    BEQ UpdateGameLogic
    RTS

UpdateMenuLogic:
    ; Handle menu logic
    LDA InputEvents
    AND #%00010000      ; Fire button
    BEQ MenuLogicDone

    ; Start game
    LDA #$02
    STA AppState
    LDA #$01
    STA GameLevel

MenuLogicDone:
    RTS

UpdateGameLogic:
    ; Handle game logic
    LDA InputEvents
    AND #%00000100      ; Left
    BEQ CheckRight

    ; Move left (simulate)
    LDA PlayerX
    SEC
    SBC #$02
    CMP #$20
    BCC CheckRight
    STA PlayerX

CheckRight:
    LDA InputEvents
    AND #%00001000      ; Right
    BEQ CheckFire

    ; Move right (simulate)
    LDA PlayerX
    CLC
    ADC #$02
    CMP #$C0
    BCS CheckFire
    STA PlayerX

CheckFire:
    LDA InputEvents
    AND #%00010000      ; Fire button
    BEQ GameLogicDone

    ; Fire (simulate)
    INC ShotsFired

    ; Add to score
    LDA PlayerScore
    CLC
    ADC #$01
    STA PlayerScore
    BCC GameLogicDone
    INC PlayerScore+1

GameLogicDone:
    RTS

UpdateFrameworkGraphics:
    ; Update graphics display
    LDA AppState
    CMP #$01            ; Menu state
    BEQ DisplayMenu
    CMP #$02            ; Game state
    BEQ DisplayGame
    RTS

DisplayMenu:
    ; Display menu screen
    LDA #5              ; Row 5
    STA $D6
    LDA #8              ; Column 8
    STA $D3

    LDX #0
MenuTextLoop:
    LDA MenuText,X
    BEQ MenuTextDone
    JSR $FFD2
    INX
    JMP MenuTextLoop
MenuTextDone:
    RTS

DisplayGame:
    ; Display game screen
    LDA #3              ; Row 3
    STA $D6
    LDA #2              ; Column 2
    STA $D3

    LDX #0
ScoreDisplayLoop:
    LDA ScoreText,X
    BEQ ScoreDisplayDone
    JSR $FFD2
    INX
    JMP ScoreDisplayLoop
ScoreDisplayDone:

    ; Display score value
    LDA PlayerScore+1
    JSR DisplayHexNibble
    LDA PlayerScore
    JSR DisplayHexByte

    ; Display player position
    LDA #5              ; Row 5
    STA $D6
    LDA #2              ; Column 2
    STA $D3

    LDX #0
PosTextLoop:
    LDA PositionText,X
    BEQ PosTextDone
    JSR $FFD2
    INX
    JMP PosTextLoop
PosTextDone:

    LDA PlayerX
    JSR DisplayHexByte

    RTS

DisplayHexByte:
    ; Display byte as hex
    PHA
    LSR
    LSR
    LSR
    LSR
    JSR DisplayHexNibble
    PLA
    AND #$0F
    JSR DisplayHexNibble
    RTS

DisplayHexNibble:
    ; Display nibble as hex digit
    CMP #$0A
    BCC DisplayDigit
    CLC
    ADC #$37            ; A-F
    JMP DisplayChar
DisplayDigit:
    CLC
    ADC #$30            ; 0-9
DisplayChar:
    JSR $FFD2
    RTS

UpdateFrameworkAudio:
    ; Update audio system
    LDA AppState
    CMP #$02            ; Only play audio in game
    BNE AudioDone

    ; Simple beep when firing
    LDA InputEvents
    AND #%00010000      ; Fire button
    BEQ AudioDone

    ; Play simple tone
    LDA #$10
    STA $D400           ; Voice 1 frequency low
    LDA #$20
    STA $D401           ; Voice 1 frequency high
    LDA #%00010001      ; Pulse wave
    STA $D404           ; Voice 1 control

AudioDone:
    RTS

MonitorPerformance:
    ; Monitor application performance
    INC FrameCount

    ; Check for performance issues
    LDA FrameCount
    AND #$07            ; Every 8 frames
    BNE PerformanceDone

    ; Calculate simple performance score
    LDA PlayerScore
    LSR                 ; Divide by 2
    CLC
    ADC FrameCount
    STA PerformanceScore

PerformanceDone:
    RTS

DisplayApplicationStatus:
    ; Display final application status
    LDA #$93            ; Clear screen
    JSR $FFD2

    ; Display title
    LDA #2
    STA $D6
    LDA #5
    STA $D3

    LDX #0
StatusTitleLoop:
    LDA StatusTitle,X
    BEQ StatusTitleDone
    JSR $FFD2
    INX
    JMP StatusTitleLoop
StatusTitleDone:

    ; Display performance score
    LDA #4
    STA $D6
    LDA #2
    STA $D3

    LDX #0
PerfTextLoop:
    LDA PerformanceText,X
    BEQ PerfTextDone
    JSR $FFD2
    INX
    JMP PerfTextLoop
PerfTextDone:

    LDA PerformanceScore
    JSR DisplayHexByte

    ; Display frame count
    LDA #6
    STA $D6
    LDA #2
    STA $D3

    LDX #0
FrameTextLoop:
    LDA FrameText,X
    BEQ FrameTextDone
    JSR $FFD2
    INX
    JMP FrameTextLoop
FrameTextDone:

    LDA FrameCount
    JSR DisplayHexByte

    RTS

; Text strings
MenuText:        .text \
```

## Advanced Application Patterns

### State Management System

Coordinate application state across all subsystems:

```text
; ========================================
; ADVANCED STATE MANAGEMENT
; ========================================

StateManager:
    ; Global application state
    GlobalState = $D000
    StateHistory = $D001    ; Previous 16 states
    StateTimer = $D011      ; Time in current state

    ; State change management
    StateTransitions = $D020
    PendingStateChange = $D021
    StateChangeReason = $D022

UpdateGlobalState:
    ; Manage state transitions and coordination
    LDA PendingStateChange
    BEQ NoStateChange

    ; Execute state transition
    JSR ExecuteStateTransition

NoStateChange:
    ; Update state timer
    INC StateTimer

    ; Check for automatic state transitions
    JSR CheckAutomaticTransitions

    RTS

ExecuteStateTransition:
    ; Change application state safely
    ; Input: New state in PendingStateChange

    ; Store previous state in history
    LDX StateHistoryIndex
    LDA GlobalState
    STA StateHistory,X
    INX
    TXA
    AND #$0F            ; Wrap at 16 entries
    STA StateHistoryIndex

    ; Execute exit handlers for current state
    LDA GlobalState
    JSR ExecuteStateExit

    ; Change to new state
    LDA PendingStateChange
    STA GlobalState

    ; Execute entry handlers for new state
    JSR ExecuteStateEntry

    ; Reset state timer
    LDA #$00
    STA StateTimer
    STA PendingStateChange

    RTS

RequestStateChange:
    ; Input: A = new state, X = reason
    STA PendingStateChange
    STX StateChangeReason
    RTS

; ========================================
; COMPONENT COMMUNICATION SYSTEM
; ========================================

ComponentManager:
    ; Message passing between components
    MessageQueue = $D100
    MessageCount = $D140
    ComponentStates = $D150

SendMessage:
    ; Input: A = message type, X = data, Y = target component
    LDZ MessageCount    ; Use Z as index
    STA MessageQueue,Z   ; Store message type
    INZ
    TXA
    STA MessageQueue,Z   ; Store data
    INZ
    TYA
    STA MessageQueue,Z   ; Store target
    INZ
    STZ MessageCount
    RTS

ProcessMessages:
    ; Process all pending messages
    LDA MessageCount
    BEQ NoMessages

    LDX #$00
MessageLoop:
    ; Get message components
    LDA MessageQueue,X   ; Message type
    PHA
    INX
    LDA MessageQueue,X   ; Data
    PHA
    INX
    LDA MessageQueue,X   ; Target
    TAY
    INX
    STX MessageIndex

    ; Dispatch message
    PLA                  ; Data
    TAX
    PLA                  ; Message type
    JSR DispatchMessage

    ; Continue with next message
    LDX MessageIndex
    CPX MessageCount
    BNE MessageLoop

    ; Clear message queue
    LDA #$00
    STA MessageCount

NoMessages:
    RTS

; ========================================
; PERFORMANCE OPTIMIZATION SYSTEM
; ========================================

PerformanceManager:
    ; Adaptive performance optimisation
    FrameTimeBudget = 40        ; Cycles per frame
    PerformanceLevel = $D200    ; Current performance setting

AdaptiveOptimization:
    ; Adjust performance based on frame time
    LDA LastFrameTime
    CMP #FrameTimeBudget
    BCC PerformanceGood

    ; Performance poor - reduce quality
    LDA PerformanceLevel
    BEQ MinPerformance
    DEC PerformanceLevel
    JSR ApplyPerformanceSettings
    RTS

PerformanceGood:
    ; Performance good - try to increase quality
    LDA LastFrameTime
    CMP #(FrameTimeBudget - 10)
    BCS NoImprovement

    LDA PerformanceLevel
    CMP #$03            ; Maximum level
    BCS NoImprovement
    INC PerformanceLevel
    JSR ApplyPerformanceSettings

NoImprovement:
MinPerformance:
    RTS

ApplyPerformanceSettings:
    ; Apply current performance level
    LDA PerformanceLevel
    CMP #$00
    BEQ LowPerformance
    CMP #$01
    BEQ MediumPerformance
    CMP #$02
    BEQ HighPerformance
    ; Maximum performance
    RTS

LowPerformance:
    ; Reduce visual effects, skip animations
    LDA #$00
    STA EffectsEnabled
    STA AnimationsEnabled
    RTS

MediumPerformance:
    ; Enable animations, reduce effects
    LDA #$01
    STA AnimationsEnabled
    LDA #$00
    STA EffectsEnabled
    RTS

HighPerformance:
    ; Enable most features
    LDA #$01
    STA AnimationsEnabled
    STA EffectsEnabled
    RTS
```

**Advanced Application Architecture Demo:**

```assembly
; Advanced application architecture demonstration
; Shows state management and component communication

AdvancedArchitectureDemo:
    JSR InitializeArchitecture
    JSR DemoStateManagement
    JSR DemoComponentCommunication
    JSR DemoPerformanceAdaptation
    RTS

InitializeArchitecture:
    ; Setup advanced architecture systems
    LDA #$01            ; Initial state: INIT
    STA ApplicationState
    LDA #$00
    STA StateTimer
    STA MessageCount
    STA PerformanceLevel
    STA ComponentStatus

    ; Initialize component states
    LDA #%11111111      ; All components active
    STA ActiveComponents

    RTS

DemoStateManagement:
    ; Demonstrate state management system

    ; Simulate state progression
    JSR ProcessStateInit
    JSR TransitionToMenu
    JSR ProcessStateMenu
    JSR TransitionToGame
    JSR ProcessStateGame

    RTS

ProcessStateInit:
    ; Handle initialization state
    LDA ApplicationState
    CMP #$01            ; INIT state
    BNE InitDone

    ; Perform initialization tasks
    INC StateTimer
    LDA StateTimer
    CMP #$05            ; Initialize for 5 cycles
    BCC InitDone

    ; Ready to transition to menu
    LDA #$02            ; MENU state
    JSR RequestStateTransition

InitDone:
    RTS

TransitionToMenu:
    ; Transition from INIT to MENU
    LDA PendingTransition
    BEQ NoTransition

    ; Execute state change
    LDA ApplicationState
    STA PreviousState
    LDA PendingTransition
    STA ApplicationState

    ; Reset state timer
    LDA #$00
    STA StateTimer
    STA PendingTransition

    ; Send state change message to components
    LDA #$10            ; State change message
    LDX ApplicationState ; New state data
    LDY #$FF            ; Broadcast to all components
    JSR QueueMessage

NoTransition:
    RTS

ProcessStateMenu:
    ; Handle menu state logic
    LDA ApplicationState
    CMP #$02            ; MENU state
    BNE MenuDone

    ; Simulate user interaction
    INC StateTimer
    LDA StateTimer
    CMP #$08            ; Menu timeout
    BCC MenuDone

    ; Transition to game
    LDA #$03            ; GAME state
    JSR RequestStateTransition

MenuDone:
    RTS

TransitionToGame:
    ; Handle transition to game state
    JSR TransitionToMenu ; Reuse transition logic
    RTS

ProcessStateGame:
    ; Handle game state logic
    LDA ApplicationState
    CMP #$03            ; GAME state
    BNE GameDone

    ; Game logic simulation
    INC StateTimer
    INC GameProgress

    ; Check for game events
    LDA GameProgress
    CMP #$10
    BCC GameDone

    ; Game event occurred
    LDA #$20            ; Game event message
    LDX #$05            ; Event data
    LDY #$01            ; Send to graphics component
    JSR QueueMessage

GameDone:
    RTS

RequestStateTransition:
    ; Request state transition
    ; Input: A = new state
    STA PendingTransition
    RTS

DemoComponentCommunication:
    ; Demonstrate inter-component messaging

    ; Graphics component sends message to audio
    LDA #$30            ; Graphics update message
    LDX #$42            ; Graphics data
    LDY #$02            ; Audio component ID
    JSR QueueMessage

    ; Audio component responds to graphics
    LDA #$31            ; Audio response message
    LDX #$24            ; Audio data
    LDY #$01            ; Graphics component ID
    JSR QueueMessage

    ; Process all queued messages
    JSR ProcessMessageQueue

    RTS

QueueMessage:
    ; Queue message for processing
    ; Input: A = message type, X = data, Y = target component

    ; Check queue space
    LDA MessageCount
    CMP #$20            ; Maximum 32 messages
    BCS QueueFull

    ; Add message to queue
    LDZ MessageCount
    STA MessageQueue,Z   ; Message type
    INZ
    TXA
    STA MessageQueue,Z   ; Data
    INZ
    TYA
    STA MessageQueue,Z   ; Target
    INZ
    STZ MessageCount

QueueFull:
    RTS

ProcessMessageQueue:
    ; Process all queued messages
    LDA MessageCount
    BEQ NoMessages

    LDX #$00
ProcessLoop:
    ; Extract message
    LDA MessageQueue,X   ; Message type
    PHA
    INX
    LDA MessageQueue,X   ; Data
    PHA
    INX
    LDA MessageQueue,X   ; Target component
    TAY
    INX
    STX MessageIndex

    ; Process message based on type
    PLA                  ; Data in A
    TAX                  ; Data in X
    PLA                  ; Message type in A
    JSR ProcessSingleMessage

    ; Continue to next message
    LDX MessageIndex
    CPX MessageCount
    BNE ProcessLoop

    ; Clear message queue
    LDA #$00
    STA MessageCount

NoMessages:
    RTS

ProcessSingleMessage:
    ; Process individual message
    ; Input: A = message type, X = data, Y = target component

    CMP #$10            ; State change message
    BEQ HandleStateChange
    CMP #$20            ; Game event message
    BEQ HandleGameEvent
    CMP #$30            ; Graphics message
    BEQ HandleGraphicsMessage
    CMP #$31            ; Audio message
    BEQ HandleAudioMessage
    RTS

HandleStateChange:
    ; Handle state change notification
    ; Update component based on new state
    LDA ComponentStatus
    ORA #%00000001      ; Mark state updated
    STA ComponentStatus
    RTS

HandleGameEvent:
    ; Handle game event
    LDA ComponentStatus
    ORA #%00000010      ; Mark event processed
    STA ComponentStatus
    RTS

HandleGraphicsMessage:
    ; Handle graphics message
    LDA ComponentStatus
    ORA #%00000100      ; Mark graphics updated
    STA ComponentStatus
    RTS

HandleAudioMessage:
    ; Handle audio message
    LDA ComponentStatus
    ORA #%00001000      ; Mark audio updated
    STA ComponentStatus
    RTS

DemoPerformanceAdaptation:
    ; Demonstrate adaptive performance optimisation

    ; Simulate varying frame times
    LDA #$50            ; High frame time (poor performance)
    JSR AdaptToPerformance

    LDA #$20            ; Low frame time (good performance)
    JSR AdaptToPerformance

    LDA #$35            ; Medium frame time
    JSR AdaptToPerformance

    RTS

AdaptToPerformance:
    ; Adapt performance based on frame time
    ; Input: A = frame time
    STA CurrentFrameTime

    ; Compare with performance target
    CMP #$40            ; Target frame time
    BCC GoodPerformance

    ; Poor performance - reduce quality
    LDA PerformanceLevel
    BEQ MinimumLevel
    DEC PerformanceLevel
    JSR ApplyOptimizations
    RTS

GoodPerformance:
    ; Good performance - try to increase quality
    CMP #$30            ; Excellent performance threshold
    BCS PerformanceDone

    LDA PerformanceLevel
    CMP #$03            ; Maximum level
    BCS PerformanceDone
    INC PerformanceLevel
    JSR ApplyOptimizations

MinimumLevel:
PerformanceDone:
    RTS

ApplyOptimizations:
    ; Apply performance optimizations based on level
    LDA PerformanceLevel
    CMP #$00
    BEQ ApplyLowPerformance
    CMP #$01
    BEQ ApplyMediumPerformance
    CMP #$02
    BEQ ApplyHighPerformance

    ; Maximum performance
    LDA #%11111111      ; Enable all features
    STA EnabledFeatures
    RTS

ApplyLowPerformance:
    LDA #%00000001      ; Essential features only
    STA EnabledFeatures
    RTS

ApplyMediumPerformance:
    LDA #%00001111      ; Half features
    STA EnabledFeatures
    RTS

ApplyHighPerformance:
    LDA #%01111111      ; Most features
    STA EnabledFeatures
    RTS

; Application state variables
ApplicationState:    .byte 1     ; Current application state
PreviousState:       .byte 0     ; Previous state
StateTimer:          .byte 0     ; Time in current state
PendingTransition:   .byte 0     ; Pending state change
GameProgress:        .byte 0     ; Game progress counter

; Component communication
MessageQueue:        .res 48     ; Message queue (16 messages × 3 bytes)
MessageCount:        .byte 0     ; Number of queued messages
MessageIndex:        .byte 0     ; Current message index
ComponentStatus:     .byte 0     ; Component status flags
ActiveComponents:    .byte 0     ; Active component mask

; Performance management
PerformanceLevel:    .byte 2     ; Current performance level (0-3)
CurrentFrameTime:    .byte 0     ; Last frame time
EnabledFeatures:     .byte 0     ; Currently enabled features

; Run the advanced architecture demonstration
JSR AdvancedArchitectureDemo
```

## Complete Application Example: Mini Space Game

Let's build a complete mini game integrating all systems:

**Complete Mini Space Game:**

```assembly
; Complete mini space game demonstration
; Integrates graphics, audio, input, logic, and UI

MiniSpaceGame:
    JSR InitializeGame
    JSR RunGameLoop
    JSR DisplayFinalResults
    RTS

InitializeGame:
    ; Initialize complete game system

    ; Clear screen and setup display
    LDA #$93            ; Clear screen
    JSR $FFD2
    LDA #$0E            ; Light blue text
    STA $286

    ; Initialize game state
    LDA #$01            ; Game state: PLAYING
    STA GameState
    LDA #$64            ; 100 health
    STA PlayerHealth
    LDA #$00
    STA PlayerScore
    STA PlayerScore+1
    STA EnemyCount
    STA ProjectileCount
    STA GameLevel

    ; Initialize player
    LDA #$50            ; Center X
    STA PlayerX
    LDA #$B0            ; Bottom Y
    STA PlayerY
    LDA #$01
    STA PlayerAlive

    ; Initialize input system
    LDA #$00
    STA CurrentInput
    STA PreviousInput
    STA InputBuffer

    ; Initialize enemies
    JSR SpawnInitialEnemies

    ; Display initial UI
    JSR DrawGameUI

    RTS

SpawnInitialEnemies:
    ; Create initial enemy formation
    LDA #$03            ; 3 enemies
    STA EnemyCount

    ; Enemy 1
    LDA #$20
    STA Enemy1X
    LDA #$20
    STA Enemy1Y
    LDA #$01
    STA Enemy1Alive

    ; Enemy 2
    LDA #$50
    STA Enemy2X
    LDA #$30
    STA Enemy2Y
    LDA #$01
    STA Enemy2Alive

    ; Enemy 3
    LDA #$80
    STA Enemy3X
    LDA #$40
    STA Enemy3Y
    LDA #$01
    STA Enemy3Alive

    RTS

RunGameLoop:
    ; Main game loop - run for demonstration
    LDX #$20            ; Run for 32 frames

GameLoop:
    STX FramesLeft

    ; Core game loop
    JSR ProcessGameInput
    JSR UpdateGameLogic
    JSR UpdateGameGraphics
    JSR UpdateGameAudio
    JSR CheckGameConditions

    ; Frame synchronization
    JSR GameFrameDelay

    ; Check if game should continue
    LDA GameState
    CMP #$00            ; GAME_OVER
    BEQ GameLoopEnd

    LDX FramesLeft
    DEX
    BNE GameLoop

GameLoopEnd:
    RTS

ProcessGameInput:
    ; Read and process player input
    LDA $DC00           ; Read joystick port 2
    EOR #$FF            ; Convert active low to high
    STA CurrentInput

    ; Detect new button presses
    EOR PreviousInput
    AND CurrentInput
    STA InputEvents

    ; Update previous input
    LDA CurrentInput
    STA PreviousInput

    RTS

UpdateGameLogic:
    ; Update all game logic
    JSR UpdatePlayer
    JSR UpdateEnemies
    JSR UpdateProjectiles
    JSR CheckCollisions
    RTS

UpdatePlayer:
    ; Update player based on input
    LDA PlayerAlive
    BEQ PlayerUpdateDone

    ; Handle movement
    LDA CurrentInput
    AND #%00000100      ; Left
    BEQ CheckPlayerRight

    LDA PlayerX
    SEC
    SBC #$02            ; Move left
    CMP #$10            ; Left boundary
    BCC CheckPlayerRight
    STA PlayerX

CheckPlayerRight:
    LDA CurrentInput
    AND #%00001000      ; Right
    BEQ CheckPlayerFire

    LDA PlayerX
    CLC
    ADC #$02            ; Move right
    CMP #$F0            ; Right boundary
    BCS CheckPlayerFire
    STA PlayerX

CheckPlayerFire:
    LDA InputEvents
    AND #%00010000      ; Fire button (new press only)
    BEQ PlayerUpdateDone

    ; Fire projectile
    JSR FirePlayerProjectile

PlayerUpdateDone:
    RTS

FirePlayerProjectile:
    ; Create player projectile
    LDA ProjectileCount
    CMP #$04            ; Maximum 4 projectiles
    BCS CannotFire

    ; Find empty projectile slot
    LDX #$00
FindProjectileSlot:
    LDA ProjectileActive,X
    BEQ FoundSlot
    INX
    CPX #$04
    BNE FindProjectileSlot
    RTS                 ; No slots available

FoundSlot:
    ; Create projectile
    LDA #$01
    STA ProjectileActive,X
    LDA PlayerX
    STA ProjectileX,X
    LDA PlayerY
    SEC
    SBC #$08            ; Spawn above player
    STA ProjectileY,X
    LDA #$FB            ; Upward velocity
    STA ProjectileVY,X

    INC ProjectileCount

CannotFire:
    RTS

UpdateEnemies:
    ; Update enemy movement and AI
    JSR UpdateEnemy1
    JSR UpdateEnemy2
    JSR UpdateEnemy3
    RTS

UpdateEnemy1:
    LDA Enemy1Alive
    BEQ Enemy1Done

    ; Simple enemy movement
    LDA Enemy1X
    CLC
    ADC #$01            ; Move right
    CMP #$E0            ; Right boundary
    BCC StoreEnemy1X
    LDA #$10            ; Reset to left
StoreEnemy1X:
    STA Enemy1X

    ; Move down slowly
    LDA Enemy1Y
    CLC
    ADC #$01
    CMP #$C0            ; Bottom boundary
    BCC StoreEnemy1Y
    LDA #$20            ; Reset to top
StoreEnemy1Y:
    STA Enemy1Y

Enemy1Done:
    RTS

UpdateEnemy2:
    LDA Enemy2Alive
    BEQ Enemy2Done

    ; Different movement pattern
    LDA Enemy2X
    SEC
    SBC #$01            ; Move left
    CMP #$10            ; Left boundary
    BCS StoreEnemy2X
    LDA #$E0            ; Reset to right
StoreEnemy2X:
    STA Enemy2X

    LDA Enemy2Y
    CLC
    ADC #$01
    CMP #$C0
    BCC StoreEnemy2Y
    LDA #$30
StoreEnemy2Y:
    STA Enemy2Y

Enemy2Done:
    RTS

UpdateEnemy3:
    LDA Enemy3Alive
    BEQ Enemy3Done

    ; Vertical movement only
    LDA Enemy3Y
    CLC
    ADC #$02            ; Move down faster
    CMP #$C0
    BCC StoreEnemy3Y
    LDA #$40            ; Reset to top
StoreEnemy3Y:
    STA Enemy3Y

Enemy3Done:
    RTS

UpdateProjectiles:
    ; Update all projectiles
    LDX #$00
ProjectileLoop:
    LDA ProjectileActive,X
    BEQ NextProjectile

    ; Move projectile
    LDA ProjectileY,X
    CLC
    ADC ProjectileVY,X  ; VY is negative for upward movement
    STA ProjectileY,X

    ; Check if projectile is off-screen
    CMP #$10            ; Top of screen
    BCS NextProjectile

    ; Remove projectile
    LDA #$00
    STA ProjectileActive,X
    DEC ProjectileCount

NextProjectile:
    INX
    CPX #$04
    BNE ProjectileLoop

    RTS

CheckCollisions:
    ; Check projectile-enemy collisions
    LDX #$00            ; Projectile index
ProjectileCollisionLoop:
    LDA ProjectileActive,X
    BEQ NextProjectileCollision

    ; Check collision with each enemy
    JSR CheckProjectileEnemyCollision

NextProjectileCollision:
    INX
    CPX #$04
    BNE ProjectileCollisionLoop

    RTS

CheckProjectileEnemyCollision:
    ; Check projectile X vs enemies
    ; Simplified collision detection

    ; Check Enemy 1
    LDA Enemy1Alive
    BEQ CheckEnemy2Collision

    LDA ProjectileX,X
    SEC
    SBC Enemy1X
    BPL Enemy1XPositive
    EOR #$FF            ; Absolute value
    CLC
    ADC #$01
Enemy1XPositive:
    CMP #$08            ; Collision threshold
    BCS CheckEnemy2Collision

    LDA ProjectileY,X
    SEC
    SBC Enemy1Y
    BPL Enemy1YPositive
    EOR #$FF
    CLC
    ADC #$01
Enemy1YPositive:
    CMP #$08
    BCS CheckEnemy2Collision

    ; Collision detected!
    JSR DestroyEnemy1
    JSR DestroyProjectile
    JSR AddScore

CheckEnemy2Collision:
    ; Similar logic for other enemies
    ; Simplified for demo

    RTS

DestroyEnemy1:
    LDA #$00
    STA Enemy1Alive
    DEC EnemyCount
    RTS

DestroyProjectile:
    LDA #$00
    STA ProjectileActive,X
    DEC ProjectileCount
    RTS

AddScore:
    ; Add 10 points to score
    LDA PlayerScore
    CLC
    ADC #$0A
    STA PlayerScore
    BCC ScoreNoCarry
    INC PlayerScore+1
ScoreNoCarry:
    RTS

UpdateGameGraphics:
    ; Update game display
    JSR DrawPlayer
    JSR DrawEnemies
    JSR DrawProjectiles
    JSR UpdateGameUI
    RTS

DrawPlayer:
    ; Draw player at current position
    LDA PlayerAlive
    BEQ PlayerDrawDone

    ; Position cursor
    LDA PlayerY
    LSR                 ; Scale Y to screen rows
    LSR
    LSR
    STA $D6             ; Cursor row
    LDA PlayerX
    LSR                 ; Scale X to screen columns
    LSR
    STA $D3             ; Cursor column

    ; Draw player character
    LDA #'@'            ; Player symbol
    JSR $FFD2

PlayerDrawDone:
    RTS

DrawEnemies:
    ; Draw all alive enemies
    LDA Enemy1Alive
    BEQ SkipEnemy1Draw

    LDA Enemy1Y
    LSR
    LSR
    LSR
    STA $D6
    LDA Enemy1X
    LSR
    LSR
    STA $D3
    LDA #'X'            ; Enemy symbol
    JSR $FFD2

SkipEnemy1Draw:
    LDA Enemy2Alive
    BEQ SkipEnemy2Draw

    LDA Enemy2Y
    LSR
    LSR
    LSR
    STA $D6
    LDA Enemy2X
    LSR
    LSR
    STA $D3
    LDA #'X'
    JSR $FFD2

SkipEnemy2Draw:
    LDA Enemy3Alive
    BEQ DrawEnemiesDone

    LDA Enemy3Y
    LSR
    LSR
    LSR
    STA $D6
    LDA Enemy3X
    LSR
    LSR
    STA $D3
    LDA #'X'
    JSR $FFD2

DrawEnemiesDone:
    RTS

DrawProjectiles:
    ; Draw active projectiles
    LDX #$00
DrawProjectileLoop:
    LDA ProjectileActive,X
    BEQ NextProjectileDraw

    ; Position and draw projectile
    LDA ProjectileY,X
    LSR
    LSR
    LSR
    STA $D6
    LDA ProjectileX,X
    LSR
    LSR
    STA $D3
    LDA #'|'            ; Projectile symbol
    JSR $FFD2

NextProjectileDraw:
    INX
    CPX #$04
    BNE DrawProjectileLoop

    RTS

DrawGameUI:
    ; Draw game user interface
    LDA #1              ; Top row
    STA $D6
    LDA #2              ; Left column
    STA $D3

    LDX #0
ScoreUILoop:
    LDA ScoreUIText,X
    BEQ ScoreUIDone
    JSR $FFD2
    INX
    JMP ScoreUILoop
ScoreUIDone:

    ; Display score
    LDA PlayerScore+1
    JSR DisplayHexByte
    LDA PlayerScore
    JSR DisplayHexByte

    RTS

UpdateGameUI:
    ; Update dynamic UI elements
    JSR DrawGameUI
    RTS

UpdateGameAudio:
    ; Handle game audio
    ; Simple audio feedback for events
    LDA InputEvents
    AND #%00010000      ; Fire button
    BEQ AudioDone

    ; Play fire sound effect
    LDA #$20
    STA $D400           ; Voice 1 frequency low
    LDA #$08
    STA $D401           ; Voice 1 frequency high
    LDA #%00010001      ; Pulse wave
    STA $D404           ; Voice 1 control

AudioDone:
    RTS

CheckGameConditions:
    ; Check for game over conditions
    LDA EnemyCount
    BNE GameContinues

    ; All enemies destroyed - victory!
    LDA #$02            ; VICTORY state
    STA GameState
    RTS

GameContinues:
    ; Check player health
    LDA PlayerHealth
    BNE GameStillActive

    ; Player dead - game over
    LDA #$00            ; GAME_OVER state
    STA GameState

GameStillActive:
    RTS

GameFrameDelay:
    ; Simple frame delay
    LDY #$30
FrameDelayLoop:
    DEY
    BNE FrameDelayLoop
    RTS

DisplayFinalResults:
    ; Display final game results
    LDA #$93            ; Clear screen
    JSR $FFD2

    ; Display title
    LDA #5
    STA $D6
    LDA #8
    STA $D3

    LDX #0
ResultsTitleLoop:
    LDA ResultsTitle,X
    BEQ ResultsTitleDone
    JSR $FFD2
    INX
    JMP ResultsTitleLoop
ResultsTitleDone:

    ; Display final score
    LDA #7
    STA $D6
    LDA #5
    STA $D3

    LDX #0
FinalScoreLoop:
    LDA FinalScoreText,X
    BEQ FinalScoreDone
    JSR $FFD2
    INX
    JMP FinalScoreLoop
FinalScoreDone:

    LDA PlayerScore+1
    JSR DisplayHexByte
    LDA PlayerScore
    JSR DisplayHexByte

    ; Display game result
    LDA #9
    STA $D6
    LDA #5
    STA $D3

    LDA GameState
    CMP #$02            ; Victory?
    BEQ DisplayVictory

    ; Game over
    LDX #0
GameOverLoop:
    LDA GameOverText,X
    BEQ ResultsDone
    JSR $FFD2
    INX
    JMP GameOverLoop

DisplayVictory:
    LDX #0
VictoryLoop:
    LDA VictoryText,X
    BEQ ResultsDone
    JSR $FFD2
    INX
    JMP VictoryLoop

ResultsDone:
    RTS

DisplayHexByte:
    ; Display byte as hexadecimal
    PHA
    LSR
    LSR
    LSR
    LSR
    JSR DisplayHexNibble
    PLA
    AND #$0F
    JSR DisplayHexNibble
    RTS

DisplayHexNibble:
    CMP #$0A
    BCC DisplayDigit
    CLC
    ADC #$37            ; A-F
    JMP DisplayChar
DisplayDigit:
    CLC
    ADC #$30            ; 0-9
DisplayChar:
    JSR $FFD2
    RTS

; Text strings
ScoreUIText:    .text \
```

## Application Polish and Quality Assurance

### Quality Checklist

Ensure your application meets professional standards:

```text
; QUALITY ASSURANCE CHECKLIST
; ========================================

QualityStandards:
    ; Performance Requirements
    ; - Maintains 60 FPS target
    ; - Memory usage under limit
    ; - No memory leaks
    ; - Responsive input handling

    ; Functionality Requirements
    ; - All features work as specified
    ; - Error conditions handled gracefully
    ; - Edge cases tested and working
    ; - User interface intuitive

    ; Code Quality Requirements
    ; - Code well-organised and documented
    ; - No dead code or unused variables
    ; - Consistent naming conventions
    ; - Modular architecture maintained

QualityAssurance:
    ; Automated quality checks
    JSR CheckPerformanceStandards
    JSR CheckMemoryUsage
    JSR CheckCodeQuality
    JSR CheckUserExperience

    ; Generate quality report
    JSR GenerateQualityReport
    RTS

CheckPerformanceStandards:
    ; Verify performance meets requirements
    LDA AverageFrameTime
    CMP #MaxAllowedFrameTime
    BCC PerformanceGood

    LDA QualityFlags
    ORA #QUALITY_PERF_ISSUE
    STA QualityFlags

PerformanceGood:
    RTS

CheckMemoryUsage:
    ; Verify memory usage is within limits
    LDA CurrentMemoryUsage
    CMP #MaxMemoryLimit
    BCC MemoryGood

    LDA QualityFlags
    ORA #QUALITY_MEMORY_ISSUE
    STA QualityFlags

MemoryGood:
    RTS

; Quality constants
QUALITY_PERF_ISSUE = %00000001
QUALITY_MEMORY_ISSUE = %00000010
QUALITY_CODE_ISSUE = %00000100
QUALITY_UX_ISSUE = %00001000

MaxAllowedFrameTime = $40
MaxMemoryLimit = $C0
QualityFlags: .byte 0
```

## Best Practices for Complete Applications

### 1. Design Before Coding

```text
; Always plan architecture before implementation
; Define interfaces between components
; Consider scalability and maintainability
```

### 2. Build Incrementally

```text
; Start with core functionality
; Add features iteratively
; Test continuously throughout development
```

### 3. Optimize Intelligently

```text
; Profile before optimizing
; Focus on bottlenecks, not micro-optimizations
; Maintain code clarity while optimizing
```

### 4. Test Thoroughly

```text
; Test normal operation
; Test edge cases and error conditions
; Test performance under load
; Test user experience scenarios
```

### 5. Document Comprehensively

```text
; Document architecture decisions
; Explain complex algorithms
; Provide user and maintenance documentation
```

## What You've Learned

In this final lesson, you've mastered the complete application development process:

- **Application Architecture**: Designing coordinated systems that work together seamlessly
- **State Management**: Managing complex application state across multiple components
- **Component Integration**: Combining graphics, audio, input, and logic into cohesive applications
- **Performance Optimization**: Building applications that run smoothly and efficiently
- **Quality Assurance**: Ensuring applications meet professional standards for reliability and usability
- **Complete Development Process**: From initial design through final polish and deployment

## Congratulations!

You have completed Phase 1 of the Code Like It's 198x curriculum! You've learned the fundamental skills of professional assembly programming on the Commodore 64:

- **Memory Management**: Expert-level understanding of 6502 memory architecture
- **Graphics Programming**: Complete understanding of VIC-II graphics capabilities
- **Audio Programming**: Professional SID sound synthesis and music
- **Input Processing**: Robust input handling and user interaction
- **System Integration**: Combining all components into complete applications
- **Professional Practices**: Project planning, debugging, optimisation, and quality assurance

## Looking Ahead to Phase 2

Phase 2 will expand your skills into advanced topics:

- Advanced graphics techniques and custom hardware programming
- Complex audio synthesis and real-time music generation
- Advanced optimisation and performance techniques
- Cross-platform development and portability
- Advanced project architectures and frameworks

## Fun Fact

The complete application development skills you've learned are the foundation of all professional software development! The modular architecture patterns are used in modern frameworks like React and Angular. The state management techniques are the basis for Redux and MobX. The component communication patterns are used in microservices and distributed systems. The performance optimisation and quality assurance practices are essential in everything from mobile apps to enterprise software. You've learned the timeless principles that make the difference between amateur code and professional software engineering!
