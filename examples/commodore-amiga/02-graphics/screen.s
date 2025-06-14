; Commodore Amiga - Graphics Example
; Demonstrates opening a screen and drawing pixels
;
; Learning objectives:
; - Opening graphics.library and intuition.library
; - Creating a custom screen
; - Direct bitplane manipulation
; - Clean shutdown procedures

; Library offsets
_LVOOpenLibrary     equ -552
_LVOCloseLibrary    equ -414

; Graphics library
_LVOLoadView        equ -222
_LVOWaitTOF         equ -270

; Intuition library
_LVOOpenScreen      equ -198
_LVOCloseScreen     equ -66

; System constants
_ExecBase           equ 4

; Screen dimensions
SCREEN_WIDTH        equ 320
SCREEN_HEIGHT       equ 256
SCREEN_DEPTH        equ 3       ; 8 colors

    section code,code

start:
    movem.l d0-d7/a0-a6,-(sp)
    
    ; Get ExecBase
    move.l  _ExecBase,a6
    
    ; Open graphics.library
    lea     gfxname(pc),a1
    moveq   #0,d0
    jsr     _LVOOpenLibrary(a6)
    move.l  d0,gfxbase
    beq     .error
    
    ; Open intuition.library
    lea     intuiname(pc),a1
    moveq   #0,d0
    jsr     _LVOOpenLibrary(a6)
    move.l  d0,intuibase
    beq     .cleanup_gfx
    
    ; Open custom screen
    move.l  intuibase(pc),a6
    lea     newscreen(pc),a0
    jsr     _LVOOpenScreen(a6)
    move.l  d0,screen
    beq     .cleanup_intui
    
    ; Get bitplane pointer
    move.l  screen(pc),a0
    move.l  8(a0),a1            ; sc_BitMap
    move.l  8(a1),a1            ; bm_Planes[0]
    
    ; Draw some patterns
    moveq   #63,d0              ; 64 lines
draw_loop:
    move.l  d0,d1
    asl.w   #5,d1               ; *32 (bytes per line)
    add.w   d1,a1               ; Point to line
    
    ; Draw horizontal pattern
    moveq   #9,d2               ; 10 words (320/32)
line_loop:
    move.w  d0,d3
    eor.w   d2,d3               ; XOR pattern
    move.w  d3,(a1)+
    dbf     d2,line_loop
    
    ; Next line
    suba.w  #40,a1              ; Back to start of line
    dbf     d0,draw_loop
    
    ; Wait for user input (simplified - just wait)
    move.l  gfxbase(pc),a6
    moveq   #100,d0             ; Wait ~2 seconds
wait_loop:
    jsr     _LVOWaitTOF(a6)     ; Wait for vertical blank
    dbf     d0,wait_loop
    
    ; Clean shutdown
    move.l  intuibase(pc),a6
    move.l  screen(pc),a0
    jsr     _LVOCloseScreen(a6)
    
.cleanup_intui:
    move.l  _ExecBase,a6
    move.l  intuibase(pc),a1
    jsr     _LVOCloseLibrary(a6)
    
.cleanup_gfx:
    move.l  gfxbase(pc),a1
    jsr     _LVOCloseLibrary(a6)
    
.error:
    movem.l (sp)+,d0-d7/a0-a6
    moveq   #0,d0
    rts

; Screen structure
newscreen:
    dc.w    0,0                 ; LeftEdge, TopEdge
    dc.w    SCREEN_WIDTH        ; Width
    dc.w    SCREEN_HEIGHT       ; Height
    dc.w    SCREEN_DEPTH        ; Depth
    dc.b    0,1                 ; DetailPen, BlockPen
    dc.w    0                   ; ViewModes
    dc.w    $0001               ; Type (CUSTOMSCREEN)
    dc.l    0                   ; Font
    dc.l    screentitle         ; DefaultTitle
    dc.l    0                   ; Gadgets
    dc.l    0                   ; CustomBitMap

; Data
gfxname:
    dc.b    'graphics.library',0
intuiname:
    dc.b    'intuition.library',0
screentitle:
    dc.b    'Code Like It',39,'s 198x - Graphics Demo',0
    even

; Variables
gfxbase:    dc.l    0
intuibase:  dc.l    0
screen:     dc.l    0

    end