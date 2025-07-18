---
tier_number: 1
phase_number: 1
system: "nintendo-entertainment-system"
title: "Core Game Mechanics"
description: "Build the essential foundation of Underground Assault by implementing hardware sprites, controller input, and fundamental combat systems."
learning_objectives:
  - "Create smooth animations using the PPU's capabilities"
  - "Implement responsive NES controller input"
  - "Design and manage hardware sprites"
  - "Build fundamental game systems with NMI timing"
concepts_introduced:
  - "6502 assembly for the NES architecture"
  - "PPU programming and pattern tables"
  - "Sprite management and OAM updates"
  - "Controller input through shift registers"
  - "NMI timing and VBlank synchronization"
prerequisites:
  - "NES development environment set up"
  - "Basic understanding of 6502 assembly"
  - "Familiarity with NES memory mapping"
estimated_duration: "8-12 hours"
difficulty: "beginner"
lessons: 4
order: 1
---

# Tier 1: Core Game Mechanics

Welcome to the first tier of NES game development! In these four lessons, you'll build the core mechanics of **Underground Assault**, establishing the foundation for a complete action game that showcases the NES's legendary capabilities.

## What You'll Build in This Tier

By the end of Tier 1, you'll have:

- An animated starfield background using the PPU
- A player-controlled ship with hardware sprite graphics
- A plasma cannon system with multiple projectiles
- Collision detection foundations for gameplay

## The NES Development Approach

The NES's custom hardware shapes how we build games:

### Hardware Sprites
The NES's sprite system was revolutionary for its time:
- 64 hardware sprites rendered automatically by the PPU
- 8×8 or 8×16 pixel sprites with 4 colors each
- Sprite DMA for updating all sprites in one operation
- Automatic priority and transparency handling

### Picture Processing Unit (PPU)
The PPU handles all graphics independently of the CPU:
- Pattern tables store tile graphics
- Nametables define background layouts
- OAM (Object Attribute Memory) controls sprites
- Hardware scrolling for smooth movement

### Controller Input
The NES controller uses a shift register design:
- 8 buttons read through a serial interface
- Frame-perfect input response
- Simple but effective control scheme
- Direct hardware register access

## Lesson Overview

### Lesson 1: Animated Starfield
Create a space backdrop using the PPU's tile-based graphics. You'll learn about pattern tables, nametables, palettes, and the fundamentals of NES graphics programming.

### Lesson 2: Adding the Player Ship  
Implement a responsive player-controlled ship using hardware sprites. Master controller input reading, sprite attributes, and smooth movement with proper timing.

### Lesson 3: Plasma Cannons
Add a projectile system using multiple hardware sprites. Learn about sprite management, object pooling, and creating smooth animations at 60 FPS.

### Lesson 4: Collision Detection
Implement collision detection between sprites. Understand boundary checking, efficient algorithms, and the foundations of gameplay interaction.

## Technical Concepts Covered

Throughout this tier, you'll master:

- **Memory Mapping**: Understanding the NES's memory layout
- **PPU Programming**: Working with tiles, sprites, and palettes
- **NMI Timing**: Using VBlank for consistent game timing
- **Sprite DMA**: Efficient sprite updates every frame
- **Controller Reading**: Shift register input handling
- **6502 Optimization**: Writing efficient assembly code

## Development Tips

### Understand the Hardware
The NES's limitations are also its strengths. Hardware sprites and scrolling enable effects that were difficult on other systems.

### Use the Right Tools
- **ca65**: Powerful macro assembler with good error messages
- **FCEUX**: Excellent debugger for development
- **NES Screen Tool**: For creating graphics

### Test on Real Hardware
While emulators are great for development, testing on real hardware ensures compatibility.

### Frame Timing is Critical
The NES runs at ~60 FPS (NTSC). Design your game logic around this timing.

## NES Programming Patterns

### The Game Loop
```
1. Wait for VBlank (NMI)
2. Update graphics during VBlank
3. Read controller input
4. Update game logic
5. Repeat
```

### Sprite Management
- Use sprite 0 for special purposes (like split-screen)
- Group sprites logically in OAM
- Hide unused sprites off-screen
- Consider sprite flickering for more than 8 per scanline

### Memory Organization
- Zero Page: Fast variables and pointers
- RAM: Game state and buffers
- PRG-ROM: Your game code
- CHR-ROM: Graphics data

## Ready to Start?

Lesson 1 awaits! You'll begin by creating an animated starfield that sets the stage for underground combat. Fire up your assembler, load your emulator, and let's bring Underground Assault to life!

Remember: every legendary NES game started with someone learning these exact concepts. Your journey into NES homebrew development begins now! 🕹️