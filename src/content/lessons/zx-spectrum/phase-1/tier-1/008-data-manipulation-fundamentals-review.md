---
title: "Data Manipulation Fundamentals Review"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 8
description: "Comprehensive review of Z80 data manipulation fundamentals. Integrate all concepts from lessons 2-7 into sophisticated programming projects and real-world applications."
learning_objectives:
  - "Integrate all Z80 data manipulation concepts learned"
  - "Apply addressing modes and arithmetic in complex scenarios"
  - "Build sophisticated programs using multiple Z80 techniques"
  - "Demonstrate understanding of professional Z80 programming"
  - "Prepare for advanced memory and addressing topics"
concepts:
  - "Integration of all Z80 addressing modes"
  - "Combined arithmetic and logical operations"
  - "Advanced data manipulation patterns"
  - "Professional Z80 programming techniques"
  - "Real-world application development"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 8
---

# Lesson 8: Data Manipulation Fundamentals Review

Congratulations! You've learned the core fundamentals of Z80 data manipulation. Today we'll integrate everything from lessons 2-7 into sophisticated projects that demonstrate your growing expertise in professional Z80 assembly programming.

## Complete Skill Overview

Over the past 6 lessons, you've learned essential Z80 programming concepts:

### Lesson 2: Z80 Registers and Memory Basics
- **LD instruction variations** for loading and storing data
- **ZX Spectrum memory layout** and screen programming
- **Register pairs** (HL, DE, BC) for 16-bit operations
- **Basic memory access** patterns and techniques

### Lesson 3: Z80 Addressing Modes Fundamentals
- **Immediate addressing** for literal values
- **Direct addressing** for specific memory locations
- **Register indirect addressing** for flexible memory access
- **Efficiency considerations** for optimal performance

### Lesson 4: Z80 Status Flags and Condition Codes
- **Status flags** (Z, C, S, P/V) and their meanings
- **Conditional jumps** for program decision making
- **Compare operations** using CP instruction
- **Smart programming** with flag-based logic

### Lesson 5: Z80 Arithmetic Operations
- **Addition and subtraction** with carry handling
- **16-bit arithmetic** using register pairs
- **Mathematical programming** patterns
- **BCD arithmetic** for decimal calculations

### Lesson 6: Z80 Increment, Decrement and Bit Operations
- **INC/DEC operations** for efficient counting
- **Bit manipulation** (BIT, SET, RES) for precise control
- **Shift and rotate** operations for data processing
- **Practical bit programming** techniques

### Lesson 7: Z80 Logical Operations and Shift Instructions
- **Advanced logical operations** (AND, OR, XOR, CPL)
- **Data packing and unpacking** for efficient storage
- **Algorithmic applications** of bit manipulation
- **Performance optimization** techniques

## Integrated Programming Project

Let's build a sophisticated program that uses **ALL** the techniques you've learned:

### Project: Advanced Graphics Pattern Generator

This project will demonstrate:
- Multiple addressing modes for different data types
- Arithmetic operations for coordinate calculations
- Bit manipulation for pixel control
- Logical operations for pattern generation
- Status flags for program flow control

<CodeRunner 
  system="zx-spectrum"
  title="Advanced Graphics Pattern Generator"
  code="; Advanced Graphics Pattern Generator
; Demonstrates integration of all Z80 data manipulation concepts

PatternGenerator:
    ; Initialize the graphics system
    CALL InitGraphics
    
    ; Generate multiple pattern types
    CALL DrawCheckerboard
    CALL DrawSineWave
    CALL DrawSpiral
    CALL DrawFractalPattern
    
    ; Add interactive elements
    CALL AnimatePatterns
    
    RET

;=============================================================================
; GRAPHICS INITIALIZATION (Lesson 2: Memory Basics)
;=============================================================================

InitGraphics:
    ; Clear screen using efficient memory techniques
    LD HL, $4000            ; Screen memory start (direct addressing)
    LD DE, $4001            ; Destination for block copy
    LD BC, $17FF            ; Screen size - 1
    LD (HL), $00            ; Clear first byte
    LDIR                    ; Block copy to clear screen (register indirect)
    
    ; Set up attribute memory with colour pattern
    LD HL, $5800            ; Attribute memory start
    LD B, 24                ; 24 rows
    LD C, $01               ; Starting colour
    
AttributeLoop:
    LD D, 32                ; 32 columns per row
AttributeRowLoop:
    LD (HL), C              ; Set attribute (register indirect)
    INC HL                  ; Next position (increment)
    DEC D                   ; Decrement column counter
    JR NZ, AttributeRowLoop ; Continue row
    
    INC C                   ; Next colour (increment)
    LD A, C                 ; Check colour range
    AND %00000111           ; Keep in range 0-7 (logical AND)
    LD C, A                 ; Store masked colour
    DJNZ AttributeLoop      ; Next row (decrement and jump)
    
    RET

;=============================================================================
; CHECKERBOARD PATTERN (Lesson 3: Addressing Modes)
;=============================================================================

DrawCheckerboard:
    ; Draw 8x8 checkerboard using multiple addressing modes
    LD B, 16                ; 16 rows (immediate addressing)
    LD HL, $4000            ; Start position (immediate addressing)
    
CheckerRowLoop:
    LD C, 32                ; 32 bytes per row (immediate addressing)
    LD A, B                 ; Get row number
    AND %00000001           ; Test odd/even row (logical AND)
    JR Z, EvenCheckerRow    ; Jump if even row (conditional jump)
    
    ; Odd row pattern
OddCheckerRow:
    LD A, %10101010         ; Alternating pattern (immediate addressing)
    JR StoreCheckerRow
    
    ; Even row pattern  
EvenCheckerRow:
    LD A, %01010101         ; Opposite pattern (immediate addressing)
    
StoreCheckerRow:
    LD (HL), A              ; Store pattern (register indirect)
    INC HL                  ; Next position (increment)
    DEC C                   ; Decrement counter
    JR NZ, StoreCheckerRow  ; Continue row (conditional jump)
    
    ; Move to next row (skip to next character line)
    LD DE, 224              ; Bytes to skip (immediate addressing)
    ADD HL, DE              ; Add offset (16-bit arithmetic)
    
    DJNZ CheckerRowLoop     ; Next row (decrement and branch)
    RET

;=============================================================================
; SINE WAVE PATTERN (Lesson 5: Arithmetic Operations)
;=============================================================================

DrawSineWave:
    ; Generate sine wave using arithmetic operations
    LD HL, $4800            ; Middle of screen
    LD B, 255               ; Number of points
    LD C, 0                 ; Angle counter
    
SineLoop:
    ; Calculate sine approximation using arithmetic
    LD A, C                 ; Get angle
    
    ; Simple sine approximation: sin(x) ≈ x for small x
    ; More sophisticated: use triangle wave approximation
    CP 128                  ; Compare with half period (compare operation)
    JR C, FirstHalf         ; First half of sine wave
    
    ; Second half - invert
    LD D, A                 ; Save angle
    LD A, 255               ; Maximum value (immediate addressing)
    SUB D                   ; Subtract angle (arithmetic subtraction)
    
FirstHalf:
    ; Scale amplitude (arithmetic operations)
    SRL A                   ; Divide by 2 (shift right)
    SRL A                   ; Divide by 4 
    SRL A                   ; Divide by 8 (final amplitude)
    
    ; Calculate Y position
    LD D, A                 ; Save sine value
    LD A, 12                ; Middle row
    ADD A, D                ; Add sine offset (arithmetic addition)
    
    ; Calculate screen address (complex addressing)
    LD E, A                 ; Y coordinate
    LD A, E                 ; Get Y
    SLA A                   ; Multiply by 32 (shift operations)
    SLA A
    SLA A
    SLA A
    SLA A                   ; Y * 32
    LD L, A                 ; Low byte of offset
    LD H, $40               ; Screen base high byte
    
    ; Add X coordinate
    LD A, C                 ; Get X coordinate (angle)
    SRL A                   ; Scale X position
    ADD A, L                ; Add to screen address (arithmetic)
    LD L, A                 ; Store final address
    JR NC, NoCarry          ; Check for carry (status flags)
    INC H                   ; Handle carry
NoCarry:
    
    ; Draw point
    LD A, %11111111         ; Solid pixel pattern
    LD (HL), A              ; Draw point (register indirect)
    
    INC C                   ; Next angle (increment)
    DJNZ SineLoop           ; Continue (decrement and branch)
    RET

;=============================================================================
; SPIRAL PATTERN (Lesson 6: Bit Operations and Increment/Decrement)
;=============================================================================

DrawSpiral:
    ; Draw spiral using coordinate manipulation
    LD HL, SpiralCenter     ; Point to center coordinates
    LD A, (HL)              ; Get center X (direct addressing)
    LD (CurrentX), A        ; Store current X
    INC HL                  ; Next coordinate
    LD A, (HL)              ; Get center Y
    LD (CurrentY), A        ; Store current Y
    
    LD A, 1                 ; Starting radius
    LD (Radius), A
    LD A, 0                 ; Starting angle
    LD (Angle), A
    
    LD B, 100               ; Number of spiral points
    
SpiralLoop:
    ; Calculate X offset using bit operations
    LD A, (Angle)           ; Get current angle
    AND %00111111           ; Mask to create triangle wave (logical AND)
    CP 32                   ; Compare with quarter period
    JR C, AngleFirstQuad    ; First quadrant
    
    ; Second quadrant - invert
    LD C, A                 ; Save angle
    LD A, 63                ; Maximum
    SUB C                   ; Invert (arithmetic subtraction)
    
AngleFirstQuad:
    ; Scale by radius (arithmetic multiplication using shifts)
    LD C, A                 ; Save scaled angle
    LD A, (Radius)          ; Get radius
    LD D, 0                 ; Clear high byte
    LD E, C                 ; Scaled angle in E
    
    ; Multiply radius by angle approximation
    ; Simple version: just use angle as offset
    LD A, (CurrentX)        ; Get center X
    ADD A, C                ; Add X offset (arithmetic addition)
    LD (SpiralX), A         ; Store spiral X
    
    ; Calculate Y coordinate similarly
    LD A, (Angle)           ; Get angle for Y calculation
    ADD A, 16               ; Phase shift for Y (90 degrees)
    AND %00111111           ; Wrap angle
    CP 32
    JR C, YFirstQuad
    LD C, A
    LD A, 63
    SUB C
YFirstQuad:
    LD A, (CurrentY)        ; Get center Y
    ADD A, C                ; Add Y offset
    LD (SpiralY), A         ; Store spiral Y
    
    ; Convert coordinates to screen address
    CALL CalculateScreenAddress
    
    ; Draw spiral point with bit pattern
    LD A, (Angle)           ; Use angle for pattern
    AND %00000111           ; Create 3-bit pattern (logical AND)
    LD C, A                 ; Save pattern selector
    
    ; Create bit pattern based on angle
    LD A, %00000001         ; Start with single bit
    INC C                   ; Avoid zero shifts
PatternShift:
    DEC C                   ; Decrement shift counter
    JR Z, PatternReady      ; Pattern ready
    SLA A                   ; Shift pattern left (bit operations)
    JR PatternShift         ; Continue shifting
    
PatternReady:
    LD (HL), A              ; Draw pattern (register indirect)
    
    ; Update spiral parameters
    LD A, (Angle)           ; Get angle
    ADD A, 5                ; Increment angle step (arithmetic)
    LD (Angle), A           ; Store new angle
    
    ; Gradually increase radius
    LD A, (Radius)          ; Get radius
    INC A                   ; Increment radius (increment operation)
    CP 20                   ; Check maximum radius
    JR C, RadiusOK          ; Keep radius
    LD A, 1                 ; Reset to minimum radius
RadiusOK:
    LD (Radius), A          ; Store new radius
    
    DJNZ SpiralLoop         ; Continue spiral (decrement and branch)
    RET

; Helper function to calculate screen address
CalculateScreenAddress:
    ; Input: SpiralX, SpiralY contain coordinates
    ; Output: HL contains screen address
    LD A, (SpiralY)         ; Get Y coordinate
    AND %00011111           ; Limit to screen range (logical AND)
    LD L, A                 ; Y in L
    
    ; Calculate Y * 32 (shift operations)
    LD A, L                 ; Get Y
    SLA A                   ; Y * 2
    SLA A                   ; Y * 4
    SLA A                   ; Y * 8
    SLA A                   ; Y * 16
    SLA A                   ; Y * 32
    LD L, A                 ; Store Y offset
    
    ; Add X coordinate
    LD A, (SpiralX)         ; Get X coordinate
    AND %00011111           ; Limit to screen range
    ADD A, L                ; Add to Y offset (arithmetic addition)
    LD L, A                 ; Store final low address
    
    ; Calculate high byte
    LD A, $40               ; Screen base
    LD H, A                 ; Set high byte
    RET

;=============================================================================
; FRACTAL PATTERN (Lesson 7: Advanced Logical Operations)
;=============================================================================

DrawFractalPattern:
    ; Generate fractal-like pattern using bit manipulation
    LD HL, $5000            ; Lower screen area
    LD B, 64                ; Pattern size
    LD C, 0                 ; Pattern seed
    
FractalLoop:
    ; Generate pseudo-random pattern using XOR feedback
    LD A, C                 ; Get current seed
    LD D, A                 ; Save original
    
    ; Create feedback using bit operations
    SRL A                   ; Shift right (bit operations)
    XOR D                   ; XOR with original (logical XOR)
    SRL A                   ; Shift again
    XOR D                   ; XOR again
    AND %00000001           ; Extract feedback bit (logical AND)
    
    ; Shift seed and add feedback
    LD A, D                 ; Get original seed
    SLA A                   ; Shift left (bit operations)
    OR D                    ; Add feedback bit (logical OR) - simplified
    LD C, A                 ; Store new seed
    
    ; Create complex pattern using multiple operations
    LD A, C                 ; Get seed
    XOR B                   ; XOR with loop counter (logical XOR)
    LD D, A                 ; Save result
    
    ; Apply bit manipulation to create pattern
    AND %11110000           ; Mask upper bits (logical AND)
    SRL A                   ; Shift to lower position
    SRL A
    SRL A
    SRL A
    LD E, A                 ; Save upper pattern
    
    LD A, D                 ; Get original result
    AND %00001111           ; Mask lower bits (logical AND)
    SLA A                   ; Shift to upper position
    SLA A
    SLA A
    SLA A
    OR E                    ; Combine patterns (logical OR)
    
    ; Invert pattern conditionally
    LD D, A                 ; Save pattern
    LD A, B                 ; Get loop counter
    AND %00000100           ; Test bit 2 (bit testing)
    JR Z, NoInvert          ; Skip inversion
    LD A, D                 ; Get pattern
    CPL                     ; Complement all bits (logical complement)
    LD D, A                 ; Store inverted pattern
NoInvert:
    
    ; Store pattern with address calculation
    LD A, D                 ; Get final pattern
    LD (HL), A              ; Store pattern (register indirect)
    INC HL                  ; Next position (increment)
    
    DJNZ FractalLoop        ; Continue pattern (decrement and branch)
    RET

;=============================================================================
; ANIMATION SYSTEM (Integration of All Concepts)
;=============================================================================

AnimatePatterns:
    ; Animate patterns using all learned concepts
    LD B, 50                ; Animation frames
    
AnimationLoop:
    ; Save frame counter
    LD (FrameCounter), B
    
    ; Rotate checkerboard pattern (bit operations)
    CALL RotateCheckerboard
    
    ; Shift sine wave (arithmetic operations)
    CALL ShiftSineWave
    
    ; Update spiral colors (logical operations)
    CALL UpdateSpiralColors
    
    ; Frame delay using counter
    LD C, 100               ; Delay counter
DelayLoop:
    DEC C                   ; Decrement counter
    JR NZ, DelayLoop        ; Continue delay (conditional jump)
    
    ; Restore frame counter and continue
    LD B, (FrameCounter)
    DJNZ AnimationLoop      ; Next frame (decrement and branch)
    RET

RotateCheckerboard:
    ; Rotate checkerboard pattern using bit operations
    LD HL, $4000            ; Checkerboard area
    LD DE, 16               ; Number of rows to rotate
    
RotateLoop:
    LD A, (HL)              ; Get current pattern (register indirect)
    RLC A                   ; Rotate left circular (bit rotation)
    LD (HL), A              ; Store rotated pattern
    
    ; Move to next row
    LD BC, 256              ; Bytes per character row
    ADD HL, BC              ; Add offset (16-bit arithmetic)
    
    DEC DE                  ; Decrement row counter
    LD A, D                 ; Check if more rows
    OR E                    ; Logical OR to test for zero
    JR NZ, RotateLoop       ; Continue if not zero (conditional jump)
    RET

ShiftSineWave:
    ; Shift sine wave pattern using arithmetic
    LD HL, $4800            ; Sine wave area
    LD B, 255               ; Pattern width
    
ShiftLoop:
    LD A, (HL)              ; Get current pixel (register indirect)
    SRL A                   ; Shift right (bit operations)
    LD C, A                 ; Save shifted value
    
    ; Add new bit on left
    LD A, B                 ; Use counter for pattern
    AND %00000001           ; Extract bit (logical AND)
    SLA A                   ; Shift to bit 7 position
    SLA A
    SLA A
    SLA A
    SLA A
    SLA A
    SLA A
    OR C                    ; Combine with shifted pattern (logical OR)
    LD (HL), A              ; Store new pattern
    
    INC HL                  ; Next position (increment)
    DJNZ ShiftLoop          ; Continue shift (decrement and branch)
    RET

UpdateSpiralColors:
    ; Update spiral area colors using logical operations
    LD HL, $5900            ; Spiral color area
    LD B, 64                ; Color area size
    
ColorLoop:
    LD A, (HL)              ; Get current color (register indirect)
    INC A                   ; Increment color (increment)
    AND %00000111           ; Keep in color range (logical AND)
    LD (HL), A              ; Store new color
    INC HL                  ; Next position (increment)
    DJNZ ColorLoop          ; Continue (decrement and branch)
    RET

;=============================================================================
; DATA STORAGE AND VARIABLES
;=============================================================================

; Spiral parameters
SpiralCenter:   DB 16, 12   ; Center X, Y coordinates
CurrentX:       DB 0
CurrentY:       DB 0
SpiralX:        DB 0
SpiralY:        DB 0
Radius:         DB 0
Angle:          DB 0

; Animation variables
FrameCounter:   DB 0

; Execute the complete pattern generator
CALL PatternGenerator"
  language="assembly"
/>

## Advanced Programming Patterns

### Pattern 1: State Machine Implementation
Combine flags, arithmetic, and addressing modes for complex state management:

```text
; Game state machine using all concepts
GameState = $80         ; Current state variable

UpdateGameState:
    LD A, (GameState)   ; Get current state (direct addressing)
    CP 0                ; Compare with state 0 (compare operation)
    JR Z, StateMenu     ; Jump if menu state (conditional jump)
    CP 1                ; Compare with state 1
    JR Z, StatePlaying  ; Jump if playing state
    ; Handle other states...
    RET

StateMenu:
    ; Menu state logic using bit operations
    LD A, (InputFlags)  ; Get input (direct addressing)
    BIT 0, A            ; Test start button (bit testing)
    JR Z, MenuEnd       ; Skip if not pressed
    LD A, 1             ; Change to playing state (immediate addressing)
    LD (GameState), A   ; Store new state
MenuEnd:
    RET
```

### Pattern 2: Data Structure Management
Use register pairs and arithmetic for complex data handling:

```text
; Manage array of game objects
ObjectArray = $C000     ; Base address

GetObjectAddress:
    ; Input: A = object index
    ; Output: HL = object address
    LD L, A             ; Object index in L
    LD H, 0             ; Clear high byte
    ADD HL, HL          ; Multiply by 2 (shift operations)
    ADD HL, HL          ; Multiply by 4
    ADD HL, HL          ; Multiply by 8 (8 bytes per object)
    LD DE, ObjectArray  ; Base address
    ADD HL, DE          ; Add base address (16-bit arithmetic)
    RET                 ; HL now points to object
```

<CodeRunner 
  system="zx-spectrum"
  title="Advanced Programming Patterns"
  code="; Advanced programming patterns integrating all concepts
; This demonstrates professional Z80 programming techniques

AdvancedPatternsDemo:
    ; Initialize the demonstration
    CALL InitPatterns
    
    ; Run multiple integrated systems
    CALL RunDataProcessor
    CALL RunGameEngine
    CALL RunGraphicsEngine
    
    RET

;=============================================================================
; DATA PROCESSING ENGINE (All Addressing Modes + Arithmetic)
;=============================================================================

InitPatterns:
    ; Initialize data structures using various addressing modes
    LD HL, DataBuffer       ; Point to data buffer (immediate addressing)
    LD B, 64                ; Buffer size (immediate addressing)
    LD A, 0                 ; Clear value (immediate addressing)
    
ClearBuffer:
    LD (HL), A              ; Clear byte (register indirect)
    INC HL                  ; Next position (increment)
    DJNZ ClearBuffer        ; Continue (decrement and branch)
    
    ; Initialize lookup tables using arithmetic
    LD HL, SquareTable      ; Point to square table
    LD B, 16                ; Calculate squares 0-15
    LD C, 0                 ; Starting number
    
SquareLoop:
    ; Calculate C squared using repeated addition
    LD A, C                 ; Get number to square
    LD D, A                 ; Multiplier
    LD E, 0                 ; Clear result
    OR A                    ; Test if zero (status flags)
    JR Z, StoreSquare       ; Skip calculation if zero
    
MultiplyLoop:
    ADD A, C                ; Add original number (arithmetic addition)
    DEC D                   ; Decrement multiplier (decrement)
    JR NZ, MultiplyLoop     ; Continue multiplication (conditional jump)
    
StoreSquare:
    LD (HL), A              ; Store square in table (register indirect)
    INC HL                  ; Next table entry (increment)
    INC C                   ; Next number (increment)
    DJNZ SquareLoop         ; Continue for all numbers (decrement and branch)
    
    RET

RunDataProcessor:
    ; Process data using multiple addressing modes and operations
    LD HL, InputData        ; Source data (immediate addressing)
    LD DE, ProcessedData    ; Destination (immediate addressing)
    LD B, InputDataSize     ; Number of bytes to process
    
ProcessLoop:
    ; Load data using register indirect addressing
    LD A, (HL)              ; Get input byte (register indirect)
    
    ; Apply multiple transformations using bit operations
    AND %11110000           ; Mask upper nibble (logical AND)
    SRL A                   ; Shift to lower position (bit operations)
    SRL A
    SRL A
    SRL A
    
    ; Use as index into lookup table (addressing modes combination)
    LD C, A                 ; Index in C
    LD A, 0                 ; Clear high byte
    ADD A, C                ; Add index (arithmetic addition)
    LD BC, SquareTable      ; Table base address
    ADD A, C                ; Add to base (arithmetic)
    LD C, A                 ; Store low byte
    JR NC, NoCarry1         ; Check carry (status flags)
    INC B                   ; Handle carry (increment)
NoCarry1:
    
    ; Load transformed value from table
    LD A, (BC)              ; Get table value (register indirect)
    
    ; Apply final transformation using logical operations
    XOR %01010101           ; XOR with pattern (logical XOR)
    
    ; Store result
    LD (DE), A              ; Store processed byte (register indirect)
    
    ; Move to next data
    INC HL                  ; Next input (increment)
    INC DE                  ; Next output (increment)
    DJNZ ProcessLoop        ; Continue processing (decrement and branch)
    
    RET

;=============================================================================
; GAME ENGINE (Status Flags + Conditional Logic)
;=============================================================================

RunGameEngine:
    ; Simulate game entity update using integrated concepts
    LD IX, EntityTable      ; Point to entity table (immediate addressing)
    LD B, EntityCount       ; Number of entities (immediate addressing)
    
EntityLoop:
    ; Get entity type using indexed addressing
    LD A, (IX+0)            ; Entity type (indexed addressing)
    CP EntityTypePlayer     ; Compare with player type (compare operation)
    JR Z, UpdatePlayer      ; Jump if player (conditional jump)
    CP EntityTypeEnemy      ; Compare with enemy type
    JR Z, UpdateEnemy       ; Jump if enemy
    JR NextEntity           ; Skip unknown type
    
UpdatePlayer:
    ; Update player using arithmetic and bit operations
    LD A, (IX+1)            ; Get player X position (indexed addressing)
    LD C, (IX+2)            ; Get player Y position
    
    ; Apply movement based on input flags
    LD D, (IX+3)            ; Get input flags (indexed addressing)
    BIT 0, D                ; Test left movement (bit testing)
    JR Z, CheckRight        ; Skip if not pressed
    DEC A                   ; Move left (decrement)
    CP 0                    ; Check boundary (compare)
    JR NZ, CheckRight       ; Valid position
    LD A, 1                 ; Clamp to boundary
    
CheckRight:
    BIT 1, D                ; Test right movement (bit testing)
    JR Z, UpdatePlayerPos   ; Skip if not pressed
    INC A                   ; Move right (increment)
    CP 31                   ; Check right boundary (compare)
    JR C, UpdatePlayerPos   ; Valid position
    LD A, 30                ; Clamp to boundary
    
UpdatePlayerPos:
    LD (IX+1), A            ; Store new X position (indexed addressing)
    JR NextEntity           ; Continue to next entity
    
UpdateEnemy:
    ; Update enemy using AI logic with bit operations
    LD A, (IX+1)            ; Get enemy X position (indexed addressing)
    LD C, (IX+4)            ; Get AI state flags (indexed addressing)
    
    ; Simple AI: move toward player
    LD D, (EntityTable+1)   ; Get player X position (direct addressing)
    CP D                    ; Compare enemy X with player X (compare)
    JR Z, UpdateEnemyY      ; Same X position, check Y
    JR C, MoveEnemyRight    ; Enemy left of player
    
    ; Enemy right of player, move left
    DEC A                   ; Move left (decrement)
    JR UpdateEnemyX
    
MoveEnemyRight:
    INC A                   ; Move right (increment)
    
UpdateEnemyX:
    LD (IX+1), A            ; Store new enemy X (indexed addressing)
    
UpdateEnemyY:
    ; Similar logic for Y coordinate...
    ; (Implementation continues with Y movement)
    
NextEntity:
    ; Move to next entity in table
    LD DE, EntitySize       ; Size of each entity record (immediate addressing)
    ADD IX, DE              ; Move to next entity (16-bit arithmetic)
    DJNZ EntityLoop         ; Continue for all entities (decrement and branch)
    
    RET

;=============================================================================
; GRAPHICS ENGINE (Memory Access + Bit Manipulation)
;=============================================================================

RunGraphicsEngine:
    ; Render entities to screen using all addressing techniques
    LD IX, EntityTable      ; Point to entity table (immediate addressing)
    LD B, EntityCount       ; Number of entities (immediate addressing)
    
RenderLoop:
    ; Get entity position and type
    LD A, (IX+0)            ; Entity type (indexed addressing)
    CP EntityTypeNone       ; Check if active entity (compare)
    JR Z, NextRender        ; Skip inactive entity (conditional jump)
    
    LD C, (IX+1)            ; Get X position (indexed addressing)
    LD D, (IX+2)            ; Get Y position
    
    ; Calculate screen address using arithmetic operations
    LD A, D                 ; Y coordinate
    AND %00011111           ; Limit to screen range (logical AND)
    
    ; Multiply Y by 32 using shift operations
    SLA A                   ; Y * 2 (bit operations)
    SLA A                   ; Y * 4
    SLA A                   ; Y * 8
    SLA A                   ; Y * 16
    SLA A                   ; Y * 32
    LD L, A                 ; Store Y offset
    
    ; Add X coordinate
    LD A, C                 ; X coordinate
    AND %00011111           ; Limit to screen range (logical AND)
    ADD A, L                ; Add to Y offset (arithmetic addition)
    LD L, A                 ; Store final address low byte
    LD H, $40               ; Screen base high byte (immediate addressing)
    
    ; Get sprite pattern based on entity type
    LD A, (IX+0)            ; Entity type (indexed addressing)
    DEC A                   ; Adjust for table index (decrement)
    LD DE, SpritePatterns   ; Base of pattern table (immediate addressing)
    ADD A, E                ; Add index to base (arithmetic addition)
    LD E, A                 ; Store low byte
    JR NC, NoCarry2         ; Check carry (status flags)
    INC D                   ; Handle carry (increment)
NoCarry2:
    
    LD A, (DE)              ; Get sprite pattern (register indirect)
    LD (HL), A              ; Draw sprite to screen (register indirect)
    
NextRender:
    ; Move to next entity
    LD DE, EntitySize       ; Entity record size (immediate addressing)
    ADD IX, DE              ; Next entity (16-bit arithmetic)
    DJNZ RenderLoop         ; Continue rendering (decrement and branch)
    
    RET

;=============================================================================
; DATA DEFINITIONS
;=============================================================================

; Data processing buffers
DataBuffer:      DS 64      ; General purpose buffer
SquareTable:     DS 16      ; Lookup table for squares
InputData:       DB $12, $34, $56, $78, $9A, $BC, $DE, $F0
InputDataSize    EQU 8
ProcessedData:   DS 8       ; Output buffer

; Game engine data
EntityCount      EQU 4
EntitySize       EQU 8      ; Bytes per entity record
EntityTypeNone   EQU 0
EntityTypePlayer EQU 1
EntityTypeEnemy  EQU 2

; Entity table: Type, X, Y, Input/AI, State1, State2, State3, State4
EntityTable:
    DB EntityTypePlayer, 15, 10, %00000001, 0, 0, 0, 0   ; Player entity
    DB EntityTypeEnemy,  5,  8,  0,         0, 0, 0, 0   ; Enemy 1
    DB EntityTypeEnemy,  25, 12, 0,         0, 0, 0, 0   ; Enemy 2
    DB EntityTypeNone,   0,  0,  0,         0, 0, 0, 0   ; Unused slot

; Graphics data
SpritePatterns:
    DB %00000000            ; None (empty)
    DB %01111110            ; Player pattern
    DB %10000001            ; Enemy pattern

; Execute the advanced patterns demonstration
CALL AdvancedPatternsDemo"
  language="assembly"
/>

## Professional Code Organization

### Modular Design Principles
```text
; Organize code into logical modules
; Each module has clear inputs/outputs and purpose

;=============================================================================
; MODULE: Math Utilities
;=============================================================================
MathModule:
    ; Fast multiplication routine
    ; Input: A = multiplicand, B = multiplier
    ; Output: HL = result
    ; Uses: Shift operations for powers of 2
    
;=============================================================================
; MODULE: Graphics Utilities  
;=============================================================================
GraphicsModule:
    ; Screen address calculation
    ; Input: B = X, C = Y
    ; Output: HL = screen address
    ; Uses: Arithmetic and addressing modes
    
;=============================================================================
; MODULE: Input Processing
;=============================================================================
InputModule:
    ; Debounced input reading
    ; Output: A = button states
    ; Uses: Bit operations and status flags
```

### Error Handling Patterns
```text
; Use status flags for error indication
SafeDivide:
    ; Input: A = dividend, B = divisor
    ; Output: A = quotient, carry flag = error if divide by zero
    OR B                ; Test divisor (logical operation)
    JR Z, DivideError   ; Jump if zero divisor (conditional jump)
    ; Perform division...
    OR A                ; Clear carry flag (no error)
    RET
DivideError:
    SCF                 ; Set carry flag (error indicator)
    RET
```

## Comprehensive Integration Exercise

<CodeRunner 
  system="zx-spectrum"
  title="Complete Integration Challenge"
  code="; Complete Integration Challenge: Mini Database System
; Uses ALL concepts learned in Data Manipulation Fundamentals

MiniDatabase:
    ; Initialize database system
    CALL InitDatabase
    
    ; Perform database operations
    CALL AddRecord
    CALL SearchRecord
    CALL UpdateRecord
    CALL DeleteRecord
    
    ; Display results
    CALL DisplayDatabase
    
    RET

;=============================================================================
; DATABASE INITIALIZATION (Addressing Modes + Memory Management)
;=============================================================================

InitDatabase:
    ; Clear database memory using efficient techniques
    LD HL, DatabaseMemory   ; Point to database (immediate addressing)
    LD DE, DatabaseMemory+1 ; Destination for block clear
    LD BC, DatabaseSize-1   ; Size to clear
    LD (HL), 0              ; Clear first byte (immediate addressing)
    LDIR                    ; Block clear (register indirect)
    
    ; Initialize database header
    LD HL, DatabaseHeader   ; Point to header (immediate addressing)
    LD (HL), 0              ; Record count = 0 (register indirect)
    INC HL                  ; Next field (increment)
    LD (HL), MaxRecords     ; Maximum records (immediate addressing)
    
    ; Initialize free list using bit operations
    LD HL, FreeList         ; Point to free list (immediate addressing)
    LD B, MaxRecords        ; Number of records (immediate addressing)
    LD A, 0                 ; Starting record ID
    
FreeLlistInit:
    LD (HL), A              ; Store record ID (register indirect)
    INC HL                  ; Next slot (increment)
    INC A                   ; Next ID (increment)
    DJNZ FreeLlistInit      ; Continue (decrement and branch)
    
    LD A, MaxRecords        ; Set free list pointer
    LD (FreeListPtr), A     ; All records initially free
    
    RET

;=============================================================================
; ADD RECORD (Arithmetic + Status Flags)
;=============================================================================

AddRecord:
    ; Check if database has space
    LD A, (FreeListPtr)     ; Get free list pointer (direct addressing)
    OR A                    ; Test if zero (status flags)
    JR Z, AddRecordFail     ; No space available (conditional jump)
    
    ; Get free record slot
    DEC A                   ; Decrement pointer (decrement)
    LD (FreeListPtr), A     ; Update pointer
    LD HL, FreeList         ; Point to free list (immediate addressing)
    LD C, A                 ; Free list index in C
    ADD HL, BC              ; Point to free slot (16-bit arithmetic)
    LD A, (HL)              ; Get free record ID (register indirect)
    LD (CurrentRecordID), A ; Save record ID
    
    ; Calculate record address using arithmetic
    LD B, A                 ; Record ID in B
    LD A, 0                 ; Clear accumulator
    LD C, RecordSize        ; Record size (immediate addressing)
    
RecordAddressLoop:
    ADD A, C                ; Add record size (arithmetic addition)
    JR NC, NoOverflow       ; Check for overflow (status flags)
    ; Handle overflow if needed
NoOverflow:
    DJNZ RecordAddressLoop  ; Continue multiplication (decrement and branch)
    
    ; A now contains offset
    LD HL, DatabaseMemory   ; Base address (immediate addressing)
    ADD A, L                ; Add offset to base (arithmetic addition)
    LD L, A                 ; Store low byte
    JR NC, NoCarry3         ; Check carry (status flags)
    INC H                   ; Handle carry (increment)
NoCarry3:
    
    ; Store sample record data
    LD (HL), $41            ; Field 1: 'A' (immediate addressing)
    INC HL                  ; Next field (increment)
    LD (HL), $42            ; Field 2: 'B' (immediate addressing)
    INC HL                  ; Next field (increment)
    LD (HL), $43            ; Field 3: 'C' (immediate addressing)
    
    ; Update record count
    LD HL, DatabaseHeader   ; Point to header (immediate addressing)
    INC (HL)                ; Increment record count (increment)
    
    ; Success indicator
    LD A, $53               ; 'S' for Success
    LD (OperationResult), A
    RET
    
AddRecordFail:
    LD A, $46               ; 'F' for Fail
    LD (OperationResult), A
    RET

;=============================================================================
; SEARCH RECORD (Bit Operations + Logical Operations)
;=============================================================================

SearchRecord:
    ; Search for record with specific pattern
    LD A, $42               ; Search for 'B' in field 2 (immediate addressing)
    LD (SearchKey), A       ; Store search key
    
    LD HL, DatabaseMemory   ; Start of records (immediate addressing)
    LD A, (DatabaseHeader)  ; Get record count (direct addressing)
    LD B, A                 ; Loop counter in B
    OR A                    ; Test if zero records (status flags)
    JR Z, SearchNotFound    ; No records to search (conditional jump)
    
SearchLoop:
    ; Check field 2 of current record
    INC HL                  ; Skip field 1 (increment)
    LD A, (HL)              ; Get field 2 (register indirect)
    LD C, A                 ; Save field value
    LD A, (SearchKey)       ; Get search key (direct addressing)
    CP C                    ; Compare with field value (compare operation)
    JR Z, SearchFound       ; Found match (conditional jump)
    
    ; Move to next record
    LD A, RecordSize-1      ; Remaining bytes in record (immediate addressing)
    ADD A, L                ; Add to current position (arithmetic addition)
    LD L, A                 ; Update low byte
    JR NC, NoCarry4         ; Check carry (status flags)
    INC H                   ; Handle carry (increment)
NoCarry4:
    
    DJNZ SearchLoop         ; Continue search (decrement and branch)
    
SearchNotFound:
    LD A, $4E               ; 'N' for Not found
    LD (SearchResult), A
    RET
    
SearchFound:
    LD A, $46               ; 'F' for Found
    LD (SearchResult), A
    RET

;=============================================================================
; UPDATE RECORD (Combined Operations)
;=============================================================================

UpdateRecord:
    ; Update first record (if exists)
    LD A, (DatabaseHeader)  ; Get record count (direct addressing)
    OR A                    ; Test if zero (status flags)
    JR Z, UpdateFail        ; No records (conditional jump)
    
    ; Point to first record
    LD HL, DatabaseMemory   ; Base address (immediate addressing)
    
    ; Update fields using bit manipulation
    LD A, (HL)              ; Get field 1 (register indirect)
    XOR %01010101           ; Toggle some bits (logical XOR)
    LD (HL), A              ; Store updated field
    
    INC HL                  ; Next field (increment)
    LD A, (HL)              ; Get field 2 (register indirect)
    INC A                   ; Increment value (increment)
    LD (HL), A              ; Store updated field
    
    INC HL                  ; Next field (increment)
    LD A, (HL)              ; Get field 3 (register indirect)
    AND %11110000           ; Mask lower bits (logical AND)
    OR %00001111            ; Set lower bits (logical OR)
    LD (HL), A              ; Store updated field
    
    LD A, $55               ; 'U' for Updated
    LD (UpdateResult), A
    RET
    
UpdateFail:
    LD A, $46               ; 'F' for Fail
    LD (UpdateResult), A
    RET

;=============================================================================
; DELETE RECORD (Memory Management + Status Flags)
;=============================================================================

DeleteRecord:
    ; Delete last record (if exists)
    LD A, (DatabaseHeader)  ; Get record count (direct addressing)
    OR A                    ; Test if zero (status flags)
    JR Z, DeleteFail        ; No records (conditional jump)
    
    ; Decrement record count
    DEC A                   ; Decrement count (decrement)
    LD (DatabaseHeader), A  ; Store new count
    
    ; Add record to free list
    LD HL, FreeList         ; Point to free list (immediate addressing)
    LD B, A                 ; Record count in B (now the deleted record ID)
    LD A, (FreeListPtr)     ; Get current free list pointer (direct addressing)
    LD C, A                 ; Save current pointer
    ADD HL, BC              ; Point to next free slot (16-bit arithmetic)
    LD (HL), B              ; Store deleted record ID (register indirect)
    INC C                   ; Increment free list pointer (increment)
    LD A, C                 ; Get updated pointer
    LD (FreeListPtr), A     ; Store updated pointer
    
    LD A, $44               ; 'D' for Deleted
    LD (DeleteResult), A
    RET
    
DeleteFail:
    LD A, $46               ; 'F' for Fail
    LD (DeleteResult), A
    RET

;=============================================================================
; DISPLAY DATABASE (All Addressing Modes)
;=============================================================================

DisplayDatabase:
    ; Display operation results
    LD A, (OperationResult) ; Get add result (direct addressing)
    LD ($4000), A           ; Display on screen (direct addressing)
    
    LD A, (SearchResult)    ; Get search result (direct addressing)
    LD ($4001), A           ; Display on screen
    
    LD A, (UpdateResult)    ; Get update result (direct addressing)
    LD ($4002), A           ; Display on screen
    
    LD A, (DeleteResult)    ; Get delete result (direct addressing)
    LD ($4003), A           ; Display on screen
    
    ; Display record count
    LD A, (DatabaseHeader)  ; Get record count (direct addressing)
    ADD A, $30              ; Convert to ASCII digit (arithmetic addition)
    LD ($4004), A           ; Display count
    
    RET

;=============================================================================
; DATA DEFINITIONS
;=============================================================================

DatabaseSize     EQU 256    ; Total database memory
MaxRecords       EQU 16     ; Maximum number of records
RecordSize       EQU 8      ; Bytes per record

; Database storage
DatabaseMemory:  DS DatabaseSize    ; Main database memory
DatabaseHeader:  DS 2               ; Record count, max records
FreeList:        DS MaxRecords      ; Free record list
FreeListPtr:     DB MaxRecords      ; Free list pointer

; Operation variables
CurrentRecordID: DB 0
SearchKey:       DB 0
OperationResult: DB 0
SearchResult:    DB 0
UpdateResult:    DB 0
DeleteResult:    DB 0

; Execute the complete database system
CALL MiniDatabase"
  language="assembly"
/>

## What You've Learned

In this comprehensive review, you have demonstrated understanding of:

1. **Complete Z80 Programming** - Integration of all data manipulation concepts
2. **Professional Patterns** - Real-world programming techniques and organization
3. **Complex Problem Solving** - Building sophisticated systems using Z80 assembly
4. **Performance Optimization** - Choosing optimal instructions and techniques
5. **Code Architecture** - Designing maintainable, scalable assembly programs

## Section 1 Completion Assessment

You have successfully completed **Section 1: Data Manipulation Fundamentals**. You can now confidently:

### Technical Skills
- **Use all Z80 addressing modes** appropriately for different scenarios
- **Perform arithmetic operations** with proper flag handling and error checking
- **Manipulate bits and data** using logical and shift operations
- **Write efficient loops and conditions** using status flags
- **Organize complex programs** using professional coding patterns

### Problem-Solving Skills
- **Analyze programming problems** and choose appropriate Z80 techniques
- **Design data structures** suitable for assembly language programming
- **Implement algorithms** efficiently using Z80 instruction set
- **Debug and optimize** Z80 assembly code for performance
- **Integrate multiple concepts** into sophisticated applications

## Ready for Section 2: Memory and Addressing

Your solid foundation in data manipulation prepares you perfectly for Section 2, where you'll learn:

- **Advanced Z80 addressing modes** and memory management techniques
- **Stack operations** and subroutine programming patterns
- **Interrupt handling** and real-time programming concepts
- **ZX Spectrum system programming** and hardware interface techniques

## Fun Fact

The data manipulation techniques you've learned represent the core skills that made Z80 programmers so effective in the 1980s. The Z80's rich instruction set, with its powerful addressing modes and bit manipulation capabilities, enabled programmers to write incredibly efficient code for games, utilities, and system software. Many of the optimization techniques you've learned - like using shifts for multiplication, bit operations for flags, and efficient addressing modes - are still used today in embedded systems programming and performance-critical applications. You've not just learned historical programming; you've mastered timeless techniques that remain relevant in modern computing!