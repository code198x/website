---
title: "Rainbow Runner"
system: "zx-spectrum"
phase_number: 1
tier_range: "5-8"
genre: "Platform/Action"
description: "A colorful platform game that embraces the Spectrum's unique color system, teaching Z80 assembly programming through sprite movement, collision detection, and sound programming."
gameplay_mechanics:
  - "Navigate through color-coded platform levels"
  - "Collect rainbow fragments while avoiding obstacles"
  - "Use attribute clash creatively for special effects"
  - "Time-based challenges with increasing difficulty"
  - "Power-ups that change color properties"
technical_features:
  - "Character-based sprite movement using Z80 assembly"
  - "Collision detection within attribute boundaries via assembly"
  - "Sound effects using Z80 assembly and beeper control"
  - "Level design with assembly-driven 8×8 attribute handling"
  - "Smooth scrolling using optimized Z80 routines"
concepts_demonstrated:
  - "Sprite programming with Z80 assembly and character graphics"
  - "Collision detection and response in assembly"
  - "Sound programming and timing using Z80 instructions"
  - "Level design within Z80 assembly and hardware constraints"
  - "Game feel and responsive controls through optimized assembly"
  - "Creative use of technical limitations in assembly programming"
estimated_dev_time: "4-6 lessons"
source_code_available: true
playable_online: true
order: 2
---

# Rainbow Runner

**Rainbow Runner** transforms the ZX Spectrum's attribute clash from a limitation into a gameplay feature, creating a unique platform adventure that could only exist on the Spectrum.

## The Game Concept

Run and jump through levels where color boundaries matter:

- **Attribute-Based Platforming**: Platforms align to 8×8 attribute blocks
- **Color Power-ups**: Changing INK/PAPER colors affects gameplay
- **Clash Effects**: Attribute clash creates special visual effects
- **Rainbow Collection**: Gather color fragments to unlock new areas
- **Speed Challenges**: Time-based gameplay that rewards quick thinking

## Why This Game for Tiers 5-8?

**Rainbow Runner** teaches intermediate Z80 assembly programming:

- **Character Animation**: Moving sprites smoothly using direct memory access
- **Collision Detection**: Working within the attribute grid system via assembly
- **Sound Programming**: Creating effects with Z80 assembly and beeper control
- **Level Design**: Building engaging gameplay within assembly constraints
- **Performance**: Achieving smooth movement through optimized Z80 code

## Spectrum-Specific Design

The game celebrates what makes the Spectrum unique:

- **Attribute Boundaries**: Platforms naturally align to 8×8 blocks
- **Color Gameplay**: Different colors provide different abilities
- **Character Graphics**: Rich use of built-in graphics characters
- **Sound Integration**: Beeper effects synchronized with gameplay
- **Memory Efficiency**: Levels stored compactly as character data

## Progressive Development

### Tiers 5-8 Development Roadmap

**Tier 5**: Basic movement and display
- Character-based sprite movement
- Simple collision detection
- Basic level representation
- Player controls and feedback

**Tier 6**: Sound and effects
- Beeper sound effects for actions
- Visual feedback for collisions
- Power-up collection mechanics
- Basic animation sequences

**Tier 7**: Level design and progression
- Multiple levels with increasing difficulty
- Color-based puzzle elements
- Save/load progress functionality
- Performance optimization

**Tier 8**: Polish and completion
- Smooth gameplay refinement
- Complete level progression
- High score tracking
- Professional presentation

## Technical Challenges

- **Smooth Movement**: Achieving fluid character animation in BASIC
- **Collision Detection**: Efficient checking within attribute constraints
- **Sound Design**: Creating engaging audio with basic beeper
- **Level Storage**: Compact representation of complex level data
- **Performance**: Maintaining responsive gameplay

## Sample Gameplay

```
RAINBOW RUNNER - Level 3: "Spectrum City"

Lives: ♥♥♥   Score: 2,470   Time: 45.2

████████████████████████████████
█............................R.█
█.████.███.████.████.████.████.█
█......███................███.█
█.████.███.████.████.████.███.█
█.█..█.............█..█...█...█
█.█..█.████.████.██☺██.███.█..█
█......████.████.......███....█
████████████████████████████████

R = Red Fragment (3/5 collected)
☺ = You (Currently: BRIGHT 1, INK 2)

Controls: Q/A=Jump, O/P=Left/Right
Special: Hold SPACE = Color Dash Mode

Color Powers Active:
- Blue: Can break blue blocks
- Red: Double jump ability
```

**Rainbow Runner** proves that the Spectrum's unique characteristics aren't limitations—they're features that enable entirely new types of gameplay experiences!