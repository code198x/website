; ================================================================
; NEON NEXUS - LESSON 8: Basic Enemy
; Add a simple enemy that appears and moves
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
        jsr game_loop
        rts

init_game:
        ; Set up colors
        lda #$06        ; Blue border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Initialize player
        lda #20
        sta player_x
        lda #20
        sta player_y
        
        ; Initialize enemy
        lda #10
        sta enemy_x
        lda #5
        sta enemy_y
        lda #1
        sta enemy_active
        
        rts

game_loop:
        ; Update positions
        jsr update_player
        jsr update_enemy
        
        ; Draw everything (simple version)
        jsr draw_all
        
        ; Simple delay
        ldy #50
outer_delay:
        ldx #255
inner_delay:
        dex
        bne inner_delay
        dey
        bne outer_delay
        
        jmp game_loop

update_player:
        ; Simple player movement (automatic for now)
        inc player_x
        lda player_x
        cmp #35
        bcc player_ok
        lda #5
        sta player_x
player_ok:
        rts

update_enemy:
        lda enemy_active
        beq no_enemy
        
        ; Move enemy down
        inc enemy_y
        lda enemy_y
        cmp #24
        bcc enemy_ok
        
        ; Reset enemy
        lda #5
        sta enemy_y
        inc enemy_x
        lda enemy_x
        cmp #35
        bcc enemy_ok
        lda #5
        sta enemy_x
        
enemy_ok:
no_enemy:
        rts

draw_all:
        ; Very simple drawing - just put characters on screen
        ; This avoids complex screen clearing
        
        ; Calculate player screen position (simplified)
        lda player_y
        asl
        asl
        asl             ; Y * 8
        sta temp
        asl
        asl             ; Y * 32
        clc
        adc temp        ; Y * 40
        clc
        adc player_x
        tax
        
        lda #$2a        ; Player character
        sta $0400,x
        lda #1          ; White
        sta $d800,x
        
        ; Draw enemy if active
        lda enemy_active
        beq skip_enemy
        
        lda enemy_y
        asl
        asl
        asl
        sta temp
        asl
        asl
        clc
        adc temp
        clc
        adc enemy_x
        tax
        
        lda #$51        ; Enemy character 'Q'
        sta $0400,x
        lda #2          ; Red
        sta $d800,x
        
skip_enemy:
        rts

; ================================================================
; VARIABLES
; ================================================================
player_x:       !byte 0
player_y:       !byte 0
enemy_x:        !byte 0
enemy_y:        !byte 0
enemy_active:   !byte 0
temp:           !byte 0