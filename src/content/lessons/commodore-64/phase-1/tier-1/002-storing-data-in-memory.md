---
title: "Storing Data in Memory"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 2
description: "Learn how to store data from registers into memory using the STA instruction, and understand how the 6502 moves data between the processor and memory."
learning_objectives:
  - "Learn the STA (Store A) instruction"
  - "Understand how memory addresses work in practice"
  - "Learn about Zero Page memory and why it's special"
  - "Practice moving data between registers and memory"
  - "See your first visible output on the C64 screen"
concepts:
  - "STA (Store A) instruction"
  - "Memory addressing"
  - "Zero Page memory ($00-$FF)"
  - "Screen memory ($0400)"
  - "Data flow between processor and memory"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 2
---

# Lesson 2: Storing Data in Memory

In the last lesson, you learned to load data into the 6502's registers. Today, you'll learn the other half of the equation - how to store that data into memory, and see your first visible result on the C64 screen!

## From Registers to Memory

Remember how registers are like the processor's hands? Well, memory is like the processor's notebook - a place to write things down for later use. The 6502 constantly moves data between registers and memory to accomplish tasks.

The **STA** instruction stores the contents of the A register into a memory location:

```text
LDA #$41    ; Load 'A' into the A register
STA $0400   ; Store A register contents into memory location $0400
```

## Memory Addresses Explained

Every byte of memory in the C64 has a unique address, just like houses on a street. Memory addresses in assembly are written in hexadecimal with a $ prefix:

- **$0000**: The very first byte of memory
- **$0400**: Location 1024 in decimal (screen memory starts here)
- **$FFFF**: The very last byte of memory (location 65535)

When you write `STA $0400`, you're telling the processor: "Take whatever is in the A register and store it at memory address $0400."

## Zero Page - The Fast Lane

The 6502 has a special feature: memory locations $0000 to $00FF (0-255) are called **Zero Page**. Instructions that use Zero Page addresses:

- Execute faster than regular memory instructions
- Use less memory (only need one byte for the address)
- Are used by the operating system and efficient programs

```text
LDA #$42    ; Load 'B' into A register
STA $80     ; Store to Zero Page location $80 (fast!)
```

**Using Zero Page Memory:**

```assembly
LDA #$42    ; Load 'B' into A register
STA $80     ; Store to Zero Page location $80
```

## Your First Visible Output

Here's where it gets exciting! The C64's screen is actually stored in memory starting at location $0400. When you store a character code to screen memory, it appears on your display instantly.

Let's put the letter 'H' in the top-left corner of the screen:

```text
LDA #$48    ; Load 'H' (ASCII 72, hex $48)
STA $0400   ; Store it to first screen position
```

**Your First Screen Output:**

```assembly
LDA #$48    ; Load 'H' (ASCII 72, hex $48)
STA $0400   ; Store it to first screen position
```

You should see the letter 'H' appear in the top-left corner of the screen!

## Understanding Screen Memory

The C64 screen is 40 characters wide by 25 characters tall (1000 positions total). Screen memory locations:

- **$0400**: Top-left corner (row 0, column 0)
- **$0401**: Second position on top row (row 0, column 1)
- **$0428**: Start of second row (row 1, column 0)
- **$07E7**: Bottom-right corner (row 24, column 39)

Each screen position corresponds to a memory address where you can store a character code.

## Moving Data Around

You can also move data from memory back into registers, and between different memory locations:

```text
LDA #$45    ; Load 'E' into A register
STA $81     ; Store it in Zero Page location $81
LDA $81     ; Load the value back from $81 into A
STA $0401   ; Store it to screen position 2
```

**Moving Data Between Memory and Registers:**

```assembly
LDA #$45    ; Load 'E' into A register
STA $81     ; Store it in Zero Page location $81
LDA $81     ; Load the value back from $81 into A
STA $0401   ; Store it to screen position 2
```

## Writing Multiple Characters

Let's write "HELLO" across the top of the screen:

```text
LDA #$48    ; 'H'
STA $0400   ; Screen position 0
LDA #$45    ; 'E'  
STA $0401   ; Screen position 1
LDA #$4C    ; 'L'
STA $0402   ; Screen position 2
LDA #$4C    ; 'L'
STA $0403   ; Screen position 3
LDA #$4F    ; 'O'
STA $0404   ; Screen position 4
```

**Writing HELLO to Screen:**

```assembly
LDA #$48    ; 'H'
STA $0400   ; Screen position 0
LDA #$45    ; 'E'  
STA $0401   ; Screen position 1
LDA #$4C    ; 'L'
STA $0402   ; Screen position 2
LDA #$4C    ; 'L'
STA $0403   ; Screen position 3
LDA #$4F    ; 'O'
STA $0404   ; Screen position 4
```

## Store Instructions for X and Y

The X and Y registers have their own store instructions:

```text
LDX #$10    ; Load 16 into X register
STX $82     ; Store X register to memory location $82

LDY #$20    ; Load 32 into Y register  
STY $83     ; Store Y register to memory location $83
```

**Storing X and Y Registers:**

```assembly
LDX #$10    ; Load 16 into X register
STX $82     ; Store X register to memory location $82
LDY #$20    ; Load 32 into Y register  
STY $83     ; Store Y register to memory location $83
```

## Common Character Codes

Here are some useful ASCII character codes for your programs:

```
Character  | Hex  | Decimal
-----------|------|--------
Space      | $20  | 32
'0'        | $30  | 48
'A'        | $41  | 65
'H'        | $48  | 72
'a'        | $61  | 97
```

## Practice Exercise

Create a program that:

1. Stores your first initial in the top-left corner of the screen
2. Stores a space in the next position
3. Stores your last initial in the third position
4. Uses Zero Page memory ($80-$8F) to temporarily hold values

Here's a template (replace with your initials):

```text
; Store first initial 'S' 
LDA #$53    ; 'S'
STA $80     ; Temporarily store in Zero Page
LDA $80     ; Load it back
STA $0400   ; Put on screen

; Store space
LDA #$20    ; Space character
STA $0401   ; Second screen position

; Store last initial 'H'
LDA #$48    ; 'H' 
STA $81     ; Temporarily store in Zero Page
LDA $81     ; Load it back
STA $0402   ; Third screen position
```

**Practice Exercise - Your Initials:**

```assembly
; Store first initial 'S' 
LDA #$53    ; 'S'
STA $80     ; Temporarily store in Zero Page
LDA $80     ; Load it back
STA $0400   ; Put on screen

; Store space
LDA #$20    ; Space character
STA $0401   ; Second screen position

; Store last initial 'H'
LDA #$48    ; 'H' 
STA $81     ; Temporarily store in Zero Page
LDA $81     ; Load it back
STA $0402   ; Third screen position
```

## What You've Learned

In this lesson, you've mastered:

- The STA instruction for storing the A register to memory
- How memory addresses work (using $ for hexadecimal)
- Zero Page memory and why it's special ($00-$FF)
- Screen memory and how to display characters ($0400 and up)
- STX and STY instructions for X and Y registers
- Moving data between memory and registers

## Looking Ahead

In the next lesson, you'll learn about **addressing modes** - different ways to specify where data should come from or go to. This will make your programs much more flexible and powerful!

## Fun Fact

The C64's screen memory at $0400-$07E7 is just regular RAM - you can read from it as well as write to it! This means you can write programs that examine what's currently on screen, modify it, or save screen contents to disk. Many games used this technique to implement features like screen transitions and special effects.