# C64 BASIC: 64-Lesson Curriculum

**Last Updated:** 2025-01-02
**Status:** Week 1 complete, Week 2-8 in development
**Design Principle:** ONE concept, ONE program (20-40 lines), ONE WOW moment per lesson
**Time Constraint:** 15-20 minutes maximum per lesson

---

## Design Constraints

### Critical Rules
1. **No indentation in BASIC code** - BASIC V2 doesn't support it
2. **One concept per lesson** - not textbook chapters
3. **One short program** - 20-40 lines maximum for WOW moment
4. **Immediate payoff** - see something amazing within 15-20 minutes
5. **No "Insight" blocks** - those are for Assembly lessons only

### Lesson Structure Template
```markdown
## Why [Topic] Matters
[One paragraph - why this is useful]

## Basic Example
[Simplest possible demonstration - 5-10 lines]

## Practical Example
[Slightly more complex - 10-15 lines]

## WOW Moment: [Exciting Title]
[The main program - 20-40 lines]
[Screenshot/description of impressive result]

## Quick Reference
[Essential syntax only]

## What You've Learnt
[Bullet points - what they can now do]
```

---

## Week 1 (Lessons 1-8): BASIC Foundations ✅

**Status:** COMPLETE - existing lessons are properly scoped

1. **Lesson 01**: First Program
2. **Lesson 02**: Variables & Math
3. **Lesson 03**: FOR Loops
4. **Lesson 04**: User Input
5. **Lesson 05**: IF Statements
6. **Lesson 06**: GOTO & Simple Games
7. **Lesson 07**: Colors & Sound
8. **Lesson 08**: Screen Control Basics

---

## Week 2 (Lessons 9-16): Core Programming

**Status:** Lesson 9 complete (arrays), needs 7 more

### Lesson 9: Arrays - Store Multiple Values ✅
- **Concept**: DIM, accessing array elements
- **WOW moment**: Scrolling starfield with 20 stars
- **Program**: 15 lines, arrays for X/Y positions
- **Key pattern**: Parallel arrays for related data

### Lesson 10: Subroutines with GOSUB
- **Concept**: GOSUB/RETURN for reusable code
- **WOW moment**: Explosion effect at random positions
- **Program**: Subroutine called 5 times with different X/Y
- **Key pattern**: 1000s for drawing, 2000s for logic, etc.

### Lesson 11: String Manipulation Basics
- **Concept**: LEFT$, RIGHT$, MID$, LEN
- **WOW moment**: Text adventure parser ("GET SWORD")
- **Program**: Parse 2-word commands, respond to actions
- **Key pattern**: String splitting for input handling

### Lesson 12: DATA Statements & READ
- **Concept**: DATA/READ/RESTORE for storing lists
- **WOW moment**: Maze from DATA (10x10 grid)
- **Program**: Read maze data, draw with characters
- **Key pattern**: Level data storage

### Lesson 13: Making Decisions with IF/THEN
- **Concept**: Multiple conditions, AND/OR operators
- **WOW moment**: Collision detection (sprite vs walls)
- **Program**: Move character, check bounds
- **Key pattern**: Boundary checking

### Lesson 14: Nested Loops
- **Concept**: FOR loops inside FOR loops
- **WOW moment**: Checkerboard pattern (8x8)
- **Program**: Two loops for rows/columns
- **Key pattern**: Grid generation

### Lesson 15: Simple Functions (FN)
- **Concept**: DEF FN for calculations
- **WOW moment**: Projectile arc calculator
- **Program**: Calculate bullet trajectory with FN
- **Key pattern**: Reusable math

### Lesson 16: Error Handling with ON/GOTO
- **Concept**: ON X GOTO for menus/state machines
- **WOW moment**: 3-state game (title/play/gameover)
- **Program**: State switching with ON/GOTO
- **Key pattern**: Game state management

---

## Week 3 (Lessons 17-24): Graphics & Sound

**Theme:** Direct hardware control for immediate visual/audio feedback

### Lesson 17: Screen Memory Intro
- **Concept**: POKE 1024+position, character code
- **WOW moment**: Draw one letter at exact position
- **Program**: 10 lines - place character anywhere
- **Key pattern**: Position = Y*40+X

### Lesson 18: Color Memory Basics
- **Concept**: POKE 55296+position, color code
- **WOW moment**: Rainbow text effect
- **Program**: Write text, cycle colors
- **Key pattern**: Screen and color as parallel systems

### Lesson 19: Character Set Graphics
- **Concept**: PETSCII characters for drawing
- **WOW moment**: Draw a simple face or house
- **Program**: Assemble picture from characters
- **Key pattern**: Character art composition

### Lesson 20: Simple Sprite (one sprite, stationary)
- **Concept**: Enable sprite 0, set pointer
- **WOW moment**: Show a single sprite on screen
- **Program**: Define sprite data, enable it
- **Key pattern**: Sprite setup basics

### Lesson 21: Moving a Sprite
- **Concept**: POKE sprite X/Y registers
- **WOW moment**: Sprite moves in a circle
- **Program**: Calculate circular motion
- **Key pattern**: Sprite positioning

### Lesson 22: Sound with POKE (one note)
- **Concept**: SID chip registers for single note
- **WOW moment**: Play different notes on keypress
- **Program**: Piano keys (A-H play notes)
- **Key pattern**: Note frequency table

### Lesson 23: Simple Music Sequence
- **Concept**: Loop through note array with delays
- **WOW moment**: Play short melody (5-8 notes)
- **Program**: DATA for notes, READ and play
- **Key pattern**: Music sequencing

### Lesson 24: Sprite Collision Detection
- **Concept**: PEEK collision registers
- **WOW moment**: Sprite changes color on collision
- **Program**: Two sprites, detect when they touch
- **Key pattern**: Hardware collision detection

---

## Week 4 (Lessons 25-32): Building Game Elements

**Theme:** Combining concepts into game mechanics

### Lesson 25: Keyboard Input for Movement
- **Concept**: GET K$, move sprite based on key
- **WOW moment**: WASD controls for sprite
- **Program**: Smooth 4-direction movement
- **Key pattern**: Input handling

### Lesson 26: Sprite Animation (flip between 2 frames)
- **Concept**: Change sprite pointer to animate
- **WOW moment**: Walking animation (2 frames)
- **Program**: Alternate frames while moving
- **Key pattern**: Frame flipping

### Lesson 27: Score Display
- **Concept**: Print score, update when collecting items
- **WOW moment**: Collect dots, score increases
- **Program**: Sprite collects objects, score updates
- **Key pattern**: HUD management

### Lesson 28: Timer Countdown
- **Concept**: TI variable for time-based events
- **WOW moment**: 10-second countdown timer
- **Program**: Race against the clock
- **Key pattern**: Time-limited gameplay

### Lesson 29: Random Events
- **Concept**: RND for unpredictable behavior
- **WOW moment**: Items spawn at random positions
- **Program**: Collectibles appear randomly
- **Key pattern**: Procedural placement

### Lesson 30: Simple Enemy AI (chase)
- **Concept**: Move enemy toward player position
- **WOW moment**: Enemy follows player
- **Program**: Basic chase behavior
- **Key pattern**: AI movement

### Lesson 31: Boundaries & Wrapping
- **Concept**: Keep sprites on screen or wrap edges
- **WOW moment**: Pac-Man style screen wrapping
- **Program**: Sprite wraps left-right, top-bottom
- **Key pattern**: Edge handling

### Lesson 32: Health/Lives System
- **Concept**: Track lives, game over when zero
- **WOW moment**: 3-life system with display
- **Program**: Lose life on collision, game over state
- **Key pattern**: Player state management

---

## Week 5 (Lessons 33-40): Complete Mini-Games

**Theme:** Each lesson is a playable game in 20-40 lines

### Lesson 33: Catch Game (falling objects)
- **WOW moment**: Catch falling items with basket
- **Mechanics**: Horizontal movement, gravity, scoring
- **Pattern**: Vertical scrolling gameplay

### Lesson 34: Maze Navigation
- **WOW moment**: Navigate maze with walls
- **Mechanics**: Collision with walls blocks movement
- **Pattern**: Grid-based movement

### Lesson 35: Shooting Game
- **WOW moment**: Shoot targets, they disappear
- **Mechanics**: Fire bullet, hit detection
- **Pattern**: Projectile mechanics

### Lesson 36: Reaction Time Game
- **WOW moment**: Press key when target appears
- **Mechanics**: Measure reaction time in TI
- **Pattern**: Timing challenges

### Lesson 37: Memory/Pattern Game
- **WOW moment**: Simon Says - repeat sequence
- **Mechanics**: Show pattern, player repeats
- **Pattern**: Sequence memory

### Lesson 38: Simple Platformer Jump
- **WOW moment**: Jump between platforms
- **Mechanics**: Gravity, jump arc, landing
- **Pattern**: Platformer physics

### Lesson 39: Race/Obstacle Course
- **WOW moment**: Dodge obstacles, reach finish
- **Mechanics**: Scrolling obstacles, timer
- **Pattern**: Endless runner

### Lesson 40: High Score Table
- **WOW moment**: Save top 5 scores with names
- **Mechanics**: Input name, sort scores, display
- **Pattern**: Persistent leaderboard

---

## Week 6 (Lessons 41-48): Advanced Techniques

**Theme:** Hardware tricks and optimization

### Lesson 41: Smooth Scrolling Text
- **WOW moment**: Message scrolls smoothly across screen
- **Technique**: Hardware scroll registers
- **Pattern**: Marquee text

### Lesson 42: Multi-Sprite Patterns
- **WOW moment**: Formation of 8 sprites moving together
- **Technique**: Relative positioning
- **Pattern**: Coordinated movement

### Lesson 43: Custom Character Set
- **WOW moment**: Define 4 custom characters, use in game
- **Technique**: Redefine character ROM
- **Pattern**: Custom graphics

### Lesson 44: Advanced Sound (SID register control)
- **WOW moment**: Sound effects (laser, explosion, jump)
- **Technique**: Envelope, waveform, filter
- **Pattern**: SFX library

### Lesson 45: Screen Transitions
- **WOW moment**: Fade in/out, wipe effects
- **Technique**: Color manipulation, screen clearing patterns
- **Pattern**: Scene changes

### Lesson 46: Save/Load to Disk
- **WOW moment**: Save game state, load it back
- **Technique**: OPEN, PRINT#, INPUT#
- **Pattern**: Persistence

### Lesson 47: Raster Timing Basics
- **WOW moment**: Color bar splits screen
- **Technique**: Wait for raster line, change color
- **Pattern**: Mid-screen effects

### Lesson 48: BASIC Performance Tips
- **WOW moment**: Compare slow vs fast version
- **Technique**: Variable reuse, calculated GOTOs
- **Pattern**: Optimization techniques

---

## Week 7 (Lessons 49-56): Polish & Features

**Theme:** Making games feel professional

### Lesson 49: Title Screen with Animation
- **WOW moment**: Animated title with bouncing logo
- **Elements**: Graphics, text, attract mode
- **Pattern**: Game presentation

### Lesson 50: Menu System
- **WOW moment**: Navigate options with cursor
- **Elements**: Selection indicator, confirmation
- **Pattern**: UI navigation

### Lesson 51: Game States (title/play/game over)
- **WOW moment**: Complete flow from title to game
- **Elements**: State machine with transitions
- **Pattern**: Game structure

### Lesson 52: Difficulty Levels
- **WOW moment**: Choose easy/normal/hard
- **Elements**: Speed multipliers, enemy count
- **Pattern**: Scalable challenge

### Lesson 53: Power-Ups & Collectibles
- **WOW moment**: Temporary invincibility pickup
- **Elements**: Timer-based effects, visual feedback
- **Pattern**: Power-up system

### Lesson 54: Boss Fight Basics
- **WOW moment**: Enemy with health bar, attack patterns
- **Elements**: Multiple hit points, movement patterns
- **Pattern**: Boss encounters

### Lesson 55: Attract Mode/Demo
- **WOW moment**: AI plays the game automatically
- **Elements**: Scripted or simple AI gameplay
- **Pattern**: Demo mode

### Lesson 56: Instructions Screen
- **WOW moment**: Show controls and rules before playing
- **Elements**: Multi-page instructions, screenshots
- **Pattern**: Tutorial presentation

---

## Week 8 (Lessons 57-64): Complete Projects

**Theme:** Polished games combining all techniques

### Lesson 57: Text Adventure Game
- **WOW moment**: Multi-room adventure with inventory
- **Scope**: 4 rooms, 3 items, win condition
- **Techniques**: String parsing, state management

### Lesson 58: Puzzle Game (Sokoban-style)
- **WOW moment**: Push boxes to targets
- **Scope**: 3 levels, undo move
- **Techniques**: Grid logic, level data

### Lesson 59: Arcade Action Game
- **WOW moment**: Shoot waves of enemies
- **Scope**: 3 enemy types, power-ups, scoring
- **Techniques**: Sprite management, collision

### Lesson 60: Strategy Game
- **WOW moment**: Turn-based battle (player vs computer)
- **Scope**: 3 units, simple AI
- **Techniques**: Turn logic, AI decisions

### Lesson 61: Quiz/Trivia Game
- **WOW moment**: Multiple choice questions, scoring
- **Scope**: 10 questions, timer per question
- **Techniques**: DATA storage, input validation

### Lesson 62: Sports Game (Pong-style)
- **WOW moment**: 2-player paddle game
- **Scope**: Ball physics, scoring to 5
- **Techniques**: Collision angles, multiplayer input

### Lesson 63: Rhythm/Music Game
- **WOW moment**: Press keys in time with music
- **Scope**: 4 notes, timing judgment
- **Techniques**: TI synchronization, audio cues

### Lesson 64: The BASIC Ceiling
- **WOW moment**: Show what BASIC CAN'T do well
- **Content**: Demonstrate slow scrolling, sprite limits
- **Bridge**: "Here's where Assembly takes over..."
- **Transition**: Natural lead into Transition Course

---

## Transition Course (8 Lessons)

**After Lesson 64, learners move to the Transition Course**

Detailed curriculum in separate document, but overview:

1. BASIC Hits the Wall
2. Assembly Demo
3. 6502 Basics
4. First Assembly Program
5. Hybrid BASIC+Assembly
6. Fix the Bottleneck
7. Memory Map Tour
8. Next Steps → Assembly Course

---

## Development Notes

### Current Status
- **Week 1**: ✅ Complete (8 lessons)
- **Week 2**: 🟡 In progress (1/8 complete - Lesson 9 done)
- **Week 3-8**: ⚪ Not started

### Quality Checklist (per lesson)
- [ ] No indented BASIC code (flush left after line number)
- [ ] One primary concept only
- [ ] Main program 20-40 lines maximum
- [ ] WOW moment is immediate and impressive
- [ ] Can be completed in 15-20 minutes
- [ ] No "Insight" blocks (wrong course)
- [ ] Links to previous/next lessons work
- [ ] Screenshot placeholder noted if needed
- [ ] Code samples created in `/code-samples/commodore-64/basic/week-N/lesson-NN/` directory
- [ ] Main WOW program saved as `main.bas` in code-samples
- [ ] Supporting examples saved as `example-1.bas`, `example-2.bas`, etc.

### Known Issues to Avoid
1. **Over-explaining** - keep prose tight, show don't tell
2. **Multiple concepts** - resist cramming 3 topics into one lesson
3. **Long programs** - if main example exceeds 40 lines, split the lesson
4. **Textbook syndrome** - this is cookbook, not reference manual

### File Naming Convention
```
/week-N/lesson-NN.mdx
```

Where N is week (1-8) and NN is lesson (01-64)

---

## Historical Context

**Why 64 lessons?**
- Iconic number for C64 (64KB)
- Power of 2 (8 weeks × 8 lessons)
- Manageable scope for complete curriculum
- Previous attempt had 32, felt too rushed

**Why we reset everything after Week 1?**
- Original Week 2-6 lessons averaged 500+ lines each
- Multiple concepts per lesson (impossible to complete in 15-20 minutes)
- Example: Lesson 17 had 12 programs covering screen codes, PETSCII, color memory, scrolling, buffering
- Should have been 3-4 separate lessons

**Design Philosophy**
Inspired by 1980s compute! magazine type-ins:
- One program per article
- Immediate payoff
- "WOW look what I can make this thing do!"
- Not academic - FUN first

---

**Document Version:** 1.0
**Supersedes:** All previous curriculum documents
**Next Review:** After Week 2 completion
