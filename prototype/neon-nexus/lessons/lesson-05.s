; ================================================================
; NEON NEXUS - LESSON 5: Player Boundaries
; Add proper boundary checking so player stops at screen edges
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
        
        ; Initialize position (center of screen)
        lda #20         ; Center X
        sta player_x
        
        ; Movement loop
game_loop:
        ; Clear row 12
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
        
        ; Move right but check boundaries
        inc player_x
        lda player_x
        cmp #40         ; Right boundary (40 wraps to next line)
        bcc continue    ; If less than 40, continue
        lda #0          ; Reset to left boundary (column 0)
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
player_x:   !byte 20