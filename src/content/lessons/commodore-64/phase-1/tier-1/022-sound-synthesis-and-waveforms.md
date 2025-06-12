---
title: "Sound Synthesis and Waveforms"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 22
description: "Learn advanced SID synthesis techniques including filters, pulse width modulation, ring modulation, and oscillator sync. Learn professional sound design and synthesis programming."
learning_objectives:
  - "Learn SID's advanced synthesis features and modulation"
  - "Learn filter programming and frequency response control"
  - "Practice pulse width modulation and waveform shaping"
  - "Understand ring modulation and oscillator sync effects"
  - "Build sophisticated synthesizer sounds and effects"
concepts:
  - "SID filter system (low-pass, high-pass, band-pass)"
  - "Pulse width modulation and waveform control"
  - "Ring modulation and frequency modulation"
  - "Oscillator sync and phase relationships"
  - "Advanced synthesis programming techniques"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 22
---

# Lesson 22: Sound Synthesis and Waveforms

Welcome to advanced sound synthesis! Today you'll master the SID's most sophisticated features - filters, modulation, and synthesis techniques that rival professional synthesizers. These are the tools that made the C64 legendary in electronic music.

## The SID Filter System

The SID's **multimode filter** is one of its most powerful features, providing analog-style filtering that shapes the harmonic content of sounds:

- **3 filter modes**: Low-pass, high-pass, band-pass
- **Resonance control**: Emphasizes frequencies near cutoff
- **12-bit cutoff frequency**: Smooth frequency sweeps
- **Voice routing**: Any combination of voices through filter

### Filter Theory Basics

**Filters remove or emphasize certain frequencies:**
- **Low-pass**: Removes high frequencies (makes sound darker/warmer)
- **High-pass**: Removes low frequencies (makes sound brighter/thinner)  
- **Band-pass**: Removes both high and low (creates nasal/vocal sounds)
- **Resonance**: Boosts frequencies near the cutoff point

## Filter Registers

### Filter Cutoff Frequency ($D415, $D416)
**16-bit value** controls where filtering occurs:
- **$D415**: Cutoff frequency low byte (bits 2-0 only)
- **$D416**: Cutoff frequency high byte
- **Range**: 0-2047 (effective range ~30 Hz to ~12 kHz)

### Filter Control Register ($D417)
```
Bit 7: Voice 3 to filter
Bit 6: Voice 2 to filter  
Bit 5: Voice 1 to filter
Bit 4: External audio to filter
Bits 3-0: Resonance (0-15)
```

### Volume and Filter Mode ($D418)
```
Bit 7: Voice 3 disconnect from output
Bit 6: High-pass filter enable
Bit 5: Band-pass filter enable  
Bit 4: Low-pass filter enable
Bits 3-0: Learn volume (0-15)
```

<CodeRunner 
  system="commodore-64"
  title="Basic Filter Programming"
  code="; Demonstrate SID filter effects
; Apply low-pass filter with resonance to sawtooth wave

FilterDemo:
    ; Setup voice 1 with bright sawtooth wave
    LDA #$20        ; Middle C frequency low
    STA $D400
    LDA #$48        ; Middle C frequency high
    STA $D401
    
    ; Fast attack, no decay/release for clear filter hearing
    LDA #%11110000  ; Fast attack, no decay
    STA $D405
    LDA #%11110000  ; Full sustain, no release
    STA $D406
    
    ; Start sawtooth wave (bright, lots of harmonics)
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Route voice 1 through filter
    LDA #%00100000  ; Voice 1 to filter
    STA $D417       ; Filter control
    
    ; Enable low-pass filter with medium resonance
    LDA #%00010000  ; Low-pass filter
    ORA #%00001111  ; Full volume
    STA $D418       ; Filter mode and volume
    
    ; Sweep filter cutoff from low to high
    LDX #$00        ; Start with low cutoff
    
FilterSweep:
    ; Set filter cutoff frequency
    TXA             ; Use X as cutoff low byte
    AND #%00000111  ; Only use lower 3 bits for $D415
    STA $D415       ; Cutoff low
    
    TXA             ; Use X for high byte too
    LSR             ; Shift for high byte
    LSR
    LSR
    STA $D416       ; Cutoff high
    
    ; Short delay to hear filter effect
    JSR FilterDelay
    
    ; Increment cutoff frequency
    INX
    CPX #$80        ; Sweep through range
    BNE FilterSweep
    
    ; Turn off sound and filter
    LDA #%00100000  ; Sawtooth, Gate off
    STA $D404
    LDA #%00000000  ; No filter
    STA $D417
    
    RTS

FilterDelay:
    LDY #$40        ; Medium delay for filter sweep
FDWait:
    DEY
    BNE FDWait
    RTS

; Run filter demonstration
JSR FilterDemo"
  language="assembly"
/>

## Advanced Filter Programming

### Filter Mode Combinations
```text
; Different filter modes create different timbres
FilterModes:
    ; Setup basic sound
    LDA #$40        ; Higher frequency for clarity
    STA $D400
    LDA #$60
    STA $D401
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Route voice 1 to filter
    LDA #%00100000  ; Voice 1 to filter
    STA $D417
    
    ; Set filter cutoff to middle range
    LDA #%00000100  ; Cutoff low
    STA $D415
    LDA #$80        ; Cutoff high
    STA $D416
    
    ; Low-pass filter (warm, muffled)
    LDA #%00010000  ; Low-pass only
    ORA #%00001111  ; Full volume
    STA $D418
    JSR ModeDelay
    
    ; High-pass filter (bright, thin)
    LDA #%01000000  ; High-pass only
    ORA #%00001111  ; Full volume
    STA $D418
    JSR ModeDelay
    
    ; Band-pass filter (nasal, vocal)
    LDA #%00100000  ; Band-pass only
    ORA #%00001111  ; Full volume
    STA $D418
    JSR ModeDelay
    
    ; All filters combined (notch effect)
    LDA #%01110000  ; All three filters
    ORA #%00001111  ; Full volume
    STA $D418
    JSR ModeDelay
    
    ; Turn off
    LDA #%00000000
    STA $D404
    STA $D417
    RTS

ModeDelay:
    LDX #$FF
MWait:
    DEX
    BNE MWait
    RTS
```

### Resonance Effects
```text
; Demonstrate filter resonance
ResonanceDemo:
    ; Setup filtered sound
    LDA #$30        ; Frequency
    STA $D400
    LDA #$50
    STA $D401
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Route to filter
    LDA #%00100000  ; Voice 1 to filter
    STA $D417
    
    ; Fixed cutoff frequency  
    LDA #%00000010
    STA $D415
    LDA #$40
    STA $D416
    
    ; Sweep resonance from 0 to 15
    LDX #$00
    
ResonanceLoop:
    ; Set resonance level (lower 4 bits of $D417)
    TXA             ; Get resonance value
    AND #%00001111  ; Keep lower 4 bits
    ORA #%00100000  ; Add voice 1 routing
    STA $D417       ; Set filter control
    
    ; Low-pass filter
    LDA #%00010000
    ORA #%00001111  ; Full volume
    STA $D418
    
    JSR ResonanceDelay
    
    INX
    CPX #$10        ; 16 resonance levels
    BNE ResonanceLoop
    
    ; Turn off
    LDA #%00000000
    STA $D404
    STA $D417
    RTS

ResonanceDelay:
    LDY #$80
RDWait:
    DEY
    BNE RDWait
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Advanced Filter Techniques"
  code="; Explore advanced filter programming
; Combines multiple filter modes and resonance effects

AdvancedFilters:
    ; Setup base sound - rich sawtooth for filtering
    LDA #$40        ; Frequency for clear hearing
    STA $D400
    LDA #$70        
    STA $D401
    
    ; Quick envelope to hear filter clearly
    LDA #%11110000  ; Fast attack, no decay
    STA $D405
    LDA #%11110000  ; Full sustain, no release
    STA $D406
    
    ; Start sawtooth (rich in harmonics)
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Route voice 1 through filter
    LDA #%00100000  ; Voice 1 to filter
    STA $D417
    
    ; Demo 1: Low-pass with resonance sweep
    LDA #%00000011  ; Low cutoff
    STA $D415
    LDA #$30
    STA $D416
    
    ; Sweep resonance
    LDX #$00
ResLoop1:
    TXA
    AND #%00001111  ; Resonance value
    ORA #%00100000  ; Voice 1 routing
    STA $D417
    
    LDA #%00010111  ; Low-pass + high resonance + volume
    STA $D418
    
    JSR QuickDelay
    INX
    CPX #$10
    BNE ResLoop1
    
    ; Demo 2: Filter cutoff sweep with fixed resonance
    LDA #%00101000  ; Voice 1 + medium resonance
    STA $D417
    
    LDX #$00
CutoffLoop:
    ; Set varying cutoff frequency
    TXA
    AND #%00000111
    STA $D415
    TXA
    LSR
    LSR  
    LSR
    STA $D416
    
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    
    JSR QuickDelay
    INX
    CPX #$60        ; Sweep range
    BNE CutoffLoop
    
    ; Demo 3: Band-pass vocal effect
    LDA #%00000100  ; Mid-range cutoff
    STA $D415
    LDA #$60
    STA $D416
    
    LDA #%00101111  ; Voice 1 + high resonance
    STA $D417
    
    LDA #%00100111  ; Band-pass + volume
    STA $D418
    
    JSR LongDelay   ; Hold to hear effect
    
    ; Clean up
    LDA #%00000000
    STA $D404       ; Stop sound
    STA $D417       ; Clear filter routing
    STA $D418       ; Clear filter mode
    
    RTS

QuickDelay:
    LDY #$20
QDWait:
    DEY
    BNE QDWait
    RTS

LongDelay:
    LDX #$FF
LDWait1:
    LDY #$80
LDWait2:
    DEY
    BNE LDWait2
    DEX
    BNE LDWait1
    RTS

; Run advanced filter demo
JSR AdvancedFilters"
  language="assembly"
/>

## Pulse Width Modulation (PWM)

**Pulse width modulation** varies the width of pulse waves, creating rich harmonic variations:

- **Pulse width range**: 0-4095 (12-bit control)
- **Width registers**: $D402/$D403 (voice 1), $D409/$D40A (voice 2), $D410/$D411 (voice 3)
- **Effect**: Changes harmonic content without changing pitch
- **Applications**: Vibrato effects, string-like sounds, analog warmth

### Pulse Width Programming
```text
; Static pulse width examples
PulseWidthDemo:
    ; Setup pulse wave
    LDA #$30        ; Frequency
    STA $D400
    LDA #$60
    STA $D401
    
    ; 25% pulse width (narrow pulse)
    LDA #$FF        ; Width low byte
    STA $D402
    LDA #$02        ; Width high byte (25% of 4095)
    STA $D403
    
    LDA #%01000001  ; Pulse wave + Gate
    STA $D404
    JSR PulseDelay
    
    ; 50% pulse width (square wave)
    LDA #$FF        ; Width low byte
    STA $D402
    LDA #$07        ; Width high byte (50% of 4095)
    STA $D403
    JSR PulseDelay
    
    ; 75% pulse width (wide pulse)
    LDA #$FF        ; Width low byte
    STA $D402
    LDA #$0B        ; Width high byte (75% of 4095)
    STA $D403
    JSR PulseDelay
    
    ; Turn off
    LDA #%00000000
    STA $D404
    RTS

PulseDelay:
    LDX #$FF
PWait:
    DEX
    BNE PWait
    RTS
```

### Dynamic Pulse Width Modulation
```text
; Animated pulse width for vibrato effect
PWMVibrato:
    ; Setup pulse wave
    LDA #$40        ; Frequency
    STA $D400
    LDA #$60
    STA $D401
    
    ; Start pulse wave
    LDA #%01000001  ; Pulse + Gate
    STA $D404
    
    ; Animate pulse width
    LDX #$00        ; PWM counter
    
PWMLoop:
    ; Calculate pulse width using X as animation frame
    TXA
    ASL             ; Multiply for wider range
    ASL
    STA $D402       ; Pulse width low
    
    TXA
    LSR             ; Divide for high byte
    LSR
    ADC #$04        ; Add offset (avoid 0 width)
    STA $D403       ; Pulse width high
    
    ; Short delay
    JSR PWMDelay
    
    INX
    CPX #$80        ; Animation cycle
    BNE PWMLoop
    
    ; Turn off
    LDA #%00000000
    STA $D404
    RTS

PWMDelay:
    LDY #$30
PWMWait:
    DEY
    BNE PWMWait
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Pulse Width Modulation Programming"
  code="; Demonstrate pulse width modulation effects
; Shows static and animated pulse width control

PulseWidthExplorer:
    ; Setup basic pulse wave parameters
    LDA #$30        ; Mid-range frequency
    STA $D400
    LDA #$60
    STA $D401
    
    ; Fast envelope for clear PWM hearing
    LDA #%11110000  ; Fast attack, no decay
    STA $D405
    LDA #%11110000  ; Full sustain, no release
    STA $D406
    
    ; Set master volume
    LDA #%00001111  ; Full volume
    STA $D418
    
    ; Demo 1: Different static pulse widths
    ; Narrow pulse (bright, thin sound)
    LDA #$00        ; Width low = 0
    STA $D402
    LDA #$02        ; Width high (narrow)
    STA $D403
    
    LDA #%01000001  ; Pulse + Gate
    STA $D404
    JSR StaticDelay
    
    ; Medium pulse (balanced sound)
    LDA #$00        ; Width low
    STA $D402
    LDA #$08        ; Width high (medium)
    STA $D403
    JSR StaticDelay
    
    ; Wide pulse (dark, hollow sound)
    LDA #$00        ; Width low
    STA $D402
    LDA #$0E        ; Width high (wide)
    STA $D403
    JSR StaticDelay
    
    ; Demo 2: Animated pulse width modulation
    LDX #$00        ; Animation counter
    
PWMAnimation:
    ; Create varying pulse width based on counter
    TXA             ; Get counter
    ASL             ; Expand range
    STA $D402       ; Pulse width low
    
    TXA             ; Get counter again
    LSR             ; Scale down for high byte
    LSR
    ADC #$02        ; Add minimum width
    AND #%00001111  ; Keep in valid range
    STA $D403       ; Pulse width high
    
    ; Brief delay for animation speed
    JSR AnimDelay
    
    INX             ; Next animation frame
    CPX #$40        ; Animation cycle length
    BNE PWMAnimation
    
    ; Turn off pulse wave
    LDA #%01000000  ; Pulse, Gate off
    STA $D404
    
    RTS

StaticDelay:
    LDX #$FF        ; Long delay for static examples
StaticWait:
    DEX
    BNE StaticWait
    RTS

AnimDelay:
    LDY #$20        ; Short delay for smooth animation
AnimWait:
    DEY
    BNE AnimWait
    RTS

; Run pulse width modulation demo
JSR PulseWidthExplorer"
  language="assembly"
/>

## Ring Modulation

**Ring modulation** multiplies the output of two oscillators, creating complex harmonic effects:

- **Control bit**: Bit 2 of voice control register
- **Modulation source**: Voice N ring modulates with Voice N-1 (Voice 1 modulates with Voice 3)
- **Effect**: Creates sum and difference frequencies, metallic/bell-like sounds
- **Applications**: Metallic percussion, alien sounds, complex timbres

```text
; Ring modulation effects
RingModDemo:
    ; Setup two voices for ring modulation
    ; Voice 1: Carrier frequency
    LDA #$40        ; Base frequency
    STA $D400
    LDA #$60
    STA $D401
    
    ; Voice 3: Modulator frequency (modulates Voice 1)
    LDA #$50        ; Different frequency for interesting interaction
    STA $D40E
    LDA #$65
    STA $D40F
    
    ; Setup envelopes
    LDA #%11110000  ; Fast attack
    STA $D405       ; Voice 1
    STA $D413       ; Voice 3
    LDA #%11110000  ; Full sustain
    STA $D406       ; Voice 1
    STA $D414       ; Voice 3
    
    ; Start both voices normally first
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404       ; Voice 1
    STA $D412       ; Voice 3
    JSR RingDelay
    
    ; Now enable ring modulation on Voice 1
    LDA #%00100101  ; Sawtooth + Ring Mod + Gate
    STA $D404       ; Voice 1 now ring modulated by Voice 3
    JSR RingDelay
    
    ; Change modulator frequency for different effect
    LDA #$80        ; Higher modulator frequency
    STA $D40E
    JSR RingDelay
    
    ; Turn off
    LDA #%00000000
    STA $D404
    STA $D412
    RTS

RingDelay:
    LDX #$FF
RWait:
    DEX
    BNE RWait
    RTS
```

## Oscillator Sync

**Oscillator sync** resets one oscillator's phase when another completes its cycle:

- **Control bit**: Bit 1 of voice control register  
- **Sync source**: Voice N syncs to Voice N-1
- **Effect**: Creates harmonically rich waveforms, lead synthesizer sounds
- **Applications**: Lead lines, bass sounds, sync sweeps

```text
; Oscillator sync demonstration
SyncDemo:
    ; Voice 3: Learn oscillator (controls sync)
    LDA #$20        ; Low frequency for sync control
    STA $D40E
    LDA #$30
    STA $D40F
    
    ; Voice 1: Slave oscillator (gets synchronized)
    LDA #$80        ; Higher frequency
    STA $D400
    LDA #$80
    STA $D401
    
    ; Setup envelopes
    LDA #%11110000
    STA $D405       ; Voice 1
    STA $D413       ; Voice 3
    LDA #%11110000
    STA $D406
    STA $D414
    
    ; Start Voice 3 (master)
    LDA #%00100001  ; Sawtooth + Gate
    STA $D412       ; Voice 3
    
    ; Start Voice 1 without sync
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404       ; Voice 1 (normal)
    JSR SyncDelay
    
    ; Enable sync on Voice 1
    LDA #%00100011  ; Sawtooth + Sync + Gate
    STA $D404       ; Voice 1 synced to Voice 3
    JSR SyncDelay
    
    ; Sweep the synchronized oscillator frequency
    LDX #$80
SyncSweep:
    STX $D400       ; Change Voice 1 frequency
    JSR QuickSync
    INX
    CPX #$FF
    BNE SyncSweep
    
    ; Turn off
    LDA #%00000000
    STA $D404
    STA $D412
    RTS

SyncDelay:
    LDX #$FF
SWait:
    DEX
    BNE SWait
    RTS

QuickSync:
    LDY #$10
QSWait:
    DEY
    BNE QSWait
    RTS
```

<CodeRunner 
  system="commodore-64"
  title="Ring Modulation and Sync Effects"
  code="; Demonstrate advanced modulation techniques
; Ring modulation and oscillator sync

ModulationDemo:
    ; Setup master volume
    LDA #%00001111  ; Full volume
    STA $D418
    
    ; Demo 1: Ring Modulation
    JSR RingModulation
    JSR LongPause
    
    ; Demo 2: Oscillator Sync
    JSR OscillatorSync
    
    RTS

RingModulation:
    ; Voice 1: Carrier (what we hear)
    LDA #$30        ; Base frequency
    STA $D400
    LDA #$50
    STA $D401
    
    ; Voice 3: Modulator (controls ring mod)
    LDA #$35        ; Slightly different frequency
    STA $D40E
    LDA #$55
    STA $D40F
    
    ; Setup envelopes for both voices
    LDA #%11110000  ; Fast attack, no decay
    STA $D405       ; Voice 1
    STA $D413       ; Voice 3
    LDA #%11110000  ; Full sustain, no release
    STA $D406       ; Voice 1
    STA $D414       ; Voice 3
    
    ; Start both voices (normal sound first)
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404       ; Voice 1
    STA $D412       ; Voice 3
    JSR ModDelay
    
    ; Enable ring modulation (Voice 1 modulated by Voice 3)
    LDA #%00100101  ; Sawtooth + Ring Mod + Gate
    STA $D404       ; Now ring modulated (metallic sound)
    JSR ModDelay
    
    ; Change modulator frequency for different effect
    LDA #$80        ; Much higher modulator
    STA $D40E
    JSR ModDelay
    
    ; Stop ring modulation demo
    LDA #%00000000
    STA $D404
    STA $D412
    RTS

OscillatorSync:
    ; Voice 3: Learn oscillator (slow)
    LDA #$20        ; Low frequency master
    STA $D40E
    LDA #$25
    STA $D40F
    
    ; Voice 1: Slave oscillator (fast)
    LDA #$60        ; Higher frequency slave
    STA $D400
    LDA #$80
    STA $D401
    
    ; Setup envelopes
    LDA #%11110000
    STA $D405       ; Voice 1
    STA $D413       ; Voice 3
    LDA #%11110000
    STA $D406
    STA $D414
    
    ; Start master oscillator
    LDA #%00100001  ; Sawtooth + Gate
    STA $D412       ; Voice 3 (master)
    
    ; Start slave without sync (normal sound)
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404       ; Voice 1 (normal)
    JSR ModDelay
    
    ; Enable sync (Voice 1 synced to Voice 3)
    LDA #%00100011  ; Sawtooth + Sync + Gate
    STA $D404       ; Voice 1 now synchronized
    JSR ModDelay
    
    ; Sync sweep effect (change slave frequency)
    LDX #$60
SyncSweepLoop:
    STX $D400       ; Change slave frequency
    LDA #$80        ; Keep high byte constant
    STA $D401
    
    JSR QuickModDelay
    INX
    CPX #$C0        ; Sweep range
    BNE SyncSweepLoop
    
    ; Stop sync demo
    LDA #%00000000
    STA $D404
    STA $D412
    RTS

ModDelay:
    LDX #$FF        ; Standard delay
ModWait1:
    LDY #$80
ModWait2:
    DEY
    BNE ModWait2
    DEX
    BNE ModWait1
    RTS

QuickModDelay:
    LDY #$30        ; Quick delay for sweeps
QMWait:
    DEY
    BNE QMWait
    RTS

LongPause:
    LDX #$FF        ; Pause between demos
LPWait1:
    LDY #$FF
LPWait2:
    DEY
    BNE LPWait2
    DEX
    BNE LPWait1
    RTS

; Run modulation demonstrations
JSR ModulationDemo"
  language="assembly"
/>

## Advanced Synthesis Techniques

### Voice Combination Effects
```text
; Combine multiple synthesis techniques
AdvancedSynthesis:
    ; Create complex patch using all techniques
    
    ; Voice 1: Filtered saw with PWM
    LDA #$40
    STA $D400       ; Base frequency
    LDA #$60
    STA $D401
    
    LDA #$00        ; Pulse width (will modulate)
    STA $D402
    LDA #$08
    STA $D403
    
    ; Voice 2: Ring modulator
    LDA #$43        ; Slightly detuned for beating
    STA $D407
    LDA #$60
    STA $D408
    
    ; Voice 3: Sync master + filtered
    LDA #$20        ; Low frequency for sync
    STA $D40E
    LDA #$30
    STA $D40F
    
    ; Setup filter
    LDA #%11100000  ; All voices to filter
    ORA #%00001000  ; Medium resonance
    STA $D417
    
    LDA #%00010000  ; Low-pass filter
    ORA #%00001111  ; Full volume
    STA $D418
    
    ; Filter sweep with complex sound
    LDX #$00
ComplexSweep:
    ; Update filter cutoff
    TXA
    AND #%00000111
    STA $D415
    TXA
    LSR
    LSR
    LSR
    STA $D416
    
    ; Update pulse width modulation
    TXA
    ASL
    STA $D402
    
    ; Start voices with different techniques
    LDA #%01000101  ; Pulse + Ring Mod + Gate
    STA $D404       ; Voice 1
    
    LDA #%00100001  ; Sawtooth + Gate
    STA $D40B       ; Voice 2
    
    LDA #%00100001  ; Sawtooth + Gate  
    STA $D412       ; Voice 3
    
    ; Enable sync on Voice 1
    LDA #%01000111  ; Pulse + Ring Mod + Sync + Gate
    STA $D404
    
    JSR ComplexDelay
    
    INX
    CPX #$60
    BNE ComplexSweep
    
    ; Stop complex patch
    LDA #%00000000
    STA $D404
    STA $D40B
    STA $D412
    STA $D417       ; Clear filter
    
    RTS

ComplexDelay:
    LDY #$40
CWait:
    DEY
    BNE CWait
    RTS
```

### Creating Instrument Sounds
```text
; Synthesize realistic instrument timbres
InstrumentDemo:
    ; Brass sound: Sawtooth + filter + envelope
    JSR BrassSound
    JSR InstrumentPause
    
    ; String sound: Pulse + PWM + slow attack
    JSR StringSound
    JSR InstrumentPause
    
    ; Bell sound: Ring modulation + fast decay
    JSR BellSound
    
    RTS

BrassSound:
    ; Bright sawtooth with filter sweep
    LDA #$30
    STA $D400
    LDA #$60
    STA $D401
    
    ; Brass-like envelope
    LDA #%10000100  ; Medium attack, slow decay
    STA $D405
    LDA #%11000010  ; High sustain, medium release
    STA $D406
    
    ; Filter for brightness control
    LDA #%00100100  ; Voice 1 to filter + resonance
    STA $D417
    
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    
    ; Start brass note
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Hold note
    JSR BrassDelay
    
    ; Release note
    LDA #%00100000  ; Gate off
    STA $D404
    JSR BrassDelay
    
    RTS

StringSound:
    ; Pulse wave with PWM for string-like character
    LDA #$25
    STA $D400
    LDA #$45
    STA $D401
    
    ; String envelope: slow attack
    LDA #%00010001  ; Slow attack/decay
    STA $D405
    LDA #%11100001  ; High sustain, slow release
    STA $D406
    
    ; Pulse width for string timbre
    LDA #$00
    STA $D402
    LDA #$08
    STA $D403
    
    ; Start string note
    LDA #%01000001  ; Pulse + Gate
    STA $D404
    
    ; Animate pulse width during note
    LDX #$08
StringPWM:
    TXA
    STA $D403       ; Varying pulse width
    JSR StringPWMDelay
    INX
    CPX #$0F
    BNE StringPWM
    
    ; Release
    LDA #%01000000
    STA $D404
    JSR StringDelay
    
    RTS

BellSound:
    ; Ring modulated triangle waves for metallic bell
    LDA #$40
    STA $D400       ; Voice 1
    LDA #$70
    STA $D401
    
    LDA #$42        ; Slightly detuned
    STA $D40E       ; Voice 3 (modulator)
    LDA #$70
    STA $D40F
    
    ; Bell envelope: fast attack, slow decay
    LDA #%11110000  ; Fast attack, fast decay
    STA $D405
    STA $D413
    LDA #%01000111  ; Low sustain, slow release
    STA $D406
    STA $D414
    
    ; Start bell with ring modulation
    LDA #%00010001  ; Triangle + Gate
    STA $D412       ; Voice 3
    
    LDA #%00010101  ; Triangle + Ring Mod + Gate
    STA $D404       ; Voice 1
    
    ; Hold and decay
    JSR BellDelay
    
    ; Release
    LDA #%00000000
    STA $D404
    STA $D412
    
    RTS

BrassDelay:
    LDX #$FF
BrWait:
    DEX
    BNE BrWait
    RTS

StringDelay:
    LDX #$FF
StWait1:
    LDY #$80
StWait2:
    DEY
    BNE StWait2
    DEX
    BNE StWait1
    RTS

StringPWMDelay:
    LDY #$60
SPWait:
    DEY
    BNE SPWait
    RTS

BellDelay:
    LDX #$FF
BeWait1:
    LDY #$FF
BeWait2:
    DEY
    BNE BeWait2
    DEX
    BNE BeWait1
    RTS

InstrumentPause:
    LDX #$80
IPWait1:
    LDY #$FF
IPWait2:
    DEY
    BNE IPWait2
    DEX
    BNE IPWait1
    RTS
```

## Practice Exercise

Create a comprehensive synthesis demonstration showcasing:

1. Filter sweeps with different modes and resonance
2. Pulse width modulation effects
3. Ring modulation for metallic sounds
4. Oscillator sync for lead tones
5. Combination synthesis patch using multiple techniques

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Advanced Synthesis Showcase"
  code="; Complete synthesis technique demonstration
; Showcases all advanced SID features

SynthesisShowcase:
    JSR FilterShowcase
    JSR PWMShowcase
    JSR ModulationShowcase
    JSR CombinedPatch
    JMP SynthesisShowcase ; Loop demo

FilterShowcase:
    ; Bright sawtooth for filter demonstration
    LDA #$50        ; Clear frequency
    STA $D400
    LDA #$70
    STA $D401
    
    ; Quick envelope for clear filter effect
    LDA #%11110000  ; Fast attack, no decay
    STA $D405
    LDA #%11110000  ; Full sustain, no release
    STA $D406
    
    ; Start sawtooth
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404
    
    ; Route to filter
    LDA #%00100000  ; Voice 1 to filter
    STA $D417
    
    ; Filter mode sweep: LP -> HP -> BP
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    JSR FilterModeDelay
    
    LDA #%01000111  ; High-pass + volume
    STA $D418
    JSR FilterModeDelay
    
    LDA #%00100111  ; Band-pass + volume
    STA $D418
    JSR FilterModeDelay
    
    ; Resonance sweep with low-pass
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    
    LDX #$00
ResSweep:
    TXA
    AND #%00001111  ; Resonance value
    ORA #%00100000  ; Voice 1 routing
    STA $D417
    
    JSR ResSweepDelay
    INX
    CPX #$10
    BNE ResSweep
    
    ; Stop filter demo
    LDA #%00000000
    STA $D404
    STA $D417
    RTS

PWMShowcase:
    ; Pulse wave with animated width
    LDA #$40
    STA $D400
    LDA #$65
    STA $D401
    
    LDA #%01000001  ; Pulse + Gate
    STA $D404
    
    ; Animate pulse width
    LDX #$00
PWMCycle:
    TXA             ; Use counter for width variation
    ASL             ; Expand range
    STA $D402       ; Width low
    
    TXA
    LSR
    LSR
    ADC #$02        ; Minimum width
    AND #%00001111  ; Valid range
    STA $D403       ; Width high
    
    JSR PWMCycleDelay
    INX
    CPX #$80        ; Full cycle
    BNE PWMCycle
    
    LDA #%00000000
    STA $D404
    RTS

ModulationShowcase:
    ; Ring modulation example
    LDA #$35        ; Voice 1 frequency
    STA $D400
    LDA #$55
    STA $D401
    
    LDA #$38        ; Voice 3 frequency (modulator)
    STA $D40E
    LDA #$58
    STA $D40F
    
    ; Start both voices
    LDA #%00100001  ; Sawtooth + Gate
    STA $D404       ; Voice 1
    STA $D412       ; Voice 3
    
    JSR ModShowDelay
    
    ; Enable ring modulation
    LDA #%00100101  ; Sawtooth + Ring Mod + Gate
    STA $D404
    
    JSR ModShowDelay
    
    ; Stop modulation demo
    LDA #%00000000
    STA $D404
    STA $D412
    RTS

CombinedPatch:
    ; Complex patch using multiple techniques
    
    ; Voice 1: Filtered pulse with PWM
    LDA #$30
    STA $D400
    LDA #$50
    STA $D401
    LDA #$00
    STA $D402       ; PWM low
    LDA #$06
    STA $D403       ; PWM high
    
    ; Voice 2: Ring modulated saw
    LDA #$32
    STA $D407
    LDA #$52
    STA $D408
    
    ; Voice 3: Sync master
    LDA #$18
    STA $D40E
    LDA #$30
    STA $D40F
    
    ; Filter setup
    LDA #%11100110  ; All voices + resonance
    STA $D417
    LDA #%00010111  ; Low-pass + volume
    STA $D418
    
    ; Start complex patch
    LDA #%01000011  ; Pulse + Sync + Gate
    STA $D404       ; Voice 1
    
    LDA #%00100101  ; Saw + Ring Mod + Gate
    STA $D40B       ; Voice 2
    
    LDA #%00100001  ; Saw + Gate
    STA $D412       ; Voice 3
    
    ; Evolve the patch
    LDX #$00
PatchEvolve:
    ; Update filter cutoff
    TXA
    AND #%00000111
    STA $D415
    TXA
    LSR
    LSR
    LSR
    STA $D416
    
    ; Update PWM
    TXA
    STA $D402
    
    JSR PatchDelay
    INX
    CPX #$60
    BNE PatchEvolve
    
    ; Stop complex patch
    LDA #%00000000
    STA $D404
    STA $D40B
    STA $D412
    STA $D417
    RTS

; Delay routines
FilterModeDelay:
    LDX #$FF
FMWait:
    DEX
    BNE FMWait
    RTS

ResSweepDelay:
    LDY #$40
RSWait:
    DEY
    BNE RSWait
    RTS

PWMCycleDelay:
    LDY #$30
PCWait:
    DEY
    BNE PCWait
    RTS

ModShowDelay:
    LDX #$FF
MSWait:
    DEX
    BNE MSWait
    RTS

PatchDelay:
    LDY #$50
PTWait:
    DEY
    BNE PTWait
    RTS

; Start the synthesis showcase
JSR SynthesisShowcase"
  language="assembly"
/>

## Synthesis Best Practices

### 1. Filter Programming
```text
; Always set cutoff before enabling filter
; Use resonance carefully - too much can overload
; Plan filter routing for each voice
```

### 2. Modulation Effects
```text
; Ring mod works best with harmonic relationships
; Sync requires proper frequency ratios
; PWM is most effective on pulse waves
```

### 3. Voice Management
```text
; Plan which voice does what:
; Voice 1: Lead/melody (full feature access)
; Voice 2: Harmony/effects
; Voice 3: Bass/modulation source
```

## What You've Learned

In this lesson, you've mastered advanced SID synthesis:

- Multimode filter programming with cutoff and resonance control
- Pulse width modulation for dynamic waveform shaping
- Ring modulation for metallic and complex timbres
- Oscillator sync for harmonically rich lead sounds
- Advanced synthesis techniques combining multiple effects
- Instrument sound design and synthesis programming

## Looking Ahead

In the next lesson, you'll learn **music and advanced audio programming** - putting all your synthesis knowledge together to create songs, sequences, and complete musical compositions using the SID chip.

## Fun Fact

The synthesis techniques you've just mastered were the same ones used by professional musicians in the 1980s! Artists like Jean-Michel Jarre used the exact same concepts - filters, modulation, sync - on synthesizers costing tens of thousands of dollars. The SID chip democratized electronic music production, bringing professional synthesis capabilities to home users. Today's software synthesizers, hardware modular systems, and digital audio workstations all use these fundamental techniques. You've learned the core principles that power all electronic music - from vintage analog synthesizers to modern EDM production!