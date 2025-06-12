---
title: "Number Quest"
system: "commodore-64"
phase_number: 1
tier_range: "1-4"
genre: "Logic/Educational"
description: "An intelligent number guessing game that adapts to your playing style and teaches 6502 assembly programming fundamentals through gameplay."
gameplay_mechanics:
  - "Player guesses numbers within a range"
  - "Game provides intelligent hints (higher/lower)"
  - "Adaptive difficulty based on player performance"
  - "Score system based on efficiency"
  - "Multiple game modes (Classic, Speed, Challenge)"
technical_features:
  - "6502 assembly variables and memory management"
  - "User input validation in assembly"
  - "Simple AI for hint generation using 6502 opcodes"
  - "Score tracking and high scores in assembly"
  - "Menu system with assembly-driven interface"
concepts_demonstrated:
  - "Memory locations and data storage"
  - "Conditional branches and jumps"
  - "Loops using 6502 assembly instructions"
  - "Keyboard input handling in assembly"
  - "Program flow control with jumps and branches"
  - "Game state management using memory locations"
estimated_dev_time: "4-6 lessons"
source_code_available: true
playable_online: true
order: 1
---

# Number Quest

**Number Quest** is your first complete game project on the Commodore 64. What starts as a simple "guess the number" concept evolves into an intelligent, adaptive game that demonstrates core programming principles.

## The Game Concept

The computer thinks of a number, and you try to guess it. But this isn't just any guessing game:

- **Adaptive Intelligence**: The game learns from your guessing patterns and adjusts difficulty
- **Multiple Modes**: Classic mode, Speed Challenge, and Progressive Difficulty
- **Smart Hints**: Instead of just "higher/lower," the game provides contextual clues
- **Achievement System**: Unlock new challenges based on your performance

## Why This Game?

**Number Quest** is perfect for Phase 1 because it introduces every fundamental programming concept:

- **Variables**: Storing the secret number, player guesses, attempts, and scores
- **Input/Output**: Getting player guesses and displaying feedback
- **Conditionals**: Comparing guesses to the target number
- **Loops**: Continuing until the player wins or quits
- **Subroutines**: Organizing code into reusable sections using JSR/RTS

## Progressive Development

### Tiers 1-4 Development Roadmap

**Tier 1**: Basic guessing game
- Generate random number
- Accept player input
- Provide higher/lower feedback
- Count attempts

**Tier 2**: Enhanced feedback
- Input validation
- Better user interface
- Play again functionality
- Basic scoring

**Tier 3**: Multiple difficulty levels
- Adjustable number ranges
- Time pressure mode
- Hint system
- Score persistence

**Tier 4**: Intelligence and polish
- Adaptive difficulty based on performance
- Multiple game modes
- High score table
- Professional presentation

## Learning Outcomes

By building **Number Quest**, students will:

1. **Master 6502 assembly fundamentals** through practical application
2. **Understand program flow** by seeing how games maintain state at the machine level
3. **Learn debugging skills** by testing edge cases and tracing assembly execution
4. **Experience software design** by planning features and implementing them in assembly
5. **Gain confidence** by creating something genuinely fun and shareable in assembly language

## Technical Challenges

The game introduces important programming challenges:

- **Random number generation** using the C64's built-in RND function
- **Input validation** to handle invalid entries gracefully
- **Data persistence** for high scores (save to tape/disk)
- **User experience design** with clear prompts and feedback
- **Code organization** as the program grows more complex

## Sample Gameplay

```
**** NUMBER QUEST ****

I'm thinking of a number between 1 and 100.
Can you guess it?

Attempt 1: ?42
Too low! The number is higher than 42.

Attempt 2: ?75
Getting warmer! Try a bit higher.

Attempt 3: ?83
Excellent! You found it in 3 attempts!

Your Score: 850 points
Personal Best: 3 attempts

Play again? (Y/N)
```

**Number Quest** proves that even simple concepts can create engaging, educational experiences when implemented thoughtfully. It's the perfect introduction to game programming on the Commodore 64!