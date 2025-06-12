---
title: "Screen Modes and Character Sets"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 18
description: "Master VIC-II display modes and custom character programming. Learn text modes, multicolor graphics, custom character design, and advanced display techniques for professional graphics programming."
learning_objectives:
  - "Understand all VIC-II display modes and their applications"
  - "Master custom character set design and implementation"
  - "Learn multicolor and extended color mode programming"
  - "Practice character animation and graphics techniques"
  - "Build sophisticated text-based graphics systems"
concepts:
  - "VIC-II display modes (text, multicolor, extended color)"
  - "Character ROM vs custom character sets"
  - "Character data format and design"
  - "Mode switching and display control"
  - "Advanced text graphics techniques"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 18
---

# Lesson 18: Screen Modes and Character Sets

Welcome to advanced display programming! Today you'll master the VIC-II's multiple display modes and learn to create custom graphics through character set programming. This unlocks the full potential of C64 text-based graphics.

## VIC-II Display Modes Overview

The VIC-II supports **five main display modes** that offer different capabilities:

| Mode | Resolution | Colors | Use Case |
|------|------------|--------|----------|
| **Standard Text** | 40×25 chars | 16 colors/char | Normal text, simple graphics |
| **Multicolor Text** | 40×25 chars | 4 colors/char | Colorful text, block graphics |
| **Extended Color** | 40×25 chars | 4 backgrounds | Colored text backgrounds |
| **Hi-Res Bitmap** | 320×200 pixels | 2 colors/8×8 | Detailed graphics |
| **Multicolor Bitmap** | 160×200 pixels | 4 colors/4×8 | Colorful graphics |

Each mode is selected by specific bits in VIC-II control registers.

## Mode Control Bits

Display modes are controlled by three key bits:

### $D011 (Control Register 1)
- **Bit 6 (ECM)**: Extended Color Mode
- **Bit 5 (BMM)**: Bitmap Mode

### $D016 (Control Register 2)  
- **Bit 4 (MCM)**: Multicolor Mode

### Mode Selection Table
| ECM | BMM | MCM | Mode |
|-----|-----|-----|------|
| 0 | 0 | 0 | **Standard Text** |
| 0 | 0 | 1 | **Multicolor Text** |
| 1 | 0 | 0 | **Extended Color Text** |
| 1 | 0 | 1 | **Invalid** |
| 0 | 1 | 0 | **Hi-Res Bitmap** |
| 0 | 1 | 1 | **Multicolor Bitmap** |
| 1 | 1 | 0 | **Invalid** |
| 1 | 1 | 1 | **Invalid** |

<CodeRunner 
  system="commodore-64"
  title="Display Mode Switching"
  code="; Demonstrate switching between display modes
; Start in standard text mode

; Set Standard Text Mode (ECM=0, BMM=0, MCM=0)
LDA $D011       ; Read control register 1
AND #%10011111  ; Clear ECM (bit 6) and BMM (bit 5)
STA $D011       ; Write back

LDA $D016       ; Read control register 2
AND #%11101111  ; Clear MCM (bit 4)
STA $D016       ; Standard text mode active

; Display some text
LDA #$48        ; 'H'
STA $0400       ; Put on screen

; Switch to Multicolor Text Mode (ECM=0, BMM=0, MCM=1)
LDA $D016       ; Read control register 2
ORA #%00010000  ; Set MCM (bit 4)
STA $D016       ; Multicolor text mode active"
  language="assembly"
/>

## Standard Text Mode (Default)

**Standard text mode** is the C64's default display mode:

- **Resolution**: 40×25 characters
- **Colors**: 16 foreground colors per character
- **Background**: Single background color for entire screen
- **Character size**: 8×8 pixels
- **Total pixels**: 320×200 effective resolution

### Character Data Format

Each character is defined by **8 bytes** (8×8 pixels):
- Each bit represents one pixel (0=background, 1=foreground)
- Stored sequentially: byte 0 = top row, byte 7 = bottom row

```assembly
; Example: Letter 'A' character data
CharacterA:
    .byte %00111000  ; Row 0:   ■■■   
    .byte %01101100  ; Row 1:  ■■ ■■  
    .byte %11000110  ; Row 2: ■■   ■■ 
    .byte %11000110  ; Row 3: ■■   ■■ 
    .byte %11111110  ; Row 4: ■■■■■■■ 
    .byte %11000110  ; Row 5: ■■   ■■ 
    .byte %11000110  ; Row 6: ■■   ■■ 
    .byte %00000000  ; Row 7:         
```

<CodeRunner 
  system="commodore-64"
  title="Understanding Character Data Format"
  code="; Examine character data structure
; Display character and show its bit pattern

; Put letter 'A' on screen (character code $41)
LDA #$41        ; 'A' character code
STA $0400       ; Display at top-left

; Set character color to white
LDA #$01        ; White color
STA $D800       ; Set color for position 0

; Character ROM contains the actual pixel data
; ROM address for 'A' = $1000 + ($41 * 8) = $1208
; Each character takes 8 bytes (8 rows × 8 pixels)"
  language="assembly"
/>

## Custom Character Sets

One of the C64's most powerful features is **custom character sets** - designing your own graphics characters.

### Character Memory Organization

Characters can come from two sources:
1. **Character ROM**: Built-in character set (uppercase/graphics or lowercase/uppercase)
2. **Character RAM**: Custom character set in RAM

### Setting Up Custom Characters

To use custom characters, you must:
1. **Copy character data to RAM** (usually $2000-$2FFF)
2. **Switch VIC-II to use RAM characters** via $D018
3. **Design your character graphics**

```assembly
; Setup custom character set at $2000
SetupCustomChars:
    ; First, copy existing characters from ROM
    SEI                 ; Disable interrupts
    
    ; Switch out KERNAL ROM to access character ROM
    LDA $01
    PHA                 ; Save current memory config
    AND #%11111100      ; Switch out KERNAL and BASIC
    STA $01
    
    ; Copy characters from ROM ($D000) to RAM ($2000)
    LDX #$00
CopyLoop:
    LDA $D000,X         ; Read from character ROM
    STA $2000,X         ; Write to character RAM
    LDA $D100,X         ; Continue copying
    STA $2100,X
    ; ... continue for all 256 characters
    INX
    BNE CopyLoop
    
    ; Restore memory configuration
    PLA
    STA $01
    CLI                 ; Re-enable interrupts
    
    ; Tell VIC-II to use RAM characters at $2000
    LDA $D018
    AND #%11110001      ; Clear character base bits
    ORA #%00000100      ; Set character base to $2000
    STA $D018
    
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Custom Character Set Setup"
  code="; Setup custom character set (simplified)
; This example shows the concept - real implementation needs ROM copying

; Tell VIC-II to use character data at $2000
LDA $D018           ; Read memory control register
AND #%11110001      ; Clear character base bits (CB)
ORA #%00000100      ; Set CB to point to $2000
STA $D018           ; VIC-II now reads characters from $2000

; Create custom character data for character 0
; Design a simple smiley face
LDA #%00111100      ; Row 0:  ■■■■  
STA $2000           ; Character 0, row 0
LDA #%01100110      ; Row 1: ■■  ■■ 
STA $2001           ; Character 0, row 1
LDA #%11100111      ; Row 2: ■■■ ■■■
STA $2002           ; Character 0, row 2
LDA #%11100111      ; Row 3: ■■■ ■■■
STA $2003           ; Character 0, row 3
LDA #%11000011      ; Row 4: ■■   ■■
STA $2004           ; Character 0, row 4
LDA #%11100111      ; Row 5: ■■■ ■■■
STA $2005           ; Character 0, row 5
LDA #%01111110      ; Row 6:  ■■■■■■
STA $2006           ; Character 0, row 6
LDA #%00111100      ; Row 7:  ■■■■  
STA $2007           ; Character 0, row 7

; Display the custom character
LDA #$00            ; Character code 0 (our smiley)
STA $0400           ; Display on screen"
  language="assembly"
/>

## Multicolor Text Mode

**Multicolor text mode** allows 4 colors per character but at lower resolution:

- **Resolution**: 40×25 characters, but each character is 4×8 pixels
- **Colors**: 4 colors per character from a specific palette
- **Horizontal resolution**: Halved (160 pixels effective width)

### Multicolor Character Format

In multicolor mode, character data is interpreted differently:
- **2 bits per pixel** instead of 1 bit
- **4 pixels per row** instead of 8 pixels
- **Same 8 bytes per character**

### Multicolor Color Sources

Each 2-bit pixel value selects a color:
- **00**: Background color ($D021)
- **01**: Color from bits 0-2 of screen memory
- **10**: Color from bits 3-6 of screen memory  
- **11**: Color RAM value ($D800+)

```assembly
; Enable multicolor text mode
EnableMulticolor:
    LDA $D016           ; Read control register 2
    ORA #%00010000      ; Set MCM bit (bit 4)
    STA $D016           ; Multicolor mode active
    RTS

; Create multicolor character (4×8 pixels)
; Each 2-bit value selects a color
MultcolorChar:
    .byte %00011011     ; Row 0: 00|01|10|11 = bg|col1|col2|col3
    .byte %01100110     ; Row 1: 01|10|01|10
    .byte %10011001     ; Row 2: 10|01|10|01  
    .byte %11001100     ; Row 3: 11|00|11|00
    .byte %00110011     ; Row 4: 00|11|00|11
    .byte %01010101     ; Row 5: 01|01|01|01
    .byte %10101010     ; Row 6: 10|10|10|10
    .byte %11111111     ; Row 7: 11|11|11|11
```

<CodeRunner 
  system="commodore-64"
  title="Multicolor Text Mode Programming"
  code="; Demonstrate multicolor text mode
; Enable multicolor mode
LDA $D016           ; Read control register 2  
ORA #%00010000      ; Set multicolor bit (MCM)
STA $D016           ; Multicolor mode active

; Set background color (color 00)
LDA #$00            ; Black background
STA $D021

; Set global multicolor colors
LDA #$01            ; White for color 01
STA $D022           ; Multicolor register 1
LDA #$02            ; Red for color 10  
STA $D023           ; Multicolor register 2

; Put multicolor character on screen
; For this to work, need character with high bit set
LDA #$A0            ; Character $A0 (high bit set = multicolor)
STA $0400           ; Display character

; Set character-specific color (color 11)
LDA #$07            ; Yellow
STA $D800           ; Color RAM - becomes color 11"
  language="assembly"
/>

## Extended Color Text Mode

**Extended color mode** provides 4 different background colors:

- **Resolution**: 40×25 characters (normal text resolution)
- **Colors**: 16 foreground colors, 4 selectable background colors
- **Character limitation**: Only 64 characters available (0-63)

### Extended Color Operation

- **Bits 6-7 of screen memory** select background color
- **Bits 0-5 of screen memory** select character (0-63 only)
- **Color RAM** still controls foreground color

### Background Color Selection
- **00**: $D021 (normal background color)
- **01**: $D022 (extra background color 1)
- **10**: $D023 (extra background color 2)  
- **11**: $D024 (extra background color 3)

```assembly
; Enable extended color mode
EnableExtendedColor:
    LDA $D011           ; Read control register 1
    ORA #%01000000      ; Set ECM bit (bit 6)
    STA $D011           ; Extended color mode active
    RTS

; Set up background colors
SetupECMColors:
    LDA #$00            ; Black
    STA $D021           ; Background 0
    LDA #$01            ; White  
    STA $D022           ; Background 1
    LDA #$02            ; Red
    STA $D023           ; Background 2
    LDA #$06            ; Blue
    STA $D024           ; Background 3
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Extended Color Mode Programming"
  code="; Demonstrate extended color text mode
; Enable extended color mode
LDA $D011           ; Read control register 1
ORA #%01000000      ; Set ECM bit (bit 6)  
STA $D011           ; Extended color mode active

; Setup 4 background colors
LDA #$00            ; Black
STA $D021           ; Background color 0 (bits 00)
LDA #$01            ; White
STA $D022           ; Background color 1 (bits 01)
LDA #$02            ; Red  
STA $D023           ; Background color 2 (bits 10)
LDA #$06            ; Blue
STA $D024           ; Background color 3 (bits 11)

; Display characters with different backgrounds
LDA #%00000001      ; Character 1, background 0 (black)
STA $0400
LDA #%01000001      ; Character 1, background 1 (white)
STA $0401  
LDA #%10000001      ; Character 1, background 2 (red)
STA $0402
LDA #%11000001      ; Character 1, background 3 (blue)
STA $0403

; Set text color to yellow for visibility
LDA #$07            ; Yellow
STA $D800           ; First character
STA $D801           ; Second character
STA $D802           ; Third character  
STA $D803           ; Fourth character"
  language="assembly"
/>

## Character Animation Techniques

Custom characters enable smooth animation through character switching:

### Frame-Based Animation
```assembly
; Animate spinning character
SpinAnimation:
    .byte $80, $81, $82, $83    ; Frame sequence
    .byte $FF                   ; End marker

AnimateSpinner:
    LDX AnimFrame               ; Get current frame
    LDA SpinAnimation,X         ; Get character code
    CMP #$FF                    ; End of sequence?
    BNE ShowFrame
    LDX #$00                    ; Reset to first frame
    STX AnimFrame
    LDA SpinAnimation,X         ; Get first character

ShowFrame:
    STA $0400                   ; Display character
    INX                         ; Next frame
    STX AnimFrame               ; Save frame counter
    RTS

AnimFrame: .byte $00
```

### Scrolling Text with Custom Characters
```assembly
; Smooth text scrolling using character redefinition
ScrollText:
    ; Shift all character data left by one pixel
    LDX #$00                    ; Character counter
    
ScrollLoop:
    ; For each character, shift pixel data
    LDY #$00                    ; Row counter
    
ShiftChar:
    LDA $2000,Y                 ; Read character row
    ASL                         ; Shift left (smooth scroll)
    STA $2000,Y                 ; Write back
    
    INY                         ; Next row
    CPY #$08                    ; 8 rows per character
    BNE ShiftChar
    
    ; Move to next character
    CLC
    LDA #$08                    ; 8 bytes per character
    ADC $F0                     ; Add to base address
    STA $F0
    BCC NoCarry
    INC $F1
    
NoCarry:
    INX
    CPX #$20                    ; Process 32 characters
    BNE ScrollLoop
    RTS
```

## Advanced Text Graphics

### Block Graphics
Use characters as building blocks for larger graphics:

```assembly
; Create large graphics using character blocks
DrawBox:
    ; Top border
    LDA #$70                    ; Horizontal line character
    LDX #$00
TopLoop:
    STA $0400,X                 ; Top row
    INX
    CPX #$0A                    ; 10 characters wide
    BNE TopLoop
    
    ; Sides
    LDA #$7D                    ; Vertical line character
    STA $0428                   ; Left side, row 1
    STA $0431                   ; Right side, row 1
    STA $0450                   ; Left side, row 2
    STA $0459                   ; Right side, row 2
    
    ; Bottom border
    LDA #$70                    ; Horizontal line character
    LDX #$00
BottomLoop:
    STA $0478,X                 ; Bottom row
    INX
    CPX #$0A                    ; 10 characters wide
    BNE BottomLoop
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Character-Based Graphics"
  code="; Create graphics using text characters
; Draw a simple border and pattern

; Draw top border using horizontal line characters
LDX #$00            ; Position counter
LDA #$40            ; Horizontal line character (PETSCII)

TopBorder:
    STA $0400,X     ; Draw top border
    INX
    CPX #$28        ; Full screen width (40 chars)
    BNE TopBorder

; Draw vertical borders
LDY #$01            ; Row counter (skip top row)
LDA #$7D            ; Vertical line character

VerticalBorders:
    ; Calculate screen position for left border
    TYA             ; Get row number
    ASL             ; Multiply by 40 (screen width)
    ASL             ; Y * 4
    ASL             ; Y * 8  
    ASL             ; Y * 16
    ASL             ; Y * 32
    CLC
    ADC #$00        ; Add Y * 8 to get Y * 40
    TAX             ; Use as index
    
    LDA #$7D        ; Vertical line
    STA $0400,X     ; Left border
    CLC
    TXA
    ADC #$27        ; Add 39 for right border position
    TAX
    STA $0400,X     ; Right border
    
    INY             ; Next row
    CPY #$18        ; 24 rows (skip bottom)
    BNE VerticalBorders

; Fill center with pattern
LDA #$2A            ; Star character
STA $0429           ; Center area
STA $042A
STA $0451
STA $0452"
  language="assembly"
/>

## Screen Mode Applications

### When to Use Each Mode

**Standard Text Mode:**
- Normal text display
- Simple user interfaces
- Character-based games
- Debug output

**Multicolor Text Mode:**
- Colorful block graphics
- Low-resolution game backgrounds
- Artistic text effects
- Color-rich interfaces

**Extended Color Mode:**
- Highlighting text with background colors
- Simple status displays
- Color-coded information
- Limited character animations

## Practice Exercise

Create a comprehensive screen mode demonstration that:

1. Switches between all three text modes
2. Demonstrates custom character creation
3. Shows character animation techniques
4. Creates graphics using character blocks

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Complete Screen Mode Demo"
  code="; Comprehensive screen mode demonstration
; Shows mode switching, custom characters, and graphics

InitDemo:
    ; Clear screen and setup
    LDA #$93        ; Clear screen
    JSR $FFD2       ; KERNAL screen clear
    
    ; Start with standard text mode
    JSR SetStandardMode
    JSR DisplayModeInfo
    
    ; Create demonstration
    JSR CreateCustomChars
    JSR DisplayGraphics
    RTS

SetStandardMode:
    ; Standard text: ECM=0, BMM=0, MCM=0
    LDA $D011
    AND #%10011111  ; Clear ECM and BMM
    STA $D011
    LDA $D016  
    AND #%11101111  ; Clear MCM
    STA $D016
    RTS

DisplayModeInfo:
    ; Display current mode information
    LDX #$00
ModeTextLoop:
    LDA ModeText,X
    BEQ ModeTextDone
    STA $0400,X     ; Display text
    INX
    JMP ModeTextLoop
ModeTextDone:
    RTS

CreateCustomChars:
    ; Create simple custom character (smiley face)
    ; This is conceptual - real version needs ROM copying
    LDA #%00111100  ; Smiley face pattern
    STA $2000       ; Top row
    LDA #%01100110
    STA $2001
    LDA #%11100111  
    STA $2002
    LDA #%11000011
    STA $2003
    LDA #%11000011
    STA $2004
    LDA #%11100111
    STA $2005
    LDA #%01111110
    STA $2006
    LDA #%00111100
    STA $2007       ; Bottom row
    RTS

DisplayGraphics:
    ; Create simple graphics using characters
    LDA #$2A        ; Star character
    STA $0450       ; Middle of screen
    STA $0451
    STA $0478
    STA $0479
    
    ; Set colors
    LDA #$01        ; White
    STA $D800       ; First character color
    LDA #$07        ; Yellow  
    STA $D850       ; Graphics color
    STA $D851
    STA $D878
    STA $D879
    RTS

ModeText:
    .text \"STANDARD TEXT MODE\"
    .byte $00       ; End marker"
  language="assembly"
/>

## Screen Mode Best Practices

### 1. Mode Switching Timing
```assembly
; Switch modes during vertical blank
WaitVBlank:
    LDA $D012
    CMP #$FF
    BNE WaitVBlank
    ; Now safe to change modes
```

### 2. Character Set Management
```assembly
; Always preserve original character data
BackupCharSet:
    ; Copy current characters before modifying
    ; Restore when switching back to text
```

### 3. Color Coordination
```assembly
; Plan color palettes for each mode
; Consider color clash limitations
; Test on different display types
```

## What You've Learned

In this lesson, you've mastered:

- All VIC-II text display modes and their applications
- Custom character set design and implementation
- Character data format and memory organization
- Mode switching and display control techniques
- Character animation and graphics programming
- Advanced text-based graphics creation

## Looking Ahead

In the next lesson, you'll learn about **sprites and hardware graphics** - the VIC-II's most exciting feature that enables smooth animation, collision detection, and arcade-quality graphics effects.

## Fun Fact

The character-based graphics techniques you've learned were the foundation of most early computer graphics! Before dedicated graphics cards, programmers created amazing visual effects using nothing but character manipulation. Games like Rogue, early adventure games, and even some arcade games used these exact techniques. The custom character programming you've mastered is still used today in retro-style games, embedded systems with simple displays, and anywhere memory-efficient graphics are needed. You've learned the artistic and technical foundation that shaped decades of computer graphics!