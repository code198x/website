---
title: "Status Flags and Comparisons"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 23
description: "Master the Z80's sophisticated flag system for advanced comparisons and conditional logic. Learn to use all flags effectively for complex decision making."
learning_objectives:
  - "Understand all Z80 status flags in detail"
  - "Master advanced comparison techniques and patterns"
  - "Learn flag manipulation and testing operations"
  - "Practice complex multi-condition logic"
  - "Build sophisticated conditional structures"
concepts:
  - "Complete Z80 flag register (S, Z, H, P/V, N, C)"
  - "Advanced comparison operations"
  - "Flag manipulation instructions"
  - "Multi-condition testing patterns"
  - "Signed vs unsigned comparisons"
estimated_duration: "55-65 minutes"
difficulty: "hard"
code_examples: true
practical_exercise: true
order: 23
---

# Lesson 23: Status Flags and Comparisons

The Z80's flag system is more sophisticated than many processors, providing detailed information about operation results. Mastering all flags and their uses enables you to write complex conditional logic efficiently. This lesson explores every flag in detail and shows advanced comparison techniques.

## Complete Z80 Flag Register

### Flag Register Layout

The Z80's flag register (F) contains 8 bits of status information:

```
Bit 7: S (Sign Flag)        - Set if result is negative (bit 7 = 1)
Bit 6: Z (Zero Flag)        - Set if result is zero
Bit 5: Y (Undocumented)     - Copy of bit 5 of result
Bit 4: H (Half-Carry Flag)  - Set if carry from bit 3 to bit 4
Bit 3: X (Undocumented)     - Copy of bit 3 of result  
Bit 2: P/V (Parity/Overflow)- Set based on parity or overflow
Bit 1: N (Add/Subtract Flag)- Set if last operation was subtraction
Bit 0: C (Carry Flag)       - Set if carry out of bit 7
```

### Flag Setting Examples

```text
; Different operations set flags differently
LD A, $80               ; A = 128 (10000000 binary)
ADD A, $80              ; A = 0, flags: S=0, Z=1, H=0, P/V=1, N=0, C=1

LD A, $7F               ; A = 127 (01111111 binary)  
ADD A, 1                ; A = $80, flags: S=1, Z=0, H=1, P/V=1, N=0, C=0

LD A, $FF               ; A = 255
INC A                   ; A = 0, flags: S=0, Z=1, H=1, P/V=0, N=0, C=0 (note: INC doesn't affect C)
```

<CodeRunner 
  system="zx-spectrum"
  title="Flag Register Exploration"
  code="; Demonstrate how different operations affect flags

; Test 1: Basic arithmetic flags
TestArithmetic:
    LD A, 100           ; Start with 100
    ADD A, 50           ; A = 150, should set no special flags
    ; Flags: S=1 (negative in signed interpretation), Z=0, C=0
    
    LD A, 255           ; Maximum 8-bit value
    ADD A, 1            ; A = 0, should set Z and C flags
    ; Flags: S=0, Z=1, C=1 (carry out), P/V=0
    
    LD A, 127           ; Maximum positive signed value
    ADD A, 1            ; A = 128, should set S and P/V flags
    ; Flags: S=1 (negative), Z=0, C=0, P/V=1 (overflow)
    RET

; Test 2: Comparison operations
TestComparisons:
    LD A, 50
    CP 30               ; Compare A with 30 (A > 30)
    ; Flags: S=0, Z=0, C=0 (A >= 30)
    
    LD A, 20
    CP 30               ; Compare A with 30 (A < 30)
    ; Flags: S=1, Z=0, C=1 (A < 30, result negative)
    
    LD A, 30
    CP 30               ; Compare A with 30 (A = 30)
    ; Flags: S=0, Z=1, C=0 (A = 30, result zero)
    RET

; Test 3: Logical operations
TestLogical:
    LD A, %10101010     ; Pattern
    AND %11110000       ; Mask operation
    ; Flags: S=1, Z=0, P/V=? (parity), N=0, C=0
    
    LD A, %11110000
    XOR %11110000       ; XOR with itself = 0
    ; Flags: S=0, Z=1, P/V=1 (even parity), N=0, C=0
    
    LD A, 0
    OR A                ; Test if A is zero
    ; Flags: S=0, Z=1, P/V=1, N=0, C=0
    RET

; Test 4: Increment/Decrement behavior
TestIncDec:
    LD A, 255
    INC A               ; A = 0
    ; Flags: S=0, Z=1, H=1, P/V=0, N=0, C=? (C unchanged!)
    
    LD A, 128
    DEC A               ; A = 127
    ; Flags: S=0, Z=0, H=1, P/V=1 (overflow), N=1, C=? (C unchanged!)
    
    LD A, 0
    DEC A               ; A = 255
    ; Flags: S=1, Z=0, H=1, P/V=0, N=1, C=? (C unchanged!)
    RET"
  language="assembly"
/>

## Advanced Comparison Techniques

### Signed vs Unsigned Comparisons

```text
; Understanding signed vs unsigned interpretation
UnsignedComparison:
    ; Unsigned: treats all values as 0-255
    LD A, 200           ; Unsigned: 200
    CP 100              ; Compare with 100
    ; Result: A > 100 (unsigned), so Carry clear, Zero clear
    JR C, AIsSmaller    ; Won't jump (200 > 100 unsigned)
    ; A is greater or equal
    RET

SignedComparison:
    ; Signed: treats values as -128 to +127
    LD A, 200           ; Signed interpretation: -56 (200-256)
    CP 100              ; Compare with 100
    ; For signed comparison, we need to check overflow flag
    JP M, AIsNegative   ; Jump if result is negative (sign flag set)
    ; A is positive (signed)
    RET

AIsSmaller:
AIsNegative:
    ; Handle case where A is smaller/negative
    RET
```

### Multi-Byte Comparisons

```text
; Compare 16-bit values in HL and DE
; Returns: Carry set if HL < DE, Zero set if HL = DE
Compare16Bit:
    ; Compare high bytes first
    LD A, H
    CP D                ; Compare high bytes
    JR C, HL_Less       ; If H < D, then HL < DE
    JR NZ, HL_Greater   ; If H > D, then HL > DE
    
    ; High bytes equal, compare low bytes
    LD A, L
    CP E                ; Compare low bytes
    ; Flags now correctly set for HL vs DE comparison
    RET
    
HL_Less:
    SCF                 ; Set carry (HL < DE)
    RET
    
HL_Greater:
    OR A                ; Clear carry and zero (HL > DE)
    RET
```

### Range Checking

```text
; Check if value is within range
; Input: A = value, B = min, C = max
; Output: Zero flag set if in range
CheckRange:
    CP B                ; Compare with minimum
    JR C, OutOfRange    ; Below minimum
    
    CP C                ; Compare with maximum
    JR Z, InRange       ; Equal to maximum is OK
    JR NC, OutOfRange   ; Above maximum
    
InRange:
    XOR A               ; Set zero flag (in range)
    RET
    
OutOfRange:
    OR 1                ; Clear zero flag (out of range)
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Advanced Comparison Techniques"
  code="; Advanced comparison and range checking

; 16-bit comparison function
; Compare HL with DE, return relationship
Compare16:
    ; Input: HL and DE contain 16-bit values
    ; Output: A = 0 if HL < DE, 1 if HL = DE, 2 if HL > DE
    
    ; Compare high bytes first
    LD A, H
    CP D
    JR C, HL_Less       ; H < D, so HL < DE
    JR NZ, HL_Greater   ; H > D, so HL > DE
    
    ; High bytes equal, compare low bytes
    LD A, L
    CP E
    JR C, HL_Less       ; L < E, so HL < DE
    JR Z, HL_Equal      ; L = E, so HL = DE
    
    ; L > E, so HL > DE
HL_Greater:
    LD A, 2             ; HL > DE
    RET
    
HL_Equal:
    LD A, 1             ; HL = DE
    RET
    
HL_Less:
    LD A, 0             ; HL < DE
    RET

; Multi-condition range checking
; Check if value is in one of multiple ranges
CheckMultipleRanges:
    ; Input: A = value to check
    ; Check if A is in ranges: 10-20, 30-40, or 50-60
    
    ; Range 1: 10-20
    CP 10
    JR C, CheckRange2   ; Below range 1
    CP 21
    JR C, InRange       ; In range 1 (10-20)
    
CheckRange2:
    ; Range 2: 30-40
    CP 30
    JR C, CheckRange3   ; Below range 2
    CP 41
    JR C, InRange       ; In range 2 (30-40)
    
CheckRange3:
    ; Range 3: 50-60
    CP 50
    JR C, NotInRanges   ; Below range 3
    CP 61
    JR C, InRange       ; In range 3 (50-60)
    
NotInRanges:
    LD B, 0             ; Not in any range
    RET
    
InRange:
    LD B, 1             ; In one of the ranges
    RET

; Signed comparison helper
; Compare A with B as signed values (-128 to +127)
SignedCompare:
    ; Input: A and B contain signed values
    ; Output: A = 0 if A < B, 1 if A = B, 2 if A > B
    
    ; Convert to signed comparison
    SUB B               ; A = A - B
    JP M, A_Less_Signed ; Jump if result negative (A < B)
    JR Z, A_Equal_Signed ; Jump if result zero (A = B)
    
    ; Result positive (A > B)
    LD A, 2
    RET
    
A_Equal_Signed:
    LD A, 1
    RET
    
A_Less_Signed:
    LD A, 0
    RET

; Test the comparison functions
TestComparisons:
    ; Test 16-bit comparison
    LD HL, $1234
    LD DE, $1200
    CALL Compare16      ; Should return 2 (HL > DE)
    LD C, A             ; Save result
    
    ; Test range checking
    LD A, 35            ; Should be in range 30-40
    CALL CheckMultipleRanges
    LD D, B             ; Save result (should be 1)
    
    ; Test signed comparison
    LD A, 200           ; -56 in signed
    LD B, 100           ; +100 in signed
    CALL SignedCompare  ; Should return 0 (A < B in signed)
    LD E, A             ; Save result
    
    RET
    ; Results: C=2, D=1, E=0"
  language="assembly"
/>

## Flag Manipulation Instructions

### Direct Flag Operations

```text
; Instructions that directly manipulate flags
SCF                     ; Set Carry Flag (C = 1)
CCF                     ; Complement Carry Flag (C = !C)
CPL                     ; Complement accumulator (A = !A, affects H and N flags)

; No direct instructions for other flags, but you can manipulate them indirectly:
OR A                    ; Clear C, set Z if A=0, set S if A has bit 7 set
AND A                   ; Same as OR A (clears C, sets Z/S based on A)
XOR A                   ; Clear A and set Z flag, clear C
```

### Conditional Flag Testing

```text
; Test specific flag states without affecting other flags
TestZeroFlag:
    ; Test if last operation resulted in zero
    JR Z, WasZero       ; Jump if zero flag set
    JR NZ, WasNotZero   ; Jump if zero flag clear
    
TestCarryFlag:
    ; Test if last operation generated carry
    JR C, HadCarry      ; Jump if carry flag set
    JR NC, NoCarry      ; Jump if carry flag clear
    
TestSignFlag:
    ; Test if result was negative (in signed interpretation)
    JP M, WasNegative   ; Jump if sign flag set (negative)
    JP P, WasPositive   ; Jump if sign flag clear (positive)
    
TestParityOverflow:
    ; Test parity or overflow (context dependent)
    JP PE, ParityEven   ; Jump if P/V set (even parity or overflow)
    JP PO, ParityOdd    ; Jump if P/V clear (odd parity or no overflow)

WasZero:
WasNotZero:
HadCarry:
NoCarry:
WasNegative:
WasPositive:
ParityEven:
ParityOdd:
    RET
```

### Flag State Preservation

```text
; Save and restore flag state
SaveFlags:
    PUSH AF             ; Save A and flags
    ; ... do operations that modify flags ...
    POP AF              ; Restore A and flags
    RET

; Alternative: Save just flags using undocumented instruction
SaveFlagsOnly:
    PUSH AF             ; Save flags
    ; Modify A without affecting flags
    LD A, NewValue      ; This sets flags!
    POP BC              ; Get old flags into C
    PUSH BC             ; Put them back
    POP AF              ; Restore old flags, new A value
    RET

NewValue: DB 100
```

## Complex Conditional Patterns

### State Machine with Flag-Based Transitions

```text
; State machine using flag patterns for transitions
StateFlags: DB 0        ; Custom state flags

UpdateStateMachine:
    LD A, (StateFlags)
    
    ; Test multiple flags simultaneously
    AND %00000011       ; Check bottom 2 bits
    CP %00000011        ; Both set?
    JP Z, State_BothSet
    
    CP %00000001        ; Only first set?
    JP Z, State_FirstOnly
    
    CP %00000010        ; Only second set?
    JP Z, State_SecondOnly
    
    ; Neither set (00)
    JP State_NeitherSet

State_BothSet:
State_FirstOnly:
State_SecondOnly:
State_NeitherSet:
    RET
```

### Multi-Condition Validation

```text
; Complex validation using multiple flag tests
ValidateGameState:
    ; Check multiple conditions for valid game state
    
    ; Condition 1: Player health > 0
    LD A, (PlayerHealth)
    OR A
    JR Z, InvalidState  ; Health = 0 is invalid
    
    ; Condition 2: Player position in bounds
    LD A, (PlayerX)
    CP 240              ; Check X coordinate
    JR NC, InvalidState ; X >= 240 is invalid
    
    ; Condition 3: Game not paused
    LD A, (GameFlags)
    BIT 0, A            ; Check pause bit
    JR NZ, InvalidState ; Paused is invalid for this operation
    
    ; All conditions valid
    LD A, 1             ; Valid state
    RET
    
InvalidState:
    LD A, 0             ; Invalid state
    RET

PlayerHealth: DB 100
PlayerX: DB 50
GameFlags: DB 0
```

<CodeRunner 
  system="zx-spectrum"
  title="Complex Flag-Based Logic"
  code="; Complex conditional logic using flag patterns

; Bit manipulation for flag testing
GameStatus:     DB %00000000    ; Game status flags
                ; Bit 0: Player alive
                ; Bit 1: Game active
                ; Bit 2: Sound enabled
                ; Bit 3: Debug mode
                ; Bit 4-7: Unused

; Set/clear individual status flags
SetPlayerAlive:
    LD A, (GameStatus)
    SET 0, A            ; Set bit 0 (player alive)
    LD (GameStatus), A
    RET

SetGameActive:
    LD A, (GameStatus)
    SET 1, A            ; Set bit 1 (game active)
    LD (GameStatus), A
    RET

ClearPlayerAlive:
    LD A, (GameStatus)
    RES 0, A            ; Clear bit 0 (player dead)
    LD (GameStatus), A
    RET

; Test multiple conditions simultaneously
CheckGameCanProceed:
    ; Game can proceed if: player alive AND game active
    LD A, (GameStatus)
    AND %00000011       ; Check bits 0 and 1
    CP %00000011        ; Both set?
    JR Z, CanProceed
    
    ; Cannot proceed
    LD B, 0
    RET
    
CanProceed:
    LD B, 1
    RET

; Complex state validation
ValidateActionPermitted:
    ; Action permitted if:
    ; 1. Player alive (bit 0 set)
    ; 2. Game active (bit 1 set)  
    ; 3. NOT in debug mode (bit 3 clear)
    
    LD A, (GameStatus)
    
    ; Check required bits are set
    AND %00000011       ; Check bits 0,1
    CP %00000011        ; Both must be set
    JR NZ, ActionDenied
    
    ; Check forbidden bits are clear
    LD A, (GameStatus)
    BIT 3, A            ; Check debug mode bit
    JR NZ, ActionDenied ; Debug mode blocks action
    
    ; Action permitted
    LD C, 1
    RET
    
ActionDenied:
    LD C, 0
    RET

; Numerical range validation with multiple conditions
ValidatePlayerStats:
    ; Validate: 0 < health <= 100, 0 <= x < 256, 0 <= y < 192
    
    ; Check health range (1-100)
    LD A, (PlayerHealth)
    OR A                ; Check if zero
    JR Z, StatsInvalid  ; Health = 0 is invalid
    CP 101              ; Check if > 100
    JR NC, StatsInvalid ; Health > 100 is invalid
    
    ; Check X coordinate (0-255, automatically valid for 8-bit)
    ; No check needed for X since any 8-bit value is valid
    
    ; Check Y coordinate (0-191)
    LD A, (PlayerY)
    CP 192              ; Check if >= 192
    JR NC, StatsInvalid ; Y >= 192 is invalid
    
    ; All stats valid
    LD D, 1
    RET
    
StatsInvalid:
    LD D, 0
    RET

; Advanced flag pattern matching
MatchFlagPattern:
    ; Match specific patterns in game status
    LD A, (GameStatus)
    
    ; Pattern 1: %0000x011 (player alive, game active, any sound/debug)
    AND %00001011       ; Mask relevant bits
    CP %00000011        ; Check pattern
    JR Z, Pattern1Match
    
    ; Pattern 2: %0001x111 (all active, debug on)
    LD A, (GameStatus)
    AND %00001111       ; Mask relevant bits
    CP %00001111        ; Check pattern
    JR Z, Pattern2Match
    
    ; No pattern match
    LD E, 0
    RET
    
Pattern1Match:
    LD E, 1
    RET
    
Pattern2Match:
    LD E, 2
    RET

; Test all flag operations
TestFlagOperations:
    ; Initialize game state
    CALL SetPlayerAlive
    CALL SetGameActive
    
    ; Test basic conditions
    CALL CheckGameCanProceed    ; Should return 1 in B
    
    ; Test complex validation
    CALL ValidateActionPermitted ; Should return 1 in C
    
    ; Set up player stats for testing
    LD A, 75
    LD (PlayerHealth), A
    LD A, 100
    LD (PlayerY), A
    
    ; Test stats validation
    CALL ValidatePlayerStats     ; Should return 1 in D
    
    ; Test pattern matching
    CALL MatchFlagPattern        ; Should return 1 in E
    
    RET

PlayerHealth:   DB 0
PlayerY:        DB 0"
  language="assembly"
/>

## Overflow and Parity Detection

### Understanding P/V Flag

The P/V flag serves dual purposes depending on the operation:

```text
; Parity mode (after logical operations)
LogicalParity:
    LD A, %10110101     ; 5 bits set (odd parity)
    AND %11111111       ; Logical operation sets P/V to parity
    JP PO, OddParity    ; P/V clear = odd parity
    JP PE, EvenParity   ; P/V set = even parity

; Overflow mode (after arithmetic operations)
ArithmeticOverflow:
    LD A, 127           ; Maximum positive signed value
    ADD A, 1            ; Results in 128 (negative in signed)
    JP PE, Overflow     ; P/V set = signed overflow occurred
    JP PO, NoOverflow   ; P/V clear = no signed overflow

OddParity:
EvenParity:
Overflow:
NoOverflow:
    RET
```

### Detecting Signed Overflow

```text
; Detect signed arithmetic overflow
; Overflow occurs when:
; - Adding two positive numbers gives negative result
; - Adding two negative numbers gives positive result  
; - Subtracting negative from positive gives negative result
; - Subtracting positive from negative gives positive result

CheckSignedOverflow:
    ; After arithmetic operation, P/V flag indicates overflow
    JP PE, SignedOverflowOccurred
    ; No overflow
    RET
    
SignedOverflowOccurred:
    ; Handle overflow condition
    RET
```

### Safe Signed Arithmetic

```text
; Perform signed addition with overflow checking
; Input: A = first operand, B = second operand
; Output: A = result, Carry set if overflow
SafeSignedAdd:
    ADD A, B            ; Perform addition
    JP PE, AddOverflow  ; Check for signed overflow
    
    ; No overflow
    OR A                ; Clear carry
    RET
    
AddOverflow:
    SCF                 ; Set carry to indicate overflow
    RET
```

## Flag-Based Optimization

### Eliminating Redundant Tests

```text
; INEFFICIENT: Multiple comparisons
SlowRangeCheck:
    LD A, (Value)
    CP 10
    JR C, TooSmall
    LD A, (Value)       ; Redundant reload
    CP 50
    JR NC, TooBig
    ; In range
    RET

; EFFICIENT: Use flags from first comparison
FastRangeCheck:
    LD A, (Value)
    CP 10
    JR C, TooSmall
    CP 50               ; A still contains Value
    JR NC, TooBig
    ; In range
    RET

TooSmall:
TooBig:
    RET

Value: DB 25
```

### Flag Chain Optimization

```text
; Chain operations to avoid redundant flag setting
OptimizedFlagChain:
    LD A, (InputValue)
    OR A                ; Sets flags for A
    JR Z, HandleZero    ; Use zero flag
    JP M, HandleNegative ; Use sign flag (same operation)
    
    ; Positive, non-zero value
    CP 100              ; Now do range check
    JR C, HandleSmall   ; Less than 100
    ; Handle large value
    RET

HandleZero:
HandleNegative:
HandleSmall:
    RET

InputValue: DB 150
```

## Practice Exercise

Create a comprehensive flag-based system that demonstrates:

1. Multi-condition validation with complex flag logic
2. Signed and unsigned comparisons
3. Overflow detection and handling
4. Advanced flag manipulation patterns
5. Optimized conditional structures using flag chaining

<CodeRunner 
  system="zx-spectrum"
  title="Practice Exercise - Advanced Flag System"
  code="; Comprehensive flag-based conditional system

; Complex data structure for testing
PlayerData:
    DB 75               ; Health (0-100)
    DB 150              ; X position (0-255)  
    DB 100              ; Y position (0-191)
    DB 5                ; Level (1-10)
    DB %00001101        ; Status flags (bit 0=alive, bit 1=powered, bit 2=armed, bit 3=invulnerable)

; Environmental conditions
Environment:
    DB 3                ; Danger level (0-5)
    DB 25               ; Temperature (-128 to +127, signed)
    DB 200              ; Radiation (0-255)

; Complex multi-condition validator
; Returns: A = 0 (invalid), 1 (caution), 2 (safe), 3 (optimal)
ValidatePlayerState:
    ; Start with assumption of optimal conditions
    LD C, 3             ; Assume optimal
    
    ; Test 1: Player must be alive
    LD A, (PlayerData + 4) ; Get status flags
    BIT 0, A            ; Check alive bit
    JR NZ, CheckHealth  ; Continue if alive
    
    ; Player dead - completely invalid
    LD A, 0
    RET
    
CheckHealth:
    ; Test 2: Health-based conditions
    LD A, (PlayerData)  ; Get health
    CP 20               ; Critical health threshold
    JR C, CriticalHealth ; Health < 20 is critical
    
    CP 50               ; Low health threshold
    JR C, LowHealth     ; Health 20-49 is low
    
    CP 80               ; Good health threshold
    JR C, GoodHealth    ; Health 50-79 is good
    
    ; Health 80+ is excellent - no penalty
    JR CheckPosition
    
CriticalHealth:
    ; Critical health - downgrade to invalid unless invulnerable
    LD A, (PlayerData + 4)
    BIT 3, A            ; Check invulnerable bit
    JR NZ, CheckPosition ; Invulnerable - can continue
    
    LD A, 0             ; Not invulnerable - invalid
    RET
    
LowHealth:
    ; Low health - downgrade rating
    LD A, C
    CP 1                ; Already at caution or lower?
    JR C, CheckPosition ; Yes - don't downgrade further
    LD C, 1             ; Downgrade to caution
    JR CheckPosition
    
GoodHealth:
    ; Good health - slight downgrade
    LD A, C
    CP 2                ; Already at safe or lower?
    JR C, CheckPosition ; Yes - don't downgrade further  
    LD C, 2             ; Downgrade to safe
    
CheckPosition:
    ; Test 3: Position-based danger zones
    LD A, (PlayerData + 2) ; Get Y position
    CP 160              ; Danger zone Y threshold
    JR C, CheckXPosition ; Y < 160 is safe
    
    ; In Y danger zone - check if powered for protection
    LD A, (PlayerData + 4) ; Get status flags
    BIT 1, A            ; Check powered bit
    JR NZ, CheckXPosition ; Powered - protected from Y danger
    
    ; Not powered in danger zone - downgrade
    LD A, C
    CP 1
    JR C, CheckXPosition
    LD C, 1             ; Downgrade to caution
    
CheckXPosition:
    ; Check X position for special zones
    LD A, (PlayerData + 1) ; Get X position
    CP 50               ; Safe zone boundary
    JR C, SafeXZone     ; X < 50 is safe zone
    
    CP 200              ; Danger zone boundary
    JR C, NormalXZone   ; 50 <= X < 200 is normal
    
    ; X >= 200 is high danger zone
    LD A, (PlayerData + 4) ; Get status flags
    BIT 2, A            ; Check armed bit
    JR NZ, NormalXZone  ; Armed - can handle danger zone
    
    ; Unarmed in danger zone - major downgrade
    LD C, 1             ; Force to caution
    JR CheckEnvironment
    
SafeXZone:
    ; Safe zone - potential upgrade if conditions good
    LD A, C
    CP 3                ; Already optimal?
    JR Z, CheckEnvironment ; Yes - no change
    INC C               ; Upgrade one level
    JR CheckEnvironment
    
NormalXZone:
    ; Normal zone - no position modifier
    
CheckEnvironment:
    ; Test 4: Environmental hazards
    LD A, (Environment) ; Get danger level
    CP 3                ; Moderate danger threshold
    JR C, CheckTemperature ; Danger < 3 is manageable
    
    ; High environmental danger
    LD A, (PlayerData + 4) ; Get status flags
    AND %00001110       ; Check powered, armed, invulnerable bits
    CP %00001110        ; All protection bits set?
    JR Z, CheckTemperature ; Fully protected - no penalty
    
    ; Not fully protected in high danger
    LD A, C
    CP 1
    JR C, CheckTemperature
    LD C, 1             ; Downgrade to caution
    
CheckTemperature:
    ; Test 5: Signed temperature comparison
    LD A, (Environment + 1) ; Get temperature (signed)
    ; Check for extreme cold (< -50)
    CP 206              ; -50 in signed 8-bit (256-50)
    JR NC, CheckHeat    ; Temperature >= -50, check heat
    
    ; Extreme cold - need power for heating
    LD A, (PlayerData + 4)
    BIT 1, A            ; Check powered bit
    JR NZ, CheckHeat    ; Powered - protected from cold
    
    ; Unpowered in extreme cold - downgrade
    LD A, C
    CP 1
    JR C, CheckHeat
    LD C, 1
    
CheckHeat:
    ; Check for extreme heat (> 40)
    LD A, (Environment + 1)
    CP 40               ; Check if > 40
    JR C, CheckRadiation ; Temperature <= 40, check radiation
    
    ; Extreme heat - need special protection
    LD A, (PlayerData + 4)
    BIT 3, A            ; Check invulnerable bit
    JR NZ, CheckRadiation ; Invulnerable - protected from heat
    
    ; Vulnerable to extreme heat - downgrade
    LD A, C
    CP 1
    JR C, CheckRadiation
    LD C, 1
    
CheckRadiation:
    ; Test 6: Radiation exposure
    LD A, (Environment + 2) ; Get radiation level
    CP 150              ; High radiation threshold
    JR C, EvaluationDone ; Radiation < 150 is manageable
    
    ; High radiation - need multiple protections
    LD A, (PlayerData + 4)
    AND %00001010       ; Check powered and invulnerable bits
    CP %00001010        ; Both set?
    JR Z, EvaluationDone ; Protected from radiation
    
    ; Insufficient radiation protection
    LD C, 0             ; Force to invalid (radiation is deadly)
    
EvaluationDone:
    LD A, C             ; Return final evaluation
    RET

; Advanced bit pattern analyzer
AnalyzeBitPatterns:
    ; Analyze the status flags for complex patterns
    LD A, (PlayerData + 4)
    
    ; Pattern 1: Fully enhanced (%00001111 - all bits set)
    CP %00001111
    JR Z, FullyEnhanced
    
    ; Pattern 2: Combat ready (%00000101 - alive and armed)
    AND %00000101
    CP %00000101
    JR Z, CombatReady
    
    ; Pattern 3: Survival mode (%00001001 - alive and invulnerable)
    LD A, (PlayerData + 4)
    AND %00001001
    CP %00001001
    JR Z, SurvivalMode
    
    ; Pattern 4: Basic alive (%00000001 - just alive)
    LD A, (PlayerData + 4)
    AND %00000001
    CP %00000001
    JR Z, BasicAlive
    
    ; No valid pattern (dead)
    LD B, 0
    RET
    
FullyEnhanced:
    LD B, 4
    RET
    
CombatReady:
    LD B, 3
    RET
    
SurvivalMode:
    LD B, 2
    RET
    
BasicAlive:
    LD B, 1
    RET

; Comprehensive system test
TestCompleteSystem:
    ; Test current player state
    CALL ValidatePlayerState
    LD C, A             ; Save state evaluation
    
    ; Analyze bit patterns
    CALL AnalyzeBitPatterns
    LD D, B             ; Save pattern analysis
    
    ; Test with modified conditions
    ; Scenario 1: Make player invulnerable
    LD A, (PlayerData + 4)
    SET 3, A            ; Set invulnerable bit
    LD (PlayerData + 4), A
    
    CALL ValidatePlayerState
    LD E, A             ; Save enhanced evaluation
    
    ; Scenario 2: Put in extreme danger
    LD A, 5
    LD (Environment), A ; Maximum danger
    LD A, 100
    LD (Environment + 1), A ; Extreme heat
    
    CALL ValidatePlayerState
    LD H, A             ; Save danger evaluation
    
    ; Results:
    ; C = original evaluation
    ; D = bit pattern analysis
    ; E = enhanced evaluation (with invulnerability)
    ; H = danger evaluation (in extreme conditions)
    RET"
  language="assembly"
/>

## Advanced Flag Patterns

### Flag History Tracking

```text
; Track flag patterns over time
FlagHistory: DS 16      ; Store last 16 flag states
HistoryIndex: DB 0      ; Current position in history

RecordFlags:
    ; Save current flag state to history
    PUSH AF             ; Get current flags
    LD A, (HistoryIndex)
    LD HL, FlagHistory
    LD C, A
    LD B, 0
    ADD HL, BC          ; Point to storage location
    POP AF              ; Restore flags
    PUSH AF             ; Save again
    LD (HL), F          ; Store flag register
    
    ; Update index
    LD A, (HistoryIndex)
    INC A
    AND 15              ; Wrap at 16
    LD (HistoryIndex), A
    
    POP AF              ; Restore flags
    RET
```

### Conditional Execution Chains

```text
; Execute different code based on flag combinations
FlagBasedExecution:
    ; Get current flags into A
    PUSH AF
    POP BC              ; B = A, C = F (flags)
    LD A, C             ; A = flag register
    
    ; Test for specific flag combinations
    AND %11000000       ; Check S and Z flags
    CP %10000000        ; S=1, Z=0 (negative, non-zero)
    JP Z, ExecuteNegative
    
    CP %01000000        ; S=0, Z=1 (positive zero - impossible, but check)
    JP Z, ExecuteZero
    
    CP %11000000        ; S=1, Z=1 (negative zero - impossible)
    JP Z, ExecuteImpossible
    
    ; Must be S=0, Z=0 (positive, non-zero)
    JP ExecutePositive

ExecuteNegative:
ExecuteZero:
ExecuteImpossible:
ExecutePositive:
    RET
```

## What You've Learned

In this comprehensive lesson, you've mastered:

- Understanding the complete Z80 flag register and all flag meanings
- Implementing advanced comparison techniques for signed and unsigned values
- Using flag manipulation instructions for precise control flow
- Building complex multi-condition validation systems
- Detecting and handling arithmetic overflow and parity conditions
- Creating optimized conditional structures using flag chaining
- Understanding the dual nature of the P/V flag (parity vs overflow)

## Looking Ahead

Next, you'll learn about **advanced program logic review** - consolidating all your program flow knowledge and building sophisticated control systems that demonstrate mastery of conditional logic, loops, subroutines, and flag-based decision making!

## Fun Fact

The Z80's sophisticated flag system was one of its most advanced features compared to other 8-bit processors of its era. While simpler processors might only have basic carry and zero flags, the Z80's detailed flag information enabled compilers to generate much more efficient code. The parity/overflow flag's dual purpose was particularly clever - using the same hardware to provide parity checking for data integrity and overflow detection for arithmetic. Modern processors still use similar flag systems, though they often have many more flags. The conditional jump instructions you've learned to use with these flags directly inspired the conditional execution features found in many modern processor architectures. Understanding flags at this level gives you insight into how all conditional logic works at the hardware level!