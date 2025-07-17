; ================================================================
; NEON NEXUS - LESSON 12: Enhanced Enemy Behaviors  
; Add smart enemy patterns, formations, and attack modes
; ================================================================

*= $0801

; BASIC stub: 10 SYS 2080
!word next_line
!word 10
!byte $9e
!text "2080"
!byte 0
next_line:
!word 0

; ================================================================
; MAIN PROGRAM
; ================================================================
*= $0820
main:
        jsr init_game
        jmp game_loop

init_game:
        ; Set colors
        lda #$02        ; Red border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Display UI labels after clearing screen
        jsr display_ui
        
        ; Initialize player
        lda #5
        sta player_x
        lda #15         ; Row 15
        sta player_y
        
        ; Initialize enemies
        lda #0
        sta enemy1_active
        sta enemy2_active
        sta enemy3_active
        sta spawn_timer
        sta enemies_spawned
        sta formation_type
        
        ; Initialize game state
        lda #0
        sta score
        sta frame_counter
        sta collision_flag
        lda #1
        sta level
        lda #3
        sta lives
        
        ; Set first formation
        lda #60
        sta spawn_timer
        
        rts

game_loop:
        ; Update spawn system
        jsr update_spawning
        
        ; Update positions first
        lda collision_flag
        bne skip_movement
        jsr update_player
        jsr update_enemies
skip_movement:
        
        ; Check collisions AFTER movement
        jsr check_collisions
        
        ; Clear screen areas
        jsr clear_rows
        
        ; Draw all objects
        jsr draw_player
        jsr draw_enemies
        
        ; Update score (every 256 frames)
        inc frame_counter
        bne skip_score
        inc score
        
        ; Check for level up (every 16 points)
        lda score
        and #$0f
        bne skip_level
        lda score
        beq skip_level
        inc level
        
skip_level:
skip_score:
        ; Display stats
        jsr display_score
        jsr display_level
        jsr display_lives
        jsr display_formation
        
        ; Delay
        jsr delay
        
        jmp game_loop

update_spawning:
        ; Decrement spawn timer
        lda spawn_timer
        beq check_spawn
        dec spawn_timer
        rts
        
check_spawn:
        ; Check current formation type
        lda formation_type
        cmp #0
        bne check_form1
        jmp spawn_wave
check_form1:
        cmp #1
        bne check_form2
        jmp spawn_vertical
check_form2:
        cmp #2
        bne do_spawn_single
        jmp spawn_diagonal
do_spawn_single:
        jmp spawn_single

spawn_wave:
        ; Spawn horizontal wave of 3 enemies
        lda enemy1_active
        ora enemy2_active
        ora enemy3_active
        beq spawn_wave_ok
        jmp no_spawn    ; All must be inactive
spawn_wave_ok:
        
        ; Spawn all three at once
        lda #39
        sta enemy1_x
        sta enemy2_x
        sta enemy3_x
        
        lda #10
        sta enemy1_y
        lda #15
        sta enemy2_y
        lda #20
        sta enemy3_y
        
        lda #1
        sta enemy1_active
        sta enemy2_active
        sta enemy3_active
        
        ; All use wave behavior
        lda #1          ; Wave pattern
        sta enemy1_behavior
        sta enemy2_behavior
        sta enemy3_behavior
        
        lda #3
        sta enemies_spawned
        
        jmp spawn_complete

spawn_vertical:
        ; Spawn vertical column with delay
        lda enemy1_active
        beq spawn_vert_ok
        jmp check_enemy2_spawn
spawn_vert_ok:
        
        ; Spawn first enemy
        lda #39
        sta enemy1_x
        lda #12
        sta enemy1_y
        lda #1
        sta enemy1_active
        lda #2          ; Tracking behavior
        sta enemy1_behavior
        inc enemies_spawned
        
        ; Short delay for next
        lda #15
        sta spawn_timer
        rts
        
check_enemy2_spawn:
        lda enemy2_active
        beq spawn_vert2_ok
        jmp no_spawn
spawn_vert2_ok:
        
        ; Spawn second enemy
        lda #39
        sta enemy2_x
        lda #15
        sta enemy2_y
        lda #1
        sta enemy2_active
        lda #2          ; Tracking behavior
        sta enemy2_behavior
        inc enemies_spawned
        
        jmp spawn_complete

spawn_diagonal:
        ; Spawn diagonal formation
        lda enemy1_active
        beq spawn_diag_ok
        jmp no_spawn
spawn_diag_ok:
        
        lda #39
        sta enemy1_x
        lda #10
        sta enemy1_y
        lda #1
        sta enemy1_active
        lda #3          ; Homing behavior
        sta enemy1_behavior
        inc enemies_spawned
        
        jmp spawn_complete

spawn_single:
        ; Single enemy with smart behavior
        lda enemy1_active
        beq spawn_single_ok
        jmp no_spawn
spawn_single_ok:
        
        lda #39
        sta enemy1_x
        lda #15
        sta enemy1_y
        lda #1
        sta enemy1_active
        lda #0          ; Standard behavior
        sta enemy1_behavior
        inc enemies_spawned

spawn_complete:
        ; Set next spawn timer
        lda level
        cmp #5
        bcs fast_spawn
        cmp #3
        bcs medium_spawn
        
        lda #120        ; Slow spawn
        jmp set_timer
medium_spawn:
        lda #60
        jmp set_timer
fast_spawn:
        lda #30
set_timer:
        sta spawn_timer
        
        ; Change formation type
        inc formation_type
        lda formation_type
        cmp #4
        bcc no_spawn
        lda #0
        sta formation_type
        
no_spawn:
        rts

update_player:
        ; Move player right, wrap at edge
        inc player_x
        lda player_x
        cmp #40
        bcc player_ok
        lda #0
        sta player_x
player_ok:
        rts

update_enemies:
        ; Update enemy 1
        lda enemy1_active
        bne update_enemy1
        jmp skip_enemy1
update_enemy1:
        
        lda enemy1_behavior
        cmp #0
        bne check_beh1
        jmp enemy1_standard
check_beh1:
        cmp #1
        bne check_beh2
        jmp enemy1_wave
check_beh2:
        cmp #2
        bne check_beh3
        jmp enemy1_tracking
check_beh3:
        cmp #3
        bne enemy1_standard
        jmp enemy1_homing
        
enemy1_standard:
        ; Basic left movement
        dec enemy1_x
        jmp check_enemy1_bounds
        
enemy1_wave:
        ; Sine wave movement
        dec enemy1_x
        lda frame_counter
        and #$08
        beq enemy1_wave_down
        dec enemy1_y
        lda enemy1_y
        cmp #8
        bcs check_enemy1_bounds
        lda #8
        sta enemy1_y
        jmp check_enemy1_bounds
enemy1_wave_down:
        inc enemy1_y
        lda enemy1_y
        cmp #22
        bcc check_enemy1_bounds
        lda #22
        sta enemy1_y
        jmp check_enemy1_bounds
        
enemy1_tracking:
        ; Move toward player Y
        dec enemy1_x
        lda player_y
        cmp enemy1_y
        beq check_enemy1_bounds
        bcc enemy1_move_up
        inc enemy1_y
        jmp check_enemy1_bounds
enemy1_move_up:
        dec enemy1_y
        jmp check_enemy1_bounds
        
enemy1_homing:
        ; Home in on player position
        dec enemy1_x
        ; Move faster every other frame
        lda frame_counter
        and #$01
        beq skip_extra_move
        dec enemy1_x
skip_extra_move:
        ; Track Y position
        lda player_y
        cmp enemy1_y
        beq check_enemy1_bounds
        bcc enemy1_home_up
        lda frame_counter
        and #$03
        bne check_enemy1_bounds
        inc enemy1_y
        jmp check_enemy1_bounds
enemy1_home_up:
        lda frame_counter
        and #$03
        bne check_enemy1_bounds
        dec enemy1_y

check_enemy1_bounds:
        lda enemy1_x
        cmp #255
        bne skip_enemy1
        lda #0
        sta enemy1_active
        dec enemies_spawned
skip_enemy1:

        ; Update enemy 2
        lda enemy2_active
        beq skip_enemy2
        
        lda enemy2_behavior
        cmp #1
        beq enemy2_wave
        cmp #2
        beq enemy2_tracking
        
        ; Default movement
        dec enemy2_x
        jmp check_enemy2_bounds
        
enemy2_wave:
        ; Opposite sine wave
        dec enemy2_x
        lda frame_counter
        and #$08
        bne enemy2_wave_down
        dec enemy2_y
        lda enemy2_y
        cmp #8
        bcs check_enemy2_bounds
        lda #8
        sta enemy2_y
        jmp check_enemy2_bounds
enemy2_wave_down:
        inc enemy2_y
        lda enemy2_y
        cmp #22
        bcc check_enemy2_bounds
        lda #22
        sta enemy2_y
        jmp check_enemy2_bounds
        
enemy2_tracking:
        ; Delayed tracking
        dec enemy2_x
        lda frame_counter
        and #$07
        bne check_enemy2_bounds
        lda player_y
        cmp enemy2_y
        beq check_enemy2_bounds
        bcc enemy2_move_up
        inc enemy2_y
        jmp check_enemy2_bounds
enemy2_move_up:
        dec enemy2_y

check_enemy2_bounds:
        lda enemy2_x
        cmp #255
        bne skip_enemy2
        lda #0
        sta enemy2_active
        dec enemies_spawned
skip_enemy2:

        ; Update enemy 3
        lda enemy3_active
        beq skip_enemy3
        
        lda enemy3_behavior
        cmp #1
        beq enemy3_wave
        
        ; Default fast movement
        dec enemy3_x
        dec enemy3_x
        jmp check_enemy3_bounds
        
enemy3_wave:
        ; Wide sine wave
        dec enemy3_x
        lda frame_counter
        and #$10
        beq enemy3_wave_down
        dec enemy3_y
        lda enemy3_y
        cmp #8
        bcs check_enemy3_bounds
        lda #8
        sta enemy3_y
        jmp check_enemy3_bounds
enemy3_wave_down:
        inc enemy3_y
        lda enemy3_y
        cmp #22
        bcc check_enemy3_bounds
        lda #22
        sta enemy3_y

check_enemy3_bounds:
        lda enemy3_x
        cmp #254
        bcs reset_enemy3
        jmp skip_enemy3
reset_enemy3:
        lda #0
        sta enemy3_active
        dec enemies_spawned
skip_enemy3:
        rts

check_collisions:
        ; Decrement collision timer if active
        lda collision_flag
        beq check_new_collision
        dec collision_flag
        bne collision_active
        
        ; Collision timer expired - restore normal border
        lda #$02        ; Red border
        sta $d020
        jmp no_collision
        
collision_active:
        jmp no_collision
        
check_new_collision:
        ; Check each active enemy
        jsr check_enemy1_collision
        lda collision_flag
        bne no_collision
        
        jsr check_enemy2_collision
        lda collision_flag
        bne no_collision
        
        jsr check_enemy3_collision
        
no_collision:
        rts

check_enemy1_collision:
        lda enemy1_active
        beq no_enemy1_collision
        lda player_y
        cmp enemy1_y
        bne no_enemy1_collision
        lda player_x
        cmp enemy1_x
        bne no_enemy1_collision
        jsr handle_collision
no_enemy1_collision:
        rts

check_enemy2_collision:
        lda enemy2_active
        beq no_enemy2_collision
        lda player_y
        cmp enemy2_y
        bne no_enemy2_collision
        lda player_x
        cmp enemy2_x
        bne no_enemy2_collision
        jsr handle_collision
no_enemy2_collision:
        rts

check_enemy3_collision:
        lda enemy3_active
        beq no_enemy3_collision
        lda player_y
        cmp enemy3_y
        bne no_enemy3_collision
        lda player_x
        cmp enemy3_x
        bne no_enemy3_collision
        jsr handle_collision
no_enemy3_collision:
        rts

handle_collision:
        lda #30         ; Stop movement for 30 frames
        sta collision_flag
        
        dec lives
        beq game_over
        
        ; Change border color to show collision
        lda #$01        ; White border during collision
        sta $d020
        rts

game_over:
        ; Game over - flash border and reset
        ldx #5
flash_loop:
        lda #$07        ; Yellow
        sta $d020
        jsr delay
        lda #$02        ; Red
        sta $d020
        jsr delay
        dex
        bne flash_loop
        
        ; Reset game
        jmp init_game

clear_rows:
        ; Clear specific enemy rows
        ldx #0
clear_loop:
        lda #32         ; Space
        sta $0400+320,x ; Row 8
        sta $0400+400,x ; Row 10
        sta $0400+480,x ; Row 12
        sta $0400+560,x ; Row 14
        sta $0400+600,x ; Row 15
        sta $0400+640,x ; Row 16
        sta $0400+720,x ; Row 18
        sta $0400+800,x ; Row 20
        sta $0400+880,x ; Row 22
        inx
        cpx #40
        bne clear_loop
        rts

draw_player:
        ; Draw player at current position
        ldx player_x
        lda #$2a        ; Star character
        sta $0400+600,x ; Row 15
        lda #$01        ; White color
        sta $d800+600,x
        rts

draw_enemies:
        ; Draw enemy 1
        lda enemy1_active
        beq skip_draw1
        
        ; Calculate position based on Y
        lda enemy1_y
        cmp #15
        beq draw1_row15
        cmp #10
        beq draw1_row10
        cmp #20
        beq draw1_row20
        cmp #12
        beq draw1_row12
        ; Default to row 15
        jmp draw1_row15
        
draw1_row10:
        ldx enemy1_x
        lda #$a0
        sta $0400+400,x
        lda #$02
        sta $d800+400,x
        jmp skip_draw1
        
draw1_row12:
        ldx enemy1_x
        lda #$a0
        sta $0400+480,x
        lda #$02
        sta $d800+480,x
        jmp skip_draw1
        
draw1_row15:
        ldx enemy1_x
        lda #$a0
        sta $0400+600,x
        lda #$02
        sta $d800+600,x
        jmp skip_draw1
        
draw1_row20:
        ldx enemy1_x
        lda #$a0
        sta $0400+800,x
        lda #$02
        sta $d800+800,x
        
skip_draw1:
        ; Draw enemy 2
        lda enemy2_active
        beq skip_draw2
        
        lda enemy2_y
        cmp #15
        beq draw2_row15
        cmp #12
        beq draw2_row12
        ; Default
        jmp draw2_row15
        
draw2_row12:
        ldx enemy2_x
        lda #$a0
        sta $0400+480,x
        lda #$05        ; Green
        sta $d800+480,x
        jmp skip_draw2
        
draw2_row15:
        ldx enemy2_x
        lda #$a0
        sta $0400+600,x
        lda #$05
        sta $d800+600,x
        
skip_draw2:
        ; Draw enemy 3
        lda enemy3_active
        beq skip_draw3
        
        lda enemy3_y
        cmp #20
        beq draw3_row20
        cmp #10
        beq draw3_row10
        ; Default
        jmp draw3_row20
        
draw3_row10:
        ldx enemy3_x
        lda #$a0
        sta $0400+400,x
        lda #$03        ; Cyan
        sta $d800+400,x
        jmp skip_draw3
        
draw3_row20:
        ldx enemy3_x
        lda #$a0
        sta $0400+800,x
        lda #$03
        sta $d800+800,x
        
skip_draw3:
        rts

delay:
        ldy #80
delay_outer:
        ldx #200
delay_inner:
        dex
        bne delay_inner
        dey
        bne delay_outer
        rts

; ================================================================
; DISPLAY SUBROUTINES
; ================================================================
display_ui:
        ; Display labels
        ldx #0
score_label_loop:
        lda score_text,x
        beq score_done
        sta $0400,x
        inx
        jmp score_label_loop
score_done:
        
        ldx #0
level_label_loop:
        lda level_text,x
        beq level_done
        sta $0400+10,x
        inx
        jmp level_label_loop
level_done:
        
        ldx #0
lives_label_loop:
        lda lives_text,x
        beq lives_done
        sta $0400+20,x
        inx
        jmp lives_label_loop
lives_done:
        
        ldx #0
formation_label_loop:
        lda formation_text,x
        beq formation_done
        sta $0400+30,x
        inx
        jmp formation_label_loop
formation_done:
        rts

display_score:
        lda score
        and #$0f
        clc
        adc #$30
        sta $0400+6
        rts

display_level:
        lda level
        and #$0f
        clc
        adc #$30
        sta $0400+16
        rts

display_lives:
        lda lives
        and #$0f
        clc
        adc #$30
        sta $0400+26
        rts

display_formation:
        lda formation_type
        and #$0f
        clc
        adc #$30
        sta $0400+36
        rts

; ================================================================
; DATA
; ================================================================
score_text:
        !byte $13,$03,$0f,$12,$05,$3a,$00  ; "SCORE:" in screen codes

level_text:
        !byte $0c,$05,$16,$05,$0c,$3a,$00  ; "LEVEL:" in screen codes

lives_text:
        !byte $0c,$09,$16,$05,$13,$3a,$00  ; "LIVES:" in screen codes

formation_text:
        !byte $06,$0f,$12,$0d,$3a,$00      ; "FORM:" in screen codes

; ================================================================
; VARIABLES
; ================================================================
player_x:          !byte 0
player_y:          !byte 0
enemy1_x:          !byte 0
enemy1_y:          !byte 0
enemy1_active:     !byte 0
enemy1_behavior:   !byte 0
enemy2_x:          !byte 0
enemy2_y:          !byte 0
enemy2_active:     !byte 0
enemy2_behavior:   !byte 0
enemy3_x:          !byte 0
enemy3_y:          !byte 0
enemy3_active:     !byte 0
enemy3_behavior:   !byte 0
score:             !byte 0
level:             !byte 1
frame_counter:     !byte 0
lives:             !byte 3
collision_flag:    !byte 0
spawn_timer:       !byte 0
enemies_spawned:   !byte 0
formation_type:    !byte 0