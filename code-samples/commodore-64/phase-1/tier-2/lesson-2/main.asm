; Complete Comparison Demo - High Score System
; Lesson 2: Comparing Values - CMP and Beyond
; Demonstrates all comparison techniques in a practical game context

* = $0801
    !byte $0c,$08,$0a,$00,$9e,$32
    !byte $30,$36,$34,$00,$00,$00
* = $0810

; Constants
SCREEN = $0400
COLOR = $d800
BORDER = $d020
WHITE = 1
RED = 2
GREEN = 5
YELLOW = 7
BLUE = 6
LIGHT_BLUE = 14

; Variables
player_score:    !byte 0
high_score:      !byte 25
bonus_threshold: !byte 50
lives:           !byte 3
level:           !byte 1
game_timer:      !byte 0

main:
    jsr clear_screen
    jsr display_status

game_loop:
    ; Simulate scoring (1 point per frame)
    jsr wait_frame
    inc player_score
    inc game_timer

    ; Check for new high score
    lda player_score
    cmp high_score
    bcc check_bonus      ; Not a new high score
    beq check_bonus      ; Equal to high score
    ; NEW HIGH SCORE!
    sta high_score       ; Update high score
    lda #YELLOW
    sta BORDER           ; Flash border
    jsr display_high_score_message

check_bonus:
    ; Check for bonus life at threshold
    lda player_score
    cmp bonus_threshold
    bne check_level      ; Not at bonus threshold
    ; Award bonus life!
    inc lives
    lda #GREEN
    sta BORDER
    jsr display_bonus_message
    ; Increase threshold for next bonus
    lda bonus_threshold
    clc
    adc #50
    sta bonus_threshold

check_level:
    ; Increase difficulty every 20 points
    lda player_score
    ; Simple check: level = score / 20 + 1
    cmp #20
    bcc level_1
    cmp #40
    bcc level_2
    cmp #60
    bcc level_3
    cmp #80
    bcc level_4
    ; Level 5 (max)
    lda #5
    sta level
    jmp update_display
level_4:
    lda #4
    sta level
    jmp update_display
level_3:
    lda #3
    sta level
    jmp update_display
level_2:
    lda #2
    sta level
    jmp update_display
level_1:
    lda #1
    sta level

update_display:
    jsr display_status

    ; Game state checks
    jsr check_game_over
    lda game_timer
    cmp #200             ; Reset timer periodically
    bcc continue_game
    lda #0
    sta game_timer
    jsr flash_border

continue_game:
    ; Check win condition at 100 points
    lda player_score
    cmp #100
    bcc game_loop

    ; Game complete!
    jsr game_complete
    rts

check_game_over:
    ; Check if lives reached zero
    lda lives
    bne lives_ok
    ; Game over!
    jsr game_over
    ; Reset for new game
    lda #3
    sta lives
    lda #0
    sta player_score
lives_ok:
    rts

; Display routines
display_status:
    ; Clear status area first
    ldx #39
clear_status:
    lda #' '
    sta SCREEN,x
    sta SCREEN+40,x
    sta SCREEN+80,x
    sta SCREEN+120,x
    dex
    bpl clear_status

    ; Show score (line 0)
    lda #'S'
    sta SCREEN
    lda #'C'
    sta SCREEN+1
    lda #'O'
    sta SCREEN+2
    lda #'R'
    sta SCREEN+3
    lda #'E'
    sta SCREEN+4
    lda #':'
    sta SCREEN+5
    lda player_score
    jsr display_number

    ; Show high score (line 1)
    lda #'H'
    sta SCREEN+40
    lda #'I'
    sta SCREEN+41
    lda #'G'
    sta SCREEN+42
    lda #'H'
    sta SCREEN+43
    lda #':'
    sta SCREEN+44
    lda high_score
    jsr display_number_line2

    ; Show lives (line 2)
    lda #'L'
    sta SCREEN+80
    lda #'I'
    sta SCREEN+81
    lda #'V'
    sta SCREEN+82
    lda #'E'
    sta SCREEN+83
    lda #'S'
    sta SCREEN+84
    lda #':'
    sta SCREEN+85
    lda lives
    clc
    adc #'0'
    sta SCREEN+86

    ; Show level (line 3)
    lda #'L'
    sta SCREEN+120
    lda #'E'
    sta SCREEN+121
    lda #'V'
    sta SCREEN+122
    lda #'E'
    sta SCREEN+123
    lda #'L'
    sta SCREEN+124
    lda #':'
    sta SCREEN+125
    lda level
    clc
    adc #'0'
    sta SCREEN+126

    ; Color the display
    jsr color_status
    rts

color_status:
    ; Color score based on value
    lda player_score
    cmp #50
    bcc color_low       ; < 50 = white
    cmp #75
    bcc color_med       ; 50-74 = yellow
    ; >= 75 = green
    lda #GREEN
    jmp set_score_color
color_med:
    lda #YELLOW
    jmp set_score_color
color_low:
    lda #WHITE
set_score_color:
    sta COLOR+6
    sta COLOR+7

    ; High score always yellow
    lda #YELLOW
    sta COLOR+45
    sta COLOR+46

    ; Lives color based on count
    lda lives
    cmp #2
    bcs lives_ok_color  ; >= 2 = green
    cmp #1
    beq lives_warning   ; = 1 = yellow
    ; = 0 = red
    lda #RED
    jmp set_lives_color
lives_warning:
    lda #YELLOW
    jmp set_lives_color
lives_ok_color:
    lda #GREEN
set_lives_color:
    sta COLOR+86

    ; Level always light blue
    lda #LIGHT_BLUE
    sta COLOR+126
    rts

display_number:
    ; Display 3-digit number at SCREEN+6
    pha
    lda #'0'
    sta SCREEN+6        ; Hundreds
    sta SCREEN+7        ; Tens
    sta SCREEN+8        ; Ones
    pla

    ; Handle 100+
    cmp #100
    bcc handle_tens
    lda #'1'
    sta SCREEN+6
    lda player_score
    sec
    sbc #100
    sta player_score    ; Temporarily modify
    lda player_score

handle_tens:
    ; Count tens
    ldx #'0'
count_tens:
    cmp #10
    bcc show_ones
    inx
    sec
    sbc #10
    jmp count_tens
show_ones:
    stx SCREEN+7
    clc
    adc #'0'
    sta SCREEN+8

    ; Restore original score if needed
    lda player_score
    cmp #100
    bcc restore_done
    clc
    adc #100
    sta player_score
restore_done:
    rts

display_number_line2:
    ; Display on line 2 at position 45
    pha
    lda #'0'
    sta SCREEN+45
    sta SCREEN+46
    pla

    ; Simple 2-digit for high score
    cmp #10
    bcc single_digit2

    ldx #'0'
count_tens2:
    cmp #10
    bcc show_ones2
    inx
    sec
    sbc #10
    jmp count_tens2
show_ones2:
    stx SCREEN+45
single_digit2:
    clc
    adc #'0'
    sta SCREEN+46
    rts

display_high_score_message:
    ldx #0
high_loop:
    lda high_msg,x
    beq high_done
    sta SCREEN+200,x
    lda #YELLOW
    sta COLOR+200,x
    inx
    jmp high_loop
high_done:
    rts

display_bonus_message:
    ldx #0
bonus_loop:
    lda bonus_msg,x
    beq bonus_done
    sta SCREEN+280,x
    lda #GREEN
    sta COLOR+280,x
    inx
    jmp bonus_loop
bonus_done:
    rts

game_complete:
    ; Clear message area
    ldx #39
clear_complete:
    lda #' '
    sta SCREEN+480,x
    dex
    bpl clear_complete

    ldx #0
complete_loop:
    lda complete_msg,x
    beq complete_done
    sta SCREEN+480,x
    lda #WHITE
    sta COLOR+480,x
    inx
    jmp complete_loop
complete_done:
    ; Flash border celebration
    ldy #10
celebrate:
    lda #YELLOW
    sta BORDER
    jsr wait_frame
    jsr wait_frame
    lda #GREEN
    sta BORDER
    jsr wait_frame
    jsr wait_frame
    dey
    bne celebrate
    rts

game_over:
    ; Display game over message
    ldx #0
over_loop:
    lda over_msg,x
    beq over_done
    sta SCREEN+440,x
    lda #RED
    sta COLOR+440,x
    inx
    jmp over_loop
over_done:
    ; Flash red border
    ldy #5
flash_red:
    lda #RED
    sta BORDER
    jsr wait_frame
    jsr wait_frame
    jsr wait_frame
    lda #BLUE
    sta BORDER
    jsr wait_frame
    dey
    bne flash_red
    rts

flash_border:
    ; Simple border flash
    lda #WHITE
    sta BORDER
    jsr wait_frame
    lda #BLUE
    sta BORDER
    rts

wait_frame:
    ; Wait for raster line 251
    lda #251
wait:
    cmp $d012
    bne wait
    rts

clear_screen:
    ; Clear entire screen
    ldx #0
    lda #' '
clear_loop:
    sta SCREEN,x
    sta SCREEN+256,x
    sta SCREEN+512,x
    sta SCREEN+768,x
    inx
    bne clear_loop

    ; Clear color memory to white
    ldx #0
    lda #WHITE
clear_color:
    sta COLOR,x
    sta COLOR+256,x
    sta COLOR+512,x
    sta COLOR+768,x
    inx
    bne clear_color

    ; Set initial border
    lda #BLUE
    sta BORDER
    rts

; Messages
high_msg:     !scr "*** new high score! ***",0
bonus_msg:    !scr ">>> bonus life! <<<",0
complete_msg: !scr "amazing! you scored 100 points!",0
over_msg:     !scr "game over - try again!",0
