; ================================================================
; NEON NEXUS - LESSON 16: Optimized Screen Updates
; Double buffering and efficient screen clearing
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

; Screen memory banks
SCREEN_RAM = $0400
COLOR_RAM = $d800

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
        
        ; Clear screen efficiently
        jsr fast_clear_screen
        
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
        sta screen_dirty
        lda #1
        sta level
        lda #3
        sta lives
        
        ; Initialize effects
        lda #0
        sta particle_count
        ldx #0
clear_particles:
        sta particle_x,x
        sta particle_y,x
        sta particle_life,x
        inx
        cpx #8
        bne clear_particles
        
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
        
        ; Set raster interrupt line (top of screen)
        lda #50
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
        
        ; Set flag for main loop
        inc vblank_flag
        
        ; Update particle effects during vblank
        jsr update_particles
        
        ; Call original IRQ handler
        jmp $ea31

fast_clear_screen:
        ; Unrolled loop for speed
        lda #32         ; Space character
        ldx #0
clear_page1:
        sta SCREEN_RAM,x
        sta SCREEN_RAM+256,x
        sta SCREEN_RAM+512,x
        sta SCREEN_RAM+768-40,x  ; Don't clear last line (UI)
        inx
        bne clear_page1
        
        ; Clear color RAM
        lda #$00        ; Black
        ldx #0
clear_color:
        sta COLOR_RAM,x
        sta COLOR_RAM+256,x
        sta COLOR_RAM+512,x
        sta COLOR_RAM+768-40,x
        inx
        bne clear_color
        
        rts

init_sprites:
        ; Create player animation frames at $0340, $0380, $03C0
        ldx #0
init_player_frames:
        lda player_frame0,x
        sta $0340,x
        lda player_frame1,x
        sta $0380,x
        lda player_frame2,x
        sta $03C0,x
        inx
        cpx #63
        bne init_player_frames
        
        ; Create enemy animation frames at $0400, $0440, $0480
        ldx #0
init_enemy_frames:
        lda enemy_frame0,x
        sta $0400,x
        lda enemy_frame1,x
        sta $0440,x
        lda enemy_frame2,x
        sta $0480,x
        inx
        cpx #63
        bne init_enemy_frames
        
        rts

game_loop:
        ; Wait for vblank
        lda vblank_flag
        beq game_loop
        lda #0
        sta vblank_flag
        
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
        inc screen_dirty     ; Flag UI update needed
        
        ; Check for level up
        lda score
        and #$0f
        bne skip_level
        lda score
        beq skip_level
        inc level
        inc screen_dirty
        
skip_level:
skip_score:
        ; Only update display if needed
        lda screen_dirty
        beq skip_display
        jsr display_score
        jsr display_level
        jsr display_lives
        jsr display_hits
        lda #0
        sta screen_dirty
skip_display:
        
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
        
        ; Update enemy positions
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

update_particles:
        ; Update each particle
        ldx #0
particle_loop:
        lda particle_life,x
        beq next_particle
        
        ; Decay life
        dec particle_life,x
        
        ; Update position (simple fall)
        inc particle_y,x
        
        ; Draw particle at old position (erase)
        ldy particle_old_pos,x
        lda #32         ; Space
        sta SCREEN_RAM,y
        
        ; Calculate new screen position
        lda particle_y,x
        lsr
        lsr
        lsr             ; Divide by 8 for character row
        tay
        lda row_lo,y
        clc
        adc particle_x,x
        sta particle_old_pos,x
        tay
        lda row_hi,y
        sta particle_old_pos+1,x
        
        ; Draw particle at new position
        lda particle_life,x
        cmp #5
        bcc dim_particle
        lda #$2a        ; Star
        jmp draw_particle
dim_particle:
        lda #$2e        ; Period
draw_particle:
        ldy particle_old_pos,x
        sta SCREEN_RAM,y
        
next_particle:
        inx
        cpx #8
        bne particle_loop
        rts

spawn_particles:
        ; Spawn explosion particles at collision point
        ldx #0
find_free:
        lda particle_life,x
        beq found_free
        inx
        cpx #8
        bne find_free
        rts             ; No free particles
        
found_free:
        ; Set particle properties
        lda player_x
        lsr
        lsr
        lsr             ; Convert to character position
        sta particle_x,x
        lda player_y
        sta particle_y,x
        lda #15         ; Lifetime
        sta particle_life,x
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
        inc screen_dirty    ; Flag UI update
        
        ; Spawn particle effects
        jsr spawn_particles
        
        ; Find which enemy hit and respawn it
        ; Read collision register first to get accurate data
        lda SPRITE_COLLISION
        sta temp_collision
        
        ; Check enemy 1
        and #%00000010  ; Enemy 1?
        beq check_enemy2_hit
        lda #250
        sta enemy1_x
        jmp collision_continue
        
check_enemy2_hit:
        lda temp_collision
        and #%00000100  ; Enemy 2?
        beq check_enemy3_hit
        lda #250
        sta enemy2_x
        jmp collision_continue
        
check_enemy3_hit:
        lda temp_collision
        and #%00001000  ; Enemy 3?
        beq collision_continue
        lda #250
        sta enemy3_x
        
collision_continue:
        dec lives
        inc screen_dirty    ; Flag UI update
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
        sta $0400+960,x     ; Bottom line
        lda #$01
        sta $d800+960,x
        inx
        jmp score_label_loop
score_done:
        
        ldx #0
level_label_loop:
        lda level_text,x
        beq level_done
        sta $0400+970,x
        lda #$01
        sta $d800+970,x
        inx
        jmp level_label_loop
level_done:
        
        ldx #0
lives_label_loop:
        lda lives_text,x
        beq lives_done
        sta $0400+980,x
        lda #$01
        sta $d800+980,x
        inx
        jmp lives_label_loop
lives_done:
        
        ldx #0
hits_label_loop:
        lda hits_text,x
        beq hits_done
        sta $0400+990,x
        lda #$01
        sta $d800+990,x
        inx
        jmp hits_label_loop
hits_done:
        rts

display_score:
        lda score
        and #$0f
        clc
        adc #$30
        sta $0400+966
        lda #$07        ; Yellow
        sta $d800+966
        rts

display_level:
        lda level
        and #$0f
        clc
        adc #$30
        sta $0400+976
        lda #$05        ; Green
        sta $d800+976
        rts

display_lives:
        lda lives
        and #$0f
        clc
        adc #$30
        sta $0400+986
        lda #$02        ; Red
        sta $d800+986
        rts

display_hits:
        lda total_hits
        and #$0f
        clc
        adc #$30
        sta $0400+995
        lda #$03        ; Cyan
        sta $d800+995
        rts

; ================================================================
; SPRITE DATA - Animation frames
; ================================================================
player_frame0:
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

; Row lookup tables for fast screen position calculation
row_lo:
        !byte <(SCREEN_RAM+0), <(SCREEN_RAM+40), <(SCREEN_RAM+80), <(SCREEN_RAM+120)
        !byte <(SCREEN_RAM+160), <(SCREEN_RAM+200), <(SCREEN_RAM+240), <(SCREEN_RAM+280)
        !byte <(SCREEN_RAM+320), <(SCREEN_RAM+360), <(SCREEN_RAM+400), <(SCREEN_RAM+440)
        !byte <(SCREEN_RAM+480), <(SCREEN_RAM+520), <(SCREEN_RAM+560), <(SCREEN_RAM+600)
        !byte <(SCREEN_RAM+640), <(SCREEN_RAM+680), <(SCREEN_RAM+720), <(SCREEN_RAM+760)
        !byte <(SCREEN_RAM+800), <(SCREEN_RAM+840), <(SCREEN_RAM+880), <(SCREEN_RAM+920)
        !byte <(SCREEN_RAM+960)

row_hi:
        !byte >(SCREEN_RAM+0), >(SCREEN_RAM+40), >(SCREEN_RAM+80), >(SCREEN_RAM+120)
        !byte >(SCREEN_RAM+160), >(SCREEN_RAM+200), >(SCREEN_RAM+240), >(SCREEN_RAM+280)
        !byte >(SCREEN_RAM+320), >(SCREEN_RAM+360), >(SCREEN_RAM+400), >(SCREEN_RAM+440)
        !byte >(SCREEN_RAM+480), >(SCREEN_RAM+520), >(SCREEN_RAM+560), >(SCREEN_RAM+600)
        !byte >(SCREEN_RAM+640), >(SCREEN_RAM+680), >(SCREEN_RAM+720), >(SCREEN_RAM+760)
        !byte >(SCREEN_RAM+800), >(SCREEN_RAM+840), >(SCREEN_RAM+880), >(SCREEN_RAM+920)
        !byte >(SCREEN_RAM+960)

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
vblank_flag:        !byte 0
screen_dirty:       !byte 0

; Particle system variables
particle_count:     !byte 0
particle_x:         !fill 8, 0
particle_y:         !fill 8, 0
particle_life:      !fill 8, 0
particle_old_pos:   !fill 16, 0  ; Word array for screen positions
temp_collision:     !byte 0