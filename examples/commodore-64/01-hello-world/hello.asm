; Commodore 64 - Hello World Example
; Demonstrates basic screen output using KERNAL routines
; 
; Learning objectives:
; - Using KERNAL ROM routines
; - Screen memory organization
; - PETSCII character encoding

; KERNAL routine addresses
CHROUT = $FFD2      ; Output character in A

; System addresses
SCREEN = $0400      ; Screen memory start

*=$0801             ; BASIC start address

; BASIC stub: 10 SYS 2061
.byte $0c,$08,$0a,$00,$9e,$20,$32,$30,$36,$31,$00,$00,$00

*=$080d             ; Start of ML program

start:
    ; Clear screen using KERNAL routine
    lda #147        ; PETSCII clear screen
    jsr CHROUT
    
    ; Print "HELLO WORLD" using KERNAL
    ldx #0          ; String index
print_loop:
    lda message,x   ; Load character
    beq done        ; If zero, we're done
    jsr CHROUT      ; Print character
    inx             ; Next character
    jmp print_loop
    
done:
    ; Position cursor on line 10
    ldx #10
position_loop:
    lda #17         ; Cursor down
    jsr CHROUT
    dex
    bne position_loop
    
    ; Direct screen memory example
    ; Write "C64" directly to screen
    lda #3          ; 'C'
    sta SCREEN+440  ; Middle of screen
    lda #54         ; '6' 
    sta SCREEN+441
    lda #52         ; '4'
    sta SCREEN+442
    
    ; Color the text cyan
    lda #3          ; Cyan color
    sta $D800+440   ; Color RAM
    sta $D800+441
    sta $D800+442
    
    rts             ; Return to BASIC

message:
    .byte "HELLO WORLD FROM CODE LIKE IT'S 198X!",13,0