; C64 Flashing Border Demo
; Build: acme -o demo.prg demo.asm

!to "demo.prg", cbm    ; Output format

; BASIC stub: 10 SYS 2064
*=$0801
!byte $0c,$08,$0a,$00,$9e,$20
!byte $32,$30,$36,$34,$00,$00,$00

; Main program starts at $0810
*=$0810
        sei             ; Disable interrupts

loop:   ldx $d012       ; Wait for raster line
        cpx #$ff
        bne loop

        inc $d020       ; Increment border color

        ldx #$02        ; Small delay
delay:  dex
        bne delay

        jmp loop        ; Infinite loop