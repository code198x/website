# Neon Nexus Project Status

## Overview

Created a complete 16-lesson assembly language course for Commodore 64 game development. The course teaches 6502 assembly through building a progressively more complex arcade-style game called "Neon Nexus".

## What We've Built

### Assembly Code Files (Lessons 1-16)

All lesson files are in `/prototype/neon-nexus/lessons/`:

- `lesson-01.s` through `lesson-16.s` - Complete, tested assembly source
- `lesson-01.prg` through `lesson-16.prg` - Compiled executables
- All compile with: `acme -f cbm -o lesson-XX.prg lesson-XX.s`
- All tested in VICE emulator: `x64sc lesson-XX.prg`

### Lesson Guides (Complete Documentation)

All guides are in `/prototype/neon-nexus/lessons/`:

- `lesson-01-guide.md` through `lesson-16-guide.md` - Comprehensive lesson text
- `lesson-guide-template.md` - Template for consistent lesson structure

## Technical Progression

### Lessons 1-4: Fundamentals

1. **Hello World** - First pixel, BASIC loader, screen/color memory
2. **Movement** - Animation, screen position calculation, timing
3. **Keyboard Control** - CIA chip, keyboard matrix scanning
4. **Adding Enemy** - Multiple objects, different behaviors

### Lessons 5-8: Core Game Systems

5. **Boundary Checking** - Screen limits, wrapping vs clamping
6. **Score and UI** - PETSCII text, number display, lives/level
7. **Game States** - Menu, playing, game over, state machine
8. **Multiple Objects** - Arrays, indexed addressing, object pooling

### Lessons 9-12: Advanced Features

9. **Collision Detection** - Position checking (with intentional bug!)
10. **Multiple Enemies** - Three enemies, different speeds, lives system
11. **Enemy Spawning** - Dynamic creation, difficulty scaling
12. **Enemy Behaviors** - Wave motion, tracking, homing, formations

### Lessons 13-16: Polish & Hardware

13. **Proper Collision** - Bounding boxes, debug mode, fixing the bug
14. **Hardware Sprites** - VIC-II sprites, automatic collision detection
15. **Smooth Animation** - Raster interrupts, animation frames, sine tables
16. **Optimization** - Fast clearing, dirty flags, particle effects

## Key Technical Achievements

### Intentional Teaching Moments

- **Lesson 9**: Collision detection has a "stepping over" bug - kept as teachable moment
- **Lesson 13**: Fixes the bug, showing why proper bounding boxes matter
- **Register preservation bug**: X register corruption in delay routine - discovered and fixed

### Progressive Complexity

- Started with PETSCII characters, upgraded to sprites in lesson 14
- Started with simple position checks, upgraded to hardware collision
- Started with main loop timing, upgraded to raster interrupts

### Fixed Issues During Development

1. **Border color same as background** (Lesson 1)
2. **Boundary checking off by 1-2 spaces** (multiple lessons)
3. **PETSCII text corruption** - used screen codes: `!byte $13,$03,$0f,$12,$05,$3a,$00`
4. **Collision timing** - enemies respawn after hit to prevent instant death
5. **Assembly errors** - branch out of range, fixed with JMP
6. **Missing `-f cbm` flag** - needed for proper PRG file format

## Code Patterns Established

### Memory Layout

```
$0801: BASIC stub start
$0820: Main program start
$0340-$0480: Sprite data (lesson 14+)
$0400-$07FF: Screen memory
$D800-$DBE7: Color memory
```

### Standard Structure

1. BASIC stub: `10 SYS 2080`
2. Init routine: Clear screen, set colors, initialize variables
3. Game loop: Input, update, draw, delay
4. Subroutines: Modular functions
5. Data section: Lookup tables, text
6. Variables: At end of file

### Common Techniques

- Lookup tables for optimization
- Unrolled loops for speed
- Dirty flags to avoid unnecessary updates
- Frame counters for timing
- State machines for game flow

## Lesson Guide Structure

Each guide contains:

1. **Opening Hook** - Historical context, why it matters
2. **Code Walkthrough** - 3-5 sections with 10-20 line chunks
3. **Interactive Elements** - 3 experiments to try
4. **Deep Dive** - Technical details, memory maps
5. **Challenge Extensions** - 3-4 advanced exercises
6. **Common Pitfalls** - Mistakes to avoid
7. **Next Steps** - Teaser for next lesson

## What's Next

### Immediate Tasks

- Lessons 17-20 need to be created (sound, music, power-ups, passwords)
- Create index page linking all lessons
- Create quick reference for PETSCII codes, memory map
- Package as complete course

### Enhancement Ideas

- Video demonstrations of each lesson
- Online emulator integration
- Additional challenge solutions
- Port to other C64 assemblers (ca65, KickAssembler)
- Create similar courses for other systems (ZX Spectrum, Amiga, NES)

## Important Notes

### Working Directory

All work done in: `/Users/stevehill/Projects/Code198x/new-code198x/prototype/neon-nexus/lessons/`

### Tools Used

- **Assembler**: ACME
- **Emulator**: VICE (x64sc)
- **Command**: `acme -f cbm -o output.prg input.s`

### Teaching Philosophy

- Code first, explain second
- Small incremental steps
- Learn from bugs
- Historical context matters
- Performance awareness from the start
- Make it fun and engaging

## Session Summary

Over this session, we:

1. Created 8 more assembly lessons (9-16)
2. Fixed collision detection bugs across multiple lessons
3. Discovered and documented the `-f cbm` flag requirement
4. Created comprehensive guides for all 16 lessons
5. Established consistent patterns and teaching methods

The course is now ready for lessons 1-16, taking students from absolute basics to hardware sprites with smooth animation and optimized code.
