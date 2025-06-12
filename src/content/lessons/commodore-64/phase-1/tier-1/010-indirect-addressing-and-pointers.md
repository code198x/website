---
title: "Indirect Addressing and Pointers"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 10
description: "Learn the 6502's most powerful addressing mode - indirect addressing. Learn to use memory locations as pointers for dynamic data access and advanced programming techniques."
learning_objectives:
  - "Understand indirect addressing and pointer concepts"
  - "Learn zero page indirect addressing ($zp)"
  - "Learn indexed indirect addressing (($zp,X))"
  - "Practice indirect indexed addressing (($zp),Y)"
  - "Build dynamic data structures and flexible programs"
concepts:
  - "Indirect addressing modes"
  - "Pointers and memory addresses"
  - "Zero page indirect (($zp))"
  - "Indexed indirect (($zp,X))"
  - "Indirect indexed (($zp),Y)"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 10
---

# Lesson 10: Indirect Addressing and Pointers

Welcome to the most sophisticated addressing mode of the 6502! Indirect addressing lets you use memory locations as **pointers** - storing addresses that point to other memory locations. This unlocks advanced programming techniques and dynamic data structures.

## What Is Indirect Addressing?

**Indirect addressing** means "go to this address, read the address stored there, then go to THAT address for the actual data."

Think of it like a forwarding address:
1. **Direct**: "Go to 123 Main Street"
2. **Indirect**: "Go to the post office, they have the current address for where to deliver"

In assembly terms:
- **Direct**: `LDA $0400` (load from location $0400)
- **Indirect**: `LDA ($80)` (load from the address stored at $80)

## Why Use Indirect Addressing?

Indirect addressing enables:
- **Dynamic memory access**: The target address can change during program execution
- **Data structures**: Lists, tables, and complex data organizations
- **Flexible programs**: Code that adapts to different data locations
- **Memory management**: Moving data without changing all references

## Zero Page Indirect (JMP ($address))

The 6502 supports indirect addressing mainly with the JMP instruction:

```text
; Setup: Store target address in memory
LDA #$00        ; Low byte of target address
STA $80         ; Store at $80
LDA #$04        ; High byte of target address  
STA $81         ; Store at $81
; Now $80/$81 contains $0400

JMP ($80)       ; Jump to address stored at $80/$81 (jumps to $0400)
```

**Note**: The 6502 has limited indirect addressing modes, but they're very powerful!

## Simulating Indirect Loads

While the 6502 doesn't have `LDA ($zp)`, we can simulate indirect loading:

```text
; Setup pointer in Zero Page
LDA #$00        ; Low byte of target
STA $F0         ; Pointer low byte
LDA #$04        ; High byte of target
STA $F1         ; Pointer high byte
; $F0/$F1 now points to $0400

; Read the address from the pointer
LDA ($F0),Y     ; Load from address in $F0/$F1 + Y offset
```

<CodeRunner 
  system="commodore-64"
  title="Simulated Indirect Addressing"
  code="; Setup pointer to screen memory
LDA #$00        ; Low byte of $0400
STA $F0         ; Store in pointer low
LDA #$04        ; High byte of $0400  
STA $F1         ; Store in pointer high

; Now use indirect indexed to access screen
LDY #$00        ; Offset 0
LDA #$48        ; Load 'H'
STA ($F0),Y     ; Store at address pointed to by $F0/$F1"
  language="assembly"
/>

## Indirect Indexed Addressing (($zp),Y)

**Syntax**: `LDA ($zp),Y`
**Meaning**: Load from the address stored at $zp/$zp+1, plus Y offset

This is the 6502's most powerful addressing mode for data structures!

```text
; Setup base pointer
LDA #$00        ; Screen memory low byte
STA $F0         
LDA #$04        ; Screen memory high byte
STA $F1         
; $F0/$F1 points to $0400

; Access different positions using Y
LDY #$00        ; First position
LDA #$41        ; 'A'
STA ($F0),Y     ; Store at $0400 + 0

LDY #$01        ; Second position  
LDA #$42        ; 'B'
STA ($F0),Y     ; Store at $0400 + 1
```

<CodeRunner 
  system="commodore-64"
  title="Indirect Indexed Addressing"
  code="; Setup pointer to screen memory
LDA #$00        ; Low byte
STA $F0         
LDA #$04        ; High byte
STA $F1         

; Use indirect indexed to write characters
LDY #$00        ; Position 0
LDA #$41        ; 'A'
STA ($F0),Y     

LDY #$01        ; Position 1
LDA #$42        ; 'B'  
STA ($F0),Y     

LDY #$02        ; Position 2
LDA #$43        ; 'C'
STA ($F0),Y"
  language="assembly"
/>

## Indexed Indirect Addressing (($zp,X))

**Syntax**: `LDA ($zp,X)`
**Meaning**: Add X to $zp, then load from the address stored there

This lets you select different pointers based on X:

```text
; Setup multiple pointers
LDA #$00        ; Screen row 0 low
STA $F0         
LDA #$04        ; Screen row 0 high
STA $F1         

LDA #$28        ; Screen row 1 low (40 bytes later)
STA $F2         
LDA #$04        ; Screen row 1 high
STA $F3         

; Select pointer using X
LDX #$00        ; Use first pointer ($F0/$F1)
LDA #$31        ; '1'
STA ($F0,X),Y   ; Use pointer at $F0+X

LDX #$02        ; Use second pointer ($F2/$F3)  
LDA #$32        ; '2'
STA ($F0,X),Y   ; Use pointer at $F0+X
```

<CodeRunner 
  system="commodore-64"
  title="Indexed Indirect Addressing"
  code="; Setup two pointers in Zero Page
LDA #$00        ; Row 0 pointer low
STA $F0         
LDA #$04        ; Row 0 pointer high
STA $F1         

LDA #$28        ; Row 1 pointer low (40 chars = $28)
STA $F2         
LDA #$04        ; Row 1 pointer high
STA $F3         

; Use different pointers with X
LDY #$00        ; Column 0
LDX #$00        ; Select first pointer
LDA #$31        ; '1'
STA ($F0,X),Y   ; Write to row 0

LDX #$02        ; Select second pointer  
LDA #$32        ; '2'
STA ($F0,X),Y   ; Write to row 1"
  language="assembly"
/>

## Building a Data Structure

Let's create a simple "array of arrays" using indirect addressing:

```text
; Setup array of pointers to different data
; Pointer table starts at $E0
LDA #$A0        ; First array at $A0
STA $E0         
LDA #$00        
STA $E1         

LDA #$B0        ; Second array at $B0
STA $E2         
LDA #$00        
STA $E3         

; Fill first array with letters
LDA #$41        ; 'A'
STA $A0         
LDA #$42        ; 'B'
STA $A1         

; Fill second array with numbers
LDA #$31        ; '1'
STA $B0         
LDA #$32        ; '2'
STA $B1         

; Access arrays through pointers
LDX #$00        ; Select first array
LDY #$00        ; First element
LDA ($E0,X),Y   ; Load 'A' from first array
STA $0400       ; Display on screen
```

<CodeRunner 
  system="commodore-64"
  title="Array of Arrays with Indirect Addressing"
  code="; Setup pointer table at $E0
LDA #$A0        ; Point to data at $A0
STA $E0         
LDA #$00        
STA $E1         

LDA #$B0        ; Point to data at $B0
STA $E2         
LDA #$00        
STA $E3         

; Fill data arrays
LDA #$48        ; 'H' in first array
STA $A0         
LDA #$49        ; 'I' in first array
STA $A1         

LDA #$31        ; '1' in second array
STA $B0         
LDA #$32        ; '2' in second array
STA $B1         

; Access through pointers
LDX #$00        ; Use first pointer
LDY #$00        ; First element
LDA ($E0,X),Y   ; Load from first array
STA $0400       ; Display 'H'

LDX #$02        ; Use second pointer
LDY #$00        ; First element  
LDA ($E0,X),Y   ; Load from second array
STA $0401       ; Display '1'"
  language="assembly"
/>

## Dynamic Screen Positioning

Use indirect addressing for flexible screen manipulation:

```text
; Setup pointer to current screen position
LDA #$00        ; Start at screen beginning
STA $FC         ; Current position low
LDA #$04        ; Screen base
STA $FD         ; Current position high

; Function: write character and advance pointer
; Input: A = character to write
WriteChar:
    LDY #$00        ; Offset 0
    STA ($FC),Y     ; Write character at current position
    
    ; Advance pointer to next position
    INC $FC         ; Increment low byte
    BNE NoCarry     ; If no overflow, continue
    INC $FD         ; Increment high byte on overflow
NoCarry:
    RTS             ; Return (we'll learn this later)
```

<CodeRunner 
  system="commodore-64"
  title="Dynamic Screen Positioning"
  code="; Setup screen pointer
LDA #$00        ; Start at screen position 0
STA $FC         
LDA #$04        ; Screen base $0400
STA $FD         

; Write several characters using the pointer
LDY #$00        ; Always use offset 0
LDA #$48        ; 'H'
STA ($FC),Y     ; Write at current position

; Manually advance pointer
INC $FC         ; Move to next position

LDA #$45        ; 'E'
STA ($FC),Y     ; Write at new position

INC $FC         ; Move to next position

LDA #$59        ; 'Y'
STA ($FC),Y     ; Write at new position"
  language="assembly"
/>

## Text String Processing

Indirect addressing makes string processing elegant:

```text
; Setup pointer to text string
LDA #<TextString ; Low byte of string address
STA $FE         
LDA #>TextString ; High byte of string address
STA $FF         

; Setup screen pointer
LDA #$00        
STA $FC         ; Screen position low
LDA #$04        
STA $FD         ; Screen position high

; Copy string to screen (simplified)
LDY #$00        ; Character index
LDA ($FE),Y     ; Load character from string
STA ($FC),Y     ; Store to screen
; (In real code, we'd loop until end of string)

TextString:
    .byte "HELLO", 0  ; Null-terminated string
```

## Memory Management with Pointers

Use pointers for flexible memory allocation:

```text
; Memory pool management
; $F8/$F9 = pointer to next free memory location

; Allocate memory function (simplified)
AllocateMemory:
    LDA $F8         ; Load current free pointer low
    LDX $F9         ; Load current free pointer high
    ; Return address in A/X for caller to use
    
    ; Advance free pointer by allocated size
    CLC
    LDA $F8
    ADC #$10        ; Allocate 16 bytes
    STA $F8
    BCC NoCarry2
    INC $F9         ; Handle overflow
NoCarry2:
    RTS
```

## Addressing Mode Comparison

| Mode | Example | Meaning | Use Case |
|------|---------|---------|----------|
| Immediate | `LDA #$41` | Load value $41 | Constants |
| Absolute | `LDA $0400` | Load from $0400 | Fixed locations |
| Indexed | `LDA $0400,X` | Load from $0400+X | Arrays |
| Indirect | `JMP ($80)` | Jump to address at $80/$81 | Function pointers |
| Ind. Indexed | `LDA ($80),Y` | Load from [$80/$81]+Y | Data structures |
| Indexed Ind. | `LDA ($80,X)` | Load from [$80+X/$81+X] | Pointer arrays |

## Practice Exercise

Create a program that:

1. Sets up three data arrays in memory ($A0, $B0, $C0)
2. Creates a pointer table to access these arrays
3. Uses indexed indirect addressing to select an array
4. Uses indirect indexed addressing to access elements within the selected array
5. Displays characters from different arrays on screen

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Complete Indirect Addressing"
  code="; Setup three data arrays
LDA #$48        ; 'H'
STA $A0         
LDA #$45        ; 'E'
STA $A1         

LDA #$4C        ; 'L'
STA $B0         
LDA #$4C        ; 'L'
STA $B1         

LDA #$4F        ; 'O'
STA $C0         
LDA #$21        ; '!'
STA $C1         

; Setup pointer table at $E0
LDA #$A0        ; Point to first array
STA $E0         
LDA #$00        
STA $E1         

LDA #$B0        ; Point to second array
STA $E2         
LDA #$00        
STA $E3         

LDA #$C0        ; Point to third array
STA $E4         
LDA #$00        
STA $E5         

; Display characters using indirect addressing
; Get 'H' from first array
LDX #$00        ; Select first pointer
LDY #$00        ; First element
LDA ($E0,X),Y   ; Load 'H'
STA $0400       ; Display

; Get 'E' from first array  
LDY #$01        ; Second element
LDA ($E0,X),Y   ; Load 'E'
STA $0401       ; Display

; Get 'L' from second array
LDX #$02        ; Select second pointer
LDY #$00        ; First element
LDA ($E0,X),Y   ; Load 'L'
STA $0402       ; Display"
  language="assembly"
/>

## Why Indirect Addressing Matters

Indirect addressing is the foundation of:
- **Pointers in C/C++**: Direct hardware equivalent of `*ptr`
- **Object-oriented programming**: Method tables and virtual functions
- **Dynamic memory allocation**: malloc(), heap management
- **Data structures**: Linked lists, trees, graphs
- **Operating systems**: Process tables, device drivers

## What You've Learned

In this lesson, you've mastered:

- Indirect addressing concepts and pointer fundamentals
- Zero page indirect addressing for flexible jumps
- Indirect indexed addressing (($zp),Y) for data structures
- Indexed indirect addressing (($zp,X)) for pointer arrays
- Building dynamic data structures with pointers
- The foundation of modern programming techniques

## Looking Ahead

In the next lesson, you'll learn about the **stack** - a special memory area that enables subroutines, function calls, and advanced program organisation. The stack is where the concepts of pointers and indirect addressing really come together!

## Fun Fact

The indirect addressing modes you've learned are the hardware foundation of every programming language feature that involves "pointing to" data! When you write `array[i]` in JavaScript, use `*ptr` in C, or access object properties in Python, the computer is ultimately using addressing modes like the ones you've just mastered. You're learning the fundamental patterns that make modern programming possible!