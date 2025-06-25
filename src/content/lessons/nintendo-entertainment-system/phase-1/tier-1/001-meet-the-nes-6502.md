---
title: "Meet the NES 6502"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 1
description: "Your first encounter with the heart of the Nintendo Entertainment System - the 6502 processor. Learn about registers, memory-mapped I/O, and write your first assembly instruction for game development."
learning_objectives:
  - "Understand what the 6502 processor is and why it powers the NES"
  - "Learn about the three main registers: A, X, and Y"
  - "Understand NES memory organisation and memory-mapped I/O"
  - "Write your first assembly instruction"
  - "See how assembly relates to game programming"
concepts:
  - "6502 processor architecture"
  - "Registers (A, X, Y)"
  - "Memory-mapped I/O"
  - "Assembly language vs machine language"
  - "Hexadecimal notation"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 1
---

# Lesson 1: Meet the NES 6502

Welcome to the world of game programming at the hardware level! Today, you'll meet the processor that powered countless classic games - the 6502 inside the Nintendo Entertainment System - and learn how to speak its native language. Throughout this tier, you'll create **Sprite Symphony** - a musical game that demonstrates the NES's unique audio and visual capabilities through 6502 assembly programming.

## What Is the NES 6502?

The Nintendo Entertainment System uses the same 6502 processor that powered home computers like the Apple II and Commodore 64. But in the NES, this processor is dedicated entirely to creating interactive entertainment - no operating system overhead, no BASIC interpreter, just pure game code running directly on the hardware.

The 6502 was perfect for the NES because:
- **Simple but powerful**: Easy to program but capable of complex operations
- **Fast execution**: 1.79 MHz was plenty for smooth 60 FPS gameplay
- **Memory efficient**: Could do amazing things with just 2KB of RAM
- **Cost effective**: Affordable enough for a consumer game console
- **Proven technology**: Already battle-tested in successful computers

Famous NES games powered by the 6502:
- Super Mario Bros.
- The Legend of Zelda
- Metroid
- Mega Man series
- Castlevania

## The 6502's Registers in Game Context

Just like in other systems, the 6502 has three main registers, but in game programming they serve specific purposes:

### The A Register (Accumulator)
- **Purpose**: The main workhorse for all calculations and data manipulation
- **Game use**: Loading graphics data, calculating scores, processing input
- **Size**: 8 bits (values 0-255)
- **Think of it as**: Your primary tool for game logic

### The X Register (Index Register)
- **Purpose**: Counting, indexing through arrays, memory addressing
- **Game use**: Enemy counters, animation frames, level data indexing
- **Size**: 8 bits (values 0-255)
- **Think of it as**: Your counter and pointer

### The Y Register (Index Register)
- **Purpose**: Similar to X, used for counting and indexing
- **Game use**: Sprite positioning, table lookups, screen coordinates
- **Size**: 8 bits (values 0-255)
- **Think of it as**: Your second counter and coordinate helper

## NES Memory Organization

The NES has a unique memory layout designed specifically for games:

```
$0000-$07FF : Internal RAM (2KB) - Your program variables
$2000-$2007 : PPU Registers - Graphics control
$4000-$4017 : APU & I/O Registers - Sound and input
$4020-$FFFF : Cartridge Space - Your game code and data
```

**Key insight**: Unlike computers, the NES uses **memory-mapped I/O** - you control graphics and sound by writing to specific memory addresses!

## Your First NES Assembly Instruction

Let's start with loading a value into the A register, just like other 6502 systems:

```text
LDA #$01
```

This instruction means:
- **LDA**: Load the A register
- **#**: The next value is immediate (a literal number)
- **$01**: The hexadecimal value 01

**Your First NES Assembly Instruction:**

```nasm
LDA #$01
```

## Game-Relevant Values

In NES programming, certain values have special meaning:

```text
LDA #$00    ; Load 0 - often used to disable/clear things
LDA #$01    ; Load 1 - often used to enable/set things  
LDA #$FF    ; Load 255 - maximum value, often "all on"
LDA #$80    ; Load 128 - halfway point, center values
```

## Memory-Mapped I/O Example

Here's what makes NES programming exciting - you can control hardware directly! For example, to write to the graphics system:

```text
LDA #$3F    ; Load graphics data
STA $2006   ; Write to PPU address register
LDA #$00    ; Load background colour index
STA $2006   ; Write to PPU address register
LDA #$0F    ; Load white colour
STA $2007   ; Write to PPU data register (sets background colour!)
```

*Don't worry about understanding this completely yet - we'll learn graphics programming in detail later!*

**Memory-Mapped I/O Example:**

```nasm
LDA #$3F    ; Graphics setup
STA $2006   ; PPU address high
LDA #$00    
STA $2006   ; PPU address low  
LDA #$0F    ; White colour
STA $2007   ; Write to graphics system
```

## Working with Game Data

Let's practice with values that might appear in games:

```text
LDA #$03    ; Load 3 (maybe 3 lives remaining)
LDX #$00    ; Load 0 into X (start of level 0)
LDY #$50    ; Load 80 into Y (player Y position)
```

**Game Data Examples:**

```nasm
LDA #$03    ; 3 lives remaining
LDX #$00    ; Level 0 (first level)  
LDY #$50    ; Y position 80 pixels
```

## Understanding Game Memory

In NES games, every byte of the 2KB RAM is precious:

```text
; Typical game variable usage
LDA #$05    ; Load starting health
STA $0200   ; Store in RAM location $0200

LDA #$10    ; Load starting X position  
STA $0201   ; Store player X coordinate

LDA #$80    ; Load starting Y position
STA $0202   ; Store player Y coordinate
```

**Game Variables in Memory:**

```nasm
; Store game state in RAM
LDA #$05    ; Starting health = 5
STA $0200   ; Store at memory location $0200

LDA #$10    ; Starting X position = 16
STA $0201   ; Store player X coordinate  

LDA #$80    ; Starting Y position = 128  
STA $0202   ; Store player Y coordinate
```

## Hexadecimal in Game Programming

Game programmers love hexadecimal because it maps perfectly to game concepts:

```
$00 = 0   (off, disabled, empty)
$01 = 1   (on, enabled, first item)
$0F = 15  (maximum for 4-bit values)
$10 = 16  (common for grid positions)
$FF = 255 (maximum 8-bit value, "all on")
```

**Graphics values**:
- **$00-$0F**: Background colors (16 colors)
- **$20**: Common tile ID for spaces
- **$FF**: Common tile ID for solid blocks

## Assembly vs Machine Language in Games

When you write:
```text
LDA #$01
```

The NES assembler converts it to:
```
A9 01
```

The NES reads these bytes directly and executes them at 1.79 million instructions per second - fast enough for smooth gameplay!

## Game Programming Patterns

Here are patterns you'll use constantly in NES games:

**Loading immediate values** (known data):
```text
LDA #$01    ; Load known value
```

**Storing to memory** (saving game state):
```text
STA $0200   ; Store to RAM
```

**Storing to hardware** (controlling graphics/sound):
```text
STA $2007   ; Store to graphics hardware
```

## Practice Exercise

Create your first game-like program! Set up initial game state:

1. Load 3 into A register (3 lives)
2. Store it at memory location $0300 (lives counter)
3. Load 100 into X register (score = 100)  
4. Load 120 into Y register (player Y position)
5. Store X at $0301 (score storage)
6. Store Y at $0302 (position storage)

**Practice Exercise - Game State Setup:**

```nasm
; Initialize game state
LDA #$03    ; 3 lives
STA $0300   ; Store lives counter

LDX #$64    ; Score = 100 ($64 in hex)
STX $0301   ; Store score

LDY #$78    ; Y position = 120 ($78 in hex)  
STY $0302   ; Store player Y position

; Game state is now initialized!
```

## The Game Development Advantage

Learning assembly on the NES teaches you:

**Direct hardware control**: No operating system between you and the graphics/sound
**Performance optimisation**: Every instruction matters for 60 FPS gameplay
**Memory management**: Work within strict 2KB RAM limits
**Real-time programming**: Handle input and graphics in precise timing
**System architecture**: Understand how game consoles really work

## Try It Yourself!

Ready to run this code on a real assembler? Here's how to get started:

### 1. Set Up Your Environment

First, you'll need an assembler and emulator. **[Follow our setup guide](/setup)** for detailed instructions, or use these quick commands:

```bash
# macOS (using Homebrew)
brew install cc65 mesen

# Windows: Download cc65 from cc65.github.io
# Download Mesen from mesen.ca

# Linux (Ubuntu/Debian)  
sudo apt install cc65
# Download Mesen from mesen.ca
```

### 2. Create Your First Program

Create files `hello.s` and `hello.cfg`:

**hello.s:**
```nasm
; Your first NES assembly program
.segment "HEADER"
.byte "NES", $1A    ; NES signature
.byte $02, $01      ; 32K PRG, 8K CHR
.byte $00, $00      ; Mapper 0

.segment "CODE"
RESET:
    ; Initialize the processor
    sei             ; Disable interrupts
    cld             ; Clear decimal mode
    ldx #$FF
    txs             ; Set up stack
    
    ; Your first code!
    lda #$03        ; 3 lives
    sta $0300       ; Store lives
    ldx #$64        ; Score = 100
    stx $0301       ; Store score
    ldy #$78        ; Y position = 120
    sty $0302       ; Store position
    
    ; Infinite loop to examine memory
loop:
    jmp loop        ; Jump to itself

NMI:
IRQ:
    rti

.segment "VECTORS"
.word NMI, RESET, IRQ

.segment "CHR"
.res 8192, 0        ; Empty CHR data
```

**hello.cfg:**
```
MEMORY {
    HDR: start=$0000, size=$0010, type=ro, file=%O, fill=yes;
    PRG: start=$8000, size=$8000, type=ro, file=%O, fill=yes;
    CHR: start=$0000, size=$2000, type=ro, file=%O, fill=yes;
}
SEGMENTS {
    HEADER: load=HDR, type=ro;
    CODE:   load=PRG, type=ro, start=$8000;
    VECTORS: load=PRG, type=ro, start=$FFFA;
    CHR:    load=CHR, type=ro;
}
```

### 3. Assemble and Run

```bash
# Assemble your program
ca65 hello.s -o hello.o

# Link to create NES ROM
ld65 -C hello.cfg hello.o -o hello.nes

# Run in Mesen emulator
mesen hello.nes

# In the emulator:
# 1. Press F11 to open debugger
# 2. Look at memory $0300-$0302
# 3. Check register values
```

### 4. What You Should See

In the Mesen debugger memory viewer at $0300:
```
$0300: 03        ; Lives = 3
$0301: 64        ; Score = 100 ($64)  
$0302: 78        ; Y position = 120 ($78)
```

And in registers:
```
A:03  X:64  Y:78  SP:FF
```

**Congratulations!** You've just created your first NES ROM that initialises game state!

## What You've Learned

In this foundational lesson, you've discovered:

- The 6502 processor powers classic NES games
- The three main registers: A (accumulator), X and Y (index registers)  
- NES memory organisation with memory-mapped I/O
- Your first assembly instruction: LDA (Load A register)
- How hexadecimal relates to game programming values
- The relationship between assembly and machine language
- Basic patterns for game state management

## Looking Ahead

In the next lesson, you'll learn how to store data to different types of memory and see how the NES distinguishes between RAM (for variables) and memory-mapped hardware (for graphics and sound control). You'll write your first program that actually affects what you see and hear!

## Fun Fact

The NES 6502 processor runs at 1.79 MHz, executing nearly 1.8 million instructions per second. At 60 frames per second, that gives you about 29,000 instructions per frame to handle all game logic, graphics updates, sound generation, and input processing. Learn programmers could create incredibly complex games within this constraint - games that are still fun and challenging today! Learning to program the NES teaches you the same optimisation skills that modern game developers use to squeeze maximum performance from current hardware.