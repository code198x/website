---
title: "Memory and Addressing Fundamentals"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 9
description: "Introduction to 6502 memory organization and addressing techniques. Learn how the NES memory map works and discover advanced addressing modes for efficient programming."
learning_objectives:
  - "Understand 6502 memory organization and layout"
  - "Learn the NES memory map and special regions"
  - "Explore advanced addressing modes for flexible programming"
  - "Practice memory access patterns and optimization techniques"
  - "Prepare for advanced memory management concepts"
concepts:
  - "6502 memory address space and organization"
  - "NES memory map including RAM, ROM, and hardware registers"
  - "Advanced addressing modes (indirect, indexed indirect)"
  - "Zero page optimization and memory access patterns"
  - "Memory-mapped I/O and hardware interaction"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 9
---

# Lesson 9: Memory and Addressing Fundamentals

Congratulations on completing Section 1: Data Manipulation Fundamentals! You've learned the essential skills for working with 6502 data operations. Now we'll explore how the 6502 organizes and accesses memory - the foundation for all advanced programming techniques on the NES.

## Section 1 Review: What You've Accomplished

Over the past 7 lessons, you've built a solid foundation in 6502 programming:

### Your Data Manipulation Skills
- **Register Operations**: Efficient data movement and register management
- **Addressing Modes**: Flexible ways to access memory and data
- **Status Flags**: Smart program decision making using processor conditions
- **Arithmetic Operations**: Mathematical calculations with proper flag handling
- **Bit Manipulation**: Precise control over individual bits and data fields
- **Logical Operations**: Complex data processing and hardware control

You can now write sophisticated 6502 programs that process data efficiently and make intelligent decisions based on program state!

## Section 2 Introduction: Memory and Addressing

In Section 2, you'll learn how to:

1. **Understand Memory Organization** - How the 6502 and NES organize the 64KB address space
2. **Navigate the NES Memory Map** - Work with RAM, ROM, and hardware registers
3. **Use Advanced Addressing** - Leverage powerful indirect and table-based access patterns
4. **Optimize Memory Access** - Write faster, more efficient code using memory techniques
5. **Interface with Hardware** - Control NES systems through memory-mapped registers
6. **Manage Large Data Sets** - Handle arrays, tables, and complex data structures
7. **Implement Stack Operations** - Use the processor stack for temporary storage and subroutines
8. **Handle Interrupts** - Respond to NES hardware events and timing

## 6502 Memory Organization

The 6502 can address 65,536 bytes (64KB) of memory using 16-bit addresses:

### Address Space Layout
```text
$0000-$FFFF  Complete 64KB address space
$0000-$00FF  Zero Page (256 bytes) - FASTEST ACCESS
$0100-$01FF  Stack Page (256 bytes) - Hardware stack
$0200-$FFFF  General memory area
```

### Why Zero Page is Special
Zero page ($0000-$00FF) uses **8-bit addresses instead of 16-bit**, making it:
- **Faster**: Fewer CPU cycles for memory access
- **Smaller**: Instructions take less program memory
- **More flexible**: Special addressing modes available

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Memory Access Speed Comparison"
  code="; Demonstration of memory access speed differences
; Shows why zero page is preferred for frequently used variables

MemoryAccessDemo:
    ; === ZERO PAGE ACCESS (FAST) ===
    ; Zero page uses 8-bit addresses - faster and smaller
    LDA #$42        ; Load test value
    STA $10         ; Store to zero page (2 bytes, 3 cycles)
    LDA $10         ; Load from zero page (2 bytes, 3 cycles)
    
    ; === ABSOLUTE ACCESS (SLOWER) ===
    ; Absolute addressing uses 16-bit addresses - slower and larger
    LDA #$42        ; Load same test value
    STA $0300       ; Store to absolute address (3 bytes, 4 cycles)
    LDA $0300       ; Load from absolute address (3 bytes, 4 cycles)
    
    ; === INDEXED ZERO PAGE ACCESS ===
    ; Zero page indexed is still faster than absolute
    LDX #$05        ; Index offset
    LDA #$33        ; Test value
    STA $10,X       ; Store to zero page + X (2 bytes, 4 cycles)
    LDA $10,X       ; Load from zero page + X (2 bytes, 4 cycles)
    
    ; === DEMONSTRATION: LOOP COUNTER OPTIMIZATION ===
    ; Compare zero page vs absolute for loop counters
    
    ; Slow way: absolute addressing
    LDA #10         ; Initialize counter
    STA $0400       ; Store counter in absolute memory
    
SlowLoop:
    ; Loop body would go here
    DEC $0400       ; Decrement absolute counter (6 cycles)
    BNE SlowLoop    ; Continue if not zero
    
    ; Fast way: zero page addressing
    LDA #10         ; Initialize counter
    STA $20         ; Store counter in zero page
    
FastLoop:
    ; Loop body would go here
    DEC $20         ; Decrement zero page counter (5 cycles)
    BNE FastLoop    ; Continue if not zero
    
    ; === ZERO PAGE VARIABLE ALLOCATION ===
    ; Organize frequently used variables in zero page
    LDA #$80        ; Player X position
    STA PlayerX     ; Store in zero page
    LDA #$70        ; Player Y position
    STA PlayerY     ; Store in zero page
    
    ; Use variables efficiently
    LDA PlayerX     ; Load current X
    CLC             ; Clear carry
    ADC #$02        ; Move right 2 pixels
    STA PlayerX     ; Store new X position
    
    ; Display current positions
    LDA PlayerX
    STA $0500       ; Display X position
    LDA PlayerY
    STA $0501       ; Display Y position
    
    RTS

; Zero page variable definitions
PlayerX         = $10    ; Player X coordinate (zero page)
PlayerY         = $11    ; Player Y coordinate (zero page)
PlayerHealth    = $12    ; Player health (zero page)
GameFlags       = $13    ; Game state flags (zero page)"
  language="assembly"
/>

## NES Memory Map

The NES has a specific memory layout with different regions serving different purposes:

### NES CPU Memory Map
```text
$0000-$00FF  Zero Page RAM (fastest access)
$0100-$01FF  Stack RAM (processor stack)
$0200-$07FF  General Purpose RAM (1.5KB)
$0800-$1FFF  RAM Mirror (mirrors $0000-$07FF)
$2000-$2007  PPU Registers (graphics hardware)
$2008-$3FFF  PPU Register Mirrors
$4000-$4017  APU and I/O Registers (sound/input)
$4018-$401F  APU and I/O Functionality
$4020-$FFFF  Cartridge space (ROM, RAM, mappers)
```

### Memory-Mapped Hardware
The NES uses **memory-mapped I/O** - hardware registers appear as memory addresses:

<CodeRunner 
  system="nintendo-entertainment-system"
  title="NES Memory Map Exploration"
  code="; Exploration of NES memory regions and their purposes
; Demonstrates how different memory areas are used

NESMemoryDemo:
    ; === ZERO PAGE USAGE ===
    ; Store frequently used variables in zero page
    LDA #$50        ; Temporary value
    STA $10         ; Zero page location
    
    ; === RAM USAGE ===
    ; General purpose RAM for game data
    LDA #$AA        ; Test pattern
    STA $0200       ; Start of general RAM
    STA $0300       ; More general RAM
    
    ; === RAM MIRRORING DEMONSTRATION ===
    ; NES RAM is mirrored every 2KB
    LDA #$BB        ; Test value
    STA $0250       ; Store in base RAM
    LDA $0A50       ; Read from mirror (+$0800)
    STA $0600       ; Should be same value ($BB)
    
    LDA $1250       ; Read from another mirror (+$1000)
    STA $0601       ; Should also be same value ($BB)
    
    ; === PPU REGISTER SIMULATION ===
    ; NES PPU registers are at $2000-$2007
    ; (These are read-only in our simulation)
    
    ; PPUCTRL ($2000) - PPU Control Register
    LDA #%10001000  ; NMI enabled, background pattern table
    STA PPUCtrlSim  ; Simulate writing to $2000
    
    ; PPUMASK ($2001) - PPU Mask Register  
    LDA #%00011110  ; Show background and sprites
    STA PPUMaskSim  ; Simulate writing to $2001
    
    ; PPUADDR ($2006) - PPU Address Register
    LDA #$20        ; High byte of PPU address
    STA PPUAddrSim  ; First write sets high byte
    LDA #$00        ; Low byte of PPU address
    STA PPUAddrSim  ; Second write sets low byte
    
    ; === APU REGISTER SIMULATION ===
    ; NES APU registers are at $4000-$4017
    
    ; Pulse 1 Channel ($4000-$4003)
    LDA #%10111111  ; Duty cycle, envelope settings
    STA APUPulse1Sim ; Simulate $4000
    
    ; Controller Input ($4016)
    LDA #$01        ; Strobe controller
    STA ControllerSim ; Simulate $4016
    LDA #$00        ; Stop strobe
    STA ControllerSim
    
    ; === CARTRIDGE ROM AREA ===
    ; $8000-$FFFF typically contains game code and data
    ; We'll simulate accessing ROM data
    
    LDX #$00        ; Initialize index
ROMDataLoop:
    LDA ROMDataSim,X ; Read from simulated ROM
    STA $0700,X     ; Store in RAM for display
    INX             ; Next byte
    CPX #$08        ; Read 8 bytes
    BNE ROMDataLoop ; Continue loop
    
    ; === MEMORY TESTING ROUTINE ===
    ; Test RAM integrity by writing and reading patterns
    JSR TestRAM
    
    ; === MEMORY CLEARING ROUTINE ===
    ; Clear a block of memory efficiently
    LDX #$00        ; Start index
    LDA #$00        ; Clear value
    
ClearLoop:
    STA $0400,X     ; Clear memory block
    INX             ; Next address
    BNE ClearLoop   ; Continue for 256 bytes
    
    RTS

TestRAM:
    ; Simple RAM test - write pattern and read back
    LDX #$00        ; Initialize index
    LDA #$55        ; Test pattern (01010101)
    
WritePattern:
    STA $0500,X     ; Write pattern to RAM
    INX             ; Next address
    CPX #$50        ; Test 80 bytes
    BNE WritePattern
    
    ; Read back and verify
    LDX #$00        ; Reset index
    LDY #$00        ; Error counter
    
VerifyPattern:
    LDA $0500,X     ; Read back from RAM
    CMP #$55        ; Compare with expected pattern
    BEQ PatternOK   ; Branch if correct
    INY             ; Increment error counter
    
PatternOK:
    INX             ; Next address
    CPX #$50        ; Check all 80 bytes
    BNE VerifyPattern
    
    STY $0750       ; Store error count
    RTS

; Simulated hardware registers (for demonstration)
PPUCtrlSim:     .byte $00    ; $2000 simulation
PPUMaskSim:     .byte $00    ; $2001 simulation
PPUAddrSim:     .byte $00    ; $2006 simulation
APUPulse1Sim:   .byte $00    ; $4000 simulation
ControllerSim:  .byte $00    ; $4016 simulation

; Simulated ROM data
ROMDataSim:     .byte $0F, $1E, $2D, $3C, $4B, $5A, $69, $78"
  language="assembly"
/>

## Advanced Addressing Modes

Beyond the basic addressing modes you've learned, the 6502 offers powerful advanced modes:

### Indirect Addressing Modes

#### Absolute Indirect: JMP ($address)
Used only with JMP instruction for computed jumps:
```text
JMP ($0300)     ; Jump to address stored at $0300-$0301
```

#### Indexed Indirect: ($address,X)
Zero page address + X, then use result as pointer:
```text
LDA ($10,X)     ; Get address from ($10+X), load from that address
```

#### Indirect Indexed: ($address),Y
Get pointer from zero page, then add Y:
```text
LDA ($10),Y     ; Get address from $10, add Y, load from result
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Advanced Addressing Modes"
  code="; Demonstration of 6502 advanced addressing modes
; Shows powerful techniques for flexible memory access

AdvancedAddressingDemo:
    ; === INDEXED INDIRECT ADDRESSING ($zp,X) ===
    ; Useful for accessing different data tables
    
    ; Set up pointer table in zero page
    LDA #<Table1    ; Low byte of Table1 address
    STA $10         ; Store in zero page
    LDA #>Table1    ; High byte of Table1 address
    STA $11         ; Store in zero page + 1
    
    LDA #<Table2    ; Low byte of Table2 address
    STA $12         ; Store in zero page + 2
    LDA #>Table2    ; High byte of Table2 address
    STA $13         ; Store in zero page + 3
    
    ; Use indexed indirect to access different tables
    LDX #$00        ; Select first table ($10,$11)
    LDY #$02        ; Index into table
    LDA ($10,X),Y   ; Load from Table1[2]
    STA $0600       ; Store result
    
    LDX #$02        ; Select second table ($12,$13)
    LDY #$01        ; Index into table
    LDA ($10,X),Y   ; Load from Table2[1]
    STA $0601       ; Store result
    
    ; === INDIRECT INDEXED ADDRESSING ($zp),Y ===
    ; Excellent for array processing and string handling
    
    ; Set up base pointer
    LDA #<DataArray ; Low byte of array address
    STA $20         ; Store pointer in zero page
    LDA #>DataArray ; High byte of array address
    STA $21         ; Store pointer + 1
    
    ; Process array using indirect indexed
    LDY #$00        ; Initialize array index
    
ProcessArray:
    LDA ($20),Y     ; Load array element using pointer + Y
    ASL A           ; Double the value
    STA ($20),Y     ; Store back to array
    
    INY             ; Move to next element
    CPY #ArraySize  ; Check if processed all elements
    BNE ProcessArray ; Continue if more elements
    
    ; === STRING PROCESSING WITH INDIRECT INDEXED ===
    ; Process a null-terminated string
    
    ; Set up string pointer
    LDA #<MessageString ; Low byte of string address
    STA $30         ; Store pointer in zero page
    LDA #>MessageString ; High byte of string address
    STA $31         ; Store pointer + 1
    
    LDY #$00        ; Initialize string index
    
StringProcess:
    LDA ($30),Y     ; Load character using pointer + Y
    BEQ StringDone  ; Branch if null terminator
    
    ; Convert lowercase to uppercase
    CMP #'a'        ; Compare with 'a'
    BCC NotLowercase ; Branch if less than 'a'
    CMP #'z'+1      ; Compare with 'z'+1
    BCS NotLowercase ; Branch if greater than 'z'
    
    SEC             ; Set carry for subtraction
    SBC #$20        ; Convert to uppercase
    STA ($30),Y     ; Store back to string
    
NotLowercase:
    INY             ; Move to next character
    JMP StringProcess ; Continue processing
    
StringDone:
    ; Display processed string
    LDY #$00        ; Reset index
    
DisplayLoop:
    LDA ($30),Y     ; Load processed character
    BEQ DisplayDone ; Branch if null terminator
    STA $0700,Y     ; Store for display
    INY             ; Next character
    JMP DisplayLoop ; Continue display
    
DisplayDone:
    
    ; === COMPUTED JUMP TABLE ===
    ; Use indirect addressing for jump tables
    
    LDA #$02        ; Select function 2 (0-based)
    ASL A           ; Multiply by 2 (addresses are 2 bytes)
    TAX             ; Transfer to X for indexing
    
    ; Set up jump using absolute indirect simulation
    LDA JumpTable,X ; Load low byte of target address
    STA JumpTarget  ; Store in indirect target
    LDA JumpTable+1,X ; Load high byte of target address
    STA JumpTarget+1 ; Store in indirect target + 1
    
    ; Simulate JMP (JumpTarget)
    JSR Function2   ; Direct call for demonstration
    
    ; === DYNAMIC DATA STRUCTURE ACCESS ===
    ; Access elements in a structure array
    
    LDA #$01        ; Select structure 1
    STA StructIndex ; Store structure index
    
    ; Calculate structure address
    LDA StructIndex ; Load structure index
    ASL A           ; Multiply by 2
    ASL A           ; Multiply by 4
    ASL A           ; Multiply by 8 (8 bytes per structure)
    CLC             ; Clear carry
    ADC #<StructArray ; Add base address low byte
    STA $40         ; Store calculated address low
    
    LDA #>StructArray ; Get base address high byte
    ADC #$00        ; Add carry
    STA $41         ; Store calculated address high
    
    ; Access structure members using indirect indexed
    LDY #StructX    ; Offset to X member
    LDA ($40),Y     ; Load X coordinate
    STA $0610       ; Display X
    
    LDY #StructY    ; Offset to Y member
    LDA ($40),Y     ; Load Y coordinate
    STA $0611       ; Display Y
    
    LDY #StructHP   ; Offset to health member
    LDA ($40),Y     ; Load health
    STA $0612       ; Display health
    
    RTS

Function0:
    LDA #$F0        ; Function 0 marker
    STA $0650
    RTS

Function1:
    LDA #$F1        ; Function 1 marker
    STA $0650
    RTS

Function2:
    LDA #$F2        ; Function 2 marker
    STA $0650
    RTS

; Data tables for demonstration
Table1:     .byte $10, $20, $30, $40, $50
Table2:     .byte $A1, $B2, $C3, $D4, $E5

DataArray:  .byte $01, $02, $03, $04, $05, $06
ArraySize = 6

MessageString: .byte "hello world", $00

; Jump table (addresses of functions)
JumpTable:
    .word Function0  ; Address of Function0
    .word Function1  ; Address of Function1
    .word Function2  ; Address of Function2

; Structure definitions
StructX = 0     ; X coordinate offset
StructY = 1     ; Y coordinate offset
StructHP = 2    ; Health points offset
StructFlags = 3 ; Flags offset
; Structure size = 8 bytes (with padding)

; Structure array (8 bytes per structure)
StructArray:
    .byte $10, $20, $64, $00, $00, $00, $00, $00  ; Structure 0
    .byte $50, $80, $32, $01, $00, $00, $00, $00  ; Structure 1
    .byte $A0, $C0, $96, $02, $00, $00, $00, $00  ; Structure 2

; Variables
StructIndex:    .byte $00
JumpTarget:     .byte $00, $00"
  language="assembly"
/>

## Memory Access Patterns and Optimization

Understanding memory access patterns helps you write more efficient code:

### Common Optimization Techniques

1. **Use Zero Page**: Store frequently accessed variables in zero page
2. **Minimize Indirection**: Direct access is faster than indirect when possible
3. **Group Related Data**: Keep related variables near each other
4. **Cache Calculations**: Store computed addresses rather than recalculating

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Memory Optimization Techniques"
  code="; Demonstration of memory optimization techniques
; Shows how to write efficient memory access code

MemoryOptimizationDemo:
    ; === ZERO PAGE OPTIMIZATION ===
    ; Keep loop counters and frequently used variables in zero page
    
    ; Optimized sprite update loop
    LDX #$00        ; Sprite index in X register
    
SpriteUpdateLoop:
    ; Load sprite data efficiently
    LDA SpriteXPos,X ; X position
    STA ZP_TempX    ; Cache in zero page for multiple uses
    
    LDA SpriteYPos,X ; Y position  
    STA ZP_TempY    ; Cache in zero page
    
    ; Update sprite position with cached values
    LDA ZP_TempX    ; Use cached X
    CLC             ; Clear carry
    ADC SpriteVelX,X ; Add X velocity
    STA ZP_TempX    ; Update cached value
    
    ; Boundary check using cached value
    CMP #$F0        ; Check right boundary
    BCC XBoundaryOK ; Branch if within bounds
    LDA #$00        ; Wrap to left side
    STA ZP_TempX
    
XBoundaryOK:
    ; Store updated position
    LDA ZP_TempX    ; Get cached value
    STA SpriteXPos,X ; Store back to array
    
    ; Move to next sprite
    INX             ; Next sprite index
    CPX #NumSprites ; Check if processed all sprites
    BNE SpriteUpdateLoop ; Continue loop
    
    ; === EFFICIENT ARRAY PROCESSING ===
    ; Process 2D array with optimized addressing
    
    LDY #$00        ; Row index
    
RowLoop:
    LDX #$00        ; Column index
    
    ; Calculate row base address
    TYA             ; Get row index
    ASL A           ; Multiply by 2
    ASL A           ; Multiply by 4
    ASL A           ; Multiply by 8 (8 columns per row)
    STA ZP_RowBase  ; Store row base offset
    
ColumnLoop:
    ; Calculate element address efficiently
    LDA ZP_RowBase  ; Get row base
    CLC             ; Clear carry
    ADC X           ; Add column index
    TAX             ; Use as index
    
    ; Process array element
    LDA GridData,X  ; Load array element
    EOR #$FF        ; Invert bits
    STA GridData,X  ; Store back
    
    TXA             ; Get current index back
    SEC             ; Set carry
    SBC ZP_RowBase  ; Subtract row base to get column
    TAX             ; Restore column index
    
    INX             ; Next column
    CPX #GridWidth  ; Check if processed all columns
    BNE ColumnLoop  ; Continue column loop
    
    INY             ; Next row
    CPY #GridHeight ; Check if processed all rows
    BNE RowLoop     ; Continue row loop
    
    ; === POINTER-BASED DATA PROCESSING ===
    ; Use pointers for flexible data access
    
    ; Set up source and destination pointers
    LDA #<SourceData ; Source pointer low
    STA ZP_SrcPtr
    LDA #>SourceData ; Source pointer high
    STA ZP_SrcPtr+1
    
    LDA #<DestData  ; Destination pointer low
    STA ZP_DstPtr
    LDA #>DestData  ; Destination pointer high
    STA ZP_DstPtr+1
    
    ; Copy and transform data using pointers
    LDY #$00        ; Initialize index
    
CopyLoop:
    CPY #DataSize   ; Check if copied all data
    BEQ CopyDone    ; Branch if done
    
    LDA (ZP_SrcPtr),Y ; Load from source
    ASL A           ; Transform data (multiply by 2)
    STA (ZP_DstPtr),Y ; Store to destination
    
    INY             ; Next element
    JMP CopyLoop    ; Continue copy
    
CopyDone:
    
    ; === MEMORY POOLING TECHNIQUE ===
    ; Allocate objects from a memory pool
    
    JSR AllocateObject ; Get object from pool
    STA ZP_ObjPtr   ; Store object pointer low
    STX ZP_ObjPtr+1 ; Store object pointer high
    
    ; Initialize object using pointer
    LDY #ObjType    ; Object type offset
    LDA #$01        ; Object type 1
    STA (ZP_ObjPtr),Y ; Store object type
    
    LDY #ObjX       ; X position offset
    LDA #$80        ; Center X
    STA (ZP_ObjPtr),Y ; Store X position
    
    LDY #ObjY       ; Y position offset
    LDA #$70        ; Center Y
    STA (ZP_ObjPtr),Y ; Store Y position
    
    ; === LOOKUP TABLE OPTIMIZATION ===
    ; Use precomputed tables for speed
    
    LDA #$07        ; Input value (0-15)
    TAX             ; Use as table index
    LDA SquareTable,X ; Look up precomputed square
    STA $0700       ; Store result
    
    ; Use sine table for smooth movement
    LDA FrameCounter ; Get current frame
    AND #$1F        ; Mask to 0-31 for table size
    TAX             ; Use as table index
    LDA SineTable,X ; Look up sine value
    STA $0701       ; Store sine result
    
    INC FrameCounter ; Increment frame counter
    
    RTS

; Simple object allocator
AllocateObject:
    ; Return pointer to next free object
    LDX FreeObjectIndex ; Get current free index
    CPX #MaxObjects ; Check if pool exhausted
    BEQ AllocationFailed ; Branch if no free objects
    
    ; Calculate object address
    TXA             ; Get object index
    ASL A           ; Multiply by 2
    ASL A           ; Multiply by 4
    ASL A           ; Multiply by 8 (8 bytes per object)
    CLC             ; Clear carry
    ADC #<ObjectPool ; Add pool base address
    STA AllocResult ; Store low byte
    
    LDA #>ObjectPool ; Get pool base high
    ADC #$00        ; Add carry
    TAX             ; Return high byte in X
    
    INC FreeObjectIndex ; Update free index
    LDA AllocResult ; Return low byte in A
    RTS
    
AllocationFailed:
    LDA #$00        ; Return null pointer
    TAX
    RTS

; Zero page variables (fast access)
ZP_TempX        = $10
ZP_TempY        = $11
ZP_RowBase      = $12
ZP_SrcPtr       = $20    ; 16-bit pointer
ZP_DstPtr       = $22    ; 16-bit pointer
ZP_ObjPtr       = $24    ; 16-bit pointer

; Game data arrays
NumSprites = 4
SpriteXPos:     .byte $40, $60, $80, $A0
SpriteYPos:     .byte $50, $70, $90, $B0
SpriteVelX:     .byte $01, $FF, $02, $FE

; 2D grid data
GridWidth = 8
GridHeight = 4
GridData:       .byte $00, $01, $02, $03, $04, $05, $06, $07
                .byte $10, $11, $12, $13, $14, $15, $16, $17
                .byte $20, $21, $22, $23, $24, $25, $26, $27
                .byte $30, $31, $32, $33, $34, $35, $36, $37

; Data processing
DataSize = 8
SourceData:     .byte $01, $02, $03, $04, $05, $06, $07, $08
DestData:       .byte $00, $00, $00, $00, $00, $00, $00, $00

; Object pool
MaxObjects = 4
ObjectPool:     .byte $00, $00, $00, $00, $00, $00, $00, $00  ; Object 0
                .byte $00, $00, $00, $00, $00, $00, $00, $00  ; Object 1
                .byte $00, $00, $00, $00, $00, $00, $00, $00  ; Object 2
                .byte $00, $00, $00, $00, $00, $00, $00, $00  ; Object 3

FreeObjectIndex: .byte $00
AllocResult:    .byte $00

; Object structure offsets
ObjType = 0
ObjX = 1
ObjY = 2
ObjHP = 3

; Lookup tables
SquareTable:    .byte $00, $01, $04, $09, $10, $19, $24, $31
                .byte $40, $51, $64, $79, $90, $A9, $C4, $E1

SineTable:      .byte $80, $8C, $98, $A4, $B0, $BB, $C5, $CF
                .byte $D8, $E0, $E7, $ED, $F2, $F6, $F9, $FB
                .byte $FC, $FB, $F9, $F6, $F2, $ED, $E7, $E0
                .byte $D8, $CF, $C5, $BB, $B0, $A4, $98, $8C

FrameCounter:   .byte $00"
  language="assembly"
/>

## Section 2 Preview: What's Coming Next

In the upcoming lessons of Section 2, you'll learn:

### Lesson 10: Advanced Memory Techniques
- Stack operations and subroutine parameters
- Dynamic memory allocation strategies
- Memory bank switching concepts

### Lesson 11: NES Hardware Registers
- PPU memory and registers for graphics control
- APU registers for sound generation
- Controller input and memory-mapped I/O

### Lesson 12: Data Structures and Tables
- Multi-dimensional arrays and matrices
- Linked lists and dynamic structures
- Lookup tables and computed addressing

### Lesson 13: Memory-Mapped Programming
- Direct hardware control through memory
- Interrupt vectors and handlers
- Real-time programming considerations

### Lesson 14: Advanced Addressing Applications
- String processing and text handling
- Graphics buffer management
- Sound and music data structures

### Lesson 15: Memory Management Patterns
- Object-oriented programming in assembly
- Resource management and cleanup
- Performance optimization techniques

### Lesson 16: Section Integration Project
- Complete memory management system
- Hardware interface implementation
- Real-world NES programming patterns

## Preparing for Advanced Concepts

As you move into Section 2, you'll combine your data manipulation skills with sophisticated memory techniques. This combination will enable you to:

- Write complex NES games with multiple objects and systems
- Interface directly with NES hardware for maximum performance
- Implement efficient algorithms for real-time applications
- Handle large amounts of game data and resources

## Fun Fact

The 6502's zero page was revolutionary for its time - having 256 bytes of fast-access memory was like having a large register file. This feature made the 6502 incredibly efficient for small, embedded applications while still supporting the full 64KB address space. The NES developers leveraged this feature extensively, using zero page for everything from sprite coordinates to sound channel parameters. Many classic NES games achieved their smooth performance partly because programmers became experts at zero page optimization. The techniques you're learning here are the same ones used to create legendary games like Super Mario Bros., The Legend of Zelda, and Metroid!