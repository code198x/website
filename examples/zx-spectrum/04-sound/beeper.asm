; ZX Spectrum - Beeper Sound Example
; Demonstrates sound generation using the beeper
;
; Learning objectives:
; - Understanding the beeper output (bit 4 of port 254)
; - Frequency generation through timing loops
; - Creating musical notes
; - Sound effects techniques

    org 32768

; Note frequency values (delays)
; Higher values = lower frequency
NOTE_C      equ 956
NOTE_D      equ 851
NOTE_E      equ 758
NOTE_F      equ 716
NOTE_G      equ 638
NOTE_A      equ 568
NOTE_B      equ 506
NOTE_C2     equ 478

start:
    ; Clear screen
    xor a
    out (254),a
    ld a,7
    ld (23693),a
    call $0DAF
    
    ; Print title
    ld hl,title
    ld de,16384+2*32+8
    call print_msg
    
    ; Play a scale
    ld hl,scale
play_scale:
    ld e,(hl)       ; Get frequency low
    inc hl
    ld d,(hl)       ; Get frequency high
    inc hl
    
    ; Check for end
    ld a,d
    or e
    jr z,sound_effects
    
    ; Play note for fixed duration
    ld bc,200       ; Duration
    call beep
    
    ; Short pause between notes
    ld bc,5000
pause:
    dec bc
    ld a,b
    or c
    jr nz,pause
    
    jr play_scale

sound_effects:
    ; Play some sound effects
    
    ; Laser sound
    ld hl,laser_msg
    ld de,16384+5*32+10
    call print_msg
    call laser_sound
    
    ; Explosion
    ld hl,explosion_msg
    ld de,16384+7*32+10
    call print_msg
    call explosion_sound
    
    ; Pickup sound
    ld hl,pickup_msg
    ld de,16384+9*32+10
    call print_msg
    call pickup_sound
    
    ret

; Beep routine
; BC = duration, DE = frequency
beep:
    di              ; Disable interrupts
beep_loop:
    push bc         ; Save duration
    push de         ; Save frequency
    
    ; Toggle speaker
    ld a,(border_color)
    xor 16          ; Toggle bit 4
    ld (border_color),a
    out (254),a
    
    ; Delay for half cycle
    pop de          ; Get frequency
    push de
freq_loop:
    dec de
    ld a,d
    or e
    jr nz,freq_loop
    
    pop de          ; Restore frequency
    pop bc          ; Restore duration
    
    dec bc
    ld a,b
    or c
    jr nz,beep_loop
    
    ei              ; Enable interrupts
    ret

; Laser sound effect
laser_sound:
    ld de,100       ; Start frequency
laser_loop:
    push de
    ld bc,5         ; Very short duration
    call beep
    pop de
    
    ; Increase frequency (higher pitch)
    inc de
    inc de
    inc de
    
    ; Check if done
    ld a,d
    cp 2            ; Stop at frequency 512
    jr nz,laser_loop
    ret

; Explosion sound effect
explosion_sound:
    call random_noise
    ret

; Random noise generator
random_noise:
    ld bc,5000      ; Duration
noise_loop:
    push bc
    
    ; Get "random" value
    ld a,r          ; R register is somewhat random
    and 16          ; Mask to bit 4
    or 2            ; Keep border red
    out (254),a
    
    ; Random delay
    ld b,a
    and 31          ; 0-31
    ld b,a
delay_noise:
    djnz delay_noise
    
    pop bc
    dec bc
    ld a,b
    or c
    jr nz,noise_loop
    
    ; Silence
    ld a,2
    out (254),a
    ret

; Pickup sound (ascending tones)
pickup_sound:
    ld hl,pickup_notes
pickup_loop:
    ld e,(hl)
    inc hl
    ld d,(hl)
    inc hl
    
    ld a,d
    or e
    ret z           ; End of notes
    
    ld bc,50        ; Short duration
    call beep
    jr pickup_loop

; Print message
print_msg:
    ld a,(hl)
    or a
    ret z
    ld (de),a
    inc hl
    inc de
    jr print_msg

; Data
title:
    defb "SPECTRUM BEEPER DEMO",0

laser_msg:
    defb "LASER",0

explosion_msg:
    defb "BOOM!",0

pickup_msg:
    defb "PICKUP",0

; Musical scale frequencies
scale:
    defw NOTE_C
    defw NOTE_D
    defw NOTE_E
    defw NOTE_F
    defw NOTE_G
    defw NOTE_A
    defw NOTE_B
    defw NOTE_C2
    defw 0          ; End marker

; Pickup sound notes
pickup_notes:
    defw 400
    defw 300
    defw 200
    defw 150
    defw 100
    defw 0

border_color:
    defb 2          ; Red border

    end start