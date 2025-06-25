---
title: "Input Response Programming"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 24
description: "Learn to create immediate, responsive interactions with controller input. Build systems that react instantly to player actions, creating smooth and engaging gameplay experiences."
learning_objectives:
  - "Create immediate response systems for controller input"
  - "Implement smooth character movement and control"
  - "Build responsive menu navigation systems"
  - "Handle input timing and frame-perfect responses"
  - "Design intuitive user interaction patterns"
concepts:
  - "Real-time input processing and response"
  - "Frame-based movement and timing systems"
  - "State-driven interaction design"
  - "Input buffering and responsiveness"
  - "User experience through programming"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 24
---

# Lesson 24: Input Response Programming

Learn to create systems that respond immediately and smoothly to player input! This lesson teaches you how to build responsive interactions for your Sprite Symphony game, translating button presses into satisfying musical notes and visual feedback.

## Immediate Input Response Patterns

The key to responsive gameplay is processing input and updating the game state within the same frame:

```assembly
; Immediate response pattern
GameLoop:
    JSR ProcessInput      ; Read controller
    JSR UpdateGameState   ; Apply changes immediately
    JSR WaitForNMI       ; Wait for graphics update
    JMP GameLoop         ; Repeat every frame

ProcessInput:
    JSR ReadController
    STA ControllerState
    
    ; Immediate movement response
    AND #%00001000       ; Up pressed?
    BEQ MoveUp
    AND #%00000100       ; Down pressed?
    BEQ MoveDown
    AND #%00000010       ; Left pressed?
    BEQ MoveLeft
    AND #%00000001       ; Right pressed?
    BEQ MoveRight
    RTS

MoveUp:
    LDA PlayerY
    SEC
    SBC #$02             ; Move 2 pixels up
    STA PlayerY
    JSR UpdatePlayerSprite
    RTS
    
MoveDown:
    LDA PlayerY
    CLC
    ADC #$02             ; Move 2 pixels down
    STA PlayerY
    JSR UpdatePlayerSprite
    RTS
```

**Immediate Movement Response:**

```assembly
; Immediate character movement system
Main:
    JSR ProcessMovement
    JSR UpdateGraphics
    JMP Main

ProcessMovement:
    JSR ReadController
    STA Buttons
    
    ; Check all directions simultaneously
    LDA Buttons
    AND #%00001000       ; Up
    BEQ CheckUp
    JMP CheckDown
    
CheckUp:
    LDA PlayerY
    SEC
    SBC #$02             ; Move up
    CMP #$20             ; Top boundary
    BCC CheckDown
    STA PlayerY
    
CheckDown:
    LDA Buttons
    AND #%00000100       ; Down
    BEQ CheckDownMove
    JMP CheckLeft
    
CheckDownMove:
    LDA PlayerY
    CLC
    ADC #$02             ; Move down
    CMP #$D0             ; Bottom boundary
    BCS CheckLeft
    STA PlayerY
    
CheckLeft:
    LDA Buttons
    AND #%00000010       ; Left
    BEQ CheckLeftMove
    JMP CheckRight
    
CheckLeftMove:
    LDA PlayerX
    SEC
    SBC #$02             ; Move left
    CMP #$08             ; Left boundary
    BCC CheckRight
    STA PlayerX
    
CheckRight:
    LDA Buttons
    AND #%00000001       ; Right
    BEQ CheckRightMove
    JMP MovementDone
    
CheckRightMove:
    LDA PlayerX
    CLC
    ADC #$02             ; Move right
    CMP #$F0             ; Right boundary
    BCS MovementDone
    STA PlayerX
    
MovementDone:
    RTS

UpdateGraphics:
    ; Update sprite position immediately
    LDA PlayerX
    STA SpriteData+3     ; X position
    LDA PlayerY
    STA SpriteData+0     ; Y position
    RTS

ReadController:
    ; Simplified controller reading
    LDA #$FE             ; Simulate right pressed
    RTS

; Variables
PlayerX: .byte $80
PlayerY: .byte $80
Buttons: .byte $00
SpriteData: .byte $80, $01, $00, $80
```

## Smooth Character Movement

Create natural-feeling movement by updating position every frame based on held buttons:

```assembly
; Smooth movement with acceleration
UpdatePlayerMovement:
    ; Reset velocity each frame
    LDA #$00
    STA VelocityX
    STA VelocityY
    
    ; Check held directions
    LDA ControllerState
    AND #%00001000       ; Up held?
    BEQ AddUpVelocity
    JMP CheckDownVelocity
    
AddUpVelocity:
    LDA VelocityY
    SEC
    SBC #$02             ; Upward velocity
    STA VelocityY
    
CheckDownVelocity:
    LDA ControllerState
    AND #%00000100       ; Down held?
    BEQ AddDownVelocity
    JMP CheckLeftVelocity
    
AddDownVelocity:
    LDA VelocityY
    CLC
    ADC #$02             ; Downward velocity
    STA VelocityY
    
CheckLeftVelocity:
    LDA ControllerState
    AND #%00000010       ; Left held?
    BEQ AddLeftVelocity
    JMP CheckRightVelocity
    
AddLeftVelocity:
    LDA VelocityX
    SEC
    SBC #$02             ; Leftward velocity
    STA VelocityX
    
CheckRightVelocity:
    LDA ControllerState
    AND #%00000001       ; Right held?
    BEQ AddRightVelocity
    JMP ApplyVelocity
    
AddRightVelocity:
    LDA VelocityX
    CLC
    ADC #$02             ; Rightward velocity
    STA VelocityX
    
ApplyVelocity:
    ; Apply X velocity with bounds checking
    LDA PlayerX
    CLC
    ADC VelocityX
    CMP #$08             ; Left boundary
    BCC SkipXUpdate
    CMP #$F0             ; Right boundary
    BCS SkipXUpdate
    STA PlayerX
    
SkipXUpdate:
    ; Apply Y velocity with bounds checking
    LDA PlayerY
    CLC
    ADC VelocityY
    CMP #$20             ; Top boundary
    BCC SkipYUpdate
    CMP #$D0             ; Bottom boundary
    BCS SkipYUpdate
    STA PlayerY
    
SkipYUpdate:
    RTS

; Variables for smooth movement
VelocityX: .byte $00
VelocityY: .byte $00
```

**Smooth Movement with Velocity:**

```assembly
; Smooth character movement system
Main:
    JSR UpdateMovement
    JSR UpdateDisplay
    JMP Main

UpdateMovement:
    JSR ReadController
    STA Buttons
    
    ; Reset velocity
    LDA #$00
    STA VelX
    STA VelY
    
    ; Build velocity based on input
    LDA Buttons
    AND #%00001000       ; Up
    BEQ AddUpVel
    JMP CheckDown
AddUpVel:
    LDA VelY
    SEC
    SBC #$01             ; Slow smooth movement
    STA VelY
    
CheckDown:
    LDA Buttons
    AND #%00000100       ; Down
    BEQ AddDownVel
    JMP CheckLeft
AddDownVel:
    LDA VelY
    CLC
    ADC #$01
    STA VelY
    
CheckLeft:
    LDA Buttons
    AND #%00000010       ; Left
    BEQ AddLeftVel
    JMP CheckRight
AddLeftVel:
    LDA VelX
    SEC
    SBC #$01
    STA VelX
    
CheckRight:
    LDA Buttons
    AND #%00000001       ; Right
    BEQ AddRightVel
    JMP ApplyMovement
AddRightVel:
    LDA VelX
    CLC
    ADC #$01
    STA VelX
    
ApplyMovement:
    ; Apply X movement
    LDA PlayerX
    CLC
    ADC VelX
    ; Simple boundary check
    CMP #$F8
    BCS SkipX
    STA PlayerX
    
SkipX:
    ; Apply Y movement
    LDA PlayerY
    CLC
    ADC VelY
    ; Simple boundary check
    CMP #$E0
    BCS SkipY
    STA PlayerY
    
SkipY:
    RTS

UpdateDisplay:
    ; Update sprite
    LDA PlayerX
    STA SpriteData+3
    LDA PlayerY
    STA SpriteData+0
    RTS

ReadController:
    LDA #%11111110       ; Simulate right held
    RTS

; Variables
PlayerX: .byte $80
PlayerY: .byte $80
VelX: .byte $00
VelY: .byte $00
Buttons: .byte $00
SpriteData: .byte $80, $01, $00, $80
```

## Responsive Menu Navigation

Create menu systems that respond immediately to directional input:

```assembly
; Menu navigation system
UpdateMenu:
    JSR DetectNewButtonPresses
    
    ; Check for menu navigation
    LDA NewPresses
    AND #%00001000       ; Up pressed?
    BEQ MenuUp
    AND #%00000100       ; Down pressed?
    BEQ MenuDown
    AND #%10000000       ; A pressed?
    BEQ MenuSelect
    AND #%01000000       ; B pressed?
    BEQ MenuCancel
    RTS

MenuUp:
    LDA MenuIndex
    BEQ MenuUpWrap       ; At top, wrap to bottom
    DEC MenuIndex
    JSR UpdateMenuCursor
    JSR PlayMenuSound
    RTS
    
MenuUpWrap:
    LDA MenuMaxItems
    SEC
    SBC #$01             ; Last item index
    STA MenuIndex
    JSR UpdateMenuCursor
    JSR PlayMenuSound
    RTS

MenuDown:
    LDA MenuIndex
    CMP MenuMaxItems
    BEQ MenuDownWrap     ; At bottom, wrap to top
    INC MenuIndex
    JSR UpdateMenuCursor
    JSR PlayMenuSound
    RTS
    
MenuDownWrap:
    LDA #$00
    STA MenuIndex
    JSR UpdateMenuCursor
    JSR PlayMenuSound
    RTS

MenuSelect:
    ; Execute selected menu item
    LDX MenuIndex
    JSR ExecuteMenuItem
    JSR PlaySelectSound
    RTS

MenuCancel:
    JSR ExitMenu
    JSR PlayCancelSound
    RTS

UpdateMenuCursor:
    ; Position cursor sprite based on menu index
    LDA MenuIndex
    ASL                  ; Multiply by 2
    ASL                  ; Multiply by 4 (16 pixels apart)
    ASL
    ASL
    CLC
    ADC #$40             ; Base Y position
    STA CursorY
    
    ; Update cursor sprite
    LDA CursorY
    STA SpriteData+0     ; Cursor Y position
    LDA #$10             ; Cursor X position
    STA SpriteData+3
    LDA #$20             ; Cursor tile
    STA SpriteData+1
    RTS

; Menu variables
MenuIndex: .byte $00     ; Current selection
MenuMaxItems: .byte $04  ; Number of menu items
CursorY: .byte $40       ; Cursor Y position
```

**Responsive Menu Navigation:**

```assembly
; Responsive menu system with cursor
Main:
    JSR UpdateMenu
    JSR UpdateDisplay
    JMP Main

UpdateMenu:
    JSR ReadController
    JSR DetectNewPresses
    
    ; Check menu navigation
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ MenuUp
    AND #%00000100       ; Down
    BEQ MenuDown
    AND #%10000000       ; A button
    BEQ MenuSelect
    RTS

MenuUp:
    LDA MenuPos
    BEQ WrapToBottom
    DEC MenuPos
    JMP UpdateCursor
    
WrapToBottom:
    LDA #$03             ; 4 items (0-3)
    STA MenuPos
    JMP UpdateCursor

MenuDown:
    LDA MenuPos
    CMP #$03             ; Last item
    BEQ WrapToTop
    INC MenuPos
    JMP UpdateCursor
    
WrapToTop:
    LDA #$00
    STA MenuPos
    
UpdateCursor:
    ; Calculate cursor Y position
    LDA MenuPos
    ASL                  ; * 2
    ASL                  ; * 4  
    ASL                  ; * 8
    ASL                  ; * 16 (16 pixels between items)
    CLC
    ADC #$60             ; Base Y position
    STA CursorY
    RTS

MenuSelect:
    ; Handle menu selection
    LDA MenuPos
    ; Process selection based on MenuPos value
    ; (Implementation would depend on specific menu)
    RTS

DetectNewPresses:
    ; Save previous buttons
    LDA CurrentButtons
    STA PrevButtons
    
    ; Read current buttons
    JSR ReadController
    STA CurrentButtons
    
    ; Calculate new presses (current AND NOT previous)
    EOR PrevButtons      ; XOR to find changes
    AND CurrentButtons   ; AND with current to get new presses
    STA NewPresses
    RTS

UpdateDisplay:
    ; Update cursor sprite
    LDA CursorY
    STA SpriteData+0     ; Y position
    LDA #$20             ; X position
    STA SpriteData+3
    LDA #$7E             ; Cursor tile (arrow)
    STA SpriteData+1
    LDA #$00             ; Attributes
    STA SpriteData+2
    RTS

ReadController:
    LDA FrameCount
    INC FrameCount
    AND #$40             ; Simulate up press every 64 frames
    BEQ SimulateUp
    LDA #$FF             ; No buttons
    RTS
SimulateUp:
    LDA #%11110111       ; Up pressed
    RTS

; Variables
MenuPos: .byte $00
CursorY: .byte $60
CurrentButtons: .byte $FF
PrevButtons: .byte $FF
NewPresses: .byte $00
FrameCount: .byte $00
SpriteData: .byte $60, $7E, $00, $20
```

## Input Buffering for Responsiveness

Buffer inputs to ensure no button presses are missed:

```assembly
; Input buffer system for frame-perfect timing
InputBuffer:
    .byte $00, $00, $00, $00  ; 4-frame buffer

UpdateInputBuffer:
    ; Shift buffer left
    LDX #$02
ShiftLoop:
    LDA InputBuffer+1,X
    STA InputBuffer,X
    DEX
    BPL ShiftLoop
    
    ; Add new input to end
    JSR ReadController
    STA InputBuffer+3
    
    ; Check for buffered inputs
    JSR ProcessBufferedInputs
    RTS

ProcessBufferedInputs:
    ; Look for new button presses in buffer
    LDX #$03             ; Start from most recent
BufferLoop:
    LDA InputBuffer,X
    AND #%10000000       ; Check A button
    BEQ CheckBufferedA
    DEX
    BPL BufferLoop
    RTS
    
CheckBufferedA:
    ; Verify this is a new press (not held)
    CPX #$00
    BEQ ExecuteA         ; Most recent frame
    LDA InputBuffer-1,X  ; Previous frame
    AND #%10000000
    BNE ExecuteA         ; Was not pressed before
    DEX
    BPL BufferLoop
    RTS
    
ExecuteA:
    ; Execute A button action
    JSR HandleAButton
    
    ; Clear the buffer entry to prevent repeat
    LDA InputBuffer,X
    AND #%01111111       ; Clear A button bit
    STA InputBuffer,X
    RTS

HandleAButton:
    ; Respond to A button press
    INC ActionCounter
    RTS

ActionCounter: .byte $00
```

## Variable Speed Movement

Create different movement speeds based on context:

```assembly
; Context-sensitive movement speeds
UpdateMovementSpeed:
    ; Determine movement speed based on game state
    LDA GameState
    CMP #$00             ; Normal gameplay
    BEQ NormalSpeed
    CMP #$01             ; Precision mode
    BEQ PrecisionSpeed
    CMP #$02             ; Fast mode
    BEQ FastSpeed
    RTS

NormalSpeed:
    LDA #$02             ; 2 pixels per frame
    STA MovementSpeed
    RTS
    
PrecisionSpeed:
    LDA #$01             ; 1 pixel per frame
    STA MovementSpeed
    RTS
    
FastSpeed:
    LDA #$04             ; 4 pixels per frame
    STA MovementSpeed
    RTS

ApplyMovementWithSpeed:
    ; Use current movement speed for all directions
    LDA ControllerState
    AND #%00000001       ; Right pressed?
    BEQ MoveRight
    RTS

MoveRight:
    LDA PlayerX
    CLC
    ADC MovementSpeed    ; Use variable speed
    CMP #$F0             ; Boundary check
    BCS SkipMove
    STA PlayerX
    
SkipMove:
    RTS

; Variables
GameState: .byte $00     ; Current game context
MovementSpeed: .byte $02 ; Current movement speed
```

**Variable Speed Movement System:**

```assembly
; Movement system with variable speeds
Main:
    JSR UpdateGameState
    JSR ProcessMovement
    JSR UpdateGraphics
    JMP Main

UpdateGameState:
    ; Simple state switching for demo
    INC StateTimer
    LDA StateTimer
    CMP #$3C             ; 60 frames
    BNE KeepState
    
    LDA #$00
    STA StateTimer
    INC GameMode
    LDA GameMode
    CMP #$03
    BNE KeepState
    LDA #$00
    STA GameMode
    
KeepState:
    ; Set movement speed based on mode
    LDA GameMode
    CMP #$00
    BEQ SlowMode
    CMP #$01
    BEQ NormalMode
    CMP #$02
    BEQ FastMode
    RTS

SlowMode:
    LDA #$01             ; 1 pixel per frame
    STA MoveSpeed
    RTS
    
NormalMode:
    LDA #$02             ; 2 pixels per frame
    STA MoveSpeed
    RTS
    
FastMode:
    LDA #$04             ; 4 pixels per frame
    STA MoveSpeed
    RTS

ProcessMovement:
    JSR ReadController
    STA Buttons
    
    ; Apply movement with current speed
    LDA Buttons
    AND #%00000001       ; Right
    BEQ MoveRight
    AND #%00000010       ; Left
    BEQ MoveLeft
    RTS

MoveRight:
    LDA PlayerX
    CLC
    ADC MoveSpeed        ; Use variable speed
    CMP #$E0             ; Boundary
    BCS SkipRight
    STA PlayerX
SkipRight:
    RTS
    
MoveLeft:
    LDA PlayerX
    SEC
    SBC MoveSpeed        ; Use variable speed
    CMP #$10             ; Boundary
    BCC SkipLeft
    STA PlayerX
SkipLeft:
    RTS

UpdateGraphics:
    ; Update sprite position
    LDA PlayerX
    STA SpriteData+3
    
    ; Visual indicator of current mode
    LDA GameMode
    CLC
    ADC #$41             ; Tiles A, B, C
    STA SpriteData+1     ; Different tile per mode
    RTS

ReadController:
    LDA #%11111110       ; Simulate right held
    RTS

; Variables
PlayerX: .byte $80
GameMode: .byte $00
MoveSpeed: .byte $02
StateTimer: .byte $00
Buttons: .byte $00
SpriteData: .byte $80, $41, $00, $80
```

## Practice Exercise

Create a complete responsive input system that demonstrates all concepts:

1. Implement immediate movement response
2. Add smooth acceleration and deceleration  
3. Create a menu system with cursor
4. Add input buffering for frame-perfect timing
5. Include variable movement speeds
6. Add audio feedback for all interactions

**Practice: Complete Responsive Input System:**

```assembly
; Complete responsive input demonstration
Main:
    JSR InitSystem
    
GameLoop:
    JSR ProcessInput
    JSR UpdateGameLogic
    JSR UpdateGraphics
    JSR UpdateAudio
    JMP GameLoop

InitSystem:
    ; Initialize all game variables
    LDA #$80
    STA PlayerX
    STA PlayerY
    LDA #$00
    STA VelocityX
    STA VelocityY
    STA MenuActive
    STA SoundTimer
    RTS

ProcessInput:
    ; Read and buffer input
    JSR ReadController
    JSR BufferInput
    JSR DetectNewPresses
    
    ; Route input based on game state
    LDA MenuActive
    BEQ ProcessGameInput
    JSR ProcessMenuInput
    RTS
    
ProcessGameInput:
    ; Check for menu activation
    LDA NewPresses
    AND #%00010000       ; Start button
    BEQ ActivateMenu
    
    ; Process movement
    JSR ProcessMovement
    RTS
    
ActivateMenu:
    LDA #$01
    STA MenuActive
    JSR PlayMenuOpenSound
    RTS

ProcessMenuInput:
    LDA NewPresses
    AND #%00001000       ; Up
    BEQ MenuUp
    AND #%00000100       ; Down
    BEQ MenuDown
    AND #%10000000       ; A
    BEQ MenuSelect
    AND #%01000000       ; B
    BEQ MenuCancel
    RTS

MenuUp:
    LDA MenuIndex
    BEQ WrapUp
    DEC MenuIndex
    JMP MenuMoved
WrapUp:
    LDA #$02
    STA MenuIndex
MenuMoved:
    JSR PlayMenuMoveSound
    RTS

MenuDown:
    LDA MenuIndex
    CMP #$02
    BEQ WrapDown
    INC MenuIndex
    JMP MenuMoveDown
WrapDown:
    LDA #$00
    STA MenuIndex
MenuMoveDown:
    JSR PlayMenuMoveSound
    RTS

MenuSelect:
    JSR PlayMenuSelectSound
    LDA #$00
    STA MenuActive       ; Close menu
    RTS

MenuCancel:
    JSR PlayMenuCancelSound
    LDA #$00
    STA MenuActive       ; Close menu
    RTS

ProcessMovement:
    ; Smooth acceleration-based movement
    JSR ReadController
    STA CurrentInput
    
    ; Process horizontal movement
    LDA CurrentInput
    AND #%00000001       ; Right
    BEQ AccelRight
    AND #%00000010       ; Left
    BEQ AccelLeft
    ; No horizontal input, decelerate
    JSR DecelX
    JMP CheckVertical
    
AccelRight:
    LDA VelocityX
    CLC
    ADC #$01             ; Accelerate right
    CMP #$03             ; Max speed
    BCC StoreVelX
    LDA #$03
StoreVelX:
    STA VelocityX
    JMP CheckVertical
    
AccelLeft:
    LDA VelocityX
    SEC
    SBC #$01             ; Accelerate left
    CMP #$FD             ; Min speed (-3)
    BCS StoreVelX2
    LDA #$FD
StoreVelX2:
    STA VelocityX
    
CheckVertical:
    ; Process vertical movement
    LDA CurrentInput
    AND #%00001000       ; Up
    BEQ AccelUp
    AND #%00000100       ; Down
    BEQ AccelDown
    JSR DecelY
    JMP ApplyMovement
    
AccelUp:
    LDA VelocityY
    SEC
    SBC #$01             ; Accelerate up
    CMP #$FD             ; Min speed (-3)
    BCS StoreVelY
    LDA #$FD
StoreVelY:
    STA VelocityY
    JMP ApplyMovement
    
AccelDown:
    LDA VelocityY
    CLC
    ADC #$01             ; Accelerate down
    CMP #$03             ; Max speed
    BCC StoreVelY2
    LDA #$03
StoreVelY2:
    STA VelocityY
    
ApplyMovement:
    ; Apply velocity to position
    LDA PlayerX
    CLC
    ADC VelocityX
    STA PlayerX
    
    LDA PlayerY
    CLC
    ADC VelocityY
    STA PlayerY
    RTS

DecelX:
    ; Decelerate horizontal velocity
    LDA VelocityX
    BEQ DecelXDone       ; Already stopped
    BMI DecelXNeg        ; Negative velocity
    ; Positive velocity
    DEC VelocityX
    RTS
DecelXNeg:
    INC VelocityX
DecelXDone:
    RTS

DecelY:
    ; Decelerate vertical velocity
    LDA VelocityY
    BEQ DecelYDone
    BMI DecelYNeg
    DEC VelocityY
    RTS
DecelYNeg:
    INC VelocityY
DecelYDone:
    RTS

BufferInput:
    ; Shift input buffer
    LDA InputBuffer+2
    STA InputBuffer+1
    LDA InputBuffer+1
    STA InputBuffer+0
    JSR ReadController
    STA InputBuffer+2
    RTS

DetectNewPresses:
    LDA InputBuffer+2    ; Current
    STA CurrentButtons
    LDA InputBuffer+1    ; Previous
    STA PrevButtons
    
    ; Find new presses
    LDA CurrentButtons
    EOR PrevButtons      ; XOR to find changes
    AND CurrentButtons   ; AND with current
    STA NewPresses
    RTS

UpdateGraphics:
    ; Update player sprite
    LDA PlayerX
    STA SpriteData+3
    LDA PlayerY
    STA SpriteData+0
    
    ; Update menu cursor if active
    LDA MenuActive
    BEQ GraphicsDone
    
    ; Position menu cursor
    LDA MenuIndex
    ASL
    ASL
    ASL                  ; * 8
    CLC
    ADC #$50             ; Base Y
    STA SpriteData+4     ; Menu cursor Y
    LDA #$30
    STA SpriteData+7     ; Menu cursor X
    LDA #$7E             ; Arrow tile
    STA SpriteData+5
    
GraphicsDone:
    RTS

UpdateAudio:
    ; Simple audio feedback system
    LDA SoundTimer
    BEQ AudioDone
    DEC SoundTimer
    
    ; Generate simple tone while timer active
    LDA SoundTimer
    AND #$01
    BEQ AudioDone
    
    ; Play tone (simplified)
    LDA #$08
    STA $4003            ; Set frequency
    
AudioDone:
    RTS

PlayMenuOpenSound:
    LDA #$10
    STA SoundTimer
    RTS

PlayMenuMoveSound:
    LDA #$05
    STA SoundTimer
    RTS

PlayMenuSelectSound:
    LDA #$20
    STA SoundTimer
    RTS

PlayMenuCancelSound:
    LDA #$08
    STA SoundTimer
    RTS

ReadController:
    ; Cycle through different input patterns for demo
    INC InputPattern
    LDA InputPattern
    AND #$1F             ; 32 frame cycle
    CMP #$10
    BCC Pattern1
    CMP #$18
    BCC Pattern2
    LDA #$FF             ; No input
    RTS
Pattern1:
    LDA #%11111110       ; Right
    RTS
Pattern2:
    LDA #%11101111       ; Start
    RTS

; Variables
PlayerX: .byte $80
PlayerY: .byte $80
VelocityX: .byte $00
VelocityY: .byte $00
MenuActive: .byte $00
MenuIndex: .byte $00
CurrentInput: .byte $FF
CurrentButtons: .byte $FF
PrevButtons: .byte $FF
NewPresses: .byte $00
InputBuffer: .byte $FF, $FF, $FF
SoundTimer: .byte $00
InputPattern: .byte $00

; Sprite data
SpriteData: 
    .byte $80, $01, $00, $80  ; Player sprite
    .byte $50, $7E, $00, $30  ; Menu cursor
```

## What You've Learned

In this essential lesson, you've mastered:

- Creating immediate response systems for player input
- Implementing smooth, natural character movement
- Building responsive menu navigation with cursors
- Using input buffering for frame-perfect timing
- Designing variable movement speeds for different contexts
- Adding audio feedback to enhance responsiveness

## Looking Ahead

In the next lesson, you'll learn to control sprite positioning and movement with precision, creating smooth animations and coordinated visual effects that respond perfectly to your input systems!

## Fun Fact

The responsive input systems you've learned were crucial to the success of classic NES games. Super Mario Bros. feels so good to play because it responds to input within a single frame (1/60th of a second), and the acceleration/deceleration physics create natural movement that players intuitively understand. The input buffering techniques you've learned are still used in modern fighting games and rhythm games where frame-perfect timing is essential!