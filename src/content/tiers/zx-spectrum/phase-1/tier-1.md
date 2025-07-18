---
tier_number: 1
phase_number: 1
system: "zx-spectrum"
title: "Core Game Mechanics"
description: "Build the essential foundation of Quantum Shatter by implementing smooth animations, player controls, and basic combat systems."
learning_objectives:
  - "Create smooth animations using the ZX Spectrum's display system"
  - "Implement responsive keyboard input handling"
  - "Design character-based graphics and sprites"
  - "Build fundamental game systems like movement and shooting"
concepts_introduced:
  - "Z80 assembly language fundamentals"
  - "Screen memory organization and character graphics"
  - "Attribute memory and color management"
  - "Keyboard matrix reading and input handling"
  - "Game loop timing and frame synchronization"
prerequisites:
  - "ZX Spectrum development environment set up"
  - "Basic understanding of Z80 assembly"
  - "Familiarity with the Spectrum's memory map"
estimated_duration: "8-12 hours"
difficulty: "beginner"
lessons: 4
order: 1
---

# Tier 1: Core Game Mechanics

Welcome to the first tier of ZX Spectrum game development! In these four lessons, you'll build the core mechanics of **Quantum Shatter**, establishing the foundation for a complete arcade game.

## What You'll Build in This Tier

By the end of Tier 1, you'll have:

- An animated starfield background that brings space to life
- A player-controlled spaceship with smooth movement
- A projectile system for firing at enemies
- Basic collision detection foundations

## The ZX Spectrum Approach

The Spectrum's unique architecture shapes how we build games:

### Character-Based Graphics
Instead of pixel-by-pixel drawing, the Spectrum excels at character-based graphics. You'll learn to:
- Design custom 8×8 character graphics
- Use the screen's character grid efficiently
- Create smooth animation through character updates

### Attribute System
The Spectrum's color attribute system is both a limitation and an opportunity:
- Each 8×8 character block shares the same two colors
- Creative use of attributes creates distinctive visual styles
- Efficient attribute management is key to performance

### Keyboard Input
The Spectrum's keyboard matrix provides direct hardware access:
- Read multiple keys simultaneously
- Implement responsive controls without OS overhead
- Handle the classic QAOP control scheme

## Lesson Overview

### Lesson 1: Animated Starfield
Create a mesmerizing space backdrop using the Spectrum's display capabilities. You'll learn about screen memory layout, character graphics, and smooth animation techniques.

### Lesson 2: Adding the Player Ship
Implement a responsive player-controlled ship using custom character graphics. Master keyboard input handling and smooth movement within the character grid.

### Lesson 3: Laser Weaponry
Add a projectile system that lets players fire at enemies. Learn about object pooling, efficient collision detection, and managing multiple moving objects.

### Lesson 4: Collision Detection
Implement the foundations of collision detection between game objects. Understand boundary checking and efficient collision algorithms.

## Technical Concepts Covered

Throughout this tier, you'll master:

- **Screen Memory Organization**: How the Spectrum arranges display data
- **Character Graphics**: Creating and animating 8×8 pixel characters
- **Attribute Memory**: Managing colors and visual effects
- **Keyboard Matrix**: Direct hardware keyboard reading
- **Game Loop Design**: Creating smooth, responsive gameplay
- **Assembly Optimization**: Writing efficient Z80 code

## Development Tips

### Start Simple
Each lesson builds on the previous one. Don't skip ahead—master each concept before moving on.

### Test Frequently
Run your code often in the emulator. Small, incremental changes are easier to debug.

### Understand the Hardware
The Spectrum's limitations foster creativity. Embrace them rather than fighting them.

### Comment Your Code
Z80 assembly can be cryptic. Clear comments help you understand your code later.

## Ready to Start?

Lesson 1 awaits! You'll begin by creating an animated starfield that sets the stage for epic space battles. Fire up your assembler, load your emulator, and let's bring Quantum Shatter to life!

Remember: every great Spectrum game started with someone learning these exact concepts. Your journey into retro game development begins now! 🎮