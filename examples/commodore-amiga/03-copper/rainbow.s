; Commodore Amiga - Copper Rainbow Example
; Demonstrates the Copper coprocessor for raster effects
;
; Learning objectives:
; - Understanding the Copper coprocessor
; - Creating copper lists for color changes
; - Synchronizing with raster position
; - Hardware register manipulation

; Custom chip registers
DMACONR         equ $DFF002
DMACON          equ $DFF096
COPCON          equ $DFF02E
COP1LC          equ $DFF080
COPJMP1         equ $DFF088
COLOR00         equ $DFF180

; Copper instructions
WAIT_CMD        equ $0001
MOVE_CMD        equ $0000

    section code,code

start:
    movem.l d0-d7/a0-a6,-(sp)
    
    ; Take over the system (demo style)
    move.l  $4.w,a6             ; ExecBase
    jsr     -132(a6)            ; Forbid()
    
    ; Wait for vertical blank
    move.l  #$DFF000,a5         ; Custom chip base
    
wait_vblank:
    move.w  $DFF004,d0          ; VPOSR
    and.w   #$FF00,d0
    cmp.w   #$3000,d0           ; Line 48
    bne.s   wait_vblank
    
    ; Save original copper list
    move.l  COP1LC(a5),old_copper
    
    ; Enable copper
    move.w  #$8000|$0040,DMACON(a5)  ; Set DMA enable bit
    move.w  #$0001,COPCON(a5)        ; Enable copper
    
    ; Install our copper list
    move.l  #copperlist,COP1LC(a5)
    move.w  #0,COPJMP1(a5)      ; Start copper
    
    ; Main loop - run for a while
    move.w  #600,d7             ; ~10 seconds
main_loop:
    ; Wait for vertical blank
    move.w  $DFF004,d0
    and.w   #$FF00,d0
    cmp.w   #$3000,d0
    bne.s   main_loop
    
    ; Update colors in copper list
    lea     copperlist+4,a0     ; First color entry
    moveq   #15,d0              ; 16 colors
    
update_colors:
    move.w  2(a0),d1            ; Get current color
    add.w   #$0111,d1           ; Increment RGB
    and.w   #$0FFF,d1           ; Keep in range
    move.w  d1,2(a0)            ; Store back
    addq.l  #8,a0               ; Next color entry
    dbf     d0,update_colors
    
    dbf     d7,main_loop
    
    ; Restore system
    move.l  old_copper(pc),COP1LC(a5)
    move.w  #0,COPJMP1(a5)
    
    move.l  $4.w,a6
    jsr     -138(a6)            ; Permit()
    
    movem.l (sp)+,d0-d7/a0-a6
    rts

; Copper list for rainbow effect
    section data,data
copperlist:
    ; Rainbow bars - wait for specific lines and change color
    dc.w    $3001,$FFFE         ; Wait for line $30
    dc.w    COLOR00,$0F00       ; Red
    
    dc.w    $4001,$FFFE         ; Wait for line $40
    dc.w    COLOR00,$0F80       ; Orange
    
    dc.w    $5001,$FFFE         ; Wait for line $50
    dc.w    COLOR00,$0FF0       ; Yellow
    
    dc.w    $6001,$FFFE         ; Wait for line $60
    dc.w    COLOR00,$00F0       ; Green
    
    dc.w    $7001,$FFFE         ; Wait for line $70
    dc.w    COLOR00,$00FF       ; Cyan
    
    dc.w    $8001,$FFFE         ; Wait for line $80
    dc.w    COLOR00,$000F       ; Blue
    
    dc.w    $9001,$FFFE         ; Wait for line $90
    dc.w    COLOR00,$0F0F       ; Magenta
    
    dc.w    $A001,$FFFE         ; Wait for line $A0
    dc.w    COLOR00,$0FFF       ; White
    
    dc.w    $B001,$FFFE         ; Wait for line $B0
    dc.w    COLOR00,$0888       ; Gray
    
    dc.w    $C001,$FFFE         ; Wait for line $C0
    dc.w    COLOR00,$0000       ; Black
    
    dc.w    $D001,$FFFE         ; Wait for line $D0
    dc.w    COLOR00,$0F44       ; Pink
    
    dc.w    $E001,$FFFE         ; Wait for line $E0
    dc.w    COLOR00,$04F4       ; Light green
    
    dc.w    $F001,$FFFE         ; Wait for line $F0
    dc.w    COLOR00,$044F       ; Light blue
    
    dc.w    $0001,$FFFE         ; Wait for line $100
    dc.w    COLOR00,$0840       ; Brown
    
    dc.w    $1001,$FFFE         ; Wait for line $110
    dc.w    COLOR00,$0F84       ; Orange-red
    
    dc.w    $FFFF,$FFFE         ; End of copper list

    section bss,bss
old_copper:     ds.l    1

    end