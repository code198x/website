---
title: "Game State Management"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 27
description: "Learn to organize and manage complex game states for professional applications. Master state machines, transitions, and data management to build robust, maintainable NES games."
learning_objectives:
  - "Design and implement game state machines"
  - "Create smooth transitions between different game modes"
  - "Manage state-specific data and resources efficiently"
  - "Build modular, maintainable game architectures"
  - "Handle state persistence and game flow control"
concepts:
  - "State machine design patterns"
  - "Game mode organization and transitions"
  - "State-specific resource management"
  - "Modular programming architecture"
  - "Professional game development patterns"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 27
---

# Lesson 27: Game State Management

Master the architecture of professional game development! This lesson teaches you how to organize complex applications into manageable states, create smooth transitions between game modes, and build the robust systems that make great NES games possible.

## Game State Machine Fundamentals

A state machine organizes your game into discrete modes, each with its own behavior:

```text
Common Game States:
- Title Screen: Initial menu and options
- Gameplay: Main interactive experience  
- Pause Menu: Temporary interruption
- Game Over: End condition handling
- High Scores: Achievement display
- Settings: Configuration options

State Machine Benefits:
- Clear organization of game flow
- Isolated functionality per state
- Predictable transitions
- Easier debugging and maintenance
- Modular development approach
```

Basic state machine implementation:

```assembly
; Game state constants
STATE_TITLE     = $00
STATE_GAMEPLAY  = $01
STATE_PAUSE     = $02
STATE_GAMEOVER  = $03
STATE_SETTINGS  = $04

; Current game state
GameState: .byte STATE_TITLE

; State machine main loop
MainGameLoop:
    LDA GameState
    CMP #STATE_TITLE
    BEQ RunTitleState
    CMP #STATE_GAMEPLAY
    BEQ RunGameplayState
    CMP #STATE_PAUSE
    BEQ RunPauseState
    CMP #STATE_GAMEOVER
    BEQ RunGameOverState
    CMP #STATE_SETTINGS
    BEQ RunSettingsState
    
    ; Invalid state - reset to title
    LDA #STATE_TITLE
    STA GameState
    
RunTitleState:
    JSR UpdateTitleScreen
    JMP MainGameLoop
    
RunGameplayState:
    JSR UpdateGameplay
    JMP MainGameLoop
    
RunPauseState:
    JSR UpdatePauseMenu
    JMP MainGameLoop
    
RunGameOverState:
    JSR UpdateGameOver
    JMP MainGameLoop
    
RunSettingsState:
    JSR UpdateSettings
    JMP MainGameLoop
```

**Basic Game State Machine:**

```assembly
; Simple game state machine demonstration
Main:
    JSR InitStates
    
GameLoop:
    JSR UpdateState
    JSR RenderState
    JMP GameLoop

InitStates:
    ; Start in title state
    LDA #$00             ; STATE_TITLE
    STA GameState
    STA StateTimer
    STA MenuSelection
    RTS

UpdateState:
    ; Process current state
    LDA GameState
    CMP #$00             ; Title state
    BEQ UpdateTitle
    CMP #$01             ; Game state
    BEQ UpdateGame
    CMP #$02             ; Pause state
    BEQ UpdatePause
    RTS

UpdateTitle:
    ; Update title screen
    INC StateTimer
    JSR ProcessTitleInput
    
    ; Auto-advance after delay (for demo)
    LDA StateTimer
    CMP #$78             ; 120 frames (2 seconds)
    BNE TitleDone
    JSR TransitionToGame
    
TitleDone:
    RTS

UpdateGame:
    ; Update game logic
    INC StateTimer
    JSR ProcessGameInput
    
    ; Auto-pause after delay (for demo)
    LDA StateTimer
    CMP #$B4             ; 180 frames (3 seconds)
    BNE GameDone
    JSR TransitionToPause
    
GameDone:
    RTS

UpdatePause:
    ; Update pause menu
    INC StateTimer
    JSR ProcessPauseInput
    
    ; Auto-resume after delay (for demo)
    LDA StateTimer
    CMP #$3C             ; 60 frames (1 second)
    BNE PauseDone
    JSR TransitionToTitle
    
PauseDone:
    RTS

ProcessTitleInput:
    ; Simulate input processing
    JSR ReadController
    AND #%10000000       ; A button
    BEQ TitleInputDone
    JSR TransitionToGame
    
TitleInputDone:
    RTS

ProcessGameInput:
    ; Simulate game input
    JSR ReadController
    AND #%00010000       ; Start button
    BEQ GameInputDone
    JSR TransitionToPause
    
GameInputDone:
    RTS

ProcessPauseInput:
    ; Simulate pause input
    JSR ReadController
    AND #%00010000       ; Start button
    BEQ PauseInputDone
    JSR TransitionToGame
    
PauseInputDone:
    RTS

TransitionToGame:
    LDA #$01             ; STATE_GAME
    STA GameState
    LDA #$00
    STA StateTimer
    JSR InitGameState
    RTS

TransitionToPause:
    LDA #$02             ; STATE_PAUSE
    STA GameState
    LDA #$00
    STA StateTimer
    JSR InitPauseState
    RTS

TransitionToTitle:
    LDA #$00             ; STATE_TITLE
    STA GameState
    LDA #$00
    STA StateTimer
    JSR InitTitleState
    RTS

InitTitleState:
    ; Initialize title screen
    LDA #$01
    STA DisplayMode      ; Title display
    RTS

InitGameState:
    ; Initialize gameplay
    LDA #$02
    STA DisplayMode      ; Game display
    RTS

InitPauseState:
    ; Initialize pause menu
    LDA #$03
    STA DisplayMode      ; Pause display
    RTS

RenderState:
    ; Render based on current state
    LDA DisplayMode
    CMP #$01
    BEQ RenderTitle
    CMP #$02
    BEQ RenderGame
    CMP #$03
    BEQ RenderPause
    RTS

RenderTitle:
    ; Title screen rendering
    LDA #$60
    STA SpriteData+0     ; Title sprite Y
    LDA #$54             ; 'T' tile
    STA SpriteData+1
    LDA #$00
    STA SpriteData+2
    LDA #$80
    STA SpriteData+3     ; Center X
    RTS

RenderGame:
    ; Game rendering
    LDA #$80
    STA SpriteData+0     ; Game sprite Y
    LDA #$47             ; 'G' tile
    STA SpriteData+1
    LDA #$01
    STA SpriteData+2
    LDA #$80
    STA SpriteData+3
    RTS

RenderPause:
    ; Pause rendering
    LDA #$A0
    STA SpriteData+0     ; Pause sprite Y
    LDA #$50             ; 'P' tile
    STA SpriteData+1
    LDA #$02
    STA SpriteData+2
    LDA #$80
    STA SpriteData+3
    RTS

ReadController:
    ; Simulate controller input
    LDA StateTimer
    AND #$40
    BEQ NoInput
    LDA #%10000000       ; A button
    RTS
NoInput:
    LDA #$FF
    RTS

; Variables
GameState: .byte $00
StateTimer: .byte $00
MenuSelection: .byte $00
DisplayMode: .byte $01

; Sprite data
SpriteData: .byte $60, $54, $00, $80
```

## State-Specific Data Management

Each game state should manage its own data independently:

```assembly
; Title screen data
TitleData:
    MenuOptions: .byte $03       ; Number of menu options
    SelectedOption: .byte $00    ; Currently selected option
    CursorY: .byte $60          ; Cursor Y position
    
; Gameplay data
GameplayData:
    PlayerX: .byte $80          ; Player position
    PlayerY: .byte $B0
    PlayerLives: .byte $03      ; Remaining lives
    PlayerScore: .byte $00, $00 ; Score (2 bytes)
    EnemyCount: .byte $00       ; Number of active enemies
    
; Pause menu data  
PauseData:
    PauseOption: .byte $00      ; Selected pause option
    GamePaused: .byte $00       ; Pause flag

InitializeStateData:
    ; Initialize data for current state
    LDA GameState
    CMP #STATE_TITLE
    BEQ InitTitleData
    CMP #STATE_GAMEPLAY
    BEQ InitGameplayData
    CMP #STATE_PAUSE
    BEQ InitPauseData
    RTS

InitTitleData:
    ; Reset title screen variables
    LDA #$00
    STA TitleData+1         ; SelectedOption = 0
    LDA #$60
    STA TitleData+2         ; CursorY = starting position
    RTS

InitGameplayData:
    ; Initialize or reset gameplay variables
    LDA #$80
    STA GameplayData+0      ; PlayerX = center
    LDA #$B0
    STA GameplayData+1      ; PlayerY = bottom
    LDA #$03
    STA GameplayData+2      ; PlayerLives = 3
    LDA #$00
    STA GameplayData+3      ; Score low byte = 0
    STA GameplayData+4      ; Score high byte = 0
    STA GameplayData+5      ; EnemyCount = 0
    RTS

InitPauseData:
    ; Initialize pause menu
    LDA #$00
    STA PauseData+0         ; PauseOption = 0
    LDA #$01
    STA PauseData+1         ; GamePaused = true
    RTS

SaveGameState:
    ; Save current game state for pause/resume
    LDA GameplayData+0      ; Player X
    STA SavedPlayerX
    LDA GameplayData+1      ; Player Y
    STA SavedPlayerY
    LDA GameplayData+2      ; Lives
    STA SavedLives
    RTS

RestoreGameState:
    ; Restore saved game state
    LDA SavedPlayerX
    STA GameplayData+0
    LDA SavedPlayerY
    STA GameplayData+1
    LDA SavedLives
    STA GameplayData+2
    RTS

; Saved state variables
SavedPlayerX: .byte $00
SavedPlayerY: .byte $00
SavedLives: .byte $00
```

## State Transition Management

Create smooth, controlled transitions between states:

```assembly
; Transition system
TransitionActive: .byte $00
TransitionType: .byte $00
TransitionTimer: .byte $00
NextState: .byte $00

; Transition types
TRANSITION_FADE = $00
TRANSITION_SLIDE = $01
TRANSITION_INSTANT = $02

InitiateTransition:
    ; Start transition to new state
    ; A register contains target state
    STA NextState
    
    ; Determine transition type based on current and target states
    LDX GameState
    JSR GetTransitionType
    STA TransitionType
    
    ; Set transition duration
    LDA #$20                ; 32 frame transition
    STA TransitionTimer
    LDA #$01
    STA TransitionActive
    
    ; Prepare transition
    JSR PrepareTransition
    RTS

GetTransitionType:
    ; Determine transition type based on state change
    LDA GameState
    CMP #STATE_TITLE
    BEQ FromTitle
    CMP #STATE_GAMEPLAY
    BEQ FromGameplay
    CMP #STATE_PAUSE
    BEQ FromPause
    
    ; Default transition
    LDA #TRANSITION_INSTANT
    RTS

FromTitle:
    LDA NextState
    CMP #STATE_GAMEPLAY
    BNE TitleDefault
    LDA #TRANSITION_FADE
    RTS
    
TitleDefault:
    LDA #TRANSITION_INSTANT
    RTS

FromGameplay:
    LDA NextState
    CMP #STATE_PAUSE
    BNE GameplayDefault
    LDA #TRANSITION_INSTANT  ; Instant pause
    RTS
    
GameplayDefault:
    LDA #TRANSITION_FADE
    RTS

FromPause:
    ; Always instant from pause
    LDA #TRANSITION_INSTANT
    RTS

UpdateTransition:
    LDA TransitionActive
    BEQ TransitionDone
    
    DEC TransitionTimer
    LDA TransitionTimer
    BNE ContinueTransition
    
    ; Transition complete
    JSR CompleteTransition
    JMP TransitionDone
    
ContinueTransition:
    ; Update transition effect
    LDA TransitionType
    CMP #TRANSITION_FADE
    BEQ UpdateFadeTransition
    CMP #TRANSITION_SLIDE
    BEQ UpdateSlideTransition
    ; Instant transition - nothing to update
    JMP TransitionDone
    
UpdateFadeTransition:
    ; Fade effect using palette changes
    LDA TransitionTimer
    CMP #$10                ; Halfway point
    BCS FadeOut
    
    ; Fade in (second half)
    JSR FadeInEffect
    JMP TransitionDone
    
FadeOut:
    ; Fade out (first half)
    JSR FadeOutEffect
    JMP TransitionDone
    
UpdateSlideTransition:
    ; Slide transition (move sprites)
    LDA TransitionTimer
    EOR #$FF                ; Invert for progress
    CLC
    ADC #$01
    LSR                     ; Divide by 2
    STA SlideOffset
    JSR ApplySlideEffect
    
TransitionDone:
    RTS

CompleteTransition:
    ; Finish transition and switch states
    LDA #$00
    STA TransitionActive
    
    ; Switch to new state
    LDA NextState
    STA GameState
    
    ; Initialize new state
    JSR InitializeStateData
    RTS

PrepareTransition:
    ; Prepare for transition start
    LDA TransitionType
    CMP #TRANSITION_FADE
    BEQ PrepareFade
    RTS

PrepareFade:
    ; Save current screen state for fade
    JSR SaveScreenState
    RTS

; Transition effect variables
SlideOffset: .byte $00
```

**State Transition System:**

```assembly
; Game state transition demonstration
Main:
    JSR InitGame
    
MainLoop:
    JSR UpdateGameState
    JSR UpdateTransitions
    JSR RenderCurrentState
    JMP MainLoop

InitGame:
    LDA #$00             ; Start in title state
    STA CurrentState
    STA TransitionActive
    STA StateTimer
    JSR InitCurrentStateData
    RTS

UpdateGameState:
    ; Update based on current state
    LDA TransitionActive
    BNE StateUpdateDone  ; Skip if transitioning
    
    INC StateTimer
    
    LDA CurrentState
    CMP #$00             ; Title
    BEQ UpdateTitleState
    CMP #$01             ; Menu
    BEQ UpdateMenuState
    CMP #$02             ; Game
    BEQ UpdateGameState2
    RTS

UpdateTitleState:
    ; Check for transition trigger
    LDA StateTimer
    CMP #$60             ; 1 second
    BNE TitleStateDone
    
    ; Transition to menu
    LDA #$01
    JSR StartTransition
    
TitleStateDone:
    RTS

UpdateMenuState:
    ; Check for transition trigger
    LDA StateTimer
    CMP #$60             ; 1 second
    BNE MenuStateDone
    
    ; Transition to game
    LDA #$02
    JSR StartTransition
    
MenuStateDone:
    RTS

UpdateGameState2:
    ; Check for transition trigger
    LDA StateTimer
    CMP #$60             ; 1 second
    BNE GameStateDone
    
    ; Transition back to title
    LDA #$00
    JSR StartTransition
    
GameStateDone:
    RTS

StateUpdateDone:
    RTS

StartTransition:
    ; A = target state
    STA TargetState
    
    ; Determine transition type
    LDX CurrentState
    JSR GetTransitionType
    STA TransitionType
    
    ; Start transition
    LDA #$20             ; 32 frame transition
    STA TransitionTimer
    LDA #$01
    STA TransitionActive
    
    RTS

GetTransitionType:
    ; Simple transition logic
    LDA CurrentState
    CMP TargetState
    BEQ NoTransition
    
    ; Use fade for all transitions
    LDA #$01             ; Fade type
    RTS
    
NoTransition:
    LDA #$00             ; No transition
    RTS

UpdateTransitions:
    LDA TransitionActive
    BEQ TransitionsDone
    
    DEC TransitionTimer
    LDA TransitionTimer
    BNE ContinueTransition2
    
    ; Complete transition
    LDA TargetState
    STA CurrentState
    LDA #$00
    STA TransitionActive
    STA StateTimer
    JSR InitCurrentStateData
    JMP TransitionsDone
    
ContinueTransition2:
    ; Update transition effect
    JSR UpdateTransitionEffect
    
TransitionsDone:
    RTS

UpdateTransitionEffect:
    ; Simple fade effect using sprite attributes
    LDA TransitionTimer
    CMP #$10             ; Midpoint
    BCS FadeOut2
    
    ; Fade in - restore normal sprites
    LDA #$00
    STA SpriteData+2     ; Normal attributes
    RTS
    
FadeOut2:
    ; Fade out - dim sprites
    LDA #%00100000       ; Dim attribute
    STA SpriteData+2
    RTS

InitCurrentStateData:
    ; Initialize data for current state
    LDA CurrentState
    CMP #$00
    BEQ InitTitleData2
    CMP #$01
    BEQ InitMenuData
    CMP #$02
    BEQ InitGameData
    RTS

InitTitleData2:
    LDA #$01
    STA CurrentDisplay
    RTS

InitMenuData:
    LDA #$02
    STA CurrentDisplay
    RTS

InitGameData:
    LDA #$03
    STA CurrentDisplay
    RTS

RenderCurrentState:
    ; Render based on current state
    LDA CurrentDisplay
    CMP #$01
    BEQ RenderTitle2
    CMP #$02
    BEQ RenderMenu
    CMP #$03
    BEQ RenderGame2
    RTS

RenderTitle2:
    LDA #$60
    STA SpriteData+0
    LDA #$54             ; 'T'
    STA SpriteData+1
    LDA #$80
    STA SpriteData+3
    RTS

RenderMenu:
    LDA #$80
    STA SpriteData+0
    LDA #$4D             ; 'M'
    STA SpriteData+1
    LDA #$80
    STA SpriteData+3
    RTS

RenderGame2:
    LDA #$A0
    STA SpriteData+0
    LDA #$47             ; 'G'
    STA SpriteData+1
    LDA #$80
    STA SpriteData+3
    RTS

; Variables
CurrentState: .byte $00
TargetState: .byte $00
TransitionActive: .byte $00
TransitionType: .byte $00
TransitionTimer: .byte $00
StateTimer: .byte $00
CurrentDisplay: .byte $01

; Sprite data
SpriteData: .byte $60, $54, $00, $80
```

## Resource Management Per State

Efficiently manage memory and resources for each game state:

```assembly
; Resource management system
ActiveResources: .byte $00      ; Bitmask of active resources

; Resource bits
RESOURCE_MUSIC     = %00000001
RESOURCE_GRAPHICS  = %00000010  
RESOURCE_ENEMIES   = %00000100
RESOURCE_UI        = %00001000
RESOURCE_EFFECTS   = %00010000

LoadStateResources:
    ; Load resources needed for current state
    LDA GameState
    CMP #STATE_TITLE
    BEQ LoadTitleResources
    CMP #STATE_GAMEPLAY
    BEQ LoadGameplayResources
    CMP #STATE_PAUSE
    BEQ LoadPauseResources
    RTS

LoadTitleResources:
    ; Title screen needs music and UI
    LDA #RESOURCE_MUSIC | RESOURCE_UI
    STA ActiveResources
    
    JSR LoadTitleMusic
    JSR LoadTitleGraphics
    RTS

LoadGameplayResources:
    ; Gameplay needs everything except UI menus
    LDA #RESOURCE_MUSIC | RESOURCE_GRAPHICS | RESOURCE_ENEMIES | RESOURCE_EFFECTS
    STA ActiveResources
    
    JSR LoadGameMusic
    JSR LoadGameGraphics
    JSR LoadEnemyData
    RTS

LoadPauseResources:
    ; Pause keeps game resources but adds UI
    LDA ActiveResources
    ORA #RESOURCE_UI
    STA ActiveResources
    
    JSR LoadPauseUI
    RTS

UnloadUnusedResources:
    ; Unload resources not needed in current state
    LDA GameState
    CMP #STATE_TITLE
    BEQ UnloadForTitle
    CMP #STATE_GAMEPLAY
    BEQ UnloadForGameplay
    RTS

UnloadForTitle:
    ; Title doesn't need enemies or effects
    LDA ActiveResources
    AND #~(RESOURCE_ENEMIES | RESOURCE_EFFECTS)
    STA ActiveResources
    
    JSR UnloadEnemyData
    JSR UnloadEffects
    RTS

UnloadForGameplay:
    ; Gameplay doesn't need menu UI
    LDA ActiveResources
    AND #~RESOURCE_UI
    STA ActiveResources
    
    JSR UnloadMenuUI
    RTS

; Resource loading routines
LoadTitleMusic:
    ; Load title screen music
    LDA #$01
    STA MusicTrack
    JSR InitMusicSystem
    RTS

LoadGameMusic:
    ; Load gameplay music
    LDA #$02
    STA MusicTrack
    JSR InitMusicSystem
    RTS

LoadTitleGraphics:
    ; Load title screen graphics
    JSR LoadTitleSprites
    JSR LoadTitlePalette
    RTS

LoadGameGraphics:
    ; Load game graphics
    JSR LoadPlayerSprites
    JSR LoadEnemySprites
    JSR LoadGamePalette
    RTS

; Placeholder resource management
MusicTrack: .byte $01
```

## Sprite Symphony State Integration

Integrate state management into the Sprite Symphony project:

```assembly
; Sprite Symphony state system
SYMPHONY_MENU     = $00
SYMPHONY_COMPOSE  = $01
SYMPHONY_PLAY     = $02
SYMPHONY_EDIT     = $03

SymphonyState: .byte SYMPHONY_MENU

UpdateSpriteSymphony:
    LDA SymphonyState
    CMP #SYMPHONY_MENU
    BEQ UpdateSymphonyMenu
    CMP #SYMPHONY_COMPOSE
    BEQ UpdateSymphonyCompose
    CMP #SYMPHONY_PLAY
    BEQ UpdateSymphonyPlay
    CMP #SYMPHONY_EDIT
    BEQ UpdateSymphonyEdit
    RTS

UpdateSymphonyMenu:
    ; Handle menu navigation
    JSR ProcessMenuInput
    JSR UpdateMenuDisplay
    
    ; Check for mode selection
    LDA MenuSelection
    BEQ MenuDone
    
    ; Transition to selected mode
    DEC MenuSelection    ; Convert to 0-based
    STA SymphonyState
    JSR InitSelectedMode
    
MenuDone:
    RTS

UpdateSymphonyCompose:
    ; Handle composition mode
    JSR ProcessComposeInput
    JSR UpdateComposerDisplay
    JSR UpdateNotePlacements
    RTS

UpdateSymphonyPlay:
    ; Handle playback mode
    JSR ProcessPlaybackInput
    JSR UpdatePlaybackDisplay
    JSR UpdateMusicPlayback
    JSR UpdateVisualEffects
    RTS

UpdateSymphonyEdit:
    ; Handle edit mode
    JSR ProcessEditInput
    JSR UpdateEditDisplay
    JSR UpdateEditCursor
    RTS

InitSelectedMode:
    ; Initialize the selected mode
    LDA SymphonyState
    CMP #SYMPHONY_COMPOSE
    BEQ InitComposer
    CMP #SYMPHONY_PLAY
    BEQ InitPlayback
    CMP #SYMPHONY_EDIT
    BEQ InitEditor
    RTS

InitComposer:
    ; Set up composition mode
    LDA #$00
    STA ComposerCursor
    STA CurrentNote
    JSR LoadComposerGraphics
    RTS

InitPlayback:
    ; Set up playback mode
    LDA #$00
    STA PlaybackPosition
    STA PlaybackTimer
    JSR LoadPlaybackGraphics
    JSR StartSymphonyPlayback
    RTS

InitEditor:
    ; Set up edit mode
    LDA #$00
    STA EditCursor
    STA EditMode
    JSR LoadEditorGraphics
    RTS

; Symphony-specific variables
MenuSelection: .byte $00
ComposerCursor: .byte $00
PlaybackPosition: .byte $00
PlaybackTimer: .byte $00
EditCursor: .byte $00
EditMode: .byte $00
```

## Practice Exercise

Create a complete game state management system that demonstrates all concepts:

1. Implement a state machine with at least 4 different states
2. Add smooth transitions between states with visual effects
3. Create state-specific data management and resource loading
4. Include input handling that's appropriate for each state
5. Build a foundation for the Sprite Symphony project with multiple modes

**Practice: Complete Game State Management:**

```assembly
; Complete game state management demonstration
Main:
    JSR InitGameStates
    
MainLoop:
    JSR UpdateCurrentState
    JSR UpdateTransitions
    JSR UpdateDisplay
    JMP MainLoop

InitGameStates:
    ; Initialize state system
    LDA #$00             ; Start in title state
    STA GameState
    STA TransitionActive
    STA StateTimer
    STA MenuCursor
    
    ; Initialize first state
    JSR InitCurrentState
    RTS

UpdateCurrentState:
    ; Skip updates during transitions
    LDA TransitionActive
    BNE CurrentStateDone
    
    INC StateTimer
    
    ; Update based on current state
    LDA GameState
    CMP #$00             ; Title
    BEQ UpdateTitleState2
    CMP #$01             ; Menu
    BEQ UpdateMenuState2
    CMP #$02             ; Game
    BEQ UpdateGameState3
    CMP #$03             ; Settings
    BEQ UpdateSettingsState
    
CurrentStateDone:
    RTS

UpdateTitleState2:
    ; Title screen logic
    JSR ProcessTitleInput2
    
    ; Auto-demo progression
    LDA StateTimer
    CMP #$78             ; 2 seconds
    BNE TitleDone2
    
    LDA #$01             ; Go to menu
    JSR RequestStateChange
    
TitleDone2:
    RTS

UpdateMenuState2:
    ; Main menu logic
    JSR ProcessMenuInput2
    JSR UpdateMenuCursor2
    
    ; Auto-demo progression
    LDA StateTimer
    CMP #$78
    BNE MenuDone2
    
    LDA #$02             ; Go to game
    JSR RequestStateChange
    
MenuDone2:
    RTS

UpdateGameState3:
    ; Game logic
    JSR ProcessGameInput2
    JSR UpdateGameLogic
    
    ; Auto-demo progression
    LDA StateTimer
    CMP #$78
    BNE GameDone2
    
    LDA #$03             ; Go to settings
    JSR RequestStateChange
    
GameDone2:
    RTS

UpdateSettingsState:
    ; Settings logic
    JSR ProcessSettingsInput
    
    ; Auto-demo progression
    LDA StateTimer
    CMP #$78
    BNE SettingsDone
    
    LDA #$00             ; Back to title
    JSR RequestStateChange
    
SettingsDone:
    RTS

RequestStateChange:
    ; Request transition to new state
    STA NewState
    
    ; Determine transition type
    JSR DetermineTransition
    
    ; Start transition
    LDA #$20             ; 32 frame transition
    STA TransitionTimer
    LDA #$01
    STA TransitionActive
    
    ; Save current state data
    JSR SaveCurrentStateData
    RTS

DetermineTransition:
    ; Set transition type based on state change
    LDA GameState
    CMP NewState
    BEQ NoTransition2
    
    ; Default to fade transition
    LDA #$01
    STA TransitionType
    RTS
    
NoTransition2:
    LDA #$00
    STA TransitionType
    RTS

UpdateTransitions:
    LDA TransitionActive
    BEQ TransitionDone2
    
    DEC TransitionTimer
    LDA TransitionTimer
    BNE ContinueTransition3
    
    ; Transition complete
    JSR CompleteStateChange
    JMP TransitionDone2
    
ContinueTransition3:
    ; Update transition effects
    JSR UpdateTransitionEffects
    
TransitionDone2:
    RTS

CompleteStateChange:
    ; Complete the state transition
    LDA NewState
    STA GameState
    LDA #$00
    STA TransitionActive
    STA StateTimer
    
    ; Initialize new state
    JSR InitCurrentState
    RTS

InitCurrentState:
    ; Initialize current state data
    LDA GameState
    CMP #$00
    BEQ InitTitleState3
    CMP #$01
    BEQ InitMenuState2
    CMP #$02
    BEQ InitGameState2
    CMP #$03
    BEQ InitSettingsState2
    RTS

InitTitleState3:
    ; Initialize title state
    LDA #$00
    STA MenuCursor
    JSR LoadTitleResources2
    RTS

InitMenuState2:
    ; Initialize menu state
    LDA #$00
    STA MenuCursor
    STA MenuSelection2
    JSR LoadMenuResources
    RTS

InitGameState2:
    ; Initialize game state
    LDA #$80
    STA PlayerX2
    STA PlayerY2
    LDA #$03
    STA PlayerLives2
    JSR LoadGameResources2
    RTS

InitSettingsState2:
    ; Initialize settings state
    LDA #$00
    STA SettingsCursor
    JSR LoadSettingsResources
    RTS

ProcessTitleInput2:
    ; Simulate title input
    JSR ReadController2
    AND #%10000000       ; A button
    BEQ TitleInputDone2
    
    LDA #$01             ; Go to menu
    JSR RequestStateChange
    
TitleInputDone2:
    RTS

ProcessMenuInput2:
    ; Simulate menu input
    JSR ReadController2
    AND #%00001000       ; Up
    BEQ CheckMenuDown
    
    LDA MenuCursor
    BEQ WrapMenuUp
    DEC MenuCursor
    JMP MenuInputDone
    
WrapMenuUp:
    LDA #$02             ; 3 menu items (0-2)
    STA MenuCursor
    JMP MenuInputDone
    
CheckMenuDown:
    JSR ReadController2
    AND #%00000100       ; Down
    BEQ CheckMenuSelect
    
    LDA MenuCursor
    CMP #$02
    BEQ WrapMenuDown
    INC MenuCursor
    JMP MenuInputDone
    
WrapMenuDown:
    LDA #$00
    STA MenuCursor
    JMP MenuInputDone
    
CheckMenuSelect:
    JSR ReadController2
    AND #%10000000       ; A button
    BEQ MenuInputDone
    
    ; Select current menu item
    LDA MenuCursor
    CLC
    ADC #$02             ; States 2, 3, 4 (game, settings, title)
    CMP #$04
    BNE MenuSelect
    LDA #$00             ; Wrap to title
MenuSelect:
    JSR RequestStateChange
    
MenuInputDone:
    RTS

ProcessGameInput2:
    ; Simulate game input
    JSR ReadController2
    AND #%00010000       ; Start
    BEQ GameInputDone2
    
    LDA #$01             ; Back to menu
    JSR RequestStateChange
    
GameInputDone2:
    RTS

ProcessSettingsInput:
    ; Simulate settings input
    JSR ReadController2
    AND #%01000000       ; B button
    BEQ SettingsInputDone
    
    LDA #$00             ; Back to title
    JSR RequestStateChange
    
SettingsInputDone:
    RTS

UpdateMenuCursor2:
    ; Update menu cursor position
    LDA MenuCursor
    ASL                  ; * 2
    ASL                  ; * 4
    ASL                  ; * 8 (8 pixels per option)
    CLC
    ADC #$70             ; Base Y position
    STA CursorY2
    RTS

UpdateGameLogic:
    ; Simple game logic
    LDA PlayerX2
    CLC
    ADC #$01
    CMP #$F0
    BCC StorePlayerX
    LDA #$10
StorePlayerX:
    STA PlayerX2
    RTS

UpdateTransitionEffects:
    ; Simple fade effect
    LDA TransitionTimer
    CMP #$10             ; Midpoint
    BCS FadeOut3
    
    ; Fade in
    LDA #$00
    STA FadeLevel
    RTS
    
FadeOut3:
    ; Fade out
    LDA #$01
    STA FadeLevel
    RTS

UpdateDisplay:
    ; Update display based on current state
    LDA TransitionActive
    BNE RenderTransition
    
    JSR RenderCurrentState2
    JMP DisplayDone
    
RenderTransition:
    JSR RenderTransitionEffect
    
DisplayDone:
    RTS

RenderCurrentState2:
    ; Render based on current state
    LDA GameState
    CMP #$00
    BEQ RenderTitle3
    CMP #$01
    BEQ RenderMenu2
    CMP #$02
    BEQ RenderGame3
    CMP #$03
    BEQ RenderSettings
    RTS

RenderTitle3:
    ; Render title screen
    LDA #$50
    STA SpriteData+0
    LDA #$54             ; 'T'
    STA SpriteData+1
    LDA #$00
    STA SpriteData+2
    LDA #$80
    STA SpriteData+3
    RTS

RenderMenu2:
    ; Render menu with cursor
    LDA #$70
    STA SpriteData+0
    LDA #$4D             ; 'M'
    STA SpriteData+1
    LDA #$01
    STA SpriteData+2
    LDA #$80
    STA SpriteData+3
    
    ; Render cursor
    LDA CursorY2
    STA SpriteData+4
    LDA #$7E             ; Arrow
    STA SpriteData+5
    LDA #$00
    STA SpriteData+6
    LDA #$60
    STA SpriteData+7
    RTS

RenderGame3:
    ; Render game
    LDA PlayerY2
    STA SpriteData+0
    LDA #$47             ; 'G'
    STA SpriteData+1
    LDA #$02
    STA SpriteData+2
    LDA PlayerX2
    STA SpriteData+3
    RTS

RenderSettings:
    ; Render settings
    LDA #$90
    STA SpriteData+0
    LDA #$53             ; 'S'
    STA SpriteData+1
    LDA #$03
    STA SpriteData+2
    LDA #$80
    STA SpriteData+3
    RTS

RenderTransitionEffect:
    ; Apply transition effects to sprites
    LDA FadeLevel
    BEQ TransitionEffectDone
    
    ; Dim all sprites during transition
    LDA SpriteData+2
    ORA #%01000000       ; Set dim bit
    STA SpriteData+2
    
TransitionEffectDone:
    RTS

SaveCurrentStateData:
    ; Save state-specific data before transition
    LDA GameState
    CMP #$02             ; Game state
    BNE SaveDataDone
    
    ; Save game data
    LDA PlayerX2
    STA SavedPlayerX2
    LDA PlayerY2
    STA SavedPlayerY2
    
SaveDataDone:
    RTS

LoadTitleResources2:
    ; Load title resources
    LDA #$01
    STA ResourcesLoaded
    RTS

LoadMenuResources:
    ; Load menu resources
    LDA #$02
    STA ResourcesLoaded
    RTS

LoadGameResources2:
    ; Load game resources
    LDA #$04
    STA ResourcesLoaded
    RTS

LoadSettingsResources:
    ; Load settings resources
    LDA #$08
    STA ResourcesLoaded
    RTS

ReadController2:
    ; Simulate controller input with pattern
    LDA StateTimer
    AND #$3F             ; 64 frame cycle
    CMP #$10
    BEQ SimulateA
    CMP #$20
    BEQ SimulateUp
    CMP #$30
    BEQ SimulateStart
    LDA #$FF             ; No input
    RTS
    
SimulateA:
    LDA #%01111111       ; A pressed
    RTS
    
SimulateUp:
    LDA #%11110111       ; Up pressed
    RTS
    
SimulateStart:
    LDA #%11101111       ; Start pressed
    RTS

; Variables
GameState: .byte $00
NewState: .byte $00
TransitionActive: .byte $00
TransitionType: .byte $00
TransitionTimer: .byte $00
StateTimer: .byte $00
MenuCursor: .byte $00
MenuSelection2: .byte $00
SettingsCursor: .byte $00
PlayerX2: .byte $80
PlayerY2: .byte $B0
PlayerLives2: .byte $03
CursorY2: .byte $70
FadeLevel: .byte $00
ResourcesLoaded: .byte $00
SavedPlayerX2: .byte $00
SavedPlayerY2: .byte $00

; Sprite data
SpriteData:
    .byte $50, $54, $00, $80  ; Main sprite
    .byte $70, $7E, $00, $60  ; Cursor sprite
```

## What You've Learned

In this essential lesson, you've mastered:

- Designing and implementing game state machines for organized code
- Creating smooth transitions between different game modes
- Managing state-specific data and resources efficiently
- Building modular, maintainable game architectures
- Handling complex game flow with professional patterns
- Foundation systems for sophisticated applications like Sprite Symphony

## Looking Ahead

In the next lesson, you'll begin building the actual Sprite Symphony project, putting together all the concepts you've learned to create a complete interactive musical application!

## Fun Fact

The state management patterns you've learned are fundamental to all professional game development. Classic NES games like The Legend of Zelda used sophisticated state machines to handle the overworld, dungeons, menus, and cutscenes. Modern game engines like Unity and Unreal still use these same state management principles, just with more visual tools. The modular architecture you've mastered allows teams of programmers to work on different game states simultaneously, making complex games possible to develop and maintain!