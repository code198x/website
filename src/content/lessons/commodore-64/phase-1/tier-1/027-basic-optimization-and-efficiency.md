---
title: "Basic Optimization and Efficiency"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 27
description: "Learn fundamental optimisation techniques for 6502 assembly programming. Learn memory efficiency, speed optimisation, and code size reduction techniques for professional C64 development."
learning_objectives:
  - "Understand basic performance optimisation principles"
  - "Learn memory-efficient programming techniques"
  - "Learn speed optimisation and instruction selection"
  - "Practice code size reduction and space optimisation"
  - "Build efficient, professional-quality assembly programs"
concepts:
  - "Memory access optimisation and zero page usage"
  - "Speed optimisation and instruction timing"
  - "Code size reduction and space efficiency"
  - "Loop optimisation and unrolling techniques"
  - "Professional optimisation best practices"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 27
---

# Lesson 27: Basic Optimization and Efficiency

Welcome to optimisation fundamentals! Today you'll learn to make your well-structured assembly code run faster, use less memory, and execute more efficiently. These techniques transform good code into professional-quality, high-performance programs.

## Optimization Principles

**Code optimisation** improves program performance without changing functionality:

- **Speed Optimization**: Making code execute faster
- **Memory Optimization**: Using less RAM and storage space
- **Code Size Optimization**: Reducing program size
- **Readability vs Performance**: Balancing clarity with efficiency
- **Premature Optimization**: Avoiding optimisation before profiling

Think of optimisation as **tuning a race car** - you keep the same destination but improve how efficiently and quickly you get there.

## Memory Access Optimization

### Zero Page Optimization

The **zero page** ($0000-$00FF) is the fastest memory to access on the 6502:

```text
; SLOW: Absolute addressing (3 bytes, 4 cycles)
LDA $1000           ; Load from regular memory
STA $1001           ; Store to regular memory

; FAST: Zero page addressing (2 bytes, 3 cycles)
LDA $80             ; Load from zero page
STA $81             ; Store to zero page

; Optimization: Use zero page for frequently accessed variables
PlayerX = $80       ; Zero page location
PlayerY = $81       ; Zero page location
TempVar = $82       ; Zero page temporary

; Fast operations
UpdatePlayer:
    LDA PlayerX     ; 2 bytes, 3 cycles
    CLC
    ADC #$01        ; Move right
    STA PlayerX     ; 2 bytes, 3 cycles
    RTS
```

### Pointer Optimization

Optimize pointer usage for better performance:

```text
; SLOW: Recalculating addresses repeatedly
SlowCopy:
    LDX #$00
CopyLoop:
    LDA $2000,X     ; Source data
    STA $3000,X     ; Destination
    INX
    CPX #$FF
    BNE CopyLoop
    RTS

; FAST: Use zero page pointers
FastCopy:
    ; Setup pointers once
    LDA #$00
    STA SourcePtr    ; $80
    STA DestPtr      ; $82
    LDA #$20
    STA SourcePtr+1  ; $81
    LDA #$30
    STA DestPtr+1    ; $83
    
    LDY #$00
FastCopyLoop:
    LDA (SourcePtr),Y ; Indirect indexed (5 cycles)
    STA (DestPtr),Y   ; Much faster than absolute,X
    INY
    BNE FastCopyLoop
    RTS

SourcePtr = $80     ; Zero page pointer
DestPtr = $82       ; Zero page pointer
```

### Memory Layout Optimization

Organize memory for optimal access patterns:

```text
; GOOD: Group related data together
PlayerData:
    PlayerX:     .byte 0    ; $80
    PlayerY:     .byte 0    ; $81
    PlayerVX:    .byte 0    ; $82
    PlayerVY:    .byte 0    ; $83
    PlayerHealth: .byte 100 ; $84

; OPTIMIZED: Access player data efficiently
UpdatePlayerPosition:
    LDX #PlayerX        ; Base address
    LDA $00,X           ; PlayerX (PlayerX + 0)
    CLC
    ADC $02,X           ; Add PlayerVX (PlayerX + 2)
    STA $00,X           ; Store new PlayerX
    
    LDA $01,X           ; PlayerY (PlayerX + 1)
    CLC
    ADC $03,X           ; Add PlayerVY (PlayerX + 3)
    STA $01,X           ; Store new PlayerY
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Memory Access Optimization Demo"
  code="; Demonstrate memory access optimisation techniques
; Shows difference between optimised and unoptimized approaches

MemoryOptimizationDemo:
    JSR SetupOptimizationDemo
    JSR DemoSlowAccess
    JSR DemoFastAccess
    JSR CompareResults
    RTS

SetupOptimizationDemo:
    ; Initialize test data
    LDA #$00
    STA TestCounter     ; Clear counter
    
    ; Setup test array with pattern
    LDX #$00
    LDA #$01
TestDataSetup:
    STA TestArray,X
    CLC
    ADC #$01            ; Increment pattern
    INX
    CPX #$10            ; 16 bytes
    BNE TestDataSetup
    
    RTS

DemoSlowAccess:
    ; Unoptimized approach - absolute addressing
    LDA #$00
    STA SlowResult      ; Clear result
    
    LDX #$00            ; Array index
SlowLoop:
    LDA TestArray,X     ; Absolute indexed (4 cycles)
    CLC
    ADC SlowResult      ; Add to running total
    STA SlowResult      ; Store result
    
    INX
    CPX #$10            ; Process 16 elements
    BNE SlowLoop
    
    RTS

DemoFastAccess:
    ; Optimized approach - zero page pointers
    LDA #$00
    STA FastResult      ; Clear result
    
    ; Setup zero page pointer
    LDA #<TestArray     ; Array address low
    STA ArrayPtr        ; Zero page pointer low
    LDA #>TestArray     ; Array address high  
    STA ArrayPtr+1      ; Zero page pointer high
    
    LDY #$00            ; Index register
FastLoop:
    LDA (ArrayPtr),Y    ; Indirect indexed (5 cycles)
                        ; But more flexible and often faster
    CLC
    ADC FastResult      ; Add to running total
    STA FastResult      ; Store result
    
    INY
    CPY #$10            ; Process 16 elements
    BNE FastLoop
    
    RTS

CompareResults:
    ; Display comparison results
    LDA #$93            ; Clear screen
    JSR $FFD2
    
    ; Position cursor
    LDA #5              ; Row 5
    STA $D6
    LDA #2              ; Column 2
    STA $D3
    
    ; Display slow result
    LDX #0
SlowResultLoop:
    LDA SlowText,X
    BEQ SlowResultDone
    JSR $FFD2
    INX
    JMP SlowResultLoop
SlowResultDone:
    
    LDA SlowResult
    JSR DisplayHexByte
    
    ; Position for fast result
    LDA #6              ; Row 6
    STA $D6
    LDA #2              ; Column 2
    STA $D3
    
    ; Display fast result
    LDX #0
FastResultLoop:
    LDA FastText,X
    BEQ FastResultDone
    JSR $FFD2
    INX
    JMP FastResultLoop
FastResultDone:
    
    LDA FastResult
    JSR DisplayHexByte
    
    RTS

DisplayHexByte:
    ; Display A register as hex
    PHA                 ; Save value
    
    ; Display high nibble
    LSR
    LSR
    LSR
    LSR                 ; Shift high nibble to low
    CMP #$0A
    BCC HighDigit
    CLC
    ADC #$37            ; Convert A-F
    JMP DisplayHigh
HighDigit:
    CLC
    ADC #$30            ; Convert 0-9
DisplayHigh:
    JSR $FFD2
    
    ; Display low nibble
    PLA                 ; Restore value
    AND #$0F            ; Keep low nibble
    CMP #$0A
    BCC LowDigit
    CLC
    ADC #$37            ; Convert A-F
    JMP DisplayLow
LowDigit:
    CLC
    ADC #$30            ; Convert 0-9
DisplayLow:
    JSR $FFD2
    
    RTS

; Text messages
SlowText:    .text \"SLOW METHOD RESULT: $\", 0
FastText:    .text \"FAST METHOD RESULT: $\", 0

; Test data and variables
TestArray:   .res 16         ; Test array
SlowResult:  .byte 0         ; Unoptimized result
FastResult:  .byte 0         ; Optimized result
TestCounter: .byte 0         ; General counter
ArrayPtr:    .word 0         ; Zero page pointer (would be in ZP)

; Run the memory optimisation demonstration
JSR MemoryOptimizationDemo"
  language="assembly"
/>

## Speed Optimization Techniques

### Instruction Selection

Choose the fastest instructions for each task:

```text
; SLOW: Inefficient instruction choices
SlowClear:
    LDA #$00
    STA $80
    LDA #$00
    STA $81
    LDA #$00
    STA $82
    RTS

; FAST: Optimal instruction selection
FastClear:
    LDA #$00
    STA $80         ; Same instruction, no reload needed
    STA $81         ; Reuse accumulator value
    STA $82         ; Much faster
    RTS

; SLOW: Unnecessary operations
SlowIncrement:
    LDA Counter
    CLC
    ADC #$01
    STA Counter
    RTS

; FAST: Use appropriate instructions
FastIncrement:
    INC Counter     ; Single instruction, faster
    RTS

; SLOW: Complex bit operations
SlowBitTest:
    LDA Flags
    AND #%00000001
    CMP #$01
    BEQ BitSet
    RTS
BitSet:
    ; Handle bit set
    RTS

; FAST: Efficient bit testing
FastBitTest:
    LDA Flags
    LSR             ; Shift bit 0 to carry
    BCS BitSet      ; Branch if carry set
    RTS

Counter: .byte 0
Flags:   .byte 0
```

### Loop Optimization

Optimize loops for better performance:

```text
; SLOW: Counting up loop
SlowLoop:
    LDX #$00
SlowLoopStart:
    ; Process array element
    LDA DataArray,X
    JSR ProcessByte
    
    INX
    CPX #ArraySize  ; Compare with limit
    BNE SlowLoopStart
    RTS

; FAST: Counting down loop (saves comparison)
FastLoop:
    LDX #ArraySize-1
FastLoopStart:
    ; Process array element
    LDA DataArray,X
    JSR ProcessByte
    
    DEX
    BPL FastLoopStart   ; Branch while positive (faster)
    RTS

; FASTER: Unrolled loop for small, fixed sizes
UnrolledLoop:
    ; Unroll 4 iterations
    LDA DataArray+0
    JSR ProcessByte
    LDA DataArray+1
    JSR ProcessByte
    LDA DataArray+2
    JSR ProcessByte
    LDA DataArray+3
    JSR ProcessByte
    ; Continue for all elements...
    RTS

ArraySize = 8
DataArray: .res 8

ProcessByte:
    ; Placeholder processing
    RTS
```

### Branch Optimization

Optimize branching for common cases:

```text
; SLOW: Inefficient branching
SlowCheck:
    LDA PlayerState
    CMP #STATE_DEAD     ; Rare condition first
    BEQ HandleDead
    CMP #STATE_ALIVE    ; Common condition last
    BEQ HandleAlive
    RTS

; FAST: Optimize for common case
FastCheck:
    LDA PlayerState
    CMP #STATE_ALIVE    ; Most common condition first
    BEQ HandleAlive
    CMP #STATE_DEAD     ; Less common condition
    BEQ HandleDead
    RTS

; FASTEST: Use carry flag when possible
FlagCheck:
    LDA Health
    BEQ PlayerDead      ; Zero check is fastest
    RTS

STATE_ALIVE = $01
STATE_DEAD = $00
PlayerState: .byte STATE_ALIVE
Health: .byte 100

HandleAlive:
HandleDead:
PlayerDead:
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Speed Optimization Techniques Demo"
  code="; Demonstrate various speed optimisation techniques
; Compare optimised vs unoptimized code patterns

SpeedOptimizationDemo:
    JSR SetupSpeedDemo
    JSR DemoLoopOptimization
    JSR DemoInstructionOptimization
    JSR DemoBranchOptimization
    RTS

SetupSpeedDemo:
    ; Initialize test data for speed comparisons
    LDA #$FF
    STA TestValue1
    LDA #$80
    STA TestValue2
    LDA #$01
    STA TestFlag
    
    ; Initialize test array
    LDX #$00
    LDA #$42            ; Test pattern
ArrayInit:
    STA TestSpeedArray,X
    INX
    CPX #$08            ; 8 elements
    BNE ArrayInit
    
    RTS

DemoLoopOptimization:
    ; Compare counting up vs counting down loops
    
    ; Counting up loop (slower)
    LDA #$00
    STA UpLoopResult
    LDX #$00
UpLoop:
    LDA TestSpeedArray,X
    CLC
    ADC UpLoopResult
    STA UpLoopResult
    INX
    CPX #$08            ; Compare with constant (slower)
    BNE UpLoop
    
    ; Counting down loop (faster)
    LDA #$00
    STA DownLoopResult
    LDX #$07            ; Start from last element
DownLoop:
    LDA TestSpeedArray,X
    CLC
    ADC DownLoopResult
    STA DownLoopResult
    DEX
    BPL DownLoop        ; Branch while positive (faster)
    
    RTS

DemoInstructionOptimization:
    ; Compare different ways to accomplish same task
    
    ; Inefficient: Multiple loads
    LDA #$00
    STA SlowClearTarget1
    LDA #$00            ; Unnecessary reload
    STA SlowClearTarget2
    LDA #$00            ; Unnecessary reload
    STA SlowClearTarget3
    
    ; Efficient: Reuse accumulator
    LDA #$00
    STA FastClearTarget1
    STA FastClearTarget2    ; Reuse loaded value
    STA FastClearTarget3    ; Reuse loaded value
    
    ; Inefficient: Addition for increment
    LDA SlowIncTarget
    CLC
    ADC #$01
    STA SlowIncTarget
    
    ; Efficient: Use increment instruction
    INC FastIncTarget
    
    RTS

DemoBranchOptimization:
    ; Show effect of branch optimisation
    
    ; Unoptimized: Rare case first
    LDA TestFlag
    CMP #$00            ; Rare case
    BEQ RareCase
    CMP #$01            ; Common case tested last
    BEQ CommonCase
    JMP DefaultCase
    
CommonCase:
    ; This is the common execution path
    LDA #$FF
    STA CommonResult
    JMP BranchEnd
    
RareCase:
    ; This rarely executes
    LDA #$AA
    STA RareResult
    JMP BranchEnd
    
DefaultCase:
    ; Default handling
    LDA #$55
    STA DefaultResult
    
BranchEnd:
    ; Optimized version would put CommonCase first
    ; to minimize average execution time
    
    RTS

; Data areas
TestSpeedArray:     .res 8
TestValue1:         .byte 0
TestValue2:         .byte 0
TestFlag:           .byte 0

; Results storage
UpLoopResult:       .byte 0
DownLoopResult:     .byte 0

SlowClearTarget1:   .byte 0
SlowClearTarget2:   .byte 0
SlowClearTarget3:   .byte 0

FastClearTarget1:   .byte 0
FastClearTarget2:   .byte 0
FastClearTarget3:   .byte 0

SlowIncTarget:      .byte 5
FastIncTarget:      .byte 5

CommonResult:       .byte 0
RareResult:         .byte 0
DefaultResult:      .byte 0

; Run the speed optimisation demonstration
JSR SpeedOptimizationDemo"
  language="assembly"
/>

## Code Size Optimization

### Subroutine Optimization

Use subroutines to reduce code duplication:

```text
; LARGE: Repeated code everywhere
DrawPlayer:
    LDA PlayerX
    STA $D000
    LDA PlayerY
    STA $D001
    LDA #$01            ; Red colour
    STA $D027
    LDA #%00000001      ; Enable sprite 0
    STA $D015
    RTS

DrawEnemy1:
    LDA Enemy1X
    STA $D002
    LDA Enemy1Y
    STA $D003
    LDA #$02            ; Green colour
    STA $D028
    LDA #%00000010      ; Enable sprite 1
    ORA $D015
    STA $D015
    RTS

; SMALL: Reusable subroutine
DrawSprite:
    ; Input: A=sprite number, X=X position, Y=Y position
    ; Carry set=enable, clear=disable
    PHA                 ; Save sprite number
    
    ; Calculate register offsets
    ASL                 ; Multiply by 2 (X,Y pairs)
    TAZ                 ; Use as index (concept - real 6502 would use different approach)
    
    ; Set position
    TXA
    STA $D000,Z         ; Sprite X position
    TYA
    STA $D001,Z         ; Sprite Y position
    
    ; Handle enable/disable
    PLA                 ; Restore sprite number
    ; ... implementation for sprite enable
    RTS

; Usage:
DrawAllSprites:
    LDA #$00            ; Sprite 0
    LDX PlayerX         ; X position
    LDY PlayerY         ; Y position
    SEC                 ; Enable
    JSR DrawSprite
    
    LDA #$01            ; Sprite 1
    LDX Enemy1X
    LDY Enemy1Y
    SEC                 ; Enable
    JSR DrawSprite
    RTS

PlayerX: .byte 100
PlayerY: .byte 100
Enemy1X: .byte 150
Enemy1Y: .byte 80
```

### Lookup Table Optimization

Use tables instead of calculations:

```text
; SLOW: Calculate sine values
SlowSine:
    ; Complex calculation for sine approximation
    ; Multiple multiplications, divisions, etc.
    RTS

; FAST: Precomputed lookup table
FastSine:
    ; Input: A = angle (0-255)
    TAX
    LDA SineTable,X     ; Single table lookup
    RTS

; Precomputed sine table (256 values)
SineTable:
    .byte $80, $83, $86, $89, $8C, $8F, $92, $95
    .byte $98, $9C, $9F, $A2, $A5, $A8, $AB, $AE
    ; ... continue for all 256 values
    .byte $7D, $7A, $77, $74, $71, $6E, $6B, $68
    .byte $65, $62, $5F, $5C, $59, $56, $53, $50

; Space vs Speed tradeoff:
; Table uses 256 bytes but executes in ~5 cycles
; Calculation might use 20 bytes but take 200+ cycles
```

### Instruction Packing

Pack multiple operations efficiently:

```text
; VERBOSE: Multiple instructions
VerboseOperations:
    LDA PlayerHealth
    CMP #$00
    BEQ PlayerDead
    LDA PlayerHealth
    CMP #$64
    BCS PlayerFullHealth
    RTS

; COMPACT: Efficient instruction usage
CompactOperations:
    LDA PlayerHealth    ; Load once
    BEQ PlayerDead      ; Zero check (fastest)
    CMP #$64            ; Full health check
    BCS PlayerFullHealth
    RTS

; CLEVER: Use instruction side effects
CleverCheck:
    DEC PlayerHealth    ; Decrement and set flags
    BMI PlayerDead      ; Negative = underflowed (was 0)
    RTS

PlayerHealth: .byte 50

PlayerDead:
PlayerFullHealth:
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Code Size Optimization Demo"
  code="; Demonstrate code size optimisation techniques
; Show how to reduce program size while maintaining functionality

CodeSizeOptimizationDemo:
    JSR SetupSizeDemo
    JSR DemoSubroutineOptimization
    JSR DemoLookupTableOptimization
    JSR DemoInstructionPacking
    RTS

SetupSizeDemo:
    ; Initialize data for size optimisation examples
    LDA #$32            ; 50 in hex
    STA DemoHealth
    LDA #$64            ; 100 in hex
    STA DemoMaxHealth
    
    ; Initialize position data
    LDA #$50            ; 80
    STA DemoX
    LDA #$60            ; 96
    STA DemoY
    
    RTS

DemoSubroutineOptimization:
    ; Show reusable subroutine vs duplicated code
    
    ; Instead of duplicating positioning code,
    ; use a general purpose routine
    
    ; Set sprite 0
    LDA #$00            ; Sprite number
    LDX DemoX           ; X position
    LDY DemoY           ; Y position
    JSR SetSpritePosition
    
    ; Set sprite 1 (different position)
    LDA #$01            ; Sprite number
    LDX DemoX
    INX                 ; Offset X
    INX
    LDY DemoY
    INY                 ; Offset Y
    JSR SetSpritePosition
    
    RTS

SetSpritePosition:
    ; Reusable sprite positioning subroutine
    ; Input: A=sprite number, X=X pos, Y=Y pos
    ; This saves code size vs duplicating for each sprite
    
    ; Calculate sprite register offset
    ASL                 ; Multiply by 2 (X,Y register pairs)
    TAX                 ; Use as offset (conceptual)
    
    ; In real implementation, would use a lookup table
    ; or calculate actual register addresses
    
    ; For demo, just show the concept
    CMP #$00
    BEQ SetSprite0
    CMP #$01
    BEQ SetSprite1
    RTS
    
SetSprite0:
    STX $D000           ; Sprite 0 X (from X register)
    STY $D001           ; Sprite 0 Y (from Y register)
    RTS
    
SetSprite1:
    STX $D002           ; Sprite 1 X
    STY $D003           ; Sprite 1 Y
    RTS

DemoLookupTableOptimization:
    ; Show lookup table vs calculation
    
    ; Instead of calculating squares (slow):
    ; Result = Input * Input
    
    ; Use precomputed table (fast):
    LDA #$05            ; Input value
    TAX
    LDA SquareTable,X   ; Get square from table
    STA SquareResult
    
    ; Similarly for other math operations
    LDA #$10            ; Another input
    TAX
    LDA SquareTable,X
    STA SquareResult2
    
    RTS

DemoInstructionPacking:
    ; Show efficient instruction usage
    
    ; Inefficient: Multiple loads
    LDA DemoHealth
    CMP #$00
    BEQ HealthZero
    LDA DemoHealth      ; Unnecessary reload
    CMP DemoMaxHealth
    BCS HealthMax
    JMP HealthNormal
    
HealthZero:
    LDA #$02            ; Red colour for dead
    STA ColorResult
    JMP HealthEnd
    
HealthMax:
    LDA #$05            ; Green colour for full health
    STA ColorResult
    JMP HealthEnd
    
HealthNormal:
    LDA #$0E            ; Light blue for normal
    STA ColorResult
    
HealthEnd:
    ; More efficient version would:
    ; 1. Load DemoHealth once
    ; 2. Use BEQ immediately after load
    ; 3. Reuse loaded value for comparison
    ; 4. Use instruction side effects
    
    RTS

; Lookup table for squares (0-15 squared)
; This takes 16 bytes but saves many cycles vs calculation
SquareTable:
    .byte $00, $01, $04, $09, $10, $19, $24, $31
    .byte $40, $51, $64, $79, $90, $A9, $C4, $E1

; Variables
DemoHealth:     .byte 0
DemoMaxHealth:  .byte 0
DemoX:          .byte 0
DemoY:          .byte 0
SquareResult:   .byte 0
SquareResult2:  .byte 0
ColorResult:    .byte 0

; Run the code size optimisation demonstration
JSR CodeSizeOptimizationDemo"
  language="assembly"
/>

## Advanced Optimization Patterns

### Table-Driven Programming

Use tables to replace complex logic:

```text
; COMPLEX: Multiple branching logic
ComplexLogic:
    LDA InputValue
    CMP #$00
    BEQ Case0
    CMP #$01
    BEQ Case1
    CMP #$02
    BEQ Case2
    CMP #$03
    BEQ Case3
    JMP DefaultCase

Case0:
    LDA #$10
    STA Result
    JMP LogicEnd
Case1:
    LDA #$20
    STA Result
    JMP LogicEnd
Case2:
    LDA #$30
    STA Result
    JMP LogicEnd
Case3:
    LDA #$40
    STA Result
    JMP LogicEnd
DefaultCase:
    LDA #$00
    STA Result
LogicEnd:
    RTS

; SIMPLE: Table-driven approach
TableDrivenLogic:
    LDX InputValue
    CPX #$04            ; Check bounds
    BCS DefaultValue    ; Use default if out of range
    LDA ValueTable,X    ; Single table lookup
    STA Result
    RTS
DefaultValue:
    LDA #$00
    STA Result
    RTS

ValueTable:
    .byte $10, $20, $30, $40    ; Results for inputs 0-3

InputValue: .byte 0
Result: .byte 0
```

### Bit-Packed Data Structures

Pack multiple values into single bytes:

```text
; INEFFICIENT: One byte per flag
PlayerFlags1: .byte 0  ; Alive flag
PlayerFlags2: .byte 0  ; Invulnerable flag
PlayerFlags3: .byte 0  ; Has key flag
PlayerFlags4: .byte 0  ; Can jump flag

; EFFICIENT: Pack into single byte
PlayerFlags: .byte 0
; Bit 0: Alive
; Bit 1: Invulnerable  
; Bit 2: Has key
; Bit 3: Can jump
; Bits 4-7: Unused

; Flag constants
FLAG_ALIVE = %00000001
FLAG_INVULN = %00000010
FLAG_HAS_KEY = %00000100
FLAG_CAN_JUMP = %00001000

SetPlayerFlag:
    ; Input: A = flag bit pattern
    ORA PlayerFlags     ; Set flag bits
    STA PlayerFlags
    RTS

ClearPlayerFlag:
    ; Input: A = flag bit pattern
    EOR #$FF            ; Invert bits
    AND PlayerFlags     ; Clear flag bits
    STA PlayerFlags
    RTS

TestPlayerFlag:
    ; Input: A = flag bit pattern
    ; Output: Zero flag clear if set
    AND PlayerFlags
    RTS

; Usage examples:
SetAliveFlag:
    LDA #FLAG_ALIVE
    JSR SetPlayerFlag
    RTS

TestAliveFlag:
    LDA #FLAG_ALIVE
    JSR TestPlayerFlag
    BNE PlayerIsAlive
    RTS

PlayerIsAlive:
    ; Player is alive
    RTS
```

### Self-Modifying Code

Modify code at runtime for optimisation:

```text
; Standard approach: Branch based on mode
StandardSprite:
    LDA SpriteMode
    CMP #MODE_NORMAL
    BEQ NormalSprite
    CMP #MODE_DOUBLE
    BEQ DoubleSprite
    RTS

NormalSprite:
    LDA #%00000000      ; Normal size
    STA $D017
    RTS

DoubleSprite:
    LDA #%11111111      ; Double size
    STA $D017
    RTS

; Self-modifying approach: Change instruction
SelfModSprite:
    LDA SpriteValue     ; This instruction gets modified
    STA $D017           ; Set sprite scaling
    RTS

SetSpriteMode:
    ; Input: A = sprite mode
    CMP #MODE_NORMAL
    BEQ SetNormalMode
    ; Set double mode
    LDA #%11111111
    STA SpriteValue     ; Modify the data that gets loaded
    RTS

SetNormalMode:
    LDA #%00000000
    STA SpriteValue     ; Modify the data that gets loaded
    RTS

SpriteMode: .byte 0
SpriteValue: .byte 0   ; Gets modified by SetSpriteMode

MODE_NORMAL = 0
MODE_DOUBLE = 1

; Caution: Self-modifying code is powerful but harder to debug
; Use sparingly and document thoroughly
```

<CodeRunner 
  system="commodore-64"
  title="Advanced Optimization Patterns Demo"
  code="; Demonstrate advanced optimisation patterns
; Table-driven programming and bit-packed data

AdvancedOptimizationDemo:
    JSR SetupAdvancedDemo
    JSR DemoTableDriven
    JSR DemoBitPacking
    JSR DemoResultDisplay
    RTS

SetupAdvancedDemo:
    ; Initialize for advanced optimisation examples
    LDA #$02            ; Test input value
    STA TestInput
    
    LDA #%00000101      ; Set some flags (alive + has key)
    STA PackedFlags
    
    RTS

DemoTableDriven:
    ; Show table-driven programming
    
    ; Traditional approach would use multiple branches
    ; Table approach uses single lookup
    
    LDX TestInput       ; Use input as index
    CPX #$04            ; Check bounds
    BCS BadInput
    
    ; Get result from table
    LDA ResultTable,X
    STA TableResult
    
    ; Get colour from table
    LDA ColorTable,X
    STA TableColor
    
    JMP TableDone
    
BadInput:
    LDA #$00            ; Default result
    STA TableResult
    LDA #$02            ; Red for error
    STA TableColor
    
TableDone:
    RTS

DemoBitPacking:
    ; Show bit-packed flag operations
    
    ; Test if player is alive (bit 0)
    LDA PackedFlags
    AND #%00000001      ; Mask for alive bit
    BEQ PlayerDead
    
    ; Player is alive, test other flags
    LDA PackedFlags
    AND #%00000100      ; Mask for has_key bit
    BEQ NoKey
    
    ; Player has key
    LDA #$FF
    STA HasKeyResult
    JMP FlagTestDone
    
NoKey:
    LDA #$00
    STA HasKeyResult
    JMP FlagTestDone
    
PlayerDead:
    LDA #$AA            ; Special value for dead
    STA HasKeyResult
    
FlagTestDone:
    ; Demo setting a flag
    LDA PackedFlags
    ORA #%00001000      ; Set can_jump flag (bit 3)
    STA PackedFlags
    
    ; Demo clearing a flag
    LDA PackedFlags
    AND #%11111011      ; Clear has_key flag (bit 2)
    STA PackedFlags
    
    RTS

DemoResultDisplay:
    ; Display optimisation results
    LDA #$93            ; Clear screen
    JSR $FFD2
    
    ; Show table result
    LDA #5              ; Row 5
    STA $D6
    LDA #2              ; Column 2
    STA $D3
    
    LDX #0
TableMsgLoop:
    LDA TableMessage,X
    BEQ TableMsgDone
    JSR $FFD2
    INX
    JMP TableMsgLoop
TableMsgDone:
    
    LDA TableResult
    JSR DisplayHexValue
    
    ; Show flag result
    LDA #7              ; Row 7
    STA $D6
    LDA #2              ; Column 2
    STA $D3
    
    LDX #0
FlagMsgLoop:
    LDA FlagMessage,X
    BEQ FlagMsgDone
    JSR $FFD2
    INX
    JMP FlagMsgLoop
FlagMsgDone:
    
    LDA PackedFlags
    JSR DisplayHexValue
    
    RTS

DisplayHexValue:
    ; Display A register as 2-digit hex
    PHA                 ; Save value
    
    ; High nibble
    LSR
    LSR
    LSR
    LSR
    CMP #$0A
    BCC HighNum
    CLC
    ADC #$37            ; A-F
    JMP ShowHigh
HighNum:
    CLC
    ADC #$30            ; 0-9
ShowHigh:
    JSR $FFD2
    
    ; Low nibble
    PLA
    AND #$0F
    CMP #$0A
    BCC LowNum
    CLC
    ADC #$37            ; A-F
    JMP ShowLow
LowNum:
    CLC
    ADC #$30            ; 0-9
ShowLow:
    JSR $FFD2
    
    RTS

; Lookup tables for table-driven programming
ResultTable:
    .byte $10, $25, $3A, $4F    ; Results for inputs 0-3

ColorTable:
    .byte $06, $0E, $05, $02    ; Colors for inputs 0-3

; Messages
TableMessage:   .text \"TABLE RESULT: $\", 0
FlagMessage:    .text \"PACKED FLAGS: $\", 0

; Variables
TestInput:      .byte 0
PackedFlags:    .byte 0
TableResult:    .byte 0
TableColor:     .byte 0
HasKeyResult:   .byte 0

; Run the advanced optimisation demonstration
JSR AdvancedOptimizationDemo"
  language="assembly"
/>

## Optimization Guidelines and Best Practices

### 1. Profile Before Optimizing
```text
; Always measure performance before optimizing
; Focus on code that runs most frequently
; Don't optimise rarely-executed code
```

### 2. Optimize in Order of Impact
```text
; 1. Algorithm optimisation (biggest impact)
; 2. Memory access patterns
; 3. Instruction selection
; 4. Loop optimisation
; 5. Code size reduction
```

### 3. Maintain Readability
```text
; Document optimised code thoroughly
; Use clear variable names
; Explain non-obvious optimizations

; Good: Clear and documented
FastMultiplyBy10:
    ; Multiply A by 10 using shifts and adds
    ; A * 10 = (A * 8) + (A * 2) = (A << 3) + (A << 1)
    STA TempValue       ; Save original
    ASL                 ; A * 2
    STA DoubleValue     ; Save A * 2
    ASL                 ; A * 4
    ASL                 ; A * 8
    CLC
    ADC DoubleValue     ; A * 8 + A * 2 = A * 10
    RTS

TempValue: .byte 0
DoubleValue: .byte 0
```

### 4. Consider Trade-offs
```text
; Speed vs Size: Unrolled loops vs compact loops
; Speed vs Memory: Lookup tables vs calculations
; Readability vs Performance: Clear code vs optimised code
```

### 5. Test Thoroughly
```text
; Optimization can introduce bugs
; Test edge cases carefully
; Verify functionality matches original
; Use consistent test data
```

## Practice Exercise

Optimize the following inefficient code for speed, size, and memory usage:

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Code Optimization Challenge"
  code="; Optimization Challenge: Improve this inefficient code
; Focus on speed, memory usage, and code size

OptimizationChallenge:
    JSR InitChallenge
    JSR RunUnoptimizedCode
    JSR RunOptimizedCode
    JSR CompareResults
    RTS

InitChallenge:
    ; Setup test data for optimisation challenge
    LDX #$00
    LDA #$01
InitLoop:
    STA ChallengeArray,X
    CLC
    ADC #$01
    INX
    CPX #$10            ; 16 elements
    BNE InitLoop
    
    LDA #$00
    STA Result1
    STA Result2
    
    RTS

; UNOPTIMIZED VERSION (many inefficiencies)
RunUnoptimizedCode:
    ; Clear result
    LDA #$00
    STA Result1
    
    ; Process array inefficiently
    LDX #$00
UnoptimizedLoop:
    ; Load same value multiple times
    LDA ChallengeArray,X
    PHA                 ; Unnecessary stack use
    
    ; Inefficient multiplication by 2
    LDA ChallengeArray,X ; Load again!
    CLC
    ADC ChallengeArray,X ; A + A = A * 2
    STA TempResult
    
    ; Inefficient addition
    PLA                 ; Get original value
    CLC
    ADC TempResult      ; Add doubled value
    STA TempResult      ; Now have A * 3
    
    ; Add to running total inefficiently
    LDA Result1
    CLC
    ADC TempResult
    STA Result1
    
    ; Inefficient loop increment
    TXA
    CLC
    ADC #$01
    TAX
    
    ; Inefficient comparison
    TXA
    CMP #$10
    BNE UnoptimizedLoop
    
    RTS

; OPTIMIZED VERSION (apply optimisation techniques)
RunOptimizedCode:
    ; Clear result efficiently
    LDA #$00
    STA Result2
    
    ; Use optimised loop (count down)
    LDX #$0F            ; Start from last element
OptimizedLoop:
    ; Load value once
    LDA ChallengeArray,X
    
    ; Efficient multiplication by 3 using shifts and adds
    STA TempOpt         ; Save original (A)
    ASL                 ; A * 2
    CLC
    ADC TempOpt         ; A * 2 + A = A * 3
    
    ; Add to running total
    CLC
    ADC Result2
    STA Result2
    
    ; Efficient loop decrement
    DEX
    BPL OptimizedLoop   ; Branch while positive (faster)
    
    RTS

CompareResults:
    ; Display comparison of results
    LDA #$93            ; Clear screen
    JSR $FFD2
    
    ; Show unoptimized result
    LDA #5
    STA $D6
    LDA #2
    STA $D3
    
    LDX #0
UnoptMsgLoop:
    LDA UnoptimizedMsg,X
    BEQ UnoptMsgDone
    JSR $FFD2
    INX
    JMP UnoptMsgLoop
UnoptMsgDone:
    
    LDA Result1
    JSR ShowHexByte
    
    ; Show optimised result
    LDA #7
    STA $D6
    LDA #2
    STA $D3
    
    LDX #0
OptMsgLoop:
    LDA OptimizedMsg,X
    BEQ OptMsgDone
    JSR $FFD2
    INX
    JMP OptMsgLoop
OptMsgDone:
    
    LDA Result2
    JSR ShowHexByte
    
    ; Show if results match
    LDA #9
    STA $D6
    LDA #2
    STA $D3
    
    LDA Result1
    CMP Result2
    BEQ ResultsMatch
    
    ; Results don't match - optimisation error!
    LDX #0
ErrorLoop:
    LDA ErrorMsg,X
    BEQ ErrorDone
    JSR $FFD2
    INX
    JMP ErrorLoop
ErrorDone:
    RTS
    
ResultsMatch:
    LDX #0
MatchLoop:
    LDA MatchMsg,X
    BEQ MatchDone
    JSR $FFD2
    INX
    JMP MatchLoop
MatchDone:
    RTS

ShowHexByte:
    ; Display byte in hex format
    PHA
    
    ; High nibble
    LSR
    LSR
    LSR
    LSR
    CMP #$0A
    BCC HighDig
    CLC
    ADC #$37
    JMP DispHigh
HighDig:
    CLC
    ADC #$30
DispHigh:
    JSR $FFD2
    
    ; Low nibble
    PLA
    AND #$0F
    CMP #$0A
    BCC LowDig
    CLC
    ADC #$37
    JMP DispLow
LowDig:
    CLC
    ADC #$30
DispLow:
    JSR $FFD2
    RTS

; Messages
UnoptimizedMsg: .text \"UNOPTIMIZED: $\", 0
OptimizedMsg:   .text \"OPTIMIZED:   $\", 0
MatchMsg:       .text \"RESULTS MATCH - SUCCESS!\", 0
ErrorMsg:       .text \"ERROR - RESULTS DIFFER!\", 0

; Data areas
ChallengeArray: .res 16
Result1:        .byte 0     ; Unoptimized result
Result2:        .byte 0     ; Optimized result
TempResult:     .byte 0     ; Temporary storage
TempOpt:        .byte 0     ; Optimized temporary

; Run the optimisation challenge
JSR OptimizationChallenge"
  language="assembly"
/>

## What You've Learned

In this lesson, you've mastered fundamental optimisation techniques:

- **Memory Access Optimization**: Zero page usage and efficient pointer operations
- **Speed Optimization**: Instruction selection, loop optimisation, and branching efficiency
- **Code Size Optimization**: Subroutines, lookup tables, and instruction packing
- **Advanced Patterns**: Table-driven programming, bit-packed data, and optimisation trade-offs
- **Professional Practices**: Profiling, testing, and maintaining code quality during optimisation

## Looking Ahead

In the next lesson, you'll learn **error handling and debugging basics** - essential skills for building robust, reliable assembly programs that gracefully handle unexpected conditions.

## Fun Fact

The optimisation techniques you've learned are the foundation of high-performance programming in any language! The zero page optimisation is similar to CPU register allocation in modern compilers. The lookup table techniques are used in graphics cards for texture mapping and colour palette operations. The bit-packing methods are essential in embedded systems and network protocols. These 6502 optimisation patterns directly translate to modern CPU optimisation - cache-friendly memory access, branch prediction optimisation, and SIMD instruction usage. You've learned the timeless principles that make the difference between good code and great code!