---
title: "Sprite System Introduction"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 16
description: "Master the NES sprite system for creating moving game objects. Learn OAM (Object Attribute Memory), sprite positioning, animation, and how to bring your games to life with dynamic graphics."
learning_objectives:
  - "Understand the NES sprite system and OAM structure"
  - "Learn to position and display sprites on screen"
  - "Master sprite attributes (position, tile, palette, flip)"
  - "Create basic sprite animations"
  - "Handle sprite limitations and optimization"
concepts:
  - "Sprites and OAM (Object Attribute Memory)"
  - "Sprite attributes and positioning"
  - "Sprite graphics and pattern tables"
  - "Animation techniques"
  - "Sprite limitations and flickering"
estimated_duration: "50-65 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 16
---

# Lesson 16: Sprite System Introduction

Welcome to moving graphics! Today you'll learn about sprites - the moving objects that make NES games come alive. Sprites are essential for players, enemies, projectiles, and any dynamic visual elements.

## What Are Sprites?

Sprites are movable graphics objects that can be positioned anywhere on screen:

- **Independent of background**: Sprites move over the background tiles
- **Hardware accelerated**: The PPU handles sprite rendering automatically
- **Flexible positioning**: Pixel-perfect placement anywhere on screen
- **Animation ready**: Easy to change graphics for animation
- **Collision detection**: Can be tested for overlaps with other sprites

Famous NES sprites include Mario, Goombas, fireballs, coins, and power-ups!

## NES Sprite Capabilities

**What sprites can do:**
- 64 total sprites available
- 8x8 or 8x16 pixel sizes
- 4 different color palettes
- Horizontal and vertical flipping
- Priority control (behind/in front of background)
- Precise pixel positioning

**Sprite limitations:**
- Only 8 sprites per scanline (horizontal row)
- Exceeding 8 causes flickering
- Limited to 4 colors per sprite (including transparency)
- All sprites share the same size (8x8 or 8x16)

## OAM - Object Attribute Memory

Sprite data is stored in OAM (Object Attribute Memory):
- **Location**: $0200-$02FF in CPU memory (256 bytes)
- **Capacity**: 64 sprites × 4 bytes each = 256 bytes
- **Structure**: Each sprite needs exactly 4 bytes

### Sprite Data Format

Each sprite uses 4 consecutive bytes:

```
Byte 0: Y Position (0-255)
Byte 1: Tile Number (which graphics to use)
Byte 2: Attributes (palette, priority, flip flags)
Byte 3: X Position (0-255)
```

## Setting Up Your First Sprite

Let's create a simple sprite:

```text
setup_sprite:
    ; Sprite 0 data at $0200-$0203
    LDA #$80        ; Y position = 128 (middle of screen)
    STA $0200       ; Store Y position
    
    LDA #$01        ; Tile number 1
    STA $0201       ; Store tile number
    
    LDA #$00        ; Attributes: palette 0, normal priority, no flip
    STA $0202       ; Store attributes
    
    LDA #$80        ; X position = 128 (middle of screen)  
    STA $0203       ; Store X position
    
    RTS
```

**Creating Your First Sprite:**

```assembly
; Create a sprite in the center of the screen
JSR setup_first_sprite

setup_first_sprite:
    ; Sprite 0 data (OAM starts at $0200)
    LDA #$78        ; Y position = 120
    STA $0200       ; Sprite 0 Y position
    
    LDA #$01        ; Use tile number 1
    STA $0201       ; Sprite 0 tile number
    
    LDA #$00        ; Attributes: palette 0, no flipping
    STA $0202       ; Sprite 0 attributes
    
    LDA #$80        ; X position = 128 (center)
    STA $0203       ; Sprite 0 X position
    
    RTS

; Sprite is now configured and ready to display!
```

## Sprite Attributes Byte

The attributes byte (byte 2) controls several sprite properties:

```
Bit 7-6: Palette (0-3) - Which sprite palette to use
Bit 5: Priority (0=in front of background, 1=behind background)
Bit 4: Unused
Bit 3: Unused  
Bit 2: Unused
Bit 1: Horizontal Flip (0=normal, 1=flipped)
Bit 0: Vertical Flip (0=normal, 1=flipped)
```

### Attribute Examples

```text
; Different attribute combinations
LDA #%00000000  ; Palette 0, front, no flip
LDA #%01000000  ; Palette 1, front, no flip
LDA #%10000000  ; Palette 2, front, no flip
LDA #%11000000  ; Palette 3, front, no flip
LDA #%00100000  ; Palette 0, behind background
LDA #%00000001  ; Palette 0, front, vertical flip
LDA #%00000010  ; Palette 0, front, horizontal flip
LDA #%00000011  ; Palette 0, front, both flips
```

**Sprite Attributes Examples:**

```assembly
; Create sprites with different attributes
; Sprite 0: Normal
LDA #$60        ; Y position
STA $0200
LDA #$01        ; Tile 1
STA $0201  
LDA #%00000000  ; Palette 0, normal
STA $0202
LDA #$60        ; X position
STA $0203

; Sprite 1: Different palette
LDA #$60        ; Y position
STA $0204
LDA #$01        ; Same tile
STA $0205
LDA #%01000000  ; Palette 1, normal
STA $0206
LDA #$80        ; X position
STA $0207

; Sprite 2: Horizontally flipped
LDA #$60        ; Y position
STA $0208
LDA #$01        ; Same tile  
STA $0209
LDA #%00000010  ; Palette 0, horizontal flip
STA $020A
LDA #$A0        ; X position
STA $020B

; Three sprites with different attributes!
```

## Moving Sprites

Moving sprites is as simple as changing their position values:

```text
move_sprite_right:
    LDA $0203       ; Load current X position
    CLC
    ADC #$01        ; Add 1 pixel
    STA $0203       ; Store new X position
    RTS

move_sprite_left:
    LDA $0203       ; Load current X position
    SEC
    SBC #$01        ; Subtract 1 pixel
    STA $0203       ; Store new X position
    RTS

move_sprite_up:
    LDA $0200       ; Load current Y position
    SEC
    SBC #$01        ; Subtract 1 pixel (up)
    STA $0200       ; Store new Y position
    RTS

move_sprite_down:
    LDA $0200       ; Load current Y position
    CLC
    ADC #$01        ; Add 1 pixel (down)
    STA $0200       ; Store new Y position
    RTS
```

**Moving Sprites:**

```assembly
; Setup initial sprite position
LDA #$80        ; Center Y
STA $0200
LDA #$01        ; Tile 1
STA $0201
LDA #$00        ; Normal attributes
STA $0202
LDA #$40        ; Left side X
STA $0203

; Move sprite right 5 times
JSR move_right
JSR move_right
JSR move_right
JSR move_right
JSR move_right

move_right:
    LDA $0203       ; Get current X position
    CLC
    ADC #$08        ; Move 8 pixels right
    STA $0203       ; Store new position
    RTS

; Sprite has moved from X=64 to X=104
```

## Sprite Animation

Animation is achieved by changing the tile number:

```text
; Animation frames for walking character
walk_frames:
    .byte $01, $02, $03, $02    ; 4-frame walk cycle

animate_sprite:
    LDA frame_counter   ; Current animation frame
    TAX                 ; Use as index
    LDA walk_frames,X   ; Get tile for this frame
    STA $0201          ; Update sprite tile
    
    ; Advance to next frame
    INC frame_counter
    LDA frame_counter
    CMP #$04           ; 4 frames total?
    BNE done_animate
    LDA #$00           ; Reset to frame 0
    STA frame_counter
done_animate:
    RTS
```

**Sprite Animation:**

```assembly
; Setup sprite animation system
LDA #$00        ; Start with frame 0
STA $0300       ; frame_counter

; Create animation frames in memory
LDA #$01        ; Frame 0: tile 1
STA $0310
LDA #$02        ; Frame 1: tile 2
STA $0311
LDA #$03        ; Frame 2: tile 3
STA $0312
LDA #$02        ; Frame 3: tile 2 (back to middle)
STA $0313

; Setup sprite
LDA #$80        ; Y position
STA $0200
LDA #$01        ; Starting tile
STA $0201
LDA #$00        ; Attributes
STA $0202
LDA #$80        ; X position
STA $0203

; Animate through several frames
JSR animate_sprite
JSR animate_sprite
JSR animate_sprite

animate_sprite:
    LDX $0300       ; Load frame counter
    LDA $0310,X     ; Get tile for current frame
    STA $0201       ; Update sprite tile
    
    ; Advance frame
    INC $0300       ; Next frame
    LDA $0300
    CMP #$04        ; 4 frames total?
    BNE done
    LDA #$00        ; Reset to frame 0
    STA $0300
done:
    RTS

; Sprite animation is working!
```

## Multiple Sprites

Managing multiple sprites requires organizing the OAM data:

```text
; Player sprite (sprite 0)
player_sprite = $0200

; Enemy sprites (sprites 1-4)  
enemy1_sprite = $0204
enemy2_sprite = $0208
enemy3_sprite = $020C
enemy4_sprite = $0210

setup_game_sprites:
    ; Setup player
    LDA #$B0        ; Bottom of screen
    STA player_sprite+0     ; Y position
    LDA #$10        ; Player tile
    STA player_sprite+1     ; Tile number
    LDA #$00        ; Palette 0
    STA player_sprite+2     ; Attributes
    LDA #$80        ; Center X
    STA player_sprite+3     ; X position
    
    ; Setup enemy 1
    LDA #$40        ; Top area
    STA enemy1_sprite+0     ; Y position
    LDA #$20        ; Enemy tile
    STA enemy1_sprite+1     ; Tile number
    LDA #$01        ; Palette 1
    STA enemy1_sprite+2     ; Attributes
    LDA #$40        ; Left side
    STA enemy1_sprite+3     ; X position
    
    RTS
```

## Sprite Palettes

Sprites use their own separate palettes:

```text
load_sprite_palettes:
    ; Set PPU address to sprite palette area
    LDA #$3F
    STA $2006
    LDA #$10        ; Sprite palette start
    STA $2006
    
    ; Sprite palette 0 (player)
    LDA #$0F        ; Transparent (not used)
    STA $2007
    LDA #$30        ; White
    STA $2007
    LDA #$16        ; Red
    STA $2007
    LDA #$12        ; Blue
    STA $2007
    
    ; Sprite palette 1 (enemies)
    LDA #$0F        ; Transparent
    STA $2007
    LDA #$07        ; Brown
    STA $2007
    LDA #$17        ; Yellow
    STA $2007
    LDA #$0F        ; Black
    STA $2007
    
    RTS
```

**Sprite Palettes:**

```assembly
; Load sprite palettes
JSR load_sprite_palettes_demo

load_sprite_palettes_demo:
    ; Set PPU address to sprite palette area ($3F10)
    LDA #$3F
    STA $2006
    LDA #$10        ; Sprite palette start
    STA $2006
    
    ; Sprite palette 0 (player colors)
    LDA #$0F        ; Transparent
    STA $2007
    LDA #$30        ; White
    STA $2007
    LDA #$16        ; Red  
    STA $2007
    LDA #$12        ; Blue
    STA $2007
    
    ; Sprite palette 1 (enemy colors)
    LDA #$0F        ; Transparent
    STA $2007
    LDA #$28        ; Yellow
    STA $2007
    LDA #$17        ; Orange
    STA $2007
    LDA #$07        ; Brown
    STA $2007
    
    RTS

; Sprite palettes loaded - ready for colorful sprites!
```

## OAM DMA Transfer

For efficiency, the NES can transfer all sprite data at once using DMA:

```text
; DMA transfer routine
oam_dma:
    LDA #$02        ; High byte of OAM address ($0200)
    STA $4014       ; OAM DMA register
    ; Hardware automatically transfers 256 bytes from $0200-$02FF to PPU
    RTS
```

This transfers all 64 sprites in one operation!

## Sprite Symphony Visual Elements

Let's create visual elements for our music project:

```text
init_music_sprites:
    ; Musical note sprite
    LDA #$60        ; Y position (staff line)
    STA $0200
    LDA #$30        ; Musical note tile
    STA $0201
    LDA #$00        ; Palette 0
    STA $0202
    LDA #$40        ; X position
    STA $0203
    
    ; Cursor sprite (shows current note)
    LDA #$58        ; Y position (slightly above staff)
    STA $0204
    LDA #$31        ; Cursor tile
    STA $0205
    LDA #$01        ; Palette 1 (different color)
    STA $0206
    LDA #$40        ; X position (same as note)
    STA $0207
    
    RTS

move_music_cursor:
    ; Move cursor to next note position
    LDA $0207       ; Current X position
    CLC
    ADC #$20        ; Move 32 pixels right
    STA $0207       ; Store new position
    RTS
```

**Sprite Symphony Visual Elements:**

```assembly
; Initialize musical sprites for Sprite Symphony
JSR init_music_sprites_demo

init_music_sprites_demo:
    ; Musical note sprite (what's being played)
    LDA #$60        ; Y position on staff
    STA $0200       ; Note sprite Y
    LDA #$30        ; Musical note tile
    STA $0201       ; Note sprite tile
    LDA #$00        ; Palette 0 (red notes)
    STA $0202       ; Note sprite attributes
    LDA #$40        ; Starting X position
    STA $0203       ; Note sprite X
    
    ; Cursor sprite (shows current position)
    LDA #$58        ; Y position (above staff)
    STA $0204       ; Cursor sprite Y
    LDA #$31        ; Cursor/arrow tile
    STA $0205       ; Cursor sprite tile
    LDA #%01000000  ; Palette 1 (blue cursor)
    STA $0206       ; Cursor sprite attributes
    LDA #$40        ; Same X as note
    STA $0207       ; Cursor sprite X
    
    RTS

; Move cursor to next note position
move_cursor_right:
    LDA $0207       ; Get cursor X position
    CLC
    ADC #$18        ; Move 24 pixels right
    STA $0207       ; Store new cursor position
    RTS

; Musical sprites are ready for interactive display!
```

## Handling Sprite Limitations

The 8-sprites-per-scanline limit requires careful management:

```text
; Sprite flickering technique
flicker_sprites:
    LDA frame_counter
    AND #$01        ; Every other frame
    BNE show_odd_sprites
    
show_even_sprites:
    ; Show sprites 0,2,4,6,8...
    LDX #$00
even_loop:
    LDA sprites_y,X
    STA $0200,X
    ; ... copy sprite data ...
    TXA
    CLC
    ADC #$08        ; Skip to next even sprite
    TAX
    CPX #$40        ; Done with even sprites?
    BNE even_loop
    RTS
    
show_odd_sprites:
    ; Show sprites 1,3,5,7,9...
    ; Similar code for odd sprites
    RTS
```

## Practical Exercise: Player Character System

Create a complete player character system with:

1. Player sprite at bottom center of screen
2. 4-frame walking animation
3. Ability to move left/right
4. Color palette for the player
5. Boundary checking (don't go off screen)

**Practice: Player Character System:**

```assembly
; Complete Player Character System
JSR init_player_system

init_player_system:
    ; Initialize player position
    LDA #$B0        ; Y position (near bottom)
    STA $0200       ; Player Y
    LDA #$10        ; Player tile (standing)
    STA $0201       ; Player tile
    LDA #$00        ; Palette 0
    STA $0202       ; Player attributes
    LDA #$80        ; X position (center)
    STA $0203       ; Player X
    
    ; Initialize animation system
    LDA #$00        ; Start with frame 0
    STA $0300       ; animation_frame
    LDA #$00        ; Animation timer
    STA $0301       ; animation_timer
    
    ; Create walk cycle frames
    LDA #$10        ; Standing frame
    STA $0310       ; walk_frames[0]
    LDA #$11        ; Walking frame 1
    STA $0311       ; walk_frames[1]
    LDA #$10        ; Standing frame
    STA $0312       ; walk_frames[2]
    LDA #$12        ; Walking frame 2
    STA $0313       ; walk_frames[3]
    
    RTS

; Move player left with animation
move_player_left:
    ; Check boundary
    LDA $0203       ; Current X position
    CMP #$08        ; Left boundary
    BCC no_move     ; Don't move if at edge
    
    ; Move left
    SEC
    SBC #$02        ; Move 2 pixels left
    STA $0203       ; Store new position
    
    ; Animate
    JSR animate_player
    
no_move:
    RTS

; Move player right with animation  
move_player_right:
    ; Check boundary
    LDA $0203       ; Current X position
    CMP #$F0        ; Right boundary
    BCS no_move_right ; Don't move if at edge
    
    ; Move right
    CLC
    ADC #$02        ; Move 2 pixels right
    STA $0203       ; Store new position
    
    ; Animate
    JSR animate_player
    
no_move_right:
    RTS

; Animate player walking
animate_player:
    ; Advance animation timer
    INC $0301       ; animation_timer
    LDA $0301
    CMP #$08        ; Change frame every 8 calls?
    BNE no_frame_change
    
    ; Reset timer and advance frame
    LDA #$00
    STA $0301       ; Reset timer
    INC $0300       ; Next frame
    LDA $0300
    CMP #$04        ; 4 frames total?
    BNE update_sprite
    LDA #$00        ; Reset to frame 0
    STA $0300
    
update_sprite:
    ; Update sprite tile based on current frame
    LDX $0300       ; Get current frame
    LDA $0310,X     ; Get tile for this frame
    STA $0201       ; Update player sprite tile
    
no_frame_change:
    RTS

; Test the player system
JSR move_player_right
JSR move_player_right
JSR move_player_left

; Player character system is complete!
```

## What You've Learned

In this sprite-focused lesson, you've mastered:

- NES sprite system and OAM (Object Attribute Memory) structure
- Sprite positioning, attributes, and display properties
- Creating and managing multiple sprites for game objects
- Sprite animation techniques using tile swapping
- Sprite palettes and color management
- Movement and boundary checking for game characters
- Handling sprite limitations and optimization techniques

## Looking Ahead

Next lesson, you'll learn about the APU (Audio Processing Unit) architecture - the sound system that creates all the music and sound effects in NES games. You'll discover how the NES generates audio and prepares for creating your own game sounds!

## Fun Fact

The NES sprite system was revolutionary for home consoles in 1985! The ability to display 64 independent moving objects was far superior to most home computers of the era. However, the 8-sprites-per-scanline limitation led to the famous "sprite flickering" seen in games like Contra and Gradius when too many enemies appeared on the same horizontal line. Professional game developers learned to work around this by using sprite multiplexing techniques, carefully positioning enemies, and even using background tiles to simulate additional sprites. These optimization techniques became an art form and contributed to the unique visual style of classic NES games!