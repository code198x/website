---
title: "Comparison Operations and Status Flags"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 11
description: "Dive deep into the 6502 processor status flags and comparison operations. Learn how the NES makes decisions and implements complex game logic through flag manipulation."
learning_objectives:
  - "Understand all 6502 processor status flags"
  - "Master comparison operations (CMP, CPX, CPY)"
  - "Learn how arithmetic operations affect flags"
  - "Implement complex conditional logic"
  - "Apply flag operations to game scenarios"
concepts:
  - "Processor status register (P)"
  - "Status flags (N, V, Z, C, I, D, B)"
  - "Comparison instructions"
  - "Flag-based decision making"
  - "Conditional game logic"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 11
---

# Lesson 11: Comparison Operations and Status Flags

Welcome to the brain of the 6502! Today you'll learn how the processor "thinks" using status flags - the foundation of all decision-making in NES games.

## The Processor Status Register

The 6502 has a special 8-bit register called the Processor Status Register (P) that contains flags indicating the result of operations. Think of these flags as the processor's way of remembering what just happened.

```
Bit:  7  6  5  4  3  2  1  0
Flag: N  V  -  B  D  I  Z  C
```

Each flag represents a different condition:

### The Eight Status Flags

**N - Negative Flag (Bit 7)**
- Set when the result of an operation is negative (bit 7 = 1)
- Used for signed number comparisons
- Game use: Check if velocity is negative (moving left/up)

**V - Overflow Flag (Bit 6)**  
- Set when signed arithmetic overflows
- Rarely used in typical NES games
- Game use: Detecting when scores wrap around

**Bit 5 - Unused**
- Always set to 1 in the 6502
- No practical use in programming

**B - Break Flag (Bit 4)**
- Set when BRK instruction is executed
- Used for debugging and software interrupts
- Game use: Rarely used in normal gameplay

**D - Decimal Flag (Bit 3)**
- Enables decimal mode (BCD arithmetic)
- Disabled on NES - always 0
- The NES APU actually lacks decimal mode

**I - Interrupt Disable Flag (Bit 2)**
- When set, prevents maskable interrupts
- Critical for NES timing and graphics
- Game use: Protecting critical code sections

**Z - Zero Flag (Bit 1)**
- Set when the result of an operation is zero
- Most commonly used flag in games
- Game use: "Is health zero?", "Is counter finished?"

**C - Carry Flag (Bit 0)**
- Set when arithmetic operations carry/borrow
- Used for multi-byte arithmetic and unsigned comparisons
- Game use: Boundary checking, large number math

## How Flags Are Set

Many instructions automatically set flags based on their results:

```text
LDA #$00    ; Load 0 into A
            ; Z flag is SET (result is zero)
            ; N flag is CLEAR (result is positive)

LDA #$80    ; Load 128 into A  
            ; Z flag is CLEAR (result is not zero)
            ; N flag is SET (bit 7 is 1, looks negative)

LDA #$7F    ; Load 127 into A
            ; Z flag is CLEAR (not zero)
            ; N flag is CLEAR (bit 7 is 0, looks positive)
```

**Flag Setting Examples:**

```assembly
; Watch how different values affect flags
LDA #$00    ; Load 0: Z=1, N=0
LDA #$80    ; Load 128: Z=0, N=1 (bit 7 set)
LDA #$7F    ; Load 127: Z=0, N=0 (bit 7 clear)
LDA #$FF    ; Load 255: Z=0, N=1 (bit 7 set)
```

## The Compare Instructions

The three compare instructions are essential for game logic:

### CMP - Compare with Accumulator
```text
CMP #$50    ; Compare A register with $50
CMP $0200   ; Compare A with memory location $0200
CMP $0300,X ; Compare A with memory at $0300 + X
```

### CPX - Compare with X Register
```text
CPX #$10    ; Compare X register with $10
CPX $0201   ; Compare X with memory location $0201
```

### CPY - Compare with Y Register  
```text
CPY #$20    ; Compare Y register with $20
CPY $0202   ; Compare Y with memory location $0202
```

## How Comparison Works

Compare instructions perform subtraction but don't store the result - they only set flags:

```text
LDA #$50    ; A = $50 (80 decimal)
CMP #$30    ; Compare A with $30 (48 decimal)
            ; Internally: $50 - $30 = $20
            ; Z flag = 0 (result not zero)
            ; C flag = 1 (no borrow needed)
            ; N flag = 0 (result positive)
```

## Flag Results for Comparisons

After CMP A, value:
- **Z = 1**: A equals the value
- **Z = 0**: A does not equal the value
- **C = 1**: A is greater than or equal to the value
- **C = 0**: A is less than the value
- **N = 1**: The result would be negative (A < value)

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Comparison Flag Results"
  code="; Test different comparison scenarios
LDA #$50    ; A = 80

; Test equal values
CMP #$50    ; A = 80, compare with 80
            ; Z=1 (equal), C=1 (A>=80), N=0

; Test A greater than value  
CMP #$30    ; A = 80, compare with 48
            ; Z=0 (not equal), C=1 (A>=48), N=0

; Test A less than value
CMP #$90    ; A = 80, compare with 144  
            ; Z=0 (not equal), C=0 (A<144), N=1"
  language="assembly"
/>

## Game Logic with Comparisons

Let's implement a player boundary checking system:

```text
; Check if player is at screen edges
LDA player_x    ; Load player X position
CMP #$F0        ; Compare with right edge (240)
BCS at_right    ; Branch if player >= 240
CMP #$10        ; Compare with left edge (16)
BCC at_left     ; Branch if player < 16
JMP in_bounds   ; Player is within bounds

at_right:
LDA #$EF        ; Keep player at position 239
STA player_x
JMP done

at_left:
LDA #$10        ; Keep player at position 16
STA player_x
JMP done

in_bounds:
; Player can move freely
done:
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Player Boundary Checking"
  code="; Setup player at right edge
LDA #$F5    ; Player X = 245 (past right edge)
STA $0300   ; Store player position

; Boundary checking
LDA $0300   ; Load player X position
CMP #$F0    ; Right boundary at 240
BCS at_right ; Branch if >= 240
CMP #$10    ; Left boundary at 16  
BCC at_left ; Branch if < 16
JMP done    ; In bounds

at_right:
LDA #$EF    ; Clamp to 239
STA $0300
JMP done

at_left: 
LDA #$10    ; Clamp to 16
STA $0300

done:
; Player is now within screen bounds"
  language="assembly"
/>

## Multi-Condition Logic

You can chain comparisons for complex logic:

```text
; Check player level and unlock features
LDA player_level
CMP #$05        ; Level 5 or higher?
BCC no_special  ; Branch if level < 5
; Player is level 5+, check for level 10
CMP #$0A        ; Level 10 or higher?
BCC mid_level   ; Branch if level 5-9
; Player is level 10+
LDA #$03        ; Unlock all features
JMP done
mid_level:
LDA #$02        ; Unlock some features  
JMP done
no_special:
LDA #$01        ; Basic features only
done:
STA feature_set
```

**Multi-Level Feature Unlock:**

```assembly
; Setup player level
LDA #$07    ; Player is level 7
STA $0310   ; Store level

; Feature unlock logic
LDA $0310   ; Load player level
CMP #$05    ; Level 5 required?
BCC basic   ; Branch if level < 5
CMP #$0A    ; Level 10 for advanced?
BCC medium  ; Branch if level 5-9
; Level 10+ - all features
LDA #$03    ; Feature set 3 (all)
JMP done
medium:
LDA #$02    ; Feature set 2 (some)
JMP done
basic:
LDA #$01    ; Feature set 1 (basic)
done:
STA $0311   ; Store feature set
; Level 7 player gets feature set 2
```

## Flag Manipulation Instructions

You can directly control some flags:

```text
CLC     ; Clear Carry flag (C = 0)
SEC     ; Set Carry flag (C = 1)
CLI     ; Clear Interrupt flag (I = 0)
SEI     ; Set Interrupt flag (I = 1)
CLV     ; Clear Overflow flag (V = 0)
CLD     ; Clear Decimal flag (D = 0) - NES always decimal off
SED     ; Set Decimal flag (D = 1) - No effect on NES
```

## Arithmetic Flag Effects

Addition and subtraction also set flags:

```text
LDA #$FF    ; A = 255
CLC         ; Clear carry
ADC #$01    ; Add 1: 255 + 1 = 256
            ; Result: A = $00 (256 wraps to 0)
            ; C = 1 (carry out)
            ; Z = 1 (result is zero)
```

**Arithmetic Flag Effects:**

```assembly
; Addition with carry
LDA #$FF    ; A = 255
CLC         ; Clear carry flag
ADC #$01    ; Add 1
            ; A = $00 (wraps around)
            ; C = 1 (carried out)
            ; Z = 1 (result is zero)

; This is useful for detecting overflow!
```

## Game Health System with Flags

Let's create a comprehensive health system:

```text
; Health system with multiple states
check_health:
LDA player_health
BEQ dead            ; Branch if health = 0
CMP #$01            ; Health = 1?
BEQ critical        ; Branch if critically low
CMP #$05            ; Health >= 5?
BCS healthy         ; Branch if health >= 5
; Health is 2-4 (wounded)
LDA #$02            ; Wounded state
JMP store_state
critical:
LDA #$01            ; Critical state
JMP store_state
healthy:
LDA #$03            ; Healthy state
JMP store_state
dead:
LDA #$00            ; Dead state
store_state:
STA health_state
```

**Advanced Health System:**

```assembly
; Setup player health
LDA #$03    ; Player has 3 health
STA $0320   ; Store health

; Health state determination
LDA $0320   ; Load current health
BEQ dead    ; 0 health = dead
CMP #$01    ; Exactly 1 health?
BEQ critical ; Critical condition
CMP #$05    ; 5 or more health?
BCS healthy ; Healthy condition
; Otherwise wounded (2-4 health)
LDA #$02    ; Wounded state code
JMP done
critical:
LDA #$01    ; Critical state code
JMP done
healthy:
LDA #$03    ; Healthy state code
JMP done
dead:
LDA #$00    ; Dead state code
done:
STA $0321   ; Store health state
; Health 3 = wounded state (code 2)
```

## Sprite Symphony Note Comparison

Let's use comparisons for our musical project:

```text
; Play different notes based on input
check_note:
LDA note_input      ; Load requested note
CMP #$00            ; C note?
BEQ play_c
CMP #$02            ; E note?
BEQ play_e  
CMP #$04            ; G note?
BEQ play_g
CMP #$07            ; B note?
BEQ play_b
JMP silence         ; Unknown note

play_c:
LDA #$FE            ; C frequency low
STA $4002
LDA #$01            ; C frequency high
STA $4003
JMP done
play_e:
LDA #$CA            ; E frequency low
STA $4002
LDA #$01            ; E frequency high
STA $4003
JMP done
play_g:
LDA #$A2            ; G frequency low
STA $4002
LDA #$01            ; G frequency high  
STA $4003
JMP done
play_b:
LDA #$82            ; B frequency low
STA $4002
LDA #$01            ; B frequency high
STA $4003
JMP done
silence:
LDA #$00            ; Silence
STA $4000
done:
```

**Sprite Symphony Note Selection:**

```assembly
; Setup APU
LDA #$BF    ; Configure pulse wave
STA $4000   ; Pulse 1 control
LDA #$08    ; Enable pulse 1
STA $4015   ; APU enable

; Note selection (0=C, 2=E, 4=G, 7=B)
LDA #$04    ; Select G note
STA $0330   ; Store input

; Play the note
LDA $0330   ; Load note input
CMP #$00    ; C note (0)?
BEQ play_c
CMP #$02    ; E note (2)?
BEQ play_e
CMP #$04    ; G note (4)?
BEQ play_g
CMP #$07    ; B note (7)?
BEQ play_b
JMP done    ; Unknown note

play_c:
LDA #$FE    ; C frequency
STA $4002
JMP done
play_e:
LDA #$CA    ; E frequency
STA $4002
JMP done
play_g:
LDA #$A2    ; G frequency
STA $4002
JMP done
play_b:
LDA #$82    ; B frequency
STA $4002
done:
; G note is now playing!
```

## Practical Exercise: Score Ranking System

Create a score ranking system that awards different rankings based on score ranges:

1. Load a score value (use $1000 = 4096 points)
2. Compare against thresholds:
   - 0-999: Beginner (rank 1)
   - 1000-2999: Intermediate (rank 2)  
   - 3000-4999: Advanced (rank 3)
   - 5000+: Expert (rank 4)
3. Store the rank at memory location $0400

**Practice: Score Ranking System:**

```assembly
; Setup score (4096 points)
LDA #$00    ; High byte of 4096 ($1000)
STA $0350   ; Store score high byte
LDA #$10    ; Low byte of 4096
STA $0351   ; Store score low byte

; For this exercise, we'll use just the high byte
; to simplify the comparison
LDA $0350   ; Load score high byte
CMP #$00    ; Less than 256?
BEQ beginner ; 0-255 = Beginner
CMP #$04    ; Less than 1024?
BCC intermediate ; 256-1023 = Intermediate
CMP #$14    ; Less than 5120?
BCC advanced ; 1024-5119 = Advanced  
; 5120+ = Expert
LDA #$04    ; Expert rank
JMP done
beginner:
LDA #$01    ; Beginner rank
JMP done
intermediate:
LDA #$02    ; Intermediate rank
JMP done
advanced:
LDA #$03    ; Advanced rank
done:
STA $0400   ; Store final rank
; Score 4096 gets Advanced rank (3)
```

## Common Flag Patterns

Here are patterns you'll use frequently:

**Range checking**:
```text
CMP #$10    ; Minimum value
BCC too_low
CMP #$F0    ; Maximum value  
BCS too_high
; Value is in range
```

**Equality chain**:
```text
CMP #$01
BEQ case_1
CMP #$02
BEQ case_2
CMP #$03
BEQ case_3
; Default case
```

**Signed comparisons**:
```text
CMP #$80    ; Compare with -128 (signed)
BMI negative ; Branch if N flag set
BPL positive ; Branch if N flag clear
```

## What You've Learned

In this fundamental lesson, you've mastered:

- All eight 6502 processor status flags and their meanings
- How compare instructions (CMP, CPX, CPY) set flags
- Flag-based conditional logic for complex game systems
- Multi-condition decision trees
- Arithmetic operations and their flag effects
- Practical game applications like health systems and score ranking

## Looking Ahead

Next lesson, you'll learn about the stack and subroutines - how to organize your code into reusable functions and manage complex program flow. This will let you create modular, maintainable game code!

## Fun Fact

The 6502's status flags were carefully designed to make both signed and unsigned arithmetic easy. The same CMP instruction can be used for both - you just need to use different branch instructions afterward! For unsigned: BCC (less), BCS (greater/equal). For signed: BMI (less), BPL (greater/equal). This elegant design made the 6502 incredibly versatile for game programming, where you might need to compare both positive coordinates (unsigned) and velocity values (signed) in the same program.