; ================================================================
; NEON NEXUS - LESSON 4: Moving the Player
; Add simple movement with calculated screen positions
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
        lda #$06        ; Blue border
        sta $d020
        lda #$00        ; Black background
        sta $d021
        
        ; Clear screen
        lda #$93
        jsr $ffd2
        
        ; Initialize player position
        lda #20         ; X position (0-39)
        sta player_x
        lda #12         ; Y position (0-24)
        sta player_y
        
        ; Game loop
game_loop:
        ; Clear previous position by redrawing player
        jsr draw_player
        
        ; Simple automatic movement for demo
        inc player_x
        lda player_x
        cmp #39         ; Right edge
        bcc continue    ; If less than 39, continue
        lda #0          ; Wrap to left
        sta player_x
        
continue:
        ; Simple delay
        ldx #100
delay:
        dex
        bne delay
        
        jmp game_loop

; ================================================================
; DRAW PLAYER AT CURRENT POSITION
; ================================================================
draw_player:
        ; Calculate screen address: $0400 + (Y * 40) + X
        ; We'll use a simple lookup table for Y*40
        
        lda player_y
        cmp #25         ; Safety check
        bcs skip_draw
        
        ; Get Y offset (Y * 40) using repeated addition
        lda #0          ; Start with 0
        ldx player_y
        beq got_y_offset ; If Y=0, offset is 0
        
add_40:
        clc
        adc #40         ; Add 40 for each Y
        dex
        bne add_40
        
got_y_offset:
        ; Add X coordinate
        clc
        adc player_x
        
        ; Add to screen base
        clc
        adc #<$0400     ; Low byte
        tax             ; Save in X
        lda #>$0400     ; High byte
        adc #0          ; Add carry
        tay             ; Save in Y
        
        ; Clear old character first (simple approach)
        lda #32         ; Space
        sta $0400,x     ; Approximate - this is simplified
        
        ; Draw player
        lda #$2a        ; Star
        sta $0400,x
        
skip_draw:
        rts

; ================================================================
; VARIABLES
; ================================================================
player_x:   !byte 20
player_y:   !byte 12