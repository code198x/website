; Complete Multiple Choice Demo
; Lesson 3: Jump Tables and Decision Trees
; Shows decision chains, jump tables, and menu systems

* = $0801
    !byte $0c,$08,$0a,$00,$9e,$32
    !byte $30,$36,$34,$00,$00,$00
* = $0810

; Constants
SCREEN = $0400
COLOR = $d800
KEYBOARD = $dc01
KEY_SCAN = $dc00
BORDER = $d020
WHITE = 1
RED = 2
GREEN = 5
YELLOW = 7
BLUE = 6
CYAN = 3
PURPLE = 4
LIGHT_BLUE = 14

; Variables
current_selection: !byte 0
game_mode:         !byte 0
player_class:      !byte 0
difficulty:        !byte 1
key_pressed:       !byte 0
last_key:          !byte 255
jump_address:      !word 0
game_state:        !byte 0    ; 0=main menu, 1=class select, 2=options, 3=playing

main:
    jsr clear_screen
    jsr show_main_menu

main_loop:
    jsr scan_keyboard
    jsr handle_current_state
    jsr wait_frame
    jmp main_loop

; State machine using jump table
handle_current_state:
    lda game_state
    asl                 ; Multiply by 2 for word addresses
    tax
    lda state_jump_table,x
    sta jump_address
    lda state_jump_table+1,x
    sta jump_address+1
    jmp (jump_address)

; State handlers
handle_main_menu:
    lda key_pressed
    beq no_key_main

    ; Decision chain for main menu
    cmp #'1'
    beq select_single_player
    cmp #'2'
    beq select_two_player
    cmp #'3'
    beq select_options
    cmp #'4'
    beq select_high_scores
    cmp #'5'
    beq select_quit
    ; Invalid choice
    jsr flash_error
    jmp no_key_main

select_single_player:
    lda #1
    sta game_mode
    lda #1              ; Switch to class selection state
    sta game_state
    jsr show_class_selection
    rts

select_two_player:
    lda #2
    sta game_mode
    lda #1
    sta game_state
    jsr show_class_selection
    rts

select_options:
    lda #2              ; Switch to options state
    sta game_state
    jsr show_options_menu
    rts

select_high_scores:
    jsr show_high_scores
    rts

select_quit:
    jsr show_quit_message
    rts

no_key_main:
    rts

; Class selection with jump table
handle_class_selection:
    lda key_pressed
    beq no_key_class

    ; Validate choice (1-4)
    cmp #'1'
    bcc invalid_class
    cmp #'5'
    bcs invalid_class

    ; Convert to index (0-3)
    sec
    sbc #'1'
    sta player_class

    ; Use jump table for class selection
    asl                 ; * 2 for word addresses
    tax
    lda class_jump_table,x
    sta jump_address
    lda class_jump_table+1,x
    sta jump_address+1
    jmp (jump_address)

invalid_class:
    jsr flash_error
    jmp no_key_class

no_key_class:
    rts

; Class handlers
select_warrior:
    lda #'W'
    sta SCREEN+800
    lda #RED
    sta COLOR+800
    jsr show_warrior_stats
    jsr start_game
    rts

select_mage:
    lda #'M'
    sta SCREEN+800
    lda #BLUE
    sta COLOR+800
    jsr show_mage_stats
    jsr start_game
    rts

select_archer:
    lda #'A'
    sta SCREEN+800
    lda #GREEN
    sta COLOR+800
    jsr show_archer_stats
    jsr start_game
    rts

select_rogue:
    lda #'R'
    sta SCREEN+800
    lda #PURPLE
    sta COLOR+800
    jsr show_rogue_stats
    jsr start_game
    rts

; Options menu (another decision chain)
handle_options:
    lda key_pressed
    beq no_key_options

    cmp #'1'
    beq change_difficulty
    cmp #'2'
    beq toggle_sound
    cmp #'3'
    beq change_controls
    cmp #'9'
    beq back_to_main
    jsr flash_error
    jmp no_key_options

change_difficulty:
    jsr cycle_difficulty
    jsr show_options_menu  ; Refresh display
    rts

toggle_sound:
    jsr toggle_sound_setting
    jsr show_options_menu
    rts

change_controls:
    jsr show_controls_menu
    jsr show_options_menu
    rts

back_to_main:
    lda #0              ; Return to main menu state
    sta game_state
    jsr show_main_menu
    rts

no_key_options:
    rts

; Display routines
show_main_menu:
    jsr clear_screen

    ; Title
    ldx #0
title_loop:
    lda main_title,x
    beq title_done
    sta SCREEN+80,x
    lda #CYAN
    sta COLOR+80,x
    inx
    jmp title_loop
title_done:

    ; Menu options with colors
    ldx #0
menu_loop:
    lda menu_option_1,x
    beq menu_1_done
    sta SCREEN+200,x
    lda #WHITE
    sta COLOR+200,x
    inx
    jmp menu_loop
menu_1_done:

    ldx #0
menu_2_loop:
    lda menu_option_2,x
    beq menu_2_done
    sta SCREEN+240,x
    lda #WHITE
    sta COLOR+240,x
    inx
    jmp menu_2_loop
menu_2_done:

    ldx #0
menu_3_loop:
    lda menu_option_3,x
    beq menu_3_done
    sta SCREEN+280,x
    lda #WHITE
    sta COLOR+280,x
    inx
    jmp menu_3_loop
menu_3_done:

    ldx #0
menu_4_loop:
    lda menu_option_4,x
    beq menu_4_done
    sta SCREEN+320,x
    lda #WHITE
    sta COLOR+320,x
    inx
    jmp menu_4_loop
menu_4_done:

    ldx #0
menu_5_loop:
    lda menu_option_5,x
    beq menu_5_done
    sta SCREEN+360,x
    lda #WHITE
    sta COLOR+360,x
    inx
    jmp menu_5_loop
menu_5_done:
    rts

show_class_selection:
    jsr clear_screen

    ; Class selection title
    ldx #0
class_title_loop:
    lda class_title,x
    beq class_title_done
    sta SCREEN+40,x
    lda #YELLOW
    sta COLOR+40,x
    inx
    jmp class_title_loop
class_title_done:

    ; Class options
    ldx #0
class_1_loop:
    lda class_option_1,x
    beq class_1_done
    sta SCREEN+160,x
    lda #RED
    sta COLOR+160,x
    inx
    jmp class_1_loop
class_1_done:

    ldx #0
class_2_loop:
    lda class_option_2,x
    beq class_2_done
    sta SCREEN+200,x
    lda #BLUE
    sta COLOR+200,x
    inx
    jmp class_2_loop
class_2_done:

    ldx #0
class_3_loop:
    lda class_option_3,x
    beq class_3_done
    sta SCREEN+240,x
    lda #GREEN
    sta COLOR+240,x
    inx
    jmp class_3_loop
class_3_done:

    ldx #0
class_4_loop:
    lda class_option_4,x
    beq class_4_done
    sta SCREEN+280,x
    lda #PURPLE
    sta COLOR+280,x
    inx
    jmp class_4_loop
class_4_done:
    rts

show_options_menu:
    jsr clear_screen

    ; Options title
    ldx #0
opt_title_loop:
    lda options_title,x
    beq opt_title_done
    sta SCREEN+40,x
    lda #LIGHT_BLUE
    sta COLOR+40,x
    inx
    jmp opt_title_loop
opt_title_done:

    ; Options
    ldx #0
opt_1_loop:
    lda option_1,x
    beq opt_1_done
    sta SCREEN+160,x
    lda #WHITE
    sta COLOR+160,x
    inx
    jmp opt_1_loop
opt_1_done:

    ldx #0
opt_2_loop:
    lda option_2,x
    beq opt_2_done
    sta SCREEN+200,x
    lda #WHITE
    sta COLOR+200,x
    inx
    jmp opt_2_loop
opt_2_done:

    ldx #0
opt_3_loop:
    lda option_3,x
    beq opt_3_done
    sta SCREEN+240,x
    lda #WHITE
    sta COLOR+240,x
    inx
    jmp opt_3_loop
opt_3_done:

    ldx #0
opt_9_loop:
    lda option_9,x
    beq opt_9_done
    sta SCREEN+320,x
    lda #YELLOW
    sta COLOR+320,x
    inx
    jmp opt_9_loop
opt_9_done:

    ; Show current difficulty
    lda #'C'
    sta SCREEN+400
    lda #'U'
    sta SCREEN+401
    lda #'R'
    sta SCREEN+402
    lda #'R'
    sta SCREEN+403
    lda #'E'
    sta SCREEN+404
    lda #'N'
    sta SCREEN+405
    lda #'T'
    sta SCREEN+406
    lda #' '
    sta SCREEN+407
    lda #'D'
    sta SCREEN+408
    lda #'I'
    sta SCREEN+409
    lda #'F'
    sta SCREEN+410
    lda #'F'
    sta SCREEN+411
    lda #':'
    sta SCREEN+412
    lda #' '
    sta SCREEN+413

    lda difficulty
    clc
    adc #'0'
    sta SCREEN+414
    rts

; Game start (placeholder)
start_game:
    lda #3              ; Switch to playing state
    sta game_state
    jsr clear_screen

    ; Game start message
    ldx #0
start_loop:
    lda game_start_msg,x
    beq start_done
    sta SCREEN+200,x
    lda #WHITE
    sta COLOR+200,x
    inx
    jmp start_loop
start_done:

    ; Show game details
    lda #'M'
    sta SCREEN+280
    lda #'O'
    sta SCREEN+281
    lda #'D'
    sta SCREEN+282
    lda #'E'
    sta SCREEN+283
    lda #':'
    sta SCREEN+284
    lda #' '
    sta SCREEN+285
    lda game_mode
    clc
    adc #'0'
    sta SCREEN+286

    lda #'C'
    sta SCREEN+320
    lda #'L'
    sta SCREEN+321
    lda #'A'
    sta SCREEN+322
    lda #'S'
    sta SCREEN+323
    lda #'S'
    sta SCREEN+324
    lda #':'
    sta SCREEN+325
    lda #' '
    sta SCREEN+326
    lda player_class
    clc
    adc #'1'
    sta SCREEN+327

    lda #'D'
    sta SCREEN+360
    lda #'I'
    sta SCREEN+361
    lda #'F'
    sta SCREEN+362
    lda #'F'
    sta SCREEN+363
    lda #':'
    sta SCREEN+364
    lda #' '
    sta SCREEN+365
    lda difficulty
    clc
    adc #'0'
    sta SCREEN+366

    ; Instructions
    ldx #0
instr_loop:
    lda instructions,x
    beq instr_done
    sta SCREEN+480,x
    lda #CYAN
    sta COLOR+480,x
    inx
    jmp instr_loop
instr_done:

game_wait:
    jsr scan_keyboard
    lda key_pressed
    beq game_wait
    lda #0              ; Return to main menu
    sta game_state
    jsr show_main_menu
    rts

; Character stat displays
show_warrior_stats:
    lda #'S'
    sta SCREEN+840
    lda #'T'
    sta SCREEN+841
    lda #'R'
    sta SCREEN+842
    lda #':'
    sta SCREEN+843
    lda #'9'
    sta SCREEN+844
    lda #' '
    sta SCREEN+845
    lda #'I'
    sta SCREEN+846
    lda #'N'
    sta SCREEN+847
    lda #'T'
    sta SCREEN+848
    lda #':'
    sta SCREEN+849
    lda #'4'
    sta SCREEN+850
    rts

show_mage_stats:
    lda #'S'
    sta SCREEN+840
    lda #'T'
    sta SCREEN+841
    lda #'R'
    sta SCREEN+842
    lda #':'
    sta SCREEN+843
    lda #'3'
    sta SCREEN+844
    lda #' '
    sta SCREEN+845
    lda #'I'
    sta SCREEN+846
    lda #'N'
    sta SCREEN+847
    lda #'T'
    sta SCREEN+848
    lda #':'
    sta SCREEN+849
    lda #'9'
    sta SCREEN+850
    rts

show_archer_stats:
    lda #'S'
    sta SCREEN+840
    lda #'T'
    sta SCREEN+841
    lda #'R'
    sta SCREEN+842
    lda #':'
    sta SCREEN+843
    lda #'6'
    sta SCREEN+844
    lda #' '
    sta SCREEN+845
    lda #'D'
    sta SCREEN+846
    lda #'E'
    sta SCREEN+847
    lda #'X'
    sta SCREEN+848
    lda #':'
    sta SCREEN+849
    lda #'9'
    sta SCREEN+850
    rts

show_rogue_stats:
    lda #'S'
    sta SCREEN+840
    lda #'T'
    sta SCREEN+841
    lda #'R'
    sta SCREEN+842
    lda #':'
    sta SCREEN+843
    lda #'5'
    sta SCREEN+844
    lda #' '
    sta SCREEN+845
    lda #'A'
    sta SCREEN+846
    lda #'G'
    sta SCREEN+847
    lda #'I'
    sta SCREEN+848
    lda #':'
    sta SCREEN+849
    lda #'9'
    sta SCREEN+850
    rts

; Utility functions
cycle_difficulty:
    inc difficulty
    lda difficulty
    cmp #4
    bcc diff_ok
    lda #1
    sta difficulty
diff_ok:
    rts

toggle_sound_setting:
    ; Placeholder for sound toggle
    rts

show_controls_menu:
    ; Placeholder for controls
    rts

show_high_scores:
    jsr clear_screen
    ldx #0
hs_loop:
    lda high_scores_msg,x
    beq hs_done
    sta SCREEN+160,x
    lda #YELLOW
    sta COLOR+160,x
    inx
    jmp hs_loop
hs_done:
    ; Wait for key
hs_wait:
    jsr scan_keyboard
    lda key_pressed
    beq hs_wait
    rts

show_quit_message:
    jsr clear_screen
    ldx #0
quit_loop:
    lda quit_msg,x
    beq quit_done
    sta SCREEN+200,x
    lda #RED
    sta COLOR+200,x
    inx
    jmp quit_loop
quit_done:
    ; Flash border and exit
    ldy #10
quit_flash:
    lda #RED
    sta BORDER
    jsr wait_frame
    lda #BLUE
    sta BORDER
    jsr wait_frame
    dey
    bne quit_flash
    rts

flash_error:
    lda #RED
    sta BORDER
    jsr wait_frame
    jsr wait_frame
    lda #BLUE
    sta BORDER
    rts

; Simplified keyboard scanning for demo
scan_keyboard:
    ; This is a simplified keyboard scanner
    ; Real games would scan the full matrix
    lda #255
    sta KEY_SCAN
    lda KEYBOARD

    ; Check if any key is pressed
    cmp #255
    beq no_key

    ; For demo purposes, we'll cycle through keys
    inc current_selection
    lda current_selection
    and #7              ; Limit to 0-7
    clc
    adc #'1'            ; Convert to ASCII '1'-'8'
    sta key_pressed
    rts

no_key:
    lda #0
    sta key_pressed
    rts

wait_frame:
    lda #251
wait:
    cmp $d012
    bne wait
    rts

clear_screen:
    ldx #0
    lda #' '
clear_loop:
    sta SCREEN,x
    sta SCREEN+256,x
    sta SCREEN+512,x
    sta SCREEN+768,x
    inx
    bne clear_loop

    ; Clear colors
    ldx #0
    lda #WHITE
color_loop:
    sta COLOR,x
    sta COLOR+256,x
    sta COLOR+512,x
    sta COLOR+768,x
    inx
    bne color_loop

    lda #BLUE
    sta BORDER
    rts

; Jump tables
state_jump_table:
    !word handle_main_menu
    !word handle_class_selection
    !word handle_options
    !word handle_main_menu      ; Game state returns to menu for demo

class_jump_table:
    !word select_warrior
    !word select_mage
    !word select_archer
    !word select_rogue

; Text data
main_title:
    !scr "    fantastic rpg adventure",0

menu_option_1:
    !scr "1. single player quest",0
menu_option_2:
    !scr "2. two player co-op",0
menu_option_3:
    !scr "3. game options",0
menu_option_4:
    !scr "4. hall of fame",0
menu_option_5:
    !scr "5. quit to basic",0

class_title:
    !scr "  choose your character class:",0
class_option_1:
    !scr "1. warrior - master of combat",0
class_option_2:
    !scr "2. mage - wielder of magic",0
class_option_3:
    !scr "3. archer - swift and deadly",0
class_option_4:
    !scr "4. rogue - silent and cunning",0

options_title:
    !scr "      game options menu:",0
option_1:
    !scr "1. difficulty level",0
option_2:
    !scr "2. sound effects",0
option_3:
    !scr "3. control setup",0
option_9:
    !scr "9. return to main menu",0

game_start_msg:
    !scr "starting your adventure...",0

instructions:
    !scr "press any key to return to menu",0

high_scores_msg:
    !scr "hall of fame:",13
    !scr "1. gandalf the grey   9999",13
    !scr "2. aragorn ranger     8888",13
    !scr "3. legolas archer     7777",13
    !scr "4. gimli warrior      6666",13
    !scr "press any key to continue",0

quit_msg:
    !scr "farewell, brave adventurer!",0
