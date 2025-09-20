# Create a simple sprite demo (sprite.asm)
cat > sprite.asm << 'EOF'
; C64 Sprite Demo
!to "sprite.prg", cbm

*=$0801
!byte $0c,$08,$0a,$00,$9e,$20
!byte $32,$30,$36,$34,$00,$00,$00

*=$0810
        ; Enable sprite 0
        lda #$01
        sta $d015

        ; Set sprite 0 position
        lda #$80
        sta $d000       ; X position
        lda #$80
        sta $d001       ; Y position

        ; Set sprite 0 color
        lda #$01        ; White
        sta $d027

        ; Set sprite 0 pointer
        lda #$80
        sta $07f8

        ; Create sprite data at $2000
        ldx #$00
loop:   lda sprite_data,x
        sta $2000,x
        inx
        cpx #63
        bne loop

        ; Infinite loop
done:   jmp done

sprite_data:
        !byte %00000000,%01111110,%00000000
        !byte %00000001,%11111111,%10000000
        !byte %00000011,%11111111,%11000000
        !byte %00000111,%11111111,%11100000
        !byte %00001111,%11111111,%11110000
        !byte %00011111,%11111111,%11111000
        !byte %00111111,%11111111,%11111100
        !byte %01111111,%11111111,%11111110
        !byte %01111111,%11111111,%11111110
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %11111111,%11111111,%11111111
        !byte %01111111,%11111111,%11111110
        !byte %01111111,%11111111,%11111110
        !byte %00111111,%11111111,%11111100
        !byte %00011111,%11111111,%11111000
        !byte %00001111,%11111111,%11110000
        !byte %00000111,%11111111,%11100000
        !byte %00000011,%11111111,%11000000
        !byte %00000001,%11111111,%10000000
EOF