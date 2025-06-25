---
title: "Indexed Addressing Modes"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 9
description: "Learn indexed addressing to work with arrays, data tables, and screen memory efficiently. Learn to use X and Y registers as powerful indexing tools for complex data manipulation."
learning_objectives:
  - "Understand indexed addressing modes and their syntax"
  - "Learn absolute indexed addressing ($address,X and $address,Y)"
  - "Learn zero page indexed addressing ($zp,X and $zp,Y)"
  - "Create programs that work with arrays and data tables"
  - "Build efficient screen memory manipulation routines"
concepts:
  - "Indexed addressing modes"
  - "Absolute indexed ($address,X and $address,Y)"
  - "Zero page indexed ($zp,X and $zp,Y)"
  - "Arrays and data tables"
  - "Index registers as counters"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 9
---

# Lesson 9: Indexed Addressing Modes

Welcome to the world of advanced memory addressing! Today you'll learn indexed addressing - the key to working with arrays, data tables, and efficient screen manipulation. This unlocks the 6502's true power for complex programming.

## What Is Indexed Addressing?

**Indexed addressing** lets you access memory locations by adding an offset (from X or Y registers) to a base address. Think of it like this:

- **Base address**: The starting point (like the beginning of an array)
- **Index**: How far from the start you want to go (stored in X or Y)
- **Final address**: Base + Index = the actual memory location accessed

This is **essential** for working with:
- Arrays of data
- Character strings
- Screen memory manipulation
- Data tables and lookups
- Any repetitive data processing

## Absolute Indexed Addressing

### Absolute Indexed with X Register ($address,X)

**Syntax**: `LDA $1000,X`
**Meaning**: Load from memory address ($1000 + X register)

```text
LDX #$05        ; X = 5
LDA $0400,X     ; Load from $0400 + 5 = $0405 (screen position 5)
```

**Absolute Indexed with X:**

```assembly
LDX #$05        ; Set X to 5
LDA #$48        ; Load 'H'
STA $0400,X     ; Store at screen position 5 ($0400 + 5 = $0405)
```

### Absolute Indexed with Y Register ($address,Y)

**Syntax**: `LDA $1000,Y`
**Meaning**: Load from memory address ($1000 + Y register)

```text
LDY #$28        ; Y = 40 (one full screen row)
LDA $0400,Y     ; Load from $0400 + 40 = $0428 (start of row 2)
```

**Absolute Indexed with Y:**

```assembly
LDY #$28        ; Y = 40 (one screen row)
LDA #$57        ; Load 'W'
STA $0400,Y     ; Store at start of row 2 ($0400 + 40 = $0428)
```

## Zero Page Indexed Addressing

### Zero Page Indexed with X ($zp,X)

**Syntax**: `LDA $80,X`
**Meaning**: Load from Zero Page address ($80 + X register)

```text
LDX #$03        ; X = 3
LDA $80,X       ; Load from $80 + 3 = $83
```

**Advantage**: Faster than absolute indexed (fewer CPU cycles)

**Zero Page Indexed with X:**

```assembly
LDX #$03        ; X = 3
LDA #$42        ; Load 'B'
STA $80,X       ; Store at $80 + 3 = $83 (fast zero page access)
```

### Zero Page Indexed with Y ($zp,Y)

**Syntax**: `LDA $80,Y`
**Meaning**: Load from Zero Page address ($80 + Y register)

```text
LDY #$07        ; Y = 7
STA $90,Y       ; Store at $90 + 7 = $97
```

**Zero Page Indexed with Y:**

```assembly
LDY #$07        ; Y = 7
LDA #$43        ; Load 'C'
STA $90,Y       ; Store at $90 + 7 = $97 (fast zero page access)
```

## Working with Arrays

Indexed addressing is perfect for arrays. Let's create and manipulate a simple array:

```text
; Store array data in Zero Page
LDA #$41        ; 'A'
STA $80         ; Array[0] = 'A'
LDA #$42        ; 'B'  
STA $81         ; Array[1] = 'B'
LDA #$43        ; 'C'
STA $82         ; Array[2] = 'C'

; Read array using indexed addressing
LDX #$01        ; Index = 1
LDA $80,X       ; Load Array[1] = 'B'
STA $0400       ; Display on screen
```

**Working with Arrays:**

```assembly
; Create array in Zero Page
LDA #$41        ; 'A'
STA $80         ; Array[0] = 'A'
LDA #$42        ; 'B'  
STA $81         ; Array[1] = 'B'
LDA #$43        ; 'C'
STA $82         ; Array[2] = 'C'

; Access array element
LDX #$01        ; Index = 1
LDA $80,X       ; Load Array[1] = 'B'
STA $0400       ; Display 'B' on screen
```

## Screen Memory Manipulation

The C64 screen is perfect for demonstrating indexed addressing. The screen starts at $0400 and is 40×25 characters:

```text
; Fill first row with stars
LDX #$00        ; Start at position 0
LDA #$2A        ; Load '*' character

; Fill 10 positions with stars
STA $0400,X     ; Position 0
INX             ; X = 1
STA $0400,X     ; Position 1
INX             ; X = 2
STA $0400,X     ; Position 2
; ... continue pattern
```

**Screen Memory with Indexed Addressing:**

```assembly
; Fill screen positions with different characters
LDX #$00        ; Start at position 0
LDA #$2A        ; '*'
STA $0400,X     ; Screen position 0

LDX #$01        ; Position 1
LDA #$2B        ; '+'
STA $0400,X     ; Screen position 1

LDX #$02        ; Position 2
LDA #$3D        ; '='
STA $0400,X     ; Screen position 2
```

## Efficient Loop Patterns

Indexed addressing enables efficient loops. Here's a pattern for processing multiple data items:

```text
; Copy 5 characters from one array to screen
LDX #$04        ; Start at index 4 (work backwards)

; Loop would go here (we'll learn proper loops later)
LDA $90,X       ; Load from source array
STA $0400,X     ; Store to screen
DEX             ; Decrement index
; Repeat until X = 0
```

**Data Processing with Indexed Addressing:**

```assembly
; Setup source data
LDA #$48        ; 'H'
STA $90         
LDA #$45        ; 'E'
STA $91         
LDA #$4C        ; 'L'
STA $92         

; Copy using indexed addressing
LDX #$00
LDA $90,X       ; Load 'H'
STA $0400,X     ; Store at screen[0]
INX
LDA $90,X       ; Load 'E'  
STA $0400,X     ; Store at screen[1]
INX
LDA $90,X       ; Load 'L'
STA $0400,X     ; Store at screen[2]
```

## Working with Screen Rows

The C64 screen is 40 characters wide, so each row starts at:
- Row 0: $0400 (0)
- Row 1: $0428 (40)  
- Row 2: $0450 (80)
- Row 3: $0478 (120)

```text
; Put characters on different rows
LDY #$00        ; Row 0
LDA #$31        ; '1'
STA $0400,Y     ; First row

LDY #$28        ; Row 1 (40 decimal = $28 hex)
LDA #$32        ; '2'  
STA $0400,Y     ; Second row

LDY #$50        ; Row 2 (80 decimal = $50 hex)
LDA #$33        ; '3'
STA $0400,Y     ; Third row
```

**Multi-Row Screen Display:**

```assembly
; Display on different screen rows
LDY #$00        ; Row 0
LDA #$31        ; '1'
STA $0400,Y     ; Display '1' on row 0

LDY #$28        ; Row 1 (40 = $28)
LDA #$32        ; '2'  
STA $0400,Y     ; Display '2' on row 1

LDY #$50        ; Row 2 (80 = $50)
LDA #$33        ; '3'
STA $0400,Y     ; Display '3' on row 2
```

## Data Table Lookups

Indexed addressing is perfect for lookup tables:

```text
; Color value lookup table in Zero Page
LDA #$00        ; Black
STA $A0         ; ColorTable[0]
LDA #$01        ; White
STA $A1         ; ColorTable[1]  
LDA #$02        ; Red
STA $A2         ; ColorTable[2]

; Use table to get colour
LDX #$02        ; Want colour index 2
LDA $A0,X       ; Load ColorTable[2] = Red
STA $D020       ; Set border colour
```

**Color Lookup Table:**

```assembly
; Setup colour lookup table
LDA #$00        ; Black
STA $A0         ; ColorTable[0]
LDA #$01        ; White
STA $A1         ; ColorTable[1]  
LDA #$02        ; Red
STA $A2         ; ColorTable[2]

; Use indexed addressing to lookup colour
LDX #$02        ; Want colour index 2
LDA $A0,X       ; Load ColorTable[2] = Red ($02)
STA $D020       ; Set border colour to red
```

## Comparing Addressing Modes

| Mode | Example | Address Calculated | Speed | Use Case |
|------|---------|-------------------|-------|----------|
| Immediate | `LDA #$41` | N/A | Fastest | Constants |
| Zero Page | `LDA $80` | $80 | Fast | Variables |
| Absolute | `LDA $0400` | $0400 | Medium | Fixed locations |
| ZP Indexed | `LDA $80,X` | $80 + X | Fast | Small arrays |
| Abs Indexed | `LDA $0400,X` | $0400 + X | Medium | Large arrays |

## Practice Exercise

Create a program that:

1. Sets up a character array with your initials in Zero Page ($B0, $B1, $B2)
2. Uses indexed addressing to copy each character to screen positions 10, 11, 12
3. Creates a number table (1, 2, 3) in Zero Page ($C0, $C1, $C2)  
4. Uses indexed addressing to display the numbers on screen row 2

**Practice Exercise - Arrays and Screen Display:**

```assembly
; Setup character array with initials
LDA #$53        ; 'S'
STA $B0         ; InitialsArray[0]
LDA #$48        ; 'H'  
STA $B1         ; InitialsArray[1]
LDA #$21        ; '!'
STA $B2         ; InitialsArray[2]

; Copy to screen using indexed addressing
LDX #$0A        ; Screen position 10
LDA $B0         ; Load first initial
STA $0400,X     ; Display at position 10
INX             ; Position 11
LDA $B1         ; Load second initial
STA $0400,X     ; Display at position 11
INX             ; Position 12
LDA $B2         ; Load exclamation
STA $0400,X     ; Display at position 12

; Setup number table
LDA #$31        ; '1'
STA $C0         ; NumberArray[0]
LDA #$32        ; '2'
STA $C1         ; NumberArray[1]
LDA #$33        ; '3'
STA $C2         ; NumberArray[2]

; Display on row 2 using indexed addressing
LDY #$28        ; Row 1 base (40 chars)
LDX #$00        ; Array index
LDA $C0,X       ; Load NumberArray[0]
STA $0400,Y     ; Display at row 1, position 0
```

## Why Indexed Addressing Matters

Indexed addressing is **essential** for:

**Data Processing**: Work with arrays, strings, tables
**Screen Programming**: Efficient graphics and text manipulation  
**Game Programming**: Sprite data, level maps, score tables
**System Programming**: Buffer management, data structures

## What You've Learned

In this lesson, you've mastered:

- Indexed addressing syntax ($address,X and $address,Y)
- Zero page indexed addressing for maximum speed
- Working with arrays and data tables
- Screen memory manipulation using indexes
- Lookup tables for efficient data access
- When to use different addressing modes for optimal performance

## Looking Ahead

In the next lesson, you'll learn about **indirect addressing** - an even more powerful way to work with memory that lets you use memory locations as pointers. This opens the door to dynamic data structures and advanced programming techniques!

## Fun Fact

The 6502's indexed addressing modes were so well-designed that they became the inspiration for array indexing in high-level programming languages! When you write `array[index]` in C, JavaScript, or Python, the concept traces directly back to assembly instructions like `LDA $1000,X`. You're learning the fundamental pattern that underlies all modern programming!