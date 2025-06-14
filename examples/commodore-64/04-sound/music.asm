; Commodore 64 - Simple Music Example
; Demonstrates SID chip programming
;
; Learning objectives:
; - SID register organization
; - ADSR envelope control
; - Frequency calculation
; - Simple note sequencing

; SID registers (Voice 1)
SID_FREQ_LO      = $D400
SID_FREQ_HI      = $D401
SID_PULSE_LO     = $D402
SID_PULSE_HI     = $D403
SID_CONTROL      = $D404
SID_ATTACK       = $D405
SID_SUSTAIN      = $D406
SID_FILTER_FREQ  = $D415
SID_FILTER_CTRL  = $D417
SID_VOLUME       = $D418

; Zero page
NOTE_INDEX       = $FB
NOTE_DURATION    = $FC

*=$0801             ; BASIC start address

; BASIC stub: 10 SYS 2061
.byte $0c,$08,$0a,$00,$9e,$20,$32,$30,$36,$31,$00,$00,$00

*=$080d             ; Start of ML program

start:
    ; Initialize SID
    lda #0
    ldx #24         ; Clear all SID registers
clear_sid:
    sta $D400,x
    dex
    bpl clear_sid
    
    ; Set volume to maximum
    lda #15
    sta SID_VOLUME
    
    ; Set ADSR envelope
    lda #$00        ; Attack=0, Decay=0
    sta SID_ATTACK
    lda #$F9        ; Sustain=15, Release=9
    sta SID_SUSTAIN
    
    ; Set pulse width to 50%
    lda #$00
    sta SID_PULSE_LO
    lda #$08
    sta SID_PULSE_HI
    
    ; Initialize variables
    lda #0
    sta NOTE_INDEX
    sta NOTE_DURATION

play_loop:
    ; Check if current note is done
    lda NOTE_DURATION
    beq next_note
    dec NOTE_DURATION
    jmp wait_frame
    
next_note:
    ; Get note index
    ldx NOTE_INDEX
    
    ; Check for end of song
    lda melody_notes,x
    cmp #$FF
    bne play_note
    
    ; Loop back to start
    lda #0
    sta NOTE_INDEX
    tax
    lda melody_notes,x
    
play_note:
    ; Look up frequency
    asl                 ; Multiply by 2 (word table)
    tay
    lda freq_table,y
    sta SID_FREQ_LO
    lda freq_table+1,y
    sta SID_FREQ_HI
    
    ; Get duration
    lda melody_duration,x
    sta NOTE_DURATION
    
    ; Gate on (start note)
    lda #$41        ; Pulse waveform + gate
    sta SID_CONTROL
    
    ; Next note
    inc NOTE_INDEX
    
wait_frame:
    ; Wait for one frame (1/60 second)
    lda #150
wait_raster:
    cmp $D012
    bne wait_raster
    
    ; Check if note should end
    lda NOTE_DURATION
    cmp #5          ; Release phase
    bne continue
    
    ; Gate off (release note)
    lda #$40        ; Pulse waveform, gate off
    sta SID_CONTROL
    
continue:
    jmp play_loop

; Note frequency table (PAL C64)
; C, C#, D, D#, E, F, F#, G, G#, A, A#, B (one octave)
freq_table:
    .word 4291      ; C3
    .word 4547      ; C#3
    .word 4817      ; D3
    .word 5103      ; D#3
    .word 5407      ; E3
    .word 5728      ; F3
    .word 6069      ; F#3
    .word 6430      ; G3
    .word 6812      ; G#3
    .word 7217      ; A3
    .word 7647      ; A#3
    .word 8101      ; B3
    .word 8583      ; C4
    .word 9094      ; C#4
    .word 9634      ; D4
    .word 10207     ; D#4
    .word 10814     ; E4
    .word 11457     ; F4

; Simple melody (Mary Had a Little Lamb)
; Note indices: 0=C, 2=D, 4=E, 5=F, 7=G, 9=A, 11=B, 12=C4
melody_notes:
    .byte 4,2,0,2,4,4,4      ; E D C D E E E
    .byte 2,2,2               ; D D D
    .byte 4,7,7               ; E G G
    .byte 4,2,0,2,4,4,4      ; E D C D E E E
    .byte 4,2,2,4,2,0        ; E D D E D C
    .byte $FF                 ; End marker

; Note durations (in frames, 60fps)
melody_duration:
    .byte 30,30,30,30,30,30,60
    .byte 30,30,60
    .byte 30,30,60
    .byte 30,30,30,30,30,30,30
    .byte 30,30,30,30,30,90