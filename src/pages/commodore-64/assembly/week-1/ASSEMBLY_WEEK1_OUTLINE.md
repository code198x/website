# Assembly Week 1: Scroll Runner Pure Assembly Rewrite

## Overview

**Goal**: Transform the hybrid Scroll Runner (BASIC + assembly helpers) into a pure assembly game with no BASIC dependencies.

**Philosophy**: "Seamless Continuation" - assumes Transition course completion, moves quickly, builds on established patterns.

**Project Continuity**: Same Scroll Runner from BASIC Week 8 → Transition Week 1 → Assembly Week 1

---

## Lesson-by-Lesson Breakdown

### ✅ Lesson 1: Bootstrapping Scroll Runner (COMPLETE)

**Status**: Already written, uses Scroll Runner
**Content**: Memory map, asset loading, bootstrap code
**WOW Moment**: PRG launches directly without BASIC

---

### Lesson 2: IRQ-Driven Game Loop

**Title**: "From BASIC Main Loop to Raster Interrupts"

**The One-Minute Tour**:
- Replace BASIC's `DO...LOOP` with assembly main loop
- Install custom IRQ handler for 50Hz frame timing
- Implement frame-synchronised game state updates

**Core Concepts**:
- Raster interrupts (waiting for specific raster line)
- IRQ vector redirection ($0314/$0315)
- SEI/CLI interrupt masking
- Stable frame timing (50Hz PAL, 60Hz NTSC)

**Example Program**:
```asm
; Install IRQ handler
SEI
LDA #<IRQHandler
STA $0314
LDA #>IRQHandler
STA $0315
CLI

IRQHandler:
    ; Save registers
    PHA
    TXA
    PHA
    TYA
    PHA

    ; Game logic here
    JSR UpdateGame
    JSR RenderFrame

    ; Restore registers
    PLA
    TAY
    PLA
    TAX
    PLA

    ; Acknowledge IRQ
    ASL $D019
    JMP $EA31     ; Return via KERNAL
```

**WOW Moment**: Scroll Runner runs at perfect 50Hz with no jitter

**Replaces Skyfall**: Lesson 2's falling objects → Scroll Runner's smooth scrolling

---

### Lesson 3: Full Input System

**Title**: "Keyboard and Joystick Without BASIC"

**The One-Minute Tour**:
- Read keyboard matrix directly (CIA1 $DC00/$DC01)
- Add joystick support (CIA1 $DC00, bits 0-4)
- Implement debouncing and key-held state tracking

**Core Concepts**:
- CIA keyboard matrix scanning
- Joystick bit patterns
- Input state machines (pressed, held, released)
- Efficient polling within IRQ

**Example Program**:
```asm
; Keyboard matrix scan
CheckKeys:
    LDA #$FD           ; Row 2 (A,S,D keys)
    STA $DC00
    LDA $DC01
    AND #$04           ; Bit 2 = D key
    BEQ KeyDPressed

; Joystick read
CheckJoy:
    LDA $DC00
    AND #$0F           ; Bits 0-3 = directions
    CMP #$0E           ; Right?
    BEQ JoyRight
```

**WOW Moment**: Scroll Runner player responds to both keyboard AND joystick

**Replaces Skyfall**: Lesson 5's keyboard basics → Scroll Runner's dual-input system

---

### Lesson 4: Pure Assembly Rendering

**Title**: "Direct VIC-II Screen Control"

**The One-Minute Tour**:
- Write tiles directly to screen RAM without BASIC
- Update color RAM for multi-color tiles
- Implement efficient tile-copying routines

**Core Concepts**:
- Screen RAM ($0400) and Color RAM ($D800) direct writes
- Efficient block copy (unrolled loops, Y-indexed addressing)
- Double buffering concepts (prepare off-screen, swap quickly)
- VIC-II register control ($D018 for character set)

**Example Program**:
```asm
RenderMap:
    ; Calculate screen position
    LDA ViewportX
    LSR                ; Divide by 2 for 20-column viewport
    TAX

    LDY #0
.copyRow:
    LDA MapBuffer,X
    STA SCREEN_RAM,Y
    LDA MapColors,X
    STA COLOR_RAM,Y
    INX
    INY
    CPY #24            ; 24 rows
    BNE .copyRow
    RTS
```

**WOW Moment**: Scroll Runner scrolls smoothly without BASIC render lag

**Replaces Skyfall**: Lesson 3's player drawing → Scroll Runner's tile engine

---

### Lesson 5: Sprite Management

**Title**: "Hardware Sprites and Animation"

**The One-Minute Tour**:
- Position sprites using VIC-II registers ($D000-$D00F)
- Switch sprite frames for animation
- Handle sprite/background priority and multi-color modes

**Core Concepts**:
- VIC-II sprite registers (X/Y positions, enable bits, colors)
- Sprite pointers ($07F8-$07FF)
- Animation frame tables
- Sprite collision registers ($D01E, $D01F)

**Example Program**:
```asm
UpdatePlayer:
    ; Update sprite 0 position
    LDA PlayerX
    STA $D000          ; Sprite 0 X
    LDA PlayerY
    STA $D001          ; Sprite 0 Y

    ; Animate sprite
    INC AnimCounter
    LDA AnimCounter
    AND #$07           ; 8-frame animation
    TAX
    LDA SpriteFrames,X
    STA $07F8          ; Sprite 0 pointer
    RTS
```

**WOW Moment**: Scroll Runner player sprite animates smoothly as it moves

**Replaces Skyfall**: Lesson 6's player movement → Scroll Runner's animated sprites

---

### Lesson 6: Collision Detection

**Title**: "Assembly Collision Systems"

**The One-Minute Tour**:
- Implement tile-based collision (map lookups)
- Use VIC-II hardware collision registers
- Build efficient AABB (bounding box) checks

**Core Concepts**:
- Hardware sprite-sprite collision ($D01E)
- Hardware sprite-background collision ($D01F)
- Software AABB collision for non-sprite objects
- Map tile lookup for wall collision

**Example Program**:
```asm
CheckCollision:
    ; Check sprite-background
    LDA $D01F
    AND #$01           ; Sprite 0 collision bit
    BNE PlayerHitWall

    ; Software tile check
    LDA PlayerX
    LSR
    LSR
    LSR                ; Divide by 8 for tile coord
    TAX
    LDA MapBuffer,X
    CMP #WALL_TILE
    BEQ PlayerHitWall
    RTS
```

**WOW Moment**: Scroll Runner player stops at walls, detects enemies

**Replaces Skyfall**: Lesson 2's catch detection → Scroll Runner's tile collision

---

### Lesson 7: SID Sound Effects

**Title**: "Real-Time Sound via SID Chip"

**The One-Minute Tour**:
- Program SID registers ($D400-$D7FF) for sound effects
- Create simple waveform-based effects (jump, hit, coin)
- Mix multiple sounds across 3 voices

**Core Concepts**:
- SID voice registers (frequency, waveform, ADSR)
- Frequency table for musical notes
- Sound effect triggering from game events
- Non-blocking sound (fire and forget)

**Example Program**:
```asm
PlayJumpSound:
    ; Voice 1: Jump sound
    LDA #$20           ; Triangle wave
    STA $D404          ; Waveform
    LDA #$40
    STA $D400          ; Frequency low
    LDA #$10
    STA $D401          ; Frequency high
    LDA #$09
    STA $D405          ; Attack/decay
    LDA #$00
    STA $D406          ; Sustain/release
    LDA #$21           ; Gate on + triangle
    STA $D404
    RTS
```

**WOW Moment**: Scroll Runner plays jump, coin, and hit sounds

**Replaces Skyfall**: Lesson 5's catch/miss sounds → Scroll Runner's richer soundscape

---

### Lesson 8: Performance Profiling & Optimization

**Title**: "Measuring Cycles and Optimizing Hotspots"

**The One-Minute Tour**:
- Use raster bar timing to measure frame budget
- Profile critical loops (render, collision, update)
- Apply optimization techniques (loop unrolling, table lookups, zero-page usage)

**Core Concepts**:
- Raster time measurement (color border during routines)
- Cycle counting (6502 instruction timing tables)
- Common optimizations:
  - Unroll tight loops
  - Use zero-page for frequently accessed variables
  - Replace multiplication with shift/add
  - Precompute lookup tables

**Example Program**:
```asm
ProfileRender:
    ; Start timing
    LDA #$01
    STA $D020          ; Border = white (start)

    JSR RenderFrame

    ; End timing
    LDA #$00
    STA $D020          ; Border = black (end)

    ; Border color duration = render time
    ; Visible bar shows if frame budget exceeded
```

**WOW Moment**: Scroll Runner profile shows render < 10% of frame, 90% headroom for new features

**Replaces Skyfall**: Lesson 8's polish → Scroll Runner's performance measurement

---

## Common Structure for All Lessons

Each lesson follows the 8-section format established in BASIC/Transition:

1. **The One-Minute Tour** - Quick orientation
2. **Example Program** - Complete, runnable code
3. **Experiment Section** - Hands-on modifications
4. **Concept Expansion** - Deeper technical understanding
5. **Game Integration** - How this fits into Scroll Runner
6. **From the Vault** - Historical context
7. **Quick Reference** - Syntax/command summary
8. **What You've Learnt** - Learning outcomes

---

## Pedagogical Notes

### Continuity With Transition

- **Lesson 2** directly replaces BASIC's main loop that Transition L8 still used
- **Lesson 3** eliminates BASIC's `GET K$` that Transition relied on
- **Lesson 4** removes BASIC's `POKE` screen writes
- Each lesson explicitly says "Remember from Transition Lesson X..."

### WOW Moment Progression

- L1: "It boots!" (assembly launcher works)
- L2: "Silky smooth!" (perfect 50Hz timing)
- L3: "Dual control!" (keyboard + joystick)
- L4: "No BASIC lag!" (instant screen updates)
- L5: "Animated sprite!" (smooth 8-frame walk cycle)
- L6: "Solid collision!" (perfect tile detection)
- L7: "Sounds alive!" (SID chip music)
- L8: "10% CPU used!" (90% headroom remaining)

### Difficulty Curve

- Lessons 2-4: Medium (concepts from Transition, now in pure assembly)
- Lessons 5-6: Medium-Hard (new VIC-II/collision concepts)
- Lessons 7-8: Hard (SID programming, performance profiling)

---

## Assets Required

All carried forward from BASIC Week 8 / Transition:

- `map-data.bin` - Scroll Runner tile map
- `sprites.bin` - Player sprite frames (8 frames)
- `tiles.bin` - Background tileset
- `colors.bin` - Color map data

---

## Expected Outcomes

By end of Assembly Week 1, learners will have:

✓ Complete Scroll Runner running in pure assembly
✓ IRQ-driven game loop with 50Hz timing
✓ Keyboard + joystick input
✓ Hardware sprite player with animation
✓ Tile-based collision detection
✓ SID chip sound effects
✓ Performance profiling showing 90%+ frame budget remaining

**Ready for Assembly Week 2**: Advanced topics (raster effects, music players, advanced AI)

---

## Migration Priority

**High Priority** (Week 1 blockers):
1. Lesson 2 (IRQ loop) - Foundation for all others
2. Lesson 3 (Input) - Must work before L4-8
3. Lesson 4 (Rendering) - Core game visual

**Medium Priority** (Nice to have):
4. Lesson 5 (Sprites) - Visual polish
5. Lesson 6 (Collision) - Gameplay critical
6. Lesson 7 (Sound) - Audio polish

**Polish** (Can be placeholder):
7. Lesson 8 (Profiling) - Advanced optimization

---

## Notes for Content Writers

- **Start from Lesson 2** (L1 already complete)
- **Use Transition L8's hybrid code** as the baseline "before" state
- **Each lesson removes one BASIC dependency** until Week 1 ends with zero BASIC
- **Test code on real C64 or VICE** - timing matters now
- **Include cycle counts** where relevant (6502 instruction timing)
- **Maintain 8-section format** consistently

---

**Document Version**: 1.0
**Created**: 2025-01-14
**Last Updated**: 2025-01-14
