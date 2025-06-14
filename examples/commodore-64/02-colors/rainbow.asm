; Commodore 64 - Rainbow Border Example
; Demonstrates VIC-II timing and raster interrupts
;
; Learning objectives:
; - VIC-II registers and timing
; - Raster interrupts
; - Color cycling effects

; VIC-II registers
BORDER_COLOR = $D020
SCREEN_COLOR = $D021
RASTER_LINE  = $D012
VIC_CONTROL  = $D011
IRQ_ENABLE   = $D01A
IRQ_STATUS   = $D019

; System vectors
IRQ_VECTOR   = $0314

*=$0801             ; BASIC start address

; BASIC stub: 10 SYS 2061
.byte $0c,$08,$0a,$00,$9e,$20,$32,$30,$36,$31,$00,$00,$00

*=$080d             ; Start of ML program

start:
    sei             ; Disable interrupts
    
    ; Set up raster interrupt
    lda #<irq       ; Low byte of IRQ handler
    sta IRQ_VECTOR
    lda #>irq       ; High byte of IRQ handler
    sta IRQ_VECTOR+1
    
    ; Enable raster interrupt at line 50
    lda #50
    sta RASTER_LINE
    lda VIC_CONTROL
    and #$7f        ; Clear high bit of raster line
    sta VIC_CONTROL
    
    ; Enable raster interrupts
    lda #$01
    sta IRQ_ENABLE
    
    ; Clear interrupt flag
    lda #$ff
    sta IRQ_STATUS
    
    cli             ; Enable interrupts
    
    ; Main loop - just wait
mainloop:
    jmp mainloop

; Interrupt handler
irq:
    ; Acknowledge interrupt
    lda #$ff
    sta IRQ_STATUS
    
    ; Save accumulator
    pha
    
    ; Cycle through colors
    ldx #0
color_loop:
    lda color_table,x
    sta BORDER_COLOR
    
    ; Wait for next raster line
    ldy #8
delay:
    dey
    bne delay
    
    inx
    cpx #16         ; 16 colors in table
    bne color_loop
    
    ; Reset border to black
    lda #0
    sta BORDER_COLOR
    
    ; Set next interrupt at line 250
    lda #250
    sta RASTER_LINE
    
    ; Restore accumulator
    pla
    
    ; Return from interrupt
    jmp $EA31       ; Jump to KERNAL IRQ handler

; Color table for rainbow effect
color_table:
    .byte 2,2       ; Red
    .byte 8,8       ; Orange  
    .byte 7,7       ; Yellow
    .byte 5,5       ; Green
    .byte 3,3       ; Cyan
    .byte 6,6       ; Blue
    .byte 4,4       ; Purple
    .byte 1,1       ; White