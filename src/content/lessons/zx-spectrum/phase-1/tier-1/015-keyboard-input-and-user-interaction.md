---
title: "Keyboard Input and User Interaction"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 15
description: "Master keyboard input handling on the ZX Spectrum. Learn to read key presses, handle multiple keys, and create responsive user interfaces for interactive programs."
learning_objectives:
  - "Understand the ZX Spectrum keyboard matrix system"
  - "Learn to read individual keys and key combinations"
  - "Master debouncing and key repeat handling"
  - "Create interactive input routines for games"
  - "Build user interface elements with keyboard control"
concepts:
  - "Keyboard matrix scanning"
  - "Port-based input reading"
  - "Key debouncing techniques"
  - "Multi-key input handling"
  - "User interface programming"
estimated_duration: "45-55 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 15
---

# Lesson 15: Keyboard Input and User Interaction

Interactive programs need to respond to user input. The ZX Spectrum's keyboard system is elegantly simple but requires understanding of its matrix-based design. You'll learn to read keys, handle multiple inputs, and create the responsive interface that will make your Spectrum Saga adventure game engaging to play.

## The ZX Spectrum Keyboard Matrix

### How the Keyboard Works

The ZX Spectrum keyboard is organized as a matrix with 8 rows and 5 columns:

```
     Bit:  0     1     2     3     4
Row $FE: SHIFT  Z     X     C     V
Row $FD:   A     S     D     F     G  
Row $FB:   Q     W     E     R     T
Row $F7:   1     2     3     4     5
Row $EF:   0     9     8     7     6
Row $DF:   P     O     I     U     Y
Row $BF: ENTER  L     K     J     H
Row $7F: SPACE SYM M     N     B
```

Each row is read by sending a specific value to port $FE and reading the response.

## Basic Key Reading

### Reading a Single Key

```text
; Check if 'A' key is pressed
; 'A' is at row $FD, bit 0
CheckAKey:
    LD A, $FD           ; Select row $FD (A,S,D,F,G)
    IN A, ($FE)         ; Read keyboard port
    AND %00000001       ; Check bit 0 (A key)
    JR NZ, ANotPressed  ; Jump if bit is 1 (not pressed)
    ; A key is pressed
    LD A, 1             ; Set result to 1
    RET
ANotPressed:
    LD A, 0             ; Set result to 0
    RET
```

*Note: Keyboard bits are 0 when pressed, 1 when not pressed (inverted logic)*

**Basic Key Reading:**

```assembly
; Read multiple keys and store results
; Check 'Q' key (row $FB, bit 0)
LD A, $FB           ; Row containing Q,W,E,R,T
IN A, ($FE)         ; Read keyboard port
AND %00000001       ; Check bit 0 (Q key)
LD B, A             ; Store Q key state in B (0=pressed)

; Check 'W' key (row $FB, bit 1)  
LD A, $FB           ; Same row as Q
IN A, ($FE)         ; Read keyboard port
AND %00000010       ; Check bit 1 (W key)
LD C, A             ; Store W key state in C

; Check 'Space' key (row $7F, bit 0)
LD A, $7F           ; Row containing SPACE,SYM,M,N,B
IN A, ($FE)         ; Read keyboard port  
AND %00000001       ; Check bit 0 (SPACE key)
LD D, A             ; Store SPACE key state in D

; Now B, C, D contain key states (0=pressed, non-zero=not pressed)
```

### Key Reading Function

```text
; Generic key reading function
; Input: B = row mask, C = bit mask
; Output: A = 0 if pressed, non-zero if not pressed
ReadKey:
    LD A, B             ; Get row mask
    IN A, ($FE)         ; Read keyboard port
    AND C               ; Check specific bit
    RET                 ; Return result in A
```

## Reading Common Keys

### Movement Keys (QAOP)

```text
; Read movement keys (common Spectrum layout)
ReadMovement:
    ; Q = Up (row $FB, bit 0)
    LD A, $FB
    IN A, ($FE)
    AND %00000001
    LD B, A             ; B = Up state
    
    ; A = Down (row $FD, bit 0)  
    LD A, $FD
    IN A, ($FE)
    AND %00000001
    LD C, A             ; C = Down state
    
    ; O = Left (row $DF, bit 1)
    LD A, $DF
    IN A, ($FE)
    AND %00000010
    LD D, A             ; D = Left state
    
    ; P = Right (row $DF, bit 0)
    LD A, $DF
    IN A, ($FE)
    AND %00000001
    LD E, A             ; E = Right state
    
    RET
```

**Movement Key Reading:**

```assembly
; Read QAOP movement keys
; Q = Up, A = Down, O = Left, P = Right

; Read Q (Up) - row $FB, bit 0
LD A, $FB           ; Q,W,E,R,T row
IN A, ($FE)         ; Read port
AND %00000001       ; Check Q key (bit 0)
LD B, A             ; Store Up key state

; Read A (Down) - row $FD, bit 0
LD A, $FD           ; A,S,D,F,G row  
IN A, ($FE)         ; Read port
AND %00000001       ; Check A key (bit 0)
LD C, A             ; Store Down key state

; Read O (Left) - row $DF, bit 1
LD A, $DF           ; P,O,I,U,Y row
IN A, ($FE)         ; Read port
AND %00000010       ; Check O key (bit 1)
LD D, A             ; Store Left key state

; Read P (Right) - row $DF, bit 0  
LD A, $DF           ; P,O,I,U,Y row
IN A, ($FE)         ; Read port
AND %00000001       ; Check P key (bit 0)
LD E, A             ; Store Right key state

; Now check movement (0 = key pressed)
; If B=0: moving up
; If C=0: moving down  
; If D=0: moving left
; If E=0: moving right
```

### Number Keys

```text
; Read number keys 0-9
ReadNumbers:
    ; Keys 1-5 are in row $F7
    LD A, $F7
    IN A, ($FE)
    LD B, A             ; B = state of keys 1,2,3,4,5
    
    ; Keys 6-0 are in row $EF (in reverse order)  
    LD A, $EF
    IN A, ($FE)
    LD C, A             ; C = state of keys 0,9,8,7,6
    
    RET
```

## Key Debouncing

### Why Debouncing is Needed

Physical keys can "bounce" - appearing to be pressed multiple times when pressed once. Debouncing prevents this:

```text
; Simple key debouncing routine
; Input: B = row, C = bit mask
; Output: A = 1 if key newly pressed, 0 otherwise
DebounceKey:
    CALL ReadKey        ; Read current key state
    CP (LastKeyState)   ; Compare with previous state
    LD (LastKeyState), A ; Store current state
    RET Z               ; Return 0 if no change
    
    ; Key state changed - check if newly pressed
    OR A                ; Check if currently pressed (0)
    LD A, 0             ; Assume not newly pressed
    RET NZ              ; Return 0 if not pressed
    LD A, 1             ; Key newly pressed
    RET

LastKeyState:
    DB $FF              ; Previous key state
```

**Key Debouncing Example:**

```assembly
; Simple debouncing for Space key
; Storage for previous key state
LastSpaceState: DB $FF

; Check if Space key was just pressed (not held)
CheckSpacePress:
    ; Read current Space key state
    LD A, $7F           ; Space key row
    IN A, ($FE)         ; Read port
    AND %00000001       ; Check Space key bit
    
    ; Compare with previous state
    LD HL, LastSpaceState
    CP (HL)             ; Compare with last state
    LD (HL), A          ; Store current state
    JR Z, NoSpacePress  ; Jump if no change
    
    ; State changed - check if newly pressed
    OR A                ; Is key currently pressed? (0=yes)
    JR NZ, NoSpacePress ; Jump if not pressed
    
    ; Space key was just pressed!
    LD A, 1             ; Return 1 (newly pressed)
    RET
    
NoSpacePress:
    LD A, 0             ; Return 0 (not newly pressed)
    RET

; Use this in a loop to detect single presses
; Call CheckSpacePress repeatedly
; It returns 1 only on the first frame of a press
```

## Multi-Key Input

### Reading Multiple Keys Simultaneously

```text
; Check for key combinations
CheckKeyCombo:
    ; Check if both Shift and A are pressed
    LD A, $FE           ; Shift row  
    IN A, ($FE)
    AND %00000001       ; Check Shift
    JR NZ, NoShift      ; Jump if Shift not pressed
    
    LD A, $FD           ; A key row
    IN A, ($FE)
    AND %00000001       ; Check A key
    JR NZ, NoShift      ; Jump if A not pressed
    
    ; Both Shift and A are pressed
    LD A, 1
    RET
    
NoShift:
    LD A, 0
    RET
```

### Creating Input States

```text
; Input state byte format:
; Bit 0: Up pressed
; Bit 1: Down pressed  
; Bit 2: Left pressed
; Bit 3: Right pressed
; Bit 4: Fire pressed
; Bit 5: Jump pressed
; Bit 6-7: Unused

ReadAllInput:
    LD E, 0             ; Clear input state
    
    ; Check Up (Q)
    LD A, $FB
    IN A, ($FE)
    AND %00000001
    JR NZ, CheckDown
    SET 0, E            ; Set Up bit
    
CheckDown:
    ; Check Down (A)
    LD A, $FD
    IN A, ($FE)
    AND %00000001
    JR NZ, CheckLeft
    SET 1, E            ; Set Down bit
    
CheckLeft:  
    ; Check Left (O)
    LD A, $DF
    IN A, ($FE)
    AND %00000010
    JR NZ, CheckRight
    SET 2, E            ; Set Left bit
    
CheckRight:
    ; Check Right (P)
    LD A, $DF
    IN A, ($FE)
    AND %00000001
    JR NZ, CheckFire
    SET 3, E            ; Set Right bit
    
CheckFire:
    ; Check Fire (Space)
    LD A, $7F
    IN A, ($FE)
    AND %00000001
    JR NZ, InputDone
    SET 4, E            ; Set Fire bit
    
InputDone:
    LD A, E             ; Return input state in A
    RET
```

**Multi-Key Input System:**

```assembly
; Complete input reading system
ReadGameInput:
    LD B, 0             ; Clear input flags
    
    ; Check Q (Up) - set bit 0 if pressed
    LD A, $FB           ; Q row
    IN A, ($FE)
    AND %00000001       ; Check Q
    JR NZ, SkipUp       ; Jump if not pressed
    SET 0, B            ; Set Up flag
SkipUp:

    ; Check A (Down) - set bit 1 if pressed  
    LD A, $FD           ; A row
    IN A, ($FE)
    AND %00000001       ; Check A
    JR NZ, SkipDown
    SET 1, B            ; Set Down flag
SkipDown:

    ; Check O (Left) - set bit 2 if pressed
    LD A, $DF           ; O row
    IN A, ($FE)
    AND %00000010       ; Check O (bit 1)
    JR NZ, SkipLeft
    SET 2, B            ; Set Left flag
SkipLeft:

    ; Check P (Right) - set bit 3 if pressed
    LD A, $DF           ; P row  
    IN A, ($FE)
    AND %00000001       ; Check P (bit 0)
    JR NZ, SkipRight
    SET 3, B            ; Set Right flag
SkipRight:

    ; Check Space (Fire) - set bit 4 if pressed
    LD A, $7F           ; Space row
    IN A, ($FE)
    AND %00000001       ; Check Space
    JR NZ, SkipFire
    SET 4, B            ; Set Fire flag
SkipFire:

    LD A, B             ; Return input state
    RET

; Input state now in A:
; Bit 0 = Up, Bit 1 = Down, Bit 2 = Left, 
; Bit 3 = Right, Bit 4 = Fire
```

## User Interface Elements

### Menu Navigation

```text
; Simple menu system
MenuItems:
    DB "START GAME", 0
    DB "HIGH SCORES", 0  
    DB "OPTIONS", 0
    DB "EXIT", 0

MenuSelection:
    DB 0                ; Current menu item (0-3)

HandleMenuInput:
    ; Check Down key (move down menu)
    CALL CheckDownKey
    OR A
    JR Z, CheckMenuUp
    
    LD A, (MenuSelection)
    INC A               ; Next menu item
    CP 4                ; Check if past last item
    JR C, SetMenuDown
    LD A, 0             ; Wrap to first item
SetMenuDown:
    LD (MenuSelection), A
    
CheckMenuUp:
    ; Check Up key (move up menu)
    CALL CheckUpKey
    OR A
    JR Z, CheckMenuSelect
    
    LD A, (MenuSelection)
    DEC A               ; Previous menu item
    JP P, SetMenuUp     ; Jump if positive
    LD A, 3             ; Wrap to last item
SetMenuUp:
    LD (MenuSelection), A
    
CheckMenuSelect:
    ; Check Enter key (select menu item)
    CALL CheckEnterKey
    OR A
    RET Z               ; Return if not pressed
    
    ; Execute selected menu item
    LD A, (MenuSelection)
    JP ExecuteMenuItem
```

### Text Input System

```text
; Simple text input buffer
TextBuffer:
    DS 32               ; 32 character buffer
    DB 0                ; String terminator

TextBufferPos:
    DB 0                ; Current position in buffer

HandleTextInput:
    ; Scan all letter keys
    LD B, 8             ; 8 keyboard rows
    LD HL, KeyScanTable ; Table of row values
    
ScanKeys:
    LD A, (HL)          ; Get row value
    IN A, ($FE)         ; Read keyboard
    CPL                 ; Invert bits (1=pressed)
    AND %00011111       ; Mask to 5 bits
    JR Z, NextRow       ; Skip if no keys pressed
    
    ; Process pressed keys in this row
    CALL ProcessRowKeys
    
NextRow:
    INC HL              ; Next row
    DJNZ ScanKeys       ; Continue for all rows
    RET

KeyScanTable:
    DB $FE, $FD, $FB, $F7, $EF, $DF, $BF, $7F
```

<CodeRunner 
  system="zx-spectrum"
  title="Simple User Interface"
  code="; Basic menu system demonstration
; Menu state: 0=Start, 1=Options, 2=Exit
MenuState: DB 0

; Display current menu selection
DisplayMenu:
    ; Simple display of menu options
    LD A, (MenuState)
    OR A
    JR Z, ShowStart
    CP 1
    JR Z, ShowOptions
    ; Must be Exit
    LD HL, $4140        ; Screen position
    LD A, '>'           ; Selection indicator
    LD (HL), A
    RET

ShowStart:
    LD HL, $4100        ; Screen position for Start
    LD A, '>'           ; Selection indicator  
    LD (HL), A
    RET
    
ShowOptions:
    LD HL, $4120        ; Screen position for Options
    LD A, '>'           ; Selection indicator
    LD (HL), A
    RET

; Handle menu navigation
HandleMenu:
    ; Check Q (Up)
    LD A, $FB
    IN A, ($FE)
    AND %00000001
    JR NZ, CheckMenuDown
    
    ; Move up in menu
    LD A, (MenuState)
    DEC A
    JP P, MenuUpOK      ; Jump if positive
    LD A, 2             ; Wrap to bottom
MenuUpOK:
    LD (MenuState), A
    
CheckMenuDown:
    ; Check A (Down)
    LD A, $FD
    IN A, ($FE)
    AND %00000001
    JR NZ, MenuDone
    
    ; Move down in menu
    LD A, (MenuState)
    INC A
    CP 3                ; Check if past last item
    JR C, MenuDownOK
    LD A, 0             ; Wrap to top
MenuDownOK:
    LD (MenuState), A
    
MenuDone:
    CALL DisplayMenu    ; Update display
    RET"
  language="assembly"
/>

## Advanced Input Techniques

### Key Repeat Handling

```text
; Key repeat system
KeyRepeatDelay:
    DB 30               ; Initial delay (frames)
KeyRepeatRate:  
    DB 5                ; Repeat rate (frames)
KeyRepeatCounter:
    DB 0                ; Current counter

HandleKeyRepeat:
    CALL ReadKey        ; Read key state
    OR A
    JR NZ, KeyReleased  ; Jump if key not pressed
    
    ; Key is pressed - check repeat timing
    LD A, (KeyRepeatCounter)
    DEC A
    LD (KeyRepeatCounter), A
    RET NZ              ; Return if not time to repeat
    
    ; Time to repeat - reset counter
    LD A, (KeyRepeatRate)
    LD (KeyRepeatCounter), A
    
    ; Return "key pressed" signal
    LD A, 1
    RET
    
KeyReleased:
    ; Reset repeat system
    LD A, (KeyRepeatDelay)
    LD (KeyRepeatCounter), A
    LD A, 0
    RET
```

### Joystick Interface

```text
; Kempston joystick interface (port $1F)
ReadJoystick:
    IN A, ($1F)         ; Read joystick port
    ; Bit 0: Right
    ; Bit 1: Left  
    ; Bit 2: Down
    ; Bit 3: Up
    ; Bit 4: Fire
    RET                 ; Return joystick state in A
```

## Input System Integration

### Complete Input Manager

```text
; Input manager that handles keyboard and joystick
InputManager:
    ; First try joystick
    CALL ReadJoystick
    OR A
    JR NZ, JoystickFound ; Jump if joystick active
    
    ; No joystick - use keyboard
    CALL ReadKeyboard
    RET
    
JoystickFound:
    ; Convert joystick format to standard input format
    CALL ConvertJoystickInput
    RET

ConvertJoystickInput:
    ; Convert joystick bits to standard input format
    LD B, A             ; Save joystick state
    LD A, 0             ; Clear result
    
    BIT 0, B            ; Check Right
    JR Z, CheckJoyLeft
    OR %00001000        ; Set Right bit
    
CheckJoyLeft:
    BIT 1, B            ; Check Left
    JR Z, CheckJoyDown
    OR %00000100        ; Set Left bit
    
    ; Continue for all directions...
    RET
```

## Practice Exercise

Create a complete interactive program that demonstrates:

1. Multi-key input reading (movement + action keys)
2. Menu navigation with up/down keys
3. Key debouncing for single-press actions
4. A simple game loop that responds to user input
5. User interface elements like selection indicators

**Practice Exercise - Interactive Demo:**

```assembly
; Interactive demonstration program
; Player position on screen
PlayerX: DB 10
PlayerY: DB 5

; Game state
GameMode: DB 0      ; 0=menu, 1=game

; Main input handling loop
MainLoop:
    LD A, (GameMode)
    OR A
    JR Z, HandleMenuMode
    
    ; Game mode - handle player movement
    CALL HandleGameInput
    CALL UpdatePlayerPosition
    JR MainLoop
    
HandleMenuMode:
    ; Menu mode - handle menu navigation
    CALL HandleMenuInput
    ; Check for Enter key to start game
    LD A, $BF           ; Enter key row
    IN A, ($FE)
    AND %00000001       ; Check Enter
    JR NZ, MainLoop     ; Continue if not pressed
    
    ; Enter pressed - start game
    LD A, 1
    LD (GameMode), A
    JR MainLoop

HandleGameInput:
    ; Read movement keys
    LD A, $FB           ; Q (Up)
    IN A, ($FE)
    AND %00000001
    JR NZ, CheckGameDown
    ; Move up
    LD HL, PlayerY
    LD A, (HL)
    DEC A
    LD (HL), A
    
CheckGameDown:
    LD A, $FD           ; A (Down)  
    IN A, ($FE)
    AND %00000001
    JR NZ, CheckGameLeft
    ; Move down
    LD HL, PlayerY
    LD A, (HL)
    INC A
    LD (HL), A
    
CheckGameLeft:
    LD A, $DF           ; O (Left)
    IN A, ($FE)
    AND %00000010
    JR NZ, CheckGameRight
    ; Move left
    LD HL, PlayerX
    LD A, (HL)
    DEC A
    LD (HL), A
    
CheckGameRight:
    LD A, $DF           ; P (Right)
    IN A, ($FE)
    AND %00000001
    JR NZ, GameInputDone
    ; Move right
    LD HL, PlayerX
    LD A, (HL)
    INC A
    LD (HL), A
    
GameInputDone:
    RET

UpdatePlayerPosition:
    ; Simple position display (put player character on screen)
    ; This is a simplified version - real version would 
    ; calculate proper screen address
    LD A, (PlayerX)
    LD B, A
    LD A, (PlayerY)  
    LD C, A
    ; Position now in B,C - display player there
    RET

HandleMenuInput:
    ; Simple menu input handling
    ; Just check for basic key presses
    RET
```

## Input System Best Practices

### Performance Considerations

1. **Read keys efficiently** - scan only necessary rows
2. **Cache key states** - avoid repeated port reads
3. **Use lookup tables** - for complex key mappings
4. **Minimize processing** - only handle changed keys

### User Experience

1. **Provide visual feedback** - show current selection
2. **Handle key repeat** - for continuous actions
3. **Support multiple input methods** - keyboard + joystick
4. **Implement proper debouncing** - prevent double-actions

## What You've Learned

In this essential lesson, you've mastered:

- Understanding the ZX Spectrum's keyboard matrix system
- Reading individual keys and key combinations
- Implementing key debouncing for reliable input
- Creating multi-key input systems for games
- Building user interface elements with keyboard navigation
- Handling key repeat and advanced input techniques
- Integrating input systems with program flow

## Looking Ahead

Next, you'll learn about **conditional jumps and branching** - using your input reading skills to create dynamic program flow that responds to user actions and game conditions!

## Fun Fact

The ZX Spectrum's membrane keyboard was initially criticized for being difficult to use, but it had one major advantage for programmers: it was extremely reliable and had very consistent electrical characteristics. Unlike mechanical keyboards that could vary in their switch timing and bounce characteristics, the membrane keyboard's predictable behavior made it easier to write reliable input routines. Many professional Spectrum games used sophisticated input systems that could detect subtle timing differences between key presses, enabling complex control schemes and even primitive chord recognition. The keyboard's matrix design also made it possible to read multiple keys simultaneously, which was not always possible on other computers of the era!