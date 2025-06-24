---
title: "Branch Instructions and Control Flow"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 10
description: "Master branch instructions to control program flow in NES games. Learn conditional jumps, loops, and decision-making that form the backbone of interactive gameplay."
learning_objectives:
  - "Understand how branch instructions work in 6502 assembly"
  - "Learn conditional branching based on processor flags"
  - "Create simple loops and decision structures"
  - "Apply branching to game logic scenarios"
  - "Build your first interactive program flow"
concepts:
  - "Branch instructions (BEQ, BNE, BCC, BCS, etc.)"
  - "Conditional program flow"
  - "Loop structures"
  - "Game logic implementation"
  - "Relative addressing for branches"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 10
---

# Lesson 10: Branch Instructions and Control Flow

Welcome to the world of program control! Today you'll learn how to make your NES programs make decisions and create loops - the foundation of all interactive game behavior.

## What Are Branch Instructions?

Branch instructions allow your program to "jump" to different parts of code based on conditions. This is how games make decisions like:
- "If the player presses A, make Mario jump"
- "If health reaches 0, end the game"
- "Keep playing music until the song ends"

Without branching, programs could only run in a straight line - no interaction, no decisions, no games!

## The 6502 Branch Instructions

The 6502 has eight branch instructions, each checking a different condition:

### Flag-Based Branches
```text
BEQ  ; Branch if Equal (Z flag set)
BNE  ; Branch if Not Equal (Z flag clear)
BCC  ; Branch if Carry Clear (C flag clear)
BCS  ; Branch if Carry Set (C flag set)
BMI  ; Branch if Minus (N flag set)
BPL  ; Branch if Plus (N flag clear)
BVC  ; Branch if Overflow Clear (V flag clear)
BVS  ; Branch if Overflow Set (V flag set)
```

Don't worry about memorizing all of these - we'll focus on the most common ones for games!

## Your First Branch

Let's start with a simple example - branch if a value equals zero:

```text
LDA #$00    ; Load 0 into A
BEQ zero    ; Branch if A equals zero (it does!)
LDA #$FF    ; This won't execute
zero:
LDA #$01    ; This will execute
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Simple Branch Example"
  code="LDA #$00    ; Load 0
BEQ zero    ; Branch to 'zero' label  
LDA #$FF    ; Skipped!
zero:
LDA #$01    ; A now contains $01"
  language="assembly"
/>

## How Branching Works

When you execute a branch instruction:
1. The 6502 checks the specified flag
2. If the condition is true, it jumps to the target label
3. If false, it continues to the next instruction

The key insight: **Branches use flags set by previous instructions!**

## Game Logic with Branches

Let's create a simple health system:

```text
; Check player health
LDA $0200   ; Load health from memory
BEQ dead    ; Branch if health is 0
; Health > 0, continue playing
LDA #$01    ; Set "alive" status
JMP done    ; Jump over the dead code
dead:
LDA #$00    ; Set "dead" status  
done:
STA $0201   ; Store status
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Game Health System"
  code="; Setup: Player has 0 health
LDA #$00    ; Simulate 0 health
STA $0200   ; Store in health location

; Check health status
LDA $0200   ; Load current health
BEQ dead    ; Branch if health is 0
; Player is alive
LDA #$01    ; Alive status = 1
JMP done    ; Skip dead code
dead:
LDA #$00    ; Dead status = 0
done:
STA $0201   ; Store game status"
  language="assembly"
/>

## Comparison and Branching

To make comparisons, we use the CMP (Compare) instruction:

```text
CMP value   ; Compare A register with value
            ; Sets flags based on the result
```

After CMP, you can use:
- **BEQ**: Branch if A equals the compared value
- **BNE**: Branch if A does not equal the compared value
- **BCC**: Branch if A is less than the compared value
- **BCS**: Branch if A is greater than or equal to the compared value

## Level Selection Example

Let's create a level selection system:

```text
; Player selects level (1, 2, or 3)
LDA #$02    ; Player selected level 2
CMP #$01    ; Compare with level 1
BEQ level1  ; Branch if level 1 selected
CMP #$02    ; Compare with level 2  
BEQ level2  ; Branch if level 2 selected
CMP #$03    ; Compare with level 3
BEQ level3  ; Branch if level 3 selected
JMP error   ; Invalid level selected

level1:
LDA #$10    ; Level 1 starting position
JMP start_game
level2:
LDA #$20    ; Level 2 starting position
JMP start_game
level3:
LDA #$30    ; Level 3 starting position
JMP start_game
error:
LDA #$FF    ; Error code
start_game:
STA $0300   ; Store starting position
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Level Selection System"
  code="; Level selection system
LDA #$02    ; Player selects level 2
CMP #$01    ; Is it level 1?
BEQ level1
CMP #$02    ; Is it level 2?
BEQ level2  
CMP #$03    ; Is it level 3?
BEQ level3
JMP error   ; Invalid selection

level1:
LDA #$10    ; Level 1 data
JMP done
level2:
LDA #$20    ; Level 2 data  
JMP done
level3:
LDA #$30    ; Level 3 data
JMP done
error:
LDA #$FF    ; Error value
done:
STA $0300   ; Store result"
  language="assembly"
/>

## Creating Loops

Loops are essential for games - they make things repeat! Here's a simple counting loop:

```text
LDX #$00    ; Counter starts at 0
loop:
TXA         ; Transfer X to A
STA $0400,X ; Store A at memory location $0400 + X
INX         ; Increment X
CPX #$10    ; Compare X with 16
BNE loop    ; Branch back if X ≠ 16
```

This loop fills memory locations $0400-$040F with values 0-15.

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Memory Fill Loop"
  code="; Fill memory with counting values
LDX #$00    ; Start counter at 0
loop:
TXA         ; Copy X to A
STA $0400,X ; Store at $0400 + X offset
INX         ; Increment counter
CPX #$08    ; Compare with 8 (smaller loop)
BNE loop    ; Continue if not equal
; Memory $0400-$0407 now contains 0,1,2,3,4,5,6,7"
  language="assembly"
/>

## Sound Generation Loop

Let's create a loop that generates multiple tones:

```text
; Generate 4 different tones
LDX #$00    ; Tone counter
sound_loop:
TXA         ; Get current tone number
ASL A       ; Multiply by 2 (shift left)
ASL A       ; Multiply by 4 total
CLC         ; Clear carry
ADC #$80    ; Add base frequency
STA $4002   ; Store to pulse wave 1 frequency low
LDA #$01    ; High frequency byte
STA $4003   ; Store to pulse wave 1 frequency high
INX         ; Next tone
CPX #$04    ; 4 tones total?
BNE sound_loop ; Continue if more tones
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Multi-Tone Sound Loop"
  code="; Setup APU for sound
LDA #$BF    ; Enable pulse wave 1
STA $4000   ; Pulse 1 control

; Generate 4 tones with different frequencies
LDX #$00    ; Tone counter  
sound_loop:
TXA         ; Get tone number
ASL A       ; Multiply by 2
ASL A       ; Multiply by 4 total  
CLC         ; Clear carry flag
ADC #$80    ; Add base frequency $80
STA $4002   ; Pulse 1 frequency low
LDA #$01    ; High frequency byte
STA $4003   ; Pulse 1 frequency high
INX         ; Next tone
CPX #$04    ; Generated 4 tones?
BNE sound_loop ; Loop if more to do"
  language="assembly"
/>

## Game Input Checking

Here's how you might check for controller input:

```text
; Read controller input
LDA $4016   ; Read controller port 1
AND #$01    ; Check if A button pressed
BEQ no_jump ; Branch if A button not pressed
; A button is pressed - make player jump!
LDA #$F0    ; Upward velocity
STA $0210   ; Store player Y velocity
JMP input_done
no_jump:
LDA #$00    ; No jump velocity
STA $0210   ; Store zero velocity
input_done:
; Continue with game logic
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Controller Input Check"
  code="; Simulate controller input
LDA #$01    ; Simulate A button pressed
AND #$01    ; Check A button bit
BEQ no_jump ; Branch if not pressed
; A button pressed - jump!
LDA #$F0    ; Jump velocity (upward)
STA $0210   ; Store velocity
JMP done
no_jump:
LDA #$00    ; No jump
STA $0210   ; Zero velocity
done:
; Player velocity is now set based on input"
  language="assembly"
/>

## Branch Range Limitations

Important: 6502 branches can only jump -128 to +127 bytes from the current position. For longer jumps, use JMP (unconditional jump):

```text
; Short branch (within range)
BEQ nearby_label

; Long jump (any distance)
BNE skip_long_jump
JMP far_away_label
skip_long_jump:
```

## Practical Exercise: Player Lives System

Create a complete player lives system:

1. Start with 3 lives in memory location $0250
2. Simulate losing a life (subtract 1)
3. Check if lives are 0
4. If 0 lives: set game over flag ($01) at $0251
5. If lives remain: set continue flag ($00) at $0251

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Player Lives System"
  code="; Initialize player lives
LDA #$03    ; Start with 3 lives
STA $0250   ; Store at lives location

; Simulate losing a life
DEC $0250   ; Decrease lives by 1

; Check remaining lives
LDA $0250   ; Load current lives
BEQ game_over ; Branch if 0 lives
; Lives remain
LDA #$00    ; Continue game flag
STA $0251   ; Store continue status
JMP done
game_over:
LDA #$01    ; Game over flag  
STA $0251   ; Store game over status
done:
; Check $0251: $00 = continue, $01 = game over"
  language="assembly"
/>

## Building Sprite Symphony Logic

Let's apply branching to our Sprite Symphony project:

```text
; Check which note to play
LDA $0280   ; Load current note number
CMP #$00    ; Is it note 0 (C)?
BEQ play_c
CMP #$01    ; Is it note 1 (D)?
BEQ play_d
CMP #$02    ; Is it note 2 (E)?
BEQ play_e
JMP silence ; Unknown note - play nothing

play_c:
LDA #$FE    ; C note frequency low
STA $4002   ; Pulse 1 frequency
JMP done
play_d:
LDA #$E2    ; D note frequency low
STA $4002
JMP done
play_e:
LDA #$CA    ; E note frequency low
STA $4002
done:
; Note is now playing!
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Sprite Symphony Note Selection"
  code="; Setup sound
LDA #$BF    ; Configure pulse wave
STA $4000

; Note selection (0=C, 1=D, 2=E)
LDA #$01    ; Select note 1 (D)
STA $0280   ; Store current note

; Play the selected note
LDA $0280   ; Load note number
CMP #$00    ; C note?
BEQ play_c
CMP #$01    ; D note?
BEQ play_d  
CMP #$02    ; E note?
BEQ play_e
JMP done    ; Unknown note

play_c:
LDA #$FE    ; C frequency
STA $4002
JMP done
play_d:
LDA #$E2    ; D frequency
STA $4002
JMP done
play_e:
LDA #$CA    ; E frequency
STA $4002
done:
; Note D is now playing!"
  language="assembly"
/>

## Common Game Patterns

Here are branching patterns you'll use constantly:

**State machines**:
```text
LDA game_state
CMP #$00    ; Menu state?
BEQ menu_logic
CMP #$01    ; Playing state?
BEQ game_logic
CMP #$02    ; Game over state?
BEQ gameover_logic
```

**Boundary checking**:
```text
LDA player_x
CMP #$F0    ; At right edge?
BCS stop_right ; Stop if at or past edge
```

**Animation frames**:
```text
LDA frame_counter
CMP #$10    ; Time for next frame?
BNE keep_frame
LDA #$00    ; Reset counter
STA frame_counter
INC sprite_frame ; Next animation frame
```

## What You've Learned

In this crucial lesson, you've mastered:

- Branch instructions for conditional program flow
- Using CMP to compare values and set flags
- Creating loops with counters and conditional branches
- Implementing game logic like health systems and input checking
- The foundation for interactive program behavior
- Building blocks for complex game systems

## Looking Ahead

Next lesson, you'll learn about comparison operations in detail and how the processor status flags work. You'll discover how to make more sophisticated decisions and create complex game logic that responds to multiple conditions.

## Fun Fact

The 6502's branch instructions use "relative addressing" - they specify how many bytes to jump forward or backward from the current position, not an absolute memory address. This makes 6502 code "relocatable" - you can move it to different memory locations and it still works! This was crucial for NES cartridges, where game code might be loaded at different addresses depending on the cartridge's memory mapper.