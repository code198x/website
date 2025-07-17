; ================================================================
; NEON NEXUS - LESSON 14: Sprite-Based Graphics
; Convert from character graphics to hardware sprites
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
; CONSTANTS
; ================================================================
; VIC-II sprite registers
SPRITE_ENABLE     = $d015
SPRITE_X_EXPAND   = $d01d
SPRITE_Y_EXPAND   = $d017
SPRITE_MULTICOLOR = $d01c
SPRITE_PRIORITY   = $d01b
SPRITE_COLLISION  = $d01e
SPRITE_BG_COLLISION = $d01f

; Sprite position registers (X,Y pairs)
SPRITE0_X = $d000
SPRITE0_Y = $d001
SPRITE1_X = $d002
SPRITE1_Y = $d003
SPRITE2_X = $d004
SPRITE2_Y = $d005
SPRITE3_X = $d006
SPRITE3_Y = $d007

; Sprite colors
SPRITE0_COLOR = $d027
SPRITE1_COLOR = $d028
SPRITE2_COLOR = $d029
SPRITE3_COLOR = $d02a

; Sprite pointers (at end of screen memory)
SPRITE0_PTR = $07f8
SPRITE1_PTR = $07f9
SPRITE2_PTR = $07fa
SPRITE3_PTR = $07fb

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
        
        ; Display UI labels
        jsr display_ui
        
        ; Initialize sprite data
        jsr init_sprites
        
        ; Initialize player sprite (sprite 0)
        lda #50
        sta player_x
        lda #150        ; Y position for sprites
        sta player_y
        
        ; Initialize enemy sprites
        lda #200
        sta enemy1_x
        lda #150
        sta enemy1_y
        lda #1
        sta enemy1_active
        
        lda #250
        sta enemy2_x
        lda #150
        sta enemy2_y
        lda #1
        sta enemy2_active
        
        lda #180
        sta enemy3_x
        lda #120
        sta enemy3_y
        lda #1
        sta enemy3_active
        
        ; Initialize game state
        lda #0
        sta score
        sta frame_counter
        sta collision_flag
        sta total_hits
        lda #1
        sta level
        lda #3
        sta lives
        
        ; Enable sprites
        lda #%00001111  ; Enable sprites 0-3
        sta SPRITE_ENABLE
        
        ; Set sprite colors
        lda #$01        ; White for player
        sta SPRITE0_COLOR
        lda #$02        ; Red for enemy 1
        sta SPRITE1_COLOR
        lda #$05        ; Green for enemy 2
        sta SPRITE2_COLOR
        lda #$03        ; Cyan for enemy 3
        sta SPRITE3_COLOR
        
        ; Set sprite pointers (using cassette buffer)
        ; $033C / 64 = 12.9375, so use 13
        lda #13         ; Player sprite at $0340
        sta SPRITE0_PTR
        lda #14         ; Enemy sprite at $0380
        sta SPRITE1_PTR
        sta SPRITE2_PTR
        sta SPRITE3_PTR
        
        rts

init_sprites:
        ; Create player sprite (star shape) at $0340
        ldx #0
player_sprite_loop:
        lda player_sprite_data,x
        sta $0340,x
        inx
        cpx #63
        bne player_sprite_loop
        
        ; Create enemy sprite (solid block) at $0380
        ldx #0
enemy_sprite_loop:
        lda enemy_sprite_data,x
        sta $0380,x
        inx
        cpx #63
        bne enemy_sprite_loop
        
        rts

game_loop:
        ; Update positions first
        lda collision_flag
        bne skip_movement
        jsr update_player
        jsr update_enemies
skip_movement:
        
        ; Update sprite positions
        jsr update_sprite_positions
        
        ; Check hardware collision detection
        jsr check_sprite_collisions
        
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

update_player:
        ; Move player right, wrap at edge
        inc player_x
        inc player_x    ; Move 2 pixels per frame
        lda player_x
        cmp #250        ; Keep within visible range
        bcc player_ok
        lda #24         ; Wrap to left side
        sta player_x
player_ok:
        rts

update_enemies:
        ; Update enemy 1 (moves left)
        lda enemy1_active
        beq skip_enemy1
        
        lda enemy1_x
        sec
        sbc #2          ; Move 2 pixels left
        sta enemy1_x
        
        ; Check if off left edge
        cmp #24
        bcs skip_enemy1
        ; Respawn at right edge
        lda #250
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
        cmp #24
        bcs skip_enemy2
        lda #250
        sta enemy2_x
skip_enemy2:
        
        ; Update enemy 3 (moves left fast)
        lda enemy3_active
        beq skip_enemy3
        
        lda enemy3_x
        sec
        sbc #4          ; Move 4 pixels left
        sta enemy3_x
        
        ; Check if off left edge
        cmp #24
        bcs skip_enemy3
        lda #250
        sta enemy3_x
skip_enemy3:
        rts

update_sprite_positions:
        ; Update player sprite position
        lda player_x
        sta SPRITE0_X
        lda player_y
        sta SPRITE0_Y
        
        ; Update enemy 1 position
        lda enemy1_x
        sta SPRITE1_X
        lda enemy1_y
        sta SPRITE1_Y
        
        ; Update enemy 2 position
        lda enemy2_x
        sta SPRITE2_X
        lda enemy2_y
        sta SPRITE2_Y
        
        ; Update enemy 3 position
        lda enemy3_x
        sta SPRITE3_X
        lda enemy3_y
        sta SPRITE3_Y
        
        ; Clear X position high bits (not using positions > 255)
        lda #0
        sta $d010
        
        rts

check_sprite_collisions:
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
        ; Read sprite-to-sprite collision register
        lda SPRITE_COLLISION
        and #%00000001  ; Check if sprite 0 hit any other sprite
        beq no_collision
        
        ; Collision detected!
        jsr handle_collision
        
        ; Clear collision register by reading it
        lda SPRITE_COLLISION
        
no_collision:
        rts

handle_collision:
        lda #30         ; Stop movement for 30 frames
        sta collision_flag
        
        ; Increment hit counter
        inc total_hits
        
        ; Find which enemy hit and respawn it
        lda SPRITE_COLLISION
        and #%00000010  ; Enemy 1?
        beq check_enemy2_hit
        lda #250
        sta enemy1_x
        jmp collision_continue
        
check_enemy2_hit:
        lda SPRITE_COLLISION
        and #%00000100  ; Enemy 2?
        beq check_enemy3_hit
        lda #250
        sta enemy2_x
        jmp collision_continue
        
check_enemy3_hit:
        lda SPRITE_COLLISION
        and #%00001000  ; Enemy 3?
        beq collision_continue
        lda #250
        sta enemy3_x
        
collision_continue:
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
        ; Save X register
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
; SPRITE DATA
; ================================================================
player_sprite_data:
        ; Star-shaped sprite (24x21 pixels)
        !byte %00000000,%00011000,%00000000
        !byte %00000000,%00011000,%00000000
        !byte %00000000,%00111100,%00000000
        !byte %00000000,%00111100,%00000000
        !byte %00000000,%01111110,%00000000
        !byte %00000000,%01111110,%00000000
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %01111111,%11111111,%11111110
        !byte %00111111,%11111111,%11111100
        !byte %00011111,%11111111,%11111000
        !byte %00111111,%11111111,%11111100
        !byte %01111111,%11111111,%11111110
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %00000000,%01111110,%00000000
        !byte %00000000,%01111110,%00000000
        !byte %00000000,%00111100,%00000000
        !byte %00000000,%00111100,%00000000
        !byte %00000000,%00011000,%00000000
        !byte %00000000,%00011000,%00000000
        !byte 0  ; Padding byte

enemy_sprite_data:
        ; Solid block enemy sprite
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte 0  ; Padding byte

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
total_hits:     !byte 0