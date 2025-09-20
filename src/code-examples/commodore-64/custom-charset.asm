; Custom charset example
        ; Point VIC to custom charset at $2000
        lda $d018
        and #$f0
        ora #$08        ; Charset at $2000
        sta $d018

        ; Copy and modify ROM charset
        sei
        lda #$33        ; Switch out BASIC and KERNAL
        sta $01

        ldx #$00
copy:   lda $d000,x     ; ROM charset
        sta $2000,x     ; Custom location
        lda $d100,x
        sta $2100,x
        lda $d200,x
        sta $2200,x
        lda $d300,x
        sta $2300,x
        inx
        bne copy

        lda #$37        ; Restore ROMs
        sta $01
        cli

        ; Modify character 'A' (8 bytes at $2000 + 65*8)
        ldx #$00
modify: lda custom_a,x
        sta $2000+65*8,x
        inx
        cpx #$08
        bne modify

custom_a:
        !byte %01111110
        !byte %11111111
        !byte %11000011
        !byte %11111111
        !byte %11111111
        !byte %11000011
        !byte %11000011
        !byte %11000011