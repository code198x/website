; ================================================================
; NEON NEXUS - LESSON 15: Smooth Animation and Timing
; Add animation frames and raster interrupt timing
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

; Raster interrupt registers
RASTER_LINE = $d012
RASTER_HIGH = $d011
IRQ_ENABLE  = $dc0d
VIC_IRQ_ENABLE = $d01a
VIC_IRQ_STATUS = $d019

; ================================================================
; MAIN PROGRAM
; ================================================================
*= $0820
main:
        jsr init_game
        jsr setup_irq
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
        sta anim_frame
        sta anim_timer
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
        
        ; Set initial sprite pointers
        lda #13         ; Player sprite frame 0
        sta SPRITE0_PTR
        lda #16         ; Enemy sprite frame 0
        sta SPRITE1_PTR
        sta SPRITE2_PTR
        sta SPRITE3_PTR
        
        rts

setup_irq:
        ; Disable interrupts
        sei
        
        ; Set raster interrupt line
        lda #250
        sta RASTER_LINE
        lda RASTER_HIGH
        and #$7f        ; Clear bit 7 for raster line high
        sta RASTER_HIGH
        
        ; Set interrupt vector
        lda #<irq_handler
        sta $0314
        lda #>irq_handler
        sta $0315
        
        ; Enable raster interrupts
        lda #$01
        sta VIC_IRQ_ENABLE
        
        ; Disable CIA interrupts
        lda #$7f
        sta IRQ_ENABLE
        
        ; Clear pending interrupts
        lda VIC_IRQ_STATUS
        sta VIC_IRQ_STATUS
        
        ; Enable interrupts
        cli
        rts

irq_handler:
        ; Acknowledge interrupt
        lda #$01
        sta VIC_IRQ_STATUS
        
        ; Update smooth movement flag
        inc smooth_update
        
        ; Call original IRQ handler
        jmp $ea31

init_sprites:
        ; Create player animation frames at $0340, $0380, $03C0
        ldx #0
init_player_frames:
        ; Frame 0 - normal star
        lda player_frame0,x
        sta $0340,x
        ; Frame 1 - rotating star
        lda player_frame1,x
        sta $0380,x
        ; Frame 2 - pulsing star
        lda player_frame2,x
        sta $03C0,x
        inx
        cpx #63
        bne init_player_frames
        
        ; Create enemy animation frames at $0400, $0440, $0480
        ldx #0
init_enemy_frames:
        ; Frame 0 - solid
        lda enemy_frame0,x
        sta $0400,x
        ; Frame 1 - hollow
        lda enemy_frame1,x
        sta $0440,x
        ; Frame 2 - pattern
        lda enemy_frame2,x
        sta $0480,x
        inx
        cpx #63
        bne init_enemy_frames
        
        rts

game_loop:
        ; Wait for smooth update flag
        lda smooth_update
        beq game_loop
        lda #0
        sta smooth_update
        
        ; Update animations
        jsr update_animations
        
        ; Update positions
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
        
        jmp game_loop

update_animations:
        ; Update animation timer
        inc anim_timer
        lda anim_timer
        cmp #8          ; Change frame every 8 updates
        bcc no_anim_update
        
        ; Reset timer and advance frame
        lda #0
        sta anim_timer
        
        ; Update player animation
        inc anim_frame
        lda anim_frame
        and #$03        ; Keep in range 0-3
        sta anim_frame
        
        ; Set player sprite pointer based on frame
        cmp #3
        bne not_frame3
        lda #13         ; Loop back to frame 0
        jmp set_player_frame
not_frame3:
        clc
        adc #13         ; Base player sprite
set_player_frame:
        sta SPRITE0_PTR
        
        ; Update enemy animation (opposite phase)
        lda anim_frame
        eor #$02        ; Flip bit 1 for opposite phase
        and #$03
        cmp #3
        bne not_enemy_frame3
        lda #16         ; Loop back to frame 0
        jmp set_enemy_frame
not_enemy_frame3:
        clc
        adc #16         ; Base enemy sprite
set_enemy_frame:
        sta SPRITE1_PTR
        sta SPRITE2_PTR
        sta SPRITE3_PTR
        
no_anim_update:
        rts

update_player:
        ; Move player right with smooth subpixel movement
        inc player_subpixel
        lda player_subpixel
        cmp #2          ; Move 1 pixel every 2 frames
        bcc player_done
        lda #0
        sta player_subpixel
        
        inc player_x
        lda player_x
        cmp #250        ; Keep within visible range
        bcc player_done
        lda #24         ; Wrap to left side
        sta player_x
player_done:
        rts

update_enemies:
        ; Update enemy 1 (smooth sine wave)
        lda enemy1_active
        beq skip_enemy1
        
        ; Horizontal movement
        dec enemy1_x
        lda enemy1_x
        cmp #24
        bcs enemy1_vert
        lda #250
        sta enemy1_x
        
enemy1_vert:
        ; Vertical sine wave
        ldx enemy1_x
        lda sine_table,x
        lsr             ; Scale down
        lsr
        clc
        adc #140        ; Center position
        sta enemy1_y
skip_enemy1:
        
        ; Update enemy 2 (smooth tracking)
        lda enemy2_active
        beq skip_enemy2
        
        ; Smooth horizontal movement
        inc enemy2_subpixel
        lda enemy2_subpixel
        and #$03
        sta enemy2_subpixel
        bne skip_enemy2_x
        
        dec enemy2_x
        lda enemy2_x
        cmp #24
        bcs enemy2_track
        lda #250
        sta enemy2_x
        
enemy2_track:
        ; Smooth Y tracking
        lda player_y
        cmp enemy2_y
        beq skip_enemy2_x
        bcc enemy2_up
        inc enemy2_y
        jmp skip_enemy2_x
enemy2_up:
        dec enemy2_y
skip_enemy2_x:
skip_enemy2:
        
        ; Update enemy 3 (smooth fast movement)
        lda enemy3_active
        beq skip_enemy3
        
        lda enemy3_x
        sec
        sbc #3          ; Move 3 pixels
        sta enemy3_x
        
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
        
        ; Update enemy positions with smooth animation
        lda enemy1_x
        sta SPRITE1_X
        lda enemy1_y
        sta SPRITE1_Y
        
        lda enemy2_x
        sta SPRITE2_X
        lda enemy2_y
        sta SPRITE2_Y
        
        lda enemy3_x
        sta SPRITE3_X
        lda enemy3_y
        sta SPRITE3_Y
        
        ; Clear X position high bits
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
        
        ; Clear collision register
        lda SPRITE_COLLISION
        
no_collision:
        rts

handle_collision:
        lda #30         ; Stop movement for 30 frames
        sta collision_flag
        
        ; Increment hit counter
        inc total_hits
        
        ; Find which enemy hit the player and respawn it
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
        ; Disable interrupts
        sei
        
        ; Restore default IRQ
        lda #$31
        sta $0314
        lda #$ea
        sta $0315
        
        ; Game over sequence
        ldx #3
flash_loop:
        lda #$07        ; Yellow
        sta $d020
        jsr short_delay
        lda #$02        ; Red
        sta $d020
        jsr short_delay
        dex
        bne flash_loop
        
        ; Display GAME OVER message
        ldx #0
game_over_msg_loop:
        lda game_over_text,x
        beq game_over_done
        sta $0400+520,x
        lda #$01
        sta $d800+520,x
        inx
        jmp game_over_msg_loop
game_over_done:
        
        ; Infinite loop
stop_loop:
        jmp stop_loop

short_delay:
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
        pla
        tax
        rts

; ================================================================
; DISPLAY SUBROUTINES
; ================================================================
display_ui:
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
; SPRITE DATA - Animation frames
; ================================================================
player_frame0:
        ; Normal star
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
        !byte 0

player_frame1:
        ; Rotating star
        !byte %00000001,%10000000,%00000000
        !byte %00000011,%11000000,%00000000
        !byte %00000111,%11100000,%00000000
        !byte %00001111,%11110000,%00000000
        !byte %00011111,%11111000,%00000000
        !byte %00111111,%11111100,%00000000
        !byte %01111111,%11111110,%00000000
        !byte %11111111,%11111111,%00000000
        !byte %11111111,%11111111,%10000000
        !byte %01111111,%11111111,%11000000
        !byte %00111111,%11111111,%11100000
        !byte %00011111,%11111111,%11110000
        !byte %00001111,%11111111,%11111000
        !byte %00000111,%11111111,%11111100
        !byte %00000011,%11111111,%11111110
        !byte %00000001,%11111111,%11111111
        !byte %00000000,%11111111,%11111110
        !byte %00000000,%01111111,%11111100
        !byte %00000000,%00111111,%11111000
        !byte %00000000,%00011111,%11110000
        !byte %00000000,%00001111,%11100000
        !byte 0

player_frame2:
        ; Pulsing star
        !byte %00000000,%00000000,%00000000
        !byte %00000000,%00011000,%00000000
        !byte %00000000,%00111100,%00000000
        !byte %00000000,%01111110,%00000000
        !byte %00000001,%11111111,%10000000
        !byte %00000011,%11111111,%11000000
        !byte %00000111,%11111111,%11100000
        !byte %00001111,%11111111,%11110000
        !byte %00011111,%11111111,%11111000
        !byte %00111111,%11111111,%11111100
        !byte %01111111,%11111111,%11111110
        !byte %00111111,%11111111,%11111100
        !byte %00011111,%11111111,%11111000
        !byte %00001111,%11111111,%11110000
        !byte %00000111,%11111111,%11100000
        !byte %00000011,%11111111,%11000000
        !byte %00000001,%11111111,%10000000
        !byte %00000000,%01111110,%00000000
        !byte %00000000,%00111100,%00000000
        !byte %00000000,%00011000,%00000000
        !byte %00000000,%00000000,%00000000
        !byte 0

enemy_frame0:
        ; Solid block
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
        !byte 0

enemy_frame1:
        ; Hollow block
        !byte %11111111,%11111111,%11111111
        !byte %10000000,%00000000,%00000001
        !byte %10111111,%11111111,%11111101
        !byte %10100000,%00000000,%00000101
        !byte %10101111,%11111111,%11110101
        !byte %10101000,%00000000,%00010101
        !byte %10101011,%11111111,%11010101
        !byte %10101010,%00000000,%01010101
        !byte %10101010,%11111111,%01010101
        !byte %10101010,%10000001,%01010101
        !byte %10101010,%10111101,%01010101
        !byte %10101010,%10100101,%01010101
        !byte %10101010,%10100101,%01010101
        !byte %10101010,%10111101,%01010101
        !byte %10101010,%10000001,%01010101
        !byte %10101010,%11111111,%01010101
        !byte %10101010,%00000000,%01010101
        !byte %10101011,%11111111,%11010101
        !byte %10101000,%00000000,%00010101
        !byte %10101111,%11111111,%11110101
        !byte %10100000,%00000000,%00000101
        !byte 0

enemy_frame2:
        ; Pattern block
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte %01010101,%01010101,%01010101
        !byte %10101010,%10101010,%10101010
        !byte 0

; ================================================================
; DATA TABLES
; ================================================================
sine_table:
        ; 256-byte sine table for smooth wave motion
        !byte 128,131,134,137,140,143,146,149,152,156,159,162,165,168,171,174
        !byte 176,179,182,185,188,191,193,196,199,201,204,206,209,211,213,216
        !byte 218,220,222,224,226,228,230,232,234,235,237,238,240,241,243,244
        !byte 245,246,248,249,250,250,251,252,253,253,254,254,254,255,255,255
        !byte 255,255,255,255,254,254,254,253,253,252,251,250,250,249,248,246
        !byte 245,244,243,241,240,238,237,235,234,232,230,228,226,224,222,220
        !byte 218,216,213,211,209,206,204,201,199,196,193,191,188,185,182,179
        !byte 176,174,171,168,165,162,159,156,152,149,146,143,140,137,134,131
        !byte 128,124,121,118,115,112,109,106,103,99,96,93,90,87,84,81
        !byte 79,76,73,70,67,64,62,59,56,54,51,49,46,44,42,39
        !byte 37,35,33,31,29,27,25,23,21,20,18,17,15,14,12,11
        !byte 10,9,7,6,5,5,4,3,2,2,1,1,1,0,0,0
        !byte 0,0,0,0,1,1,1,2,2,3,4,5,5,6,7,9
        !byte 10,11,12,14,15,17,18,20,21,23,25,27,29,31,33,35
        !byte 37,39,42,44,46,49,51,54,56,59,62,64,67,70,73,76
        !byte 79,81,84,87,90,93,96,99,103,106,109,112,115,118,121,124

; ================================================================
; TEXT DATA
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
player_x:           !byte 0
player_y:           !byte 0
player_subpixel:    !byte 0
enemy1_x:           !byte 0
enemy1_y:           !byte 0
enemy1_active:      !byte 0
enemy2_x:           !byte 0
enemy2_y:           !byte 0
enemy2_active:      !byte 0
enemy2_subpixel:    !byte 0
enemy3_x:           !byte 0
enemy3_y:           !byte 0
enemy3_active:      !byte 0
score:              !byte 0
level:              !byte 1
frame_counter:      !byte 0
lives:              !byte 3
collision_flag:     !byte 0
total_hits:         !byte 0
anim_frame:         !byte 0
anim_timer:         !byte 0
smooth_update:      !byte 0