---
title: "Conditional Jumps and Branching"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 17
description: "Learn how to make your programs make decisions using conditional jumps. Master the Z80's status flags and branching instructions for dynamic program flow."
learning_objectives:
  - "Understand how status flags control program flow"
  - "Master conditional jump instructions (JR, JP)"
  - "Learn to create decision-making structures"
  - "Practice building conditional logic systems"
  - "Understand flag setting and testing operations"
concepts:
  - "Status flags (Zero, Carry, Sign, Parity/Overflow)"
  - "Conditional jump instructions"
  - "Relative vs absolute jumps"
  - "Flag testing operations"
  - "Decision trees and branching logic"
estimated_duration: "45-55 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 17
---

# Lesson 17: Conditional Jumps and Branching

Until now, your programs have executed instructions in sequence. Real programs need to make decisions - jumping to different code based on conditions. The Z80's conditional jump system, built around status flags, gives you powerful tools for creating dynamic, responsive programs.

## Understanding Status Flags

### The Z80 Flag Register

The Z80 maintains a special 8-bit flag register that tracks the results of operations:

```
Flag Register (F):
Bit 7: S (Sign flag) - Set if result is negative
Bit 6: Z (Zero flag) - Set if result is zero  
Bit 4: H (Half-carry) - For BCD arithmetic
Bit 2: P/V (Parity/Overflow) - Set based on operation
Bit 1: N (Add/Subtract) - Indicates last operation type
Bit 0: C (Carry flag) - Set if operation generates carry
```

These flags are automatically set by most arithmetic and logical operations.

### How Flags Get Set

```text
LD A, 5
SUB 5           ; A = 0, Zero flag SET
ADD A, 1        ; A = 1, Zero flag CLEAR

LD A, 255
ADD A, 1        ; A = 0, Carry flag SET (overflow)

LD A, 10
CP 15           ; Compare: A < 15, Carry flag SET
```

**Flag Setting Examples:**

```assembly
; Demonstrate how different operations set flags
LD A, 10
SUB 5           ; A = 5, Zero flag clear (result not zero)

LD A, 8  
SUB 8           ; A = 0, Zero flag set (result is zero)

LD A, 3
CP 5            ; Compare A with 5: A < 5, so Carry flag set

LD A, 7
CP 5            ; Compare A with 5: A > 5, so Carry flag clear

LD A, 200
ADD A, 100      ; A = 44 (300-256), Carry flag set (overflow)

; These flag settings will be used by conditional jumps
; to make decisions about program flow
```

## Basic Conditional Jumps

### JR - Relative Jump Instructions

Relative jumps move forward or backward by a small distance (-128 to +127 bytes):

```text
; Conditional relative jumps
JR Z, label     ; Jump if Zero flag is set
JR NZ, label    ; Jump if Zero flag is clear
JR C, label     ; Jump if Carry flag is set  
JR NC, label    ; Jump if Carry flag is clear
```

### Simple Decision Making

```text
; Check if A register contains zero
LD A, 5
OR A            ; Set flags based on A (doesn't change A)
JR Z, IsZero    ; Jump if A was zero
; A is not zero - continue here
LD B, 1
JR Continue

IsZero:
; A was zero - handle this case
LD B, 0

Continue:
; Program continues here regardless of path
```

**Basic Conditional Jumps:**

```assembly
; Simple conditional jump example
LD A, 0         ; Test value (try changing this)
OR A            ; Set flags based on A value
JR Z, ZeroCase  ; Jump if A is zero

; Non-zero case
LD B, 99        ; Store 99 in B
JR Done         ; Skip zero case

ZeroCase:
LD B, 0         ; Store 0 in B

Done:
; B now contains either 0 or 99 based on A's value

; Another example: compare two values
LD A, 7
LD C, 5
CP C            ; Compare A with C
JR C, ALess     ; Jump if A < C
JR Z, AEqual    ; Jump if A = C

; A > C case
LD D, 1         ; A is greater
JR Compare_Done

ALess:
LD D, 2         ; A is less
JR Compare_Done

AEqual:  
LD D, 3         ; A equals C

Compare_Done:
; D contains: 1 if A>C, 2 if A<C, 3 if A=C
```

## JP - Absolute Jump Instructions

### Long-Distance Jumps

For jumps beyond the range of JR, use JP (jump absolute):

```text
; Conditional absolute jumps
JP Z, FarAwayLabel      ; Jump if Zero flag set
JP NZ, AnotherLabel     ; Jump if Zero flag clear
JP C, CarrySet          ; Jump if Carry flag set
JP NC, NoCarry          ; Jump if Carry flag clear
JP M, Negative          ; Jump if Sign flag set (negative)
JP P, Positive          ; Jump if Sign flag clear (positive)
```

### When to Use JR vs JP

**Use JR when:**
- Jump target is close (within 127 bytes)
- Code is position-independent
- Saving memory (JR is 2 bytes, JP is 3 bytes)

**Use JP when:**
- Jump target is far away
- Jumping to fixed addresses
- Need all conditional options (JR only has Z, NZ, C, NC)

## Complex Conditional Logic

### Multiple Conditions

```text
; Check if A is between 10 and 20 (inclusive)
CheckRange:
    LD A, 15        ; Test value
    CP 10           ; Compare with 10
    JR C, TooSmall  ; Jump if A < 10
    
    CP 21           ; Compare with 21
    JR NC, TooBig   ; Jump if A >= 21
    
    ; A is in range 10-20
    LD B, 1         ; In range
    JR RangeCheck_Done
    
TooSmall:
    LD B, 0         ; Below range
    JR RangeCheck_Done
    
TooBig:
    LD B, 2         ; Above range
    
RangeCheck_Done:
    ; B contains: 0=too small, 1=in range, 2=too big
```

**Complex Conditional Logic:**

```assembly
; Multi-way branching example: game collision detection
; Check player position against boundaries

; Player position
LD A, 15        ; Player X coordinate (try different values)

; Check left boundary
CP 5            ; Is player X < 5?
JR C, HitLeft   ; Jump if too far left

; Check right boundary  
CP 200          ; Is player X >= 200?
JR NC, HitRight ; Jump if too far right

; Player is within horizontal bounds
LD B, 0         ; No collision
JR CheckVertical

HitLeft:
LD B, 1         ; Left wall collision
JR CollisionDone

HitRight:
LD B, 2         ; Right wall collision
JR CollisionDone

CheckVertical:
; Now check Y coordinate
LD A, 100       ; Player Y coordinate

; Check top boundary
CP 10           ; Is player Y < 10?
JR C, HitTop    ; Jump if too high

; Check bottom boundary
CP 180          ; Is player Y >= 180?
JR NC, HitBottom ; Jump if too low

; No collision at all
LD B, 0         ; No collision
JR CollisionDone

HitTop:
LD B, 3         ; Top wall collision
JR CollisionDone

HitBottom:
LD B, 4         ; Bottom wall collision

CollisionDone:
; B contains collision type: 0=none, 1=left, 2=right, 3=top, 4=bottom
```

## Flag Testing Without Jumps

### Setting Flags for Testing

```text
; Operations that set flags without changing values
OR A            ; Test if A is zero (sets Z flag)
BIT 7, A        ; Test if bit 7 of A is set (sets Z flag based on bit)
CP B            ; Compare A with B (sets flags, doesn't change A or B)
AND %00000000   ; Force zero result (sets Z flag)
```

### Decision Tables Using Flags

```text
; Use flags to select from multiple options
DecisionTable:
    LD A, 5         ; Input value
    CP 3            ; Compare with 3
    JR C, Option1   ; If A < 3
    JR Z, Option2   ; If A = 3
    
    CP 7            ; Compare with 7
    JR C, Option3   ; If 3 < A < 7
    JR Z, Option4   ; If A = 7
    
    ; A > 7
    JR Option5
    
Option1: LD B, 1 : JR TableDone
Option2: LD B, 2 : JR TableDone  
Option3: LD B, 3 : JR TableDone
Option4: LD B, 4 : JR TableDone
Option5: LD B, 5

TableDone:
    ; B contains selected option number
```

## Practical Branching Patterns

### Input Validation

```text
; Validate user input (0-9 for menu selection)
ValidateInput:
    ; A contains user input
    CP '0'          ; Compare with ASCII '0'
    JR C, InvalidInput ; Jump if less than '0'
    
    CP '9' + 1      ; Compare with ASCII '9' + 1
    JR NC, InvalidInput ; Jump if greater than '9'
    
    ; Valid input - convert to number
    SUB '0'         ; Convert ASCII to number
    LD B, A         ; Store valid input
    LD A, 1         ; Return success
    RET
    
InvalidInput:
    LD A, 0         ; Return failure
    RET
```

### Game State Transitions

```text
; Game state machine using conditional jumps
GameState: DB 0     ; 0=menu, 1=playing, 2=paused, 3=game_over

UpdateGame:
    LD A, (GameState)
    OR A
    JR Z, HandleMenu    ; State 0: Menu
    
    DEC A
    JR Z, HandlePlaying ; State 1: Playing
    
    DEC A  
    JR Z, HandlePaused  ; State 2: Paused
    
    ; Must be state 3: Game Over
    JR HandleGameOver

HandleMenu:
    ; Menu handling code
    RET
    
HandlePlaying:
    ; Game logic code
    RET
    
HandlePaused:
    ; Pause handling code
    RET
    
HandleGameOver:
    ; Game over handling code
    RET
```

**Game State Machine:**

```assembly
; Simple game state machine
GameState: DB 1    ; Current state: 0=menu, 1=game, 2=pause

; State transition based on input
ProcessGameState:
    LD A, (GameState)
    OR A
    JR Z, MenuState     ; Jump if state = 0
    
    DEC A
    JR Z, GameState_    ; Jump if state = 1
    
    ; Must be pause state (2)
    JR PauseState

MenuState:
    ; In menu - check for start game input
    ; (Simplified: just advance to game state)
    LD A, 1
    LD (GameState), A
    LD B, 100           ; Menu result code
    RET

GameState_:
    ; In game - check for pause input
    ; (Simplified: advance to pause state)
    LD A, 2
    LD (GameState), A
    LD B, 200           ; Game result code  
    RET

PauseState:
    ; In pause - check for resume input
    ; (Simplified: return to menu)
    LD A, 0
    LD (GameState), A
    LD B, 300           ; Pause result code
    RET

; Call ProcessGameState repeatedly to cycle through states
; B will contain different values based on current state
```

## Advanced Flag Operations

### Testing Multiple Conditions

```text
; Complex condition: check if A is even AND greater than 10
CheckComplexCondition:
    LD A, 12        ; Test value
    
    ; First check: is A > 10?
    CP 11           ; Compare with 11
    JR C, ConditionFalse ; Jump if A <= 10
    
    ; Second check: is A even?
    AND %00000001   ; Check low bit (odd numbers have bit 0 set)
    JR NZ, ConditionFalse ; Jump if odd
    
    ; Both conditions true
    LD B, 1         ; True result
    RET
    
ConditionFalse:
    LD B, 0         ; False result
    RET
```

### Using Carry Flag for Unsigned Comparisons

```text
; Unsigned comparison: check if A >= B
UnsignedCompare:
    ; CP instruction sets Carry if A < B (unsigned)
    LD A, 150       ; First value
    LD B, 100       ; Second value
    CP B            ; Compare A with B
    JR C, A_Less    ; Jump if A < B
    
    ; A >= B
    LD C, 1         ; A is greater or equal
    RET
    
A_Less:
    LD C, 0         ; A is less
    RET
```

## Branching Best Practices

### Minimizing Jump Distance

```text
; GOOD: Use JR for short jumps (saves memory and cycles)
LD A, 5
OR A
JR Z, NearLabel     ; 2 bytes
; other code
NearLabel:

; GOOD: Use JP for distant jumps or when you need all conditions
LD A, 10
CP 5
JP M, VeryFarLabel  ; 3 bytes, but necessary for distant target

; AVOID: Using JP when JR would work
LD A, 3
OR A
JP Z, CloseLabel    ; Wastes 1 byte compared to JR Z, CloseLabel
```

### Clear Logic Flow

```text
; GOOD: Clear, easy to follow
CheckPlayerHealth:
    LD A, (PlayerHealth)
    OR A
    JR Z, PlayerDead
    
    CP 25
    JR C, PlayerLowHealth
    
    ; Player has good health
    RET
    
PlayerLowHealth:
    ; Handle low health
    RET
    
PlayerDead:
    ; Handle death
    RET
```

## Practice Exercise

Create a comprehensive decision-making system that:

1. Reads a value representing player input (0-9)
2. Uses conditional jumps to validate the input
3. Implements a menu system with multiple options
4. Includes error handling for invalid inputs
5. Demonstrates complex conditional logic

**Practice Exercise - Menu System:**

```assembly
; Complete menu system with conditional logic
PlayerChoice: DB 5  ; Simulated player input (0-9)

; Main menu processor
ProcessMenu:
    LD A, (PlayerChoice)
    
    ; Validate input range (0-4 for our menu)
    CP 5            ; Compare with 5
    JR NC, InvalidChoice ; Jump if >= 5
    
    ; Valid choice - use jump table approach
    OR A
    JR Z, MenuOption0    ; Choice 0
    
    DEC A
    JR Z, MenuOption1    ; Choice 1
    
    DEC A
    JR Z, MenuOption2    ; Choice 2
    
    DEC A
    JR Z, MenuOption3    ; Choice 3
    
    ; Must be choice 4
    JR MenuOption4

MenuOption0:
    ; Start Game
    LD B, 10        ; Return code for start game
    RET

MenuOption1:
    ; Load Game
    LD B, 20        ; Return code for load game
    RET

MenuOption2:
    ; Options
    LD B, 30        ; Return code for options
    RET

MenuOption3:
    ; High Scores
    LD B, 40        ; Return code for high scores
    RET

MenuOption4:
    ; Exit
    LD B, 50        ; Return code for exit
    RET

InvalidChoice:
    ; Handle invalid input
    LD B, 255       ; Error code
    RET

; Extended validation example
ValidateAndProcess:
    LD A, (PlayerChoice)
    
    ; Check if choice is a digit (ASCII '0' to '9')
    CP 48           ; ASCII '0'
    JR C, NotDigit  ; Jump if less than '0'
    
    CP 58           ; ASCII '9' + 1
    JR NC, NotDigit ; Jump if greater than '9'
    
    ; Convert ASCII to number
    SUB 48          ; Convert to 0-9
    
    ; Now validate range for our menu (0-4)
    CP 5
    JR NC, OutOfRange
    
    ; Valid menu choice
    LD (PlayerChoice), A  ; Store converted value
    CALL ProcessMenu      ; Process the choice
    RET

NotDigit:
    LD B, 254       ; Error: not a digit
    RET

OutOfRange:
    LD B, 253       ; Error: out of range
    RET

; This system demonstrates:
; - Input validation with multiple checks
; - Range checking with conditional jumps
; - Menu processing with decision trees
; - Error handling with different return codes
```

## What You've Learned

In this fundamental lesson, you've mastered:

- How Z80 status flags (Zero, Carry, Sign, Parity/Overflow) control program flow
- The difference between relative (JR) and absolute (JP) conditional jumps
- Creating decision-making structures with conditional branches
- Building complex conditional logic with multiple tests
- Implementing practical patterns like input validation and state machines
- Understanding flag-setting operations and their use in branching
- Best practices for efficient and readable branching code

## Looking Ahead

Next, you'll learn about **loops and iteration** - using conditional jumps to create repeating structures that can process arrays, animate graphics, and handle repetitive tasks efficiently!

## Fun Fact

The Z80's conditional jump system was remarkably sophisticated for an 8-bit processor. While simpler processors might only have basic jump instructions, the Z80 provided a rich set of conditional jumps that could test various combinations of flags. This flexibility made it much easier to write efficient compilers and complex programs. Many programming language constructs we use today - if statements, while loops, switch statements - map directly to the conditional jump patterns you've just learned. The Z80's branch prediction (always assuming jumps won't be taken) was simple but effective, and understanding these patterns helps explain how modern processors handle branching at a much more complex level!