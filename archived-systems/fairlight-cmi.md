---
name: "Fairlight CMI"
slug: "fairlight-cmi"
manufacturer: "Fairlight Instruments"
model_number: "CMI Series I"
medal_tier: "bronze"
total_lessons: 512
total_games: 8
estimated_duration: "2-4 weeks"
cpu_architecture: "Motorola 6800"
difficulty_level: "advanced"
architecture_family: "8-bit + DSP"
prerequisite_platforms: ["apple-ii"]
recommended_next: ["commodore-amiga", "atari-st"]
cpu: "Dual Motorola 6800"
clock_speed: "2 MHz"
ram: "64 KB main + 64 KB sample RAM"
rom: "16 KB system ROM"
video:
  processor: "Custom video controller"
  resolution: "512×200 pixels"
  colors: "Monochrome green"
  display_modes:
    - "512×200 high resolution"
    - "Character-based display"
    - "Graphics overlay modes"
    - "Light pen support"
audio:
  chip: "Custom digital synthesis"
  channels: 8
  features:
    - "8-bit sampling at 30 kHz"
    - "Real-time synthesis"
    - "Additive synthesis"
    - "Digital filtering"
storage:
  - "Dual 8\" floppy disk drives"
  - "Hard disk (later models)"
  - "Digital cassette backup"
io_ports:
  - "Music keyboard (61 keys)"
  - "Light pen interface"
  - "QWERTY keyboard"
  - "SMPTE timecode sync"
  - "MIDI (later models)"
price_at_launch:
  global: "$30,000 USD (1979)"
  countries:
    - country: "United States"
      price: "30000"
      currency: "USD"
    - country: "United Kingdom"
      price: "25000"
      currency: "GBP"
release_date:
  global: 1979-05-01
  countries:
    - country: "Australia"
      date: 1979-05-01
    - country: "United States"
      date: 1980-01-01
    - country: "United Kingdom"
      date: 1980-06-01
discontinued: 1988-01-01
units_sold: "300"
country_of_origin: "Australia"
operating_system: "QASAR (custom real-time OS)"
emulated: true
emulators:
  - name: "CMI V"
    platform: "Software plugin"
    accuracy: "high"
  - name: "Arturia CMI V"
    platform: "VST/AU plugin"
    accuracy: "high"
  - name: "MAME CMI"
    platform: "Multi-platform"
    accuracy: "good"
variants:
  - name: "CMI Series I"
    model_number: "CMI I"
    release_date:
      global: 1979-05-01
    differences: "Original model with green screen"
  - name: "CMI Series II"
    model_number: "CMI II"
    release_date:
      global: 1982-01-01
    differences: "Improved graphics, more sample memory"
  - name: "CMI Series IIx"
    model_number: "CMI IIx"
    release_date:
      global: 1985-01-01
    differences: "Hard disk, MIDI, 16 voices"
  - name: "CMI Series III"
    model_number: "CMI III"
    release_date:
      global: 1987-01-01
    differences: "68000 processor, color graphics"
notable_software:
  - name: "Page R (Real-time Sequencer)"
    type: "Music Software"
    year: 1979
    developer: "Fairlight Instruments"
    publisher: "Fairlight Instruments"
  - name: "Page S (Sampling)"
    type: "Audio Software"
    year: 1979
    developer: "Fairlight Instruments"
    publisher: "Fairlight Instruments"
  - name: "Page 9 (Voice Programming)"
    type: "Synthesis Software"
    year: 1979
    developer: "Fairlight Instruments"
    publisher: "Fairlight Instruments"
  - name: "Page T (Time Base)"
    type: "Utility Software"
    year: 1982
    developer: "Fairlight Instruments"
    publisher: "Fairlight Instruments"
  - name: "Page P (Performance)"
    type: "Live Performance"
    year: 1982
    developer: "Fairlight Instruments"
    publisher: "Fairlight Instruments"
  - name: "Page D (Disk Utilities)"
    type: "System Software"
    year: 1979
    developer: "Fairlight Instruments"
    publisher: "Fairlight Instruments"
  - name: "Page M (MIDI)"
    type: "MIDI Software"
    year: 1985
    developer: "Fairlight Instruments"
    publisher: "Fairlight Instruments"
  - name: "ARR1 (Orchestra Hit)"
    type: "Sample"
    year: 1979
    developer: "Fairlight Instruments"
    publisher: "Fairlight Instruments"
historical_significance: "The Fairlight CMI revolutionized music production by introducing digital sampling to professional studios, making it the world's first commercially successful digital sampler/synthesizer workstation. Its innovative Page system user interface and high-quality digital sampling technology influenced the entire electronic music industry and established many conventions still used in modern DAWs."
description: "The revolutionary digital sampling workstation that transformed music production forever."
image: "/images/systems/fairlight-cmi.jpg"
order: 65
---

# Fairlight CMI: The Digital Music Revolution

The **Fairlight Computer Musical Instrument (CMI)** stands as one of the most revolutionary devices in music technology history. Released in 1979 by Australian company Fairlight Instruments, this $30,000 workstation introduced the world to digital sampling, real-time sequencing, and computer-based music production—concepts that would completely transform the music industry.

## The Sampling Revolution

The CMI's most groundbreaking feature was its digital sampling capability:
- **8-bit sampling at 30 kHz** - capturing real-world sounds digitally
- **2.5 seconds sampling time** - revolutionary for 1979
- **Real instrument recreation** - orchestral instruments in digital form
- **Sound manipulation** - pitch shifting, looping, and editing
- **Instant playback** - sounds triggered from musical keyboard

This was the first time musicians could capture any sound and play it melodically from a keyboard.

## QASAR Operating System

The CMI ran on a sophisticated custom operating system:
- **Page-based interface** - each function accessed via numbered "pages"
- **Real-time operation** - immediate response to musical input
- **Multitasking kernel** - multiple audio processes simultaneously
- **Graphical interface** - one of the first music systems with graphics
- **Light pen control** - direct manipulation of on-screen elements

### The Revolutionary Page System
The CMI organized functions into logical pages:
- **Page R** - Real-time 16-track sequencer
- **Page S** - Sampling and sound editing
- **Page 9** - Voice programming and synthesis
- **Page T** - Tempo and timing controls
- **Page P** - Performance and live playback
- **Page D** - Disk operations and file management

This interface model influenced every subsequent digital audio workstation.

## Dual 6800 Architecture

The CMI's processing power came from innovative dual-CPU design:
- **Main 6800 CPU** - system control and user interface
- **Audio 6800 CPU** - dedicated sound generation and processing
- **Shared memory** - 64 KB main + 64 KB sample RAM
- **Custom audio hardware** - specialized digital synthesis circuits
- **Real-time performance** - guaranteed audio timing without dropouts

This separation of system and audio processing became standard in professional audio equipment.

## Technical Innovation

### Digital Sample Storage
The CMI pioneered digital audio storage techniques:
- **8-bit linear PCM** - uncompressed digital audio
- **Looping algorithms** - seamless sound repetition
- **Sample rate conversion** - pitch shifting through playback speed
- **Memory optimization** - efficient use of limited RAM
- **Floppy disk storage** - permanent sample libraries

### Real-Time Synthesis
Beyond sampling, the CMI offered sophisticated synthesis:
- **Additive synthesis** - combining harmonic partials
- **Digital filtering** - real-time frequency manipulation
- **Envelope generation** - amplitude and filter control over time
- **Voice allocation** - 8-voice polyphony management
- **Parameter modulation** - real-time sound modification

### Sequencer Innovation
The CMI's sequencer established modern standards:
- **16-track recording** - multiple instrument parts
- **Real-time input** - record while playing
- **Step-time entry** - precise note placement
- **Quantization** - automatic timing correction
- **Song arrangement** - combining sequences into complete compositions

## Programming the CMI

### Page System Navigation
Users programmed the CMI through its page interface:
```
Page R - Real-time Sequencer
  [RECORD] [PLAY] [STOP]
  Track: 01  Instrument: STRINGS
  Bars: 16   Tempo: 120 BPM
  
  * - Start recording
  Q - Quantize timing
  C - Copy track
  E - Edit sequence
```

### Voice Programming (Page 9)
Creating custom instruments required understanding additive synthesis:
```
Voice Programming - Page 9
Partial 01: Freq 1.00  Level 64
Partial 02: Freq 2.00  Level 32  
Partial 03: Freq 3.00  Level 16
Partial 04: Freq 4.00  Level 08

Filter: Low-pass  Cutoff 2000 Hz
Envelope: Attack 10ms  Decay 100ms
         Sustain 80%   Release 500ms
```

### Sampling Operations (Page S)
Recording and editing samples involved precise control:
```
Sample Recording - Page S
Input Level: [====||||    ] -6dB
Record Length: 2.5 seconds
Sample Rate: 30 kHz

[RECORD] - Start sampling
[TRIM] - Edit start/end points  
[LOOP] - Set loop points
[SAVE] - Store to disk
```

## Cultural Impact and Famous Users

### Studio Revolution
The CMI transformed music production:
- **Peter Gabriel** - pioneered CMI use in rock music
- **Kate Bush** - extensive use on "Hounds of Love"
- **Herbie Hancock** - "Rockit" featured CMI prominently
- **Jan Hammer** - Miami Vice soundtrack sounds
- **Art of Noise** - entirely CMI-based compositions

### The Orchestra Hit
The CMI's most famous sample became a cultural phenomenon:
- **ARR1 sample** - orchestral hit from Stravinsky's "Firebird"
- **80s pop ubiquity** - appeared on countless hit records
- **Instant recognition** - defined the sound of an era
- **Cultural meme** - became synonymous with 80s music

### Genre Creation
The CMI enabled entirely new musical styles:
- **Hip-hop sampling** - though later replaced by cheaper alternatives
- **New wave production** - distinctive digital textures
- **Film scoring** - realistic orchestral mockups
- **Electronic music** - sophisticated sound design capabilities

## Why Study CMI Development?

### Digital Audio Fundamentals
CMI programming teaches essential audio concepts:
- **Digital sampling theory** - Nyquist theorem, aliasing, quantization
- **Real-time audio processing** - latency, buffering, interrupt handling
- **Synthesis algorithms** - additive synthesis, digital filtering
- **Music software architecture** - separating audio from control systems

### Interface Design Principles
The CMI established many UI conventions:
- **Page-based organization** - logical function grouping
- **Direct manipulation** - light pen and graphical editing
- **Real-time visual feedback** - seeing audio as graphics
- **Hierarchical menus** - nested function access

### Professional Audio Systems
Understanding CMI architecture reveals:
- **Dedicated audio processing** - separate CPUs for different tasks
- **Memory management** - efficient use of limited RAM for audio
- **File system design** - organizing large audio libraries
- **Hardware/software integration** - tight coupling for performance

## The Bronze Tier Curriculum

Our 512-lesson Bronze curriculum explores digital audio programming:

### Phase 1: Digital Audio Foundations (256 lessons)
- 6800 assembly programming for audio applications
- Digital sampling theory and implementation
- Basic synthesis algorithms
- Page system interface design

### Phase 2: Advanced Audio Programming (256 lessons)
- Real-time audio processing
- Complex synthesis techniques  
- Sequencer programming
- Professional audio software architecture

You'll create 8 audio projects ranging from simple sample players to complete music production tools, exploring the foundations of digital audio workstation development.

## Manufacturing and Marketing

### Australian Innovation
The CMI represented remarkable Australian engineering:
- **Sydney development** - Kim Ryrie and Peter Vogel's creation
- **Local manufacturing** - assembled in Australia
- **Global distribution** - exported worldwide from Australia
- **Technical innovation** - competing with much larger companies

### Professional Market Focus
Fairlight targeted professional users exclusively:
- **$30,000 price point** - accessible only to major studios
- **Comprehensive support** - extensive training and service
- **Professional documentation** - detailed technical manuals
- **Artist endorsements** - high-profile user promotion

## Technical Legacy

### Industry Standards
The CMI established conventions still used today:
- **Digital audio workstation architecture** - separate audio and control processing
- **Sampling standards** - digital audio capture and playback
- **Sequencer design** - multi-track recording and editing
- **User interface paradigms** - graphical audio editing

### Technology Transfer
CMI innovations appeared throughout the industry:
- **Affordable samplers** - Ensoniq Mirage, Akai S1000
- **Computer music software** - Pro Tools, Logic, Cubase
- **Hardware synthesizers** - digital synthesis became standard
- **Consumer electronics** - CD players, digital audio processors

## Development Environment

### Professional Programming
CMI development required sophisticated tools:
- **Cross-platform development** - programming on separate computers
- **Real-time debugging** - testing with live audio
- **Audio analysis tools** - spectrum analyzers and oscilloscopes
- **Performance optimization** - meeting strict timing requirements

### Custom Hardware Integration
Programming the CMI meant understanding:
- **Audio hardware interfaces** - A/D and D/A converters
- **Memory mapping** - efficient audio data organization
- **Interrupt handling** - real-time audio processing
- **Hardware timing** - synchronization with external equipment

## Market Evolution

### Competition and Innovation
The CMI's success spawned an entire industry:
- **New England Digital Synclavier** - direct competitor
- **Ensoniq Mirage** - affordable sampling alternative
- **Akai samplers** - focus on hip-hop and dance music
- **Computer-based systems** - software replaced dedicated hardware

### Price Democratization
Technology advancement made sampling accessible:
- **$30,000 CMI** (1979) vs. **$1,700 Mirage** (1985)
- **Professional studios only** vs. **home recording capability**
- **Complex programming** vs. **simplified interfaces**
- **Limited sampling time** vs. **extensive memory capacity**

## The "WOW" Moment

When you first program your own digital sample—perhaps recording a real orchestra hit and then playing it melodically from the keyboard, with real-time pitch shifting and filtering—you'll experience the same revolutionary moment that transformed 1980s music. The ability to capture any sound and transform it into a musical instrument was genuinely magical in 1979 and remains impressive today.

Learning CMI development teaches you the foundations of digital audio programming, real-time system design, and professional music software architecture. It's a masterclass in how revolutionary technology can create entirely new art forms and industries, demonstrating the power of Australian innovation to transform global creative industries.