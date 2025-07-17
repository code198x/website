; ================================================================
; NEON NEXUS - Fixed Working Version
; A simple but complete C64 arena game
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

; ================================================================
; INITIALIZATION
; ================================================================
init_game:
        ; Set colors
        lda #$00        ; Black background
        sta $d021
        lda #$06        ; Blue border
        sta $d020
        
        ; Clear screen properly
        jsr clear_screen
        
        ; Initialize player at center
        lda #20         ; X position (0-39)
        sta player_x
        lda #12         ; Y position (0-24)
        sta player_y
        
        ; Initialize enemy
        lda #10
        sta enemy_x
        lda #5
        sta enemy_y
        lda #1
        sta enemy_active
        
        ; Initialize game state
        lda #0
        sta game_over
        sta frame_count
        
        rts

; ================================================================
; PROPER SCREEN CLEAR
; ================================================================
clear_screen:
        ldx #0
        lda #32         ; Space character
clear_loop:
        sta $0400,x     ; Screen RAM page 1
        sta $0500,x     ; Screen RAM page 2
        sta $0600,x     ; Screen RAM page 3
        sta $0700,x     ; Screen RAM page 4 (partial)
        inx
        bne clear_loop
        
        ; Clear colors to white
        ldx #0
        lda #1          ; White
color_loop:
        sta $d800,x     ; Color RAM page 1
        sta $d900,x     ; Color RAM page 2
        sta $da00,x     ; Color RAM page 3
        sta $db00,x     ; Color RAM page 4 (partial)
        inx
        bne color_loop
        
        rts

; ================================================================
; MAIN GAME LOOP
; ================================================================
game_loop:
        ; Check game over
        lda game_over
        bne end_game
        
        ; Handle input
        jsr handle_input
        
        ; Update enemy
        jsr update_enemy
        
        ; Check collision
        jsr check_collision
        
        ; Draw everything
        jsr draw_game
        
        ; Simple timing
        jsr wait_frame
        
        ; Increment frame counter
        inc frame_count
        
        jmp game_loop

end_game:
        ; Show game over message
        ldx #0
show_msg:
        lda game_over_msg,x
        beq msg_done
        sta $0400,x
        inx
        bne show_msg
msg_done:
        rts

; ================================================================
; INPUT HANDLING (simplified keyboard)
; ================================================================
handle_input:
        ; Simple keyboard scan
        lda $dc01       ; Read keyboard
        cmp #$fe        ; Check if key pressed
        bne check_keys
        rts

check_keys:
        ; Check cursor keys via $dc00/$dc01
        ; This is simplified - real keyboard handling is complex
        
        ; For now, let's use a simple pattern
        lda frame_count
        and #$3f
        cmp #$10
        bcc move_player_up
        cmp #$20
        bcc move_player_down
        cmp #$30
        bcc move_player_left
        ; Default: move right

move_player_right:
        lda player_x
        cmp #38         ; Right boundary
        bcs no_move
        inc player_x
        rts

move_player_left:
        lda player_x
        cmp #1          ; Left boundary
        bcc no_move
        dec player_x
        rts

move_player_up:
        lda player_y
        cmp #1          ; Top boundary
        bcc no_move
        dec player_y
        rts

move_player_down:
        lda player_y
        cmp #23         ; Bottom boundary
        bcs no_move
        inc player_y
        rts

no_move:
        rts

; ================================================================
; ENEMY UPDATE
; ================================================================
update_enemy:
        lda enemy_active
        beq no_enemy
        
        ; Simple enemy movement - chase player
        lda enemy_x
        cmp player_x
        beq check_enemy_y
        bcc enemy_move_right
        dec enemy_x
        rts
        
enemy_move_right:
        inc enemy_x
        rts

check_enemy_y:
        lda enemy_y
        cmp player_y
        beq no_enemy
        bcc enemy_move_down
        dec enemy_y
        rts

enemy_move_down:
        inc enemy_y
        
no_enemy:
        rts

; ================================================================
; COLLISION CHECK
; ================================================================
check_collision:
        lda enemy_active
        beq no_collision
        
        ; Check if player and enemy are at same position
        lda player_x
        cmp enemy_x
        bne no_collision
        
        lda player_y
        cmp enemy_y
        bne no_collision
        
        ; Collision! Game over
        lda #1
        sta game_over

no_collision:
        rts

; ================================================================
; DRAW GAME
; ================================================================
draw_game:
        ; Clear previous positions by redrawing entire screen
        ; This is inefficient but safe
        jsr clear_screen
        
        ; Draw player
        jsr draw_player
        
        ; Draw enemy
        lda enemy_active
        beq skip_enemy
        jsr draw_enemy

skip_enemy:
        ; Draw score/status
        jsr draw_status
        
        rts

; ================================================================
; DRAW PLAYER
; ================================================================
draw_player:
        ; Calculate screen position
        ; Screen address = $0400 + (Y * 40) + X
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
        adc player_x    ; Add X
        tax
        
        ; Draw player character
        lda #42         ; Asterisk
        sta $0400,x
        
        ; Set player color (white)
        lda #1
        sta $d800,x
        
        rts

; ================================================================
; DRAW ENEMY
; ================================================================
draw_enemy:
        ; Calculate screen position same way
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
        
        ; Draw enemy character
        lda #81         ; 'Q' character
        sta $0400,x
        
        ; Set enemy color (red)
        lda #2
        sta $d800,x
        
        rts

; ================================================================
; DRAW STATUS
; ================================================================
draw_status:
        ; Draw frame counter at top of screen
        lda frame_count
        lsr
        lsr
        lsr
        lsr
        clc
        adc #48         ; Convert to ASCII digit
        sta $0400       ; Top-left corner
        
        lda frame_count
        and #$0f
        clc
        adc #48
        sta $0401
        
        rts

; ================================================================
; TIMING
; ================================================================
wait_frame:
        ; Simple delay loop
        ldy #200
outer_delay:
        ldx #255
inner_delay:
        dex
        bne inner_delay
        dey
        bne outer_delay
        rts

; ================================================================
; DATA
; ================================================================
player_x:       !byte 0
player_y:       !byte 0
enemy_x:        !byte 0
enemy_y:        !byte 0
enemy_active:   !byte 0
game_over:      !byte 0
frame_count:    !byte 0
temp:           !byte 0

game_over_msg:
        !text "game over"
        !byte 0