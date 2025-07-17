; ================================================================
; NEON NEXUS - LESSON 7: Game Variables and State
; Add game state management and prepare for multiple objects
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
        jsr init_game
        jmp game_loop

init_game:
        ; Set colors
        lda #$02        ; Red border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Initialize game state
        lda #1          ; Game active
        sta game_active
        lda #0          ; Start at level 1
        sta level
        
        ; Initialize player
        lda #20         ; Center X
        sta player_x
        lda #0          ; Start score at 0
        sta score
        
        ; Display UI
        jsr display_ui
        
        rts

display_ui:
        ; Display "SCORE:" label
        ldx #0
score_label_loop:
        lda score_text,x
        beq score_done
        sta $0400,x     ; Top of screen
        inx
        jmp score_label_loop
score_done:
        
        ; Display "LEVEL:" label
        ldx #0
level_label_loop:
        lda level_text,x
        beq level_done
        sta $0400+20,x  ; Top right of screen
        inx
        jmp level_label_loop
level_done:
        rts

game_loop:
        ; Check if game is active
        lda game_active
        beq game_over
        
        ; Clear row 15 (player row)
        ldx #0
clear_row:
        lda #32         ; Space character
        sta $0400+600,x ; Row 15 (15*40=600)
        inx
        cpx #40
        bne clear_row
        
        ; Draw player
        ldx player_x
        lda #$2a        ; Star character
        sta $0400+600,x ; Row 15
        lda #$01        ; White color
        sta $d800+600,x
        
        ; Move player
        inc player_x
        lda player_x
        cmp #40
        bcc continue
        lda #0
        sta player_x
        
continue:
        ; Update score (every 256 frames)
        inc frame_counter
        bne skip_score
        inc score       ; Increment score when frame counter wraps
        
        ; Check for level up (every 16 points)
        lda score
        and #$0f        ; Check if score is multiple of 16
        bne skip_level
        lda score
        beq skip_level  ; Don't level up at score 0
        inc level       ; Level up
        
skip_level:
skip_score:
        ; Display score and level
        jsr display_score
        jsr display_level
        
        ; Delay
        ldy #80
delay_outer:
        ldx #200
delay_inner:
        dex
        bne delay_inner
        dey
        bne delay_outer
        
        jmp game_loop

game_over:
        ; Simple game over - just loop forever
        jmp game_over

; ================================================================
; DISPLAY SUBROUTINES
; ================================================================
display_score:
        ; Convert score to two hex digits and display
        lda score
        lsr
        lsr
        lsr
        lsr             ; Get high nibble
        clc
        adc #48         ; Convert to ASCII digit (0-9)
        sta $0400+6     ; Position after "SCORE:"
        
        lda score
        and #$0f        ; Get low nibble
        clc
        adc #48         ; Convert to ASCII digit
        sta $0400+7
        
        rts

display_level:
        ; Display current level (single digit)
        lda level
        and #$0f        ; Keep only low nibble
        clc
        adc #48         ; Convert to ASCII digit
        sta $0400+26    ; Position after "LEVEL:"
        rts

; ================================================================
; DATA
; ================================================================
score_text:
        !byte $13,$03,$0f,$12,$05,$3a,$00  ; "SCORE:" in screen codes

level_text:
        !byte $0c,$05,$16,$05,$0c,$3a,$00  ; "LEVEL:" in screen codes

; ================================================================
; VARIABLES
; ================================================================
player_x:       !byte 20
score:          !byte 0
level:          !byte 1
frame_counter:  !byte 0
game_active:    !byte 1