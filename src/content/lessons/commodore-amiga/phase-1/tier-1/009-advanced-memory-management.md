---
title: "Advanced Memory Management"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 9
description: "Explore the 68000's sophisticated memory management capabilities and the Amiga's advanced memory architecture. Learn how to leverage the powerful addressing system for efficient programming."
learning_objectives:
  - "Understand the 68000's linear 32-bit address space"
  - "Learn the Amiga's memory map and memory types"
  - "Master advanced addressing mode applications"
  - "Practice memory allocation and management techniques"
  - "Build memory-efficient programs using 68000 capabilities"
concepts:
  - "68000 linear address space and memory organisation"
  - "Amiga memory map: Chip RAM, Fast RAM, ROM, I/O"
  - "Advanced addressing modes for memory access"
  - "Memory allocation strategies and techniques"
  - "Cache-friendly programming and performance optimisation"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 9
---

# Lesson 9: Advanced Memory Management

Welcome to Section 2: Memory and Hardware! Having mastered the fundamentals of 68000 programming in Section 1, you're now ready to explore the sophisticated memory management capabilities that make the Amiga truly exceptional. The 68000's linear address space and the Amiga's innovative memory architecture provide unprecedented flexibility for system programming.

## Section 2 Overview: Memory and Hardware

In Section 2, you'll discover:

- **Advanced Memory Management** - Sophisticated memory allocation and organisation
- **Amiga Memory Map and Regions** - Understanding the Amiga's unique memory architecture
- **Custom Chip Integration** - Programming the advanced graphics and audio hardware
- **Stack and Subroutine Advanced Techniques** - Professional calling conventions and stack management
- **Data Structures and Memory Optimisation** - Efficient data organisation patterns
- **Hardware Register Programming** - Direct hardware control and system programming
- **DMA and Blitter Operations** - High-performance data transfer techniques
- **Section 2 Integration Project** - Building applications that leverage Amiga's unique capabilities

## 68000 Linear Address Space

The 68000's memory architecture is revolutionary compared to segmented 8-bit processors:

### Linear Addressing Model
- **32-bit address space**: 4 gigabytes of addressable memory
- **No segmentation**: Direct linear access to any memory location
- **Unified addressing**: Code, data, and I/O in same address space
- **Memory-mapped I/O**: Hardware registers accessed like memory

### Address Space Organisation
- **User space**: $00000000-$7FFFFFFF (2GB)
- **System space**: $80000000-$FFFFFFFF (2GB)
- **Exception vectors**: $00000000-$000003FF (1KB)
- **User program area**: $00000400 and above

<CodeRunner 
  system="commodore-amiga"
  title="68000 Address Space Exploration"
  code="; Demonstration of 68000 linear address space concepts
; Shows how 32-bit addressing enables sophisticated memory organisation

AddressSpaceDemo:
    ; === 32-BIT ADDRESS MANIPULATION ===
    ; Demonstrate full 32-bit address calculations
    
    MOVE.L  #$00100000, A0      ; Load 1MB base address
    MOVE.L  #$00010000, D0      ; 64KB offset
    ADDA.L  D0, A0              ; Calculate new address (A0 = $00110000)
    MOVE.L  A0, CalculatedAddr  ; Store calculated address
    
    ; Large address arithmetic
    MOVE.L  #$10000000, A1      ; 256MB base address
    MOVE.L  #$01000000, D1      ; 16MB offset
    ADDA.L  D1, A1              ; New address (A1 = $11000000)
    MOVE.L  A1, LargeAddress    ; Store large address
    
    ; === ADDRESS RANGE CHECKING ===
    ; Validate addresses are within acceptable ranges
    
    MOVE.L  TestAddress, D2     ; Load address to validate
    
    ; Check if address is in user space (< $80000000)
    CMP.L   #$80000000, D2      ; Compare with system space boundary
    BCC     SystemSpaceAddress  ; Branch if >= $80000000
    
    ; Address is in user space
    MOVE.B  #'U', AddressType   ; Mark as user space
    BRA     CheckAlignment
    
SystemSpaceAddress:
    ; Address is in system space
    MOVE.B  #'S', AddressType   ; Mark as system space
    
CheckAlignment:
    ; === ADDRESS ALIGNMENT CHECKING ===
    ; Check if addresses are properly aligned
    
    ; Check word alignment (even address)
    MOVE.L  D2, D3              ; Copy address
    AND.L   #$00000001, D3      ; Check bit 0
    BEQ     WordAligned         ; Branch if even (aligned)
    
    ; Address is odd (not word-aligned)
    MOVE.B  #'O', AlignmentType ; Mark as odd
    BRA     CheckLongAlignment
    
WordAligned:
    MOVE.B  #'W', AlignmentType ; Mark as word-aligned
    
CheckLongAlignment:
    ; Check long alignment (multiple of 4)
    MOVE.L  D2, D4              ; Copy address
    AND.L   #$00000003, D4      ; Check bottom 2 bits
    BEQ     LongAligned         ; Branch if multiple of 4
    
    ; Not long-aligned
    MOVE.B  #'U', LongAlignment ; Mark as unaligned
    BRA     AddressCalculations
    
LongAligned:
    MOVE.B  #'L', LongAlignment ; Mark as long-aligned
    
AddressCalculations:
    ; === POINTER ARITHMETIC ===
    ; Advanced pointer calculations using addressing modes
    
    MOVE.L  #DataArray, A2      ; Base array address
    MOVE.L  #5, D5              ; Element index
    
    ; Calculate address of array element (long array)
    LSL.L   #2, D5              ; Multiply index by 4 (long size)
    LEA     0(A2,D5.L), A3      ; Calculate element address
    MOVE.L  A3, ElementAddress  ; Store element address
    
    ; Alternative using displacement addressing
    MOVE.L  #3, D6              ; Different index
    MOVE.L  12(A2,D6.L*4), D7   ; Load array[3] with scaling
    MOVE.L  D7, ArrayElement    ; Store loaded element
    
    ; === MEMORY WINDOW CALCULATIONS ===
    ; Calculate memory windows for buffer management
    
    MOVE.L  #$00200000, A4      ; Base memory area (2MB)
    MOVE.L  #$00010000, D0      ; Window size (64KB)
    MOVE.L  #4, D1              ; Window number
    
    ; Calculate window start address
    MOVE.L  D1, D2              ; Copy window number
    MULU.W  D0, D2              ; Multiply by window size
    ADDA.L  D2, A4              ; Add to base address
    MOVE.L  A4, WindowStart     ; Store window start
    
    ; Calculate window end address
    MOVE.L  A4, A5              ; Copy start address
    ADDA.L  D0, A5              ; Add window size
    SUBQ.L  #1, A5              ; Subtract 1 for last valid address
    MOVE.L  A5, WindowEnd       ; Store window end
    
    ; === RELATIVE ADDRESS CALCULATIONS ===
    ; Calculate relative offsets between memory locations
    
    MOVE.L  #Label1, A6         ; First label address
    MOVE.L  #Label2, A7         ; Second label address (defined below)
    
    ; Calculate offset from Label1 to Label2
    MOVE.L  A7, D3              ; Copy second address
    SUB.L   A6, D3              ; Subtract first address
    MOVE.L  D3, RelativeOffset  ; Store relative offset
    
    ; Calculate offset in opposite direction
    MOVE.L  A6, D4              ; Copy first address
    SUB.L   A7, D4              ; Subtract second address
    MOVE.L  D4, ReverseOffset   ; Store reverse offset
    
    ; === CIRCULAR BUFFER ADDRESS CALCULATION ===
    ; Implement circular buffer pointer arithmetic
    
    MOVE.L  #CircularBuffer, A0 ; Buffer base address
    MOVE.L  BufferIndex, D0     ; Current index
    MOVE.L  #BUFFER_SIZE, D1    ; Buffer size
    
    ; Ensure index is within buffer bounds
    CMP.L   D1, D0              ; Compare index with size
    BLT     IndexOK             ; Branch if index < size
    
    ; Index too large - wrap around
WrapIndex:
    SUB.L   D1, D0              ; Subtract buffer size
    CMP.L   D1, D0              ; Check again
    BGE     WrapIndex           ; Continue wrapping if needed
    
IndexOK:
    ; Calculate actual buffer address
    LEA     0(A0,D0.L), A1      ; Calculate element address
    MOVE.L  A1, CircularAddress ; Store circular buffer address
    
    ; Update index for next access
    ADDQ.L  #1, D0              ; Increment index
    CMP.L   D1, D0              ; Check if at end
    BNE     StoreNewIndex       ; Store if not at end
    CLR.L   D0                  ; Wrap to beginning
    
StoreNewIndex:
    MOVE.L  D0, BufferIndex     ; Store updated index
    
    RTS

; Data and constants
TestAddress:        DC.L    $00500000    ; Test address (5MB)
DataArray:          DC.L    100, 200, 300, 400, 500, 600, 700, 800
BUFFER_SIZE         EQU     1024
CircularBuffer:     DS.B    BUFFER_SIZE
BufferIndex:        DC.L    0

; Results storage
CalculatedAddr:     DC.L    0
LargeAddress:       DC.L    0
AddressType:        DC.B    0
AlignmentType:      DC.B    0
LongAlignment:      DC.B    0
ElementAddress:     DC.L    0
ArrayElement:       DC.L    0
WindowStart:        DC.L    0
WindowEnd:          DC.L    0
RelativeOffset:     DC.L    0
ReverseOffset:      DC.L    0
CircularAddress:    DC.L    0

Label1:             DC.W    $1234
Label2:             DC.W    $5678"
  language="assembly"
/>

## Amiga Memory Architecture

The Amiga's memory system is uniquely sophisticated, designed to support advanced graphics and multitasking:

### Memory Types
- **Chip RAM**: Accessible by custom chips (graphics, audio, DMA)
- **Fast RAM**: CPU-only memory for faster execution
- **ROM**: System firmware and Kickstart
- **I/O Space**: Hardware registers and custom chip access

### Memory Regions
- **$000000-$1FFFFF**: Chip RAM (up to 2MB on unexpanded systems)
- **$200000-$9FFFFF**: Expansion RAM (Fast RAM)
- **$A00000-$BFFFFF**: Reserved/Expansion
- **$C00000-$DFFFFF**: Custom chip registers
- **$E00000-$FFFFFF**: ROM space

<CodeRunner 
  system="commodore-amiga"
  title="Amiga Memory Map Navigation"
  code="; Demonstration of Amiga memory map and memory types
; Shows how to work with different memory regions effectively

AmigaMemoryDemo:
    ; === CHIP RAM ACCESS ===
    ; Demonstrate accessing Chip RAM for graphics data
    
    MOVE.L  #$00080000, A0      ; Chip RAM address (512KB)
    
    ; Verify we're in Chip RAM range
    CMP.L   #$00200000, A0      ; Compare with Chip RAM limit
    BCC     NotChipRAM          ; Branch if >= 2MB (not Chip RAM)
    
    ; Store graphics data in Chip RAM
    MOVE.L  #$12345678, (A0)    ; Store test pattern
    MOVE.L  #$9ABCDEF0, 4(A0)   ; Store second pattern
    MOVE.B  #'C', MemoryType1   ; Mark as Chip RAM
    BRA     FastRAMAccess
    
NotChipRAM:
    MOVE.B  #'N', MemoryType1   ; Not Chip RAM
    
FastRAMAccess:
    ; === FAST RAM ACCESS ===
    ; Access Fast RAM for CPU-intensive operations
    
    MOVE.L  #$00300000, A1      ; Fast RAM address (3MB)
    
    ; Verify we're in Fast RAM range
    CMP.L   #$00200000, A1      ; Compare with Chip RAM limit
    BCS     StillChipRAM        ; Branch if < 2MB (still Chip RAM)
    CMP.L   #$00A00000, A1      ; Compare with expansion limit
    BCC     NotFastRAM          ; Branch if >= 10MB
    
    ; Store CPU data in Fast RAM
    MOVE.L  #$FEDCBA09, (A1)    ; Store data pattern
    MOVE.L  #$87654321, 4(A1)   ; Store second pattern
    MOVE.B  #'F', MemoryType2   ; Mark as Fast RAM
    BRA     CustomChipAccess
    
StillChipRAM:
    MOVE.B  #'C', MemoryType2   ; Still Chip RAM
    BRA     CustomChipAccess
    
NotFastRAM:
    MOVE.B  #'U', MemoryType2   ; Unknown/other region
    
CustomChipAccess:
    ; === CUSTOM CHIP REGISTER ACCESS ===
    ; Access custom chip registers in I/O space
    
    MOVE.L  #$DFF000, A2        ; Custom chip base address
    
    ; Verify we're in custom chip space
    CMP.L   #$C00000, A2        ; Compare with I/O space start
    BCS     NotIOSpace          ; Branch if < $C00000
    CMP.L   #$E00000, A2        ; Compare with I/O space end
    BCC     NotIOSpace          ; Branch if >= $E00000
    
    ; Read custom chip register (DMA control)
    MOVE.W  $096(A2), D0        ; Read DMACON register
    MOVE.W  D0, DMAStatus       ; Store DMA status
    MOVE.B  #'I', MemoryType3   ; Mark as I/O space
    BRA     ROMAccess
    
NotIOSpace:
    MOVE.B  #'N', MemoryType3   ; Not I/O space
    
ROMAccess:
    ; === ROM SPACE ACCESS ===
    ; Access system ROM (read-only)
    
    MOVE.L  #$F80000, A3        ; ROM address
    
    ; Verify we're in ROM space
    CMP.L   #$E00000, A3        ; Compare with ROM start
    BCS     NotROMSpace         ; Branch if < $E00000
    
    ; Read from ROM (system vectors and code)
    MOVE.L  (A3), D1            ; Read ROM data
    MOVE.L  D1, ROMData         ; Store ROM data
    MOVE.B  #'R', MemoryType4   ; Mark as ROM space
    BRA     MemoryRangeCheck
    
NotROMSpace:
    MOVE.B  #'N', MemoryType4   ; Not ROM space
    
MemoryRangeCheck:
    ; === MEMORY RANGE VALIDATION ===
    ; Validate memory addresses for safe access
    
    MOVE.L  #MemoryList, A4     ; List of addresses to check
    MOVE.L  #7, D7              ; Check 8 addresses
    
MemoryCheckLoop:
    MOVE.L  (A4)+, D2           ; Load address to check
    
    ; Classify memory region
    JSR     ClassifyMemoryRegion ; Call classification routine
    MOVE.B  D0, MemoryClass1(PC,D7.W) ; Store classification
    
    DBRA    D7, MemoryCheckLoop ; Continue for all addresses
    
    ; === MEMORY BOUNDARY CALCULATIONS ===
    ; Calculate memory region boundaries
    
    ; Find end of Chip RAM
    MOVE.L  #$00000000, A5      ; Start of Chip RAM
    MOVE.L  #$00200000, D3      ; Maximum Chip RAM size
    JSR     FindActualChipRAMSize ; Find actual size
    MOVE.L  D0, ChipRAMSize     ; Store actual Chip RAM size
    
    ; Calculate Fast RAM start
    MOVE.L  #$00200000, A6      ; Potential Fast RAM start
    JSR     FindFastRAMStart    ; Find actual Fast RAM start
    MOVE.L  D0, FastRAMStart    ; Store Fast RAM start
    
    ; === MEMORY ACCESS PERFORMANCE TEST ===
    ; Compare access speeds to different memory types
    
    ; Test Chip RAM access speed
    MOVE.L  #$00100000, A0      ; Chip RAM address
    MOVE.L  #1000, D6           ; Loop count
    JSR     MemorySpeedTest     ; Test memory speed
    MOVE.L  D0, ChipRAMSpeed    ; Store access time
    
    ; Test Fast RAM access speed (if available)
    MOVE.L  FastRAMStart, A0    ; Fast RAM address
    TST.L   A0                  ; Check if Fast RAM available
    BEQ     NoFastRAMTest       ; Skip if no Fast RAM
    
    MOVE.L  #1000, D6           ; Loop count
    JSR     MemorySpeedTest     ; Test memory speed
    MOVE.L  D0, FastRAMSpeed    ; Store access time
    BRA     MemoryMapComplete
    
NoFastRAMTest:
    CLR.L   FastRAMSpeed        ; No Fast RAM available
    
MemoryMapComplete:
    RTS

; Memory classification subroutine
ClassifyMemoryRegion:
    ; Input: D2 = address to classify
    ; Output: D0 = classification code
    
    ; Check Chip RAM range
    CMP.L   #$00200000, D2      ; Compare with 2MB
    BCS     ChipRAMRegion       ; Branch if < 2MB
    
    ; Check Fast RAM range  
    CMP.L   #$00A00000, D2      ; Compare with 10MB
    BCS     FastRAMRegion       ; Branch if < 10MB
    
    ; Check I/O space
    CMP.L   #$C00000, D2        ; Compare with I/O start
    BCS     UnknownRegion       ; Branch if < 12MB
    CMP.L   #$E00000, D2        ; Compare with I/O end
    BCS     IORegion            ; Branch if < 14MB
    
    ; Check ROM space
    CMP.L   #$1000000, D2       ; Compare with 16MB
    BCS     ROMRegion           ; Branch if < 16MB
    
UnknownRegion:
    MOVEQ   #'?', D0            ; Unknown region
    RTS
    
ChipRAMRegion:
    MOVEQ   #'C', D0            ; Chip RAM
    RTS
    
FastRAMRegion:
    MOVEQ   #'F', D0            ; Fast RAM
    RTS
    
IORegion:
    MOVEQ   #'I', D0            ; I/O space
    RTS
    
ROMRegion:
    MOVEQ   #'R', D0            ; ROM space
    RTS

; Find actual Chip RAM size
FindActualChipRAMSize:
    ; Test memory to find actual Chip RAM size
    ; This is a simplified version - real detection is more complex
    MOVE.L  #$00200000, D0      ; Assume maximum (2MB)
    RTS

; Find Fast RAM start address
FindFastRAMStart:
    ; Find where Fast RAM begins (if any)
    ; This is a simplified version
    MOVE.L  #$00200000, D0      ; Standard Fast RAM start
    RTS

; Memory speed test subroutine
MemorySpeedTest:
    ; Input: A0 = memory address, D6 = loop count
    ; Output: D0 = access time (arbitrary units)
    
    MOVE.L  D6, D7              ; Copy loop count
    MOVEQ   #0, D0              ; Initialize timer
    
SpeedTestLoop:
    ADDQ.L  #1, D0              ; Increment timer
    MOVE.L  (A0), D1            ; Read from memory
    MOVE.L  D1, (A0)            ; Write back to memory
    DBRA    D7, SpeedTestLoop   ; Continue test
    
    RTS

; Test data
MemoryList:         ; Addresses to classify
    DC.L    $00080000           ; Chip RAM
    DC.L    $00300000           ; Fast RAM
    DC.L    $DFF000             ; Custom chips
    DC.L    $F80000             ; ROM
    DC.L    $500000             ; Unknown
    DC.L    $100000             ; Chip RAM
    DC.L    $800000             ; Expansion
    DC.L    $E00000             ; ROM start

; Results storage
MemoryType1:        DC.B    0
MemoryType2:        DC.B    0
MemoryType3:        DC.B    0
MemoryType4:        DC.B    0
DMAStatus:          DC.W    0
ROMData:            DC.L    0
MemoryClass1:       DS.B    8       ; Classifications for test addresses
ChipRAMSize:        DC.L    0
FastRAMStart:       DC.L    0
ChipRAMSpeed:       DC.L    0
FastRAMSpeed:       DC.L    0"
  language="assembly"
/>

## Advanced Addressing Modes for Memory Management

The 68000's sophisticated addressing modes enable elegant memory management patterns:

### Memory Access Patterns
- **Sequential access**: Using postincrement addressing
- **Structured access**: Using displacement addressing
- **Array access**: Using indexed addressing with scaling
- **Indirect access**: Using pointer-to-pointer techniques

### Performance Optimisation
- **Cache-friendly patterns**: Sequential memory access
- **Alignment considerations**: Word and long alignment
- **Memory bandwidth**: Efficient use of memory bus
- **Prefetch optimisation**: Code organisation for 68000 prefetch

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Addressing Mode Applications"
  code="; Advanced addressing mode applications for memory management
; Demonstrates sophisticated memory access patterns

AdvancedAddressingDemo:
    ; === STRUCTURE MEMBER ACCESS ===
    ; Access structure members using displacement addressing
    
    MOVE.L  #PlayerStructure, A0 ; Player structure base
    
    ; Access structure members efficiently
    MOVE.W  PLAYER_X(A0), D0    ; Load X coordinate
    MOVE.W  PLAYER_Y(A0), D1    ; Load Y coordinate
    ADD.W   PLAYER_VEL_X(A0), D0 ; Add X velocity
    ADD.W   PLAYER_VEL_Y(A0), D1 ; Add Y velocity
    
    ; Update position with bounds checking
    CMP.W   #SCREEN_WIDTH, D0   ; Check right boundary
    BLT     XInBounds           ; Branch if in bounds
    MOVE.W  #SCREEN_WIDTH-1, D0 ; Clamp to right edge
    
XInBounds:
    CMP.W   #SCREEN_HEIGHT, D1  ; Check bottom boundary
    BLT     YInBounds           ; Branch if in bounds
    MOVE.W  #SCREEN_HEIGHT-1, D1 ; Clamp to bottom edge
    
YInBounds:
    MOVE.W  D0, PLAYER_X(A0)    ; Store new X
    MOVE.W  D1, PLAYER_Y(A0)    ; Store new Y
    
    ; Update animation frame using indexed addressing
    MOVE.W  PLAYER_ANIM_FRAME(A0), D2 ; Load current frame
    ADDQ.W  #1, D2              ; Next frame
    CMP.W   #MAX_ANIM_FRAMES, D2 ; Check frame limit
    BLT     FrameOK             ; Branch if valid
    CLR.W   D2                  ; Reset to frame 0
    
FrameOK:
    MOVE.W  D2, PLAYER_ANIM_FRAME(A0) ; Store new frame
    
    ; === ARRAY PROCESSING WITH SCALING ===
    ; Process arrays using indexed addressing with scaling
    
    MOVE.L  #EnemyArray, A1     ; Enemy array base
    MOVE.L  #MAX_ENEMIES-1, D7  ; Enemy counter
    MOVE.L  #0, D6              ; Array index
    
EnemyUpdateLoop:
    ; Calculate enemy structure address using scaling
    MOVE.L  D6, D3              ; Copy index
    MULU.W  #ENEMY_SIZE, D3     ; Multiply by structure size
    LEA     0(A1,D3.L), A2      ; Calculate structure address
    
    ; Alternative: use direct indexed addressing
    ; MOVE.L  ENEMY_ACTIVE(A1,D6.L*ENEMY_SIZE), D4
    
    ; Check if enemy is active
    TST.L   ENEMY_ACTIVE(A2)    ; Test active flag
    BEQ     NextEnemy           ; Skip if inactive
    
    ; Update enemy AI using structure members
    MOVE.W  ENEMY_X(A2), D0     ; Load enemy X
    MOVE.W  ENEMY_Y(A2), D1     ; Load enemy Y
    MOVE.W  ENEMY_TARGET_X(A2), D2 ; Load target X
    MOVE.W  ENEMY_TARGET_Y(A2), D3 ; Load target Y
    
    ; Calculate movement towards target
    SUB.W   D0, D2              ; X difference
    SUB.W   D1, D3              ; Y difference
    
    ; Normalise movement (simplified)
    CMP.W   #0, D2              ; Check X direction
    BEQ     CheckYMovement      ; Skip if no X movement
    BPL     MoveRight           ; Branch if positive
    
    ; Move left
    SUBQ.W  #1, D0              ; Decrease X
    BRA     CheckYMovement
    
MoveRight:
    ADDQ.W  #1, D0              ; Increase X
    
CheckYMovement:
    CMP.W   #0, D3              ; Check Y direction
    BEQ     UpdateEnemyPos      ; Skip if no Y movement
    BPL     MoveDown            ; Branch if positive
    
    ; Move up
    SUBQ.W  #1, D1              ; Decrease Y
    BRA     UpdateEnemyPos
    
MoveDown:
    ADDQ.W  #1, D1              ; Increase Y
    
UpdateEnemyPos:
    MOVE.W  D0, ENEMY_X(A2)     ; Store new X
    MOVE.W  D1, ENEMY_Y(A2)     ; Store new Y
    
NextEnemy:
    ADDQ.L  #1, D6              ; Next array index
    DBRA    D7, EnemyUpdateLoop ; Continue for all enemies
    
    ; === LINKED LIST TRAVERSAL ===
    ; Traverse linked list using indirect addressing
    
    MOVE.L  #LinkedListHead, A3 ; Load list head pointer
    MOVE.L  (A3), A4            ; Load first node address
    
LinkedListLoop:
    TST.L   A4                  ; Check for null pointer
    BEQ     LinkedListEnd       ; Exit if end of list
    
    ; Process current node
    MOVE.L  NODE_DATA(A4), D0   ; Load node data
    ADD.L   #1, D0              ; Process data (increment)
    MOVE.L  D0, NODE_DATA(A4)   ; Store processed data
    
    ; Move to next node
    MOVE.L  NODE_NEXT(A4), A4   ; Load next node address
    BRA     LinkedListLoop      ; Continue traversal
    
LinkedListEnd:
    
    ; === MULTI-DIMENSIONAL ARRAY ACCESS ===
    ; Access 2D array using calculated addressing
    
    MOVE.L  #Matrix2D, A5       ; 2D matrix base address
    MOVE.L  #3, D4              ; Row index
    MOVE.L  #5, D5              ; Column index
    
    ; Calculate 2D array element address: base + (row * cols + col) * element_size
    MOVE.L  D4, D0              ; Copy row index
    MULU.W  #MATRIX_COLS, D0    ; Multiply by columns per row
    ADD.L   D5, D0              ; Add column index
    LSL.L   #2, D0              ; Multiply by 4 (long element size)
    
    ; Access matrix element
    MOVE.L  0(A5,D0.L), D1      ; Load matrix[row][col]
    ADD.L   #10, D1             ; Process element
    MOVE.L  D1, 0(A5,D0.L)      ; Store back to matrix
    
    ; Alternative: precomputed offset table for irregular arrays
    MOVE.L  #RowOffsetTable, A6 ; Row offset lookup table
    MOVE.L  0(A6,D4.L*4), D2    ; Load row offset
    LEA     0(A5,D2.L), A7      ; Calculate row start address
    MOVE.L  0(A7,D5.L*4), D3    ; Load column element
    
    ; === CIRCULAR BUFFER MANAGEMENT ===
    ; Manage circular buffer with wrap-around addressing
    
    MOVE.L  #CircularBuffer, A0 ; Buffer base
    MOVE.L  WriteIndex, D0      ; Current write index
    MOVE.L  ReadIndex, D1       ; Current read index
    
    ; Write to circular buffer
    MOVE.L  #$12345678, 0(A0,D0.L*4) ; Write data at write index
    ADDQ.L  #1, D0              ; Increment write index
    CMP.L   #BUFFER_ELEMENTS, D0 ; Check for wrap
    BNE     NoWriteWrap         ; Branch if no wrap needed
    CLR.L   D0                  ; Wrap to beginning
    
NoWriteWrap:
    MOVE.L  D0, WriteIndex      ; Store new write index
    
    ; Read from circular buffer
    CMP.L   D0, D1              ; Compare read with write index
    BEQ     BufferEmpty         ; Buffer empty if equal
    
    MOVE.L  0(A0,D1.L*4), D2    ; Read data at read index
    MOVE.L  D2, ReadData        ; Store read data
    ADDQ.L  #1, D1              ; Increment read index
    CMP.L   #BUFFER_ELEMENTS, D1 ; Check for wrap
    BNE     NoReadWrap          ; Branch if no wrap needed
    CLR.L   D1                  ; Wrap to beginning
    
NoReadWrap:
    MOVE.L  D1, ReadIndex       ; Store new read index
    BRA     BufferComplete
    
BufferEmpty:
    MOVE.L  #$FFFFFFFF, ReadData ; Indicate empty buffer
    
BufferComplete:
    
    ; === MEMORY COPY WITH ADDRESSING MODES ===
    ; Efficient memory copying using addressing modes
    
    MOVE.L  #SourceBuffer, A0   ; Source address
    MOVE.L  #DestBuffer, A1     ; Destination address
    MOVE.L  #COPY_SIZE/4-1, D7  ; Copy size in longs
    
MemoryCopyLoop:
    MOVE.L  (A0)+, (A1)+        ; Copy long with postincrement
    DBRA    D7, MemoryCopyLoop  ; Continue copying
    
    ; === SPARSE ARRAY ACCESS ===
    ; Access sparse array using indirect pointer table
    
    MOVE.L  #SparseIndexTable, A2 ; Pointer table
    MOVE.L  #7, D6              ; Sparse index to access
    
    ; Check if index exists in sparse array
    MOVE.L  0(A2,D6.L*4), A3    ; Load pointer from table
    TST.L   A3                  ; Check for null pointer
    BEQ     SparseElementEmpty  ; Branch if element doesn't exist
    
    ; Access sparse element
    MOVE.L  (A3), D0            ; Load sparse element data
    ADD.L   #5, D0              ; Process data
    MOVE.L  D0, (A3)            ; Store back
    MOVE.L  D0, SparseResult    ; Store result
    BRA     AddressingComplete
    
SparseElementEmpty:
    MOVE.L  #0, SparseResult    ; Indicate empty element
    
AddressingComplete:
    RTS

; Structure definitions using EQU
PLAYER_X            EQU     0       ; X coordinate (word)
PLAYER_Y            EQU     2       ; Y coordinate (word)
PLAYER_VEL_X        EQU     4       ; X velocity (word)
PLAYER_VEL_Y        EQU     6       ; Y velocity (word)
PLAYER_ANIM_FRAME   EQU     8       ; Animation frame (word)
PLAYER_SIZE         EQU     10      ; Structure size

ENEMY_ACTIVE        EQU     0       ; Active flag (long)
ENEMY_X             EQU     4       ; X coordinate (word)
ENEMY_Y             EQU     6       ; Y coordinate (word)
ENEMY_TARGET_X      EQU     8       ; Target X (word)
ENEMY_TARGET_Y      EQU     10      ; Target Y (word)
ENEMY_SIZE          EQU     12      ; Structure size

NODE_DATA           EQU     0       ; Node data (long)
NODE_NEXT           EQU     4       ; Next node pointer (long)
NODE_SIZE           EQU     8       ; Node structure size

; Constants
SCREEN_WIDTH        EQU     320
SCREEN_HEIGHT       EQU     256
MAX_ANIM_FRAMES     EQU     8
MAX_ENEMIES         EQU     16
MATRIX_COLS         EQU     10
BUFFER_ELEMENTS     EQU     64
COPY_SIZE           EQU     256

; Data structures
PlayerStructure:
    DC.W    160, 120            ; X, Y position
    DC.W    2, -1               ; X, Y velocity
    DC.W    0                   ; Animation frame

EnemyArray:         DS.B    MAX_ENEMIES*ENEMY_SIZE

LinkedListHead:     DC.L    LinkedNode1
LinkedNode1:
    DC.L    $12345678           ; Data
    DC.L    LinkedNode2         ; Next
LinkedNode2:
    DC.L    $87654321           ; Data
    DC.L    LinkedNode3         ; Next
LinkedNode3:
    DC.L    $ABCDEF01           ; Data
    DC.L    0                   ; Next (null)

Matrix2D:           DS.L    100     ; 10x10 matrix of longs
RowOffsetTable:     DC.L    0, 40, 80, 120, 160, 200, 240, 280, 320, 360

CircularBuffer:     DS.L    BUFFER_ELEMENTS
WriteIndex:         DC.L    0
ReadIndex:          DC.L    0
ReadData:           DC.L    0

SourceBuffer:       DC.L    $11111111, $22222222, $33333333, $44444444
                    DC.L    $55555555, $66666666, $77777777, $88888888
DestBuffer:         DS.L    8

SparseIndexTable:   DC.L    0, 0, 0, SparseElement3, 0, SparseElement5
                    DC.L    0, SparseElement7, 0, 0
SparseElement3:     DC.L    $33333333
SparseElement5:     DC.L    $55555555
SparseElement7:     DC.L    $77777777
SparseResult:       DC.L    0"
  language="assembly"
/>

## Memory Allocation Strategies

The 68000 and Amiga support sophisticated memory allocation patterns:

### Static Allocation
- **Compile-time allocation**: Using DS directives
- **Memory pools**: Pre-allocated blocks for specific purposes
- **Stack allocation**: Temporary variables on stack

### Dynamic Allocation Concepts
- **Heap management**: Dynamic memory allocation
- **Memory tracking**: Keeping track of allocated blocks
- **Fragmentation prevention**: Allocation strategies
- **Memory alignment**: Optimising for performance

<CodeRunner 
  system="commodore-amiga"
  title="Memory Allocation and Management"
  code="; Memory allocation and management strategies
; Demonstrates advanced memory management techniques

MemoryManagementDemo:
    ; === STATIC MEMORY POOL ALLOCATION ===
    ; Implement static memory pool for fixed-size allocations
    
    JSR     InitializeMemoryPool ; Initialize the memory pool
    
    ; Allocate multiple blocks from pool
    JSR     AllocateFromPool    ; Allocate first block
    MOVE.L  D0, Block1Address   ; Store first block address
    
    JSR     AllocateFromPool    ; Allocate second block  
    MOVE.L  D0, Block2Address   ; Store second block address
    
    JSR     AllocateFromPool    ; Allocate third block
    MOVE.L  D0, Block3Address   ; Store third block address
    
    ; Use allocated blocks
    MOVE.L  Block1Address, A0   ; Get first block
    MOVE.L  #$11111111, (A0)    ; Store data in block
    MOVE.L  #$22222222, 4(A0)   ; Store more data
    
    MOVE.L  Block2Address, A1   ; Get second block
    MOVE.L  #$33333333, (A1)    ; Store data in block
    
    ; Free blocks back to pool
    MOVE.L  Block2Address, A0   ; Block to free
    JSR     FreeToPool          ; Free second block
    
    ; Reallocate freed block
    JSR     AllocateFromPool    ; Should reuse freed block
    MOVE.L  D0, Block4Address   ; Store reused block address
    
    ; === STACK-BASED ALLOCATION ===
    ; Implement stack-based temporary allocation
    
    ; Allocate temporary workspace on stack
    MOVE.L  A7, SavedStackPtr   ; Save current stack pointer
    SUB.L   #TEMP_WORKSPACE_SIZE, A7 ; Allocate workspace
    MOVE.L  A7, WorkspacePtr    ; Store workspace pointer
    
    ; Use temporary workspace
    MOVE.L  WorkspacePtr, A2    ; Get workspace address
    MOVE.L  #$AAAAAAAA, (A2)    ; Store temporary data
    MOVE.L  #$BBBBBBBB, 4(A2)   ; Store more temporary data
    
    ; Process data in workspace
    MOVE.L  (A2), D0            ; Load data
    ADD.L   4(A2), D0           ; Add second value
    MOVE.L  D0, TempResult      ; Store result
    
    ; Deallocate workspace (restore stack)
    MOVE.L  SavedStackPtr, A7   ; Restore stack pointer
    
    ; === MEMORY ALIGNMENT MANAGEMENT ===
    ; Ensure proper memory alignment for performance
    
    MOVE.L  #UnalignedBuffer, A3 ; Start with potentially unaligned buffer
    
    ; Align to word boundary
    MOVE.L  A3, D1              ; Copy address
    ADDQ.L  #1, D1              ; Add 1
    AND.L   #$FFFFFFFE, D1      ; Clear bit 0 (word align)
    MOVE.L  D1, WordAlignedPtr  ; Store word-aligned pointer
    
    ; Align to long boundary
    MOVE.L  A3, D2              ; Copy address
    ADDQ.L  #3, D2              ; Add 3
    AND.L   #$FFFFFFFC, D2      ; Clear bottom 2 bits (long align)
    MOVE.L  D2, LongAlignedPtr  ; Store long-aligned pointer
    
    ; === MEMORY USAGE TRACKING ===
    ; Track memory usage and available space
    
    MOVE.L  #TOTAL_MEMORY_SIZE, D3 ; Total available memory
    MOVE.L  AllocatedBlocks, D4 ; Number of allocated blocks
    MULU.W  #BLOCK_SIZE, D4     ; Calculate allocated bytes
    SUB.L   D4, D3              ; Calculate free memory
    MOVE.L  D3, FreeMemory      ; Store free memory amount
    
    ; Calculate memory utilisation percentage
    MOVE.L  D4, D5              ; Copy allocated bytes
    MULU.W  #100, D5            ; Multiply by 100
    DIVU.W  #TOTAL_MEMORY_SIZE, D5 ; Divide by total (percentage)
    MOVE.W  D5, MemoryUtilisation ; Store utilisation percentage
    
    ; === MEMORY DEFRAGMENTATION SIMULATION ===
    ; Simulate memory compaction to reduce fragmentation
    
    JSR     CompactMemoryPool   ; Compact allocated blocks
    
    ; === CACHE-OPTIMISED DATA LAYOUT ===
    ; Organise data for optimal cache performance
    
    MOVE.L  #OptimisedDataArray, A4 ; Cache-friendly data layout
    MOVE.L  #ARRAY_ELEMENTS-1, D7 ; Element counter
    
    ; Sequential access pattern (cache-friendly)
CacheOptimisedLoop:
    MOVE.L  (A4), D0            ; Load element (cache-friendly)
    ADD.L   #1, D0              ; Process element
    MOVE.L  D0, (A4)+           ; Store and advance (cache-friendly)
    DBRA    D7, CacheOptimisedLoop ; Continue sequential access
    
    ; === MEMORY PROTECTION SIMULATION ===
    ; Simulate memory protection and bounds checking
    
    MOVE.L  #ProtectedBuffer, A5 ; Protected memory region
    MOVE.L  #PROTECTED_SIZE, D6  ; Size of protected region
    MOVE.L  #TestWriteAddress, A6 ; Address to test
    
    ; Check if write address is within protected region
    CMP.L   A5, A6              ; Compare with start of region
    BCS     WriteOutOfBounds    ; Branch if before start
    
    MOVE.L  A5, D0              ; Copy start address
    ADD.L   D6, D0              ; Add size to get end address
    CMP.L   D0, A6              ; Compare with end of region
    BCC     WriteOutOfBounds    ; Branch if at or after end
    
    ; Write is within bounds
    MOVE.L  #$CCCCCCCC, (A6)    ; Safe write
    MOVE.B  #'S', BoundsCheckResult ; Mark as safe
    BRA     MemoryManagerComplete
    
WriteOutOfBounds:
    ; Write would be out of bounds
    MOVE.B  #'U', BoundsCheckResult ; Mark as unsafe
    
MemoryManagerComplete:
    RTS

; Memory pool management subroutines
InitializeMemoryPool:
    ; Initialize memory pool with free block list
    MOVE.L  #MemoryPool, A0     ; Pool base address
    MOVE.L  #POOL_BLOCKS, D0    ; Number of blocks
    MOVE.L  #MemoryPoolFreeList, A1 ; Free list head
    
    ; Build linked list of free blocks
    SUBQ.L  #1, D0              ; Adjust for DBRA
    
PoolInitLoop:
    MOVE.L  A0, (A1)            ; Store block address in free list
    LEA     4(A1), A1           ; Move to next free list entry
    LEA     BLOCK_SIZE(A0), A0  ; Move to next block
    DBRA    D0, PoolInitLoop    ; Continue for all blocks
    
    CLR.L   (A1)                ; Mark end of free list
    MOVE.L  #0, AllocatedBlocks ; Clear allocated count
    RTS

AllocateFromPool:
    ; Allocate block from memory pool
    ; Output: D0 = allocated block address (0 if none available)
    
    MOVE.L  #MemoryPoolFreeList, A0 ; Free list head
    MOVE.L  PoolFreeHead, D1    ; Current free list index
    CMP.L   #POOL_BLOCKS, D1    ; Check if any blocks available
    BGE     AllocationFailed    ; Branch if pool exhausted
    
    ; Get free block address
    MOVE.L  0(A0,D1.L*4), D0    ; Load block address from free list
    ADDQ.L  #1, D1              ; Advance free list index
    MOVE.L  D1, PoolFreeHead    ; Store new free list head
    ADDQ.L  #1, AllocatedBlocks ; Increment allocated count
    RTS
    
AllocationFailed:
    MOVEQ   #0, D0              ; Return null pointer
    RTS

FreeToPool:
    ; Free block back to memory pool
    ; Input: A0 = block address to free
    
    MOVE.L  PoolFreeHead, D1    ; Current free list head
    SUBQ.L  #1, D1              ; Move back one position
    MOVE.L  D1, PoolFreeHead    ; Store new free list head
    
    MOVE.L  #MemoryPoolFreeList, A1 ; Free list base
    MOVE.L  A0, 0(A1,D1.L*4)    ; Add block back to free list
    SUBQ.L  #1, AllocatedBlocks ; Decrement allocated count
    RTS

CompactMemoryPool:
    ; Compact memory pool to reduce fragmentation
    ; This is a simplified simulation
    
    ; In real implementation, would move allocated blocks
    ; to eliminate gaps between allocated regions
    MOVE.L  #1, CompactionComplete ; Mark compaction done
    RTS

; Constants
BLOCK_SIZE          EQU     64      ; Size of each memory block
POOL_BLOCKS         EQU     32      ; Number of blocks in pool
TOTAL_MEMORY_SIZE   EQU     2048    ; Total memory pool size
TEMP_WORKSPACE_SIZE EQU     256     ; Temporary workspace size
PROTECTED_SIZE      EQU     128     ; Protected region size
ARRAY_ELEMENTS      EQU     16      ; Cache test array size

; Memory pool data
MemoryPool:         DS.B    POOL_BLOCKS*BLOCK_SIZE
MemoryPoolFreeList: DS.L    POOL_BLOCKS
PoolFreeHead:       DC.L    0
AllocatedBlocks:    DC.L    0

; Test buffers
UnalignedBuffer:    DS.B    129     ; Odd size to test alignment
ProtectedBuffer:    DS.B    PROTECTED_SIZE
OptimisedDataArray: DS.L    ARRAY_ELEMENTS

; Test addresses and data
TestWriteAddress:   DC.L    ProtectedBuffer+10  ; Address within protected region

; Results storage
Block1Address:      DC.L    0
Block2Address:      DC.L    0
Block3Address:      DC.L    0
Block4Address:      DC.L    0
SavedStackPtr:      DC.L    0
WorkspacePtr:       DC.L    0
TempResult:         DC.L    0
WordAlignedPtr:     DC.L    0
LongAlignedPtr:     DC.L    0
FreeMemory:         DC.L    0
MemoryUtilisation:  DC.W    0
BoundsCheckResult:  DC.B    0
CompactionComplete: DC.L    0"
  language="assembly"
/>

## Practice Exercise

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Memory Management Practice"
  code="; Practice Exercise: Amiga Memory Manager System
; Implement a sophisticated memory management system

AmigaMemoryManager:
    ; Initialize memory management system
    JSR     InitializeMemoryManager
    
    ; Demonstrate memory allocation strategies
    JSR     DemonstrateMemoryAllocation
    
    ; Implement virtual memory simulation
    JSR     SimulateVirtualMemory
    
    ; Optimise memory layout
    JSR     OptimiseMemoryLayout
    
    ; Generate memory usage reports
    JSR     GenerateMemoryReports
    
    RTS

InitializeMemoryManager:
    ; Set up memory management data structures
    MOVE.L  #MemoryRegions, A0  ; Memory region table
    MOVE.L  #MAX_REGIONS-1, D7  ; Region counter
    
    ; Initialize memory regions
InitRegionLoop:
    MOVE.L  #0, REGION_BASE(A0) ; Clear base address
    MOVE.L  #0, REGION_SIZE(A0) ; Clear size
    MOVE.L  #0, REGION_FREE(A0) ; Clear free space
    MOVE.B  #TYPE_UNUSED, REGION_TYPE(A0) ; Mark as unused
    LEA     REGION_STRUCT_SIZE(A0), A0 ; Next region
    DBRA    D7, InitRegionLoop  ; Continue for all regions
    
    ; Set up Chip RAM region
    MOVE.L  #MemoryRegions, A0  ; First region
    MOVE.L  #$00000000, REGION_BASE(A0) ; Chip RAM base
    MOVE.L  #$00200000, REGION_SIZE(A0) ; 2MB Chip RAM
    MOVE.L  #$00200000, REGION_FREE(A0) ; Initially all free
    MOVE.B  #TYPE_CHIP_RAM, REGION_TYPE(A0) ; Chip RAM type
    
    ; Set up Fast RAM region
    LEA     REGION_STRUCT_SIZE(A0), A0 ; Next region
    MOVE.L  #$00200000, REGION_BASE(A0) ; Fast RAM base
    MOVE.L  #$00800000, REGION_SIZE(A0) ; 8MB Fast RAM
    MOVE.L  #$00800000, REGION_FREE(A0) ; Initially all free
    MOVE.B  #TYPE_FAST_RAM, REGION_TYPE(A0) ; Fast RAM type
    
    ; Initialize allocation tracking
    CLR.L   TotalAllocated      ; Clear allocation counter
    CLR.L   AllocationCount     ; Clear allocation count
    
    RTS

DemonstrateMemoryAllocation:
    ; Demonstrate different allocation strategies
    
    ; === CHIP RAM ALLOCATION ===
    ; Allocate graphics buffer in Chip RAM
    MOVE.L  #GRAPHICS_BUFFER_SIZE, D0 ; Size needed
    MOVE.B  #TYPE_CHIP_RAM, D1  ; Must be Chip RAM
    JSR     AllocateMemory      ; Allocate memory
    MOVE.L  D0, GraphicsBuffer  ; Store buffer address
    
    ; === FAST RAM ALLOCATION ===
    ; Allocate computation buffer in Fast RAM
    MOVE.L  #COMPUTE_BUFFER_SIZE, D0 ; Size needed
    MOVE.B  #TYPE_FAST_RAM, D1  ; Prefer Fast RAM
    JSR     AllocateMemory      ; Allocate memory
    MOVE.L  D0, ComputeBuffer   ; Store buffer address
    
    ; === MIXED ALLOCATION STRATEGY ===
    ; Allocate multiple small buffers
    MOVE.L  #10, D7             ; Allocate 10 small buffers
    MOVE.L  #SmallBufferArray, A1 ; Array to store addresses
    
SmallAllocationLoop:
    MOVE.L  #SMALL_BUFFER_SIZE, D0 ; Small buffer size
    MOVE.B  #TYPE_ANY, D1       ; Any memory type
    JSR     AllocateMemory      ; Allocate memory
    MOVE.L  D0, (A1)+           ; Store address
    DBRA    D7, SmallAllocationLoop ; Continue allocating
    
    ; === ALIGNMENT-AWARE ALLOCATION ===
    ; Allocate buffer with specific alignment
    MOVE.L  #ALIGNED_BUFFER_SIZE, D0 ; Size needed
    MOVE.L  #16, D1             ; 16-byte alignment
    JSR     AllocateAlignedMemory ; Allocate aligned memory
    MOVE.L  D0, AlignedBuffer   ; Store aligned buffer
    
    RTS

AllocateMemory:
    ; Allocate memory from specified region type
    ; Input: D0 = size, D1 = memory type preference
    ; Output: D0 = allocated address (0 if failed)
    
    MOVE.L  #MemoryRegions, A0  ; Region table
    MOVE.L  #MAX_REGIONS-1, D7  ; Region counter
    
FindSuitableRegion:
    ; Check if region matches type preference
    CMP.B   #TYPE_ANY, D1       ; Check if any type acceptable
    BEQ     CheckRegionSpace    ; Accept any type
    CMP.B   REGION_TYPE(A0), D1 ; Compare with preferred type
    BNE     NextRegion          ; Skip if type doesn't match
    
CheckRegionSpace:
    ; Check if region has enough free space
    CMP.L   REGION_FREE(A0), D0 ; Compare size with free space
    BGT     NextRegion          ; Skip if not enough space
    
    ; Allocate from this region
    MOVE.L  REGION_BASE(A0), A1 ; Get region base
    MOVE.L  REGION_SIZE(A0), D2 ; Get region size
    SUB.L   REGION_FREE(A0), D2 ; Calculate allocated offset
    ADD.L   D2, A1              ; Calculate allocation address
    
    ; Update region free space
    SUB.L   D0, REGION_FREE(A0) ; Decrease free space
    
    ; Update global allocation tracking
    ADD.L   D0, TotalAllocated  ; Add to total allocated
    ADDQ.L  #1, AllocationCount ; Increment allocation count
    
    MOVE.L  A1, D0              ; Return allocated address
    RTS
    
NextRegion:
    LEA     REGION_STRUCT_SIZE(A0), A0 ; Next region
    DBRA    D7, FindSuitableRegion ; Continue searching
    
    ; Allocation failed
    MOVEQ   #0, D0              ; Return null pointer
    RTS

AllocateAlignedMemory:
    ; Allocate memory with specific alignment
    ; Input: D0 = size, D1 = alignment
    ; Output: D0 = aligned address (0 if failed)
    
    ; Allocate extra space to ensure alignment
    MOVE.L  D0, D2              ; Save original size
    ADD.L   D1, D0              ; Add alignment to size
    SUBQ.L  #1, D0              ; Subtract 1 for rounding
    
    MOVE.B  #TYPE_ANY, D3       ; Accept any memory type
    JSR     AllocateMemory      ; Allocate oversized block
    TST.L   D0                  ; Check if allocation succeeded
    BEQ     AlignedAllocationFailed ; Branch if failed
    
    ; Align the returned address
    MOVE.L  D1, D3              ; Copy alignment
    SUBQ.L  #1, D3              ; Create alignment mask
    ADD.L   D3, D0              ; Add alignment-1
    NOT.L   D3                  ; Invert mask
    AND.L   D3, D0              ; Apply alignment mask
    
    RTS
    
AlignedAllocationFailed:
    MOVEQ   #0, D0              ; Return null
    RTS

SimulateVirtualMemory:
    ; Simulate virtual memory system with paging
    
    ; === PAGE TABLE SETUP ===
    ; Initialize virtual page table
    MOVE.L  #PageTable, A0      ; Page table base
    MOVE.L  #VIRTUAL_PAGES-1, D7 ; Page counter
    
InitPageTable:
    MOVE.L  #INVALID_PAGE, (A0)+ ; Mark page as invalid
    DBRA    D7, InitPageTable   ; Continue for all pages
    
    ; === VIRTUAL TO PHYSICAL MAPPING ===
    ; Map virtual pages to physical memory
    MOVE.L  #0, D0              ; Virtual page number
    MOVE.L  #PAGES_TO_MAP, D7   ; Number of pages to map
    MOVE.L  #$00100000, D1      ; Physical base address
    
MapVirtualPages:
    MOVE.L  #PageTable, A0      ; Page table base
    MOVE.L  D1, 0(A0,D0.L*4)    ; Map virtual to physical
    ADD.L   #PAGE_SIZE, D1      ; Next physical page
    ADDQ.L  #1, D0              ; Next virtual page
    DBRA    D7, MapVirtualPages ; Continue mapping
    
    ; === VIRTUAL MEMORY ACCESS ===
    ; Access memory through virtual addressing
    MOVE.L  #$00001000, D0      ; Virtual address
    JSR     TranslateVirtualAddress ; Translate to physical
    MOVE.L  D0, A0              ; Use physical address
    MOVE.L  #$DEADBEEF, (A0)    ; Write to virtual memory
    
    ; === PAGE FAULT SIMULATION ===
    ; Simulate page fault handling
    MOVE.L  #$00005000, D0      ; Unmapped virtual address
    JSR     TranslateVirtualAddress ; Attempt translation
    TST.L   D0                  ; Check if translation succeeded
    BNE     PageHit             ; Branch if successful
    
    ; Page fault occurred
    JSR     HandlePageFault     ; Handle page fault
    MOVE.B  #'F', PageFaultFlag ; Mark page fault occurred
    BRA     VirtualMemoryComplete
    
PageHit:
    MOVE.B  #'H', PageFaultFlag ; Mark page hit
    
VirtualMemoryComplete:
    RTS

TranslateVirtualAddress:
    ; Translate virtual address to physical address
    ; Input: D0 = virtual address
    ; Output: D0 = physical address (0 if invalid)
    
    MOVE.L  D0, D1              ; Copy virtual address
    LSR.L   #PAGE_SHIFT, D1     ; Extract page number
    CMP.L   #VIRTUAL_PAGES, D1  ; Check page bounds
    BGE     TranslationFailed   ; Branch if out of bounds
    
    ; Look up page in page table
    MOVE.L  #PageTable, A0      ; Page table base
    MOVE.L  0(A0,D1.L*4), D2    ; Load physical page address
    CMP.L   #INVALID_PAGE, D2   ; Check if page is valid
    BEQ     TranslationFailed   ; Branch if invalid
    
    ; Calculate physical address
    AND.L   #PAGE_MASK, D0      ; Extract page offset
    ADD.L   D2, D0              ; Add to physical page base
    RTS
    
TranslationFailed:
    MOVEQ   #0, D0              ; Return invalid address
    RTS

HandlePageFault:
    ; Handle virtual memory page fault
    ; Simplified implementation
    ADDQ.L  #1, PageFaultCount  ; Increment page fault counter
    RTS

OptimiseMemoryLayout:
    ; Optimise memory layout for cache performance
    
    ; === DATA STRUCTURE REORGANISATION ===
    ; Reorganise structures for cache efficiency
    MOVE.L  #OriginalStructArray, A0 ; Original layout
    MOVE.L  #OptimisedStructArray, A1 ; Optimised layout
    MOVE.L  #STRUCT_COUNT-1, D7 ; Structure counter
    
ReorganiseStructures:
    ; Copy frequently accessed fields together
    MOVE.L  ORIG_FIELD1(A0), OPTIM_FIELD1(A1) ; Hot field 1
    MOVE.L  ORIG_FIELD2(A0), OPTIM_FIELD2(A1) ; Hot field 2
    ; Cold fields stored separately
    
    LEA     ORIG_STRUCT_SIZE(A0), A0 ; Next original structure
    LEA     OPTIM_STRUCT_SIZE(A1), A1 ; Next optimised structure
    DBRA    D7, ReorganiseStructures ; Continue reorganisation
    
    ; === MEMORY PREFETCH OPTIMISATION ===
    ; Arrange data for optimal prefetch patterns
    MOVE.L  #PrefetchTestArray, A2 ; Test array
    MOVE.L  #PREFETCH_ELEMENTS-1, D7 ; Element counter
    
    ; Sequential access pattern (prefetch-friendly)
PrefetchOptimisedAccess:
    MOVE.L  (A2), D0            ; Load element (triggers prefetch)
    ADD.L   #1, D0              ; Process element
    MOVE.L  D0, (A2)+           ; Store and advance
    DBRA    D7, PrefetchOptimisedAccess ; Continue sequential access
    
    RTS

GenerateMemoryReports:
    ; Generate comprehensive memory usage reports
    
    ; === MEMORY UTILISATION REPORT ===
    ; Calculate memory statistics
    MOVE.L  #MemoryRegions, A0  ; Region table
    MOVE.L  #0, D0              ; Total memory
    MOVE.L  #0, D1              ; Total free memory
    MOVE.L  #MAX_REGIONS-1, D7  ; Region counter
    
MemoryStatsLoop:
    CMP.B   #TYPE_UNUSED, REGION_TYPE(A0) ; Check if region used
    BEQ     NextStatsRegion     ; Skip unused regions
    
    ADD.L   REGION_SIZE(A0), D0 ; Add to total memory
    ADD.L   REGION_FREE(A0), D1 ; Add to total free
    
NextStatsRegion:
    LEA     REGION_STRUCT_SIZE(A0), A0 ; Next region
    DBRA    D7, MemoryStatsLoop ; Continue for all regions
    
    MOVE.L  D0, TotalMemory     ; Store total memory
    MOVE.L  D1, TotalFree       ; Store total free
    
    ; Calculate utilisation percentage
    SUB.L   D1, D0              ; Calculate used memory
    MULU.W  #100, D0            ; Multiply by 100
    MOVE.L  TotalMemory, D2     ; Load total memory
    BEQ     NoMemoryStats       ; Skip if no memory
    DIVU.W  D2, D0              ; Calculate percentage
    MOVE.W  D0, MemoryUtilisationPercent ; Store percentage
    
NoMemoryStats:
    ; === FRAGMENTATION ANALYSIS ===
    ; Analyse memory fragmentation
    JSR     AnalyseFragmentation ; Analyse fragmentation
    
    ; === ALLOCATION PATTERN ANALYSIS ===
    ; Analyse allocation patterns
    MOVE.L  AllocationCount, D0 ; Number of allocations
    MOVE.L  TotalAllocated, D1  ; Total allocated bytes
    BEQ     NoAllocationStats   ; Skip if no allocations
    DIVU.W  D0, D1              ; Calculate average allocation size
    MOVE.W  D1, AverageAllocationSize ; Store average
    
NoAllocationStats:
    RTS

AnalyseFragmentation:
    ; Analyse memory fragmentation levels
    ; Simplified fragmentation metric
    MOVE.L  #50, FragmentationLevel ; Placeholder fragmentation level
    RTS

; Memory region structure offsets
REGION_BASE         EQU     0       ; Base address (long)
REGION_SIZE         EQU     4       ; Size (long)
REGION_FREE         EQU     8       ; Free space (long)
REGION_TYPE         EQU     12      ; Type (byte)
REGION_STRUCT_SIZE  EQU     16      ; Structure size

; Memory types
TYPE_UNUSED         EQU     0
TYPE_CHIP_RAM       EQU     1
TYPE_FAST_RAM       EQU     2
TYPE_ANY            EQU     255

; Original structure offsets (cache-unfriendly layout)
ORIG_FIELD1         EQU     0       ; Hot field 1
ORIG_COLD_FIELD1    EQU     4       ; Cold field 1
ORIG_FIELD2         EQU     8       ; Hot field 2
ORIG_COLD_FIELD2    EQU     12      ; Cold field 2
ORIG_STRUCT_SIZE    EQU     16

; Optimised structure offsets (cache-friendly layout)
OPTIM_FIELD1        EQU     0       ; Hot field 1
OPTIM_FIELD2        EQU     4       ; Hot field 2
OPTIM_STRUCT_SIZE   EQU     8       ; Hot fields only

; Constants
MAX_REGIONS         EQU     8
GRAPHICS_BUFFER_SIZE EQU    64000   ; Graphics buffer size
COMPUTE_BUFFER_SIZE EQU     32768   ; Computation buffer size
SMALL_BUFFER_SIZE   EQU     256     ; Small buffer size
ALIGNED_BUFFER_SIZE EQU     4096    ; Aligned buffer size
PAGE_SIZE           EQU     4096    ; Virtual memory page size
PAGE_SHIFT          EQU     12      ; Bits to shift for page number
PAGE_MASK           EQU     4095    ; Mask for page offset
VIRTUAL_PAGES       EQU     1024    ; Number of virtual pages
PAGES_TO_MAP        EQU     16      ; Pages to map initially
INVALID_PAGE        EQU     $FFFFFFFF ; Invalid page marker
STRUCT_COUNT        EQU     32      ; Number of structures
PREFETCH_ELEMENTS   EQU     64      ; Prefetch test elements

; Data structures
MemoryRegions:      DS.B    MAX_REGIONS*REGION_STRUCT_SIZE
PageTable:          DS.L    VIRTUAL_PAGES
SmallBufferArray:   DS.L    10      ; Array of small buffer addresses
OriginalStructArray: DS.B   STRUCT_COUNT*ORIG_STRUCT_SIZE
OptimisedStructArray: DS.B  STRUCT_COUNT*OPTIM_STRUCT_SIZE
PrefetchTestArray:  DS.L    PREFETCH_ELEMENTS

; Results and statistics
GraphicsBuffer:     DC.L    0
ComputeBuffer:      DC.L    0
AlignedBuffer:      DC.L    0
TotalAllocated:     DC.L    0
AllocationCount:    DC.L    0
PageFaultCount:     DC.L    0
PageFaultFlag:      DC.B    0
TotalMemory:        DC.L    0
TotalFree:          DC.L    0
MemoryUtilisationPercent: DC.W 0
AverageAllocationSize: DC.W 0
FragmentationLevel: DC.L    0

; Challenge exercises:
; 1. Implement dynamic memory allocation with coalescing
; 2. Add memory protection with read/write permissions
; 3. Create virtual memory swapping to disk simulation
; 4. Implement garbage collection for automatic memory management"
  language="assembly"
/>

## What You've Learned

In this lesson, you've discovered:

1. **Linear Address Space** - The 68000's elegant 32-bit addressing and memory organisation
2. **Amiga Memory Architecture** - Chip RAM, Fast RAM, and the sophisticated memory map
3. **Advanced Addressing** - Sophisticated memory access patterns using 68000 addressing modes
4. **Memory Allocation** - Static and dynamic allocation strategies for efficient memory use
5. **Performance Optimisation** - Cache-friendly programming and memory layout techniques

## Looking Ahead

Next, you'll explore the Amiga's memory map and regions in detail - learning how the custom chips, ROM, and different memory types work together to create the Amiga's unique capabilities. You'll discover how to leverage these different memory regions for optimal performance!

## Fun Fact

The 68000's linear memory model was revolutionary in 1979, eliminating the complex segmentation that plagued contemporary processors. While Intel's 8086 required programmers to manage 64KB segments with complicated far and near pointers, the 68000 provided a clean, flat 4GB address space that made programming much more elegant. The Amiga's memory architecture took this further, creating distinct memory regions optimised for different purposes: Chip RAM that could be accessed by the custom graphics and audio chips for zero-wait-state multimedia operations, and Fast RAM for CPU-intensive calculations. This sophisticated memory hierarchy enabled the Amiga to achieve graphics and audio performance that seemed impossible on other home computers of the era, making it the preferred platform for multimedia applications, video production, and advanced games throughout the late 1980s and 1990s!