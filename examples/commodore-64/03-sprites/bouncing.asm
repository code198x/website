; Commodore 64 - Bouncing Sprite Example
; Demonstrates sprite handling and animation
;
; Learning objectives:
; - Sprite initialization and positioning
; - Sprite data definition
; - Simple physics simulation
; - VIC-II sprite registers

; VIC-II sprite registers
SPRITE_ENABLE    = $D015
SPRITE_X_POS     = $D000
SPRITE_Y_POS     = $D001
SPRITE_X_MSB     = $D010
SPRITE_COLOR     = $D027
SPRITE_POINTER   = $07F8

; Zero page variables
XPOS_LO          = $FB
XPOS_HI          = $FC
YPOS             = $FD
XVEL             = $FE
YVEL             = $FF

*=$0801             ; BASIC start address

; BASIC stub: 10 SYS 2061
.byte $0c,$08,$0a,$00,$9e,$20,$32,$30,$36,$31,$00,$00,$00

*=$080d             ; Start of ML program

start:
    ; Clear screen
    lda #147
    jsr $FFD2
    
    ; Initialize sprite
    lda #1              ; Enable sprite 0
    sta SPRITE_ENABLE
    
    ; Set sprite color to white
    lda #1
    sta SPRITE_COLOR
    
    ; Set sprite pointer (sprite data at $2000)
    lda #$80            ; $2000 / 64 = $80
    sta SPRITE_POINTER
    
    ; Initialize position
    lda #100            ; X position low byte
    sta XPOS_LO
    lda #0              ; X position high bit
    sta XPOS_HI
    lda #100            ; Y position
    sta YPOS
    
    ; Initialize velocity
    lda #2              ; X velocity
    sta XVEL
    lda #3              ; Y velocity  
    sta YVEL

main_loop:
    ; Wait for raster line 255
    lda #255
wait_raster:
    cmp $D012
    bne wait_raster
    
    ; Update X position
    lda XVEL
    bmi move_left       ; If negative, move left
    
move_right:
    ; Add to X position
    clc
    lda XPOS_LO
    adc XVEL
    sta XPOS_LO
    bcc check_x_bounds
    ; Carry set, increment high bit
    lda XPOS_HI
    eor #1
    sta XPOS_HI
    jmp check_x_bounds
    
move_left:
    ; Subtract from X position
    sec
    lda XPOS_LO
    sbc #2              ; abs(XVEL)
    sta XPOS_LO
    bcs check_x_bounds
    ; Carry clear, decrement high bit
    lda XPOS_HI
    eor #1
    sta XPOS_HI
    
check_x_bounds:
    ; Check right boundary (320)
    lda XPOS_HI
    beq check_left
    lda XPOS_LO
    cmp #64             ; 320 - 256 = 64
    bcc update_y
    ; Hit right edge, reverse
    lda #$FE            ; -2
    sta XVEL
    jmp update_y
    
check_left:
    ; Check left boundary (24)
    lda XPOS_LO
    cmp #24
    bcs update_y
    ; Hit left edge, reverse
    lda #2
    sta XVEL
    
update_y:
    ; Update Y position
    clc
    lda YPOS
    adc YVEL
    sta YPOS
    
    ; Check Y bounds (50-229)
    cmp #229
    bcc check_top
    ; Hit bottom, reverse
    lda #$FD            ; -3
    sta YVEL
    jmp update_sprite
    
check_top:
    cmp #50
    bcs update_sprite
    ; Hit top, reverse
    lda #3
    sta YVEL
    
update_sprite:
    ; Update sprite position registers
    lda XPOS_LO
    sta SPRITE_X_POS
    lda YPOS
    sta SPRITE_Y_POS
    
    ; Update X MSB
    lda SPRITE_X_MSB
    and #$FE            ; Clear sprite 0 bit
    ora XPOS_HI         ; Set if needed
    sta SPRITE_X_MSB
    
    jmp main_loop

; Sprite data (ball shape) at $2000
*=$2000
sprite_data:
    .byte %00000000,%00111100,%00000000
    .byte %00000000,%11111111,%00000000
    .byte %00000001,%11111111,%10000000
    .byte %00000011,%11111111,%11000000
    .byte %00000111,%11111111,%11100000
    .byte %00001111,%11111111,%11110000
    .byte %00001111,%11111111,%11110000
    .byte %00011111,%11111111,%11111000
    .byte %00011111,%11111111,%11111000
    .byte %00011111,%11111111,%11111000
    .byte %00011111,%11111111,%11111000
    .byte %00011111,%11111111,%11111000
    .byte %00011111,%11111111,%11111000
    .byte %00001111,%11111111,%11110000
    .byte %00001111,%11111111,%11110000
    .byte %00000111,%11111111,%11100000
    .byte %00000011,%11111111,%11000000
    .byte %00000001,%11111111,%10000000
    .byte %00000000,%11111111,%00000000
    .byte %00000000,%00111100,%00000000
    .byte %00000000,%00000000,%00000000
    .byte 0 ; Padding byte