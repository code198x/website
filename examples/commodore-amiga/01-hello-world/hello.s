; Commodore Amiga - Hello World Example
; Demonstrates basic OS library calls and console output
;
; Learning objectives:
; - Opening and using dos.library
; - Writing to console output
; - Proper OS-friendly program structure
; - Clean library cleanup

; Exec library offsets
_LVOOpenLibrary     equ -552
_LVOCloseLibrary    equ -414

; DOS library offsets
_LVOOutput          equ -60
_LVOWrite           equ -48

; System constants
_ExecBase           equ 4

    section code,code

start:
    ; Save registers for OS compliance
    movem.l d0-d7/a0-a6,-(sp)
    
    ; Get ExecBase (system library)
    move.l  _ExecBase,a6
    
    ; Open dos.library
    lea     dosname(pc),a1
    moveq   #0,d0               ; Any version
    jsr     _LVOOpenLibrary(a6)
    move.l  d0,dosbase
    beq.s   .error              ; Failed to open
    
    ; Get standard output handle
    move.l  dosbase(pc),a6
    jsr     _LVOOutput(a6)
    move.l  d0,d1               ; File handle for Write()
    beq.s   .cleanup
    
    ; Write hello message
    move.l  #hello_msg,d2       ; Message pointer
    moveq   #hello_len,d3       ; Message length
    jsr     _LVOWrite(a6)
    
    ; Write system info
    move.l  #info_msg,d2
    moveq   #info_len,d3
    jsr     _LVOWrite(a6)
    
    ; Show 68000 capabilities
    move.l  #cpu_msg,d2
    moveq   #cpu_len,d3
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

; Data section
dosname:
    dc.b    'dos.library',0
    even

hello_msg:
    dc.b    'Hello from the Amiga!',10
hello_len = *-hello_msg

info_msg:
    dc.b    'Running on Motorola 68000 processor',10
info_len = *-info_msg

cpu_msg:
    dc.b    '32-bit registers, 16MB address space',10
    dc.b    'Welcome to Code Like It',39,'s 198x!',10
cpu_len = *-cpu_msg

; Variables
dosbase:
    dc.l    0

    end