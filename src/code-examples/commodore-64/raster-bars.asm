; Raster bars - the "Hello World" of C64 demos
!to "raster.prg", cbm

*=$0801
!byte $0c,$08,$0a,$00,$9e,$20,$32,$30,$36,$34,$00,$00,$00

*=$0810
        sei             ; Disable interrupts

        lda #$7f        ; Disable CIA interrupts
        sta $dc0d
        sta $dd0d

        lda #$01        ; Enable raster interrupt
        sta $d01a

        lda #$00        ; Set raster line
        sta $d012
        lda #$1b
        sta $d011

        lda #<irq       ; Set interrupt vector
        sta $0314
        lda #>irq
        sta $0315

        cli             ; Enable interrupts
        jmp *           ; Infinite loop

irq:    inc $d019       ; Acknowledge interrupt

        ldx #$00
loop:   lda colors,x
        sta $d020       ; Set border color
        sta $d021       ; Set background color

        ldy #$08        ; Delay for bar width
delay:  dey
        bne delay

        inx
        cpx #$10
        bne loop

        lda #$00        ; Reset colors
        sta $d020
        sta $d021

        jmp $ea31       ; Jump to KERNAL interrupt handler

colors: !byte $06,$0e,$03,$01,$03,$0e,$06,$00
        !byte $06,$0e,$03,$01,$03,$0e,$06,$00