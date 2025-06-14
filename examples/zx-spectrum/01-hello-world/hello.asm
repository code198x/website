; ZX Spectrum - Hello World Example
; Demonstrates text output using ROM routines
;
; Learning objectives:
; - Using ROM print routines
; - Understanding the Spectrum display file
; - Setting colors with attributes

    org 32768       ; Standard address for machine code

; ROM routines
ROM_CLS     equ $0DAF   ; Clear screen
ROM_PRINT   equ $203C   ; Print string at DE
ROM_CHAN    equ $1601   ; Select channel
ROM_ATTR    equ $0D8E   ; Set attributes

start:
    ; Clear the screen
    call ROM_CLS
    
    ; Set colors: bright white on blue
    ld a,71         ; BRIGHT 1, PAPER 1 (blue), INK 7 (white)
    ld (23693),a    ; ATTR_P system variable
    
    ; Print title at top of screen
    ld a,2          ; Channel 2 (screen)
    call ROM_CHAN
    
    ; Set print position (AT 5,8)
    ld a,22         ; AT control code
    rst 16          ; Print it
    ld a,5          ; Row 5
    rst 16
    ld a,8          ; Column 8
    rst 16
    
    ; Print the message
    ld hl,message
print_loop:
    ld a,(hl)       ; Get character
    or a            ; Check for zero
    ret z           ; Return if done
    rst 16          ; Print character
    inc hl          ; Next character
    jr print_loop
    
message:
    defb "HELLO FROM SPECTRUM!",0

; Direct screen memory example
; The display file starts at 16384 ($4000)
; Attributes start at 22528 ($5800)

    ; Draw a box using direct screen access
    ld hl,$4000+8*32+10  ; Row 8, column 10
    ld a,%11111111       ; 8 pixels
    ld (hl),a            ; Top line
    
    ; Draw sides (8 rows)
    ld b,8
    ld de,32             ; Next line offset
box_loop:
    add hl,de            ; Next row
    ld a,%10000001       ; Left and right pixels
    ld (hl),a
    djnz box_loop
    
    ; Bottom line
    add hl,de
    ld a,%11111111
    ld (hl),a
    
    ; Color the box area (red on yellow)
    ld hl,$5800+8*32+10  ; Attribute address
    ld a,48+2            ; PAPER 6 (yellow), INK 2 (red)
    ld (hl),a
    
    ret                  ; Return to BASIC

    end start