---
title: "Memory Addressing Fundamentals"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 9
description: "Learn how the Z80 processor accesses memory using different addressing modes. Understand direct, indirect, and indexed addressing to manipulate data in memory."
learning_objectives:
  - "Understand what memory addressing means"
  - "Learn direct addressing with absolute memory addresses"
  - "Master indirect addressing using register pairs"
  - "Practice loading and storing data in memory"
  - "See how addressing modes affect code efficiency"
concepts:
  - "Memory addressing modes"
  - "Direct (absolute) addressing"
  - "Indirect addressing with HL"
  - "Loading from memory (LD A,(HL))"
  - "Storing to memory (LD (HL),A)"
estimated_duration: "35-45 minutes"
difficulty: "easy-medium"
code_examples: true
practical_exercise: true
order: 9
---

# Lesson 9: Memory Addressing Fundamentals

In previous lessons, you've worked with registers - the Z80's built-in storage locations. Now you'll learn how to access the ZX Spectrum's memory, where you can store much larger amounts of data. This is where the real power of assembly programming begins!

## What Is Memory Addressing?

Memory addressing is how the processor tells the difference between the thousands of memory locations in your ZX Spectrum. Think of memory like a giant filing cabinet where:

- Each drawer has a unique **address** (like $5000, $5001, $5002...)
- Each drawer can hold one **byte** of data (0-255)
- The processor needs to know which drawer to open

The Z80 uses a 16-bit address bus, meaning it can access 65,536 different memory locations (addresses $0000 to $FFFF).

## ZX Spectrum Memory Layout Review

Let's refresh the ZX Spectrum memory map:

```
$0000-$3FFF: ROM (16KB) - Operating system, can't write here
$4000-$57FF: Screen memory (6KB) - what appears on screen  
$5800-$5AFF: Attribute memory (768 bytes) - screen colors
$5B00-$FFFF: RAM - your programs and data live here
```

Most of your data manipulation will happen in the RAM area ($5B00 and above).

## Direct (Absolute) Addressing

The simplest way to access memory is **direct addressing** - you specify the exact memory address:

```text
LD A, ($5B00)    ; Load the byte at address $5B00 into A register
LD ($5B01), A    ; Store A register into address $5B01
```

<CodeRunner 
  system="zx-spectrum"
  title="Direct Memory Access"
  code="LD A, $42        ; Load value $42 into A
LD ($5B00), A    ; Store A into memory address $5B00
LD B, ($5B00)    ; Load from $5B00 into B register
; Now both A and B contain $42"
  language="assembly"
/>

## Indirect Addressing with HL

Direct addressing works, but it's not very flexible. **Indirect addressing** lets you use a register pair to point to memory:

```text
LD HL, $5B00     ; HL points to address $5B00
LD A, (HL)       ; Load the byte that HL points to
LD (HL), $33     ; Store $33 into the address HL points to
```

<CodeRunner 
  system="zx-spectrum"
  title="Indirect Addressing with HL"
  code="LD HL, $5B00     ; Point HL to memory address $5B00
LD A, $77        ; Load $77 into A register
LD (HL), A       ; Store A into the memory address HL points to
LD B, (HL)       ; Load back from memory into B
; Now memory[$5B00] = $77, and B = $77"
  language="assembly"
/>

The parentheses `(HL)` mean "the memory location that HL points to", not the HL register itself.

## Why Use Indirect Addressing?

Indirect addressing is incredibly powerful because you can change where HL points:

```text
LD HL, $5B00     ; Point to first memory location
LD (HL), $41     ; Store 'A' there
INC HL           ; Move HL to next memory location ($5B01)
LD (HL), $42     ; Store 'B' there
INC HL           ; Move to $5B02
LD (HL), $43     ; Store 'C' there
```

<CodeRunner 
  system="zx-spectrum"
  title="Moving Through Memory"
  code="LD HL, $5B00     ; Start at $5B00
LD (HL), $41     ; Store 'A' at $5B00
INC HL           ; HL now points to $5B01
LD (HL), $42     ; Store 'B' at $5B01  
INC HL           ; HL now points to $5B02
LD (HL), $43     ; Store 'C' at $5B02
; Memory now contains: $5B00='A', $5B01='B', $5B02='C'"
  language="assembly"
/>

This creates a string "ABC" in memory!

## Using Other Register Pairs

While HL is most common for memory access, you can also use BC and DE register pairs:

```text
LD BC, $5B10     ; Point BC to $5B10
LD A, (BC)       ; Load from address BC points to
LD DE, $5B20     ; Point DE to $5B20  
LD A, (DE)       ; Load from address DE points to
```

<CodeRunner 
  system="zx-spectrum"
  title="Using BC and DE for Memory Access"
  code="LD BC, $5B10     ; BC points to $5B10
LD A, $88        ; Load $88 into A
LD (BC), A       ; Store A at address BC points to

LD DE, $5B20     ; DE points to $5B20
LD A, $99        ; Load $99 into A  
LD (DE), A       ; Store A at address DE points to
; Memory $5B10 = $88, Memory $5B20 = $99"
  language="assembly"
/>

## Building a Simple Data Table

Let's create a small data table in memory and read it back:

```text
; First, store some data
LD HL, $5B50     ; Point to our data area
LD (HL), $10     ; Store 16
INC HL
LD (HL), $20     ; Store 32  
INC HL
LD (HL), $30     ; Store 48

; Now read it back
LD HL, $5B50     ; Point back to start
LD A, (HL)       ; Load first value (16)
INC HL  
LD B, (HL)       ; Load second value (32)
INC HL
LD C, (HL)       ; Load third value (48)
```

<CodeRunner 
  system="zx-spectrum"
  title="Data Table Example"
  code="; Create a table of values
LD HL, $5B50     ; Point to our data area
LD (HL), $10     ; Store 16 at $5B50
INC HL           ; Move to $5B51  
LD (HL), $20     ; Store 32 at $5B51
INC HL           ; Move to $5B52
LD (HL), $30     ; Store 48 at $5B52

; Read back the data
LD HL, $5B50     ; Point back to start of table
LD A, (HL)       ; A = 16
INC HL
LD B, (HL)       ; B = 32  
INC HL
LD C, (HL)       ; C = 48
; Now A=16, B=32, C=48"
  language="assembly"
/>

## Memory Access Patterns

Understanding common patterns helps you write efficient code:

### Sequential Access (like reading a string)
```text
LD HL, $5B60     ; Point to start of data
LD A, (HL)       ; Read first byte
INC HL           ; Move to next
LD B, (HL)       ; Read second byte
INC HL           ; Move to next
LD C, (HL)       ; Read third byte
```

### Direct Access (when you know exact addresses)
```text
LD A, ($5B60)    ; Read specific location
LD B, ($5B70)    ; Read another specific location
LD C, ($5B80)    ; Read third specific location
```

### Calculated Access (using register math)
```text
LD HL, $5B60     ; Base address
LD DE, $0010     ; Offset (16 bytes)
ADD HL, DE       ; HL now points to $5B70
LD A, (HL)       ; Read from calculated address
```

## Touching Screen Memory

Let's try something visual - putting a character directly into screen memory:

```text
LD HL, $4000     ; Point to start of screen memory
LD A, %11111111  ; All pixels on (a solid block)
LD (HL), A       ; Put it on screen
```

<CodeRunner 
  system="zx-spectrum"
  title="Direct Screen Access"
  code="LD HL, $4000     ; Point to top-left of screen
LD A, %11010110  ; Create a pattern
LD (HL), A       ; Draw it on screen
INC HL           ; Move to next screen position
LD A, %10111011  ; Different pattern
LD (HL), A       ; Draw second pattern
; You should see two pattern blocks on screen!"
  language="assembly"
/>

*Note: `%` prefix means binary notation - each bit represents a pixel*

## Common Memory Addressing Mistakes

**Forgetting parentheses:**
```text
LD A, HL         ; Wrong! This won't work
LD A, (HL)       ; Correct! Load from memory HL points to
```

**Mixing up storage direction:**
```text
LD ($5B00), (HL) ; Wrong! Can't store memory to memory
LD A, (HL)       ; Correct! Load to register first
LD ($5B00), A    ; Then store register to memory
```

**Using 8-bit registers for addresses:**
```text
LD A, $5B        ; Wrong! A can't hold full 16-bit address
LD HL, $5B00     ; Correct! Use 16-bit register pair
```

## Practice Exercise

Create a program that:

1. Stores your initials (as ASCII values) in memory starting at $5C00
2. Reads them back into different registers
3. Stores them in screen memory to display them

Hint: Use these ASCII values:
- 'A' = $41, 'B' = $42, 'C' = $43... 'Z' = $5A

<CodeRunner 
  system="zx-spectrum"
  title="Practice Exercise - Your Initials"
  code="; Store initials in memory (example: 'SH')
LD HL, $5C00     ; Point to storage area
LD (HL), $53     ; Store 'S' 
INC HL
LD (HL), $48     ; Store 'H'

; Read them back
LD HL, $5C00     ; Point back to storage
LD A, (HL)       ; Load 'S' into A
INC HL  
LD B, (HL)       ; Load 'H' into B

; Display on screen
LD HL, $4000     ; Point to screen
LD (HL), A       ; Display first initial
INC HL
LD (HL), B       ; Display second initial
; Modify this with your own initials!"
  language="assembly"
/>

## Why Memory Addressing Matters

Memory addressing is fundamental to all programming:

- **Data structures** like arrays and strings are built with memory addressing
- **Graphics programming** requires direct screen memory access
- **File I/O** involves reading data from memory buffers
- **Operating systems** manage memory addressing for all programs

## What You've Learned

In this essential lesson, you've mastered:

- How memory addressing works in the Z80
- Direct addressing with absolute addresses like `($5B00)`
- Indirect addressing using register pairs like `(HL)`
- Moving through memory with INC HL
- Creating simple data tables in memory
- Accessing screen memory for graphics
- Common addressing patterns and mistakes to avoid

## Looking Ahead

Next, you'll learn about **indexed addressing** - an even more powerful way to access memory using offsets and calculations. This will let you create dynamic data structures and more sophisticated programs!

## Fun Fact

The Z80's flexible addressing modes were one of its greatest advantages over simpler processors. While some processors could only access memory in very limited ways, the Z80's multiple addressing modes made it possible to write efficient compilers, operating systems, and complex games. The ability to use any register pair for memory access, combined with powerful instructions like INC HL and ADD HL,DE, made the Z80 a favorite for systems programmers throughout the 1980s!