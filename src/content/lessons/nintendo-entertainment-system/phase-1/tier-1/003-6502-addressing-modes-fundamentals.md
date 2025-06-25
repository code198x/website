---
title: "6502 Addressing Modes Fundamentals"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 3
description: "Learn the different ways the 6502 can access data - immediate, zero page, absolute, and indexed addressing modes. Learn when and why to use each mode for efficient NES programming."
learning_objectives:
  - "Understand what addressing modes are and why they matter"
  - "Learn immediate addressing mode (#value)"
  - "Learn zero page and absolute addressing modes"
  - "Practice indexed addressing with X and Y registers"
  - "Compare the efficiency of different 6502 addressing modes"
concepts:
  - "6502 addressing modes overview"
  - "Immediate addressing (LDA #value)"
  - "Zero page addressing (LDA $00)"
  - "Absolute addressing (LDA $0200)"
  - "Indexed addressing (LDA $0200,X)"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 3
---

# Lesson 3: 6502 Addressing Modes Fundamentals

You've already been using addressing modes without knowing it! Today, you'll learn what they are, why they exist, and how to choose the right one for each situation on the 6502.

## What Are Addressing Modes?

Addressing modes are different ways the 6502 can locate data. Think of them as different ways to give directions:

- **"The number 5"** (immediate)
- **"What's in drawer 10"** (zero page)
- **"What's in room 512, drawer 10"** (absolute)
- **"What's in the 5th drawer from here"** (indexed)

Each mode serves different purposes and has different performance characteristics.

## Immediate Addressing (#value)

**Format**: `LDA #value`
**Purpose**: Load a constant value directly
**Speed**: Fast (2 cycles)
**Use when**: You know the exact value you need

```text
LDA #$42        ; Load the number 42
LDX #100        ; Load the number 100
LDY #%11110000  ; Load binary pattern
```

**Immediate Addressing Examples:**

```assembly
; Immediate addressing - loading constant values
; The # symbol means 'the value itself', not 'what's stored at that address'

ImmediateDemo:
    ; === LOADING CONSTANTS ===
    LDA #$20        ; Load hex 20 (32 decimal)
    STA $0200       ; Store to memory
    
    LDX #50         ; Load decimal 50
    STX $0201       ; Store X to memory
    
    LDY #%10101010  ; Load binary pattern
    STY $0202       ; Store Y to memory
    
    ; === NES-SPECIFIC CONSTANTS ===
    ; Common values used in NES programming
    LDA #$02        ; Page 2 (common for sprite DMA)
    STA $0210       ; Store page number
    
    LDA #$20        ; PPU address high byte ($2000-$23FF)
    STA $0211       ; Store PPU high byte
    
    LDA #$3F        ; Palette address high byte
    STA $0212       ; Store palette high byte
    
    ; === ASCII CHARACTER LOADING ===
    LDA #'N'        ; Load ASCII 'N'
    STA $0220       ; Store first character
    LDA #'E'        ; Load ASCII 'E'  
    STA $0221       ; Store second character
    LDA #'S'        ; Load ASCII 'S'
    STA $0222       ; Store third character
    
    ; === COMMON BIT PATTERNS ===
    LDA #%11111111  ; All bits set (255)
    STA $0230       ; Store all-ones pattern
    
    LDA #%00000000  ; All bits clear (0)
    STA $0231       ; Store all-zeros pattern
    
    LDA #%01010101  ; Alternating pattern
    STA $0232       ; Store alternating bits
    
    ; === INITIALIZATION VALUES ===
    LDA #$00        ; Common initialization value
    STA $0240       ; Clear first location
    STA $0241       ; Clear second location
    STA $0242       ; Clear third location
    
    RTS
```

## Zero Page Addressing ($00-$FF)

**Format**: `LDA $10`
**Purpose**: Access the first 256 bytes of memory quickly
**Speed**: Fast (3 cycles) 
**Use when**: Frequently accessed variables, temporary storage

```text
LDA $10         ; Load from zero page address $10
STA $20         ; Store to zero page address $20
```

**Zero Page Addressing:**

```assembly
; Zero page addressing - fast access to first 256 bytes
; Zero page ($00-$FF) is the 6502's 'fast lane'

ZeroPageDemo:
    ; === ZERO PAGE VARIABLES ===
    ; Set up variables in zero page for fast access
    LDA #$10        ; Player X position
    STA $10         ; Store in zero page $10
    
    LDA #$20        ; Player Y position
    STA $11         ; Store in zero page $11
    
    LDA #$05        ; Player speed
    STA $12         ; Store in zero page $12
    
    ; === FAST CALCULATIONS ===
    ; Perform calculations using zero page variables
    LDA $10         ; Load player X (fast!)
    CLC             ; Clear carry
    ADC $12         ; Add speed (fast!)
    STA $10         ; Update position (fast!)
    
    ; Check boundary
    CMP #$F0        ; Compare with right edge
    BCC NoWrap      ; Branch if less than 240
    LDA #$00        ; Wrap to left side
    STA $10         ; Update position
    
NoWrap:
    ; === ZERO PAGE POINTERS ===
    ; Use zero page for 16-bit pointers
    LDA #$00        ; Low byte of address $0300
    STA $20         ; Store in zero page $20
    LDA #$03        ; High byte of address $0300
    STA $21         ; Store in zero page $21
    
    ; Use the pointer
    LDY #$00        ; Initialize offset
    LDA #$99        ; Load test value
    STA ($20),Y     ; Store using zero page pointer
    
    ; === ZERO PAGE COUNTERS ===
    ; Use zero page for loop counters
    LDA #$08        ; Initialize counter
    STA $30         ; Store counter in zero page
    
CounterLoop:
    ; Do something with counter
    LDA $30         ; Load counter (fast!)
    STA $0300,X     ; Store counter value
    INX             ; Increment X
    
    DEC $30         ; Decrement counter (fast!)
    BNE CounterLoop ; Continue if not zero
    
    ; === ZERO PAGE ARITHMETIC ===
    ; Fast arithmetic using zero page
    LDA #$25        ; Load first number
    STA $40         ; Store in zero page
    LDA #$17        ; Load second number
    STA $41         ; Store in zero page
    
    ; Add them together
    LDA $40         ; Load first number (fast!)
    CLC             ; Clear carry
    ADC $41         ; Add second number (fast!)
    STA $42         ; Store result (fast!)
    
    ; === ZERO PAGE BIT FLAGS ===
    ; Use zero page bytes as bit flags
    LDA #%00000000  ; Clear all flags
    STA $50         ; Store flags in zero page
    
    ; Set some flags
    LDA $50         ; Load flags (fast!)
    ORA #%00000001  ; Set bit 0
    ORA #%00001000  ; Set bit 3
    STA $50         ; Store updated flags (fast!)
    
    RTS
```

## Absolute Addressing ($0000-$FFFF)

**Format**: `LDA $0200`
**Purpose**: Access any memory location in the 64KB address space
**Speed**: Slower (4 cycles)
**Use when**: Accessing specific memory locations, arrays, buffers

```text
LDA $0200       ; Load from address $0200
STA $0300       ; Store to address $0300
```

**Absolute Addressing:**

```assembly
; Absolute addressing - access to full 64KB memory space
; Use when you need to access specific memory locations

AbsoluteDemo:
    ; === BUFFER MANAGEMENT ===
    ; Set up data buffers in specific memory locations
    LDA #$AA        ; Load test pattern
    STA $0300       ; Store in buffer 1
    STA $0400       ; Store in buffer 2
    STA $0500       ; Store in buffer 3
    
    ; === SPRITE DATA STORAGE ===
    ; Store sprite data at fixed locations
    LDA #$50        ; Sprite Y position
    STA $0200       ; Store sprite 0 Y
    LDA #$60        ; Sprite X position  
    STA $0203       ; Store sprite 0 X
    
    LDA #$01        ; Sprite tile number
    STA $0201       ; Store sprite 0 tile
    LDA #$00        ; Sprite attributes
    STA $0202       ; Store sprite 0 attributes
    
    ; === SCREEN BUFFER ACCESS ===
    ; Access specific screen memory locations
    LDA #'H'        ; Load ASCII 'H'
    STA $0600       ; Store at screen position
    LDA #'I'        ; Load ASCII 'I'
    STA $0601       ; Store next character
    
    ; === LOOKUP TABLE ACCESS ===
    ; Access data in lookup tables
    LDA $0800       ; Load from sine table
    STA $0250       ; Store sine value
    LDA $0900       ; Load from cosine table
    STA $0251       ; Store cosine value
    
    ; === MEMORY BLOCK INITIALIZATION ===
    ; Initialize specific memory blocks
    LDA #$00        ; Clear value
    STA $0700       ; Clear start of block
    STA $0701       ; Clear next byte
    STA $0702       ; Clear next byte
    STA $0703       ; Clear next byte
    
    ; === NES-SPECIFIC ADDRESSES ===
    ; Access NES hardware registers (read-only example)
    LDA $2002       ; Read PPU status register
    STA $0260       ; Store status for later use
    
    ; === FIXED DATA STRUCTURES ===
    ; Access elements of fixed data structures
    LDA #$FF        ; Load end marker
    STA $0A00       ; Store at end of data structure
    
    LDA #$10        ; Load size value
    STA $0A01       ; Store size information
    
    RTS
```

## Indexed Addressing (with X and Y)

**Format**: `LDA $0200,X` or `LDA $0200,Y`
**Purpose**: Access arrays and lists using an offset
**Speed**: Slower (4+ cycles)
**Use when**: Processing arrays, lists, tables

```text
LDX #$05        ; Load index 5
LDA $0200,X     ; Load from $0200 + 5 = $0205
STA $0300,Y     ; Store to $0300 + Y
```

**Indexed Addressing:**

```assembly
; Indexed addressing - powerful array and table access
; Use X and Y registers as offsets for flexible data access

IndexedDemo:
    ; === ARRAY INITIALIZATION ===
    ; Fill an array with values using indexed addressing
    LDX #$00        ; Initialize index to 0
    
FillArray:
    TXA             ; Transfer index to accumulator
    STA $0400,X     ; Store index value at array + index
    INX             ; Increment index
    CPX #$10        ; Check if filled 16 elements
    BNE FillArray   ; Continue if not done
    
    ; === LOOKUP TABLE ACCESS ===
    ; Access lookup table using index
    LDX #$05        ; Load table index 5
    LDA LookupTable,X ; Load value from table + index
    STA $0250       ; Store looked-up value
    
    LDX #$0A        ; Load different index
    LDA LookupTable,X ; Load different table value
    STA $0251       ; Store second value
    
    ; === STRING PROCESSING ===
    ; Process a string character by character
    LDY #$00        ; Initialize string index
    
ProcessString:
    LDA TestString,Y ; Load character from string
    BEQ StringDone  ; Branch if null terminator (0)
    STA $0500,Y     ; Store character to output buffer
    INY             ; Move to next character
    JMP ProcessString ; Continue processing
    
StringDone:
    LDA #$00        ; Load null terminator
    STA $0500,Y     ; Terminate output string
    
    ; === SPRITE ARRAY MANIPULATION ===
    ; Update multiple sprites using indexed addressing
    LDX #$00        ; Initialize sprite index
    
UpdateSprites:
    LDA #$80        ; Load Y position
    STA $0200,X     ; Store sprite Y position
    INX             ; Move to tile index
    
    LDA #$01        ; Load tile number
    STA $0200,X     ; Store sprite tile
    INX             ; Move to attributes
    
    LDA #$00        ; Load attributes
    STA $0200,X     ; Store sprite attributes  
    INX             ; Move to X position
    
    LDA #$90        ; Load X position
    STA $0200,X     ; Store sprite X position
    INX             ; Move to next sprite
    
    CPX #$10        ; Check if updated 4 sprites (4 * 4 bytes)
    BNE UpdateSprites ; Continue if more sprites
    
    ; === TWO-DIMENSIONAL ARRAY ACCESS ===
    ; Access 2D array using calculated offsets
    LDA #$02        ; Load row number
    ASL A           ; Multiply by 2
    ASL A           ; Multiply by 4 (4 bytes per row)
    TAX             ; Transfer to X register
    
    LDY #$01        ; Load column number
    LDA Array2D,X   ; Load from start of row
    STA $0260,Y     ; Store in output array
    
    ; === CIRCULAR BUFFER ===
    ; Implement circular buffer using indexed addressing
    LDX BufferIndex ; Load current buffer position
    LDA #$99        ; Load data to store
    STA Buffer,X    ; Store in circular buffer
    
    INX             ; Increment position
    CPX #BufferSize ; Check if past end
    BNE NoWrapAround ; Branch if not past end
    LDX #$00        ; Wrap around to start
    
NoWrapAround:
    STX BufferIndex ; Store updated position
    
    RTS

; Data for examples
LookupTable:
    .byte $10, $20, $30, $40, $50, $60, $70, $80
    .byte $90, $A0, $B0, $C0, $D0, $E0, $F0, $FF

TestString:
    .byte
```

## Indirect Addressing - The Power Mode

The 6502 has a special addressing mode that uses zero page as a pointer:

**Format**: `LDA ($10),Y`
**Purpose**: Use zero page locations as 16-bit pointers
**Speed**: Slower (5+ cycles) but very powerful
**Use when**: Dynamic memory access, data structures, complex algorithms

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Indirect Addressing"
  code="; Indirect addressing - using zero page as 16-bit pointers
; This is one of the 6502's most powerful addressing modes

IndirectDemo:
    ; === SETTING UP POINTERS ===
    ; Set up a pointer to sprite data in zero page
    LDA #$00        ; Low byte of $0200
    STA $10         ; Store in zero page $10
    LDA #$02        ; High byte of $0200
    STA $11         ; Store in zero page $11
    
    ; Now $10-$11 points to $0200
    
    ; === INDIRECT STORE OPERATIONS ===
    ; Store data using the pointer
    LDY #$00        ; Initialize offset
    LDA #$50        ; Load Y position
    STA ($10),Y     ; Store to ($0200 + 0) = $0200
    
    INY             ; Increment offset to 1
    LDA #$01        ; Load tile number
    STA ($10),Y     ; Store to ($0200 + 1) = $0201
    
    INY             ; Increment offset to 2
    LDA #$00        ; Load attributes
    STA ($10),Y     ; Store to ($0200 + 2) = $0202
    
    INY             ; Increment offset to 3
    LDA #$60        ; Load X position
    STA ($10),Y     ; Store to ($0200 + 3) = $0203
    
    ; === DYNAMIC POINTER UPDATES ===
    ; Move pointer to next sprite (4 bytes later)
    CLC             ; Clear carry
    LDA $10         ; Load low byte of pointer
    ADC #$04        ; Add 4 bytes
    STA $10         ; Store updated low byte
    BCC NoCarry     ; Branch if no carry
    INC $11         ; Increment high byte if carry
    
NoCarry:
    ; Now pointer points to $0204 (next sprite)
    
    ; === INDIRECT LOAD OPERATIONS ===
    ; Load data using the updated pointer
    LDY #$00        ; Reset offset
    LDA ($10),Y     ; Load from current pointer location
    STA $0300       ; Store loaded value
    
    ; === POINTER ARITHMETIC ===
    ; Set up pointer to a data table
    LDA #<DataTable ; Load low byte of table address
    STA $20         ; Store in zero page $20
    LDA #>DataTable ; Load high byte of table address
    STA $21         ; Store in zero page $21
    
    ; Access table elements using indirect addressing
    LDY #$05        ; Load table index 5
    LDA ($20),Y     ; Load table element 5
    STA $0310       ; Store table value
    
    ; === STRUCTURE MEMBER ACCESS ===
    ; Set up pointer to a player data structure
    LDA #<PlayerData ; Load address of player structure
    STA $30         ; Store low byte in zero page
    LDA #>PlayerData ; Load high byte
    STA $31         ; Store high byte in zero page
    
    ; Access structure members
    LDY #PlayerX    ; Load offset to X position
    LDA ($30),Y     ; Load player X coordinate
    STA $0320       ; Store X coordinate
    
    LDY #PlayerY    ; Load offset to Y position
    LDA ($30),Y     ; Load player Y coordinate
    STA $0321       ; Store Y coordinate
    
    ; === LINKED LIST TRAVERSAL ===
    ; Set up pointer to first node
    LDA #<FirstNode ; Load address of first node
    STA $40         ; Store in zero page pointer
    LDA #>FirstNode ; Load high byte
    STA $41         ; Store high byte
    
    ; Follow the linked list
    LDY #NodeNext   ; Offset to next pointer
    LDA ($40),Y     ; Load low byte of next node
    TAX             ; Save in X
    INY             ; Move to high byte
    LDA ($40),Y     ; Load high byte of next node
    
    ; Update pointer to next node
    STX $40         ; Store new low byte
    STA $41         ; Store new high byte
    
    ; === MEMORY COPY USING POINTERS ===
    ; Set up source pointer
    LDA #<SourceData ; Source address low byte
    STA $50         ; Store in zero page
    LDA #>SourceData ; Source address high byte
    STA $51         ; Store in zero page
    
    ; Set up destination pointer
    LDA #$00        ; Destination low byte ($0600)
    STA $52         ; Store in zero page
    LDA #$06        ; Destination high byte
    STA $53         ; Store in zero page
    
    ; Copy data using indirect addressing
    LDY #$00        ; Initialize offset
CopyLoop:
    LDA ($50),Y     ; Load from source
    STA ($52),Y     ; Store to destination
    INY             ; Increment offset
    CPY #$08        ; Copied 8 bytes?
    BNE CopyLoop    ; Continue if not done
    
    RTS

; Data structures for examples
DataTable:
    .byte $11, $22, $33, $44, $55, $66, $77, $88
    .byte $99, $AA, $BB, $CC, $DD, $EE, $FF, $00

PlayerData:
PlayerX = 0
PlayerY = 1
PlayerSpeed = 2
PlayerTile = 3
    .byte $80, $90, $02, $05  ; X, Y, Speed, Tile

FirstNode:
NodeData = 0
NodeNext = 1
    .byte $42          ; Node data
    .word SecondNode   ; Pointer to next node

SecondNode:
    .byte $84          ; Node data
    .word $0000        ; NULL pointer (end of list)

SourceData:
    .byte $01, $02, $03, $04, $05, $06, $07, $08"
  language="assembly"
/>

## Choosing the Right Addressing Mode

### Performance Comparison
| Mode | Cycles | Bytes | Best For |
|------|--------|-------|----------|
| Immediate | 2 | 2 | Constants |
| Zero Page | 3 | 2 | Variables |
| Absolute | 4 | 3 | Fixed locations |
| Indexed | 4+ | 3 | Arrays, lists |
| Indirect | 5+ | 2 | Dynamic access |

### Decision Guide
```text
Use immediate when: Loading known values
Use zero page when: Frequently accessed variables  
Use absolute when: Specific memory locations
Use indexed when: Processing arrays/tables
Use indirect when: Dynamic memory access needed
```

**Addressing Mode Comparison:**

```assembly
; Comparing different addressing modes for efficiency
; This demonstrates when to use each addressing mode

AddressingComparison:
    ; === IMMEDIATE: LOADING CONSTANTS ===
    ; Best for: Known values, initialization
    LDA #$00        ; Fast: 2 cycles, clear accumulator
    LDX #$10        ; Fast: 2 cycles, loop counter
    LDY #$FF        ; Fast: 2 cycles, maximum value
    
    ; === ZERO PAGE: FREQUENT VARIABLES ===
    ; Best for: Loop counters, temporary storage, pointers
    STA $10         ; Fast: 3 cycles, store counter
    STX $11         ; Fast: 3 cycles, store limit
    STY $12         ; Fast: 3 cycles, store maximum
    
    ; === ABSOLUTE: SPECIFIC LOCATIONS ===
    ; Best for: Fixed memory locations, buffers, I/O
    STA $0200       ; Slower: 4 cycles, but necessary for sprite data
    STX $0300       ; Slower: 4 cycles, but specific buffer location
    
    ; === INDEXED: ARRAY ACCESS ===
    ; Best for: Processing lists, arrays, tables
    LDX #$00        ; Initialize array index
    
ArrayLoop:
    LDA ArrayData,X ; Access array element (4 cycles + crossing page boundary)
    STA $0400,X     ; Store to output array
    INX             ; Increment index
    CPX #$08        ; Check if processed all elements
    BNE ArrayLoop   ; Continue if more elements
    
    ; === PRACTICAL EXAMPLE: SPRITE MANAGEMENT ===
    ; Use appropriate addressing mode for each task
    
    ; Initialize sprite counter (immediate)
    LDA #$04        ; Load number of sprites (fast, constant)
    STA $20         ; Store in zero page (fast access)
    
    ; Set up sprite pointer (immediate + zero page)
    LDA #$00        ; Low byte of sprite data (immediate)
    STA $21         ; Store in zero page pointer (fast)
    LDA #$02        ; High byte ($0200) (immediate)
    STA $22         ; Store in zero page pointer (fast)
    
    ; Process each sprite (indexed + indirect)
    LDX #$00        ; Initialize sprite index
    
SpriteLoop:
    ; Load sprite template (absolute)
    LDA SpriteTemplate ; Load Y position from template (fixed location)
    LDY #$00        ; Offset 0 (Y position)
    STA ($21),Y     ; Store using indirect addressing (flexible)
    
    ; Update template position for next sprite (zero page)
    INC $30         ; Increment Y position (fast, frequently accessed)
    
    ; Move to next sprite position (zero page arithmetic)
    CLC             ; Clear carry
    LDA $21         ; Load pointer low byte (fast)
    ADC #$04        ; Add sprite size (immediate constant)
    STA $21         ; Store updated pointer (fast)
    
    ; Check if done (zero page)
    DEC $20         ; Decrement sprite counter (fast)
    BNE SpriteLoop  ; Continue if more sprites
    
    ; === PERFORMANCE OPTIMIZATION EXAMPLE ===
    ; Optimize frequently executed code
    
    ; BAD: Using absolute addressing for loop counter
    ; LDA $0500       ; Slow: 4 cycles
    ; CLC
    ; ADC #$01        ; Add 1
    ; STA $0500       ; Slow: 4 cycles
    
    ; GOOD: Using zero page for loop counter
    LDA $50         ; Fast: 3 cycles
    CLC
    ADC #$01        ; Add 1 (immediate)
    STA $50         ; Fast: 3 cycles
    
    ; BETTER: Using increment instruction
    INC $50         ; Fastest: 5 cycles total for read-modify-write
    
    RTS

; Data for examples
ArrayData:
    .byte $10, $20, $30, $40, $50, $60, $70, $80

SpriteTemplate:
    .byte $50, $01, $00, $60  ; Y, Tile, Attr, X
```

## Practice Exercise

**Addressing Modes Practice:**

```assembly
; Practice Exercise: Game Entity Manager
; Use different addressing modes appropriately for managing game entities

EntityManagerPractice:
    ; === INITIALIZATION USING IMMEDIATE ADDRESSING ===
    ; Set up constants and initial values
    LDA #$08        ; Maximum entities (constant)
    STA $60         ; Store in zero page (fast access)
    
    LDA #$00        ; Initialize entity counter
    STA $61         ; Store in zero page
    
    ; === ENTITY STRUCTURE SETUP ===
    ; Entity structure: X, Y, Type, Status (4 bytes each)
    ; Use zero page pointer for entity array
    LDA #$00        ; Low byte of entity array ($0300)
    STA $70         ; Store in zero page pointer
    LDA #$03        ; High byte of entity array
    STA $71         ; Store in zero page pointer
    
    ; === CREATE ENTITY FUNCTION ===
    ; Input: A = entity type
    JSR CreateEntity
    
    ; Create several entities
    LDA #$01        ; Enemy type
    JSR CreateEntity
    LDA #$02        ; Powerup type
    JSR CreateEntity
    LDA #$03        ; Bullet type
    JSR CreateEntity
    
    ; === UPDATE ALL ENTITIES ===
    JSR UpdateAllEntities
    
    ; === FIND ENTITY BY TYPE ===
    LDA #$02        ; Look for powerup type
    JSR FindEntityByType
    
    RTS

; Create new entity
; Input: A = entity type
CreateEntity:
    ; Check if room for more entities (zero page access)
    LDX $61         ; Load current entity count (fast)
    CPX $60         ; Compare with maximum (fast)
    BEQ CreateFull  ; Branch if full
    
    ; Calculate entity address using indexed addressing
    TXA             ; Transfer count to A
    ASL A           ; Multiply by 2
    ASL A           ; Multiply by 4 (4 bytes per entity)
    TAY             ; Use as offset
    
    ; Store entity data using indirect indexed addressing
    PHA             ; Save entity type
    LDA #$80        ; Default X position
    STA ($70),Y     ; Store X position
    
    INY             ; Move to Y position
    LDA #$90        ; Default Y position
    STA ($70),Y     ; Store Y position
    
    INY             ; Move to type field
    PLA             ; Restore entity type
    STA ($70),Y     ; Store entity type
    
    INY             ; Move to status field
    LDA #$01        ; Active status
    STA ($70),Y     ; Store status
    
    ; Increment entity count (zero page)
    INC $61         ; Increment count (fast)
    
CreateFull:
    RTS

; Update all entities
UpdateAllEntities:
    LDX #$00        ; Initialize entity index
    
UpdateLoop:
    ; Check if this entity index is valid (zero page)
    CPX $61         ; Compare with entity count (fast)
    BEQ UpdateDone  ; Branch if no more entities
    
    ; Calculate entity address (indexed addressing)
    TXA             ; Get entity index
    ASL A           ; Multiply by 4
    ASL A           ; (4 bytes per entity)
    TAY             ; Use as offset
    
    ; Check entity status (indirect indexed)
    INY             ; Move to type field
    INY             ; Move to status field
    INY             ; Now at status offset
    LDA ($70),Y     ; Load entity status
    BEQ NextEntity  ; Skip if inactive
    
    ; Update entity position based on type
    DEY             ; Back to type field
    LDA ($70),Y     ; Load entity type
    CMP #$01        ; Is it enemy type?
    BEQ UpdateEnemy ; Branch if enemy
    CMP #$02        ; Is it powerup type?
    BEQ UpdatePowerup ; Branch if powerup
    JMP NextEntity  ; Skip unknown types
    
UpdateEnemy:
    ; Move enemy left (absolute indexed would work too)
    DEY             ; Back to Y position
    DEY             ; Back to X position
    LDA ($70),Y     ; Load X position
    SEC             ; Set carry for subtraction
    SBC #$02        ; Move left by 2 pixels
    STA ($70),Y     ; Store updated position
    JMP NextEntity
    
UpdatePowerup:
    ; Rotate powerup (simple animation)
    DEY             ; Back to Y position
    DEY             ; Back to X position
    INY             ; Move to Y position
    LDA ($70),Y     ; Load Y position
    CLC             ; Clear carry
    ADC #$01        ; Move down slowly
    STA ($70),Y     ; Store updated position
    
NextEntity:
    INX             ; Move to next entity
    JMP UpdateLoop  ; Continue loop
    
UpdateDone:
    RTS

; Find entity by type
; Input: A = entity type to find
; Output: X = entity index (or $FF if not found)
FindEntityByType:
    STA $62         ; Store search type in zero page (fast access)
    LDX #$00        ; Initialize search index
    
SearchLoop:
    ; Check if search index is valid (zero page)
    CPX $61         ; Compare with entity count (fast)
    BEQ NotFound    ; Branch if searched all entities
    
    ; Calculate entity address (avoid recalculation)
    TXA             ; Get entity index
    ASL A           ; Multiply by 4
    ASL A           ; (4 bytes per entity)
    CLC             ; Clear carry
    ADC #$02        ; Add offset to type field
    TAY             ; Use as offset
    
    ; Check entity type (indirect indexed)
    LDA ($70),Y     ; Load entity type
    CMP $62         ; Compare with search type (fast zero page)
    BEQ Found       ; Branch if found
    
    INX             ; Move to next entity
    JMP SearchLoop  ; Continue search
    
Found:
    ; X contains the found entity index
    RTS
    
NotFound:
    LDX #$FF        ; Return $FF for not found
    RTS

; Challenge exercises:
; 1. Add entity collision detection using appropriate addressing modes
; 2. Implement entity removal with memory compaction
; 3. Create entity sorting by type or position
; 4. Add entity animation using frame counters
```

## What You've Learned

In this lesson, you've learned:

1. **Addressing Mode Concepts** - Different ways the 6502 can locate data
2. **Immediate Addressing** - Loading constant values efficiently
3. **Zero Page Addressing** - Fast access to frequently used variables
4. **Absolute Addressing** - Accessing specific memory locations
5. **Indexed Addressing** - Powerful array and table processing
6. **Indirect Addressing** - Dynamic memory access using pointers

## Looking Ahead

Next, you'll explore the 6502's status register and flags - the key to making intelligent decisions in your programs. You'll discover how the processor automatically tracks the results of operations!

## Fun Fact

The 6502's addressing modes were carefully designed to be both powerful and efficient. The zero page addressing mode, in particular, was revolutionary - it provided a "fast lane" that made the 6502 competitive with much more expensive processors. The indexed addressing modes made array processing elegant and efficient, while indirect addressing gave programmers the power of pointers. This combination of simplicity and power made the 6502 ideal for everything from the Apple II to the NES, where every cycle counted!