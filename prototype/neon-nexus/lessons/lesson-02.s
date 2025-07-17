; ================================================================
; NEON NEXUS - LESSON 2: Setting Colors
; Add background color and clear screen
; ================================================================

*= $0801

; BASIC stub: 10 SYS 2080
!word next_line
!word 10
!byte $9e
!text "2080"
!byte 0
next_line:
!word 0

; ================================================================
; MAIN PROGRAM
; ================================================================
*= $0820
main:
        ; Set border color to red
        lda #$02        ; Red color code
        sta $d020       ; Border color register
        
        ; Set background color to black
        lda #$00        ; Black color code
        sta $d021       ; Background color register
        
        ; Clear the screen
        lda #$93        ; Clear screen character code
        jsr $ffd2       ; Call KERNAL CHROUT routine
        
        rts             ; Return to BASIC