---
title: "Indexed Addressing and Offsets"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 10
description: "Master indexed addressing using IX and IY registers with offsets. Learn to create flexible data structures and access array elements efficiently."
learning_objectives:
  - "Understand indexed addressing with IX and IY registers"
  - "Learn to use displacement offsets for array access"
  - "Master the syntax for indexed operations"
  - "Create and manipulate data arrays in memory"
  - "Compare indexed vs. indirect addressing efficiency"
concepts:
  - "IX and IY index registers"
  - "Displacement addressing (IX+d)"
  - "Array indexing and data structures"
  - "Offset calculations"
  - "Memory layout planning"
estimated_duration: "40-50 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 10
---

# Lesson 10: Indexed Addressing and Offsets

You've mastered basic memory addressing with HL, BC, and DE. Now you'll learn about the Z80's most sophisticated addressing mode: **indexed addressing** using the IX and IY registers. This powerful feature lets you access data structures like arrays and tables with incredible flexibility.

## Meet the Index Registers

The Z80 has two special 16-bit index registers that other 8-bit processors lack:

### IX Register (Index Register X)
- **Purpose**: Points to data structures with calculated offsets
- **Size**: 16 bits (can hold addresses $0000-$FFFF)
- **Special power**: Can access memory with displacement offsets

### IY Register (Index Register Y)  
- **Purpose**: Second index register for complex data structures
- **Size**: 16 bits (can hold addresses $0000-$FFFF)
- **Common use**: Often used for different data tables than IX

## Basic Indexed Addressing

The magic of indexed addressing is the **displacement** - an offset added to the base address:

```text
LD IX, $5B00     ; IX points to base address $5B00
LD A, (IX+0)     ; Load from $5B00 + 0 = $5B00
LD B, (IX+1)     ; Load from $5B00 + 1 = $5B01  
LD C, (IX+5)     ; Load from $5B00 + 5 = $5B05
```

<CodeRunner 
  system="zx-spectrum"
  title="Basic Indexed Addressing"
  code="LD IX, $5B00     ; Set IX to base address
; First, store some test data
LD (IX+0), $11   ; Store $11 at $5B00
LD (IX+1), $22   ; Store $22 at $5B01
LD (IX+5), $55   ; Store $55 at $5B05

; Now read it back
LD A, (IX+0)     ; A = $11 (from $5B00)
LD B, (IX+1)     ; B = $22 (from $5B01)  
LD C, (IX+5)     ; C = $55 (from $5B05)"
  language="assembly"
/>

The offset can be any value from -128 to +127, giving you tremendous flexibility!

## Creating an Array

Arrays are perfect for indexed addressing. Let's create an array of numbers:

```text
; Create array at $5B10
LD IX, $5B10     ; IX points to array start

; Store array elements
LD (IX+0), 10    ; Element 0 = 10
LD (IX+1), 20    ; Element 1 = 20  
LD (IX+2), 30    ; Element 2 = 30
LD (IX+3), 40    ; Element 3 = 40
LD (IX+4), 50    ; Element 4 = 50
```

<CodeRunner 
  system="zx-spectrum"
  title="Creating an Array"
  code="; Create array of numbers
LD IX, $5B10     ; IX points to array base

; Initialize array with values
LD (IX+0), 10    ; array[0] = 10
LD (IX+1), 20    ; array[1] = 20
LD (IX+2), 30    ; array[2] = 30
LD (IX+3), 40    ; array[3] = 40
LD (IX+4), 50    ; array[4] = 50

; Access array elements
LD A, (IX+2)     ; Load array[2] (30) into A
LD B, (IX+4)     ; Load array[4] (50) into B  
; A=30, B=50"
  language="assembly"
/>

## Using IY for Multiple Arrays

Having two index registers lets you work with multiple data structures:

```text
LD IX, $5B20     ; First array at $5B20
LD IY, $5B30     ; Second array at $5B30

; Store data in both arrays
LD (IX+0), $AA   ; First array element 0
LD (IY+0), $BB   ; Second array element 0
LD (IX+1), $CC   ; First array element 1  
LD (IY+1), $DD   ; Second array element 1
```

<CodeRunner 
  system="zx-spectrum"
  title="Two Arrays with IX and IY"
  code="; Set up two arrays
LD IX, $5B20     ; First array (scores)
LD IY, $5B30     ; Second array (lives)

; Initialize score array
LD (IX+0), 100   ; Player 1 score
LD (IX+1), 200   ; Player 2 score
LD (IX+2), 150   ; Player 3 score

; Initialize lives array  
LD (IY+0), 3     ; Player 1 lives
LD (IY+1), 2     ; Player 2 lives
LD (IY+2), 3     ; Player 3 lives

; Get player 2's data
LD A, (IX+1)     ; A = Player 2 score (200)
LD B, (IY+1)     ; B = Player 2 lives (2)"
  language="assembly"
/>

## Negative Offsets

Indexed addressing supports negative offsets too:

```text
LD IX, $5B50     ; Base address
LD (IX-1), $77   ; Store at $5B4F (one byte before base)
LD (IX-5), $88   ; Store at $5B4B (five bytes before base)
LD A, (IX-1)     ; Load from $5B4F
```

<CodeRunner 
  system="zx-spectrum"
  title="Negative Offsets"
  code="LD IX, $5B50     ; Set base address

; Store using negative offsets
LD (IX-1), $77   ; Store at $5B4F
LD (IX-2), $88   ; Store at $5B4E
LD (IX-3), $99   ; Store at $5B4D

; Read back using negative offsets
LD A, (IX-1)     ; A = $77 from $5B4F
LD B, (IX-2)     ; B = $88 from $5B4E
LD C, (IX-3)     ; C = $99 from $5B4D"
  language="assembly"
/>

This is useful for data structures that grow in different directions!

## Building a Character String Table

Let's create a table to store character strings:

```text
; Character table setup
LD IX, $5C00     ; Base address for character table

; Store a word "HELLO"
LD (IX+0), $48   ; 'H'
LD (IX+1), $45   ; 'E'  
LD (IX+2), $4C   ; 'L'
LD (IX+3), $4C   ; 'L'
LD (IX+4), $4F   ; 'O'
LD (IX+5), $00   ; String terminator

; Store another word "WORLD" starting at offset 10
LD (IX+10), $57  ; 'W'
LD (IX+11), $4F  ; 'O'
LD (IX+12), $52  ; 'R'
LD (IX+13), $4C  ; 'L'
LD (IX+14), $44  ; 'D'
LD (IX+15), $00  ; String terminator
```

<CodeRunner 
  system="zx-spectrum"
  title="Character String Table"
  code="; Create string table
LD IX, $5C00     ; Base address

; Store 'HELLO' at offset 0
LD (IX+0), $48   ; 'H'
LD (IX+1), $45   ; 'E'
LD (IX+2), $4C   ; 'L'
LD (IX+3), $4C   ; 'L'
LD (IX+4), $4F   ; 'O'

; Store 'ZX' at offset 10  
LD (IX+10), $5A  ; 'Z'
LD (IX+11), $58  ; 'X'

; Read characters back
LD A, (IX+0)     ; A = 'H'
LD B, (IX+4)     ; B = 'O'  
LD C, (IX+10)    ; C = 'Z'
LD D, (IX+11)    ; D = 'X'
; A='H', B='O', C='Z', D='X'"
  language="assembly"
/>

## Advanced: Screen Coordinate System

Use indexed addressing for screen graphics with calculated positions:

```text
LD IX, $4000     ; Screen memory start
; Draw a vertical line at column 8
LD (IX+8), $FF   ; Row 0, column 8
LD (IX+40), $FF  ; Row 1, column 8 (32 bytes + 8)
LD (IX+72), $FF  ; Row 2, column 8 (64 bytes + 8)
```

<CodeRunner 
  system="zx-spectrum"
  title="Screen Graphics with Indexed Addressing"
  code="LD IX, $4000     ; Point to screen memory

; Draw a pattern across the top of screen
LD (IX+0), %10101010   ; Pattern at position 0
LD (IX+1), %01010101   ; Alternating pattern at position 1
LD (IX+2), %10101010   ; Pattern at position 2
LD (IX+3), %01010101   ; Alternating pattern at position 3

; Draw another pattern 32 bytes down (next screen row)
LD (IX+32), %11110000  ; Different pattern at start of row 1
LD (IX+33), %00001111  ; Complementary pattern
LD (IX+34), %11110000  ; Repeat pattern"
  language="assembly"
/>

## Indexed vs. Indirect Addressing Comparison

**Indirect Addressing (HL):**
```text
LD HL, $5B00     ; Point to base
LD A, (HL)       ; Get element 0
INC HL           ; Move to next
LD B, (HL)       ; Get element 1
INC HL           ; Move to next  
LD C, (HL)       ; Get element 2
```

**Indexed Addressing (IX):**
```text
LD IX, $5B00     ; Point to base
LD A, (IX+0)     ; Get element 0
LD B, (IX+1)     ; Get element 1
LD C, (IX+2)     ; Get element 2
```

**Advantages of Indexed:**
- No need to modify the base pointer
- Can access elements in any order
- Base pointer remains available for other operations
- Negative offsets for flexible data structures

## Memory Layout Planning

Good indexed addressing requires planning your memory layout:

```
$5B00: Game data structure
  +0: Player X position
  +1: Player Y position  
  +2: Player score (low byte)
  +3: Player score (high byte)
  +4: Player lives
  +5: Player power level
  
$5B10: Enemy data structure (same layout)
  +0: Enemy X position
  +1: Enemy Y position
  etc...
```

## Common Indexed Addressing Patterns

### Table Lookup
```text
LD IX, $5D00     ; Point to lookup table
LD A, 3          ; Want element 3
LD B, (IX+3)     ; Get table[3]
```

### Structure Member Access
```text
LD IX, $5E00     ; Point to player structure
LD A, (IX+0)     ; Get X position
LD B, (IX+1)     ; Get Y position
LD C, (IX+4)     ; Get lives
```

### Multi-dimensional Arrays
```text
; For 2D array: array[row][col]
; Address = base + (row * width) + col
LD IX, $5F00     ; Array base
; Access element at row 2, column 3 (width = 8)
LD A, (IX+19)    ; 2*8 + 3 = 19
```

## Practice Exercise

Create a high score table that stores 5 player scores (each 2 bytes for scores up to 65535):

1. Set up IX to point to your high score table
2. Store some sample scores using indexed addressing
3. Read back the scores and display the highest one

<CodeRunner 
  system="zx-spectrum"
  title="High Score Table Exercise"
  code="; High score table - 5 entries, 2 bytes each
LD IX, $5D00     ; Base of high score table

; Store high scores (2 bytes each, low byte first)
LD (IX+0), $C8   ; Score 1: 1000 (low byte = 200)
LD (IX+1), $03   ; Score 1: 1000 (high byte = 3)

LD (IX+2), $90   ; Score 2: 2000 (low byte = 144)  
LD (IX+3), $07   ; Score 2: 2000 (high byte = 7)

LD (IX+4), $58   ; Score 3: 1500 (low byte = 88)
LD (IX+5), $05   ; Score 3: 1500 (high byte = 5)

; Read back score 2 (highest)
LD A, (IX+2)     ; Low byte of score 2
LD B, (IX+3)     ; High byte of score 2
; Score 2 = B*256 + A = 7*256 + 144 = 2000"
  language="assembly"
/>

## What You've Learned

In this advanced lesson, you've mastered:

- IX and IY index registers and their special capabilities
- Indexed addressing syntax with displacement offsets
- Creating and accessing arrays using indexed addressing
- Using negative offsets for flexible data structures
- Working with multiple data structures simultaneously
- Planning memory layouts for indexed access
- Comparing indexed vs. indirect addressing approaches

## Looking Ahead

Next, you'll learn about **ZX Spectrum screen memory layout** in detail - understanding exactly how the Spectrum organizes its display memory and how to create efficient graphics routines using your new addressing skills!

## Fun Fact

The Z80's indexed addressing was revolutionary for its time. Most 8-bit processors had very limited addressing modes, but the Z80's IX and IY registers with displacement addressing made it possible to write high-level language compilers efficiently. Languages like C, Pascal, and even early versions of BASIC compilers used indexed addressing extensively for implementing arrays, structures, and stack operations. This sophisticated addressing capability was one reason the Z80 remained popular well into the 1990s for embedded systems and industrial applications!