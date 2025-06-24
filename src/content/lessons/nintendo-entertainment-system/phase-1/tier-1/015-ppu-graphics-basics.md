---
title: "PPU (Graphics) Basics"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 15
description: "Discover the NES Picture Processing Unit (PPU) - the graphics powerhouse behind classic games. Learn about pattern tables, name tables, palettes, and how the NES creates its iconic visuals."
learning_objectives:
  - "Understand the NES PPU architecture and capabilities"
  - "Learn about pattern tables and tile-based graphics"
  - "Master name tables and screen layout"
  - "Configure color palettes for graphics"
  - "Write data to PPU memory through registers"
concepts:
  - "PPU (Picture Processing Unit)"
  - "Pattern tables and tiles"
  - "Name tables and screen layout"
  - "Color palettes and attributes"
  - "PPU registers and memory mapping"
estimated_duration: "55-70 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 15
---

# Lesson 15: PPU (Graphics) Basics

Welcome to NES graphics programming! Today you'll learn about the Picture Processing Unit (PPU) - the specialized chip that creates all the visuals in NES games. Understanding the PPU is essential for creating any visual elements in your games.

## What Is the PPU?

The Picture Processing Unit (PPU) is a dedicated graphics processor that:

- Generates the video signal for TV display
- Manages background graphics and sprites
- Handles color palettes and visual effects
- Operates independently from the main 6502 CPU
- Updates the screen 60 times per second

The PPU is what makes games like Super Mario Bros. and The Legend of Zelda visually possible!

## PPU Capabilities and Limitations

**What the PPU Can Do:**
- Display 256x240 pixel resolution
- Show 64 sprites simultaneously (8x8 or 8x16 pixels each)
- Use 4 background palettes + 4 sprite palettes
- Scroll backgrounds smoothly in any direction
- Handle tile-based graphics efficiently

**PPU Limitations:**
- Only 8 sprites per scanline (causes flickering with more)
- Fixed 64-color palette (can't create custom colors)
- Tile-based system (8x8 pixel building blocks)
- Limited video memory (2KB for name tables)

## PPU Memory Map

The PPU has its own separate memory space:

```
$0000-$0FFF : Pattern Table 0 (4KB) - Sprite graphics
$1000-$1FFF : Pattern Table 1 (4KB) - Background graphics  
$2000-$23FF : Name Table 0 (1KB) - Screen layout
$2400-$27FF : Name Table 1 (1KB) - Additional screens
$2800-$2BFF : Name Table 2 (1KB) - Mirror of Name Table 0
$2C00-$2FFF : Name Table 3 (1KB) - Mirror of Name Table 1
$3000-$3EFF : Mirrors of Name Tables
$3F00-$3F1F : Palette RAM (32 bytes) - Color data
$3F20-$3FFF : Mirrors of Palette RAM
```

## PPU Registers

You control the PPU through 8 memory-mapped registers:

```
$2000 : PPU Control - Main PPU configuration
$2001 : PPU Mask - Display settings  
$2002 : PPU Status - PPU state (read-only)
$2003 : OAM Address - Sprite memory address
$2004 : OAM Data - Sprite data
$2005 : PPU Scroll - Background scroll position
$2006 : PPU Address - PPU memory address  
$2007 : PPU Data - PPU memory data
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="PPU Register Access"
  code="; Basic PPU register usage
; Set PPU address to $2000 (name table start)
LDA #$20    ; High byte of address
STA $2006   ; PPU Address register
LDA #$00    ; Low byte of address
STA $2006   ; PPU Address register (now points to $2000)

; Write data to PPU memory
LDA #$01    ; Tile number 1
STA $2007   ; PPU Data register (writes to $2000)
LDA #$02    ; Tile number 2  
STA $2007   ; PPU Data register (writes to $2001, auto-increments)

; PPU memory at $2000 now contains $01, $02"
  language="assembly"
/>

## Pattern Tables - Graphics Data

Pattern tables store the actual graphics data as 8x8 pixel tiles:

- **Pattern Table 0** ($0000-$0FFF): Usually sprite graphics
- **Pattern Table 1** ($1000-$1FFF): Usually background graphics
- Each tile uses 16 bytes (2 bits per pixel, 64 pixels per tile)

### Tile Data Format

Each 8x8 tile needs 16 bytes:
- Bytes 0-7: Bit plane 0 (low bit of color)
- Bytes 8-15: Bit plane 1 (high bit of color)

```
Example tile (letter "A"):
Bit plane 0:    Bit plane 1:    Combined:
..XX....        ........        ..22....
.X..X...        ........        .2..2...
X....X..        ........        2....2..
X....X..        ........        2....2..
XXXXXX..        ........        222222..
X....X..        ........        2....2..
X....X..        ........        2....2..
........        ........        ........
```

## Name Tables - Screen Layout

Name tables define what appears on screen:
- Each name table is 32x30 tiles (960 bytes)
- Each byte represents a tile number from the pattern table
- The PPU reads the name table to know which tiles to display

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Writing to Name Table"
  code="; Write tiles to create a simple pattern
; Set PPU address to name table start ($2000)
LDA #$20
STA $2006   ; PPU Address high
LDA #$00  
STA $2006   ; PPU Address low

; Write a row of tiles
LDX #$00    ; Counter
write_row:
LDA #$01    ; Tile number 1
STA $2007   ; Write to PPU (auto-increments address)
INX
CPX #$20    ; Written 32 tiles (full row)?
BNE write_row

; Top row of screen now shows tile $01 repeated"
  language="assembly"
/>

## Color Palettes

The NES uses palettes to assign colors to graphics:

- **4 Background Palettes**: 4 colors each (16 colors total)
- **4 Sprite Palettes**: 4 colors each (16 colors total)  
- **Universal Background Color**: Shared by all palettes
- **Palette RAM**: Located at PPU addresses $3F00-$3F1F

### Palette Memory Layout
```
$3F00 : Universal background color
$3F01-$3F03 : Background palette 0 (colors 1-3)
$3F04 : Background color (mirror of $3F00)
$3F05-$3F07 : Background palette 1 (colors 1-3)
$3F08 : Background color (mirror of $3F00)
$3F09-$3F0B : Background palette 2 (colors 1-3)
$3F0C : Background color (mirror of $3F00)
$3F0D-$3F0F : Background palette 3 (colors 1-3)
$3F10-$3F1F : Sprite palettes (same layout)
```

## Setting Up a Color Palette

Let's create a simple color palette:

```text
load_palette:
    ; Set PPU address to palette start
    LDA #$3F
    STA $2006   ; PPU Address high
    LDA #$00
    STA $2006   ; PPU Address low
    
    ; Load background palette 0
    LDA #$0F    ; Black (universal background)
    STA $2007
    LDA #$30    ; White  
    STA $2007
    LDA #$12    ; Blue
    STA $2007
    LDA #$16    ; Red
    STA $2007
    
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Loading Color Palette"
  code="; Load a color palette into PPU
JSR load_palette_demo

load_palette_demo:
    ; Set PPU address to palette RAM ($3F00)
    LDA #$3F    ; High byte
    STA $2006   ; PPU Address register
    LDA #$00    ; Low byte
    STA $2006   ; PPU Address register

    ; Load background palette 0 (4 colors)
    LDA #$0F    ; Color 0: Black (background)
    STA $2007   ; Write to palette
    LDA #$30    ; Color 1: White
    STA $2007   ; Write to palette  
    LDA #$02    ; Color 2: Dark blue
    STA $2007   ; Write to palette
    LDA #$16    ; Color 3: Red
    STA $2007   ; Write to palette

    RTS

; Palette is now loaded and ready for use!"
  language="assembly"
/>

## Drawing Your First Graphics

Let's put it all together and draw something on screen:

```text
draw_hello:
    ; Load palette first
    JSR load_palette
    
    ; Set PPU address to center of screen
    LDA #$21    ; Name table address high  
    STA $2006
    LDA #$CA    ; Name table address low (row 10, column 10)
    STA $2006
    
    ; Write "HELLO" using tile numbers
    LDA #$11    ; Tile for 'H'
    STA $2007
    LDA #$0E    ; Tile for 'E'  
    STA $2007
    LDA #$15    ; Tile for 'L'
    STA $2007
    LDA #$15    ; Tile for 'L'
    STA $2007
    LDA #$18    ; Tile for 'O'
    STA $2007
    
    RTS
```

## PPU Control Register ($2000)

The PPU Control register configures major PPU behavior:

```
Bit 7: NMI Enable (0=disable, 1=enable VBlank NMI)
Bit 6: PPU Master/Slave (usually 0)
Bit 5: Sprite Size (0=8x8, 1=8x16)
Bit 4: Background Pattern Table (0=$0000, 1=$1000)
Bit 3: Sprite Pattern Table (0=$0000, 1=$1000, ignored if 8x16)
Bit 2: PPU Address Increment (0=+1, 1=+32)
Bits 1-0: Name Table Select (0=$2000, 1=$2400, 2=$2800, 3=$2C00)
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="PPU Control Configuration"
  code="; Configure PPU Control register
; Enable NMI, use pattern table 1 for background, increment by 1
LDA #%10010000  ; NMI on, background pattern table 1
STA $2000       ; PPU Control register

; Alternative configuration  
; No NMI, 8x16 sprites, increment by 32 (vertical)
LDA #%00100100  ; No NMI, 8x16 sprites, vertical increment
STA $2000       ; PPU Control register

; PPU behavior is now configured"
  language="assembly"
/>

## PPU Mask Register ($2001)

The PPU Mask register controls what gets displayed:

```
Bit 7: Emphasize Blue
Bit 6: Emphasize Green  
Bit 5: Emphasize Red
Bit 4: Show Sprites
Bit 3: Show Background
Bit 2: Show Sprites in Leftmost 8 Pixels
Bit 1: Show Background in Leftmost 8 Pixels
Bit 0: Grayscale Mode
```

## VBlank and PPU Timing

The PPU updates the screen in a specific pattern:
- **Visible Area**: 240 scanlines of actual display
- **VBlank Period**: 20 scanlines when display is off
- **Total**: 262 scanlines per frame, 60 frames per second

You can only safely write to PPU memory during VBlank!

```text
wait_vblank:
    LDA $2002   ; Read PPU Status
    BPL wait_vblank ; Wait until VBlank flag is set
    RTS

; Safe PPU updates during VBlank
vblank_update:
    JSR wait_vblank ; Wait for VBlank
    ; Now safe to update PPU memory
    JSR update_graphics
    RTS
```

## Sprite Symphony Graphics Setup

Let's create graphics setup for our music project:

```text
init_symphony_graphics:
    ; Load musical note palette
    JSR load_music_palette
    
    ; Clear name table
    JSR clear_screen
    
    ; Draw musical staff lines
    JSR draw_staff
    
    ; Setup sprite for note display
    JSR init_note_sprite
    
    RTS

load_music_palette:
    LDA #$3F
    STA $2006
    LDA #$00
    STA $2006
    
    ; Musical theme colors
    LDA #$0F    ; Black background
    STA $2007
    LDA #$30    ; White for staff lines
    STA $2007
    LDA #$16    ; Red for active notes
    STA $2007
    LDA #$12    ; Blue for played notes
    STA $2007
    
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Sprite Symphony Graphics"
  code="; Initialize graphics for Sprite Symphony
JSR init_symphony_graphics_demo

init_symphony_graphics_demo:
    ; Load musical color palette
    LDA #$3F    ; Palette address high
    STA $2006
    LDA #$00    ; Palette address low
    STA $2006
    
    ; Musical color scheme
    LDA #$0F    ; Black background
    STA $2007
    LDA #$30    ; White (staff lines)
    STA $2007
    LDA #$16    ; Red (active notes)
    STA $2007
    LDA #$27    ; Orange (played notes)
    STA $2007
    
    ; Clear screen to black
    LDA #$20    ; Name table start
    STA $2006
    LDA #$00
    STA $2006
    
    LDX #$00    ; Clear counter
clear_screen:
    LDA #$00    ; Empty tile
    STA $2007   ; Write to screen
    INX
    BNE clear_screen ; Clear 256 tiles
    
    RTS

; Graphics system ready for musical display!"
  language="assembly"
/>

## Practical Exercise: Graphics Setup

Create a complete graphics initialization routine that:

1. Loads a 4-color palette (black, white, green, yellow)
2. Clears the entire name table to tile $00
3. Draws a border around the screen using tile $FF
4. Writes "START" in the center using tiles $13,$14,$0A,$15,$14

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Complete Graphics Setup"
  code="; Complete Graphics Setup Exercise
JSR complete_graphics_setup

complete_graphics_setup:
    ; 1. Load 4-color palette
    LDA #$3F    ; Palette address
    STA $2006
    LDA #$00
    STA $2006
    
    LDA #$0F    ; Black background
    STA $2007
    LDA #$30    ; White
    STA $2007
    LDA #$19    ; Green
    STA $2007
    LDA #$28    ; Yellow
    STA $2007
    
    ; 2. Clear entire name table
    LDA #$20    ; Name table start
    STA $2006
    LDA #$00
    STA $2006
    
    LDY #$04    ; 4 pages to clear
    LDX #$00    ; Byte counter
clear_loop:
    LDA #$00    ; Empty tile
    STA $2007   ; Write to name table
    INX
    BNE clear_loop ; 256 bytes per page
    DEY
    BNE clear_loop ; All pages cleared
    
    ; 3. Draw border (top row)
    LDA #$20    ; Top of screen
    STA $2006
    LDA #$00
    STA $2006
    
    LDX #$00
border_top:
    LDA #$FF    ; Border tile
    STA $2007
    INX
    CPX #$20    ; 32 tiles across
    BNE border_top
    
    ; 4. Write \"START\" in center
    LDA #$21    ; Center area
    STA $2006
    LDA #$CB    ; Center position
    STA $2006
    
    LDA #$13    ; 'S' tile
    STA $2007
    LDA #$14    ; 'T' tile
    STA $2007
    LDA #$0A    ; 'A' tile
    STA $2007
    LDA #$15    ; 'R' tile
    STA $2007
    LDA #$14    ; 'T' tile
    STA $2007
    
    RTS

; Graphics setup complete with palette, border, and text!"
  language="assembly"
/>

## PPU Best Practices

1. **Always wait for VBlank**: Never write to PPU during rendering
2. **Disable rendering during setup**: Turn off PPU while loading graphics
3. **Use proper addressing**: Set both high and low bytes of PPU address
4. **Plan your palettes**: Design color schemes before coding
5. **Optimize data transfers**: Batch PPU writes together

## What You've Learned

In this graphics-focused lesson, you've mastered:

- PPU (Picture Processing Unit) architecture and capabilities
- Pattern tables for storing 8x8 tile graphics data
- Name tables for defining screen layout and tile placement
- Color palettes and palette memory organization
- PPU registers for controlling graphics display
- VBlank timing and safe PPU memory access

## Looking Ahead

Next lesson, you'll learn about the sprite system - how to display and animate moving objects like players, enemies, and interactive elements. Sprites are essential for any dynamic game content!

## Fun Fact

The NES PPU was incredibly advanced for 1983! It could display more colors simultaneously than many home computers of the era, and its tile-based system was specifically designed to make games feasible with limited memory. The PPU's architecture influenced game design so much that "tile-based" became the standard for 2D games. Even modern indie games often use tile-based graphics as a deliberate artistic choice, proving that the NES PPU's design principles remain relevant today!