; NES - Sprite Example (Simple Mario)
; Demonstrates sprite handling and animation
;
; Learning objectives:
; - OAM (Object Attribute Memory) management
; - Sprite positioning and attributes
; - Simple animation states
; - DMA transfers

.segment "HEADER"
    .byte "NES", $1a
    .byte 2              ; 2x 16KB PRG
    .byte 1              ; 1x 8KB CHR
    .byte $01, $00       ; Mapper 0, vertical mirroring
    .byte 0,0,0,0,0,0,0

.segment "ZEROPAGE"
    mario_x:      .res 1
    mario_y:      .res 1
    mario_dir:    .res 1  ; 0=right, 1=left
    frame_count:  .res 1
    anim_frame:   .res 1

.segment "BSS"
    ; OAM buffer in RAM
    oam_buffer:   .res 256

.segment "CODE"

; Constants
PPUCTRL   = $2000
PPUMASK   = $2001
PPUSTATUS = $2002
OAMADDR   = $2003
OAMDATA   = $2004
PPUSCROLL = $2005
PPUADDR   = $2006
PPUDATA   = $2007
OAMDMA    = $4014

; Mario constants
MARIO_Y   = 120
MARIO_SPEED = 2

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
    inx
    bne clearmem

    ; Clear OAM buffer
    ldx #$00
    lda #$FE
clear_oam:
    sta oam_buffer, x
    inx
    bne clear_oam

vblankwait2:
    bit PPUSTATUS
    bpl vblankwait2

    ; Load palettes
    lda PPUSTATUS
    lda #$3F
    sta PPUADDR
    lda #$00
    sta PPUADDR
    
    ldx #$00
load_palettes:
    lda palette_data, x
    sta PPUDATA
    inx
    cpx #32
    bne load_palettes

    ; Initialize Mario
    lda #120
    sta mario_x
    lda #MARIO_Y
    sta mario_y
    lda #0
    sta mario_dir
    sta frame_count
    sta anim_frame

    ; Clear background
    lda PPUSTATUS
    lda #$20
    sta PPUADDR
    lda #$00
    sta PPUADDR
    lda #$00         ; Blank tile
    ldx #$00
    ldy #$04
clear_bg:
    sta PPUDATA
    inx
    bne clear_bg
    dey
    bne clear_bg

    ; Enable rendering
    lda #%10010000   ; NMI enable
    sta PPUCTRL
    lda #%00011110   ; Show sprites and background
    sta PPUMASK

forever:
    jmp forever

nmi:
    ; Save registers
    pha
    txa
    pha
    tya
    pha

    ; Transfer OAM buffer
    lda #$00
    sta OAMADDR
    lda #>oam_buffer  ; High byte of buffer
    sta OAMDMA        ; Start DMA transfer

    ; Reset scroll
    lda #$00
    sta PPUSCROLL
    sta PPUSCROLL

    ; Update animation
    inc frame_count
    lda frame_count
    and #$0F         ; Every 16 frames
    bne skip_anim
    
    lda anim_frame
    eor #$01         ; Toggle between 0 and 1
    sta anim_frame

skip_anim:
    ; Move Mario
    lda mario_dir
    beq move_right
    
move_left:
    lda mario_x
    sec
    sbc #MARIO_SPEED
    cmp #8           ; Left boundary
    bcs store_x
    lda #8
    sta mario_x
    lda #0           ; Change direction
    sta mario_dir
    jmp update_sprites
    
move_right:
    lda mario_x
    clc
    adc #MARIO_SPEED
    cmp #240         ; Right boundary
    bcc store_x
    lda #240
    sta mario_x
    lda #1           ; Change direction
    sta mario_dir
    jmp update_sprites
    
store_x:
    sta mario_x

update_sprites:
    ; Update Mario sprite (2x2 tiles)
    ; Top-left
    lda mario_y
    sta oam_buffer+0
    lda anim_frame
    asl
    asl              ; *4 for tile offset
    clc
    adc #$00         ; Base tile
    sta oam_buffer+1
    lda mario_dir
    asl
    asl
    asl
    asl
    asl
    asl
    asl              ; Bit 7 = horizontal flip
    sta oam_buffer+2
    lda mario_x
    sta oam_buffer+3
    
    ; Top-right
    lda mario_y
    sta oam_buffer+4
    lda anim_frame
    asl
    asl
    clc
    adc #$01
    sta oam_buffer+5
    lda mario_dir
    asl
    asl
    asl
    asl
    asl
    asl
    asl
    sta oam_buffer+6
    lda mario_x
    clc
    adc #8
    sta oam_buffer+7
    
    ; Bottom-left
    lda mario_y
    clc
    adc #8
    sta oam_buffer+8
    lda anim_frame
    asl
    asl
    clc
    adc #$02
    sta oam_buffer+9
    lda mario_dir
    asl
    asl
    asl
    asl
    asl
    asl
    asl
    sta oam_buffer+10
    lda mario_x
    sta oam_buffer+11
    
    ; Bottom-right
    lda mario_y
    clc
    adc #8
    sta oam_buffer+12
    lda anim_frame
    asl
    asl
    clc
    adc #$03
    sta oam_buffer+13
    lda mario_dir
    asl
    asl
    asl
    asl
    asl
    asl
    asl
    sta oam_buffer+14
    lda mario_x
    clc
    adc #8
    sta oam_buffer+15

    ; Restore registers
    pla
    tay
    pla
    tax
    pla
    rti

palette_data:
    ; Background
    .byte $0F,$27,$17,$07  ; Sky colors
    .byte $0F,$27,$17,$07
    .byte $0F,$27,$17,$07
    .byte $0F,$27,$17,$07
    ; Sprites
    .byte $0F,$16,$27,$30  ; Mario colors
    .byte $0F,$16,$27,$30
    .byte $0F,$16,$27,$30
    .byte $0F,$16,$27,$30

.segment "VECTORS"
    .word nmi
    .word reset
    .word 0

.segment "CHARS"
    ; Mario sprite tiles (simplified)
    ; Frame 1 - Standing
    ; Top-left
    .byte %00000111
    .byte %00001111
    .byte %00001101
    .byte %00011111
    .byte %00011111
    .byte %00010111
    .byte %00001110
    .byte %00001110
    .byte %00000000
    .byte %00000000
    .byte %00000010
    .byte %00000000
    .byte %00000000
    .byte %00001000
    .byte %00000001
    .byte %00000000
    
    ; Top-right
    .byte %11100000
    .byte %11110000
    .byte %10110000
    .byte %11111000
    .byte %11111000
    .byte %11101000
    .byte %01110000
    .byte %01110000
    .byte %00000000
    .byte %00000000
    .byte %01000000
    .byte %00000000
    .byte %00000000
    .byte %00010000
    .byte %10000000
    .byte %00000000
    
    ; Bottom-left
    .byte %00011100
    .byte %00111110
    .byte %01111111
    .byte %01111111
    .byte %01111111
    .byte %00111110
    .byte %00011100
    .byte %00011100
    .byte %00000000
    .byte %00000001
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    
    ; Bottom-right
    .byte %00111000
    .byte %01111100
    .byte %11111110
    .byte %11111110
    .byte %11111110
    .byte %01111100
    .byte %00111000
    .byte %00111000
    .byte %00000000
    .byte %10000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    
    ; Frame 2 - Walking (simplified, reuse some tiles)
    .res 64, $00
    
    ; Fill rest
    .res 8192-128, $00