---
title: "User Input for Graphics"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 27
description: "Master keyboard and input handling for interactive graphics applications. Build responsive controls for drawing tools, implement cursor movement, and create intuitive user interfaces."
learning_objectives:
  - "Implement responsive keyboard input handling"
  - "Create smooth cursor movement systems"
  - "Build interactive drawing controls"
  - "Design intuitive input mappings"
  - "Handle multiple input states simultaneously"
concepts:
  - "Keyboard scanning and debouncing"
  - "Cursor tracking and movement"
  - "Input state management"
  - "Control mapping and modes"
  - "Interactive feedback systems"
estimated_duration: "45-55 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 27
---

# Lesson 27: User Input for Graphics

Interactive adventure games require responsive, intuitive input handling. The ZX Spectrum's keyboard offers unique challenges and opportunities for creating engaging user interfaces. Let's build a sophisticated input system for our Spectrum Saga!

## Understanding Spectrum Keyboard Input

### Keyboard Matrix

The Spectrum keyboard is organized as an 8×5 matrix:

```text
; Keyboard matrix layout
; Each port reads 5 keys (bits 0-4)
; Port  Bit 4   Bit 3   Bit 2   Bit 1   Bit 0
; FEFE    V       C       X       Z     SHIFT
; FDFE    G       F       D       S       A
; FBFE    T       R       E       W       Q
; F7FE    5       4       3       2       1
; EFFE    6       7       8       9       0
; DFFE    Y       U       I       O       P
; BFFE    H       J       K       L    ENTER
; 7FFE    B       N       M     SYMB    SPACE
```

### Reading the Keyboard

```text
; Read specific key
; Input: A = port address
; Output: A = key states (0 = pressed)
ReadKeyboard:
    IN A, (254)         ; Read keyboard port
    CPL                 ; Invert (1 = pressed)
    AND 31              ; Mask to 5 keys
    RET

; Check if specific key is pressed
; Input: B = port, C = bit mask
; Output: Zero flag set if pressed
CheckKey:
    LD A, B
    IN A, (254)
    AND C               ; Test specific bit
    RET                 ; Z = pressed, NZ = not pressed
```

## Building a Cursor System

### Cursor State Management

```text
; Cursor data structure
CursorData:
    CursorX:        DB 128  ; Current X position
    CursorY:        DB 96   ; Current Y position
    OldCursorX:     DB 128  ; Previous X position
    OldCursorY:     DB 96   ; Previous Y position
    CursorSpeed:    DB 2    ; Movement speed
    CursorVisible:  DB 1    ; Visibility flag
    CursorMode:     DB 0    ; 0=move, 1=draw
    
; Cursor appearance
CursorPattern:
    DB %00010000    ; Simple cross cursor
    DB %00010000
    DB %11111111
    DB %00010000
    DB %00010000
```

### Smooth Cursor Movement

**Smooth Cursor Movement:**

```assembly
; Smooth cursor movement demonstration
; Shows responsive keyboard control of graphics cursor

DISPLAY_FILE    EQU 16384

; Cursor state
CursorX:        DB 128
CursorY:        DB 96
OldCursorX:     DB 128
OldCursorY:     DB 96
CursorSpeed:    DB 2
CursorVisible:  DB 1

; Keyboard ports
KEY_Q_T:        EQU 0xFBFE  ; Q,W,E,R,T row
KEY_A_G:        EQU 0xFDFE  ; A,S,D,F,G row
KEY_SHIFT:      EQU 0xFEFE  ; Shift,Z,X,C,V row
KEY_SPACE:      EQU 0x7FFE  ; Space,Symb,M,N,B row

; Key masks
KEY_Q:          EQU %00001  ; Bit 0
KEY_W:          EQU %00010  ; Bit 1
KEY_E:          EQU %00100  ; Bit 2
KEY_A:          EQU %00001  ; Bit 0
KEY_S:          EQU %00010  ; Bit 1
KEY_D:          EQU %00100  ; Bit 2
KEY_SPACE_BIT:  EQU %00001  ; Bit 0

; Screen routines
CalculateScreenAddress:
    LD A, C
    AND 7
    OR 64
    LD H, A
    LD A, C
    RRA : RRA : RRA
    AND 24
    OR H
    LD H, A
    LD A, C
    RLA : RLA
    AND 224
    LD L, A
    LD A, B
    RRA : RRA : RRA
    AND 31
    OR L
    LD L, A
    RET

PlotPixel:
    CALL CalculateScreenAddress
    LD A, B
    AND 7
    LD B, A
    LD A, 128
    JR Z, PlotBit
PlotShift:
    RRA
    DJNZ PlotShift
PlotBit:
    OR (HL)
    LD (HL), A
    RET

XORPixel:
    CALL CalculateScreenAddress
    LD A, B
    AND 7
    LD B, A
    LD A, 128
    JR Z, XORBit
XORShift:
    RRA
    DJNZ XORShift
XORBit:
    XOR (HL)
    LD (HL), A
    RET

; Draw cursor at current position
DrawCursor:
    LD A, (CursorVisible)
    OR A
    RET Z               ; Don't draw if invisible
    
    ; Draw cross cursor
    LD A, (CursorX)
    LD B, A
    LD A, (CursorY)
    LD C, A
    
    ; Center pixel
    PUSH BC
    CALL XORPixel
    POP BC
    
    ; Horizontal line
    PUSH BC
    DEC B
    CALL XORPixel
    INC B
    INC B
    CALL XORPixel
    POP BC
    
    ; Vertical line
    PUSH BC
    DEC C
    CALL XORPixel
    INC C
    INC C
    CALL XORPixel
    POP BC
    
    RET

; Erase cursor at old position
EraseCursor:
    LD A, (OldCursorX)
    LD B, A
    LD A, (OldCursorY)
    LD C, A
    
    ; Erase cross (same as draw with XOR)
    PUSH BC
    CALL XORPixel
    POP BC
    
    PUSH BC
    DEC B
    CALL XORPixel
    INC B
    INC B
    CALL XORPixel
    POP BC
    
    PUSH BC
    DEC C
    CALL XORPixel
    INC C
    INC C
    CALL XORPixel
    POP BC
    
    RET

; Update cursor position based on input
UpdateCursor:
    ; Save old position
    LD A, (CursorX)
    LD (OldCursorX), A
    LD A, (CursorY)
    LD (OldCursorY), A
    
    ; Read Q,W,E,A,S,D keys for movement
    ; W = up, S = down, A = left, D = right
    ; Q = up-left, E = up-right
    
    ; Check W (up)
    LD A, KEY_Q_T
    IN A, (254)
    BIT 1, A            ; W key
    JR NZ, CheckS
    LD A, (CursorY)
    LD B, (CursorSpeed)
    SUB B               ; Move up
    JR C, CheckS        ; Don't go negative
    LD (CursorY), A
    
CheckS:
    ; Check S (down)
    LD A, KEY_A_G
    IN A, (254)
    BIT 1, A            ; S key
    JR NZ, CheckA
    LD A, (CursorY)
    LD B, (CursorSpeed)
    ADD B               ; Move down
    CP 192              ; Screen height
    JR NC, CheckA       ; Don't go off screen
    LD (CursorY), A
    
CheckA:
    ; Check A (left)
    LD A, KEY_A_G
    IN A, (254)
    BIT 0, A            ; A key
    JR NZ, CheckD
    LD A, (CursorX)
    LD B, (CursorSpeed)
    SUB B               ; Move left
    JR C, CheckD        ; Don't go negative
    LD (CursorX), A
    
CheckD:
    ; Check D (right)
    LD A, KEY_A_G
    IN A, (254)
    BIT 2, A            ; D key
    JR NZ, CheckDiagonals
    LD A, (CursorX)
    LD B, (CursorSpeed)
    ADD B               ; Move right
    JR NC, CheckDiagonals ; Don't overflow
    LD A, 255
    LD (CursorX), A
    
CheckDiagonals:
    ; Check Q (up-left)
    LD A, KEY_Q_T
    IN A, (254)
    BIT 0, A            ; Q key
    JR NZ, CheckE
    LD A, (CursorY)
    DEC A
    JR C, CheckE
    LD (CursorY), A
    LD A, (CursorX)
    DEC A
    JR C, CheckE
    LD (CursorX), A
    
CheckE:
    ; Check E (up-right)
    LD A, KEY_Q_T
    IN A, (254)
    BIT 2, A            ; E key
    JR NZ, CheckSpeed
    LD A, (CursorY)
    DEC A
    JR C, CheckSpeed
    LD (CursorY), A
    LD A, (CursorX)
    INC A
    LD (CursorX), A
    
CheckSpeed:
    ; Check SHIFT for fast movement
    LD A, KEY_SHIFT
    IN A, (254)
    BIT 0, A            ; SHIFT key
    JR NZ, NormalSpeed
    LD A, 4             ; Fast speed
    JR SetSpeed
NormalSpeed:
    LD A, 2             ; Normal speed
SetSpeed:
    LD (CursorSpeed), A
    
    RET

; Clear screen
ClearScreen:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143
    LD (HL), 0
    LDIR
    RET

; Main cursor demo
CursorDemo:
    CALL ClearScreen
    
    ; Draw initial cursor
    CALL DrawCursor
    
    ; Main loop
    LD B, 255           ; Loop counter
    
MainLoop:
    PUSH BC
    
    ; Erase old cursor
    CALL EraseCursor
    
    ; Update position
    CALL UpdateCursor
    
    ; Draw new cursor
    CALL DrawCursor
    
    ; Small delay for smooth movement
    LD BC, 500
DelayLoop:
    DEC BC
    LD A, B
    OR C
    JR NZ, DelayLoop
    
    POP BC
    DJNZ MainLoop
    
    LD B, 255           ; Success
    RET
```

## Advanced Input Handling

### Key Debouncing

Prevent key repeat and ensure clean input:

```text
; Key state tracking
KeyStates:      DS 8    ; Current state for each port
LastKeyStates:  DS 8    ; Previous state
KeyPressed:     DS 8    ; Edge detection (just pressed)
KeyReleased:    DS 8    ; Edge detection (just released)

; Update key states with debouncing
UpdateKeyStates:
    LD HL, KeyStates
    LD DE, LastKeyStates
    LD BC, 8
    
    ; Copy current to last
    PUSH HL
    PUSH DE
    LDIR
    POP DE
    POP HL
    
    ; Read all keyboard ports
    LD B, 8
    LD C, 0xFE          ; Port 254
    
ReadLoop:
    LD A, (HL)          ; Get port address pattern
    IN A, (C)           ; Read keyboard
    CPL                 ; Invert (1 = pressed)
    AND 31              ; Mask to 5 keys
    
    ; Detect edges
    LD D, A             ; Save current state
    LD A, (DE)          ; Get last state
    LD E, A             ; Save last state
    LD A, D             ; Current state
    XOR E               ; Find changes
    AND D               ; Just pressed = changed AND current
    LD (KeyPressed), A
    
    LD A, D
    XOR E               ; Find changes again
    AND E               ; Just released = changed AND last
    LD (KeyReleased), A
    
    LD A, D
    LD (HL), A          ; Store current state
    INC HL
    INC DE
    DJNZ ReadLoop
    RET
```

### Multiple Key Handling

Handle multiple simultaneous keypresses:

```text
; Check multiple keys at once
CheckMultipleKeys:
    LD HL, KeyCombinations
    LD B, 0             ; Key combination flags
    
    ; Check for Ctrl+S (save)
    LD A, 0x7FFE        ; Symbol shift row
    IN A, (254)
    BIT 1, A            ; Symbol shift
    JR NZ, CheckCtrlL
    LD A, KEY_A_G
    IN A, (254)
    BIT 1, A            ; S key
    JR NZ, CheckCtrlL
    SET 0, B            ; Set save flag
    
CheckCtrlL:
    ; Check for Ctrl+L (load)
    ; ... similar pattern
    
    LD A, B
    LD (KeyCombinations), A
    RET

KeyCombinations: DB 0
```

## Drawing Mode Controls

### Mode Management

**Drawing Mode Controls:**

```assembly
; Drawing mode control system
; Implements various drawing modes with keyboard control

DISPLAY_FILE    EQU 16384

; Drawing modes
MODE_MOVE:      EQU 0
MODE_DRAW:      EQU 1
MODE_LINE:      EQU 2
MODE_RECT:      EQU 3
MODE_CIRCLE:    EQU 4
MODE_ERASE:     EQU 5

; State variables
DrawingMode:    DB MODE_MOVE
DrawingActive:  DB 0
StartX:         DB 0
StartY:         DB 0
EndX:           DB 0
EndY:           DB 0
CurrentX:       DB 128
CurrentY:       DB 96

; Mode indicators (for UI)
ModeNames:
    DB 'M','O','V','E',' ',' '
    DB 'D','R','A','W',' ',' '
    DB 'L','I','N','E',' ',' '
    DB 'R','E','C','T',' ',' '
    DB 'C','I','R','C','L','E'
    DB 'E','R','A','S','E',' '

; Include basic drawing routines
PlotPixel:
    ; (Implementation as before)
    RET

ClearPixel:
    ; (Implementation as before)
    RET

DrawLine:
    ; (Implementation as before)
    RET

; Check mode selection keys
CheckModeKeys:
    ; Number keys select modes
    ; 1 = Move, 2 = Draw, 3 = Line, etc.
    
    LD A, 0xF7FE        ; Number row 1-5
    IN A, (254)
    
    ; Check key 1 (Move)
    BIT 0, A
    JR NZ, Check2
    LD A, MODE_MOVE
    JR SetMode
    
Check2:
    ; Check key 2 (Draw)
    BIT 1, A
    JR NZ, Check3
    LD A, MODE_DRAW
    JR SetMode
    
Check3:
    ; Check key 3 (Line)
    BIT 2, A
    JR NZ, Check4
    LD A, MODE_LINE
    JR SetMode
    
Check4:
    ; Check key 4 (Rectangle)
    BIT 3, A
    JR NZ, Check5
    LD A, MODE_RECT
    JR SetMode
    
Check5:
    ; Check key 5 (Circle)
    BIT 4, A
    JR NZ, CheckErase
    LD A, MODE_CIRCLE
    JR SetMode
    
CheckErase:
    ; Check E key for erase
    LD A, KEY_Q_T
    IN A, (254)
    BIT 2, A            ; E key
    JR NZ, NoModeChange
    LD A, MODE_ERASE
    
SetMode:
    LD (DrawingMode), A
    CALL UpdateModeDisplay
    
NoModeChange:
    RET

; Handle drawing based on current mode
HandleDrawing:
    ; Check SPACE for activate/deactivate
    LD A, 0x7FFE
    IN A, (254)
    BIT 0, A            ; SPACE
    JR NZ, CheckDrawingActive
    
    ; Toggle drawing active
    LD A, (DrawingActive)
    XOR 1
    LD (DrawingActive), A
    
    ; If just activated, save start position
    OR A
    RET Z               ; Deactivated
    
    LD A, (CurrentX)
    LD (StartX), A
    LD A, (CurrentY)
    LD (StartY), A
    RET
    
CheckDrawingActive:
    LD A, (DrawingActive)
    OR A
    RET Z               ; Not active
    
    ; Execute based on mode
    LD A, (DrawingMode)
    OR A
    JR Z, HandleMove
    DEC A
    JR Z, HandleDraw
    DEC A
    JR Z, HandleLine
    DEC A
    JR Z, HandleRect
    DEC A
    JR Z, HandleCircle
    JR HandleErase

HandleMove:
    ; Just move cursor, no drawing
    RET

HandleDraw:
    ; Draw pixels as cursor moves
    LD A, (CurrentX)
    LD B, A
    LD A, (CurrentY)
    LD C, A
    CALL PlotPixel
    RET

HandleLine:
    ; Draw preview line from start to current
    ; (In real implementation, would use XOR for preview)
    LD A, (StartX)
    LD D, A
    LD A, (StartY)
    LD E, A
    LD A, (CurrentX)
    LD B, A
    LD A, (CurrentY)
    LD C, A
    CALL DrawLine
    RET

HandleRect:
    ; Draw preview rectangle
    ; Calculate width and height
    LD A, (CurrentX)
    LD B, A
    LD A, (StartX)
    SUB B
    JR NC, WidthOK
    NEG
WidthOK:
    LD B, A             ; Width
    
    LD A, (CurrentY)
    LD C, A
    LD A, (StartY)
    SUB C
    JR NC, HeightOK
    NEG
HeightOK:
    LD C, A             ; Height
    
    LD A, (StartX)
    LD D, A
    LD A, (StartY)
    LD E, A
    ; Would call DrawRectangle
    RET

HandleCircle:
    ; Draw preview circle
    ; Calculate radius from start to current
    ; (Simplified - just use X distance)
    LD A, (CurrentX)
    LD B, A
    LD A, (StartX)
    SUB B
    JR NC, RadiusOK
    NEG
RadiusOK:
    LD B, A             ; Radius
    LD A, (StartX)
    LD D, A
    LD A, (StartY)
    LD E, A
    ; Would call DrawCircle
    RET

HandleErase:
    ; Erase pixels as cursor moves
    LD A, (CurrentX)
    LD B, A
    LD A, (CurrentY)
    LD C, A
    CALL ClearPixel
    RET

; Update mode display
UpdateModeDisplay:
    ; Show current mode in corner
    ; (Simplified - just set indicator)
    LD A, (DrawingMode)
    ADD A, A            ; × 2
    ADD A, A            ; × 4
    ADD A, (DrawingMode) ; × 5
    ADD A, (DrawingMode) ; × 6 (6 chars per mode)
    
    LD HL, ModeNames
    LD E, A
    LD D, 0
    ADD HL, DE          ; Point to mode name
    
    ; Would display mode name here
    RET

; Main drawing control demo
DrawingControlDemo:
    ; Initialize
    LD A, MODE_MOVE
    LD (DrawingMode), A
    LD A, 0
    LD (DrawingActive), A
    
    ; Main loop
    LD B, 100
    
ControlLoop:
    PUSH BC
    
    ; Check mode keys
    CALL CheckModeKeys
    
    ; Handle drawing
    CALL HandleDrawing
    
    ; Update cursor position
    ; (Would integrate cursor movement here)
    
    ; Small delay
    LD BC, 1000
Delay2:
    DEC BC
    LD A, B
    OR C
    JR NZ, Delay2
    
    POP BC
    DJNZ ControlLoop
    
    ; Show final mode
    LD A, (DrawingMode)
    LD B, A             ; Return current mode
    RET

; Keyboard defines
KEY_Q_T:        EQU 0xFBFE
KEY_A_G:        EQU 0xFDFE
```

## Building Interactive Menus

### Menu System Design

```text
; Menu data structure
MenuData:
    MenuItems:      DB 6        ; Number of items
    CurrentItem:    DB 0        ; Selected item
    MenuVisible:    DB 1        ; Display flag
    
MenuText:
    DB "1. Move Tool    "
    DB "2. Draw Tool    "
    DB "3. Line Tool    "
    DB "4. Rect Tool    "
    DB "5. Circle Tool  "
    DB "6. Erase Tool   "

; Navigate menu with cursor keys
NavigateMenu:
    ; Check up key (W)
    LD A, KEY_Q_T
    IN A, (254)
    BIT 1, A
    JR NZ, CheckDown
    
    ; Move selection up
    LD A, (CurrentItem)
    OR A
    JR Z, CheckDown     ; Already at top
    DEC A
    LD (CurrentItem), A
    CALL UpdateMenuDisplay
    
CheckDown:
    ; Check down key (S)
    LD A, KEY_A_G
    IN A, (254)
    BIT 1, A
    JR NZ, CheckSelect
    
    ; Move selection down
    LD A, (CurrentItem)
    INC A
    LD B, (MenuItems)
    CP B
    JR NC, CheckSelect  ; Already at bottom
    LD (CurrentItem), A
    CALL UpdateMenuDisplay
    
CheckSelect:
    ; Check ENTER for selection
    LD A, 0xBFFE
    IN A, (254)
    BIT 0, A            ; ENTER key
    RET NZ              ; Not pressed
    
    ; Item selected
    LD A, (CurrentItem)
    CALL ExecuteMenuItem
    RET
```

### Visual Feedback

**Interactive Menu System:**

```assembly
; Complete interactive menu system
; Shows visual feedback and keyboard navigation

DISPLAY_FILE    EQU 16384
ATTR_FILE       EQU 22528

; Menu configuration
MENU_X:         EQU 2   ; Character position
MENU_Y:         EQU 2
MENU_WIDTH:     EQU 20
MENU_HEIGHT:    EQU 8

; Menu state
MenuItems:      DB 6
CurrentItem:    DB 0
LastItem:       DB 255  ; Force initial draw
MenuVisible:    DB 1
SelectionMade:  DB 0

; Colors
COLOR_NORMAL:   EQU 56  ; Black on white
COLOR_SELECTED: EQU 120 ; White on black, bright

; Menu text (16 chars each for alignment)
MenuText:
    DB 'Move Tool       '
    DB 'Draw Pixels     '
    DB 'Draw Lines      '
    DB 'Draw Rectangles '
    DB 'Draw Circles    '
    DB 'Erase Mode      '

; Clear screen
ClearScreen:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143
    LD (HL), 0
    LDIR
    
    ; Clear attributes
    LD HL, ATTR_FILE
    LD DE, ATTR_FILE + 1
    LD BC, 767
    LD A, COLOR_NORMAL
    LD (HL), A
    LDIR
    RET

; Draw menu border
DrawMenuBorder:
    ; Simple box around menu
    ; (Simplified - just set attributes)
    LD B, MENU_X
    LD C, MENU_Y
    LD D, MENU_WIDTH
    LD E, MENU_HEIGHT
    
    ; Top and bottom borders
    LD A, MENU_Y
    CALL DrawHorizontalBorder
    LD A, MENU_Y
    ADD MENU_HEIGHT
    DEC A
    CALL DrawHorizontalBorder
    
    ; Side borders
    ; (Implementation simplified)
    RET

DrawHorizontalBorder:
    ; Draw horizontal line in attributes
    ; (Simplified implementation)
    RET

; Display menu items
DisplayMenu:
    LD A, (MenuVisible)
    OR A
    RET Z               ; Menu hidden
    
    ; Draw each menu item
    LD B, 0             ; Item counter
    
ItemLoop:
    PUSH BC
    
    ; Calculate position
    LD A, MENU_Y
    ADD B
    INC A               ; Skip border
    LD C, A             ; Y position
    LD B, MENU_X
    INC B               ; Skip border
    
    ; Calculate text pointer
    POP AF              ; Get item number
    PUSH AF
    LD H, 0
    LD L, A
    ADD HL, HL          ; × 2
    ADD HL, HL          ; × 4
    ADD HL, HL          ; × 8
    ADD HL, HL          ; × 16 (16 chars per item)
    LD DE, MenuText
    ADD HL, DE          ; HL = text pointer
    
    ; Display text (simplified)
    PUSH BC
    PUSH HL
    CALL DisplayMenuItem
    POP HL
    POP BC
    
    ; Set color based on selection
    POP AF
    PUSH AF
    LD D, A             ; Save item number
    LD A, (CurrentItem)
    CP D
    JR NZ, NormalColor
    
    ; Selected item - highlight
    LD A, COLOR_SELECTED
    JR SetItemColor
    
NormalColor:
    LD A, COLOR_NORMAL
    
SetItemColor:
    PUSH BC
    CALL SetMenuItemColor
    POP BC
    
    POP BC
    INC B
    LD A, B
    CP 6                ; Number of items
    JR NZ, ItemLoop
    
    RET

; Display single menu item text
DisplayMenuItem:
    ; B = x, C = y, HL = text
    ; (Simplified - just mark position)
    RET

; Set color for menu item
SetMenuItemColor:
    ; B = x, C = y, A = color
    ; Calculate attribute address
    LD H, 0
    LD L, C
    ADD HL, HL          ; × 2
    ADD HL, HL          ; × 4
    ADD HL, HL          ; × 8
    ADD HL, HL          ; × 16
    ADD HL, HL          ; × 32
    LD D, 0
    LD E, B
    ADD HL, DE
    LD DE, ATTR_FILE
    ADD HL, DE
    
    ; Set color for item width
    LD B, 16            ; Item width
ColorLoop:
    LD (HL), A
    INC HL
    DJNZ ColorLoop
    RET

; Handle menu input
HandleMenuInput:
    ; Check W key (up)
    LD A, 0xFBFE
    IN A, (254)
    BIT 1, A
    JR NZ, CheckDownKey
    
    ; Move up
    LD A, (CurrentItem)
    OR A
    JR Z, CheckDownKey  ; Already at top
    DEC A
    LD (CurrentItem), A
    RET
    
CheckDownKey:
    ; Check S key (down)
    LD A, 0xFDFE
    IN A, (254)
    BIT 1, A
    JR NZ, CheckEnterKey
    
    ; Move down
    LD A, (CurrentItem)
    INC A
    CP 6                ; Number of items
    JR NC, CheckEnterKey ; Already at bottom
    LD (CurrentItem), A
    RET
    
CheckEnterKey:
    ; Check ENTER key
    LD A, 0xBFFE
    IN A, (254)
    BIT 0, A
    RET NZ              ; Not pressed
    
    ; Selection made
    LD A, 1
    LD (SelectionMade), A
    RET

; Main menu demo
MenuDemo:
    CALL ClearScreen
    CALL DrawMenuBorder
    
    ; Main menu loop
    LD B, 200           ; Loop counter
    
MenuLoop:
    PUSH BC
    
    ; Handle input
    CALL HandleMenuInput
    
    ; Check if selection made
    LD A, (SelectionMade)
    OR A
    JR NZ, MenuExit
    
    ; Update display if changed
    LD A, (CurrentItem)
    LD B, A
    LD A, (LastItem)
    CP B
    JR Z, NoUpdate
    
    ; Item changed - update display
    LD A, B
    LD (LastItem), A
    CALL DisplayMenu
    
NoUpdate:
    ; Small delay for keyboard debouncing
    LD BC, 2000
DelayLoop:
    DEC BC
    LD A, B
    OR C
    JR NZ, DelayLoop
    
    POP BC
    DJNZ MenuLoop
    
    ; Return selected item
    LD A, (CurrentItem)
    LD B, A
    RET
    
MenuExit:
    POP BC
    LD A, (CurrentItem)
    LD B, A             ; Return selection
    RET
```

## Gesture Recognition

### Simple Drawing Gestures

Recognize basic drawing patterns:

```text
; Gesture detection for shapes
GestureData:
    GestureBuffer:  DS 16   ; Recent positions
    BufferIndex:    DB 0
    GestureType:    DB 0    ; Detected gesture

; Record cursor movement
RecordMovement:
    LD A, (BufferIndex)
    AND 15              ; Wrap at 16
    LD L, A
    LD H, 0
    LD DE, GestureBuffer
    ADD HL, DE
    
    ; Store current position
    LD A, (CurrentX)
    LD (HL), A
    INC HL
    LD A, (CurrentY)
    LD (HL), A
    
    ; Update index
    LD A, (BufferIndex)
    INC A
    LD (BufferIndex), A
    RET

; Detect line gesture (straight movement)
DetectLineGesture:
    ; Analyze buffer for straight line pattern
    ; Check if all points roughly collinear
    ; Set GestureType if detected
    RET

; Detect circle gesture (circular movement)
DetectCircleGesture:
    ; Analyze buffer for circular pattern
    ; Check if points form rough circle
    ; Set GestureType if detected
    RET
```

## Input Optimization

### Fast Keyboard Scanning

```text
; Optimized keyboard scanner
FastKeyScan:
    ; Read all ports in sequence
    LD HL, KeyBuffer
    LD B, 8
    LD C, 0xFE
    
ScanLoop:
    LD A, (PortTable-1)
    ADD B               ; Get port address byte
    IN A, (C)           ; Read port
    CPL                 ; Invert
    AND 31              ; Mask
    LD (HL), A          ; Store
    INC HL
    DJNZ ScanLoop
    RET

PortTable:
    DB 0xFE, 0xFD, 0xFB, 0xF7
    DB 0xEF, 0xDF, 0xBF, 0x7F

KeyBuffer: DS 8
```

### Response Time Optimization

```text
; Immediate response system
ImmediateResponse:
    ; Critical keys checked first
    LD A, 0x7FFE        ; SPACE row
    IN A, (254)
    BIT 0, A            ; SPACE (most important)
    CALL Z, HandleSpace
    
    ; Movement keys next
    LD A, KEY_A_G
    IN A, (254)
    LD B, A
    BIT 0, A            ; A (left)
    CALL Z, MoveLeft
    BIT 2, B            ; D (right)
    CALL Z, MoveRight
    
    ; Less critical keys last
    ; ...
    RET
```

## Practical Exercise: Complete Input System

**Complete Drawing Input System:**

```assembly
; Complete drawing input system
; Integrates cursor, modes, menus, and drawing

DISPLAY_FILE    EQU 16384

; System state
SystemState:
    DB MODE_MOVE        ; Current mode
    DB 0                ; Drawing active
    DB 128              ; Cursor X
    DB 96               ; Cursor Y
    DB 0                ; Menu visible
    DB 0                ; Last key state

; Combined input handler
MainInputSystem:
    ; Initialize
    CALL ClearScreen
    CALL InitializeSystem
    
    ; Main loop
MainInputLoop:
    ; Priority 1: Check escape/menu key
    LD A, 0x7FFE
    IN A, (254)
    BIT 1, A            ; Symbol shift (menu toggle)
    CALL Z, ToggleMenu
    
    ; Check if menu is active
    LD A, (SystemState + 4)
    OR A
    JR Z, GameInput
    
    ; Menu is active - handle menu input
    CALL HandleMenuInput
    JR ContinueLoop
    
GameInput:
    ; Priority 2: Movement
    CALL HandleMovement
    
    ; Priority 3: Drawing actions
    CALL HandleDrawingInput
    
    ; Priority 4: Mode changes
    CALL CheckModeHotkeys
    
ContinueLoop:
    ; Update display
    CALL UpdateDisplay
    
    ; Frame delay
    CALL FrameDelay
    
    ; Check exit condition
    LD A, 0xBFFE
    IN A, (254)
    BIT 1, A            ; N key for exit
    JR NZ, MainInputLoop
    
    ; Cleanup and exit
    LD B, 255           ; Success
    RET

InitializeSystem:
    LD HL, SystemState
    LD A, MODE_MOVE
    LD (HL), A
    INC HL
    LD A, 0
    LD (HL), A
    INC HL
    LD A, 128
    LD (HL), A
    INC HL
    LD A, 96
    LD (HL), A
    RET

ToggleMenu:
    LD A, (SystemState + 4)
    XOR 1
    LD (SystemState + 4), A
    RET

HandleMovement:
    ; Read WASD keys
    LD A, 0xFDFE        ; A,S,D row
    IN A, (254)
    LD B, A
    
    ; Get current position
    LD HL, SystemState + 2
    LD D, (HL)          ; Cursor X
    INC HL
    LD E, (HL)          ; Cursor Y
    
    ; Check A (left)
    BIT 0, B
    JR NZ, CheckD2
    DEC D
    
CheckD2:
    ; Check D (right)
    BIT 2, B
    JR NZ, CheckWS
    INC D
    
CheckWS:
    LD A, 0xFBFE        ; W row
    IN A, (254)
    BIT 1, A            ; W (up)
    JR NZ, CheckS2
    DEC E
    
CheckS2:
    LD A, 0xFDFE
    IN A, (254)
    BIT 1, A            ; S (down)
    JR NZ, StorePosition
    INC E
    
StorePosition:
    ; Bounds check
    LD A, D
    CP 0
    JR C, SkipX
    LD (SystemState + 2), A
SkipX:
    LD A, E
    CP 192
    JR NC, SkipY
    LD (SystemState + 3), A
SkipY:
    RET

HandleDrawingInput:
    ; Check SPACE for draw
    LD A, 0x7FFE
    IN A, (254)
    BIT 0, A            ; SPACE
    RET NZ
    
    ; Draw based on current mode
    LD A, (SystemState)
    CP MODE_DRAW
    RET NZ
    
    ; Plot pixel at cursor
    LD A, (SystemState + 2)
    LD B, A
    LD A, (SystemState + 3)
    LD C, A
    ; Would call PlotPixel here
    RET

CheckModeHotkeys:
    ; Number keys for modes
    LD A, 0xF7FE
    IN A, (254)
    LD B, 0             ; Mode counter
    
CheckModeLoop:
    RRA                 ; Check next bit
    JR C, NextMode
    
    ; Key pressed - set mode
    LD A, B
    LD (SystemState), A
    RET
    
NextMode:
    INC B
    LD A, B
    CP 5
    JR NZ, CheckModeLoop
    RET

UpdateDisplay:
    ; Would update cursor and UI
    RET

FrameDelay:
    LD BC, 1000
DelayL:
    DEC BC
    LD A, B
    OR C
    JR NZ, DelayL
    RET

ClearScreen:
    LD HL, DISPLAY_FILE
    LD DE, DISPLAY_FILE + 1
    LD BC, 6143
    LD (HL), 0
    LDIR
    RET

; Mode constants
MODE_MOVE:      EQU 0
MODE_DRAW:      EQU 1
```

## Key Takeaways

You've mastered interactive input for graphics applications:

1. **Keyboard Matrix**: Understanding the Spectrum's keyboard layout
2. **Smooth Control**: Responsive cursor movement and control
3. **Input Modes**: Managing different drawing modes and tools
4. **Menu Systems**: Building interactive menus with visual feedback
5. **Optimization**: Fast, responsive input handling techniques

## What's Next?

In the next lesson, we'll combine pixels, shapes, and input to build core drawing functions. You'll create brush tools, implement undo/redo, and develop the heart of our Spectrum Saga application!

## Fun Fact

The ZX Spectrum's keyboard matrix design was a clever cost-saving measure by Sinclair. By organizing keys in an 8×5 matrix, they could read 40 keys using just 8 I/O operations. The famous "dead flesh" rubber keyboard of the original Spectrum was actually manufactured by the same company that made keypads for calculators - which explains its unique feel! Despite initial criticism, many developers grew to love the Spectrum keyboard for its predictable response times, making it perfect for precise game control. Some games even exploited the keyboard matrix to detect "impossible" key combinations for cheat codes!