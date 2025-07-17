; ================================================================
; NEON NEXUS - LESSON 6: Simple Score Display
; Add a score counter that increases over time
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
        ; Set colors
        lda #$02        ; Red border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Initialize
        lda #20         ; Center X
        sta player_x
        lda #0          ; Start score at 0
        sta score
        
        ; Display "SCORE:" label
        ldx #0
score_label_loop:
        lda score_text,x
        beq score_label_done
        sta $0400,x     ; Top of screen
        inx
        jmp score_label_loop
score_label_done:

        ; Movement loop
game_loop:
        ; Clear row 12
        ldx #0
clear_row:
        lda #32         ; Space character
        sta $0400+480,x ; Row 12 (12*40=480)
        inx
        cpx #40
        bne clear_row
        
        ; Draw player
        ldx player_x
        lda #$2a        ; Star character
        sta $0400+480,x ; Row 12
        lda #$01        ; White color
        sta $d800+480,x
        
        ; Move player
        inc player_x
        lda player_x
        cmp #40
        bcc continue
        lda #0
        sta player_x
        
continue:
        ; Update score (every 256 frames for slow increment)
        inc frame_counter
        bne skip_score
        inc score       ; Increment score when frame counter wraps
        
skip_score:
        ; Display score
        jsr display_score
        
        ; Delay
        ldy #80         ; Slightly faster to see score change
delay_outer:
        ldx #200
delay_inner:
        dex
        bne delay_inner
        dey
        bne delay_outer
        
        jmp game_loop

; ================================================================
; DISPLAY SCORE SUBROUTINE
; ================================================================
display_score:
        ; Display score as single digit (0-9)
        lda score
        and #$0f        ; Keep only low 4 bits
        clc
        adc #$30        ; Convert to PETSCII digit '0'-'9'
        sta $0400+6     ; Position after "SCORE:"
        rts

; ================================================================
; DATA
; ================================================================
score_text:
        !byte $13,$03,$0f,$12,$05,$3a,$00  ; "SCORE:" in PETSCII (screen codes)

; ================================================================
; VARIABLES
; ================================================================
player_x:       !byte 20
score:          !byte 0
frame_counter:  !byte 0