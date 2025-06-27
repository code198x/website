; Neon Nexus - Lesson 1
; Border color change test

*= $c000               ; Load at $c000 (49152)

start:
        lda #$02        ; Load red color
        sta $d020       ; Store to border color register
        rts