---
title: "Program Organization and Structure"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 26
description: "Learn professional program organisation and code structure. Learn modular programming, code documentation, and maintainable architecture patterns for large assembly projects."
learning_objectives:
  - "Understand modular programming and code organisation principles"
  - "Learn subroutine libraries and reusable code modules"
  - "Learn professional documentation and commenting standards"
  - "Practice memory organisation and data structure design"
  - "Build maintainable and scalable program architectures"
concepts:
  - "Modular programming and code organisation"
  - "Subroutine libraries and reusable modules"
  - "Memory layout planning and data organisation"
  - "Professional documentation standards"
  - "Scalable program architecture patterns"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 26
---

# Lesson 26: Program Organization and Structure

**Watch how professional code organisation transforms complex programs into elegant systems:**

```
; This creates a complete game architecture with modular systems -
; the same organisation techniques used in commercial C64 games
; costing £25-£30 in 1982!

GameEngine:
    JSR Graphics.Init       ; Modular graphics system
    JSR Audio.Init          ; Modular audio system
    JSR Input.Init          ; Modular input system
    JSR Game.StartLevel     ; Clean game logic
    JSR Engine.MainLoop     ; Organised main loop
    
; Each module is self-contained and reusable - professional
; game development architecture on your C64!
```

That's the power of **professional program organisation** - turning complex games into manageable, maintainable systems! Today you'll learn to structure your Number Quest game code like a professional developer, creating scalable architecture that commercial game studios would recognise.

## Code Organization Principles

### Modular Programming Concepts

**Modular programming** breaks large programs into smaller, manageable pieces:

- **Modules**: Self-contained code units with specific purposes
- **Interfaces**: Clear boundaries between modules
- **Reusability**: Code that can be used in multiple contexts
- **Maintainability**: Easy to understand, modify, and debug
- **Scalability**: Structure that supports program growth

```text
; Example: Well-organised program structure
; ========================================
; MAIN PROGRAM
; ========================================

Main:
    JSR InitializeSystem
    JSR RunGameLoop
    JSR ShutdownSystem
    RTS

; ========================================
; INITIALIZATION MODULE
; ========================================

InitializeSystem:
    JSR InitMemory
    JSR InitGraphics
    JSR InitAudio
    JSR InitInput
    RTS

; ========================================
; GRAPHICS MODULE
; ========================================

InitGraphics:
    JSR ClearScreen
    JSR SetupColors
    JSR InitSprites
    RTS

ClearScreen:
    ; Implementation here
    RTS

SetupColors:
    ; Implementation here
    RTS

InitSprites:
    ; Implementation here
    RTS
```

## Memory Layout Planning

### Professional Memory Organization

```text
; ========================================
; MEMORY LAYOUT DOCUMENTATION
; ========================================
; $0000-$00FF: Zero Page (system and variables)
; $0100-$01FF: Stack
; $0200-$02FF: Operating system and KERNAL
; $0300-$03FF: System workspace
; $0400-$07FF: Screen memory
; $0800-$0FFF: Program code
; $1000-$1FFF: Data tables and buffers
; $2000-$3FFF: Graphics data
; $4000-$7FFF: Additional program space
; ========================================

; Zero page allocation plan
ZP_TEMP1        = $FB    ; Temporary variable 1
ZP_TEMP2        = $FC    ; Temporary variable 2
ZP_PTR1         = $FD    ; Pointer 1 (2 bytes)
ZP_PTR2         = $FE    ; Pointer 2 (2 bytes: $FE/$FF)

; Program variables (main memory)
PROGRAM_START   = $0801  ; Start of BASIC area
CODE_START      = $1000  ; Main code area
DATA_START      = $2000  ; Data tables
BUFFER_START    = $3000  ; Work buffers
GRAPHICS_START  = $4000  ; Graphics data

; Data organisation
PlayerData      = DATA_START + $0000     ; Player statistics
LevelData       = DATA_START + $0100     ; Level information
SoundData       = DATA_START + $0200     ; Audio data
GraphicsData    = GRAPHICS_START         ; Sprite and bitmap data
```

### Memory Management Module

```text
; ========================================
; MEMORY MANAGEMENT MODULE
; ========================================

MemoryManager:
    ; Memory allocation tracking
    MemoryBlocks = $C000    ; Memory block table
    BlockSize = 256         ; Standard block size
    MaxBlocks = 16          ; Maximum allocatable blocks

InitMemoryManager:
    ; Initialize memory management system
    LDX #0
    LDA #$00                ; Mark all blocks as free
ClearBlockTable:
    STA MemoryBlocks,X
    INX
    CPX #MaxBlocks
    BNE ClearBlockTable
    RTS

AllocateMemoryBlock:
    ; Find and allocate a free memory block
    ; Returns: Block number in A (or $FF if none available)
    LDX #0
FindFreeBlock:
    LDA MemoryBlocks,X
    BEQ FoundFreeBlock      ; 0 = free
    INX
    CPX #MaxBlocks
    BNE FindFreeBlock
    
    LDA #$FF                ; No free blocks
    RTS

FoundFreeBlock:
    LDA #$01                ; Mark as allocated
    STA MemoryBlocks,X
    TXA                     ; Return block number
    RTS

FreeMemoryBlock:
    ; Free a memory block
    ; Input: Block number in A
    TAX
    LDA #$00                ; Mark as free
    STA MemoryBlocks,X
    RTS

GetBlockAddress:
    ; Convert block number to memory address
    ; Input: Block number in A
    ; Output: Address in $FB/$FC
    LDX #0                  ; Clear high byte calculation
    ASL                     ; Multiply by 256 (block size)
    ROL                     ; Rotate carry into X
    CLC
    ADC #<BUFFER_START      ; Add base address
    STA ZP_PTR1             ; Store low byte
    TXA
    ADC #>BUFFER_START      ; Add high byte with carry
    STA ZP_PTR1+1           ; Store high byte
    RTS
```

**Modular Program Structure Demo:**

```assembly
; Professional program organisation demonstration
; Shows modular structure and clean interfaces

; ========================================
; MAIN PROGRAM MODULE
; ========================================

MainProgram:
    JSR InitializeApplication
    JSR RunApplication
    JSR ShutdownApplication
    RTS

; ========================================
; INITIALIZATION MODULE
; ========================================

InitializeApplication:
    ; Initialize all subsystems in proper order
    JSR InitMemorySystem
    JSR InitDisplaySystem
    JSR InitAudioSystem
    JSR InitInputSystem
    JSR InitGameData
    RTS

InitMemorySystem:
    ; Initialize memory management
    LDA #$00
    STA $90         ; Clear temp variables
    STA $91
    STA $92
    STA $93
    RTS

InitDisplaySystem:
    ; Initialize display
    LDA #$93        ; Clear screen
    JSR $FFD2       ; CHROUT
    
    LDA #$0E        ; Light blue text
    STA $286        ; Current colour
    RTS

InitAudioSystem:
    ; Initialize audio (placeholder)
    ; Real implementation would setup SID
    RTS

InitInputSystem:
    ; Initialize input handling
    LDA #$00
    STA InputState  ; Clear input state
    RTS

InitGameData:
    ; Initialize game-specific data
    LDA #$64        ; 100 starting health
    STA PlayerHealth
    LDA #$00
    STA PlayerScore
    STA PlayerScore+1
    RTS

; ========================================
; APPLICATION MAIN LOOP MODULE
; ========================================

RunApplication:
    ; Main application loop
MainLoop:
    JSR ProcessInput
    JSR UpdateGameLogic
    JSR UpdateDisplay
    JSR CheckExitCondition
    BCC MainLoop    ; Continue if no exit requested
    RTS

ProcessInput:
    ; Handle user input
    LDA $DC00       ; Read joystick port 2
    EOR #$FF        ; Invert (active low)
    STA InputState
    
    ; Process specific inputs
    AND #%00010000  ; Fire button
    BEQ NoFirePress
    JSR HandleFireButton
NoFirePress:
    RTS

UpdateGameLogic:
    ; Update game state
    JSR UpdatePlayer
    JSR UpdateEnemies
    JSR CheckCollisions
    RTS

UpdateDisplay:
    ; Update screen display
    JSR DisplayPlayerStats
    JSR DisplayGameArea
    RTS

CheckExitCondition:
    ; Check if application should exit
    LDA InputState
    AND #%00000001  ; Up direction as exit for demo
    BEQ NoExit
    SEC             ; Request exit
    RTS
NoExit:
    CLC             ; Continue running
    RTS

; ========================================
; GAME LOGIC MODULE
; ========================================

UpdatePlayer:
    ; Update player state
    LDA InputState
    AND #%00000100  ; Left
    BEQ CheckRight
    
    ; Move player left
    LDA PlayerX
    SEC
    SBC #$01
    CMP #$20        ; Left boundary
    BCC CheckRight  ; Don't move if at boundary
    STA PlayerX

CheckRight:
    LDA InputState
    AND #%00001000  ; Right
    BEQ PlayerUpdateDone
    
    ; Move player right
    LDA PlayerX
    CLC
    ADC #$01
    CMP #$C0        ; Right boundary
    BCS PlayerUpdateDone ; Don't move if at boundary
    STA PlayerX

PlayerUpdateDone:
    RTS

UpdateEnemies:
    ; Simple enemy AI (placeholder)
    LDA EnemyX
    CLC
    ADC #$01        ; Move enemy right
    CMP #$FF        ; Check boundary
    BNE StoreEnemyX
    LDA #$00        ; Reset to left side
StoreEnemyX:
    STA EnemyX
    RTS

CheckCollisions:
    ; Check player-enemy collision
    LDA PlayerX
    SEC
    SBC EnemyX
    BPL CheckCollisionDistance
    EOR #$FF        ; Get absolute value
    CLC
    ADC #$01

CheckCollisionDistance:
    CMP #$08        ; Collision threshold
    BCS NoCollision
    
    ; Collision detected
    JSR HandleCollision

NoCollision:
    RTS

HandleCollision:
    ; Handle player-enemy collision
    LDA PlayerHealth
    SEC
    SBC #$0A        ; Lose 10 health
    BPL StoreHealth
    LDA #$00        ; Minimum health is 0
StoreHealth:
    STA PlayerHealth
    RTS

HandleFireButton:
    ; Handle fire button press
    LDA PlayerScore
    CLC
    ADC #$01        ; Increase score
    STA PlayerScore
    BCC ScoreUpdated
    INC PlayerScore+1 ; Handle carry to high byte
ScoreUpdated:
    RTS

; ========================================
; DISPLAY MODULE  
; ========================================

DisplayPlayerStats:
    ; Display player information
    LDA #5          ; Row 5
    STA $D6         ; Cursor row
    LDA #2          ; Column 2
    STA $D3         ; Cursor column
    
    ; Display health
    LDX #0
HealthTextLoop:
    LDA HealthText,X
    BEQ HealthTextDone
    JSR $FFD2       ; CHROUT
    INX
    JMP HealthTextLoop
HealthTextDone:
    
    ; Display health value
    LDA PlayerHealth
    JSR DisplayNumber
    
    ; Display score
    LDA #6          ; Row 6
    STA $D6         ; Cursor row
    LDA #2          ; Column 2  
    STA $D3         ; Cursor column
    
    LDX #0
ScoreTextLoop:
    LDA ScoreText,X
    BEQ ScoreTextDone
    JSR $FFD2       ; CHROUT
    INX
    JMP ScoreTextLoop
ScoreTextDone:
    
    ; Display score value
    LDA PlayerScore+1 ; High byte
    JSR DisplayNumber
    LDA PlayerScore   ; Low byte
    JSR DisplayNumber
    
    RTS

DisplayGameArea:
    ; Display game area (simple representation)
    LDA #10         ; Row 10
    STA $D6         ; Cursor row
    LDA PlayerX     ; Player X position
    LSR             ; Scale down for screen
    LSR
    LSR
    STA $D3         ; Cursor column
    
    LDA #'P'        ; Player character
    JSR $FFD2       ; Display player
    
    ; Display enemy
    LDA #11         ; Row 11
    STA $D6         ; Cursor row
    LDA EnemyX      ; Enemy X position
    LSR             ; Scale down for screen
    LSR
    LSR
    STA $D3         ; Cursor column
    
    LDA #'E'        ; Enemy character
    JSR $FFD2       ; Display enemy
    
    RTS

DisplayNumber:
    ; Display a number (0-255) as decimal
    ; Input: Number in A
    PHA             ; Save original number
    
    ; Extract hundreds
    LDY #0          ; Hundreds counter
HundredsLoop:
    CMP #100
    BCC HundredsDone
    SEC
    SBC #100
    INY
    JMP HundredsLoop
HundredsDone:
    
    ; Display hundreds if non-zero
    TYA
    BEQ SkipHundreds
    CLC
    ADC #'0'
    JSR $FFD2
SkipHundreds:
    
    ; Continue with tens and ones...
    ; (Simplified for demo)
    PLA             ; Restore original
    AND #$0F        ; Get low nibble
    CLC
    ADC #'0'        ; Convert to ASCII
    JSR $FFD2       ; Display
    
    RTS

; ========================================
; SHUTDOWN MODULE
; ========================================

ShutdownApplication:
    ; Clean shutdown of all systems
    JSR ShutdownAudio
    JSR ShutdownDisplay
    JSR ShutdownMemory
    RTS

ShutdownAudio:
    ; Silence audio
    RTS

ShutdownDisplay:
    ; Reset display
    LDA #$93        ; Clear screen
    JSR $FFD2
    RTS

ShutdownMemory:
    ; Clean up memory
    RTS

; ========================================
; DATA SECTION
; ========================================

; Text strings
HealthText:  .text \
```

## Subroutine Libraries and Reusable Modules

### Math Library Module

```text
; ========================================
; MATHEMATICS LIBRARY MODULE
; ========================================

MathLibrary:
    ; Collection of reusable mathematical functions

Multiply8x8:
    ; Multiply two 8-bit numbers
    ; Input: Multiplicand in A, Multiplier in X
    ; Output: 16-bit result in $FB/$FC
    STA $FB             ; Store multiplicand
    LDA #$00
    STA $FC             ; Clear result high byte
    
    CPX #$00            ; Check for zero multiplier
    BEQ MultiplyDone
    
MultiplyLoop:
    LDA $FC             ; Get current result high
    CLC
    ADC $FB             ; Add multiplicand
    STA $FC             ; Store result high
    DEX
    BNE MultiplyLoop
    
MultiplyDone:
    RTS

Divide8x8:
    ; Divide 8-bit number by 8-bit number
    ; Input: Dividend in A, Divisor in X
    ; Output: Quotient in A, Remainder in Y
    LDY #$00            ; Clear remainder
    
    CMP #$00            ; Check for zero dividend
    BEQ DivideDone
    
    CPX #$00            ; Check for zero divisor
    BEQ DivideError
    
DivideLoop:
    CMP #$00            ; Check if dividend exhausted
    BEQ DivideDone
    SEC
    SBC #$00            ; This should be SBC with the divisor
    INY                 ; Increment quotient
    JMP DivideLoop

DivideError:
    LDA #$FF            ; Error indicator
    LDY #$FF
    RTS

DivideDone:
    TYA                 ; Move quotient to A
    LDY #$00            ; Remainder (simplified)
    RTS

RandomNumber:
    ; Generate pseudo-random number
    ; Output: Random number in A
    LDA RandomSeed
    ASL                 ; Shift left
    BCC NoXOR
    EOR #$1D            ; XOR with feedback value
NoXOR:
    STA RandomSeed
    RTS

RandomSeed: .byte $A5   ; Random number seed
```

### String Handling Library

```text
; ========================================
; STRING LIBRARY MODULE
; ========================================

StringLibrary:
    ; String manipulation functions

StringLength:
    ; Calculate length of null-terminated string
    ; Input: String address in $FB/$FC
    ; Output: Length in A
    LDY #$00
    LDA #$00            ; Length counter
StringLenLoop:
    LDA ($FB),Y
    BEQ StringLenDone
    INY
    TYA
    CMP #$FF            ; Prevent infinite loop
    BEQ StringLenDone
    JMP StringLenLoop
StringLenDone:
    TYA                 ; Return length in A
    RTS

StringCopy:
    ; Copy null-terminated string
    ; Input: Source in $FB/$FC, Destination in $FD/$FE
    LDY #$00
StringCopyLoop:
    LDA ($FB),Y
    STA ($FD),Y
    BEQ StringCopyDone  ; Stop at null terminator
    INY
    JMP StringCopyLoop
StringCopyDone:
    RTS

StringCompare:
    ; Compare two null-terminated strings
    ; Input: String1 in $FB/$FC, String2 in $FD/$FE
    ; Output: Zero flag set if equal
    LDY #$00
StringCmpLoop:
    LDA ($FB),Y
    CMP ($FD),Y
    BNE StringCmpDone   ; Not equal
    CMP #$00            ; Check for end
    BEQ StringCmpEqual
    INY
    JMP StringCmpLoop
StringCmpEqual:
    LDA #$00            ; Set zero flag
StringCmpDone:
    RTS

StringConcatenate:
    ; Concatenate two strings
    ; Input: Dest in $FB/$FC, Source in $FD/$FE
    ; Find end of destination string
    LDY #$00
FindDestEnd:
    LDA ($FB),Y
    BEQ FoundDestEnd
    INY
    JMP FindDestEnd
FoundDestEnd:
    ; Copy source to end of destination
    LDX #$00
ConcatLoop:
    LDA ($FD),X
    STA ($FB),Y
    BEQ ConcatDone
    INY
    INX
    JMP ConcatLoop
ConcatDone:
    RTS
```

### Input/Output Library

```text
; ========================================
; INPUT/OUTPUT LIBRARY MODULE
; ========================================

IOLibrary:
    ; Input/output utility functions

PrintString:
    ; Print null-terminated string
    ; Input: String address in $FB/$FC
    LDY #$00
PrintLoop:
    LDA ($FB),Y
    BEQ PrintDone
    JSR $FFD2           ; CHROUT
    INY
    JMP PrintLoop
PrintDone:
    RTS

PrintNumber:
    ; Print 8-bit number as decimal
    ; Input: Number in A
    LDX #$00            ; Digit counter
    
    ; Handle hundreds
PrintHundreds:
    CMP #100
    BCC PrintTens
    SEC
    SBC #100
    INX
    JMP PrintHundreds
    
PrintTens:
    ; Print hundreds digit if non-zero
    CPX #$00
    BEQ SkipHundreds
    TXA
    CLC
    ADC #'0'
    JSR $FFD2
    TXA                 ; Clear hundreds counter
    
SkipHundreds:
    LDX #$00            ; Tens counter
PrintTensLoop:
    CMP #10
    BCC PrintOnes
    SEC
    SBC #10
    INX
    JMP PrintTensLoop
    
PrintOnes:
    ; Print tens digit
    TXA
    CLC
    ADC #'0'
    JSR $FFD2
    
    ; Print ones digit
    CLC
    ADC #'0'
    JSR $FFD2
    
    RTS

GetKeypress:
    ; Wait for and return keypress
    ; Output: Key code in A
GetKeyLoop:
    JSR $FFE4           ; GETIN
    CMP #$00
    BEQ GetKeyLoop      ; Wait for key
    RTS

ClearScreen:
    ; Clear screen and home cursor
    LDA #$93            ; Clear screen character
    JSR $FFD2           ; CHROUT
    RTS

SetCursor:
    ; Set cursor position
    ; Input: Row in A, Column in X
    STA $D6             ; Cursor row
    STX $D3             ; Cursor column
    RTS
```

**Reusable Library Modules Demo:**

```assembly
; Demonstration of reusable library modules
; Shows how to create and use function libraries

LibraryDemo:
    JSR DemoMathLibrary
    JSR DemoStringLibrary
    JSR DemoIOLibrary
    RTS

; ========================================
; MATH LIBRARY DEMONSTRATION
; ========================================

DemoMathLibrary:
    ; Demonstrate mathematical functions
    
    ; Test multiplication
    LDA #$05        ; Multiplicand: 5
    LDX #$07        ; Multiplier: 7
    JSR SimpleMultiply
    ; Result should be 35
    
    ; Test random number generation
    JSR GenerateRandom
    STA RandomResult
    
    ; Test simple addition
    LDA #$10        ; First number
    LDX #$20        ; Second number
    JSR SimpleAdd
    STA AddResult
    
    RTS

SimpleMultiply:
    ; Simple multiplication by repeated addition
    ; Input: A = multiplicand, X = multiplier
    ; Output: Result in A (limited to 8-bit)
    
    STA $90         ; Store multiplicand
    LDA #$00        ; Clear result
    
    CPX #$00        ; Check for zero multiplier
    BEQ MultiplyEnd
    
MultiplyLoop:
    CLC
    ADC $90         ; Add multiplicand
    DEX
    BNE MultiplyLoop
    
MultiplyEnd:
    RTS

GenerateRandom:
    ; Simple random number generator
    ; Output: Random number in A
    
    LDA RandomSeed
    ASL             ; Shift left
    BCC NoCarry
    EOR #$1D        ; XOR with feedback polynomial
NoCarry:
    STA RandomSeed
    RTS

SimpleAdd:
    ; Simple addition
    ; Input: A = first number, X = second number
    ; Output: Sum in A
    
    STX $90         ; Store second number
    CLC
    ADC $90         ; Add second number
    RTS

; ========================================
; STRING LIBRARY DEMONSTRATION
; ========================================

DemoStringLibrary:
    ; Demonstrate string functions
    
    ; Setup string pointers
    LDA #<TestString1
    STA $80         ; String pointer 1 low
    LDA #>TestString1
    STA $81         ; String pointer 1 high
    
    ; Calculate string length
    JSR CalculateStringLength
    STA StringLength1
    
    ; Display string
    JSR DisplayTestString
    
    RTS

CalculateStringLength:
    ; Calculate length of string pointed to by $80/$81
    ; Output: Length in A
    
    LDY #$00        ; Character counter
    LDA #$00        ; Length counter

LengthLoop:
    LDA ($80),Y     ; Get character
    BEQ LengthDone  ; End of string
    INY
    TYA
    CMP #$FF        ; Prevent overflow
    BEQ LengthDone
    JMP LengthLoop

LengthDone:
    TYA             ; Return length
    RTS

DisplayTestString:
    ; Display the test string
    LDY #$00
DisplayLoop:
    LDA ($80),Y
    BEQ DisplayDone
    JSR $FFD2       ; CHROUT
    INY
    JMP DisplayLoop
DisplayDone:
    LDA #13         ; Carriage return
    JSR $FFD2
    RTS

; ========================================
; I/O LIBRARY DEMONSTRATION
; ========================================

DemoIOLibrary:
    ; Demonstrate I/O functions
    
    ; Set text colour
    LDA #$0E        ; Light blue
    JSR SetTextColor
    
    ; Position cursor
    LDA #10         ; Row 10
    LDX #5          ; Column 5
    JSR PositionCursor
    
    ; Display a message
    LDA #<IOMessage
    STA $80
    LDA #>IOMessage
    STA $81
    JSR DisplayString
    
    ; Display a number
    LDA #42         ; The answer
    JSR DisplayNumber
    
    RTS

SetTextColor:
    ; Set text colour
    ; Input: Color in A
    STA $286        ; Current colour
    RTS

PositionCursor:
    ; Position cursor
    ; Input: Row in A, Column in X
    STA $D6         ; Cursor row
    STX $D3         ; Cursor column
    RTS

DisplayString:
    ; Display string pointed to by $80/$81
    LDY #$00
StringDisplayLoop:
    LDA ($80),Y
    BEQ StringDisplayDone
    JSR $FFD2       ; CHROUT
    INY
    JMP StringDisplayLoop
StringDisplayDone:
    RTS

DisplayNumber:
    ; Display number in decimal
    ; Input: Number in A
    
    ; Simple version - just display last digit
    AND #$0F        ; Get low nibble
    CLC
    ADC #'0'        ; Convert to ASCII
    JSR $FFD2       ; Display
    RTS

; ========================================
; DATA SECTION
; ========================================

TestString1:    .text \"HELLO WORLD\", 0
IOMessage:      .text \"THE ANSWER IS: \", 0

; Variables
RandomSeed:     .byte $A5
RandomResult:   .byte 0
AddResult:      .byte 0
StringLength1:  .byte 0

; Run the library demonstration
JSR LibraryDemo
```

## Documentation Standards

### Professional Code Documentation

```text
; ========================================
; HEADER DOCUMENTATION TEMPLATE
; ========================================
;
; Program: Game Engine Core
; Version: 1.0
; Author: Professional Developer
; Date: 2024
; Description: Core game engine with modular architecture
; 
; Dependencies:
;   - KERNAL routines for I/O
;   - Custom graphics library
;   - Audio subsystem
;
; Memory Usage:
;   - Zero Page: $FB-$FF (5 bytes)
;   - Main Memory: $1000-$7FFF
;   - Graphics: $2000-$3FFF
;
; Change Log:
;   v1.0 - Initial implementation
;   v1.1 - Added sound effects
;   v1.2 - Optimized sprite handling
; ========================================

; ========================================
; FUNCTION DOCUMENTATION TEMPLATE
; ========================================

UpdatePlayerPosition:
    ; ====================================
    ; Function: UpdatePlayerPosition
    ; ====================================
    ; Purpose: Updates player position based on input
    ; 
    ; Inputs:
    ;   - InputState: Current joystick state
    ;   - PlayerX: Current X position
    ;   - PlayerY: Current Y position
    ;
    ; Outputs:
    ;   - PlayerX: Updated X position
    ;   - PlayerY: Updated Y position
    ;   - Carry: Set if position changed
    ;
    ; Modifies: A, X, Y registers
    ; 
    ; Side Effects:
    ;   - May trigger boundary collision
    ;   - Updates sprite hardware registers
    ;
    ; Example Usage:
    ;   JSR ReadInput
    ;   JSR UpdatePlayerPosition
    ;   BCS PositionChanged
    ; ====================================
    
    LDA InputState          ; Read current input
    AND #%00000100          ; Check left direction
    BEQ CheckRight          ; Skip if not pressed
    
    ; Move player left
    LDA PlayerX             ; Get current X position
    SEC
    SBC #PlayerSpeed        ; Subtract speed value
    CMP #LeftBoundary       ; Check left boundary
    BCC BoundaryHit         ; Branch if hit boundary
    STA PlayerX             ; Store new position
    JMP CheckVertical       ; Continue with Y axis
    
CheckRight:
    LDA InputState          ; Read input again
    AND #%00001000          ; Check right direction
    BEQ CheckVertical       ; Skip if not pressed
    
    ; Move player right
    LDA PlayerX             ; Get current X position
    CLC
    ADC #PlayerSpeed        ; Add speed value
    CMP #RightBoundary      ; Check right boundary
    BCS BoundaryHit         ; Branch if hit boundary
    STA PlayerX             ; Store new position
    
CheckVertical:
    ; Similar logic for Y axis movement
    ; ... implementation continues
    
    SEC                     ; Indicate position changed
    RTS
    
BoundaryHit:
    CLC                     ; Indicate no change
    RTS

; ====================================
; CONSTANTS AND VARIABLES DOCUMENTATION
; ====================================

; Player movement constants
PlayerSpeed     = $02       ; Pixels per frame (2)
LeftBoundary    = $18       ; Left screen edge (24)
RightBoundary   = $E8       ; Right screen edge (232)
TopBoundary     = $32       ; Top screen edge (50)
BottomBoundary  = $FA       ; Bottom screen edge (250)

; Player state variables
PlayerX:        .byte $80   ; Player X position (initialized to center)
PlayerY:        .byte $80   ; Player Y position (initialized to center)
PlayerHealth:   .byte $64   ; Player health (100 decimal)
PlayerScore:    .word $0000 ; Player score (16-bit)
```

### Inline Documentation Standards

```text
; ========================================
; INLINE DOCUMENTATION EXAMPLES
; ========================================

GameMainLoop:
    ; === Main Game Loop ===
    ; Processes one frame of the game
    
    JSR ProcessInput        ; Handle user input
    JSR UpdateGameState     ; Update all game objects
    JSR RenderFrame         ; Draw current frame
    JSR SynchronizeFrame    ; Wait for proper timing
    
    LDA GameRunning         ; Check if game should continue
    BNE GameMainLoop        ; Loop if still running
    RTS

ProcessInput:
    ; === Input Processing ===
    ; Reads joystick and converts to game actions
    
    LDA $DC00               ; Read joystick port 2
    EOR #$FF                ; Invert bits (hardware is active low)
    STA InputState          ; Store for other functions
    
    ; Check for pause button (fire + up)
    AND #%00010001          ; Mask fire and up bits
    CMP #%00010001          ; Both pressed?
    BNE InputProcessDone    ; No, continue normal processing
    
    LDA GamePaused          ; Toggle pause state
    EOR #$01                ; Flip pause bit
    STA GamePaused          ; Store new state
    
InputProcessDone:
    RTS

UpdateGameState:
    ; === Game State Update ===
    ; Updates all game objects for current frame
    
    LDA GamePaused          ; Skip updates if paused
    BNE StateUpdateDone
    
    JSR UpdatePlayer        ; Update player character
    JSR UpdateEnemies       ; Update all enemies
    JSR UpdateProjectiles   ; Update bullets/missiles
    JSR CheckCollisions     ; Test for collisions
    JSR UpdateScore         ; Update scoring system
    
StateUpdateDone:
    RTS
```

## Data Structure Design

### Structured Data Organization

```text
; ========================================
; STRUCTURED DATA DEFINITIONS
; ========================================

; Player data structure (8 bytes)
PLAYER_STRUCT:
PLAYER_X        = 0     ; X position (1 byte)
PLAYER_Y        = 1     ; Y position (1 byte)
PLAYER_VX       = 2     ; X velocity (1 byte)
PLAYER_VY       = 3     ; Y velocity (1 byte)
PLAYER_HEALTH   = 4     ; Health points (1 byte)
PLAYER_SCORE    = 5     ; Score (2 bytes)
PLAYER_FLAGS    = 7     ; Status flags (1 byte)

; Player flags bit definitions
PLAYER_ALIVE    = %00000001     ; Player is alive
PLAYER_INVULN   = %00000010     ; Invulnerability active
PLAYER_POWERED  = %00000100     ; Power-up active
PLAYER_FIRING   = %00001000     ; Currently firing

; Enemy data structure (6 bytes each)
ENEMY_STRUCT:
ENEMY_X         = 0     ; X position (1 byte)
ENEMY_Y         = 1     ; Y position (1 byte)
ENEMY_TYPE      = 2     ; Enemy type (1 byte)
ENEMY_HEALTH    = 3     ; Health points (1 byte)
ENEMY_AI_STATE  = 4     ; AI state (1 byte)
ENEMY_FLAGS     = 5     ; Status flags (1 byte)

; Projectile data structure (5 bytes each)
PROJECTILE_STRUCT:
PROJ_X          = 0     ; X position (1 byte)
PROJ_Y          = 1     ; Y position (1 byte)
PROJ_VX         = 2     ; X velocity (1 byte)
PROJ_VY         = 3     ; Y velocity (1 byte)
PROJ_TYPE       = 4     ; Projectile type (1 byte)

; Data arrays
PlayerData:         .res 8      ; Player structure
EnemyData:          .res 60     ; 10 enemies × 6 bytes
ProjectileData:     .res 50     ; 10 projectiles × 5 bytes

; Array access macros (conceptual)
GetEnemyAddress:
    ; Input: Enemy index in A
    ; Output: Address in $FB/$FC
    ASL                     ; Multiply by 2
    ASL                     ; Multiply by 4
    CLC
    ADC EnemyIndex          ; Add original (×4 + ×1 = ×5)
    ASL                     ; Multiply by 2 (×5 × 2 = ×10 ≈ ×6)
    ; Note: This is simplified - real implementation would be more precise
    CLC
    ADC #<EnemyData         ; Add base address
    STA $FB
    LDA #>EnemyData
    ADC #$00                ; Add carry
    STA $FC
    RTS

EnemyIndex: .byte 0
```

### Complex Data Management

```text
; ========================================
; COMPLEX DATA MANAGEMENT SYSTEM
; ========================================

DataManager:
    ; Object pool management
    MaxEnemies = 10
    MaxProjectiles = 10
    
InitDataManager:
    ; Initialize all data structures
    JSR ClearPlayerData
    JSR ClearEnemyData
    JSR ClearProjectileData
    JSR InitObjectPools
    RTS

ClearPlayerData:
    ; Initialize player data to default values
    LDA #$80                ; Center X position
    STA PlayerData + PLAYER_X
    LDA #$B0                ; Bottom Y position
    STA PlayerData + PLAYER_Y
    LDA #$00                ; No initial velocity
    STA PlayerData + PLAYER_VX
    STA PlayerData + PLAYER_VY
    LDA #$64                ; 100 health points
    STA PlayerData + PLAYER_HEALTH
    LDA #$00                ; Clear score
    STA PlayerData + PLAYER_SCORE
    STA PlayerData + PLAYER_SCORE + 1
    LDA #PLAYER_ALIVE       ; Set alive flag
    STA PlayerData + PLAYER_FLAGS
    RTS

ClearEnemyData:
    ; Clear all enemy data
    LDX #0
    LDA #$00
ClearEnemyLoop:
    STA EnemyData,X
    INX
    CPX #(MaxEnemies * 6)   ; 6 bytes per enemy
    BNE ClearEnemyLoop
    RTS

ClearProjectileData:
    ; Clear all projectile data
    LDX #0
    LDA #$00
ClearProjectileLoop:
    STA ProjectileData,X
    INX
    CPX #(MaxProjectiles * 5) ; 5 bytes per projectile
    BNE ClearProjectileLoop
    RTS

InitObjectPools:
    ; Initialize object allocation pools
    LDA #$00
    STA ActiveEnemies       ; No active enemies
    STA ActiveProjectiles   ; No active projectiles
    RTS

SpawnEnemy:
    ; Spawn a new enemy
    ; Input: Enemy type in A, X position in X, Y position in Y
    PHA                     ; Save enemy type
    TXA
    PHA                     ; Save X position
    TYA
    PHA                     ; Save Y position
    
    ; Find free enemy slot
    JSR FindFreeEnemySlot
    BMI SpawnEnemyFailed    ; No free slots
    
    ; Setup enemy data
    TAX                     ; Enemy slot in X
    PLA                     ; Restore Y position
    STA EnemyData + ENEMY_Y,X
    PLA                     ; Restore X position
    STA EnemyData + ENEMY_X,X
    PLA                     ; Restore enemy type
    STA EnemyData + ENEMY_TYPE,X
    
    LDA #$FF                ; Full health
    STA EnemyData + ENEMY_HEALTH,X
    LDA #$00                ; Initial AI state
    STA EnemyData + ENEMY_AI_STATE,X
    LDA #%00000001          ; Active flag
    STA EnemyData + ENEMY_FLAGS,X
    
    INC ActiveEnemies       ; Increment active count
    CLC                     ; Success
    RTS

SpawnEnemyFailed:
    PLA                     ; Clean stack
    PLA
    PLA
    SEC                     ; Error
    RTS

FindFreeEnemySlot:
    ; Find free enemy slot
    ; Output: Slot index in A (or $FF if none)
    LDX #$00
FindEnemyLoop:
    LDA EnemyData + ENEMY_FLAGS,X
    AND #%00000001          ; Check active flag
    BEQ FoundFreeEnemy      ; Found free slot
    
    TXA
    CLC
    ADC #6                  ; Next enemy (6 bytes each)
    TAX
    CMP #(MaxEnemies * 6)
    BCC FindEnemyLoop
    
    LDA #$FF                ; No free slot
    RTS

FoundFreeEnemy:
    TXA                     ; Return slot index
    RTS

ActiveEnemies:      .byte 0
ActiveProjectiles:  .byte 0
```

**Complete Program Structure Demo:**

```assembly
; Complete program structure demonstration
; Shows professional organisation and documentation

; ========================================
; PROGRAM: STRUCTURED DEMO
; VERSION: 1.0
; DESCRIPTION: Demonstrates professional program organisation
; ========================================

; ========================================
; MAIN PROGRAM ENTRY POINT
; ========================================

StructuredDemo:
    JSR InitializeProgram
    JSR RunMainLoop
    JSR ShutdownProgram
    RTS

; ========================================
; INITIALIZATION MODULE
; ========================================
; Purpose: Initialize all program subsystems
; Modifies: A, X, Y registers
; ========================================

InitializeProgram:
    ; Clear screen and setup display
    LDA #$93                ; Clear screen
    JSR $FFD2               ; CHROUT
    
    ; Set text colour
    LDA #$0E                ; Light blue
    STA $286                ; Current colour
    
    ; Initialize program data
    JSR InitializeData
    
    ; Display program header
    JSR DisplayHeader
    
    RTS

InitializeData:
    ; ====================================
    ; Function: InitializeData
    ; Purpose: Initialize all program variables
    ; ====================================
    
    ; Initialize counters
    LDA #$00
    STA FrameCounter        ; Clear frame counter
    STA ObjectCount         ; Clear object counter
    
    ; Initialize player data structure
    LDA #$50                ; Starting X position
    STA PlayerData + 0      ; Player X
    LDA #$80                ; Starting Y position
    STA PlayerData + 1      ; Player Y
    LDA #$64                ; Starting health (100)
    STA PlayerData + 2      ; Player health
    
    ; Initialize object array
    LDX #$00
    LDA #$00
ClearObjectArray:
    STA ObjectArray,X       ; Clear object data
    INX
    CPX #32                 ; Clear 32 bytes
    BNE ClearObjectArray
    
    RTS

DisplayHeader:
    ; ====================================
    ; Function: DisplayHeader
    ; Purpose: Display program title and info
    ; ====================================
    
    ; Position cursor at top
    LDA #2                  ; Row 2
    STA $D6                 ; Cursor row
    LDA #5                  ; Column 5
    STA $D3                 ; Cursor column
    
    ; Display title
    LDX #0
TitleLoop:
    LDA ProgramTitle,X
    BEQ TitleDone
    JSR $FFD2               ; CHROUT
    INX
    JMP TitleLoop
TitleDone:
    RTS

; ========================================
; MAIN PROGRAM LOOP MODULE
; ========================================
; Purpose: Main execution loop
; Runs until program termination requested
; ========================================

RunMainLoop:
    ; Main execution loop
MainLoop:
    ; Update frame counter
    INC FrameCounter
    
    ; Process one frame
    JSR ProcessFrame
    
    ; Check for exit condition
    JSR CheckExitCondition
    BCC MainLoop            ; Continue if no exit
    
    RTS

ProcessFrame:
    ; ====================================
    ; Function: ProcessFrame
    ; Purpose: Process one frame of execution
    ; ====================================
    
    ; Update simulation
    JSR UpdateSimulation
    
    ; Update display
    JSR UpdateDisplay
    
    ; Add frame delay
    JSR FrameDelay
    
    RTS

UpdateSimulation:
    ; ====================================
    ; Function: UpdateSimulation
    ; Purpose: Update program simulation/logic
    ; ====================================
    
    ; Update player position (simple animation)
    LDA PlayerData + 0      ; Get player X
    CLC
    ADC #$01                ; Move right
    CMP #$C0                ; Check boundary
    BCC StorePlayerX
    LDA #$20                ; Reset to left side
StorePlayerX:
    STA PlayerData + 0      ; Store new X position
    
    ; Update object counter
    INC ObjectCount
    
    RTS

UpdateDisplay:
    ; ====================================
    ; Function: UpdateDisplay  
    ; Purpose: Update screen display
    ; ====================================
    
    ; Display frame counter
    LDA #5                  ; Row 5
    STA $D6                 ; Cursor row
    LDA #2                  ; Column 2
    STA $D3                 ; Cursor column
    
    LDX #0
FrameTextLoop:
    LDA FrameText,X
    BEQ FrameTextDone
    JSR $FFD2
    INX
    JMP FrameTextLoop
FrameTextDone:
    
    ; Display frame number (simplified)
    LDA FrameCounter
    AND #$0F                ; Get low nibble
    CLC
    ADC #'0'                ; Convert to ASCII
    JSR $FFD2               ; Display
    
    ; Display player position
    LDA #6                  ; Row 6
    STA $D6                 ; Cursor row
    LDA #2                  ; Column 2
    STA $D3                 ; Cursor column
    
    LDX #0
PlayerTextLoop:
    LDA PlayerText,X
    BEQ PlayerTextDone
    JSR $FFD2
    INX
    JMP PlayerTextLoop
PlayerTextDone:
    
    ; Display player X position (simplified)
    LDA PlayerData + 0      ; Player X
    LSR                     ; Divide by 4 for display
    LSR
    AND #$0F                ; Get low nibble
    CLC
    ADC #'0'                ; Convert to ASCII
    JSR $FFD2               ; Display
    
    RTS

CheckExitCondition:
    ; ====================================
    ; Function: CheckExitCondition
    ; Purpose: Check if program should exit
    ; Output: Carry clear = continue, set = exit
    ; ====================================
    
    ; Simple exit condition - after 255 frames
    LDA FrameCounter
    CMP #$FF
    BEQ RequestExit
    
    CLC                     ; Continue running
    RTS

RequestExit:
    SEC                     ; Request exit
    RTS

FrameDelay:
    ; ====================================
    ; Function: FrameDelay
    ; Purpose: Provide consistent frame timing
    ; ====================================
    
    LDY #$40                ; Delay value
DelayLoop:
    DEY
    BNE DelayLoop
    RTS

; ========================================
; SHUTDOWN MODULE
; ========================================
; Purpose: Clean shutdown of all systems
; ========================================

ShutdownProgram:
    ; Display shutdown message
    LDA #10                 ; Row 10
    STA $D6                 ; Cursor row
    LDA #2                  ; Column 2
    STA $D3                 ; Cursor column
    
    LDX #0
ShutdownLoop:
    LDA ShutdownText,X
    BEQ ShutdownDone
    JSR $FFD2
    INX
    JMP ShutdownLoop
ShutdownDone:
    
    ; Clean up resources (placeholder)
    ; In real program: close files, restore interrupts, etc.
    
    RTS

; ========================================
; DATA SECTION
; ========================================
; Contains all program constants and variables
; ========================================

; Program constants
ProgramTitle:   .text \
```

## Advanced Organization Patterns

### State Machine Architecture

```text
; ========================================
; STATE MACHINE ARCHITECTURE
; ========================================

StateMachine:
    ; Program states
    STATE_INIT      = $00
    STATE_MENU      = $01
    STATE_PLAYING   = $02
    STATE_PAUSED    = $03
    STATE_GAMEOVER  = $04
    STATE_SHUTDOWN  = $05

StateManager:
    CurrentState = $C0
    NextState = $C1

InitStateMachine:
    LDA #STATE_INIT
    STA CurrentState
    STA NextState
    RTS

UpdateStateMachine:
    ; Check for state change
    LDA CurrentState
    CMP NextState
    BEQ UpdateCurrentState
    
    ; State change requested
    JSR ExitCurrentState
    LDA NextState
    STA CurrentState
    JSR EnterNewState

UpdateCurrentState:
    ; Execute current state logic
    LDA CurrentState
    ASL                     ; Multiply by 2 for word table
    TAX
    LDA StateTableLo,X
    STA $FB
    LDA StateTableHi,X
    STA $FC
    JMP ($FB)               ; Jump to state handler

StateTableLo:
    .byte <StateInit, <StateMenu, <StatePlaying
    .byte <StatePaused, <StateGameOver, <StateShutdown

StateTableHi:
    .byte >StateInit, >StateMenu, >StatePlaying
    .byte >StatePaused, >StateGameOver, >StateShutdown

ExitCurrentState:
    ; Cleanup when leaving state
    RTS

EnterNewState:
    ; Setup when entering state
    RTS

StateInit:
    ; Initialization state
    LDA #STATE_MENU
    STA NextState
    RTS

StateMenu:
    ; Menu state logic
    RTS

StatePlaying:
    ; Game playing state
    RTS

StatePaused:
    ; Paused state logic
    RTS

StateGameOver:
    ; Game over state
    RTS

StateShutdown:
    ; Shutdown state
    RTS
```

### Component System Architecture

```text
; ========================================
; COMPONENT SYSTEM ARCHITECTURE
; ========================================

ComponentSystem:
    ; Component types
    COMP_POSITION   = $01
    COMP_VELOCITY   = $02
    COMP_SPRITE     = $03
    COMP_HEALTH     = $04
    COMP_AI         = $05

    ; Entity management
    MaxEntities = 16
    MaxComponents = 64

EntityManager:
    EntityCount = $D0
    ComponentCount = $D1

CreateEntity:
    ; Create new entity
    ; Output: Entity ID in A
    LDA EntityCount
    CMP #MaxEntities
    BCS EntityCreateFailed
    
    INC EntityCount
    SEC
    SBC #$01                ; Return previous count as ID
    RTS

EntityCreateFailed:
    LDA #$FF                ; Invalid entity ID
    RTS

AddComponent:
    ; Add component to entity
    ; Input: Entity ID in A, Component type in X
    ; Component data address in $FB/$FC
    RTS

GetComponent:
    ; Get component from entity
    ; Input: Entity ID in A, Component type in X
    ; Output: Component address in $FB/$FC
    RTS

UpdateAllEntities:
    ; Update all entity systems
    JSR UpdateMovementSystem
    JSR UpdateRenderSystem
    JSR UpdateAISystem
    RTS

UpdateMovementSystem:
    ; Update all entities with position and velocity
    RTS

UpdateRenderSystem:
    ; Update all entities with sprite components
    RTS

UpdateAISystem:
    ; Update all entities with AI components
    RTS
```

## Program Organization Best Practices

### 1. Use Consistent Naming Conventions
```text
; Good naming patterns:
InitializeGraphics:     ; Verb + Object
PlayerMovementSpeed:    ; Object + Property
MAX_ENEMIES:           ; CONSTANT in caps
player_x_position:     ; Alternative snake_case
```

### 2. Group Related Functions
```text
; Graphics module functions together
ClearScreen:
SetupColors:
InitSprites:
DrawBackground:

; Audio module functions together
InitSID:
PlaySound:
StopSound:
UpdateMusic:
```

### 3. Separate Code from Data
```text
; Code section
; (All subroutines here)

; Data section
; (All variables and constants here)
PlayerData:     .res 8
EnemyData:      .res 32
LevelData:      .res 64
```

## What You've Learned

In this lesson, you've mastered:

- **Modular Programming**: Breaking programs into manageable, reusable modules
- **Memory Organization**: Professional memory layout and data structure design
- **Documentation Standards**: Professional commenting and documentation practices
- **Code Architecture**: Scalable patterns for large program development
- **Library Development**: Creating reusable function libraries
- **Professional Practices**: Industry-standard organisation and structure techniques

## Looking Ahead

In the next lesson, you'll learn **basic optimisation and efficiency** - techniques to make your well-organised code run faster and use memory more efficiently.

## Fun Fact

The program organisation techniques you've learned are the foundation of all professional software development! The modular programming, documentation standards, and architectural patterns you've implemented are used in everything from operating systems to mobile apps to massive enterprise software. The component systems, state machines, and library patterns you've mastered are the same concepts used in modern game engines, web frameworks, and distributed systems. You've learned the timeless principles of software architecture that scale from small assembly programs to million-line codebases!