; ================================================================
; NEON NEXUS - LESSON 4: Moving Player (Fixed)
; Simple horizontal movement without complex calculations
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
        
        ; Initialize position
        lda #0          ; Start at left edge
        sta player_x
        
        ; Simple movement loop
game_loop:
        ; Clear old position (just put spaces across row 12)
        ldx #0
clear_row:
        lda #32         ; Space character
        sta $0400+480,x ; Row 12 (12*40=480)
        inx
        cpx #40         ; Clear entire row
        bne clear_row
        
        ; Draw player at current X position
        ldx player_x
        lda #$2a        ; Star character
        sta $0400+480,x ; Row 12
        lda #$01        ; White color
        sta $d800+480,x
        
        ; Move right
        inc player_x
        lda player_x
        cmp #40         ; Check if at right edge
        bne continue
        lda #0          ; Wrap to left
        sta player_x
        
continue:
        ; Delay
        ldy #100
delay_outer:
        ldx #200
delay_inner:
        dex
        bne delay_inner
        dey
        bne delay_outer
        
        jmp game_loop   ; Repeat forever

; ================================================================
; VARIABLES
; ================================================================
player_x:   !byte 0