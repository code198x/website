---
title: "Pulse Wave Sound Generation"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 18
description: "Master NES pulse wave sound generation for creating melodies and sound effects. Learn duty cycles, frequency sweeps, envelopes, and advanced techniques for rich chiptune audio."
learning_objectives:
  - "Master pulse wave duty cycles and timbres"
  - "Learn frequency sweep effects and pitch bending"
  - "Control volume envelopes for dynamic sounds"
  - "Create realistic sound effects using pulse waves"
  - "Build advanced audio functions for Sprite Symphony"
concepts:
  - "Pulse wave duty cycles (12.5%, 25%, 50%, 75%)"
  - "Frequency sweep and pitch effects"
  - "Volume envelopes and fade effects"
  - "Sound effect programming"
  - "Advanced pulse wave techniques"
estimated_duration: "55-70 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 18
---

# Lesson 18: Pulse Wave Sound Generation

Welcome to advanced NES audio! Today you'll master pulse wave sound generation - the foundation of NES music and sound effects. Pulse waves create the distinctive "chiptune" sound that defined classic games.

## Understanding Pulse Waves

Pulse waves are square waves with variable duty cycles:

- **Duty Cycle**: The percentage of time the wave is "high" vs "low"
- **Timbre**: Different duty cycles create different tonal qualities
- **Harmonics**: Each duty cycle emphasizes different overtones
- **Character**: What gives each pulse channel its unique sound

The NES provides 4 different duty cycles for creative sound design.

## The Four Duty Cycles

### 12.5% Duty Cycle (00)

- **Sound**: Thin, buzzy, nasal quality
- **Use**: Lead lines, sci-fi effects, thin melodies
- **Character**: Sharp, cutting through mix

### 25% Duty Cycle (01)

- **Sound**: Fuller than 12.5%, still bright
- **Use**: Melody lines, arpeggios, clear leads
- **Character**: Balanced, musical

### 50% Duty Cycle (10)

- **Sound**: Classic square wave, rich harmonics
- **Use**: Bass lines, chords, powerful melodies
- **Character**: Full, strong presence

### 75% Duty Cycle (11)

- **Sound**: Similar to 25% but phase-inverted
- **Use**: Special effects, variation on 25%
- **Character**: Unique harmonic structure

**Duty Cycle Comparison:**

```assembly
; Compare different duty cycles on the same note
JSR test_duty_cycles

test_duty_cycles:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015

    ; Set consistent frequency (middle C)
    LDA #$FE
    STA $4002
    LDA #$01
    STA $4003

    ; Test 12.5% duty - thin sound
    LDA #%00111111  ; 12.5% duty, volume 15
    STA $4000

    ; Test 25% duty - balanced sound
    LDA #%01111111  ; 25% duty, volume 15
    STA $4000

    ; Test 50% duty - full square wave
    LDA #%10111111  ; 50% duty, volume 15
    STA $4000

    ; Test 75% duty - inverted 25%
    LDA #%11111111  ; 75% duty, volume 15
    STA $4000

    RTS

; Each duty cycle creates a different timbre!
```

## Frequency Sweep Effects

Pulse channel 1 has a unique frequency sweep feature for pitch effects:

### Sweep Register ($4001)

```
Bit 7: Sweep Enable (0=disable, 1=enable)
Bits 6-4: Sweep Period (how often to sweep)
Bit 3: Sweep Direction (0=up, 1=down)
Bits 2-0: Sweep Shift Amount
```

### Creating Sweep Effects

```text
; Upward sweep (rising pitch)
play_rising_sweep:
    LDA #%10000001  ; Enable, period 0, up, shift 1
    STA $4001       ; Sweep register

    LDA #%10111111  ; 50% duty, max volume
    STA $4000       ; Pulse 1 control

    ; Start at low frequency
    LDA #$00        ; Low frequency start
    STA $4002
    LDA #$02
    STA $4003

    RTS

; Downward sweep (falling pitch)
play_falling_sweep:
    LDA #%10001001  ; Enable, period 0, down, shift 1
    STA $4001       ; Sweep register

    LDA #%10111111  ; 50% duty, max volume
    STA $4000       ; Pulse 1 control

    ; Start at high frequency
    LDA #$FE        ; High frequency start
    STA $4002
    LDA #$01
    STA $4003

    RTS
```

**Frequency Sweep Effects:**

```assembly
; Demonstrate frequency sweep effects
JSR demo_sweep_effects

demo_sweep_effects:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015

    ; Setup for upward sweep effect
    LDA #%10000010  ; Enable sweep, period 0, up, shift 2
    STA $4001       ; Pulse 1 sweep register

    LDA #%10111111  ; 50% duty, constant volume 15
    STA $4000       ; Pulse 1 control

    ; Start frequency (will sweep upward)
    LDA #$00        ; Low starting frequency
    STA $4002       ; Frequency low
    LDA #$03        ; Frequency high
    STA $4003       ; Frequency high + trigger sweep

    RTS

; Sound will sweep upward in pitch automatically!
```

## Volume Envelopes

Envelopes create dynamic volume changes over time:

### Envelope Control

- **Constant Volume**: Fixed volume level (0-15)
- **Envelope Mode**: Automatic volume decay
- **Decay Rate**: How fast volume decreases (0-15)
- **Loop**: Whether envelope repeats

```text
; Constant volume examples
LDA #%10110001  ; Constant volume 1 (quiet)
LDA #%10111000  ; Constant volume 8 (medium)
LDA #%10111111  ; Constant volume 15 (loud)

; Envelope examples
LDA #%10100001  ; Envelope, fast decay (1)
LDA #%10101000  ; Envelope, medium decay (8)
LDA #%10101111  ; Envelope, slow decay (15)
LDA #%10110000  ; Envelope, instant decay (0)
```

**Volume Envelope Effects:**

```assembly
; Demonstrate different envelope effects
JSR demo_envelopes

demo_envelopes:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015

    ; Set frequency for consistent pitch
    LDA #$FE
    STA $4002
    LDA #$01
    STA $4003

    ; Fast attack envelope (quick fade)
    LDA #%10100010  ; 50% duty, envelope mode, decay rate 2
    STA $4000

    ; Retrigger the envelope
    LDA #$01        ; Write to length counter
    STA $4003       ; Triggers envelope restart

    ; Medium decay envelope
    LDA #%10100110  ; 50% duty, envelope mode, decay rate 6
    STA $4000

    ; Retrigger
    LDA #$01
    STA $4003

    ; Slow decay envelope
    LDA #%10101100  ; 50% duty, envelope mode, decay rate 12
    STA $4000

    ; Retrigger
    LDA #$01
    STA $4003

    RTS

; Different envelope decay rates demonstrated!
```

## Sound Effect Programming

Pulse waves are perfect for game sound effects:

### Jump Sound Effect

```text
play_jump_sound:
    ; Quick upward sweep for jump
    LDA #%10000001  ; Sweep up, shift 1
    STA $4001

    LDA #%01100100  ; 25% duty, envelope decay 4
    STA $4000

    ; Start frequency
    LDA #$80
    STA $4002
    LDA #$02
    STA $4003

    RTS
```

### Coin Collection Sound

```text
play_coin_sound:
    ; High pitch with quick envelope
    LDA #%00000000  ; No sweep
    STA $4001

    LDA #%00100010  ; 12.5% duty, fast envelope
    STA $4000

    ; High frequency
    LDA #$FE
    STA $4002
    LDA #$01
    STA $4003

    RTS
```

### Explosion Sound

```text
play_explosion_sound:
    ; Downward sweep with envelope
    LDA #%10001011  ; Sweep down, shift 3 (fast drop)
    STA $4001

    LDA #%10100001  ; 50% duty, fast envelope
    STA $4000

    ; Start high, sweep down
    LDA #$FE
    STA $4002
    LDA #$01
    STA $4003

    RTS
```

**Game Sound Effects:**

```assembly
; Create classic game sound effects
JSR demo_sound_effects

demo_sound_effects:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015

    ; Jump sound effect
    JSR jump_sound

    ; Coin sound effect
    JSR coin_sound

    ; Power-up sound effect
    JSR powerup_sound

    RTS

; Jump sound - upward sweep
jump_sound:
    LDA #%10000010  ; Sweep up, shift 2
    STA $4001       ; Enable sweep
    LDA #%01100110  ; 25% duty, envelope decay 6
    STA $4000       ; Pulse control
    LDA #$40        ; Start frequency
    STA $4002
    LDA #$03        ; Trigger sound
    STA $4003
    RTS

; Coin sound - high pitch, quick decay
coin_sound:
    LDA #%00000000  ; No sweep
    STA $4001
    LDA #%00100011  ; 12.5% duty, envelope decay 3
    STA $4000
    LDA #$FE        ; High frequency
    STA $4002
    LDA #$01        ; Trigger sound
    STA $4003
    RTS

; Power-up sound - rising sweep
powerup_sound:
    LDA #%10000001  ; Sweep up, shift 1
    STA $4001
    LDA #%10101000  ; 50% duty, envelope decay 8
    STA $4000
    LDA #$00        ; Low start frequency
    STA $4002
    LDA #$04        ; Trigger sound
    STA $4003
    RTS

; Classic game sound effects complete!
```

## Advanced Pulse Wave Techniques

### Vibrato Effect

Create vibrato by rapidly changing frequency:

```text
vibrato_effect:
    LDA vibrato_counter
    AND #$03        ; 4-step vibrato cycle
    TAX
    LDA vibrato_table,X
    CLC
    ADC base_frequency
    STA $4002

    INC vibrato_counter
    RTS

vibrato_table:
    .byte $00, $02, $00, $FE    ; +0, +2, +0, -2
```

### Arpeggio Effect

Rapidly cycle through chord notes:

```text
arpeggio_effect:
    LDA arp_counter
    AND #$03        ; 4-step arpeggio
    TAX
    LDA chord_frequencies,X
    STA $4002

    INC arp_counter
    RTS

chord_frequencies:
    .byte $FE, $CA, $A2, $FE    ; C, E, G, C
```

## Sprite Symphony Pulse Wave System

Let's create an advanced audio system for our music project:

```text
init_symphony_pulse_system:
    ; Enable both pulse channels
    LDA #%00000011
    STA $4015

    ; Configure pulse 1 for melody (lead)
    LDA #%10111111  ; 50% duty, max volume
    STA $4000

    ; Configure pulse 2 for harmony (25% duty for contrast)
    LDA #%01111000  ; 25% duty, medium volume
    STA $4004

    ; Initialize note tables
    JSR setup_advanced_note_table

    RTS

play_symphony_note:
    ; A = note number, X = channel (0=pulse1, 1=pulse2)
    CPX #$00
    BEQ play_on_pulse1

play_on_pulse2:
    ASL A           ; Multiply by 2 for word table
    TAY
    LDA note_freq_table,Y
    STA $4006       ; Pulse 2 freq low
    LDA note_freq_table+1,Y
    STA $4007       ; Pulse 2 freq high
    RTS

play_on_pulse1:
    ASL A           ; Multiply by 2 for word table
    TAY
    LDA note_freq_table,Y
    STA $4002       ; Pulse 1 freq low
    LDA note_freq_table+1,Y
    STA $4003       ; Pulse 1 freq high
    RTS
```

**Advanced Sprite Symphony Audio:**

```assembly
; Advanced audio system for Sprite Symphony
JSR init_advanced_symphony

init_advanced_symphony:
    ; Enable both pulse channels
    LDA #%00000011  ; Pulse 1 and 2
    STA $4015

    ; Configure pulse 1 for lead melody
    LDA #%10111111  ; 50% duty, constant volume 15
    STA $4000       ; Pulse 1 control

    ; Configure pulse 2 for harmony
    LDA #%01111010  ; 25% duty, constant volume 10
    STA $4004       ; Pulse 2 control

    ; Setup enhanced note frequency table
    ; C note
    LDA #$FE        ; C low
    STA $0370       ; note_table[0]
    LDA #$01        ; C high
    STA $0371       ; note_table[1]

    ; D note
    LDA #$E2        ; D low
    STA $0372       ; note_table[2]
    LDA #$01        ; D high
    STA $0373       ; note_table[3]

    ; E note
    LDA #$CA        ; E low
    STA $0374       ; note_table[4]
    LDA #$01        ; E high
    STA $0375       ; note_table[5]

    ; F note
    LDA #$B5        ; F low
    STA $0376       ; note_table[6]
    LDA #$01        ; F high
    STA $0377       ; note_table[7]

    RTS

; Play note on specific channel
; A = note index (0-3), X = channel (0=pulse1, 1=pulse2)
play_note_on_channel:
    ; Calculate table offset (note * 2)
    ASL A           ; Multiply by 2
    TAY             ; Use as index

    CPX #$00        ; Check channel
    BEQ use_pulse1

    ; Use pulse 2
    LDA $0370,Y     ; Get frequency low
    STA $4006       ; Pulse 2 freq low
    LDA $0371,Y     ; Get frequency high
    STA $4007       ; Pulse 2 freq high
    RTS

use_pulse1:
    LDA $0370,Y     ; Get frequency low
    STA $4002       ; Pulse 1 freq low
    LDA $0371,Y     ; Get frequency high
    STA $4003       ; Pulse 1 freq high
    RTS

; Play harmony - C major chord
play_chord:
    ; Play C on pulse 1
    LDA #$00        ; Note C
    LDX #$00        ; Pulse 1
    JSR play_note_on_channel

    ; Play E on pulse 2 (harmony)
    LDA #$02        ; Note E
    LDX #$01        ; Pulse 2
    JSR play_note_on_channel

    RTS

; Test the system
JSR play_chord

; Advanced Sprite Symphony audio system working!
```

## Practical Exercise: Sound Effect Library

Create a complete sound effect library with:

1. Jump sound (upward sweep)
2. Coin sound (high pitch, quick decay)
3. Explosion sound (downward sweep, envelope)
4. Power-up sound (rising frequency with vibrato)
5. Menu beep (short, clear tone)

**Practice: Sound Effect Library:**

```assembly
; Complete Sound Effect Library
JSR init_sound_library

init_sound_library:
    ; Enable pulse 1 for sound effects
    LDA #%00000001
    STA $4015
    RTS

; 1. Jump sound - upward sweep
sfx_jump:
    LDA #%10000010  ; Sweep up, shift 2
    STA $4001       ; Pulse 1 sweep
    LDA #%01100101  ; 25% duty, envelope decay 5
    STA $4000       ; Pulse 1 control
    LDA #$60        ; Start frequency
    STA $4002       ; Frequency low
    LDA #$02        ; Trigger sound
    STA $4003       ; Frequency high
    RTS

; 2. Coin sound - high pitch, quick decay
sfx_coin:
    LDA #%00000000  ; No sweep
    STA $4001
    LDA #%00100010  ; 12.5% duty, envelope decay 2
    STA $4000
    LDA #$FE        ; High frequency
    STA $4002
    LDA #$01        ; Trigger sound
    STA $4003
    RTS

; 3. Explosion sound - downward sweep
sfx_explosion:
    LDA #%10001100  ; Sweep down, shift 4 (fast drop)
    STA $4001
    LDA #%10100011  ; 50% duty, envelope decay 3
    STA $4000
    LDA #$80        ; Start frequency
    STA $4002
    LDA #$01        ; Trigger sound
    STA $4003
    RTS

; 4. Power-up sound - rising with envelope
sfx_powerup:
    LDA #%10000001  ; Sweep up, shift 1
    STA $4001
    LDA #%10101010  ; 50% duty, envelope decay 10
    STA $4000
    LDA #$20        ; Low start
    STA $4002
    LDA #$04        ; Trigger sound
    STA $4003
    RTS

; 5. Menu beep - short, clear tone
sfx_menu_beep:
    LDA #%00000000  ; No sweep
    STA $4001
    LDA #%10110110  ; 50% duty, constant volume 6
    STA $4000
    LDA #$D0        ; Medium frequency
    STA $4002
    LDA #$01        ; Short length
    STA $4003
    RTS

; Test all sound effects
JSR sfx_jump
JSR sfx_coin
JSR sfx_explosion
JSR sfx_powerup
JSR sfx_menu_beep

; Complete sound effect library ready for use!
```

## Advanced Techniques Summary

**Duty Cycle Selection**:

- 12.5%: Thin leads, sci-fi effects
- 25%: Balanced melodies, arpeggios
- 50%: Bass lines, strong presence
- 75%: Special effects, harmonic variation

**Frequency Sweeps**:

- Upward: Jump sounds, rising effects
- Downward: Explosion sounds, falling effects
- Period control: Speed of sweep
- Shift amount: Intensity of sweep

**Volume Envelopes**:

- Fast decay: Percussive sounds
- Slow decay: Sustained notes
- Constant volume: Steady tones
- Loop flag: Repeating envelopes

## What You've Learned

In this advanced audio lesson, you've mastered:

- Pulse wave duty cycles and their sonic characteristics
- Frequency sweep effects for dynamic pitch changes
- Volume envelopes for natural-sounding audio
- Sound effect programming techniques
- Advanced pulse wave effects (vibrato, arpeggio)
- Professional audio system organization
- Complete sound effect library creation

## Looking Ahead

Next lesson, you'll learn basic tone generation and musical note relationships - building the foundation for creating proper melodies and musical sequences in your NES games!

## Fun Fact

The NES pulse wave channels were inspired by the sound capabilities of arcade machines and early synthesizers. The four duty cycle options (12.5%, 25%, 50%, 75%) were specifically chosen to provide maximum sonic variety while keeping the hardware simple and cost-effective. Professional NES composers like Koji Kondo (Super Mario Bros.) and Hirokazu Tanaka (Metroid) became masters at using these limited duty cycles to create rich, complex musical arrangements. The frequency sweep feature on pulse channel 1 was added specifically for sound effects - the designers knew that games would need rising and falling pitch sounds for jumps, explosions, and other interactive audio feedback!
