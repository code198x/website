---
title: "Z80 Registers and Memory Basics"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 2
description: "Learn how to store data from Z80 registers into memory using LD instructions, and understand how the Z80 moves data between the processor and memory on the ZX Spectrum."
learning_objectives:
  - "Learn the LD instruction for storing data in memory"
  - "Understand how memory addresses work on the ZX Spectrum"
  - "Learn about Z80 register pairs and 16-bit addressing"
  - "Practice moving data between registers and memory"
  - "See your first visible output on the ZX Spectrum screen"
concepts:
  - "LD (Load) instruction variations"
  - "Memory addressing on the ZX Spectrum"
  - "Z80 register pairs (HL, DE, BC)"
  - "Screen memory ($4000)"
  - "Data flow between Z80 and memory"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 2
---

# Lesson 2: Z80 Registers and Memory Basics

In the last lesson, you met the Z80 processor. Today, you'll learn how to move data between the Z80's registers and memory, and see your first visible result on the ZX Spectrum screen!

## From Z80 Registers to Memory

Remember how the Z80 has registers like the processor's workspace? Well, memory is like the processor's filing cabinet - a place to store information for later use. The Z80 constantly moves data between registers and memory to accomplish tasks.

The **LD** instruction loads and stores data in the Z80. Unlike other processors, the Z80 uses the same LD instruction for both loading and storing:

```text
LD A, $41       ; Load value $41 into the A register
LD ($4000), A   ; Store A register contents into memory location $4000
```

Notice the parentheses around `($4000)` - this tells the Z80 to store **at the address** $4000, not store the value $4000 itself.

## ZX Spectrum Memory Layout

Every byte of memory in the ZX Spectrum has a unique address. The ZX Spectrum has a special memory layout optimised for graphics and system operation:

- **$0000-$3FFF**: ROM (16K) - Contains the BASIC interpreter and system routines
- **$4000-$57FF**: Screen memory (6K) - What you see on the display
- **$5800-$5AFF**: Attribute memory (768 bytes) - Colour information
- **$5B00-$FFFF**: User RAM (about 42K) - Your programs and data

When you write `LD ($4000), A`, you're telling the Z80: "Take whatever is in the A register and store it at memory address $4000" - which happens to be the top-left corner of the screen!

## Your First ZX Spectrum Assembly Program

Let's write a program that puts a character on the ZX Spectrum screen:

**First Z80 Memory Storage:**

```assembly
; Your first Z80 assembly program that stores data in memory
; This program puts a character on the ZX Spectrum screen

FirstMemoryProgram:
    ; Load a character value into the A register
    LD A, $81           ; Character code $81 (inverted space - a block)
    
    ; Store it at the top-left of the screen
    LD ($4000), A       ; Put character at screen position 0,0
    
    ; Load a different character
    LD A, $82           ; Character code $82 (different pattern)
    
    ; Store it next to the first character
    LD ($4001), A       ; Put character at screen position 1,0
    
    ; Let's add some colour information
    LD A, %01000010     ; Binary: bright red on black
    LD ($5800), A       ; Store colour for position 0,0
    
    LD A, %00100001     ; Binary: green on black  
    LD ($5801), A       ; Store colour for position 1,0
    
    ; End the program
    RET
```

Run this program and you'll see two coloured blocks appear at the top-left of the ZX Spectrum screen!

## Understanding Z80 Memory Instructions

The Z80 has several ways to store data in memory:

### Direct Memory Storage
```text
LD A, $42           ; Load value into A register
LD ($4000), A       ; Store A at memory address $4000
```

### Using Register Pairs as Pointers
The Z80's register pairs (HL, DE, BC) can hold 16-bit addresses:

```text
LD HL, $4000        ; Load address $4000 into HL register pair
LD A, $43           ; Load value into A
LD (HL), A          ; Store A at the address in HL (i.e., $4000)
```

### Storing Register Pairs
You can also store 16-bit register pairs in memory:

```text
LD HL, $1234        ; Load 16-bit value into HL
LD ($5C00), HL      ; Store HL at memory address $5C00 (2 bytes)
```

## ZX Spectrum Screen Memory

The ZX Spectrum screen is organised in a unique way:

- **Character positions**: 32 columns × 24 rows = 768 characters
- **Screen memory**: Starts at $4000, each byte represents one character
- **Attribute memory**: Starts at $5800, each byte controls colour for one character position

**ZX Spectrum Screen Memory Demo:**

```assembly
; Demonstration of ZX Spectrum screen memory organisation
; This program draws a pattern across the top of the screen

ScreenMemoryDemo:
    ; Set up HL to point to screen memory start
    LD HL, $4000        ; Screen memory begins at $4000
    
    ; Draw a line of characters across the top
    LD B, 32            ; 32 characters across the screen
    LD A, $8F           ; Character pattern (filled block)
    
DrawLoop:
    LD (HL), A          ; Put character at current position
    INC HL              ; Move to next screen position
    DJNZ DrawLoop       ; Decrement B and jump if not zero
    
    ; Now set colours for these characters
    LD HL, $5800        ; Attribute memory begins at $5800
    LD B, 32            ; 32 colour attributes to set
    LD A, %01110000     ; Bright white on black
    
ColourLoop:
    LD (HL), A          ; Set colour for current position
    INC HL              ; Move to next colour position
    DJNZ ColourLoop     ; Decrement B and jump if not zero
    
    RET
```

## Z80 Register Pairs Explained

The Z80's 16-bit register pairs are powerful for memory operations:

### HL Register Pair
- **Most commonly used** for memory addressing
- Can be incremented/decremented as a unit
- Many instructions work directly with HL

```text
LD HL, $4020        ; Point to screen memory
LD A, $FF           ; Load pattern
LD (HL), A          ; Store at address in HL
INC HL              ; Move to next memory location
LD (HL), A          ; Store at new address
```

### DE and BC Register Pairs
- **DE**: Often used as destination for block operations
- **BC**: Often used as counter for loops

```text
LD BC, $0008        ; Set up 8-byte counter
LD HL, $4000        ; Source address
LD DE, $4100        ; Destination address
; (Block copy operations would use these)
```

## Memory Access Patterns

### Sequential Access
Moving through memory one byte at a time:

```text
LD HL, $4000        ; Start of screen memory
LD B, 10            ; Loop counter

FillLoop:
    LD (HL), $AA        ; Store pattern
    INC HL              ; Next memory location
    DJNZ FillLoop       ; Continue until B = 0
```

### Calculated Addresses
Using arithmetic to determine memory locations:

```text
LD A, 5             ; Row number
LD H, A             ; Put in H register
LD L, 10            ; Column number
; HL now contains calculated screen position
LD (HL), $42        ; Store character
```

**Memory Access Patterns:**

```assembly
; Demonstrating different ways to access ZX Spectrum memory
; This program shows sequential and calculated memory access

MemoryAccessDemo:
    ; Sequential access - fill a row
    LD HL, $4000        ; Start of screen
    LD B, 16            ; Fill 16 characters
    LD A, $85           ; Character pattern
    
SequentialFill:
    LD (HL), A          ; Store character
    INC HL              ; Next position
    INC A               ; Next character pattern
    DJNZ SequentialFill ; Continue loop
    
    ; Calculated access - put characters at specific positions
    LD HL, $4020        ; Screen position (row 1, column 0)
    LD A, $41           ; Character 'A'
    LD (HL), A          ; Store 'A'
    
    LD HL, $4025        ; Screen position (row 1, column 5)  
    LD A, $42           ; Character 'B'
    LD (HL), A          ; Store 'B'
    
    LD HL, $402A        ; Screen position (row 1, column 10)
    LD A, $43           ; Character 'C'
    LD (HL), A          ; Store 'C'
    
    ; Set colours for these characters
    LD HL, $5820        ; Corresponding attribute positions
    LD A, %00000010     ; Red characters
    LD (HL), A          ; Colour for 'A'
    
    LD HL, $5825
    LD A, %00000100     ; Magenta characters  
    LD (HL), A          ; Colour for 'B'
    
    LD HL, $582A
    LD A, %00000110     ; Yellow characters
    LD (HL), A          ; Colour for 'C'
    
    RET
```

## Key Z80 Memory Concepts

### 1. The LD Instruction is Versatile
Unlike many processors, the Z80 uses LD for both loading and storing:
- `LD A, value` - Load value into A
- `LD (address), A` - Store A at address
- `LD A, (address)` - Load from address into A

### 2. Register Pairs are Powerful
16-bit register pairs make memory addressing efficient:
- HL is the most useful for memory operations
- Can be incremented/decremented as units
- Many special instructions work with register pairs

### 3. ZX Spectrum Memory Layout
Understanding the memory map is crucial:
- Screen memory starts at $4000
- Attribute memory starts at $5800
- User RAM is available from $5B00 upwards

## Practice Exercise

Try this exercise to reinforce your understanding:

**Memory Practice Exercise:**

```assembly
; Practice Exercise: Create a simple pattern on screen
; Try modifying this program to create different patterns

PracticeExercise:
    ; Your task: Create a chequerboard pattern in the top-left corner
    ; Use two different character codes to create the pattern
    
    ; Character 1: Empty space
    LD A, $20           ; Space character
    LD ($4000), A       ; Position 0,0
    LD ($4002), A       ; Position 2,0
    LD ($4021), A       ; Position 1,1
    LD ($4023), A       ; Position 3,1
    
    ; Character 2: Filled block
    LD A, $8F           ; Block character
    LD ($4001), A       ; Position 1,0
    LD ($4003), A       ; Position 3,0
    LD ($4020), A       ; Position 0,1
    LD ($4022), A       ; Position 2,1
    
    ; Add some colour
    LD HL, $5800        ; Start of attributes
    LD B, 8             ; Set colour for 8 positions
    LD A, %01000111     ; Bright white on black
    
ColourSetter:
    LD (HL), A          ; Set colour
    INC HL              ; Next attribute
    DJNZ ColourSetter   ; Continue loop
    
    RET
    
; Challenge: Can you modify this to create a larger pattern?
; Try using loops to make the code more efficient!
```

## What You've Learned

In this lesson, you've discovered:

1. **Z80 Memory Storage** - How to store register contents in memory using LD instructions
2. **ZX Spectrum Memory Layout** - Screen memory, attribute memory, and user RAM locations
3. **Register Pairs** - How HL, DE, and BC provide powerful 16-bit addressing
4. **Memory Access Patterns** - Sequential and calculated memory access techniques
5. **Visible Results** - How to create output on the ZX Spectrum screen

## Looking Ahead

Next, you'll learn about Z80 addressing modes - the different ways the Z80 can access memory and data. You'll discover how these addressing modes make the Z80 one of the most flexible 8-bit processors ever created!

## Fun Fact

The ZX Spectrum's unique screen memory layout was designed to save memory and improve performance. By separating character data and colour attributes, Sinclair managed to create full-colour graphics using only 6.75KB of memory - compared to the 16KB that would be needed for a conventional bitmap display. This clever engineering allowed the ZX Spectrum to have colourful graphics while keeping costs low and leaving maximum memory for programs!