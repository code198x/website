---
title: "Reading Button States"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 23
description: "Learn to read specific button states from the NES controller. Understand button mapping, state checking, and reliable input detection for responsive games."
learning_objectives:
  - "Read individual button states from controller data"
  - "Implement button mapping and state checking logic"
  - "Create reliable button press detection routines"
  - "Handle multiple button combinations"
  - "Build responsive input systems for games"
concepts:
  - "Button bit mapping and masking"
  - "State checking with logical operations"
  - "Button press vs hold detection"
  - "Input debouncing techniques"
  - "Controller state variables"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 23
---

# Lesson 23: Reading Button States

Learn to read specific button states from the NES controller! This lesson teaches you how to interpret controller data to detect individual button presses, creating responsive input systems for your Sprite Symphony musical game.

## NES Controller Button Layout

The NES controller has 8 buttons that are read as a single byte:

```
Bit 7: A Button (rightmost button)
Bit 6: B Button (left of A button)  
Bit 5: Select Button
Bit 4: Start Button
Bit 3: Up Direction
Bit 2: Down Direction
Bit 1: Left Direction
Bit 0: Right Direction
```

Each bit is 0 when pressed, 1 when not pressed (inverted logic).

## Reading Individual Button States

To check if a specific button is pressed, we use bit masking:

```assembly
; Read controller state
JSR ReadController    ; Get controller data in accumulator

; Check if A button is pressed
AND #%10000000       ; Mask bit 7 (A button)
BEQ AButtonPressed   ; Branch if bit is 0 (pressed)

; A button not pressed, continue
JMP CheckOtherButtons

AButtonPressed:
    ; Handle A button press
    LDA #$01
    STA ButtonAState
    ; Add A button response code here
    
CheckOtherButtons:
    ; Continue checking other buttons
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Reading A Button State"
  code="; Read A button state
JSR ReadController
AND #%10000000       ; Check A button (bit 7)
BEQ AButtonPressed
JMP AButtonNotPressed

AButtonPressed:
    LDA #$01
    STA $0200          ; Store pressed state
    JMP ButtonCheckDone
    
AButtonNotPressed:
    LDA #$00
    STA $0200          ; Store not pressed state
    
ButtonCheckDone:
    RTS

ReadController:
    ; Controller reading routine (simplified)
    LDA #$01
    STA $4016          ; Strobe controller
    LDA #$00
    STA $4016
    
    LDX #$08           ; Read 8 bits
ReadLoop:
    LDA $4016          ; Read bit
    LSR A              ; Shift to carry
    ROL ControllerData ; Rotate into result
    DEX
    BNE ReadLoop
    
    LDA ControllerData
    RTS

ControllerData: .byte $00"
  language="assembly"
/>

## Checking Multiple Buttons

You can check multiple buttons efficiently by testing each bit:

```assembly
CheckAllButtons:
    JSR ReadController    ; Get controller state
    STA ControllerState  ; Store for multiple checks
    
    ; Check A button (bit 7)
    AND #%10000000
    BEQ AButtonPressed
    LDA #$00
    STA ButtonA_State
    JMP CheckBButton
    
AButtonPressed:
    LDA #$01
    STA ButtonA_State
    
CheckBButton:
    LDA ControllerState  ; Reload controller state
    AND #%01000000       ; Check B button (bit 6)
    BEQ BButtonPressed
    LDA #$00
    STA ButtonB_State
    JMP CheckStartButton
    
BButtonPressed:
    LDA #$01
    STA ButtonB_State
    
CheckStartButton:
    LDA ControllerState
    AND #%00010000       ; Check Start button (bit 4)
    BEQ StartButtonPressed
    LDA #$00
    STA ButtonStart_State
    JMP ButtonCheckComplete
    
StartButtonPressed:
    LDA #$01
    STA ButtonStart_State
    
ButtonCheckComplete:
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Checking Multiple Buttons"
  code="; Check multiple button states
CheckAllButtons:
    JSR ReadController
    STA ControllerState
    
    ; Check A button
    AND #%10000000
    BEQ APressed
    LDA #$00
    JMP StoreA
APressed:
    LDA #$01
StoreA:
    STA $0200
    
    ; Check B button  
    LDA ControllerState
    AND #%01000000
    BEQ BPressed
    LDA #$00
    JMP StoreB
BPressed:
    LDA #$01
StoreB:
    STA $0201
    
    ; Check directional pad
    LDA ControllerState
    AND #%00001000       ; Up
    BEQ UpPressed
    LDA #$00
    JMP StoreUp
UpPressed:
    LDA #$01
StoreUp:
    STA $0202
    
    RTS

ReadController:
    ; Simplified controller read
    LDA #$55             ; Test pattern
    RTS

ControllerState: .byte $00"
  language="assembly"
/>

## Button Press Detection vs Hold Detection

There's a difference between detecting when a button is pressed vs when it's being held:

```assembly
; Current frame button states
CurrentButtons: .byte $00
; Previous frame button states  
PreviousButtons: .byte $00

DetectButtonPress:
    ; Save previous state
    LDA CurrentButtons
    STA PreviousButtons
    
    ; Read current state
    JSR ReadController
    STA CurrentButtons
    
    ; Detect new button presses (pressed now, not pressed before)
    EOR PreviousButtons   ; XOR with previous
    AND CurrentButtons    ; AND with current (pressed now)
    STA NewButtonPresses  ; Store new presses
    
    ; Check if A was just pressed
    AND #%10000000
    BEQ AJustPressed
    JMP CheckOtherPresses
    
AJustPressed:
    ; Handle A button press (only triggers once)
    JSR HandleAButtonPress
    
CheckOtherPresses:
    ; Check other new button presses
    LDA NewButtonPresses
    AND #%01000000       ; B button
    BEQ BJustPressed
    ; Continue with other buttons
    
BJustPressed:
    JSR HandleBButtonPress
    RTS

NewButtonPresses: .byte $00
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Button Press vs Hold Detection"
  code="; Detect new button presses vs holds
DetectButtonPress:
    LDA CurrentButtons
    STA PreviousButtons
    
    JSR ReadController
    STA CurrentButtons
    
    ; Find newly pressed buttons
    EOR PreviousButtons    ; XOR previous state
    AND CurrentButtons     ; AND current state
    STA NewPresses
    
    ; Check for new A press
    AND #%10000000
    BEQ NewAPress
    LDA #$00
    JMP StoreNewA
NewAPress:
    LDA #$01
StoreNewA:
    STA $0203             ; New A press indicator
    
    ; Check if A is currently held
    LDA CurrentButtons
    AND #%10000000
    BEQ ACurrentlyHeld
    LDA #$00
    JMP StoreHeldA
ACurrentlyHeld:
    LDA #$01
StoreHeldA:
    STA $0204             ; A held indicator
    
    RTS

ReadController:
    LDA #$7F              ; Simulate A not pressed this frame
    RTS

CurrentButtons: .byte $FF    ; Start with no buttons pressed
PreviousButtons: .byte $FF
NewPresses: .byte $00"
  language="assembly"
/>

## Directional Pad Handling

The directional pad requires special attention to prevent invalid combinations:

```assembly
CheckDirections:
    JSR ReadController
    STA ControllerState
    
    ; Initialize direction states
    LDA #$00
    STA DirectionUp
    STA DirectionDown
    STA DirectionLeft
    STA DirectionRight
    
    ; Check Up (bit 3)
    LDA ControllerState
    AND #%00001000
    BNE CheckDown         ; Branch if not pressed
    LDA #$01
    STA DirectionUp
    
CheckDown:
    LDA ControllerState
    AND #%00000100        ; Check Down (bit 2)
    BNE CheckLeft
    ; Don't allow Up+Down simultaneously
    LDA DirectionUp
    BNE SkipDown          ; Skip if Up already pressed
    LDA #$01
    STA DirectionDown
    
SkipDown:
CheckLeft:
    LDA ControllerState
    AND #%00000010        ; Check Left (bit 1)
    BNE CheckRight
    LDA #$01
    STA DirectionLeft
    
CheckRight:
    LDA ControllerState
    AND #%00000001        ; Check Right (bit 0)
    BNE DirectionComplete
    ; Don't allow Left+Right simultaneously
    LDA DirectionLeft
    BNE DirectionComplete  ; Skip if Left already pressed
    LDA #$01
    STA DirectionRight
    
DirectionComplete:
    RTS

; Direction state variables
DirectionUp: .byte $00
DirectionDown: .byte $00
DirectionLeft: .byte $00
DirectionRight: .byte $00
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Directional Pad with Conflict Prevention"
  code="; Handle directional input with conflict prevention
CheckDirections:
    JSR ReadController
    STA ControllerState
    
    ; Clear all directions
    LDA #$00
    STA $0210            ; Up state
    STA $0211            ; Down state  
    STA $0212            ; Left state
    STA $0213            ; Right state
    
    ; Check Up
    LDA ControllerState
    AND #%00001000
    BNE CheckDown
    LDA #$01
    STA $0210
    
CheckDown:
    LDA ControllerState
    AND #%00000100
    BNE CheckLeft
    ; Prevent Up+Down
    LDA $0210
    BNE CheckLeft        ; Skip Down if Up pressed
    LDA #$01
    STA $0211
    
CheckLeft:
    LDA ControllerState
    AND #%00000010
    BNE CheckRight
    LDA #$01
    STA $0212
    
CheckRight:
    LDA ControllerState
    AND #%00000001
    BNE Done
    ; Prevent Left+Right
    LDA $0212
    BNE Done             ; Skip Right if Left pressed
    LDA #$01
    STA $0213
    
Done:
    RTS

ReadController:
    LDA #%11110110       ; Simulate Up and Left pressed
    RTS

ControllerState: .byte $00"
  language="assembly"
/>

## Creating a Button Response System

Build a complete system that responds to button presses:

```assembly
ProcessInput:
    JSR DetectButtonPress
    
    ; Process A button
    LDA NewButtonPresses
    AND #%10000000
    BEQ ProcessAButton
    JMP ProcessBButton
    
ProcessAButton:
    ; A button was just pressed
    JSR PlaySelectSound
    JSR AdvanceMenuOption
    
ProcessBButton:
    LDA NewButtonPresses
    AND #%01000000
    BEQ ProcessBButtonAction
    JMP ProcessDirections
    
ProcessBButtonAction:
    JSR PlayCancelSound
    JSR GoBackMenu
    
ProcessDirections:
    ; Handle directional movement
    LDA DirectionUp
    BEQ MoveUp
    LDA DirectionDown
    BEQ MoveDown
    LDA DirectionLeft
    BEQ MoveLeft
    LDA DirectionRight
    BEQ MoveRight
    RTS
    
MoveUp:
    JSR MoveCursorUp
    RTS
    
MoveDown:
    JSR MoveCursorDown
    RTS
    
MoveLeft:
    JSR MoveCursorLeft
    RTS
    
MoveRight:
    JSR MoveCursorRight
    RTS
```

## Practice Exercise

Create a button state checker that displays which buttons are currently pressed:

1. Read the controller state
2. Check each button individually  
3. Store the results in memory locations $0200-$0207
4. Handle button press detection (new presses only)
5. Prevent conflicting directional inputs

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Complete Button State System"
  code="; Complete button state checking system
Main:
    JSR CheckAllButtonStates
    JSR DetectNewPresses
    JSR HandleButtonResponses
    JMP Main

CheckAllButtonStates:
    JSR ReadController
    STA ControllerState
    
    ; Check all 8 buttons
    LDX #$08             ; 8 buttons to check
    LDY #$00             ; Start with bit 0
    
ButtonLoop:
    LDA ControllerState
    AND ButtonMasks,Y    ; Mask for current button
    BEQ ButtonPressed
    LDA #$00             ; Not pressed
    JMP StoreButton
ButtonPressed:
    LDA #$01             ; Pressed
StoreButton:
    STA $0200,Y          ; Store in memory
    INY
    DEX
    BNE ButtonLoop
    RTS

DetectNewPresses:
    ; Compare with previous frame
    LDX #$08
    LDY #$00
NewPressLoop:
    LDA $0200,Y          ; Current state
    CMP $0208,Y          ; Previous state
    BEQ NoNewPress       ; Same as before
    LDA $0200,Y
    BEQ NoNewPress       ; Not pressed now
    LDA #$01
    STA $0210,Y          ; Mark as new press
    JMP NextButton
NoNewPress:
    LDA #$00
    STA $0210,Y
NextButton:
    INY
    DEX
    BNE NewPressLoop
    
    ; Copy current to previous
    LDX #$08
    LDY #$00
CopyLoop:
    LDA $0200,Y
    STA $0208,Y
    INY
    DEX
    BNE CopyLoop
    RTS

HandleButtonResponses:
    ; Respond to new A press
    LDA $0210            ; New A press?
    BEQ CheckB
    ; Handle A button action
    
CheckB:
    LDA $0211            ; New B press?
    BEQ Done
    ; Handle B button action
    
Done:
    RTS

ReadController:
    LDA #%10100101       ; Test pattern
    RTS

ButtonMasks:
    .byte %00000001      ; Right
    .byte %00000010      ; Left
    .byte %00000100      ; Down
    .byte %00001000      ; Up
    .byte %00010000      ; Start
    .byte %00100000      ; Select
    .byte %01000000      ; B
    .byte %10000000      ; A

ControllerState: .byte $00"
  language="assembly"
/>

## What You've Learned

In this essential lesson, you've mastered:

- Reading individual button states using bit masking
- Distinguishing between button presses and holds
- Creating reliable input detection systems
- Handling directional pad conflicts
- Building responsive button response systems
- Managing button state variables and detection

## Looking Ahead

In the next lesson, you'll learn to create programs that respond immediately to button input, building interactive systems that feel responsive and smooth - essential skills for creating engaging NES games!

## Fun Fact

The NES controller's simple 8-button design became the template for countless game controllers. The inverted logic (0 = pressed) was chosen to make the default state reliable when no controller was connected, preventing false button readings that could crash games!