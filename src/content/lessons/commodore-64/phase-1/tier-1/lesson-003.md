---
title: "Laser Weaponry"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 3
description: "Transform your ship into a combat vessel by adding a complete laser projectile system with object pooling, firing cooldowns, and smooth bullet physics."
learning_objectives:
  - "Master character-based projectile systems on the C64"
  - "Implement object pooling for multiple simultaneous bullets"
  - "Create frame-based animation timing systems"
  - "Build cooldown systems to prevent input spam"
  - "Convert between sprite and character coordinate systems"
concepts:
  - "Object pooling for resource management"
  - "Character-based rendering for projectiles"
  - "Screen coordinate conversion"
  - "Frame-based timing and animation"
  - "Input debouncing and cooldown systems"
  - "Parallel array data structures"
difficulty: "easy"
estimated_duration: "45-60 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "C64 Keyboard Matrix"
    url: "https://www.c64-wiki.com/wiki/Keyboard"
    type: "documentation"
  - title: "Character Set and Screen Codes"
    url: "https://www.c64-wiki.com/wiki/Character_set"
    type: "documentation"
order: 3
---

# Lesson 3: Laser Weaponry

Welcome back to **Cosmic Harvester**! Your ship can fly through space and dodge between stars, but what good is a space shooter without weapons? In this lesson, you'll add a complete laser projectile system that turns your peaceful explorer into a formidable combat vessel.

## What You'll Build Today

- **Laser projectile system** - Fire multiple laser bolts simultaneously
- **Object pooling** - Efficiently manage up to 8 bullets
- **Firing cooldowns** - Prevent rapid-fire abuse
- **Character-based rendering** - Use PETSCII characters for bullets
- **Screen coordinate conversion** - Bridge sprite and character systems

## The Big Picture

In classic arcade games, projectiles were often the most challenging system to implement efficiently. The C64's limited memory and processing power demand smart techniques like object pooling and frame-based timing. You'll learn the fundamental patterns that powered thousands of games.

## Understanding Object Pooling

Instead of creating and destroying bullets dynamically, we'll use a **pool** of pre-allocated bullet objects:

### Why Object Pooling?

```
Traditional Approach:
- Create bullet → Use bullet → Destroy bullet
- Causes memory fragmentation
- Unpredictable timing
- Complex memory management

Object Pool Approach:
- Pre-allocate 8 bullet slots
- Mark slots as active/inactive
- Reuse slots as needed
- Predictable memory usage
```

### Parallel Array Structure

```assembly
MAX_BULLETS = 8

; Bullet data arrays (parallel arrays)
bullet_active:  !fill MAX_BULLETS, 0    ; 0 = inactive, 1 = active
bullet_x:       !fill MAX_BULLETS, 0    ; X positions
bullet_y:       !fill MAX_BULLETS, 0    ; Y positions
bullet_char:    !fill MAX_BULLETS, 0    ; Screen character positions
```

This creates four parallel arrays where index 0 contains all data for bullet 0, index 1 for bullet 1, etc.

## Character-Based Projectiles

While our ship uses sprites, bullets will use character mode for efficiency:

### Character vs Sprite Trade-offs

**Characters (Our Choice):**
- ✅ 8×8 pixel resolution
- ✅ Easy screen coordinate system
- ✅ Automatic color memory
- ✅ Minimal memory usage
- ✅ Simple collision detection

**Sprites (Alternative):**
- ❌ Only 8 hardware sprites total
- ❌ Complex coordinate system
- ❌ More memory usage
- ❌ Harder collision detection
- ✅ Better animation capabilities

### Bullet Character Design

```assembly
; Draw bullet character
lda #124            ; Vertical bar character (PETSCII 124)
sta (screen_addr_low),y

; Set bullet color (bright red)
lda #10             ; Light red color
sta (color_addr_low),y
```

The vertical bar character (PETSCII 124) creates a perfect laser bolt appearance.

## Screen Coordinate Conversion

Converting from sprite coordinates (pixels) to character coordinates requires division:

### Coordinate System Math

```assembly
; Convert sprite position to character position
; Character row = sprite_y / 8
; Character column = sprite_x / 8

; Calculate screen row (Y / 8)
lda bullet_y,x
lsr                 ; Divide by 2
lsr                 ; Divide by 4
lsr                 ; Divide by 8
tay                 ; Y = row number

; Calculate screen column (X / 8)
lda bullet_x,x
lsr
lsr
lsr                 ; Divide by 8
tax                 ; X = column number
```

### Screen Memory Address Calculation

```assembly
; Screen address = $0400 + (row * 40) + column
; Row * 40 = Row * 32 + Row * 8

tya                 ; Get row number
asl                 ; row * 2
asl                 ; row * 4
asl                 ; row * 8
sta temp_low        ; Save row * 8

tya                 ; Get row number again
asl                 ; row * 2
asl                 ; row * 4
asl                 ; row * 8
asl                 ; row * 16
asl                 ; row * 32
clc
adc temp_low        ; row * 32 + row * 8 = row * 40
```

This calculates the exact screen memory address for any character position.

## The Firing System

### Finding Available Bullet Slots

```assembly
fire_bullet:
        ; Find an inactive bullet slot
        ldx #$00
find_bullet_slot:
        lda bullet_active,x
        beq found_slot      ; 0 = inactive, use this slot
        inx
        cpx #MAX_BULLETS
        bne find_bullet_slot
        
        ; No free slots available
        rts
        
found_slot:
        ; Activate bullet
        lda #$01
        sta bullet_active,x
        
        ; Set initial position (centered on ship)
        lda ship_x
        clc
        adc #$0C            ; Center horizontally
        sta bullet_x,x
        
        lda ship_y
        sec
        sbc #$08            ; Start above ship
        sta bullet_y,x
```

### Cooldown System

```assembly
; Bullet cooldown system
bullet_cooldown: !byte $00
BULLET_COOLDOWN_TIME = 5    ; Frames between bullets

check_space:
        ; Check SPACE key (row 7, bit 4)
        lda #$7F            ; Select row 7
        sta $DC00
        lda $DC01
        and #$10            ; Bit 4 = SPACE
        bne keyboard_done
        
        ; SPACE pressed - but check cooldown first
        lda bullet_cooldown
        bne keyboard_done   ; Still cooling down
        
        ; Fire bullet and start cooldown
        jsr fire_bullet
        lda #BULLET_COOLDOWN_TIME
        sta bullet_cooldown
```

This prevents players from firing too rapidly and overwhelming the system.

## Bullet Animation System

### Frame-Based Movement

```assembly
BULLET_SPEED = 3           ; Pixels per frame

update_bullets:
        ; Update cooldown counter
        lda bullet_cooldown
        beq update_positions
        dec bullet_cooldown
        
update_positions:
        ldx #$00
bullet_loop:
        lda bullet_active,x
        beq next_bullet     ; Skip inactive bullets
        
        ; Erase old position
        jsr erase_bullet
        
        ; Move bullet upward
        lda bullet_y,x
        sec
        sbc #BULLET_SPEED
        cmp #$20            ; Check if off screen
        bcc deactivate_bullet
        sta bullet_y,x
        
        ; Draw at new position
        jsr draw_bullet
        jmp next_bullet
        
deactivate_bullet:
        lda #$00
        sta bullet_active,x
        
next_bullet:
        inx
        cpx #MAX_BULLETS
        bne bullet_loop
        rts
```

### Bullet Lifecycle

1. **Spawn** - Find free slot, set position
2. **Move** - Update Y coordinate each frame
3. **Draw** - Render character at new position
4. **Cleanup** - Deactivate when off-screen

## Visual Polish

### Bullet Appearance

```assembly
; Bullet character and color
lda #124            ; Vertical bar (PETSCII 124)
sta screen_memory

lda #10             ; Light red color
sta color_memory
```

### Erasing Bullets

```assembly
erase_bullet:
        ; Replace with space character
        ldy #$00
        lda #$20            ; Space character
        sta (screen_addr),y
        
        ; Reset to background color
        lda #$00            ; Black
        sta (color_addr),y
        rts
```

Proper erasing prevents visual artifacts and screen corruption.

## Complete Integration

### Updated Game Loop

```assembly
game_loop:
        jsr wait_vblank     ; 50Hz timing
        jsr update_stars    ; Animate background
        jsr read_keyboard   ; Handle all input
        jsr update_ship     ; Move player
        jsr update_bullets  ; Animate projectiles
        jmp game_loop
```

### Enhanced Input System

```assembly
read_keyboard:
        ; Movement keys (Q/A/O/P)
        ; ... existing movement code ...
        
        ; New: Fire key (SPACE)
        lda #$7F            ; Select row 7
        sta $DC00
        lda $DC01
        and #$10            ; Bit 4 = SPACE
        bne keyboard_done
        
        ; Fire bullet with cooldown check
        jsr fire_bullet
        
keyboard_done:
        rts
```

## Performance Considerations

### Memory Efficiency

- **Parallel arrays** - Better cache locality than structures
- **Fixed pool size** - Predictable memory usage
- **Character mode** - Minimal memory per bullet
- **Efficient coordinates** - Single-byte positions
- **Zero page addressing** - Fast indirect addressing for screen operations

### Timing Optimization

- **Frame-based updates** - Smooth 50Hz animation
- **Cooldown system** - Prevents system overload
- **Efficient loops** - Minimal CPU overhead
- **Early exits** - Skip inactive bullets

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 3 Code](https://github.com/code198x/code-samples/tree/main/commodore-64/phase-1/tier-1/lesson-003)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `acme -f cbm -o cosmic-harvester-03.prg --cpu 6502 --format cbm cosmic-harvester-03.asm`
3. **Run** in VICE: `x64sc cosmic-harvester-03.prg`

**Or use the included Makefile:**
```bash
make            # Build the PRG file
make run        # Build and run in VICE
make disk       # Create D64 disk image
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Display the animated starfield and player ship from previous lessons
- Allow firing laser bolts with the SPACE key
- Show up to 8 bullets simultaneously
- Prevent rapid-fire spam with cooldowns
- Smoothly animate bullets upward

### Controls
- **Q/A/O/P** - Move ship (up/down/left/right)
- **SPACE** - Fire laser bolt
- **RUN/STOP** - Exit (standard C64 behavior)

## What You've Learned

**Object Pooling**:
- Pre-allocated resource pools for efficient memory management
- Parallel array structures for related data
- Active/inactive state management

**Character-Based Graphics**:
- Screen coordinate conversion from sprite positions
- Character mode rendering for projectiles
- Color memory management

**Game Timing**:
- Frame-based animation systems
- Cooldown timers for input management
- Smooth 50Hz game loop integration

**Input Systems**:
- Multi-key input handling
- Debouncing and spam prevention
- Responsive control feedback

## Your Challenge

Enhance your laser system:
1. **Rapid-fire mode** - Hold SPACE for continuous firing
2. **Bullet colors** - Cycle through different laser colors
3. **Sound effects** - Add firing sounds using the SID chip
4. **Bullet trails** - Leave temporary trail effects

## Next Lesson Preview

In **Lesson 4**, we'll add **enemy ships** that fly toward your ship! You'll learn about enemy AI patterns, collision detection, and game state management. Your laser system will finally have targets to destroy.

You now have a complete combat system that demonstrates professional game programming techniques. The foundation of **Cosmic Harvester** is becoming a real game!

Time to blast some cosmic enemies! 🚀✨