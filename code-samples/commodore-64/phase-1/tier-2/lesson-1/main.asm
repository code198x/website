; Decision Making with Branches
; Commodore 64 - Phase 1, Tier 2, Lesson 1
;
; Learning objectives:
; - Implement conditional branching with 6502 assembly
; - Understand processor status flags
; - Create responsive AI behavior
;
; This program demonstrates decision making through:
; 1. Joystick input reading with conditional responses
; 2. Multi-state guard AI that hunts the player
; 3. Distance-based alert system
;
; Assemble with ACME:
;   acme main.asm
; Run in VICE:
;   x64sc decision_demo.prg

; BASIC loader
        * = $0801
        !byte $0c,$08,$00,$00,$9e,$32,$30,$36,$34,$00,$00,$00

        * = $0810

; ==========================================
; Constants
; ==========================================
SCREEN_RAM = $0400
COLOR_RAM  = $D800
BORDER     = $D020
JOYSTICK   = $DC00
TIMER_A_LO = $DC04

; Character codes
PLAYER_CHAR = $51   ; Q (looks like person)
GUARD_CHAR  = $57   ; W (enemy)
EMPTY_CHAR  = $20   ; Space

; Colors
BLACK      = $00
WHITE      = $01
RED        = $02
BLUE       = $06
YELLOW     = $07
GREEN      = $05

; Game boundaries
MIN_X      = 1
MAX_X      = 38
MIN_Y      = 1
MAX_Y      = 23

; ==========================================
; Variables
; ==========================================
player_x:    !byte 10
player_y:    !byte 12
player_old_x: !byte 10
player_old_y: !byte 12

guard_x:     !byte 30
guard_y:     !byte 12
guard_old_x: !byte 30
guard_old_y: !byte 12
guard_dir:   !byte 1    ; 1=right, -1=left (for patrol)

alert_level: !byte 0    ; 0=patrol, 1=suspicious, 2=chase
alert_timer: !byte 0    ; Countdown for alert states

; ==========================================
; Main Program
; ==========================================
start:
        JSR init_screen
        JSR init_game

main_loop:
        ; Game loop with proper timing
        JSR wait_frame
        JSR clear_old_positions
        JSR read_joystick
        JSR update_guard_ai
        JSR check_collision
        JSR draw_characters
        JSR update_border_color
        JMP main_loop

; ==========================================
; Initialization
; ==========================================
init_screen:
        ; Clear screen with spaces
        LDX #$00
        LDA #EMPTY_CHAR
.clear_loop:
        STA SCREEN_RAM,X
        STA SCREEN_RAM+256,X
        STA SCREEN_RAM+512,X
        STA SCREEN_RAM+768,X
        INX
        BNE .clear_loop

        ; Set screen color to black
        LDX #$00
        LDA #BLACK
.color_loop:
        STA COLOR_RAM,X
        STA COLOR_RAM+256,X
        STA COLOR_RAM+512,X
        STA COLOR_RAM+768,X
        INX
        BNE .color_loop

        ; Draw border
        LDA #BLUE
        STA BORDER
        RTS

init_game:
        ; Reset positions
        LDA #10
        STA player_x
        STA player_old_x
        LDA #12
        STA player_y
        STA player_old_y

        LDA #30
        STA guard_x
        STA guard_old_x
        LDA #12
        STA guard_y
        STA guard_old_y

        LDA #0
        STA alert_level
        STA alert_timer

        LDA #1
        STA guard_dir
        RTS

; ==========================================
; Input Handling with Branching
; ==========================================
read_joystick:
        LDA JOYSTICK        ; Read joystick port 2

        ; Save old position for clearing
        LDA player_x
        STA player_old_x
        LDA player_y
        STA player_old_y

        ; Test each direction bit
        ; Bit pattern: 0=pressed, 1=not pressed

        LDA JOYSTICK
        LSR                 ; Bit 0 (UP) -> Carry
        BCS .test_down      ; Branch if Carry Set (not pressed)

        ; UP is pressed
        LDA player_y
        CMP #MIN_Y          ; At top boundary?
        BEQ .test_down      ; Yes, can't move up
        DEC player_y

.test_down:
        LSR                 ; Bit 1 (DOWN) -> Carry
        BCS .test_left

        ; DOWN is pressed
        LDA player_y
        CMP #MAX_Y          ; At bottom boundary?
        BEQ .test_left
        INC player_y

.test_left:
        LSR                 ; Bit 2 (LEFT) -> Carry
        BCS .test_right

        ; LEFT is pressed
        LDA player_x
        CMP #MIN_X          ; At left boundary?
        BEQ .test_right
        DEC player_x

.test_right:
        LSR                 ; Bit 3 (RIGHT) -> Carry
        BCS .test_fire

        ; RIGHT is pressed
        LDA player_x
        CMP #MAX_X          ; At right boundary?
        BEQ .test_fire
        INC player_x

.test_fire:
        LSR                 ; Bit 4 (FIRE) -> Carry
        BCS .done

        ; FIRE is pressed - maximum alert!
        LDA #2
        STA alert_level
        LDA #255            ; Max alert time
        STA alert_timer

.done:
        RTS

; ==========================================
; Guard AI with Multiple Decision Points
; ==========================================
update_guard_ai:
        ; Save old position
        LDA guard_x
        STA guard_old_x
        LDA guard_y
        STA guard_old_y

        ; First, check distance to player for alert
        JSR calculate_distance

        ; Distance in A, decide alert level
        CMP #5              ; Within 5 spaces?
        BCS .far_away       ; Branch if Carry Set (>= 5)

        ; Close to player - become suspicious
        LDA alert_level
        BNE .check_behavior ; Already alert?
        LDA #1
        STA alert_level
        LDA #100            ; Suspicious for 100 frames
        STA alert_timer
        JMP .check_behavior

.far_away:
        ; Decrease alert over time
        LDA alert_timer
        BEQ .check_behavior ; Already 0?
        DEC alert_timer
        BNE .check_behavior ; Still time left?

        ; Timer expired, reduce alert
        LDA alert_level
        BEQ .check_behavior ; Already calm?
        DEC alert_level

.check_behavior:
        ; Branch based on alert level
        LDA alert_level
        BEQ patrol_behavior     ; 0 = Patrol
        CMP #1
        BEQ suspicious_behavior ; 1 = Suspicious
        ; Fall through to chase  ; 2 = Chase

; Chase Mode - Direct pursuit
chase_behavior:
        ; Move horizontally toward player
        LDA player_x
        CMP guard_x
        BEQ .chase_vertical     ; Same X position
        BCC .chase_left         ; Player is to the left

        ; Move right
        LDA guard_x
        CMP #MAX_X
        BEQ .chase_vertical
        INC guard_x
        JMP .chase_vertical

.chase_left:
        LDA guard_x
        CMP #MIN_X
        BEQ .chase_vertical
        DEC guard_x

.chase_vertical:
        ; Move vertically toward player
        LDA player_y
        CMP guard_y
        BEQ .chase_done         ; Same position
        BCC .chase_up           ; Player is above

        ; Move down
        LDA guard_y
        CMP #MAX_Y
        BEQ .chase_done
        INC guard_y
        RTS

.chase_up:
        LDA guard_y
        CMP #MIN_Y
        BEQ .chase_done
        DEC guard_y

.chase_done:
        RTS

; Suspicious Mode - Look around
suspicious_behavior:
        ; Use timer for semi-random movement
        LDA TIMER_A_LO
        AND #$07            ; 0-7
        CMP #4
        BCS .sus_done       ; >= 4, don't move

        ; Move based on value 0-3
        CMP #0
        BEQ .sus_up
        CMP #1
        BEQ .sus_down
        CMP #2
        BEQ .sus_left

        ; Move right
        LDA guard_x
        CMP #MAX_X
        BEQ .sus_done
        INC guard_x
        RTS

.sus_up:
        LDA guard_y
        CMP #MIN_Y
        BEQ .sus_done
        DEC guard_y
        RTS

.sus_down:
        LDA guard_y
        CMP #MAX_Y
        BEQ .sus_done
        INC guard_y
        RTS

.sus_left:
        LDA guard_x
        CMP #MIN_X
        BEQ .sus_done
        DEC guard_x

.sus_done:
        RTS

; Patrol Mode - Back and forth
patrol_behavior:
        ; Move in current direction
        LDA guard_dir
        BMI .patrol_left    ; Branch if Minus (negative)

        ; Moving right
        LDA guard_x
        CMP #35             ; Right patrol limit
        BNE .patrol_move_right

        ; Hit right boundary, turn around
        LDA #$FF            ; -1
        STA guard_dir
        RTS

.patrol_move_right:
        INC guard_x
        RTS

.patrol_left:
        LDA guard_x
        CMP #5              ; Left patrol limit
        BNE .patrol_move_left

        ; Hit left boundary, turn around
        LDA #1
        STA guard_dir
        RTS

.patrol_move_left:
        DEC guard_x
        RTS

; ==========================================
; Helper Routines
; ==========================================
calculate_distance:
        ; Calculate Manhattan distance
        ; Result in A

        ; |player_x - guard_x|
        LDA player_x
        SEC
        SBC guard_x
        BPL .x_positive     ; Branch if Plus (positive)

        ; Make positive
        EOR #$FF
        CLC
        ADC #1

.x_positive:
        STA .temp_dist

        ; |player_y - guard_y|
        LDA player_y
        SEC
        SBC guard_y
        BPL .y_positive

        ; Make positive
        EOR #$FF
        CLC
        ADC #1

.y_positive:
        CLC
        ADC .temp_dist
        RTS

.temp_dist: !byte 0

check_collision:
        ; Check if guard caught player
        LDA player_x
        CMP guard_x
        BNE .no_collision

        LDA player_y
        CMP guard_y
        BNE .no_collision

        ; Caught! Reset game
        LDA #RED
        STA BORDER

        ; Flash effect
        LDX #50
.flash_loop:
        DEX
        BNE .flash_loop

        ; Reset positions
        JSR init_game

.no_collision:
        RTS

; ==========================================
; Display Routines
; ==========================================
clear_old_positions:
        ; Clear player's old position
        LDA player_old_y
        JSR calc_screen_pos
        LDY player_old_x
        LDA #EMPTY_CHAR
        STA ($FB),Y

        ; Clear guard's old position
        LDA guard_old_y
        JSR calc_screen_pos
        LDY guard_old_x
        LDA #EMPTY_CHAR
        STA ($FB),Y
        RTS

draw_characters:
        ; Draw player
        LDA player_y
        JSR calc_screen_pos
        LDY player_x
        LDA #PLAYER_CHAR
        STA ($FB),Y

        ; Color player white
        JSR calc_color_pos
        LDA #WHITE
        STA ($FB),Y

        ; Draw guard
        LDA guard_y
        JSR calc_screen_pos
        LDY guard_x
        LDA #GUARD_CHAR
        STA ($FB),Y

        ; Color guard based on alert level
        JSR calc_color_pos

        ; Branch based on alert level for color
        LDA alert_level
        BEQ .guard_green    ; 0 = patrol = green
        CMP #1
        BEQ .guard_yellow   ; 1 = suspicious = yellow

        ; 2 = chase = red
        LDA #RED
        JMP .set_guard_color

.guard_green:
        LDA #GREEN
        JMP .set_guard_color

.guard_yellow:
        LDA #YELLOW

.set_guard_color:
        STA ($FB),Y
        RTS

update_border_color:
        ; Border shows alert level
        LDA alert_level
        BEQ .border_blue
        CMP #1
        BEQ .border_yellow

        ; Alert level 2 = red border
        LDA #RED
        JMP .set_border

.border_blue:
        LDA #BLUE
        JMP .set_border

.border_yellow:
        LDA #YELLOW

.set_border:
        STA BORDER
        RTS

; ==========================================
; Utility Functions
; ==========================================
calc_screen_pos:
        ; Calculate screen position for row in A
        ; Returns address in $FB/$FC
        TAX
        LDA screen_line_lo,X
        STA $FB
        LDA screen_line_hi,X
        STA $FC
        RTS

calc_color_pos:
        ; Calculate color RAM position for current row
        ; Uses X from calc_screen_pos
        LDA color_line_lo,X
        STA $FB
        LDA color_line_hi,X
        STA $FC
        RTS

wait_frame:
        ; Wait for raster to reach bottom
.wait:
        LDA $D012
        CMP #250
        BCC .wait
        RTS

; ==========================================
; Data Tables
; ==========================================
; Screen line lookup tables
screen_line_lo:
        !for i, 0, 24 {
            !byte <(SCREEN_RAM + i*40)
        }

screen_line_hi:
        !for i, 0, 24 {
            !byte >(SCREEN_RAM + i*40)
        }

color_line_lo:
        !for i, 0, 24 {
            !byte <(COLOR_RAM + i*40)
        }

color_line_hi:
        !for i, 0, 24 {
            !byte >(COLOR_RAM + i*40)
        }

; ==========================================
; End of Program
; ==========================================