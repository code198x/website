---
title: "Pixel Painter"
system: "zx-spectrum"
phase_number: 1
tier_range: "1-4"
genre: "Creative/Art"
description: "A creative drawing program that teaches Z80 assembly programming through art, embracing the ZX Spectrum's unique attribute-based graphics system."
gameplay_mechanics:
  - "Draw pixel art using keyboard controls"
  - "Work within the Spectrum's colour attribute constraints"
  - "Save and load artwork to/from tape"
  - "Gallery mode to view creations"
  - "Collaborative drawing challenges"
technical_features:
  - "Character-based graphics manipulation using Z80 assembly"
  - "Attribute clash handling through direct memory access"
  - "File I/O for saving artwork using Z80 routines"
  - "Cursor movement and drawing logic in assembly"
  - "Menu system with assembly-driven interface"
concepts_demonstrated:
  - "2D coordinate systems in Z80 assembly"
  - "Character and attribute manipulation using direct memory access"
  - "User input mapping to screen coordinates via assembly"
  - "File handling and data persistence in Z80 assembly"
  - "Memory-based graphics programming"
  - "Understanding hardware limitations as assembly programming constraints"
estimated_dev_time: "4-6 lessons"
source_code_available: true
playable_online: true
order: 1
---

# Pixel Painter

**Pixel Painter** transforms the ZX Spectrum's infamous "attribute clash" from a limitation into a creative feature, teaching programming through digital art creation.

## The Game Concept

Create pixel art masterpieces on the Spectrum's unique 8×8 attribute grid. What makes this special:

- **Embrace the Clash**: Learn to work creatively within the Spectrum's colour limitations
- **Gallery Mode**: Save and share your creations
- **Challenge Mode**: Recreate famous 8-bit scenes within attribute constraints
- **Collaborative Art**: Multiple players can work on the same canvas
- **Export Functions**: Print your art or save as "loading screens"

## Why This Game?

**Pixel Painter** is perfect for introducing Z80 assembly programming because:

- **Visual Results**: See immediate, satisfying output from assembly code
- **Hardware Understanding**: Learn how the Spectrum's graphics work at the machine level
- **Creative Expression**: Assembly programming becomes a tool for artistic creation
- **Assembly Learning Curve**: Start with simple instructions, build complexity gradually
- **Real-world Application**: Understand how loading screens and game graphics were made in assembly

## Spectrum-Specific Features

This game showcases what makes the ZX Spectrum unique:

- **Attribute System**: Each 8×8 pixel block has one foreground and one background colour
- **Character Graphics**: Using CHR$ and PRINT AT for precise positioning
- **Memory Efficiency**: Working within the Spectrum's tight memory constraints
- **Tape Storage**: Save/load functionality using the cassette system
- **BEEP Integration**: Audio feedback for drawing actions

## Progressive Development

### Tiers 1-4 Development Roadmap

**Tier 1**: Basic drawing

- Cursor movement with arrow keys
- Simple pixel plotting
- Color selection
- Clear screen function

**Tier 2**: Enhanced tools

- Line drawing
- Fill areas
- Undo functionality
- Better user interface

**Tier 3**: Creative features

- Pattern fills
- Copy/paste regions
- Multiple brush sizes
- Color cycling effects

**Tier 4**: Sharing and storage

- Save/load artwork to tape
- Gallery browsing
- Export to printer
- Challenge mode with templates

## Technical Challenges

**Pixel Painter** introduces essential Spectrum programming concepts:

- **Screen memory mapping** - Understanding how PRINT AT translates to screen positions
- **Attribute manipulation** - Working with INK, PAPER, BRIGHT, and FLASH
- **Coordinate systems** - Converting user input to screen coordinates
- **Data structures** - Storing artwork in memory-efficient formats
- **File I/O** - Saving and loading using SAVE and LOAD commands
- **User interface design** - Creating intuitive controls within hardware constraints

## Sample Gameplay

```
**** PIXEL PAINTER ****

Current Position: (12,8)
Colors: INK 2 (Red) PAPER 7 (White)

Controls:
Q/A = Move Up/Down    O/P = Move Left/Right
SPACE = Plot Pixel    C = Change Colors
S = Save Picture      L = Load Picture
G = Gallery Mode      ENTER = Menu

[Grid display showing current artwork with cursor]

█████░░░░░░░░░░░
█░░░█░░░░░░░░░░░
█░█░█░░░░░░░░░░░
█░░░█░░░♦░░░░░░░  ← Cursor
█████░░░░░░░░░░░

Pixels used: 23/256  Colors: 3  Attributes: 12/768

Press SPACE to paint, or M for menu
```

## Learning Outcomes

Building **Pixel Painter** teaches:

1. **Graphics programming fundamentals** through hands-on creation
2. **Hardware constraints** as creative challenges, not limitations
3. **Coordinate systems** and spatial reasoning
4. **Data representation** - how images are stored in memory
5. **User interface design** within technical constraints
6. **File handling** for persistence and sharing

## The Spectrum Advantage

**Pixel Painter** could only work this way on the ZX Spectrum:

- The **attribute clash** becomes a defining aesthetic feature
- **Character-based graphics** make pixel-perfect control possible
- **Immediate response** from BASIC commands provides instant gratification
- **Tape storage** adds authentic retro functionality
- **Memory constraints** teach efficient programming practices

## Educational Philosophy

Rather than fighting the Spectrum's limitations, **Pixel Painter** celebrates them. Students learn that constraints often lead to more creative solutions - a lesson that applies far beyond vintage computing.

The game demonstrates that the best educational software doesn't just teach programming concepts; it shows how those concepts can be tools for creative expression and problem-solving.
