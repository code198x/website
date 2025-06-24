---
title: "Character and Sprite Graphics"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 13
description: "Learn to create and manage character sets and sprite graphics. Master techniques for drawing text, creating animated sprites, and building reusable graphics routines."
learning_objectives:
  - "Understand character set design and storage"
  - "Create efficient text display routines"
  - "Learn sprite graphics fundamentals"
  - "Master sprite animation techniques"
  - "Build reusable graphics libraries"
concepts:
  - "Character set design (8x8 bitmaps)"
  - "Text rendering routines"
  - "Sprite data structures"
  - "Animation frame management"
  - "Graphics routine libraries"
estimated_duration: "50-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 13
---

# Lesson 13: Character and Sprite Graphics

Graphics on the ZX Spectrum revolve around 8×8 pixel character cells. In this lesson, you'll learn to create custom character sets, manage sprite graphics, and build efficient routines for displaying text and animated objects.

## Understanding Character Graphics

### What is a Character Set?

A character set is a collection of 8×8 pixel patterns, each representing a letter, number, symbol, or graphic element:

```
Character 'A' (8 bytes):
%00111100  →  ████
%01100110  → █  ██
%11000011  → ██   ██
%11000011  → ██   ██
%11111111  → ████████
%11000011  → ██   ██
%11000011  → ██   ██
%00000000  → (blank)
```

Each character requires 8 bytes of storage - one byte per horizontal pixel row.

## Creating a Custom Character Set

### Designing Character Data

```text
; Custom character set data
CharacterSet:
    ; Character 0: Block
    DB %11111111, %11111111, %11111111, %11111111
    DB %11111111, %11111111, %11111111, %11111111
    
    ; Character 1: Diamond  
    DB %00010000, %00111000, %01111100, %11111110
    DB %11111110, %01111100, %00111000, %00010000
    
    ; Character 2: Heart
    DB %00000000, %01101100, %11111110, %11111110
    DB %01111100, %00111000, %00010000, %00000000
    
    ; Character 3: Smile
    DB %00111100, %01000010, %10100101, %10000001
    DB %10100101, %10011001, %01000010, %00111100
```

<CodeRunner 
  system="zx-spectrum"
  title="Character Set Definition"
  code="; Define custom character patterns
; Character 0: Solid block
CharBlock:
    DB %11111111, %11111111, %11111111, %11111111
    DB %11111111, %11111111, %11111111, %11111111

; Character 1: Diamond shape  
CharDiamond:
    DB %00010000, %00111000, %01111100, %11111110
    DB %11111110, %01111100, %00111000, %00010000

; Character 2: Cross pattern
CharCross:
    DB %00010000, %00010000, %11111111, %11111111
    DB %11111111, %11111111, %00010000, %00010000

; We'll use these patterns in our display routine"
  language="assembly"
/>

### Character Display Routine

```text
; Display character routine
; Input: A = character number, DE = screen position
DisplayCharacter:
    ; Calculate character data address
    LD HL, CharacterSet     ; Base of character set
    LD B, 0
    LD C, A                 ; Character number in BC
    SLA C                   ; Multiply by 8 (8 bytes per char)
    RL B
    SLA C
    RL B  
    SLA C
    RL B                    ; BC = character * 8
    ADD HL, BC              ; HL points to character data
    
    ; Copy 8 bytes to screen
    LD B, 8                 ; 8 rows per character
DrawCharLoop:
    LD A, (HL)              ; Get character row data
    LD (DE), A              ; Put on screen
    INC HL                  ; Next character row
    LD A, D                 ; Move screen position down
    ADD A, $20              ; Next screen row (32 bytes)
    LD D, A
    DJNZ DrawCharLoop       ; Repeat for all 8 rows
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Character Display Routine"
  code="; Simple character display demonstration
; Place some character data in memory first
LD HL, $6000        ; Use memory area for character data

; Store diamond pattern
LD (HL), %00010000  ; Row 0
INC HL
LD (HL), %00111000  ; Row 1
INC HL  
LD (HL), %01111100  ; Row 2
INC HL
LD (HL), %11111110  ; Row 3
INC HL
LD (HL), %11111110  ; Row 4
INC HL
LD (HL), %01111100  ; Row 5
INC HL
LD (HL), %00111000  ; Row 6  
INC HL
LD (HL), %00010000  ; Row 7

; Now display it at screen position (5,5)
LD HL, $6000        ; Character data
LD DE, $40A5        ; Screen position (5,5)
LD B, 8             ; 8 rows

DisplayLoop:
    LD A, (HL)      ; Get character row
    LD (DE), A      ; Put on screen
    INC HL          ; Next data row
    LD A, E         ; Move screen position
    ADD A, $20      ; Down one row (32 bytes)
    LD E, A
    JR NC, NoCarry
    INC D           ; Handle carry to high byte
NoCarry:
    DJNZ DisplayLoop"
  language="assembly"
/>

## Text Display System

### String Display Routine

```text
; Display text string
; Input: HL = pointer to string, DE = screen position
DisplayString:
    LD A, (HL)              ; Get character from string
    OR A                    ; Check for zero terminator
    RET Z                   ; Return if end of string
    
    PUSH HL                 ; Save string pointer
    PUSH DE                 ; Save screen position
    CALL DisplayCharacter   ; Display current character
    POP DE                  ; Restore screen position
    POP HL                  ; Restore string pointer
    
    INC HL                  ; Next character in string
    INC DE                  ; Next screen position (right)
    JR DisplayString        ; Continue with next character
```

### Message System

```text
; Game message system
GameMessages:
MessageHello:   DB "HELLO WORLD", 0
MessageScore:   DB "SCORE:", 0  
MessageLives:   DB "LIVES:", 0
MessageGameOver: DB "GAME OVER", 0

; Display message routine
; Input: A = message number
DisplayMessage:
    ; Calculate message address
    LD HL, MessageTable
    LD B, 0
    LD C, A
    ADD HL, BC
    ADD HL, BC              ; Each entry is 2 bytes
    LD A, (HL)              ; Get message address low
    INC HL
    LD H, (HL)              ; Get message address high
    LD L, A                 ; HL = message address
    
    LD DE, $4000            ; Display at top of screen
    CALL DisplayString      ; Display the message
    RET

MessageTable:
    DW MessageHello, MessageScore, MessageLives, MessageGameOver
```

<CodeRunner 
  system="zx-spectrum"
  title="Simple Text Display"
  code="; Simple text display using ASCII values
; Create a message in memory
LD HL, $6100        ; Message storage area
LD (HL), $48        ; 'H'
INC HL
LD (HL), $45        ; 'E'  
INC HL
LD (HL), $4C        ; 'L'
INC HL
LD (HL), $4C        ; 'L'
INC HL
LD (HL), $4F        ; 'O'
INC HL
LD (HL), $00        ; String terminator

; Display the message
LD HL, $6100        ; Point to message
LD DE, $4040        ; Screen position (2,0)

DisplayText:
    LD A, (HL)      ; Get character
    OR A            ; Check for terminator
    JR Z, TextDone  ; Jump if end of string
    
    ; For simplicity, just put ASCII directly on screen
    ; (Real system would convert ASCII to character patterns)
    LD (DE), A      ; Put character on screen
    INC HL          ; Next character
    INC DE          ; Next screen position
    JR DisplayText  ; Continue

TextDone:
    ; Text display complete"
  language="assembly"
/>

## Sprite Graphics System

### Sprite Data Structure

```text
; Sprite definition structure
SpriteData:
    ; Sprite 0: Player ship
    DB %00010000    ; Frame 0
    DB %00111000
    DB %01111100  
    DB %11111110
    DB %11111110
    DB %01111100
    DB %00111000
    DB %00010000
    
    DB %00001000    ; Frame 1 (slight variation)
    DB %00011100
    DB %00111110
    DB %01111111
    DB %01111111
    DB %00111110
    DB %00011100
    DB %00001000
```

### Sprite Display Routine

```text
; Display sprite with background saving
; Input: A = sprite number, BC = screen position
DisplaySprite:
    ; Save background first
    CALL SaveBackground
    
    ; Calculate sprite data address  
    LD HL, SpriteData
    LD DE, 0
    LD E, A                 ; Sprite number
    SLA E                   ; × 2
    RL D
    SLA E                   ; × 4
    RL D
    SLA E                   ; × 8 (8 bytes per sprite)
    RL D
    ADD HL, DE              ; HL points to sprite data
    
    ; Draw sprite
    LD B, 8                 ; 8 rows
    LD DE, BC               ; Screen position
DrawSpriteLoop:
    LD A, (HL)              ; Get sprite row
    LD (DE), A              ; Draw on screen
    INC HL                  ; Next sprite row
    ; Move to next screen row
    LD A, E
    ADD A, 32
    LD E, A
    JR NC, NoSpriteCarry
    INC D
NoSpriteCarry:
    DJNZ DrawSpriteLoop
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Simple Sprite Display"
  code="; Create and display a simple sprite
; Define sprite data
LD HL, $6200        ; Sprite data area

; Create a simple spaceship sprite
LD (HL), %00010000  ; Row 0:    █
INC HL
LD (HL), %00111000  ; Row 1:   ███
INC HL
LD (HL), %01111100  ; Row 2:  █████
INC HL
LD (HL), %11111110  ; Row 3: ███████
INC HL
LD (HL), %11111110  ; Row 4: ███████
INC HL
LD (HL), %01111100  ; Row 5:  █████
INC HL
LD (HL), %00111000  ; Row 6:   ███
INC HL
LD (HL), %00010000  ; Row 7:    █

; Display sprite at position (8,8)
LD HL, $6200        ; Sprite data
LD DE, $4908        ; Screen position (8,8) - middle third
LD B, 8             ; 8 rows

SpriteLoop:
    LD A, (HL)      ; Get sprite row
    LD (DE), A      ; Draw on screen
    INC HL          ; Next sprite row
    LD A, E         ; Move screen position down
    ADD A, $20      ; Next row (32 bytes)
    LD E, A
    JR NC, NoCarry2
    INC D           ; Handle carry
NoCarry2:
    DJNZ SpriteLoop ; Continue for all rows"
  language="assembly"
/>

## Sprite Animation System

### Animation Frame Management

```text
; Sprite animation structure
SpriteAnimations:
PlayerWalk:
    DB 4                    ; Number of frames
    DB 0, 1, 2, 1          ; Frame sequence
    
PlayerShoot:
    DB 2                    ; Number of frames  
    DB 3, 4                ; Frame sequence

; Animation state for each sprite
SpriteStates:
    DB 0, 0, 0, 0          ; Current frame for each sprite
    DB 0, 0, 0, 0          ; Animation counter for each sprite
```

### Animation Update Routine

```text
; Update sprite animation
; Input: A = sprite number
UpdateSpriteAnimation:
    LD HL, SpriteStates
    LD B, 0
    LD C, A
    ADD HL, BC              ; Point to sprite state
    
    LD A, (HL)              ; Get current frame
    INC A                   ; Next frame
    CP 4                    ; Check if past last frame
    JR C, SetFrame          ; Jump if still valid
    LD A, 0                 ; Reset to first frame
SetFrame:
    LD (HL), A              ; Store new frame
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Animation Frame Demo"
  code="; Simple 2-frame animation demo
; Frame 0 of sprite
LD HL, $6300
LD (HL), %00111100  ; ████
INC HL
LD (HL), %01000010  ; █    █
INC HL
LD (HL), %10100101  ; █ █  █ █
INC HL
LD (HL), %10000001  ; █      █
INC HL
LD (HL), %10011001  ; █  ██  █
INC HL
LD (HL), %10100101  ; █ █  █ █
INC HL
LD (HL), %01000010  ; █    █
INC HL
LD (HL), %00111100  ; ████

; Frame 1 of sprite (eyes closed)
LD (HL), %00111100  ; ████
INC HL
LD (HL), %01000010  ; █    █
INC HL
LD (HL), %10000001  ; █      █
INC HL
LD (HL), %10000001  ; █      █
INC HL
LD (HL), %10011001  ; █  ██  █
INC HL
LD (HL), %10100101  ; █ █  █ █
INC HL
LD (HL), %01000010  ; █    █
INC HL
LD (HL), %00111100  ; ████

; Display frame 0
LD HL, $6300        ; Frame 0 data
LD DE, $40C6        ; Screen position
LD B, 8

Frame0:
    LD A, (HL)
    LD (DE), A
    INC HL
    LD A, E
    ADD A, $20
    LD E, A
    JR NC, NoCarry3
    INC D
NoCarry3:
    DJNZ Frame0

; Simple delay, then show frame 1
; (In real animation, you'd cycle between frames)"
  language="assembly"
/>

## Sprite Movement and Collision

### Moving Sprites

```text
; Sprite position structure
SpritePositions:
    DB 100, 50             ; Sprite 0: X, Y
    DB 120, 80             ; Sprite 1: X, Y
    DB 140, 110            ; Sprite 2: X, Y

; Move sprite routine
; Input: A = sprite number, B = X delta, C = Y delta
MoveSprite:
    ; Calculate position address
    LD HL, SpritePositions
    SLA A                   ; × 2 (2 bytes per sprite)
    LD D, 0
    LD E, A
    ADD HL, DE              ; Point to sprite position
    
    ; Update X position
    LD A, (HL)              ; Get current X
    ADD A, B                ; Add delta
    LD (HL), A              ; Store new X
    INC HL
    
    ; Update Y position  
    LD A, (HL)              ; Get current Y
    ADD A, C                ; Add delta
    LD (HL), A              ; Store new Y
    RET
```

### Simple Collision Detection

```text
; Check if two sprites overlap
; Input: A = sprite 1, B = sprite 2
; Output: Zero flag set if collision
CheckCollision:
    ; Get sprite 1 position
    LD HL, SpritePositions
    SLA A
    LD D, 0
    LD E, A
    ADD HL, DE
    LD C, (HL)              ; Sprite 1 X
    INC HL
    LD D, (HL)              ; Sprite 1 Y
    
    ; Get sprite 2 position
    LD HL, SpritePositions
    SLA B
    LD A, B
    LD E, A
    ADD HL, DE
    LD A, (HL)              ; Sprite 2 X
    INC HL
    LD B, (HL)              ; Sprite 2 Y
    
    ; Check X overlap
    SUB C                   ; Difference in X
    JP P, CheckPositive     ; Make absolute
    NEG                     ; Negate if negative
CheckPositive:
    CP 8                    ; Less than 8 pixels apart?
    RET NC                  ; Return no collision if >= 8
    
    ; Check Y overlap
    LD A, B
    SUB D                   ; Difference in Y  
    JP P, CheckPositive2
    NEG
CheckPositive2:
    CP 8                    ; Less than 8 pixels apart?
    RET                     ; Zero flag indicates collision
```

## Graphics Library Organization

### Reusable Graphics Routines

```text
; Graphics library header
GraphicsLib:
    ; Character routines
    JP DisplayCharacter     ; Display single character
    JP DisplayString        ; Display text string
    JP ClearScreen          ; Clear entire screen
    
    ; Sprite routines  
    JP DisplaySprite        ; Display sprite
    JP MoveSprite           ; Move sprite position
    JP UpdateAnimation      ; Update sprite animation
    JP CheckCollision       ; Collision detection
    
    ; Effect routines
    JP ScrollLeft           ; Scroll screen left
    JP FlashScreen          ; Flash screen effect
    JP DrawLine             ; Draw line between points
```

## Practice Exercise

Create a complete character and sprite demo that:

1. Defines a custom character set with at least 4 different patterns
2. Creates a sprite with 2 animation frames
3. Displays text using your character set
4. Shows an animated sprite moving across the screen
5. Demonstrates collision detection between sprites

<CodeRunner 
  system="zx-spectrum"
  title="Practice Exercise - Graphics Demo"
  code="; Complete graphics demonstration
; 1. Define custom characters
LD HL, $6400        ; Character data area

; Character 0: Solid block
LD (HL), %11111111 : INC HL
LD (HL), %11111111 : INC HL
LD (HL), %11111111 : INC HL
LD (HL), %11111111 : INC HL
LD (HL), %11111111 : INC HL
LD (HL), %11111111 : INC HL
LD (HL), %11111111 : INC HL
LD (HL), %11111111 : INC HL

; Character 1: Diamond
LD (HL), %00010000 : INC HL
LD (HL), %00111000 : INC HL
LD (HL), %01111100 : INC HL
LD (HL), %11111110 : INC HL
LD (HL), %11111110 : INC HL
LD (HL), %01111100 : INC HL
LD (HL), %00111000 : INC HL
LD (HL), %00010000 : INC HL

; 2. Display characters to form a pattern
LD HL, $6400        ; Block character
LD DE, $4020        ; Screen position
LD B, 8
DisplayBlock:
    LD A, (HL)
    LD (DE), A
    INC HL
    LD A, E
    ADD A, $20
    LD E, A
    JR NC, NoCB1
    INC D
NoCB1:
    DJNZ DisplayBlock

; 3. Display diamond next to block
LD HL, $6408        ; Diamond character data
LD DE, $4021        ; Next screen position
LD B, 8
DisplayDiamond:
    LD A, (HL)
    LD (DE), A
    INC HL
    LD A, E
    ADD A, $20
    LD E, A
    JR NC, NoCB2
    INC D
NoCB2:
    DJNZ DisplayDiamond

; This creates a simple graphics display
; Extend this with animation and movement!"
  language="assembly"
/>

## What You've Learned

In this comprehensive lesson, you've mastered:

- Creating custom character sets with 8×8 pixel patterns
- Building efficient character and text display routines
- Designing sprite graphics with multiple animation frames
- Implementing sprite movement and positioning systems
- Creating collision detection algorithms
- Organizing graphics code into reusable library routines
- Managing animation states and frame sequences

## Looking Ahead

Next, you'll learn about **data structures and arrays** - organizing your game data efficiently to support complex graphics systems, multiple sprites, and interactive gameplay elements!

## Fun Fact

The ZX Spectrum's character-based graphics system was both a limitation and a creative catalyst. While it couldn't display arbitrary pixel graphics as easily as some computers, the 8×8 character cell constraint led to a distinctive visual style that became iconic. Many classic Spectrum games used creative character designs to simulate higher resolution graphics - combining multiple characters to form larger sprites, using attribute clash creatively as a visual effect, and developing innovative animation techniques within the 8×8 framework. This constraint-driven creativity became a hallmark of Spectrum game design and influenced an entire generation of programmers to think creatively about working within limitations!