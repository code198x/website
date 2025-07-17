; ================================================================
; NEON NEXUS - LESSON 1: Your First Program
; Just change the border color - simplest possible C64 program
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
        
        rts             ; Return to BASIC