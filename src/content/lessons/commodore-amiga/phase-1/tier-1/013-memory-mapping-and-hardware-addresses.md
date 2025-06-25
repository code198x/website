---
title: "Memory Mapping and Hardware Addresses"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 13
description: "Explore the Amiga's sophisticated memory architecture and learn how different memory areas serve specific purposes. Master the art of working with chip RAM, fast RAM, ROM, and custom chip addresses."
learning_objectives:
  - "Understand the Amiga's memory map and different memory types"
  - "Learn the distinction between Chip RAM and Fast RAM"
  - "Master memory allocation and addressing for graphics and audio"
  - "Work with ROM addresses and system resources"
  - "Implement memory-efficient programming techniques"
concepts:
  - "Chip RAM vs Fast RAM architecture"
  - "Memory map from $000000 to $FFFFFF"
  - "Graphics memory organization and requirements"
  - "ROM and system resource locations"
  - "Memory allocation strategies for multimedia"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 13
---

# Lesson 13: Memory Mapping and Hardware Addresses

Understanding the Amiga's memory architecture is crucial for effective programming. The Amiga's memory system is more sophisticated than typical computers, with different types of memory serving specific purposes. Today you'll master this architecture and learn to use it effectively.

## The Amiga Memory Architecture

The Amiga's memory system is designed around the custom chips' capabilities:

### Two Types of Memory:
- **Chip RAM**: Accessible by both CPU and custom chips (graphics/audio)
- **Fast RAM**: CPU-only memory for programs and data processing

### Memory Map Overview:
```text
$000000-$07FFFF: Chip RAM (512KB standard, expandable to 2MB)
$080000-$9FFFFF: Auto-config expansion space
$A00000-$BFFFFF: System ROM and reserved areas  
$C00000-$D7FFFF: Fast RAM expansion area
$D80000-$DDFFFF: Reserved
$DE0000-$DFFFFF: Custom chip registers
$E00000-$E7FFFF: Reserved
$E80000-$EFFFFF: Auto-config space
$F00000-$F7FFFF: System ROM (Kickstart)
$F80000-$FFFFFF: Extended ROM space
```

## Chip RAM - The Graphics and Audio Memory

Chip RAM is special because custom chips can access it directly via DMA:

**Understanding Chip RAM:**

```assembly
; Chip RAM starts at $000000
MOVE.L #$00000000, A0        ; Start of Chip RAM

; Common Chip RAM areas for graphics
MOVE.L #$00020000, A1        ; Graphics area (128KB offset)
MOVE.L #$00040000, A2        ; Audio sample area (256KB offset)
MOVE.L #$00060000, A3        ; Sprite data area (384KB offset)

; Store graphics data in Chip RAM
MOVE.W #$FFFF, (A1)          ; Store graphics data
MOVE.W #$AAAA, 2(A1)         ; More graphics data
MOVE.W #$5555, 4(A1)         ; Pattern continues

; Store audio sample in Chip RAM  
MOVE.B #$80, (A2)            ; First sample byte
MOVE.B #$7F, 1(A2)           ; Second sample byte
MOVE.B #$00, 2(A2)           ; Third sample byte
```

## Fast RAM - CPU Processing Memory

Fast RAM is only accessible by the 68000 CPU:

**Working with Fast RAM:**

```assembly
; Fast RAM typically starts around $C00000 (if present)
MOVE.L #$00C00000, A0        ; Fast RAM area (example)

; Fast RAM is perfect for:
; - Program code and variables
; - Temporary calculations
; - Data processing buffers
; - Stack space

; Example: Complex calculation in Fast RAM
MOVE.L #1000, (A0)           ; Store large number
MOVE.L #2000, 4(A0)          ; Another large number
MOVE.L (A0), D0              ; Load first number
MULU.L 4(A0), D0             ; Multiply (32-bit result)
MOVE.L D0, 8(A0)             ; Store result in Fast RAM
```

## Graphics Memory Organization

Graphics data must be in Chip RAM for the custom chips to access it:

### Bitplane Memory Layout
Each bitplane is a separate memory area containing one bit per pixel:

**Bitplane Memory Organization:**

```assembly
; Setup bitplane pointers for 320x200, 4 bitplanes
MOVE.L #$00DFF000, A0        ; Custom chip base

; Calculate bitplane size: 320x200 = 64000 pixels
; In bytes: 64000/8 = 8000 bytes per bitplane
; Aligned to word boundary = 8000 bytes each

MOVE.L #$00020000, A1        ; Base address for bitplanes

; Setup bitplane pointers
MOVE.L A1, $0E0(A0)          ; BPL1PT - Bitplane 1 pointer
ADD.L #8000, A1
MOVE.L A1, $0E4(A0)          ; BPL2PT - Bitplane 2 pointer  
ADD.L #8000, A1
MOVE.L A1, $0E8(A0)          ; BPL3PT - Bitplane 3 pointer
ADD.L #8000, A1
MOVE.L A1, $0EC(A0)          ; BPL4PT - Bitplane 4 pointer

; Configure display for 4 bitplanes
MOVE.W #$4200, $100(A0)      ; BPLCON0: 4 bitplanes, color enable
```

## Audio Memory Requirements

Audio samples must also be in Chip RAM:

**Audio Sample Memory Allocation:**

```assembly
; Allocate audio sample areas in Chip RAM
MOVE.L #$00040000, A0        ; Audio sample base area

; Channel 0 sample (1000 bytes)
MOVE.L A0, A1                ; A1 = Channel 0 sample address
ADD.L #1000, A0              ; Move to next area

; Channel 1 sample (2000 bytes)
MOVE.L A0, A2                ; A2 = Channel 1 sample address  
ADD.L #2000, A0              ; Move to next area

; Channel 2 sample (1500 bytes)
MOVE.L A0, A3                ; A3 = Channel 2 sample address
ADD.L #1500, A0              ; Move to next area

; Channel 3 sample (800 bytes)
MOVE.L A0, A4                ; A4 = Channel 3 sample address

; Setup custom chip audio pointers
MOVE.L #$00DFF000, A0        ; Custom chip base
MOVE.L A1, $0A0(A0)          ; AUD0LC - Channel 0 location
MOVE.L A2, $0B0(A0)          ; AUD1LC - Channel 1 location
MOVE.L A3, $0C0(A0)          ; AUD2LC - Channel 2 location  
MOVE.L A4, $0D0(A0)          ; AUD3LC - Channel 3 location
```

## ROM and System Areas

The Amiga's ROM contains the operating system (Kickstart):

**Accessing ROM and System Areas:**

```assembly
; ROM area starts at $F80000 (varies by Amiga model)
MOVE.L #$00F80000, A0        ; ROM base address

; Read ROM identification
MOVE.L (A0), D0              ; First longword of ROM
MOVE.L 4(A0), D1             ; Second longword

; System vectors at start of memory
MOVE.L #$00000000, A1        ; Start of memory map
MOVE.L (A1), D2              ; Initial stack pointer
MOVE.L 4(A1), D3             ; Initial program counter

; Exception vectors
MOVE.L 8(A1), D4             ; Bus error vector
MOVE.L 12(A1), D5            ; Address error vector
```

## Memory Allocation Strategies

Effective memory management requires understanding what goes where:

### Chip RAM Usage Priority:
1. **Bitplane graphics data** - Must be in Chip RAM
2. **Audio samples** - Must be in Chip RAM  
3. **Sprite data** - Must be in Chip RAM
4. **Copper lists** - Must be in Chip RAM
5. **System structures** - Often need Chip RAM

### Fast RAM Usage:
1. **Program code** - Can be in Fast RAM
2. **Data processing** - Best in Fast RAM
3. **Stack** - Can be in Fast RAM
4. **Temporary buffers** - Ideal for Fast RAM

**Smart Memory Allocation Strategy:**

```assembly
; Memory allocation strategy example

; Chip RAM allocations (required by hardware)
MOVE.L #$00020000, A0        ; Graphics area base
MOVE.L A0, A1                ; A1 = Bitplane 1
ADD.L #8000, A0
MOVE.L A0, A2                ; A2 = Bitplane 2  
ADD.L #8000, A0
MOVE.L A0, A3                ; A3 = Audio samples
ADD.L #4000, A0
MOVE.L A0, A4                ; A4 = Sprite data

; Fast RAM allocations (CPU processing)
MOVE.L #$00C00000, A5        ; Fast RAM base (if available)
MOVE.L A5, A6                ; A6 = Work buffer 1
ADD.L #1000, A5  
MOVE.L A5, A7                ; A7 = Work buffer 2

; Example: Process data in Fast RAM, copy to Chip RAM for display
MOVE.W #$FFFF, (A6)          ; Process in Fast RAM
MOVE.W (A6), D0              ; Read processed data
MOVE.W D0, (A1)              ; Copy to Chip RAM for display
```

## Custom Chip Register Space

The custom chips occupy a specific memory range:

**Custom Chip Memory Map:**

```assembly
; Custom chip registers: $DFF000 - $DFF1FF
MOVE.L #$00DFF000, A0        ; Base address

; Major register groups:
; $DFF000-$DFF07F: General control and status
; $DFF080-$DFF0FF: Copper and blitter  
; $DFF100-$DFF11F: Display control
; $DFF120-$DFF17F: Sprite control
; $DFF180-$DFF1BF: Color palette
; $DFF1C0-$DFF1FF: Reserved

; Access different register groups
MOVE.W $002(A0), D0          ; VPOSR (display status)
MOVE.W $080(A0), D1          ; COP1LC (copper control)
MOVE.W $100(A0), D2          ; BPLCON0 (bitplane control)
MOVE.W $140(A0), D3          ; SPR0POS (sprite position)
MOVE.W $180(A0), D4          ; COLOR00 (background color)
```

## Memory Detection and Sizing

Programs often need to detect available memory:

**Basic Memory Detection:**

```assembly
; Simple memory detection routine
MOVE.L #$00000000, A0        ; Start of memory

; Find end of Chip RAM by testing memory
MOVE.L #$00080000, A1        ; Test up to 512KB
MOVE.L #$AA55AA55, D0        ; Test pattern

MEMORY_TEST_LOOP:
    MOVE.L (A1), D1          ; Save original value
    MOVE.L D0, (A1)          ; Write test pattern
    CMP.L (A1), D0           ; Does it match?
    BNE MEMORY_TEST_DONE     ; No - end of memory found
    MOVE.L D1, (A1)          ; Restore original value
    ADD.L #$1000, A1         ; Test next 4KB block
    CMP.L #$00200000, A1     ; Don't test beyond 2MB
    BLT MEMORY_TEST_LOOP

MEMORY_TEST_DONE:
    ; A1 now points to end of Chip RAM
    SUB.L A0, A1             ; A1 = size of Chip RAM
    MOVE.L A1, D2            ; D2 = Chip RAM size in bytes
```

## Stack and System Memory

The stack typically resides in upper memory:

**Stack Placement Strategy:**

```assembly
; Setup stack in appropriate memory area
; If Fast RAM available, use it for stack
MOVE.L #$00C80000, A7        ; Stack in Fast RAM (example)

; If only Chip RAM available, use upper Chip RAM
; MOVE.L #$00078000, A7      ; Stack in upper Chip RAM

; Reserve area for stack growth (grows downward)
; Stack typically needs 4KB-8KB for complex programs

; Test stack operation
MOVE.W #$1234, -(A7)         ; Push test value
MOVE.W #$5678, -(A7)         ; Push another value
MOVE.W (A7)+, D0             ; Pop first (gets $5678)
MOVE.W (A7)+, D1             ; Pop second (gets $1234)
```

## Memory-Mapped I/O Integration

The memory map includes various I/O areas:

**Memory-Mapped I/O Access:**

```assembly
; Different I/O areas in memory map

; Custom chips ($DFF000)
MOVE.L #$00DFF000, A0
MOVE.W #$0F00, $180(A0)      ; Set background color

; CIA chips ($BFE001 and $BFD000)  
MOVE.L #$00BFE001, A1        ; CIA-A (odd addresses)
MOVE.B $000(A1), D0          ; Read port A
MOVE.B #$FF, $200(A1)        ; Write to port A direction

; Real-time clock area
MOVE.L #$00DC0000, A2        ; RTC area (example)
MOVE.L (A2), D1              ; Read RTC data

; Expansion card areas vary by configuration
MOVE.L #$00E90000, A3        ; Example expansion area
MOVE.W (A3), D2              ; Read expansion data
```

## Practice Exercise: Memory Management System

Create a simple memory management system that allocates areas for different purposes:

**Practice: Memory Manager:**

```assembly
; Simple memory management system

; Memory manager state
CHIP_RAM_BASE    EQU $00020000    ; Start allocating here
CHIP_RAM_END     EQU $00080000    ; End of 512KB Chip RAM
FAST_RAM_BASE    EQU $00C00000    ; Fast RAM start (if available)

; Initialize memory manager
MOVE.L #CHIP_RAM_BASE, A0        ; Current Chip RAM pointer
MOVE.L #FAST_RAM_BASE, A1        ; Current Fast RAM pointer

; Allocate graphics memory (must be Chip RAM)
BSR ALLOCATE_CHIP_RAM            ; Allocate graphics area
MOVE.L D0, A2                    ; A2 = graphics memory
; Allocation size was in D1, let's say 16000 bytes
MOVE.L #16000, D1
BSR ALLOCATE_CHIP_RAM
MOVE.L D0, A3                    ; A3 = second graphics area

; Allocate work memory (can be Fast RAM)  
MOVE.L #8000, D1                 ; Want 8000 bytes
BSR ALLOCATE_FAST_RAM
MOVE.L D0, A4                    ; A4 = work buffer

BRA END_MEMORY_MANAGER

ALLOCATE_CHIP_RAM:
    ; Input: D1 = size needed
    ; Output: D0 = allocated address (or 0 if failed)
    MOVE.L A0, D0                ; Return current address
    ADD.L D1, A0                 ; Advance pointer
    ; Round up to word boundary
    ADD.L #1, A0
    AND.L #$FFFFFFFE, A0
    ; Check if we exceeded Chip RAM
    CMP.L #CHIP_RAM_END, A0
    BGT CHIP_ALLOC_FAILED
    RTS

CHIP_ALLOC_FAILED:
    MOVE.L #0, D0                ; Return failure
    RTS

ALLOCATE_FAST_RAM:
    ; Input: D1 = size needed  
    ; Output: D0 = allocated address (or 0 if failed)
    MOVE.L A1, D0                ; Return current address
    ADD.L D1, A1                 ; Advance pointer
    ; Round up to word boundary
    ADD.L #1, A1
    AND.L #$FFFFFFFE, A1
    ; In real system, would check Fast RAM limits
    RTS

END_MEMORY_MANAGER:
```

## Memory Performance Considerations

Different memory types have different performance characteristics:

### Chip RAM Performance:
- **Shared bandwidth** with custom chips
- **DMA contention** during graphics/audio operations  
- **Slower access** when custom chips are active
- **Required** for multimedia data

### Fast RAM Performance:
- **Dedicated to CPU** - no DMA contention
- **Faster access** - full bus bandwidth
- **Better for computation** - processing and calculations
- **Not accessible** by custom chips

## Memory Alignment Requirements

Some operations require specific memory alignment:

**Memory Alignment Examples:**

```assembly
; Alignment requirements for different data types

; Word alignment (even addresses)
MOVE.L #$00020000, A0
AND.L #$FFFFFFFE, A0         ; Ensure word alignment
MOVE.W #$1234, (A0)          ; Safe word access

; Long alignment (4-byte boundaries)  
MOVE.L #$00020000, A1
AND.L #$FFFFFFFC, A1         ; Ensure long alignment
MOVE.L #$12345678, (A1)      ; Safe long access

; Bitplane alignment (word boundaries required)
MOVE.L #$00030000, A2
AND.L #$FFFFFFFE, A2         ; Bitplanes need word alignment
MOVE.L A2, $0E0(A0)          ; Setup bitplane pointer

; Audio sample alignment (any boundary OK for 8-bit)
MOVE.L #$00040000, A3        ; Audio samples
MOVE.B #$80, (A3)            ; 8-bit samples don't need alignment
```

## What You've Learned

In this essential lesson, you've mastered:

- Amiga memory architecture: Chip RAM vs Fast RAM
- Complete memory map from $000000 to $FFFFFF  
- Graphics memory organization and bitplane layout
- Audio sample memory requirements and allocation
- ROM and system area locations
- Memory allocation strategies for different data types
- Custom chip register memory mapping
- Stack placement and memory detection techniques
- Performance considerations for different memory types
- Memory alignment requirements for various operations

## Memory Management Best Practices

1. **Use Chip RAM sparingly** - Only for data that custom chips need
2. **Prefer Fast RAM for processing** - Better CPU performance
3. **Align data properly** - Word/long boundaries for performance
4. **Test memory availability** - Don't assume memory configuration
5. **Plan memory layout** - Organize for efficient access patterns
6. **Reserve stack space** - Allow room for growth
7. **Handle allocation failures** - Graceful degradation when memory is low

## Looking Ahead

In the next lesson, you'll put this memory knowledge to work by programming the graphics chips directly! You'll learn to set up bitplanes, configure display modes, and create your first custom graphics using the sophisticated memory management techniques you've just learned.

## Fun Fact

The Amiga's separation of Chip RAM and Fast RAM was revolutionary and ahead of its time! This concept is similar to how modern computers have both system RAM and dedicated video memory (VRAM). The Amiga pioneered this architecture in 1985, recognizing that multimedia processing needed dedicated, high-bandwidth memory. Today's graphics cards use the same principle - specialized memory that's optimized for graphics operations and separate from the main system memory. The Amiga's designers were so far ahead that this architecture didn't become standard in PC systems until the 1990s!