---
title: "Code Optimization and Performance"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 31
description: "Master advanced optimization techniques to maximize NES performance! Learn memory optimization, cycle counting, efficient algorithms, and professional techniques to make Sprite Symphony run smoothly at 60 FPS."
learning_objectives:
  - "Understand NES performance constraints and optimization opportunities"
  - "Apply memory optimization techniques for efficient RAM usage"
  - "Master cycle counting and timing optimization for 60 FPS performance"
  - "Implement efficient algorithms and data structures for real-time applications"
  - "Polish Sprite Symphony with professional-level performance optimization"
concepts:
  - "Performance analysis and bottleneck identification"
  - "Memory optimization and efficient data organization"
  - "CPU cycle optimization and timing analysis"
  - "Algorithm efficiency and real-time programming"
  - "Professional optimization practices and techniques"
estimated_duration: "45-60 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 31
---

# Lesson 31: Code Optimization and Performance

Perfect your NES programming skills with advanced optimization! This lesson teaches you how to analyze performance, optimize memory usage, and apply professional techniques to make Sprite Symphony run flawlessly within the NES's constraints.

## NES Performance Constraints and Analysis

Understanding the NES limitations helps you optimize effectively:

```text
NES Performance Constraints:
============================

CPU Performance:
- 1.79 MHz 6502 processor
- ~29,780 cycles per frame (at 60 FPS)
- 1 cycle per simple instruction
- 2-7 cycles per complex instruction

Memory Limitations:
- 2KB internal RAM ($0000-$07FF)
- Zero Page (fastest): $00-$FF
- Stack: $0100-$01FF
- General RAM: $0200-$07FF

Timing Requirements:
- 60 FPS = 16.67ms per frame
- VBlank period: ~2,270 cycles
- Must complete updates within VBlank
- Real-time audio and input processing

Optimization Opportunities:
- Zero page addressing (faster, smaller)
- Efficient loop structures
- Minimized memory access
- Optimized algorithm selection
- Strategic use of registers
```

Performance analysis framework for systematic optimization:

```assembly
; Performance Analysis Framework
; ==============================

; Cycle counting macros for performance measurement
CYCLES_START = *        ; Mark start of code section
CYCLES_END = *          ; Mark end of code section

; Performance measurement system
PerformanceMeter:
    .struct
        FrameCycles: .word      ; Cycles used this frame
        PeakCycles: .word       ; Highest cycle count seen
        AverageCycles: .word    ; Running average
        FrameCounter: .byte     ; Frame counter for averaging
        OverrunFlag: .byte      ; Flag for cycle budget overruns
    .endstruct

; Critical path analysis
AnalyzeCriticalPath:
    ; Identify performance-critical code sections
    ; 1. NMI handler (must complete within VBlank)
    ; 2. Audio update (real-time requirements)
    ; 3. Input processing (responsiveness)
    ; 4. Main game loop (60 FPS target)
    
    ; Measure cycle usage for each section
    JSR MeasureNMIPerformance
    JSR MeasureAudioPerformance
    JSR MeasureInputPerformance
    JSR MeasureMainLoopPerformance
    
    RTS

MeasureNMIPerformance:
    ; Measure NMI handler performance
    ; Critical: Must complete within ~2,270 cycles
    
    ; Start measurement
    LDA CycleCounterLow
    STA StartCycles
    LDA CycleCounterHigh
    STA StartCycles+1
    
    ; Execute NMI tasks
    JSR OptimizedNMIHandler
    
    ; End measurement
    LDA CycleCounterLow
    SEC
    SBC StartCycles
    STA NMICycles
    LDA CycleCounterHigh
    SBC StartCycles+1
    STA NMICycles+1
    
    ; Check for VBlank overrun
    LDA NMICycles+1
    BNE VBlankOverrun
    LDA NMICycles
    CMP #$DE            ; ~2,270 cycles in hex
    BCC VBlankOK
    
VBlankOverrun:
    ; VBlank budget exceeded - optimization needed
    INC OverrunCounter
    
VBlankOK:
    RTS

; Optimized NMI handler
OptimizedNMIHandler:
    ; Highly optimized VBlank processing
    
    ; Save registers (6 cycles)
    PHA                 ; 3 cycles
    TXA                 ; 2 cycles
    PHA                 ; 3 cycles
    TYA                 ; 2 cycles
    PHA                 ; 3 cycles
                        ; Total: 13 cycles
    
    ; OAM DMA transfer (513 cycles + 1-2 for alignment)
    LDA #$02            ; 2 cycles
    STA $4014           ; 4 cycles
                        ; OAM DMA: 513 cycles
                        ; Total: 519 cycles
    
    ; Optimized scroll update (12 cycles)
    LDA ScrollX         ; 3 cycles (zero page)
    STA $2005           ; 4 cycles
    LDA ScrollY         ; 3 cycles (zero page)
    STA $2005           ; 4 cycles
                        ; Total: 14 cycles
    
    ; Optimized palette updates (if needed)
    LDA PaletteUpdateFlag   ; 3 cycles (zero page)
    BEQ SkipPalette         ; 2 cycles (not taken)
    JSR FastPaletteUpdate   ; ~200 cycles if needed
    
SkipPalette:
    ; Frame completion flag
    INC FrameComplete   ; 5 cycles (zero page)
    
    ; Restore registers (9 cycles)
    PLA                 ; 4 cycles
    TAY                 ; 2 cycles
    PLA                 ; 4 cycles
    TAX                 ; 2 cycles
    PLA                 ; 4 cycles
    RTI                 ; 6 cycles
                        ; Total: 22 cycles
    
    ; Total worst case: ~750 cycles (well within budget)
    
; Performance measurement variables (in zero page)
StartCycles = $10       ; Zero page for fast access
NMICycles = $12
CycleCounterLow = $14
CycleCounterHigh = $15
OverrunCounter = $16
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Performance Analysis and Measurement"
  code="; NES Performance Analysis and Optimization
Main:
    JSR InitPerformanceSystem
    
OptimizedGameLoop:
    JSR StartFrameTiming
    JSR ProcessInputOptimized
    JSR UpdateGameOptimized
    JSR WaitForVBlank
    JSR AnalyzeFramePerformance
    JMP OptimizedGameLoop

InitPerformanceSystem:
    ; Initialize performance monitoring
    LDA #$00
    STA FrameCycles
    STA FrameCycles+1
    STA PeakCycles
    STA PeakCycles+1
    STA OverrunCount
    STA OptimizationLevel
    RTS

StartFrameTiming:
    ; Begin frame performance measurement
    LDA FrameCounter
    STA FrameStart
    INC FrameCounter
    RTS

ProcessInputOptimized:
    ; Optimized input processing
    ; Using zero page for speed
    
    ; Fast controller read (optimized)
    LDA #$01            ; 2 cycles
    STA $4016           ; 4 cycles - strobe
    LDA #$00            ; 2 cycles
    STA $4016           ; 4 cycles - release
    
    ; Optimized 8-bit read using loop unrolling
    ; Instead of loop, unroll for speed
    LDA $4016           ; 4 cycles - bit 0
    ROR                 ; 2 cycles
    ROR InputData       ; 5 cycles
    
    LDA $4016           ; 4 cycles - bit 1
    ROR                 ; 2 cycles
    ROR InputData       ; 5 cycles
    
    LDA $4016           ; 4 cycles - bit 2
    ROR                 ; 2 cycles
    ROR InputData       ; 5 cycles
    
    LDA $4016           ; 4 cycles - bit 3
    ROR                 ; 2 cycles
    ROR InputData       ; 5 cycles
    
    ; Continue for all 8 bits...
    ; Total: ~80 cycles vs ~120 cycles for loop
    
    ; Fast input change detection
    LDA InputData       ; 3 cycles (zero page)
    EOR PrevInput       ; 3 cycles (zero page)
    AND InputData       ; 3 cycles
    STA NewPresses      ; 3 cycles (zero page)
    
    ; Store for next frame
    LDA InputData       ; 3 cycles
    STA PrevInput       ; 3 cycles
    
    RTS

UpdateGameOptimized:
    ; Optimized game logic update
    JSR UpdateAudioOptimized
    JSR UpdateSpritesOptimized
    JSR UpdateGameStateOptimized
    RTS

UpdateAudioOptimized:
    ; Highly optimized audio update
    
    ; Fast active note check using bit manipulation
    LDA ActiveNotes     ; 3 cycles (zero page)
    BEQ AudioDone       ; 2 cycles if no notes active
    
    ; Process only active notes
    LDX #$00            ; 2 cycles
    
AudioUpdateLoop:
    ; Check if this note is active
    ASL ActiveNotes     ; 5 cycles (shift left, bit 7 to carry)
    BCC NextNote        ; 2 cycles if not active
    
    ; Update active note
    DEC NoteTimers,X    ; 6 cycles
    BNE NextNote        ; 2 cycles if still active
    
    ; Note finished - clear from active mask
    LDA NoteBitMasks,X  ; 4 cycles
    EOR #$FF            ; 2 cycles (invert)
    AND ActiveNotesMask ; 3 cycles (zero page)
    STA ActiveNotesMask ; 3 cycles
    
NextNote:
    INX                 ; 2 cycles
    CPX #$04            ; 2 cycles
    BNE AudioUpdateLoop ; 3 cycles
    
AudioDone:
    RTS

UpdateSpritesOptimized:
    ; Optimized sprite update using efficient loops
    
    ; Use zero page pointer for fast sprite access
    LDA #<SpriteOAM     ; 2 cycles
    STA SpritePtr       ; 3 cycles (zero page)
    LDA #>SpriteOAM     ; 2 cycles
    STA SpritePtr+1     ; 3 cycles
    
    ; Process sprites efficiently
    LDY #$00            ; 2 cycles
    LDX #$00            ; 2 cycles
    
SpriteUpdateLoop:
    ; Check if sprite is active
    LDA ActiveSprites   ; 3 cycles (zero page)
    AND SpriteBitMasks,X ; 4 cycles
    BEQ NextSprite      ; 2 cycles if inactive
    
    ; Update active sprite using pointer
    LDA SpriteY,X       ; 4 cycles
    STA (SpritePtr),Y   ; 6 cycles - Y position
    INY                 ; 2 cycles
    
    LDA SpriteTile,X    ; 4 cycles
    STA (SpritePtr),Y   ; 6 cycles - Tile
    INY                 ; 2 cycles
    
    LDA SpriteAttr,X    ; 4 cycles
    STA (SpritePtr),Y   ; 6 cycles - Attributes
    INY                 ; 2 cycles
    
    LDA SpriteX,X       ; 4 cycles
    STA (SpritePtr),Y   ; 6 cycles - X position
    INY                 ; 2 cycles
    
    JMP SpriteUpdated   ; 3 cycles
    
NextSprite:
    ; Skip inactive sprite
    INY                 ; 2 cycles
    INY                 ; 2 cycles
    INY                 ; 2 cycles
    INY                 ; 2 cycles (skip 4 bytes)
    
SpriteUpdated:
    INX                 ; 2 cycles
    CPX #$08            ; 2 cycles (8 sprites max)
    BNE SpriteUpdateLoop ; 3 cycles
    
    RTS

UpdateGameStateOptimized:
    ; Optimized game state updates
    
    ; Fast mode checking using jump table
    LDA GameMode        ; 3 cycles (zero page)
    ASL                 ; 2 cycles (multiply by 2 for word addresses)
    TAY                 ; 2 cycles
    
    ; Jump table dispatch (faster than multiple CMP/BEQ)
    LDA ModeJumpTable,Y ; 4 cycles
    STA JumpAddr        ; 3 cycles (zero page)
    LDA ModeJumpTable+1,Y ; 4 cycles
    STA JumpAddr+1      ; 3 cycles
    
    JMP (JumpAddr)      ; 5 cycles - indirect jump
    
UpdateModeDemo:
    ; Optimized demo mode update
    INC DemoTimer       ; 5 cycles (zero page)
    LDA DemoTimer       ; 3 cycles
    AND #$1F            ; 2 cycles (every 32 frames)
    BNE DemoDone        ; 2 cycles
    
    ; Play next demo note
    LDY DemoPosition    ; 3 cycles (zero page)
    LDA DemoSequence,Y  ; 4 cycles
    CMP #$FF            ; 2 cycles
    BEQ ResetDemo       ; 2 cycles
    
    JSR PlayNoteOptimized ; Call optimized note player
    INC DemoPosition    ; 5 cycles (zero page)
    
DemoDone:
    RTS

ResetDemo:
    LDA #$00            ; 2 cycles
    STA DemoPosition    ; 3 cycles (zero page)
    RTS

UpdateModePlay:
    ; Optimized play mode
    JSR ProcessPlayInputOptimized
    RTS

UpdateModeCompose:
    ; Optimized compose mode
    JSR ProcessComposeInputOptimized
    RTS

PlayNoteOptimized:
    ; Highly optimized note playing
    TAX                 ; 2 cycles
    
    ; Direct register writes (fastest)
    LDA NoteFreqLow,X   ; 4 cycles
    STA $4002           ; 4 cycles
    LDA NoteFreqHigh,X  ; 4 cycles
    STA $4003           ; 4 cycles
    LDA #%10111111      ; 2 cycles
    STA $4000           ; 4 cycles
    
    ; Fast visual update
    JSR CreateNoteVisualOptimized
    
    RTS

CreateNoteVisualOptimized:
    ; Optimized visual creation
    TXA                 ; 2 cycles
    ASL                 ; 2 cycles
    ASL                 ; 2 cycles (multiply by 4)
    TAY                 ; 2 cycles
    
    ; Direct sprite data writes
    LDA NotePosY,X      ; 4 cycles
    STA SpriteOAM,Y     ; 5 cycles
    LDA NoteTiles,X     ; 4 cycles
    STA SpriteOAM+1,Y   ; 5 cycles
    LDA #%00000001      ; 2 cycles
    STA SpriteOAM+2,Y   ; 5 cycles
    LDA #$80            ; 2 cycles
    STA SpriteOAM+3,Y   ; 5 cycles
    
    RTS

WaitForVBlank:
    ; Efficient VBlank wait
    LDA FrameComplete   ; 3 cycles (zero page flag set by NMI)
    BEQ WaitForVBlank   ; 2 cycles (loop until NMI sets flag)
    
    LDA #$00            ; 2 cycles
    STA FrameComplete   ; 3 cycles (clear flag)
    
    RTS

AnalyzeFramePerformance:
    ; Analyze frame performance
    LDA FrameCounter    ; 3 cycles
    SEC                 ; 2 cycles
    SBC FrameStart      ; 3 cycles
    STA CurrentFrameCycles ; 3 cycles
    
    ; Check for new peak
    CMP PeakCycles      ; 3 cycles
    BCC AnalyzeDone     ; 2 cycles
    STA PeakCycles      ; 3 cycles
    
AnalyzeDone:
    RTS

ProcessPlayInputOptimized:
    ; Optimized play input processing
    LDA NewPresses      ; 3 cycles (zero page)
    BEQ PlayInputDone   ; 2 cycles
    
    ; Fast input mapping using lookup table
    LDX #$03            ; 2 cycles
    
InputMapLoop:
    ASL NewPresses      ; 5 cycles (shift left, bit 7 to carry)
    BCC NextInputBit    ; 2 cycles
    
    ; This bit is pressed - play corresponding note
    LDA InputToNote,X   ; 4 cycles
    JSR PlayNoteOptimized
    
NextInputBit:
    DEX                 ; 2 cycles
    BPL InputMapLoop    ; 3 cycles
    
PlayInputDone:
    RTS

ProcessComposeInputOptimized:
    ; Optimized compose input (simplified)
    RTS

; Performance optimization data
ModeJumpTable:
    .word UpdateModeDemo
    .word UpdateModePlay
    .word UpdateModeCompose
    .word UpdateModePlay   ; Default

InputToNote:
    .byte $07, $04, $02, $00  ; Map directional input to notes

NoteBitMasks:
    .byte %00000001, %00000010, %00000100, %00001000

SpriteBitMasks:
    .byte %00000001, %00000010, %00000100, %00001000
    .byte %00010000, %00100000, %01000000, %10000000

NoteFreqLow:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

NoteFreqHigh:
    .byte $08, $08, $08, $08, $08, $08, $08, $08

NotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

NoteTiles:
    .byte $10, $11, $12, $13, $14, $15, $16, $17

DemoSequence:
    .byte $00, $02, $04, $05, $07, $05, $04, $02, $00, $FF

; Zero page variables for performance
InputData = $10
PrevInput = $11
NewPresses = $12
GameMode = $13
DemoTimer = $14
DemoPosition = $15
FrameComplete = $16
FrameCounter = $17
FrameStart = $18
SpritePtr = $19      ; 2 bytes
JumpAddr = $1B       ; 2 bytes
ActiveNotes = $1D
ActiveNotesMask = $1E
ActiveSprites = $1F

; Performance tracking variables
FrameCycles: .word $0000
PeakCycles: .word $0000
CurrentFrameCycles: .byte $00
OverrunCount: .byte $00
OptimizationLevel: .byte $00

; Note and sprite data
NoteTimers: .byte $00, $00, $00, $00
SpriteY: .byte $80, $80, $80, $80, $80, $80, $80, $80
SpriteTile: .byte $10, $11, $12, $13, $14, $15, $16, $17
SpriteAttr: .byte $01, $01, $01, $01, $01, $01, $01, $01
SpriteX: .byte $40, $50, $60, $70, $80, $90, $A0, $B0

; Sprite OAM buffer
SpriteOAM:
    .byte $FF, $10, $01, $40  ; Sprite 0
    .byte $FF, $11, $01, $50  ; Sprite 1
    .byte $FF, $12, $01, $60  ; Sprite 2
    .byte $FF, $13, $01, $70  ; Sprite 3"
  language="assembly"
/>

## Memory Optimization Techniques

Maximize the efficiency of the NES's limited 2KB RAM:

```assembly
; Memory Optimization Strategies
; ==============================

; 1. Zero Page Optimization
; Zero page ($00-$FF) is fastest memory - use for critical variables

; Strategic zero page allocation
ZeroPageVars:
    ; Most frequently accessed variables
    GameState = $10         ; Current game state (accessed every frame)
    InputCurrent = $11      ; Current input (accessed every frame)
    InputPrevious = $12     ; Previous input (accessed every frame)
    FrameCount = $13        ; Frame counter (accessed every frame)
    
    ; Pointers for indirect addressing
    DataPtr = $14           ; General purpose pointer (2 bytes)
    SpritePtr = $16         ; Sprite data pointer (2 bytes)
    AudioPtr = $18          ; Audio data pointer (2 bytes)
    
    ; Temporary calculation variables
    TempA = $1A             ; Temporary storage
    TempB = $1B             ; Temporary storage
    TempC = $1C             ; Temporary storage

; 2. Data Structure Optimization
; Organize data for efficient access patterns

; Structure of Arrays (SoA) vs Array of Structures (AoS)
; SoA is often more efficient for NES

; Inefficient: Array of Structures
; SpriteData: Y, Tile, Attr, X, Y, Tile, Attr, X, ...

; Efficient: Structure of Arrays
SpriteDataOptimized:
    SpriteY:    .byte $80, $90, $A0, $B0, $C0, $D0, $E0, $F0
    SpriteTile: .byte $10, $11, $12, $13, $14, $15, $16, $17
    SpriteAttr: .byte $01, $01, $02, $02, $03, $03, $04, $04
    SpriteX:    .byte $40, $50, $60, $70, $80, $90, $A0, $B0

; Benefits:
; - Can process all Y coordinates with simple indexed loop
; - Better cache-like behavior on 6502
; - Easier to update specific attributes across all sprites

; 3. Bit Packing for Boolean Data
; Pack multiple boolean flags into single bytes

GameFlags:
    ; Pack 8 boolean flags into one byte
    ; Bit 0: Player alive
    ; Bit 1: Game paused
    ; Bit 2: Music playing
    ; Bit 3: Demo mode
    ; Bit 4: High score achieved
    ; Bit 5: Sound enabled
    ; Bit 6: Unlocked play mode
    ; Bit 7: Unlocked compose mode
    .byte %00000000

; Efficient flag operations
SetPlayerAlive:
    LDA GameFlags
    ORA #%00000001      ; Set bit 0
    STA GameFlags
    RTS

ClearPlayerAlive:
    LDA GameFlags
    AND #%11111110      ; Clear bit 0
    STA GameFlags
    RTS

CheckPlayerAlive:
    LDA GameFlags
    AND #%00000001      ; Test bit 0
    RTS                 ; Z flag set if dead, clear if alive

; 4. Memory Pool Management
; Manage dynamic objects efficiently

; Object pool for notes
MAX_NOTES = $08
NotePool:
    ActiveNotes:    .byte $00           ; Bitmask of active notes
    NoteTypes:      .byte $00, $00, $00, $00, $00, $00, $00, $00
    NoteDurations:  .byte $00, $00, $00, $00, $00, $00, $00, $00
    NoteFreqs:      .byte $00, $00, $00, $00, $00, $00, $00, $00

AllocateNote:
    ; Find free note slot efficiently
    LDA ActiveNotes
    LDX #$00
    
FindFreeNote:
    LSR                 ; Shift right, bit 0 to carry
    BCC FoundFreeNote   ; Carry clear = bit was 0 = free
    INX
    CPX #MAX_NOTES
    BNE FindFreeNote
    
    ; No free notes
    LDX #$FF
    RTS
    
FoundFreeNote:
    ; X contains free note index
    ; Mark as allocated
    LDA NoteBitMasks,X
    ORA ActiveNotes
    STA ActiveNotes
    RTS

FreeNote:
    ; Free note X
    LDA NoteBitMasks,X
    EOR #$FF            ; Invert mask
    AND ActiveNotes     ; Clear bit
    STA ActiveNotes
    RTS

; 5. Lookup Tables vs Calculations
; Pre-calculate expensive operations

; Example: Sine wave lookup table for smooth movement
SineTable:
    .byte $80, $83, $86, $89, $8C, $8F, $92, $95
    .byte $98, $9B, $9E, $A1, $A4, $A6, $A9, $AC
    .byte $AE, $B1, $B3, $B6, $B8, $BA, $BC, $BE
    .byte $C0, $C2, $C3, $C5, $C6, $C8, $C9, $CA
    .byte $CB, $CC, $CD, $CD, $CE, $CE, $CE, $CE
    .byte $CE, $CE, $CE, $CE, $CD, $CD, $CC, $CB
    .byte $CA, $C9, $C8, $C6, $C5, $C3, $C2, $C0
    .byte $BE, $BC, $BA, $B8, $B6, $B3, $B1, $AE
    .byte $AC, $A9, $A6, $A4, $A1, $9E, $9B, $98
    .byte $95, $92, $8F, $8C, $89, $86, $83, $80
    .byte $7D, $7A, $77, $74, $71, $6E, $6B, $68
    .byte $65, $62, $5F, $5C, $59, $57, $54, $51
    .byte $4F, $4C, $4A, $47, $45, $43, $41, $3F
    .byte $3D, $3B, $3A, $38, $37, $35, $34, $33
    .byte $32, $31, $30, $30, $2F, $2F, $2F, $2F
    .byte $2F, $2F, $2F, $2F, $30, $30, $31, $32
    .byte $33, $34, $35, $37, $38, $3A, $3B, $3D
    .byte $3F, $41, $43, $45, $47, $4A, $4C, $4F
    .byte $51, $54, $57, $59, $5C, $5F, $62, $65
    .byte $68, $6B, $6E, $71, $74, $77, $7A, $7D

GetSineValue:
    ; Input: A = angle (0-255)
    ; Output: A = sine value (0-255)
    TAX
    LDA SineTable,X
    RTS

; 6. Efficient String/Text Storage
; Optimize text display data

; Packed text for menu items
MenuText:
    ; Pack text efficiently - use tiles directly
    .byte $44, $45, $4D, $4F, $00    ; "DEMO" + terminator
    .byte $50, $4C, $41, $59, $00    ; "PLAY" + terminator
    .byte $43, $4F, $4D, $50, $00    ; "COMP" + terminator

; Text rendering with optimized loop
RenderMenuText:
    ; A = menu item index
    ASL
    ASL                 ; * 4 (assume 4 chars per item)
    TAY
    
    LDX #$00
    
RenderTextLoop:
    LDA MenuText,Y
    BEQ TextDone        ; Terminator found
    STA TextSprites,X   ; Store in sprite buffer
    INY
    INX
    CPX #$04            ; Max 4 characters
    BNE RenderTextLoop
    
TextDone:
    RTS

; Performance monitoring
MemoryUsageMap:
    ; Track memory usage by category
    ZeroPageUsed:   .byte $20    ; 32 bytes used
    StackUsed:      .byte $40    ; 64 bytes used (estimated)
    GameDataUsed:   .byte $C0    ; 192 bytes used
    SpriteDataUsed: .byte $80    ; 128 bytes used
    AudioDataUsed:  .byte $60    ; 96 bytes used
    FreeRAM:        .byte $E0    ; 224 bytes free

; Memory optimization utilities
CheckMemoryUsage:
    ; Calculate total memory usage
    LDA ZeroPageUsed
    CLC
    ADC StackUsed
    CLC
    ADC GameDataUsed
    CLC
    ADC SpriteDataUsed
    CLC
    ADC AudioDataUsed
    STA TotalMemoryUsed
    
    ; Calculate free memory
    LDA #$00            ; Total RAM = 2048 bytes = $800
    SEC
    SBC TotalMemoryUsed
    STA FreeMemory
    
    RTS

; Bit manipulation utilities
NoteBitMasks:
    .byte %00000001, %00000010, %00000100, %00001000
    .byte %00010000, %00100000, %01000000, %10000000

TotalMemoryUsed: .byte $00
FreeMemory: .byte $00
TextSprites: .byte $00, $00, $00, $00
```

## Algorithm Optimization and Efficient Data Structures

Implement algorithms optimized for real-time NES performance:

```assembly
; Algorithm Optimization for NES
; ==============================

; 1. Efficient Sorting Algorithms
; For small datasets (typical on NES), insertion sort is often fastest

; Optimized insertion sort for note priorities
SortNotesByPriority:
    ; Sort 8 notes by priority (small dataset)
    LDX #$01            ; Start with second element
    
SortOuterLoop:
    LDA NotePriorities,X    ; Current element
    STA SortKey
    STX SortIndex
    
    ; Find insertion position
    LDY SortIndex
    DEY                 ; Y = index - 1
    
SortInnerLoop:
    CPY #$FF            ; Check if Y wrapped to 255 (was 0)
    BEQ InsertHere
    
    LDA NotePriorities,Y
    CMP SortKey
    BCC InsertHere      ; Found position
    
    ; Shift element right
    LDA NotePriorities,Y
    STA NotePriorities+1,Y
    LDA NoteIndices,Y
    STA NoteIndices+1,Y
    
    DEY
    JMP SortInnerLoop
    
InsertHere:
    INY                 ; Adjust for insertion position
    LDA SortKey
    STA NotePriorities,Y
    LDX SortIndex
    LDA NoteIndices,X
    STA NoteIndices,Y
    
    INX
    CPX #$08            ; 8 notes total
    BNE SortOuterLoop
    
    RTS

; 2. Fast Collision Detection
; Axis-Aligned Bounding Box (AABB) collision

CheckSpriteCollision:
    ; Check collision between sprites A and B
    ; Input: X = sprite A index, Y = sprite B index
    
    ; Get sprite A bounds
    LDA SpriteX,X
    STA SpriteALeft
    CLC
    ADC #$08            ; Assume 8x8 sprites
    STA SpriteARight
    
    LDA SpriteY,X
    STA SpriteATop
    CLC
    ADC #$08
    STA SpriteABottom
    
    ; Get sprite B bounds
    LDA SpriteX,Y
    STA SpriteBLeft
    CLC
    ADC #$08
    STA SpriteBRight
    
    LDA SpriteY,Y
    STA SpriteBTop
    CLC
    ADC #$08
    STA SpriteBBottom
    
    ; Check for separation (no collision)
    LDA SpriteARight
    CMP SpriteBLeft
    BCC NoCollision     ; A is left of B
    
    LDA SpriteBRight
    CMP SpriteALeft
    BCC NoCollision     ; B is left of A
    
    LDA SpriteABottom
    CMP SpriteBTop
    BCC NoCollision     ; A is above B
    
    LDA SpriteBBottom
    CMP SpriteATop
    BCC NoCollision     ; B is above A
    
    ; Collision detected
    LDA #$01
    RTS
    
NoCollision:
    LDA #$00
    RTS

; 3. Efficient Queue Implementation
; Circular buffer for audio event queue

QUEUE_SIZE = $10        ; 16 events max

AudioEventQueue:
    QueueData:      .byte $00, $00, $00, $00, $00, $00, $00, $00
                    .byte $00, $00, $00, $00, $00, $00, $00, $00
    QueueHead:      .byte $00
    QueueTail:      .byte $00
    QueueCount:     .byte $00

EnqueueAudioEvent:
    ; Add event A to queue
    LDX QueueCount
    CPX #QUEUE_SIZE
    BCS QueueFull       ; Queue is full
    
    LDY QueueTail
    STA QueueData,Y
    
    ; Advance tail pointer
    INY
    TYA
    AND #$0F            ; Wrap at 16
    STA QueueTail
    
    INC QueueCount
    RTS
    
QueueFull:
    ; Handle queue overflow
    RTS

DequeueAudioEvent:
    ; Remove and return event from queue
    LDA QueueCount
    BEQ QueueEmpty      ; Queue is empty
    
    LDY QueueHead
    LDA QueueData,Y
    PHA                 ; Save return value
    
    ; Advance head pointer
    INY
    TYA
    AND #$0F            ; Wrap at 16
    STA QueueHead
    
    DEC QueueCount
    PLA                 ; Restore return value
    RTS
    
QueueEmpty:
    LDA #$FF            ; Return error value
    RTS

; 4. Binary Search for Large Lookup Tables
; When linear search becomes too slow

BinarySearchFreqTable:
    ; Search for frequency value in sorted table
    ; Input: A = target frequency
    ; Output: X = index, or $FF if not found
    
    STA SearchTarget
    LDA #$00
    STA SearchLow
    LDA #$1F            ; 32 entries - 1
    STA SearchHigh
    
BinarySearchLoop:
    ; Check if search range is valid
    LDA SearchLow
    CMP SearchHigh
    BEQ CheckLastElement
    BCS NotFound
    
    ; Calculate middle index
    LDA SearchLow
    CLC
    ADC SearchHigh
    LSR                 ; Divide by 2
    STA SearchMid
    
    ; Compare with target
    TAX
    LDA FrequencyTable,X
    CMP SearchTarget
    BEQ Found           ; Exact match
    BCC SearchUpper     ; Target is higher
    
    ; Target is lower
    LDA SearchMid
    SEC
    SBC #$01
    STA SearchHigh
    JMP BinarySearchLoop
    
SearchUpper:
    LDA SearchMid
    CLC
    ADC #$01
    STA SearchLow
    JMP BinarySearchLoop
    
CheckLastElement:
    LDX SearchLow
    LDA FrequencyTable,X
    CMP SearchTarget
    BEQ Found
    
NotFound:
    LDX #$FF
    RTS
    
Found:
    ; X already contains the index
    RTS

; 5. State Machine Optimization
; Table-driven state machines for efficiency

; State machine data
StateFunctionTable:
    .word HandleStateTitle
    .word HandleStateMenu
    .word HandleStatePlay
    .word HandleStateCompose

StateTransitionTable:
    ; Current state, input, next state
    .byte STATE_TITLE, INPUT_A, STATE_MENU
    .byte STATE_MENU, INPUT_UP, STATE_MENU
    .byte STATE_MENU, INPUT_DOWN, STATE_MENU
    .byte STATE_MENU, INPUT_A, STATE_PLAY
    .byte STATE_PLAY, INPUT_B, STATE_MENU
    .byte $FF           ; Terminator

OptimizedStateMachine:
    ; Process current state
    LDA CurrentState
    ASL                 ; Multiply by 2 for word table
    TAY
    
    LDA StateFunctionTable,Y
    STA StateFunction
    LDA StateFunctionTable+1,Y
    STA StateFunction+1
    
    JSR CallStateFunction
    
    ; Process state transitions
    JSR ProcessStateTransitions
    
    RTS

ProcessStateTransitions:
    ; Check transition table
    LDY #$00
    
TransitionLoop:
    LDA StateTransitionTable,Y
    CMP #$FF            ; End of table?
    BEQ TransitionDone
    
    CMP CurrentState    ; Match current state?
    BNE NextTransition
    
    INY
    LDA StateTransitionTable,Y  ; Check input
    AND NewInput        ; Mask with current input
    BEQ NextTransition
    
    INY
    LDA StateTransitionTable,Y  ; Get next state
    STA CurrentState
    RTS
    
NextTransition:
    INY
    INY
    INY                 ; Skip to next entry (3 bytes each)
    JMP TransitionLoop
    
TransitionDone:
    RTS

CallStateFunction:
    JMP (StateFunction)

; State handler stubs
HandleStateTitle:
    RTS
    
HandleStateMenu:
    RTS
    
HandleStatePlay:
    RTS
    
HandleStateCompose:
    RTS

; Variables for algorithms
SortKey: .byte $00
SortIndex: .byte $00
NotePriorities: .byte $08, $04, $0C, $02, $0A, $06, $0E, $01
NoteIndices: .byte $00, $01, $02, $03, $04, $05, $06, $07

SpriteALeft: .byte $00
SpriteARight: .byte $00
SpriteATop: .byte $00
SpriteABottom: .byte $00
SpriteBLeft: .byte $00
SpriteBRight: .byte $00
SpriteBTop: .byte $00
SpriteBBottom: .byte $00

SearchTarget: .byte $00
SearchLow: .byte $00
SearchHigh: .byte $00
SearchMid: .byte $00

FrequencyTable:
    .byte $7E, $8A, $98, $A8, $BA, $CE, $E5, $FE
    .byte $3F, $45, $4C, $54, $5D, $67, $72, $7F
    .byte $1F, $22, $26, $2A, $2E, $33, $39, $3F
    .byte $0F, $11, $13, $15, $17, $19, $1C, $1F

StateFunction: .word $0000
CurrentState: .byte $00
NewInput: .byte $00

; State constants
STATE_TITLE = $00
STATE_MENU = $01
STATE_PLAY = $02
STATE_COMPOSE = $03

INPUT_A = %10000000
INPUT_B = %01000000
INPUT_UP = %00001000
INPUT_DOWN = %00000100
```

## Practice Exercise

Apply all optimization techniques to create the most efficient version of Sprite Symphony:

1. Implement performance measurement and analysis
2. Optimize memory usage with zero page variables and efficient data structures
3. Apply algorithm optimizations for real-time performance
4. Minimize cycle counts in critical code paths
5. Create a polished, 60 FPS musical application

**Practice: Fully Optimized Sprite Symphony:**

```assembly
; Fully Optimized Sprite Symphony - Maximum Performance
Main:
    JSR InitOptimizedSystem
    
OptimizedMainLoop:
    JSR MeasureFrameStart
    JSR ProcessInputOptimized
    JSR UpdateGameOptimized
    JSR WaitForVBlankOptimized
    JSR MeasureFrameEnd
    JMP OptimizedMainLoop

InitOptimizedSystem:
    ; Initialize with maximum optimization
    JSR InitHardwareOptimized
    JSR InitZeroPageVars
    JSR InitDataStructures
    JSR InitPerformanceTracking
    RTS

InitHardwareOptimized:
    ; Optimized hardware initialization
    LDA #%00001111       ; Enable all audio channels
    STA $4015
    
    ; Initialize critical zero page variables
    LDA #$00
    STA GameState        ; ZP: $10
    STA FrameCounter     ; ZP: $11
    STA InputCurrent     ; ZP: $12
    STA InputPrevious    ; ZP: $13
    STA ActiveNotes      ; ZP: $14
    STA VBlankFlag       ; ZP: $15
    
    RTS

InitZeroPageVars:
    ; Initialize all zero page variables for speed
    LDA #$00
    LDX #$30             ; Clear $10-$3F (48 bytes)
ZPClearLoop:
    STA $10,X
    DEX
    BPL ZPClearLoop
    
    ; Initialize specific values
    LDA #$FF
    STA InputCurrent     ; No buttons pressed initially
    STA InputPrevious
    
    RTS

InitDataStructures:
    ; Initialize optimized data structures
    
    ; Initialize note pool
    LDA #$00
    STA ActiveNotes      ; No active notes
    LDX #$07
InitNotePool:
    STA NoteTimers,X
    STA NoteFreqs,X
    DEX
    BPL InitNotePool
    
    ; Initialize sprite pool using SoA layout
    LDX #$07
InitSpritePool:
    LDA #$FF
    STA SpriteY,X        ; Hide all sprites initially
    LDA DefaultTiles,X
    STA SpriteTile,X
    LDA DefaultAttrs,X
    STA SpriteAttr,X
    LDA DefaultX,X
    STA SpriteX,X
    DEX
    BPL InitSpritePool
    
    RTS

InitPerformanceTracking:
    ; Initialize performance measurement
    LDA #$00
    STA FrameStart
    STA FrameTime
    STA PeakFrameTime
    STA OverrunCount
    
    RTS

MeasureFrameStart:
    ; Start frame timing measurement
    LDA FrameCounter
    STA FrameStart
    INC FrameCounter
    RTS

ProcessInputOptimized:
    ; Highly optimized input processing
    
    ; Fast controller read with unrolled loop
    LDA #$01             ; 2 cycles
    STA $4016            ; 4 cycles
    LSR                  ; 2 cycles (A = 0)
    STA $4016            ; 4 cycles
    
    ; Unrolled 8-bit read for maximum speed
    LDA $4016            ; 4 cycles - A button
    AND #$01             ; 2 cycles
    STA TempInput        ; 3 cycles (ZP)
    
    LDA $4016            ; 4 cycles - B button  
    AND #$01             ; 2 cycles
    ASL                  ; 2 cycles
    ORA TempInput        ; 3 cycles (ZP)
    STA TempInput        ; 3 cycles
    
    ; Continue for all 8 buttons...
    ; (Abbreviated for space - full version would read all 8)
    
    ; Store current input
    LDA InputCurrent     ; 3 cycles (ZP)
    STA InputPrevious    ; 3 cycles (ZP)
    LDA TempInput        ; 3 cycles (ZP)
    STA InputCurrent     ; 3 cycles (ZP)
    
    ; Calculate new presses efficiently
    EOR InputPrevious    ; 3 cycles (ZP)
    AND InputCurrent     ; 3 cycles (ZP)
    STA NewPresses       ; 3 cycles (ZP)
    
    RTS

UpdateGameOptimized:
    ; Optimized game update using jump tables
    
    ; State machine optimization
    LDA GameState        ; 3 cycles (ZP)
    ASL                  ; 2 cycles
    TAY                  ; 2 cycles
    
    LDA StateUpdateTable,Y    ; 4 cycles
    STA JumpAddr         ; 3 cycles (ZP)
    LDA StateUpdateTable+1,Y  ; 4 cycles
    STA JumpAddr+1       ; 3 cycles (ZP)
    
    JMP (JumpAddr)       ; 5 cycles
    
StateUpdateDemo:
    ; Optimized demo update
    INC DemoTimer        ; 5 cycles (ZP)
    LDA DemoTimer        ; 3 cycles (ZP)
    AND #$1F             ; 2 cycles (every 32 frames)
    BNE DemoUpdateDone   ; 2 cycles
    
    ; Play next demo note
    LDY DemoPosition     ; 3 cycles (ZP)
    LDA DemoSequence,Y   ; 4 cycles
    CMP #$FF             ; 2 cycles
    BEQ ResetDemoSeq     ; 2 cycles
    
    JSR PlayNoteOptimized ; Optimized note playing
    INC DemoPosition     ; 5 cycles (ZP)
    
DemoUpdateDone:
    JMP UpdateAudioOptimized
    
ResetDemoSeq:
    LDA #$00             ; 2 cycles
    STA DemoPosition     ; 3 cycles (ZP)
    JMP DemoUpdateDone   ; 3 cycles

StateUpdatePlay:
    ; Optimized play mode update
    JSR ProcessPlayInputOptimized
    JMP UpdateAudioOptimized

StateUpdateCompose:
    ; Optimized compose mode update
    JSR ProcessComposeInputOptimized
    JMP UpdateAudioOptimized

ProcessPlayInputOptimized:
    ; Fast input to note mapping
    LDA NewPresses       ; 3 cycles (ZP)
    BEQ PlayInputDone    ; 2 cycles
    
    ; Use lookup table for fast mapping
    LDX #$03             ; 2 cycles
InputMappingLoop:
    ASL NewPresses       ; 5 cycles (ZP) - shift left, bit 7 to carry
    BCC NextInputBit     ; 2 cycles
    
    ; This input is active - play note
    LDA InputToNoteTable,X ; 4 cycles
    JSR PlayNoteOptimized
    
NextInputBit:
    DEX                  ; 2 cycles
    BPL InputMappingLoop ; 3 cycles
    
PlayInputDone:
    RTS

ProcessComposeInputOptimized:
    ; Simplified for demo
    RTS

PlayNoteOptimized:
    ; Highly optimized note playing
    TAX                  ; 2 cycles
    
    ; Direct hardware register writes
    LDA OptimizedFreqLow,X ; 4 cycles
    STA $4002            ; 4 cycles
    LDA OptimizedFreqHigh,X ; 4 cycles
    STA $4003            ; 4 cycles
    LDA #%10111111       ; 2 cycles
    STA $4000            ; 4 cycles
    
    ; Set note timer
    LDA #$20             ; 2 cycles
    STA NoteTimers,X     ; 4 cycles
    
    ; Mark note as active
    LDA NoteBitMasks,X   ; 4 cycles
    ORA ActiveNotes      ; 3 cycles (ZP)
    STA ActiveNotes      ; 3 cycles (ZP)
    
    ; Create optimized visual
    JSR CreateVisualOptimized
    
    RTS

CreateVisualOptimized:
    ; Optimized visual creation
    TXA                  ; 2 cycles
    ASL                  ; 2 cycles
    ASL                  ; 2 cycles
    TAY                  ; 2 cycles
    
    ; Direct OAM writes
    LDA OptimizedNotePosY,X ; 4 cycles
    STA SpriteOAM,Y      ; 5 cycles
    LDA OptimizedNoteTiles,X ; 4 cycles
    STA SpriteOAM+1,Y    ; 5 cycles
    LDA #%00000001       ; 2 cycles
    STA SpriteOAM+2,Y    ; 5 cycles
    LDA OptimizedNoteX,X ; 4 cycles
    STA SpriteOAM+3,Y    ; 5 cycles
    
    RTS

UpdateAudioOptimized:
    ; Optimized audio update
    LDA ActiveNotes      ; 3 cycles (ZP)
    BEQ AudioUpdateDone  ; 2 cycles
    
    ; Process active notes efficiently
    LDX #$00             ; 2 cycles
AudioUpdateLoop:
    ASL ActiveNotes      ; 5 cycles (ZP) - shift left
    BCC NextAudioNote   ; 2 cycles
    
    ; Update this active note
    DEC NoteTimers,X     ; 6 cycles
    BNE NextAudioNote   ; 2 cycles
    
    ; Note finished - remove from active list
    LDA NoteBitMasks,X   ; 4 cycles
    EOR #$FF             ; 2 cycles
    AND ActiveNotesMask  ; 3 cycles
    STA ActiveNotesMask  ; 3 cycles
    
    ; Hide sprite
    TXA                  ; 2 cycles
    ASL                  ; 2 cycles
    ASL                  ; 2 cycles
    TAY                  ; 2 cycles
    LDA #$FF             ; 2 cycles
    STA SpriteOAM,Y      ; 5 cycles
    
NextAudioNote:
    INX                  ; 2 cycles
    CPX #$04             ; 2 cycles
    BNE AudioUpdateLoop  ; 3 cycles
    
AudioUpdateDone:
    ; Update sprite positions for active notes
    JSR UpdateSpritesOptimized
    RTS

UpdateSpritesOptimized:
    ; Optimized sprite updates
    LDX #$00             ; 2 cycles
SpriteUpdateLoop:
    ; Check if sprite is active
    LDA SpriteY,X        ; 4 cycles
    CMP #$FF             ; 2 cycles
    BEQ NextSpriteUpdate ; 2 cycles
    
    ; Animate active sprite
    LDA AnimCounter      ; 3 cycles (ZP)
    AND #$07             ; 2 cycles
    CMP #$04             ; 2 cycles
    BCC SpritePulseUp    ; 2 cycles
    
    ; Pulse down
    LDA OptimizedNotePosY,X ; 4 cycles
    CLC                  ; 2 cycles
    ADC #$02             ; 2 cycles
    JMP StoreSpriteY     ; 3 cycles
    
SpritePulseUp:
    LDA OptimizedNotePosY,X ; 4 cycles
    SEC                  ; 2 cycles
    SBC #$02             ; 2 cycles
    
StoreSpriteY:
    STA SpriteY,X        ; 4 cycles
    
    ; Update OAM
    TXA                  ; 2 cycles
    ASL                  ; 2 cycles
    ASL                  ; 2 cycles
    TAY                  ; 2 cycles
    LDA SpriteY,X        ; 4 cycles
    STA SpriteOAM,Y      ; 5 cycles
    
NextSpriteUpdate:
    INX                  ; 2 cycles
    CPX #$08             ; 2 cycles
    BNE SpriteUpdateLoop ; 3 cycles
    
    INC AnimCounter      ; 5 cycles (ZP)
    RTS

WaitForVBlankOptimized:
    ; Efficient VBlank wait
VBlankWait:
    LDA VBlankFlag       ; 3 cycles (ZP, set by NMI)
    BEQ VBlankWait       ; 2 cycles
    
    LDA #$00             ; 2 cycles
    STA VBlankFlag       ; 3 cycles (ZP)
    RTS

MeasureFrameEnd:
    ; Measure frame performance
    LDA FrameCounter     ; 3 cycles (ZP)
    SEC                  ; 2 cycles
    SBC FrameStart       ; 3 cycles (ZP)
    STA FrameTime        ; 3 cycles
    
    ; Check for new peak
    CMP PeakFrameTime    ; 3 cycles
    BCC MeasureDone      ; 2 cycles
    STA PeakFrameTime    ; 3 cycles
    
    ; Check for overrun
    CMP #$E8             ; 2 cycles (232 cycles = danger zone)
    BCC MeasureDone      ; 2 cycles
    INC OverrunCount     ; 5 cycles
    
MeasureDone:
    RTS

; Optimized NMI handler
NMIHandlerOptimized:
    ; Minimal cycle count NMI
    PHA                  ; 3 cycles
    TXA                  ; 2 cycles
    PHA                  ; 3 cycles
    
    ; OAM DMA
    LDA #$02             ; 2 cycles
    STA $4014            ; 4 cycles (+ 513 for DMA)
    
    ; Set VBlank flag
    INC VBlankFlag       ; 5 cycles (ZP)
    
    ; Restore and return
    PLA                  ; 4 cycles
    TAX                  ; 2 cycles
    PLA                  ; 4 cycles
    RTI                  ; 6 cycles
    
    ; Total: ~545 cycles (well within budget)

; Optimized data tables
StateUpdateTable:
    .word StateUpdateDemo
    .word StateUpdatePlay
    .word StateUpdateCompose
    .word StateUpdatePlay    ; Default

InputToNoteTable:
    .byte $07, $04, $02, $00  ; Map inputs to notes

NoteBitMasks:
    .byte %00000001, %00000010, %00000100, %00001000

OptimizedFreqLow:
    .byte $FE, $E5, $CE, $BA, $A8, $98, $8A, $7E

OptimizedFreqHigh:
    .byte $08, $08, $08, $08, $08, $08, $08, $08

OptimizedNotePosY:
    .byte $C0, $B8, $B0, $A8, $A0, $98, $90, $88

OptimizedNoteTiles:
    .byte $10, $11, $12, $13, $14, $15, $16, $17

OptimizedNoteX:
    .byte $40, $50, $60, $70, $80, $90, $A0, $B0

DemoSequence:
    .byte $00, $02, $04, $05, $07, $05, $04, $02, $00, $FF

DefaultTiles:
    .byte $10, $11, $12, $13, $14, $15, $16, $17

DefaultAttrs:
    .byte $01, $01, $01, $01, $02, $02, $02, $02

DefaultX:
    .byte $40, $50, $60, $70, $80, $90, $A0, $B0

; Zero page variables (for speed)
GameState = $10
FrameCounter = $11
InputCurrent = $12
InputPrevious = $13
ActiveNotes = $14
VBlankFlag = $15
DemoTimer = $16
DemoPosition = $17
AnimCounter = $18
NewPresses = $19
TempInput = $1A
JumpAddr = $1B       ; 2 bytes
FrameStart = $1D
ActiveNotesMask = $1E

; Performance tracking
FrameTime: .byte $00
PeakFrameTime: .byte $00
OverrunCount: .byte $00

; Note and sprite data
NoteTimers: .byte $00, $00, $00, $00, $00, $00, $00, $00
NoteFreqs: .byte $00, $00, $00, $00, $00, $00, $00, $00
SpriteY: .byte $FF, $FF, $FF, $FF, $FF, $FF, $FF, $FF
SpriteTile: .byte $10, $11, $12, $13, $14, $15, $16, $17
SpriteAttr: .byte $01, $01, $01, $01, $02, $02, $02, $02
SpriteX: .byte $40, $50, $60, $70, $80, $90, $A0, $B0

; OAM buffer
SpriteOAM:
    .byte $FF, $10, $01, $40
    .byte $FF, $11, $01, $50
    .byte $FF, $12, $01, $60
    .byte $FF, $13, $01, $70
```

## What You've Learned

In this advanced lesson, you've mastered professional NES optimization:

- Performance analysis and bottleneck identification for 60 FPS applications
- Memory optimization techniques maximizing the NES's limited 2KB RAM
- CPU cycle optimization and timing analysis for real-time performance
- Algorithm efficiency and optimized data structures for interactive applications
- Professional optimization practices used in commercial NES development
- Complete transformation of Sprite Symphony into a highly optimized, professional-quality application

## Looking Ahead

Congratulations! You've completed Phase 1 of NES development with Sprite Symphony as your capstone project. In the next lesson, you'll review everything you've accomplished and prepare for the advanced concepts waiting in Phase 2.

## Fun Fact

The optimization techniques you've learned represent the same skills that professional NES developers used to create technically impressive games within severe hardware constraints. Games like Super Mario Bros. 3, Mega Man 2, and Castlevania III achieved their smooth performance through exactly these optimization strategies: careful cycle counting, zero page usage, efficient algorithms, and optimized data structures. The 60 FPS performance you've achieved with Sprite Symphony demonstrates the same level of technical competency that made those classic games possible. These optimization skills transfer directly to modern embedded programming, game development, and any situation where performance matters!