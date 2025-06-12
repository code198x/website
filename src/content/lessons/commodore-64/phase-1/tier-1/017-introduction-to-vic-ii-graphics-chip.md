---
title: "Introduction to VIC-II Graphics Chip"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 17
description: "Master the VIC-II graphics chip - the heart of C64 visual capabilities. Learn memory-mapped graphics control, screen modes, and the foundation of all C64 graphics programming."
learning_objectives:
  - "Understand VIC-II architecture and capabilities"
  - "Master VIC-II register programming and memory mapping"
  - "Learn screen memory organization and control"
  - "Practice basic graphics operations and effects"
  - "Build foundation for advanced graphics programming"
concepts:
  - "VIC-II graphics chip architecture"
  - "Memory-mapped graphics registers ($D000-$D3FF)"
  - "Screen memory and character ROM"
  - "Color RAM and palette control"
  - "Basic graphics effects and timing"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 17
---

# Lesson 17: Introduction to VIC-II Graphics Chip

Welcome to graphics programming! Today you'll meet the **VIC-II** (Video Interface Chip II) - the powerful graphics processor that makes the C64's visual magic possible. Understanding the VIC-II is your gateway to sprites, advanced graphics, and visual effects.

## What Is the VIC-II?

The **VIC-II** is a dedicated graphics chip that handles all visual output on the C64:

- **Independent processor**: Works alongside the 6502 CPU
- **Memory-mapped control**: Programmed through memory addresses $D000-$D3FF
- **Multiple display modes**: Text, bitmap, multicolor, sprites
- **Hardware acceleration**: Automatic display generation and effects
- **Real-time operation**: Updates display 60 times per second

Think of the VIC-II as a specialized computer just for graphics - you program it by writing to its memory-mapped registers, and it handles the complex task of generating video signals.

## VIC-II Architecture Overview

The VIC-II manages several key components:

```
┌─────────────────────────────────────────┐
│                VIC-II                   │
├─────────────────────────────────────────┤
│ • Screen Memory Control                 │
│ • Character/Bitmap Generation           │
│ • Color Processing                      │
│ • Sprite Engine (8 hardware sprites)   │
│ • Raster Beam Control                  │
│ • Memory Banking                        │
└─────────────────────────────────────────┘
         ↓
   Video Output (TV/Monitor)
```

## VIC-II Memory Map

The VIC-II registers occupy $D000-$D3FF in the C64 memory map:

| Address Range | Purpose | Key Registers |
|---------------|---------|---------------|
| **$D000-$D02E** | Sprite coordinates and control | Sprite positions, enables |
| **$D011** | Control Register 1 | Screen mode, scrolling |
| **$D016** | Control Register 2 | Multicolor, horizontal scroll |
| **$D018** | Memory Control | Screen/character memory pointers |
| **$D020** | Border Color | Screen border color |
| **$D021** | Background Color | Screen background color |
| **$D800-$DFFF** | Color RAM | Character color memory |

## Essential VIC-II Registers

### $D011 - Control Register 1 (Most Important!)

**Bit layout:**
```
Bit 7: RST8 - 9th bit of raster compare register
Bit 6: ECM  - Extended Color Mode (0=off, 1=on)
Bit 5: BMM  - Bitmap Mode (0=text, 1=bitmap)
Bit 4: DEN  - Display Enable (0=off, 1=on)
Bit 3: RSEL - Row Select (0=24 rows, 1=25 rows)
Bits 2-0: YSCROLL - Vertical fine scrolling (0-7 pixels)
```

```assembly
; Read current VIC-II control register
LDA $D011       ; Load Control Register 1
; Modify specific bits...
STA $D011       ; Write back to VIC-II
```

<CodeRunner 
  system="commodore-64"
  title="VIC-II Control Register Programming"
  code="; Basic VIC-II control register manipulation
; Read current control register
LDA $D011       ; Load VIC-II Control Register 1

; Turn off display (useful for graphics updates)
AND #%11101111  ; Clear bit 4 (DEN - Display Enable)
STA $D011       ; Display now off

; Turn display back on
ORA #%00010000  ; Set bit 4 (DEN - Display Enable)
STA $D011       ; Display now on"
  language="assembly"
/>

### $D016 - Control Register 2

**Bit layout:**
```
Bit 7-6: Unused
Bit 5: RES - Reset (always write 0)
Bit 4: MCM - Multicolor Mode (0=off, 1=on)
Bit 3: CSEL - Column Select (0=38 cols, 1=40 cols)
Bits 2-0: XSCROLL - Horizontal fine scrolling (0-7 pixels)
```

### $D018 - Memory Control Register

**Controls where VIC-II finds screen and character data:**
```
Bits 7-4: VM - Video Matrix base address (screen memory)
Bits 3-1: CB - Character Base address (character ROM/RAM)
Bit 0: Unused
```

**Memory locations:**
- **VM bits point to screen memory**: $0400, $0800, $0C00, etc.
- **CB bits point to character data**: Character ROM or custom character sets

<CodeRunner 
  system="commodore-64"
  title="VIC-II Memory Control"
  code="; Control where VIC-II reads screen and character data
; Default setup: screen at $0400, characters from ROM

; Read current memory control
LDA $D018       ; Load Memory Control Register

; Set screen memory to $0400 (default)
; VM = 0001 (bits 7-4) = $0400
; Character ROM default (CB = 010)
AND #%00001111  ; Clear upper bits (VM field)  
ORA #%00010000  ; Set VM to 0001 ($0400)
STA $D018       ; Update memory control

; Now VIC-II reads screen data from $0400"
  language="assembly"
/>

## Screen Memory Organization

The VIC-II reads two types of memory for text display:

### 1. Screen Memory (Character Codes)
- **Default location**: $0400-$07FF (1000 bytes)
- **Purpose**: Stores character codes (which character to display)
- **Size**: 40×25 = 1000 characters
- **Layout**: Row by row, left to right

### 2. Character Data (How Characters Look)
- **Default location**: Character ROM (built-in)
- **Purpose**: Stores pixel patterns for each character
- **Format**: 8×8 pixel characters, 8 bytes per character
- **Customizable**: Can use RAM for custom character sets

```assembly
; Screen memory layout (40×25 characters)
; Row 0: $0400-$0427 (40 characters)
; Row 1: $0428-$044F (40 characters)
; Row 2: $0450-$0477 (40 characters)
; ...
; Row 24: $03E8-$040F (40 characters, wraps around!)

; Calculate screen position for row Y, column X:
; Address = $0400 + (Y * 40) + X
```

<CodeRunner 
  system="commodore-64"
  title="Screen Memory Access Patterns"
  code="; Understanding screen memory organization
; Fill entire screen with stars

LDX #$00        ; Screen position counter
LDA #$2A        ; '*' character code

FillLoop:
    STA $0400,X     ; Store character at screen position
    STA $0500,X     ; Continue into next page
    STA $0600,X     ; Continue into third page
    STA $0700,X     ; Continue into fourth page
    
    INX             ; Next position
    BNE FillLoop    ; Continue until X wraps to 0
    
; Screen now filled with stars (partial fill for demo)"
  language="assembly"
/>

## Color RAM and Color Control

### Color RAM ($D800-$DFFF)
- **Purpose**: Controls foreground color of each character
- **Organization**: Matches screen memory (40×25)
- **Values**: 0-15 (16 colors available)
- **Special**: Only uses lower 4 bits of each byte

### Background Colors
- **$D021**: Background color (color 0)
- **$D022**: Extra background color 1 (multicolor mode)
- **$D023**: Extra background color 2 (multicolor mode)
- **$D024**: Extra background color 3 (multicolor mode)

```assembly
; C64 Color Palette
; 0: Black    1: White     2: Red       3: Cyan
; 4: Purple   5: Green     6: Blue      7: Yellow
; 8: Orange   9: Brown    10: Lt Red   11: Dk Gray
; 12: Med Gray 13: Lt Green 14: Lt Blue 15: Lt Gray
```

<CodeRunner 
  system="commodore-64"
  title="Color Control Programming"
  code="; Demonstrate color control
; Set background color to blue
LDA #$06        ; Blue color
STA $D021       ; Set background color

; Set border color to red
LDA #$02        ; Red color
STA $D020       ; Set border color

; Set first character to white text
LDA #$48        ; 'H' character
STA $0400       ; Put character on screen
LDA #$01        ; White color
STA $D800       ; Set character color

; Set second character to yellow text
LDA #$45        ; 'E'
STA $0401       ; Second screen position
LDA #$07        ; Yellow color
STA $D801       ; Set character color"
  language="assembly"
/>

## Basic Graphics Effects

### Screen Clearing
```assembly
ClearScreen:
    LDX #$00        ; Position counter
    LDA #$20        ; Space character
    
ClearLoop:
    STA $0400,X     ; Clear screen memory
    STA $0500,X     ; Continue clearing
    STA $0600,X     
    STA $0700,X     ; Clear all 1000 positions
    
    LDA #$01        ; White color
    STA $D800,X     ; Set color RAM
    STA $D900,X
    STA $DA00,X
    STA $DB00,X     ; Set all color positions
    
    INX
    BNE ClearLoop   ; Continue until done
    RTS
```

### Color Cycling Effect
```assembly
ColorCycle:
    LDX #$00        ; Color counter
    
CycleLoop:
    TXA             ; Use counter as color
    AND #$0F        ; Keep in range 0-15
    STA $D020       ; Set border color
    STA $D021       ; Set background color
    
    ; Simple delay
    LDY #$FF
DelayLoop:
    DEY
    BNE DelayLoop
    
    INX             ; Next color
    JMP CycleLoop   ; Continue forever
```

<CodeRunner 
  system="commodore-64"
  title="Basic Graphics Effects"
  code="; Create simple visual effect
; Animate border color through the palette

LDX #$00        ; Color index

ColorLoop:
    TXA             ; Get current color index
    AND #$0F        ; Keep in range 0-15
    STA $D020       ; Set border color
    
    ; Create simple delay
    LDY #$80        ; Delay counter
DelayLoop:
    DEY             ; Count down
    BNE DelayLoop   ; Continue delay
    
    INX             ; Next color
    JMP ColorLoop   ; Continue color cycling"
  language="assembly"
/>

## VIC-II Timing and Raster

The VIC-II operates on **raster timing** - it draws the screen line by line:

### Raster Concepts
- **Raster line**: One horizontal line of the display
- **Raster counter**: Current line being drawn (0-312 PAL, 0-262 NTSC)
- **Raster interrupt**: Trigger interrupt at specific raster line
- **Vertical blank**: Time between screen refreshes

### Reading Raster Position
```assembly
; Read current raster line
LDA $D012       ; Raster counter (low 8 bits)
; For lines 256+, check bit 7 of $D011

; Wait for specific raster line
WaitRaster:
    LDA $D012       ; Read raster counter
    CMP #$50        ; Wait for line 80
    BNE WaitRaster  ; Keep waiting
    ; Now at raster line 80
```

<CodeRunner 
  system="commodore-64"
  title="Raster Timing and Synchronization"
  code="; Demonstrate raster timing
; Change border color at different screen positions

MainLoop:
    ; Wait for top of screen
    LDA $D012       ; Read raster counter
    CMP #$30        ; Top area (line 48)
    BNE CheckMiddle
    LDA #$02        ; Red
    STA $D020       ; Set border color
    JMP MainLoop
    
CheckMiddle:
    CMP #$80        ; Middle area (line 128)
    BNE CheckBottom
    LDA #$05        ; Green
    STA $D020       ; Set border color
    JMP MainLoop
    
CheckBottom:
    CMP #$F0        ; Bottom area (line 240)
    BNE MainLoop
    LDA #$06        ; Blue
    STA $D020       ; Set border color
    JMP MainLoop"
  language="assembly"
/>

## Display Modes Overview

The VIC-II supports several display modes:

### Text Modes
- **Standard Text**: 40×25 characters, 16 colors per character
- **Multicolor Text**: 40×25 characters, 4 colors per character, lower resolution
- **Extended Color**: 40×25 characters, 4 background colors

### Bitmap Modes
- **High Resolution**: 320×200 pixels, 2 colors per 8×8 block
- **Multicolor Bitmap**: 160×200 pixels, 4 colors per 4×8 block

### Mode Selection
Mode is controlled by bits in $D011 and $D016:
- **BMM bit** (bit 5 of $D011): 0=text, 1=bitmap
- **ECM bit** (bit 6 of $D011): Extended color mode
- **MCM bit** (bit 4 of $D016): Multicolor mode

## Advanced VIC-II Features Preview

Features you'll master in upcoming lessons:

### Hardware Sprites (Lesson 19)
- 8 independent hardware sprites
- 24×21 pixel size, expandable to 48×42
- Hardware collision detection
- Automatic movement and animation

### Custom Character Sets (Lesson 18)
- Design your own character graphics
- Animation through character switching
- Font replacement and custom graphics

### Bitmap Graphics (Lesson 20)
- Pixel-level graphics control
- Mixing text and bitmap modes
- Advanced graphics techniques

## Practice Exercise

Create a program that demonstrates basic VIC-II control:

1. Change border and background colors
2. Display text with different character colors
3. Create a simple color animation effect
4. Demonstrate raster timing synchronization

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - VIC-II Control Program"
  code="; Complete VIC-II demonstration program
; Shows colors, text, and timing

InitDisplay:
    ; Set up basic display
    LDA #$93        ; Clear screen character
    JSR $FFD2       ; KERNAL clear screen
    
    ; Set border to dark blue
    LDA #$06        ; Blue
    STA $D020       ; Border color
    
    ; Set background to black  
    LDA #$00        ; Black
    STA $D021       ; Background color
    
    ; Display title text
    LDX #$00        ; Character position
    
DisplayTitle:
    LDA TitleText,X ; Get character from table
    BEQ StartAnimation ; If 0, text is done
    STA $0400,X     ; Put on screen
    
    ; Set character color to white
    LDA #$01        ; White
    STA $D800,X     ; Set color
    
    INX             ; Next character
    JMP DisplayTitle

StartAnimation:
    ; Color cycling animation
    LDX #$00        ; Color counter
    
AnimationLoop:
    ; Set border color based on counter
    TXA
    AND #$0F        ; Keep in range 0-15
    STA $D020       ; Set border
    
    ; Set character colors in sequence
    LDY #$00        ; Position counter
ColorSetLoop:
    TXA             ; Get base color
    CLC
    ADC #$01        ; Offset color
    AND #$0F        ; Keep in range
    STA $D800,Y     ; Set character color
    
    INY             ; Next position
    CPY #$10        ; Color first 16 characters
    BNE ColorSetLoop
    
    ; Simple timing delay
    JSR SimpleDelay
    
    INX             ; Next color cycle
    JMP AnimationLoop

SimpleDelay:
    LDY #$FF        ; Delay counter
DelayLoop:
    DEY
    BNE DelayLoop
    RTS

TitleText:
    .text \"VIC-II DEMO\"
    .byte $00       ; End marker"
  language="assembly"
/>

## VIC-II Programming Best Practices

### 1. Always Check Raster Position
```assembly
; Don't change graphics during visible area
WaitVBlank:
    LDA $D012
    CMP #$FF        ; Wait for bottom of screen
    BNE WaitVBlank
```

### 2. Use Display Enable for Updates
```assembly
; Turn off display for major updates
LDA $D011
AND #%11101111  ; Clear DEN bit
STA $D011       ; Display off

; Update graphics...

LDA $D011
ORA #%00010000  ; Set DEN bit  
STA $D011       ; Display on
```

### 3. Preserve Register State
```assembly
GraphicsRoutine:
    PHA             ; Save A
    LDA $D011       ; Read VIC register
    ; Modify...
    STA $D011       ; Write back
    PLA             ; Restore A
    RTS
```

## What You've Learned

In this lesson, you've mastered:

- VIC-II architecture and memory-mapped programming
- Essential VIC-II registers and their functions
- Screen memory organization and color control
- Basic graphics effects and timing concepts
- Raster synchronization and display timing
- Foundation concepts for all C64 graphics programming

## Looking Ahead

In the next lesson, you'll dive deeper into **screen modes and character sets** - learning how to create custom graphics, design your own characters, and work with the different display modes the VIC-II offers.

## Fun Fact

The VIC-II was incredibly advanced for 1982! Its sprite capabilities, multiple screen modes, and raster effects were years ahead of competing systems. Many of the techniques you're learning - memory-mapped I/O, raster timing, hardware sprites - are still fundamental concepts in modern graphics programming. GPU programming today uses very similar principles, just at much larger scales. You're learning the foundational patterns that drive all graphics hardware!