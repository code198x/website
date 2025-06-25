---
title: "Interactive Input and UI Programming"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 27
description: "Master user interface programming on the Amiga. Learn to handle mouse, keyboard, and joystick input, create responsive GUI elements, and build professional interactive applications with smooth user experiences."
learning_objectives:
  - "Master all Amiga input devices: mouse, keyboard, and joystick"
  - "Create responsive GUI elements and interactive controls"
  - "Implement smooth user interface animations"
  - "Build professional application interfaces"
  - "Handle complex user interaction patterns"
concepts:
  - "Multi-device input handling and coordination"
  - "GUI element programming and animation"
  - "Event-driven programming patterns"
  - "Professional UI/UX design principles"
  - "Interactive application architecture"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 27
---

# Lesson 27: Interactive Input and UI Programming

Today you'll master user interface programming for your Copper Dreams game. You'll learn to create sophisticated, responsive game interfaces that handle mouse, keyboard, and joystick input to provide smooth, engaging gameplay experiences.

## Understanding Amiga Input Systems

The Amiga provides sophisticated input handling through CIA chips and custom registers. Master all input devices for responsive user interfaces:

<CodeRunner 
  system="commodore-amiga"
  title="Professional Input System Architecture"
  code="; Comprehensive Amiga Input Handling System

; Input manager structure
InputManager:
    dc.l    .Init
    dc.l    .Update
    dc.l    .GetMouse
    dc.l    .GetKeyboard
    dc.l    .GetJoystick

; Input system initialization
.Init:
    ; Initialize input state variables
    CLR.L   MouseX
    CLR.L   MouseY
    CLR.W   MouseButtons
    CLR.L   KeyboardState
    CLR.W   JoystickState
    
    ; Setup CIA-A for input reading
    LEA     $BFE001, A0         ; CIA-A base address
    
    ; Configure port directions (input/output)
    MOVE.B  #$C0, $200(A0)      ; Set data direction
    
    ; Initialize keyboard matrix scanning
    BSR     InitKeyboard
    
    ; Setup mouse position tracking
    BSR     InitMouse
    
    RTS

; Advanced mouse handling with acceleration
.GetMouse:
    ; Read mouse position from hardware
    LEA     $DFF000, A6
    MOVE.W  $00A(A6), D0        ; JOY0DAT (mouse)
    
    ; Extract X and Y deltas
    MOVE.W  D0, D1              ; Copy for Y processing
    AND.W   #$00FF, D0          ; X delta (lower byte)
    LSR.W   #8, D1              ; Y delta (upper byte)
    
    ; Convert to signed values
    EXT.B   D0                  ; Sign extend X
    EXT.B   D1                  ; Sign extend Y
    
    ; Apply mouse acceleration
    BSR     ApplyMouseAccel     ; D0=X delta, D1=Y delta
    
    ; Update mouse position
    ADD.W   D0, MouseX
    ADD.W   D1, MouseY
    
    ; Clamp to screen bounds
    TST.W   MouseX
    BPL.S   .xNotNeg
    CLR.W   MouseX
.xNotNeg:
    CMP.W   #319, MouseX
    BLE.S   .xInBounds
    MOVE.W  #319, MouseX
.xInBounds:
    
    TST.W   MouseY
    BPL.S   .yNotNeg
    CLR.W   MouseY
.yNotNeg:
    CMP.W   #255, MouseY
    BLE.S   .yInBounds
    MOVE.W  #255, MouseY
.yInBounds:
    
    ; Read mouse buttons
    LEA     $BFE001, A0
    MOVE.B  (A0), D0            ; Read CIA-A port A
    NOT.B   D0                  ; Invert (buttons are active low)
    AND.B   #$C0, D0            ; Mask button bits
    LSR.B   #6, D0              ; Shift to bits 0-1
    MOVE.B  D0, MouseButtons
    
    RTS

; Mouse acceleration system
ApplyMouseAccel:
    ; D0 = X delta, D1 = Y delta
    ; Apply acceleration based on movement speed
    
    ; Calculate movement magnitude
    MOVE.W  D0, D2
    BPL.S   .xPos
    NEG.W   D2
.xPos:
    MOVE.W  D1, D3
    BPL.S   .yPos
    NEG.W   D3
.yPos:
    ADD.W   D2, D3              ; Combined magnitude
    
    ; Apply acceleration curve
    CMP.W   #8, D3
    BLT.S   .noAccel
    
    ; Fast movement - apply acceleration
    LSL.W   #1, D0              ; Double X movement
    LSL.W   #1, D1              ; Double Y movement
    
.noAccel:
    RTS

; Professional keyboard handling with full matrix scanning
.GetKeyboard:
    LEA     $BFE001, A0         ; CIA-A
    LEA     KeyboardMatrix, A1  ; Keyboard state matrix
    
    ; Scan all 8 keyboard matrix rows
    MOVE.W  #7, D7              ; Row counter
    MOVE.B  #$FE, D6            ; Initial row select pattern
    
.scanRow:
    ; Select keyboard row
    MOVE.B  D6, $100(A0)        ; Set row in CIA-A port B
    
    ; Read column data
    MOVE.B  (A0), D0            ; Read CIA-A port A
    NOT.B   D0                  ; Invert (keys are active low)
    MOVE.B  D0, (A1)+           ; Store in matrix
    
    ; Move to next row
    ROL.B   #1, D6              ; Rotate row select bit
    DBRA    D7, .scanRow
    
    ; Process special key combinations
    BSR     ProcessKeyEvents
    
    RTS

; Advanced joystick handling with multiple controller support
.GetJoystick:
    LEA     $DFF000, A6
    
    ; Read joystick port 1
    MOVE.W  $00C(A6), D0        ; JOY1DAT
    
    ; Process direction inputs
    MOVE.W  D0, D1
    ROR.W   #2, D1              ; Rotate for comparison
    EOR.W   D0, D1              ; XOR for direction detection
    AND.W   #$0303, D1          ; Mask direction bits
    
    ; Extract individual directions
    CLR.W   D2                  ; Clear result
    BTST    #0, D1
    BEQ.S   .noLeft
    OR.W    #$01, D2            ; Set left bit
.noLeft:
    BTST    #1, D1
    BEQ.S   .noRight
    OR.W    #$02, D2            ; Set right bit
.noRight:
    BTST    #8, D1
    BEQ.S   .noUp
    OR.W    #$04, D2            ; Set up bit
.noUp:
    BTST    #9, D1
    BEQ.S   .noDown
    OR.W    #$08, D2            ; Set down bit
.noDown:
    
    ; Read fire button
    LEA     $BFE001, A0
    BTST    #7, (A0)            ; Check fire button
    BNE.S   .noFire
    OR.W    #$10, D2            ; Set fire bit
.noFire:
    
    MOVE.W  D2, JoystickState
    RTS

; Main input update loop
.Update:
    ; Update all input devices
    BSR     .GetMouse
    BSR     .GetKeyboard
    BSR     .GetJoystick
    
    ; Process input events
    BSR     ProcessInputEvents
    
    ; Update GUI elements
    BSR     UpdateGUIElements
    
    RTS

; Input event processing system
ProcessInputEvents:
    ; Check for mouse clicks
    MOVE.B  MouseButtons, D0
    MOVE.B  LastMouseButtons, D1
    EOR.B   D0, D1              ; Find changed buttons
    AND.B   D0, D1              ; Mask with current state for press detection
    
    ; Left button pressed?
    BTST    #0, D1
    BEQ.S   .noLeftClick
    BSR     HandleLeftClick
.noLeftClick:
    
    ; Right button pressed?
    BTST    #1, D1
    BEQ.S   .noRightClick
    BSR     HandleRightClick
.noRightClick:
    
    ; Update last button state
    MOVE.B  D0, LastMouseButtons
    
    ; Check for key presses
    BSR     CheckKeyPresses
    
    RTS

; GUI element system
UpdateGUIElements:
    ; Update all active GUI elements
    LEA     GUIElementList, A0
    MOVE.W  GUIElementCount, D7
    SUBQ.W  #1, D7
    BMI.S   .noElements
    
.elementLoop:
    ; Get element pointer
    MOVE.L  (A0)+, A1
    
    ; Check element type and update
    MOVE.W  (A1), D0            ; Element type
    LSL.W   #2, D0
    LEA     GUIUpdateTable, A2
    MOVE.L  0(A2,D0.W), A2
    JSR     (A2)
    
    DBRA    D7, .elementLoop
    
.noElements:
    RTS

; GUI update function table
GUIUpdateTable:
    dc.l    UpdateButton
    dc.l    UpdateSlider
    dc.l    UpdateTextBox
    dc.l    UpdateWindow

; Button GUI element
UpdateButton:
    ; A1 = Button structure
    ; Structure: Type(2), X(2), Y(2), Width(2), Height(2), State(2), Text(4)
    
    ; Check if mouse is over button
    MOVE.W  MouseX, D0
    MOVE.W  MouseY, D1
    
    ; Check X bounds
    CMP.W   2(A1), D0           ; X position
    BLT.S   .notOver
    SUB.W   2(A1), D0           ; Relative X
    CMP.W   6(A1), D0           ; Width
    BGE.S   .notOver
    
    ; Check Y bounds
    CMP.W   4(A1), D1           ; Y position
    BLT.S   .notOver
    SUB.W   4(A1), D1           ; Relative Y
    CMP.W   8(A1), D1           ; Height
    BGE.S   .notOver
    
    ; Mouse is over button
    OR.W    #$01, 10(A1)        ; Set hover state
    
    ; Check for click
    BTST    #0, MouseButtons
    BEQ.S   .notPressed
    OR.W    #$02, 10(A1)        ; Set pressed state
    
    ; Trigger button action
    BSR     TriggerButtonAction
    
.notPressed:
    BRA.S   .buttonDone
    
.notOver:
    AND.W   #$FFFC, 10(A1)      ; Clear hover and pressed states
    
.buttonDone:
    RTS

; Advanced slider control
UpdateSlider:
    ; A1 = Slider structure
    ; Structure: Type(2), X(2), Y(2), Width(2), Height(2), Value(2), Min(2), Max(2)
    
    ; Check if mouse is over slider
    MOVE.W  MouseX, D0
    MOVE.W  MouseY, D1
    
    ; Similar bounds checking as button...
    ; ... bounds checking code ...
    
    ; If mouse button pressed and over slider
    BTST    #0, MouseButtons
    BEQ.S   .notDragging
    
    ; Calculate new slider value based on mouse position
    SUB.W   2(A1), D0           ; Relative X position
    MULU    14(A1), D0          ; Multiply by max value
    DIVU    6(A1), D0           ; Divide by width
    ADD.W   12(A1), D0          ; Add minimum value
    
    ; Clamp to valid range
    CMP.W   12(A1), D0          ; Check minimum
    BGE.S   .minOK
    MOVE.W  12(A1), D0
.minOK:
    CMP.W   14(A1), D0          ; Check maximum
    BLE.S   .maxOK
    MOVE.W  14(A1), D0
.maxOK:
    
    MOVE.W  D0, 10(A1)          ; Store new value
    
.notDragging:
    RTS

; Input system variables
MouseX:             dc.w    160     ; Mouse X position
MouseY:             dc.w    128     ; Mouse Y position
MouseButtons:       dc.b    0       ; Current button state
LastMouseButtons:   dc.b    0       ; Previous button state
KeyboardState:      dc.l    0       ; Keyboard state
JoystickState:      dc.w    0       ; Joystick state
KeyboardMatrix:     ds.b    8       ; Keyboard matrix state
GUIElementCount:    dc.w    0       ; Number of GUI elements
GUIElementList:     ds.l    16      ; GUI element pointers"
/>

## Advanced User Interface Programming

Create sophisticated graphical user interfaces with professional interaction patterns:

<CodeRunner 
  system="commodore-amiga"
  title="Professional GUI Framework with Event System"
  code="; Advanced GUI Framework for Amiga

; GUI Framework Manager
GUIFramework:
    dc.l    .Init
    dc.l    .CreateWindow
    dc.l    .AddElement
    dc.l    .ProcessEvents
    dc.l    .Render

; GUI framework initialization
.Init:
    ; Initialize GUI system
    CLR.W   WindowCount
    CLR.W   ActiveWindow
    CLR.W   FocusedElement
    CLR.W   DragState
    
    ; Setup event queue
    LEA     EventQueue, A0
    CLR.W   EventQueueHead
    CLR.W   EventQueueTail
    CLR.W   EventQueueCount
    
    ; Initialize GUI graphics
    BSR     InitGUIGraphics
    
    RTS

; Window creation system
.CreateWindow:
    ; D0 = X, D1 = Y, D2 = Width, D3 = Height
    ; A0 = Window title
    ; Returns window ID in D0
    
    ; Find free window slot
    LEA     WindowArray, A1
    MOVE.W  WindowCount, D4
    MULU    #WINDOW_SIZE, D4
    ADD.L   D4, A1
    
    ; Initialize window structure
    MOVE.W  D0, WINDOW_X(A1)
    MOVE.W  D1, WINDOW_Y(A1)
    MOVE.W  D2, WINDOW_WIDTH(A1)
    MOVE.W  D3, WINDOW_HEIGHT(A1)
    MOVE.L  A0, WINDOW_TITLE(A1)
    CLR.W   WINDOW_ELEMENTS(A1)
    MOVE.W  #1, WINDOW_VISIBLE(A1)
    MOVE.W  #1, WINDOW_ACTIVE(A1)
    
    ; Set window as active
    MOVE.W  WindowCount, ActiveWindow
    
    ; Increment window count
    ADDQ.W  #1, WindowCount
    
    ; Return window ID
    MOVE.W  WindowCount, D0
    SUBQ.W  #1, D0
    
    RTS

; Element creation and management
.AddElement:
    ; D0 = Window ID, D1 = Element type
    ; D2 = X, D3 = Y, D4 = Width, D5 = Height
    ; A0 = Element data
    
    ; Find window
    MULU    #WINDOW_SIZE, D0
    LEA     WindowArray, A1
    ADD.L   D0, A1
    
    ; Find free element slot in window
    MOVE.W  WINDOW_ELEMENTS(A1), D6
    MULU    #ELEMENT_SIZE, D6
    LEA     WINDOW_ELEMENT_ARRAY(A1), A2
    ADD.L   D6, A2
    
    ; Initialize element
    MOVE.W  D1, ELEMENT_TYPE(A2)
    MOVE.W  D2, ELEMENT_X(A2)
    MOVE.W  D3, ELEMENT_Y(A2)
    MOVE.W  D4, ELEMENT_WIDTH(A2)
    MOVE.W  D5, ELEMENT_HEIGHT(A2)
    MOVE.L  A0, ELEMENT_DATA(A2)
    CLR.W   ELEMENT_STATE(A2)
    
    ; Increment element count
    ADDQ.W  #1, WINDOW_ELEMENTS(A1)
    
    RTS

; Advanced event processing system
.ProcessEvents:
    ; Process all queued events
    TST.W   EventQueueCount
    BEQ.S   .noEvents
    
.eventLoop:
    ; Get next event from queue
    BSR     DequeueEvent        ; Returns event in A0
    
    ; Process event based on type
    MOVE.W  EVENT_TYPE(A0), D0
    LSL.W   #2, D0
    LEA     EventHandlerTable, A1
    MOVE.L  0(A1,D0.W), A1
    JSR     (A1)
    
    ; Check for more events
    TST.W   EventQueueCount
    BNE.S   .eventLoop
    
.noEvents:
    RTS

; Event handler table
EventHandlerTable:
    dc.l    HandleMouseEvent
    dc.l    HandleKeyEvent
    dc.l    HandleTimerEvent
    dc.l    HandleWindowEvent

; Mouse event handler
HandleMouseEvent:
    ; A0 = Event structure
    
    ; Get mouse event data
    MOVE.W  EVENT_X(A0), D0     ; Mouse X
    MOVE.W  EVENT_Y(A0), D1     ; Mouse Y
    MOVE.W  EVENT_BUTTONS(A0), D2 ; Button state
    
    ; Find which window mouse is over
    BSR     FindWindowAtPoint   ; D0=X, D1=Y, returns window in D0
    
    ; If no window found, handle desktop
    TST.W   D0
    BMI.S   .desktopEvent
    
    ; Convert to window coordinates
    MULU    #WINDOW_SIZE, D0
    LEA     WindowArray, A1
    ADD.L   D0, A1
    SUB.W   WINDOW_X(A1), EVENT_X(A0)
    SUB.W   WINDOW_Y(A1), EVENT_Y(A0)
    
    ; Find element within window
    BSR     FindElementAtPoint  ; A1=window, returns element in A2
    
    ; Process element event
    TST.L   A2
    BEQ.S   .windowEvent
    
    ; Handle element-specific event
    MOVE.W  ELEMENT_TYPE(A2), D0
    LSL.W   #2, D0
    LEA     ElementEventTable, A1
    MOVE.L  0(A1,D0.W), A1
    JSR     (A1)
    BRA.S   .eventDone
    
.windowEvent:
    ; Handle window-level event (title bar, resize, etc.)
    BSR     HandleWindowMouseEvent
    BRA.S   .eventDone
    
.desktopEvent:
    ; Handle desktop event
    BSR     HandleDesktopEvent
    
.eventDone:
    RTS

; Professional window rendering system
.Render:
    ; Render all visible windows
    LEA     WindowArray, A0
    MOVE.W  WindowCount, D7
    SUBQ.W  #1, D7
    BMI.S   .noWindows
    
.windowLoop:
    ; Check if window is visible
    TST.W   WINDOW_VISIBLE(A0)
    BEQ.S   .skipWindow
    
    ; Render window frame
    BSR     RenderWindowFrame
    
    ; Render window contents
    BSR     RenderWindowContents
    
.skipWindow:
    ADD.L   #WINDOW_SIZE, A0
    DBRA    D7, .windowLoop
    
.noWindows:
    RTS

; Window frame rendering
RenderWindowFrame:
    ; A0 = Window structure
    
    ; Get window coordinates
    MOVE.W  WINDOW_X(A0), D0
    MOVE.W  WINDOW_Y(A0), D1
    MOVE.W  WINDOW_WIDTH(A0), D2
    MOVE.W  WINDOW_HEIGHT(A0), D3
    
    ; Draw window border
    BSR     DrawRectangleOutline ; D0=X, D1=Y, D2=W, D3=H
    
    ; Draw title bar
    SUBQ.W  #2, D0              ; Adjust for border
    SUBQ.W  #2, D1
    ADDQ.W  #4, D2
    MOVE.W  #16, D3             ; Title bar height
    BSR     DrawFilledRectangle
    
    ; Draw title text
    MOVE.L  WINDOW_TITLE(A0), A1
    ADD.W   #4, D0              ; Text offset
    ADD.W   #12, D1             ; Vertical center
    BSR     DrawText            ; A1=text, D0=X, D1=Y
    
    ; Draw window controls (close, minimize, etc.)
    BSR     DrawWindowControls
    
    RTS

; Element rendering system
RenderWindowContents:
    ; A0 = Window structure
    
    ; Get element count
    MOVE.W  WINDOW_ELEMENTS(A0), D7
    SUBQ.W  #1, D7
    BMI.S   .noElements
    
    ; Get element array
    LEA     WINDOW_ELEMENT_ARRAY(A0), A1
    
.elementLoop:
    ; Render element based on type
    MOVE.W  ELEMENT_TYPE(A1), D0
    LSL.W   #2, D0
    LEA     ElementRenderTable, A2
    MOVE.L  0(A2,D0.W), A2
    JSR     (A2)                ; A1 = Element structure
    
    ; Move to next element
    ADD.L   #ELEMENT_SIZE, A1
    DBRA    D7, .elementLoop
    
.noElements:
    RTS

; Advanced animation system for UI elements
AnimateGUIElements:
    ; Process all animated elements
    LEA     AnimationList, A0
    MOVE.W  AnimationCount, D7
    SUBQ.W  #1, D7
    BMI.S   .noAnimations
    
.animLoop:
    ; Update animation
    MOVE.W  ANIM_TYPE(A0), D0
    LSL.W   #2, D0
    LEA     AnimationTable, A1
    MOVE.L  0(A1,D0.W), A1
    JSR     (A1)                ; A0 = Animation structure
    
    ; Check if animation finished
    TST.W   ANIM_ACTIVE(A0)
    BNE.S   .animActive
    
    ; Remove finished animation
    BSR     RemoveAnimation
    BRA.S   .nextAnim
    
.animActive:
    ADD.L   #ANIMATION_SIZE, A0
    
.nextAnim:
    DBRA    D7, .animLoop
    
.noAnimations:
    RTS

; GUI Framework Constants
WINDOW_SIZE         EQU     64
ELEMENT_SIZE        EQU     32
ANIMATION_SIZE      EQU     24
EVENT_SIZE          EQU     16

; Window structure offsets
WINDOW_X            EQU     0
WINDOW_Y            EQU     2
WINDOW_WIDTH        EQU     4
WINDOW_HEIGHT       EQU     6
WINDOW_TITLE        EQU     8
WINDOW_ELEMENTS     EQU     12
WINDOW_VISIBLE      EQU     14
WINDOW_ACTIVE       EQU     16
WINDOW_ELEMENT_ARRAY EQU    32

; Element structure offsets
ELEMENT_TYPE        EQU     0
ELEMENT_X           EQU     2
ELEMENT_Y           EQU     4
ELEMENT_WIDTH       EQU     6
ELEMENT_HEIGHT      EQU     8
ELEMENT_DATA        EQU     10
ELEMENT_STATE       EQU     14

; Event structure offsets
EVENT_TYPE          EQU     0
EVENT_X             EQU     2
EVENT_Y             EQU     4
EVENT_BUTTONS       EQU     6

; GUI system variables
WindowCount:        dc.w    0
ActiveWindow:       dc.w    0
FocusedElement:     dc.w    0
DragState:          dc.w    0
EventQueueHead:     dc.w    0
EventQueueTail:     dc.w    0
EventQueueCount:    dc.w    0

; GUI data arrays
WindowArray:        ds.b    WINDOW_SIZE*8      ; 8 windows max
EventQueue:         ds.b    EVENT_SIZE*32      ; 32 events max
AnimationList:      ds.b    ANIMATION_SIZE*16  ; 16 animations max
AnimationCount:     dc.w    0"
/>

## What You've Learned

In this lesson, you've mastered interactive input and UI programming:
- **Multi-device input handling** for mouse, keyboard, and joystick
- **Professional GUI elements** with smooth animations
- **Event-driven programming** patterns for responsive interfaces
- **Complex user interaction** handling and state management
- **Professional UI architecture** for applications and games

## Looking Ahead

Next, you'll learn animation timing and synchronization, where you'll create perfectly timed animations and coordinate multiple systems for smooth multimedia experiences!

## Fun Fact

The UI programming techniques you've learned were used in legendary Amiga software like Deluxe Paint, Workbench, and professional applications that set the standard for graphical user interfaces!