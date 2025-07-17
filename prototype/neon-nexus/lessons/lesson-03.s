; ================================================================
; NEON NEXUS - LESSON 3: Display a Character
; Put a star on screen to represent our player
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
        ; Set up colors
        lda #$02        ; Red border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Put player character in center of screen
        ; Screen center is roughly position 19,12 (0-based)
        ; Screen memory: $0400 + (Y * 40) + X
        ; Center = $0400 + (12 * 40) + 19 = $0400 + 480 + 19 = $0400 + 499 = $05f3
        
        lda #$2a        ; Star character (*)
        sta $05f3       ; Put at screen center
        
        ; Set character color to white
        lda #$01        ; White color
        sta $d9f3       ; Color RAM ($d800 + same offset)
        
        rts             ; Return to BASIC