---
title: "Sprite Animation and Movement"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 21
description: "Master advanced sprite animation techniques on the Amiga. Learn to create smooth movement patterns, implement complex animation sequences, and combine sprite effects with backgrounds for professional-quality animated graphics."
learning_objectives:
  - "Implement smooth sprite movement with sub-pixel accuracy"
  - "Create complex animation sequences and state machines"
  - "Master sprite scaling and rotation effects"
  - "Combine sprites with background graphics seamlessly"
  - "Build professional animation systems for games and demos"
concepts:
  - "Sub-pixel movement and interpolation"
  - "Animation state machines"
  - "Sprite scaling and transformation"
  - "Background integration techniques"
  - "Professional animation pipelines"
estimated_duration: "45-60 minutes"
difficulty: "intermediate"
code_examples: true
practical_exercise: true
order: 21
---

# Lesson 21: Sprite Animation and Movement

Today you'll master the art of sprite animation and movement on the Amiga. You'll learn professional techniques for creating smooth, fluid animations that rival arcade games, and discover how to combine sprites with backgrounds for stunning visual effects.

## Sub-Pixel Movement System

For smooth movement, especially at slow speeds, you need sub-pixel positioning:

<CodeRunner 
  system="commodore-amiga"
  title="Sub-Pixel Movement System"
  code="; Sub-pixel positioning for ultra-smooth movement

; Extended sprite structure with sub-pixel coordinates
    RSRESET
SPR_X_INT       RS.W    1       ; Integer X position  
SPR_Y_INT       RS.W    1       ; Integer Y position
SPR_X_FRAC      RS.W    1       ; Fractional X (0-255)
SPR_Y_FRAC      RS.W    1       ; Fractional Y (0-255)
SPR_VX_INT      RS.W    1       ; Integer X velocity
SPR_VY_INT      RS.W    1       ; Integer Y velocity  
SPR_VX_FRAC     RS.W    1       ; Fractional X velocity
SPR_VY_FRAC     RS.W    1       ; Fractional Y velocity
SPR_FRAME       RS.W    1       ; Animation frame
SPR_ANIM_TIMER  RS.W    1       ; Animation timer
SPR_STATE       RS.W    1       ; Animation state
SPR_DATA_PTR    RS.L    1       ; Sprite data pointer
SPR_EXT_SIZE    RS.W    0       ; Extended structure size

; Initialize sprite with sub-pixel positioning
InitSubPixelSprite:
    ; A0 = sprite structure
    ; D0 = start X (integer)
    ; D1 = start Y (integer)
    ; D2 = X velocity (8.8 fixed point)
    ; D3 = Y velocity (8.8 fixed point)
    
    MOVE.W  D0, SPR_X_INT(A0)
    MOVE.W  D1, SPR_Y_INT(A0)
    CLR.W   SPR_X_FRAC(A0)
    CLR.W   SPR_Y_FRAC(A0)
    
    ; Extract integer and fractional parts of velocity
    MOVE.W  D2, D4
    EXT.L   D4
    ASR.L   #8, D4              ; Integer part
    MOVE.W  D4, SPR_VX_INT(A0)
    AND.W   #$FF, D2            ; Fractional part
    MOVE.W  D2, SPR_VX_FRAC(A0)
    
    MOVE.W  D3, D4
    EXT.L   D4
    ASR.L   #8, D4
    MOVE.W  D4, SPR_VY_INT(A0)
    AND.W   #$FF, D3
    MOVE.W  D3, SPR_VY_FRAC(A0)
    
    CLR.W   SPR_FRAME(A0)
    CLR.W   SPR_ANIM_TIMER(A0)
    CLR.W   SPR_STATE(A0)
    
    RTS

; Update sprite position with sub-pixel accuracy
UpdateSubPixelSprite:
    ; A0 = sprite structure
    
    ; Update X position
    MOVE.W  SPR_X_FRAC(A0), D0
    ADD.W   SPR_VX_FRAC(A0), D0
    MOVE.W  D0, SPR_X_FRAC(A0)
    
    ; Check for carry to integer part
    CMP.W   #256, D0
    BLT     NoXCarry
    SUB.W   #256, D0
    MOVE.W  D0, SPR_X_FRAC(A0)
    ADDQ.W  #1, SPR_VX_INT(A0)  ; Add carry
NoXCarry:
    
    ; Add integer velocity
    MOVE.W  SPR_X_INT(A0), D0
    ADD.W   SPR_VX_INT(A0), D0
    MOVE.W  D0, SPR_X_INT(A0)
    
    ; Reset integer velocity for next frame
    CLR.W   SPR_VX_INT(A0)
    
    ; Repeat for Y coordinate
    MOVE.W  SPR_Y_FRAC(A0), D1
    ADD.W   SPR_VY_FRAC(A0), D1
    MOVE.W  D1, SPR_Y_FRAC(A0)
    
    CMP.W   #256, D1
    BLT     NoYCarry
    SUB.W   #256, D1
    MOVE.W  D1, SPR_Y_FRAC(A0)
    ADDQ.W  #1, SPR_VY_INT(A0)
NoYCarry:
    
    MOVE.W  SPR_Y_INT(A0), D1
    ADD.W   SPR_VY_INT(A0), D1
    MOVE.W  D1, SPR_Y_INT(A0)
    CLR.W   SPR_VY_INT(A0)
    
    RTS

; Smooth acceleration and deceleration
ApplyAcceleration:
    ; A0 = sprite structure
    ; D0 = X acceleration (8.8 fixed point)
    ; D1 = Y acceleration (8.8 fixed point)
    
    ; Add acceleration to velocity
    MOVE.W  SPR_VX_FRAC(A0), D2
    ADD.W   D0, D2
    
    ; Handle overflow/underflow
    CMP.W   #256, D2
    BLT     XAccelOK
    SUB.W   #256, D2
    ADDQ.W  #1, SPR_VX_INT(A0)
XAccelOK:
    TST.W   D2
    BPL     XAccelPos
    ADD.W   #256, D2
    SUBQ.W  #1, SPR_VX_INT(A0)
XAccelPos:
    MOVE.W  D2, SPR_VX_FRAC(A0)
    
    ; Repeat for Y
    MOVE.W  SPR_VY_FRAC(A0), D3
    ADD.W   D1, D3
    
    CMP.W   #256, D3
    BLT     YAccelOK
    SUB.W   #256, D3
    ADDQ.W  #1, SPR_VY_INT(A0)
YAccelOK:
    TST.W   D3
    BPL     YAccelPos
    ADD.W   #256, D3
    SUBQ.W  #1, SPR_VY_INT(A0)
YAccelPos:
    MOVE.W  D3, SPR_VY_FRAC(A0)
    
    RTS

; Interpolated movement between keyframes
InterpolateMovement:
    ; A0 = sprite structure
    ; A1 = keyframe array
    ; D0 = current time (0-255)
    
    MOVEM.L D1-D7/A2, -(SP)
    
    ; Find keyframes to interpolate between
    LEA     (A1), A2            ; Start of keyframes
    
FindKeyframes:
    MOVE.B  (A2), D1            ; Time of this keyframe
    CMP.B   D0, D1              ; Past our time?
    BGT     FoundKeyframes
    
    ADD.L   #8, A2              ; Next keyframe (time + X + Y + data)
    MOVE.B  (A2), D1
    CMP.B   #$FF, D1            ; End marker?
    BNE     FindKeyframes
    
    ; Use last keyframe
    SUB.L   #8, A2
    
FoundKeyframes:
    ; A2 points to keyframe after current time
    ; A2-8 points to keyframe before current time
    
    MOVE.B  -8(A2), D2          ; Previous time
    MOVE.B  (A2), D3            ; Next time
    
    ; Calculate interpolation factor
    SUB.B   D2, D0              ; Current - previous
    SUB.B   D2, D3              ; Next - previous
    BEQ     NoInterpolation     ; Same time
    
    ; Calculate fractional position (0-255)
    EXT.W   D0
    LSL.W   #8, D0              ; Scale to 8.8
    EXT.W   D3
    DIVU    D3, D0              ; D0 = fraction
    
    ; Interpolate X position
    MOVE.W  -6(A2), D4          ; Previous X
    MOVE.W  2(A2), D5           ; Next X
    SUB.W   D4, D5              ; Delta X
    MULS    D0, D5              ; Scale by fraction
    ASR.L   #8, D5              ; Convert back
    ADD.W   D4, D5              ; Add to previous
    MOVE.W  D5, SPR_X_INT(A0)
    
    ; Interpolate Y position
    MOVE.W  -4(A2), D6          ; Previous Y
    MOVE.W  4(A2), D7           ; Next Y
    SUB.W   D6, D7              ; Delta Y
    MULS    D0, D7              ; Scale by fraction
    ASR.L   #8, D7              ; Convert back
    ADD.W   D6, D7              ; Add to previous
    MOVE.W  D7, SPR_Y_INT(A0)
    
NoInterpolation:
    MOVEM.L (SP)+, D1-D7/A2
    RTS

; Example keyframe data
; Format: Time, X, Y, AnimFrame
KeyframeData:
    DC.B    0, 0,100, 0         ; Start: time 0, X=100, Y=100, frame 0
    DC.B    64, 0,200, 1        ; time 64, X=200, Y=100, frame 1
    DC.B    128, 0,300, 2       ; time 128, X=300, Y=100, frame 2
    DC.B    192, 0,200, 1       ; time 192, X=200, Y=100, frame 1
    DC.B    255, 0,100, 0       ; End: time 255, back to start
    DC.B    $FF                 ; End marker"
  language="assembly"
/>

## Advanced Animation State Machines

Create complex behaviors using state machines:

<CodeRunner 
  system="commodore-amiga"
  title="Animation State Machine System"
  code="; Sophisticated animation state machine for complex behaviors

; Animation states
ANIM_IDLE       EQU 0
ANIM_WALKING    EQU 1
ANIM_RUNNING    EQU 2
ANIM_JUMPING    EQU 3
ANIM_FALLING    EQU 4
ANIM_ATTACKING  EQU 5
ANIM_DYING      EQU 6

; State machine structure
    RSRESET
STATE_CURRENT   RS.W    1       ; Current state
STATE_TIMER     RS.W    1       ; Time in current state
STATE_FRAME     RS.W    1       ; Current frame in animation
STATE_SPEED     RS.W    1       ; Animation speed
STATE_FLAGS     RS.W    1       ; State flags
STATE_DATA      RS.L    1       ; Pointer to state data
STATE_SIZE      RS.W    0

; Animation frame structure
    RSRESET
FRAME_DURATION  RS.W    1       ; How long to show this frame
FRAME_SPRITE    RS.L    1       ; Pointer to sprite data
FRAME_OFFSET_X  RS.W    1       ; X offset for this frame
FRAME_OFFSET_Y  RS.W    1       ; Y offset for this frame
FRAME_FLAGS     RS.W    1       ; Special flags
FRAME_SIZE      RS.W    0

; Initialize state machine
InitStateMachine:
    ; A0 = sprite object
    ; A1 = state data table
    
    MOVE.W  #ANIM_IDLE, STATE_CURRENT(A0)
    CLR.W   STATE_TIMER(A0)
    CLR.W   STATE_FRAME(A0)
    MOVE.W  #4, STATE_SPEED(A0)  ; Default speed
    CLR.W   STATE_FLAGS(A0)
    MOVE.L  A1, STATE_DATA(A0)
    
    RTS

; Update animation state machine
UpdateStateMachine:
    ; A0 = sprite object with state machine
    
    MOVEM.L D0-D4/A1-A3, -(SP)
    
    ; Increment state timer
    MOVE.W  STATE_TIMER(A0), D0
    ADDQ.W  #1, D0
    MOVE.W  D0, STATE_TIMER(A0)
    
    ; Get current state data
    MOVE.L  STATE_DATA(A0), A1
    MOVE.W  STATE_CURRENT(A0), D1
    MULU    #32, D1             ; Each state = 32 bytes
    ADD.L   D1, A1              ; A1 = current state data
    
    ; Update animation frame
    MOVE.W  STATE_SPEED(A0), D2
    CMP.W   D2, D0              ; Time for next frame?
    BLT     NoFrameUpdate
    
    CLR.W   STATE_TIMER(A0)     ; Reset timer
    
    ; Advance to next frame
    MOVE.W  STATE_FRAME(A0), D3
    ADDQ.W  #1, D3
    
    ; Check if we've reached end of animation
    MOVE.W  2(A1), D4           ; Number of frames in this state
    CMP.W   D4, D3
    BLT     FrameOK
    
    ; Check if animation loops
    MOVE.W  4(A1), D4           ; Animation flags
    BTST    #0, D4              ; Loop flag?
    BEQ     AnimationEnd
    
    CLR.W   D3                  ; Loop back to frame 0
    BRA     FrameOK
    
AnimationEnd:
    ; Check for state transition
    MOVE.W  6(A1), D4           ; Next state
    CMP.W   #-1, D4             ; Stay in current state?
    BEQ     StayInState
    
    ; Change to new state
    MOVE.W  D4, STATE_CURRENT(A0)
    CLR.W   D3                  ; Start at frame 0
    CLR.W   STATE_TIMER(A0)
    
StayInState:
FrameOK:
    MOVE.W  D3, STATE_FRAME(A0)
    
NoFrameUpdate:
    ; Set sprite data based on current frame
    BSR     SetSpriteFromFrame
    
    MOVEM.L (SP)+, D0-D4/A1-A3
    RTS

; Trigger state change
ChangeAnimationState:
    ; A0 = sprite object
    ; D0 = new state
    
    CMP.W   STATE_CURRENT(A0), D0
    BEQ     StateChangeEnd      ; Already in this state
    
    MOVE.W  D0, STATE_CURRENT(A0)
    CLR.W   STATE_FRAME(A0)
    CLR.W   STATE_TIMER(A0)
    
    ; Check for state-specific initialization
    CMP.W   #ANIM_JUMPING, D0
    BEQ     InitJumpState
    CMP.W   #ANIM_ATTACKING, D0
    BEQ     InitAttackState
    CMP.W   #ANIM_DYING, D0
    BEQ     InitDeathState
    
StateChangeEnd:
    RTS

InitJumpState:
    ; Set upward velocity for jump
    MOVE.W  #-$0300, SPR_VY_FRAC(A0)  ; -3.0 pixels/frame
    RTS

InitAttackState:
    ; Trigger attack logic
    BSR     TriggerAttack
    RTS

InitDeathState:
    ; Start death sequence
    MOVE.W  #60, DeathTimer     ; 1 second death animation
    RTS

; Character behavior controller
UpdateCharacterBehavior:
    ; A0 = character sprite
    ; Determines what animation state to use based on conditions
    
    MOVEM.L D0-D2, -(SP)
    
    ; Check if character is dead
    TST.W   CharacterHealth
    BEQ     SetDeathState
    
    ; Check if attacking
    TST.W   AttackTimer
    BNE     SetAttackState
    
    ; Check vertical movement
    MOVE.W  SPR_VY_FRAC(A0), D0
    CMP.W   #-50, D0            ; Significant upward velocity?
    BLT     SetJumpState
    CMP.W   #50, D0             ; Significant downward velocity?
    BGT     SetFallState
    
    ; Check horizontal movement
    MOVE.W  SPR_VX_FRAC(A0), D0
    BEQ     SetIdleState        ; No movement
    
    ; Determine walk vs run based on speed
    BPL     PositiveVelocity
    NEG.W   D0                  ; Make positive for comparison
PositiveVelocity:
    CMP.W   #128, D0            ; Half pixel per frame
    BLT     SetWalkState
    BRA     SetRunState
    
SetIdleState:
    MOVEQ   #ANIM_IDLE, D0
    BRA     ApplyState
    
SetWalkState:
    MOVEQ   #ANIM_WALKING, D0
    BRA     ApplyState
    
SetRunState:
    MOVEQ   #ANIM_RUNNING, D0
    BRA     ApplyState
    
SetJumpState:
    MOVEQ   #ANIM_JUMPING, D0
    BRA     ApplyState
    
SetFallState:
    MOVEQ   #ANIM_FALLING, D0
    BRA     ApplyState
    
SetAttackState:
    MOVEQ   #ANIM_ATTACKING, D0
    BRA     ApplyState
    
SetDeathState:
    MOVEQ   #ANIM_DYING, D0
    
ApplyState:
    BSR     ChangeAnimationState
    
    MOVEM.L (SP)+, D0-D2
    RTS

; Character health and game variables
CharacterHealth:    DC.W    100
AttackTimer:        DC.W    0
DeathTimer:         DC.W    0"
  language="assembly"
/>

## Sprite Scaling and Transformation

Create impressive scaling and rotation effects:

<CodeRunner 
  system="commodore-amiga"
  title="Sprite Scaling and Transformation"
  code="; Software sprite scaling and transformation effects
; (Hardware sprites are fixed size, so we use software rendering)

; Scaled sprite structure
    RSRESET
SCALED_X        RS.W    1       ; Position
SCALED_Y        RS.W    1
SCALED_SCALE_X  RS.W    1       ; Scale factors (8.8 fixed point)
SCALED_SCALE_Y  RS.W    1
SCALED_ANGLE    RS.W    1       ; Rotation angle (0-255)
SCALED_SOURCE   RS.L    1       ; Source sprite data
SCALED_DEST     RS.L    1       ; Destination bitplane
SCALED_SIZE     RS.W    0

; Draw scaled sprite to bitplane
DrawScaledSprite:
    ; A0 = scaled sprite structure
    
    MOVEM.L D0-D7/A1-A6, -(SP)
    
    ; Get sprite data
    MOVE.L  SCALED_SOURCE(A0), A1   ; Source sprite
    MOVE.L  SCALED_DEST(A0), A2     ; Destination
    MOVE.W  SCALED_X(A0), D4        ; Position
    MOVE.W  SCALED_Y(A0), D5
    MOVE.W  SCALED_SCALE_X(A0), D6  ; Scale factors
    MOVE.W  SCALED_SCALE_Y(A0), D7
    
    ; Skip sprite header (control words)
    ADDQ.L  #4, A1              ; Skip to image data
    
    ; Calculate scaled dimensions
    MOVE.W  #16, D0             ; Original width
    MULS    D6, D0              ; Scale width
    ASR.L   #8, D0              ; Convert from 8.8
    MOVE.W  D0, D2              ; Scaled width
    
    ; Get sprite height (scan for end marker)
    MOVE.L  A1, A3
    MOVEQ   #0, D1              ; Height counter
CountHeight:
    MOVE.L  (A3)+, D3
    BEQ     HeightDone
    ADDQ.W  #1, D1
    BRA     CountHeight
HeightDone:
    
    MULS    D7, D1              ; Scale height
    ASR.L   #8, D1              ; Convert from 8.8
    MOVE.W  D1, D3              ; Scaled height
    
    ; Render scaled sprite
    MOVEQ   #0, D7              ; Y counter
    
ScaleYLoop:
    ; Calculate source Y (scale back)
    MOVE.W  D7, D0
    LSL.W   #8, D0              ; Convert to 8.8
    DIVU    SCALED_SCALE_Y(A0), D0  ; Unscale
    AND.W   #$FF, D0            ; Get Y coordinate
    
    ; Get source line
    MOVE.L  A1, A3
    LSL.W   #2, D0              ; 4 bytes per line
    ADD.W   D0, A3              ; A3 = source line
    
    ; Check if valid source line
    MOVE.L  (A3), D0
    BEQ     NextScaleY          ; End of sprite
    
    ; Calculate destination line
    MOVE.W  D5, D1              ; Base Y
    ADD.W   D7, D1              ; Add current Y
    MULU    #40, D1             ; Bytes per screen line
    ADD.L   D1, A2              ; A2 = dest line
    ADD.W   D4, A2              ; Add X offset
    
    ; Render scaled line
    MOVEQ   #0, D6              ; X counter
    
ScaleXLoop:
    ; Calculate source X
    MOVE.W  D6, D0
    LSL.W   #8, D0              ; Convert to 8.8
    DIVU    SCALED_SCALE_X(A0), D0
    AND.W   #$FF, D0            ; Get X coordinate
    
    ; Get source pixel
    MOVE.L  (A3), D1            ; Source line data
    MOVE.L  4(A3), D2           ; Second bitplane
    
    ; Extract pixel bits
    MOVEQ   #15, D3
    SUB.W   D0, D3              ; Bit position (MSB first)
    BTST    D3, D1              ; Test bitplane A
    SNE     D1
    AND.W   #1, D1
    BTST    D3, D2              ; Test bitplane B
    SNE     D2
    AND.W   #1, D2
    LSL.W   #1, D2
    OR.W    D2, D1              ; Combine bits
    
    ; Plot scaled pixel
    TST.W   D1                  ; Transparent?
    BEQ     NextScaleX
    
    ; Set pixel in destination
    BSR     PlotScaledPixel
    
NextScaleX:
    ADDQ.W  #1, D6
    CMP.W   D2, D6              ; Reached scaled width?
    BLT     ScaleXLoop
    
NextScaleY:
    ADDQ.W  #1, D7
    CMP.W   D3, D7              ; Reached scaled height?
    BLT     ScaleYLoop
    
    MOVEM.L (SP)+, D0-D7/A1-A6
    RTS

; Rotated sprite rendering
DrawRotatedSprite:
    ; A0 = scaled sprite structure (includes angle)
    
    MOVEM.L D0-D7/A1-A4, -(SP)
    
    ; Get rotation angle
    MOVE.W  SCALED_ANGLE(A0), D0
    AND.W   #$FF, D0            ; 0-255 range
    
    ; Get sin/cos values
    LEA     SineTable, A3
    MOVE.B  (A3,D0.W), D6       ; sin(angle)
    ADD.W   #64, D0             ; cos(angle) = sin(angle+90)
    AND.W   #$FF, D0
    MOVE.B  (A3,D0.W), D7       ; cos(angle)
    
    ; Convert to signed 8.8 fixed point
    EXT.W   D6
    SUB.W   #128, D6            ; -128 to +127
    LSL.W   #1, D6              ; Scale to roughly ±1.0
    EXT.W   D7
    SUB.W   #128, D7
    LSL.W   #1, D7
    
    ; Get sprite center
    MOVE.W  SCALED_X(A0), D4    ; Center X
    MOVE.W  SCALED_Y(A0), D5    ; Center Y
    
    ; Render rotated sprite
    MOVE.W  #-8, D2             ; Start at -8,-8 relative to center
RotateYLoop:
    MOVE.W  #-8, D3
    
RotateXLoop:
    ; Rotate point (D3,D2) around center
    ; X' = X*cos - Y*sin
    ; Y' = X*sin + Y*cos
    
    MOVE.W  D3, D0              ; X offset
    MULS    D7, D0              ; X * cos
    MOVE.W  D2, D1              ; Y offset  
    MULS    D6, D1              ; Y * sin
    SUB.L   D1, D0              ; X*cos - Y*sin
    ASR.L   #8, D0              ; Convert from 8.8
    ADD.W   D4, D0              ; Add center X
    
    MOVE.W  D3, D1              ; X offset
    MULS    D6, D1              ; X * sin
    MOVE.W  D2, D0              ; Y offset
    MULS    D7, D0              ; Y * cos
    ADD.L   D0, D1              ; X*sin + Y*cos
    ASR.L   #8, D1              ; Convert from 8.8
    ADD.W   D5, D1              ; Add center Y
    
    ; Plot rotated pixel if on screen
    CMP.W   #0, D0
    BLT     NextRotateX
    CMP.W   #320, D0
    BGE     NextRotateX
    CMP.W   #0, D1
    BLT     NextRotateX
    CMP.W   #200, D1
    BGE     NextRotateX
    
    ; Get source pixel (simplified)
    ; Would need to sample from original sprite
    BSR     PlotRotatedPixel
    
NextRotateX:
    ADDQ.W  #1, D3
    CMP.W   #8, D3
    BLE     RotateXLoop
    
    ADDQ.W  #1, D2
    CMP.W   #8, D2
    BLE     RotateYLoop
    
    MOVEM.L (SP)+, D0-D7/A1-A4
    RTS

; Motion blur effect
CreateMotionBlur:
    ; A0 = sprite object with velocity
    ; Creates multiple sprites at previous positions
    
    MOVEM.L D0-D4/A1, -(SP)
    
    ; Get current position and velocity
    MOVE.W  SPR_X_INT(A0), D0   ; Current X
    MOVE.W  SPR_Y_INT(A0), D1   ; Current Y
    MOVE.W  SPR_VX_FRAC(A0), D2 ; X velocity
    MOVE.W  SPR_VY_FRAC(A0), D3 ; Y velocity
    
    ; Draw 4 blur frames
    MOVEQ   #3, D4
    
BlurLoop:
    ; Calculate previous position
    MOVE.W  D2, D0
    ASR.W   #6, D0              ; Scale velocity
    MULS    D4, D0              ; Multiply by frame offset
    SUB.W   D0, SPR_X_INT(A0)   ; Subtract from current X
    
    MOVE.W  D3, D1
    ASR.W   #6, D1
    MULS    D4, D1
    SUB.W   D1, SPR_Y_INT(A0)
    
    ; Draw sprite with reduced opacity
    ; (Would need to blend with background)
    BSR     DrawBlurredSprite
    
    ; Restore position
    ADD.W   D0, SPR_X_INT(A0)
    ADD.W   D1, SPR_Y_INT(A0)
    
    DBF     D4, BlurLoop
    
    MOVEM.L (SP)+, D0-D4/A1
    RTS

PlotScaledPixel:
    ; Plot pixel at current position with color D1
    ; Implementation depends on bitplane format
    RTS

PlotRotatedPixel:
    ; Plot rotated pixel
    ; Implementation depends on bitplane format
    RTS

DrawBlurredSprite:
    ; Draw sprite with transparency for blur effect
    ; Implementation would blend with background
    RTS

; Sine table for rotation (0-255 = 0-360 degrees)
SineTable:
    DC.B    128,131,134,137,140,143,146,149,152,156,159,162,165,168,171,174
    DC.B    176,179,182,185,188,191,193,196,199,201,204,206,209,211,213,216
    DC.B    218,220,222,224,226,228,230,232,234,235,237,238,240,241,243,244
    DC.B    245,246,247,248,249,249,250,251,251,252,252,252,253,253,253,253
    DC.B    253,253,253,253,252,252,252,251,251,250,249,249,248,247,246,245
    DC.B    244,243,241,240,238,237,235,234,232,230,228,226,224,222,220,218
    DC.B    216,213,211,209,206,204,201,199,196,193,191,188,185,182,179,176
    DC.B    174,171,168,165,162,159,156,152,149,146,143,140,137,134,131,128
    DC.B    125,122,119,116,113,110,107,104,100,97,94,91,88,85,82,79
    DC.B    77,74,71,68,65,62,60,57,54,52,49,47,44,42,40,37
    DC.B    35,33,31,29,27,25,23,21,19,18,16,15,13,12,10,9
    DC.B    8,7,6,5,4,4,3,2,2,1,1,1,0,0,0,0
    DC.B    0,0,0,0,1,1,1,2,2,3,4,4,5,6,7,8
    DC.B    9,10,12,13,15,16,18,19,21,23,25,27,29,31,33,35
    DC.B    37,40,42,44,47,49,52,54,57,60,62,65,68,71,74,77
    DC.B    79,82,85,88,91,94,97,100,104,107,110,113,116,119,122,125"
  language="assembly"
/>

## Background Integration Techniques

Seamlessly combine sprites with scrolling backgrounds:

<CodeRunner 
  system="commodore-amiga"
  title="Sprite-Background Integration"
  code="; Professional sprite-background integration techniques

; Parallax scrolling with sprites
ParallaxSpriteSystem:
    ; Multiple background layers with sprites that follow parallax
    
    MOVEM.L D0-D6/A0-A3, -(SP)
    
    ; Update main scroll position
    MOVE.W  ScrollPosition, D0
    ADDQ.W  #2, D0              ; Scroll speed
    MOVE.W  D0, ScrollPosition
    
    ; Layer 1: Background (slow parallax)
    MOVE.W  D0, D1
    LSR.W   #2, D1              ; 1/4 speed
    BSR     UpdateBackgroundLayer
    
    ; Layer 2: Midground (medium parallax)
    MOVE.W  D0, D2
    LSR.W   #1, D2              ; 1/2 speed
    BSR     UpdateMidgroundLayer
    
    ; Layer 3: Foreground (full speed)
    MOVE.W  D0, D3
    BSR     UpdateForegroundLayer
    
    ; Update sprites with parallax
    LEA     ParallaxSprites, A0
    MOVEQ   #7, D6              ; 8 sprites
    
ParallaxSpriteLoop:
    ; Get sprite's parallax factor
    MOVE.W  SPR_PARALLAX(A0), D4   ; 0=background, 256=foreground
    
    ; Calculate sprite scroll offset
    MOVE.W  D0, D5              ; Base scroll
    MULS    D4, D5              ; Scale by parallax
    ASR.L   #8, D5              ; Convert from 8.8
    
    ; Apply to sprite position
    SUB.W   D5, SPR_X_INT(A0)
    
    ; Update sprite animation
    BSR     UpdateSubPixelSprite
    
    ; Position hardware sprite
    MOVE.W  D6, D4
    BSR     PositionSpriteHW
    
    ; Next sprite
    ADD.L   #SPR_EXT_SIZE, A0
    DBF     D6, ParallaxSpriteLoop
    
    MOVEM.L (SP)+, D0-D6/A0-A3
    RTS

; Sprite shadow system
CreateSpriteShadows:
    ; Automatically generate shadows for all sprites
    
    LEA     SpriteObjects, A0
    MOVEQ   #7, D7              ; 8 sprites
    
ShadowLoop:
    ; Check if sprite is active
    MOVE.W  SPR_X_INT(A0), D0
    CMP.W   #-1, D0
    BEQ     NextShadow
    
    ; Calculate shadow position
    MOVE.W  D0, D1              ; Shadow X = sprite X + offset
    ADD.W   #4, D1
    MOVE.W  SPR_Y_INT(A0), D2   ; Shadow Y = sprite Y + offset
    ADD.W   #4, D2
    
    ; Draw shadow to background bitplane
    BSR     DrawShadowToBackground
    
NextShadow:
    ADD.L   #SPR_EXT_SIZE, A0
    DBF     D7, ShadowLoop
    
    RTS

; Sprite Z-ordering system
SortSpritesByDepth:
    ; Sort sprites by Y position for proper depth
    
    LEA     SpriteDepthList, A0
    LEA     SpriteObjects, A1
    MOVEQ   #7, D7              ; 8 sprites
    
    ; Build depth list
BuildDepthList:
    MOVE.W  SPR_Y_INT(A1), D0   ; Y position = depth
    MOVE.L  A1, D1              ; Sprite pointer
    
    ; Insert in sorted order
    LEA     SpriteDepthList, A2
    MOVEQ   #7, D6
    
FindInsertPoint:
    MOVE.W  (A2), D2            ; Compare Y positions
    CMP.W   D0, D2
    BGT     FoundInsertPoint
    ADDQ.L  #6, A2              ; Next entry (Y + pointer)
    DBF     D6, FindInsertPoint
    
FoundInsertPoint:
    ; Shift remaining entries down
    ; (Implementation would move entries)
    
    ; Insert new entry
    MOVE.W  D0, (A2)            ; Y position
    MOVE.L  D1, 2(A2)           ; Sprite pointer
    
    ; Next sprite
    ADD.L   #SPR_EXT_SIZE, A1
    DBF     D7, BuildDepthList
    
    ; Now render sprites in depth order
    LEA     SpriteDepthList, A0
    MOVEQ   #7, D7
    
RenderByDepth:
    MOVE.L  2(A0), A1           ; Get sprite pointer
    MOVE.W  D7, D0              ; Sprite hardware number
    BSR     PositionSpriteHW
    
    ADDQ.L  #6, A0              ; Next depth entry
    DBF     D7, RenderByDepth
    
    RTS

; Sprite-background collision with pixel accuracy
PixelAccurateCollision:
    ; A0 = sprite object
    ; Returns: D0 = 1 if collision, 0 if none
    
    MOVEM.L D1-D7/A1-A3, -(SP)
    
    ; Get sprite position
    MOVE.W  SPR_X_INT(A0), D4   ; Sprite X
    MOVE.W  SPR_Y_INT(A0), D5   ; Sprite Y
    
    ; Get sprite data
    MOVE.L  SPR_DATA_PTR(A0), A1
    ADDQ.L  #4, A1              ; Skip control words
    
    ; Get background bitplane
    MOVE.L  #BackgroundBitplane, A2
    
    ; Check each sprite pixel against background
    MOVEQ   #15, D6             ; Sprite height (example)
    
CollisionYLoop:
    ; Calculate background line address
    MOVE.W  D5, D0
    ADD.W   D6, D0              ; Current Y line
    MULU    #40, D0             ; Bytes per line
    LEA     (A2,D0.L), A3       ; Background line
    
    ; Get sprite line data
    MOVE.L  (A1)+, D0           ; Sprite bitplane A
    MOVE.L  (A1)+, D1           ; Sprite bitplane B
    
    ; Check each pixel in line
    MOVEQ   #15, D7             ; 16 pixels wide
    
CollisionXLoop:
    ; Check if sprite pixel is set
    BTST    D7, D0              ; Bitplane A
    BEQ     NextCollisionX
    BTST    D7, D1              ; Bitplane B
    BEQ     NextCollisionX      ; Transparent pixel
    
    ; Check background pixel
    MOVE.W  D4, D2              ; Sprite X
    ADD.W   D7, D2              ; Add pixel offset
    MOVE.W  D2, D3
    LSR.W   #3, D3              ; Byte offset
    AND.W   #7, D2              ; Bit offset
    
    BTST    D2, (A3,D3.W)       ; Check background pixel
    BEQ     NextCollisionX      ; No collision
    
    ; Collision detected!
    MOVEQ   #1, D0
    BRA     CollisionFound
    
NextCollisionX:
    DBF     D7, CollisionXLoop
    DBF     D6, CollisionYLoop
    
    ; No collision
    MOVEQ   #0, D0
    
CollisionFound:
    MOVEM.L (SP)+, D1-D7/A1-A3
    RTS

; Sprite trail effect
CreateSpriteTrail:
    ; A0 = sprite object
    ; Creates fading trail behind moving sprite
    
    MOVEM.L D0-D4/A1-A2, -(SP)
    
    ; Shift trail positions
    LEA     TrailPositions, A1
    MOVEQ   #TRAIL_LENGTH-2, D4
    
ShiftTrail:
    MOVE.L  (A1), 4(A1)         ; Shift position back
    SUBQ.L  #4, A1
    DBF     D4, ShiftTrail
    
    ; Add current position to trail
    MOVE.W  SPR_X_INT(A0), (A1)+
    MOVE.W  SPR_Y_INT(A0), (A1)+
    
    ; Draw trail with fading intensity
    LEA     TrailPositions, A1
    MOVEQ   #TRAIL_LENGTH-1, D4
    MOVE.W  #255, D3            ; Start intensity
    
DrawTrail:
    MOVE.W  (A1)+, D0           ; X position
    MOVE.W  (A1)+, D1           ; Y position
    
    ; Draw trail sprite with current intensity
    MOVE.W  D3, D2              ; Intensity
    BSR     DrawTrailSprite
    
    ; Reduce intensity for next trail sprite
    SUB.W   #32, D3             ; Fade amount
    BPL     IntensityOK
    MOVEQ   #0, D3
IntensityOK:
    
    DBF     D4, DrawTrail
    
    MOVEM.L (SP)+, D0-D4/A1-A2
    RTS

; Constants and data
TRAIL_LENGTH        EQU 8
SPR_PARALLAX        EQU SPR_EXT_SIZE    ; Add to sprite structure

ScrollPosition:     DC.W    0
TrailPositions:     DS.W    TRAIL_LENGTH * 2    ; X,Y pairs
SpriteDepthList:    DS.B    8 * 6               ; Y + pointer for each sprite
ParallaxSprites:    DS.B    SPR_EXT_SIZE * 8    ; Extended sprite objects
BackgroundBitplane: DS.B    8000                ; Background collision map"
  language="assembly"
/>

## Practice Exercise: Advanced Animation Demo

Create a complete animation showcase:

<CodeRunner 
  system="commodore-amiga"
  title="Practice: Advanced Animation Showcase"
  code="; Create a comprehensive sprite animation demonstration
; Showcasing all advanced techniques

AnimationShowcase:
    ; Initialize all systems
    BSR     InitSubPixelSystem
    BSR     InitStateMachines
    BSR     InitParallaxSystem
    BSR     InitCollisionSystem
    
    ; Create demo sprites
    BSR     CreateDemoSprites
    
    ; Main demo loop
ShowcaseLoop:
    BSR     WaitVBlank
    
    ; Update all systems
    BSR     UpdateParallaxSpriteSystem
    BSR     UpdateStateMachines
    BSR     UpdatePhysics
    BSR     CheckAdvancedCollisions
    BSR     UpdateTrailEffects
    
    ; Apply visual effects
    BSR     UpdateScalingEffects
    BSR     UpdateRotationEffects
    BSR     CreateMotionBlur
    
    ; Demo sequence control
    MOVE.W  DemoTimer, D0
    ADDQ.W  #1, D0
    MOVE.W  D0, DemoTimer
    
    ; Change demo mode every 300 frames
    LSR.W   #8, D0              ; /256
    AND.W   #3, D0              ; 4 modes
    
    CMP.W   #0, D0
    BEQ     DemoMode1
    CMP.W   #1, D0
    BEQ     DemoMode2
    CMP.W   #2, D0
    BEQ     DemoMode3
    BRA     DemoMode4
    
DemoMode1:
    ; Smooth movement and animation
    BSR     DemoSmoothMovement
    BRA     ContinueDemo
    
DemoMode2:
    ; State machine behaviors
    BSR     DemoStateMachines
    BRA     ContinueDemo
    
DemoMode3:
    ; Scaling and rotation
    BSR     DemoTransformations
    BRA     ContinueDemo
    
DemoMode4:
    ; Combined effects
    BSR     DemoCombinedEffects
    
ContinueDemo:
    ; Check exit
    BTST    #6, $BFE001
    BNE     ShowcaseLoop
    
    RTS

CreateDemoSprites:
    ; Create sprites with different behaviors
    
    ; Sprite 0: Smooth curved movement
    LEA     SpriteObjects, A0
    MOVE.W  #160, SPR_X_INT(A0)
    MOVE.W  #100, SPR_Y_INT(A0)
    MOVE.W  #$0180, SPR_VX_FRAC(A0)    ; 1.5 pixels/frame
    MOVE.W  #$0080, SPR_VY_FRAC(A0)    ; 0.5 pixels/frame
    MOVE.W  #ANIM_WALKING, SPR_STATE(A0)
    
    ; Sprite 1: Bouncing ball with state machine
    ADD.L   #SPR_EXT_SIZE, A0
    MOVE.W  #80, SPR_X_INT(A0)
    MOVE.W  #50, SPR_Y_INT(A0)
    MOVE.W  #$0100, SPR_VX_FRAC(A0)
    MOVE.W  #$0200, SPR_VY_FRAC(A0)
    MOVE.W  #ANIM_JUMPING, SPR_STATE(A0)
    
    ; Sprite 2: Scaling demo
    ADD.L   #SPR_EXT_SIZE, A0
    MOVE.W  #240, SPR_X_INT(A0)
    MOVE.W  #120, SPR_Y_INT(A0)
    MOVE.W  #$0100, SCALED_SCALE_X(A0)  ; Normal scale
    MOVE.W  #$0100, SCALED_SCALE_Y(A0)
    
    ; Sprite 3: Rotation demo
    ADD.L   #SPR_EXT_SIZE, A0
    MOVE.W  #200, SPR_X_INT(A0)
    MOVE.W  #150, SPR_Y_INT(A0)
    CLR.W   SCALED_ANGLE(A0)
    
    ; Continue for remaining sprites...
    
    RTS

DemoSmoothMovement:
    ; Demonstrate sub-pixel movement
    LEA     SpriteObjects, A0
    
    ; Update with sine wave motion
    MOVE.W  DemoTimer, D0
    AND.W   #$FF, D0
    LEA     SineTable, A1
    MOVE.B  (A1,D0.W), D1
    EXT.W   D1
    SUB.W   #128, D1            ; -128 to +127
    ASR.W   #4, D1              ; Scale down
    
    ; Apply to velocity
    MOVE.W  D1, SPR_VY_FRAC(A0)
    
    ; Update position
    BSR     UpdateSubPixelSprite
    
    RTS

DemoStateMachines:
    ; Show different animation states
    LEA     SpriteObjects+SPR_EXT_SIZE, A0
    
    ; Trigger state changes based on position
    MOVE.W  SPR_Y_INT(A0), D0
    CMP.W   #180, D0            ; Near bottom?
    BLT     NotGrounded
    
    ; Grounded - change to walking
    MOVEQ   #ANIM_WALKING, D0
    BSR     ChangeAnimationState
    
    ; Reverse velocity
    NEG.W   SPR_VY_FRAC(A0)
    BRA     StateDemo
    
NotGrounded:
    ; In air - falling state
    MOVEQ   #ANIM_FALLING, D0
    BSR     ChangeAnimationState
    
StateDemo:
    ; Apply gravity
    MOVE.W  #8, D0              ; Gravity acceleration
    MOVE.W  #0, D1
    BSR     ApplyAcceleration
    
    BSR     UpdateSubPixelSprite
    BSR     UpdateStateMachine
    
    RTS

DemoTransformations:
    ; Show scaling and rotation
    LEA     SpriteObjects+SPR_EXT_SIZE*2, A0
    
    ; Animate scale
    MOVE.W  DemoTimer, D0
    LSR.W   #2, D0              ; Slow down
    AND.W   #$3F, D0            ; 0-63
    LEA     SineTable, A1
    MOVE.B  (A1,D0.W), D1
    EXT.W   D1
    LSR.W   #1, D1              ; 0-127
    ADD.W   #128, D1            ; 128-255 (0.5x to 1.0x scale)
    MOVE.W  D1, SCALED_SCALE_X(A0)
    MOVE.W  D1, SCALED_SCALE_Y(A0)
    
    ; Rotation demo
    ADD.L   #SPR_EXT_SIZE, A0
    MOVE.W  DemoTimer, D0
    LSR.W   #1, D0              ; Rotation speed
    MOVE.W  D0, SCALED_ANGLE(A0)
    
    ; Render transformed sprites
    BSR     DrawScaledSprite
    BSR     DrawRotatedSprite
    
    RTS

DemoCombinedEffects:
    ; All effects together
    BSR     DemoSmoothMovement
    BSR     DemoStateMachines
    BSR     DemoTransformations
    
    ; Add trails and blur
    LEA     SpriteObjects, A0
    MOVEQ   #3, D7
    
EffectLoop:
    BSR     CreateSpriteTrail
    BSR     CreateMotionBlur
    ADD.L   #SPR_EXT_SIZE, A0
    DBF     D7, EffectLoop
    
    RTS

; Demo data
DemoTimer:          DC.W    0

; Initialize all the systems used in demo
InitSubPixelSystem:
    ; Initialize sub-pixel sprite system
    RTS

InitStateMachines:
    ; Initialize animation state machines
    RTS

InitParallaxSystem:
    ; Initialize parallax scrolling
    RTS

InitCollisionSystem:
    ; Initialize collision detection
    RTS

; Run the showcase!
BSR     AnimationShowcase"
  language="assembly"
/>

## What You've Learned

In this lesson, you've mastered advanced sprite animation and movement:

- **Sub-pixel positioning** for ultra-smooth movement at any speed
- **Complex animation state machines** for sophisticated character behaviors
- **Interpolated movement** and keyframe animation systems
- **Sprite transformation effects** including scaling and rotation
- **Background integration** with parallax scrolling and depth sorting
- **Advanced collision detection** with pixel-perfect accuracy
- **Visual effects** including motion blur and sprite trails
- **Professional animation pipelines** for games and demos

## Looking Ahead

Next, you'll learn about the Blitter - the Amiga's powerful graphics accelerator. You'll discover how to use the Blitter for high-speed graphics operations, create complex visual effects, and achieve performance impossible with CPU-only graphics programming!

## Fun Fact

The animation techniques you've learned were used to create some of the most impressive games and demos of the 1980s and 90s. The sub-pixel movement system was crucial for smooth scrolling games like "Defender of the Crown" and "Shadow of the Beast." The state machine approach became the foundation for modern game AI and animation systems. Many of these Amiga techniques directly influenced the development of modern graphics APIs and game engines - the concepts of hardware sprites, automatic collision detection, and synchronized animation updates are now standard features in modern GPUs and game development frameworks!