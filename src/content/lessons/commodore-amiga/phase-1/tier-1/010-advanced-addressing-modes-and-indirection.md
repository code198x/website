---
title: "Advanced Addressing Modes and Indirection"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 10
description: "Master the sophisticated addressing modes that make the 68000 processor so powerful. Learn indirect addressing, offset addressing, and register combinations for professional memory access."
learning_objectives:
  - "Understand indirect addressing with displacement and indexing"
  - "Learn to use address register indirect modes effectively"
  - "Master pre-decrement and post-increment addressing"
  - "Apply complex addressing modes to real programming problems"
  - "Build data structures using sophisticated addressing techniques"
concepts:
  - "Address register indirect with displacement"
  - "Address register indirect with index"
  - "Pre-decrement and post-increment modes"
  - "PC-relative addressing modes"
  - "Complex data structure access"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 10
---

# Lesson 10: Advanced Addressing Modes and Indirection

Now that you understand basic 68000 operations, it's time to explore the sophisticated addressing modes that make the 68000 a programmer's dream. These powerful addressing modes allow elegant, efficient access to complex data structures and memory layouts.

## Why Advanced Addressing Modes Matter

The 68000's advanced addressing modes aren't just convenience features - they're essential for:
- **Professional data structures**: Arrays, tables, and complex objects
- **Efficient memory access**: Fewer instructions for complex operations
- **Dynamic programming**: Runtime calculated addresses and offsets
- **System programming**: Hardware register access with offsets
- **Performance optimization**: Hardware-level address calculations

## Address Register Indirect with Displacement

This addressing mode adds a fixed offset to an address register:

```text
MOVE.W 4(A0), D0    ; Load from address A0 + 4
MOVE.L 8(A1), D1    ; Load from address A1 + 8
MOVE.B 12(A2), D2   ; Load from address A2 + 12
```

The displacement can be any 16-bit signed value (-32768 to +32767).

**Address Register Indirect with Displacement:**

```assembly
; Setup a base address pointing to a data structure
MOVE.L #$00080000, A0    ; Base address of our data

; Access different fields in the structure
MOVE.W 0(A0), D0     ; First field (offset 0)
MOVE.W 2(A0), D1     ; Second field (offset 2)  
MOVE.L 4(A0), D2     ; Third field (offset 4)
MOVE.B 8(A0), D3     ; Fourth field (offset 8)
```

This is perfect for accessing fields in data structures!

## Practical Example: Character Data Structure

Let's create a character data structure with multiple fields:

```text
; Character structure layout:
; Offset 0: X coordinate (word)
; Offset 2: Y coordinate (word)  
; Offset 4: Health points (long)
; Offset 8: Character type (byte)
; Offset 9: Level (byte)
```

**Character Data Structure Access:**

```assembly
; Setup character data at address $80000
MOVE.L #$00080000, A0

; Initialize character data
MOVE.W #320, 0(A0)     ; X coordinate = 320
MOVE.W #200, 2(A0)     ; Y coordinate = 200
MOVE.L #100, 4(A0)     ; Health = 100 points
MOVE.B #1, 8(A0)       ; Type = warrior (1)
MOVE.B #5, 9(A0)       ; Level = 5

; Read back the character data
MOVE.W 0(A0), D0       ; Get X coordinate
MOVE.W 2(A0), D1       ; Get Y coordinate
MOVE.L 4(A0), D2       ; Get health points
```

## Address Register Indirect with Index

This powerful mode combines an address register with a data register for dynamic addressing:

```text
MOVE.W (A0,D0.W), D1    ; Address = A0 + D0 (D0 as word)
MOVE.L (A1,D1.L), D2    ; Address = A1 + D1 (D1 as long)
```

The index register can be used as either a word (.W) or long (.L) value.

**Indexed Addressing for Arrays:**

```assembly
; Setup array base address
MOVE.L #$00080000, A0

; Store values in array (each element is 2 bytes)
MOVE.W #0, D0          ; Index 0
MOVE.W #100, (A0,D0.W) ; Array[0] = 100

MOVE.W #2, D0          ; Index 1 (2 bytes offset)
MOVE.W #200, (A0,D0.W) ; Array[1] = 200

MOVE.W #4, D0          ; Index 2 (4 bytes offset)  
MOVE.W #300, (A0,D0.W) ; Array[2] = 300

; Read values back using index
MOVE.W #2, D0          ; Want element 1
MOVE.W (A0,D0.W), D1   ; Load Array[1] into D1
```

## Advanced Indexed Addressing with Scale

The 68000 even supports scaling for different data sizes:

```text
; For word arrays (2 bytes per element)
MOVE.W #1, D0              ; Element index 1
LSL.W #1, D0               ; Multiply by 2 (shift left)
MOVE.W (A0,D0.W), D1       ; Access element 1

; For long arrays (4 bytes per element)  
MOVE.W #2, D0              ; Element index 2
LSL.W #2, D0               ; Multiply by 4 (shift left twice)
MOVE.L (A0,D0.W), D2       ; Access element 2
```

**Scaled Array Access:**

```assembly
; Long word array (4 bytes per element)
MOVE.L #$00080000, A0

; Store values using scaled indexing
MOVE.W #0, D0              ; Element 0
LSL.W #2, D0               ; Scale: 0 * 4 = 0
MOVE.L #$12345678, (A0,D0.W)

MOVE.W #1, D0              ; Element 1  
LSL.W #2, D0               ; Scale: 1 * 4 = 4
MOVE.L #$ABCDEF00, (A0,D0.W)

MOVE.W #2, D0              ; Element 2
LSL.W #2, D0               ; Scale: 2 * 4 = 8  
MOVE.L #$11111111, (A0,D0.W)

; Read element 1 back
MOVE.W #1, D0
LSL.W #2, D0
MOVE.L (A0,D0.W), D1       ; D1 = $ABCDEF00
```

## Pre-Decrement and Post-Increment Modes

These modes automatically adjust the address register:

```text
MOVE.W -(A0), D0    ; Pre-decrement: A0 = A0 - 2, then load
MOVE.W (A0)+, D1    ; Post-increment: load, then A0 = A0 + 2
```

The adjustment amount depends on the operation size:
- Byte operations: ±1
- Word operations: ±2
- Long operations: ±4

**Pre-Decrement and Post-Increment:**

```assembly
; Setup array with post-increment
MOVE.L #$00080000, A0

; Fill array using post-increment
MOVE.W #100, (A0)+     ; Store 100, A0 += 2
MOVE.W #200, (A0)+     ; Store 200, A0 += 2  
MOVE.W #300, (A0)+     ; Store 300, A0 += 2
MOVE.W #400, (A0)+     ; Store 400, A0 += 2

; Now A0 points past the end of array
; Read back using pre-decrement
MOVE.W -(A0), D0       ; A0 -= 2, load (gets 400)
MOVE.W -(A0), D1       ; A0 -= 2, load (gets 300)
MOVE.W -(A0), D2       ; A0 -= 2, load (gets 200)
MOVE.W -(A0), D3       ; A0 -= 2, load (gets 100)
```

## Perfect for Stacks and Queues

These modes are ideal for implementing data structures:

**Stack Implementation with Pre-Decrement:**

```assembly
; Stack implementation (grows downward)
MOVE.L #$00081000, A0      ; Stack starts at high address

; Push values onto stack
MOVE.W #100, -(A0)         ; Push 100
MOVE.W #200, -(A0)         ; Push 200  
MOVE.W #300, -(A0)         ; Push 300
; Stack now: [300][200][100] <-- A0 points here

; Pop values from stack
MOVE.W (A0)+, D0           ; Pop 300
MOVE.W (A0)+, D1           ; Pop 200
MOVE.W (A0)+, D2           ; Pop 100
```

## PC-Relative Addressing

Program Counter relative addressing is useful for position-independent code:

```text
MOVE.W LABEL(PC), D0       ; Load from LABEL relative to PC
LEA    DATA_TABLE(PC), A0  ; Get address of DATA_TABLE
```

**PC-Relative Data Access:**

```assembly
; Access data relative to program counter
LEA MESSAGE_TEXT(PC), A0   ; A0 points to text
MOVE.B (A0)+, D0          ; Get first character
MOVE.B (A0)+, D1          ; Get second character

; Jump over data
BRA CONTINUE

MESSAGE_TEXT:
    DC.B 'H','e','l','l','o',0

CONTINUE:
    ; Program continues here
```

## Complex Addressing Mode Combinations

You can combine displacement with indexing for ultimate flexibility:

```text
MOVE.W 8(A0,D0.W), D1     ; Address = A0 + D0 + 8
MOVE.L -4(A1,D1.L), D2    ; Address = A1 + D1 - 4
```

**Complex Structure Array Access:**

```assembly
; Array of structures, each 10 bytes long
; Structure: X(2), Y(2), Health(4), Type(1), Level(1)
MOVE.L #$00080000, A0      ; Base of structure array

; Access element 2, field Y (offset 2 within structure)
MOVE.W #2, D0              ; Element index 2
MULU.W #10, D0             ; Each structure is 10 bytes
MOVE.W 2(A0,D0.W), D1      ; Get Y coordinate of element 2

; Access element 1, field Health (offset 4 within structure)  
MOVE.W #1, D0              ; Element index 1
MULU.W #10, D0             ; Scale to byte offset
MOVE.L 4(A0,D0.W), D2      ; Get Health of element 1
```

## Memory-Mapped Hardware Access

Advanced addressing modes are perfect for hardware programming:

**Hardware Register Access with Offsets:**

```assembly
; Amiga custom chip registers base
MOVE.L #$00DFF000, A0      ; Custom chip base address

; Access specific hardware registers
MOVE.W #$8000, $096(A0)    ; DMACON - Enable DMA
MOVE.W #$0020, $09A(A0)    ; INTENA - Enable interrupts
MOVE.W #$1200, $100(A0)    ; BPLCON0 - Bitplane control
MOVE.W #$0000, $102(A0)    ; BPLCON1 - Scroll control

; Read hardware status
MOVE.W $01E(A0), D0        ; Read INTREQR (interrupt requests)
MOVE.W $002(A0), D1        ; Read VPOSR (vertical position)
```

## Efficient String Operations

Advanced addressing modes make string processing elegant:

**String Copy with Post-Increment:**

```assembly
; String copy using post-increment addressing
MOVE.L #SOURCE_STRING, A0   ; Source address
MOVE.L #DEST_STRING, A1     ; Destination address

COPY_LOOP:
    MOVE.B (A0)+, D0        ; Get byte from source, increment A0
    MOVE.B D0, (A1)+        ; Store to dest, increment A1
    BNE COPY_LOOP           ; Continue if not zero (end of string)

; Sample data (would be elsewhere in memory)
SOURCE_STRING:
    DC.B 'Hello Amiga!',0

DEST_STRING:
    DS.B 20                 ; Reserve 20 bytes for destination
```

## Practice Exercise

Create a program that manages a simple graphics object array. Each object has:
- X coordinate (word, offset 0)
- Y coordinate (word, offset 2)
- Velocity X (word, offset 4)
- Velocity Y (word, offset 6)
- Color (word, offset 8)

Total structure size: 10 bytes

**Practice: Graphics Object Management:**

```assembly
; Graphics object array management
MOVE.L #$00080000, A0      ; Base address of object array

; Initialize object 0
MOVE.W #160, D0            ; Element index 0
MULU.W #10, D0             ; Scale to byte offset (0)
MOVE.W #100, 0(A0,D0.W)    ; X = 100
MOVE.W #50, 2(A0,D0.W)     ; Y = 50
MOVE.W #2, 4(A0,D0.W)      ; Velocity X = 2
MOVE.W #1, 6(A0,D0.W)      ; Velocity Y = 1
MOVE.W #$0F00, 8(A0,D0.W)  ; Red color

; Initialize object 1
MOVE.W #1, D0              ; Element index 1
MULU.W #10, D0             ; Scale to byte offset (10)
MOVE.W #200, 0(A0,D0.W)    ; X = 200
MOVE.W #100, 2(A0,D0.W)    ; Y = 100
MOVE.W #-1, 4(A0,D0.W)     ; Velocity X = -1
MOVE.W #2, 6(A0,D0.W)      ; Velocity Y = 2  
MOVE.W #$00F0, 8(A0,D0.W)  ; Green color

; Update object 0 position (add velocity to position)
MOVE.W #0, D0              ; Object 0
MULU.W #10, D0
MOVE.W 0(A0,D0.W), D1      ; Get current X
ADD.W 4(A0,D0.W), D1       ; Add velocity X
MOVE.W D1, 0(A0,D0.W)      ; Store new X

MOVE.W 2(A0,D0.W), D1      ; Get current Y  
ADD.W 6(A0,D0.W), D1       ; Add velocity Y
MOVE.W D1, 2(A0,D0.W)      ; Store new Y
```

## Performance Benefits

These advanced addressing modes provide significant benefits:

**Fewer Instructions**: Complex memory access in single instructions
**Hardware Optimization**: Address calculations done by CPU hardware
**Code Clarity**: More readable and maintainable code
**Memory Efficiency**: Less code space required
**Runtime Performance**: Faster execution than manual address calculation

## Common Patterns in Amiga Programming

These addressing modes appear frequently in Amiga programming:

**Hardware Register Access**: `MOVE.W #value, OFFSET(A0)` where A0 = $DFF000
**Array Processing**: `MOVE.W (A0,D0.W), D1` for indexed array access
**Structure Fields**: `MOVE.L 4(A0), D0` for accessing structure members
**Stack Operations**: `MOVE.L -(A7), D0` for stack manipulation
**String Processing**: `MOVE.B (A0)+, D0` for character-by-character access

## What You've Learned

In this lesson, you've mastered:

- Address register indirect with displacement for structure access
- Indexed addressing modes for dynamic array access
- Pre-decrement and post-increment for automatic pointer adjustment
- PC-relative addressing for position-independent code
- Complex addressing mode combinations
- Practical applications in data structures and hardware access
- Performance benefits of hardware address calculation

## Looking Ahead

In the next lesson, you'll learn about the 68000's sophisticated stack operations and subroutine mechanisms. You'll discover how to create modular, reusable code using the stack for parameter passing and local variable storage - essential skills for professional assembly programming!

## Fun Fact

The 68000's addressing modes were so well-designed that they influenced the development of high-level programming languages! Many C compilers could generate extremely efficient code because the 68000's addressing modes mapped naturally to C language constructs like arrays (`array[index]`), structures (`struct.field`), and pointers (`*pointer++`). This made the 68000 popular not just with assembly programmers, but with C programmers who wanted the best possible performance from their compiled code!