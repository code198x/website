; Neon Nexus - Lesson 1
; Creating our neon arena

*= $c000

start:
        ; Set border color to dark blue
        lda #$06     
        sta $d020       ; Border color register
        
        ; Set background color to black
        lda #$00
        sta $d021       ; Background color register
        
        ; Clear the screen
        lda #$93        ; Clear screen character (147 in decimal)
        jsr $ffd2       ; Call KERNAL CHROUT routine
        
        rts