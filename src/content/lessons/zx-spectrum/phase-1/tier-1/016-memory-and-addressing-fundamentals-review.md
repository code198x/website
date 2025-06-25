---
title: "Memory and Addressing Fundamentals Review"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 16
description: "Comprehensive review of memory addressing concepts learned so far. Reinforce understanding of addressing modes, screen memory, data structures, and practical applications."
learning_objectives:
  - "Review and reinforce all addressing mode concepts"
  - "Practice complex memory manipulation scenarios"
  - "Integrate screen memory with data structures"
  - "Solve challenging addressing problems"
  - "Prepare for advanced program flow concepts"
concepts:
  - "Direct vs indirect addressing review"
  - "Indexed addressing mastery"
  - "Screen memory integration"
  - "Data structure optimization"
  - "Memory layout planning"
estimated_duration: "40-50 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 16
---

# Lesson 16: Memory and Addressing Fundamentals Review

You've learned a tremendous amount about memory addressing over the past several lessons. This review will consolidate your knowledge, challenge your understanding, and prepare you for the advanced program flow concepts ahead.

## Addressing Modes Summary

### The Three Core Addressing Modes

**1. Direct (Absolute) Addressing**
```text
LD A, ($5000)       ; Load from specific address $5000
LD ($5001), A       ; Store to specific address $5001
```
- **Use when**: You know the exact memory address
- **Advantages**: Simple, direct access
- **Disadvantages**: Fixed addresses, not flexible

**2. Indirect Addressing**
```text
LD HL, $5000        ; Point HL to address
LD A, (HL)          ; Load from address HL points to
LD (HL), A          ; Store to address HL points to
```
- **Use when**: Working with sequential data, strings, buffers
- **Advantages**: Flexible, pointer can change
- **Disadvantages**: Only one base address at a time

**3. Indexed Addressing**
```text
LD IX, $5000        ; Set base address
LD A, (IX+5)        ; Load from base + 5
LD (IX-2), A        ; Store to base - 2
```
- **Use when**: Arrays, structures, tables with offsets
- **Advantages**: Multiple offsets from same base, negative offsets
- **Disadvantages**: Slightly more complex syntax

**Addressing Modes Comparison:**

```assembly
; Demonstrate all three addressing modes working together
; Set up test data area
LD HL, $6000        ; Use $6000 as our data area

; Initialize some test data using direct addressing
LD ($6000), 100     ; Direct: store 100 at $6000
LD ($6001), 200     ; Direct: store 200 at $6001
LD ($6002), 150     ; Direct: store 150 at $6002

; Use indirect addressing to read sequentially
LD HL, $6000        ; Point to start of data
LD A, (HL)          ; A = 100 (first value)
INC HL              ; Move to next
LD B, (HL)          ; B = 200 (second value)
INC HL              ; Move to next  
LD C, (HL)          ; C = 150 (third value)

; Use indexed addressing to access same data
LD IX, $6000        ; Set base address
LD D, (IX+0)        ; D = 100 (same as first)
LD E, (IX+1)        ; E = 200 (same as second)
LD H, (IX+2)        ; H = 150 (same as third)

; All three methods accessed the same data!
; A=D=100, B=E=200, C=H=150
```

## Screen Memory Mastery Review

### The ZX Spectrum Screen Layout Recap

```
Memory Layout:
$4000-$47FF: Top third (rows 0-7)
$4800-$4FFF: Middle third (rows 8-15)  
$5000-$57FF: Bottom third (rows 16-23)
$5800-$5AFF: Attribute memory (colors)
```

### Screen Address Calculation Challenges

**Challenge 1: Draw a diagonal line from top-left to bottom-right**

```text
DrawDiagonal:
    LD B, 24            ; 24 character rows
    LD A, 0             ; Starting column
    
DiagonalLoop:
    PUSH AF             ; Save column
    PUSH BC             ; Save row counter
    
    ; Calculate screen address for row B-1, column A
    LD C, A             ; Column in C
    LD A, B             ; Row in A
    DEC A               ; Convert to 0-based
    CALL CalcScreenAddr ; Calculate address in HL
    
    ; Draw pixel pattern at this position
    LD (HL), %10000000  ; Single pixel pattern
    
    POP BC              ; Restore row counter
    POP AF              ; Restore column
    INC A               ; Next column
    DJNZ DiagonalLoop   ; Continue for all rows
    RET

CalcScreenAddr:
    ; Input: A = row (0-23), C = column (0-31)
    ; Output: HL = screen address
    ; ... complex calculation here ...
    RET
```

**Screen Memory Challenge:**

```assembly
; Create a pattern across all three screen thirds
; Draw one pixel in each character position of top row

; Top third - row 0
LD HL, $4000        ; Start of top third
LD B, 32            ; 32 characters across
LD A, %10000000     ; Single pixel pattern
TopRowLoop:
    LD (HL), A      ; Draw pixel
    INC HL          ; Next character position
    DJNZ TopRowLoop

; Middle third - row 8 (first row of middle third)  
LD HL, $4800        ; Start of middle third
LD B, 32            ; 32 characters across
LD A, %01000000     ; Different pixel pattern
MiddleRowLoop:
    LD (HL), A      ; Draw pixel
    INC HL          ; Next character position
    DJNZ MiddleRowLoop

; Bottom third - row 16 (first row of bottom third)
LD HL, $5000        ; Start of bottom third
LD B, 32            ; 32 characters across  
LD A, %00100000     ; Third pixel pattern
BottomRowLoop:
    LD (HL), A      ; Draw pixel
    INC HL          ; Next character position
    DJNZ BottomRowLoop

; Now set colors for all these pixels
LD HL, $5800        ; Start of attributes
LD DE, $5801        ; Next attribute
LD BC, 767          ; 768-1 attributes
LD (HL), %00000111  ; White ink on black paper
LDIR                ; Fill all attributes
```

## Data Structure Integration

### Combining Multiple Addressing Modes

**Scenario: Sprite System with Animation**

```text
; Sprite data structure (using multiple addressing modes)
SpriteSystem:
    ; Sprite positions (direct addressing for globals)
    SpriteCount:    DB 5
    ActiveSprites:  DB 3
    
    ; Sprite data array (indexed addressing)
    SpriteData:
        ; Sprite 0: X, Y, Frame, Type
        DB 50, 30, 0, 1
        ; Sprite 1: X, Y, Frame, Type  
        DB 100, 60, 1, 2
        ; Sprite 2: X, Y, Frame, Type
        DB 150, 90, 0, 1
        ; ... more sprites ...
    
    ; Animation frames (indirect addressing for sequential access)
    AnimFrames:
        ; Type 1 animations
        DB %00111100, %01111110, %11111111, %01111110
        ; Type 2 animations  
        DB %11110000, %11111100, %11111110, %11111100

UpdateSprites:
    LD A, (ActiveSprites)   ; Direct: get sprite count
    LD B, A                 ; B = number of sprites to update
    LD IX, SpriteData       ; Indexed: point to sprite array
    
SpriteLoop:
    ; Get sprite position using indexed addressing
    LD A, (IX+0)            ; X position
    LD C, (IX+1)            ; Y position
    LD D, (IX+2)            ; Animation frame
    LD E, (IX+3)            ; Sprite type
    
    ; Update sprite at position C (X), D (Y)
    CALL UpdateSingleSprite
    
    ; Move to next sprite (4 bytes per sprite)
    LD DE, 4
    ADD IX, DE
    
    DJNZ SpriteLoop
    RET
```

**Integrated Data Structure Demo:**

```assembly
; Game entity system combining all addressing modes
; Game state (direct addressing)
PlayerScore:    DW 1000
PlayerLives:    DB 3
GameLevel:      DB 1

; Entity array (indexed addressing) - 5 bytes per entity
EntityArray:
    ; Entity 0: Type, X, Y, Health, Status
    DB 1, 50, 30, 5, 1      ; Player
    DB 2, 100, 60, 3, 1     ; Enemy 1
    DB 2, 150, 90, 3, 1     ; Enemy 2
    DB 3, 75, 45, 1, 1      ; Powerup

; Entity behavior table (indirect addressing)
BehaviorTable:
    DW PlayerBehavior       ; Type 1 = Player
    DW EnemyBehavior        ; Type 2 = Enemy  
    DW PowerupBehavior      ; Type 3 = Powerup

; Update all active entities
UpdateEntities:
    LD IX, EntityArray      ; Point to entity array
    LD B, 4                 ; 4 entities to check
    
EntityLoop:
    LD A, (IX+4)            ; Get status (offset 4)
    OR A                    ; Check if active (non-zero)
    JR Z, NextEntity        ; Skip if inactive
    
    ; Entity is active - process it
    LD A, (IX+0)            ; Get entity type
    DEC A                   ; Convert to 0-based index
    SLA A                   ; × 2 (2 bytes per address)
    LD HL, BehaviorTable    ; Point to behavior table
    LD C, A : LD B, 0
    ADD HL, BC              ; Point to correct behavior
    
    ; Get behavior address using indirect addressing
    LD A, (HL)              ; Low byte of behavior address
    INC HL
    LD H, (HL)              ; High byte
    LD L, A                 ; HL = behavior routine address
    
    ; Call behavior routine (would be CALL (HL) if supported)
    ; For demo, just modify entity position
    INC (IX+1)              ; Move X position right
    
NextEntity:
    LD DE, 5                ; Move to next entity (5 bytes)
    ADD IX, DE
    DJNZ EntityLoop
    RET

PlayerBehavior:
    ; Player behavior code would go here
    RET
    
EnemyBehavior:
    ; Enemy behavior code would go here  
    RET
    
PowerupBehavior:
    ; Powerup behavior code would go here
    RET
```

## Advanced Memory Patterns

### Circular Buffers with Addressing

```text
; Sound effect buffer using circular addressing
SoundBuffer:
    DB 16               ; Buffer size
    DB 0                ; Write pointer
    DB 0                ; Read pointer
    DS 16               ; Sound data

AddSound:
    ; Input: A = sound effect number
    LD HL, SoundBuffer + 1  ; Point to write pointer
    LD B, (HL)              ; Get current write position
    
    ; Calculate buffer address using indexed addressing
    LD IX, SoundBuffer + 3  ; Point to buffer data
    LD C, B                 ; Write position as offset
    LD (IX + C), A          ; Store sound effect
    
    ; Update write pointer with wraparound
    INC B                   ; Next position
    LD A, B
    CP 16                   ; Check if at end
    JR C, WriteOK
    LD B, 0                 ; Wrap to beginning
WriteOK:
    LD (HL), B              ; Store updated write pointer
    RET
```

### Memory Pool Management

```text
; Simple memory pool for temporary objects
MemoryPool:
    DW $7000            ; Base address of pool
    DW $8000            ; End address of pool  
    DW $7000            ; Current allocation pointer

AllocateMemory:
    ; Input: BC = bytes needed
    ; Output: HL = allocated address, or 0 if failed
    LD HL, (MemoryPool + 4) ; Get current pointer
    LD DE, HL               ; Save start address
    ADD HL, BC              ; Add requested size
    
    ; Check if allocation would exceed pool
    LD BC, (MemoryPool + 2) ; Get pool end
    OR A                    ; Clear carry
    SBC HL, BC              ; Compare with end
    ADD HL, BC              ; Restore HL
    JR NC, AllocFailed      ; Jump if would exceed
    
    ; Allocation successful
    LD (MemoryPool + 4), HL ; Update allocation pointer
    LD HL, DE               ; Return start address
    RET
    
AllocFailed:
    LD HL, 0                ; Return null pointer
    RET
```

## Performance Optimization Review

### Addressing Mode Performance

**Speed Comparison (approximate Z80 cycles):**
```text
LD A, ($5000)       ; Direct: 13 cycles
LD A, (HL)          ; Indirect: 7 cycles  
LD A, (IX+5)        ; Indexed: 19 cycles
```

**Memory Usage Comparison:**
```text
LD A, ($5000)       ; Direct: 3 bytes
LD A, (HL)          ; Indirect: 1 byte
LD A, (IX+5)        ; Indexed: 3 bytes
```

### Optimization Strategies

1. **Use indirect addressing for sequential access**
2. **Use indexed addressing for structured data**
3. **Use direct addressing for frequently accessed globals**
4. **Cache frequently used addresses in registers**

**Performance Optimization Example:**

```assembly
; Optimized vs unoptimized data access
; UNOPTIMIZED: Multiple direct memory accesses
SlowDataAccess:
    LD A, ($6000)       ; Get X position
    ADD A, 5            ; Move right
    LD ($6000), A       ; Store X position
    
    LD A, ($6001)       ; Get Y position  
    ADD A, 2            ; Move down
    LD ($6001), A       ; Store Y position
    
    LD A, ($6002)       ; Get health
    DEC A               ; Reduce health
    LD ($6002), A       ; Store health
    RET

; OPTIMIZED: Use indexed addressing for structure
FastDataAccess:
    LD IX, $6000        ; Point to data structure once
    
    LD A, (IX+0)        ; Get X position
    ADD A, 5            ; Move right
    LD (IX+0), A        ; Store X position
    
    LD A, (IX+1)        ; Get Y position
    ADD A, 2            ; Move down  
    LD (IX+1), A        ; Store Y position
    
    LD A, (IX+2)        ; Get health
    DEC A               ; Reduce health
    LD (IX+2), A        ; Store health
    RET

; EVEN MORE OPTIMIZED: Cache in registers
VeryFastDataAccess:
    LD IX, $6000        ; Point to structure
    LD A, (IX+0)        ; Get X
    LD B, (IX+1)        ; Get Y  
    LD C, (IX+2)        ; Get health
    
    ; Modify in registers (very fast)
    ADD A, 5            ; Update X
    ADD B, 2            ; Update Y
    DEC C               ; Update health
    
    ; Store back once
    LD (IX+0), A        ; Store X
    LD (IX+1), B        ; Store Y
    LD (IX+2), C        ; Store health
    RET
```

## Complex Challenge Problems

### Challenge 1: Dynamic Screen Layout

Create a routine that:
1. Manages multiple screen areas with different update frequencies
2. Uses indexed addressing for area definitions
3. Implements dirty region tracking
4. Optimizes screen updates based on changes

### Challenge 2: Memory-Mapped Game Board

Design a system that:
1. Represents a game board in memory
2. Uses 2D array addressing for board access
3. Implements efficient collision detection
4. Manages board animations with minimal memory

### Challenge 3: Multi-Buffer Graphics

Implement:
1. Double-buffered graphics system
2. Efficient buffer swapping
3. Selective region updates
4. Memory-efficient sprite layering

## Practice Integration Exercise

Create a complete mini-system that demonstrates mastery of all addressing concepts:

**Master Integration Exercise:**

```assembly
; Complete system demonstrating all addressing modes
; System: Simple particle effect manager

; Particle structure: X, Y, VX, VY, Life, Type (6 bytes each)
ParticleArray:
    DS 60               ; Space for 10 particles (10 × 6 bytes)

; System state (direct addressing)
ParticleCount:  DB 0    ; Number of active particles
MaxParticles:   DB 10   ; Maximum particles

; Type behavior data (table lookup)
ParticleTypes:
    ; Type 0: Slow fade
    DB 1, 0, 5          ; VX delta, VY delta, life reduction
    ; Type 1: Fast sparkle  
    DB 2, -1, 3         ; VX delta, VY delta, life reduction

; Add new particle
AddParticle:
    ; Input: A=X, B=Y, C=Type
    LD HL, ParticleCount
    LD D, (HL)          ; Get current count
    LD A, (MaxParticles)
    CP D                ; Check if room for more
    RET Z               ; Return if full
    
    ; Find particle slot using indexed addressing
    LD IX, ParticleArray
    LD A, D             ; Current count = index of new particle
    ; Multiply by 6 (6 bytes per particle)
    LD H, A
    SLA A : SLA A       ; × 4
    ADD A, H : ADD A, H ; Add 2 more × original = × 6
    LD H, 0 : LD L, A   ; HL = offset
    ADD IX, HL          ; IX points to new particle slot
    
    ; Initialize particle using indexed addressing
    LD (IX+0), A        ; X position
    LD (IX+1), B        ; Y position  
    LD (IX+2), 0        ; VX (initially 0)
    LD (IX+3), 0        ; VY (initially 0)
    LD (IX+4), 100      ; Life (100 frames)
    LD (IX+5), C        ; Type
    
    ; Increment particle count
    LD HL, ParticleCount
    INC (HL)
    RET

; Update all particles
UpdateParticles:
    LD A, (ParticleCount)
    OR A
    RET Z               ; Return if no particles
    
    LD B, A             ; B = particle count
    LD IX, ParticleArray ; Start of particle array
    
ParticleLoop:
    LD A, (IX+4)        ; Get particle life
    OR A
    JR Z, NextParticle  ; Skip if dead
    
    ; Update particle position
    LD A, (IX+0)        ; Get X
    ADD A, (IX+2)       ; Add VX
    LD (IX+0), A        ; Store new X
    
    LD A, (IX+1)        ; Get Y
    ADD A, (IX+3)       ; Add VY  
    LD (IX+1), A        ; Store new Y
    
    ; Update life
    DEC (IX+4)          ; Reduce life
    
    ; Apply type-specific behavior using table lookup
    LD A, (IX+5)        ; Get particle type
    LD HL, ParticleTypes
    ; Calculate offset (3 bytes per type)
    LD D, A
    SLA A               ; × 2
    ADD A, D            ; × 3
    LD D, 0 : LD E, A
    ADD HL, DE          ; Point to type data
    
    ; Apply type behavior (indirect addressing)
    LD A, (HL)          ; Get VX delta
    ADD A, (IX+2)       ; Add to current VX
    LD (IX+2), A        ; Store new VX
    
    INC HL
    LD A, (HL)          ; Get VY delta
    ADD A, (IX+3)       ; Add to current VY
    LD (IX+3), A        ; Store new VY
    
NextParticle:
    LD DE, 6            ; Move to next particle (6 bytes)
    ADD IX, DE
    DJNZ ParticleLoop
    RET

; This system demonstrates:
; - Direct addressing for global state
; - Indexed addressing for particle array
; - Indirect addressing for type behaviors
; - Complex address calculations
; - Efficient memory usage patterns
```

## Key Takeaways

### When to Use Each Addressing Mode

**Direct Addressing**: Global variables, configuration data, single values
**Indirect Addressing**: Sequential data, strings, buffers, copying operations  
**Indexed Addressing**: Arrays, structures, tables, multi-dimensional data

### Memory Organization Principles

1. **Group related data together** for cache efficiency
2. **Use consistent structure sizes** for easy indexing
3. **Plan for growth** - reserve space for expansion
4. **Optimize for access patterns** - consider how data will be used

### Performance Guidelines

1. **Cache frequently used addresses** in registers
2. **Use the most appropriate addressing mode** for each situation
3. **Minimize memory access** when possible
4. **Consider instruction timing** in critical loops

## What You've Mastered

Through this comprehensive review, you've solidified your understanding of:

- All three fundamental addressing modes and their optimal use cases
- Complex screen memory manipulation and address calculations
- Integration of multiple addressing modes in sophisticated systems
- Performance optimization techniques for memory access
- Advanced data organization patterns and memory management
- Real-world application of addressing concepts in game systems

## Looking Ahead

With your memory addressing skills now solid, you're ready to tackle **program flow and logic** - learning how to make your programs make decisions, create loops, and respond dynamically to data and conditions. The addressing skills you've mastered will be essential for the complex control structures ahead!

## Fun Fact

The Z80's rich addressing modes were revolutionary for their time and directly influenced modern processor design. Many of the concepts you've learned - indexed addressing, indirect addressing, and structured data access - are fundamental to how modern CPUs, compilers, and programming languages work today. The addressing techniques you've mastered on the ZX Spectrum are essentially the same concepts used in modern systems programming, embedded development, and even high-level language compilers. You're not just learning retro computing - you're learning timeless computer science fundamentals that remain relevant today!