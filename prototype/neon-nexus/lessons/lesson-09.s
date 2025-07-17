; ================================================================
; NEON NEXUS - LESSON 9: Enemy Collision Detection
; Add collision detection between player and enemy
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
        lda #5
        sta player_x
        lda #15         ; Row 15
        sta player_y
        
        ; Initialize enemy  
        lda #20         ; Start far enough to see initial state
        sta enemy_x
        lda #15         ; Row 15 (same as player)
        sta enemy_y
        lda #1
        sta enemy_active
        
        ; Initialize game state
        lda #0
        sta score
        sta frame_counter
        sta lives
        lda #1
        sta level
        lda #3
        sta lives       ; Start with 3 lives
        
        ; Display UI
        jsr display_ui
        
        rts

game_loop:
        ; Check collisions BEFORE movement
        jsr check_collisions
        
        ; Update positions (only if no collision occurred)
        lda collision_flag
        bne skip_movement
        jsr update_player
        jsr update_enemy
skip_movement:
        
        ; Clear screen areas (simple approach)
        jsr clear_rows
        
        ; Draw both objects
        jsr draw_player
        jsr draw_enemy
        
        ; Update score (every 256 frames)
        inc frame_counter
        bne skip_score
        inc score       ; Increment score when frame counter wraps
        
        ; Check for level up (every 16 points)
        lda score
        and #$0f        ; Check if score is multiple of 16
        bne skip_level
        lda score
        beq skip_level  ; Don't level up at score 0
        inc level       ; Level up
        
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

update_enemy:
        lda enemy_active
        beq no_enemy_update
        
        ; Move enemy left
        dec enemy_x
        lda enemy_x
        cmp #255        ; Check for wrap-around (0-1=255)
        bne enemy_ok
        lda #39         ; Reset to right edge
        sta enemy_x
        
enemy_ok:
no_enemy_update:
        rts

check_collisions:
        ; Decrement collision timer if active
        lda collision_flag
        beq check_new_collision
        dec collision_flag
        bne collision_active    ; Still in collision state
        
        ; Collision timer expired - restore normal border
        lda #$02        ; Red border
        sta $d020
        jmp no_collision
        
collision_active:
        ; Still in collision state - don't check for new collisions
        jmp no_collision
        
check_new_collision:
        
        lda enemy_active
        beq no_collision
        
        ; Check if player and enemy are on same row
        lda player_y
        cmp enemy_y
        bne no_collision
        
        ; Check if X positions are the same
        lda player_x
        cmp enemy_x
        bne no_collision
        
        ; Collision detected!
        lda #30         ; Stop movement for 30 frames (about 0.5 seconds)
        sta collision_flag
        
        dec lives
        beq game_over
        
        ; Change border color to show collision
        lda #$01        ; White border during collision
        sta $d020
        
no_collision:
        rts

game_over:
        ; Game over - flash border and reset
        ldx #10
flash_loop:
        lda #$07        ; Yellow
        sta $d020
        jsr short_delay
        lda #$02        ; Red
        sta $d020
        jsr short_delay
        dex
        bne flash_loop
        
        ; Reset game
        jmp init_game

clear_rows:
        ; Clear row 15 (both player and enemy on same row)
        ldx #0
clear_row15:
        lda #32         ; Space
        sta $0400+600,x ; Row 15 (15*40=600)
        inx
        cpx #40
        bne clear_row15
        
        rts

draw_player:
        ; Draw player at current position
        ldx player_x
        lda #$2a        ; Star character
        sta $0400+600,x ; Row 15
        lda #$01        ; White color
        sta $d800+600,x
        rts

draw_enemy:
        lda enemy_active
        beq skip_enemy
        
        ; Draw enemy at current position
        ldx enemy_x
        lda #$a0        ; Solid block character (enemy)
        sta $0400+600,x ; Row 15 (same as player)
        lda #$02        ; Red color
        sta $d800+600,x
        
skip_enemy:
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
        ldy #20
short_outer:
        ldx #100
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
        sta $0400,x     ; Top of screen
        inx
        jmp score_label_loop
score_done:
        
        ; Display "LEVEL:" label
        ldx #0
level_label_loop:
        lda level_text,x
        beq level_done
        sta $0400+10,x  ; Top of screen, offset
        inx
        jmp level_label_loop
level_done:
        
        ; Display "LIVES:" label
        ldx #0
lives_label_loop:
        lda lives_text,x
        beq lives_done
        sta $0400+20,x  ; Top of screen, right side
        inx
        jmp lives_label_loop
lives_done:
        rts

display_score:
        ; Display score as single digit (0-9)
        lda score
        and #$0f        ; Keep only low 4 bits
        clc
        adc #$30        ; Convert to PETSCII digit '0'-'9'
        sta $0400+6     ; Position after "SCORE:"
        rts

display_level:
        ; Display current level (single digit)
        lda level
        and #$0f        ; Keep only low nibble
        clc
        adc #$30        ; Convert to PETSCII digit
        sta $0400+16    ; Position after "LEVEL:"
        rts

display_lives:
        ; Display current lives (single digit)
        lda lives
        and #$0f        ; Keep only low nibble
        clc
        adc #$30        ; Convert to PETSCII digit
        sta $0400+26    ; Position after "LIVES:"
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
enemy_x:        !byte 0
enemy_y:        !byte 0
enemy_active:   !byte 0
score:          !byte 0
level:          !byte 1
frame_counter:  !byte 0
lives:          !byte 3
collision_flag: !byte 0