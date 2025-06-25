---
title: "6502 Registers and Memory Basics"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 2
description: "Learn the 6502 processor's register set and memory system. Understand how the NES organises memory and practice basic data loading and storing operations."
learning_objectives:
  - "Understand the 6502's register architecture"
  - "Learn the LD instruction for moving data"
  - "Understand NES memory layout and addressing"
  - "Practice basic data manipulation operations"
  - "Write simple programs that move data around"
concepts:
  - "6502 accumulator (A) and index registers (X, Y)"
  - "LD instruction variants and addressing modes"
  - "NES memory map and important addresses"
  - "Stack pointer and program counter basics"
  - "Basic data storage and retrieval"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 2
---

# Lesson 2: 6502 Registers and Memory Basics

Welcome to your first deep dive into the 6502 processor! Today you'll learn about the 6502's elegant register system and discover how the NES organises its memory. By the end, you'll be confidently moving data around like a pro!

## The 6502 Register Set

The 6502 has a beautifully simple register architecture - just what you need, nothing you don't:

### Accumulator (A)
**Primary data register** - where most operations happen
```text
LDA #$42        ; Load 42 into accumulator
STA $0200       ; Store accumulator to memory
```

### Index Registers (X and Y)
**For counting and indexing** - perfect for loops and arrays
```text
LDX #$05        ; Load 5 into X register
LDY #$0A        ; Load 10 into Y register
```

### Stack Pointer (S)
**Points to current stack location** - used for subroutines and interrupts

### Program Counter (PC)
**Points to next instruction** - automatically managed by the processor

### Status Register (P)
**Processor flags** - we'll explore these in detail in lesson 4

**6502 Register Demonstration:**

```assembly
; Demonstration of 6502 register operations
; This program shows basic register loading and manipulation

RegisterDemo:
    ; === ACCUMULATOR OPERATIONS ===
    LDA #$42        ; Load hexadecimal 42 into accumulator
    STA $0200       ; Store accumulator to memory address $0200
    
    LDA #65         ; Load decimal 65 (ASCII 'A') into accumulator  
    STA $0201       ; Store to next memory location
    
    LDA #%01001001  ; Load binary 01001001 into accumulator
    STA $0202       ; Store binary value to memory
    
    ; === INDEX REGISTER OPERATIONS ===
    LDX #$00        ; Initialize X register to 0
    LDY #$FF        ; Initialize Y register to 255
    
    ; Store index register values
    STX $0203       ; Store X register to memory
    STY $0204       ; Store Y register to memory
    
    ; === REGISTER TRANSFER OPERATIONS ===
    LDA #$88        ; Load value into accumulator
    TAX             ; Transfer accumulator to X register
    TAY             ; Transfer accumulator to Y register
    
    ; Store transferred values
    STX $0205       ; X now contains $88
    STY $0206       ; Y now contains $88
    
    ; Transfer from index registers back to accumulator
    TXA             ; Transfer X to accumulator
    STA $0207       ; Store result
    
    TYA             ; Transfer Y to accumulator  
    STA $0208       ; Store result
    
    ; === DEMONSTRATING DIFFERENT NUMBER FORMATS ===
    LDA #$10        ; Hexadecimal 16 
    STA $0300       ; Store hex value
    
    LDA #16         ; Decimal 16
    STA $0301       ; Store decimal value (same as above!)
    
    LDA #%00010000  ; Binary 16
    STA $0302       ; Store binary value (same as above!)
    
    RTS
```

## Understanding NES Memory Layout

The NES has a unique memory organisation that's crucial to understand:

### CPU Memory Map ($0000-$FFFF)
- **$0000-$07FF**: Internal RAM (2KB, mirrored)
- **$0800-$1FFF**: RAM mirrors (not real memory!)
- **$2000-$2007**: PPU registers (graphics)
- **$2008-$3FFF**: PPU register mirrors
- **$4000-$4017**: APU and I/O registers (sound/input)
- **$4018-$401F**: APU and I/O test functions
- **$4020-$FFFF**: Cartridge space (PRG ROM/RAM)

### Important Memory Regions
- **$0000-$00FF**: Zero Page (fast access)
- **$0100-$01FF**: Stack
- **$0200-$07FF**: General purpose RAM

**NES Memory Basics:**

```assembly
; Understanding NES memory layout and basic operations
; This program demonstrates memory addressing on the NES

MemoryDemo:
    ; === ZERO PAGE OPERATIONS ===
    ; Zero page ($00-$FF) is faster to access
    LDA #$AA        ; Load test pattern
    STA $10         ; Store to zero page address $10
    STA $11         ; Store to zero page address $11
    
    ; === GENERAL RAM OPERATIONS ===
    ; General purpose RAM starts at $0200
    LDA #$55        ; Load different test pattern
    STA $0200       ; Store to first general RAM location
    STA $0201       ; Store to next location
    
    ; === WORKING WITH THE STACK AREA ===
    ; Stack is at $0100-$01FF, but we can use it for data too
    LDA #$CC        ; Load another pattern
    STA $01F0       ; Store near top of stack area
    
    ; === DEMONSTRATING MEMORY MIRRORING ===
    ; NES RAM is mirrored every 2KB
    LDA #$33        ; Load test value
    STA $0010       ; Store to address $0010
    LDA $0810       ; Load from mirror at $0810 (should be same value!)
    STA $0202       ; Store mirrored value to see it worked
    
    ; === PATTERN TABLE SETUP ===
    ; Fill a small area with pattern data
    LDX #$00        ; Initialize counter
    LDA #$01        ; Starting pattern value
    
FillPattern:
    STA $0300,X     ; Store pattern data at $0300 + X offset
    CLC             ; Clear carry flag
    ADC #$01        ; Add 1 to create incrementing pattern
    INX             ; Increment X register
    CPX #$10        ; Compare with 16
    BNE FillPattern ; Continue if not equal to 16
    
    ; === CLEARING MEMORY BLOCK ===
    ; Clear a block of memory to demonstrate bulk operations
    LDA #$00        ; Load zero
    LDX #$00        ; Reset counter
    
ClearBlock:
    STA $0400,X     ; Clear memory at $0400 + X
    INX             ; Increment counter
    CPX #$20        ; Clear 32 bytes
    BNE ClearBlock  ; Continue until done
    
    RTS
```

## The LD Instruction Family

The 6502's load instructions are your primary tools for moving data:

### Loading into Accumulator
- `LDA #value` - Load immediate value
- `LDA address` - Load from memory address  
- `LDA address,X` - Load from address + X offset

### Loading into Index Registers
- `LDX #value` - Load immediate value into X
- `LDY #value` - Load immediate value into Y
- `LDX address` - Load from memory into X
- `LDY address` - Load from memory into Y

### Storing from Registers
- `STA address` - Store accumulator to memory
- `STX address` - Store X register to memory
- `STY address` - Store Y register to memory

**LD Instruction Variants:**

```assembly
; Comprehensive demonstration of 6502 load and store instructions
; Shows all the ways to move data around

LoadStoreDemo:
    ; === IMMEDIATE ADDRESSING ===
    ; Loading constant values directly
    LDA #$42        ; Load hex 42 into accumulator
    LDX #100        ; Load decimal 100 into X
    LDY #%11110000  ; Load binary pattern into Y
    
    ; Store the immediate values
    STA $0210       ; Store accumulator
    STX $0211       ; Store X register  
    STY $0212       ; Store Y register
    
    ; === ABSOLUTE ADDRESSING ===
    ; Loading from specific memory addresses
    LDA $0210       ; Load value from memory address $0210
    STA $0220       ; Store it elsewhere
    
    LDX $0211       ; Load X from memory
    STX $0221       ; Store X elsewhere
    
    ; === INDEXED ADDRESSING ===
    ; Using registers as offsets
    LDX #$05        ; Load offset value into X
    LDA #$AA        ; Load test pattern
    STA $0300,X     ; Store at $0300 + X = $0305
    
    LDY #$03        ; Load different offset
    LDA #$BB        ; Load different pattern
    STA $0300,Y     ; Store at $0300 + Y = $0303
    
    ; === COPYING DATA BLOCKS ===
    ; Copy a block of data from one location to another
    LDX #$00        ; Initialize index counter
    
CopyLoop:
    LDA $0300,X     ; Load from source + offset
    STA $0400,X     ; Store to destination + offset
    INX             ; Increment index
    CPX #$10        ; Check if copied 16 bytes
    BNE CopyLoop    ; Continue if not done
    
    ; === WORKING WITH ZERO PAGE ===
    ; Zero page addressing is faster and uses less memory
    LDA #$77        ; Load test value
    STA $20         ; Store to zero page (fast!)
    STA $21         ; Store to next zero page location
    
    ; Copy zero page values to regular memory
    LDA $20         ; Load from zero page
    STA $0500       ; Store to regular memory
    LDA $21         ; Load from next zero page
    STA $0501       ; Store to regular memory
    
    ; === REGISTER TRANSFERS ===
    ; Moving data between registers
    LDA #$99        ; Load value into accumulator
    TAX             ; Transfer A to X
    TAY             ; Transfer A to Y
    
    ; Now all three registers contain $99
    STA $0230       ; Store A
    STX $0231       ; Store X  
    STY $0232       ; Store Y
    
    ; Transfer back to accumulator
    TXA             ; Transfer X to A
    STA $0233       ; Store transferred value
    
    TYA             ; Transfer Y to A  
    STA $0234       ; Store transferred value
    
    RTS
```

## Register Transfer Instructions

The 6502 provides efficient ways to move data between registers:

### Transfer Instructions
```text
TAX             ; Transfer Accumulator to X
TAY             ; Transfer Accumulator to Y
TXA             ; Transfer X to Accumulator
TYA             ; Transfer Y to Accumulator
TSX             ; Transfer Stack pointer to X
TXS             ; Transfer X to Stack pointer
```

### When to Use Transfers
- **Preserve values** during calculations
- **Initialize loop counters** from accumulator
- **Copy data** between processing contexts

**Register Transfers and Patterns:**

```assembly
; Advanced register transfer techniques and data patterns
; Demonstrates practical uses of register transfers

TransferDemo:
    ; === PRESERVING VALUES DURING CALCULATIONS ===
    LDA #$50        ; Load initial value (80 decimal)
    TAX             ; Preserve in X register
    
    ; Do some calculation that changes A
    CLC             ; Clear carry
    ADC #$30        ; Add 48 to A (A now = $80)
    STA $0240       ; Store calculated result
    
    ; Restore original value
    TXA             ; Get preserved value back
    STA $0241       ; Store original value
    
    ; === SETTING UP MULTIPLE COUNTERS ===
    LDA #$08        ; Load counter value (8)
    TAX             ; Copy to X for first counter
    TAY             ; Copy to Y for second counter
    
    ; Use counters in different loops
    STA $0250       ; Store original value
    STX $0251       ; Store X counter
    STY $0252       ; Store Y counter
    
    ; === CREATING DATA PATTERNS ===
    ; Create ascending pattern using transfers
    LDA #$01        ; Start with 1
    STA $0300       ; Store first value
    
    TAX             ; Transfer to X
    INX             ; Increment X
    TXA             ; Transfer back to A
    STA $0301       ; Store incremented value
    
    TAX             ; Transfer to X again
    INX             ; Increment X again
    TXA             ; Transfer back to A
    STA $0302       ; Store next value
    
    ; === EFFICIENT LOOP SETUP ===
    ; Set up loop with initial conditions
    LDA #$10        ; Load loop count (16)
    TAX             ; X will be our down-counter
    LDA #$AA        ; Load fill pattern
    
FillLoop:
    STA $0400,X     ; Store pattern at offset X
    DEX             ; Decrement counter
    BPL FillLoop    ; Continue while positive
    
    ; === STACK POINTER MANIPULATION ===
    ; Save current stack pointer
    TSX             ; Transfer stack pointer to X
    STX $0260       ; Save stack pointer value
    
    ; We could modify stack pointer here if needed
    ; For now, just restore it
    LDX $0260       ; Load saved stack pointer
    TXS             ; Restore stack pointer
    
    ; === PATTERN GENERATION WITH TRANSFERS ===
    ; Create alternating pattern
    LDA #$AA        ; Load pattern A
    STA $0500       ; Store first
    
    TAX             ; Save pattern A in X
    LDA #$55        ; Load pattern B
    STA $0501       ; Store second
    
    TAY             ; Save pattern B in Y
    TXA             ; Get pattern A back
    STA $0502       ; Store third
    
    TYA             ; Get pattern B back
    STA $0503       ; Store fourth
    
    RTS
```

## Working with Different Number Formats

The 6502 assembler accepts numbers in multiple formats:

### Number Format Examples
```text
LDA #42         ; Decimal 42
LDA #$2A        ; Hexadecimal 2A (same as 42)
LDA #%00101010  ; Binary (same as 42)
LDA #'*'        ; ASCII character (asterisk = 42)
```

All of these load the exact same value (42) into the accumulator!

**Number Formats and ASCII:**

```assembly
; Working with different number formats and ASCII characters
; Demonstrates how the same value can be represented differently

NumberFormatsDemo:
    ; === SAME VALUE, DIFFERENT REPRESENTATIONS ===
    ; All of these load the value 65 into the accumulator
    LDA #65         ; Decimal 65
    STA $0270       ; Store decimal representation
    
    LDA #$41        ; Hexadecimal 41 (same as 65)
    STA $0271       ; Store hex representation
    
    LDA #%01000001  ; Binary 01000001 (same as 65)
    STA $0272       ; Store binary representation
    
    LDA #'A'        ; ASCII character 'A' (same as 65)
    STA $0273       ; Store ASCII representation
    
    ; === CREATING ASCII TEXT ===
    ; Store the word
```

## Zero Page - The Fast Lane

The 6502's zero page ($00-$FF) is special - it's faster to access and uses less code space:

### Zero Page Advantages
- **Faster execution** - 2 cycles vs 4 cycles
- **Smaller code** - 2 bytes vs 3 bytes per instruction
- **Better performance** - Use for frequently accessed variables

### Best Practices
```text
; Fast and efficient
LDA $10         ; Zero page addressing (fast!)
STA $11         ; Zero page addressing (fast!)

; Slower but sometimes necessary  
LDA $0310       ; Absolute addressing (slower)
STA $0311       ; Absolute addressing (slower)
```

**Zero Page Optimization:**

```assembly
; Demonstrating zero page optimization techniques
; Shows the performance benefits of zero page addressing

ZeroPageDemo:
    ; === ZERO PAGE VARIABLE SETUP ===
    ; Set up commonly used variables in zero page
    LDA #$00        ; Initialize counter
    STA $10         ; Store in zero page $10
    
    LDA #$FF        ; Initialize limit value
    STA $11         ; Store in zero page $11
    
    LDA #$01        ; Initialize increment value
    STA $12         ; Store in zero page $12
    
    ; === FAST ZERO PAGE OPERATIONS ===
    ; These operations are faster than absolute addressing
    LDA $10         ; Load counter (fast zero page)
    CLC             ; Clear carry
    ADC $12         ; Add increment (fast zero page)
    STA $10         ; Store new counter (fast zero page)
    
    ; Compare with limit
    CMP $11         ; Compare with limit (fast zero page)
    BNE ZeroPageDemo ; Loop if not equal
    
    ; === ZERO PAGE INDIRECT ADDRESSING ===
    ; Set up a pointer in zero page
    LDA #$00        ; Low byte of target address
    STA $20         ; Store in zero page $20
    LDA #$03        ; High byte of target address ($0300)
    STA $21         ; Store in zero page $21
    
    ; Use indirect addressing (very powerful!)
    LDY #$00        ; Initialize offset
    LDA #$99        ; Load test value
    STA ($20),Y     ; Store indirectly through zero page pointer
    
    ; === ZERO PAGE AS TEMPORARY STORAGE ===
    ; Use zero page for fast temporary calculations
    LDA #$25        ; Load first number (37)
    STA $30         ; Store in zero page temp1
    
    LDA #$17        ; Load second number (23)  
    STA $31         ; Store in zero page temp2
    
    ; Fast addition using zero page
    LDA $30         ; Load first number (fast)
    CLC             ; Clear carry
    ADC $31         ; Add second number (fast)
    STA $32         ; Store result (fast)
    
    ; === ZERO PAGE SWAP OPERATION ===
    ; Efficiently swap two values using zero page
    LDA #$AA        ; First value
    STA $40         ; Store in zero page
    LDA #$55        ; Second value
    STA $41         ; Store in zero page
    
    ; Perform swap using accumulator
    LDA $40         ; Load first value
    LDX $41         ; Load second value into X
    STA $41         ; Store first value in second location
    STX $40         ; Store second value in first location
    
    ; === ZERO PAGE BIT MANIPULATION ===
    ; Fast bit operations on zero page values
    LDA #%11110000  ; Load bit pattern
    STA $50         ; Store in zero page
    
    ; Test and modify bits quickly
    LDA $50         ; Load pattern (fast)
    AND #%00001111  ; Mask lower bits
    ORA #%10000000  ; Set bit 7
    STA $50         ; Store modified pattern (fast)
    
    RTS
```

## Practice Exercise

**Memory Management Practice:**

```assembly
; Practice Exercise: NES Memory Manager
; Create a simple system for managing NES memory efficiently

MemoryManagerPractice:
    ; === SYSTEM INITIALIZATION ===
    ; Set up zero page variables for memory management
    LDA #$00        ; Initialize allocation pointer
    STA $70         ; Store in zero page $70
    
    LDA #$02        ; Start allocation at $0200
    STA $71         ; Store high byte in zero page $71
    
    ; === ALLOCATE MEMORY BLOCK ===
    ; Allocate 16 bytes of memory and return pointer
    LDA #$10        ; Request 16 bytes
    JSR AllocateMemory ; Call allocation routine
    
    ; Store allocated address for later use
    STA $72         ; Store low byte
    STX $73         ; Store high byte
    
    ; === FILL ALLOCATED MEMORY ===
    ; Fill the allocated block with test data
    LDY #$00        ; Initialize offset
    LDA #$AA        ; Load fill pattern
    
FillAllocated:
    STA ($72),Y     ; Store using indirect addressing
    INY             ; Increment offset
    CPY #$10        ; Check if filled 16 bytes
    BNE FillAllocated ; Continue if not done
    
    ; === CREATE DATA STRUCTURE ===
    ; Create a simple sprite data structure
    LDA #$04        ; Request 4 bytes for sprite data
    JSR AllocateMemory ; Allocate memory
    
    ; Store sprite structure pointer
    STA $74         ; Store low byte
    STX $75         ; Store high byte
    
    ; Fill sprite data structure
    LDY #$00        ; Y position
    LDA #$50        ; Y coordinate
    STA ($74),Y     ; Store Y position
    
    INY             ; X position
    LDA #$60        ; X coordinate  
    STA ($74),Y     ; Store X position
    
    INY             ; Tile number
    LDA #$01        ; Tile 1
    STA ($74),Y     ; Store tile number
    
    INY             ; Attributes
    LDA #%00000000  ; No flip, palette 0
    STA ($74),Y     ; Store attributes
    
    ; === COPY MEMORY BLOCK ===
    ; Copy sprite data to another location
    LDA #$04        ; Allocate another 4 bytes
    JSR AllocateMemory ; Get new memory
    
    ; Set up copy operation
    STA $76         ; Store destination low byte
    STX $77         ; Store destination high byte
    
    ; Copy the sprite data
    LDY #$00        ; Initialize copy offset
CopySprite:
    LDA ($74),Y     ; Load from source
    STA ($76),Y     ; Store to destination
    INY             ; Next byte
    CPY #$04        ; Copied all 4 bytes?
    BNE CopySprite  ; Continue if not done
    
    ; === MEMORY VERIFICATION ===
    ; Verify our memory operations worked correctly
    LDY #$00        ; Check first sprite
    LDA ($74),Y     ; Load Y position
    STA $0700       ; Store for verification
    
    LDY #$00        ; Check copied sprite
    LDA ($76),Y     ; Load Y position from copy
    STA $0701       ; Store for verification
    
    RTS

; Simple memory allocation routine
; Input: A = number of bytes to allocate
; Output: A = low byte of address, X = high byte of address
AllocateMemory:
    CLC             ; Clear carry
    ADC $70         ; Add to current allocation pointer
    TAY             ; Save new pointer in Y
    
    LDA $70         ; Get current pointer (return value)
    LDX $71         ; Get high byte (return value)
    
    STY $70         ; Update allocation pointer
    
    ; Check for overflow (simplified)
    CPY #$00        ; Did we wrap around?
    BNE AllocDone   ; No, we're good
    INC $71         ; Yes, increment high byte
    
AllocDone:
    RTS

; Challenge exercises:
; 1. Add a deallocation routine that frees memory blocks
; 2. Implement a memory defragmentation system
; 3. Create a garbage collector for unused memory
; 4. Add memory protection to prevent overwrites
```

## What You've Learned

In this lesson, you've learned:

1. **6502 Register Architecture** - Accumulator, index registers, and their purposes
2. **Load/Store Instructions** - Moving data efficiently around the NES
3. **NES Memory Layout** - Understanding the unique NES memory organisation
4. **Register Transfers** - Efficient data movement between registers
5. **Zero Page Optimization** - Using the 6502's fast memory region effectively

## Looking Ahead

Next, you'll explore 6502 addressing modes - the different ways the processor can access data. You'll discover how addressing modes make the 6502 incredibly flexible and powerful!

## Fun Fact

The 6502's zero page was revolutionary when introduced in 1975. While other processors treated all memory equally, the 6502's zero page provided a "fast lane" that made programs both smaller and faster. This design influenced many subsequent processors and remains a key reason why the 6502 could compete effectively against more expensive processors. NES programmers became masters of zero page optimisation, squeezing every ounce of performance from this elegant feature!