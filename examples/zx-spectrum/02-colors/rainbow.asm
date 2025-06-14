; ZX Spectrum - Rainbow Borders Example
; Demonstrates interrupt handling and border effects
;
; Learning objectives:
; - Setting up interrupt handlers
; - OUT instruction for border color
; - Timing and synchronization
; - Creating visual effects

    org 32768

; System variables
FRAMES      equ 23672   ; Frame counter
ATTR_P      equ 23693   ; Permanent attributes

start:
    ; Disable interrupts while setting up
    di
    
    ; Clear screen with black paper, white ink
    ld a,7          ; White ink on black
    ld (ATTR_P),a
    call $0DAF      ; ROM CLS routine
    
    ; Print message
    ld hl,message
    ld de,16384+5*32+8  ; Row 5, col 8
    call print_string
    
    ; Set up interrupt mode 1 handler
    ld hl,interrupt_handler
    ld ($5C00),hl   ; Store handler address
    
    ; Point interrupt vector to our handler
    ld a,$C3        ; JP instruction
    ld ($FDFD),a
    ld hl,$5C00
    ld ($FDFE),hl
    
    ; Enable interrupts
    ei
    
main_loop:
    ; Main loop - cycle border colors slowly
    ld hl,FRAMES
wait_frame:
    ld a,(hl)       ; Get frame counter
    and 7           ; Every 8 frames
    jr nz,wait_frame
    
    ; Increment border color
    ld a,(border_color)
    inc a
    and 7           ; Keep in range 0-7
    ld (border_color),a
    
    jr main_loop

; Interrupt handler - creates rainbow effect
interrupt_handler:
    push af
    push bc
    push hl
    
    ; Quick rainbow stripes
    ld hl,rainbow_data
    ld b,8          ; 8 colors
    
rainbow_loop:
    ld a,(hl)       ; Get color
    out (254),a     ; Set border
    
    ; Small delay
    ld c,20
delay:
    dec c
    jr nz,delay
    
    inc hl
    djnz rainbow_loop
    
    ; Restore main border color
    ld a,(border_color)
    out (254),a
    
    pop hl
    pop bc
    pop af
    ei
    reti

; Print string routine
print_string:
    ld a,(hl)       ; Get character
    or a            ; Check for zero
    ret z           ; Done if zero
    
    ; Convert ASCII to Spectrum character
    sub 32          ; Adjust for character set
    
    ; Calculate screen position
    push hl
    push de
    
    ; Write character (8 bytes)
    ld h,0
    ld l,a
    add hl,hl      ; x2
    add hl,hl      ; x4
    add hl,hl      ; x8
    ld bc,$3C00     ; Character set in ROM
    add hl,bc       ; Character address
    
    ; Copy 8 bytes
    ld b,8
char_loop:
    ld a,(hl)       ; Get byte from ROM
    ld (de),a       ; Write to screen
    inc hl
    inc d           ; Next screen row
    djnz char_loop
    
    pop de
    pop hl
    
    ; Next character position
    inc e           ; Next column
    inc hl          ; Next character
    jr print_string

message:
    defb "RAINBOW BORDERS!",0

rainbow_data:
    defb 0,1,2,3,4,5,6,7    ; Black through white

border_color:
    defb 0

    end start