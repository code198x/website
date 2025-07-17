; ================================================================
; NEON NEXUS - Complete C64 Arena Shooter
; A complete game to be broken down into 32 lessons
; ================================================================

; Memory layout
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
; MAIN PROGRAM START
; ================================================================
*= $0820
main:
        jsr init_game
        jsr game_loop
        rts

; ================================================================
; GAME INITIALIZATION
; ================================================================
init_game:
        ; Set up screen colors
        lda #$00        ; Black background
        sta $d021
        lda #$06        ; Blue border
        sta $d020
        
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Initialize player
        lda #$14        ; Player X (center)
        sta player_x
        lda #$0c        ; Player Y (center)
        sta player_y
        lda #$01        ; White color
        sta player_color
        
        ; Initialize game state
        lda #$00
        sta score
        sta score+1
        sta enemies_active
        sta game_over
        
        ; Enable sprites
        lda #$01        ; Enable sprite 0
        sta $d015
        
        ; Set sprite colors
        lda #$01        ; White for player
        sta $d027
        
        rts

; ================================================================
; MAIN GAME LOOP
; ================================================================
game_loop:
        ; Check if game over
        lda game_over
        bne game_end
        
        ; Read input
        jsr read_input
        
        ; Update player
        jsr update_player
        
        ; Update enemies
        jsr update_enemies
        
        ; Check collisions
        jsr check_collisions
        
        ; Update display
        jsr update_display
        
        ; Add delay for consistent timing
        jsr frame_delay
        
        jmp game_loop

game_end:
        ; Show game over screen
        jsr show_game_over
        rts

; ================================================================
; INPUT HANDLING
; ================================================================
read_input:
        ; Read keyboard
        lda $dc01       ; CIA1 Port B
        cmp #$ff
        beq no_input
        
        ; Check directions (simplified keyboard reading)
        lda $dc00       ; CIA1 Port A
        and #$01        ; Check bit 0 (up)
        beq move_up
        
        lda $dc00
        and #$02        ; Check bit 1 (down)
        beq move_down
        
        lda $dc00
        and #$04        ; Check bit 2 (left)
        beq move_left
        
        lda $dc00
        and #$08        ; Check bit 3 (right)
        beq move_right

no_input:
        rts

move_up:
        lda player_y
        cmp #$02        ; Top boundary
        beq no_input
        dec player_y
        rts

move_down:
        lda player_y
        cmp #$16        ; Bottom boundary
        beq no_input
        inc player_y
        rts

move_left:
        lda player_x
        cmp #$02        ; Left boundary
        beq no_input
        dec player_x
        rts

move_right:
        lda player_x
        cmp #$26        ; Right boundary
        beq no_input
        inc player_x
        rts

; ================================================================
; PLAYER UPDATE
; ================================================================
update_player:
        ; Convert player position to screen coordinates
        lda player_y
        asl             ; Y * 2
        asl             ; Y * 4
        asl             ; Y * 8
        clc
        adc #$32        ; Add vertical offset
        sta sprite_y
        
        lda player_x
        asl             ; X * 2
        asl             ; X * 4
        asl             ; X * 8
        clc
        adc #$18        ; Add horizontal offset
        sta sprite_x
        
        ; Update sprite position
        lda sprite_x
        sta $d000       ; Sprite 0 X
        lda sprite_y
        sta $d001       ; Sprite 0 Y
        
        rts

; ================================================================
; ENEMY SYSTEM
; ================================================================
update_enemies:
        ; Simple enemy spawning (placeholder)
        lda frame_counter
        and #$3f        ; Every 64 frames
        bne skip_spawn
        
        ; Spawn enemy at random position
        lda $d012       ; Use raster line as random
        and #$1f        ; Limit to screen
        clc
        adc #$02        ; Add minimum position
        sta enemy_x
        
        lda #$02        ; Start at top
        sta enemy_y
        
        lda #$01        ; Mark enemy as active
        sta enemies_active

skip_spawn:
        ; Move active enemies
        lda enemies_active
        beq no_enemies
        
        inc enemy_y     ; Move down
        lda enemy_y
        cmp #$16        ; Check if off screen
        bcc enemies_ok
        
        lda #$00        ; Deactivate enemy
        sta enemies_active

enemies_ok:
no_enemies:
        rts

; ================================================================
; COLLISION DETECTION
; ================================================================
check_collisions:
        ; Check player vs enemies
        lda enemies_active
        beq no_collision
        
        ; Simple box collision
        lda player_x
        cmp enemy_x
        bne no_collision
        
        lda player_y
        cmp enemy_y
        bne no_collision
        
        ; Collision detected!
        lda #$01
        sta game_over

no_collision:
        rts

; ================================================================
; DISPLAY UPDATE
; ================================================================
update_display:
        ; Display player as character on screen
        ; Calculate screen position
        lda player_y
        asl
        tax
        lda screen_rows_lo,x
        sta $fb
        lda screen_rows_hi,x
        sta $fc
        
        ; Clear old position first (simplified)
        ldy #$00
        lda #$20        ; Space character
        sta ($fb),y
        
        ; Add X offset
        lda player_x
        tay
        
        ; Draw player
        lda #$2a        ; Star character
        sta ($fb),y
        
        ; Set color
        lda $fc
        clc
        adc #$d4        ; Convert to color RAM
        sta $fc
        lda player_color
        sta ($fb),y
        
        ; Draw enemy if active
        lda enemies_active
        beq skip_enemy
        
        ; Calculate enemy screen position
        lda enemy_y
        asl
        tax
        lda screen_rows_lo,x
        sta $fb
        lda screen_rows_hi,x
        sta $fc
        
        lda enemy_x
        tay
        
        lda #$51        ; Enemy character
        sta ($fb),y
        
        ; Set enemy color (red)
        lda $fc
        clc
        adc #$d4
        sta $fc
        lda #$02        ; Red
        sta ($fb),y

skip_enemy:
        ; Update score display
        jsr update_score_display
        
        ; Increment frame counter
        inc frame_counter
        
        rts

; ================================================================
; SCORE DISPLAY
; ================================================================
update_score_display:
        ; Display score at top of screen
        lda #$04        ; Screen row 0 + 4
        sta $fb
        lda #$04
        sta $fc
        
        ldy #$00
        lda score+1     ; High byte
        jsr display_hex_byte
        lda score       ; Low byte
        jsr display_hex_byte
        
        rts

display_hex_byte:
        pha
        lsr
        lsr
        lsr
        lsr
        jsr hex_to_char
        sta ($fb),y
        iny
        
        pla
        and #$0f
        jsr hex_to_char
        sta ($fb),y
        iny
        rts

hex_to_char:
        cmp #$0a
        bcc is_digit
        clc
        adc #$07        ; A-F
is_digit:
        clc
        adc #$30        ; 0-9
        rts

; ================================================================
; GAME OVER SCREEN
; ================================================================
show_game_over:
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Display "GAME OVER"
        ldx #$00
game_over_loop:
        lda game_over_text,x
        beq game_over_done
        jsr $ffd2
        inx
        jmp game_over_loop

game_over_done:
        rts

; ================================================================
; UTILITY FUNCTIONS
; ================================================================
frame_delay:
        ; Simple delay loop
        ldx #$ff
delay_loop:
        dex
        bne delay_loop
        rts

; ================================================================
; DATA TABLES
; ================================================================
screen_rows_lo:
        !byte $00,$28,$50,$78,$a0,$c8,$f0,$18,$40,$68,$90,$b8,$e0,$08,$30,$58
        !byte $80,$a8,$d0,$f8,$20,$48,$70,$98,$c0,$e8

screen_rows_hi:
        !byte $04,$04,$04,$04,$04,$04,$04,$05,$05,$05,$05,$05,$05,$06,$06,$06
        !byte $06,$06,$06,$06,$07,$07,$07,$07,$07,$07

game_over_text:
        !text "game over"
        !byte $0d,$00

; ================================================================
; GAME VARIABLES
; ================================================================
player_x:       !byte $00
player_y:       !byte $00
player_color:   !byte $00
sprite_x:       !byte $00
sprite_y:       !byte $00

enemy_x:        !byte $00
enemy_y:        !byte $00
enemies_active: !byte $00

score:          !word $0000
game_over:      !byte $00
frame_counter:  !byte $00