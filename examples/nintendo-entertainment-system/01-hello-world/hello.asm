; NES - Hello World Example
; Displays text on screen using background tiles
;
; Learning objectives:
; - NES memory map and PPU registers
; - Pattern table and nametable organization
; - Palette setup
; - Basic PPU programming

.segment "HEADER"
    .byte "NES", $1a     ; iNES header identifier
    .byte 2              ; 2x 16KB PRG-ROM banks
    .byte 1              ; 1x 8KB CHR-ROM bank
    .byte $00, $00       ; Mapper 0, no special flags
    .byte 0,0,0,0,0,0,0  ; Filler

.segment "ZEROPAGE"
    temp: .res 1
    
.segment "CODE"

; PPU registers
PPUCTRL   = $2000
PPUMASK   = $2001
PPUSTATUS = $2002
PPUADDR   = $2006
PPUDATA   = $2007

; Reset handler
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

    ; First wait for vblank
vblankwait1:
    bit PPUSTATUS
    bpl vblankwait1

    ; Clear memory
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
    sta $0200, x     ; Move sprites off screen
    inx
    bne clearmem
    
    ; Second wait for vblank
vblankwait2:
    bit PPUSTATUS
    bpl vblankwait2

    ; Load palettes
    lda PPUSTATUS    ; Reset latch
    lda #$3F
    sta PPUADDR
    lda #$00
    sta PPUADDR      ; Set PPU address to $3F00
    
    ldx #$00
loadpalettes:
    lda palette_data, x
    sta PPUDATA
    inx
    cpx #32
    bne loadpalettes

    ; Write "HELLO NES!" to nametable
    lda PPUSTATUS    ; Reset latch
    lda #$21         ; Nametable address $21CA
    sta PPUADDR
    lda #$CA         ; Middle of screen
    sta PPUADDR
    
    ldx #$00
loadtext:
    lda hello_text, x
    sta PPUDATA
    inx
    cpx #10          ; Length of text
    bne loadtext
    
    ; Enable rendering
    lda #%10010000   ; Enable NMI, sprites use pattern table 0
    sta PPUCTRL
    lda #%00011110   ; Enable sprites and background
    sta PPUMASK
    
forever:
    jmp forever      ; Infinite loop

; NMI handler
nmi:
    rti

; Palette data
palette_data:
    ; Background palette
    .byte $0F,$30,$10,$00  ; Black, white, gray, black
    .byte $0F,$30,$10,$00
    .byte $0F,$30,$10,$00
    .byte $0F,$30,$10,$00
    ; Sprite palette
    .byte $0F,$16,$27,$36  ; Black, red, orange, yellow
    .byte $0F,$16,$27,$36
    .byte $0F,$16,$27,$36
    .byte $0F,$16,$27,$36

; Text to display (tile numbers)
; Using ASCII-like mapping in CHR-ROM
hello_text:
    .byte $08,$05,$0C,$0C,$0F  ; HELLO
    .byte $00                   ; Space
    .byte $0E,$05,$13,$01       ; NES!

.segment "VECTORS"
    .word nmi        ; NMI vector
    .word reset      ; Reset vector
    .word 0          ; IRQ vector

.segment "CHARS"
    ; Include character/tile data
    ; Simple font (partial ASCII)
    .incbin "font.chr"