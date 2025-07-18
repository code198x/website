---
title: "Laser Weaponry"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 3
description: "Transform your ship into a quantum battle cruiser by adding a complete energy bolt system with object pooling, custom characters, and frame-perfect timing."
learning_objectives:
  - "Master character-based projectile systems on the ZX Spectrum"
  - "Create custom 8x8 character graphics for bullets"
  - "Implement object pooling for multiple simultaneous projectiles"
  - "Build cooldown systems for balanced gameplay"
  - "Understand parallel array data structures"
concepts:
  - "Custom character creation and bitmap design"
  - "Object pooling for resource management"
  - "Character-based collision detection"
  - "Frame-based timing and animation"
  - "Input debouncing and cooldown systems"
  - "Parallel array data structures"
difficulty: "easy"
estimated_duration: "45-60 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "ZX Spectrum Character Set"
    url: "https://en.wikipedia.org/wiki/ZX_Spectrum_character_set"
    type: "documentation"
  - title: "ZX Spectrum Keyboard Matrix"
    url: "https://www.1000bit.it/support/manuali/sinclair/zxspectrum/keyboard.html"
    type: "documentation"
order: 3
---

# Lesson 3: Laser Weaponry

Welcome back to **Quantum Shatter**! Your ship can navigate through the quantum starfield, but what good is a space shooter without the ability to shatter quantum particles? In this lesson, you'll add a complete energy bolt system that transforms your peaceful explorer into a formidable quantum battle cruiser.

## What You'll Build Today

- **Energy bolt projectile system** - Fire multiple quantum bolts simultaneously
- **Custom bullet graphics** - Design distinctive 8×8 energy bolt characters
- **Object pooling** - Efficiently manage up to 8 projectiles
- **Firing cooldowns** - Prevent rapid-fire abuse with timing systems
- **Character-based rendering** - Use ZX Spectrum's character mode for speed

## The Big Picture

The ZX Spectrum's character-based graphics system is perfect for projectile games. By designing custom 8×8 characters for bullets, we get fast rendering, easy collision detection, and distinctive visual effects. You'll learn the professional techniques that powered countless classic games.

## Understanding Character-Based Projectiles

Unlike pixel-level graphics, character-based projectiles use 8×8 character definitions:

### Why Character Mode for Bullets?

```
Character Advantages:
✅ Fast rendering (single character write)
✅ Easy collision detection (character boundaries)
✅ Distinctive visual design
✅ Efficient memory usage
✅ Simple coordinate system

Pixel Alternatives:
❌ Slower rendering (multiple pixel operations)
❌ Complex collision detection
❌ More memory usage
❌ Complicated coordinate math
```

### Custom Character Design

```z80
bullet_data:
        ; Bullet character bitmap (8x8 pixels)
        ; Distinctive energy bolt design
        DB      %00011000       ; Row 0:   **
        DB      %00111100       ; Row 1:  ****
        DB      %01111110       ; Row 2: ******
        DB      %01111110       ; Row 3: ******
        DB      %01111110       ; Row 4: ******
        DB      %01111110       ; Row 5: ******
        DB      %00111100       ; Row 6:  ****
        DB      %00011000       ; Row 7:   **
```

This creates a distinctive energy bolt that's immediately recognizable as a projectile.

## Object Pooling System

Instead of creating bullets dynamically, we pre-allocate a fixed pool:

### Parallel Array Structure

```z80
; Bullet system constants
MAX_BULLETS    EQU  8           ; Maximum simultaneous bullets

; Bullet system variables
bullet_active:   DS MAX_BULLETS    ; 0 = inactive, 1 = active
bullet_x:        DS MAX_BULLETS    ; X positions
bullet_y:        DS MAX_BULLETS    ; Y positions
```

### Why Parallel Arrays?

- **Cache efficiency** - Related data stored together
- **Simple indexing** - Same index for all bullet properties
- **Fast iteration** - Process all bullets in sequence
- **Predictable memory** - Fixed size allocation

## Custom Character Creation

### Loading Character Data

```z80
create_characters:
        ; Create ship character
        ld      hl,ship_data
        ld      de,$4000 + (SHIP_CHAR * 8) ; Ship character location
        ld      bc,8            ; 8 bytes per character
        ldir                    ; Copy ship data
        
        ; Create bullet character
        ld      hl,bullet_data
        ld      de,$4000 + (BULLET_CHAR * 8) ; Bullet character location
        ld      bc,8            ; 8 bytes per character
        ldir                    ; Copy bullet data
        
        ret
```

### Character Memory Layout

```
ZX Spectrum Character Memory:
$4000-$47FF: Character bitmap data
Each character: 8 bytes (8x8 pixels)
Character N starts at: $4000 + (N * 8)

Our Characters:
SHIP_CHAR   EQU $80    ; Custom ship at $4400
BULLET_CHAR EQU $81    ; Custom bullet at $4408
```

## The Firing System

### Finding Available Bullet Slots

```z80
fire_bullet:
        ; Check cooldown
        ld      a,(bullet_cooldown)
        or      a
        ret     nz              ; Still cooling down
        
        ; Find empty bullet slot
        ld      hl,bullet_active
        ld      b,MAX_BULLETS
        ld      c,0             ; Bullet index
        
find_slot:
        ld      a,(hl)
        or      a
        jr      z,found_slot    ; Found empty slot
        inc     hl
        inc     c
        djnz    find_slot
        ret                     ; No free slots
        
found_slot:
        ; Activate bullet
        ld      (hl),1
        
        ; Set bullet position (centered on ship)
        ld      a,(player_x)
        ld      hl,bullet_x
        ld      b,0
        add     hl,bc           ; HL points to bullet_x[c]
        ld      (hl),a
```

### Cooldown System

```z80
; Bullet cooldown system
BULLET_COOLDOWN_TIME EQU 10     ; Frames between shots

check_space:
        ; Check SPACE key (Fire)
        ld      bc,$7FFE        ; Row 6
        in      a,(c)
        bit     0,a             ; SPACE key
        jr      nz,input_done
        
        ; Fire bullet (includes cooldown check)
        call    fire_bullet
```

This provides balanced gameplay by preventing bullet spam.

## Bullet Animation System

### Frame-Based Movement

```z80
update_bullets:
        ; Update cooldown
        ld      a,(bullet_cooldown)
        or      a
        jr      z,update_positions
        dec     a
        ld      (bullet_cooldown),a
        
update_positions:
        ; Process each bullet
        ld      b,MAX_BULLETS
        ld      c,0             ; Bullet index
        
bullet_loop:
        ; Check if bullet is active
        ld      hl,bullet_active
        ld      b,0
        add     hl,bc
        ld      a,(hl)
        or      a
        jr      z,next_bullet   ; Inactive bullet
        
        ; Get bullet position
        ld      hl,bullet_y
        add     hl,bc
        ld      a,(hl)
        
        ; Move bullet up
        sub     BULLET_SPEED    ; 2 characters per frame
        cp      1               ; Check if off screen
        jr      c,deactivate_bullet
        
        ; Update position and draw
        ld      (hl),a
        call    draw_bullet
```

### Bullet Lifecycle

1. **Spawn** - Find free slot, set position
2. **Move** - Update Y coordinate each frame  
3. **Draw** - Render character at new position
4. **Cleanup** - Deactivate when off-screen

## Visual Polish

### Bullet Appearance

```z80
draw_bullet:
        ; Calculate screen position
        call    calc_screen_pos
        
        ; Draw bullet character
        ld      a,BULLET_CHAR
        ld      (hl),a
        
        ; Set bullet color (bright red on black)
        call    calc_attr_pos
        ld      a,$42           ; Bright red ink, black paper
        ld      (hl),a
        
        ret
```

### Color Attributes

```
ZX Spectrum Color System:
Bit 7: Flash
Bit 6: Bright
Bits 5-3: Paper color (background)
Bits 2-0: Ink color (foreground)

$42 = %01000010:
- Bright red ink ($02 + $40 bright)
- Black paper ($00)
```

## Keyboard Input Enhancement

### Space Bar Detection

```z80
check_space:
        ; Check SPACE key (Fire)
        ld      bc,$7FFE        ; Row 6
        in      a,(c)
        bit     0,a             ; SPACE key
        jr      nz,input_done
        
        ; Fire bullet
        call    fire_bullet
```

### ZX Spectrum Keyboard Matrix

```
Keyboard rows (port $FE):
Row 6 ($7FFE): 1 2 3 4 5 + SPACE
Bit 0: SPACE key
```

## Complete Integration

### Enhanced Game Loop

```z80
game_loop:
        halt                    ; 50Hz timing
        call    animate_stars   ; Animate background
        call    handle_input    ; Handle all input
        call    update_player   ; Move player
        call    update_bullets  ; Animate projectiles
        jr      game_loop
```

### Memory Organization

```
Character Definitions:
$4000 + ($80 * 8) = $4400: Ship character
$4000 + ($81 * 8) = $4408: Bullet character

Variables:
bullet_active: 8 bytes (activity flags)
bullet_x:      8 bytes (X coordinates)  
bullet_y:      8 bytes (Y coordinates)
bullet_cooldown: 1 byte (firing timer)
```

## Performance Considerations

### Memory Efficiency

- **Fixed pool size** - Predictable memory usage
- **Character mode** - Fast single-byte operations
- **Parallel arrays** - Cache-friendly data layout
- **Minimal attribute updates** - Only when bullets move

### Timing Optimization

- **Frame-based updates** - Smooth 50Hz animation
- **Cooldown system** - Prevents system overload
- **Efficient loops** - Skip inactive bullets
- **Character rendering** - Faster than pixel operations

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 3 Code](https://github.com/code198x/code-samples/tree/main/zx-spectrum/phase-1/tier-1/lesson-003)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble** with: `sjasmplus --lst=build/quantum-shatter-03.lst quantum-shatter-03.asm`
3. **Run** in emulator: Load the `quantum-shatter-03.tap` file

**Or use the included Makefile:**
```bash
make            # Build the TAP file
make run        # Build and run in Fuse emulator
make test       # Build and verify creation
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Display the animated starfield and player ship from previous lessons
- Allow firing energy bolts with the SPACE key
- Show up to 8 bullets simultaneously
- Prevent rapid-fire spam with cooldowns
- Smoothly animate bullets upward

### Controls
- **Q/A/O/P** - Move ship (up/down/left/right)
- **SPACE** - Fire energy bolt

## What You've Learned

**Character Graphics**:
- Custom 8×8 character creation and bitmap design
- Character memory layout and loading
- Character-based rendering systems

**Object Pooling**:
- Pre-allocated resource pools for efficient memory management
- Parallel array structures for related data
- Active/inactive state management

**Game Timing**:
- Frame-based animation systems
- Cooldown timers for input management
- Smooth 50Hz game loop integration

**ZX Spectrum Programming**:
- Character mode graphics optimization
- Keyboard matrix scanning techniques
- Attribute memory color management

## Your Challenge

Enhance your energy bolt system:
1. **Charged shots** - Hold SPACE for more powerful bolts
2. **Bullet trails** - Leave temporary trail effects
3. **Sound effects** - Add firing sounds using the beeper
4. **Different bullet types** - Multiple character designs

## Next Lesson Preview

In **Lesson 4**, we'll add **enemy ships** that threaten your quantum cruiser! You'll learn about enemy AI patterns, collision detection between bullets and enemies, and game state management. Your energy bolt system will finally have targets to destroy.

You now have a complete combat system that demonstrates professional character-based game programming. The foundation of **Quantum Shatter** is ready for battle!

Prepare to shatter the quantum realm! ⚡🚀