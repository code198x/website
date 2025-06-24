---
title: "Meet the 68000 Processor"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 1
description: "Your first encounter with the heart of the Amiga - the powerful Motorola 68000 processor. Learn about registers, memory, and write your first professional assembly instruction."
learning_objectives:
  - "Understand what the 68000 processor is and why it powers the Amiga"
  - "Learn about the data registers: D0-D7 and address registers: A0-A7"
  - "Understand how the Amiga's memory and custom chips work together"
  - "Write your first 68000 assembly instruction"
  - "See how assembly relates to professional programming"
concepts:
  - "68000 processor architecture"
  - "Data registers (D0-D7)"
  - "Address registers (A0-A7)"
  - "16-bit and 32-bit operations"
  - "Assembly language vs machine language"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 1
---

# Lesson 1: Meet the 68000 Processor

Welcome to the world of professional programming with the Motorola 68000! Today, you'll meet the processor that made the Amiga revolutionary - a 16/32-bit powerhouse that brought workstation-class computing to home users. Throughout this tier, you'll work toward creating **Copper Dreams** - an impressive multimedia game that showcases the Amiga's unique capabilities through 68000 assembly programming.

## What Is the 68000?

The Motorola 68000 (often called "68k") is the sophisticated processor that powers your Amiga. Unlike the simpler 8-bit processors in other home computers, the 68000 was designed for professional workstations and brought that power to the Amiga.

The 68000 made the Amiga special because:
- **16/32-bit architecture**: Much more powerful than 8-bit competitors
- **Linear memory model**: Can directly address 16MB of memory
- **Sophisticated instruction set**: Rich, orthogonal design for complex operations
- **Professional capabilities**: Features found in expensive workstations
- **Advanced addressing modes**: Flexible and powerful memory access

The 68000 powered many revolutionary systems:
- Commodore Amiga (all models)
- Apple Macintosh (early models)
- Atari ST
- Sun workstations
- NeXT computers

## The 68000's Register Architecture

The 68000 has a much richer register set than simpler processors, giving you tremendous programming flexibility:

### Data Registers (D0-D7)
- **Purpose**: Store data, perform arithmetic, logical operations
- **Size**: 32 bits each (can hold values 0-4,294,967,295)
- **Usage**: Can be used as 8-bit, 16-bit, or 32-bit values
- **Think of them as**: Your arithmetic and data manipulation workbench

### Address Registers (A0-A7)
- **Purpose**: Hold memory addresses, pointers to data structures
- **Size**: 32 bits each (can address 16MB of memory)
- **Special feature**: A7 is the Stack Pointer (SP)
- **Usage**: Point to memory locations, build complex data structures
- **Think of them as**: Your memory navigation system

### The 68000's Flexibility

What makes the 68000 special is its **orthogonal design** - almost any instruction can work with any register in multiple sizes:

```text
MOVE.B #$41, D0    ; Move byte (8-bit) $41 into D0
MOVE.W #$1234, D1  ; Move word (16-bit) $1234 into D1  
MOVE.L #$12345678, D2  ; Move long (32-bit) $12345678 into D2
```

## Size Specifications in 68000 Assembly

The 68000 lets you specify the size of operations:
- **.B** = Byte (8 bits, 0-255)
- **.W** = Word (16 bits, 0-65535) 
- **.L** = Long (32 bits, 0-4,294,967,295)

This flexibility is revolutionary compared to 8-bit processors!

## Your First 68000 Assembly Instruction

Let's start with the fundamental instruction - moving data:

```text
MOVE.W #$1234, D0
```

This instruction means:
- **MOVE**: Transfer data
- **.W**: Work with 16-bit word size
- **#$1234**: The immediate value $1234 (4660 in decimal)
- **D0**: Into data register 0

<CodeRunner 
  system="commodore-amiga"
  title="Your First 68000 Assembly Instruction"
  code="MOVE.W #$1234, D0"
  autoRun={false}
  language="assembly"
/>

## Different Sizes, Same Register

The 68000's power shows when you use different sizes with the same register:

```text
MOVE.L #$12345678, D0  ; Load 32-bit value into D0
MOVE.W #$ABCD, D0      ; Changes lower 16 bits, D0 = $1234ABCD
MOVE.B #$EF, D0        ; Changes lower 8 bits, D0 = $1234ABEF
```

<CodeRunner 
  system="commodore-amiga"
  title="Different Sizes with Same Register"
  code="MOVE.L #$12345678, D0  ; 32-bit: D0 = $12345678
MOVE.W #$ABCD, D0      ; 16-bit: D0 = $1234ABCD  
MOVE.B #$EF, D0        ; 8-bit:  D0 = $1234ABEF"
  language="assembly"
/>

This flexibility allows precise control over data manipulation!

## Using Multiple Data Registers

You can work with all eight data registers simultaneously:

```text
MOVE.W #$1000, D0    ; Graphics X coordinate
MOVE.W #$0080, D1    ; Graphics Y coordinate  
MOVE.W #$001F, D2    ; Color value (red)
MOVE.L #$12345, D3   ; 32-bit counter
MOVE.B #$FF, D4      ; Byte flag (255 = on)
```

<CodeRunner 
  system="commodore-amiga"
  title="Using Multiple Data Registers"
  code="MOVE.W #$1000, D0    ; X coordinate = 4096
MOVE.W #$0080, D1    ; Y coordinate = 128
MOVE.W #$001F, D2    ; Red colour = 31
MOVE.L #$12345, D3   ; Counter = 74565
MOVE.B #$FF, D4      ; Flag = 255 (on)"
  language="assembly"
/>

## Address Registers for Memory

Address registers are designed to hold memory addresses:

```text
MOVE.L #$000C0000, A0    ; Point to graphics memory
MOVE.L #$00DFF000, A1    ; Point to custom chip registers
MOVE.L #$00080000, A2    ; Point to program data
```

<CodeRunner 
  system="commodore-amiga"
  title="Address Registers for Memory Pointers"
  code="MOVE.L #$000C0000, A0    ; Graphics memory address
MOVE.L #$00DFF000, A1    ; Custom chips address  
MOVE.L #$00080000, A2    ; Program data address"
  language="assembly"
/>

These addresses point to important areas in Amiga memory!

## Working with Memory Through Address Registers

The real power comes when you use address registers to access memory:

```text
MOVE.L #$000C0000, A0    ; Point A0 to graphics memory
MOVE.W #$0F00, (A0)      ; Store $0F00 at the memory A0 points to
```

The `(A0)` syntax means "the memory location that A0 points to" - this is **indirect addressing**!

<CodeRunner 
  system="commodore-amiga"
  title="Indirect Memory Access"
  code="MOVE.L #$000C0000, A0    ; A0 points to graphics memory
MOVE.W #$0F00, (A0)      ; Store value at memory location A0 points to"
  language="assembly"
/>

## Moving Data Between Registers

The 68000 can move data between any registers:

```text
MOVE.L D0, D1      ; Copy D0 into D1 (32-bit)
MOVE.W D2, D3      ; Copy lower 16 bits of D2 into D3
MOVE.L A0, D4      ; Copy address from A0 into D4
MOVE.L D5, A1      ; Copy data from D5 into address register A1
```

<CodeRunner 
  system="commodore-amiga"
  title="Moving Data Between Registers"
  code="; Setup some values first
MOVE.L #$12345678, D0
MOVE.W #$ABCD, D2  
MOVE.L #$C0000, A0

; Now copy between registers
MOVE.L D0, D1      ; Copy D0 to D1
MOVE.W D2, D3      ; Copy D2 to D3 (16-bit)
MOVE.L A0, D4      ; Copy address to data register"
  language="assembly"
/>

## Assembly vs Machine Language

Like other processors, the 68000 assembler converts your human-readable code to machine language:

```text
MOVE.W #$1234, D0
```

Becomes machine code:
```
303C 1234
```

But the 68000's complex instructions can generate much more sophisticated machine code than simpler processors!

## Professional Programming Concepts

The 68000 introduces professional programming concepts:

**Orthogonal design**: Most instructions work with most registers and addressing modes
**Multiple data sizes**: Byte, word, and long operations in the same program
**Rich addressing modes**: Many ways to access memory efficiently  
**Large address space**: Can work with megabytes of memory
**Structured programming support**: Features that support modern programming techniques

## Practice Exercise

Create a program that demonstrates the 68000's capabilities:

1. Load a 32-bit graphics coordinate into D0 ($00100080 = X=256, Y=128)
2. Load a 16-bit colour value into D1 ($0F00 = bright red)
3. Load the graphics memory address into A0 ($C0000)
4. Copy the coordinate to D2
5. Copy the colour to D3
6. Store the coordinate at the graphics memory location

<CodeRunner 
  system="commodore-amiga"
  title="Practice Exercise - Graphics Programming Setup"
  code="; Graphics programming example
MOVE.L #$00100080, D0    ; X=256, Y=128 coordinates
MOVE.W #$0F00, D1        ; Bright red colour
MOVE.L #$000C0000, A0    ; Graphics memory address

; Copy values between registers  
MOVE.L D0, D2            ; Copy coordinates
MOVE.W D1, D3            ; Copy colour

; Store coordinate at graphics memory
MOVE.L D0, (A0)          ; Store coordinates to graphics memory"
  language="assembly"
/>

## Why the 68000 Was Revolutionary

The 68000 brought workstation power to home computers:

**32-bit internal architecture**: While external bus was 16-bit, internal processing was 32-bit
**16MB address space**: Huge compared to 64KB limits of 8-bit computers
**Sophisticated instruction set**: Hundreds of powerful instructions
**Professional development**: Support for structured programming and complex applications
**Linear memory model**: No complex memory banking or segmentation

## What You've Learned

In this foundational lesson, you've discovered:

- The 68000 processor brings professional workstation power to the Amiga
- Eight data registers (D0-D7) for arithmetic and data manipulation
- Eight address registers (A0-A7) for memory addressing and pointers
- Size specifications (.B, .W, .L) for byte, word, and long operations
- Your first assembly instruction: MOVE
- Indirect addressing through address registers
- The relationship between assembly and machine language
- Professional programming concepts in hardware

## Looking Ahead

In the next lesson, you'll learn how to store data to Amiga memory and work with the custom chips that make the Amiga special. You'll see how the 68000's power combines with the Amiga's revolutionary hardware architecture!

## Fun Fact

The Motorola 68000 was so well-designed that it influenced processor development for decades! Its clean, orthogonal instruction set became the model for RISC processors, and its 32-bit capabilities were so advanced that early Macintosh and Amiga programs could run unmodified on much later 68000-family processors. The 68000 was designed to be a "programmer's processor" - and you're about to discover why programmers loved working with it!