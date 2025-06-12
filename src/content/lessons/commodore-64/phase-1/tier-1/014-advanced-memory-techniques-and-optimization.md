---
title: "Advanced Memory Techniques and Optimization"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 14
description: "Learn advanced 6502 memory management and optimisation techniques. Learn memory mapping, efficient data organisation, and performance optimisation for professional-quality assembly programming."
learning_objectives:
  - "Understand C64 memory map and bank switching concepts"
  - "Learn memory-mapped I/O and hardware registers"
  - "Learn efficient data structure organisation"
  - "Practice performance optimisation techniques"
  - "Build memory-efficient and fast programs"
concepts:
  - "C64 memory map ($0000-$FFFF)"
  - "Memory-mapped I/O registers"
  - "Zero page optimisation strategies"
  - "Data alignment and packing"
  - "Performance measurement and optimisation"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 14
---

# Lesson 14: Advanced Memory Techniques and Optimization

Welcome to professional-level assembly programming! Today you'll learn advanced memory management and optimisation techniques that separate competent programmers from masters. These skills are essential for creating efficient, fast, and robust programs.

## Understanding the C64 Memory Map

The Commodore 64 has a **64KB address space** ($0000-$FFFF), but with clever memory management:

```
$0000-$00FF: Zero Page (256 bytes) - Fastest memory access
$0100-$01FF: Stack (256 bytes) - System stack area
$0200-$9FFF: RAM (39KB) - User program space
$A000-$BFFF: BASIC ROM or RAM (8KB) - Switchable
$C000-$CFFF: RAM (4KB) - Always available
$D000-$DFFF: I/O Area (4KB) - Hardware registers
$E000-$FFFF: KERNAL ROM (8KB) - Operating system
```

**Key Insight**: Different areas have different performance characteristics and purposes!

## Zero Page: Your Speed Secret

**Zero Page** ($0000-$00FF) is the 6502's secret weapon for speed:

- **Faster access**: 2 cycles vs 3+ cycles for other memory
- **Shorter instructions**: 2 bytes vs 3 bytes
- **More addressing modes**: Special zero page modes available

```text
; Slow: Absolute addressing (3 bytes, 4 cycles)
LDA $1000       ; Load from $1000
STA $1001       ; Store to $1001

; Fast: Zero page addressing (2 bytes, 3 cycles)
LDA $80         ; Load from $80 (zero page)
STA $81         ; Store to $81 (zero page)
```

<CodeRunner 
  system="commodore-64"
  title="Zero Page Speed Advantage"
  code="; Store frequently used data in Zero Page for speed
LDA #$42        ; Load 'B'
STA $80         ; Store in Zero Page (fast)

LDA #$48        ; Load 'H'  
STA $1000       ; Store in regular RAM (slower)

; Access Zero Page data (faster)
LDA $80         ; Quick zero page access
STA $0400       ; Display on screen"
  language="assembly"
/>

## Memory-Mapped I/O Registers

The **I/O area** ($D000-$DFFF) contains hardware control registers:

### Important I/O Registers

| Address | Register | Purpose |
|---------|----------|---------|
| **$D020** | Border Color | Screen border colour (0-15) |
| **$D021** | Background Color | Screen background colour |
| **$D800** | Color RAM | Character colour memory |
| **$DC00** | CIA1 Data A | Keyboard/joystick input |
| **$DD00** | CIA2 Data A | Serial port, memory banking |

```text
; Hardware control examples
LDA #$02        ; Red colour
STA $D020       ; Set border to red
STA $D021       ; Set background to red

LDA #$01        ; White colour
STA $D800       ; Set character 0 colour to white
```

<CodeRunner 
  system="commodore-64"
  title="Memory-Mapped I/O Control"
  code="; Control hardware through memory-mapped registers
LDA #$06        ; Blue colour
STA $D020       ; Set border colour

LDA #$0E        ; Light blue colour  
STA $D021       ; Set background colour

; Set screen character colors
LDA #$01        ; White
STA $D800       ; Color for screen position 0
STA $D801       ; Color for screen position 1"
  language="assembly"
/>

## Efficient Data Organization

### Structure of Arrays vs Array of Structures

**Array of Structures** (less efficient):
```text
; Player data: X, Y, Score for each player
; Player 0: $A0=X, $A1=Y, $A2=Score
; Player 1: $A3=X, $A4=Y, $A5=Score
LDX #$00        ; Player 0
LDA $A0,X       ; Get Player 0 X (inefficient indexing)
```

**Structure of Arrays** (more efficient):
```text
; Separate arrays for each property
; X positions: $A0, $A1, $A2...
; Y positions: $B0, $B1, $B2...
; Scores: $C0, $C1, $C2...
LDX #$00        ; Player index
LDA $A0,X       ; Get X position (efficient indexing)
LDA $B0,X       ; Get Y position (efficient indexing)
```

<CodeRunner 
  system="commodore-64"
  title="Efficient Data Organization"
  code="; Structure of Arrays approach
; Setup player X positions
LDA #$10        ; Player 0 X position
STA $A0
LDA #$20        ; Player 1 X position  
STA $A1

; Setup player Y positions
LDA #$05        ; Player 0 Y position
STA $B0
LDA #$0A        ; Player 1 Y position
STA $B1

; Access player 1 data efficiently
LDX #$01        ; Player 1 index
LDA $A0,X       ; Get X position (indexed)
STA $80         ; Store for use
LDA $B0,X       ; Get Y position (indexed)
STA $81         ; Store for use"
  language="assembly"
/>

## Data Alignment and Packing

### Page Boundary Optimization

**Page boundaries** matter for performance. Crossing a page boundary adds CPU cycles:

```text
; Bad: Data crosses page boundary
.org $80FF
DataTable:
    .byte $01, $02, $03, $04  ; Crosses from $80FF to $8102

; Good: Data aligned to page boundary
.org $8100
DataTable:
    .byte $01, $02, $03, $04  ; All in same page
```

### Bit Packing for Compact Data

Pack multiple boolean values into single bytes:

```text
; Pack 8 boolean flags into one byte
; Bit 0: Player alive
; Bit 1: Player has key
; Bit 2: Player can jump
; etc.

; Set flags
LDA #%00000001  ; Player alive
ORA #%00000010  ; Player has key  
STA $90         ; Store packed flags

; Test flags
LDA $90         ; Load packed flags
AND #%00000001  ; Test alive flag
BEQ PlayerDead  ; Branch if not alive
```

<CodeRunner 
  system="commodore-64"
  title="Bit Packing for Compact Data"
  code="; Pack multiple game states into single bytes
; Setup player flags
LDA #%00000001  ; Bit 0: Alive
ORA #%00000100  ; Bit 2: Has weapon
ORA #%00010000  ; Bit 4: Invulnerable  
STA $90         ; Store all flags in one byte

; Test specific flag
LDA $90         ; Load flags
AND #%00000100  ; Test weapon flag (bit 2)
BEQ NoWeapon    ; Branch if no weapon
; Player has weapon
LDA #$57        ; 'W' for Weapon
STA $0400       ; Display
JMP Continue

NoWeapon:
LDA #$4E        ; 'N' for No weapon
STA $0400       ; Display

Continue:"
  language="assembly"
/>

## Performance Optimization Techniques

### Minimize Memory Accesses

```text
; Slow: Multiple memory accesses
LDA $80         ; Load value
ADC #$01        ; Add 1
STA $80         ; Store back
LDA $80         ; Load again (redundant!)
STA $0400       ; Display

; Fast: Keep value in register
LDA $80         ; Load once
ADC #$01        ; Add 1
STA $80         ; Store back
STA $0400       ; Display (A still contains value)
```

### Use Appropriate Addressing Modes

```text
; Slower: Absolute addressing for local data
LDA $0080       ; 3 bytes, 4 cycles
STA $0081       ; 3 bytes, 4 cycles

; Faster: Zero page addressing  
LDA $80         ; 2 bytes, 3 cycles
STA $81         ; 2 bytes, 3 cycles

; Even faster: Immediate when possible
LDA #$42        ; 2 bytes, 2 cycles (for constants)
```

<CodeRunner 
  system="commodore-64"
  title="Addressing Mode Optimization"
  code="; Demonstrate different addressing mode speeds
; Setup test data
LDA #$41        ; 'A' - immediate (fastest for constants)
STA $80         ; Zero page store (fast)

; Efficient operations using optimal addressing
LDA $80         ; Zero page load (fast)
ADC #$01        ; Immediate add (fast)  
STA $81         ; Zero page store (fast)

; Display result
LDA $81         ; Keep using zero page
STA $0400       ; Display 'B' (A+1)"
  language="assembly"
/>

## Loop Optimization Strategies

### Count Down Instead of Up

```text
; Slower: Count up (requires comparison)
LDX #$00        ; Start at 0
Loop1:
    ; Process data
    INX             ; Increment
    CPX #$10        ; Compare with end value
    BNE Loop1       ; Branch if not equal

; Faster: Count down (automatic zero flag)
LDX #$10        ; Start at end value
Loop2:
    ; Process data  
    DEX             ; Decrement (sets flags automatically)
    BNE Loop2       ; Branch if not zero (faster)
```

### Unroll Critical Loops

```text
; Normal loop (flexible but slower)
LDX #$04        ; 4 iterations
Loop:
    LDA #$2A        ; '*'
    STA $0400,X     ; Display
    DEX
    BNE Loop

; Unrolled loop (faster but larger)
LDA #$2A        ; '*'
STA $0404       ; Position 4
STA $0403       ; Position 3  
STA $0402       ; Position 2
STA $0401       ; Position 1
STA $0400       ; Position 0
; No loop overhead!
```

<CodeRunner 
  system="commodore-64"
  title="Loop Optimization Techniques"
  code="; Optimized countdown loop
LDX #$05        ; Start from 5
CountLoop:
    TXA         ; Transfer X to A
    CLC
    ADC #$30    ; Convert to ASCII ('0' + number)
    STA $0400,X ; Display at position X
    DEX         ; Decrement (sets zero flag automatically)
    BNE CountLoop ; Branch if not zero (efficient test)

; Result: Displays numbers 54321 at positions"
  language="assembly"
/>

## Memory Management Strategies

### Dynamic Data Allocation

Create a simple memory manager:

```text
; Memory manager variables
MemoryFree = $F0    ; Pointer to next free memory
MemoryEnd  = $F2    ; Pointer to end of available memory

; Initialize memory manager
InitMemory:
    LDA #$00        ; Start of available memory (low)
    STA MemoryFree
    LDA #$C0        ; Start of available memory (high)
    STA MemoryFree+1
    
    LDA #$00        ; End of available memory (low)
    STA MemoryEnd
    LDA #$D0        ; End of available memory (high)
    STA MemoryEnd+1
    RTS

; Allocate memory block
; Input: A = size needed
; Output: $FE/$FF = pointer to allocated memory
AllocateMemory:
    ; Check if enough memory available
    ; (Simplified - real implementation would be more complex)
    LDY #$00
    LDA (MemoryFree),Y  ; Get current free address
    STA $FE             ; Return address to caller
    LDA MemoryFree+1
    STA $FF
    
    ; Advance free pointer (simplified)
    CLC
    LDA MemoryFree
    ADC #$10            ; Allocate 16 bytes
    STA MemoryFree
    BCC NoCarry
    INC MemoryFree+1
NoCarry:
    RTS
```

## Performance Measurement

### Cycle Counting

Different instructions take different numbers of CPU cycles:

| Instruction | Cycles | Notes |
|-------------|--------|-------|
| `LDA #$nn` | 2 | Immediate fastest |
| `LDA $nn` | 3 | Zero page |
| `LDA $nnnn` | 4 | Absolute |
| `LDA $nnnn,X` | 4+ | +1 if page crossed |
| `BNE label` | 2-3 | +1 if branch taken |

### Timing Critical Code

```text
; Time-critical display routine
FastDisplay:
    ; Save registers (if needed)
    PHA             ; 3 cycles
    
    ; Critical section (minimize cycles)
    LDA $80         ; 3 cycles - zero page
    STA $0400       ; 4 cycles - absolute
    
    ; Restore registers
    PLA             ; 4 cycles
    RTS             ; 6 cycles
    ; Total: ~20 cycles
```

## Practice Exercise

Create an optimised sprite movement system that:

1. Uses zero page for sprite coordinates
2. Implements efficient boundary checking
3. Uses bit manipulation for sprite flags
4. Demonstrates performance optimisation techniques

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Optimized Sprite System"
  code="; Optimized sprite system using advanced techniques
; Zero page variables for speed
SpriteX     = $80    ; X position (zero page for speed)
SpriteY     = $81    ; Y position  
SpriteFlags = $82    ; Packed flags (bit 0: active, bit 1: moving right)

; Initialize sprite
InitSprite:
    LDA #$14        ; Starting X position (20)
    STA SpriteX
    LDA #$0C        ; Starting Y position (12)
    STA SpriteY
    LDA #%00000011  ; Active + moving right
    STA SpriteFlags
    RTS

; Optimized sprite update (performance critical)
UpdateSprite:
    ; Check if sprite is active (bit test)
    LDA SpriteFlags
    AND #%00000001  ; Test active flag
    BEQ InactiveSprite
    
    ; Update X position based on direction
    LDA SpriteFlags
    AND #%00000010  ; Test direction flag  
    BEQ MoveLeft
    
MoveRight:
    LDA SpriteX     ; Zero page access (fast)
    CLC
    ADC #$01        ; Move right
    CMP #$27        ; Check right boundary (39)
    BCC StoreX      ; If less than 39, store
    LDA #%00000001  ; Reverse direction (clear bit 1)
    STA SpriteFlags
    JMP MoveLeft
    
MoveLeft:
    LDA SpriteX
    SEC
    SBC #$01        ; Move left
    BPL StoreX      ; If positive, store
    LDA #%00000011  ; Reverse direction (set bit 1)
    STA SpriteFlags
    LDA #$01        ; Minimum X
    
StoreX:
    STA SpriteX     ; Store new position
    
    ; Display sprite at current position
    LDY SpriteY     ; Load Y (could optimise with screen calculation)
    LDX SpriteX     ; Load X
    LDA #$2A        ; '*' character
    STA $0400,X     ; Display (simplified - real version would calculate screen offset)
    
InactiveSprite:
    RTS

; Call the system
JSR InitSprite
JSR UpdateSprite"
  language="assembly"
/>

## Memory Access Patterns

### Cache-Friendly Programming

Even on the 6502, memory access patterns matter:

```text
; Bad: Random memory access
LDA $80
LDA $200
LDA $81
LDA $300

; Good: Sequential memory access  
LDA $80
LDA $81
LDA $82
LDA $83
```

### Minimize Page Boundary Crossings

```text
; Risky: Might cross page boundary
LDX #$FF
LDA $0400,X     ; Accesses $04FF, might cross to $0500

; Safe: Ensure single page access
LDX #$28        ; One screen row (40)
LDA $0400,X     ; Accesses $0428, stays in same region
```

## Advanced Optimization Tips

1. **Use immediate addressing** for constants
2. **Prefer zero page** for frequently accessed variables  
3. **Count down in loops** to save comparison instructions
4. **Pack boolean flags** into single bytes using bit operations
5. **Minimize memory accesses** by keeping values in registers
6. **Align data structures** to avoid page boundary crossings
7. **Unroll critical loops** where code size allows
8. **Use appropriate addressing modes** for each situation

## What You've Learned

In this lesson, you've mastered:

- C64 memory map and the importance of different memory areas
- Zero page optimisation for maximum speed
- Memory-mapped I/O for hardware control
- Efficient data organisation and structure design
- Performance optimisation techniques and cycle counting
- Advanced memory management strategies
- Professional-level assembly programming practices

## Looking Ahead

In the next lesson, you'll learn about **interrupts and system programming** - how to work with the C64's operating system, handle time-critical events, and create system-level programs that interact with hardware at the deepest level.

## Fun Fact

The optimisation techniques you've learned aren't just historical curiosities - they're still relevant today! Modern CPUs have cache hierarchies that make memory access patterns matter enormously. Game engines, operating systems, and high-performance applications all use the same fundamental principles you've just mastered: keep frequently accessed data close together, minimize memory accesses, and understand your hardware. You're learning optimisation skills that scale from 8-bit to 64-bit and beyond!