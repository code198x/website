; ZX Spectrum - Sprite Graphics Example
; Demonstrates pixel-level graphics manipulation
;
; Learning objectives:
; - Understanding the Spectrum display layout
; - XOR sprite drawing for easy removal
; - Pixel coordinate calculations
; - Animation techniques

    org 32768

; Constants
SCREEN      equ 16384   ; Display file start
ATTRS       equ 22528   ; Attributes start

; Variables
xpos:       defb 10     ; X position (in characters)
ypos:       defb 10     ; Y position (in pixels)
xdir:       defb 1      ; X direction
ydir:       defb 1      ; Y direction

start:
    ; Clear screen
    xor a
    out (254),a     ; Black border
    ld a,7          ; White on black
    ld (23693),a
    call $0DAF      ; CLS
    
main_loop:
    ; Draw sprite at current position
    call draw_sprite
    
    ; Wait a bit (poor man's timing)
    ld bc,5000
delay:
    dec bc
    ld a,b
    or c
    jr nz,delay
    
    ; Erase sprite (XOR again)
    call draw_sprite
    
    ; Update X position
    ld a,(xpos)
    ld b,a
    ld a,(xdir)
    add a,b
    ld (xpos),a
    
    ; Check X bounds (0-29)
    cp 30
    jr c,check_left
    ; Hit right edge
    ld a,29
    ld (xpos),a
    ld a,-1
    ld (xdir),a
    jr update_y
    
check_left:
    or a            ; Check if 0
    jr nz,update_y
    ; Hit left edge
    ld a,1
    ld (xdir),a
    
update_y:
    ; Update Y position
    ld a,(ypos)
    ld b,a
    ld a,(ydir)
    add a,b
    ld (ypos),a
    
    ; Check Y bounds (0-176)
    cp 177
    jr c,check_top
    ; Hit bottom
    ld a,176
    ld (ypos),a
    ld a,-1
    ld (ydir),a
    jr main_loop
    
check_top:
    cp 8
    jr nc,main_loop
    ; Hit top
    ld a,8
    ld (ypos),a
    ld a,1
    ld (ydir),a
    
    jr main_loop

; Draw 16x16 sprite using XOR
draw_sprite:
    ; Calculate screen address from x,y
    ld a,(ypos)     ; Y coordinate
    ld l,a
    and 7           ; Y mod 8
    ld h,a          ; Save for later
    ld a,l
    and $F8         ; Y div 8 * 8
    add a,a         ; * 16
    add a,a         ; * 32
    ld l,a
    ld a,(xpos)     ; X coordinate
    add a,l
    ld l,a
    ld a,h
    rrca
    rrca
    rrca
    and $E0
    add a,high SCREEN
    ld h,a
    
    ; HL now points to screen position
    push hl         ; Save for attributes
    
    ; Draw sprite (16x16 pixels)
    ld de,sprite_data
    ld b,16         ; 16 rows
    
sprite_row:
    push bc
    push hl
    
    ; Draw one row (2 bytes wide)
    ld a,(de)       ; First byte
    xor (hl)        ; XOR with screen
    ld (hl),a       ; Write back
    inc hl
    inc de
    ld a,(de)       ; Second byte
    xor (hl)
    ld (hl),a
    inc de
    
    pop hl
    pop bc
    
    ; Next screen row
    inc h           ; Next pixel row
    ld a,h
    and 7
    jr nz,no_wrap
    ; Wrapped to next character row
    ld a,l
    add a,32
    ld l,a
    jr c,no_wrap
    ld a,h
    sub 8
    ld h,a
no_wrap:
    djnz sprite_row
    
    ; Set attributes for sprite area
    pop hl          ; Get original position
    ; Convert to attribute address
    ld a,h
    rrca
    rrca
    rrca
    and 3
    or $58          ; Attributes high byte
    ld h,a
    
    ; Set 2x2 character attributes
    ld a,7+8+64     ; White ink, black paper, bright
    ld (hl),a       ; Top-left
    inc hl
    ld (hl),a       ; Top-right
    ld de,31
    add hl,de
    ld (hl),a       ; Bottom-right
    inc hl
    ld (hl),a       ; Bottom-left
    
    ret

; 16x16 sprite data (smiley face)
sprite_data:
    defb %00111111,%11111100
    defb %01111111,%11111110
    defb %11111111,%11111111
    defb %11111111,%11111111
    defb %11110011,%11001111
    defb %11110011,%11001111
    defb %11111111,%11111111
    defb %11111111,%11111111
    defb %11111111,%11111111
    defb %11100000,%00000111
    defb %11110000,%00001111
    defb %11111100,%00111111
    defb %11111111,%11111111
    defb %11111111,%11111111
    defb %01111111,%11111110
    defb %00111111,%11111100

    end start