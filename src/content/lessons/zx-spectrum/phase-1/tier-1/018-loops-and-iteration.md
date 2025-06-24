---
title: "Loops and Iteration"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 18
description: "Master loop construction using conditional jumps and the Z80's DJNZ instruction. Learn to create efficient iterative structures for data processing and animation."
learning_objectives:
  - "Create loops using conditional jumps and counters"
  - "Master the DJNZ instruction for efficient counting loops"
  - "Learn nested loop structures for complex iterations"
  - "Practice loop optimization techniques"
  - "Build practical loop-based applications"
concepts:
  - "Counter-based loops with DJNZ"
  - "Conditional loops with jump instructions"
  - "Nested loops and multi-dimensional iteration"
  - "Loop optimization and performance"
  - "Infinite loops and loop control"
estimated_duration: "50-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 18
---

# Lesson 18: Loops and Iteration

Loops are fundamental to programming - they let you repeat operations efficiently without writing the same code multiple times. The Z80 provides excellent loop support through conditional jumps and the special DJNZ (Decrement and Jump if Not Zero) instruction. Master these patterns and you'll be able to process arrays, create animations, and handle repetitive tasks with ease.

## Basic Loop Concepts

### What Makes a Loop

Every loop needs three components:

1. **Initialization**: Set up loop variables and counters
2. **Condition**: Test whether to continue or exit the loop  
3. **Update**: Modify variables and advance to next iteration

```text
; Basic loop structure
    LD B, 10        ; 1. Initialize counter
LoopStart:
    ; Loop body goes here
    DEC B           ; 3. Update counter
    JR NZ, LoopStart ; 2. Test condition
    ; Loop exits here when B reaches 0
```

## The DJNZ Instruction

### Z80's Most Efficient Loop Instruction

DJNZ (Decrement B and Jump if Not Zero) combines decrement and conditional jump:

```text
; Using DJNZ for counting loops
LD B, 10            ; Initialize counter
LoopStart:
    ; Loop body goes here
    DJNZ LoopStart  ; Decrement B and jump if B ≠ 0
    ; Loop exits when B = 0
```

**DJNZ advantages:**
- Only 2 bytes (vs 4 bytes for DEC B + JR NZ)
- Faster execution (8 cycles vs 12 cycles)
- Automatically handles counter and condition

<CodeRunner 
  system="zx-spectrum"
  title="Basic DJNZ Loop"
  code="; Simple counting loop using DJNZ
LD HL, $6000        ; Point to memory area
LD B, 10            ; Loop 10 times
LD A, 0             ; Starting value

CountLoop:
    LD (HL), A      ; Store value in memory
    INC A           ; Next value
    INC HL          ; Next memory location
    DJNZ CountLoop  ; Decrement B and loop if not zero

; Memory $6000-$6009 now contains: 0,1,2,3,4,5,6,7,8,9

; Another example: Clear screen memory
LD HL, $4000        ; Start of screen
LD B, 0             ; B=0 means loop 256 times (B decrements to 0)
LD A, 0             ; Clear pattern

ClearLoop:
    LD (HL), A      ; Clear this byte
    INC HL          ; Next screen location
    DJNZ ClearLoop  ; Continue for 256 bytes

; This clears the first 256 bytes of screen memory"
  language="assembly"
/>

### DJNZ Range Limitations

DJNZ can only jump backward up to 126 bytes or forward up to 129 bytes. For longer loops, use standard conditional jumps:

```text
; Long loop using conditional jumps
LD B, 100
LongLoopStart:
    ; Very long loop body here...
    ; (more than 126 bytes)
    DEC B
    JR NZ, LongLoopStart
```

## Different Loop Types

### Counting Loops (For Loops)

```text
; Process array of 20 elements
LD HL, ArrayStart   ; Point to array
LD B, 20            ; Number of elements

ProcessArray:
    LD A, (HL)      ; Get array element
    ; Process element in A
    ADD A, 10       ; Example: add 10 to each element
    LD (HL), A      ; Store back
    INC HL          ; Next element
    DJNZ ProcessArray
```

### Conditional Loops (While Loops)

```text
; Loop until we find a zero byte (string terminator)
LD HL, StringStart

FindZero:
    LD A, (HL)      ; Get character
    OR A            ; Test if zero
    JR Z, FoundZero ; Exit if zero found
    ; Process character
    INC HL          ; Next character
    JR FindZero     ; Continue searching

FoundZero:
    ; String processing complete
```

<CodeRunner 
  system="zx-spectrum"
  title="Different Loop Types"
  code="; Demonstration of counting vs conditional loops

; 1. Counting loop: Initialize array with pattern
LD HL, $6100        ; Array location
LD B, 8             ; 8 elements
LD A, %10101010     ; Pattern to store

FillPattern:
    LD (HL), A      ; Store pattern
    RLA             ; Rotate pattern left
    INC HL          ; Next position
    DJNZ FillPattern ; Count down from 8 to 0

; 2. Conditional loop: Find first zero in data
LD HL, $6100        ; Start of data
LD C, 0             ; Position counter

SearchZero:
    LD A, (HL)      ; Get data
    OR A            ; Check if zero
    JR Z, FoundZero ; Exit if found
    INC HL          ; Next position
    INC C           ; Count position
    JR SearchZero   ; Continue searching

FoundZero:
    ; C contains position where zero was found
    ; (or position past end if no zero found)

; 3. Hybrid loop: Search but limit to 16 positions max
LD HL, $6100        ; Start of data
LD B, 16            ; Maximum positions to check
LD C, 0             ; Position counter

LimitedSearch:
    LD A, (HL)      ; Get data
    OR A            ; Check if zero
    JR Z, FoundInLimit ; Exit if found
    INC HL          ; Next position
    INC C           ; Count position
    DJNZ LimitedSearch ; Loop with counter limit

    ; Reached limit without finding zero
    LD C, 255       ; Error code: not found
    JR SearchDone

FoundInLimit:
    ; C contains position where zero was found

SearchDone:
    ; Search complete"
  language="assembly"
/>

## Nested Loops

### Two-Dimensional Iteration

```text
; Fill 8×8 grid with checkerboard pattern
LD IX, GridStart    ; Point to grid
LD B, 8             ; Outer loop: 8 rows

RowLoop:
    PUSH BC         ; Save row counter
    LD C, 8         ; Inner loop: 8 columns
    
ColumnLoop:
    ; Calculate checkerboard pattern
    LD A, B         ; Row number
    ADD A, C        ; Add column number
    AND 1           ; Keep only low bit
    JR Z, BlackSquare
    LD A, 255       ; White square
    JR StoreSquare
BlackSquare:
    LD A, 0         ; Black square
StoreSquare:
    LD (IX), A      ; Store in grid
    INC IX          ; Next grid position
    DEC C           ; Decrement column counter
    JR NZ, ColumnLoop ; Continue inner loop
    
    POP BC          ; Restore row counter
    DJNZ RowLoop    ; Continue outer loop
```

### Screen Clearing with Nested Loops

```text
; Clear entire screen using nested loops
LD B, 24            ; 24 character rows

ClearRowLoop:
    PUSH BC         ; Save row counter
    ; Calculate screen address for this row
    CALL CalcRowAddress ; Returns address in HL
    LD C, 32        ; 32 bytes per row
    
ClearColumnLoop:
    LD (HL), 0      ; Clear this position
    INC HL          ; Next position
    DEC C           ; Decrement column counter
    JR NZ, ClearColumnLoop
    
    POP BC          ; Restore row counter
    DJNZ ClearRowLoop
```

<CodeRunner 
  system="zx-spectrum"
  title="Nested Loops Example"
  code="; Create a pattern using nested loops
; Draw a 4×4 grid of different patterns

LD IX, $6200        ; Grid storage area
LD B, 4             ; 4 rows

OuterLoop:
    PUSH BC         ; Save outer counter
    LD C, 4         ; 4 columns
    
InnerLoop:
    ; Create pattern based on row and column
    LD A, B         ; Get row (4,3,2,1)
    SLA A           ; × 2
    SLA A           ; × 4 (multiply row by 4)
    ADD A, C        ; Add column (4,3,2,1)
    ; A now contains unique value for each position
    
    LD (IX), A      ; Store pattern value
    INC IX          ; Next grid position
    DEC C           ; Decrement column counter
    JR NZ, InnerLoop ; Continue inner loop
    
    POP BC          ; Restore outer counter
    DJNZ OuterLoop  ; Continue outer loop

; Grid now contains:
; Row 0: 20,19,18,17
; Row 1: 16,15,14,13  
; Row 2: 12,11,10,9
; Row 3: 8,7,6,5

; Alternative: Using DJNZ for both loops
LD IX, $6300        ; Another grid area
LD B, 3             ; 3 rows

OuterDJNZ:
    PUSH BC         ; Save outer counter
    LD C, 3         ; 3 columns
    
InnerDJNZ:
    ; Simple pattern: row + column
    LD A, B
    ADD A, C
    LD (IX), A
    INC IX
    DEC C
    JR NZ, InnerDJNZ
    
    POP BC
    DJNZ OuterDJNZ"
  language="assembly"
/>

## Loop Optimization Techniques

### Unrolling Small Loops

For very small loops, sometimes it's faster to write out the operations:

```text
; SLOWER: Loop to clear 4 bytes
LD HL, Buffer
LD B, 4
ClearLoop:
    LD (HL), 0
    INC HL
    DJNZ ClearLoop

; FASTER: Unrolled version
LD HL, Buffer
LD (HL), 0
INC HL
LD (HL), 0
INC HL  
LD (HL), 0
INC HL
LD (HL), 0
```

### Counting Down vs Up

DJNZ naturally counts down, which is often more efficient:

```text
; EFFICIENT: Count down with DJNZ
LD B, 10
DownLoop:
    ; Process item B-1 (9,8,7,6,5,4,3,2,1,0)
    DJNZ DownLoop

; LESS EFFICIENT: Count up requires extra instructions
LD B, 0
UpLoop:
    ; Process item B (0,1,2,3,4,5,6,7,8,9)
    INC B
    LD A, B
    CP 10
    JR NZ, UpLoop
```

### Using Index Registers in Loops

```text
; Efficient array processing with IX
LD IX, ArrayStart
LD B, ArraySize

ProcessLoop:
    LD A, (IX)      ; Get array element
    ; Process A
    INC IX          ; Next element (more efficient than calculating address)
    DJNZ ProcessLoop
```

## Practical Loop Applications

### Screen Animation Loop

```text
; Animate by shifting screen content
AnimateScreen:
    LD HL, $4000    ; Start of screen
    LD B, 192       ; 192 pixel rows
    
AnimateRowLoop:
    PUSH BC         ; Save row counter
    PUSH HL         ; Save row start address
    
    ; Shift this row left by one pixel
    LD C, 32        ; 32 bytes per row
    OR A            ; Clear carry flag
    
ShiftByteLoop:
    RL (HL)         ; Rotate left through carry
    INC HL          ; Next byte
    DEC C
    JR NZ, ShiftByteLoop
    
    POP HL          ; Restore row start
    ; Move to next row (complex addressing for ZX Spectrum)
    CALL NextScreenRow
    POP BC          ; Restore row counter
    DJNZ AnimateRowLoop
    RET
```

### Data Processing Loop

```text
; Apply filter to audio data
ProcessAudioData:
    LD HL, AudioBuffer  ; Source data
    LD DE, FilteredBuffer ; Destination
    LD B, 0             ; Process 256 samples (B=0 = 256)
    
FilterLoop:
    LD A, (HL)          ; Get sample
    ; Apply simple low-pass filter (average with previous)
    ADD A, (PrevSample) ; Add previous sample
    RRA                 ; Divide by 2 (average)
    LD (DE), A          ; Store filtered sample
    LD (PrevSample), A  ; Save for next iteration
    
    INC HL              ; Next source
    INC DE              ; Next destination
    DJNZ FilterLoop     ; Process all samples
    RET

PrevSample: DB 0
```

<CodeRunner 
  system="zx-spectrum"
  title="Practical Loop Applications"
  code="; Game sprite animation using loops

; Sprite animation data (4 frames, 8 bytes each)
SpriteFrames:
    ; Frame 0
    DB %00111100, %01000010, %10100101, %10000001
    DB %10011001, %10100101, %01000010, %00111100
    ; Frame 1 (eyes closed)
    DB %00111100, %01000010, %10000001, %10000001
    DB %10011001, %10100101, %01000010, %00111100
    ; Frame 2 (wink)
    DB %00111100, %01000010, %10000101, %10100001
    DB %10011001, %10100101, %01000010, %00111100
    ; Frame 3 (smile)
    DB %00111100, %01000010, %10100101, %10000001
    DB %10111101, %10100101, %01000010, %00111100

AnimationCounter: DB 0
CurrentFrame: DB 0

; Animate sprite by cycling through frames
AnimateSprite:
    ; Update animation counter
    LD A, (AnimationCounter)
    INC A
    LD (AnimationCounter), A
    
    ; Change frame every 8 updates (slow down animation)
    AND %00000111
    JR NZ, NoFrameChange
    
    ; Time to change frame
    LD A, (CurrentFrame)
    INC A
    AND %00000011       ; Keep in range 0-3
    LD (CurrentFrame), A
    
NoFrameChange:
    ; Draw current frame
    LD A, (CurrentFrame)
    ; Calculate frame address (8 bytes per frame)
    SLA A : SLA A : SLA A   ; × 8
    LD HL, SpriteFrames
    LD C, A : LD B, 0
    ADD HL, BC              ; Point to current frame
    
    ; Draw frame to screen (8 bytes)
    LD DE, $4100            ; Screen position
    LD B, 8                 ; 8 bytes per frame
    
DrawFrame:
    LD A, (HL)              ; Get frame data
    LD (DE), A              ; Put on screen
    INC HL                  ; Next frame byte
    LD A, E                 ; Move screen position down
    ADD A, 32               ; Next screen row
    LD E, A
    JR NC, NoCarry
    INC D                   ; Handle carry
NoCarry:
    DJNZ DrawFrame          ; Continue for all 8 bytes
    RET

; Call AnimateSprite repeatedly in your main loop
; to see the sprite animate through all 4 frames"
  language="assembly"
/>

## Advanced Loop Patterns

### Loop with Multiple Exit Conditions

```text
; Search array for value or until end
SearchArray:
    LD HL, ArrayStart
    LD B, ArraySize    ; Maximum elements to check
    LD C, SearchValue  ; Value to find
    
SearchLoop:
    LD A, (HL)         ; Get array element
    CP C               ; Compare with search value
    JR Z, FoundValue   ; Exit if found
    
    INC HL             ; Next element
    DJNZ SearchLoop    ; Continue if more elements
    
    ; Not found
    LD A, 255          ; Return "not found" code
    RET
    
FoundValue:
    ; Found - calculate position
    LD A, ArraySize
    SUB B              ; Position = ArraySize - remaining count
    RET
```

### Infinite Loops with Break Conditions

```text
; Main game loop
GameLoop:
    CALL ProcessInput
    CALL UpdateGame
    CALL DrawScreen
    
    ; Check for exit condition
    LD A, (GameExitFlag)
    OR A
    JR Z, GameLoop     ; Continue if not exiting
    
    ; Game exit requested
    RET
```

### Loop with Skip Conditions

```text
; Process only non-zero array elements
ProcessNonZero:
    LD HL, ArrayStart
    LD B, ArraySize
    
ProcessLoop:
    LD A, (HL)         ; Get element
    OR A               ; Check if zero
    JR Z, SkipElement  ; Skip zero elements
    
    ; Process non-zero element
    ADD A, 10          ; Example processing
    LD (HL), A         ; Store back
    
SkipElement:
    INC HL             ; Next element
    DJNZ ProcessLoop   ; Continue for all elements
    RET
```

## Loop Performance Tips

### Choose the Right Loop Type

1. **Use DJNZ when possible** - fastest for counting down
2. **Use conditional jumps for complex conditions**
3. **Consider loop unrolling for very small, fixed loops**
4. **Use index registers for array processing**

### Memory Access Patterns

```text
; EFFICIENT: Sequential memory access
LD HL, DataStart
LD B, DataSize
SequentialLoop:
    LD A, (HL)
    ; Process A
    INC HL          ; Sequential access
    DJNZ SequentialLoop

; LESS EFFICIENT: Random memory access
LD B, DataSize
RandomLoop:
    ; Calculate random address each time
    CALL CalcAddress ; Returns address in HL
    LD A, (HL)
    ; Process A
    DJNZ RandomLoop
```

## Practice Exercise

Create a comprehensive loop-based system that demonstrates:

1. A counting loop that initializes data
2. A conditional loop that searches through data  
3. Nested loops for 2D processing
4. An animation loop with timing control
5. Performance optimization techniques

<CodeRunner 
  system="zx-spectrum"
  title="Practice Exercise - Complete Loop System"
  code="; Comprehensive loop demonstration: Pattern generator and processor

; 1. Initialize data with counting loop
InitData:
    LD HL, $6400        ; Data area
    LD B, 16            ; 16 bytes to initialize
    LD A, 1             ; Starting value
    
InitLoop:
    LD (HL), A          ; Store value
    SLA A               ; Multiply by 2 (1,2,4,8,16,32,64,128,...)
    JR NC, NoWrap       ; Jump if no overflow
    LD A, 1             ; Reset to 1 if overflow
NoWrap:
    INC HL              ; Next location
    DJNZ InitLoop       ; Continue for all 16 bytes

; 2. Search for specific value using conditional loop
SearchValue:
    LD HL, $6400        ; Start of data
    LD C, 64            ; Value to find
    LD D, 0             ; Position counter
    
SearchLoop:
    LD A, (HL)          ; Get data
    CP C                ; Compare with search value
    JR Z, FoundTarget   ; Exit if found
    INC HL              ; Next position
    INC D               ; Count position
    LD A, D
    CP 16               ; Check if past end
    JR NZ, SearchLoop   ; Continue if more data
    
    ; Not found
    LD D, 255           ; Error code
    JR SearchDone
    
FoundTarget:
    ; Found at position D
    
SearchDone:
    ; D contains position (0-15) or 255 if not found

; 3. Process data with nested loops (4×4 grid)
ProcessGrid:
    LD IX, $6500        ; Grid storage
    LD B, 4             ; 4 rows
    
GridRowLoop:
    PUSH BC             ; Save row counter
    LD C, 4             ; 4 columns
    
GridColLoop:
    ; Create pattern: row × 4 + column
    LD A, 5             ; 5 - B = row number (0-3)
    SUB B               ; Convert to 0-based row
    SLA A : SLA A       ; × 4
    LD D, 5
    SUB D
    ADD A, C            ; Add column
    LD (IX), A          ; Store in grid
    INC IX              ; Next grid position
    DEC C               ; Next column
    JR NZ, GridColLoop  ; Continue inner loop
    
    POP BC              ; Restore row counter
    DJNZ GridRowLoop    ; Continue outer loop

; 4. Animation with timing (simple pattern rotation)
AnimationStep: DB 0

AnimatePattern:
    LD A, (AnimationStep)
    INC A
    AND %00000111       ; Keep in range 0-7
    LD (AnimationStep), A
    
    ; Create rotating pattern
    LD B, 8             ; 8 positions
    LD HL, $6600        ; Pattern storage
    
AnimateLoop:
    LD A, (AnimationStep)
    ADD A, B            ; Add position offset
    AND %00000111       ; Keep in range
    ; Convert to pattern
    LD C, A
    LD A, 1
    JR Z, PatternReady  ; If C=0, pattern=1
ShiftPattern:
    SLA A               ; Shift pattern left
    DEC C
    JR NZ, ShiftPattern
PatternReady:
    LD (HL), A          ; Store pattern
    INC HL              ; Next position
    DJNZ AnimateLoop    ; Continue for all positions
    RET

; 5. Optimized processing (unrolled for first 4 elements)
OptimizedProcess:
    LD HL, $6400        ; Data to process
    
    ; Unrolled loop for first 4 elements (faster)
    LD A, (HL) : ADD A, 10 : LD (HL), A : INC HL
    LD A, (HL) : ADD A, 10 : LD (HL), A : INC HL
    LD A, (HL) : ADD A, 10 : LD (HL), A : INC HL
    LD A, (HL) : ADD A, 10 : LD (HL), A : INC HL
    
    ; Regular loop for remaining elements
    LD B, 12            ; Remaining 12 elements
    
ProcessRest:
    LD A, (HL)          ; Get element
    ADD A, 10           ; Process it
    LD (HL), A          ; Store back
    INC HL              ; Next element
    DJNZ ProcessRest    ; Continue
    RET

; This system demonstrates all major loop types and patterns!"
  language="assembly"
/>

## What You've Learned

In this comprehensive lesson, you've mastered:

- The DJNZ instruction for efficient counting loops
- Creating different loop types: counting, conditional, and infinite loops
- Building nested loop structures for multi-dimensional processing
- Implementing practical applications like animation and data processing
- Optimizing loops for better performance and memory efficiency
- Understanding when to use different loop patterns and techniques
- Combining loops with conditional logic for complex control structures

## Looking Ahead

Next, you'll learn about **subroutines and the stack** - breaking your code into reusable functions that can be called from multiple places, making your programs more organized and efficient!

## Fun Fact

The Z80's DJNZ instruction was considered a stroke of genius by programmers of the era. Most other 8-bit processors required separate instructions to decrement a counter and test if it was zero, but DJNZ did both in a single, fast instruction. This made Z80 code not only more compact but significantly faster for loops - a crucial advantage when every cycle counted. The instruction was so useful that it influenced the design of later processors, and similar combined decrement-and-branch instructions can be found in many modern CPU architectures. The pattern you've learned with DJNZ is essentially the same as the "for loop" concept in high-level programming languages, showing how fundamental loop structures transcend specific technologies!