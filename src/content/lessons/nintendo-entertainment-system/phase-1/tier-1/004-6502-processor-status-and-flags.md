---
title: "6502 Processor Status and Flags"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 4
description: "Learn how the 6502 keeps track of operation results using status flags, and how to use condition codes to make decisions in your NES programs."
learning_objectives:
  - "Understand what status flags are and why they're important"
  - "Learn the 6502's main status flags (N, V, Z, C)"
  - "Practice using condition codes for program decisions"
  - "Learn conditional branch instructions"
  - "Build programs that respond to different conditions"
concepts:
  - "6502 Status Register (P register)"
  - "Negative flag (N) and Zero flag (Z)"
  - "Carry flag (C) and Overflow flag (V)"
  - "Conditional branch instructions (BEQ, BNE, etc.)"
  - "Program decision making and branching"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 4
---

# Lesson 4: 6502 Processor Status and Flags

Every time the 6502 performs an operation, it keeps track of what happened using special status flags. Today, you'll learn how these flags work and how to use them to make your NES programs smart and responsive!

## What Are Status Flags?

Status flags are like indicator lights on the 6502's dashboard. They automatically turn on or off based on the results of operations, telling you important information:

- Was the result zero?
- Did an operation overflow?
- Was there a carry from an addition?
- Is the result positive or negative?

The 6502 stores these flags in a special register called the **P register** (Processor Status register).

## The 6502's Status Flags

### Negative Flag (N) - Bit 7
**Set when**: The result has bit 7 set (negative in signed arithmetic)
**Clear when**: The result has bit 7 clear (positive in signed arithmetic)

```text
LDA #$80        ; Load 128 (bit 7 = 1), Negative flag SET
LDA #$7F        ; Load 127 (bit 7 = 0), Negative flag CLEAR
```

### Overflow Flag (V) - Bit 6
**Set when**: Signed arithmetic overflow occurs
**Clear when**: No signed overflow occurs

```text
LDA #$7F        ; Load +127
ADC #$01        ; Add +1 = +128, but result is $80 (-128!)
                ; Overflow flag SET because result changed sign unexpectedly
```

### Zero Flag (Z) - Bit 1
**Set when**: The result of an operation is zero
**Clear when**: The result is non-zero

```text
LDA #5
SBC #5          ; A = 0, so Zero flag is SET
LDA #3
SBC #1          ; A = 2, so Zero flag is CLEAR
```

### Carry Flag (C) - Bit 0
**Set when**: An operation produces a carry (unsigned overflow)
**Clear when**: No carry occurs

```text
LDA #$FF        ; Load 255
ADC #$01        ; Add 1: 255 + 1 = 256, but result is $00 with Carry SET
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="6502 Status Flags Demonstration"
  code="; Demonstration of 6502 status flags
; This program shows how different operations affect the flags

StatusFlagsDemo:
    ; === ZERO FLAG DEMONSTRATION ===
    LDA #10         ; Load 10 into A
    SBC #10         ; Subtract 10: A = 0, Zero flag SET
    ; At this point, Z flag = 1 (set)
    
    LDA #10         ; Load 10 into A  
    SBC #5          ; Subtract 5: A = 5, Zero flag CLEAR
    ; At this point, Z flag = 0 (clear)
    
    ; === CARRY FLAG DEMONSTRATION ===
    CLC             ; Clear carry flag first
    LDA #$FF        ; Load 255 into A
    ADC #$01        ; Add 1: A = 0, Carry flag SET (256 > 255)
    ; At this point, C flag = 1 (carry occurred)
    
    CLC             ; Clear carry flag
    LDA #100        ; Load 100 into A
    ADC #50         ; Add 50: A = 150, Carry flag CLEAR  
    ; At this point, C flag = 0 (no carry)
    
    ; === NEGATIVE FLAG DEMONSTRATION ===
    LDA #$80        ; Load 128 (binary 10000000)
    ; At this point, N flag = 1 (bit 7 is set)
    
    LDA #$7F        ; Load 127 (binary 01111111)
    ; At this point, N flag = 0 (bit 7 is clear)
    
    ; === OVERFLOW FLAG DEMONSTRATION ===
    CLD             ; Clear decimal mode
    CLC             ; Clear carry
    LDA #$7F        ; Load +127 (largest positive signed byte)
    ADC #$01        ; Add +1: should be +128, but becomes $80 (-128)
    ; At this point, V flag = 1 (signed overflow occurred)
    
    CLC             ; Clear carry
    LDA #$50        ; Load +80
    ADC #$20        ; Add +32: = +112, no overflow
    ; At this point, V flag = 0 (no signed overflow)
    
    ; === COMPARING VALUES USING CMP ===
    LDA #10         ; Load first value
    CMP #5          ; Compare A with 5 (A - 5, but don't store result)
    ; This sets flags based on the comparison:
    ; Z flag = 0 (10 ≠ 5)
    ; C flag = 1 (10 ≥ 5, no borrow needed)
    ; N flag = 0 (10 - 5 = 5, positive result)
    
    STA $0200       ; Store final result for verification
    RTS"
  language="assembly"
/>

## Conditional Branch Instructions

The real power of status flags comes when you use them to make decisions. The 6502 has conditional branch instructions that check flag states:

### Zero Flag Branches
- `BEQ label` - Branch if Equal (Zero flag set)
- `BNE label` - Branch if Not Equal (Zero flag clear)

### Carry Flag Branches  
- `BCS label` - Branch if Carry Set
- `BCC label` - Branch if Carry Clear

### Negative Flag Branches
- `BMI label` - Branch if Minus (Negative flag set)
- `BPL label` - Branch if Plus (Negative flag clear)

### Overflow Flag Branches
- `BVS label` - Branch if Overflow Set
- `BVC label` - Branch if Overflow Clear

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Conditional Branches Demo"
  code="; Demonstration of 6502 conditional branch instructions
; This program makes decisions based on flag states

ConditionalBranchesDemo:
    ; === TESTING FOR ZERO ===
    LDA #0          ; Load test value
    BEQ IsZero      ; Branch if zero flag is set
    BNE NotZero     ; Branch if zero flag is clear
    
IsZero:
    LDX #$5A        ; Mark that we detected zero ('Z' pattern)
    JMP ContinueTest
    
NotZero:
    LDX #$A5        ; Mark that we detected non-zero
    
ContinueTest:
    STX $0200       ; Store result
    
    ; === TESTING FOR CARRY ===
    CLC             ; Clear carry first
    LDA #$FF        ; Load 255
    ADC #$01        ; Add 1 (this will produce carry)
    BCS HasCarry    ; Branch if carry flag is set
    BCC NoCarry     ; Branch if carry flag is clear
    
HasCarry:
    LDY #$C1        ; Mark that carry occurred
    JMP SignTest
    
NoCarry:
    LDY #$C0        ; Mark that no carry occurred
    
SignTest:
    STY $0201       ; Store carry test result
    
    ; === TESTING FOR NEGATIVE ===
    LDA #$80        ; Load 128 (negative in signed arithmetic)
    BMI IsNegative  ; Branch if minus (negative flag set)
    BPL IsPositive  ; Branch if plus (negative flag clear)
    
IsNegative:
    LDA #$EE        ; Mark as negative
    JMP EndDemo
    
IsPositive:
    LDA #$77        ; Mark as positive
    
EndDemo:
    STA $0202       ; Store sign test result
    
    ; === COMPARING TWO NUMBERS ===
    LDA #15         ; First number
    CMP #10         ; Compare with 10
    BEQ AreEqual    ; Branch if equal (A = 10)
    BCC IsLess      ; Branch if A < 10 (carry clear)
    BCS IsGreater   ; Branch if A >= 10 (carry set)
    
AreEqual:
    LDA #$45        ; 'E' for Equal
    JMP StoreResult
    
IsLess:
    LDA #$4C        ; 'L' for Less
    JMP StoreResult
    
IsGreater:
    LDA #$47        ; 'G' for Greater
    
StoreResult:
    STA $0203       ; Store comparison result
    
    RTS"
  language="assembly"
/>

## Using CMP for Decision Making

The CMP instruction is perfect for comparing values and making decisions:

```text
CMP value           ; Compare A with value
CMP $address        ; Compare A with value at address
CMP $address,X      ; Compare A with value at address + X
```

CMP performs A - operand but doesn't store the result - it only sets the flags!

### CMP Flag Results
- **Z flag**: Set if A equals the compared value
- **C flag**: Set if A ≥ compared value (no borrow needed)
- **N flag**: Set if the subtraction result would be negative

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Compare and Decision Making"
  code="; Using CMP instruction for comparisons and decision making
; This program creates a number classification system

CompareDemo:
    ; === CLASSIFY NUMBERS AS SMALL, MEDIUM, OR LARGE ===
    LDA #150        ; Test value
    
    ; Check if small (< 50)
    CMP #50         ; Compare A with 50
    BCC IsSmall     ; Branch if A < 50 (carry clear means A < operand)
    
    ; Check if medium (50-99)
    CMP #100        ; Compare A with 100
    BCC IsMedium    ; Branch if A < 100
    
    ; Must be large (≥ 100)
    JMP IsLarge
    
IsSmall:
    LDA #$53        ; 'S' for Small
    STA $0300       ; Store classification
    JMP EndClassify
    
IsMedium:
    LDA #$4D        ; 'M' for Medium
    STA $0300       ; Store classification
    JMP EndClassify
    
IsLarge:
    LDA #$4C        ; 'L' for Large
    STA $0300       ; Store classification
    
EndClassify:
    
    ; === EQUALITY TESTING ===
    LDA #42         ; Test value
    CMP #42         ; Compare with itself
    BEQ AreEqual    ; Branch if equal (zero flag set)
    BNE NotEqual
    
AreEqual:
    LDA #$45        ; 'E' for Equal
    STA $0301
    JMP BoundaryTest
    
NotEqual:
    LDA #$4E        ; 'N' for Not equal
    STA $0301
    
BoundaryTest:
    ; === BOUNDARY CONDITION TESTING ===
    LDA #255        ; Maximum 8-bit value
    CMP #255        ; Compare with maximum
    BEQ AtMaximum   ; Equal to maximum?
    BCC BelowMaximum
    
AtMaximum:
    LDA #$4D        ; 'M' for Maximum
    STA $0302
    JMP RangeTest
    
BelowMaximum:
    LDA #$42        ; 'B' for Below maximum
    STA $0302
    
RangeTest:
    ; === RANGE CHECKING ===
    ; Check if value is between 50 and 200 (inclusive)
    LDA #150        ; Test value
    
    CMP #50         ; Check lower bound
    BCC OutOfRange  ; Branch if A < 50
    CMP #201        ; Check upper bound (200 + 1)
    BCS OutOfRange  ; Branch if A >= 201
    
    ; Value is in range (50-200)
    LDA #$49        ; 'I' for In range
    STA $0303
    JMP MultiTest
    
OutOfRange:
    LDA #$4F        ; 'O' for Out of range
    STA $0303
    
MultiTest:
    ; === MULTIPLE CONDITION TESTING ===
    ; Test if value is exactly 100, 150, or 200
    LDA #150        ; Test value
    
    CMP #100        ; Is it 100?
    BEQ SpecialValue
    CMP #150        ; Is it 150?
    BEQ SpecialValue
    CMP #200        ; Is it 200?
    BEQ SpecialValue
    
    ; Not a special value
    LDA #$4E        ; 'N' for Normal
    STA $0304
    JMP ArrayTest
    
SpecialValue:
    LDA #$53        ; 'S' for Special
    STA $0304
    
ArrayTest:
    ; === ARRAY BOUNDS CHECKING ===
    LDX #5          ; Array index to test
    CPX #ArraySize  ; Compare with array size
    BCS IndexTooBig ; Branch if index >= size
    
    ; Index is valid, access array
    LDA ArrayData,X ; Load from array
    STA $0305       ; Store array value
    JMP EndDemo
    
IndexTooBig:
    LDA #$FF        ; Error marker
    STA $0305       ; Store error
    
EndDemo:
    RTS

; Data for array test
ArrayData:
    .byte $10, $20, $30, $40, $50
ArraySize = 5"
  language="assembly"
/>

## Building Smart Loops with Flags

Status flags are essential for creating efficient loops:

### Counting Down to Zero
```text
LDX #10         ; Loop counter
CountDown:
    ; Do something here
    DEX             ; Decrement counter (sets zero flag if X = 0)
    BNE CountDown   ; Continue if not zero
```

### Searching Through Data
```text
LDX #$00        ; Initialize index
LDA #TargetValue ; Value we're looking for
SearchLoop:
    CMP DataArray,X ; Compare with current data
    BEQ Found       ; Branch if found
    INX             ; Move to next data
    CPX #ArraySize  ; Check bounds
    BNE SearchLoop  ; Continue if not at end
Found:
    ; Found the value!
```

**Smart Loops with Flags:**

```assembly
; Demonstration of using flags in loops
; This program shows practical loop patterns

SmartLoopsDemo:
    ; === COUNTDOWN LOOP ===
    ; Fill memory locations with countdown values
    LDX #10         ; Count from 10 down to 1
    LDY #$00        ; Memory offset
    
CountdownLoop:
    TXA             ; Transfer count to accumulator
    STA $0400,Y     ; Store countdown value
    INY             ; Next memory location
    DEX             ; Decrement counter (sets Z flag if X = 0)
    BNE CountdownLoop ; Continue if not zero
    
    ; === SEARCH LOOP ===
    ; Search for a specific character in data
    LDX #$00        ; Initialize index
    LDA #$58        ; Looking for 'X' character ($58)
    
SearchLoop:
    CMP TestData,X  ; Compare A with data at index X
    BEQ FoundTarget ; Branch if found
    INX             ; Move to next data byte
    CPX #TestDataSize ; Check if reached end
    BNE SearchLoop  ; Continue if not at end
    
    ; Not found
    LDA #$4E        ; 'N' for Not found
    STA $0500
    JMP SearchEnd
    
FoundTarget:
    LDA #$46        ; 'F' for Found
    STA $0500       ; Store result
    STX $0501       ; Store position where found
    
SearchEnd:
    
    ; === BOUNDED LOOP ===
    ; Loop with upper and lower bounds checking
    LDA #5          ; Start value
    
BoundedLoop:
    STA $0510,Y     ; Store current value
    INY             ; Next position
    CLC             ; Clear carry
    ADC #3          ; Add 3 each iteration
    CMP #50         ; Check upper bound
    BCC BoundedLoop ; Continue if less than 50
    
    ; === STRING PROCESSING LOOP ===
    ; Process a null-terminated string
    LDX #$00        ; Initialize string index
    
StringLoop:
    LDA MessageString,X ; Load character from string
    BEQ StringDone  ; Branch if null terminator (0)
    
    ; Process character (convert to uppercase if lowercase)
    CMP #'a'        ; Compare with 'a'
    BCC NotLowercase ; Branch if less than 'a'
    CMP #'z'+1      ; Compare with 'z'+1
    BCS NotLowercase ; Branch if greater than 'z'
    
    ; Convert to uppercase
    SEC             ; Set carry for subtraction
    SBC #$20        ; Subtract 32 (difference between 'a' and 'A')
    
NotLowercase:
    STA $0600,X     ; Store processed character
    INX             ; Move to next character
    JMP StringLoop  ; Continue processing
    
StringDone:
    LDA #$00        ; Store null terminator
    STA $0600,X
    
    ; === ARRAY MAXIMUM FINDER ===
    ; Find the largest value in an array
    LDX #$00        ; Initialize index
    LDA NumberArray,X ; Load first value as initial maximum
    STA $70         ; Store current maximum in zero page
    INX             ; Move to next element
    
MaxLoop:
    CPX #NumberArraySize ; Check if processed all elements
    BEQ MaxDone     ; Branch if done
    
    LDA NumberArray,X ; Load next array element
    CMP $70         ; Compare with current maximum
    BCC NotNewMax   ; Branch if not greater than current max
    
    ; Found new maximum
    STA $70         ; Store new maximum
    
NotNewMax:
    INX             ; Move to next element
    JMP MaxLoop     ; Continue search
    
MaxDone:
    LDA $70         ; Load final maximum
    STA $0520       ; Store result
    
    ; === MEMORY BLOCK COMPARISON ===
    ; Compare two blocks of memory
    LDX #$00        ; Initialize index
    
CompareLoop:
    CPX #BlockSize  ; Check if compared all bytes
    BEQ BlocksEqual ; Branch if reached end (all equal)
    
    LDA Block1,X    ; Load byte from first block
    CMP Block2,X    ; Compare with byte from second block
    BNE BlocksDifferent ; Branch if different
    
    INX             ; Move to next byte
    JMP CompareLoop ; Continue comparison
    
BlocksEqual:
    LDA #$45        ; 'E' for Equal
    STA $0530
    JMP EndDemo
    
BlocksDifferent:
    LDA #$44        ; 'D' for Different
    STA $0530
    STX $0531       ; Store position of difference
    
EndDemo:
    RTS

; Data for examples
TestData:
    .byte $41, $42, $43, $58, $59, $5A  ; 'ABC' + 'X' + 'YZ'
TestDataSize = 6

MessageString:
    .byte
```

## Advanced Flag Techniques

### Flag Manipulation Instructions
```text
CLC             ; Clear Carry flag
SEC             ; Set Carry flag
CLI             ; Clear Interrupt flag  
SEI             ; Set Interrupt flag
CLD             ; Clear Decimal flag
SED             ; Set Decimal flag
CLV             ; Clear Overflow flag
```

### Testing Multiple Conditions
```text
; Check if A is between 10 and 20
CMP #10         ; Compare with lower bound
BCC TooSmall    ; Branch if A < 10
CMP #21         ; Compare with upper bound + 1
BCS TooBig      ; Branch if A >= 21
; A is between 10 and 20
```

**Advanced Flag Techniques:**

```assembly
; Advanced techniques using 6502 flags
; This program demonstrates complex decision making

AdvancedFlagsDemo:
    ; === MULTI-CONDITION RANGE CHECKING ===
    ; Check if player position is within game boundaries
    LDA PlayerX     ; Load player X position
    
    ; Check X boundaries (16 to 240)
    CMP #16         ; Compare with left boundary
    BCC OutOfBounds ; Branch if too far left
    CMP #241        ; Compare with right boundary + 1
    BCS OutOfBounds ; Branch if too far right
    
    LDA PlayerY     ; Load player Y position
    ; Check Y boundaries (32 to 224)
    CMP #32         ; Compare with top boundary
    BCC OutOfBounds ; Branch if too high
    CMP #225        ; Compare with bottom boundary + 1
    BCS OutOfBounds ; Branch if too low
    
    ; Player is within bounds
    LDA #$49        ; 'I' for In bounds
    STA $0600
    JMP CollisionCheck
    
OutOfBounds:
    LDA #$4F        ; 'O' for Out of bounds
    STA $0600
    JMP CollisionCheck
    
CollisionCheck:
    ; === COLLISION DETECTION USING FLAGS ===
    ; Check if two objects are overlapping
    LDA Object1X    ; Load first object X
    CLC
    ADC Object1Width ; Add width
    CMP Object2X    ; Compare with second object X
    BCC NoCollision ; No overlap if obj1_right < obj2_left
    
    LDA Object2X    ; Load second object X
    CLC
    ADC Object2Width ; Add width
    CMP Object1X    ; Compare with first object X
    BCC NoCollision ; No overlap if obj2_right < obj1_left
    
    ; Objects overlap in X, check Y
    LDA Object1Y    ; Load first object Y
    CLC
    ADC Object1Height ; Add height
    CMP Object2Y    ; Compare with second object Y
    BCC NoCollision ; No overlap if obj1_bottom < obj2_top
    
    LDA Object2Y    ; Load second object Y
    CLC
    ADC Object2Height ; Add height
    CMP Object1Y    ; Compare with first object Y
    BCC NoCollision ; No overlap if obj2_bottom < obj1_top
    
    ; Collision detected!
    LDA #$43        ; 'C' for Collision
    STA $0601
    JMP GameStateCheck
    
NoCollision:
    LDA #$4E        ; 'N' for No collision
    STA $0601
    
GameStateCheck:
    ; === GAME STATE MANAGEMENT WITH FLAGS ===
    ; Use flags to manage complex game states
    LDA GameFlags   ; Load game state flags
    
    ; Check if game is paused (bit 0)
    AND #%00000001  ; Mask bit 0
    BNE GamePaused  ; Branch if paused
    
    ; Game is running, check other states
    LDA GameFlags   ; Reload flags
    AND #%00000010  ; Check bit 1 (power-up active)
    BEQ NormalMode  ; Branch if no power-up
    
    ; Power-up mode
    LDA #$50        ; 'P' for Power-up
    STA $0602
    JMP InputCheck
    
NormalMode:
    LDA #$4E        ; 'N' for Normal
    STA $0602
    JMP InputCheck
    
GamePaused:
    LDA #$50        ; 'P' for Paused
    STA $0602
    JMP InputCheck  ; Still check input to unpause
    
InputCheck:
    ; === BUTTON INPUT PROCESSING ===
    ; Process controller input using flags
    LDA ButtonState ; Load current button state
    
    ; Check A button (bit 0)
    AND #%00000001  ; Mask A button
    BEQ NoAButton   ; Branch if not pressed
    
    ; A button pressed, check if was pressed last frame
    LDA LastButtonState ; Load previous state
    AND #%00000001  ; Mask A button
    BNE NoAButton   ; Branch if was already pressed (no new press)
    
    ; New A button press detected
    LDA #$41        ; 'A' for A button pressed
    STA $0603
    JMP DirectionCheck
    
NoAButton:
    LDA #$2D        ; '-' for no button
    STA $0603
    
DirectionCheck:
    ; === DIRECTIONAL INPUT PROCESSING ===
    ; Process D-pad input
    LDA ButtonState ; Load button state
    
    ; Check for simultaneous left+right (invalid)
    AND #%11000000  ; Mask left and right bits
    CMP #%11000000  ; Both pressed?
    BEQ InvalidInput ; Branch if both pressed
    
    ; Check individual directions
    LDA ButtonState
    AND #%10000000  ; Check left
    BNE LeftPressed
    
    LDA ButtonState
    AND #%01000000  ; Check right
    BNE RightPressed
    
    ; No horizontal input
    LDA #$2D        ; '-' for no direction
    STA $0604
    JMP VerticalCheck
    
LeftPressed:
    LDA #$4C        ; 'L' for Left
    STA $0604
    JMP VerticalCheck
    
RightPressed:
    LDA #$52        ; 'R' for Right
    STA $0604
    JMP VerticalCheck
    
InvalidInput:
    LDA #$49        ; 'I' for Invalid
    STA $0604
    
VerticalCheck:
    ; Similar logic for up/down...
    LDA ButtonState
    AND #%00110000  ; Mask up and down bits
    CMP #%00110000  ; Both pressed?
    BEQ InvalidVertical
    
    ; Check individual directions
    LDA ButtonState
    AND #%00100000  ; Check up
    BNE UpPressed
    
    LDA ButtonState
    AND #%00010000  ; Check down
    BNE DownPressed
    
    LDA #$2D        ; '-' for no vertical
    STA $0605
    JMP EndDemo
    
UpPressed:
    LDA #$55        ; 'U' for Up
    STA $0605
    JMP EndDemo
    
DownPressed:
    LDA #$44        ; 'D' for Down
    STA $0605
    JMP EndDemo
    
InvalidVertical:
    LDA #$49        ; 'I' for Invalid
    STA $0605
    
EndDemo:
    ; Update last button state for next frame
    LDA ButtonState
    STA LastButtonState
    
    RTS

; Game data
PlayerX:        .byte $80
PlayerY:        .byte $90

Object1X:       .byte $50
Object1Y:       .byte $60
Object1Width:   .byte $16
Object1Height:  .byte $16

Object2X:       .byte $60
Object2Y:       .byte $70
Object2Width:   .byte $16
Object2Height:  .byte $16

GameFlags:      .byte %00000010  ; Bit 1 set (power-up active)
ButtonState:    .byte %10000001  ; Left + A button pressed
LastButtonState: .byte %00000000  ; No buttons last frame
```

## Practice Exercise

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Status Flags Practice"
  code="; Practice Exercise: NES Game State Manager
; Create a comprehensive system using status flags for decision making

GameStatePractice:
    ; Initialize game variables
    JSR InitializeGame
    
    ; Main game loop simulation
    JSR ProcessInput
    JSR UpdatePlayer
    JSR CheckCollisions
    JSR UpdateGameState
    
    RTS

InitializeGame:
    ; Initialize player position
    LDA #$80        ; Center X
    STA PlayerXPos
    LDA #$70        ; Center Y  
    STA PlayerYPos
    
    ; Initialize game state
    LDA #%00000001  ; Game active flag
    STA GameStatus
    
    ; Initialize health
    LDA #$03        ; 3 health points
    STA PlayerHealth
    
    ; Initialize score
    LDA #$00
    STA ScoreLow
    STA ScoreHigh
    
    RTS

ProcessInput:
    ; Simulate reading controller input
    LDA ControllerInput ; Load simulated input
    
    ; Check pause button (Start = bit 3)
    AND #%00001000  ; Mask start button
    BEQ NoPause     ; Branch if not pressed
    
    ; Toggle pause state
    LDA GameStatus
    EOR #%00000010  ; Toggle pause bit (bit 1)
    STA GameStatus
    
NoPause:
    ; Check if game is paused
    LDA GameStatus
    AND #%00000010  ; Check pause bit
    BNE SkipMovement ; Skip movement if paused
    
    ; Process movement input
    LDA ControllerInput
    AND #%11110000  ; Mask directional bits
    BEQ NoMovement  ; Branch if no direction pressed
    
    ; Check left
    LDA ControllerInput
    AND #%10000000  ; Check left bit
    BEQ CheckRight
    
    ; Move left
    LDA PlayerXPos
    SEC             ; Set carry for subtraction
    SBC #$02        ; Move left 2 pixels
    BCC LeftBoundary ; Branch if underflow
    STA PlayerXPos  ; Store new position
    JMP CheckVertical
    
LeftBoundary:
    LDA #$00        ; Clamp to left edge
    STA PlayerXPos
    JMP CheckVertical
    
CheckRight:
    LDA ControllerInput
    AND #%01000000  ; Check right bit
    BEQ CheckVertical
    
    ; Move right
    LDA PlayerXPos
    CLC             ; Clear carry for addition
    ADC #$02        ; Move right 2 pixels
    CMP #$F0        ; Check right boundary
    BCS RightBoundary ; Branch if too far right
    STA PlayerXPos  ; Store new position
    JMP CheckVertical
    
RightBoundary:
    LDA #$EF        ; Clamp to right edge
    STA PlayerXPos
    
CheckVertical:
    ; Check up
    LDA ControllerInput
    AND #%00100000  ; Check up bit
    BEQ CheckDown
    
    ; Move up
    LDA PlayerYPos
    SEC             ; Set carry for subtraction
    SBC #$02        ; Move up 2 pixels
    BCC TopBoundary ; Branch if underflow
    STA PlayerYPos  ; Store new position
    JMP NoMovement
    
TopBoundary:
    LDA #$00        ; Clamp to top edge
    STA PlayerYPos
    JMP NoMovement
    
CheckDown:
    LDA ControllerInput
    AND #%00010000  ; Check down bit
    BEQ NoMovement
    
    ; Move down
    LDA PlayerYPos
    CLC             ; Clear carry for addition
    ADC #$02        ; Move down 2 pixels
    CMP #$E0        ; Check bottom boundary
    BCS BottomBoundary ; Branch if too far down
    STA PlayerYPos  ; Store new position
    JMP NoMovement
    
BottomBoundary:
    LDA #$DF        ; Clamp to bottom edge
    STA PlayerYPos
    
NoMovement:
SkipMovement:
    RTS

UpdatePlayer:
    ; Check if player has health
    LDA PlayerHealth
    BEQ PlayerDead  ; Branch if no health
    
    ; Player is alive, update normally
    LDA GameStatus
    ORA #%00000001  ; Set alive bit
    STA GameStatus
    
    ; Increment score slowly
    INC ScoreLow    ; Increment low byte
    BNE ScoreOK     ; Branch if no overflow
    INC ScoreHigh   ; Increment high byte if overflow
    
ScoreOK:
    RTS
    
PlayerDead:
    ; Player is dead
    LDA GameStatus
    AND #%11111110  ; Clear alive bit
    STA GameStatus
    RTS

CheckCollisions:
    ; Check if player is alive first
    LDA GameStatus
    AND #%00000001  ; Check alive bit
    BEQ NoCollisions ; Skip collisions if dead
    
    ; Simple collision with enemy at fixed position
    LDA PlayerXPos
    CMP EnemyXPos   ; Compare X positions
    BCC NoXCollision ; Branch if player left of enemy
    
    SEC             ; Set carry for subtraction
    SBC #$10        ; Account for player width
    CMP EnemyXPos
    BCS NoXCollision ; Branch if no X overlap
    
    ; Check Y collision
    LDA PlayerYPos
    CMP EnemyYPos   ; Compare Y positions
    BCC NoCollisions ; Branch if player above enemy
    
    SEC             ; Set carry for subtraction
    SBC #$10        ; Account for player height
    CMP EnemyYPos
    BCS NoCollisions ; Branch if no Y overlap
    
    ; Collision detected!
    DEC PlayerHealth ; Reduce health
    BNE StillAlive  ; Branch if still has health
    
    ; Player died
    LDA GameStatus
    AND #%11111110  ; Clear alive bit
    STA GameStatus
    RTS
    
StillAlive:
    ; Flash invincibility (simple flag toggle)
    LDA GameStatus
    EOR #%00000100  ; Toggle invincible bit
    STA GameStatus
    RTS
    
NoXCollision:
NoCollisions:
    ; Clear invincibility if no collision
    LDA GameStatus
    AND #%11111011  ; Clear invincible bit
    STA GameStatus
    RTS

UpdateGameState:
    ; Update overall game state based on conditions
    
    ; Check win condition (score >= 1000)
    LDA ScoreHigh
    CMP #$03        ; Check if score >= 768 (simplified)
    BCC NotWon      ; Branch if score too low
    
    LDA ScoreLow
    CMP #$E8        ; Check if low byte >= 232 (768 + 232 = 1000)
    BCC NotWon      ; Branch if score too low
    
    ; Player won!
    LDA GameStatus
    ORA #%00001000  ; Set won bit
    STA GameStatus
    
NotWon:
    ; Store final status for display
    LDA GameStatus  ; Load final game status
    STA $0700       ; Store for examination
    
    LDA PlayerHealth ; Load current health
    STA $0701       ; Store for examination
    
    LDA ScoreLow    ; Load score low byte
    STA $0702       ; Store for examination
    
    LDA ScoreHigh   ; Load score high byte
    STA $0703       ; Store for examination
    
    RTS

; Game variables
PlayerXPos:     .byte $80
PlayerYPos:     .byte $70
PlayerHealth:   .byte $03
GameStatus:     .byte %00000001  ; Bit 0: alive, Bit 1: paused, Bit 2: invincible, Bit 3: won
ScoreLow:       .byte $00
ScoreHigh:      .byte $00
EnemyXPos:      .byte $A0
EnemyYPos:      .byte $80
ControllerInput: .byte %10000000  ; Simulate left pressed

; Challenge exercises:
; 1. Add multiple enemies with different collision behaviors
; 2. Implement power-ups that affect player state
; 3. Create a lives system with game over detection
; 4. Add sound triggers based on game state changes"
  language="assembly"
/>

## What You've Learned

In this lesson, you've learned:

1. **6502 Status Flags** - How the 6502 tracks operation results automatically
2. **Main Flags** - Negative (N), Overflow (V), Zero (Z), and Carry (C) 
3. **Conditional Branches** - Making program decisions based on flag states
4. **Compare Operations** - Using CMP to test values without changing them
5. **Smart Programming** - Building responsive programs that adapt to conditions

## Looking Ahead

Next, you'll learn about 6502 arithmetic operations - how to perform mathematical calculations and manipulate numbers with precision. You'll discover how arithmetic operations interact with the status flags you've just learned!

## Fun Fact

The 6502's status flags were designed to make assembly programming more intuitive and powerful. The ability to test conditions with simple mnemonic instructions like BEQ (Branch if Equal) and BCC (Branch if Carry Clear) made the 6502 much easier to program than many other processors of its era. This user-friendly design was one of the key factors that made the 6502 so popular with both professional developers and hobbyists, contributing to its use in everything from the Apple II to the NES and countless other systems!