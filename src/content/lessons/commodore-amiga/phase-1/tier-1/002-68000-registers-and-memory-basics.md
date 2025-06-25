---
title: "68000 Registers and Memory Basics"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 2
description: "Learn the 68000 processor's powerful register set and memory organization. Discover how the Amiga's 68000 handles data with 16-bit and 32-bit capabilities."
learning_objectives:
  - "Understand the 68000's comprehensive register architecture"
  - "Learn about data registers (D0-D7) and address registers (A0-A7)"
  - "Practice basic data movement instructions (MOVE)"
  - "Explore 68000 data sizes (byte, word, long)"
  - "Build foundation programs using registers and memory"
concepts:
  - "68000 register set: data registers and address registers"
  - "MOVE instruction for data transfer"
  - "Data sizes: .B (byte), .W (word), .L (long)"
  - "Immediate, register, and memory addressing"
  - "68000 memory organization and byte ordering"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 2
---

# Lesson 2: 68000 Registers and Memory Basics

Welcome to 68000 assembly programming! The Motorola 68000 processor that powers the Amiga is dramatically more powerful than 8-bit processors, offering 16-bit and 32-bit operations with a rich register set. Today you'll learn how to work with this sophisticated processor architecture.

## The 68000 Register Set

The 68000 has a much more comprehensive register set than 8-bit processors:

### Data Registers (D0-D7)
- **8 registers**: D0, D1, D2, D3, D4, D5, D6, D7
- **32-bit wide**: Can handle byte (.B), word (.W), or long (.L) data
- **General purpose**: Used for arithmetic, logic, and data manipulation

### Address Registers (A0-A7)
- **8 registers**: A0, A1, A2, A3, A4, A5, A6, A7
- **32-bit wide**: Designed for memory addressing
- **A7 is special**: Used as the stack pointer (SP)

### Special Registers
- **Program Counter (PC)**: Points to the next instruction
- **Status Register (SR)**: Contains condition codes and system flags

**68000 Register Basics:**

```assembly
; 68000 Register Demonstration
; Shows basic register usage and data movement

RegisterDemo:
    ; === DATA REGISTER OPERATIONS ===
    ; Load immediate values into data registers
    MOVE.L  #$12345678, D0      ; Load 32-bit value into D0
    MOVE.W  #$ABCD, D1          ; Load 16-bit value into D1
    MOVE.B  #$EF, D2            ; Load 8-bit value into D2
    
    ; Move data between registers
    MOVE.L  D0, D3              ; Copy D0 to D3 (32-bit)
    MOVE.W  D1, D4              ; Copy D1 to D4 (16-bit)
    MOVE.B  D2, D5              ; Copy D2 to D5 (8-bit)
    
    ; === ADDRESS REGISTER OPERATIONS ===
    ; Load addresses into address registers
    MOVE.L  #$00100000, A0      ; Load memory address into A0
    MOVE.L  #$00200000, A1      ; Load another address into A1
    
    ; Copy between address registers
    MOVE.L  A0, A2              ; Copy address from A0 to A2
    
    ; === DIFFERENT DATA SIZES ===
    ; Demonstrate byte, word, and long operations
    
    ; Byte operations (8-bit)
    MOVE.B  #$FF, D0            ; Load byte value
    MOVE.B  D0, $100000         ; Store byte to memory
    
    ; Word operations (16-bit)
    MOVE.W  #$1234, D1          ; Load word value
    MOVE.W  D1, $100002         ; Store word to memory
    
    ; Long operations (32-bit)
    MOVE.L  #$87654321, D2      ; Load long value
    MOVE.L  D2, $100004         ; Store long to memory
    
    ; === MEMORY TO REGISTER TRANSFERS ===
    ; Load values from memory into registers
    MOVE.B  $100000, D3         ; Load byte from memory
    MOVE.W  $100002, D4         ; Load word from memory
    MOVE.L  $100004, D5         ; Load long from memory
    
    ; === REGISTER TO MEMORY TRANSFERS ===
    ; Store register values to different memory locations
    MOVE.B  D3, $100010         ; Store byte to memory
    MOVE.W  D4, $100012         ; Store word to memory
    MOVE.L  D5, $100014         ; Store long to memory
    
    ; === CLEARING REGISTERS ===
    ; Multiple ways to clear registers
    MOVE.L  #0, D6              ; Clear using immediate zero
    CLR.L   D7                  ; Clear using CLR instruction
    
    ; Clear different sizes
    CLR.B   D0                  ; Clear only low byte
    CLR.W   D1                  ; Clear only low word
    CLR.L   D2                  ; Clear entire long
    
    ; === WORKING WITH PARTIAL REGISTER ACCESS ===
    ; 68000 allows access to different parts of data registers
    
    MOVE.L  #$12345678, D0      ; Load full 32-bit value
    ; D0 now contains: $12345678
    ; High word: $1234, Low word: $5678
    ; High byte of low word: $56, Low byte: $78
    
    MOVE.W  #$ABCD, D0          ; Modify only low word
    ; D0 now contains: $1234ABCD
    
    MOVE.B  #$EF, D0            ; Modify only low byte
    ; D0 now contains: $1234ABEF
    
    RTS
```

## 68000 Data Sizes

The 68000 operates on three different data sizes:

### Byte (.B) - 8 bits
- Range: 0 to 255 (unsigned) or -128 to +127 (signed)
- Uses only the lowest 8 bits of a register

### Word (.W) - 16 bits
- Range: 0 to 65,535 (unsigned) or -32,768 to +32,767 (signed)
- Uses the lowest 16 bits of a register

### Long (.L) - 32 bits
- Range: 0 to 4,294,967,295 (unsigned) or -2,147,483,648 to +2,147,483,647 (signed)
- Uses the full 32 bits of a register

**Data Size Demonstration:**

```assembly
; 68000 Data Size Operations
; Demonstrates working with different data sizes

DataSizeDemo:
    ; === BYTE OPERATIONS (.B) ===
    ; Working with 8-bit values
    MOVE.B  #100, D0            ; Load byte value 100
    MOVE.B  #200, D1            ; Load byte value 200
    ADD.B   D1, D0              ; Add bytes: 100 + 200 = 300, but wraps to 44
    MOVE.B  D0, ByteResult      ; Store byte result
    
    ; === WORD OPERATIONS (.W) ===
    ; Working with 16-bit values
    MOVE.W  #1000, D0           ; Load word value 1000
    MOVE.W  #2000, D1           ; Load word value 2000
    ADD.W   D1, D0              ; Add words: 1000 + 2000 = 3000
    MOVE.W  D0, WordResult      ; Store word result
    
    ; === LONG OPERATIONS (.L) ===
    ; Working with 32-bit values
    MOVE.L  #100000, D0         ; Load long value 100000
    MOVE.L  #200000, D1         ; Load long value 200000
    ADD.L   D1, D0              ; Add longs: 100000 + 200000 = 300000
    MOVE.L  D0, LongResult      ; Store long result
    
    ; === MIXED SIZE OPERATIONS ===
    ; Demonstrate how different sizes affect the same register
    
    CLR.L   D0                  ; Clear entire register: $00000000
    MOVE.B  #$AB, D0            ; Set low byte: $000000AB
    MOVE.W  #$1234, D0          ; Set low word: $00001234
    MOVE.L  #$87654321, D0      ; Set entire long: $87654321
    
    ; Extract different parts
    MOVE.L  D0, D1              ; Copy entire value
    MOVE.W  D0, D2              ; Copy only low word ($4321)
    MOVE.B  D0, D3              ; Copy only low byte ($21)
    
    ; === SIGN EXTENSION ===
    ; 68000 automatically handles sign extension properly
    
    MOVE.B  #-1, D0             ; Load -1 as byte ($FF)
    EXT.W   D0                  ; Extend byte to word ($FFFF)
    EXT.L   D0                  ; Extend word to long ($FFFFFFFF)
    
    MOVE.B  #127, D1            ; Load +127 as byte ($7F)
    EXT.W   D1                  ; Extend byte to word ($007F)
    EXT.L   D1                  ; Extend word to long ($0000007F)
    
    ; === MEMORY STORAGE WITH DIFFERENT SIZES ===
    ; Store the same register in different sizes
    
    MOVE.L  #$12345678, D0      ; Load test value
    
    ; Store in different sizes to see memory layout
    MOVE.L  D0, $100000         ; Store as long (4 bytes)
    MOVE.W  D0, $100010         ; Store as word (2 bytes, stores $5678)
    MOVE.B  D0, $100020         ; Store as byte (1 byte, stores $78)
    
    ; === BIG-ENDIAN BYTE ORDER ===
    ; 68000 uses big-endian byte ordering (most significant byte first)
    
    MOVE.L  #$12345678, D0      ; Load test pattern
    MOVE.L  #$200000, A0        ; Address to store data
    
    MOVE.L  D0, (A0)            ; Store long at address
    ; Memory layout (big-endian):
    ; $200000: $12 (most significant byte)
    ; $200001: $34
    ; $200002: $56  
    ; $200003: $78 (least significant byte)
    
    ; Read back individual bytes to verify
    MOVE.B  (A0), D1            ; Read first byte ($12)
    MOVE.B  1(A0), D2           ; Read second byte ($34)
    MOVE.B  2(A0), D3           ; Read third byte ($56)
    MOVE.B  3(A0), D4           ; Read fourth byte ($78)
    
    ; === PRACTICAL EXAMPLE: COLOUR VALUE MANIPULATION ===
    ; Work with Amiga colour values (16-bit words)
    
    MOVE.W  #$0F84, D0          ; Load Amiga colour value
    ; Amiga colour format: $0RGB (4 bits each for R, G, B)
    ; $0F84 = Red: $F, Green: $8, Blue: $4
    
    ; Extract colour components
    MOVE.W  D0, D1              ; Copy colour value
    LSR.W   #8, D1              ; Shift right 8 bits
    AND.W   #$0F, D1            ; Mask red component
    MOVE.B  D1, RedComponent    ; Store red value
    
    MOVE.W  D0, D2              ; Copy colour value
    LSR.W   #4, D2              ; Shift right 4 bits
    AND.W   #$0F, D2            ; Mask green component
    MOVE.B  D2, GreenComponent  ; Store green value
    
    MOVE.W  D0, D3              ; Copy colour value
    AND.W   #$0F, D3            ; Mask blue component
    MOVE.B  D3, BlueComponent   ; Store blue value
    
    RTS

; Data storage areas
ByteResult:     DC.B    0
WordResult:     DC.W    0
LongResult:     DC.L    0
RedComponent:   DC.B    0
GreenComponent: DC.B    0
BlueComponent:  DC.B    0
```

## The MOVE Instruction

MOVE is the fundamental instruction for transferring data on the 68000:

### MOVE Syntax
```text
MOVE.size source, destination
```

### MOVE Variations
- **MOVE.B**: Move byte (8 bits)
- **MOVE.W**: Move word (16 bits)  
- **MOVE.L**: Move long (32 bits)
- **MOVEA**: Move to address register (always long)

### Source and Destination Types
- **Immediate**: `#value`
- **Register**: `D0`, `A0`, etc.
- **Memory**: `$address`, `(A0)`, etc.

**MOVE Instruction Variations:**

```assembly
; Comprehensive MOVE instruction demonstration
; Shows all the ways to move data around

MOVEInstructionDemo:
    ; === IMMEDIATE TO REGISTER ===
    ; Load constant values into registers
    MOVE.B  #$42, D0            ; Move byte immediate to data register
    MOVE.W  #$1234, D1          ; Move word immediate to data register
    MOVE.L  #$87654321, D2      ; Move long immediate to data register
    
    ; Load addresses into address registers
    MOVEA.L #$100000, A0        ; Move address to address register
    MOVEA.L #$200000, A1        ; Move another address
    
    ; === REGISTER TO REGISTER ===
    ; Copy data between registers
    MOVE.B  D0, D3              ; Copy byte from D0 to D3
    MOVE.W  D1, D4              ; Copy word from D1 to D4
    MOVE.L  D2, D5              ; Copy long from D2 to D5
    
    ; Copy addresses between address registers
    MOVE.L  A0, A2              ; Copy address from A0 to A2
    
    ; === REGISTER TO MEMORY ===
    ; Store register contents to memory
    MOVE.B  D0, $100000         ; Store byte to absolute address
    MOVE.W  D1, $100002         ; Store word to absolute address
    MOVE.L  D2, $100004         ; Store long to absolute address
    
    ; Store using address registers (indirect addressing)
    MOVE.B  D0, (A0)            ; Store byte to address in A0
    MOVE.W  D1, (A1)            ; Store word to address in A1
    
    ; === MEMORY TO REGISTER ===
    ; Load data from memory to registers
    MOVE.B  $100000, D6         ; Load byte from absolute address
    MOVE.W  $100002, D7         ; Load word from absolute address
    MOVE.L  $100004, D0         ; Load long from absolute address
    
    ; Load using address registers
    MOVE.B  (A0), D1            ; Load byte from address in A0
    MOVE.W  (A1), D2            ; Load word from address in A1
    
    ; === MEMORY TO MEMORY ===
    ; 68000 can move directly from memory to memory!
    MOVE.B  $100000, $200000    ; Copy byte from one address to another
    MOVE.W  $100002, $200002    ; Copy word from one address to another
    MOVE.L  $100004, $200004    ; Copy long from one address to another
    
    ; === OFFSET ADDRESSING ===
    ; Access memory with offsets from address registers
    MOVE.L  #$300000, A3        ; Base address
    
    MOVE.B  #$AA, 0(A3)         ; Store at base address + 0
    MOVE.B  #$BB, 1(A3)         ; Store at base address + 1
    MOVE.B  #$CC, 2(A3)         ; Store at base address + 2
    MOVE.B  #$DD, 3(A3)         ; Store at base address + 3
    
    ; Read back with offsets
    MOVE.B  0(A3), D0           ; Load from base + 0
    MOVE.B  1(A3), D1           ; Load from base + 1
    MOVE.B  2(A3), D2           ; Load from base + 2
    MOVE.B  3(A3), D3           ; Load from base + 3
    
    ; === INDEXED ADDRESSING ===
    ; Use data register as index
    MOVE.L  #$400000, A4        ; Base address
    MOVE.L  #5, D7              ; Index value
    
    MOVE.B  #$99, 0(A4,D7.L)    ; Store at base + index
    MOVE.B  0(A4,D7.L), D4      ; Load from base + index
    
    ; === PRE-DECREMENT AND POST-INCREMENT ===
    ; Automatic address register modification
    MOVE.L  #$500004, A5        ; Start address (pointing past end)
    
    MOVE.B  #$11, -(A5)         ; Pre-decrement A5, then store
    MOVE.B  #$22, -(A5)         ; Pre-decrement A5, then store
    MOVE.B  #$33, -(A5)         ; Pre-decrement A5, then store
    MOVE.B  #$44, -(A5)         ; Pre-decrement A5, then store
    ; A5 now points to $500000, memory contains $44332211
    
    MOVE.L  #$600000, A6        ; Start address
    
    MOVE.B  (A6)+, D0           ; Load from A6, then post-increment
    MOVE.B  (A6)+, D1           ; Load from A6, then post-increment
    MOVE.B  (A6)+, D2           ; Load from A6, then post-increment
    MOVE.B  (A6)+, D3           ; Load from A6, then post-increment
    
    ; === PRACTICAL EXAMPLE: COPYING DATA BLOCKS ===
    ; Copy a block of data from source to destination
    
    MOVE.L  #SourceData, A0     ; Source address
    MOVE.L  #DestData, A1       ; Destination address
    MOVE.L  #7, D7              ; Counter (8 bytes to copy)
    
CopyLoop:
    MOVE.B  (A0)+, (A1)+        ; Copy byte and increment both pointers
    DBRA    D7, CopyLoop        ; Decrement D7 and branch if not -1
    
    ; === PRACTICAL EXAMPLE: FILLING MEMORY ===
    ; Fill a block of memory with a pattern
    
    MOVE.L  #$700000, A0        ; Start address
    MOVE.L  #$12345678, D0      ; Fill pattern
    MOVE.L  #63, D7             ; Counter (64 longs = 256 bytes)
    
FillLoop:
    MOVE.L  D0, (A0)+           ; Store long and increment address
    DBRA    D7, FillLoop        ; Continue until done
    
    ; === SIZE CONVERSION EXAMPLE ===
    ; Convert between different data sizes
    
    MOVE.B  #200, D0            ; Load byte value
    EXT.W   D0                  ; Extend to word (sign extend)
    EXT.L   D0                  ; Extend to long (sign extend)
    
    MOVE.W  #-1000, D1          ; Load signed word
    EXT.L   D1                  ; Extend to signed long
    
    RTS

; Data areas for examples
SourceData:     DC.B    $10,$20,$30,$40,$50,$60,$70,$80
DestData:       DS.B    8       ; Reserve 8 bytes for destination
```

## 68000 Memory Organization

The 68000 uses a linear memory model with several important characteristics:

### Memory Layout
- **24-bit addressing**: Can access 16MB of memory (on original Amiga)
- **Big-endian byte order**: Most significant byte stored first
- **Word alignment**: 16-bit and 32-bit data should start on even addresses
- **No memory pages**: Simple linear addressing (unlike 6502)

### Amiga Memory Regions
```text
$000000-$0FFFFF  Chip RAM (1MB, accessible by custom chips)
$100000-$1FFFFF  Extended Chip RAM (additional 1MB on later models)
$200000-$9FFFFF  Fast RAM (expansion RAM, CPU only)
$A00000-$BFFFFF  Reserved
$C00000-$D7FFFF  Slow RAM (some configurations)
$D80000-$DDFFFF  Reserved
$DE0000-$DEFFFF  Custom chip registers
$DF0000-$DFFFFF  Reserved
$F80000-$FFFFFF  Kickstart ROM
```

**Memory Organization and Alignment:**

```assembly
; Demonstration of 68000 memory organization and alignment
; Shows big-endian byte order and alignment considerations

MemoryOrganizationDemo:
    ; === BIG-ENDIAN BYTE ORDER DEMONSTRATION ===
    ; 68000 stores most significant byte first
    
    MOVE.L  #$12345678, D0      ; Load test pattern
    MOVE.L  #$800000, A0        ; Memory address for storage
    
    MOVE.L  D0, (A0)            ; Store 32-bit value
    ; Memory layout (big-endian):
    ; $800000: $12  (most significant byte)
    ; $800001: $34
    ; $800002: $56
    ; $800003: $78  (least significant byte)
    
    ; Verify byte order by reading individual bytes
    MOVE.B  0(A0), D1           ; Read byte 0: should be $12
    MOVE.B  1(A0), D2           ; Read byte 1: should be $34
    MOVE.B  2(A0), D3           ; Read byte 2: should be $56
    MOVE.B  3(A0), D4           ; Read byte 3: should be $78
    
    ; === WORD ALIGNMENT DEMONSTRATION ===
    ; 68000 prefers even addresses for word/long access
    
    MOVE.L  #$810000, A1        ; Even address (good)
    MOVE.W  #$ABCD, (A1)        ; Store word at even address - fast
    
    MOVE.L  #$810001, A2        ; Odd address (not preferred)
    MOVE.W  #$EF01, (A2)        ; Store word at odd address - slower
    
    ; === MEMORY REGION USAGE EXAMPLES ===
    ; Simulate working with different Amiga memory regions
    
    ; Chip RAM - accessible by custom chips (graphics, sound)
    MOVE.L  #$000000, A3        ; Chip RAM base
    MOVE.L  #$12345678, (A3)    ; Store data in chip RAM
    
    ; Fast RAM - CPU only, faster for computation
    MOVE.L  #$200000, A4        ; Fast RAM base (if available)
    MOVE.L  #$87654321, (A4)    ; Store data in fast RAM
    
    ; === EFFICIENT MEMORY ACCESS PATTERNS ===
    ; Demonstrate efficient ways to access memory
    
    ; Sequential access using post-increment
    MOVE.L  #$820000, A5        ; Start address
    MOVE.L  #15, D7             ; Counter for 16 operations
    
SequentialWrite:
    MOVE.L  D7, (A5)+           ; Store counter value, increment address
    DBRA    D7, SequentialWrite ; Continue until done
    
    ; Block transfer using MOVEM (move multiple registers)
    MOVEM.L D0-D7, $830000      ; Store D0-D7 to memory block
    MOVEM.L $830000, D0-D7      ; Load D0-D7 from memory block
    
    ; === STACK OPERATIONS ===
    ; The stack grows downward from high memory
    
    MOVE.L  #$840000, A7        ; Set stack pointer (SP)
    
    ; Push values onto stack
    MOVE.L  #$11111111, -(A7)   ; Push long value
    MOVE.L  #$22222222, -(A7)   ; Push another long value
    MOVE.L  #$33333333, -(A7)   ; Push third long value
    
    ; Pop values from stack
    MOVE.L  (A7)+, D0           ; Pop into D0 (gets $33333333)
    MOVE.L  (A7)+, D1           ; Pop into D1 (gets $22222222)
    MOVE.L  (A7)+, D2           ; Pop into D2 (gets $11111111)
    
    ; === STRUCTURE ACCESS EXAMPLE ===
    ; Access members of a data structure
    
    MOVE.L  #PlayerStruct, A6   ; Address of player structure
    
    ; Initialize player structure
    MOVE.W  #100, PLAYER_X(A6)  ; Set X coordinate
    MOVE.W  #200, PLAYER_Y(A6)  ; Set Y coordinate
    MOVE.W  #255, PLAYER_HEALTH(A6) ; Set health
    MOVE.B  #1, PLAYER_ACTIVE(A6)   ; Set active flag
    
    ; Read back structure members
    MOVE.W  PLAYER_X(A6), D0    ; Load X coordinate
    MOVE.W  PLAYER_Y(A6), D1    ; Load Y coordinate
    MOVE.W  PLAYER_HEALTH(A6), D2 ; Load health
    MOVE.B  PLAYER_ACTIVE(A6), D3 ; Load active flag
    
    ; === MEMORY COMPARISON EXAMPLE ===
    ; Compare blocks of memory
    
    MOVE.L  #Block1, A0         ; First block address
    MOVE.L  #Block2, A1         ; Second block address
    MOVE.L  #7, D7              ; Compare 8 bytes
    
CompareLoop:
    MOVE.B  (A0)+, D0           ; Load byte from block 1
    CMP.B   (A1)+, D0           ; Compare with byte from block 2
    BNE     BlocksDifferent     ; Branch if different
    DBRA    D7, CompareLoop     ; Continue comparison
    
    ; Blocks are identical
    MOVE.L  #$FFFFFFFF, D5      ; Mark as identical
    BRA     ComparisonDone
    
BlocksDifferent:
    MOVE.L  #$00000000, D5      ; Mark as different
    
ComparisonDone:
    
    RTS

; Structure offset definitions
PLAYER_X        EQU     0       ; X coordinate (word)
PLAYER_Y        EQU     2       ; Y coordinate (word)
PLAYER_HEALTH   EQU     4       ; Health points (word)
PLAYER_ACTIVE   EQU     6       ; Active flag (byte)
PLAYER_SIZE     EQU     8       ; Total structure size

; Data structures
PlayerStruct:
    DC.W    0       ; X coordinate
    DC.W    0       ; Y coordinate
    DC.W    0       ; Health
    DC.B    0       ; Active flag
    DC.B    0       ; Padding for alignment

Block1:         DC.B    $01,$02,$03,$04,$05,$06,$07,$08
Block2:         DC.B    $01,$02,$03,$04,$05,$06,$07,$08
```

## Practice Exercise

**68000 Register and Memory Practice:**

```assembly
; Practice Exercise: Amiga Graphics Data Processor
; Use 68000 registers and memory operations for graphics processing

GraphicsDataProcessor:
    ; Initialize system
    JSR     InitializeProcessor
    
    ; Process sprite data
    JSR     ProcessSpriteData
    
    ; Process palette data
    JSR     ProcessPaletteData
    
    ; Generate graphics patterns
    JSR     GeneratePatterns
    
    RTS

InitializeProcessor:
    ; Clear all data registers
    MOVEQ   #0, D0              ; MOVEQ is efficient for small constants
    MOVEQ   #0, D1
    MOVEQ   #0, D2
    MOVEQ   #0, D3
    MOVEQ   #0, D4
    MOVEQ   #0, D5
    MOVEQ   #0, D6
    MOVEQ   #0, D7
    
    ; Set up address registers for graphics data
    MOVE.L  #SpriteDataArea, A0 ; Sprite data base
    MOVE.L  #PaletteArea, A1    ; Palette data base
    MOVE.L  #PatternBuffer, A2  ; Pattern generation buffer
    MOVE.L  #TempWorkArea, A3   ; Temporary work area
    
    RTS

ProcessSpriteData:
    ; Process 8 sprites, each with X, Y, and pattern data
    MOVE.L  #7, D7              ; Counter for 8 sprites (0-7)
    MOVE.L  A0, A4              ; Copy sprite data pointer
    
SpriteLoop:
    ; Load sprite data
    MOVE.W  (A4)+, D0           ; Load X coordinate
    MOVE.W  (A4)+, D1           ; Load Y coordinate
    MOVE.W  (A4)+, D2           ; Load pattern number
    
    ; Validate sprite position (keep on screen)
    CMP.W   #320, D0            ; Check X boundary
    BCS     XPositionOK         ; Branch if X < 320
    MOVE.W  #319, D0            ; Clamp to screen edge
    
XPositionOK:
    CMP.W   #256, D1            ; Check Y boundary
    BCS     YPositionOK         ; Branch if Y < 256
    MOVE.W  #255, D1            ; Clamp to screen edge
    
YPositionOK:
    ; Store validated sprite data
    MOVE.W  D0, -6(A4)          ; Store corrected X
    MOVE.W  D1, -4(A4)          ; Store corrected Y
    
    ; Calculate sprite screen address
    ; Screen address = Y * 40 + (X / 8)
    MOVE.W  D1, D3              ; Copy Y coordinate
    MULU.W  #40, D3             ; Multiply Y by 40 (bytes per row)
    MOVE.W  D0, D4              ; Copy X coordinate
    LSR.W   #3, D4              ; Divide X by 8 (8 pixels per byte)
    ADD.W   D4, D3              ; Add X offset to Y offset
    
    ; Store calculated screen address
    MOVE.L  D3, (A3)+           ; Store in temp work area
    
    DBRA    D7, SpriteLoop      ; Continue for all sprites
    
    RTS

ProcessPaletteData:
    ; Process 32 colour palette entries
    MOVE.L  #31, D7             ; Counter for 32 colours (0-31)
    MOVE.L  A1, A4              ; Copy palette pointer
    
PaletteLoop:
    ; Load Amiga colour value (16-bit: $0RGB, 4 bits each)
    MOVE.W  (A4), D0            ; Load colour word
    
    ; Extract red component (bits 8-11)
    MOVE.W  D0, D1              ; Copy colour value
    LSR.W   #8, D1              ; Shift right 8 positions
    AND.W   #$0F, D1            ; Mask to 4 bits
    
    ; Extract green component (bits 4-7)
    MOVE.W  D0, D2              ; Copy colour value
    LSR.W   #4, D2              ; Shift right 4 positions
    AND.W   #$0F, D2            ; Mask to 4 bits
    
    ; Extract blue component (bits 0-3)
    MOVE.W  D0, D3              ; Copy colour value
    AND.W   #$0F, D3            ; Mask to 4 bits
    
    ; Calculate brightness (simple average)
    ADD.W   D2, D1              ; Add green to red
    ADD.W   D3, D1              ; Add blue to sum
    MOVE.W  D1, D4              ; Copy sum
    LSR.W   #2, D4              ; Divide by 4 (approximate average)
    
    ; Store brightness value
    MOVE.B  D4, (A3)+           ; Store brightness byte
    
    ; Advance to next palette entry
    ADDQ.L  #2, A4              ; Move to next word
    DBRA    D7, PaletteLoop     ; Continue for all colours
    
    RTS

GeneratePatterns:
    ; Generate 16 different 8x8 pixel patterns
    MOVE.L  #15, D7             ; Counter for 16 patterns (0-15)
    MOVE.L  A2, A4              ; Copy pattern buffer pointer
    
PatternLoop:
    ; Generate pattern based on pattern number
    MOVE.L  D7, D6              ; Copy pattern number
    
    ; Generate 8 rows of pattern data
    MOVE.L  #7, D5              ; Counter for 8 rows (0-7)
    
RowLoop:
    ; Calculate pattern byte based on pattern number and row
    MOVE.L  D6, D0              ; Pattern number
    MOVE.L  D5, D1              ; Row number
    
    ; Simple pattern generation algorithm
    ADD.L   D1, D0              ; Add row to pattern number
    LSL.L   #1, D0              ; Shift left (multiply by 2)
    EOR.L   D6, D0              ; XOR with original pattern number
    
    ; Create different pattern types
    BTST    #0, D6              ; Test bit 0 of pattern number
    BEQ     EvenPattern         ; Branch if even pattern
    
    ; Odd pattern - use rotation
    ROL.B   D1, D0              ; Rotate left by row number
    BRA     StorePatternByte
    
EvenPattern:
    ; Even pattern - use simple bit shifting
    LSL.B   D1, D0              ; Shift left by row number
    
StorePatternByte:
    MOVE.B  D0, (A4)+           ; Store pattern byte
    
    DBRA    D5, RowLoop         ; Continue for all rows
    
    DBRA    D7, PatternLoop     ; Continue for all patterns
    
    ; === VERIFICATION: READ BACK GENERATED DATA ===
    ; Read back some generated data to verify
    
    MOVE.L  #PatternBuffer, A5  ; Pattern buffer start
    MOVE.B  0(A5), D0           ; Read first pattern byte
    MOVE.B  8(A5), D1           ; Read first byte of second pattern
    MOVE.B  16(A5), D2          ; Read first byte of third pattern
    
    ; Store verification data
    MOVE.L  #$900000, A6        ; Verification storage area
    MOVE.B  D0, (A6)+           ; Store first sample
    MOVE.B  D1, (A6)+           ; Store second sample
    MOVE.B  D2, (A6)+           ; Store third sample
    
    RTS

; Data areas
SpriteDataArea:
    ; 8 sprites: X, Y, Pattern (6 bytes each = 48 bytes total)
    DC.W    50, 100, 0          ; Sprite 0
    DC.W    150, 80, 1          ; Sprite 1
    DC.W    250, 120, 2         ; Sprite 2
    DC.W    75, 200, 3          ; Sprite 3
    DC.W    175, 50, 4          ; Sprite 4
    DC.W    300, 180, 5         ; Sprite 5
    DC.W    25, 150, 6          ; Sprite 6
    DC.W    200, 220, 7         ; Sprite 7

PaletteArea:
    ; 32 Amiga colour values (16-bit each)
    DC.W    $0000,$0F00,$00F0,$000F,$0FF0,$0F0F,$00FF,$0FFF
    DC.W    $0800,$0080,$0008,$0880,$0808,$0088,$0888,$0444
    DC.W    $0222,$0AAA,$0CCC,$0EEE,$0F84,$084F,$48F0,$8F04
    DC.W    $0F48,$048F,$84F0,$4F08,$0842,$0428,$0284,$0824

PatternBuffer:
    DS.B    128                 ; 16 patterns × 8 bytes each

TempWorkArea:
    DS.B    256                 ; Temporary storage for calculations

; Challenge exercises:
; 1. Add sprite collision detection using coordinate comparison
; 2. Implement palette colour cycling/animation
; 3. Create more complex pattern generation algorithms
; 4. Add sprite priority sorting based on Y coordinates
```

## What You've Learned

In this lesson, you've learned:

1. **68000 Register Architecture** - 8 data registers (D0-D7) and 8 address registers (A0-A7)
2. **Data Sizes** - Byte (.B), word (.W), and long (.L) operations
3. **MOVE Instruction** - The fundamental data transfer instruction
4. **Memory Organization** - Big-endian byte order and memory layout
5. **Basic Programming Patterns** - How to structure 68000 assembly programs

## Looking Ahead

Next, you'll learn about the 68000's comprehensive addressing modes - far more powerful and flexible than 8-bit processors. You'll discover how the 68000's sophisticated addressing capabilities make complex programming tasks much easier!

## Fun Fact

The Motorola 68000 was a revolutionary processor when it was introduced in 1979. Unlike 8-bit processors that were limited to 64KB of memory and had minimal registers, the 68000 offered 16MB of addressable memory and 16 powerful 32-bit registers. This architecture was so advanced that it influenced processor design for decades. The 68000 family powered not just the Amiga, but also the original Macintosh, Atari ST, and many arcade systems. The clean, orthogonal instruction set made it a joy to program in assembly language - a stark contrast to the quirky limitations of 8-bit processors. Many programmers considered the 68000 to be the most elegant processor architecture ever created!