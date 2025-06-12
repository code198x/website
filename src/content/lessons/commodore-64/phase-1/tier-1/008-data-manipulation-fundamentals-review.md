---
title: "Data Manipulation Fundamentals Review"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 8
description: "Consolidate your 6502 assembly knowledge by building a comprehensive data manipulation program that combines registers, memory, arithmetic, and logical operations."
learning_objectives:
  - "Review and combine all fundamental 6502 operations"
  - "Build a practical data manipulation program"
  - "Practice systematic problem-solving with assembly"
  - "Create a foundation project for future learning"
  - "Demonstrate understanding of 6502 architecture basics"
concepts:
  - "Integrated use of all basic instructions"
  - "Systematic program design in assembly"
  - "Data transformation and display"
  - "Memory organisation and efficiency"
  - "Foundation for advanced topics"
estimated_duration: "45-60 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 8
---

# Lesson 8: Data Manipulation Fundamentals Review

Congratulations! You've learned the fundamental building blocks of 6502 assembly programming. In this capstone lesson, you'll combine everything you've learned to build a comprehensive data manipulation program that showcases the power of assembly language.

## What You've Mastered

Over the past seven lessons, you've built an impressive toolkit:

**Data Handling**:
- Loading values into registers (LDA, LDX, LDY)
- Storing data to memory (STA, STX, STY)
- Moving data between registers and memory

**Memory Management**:
- Understanding Zero Page optimisation
- Working with screen memory for output
- Using different addressing modes efficiently

**Arithmetic Operations**:
- Addition with carry (ADC)
- Subtraction with carry (SBC)
- Increment and decrement (INC, DEC, INX, INY, DEX, DEY)

**Logical Operations**:
- Bit masking with AND
- Bit setting with OR (ORA)
- Bit toggling with XOR (EOR)

**System Understanding**:
- Status register flags (Zero, Negative, Carry)
- Hexadecimal and binary number systems
- C64 memory organisation

## Project: Data Processing Center

Let's build a program that acts like a simple data processing center. It will:

1. **Accept input data** (we'll simulate with preset values)
2. **Process the data** using arithmetic and logical operations
3. **Display results** on screen in an organised format
4. **Use efficient memory management** with Zero Page storage

## Project Planning

First, let's plan our memory usage:

```text
; Zero Page Variables (fast access)
; $80 = Input value storage
; $81 = Arithmetic result storage  
; $82 = Logical operation result storage
; $83 = Counter for operations
; $84 = Temporary working space

; Screen Layout Planning
; Row 0: Title "DATA PROCESSOR"
; Row 1: "INPUT: XX"
; Row 2: "MATH:  XX" 
; Row 3: "LOGIC: XX"
; Row 4: "COUNT: XX"
```

## Building the Data Processor

Let's start with our complete data processing program:

```text
; === DATA PROCESSING CENTER ===

; Initialize system
LDX #$00        ; Clear X register for positioning
LDY #$00        ; Clear Y register
LDA #$93        ; Clear screen character
STA $0400       ; Clear first position (this would clear screen on real C64)

; === DISPLAY TITLE ===
LDA #$44        ; 'D'
STA $0400       ; Screen position 0
LDA #$41        ; 'A'  
STA $0401       ; Screen position 1
LDA #$54        ; 'T'
STA $0402       ; Screen position 2
LDA #$41        ; 'A'
STA $0403       ; Screen position 3
LDA #$20        ; Space
STA $0404       ; Screen position 4

; === PROCESS INPUT DATA ===
LDA #$42        ; Load test input: 'B' (ASCII 66)
STA $80         ; Store in Zero Page input storage
STA $0429       ; Display at row 1, position 9 (INPUT: B)

; === ARITHMETIC PROCESSING ===
; Add 5 to our input value
LDA $80         ; Load input value (66)
CLC             ; Clear carry for clean addition
ADC #$05        ; Add 5: 66 + 5 = 71 ('G')
STA $81         ; Store arithmetic result
STA $0451       ; Display at row 2, position 9 (MATH: G)

; === LOGICAL PROCESSING ===
; Convert to lowercase using OR operation
LDA $80         ; Load original input ('B')
ORA #$20        ; Set bit 5 (convert to lowercase)
STA $82         ; Store logical result ('b')
STA $0479       ; Display at row 3, position 9 (LOGIC: b)

; === COUNTER OPERATIONS ===
LDA #$30        ; Start counter at '0'
STA $83         ; Store in counter variable
INC $83         ; Increment: '0' -> '1'
INC $83         ; Increment: '1' -> '2'  
INC $83         ; Increment: '2' -> '3'
LDA $83         ; Load final counter value
STA $04A1       ; Display at row 4, position 9 (COUNT: 3)
```

<CodeRunner 
  system="commodore-64"
  title="Complete Data Processing Center"
  code="; Data Processing Center - Complete Program
; Clear and setup
LDX #$00        
LDY #$00        

; Display title: DATA
LDA #$44        ; 'D'
STA $0400       
LDA #$41        ; 'A'  
STA $0401       
LDA #$54        ; 'T'
STA $0402       
LDA #$41        ; 'A'
STA $0403       
LDA #$20        ; Space
STA $0404       

; Process input data
LDA #$42        ; Input: 'B' (66)
STA $80         ; Store in Zero Page
STA $0429       ; Display input

; Arithmetic: Add 5
LDA $80         
CLC             
ADC #$05        ; B + 5 = G
STA $81         
STA $0451       ; Display result

; Logical: Convert to lowercase
LDA $80         
ORA #$20        ; Set bit 5
STA $82         ; Result: 'b'
STA $0479       ; Display result

; Counter operations
LDA #$30        ; Start at '0'
STA $83         
INC $83         ; Count: 1
INC $83         ; Count: 2
INC $83         ; Count: 3
LDA $83         
STA $04A1       ; Display count"
  language="assembly"
/>

## Enhanced Version with Multiple Data Points

Let's extend our processor to handle multiple data values:

```text
; === MULTI-VALUE DATA PROCESSOR ===

; Process first data point
LDA #$41        ; Load 'A'
STA $80         ; Store first input

; Arithmetic on first value (A + 3 = D)
CLC
ADC #$03        
STA $0400       ; Display result

; Process second data point  
LDA #$35        ; Load '5' (ASCII 53)
STA $81         ; Store second input

; Arithmetic on second value (5 - 2 = 3)
SEC             ; Set carry for subtraction
SBC #$02        ; Subtract 2: 53 - 2 = 51 ('3')
STA $0401       ; Display result

; Combine values using XOR
LDA $80         ; Load first input ('A' = 65)
EOR $81         ; XOR with second input ('5' = 53)
STA $0402       ; Display combined result
```

<CodeRunner 
  system="commodore-64"
  title="Multi-Value Data Processor"
  code="; Multi-value data processing
; First value: 'A' + 3 = 'D'
LDA #$41        ; 'A'
STA $80         
CLC
ADC #$03        ; Add 3
STA $0400       ; Display 'D'

; Second value: '5' - 2 = '3' 
LDA #$35        ; '5'
STA $81         
SEC
SBC #$02        ; Subtract 2
STA $0401       ; Display '3'

; Combine using XOR
LDA $80         ; 'A' (65)
EOR $81         ; XOR with '5' (53)  
STA $0402       ; Display result"
  language="assembly"
/>

## Comprehensive Review Exercise

Now it's your turn! Create a program that demonstrates all the concepts:

**Requirements**:
1. Use all three registers (A, X, Y) for different purposes
2. Demonstrate all three addressing modes (immediate, zero page, absolute)
3. Use arithmetic operations (ADC, SBC, INC, DEC)
4. Use logical operations (AND, ORA, EOR)
5. Display results on screen
6. Use Zero Page for efficient variable storage

**Template to get you started**:

```text
; Your comprehensive review program
; Initialize registers
LDA #$48        ; Load 'H'
LDX #$45        ; Load 'E'  
LDY #$4C        ; Load 'L'

; Store in Zero Page (zero page addressing)
STA $80         ; Store A in $80
STX $81         ; Store X in $81
STY $82         ; Store Y in $82

; Display original values (absolute addressing)
LDA $80         ; Load from zero page
STA $0400       ; Display 'H'
LDA $81         
STA $0401       ; Display 'E'
LDA $82         
STA $0402       ; Display 'L'

; Arithmetic operations
LDA $80         ; Load 'H' (72)
CLC
ADC #$01        ; Add 1: H -> I
STA $0404       ; Display result

; Logical operations  
LDA $81         ; Load 'E' (69)
ORA #$20        ; Convert to lowercase
STA $0405       ; Display 'e'

; Increment operations
INC $82         ; Increment 'L' -> 'M'
LDA $82
STA $0406       ; Display 'M'

; Continue with your own operations...
```

<CodeRunner 
  system="commodore-64"
  title="Your Comprehensive Review Program"
  code="; Comprehensive review - customize this!
; Initialize with HELLO
LDA #$48        ; 'H'
LDX #$45        ; 'E'  
LDY #$4C        ; 'L'

; Store in Zero Page
STA $80         
STX $81         
STY $82         

; Display originals
LDA $80         
STA $0400       ; 'H'
LDA $81         
STA $0401       ; 'E'
LDA $82         
STA $0402       ; 'L'
STA $0403       ; 'L' again

; Add your own operations:
; - Arithmetic (ADC, SBC, INC, DEC)
; - Logical (AND, ORA, EOR)  
; - More data manipulation
; - Creative display patterns

; Example: Convert H to lowercase
LDA $80         ; 'H'
ORA #$20        ; Set bit 5
STA $0405       ; Display 'h'"
  language="assembly"
/>

## Memory Efficiency Techniques

Let's review the efficient techniques you've learned:

**Zero Page Usage**:
```text
; Efficient: Use Zero Page for variables
STA $80         ; Fast, 2 bytes
LDA $80         ; Fast, 2 bytes

; Less efficient: Use absolute addressing for variables  
STA $0300       ; Slower, 3 bytes
LDA $0300       ; Slower, 3 bytes
```

**Immediate vs Memory**:
```text
; Efficient: Use immediate for constants
LDA #$41        ; Fast, 2 bytes

; Inefficient: Store constants in memory first
LDA #$41
STA $80
LDA $80         ; Unnecessary extra step
```

**Register Usage**:
```text
; Efficient: Use registers for temporary values
LDX #$05        ; Use X as counter
INX             ; Fast register operation

; Less efficient: Use memory for everything
LDA #$05
STA $80
INC $80         ; Slower memory operation
```

## Debugging Your Assembly Code

When your assembly programs don't work as expected:

1. **Check addressing modes**: `#$41` vs `$41` vs `$0041`
2. **Verify carry flag usage**: Use CLC before ADC, SEC before SBC  
3. **Watch for overflow**: Results > 255 wrap around
4. **Memory locations**: Make sure you're writing to the right addresses
5. **Flag states**: Remember that operations affect flags

## Common Assembly Patterns

Here are patterns you'll use repeatedly:

**Loading and displaying a character**:
```text
LDA #$41        ; Load character
STA $0400       ; Display on screen
```

**Simple counter**:
```text
LDX #$00        ; Initialize counter
INX             ; Count up
STX $80         ; Store count
```

**Bit manipulation**:
```text
LDA $80         ; Load value
AND #$0F        ; Extract lower 4 bits
ORA #$30        ; Convert to ASCII digit
STA $0400       ; Display
```

## What You've Accomplished

In just 8 lessons, you've built a solid foundation in 6502 assembly programming:

✓ **Hardware Understanding**: Registers, memory, addressing
✓ **Data Movement**: Loading, storing, transferring data
✓ **Arithmetic**: Addition, subtraction, increment, decrement  
✓ **Logic**: Bit manipulation with AND, OR, XOR
✓ **Efficiency**: Zero Page usage, addressing mode selection
✓ **Problem Solving**: Breaking complex tasks into simple operations

## Looking Ahead to Lessons 9-16

In the next section, "Memory and Addressing," you'll learn:

- Advanced addressing modes (indexed, indirect)
- Working with data tables and arrays
- More complex memory manipulation
- Building reusable code patterns
- Stack operations and data structures

## Practice Challenge

Create your own "signature program" that:
1. Displays your initials using character codes
2. Performs some arithmetic on them  
3. Uses logical operations to modify them
4. Shows the results in a creative pattern on screen
5. Uses efficient Zero Page storage
6. Demonstrates at least 5 different instructions

This will be your first complete assembly program that you designed yourself!

## Fun Fact

The techniques you've learned in these 8 lessons are the same ones used to create legendary C64 games, demos, and applications! Every sprite movement in a game, every colour change in a demo, and every calculation in a business application ultimately comes down to these fundamental operations: loading data, manipulating it with arithmetic and logic, and storing the results. You now speak the native language of the Commodore 64!