; ================================================================
; NEON NEXUS - LESSON 11: Enemy Spawning System
; Dynamic enemy creation and management with spawn timing
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
        
        ; Initialize all enemies as inactive
        lda #0
        sta enemy1_active
        sta enemy2_active
        sta enemy3_active
        sta enemy4_active
        sta enemy5_active
        
        ; Initialize spawn system
        lda #60         ; Spawn first enemy after 60 frames
        sta spawn_timer
        lda #0
        sta enemies_spawned
        
        ; Initialize game state
        lda #0
        sta score
        sta frame_counter
        sta collision_flag
        lda #1
        sta level
        lda #3
        sta lives
        
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
        ; Display score and level
        jsr display_score
        jsr display_level
        jsr display_lives
        jsr display_enemies
        
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
        ; Check if we can spawn another enemy
        lda enemies_spawned
        cmp #5          ; Maximum 5 enemies
        bcs no_spawn
        
        ; Find first inactive enemy slot
        lda enemy1_active
        beq spawn_enemy1
        lda enemy2_active
        beq spawn_enemy2
        lda enemy3_active
        beq spawn_enemy3
        lda enemy4_active
        beq spawn_enemy4
        lda enemy5_active
        beq spawn_enemy5
        
no_spawn:
        rts

spawn_enemy1:
        lda #39         ; Start at right edge
        sta enemy1_x
        lda #15         ; Row 15
        sta enemy1_y
        lda #1
        sta enemy1_active
        jmp spawn_complete

spawn_enemy2:
        lda #39         ; Start at right edge
        sta enemy2_x
        lda #12         ; Row 12
        sta enemy2_y
        lda #1
        sta enemy2_active
        jmp spawn_complete

spawn_enemy3:
        lda #39         ; Start at right edge
        sta enemy3_x
        lda #18         ; Row 18
        sta enemy3_y
        lda #1
        sta enemy3_active
        jmp spawn_complete

spawn_enemy4:
        lda #39         ; Start at right edge
        sta enemy4_x
        lda #10         ; Row 10
        sta enemy4_y
        lda #1
        sta enemy4_active
        jmp spawn_complete

spawn_enemy5:
        lda #39         ; Start at right edge
        sta enemy5_x
        lda #20         ; Row 20
        sta enemy5_y
        lda #1
        sta enemy5_active

spawn_complete:
        ; Increment spawn counter
        inc enemies_spawned
        
        ; Set next spawn time (gets faster as level increases)
        lda level
        cmp #1
        beq level1_spawn
        cmp #2
        beq level2_spawn
        cmp #3
        beq level3_spawn
        
        ; Level 4+: very fast spawning
        lda #30
        jmp set_spawn_timer
        
level3_spawn:
        lda #45
        jmp set_spawn_timer
        
level2_spawn:
        lda #60
        jmp set_spawn_timer
        
level1_spawn:
        lda #90
        
set_spawn_timer:
        sta spawn_timer
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
        ; Update enemy 1 (basic left movement)
        lda enemy1_active
        beq skip_enemy1
        dec enemy1_x
        lda enemy1_x
        cmp #255
        bne skip_enemy1
        lda #0
        sta enemy1_active
        dec enemies_spawned
skip_enemy1:
        
        ; Update enemy 2 (slower left movement)
        lda enemy2_active
        beq skip_enemy2
        lda frame_counter
        and #$01        ; Move every other frame
        bne skip_enemy2
        dec enemy2_x
        lda enemy2_x
        cmp #255
        bne skip_enemy2
        lda #0
        sta enemy2_active
        dec enemies_spawned
skip_enemy2:
        
        ; Update enemy 3 (fast left movement)
        lda enemy3_active
        beq skip_enemy3
        dec enemy3_x
        dec enemy3_x    ; Move 2 pixels per frame
        lda enemy3_x
        cmp #254
        bcs reset_enemy3
        jmp skip_enemy3
reset_enemy3:
        lda #0
        sta enemy3_active
        dec enemies_spawned
skip_enemy3:
        
        ; Update enemy 4 (diagonal movement)
        lda enemy4_active
        beq skip_enemy4
        dec enemy4_x
        ; Oscillate Y position
        lda frame_counter
        and #$04
        beq enemy4_down
        dec enemy4_y
        lda enemy4_y
        cmp #8
        bcs enemy4_y_ok
        lda #8
        sta enemy4_y
        jmp enemy4_y_ok
enemy4_down:
        inc enemy4_y
        lda enemy4_y
        cmp #22
        bcc enemy4_y_ok
        lda #22
        sta enemy4_y
enemy4_y_ok:
        lda enemy4_x
        cmp #255
        bne skip_enemy4
        lda #0
        sta enemy4_active
        dec enemies_spawned
skip_enemy4:
        
        ; Update enemy 5 (zigzag movement)
        lda enemy5_active
        beq skip_enemy5
        dec enemy5_x
        ; Zigzag Y movement
        lda frame_counter
        and #$08
        beq enemy5_up
        inc enemy5_y
        lda enemy5_y
        cmp #23
        bcc enemy5_y_ok2
        lda #23
        sta enemy5_y
        jmp enemy5_y_ok2
enemy5_up:
        dec enemy5_y
        lda enemy5_y
        cmp #17
        bcs enemy5_y_ok2
        lda #17
        sta enemy5_y
enemy5_y_ok2:
        lda enemy5_x
        cmp #255
        bne skip_enemy5
        lda #0
        sta enemy5_active
        dec enemies_spawned
skip_enemy5:
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
        ; Check collision with each active enemy
        jsr check_enemy1_collision
        lda collision_flag
        bne no_collision
        
        jsr check_enemy2_collision
        lda collision_flag
        bne no_collision
        
        jsr check_enemy3_collision
        lda collision_flag
        bne no_collision
        
        jsr check_enemy4_collision
        lda collision_flag
        bne no_collision
        
        jsr check_enemy5_collision
        
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

check_enemy4_collision:
        lda enemy4_active
        beq no_enemy4_collision
        lda player_y
        cmp enemy4_y
        bne no_enemy4_collision
        lda player_x
        cmp enemy4_x
        bne no_enemy4_collision
        jsr handle_collision
no_enemy4_collision:
        rts

check_enemy5_collision:
        lda enemy5_active
        beq no_enemy5_collision
        lda player_y
        cmp enemy5_y
        bne no_enemy5_collision
        lda player_x
        cmp enemy5_x
        bne no_enemy5_collision
        jsr handle_collision
no_enemy5_collision:
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
        ; Clear only the specific rows where enemies can appear
        ldx #0
clear_row10:
        lda #32
        sta $0400+400,x ; Row 10
        inx
        cpx #40
        bne clear_row10
        
        ldx #0
clear_row12:
        lda #32
        sta $0400+480,x ; Row 12
        inx
        cpx #40
        bne clear_row12
        
        ldx #0
clear_row15:
        lda #32
        sta $0400+600,x ; Row 15
        inx
        cpx #40
        bne clear_row15
        
        ldx #0
clear_row18:
        lda #32
        sta $0400+720,x ; Row 18
        inx
        cpx #40
        bne clear_row18
        
        ldx #0
clear_row20:
        lda #32
        sta $0400+800,x ; Row 20
        inx
        cpx #40
        bne clear_row20
        
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
        ; Draw enemy 1 (red)
        lda enemy1_active
        beq skip_draw1
        ldx enemy1_x
        lda #$a0        ; Solid block
        sta $0400+600,x ; Row 15
        lda #$02        ; Red color
        sta $d800+600,x
skip_draw1:
        
        ; Draw enemy 2 (green)
        lda enemy2_active
        beq skip_draw2
        ldx enemy2_x
        lda #$a0        ; Solid block
        sta $0400+480,x ; Row 12
        lda #$05        ; Green color
        sta $d800+480,x
skip_draw2:
        
        ; Draw enemy 3 (cyan)
        lda enemy3_active
        beq skip_draw3
        ldx enemy3_x
        lda #$a0        ; Solid block
        sta $0400+720,x ; Row 18
        lda #$03        ; Cyan color
        sta $d800+720,x
skip_draw3:
        
        ; Draw enemy 4 (purple) - variable row
        lda enemy4_active
        beq skip_draw4
        ldx enemy4_x
        lda #$a0        ; Solid block
        sta $0400+400,x ; Row 10 (simplified)
        lda #$04        ; Purple color
        sta $d800+400,x
skip_draw4:
        
        ; Draw enemy 5 (yellow)
        lda enemy5_active
        beq skip_draw5
        ldx enemy5_x
        lda #$a0        ; Solid block
        sta $0400+800,x ; Row 20
        lda #$07        ; Yellow color
        sta $d800+800,x
skip_draw5:
        
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
enemies_label_loop:
        lda enemies_text,x
        beq enemies_done
        sta $0400+30,x
        inx
        jmp enemies_label_loop
enemies_done:
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

display_enemies:
        lda enemies_spawned
        and #$0f
        clc
        adc #$30
        sta $0400+38
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

enemies_text:
        !byte $05,$0e,$05,$0d,$09,$05,$13,$3a,$00  ; "ENEMIES:" in screen codes

; ================================================================
; VARIABLES
; ================================================================
player_x:       !byte 0
player_y:       !byte 0
enemy1_x:       !byte 0
enemy1_y:       !byte 0
enemy1_active:  !byte 0
enemy2_x:       !byte 0
enemy2_y:       !byte 0
enemy2_active:  !byte 0
enemy3_x:       !byte 0
enemy3_y:       !byte 0
enemy3_active:  !byte 0
enemy4_x:       !byte 0
enemy4_y:       !byte 0
enemy4_active:  !byte 0
enemy5_x:       !byte 0
enemy5_y:       !byte 0
enemy5_active:  !byte 0
score:          !byte 0
level:          !byte 1
frame_counter:  !byte 0
lives:          !byte 3
collision_flag: !byte 0
spawn_timer:    !byte 0
enemies_spawned: !byte 0
temp_offset:    !byte 0,0
temp_row:       !byte 0