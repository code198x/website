---
title: "Working with Tables and Arrays"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 13
description: "Master data organization with tables and arrays in NES assembly. Learn indexed addressing, data lookup tables, and efficient storage for game graphics, sounds, and level data."
learning_objectives:
  - "Understand arrays and tables in 6502 assembly"
  - "Master indexed addressing modes (absolute,X and absolute,Y)"
  - "Create lookup tables for game data"
  - "Implement efficient data storage and retrieval"
  - "Build foundation for graphics and sound data"
concepts:
  - "Arrays and tables in memory"
  - "Indexed addressing (,X and ,Y)"
  - "Data lookup tables"
  - "Game data organization"
  - "Memory-efficient storage"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 13
---

# Lesson 13: Working with Tables and Arrays

Welcome to organized data! Today you'll learn how to store and access collections of data efficiently - essential for graphics, sounds, levels, and all the content that makes games interesting.

## What Are Arrays and Tables?

In assembly programming, arrays and tables are sequences of data stored in consecutive memory locations. Think of them as lists:

- **Arrays**: Collections of similar data (player scores, enemy positions)
- **Tables**: Lookup data (sprite graphics, sound frequencies, level maps)
- **Both**: Accessed using index registers (X and Y)

## Why Use Tables?

Tables make games possible by storing:
- **Graphics data**: Sprite patterns, tile maps, color palettes
- **Sound data**: Musical notes, sound effect parameters
- **Game data**: Level layouts, enemy patterns, item properties
- **Configuration**: Player stats, weapon data, difficulty settings

## Indexed Addressing Modes

The 6502 provides two indexed addressing modes:

### Absolute,X - Add X to address
```text
LDA $0400,X    ; Load from address $0400 + X
STA $0500,X    ; Store to address $0500 + X
```

### Absolute,Y - Add Y to address  
```text
LDA $0600,Y    ; Load from address $0600 + Y
STA $0700,Y    ; Store to address $0700 + Y
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Basic Indexed Addressing"
  code="; Setup some test data
LDA #$10    ; Value $10
STA $0400   ; Store at $0400 (index 0)
LDA #$20    ; Value $20  
STA $0401   ; Store at $0401 (index 1)
LDA #$30    ; Value $30
STA $0402   ; Store at $0402 (index 2)

; Access data using indexed addressing
LDX #$01    ; Index = 1
LDA $0400,X ; Load from $0400 + 1 = $0401
            ; A now contains $20"
  language="assembly"
/>

## Creating Your First Table

Let's create a table of player health values for different difficulty levels:

```text
; Health table (index 0=easy, 1=normal, 2=hard)
health_table:
    .byte $0F, $0A, $05    ; 15, 10, 5 health points

; Usage:
LDX #$01           ; Select normal difficulty (index 1)
LDA health_table,X ; Load health value (10)
STA player_health  ; Set player health
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Health Difficulty Table"
  code="; Simulate health table data
LDA #$0F    ; Easy health (15)
STA $0500   ; Store at table index 0
LDA #$0A    ; Normal health (10)
STA $0501   ; Store at table index 1  
LDA #$05    ; Hard health (5)
STA $0502   ; Store at table index 2

; Select difficulty level
LDX #$02    ; Choose hard difficulty (index 2)
LDA $0500,X ; Load health from table
STA $0400   ; Store as player health
; Player now has 5 health points"
  language="assembly"
/>

## Sound Frequency Table

Let's create a musical note frequency table for our Sprite Symphony:

```text
; Musical note frequencies (simplified)
note_freq_table:
    .byte $FE, $E2, $CA, $B5    ; C, D, E, F
    .byte $A2, $91, $82, $74    ; G, A, B, C

play_note:
    ; A register contains note number (0-7)
    TAX                 ; Transfer note to X index
    LDA note_freq_table,X ; Get frequency from table
    STA $4002          ; Set APU frequency
    LDA #$01           ; High frequency byte
    STA $4003          ; Complete frequency setting
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Musical Note Frequency Table"
  code="; Setup APU
LDA #$BF    ; Configure pulse wave
STA $4000   ; Pulse 1 control
LDA #$0F    ; Enable APU
STA $4015

; Create note frequency table
LDA #$FE    ; C note frequency
STA $0510   ; Table index 0
LDA #$E2    ; D note frequency
STA $0511   ; Table index 1
LDA #$CA    ; E note frequency  
STA $0512   ; Table index 2
LDA #$A2    ; G note frequency
STA $0513   ; Table index 3

; Play note E (index 2)
LDX #$02    ; Select note E
LDA $0510,X ; Get frequency from table
STA $4002   ; Set pulse 1 frequency
LDA #$01    ; High frequency
STA $4003   ; Complete frequency
; Note E is now playing!"
  language="assembly"
/>

## Multi-Dimensional Tables

You can create tables with multiple pieces of data per entry:

```text
; Enemy data: 3 bytes per enemy (X, Y, Health)
enemy_data:
    .byte $20, $30, $03    ; Enemy 0: X=32, Y=48, Health=3
    .byte $40, $50, $05    ; Enemy 1: X=64, Y=80, Health=5  
    .byte $60, $70, $02    ; Enemy 2: X=96, Y=112, Health=2

get_enemy_x:
    ; A contains enemy number (0-2)
    ASL A           ; Multiply by 2
    ASL A           ; Multiply by 4 (total multiply by 3 is tricky)
    CLC
    ADC enemy_num   ; Add original number (A*3)
    TAX             ; Transfer to X index
    LDA enemy_data,X ; Get X position
    RTS
```

## Sprite Graphics Table

Let's create a table for different sprite graphics:

```text
; Sprite tile numbers for different characters
sprite_tiles:
    .byte $01    ; Player standing
    .byte $02    ; Player walking 1
    .byte $03    ; Player walking 2
    .byte $04    ; Player jumping
    .byte $10    ; Enemy type 1
    .byte $11    ; Enemy type 2
    .byte $20    ; Power-up item
    .byte $21    ; Coin

set_sprite_tile:
    ; A contains sprite type (0-7)
    TAX                ; Transfer to index
    LDA sprite_tiles,X ; Get tile number
    STA $0201         ; Store to sprite tile in OAM
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Sprite Graphics Table"
  code="; Create sprite tile lookup table
LDA #$01    ; Player standing tile
STA $0520   ; Table index 0
LDA #$02    ; Player walking tile
STA $0521   ; Table index 1
LDA #$04    ; Player jumping tile
STA $0522   ; Table index 2
LDA #$10    ; Enemy tile
STA $0523   ; Table index 3
LDA #$20    ; Power-up tile
STA $0524   ; Table index 4

; Set player to jumping sprite (index 2)
LDX #$02    ; Jumping animation
LDA $0520,X ; Get tile from table
STA $0201   ; Store to sprite OAM tile
; Sprite tile is now set to jumping ($04)"
  language="assembly"
/>

## Level Data Tables

Tables are perfect for storing level layouts:

```text
; Simple level row (16 tiles across)
level_1_row_1:
    .byte $00,$00,$00,$00,$00,$00,$00,$00
    .byte $00,$00,$00,$00,$00,$00,$00,$00

level_1_row_2:
    .byte $00,$00,$01,$02,$02,$03,$00,$00
    .byte $00,$00,$01,$02,$02,$03,$00,$00

load_level_tile:
    ; X = tile position (0-15)
    ; Y = row number (0-1)
    CPY #$00
    BEQ row_1
    LDA level_1_row_2,X
    JMP done
row_1:
    LDA level_1_row_1,X
done:
    ; A now contains tile number for position X,Y
    RTS
```

## Using Both X and Y Indexes

You can use both index registers for complex data access:

```text
; Color palette table (4 palettes, 4 colors each)
palette_data:
    .byte $0F,$30,$10,$00    ; Palette 0
    .byte $0F,$2A,$1A,$0A    ; Palette 1  
    .byte $0F,$36,$17,$07    ; Palette 2
    .byte $0F,$30,$21,$11    ; Palette 3

get_palette_color:
    ; X = palette number (0-3)
    ; Y = color number (0-3)
    TXA             ; Get palette number
    ASL A           ; Multiply by 2
    ASL A           ; Multiply by 4 (4 colors per palette)
    STA temp        ; Save palette offset
    TYA             ; Get color number
    CLC
    ADC temp        ; Add to palette offset
    TAX             ; Use as index
    LDA palette_data,X ; Get color value
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Color Palette Table"
  code="; Setup palette data (4 colors per palette)
; Palette 0
LDA #$0F    ; Background color
STA $0530   ; Palette 0, color 0
LDA #$30    ; Color 1
STA $0531   ; Palette 0, color 1
LDA #$10    ; Color 2
STA $0532   ; Palette 0, color 2
LDA #$00    ; Color 3
STA $0533   ; Palette 0, color 3

; Palette 1
LDA #$0F    ; Background color
STA $0534   ; Palette 1, color 0
LDA #$2A    ; Color 1
STA $0535   ; Palette 1, color 1
LDA #$1A    ; Color 2
STA $0536   ; Palette 1, color 2
LDA #$0A    ; Color 3
STA $0537   ; Palette 1, color 3

; Get color 2 from palette 1
LDA #$01    ; Palette 1
ASL A       ; Multiply by 2
ASL A       ; Multiply by 4 (4 colors per palette)
CLC         ; Clear carry
ADC #$02    ; Add color index 2
TAX         ; Use as table index
LDA $0530,X ; Get color from table
STA $0400   ; Store result
; Color $1A retrieved from palette 1, color 2"
  language="assembly"
/>

## Game State Tables

Tables can store complex game state information:

```text
; Player stats table (4 bytes per level)
player_stats:
    ; Level 1: Speed, Jump, Health, Magic
    .byte $02, $04, $10, $00
    ; Level 5: Speed, Jump, Health, Magic  
    .byte $03, $05, $15, $02
    ; Level 10: Speed, Jump, Health, Magic
    .byte $04, $06, $20, $05

load_player_stats:
    ; A contains level number (1, 5, or 10)
    CMP #$01
    BEQ level_1_stats
    CiP #$05  
    BEQ level_5_stats
    ; Must be level 10
    LDX #$08    ; Offset for level 10 data
    JMP load_stats
level_1_stats:
    LDX #$00    ; Offset for level 1 data
    JMP load_stats
level_5_stats:
    LDX #$04    ; Offset for level 5 data
load_stats:
    LDA player_stats,X   ; Speed
    STA player_speed
    LDA player_stats+1,X ; Jump
    STA player_jump
    LDA player_stats+2,X ; Health
    STA player_health
    LDA player_stats+3,X ; Magic
    STA player_magic
    RTS
```

## Table Copying and Initialization

Sometimes you need to copy entire tables:

```text
; Copy 16 bytes from source to destination
copy_table:
    LDX #$00        ; Start index
copy_loop:
    LDA source,X    ; Load from source table
    STA dest,X      ; Store to destination table
    INX             ; Next byte
    CPX #$10        ; Copied 16 bytes?
    BNE copy_loop   ; Continue if not done
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Table Copying"
  code="; Setup source data
LDA #$11
STA $0540   ; Source byte 0
LDA #$22
STA $0541   ; Source byte 1
LDA #$33
STA $0542   ; Source byte 2
LDA #$44
STA $0543   ; Source byte 3

; Copy 4 bytes from $0540 to $0550
LDX #$00    ; Start index
copy_loop:
LDA $0540,X ; Load from source
STA $0550,X ; Store to destination
INX         ; Next byte
CPX #$04    ; Copied 4 bytes?
BNE copy_loop ; Continue if more to copy

; Verify copy worked
LDA $0550   ; Should be $11
LDA $0551   ; Should be $22
LDA $0552   ; Should be $33
LDA $0553   ; Should be $44"
  language="assembly"
/>

## Practical Exercise: Game Item System

Create a complete item system with tables for:

1. Item names (tile graphics)
2. Item effects (health bonus, points, etc.)
3. Item rarity (common, rare, legendary)

Create functions to:
- Look up item graphics
- Apply item effects
- Check item rarity

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Game Item System"
  code="; Item system tables
; Item graphics (tile numbers)
LDA #$30    ; Health potion tile
STA $0560   ; Item 0 graphics
LDA #$31    ; Magic scroll tile
STA $0561   ; Item 1 graphics
LDA #$32    ; Gold coin tile
STA $0562   ; Item 2 graphics
LDA #$33    ; Diamond tile
STA $0563   ; Item 3 graphics

; Item effects (health/points bonus)
LDA #$05    ; Health potion: +5 health
STA $0570   ; Item 0 effect
LDA #$03    ; Magic scroll: +3 magic
STA $0571   ; Item 1 effect
LDA #$10    ; Gold coin: +16 points
STA $0572   ; Item 2 effect
LDA #$50    ; Diamond: +80 points
STA $0573   ; Item 3 effect

; Item rarity (0=common, 1=rare, 2=legendary)
LDA #$00    ; Health potion: common
STA $0580   ; Item 0 rarity
LDA #$01    ; Magic scroll: rare
STA $0581   ; Item 1 rarity
LDA #$00    ; Gold coin: common
STA $0582   ; Item 2 rarity
LDA #$02    ; Diamond: legendary
STA $0583   ; Item 3 rarity

; Test: Get diamond properties (item 3)
LDX #$03    ; Diamond item index

; Get graphics
LDA $0560,X ; Get tile number
STA $0590   ; Store graphics result

; Get effect
LDA $0570,X ; Get effect value
STA $0591   ; Store effect result

; Get rarity
LDA $0580,X ; Get rarity level
STA $0592   ; Store rarity result

; Results: Graphics=$33, Effect=$50, Rarity=$02"
  language="assembly"
/>

## Advanced Table Techniques

**Table bounds checking**:
```text
; Prevent index overflow
CPX #$08        ; Table has 8 entries?
BCC valid_index ; Branch if index < 8
LDX #$07        ; Clamp to maximum index
valid_index:
LDA table,X     ; Safe table access
```

**Calculated table offsets**:
```text
; For tables with entries larger than 1 byte
TXA             ; Get index
ASL A           ; Multiply by 2 for 2-byte entries
TAX             ; Use as table offset
LDA big_table,X ; Get low byte
LDA big_table+1,X ; Get high byte
```

**Table search**:
```text
; Find value in table
LDX #$00        ; Start index
search_loop:
LDA table,X     ; Get table entry
CMP search_val  ; Compare with search value
BEQ found       ; Branch if found
INX             ; Next entry
CPX #$10        ; End of table?
BNE search_loop ; Continue if not end
; Not found
LDX #$FF        ; Return -1 (not found)
found:
; X contains index of found item
```

## What You've Learned

In this data-focused lesson, you've mastered:

- Arrays and tables for organizing game data
- Indexed addressing modes (,X and ,Y) for efficient data access
- Creating lookup tables for graphics, sounds, and game properties
- Multi-dimensional data structures
- Table copying and manipulation techniques
- Building complex game systems with organized data

## Looking Ahead

Next lesson, you'll learn about NES system initialization - how to properly start up the console, configure the hardware, and prepare for game programming. You'll discover the boot process and essential setup routines!

## Fun Fact

The NES's limited 2KB of RAM made efficient data organization crucial. Professional game developers became masters of table compression - techniques like run-length encoding for level data, shared graphics between similar sprites, and clever indexing schemes to pack maximum content into minimum space. Some games stored entire level maps in just a few hundred bytes by using smart table structures and compression algorithms! The constraints of the NES pushed programmers to develop data organization skills that are still valuable in modern game development.