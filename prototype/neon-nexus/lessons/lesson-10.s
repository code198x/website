; ================================================================
; NEON NEXUS - LESSON 10: Multiple Enemies
; Add multiple enemies with individual movement patterns
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
        
        ; Initialize player
        lda #10
        sta player_x
        lda #15         ; Row 15
        sta player_y
        
        ; Initialize enemy 1
        lda #15
        sta enemy1_x
        lda #15         ; Row 15 (same as player)
        sta enemy1_y
        lda #1
        sta enemy1_active
        
        ; Initialize enemy 2
        lda #35
        sta enemy2_x
        lda #15         ; Row 15 (same as player)
        sta enemy2_y
        lda #1
        sta enemy2_active
        
        ; Initialize enemy 3
        lda #15
        sta enemy3_x
        lda #12         ; Row 12 (different row)
        sta enemy3_y
        lda #1
        sta enemy3_active
        
        ; Initialize game state
        lda #0
        sta score
        sta frame_counter
        sta collision_flag
        lda #1
        sta level
        lda #3
        sta lives
        
        ; Display UI
        jsr display_ui
        
        rts

game_loop:
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
        
        ; Delay
        jsr delay
        
        jmp game_loop

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
        ; Update enemy 1 (moves left)
        lda enemy1_active
        beq skip_enemy1
        dec enemy1_x
        lda enemy1_x
        cmp #255
        bne skip_enemy1
        lda #39
        sta enemy1_x
skip_enemy1:
        
        ; Update enemy 2 (moves left, faster)
        lda enemy2_active
        beq skip_enemy2
        dec enemy2_x
        dec enemy2_x       ; Move 2 spaces per frame
        lda enemy2_x
        cmp #254           ; Check for wrap (0-2 = 254)
        bcs reset_enemy2
        jmp skip_enemy2
reset_enemy2:
        lda #39
        sta enemy2_x
skip_enemy2:
        
        ; Update enemy 3 (moves up and down)
        lda enemy3_active
        beq skip_enemy3
        ; Simple up/down movement between rows 10-18
        lda frame_counter
        and #$08           ; Change direction every 8 frames
        beq enemy3_down
        dec enemy3_y
        lda enemy3_y
        cmp #10
        bcs skip_enemy3
        lda #10
        sta enemy3_y
        jmp skip_enemy3
enemy3_down:
        inc enemy3_y
        lda enemy3_y
        cmp #18
        bcc skip_enemy3
        lda #18
        sta enemy3_y
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
        ; Still in collision state
        jmp no_collision
        
check_new_collision:
        ; Check collision with enemy 1
        jsr check_enemy1_collision
        lda collision_flag
        bne no_collision   ; Already collided
        
        ; Check collision with enemy 2  
        jsr check_enemy2_collision
        lda collision_flag
        bne no_collision   ; Already collided
        
        ; Check collision with enemy 3
        jsr check_enemy3_collision
        
no_collision:
        rts

check_enemy1_collision:
        lda enemy1_active
        beq no_enemy1_collision
        
        ; Check same row
        lda player_y
        cmp enemy1_y
        bne no_enemy1_collision
        
        ; Check same X position
        lda player_x
        cmp enemy1_x
        bne no_enemy1_collision
        
        ; Collision detected!
        jsr handle_collision
        
no_enemy1_collision:
        rts

check_enemy2_collision:
        lda enemy2_active
        beq no_enemy2_collision
        
        ; Check same row
        lda player_y
        cmp enemy2_y
        bne no_enemy2_collision
        
        ; Check same X position
        lda player_x
        cmp enemy2_x
        bne no_enemy2_collision
        
        ; Collision detected!
        jsr handle_collision
        
no_enemy2_collision:
        rts

check_enemy3_collision:
        lda enemy3_active
        beq no_enemy3_collision
        
        ; Check same row
        lda player_y
        cmp enemy3_y
        bne no_enemy3_collision
        
        ; Check same X position
        lda player_x
        cmp enemy3_x
        bne no_enemy3_collision
        
        ; Collision detected!
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
        jsr delay       ; Use longer delay
        lda #$02        ; Red
        sta $d020
        jsr delay       ; Use longer delay
        dex
        bne flash_loop
        
        ; Reset game
        jmp init_game

clear_rows:
        ; Clear row 12 (enemy 3 possible row)
        ldx #0
clear_row12:
        lda #32         ; Space
        sta $0400+480,x ; Row 12 (12*40=480)
        inx
        cpx #40
        bne clear_row12
        
        ; Clear row 15 (player and enemies 1&2)
        ldx #0
clear_row15:
        lda #32         ; Space
        sta $0400+600,x ; Row 15 (15*40=600)
        inx
        cpx #40
        bne clear_row15
        
        ; Clear additional rows for enemy 3's movement
        ldx #0
clear_row10:
        lda #32         ; Space
        sta $0400+400,x ; Row 10 (10*40=400)
        inx
        cpx #40
        bne clear_row10
        
        ldx #0
clear_row18:
        lda #32         ; Space
        sta $0400+720,x ; Row 18 (18*40=720)
        inx
        cpx #40
        bne clear_row18
        
        rts

draw_player:
        ; Draw player at current position (only on row 15)
        ldx player_x
        lda #$2a        ; Star character
        sta $0400+600,x ; Row 15
        lda #$01        ; White color
        sta $d800+600,x
        rts

draw_enemies:
        ; Draw enemy 1 (row 15)
        lda enemy1_active
        beq skip_draw1
        ldx enemy1_x
        lda #$a0        ; Solid block
        sta $0400+600,x ; Row 15
        lda #$02        ; Red color
        sta $d800+600,x
        
skip_draw1:
        ; Draw enemy 2 (row 15)
        lda enemy2_active
        beq skip_draw2
        ldx enemy2_x
        lda #$a0        ; Solid block
        sta $0400+600,x ; Row 15
        lda #$05        ; Green color
        sta $d800+600,x
        
skip_draw2:
        ; Draw enemy 3 (simplified - just use row 12 for now)
        lda enemy3_active
        beq skip_draw3
        ldx enemy3_x
        lda #$a0        ; Solid block
        sta $0400+480,x ; Row 12 (12*40=480)
        lda #$03        ; Cyan color
        sta $d800+480,x
        
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

short_delay:
        ldy #100
short_outer:
        ldx #200
short_inner:
        dex
        bne short_inner
        dey
        bne short_outer
        rts

; ================================================================
; DISPLAY SUBROUTINES
; ================================================================
display_ui:
        ; Display "SCORE:" label
        ldx #0
score_label_loop:
        lda score_text,x
        beq score_done
        sta $0400,x
        inx
        jmp score_label_loop
score_done:
        
        ; Display "LEVEL:" label
        ldx #0
level_label_loop:
        lda level_text,x
        beq level_done
        sta $0400+10,x
        inx
        jmp level_label_loop
level_done:
        
        ; Display "LIVES:" label
        ldx #0
lives_label_loop:
        lda lives_text,x
        beq lives_done
        sta $0400+20,x
        inx
        jmp lives_label_loop
lives_done:
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


; ================================================================
; DATA
; ================================================================
score_text:
        !byte $13,$03,$0f,$12,$05,$3a,$00  ; "SCORE:" in screen codes

level_text:
        !byte $0c,$05,$16,$05,$0c,$3a,$00  ; "LEVEL:" in screen codes

lives_text:
        !byte $0c,$09,$16,$05,$13,$3a,$00  ; "LIVES:" in screen codes

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
score:          !byte 0
level:          !byte 1
frame_counter:  !byte 0
lives:          !byte 3
collision_flag: !byte 0
temp_y:         !byte 0
temp_result:    !byte 0,0