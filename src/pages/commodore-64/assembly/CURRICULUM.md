# Commodore 64 Assembly Programming - CURRICULUM

**AUTHORITATIVE SPECIFICATION - All lesson content must follow this structure**

Version: 1.0.0
Total Lessons: 1024
Structure: 8 Phases × 8 Tiers × 16 Lessons
Duration: ~256-340 hours of instruction

## Course Philosophy

This comprehensive assembly course teaches professional C64 game development through genre-based progression. Each phase focuses on specific game genres and techniques, building from fundamentals to commercial-quality games on original hardware and modern enhancements.

**Key Principles:**
- Genre-driven learning (12 complete genres)
- Commercial quality as the goal
- Powers of 2 structure (1024 = 2^10 lessons)
- Every tier produces a concrete deliverable
- 15-20 minutes per lesson maximum
- Progressive complexity within each phase

## Prerequisites

- Complete C64 BASIC course (all 64 lessons)
- Understanding of BASIC game development concepts
- Familiarity with C64 hardware from user perspective

## Course Structure

### Phase Progression
1. **Foundations** - Assembly basics + simple genres
2. **Classic Arcade** - Traditional arcade game techniques
3. **Action & Sports** - Complex movement and physics
4. **Complex Games** - Deep systems (platformers, RPGs)
5. **Elite-Style Simulation** - Most complex single game (128 lessons)
6. **Strategy & Systems** - Advanced AI, music, optimization
7. **Modern Hardware** - MEGA65, SuperCPU, REU, cartridges
8. **Advanced Mastery** - Demoscene, recent discoveries, capstone projects

### Lesson Time Constraints
- **15-20 minutes maximum per lesson**
- Each tier (16 lessons) = 4-5 hours total
- Each phase (128 lessons) = 32-43 hours total

### Deliverable Requirements
Every tier must produce a concrete, runnable deliverable:
- Working game prototype, or
- Complete game system, or
- Polished commercial-quality game, or
- Technical demonstration

---

## Phase 1: Foundations (Lessons 1-128)

**Content:** Fundamentals (64) + Text Adventures (32) + Puzzle/Logic (32)
**Goal:** Establish assembly mastery and complete two simple genres

### Tier 1: Assembly Basics (Lessons 1-16)
**Topics:**
- Toolchain setup (ACME, VICE, Docker)
- 6502 CPU architecture & instruction set
- Memory map essentials
- First programs (screen clear, border colors, text output)

**Deliverable:** "Hello World" programs with screen manipulation

### Tier 2: Input & Loops (Lessons 17-32)
**Topics:**
- Keyboard scanning
- Joystick reading
- Game loop fundamentals
- Frame timing with raster interrupts

**Deliverable:** Interactive demo (move character with input)

### Tier 3: Sprites & Graphics (Lessons 33-48)
**Topics:**
- VIC-II sprite basics
- Sprite movement and collision
- Character set manipulation
- Simple animation

**Deliverable:** Mini arcade game (Pong or simple shooter)

### Tier 4: Advanced Fundamentals (Lessons 49-64)
**Topics:**
- Zero-page optimization
- Subroutines and stack management
- Data structures in assembly
- Debugging techniques

**Deliverable:** Fundamentals complete, polished demo

### Tier 5: Text Adventure Framework (Lessons 65-80)
**Topics:**
- Text parsing engine
- Room/location system
- Command interpreter (verb/noun)
- Screen layout for text games

**Deliverable:** Text adventure framework with navigation

### Tier 6: Text Adventure Complete (Lessons 81-96)
**Topics:**
- Inventory system
- Object interactions
- Save/load systems
- Narrative scripting

**Deliverable:** Complete text adventure game

### Tier 7: Puzzle/Logic Core (Lessons 97-112)
**Topics:**
- Tile engine fundamentals
- Grid-based movement
- Push/pull mechanics (Boulder Dash style)
- Level data structures

**Deliverable:** Working puzzle game prototype

### Tier 8: Puzzle/Logic Complete (Lessons 113-128)
**Topics:**
- Multiple level system
- Logic gates and switches
- Animation and polish
- Enemy AI (if applicable)

**Deliverable:** Polished puzzle game with 8+ levels

---

## Phase 2: Classic Arcade (Lessons 129-256)

**Content:** Arcade Shooter (64) + Rhythm Games (32) + Beat 'em Up (32)
**Goal:** Master sprite multiplexing, scrolling, and arcade game patterns

### Tier 1: Shooter Fundamentals (Lessons 129-144)
**Topics:**
- Player ship movement and control
- Bullet spawning and physics
- Basic enemy movement
- Screen boundary handling

**Deliverable:** Simple Space Invaders-style shooter

### Tier 2: Enemy Patterns & Waves (Lessons 145-160)
**Topics:**
- Formation flying
- Wave spawning systems
- Enemy bullet patterns
- Scoring system

**Deliverable:** Wave-based shooter with patterns

### Tier 3: Smooth Scrolling (Lessons 161-176)
**Topics:**
- Character-based scrolling
- Smooth hardware scrolling
- Multi-directional scrolling
- Parallax backgrounds

**Deliverable:** Horizontal scroller (Uridium-style)

### Tier 4: Shooter Polish (Lessons 177-192)
**Topics:**
- Sprite multiplexing for bullet hell
- Power-ups and weapon systems
- Boss battles
- Polish and juice (explosions, screen shake)

**Deliverable:** Complete polished arcade shooter

### Tier 5: Rhythm Core (Lessons 193-208)
**Topics:**
- Beat detection from SID timer
- Input timing windows
- Visual feedback (note highway)
- Scoring based on accuracy

**Deliverable:** Basic rhythm game prototype

### Tier 6: Rhythm Complete (Lessons 209-224)
**Topics:**
- Song data format
- Combo system
- Multiple difficulty levels
- Visual polish and effects

**Deliverable:** Complete rhythm game with 4+ songs

### Tier 7: Beat 'em Up Core (Lessons 225-240)
**Topics:**
- Character animation states (walk, punch, kick)
- Hit detection and combos
- Basic enemy AI
- Depth sorting (pseudo-3D plane)

**Deliverable:** One-on-one fighting prototype

### Tier 8: Beat 'em Up Complete (Lessons 241-256)
**Topics:**
- Multiple enemies on screen
- Weapons and pickups
- Scrolling arena
- Polish and finishing moves

**Deliverable:** Complete beat 'em up (IK+ style)

---

## Phase 3: Action & Sports (Lessons 257-384)

**Content:** Run-and-Gun (64) + Sports (32) + Racing/Pseudo-3D (32)
**Goal:** Complex movement systems and genre-specific physics

### Tier 1: Run-and-Gun Fundamentals (Lessons 257-272)
**Topics:**
- Character controller (run, jump, shoot)
- 8-direction shooting
- Camera following player
- Basic platform collision

**Deliverable:** Contra-style movement prototype

### Tier 2: Exploration & Power-ups (Lessons 273-288)
**Topics:**
- Multi-screen level maps
- Weapon power-ups and switching
- Health/shield systems
- Collectibles and secrets

**Deliverable:** Exploration demo with upgrades

### Tier 3: Advanced Combat (Lessons 289-304)
**Topics:**
- Multiple weapon types
- Smart bomb/special weapons
- Enemy types and behaviors
- Boss fight mechanics

**Deliverable:** Combat-heavy level with boss

### Tier 4: Run-and-Gun Complete (Lessons 305-320)
**Topics:**
- Vehicle sections (if applicable)
- Level variety and themes
- Checkpoint system
- Polish and effects (Turrican-quality)

**Deliverable:** Complete 4-level run-and-gun game

### Tier 5: Sports Core (Lessons 321-336)
**Topics:**
- Player control (dribbling/passing/shooting)
- AI opponents
- Ball physics
- Field/court rendering

**Deliverable:** Simple sports game (football/basketball)

### Tier 6: Sports Complete (Lessons 337-352)
**Topics:**
- Match timer and scoring
- Multiple teams/players
- Referee logic
- Replay system (if applicable)

**Deliverable:** Complete sports game with leagues

### Tier 7: Racing Fundamentals (Lessons 353-368)
**Topics:**
- Track rendering (top-down or pseudo-3D)
- Car physics and controls
- Opponent AI
- Lap timing

**Deliverable:** Simple racing game prototype

### Tier 8: Racing Complete (Lessons 369-384)
**Topics:**
- Advanced pseudo-3D (Revs/Outrun style)
- Track variety and obstacles
- Championship mode
- Polish and speed effects

**Deliverable:** Complete racing game

---

## Phase 4: Complex Games (Lessons 385-512)

**Content:** Platformer (64) + RPG/Adventure (64)
**Goal:** Precision physics and deep RPG systems

### Tier 1: Platformer Physics (Lessons 385-400)
**Topics:**
- Precise pixel-perfect movement
- Variable jump heights
- Gravity and acceleration
- Ground detection and slopes

**Deliverable:** Tight platformer controls demo

### Tier 2: Multi-Screen Platforming (Lessons 401-416)
**Topics:**
- Screen transitions and scrolling
- Level data compression
- Tile-based collision
- Moving platforms

**Deliverable:** Multi-screen platformer level

### Tier 3: Platformer Systems (Lessons 417-432)
**Topics:**
- Enemy patterns and AI
- Item collection and inventory
- Checkpoints and lives
- Hazards (spikes, water, etc.)

**Deliverable:** Full platformer with enemies

### Tier 4: Platformer Complete (Lessons 433-448)
**Topics:**
- Boss battles
- Advanced animation (run cycles, climbing)
- Secret areas and collectibles
- Polish (parallax, particles)

**Deliverable:** Commercial-quality platformer (Mayhem in Monsterland level)

### Tier 5: RPG Fundamentals (Lessons 449-464)
**Topics:**
- Top-down movement and collision
- Map system (multiple areas)
- NPC dialogue system
- Menu framework

**Deliverable:** RPG overworld with NPCs

### Tier 6: RPG Combat & Stats (Lessons 465-480)
**Topics:**
- Turn-based combat system
- Character stats and leveling
- Equipment and inventory
- Monster encounters

**Deliverable:** RPG with working combat

### Tier 7: RPG World Building (Lessons 481-496)
**Topics:**
- Dungeon generation (procedural or designed)
- Quest tracking
- Shop and trading systems
- Party management (if applicable)

**Deliverable:** Explorable RPG world

### Tier 8: RPG Complete (Lessons 497-512)
**Topics:**
- Save/load system (battery-backed or password)
- Full narrative scripting
- Magic/ability systems
- Polish and balancing

**Deliverable:** Complete RPG (Ultima/Bard's Tale quality)

---

## Phase 5: Elite-Style Simulation (Lessons 513-640)

**Content:** Complete Elite-style space trading/combat simulation (128 lessons)
**Goal:** Most complex single game - 3D graphics, procedural universe, economic simulation

### Tier 1: 3D Wireframe Basics (Lessons 513-528)
**Topics:**
- 3D coordinate systems
- Line drawing algorithms
- Rotation matrices (simple 3D math)
- Basic ship models

**Deliverable:** Rotating 3D wireframe ship

### Tier 2: Space Flight (Lessons 529-544)
**Topics:**
- Flight controls (pitch, roll, yaw)
- Acceleration and inertia
- Camera/view system
- HUD overlay

**Deliverable:** Flyable 3D space environment

### Tier 3: Universe Generation (Lessons 545-560)
**Topics:**
- Procedural galaxy generation (seeded)
- Star system data structures
- Planet generation
- Hyperspace/jump mechanics

**Deliverable:** Navigable procedural universe

### Tier 4: Trading Economy (Lessons 561-576)
**Topics:**
- Market system (supply/demand)
- Commodity trading
- Price fluctuations
- Cargo management

**Deliverable:** Working trading simulation

### Tier 5: Combat Systems (Lessons 577-592)
**Topics:**
- Laser weapons
- Targeting systems
- Enemy AI (pirates, police)
- Shield and damage systems

**Deliverable:** Space combat with AI opponents

### Tier 6: Stations & Docking (Lessons 593-608)
**Topics:**
- Docking computer/manual docking
- Station interiors (market, shipyard)
- Ship upgrades
- Missions and contracts

**Deliverable:** Full station interaction

### Tier 7: Advanced Features (Lessons 609-624)
**Topics:**
- Multiple ship types
- Reputation system
- Dynamic events (battles, distress calls)
- Escape pod mechanics

**Deliverable:** Deep simulation systems

### Tier 8: Elite Complete (Lessons 625-640)
**Topics:**
- Save system (commander persistence)
- Optimization (fast 3D rendering)
- Polish and balance
- Easter eggs and secrets

**Deliverable:** Commercial-quality Elite clone

---

## Phase 6: Strategy & Systems (Lessons 641-768)

**Content:** Strategy/Tactics (64) + Music/Sound (32) + Optimization (32)
**Goal:** Advanced AI, pathfinding, and foundational systems for all games

### Tier 1: Strategy Fundamentals (Lessons 641-656)
**Topics:**
- Grid-based tactical maps
- Unit selection and movement
- Turn system mechanics
- Fog of war

**Deliverable:** Basic tactical movement system

### Tier 2: Combat & Stats (Lessons 657-672)
**Topics:**
- Combat resolution (attack/defense)
- Unit types and abilities
- Terrain effects
- Line of sight

**Deliverable:** Turn-based tactical combat

### Tier 3: AI & Pathfinding (Lessons 673-688)
**Topics:**
- A* pathfinding basics
- Enemy AI decision trees
- Threat assessment
- Movement prediction

**Deliverable:** Competent AI opponent

### Tier 4: Strategy Complete (Lessons 689-704)
**Topics:**
- Campaign/scenario system
- Base building (if applicable)
- Complex UI (multiple menus, info screens)
- Save/load for campaigns

**Deliverable:** Complete strategy game (Laser Squad quality)

### Tier 5: SID Programming Deep Dive (Lessons 705-720)
**Topics:**
- Advanced waveform techniques
- Filter programming (lowpass, highpass, bandpass)
- Ring modulation and sync
- ADSR envelope mastery

**Deliverable:** Advanced SID sound effects library

### Tier 6: Music Systems (Lessons 721-736)
**Topics:**
- Music player/driver architecture
- Multi-channel composition
- Pattern-based music data
- Dynamic music (intensity layers)

**Deliverable:** Complete music player with 3-channel songs

### Tier 7: Code Optimization (Lessons 737-752)
**Topics:**
- Cycle counting fundamentals
- Loop unrolling and optimization
- Table lookups vs calculation
- Self-modifying code techniques

**Deliverable:** Optimized game loop benchmarks

### Tier 8: Memory & Performance (Lessons 753-768)
**Topics:**
- Memory layout optimization
- Compression techniques
- Fast multiplication/division
- Frame budget management

**Deliverable:** Performance analysis toolkit

---

## Phase 7: Modern Hardware (Lessons 769-896)

**Content:** MEGA65 (64) + SuperCPU (32) + REU (16) + Modern Cartridges (16)
**Goal:** Leverage modern C64 hardware enhancements

### Tier 1: MEGA65 Foundations (Lessons 769-784)
**Topics:**
- 65CE02 instruction set extensions
- VIC-IV enhanced features
- Expanded memory model
- Compatibility modes

**Deliverable:** MEGA65 "Hello World" using new features

### Tier 2: MEGA65 Graphics (Lessons 785-800)
**Topics:**
- Enhanced sprite capabilities
- Higher resolutions
- Advanced color modes
- Hardware acceleration features

**Deliverable:** MEGA65 graphics showcase

### Tier 3: MEGA65 Game Systems (Lessons 801-816)
**Topics:**
- Fast CPU for complex logic
- Enhanced audio capabilities
- Disk access improvements
- Networking features

**Deliverable:** MEGA65-enhanced game prototype

### Tier 4: MEGA65 Complete (Lessons 817-832)
**Topics:**
- Cross-compatibility (C64 mode vs native)
- Optimization for 65CE02
- Modern quality-of-life features
- Complete game ported/enhanced

**Deliverable:** Full MEGA65 game

### Tier 5: SuperCPU Fundamentals (Lessons 833-848)
**Topics:**
- 65816 16-bit programming
- 20MHz optimization strategies
- Extended memory access
- Compatibility considerations

**Deliverable:** SuperCPU-accelerated demo

### Tier 6: SuperCPU Complete (Lessons 849-864)
**Topics:**
- 16-bit calculations
- High-speed physics
- Complex AI with CPU headroom
- Hybrid 6502/65816 code

**Deliverable:** SuperCPU-optimized game

### Tier 7: REU Programming (Lessons 865-880)
**Topics:**
- DMA transfers
- 512KB-16MB RAM access
- Fast screen buffers
- Large data structures

**Deliverable:** REU-enhanced game with huge levels

### Tier 8: Modern Cartridges (Lessons 881-896)
**Topics:**
- EasyFlash programming
- Bank switching techniques
- Custom hardware registers
- Persistent storage

**Deliverable:** Cartridge-based game

---

## Phase 8: Advanced Mastery (Lessons 897-1024)

**Content:** Demoscene (32) + Recent Discoveries (16) + Capstone Projects (64) + Buffer (16)
**Goal:** Cutting-edge techniques and original commercial-quality game

### Tier 1: Demoscene Visual Effects (Lessons 897-912)
**Topics:**
- Plasma effects
- Raster bars and copper lists
- FLD (Flexible Line Distance)
- VSP (Variable Screen Position)

**Deliverable:** Visual effects demo

### Tier 2: Demoscene Advanced (Lessons 913-928)
**Topics:**
- Border removal techniques
- Sprite stretching
- Character mode tricks
- Rotozoomer effects

**Deliverable:** Multi-effect demo

### Tier 3: Recent Discoveries (Lessons 929-944)
**Topics:**
- Newly discovered hardware quirks
- Modern optimization techniques
- Emulator-assisted development
- Community tools and findings

**Deliverable:** Cutting-edge technique showcase

### Tier 4: Capstone Project 1 (Lessons 945-960)
**Topics:**
- Original game concept development
- Combining multiple genre techniques
- Design document and planning
- Prototype implementation

**Deliverable:** Unique game prototype

### Tier 5: Capstone Project 2 (Lessons 961-976)
**Topics:**
- Core systems implementation
- Art and sound integration
- Playtesting and iteration
- Bug fixing

**Deliverable:** Playable alpha build

### Tier 6: Capstone Project 3 (Lessons 977-992)
**Topics:**
- Content completion (all levels/features)
- Optimization pass
- Polish and juice
- Menu systems and UX

**Deliverable:** Feature-complete beta

### Tier 7: Capstone Project 4 (Lessons 993-1008)
**Topics:**
- Final polish
- Distribution formats (.prg, .d64, cartridge)
- Documentation
- Release preparation

**Deliverable:** Shippable commercial-quality game

### Tier 8: Mastery & Beyond (Lessons 1009-1024)
**Topics:**
- Career paths in retro development
- Community and publishing
- Advanced research topics
- Course retrospective

**Deliverable:** Graduate portfolio + next steps

---

## Genre Coverage Summary

**32-lesson genres:**
1. Text Adventures (Phase 1)
2. Puzzle/Logic (Phase 1)
3. Rhythm Games (Phase 2)
4. Beat 'em Up (Phase 2)
5. Sports (Phase 3)
6. Racing/Pseudo-3D (Phase 3)

**64-lesson genres:**
7. Arcade Shooter (Phase 2)
8. Run-and-Gun (Phase 3)
9. Platformer (Phase 4)
10. RPG/Adventure (Phase 4)
11. Strategy/Tactics (Phase 6)

**128-lesson genre:**
12. Elite-Style Simulation (Phase 5)

**Total: 12 complete genres**

---

## Technical Skill Coverage

### Hardware Mastery
- VIC-II (sprites, scrolling, raster interrupts)
- SID (3-voice synthesis, filters, music drivers)
- CIA (keyboard, joystick, timers)
- Memory banking and optimization
- Modern hardware (MEGA65, SuperCPU, REU)

### Programming Techniques
- 6502 assembly optimization
- Zero-page techniques
- Self-modifying code
- Table-driven programming
- Data compression
- Procedural generation
- AI and pathfinding

### Game Systems
- Physics engines
- Collision detection
- Save/load systems
- Menu frameworks
- Level editors/data formats
- Music and sound integration

### Professional Skills
- Cross-development workflow
- Debugging and profiling
- Performance optimization
- Commercial release preparation

---

## Quality Standards

Every lesson must:
- Take 15-20 minutes maximum
- Build on previous lessons
- Include runnable code examples
- Have a clear "WOW moment"
- Be tested on real hardware or accurate emulation
- Follow progression within tier

Every tier must:
- Produce a concrete deliverable
- Be completable in 4-5 hours
- Have clear entry/exit criteria
- Build toward phase goal

Every phase must:
- Cover stated genres/topics completely
- Progress from fundamentals to commercial quality
- Integrate with adjacent phases
- Be completable in 32-43 hours

---

## Implementation Notes

### Lesson Naming Convention
- `phase-N/tier-N/lesson-NNN.mdx`
- Example: `phase-1/tier-1/lesson-001.mdx`

### Code Samples Location
- `/code-samples/commodore-64/assembly/phase-N/tier-N/lesson-NNN/`
- Each lesson has dedicated folder for source and assets

### Build Requirements
- All code must assemble with ACME
- Must run in VICE x64sc emulator
- Should work on real hardware

### Documentation Requirements
- Every lesson: objectives, code walkthrough, deliverable
- Every tier: overview, progression, completion criteria
- Every phase: learning outcomes, genre coverage

---

## Version History

- 1.0.0 (2025-01-15): Initial comprehensive curriculum structure
  - 1024 lessons defined
  - 8 phases × 8 tiers × 16 lessons
  - 12 genres with commercial-quality outcomes
  - Modern hardware coverage included
  - Demoscene and advanced techniques integrated

---

**END OF CURRICULUM SPECIFICATION**

All lesson content must be developed according to this authoritative structure.
