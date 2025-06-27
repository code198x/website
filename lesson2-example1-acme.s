; Neon Nexus - Lesson 2 (ACME version)
; Creating a player entity with subroutines

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
        jsr create_player
        jmp forever

setup_arena:
        ; Set up arena colors
        lda #$06        ; Dark blue border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Clear screen manually (no CHROUT)
        lda #$20        ; Space character
        ldx #$00
clear_loop:
        sta $0400,x     ; Clear screen memory
        sta $0500,x
        inx
        bne clear_loop
        rts

create_player:
        ; Create player character at center
        lda #$5a        ; Diamond character
        sta $0400 + 512 ; Center of screen
        
        ; Color the player yellow
        lda #$07        ; Yellow
        sta $d800 + 512 ; Color memory
        rts

forever:
        jmp forever