; NES - Controller Input Example
; Demonstrates reading controller input and responding to buttons
;
; Learning objectives:
; - Controller port registers
; - Button reading sequence
; - Input handling patterns
; - Game state management

.segment "HEADER"
    .byte "NES", $1a
    .byte 2
    .byte 1
    .byte $00, $00
    .byte 0,0,0,0,0,0,0

.segment "ZEROPAGE"
    player_x:     .res 1
    player_y:     .res 1
    buttons:      .res 1  ; Current frame buttons
    buttons_last: .res 1  ; Previous frame buttons
    buttons_new:  .res 1  ; Newly pressed this frame

.segment "CODE"

; PPU registers
PPUCTRL   = $2000
PPUMASK   = $2001
PPUSTATUS = $2002
OAMADDR   = $2003
PPUADDR   = $2006
PPUDATA   = $2007
OAMDMA    = $4014

; Controller ports
CONTROLLER1 = $4016
CONTROLLER2 = $4017

; Button constants
BUTTON_A      = %10000000
BUTTON_B      = %01000000
BUTTON_SELECT = %00100000
BUTTON_START  = %00010000
BUTTON_UP     = %00001000
BUTTON_DOWN   = %00000100
BUTTON_LEFT   = %00000010
BUTTON_RIGHT  = %00000001

reset:
    sei
    cld
    ldx #$40
    stx $4017
    ldx #$FF
    txs
    inx
    stx PPUCTRL
    stx PPUMASK
    stx $4010

vblankwait1:
    bit PPUSTATUS
    bpl vblankwait1

clearmem:
    lda #$00
    sta $0000, x
    sta $0100, x
    sta $0300, x
    sta $0400, x
    sta $0500, x
    sta $0600, x
    sta $0700, x
    lda #$FE
    sta $0200, x
    inx
    bne clearmem

vblankwait2:
    bit PPUSTATUS
    bpl vblankwait2

    ; Load palette
    lda PPUSTATUS
    lda #$3F
    sta PPUADDR
    lda #$00
    sta PPUADDR
    
    ldx #$00
loadpal:
    lda palette, x
    sta PPUDATA
    inx
    cpx #32
    bne loadpal

    ; Initialize player position
    lda #128
    sta player_x
    sta player_y
    lda #0
    sta buttons
    sta buttons_last

    ; Draw instructions on screen
    lda PPUSTATUS
    lda #$20        ; Start at $2084
    sta PPUADDR
    lda #$84
    sta PPUADDR
    
    ldx #0
draw_text:
    lda text_data, x
    sta PPUDATA
    inx
    cpx #24
    bne draw_text

    ; Enable rendering
    lda #%10010000
    sta PPUCTRL
    lda #%00011110
    sta PPUMASK

gameloop:
    jsr wait_vblank
    jsr read_controller
    jsr handle_input
    jsr update_sprites
    jsr sprite_dma
    jmp gameloop

wait_vblank:
    lda PPUSTATUS
vblank_wait:
    bit PPUSTATUS
    bpl vblank_wait
    rts

read_controller:
    ; Save last frame's input
    lda buttons
    sta buttons_last
    
    ; Read controller
    lda #$01
    sta CONTROLLER1
    lda #$00
    sta CONTROLLER1     ; Latch buttons
    
    ldx #$08           ; Read 8 buttons
read_loop:
    lda CONTROLLER1
    lsr                ; Bit 0 into carry
    rol buttons        ; Carry into buttons
    dex
    bne read_loop
    
    ; Calculate newly pressed buttons
    lda buttons_last
    eor #$FF           ; Invert
    and buttons        ; AND with current
    sta buttons_new
    
    rts

handle_input:
    ; Check D-pad for movement
    lda buttons
    and #BUTTON_LEFT
    beq check_right
    dec player_x
    
check_right:
    lda buttons
    and #BUTTON_RIGHT
    beq check_up
    inc player_x
    
check_up:
    lda buttons
    and #BUTTON_UP
    beq check_down
    dec player_y
    
check_down:
    lda buttons
    and #BUTTON_DOWN
    beq check_a
    inc player_y
    
check_a:
    ; A button - change color (only on press)
    lda buttons_new
    and #BUTTON_A
    beq check_b
    ; Cycle sprite palette
    inc $0202          ; Sprite 0 attribute
    
check_b:
    ; B button - speed boost
    lda buttons
    and #BUTTON_B
    beq done_input
    ; Double movement speed
    lda buttons
    and #BUTTON_LEFT
    beq b_right
    dec player_x
b_right:
    lda buttons
    and #BUTTON_RIGHT
    beq b_up
    inc player_x
b_up:
    lda buttons
    and #BUTTON_UP
    beq b_down
    dec player_y
b_down:
    lda buttons
    and #BUTTON_DOWN
    beq done_input
    inc player_y
    
done_input:
    rts

update_sprites:
    ; Player sprite
    lda player_y
    sta $0200
    lda #$01           ; Tile number
    sta $0201
    ; Attribute already set
    lda player_x
    sta $0203
    
    ; Show button states as sprites
    ldx #0
    ldy #4             ; Start at sprite 1
button_display:
    lda buttons
    and button_masks, x
    beq button_off
    
    ; Button is on - show sprite
    lda #50
    sta $0200, y       ; Y position
    lda #$02           ; Filled square
    sta $0201, y
    lda #1             ; Red
    sta $0202, y
    txa
    asl
    asl
    asl
    asl                ; X * 16
    clc
    adc #32
    sta $0203, y       ; X position
    jmp next_button
    
button_off:
    ; Hide sprite
    lda #$FE
    sta $0200, y
    
next_button:
    iny
    iny
    iny
    iny
    inx
    cpx #8
    bne button_display
    
    rts

sprite_dma:
    lda #$00
    sta OAMADDR
    lda #$02           ; Sprites at $0200
    sta OAMDMA
    rts

; Data
palette:
    ; Background
    .byte $0F,$00,$10,$30
    .byte $0F,$00,$10,$30
    .byte $0F,$00,$10,$30
    .byte $0F,$00,$10,$30
    ; Sprites
    .byte $0F,$16,$27,$30  ; Red/Orange/White
    .byte $0F,$11,$21,$31  ; Blue
    .byte $0F,$19,$29,$39  ; Green
    .byte $0F,$15,$25,$35  ; Purple

text_data:
    ; "USE D-PAD A B"
    .byte $15,$13,$05,$00  ; USE
    .byte $04,$2D,$10,$01  ; D-PAD
    .byte $04,$00,$01,$00  ; A
    .byte $02,$00,$00,$00  ; B

button_masks:
    .byte BUTTON_A
    .byte BUTTON_B
    .byte BUTTON_SELECT
    .byte BUTTON_START
    .byte BUTTON_UP
    .byte BUTTON_DOWN
    .byte BUTTON_LEFT
    .byte BUTTON_RIGHT

.segment "VECTORS"
    .word wait_vblank  ; NMI
    .word reset
    .word 0

.segment "CHARS"
    ; Tile 0 - Blank
    .res 16, $00
    
    ; Tile 1 - Smiley face
    .byte %00111100
    .byte %01111110
    .byte %11011011
    .byte %11111111
    .byte %11111111
    .byte %11011011
    .byte %01100110
    .byte %00111100
    .res 8, $00
    
    ; Tile 2 - Filled square
    .byte %11111111
    .byte %11111111
    .byte %11111111
    .byte %11111111
    .byte %11111111
    .byte %11111111
    .byte %11111111
    .byte %11111111
    .res 8, $00
    
    ; Basic font for text (simplified)
    .res 8192-48, $00