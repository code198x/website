---
title: "Data Structures and Arrays"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 14
description: "Master data organization techniques for complex programs. Learn to create and manage arrays, tables, lists, and structured data for games and applications."
learning_objectives:
  - "Understand how to organize data in memory efficiently"
  - "Create and manipulate arrays for multiple data items"
  - "Learn table lookup techniques for fast data access"
  - "Master linked list concepts for dynamic data"
  - "Build structured data systems for complex programs"
concepts:
  - "Array creation and indexing"
  - "Table lookup systems"
  - "Structured data records"
  - "Dynamic memory management"
  - "Data organization patterns"
estimated_duration: "50-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 14
---

# Lesson 14: Data Structures and Arrays

As your programs become more complex, you need efficient ways to organize and access data. This lesson covers the fundamental data structures that make complex games and applications possible on the ZX Spectrum.

## Understanding Data Organization

### Why Data Structures Matter

In assembly programming, you must explicitly manage how data is stored and accessed:

- **Arrays**: Store multiple similar items (like enemy positions)
- **Tables**: Quick lookup for calculations (like sine tables)  
- **Records**: Group related data together (like player statistics)
- **Lists**: Dynamic collections that can grow and shrink

Good data organization makes your programs faster, more reliable, and easier to maintain.

## Array Fundamentals

### Simple Arrays

An array is a collection of data items stored consecutively in memory:

```text
; Array of 10 enemy X positions
EnemyXPositions:
    DB 50, 75, 100, 125, 150, 175, 200, 225, 250, 275

; Array of 10 enemy Y positions  
EnemyYPositions:
    DB 20, 30, 40, 50, 60, 70, 80, 90, 100, 110
```

### Accessing Array Elements

```text
; Get enemy 5's X position
LD HL, EnemyXPositions  ; Base address
LD A, 5                 ; Element number
LD B, 0
LD C, A                 ; BC = element number
ADD HL, BC              ; HL points to element 5
LD A, (HL)              ; A = enemy 5's X position
```

**Basic Array Access:**

```assembly
; Create array of numbers in memory
LD HL, $6000            ; Array storage area

; Initialize array with values
LD (HL), 10 : INC HL    ; Element 0 = 10
LD (HL), 20 : INC HL    ; Element 1 = 20
LD (HL), 30 : INC HL    ; Element 2 = 30
LD (HL), 40 : INC HL    ; Element 3 = 40
LD (HL), 50 : INC HL    ; Element 4 = 50

; Access element 3 (value 40)
LD HL, $6000            ; Base of array
LD A, 3                 ; Want element 3
LD C, A                 ; Element index in C
LD B, 0                 ; Clear B
ADD HL, BC              ; HL now points to element 3
LD A, (HL)              ; A = 40 (value of element 3)

; Modify element 1
LD HL, $6000            ; Base of array
INC HL                  ; Point to element 1
LD (HL), 99             ; Change element 1 to 99
```

### Multi-Dimensional Arrays

For 2D arrays (like game boards), calculate address as: base + (row × width) + column

```text
; 8×8 game board (64 bytes total)
GameBoard:
    DS 64                   ; Reserve 64 bytes

; Access element at row 3, column 5
; Address = GameBoard + (3 × 8) + 5 = GameBoard + 29
GetBoardElement:
    LD HL, GameBoard        ; Base address
    LD A, 3                 ; Row
    SLA A                   ; × 2
    SLA A                   ; × 4  
    SLA A                   ; × 8 (now A = row × 8)
    LD B, 0
    LD C, A                 ; BC = row × 8
    ADD HL, BC              ; Add row offset
    LD BC, 5                ; Column offset
    ADD HL, BC              ; HL points to [3,5]
    LD A, (HL)              ; Get board element
```

**2D Array Access:**

```assembly
; Create 4×4 grid (16 bytes)
LD HL, $6100            ; Grid storage area

; Initialize 4×4 grid with values
LD B, 16                ; 16 elements total
LD A, 1                 ; Starting value

InitGrid:
    LD (HL), A          ; Store value
    INC A               ; Next value
    INC HL              ; Next position
    DJNZ InitGrid       ; Continue for all elements

; Access element at row 2, column 1
; Address = base + (row × width) + column
; Address = $6100 + (2 × 4) + 1 = $6100 + 9
LD HL, $6100            ; Grid base
LD BC, 9                ; Offset for [2,1]
ADD HL, BC              ; Point to element
LD A, (HL)              ; Get value (should be 10)

; Modify element at row 1, column 3  
; Address = base + (1 × 4) + 3 = base + 7
LD HL, $6100            ; Grid base
LD BC, 7                ; Offset for [1,3]
ADD HL, BC              ; Point to element
LD (HL), 99             ; Set new value
```

## Table Lookup Systems

### Lookup Tables for Fast Calculations

Tables let you trade memory for speed - precompute values instead of calculating them:

```text
; Sine table (0-90 degrees in 16 steps)
SineTable:
    DB 0, 6, 12, 18, 24, 30, 36, 42
    DB 48, 54, 60, 66, 72, 78, 84, 90

; Get sine of 45 degrees (index 8)
GetSine45:
    LD HL, SineTable        ; Table base
    LD A, 8                 ; 45 degrees index
    LD B, 0
    LD C, A
    ADD HL, BC              ; Point to entry
    LD A, (HL)              ; A = sine(45°) ≈ 60
```

### Movement Direction Tables

```text
; Direction vectors for 8-way movement
DirectionTable:
    ; X deltas for 8 directions (0-7)
    DB 0, 1, 1, 1, 0, -1, -1, -1      ; Right, Down-Right, Down, etc.
    ; Y deltas for 8 directions  
    DB -1, -1, 0, 1, 1, 1, 0, -1      ; Up, Up-Right, Right, etc.

; Move sprite in direction 3 (down-right)
MoveInDirection:
    LD A, 3                 ; Direction number
    LD HL, DirectionTable   ; X delta table
    LD B, 0
    LD C, A
    ADD HL, BC              ; Point to X delta
    LD B, (HL)              ; B = X delta
    
    LD HL, DirectionTable + 8  ; Y delta table
    ADD HL, BC              ; Point to Y delta
    LD C, (HL)              ; C = Y delta
    
    ; Now B = X delta, C = Y delta for direction 3
```

**Lookup Table Demonstration:**

```assembly
; Create multiplication table for ×5
LD HL, $6200            ; Table storage
LD B, 10                ; 10 entries (0-9)
LD A, 0                 ; Starting value

MultiplyTable:
    LD (HL), A          ; Store A×5
    ADD A, 5            ; Next multiple of 5
    INC HL              ; Next table entry
    DJNZ MultiplyTable  ; Continue for all entries

; Use table to find 7×5 quickly
LD HL, $6200            ; Table base
LD A, 7                 ; Want 7×5
LD C, A
LD B, 0
ADD HL, BC              ; Point to entry 7
LD A, (HL)              ; A = 35 (7×5)

; Create character value table (ASCII A-Z)
LD HL, $6300            ; Character table
LD B, 26                ; 26 letters
LD A, $41               ; ASCII 'A'

CharTable:
    LD (HL), A          ; Store character
    INC A               ; Next ASCII value
    INC HL              ; Next table position
    DJNZ CharTable      ; Continue for all letters

; Look up letter 'F' (index 5)
LD HL, $6300            ; Table base
LD BC, 5                ; Index for 'F'
ADD HL, BC              ; Point to entry
LD A, (HL)              ; A = $46 (ASCII 'F')
```

## Structured Data Records

### Player Data Structure

```text
; Player record structure (8 bytes per player)
PlayerRecord:
    ; Offset 0: X position
    ; Offset 1: Y position  
    ; Offset 2: Lives
    ; Offset 3: Score (low byte)
    ; Offset 4: Score (high byte)
    ; Offset 5: Power level
    ; Offset 6: Weapon type
    ; Offset 7: Status flags

; Player data for 4 players
PlayerData:
    ; Player 0
    DB 100, 50, 3, 0, 10, 1, 0, 0
    ; Player 1  
    DB 150, 75, 2, 50, 15, 2, 1, 1
    ; Player 2
    DB 200, 100, 3, 100, 20, 1, 0, 0
    ; Player 3
    DB 75, 125, 1, 150, 25, 3, 2, 1
```

### Accessing Structured Data

```text
; Get player 2's X position
GetPlayerX:
    LD A, 2                 ; Player number
    ; Each record is 8 bytes, so multiply by 8
    SLA A                   ; × 2
    SLA A                   ; × 4
    SLA A                   ; × 8
    LD HL, PlayerData       ; Base of player data
    LD B, 0
    LD C, A                 ; Offset to player 2's record
    ADD HL, BC              ; Point to player 2's record
    ; HL+0 = X, HL+1 = Y, HL+2 = Lives, etc.
    LD A, (HL)              ; A = Player 2's X position
```

**Structured Data Example:**

```assembly
; Create enemy data structure
; Each enemy: X, Y, Health, Type (4 bytes each)
LD HL, $6400            ; Enemy data area

; Enemy 0: X=50, Y=30, Health=3, Type=1
LD (HL), 50 : INC HL    ; X position
LD (HL), 30 : INC HL    ; Y position  
LD (HL), 3  : INC HL    ; Health
LD (HL), 1  : INC HL    ; Enemy type

; Enemy 1: X=100, Y=60, Health=5, Type=2
LD (HL), 100 : INC HL   ; X position
LD (HL), 60  : INC HL   ; Y position
LD (HL), 5   : INC HL   ; Health
LD (HL), 2   : INC HL   ; Enemy type

; Enemy 2: X=150, Y=90, Health=2, Type=1
LD (HL), 150 : INC HL   ; X position
LD (HL), 90  : INC HL   ; Y position
LD (HL), 2   : INC HL   ; Health  
LD (HL), 1   : INC HL   ; Enemy type

; Access enemy 1's health
LD HL, $6400            ; Base of enemy data
LD A, 1                 ; Want enemy 1
SLA A : SLA A           ; × 4 (4 bytes per enemy)
LD C, A : LD B, 0       ; Offset in BC
ADD HL, BC              ; Point to enemy 1's record
INC HL : INC HL         ; Move to health field (+2)
LD A, (HL)              ; A = enemy 1's health (5)

; Damage enemy 1 (reduce health)
DEC (HL)                ; Reduce health by 1
```

## Dynamic Lists and Linked Structures

### Simple Dynamic List

```text
; List header
ListData:
    DB 10                   ; Maximum capacity
    DB 0                    ; Current count
    DS 10                   ; Space for 10 items

; Add item to list
; Input: A = item to add
AddToList:
    LD HL, ListData + 1     ; Point to count
    LD B, (HL)              ; Get current count
    LD A, (HL-1)            ; Get maximum capacity  
    CP B                    ; Check if list full
    RET Z                   ; Return if full
    
    ; Add item to end of list
    INC (HL)                ; Increment count
    LD A, B                 ; Current count (before increment)
    LD BC, 0
    LD C, A                 ; Offset to end of list
    ADD HL, BC              ; Point to insertion point
    INC HL                  ; Skip count byte
    LD (HL), A              ; Store new item
    RET
```

### Linked List Concept

```text
; Node structure: [Data][Next Address Low][Next Address High]
; Each node is 3 bytes

LinkedListHead:
    DW FirstNode            ; Address of first node

FirstNode:
    DB 100                  ; Data value
    DW SecondNode           ; Address of next node

SecondNode:
    DB 200                  ; Data value  
    DW ThirdNode            ; Address of next node

ThirdNode:
    DB 150                  ; Data value
    DW 0                    ; End of list (null pointer)
```

## Data Organization Patterns

### Game State Structure

```text
; Complete game state
GameState:
    ; Player data
    DB 100, 50              ; Player X, Y
    DB 3                    ; Lives
    DW 1500                 ; Score (16-bit)
    
    ; Game settings
    DB 1                    ; Level number
    DB 10                   ; Enemies remaining
    DB 0                    ; Game paused flag
    DB 5                    ; Difficulty level
    
    ; Temporary variables
    DW 0                    ; Temp calculation space
    DB 0                    ; Frame counter
    DB 0                    ; Input state
```

### Screen Buffer Management

```text
; Screen buffer system
ScreenBuffers:
    ; Buffer 0: Current screen
    DS 6144                 ; Pixel data
    DS 768                  ; Attribute data
    
    ; Buffer 1: Background  
    DS 6144                 ; Pixel data
    DS 768                  ; Attribute data

; Switch between buffers
SwapBuffers:
    LD HL, ScreenBuffers    ; Source buffer
    LD DE, $4000            ; Screen memory
    LD BC, 6912             ; Total screen size
    LDIR                    ; Copy buffer to screen
    RET
```

**Game Data Organization:**

```assembly
; Complete game data example
LD HL, $6500            ; Game data area

; Player statistics block
LD (HL), 100 : INC HL   ; Player X
LD (HL), 75  : INC HL   ; Player Y  
LD (HL), 3   : INC HL   ; Lives
LD (HL), 0   : INC HL   ; Score low byte
LD (HL), 10  : INC HL   ; Score high byte (score = 2560)
LD (HL), 1   : INC HL   ; Level
LD (HL), 8   : INC HL   ; Enemies remaining

; Power-up inventory (5 different power-ups)
LD (HL), 2   : INC HL   ; Speed boost count
LD (HL), 1   : INC HL   ; Shield count
LD (HL), 0   : INC HL   ; Weapon upgrade count
LD (HL), 3   : INC HL   ; Health pack count
LD (HL), 1   : INC HL   ; Extra life count

; Access player's score (16-bit value)
LD HL, $6500 + 3        ; Point to score low byte
LD A, (HL)              ; Low byte
INC HL
LD B, (HL)              ; High byte
; Score = B × 256 + A = 10 × 256 + 0 = 2560

; Increase score by 100
LD HL, $6500 + 3        ; Score location
LD A, (HL)              ; Get low byte
ADD A, 100              ; Add 100
LD (HL), A              ; Store back
JR NC, NoCarry          ; Check for carry
INC HL                  ; Point to high byte
INC (HL)                ; Increment high byte
NoCarry:
    ; Score updated successfully
```

## Memory Management Techniques

### Stack-Based Data

```text
; Using stack for temporary data storage
SaveGameState:
    ; Save all important data to stack
    LD HL, (PlayerX)        ; Get player position
    PUSH HL                 ; Save on stack
    LD A, (PlayerLives)     ; Get lives
    PUSH AF                 ; Save on stack
    LD HL, (PlayerScore)    ; Get score
    PUSH HL                 ; Save on stack
    
    ; ... do temporary operations ...
    
RestoreGameState:
    ; Restore data from stack (reverse order)
    POP HL                  ; Restore score
    LD (PlayerScore), HL
    POP AF                  ; Restore lives
    LD (PlayerLives), A
    POP HL                  ; Restore position
    LD (PlayerX), HL
    RET
```

### Circular Buffers

```text
; Circular buffer for game events
EventBuffer:
    DB 10                   ; Buffer size
    DB 0                    ; Write pointer  
    DB 0                    ; Read pointer
    DS 10                   ; Event data

; Add event to circular buffer
AddEvent:
    LD HL, EventBuffer + 1  ; Write pointer
    LD A, (HL)              ; Get write position
    INC A                   ; Next position
    CP 10                   ; Check if at end
    JR C, WriteOK           ; Jump if < 10
    LD A, 0                 ; Wrap to beginning
WriteOK:
    LD (HL), A              ; Update write pointer
    ; Store event data at calculated position
```

## Practice Exercise

Create a complete sprite management system that demonstrates:

1. An array of sprite positions (X, Y coordinates)
2. A lookup table for sprite animation frames
3. A structured data system for sprite properties (health, type, status)
4. Dynamic list management for active/inactive sprites
5. Efficient data access routines for game updates

**Practice Exercise - Sprite Management:**

```assembly
; Sprite management system demonstration
; Sprite data structure: X, Y, Health, Type, Status (5 bytes each)
LD HL, $6600            ; Sprite data area

; Create 3 sprites
; Sprite 0: X=50, Y=30, Health=5, Type=1, Status=1 (active)
LD (HL), 50 : INC HL
LD (HL), 30 : INC HL  
LD (HL), 5  : INC HL
LD (HL), 1  : INC HL
LD (HL), 1  : INC HL

; Sprite 1: X=100, Y=60, Health=3, Type=2, Status=1 (active)
LD (HL), 100 : INC HL
LD (HL), 60  : INC HL
LD (HL), 3   : INC HL
LD (HL), 2   : INC HL
LD (HL), 1   : INC HL

; Sprite 2: X=150, Y=90, Health=0, Type=1, Status=0 (inactive)  
LD (HL), 150 : INC HL
LD (HL), 90  : INC HL
LD (HL), 0   : INC HL
LD (HL), 1   : INC HL
LD (HL), 0   : INC HL

; Movement table for different sprite types
LD HL, $6700            ; Movement data area
; Type 1 movement: dx=1, dy=0 (moves right)
LD (HL), 1 : INC HL     ; dx
LD (HL), 0 : INC HL     ; dy
; Type 2 movement: dx=0, dy=1 (moves down)
LD (HL), 0 : INC HL     ; dx  
LD (HL), 1 : INC HL     ; dy

; Update sprite 1's position based on its type
LD HL, $6600 + 5        ; Point to sprite 1
LD A, (HL+3)            ; Get sprite type (2)
DEC A                   ; Convert to 0-based index
SLA A                   ; × 2 (2 bytes per movement entry)
LD HL, $6700            ; Movement table base
LD C, A : LD B, 0
ADD HL, BC              ; Point to movement data for type 2
LD B, (HL)              ; Get dx
INC HL
LD C, (HL)              ; Get dy

; Apply movement to sprite 1
LD HL, $6600 + 5        ; Point to sprite 1
LD A, (HL)              ; Get current X
ADD A, B                ; Add dx
LD (HL), A              ; Store new X
INC HL
LD A, (HL)              ; Get current Y  
ADD A, C                ; Add dy
LD (HL), A              ; Store new Y

; Sprite 1 has now moved according to its type!
```

## Data Structure Best Practices

### Memory Layout Planning

1. **Group related data together** - keeps cache-friendly access patterns
2. **Align data appropriately** - use even addresses for 16-bit values
3. **Reserve space for growth** - plan for maximum data sizes
4. **Use consistent structures** - makes code more maintainable

### Performance Considerations

1. **Use tables for expensive calculations** - trade memory for speed
2. **Keep frequently accessed data in lower memory** - faster addressing
3. **Use index registers for structured data** - efficient member access
4. **Consider data access patterns** - organize for sequential access when possible

## What You've Learned

In this advanced lesson, you've mastered:

- Creating and accessing arrays for multiple data items
- Building lookup tables for fast calculations and data retrieval
- Designing structured data records for complex information
- Implementing dynamic lists and linked data structures
- Organizing game state and application data efficiently
- Understanding memory management patterns and best practices
- Creating reusable data access routines for complex programs

## Looking Ahead

Next, you'll learn about **keyboard input and user interaction** - reading player input, handling different key combinations, and creating responsive user interfaces for your programs!

## Fun Fact

The limited memory of 8-bit computers like the ZX Spectrum forced programmers to become incredibly creative with data organization. Many classic games used ingenious data compression techniques, shared data structures between different game systems, and extremely compact data representations. For example, some games stored multiple game elements in single bytes using bit flags, while others used mathematical relationships to generate large amounts of game data from small lookup tables. These memory optimization techniques, born from necessity, actually made programs faster and more efficient - lessons that remain valuable even in today's world of abundant memory!