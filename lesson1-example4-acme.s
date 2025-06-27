; Neon Nexus - Lesson 1
; Subroutine test in BASIC memory area

*= $0801

; BASIC stub: 10 SYS 2061
!word next_line
!word 10
!byte $9e
!text "2061"
!byte 0
next_line:
!word 0

; Start of our program
start:
        jsr setup_arena
        jsr create_display
        jmp forever

setup_arena:
        ; Set border color to dark blue
        lda #$06     
        sta $d020
        ; Set background color to black
        lda #$00
        sta $d021
        rts

create_display:
        ; Clear the screen
        lda #$93
        jsr $ffd2
        ; Put a character on screen
        lda #$2a        ; Star character
        sta $0400       ; Top-left corner
        rts

forever:
        jmp forever