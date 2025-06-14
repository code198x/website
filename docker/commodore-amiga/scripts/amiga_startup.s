; Standard Amiga startup code template
; Sets up a proper Amiga executable with OS-friendly initialization

    section code,code

; Amiga OS library offsets
_LVOOpenLibrary     equ -552
_LVOCloseLibrary    equ -414
_LVOOutput          equ -60
_LVOWrite           equ -48

; Exec library base
_ExecBase           equ 4

start:
    ; Save registers
    movem.l d0-d7/a0-a6,-(sp)
    
    ; Get ExecBase
    move.l  _ExecBase,a6
    
    ; Open dos.library
    lea     dosname(pc),a1
    moveq   #0,d0               ; Any version
    jsr     _LVOOpenLibrary(a6)
    move.l  d0,dosbase
    beq.s   .error
    
    ; Get output handle
    move.l  dosbase(pc),a6
    jsr     _LVOOutput(a6)
    move.l  d0,d1               ; File handle
    beq.s   .cleanup
    
    ; Write message
    move.l  #message,d2         ; Message pointer
    moveq   #msgend-message,d3  ; Message length
    jsr     _LVOWrite(a6)
    
.cleanup:
    ; Close dos.library
    move.l  _ExecBase,a6
    move.l  dosbase(pc),a1
    jsr     _LVOCloseLibrary(a6)
    
.error:
    ; Restore registers
    movem.l (sp)+,d0-d7/a0-a6
    moveq   #0,d0               ; Return code 0
    rts

dosname:    dc.b    'dos.library',0
    even

message:    dc.b    'Hello from Code Like It',39,'s 198x!',10
msgend:
    even

dosbase:    dc.l    0

    end