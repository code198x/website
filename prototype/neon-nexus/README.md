# Neon Nexus - Complete Game Prototype

This is the complete Neon Nexus game that will be broken down into 32 lessons across Tier 1.

## Features Implemented

### Tier 1 Features (Lessons 1-32)

- [x] Basic screen setup and colors
- [x] Player character display and movement
- [x] Keyboard input handling
- [x] Simple enemy spawning and movement
- [x] Basic collision detection
- [x] Score display
- [x] Game over condition
- [x] Screen boundary checking

### Future Tiers (Planning)

- [ ] Multiple enemy types (Tier 2)
- [ ] Shooting mechanics (Tier 2)
- [ ] Power-ups (Tier 2)
- [ ] Sprite graphics (Tier 3)
- [ ] Sound effects (Tier 3)
- [ ] Boss battles (Tier 4)
- [ ] High score table (Tier 4)

## Building and Running

```bash
# Build the game
./build.sh

# Run in VICE emulator
x64sc neon-nexus.prg
```

In the emulator, type `RUN` to start the game.

## Controls

- Arrow keys: Move player
- Goal: Avoid the red enemies
- Score increases over time

## Game Architecture

The complete game demonstrates:

1. **Main Loop Structure** - Init, game loop, cleanup
2. **Input System** - Keyboard reading and response
3. **Game State** - Player position, enemies, score
4. **Display System** - Character-based graphics
5. **Collision Detection** - Simple box collision
6. **Timing** - Frame-based game loop

## Lesson Breakdown Plan

This complete game will be broken into 32 incremental lessons:

**Lessons 1-8: Foundation**

1. Screen setup and colors
2. Display a character
3. Move character with input
4. Screen boundaries
5. Score display
6. Data structures
7. Game loop structure
8. Basic collision

**Lessons 9-16: Enemy System** 9. Enemy spawning 10. Enemy movement 11. Multiple enemies 12. Enemy collision 13. Game over state 14. Random elements 15. Enemy patterns 16. Difficulty scaling

**Lessons 17-24: Enhancement** 17. Better input handling 18. Improved graphics 19. Animation basics 20. Sound effects 21. Power-ups 22. Multiple lives 23. Level progression 24. Visual polish

**Lessons 25-32: Completion** 25. Menu system 26. High scores 27. Save system 28. Final polish 29. Performance optimization 30. Bug fixing 31. Playtesting 32. Game completion

Each lesson will have a working, incremental build that adds one specific feature.
