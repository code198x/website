# Export SID tune from GoatTracker as binary
# Then include in your assembly:

*=$1000
music:  !binary "music.sid",$7e,$7e

; In your code:
        jsr $1000       ; Initialize music

        ; In interrupt handler:
        jsr $1003       ; Play music frame