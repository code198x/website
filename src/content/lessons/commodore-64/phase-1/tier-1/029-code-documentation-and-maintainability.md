---
title: "Code Documentation and Maintainability"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 29
description: "Learn professional code documentation and maintainability practices. Learn to write self-documenting code, create comprehensive documentation, and build programs that remain understandable and modifiable over time."
learning_objectives:
  - "Understand principles of self-documenting code and clear naming"
  - "Learn comprehensive commenting and documentation standards"
  - "Learn code organisation for long-term maintainability"
  - "Practice version control and change management concepts"
  - "Build documentation systems that support team development"
concepts:
  - "Self-documenting code and meaningful naming conventions"
  - "Comprehensive commenting and inline documentation"
  - "Code organisation and structural documentation"
  - "Version control and change tracking concepts"
  - "Professional documentation standards and practices"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 29
---

# Lesson 29: Code Documentation and Maintainability

**See how professional documentation transforms cryptic code into readable stories:**

```
; BEFORE: Mysterious, undocumented code
L1: LDA $80
    CMP #$FF
    BEQ L2
    JSR L3
    JMP L1
L2: RTS

; AFTER: Self-documenting, professional code
CheckPlayerInput:
    LDA CurrentKeyPress        ; Read current key
    CMP #NO_KEY_PRESSED       ; Check if any key pressed  
    BEQ InputComplete         ; Exit if no input
    JSR ProcessPlayerAction    ; Handle the player's choice
    JMP CheckPlayerInput      ; Continue monitoring input
InputComplete:
    RTS
```

That's the power of **professional documentation** - turning assembly code into readable narratives that any programmer can understand and modify! Today you'll learn the documentation techniques used by commercial C64 game development teams.

## Self-Documenting Code Principles

**Self-documenting code** communicates its purpose and function through clear structure and naming:

- **Meaningful Names**: Variables and labels that explain their purpose
- **Clear Structure**: Logical organisation that reveals program flow
- **Consistent Patterns**: Predictable conventions throughout the codebase
- **Appropriate Abstraction**: Functions and modules with single, clear purposes
- **Minimal Complexity**: Simple solutions that are easy to understand

Think of self-documenting code as **writing a story** where the code itself is the narrative, and documentation provides the context and background.

### Meaningful Naming Conventions

```text
; BAD: Cryptic and unclear names
DataProcessing:
    LDA a           ; What is 'a'?
    CMP b           ; What is 'b'?
    BCC c           ; What happens at 'c'?
    JSR d           ; What does 'd' do?
    RTS

a: .byte 0
b: .byte 0
c:
d:
    RTS

; GOOD: Self-explanatory names
ProcessPlayerInput:
    LDA PlayerHealth        ; Current player health
    CMP MinimumHealth       ; Check against minimum required
    BCC PlayerIsDead        ; Branch if health too low
    JSR UpdatePlayerStatus  ; Update player state
    RTS

PlayerHealth:       .byte 100
MinimumHealth:      .byte 1

PlayerIsDead:
    JSR HandlePlayerDeath
    RTS

UpdatePlayerStatus:
    ; Update player status display
    RTS

HandlePlayerDeath:
    ; Handle player death sequence
    RTS
```

### Structured Code Organization

```text
; EXCELLENT: Well-organised, self-documenting structure

; ========================================
; GAME ENGINE: PLAYER MANAGEMENT SYSTEM
; ========================================
; Handles all player-related operations including
; movement, health, inventory, and state management
; 
; Version: 1.2
; Author: Development Team
; Last Modified: 2024-01-15
; ========================================

; ========================================
; CONSTANTS AND CONFIGURATION
; ========================================

; Player movement constants
PLAYER_MOVE_SPEED       = 2        ; Pixels per frame
PLAYER_JUMP_HEIGHT      = 16       ; Jump velocity
PLAYER_MAX_HEALTH       = 100      ; Maximum health points

; Player state constants  
PLAYER_STATE_IDLE       = 0        ; Standing still
PLAYER_STATE_WALKING    = 1        ; Moving horizontally
PLAYER_STATE_JUMPING    = 2        ; In mid-air
PLAYER_STATE_FALLING    = 3        ; Falling down

; Input bit masks
INPUT_LEFT              = %00000001
INPUT_RIGHT             = %00000010
INPUT_JUMP              = %00000100
INPUT_ACTION            = %00001000

; ========================================
; DATA STRUCTURES
; ========================================

; Player data structure (8 bytes)
PlayerData:
    PlayerXPosition:    .byte 80    ; Current X coordinate
    PlayerYPosition:    .byte 180   ; Current Y coordinate  
    PlayerXVelocity:    .byte 0     ; Horizontal velocity
    PlayerYVelocity:    .byte 0     ; Vertical velocity
    PlayerHealth:       .byte 100   ; Current health (0-100)
    PlayerState:        .byte 0     ; Current state (see constants)
    PlayerFlags:        .byte 0     ; Status flags (bit-packed)
    PlayerInventory:    .byte 0     ; Inventory items (bit-packed)

; Player flags bit definitions
PLAYER_FLAG_ALIVE       = %00000001
PLAYER_FLAG_INVULNERABLE= %00000010
PLAYER_FLAG_HAS_KEY     = %00000100
PLAYER_FLAG_POWERED_UP  = %00001000

; ========================================
; PUBLIC INTERFACE FUNCTIONS
; ========================================
; These functions form the public API for the player system
; and should be called by other game systems

InitializePlayer:
    ; ====================================
    ; Function: InitializePlayer
    ; ====================================
    ; Purpose: Initialize player to starting state
    ; 
    ; Inputs: None
    ; Outputs: None
    ; Modifies: A register, PlayerData structure
    ; 
    ; Side Effects: 
    ;   - Resets all player statistics
    ;   - Sets player to spawn position
    ;   - Initializes player flags
    ;
    ; Usage:
    ;   JSR InitializePlayer
    ; ====================================
    
    ; Set starting position
    LDA #80                 ; Center X position
    STA PlayerXPosition
    LDA #180                ; Ground level Y position  
    STA PlayerYPosition
    
    ; Clear velocities
    LDA #0
    STA PlayerXVelocity
    STA PlayerYVelocity
    
    ; Set full health
    LDA #PLAYER_MAX_HEALTH
    STA PlayerHealth
    
    ; Set initial state
    LDA #PLAYER_STATE_IDLE
    STA PlayerState
    
    ; Set alive flag
    LDA #PLAYER_FLAG_ALIVE
    STA PlayerFlags
    
    ; Clear inventory
    LDA #0
    STA PlayerInventory
    
    RTS

UpdatePlayer:
    ; ====================================
    ; Function: UpdatePlayer  
    ; ====================================
    ; Purpose: Update player for one game frame
    ; 
    ; Inputs: 
    ;   - CurrentInput: Joystick/keyboard state
    ;   - DeltaTime: Frame timing information
    ; Outputs: None
    ; Modifies: A, X, Y registers, PlayerData
    ; 
    ; Side Effects:
    ;   - Updates player position based on input
    ;   - Applies physics (gravity, collision)
    ;   - Updates animation state
    ;   - Triggers sound effects
    ;
    ; Call Frequency: Once per game frame (50/60 Hz)
    ; ====================================
    
    ; Only update if player is alive
    LDA PlayerFlags
    AND #PLAYER_FLAG_ALIVE
    BEQ PlayerUpdateDone    ; Skip if dead
    
    ; Process input and update movement
    JSR ProcessPlayerInput
    
    ; Apply physics
    JSR ApplyPlayerPhysics
    
    ; Update animation state
    JSR UpdatePlayerAnimation
    
    ; Check for state transitions
    JSR CheckPlayerStateChanges
    
PlayerUpdateDone:
    RTS

; ========================================
; PRIVATE HELPER FUNCTIONS
; ========================================
; Internal functions - should not be called directly
; by external systems

ProcessPlayerInput:
    ; ====================================
    ; Function: ProcessPlayerInput (PRIVATE)
    ; ====================================
    ; Purpose: Convert input into player actions
    ; Called by: UpdatePlayer
    ; ====================================
    
    LDA CurrentInput        ; Get current input state
    
    ; Check left movement
    AND #INPUT_LEFT
    BEQ CheckRightInput
    JSR MovePlayerLeft
    
CheckRightInput:
    LDA CurrentInput
    AND #INPUT_RIGHT  
    BEQ CheckJumpInput
    JSR MovePlayerRight
    
CheckJumpInput:
    LDA CurrentInput
    AND #INPUT_JUMP
    BEQ CheckActionInput
    JSR TryPlayerJump
    
CheckActionInput:
    LDA CurrentInput
    AND #INPUT_ACTION
    BEQ InputProcessingDone
    JSR PerformPlayerAction
    
InputProcessingDone:
    RTS

MovePlayerLeft:
    ; ====================================
    ; Function: MovePlayerLeft (PRIVATE)
    ; ====================================
    ; Purpose: Move player leftward
    ; Preconditions: Player must be alive and able to move
    ; ====================================
    
    ; Check if player can move (not jumping/falling)
    LDA PlayerState
    CMP #PLAYER_STATE_JUMPING
    BEQ CanMoveLeft         ; Can move while jumping
    CMP #PLAYER_STATE_FALLING  
    BEQ CanMoveLeft         ; Can move while falling
    CMP #PLAYER_STATE_IDLE
    BEQ CanMoveLeft         ; Can move when idle
    CMP #PLAYER_STATE_WALKING
    BEQ CanMoveLeft         ; Already walking
    RTS                     ; Can't move in other states
    
CanMoveLeft:
    ; Set leftward velocity
    LDA #-PLAYER_MOVE_SPEED ; Negative for leftward
    STA PlayerXVelocity
    
    ; Update state to walking (if on ground)
    LDA PlayerState
    CMP #PLAYER_STATE_IDLE
    BNE LeftMoveDone
    LDA #PLAYER_STATE_WALKING
    STA PlayerState
    
LeftMoveDone:
    RTS

MovePlayerRight:
    ; ====================================
    ; Function: MovePlayerRight (PRIVATE)  
    ; ====================================
    ; Purpose: Move player rightward
    ; Implementation similar to MovePlayerLeft
    ; ====================================
    
    ; Check movement capability
    LDA PlayerState
    CMP #PLAYER_STATE_JUMPING
    BEQ CanMoveRight
    CMP #PLAYER_STATE_FALLING
    BEQ CanMoveRight  
    CMP #PLAYER_STATE_IDLE
    BEQ CanMoveRight
    CMP #PLAYER_STATE_WALKING
    BEQ CanMoveRight
    RTS
    
CanMoveRight:
    ; Set rightward velocity
    LDA #PLAYER_MOVE_SPEED  ; Positive for rightward
    STA PlayerXVelocity
    
    ; Update state to walking (if on ground)
    LDA PlayerState
    CMP #PLAYER_STATE_IDLE
    BNE RightMoveDone
    LDA #PLAYER_STATE_WALKING
    STA PlayerState
    
RightMoveDone:
    RTS

TryPlayerJump:
    ; ====================================
    ; Function: TryPlayerJump (PRIVATE)
    ; ====================================
    ; Purpose: Attempt to make player jump
    ; Conditions: Player must be on ground to jump
    ; ====================================
    
    ; Can only jump when idle or walking (on ground)
    LDA PlayerState
    CMP #PLAYER_STATE_IDLE
    BEQ CanJump
    CMP #PLAYER_STATE_WALKING
    BEQ CanJump
    RTS                     ; Can't jump in other states
    
CanJump:
    ; Set upward velocity
    LDA #-PLAYER_JUMP_HEIGHT ; Negative for upward
    STA PlayerYVelocity
    
    ; Change state to jumping
    LDA #PLAYER_STATE_JUMPING
    STA PlayerState
    
    ; Play jump sound effect (conceptual)
    ; JSR PlayJumpSound
    
    RTS

ApplyPlayerPhysics:
    ; ====================================
    ; Function: ApplyPlayerPhysics (PRIVATE)
    ; ====================================
    ; Purpose: Apply gravity and update position
    ; Called by: UpdatePlayer every frame
    ; ====================================
    
    ; Apply gravity to Y velocity (always downward)
    LDA PlayerYVelocity
    CLC
    ADC #1                  ; Gravity constant
    STA PlayerYVelocity
    
    ; Update X position
    LDA PlayerXPosition
    CLC
    ADC PlayerXVelocity
    STA PlayerXPosition
    
    ; Update Y position  
    LDA PlayerYPosition
    CLC
    ADC PlayerYVelocity
    STA PlayerYPosition
    
    ; Apply friction to X velocity
    LDA PlayerXVelocity
    BEQ NoXFriction         ; No friction if not moving
    BMI NegativeXVelocity   ; Handle negative velocity
    
    ; Positive X velocity - reduce it
    SEC
    SBC #1                  ; Friction constant
    BPL StoreXVelocity      ; Keep positive
    LDA #0                  ; Stop if would go negative
    JMP StoreXVelocity
    
NegativeXVelocity:
    ; Negative X velocity - increase it (toward zero)
    CLC
    ADC #1                  ; Friction constant
    BMI StoreXVelocity      ; Keep negative
    LDA #0                  ; Stop if would go positive
    
StoreXVelocity:
    STA PlayerXVelocity
    
NoXFriction:
    RTS

; ========================================
; UTILITY AND HELPER FUNCTIONS
; ========================================

GetPlayerPosition:
    ; ====================================
    ; Function: GetPlayerPosition
    ; ====================================
    ; Purpose: Get current player position
    ; 
    ; Inputs: None
    ; Outputs: 
    ;   A = Player X position
    ;   X = Player Y position
    ; Modifies: A, X registers only
    ;
    ; Usage:
    ;   JSR GetPlayerPosition
    ;   ; A now contains X coordinate
    ;   ; X now contains Y coordinate
    ; ====================================
    
    LDA PlayerXPosition
    LDX PlayerYPosition
    RTS

IsPlayerAlive:
    ; ====================================
    ; Function: IsPlayerAlive
    ; ====================================
    ; Purpose: Check if player is currently alive
    ;
    ; Inputs: None
    ; Outputs: Zero flag set if alive, clear if dead
    ; Modifies: A register only
    ;
    ; Usage:
    ;   JSR IsPlayerAlive
    ;   BEQ PlayerIsAlive
    ;   ; Player is dead
    ; ====================================
    
    LDA PlayerFlags
    AND #PLAYER_FLAG_ALIVE
    RTS

; ========================================
; EXTERNAL DEPENDENCIES
; ========================================
; Variables and functions that must be provided
; by other game systems

CurrentInput:       .byte 0     ; Provided by input system
DeltaTime:          .byte 0     ; Provided by timing system

; Sound effect functions (provided by audio system)
; PlayJumpSound:    ; External function
; PlayHurtSound:    ; External function
; PlayItemSound:    ; External function

; Additional private functions
UpdatePlayerAnimation:
CheckPlayerStateChanges:
PerformPlayerAction:
    ; Implementation would go here
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Self-Documenting Code Example"
  code="; Self-documenting code demonstration
; Shows clear naming and structure

; ========================================
; AUDIO MIXER SYSTEM
; ========================================
; Manages multiple audio channels and effects
; for comprehensive sound system

; ========================================
; MIXER CONFIGURATION
; ========================================

MAX_AUDIO_CHANNELS      = 3        ; SID has 3 voices
DEFAULT_MASTER_VOLUME   = 15       ; Maximum volume level
CHANNEL_PRIORITY_HIGH   = 3        ; High priority channel
CHANNEL_PRIORITY_LOW    = 1        ; Low priority channel

; Channel state constants
CHANNEL_STATE_IDLE      = 0        ; Channel not playing
CHANNEL_STATE_PLAYING   = 1        ; Channel actively playing
CHANNEL_STATE_FADING    = 2        ; Channel fading out

; ========================================
; MIXER DATA STRUCTURES
; ========================================

; Audio channel data (5 bytes per channel)
AudioChannels:
    ; Channel 0 (Voice 1)
    Channel0State:      .byte 0     ; Current state
    Channel0Priority:   .byte 0     ; Playback priority
    Channel0Volume:     .byte 0     ; Current volume (0-15)
    Channel0Duration:   .byte 0     ; Remaining duration
    Channel0Effect:     .byte 0     ; Applied effect type
    
    ; Channel 1 (Voice 2)  
    Channel1State:      .byte 0
    Channel1Priority:   .byte 0
    Channel1Volume:     .byte 0
    Channel1Duration:   .byte 0
    Channel1Effect:     .byte 0
    
    ; Channel 2 (Voice 3)
    Channel2State:      .byte 0
    Channel2Priority:   .byte 0
    Channel2Volume:     .byte 0
    Channel2Duration:   .byte 0
    Channel2Effect:     .byte 0

; Mixer global state
MixerMasterVolume:      .byte 15    ; Global volume control
MixerActiveChannels:    .byte 0     ; Number of active channels

; ========================================
; PUBLIC MIXER INTERFACE
; ========================================

InitializeAudioMixer:
    ; ====================================
    ; Function: InitializeAudioMixer
    ; ====================================
    ; Purpose: Initialize the audio mixer system
    ; 
    ; Inputs: None
    ; Outputs: None
    ; Modifies: A register, mixer data structures
    ;
    ; Call this once at program startup before
    ; using any other mixer functions
    ; ====================================
    
    ; Clear all channel data
    JSR ClearAllChannels
    
    ; Set default master volume
    LDA #DEFAULT_MASTER_VOLUME
    STA MixerMasterVolume
    
    ; Initialize SID chip
    JSR InitializeSIDRegisters
    
    ; Reset active channel counter
    LDA #0
    STA MixerActiveChannels
    
    RTS

PlaySoundOnChannel:
    ; ====================================
    ; Function: PlaySoundOnChannel
    ; ====================================
    ; Purpose: Start playing sound on specific channel
    ;
    ; Inputs:
    ;   A = Channel number (0-2)
    ;   X = Sound priority (1-3)
    ;   Y = Sound duration (frames)
    ;
    ; Outputs: 
    ;   Carry clear = success
    ;   Carry set = channel busy with higher priority
    ;
    ; Usage:
    ;   LDA #0              ; Channel 0
    ;   LDX #2              ; Medium priority  
    ;   LDY #60             ; 1 second duration
    ;   JSR PlaySoundOnChannel
    ;   BCS SoundBlocked    ; Branch if channel busy
    ; ====================================
    
    ; Validate channel number
    CMP #MAX_AUDIO_CHANNELS
    BCS InvalidChannel
    
    ; Save parameters
    STA RequestedChannel
    STX RequestedPriority
    STY RequestedDuration
    
    ; Check if channel is available
    JSR CheckChannelAvailability
    BCS ChannelBusy
    
    ; Channel available - configure it
    JSR ConfigureChannelForPlayback
    
    ; Update active channel count
    JSR UpdateActiveChannelCount
    
    CLC                     ; Success
    RTS
    
InvalidChannel:
ChannelBusy:
    SEC                     ; Error/busy
    RTS

StopSoundOnChannel:
    ; ====================================
    ; Function: StopSoundOnChannel
    ; ====================================
    ; Purpose: Stop sound on specific channel
    ;
    ; Inputs: A = Channel number (0-2)
    ; Outputs: None
    ; Modifies: A register, channel data
    ; ====================================
    
    ; Validate channel number
    CMP #MAX_AUDIO_CHANNELS
    BCS StopChannelDone
    
    ; Calculate channel data offset
    JSR CalculateChannelOffset
    
    ; Set channel to idle
    LDA #CHANNEL_STATE_IDLE
    STA AudioChannels,X     ; Store in state field
    
    ; Clear channel priority
    LDA #0
    INX
    STA AudioChannels,X     ; Store in priority field
    
    ; Update SID registers to silence channel
    JSR SilenceChannelHardware
    
    ; Update active channel count
    JSR UpdateActiveChannelCount
    
StopChannelDone:
    RTS

UpdateAudioMixer:
    ; ====================================
    ; Function: UpdateAudioMixer
    ; ====================================
    ; Purpose: Update mixer state for one frame
    ;
    ; Inputs: None
    ; Outputs: None
    ; Modifies: A, X registers, channel data
    ;
    ; Call this every game frame to update
    ; channel durations and effects
    ; ====================================
    
    ; Update each channel
    LDA #0                  ; Start with channel 0
    
UpdateChannelLoop:
    STA CurrentChannel
    
    ; Update this channel
    JSR UpdateSingleChannel
    
    ; Move to next channel
    LDA CurrentChannel
    CLC
    ADC #1
    CMP #MAX_AUDIO_CHANNELS
    BNE UpdateChannelLoop
    
    ; Update master volume effects
    JSR UpdateMasterVolumeEffects
    
    RTS

; ========================================
; PRIVATE HELPER FUNCTIONS
; ========================================

ClearAllChannels:
    ; Clear all channel data to initial state
    LDX #0
    LDA #0
    
ClearChannelLoop:
    STA AudioChannels,X
    INX
    CPX #(MAX_AUDIO_CHANNELS * 5)  ; 5 bytes per channel
    BNE ClearChannelLoop
    
    RTS

CalculateChannelOffset:
    ; Input: A = channel number
    ; Output: X = byte offset to channel data
    
    ; Multiply channel number by 5 (5 bytes per channel)
    ASL                     ; A * 2
    ASL                     ; A * 4  
    TAX                     ; Save A * 4
    CLC
    ADC CurrentChannel      ; A * 4 + A = A * 5
    TAX                     ; X = channel data offset
    RTS

CheckChannelAvailability:
    ; Check if requested channel can be used
    ; Returns carry set if channel is busy
    
    LDA RequestedChannel
    JSR CalculateChannelOffset
    
    ; Check channel state
    LDA AudioChannels,X     ; Get state
    CMP #CHANNEL_STATE_IDLE
    BEQ ChannelAvailable
    
    ; Channel is busy - check priority
    INX
    LDA AudioChannels,X     ; Get current priority
    CMP RequestedPriority
    BCS PriorityTooLow      ; Current >= requested
    
    ; Can override lower priority sound
    CLC
    RTS
    
ChannelAvailable:
    CLC                     ; Available
    RTS
    
PriorityTooLow:
    SEC                     ; Busy with higher priority
    RTS

ConfigureChannelForPlayback:
    ; Configure channel with requested parameters
    
    LDA RequestedChannel
    JSR CalculateChannelOffset
    
    ; Set state to playing
    LDA #CHANNEL_STATE_PLAYING
    STA AudioChannels,X
    
    ; Set priority
    INX
    LDA RequestedPriority
    STA AudioChannels,X
    
    ; Set volume
    INX
    LDA MixerMasterVolume
    STA AudioChannels,X
    
    ; Set duration
    INX
    LDA RequestedDuration
    STA AudioChannels,X
    
    ; Clear effect
    INX
    LDA #0
    STA AudioChannels,X
    
    RTS

UpdateSingleChannel:
    ; Update one channel for current frame
    
    LDA CurrentChannel
    JSR CalculateChannelOffset
    
    ; Check if channel is active
    LDA AudioChannels,X
    CMP #CHANNEL_STATE_IDLE
    BEQ SingleChannelDone
    
    ; Decrement duration
    TXA
    CLC
    ADC #3                  ; Offset to duration field
    TAX
    LDA AudioChannels,X
    BEQ StopExpiredChannel  ; Duration expired
    SEC
    SBC #1
    STA AudioChannels,X
    
    ; Update channel effects
    JSR UpdateChannelEffects
    
SingleChannelDone:
    RTS
    
StopExpiredChannel:
    ; Stop channel that has expired
    LDA CurrentChannel
    JSR StopSoundOnChannel
    RTS

UpdateActiveChannelCount:
    ; Count currently active channels
    LDA #0
    STA ActiveChannelCounter
    STA MixerActiveChannels
    
    LDX #0
CountActiveLoop:
    LDA AudioChannels,X     ; Check state
    CMP #CHANNEL_STATE_IDLE
    BEQ NotActiveChannel
    
    INC MixerActiveChannels
    
NotActiveChannel:
    ; Move to next channel
    TXA
    CLC
    ADC #5                  ; 5 bytes per channel
    TAX
    
    INC ActiveChannelCounter
    LDA ActiveChannelCounter
    CMP #MAX_AUDIO_CHANNELS
    BNE CountActiveLoop
    
    RTS

; Placeholder functions for hardware interface
InitializeSIDRegisters:
SilenceChannelHardware:
UpdateChannelEffects:
UpdateMasterVolumeEffects:
    RTS

; Working variables
RequestedChannel:       .byte 0
RequestedPriority:      .byte 0
RequestedDuration:      .byte 0
CurrentChannel:         .byte 0
ActiveChannelCounter:   .byte 0

; Demonstrate the well-documented mixer
JSR InitializeAudioMixer"
  language="assembly"
/>

## Comprehensive Documentation Standards

### Inline Documentation Best Practices

```text
; ========================================
; COMPREHENSIVE COMMENTING STANDARDS
; ========================================

; File Header Documentation
; ========================================
; File: graphics_engine.asm
; Purpose: Advanced graphics rendering system for C64
; Version: 2.1.3
; Author: Development Team
; Created: 2024-01-01
; Modified: 2024-01-15
; 
; Dependencies:
;   - memory_manager.asm (memory allocation)
;   - input_system.asm (user input handling)
;   - audio_system.asm (synchronized effects)
;
; Memory Usage:
;   - Zero Page: $FB-$FF (5 bytes)
;   - Main Memory: $2000-$3FFF (8KB graphics buffer)
;   - Stack Usage: Maximum 8 bytes during rendering
;
; Performance Notes:
;   - Frame rate: 50Hz PAL / 60Hz NTSC
;   - Memory bandwidth: ~15KB/frame maximum
;   - Interrupt timing: Synchronized with raster
; ========================================

; Function Documentation Template
ComplexGraphicsOperation:
    ; ====================================
    ; Function: ComplexGraphicsOperation
    ; ====================================
    ; Purpose: Perform multi-layer graphics rendering with effects
    ;
    ; Algorithm Overview:
    ;   1. Clear background layer
    ;   2. Render sprite objects (back to front)
    ;   3. Apply visual effects (transparency, lighting)
    ;   4. Update display registers
    ;   5. Synchronize with raster timing
    ;
    ; Inputs:
    ;   A = Rendering mode (0=normal, 1=effects, 2=debug)
    ;   X = Number of sprites to render (0-8)
    ;   Y = Effect intensity (0-255)
    ;   $FB/$FC = Background pattern address
    ;   $FD/$FE = Sprite data array address
    ;
    ; Outputs:
    ;   A = Rendering status (0=success, 1=timeout, 2=error)
    ;   Carry = Clear on success, Set on error
    ;   Zero = Set if no sprites rendered
    ;
    ; Modifies:
    ;   - A, X, Y registers (all modified)
    ;   - Zero page: $FB-$FF (used for calculations)
    ;   - Graphics memory: $2000-$3FFF
    ;   - VIC-II registers: $D000-$D02E
    ;
    ; Side Effects:
    ;   - Updates screen display immediately
    ;   - May trigger raster interrupt
    ;   - Disables sprites temporarily during update
    ;   - Affects background colour register
    ;
    ; Performance:
    ;   - Execution time: 2000-4000 cycles (mode dependent)
    ;   - Memory access: ~200 reads, ~150 writes
    ;   - Interrupt latency: +50 cycles maximum
    ;
    ; Error Conditions:
    ;   - Returns 1 if raster timeout occurs
    ;   - Returns 2 if invalid sprite data detected
    ;   - Carry set if critical error prevents rendering
    ;
    ; Usage Examples:
    ;   ; Basic rendering
    ;   LDA #0              ; Normal mode
    ;   LDX #4              ; 4 sprites
    ;   LDY #0              ; No effects
    ;   JSR ComplexGraphicsOperation
    ;   BCS RenderingFailed
    ;
    ;   ; Effects rendering
    ;   LDA #1              ; Effects mode
    ;   LDX #8              ; All sprites
    ;   LDY #128            ; Medium effects
    ;   JSR ComplexGraphicsOperation
    ;
    ; Version History:
    ;   v1.0 - Initial implementation
    ;   v1.1 - Added effects mode
    ;   v2.0 - Optimized for 50% better performance
    ;   v2.1 - Added error recovery
    ; ====================================
    
    ; Store input parameters for validation
    STA RenderingMode       ; Save rendering mode
    STX SpriteCount         ; Save sprite count
    STY EffectIntensity     ; Save effect intensity
    
    ; === INPUT VALIDATION ===
    ; Validate rendering mode (must be 0-2)
    CMP #3
    BCS InvalidRenderingMode
    
    ; Validate sprite count (must be 0-8)
    TXA
    CMP #9
    BCS InvalidSpriteCount
    
    ; === PHASE 1: BACKGROUND PREPARATION ===
    JSR PrepareBackgroundLayer
    BCS BackgroundError
    
    ; === PHASE 2: SPRITE RENDERING ===
    LDA SpriteCount
    BEQ SkipSpriteRendering  ; No sprites to render
    
    JSR RenderSpriteObjects
    BCS SpriteRenderError
    
SkipSpriteRendering:
    ; === PHASE 3: EFFECTS PROCESSING ===
    LDA RenderingMode
    CMP #1                  ; Effects mode?
    BNE SkipEffects
    
    JSR ApplyVisualEffects
    BCS EffectsError
    
SkipEffects:
    ; === PHASE 4: DISPLAY UPDATE ===
    JSR UpdateDisplayRegisters
    BCS DisplayUpdateError
    
    ; === SUCCESS PATH ===
    LDA #0                  ; Success status
    CLC                     ; Clear carry (success)
    RTS
    
    ; === ERROR HANDLING ===
InvalidRenderingMode:
InvalidSpriteCount:
    LDA #2                  ; Error status
    SEC                     ; Set carry (error)
    RTS
    
BackgroundError:
SpriteRenderError:
EffectsError:
    LDA #1                  ; Timeout status
    SEC                     ; Set carry (error)
    RTS
    
DisplayUpdateError:
    LDA #2                  ; Critical error
    SEC                     ; Set carry (error)
    RTS

; Supporting functions with focused documentation
PrepareBackgroundLayer:
    ; ====================================
    ; PRIVATE: PrepareBackgroundLayer
    ; ====================================
    ; Clear and initialize background graphics layer
    ; Uses optimised memory fill for performance
    ; Returns carry set on raster timeout
    ; ====================================
    
    ; Wait for safe raster position
    JSR WaitForSafeRasterPosition
    BCS RasterTimeout
    
    ; Fast clear using unrolled loop
    LDX #0
    LDA #0                  ; Clear value
    
ClearLoop:
    STA $2000,X             ; Clear 4 bytes per iteration
    STA $2100,X             ; for maximum speed
    STA $2200,X
    STA $2300,X
    INX
    BNE ClearLoop
    
    ; Set background pattern if provided
    LDA $FB                 ; Check if pattern address provided
    ORA $FC
    BEQ NoBackgroundPattern
    
    JSR ApplyBackgroundPattern
    
NoBackgroundPattern:
    CLC                     ; Success
    RTS
    
RasterTimeout:
    SEC                     ; Timeout error
    RTS

; ========================================
; ALGORITHM DOCUMENTATION
; ========================================

SpriteDepthSort:
    ; ====================================
    ; Algorithm: Sprite Depth Sorting
    ; ====================================
    ; Implements insertion sort for sprite rendering order
    ; based on Z-depth values for proper layering
    ;
    ; Time Complexity: O(n²) worst case, O(n) best case
    ; Space Complexity: O(1) - sorts in place
    ; 
    ; Best for: Small sprite counts (typical: 2-8 sprites)
    ; Alternative: Use bucket sort for >16 sprites
    ;
    ; Input Array Format:
    ;   Each sprite entry: [X, Y, Z-depth, sprite_id]
    ;   Array length: 4 * sprite_count bytes
    ; ====================================
    
    ; Outer loop: iterate through unsorted portion
    LDX #1                  ; Start with second element
    
OuterSortLoop:
    CPX SpriteCount         ; Check if done
    BEQ SortComplete
    
    ; Inner loop: find insertion position
    LDY #0                  ; Start comparing from beginning
    
InnerSortLoop:
    CPY #SpriteCount        ; Reached end?
    BEQ InsertHere
    
    ; Compare Z-depth values
    JSR CompareSprite DepthValues  ; Custom comparison
    BCC InsertHere          ; Found insertion point
    
    INY
    JMP InnerSortLoop
    
InsertHere:
    ; Insert sprite at position Y
    JSR InsertSpriteAtPosition
    
    INX
    JMP OuterSortLoop
    
SortComplete:
    RTS

; ========================================
; DATA STRUCTURE DOCUMENTATION  
; ========================================

; Sprite Object Structure (8 bytes per sprite)
; ====================================
; Offset 0: X Position (screen coordinates)
;   Range: 0-255 (with extended positioning)
;   Units: Pixels from left edge
;   Special: 255 = sprite disabled
;
; Offset 1: Y Position (screen coordinates)  
;   Range: 0-255 (with vertical scroll)
;   Units: Pixels from top edge
;   Special: 0 = top of screen
;
; Offset 2: Z-Depth (rendering order)
;   Range: 0-255 (0=background, 255=foreground)
;   Units: Arbitrary depth units
;   Usage: Higher values render in front
;
; Offset 3: Sprite ID (graphics data)
;   Range: 0-63 (C64 sprite data blocks)
;   Units: 64-byte sprite data blocks
;   Formula: sprite_data_address = $2000 + (ID * 64)
;
; Offset 4: Color Index
;   Range: 0-15 (C64 colour palette)
;   Mapping: See COLOR_PALETTE table
;   Special: Bit 7 = multicolor enable
;
; Offset 5: Animation Frame
;   Range: 0-15 (frame within animation)
;   Units: Animation frames
;   Auto-increment: Based on animation speed
;
; Offset 6: Status Flags (bit-packed)
;   Bit 0: Visible (1=visible, 0=hidden)
;   Bit 1: Collision enable (1=detect, 0=ignore)
;   Bit 2: Animation enable (1=animate, 0=static)
;   Bit 3: Effects enable (1=apply, 0=normal)
;   Bit 4-7: Reserved for future features
;
; Offset 7: Animation Speed
;   Range: 1-255 (frames between animation updates)
;   Units: Game frames (50Hz/60Hz dependent)
;   Value: Higher = slower animation
; ====================================

SpriteObjectArray:
    .res 64                 ; 8 sprites × 8 bytes each

; Working variables with clear documentation
RenderingMode:      .byte 0     ; Current rendering mode (see constants)
SpriteCount:        .byte 0     ; Number of active sprites (0-8)
EffectIntensity:    .byte 0     ; Visual effects strength (0-255)
CurrentSpriteIndex: .byte 0     ; Loop counter for sprite processing
RasterSyncTimeout:  .byte 60    ; Frames to wait for raster sync

; Additional placeholder functions
RenderSpriteObjects:
ApplyVisualEffects:
UpdateDisplayRegisters:
WaitForSafeRasterPosition:
ApplyBackgroundPattern:
CompareSprite DepthValues:
InsertSpriteAtPosition:
    RTS
```

**Professional Documentation Standards:**

```assembly
; Professional documentation standards demonstration
; Complete documentation framework

; ========================================
; FILE: sound_system_manager.asm
; PURPOSE: Advanced sound effect management system
; VERSION: 1.3.2
; AUTHOR: Audio Team
; CREATED: 2024-01-10
; MODIFIED: 2024-01-20
; ========================================

; ========================================
; SYSTEM OVERVIEW
; ========================================
; This module provides a complete sound effect
; management system with the following features:
;
; 1. Priority-based sound effect queuing
; 2. Automatic channel allocation and management  
; 3. Real-time volume and pitch control
; 4. Sound effect interruption and mixing
; 5. Memory-efficient sound data storage
;
; The system manages the SID chip's 3 voices
; intelligently, ensuring important sounds
; are never lost while providing smooth
; audio transitions.
; ========================================

; ========================================
; CONFIGURATION CONSTANTS
; ========================================

; Sound system limits
MAX_SOUND_EFFECTS       = 16       ; Maximum queued effects
SOUND_PRIORITY_URGENT   = 5        ; Highest priority (player death)
SOUND_PRIORITY_HIGH     = 4        ; High priority (explosions)
SOUND_PRIORITY_NORMAL   = 3        ; Normal priority (shots)
SOUND_PRIORITY_LOW      = 2        ; Low priority (ambient)
SOUND_PRIORITY_MINIMAL  = 1        ; Minimal priority (UI clicks)

; Timing constants
SOUND_FADE_SPEED        = 4         ; Volume decrease per frame
SOUND_UPDATE_RATE       = 1         ; Updates per frame
MAX_SOUND_DURATION      = 255       ; Maximum effect length (frames)

; ========================================
; DATA STRUCTURES
; ========================================

; Sound Effect Descriptor (6 bytes)
; ====================================
; This structure describes a single sound effect
; and its current playback state
;
; Byte 0: Effect ID (0-255)
;   Identifies which sound effect to play
;   Used to look up frequency and waveform data
;   Value 0 = no effect (available slot)
;
; Byte 1: Priority Level (1-5)
;   Determines if this sound can interrupt others
;   Higher values can interrupt lower values
;   Same priority = first-come-first-served
;
; Byte 2: Current Volume (0-15)
;   Current playback volume level
;   0 = silent, 15 = maximum volume
;   Modified by fade effects and mixing
;
; Byte 3: Remaining Duration (0-255)
;   Frames left to play this effect
;   Decremented each update cycle
;   0 = effect complete, stop playback
;
; Byte 4: Channel Assignment (0-3)
;   Which SID voice is playing this effect
;   0-2 = SID voices 1-3
;   3 = not currently assigned (queued)
;
; Byte 5: Effect Flags (bit-packed)
;   Bit 0: Looping (1=repeat, 0=play once)
;   Bit 1: Fade out (1=fading, 0=normal)
;   Bit 2: Interrupts allowed (1=can be stopped, 0=must finish)
;   Bit 3-7: Reserved for future features
; ====================================

SoundEffectQueue:
    .res 96                 ; 16 effects × 6 bytes each

; Channel allocation tracking
ChannelStatus:
    Channel0_EffectID:  .byte 0     ; Effect currently on voice 1
    Channel1_EffectID:  .byte 0     ; Effect currently on voice 2  
    Channel2_EffectID:  .byte 0     ; Effect currently on voice 3

; System state variables
QueuedEffectCount:      .byte 0     ; Number of effects waiting
ActiveEffectCount:      .byte 0     ; Number of effects playing
SystemMasterVolume:     .byte 15    ; Global volume control

; ========================================
; PUBLIC API FUNCTIONS
; ========================================

InitializeSoundSystem:
    ; ====================================
    ; Function: InitializeSoundSystem
    ; ====================================
    ; Purpose: Initialize the complete sound system
    ;
    ; This function must be called once at program
    ; startup before using any other sound functions.
    ; It clears all data structures and configures
    ; the SID chip for optimal sound playback.
    ;
    ; Inputs: None
    ; Outputs: None  
    ; Modifies: A register, sound system data
    ;
    ; Side Effects:
    ;   - Clears all SID registers
    ;   - Resets all effect queues
    ;   - Sets master volume to maximum
    ;   - Initializes channel allocation
    ;
    ; Call Once: At program startup only
    ; ====================================
    
    ; Clear the sound effect queue
    JSR ClearSoundEffectQueue
    
    ; Reset channel allocation
    JSR ResetChannelAllocation
    
    ; Initialize SID chip registers
    JSR InitializeSIDChip
    
    ; Set system defaults
    LDA #15                 ; Maximum master volume
    STA SystemMasterVolume
    
    LDA #0                  ; No effects initially
    STA QueuedEffectCount
    STA ActiveEffectCount
    
    RTS

QueueSoundEffect:
    ; ====================================
    ; Function: QueueSoundEffect
    ; ====================================
    ; Purpose: Add a sound effect to the playback queue
    ;
    ; This is the primary function for playing sounds.
    ; It handles priority checking, queue management,
    ; and automatic channel allocation.
    ;
    ; Inputs:
    ;   A = Sound effect ID (1-255, 0=invalid)
    ;   X = Priority level (1-5, see constants)
    ;   Y = Duration in frames (1-255, 0=auto)
    ;
    ; Outputs:
    ;   Carry = Clear if queued successfully
    ;   Carry = Set if queue full or invalid parameters
    ;   A = Queue position (if successful) or error code
    ;
    ; Error Codes:
    ;   $FF = Invalid effect ID
    ;   $FE = Invalid priority
    ;   $FD = Queue full
    ;   $FC = System not initialized
    ;
    ; Usage Examples:
    ;   ; Play explosion sound (high priority, 2 seconds)
    ;   LDA #SOUND_EXPLOSION
    ;   LDX #SOUND_PRIORITY_HIGH  
    ;   LDY #100                  ; 2 seconds at 50Hz
    ;   JSR QueueSoundEffect
    ;   BCS SoundFailed
    ;
    ;   ; Play UI click (low priority, short duration)
    ;   LDA #SOUND_UI_CLICK
    ;   LDX #SOUND_PRIORITY_LOW
    ;   LDY #10                   ; 0.2 seconds
    ;   JSR QueueSoundEffect
    ; ====================================
    
    ; Validate inputs
    CMP #0                  ; Check for invalid effect ID
    BEQ InvalidEffectID
    
    CPX #1                  ; Check minimum priority
    BCC InvalidPriority
    CPX #6                  ; Check maximum priority
    BCS InvalidPriority
    
    CPY #0                  ; Check for zero duration
    BEQ UseDeraultDuration
    
    ; Store parameters for processing
    STA RequestedEffectID
    STX RequestedPriority
    STY RequestedDuration
    
    ; Check if queue has space
    LDA QueuedEffectCount
    CMP #MAX_SOUND_EFFECTS
    BCS QueueFull
    
    ; Find available slot in queue
    JSR FindAvailableQueueSlot
    BCS QueueFull           ; No slots available
    
    ; Store effect in queue slot
    JSR StoreEffectInQueue
    
    ; Update queue counter
    INC QueuedEffectCount
    
    ; Try to assign to channel immediately
    JSR TryImmediateChannelAssignment
    
    ; Return success
    LDA QueueSlotFound      ; Return slot position
    CLC                     ; Success
    RTS
    
    ; Error handling
InvalidEffectID:
    LDA #$FF
    SEC
    RTS
    
InvalidPriority:
    LDA #$FE
    SEC
    RTS
    
UseDeraultDuration:
    LDY #60                 ; Default 1.2 second duration
    JMP StoreParameters
    
QueueFull:
    LDA #$FD
    SEC
    RTS

UpdateSoundSystem:
    ; ====================================
    ; Function: UpdateSoundSystem
    ; ====================================
    ; Purpose: Update all sound effects for one frame
    ;
    ; This function must be called every game frame
    ; to update effect durations, handle fading,
    ; and manage channel allocation.
    ;
    ; Inputs: None
    ; Outputs: None
    ; Modifies: A, X registers, sound system state
    ;
    ; Call Frequency: Every frame (50Hz/60Hz)
    ;
    ; Processing Order:
    ;   1. Update active effect durations
    ;   2. Handle completed effects
    ;   3. Process fade effects
    ;   4. Assign queued effects to free channels
    ;   5. Update SID registers
    ; ====================================
    
    ; Update all active effects
    JSR UpdateActiveEffectDurations
    
    ; Remove completed effects
    JSR RemoveCompletedEffects
    
    ; Process volume fading
    JSR ProcessVolumeFading
    
    ; Try to assign queued effects
    JSR AssignQueuedEffects
    
    ; Update hardware registers
    JSR UpdateSIDRegisters
    
    RTS

StopSoundEffect:
    ; ====================================
    ; Function: StopSoundEffect
    ; ====================================
    ; Purpose: Stop a specific sound effect
    ;
    ; Inputs: A = Effect ID to stop (1-255)
    ; Outputs: 
    ;   Carry = Clear if effect stopped
    ;   Carry = Set if effect not found
    ;
    ; Notes: Only stops the first instance found
    ;        if multiple instances are playing
    ; ====================================
    
    STA EffectToStop
    
    ; Search through active effects
    LDX #0
    
StopSearchLoop:
    ; Check if this slot contains the target effect
    LDA SoundEffectQueue,X  ; Get effect ID
    CMP EffectToStop
    BEQ FoundEffectToStop
    
    ; Move to next effect slot (6 bytes each)
    TXA
    CLC
    ADC #6
    TAX
    
    ; Check if we've searched all slots
    CMP #(MAX_SOUND_EFFECTS * 6)
    BNE StopSearchLoop
    
    ; Effect not found
    SEC
    RTS
    
FoundEffectToStop:
    ; Mark effect as completed
    LDA #0
    STA SoundEffectQueue,X  ; Clear effect ID
    
    ; Free the channel if assigned
    JSR FreeEffectChannel
    
    CLC                     ; Success
    RTS

; ========================================
; PRIVATE HELPER FUNCTIONS
; ========================================

ClearSoundEffectQueue:
    ; ====================================
    ; PRIVATE: Clear all effect queue data
    ; ====================================
    LDX #0
    LDA #0
    
ClearQueueLoop:
    STA SoundEffectQueue,X
    INX
    CPX #(MAX_SOUND_EFFECTS * 6)
    BNE ClearQueueLoop
    
    RTS

FindAvailableQueueSlot:
    ; ====================================
    ; PRIVATE: Find empty slot in effect queue
    ; Returns: X = slot offset, carry set if none
    ; ====================================
    
    LDX #0
    
SlotSearchLoop:
    LDA SoundEffectQueue,X  ; Check effect ID
    BEQ FoundAvailableSlot  ; 0 = available
    
    ; Move to next slot
    TXA
    CLC
    ADC #6                  ; 6 bytes per effect
    TAX
    
    CMP #(MAX_SOUND_EFFECTS * 6)
    BNE SlotSearchLoop
    
    ; No slots available
    SEC
    RTS
    
FoundAvailableSlot:
    STX QueueSlotFound
    CLC
    RTS

StoreEffectInQueue:
    ; ====================================
    ; PRIVATE: Store effect data in queue slot
    ; ====================================
    
    LDX QueueSlotFound
    
    ; Store effect ID
    LDA RequestedEffectID
    STA SoundEffectQueue,X
    
    ; Store priority
    INX
    LDA RequestedPriority
    STA SoundEffectQueue,X
    
    ; Store initial volume (max)
    INX
    LDA #15
    STA SoundEffectQueue,X
    
    ; Store duration
    INX
    LDA RequestedDuration
    STA SoundEffectQueue,X
    
    ; Store channel (unassigned initially)
    INX
    LDA #3                  ; 3 = unassigned
    STA SoundEffectQueue,X
    
    ; Store flags (default: no special flags)
    INX
    LDA #0
    STA SoundEffectQueue,X
    
    RTS

; Placeholder implementations for remaining functions
ResetChannelAllocation:
InitializeSIDChip:
TryImmediateChannelAssignment:
UpdateActiveEffectDurations:
RemoveCompletedEffects:
ProcessVolumeFading:
AssignQueuedEffects:
UpdateSIDRegisters:
FreeEffectChannel:
    RTS

; ========================================
; WORKING VARIABLES
; ========================================

; Function parameters
RequestedEffectID:      .byte 0     ; Effect ID being queued
RequestedPriority:      .byte 0     ; Priority level requested  
RequestedDuration:      .byte 0     ; Duration in frames
QueueSlotFound:         .byte 0     ; Available queue slot index
EffectToStop:           .byte 0     ; Effect ID to stop

; Sound effect constants
SOUND_EXPLOSION         = 1         ; Explosion effect ID
SOUND_UI_CLICK          = 2         ; UI click effect ID

; Demonstrate the documented sound system
JSR InitializeSoundSystem
```

## Code Organization for Maintainability

### Modular Code Structure

```text
; ========================================
; MODULAR CODE ORGANIZATION
; ========================================

; File structure for large projects:
; 
; main.asm              - Program entry point
; ├── core/
; │   ├── memory.asm    - Memory management
; │   ├── input.asm     - Input handling
; │   └── timing.asm    - Timing and synchronization
; ├── graphics/
; │   ├── renderer.asm  - Graphics rendering
; │   ├── sprites.asm   - Sprite management
; │   └── effects.asm   - Visual effects
; ├── audio/
; │   ├── mixer.asm     - Audio mixing
; │   ├── effects.asm   - Sound effects
; │   └── music.asm     - Music playback
; └── game/
;     ├── player.asm    - Player logic
;     ├── enemies.asm   - Enemy AI
;     └── levels.asm    - Level management

; Module Interface Standards
; ========================================

; Each module should provide:
; 1. Initialization function
; 2. Update function (if needed)
; 3. Shutdown function  
; 4. Clear public interface
; 5. Documented dependencies

; Example module interface:
; ========================================
; MODULE: Memory Manager
; PUBLIC FUNCTIONS:
;   InitializeMemoryManager
;   AllocateMemoryBlock
;   FreeMemoryBlock  
;   GetMemoryStatistics
;   ShutdownMemoryManager
; 
; DEPENDENCIES:
;   None (core system module)
;
; EXPORTS:
;   Memory allocation functions
;   Memory debugging utilities
; ========================================

MemoryManagerInterface:
    ; Standard module initialization
    InitializeMemoryManager:
        ; Setup memory pools and tracking
        RTS
    
    ; Standard allocation interface
    AllocateMemoryBlock:
        ; Input: A = block size category
        ; Output: X/Y = address, carry = status
        RTS
    
    ; Standard deallocation interface
    FreeMemoryBlock:
        ; Input: X/Y = block address
        ; Output: Carry = status
        RTS
    
    ; Standard shutdown interface
    ShutdownMemoryManager:
        ; Cleanup and release resources
        RTS

; Configuration Management
; ========================================

; Centralized configuration for maintainability
GameConfiguration:
    ; ====================================
    ; GAME CONFIGURATION SETTINGS
    ; ====================================
    ; All game-wide settings in one location
    ; for easy tuning and modification
    ; ====================================
    
    ; Performance settings
    TARGET_FRAME_RATE       = 50       ; PAL frame rate
    MAX_SPRITES_PER_FRAME   = 8        ; Sprite limit
    GRAPHICS_BUFFER_SIZE    = $2000     ; 8KB graphics buffer
    
    ; Gameplay settings
    PLAYER_STARTING_LIVES   = 3         ; Initial lives
    PLAYER_INVULNERABLE_TIME= 120       ; 2.4 seconds
    ENEMY_SPAWN_RATE        = 180       ; 3.6 seconds
    
    ; Audio settings
    MASTER_VOLUME_DEFAULT   = 12        ; Default volume (0-15)
    SOUND_EFFECT_PRIORITY   = 3         ; Default SFX priority
    MUSIC_FADE_TIME         = 60        ; 1.2 second fade
    
    ; Memory layout settings
    ZERO_PAGE_START         = $FB       ; Available zero page
    ZERO_PAGE_SIZE          = 5         ; 5 bytes available
    SPRITE_DATA_START       = $2000     ; Sprite graphics
    LEVEL_DATA_START        = $4000     ; Level data storage

; Version Control Concepts
; ========================================

; While assembly doesn't have built-in version control,
; good practices include:

; 1. Version headers in each file
FileVersionInfo:
    ; ====================================
    ; VERSION INFORMATION
    ; ====================================
    ; File Version: 2.1.0
    ; Last Modified: 2024-01-20
    ; Changes This Version:
    ;   - Optimized sprite rendering (15% faster)
    ;   - Added error recovery in sound system
    ;   - Fixed memory leak in level transitions
    ; Previous Versions:
    ;   2.0.0 - Major graphics engine rewrite
    ;   1.5.3 - Audio system improvements
    ;   1.5.2 - Bug fixes for collision detection
    ; ====================================

; 2. Change tracking within functions
OptimizedFunction:
    ; ====================================
    ; CHANGE HISTORY
    ; ====================================
    ; v1.0 - Original implementation (2024-01-01)
    ; v1.1 - Added bounds checking (2024-01-05)
    ; v1.2 - Performance optimisation: 
    ;        Reduced cycles from 200 to 150 (2024-01-10)
    ; v1.3 - Fixed edge case with zero input (2024-01-15)
    ; ====================================
    
    ; Current implementation with version tracking
    RTS

; 3. Deprecated function handling
OldFunction:
    ; ====================================
    ; DEPRECATED FUNCTION
    ; ====================================
    ; Status: DEPRECATED as of v2.0.0
    ; Reason: Replaced by NewOptimizedFunction
    ; Removal: Planned for v3.0.0
    ; Migration: See NewOptimizedFunction documentation
    ; ====================================
    
    ; Temporary compatibility wrapper
    JSR NewOptimizedFunction
    RTS

NewOptimizedFunction:
    ; New implementation
    RTS
```

### Documentation Generation Framework

```text
; ========================================
; DOCUMENTATION GENERATION FRAMEWORK
; ========================================

; Standardized comment format for automated documentation
; Tools can parse these comments to generate external docs

; @module PlayerSystem
; @description Complete player character management system
; @version 1.3.0
; @author Development Team
; @dependencies InputSystem, GraphicsEngine, AudioMixer

; @constant PLAYER_MAX_SPEED
; @description Maximum movement speed in pixels per frame
; @value 4
; @units Pixels/frame
PLAYER_MAX_SPEED = 4

; @function UpdatePlayerMovement
; @description Update player position based on input and physics
; @param {byte} A - Input flags (see INPUT_* constants)
; @param {byte} X - Delta time for frame rate independence
; @param {byte} Y - World collision flags
; @returns {byte} A - Movement status (0=success, 1=blocked)
; @modifies A, X, Y registers
; @sideeffects Updates player position, triggers animations
; @complexity O(1) - constant time execution
; @cycles 150-200 depending on collision checks
; @example
; ; Update player with current input
; LDA CurrentInput
; LDX FrameDelta  
; LDY CollisionFlags
; JSR UpdatePlayerMovement
; BNE MovementBlocked
; @since v1.0.0
; @see GetPlayerPosition, SetPlayerPosition
UpdatePlayerMovement:
    ; Implementation with detailed inline comments
    
    ; @step 1 Validate input parameters
    CMP #$FF                ; Check for invalid input
    BEQ InvalidInput
    
    ; @step 2 Apply movement based on input
    AND #INPUT_LEFT         ; Check left movement
    BEQ CheckRightMovement
    JSR MovePlayerLeft
    
CheckRightMovement:
    ; @step 3 Check for boundary collisions
    ; Detailed collision checking logic here
    
InvalidInput:
    LDA #1                  ; Return error status
    RTS

; @function GetPlayerPosition  
; @description Retrieve current player world coordinates
; @returns {byte} A - Player X coordinate
; @returns {byte} X - Player Y coordinate
; @modifies A, X registers only
; @sideeffects None - read-only operation
; @complexity O(1)
; @cycles 12
; @example
; JSR GetPlayerPosition
; STA PlayerScreenX
; STX PlayerScreenY
; @since v1.0.0
; @see SetPlayerPosition, UpdatePlayerMovement
GetPlayerPosition:
    LDA PlayerWorldX
    LDX PlayerWorldY
    RTS

; @data PlayerWorldX
; @description Current player X coordinate in world space
; @type byte
; @range 0-255
; @units World pixels
; @access ReadWrite via GetPlayerPosition/SetPlayerPosition
; @initialized 128 (center of world)
PlayerWorldX: .byte 128

; @data PlayerWorldY  
; @description Current player Y coordinate in world space
; @type byte
; @range 0-255
; @units World pixels
; @access ReadWrite via GetPlayerPosition/SetPlayerPosition
; @initialized 200 (ground level)
PlayerWorldY: .byte 200

; Input constants for documentation
INPUT_LEFT  = %00000001
INPUT_RIGHT = %00000010

; Placeholder functions
MovePlayerLeft:
    RTS
```

**Code Organization and Documentation Framework:**

```assembly
; Complete code organisation and documentation framework
; Demonstrates modular structure and comprehensive documentation

; ========================================
; MODULE: GAME_STATE_MANAGER
; VERSION: 1.2.0
; DESCRIPTION: Centralized game state management system
; AUTHOR: Development Team
; DEPENDENCIES: InputSystem, AudioSystem, GraphicsRenderer
; ========================================

; @module GameStateManager
; @description Manages all game states and transitions
; @responsibilities
;   - Track current game state (menu, playing, paused, etc.)
;   - Handle state transitions with proper cleanup
;   - Coordinate between different game systems
;   - Provide save/load functionality for game state

; ========================================
; PUBLIC INTERFACE CONSTANTS
; ========================================

; @group GameStates
; @description Valid game state values
GAME_STATE_MENU         = 0        ; @const Main menu display
GAME_STATE_PLAYING      = 1        ; @const Active gameplay
GAME_STATE_PAUSED       = 2        ; @const Game paused
GAME_STATE_GAME_OVER    = 3        ; @const Game over screen
GAME_STATE_LOADING      = 4        ; @const Loading screen
GAME_STATE_CREDITS      = 5        ; @const Credits display

; @group StateTransitions  
; @description State transition flags
TRANSITION_IMMEDIATE    = 0        ; @const No transition effect
TRANSITION_FADE         = 1        ; @const Fade transition
TRANSITION_SLIDE        = 2        ; @const Slide transition

; ========================================
; MODULE DATA STRUCTURES
; ========================================

; @struct GameStateData
; @description Complete game state information
; @size 8 bytes
GameStateData:
    CurrentState:       .byte GAME_STATE_MENU  ; @field Current active state
    PreviousState:      .byte GAME_STATE_MENU  ; @field Previous state (for back navigation)
    NextState:          .byte 0                ; @field Pending state transition
    TransitionType:     .byte 0                ; @field How to transition between states
    TransitionProgress: .byte 0                ; @field Current transition progress (0-255)
    StateTimer:         .byte 0                ; @field Time spent in current state
    StateFlags:         .byte 0                ; @field State-specific flags
    SavedData:          .byte 0                ; @field Preserved data across transitions

; @bitfield StateFlags
; @description State-specific flag bits
STATE_FLAG_INITIALIZED  = %00000001    ; State has been properly initialized
STATE_FLAG_PAUSED       = %00000010    ; State execution is paused
STATE_FLAG_TRANSITIONING= %00000100    ; Currently transitioning between states
STATE_FLAG_SAVE_REQUIRED= %00001000    ; State should be saved before transition

; ========================================
; PUBLIC API FUNCTIONS
; ========================================

; @function InitializeGameStateManager
; @description Initialize the game state management system
; @inputs None
; @outputs None
; @modifies A register, GameStateData structure
; @sideeffects
;   - Resets all state data to initial values
;   - Sets up state transition system
;   - Initializes timing and progress tracking
; @callonce Must be called once at program startup
; @example JSR InitializeGameStateManager
; @since v1.0.0
InitializeGameStateManager:
    ; Clear all state data
    LDA #0
    STA TransitionProgress
    STA StateTimer
    STA StateFlags
    STA SavedData
    
    ; Set initial state
    LDA #GAME_STATE_MENU
    STA CurrentState
    STA PreviousState
    
    ; Mark as initialized
    LDA StateFlags
    ORA #STATE_FLAG_INITIALIZED
    STA StateFlags
    
    RTS

; @function RequestStateTransition
; @description Request transition to a new game state
; @param A New state to transition to (see GAME_STATE_* constants)
; @param X Transition type (see TRANSITION_* constants)
; @returns Carry clear if transition accepted, set if rejected
; @modifies A register, transition data
; @sideeffects
;   - May trigger state cleanup routines
;   - Begins transition animation if specified
;   - Updates state transition tracking
; @example
;   LDA #GAME_STATE_PLAYING
;   LDX #TRANSITION_FADE  
;   JSR RequestStateTransition
;   BCS TransitionRejected
; @since v1.0.0
; @see UpdateStateTransitions, GetCurrentState
RequestStateTransition:
    ; Validate new state
    CMP #6                  ; Check against maximum state value
    BCS InvalidState
    
    ; Check if already transitioning
    LDA StateFlags
    AND #STATE_FLAG_TRANSITIONING
    BNE AlreadyTransitioning
    
    ; Store transition request
    LDA RequestedState      ; Store the requested state (from A)
    STA NextState
    STX TransitionType
    
    ; Mark as transitioning
    LDA StateFlags
    ORA #STATE_FLAG_TRANSITIONING
    STA StateFlags
    
    ; Begin transition
    JSR BeginStateTransition
    
    CLC                     ; Success
    RTS
    
InvalidState:
AlreadyTransitioning:
    SEC                     ; Error/rejected
    RTS

; @function UpdateStateTransitions  
; @description Update state transition progress for current frame
; @inputs None
; @outputs None
; @modifies A, X registers, transition state
; @sideeffects
;   - Advances transition animations
;   - May complete pending state transitions
;   - Updates transition progress indicators
; @callfrequency Every game frame while transitioning
; @performance 50-100 cycles depending on transition type
; @example JSR UpdateStateTransitions
; @since v1.0.0
UpdateStateTransitions:
    ; Check if currently transitioning
    LDA StateFlags
    AND #STATE_FLAG_TRANSITIONING
    BEQ NoTransitionActive
    
    ; Update transition progress
    LDA TransitionProgress
    CLC
    ADC #8                  ; Transition speed (8 units per frame)
    STA TransitionProgress
    
    ; Check if transition complete
    CMP #255
    BCC TransitionInProgress
    
    ; Complete the transition
    JSR CompleteStateTransition
    
TransitionInProgress:
    ; Update transition visual effects
    JSR UpdateTransitionEffects
    
NoTransitionActive:
    RTS

; @function GetCurrentState
; @description Get the current active game state
; @inputs None
; @returns A Current game state value
; @modifies A register only
; @sideeffects None - read-only operation
; @performance 6 cycles
; @example
;   JSR GetCurrentState
;   CMP #GAME_STATE_PLAYING
;   BEQ GameIsActive
; @since v1.0.0
; @see RequestStateTransition, IsStateTransitioning
GetCurrentState:
    LDA CurrentState
    RTS

; @function IsStateTransitioning
; @description Check if a state transition is currently in progress
; @inputs None
; @returns Zero flag set if transitioning, clear if stable
; @modifies A register only
; @sideeffects None - read-only operation
; @performance 8 cycles
; @example
;   JSR IsStateTransitioning
;   BEQ CurrentlyTransitioning
; @since v1.1.0
IsStateTransitioning:
    LDA StateFlags
    AND #STATE_FLAG_TRANSITIONING
    RTS

; ========================================
; PRIVATE IMPLEMENTATION FUNCTIONS
; ========================================

; @function BeginStateTransition (PRIVATE)
; @description Initialize transition between states
; @caller RequestStateTransition
; @modifies A register, transition state
BeginStateTransition:
    ; Save current state as previous
    LDA CurrentState
    STA PreviousState
    
    ; Reset transition progress
    LDA #0
    STA TransitionProgress
    
    ; Initialize transition effects based on type
    LDA TransitionType
    CMP #TRANSITION_FADE
    BEQ InitializeFadeTransition
    CMP #TRANSITION_SLIDE
    BEQ InitializeSlideTransition
    
    ; Default immediate transition
    JMP CompleteStateTransition
    
InitializeFadeTransition:
    ; Setup fade transition parameters
    JSR SetupFadeEffect
    RTS
    
InitializeSlideTransition:
    ; Setup slide transition parameters
    JSR SetupSlideEffect
    RTS

; @function CompleteStateTransition (PRIVATE)
; @description Finalize state transition
; @caller UpdateStateTransitions
; @modifies A register, state data
CompleteStateTransition:
    ; Update current state to new state
    LDA NextState
    STA CurrentState
    
    ; Clear transitioning flag
    LDA StateFlags
    AND #($FF - STATE_FLAG_TRANSITIONING)  ; Clear transitioning bit
    STA StateFlags
    
    ; Reset transition progress
    LDA #0
    STA TransitionProgress
    STA NextState
    
    ; Notify systems of state change
    JSR NotifyStateChange
    
    RTS

; ========================================
; STATE-SPECIFIC HANDLER FUNCTIONS
; ========================================

; @function UpdateCurrentState
; @description Update logic for the currently active state
; @inputs None
; @outputs None
; @modifies A, X, Y registers, system state
; @callfrequency Every game frame
; @sideeffects Varies by state - may update graphics, audio, input
; @since v1.0.0
UpdateCurrentState:
    ; Dispatch to appropriate state handler
    LDA CurrentState
    CMP #GAME_STATE_MENU
    BEQ UpdateMenuState
    CMP #GAME_STATE_PLAYING
    BEQ UpdatePlayingState
    CMP #GAME_STATE_PAUSED
    BEQ UpdatePausedState
    CMP #GAME_STATE_GAME_OVER
    BEQ UpdateGameOverState
    
    ; Unknown state - error condition
    RTS
    
UpdateMenuState:
    ; @substep Handle menu input and navigation
    JSR ProcessMenuInput
    JSR UpdateMenuAnimations
    JSR UpdateMenuAudio
    RTS
    
UpdatePlayingState:
    ; @substep Handle active gameplay
    JSR ProcessGameInput
    JSR UpdateGameLogic
    JSR UpdateGameGraphics
    JSR UpdateGameAudio
    RTS
    
UpdatePausedState:
    ; @substep Handle pause menu
    JSR ProcessPauseInput
    JSR UpdatePauseMenu
    RTS
    
UpdateGameOverState:
    ; @substep Handle game over screen
    JSR ProcessGameOverInput
    JSR UpdateGameOverEffects
    RTS

; ========================================
; UTILITY AND HELPER FUNCTIONS
; ========================================

; @function SaveCurrentState
; @description Save current state data for later restoration
; @inputs None
; @outputs Carry clear if saved successfully
; @modifies A register, save data
; @since v1.2.0
SaveCurrentState:
    ; Mark save as required
    LDA StateFlags
    ORA #STATE_FLAG_SAVE_REQUIRED
    STA StateFlags
    
    ; Perform state-specific save operations
    JSR PerformStateSave
    
    CLC
    RTS

; @function RestoreSavedState
; @description Restore previously saved state data
; @inputs None  
; @outputs Carry clear if restored successfully
; @modifies A register, system state
; @since v1.2.0
RestoreSavedState:
    ; Check if save data is available
    LDA StateFlags
    AND #STATE_FLAG_SAVE_REQUIRED
    BEQ NoSaveData
    
    ; Perform state-specific restore operations
    JSR PerformStateRestore
    
    CLC
    RTS
    
NoSaveData:
    SEC
    RTS

; ========================================
; PLACEHOLDER IMPLEMENTATIONS
; ========================================
; These functions would be implemented based on
; specific game requirements

SetupFadeEffect:
SetupSlideEffect:
UpdateTransitionEffects:
NotifyStateChange:
ProcessMenuInput:
UpdateMenuAnimations:
UpdateMenuAudio:
ProcessGameInput:
UpdateGameLogic:
UpdateGameGraphics:
UpdateGameAudio:
ProcessPauseInput:
UpdatePauseMenu:
ProcessGameOverInput:
UpdateGameOverEffects:
PerformStateSave:
PerformStateRestore:
    RTS

; ========================================
; MODULE VARIABLES
; ========================================

; @var RequestedState
; @description Temporary storage for state transition requests
; @access Private to this module
; @type byte
RequestedState:         .byte 0

; Demonstrate the organised state manager
JSR InitializeGameStateManager
```

## Version Control and Change Management

### Change Documentation Standards

```text
; ========================================
; CHANGE MANAGEMENT DOCUMENTATION
; ========================================

; Change Log Template
; ========================================
; VERSION: 1.3.0
; DATE: 2024-01-20
; CHANGES:
;   + Added new collision detection system
;   * Optimized sprite rendering (15% performance gain)  
;   * Fixed memory leak in audio system
;   - Removed deprecated input polling method
;   ! Breaking change: Updated API for sound effects
; 
; MIGRATION GUIDE:
;   Old: JSR PlaySound
;   New: LDA #SOUND_ID : JSR QueueSoundEffect
; 
; COMPATIBILITY:
;   Maintains compatibility with v1.2.x
;   Breaks compatibility with v1.1.x and earlier
; ========================================

; Individual Change Tracking
; ========================================

FunctionWithChangeHistory:
    ; ====================================
    ; CHANGE HISTORY
    ; ====================================
    ; v1.0.0 (2024-01-01) - Initial implementation
    ;   - Basic functionality with hardcoded values
    ;   - Performance: 200 cycles average
    ;   - Known issue: Doesn't handle edge cases
    ;
    ; v1.1.0 (2024-01-05) - Enhanced functionality  
    ;   + Added input validation
    ;   + Added error handling for edge cases
    ;   * Improved readability with better comments
    ;   - Performance: 220 cycles average (slight regression)
    ;
    ; v1.2.0 (2024-01-10) - Performance optimisation
    ;   * Optimized inner loop using unrolled operations
    ;   * Reduced memory accesses by 30%
    ;   + Performance: 150 cycles average (25% improvement)
    ;   + Maintained all v1.1.0 functionality
    ;
    ; v1.2.1 (2024-01-12) - Bug fix
    ;   * Fixed off-by-one error in bounds checking
    ;   * No performance impact
    ;   * Maintains full backward compatibility
    ;
    ; v1.3.0 (2024-01-15) - Feature addition
    ;   + Added support for extended input range
    ;   + Added optional callback mechanism
    ;   * Updated documentation with usage examples
    ;   * Performance: 155 cycles average (slight increase due to features)
    ; ====================================
    
    ; Current implementation (v1.3.0)
    ; [Implementation details here]
    RTS

; API Evolution Documentation
; ========================================

; @deprecated_function OldAPICall
; @deprecated_since v1.2.0
; @deprecated_reason Replaced by more efficient NewAPICall
; @removal_planned v2.0.0
; @migration_guide
;   Old usage:
;     LDA #5
;     JSR OldAPICall
;   
;   New usage:
;     LDA #5
;     LDX #0              ; Additional parameter required
;     JSR NewAPICall
OldAPICall:
    ; Compatibility wrapper for old API
    LDX #0              ; Default parameter
    JSR NewAPICall      ; Delegate to new implementation
    RTS

; @function NewAPICall
; @since v1.2.0
; @description Improved version of OldAPICall with extended functionality
NewAPICall:
    ; New implementation
    RTS

; Breaking Change Documentation
; ========================================

; @breaking_change v2.0.0
; @description Complete rewrite of memory management system
; @reason Previous system had fundamental architectural limitations
; @impact
;   - All memory allocation calls must be updated
;   - Memory layout has changed
;   - Performance improved by 40%
;   - Memory usage reduced by 25%
; @migration_strategy
;   1. Update all AllocateMemory calls to use new parameters
;   2. Replace FreeMemory calls with new DeallocateMemory
;   3. Update memory addresses to use new layout
;   4. Test thoroughly - behavior has changed
; @example_migration
;   ; OLD (v1.x):
;   ; JSR AllocateMemory
;   ; STA MemoryPointer
;   
;   ; NEW (v2.x):
;   ; LDA #BLOCK_SIZE_256
;   ; JSR AllocateMemoryBlock
;   ; STX MemoryPointerLow
;   ; STY MemoryPointerHigh
NewMemorySystem:
    RTS
```

### Documentation Maintenance Practices

```text
; ========================================
; DOCUMENTATION MAINTENANCE STANDARDS
; ========================================

; 1. Review Documentation with Code Changes
; ========================================
; Rule: Every code change must include documentation updates
; Process:
;   - Update function headers for changed behavior
;   - Update examples if API changes
;   - Update performance notes if optimisation occurs
;   - Add change log entries
;   - Update version numbers

; 2. Regular Documentation Audits
; ========================================
; Schedule: Monthly documentation review
; Checklist:
;   - Are all public functions documented?
;   - Are examples still accurate?
;   - Are performance notes current?
;   - Are deprecated functions marked for removal?
;   - Is the change log up to date?

; 3. Documentation Quality Standards
; ========================================
WellDocumentedFunction:
    ; ====================================
    ; DOCUMENTATION QUALITY CHECKLIST
    ; ====================================
    ; ✓ Clear purpose statement
    ; ✓ Complete parameter documentation
    ; ✓ Return value documentation
    ; ✓ Side effects documented
    ; ✓ Performance characteristics noted
    ; ✓ Usage examples provided
    ; ✓ Error conditions documented
    ; ✓ Dependencies listed
    ; ✓ Version history maintained
    ; ✓ Related functions cross-referenced
    ; ====================================
    
    ; Implementation here
    RTS

; 4. Team Documentation Standards
; ========================================
; Style Guide:
;   - Use consistent comment formatting
;   - Follow naming conventions
;   - Include authorship information
;   - Maintain change attribution
;   - Use standard terminology

; Code Review Checklist:
;   - Documentation updated for changes?
;   - Examples tested and working?
;   - Performance claims verified?
;   - Breaking changes clearly marked?
;   - Migration guide provided?
```

## Practice Exercise

Create a comprehensive documentation system that demonstrates:

1. Self-documenting code with clear naming
2. Professional documentation standards
3. Modular organisation with clear interfaces
4. Version control and change tracking
5. Maintainable code structure

**Practice Exercise - Comprehensive Documentation System:**

```assembly
; Practice Exercise: Complete Documentation Framework
; Demonstrates all documentation and maintainability principles

; ========================================
; MODULE: COMPREHENSIVE_DOCUMENTATION_DEMO
; PURPOSE: Demonstrate professional documentation standards
; VERSION: 1.0.0
; AUTHOR: Documentation Team
; CREATED: 2024-01-20
; MODIFIED: 2024-01-20
; ========================================

; @module ComprehensiveDocumentationDemo
; @description Complete demonstration of documentation best practices
; @version 1.0.0
; @dependencies None (self-contained demonstration)
; @exports
;   - InitializeDocumentationDemo
;   - RunDocumentationExamples
;   - DisplayDocumentationResults

; ========================================
; CONFIGURATION AND CONSTANTS
; ========================================

; @group SystemLimits
; @description System capacity and limit constants
MAX_DOCUMENTATION_ITEMS     = 8        ; @const Maximum items to document
DOCUMENTATION_BUFFER_SIZE   = 128      ; @const Buffer size for text processing
EXAMPLE_COUNT_LIMIT         = 16       ; @const Maximum examples to process

; @group QualityStandards
; @description Documentation quality metrics
MIN_COMMENT_DENSITY         = 25       ; @const Minimum comments per 100 lines
REQUIRED_FUNCTION_DOCS      = 100      ; @const Percentage of functions requiring docs
MAX_FUNCTION_COMPLEXITY     = 10       ; @const Maximum cyclomatic complexity

; @group ProcessingModes
; @description Different documentation processing modes
DOC_MODE_BASIC              = 0        ; @const Basic documentation parsing
DOC_MODE_DETAILED           = 1        ; @const Detailed analysis mode
DOC_MODE_VALIDATION         = 2        ; @const Validation and checking mode

; ========================================
; DATA STRUCTURES
; ========================================

; @struct DocumentationMetrics
; @description Comprehensive documentation quality metrics
; @size 8 bytes
; @layout
;   Byte 0: Functions documented count (0-255)
;   Byte 1: Total functions count (0-255)  
;   Byte 2: Comment density percentage (0-100)
;   Byte 3: Documentation quality score (0-100)
;   Byte 4: Examples provided count (0-255)
;   Byte 5: Examples tested count (0-255)
;   Byte 6: Version compliance flags (bit-packed)
;   Byte 7: Overall health score (0-100)
DocumentationMetrics:
    FunctionsDocumented:    .byte 0     ; @field Number of documented functions
    TotalFunctions:         .byte 0     ; @field Total number of functions
    CommentDensity:         .byte 0     ; @field Percentage of lines with comments
    QualityScore:           .byte 0     ; @field Overall documentation quality (0-100)
    ExamplesProvided:       .byte 0     ; @field Number of examples in documentation
    ExamplesTested:         .byte 0     ; @field Number of tested examples
    ComplianceFlags:        .byte 0     ; @field Version and standard compliance
    HealthScore:            .byte 0     ; @field Overall documentation health

; @bitfield ComplianceFlags
; @description Documentation compliance status bits
COMPLIANCE_HEADERS          = %00000001 ; All files have proper headers
COMPLIANCE_FUNCTIONS        = %00000010 ; All functions properly documented
COMPLIANCE_EXAMPLES         = %00000100 ; Examples provided and tested
COMPLIANCE_VERSIONING       = %00001000 ; Version tracking implemented
COMPLIANCE_STANDARDS        = %00010000 ; Follows documentation standards

; ========================================
; PUBLIC INTERFACE FUNCTIONS
; ========================================

; @function InitializeDocumentationDemo
; @description Initialize the documentation demonstration system
; @algorithm
;   1. Clear all metrics and counters
;   2. Set up example data structures  
;   3. Initialize quality tracking
;   4. Prepare validation systems
; @inputs None
; @outputs None
; @modifies A register, DocumentationMetrics structure
; @sideeffects
;   - Clears all tracking counters
;   - Initializes example data
;   - Sets up quality metrics
; @performance 50-75 cycles
; @example
;   JSR InitializeDocumentationDemo
;   ; System ready for documentation analysis
; @since v1.0.0
; @see RunDocumentationExamples, DisplayDocumentationResults
InitializeDocumentationDemo:
    ; Clear all metrics
    LDA #0
    STA FunctionsDocumented
    STA TotalFunctions
    STA CommentDensity
    STA QualityScore
    STA ExamplesProvided
    STA ExamplesTested
    STA ComplianceFlags
    STA HealthScore
    
    ; Initialize demonstration counters
    STA ExampleCounter
    STA QualityCounter
    STA ValidationCounter
    
    ; Setup example data
    JSR SetupExampleData
    
    ; Initialize quality tracking
    JSR InitializeQualityTracking
    
    RTS

; @function RunDocumentationExamples
; @description Execute comprehensive documentation examples
; @algorithm
;   1. Analyze code documentation coverage
;   2. Check comment density and quality
;   3. Validate examples and cross-references
;   4. Calculate overall documentation health
; @inputs None
; @outputs A Documentation health score (0-100)
; @modifies A, X, Y registers, all metrics
; @sideeffects
;   - Updates all documentation metrics
;   - Performs quality analysis
;   - Validates examples and references
; @performance 500-800 cycles depending on codebase size
; @example
;   JSR RunDocumentationExamples
;   CMP #80                 ; Check if quality threshold met
;   BCS DocumentationGood
; @since v1.0.0
; @see AnalyzeDocumentationCoverage, ValidateExamples
RunDocumentationExamples:
    ; Phase 1: Analyze documentation coverage
    JSR AnalyzeDocumentationCoverage
    
    ; Phase 2: Check comment quality and density
    JSR AnalyzeCommentQuality
    
    ; Phase 3: Validate examples and cross-references
    JSR ValidateDocumentationExamples
    
    ; Phase 4: Calculate overall health score
    JSR CalculateDocumentationHealth
    
    ; Return overall health score
    LDA HealthScore
    RTS

; @function DisplayDocumentationResults
; @description Display comprehensive documentation analysis results
; @inputs None
; @outputs None
; @modifies A register, display system
; @sideeffects
;   - Updates screen display
;   - Shows documentation metrics
;   - Provides quality recommendations
; @performance 200-300 cycles
; @example
;   JSR DisplayDocumentationResults
;   ; Results now visible on screen
; @since v1.0.0
DisplayDocumentationResults:
    ; Display header
    JSR DisplayResultsHeader
    
    ; Show coverage metrics
    JSR DisplayCoverageMetrics
    
    ; Show quality metrics  
    JSR DisplayQualityMetrics
    
    ; Show compliance status
    JSR DisplayComplianceStatus
    
    ; Show recommendations
    JSR DisplayRecommendations
    
    RTS

; ========================================
; PRIVATE ANALYSIS FUNCTIONS
; ========================================

; @function AnalyzeDocumentationCoverage (PRIVATE)
; @description Analyze what percentage of code is documented
; @caller RunDocumentationExamples
; @algorithm Scans through all functions and checks for documentation
; @modifies A, X registers, coverage metrics
AnalyzeDocumentationCoverage:
    ; Count total functions in demonstration
    LDA #8                  ; Demo has 8 documented functions
    STA TotalFunctions
    
    ; Count documented functions
    LDA #8                  ; All demo functions are documented
    STA FunctionsDocumented
    
    ; Calculate coverage percentage
    JSR CalculateCoveragePercentage
    
    ; Update compliance flags
    LDA ComplianceFlags
    ORA #COMPLIANCE_FUNCTIONS   ; Mark functions as compliant
    STA ComplianceFlags
    
    RTS

; @function AnalyzeCommentQuality (PRIVATE)
; @description Analyze comment density and quality
; @caller RunDocumentationExamples
; @algorithm Counts comments vs code lines and analyzes content
; @modifies A register, quality metrics
AnalyzeCommentQuality:
    ; Simulate comment density analysis
    ; In real implementation, would scan source code
    LDA #65                 ; Simulated 65% comment density
    STA CommentDensity
    
    ; Calculate quality score based on density
    CMP #MIN_COMMENT_DENSITY
    BCC LowCommentDensity
    
    ; Good comment density
    LDA #85                 ; High quality score
    STA QualityScore
    JMP CommentAnalysisDone
    
LowCommentDensity:
    ; Poor comment density
    LDA #45                 ; Lower quality score
    STA QualityScore
    
CommentAnalysisDone:
    RTS

; @function ValidateDocumentationExamples (PRIVATE)
; @description Validate that all examples work correctly
; @caller RunDocumentationExamples  
; @algorithm Tests each documented example for correctness
; @modifies A, X registers, example metrics
ValidateDocumentationExamples:
    ; Count examples in documentation
    LDA #12                 ; Demo has 12 examples
    STA ExamplesProvided
    
    ; Test each example (simulated)
    JSR TestDocumentationExamples
    
    ; Record tested examples
    LDA #10                 ; 10 of 12 examples passed
    STA ExamplesTested
    
    ; Update compliance
    LDA ComplianceFlags
    ORA #COMPLIANCE_EXAMPLES
    STA ComplianceFlags
    
    RTS

; @function CalculateDocumentationHealth (PRIVATE)
; @description Calculate overall documentation health score
; @caller RunDocumentationExamples
; @algorithm Combines all metrics into single health score
; @modifies A register, health score
CalculateDocumentationHealth:
    ; Start with base score
    LDA #0
    STA HealthScore
    
    ; Add points for function documentation
    LDA FunctionsDocumented
    CMP TotalFunctions
    BNE PartialFunctionCoverage
    
    ; Full function coverage
    LDA HealthScore
    CLC
    ADC #30                 ; 30 points for full coverage
    STA HealthScore
    JMP CheckCommentDensity
    
PartialFunctionCoverage:
    ; Partial coverage - fewer points
    LDA HealthScore
    CLC
    ADC #15                 ; 15 points for partial coverage
    STA HealthScore
    
CheckCommentDensity:
    ; Add points for comment density
    LDA CommentDensity
    CMP #50
    BCC LowDensityPoints
    
    ; High density
    LDA HealthScore
    CLC
    ADC #25                 ; 25 points for good density
    STA HealthScore
    JMP CheckExamples
    
LowDensityPoints:
    ; Low density
    LDA HealthScore
    CLC
    ADC #10                 ; 10 points for low density
    STA HealthScore
    
CheckExamples:
    ; Add points for examples
    LDA ExamplesTested
    CMP ExamplesProvided
    BNE PartialExamples
    
    ; All examples tested
    LDA HealthScore
    CLC
    ADC #20                 ; 20 points for tested examples
    STA HealthScore
    JMP CheckCompliance
    
PartialExamples:
    ; Some examples tested
    LDA HealthScore  
    CLC
    ADC #10                 ; 10 points for partial testing
    STA HealthScore
    
CheckCompliance:
    ; Add points for compliance
    LDA ComplianceFlags
    AND #%00011111          ; Check all compliance bits
    CMP #%00011111          ; All bits set?
    BNE PartialCompliance
    
    ; Full compliance
    LDA HealthScore
    CLC
    ADC #25                 ; 25 points for full compliance
    STA HealthScore
    JMP HealthCalculationDone
    
PartialCompliance:
    ; Partial compliance
    LDA HealthScore
    CLC
    ADC #15                 ; 15 points for partial compliance
    STA HealthScore
    
HealthCalculationDone:
    ; Ensure score doesn't exceed 100
    LDA HealthScore
    CMP #100
    BCC HealthScoreOK
    LDA #100
    STA HealthScore
    
HealthScoreOK:
    RTS

; ========================================
; DISPLAY AND REPORTING FUNCTIONS
; ========================================

; @function DisplayResultsHeader (PRIVATE)
; @description Display header for documentation results
; @caller DisplayDocumentationResults
; @modifies A register
DisplayResultsHeader:
    ; In real implementation, would display formatted header
    ; For demo, just mark that header was displayed
    LDA #1
    STA DisplayState
    RTS

; @function DisplayCoverageMetrics (PRIVATE)
; @description Display function documentation coverage
; @caller DisplayDocumentationResults
; @modifies A register
DisplayCoverageMetrics:
    ; Calculate and display coverage percentage
    JSR CalculateCoveragePercentage
    
    ; Mark coverage displayed
    LDA DisplayState
    ORA #%00000010
    STA DisplayState
    RTS

; @function DisplayQualityMetrics (PRIVATE)
; @description Display comment quality and density metrics
; @caller DisplayDocumentationResults  
; @modifies A register
DisplayQualityMetrics:
    ; Display quality score and comment density
    ; Mark quality displayed
    LDA DisplayState
    ORA #%00000100
    STA DisplayState
    RTS

; @function DisplayComplianceStatus (PRIVATE)
; @description Display compliance with documentation standards
; @caller DisplayDocumentationResults
; @modifies A register
DisplayComplianceStatus:
    ; Display compliance flags status
    ; Mark compliance displayed
    LDA DisplayState
    ORA #%00001000
    STA DisplayState
    RTS

; @function DisplayRecommendations (PRIVATE)
; @description Display recommendations for improvement
; @caller DisplayDocumentationResults
; @modifies A register
DisplayRecommendations:
    ; Analyze current state and provide recommendations
    LDA HealthScore
    CMP #80
    BCS GoodDocumentationHealth
    
    ; Poor health - show improvement recommendations
    JSR DisplayImprovementRecommendations
    JMP RecommendationsDone
    
GoodDocumentationHealth:
    ; Good health - show maintenance recommendations
    JSR DisplayMaintenanceRecommendations
    
RecommendationsDone:
    ; Mark recommendations displayed
    LDA DisplayState
    ORA #%00010000
    STA DisplayState
    RTS

; ========================================
; UTILITY FUNCTIONS
; ========================================

; @function CalculateCoveragePercentage (PRIVATE)
; @description Calculate documentation coverage percentage
; @inputs Uses FunctionsDocumented and TotalFunctions
; @outputs A Coverage percentage (0-100)
; @modifies A register
; @algorithm percentage = (documented * 100) / total
CalculateCoveragePercentage:
    ; Simple calculation for demo
    LDA FunctionsDocumented
    CMP TotalFunctions
    BNE PartialCoverage
    
    LDA #100                ; 100% coverage
    RTS
    
PartialCoverage:
    ; Calculate actual percentage (simplified)
    LDA #75                 ; Simulated 75% coverage
    RTS

; Placeholder implementations for demo completeness
SetupExampleData:
InitializeQualityTracking:
TestDocumentationExamples:
DisplayImprovementRecommendations:
DisplayMaintenanceRecommendations:
    RTS

; ========================================
; WORKING VARIABLES
; ========================================

; @group CountersAndState
; @description Internal working variables for demonstration
ExampleCounter:         .byte 0     ; @var Current example being processed
QualityCounter:         .byte 0     ; @var Quality analysis progress counter
ValidationCounter:      .byte 0     ; @var Validation progress counter
DisplayState:           .byte 0     ; @var Display state flags (bit-packed)

; ========================================
; DEMONSTRATION EXECUTION
; ========================================

; Run the complete documentation demonstration
ComprehensiveDocumentationDemo:
    JSR InitializeDocumentationDemo
    JSR RunDocumentationExamples
    JSR DisplayDocumentationResults
    RTS

; Execute the demonstration
JSR ComprehensiveDocumentationDemo
```

## Documentation Best Practices

### 1. Write Code that Explains Itself
```text
; Use descriptive names that reveal intent
; Organize code in logical, readable structures
; Keep functions focused on single responsibilities
; Use consistent patterns throughout
```

### 2. Document the Why, Not Just the What
```text
; Explain design decisions and trade-offs
; Document business logic and requirements
; Describe algorithms and their complexity
; Note performance characteristics and constraints
```

### 3. Maintain Documentation Currency
```text
; Update docs with every code change
; Review documentation in code reviews
; Validate examples and keep them working
; Remove outdated or incorrect information
```

### 4. Create Comprehensive References
```text
; Document all public interfaces thoroughly
; Provide usage examples for complex functions
; Include error conditions and edge cases
; Cross-reference related functions and concepts
```

## What You've Learned

In this lesson, you've mastered professional documentation and maintainability:

- **Self-Documenting Code**: Writing code that clearly communicates its purpose and structure
- **Comprehensive Documentation**: Creating complete, accurate, and useful documentation
- **Code Organization**: Structuring programs for long-term maintainability and team development
- **Version Control Concepts**: Tracking changes and managing code evolution over time
- **Professional Standards**: Following industry best practices for documentation and code quality

## Looking Ahead

In the next lesson, you'll learn **project planning and development** - how to plan, organise, and execute large programming projects from conception to completion.

## Fun Fact

The documentation techniques you've learned are the foundation of all successful software projects! The self-documenting code principles, comprehensive commenting standards, and maintainable architecture patterns you've mastered are used in everything from operating systems to spacecraft software. The version control concepts and change management practices are the basis for tools like Git, which powers all modern software development. You've learned the timeless principles of software craftsmanship that distinguish professional developers from hobbyists - the ability to write code that not only works today but remains understandable and maintainable for years to come!

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content":"Review existing lesson structure and content organisation","status":"completed","priority":"high","id":"1"},{"content":"Examine current lesson templates and formatting","status":"completed","priority":"high","id":"2"},{"content":"Identify which system/tier to start writing lessons for","status":"completed","priority":"high","id":"3"},{"content":"Rewrite C64 lesson 1 to teach 6502 assembly fundamentals","status":"completed","priority":"high","id":"4"},{"content":"Create lesson 2: Store instructions and memory operations","status":"completed","priority":"high","id":"5"},{"content":"Create lesson 3: Understanding addressing modes","status":"completed","priority":"high","id":"6"},{"content":"Create lesson 4: Status register and flags","status":"completed","priority":"high","id":"7"},{"content":"Create lesson 5: Arithmetic operations (ADC/SBC)","status":"completed","priority":"high","id":"8"},{"content":"Create lesson 6: Increment and decrement operations","status":"completed","priority":"high","id":"9"},{"content":"Create lesson 7: Logical operations (AND/OR/XOR)","status":"completed","priority":"high","id":"10"},{"content":"Create lesson 8: Basic data manipulation and review","status":"completed","priority":"high","id":"11"},{"content":"Create lesson 9: Indexed addressing modes","status":"completed","priority":"high","id":"22"},{"content":"Create lesson 10: Indirect addressing and pointers","status":"completed","priority":"high","id":"23"},{"content":"Create lesson 11: Stack operations and memory management","status":"completed","priority":"high","id":"24"},{"content":"Create lesson 12: Subroutines and JSR/RTS","status":"completed","priority":"high","id":"25"},{"content":"Create lesson 13: Branching and program flow control","status":"completed","priority":"high","id":"26"},{"content":"Create lesson 14: Advanced memory techniques and optimisation","status":"completed","priority":"high","id":"27"},{"content":"Create lesson 15: Interrupts and system programming","status":"completed","priority":"high","id":"28"},{"content":"Create lesson 16: Memory and addressing section review","status":"completed","priority":"high","id":"29"},{"content":"Plan C64 Tier 1 lessons 17-32 structure and sections","status":"completed","priority":"high","id":"30"},{"content":"Create lesson 17: Introduction to VIC-II graphics chip","status":"completed","priority":"high","id":"31"},{"content":"Create lesson 18: Screen modes and character sets","status":"completed","priority":"high","id":"32"},{"content":"Create lesson 19: Sprites and hardware graphics","status":"completed","priority":"high","id":"33"},{"content":"Create lesson 20: Color and bitmap graphics","status":"completed","priority":"high","id":"34"},{"content":"Create lesson 21: Introduction to SID sound chip","status":"completed","priority":"high","id":"35"},{"content":"Create lesson 22: Sound synthesis and waveforms","status":"completed","priority":"high","id":"36"},{"content":"Create lesson 23: Music and advanced audio programming","status":"completed","priority":"high","id":"37"},{"content":"Create lesson 32: Phase 1 integration and tier review","status":"completed","priority":"high","id":"40"},{"content":"Create lesson 24: I/O and hardware control section review","status":"pending","priority":"high","id":"38"},{"content":"Create lesson 25: File operations and data management","status":"completed","priority":"high","id":"41"},{"content":"Create lesson 26: Program organisation and structure","status":"completed","priority":"high","id":"42"},{"content":"Create lesson 27: Basic optimisation and efficiency","status":"completed","priority":"high","id":"43"},{"content":"Create lesson 28: Error handling and debugging basics","status":"completed","priority":"high","id":"44"},{"content":"Create lesson 29: Code documentation and maintainability","status":"completed","priority":"high","id":"45"},{"content":"Create lesson 30: Project planning and development","status":"in_progress","priority":"high","id":"46"},{"content":"Create lesson 31: Building complete applications","status":"pending","priority":"high","id":"47"},{"content":"Plan visual enhancement phase for completed lessons","status":"pending","priority":"medium","id":"39"}]