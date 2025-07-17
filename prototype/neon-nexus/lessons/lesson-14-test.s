; Simple sprite test
*= $0801

; BASIC stub: 10 SYS 2064
!byte $0b,$08,$0a,$00,$9e,$32,$30,$36,$34,$00,$00,$00

*= $0810
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Set colors
        lda #$02        ; Red border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Create simple sprite data at $0340 (832)
        ldx #0
loop:   lda #$ff
        sta $0340,x
        inx
        cpx #63
        bne loop
        
        ; Set sprite pointer
        lda #13         ; $0340 / 64 = 13
        sta $07f8       ; Sprite 0 pointer
        
        ; Enable sprite 0
        lda #1
        sta $d015
        
        ; Set sprite color
        lda #1          ; White
        sta $d027
        
        ; Set sprite position
        lda #100
        sta $d000       ; X
        lda #100
        sta $d001       ; Y
        
        ; Infinite loop
done:   jmp done