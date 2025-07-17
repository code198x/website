; ================================================================
; NEON NEXUS - LESSON 13: Proper Collision Detection
; Fix the "stepping over" bug with bounding box collision
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
        ; First ensure we start fresh
        lda #3
        sta lives       ; Set lives FIRST to avoid immediate game over
        lda #0
        sta collision_flag
        
        ; Set colors
        lda #$02        ; Red border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Display UI labels
        jsr display_ui
        
        ; Initialize player
        lda #5
        sta player_x
        lda #15         ; Row 15
        sta player_y
        
        ; Initialize enemies for testing collision
        lda #25         ; Start further away
        sta enemy1_x
        lda #15         ; Same row as player
        sta enemy1_y
        lda #1
        sta enemy1_active
        
        lda #35
        sta enemy2_x
        lda #15         ; Same row
        sta enemy2_y
        lda #1
        sta enemy2_active
        
        lda #20
        sta enemy3_x
        lda #12         ; Different row
        sta enemy3_y
        lda #1
        sta enemy3_active
        
        ; Initialize game state
        lda #0
        sta score
        sta frame_counter
        sta collision_flag
        sta debug_mode      ; Press D to toggle
        sta total_hits      ; Reset hit counter
        lda #1
        sta level
        lda #3
        sta lives
        
        rts

game_loop:
        ; Check keyboard input
        jsr check_keyboard
        
        ; Update positions first
        lda collision_flag
        bne skip_movement
        jsr update_player
        jsr update_enemies
skip_movement:
        
        ; Check collisions with new bounding box method
        jsr check_collisions_bbox
        
        ; Clear screen areas
        jsr clear_rows
        
        ; Draw all objects
        jsr draw_player
        jsr draw_enemies
        
        ; Show debug info if enabled
        lda debug_mode
        beq skip_debug
        jsr draw_debug_info
skip_debug:
        
        ; Update score (every 256 frames)
        inc frame_counter
        bne skip_score
        inc score
        
        ; Check for level up
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
        jsr display_hits
        
        ; Delay
        jsr delay
        
        jmp game_loop

check_keyboard:
        ; Check for 'D' key press (scan code $12)
        lda #$12
        sta $dc00
        lda $dc01
        and #$08
        bne no_d_key
        
        ; Toggle debug mode
        lda debug_mode
        eor #$01
        sta debug_mode
        
        ; Debounce
        ldx #10
debounce:
        dex
        bne debounce
        
no_d_key:
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
        
        ; Update enemy 2 (moves left slowly)
        lda enemy2_active
        beq skip_enemy2
        lda frame_counter
        and #$01
        bne skip_enemy2
        dec enemy2_x
        lda enemy2_x
        cmp #255
        bne skip_enemy2
        lda #39
        sta enemy2_x
skip_enemy2:
        
        ; Update enemy 3 (moves left fast)
        lda enemy3_active
        beq skip_enemy3
        dec enemy3_x
        dec enemy3_x
        lda enemy3_x
        cmp #254
        bcc skip_enemy3
        lda #39
        sta enemy3_x
skip_enemy3:
        rts

check_collisions_bbox:
        ; Reset collision state
        lda collision_flag
        beq check_new_collision
        dec collision_flag
        bne collision_active
        
        ; Collision timer expired
        lda #$02        ; Red border
        sta $d020
        jmp no_collision
        
collision_active:
        jmp no_collision
        
check_new_collision:
        ; Check each enemy with bounding box method
        jsr check_enemy1_bbox
        lda collision_flag
        bne no_collision
        
        jsr check_enemy2_bbox
        lda collision_flag
        bne no_collision
        
        jsr check_enemy3_bbox
        
no_collision:
        rts

check_enemy1_bbox:
        lda enemy1_active
        beq no_enemy1_collision
        
        ; First check Y position (must be same row)
        lda player_y
        cmp enemy1_y
        bne no_enemy1_collision
        
        ; Now check X overlap using bounding box
        ; Player occupies player_x to player_x (1 char wide)
        ; Enemy occupies enemy1_x to enemy1_x (1 char wide)
        ; For single-character entities, we need adjacency check
        
        ; Check if enemy is at player position
        lda enemy1_x
        cmp player_x
        beq collision_detected
        
        ; For better collision timing, only check current and next position
        ; since enemies move left and player moves right
        
        ; Check if enemy will be at player's next position
        lda player_x
        clc
        adc #1
        cmp enemy1_x
        beq collision_detected
        
no_enemy1_collision:
        rts
        
collision_detected:
        jsr handle_collision
        rts

check_enemy2_bbox:
        lda enemy2_active
        beq no_enemy2_collision
        
        ; Check Y position
        lda player_y
        cmp enemy2_y
        bne no_enemy2_collision
        
        ; Check X overlap with bounding box
        lda enemy2_x
        cmp player_x
        beq collision2_detected
        
        ; Check if enemy will be at player's next position
        lda player_x
        clc
        adc #1
        cmp enemy2_x
        beq collision2_detected
        
no_enemy2_collision:
        rts
        
collision2_detected:
        jsr handle_collision
        rts

check_enemy3_bbox:
        lda enemy3_active
        beq no_enemy3_collision
        
        ; Check Y position
        lda player_y
        cmp enemy3_y
        bne no_enemy3_collision
        
        ; Check X overlap with bounding box
        lda enemy3_x
        cmp player_x
        beq collision3_detected
        
        ; Enemy 3 moves 2 spaces, so check next 2 positions
        lda player_x
        clc
        adc #1
        cmp enemy3_x
        beq collision3_detected
        
        lda player_x
        clc
        adc #2
        cmp enemy3_x
        beq collision3_detected
        
no_enemy3_collision:
        rts
        
collision3_detected:
        jsr handle_collision
        rts

handle_collision:
        lda #30         ; Stop movement for 30 frames
        sta collision_flag
        
        ; Increment hit counter
        inc total_hits
        
        ; Move enemies away to prevent repeated hits
        lda enemy1_x
        clc
        adc #40         ; Move enemy away
        cmp #40
        bcs enemy1_ok
        lda #39
enemy1_ok:
        sta enemy1_x
        
        lda enemy2_x
        clc
        adc #40
        cmp #40
        bcs enemy2_ok
        lda #39
enemy2_ok:
        sta enemy2_x
        
        lda enemy3_x
        clc
        adc #40
        cmp #40
        bcs enemy3_ok
        lda #39
enemy3_ok:
        sta enemy3_x
        
        dec lives
        bne collision_done
        jmp game_over
collision_done:
        
        ; Flash border white
        lda #$01
        sta $d020
        rts

game_over:
        ; Game over - just stop the game
        ldx #3          ; 3 flashes
flash_loop:
        lda #$07        ; Yellow
        sta $d020
        jsr short_delay
        lda #$02        ; Red
        sta $d020
        jsr short_delay
        dex
        bne flash_loop
        
        ; Set border back to red
        lda #$02
        sta $d020
        
        ; Display GAME OVER message
        ldx #0
game_over_msg_loop:
        lda game_over_text,x
        beq game_over_done
        sta $0400+520,x ; Row 13, center
        lda #$01        ; White color
        sta $d800+520,x
        inx
        jmp game_over_msg_loop
game_over_done:
        
        ; Infinite loop - stop the game
stop_loop:
        jmp stop_loop

short_delay:
        ; BUGFIX from earlier lessons: 
        ; Save X register since flash_loop uses X as counter
        ; Without this, game over sequence gets stuck!
        txa
        pha
        
        ldy #30
short_outer:
        ldx #100
short_inner:
        dex
        bne short_inner
        dey
        bne short_outer
        
        ; Restore X register
        pla
        tax
        rts

clear_rows:
        ; Clear specific rows
        ldx #0
clear_loop:
        lda #32         ; Space
        sta $0400+480,x ; Row 12
        sta $0400+600,x ; Row 15
        inx
        cpx #40
        bne clear_loop
        rts

draw_player:
        ; Draw player
        ldx player_x
        lda #$2a        ; Star character
        sta $0400+600,x ; Row 15
        lda #$01        ; White
        sta $d800+600,x
        
        ; Draw collision box in debug mode
        lda debug_mode
        beq skip_player_debug
        
        ; Show collision zone (one char to left and right)
        lda player_x
        beq skip_left
        tax
        dex
        lda #$2e        ; Period
        sta $0400+600,x
        lda #$0f        ; Light gray
        sta $d800+600,x
skip_left:
        
        lda player_x
        cmp #39
        beq skip_right
        tax
        inx
        lda #$2e        ; Period
        sta $0400+600,x
        lda #$0f        ; Light gray
        sta $d800+600,x
skip_right:
        
skip_player_debug:
        rts

draw_enemies:
        ; Draw enemy 1
        lda enemy1_active
        beq skip_draw1
        ldx enemy1_x
        lda #$a0        ; Solid block
        sta $0400+600,x ; Row 15
        lda #$02        ; Red
        sta $d800+600,x
skip_draw1:
        
        ; Draw enemy 2
        lda enemy2_active
        beq skip_draw2
        ldx enemy2_x
        lda #$a0
        sta $0400+600,x ; Row 15
        lda #$05        ; Green
        sta $d800+600,x
skip_draw2:
        
        ; Draw enemy 3
        lda enemy3_active
        beq skip_draw3
        ldx enemy3_x
        lda #$a0
        sta $0400+480,x ; Row 12
        lda #$03        ; Cyan
        sta $d800+480,x
skip_draw3:
        rts

draw_debug_info:
        ; Show "DEBUG" text on row 23
        ldx #0
debug_text_loop:
        lda debug_text,x
        beq debug_done
        sta $0400+920,x ; Row 23
        lda #$07        ; Yellow
        sta $d800+920,x
        inx
        jmp debug_text_loop
debug_done:
        
        ; Show player X position
        lda player_x
        lsr
        lsr
        lsr
        lsr
        clc
        adc #$30
        sta $0400+927   ; First digit
        
        lda player_x
        and #$0f
        cmp #10
        bcc digit_ok
        clc
        adc #7          ; Convert to A-F
digit_ok:
        clc
        adc #$30
        sta $0400+928   ; Second digit
        
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
hits_label_loop:
        lda hits_text,x
        beq hits_done
        sta $0400+30,x
        inx
        jmp hits_label_loop
hits_done:
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

display_hits:
        lda total_hits
        and #$0f
        clc
        adc #$30
        sta $0400+35
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

hits_text:
        !byte $08,$09,$14,$13,$3a,$00      ; "HITS:" in screen codes

debug_text:
        !byte $04,$05,$02,$15,$07,$3a,$00  ; "DEBUG:" in screen codes

game_over_text:
        !byte $07,$01,$0d,$05,$20,$0f,$16,$05,$12,$00  ; "GAME OVER" in screen codes

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
debug_mode:     !byte 0
total_hits:     !byte 0