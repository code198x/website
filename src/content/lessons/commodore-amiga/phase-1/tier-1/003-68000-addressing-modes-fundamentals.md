---
title: "68000 Addressing Modes Fundamentals"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 3
description: "Explore the 68000's powerful and flexible addressing modes. Learn how the sophisticated addressing capabilities make complex programming tasks much easier than on 8-bit processors."
learning_objectives:
  - "Understand the 68000's comprehensive addressing mode system"
  - "Learn register direct and immediate addressing"
  - "Practice indirect addressing with address registers"
  - "Explore indexed and displaced addressing modes"
  - "Build programs using advanced addressing techniques"
concepts:
  - "Register direct addressing (data and address registers)"
  - "Immediate addressing with different data sizes"
  - "Indirect addressing: (An), (An)+, -(An)"
  - "Displaced addressing: d(An), d(An,Xn)"
  - "Absolute addressing: short and long forms"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 3
---

# Lesson 3: 68000 Addressing Modes Fundamentals

The 68000's addressing modes are far more sophisticated than those found in 8-bit processors. Today you'll discover how these powerful addressing capabilities make complex programming tasks much easier and more elegant!

## 68000 Addressing Mode Categories

The 68000 offers 14 different addressing modes, organised into several categories:

### Register Direct Modes
- **Data Register Direct**: `D0`, `D1`, etc.
- **Address Register Direct**: `A0`, `A1`, etc.

### Immediate Mode
- **Immediate**: `#value`

### Indirect Modes
- **Address Register Indirect**: `(A0)`
- **Postincrement**: `(A0)+`
- **Predecrement**: `-(A0)`
- **Displaced**: `d(A0)`
- **Indexed**: `d(A0,D1)`

### Absolute Modes
- **Absolute Short**: `$address` (16-bit)
- **Absolute Long**: `$address` (32-bit)

**Basic Addressing Modes:**

```assembly
; Demonstration of fundamental 68000 addressing modes
; Shows the most commonly used addressing techniques

BasicAddressingDemo:
    ; === REGISTER DIRECT ADDRESSING ===
    ; Access data directly in registers
    
    ; Data register direct
    MOVE.L  #$12345678, D0      ; Load immediate to data register
    MOVE.L  D0, D1              ; Copy from one data register to another
    MOVE.B  D0, D2              ; Copy byte portion
    MOVE.W  D0, D3              ; Copy word portion
    
    ; Address register direct
    MOVE.L  #$100000, A0        ; Load address into address register
    MOVE.L  A0, A1              ; Copy address between address registers
    
    ; === IMMEDIATE ADDRESSING ===
    ; Load constant values directly into registers
    
    MOVE.B  #$42, D0            ; Load 8-bit immediate
    MOVE.W  #$1234, D1          ; Load 16-bit immediate
    MOVE.L  #$87654321, D2      ; Load 32-bit immediate
    
    ; Immediate addressing with different instruction types
    ADD.L   #1000, D0           ; Add immediate value
    CMP.W   #$FFFF, D1          ; Compare with immediate
    AND.B   #%11110000, D2      ; Mask with immediate bit pattern
    
    ; === ADDRESS REGISTER INDIRECT ===
    ; Access memory through address registers
    
    MOVE.L  #$200000, A0        ; Set up base address
    
    ; Store data using indirect addressing
    MOVE.B  #$AA, (A0)          ; Store byte at address in A0
    MOVE.W  #$BBCC, (A0)        ; Store word at address in A0
    MOVE.L  #$DDEEFF00, (A0)    ; Store long at address in A0
    
    ; Load data using indirect addressing
    MOVE.B  (A0), D0            ; Load byte from address in A0
    MOVE.W  (A0), D1            ; Load word from address in A0
    MOVE.L  (A0), D2            ; Load long from address in A0
    
    ; === POSTINCREMENT ADDRESSING ===
    ; Automatic address increment after access
    
    MOVE.L  #$300000, A1        ; Set up address
    
    ; Store sequential data with postincrement
    MOVE.B  #$11, (A1)+         ; Store byte, then increment A1 by 1
    MOVE.B  #$22, (A1)+         ; Store byte, then increment A1 by 1
    MOVE.B  #$33, (A1)+         ; Store byte, then increment A1 by 1
    MOVE.B  #$44, (A1)+         ; Store byte, then increment A1 by 1
    ; A1 now points to $300004
    
    ; Store words with postincrement
    MOVE.L  #$310000, A2        ; Reset address
    MOVE.W  #$AABB, (A2)+       ; Store word, increment A2 by 2
    MOVE.W  #$CCDD, (A2)+       ; Store word, increment A2 by 2
    MOVE.W  #$EEFF, (A2)+       ; Store word, increment A2 by 2
    ; A2 now points to $310006
    
    ; Store longs with postincrement
    MOVE.L  #$320000, A3        ; Reset address
    MOVE.L  #$12345678, (A3)+   ; Store long, increment A3 by 4
    MOVE.L  #$9ABCDEF0, (A3)+   ; Store long, increment A3 by 4
    ; A3 now points to $320008
    
    ; === PREDECREMENT ADDRESSING ===
    ; Automatic address decrement before access
    
    MOVE.L  #$400010, A4        ; Set up address (pointing past end)
    
    ; Store data with predecrement (building stack)
    MOVE.L  #$AAAA, -(A4)       ; Decrement A4 by 4, then store long
    MOVE.L  #$BBBB, -(A4)       ; Decrement A4 by 4, then store long
    MOVE.L  #$CCCC, -(A4)       ; Decrement A4 by 4, then store long
    MOVE.L  #$DDDD, -(A4)       ; Decrement A4 by 4, then store long
    ; A4 now points to $400000, memory contains stack data
    
    ; Read back using postincrement (pop from stack)
    MOVE.L  (A4)+, D0           ; Load and increment (gets $DDDD)
    MOVE.L  (A4)+, D1           ; Load and increment (gets $CCCC)
    MOVE.L  (A4)+, D2           ; Load and increment (gets $BBBB)
    MOVE.L  (A4)+, D3           ; Load and increment (gets $AAAA)
    
    ; === DISPLACED ADDRESSING ===
    ; Access memory with fixed offset from address register
    
    MOVE.L  #$500000, A5        ; Base address
    
    ; Store data at various offsets
    MOVE.B  #$10, 0(A5)         ; Store at base + 0
    MOVE.B  #$20, 1(A5)         ; Store at base + 1
    MOVE.B  #$30, 2(A5)         ; Store at base + 2
    MOVE.B  #$40, 3(A5)         ; Store at base + 3
    
    ; Store words at even offsets
    MOVE.W  #$5555, 4(A5)       ; Store at base + 4
    MOVE.W  #$6666, 6(A5)       ; Store at base + 6
    MOVE.W  #$7777, 8(A5)       ; Store at base + 8
    
    ; Store longs at long-aligned offsets
    MOVE.L  #$88888888, 12(A5)  ; Store at base + 12
    MOVE.L  #$99999999, 16(A5)  ; Store at base + 16
    
    ; Read back data using displacements
    MOVE.B  1(A5), D0           ; Load from base + 1
    MOVE.W  6(A5), D1           ; Load from base + 6
    MOVE.L  16(A5), D2          ; Load from base + 16
    
    ; === PRACTICAL EXAMPLE: ARRAY ACCESS ===
    ; Use addressing modes to process arrays efficiently
    
    MOVE.L  #ByteArray, A6      ; Address of byte array
    MOVE.L  #7, D7              ; Counter for 8 elements
    
ProcessByteArray:
    MOVE.B  (A6), D0            ; Load current array element
    ADD.B   #10, D0             ; Add 10 to each element
    MOVE.B  D0, (A6)+           ; Store back and advance pointer
    DBRA    D7, ProcessByteArray ; Continue for all elements
    
    ; === PRACTICAL EXAMPLE: STRUCTURE ACCESS ===
    ; Access members of a data structure
    
    MOVE.L  #PlayerData, A6     ; Address of player structure
    
    ; Initialize structure using displaced addressing
    MOVE.W  #100, PLAYER_X(A6)      ; Set X coordinate
    MOVE.W  #200, PLAYER_Y(A6)      ; Set Y coordinate
    MOVE.W  #255, PLAYER_HEALTH(A6) ; Set health
    MOVE.W  #500, PLAYER_SCORE(A6)  ; Set score
    MOVE.B  #1, PLAYER_ACTIVE(A6)   ; Set active flag
    
    ; Read structure members
    MOVE.W  PLAYER_X(A6), D0        ; Get X coordinate
    MOVE.W  PLAYER_Y(A6), D1        ; Get Y coordinate
    MOVE.W  PLAYER_HEALTH(A6), D2   ; Get health
    
    ; Modify structure member
    ADD.W   #50, PLAYER_SCORE(A6)   ; Add to score
    SUB.W   #1, PLAYER_HEALTH(A6)   ; Subtract from health
    
    RTS

; Data areas for examples
ByteArray:      DC.B    1,2,3,4,5,6,7,8

; Structure offsets
PLAYER_X        EQU     0       ; X coordinate (word)
PLAYER_Y        EQU     2       ; Y coordinate (word)
PLAYER_HEALTH   EQU     4       ; Health points (word)
PLAYER_SCORE    EQU     6       ; Score (word)
PLAYER_ACTIVE   EQU     8       ; Active flag (byte)

; Player data structure
PlayerData:
    DC.W    0       ; X coordinate
    DC.W    0       ; Y coordinate
    DC.W    0       ; Health
    DC.W    0       ; Score
    DC.B    0       ; Active flag
    DC.B    0       ; Padding
```

## Advanced Addressing Modes

The 68000 offers even more sophisticated addressing modes for complex programming tasks:

### Indexed Addressing
Combines base address with index register:
- **Format**: `displacement(An,Xn.size)`
- **Example**: `4(A0,D1.W)` - base + displacement + index

### Absolute Addressing
Direct memory addressing:
- **Absolute Short**: `$address` (16-bit, -32K to +32K)
- **Absolute Long**: `$address` (32-bit, full address space)

### Program Counter Relative
Position-independent addressing:
- **PC Displaced**: `label(PC)`
- **PC Indexed**: `label(PC,Xn)`

**Advanced Addressing Modes:**

```assembly
; Demonstration of advanced 68000 addressing modes
; Shows sophisticated addressing techniques

AdvancedAddressingDemo:
    ; === INDEXED ADDRESSING ===
    ; Combine base address with index register
    
    MOVE.L  #$600000, A0        ; Base address
    MOVE.L  #8, D0              ; Index value
    
    ; Store using indexed addressing
    MOVE.B  #$AA, 0(A0,D0.L)    ; Store at base + index
    MOVE.B  #$BB, 1(A0,D0.L)    ; Store at base + index + 1
    MOVE.B  #$CC, 2(A0,D0.L)    ; Store at base + index + 2
    
    ; Use different index registers and sizes
    MOVE.W  #16, D1             ; Word index
    MOVE.L  #$DDDD, 0(A0,D1.W)  ; Store using word index
    
    MOVE.L  #24, D2             ; Long index
    MOVE.L  #$EEEEEEEE, 0(A0,D2.L) ; Store using long index
    
    ; === SCALED INDEXED ADDRESSING ===
    ; Index can be scaled by 1, 2, 4, or 8
    
    MOVE.L  #$700000, A1        ; Array base address
    MOVE.L  #3, D3              ; Array index (element 3)
    
    ; Access array of bytes (scale by 1)
    MOVE.B  #$11, 0(A1,D3.L*1)  ; Store byte at element 3
    
    ; Access array of words (scale by 2)
    MOVE.W  #$2222, 0(A1,D3.L*2) ; Store word at element 3 * 2
    
    ; Access array of longs (scale by 4)
    MOVE.L  #$33333333, 0(A1,D3.L*4) ; Store long at element 3 * 4
    
    ; Access array of double-longs (scale by 8)
    MOVE.L  #$44444444, 0(A1,D3.L*8) ; Store at element 3 * 8
    MOVE.L  #$55555555, 4(A1,D3.L*8) ; Store second half
    
    ; === MULTI-DIMENSIONAL ARRAY ACCESS ===
    ; Access 2D array using complex addressing
    
    MOVE.L  #Array2D, A2        ; 2D array base (8x8 bytes)
    MOVE.L  #3, D4              ; Row index
    MOVE.L  #5, D5              ; Column index
    
    ; Calculate address: base + (row * 8) + column
    MOVE.B  #$99, 0(A2,D4.L*8,D5.L) ; This syntax not supported
    ; Alternative calculation:
    MOVE.L  D4, D6              ; Copy row
    LSL.L   #3, D6              ; Multiply row by 8 (shift left 3)
    ADD.L   D5, D6              ; Add column
    MOVE.B  #$99, 0(A2,D6.L)    ; Store at calculated position
    
    ; === ABSOLUTE ADDRESSING ===
    ; Direct memory addressing
    
    ; Absolute short (16-bit address, faster)
    MOVE.W  #$1234, $8000       ; Store to address $8000
    MOVE.W  $8000, D0           ; Load from address $8000
    
    ; Absolute long (32-bit address, full range)
    MOVE.L  #$12345678, $100000.L ; Store to long address
    MOVE.L  $100000.L, D1       ; Load from long address
    
    ; === PROGRAM COUNTER RELATIVE ===
    ; Position-independent code
    
    ; Load address relative to current PC
    LEA     DataTable(PC), A3   ; Load effective address of DataTable
    MOVE.B  (A3), D0            ; Load first byte of table
    
    ; Access table with PC-relative addressing
    MOVE.B  DataTable(PC), D1   ; Load directly with PC-relative
    MOVE.B  DataTable+1(PC), D2 ; Load second byte
    MOVE.B  DataTable+2(PC), D3 ; Load third byte
    
    ; PC-relative with index
    MOVE.L  #4, D7              ; Table index
    MOVE.B  DataTable(PC,D7.L), D4 ; Load table[4] with PC-relative
    
    ; === STRING PROCESSING EXAMPLE ===
    ; Process null-terminated string using postincrement
    
    MOVE.L  #TestString, A4     ; String address
    MOVE.L  #0, D6              ; Character counter
    
StringProcessLoop:
    MOVE.B  (A4)+, D0           ; Load character and advance pointer
    BEQ     StringProcessDone   ; Branch if null terminator
    
    ; Convert lowercase to uppercase
    CMP.B   #'a', D0            ; Compare with 'a'
    BLT     NotLowercase        ; Branch if less than 'a'
    CMP.B   #'z', D0            ; Compare with 'z'
    BGT     NotLowercase        ; Branch if greater than 'z'
    SUB.B   #32, D0             ; Convert to uppercase
    MOVE.B  D0, -1(A4)          ; Store back (A4 was incremented)
    
NotLowercase:
    ADDQ.L  #1, D6              ; Increment character count
    BRA     StringProcessLoop   ; Continue processing
    
StringProcessDone:
    ; D6 now contains string length
    MOVE.L  D6, StringLength    ; Store length
    
    ; === BLOCK COPY EXAMPLE ===
    ; Copy block of memory using optimal addressing
    
    MOVE.L  #SourceBlock, A5    ; Source address
    MOVE.L  #DestBlock, A6      ; Destination address
    MOVE.L  #31, D7             ; Counter (32 longs = 128 bytes)
    
BlockCopyLoop:
    MOVE.L  (A5)+, (A6)+        ; Copy long and advance both pointers
    DBRA    D7, BlockCopyLoop   ; Continue until done
    
    ; === LOOKUP TABLE EXAMPLE ===
    ; Use table lookup with indexed addressing
    
    MOVE.B  #12, D0             ; Input value (0-15)
    AND.L   #$0F, D0            ; Mask to valid range
    
    ; Look up square value
    MOVE.B  SquareTable(PC,D0.L), D1 ; Get square from table
    
    ; Look up sine value with scaling
    MOVE.L  #0, D2              ; Clear upper bits
    MOVE.B  SineTable(PC,D0.L), D2   ; Get sine value
    LSL.W   #8, D2              ; Scale up sine value
    
    ; === STRUCTURE ARRAY EXAMPLE ===
    ; Access array of structures
    
    MOVE.L  #2, D0              ; Structure index (structure 2)
    MOVE.L  D0, D1              ; Copy index
    LSL.L   #4, D1              ; Multiply by 16 (structure size)
    
    MOVE.L  #StructArray, A0    ; Structure array base
    
    ; Access structure members using displacement + index
    MOVE.W  #100, STRUCT_X(A0,D1.L)     ; Set X of structure 2
    MOVE.W  #200, STRUCT_Y(A0,D1.L)     ; Set Y of structure 2
    MOVE.W  #50, STRUCT_HEALTH(A0,D1.L) ; Set health of structure 2
    
    ; Read back values
    MOVE.W  STRUCT_X(A0,D1.L), D2       ; Get X
    MOVE.W  STRUCT_Y(A0,D1.L), D3       ; Get Y
    MOVE.W  STRUCT_HEALTH(A0,D1.L), D4  ; Get health
    
    RTS

; Data areas
DataTable:      DC.B    10,20,30,40,50,60,70,80
TestString:     DC.B    'Hello World',0
StringLength:   DC.L    0

; 2D Array (8x8 = 64 bytes)
Array2D:        DS.B    64

; Source and destination blocks
SourceBlock:    DC.L    $11111111,$22222222,$33333333,$44444444
                DC.L    $55555555,$66666666,$77777777,$88888888
                ; ... 24 more longs would go here
DestBlock:      DS.L    32      ; Reserve space for 32 longs

; Lookup tables
SquareTable:    DC.B    0,1,4,9,16,25,36,49,64,81,100,121,144,169,196,225
SineTable:      DC.B    128,177,218,245,255,245,218,177,128,79,38,11,1,11,38,79

; Structure definitions
STRUCT_X        EQU     0       ; X coordinate (word)
STRUCT_Y        EQU     2       ; Y coordinate (word)
STRUCT_HEALTH   EQU     4       ; Health (word)
STRUCT_FLAGS    EQU     6       ; Flags (word)
STRUCT_SIZE     EQU     16      ; Total size (with padding)

; Array of structures
StructArray:
    DS.B    STRUCT_SIZE*8       ; 8 structures
```

## Memory Access Efficiency

The 68000's addressing modes are designed for maximum efficiency:

### Performance Considerations
1. **Register Direct**: Fastest (no memory access)
2. **Immediate**: Fast (data in instruction stream)
3. **Address Register Indirect**: Fast (single memory access)
4. **Displaced**: Slightly slower (address calculation)
5. **Indexed**: Slower (more complex calculation)
6. **Absolute**: Varies by distance from PC

### Best Practices
- Use address registers for pointers
- Prefer postincrement for sequential access
- Use displacement for structure members
- Choose indexed for arrays and tables

<CodeRunner 
  system="commodore-amiga"
  title="Addressing Mode Efficiency Examples"
  code="; Demonstration of efficient addressing mode usage
; Shows optimal patterns for common programming tasks

EfficiencyDemo:
    ; === EFFICIENT SEQUENTIAL PROCESSING ===
    ; Use postincrement for best performance
    
    MOVE.L  #SourceData, A0     ; Source pointer
    MOVE.L  #ProcessedData, A1  ; Destination pointer
    MOVE.L  #255, D7            ; Process 256 bytes
    
FastSequentialLoop:
    MOVE.B  (A0)+, D0           ; Load and advance (fastest)
    ADD.B   #1, D0              ; Process data
    MOVE.B  D0, (A1)+           ; Store and advance (fastest)
    DBRA    D7, FastSequentialLoop
    
    ; === EFFICIENT STRUCTURE PROCESSING ===
    ; Use base register + displacement
    
    MOVE.L  #PlayerArray, A2    ; Array of player structures
    MOVE.L  #3, D6              ; Process 4 players
    
PlayerProcessLoop:
    ; Process each player structure efficiently
    MOVE.W  PLAYER_X(A2), D0        ; Load X (displaced addressing)
    MOVE.W  PLAYER_Y(A2), D1        ; Load Y (displaced addressing)
    
    ; Update position
    ADDQ.W  #1, D0                  ; Move right
    ADDQ.W  #1, D1                  ; Move down
    
    ; Store back efficiently
    MOVE.W  D0, PLAYER_X(A2)        ; Store X (displaced addressing)
    MOVE.W  D1, PLAYER_Y(A2)        ; Store Y (displaced addressing)
    
    ; Advance to next structure
    LEA     PLAYER_STRUCT_SIZE(A2), A2 ; Advance pointer efficiently
    DBRA    D6, PlayerProcessLoop
    
    ; === EFFICIENT ARRAY ACCESS ===
    ; Use scaled indexing for typed arrays
    
    MOVE.L  #WordArray, A3      ; Word array base
    MOVE.L  #7, D5              ; Process 8 elements
    
WordArrayLoop:
    ; Access array element efficiently
    MOVE.W  0(A3,D5.L*2), D0    ; Load word[index] (scaled index)
    MULU.W  #2, D0              ; Double the value
    MOVE.W  D0, 0(A3,D5.L*2)    ; Store back
    DBRA    D5, WordArrayLoop
    
    ; === EFFICIENT TABLE LOOKUP ===
    ; Use PC-relative for position independence
    
    MOVE.B  InputValue, D0      ; Get input value
    AND.L   #$1F, D0            ; Mask to table size (32 entries)
    
    ; Efficient table lookup
    MOVE.B  LookupTable(PC,D0.L), D1 ; PC-relative lookup
    
    ; Use result in calculation
    MULU.W  #3, D1              ; Scale lookup result
    MOVE.W  D1, ComputedValue   ; Store result
    
    ; === EFFICIENT STRING OPERATIONS ===
    ; Optimized string length calculation
    
    MOVE.L  #TestString2, A4    ; String address
    MOVE.L  A4, A5              ; Save start address
    
FindStringEnd:
    TST.B   (A4)+               ; Test byte and advance
    BNE     FindStringEnd       ; Continue if not null
    
    ; Calculate length efficiently
    SUBA.L  A5, A4              ; Subtract start from end
    SUBQ.L  #1, A4              ; Adjust for null terminator
    MOVE.L  A4, StringLength2   ; Store length
    
    ; === EFFICIENT MEMORY CLEARING ===
    ; Use optimal instruction for clearing
    
    MOVE.L  #ClearBuffer, A6    ; Buffer to clear
    MOVE.L  #63, D7             ; Clear 64 longs (256 bytes)
    
FastClearLoop:
    CLR.L   (A6)+               ; Clear long and advance
    DBRA    D7, FastClearLoop   ; Continue until done
    
    ; === EFFICIENT BOUNDS CHECKING ===
    ; Check array bounds efficiently
    
    MOVE.L  ArrayIndex, D0      ; Get array index
    CMP.L   #ARRAY_SIZE, D0     ; Check upper bound
    BCC     IndexOutOfBounds    ; Branch if >= size
    
    ; Access array element safely
    MOVE.L  #SafeArray, A0      ; Array base
    MOVE.L  0(A0,D0.L*4), D1    ; Load array[index] (long array)
    ADD.L   #100, D1            ; Process data
    MOVE.L  D1, 0(A0,D0.L*4)    ; Store back
    BRA     BoundsCheckDone
    
IndexOutOfBounds:
    ; Handle error
    MOVE.L  #-1, D1             ; Error indicator
    
BoundsCheckDone:
    
    ; === EFFICIENT LINKED LIST TRAVERSAL ===
    ; Walk through linked list efficiently
    
    MOVE.L  #ListHead, A0       ; Start of list
    MOVE.L  #0, D6              ; Node counter
    
ListTraverseLoop:
    MOVE.L  (A0), A0            ; Load next pointer (first field)
    BEQ     ListTraverseDone    ; Branch if null (end of list)
    
    ; Process node data
    MOVE.L  NODE_DATA(A0), D0   ; Load node data
    ADD.L   #1, D0              ; Process data
    MOVE.L  D0, NODE_DATA(A0)   ; Store back
    
    ADDQ.L  #1, D6              ; Increment node count
    BRA     ListTraverseLoop    ; Continue traversal
    
ListTraverseDone:
    MOVE.L  D6, NodeCount       ; Store final count
    
    RTS

; Data definitions
SourceData:         DS.B    256
ProcessedData:      DS.B    256

PLAYER_STRUCT_SIZE  EQU     16
PlayerArray:        DS.B    PLAYER_STRUCT_SIZE*4

WordArray:          DC.W    10,20,30,40,50,60,70,80
InputValue:         DC.B    15
ComputedValue:      DC.W    0

TestString2:        DC.B    'Efficiency Test',0
StringLength2:      DC.L    0

ClearBuffer:        DS.B    256

ARRAY_SIZE          EQU     32
ArrayIndex:         DC.L    15
SafeArray:          DS.L    ARRAY_SIZE

; Lookup table
LookupTable:        DC.B    0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30
                    DC.B    32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62

; Linked list node structure
NODE_DATA           EQU     4       ; Data field offset
ListHead:           DC.L    Node1   ; Pointer to first node

Node1:
    DC.L    Node2           ; Next pointer
    DC.L    100             ; Data

Node2:
    DC.L    Node3           ; Next pointer
    DC.L    200             ; Data

Node3:
    DC.L    0               ; Null pointer (end of list)
    DC.L    300             ; Data

NodeCount:          DC.L    0"
  language="assembly"
/>

## Practice Exercise

**Addressing Modes Practice:**

```assembly
; Practice Exercise: Amiga Sprite Management System
; Use various addressing modes to manage sprite data efficiently

SpriteManagementSystem:
    ; Initialize sprite system
    JSR     InitializeSpriteSystem
    
    ; Update all sprites
    JSR     UpdateAllSprites
    
    ; Sort sprites by priority
    JSR     SortSpritesByPriority
    
    ; Render sprites to display list
    JSR     RenderSpritesToDisplayList
    
    RTS

InitializeSpriteSystem:
    ; Clear all sprite data using efficient addressing
    MOVE.L  #SpritePool, A0     ; Sprite pool base address
    MOVE.L  #(MAX_SPRITES*SPRITE_SIZE)/4-1, D7 ; Long count
    
ClearSpritePool:
    CLR.L   (A0)+               ; Clear long and advance
    DBRA    D7, ClearSpritePool ; Continue for entire pool
    
    ; Initialize free sprite list
    MOVE.L  #SpritePool, A0     ; Pool base
    MOVE.L  #MAX_SPRITES-1, D7  ; Sprite counter
    MOVE.L  #0, D6              ; Current sprite index
    
InitFreeList:
    ; Calculate sprite address
    MOVE.L  D6, D0              ; Current index
    MULU.W  #SPRITE_SIZE, D0    ; Multiply by sprite size
    LEA     0(A0,D0.L), A1      ; Calculate sprite address
    
    ; Link this sprite to next in free list
    ADDQ.L  #1, D6              ; Next sprite index
    CMP.L   #MAX_SPRITES, D6    ; Check if last sprite
    BEQ     LastFreeSprite      ; Branch if last
    
    ; Link to next sprite
    MOVE.L  D6, D0              ; Next index
    MULU.W  #SPRITE_SIZE, D0    ; Calculate offset
    LEA     0(A0,D0.L), A2      ; Calculate next sprite address
    MOVE.L  A2, SPRITE_NEXT(A1) ; Link to next
    BRA     ContinueFreeList
    
LastFreeSprite:
    CLR.L   SPRITE_NEXT(A1)     ; Null terminate list
    
ContinueFreeList:
    DBRA    D7, InitFreeList    ; Continue for all sprites
    
    ; Set up free list head
    MOVE.L  #SpritePool, FreeListHead
    
    ; Initialize active sprite list
    CLR.L   ActiveListHead      ; No active sprites initially
    CLR.L   SpriteCount         ; Zero active sprites
    
    RTS

UpdateAllSprites:
    ; Update all active sprites using linked list traversal
    MOVE.L  ActiveListHead, A0  ; Get first active sprite
    
UpdateSpriteLoop:
    TST.L   A0                  ; Check if null pointer
    BEQ     UpdateSpriteDone    ; Branch if end of list
    
    ; Update sprite position using structure addressing
    MOVE.W  SPRITE_X(A0), D0    ; Load X position
    MOVE.W  SPRITE_Y(A0), D1    ; Load Y position
    MOVE.W  SPRITE_VEL_X(A0), D2 ; Load X velocity
    MOVE.W  SPRITE_VEL_Y(A0), D3 ; Load Y velocity
    
    ; Apply velocity to position
    ADD.W   D2, D0              ; X += VelX
    ADD.W   D3, D1              ; Y += VelY
    
    ; Check screen boundaries
    TST.W   D0                  ; Check left boundary
    BPL     CheckRightBound     ; Branch if positive
    NEG.W   D2                  ; Reverse X velocity
    MOVE.W  #0, D0              ; Clamp to left edge
    
CheckRightBound:
    CMP.W   #320, D0            ; Check right boundary
    BLT     CheckTopBound       ; Branch if within bounds
    NEG.W   D2                  ; Reverse X velocity
    MOVE.W  #319, D0            ; Clamp to right edge
    
CheckTopBound:
    TST.W   D1                  ; Check top boundary
    BPL     CheckBottomBound    ; Branch if positive
    NEG.W   D3                  ; Reverse Y velocity
    MOVE.W  #0, D1              ; Clamp to top edge
    
CheckBottomBound:
    CMP.W   #256, D1            ; Check bottom boundary
    BLT     UpdateSpriteData    ; Branch if within bounds
    NEG.W   D3                  ; Reverse Y velocity
    MOVE.W  #255, D1            ; Clamp to bottom edge
    
UpdateSpriteData:
    ; Store updated position and velocity
    MOVE.W  D0, SPRITE_X(A0)    ; Store new X
    MOVE.W  D1, SPRITE_Y(A0)    ; Store new Y
    MOVE.W  D2, SPRITE_VEL_X(A0) ; Store new X velocity
    MOVE.W  D3, SPRITE_VEL_Y(A0) ; Store new Y velocity
    
    ; Move to next sprite in list
    MOVE.L  SPRITE_NEXT(A0), A0 ; Get next sprite pointer
    BRA     UpdateSpriteLoop    ; Continue with next sprite
    
UpdateSpriteDone:
    RTS

SortSpritesByPriority:
    ; Simple bubble sort using sprite priority
    ; This demonstrates complex pointer manipulation
    
    MOVE.L  SpriteCount, D7     ; Get number of sprites
    SUBQ.L  #1, D7              ; Adjust for loop
    BLE     SortDone            ; Skip if 0 or 1 sprites
    
SortOuterLoop:
    MOVE.L  #0, D6              ; Swap flag
    MOVE.L  ActiveListHead, A0  ; Start of list
    MOVE.L  A0, A1              ; Previous pointer
    
SortInnerLoop:
    MOVE.L  SPRITE_NEXT(A0), A2 ; Get next sprite
    TST.L   A2                  ; Check if end of list
    BEQ     SortInnerDone       ; Branch if end
    
    ; Compare priorities
    MOVE.W  SPRITE_PRIORITY(A0), D0 ; Current sprite priority
    MOVE.W  SPRITE_PRIORITY(A2), D1 ; Next sprite priority
    CMP.W   D1, D0              ; Compare priorities
    BLE     NoSwapNeeded        ; Branch if in order
    
    ; Swap sprites in list
    MOVE.L  SPRITE_NEXT(A2), SPRITE_NEXT(A0) ; A0.next = A2.next
    MOVE.L  A0, SPRITE_NEXT(A2) ; A2.next = A0
    
    ; Update previous link
    CMP.L   ActiveListHead, A0  ; Check if swapping head
    BNE     UpdatePrevLink      ; Branch if not head
    MOVE.L  A2, ActiveListHead  ; Update head pointer
    BRA     SwapComplete
    
UpdatePrevLink:
    MOVE.L  A2, SPRITE_NEXT(A1) ; Previous.next = A2
    
SwapComplete:
    MOVE.L  A2, A0              ; A0 = A2 (swapped)
    MOVE.L  #1, D6              ; Set swap flag
    
NoSwapNeeded:
    MOVE.L  A0, A1              ; Update previous
    MOVE.L  SPRITE_NEXT(A0), A0 ; Move to next
    BRA     SortInnerLoop       ; Continue inner loop
    
SortInnerDone:
    TST.L   D6                  ; Check swap flag
    BNE     SortOuterLoop       ; Continue if swaps occurred
    
SortDone:
    RTS

RenderSpritesToDisplayList:
    ; Build hardware display list from sprite data
    MOVE.L  #DisplayList, A1    ; Display list base
    MOVE.L  ActiveListHead, A0  ; First active sprite
    MOVE.L  #0, D6              ; Display list entry count
    
RenderLoop:
    TST.L   A0                  ; Check if null pointer
    BEQ     RenderDone          ; Branch if end of list
    
    ; Check if sprite is visible
    MOVE.W  SPRITE_FLAGS(A0), D0 ; Load sprite flags
    BTST    #SPRITE_VISIBLE_BIT, D0 ; Test visible bit
    BEQ     NextRenderSprite    ; Skip if not visible
    
    ; Convert sprite data to display list format
    ; Using indexed addressing for display list entries
    MOVE.L  D6, D7              ; Display entry index
    MULU.W  #DISPLAY_ENTRY_SIZE, D7 ; Calculate offset
    
    ; Build display list entry
    MOVE.W  SPRITE_X(A0), DISPLAY_X(A1,D7.L)
    MOVE.W  SPRITE_Y(A0), DISPLAY_Y(A1,D7.L)
    MOVE.W  SPRITE_PATTERN(A0), DISPLAY_PATTERN(A1,D7.L)
    MOVE.W  SPRITE_PALETTE(A0), DISPLAY_PALETTE(A1,D7.L)
    
    ADDQ.L  #1, D6              ; Increment entry count
    
NextRenderSprite:
    MOVE.L  SPRITE_NEXT(A0), A0 ; Move to next sprite
    BRA     RenderLoop          ; Continue rendering
    
RenderDone:
    MOVE.L  D6, DisplayListCount ; Store entry count
    RTS

; Sprite structure offsets
SPRITE_NEXT         EQU     0       ; Next sprite pointer (long)
SPRITE_X            EQU     4       ; X position (word)
SPRITE_Y            EQU     6       ; Y position (word)
SPRITE_VEL_X        EQU     8       ; X velocity (word)
SPRITE_VEL_Y        EQU     10      ; Y velocity (word)
SPRITE_PATTERN      EQU     12      ; Pattern number (word)
SPRITE_PALETTE      EQU     14      ; Palette number (word)
SPRITE_PRIORITY     EQU     16      ; Priority (word)
SPRITE_FLAGS        EQU     18      ; Flags (word)
SPRITE_SIZE         EQU     20      ; Total structure size

; Display list entry offsets
DISPLAY_X           EQU     0       ; X position (word)
DISPLAY_Y           EQU     2       ; Y position (word)
DISPLAY_PATTERN     EQU     4       ; Pattern (word)
DISPLAY_PALETTE     EQU     6       ; Palette (word)
DISPLAY_ENTRY_SIZE  EQU     8       ; Entry size

; Constants
MAX_SPRITES         EQU     64
SPRITE_VISIBLE_BIT  EQU     0

; Data areas
SpritePool:         DS.B    MAX_SPRITES*SPRITE_SIZE
FreeListHead:       DC.L    0
ActiveListHead:     DC.L    0
SpriteCount:        DC.L    0

DisplayList:        DS.B    MAX_SPRITES*DISPLAY_ENTRY_SIZE
DisplayListCount:   DC.L    0

; Challenge exercises:
; 1. Add sprite allocation/deallocation functions
; 2. Implement collision detection between sprites
; 3. Add sprite animation frame cycling
; 4. Create sprite grouping/hierarchy system
```

## What You've Learned

In this lesson, you've discovered:

1. **Comprehensive Addressing Modes** - The 68000's rich set of addressing options
2. **Register Indirect Modes** - Flexible pointer-based memory access
3. **Automatic Increment/Decrement** - Efficient sequential data processing
4. **Displaced and Indexed Addressing** - Powerful structure and array access
5. **Performance Considerations** - Choosing optimal addressing modes for efficiency

## Looking Ahead

Next, you'll learn about the 68000's status register and condition codes - how the processor tracks operation results and enables sophisticated program flow control. You'll discover how the 68000's condition system is much more comprehensive than 8-bit processors!

## Fun Fact

The 68000's addressing modes were revolutionary in their sophistication and orthogonality. Unlike many processors where certain addressing modes only worked with specific instructions, the 68000 allowed almost any addressing mode with almost any instruction. This "orthogonal" design meant that once you learned an addressing mode, you could use it everywhere. The automatic increment and decrement modes were particularly innovative, making tasks like string processing and array manipulation incredibly efficient. Many of these addressing concepts influenced later processor designs, including the x86 architecture that powers modern PCs. The 68000's addressing modes were so well-designed that they remained essentially unchanged throughout the entire 68000 family, from the original 68000 through the 68060!