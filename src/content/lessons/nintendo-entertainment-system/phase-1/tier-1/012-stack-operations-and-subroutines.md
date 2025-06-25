---
title: "Stack Operations and Subroutines"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 12
description: "Master the 6502 stack and subroutines to organize your NES game code. Learn how to create reusable functions, manage memory efficiently, and build modular game systems."
learning_objectives:
  - "Understand the 6502 stack and stack pointer"
  - "Learn stack operations (PHA, PLA, PHP, PLP)"
  - "Master subroutines with JSR and RTS"
  - "Create reusable game functions"
  - "Manage complex program organization"
concepts:
  - "Stack memory ($0100-$01FF)"
  - "Stack pointer register (SP)"
  - "Push and pull operations"
  - "Subroutine calls and returns"
  - "Modular programming"
estimated_duration: "50-65 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 12
---

# Lesson 12: Stack Operations and Subroutines

Welcome to organized programming! Today you'll learn how to use the stack and subroutines to create clean, reusable code - essential skills for building complex NES games.

## What Is the Stack?

The stack is a special area of memory ($0100-$01FF) that works like a stack of plates - you can only add or remove items from the top. The 6502 uses this for:

- Temporary storage of register values
- Subroutine return addresses  
- Interrupt handling
- Saving processor status

Think of it as the processor's "scratch paper" for keeping track of what it's doing.

## The Stack Pointer (SP)

The Stack Pointer (SP) is a special 8-bit register that points to the current top of the stack. Important facts:

- SP starts at $FF on power-up (stack at $01FF)
- Stack grows downward (SP decreases as items are added)
- Stack memory is $0100 + SP
- SP wraps around ($00 to $FF if it overflows)

```
Stack Memory Layout:
$01FF ← Initial stack top (SP = $FF)
$01FE
$01FD ← Items pushed here first
...
$0100 ← Stack bottom (SP = $00)
```

## Stack Operations

### Push Operations (Store to Stack)

**PHA - Push Accumulator**
```text
PHA     ; Push A register to stack
        ; SP decreases by 1
```

**PHP - Push Processor Status**
```text
PHP     ; Push status flags to stack  
        ; SP decreases by 1
```

### Pull Operations (Load from Stack)

**PLA - Pull Accumulator**
```text
PLA     ; Pull from stack to A register
        ; SP increases by 1
        ; Sets N and Z flags based on value
```

**PLP - Pull Processor Status**
```text
PLP     ; Pull from stack to status register
        ; SP increases by 1
        ; Restores all flags
```

**Basic Stack Operations:**

```assembly
; Push values onto stack
LDA #$42    ; Load $42 into A
PHA         ; Push A to stack (A=$42 stored)
LDA #$7F    ; Load $7F into A  
PHA         ; Push A to stack (A=$7F stored)

; Pull values from stack (LIFO - Last In, First Out)
PLA         ; Pull to A (A=$7F restored)
PLA         ; Pull to A (A=$42 restored)
; Stack is now back to original state
```

## Why Use the Stack?

The stack is perfect for:

**Temporary storage**:
```text
LDA score       ; Get current score
PHA             ; Save it on stack
; ... do other work that changes A ...
PLA             ; Restore original score
STA score       ; Store it back
```

**Preserving registers across operations**:
```text
; Need to use A, but don't want to lose current value
PHA             ; Save current A
LDA #$20        ; Do some work
STA $2006
PLA             ; Restore original A
```

## Game Example: Preserving Registers

Here's a common game pattern - updating graphics without losing game data:

```text
; Update sprite position while preserving score calculation
LDA score_lo    ; Low byte of score
PHA             ; Save it
LDA score_hi    ; High byte of score  
PHA             ; Save it

; Update sprite (this changes A register)
LDA #$50        ; Sprite X position
STA $0203       ; Store to sprite data
LDA #$60        ; Sprite Y position
STA $0200       ; Store to sprite data

; Restore score data
PLA             ; Restore score high byte
STA score_hi
PLA             ; Restore score low byte  
STA score_lo
```

**Preserving Game Data:**

```assembly
; Setup game score
LDA #$34    ; Score low byte = $34
STA $0380   ; Store score low
LDA #$12    ; Score high byte = $12
STA $0381   ; Store score high

; Preserve score while updating sprites
LDA $0380   ; Load score low
PHA         ; Save on stack
LDA $0381   ; Load score high
PHA         ; Save on stack

; Update sprite positions (changes A)
LDA #$50    ; Sprite X
STA $0203   ; OAM sprite X
LDA #$60    ; Sprite Y  
STA $0200   ; OAM sprite Y

; Restore original score data
PLA         ; Get score high back
STA $0381   ; Restore it
PLA         ; Get score low back
STA $0380   ; Restore it
; Score is preserved: $1234
```

## Introduction to Subroutines

Subroutines are reusable blocks of code that you can "call" from anywhere in your program. They're essential for:

- Avoiding code duplication
- Creating modular, organized programs
- Building libraries of common functions
- Managing complex game logic

### JSR - Jump to Subroutine

```text
JSR label   ; Jump to Subroutine
            ; Pushes return address to stack
            ; Jumps to 'label'
```

### RTS - Return from Subroutine

```text
RTS         ; Return from Subroutine  
            ; Pulls return address from stack
            ; Jumps back to caller
```

## Your First Subroutine

Let's create a subroutine that clears the screen:

```text
main:
    JSR clear_screen    ; Call subroutine
    ; ... rest of main program ...

clear_screen:
    LDA #$20            ; PPU address high
    STA $2006
    LDA #$00            ; PPU address low  
    STA $2006
    LDX #$00            ; Counter
clear_loop:
    LDA #$20            ; Space character
    STA $2007           ; Write to PPU
    INX
    BNE clear_loop      ; Loop 256 times
    RTS                 ; Return to caller
```

**Screen Clear Subroutine:**

```assembly
; Main program
JSR clear_area      ; Call our subroutine
LDA #$01            ; Main program continues
STA $0400           ; Store completion flag

; Subroutine: Clear a memory area
clear_area:
    LDX #$00        ; Start counter
clear_loop:
    LDA #$00        ; Clear value
    STA $0500,X     ; Clear memory $0500+X
    INX             ; Next location
    CPX #$10        ; Clear 16 bytes?
    BNE clear_loop  ; Continue if not done
    RTS             ; Return to caller

; Memory $0500-$050F is now cleared
```

## Subroutine Parameters

Since the 6502 doesn't have built-in parameter passing, we use memory locations:

```text
; Set parameters
LDA #$05            ; Parameter: 5 lives
STA param1
LDA #$10            ; Parameter: starting X position
STA param2
JSR init_player     ; Call subroutine

init_player:
    LDA param1      ; Get lives parameter
    STA player_lives
    LDA param2      ; Get position parameter  
    STA player_x
    LDA #$80        ; Default Y position
    STA player_y
    RTS
```

## Game Function: Play Sound Effect

Let's create a reusable sound effect function:

```text
; Parameters for sound effect
sound_freq_lo   = $0390
sound_freq_hi   = $0391  
sound_duration  = $0392

play_sound:
    ; Setup pulse wave 1
    LDA #$BF        ; Duty cycle and volume
    STA $4000
    
    ; Set frequency
    LDA sound_freq_lo
    STA $4002       ; Frequency low
    LDA sound_freq_hi  
    STA $4003       ; Frequency high
    
    ; Set duration (simplified)
    LDA sound_duration
    STA $0393       ; Store duration counter
    
    RTS

; Usage example:
play_jump_sound:
    LDA #$FE        ; Jump sound frequency low
    STA sound_freq_lo
    LDA #$01        ; Jump sound frequency high
    STA sound_freq_hi
    LDA #$20        ; Duration
    STA sound_duration
    JSR play_sound  ; Play the sound
    RTS
```

**Sound Effect Subroutine:**

```assembly
; Setup APU
LDA #$0F    ; Enable all channels
STA $4015

; Sound effect parameters
LDA #$C0    ; Low frequency for bass sound
STA $0390   ; sound_freq_lo
LDA #$01    ; High frequency byte
STA $0391   ; sound_freq_hi  
LDA #$30    ; Duration
STA $0392   ; sound_duration

; Call sound effect subroutine
JSR play_sound

; Sound effect subroutine
play_sound:
    LDA #$BF    ; Configure pulse wave
    STA $4000   ; Pulse 1 control
    
    LDA $0390   ; Get frequency low
    STA $4002   ; Set pulse 1 freq low
    LDA $0391   ; Get frequency high
    STA $4003   ; Set pulse 1 freq high
    
    ; Duration handling would go here in full game
    RTS         ; Return to caller

; Sound is now playing!
```

## Nested Subroutine Calls

Subroutines can call other subroutines:

```text
main:
    JSR game_logic      ; Call main game function
    
game_logic:
    JSR update_player   ; Update player
    JSR update_enemies  ; Update enemies
    JSR check_collisions ; Check for collisions
    RTS
    
update_player:
    JSR read_input      ; Read controller
    JSR move_player     ; Move based on input
    RTS
    
read_input:
    LDA $4016           ; Read controller
    ; ... input processing ...
    RTS
    
move_player:
    ; ... movement code ...
    RTS
```

## Stack Depth Awareness

Each JSR uses 2 bytes of stack space (return address). With nested calls, stack usage adds up:

```
Main program          Stack usage:
JSR level1           2 bytes
  JSR level2         4 bytes  
    JSR level3       6 bytes
    RTS              4 bytes
  RTS                2 bytes
RTS                  0 bytes
```

The NES stack is only 256 bytes, so deep nesting can cause problems!

## Sprite Symphony Functions

Let's organize our music project with subroutines:

```text
; Note frequency table (simplified)
note_freq_lo:
    .byte $FE, $E2, $CA, $B5, $A2, $91, $82, $74  ; C,D,E,F,G,A,B,C

init_audio:
    LDA #$0F    ; Enable all APU channels
    STA $4015
    LDA #$BF    ; Configure pulse wave 1
    STA $4000
    RTS

play_note:
    ; Parameter: note number in A (0-7)
    TAX         ; Transfer note to X for indexing
    LDA note_freq_lo,X  ; Get frequency from table
    STA $4002   ; Set frequency low
    LDA #$01    ; High frequency (simplified)
    STA $4003   ; Set frequency high
    RTS

; Usage:
    JSR init_audio  ; Initialize sound system
    LDA #$02        ; Play note E (index 2)
    JSR play_note   ; Play it
```

**Sprite Symphony Functions:**

```assembly
; Initialize audio system
JSR init_audio

; Play a sequence of notes
LDA #$00    ; Note C
JSR play_note
LDA #$02    ; Note E  
JSR play_note
LDA #$04    ; Note G
JSR play_note

; Audio initialization subroutine
init_audio:
    LDA #$0F    ; Enable APU channels
    STA $4015   ; APU control
    LDA #$BF    ; Pulse wave setup
    STA $4000   ; Pulse 1 control
    RTS

; Play note subroutine (note number in A)
play_note:
    ; Simple frequency mapping
    CMP #$00    ; C note?
    BEQ play_c
    CMP #$02    ; E note?
    BEQ play_e
    CMP #$04    ; G note?
    BEQ play_g
    RTS         ; Unknown note
    
play_c:
    LDA #$FE    ; C frequency
    STA $4002
    RTS
play_e:
    LDA #$CA    ; E frequency
    STA $4002
    RTS
play_g:
    LDA #$A2    ; G frequency
    STA $4002
    RTS
```

## Practical Exercise: Game Utility Functions

Create a set of utility functions for common game operations:

1. `clear_memory` - Clears a range of memory
2. `add_score` - Adds points to the player's score
3. `check_boundary` - Keeps a value within bounds

Parameters:
- `param1` ($0390) - General parameter 1
- `param2` ($0391) - General parameter 2  
- `param3` ($0392) - General parameter 3

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Game Utility Functions"
  code="; Test the utility functions

; Test 1: Clear memory
LDA #$05    ; Start at $0500
STA $0390   ; param1 = start location high
LDA #$00    ; 
STA $0391   ; param2 = start location low
LDA #$08    ; Clear 8 bytes
STA $0392   ; param3 = count
JSR clear_memory

; Test 2: Add score
LDA #$50    ; Add 80 points
STA $0390   ; param1 = points to add
JSR add_score

; Test 3: Boundary check
LDA #$FF    ; Test value 255
STA $0390   ; param1 = value to check
LDA #$F0    ; Maximum value 240
STA $0391   ; param2 = max boundary
JSR check_boundary

; Utility Functions:

clear_memory:
    ; Clear memory starting at param1/param2 for param3 bytes
    LDY $0392   ; Get count
    LDX #$00    ; Start index
clear_loop:
    LDA #$00    ; Clear value
    STA $0500,X ; Clear memory (simplified address)
    INX         ; Next byte
    DEY         ; Decrease count
    BNE clear_loop ; Continue if count > 0
    RTS

add_score:
    ; Add param1 to score at $03A0 (low) and $03A1 (high)
    LDA $03A0   ; Current score low
    CLC         ; Clear carry
    ADC $0390   ; Add new points
    STA $03A0   ; Store new score low
    BCC no_carry ; No carry needed
    INC $03A1   ; Increment score high byte
no_carry:
    RTS

check_boundary:
    ; Check if param1 > param2, if so set param1 = param2
    LDA $0390   ; Get value
    CMP $0391   ; Compare with boundary
    BCC in_bounds ; Branch if value < boundary
    LDA $0391   ; Value too big, use boundary
    STA $0390   ; Store corrected value
in_bounds:
    RTS

; Functions are complete and tested!"
  language="assembly"
/>

## Best Practices for Subroutines

1. **Always end with RTS**: Every subroutine must have a return
2. **Document parameters**: Make it clear what values are expected
3. **Preserve registers**: Use stack if you need to preserve values
4. **Keep it simple**: One function, one purpose
5. **Test thoroughly**: Make sure all paths return properly

## Stack Overflow Prevention

Monitor your stack usage:
- Each JSR uses 2 bytes
- Each PHA/PHP uses 1 byte
- Maximum safe depth: about 100 JSR calls
- Always match PHA with PLA

## What You've Learned

In this essential lesson, you've mastered:

- The 6502 stack and stack pointer operation
- Stack operations (PHA, PLA, PHP, PLP) for temporary storage
- Subroutine calls (JSR) and returns (RTS)
- Creating reusable, modular code functions
- Parameter passing techniques
- Organizing complex game code into manageable pieces

## Looking Ahead

Next lesson, you'll learn how to work with tables and arrays - essential for storing game data like sprite graphics, sound effects, level layouts, and enemy patterns. You'll discover how to access and manipulate structured data efficiently!

## Fun Fact

The 6502's stack design was revolutionary for its time. Unlike some processors that had separate stacks for data and return addresses, the 6502 uses one unified stack for everything. This simplicity made it easier to implement in hardware and reduced the number of special registers needed, keeping costs down. However, it also means you need to be careful about stack management - if you push too much data without pulling it back, you can interfere with subroutine return addresses and crash your program! Professional NES game developers became experts at efficient stack usage to avoid these problems.