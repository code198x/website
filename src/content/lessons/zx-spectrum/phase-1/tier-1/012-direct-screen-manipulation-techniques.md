---
title: "Direct Screen Manipulation Techniques"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 12
description: "Master efficient techniques for direct screen manipulation. Learn optimized routines for clearing, filling, and updating screen memory quickly."
learning_objectives:
  - "Learn efficient screen clearing and filling techniques"
  - "Master block memory operations for screen updates"
  - "Understand optimized screen memory access patterns"
  - "Create reusable screen manipulation routines"
  - "Practice timing-sensitive screen operations"
concepts:
  - "Block memory operations (LDIR, LDDR)"
  - "Screen clearing routines"
  - "Pattern filling techniques"
  - "Optimized memory access loops"
  - "Screen buffer management"
estimated_duration: "45-55 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 12
---

# Lesson 12: Direct Screen Manipulation Techniques

Now that you understand the ZX Spectrum's screen memory layout, it's time to learn efficient techniques for manipulating the display. These optimized routines will form the foundation of your graphics programming and game development skills.

## The Power of Block Operations

The Z80 processor has special instructions for moving large blocks of memory quickly:

### LDIR - Load, Increment, Repeat
- **Purpose**: Copy BC bytes from (HL) to (DE), incrementing both pointers
- **Usage**: Perfect for filling or copying screen areas
- **Speed**: Much faster than manual loops

### LDDR - Load, Decrement, Repeat  
- **Purpose**: Copy BC bytes from (HL) to (DE), decrementing both pointers
- **Usage**: Useful for backward copying operations
- **Speed**: Also faster than manual loops

## Screen Clearing Techniques

### Method 1: Simple Clear with LDIR

```text
; Clear entire screen to zeros (black pixels)
LD HL, $4000     ; Start of screen memory
LD DE, $4001     ; One byte after start
LD BC, 6143      ; 6144 - 1 bytes to copy
LD (HL), $00     ; Put zero in first byte
LDIR             ; Copy zero to all screen memory
```

**Basic Screen Clear:**

```assembly
; Clear screen memory to black
LD HL, $4000     ; Point to start of screen
LD DE, $4001     ; Point to next byte  
LD BC, 6143      ; Copy 6143 bytes (6144 - 1)
LD (HL), $00     ; Set first byte to 0
LDIR             ; Fill entire screen with zeros

; Clear attributes to white on black
LD HL, $5800     ; Start of attributes
LD DE, $5801     ; One byte after start
LD BC, 767       ; 768 - 1 bytes to copy
LD (HL), %00000111  ; White ink on black paper
LDIR             ; Fill all attributes
```

### Method 2: Optimized Clear Using Stack

```text
; Ultra-fast screen clear using stack operations
LD HL, $5800 + 768  ; End of attribute memory
LD SP, HL           ; Set stack pointer to end
LD HL, $0000        ; Clear pattern (black pixels)
LD DE, $0707        ; Attribute pattern (white on black)

; Clear both screen and attributes in one pass
LD B, 96            ; 96 × 8 = 768 attribute bytes
ClearLoop:
    PUSH HL         ; Clear 8 screen bytes (fast!)
    PUSH HL
    PUSH HL  
    PUSH HL
    PUSH DE         ; Set 8 attribute bytes
    PUSH DE
    PUSH DE
    PUSH DE
    DJNZ ClearLoop  ; Repeat for all screen
```

*Note: This advanced technique is very fast but requires careful stack management!*

## Pattern Filling Techniques

### Horizontal Line Drawing

```text
; Draw horizontal line across screen at row 10
LD HL, $4000        ; Screen start
LD DE, 10 * 32      ; 10 rows × 32 bytes per row  
ADD HL, DE          ; Point to row 10
LD B, 32            ; 32 bytes across
LD A, %11111111     ; Solid line pattern

HLineLoop:
    LD (HL), A      ; Draw line segment
    INC HL          ; Move to next byte
    DJNZ HLineLoop  ; Repeat across row
```

**Horizontal Line Drawing:**

```assembly
; Draw horizontal lines at different screen positions
; Line at top of screen
LD HL, $4000        ; Top row
LD B, 32            ; Full width
LD A, %11111111     ; Solid line
HLine1:
    LD (HL), A
    INC HL
    DJNZ HLine1

; Line at middle of screen (row 12 = middle third + 4 rows)
LD HL, $4800 + (4 * 32)  ; Middle third + 4 rows
LD B, 32            ; Full width  
LD A, %10101010     ; Dotted line pattern
HLine2:
    LD (HL), A
    INC HL
    DJNZ HLine2
```

### Vertical Line Drawing

```text
; Draw vertical line at column 16
LD IX, $4000 + 16   ; Start at column 16
LD B, 24            ; 24 character rows
LD A, %10000000     ; Left pixel of character

VLineLoop:
    LD (IX+0), A    ; Draw at current row
    ; Move to next row (accounting for thirds)
    PUSH AF
    PUSH BC
    ; Complex calculation for next row...
    POP BC
    POP AF
    DJNZ VLineLoop
```

The vertical line is more complex due to the thirds layout, but we can simplify with a lookup table!

## Screen Scrolling Techniques

### Horizontal Scrolling (Left)

```text
; Scroll entire screen left by one pixel
LD HL, $4000        ; Start of screen
LD B, 192           ; 192 pixel rows

ScrollRowLoop:
    PUSH BC
    PUSH HL
    
    ; Scroll this row left
    LD B, 32        ; 32 bytes per row
    OR A            ; Clear carry flag
    
ScrollByteLoop:
    RL (HL)         ; Rotate left through carry
    INC HL          ; Next byte
    DJNZ ScrollByteLoop
    
    POP HL
    ; Move to next row (complex addressing)
    CALL NextRowAddress
    POP BC
    DJNZ ScrollRowLoop
```

**Simple Horizontal Scroll:**

```assembly
; Simple left scroll of top screen row
LD HL, $4000        ; Top row of screen
LD B, 32            ; 32 bytes in row
OR A                ; Clear carry flag

ScrollLeft:
    RL (HL)         ; Rotate left through carry
    INC HL          ; Move to next byte
    DJNZ ScrollLeft ; Continue across row

; The leftmost pixel of each byte moves into carry
; and carry moves into rightmost pixel of next byte
; This creates a smooth scrolling effect!
```

### Vertical Scrolling (Up)

```text
; Scroll screen up by one pixel row
LD HL, $4000        ; Source: second row
LD DE, $4000        ; Dest: first row  
LD BC, 6112         ; Copy all but last row
LDIR                ; Move everything up

; Clear bottom row
LD HL, $57E0        ; Last row of screen
LD B, 32            ; 32 bytes
LD A, $00           ; Clear pattern
ClearBottom:
    LD (HL), A
    INC HL
    DJNZ ClearBottom
```

## Block Copy Operations

### Copying Screen Sections

```text
; Copy 8×8 character cell from one position to another
; Source: character position (5,5)
; Dest: character position (10,10)

LD IX, $4000 + (5*32) + 5     ; Source base
LD IY, $4800 + (2*32) + 10    ; Dest base (third 1, row 2)

LD B, 8             ; 8 pixel rows
CopyCharLoop:
    LD A, (IX+0)    ; Read source pixel row
    LD (IY+0), A    ; Write to destination
    
    ; Move to next pixel row in both character cells
    LD DE, 32       ; Row spacing
    ADD IX, DE      ; Next source row
    ADD IY, DE      ; Next dest row
    
    DJNZ CopyCharLoop
```

**Character Cell Copy:**

```assembly
; Copy a pattern from one location to another
; First, create a pattern at position (1,1)
LD IX, $4021        ; Character position (1,1)
LD (IX+$00), %00111100  ; Create a simple pattern
LD (IX+$20), %01111110
LD (IX+$40), %11111111
LD (IX+$60), %11111111
LD (IX+$80), %11111111
LD (IX+$A0), %01111110
LD (IX+$C0), %00111100
LD (IX+$E0), %00000000

; Now copy it to position (5,1)
LD IX, $4021        ; Source at (1,1)
LD IY, $4025        ; Destination at (5,1)
LD B, 8             ; 8 rows to copy

CopyLoop:
    LD A, (IX+0)    ; Read from source
    LD (IY+0), A    ; Write to destination
    LD DE, $20      ; Move to next row
    ADD IX, DE      ; Update source pointer
    ADD IY, DE      ; Update dest pointer
    DJNZ CopyLoop   ; Repeat for all rows
```

## Advanced Screen Buffer Techniques

### Double Buffering Concept

```text
; Use off-screen memory as buffer
SCREEN_BUFFER EQU $6000     ; Off-screen buffer

; Draw to buffer first
LD HL, SCREEN_BUFFER
; ... do all your drawing here ...

; Then copy entire buffer to screen quickly
LD HL, SCREEN_BUFFER        ; Source
LD DE, $4000               ; Screen destination
LD BC, 6144                ; All pixel bytes
LDIR                       ; Fast copy to screen
```

### Selective Screen Updates

```text
; Only update changed screen regions
; Keep track of "dirty" character cells

UpdateScreen:
    LD HL, DirtyTable       ; Table of changed cells
    LD B, 768               ; Check all cells
    
CheckCell:
    LD A, (HL)              ; Is this cell dirty?
    OR A
    JR Z, NextCell          ; Skip if clean
    
    ; Update this cell
    PUSH HL
    PUSH BC
    CALL UpdateSingleCell   ; Your update routine
    POP BC
    POP HL
    
    LD (HL), 0              ; Mark cell as clean
    
NextCell:
    INC HL
    DJNZ CheckCell
    RET
```

## Screen Timing Considerations

### Waiting for Screen Refresh

```text
; Wait for screen refresh to avoid flicker
WaitForRetrace:
    LD A, R                 ; Read refresh register
    AND %01000000           ; Check bit 6
    JR Z, WaitForRetrace    ; Wait until set
    
WaitForChange:
    LD A, R                 ; Read again
    AND %01000000           ; Check bit 6  
    JR NZ, WaitForChange    ; Wait until clear
    ; Now it's safe to update screen
```

## Memory-Mapped Screen Effects

### XOR Drawing (for Animation)

```text
; XOR drawing allows easy erase-and-redraw
LD HL, $4000 + 100      ; Screen position
LD A, %11111111         ; Pattern to draw
XOR (HL)                ; XOR with existing pixels
LD (HL), A              ; Store result

; Drawing same pattern again will erase it!
; Perfect for moving sprites
```

**XOR Drawing Demonstration:**

```assembly
; XOR drawing for easy sprite animation
LD HL, $4050        ; Screen position
LD A, %01111110     ; Sprite pattern

; Draw sprite
XOR (HL)            ; XOR with background
LD (HL), A          ; Place sprite

; Move sprite right and redraw
LD A, %01111110     ; Same pattern
XOR (HL)            ; Remove sprite (XOR again)
LD (HL), A          ; Sprite is now erased!

INC HL              ; Move to next position
LD A, %01111110     ; Same pattern
XOR (HL)            ; Draw at new position
LD (HL), A          ; Sprite appears at new location
```

## Practice Exercise

Create a comprehensive screen manipulation program that:

1. Clears the screen to a checkerboard pattern
2. Draws a border around the entire screen
3. Creates a moving pattern that bounces across the screen
4. Uses XOR drawing for smooth animation

**Practice Exercise - Screen Demo:**

```assembly
; Screen manipulation demo
; 1. Clear screen with checkerboard pattern
LD HL, $4000        ; Start of screen
LD DE, $4001        ; Next byte
LD BC, 6143         ; Bytes to fill
LD (HL), %10101010  ; Checkerboard pattern
LDIR                ; Fill screen

; 2. Draw border - top edge
LD HL, $4000        ; Top row
LD B, 32            ; Full width
LD A, %11111111     ; Solid border
TopBorder:
    LD (HL), A
    INC HL
    DJNZ TopBorder

; 3. Simple moving pattern demo  
LD HL, $4100        ; Middle of screen area
LD B, 10            ; Move 10 positions

MovePattern:
    PUSH BC
    PUSH HL
    
    ; Draw pattern at current position
    LD A, %01111110
    XOR (HL)
    LD (HL), A
    
    ; Small delay (very simple)
    LD DE, $1000
DelayLoop:
    DEC DE
    LD A, D
    OR E
    JR NZ, DelayLoop
    
    ; Erase pattern
    POP HL
    LD A, %01111110
    XOR (HL)
    LD (HL), A
    
    INC HL              ; Move right
    POP BC
    DJNZ MovePattern    ; Continue moving
```

## Optimization Tips

### Use Block Operations When Possible
- LDIR is much faster than manual loops
- Consider stack operations for ultra-fast filling
- Plan memory layout for efficient copying

### Minimize Screen Updates
- Only update changed areas
- Use double buffering for complex animations
- Consider XOR drawing for moving objects

### Understand Memory Patterns
- Sequential access is fastest
- Avoid jumping around memory randomly
- Use index registers for character-based operations

## What You've Learned

In this practical lesson, you've mastered:

- Efficient screen clearing using LDIR and other techniques
- Pattern filling methods for backgrounds and effects
- Screen scrolling algorithms for both horizontal and vertical movement
- Block copy operations for moving graphics data
- Advanced techniques like double buffering and XOR drawing
- Timing considerations for smooth animation
- Optimization strategies for fast screen updates

## Looking Ahead

Next, you'll learn about **character and sprite graphics** - creating reusable graphics routines and managing multiple moving objects on screen using the screen manipulation techniques you've just learned!

## Fun Fact

The ZX Spectrum's screen memory layout, while initially confusing, actually enabled some very clever programming tricks! The "thirds" organization made it possible to quickly clear or scroll individual thirds of the screen independently, which was useful for games with split-screen displays or status areas. Many Spectrum games used the attribute memory's separate organization for clever effects - changing colors without touching pixels, or using attributes as a simple collision detection system. The combination of efficient Z80 block operations and the Spectrum's unique memory layout allowed programmers to create surprisingly smooth animation and complex graphics on what was considered a budget home computer!