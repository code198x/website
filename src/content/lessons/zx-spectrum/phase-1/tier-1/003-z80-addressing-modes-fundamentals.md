---
title: "Z80 Addressing Modes Fundamentals"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 3
description: "Learn the different ways the Z80 can access data - immediate, direct, and register indirect addressing modes. Learn when and why to use each mode for efficient Z80 programming."
learning_objectives:
  - "Understand what addressing modes are and why they matter"
  - "Learn immediate addressing mode (value)"
  - "Learn direct addressing mode (address)"
  - "Practice register indirect addressing mode (register)"
  - "Compare the efficiency of different Z80 addressing modes"
concepts:
  - "Z80 addressing modes overview"
  - "Immediate addressing (LD A, value)"
  - "Direct addressing (LD A, (address))"
  - "Register indirect addressing (LD A, (HL))"
  - "Z80 instruction timing and efficiency"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 3
---

# Lesson 3: Z80 Addressing Modes Fundamentals

You've already been using addressing modes without knowing it! Today, you'll learn what they are, why they exist, and how to choose the right one for each situation on the Z80.

## What Are Addressing Modes?

Addressing modes are different ways to tell the Z80 processor where to find the data it needs to work with. Think of them as different ways to give instructions:

- "Use the number 5" (immediate)
- "Use whatever is stored at address 16384" (direct)
- "Use whatever is at the address stored in register HL" (register indirect)

The Z80 has many addressing modes, making it one of the most flexible 8-bit processors. Today we'll focus on the three most fundamental ones.

## Immediate Addressing Mode

**Format**: `LD A, value`
**Meaning**: "Load the actual value specified"

When you write `LD A, $41`, you're telling the Z80 to load the literal value $41 into the A register.

```text
LD A, $48       ; Load the value $48 (letter 'H') into A register
LD B, $45       ; Load the value $45 (letter 'E') into B register
LD C, $4C       ; Load the value $4C (letter 'L') into C register
```

This is the fastest addressing mode because the data is right there in the instruction.

## Direct Addressing Mode

**Format**: `LD A, (address)`
**Meaning**: "Load whatever is stored at the specified address"

The parentheses `()` tell the Z80 to look **at the address** rather than use the address value itself:

```text
LD A, ($4000)   ; Load whatever is stored at memory address $4000
LD B, ($4001)   ; Load whatever is stored at memory address $4001
```

This mode lets you access any memory location directly.

## Register Indirect Addressing Mode

**Format**: `LD A, (HL)`
**Meaning**: "Load whatever is at the address stored in register HL"

This is where the Z80 really shines! You can use register pairs as pointers:

```text
LD HL, $4000    ; Put address $4000 into HL register pair
LD A, (HL)      ; Load whatever is at the address in HL (i.e., $4000)
```

This mode is incredibly powerful for working with data structures and arrays.

**Z80 Addressing Modes Demonstration:**

```assembly
; Demonstration of Z80 addressing modes
; This program shows immediate, direct, and register indirect addressing

AddressingModesDemo:
    ; === IMMEDIATE ADDRESSING ===
    ; Load literal values directly into registers
    LD A, $42           ; Immediate: Load value $42 into A
    LD B, $43           ; Immediate: Load value $43 into B  
    LD C, $44           ; Immediate: Load value $44 into C
    
    ; Store these values in memory for later use
    LD ($5C00), A       ; Store A at address $5C00
    LD ($5C01), B       ; Store B at address $5C01
    LD ($5C02), C       ; Store C at address $5C02
    
    ; === DIRECT ADDRESSING ===
    ; Load values from specific memory addresses
    LD A, ($5C00)       ; Direct: Load from address $5C00 into A
    LD B, ($5C01)       ; Direct: Load from address $5C01 into B
    LD C, ($5C02)       ; Direct: Load from address $5C02 into C
    
    ; === REGISTER INDIRECT ADDRESSING ===
    ; Use HL as a pointer to memory
    LD HL, $5C00        ; Point HL to address $5C00
    LD A, (HL)          ; Register indirect: Load from address in HL
    
    INC HL              ; Move HL to next address ($5C01)
    LD B, (HL)          ; Load from new address in HL
    
    INC HL              ; Move HL to next address ($5C02)
    LD C, (HL)          ; Load from new address in HL
    
    ; Display results on screen
    LD ($4000), A       ; Show A on screen
    LD ($4001), B       ; Show B on screen  
    LD ($4002), C       ; Show C on screen
    
    RET
```

## Comparing Z80 Addressing Modes

Let's see how these addressing modes compare in terms of speed and flexibility:

### Speed Comparison
1. **Immediate** - Fastest (4 clock cycles)
2. **Register Indirect** - Fast (7 clock cycles)  
3. **Direct** - Slower (13 clock cycles)

### Memory Usage Comparison
1. **Immediate** - 2 bytes (instruction + data)
2. **Register Indirect** - 1 byte (just the instruction)
3. **Direct** - 3 bytes (instruction + 16-bit address)

**Addressing Mode Efficiency Comparison:**

```assembly
; Comparing efficiency of different Z80 addressing modes
; This program demonstrates the trade-offs between modes

EfficiencyDemo:
    ; Scenario: Fill screen memory with a pattern
    ; We'll show three different approaches
    
    ; === APPROACH 1: IMMEDIATE ADDRESSING ===
    ; Fast but inflexible - pattern is fixed in code
    LD A, $2A           ; Immediate: Load asterisk character
    LD ($4000), A       ; Store at screen position
    LD ($4001), A       ; Store at next position
    LD ($4002), A       ; Store at next position
    ; This approach requires many instructions for each position
    
    ; === APPROACH 2: DIRECT ADDRESSING ===
    ; Flexible but slower - can access any memory location
    LD A, ($5C00)       ; Direct: Load pattern from variable
    LD ($4010), A       ; Store at screen position
    LD ($4011), A       ; Store at next position
    LD ($4012), A       ; Store at next position
    ; Still requires many instructions, but pattern can change
    
    ; === APPROACH 3: REGISTER INDIRECT ADDRESSING ===
    ; Fast AND flexible - best of both worlds
    LD HL, $4020        ; Point to screen memory
    LD A, $23           ; Load hash character
    LD B, 10            ; Counter for 10 characters
    
FillLoop:
    LD (HL), A          ; Register indirect: Store A at address in HL
    INC HL              ; Move to next screen position
    DJNZ FillLoop       ; Decrement B and loop if not zero
    ; This approach is efficient for filling memory areas
    
    ; === PRACTICAL EXAMPLE: CHARACTER STRING ===
    ; Using register indirect to display a message
    LD HL, MessageData  ; Point to our message
    LD DE, $4040        ; Point to screen position
    LD B, 5             ; Message length
    
DisplayLoop:
    LD A, (HL)          ; Get character from message
    LD (DE), A          ; Put character on screen
    INC HL              ; Next character in message
    INC DE              ; Next screen position
    DJNZ DisplayLoop    ; Continue until done
    
    RET

; Data for our examples
MessageData:
    DB $48, $45, $4C, $4C, $4F  ; 'HELLO' in ASCII
```

## Advanced Z80 Addressing Features

The Z80 has some unique addressing capabilities that make it extremely powerful:

### Register Indirect with Displacement
You can add an offset to register indirect addressing:

```text
LD HL, $4000        ; Base address
LD A, (HL+5)        ; Load from address HL + 5
LD B, (HL-3)        ; Load from address HL - 3
```

### Extended Register Indirect
The Z80 can use IX and IY registers with displacement:

```text
LD IX, $4000        ; Point IX to base address
LD A, (IX+10)       ; Load from IX + 10
LD (IX+15), B       ; Store B at IX + 15
```

### Block Operations
The Z80 can perform operations on entire blocks of memory:

```text
LD HL, SourceData   ; Source address
LD DE, $4000        ; Destination address
LD BC, 100          ; Number of bytes
LDIR                ; Copy 100 bytes from HL to DE
```

**Advanced Z80 Addressing Features:**

```assembly
; Demonstration of advanced Z80 addressing capabilities
; These features make the Z80 exceptionally powerful

AdvancedAddressingDemo:
    ; === INDEX REGISTER ADDRESSING ===
    ; IX and IY can be used as base pointers with displacement
    LD IX, $4000        ; Point IX to screen memory
    LD A, $41           ; Character 'A'
    LD (IX+0), A        ; Store at IX + 0
    LD (IX+1), A        ; Store at IX + 1
    LD (IX+32), A       ; Store at IX + 32 (next row)
    LD (IX+33), A       ; Store at IX + 33
    
    ; === AUTOMATIC INCREMENT/DECREMENT ===
    ; HL can be automatically incremented/decremented
    LD HL, $4100        ; Point to screen memory
    LD B, 8             ; Counter
    LD A, $2D           ; Dash character
    
AutoIncLoop:
    LD (HL), A          ; Store character
    INC HL              ; Automatically move to next position
    DJNZ AutoIncLoop    ; Continue loop
    
    ; === BLOCK OPERATIONS ===
    ; Fill a block of memory efficiently
    LD HL, $4200        ; Destination start
    LD (HL), $23        ; Put pattern in first location
    LD DE, $4201        ; Destination for copy (next byte)
    LD BC, 31           ; Copy 31 more bytes
    LDIR                ; Fill 32 bytes total with pattern
    
    ; === DATA STRUCTURE ACCESS ===
    ; Simulate accessing elements of a data structure
    LD HL, PlayerData   ; Point to player data structure
    LD A, (HL)          ; Get player X position (offset 0)
    INC HL
    LD B, (HL)          ; Get player Y position (offset 1)
    INC HL  
    LD C, (HL)          ; Get player score (offset 2)
    
    ; Display player position on screen
    LD HL, $4300        ; Screen position for display
    LD (HL), A          ; Show X position
    INC HL
    LD (HL), B          ; Show Y position
    INC HL
    LD (HL), C          ; Show score
    
    RET

; Sample data structure
PlayerData:
    DB 10, 20, 100      ; X, Y, Score
```

## When to Use Each Addressing Mode

### Use Immediate Addressing When:
- Working with constant values
- Setting up initial conditions
- Loading known values quickly

```text
LD A, 0             ; Clear accumulator
LD B, 10            ; Set up loop counter
LD C, $FF           ; Load maximum value
```

### Use Direct Addressing When:
- Accessing specific memory locations
- Working with fixed variables
- Accessing I/O ports

```text
LD A, ($5C78)       ; Read FRAMES system variable
LD ($5C08), A       ; Write to BORDCR system variable
```

### Use Register Indirect Addressing When:
- Processing arrays or lists
- Walking through memory sequentially
- Implementing data structures
- Building efficient loops

```text
LD HL, DataTable    ; Point to table
LD B, TableSize     ; Number of entries
ProcessLoop:
    LD A, (HL)          ; Get table entry
    ; Process A here
    INC HL              ; Move to next entry
    DJNZ ProcessLoop    ; Continue until done
```

## Practice Exercise

**Addressing Modes Practice:**

```assembly
; Practice Exercise: Screen Pattern Generator
; Use different addressing modes to create patterns on screen

PracticeExercise:
    ; Task 1: Use immediate addressing to set up values
    LD A, $2A           ; Asterisk character
    LD B, $2D           ; Dash character
    LD C, $7C           ; Vertical bar character
    
    ; Task 2: Use direct addressing to store in memory variables
    LD (PatternA), A    ; Store asterisk pattern
    LD (PatternB), B    ; Store dash pattern
    LD (PatternC), C    ; Store bar pattern
    
    ; Task 3: Use register indirect to create a pattern on screen
    LD HL, $4400        ; Point to screen memory
    LD DE, PatternA     ; Point to our patterns
    LD B, 3             ; Three different patterns
    
PatternLoop:
    LD A, (DE)          ; Get pattern (register indirect)
    LD (HL), A          ; Put on screen (register indirect)
    INC DE              ; Next pattern
    INC HL              ; Next screen position
    DJNZ PatternLoop    ; Continue loop
    
    ; Task 4: Create a larger pattern using efficient addressing
    LD HL, $4420        ; New screen position
    LD A, (PatternA)    ; Get asterisk pattern
    LD B, 16            ; Make 16 asterisks
    
CreateLine:
    LD (HL), A          ; Place asterisk
    INC HL              ; Next position
    DJNZ CreateLine     ; Continue
    
    RET

; Memory locations for patterns
PatternA: DB 0
PatternB: DB 0  
PatternC: DB 0

; Challenge: Can you modify this to create alternating patterns?
; Try using the different addressing modes creatively!
```

## What You've Learned

In this lesson, you've mastered:

1. **Z80 Addressing Modes** - The different ways Z80 can access data
2. **Immediate Addressing** - Using literal values directly in instructions
3. **Direct Addressing** - Accessing specific memory locations
4. **Register Indirect Addressing** - Using registers as memory pointers
5. **Efficiency Considerations** - When to use each mode for optimal performance

## Looking Ahead

Next, you'll learn about the Z80's status flags and condition codes - how the Z80 keeps track of the results of operations and makes decisions based on those results. This is crucial for building intelligent programs that can respond to different situations!

## Fun Fact

The Z80's addressing modes were revolutionary when it was introduced in 1976. The register indirect addressing with automatic increment/decrement made it incredibly efficient for processing strings and arrays - operations that required much more code on simpler processors. This is one reason why the Z80 became so popular for everything from home computers to embedded systems, and why it's still used in applications today where efficient 8-bit processing is needed!