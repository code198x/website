---
title: "Sound Chip Basics and Audio Programming"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 15
description: "Discover Paula, the Amiga's revolutionary audio chip! Learn to play digital samples, control 4-channel stereo sound, and create your first audio programs using direct hardware control."
learning_objectives:
  - "Understand Paula's 4-channel digital audio architecture"
  - "Set up audio channels for sample playback"
  - "Control volume, period (pitch), and sample length"
  - "Create stereo effects and multi-channel compositions"
  - "Synchronize audio with graphics for multimedia programs"
concepts:
  - "4-channel digital audio with hardware mixing"
  - "Audio channel registers and DMA setup"
  - "Sample period calculation and pitch control"
  - "Volume control and stereo panning"
  - "Audio interrupts and synchronization"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 15
---

# Lesson 15: Sound Chip Basics and Audio Programming

Welcome to the world of Amiga audio! Paula, the Amiga's sound chip, was revolutionary - providing 4-channel digital audio with hardware mixing when most computers could only beep. Today you'll learn to control Paula directly and discover how to add immersive audio to your Copper Dreams game.

## Paula - The Revolutionary Audio Chip

Paula's audio capabilities were unprecedented for home computers:

- **4 Independent Channels**: Each with its own sample, volume, and pitch
- **8-bit Digital Samples**: Direct sample playback, not synthesized tones
- **Hardware Mixing**: All 4 channels mixed automatically in hardware
- **Stereo Output**: Channels 0&3 left, channels 1&2 right
- **DMA Sample Playback**: Automatic sample feeding without CPU intervention
- **Variable Sample Rates**: From very low to 28KHz maximum

## Audio Channel Architecture

Each of the 4 audio channels has identical capabilities:

### Channel Register Sets:
- **AUDxLC**: Location (sample data pointer)
- **AUDxLEN**: Length (sample length in words)
- **AUDxPER**: Period (controls playback rate/pitch)
- **AUDxVOL**: Volume (0-64, with 64 being maximum)
- **AUDxDAT**: Data (current sample being played)

## Setting Up Your First Audio Channel

Let's start with a simple example - playing a sample on channel 0:

<CodeRunner 
  system="commodore-amiga"
  title="Basic Audio Channel Setup"
  code="; Setup audio channel 0 for sample playback
MOVE.L #$00DFF000, A0        ; Custom chip base

; First, create a simple sample in Chip RAM
MOVE.L #$00040000, A1        ; Sample location in Chip RAM
MOVE.W #255, D0              ; Sample counter
CREATE_SAMPLE:
    MOVE.B D0, (A1)+         ; Store sample value
    DBF D0, CREATE_SAMPLE    ; Create 256-byte ramp sample

; Setup audio channel 0
MOVE.L #$00040000, $0A0(A0)  ; AUD0LC - Sample location
MOVE.W #128, $0A4(A0)        ; AUD0LEN - Sample length (128 words = 256 bytes)
MOVE.W #200, $0A6(A0)        ; AUD0PER - Period (controls pitch)
MOVE.W #64, $0A8(A0)         ; AUD0VOL - Maximum volume

; Enable audio DMA for channel 0
MOVE.W #$8201, $096(A0)      ; Master DMA + Audio channel 0"
  language="assembly"
/>

## Understanding Audio Periods and Pitch

The period register controls how fast samples are played:

- **Lower period = Higher pitch** (samples played faster)
- **Higher period = Lower pitch** (samples played slower)
- **Formula**: Period = 3546895 / Sample_Rate_Hz
- **Common values**: 124 (≈28KHz), 200 (≈17KHz), 400 (≈8.8KHz)

<CodeRunner 
  system="commodore-amiga"
  title="Period and Pitch Control"
  code="; Demonstrate different periods/pitches
MOVE.L #$00DFF000, A0

; Create a simple tone sample
MOVE.L #$00040000, A1        ; Sample memory
MOVE.W #63, D0               ; Create 64-byte sample
TONE_SAMPLE:
    MOVE.B D0, (A1)+         ; Ramp up
    DBF D0, TONE_SAMPLE
MOVE.W #63, D0
TONE_SAMPLE2:
    MOVE.B D0, (A1)+         ; Ramp down  
    DBF D0, TONE_SAMPLE2

; Setup audio channel
MOVE.L #$00040000, $0A0(A0)  ; Sample location
MOVE.W #64, $0A4(A0)         ; Sample length (64 words = 128 bytes)
MOVE.W #64, $0A8(A0)         ; Full volume

; Play at high pitch
MOVE.W #100, $0A6(A0)        ; High pitch (low period)
MOVE.W #$8201, $096(A0)      ; Enable channel 0

; Wait a moment (in real program, use proper timing)
MOVE.W #$FFFF, D0
WAIT1:
    DBF D0, WAIT1

; Play at medium pitch
MOVE.W #200, $0A6(A0)        ; Medium pitch

; Wait again
MOVE.W #$FFFF, D0
WAIT2:
    DBF D0, WAIT2

; Play at low pitch  
MOVE.W #400, $0A6(A0)        ; Low pitch (high period)"
  language="assembly"
/>

## Multi-Channel Audio Programming

Paula's power shows when using multiple channels simultaneously:

<CodeRunner 
  system="commodore-amiga"
  title="4-Channel Audio Setup"
  code="; Setup all 4 audio channels for different samples
MOVE.L #$00DFF000, A0

; Create different samples for each channel
; Channel 0 sample - low frequency wave
MOVE.L #$00040000, A1        ; Channel 0 sample
MOVE.W #127, D0
CH0_SAMPLE:
    MOVE.B #$80, (A1)+       ; Positive sample
    MOVE.B #$7F, (A1)+       ; Negative sample
    DBF D0, CH0_SAMPLE

; Channel 1 sample - medium frequency wave
MOVE.L #$00040200, A2        ; Channel 1 sample (512 bytes later)
MOVE.W #63, D0
CH1_SAMPLE:
    MOVE.B #$C0, (A2)+       ; Positive
    MOVE.B #$40, (A2)+       ; Negative
    DBF D0, CH1_SAMPLE

; Channel 2 sample - high frequency wave
MOVE.L #$00040400, A3        ; Channel 2 sample (1024 bytes from start)
MOVE.W #31, D0
CH2_SAMPLE:
    MOVE.B #$A0, (A3)+       ; Positive
    MOVE.B #$60, (A3)+       ; Negative
    DBF D0, CH2_SAMPLE

; Channel 3 sample - noise-like pattern
MOVE.L #$00040600, A4        ; Channel 3 sample
MOVE.W #127, D0
MOVE.W #$1234, D1            ; Seed for pseudo-random
CH3_SAMPLE:
    ROL.W #1, D1             ; Simple pseudo-random
    MOVE.B D1, (A4)+
    DBF D0, CH3_SAMPLE

; Setup all 4 channels
; Channel 0 (left)
MOVE.L #$00040000, $0A0(A0)  ; AUD0LC
MOVE.W #128, $0A4(A0)        ; AUD0LEN
MOVE.W #300, $0A6(A0)        ; AUD0PER - Low pitch
MOVE.W #48, $0A8(A0)         ; AUD0VOL - 3/4 volume

; Channel 1 (right)
MOVE.L #$00040200, $0B0(A0)  ; AUD1LC
MOVE.W #64, $0B4(A0)         ; AUD1LEN
MOVE.W #200, $0B6(A0)        ; AUD1PER - Medium pitch
MOVE.W #32, $0B8(A0)         ; AUD1VOL - 1/2 volume

; Channel 2 (right)
MOVE.L #$00040400, $0C0(A0)  ; AUD2LC
MOVE.W #32, $0C4(A0)         ; AUD2LEN
MOVE.W #150, $0C6(A0)        ; AUD2PER - High pitch
MOVE.W #16, $0C8(A0)         ; AUD2VOL - 1/4 volume

; Channel 3 (left)
MOVE.L #$00040600, $0D0(A0)  ; AUD3LC
MOVE.W #128, $0D4(A0)        ; AUD3LEN
MOVE.W #400, $0D6(A0)        ; AUD3PER - Very low pitch
MOVE.W #24, $0D8(A0)         ; AUD3VOL - Low volume

; Enable all audio channels
MOVE.W #$820F, $096(A0)      ; Master DMA + all 4 audio channels"
  language="assembly"
/>

## Stereo Effects and Panning

The Amiga's fixed stereo setup can be enhanced with volume control:

<CodeRunner 
  system="commodore-amiga"
  title="Stereo Effects with Volume Control"
  code="; Create stereo effects using volume control
MOVE.L #$00DFF000, A0

; Create identical samples for multiple channels
MOVE.L #$00040000, A1        ; Sample memory
MOVE.W #255, D0
STEREO_SAMPLE:
    MOVE.B D0, (A1)+         ; Create test sample
    DBF D0, STEREO_SAMPLE

; Point all channels to same sample
MOVE.L #$00040000, $0A0(A0)  ; AUD0LC (left)
MOVE.L #$00040000, $0B0(A0)  ; AUD1LC (right)
MOVE.L #$00040000, $0C0(A0)  ; AUD2LC (right)
MOVE.L #$00040000, $0D0(A0)  ; AUD3LC (left)

; Set identical periods and lengths
MOVE.W #128, $0A4(A0)        ; AUD0LEN
MOVE.W #128, $0B4(A0)        ; AUD1LEN
MOVE.W #128, $0C4(A0)        ; AUD2LEN
MOVE.W #128, $0D4(A0)        ; AUD3LEN

MOVE.W #200, $0A6(A0)        ; AUD0PER
MOVE.W #200, $0B6(A0)        ; AUD1PER
MOVE.W #200, $0C6(A0)        ; AUD2PER
MOVE.W #200, $0D6(A0)        ; AUD3PER

; Create panning effect by varying volumes
; Effect 1: Sound moves from left to right
MOVE.W #64, $0A8(A0)         ; Channel 0 (left) - full
MOVE.W #64, $0D8(A0)         ; Channel 3 (left) - full
MOVE.W #0, $0B8(A0)          ; Channel 1 (right) - off
MOVE.W #0, $0C8(A0)          ; Channel 2 (right) - off

MOVE.W #$820F, $096(A0)      ; Enable all channels

; Wait, then shift to center
MOVE.W #$7FFF, D0
WAIT_CENTER:
    DBF D0, WAIT_CENTER

MOVE.W #32, $0A8(A0)         ; Left channels - half
MOVE.W #32, $0D8(A0)
MOVE.W #32, $0B8(A0)         ; Right channels - half
MOVE.W #32, $0C8(A0)

; Wait, then shift to right
MOVE.W #$7FFF, D0
WAIT_RIGHT:
    DBF D0, WAIT_RIGHT

MOVE.W #0, $0A8(A0)          ; Left channels - off
MOVE.W #0, $0D8(A0)
MOVE.W #64, $0B8(A0)         ; Right channels - full
MOVE.W #64, $0C8(A0)"
  language="assembly"
/>

## Audio Interrupts and Synchronization

Paula can generate interrupts when samples finish playing:

<CodeRunner 
  system="commodore-amiga"
  title="Audio Interrupt Setup"
  code="; Setup audio interrupts for synchronization
MOVE.L #$00DFF000, A0

; Setup interrupt vectors (simplified example)
; In real system, would need proper interrupt handling

; Enable audio interrupts
MOVE.W #$8880, $09A(A0)      ; INTENA - Enable audio interrupts
; Bit 15 = SET, Bit 7 = INTEN, Bits 3-0 = AUD0-3

; Setup a short sample that will trigger interrupt
MOVE.L #$00040000, A1
MOVE.W #15, D0               ; Very short sample
SHORT_SAMPLE:
    MOVE.B #$80, (A1)+
    DBF D0, SHORT_SAMPLE

; Setup channel for interrupt generation
MOVE.L #$00040000, $0A0(A0)  ; AUD0LC
MOVE.W #8, $0A4(A0)          ; AUD0LEN - Short length
MOVE.W #200, $0A6(A0)        ; AUD0PER
MOVE.W #64, $0A8(A0)         ; AUD0VOL

; Enable channel - will generate interrupt when done
MOVE.W #$8201, $096(A0)      ; Enable channel 0

; Check for interrupt (simplified)
CHECK_INTERRUPT:
    MOVE.W $01E(A0), D0      ; INTREQR - Read interrupt requests
    BTST #7, D0              ; Test audio interrupt bit
    BEQ CHECK_INTERRUPT      ; Wait for interrupt

; Clear interrupt
MOVE.W #$0080, $09C(A0)      ; INTREQ - Clear audio interrupt

; Interrupt occurred - sample finished playing"
  language="assembly"
/>

## Creating Audio Effects

Let's create some basic audio effects using Paula's capabilities:

<CodeRunner 
  system="commodore-amiga"
  title="Audio Effects Programming"
  code="; Audio effects demonstration
MOVE.L #$00DFF000, A0

; Effect 1: Echo using multiple channels
; Create base sample
MOVE.L #$00040000, A1        ; Original sample
MOVE.W #127, D0
ECHO_SAMPLE:
    MOVE.B D0, (A1)+         ; Descending ramp
    DBF D0, ECHO_SAMPLE

; Copy sample for echo (quieter version)
MOVE.L #$00040000, A1        ; Source
MOVE.L #$00040200, A2        ; Echo destination
MOVE.W #127, D0
COPY_ECHO:
    MOVE.B (A1)+, D1         ; Get original sample
    LSR.B #1, D1             ; Make it quieter (half volume)
    MOVE.B D1, (A2)+         ; Store echo sample
    DBF D0, COPY_ECHO

; Play original on left, echo on right with delay
MOVE.L #$00040000, $0A0(A0)  ; Original on channel 0 (left)
MOVE.W #64, $0A4(A0)
MOVE.W #200, $0A6(A0)
MOVE.W #64, $0A8(A0)

; Start original
MOVE.W #$8201, $096(A0)

; Wait for delay
MOVE.W #$3FFF, D0
ECHO_DELAY:
    DBF D0, ECHO_DELAY

; Start echo on right
MOVE.L #$00040200, $0B0(A0)  ; Echo on channel 1 (right)
MOVE.W #64, $0B4(A0)
MOVE.W #200, $0B6(A0)
MOVE.W #32, $0B8(A0)         ; Quieter
MOVE.W #$8203, $096(A0)      ; Enable both channels

; Effect 2: Pitch bend using period modulation
MOVE.W #100, D1              ; Starting period
MOVE.W #50, D2               ; Counter

PITCH_BEND:
    MOVE.W D1, $0A6(A0)      ; Set new period
    ADD.W #5, D1             ; Increase period (lower pitch)
    
    ; Short delay
    MOVE.W #$1FF, D0
    BEND_DELAY:
        DBF D0, BEND_DELAY
    
    DBF D2, PITCH_BEND       ; Continue bending

; Effect 3: Volume fade
MOVE.W #64, D1               ; Starting volume
MOVE.W #64, D2               ; Counter

VOLUME_FADE:
    MOVE.W D1, $0A8(A0)      ; Set new volume
    SUB.W #1, D1             ; Decrease volume
    
    ; Short delay
    MOVE.W #$7FF, D0
    FADE_DELAY:
        DBF D0, FADE_DELAY
    
    DBF D2, VOLUME_FADE      ; Continue fading"
  language="assembly"
/>

## Sample Rate Calculation

Understanding how to calculate periods for specific sample rates:

<CodeRunner 
  system="commodore-amiga"
  title="Sample Rate and Period Calculations"
  code="; Sample rate calculations and common periods
; Formula: Period = 3546895 / Desired_Sample_Rate_Hz

; Common sample rates and their periods:
; 44100 Hz = Period 80   (CD quality, but Amiga max is ~28KHz)
; 22050 Hz = Period 161  (High quality)
; 11025 Hz = Period 322  (Medium quality)
; 8000 Hz  = Period 443  (Telephone quality)

SAMPLE_RATES:
    ; Setup for different quality levels
    MOVE.L #$00DFF000, A0
    
    ; High quality setup (22KHz approx)
    MOVE.W #161, $0A6(A0)    ; AUD0PER = 22KHz
    
    ; Medium quality setup (11KHz approx)  
    MOVE.W #322, $0B6(A0)    ; AUD1PER = 11KHz
    
    ; Low quality setup (8KHz approx)
    MOVE.W #443, $0C6(A0)    ; AUD2PER = 8KHz
    
    ; Very low quality (4KHz approx)
    MOVE.W #886, $0D6(A0)    ; AUD3PER = 4KHz

; Calculate period for custom sample rate
; Input: D0 = desired sample rate in Hz
; Output: D1 = period value

CALCULATE_PERIOD:
    ; Period = 3546895 / Sample_Rate
    MOVE.L #3546895, D2      ; PAL color clock frequency
    DIVU.W D0, D2            ; Divide by sample rate
    MOVE.W D2, D1            ; Result in D1
    RTS

; Example: Calculate period for 16KHz
PERIOD_EXAMPLE:
    MOVE.W #16000, D0        ; 16KHz sample rate
    BSR CALCULATE_PERIOD     ; Calculate period
    ; D1 now contains period for 16KHz (≈221)"
  language="assembly"
/>

## Advanced Multi-Channel Composition

Create a simple musical composition using all 4 channels:

<CodeRunner 
  system="commodore-amiga"
  title="4-Channel Musical Composition"
  code="; Simple 4-channel musical composition
MOVE.L #$00DFF000, A0

; Create different waveforms for each channel
; Channel 0: Bass drum (low frequency thump)
MOVE.L #$00040000, A1
MOVE.W #31, D0
BASS_DRUM:
    MOVE.B #$FF, (A1)+       ; High amplitude
    MOVE.B #$00, (A1)+       ; Low amplitude
    DBF D0, BASS_DRUM

; Channel 1: Snare drum (noise-like)
MOVE.L #$00040100, A2
MOVE.W #15, D0
MOVE.W #$ABCD, D1            ; Noise seed
SNARE_DRUM:
    ROL.W #3, D1             ; Generate pseudo-noise
    MOVE.B D1, (A2)+
    ROL.W #1, D1
    MOVE.B D1, (A2)+
    DBF D0, SNARE_DRUM

; Channel 2: Hi-hat (high frequency noise)
MOVE.L #$00040200, A3
MOVE.W #7, D0
MOVE.W #$1357, D1
HI_HAT:
    ROL.W #5, D1
    MOVE.B D1, (A3)+
    DBF D0, HI_HAT

; Channel 3: Bass line (sine-like wave)
MOVE.L #$00040300, A4
MOVE.W #63, D0
BASS_LINE:
    MOVE.B D0, (A4)+         ; Rising
    DBF D0, BASS_LINE
MOVE.W #63, D0
BASS_LINE2:
    MOVE.B D0, (A4)+         ; Falling
    DBF D0, BASS_LINE2

; Setup drum pattern
DRUM_PATTERN:
    ; Beat 1: Bass drum
    MOVE.L #$00040000, $0A0(A0)  ; Bass drum sample
    MOVE.W #32, $0A4(A0)         ; Length
    MOVE.W #400, $0A6(A0)        ; Low pitch
    MOVE.W #64, $0A8(A0)         ; Full volume
    MOVE.W #$8201, $096(A0)      ; Start bass

    ; Wait
    MOVE.W #$3FFF, D0
    WAIT1:
        DBF D0, WAIT1

    ; Beat 2: Snare drum  
    MOVE.L #$00040100, $0B0(A0)  ; Snare sample
    MOVE.W #16, $0B4(A0)
    MOVE.W #200, $0B6(A0)        ; Medium pitch
    MOVE.W #48, $0B8(A0)         ; 3/4 volume
    MOVE.W #$8203, $096(A0)      ; Add snare

    ; Wait
    MOVE.W #$3FFF, D0
    WAIT2:
        DBF D0, WAIT2

    ; Beat 3: Hi-hat
    MOVE.L #$00040200, $0C0(A0)  ; Hi-hat sample
    MOVE.W #8, $0C4(A0)
    MOVE.W #100, $0C6(A0)        ; High pitch
    MOVE.W #24, $0C8(A0)         ; Low volume
    MOVE.W #$8207, $096(A0)      ; Add hi-hat

    ; Beat 4: Bass line
    MOVE.L #$00040300, $0D0(A0)  ; Bass line sample
    MOVE.W #64, $0D4(A0)
    MOVE.W #300, $0D6(A0)        ; Bass frequency
    MOVE.W #32, $0D8(A0)         ; Medium volume
    MOVE.W #$820F, $096(A0)      ; All channels

    ; Wait for pattern to complete
    MOVE.W #$7FFF, D0
    PATTERN_WAIT:
        DBF D0, PATTERN_WAIT

    ; Repeat pattern (in real program, use proper timing)
    BRA DRUM_PATTERN"
  language="assembly"
/>

## Practice Exercise: Audio-Visual Synchronization

Create a program that synchronizes audio with graphics:

<CodeRunner 
  system="commodore-amiga"
  title="Practice: Audio-Visual Sync Demo"
  code="; Audio-visual synchronization demonstration
AUDIO_VISUAL_DEMO:
    MOVE.L #$00DFF000, A0    ; Custom chips

    ; Setup graphics (simple color change)
    MOVE.W #$1200, $100(A0)  ; 1 bitplane display
    MOVE.W #$8100, $096(A0)  ; Enable graphics DMA

    ; Setup audio sample
    MOVE.L #$00040000, A1
    MOVE.W #127, D0
    SYNC_SAMPLE:
        MOVE.B D0, (A1)+     ; Create sample
        DBF D0, SYNC_SAMPLE

    ; Setup audio channel
    MOVE.L #$00040000, $0A0(A0)  ; Sample location
    MOVE.W #64, $0A4(A0)         ; Sample length
    MOVE.W #200, $0A6(A0)        ; Period
    MOVE.W #64, $0A8(A0)         ; Volume

    ; Enable audio interrupts
    MOVE.W #$8080, $09A(A0)      ; Enable audio interrupt

SYNC_LOOP:
    ; Change background color
    MOVE.W #$0F00, $180(A0)      ; Red background
    
    ; Start audio
    MOVE.W #$8201, $096(A0)      ; Enable audio channel 0
    
    ; Wait for audio interrupt (sample finished)
    WAIT_AUDIO:
        MOVE.W $01E(A0), D0      ; Check interrupts
        BTST #7, D0              ; Audio interrupt?
        BEQ WAIT_AUDIO           ; Wait for it
    
    ; Clear interrupt
    MOVE.W #$0080, $09C(A0)      ; Clear audio interrupt
    
    ; Change color when audio stops
    MOVE.W #$000F, $180(A0)      ; Blue background
    
    ; Wait a moment
    MOVE.W #$7FFF, D0
    VISUAL_DELAY:
        DBF D0, VISUAL_DELAY
    
    ; Repeat the sync demo
    BRA SYNC_LOOP"
  language="assembly"
/>

## What You've Learned

In this comprehensive audio lesson, you've mastered:

- Paula's 4-channel digital audio architecture
- Audio channel registers and setup procedures
- Period calculation for different sample rates and pitches
- Volume control and stereo effects using channel positioning
- Multi-channel audio programming and synchronization
- Audio interrupts for timing and synchronization
- Creating audio effects like echo, pitch bending, and fading
- Audio-visual synchronization techniques
- Musical composition using multiple channels

## Audio Programming Best Practices

1. **Samples must be in Chip RAM** - Paula can only access Chip RAM via DMA
2. **Use appropriate sample rates** - Higher rates consume more memory and bandwidth
3. **Balance channel usage** - Distribute load across all 4 channels
4. **Consider stereo positioning** - Channels 0&3 are left, 1&2 are right
5. **Use interrupts for timing** - More accurate than CPU timing loops
6. **Plan memory usage** - Audio samples can consume significant Chip RAM
7. **Test volume levels** - Prevent clipping and distortion

## Looking Ahead

In the next lesson, you'll create your first major integration project, combining all the skills you've learned so far - 68000 assembly, memory management, graphics programming, and audio control - into a complete multimedia demonstration that showcases the Amiga's revolutionary capabilities!

## Fun Fact

Paula's 4-channel digital audio was so advanced that it remained competitive with dedicated sound cards for many years! While PC users had to buy expensive sound cards like the Sound Blaster to get similar capabilities, every Amiga came with Paula built-in. The hardware mixing was particularly revolutionary - most other computers required the CPU to mix multiple audio channels in software, which was slow and consumed significant processing power. Paula could mix all 4 channels in hardware while the CPU was completely free to do other work, enabling complex audio programs that were impossible on other home computers of the era!