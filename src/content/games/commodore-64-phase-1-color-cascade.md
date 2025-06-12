---
title: "Color Cascade"
system: "commodore-64"
phase_number: 1
tier_range: "5-8"
genre: "Puzzle/Memory"
description: "A mesmerizing pattern-matching game that combines the C64's vibrant color palette with memory challenges and demonstrates 6502 assembly programming."
gameplay_mechanics:
  - "Watch cascading color sequences"
  - "Reproduce patterns using keyboard input"
  - "Increasing sequence length and speed"
  - "Audio cues for each color"
  - "Bonus rounds with special patterns"
technical_features:
  - "C64 color manipulation and PETSCII graphics in assembly"
  - "Sound effects using 6502 assembly and SID register control"
  - "Animation timing and delays using assembly loops"
  - "Pattern generation algorithms in 6502 assembly"
  - "High score tracking with assembly-based string handling"
concepts_demonstrated:
  - "Memory arrays and data structures in assembly"
  - "Graphics programming with direct memory access"
  - "Sound generation with SID chip register manipulation"
  - "Timing and animation loops using 6502 instructions"
  - "String manipulation using assembly routines"
  - "Modular programming with JSR/RTS subroutines"
estimated_dev_time: "4-6 lessons"
source_code_available: true
playable_online: true
order: 2
---

# Color Cascade

**Color Cascade** harnesses the Commodore 64's legendary 16-color palette to create a hypnotic pattern-matching game that's both beautiful and challenging.

## The Game Concept

Colors flow down the screen in mesmerizing sequences. Your job is to memorize the patterns and reproduce them using the keyboard. But as you progress:

- **Sequences get longer** - Starting with 3 colors, building to 12+
- **Speed increases** - Less time to memorize each pattern
- **Special modes** unlock - Rainbow mode, Mirror mode, Chaos mode
- **Audio joins in** - Each color has its own musical note

## Why This Game?

**Color Cascade** is perfect for Tiers 5-8 because it introduces intermediate 6502 assembly concepts while leveraging the C64's strengths:

- **Graphics Programming**: Direct memory access for color and PETSCII manipulation
- **Arrays**: Storing and manipulating color sequences in memory
- **Sound**: Generating tones through SID chip programming
- **Timing**: Creating smooth animations using assembly timing loops
- **User Experience**: Polished presentation through optimized assembly code

## C64-Specific Features

This game could only exist on the Commodore 64:

- **16 vibrant colors** in unexpected combinations
- **PETSCII graphics** for animated backgrounds and effects
- **Built-in sound** capabilities for audio feedback
- **Character-based display** perfect for pattern games
- **Instant response** from BASIC commands

## Progressive Development

### Tiers 5-8 Development Roadmap

**Tier 5**: Basic color display
- Show colors using background/border changes
- Simple pattern generation
- Basic input handling
- Pattern verification

**Tier 6**: Enhanced presentation
- PETSCII animations and effects
- Sound for each color
- Smooth timing and delays
- Better visual feedback

**Tier 7**: Advanced gameplay
- Multiple difficulty levels
- Special pattern types (mirror, reverse)
- Bonus scoring systems
- Player progression tracking

**Tier 8**: Polish and features
- High score table with initials
- Multiple game modes
- Visual effects and screen transitions
- Professional presentation

## Technical Challenges

**Color Cascade** introduces key programming concepts:

- **Array manipulation** for storing and comparing sequences
- **Graphics programming** using the C64's color capabilities
- **Sound generation** with POKE commands to sound registers
- **Timing control** for animations and user input windows
- **String handling** for high score names and formatting
- **Subroutines** for organizing increasingly complex code

## Sample Gameplay

```
**** COLOR CASCADE ****

Level 3 - Sequence Length: 5

Watch the pattern...

[Screen shows: RED -> BLUE -> YELLOW -> GREEN -> PURPLE]
♪ Do-Re-Mi-Fa-Sol ♪

Now repeat the pattern!
Use keys: R=Red, B=Blue, Y=Yellow, G=Green, P=Purple

Your turn: R-B-Y-G-P

PERFECT! +500 points

Bonus Round: Mirror Mode!
Can you play the pattern backwards?

Total Score: 2,350
```

## Learning Outcomes

Building **Color Cascade** teaches:

1. **Visual programming** - Understanding how computers create graphics
2. **Data structures** - Arrays for sequence storage and manipulation
3. **User interface design** - Creating intuitive, responsive controls
4. **Audio programming** - Adding sound to enhance gameplay
5. **Code organization** - Breaking complex programs into manageable pieces

## The "Wow" Factor

**Color Cascade** is designed to create those magical moments when students realize they're not just learning programming - they're creating something genuinely entertaining that showcases the unique character of the Commodore 64.

The game's cascading colors and musical tones demonstrate that even with 1982 technology, creativity and good programming can produce experiences that feel modern and engaging.