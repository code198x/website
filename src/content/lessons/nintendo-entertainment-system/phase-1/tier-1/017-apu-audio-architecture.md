---
title: "APU (Audio) Architecture"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 17
description: "Discover the NES Audio Processing Unit (APU) and its five sound channels. Learn how the NES creates music and sound effects through pulse waves, triangle waves, noise, and sample playback."
learning_objectives:
  - "Understand the NES APU architecture and sound channels"
  - "Learn about pulse wave, triangle, noise, and DMC channels"
  - "Master APU registers and sound control"
  - "Configure sound channels for basic audio generation"
  - "Build foundation for Sprite Symphony music system"
concepts:
  - "APU (Audio Processing Unit)"
  - "Five sound channels (2 pulse, triangle, noise, DMC)"
  - "APU registers and control"
  - "Waveforms and frequency generation"
  - "Sound channel configuration"
estimated_duration: "50-65 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 17
---

# Lesson 17: APU (Audio) Architecture

Welcome to NES audio programming! Today you'll learn about the Audio Processing Unit (APU) - the sound chip that creates all the music and sound effects in classic NES games. Understanding the APU is essential for bringing your games to life with audio.

## What Is the APU?

The Audio Processing Unit (APU) is a dedicated sound processor built into the NES CPU chip that:

- Generates 5 independent sound channels
- Produces pulse waves, triangle waves, noise, and samples
- Mixes all channels into final audio output
- Operates at precise frequencies for musical notes
- Creates the distinctive "chiptune" sound of NES games

The APU is what made the soundtracks of Super Mario Bros., Metroid, and Castlevania possible!

## The Five Sound Channels

The NES APU has exactly 5 sound channels:

### Channel 1: Pulse Wave 1
- **Waveform**: Square wave with variable duty cycle
- **Use**: Lead melodies, bass lines, sound effects
- **Registers**: $4000-$4003
- **Features**: Frequency sweep, envelope control

### Channel 2: Pulse Wave 2  
- **Waveform**: Square wave with variable duty cycle
- **Use**: Harmony, counter-melodies, echo effects
- **Registers**: $4004-$4007
- **Features**: Envelope control (no frequency sweep)

### Channel 3: Triangle Wave
- **Waveform**: Triangle wave (fixed volume)
- **Use**: Bass lines, smooth melodies
- **Registers**: $4008-$400B
- **Features**: Linear counter, smooth waveform

### Channel 4: Noise
- **Waveform**: Pseudo-random noise
- **Use**: Percussion, explosions, sound effects
- **Registers**: $400C-$400F
- **Features**: Two noise modes (periodic/random)

### Channel 5: DMC (Delta Modulation Channel)
- **Waveform**: Plays back recorded samples
- **Use**: Drums, speech, complex sound effects
- **Registers**: $4010-$4013
- **Features**: Sample playback from ROM

<CodeRunner 
  system="nintendo-entertainment-system"
  title="APU Channel Overview"
  code="; Enable all APU channels
LDA #%00001111  ; Enable pulse 1, pulse 2, triangle, noise
STA $4015       ; APU Status/Enable register

; Quick test of each channel
; Pulse 1 - High beep
LDA #%10111111  ; 50% duty, constant volume 15
STA $4000       ; Pulse 1 control
LDA #$FE        ; Low frequency (high pitch)
STA $4002       ; Pulse 1 frequency low
LDA #$01        ; High frequency
STA $4003       ; Pulse 1 frequency high

; Triangle - Low tone
LDA #%11000000  ; Triangle control
STA $4008       ; Triangle control
LDA #$80        ; Medium frequency
STA $400A       ; Triangle frequency low
LDA #$02        ; Higher frequency for audible sound
STA $400B       ; Triangle frequency high

; All channels are now configured!"
  language="assembly"
/>

## APU Register Map

The APU is controlled through memory-mapped registers:

```
$4000-$4003 : Pulse Wave 1 control
$4004-$4007 : Pulse Wave 2 control  
$4008-$400B : Triangle Wave control
$400C-$400F : Noise control
$4010-$4013 : DMC control
$4015       : APU Status/Enable
$4017       : Frame Counter control
```

Each channel has 4 control registers for complete sound control.

## APU Enable Register ($4015)

This crucial register enables/disables all sound channels:

```
Bit 4: DMC Enable (0=disable, 1=enable)
Bit 3: Noise Enable (0=disable, 1=enable)
Bit 2: Triangle Enable (0=disable, 1=enable)  
Bit 1: Pulse 2 Enable (0=disable, 1=enable)
Bit 0: Pulse 1 Enable (0=disable, 1=enable)
Bits 5-7: Unused
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="APU Channel Enable/Disable"
  code="; Different enable combinations
; Enable only pulse channels (classic chiptune sound)
LDA #%00000011  ; Pulse 1 and 2 only
STA $4015

; Enable melody channels (pulse + triangle)
LDA #%00000111  ; Pulse 1, 2, and triangle
STA $4015

; Enable all channels
LDA #%00001111  ; All 4 main channels
STA $4015

; Disable all sound
LDA #%00000000  ; All channels off
STA $4015

; Re-enable for audio
LDA #%00001111  ; All channels back on
STA $4015"
  language="assembly"
/>

## Pulse Wave Channels (1 & 2)

Pulse waves create the classic "square wave" chiptune sound:

### Pulse Wave Control Register ($4000/$4004)
```
Bits 7-6: Duty Cycle (00=12.5%, 01=25%, 10=50%, 11=75%)
Bit 5: Length Counter Halt / Envelope Loop
Bit 4: Constant Volume Flag (0=envelope, 1=constant)
Bits 3-0: Volume/Envelope (0-15)
```

### Pulse Wave Frequency ($4002-$4003/$4006-$4007)
```
$4002/$4006: Frequency Low Byte (bits 0-7)
$4003/$4007: Length Counter + Frequency High (bits 8-10)
```

## Creating Your First Sound

Let's generate a simple tone on pulse wave 1:

```text
play_simple_tone:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015       ; Enable pulse 1 only
    
    ; Configure pulse 1
    LDA #%10111111  ; 50% duty cycle, constant volume 15
    STA $4000       ; Pulse 1 control
    
    ; Set frequency for middle C
    LDA #$FE        ; Low byte of frequency
    STA $4002       ; Pulse 1 frequency low
    LDA #$01        ; High byte of frequency  
    STA $4003       ; Pulse 1 frequency high
    
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="First Sound Generation"
  code="; Generate first sound - middle C on pulse 1
JSR play_simple_tone

play_simple_tone:
    ; Enable pulse wave 1
    LDA #%00000001  ; Pulse 1 enable only
    STA $4015       ; APU enable register
    
    ; Configure pulse 1 for clear tone
    LDA #%10111111  ; 50% duty, constant volume, max volume
    STA $4000       ; Pulse 1 control register
    
    ; Set frequency for musical note C
    LDA #$FE        ; Frequency low byte
    STA $4002       ; Pulse 1 frequency low
    LDA #$01        ; Frequency high byte
    STA $4003       ; Pulse 1 frequency high
    
    RTS

; Middle C is now playing on pulse 1!"
  language="assembly"
/>

## Understanding Frequency Values

NES frequency values work differently than you might expect:

- **Lower values = Higher pitch**: $FE = high pitch, $80 = lower pitch
- **11-bit range**: Values from $008-$7FF (8-2047)
- **Formula**: Actual frequency = CPU_CLOCK / (16 * (frequency + 1))

### Common Musical Frequencies
```text
; Approximate frequency values for common notes
note_c:  .word $07F1    ; C
note_d:  .word $0780    ; D  
note_e:  .word $06F1    ; E
note_f:  .word $0682    ; F
note_g:  .word $05C7    ; G
note_a:  .word $0506    ; A
note_b:  .word $0453    ; B
```

## Triangle Wave Channel

The triangle wave creates smooth, mellow tones:

### Triangle Control ($4008)
```
Bit 7: Length Counter Halt / Linear Counter Control
Bits 6-0: Linear Counter Load
```

### Triangle Frequency ($400A-$400B)
```
$400A: Frequency Low Byte
$400B: Length Counter + Frequency High
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Triangle Wave Bass Line"
  code="; Create bass line using triangle wave
JSR setup_triangle_bass

setup_triangle_bass:
    ; Enable triangle channel
    LDA #%00000100  ; Triangle enable
    STA $4015       ; APU enable
    
    ; Configure triangle wave
    LDA #%11000000  ; Linear counter control
    STA $4008       ; Triangle control
    
    ; Set low frequency for bass note
    LDA #$80        ; Low frequency (bass range)
    STA $400A       ; Triangle frequency low
    LDA #$02        ; Higher byte for audible frequency
    STA $400B       ; Triangle frequency high + length
    
    RTS

; Deep bass note is now playing on triangle!"
  language="assembly"
/>

## Noise Channel

The noise channel creates percussion and sound effects:

### Noise Control ($400C)
```
Bits 5-4: Unused
Bit 4: Constant Volume Flag
Bits 3-0: Volume/Envelope
```

### Noise Frequency ($400E)
```
Bit 7: Mode (0=noise, 1=tone)
Bits 3-0: Period (0-15, lower = higher pitch)
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Noise Channel Percussion"
  code="; Create drum-like sound with noise channel
JSR play_drum_sound

play_drum_sound:
    ; Enable noise channel
    LDA #%00001000  ; Noise enable
    STA $4015       ; APU enable
    
    ; Configure noise for drum sound
    LDA #%00111111  ; Constant volume, high volume
    STA $400C       ; Noise control
    
    ; Set noise frequency/period
    LDA #%00000001  ; Fast noise for snare-like sound
    STA $400E       ; Noise period
    
    ; Length counter (duration)
    LDA #%00010000  ; Short duration
    STA $400F       ; Noise length
    
    RTS

; Drum hit sound is playing!"
  language="assembly"
/>

## Duty Cycles and Timbre

Pulse waves can have different duty cycles, creating different timbres:

```text
test_duty_cycles:
    ; 12.5% duty cycle - thin sound
    LDA #%00111111  ; 12.5% duty, max volume
    STA $4000
    
    ; 25% duty cycle - fuller sound  
    LDA #%01111111  ; 25% duty, max volume
    STA $4000
    
    ; 50% duty cycle - square wave
    LDA #%10111111  ; 50% duty, max volume
    STA $4000
    
    ; 75% duty cycle - inverted 25%
    LDA #%11111111  ; 75% duty, max volume
    STA $4000
    
    RTS
```

## Volume and Envelope Control

You can control volume in two ways:

### Constant Volume
```text
LDA #%10110101  ; Constant volume = 5
STA $4000
```

### Envelope (Automatic Volume Fade)
```text
LDA #%10100101  ; Envelope mode, decay rate = 5
STA $4000
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Volume Control Examples"
  code="; Demonstrate different volume levels
JSR test_volumes

test_volumes:
    ; Enable pulse 1
    LDA #%00000001
    STA $4015
    
    ; Set frequency for consistent pitch
    LDA #$FE
    STA $4002
    LDA #$01
    STA $4003
    
    ; Test different constant volumes
    LDA #%10110001  ; Constant volume 1 (quiet)
    STA $4000
    
    LDA #%10111000  ; Constant volume 8 (medium)
    STA $4000
    
    LDA #%10111111  ; Constant volume 15 (loud)
    STA $4000
    
    ; Test envelope mode
    LDA #%10101111  ; Envelope mode, fast decay
    STA $4000
    
    RTS

; Different volume levels demonstrated!"
  language="assembly"
/>

## Sprite Symphony APU Setup

Let's configure the APU for our musical project:

```text
init_sprite_symphony_audio:
    ; Enable pulse channels for melody
    LDA #%00000011  ; Pulse 1 and 2 enabled
    STA $4015
    
    ; Configure pulse 1 for lead melody
    LDA #%10111111  ; 50% duty, constant volume, max
    STA $4000
    
    ; Configure pulse 2 for harmony
    LDA #%01111010  ; 25% duty, constant volume, medium
    STA $4004
    
    ; Initialize frequency tables
    JSR setup_note_frequencies
    
    RTS

setup_note_frequencies:
    ; Store common note frequencies
    ; C note
    LDA #$FE
    STA note_freq_lo+0
    LDA #$01
    STA note_freq_hi+0
    
    ; E note  
    LDA #$CA
    STA note_freq_lo+1
    LDA #$01
    STA note_freq_hi+1
    
    ; G note
    LDA #$A2
    STA note_freq_lo+2
    LDA #$01
    STA note_freq_hi+2
    
    RTS
```

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Sprite Symphony Audio Setup"
  code="; Initialize audio system for Sprite Symphony
JSR init_sprite_symphony_audio

init_sprite_symphony_audio:
    ; Enable both pulse channels for music
    LDA #%00000011  ; Pulse 1 and pulse 2
    STA $4015       ; APU enable
    
    ; Configure pulse 1 for lead melody
    LDA #%10111111  ; 50% duty, constant volume 15
    STA $4000       ; Pulse 1 control
    
    ; Configure pulse 2 for harmony/bass
    LDA #%01111010  ; 25% duty, constant volume 10
    STA $4004       ; Pulse 2 control
    
    ; Setup note frequency table
    ; C note (index 0)
    LDA #$FE        ; C frequency low
    STA $0350       ; note_freq_lo[0]
    LDA #$01        ; C frequency high
    STA $0360       ; note_freq_hi[0]
    
    ; E note (index 1)  
    LDA #$CA        ; E frequency low
    STA $0351       ; note_freq_lo[1]
    LDA #$01        ; E frequency high
    STA $0361       ; note_freq_hi[1]
    
    ; G note (index 2)
    LDA #$A2        ; G frequency low
    STA $0352       ; note_freq_lo[2]
    LDA #$01        ; G frequency high
    STA $0362       ; note_freq_hi[2]
    
    RTS

; Audio system ready for Sprite Symphony!"
  language="assembly"
/>

## Multi-Channel Music

Creating music requires coordinating multiple channels:

```text
play_chord:
    ; Play C major chord (C-E-G)
    
    ; Pulse 1: C note
    LDA note_freq_lo+0  ; C low byte
    STA $4002
    LDA note_freq_hi+0  ; C high byte
    STA $4003
    
    ; Pulse 2: E note
    LDA note_freq_lo+1  ; E low byte  
    STA $4006
    LDA note_freq_hi+1  ; E high byte
    STA $4007
    
    ; Triangle: G note (bass)
    LDA #%11000000
    STA $4008           ; Triangle control
    LDA note_freq_lo+2  ; G low byte
    STA $400A
    LDA note_freq_hi+2  ; G high byte
    STA $400B
    
    RTS
```

## Practical Exercise: Sound System

Create a complete sound system with:

1. Initialize all 4 main APU channels
2. Create a function to play notes on pulse 1
3. Create a function to play bass notes on triangle  
4. Create a drum function using noise
5. Play a simple 4-note sequence

<CodeRunner 
  system="nintendo-entertainment-system"
  title="Practice: Complete Sound System"
  code="; Complete Sound System Exercise
JSR init_complete_sound_system

init_complete_sound_system:
    ; 1. Initialize all 4 main channels
    LDA #%00001111  ; Enable pulse1, pulse2, triangle, noise
    STA $4015       ; APU enable register
    
    ; Configure pulse 1 for melody
    LDA #%10111111  ; 50% duty, constant volume 15
    STA $4000       ; Pulse 1 control
    
    ; Configure pulse 2 for harmony
    LDA #%01111000  ; 25% duty, constant volume 8  
    STA $4004       ; Pulse 2 control
    
    ; Configure triangle for bass
    LDA #%11000000  ; Linear counter control
    STA $4008       ; Triangle control
    
    ; Configure noise for percussion
    LDA #%00110000  ; Constant volume, medium level
    STA $400C       ; Noise control
    
    RTS

; 2. Function to play notes on pulse 1
play_melody_note:
    ; A register contains note index (0=C, 1=D, 2=E, 3=F)
    CMP #$00
    BEQ play_c
    CMP #$01  
    BEQ play_d
    CMP #$02
    BEQ play_e
    CMP #$03
    BEQ play_f
    RTS         ; Unknown note
    
play_c:
    LDA #$FE    ; C frequency
    STA $4002
    LDA #$01
    STA $4003
    RTS
play_d:
    LDA #$E2    ; D frequency
    STA $4002
    LDA #$01
    STA $4003
    RTS
play_e:
    LDA #$CA    ; E frequency
    STA $4002
    LDA #$01
    STA $4003
    RTS
play_f:
    LDA #$B5    ; F frequency
    STA $4002
    LDA #$01
    STA $4003
    RTS

; 3. Function to play bass notes on triangle
play_bass_note:
    ; A register contains note index
    CMP #$00
    BEQ bass_c
    CMP #$01
    BEQ bass_d
    RTS
    
bass_c:
    LDA #$80    ; Lower octave C
    STA $400A
    LDA #$03
    STA $400B
    RTS
bass_d:
    LDA #$71    ; Lower octave D
    STA $400A
    LDA #$03
    STA $400B
    RTS

; 4. Drum function using noise
play_drum:
    LDA #%00001000  ; Short noise burst
    STA $400E       ; Noise period
    LDA #%00010000  ; Set length
    STA $400F       ; Noise length
    RTS

; 5. Play simple 4-note sequence: C-D-E-F
play_sequence:
    LDA #$00    ; Note C
    JSR play_melody_note
    LDA #$00    ; Bass C
    JSR play_bass_note
    JSR play_drum
    
    LDA #$01    ; Note D
    JSR play_melody_note
    LDA #$01    ; Bass D
    JSR play_bass_note
    
    LDA #$02    ; Note E
    JSR play_melody_note
    
    LDA #$03    ; Note F
    JSR play_melody_note
    
    RTS

; Test the complete system
JSR play_sequence

; Complete sound system working with melody, bass, and drums!"
  language="assembly"
/>

## What You've Learned

In this audio-focused lesson, you've mastered:

- NES APU (Audio Processing Unit) architecture and 5 sound channels
- Pulse wave channels for melodies and harmonies
- Triangle wave channel for bass and smooth tones
- Noise channel for percussion and sound effects
- APU registers and sound control techniques
- Multi-channel music coordination
- Foundation for the Sprite Symphony audio system

## Looking Ahead

Next lesson, you'll dive deeper into pulse wave sound generation - learning advanced techniques for creating melodies, sound effects, and the distinctive chiptune sounds that made NES music legendary!

## Fun Fact

The NES APU was designed by the same team that created the Nintendo Game & Watch devices! They wanted to ensure that NES games could have rich, musical soundtracks despite the limited hardware. The choice to include two separate pulse wave channels was specifically made to allow for melody and harmony simultaneously - something many home computers of the era couldn't do. The APU's design was so successful that its distinctive sound became synonymous with video game music, and "chiptune" music created on NES-style hardware remains popular today, inspiring modern musicians and game developers!