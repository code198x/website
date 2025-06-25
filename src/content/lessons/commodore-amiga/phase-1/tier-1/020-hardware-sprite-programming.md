---
title: "Hardware Sprite Programming"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 20
description: "Master the Amiga's hardware sprite system. Learn to create, animate, and control sprites using the dedicated sprite hardware, implement collision detection, and combine sprites with other graphics for professional game programming."
learning_objectives:
  - "Understand the Amiga's 8-sprite hardware system"
  - "Master sprite data format and control registers"
  - "Implement smooth sprite animation and movement"
  - "Program hardware collision detection"
  - "Combine sprites with backgrounds and effects"
concepts:
  - "Hardware sprite architecture"
  - "Sprite data format and DMA"
  - "Sprite positioning and control"
  - "Collision detection hardware"
  - "Professional sprite animation techniques"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 20
---

# Lesson 20: Hardware Sprite Programming

Welcome to one of the Amiga's most distinctive features - hardware sprites! The Amiga can display 8 sprites independently of the background, with full collision detection and smooth movement. You'll learn to master the sprite system and use it to create dynamic game characters and objects for your Copper Dreams project.

## Understanding Hardware Sprites

The Amiga's sprite system provides:
- **8 independent sprites** (SPR0-SPR7)
- **16 pixels wide, unlimited height**
- **4 colors per sprite** (including transparency)
- **Hardware collision detection**
- **Independent positioning** and movement
- **No CPU overhead** for display

Sprites are particularly important because they move independently of the background and don't require expensive blitting operations.

## Sprite Data Format

Each sprite consists of control words followed by image data:

<CodeRunner 
  system="commodore-amiga"
  title="Sprite Data Structure"
  code="; Understanding sprite data format
; Each sprite has: Control words + Image data + End marker

; Sprite image data structure
SpriteExample:
    ; Control words (filled by hardware or Copper)
    DC.W    0               ; SPRPOS - position (filled by system)
    DC.W    0               ; SPRCTL - control (filled by system)
    
    ; Image data - 2 words per line (bitplanes)
    ; Line 1: Simple vertical bar pattern
    DC.W    %1111111100000000  ; Bitplane A (pixels 0-15)
    DC.W    %0000000011111111  ; Bitplane B (pixels 0-15)
    
    ; Line 2: Different pattern
    DC.W    %1010101010101010  ; Bitplane A
    DC.W    %0101010101010101  ; Bitplane B
    
    ; Line 3: Solid pattern
    DC.W    %1111111111111111  ; Bitplane A
    DC.W    %1111111111111111  ; Bitplane B
    
    ; Line 4: Gradient effect
    DC.W    %1111110000111111  ; Bitplane A
    DC.W    %0000001111000000  ; Bitplane B
    
    ; End of sprite (zeros terminate)
    DC.W    0, 0

; Sprite color interpretation:
; Both bits 0: Transparent
; Bit A=1, B=0: Color 1 for this sprite
; Bit A=0, B=1: Color 2 for this sprite  
; Bit A=1, B=1: Color 3 for this sprite

; Colors for sprites 0 and 1 (paired)
SetSpriteColors01:
    LEA     $DFF000, A6
    MOVE.W  #$0F00, $1A2(A6)    ; COLOR17 - SPR0 color 1 (red)
    MOVE.W  #$00F0, $1A4(A6)    ; COLOR18 - SPR0 color 2 (green)
    MOVE.W  #$000F, $1A6(A6)    ; COLOR19 - SPR0 color 3 (blue)
    MOVE.W  #$0FF0, $1A8(A6)    ; COLOR20 - SPR1 color 1 (yellow)
    MOVE.W  #$0F0F, $1AA(A6)    ; COLOR21 - SPR1 color 2 (magenta)
    MOVE.W  #$00FF, $1AC(A6)    ; COLOR22 - SPR1 color 3 (cyan)
    RTS

; Position sprite on screen
; D0 = X position (0-448 for PAL)
; D1 = Y position (0-311 for PAL)
; D2 = Sprite height
; A0 = Sprite data address
PositionSprite0:
    LEA     $DFF000, A6
    
    ; Set sprite data pointer
    MOVE.L  A0, $120(A6)        ; SPR0PT
    
    ; Calculate SPRPOS value
    ; High bit of X in bit 0 of SPRPOS
    MOVE.W  D0, D3              ; Copy X
    LSR.W   #1, D3              ; Shift high bit to position 0
    AND.W   #1, D3              ; Isolate high bit
    
    ; Low 8 bits of X in bits 7-0 of SPRPOS  
    MOVE.W  D0, D4
    LSL.W   #7, D4              ; Shift to bits 15-8
    AND.W   #$FF80, D4          ; Mask low bits
    OR.W    D4, D3              ; Combine with high bit
    
    ; Add Y position (bits 15-8)
    LSL.W   #8, D1              ; Shift Y to high byte
    OR.W    D1, D3              ; Combine
    
    ; Set position
    MOVE.W  D3, $140(A6)        ; SPR0POS
    
    ; Calculate SPRCTL value (stop position)
    ADD.W   D2, D1              ; Y + height
    LSL.W   #8, D1              ; Shift to high byte
    
    ; Add low bit of X and control bits
    MOVE.W  D0, D4
    AND.W   #1, D4              ; Get low bit of X
    LSL.W   #1, D4              ; Shift to bit 1
    OR.W    D4, D1              ; Combine
    
    ; Set control
    MOVE.W  D1, $142(A6)        ; SPR0CTL
    
    RTS"
  language="assembly"
/>

## Creating and Animating Sprites

Professional sprite animation requires efficient data management:

<CodeRunner 
  system="commodore-amiga"
  title="Sprite Animation System"
  code="; Complete sprite animation system

; Sprite object structure
    RSRESET
SPR_X           RS.W    1       ; X position
SPR_Y           RS.W    1       ; Y position
SPR_VX          RS.W    1       ; X velocity
SPR_VY          RS.W    1       ; Y velocity
SPR_FRAME       RS.W    1       ; Current animation frame
SPR_TIMER       RS.W    1       ; Animation timer
SPR_DATA        RS.L    1       ; Pointer to sprite data
SPR_SIZE        RS.W    0       ; Size of structure

; Initialize sprite system
InitSprites:
    ; Clear all sprite data pointers
    LEA     $DFF000, A6
    CLR.L   $120(A6)            ; SPR0PT
    CLR.L   $124(A6)            ; SPR1PT
    CLR.L   $128(A6)            ; SPR2PT
    CLR.L   $12C(A6)            ; SPR3PT
    CLR.L   $130(A6)            ; SPR4PT
    CLR.L   $134(A6)            ; SPR5PT
    CLR.L   $138(A6)            ; SPR6PT
    CLR.L   $13C(A6)            ; SPR7PT
    
    ; Set sprite colors
    BSR     SetAllSpriteColors
    
    ; Initialize sprite objects
    LEA     SpriteObjects, A0
    MOVEQ   #7, D7              ; 8 sprites
    
InitSpriteLoop:
    ; Initialize sprite object
    MOVE.W  #100, SPR_X(A0)     ; Starting X
    MOVE.W  #100, SPR_Y(A0)     ; Starting Y
    MOVE.W  #2, SPR_VX(A0)      ; X velocity
    MOVE.W  #1, SPR_VY(A0)      ; Y velocity
    CLR.W   SPR_FRAME(A0)       ; Start at frame 0
    CLR.W   SPR_TIMER(A0)       ; Reset timer
    
    ; Set sprite data pointer
    LEA     SpriteFrames, A1
    MOVE.L  A1, SPR_DATA(A0)
    
    ; Next sprite
    ADD.L   #SPR_SIZE, A0
    DBF     D7, InitSpriteLoop
    
    RTS

; Update all sprites
UpdateSprites:
    LEA     SpriteObjects, A0
    MOVEQ   #7, D7              ; 8 sprites
    
UpdateSpriteLoop:
    ; Update position
    MOVE.W  SPR_X(A0), D0
    ADD.W   SPR_VX(A0), D0
    MOVE.W  D0, SPR_X(A0)
    
    MOVE.W  SPR_Y(A0), D1
    ADD.W   SPR_VY(A0), D1
    MOVE.W  D1, SPR_Y(A0)
    
    ; Bounce off screen edges
    CMP.W   #320, D0            ; Right edge?
    BLT     NotRightBounce
    NEG.W   SPR_VX(A0)
    MOVE.W  #320, SPR_X(A0)
NotRightBounce:
    
    TST.W   D0                  ; Left edge?
    BPL     NotLeftBounce
    NEG.W   SPR_VX(A0)
    CLR.W   SPR_X(A0)
NotLeftBounce:
    
    CMP.W   #200, D1            ; Bottom edge?
    BLT     NotBottomBounce
    NEG.W   SPR_VY(A0)
    MOVE.W  #200, SPR_Y(A0)
NotBottomBounce:
    
    TST.W   D1                  ; Top edge?
    BPL     NotTopBounce
    NEG.W   SPR_VY(A0)
    CLR.W   SPR_Y(A0)
NotTopBounce:
    
    ; Update animation
    MOVE.W  SPR_TIMER(A0), D2
    ADDQ.W  #1, D2
    CMP.W   #8, D2              ; Change frame every 8 updates
    BLT     NoFrameChange
    
    CLR.W   D2                  ; Reset timer
    MOVE.W  SPR_FRAME(A0), D3
    ADDQ.W  #1, D3
    CMP.W   #4, D3              ; 4 frames of animation
    BLT     FrameOK
    CLR.W   D3                  ; Loop back to frame 0
FrameOK:
    MOVE.W  D3, SPR_FRAME(A0)
    
NoFrameChange:
    MOVE.W  D2, SPR_TIMER(A0)
    
    ; Position sprite hardware
    MOVE.W  D7, D4              ; Sprite number
    BSR     PositionSpriteHW
    
    ; Next sprite
    ADD.L   #SPR_SIZE, A0
    DBF     D7, UpdateSpriteLoop
    
    RTS

; Position sprite hardware
; A0 = Sprite object
; D4 = Sprite number (0-7)
PositionSpriteHW:
    MOVEM.L D0-D3/A1-A2, -(SP)
    
    ; Get sprite data for current frame
    MOVE.L  SPR_DATA(A0), A1
    MOVE.W  SPR_FRAME(A0), D0
    MULU    #SPRITE_FRAME_SIZE, D0  ; Each frame is this many bytes
    ADD.L   D0, A1              ; A1 = current frame data
    
    ; Set sprite data pointer
    LEA     $DFF000, A2
    MOVE.W  D4, D0
    LSL.W   #2, D0              ; Sprite number * 4
    ADD.W   #$120, D0           ; SPRxPT offset
    MOVE.L  A1, (A2,D0.W)       ; Set pointer
    
    ; Calculate position registers
    MOVE.W  SPR_X(A0), D0       ; X position
    MOVE.W  SPR_Y(A0), D1       ; Y position
    MOVE.W  #16, D2             ; Sprite height
    
    ; Position calculation
    MOVE.W  D0, D3
    LSR.W   #1, D3              ; X high bit
    AND.W   #1, D3
    MOVE.W  D0, D0
    LSL.W   #7, D0
    AND.W   #$FF80, D0
    OR.W    D3, D0
    LSL.W   #8, D1
    OR.W    D1, D0
    
    ; Set position register
    MOVE.W  D4, D3
    LSL.W   #2, D3
    ADD.W   #$140, D3           ; SPRxPOS offset
    MOVE.W  D0, (A2,D3.W)
    
    ; Set control register
    ADD.W   #16, D1             ; Stop position
    MOVE.W  SPR_X(A0), D0
    AND.W   #1, D0
    LSL.W   #1, D0
    OR.W    D0, D1
    ADDQ.W  #2, D3              ; SPRxCTL offset
    MOVE.W  D1, (A2,D3.W)
    
    MOVEM.L (SP)+, D0-D3/A1-A2
    RTS

; Set all sprite colors
SetAllSpriteColors:
    LEA     $DFF000, A6
    
    ; Sprites 0,1 (use colors 17-22)
    MOVE.W  #$0F00, $1A2(A6)    ; SPR0 color 1 - red
    MOVE.W  #$00F0, $1A4(A6)    ; SPR0 color 2 - green
    MOVE.W  #$000F, $1A6(A6)    ; SPR0 color 3 - blue
    MOVE.W  #$0FF0, $1A8(A6)    ; SPR1 color 1 - yellow
    MOVE.W  #$0F0F, $1AA(A6)    ; SPR1 color 2 - magenta
    MOVE.W  #$00FF, $1AC(A6)    ; SPR1 color 3 - cyan
    
    ; Sprites 2,3 (use colors 25-30)
    MOVE.W  #$0800, $1B2(A6)    ; SPR2 color 1 - dark red
    MOVE.W  #$0080, $1B4(A6)    ; SPR2 color 2 - dark green
    MOVE.W  #$0008, $1B6(A6)    ; SPR2 color 3 - dark blue
    MOVE.W  #$0880, $1B8(A6)    ; SPR3 color 1 - dark yellow
    MOVE.W  #$0808, $1BA(A6)    ; SPR3 color 2 - dark magenta
    MOVE.W  #$0088, $1BC(A6)    ; SPR3 color 3 - dark cyan
    
    ; Continue for sprites 4-7...
    
    RTS

; Sprite animation frames
SPRITE_FRAME_SIZE   EQU 36      ; Bytes per animation frame

SpriteFrames:
    ; Frame 0 - Ball shape
    DC.W    0, 0                ; Control words
    DC.W    %0000011000000000, %0000011000000000
    DC.W    %0000111100000000, %0000111100000000
    DC.W    %0001111110000000, %0001111110000000
    DC.W    %0011111111000000, %0011111111000000
    DC.W    %0011111111000000, %0011111111000000
    DC.W    %0001111110000000, %0001111110000000
    DC.W    %0000111100000000, %0000111100000000
    DC.W    %0000011000000000, %0000011000000000
    DC.W    0, 0                ; End marker
    
    ; Frame 1 - Slightly different
    DC.W    0, 0
    DC.W    %0000111100000000, %0000100100000000
    DC.W    %0001111110000000, %0001011010000000
    DC.W    %0011111111000000, %0010100101000000
    DC.W    %0111111111100000, %0101010101010000
    DC.W    %0111111111100000, %0101010101010000
    DC.W    %0011111111000000, %0010100101000000
    DC.W    %0001111110000000, %0001011010000000
    DC.W    %0000111100000000, %0000100100000000
    DC.W    0, 0
    
    ; Frames 2 and 3 continue the animation...

; Data
SpriteObjects:      DS.B    SPR_SIZE * 8    ; 8 sprite objects"
  language="assembly"
/>

## Hardware Collision Detection

The Amiga provides automatic collision detection between sprites and backgrounds:

<CodeRunner 
  system="commodore-amiga"
  title="Hardware Collision Detection System"
  code="; Hardware collision detection implementation

; Collision detection using hardware registers
CheckCollisions:
    LEA     $DFF000, A6
    
    ; Read collision registers
    MOVE.W  $00E(A6), D0        ; CLXDAT - collision data
    
    ; Test sprite-sprite collisions
    BTST    #0, D0              ; SPR0 vs SPR1?
    BEQ     NoSpr01Collision
    BSR     HandleSprite01Collision
NoSpr01Collision:
    
    BTST    #1, D0              ; SPR0 vs SPR2?
    BEQ     NoSpr02Collision
    BSR     HandleSprite02Collision
NoSpr02Collision:
    
    BTST    #2, D0              ; SPR0 vs SPR3?
    BEQ     NoSpr03Collision
    BSR     HandleSprite03Collision
NoSpr03Collision:
    
    ; Continue for all sprite pairs...
    
    ; Test sprite-playfield collisions
    BTST    #8, D0              ; SPR0 vs odd playfield?
    BEQ     NoSpr0PF1Collision
    BSR     HandleSprite0PlayfieldCollision
NoSpr0PF1Collision:
    
    BTST    #9, D0              ; SPR0 vs even playfield?
    BEQ     NoSpr0PF2Collision
    BSR     HandleSprite0Playfield2Collision
NoSpr0PF2Collision:
    
    ; Clear collision register for next frame
    MOVE.W  D0, $00E(A6)        ; Writing clears collisions
    
    RTS

; Setup collision detection
InitCollisionDetection:
    LEA     $DFF000, A6
    
    ; Set collision control register
    ; Enable all collision types we want to detect
    MOVE.W  #$FFFF, $098(A6)    ; CLXCON - enable all collisions
    
    ; Clear any existing collisions
    MOVE.W  #$FFFF, $00E(A6)    ; Clear CLXDAT
    
    RTS

; Handle specific collision types
HandleSprite01Collision:
    ; Example: Bounce sprites apart
    LEA     SpriteObjects, A0
    LEA     SpriteObjects+SPR_SIZE, A1
    
    ; Reverse velocities
    NEG.W   SPR_VX(A0)
    NEG.W   SPR_VY(A0)
    NEG.W   SPR_VX(A1)
    NEG.W   SPR_VY(A1)
    
    ; Play collision sound
    BSR     PlayCollisionSound
    
    RTS

HandleSprite0PlayfieldCollision:
    ; Example: Player hit a wall
    LEA     SpriteObjects, A0
    
    ; Stop sprite movement
    CLR.W   SPR_VX(A0)
    CLR.W   SPR_VY(A0)
    
    ; Trigger game event
    MOVE.W  #1, PlayerHitWall
    
    RTS

; Advanced collision detection with pixel precision
PixelPerfectCollision:
    ; For when hardware collision isn't precise enough
    ; A0 = Sprite 1 object
    ; A1 = Sprite 2 object
    ; Returns: D0 = 1 if collision, 0 if not
    
    MOVEM.L D1-D7/A2-A4, -(SP)
    
    ; Get sprite positions
    MOVE.W  SPR_X(A0), D0       ; Sprite 1 X
    MOVE.W  SPR_Y(A0), D1       ; Sprite 1 Y
    MOVE.W  SPR_X(A1), D2       ; Sprite 2 X
    MOVE.W  SPR_Y(A1), D3       ; Sprite 2 Y
    
    ; Quick bounding box test first
    ; Check X overlap
    SUB.W   D2, D0              ; X difference
    BPL     Spr1Right
    NEG.W   D0                  ; Make positive
Spr1Right:
    CMP.W   #16, D0             ; 16 pixels wide
    BGE     NoCollision         ; No X overlap
    
    ; Check Y overlap
    SUB.W   D3, D1              ; Y difference
    BPL     Spr1Below
    NEG.W   D1
Spr1Below:
    CMP.W   #16, D1             ; Assume 16 pixels high
    BGE     NoCollision         ; No Y overlap
    
    ; Bounding boxes overlap, check pixel level
    ; (Implementation would check actual pixel data)
    ; For this example, return collision
    MOVEQ   #1, D0
    BRA     CollisionDone
    
NoCollision:
    MOVEQ   #0, D0
    
CollisionDone:
    MOVEM.L (SP)+, D1-D7/A2-A4
    RTS

; Game-specific collision handlers
PlayCollisionSound:
    ; Trigger sound effect
    LEA     $DFF000, A6
    
    ; Use audio channel 3 for sound effects
    MOVE.L  #CollisionSample, $0D0(A6)   ; AUD3LC
    MOVE.W  #100, $0D4(A6)              ; AUD3LEN
    MOVE.W  #200, $0D6(A6)              ; AUD3PER
    MOVE.W  #64, $0D8(A6)               ; AUD3VOL
    
    ; Trigger sample
    MOVE.W  #$8208, $096(A6)            ; Enable audio DMA
    
    RTS

; Collision response system
CollisionResponse:
    ; Check what type of objects collided
    MOVE.W  CollisionType, D0
    
    CMP.W   #PLAYER_ENEMY, D0
    BEQ     PlayerEnemyCollision
    CMP.W   #PLAYER_POWERUP, D0
    BEQ     PlayerPowerupCollision
    CMP.W   #BULLET_ENEMY, D0
    BEQ     BulletEnemyCollision
    
    RTS

PlayerEnemyCollision:
    ; Reduce player health
    SUBQ.W  #1, PlayerHealth
    BEQ     GameOver
    
    ; Make player invulnerable temporarily
    MOVE.W  #60, PlayerInvulTime    ; 1 second at 60fps
    
    RTS

PlayerPowerupCollision:
    ; Increase score
    ADD.L   #1000, PlayerScore
    
    ; Remove powerup sprite
    BSR     RemovePowerupSprite
    
    RTS

; Constants for collision types
PLAYER_ENEMY    EQU 1
PLAYER_POWERUP  EQU 2
BULLET_ENEMY    EQU 3

; Game variables
PlayerHealth:       DC.W    3
PlayerScore:        DC.L    0
PlayerInvulTime:    DC.W    0
PlayerHitWall:      DC.W    0
CollisionType:      DC.W    0

; Sample data for collision sound
CollisionSample:
    DC.B    $7F,$00,$7F,$00,$7F,$00,$7F,$00  ; Simple click sound
    ; ... continue for 100 bytes"
  language="assembly"
/>

## Advanced Sprite Techniques

Implement professional sprite effects and optimizations:

<CodeRunner 
  system="commodore-amiga"
  title="Advanced Sprite Programming Techniques"
  code="; Advanced sprite programming for professional games

; Sprite pooling system for efficient memory use
InitSpritePool:
    ; Create a pool of reusable sprite objects
    LEA     SpritePool, A0
    MOVEQ   #MAX_SPRITES-1, D7
    
PoolInitLoop:
    MOVE.W  #-1, SPR_X(A0)      ; Mark as inactive
    CLR.L   SPR_DATA(A0)
    ADD.L   #SPR_SIZE, A0
    DBF     D7, PoolInitLoop
    
    ; Initialize free list
    MOVE.W  #0, NextFreeSprite
    
    RTS

; Allocate sprite from pool
; Returns: A0 = sprite object, or 0 if none available
AllocateSprite:
    LEA     SpritePool, A0
    MOVE.W  NextFreeSprite, D0
    
    CMP.W   #MAX_SPRITES, D0
    BGE     NoSpritesAvailable
    
    ; Calculate sprite address
    MULU    #SPR_SIZE, D0
    ADD.L   D0, A0
    
    ; Check if really free
    MOVE.W  SPR_X(A0), D1
    CMP.W   #-1, D1
    BNE     FindNextFreeSprite
    
    ; Mark as used
    CLR.W   SPR_X(A0)           ; Valid position
    
    ; Find next free sprite
    BSR     FindNextFreeSprite
    
    RTS

NoSpritesAvailable:
    MOVEQ   #0, A0              ; Return null
    RTS

FindNextFreeSprite:
    ; Scan for next free sprite
    MOVE.W  NextFreeSprite, D0
    ADDQ.W  #1, D0
    
ScanLoop:
    CMP.W   #MAX_SPRITES, D0
    BGE     NoMoreFree
    
    LEA     SpritePool, A1
    MOVE.W  D0, D1
    MULU    #SPR_SIZE, D1
    ADD.L   D1, A1
    
    MOVE.W  SPR_X(A1), D1
    CMP.W   #-1, D1
    BEQ     FoundFree
    
    ADDQ.W  #1, D0
    BRA     ScanLoop
    
FoundFree:
    MOVE.W  D0, NextFreeSprite
    RTS
    
NoMoreFree:
    MOVE.W  #MAX_SPRITES, NextFreeSprite
    RTS

; Free sprite back to pool
; A0 = sprite object to free
FreeSprite:
    ; Mark as inactive
    MOVE.W  #-1, SPR_X(A0)
    CLR.L   SPR_DATA(A0)
    
    ; Update free list if needed
    MOVE.W  NextFreeSprite, D0
    CMP.W   #MAX_SPRITES, D0
    BLT     StillHaveFree
    
    ; Calculate sprite index
    LEA     SpritePool, A1
    SUB.L   A1, A0
    DIVU    #SPR_SIZE, A0
    MOVE.W  A0, NextFreeSprite
    
StillHaveFree:
    RTS

; Multi-layer sprite system
; Sprites can have different priorities and layers
InitSpriteLayers:
    ; Layer 0: Background objects (sprites 6-7)
    MOVE.W  #6, BackgroundLayer
    MOVE.W  #2, BackgroundCount
    
    ; Layer 1: Game objects (sprites 2-5)
    MOVE.W  #2, GameLayer
    MOVE.W  #4, GameCount
    
    ; Layer 2: Player and UI (sprites 0-1)
    MOVE.W  #0, PlayerLayer
    MOVE.W  #2, PlayerCount
    
    RTS

; Assign sprite to layer
; D0 = sprite type
; A0 = sprite object
AssignSpriteToLayer:
    CMP.W   #SPRITE_PLAYER, D0
    BEQ     AssignToPlayer
    CMP.W   #SPRITE_BULLET, D0
    BEQ     AssignToGame
    CMP.W   #SPRITE_ENEMY, D0
    BEQ     AssignToGame
    ; Default to background
    
AssignToBackground:
    BSR     GetBackgroundSprite
    RTS
    
AssignToGame:
    BSR     GetGameSprite
    RTS
    
AssignToPlayer:
    BSR     GetPlayerSprite
    RTS

; Sprite animation with data compression
PlaySpriteAnimation:
    ; A0 = sprite object
    ; A1 = compressed animation data
    
    MOVEM.L D0-D3/A2-A3, -(SP)
    
    ; Get current frame
    MOVE.W  SPR_FRAME(A0), D0
    
    ; Find frame data in compressed format
    MOVE.L  A1, A2              ; Animation data
    
FindFrameLoop:
    MOVE.B  (A2)+, D1           ; Frame number
    CMP.B   #$FF, D1            ; End marker?
    BEQ     AnimationEnd
    
    CMP.B   D1, D0              ; Our frame?
    BEQ     FoundFrame
    
    ; Skip this frame's data
    MOVE.B  (A2)+, D2           ; Data length
    ADD.W   D2, A2              ; Skip data
    BRA     FindFrameLoop
    
FoundFrame:
    MOVE.B  (A2)+, D2           ; Data length
    LEA     TempSpriteData, A3
    
    ; Decompress frame data
    BSR     DecompressSpriteFrame
    
    ; Set sprite data pointer
    MOVE.L  A3, SPR_DATA(A0)
    
AnimationEnd:
    MOVEM.L (SP)+, D0-D3/A2-A3
    RTS

; Simple run-length decompression
DecompressSpriteFrame:
    ; A2 = compressed data
    ; A3 = output buffer
    ; D2 = data length
    
    MOVEQ   #0, D3              ; Byte counter
    
DecompressLoop:
    CMP.W   D2, D3
    BGE     DecompressDone
    
    MOVE.B  (A2)+, D0           ; Read control byte
    ADDQ.W  #1, D3
    
    BTST    #7, D0              ; Run length?
    BEQ     LiteralByte
    
    ; Run length encoding
    AND.W   #$7F, D0            ; Get count
    MOVE.B  (A2)+, D1           ; Get byte to repeat
    ADDQ.W  #1, D3
    
RepeatLoop:
    MOVE.B  D1, (A3)+
    DBF     D0, RepeatLoop
    BRA     DecompressLoop
    
LiteralByte:
    ; Literal data
    MOVE.B  D0, (A3)+
    BRA     DecompressLoop
    
DecompressDone:
    RTS

; Constants
MAX_SPRITES         EQU 64
SPRITE_PLAYER       EQU 1
SPRITE_ENEMY        EQU 2
SPRITE_BULLET       EQU 3
SPRITE_POWERUP      EQU 4

; Variables
NextFreeSprite:     DC.W    0
BackgroundLayer:    DC.W    0
BackgroundCount:    DC.W    0
GameLayer:          DC.W    0
GameCount:          DC.W    0
PlayerLayer:        DC.W    0
PlayerCount:        DC.W    0

; Data
SpritePool:         DS.B    SPR_SIZE * MAX_SPRITES
TempSpriteData:     DS.B    256     ; Buffer for decompressed frames"
  language="assembly"
/>

## Practice Exercise: Create a Sprite-Based Game

Build a complete mini-game using hardware sprites:

<CodeRunner 
  system="commodore-amiga"
  title="Practice: Sprite Blaster Game"
  code="; Create a simple sprite-based arcade game
; Player controls a sprite, shoots at enemies, collects powerups

SpriteBlaster:
    ; Initialize game
    BSR     InitGame
    BSR     InitSprites
    BSR     InitCollisionDetection
    
    ; Main game loop
GameLoop:
    BSR     WaitVBlank
    
    ; Update game state
    BSR     ReadInput
    BSR     UpdatePlayer
    BSR     UpdateEnemies
    BSR     UpdateBullets
    BSR     UpdatePowerups
    BSR     CheckCollisions
    BSR     UpdateSprites
    
    ; Spawn new objects
    BSR     SpawnEnemies
    BSR     SpawnPowerups
    
    ; Check game over
    TST.W   PlayerHealth
    BEQ     GameOver
    
    ; Check exit
    BTST    #6, $BFE001         ; Left mouse
    BNE     GameLoop
    
    RTS

InitGame:
    ; Game state
    MOVE.W  #3, PlayerHealth
    CLR.L   PlayerScore
    MOVE.W  #160, PlayerX       ; Center of screen
    MOVE.W  #180, PlayerY       ; Near bottom
    CLR.W   EnemySpawnTimer
    CLR.W   PowerupSpawnTimer
    
    ; Clear object lists
    LEA     EnemyList, A0
    MOVEQ   #MAX_ENEMIES-1, D7
ClearEnemies:
    MOVE.W  #-1, (A0)           ; Mark inactive
    ADDQ.L  #4, A0              ; Each enemy = 4 bytes
    DBF     D7, ClearEnemies
    
    RTS

ReadInput:
    ; Read joystick port 2
    MOVE.W  $DFF00C, D0         ; JOY0DAT
    
    ; Check directions
    MOVE.W  D0, D1
    AND.W   #$0003, D1          ; Horizontal
    CMP.W   #$0001, D1
    BEQ     MoveLeft
    CMP.W   #$0002, D1
    BEQ     MoveRight
    BRA     CheckVertical
    
MoveLeft:
    MOVE.W  PlayerX, D0
    SUBQ.W  #3, D0              ; Move speed
    BPL     SetPlayerX
    MOVEQ   #0, D0
SetPlayerX:
    MOVE.W  D0, PlayerX
    BRA     CheckVertical
    
MoveRight:
    MOVE.W  PlayerX, D0
    ADDQ.W  #3, D0
    CMP.W   #304, D0            ; Screen edge - sprite width
    BLE     SetPlayerX2
    MOVE.W  #304, D0
SetPlayerX2:
    MOVE.W  D0, PlayerX
    
CheckVertical:
    MOVE.W  D0, D1
    AND.W   #$0300, D1          ; Vertical
    LSR.W   #8, D1
    CMP.W   #$0001, D1
    BEQ     MoveUp
    CMP.W   #$0002, D1
    BEQ     MoveDown
    BRA     CheckFire
    
MoveUp:
    MOVE.W  PlayerY, D0
    SUBQ.W  #2, D0
    CMP.W   #50, D0
    BGE     SetPlayerY
    MOVE.W  #50, D0
SetPlayerY:
    MOVE.W  D0, PlayerY
    BRA     CheckFire
    
MoveDown:
    MOVE.W  PlayerY, D0
    ADDQ.W  #2, D0
    CMP.W   #200, D0
    BLE     SetPlayerY2
    MOVE.W  #200, D0
SetPlayerY2:
    MOVE.W  D0, PlayerY
    
CheckFire:
    ; Check fire button
    MOVE.B  $BFE001, D0         ; CIA port A
    BTST    #6, D0              ; Fire button
    BNE     NoFire              ; Active low
    
    ; Limit fire rate
    MOVE.W  FireTimer, D0
    BEQ     CanFire
    SUBQ.W  #1, D0
    MOVE.W  D0, FireTimer
    BRA     NoFire
    
CanFire:
    BSR     FireBullet
    MOVE.W  #10, FireTimer      ; 10 frame delay
    
NoFire:
    RTS

UpdatePlayer:
    ; Position player sprite (sprite 0)
    LEA     SpriteObjects, A0
    MOVE.W  PlayerX, SPR_X(A0)
    MOVE.W  PlayerY, SPR_Y(A0)
    
    ; Player animation (if any)
    MOVE.W  SPR_TIMER(A0), D0
    ADDQ.W  #1, D0
    CMP.W   #30, D0             ; Slow animation
    BLT     PlayerAnimOK
    CLR.W   D0
    MOVE.W  SPR_FRAME(A0), D1
    ADDQ.W  #1, D1
    CMP.W   #2, D1              ; 2 frame animation
    BLT     PlayerFrameOK
    CLR.W   D1
PlayerFrameOK:
    MOVE.W  D1, SPR_FRAME(A0)
PlayerAnimOK:
    MOVE.W  D0, SPR_TIMER(A0)
    
    RTS

UpdateEnemies:
    LEA     EnemyList, A0
    LEA     SpriteObjects+SPR_SIZE*2, A1  ; Start at sprite 2
    MOVEQ   #MAX_ENEMIES-1, D7
    
UpdateEnemyLoop:
    MOVE.W  (A0), D0            ; Enemy X position
    CMP.W   #-1, D0             ; Active?
    BEQ     NextEnemy
    
    ; Move enemy down
    MOVE.W  2(A0), D1           ; Y position
    ADDQ.W  #2, D1              ; Enemy speed
    MOVE.W  D1, 2(A0)
    
    ; Check if off screen
    CMP.W   #240, D1
    BLT     EnemyOnScreen
    
    ; Remove enemy
    MOVE.W  #-1, (A0)
    BRA     NextEnemy
    
EnemyOnScreen:
    ; Update sprite position
    MOVE.W  D0, SPR_X(A1)
    MOVE.W  D1, SPR_Y(A1)
    
NextEnemy:
    ADDQ.L  #4, A0              ; Next enemy
    ADD.L   #SPR_SIZE, A1       ; Next sprite
    DBF     D7, UpdateEnemyLoop
    
    RTS

FireBullet:
    ; Find free bullet slot
    LEA     BulletList, A0
    MOVEQ   #MAX_BULLETS-1, D7
    
FindBulletSlot:
    MOVE.W  (A0), D0
    CMP.W   #-1, D0
    BEQ     FoundBulletSlot
    ADDQ.L  #4, A0
    DBF     D7, FindBulletSlot
    RTS                         ; No free slots
    
FoundBulletSlot:
    ; Create bullet
    MOVE.W  PlayerX, D0
    ADDQ.W  #8, D0              ; Center on player
    MOVE.W  D0, (A0)            ; X position
    MOVE.W  PlayerY, D0
    SUBQ.W  #16, D0             ; Above player
    MOVE.W  D0, 2(A0)           ; Y position
    
    RTS

SpawnEnemies:
    ; Timer for enemy spawning
    MOVE.W  EnemySpawnTimer, D0
    ADDQ.W  #1, D0
    CMP.W   #60, D0             ; Spawn every second
    BLT     NoEnemySpawn
    
    CLR.W   D0                  ; Reset timer
    
    ; Find free enemy slot
    LEA     EnemyList, A0
    MOVEQ   #MAX_ENEMIES-1, D7
    
FindEnemySlot:
    MOVE.W  (A0), D1
    CMP.W   #-1, D1
    BEQ     FoundEnemySlot
    ADDQ.L  #4, A0
    DBF     D7, FindEnemySlot
    BRA     NoEnemySpawn        ; No free slots
    
FoundEnemySlot:
    ; Create enemy at random X position
    BSR     GetRandomNumber
    AND.W   #$FF, D1            ; 0-255
    LSR.W   #1, D1              ; 0-127
    ADD.W   D1, D1              ; 0-254, even numbers
    ADD.W   #16, D1             ; 16-270, avoid edges
    MOVE.W  D1, (A0)            ; X position
    MOVE.W  #20, 2(A0)          ; Y position (top)
    
NoEnemySpawn:
    MOVE.W  D0, EnemySpawnTimer
    RTS

; Simple random number generator
GetRandomNumber:
    MOVE.L  RandomSeed, D0
    MULU    #1103515245, D0
    ADD.L   #12345, D0
    MOVE.L  D0, RandomSeed
    SWAP    D0
    MOVE.W  D0, D1
    RTS

; Game data
PlayerX:            DC.W    160
PlayerY:            DC.W    180
FireTimer:          DC.W    0
EnemySpawnTimer:    DC.W    0
PowerupSpawnTimer:  DC.W    0
RandomSeed:         DC.L    12345

MAX_ENEMIES         EQU 8
MAX_BULLETS         EQU 16

EnemyList:          DS.W    MAX_ENEMIES * 2     ; X,Y pairs
BulletList:         DS.W    MAX_BULLETS * 2     ; X,Y pairs

; Run the game!
BSR     SpriteBlaster"
  language="assembly"
/>

## What You've Learned

In this lesson, you've mastered hardware sprite programming:

- **Sprite data format** and how to create sprite graphics
- **Positioning and control** of all 8 hardware sprites
- **Animation systems** for smooth sprite movement
- **Hardware collision detection** and response systems
- **Advanced techniques** including sprite pooling and layers
- **Professional game programming** patterns for sprite-based games
- **Optimization strategies** for efficient sprite management

## Looking Ahead

Next, you'll learn about sprite animation and movement techniques. You'll discover advanced sprite effects, create complex animation systems, and learn how to combine sprites with other Amiga graphics features for stunning visual results!

## Fun Fact

The Amiga's sprite system was so advanced that it influenced the design of later graphics chips. The concept of hardware sprites with automatic collision detection was revolutionary - most computers required expensive software collision checking that consumed significant CPU time. The Amiga's sprite hardware could detect collisions between any sprites and even between sprites and background graphics, all automatically! This enabled smooth arcade-quality games that were impossible on other home computers. Many classic Amiga games like "Shadow of the Beast" and "Turrican" used sprite multiplexing techniques to display dozens of sprites simultaneously, creating visual spectacles that amazed audiences and established the Amiga as the premier gaming platform.