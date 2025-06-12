---
title: "Logical Operations"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 7
description: "Learn bit-level operations with AND, OR, and XOR instructions. Learn to manipulate individual bits for graphics, sound, and hardware control."
learning_objectives:
  - "Understand binary logic and bit manipulation"
  - "Learn AND instruction for masking and testing bits"
  - "Learn OR instruction for setting bits"
  - "Practice XOR instruction for toggling bits"
  - "Apply logical operations to graphics and hardware control"
concepts:
  - "Binary logic operations"
  - "AND instruction for bit masking"
  - "OR instruction for bit setting"
  - "XOR instruction for bit toggling"
  - "Bit manipulation for graphics and hardware"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 7
---

# Lesson 7: Logical Operations

Welcome to the world of bit manipulation! While arithmetic operations work with numbers as a whole, logical operations let you work with individual bits. This is essential for graphics programming, hardware control, and creating efficient code on the C64.

## Understanding Binary Logic

Every byte is made of 8 bits, each either 0 or 1. Logical operations work on these bits individually:

```
$53 = 01010011 binary
$2F = 00101111 binary
```

The 6502 has three logical operations:
- **AND**: Both bits must be 1 to get 1
- **OR**: Either bit can be 1 to get 1  
- **XOR**: Bits must be different to get 1

## The AND Instruction

**AND** compares each bit position. The result bit is 1 only if both input bits are 1:

```
  01010011  ($53)
& 00101111  ($2F)
----------
  00000011  ($03)
```

```text
LDA #$53    ; Load %01010011
AND #$2F    ; AND with %00101111
            ; Result: $03 (%00000011)
```

<CodeRunner 
  system="commodore-64"
  title="Basic AND Operation"
  code="LDA #$53    ; Load %01010011 (binary)
AND #$2F    ; AND with %00101111
STA $0400   ; Store result ($03) on screen"
  language="assembly"
/>

**Common uses for AND**:
- **Bit masking**: Extract specific bits
- **Testing bits**: Check if certain bits are set
- **Clearing bits**: Force specific bits to 0

## Bit Masking with AND

Use AND to extract specific bits by masking with 1s where you want to keep bits:

```text
; Extract the lower 4 bits (nibble)
LDA #$B7    ; Load %10110111
AND #$0F    ; Mask with %00001111 (keep lower 4 bits)
            ; Result: $07 (%00000111)

; Test if bit 7 is set (negative bit)
LDA #$80    ; Load %10000000
AND #$80    ; Test bit 7
            ; Result: $80 if bit 7 was set, $00 if clear
```

<CodeRunner 
  system="commodore-64"
  title="Bit Masking Examples"
  code="; Extract lower 4 bits
LDA #$B7    ; %10110111
AND #$0F    ; Mask: %00001111
STA $0400   ; Result: $07

; Test highest bit
LDA #$80    ; %10000000  
AND #$80    ; Test bit 7
STA $0401   ; Result: $80 (bit 7 was set)"
  language="assembly"
/>

## The OR Instruction

**OR** compares each bit position. The result bit is 1 if either input bit is 1:

```
  01010011  ($53)
| 00101111  ($2F)
----------
  01111111  ($7F)
```

```text
LDA #$53    ; Load %01010011
ORA #$2F    ; OR with %00101111 (note: ORA, not OR!)
            ; Result: $7F (%01111111)
```

<CodeRunner 
  system="commodore-64"
  title="Basic OR Operation"
  code="LDA #$53    ; Load %01010011
ORA #$2F    ; OR with %00101111 (instruction is ORA)
STA $0400   ; Store result ($7F) on screen"
  language="assembly"
/>

**Note**: The instruction is **ORA**, not OR, to avoid confusion with the word "or"!

**Common uses for OR**:
- **Setting bits**: Force specific bits to 1
- **Combining data**: Merge bit patterns
- **Adding attributes**: Set flags or properties

## Setting Bits with OR

Use OR to set specific bits to 1:

```text
; Set bit 7 (make number negative)
LDA #$23    ; Load %00100011
ORA #$80    ; Set bit 7: %10000000
            ; Result: $A3 (%10100011)

; Set multiple bits
LDA #$10    ; Load %00010000
ORA #$05    ; Set bits 0 and 2: %00000101
            ; Result: $15 (%00010101)
```

<CodeRunner 
  system="commodore-64"
  title="Setting Bits with OR"
  code="; Set bit 7 (negative bit)
LDA #$23    ; %00100011
ORA #$80    ; Set bit 7
STA $0400   ; Result: $A3

; Set bits 0 and 2
LDA #$10    ; %00010000
ORA #$05    ; Set bits 0 and 2
STA $0401   ; Result: $15"
  language="assembly"
/>

## The XOR Instruction

**XOR** (Exclusive OR) compares each bit position. The result bit is 1 only if the input bits are different:

```
  01010011  ($53)
^ 00101111  ($2F)
----------
  01111100  ($7C)
```

```text
LDA #$53    ; Load %01010011
EOR #$2F    ; XOR with %00101111 (note: EOR, not XOR!)
            ; Result: $7C (%01111100)
```

<CodeRunner 
  system="commodore-64"
  title="Basic XOR Operation"
  code="LDA #$53    ; Load %01010011
EOR #$2F    ; XOR with %00101111 (instruction is EOR)
STA $0400   ; Store result ($7C) on screen"
  language="assembly"
/>

**Note**: The instruction is **EOR** (Exclusive OR), not XOR!

**Common uses for XOR**:
- **Toggling bits**: Flip specific bits
- **Encryption**: Simple data scrambling
- **Animation**: Create flashing effects

## Toggling Bits with XOR

Use XOR to flip specific bits:

```text
; Toggle bit 5
LDA #$20    ; Load %00100000 (bit 5 set)
EOR #$20    ; Toggle bit 5
            ; Result: $00 (bit 5 now clear)

; Toggle multiple bits
LDA #$AA    ; Load %10101010
EOR #$FF    ; Toggle all bits
            ; Result: $55 (%01010101)
```

<CodeRunner 
  system="commodore-64"
  title="Toggling Bits with XOR"
  code="; Toggle bit 5
LDA #$20    ; %00100000
EOR #$20    ; Toggle bit 5
STA $0400   ; Result: $00

; Toggle all bits
LDA #$AA    ; %10101010
EOR #$FF    ; Flip all bits
STA $0401   ; Result: $55 (%01010101)"
  language="assembly"
/>

## Practical Example: Screen Color Control

The C64's border colour is controlled by memory location $D020. Let's manipulate it using logical operations:

```text
; Read current border colour
LDA $D020   ; Load current border colour (lower 4 bits)

; Clear upper 4 bits (safety)
AND #$0F    ; Keep only colour bits (0-15)

; Set border to white (colour 1)
ORA #$01    ; Force colour to 1
STA $D020   ; Update border colour

; Toggle colour bit 1
LDA $D020
EOR #$02    ; Toggle bit 1 of colour
STA $D020   ; Update border
```

<CodeRunner 
  system="commodore-64"
  title="Border Color Manipulation"
  code="; Manipulate border colour using logical operations
LDA $D020   ; Read current border colour
AND #$0F    ; Keep only colour bits (lower 4 bits)
ORA #$02    ; Set to colour 2 (red)
STA $D020   ; Update border

; Toggle between colors
LDA $D020
EOR #$04    ; Toggle bit 2 (changes colour)
STA $D020"
  language="assembly"
/>

## Character Manipulation

Let's use logical operations to manipulate text characters:

```text
; Convert lowercase to uppercase
LDA #$61    ; Load 'a' (%01100001)
AND #$DF    ; Clear bit 5 (%11011111)
            ; Result: $41 ('A')

; Convert uppercase to lowercase  
LDA #$41    ; Load 'A' (%01000001)
ORA #$20    ; Set bit 5 (%00100000)
            ; Result: $61 ('a')

; Toggle case
LDA #$41    ; Load 'A'
EOR #$20    ; Toggle bit 5
            ; Result: $61 ('a')
```

<CodeRunner 
  system="commodore-64"
  title="Character Case Conversion"
  code="; Convert 'a' to 'A'
LDA #$61    ; 'a'
AND #$DF    ; Clear bit 5 (uppercase conversion)
STA $0400   ; Display 'A'

; Convert 'B' to 'b'
LDA #$42    ; 'B'
ORA #$20    ; Set bit 5 (lowercase conversion)
STA $0401   ; Display 'b'

; Toggle case of 'C'
LDA #$43    ; 'C'
EOR #$20    ; Toggle bit 5
STA $0402   ; Display 'c'"
  language="assembly"
/>

## Combining Operations

You can chain logical operations for complex bit manipulation:

```text
; Extract middle 4 bits and shift them
LDA #$BC    ; Load %10111100
AND #$3C    ; Extract bits 2-5: %00111100
            ; Now we have: %00111100

; Could continue with shifts (we'll learn those later)
```

## Flag Effects

Logical operations affect the Negative and Zero flags:

```text
LDA #$FF
AND #$00    ; Result: $00, Zero flag SET

LDA #$7F  
ORA #$80    ; Result: $FF, Negative flag SET (bit 7 = 1)

LDA #$80
EOR #$80    ; Result: $00, Zero flag SET
```

## Practice Exercise

Create a program that demonstrates bit manipulation:

1. Start with the value $B5 (%10110101)
2. Use AND to extract the lower 3 bits
3. Use OR to set bit 6
4. Use XOR to toggle bit 0
5. Display each result on screen

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Bit Manipulation Sequence"
  code="; Start with %10110101 ($B5)
LDA #$B5    ; Load starting value
STA $0400   ; Display original

; Extract lower 3 bits
AND #$07    ; Mask: %00000111
STA $0401   ; Result: $05 (%00000101)

; Reload and set bit 6
LDA #$B5    ; Reload original
ORA #$40    ; Set bit 6: %01000000
STA $0402   ; Result: $F5 (%11110101)

; Reload and toggle bit 0
LDA #$B5    ; Reload original  
EOR #$01    ; Toggle bit 0
STA $0403   ; Result: $B4 (%10110100)"
  language="assembly"
/>

## Common Bit Patterns

Here are useful bit patterns for masking:

```
%00000001 = $01 - Bit 0
%00000010 = $02 - Bit 1
%00000100 = $04 - Bit 2
%00001000 = $08 - Bit 3
%00010000 = $10 - Bit 4
%00100000 = $20 - Bit 5
%01000000 = $40 - Bit 6
%10000000 = $80 - Bit 7

%00001111 = $0F - Lower 4 bits
%11110000 = $F0 - Upper 4 bits
%11111111 = $FF - All bits
```

## What You've Learned

In this lesson, you've mastered:

- Binary logic concepts and bit manipulation
- AND instruction for masking and testing bits
- OR (ORA) instruction for setting bits
- XOR (EOR) instruction for toggling bits
- Practical applications in graphics and hardware control
- Character case conversion using bit manipulation
- Flag effects of logical operations

## Looking Ahead

In the next lesson, you'll complete the "6502 Architecture Fundamentals" section with a comprehensive review and build a practical project that combines all the concepts you've learned - data manipulation, arithmetic, and logical operations!

## Fun Fact

The 6502's logical operations were heavily influenced by the needs of early computer graphics and sound synthesis. In 1975, dedicated graphics chips didn't exist, so programmers had to manipulate pixels and sound waves bit by bit. The AND, OR, and XOR instructions made it possible to create complex visual effects and generate music entirely in software - capabilities that seemed magical to users but were built on these simple bit manipulation techniques!