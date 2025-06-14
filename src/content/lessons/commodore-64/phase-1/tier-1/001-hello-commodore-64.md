---
title: "Meet the 6502 Processor"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 1
description: "Your first encounter with the heart of the Commodore 64 - the 6502 processor. Learn about registers, memory, and write your first assembly language instruction."
learning_objectives:
  - "Understand what the 6502 processor is and why it's important"
  - "Learn about the three main registers: A, X, and Y"
  - "Understand how memory addresses work in the C64"
  - "Write your first assembly instruction"
  - "See how assembly relates to machine language"
concepts:
  - "6502 processor architecture"
  - "Registers (A, X, Y)"
  - "Memory addresses"
  - "Assembly language vs machine language"
  - "Hexadecimal notation"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 1
---

# Lesson 1: Meet the 6502 Processor

Welcome to the world of 6502 assembly language programming! Today, you'll meet the beating heart of your Commodore 64 - the 6502 processor - and learn how to speak its native language.

## What Is the 6502?

The 6502 is the brain of your Commodore 64. While BASIC programs tell the computer *what* to do, assembly language tells the 6502 processor *exactly how* to do it. When you write assembly, you're programming at the hardware level - the same level that all software ultimately becomes.

The 6502 was revolutionary in 1975 and powered incredible machines like:
- Apple II
- Commodore 64
- Nintendo Entertainment System
- BBC Micro

## The 6502's Registers

Think of registers as the processor's hands - they hold the data it's currently working with. The 6502 has three main registers you'll use constantly:

### The A Register (Accumulator)
- **Purpose**: The main workhorse for arithmetic and data manipulation
- **Size**: 8 bits (can hold values 0-255)
- **Think of it as**: The processor's primary hand

### The X Register (Index Register)
- **Purpose**: Used for counting and indexing through memory
- **Size**: 8 bits (can hold values 0-255)  
- **Think of it as**: A counter or pointer

### The Y Register (Index Register)
- **Purpose**: Similar to X, used for counting and indexing
- **Size**: 8 bits (can hold values 0-255)
- **Think of it as**: A second counter or pointer

## Memory in the C64

The Commodore 64 has 64KB of memory, addressed from $0000 to $FFFF (hexadecimal). Key memory locations include:

- **$0000-$00FF**: Zero Page (special fast memory)
- **$0400-$07E7**: Screen memory (what you see on screen)
- **$D000-$DFFF**: I/O registers (hardware control)
- **$A000-$BFFF**: BASIC ROM
- **$E000-$FFFF**: KERNAL ROM

*Note: The $ symbol means hexadecimal (base 16) - we'll learn more about this soon!*

## Your First Assembly Instruction

Let's start with the most basic instruction - loading a value into the A register:

```text
LDA #$41
```

This instruction means:
- **LDA**: Load the A register
- **#**: The next value is immediate (a literal number)
- **$41**: The hexadecimal value 41 (which equals 65 in decimal)

## Interactive Example: Your First Assembly Instruction

Let's see this instruction in action! The interactive example below shows the code, runs it in a real C64 emulator, and visualizes what happens to the processor registers.

## What Just Happened?

When you execute `LDA #$41`, the processor:
1. Takes the value $41 (65 in decimal)
2. Stores it in the A register
3. The A register now contains the value 65

In the ASCII character system, 65 is the letter 'A' - so we've loaded the letter 'A' into the A register!

## Hexadecimal - The Language of Computers

You'll notice assembly uses hexadecimal (hex) numbers with the $ prefix. Hex uses digits 0-9 and letters A-F:

```
Decimal:    0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
Hex:        0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F
```

Common hex values you'll see:
- **$00**: 0 (minimum 8-bit value)
- **$FF**: 255 (maximum 8-bit value)  
- **$41**: 65 (letter 'A')
- **$48**: 72 (letter 'H')

## More Register Examples

Try these instructions to load different values:

```text
LDA #$48    ; Load 'H' into A register
LDX #$05    ; Load 5 into X register  
LDY #$0A    ; Load 10 into Y register
```

## Interactive Example: Loading Different Registers

Try this example that loads values into all three main registers:

*Note: The semicolon (;) starts a comment - text that explains the code but doesn't execute.*

## Assembly vs Machine Language

Here's something fascinating: assembly language is actually a human-readable version of machine language. When you write:

```text
LDA #$41
```

The assembler converts it to machine language bytes:
```
A9 41
```

- **A9**: The machine code for "LDA immediate"
- **41**: The value to load

The processor only understands these raw bytes - assembly is just a friendlier way for humans to write them!

## Practice Exercise

Now it's your turn! Write assembly instructions to:

1. Load the value for letter 'C' into the A register (hint: 'C' is $43)
2. Load the number 15 into the X register (hint: 15 is $0F)
3. Load the number 255 into the Y register (hint: 255 is $FF)

## Interactive Example: Practice Exercise

Try this practice exercise - notice how the register values change as each instruction executes:

## What You've Learned

In this foundational lesson, you've discovered:

- The 6502 processor is the brain of the Commodore 64
- The three main registers: A (accumulator), X and Y (index registers)
- How memory is organised in the C64
- Your first assembly instruction: LDA (Load A register)
- How hexadecimal notation works
- The relationship between assembly and machine language

## Want to Code Along?

Ready to try assembly programming yourself? Download our **professional development environment** that includes:

- 🛠️ **Authentic assemblers** (CA65, ACME) used by real C64 developers
- 💻 **VS Code integration** with one-click builds and debugging
- 📚 **16 example programs** from Hello World to advanced demos
- 🎮 **Emulator launchers** to test your programs instantly

**[⬇️ Download Development Environment](/download)** - Set up in 30 seconds!

Or continue with our **interactive lessons** right here in your browser.

## Looking Ahead

In the next lesson, you'll learn how to store values from registers into memory using the STA (Store A) instruction, and see how data moves between the processor and memory - the foundation of all computing!

## Fun Fact

The 6502 processor in your C64 runs at approximately 1 MHz - that's about 1 million operations per second. By comparison, a modern smartphone processor runs at over 2,000 MHz (2+ billion operations per second). Yet the 6502 was powerful enough to run entire operating systems, games, and applications that people still love today!