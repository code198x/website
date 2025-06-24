---
title: "Sprite Positioning and Movement"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 25
description: "Master precise sprite positioning and smooth movement animations. Learn to create coordinated sprite systems, movement patterns, and visual effects that bring your NES games to life."
learning_objectives:
  - "Control sprite positioning with pixel-perfect precision"
  - "Create smooth movement animations and patterns"
  - "Coordinate multiple sprites in complex arrangements"
  - "Implement sprite-based visual effects and feedback"
  - "Build foundation systems for Sprite Symphony"
concepts:
  - "Sprite coordinate systems and positioning"
  - "Movement vectors and animation timing"
  - "Multi-sprite coordination and management"
  - "Visual effects through sprite animation"
  - "Screen space and boundary management"
estimated_duration: "30-45 minutes"
difficulty: "easy"
code_examples: true
practical_exercise: true
order: 25
---

# Lesson 25: Sprite Positioning and Movement

Master the art of precise sprite control! This lesson teaches you how to position sprites exactly where you want them and create smooth, coordinated movements that form the visual foundation of your NES games.

## NES Sprite Coordinate System

Understanding the NES screen coordinate system is essential for precise sprite placement:

```text
NES Screen Coordinates:
  X: 0-255 (left to right)
  Y: 0-239 (top to bottom)
  
Visible Area:
  X: 8-247 (240 pixels wide)
  Y: 16-223 (208 pixels tall)
  
Special Values:
  Y = 0: Sprites are hidden
  Y > 239: Sprites wrap to top of screen
  X = 255: Sprite moves to left edge next frame
```

Basic sprite positioning with the NES PPU:

```assembly
; Sprite data structure (4 bytes per sprite)
; Byte 0: Y position (0-255)
; Byte 1: Tile number (0-255)
; Byte 2: Attributes (palette, flip, priority)
; Byte 3: X position (0-255)

SetSpritePosition:
    ; Set sprite 0 to position (100, 120)
    LDA #120             ; Y position
    STA SpriteData+0
    LDA #$01             ; Tile number
    STA SpriteData+1
    LDA #%00000000       ; Attributes (palette 0)
    STA SpriteData+2
    LDA #100             ; X position
    STA SpriteData+3
    RTS

MoveSpriteRight:
    ; Move sprite 0 right by 2 pixels
    LDA SpriteData+3     ; Get current X
    CLC
    ADC #$02             ; Add 2 pixels
    CMP #$F0             ; Check right boundary
    BCS SkipMove         ; Skip if too far right
    STA SpriteData+3     ; Store new X position
    
SkipMove:
    RTS

MoveSpriteDown:
    ; Move sprite 0 down by 1 pixel
    LDA SpriteData+0     ; Get current Y
    CLC
    ADC #$01             ; Add 1 pixel
    CMP #$E0             ; Check bottom boundary
    BCS SkipMoveY        ; Skip if too far down
    STA SpriteData+0     ; Store new Y position
    
SkipMoveY:
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Basic Sprite Positioning"
  code="; Basic sprite positioning and movement
Main:
    JSR InitSprites
    
GameLoop:
    JSR MoveSprites
    JSR UpdateDisplay
    JMP GameLoop

InitSprites:
    ; Initialize sprite 0
    LDA #$80             ; Y position (center)
    STA SpriteData+0
    LDA #$01             ; Tile 1
    STA SpriteData+1
    LDA #%00000000       ; Attributes
    STA SpriteData+2
    LDA #$80             ; X position (center)
    STA SpriteData+3
    
    ; Initialize sprite 1
    LDA #$60             ; Y position
    STA SpriteData+4
    LDA #$02             ; Tile 2
    STA SpriteData+5
    LDA #%00000001       ; Palette 1
    STA SpriteData+6
    LDA #$60             ; X position
    STA SpriteData+7
    RTS

MoveSprites:
    ; Move sprite 0 in a circle pattern
    INC CircleAngle
    LDA CircleAngle
    
    ; Simple circular movement (simplified)
    AND #$3F             ; 64-step circle
    CMP #$10
    BCC MoveRight
    CMP #$20
    BCC MoveDown
    CMP #$30
    BCC MoveLeft
    ; Move up
    LDA SpriteData+0
    SEC
    SBC #$01
    STA SpriteData+0
    JMP MoveSprite1
    
MoveRight:
    LDA SpriteData+3
    CLC
    ADC #$01
    STA SpriteData+3
    JMP MoveSprite1
    
MoveDown:
    LDA SpriteData+0
    CLC
    ADC #$01
    STA SpriteData+0
    JMP MoveSprite1
    
MoveLeft:
    LDA SpriteData+3
    SEC
    SBC #$01
    STA SpriteData+3
    
MoveSprite1:
    ; Move sprite 1 back and forth
    INC MoveCounter
    LDA MoveCounter
    AND #$7F             ; 128-frame cycle
    CMP #$40             ; Half cycle
    BCC MovingRight
    
    ; Moving left
    LDA SpriteData+7
    SEC
    SBC #$01
    CMP #$20             ; Left boundary
    BCC ResetMove
    STA SpriteData+7
    JMP MoveDone
    
MovingRight:
    LDA SpriteData+7
    CLC
    ADC #$01
    CMP #$E0             ; Right boundary
    BCS ResetMove
    STA SpriteData+7
    JMP MoveDone
    
ResetMove:
    ; Boundary hit, direction will change next cycle
    
MoveDone:
    RTS

UpdateDisplay:
    ; In real NES code, this would be handled by NMI
    ; and OAM DMA transfer
    RTS

; Variables
CircleAngle: .byte $00
MoveCounter: .byte $00

; Sprite data (would be at $0200 in real NES)
SpriteData:
    .byte $80, $01, $00, $80  ; Sprite 0
    .byte $60, $02, $01, $60  ; Sprite 1
    .byte $FF, $FF, $FF, $FF  ; Unused sprites
    .byte $FF, $FF, $FF, $FF"
  language="assembly"
/>

## Smooth Movement with Velocity

Create natural-looking movement using velocity and acceleration:

```assembly
; Velocity-based movement system
SpriteVelocities:
    ; X and Y velocities for each sprite (signed 8-bit)
    .byte $02, $01       ; Sprite 0: VelX, VelY
    .byte $FF, $02       ; Sprite 1: VelX, VelY
    .byte $01, $FF       ; Sprite 2: VelX, VelY
    .byte $00, $01       ; Sprite 3: VelX, VelY

UpdateSpritesWithVelocity:
    LDX #$00             ; Sprite index
    LDY #$00             ; Velocity index
    
SpriteUpdateLoop:
    ; Update X position
    LDA SpriteData+3,X   ; Get current X
    CLC
    ADC SpriteVelocities,Y ; Add X velocity
    
    ; Check X boundaries
    CMP #$08             ; Left boundary
    BCC BounceX          ; Bounce off left
    CMP #$F0             ; Right boundary  
    BCS BounceX          ; Bounce off right
    STA SpriteData+3,X   ; Store new X
    JMP UpdateY
    
BounceX:
    ; Reverse X velocity
    LDA SpriteVelocities,Y
    EOR #$FF             ; Invert bits
    CLC
    ADC #$01             ; Two's complement (negate)
    STA SpriteVelocities,Y
    
UpdateY:
    ; Update Y position
    INY                  ; Move to Y velocity
    LDA SpriteData,X     ; Get current Y
    CLC
    ADC SpriteVelocities,Y ; Add Y velocity
    
    ; Check Y boundaries
    CMP #$10             ; Top boundary
    BCC BounceY          ; Bounce off top
    CMP #$E0             ; Bottom boundary
    BCS BounceY          ; Bounce off bottom
    STA SpriteData,X     ; Store new Y
    JMP NextSprite
    
BounceY:
    ; Reverse Y velocity
    LDA SpriteVelocities,Y
    EOR #$FF             ; Invert bits
    CLC
    ADC #$01             ; Two's complement (negate)
    STA SpriteVelocities,Y
    
NextSprite:
    ; Move to next sprite
    TXA
    CLC
    ADC #$04             ; 4 bytes per sprite
    TAX
    INY                  ; Move to next velocity pair
    CPX #$10             ; Check if done (4 sprites)
    BNE SpriteUpdateLoop
    
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Velocity-Based Sprite Movement"
  code="; Smooth sprite movement with velocity and bouncing
Main:
    JSR InitSprites
    
GameLoop:
    JSR UpdateSprites
    JSR UpdateDisplay
    JMP GameLoop

InitSprites:
    ; Initialize 4 bouncing sprites
    LDA #$40             ; Sprite 0
    STA SpriteData+0     ; Y
    LDA #$01
    STA SpriteData+1     ; Tile
    LDA #$00
    STA SpriteData+2     ; Attributes
    LDA #$40
    STA SpriteData+3     ; X
    
    LDA #$60             ; Sprite 1
    STA SpriteData+4
    LDA #$02
    STA SpriteData+5
    LDA #$01
    STA SpriteData+6
    LDA #$C0
    STA SpriteData+7
    
    LDA #$A0             ; Sprite 2
    STA SpriteData+8
    LDA #$03
    STA SpriteData+9
    LDA #$02
    STA SpriteData+10
    LDA #$60
    STA SpriteData+11
    
    LDA #$80             ; Sprite 3
    STA SpriteData+12
    LDA #$04
    STA SpriteData+13
    LDA #$03
    STA SpriteData+14
    LDA #$A0
    STA SpriteData+15
    RTS

UpdateSprites:
    ; Update all 4 sprites with velocity
    LDX #$00             ; Sprite data index
    LDY #$00             ; Velocity index
    
SpriteLoop:
    ; Update X position
    LDA SpriteData+3,X   ; Current X
    CLC
    ADC VelocityX,Y      ; Add X velocity
    
    ; Boundary check X
    CMP #$08
    BCC BounceLeft
    CMP #$F0
    BCS BounceRight
    STA SpriteData+3,X
    JMP UpdateYPos
    
BounceLeft:
    LDA #$08
    STA SpriteData+3,X
    LDA VelocityX,Y
    EOR #$FF
    CLC
    ADC #$01
    STA VelocityX,Y
    JMP UpdateYPos
    
BounceRight:
    LDA #$EF
    STA SpriteData+3,X
    LDA VelocityX,Y
    EOR #$FF
    CLC
    ADC #$01
    STA VelocityX,Y
    
UpdateYPos:
    ; Update Y position
    LDA SpriteData+0,X   ; Current Y
    CLC
    ADC VelocityY,Y      ; Add Y velocity
    
    ; Boundary check Y
    CMP #$10
    BCC BounceTop
    CMP #$E0
    BCS BounceBottom
    STA SpriteData+0,X
    JMP NextSprite
    
BounceTop:
    LDA #$10
    STA SpriteData+0,X
    LDA VelocityY,Y
    EOR #$FF
    CLC
    ADC #$01
    STA VelocityY,Y
    JMP NextSprite
    
BounceBottom:
    LDA #$DF
    STA SpriteData+0,X
    LDA VelocityY,Y
    EOR #$FF
    CLC
    ADC #$01
    STA VelocityY,Y
    
NextSprite:
    ; Move to next sprite
    TXA
    CLC
    ADC #$04
    TAX
    INY
    CPY #$04             ; 4 sprites
    BNE SpriteLoop
    RTS

UpdateDisplay:
    ; Display update handled elsewhere
    RTS

; Velocity data for 4 sprites
VelocityX: .byte $02, $FE, $01, $FF   ; X velocities (signed)
VelocityY: .byte $01, $02, $FF, $01   ; Y velocities (signed)

; Sprite data
SpriteData:
    .byte $40, $01, $00, $40  ; Sprite 0
    .byte $60, $02, $01, $C0  ; Sprite 1
    .byte $A0, $03, $02, $60  ; Sprite 2
    .byte $80, $04, $03, $A0  ; Sprite 3"
  language="assembly"
/>

## Coordinated Multi-Sprite Movement

Create formations and patterns with multiple sprites moving together:

```assembly
; Formation flying system
FormationData:
    ; Relative positions for formation (X offset, Y offset)
    .byte $00, $00       ; Leader (no offset)
    .byte $10, $08       ; Right wing
    .byte $F0, $08       ; Left wing (-16, +8)
    .byte $00, $10       ; Tail position

UpdateFormation:
    ; Get leader position
    LDA SpriteData+3     ; Leader X
    STA LeaderX
    LDA SpriteData+0     ; Leader Y
    STA LeaderY
    
    ; Update formation members
    LDX #$04             ; Start with sprite 1
    LDY #$02             ; Start with formation offset 1
    
FormationLoop:
    ; Calculate target X position
    LDA LeaderX
    CLC
    ADC FormationData,Y  ; Add X offset
    STA TargetX
    
    ; Calculate target Y position
    INY
    LDA LeaderY
    CLC
    ADC FormationData,Y  ; Add Y offset
    STA TargetY
    
    ; Move sprite toward target position
    JSR MoveToTarget
    
    ; Next sprite
    TXA
    CLC
    ADC #$04             ; Next sprite data
    TAX
    INY                  ; Next formation offset
    CPX #$10             ; Check if done (4 sprites total)
    BNE FormationLoop
    
    RTS

MoveToTarget:
    ; X is sprite data index
    ; Move sprite smoothly toward target position
    
    ; Move X toward target
    LDA SpriteData+3,X   ; Current X
    CMP TargetX
    BEQ CheckY           ; Already at target X
    BCC MoveXRight       ; Need to move right
    
    ; Move left
    SEC
    SBC #$01
    STA SpriteData+3,X
    JMP CheckY
    
MoveXRight:
    CLC
    ADC #$01
    STA SpriteData+3,X
    
CheckY:
    ; Move Y toward target
    LDA SpriteData+0,X   ; Current Y
    CMP TargetY
    BEQ MoveDone         ; Already at target Y
    BCC MoveYDown        ; Need to move down
    
    ; Move up
    SEC
    SBC #$01
    STA SpriteData+0,X
    RTS
    
MoveYDown:
    CLC
    ADC #$01
    STA SpriteData+0,X
    
MoveDone:
    RTS

; Variables
LeaderX: .byte $00
LeaderY: .byte $00
TargetX: .byte $00
TargetY: .byte $00
```

## Sprite-Based Visual Effects

Create engaging visual effects using coordinated sprite movement:

```assembly
; Explosion effect using sprites
ExplosionSprites:
    ; 4 sprites forming explosion particles
    .byte $80, $05, $00, $80  ; Center particle
    .byte $80, $06, $01, $80  ; Expanding particles
    .byte $80, $07, $02, $80
    .byte $80, $08, $03, $80

UpdateExplosion:
    LDA ExplosionActive
    BEQ ExplosionDone
    
    ; Expand particles outward from center
    INC ExplosionFrame
    LDA ExplosionFrame
    
    ; Calculate expansion distance
    LSR                  ; Divide by 2 for slower expansion
    STA ExpansionDist
    
    ; Update particle positions
    LDX #$00             ; Sprite 0 (stays center)
    
    ; Sprite 1 - move right
    LDA ExplosionCenterX
    CLC
    ADC ExpansionDist
    STA SpriteData+7     ; Sprite 1 X
    LDA ExplosionCenterY
    STA SpriteData+4     ; Sprite 1 Y
    
    ; Sprite 2 - move left
    LDA ExplosionCenterX
    SEC
    SBC ExpansionDist
    STA SpriteData+11    ; Sprite 2 X
    LDA ExplosionCenterY
    STA SpriteData+8     ; Sprite 2 Y
    
    ; Sprite 3 - move up
    LDA ExplosionCenterX
    STA SpriteData+15    ; Sprite 3 X
    LDA ExplosionCenterY
    SEC
    SBC ExpansionDist
    STA SpriteData+12    ; Sprite 3 Y
    
    ; Check if explosion finished
    LDA ExplosionFrame
    CMP #$20             ; 32 frame explosion
    BCC ExplosionDone
    
    ; End explosion
    LDA #$00
    STA ExplosionActive
    JSR HideExplosionSprites
    
ExplosionDone:
    RTS

StartExplosion:
    ; Start explosion at given position
    LDA #$01
    STA ExplosionActive
    LDA #$00
    STA ExplosionFrame
    
    ; Set center position
    LDA #$80             ; Center X
    STA ExplosionCenterX
    LDA #$80             ; Center Y
    STA ExplosionCenterY
    
    ; Initialize all sprites at center
    LDX #$00
ExplosionInitLoop:
    LDA ExplosionCenterY
    STA SpriteData,X     ; Y position
    LDA ExplosionSprites+1,X
    STA SpriteData+1,X   ; Tile
    LDA ExplosionSprites+2,X
    STA SpriteData+2,X   ; Attributes
    LDA ExplosionCenterX
    STA SpriteData+3,X   ; X position
    
    TXA
    CLC
    ADC #$04
    TAX
    CPX #$10             ; 4 sprites
    BNE ExplosionInitLoop
    
    RTS

HideExplosionSprites:
    ; Hide all explosion sprites
    LDX #$00
HideLoop:
    LDA #$FF             ; Y = 255 hides sprite
    STA SpriteData,X
    TXA
    CLC
    ADC #$04
    TAX
    CPX #$10
    BNE HideLoop
    RTS

; Variables
ExplosionActive: .byte $00
ExplosionFrame: .byte $00
ExplosionCenterX: .byte $80
ExplosionCenterY: .byte $80
ExpansionDist: .byte $00
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Coordinated Sprite Formation"
  code="; Formation flying demonstration
Main:
    JSR InitFormation
    
GameLoop:
    JSR UpdateLeader
    JSR UpdateFormation
    JSR UpdateDisplay
    JMP GameLoop

InitFormation:
    ; Initialize leader sprite
    LDA #$80
    STA SpriteData+0     ; Leader Y
    LDA #$01
    STA SpriteData+1     ; Leader tile
    LDA #$00
    STA SpriteData+2     ; Leader attributes
    LDA #$40
    STA SpriteData+3     ; Leader X
    
    ; Initialize formation members
    LDX #$04             ; Start with sprite 1
FormationInitLoop:
    LDA #$80             ; Initial Y
    STA SpriteData+0,X
    LDA #$02             ; Formation tile
    STA SpriteData+1,X
    LDA #$01             ; Different palette
    STA SpriteData+2,X
    LDA #$40             ; Initial X
    STA SpriteData+3,X
    
    TXA
    CLC
    ADC #$04
    TAX
    CPX #$10
    BNE FormationInitLoop
    
    RTS

UpdateLeader:
    ; Move leader in a pattern
    INC LeaderPhase
    LDA LeaderPhase
    
    ; Create circular movement
    AND #$3F             ; 64-step circle
    STA CurrentAngle
    
    ; Calculate X position (simplified sine)
    LDA CurrentAngle
    CMP #$10
    BCC LeaderQuad1
    CMP #$20
    BCC LeaderQuad2
    CMP #$30
    BCC LeaderQuad3
    ; Quad 4
    LDA SpriteData+3
    SEC
    SBC #$01
    JMP StoreLeaderX
    
LeaderQuad1:
    LDA SpriteData+3
    CLC
    ADC #$01
    JMP StoreLeaderX
    
LeaderQuad2:
    LDA SpriteData+0
    CLC
    ADC #$01
    JMP StoreLeaderY
    
LeaderQuad3:
    LDA SpriteData+3
    SEC
    SBC #$01
    
StoreLeaderX:
    CMP #$20
    BCC KeepLeaderX
    CMP #$E0
    BCS KeepLeaderX
    STA SpriteData+3
    JMP CheckLeaderY
    
KeepLeaderX:
    JMP CheckLeaderY
    
StoreLeaderY:
    CMP #$20
    BCC KeepLeaderY
    CMP #$E0
    BCS KeepLeaderY
    STA SpriteData+0
    
CheckLeaderY:
KeepLeaderY:
    RTS

UpdateFormation:
    ; Get leader position
    LDA SpriteData+3
    STA LeaderX
    LDA SpriteData+0
    STA LeaderY
    
    ; Update sprite 1 (right wing)
    LDA LeaderX
    CLC
    ADC #$18             ; 24 pixels right
    STA TargetX
    LDA LeaderY
    CLC
    ADC #$10             ; 16 pixels down
    STA TargetY
    LDX #$04             ; Sprite 1 data
    JSR MoveToTarget
    
    ; Update sprite 2 (left wing)
    LDA LeaderX
    SEC
    SBC #$18             ; 24 pixels left
    STA TargetX
    LDA LeaderY
    CLC
    ADC #$10             ; 16 pixels down
    STA TargetY
    LDX #$08             ; Sprite 2 data
    JSR MoveToTarget
    
    ; Update sprite 3 (tail)
    LDA LeaderX
    STA TargetX          ; Same X as leader
    LDA LeaderY
    CLC
    ADC #$20             ; 32 pixels down
    STA TargetY
    LDX #$0C             ; Sprite 3 data
    JSR MoveToTarget
    
    RTS

MoveToTarget:
    ; Smoothly move sprite at index X toward target
    ; Move X
    LDA SpriteData+3,X
    CMP TargetX
    BEQ MoveTargetY
    BCC MoveTargetRight
    SEC
    SBC #$02             ; Move left
    STA SpriteData+3,X
    JMP MoveTargetY
    
MoveTargetRight:
    CLC
    ADC #$02             ; Move right
    STA SpriteData+3,X
    
MoveTargetY:
    ; Move Y
    LDA SpriteData+0,X
    CMP TargetY
    BEQ MoveTargetDone
    BCC MoveTargetDown
    SEC
    SBC #$02             ; Move up
    STA SpriteData+0,X
    RTS
    
MoveTargetDown:
    CLC
    ADC #$02             ; Move down
    STA SpriteData+0,X
    
MoveTargetDone:
    RTS

UpdateDisplay:
    ; Display would be updated via NMI in real code
    RTS

; Variables
LeaderPhase: .byte $00
CurrentAngle: .byte $00
LeaderX: .byte $00
LeaderY: .byte $00
TargetX: .byte $00
TargetY: .byte $00

; Sprite data
SpriteData:
    .byte $80, $01, $00, $40  ; Leader
    .byte $80, $02, $01, $40  ; Right wing
    .byte $80, $02, $01, $40  ; Left wing
    .byte $80, $02, $01, $40  ; Tail"
  language="assembly"
/>

## Sprite Symphony Foundation

Begin building the visual component of Sprite Symphony with musical note sprites:

```assembly
; Musical note sprite system for Sprite Symphony
NoteSprites:
    ; Different note values represented by different tiles
    .byte $10            ; Whole note
    .byte $11            ; Half note
    .byte $12            ; Quarter note
    .byte $13            ; Eighth note
    .byte $14            ; Sixteenth note

PlayVisualNote:
    ; Display a note sprite when audio plays
    LDA CurrentNote      ; Note being played
    STA NoteTile
    
    ; Calculate position based on note pitch
    LDA NotePitch
    LSR                  ; Divide by 2
    LSR                  ; Divide by 4
    CLC
    ADC #$20             ; Base Y position
    STA NoteY
    
    ; Calculate X position based on time
    LDA NoteTime
    CLC
    ADC #$40             ; Base X position
    STA NoteX
    
    ; Set up sprite
    LDX NoteSprite       ; Current note sprite index
    LDA NoteY
    STA SpriteData+0,X   ; Y position
    LDA NoteTile
    STA SpriteData+1,X   ; Tile
    LDA #%00000010       ; Palette 2
    STA SpriteData+2,X   ; Attributes
    LDA NoteX
    STA SpriteData+3,X   ; X position
    
    ; Start note animation
    LDA #$20             ; 32 frame animation
    STA NoteAnimTimer
    
    RTS

UpdateNoteAnimation:
    ; Animate the note sprite
    LDA NoteAnimTimer
    BEQ NoteAnimDone
    
    DEC NoteAnimTimer
    
    ; Make note fade by changing palette
    LDA NoteAnimTimer
    CMP #$10             ; Half time
    BCS NoteAnimDone
    
    ; Change to dimmer palette
    LDX NoteSprite
    LDA #%00000011       ; Palette 3 (dimmer)
    STA SpriteData+2,X
    
    ; Hide sprite when animation done
    LDA NoteAnimTimer
    BNE NoteAnimDone
    LDA #$FF             ; Hide sprite
    STA SpriteData+0,X
    
NoteAnimDone:
    RTS

CreateNoteDisplay:
    ; Create a visual display of current musical sequence
    LDX #$00             ; Note index
    LDY #$00             ; Sprite index
    
NoteDisplayLoop:
    ; Get note from sequence
    LDA MusicSequence,X
    CMP #$FF             ; End marker?
    BEQ NoteDisplayDone
    
    ; Position sprite based on sequence position
    TXA
    ASL                  ; * 2
    ASL                  ; * 4
    ASL                  ; * 8 (8 pixels apart)
    CLC
    ADC #$30             ; Base X position
    STA SpriteData+3,Y   ; X position
    
    LDA #$B0             ; Base Y position
    STA SpriteData+0,Y   ; Y position
    
    LDA MusicSequence,X  ; Note value
    CLC
    ADC #$10             ; Base note tile
    STA SpriteData+1,Y   ; Tile
    
    LDA #%00000001       ; Palette 1
    STA SpriteData+2,Y   ; Attributes
    
    ; Next note and sprite
    INX
    TYA
    CLC
    ADC #$04             ; Next sprite
    TAY
    CPX #$08             ; Max 8 notes
    BNE NoteDisplayLoop
    
NoteDisplayDone:
    RTS

; Variables for Sprite Symphony
CurrentNote: .byte $00
NotePitch: .byte $60
NoteTime: .byte $00
NoteTile: .byte $10
NoteX: .byte $40
NoteY: .byte $80
NoteSprite: .byte $00
NoteAnimTimer: .byte $00

; Music sequence for display
MusicSequence:
    .byte $01, $02, $01, $03, $02, $01, $04, $FF
```

## Practice Exercise

Create a complete sprite positioning and movement system that demonstrates all concepts:

1. Initialize multiple sprites in different positions
2. Implement smooth velocity-based movement with boundary bouncing
3. Create a formation flying pattern with a leader and followers
4. Add a visual effect using coordinated sprite animation
5. Build the foundation for Sprite Symphony's visual feedback system

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Complete Sprite Movement System"
  code="; Complete sprite positioning and movement demonstration
Main:
    JSR InitAllSprites
    
GameLoop:
    JSR UpdateMovement
    JSR UpdateFormation
    JSR UpdateEffects
    JSR UpdateDisplay
    JMP GameLoop

InitAllSprites:
    ; Initialize bouncing sprites (0-3)
    LDX #$00
InitBouncers:
    TXA
    ASL
    ASL
    ASL                  ; * 8
    CLC
    ADC #$40             ; Spread positions
    STA SpriteData+0,X   ; Y position
    
    LDA #$01
    STA SpriteData+1,X   ; Tile
    
    TXA
    LSR
    LSR                  ; Divide by 4 for palette
    STA SpriteData+2,X   ; Attributes
    
    TXA
    ASL
    ASL                  ; * 4
    CLC
    ADC #$50
    STA SpriteData+3,X   ; X position
    
    TXA
    CLC
    ADC #$04
    TAX
    CPX #$10             ; 4 sprites * 4 bytes
    BNE InitBouncers
    
    ; Initialize formation sprites (4-7)
    LDA #$60
    STA SpriteData+16    ; Formation leader Y
    LDA #$05
    STA SpriteData+17    ; Leader tile
    LDA #$02
    STA SpriteData+18    ; Leader attributes
    LDA #$80
    STA SpriteData+19    ; Leader X
    
    ; Formation followers
    LDX #$14             ; Sprite 5 offset
    LDY #$03             ; 3 followers
InitFollowers:
    LDA #$60
    STA SpriteData+0,X   ; Y
    LDA #$06
    STA SpriteData+1,X   ; Tile
    LDA #$03
    STA SpriteData+2,X   ; Attributes
    LDA #$80
    STA SpriteData+3,X   ; X
    
    TXA
    CLC
    ADC #$04
    TAX
    DEY
    BNE InitFollowers
    
    RTS

UpdateMovement:
    ; Update bouncing sprites with velocity
    LDX #$00             ; Sprite index
    LDY #$00             ; Velocity index
    
BounceLoop:
    ; Update X with velocity
    LDA SpriteData+3,X
    CLC
    ADC VelocityX,Y
    
    ; Check X boundaries
    CMP #$10
    BCC BounceXLeft
    CMP #$E0
    BCS BounceXRight
    STA SpriteData+3,X
    JMP UpdateYBounce
    
BounceXLeft:
    LDA #$10
    STA SpriteData+3,X
    LDA VelocityX,Y
    EOR #$FF
    CLC
    ADC #$01
    STA VelocityX,Y
    JMP UpdateYBounce
    
BounceXRight:
    LDA #$DF
    STA SpriteData+3,X
    LDA VelocityX,Y
    EOR #$FF
    CLC
    ADC #$01
    STA VelocityX,Y
    
UpdateYBounce:
    ; Update Y with velocity
    LDA SpriteData+0,X
    CLC
    ADC VelocityY,Y
    
    ; Check Y boundaries
    CMP #$20
    BCC BounceYTop
    CMP #$D0
    BCS BounceYBottom
    STA SpriteData+0,X
    JMP NextBouncer
    
BounceYTop:
    LDA #$20
    STA SpriteData+0,X
    LDA VelocityY,Y
    EOR #$FF
    CLC
    ADC #$01
    STA VelocityY,Y
    JMP NextBouncer
    
BounceYBottom:
    LDA #$CF
    STA SpriteData+0,X
    LDA VelocityY,Y
    EOR #$FF
    CLC
    ADC #$01
    STA VelocityY,Y
    
NextBouncer:
    TXA
    CLC
    ADC #$04
    TAX
    INY
    CPY #$04             ; 4 bouncing sprites
    BNE BounceLoop
    
    RTS

UpdateFormation:
    ; Move formation leader
    INC FormationTimer
    LDA FormationTimer
    AND #$7F             ; 128 frame cycle
    CMP #$40
    BCC MoveFormationRight
    
    ; Move left
    LDA SpriteData+19    ; Leader X
    SEC
    SBC #$01
    CMP #$30
    BCC FormationBoundary
    STA SpriteData+19
    JMP UpdateFollowers
    
MoveFormationRight:
    LDA SpriteData+19    ; Leader X
    CLC
    ADC #$01
    CMP #$D0
    BCS FormationBoundary
    STA SpriteData+19
    JMP UpdateFollowers
    
FormationBoundary:
    ; At boundary, just continue
    
UpdateFollowers:
    ; Update formation followers to follow leader
    LDA SpriteData+19    ; Leader X
    STA LeaderX
    LDA SpriteData+16    ; Leader Y
    STA LeaderY
    
    ; Follower 1 (right)
    LDA LeaderX
    CLC
    ADC #$18
    STA TargetX
    LDA LeaderY
    CLC
    ADC #$10
    STA TargetY
    LDX #$14             ; Sprite 5
    JSR MoveToTarget
    
    ; Follower 2 (left)
    LDA LeaderX
    SEC
    SBC #$18
    STA TargetX
    LDA LeaderY
    CLC
    ADC #$10
    STA TargetY
    LDX #$18             ; Sprite 6
    JSR MoveToTarget
    
    ; Follower 3 (behind)
    LDA LeaderX
    STA TargetX
    LDA LeaderY
    CLC
    ADC #$20
    STA TargetY
    LDX #$1C             ; Sprite 7
    JSR MoveToTarget
    
    RTS

MoveToTarget:
    ; Move sprite at X toward target position
    LDA SpriteData+3,X   ; Current X
    CMP TargetX
    BEQ MoveTargetYCheck
    BCC MoveTargetRight2
    SEC
    SBC #$01
    STA SpriteData+3,X
    JMP MoveTargetYCheck
    
MoveTargetRight2:
    CLC
    ADC #$01
    STA SpriteData+3,X
    
MoveTargetYCheck:
    LDA SpriteData+0,X   ; Current Y
    CMP TargetY
    BEQ MoveTargetComplete
    BCC MoveTargetDown2
    SEC
    SBC #$01
    STA SpriteData+0,X
    RTS
    
MoveTargetDown2:
    CLC
    ADC #$01
    STA SpriteData+0,X
    
MoveTargetComplete:
    RTS

UpdateEffects:
    ; Simple pulsing effect on formation leader
    INC PulseTimer
    LDA PulseTimer
    AND #$0F             ; 16 frame cycle
    CMP #$08
    BCC PulseNormal
    
    ; Pulse state - change tile
    LDA #$07             ; Bright tile
    STA SpriteData+17    ; Leader tile
    RTS
    
PulseNormal:
    LDA #$05             ; Normal tile
    STA SpriteData+17
    RTS

UpdateDisplay:
    ; In real NES, would use OAM DMA
    RTS

; Velocity arrays for bouncing sprites
VelocityX: .byte $02, $FE, $01, $FF
VelocityY: .byte $01, $02, $FF, $01

; Variables
FormationTimer: .byte $00
PulseTimer: .byte $00
LeaderX: .byte $00
LeaderY: .byte $00
TargetX: .byte $00
TargetY: .byte $00

; Sprite data (32 sprites worth)
SpriteData:
    ; Bouncing sprites (0-3)
    .byte $40, $01, $00, $50
    .byte $48, $01, $00, $58
    .byte $50, $01, $01, $60
    .byte $58, $01, $01, $68
    ; Formation sprites (4-7)
    .byte $60, $05, $02, $80
    .byte $60, $06, $03, $80
    .byte $60, $06, $03, $80
    .byte $60, $06, $03, $80"
  language="assembly"
/>

## What You've Learned

In this essential lesson, you've mastered:

- Precise sprite positioning using the NES coordinate system
- Smooth movement with velocity and acceleration systems
- Coordinated multi-sprite formations and patterns
- Sprite-based visual effects and animations
- Foundation systems for the Sprite Symphony project
- Boundary checking and collision detection

## Looking Ahead

In the next lesson, you'll learn to synchronize your sprite movements with audio output, creating the perfect harmony between visual and audio feedback that makes Sprite Symphony come alive!

## Fun Fact

The sprite positioning techniques you've learned were used to create some of the most memorable visual effects in NES games. Games like Gradius used formation flying patterns for option pods, while games like Contra used coordinated sprite movement for complex enemy patterns. The 8-sprite-per-scanline limitation of the NES meant that programmers had to be incredibly clever about sprite positioning to avoid flickering - skills that translate directly to modern game optimization!