# C64 Assembly Week 2 Migration Notes

## Overview
Migrating lessons 9-16 from `/commodore-64/skyfall/` to `/commodore-64/assembly/week-2/`

## Status
- ✅ Lesson 9: Migrated, tested, and verified working
- 📋 Lessons 10-16: Copied, awaiting frontmatter updates and testing

## Critical Bugs Fixed in Lesson 9

### 1. Player Character Code
**Issue**: Used `$5e` (π symbol) instead of upward wedge
**Fix**: Changed to `$1e` throughout all code

### 2. Keyboard Matrix Scanning
**Issue**: Attempted to read both A and D keys from single column scan
**Fix**: Separate scans for each key:
```asm
; Check D key (column 2, row 2)
lda #%11111011
sta CIA1_PORT_B
lda CIA1_PORT_A
and #%00000100
beq move_right

; Check A key (column 1, row 2)
lda #%11111101
sta CIA1_PORT_B
lda CIA1_PORT_A
and #%00000100
beq move_left
```

### 3. **CRITICAL: 16-bit Screen Addressing**
**Issue**: Original `calc_row_times_40` routine only returned 8-bit result. Using `STA SCREEN_RAM,X` with 8-bit X register caused:
- Objects only fell 6 rows (row 6 × 40 = 240, last value < 256)
- Row 7+ wrapped around, creating "random" asterisks
- Memory corruption

**Fix**: Replaced calculation with lookup tables:
```asm
; Row offset lookup table (low bytes)
row_offset_lo:
    !byte <(0*40), <(1*40), <(2*40), <(3*40), <(4*40)
    !byte <(5*40), <(6*40), <(7*40), <(8*40), <(9*40)
    !byte <(10*40), <(11*40), <(12*40), <(13*40), <(14*40)
    !byte <(15*40), <(16*40), <(17*40), <(18*40), <(19*40)
    !byte <(20*40), <(21*40), <(22*40), <(23*40), <(24*40)

; Row offset lookup table (high bytes)
row_offset_hi:
    !byte >(0*40), >(1*40), >(2*40), >(3*40), >(4*40)
    !byte >(5*40), >(6*40), >(7*40), >(8*40), >(9*40)
    !byte >(10*40), >(11*40), >(12*40), >(13*40), >(14*40)
    !byte >(15*40), >(16*40), >(17*40), >(18*40), >(19*40)
    !byte >(20*40), >(21*40), >(22*40), >(23*40), >(24*40)
```

Updated `draw_object` and `erase_object` to use indirect indexed addressing:
```asm
draw_object:
    ; Get row offset from table
    ldx OBJ_ROW
    lda row_offset_lo,x
    sta $fb
    lda row_offset_hi,x
    sta $fc

    ; Add column (with 16-bit carry handling)
    lda $fb
    clc
    adc OBJ_COL
    sta $fb
    bcc +
    inc $fc
+
    ; Add SCREEN_RAM base address
    lda $fb
    clc
    adc #<SCREEN_RAM
    sta $fb
    lda $fc
    adc #>SCREEN_RAM
    sta $fc

    ; Draw using indirect indexed
    ldy #0
    lda #OBJECT_CHAR
    sta ($fb),y

    ; ... (similar for COLOR_RAM)
```

### 4. Player Erasure Bug
**Issue**: Falling object erasing player when passing through row 23
**Fix**: Added `jsr draw_player` after `jsr update_object` in game loop

## Frontmatter Template for Lessons 10-16

Each lesson needs frontmatter updated from:
```yaml
---
layout: ../../../layouts/LessonLayout.astro
title: "Lesson Title"
game: "Skyfall"
system: "C64"
lessonNumber: X
totalLessons: 16
nextLesson: "/commodore-64/skyfall/lesson-XX"
prevLesson: "/commodore-64/skyfall/lesson-XX"
---
```

To:
```yaml
---
layout: ../../../../layouts/LessonLayout.astro
title: "Lesson Title"
description: "Brief description of lesson content"
pubDate: 2025-01-1X
language: "6502 Assembly"
course: "C64 Assembly Week 2"
week: 2
lesson: X
totalLessons: 16
nextLesson: "/commodore-64/assembly/week-2/lesson-XX"
prevLesson: "/commodore-64/assembly/week-2/lesson-XX" (or week-1/lesson-08 for lesson 10)
---
```

## Code Fixes Required Across ALL Lessons

### Global Find/Replace Operations:

1. **Player Character**:
   - Find: `PLAYER_CHAR = $5e`
   - Replace: `PLAYER_CHAR = $1e`

2. **Keyboard Scanning** (if present):
   - Replace single-scan keyboard routine with dual-scan version

3. **Row Calculation** (CRITICAL):
   - Add lookup tables before first subroutine
   - Replace all `calc_row_times_40` calls with table lookups
   - Update `draw_object` and `erase_object` to use indirect indexed addressing

4. **Player Redraw**:
   - Add `jsr draw_player` after object updates in game loop

## Lessons 10-16 Overview

Based on original skyfall structure:

- **Lesson 10**: Collision Detection
- **Lesson 11**: Score Tracking
- **Lesson 12**: Multiple Objects
- **Lesson 13**: Random Spawning
- **Lesson 14**: Difficulty Progression
- **Lesson 15**: Game Over State
- **Lesson 16**: Complete Game Polish

## Testing Protocol

For each lesson:
1. Extract complete code block
2. Assemble with ACME
3. Run in VICE
4. Verify:
   - Player character displays correctly ($1e)
   - Keyboard controls work (A/D)
   - Objects fall all 24 rows
   - Player remains visible
   - Lesson-specific features work
5. Capture screenshot
6. Update lesson with any fixes

## Next Session Tasks

1. **Batch update frontmatter** for lessons 10-16
2. **Apply global code fixes** (player char, keyboard, row calc)
3. **Test each lesson** sequentially
4. **Capture screenshots** for each
5. **Create week-2 index page**
6. **Update assembly index** to show both weeks
7. **Commit and push** all changes

## Memory Usage Note

Lookup tables add 50 bytes per game, but this is standard practice in C64 development and provides:
- Correct 16-bit addressing
- Faster execution than runtime calculation
- More reliable code
- Industry-standard approach

## Educational Value

The lookup table fix teaches important 6502 concepts:
- Why 8-bit indexed addressing has limits
- Indirect indexed addressing mode
- Speed vs memory tradeoffs
- How professional games handle screen addressing
