# Assembly Syntax Highlighting Implementation

## Overview

This document describes the implementation of enhanced assembly language syntax highlighting for the Code198x website, providing proper highlighting for all four vintage computing systems covered in the lessons.

## Features Implemented

### 1. Language Definitions

#### 6502 Assembly (`asm6502`)

- **Used for**: Commodore 64, Nintendo Entertainment System
- **Built-in**: Available in PrismJS by default
- **Features**:
  - All 6502 opcodes (LDA, STA, JMP, etc.)
  - Hex numbers ($D020), binary (%10110101), decimal
  - Comments (;), directives (.), registers (A, X, Y)

#### Z80 Assembly (`z80`)

- **Used for**: ZX Spectrum
- **Custom implementation**: `/src/scripts/prism-z80.js`
- **Features**:
  - All Z80 opcodes (LD, JP, CALL, etc.)
  - Z80 registers (A, B, C, D, E, H, L, AF, BC, DE, HL, IX, IY)
  - Condition codes (NZ, Z, NC, C, PO, PE, P, M)
  - Multiple number formats ($, 0x, %, 0b)
  - Directives (ORG, DEFB, EQU, etc.)

#### 68000 Assembly (`m68k`)

- **Used for**: Commodore Amiga
- **Custom implementation**: `/src/scripts/prism-m68k.js`
- **Features**:
  - All 68000 opcodes (MOVE, LEA, JSR, etc.)
  - 68000 registers (D0-D7, A0-A7, SP, PC, SR)
  - Size suffixes (.B, .W, .L)
  - Addressing modes ((A0), #$1234, etc.)
  - Directives (SECTION, ORG, DC, etc.)

### 2. Retro-Themed Visual Design

#### System-Specific Color Schemes

- **C64/6502**: Blue gradient background with light blue opcodes
- **ZX Spectrum/Z80**: Dark background with rainbow accents and yellow opcodes
- **Amiga/68000**: Blue-orange gradient with orange opcodes
- **General**: Dark backgrounds with bright, high-contrast colors

#### Visual Effects

- **Scanline effect**: Subtle horizontal lines for authentic CRT appearance
- **Glow effects**: Text shadow on keywords and hover animations
- **Gradient backgrounds**: Linear gradients matching each system's aesthetic
- **Vintage styling**: Custom scrollbars, borders, and typography

### 3. Token Highlighting

#### Consistent Color Mapping

- **Comments**: Dim gray, italic
- **Op-codes/Keywords**: System-specific bright colors with glow
- **Numbers**: Bright cyan for all number formats
- **Registers**: Bright yellow, bold
- **Labels**: Bright white with subtle glow
- **Directives**: Magenta, bold
- **Strings**: Light green
- **Special tokens**: Various accent colors (red, orange, purple)

### 4. Integration and Aliases

#### Language Tag Mapping

- `asm` → `asm6502` (for C64 lessons)
- `nasm` → `z80` (for ZX Spectrum lessons that used nasm)
- `m68k` → `m68k` (for Amiga lessons)
- `asm6502` → `asm6502` (for NES lessons)

#### Component Structure

- **PrismLoader.astro**: Loads custom language definitions
- **prism-retro.css**: Retro-themed syntax highlighting styles
- **Layout.astro**: Integrates the custom components

## Files Modified/Created

### New Files

- `/src/scripts/prism-z80.js` - Z80 assembly language definition
- `/src/scripts/prism-m68k.js` - 68000 assembly language definition
- `/src/styles/prism-retro.css` - Retro-themed syntax highlighting styles
- `/src/components/PrismLoader.astro` - Component to load custom languages
- `/src/pages/test-syntax.astro` - Test page for syntax highlighting

### Modified Files

- `/src/layouts/Layout.astro` - Added CSS imports and PrismLoader component

### Updated Language Tags

- C64 lessons: `asm` → `asm6502`
- ZX Spectrum lessons: `nasm` → `z80`
- Amiga lessons: `nasm` → `m68k`
- NES lessons: Already using `asm6502` (correct)

## Usage

### In MDX Files

Use the appropriate language identifier for code blocks:

````markdown
# C64/NES Assembly

```asm6502
LDA #$06
STA $D020
```
````

# ZX Spectrum Assembly

```z80
LD HL, $4000
LD A, 143
LD (HL), A
```

# Amiga Assembly

```m68k
MOVE.L #$00040000, A0
LEA custom, A6
MOVE.W #$8200, bplcon0(A6)
```

```

### Visual Features
- Each system gets its own color scheme
- Proper syntax highlighting for all assembly constructs
- Retro visual effects (scanlines, glows, gradients)
- Responsive design with proper mobile support

## Accessibility

- High contrast colors for readability
- Reduced motion support for accessibility preferences
- Proper semantic markup for screen readers
- Keyboard-friendly interactive elements

## Testing

Visit `/test-syntax` to see all four assembly languages properly highlighted with:
- System-specific color schemes
- Proper token recognition
- Visual effects and styling
- Responsive layout

## Future Enhancements

Potential future improvements:
- Line numbers for code blocks
- Copy-to-clipboard functionality
- Syntax error highlighting
- Integration with assembler validation
- More vintage computer systems (Apple II, Atari 8-bit, etc.)

## Browser Support

- Works in all modern browsers
- Graceful degradation for older browsers
- No JavaScript dependencies beyond PrismJS
- CSS-only visual effects with fallbacks
```
