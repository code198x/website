---
title: "Number Quest Prototype and Tier 1 Review"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 32
description: "Create your first Number Quest prototype while reviewing all Tier 1 concepts. Build a basic but functional version of your number guessing game and prepare for advanced techniques in Tier 2."
learning_objectives:
  - "Integrate all Tier 1 programming concepts into complete applications"
  - "Learn professional development patterns and best practices"
  - "Practice complex system programming combining multiple subsystems"
  - "Build comprehensive understanding of C64 architecture"
  - "Prepare for Tier 2 advanced programming techniques"
concepts:
  - "Complete system integration and architecture"
  - "Professional development methodologies"
  - "Complex application development patterns"
  - "Performance optimisation and debugging"
  - "Advanced programming foundations"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 32
---

# Lesson 32: Number Quest Prototype and Tier 1 Review

Congratulations! You've completed Tier 1 of Phase 1. Today you'll create your first Number Quest prototype and review everything you've learned about 6502 assembly programming, VIC-II graphics, and SID audio. Your prototype demonstrates foundational competency in C64 development and prepares you for the advanced techniques in Tier 2.

## Tier 1 Achievement Review

Over the past 32 lessons, you've built a comprehensive foundation in C64 assembly programming:

### Memory and CPU Mastery (Lessons 1-16)
- **6502 Assembly Language**: Complete instruction set and addressing modes
- **Memory Management**: Zero page, stack, and advanced memory techniques  
- **Program Control**: Subroutines, branching, and interrupt handling
- **Data Manipulation**: All arithmetic, logical, and bit operations
- **Professional Patterns**: Optimization, debugging, and code organisation

### Graphics and Visual Programming (Lessons 17-20)
- **VIC-II Architecture**: Complete understanding of the graphics chip
- **Text and Character Graphics**: Screen modes, custom characters, and colour
- **Hardware Sprites**: 8-sprite system with collision detection and animation
- **Bitmap Graphics**: Pixel-level control and advanced visual effects

### Audio and Sound Programming (Lessons 21-24)
- **SID Architecture**: Revolutionary sound synthesis chip programming
- **Sound Generation**: Waveforms, envelopes, and basic audio effects
- **Advanced Synthesis**: Filters, modulation, and complex timbres
- **Musical Programming**: Sequencing, composition, and complete audio systems

### Professional Development Skills (Lessons 25-31)
- **File Operations**: Loading, saving, and data management
- **Code Organization**: Modular programming and maintainable code
- **Optimization**: Memory efficiency and performance techniques
- **Debugging**: Error handling and systematic problem-solving
- **Documentation**: Professional coding standards and practices
- **Project Planning**: System architecture and development methodologies
- **Complete Applications**: Integrated systems with multiple subsystems

## Integrated Programming Concepts

### System-Level Architecture

Professional C64 programming requires understanding how all subsystems work together:

```text
; Complete system initialization routine
SystemInit:
    ; 1. Initialize CPU and memory
    SEI                 ; Disable interrupts during init
    CLD                 ; Clear decimal mode
    LDX #$FF
    TXS                 ; Reset stack pointer
    
    ; 2. Initialize VIC-II
    JSR InitGraphics
    
    ; 3. Initialize SID
    JSR InitAudio
    
    ; 4. Setup memory management
    JSR InitMemory
    
    ; 5. Install interrupt handlers
    JSR SetupInterrupts
    
    ; 6. Initialize application state
    JSR InitApplication
    
    CLI                 ; Re-enable interrupts
    RTS

; Graphics subsystem initialization
InitGraphics:
    ; Clear screen memory
    LDX #$00
    LDA #$20        ; Space character
ClearScreen:
    STA $0400,X
    STA $0500,X
    STA $0600,X
    STA $0700,X
    INX
    BNE ClearScreen
    
    ; Setup default colors
    LDA #$06        ; Blue background
    STA $D021
    LDA #$0E        ; Light blue text
    STA $286        ; Current colour
    
    ; Initialize sprite system
    LDA #$00
    STA $D015       ; Disable all sprites initially
    
    RTS

; Audio subsystem initialization  
InitAudio:
    ; Clear all SID registers
    LDX #$00
    LDA #$00
ClearSID:
    STA $D400,X
    INX
    CPX #$19        ; 25 SID registers
    BNE ClearSID
    
    ; Set master volume
    LDA #$0F        ; Full volume
    STA $D418
    
    RTS
```

### Interrupt-Driven Programming

Professional applications use interrupts to coordinate multiple subsystems:

```text
; Learn interrupt handler
MainIRQ:
    ; Save CPU state
    PHA
    TXA
    PHA
    TYA
    PHA
    
    ; Check interrupt sources
    LDA $D019       ; VIC-II interrupt register
    AND #$01        ; Check raster interrupt
    BEQ CheckOtherIRQ
    
    ; Handle raster interrupt
    JSR RasterHandler
    
    ; Acknowledge VIC-II interrupt
    LDA #$01
    STA $D019
    
CheckOtherIRQ:
    ; Check CIA interrupts if needed
    LDA $DC0D       ; CIA1 interrupt register
    BMI TimerIRQ    ; Timer interrupt occurred
    
ExitIRQ:
    ; Restore CPU state
    PLA
    TAY
    PLA
    TAX
    PLA
    RTI

RasterHandler:
    ; Update graphics effects
    JSR UpdateRasterEffects
    
    ; Update sprite animations
    JSR UpdateSprites
    
    ; Process audio sequencer
    JSR UpdateMusic
    
    RTS

TimerIRQ:
    ; Handle precise timing events
    JSR UpdateGameLogic
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Complete System Integration Demo"
  code="; Integrated demonstration combining all Phase 1 concepts
; Multi-subsystem application with graphics, audio, and animation

CompleteDemo:
    JSR SystemSetup
    JSR MainLoop
    RTS

SystemSetup:
    ; Initialize all subsystems
    JSR InitDisplay
    JSR InitSound  
    JSR InitAnimation
    RTS

InitDisplay:
    ; Setup display mode
    LDA $D011
    ORA #%00100000  ; Enable bitmap mode
    STA $D011
    
    ; Clear bitmap
    LDX #$00
    LDA #$00
ClearBitmap:
    STA $2000,X
    STA $2100,X
    STA $2200,X
    STA $2300,X
    INX
    BNE ClearBitmap
    
    ; Setup colors
    LDA #%00010000  ; White on black
    LDX #$00
SetColors:
    STA $0400,X
    INX
    CPX #$FF
    BNE SetColors
    
    RTS

InitSound:
    ; Setup SID for music
    LDA #%00110011  ; Medium attack/decay
    STA $D405       ; Voice 1
    LDA #%11110010  ; Full sustain, medium release
    STA $D406
    LDA #%00001111  ; Full volume
    STA $D418
    RTS

InitAnimation:
    ; Setup sprite system
    LDA #$80        ; Sprite data at $2000
    STA $07F8       ; Sprite 0 pointer
    
    LDA #%00000001  ; Enable sprite 0
    STA $D015
    
    ; Initial position
    LDA #100
    STA $D000       ; X position
    LDA #100
    STA $D001       ; Y position
    
    ; Set colour
    LDA #$02        ; Red
    STA $D027
    
    RTS

MainLoop:
    ; Update graphics
    JSR UpdateGraphics
    
    ; Update audio
    JSR UpdateAudio
    
    ; Update animation
    JSR UpdateAnimation
    
    ; Synchronization delay
    JSR SyncDelay
    
    JMP MainLoop

UpdateGraphics:
    ; Create animated bitmap pattern
    LDA $90         ; Frame counter
    ASL
    ASL
    TAX
    
    LDA SineTable,X ; Get sine value
    STA $2000       ; Update bitmap
    
    INC $90         ; Next frame
    RTS

UpdateAudio:
    ; Play musical note sequence
    LDX $91         ; Note index
    LDA NoteTable,X ; Get frequency
    CMP #$FF        ; End marker?
    BEQ ResetMusic
    
    STA $D400       ; Set frequency low
    LDA NoteTable+1,X
    STA $D401       ; Set frequency high
    
    ; Start note
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Next note
    INC $91
    INC $91         ; 2 bytes per note
    RTS

ResetMusic:
    LDA #$00
    STA $91         ; Reset to start
    RTS

UpdateAnimation:
    ; Move sprite in circle
    LDA $92         ; Angle counter
    TAX
    LDA SineTable,X ; Get X offset
    CLC
    ADC #160        ; Add center X
    STA $D000       ; Update sprite X
    
    LDA $92
    CLC
    ADC #64         ; Phase offset for Y
    TAX
    LDA SineTable,X ; Get Y offset
    CLC
    ADC #100        ; Add center Y
    STA $D001       ; Update sprite Y
    
    INC $92         ; Next angle
    RTS

SyncDelay:
    LDY #$40
DelayLoop:
    DEY
    BNE DelayLoop
    RTS

; Data tables
SineTable:
    .byte 128, 131, 134, 137, 140, 143, 146, 149
    .byte 152, 155, 158, 161, 164, 167, 170, 173
    .byte 176, 178, 181, 184, 187, 190, 192, 195
    .byte 198, 200, 203, 205, 208, 210, 212, 215
    .byte 217, 219, 221, 223, 225, 227, 229, 231
    .byte 233, 234, 236, 238, 239, 240, 242, 243
    .byte 244, 245, 246, 247, 248, 249, 250, 251
    .byte 252, 252, 253, 253, 254, 254, 254, 255

NoteTable:
    .byte $20, $48  ; C
    .byte $C4, $50  ; D
    .byte $82, $5A  ; E
    .byte $B4, $60  ; F
    .byte $18, $6E  ; G
    .byte $D6, $7C  ; A
    .byte $D8, $8C  ; B
    .byte $40, $90  ; C
    .byte $FF, $FF  ; End marker

; Start the integrated demonstration
JSR CompleteDemo"
  language="assembly"
/>

## Advanced Integration Patterns

### Multi-Subsystem Communication

```text
; Message passing system between subsystems
MessageQueue = $C000    ; Message buffer start
QueueHead = $CF         ; Queue head pointer
QueueTail = $D0         ; Queue tail pointer

; Message types
MSG_PLAY_SOUND = $01
MSG_MOVE_SPRITE = $02
MSG_CHANGE_COLOR = $03

SendMessage:
    ; Input: Message type in A, data in X/Y
    PHA                 ; Save message type
    
    ; Calculate queue position
    LDX QueueHead
    STA MessageQueue,X  ; Store message type
    INX
    TYA                 ; Data byte 1
    STA MessageQueue,X
    INX
    TXA                 ; Data byte 2 (from X register)
    STA MessageQueue,X
    INX
    STX QueueHead       ; Update head pointer
    
    PLA                 ; Restore A
    RTS

ProcessMessages:
    ; Check if messages available
    LDA QueueTail
    CMP QueueHead
    BEQ NoMessages      ; Queue empty
    
    ; Get message
    TAX
    LDA MessageQueue,X  ; Message type
    CMP #MSG_PLAY_SOUND
    BEQ HandleSound
    CMP #MSG_MOVE_SPRITE
    BEQ HandleSprite
    ; ... handle other message types
    
    ; Advance tail pointer
    INX
    INX
    INX                 ; Skip message (3 bytes)
    STX QueueTail
    JMP ProcessMessages ; Process next message
    
NoMessages:
    RTS

HandleSound:
    ; Process sound message
    INX
    LDA MessageQueue,X  ; Get frequency
    STA $D400
    INX
    LDA MessageQueue,X  ; Get waveform
    STA $D404
    RTS

HandleSprite:
    ; Process sprite movement message
    INX
    LDA MessageQueue,X  ; Get X position
    STA $D000
    INX
    LDA MessageQueue,X  ; Get Y position
    STA $D001
    RTS
```

### Resource Management System

```text
; Memory allocation system for dynamic resources
MemoryPool = $D000      ; Free memory start
PoolSize = $1000        ; 4KB pool
FreeList = $FE          ; Pointer to free memory

; Sprite resource manager
SpritePool = $E000      ; Sprite data pool
NextSprite = $FD        ; Next available sprite slot

AllocateSprite:
    ; Find free sprite slot
    LDX #$00
FindFreeSprite:
    LDA SpritesInUse,X
    BEQ FoundFree
    INX
    CPX #$08
    BNE FindFreeSprite
    LDA #$FF            ; No free sprites
    RTS

FoundFree:
    ; Mark sprite as used
    LDA #$01
    STA SpritesInUse,X
    
    ; Return sprite number in A
    TXA
    RTS

FreeSprite:
    ; Input: Sprite number in A
    TAX
    LDA #$00
    STA SpritesInUse,X  ; Mark as free
    
    ; Disable sprite
    LDA SpriteEnableMask,X
    EOR #$FF            ; Invert mask
    AND $D015           ; Clear sprite bit
    STA $D015
    RTS

SpritesInUse:
    .byte 0, 0, 0, 0, 0, 0, 0, 0

SpriteEnableMask:
    .byte %00000001, %00000010, %00000100, %00001000
    .byte %00010000, %00100000, %01000000, %10000000
```

### State Machine Framework

```text
; Game state management system
GameState = $FB         ; Current state
StateData = $FC         ; State-specific data pointer

; State constants
STATE_MENU = $00
STATE_PLAYING = $01
STATE_PAUSED = $02
STATE_GAMEOVER = $03

UpdateGameState:
    LDA GameState
    ASL                 ; Multiply by 2 for word table
    TAX
    
    ; Call state-specific update function
    LDA StateUpdateLo,X
    STA $80
    LDA StateUpdateHi,X
    STA $81
    JMP ($0080)         ; Jump to state handler

StateUpdateLo:
    .byte <UpdateMenu, <UpdatePlaying, <UpdatePaused, <UpdateGameOver

StateUpdateHi:
    .byte >UpdateMenu, >UpdatePlaying, >UpdatePaused, >UpdateGameOver

UpdateMenu:
    ; Handle menu logic
    JSR CheckMenuInput
    JSR UpdateMenuGraphics
    JSR UpdateMenuAudio
    RTS

UpdatePlaying:
    ; Handle game logic
    JSR UpdatePlayer
    JSR UpdateEnemies
    JSR CheckCollisions
    JSR UpdateGameDisplay
    JSR UpdateGameAudio
    RTS

UpdatePaused:
    ; Handle pause state
    JSR CheckPauseInput
    JSR UpdatePauseDisplay
    RTS

UpdateGameOver:
    ; Handle game over state
    JSR CheckRestartInput
    JSR UpdateGameOverDisplay
    JSR UpdateGameOverAudio
    RTS

ChangeState:
    ; Input: New state in A
    STA GameState
    
    ; Call state initialization
    ASL
    TAX
    LDA StateInitLo,X
    STA $80
    LDA StateInitHi,X
    STA $81
    JMP ($0080)

StateInitLo:
    .byte <InitMenu, <InitPlaying, <InitPaused, <InitGameOver

StateInitHi:
    .byte >InitMenu, >InitPlaying, >InitPaused, >InitGameOver
```

<CodeRunner 
  system="commodore-64"
  title="Advanced Integration: Game Framework"
  code="; Advanced integration example: Complete game framework
; Demonstrates professional programming patterns

GameFramework:
    JSR InitFramework
    JSR MainGameLoop
    RTS

InitFramework:
    ; Initialize all subsystems
    JSR InitGraphicsEngine
    JSR InitAudioEngine
    JSR InitInputSystem
    JSR InitGameLogic
    RTS

InitGraphicsEngine:
    ; Setup advanced graphics
    LDA $D011
    ORA #%00100000  ; Enable bitmap
    STA $D011
    
    ; Initialize sprite system
    LDA #%11111111  ; Enable all sprites
    STA $D015
    
    ; Setup sprite data pointers
    LDX #$00
SpriteSetup:
    TXA
    CLC
    ADC #$80        ; Base sprite pointer
    STA $07F8,X     ; Set sprite pointer
    
    ; Position sprites in formation
    TXA
    ASL
    ASL
    ASL
    ASL
    ASL             ; * 32 for spacing
    CLC
    ADC #50         ; Add left margin
    STA $D000,X     ; Set X position
    STA $D000,X
    
    LDA #100        ; Standard Y position
    STA $D001,X
    
    INX
    INX             ; Skip Y register
    CPX #16         ; 8 sprites * 2 registers
    BNE SpriteSetup
    
    RTS

InitAudioEngine:
    ; Setup advanced audio system
    ; Voice 1: Lead/melody
    LDA #%01000100  ; Medium attack/decay
    STA $D405
    LDA #%11110010  ; Full sustain, medium release
    STA $D406
    
    ; Voice 2: Harmony/effects
    LDA #%00100010  ; Slow attack/decay  
    STA $D40C
    LDA #%10100010  ; Medium sustain/release
    STA $D40D
    
    ; Voice 3: Bass/percussion
    LDA #%11110000  ; Fast attack, no decay
    STA $D413
    LDA #%11110000  ; Full sustain, no release
    STA $D414
    
    ; Set master volume
    LDA #%00001111  ; Full volume
    STA $D418
    
    RTS

InitInputSystem:
    ; Initialize input handling
    LDA #$00
    STA $90         ; Clear input flags
    STA $91         ; Clear input buffer
    RTS

InitGameLogic:
    ; Initialize game state
    LDA #$00        ; Start in menu state
    STA $92         ; Game state
    STA $93         ; Player score
    LDA #$03        ; Player lives
    STA $94
    RTS

MainGameLoop:
    ; Process input
    JSR ProcessInput
    
    ; Update game logic based on state
    JSR UpdateGameState
    
    ; Update graphics
    JSR UpdateGraphics
    
    ; Update audio
    JSR UpdateAudio
    
    ; Synchronize frame rate
    JSR WaitFrame
    
    JMP MainGameLoop

ProcessInput:
    ; Read joystick port 2
    LDA $DC00       ; CIA1 port A
    EOR #$FF        ; Invert bits (active low)
    STA $90         ; Store input state
    RTS

UpdateGameState:
    LDA $92         ; Current game state
    CMP #$00        ; Menu state?
    BEQ UpdateMenu
    CMP #$01        ; Playing state?
    BEQ UpdateGame
    ; Add other states...
    RTS

UpdateMenu:
    ; Handle menu logic
    LDA $90         ; Input state
    AND #%00010000  ; Fire button pressed?
    BEQ MenuEnd
    
    ; Start game
    LDA #$01        ; Change to playing state
    STA $92
    JSR StartGame
    
MenuEnd:
    RTS

UpdateGame:
    ; Handle game logic
    JSR UpdatePlayer
    JSR UpdateEnemies
    JSR CheckCollisions
    RTS

UpdatePlayer:
    ; Player movement based on input
    LDA $90         ; Input state
    AND #%00000001  ; Up pressed?
    BEQ CheckDown
    
    ; Move player up
    LDA $D001       ; Player Y (sprite 0)
    SEC
    SBC #$02        ; Move up 2 pixels
    CMP #50         ; Top boundary
    BCC CheckDown
    STA $D001
    
CheckDown:
    LDA $90
    AND #%00000010  ; Down pressed?
    BEQ CheckLeft
    
    ; Move player down
    LDA $D001
    CLC
    ADC #$02        ; Move down 2 pixels
    CMP #200        ; Bottom boundary
    BCS CheckLeft
    STA $D001
    
CheckLeft:
    LDA $90
    AND #%00000100  ; Left pressed?
    BEQ CheckRight
    
    ; Move player left
    LDA $D000       ; Player X
    SEC
    SBC #$02
    CMP #24         ; Left boundary
    BCC CheckRight
    STA $D000
    
CheckRight:
    LDA $90
    AND #%00001000  ; Right pressed?
    BEQ PlayerEnd
    
    ; Move player right
    LDA $D000
    CLC
    ADC #$02
    CMP #320        ; Right boundary (need 16-bit check in real code)
    BCS PlayerEnd
    STA $D000
    
PlayerEnd:
    RTS

UpdateEnemies:
    ; Simple enemy AI
    LDX #$02        ; Start with sprite 1 (enemy)
EnemyLoop:
    ; Move enemy toward player
    LDA $D000       ; Player X
    CMP $D000,X     ; Enemy X
    BCC MoveEnemyLeft
    BEQ EnemyYCheck
    
    ; Move enemy right
    INC $D000,X
    JMP EnemyYCheck
    
MoveEnemyLeft:
    DEC $D000,X
    
EnemyYCheck:
    ; Y movement
    LDA $D001       ; Player Y
    CMP $D001,X     ; Enemy Y
    BCC MoveEnemyUp
    BEQ NextEnemy
    
    ; Move enemy down
    INC $D001,X
    JMP NextEnemy
    
MoveEnemyUp:
    DEC $D001,X
    
NextEnemy:
    INX
    INX             ; Skip to next sprite (X,Y pairs)
    CPX #8          ; Check 3 enemies (sprites 1,2,3)
    BNE EnemyLoop
    RTS

CheckCollisions:
    ; Check sprite collisions
    LDA $D01E       ; Collision register
    AND #%00000111  ; Check player vs enemies
    BEQ NoCollision
    
    ; Collision detected
    DEC $94         ; Lose a life
    LDA $94
    BNE ResetPosition
    
    ; Game over
    LDA #$02        ; Game over state
    STA $92
    
ResetPosition:
    ; Reset player position
    LDA #160        ; Center X
    STA $D000
    LDA #180        ; Bottom Y
    STA $D001
    
    ; Clear collision register
    LDA $D01E       ; Clear by reading
    
NoCollision:
    RTS

UpdateGraphics:
    ; Update visual effects based on game state
    LDA $92         ; Game state
    CMP #$00        ; Menu?
    BEQ DrawMenu
    CMP #$01        ; Playing?
    BEQ DrawGame
    ; Add other states...
    RTS

DrawMenu:
    ; Draw menu graphics
    LDA #$01        ; White
    STA $D027       ; Player sprite colour
    RTS

DrawGame:
    ; Draw game graphics
    LDA #$0E        ; Light blue
    STA $D027       ; Player colour
    LDA #$02        ; Red
    STA $D028       ; Enemy colors
    STA $D029
    STA $D02A
    RTS

UpdateAudio:
    ; Audio based on game state
    LDA $92
    CMP #$01        ; Playing state?
    BEQ PlayGameMusic
    RTS

PlayGameMusic:
    ; Simple background music
    LDA $95         ; Music counter
    AND #%00111111  ; 64-frame cycle
    BNE MusicEnd
    
    ; Play note
    LDA #$40        ; Frequency
    STA $D400
    LDA #$80
    STA $D401
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
MusicEnd:
    INC $95         ; Advance music counter
    RTS

StartGame:
    ; Initialize game session
    LDA #160        ; Center player
    STA $D000
    LDA #180
    STA $D001
    
    ; Position enemies
    LDA #50
    STA $D002       ; Enemy 1 X
    LDA #50
    STA $D003       ; Enemy 1 Y
    
    LDA #270
    STA $D004       ; Enemy 2 X
    LDA #100
    STA $D005       ; Enemy 2 Y
    
    RTS

WaitFrame:
    ; Simple frame synchronization
    LDY #$60
FrameDelay:
    DEY
    BNE FrameDelay
    RTS

; Start the game framework
JSR GameFramework"
  language="assembly"
/>

## Performance Optimization Integration

### Memory Access Optimization

```text
; High-performance graphics update using optimised patterns
FastGraphicsUpdate:
    ; Use zero page for frequently accessed variables
    SpriteXPos = $80
    SpriteYPos = $81
    FrameCounter = $82
    
    ; Unrolled loops for critical operations
    LDX #$00
    LDA SineTable,X
    STA $D000       ; Sprite 0 X
    LDA SineTable+64,X
    STA $D001       ; Sprite 0 Y
    
    INX
    LDA SineTable,X
    STA $D002       ; Sprite 1 X
    LDA SineTable+64,X
    STA $D003       ; Sprite 1 Y
    
    ; Continue pattern for all 8 sprites...
    
    RTS

; Optimized audio processing
FastAudioUpdate:
    ; Direct register access for time-critical audio
    LDA NoteFreqLo,Y
    STA $D400
    LDA NoteFreqHi,Y
    STA $D401
    LDA #%00100001  ; Gate trigger
    STA $D404
    
    RTS
```

### Interrupt Optimization

```text
; Minimal interrupt handler for maximum performance
FastIRQ:
    ; Only save registers that are modified
    PHA
    
    ; Single critical update
    LDA RasterColor
    STA $D021
    INC RasterColor
    
    ; Acknowledge interrupt
    LDA #$01
    STA $D019
    
    PLA
    RTI

; Double-buffered updates for smooth animation
DoubleBufferUpdate:
    ; Check which buffer is active
    LDA ActiveBuffer
    BEQ UpdateBuffer1
    
UpdateBuffer2:
    ; Update buffer 2 while buffer 1 displays
    JSR UpdateGraphicsBuffer2
    JSR SwapToBuffer2
    RTS
    
UpdateBuffer1:
    ; Update buffer 1 while buffer 2 displays
    JSR UpdateGraphicsBuffer1
    JSR SwapToBuffer1
    RTS
```

## Final Integration Exercise

Create a comprehensive demonstration that showcases all Phase 1 concepts working together in a sophisticated application.

<CodeRunner 
  system="commodore-64"
  title="Final Integration Exercise - Complete Multimedia Application"
  code="; Final Phase 1 integration exercise
; Complete multimedia application demonstrating all concepts

MultimediaDemo:
    JSR InitializeSystem
    JSR ExecuteApplication
    RTS

InitializeSystem:
    ; Complete system initialization
    JSR InitCPU
    JSR InitMemory
    JSR InitGraphics
    JSR InitAudio
    JSR InitInput
    JSR InitState
    RTS

InitCPU:
    ; Setup CPU state
    SEI             ; Disable interrupts
    CLD             ; Clear decimal mode
    LDX #$FF
    TXS             ; Reset stack
    RTS

InitMemory:
    ; Initialize memory management
    LDA #$00
    STA $80         ; Clear zero page workspace
    STA $81
    STA $82
    STA $83
    STA $84
    STA $85
    STA $86
    STA $87
    RTS

InitGraphics:
    ; Advanced graphics initialization
    ; Enable bitmap mode
    LDA $D011
    ORA #%00100000  ; Set bitmap mode
    STA $D011
    
    ; Clear bitmap memory
    LDX #$00
    LDA #$00
ClearBitmapMem:
    STA $2000,X
    STA $2100,X
    STA $2200,X
    STA $2300,X
    INX
    BNE ClearBitmapMem
    
    ; Setup sprite system
    LDA #%11111111  ; Enable all 8 sprites
    STA $D015
    
    ; Initialize sprite pointers
    LDX #$00
InitSprites:
    TXA
    CLC
    ADC #$80        ; Base sprite data
    STA $07F8,X     ; Set sprite pointer
    
    ; Set initial positions in circle formation
    TXA
    ASL
    ASL
    ASL             ; * 8 for angle steps
    TAY
    LDA CircleX,Y
    STA $D000,X     ; Set X position
    LDA CircleY,Y
    STA $D001,X     ; Set Y position
    
    ; Set colors
    TXA
    LSR             ; Divide by 2 for colour cycling
    AND #$0F        ; Keep in colour range
    STA $D027,X     ; Set sprite colour
    
    INX
    INX             ; Skip Y register
    CPX #16         ; 8 sprites * 2 registers
    BNE InitSprites
    
    RTS

InitAudio:
    ; Comprehensive audio setup
    ; Voice 1: Melody
    LDA #%01000100  ; Medium attack/decay
    STA $D405
    LDA #%11110010  ; Full sustain, medium release
    STA $D406
    
    ; Voice 2: Harmony
    LDA #%00100010  ; Slow attack/decay
    STA $D40C
    LDA #%10100010  ; Medium sustain/release
    STA $D40D
    
    ; Voice 3: Bass
    LDA #%11110000  ; Fast attack, no decay
    STA $D413
    LDA #%11110000  ; Full sustain, no release
    STA $D414
    
    ; Setup filter
    LDA #%11100000  ; All voices to filter
    STA $D417
    LDA #%00010111  ; Low-pass + full volume
    STA $D418
    
    RTS

InitInput:
    ; Input system initialization
    LDA #$00
    STA InputState  ; Clear input state
    STA InputChanged ; Clear input change flags
    RTS

InitState:
    ; Application state initialization
    LDA #$00
    STA AnimFrame   ; Animation frame counter
    STA MusicFrame  ; Music sequencer frame
    STA ColorCycle  ; Color cycling counter
    CLI             ; Re-enable interrupts
    RTS

ExecuteApplication:
    ; Main application loop
MainLoop:
    JSR UpdateAnimation
    JSR UpdateAudio
    JSR UpdateGraphics
    JSR UpdateInput
    JSR SynchronizeFrame
    JMP MainLoop

UpdateAnimation:
    ; Complex sprite animation
    LDX #$00        ; Sprite counter
AnimateSprites:
    ; Calculate new positions based on animation frame
    LDA AnimFrame
    CLC
    ADC #$10        ; Phase offset per sprite
    AND #$FF        ; Keep in range
    TAY
    
    ; Update X position
    LDA CircleX,Y
    CLC
    ADC #160        ; Center on screen
    STA $D000,X
    
    ; Update Y position  
    LDA CircleY,Y
    CLC
    ADC #100        ; Center on screen
    STA $D001,X
    
    ; Next sprite
    INX
    INX             ; Skip Y register
    CPX #16         ; All 8 sprites
    BNE AnimateSprites
    
    ; Advance animation
    INC AnimFrame
    RTS

UpdateAudio:
    ; Musical sequencer
    LDX MusicFrame
    
    ; Voice 1: Melody
    LDA MelodyNotes,X
    CMP #$FF        ; End of sequence?
    BEQ ResetMusic
    
    TAY
    LDA FreqTableLo,Y
    STA $D400
    LDA FreqTableHi,Y
    STA $D401
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Voice 2: Harmony (third above)
    LDA MelodyNotes,X
    CLC
    ADC #$02        ; Third interval
    AND #$0F        ; Keep in range
    TAY
    LDA FreqTableLo,Y
    STA $D407
    LDA FreqTableHi,Y
    STA $D408
    LDA #%01000001  ; Pulse + Gate
    STA $D40B
    
    ; Advance music
    INC MusicFrame
    RTS

ResetMusic:
    LDA #$00
    STA MusicFrame
    RTS

UpdateGraphics:
    ; Dynamic bitmap graphics
    LDA AnimFrame
    LSR
    LSR             ; Slow down bitmap animation
    TAX
    
    ; Create animated pattern
    LDA SineWave,X
    STA $2000       ; Update bitmap
    LDA SineWave+64,X
    STA $2140       ; Different area
    
    ; Color cycling
    INC ColorCycle
    LDA ColorCycle
    LSR
    LSR
    LSR             ; Slow colour change
    AND #$0F        ; Keep in colour range
    ASL
    ASL
    ASL
    ASL             ; Shift to upper nibble
    ORA #$00        ; Black background
    STA $0400       ; Update first colour block
    
    RTS

UpdateInput:
    ; Process input (placeholder for joystick reading)
    LDA $DC00       ; Read joystick port 2
    EOR #$FF        ; Invert (active low)
    STA InputState
    
    ; Process input changes
    AND #%00010000  ; Fire button
    BEQ NoFire
    
    ; Fire button pressed - change effect
    LDA $D016
    EOR #%00010000  ; Toggle multicolor mode
    STA $D016
    
NoFire:
    RTS

SynchronizeFrame:
    ; Frame rate synchronization
    LDY #$80
SyncLoop:
    DEY
    BNE SyncLoop
    RTS

; Data tables
CircleX:
    .byte 160, 184, 203, 214, 214, 203, 184, 160
    .byte 136, 117, 106, 106, 117, 136, 160, 184

CircleY:
    .byte 100, 117, 136, 160, 184, 203, 214, 214
    .byte 203, 184, 160, 136, 117, 100, 106, 106

SineWave:
    .byte $80, $83, $86, $89, $8C, $8F, $92, $95
    .byte $98, $9C, $9F, $A2, $A5, $A8, $AB, $AE
    .byte $B0, $B3, $B6, $B9, $BC, $BF, $C1, $C4
    .byte $C7, $C9, $CC, $CE, $D1, $D3, $D5, $D8
    .byte $DA, $DC, $DE, $E0, $E2, $E4, $E6, $E8
    .byte $EA, $EC, $ED, $EF, $F0, $F2, $F3, $F5
    .byte $F6, $F7, $F8, $F9, $FA, $FB, $FC, $FC
    .byte $FD, $FD, $FE, $FE, $FE, $FF, $FF, $FF

FreqTableLo:
    .byte $20, $C4, $82, $B4, $18, $D6, $D8, $40
    .byte $40, $88, $04, $68, $30, $AC, $B0, $80

FreqTableHi:
    .byte $48, $50, $5A, $60, $6E, $7C, $8C, $90
    .byte $90, $A0, $B4, $C0, $DC, $F8, $18, $21

MelodyNotes:
    .byte 0, 2, 4, 5, 7, 5, 4, 2, 0, 7, 5, 4, 2, 0, $FF

; Variables
InputState:     .byte 0
InputChanged:   .byte 0
AnimFrame:      .byte 0
MusicFrame:     .byte 0
ColorCycle:     .byte 0

; Execute the multimedia demonstration
JSR MultimediaDemo"
  language="assembly"
/>

## Phase 1 Competency Assessment

You have now completed comprehensive training in foundational C64 assembly programming. You can confidently:

### Technical Competencies
- **Write efficient 6502 assembly code** using all instructions and addressing modes
- **Manage memory effectively** with zero page optimisation and stack programming
- **Control program flow** with subroutines, branching, and interrupt handling
- **Program the VIC-II graphics chip** for text, characters, sprites, and bitmap graphics
- **Program the SID sound chip** for music, sound effects, and advanced synthesis
- **Integrate multiple subsystems** into complete, professional applications
- **Debug and optimise code** using systematic approaches and best practices

### Professional Skills
- **Plan and organise complex projects** using systematic development approaches
- **Write maintainable, documented code** following professional standards
- **Apply performance optimisation techniques** for memory and speed efficiency
- **Understand system architecture** and how components interact
- **Build complete applications** that demonstrate real-world programming capability

## Ready for Tier 2: Data Storage and Memory Operations

Phase 1 Tier 1 has established your **foundational understanding** of C64 assembly programming. You're now perfectly prepared for **Tier 2**, which will build directly on everything you've learned:

### **What Tier 2 Will Add to Your Skills**

**Building on Your Number Quest Project:**
- **Zero Page Mastery** - Learn to use the fastest memory locations for critical game data
- **Advanced Data Storage** - Implement efficient storage for scores, levels, and game state
- **Memory-Based Input Processing** - Handle keyboard input directly at the hardware level
- **Interactive Data Validation** - Create robust input validation for your number guessing game

### **Tier 2 Learning Progression** 
- **Lessons 1-8**: Zero Page Mastery - Understanding C64's fastest memory locations
- **Lessons 9-16**: Data Manipulation - Moving and processing data efficiently in memory
- **Lessons 17-24**: Input Processing - Reading keyboard input without BASIC overhead
- **Lessons 25-32**: Number Quest Data Systems - Complete game state management

### **Your Foundation is Perfect for Advanced Concepts**

The skills you've mastered in Tier 1 provide exactly what you need for Tier 2:
- ✅ **Complete 6502 knowledge** - Ready for advanced memory management
- ✅ **Professional development practices** - Essential for complex data systems
- ✅ **Interrupt handling experience** - Critical for responsive input processing
- ✅ **System integration skills** - Necessary for coordinating data and graphics
- ✅ **Number Quest foundation** - Your project is ready for sophisticated enhancements

### **The Natural Progression**

Your progression from Tier 1 to Tier 2 is seamless:
- **From basic assembly** → **Advanced memory techniques**
- **From simple programs** → **Data-driven applications**  
- **From hardware basics** → **Sophisticated I/O programming**
- **From individual concepts** → **Integrated data systems**

**Tier 2 will feel like a natural evolution of your existing skills, not a difficult jump!**

## What You've Accomplished

In Phase 1, you've mastered the essential foundation of retro computing programming:

- **32 comprehensive lessons** covering all fundamental aspects of C64 development
- **Complete understanding** of 6502 assembly language and C64 architecture  
- **Professional programming practices** that apply to modern development
- **Integrated system programming** combining CPU, graphics, and audio
- **Real-world application development** using industry-standard patterns

## Fun Fact

The skills you've developed in Phase 1 represent the same foundational knowledge that professional C64 developers used to create legendary games, demos, and applications in the 1980s. The programming patterns, optimisation techniques, and system integration approaches you've learned are timeless principles that apply to all levels of software development - from embedded systems to modern game engines. You've not just learned retro programming; you've mastered the fundamental disciplines that underlie all computer programming. The systematic thinking, performance optimisation, and multi-subsystem integration skills you've developed will serve you well in any programming context, whether you're working on vintage computers, modern applications, or cutting-edge technology. You now possess the foundational competency to tackle any programming challenge with confidence and professional skill!

Congratulations on completing Phase 1 of your Code Like It's 198x journey!