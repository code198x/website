; NES - Palette Cycling Example
; Demonstrates PPU palette manipulation and color effects
;
; Learning objectives:
; - Understanding NES color palette
; - PPU timing and vblank updates
; - Creating visual effects with palettes
; - NMI-based animation

.segment "HEADER"
    .byte "NES", $1a     ; iNES header identifier
    .byte 2              ; 2x 16KB PRG-ROM banks
    .byte 1              ; 1x 8KB CHR-ROM bank
    .byte $00, $00       ; Mapper 0
    .byte 0,0,0,0,0,0,0  ; Filler

.segment "ZEROPAGE"
    frame_counter: .res 1
    palette_index: .res 1
    color_offset:  .res 1

.segment "CODE"

; PPU registers
PPUCTRL   = $2000
PPUMASK   = $2001
PPUSTATUS = $2002
PPUADDR   = $2006
PPUDATA   = $2007

reset:
    sei              ; Disable IRQs
    cld              ; Disable decimal mode
    ldx #$40
    stx $4017        ; Disable APU frame IRQ
    ldx #$FF
    txs              ; Set up stack
    inx              ; X = 0
    stx PPUCTRL      ; Disable NMI
    stx PPUMASK      ; Disable rendering
    stx $4010        ; Disable DMC IRQs

    ; Initialize variables
    stx frame_counter
    stx palette_index
    stx color_offset

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

    ; Fill nametable with pattern
    lda PPUSTATUS
    lda #$20
    sta PPUADDR
    lda #$00
    sta PPUADDR
    
    ; Fill with gradient pattern
    ldx #$00
    ldy #$00
fill_screen:
    txa
    and #$03         ; Use tiles 0-3
    sta PPUDATA
    inx
    bne fill_screen
    iny
    cpy #4           ; 4 pages = 1024 bytes
    bne fill_screen

    ; Initial palette
    jsr load_palette

    ; Enable rendering
    lda #%10010000   ; Enable NMI
    sta PPUCTRL
    lda #%00011110   ; Enable sprites and background
    sta PPUMASK

forever:
    jmp forever

; NMI handler - runs once per frame
nmi:
    ; Save registers
    pha
    txa
    pha
    tya
    pha

    ; Increment frame counter
    inc frame_counter
    lda frame_counter
    and #$07         ; Every 8 frames
    bne nmi_done
    
    ; Update palette
    jsr cycle_colors

nmi_done:
    ; Restore registers
    pla
    tay
    pla
    tax
    pla
    rti

; Load palette with cycling colors
load_palette:
    lda PPUSTATUS
    lda #$3F
    sta PPUADDR
    lda #$00
    sta PPUADDR
    
    ; Background palettes
    ldx #0
load_bg_pal:
    lda color_offset
    clc
    adc palette_cycle, x
    and #$3F         ; Keep in valid color range
    sta PPUDATA
    inx
    cpx #16
    bne load_bg_pal
    
    ; Sprite palettes (static)
    ldx #0
load_spr_pal:
    lda sprite_palette, x
    sta PPUDATA
    inx
    cpx #16
    bne load_spr_pal
    
    rts

; Cycle colors
cycle_colors:
    ; Increment color offset
    inc color_offset
    lda color_offset
    cmp #64
    bne update_pal
    lda #0
    sta color_offset
    
update_pal:
    jsr load_palette
    
    ; Reset scroll (palette writes can affect it)
    lda #0
    sta $2005
    sta $2005
    
    rts

; Palette cycle data
palette_cycle:
    ; Four background palettes with different hues
    .byte $0F,$01,$11,$21  ; Blues
    .byte $0F,$06,$16,$26  ; Reds
    .byte $0F,$09,$19,$29  ; Greens
    .byte $0F,$04,$14,$24  ; Purples

; Static sprite palette
sprite_palette:
    .byte $0F,$30,$10,$00  ; Grayscale
    .byte $0F,$30,$10,$00
    .byte $0F,$30,$10,$00
    .byte $0F,$30,$10,$00

.segment "VECTORS"
    .word nmi
    .word reset
    .word 0

.segment "CHARS"
    ; Pattern 0 - Solid
    .byte $FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF
    .byte $FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF
    
    ; Pattern 1 - Horizontal lines
    .byte $FF,$FF,$00,$00,$FF,$FF,$00,$00
    .byte $FF,$FF,$00,$00,$FF,$FF,$00,$00
    
    ; Pattern 2 - Vertical lines
    .byte $CC,$CC,$CC,$CC,$CC,$CC,$CC,$CC
    .byte $33,$33,$33,$33,$33,$33,$33,$33
    
    ; Pattern 3 - Checkerboard
    .byte $AA,$55,$AA,$55,$AA,$55,$AA,$55
    .byte $55,$AA,$55,$AA,$55,$AA,$55,$AA
    
    ; Fill rest with zeros
    .res 4096-64, $00