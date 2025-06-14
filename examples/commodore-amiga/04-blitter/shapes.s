; Commodore Amiga - Blitter Example
; Demonstrates the Blitter for fast graphics operations
;
; Learning objectives:
; - Understanding the Blitter coprocessor
; - Setting up blitter operations
; - Fast rectangle filling and copying
; - DMA and hardware acceleration

; Blitter registers
BLTCON0         equ $DFF040
BLTCON1         equ $DFF042
BLTAFWM         equ $DFF044
BLTALWM         equ $DFF046
BLTCPTH         equ $DFF048
BLTCPTL         equ $DFF04A
BLTBPTH         equ $DFF04C
BLTBPTL         equ $DFF04E
BLTAPTH         equ $DFF050
BLTAPTL         equ $DFF052
BLTDPTH         equ $DFF054
BLTDPTL         equ $DFF056
BLTSIZE         equ $DFF058
BLTCMOD         equ $DFF060
BLTBMOD         equ $DFF062
BLTAMOD         equ $DFF064
BLTDMOD         equ $DFF066
BLTCDAT         equ $DFF070
BLTBDAT         equ $DFF072
BLTADAT         equ $DFF074

; DMA control
DMACONR         equ $DFF002
DMACON          equ $DFF096

    section code,code

start:
    movem.l d0-d7/a0-a6,-(sp)
    
    ; Allocate chip memory for our screen
    move.l  $4.w,a6             ; ExecBase
    move.l  #40*256,d0          ; 320x256x1 bitplane
    move.l  #$00020002,d1       ; MEMF_CHIP | MEMF_CLEAR
    jsr     -198(a6)            ; AllocMem()
    move.l  d0,screen_mem
    beq     .error
    
    ; Enable blitter DMA
    move.l  #$DFF000,a5         ; Custom chips
    move.w  #$8000|$0040,DMACON(a5)  ; Enable blitter DMA
    
    ; Draw some shapes using blitter
    bsr     draw_rectangle
    bsr     draw_line
    bsr     draw_circle
    
    ; Wait a while to see the result
    moveq   #100,d0
wait_loop:
    jsr     -132(a6)            ; Forbid() - simple delay
    jsr     -138(a6)            ; Permit()
    dbf     d0,wait_loop
    
    ; Free memory
    move.l  screen_mem(pc),a1
    move.l  #40*256,d0
    jsr     -210(a6)            ; FreeMem()
    
.error:
    movem.l (sp)+,d0-d7/a0-a6
    rts

; Draw filled rectangle using blitter
draw_rectangle:
    ; Wait for blitter to be free
    move.l  #$DFF000,a5
wait_blit1:
    btst    #14,DMACONR(a5)     ; Check blitter busy bit
    bne.s   wait_blit1
    
    ; Set up blitter for rectangle fill
    ; A channel = pattern (not used)
    ; B channel = not used  
    ; C channel = not used
    ; D channel = destination
    
    move.w  #$09F0,BLTCON0(a5)  ; Use D only, LF=$F0 (fill)
    move.w  #$0000,BLTCON1(a5)  ; No line mode
    
    ; Set destination
    move.l  screen_mem(pc),d0
    add.l   #10*40+5,d0         ; Offset to position
    move.w  d0,BLTDPTL(a5)
    swap    d0
    move.w  d0,BLTDPTH(a5)
    
    ; Set modulo (bytes to skip at end of each line)
    move.w  #40-10,BLTDMOD(a5)  ; Screen width - rectangle width
    
    ; Set masks
    move.w  #$FFFF,BLTAFWM(a5)  ; First word mask
    move.w  #$FFFF,BLTALWM(a5)  ; Last word mask
    
    ; Start blitter (width=5 words, height=20 lines)
    move.w  #20*64+5,BLTSIZE(a5)
    
    rts

; Draw line using blitter line mode
draw_line:
    ; Wait for blitter
    move.l  #$DFF000,a5
wait_blit2:
    btst    #14,DMACONR(a5)
    bne.s   wait_blit2
    
    ; Line from (50,50) to (150,100)
    moveq   #100,d0             ; dx = 100
    moveq   #50,d1              ; dy = 50
    
    ; Set up line drawing
    move.w  #$0B4A,BLTCON0(a5)  ; Line mode, pattern
    move.w  #$0004,BLTCON1(a5)  ; Line mode, direction
    
    ; Set line pattern
    move.w  #$FFFF,BLTADAT(a5)  ; Solid line
    
    ; Calculate destination address
    move.l  screen_mem(pc),a0
    add.l   #50*40+50/8,a0      ; Start position
    move.l  a0,d2
    move.w  d2,BLTDPTL(a5)
    swap    d2
    move.w  d2,BLTDPTH(a5)
    
    ; Set modulo
    move.w  #40,BLTDMOD(a5)     ; Screen width
    
    ; Start line (simplified - proper line setup is complex)
    move.w  #64+1,BLTSIZE(a5)   ; Height=1, width=1 word
    
    rts

; Draw circle (simplified - just a few points)
draw_circle:
    ; Wait for blitter
    move.l  #$DFF000,a5
wait_blit3:
    btst    #14,DMACONR(a5)
    bne.s   wait_blit3
    
    ; Draw a simple filled circle using multiple rectangles
    ; This is a simplified approach - real circle would use
    ; more sophisticated algorithm
    
    move.w  #$09F0,BLTCON0(a5)  ; Fill mode
    move.w  #$0000,BLTCON1(a5)
    
    ; Center circle at (200, 128)
    move.l  screen_mem(pc),d0
    add.l   #128*40+200/8,d0    ; Center position
    move.w  d0,BLTDPTL(a5)
    swap    d0
    move.w  d0,BLTDPTH(a5)
    
    move.w  #40-4,BLTDMOD(a5)   ; Modulo
    move.w  #$FFFF,BLTAFWM(a5)
    move.w  #$FFFF,BLTALWM(a5)
    
    ; Draw center part of circle (4 words wide, 10 lines tall)
    move.w  #10*64+4,BLTSIZE(a5)
    
    rts

    section bss,bss
screen_mem:     ds.l    1

    end