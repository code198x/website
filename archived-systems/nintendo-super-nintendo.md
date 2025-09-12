---
name: "Super Nintendo Entertainment System"
slug: "nintendo-super-nintendo"
manufacturer: "Nintendo"
model_number: "SNES/Super Famicom"
medal_tier: "gold"
total_lessons: 2048
total_games: 25
estimated_duration: "3-6 months"
cpu_architecture: "65816"
difficulty_level: "intermediate"
architecture_family: "6502"
prerequisite_platforms: ["nintendo-entertainment-system"]
recommended_next: ["nintendo-64", "game-boy-advance"]
cpu: "Ricoh 5A22 (based on WDC 65C816)"
clock_speed: "3.58 MHz (21.47 MHz master clock)"
ram: "128 KB main RAM, 64 KB video RAM, 64 KB audio RAM"
rom: "Game cartridges (typically 512 KB to 6 MB)"
video:
  processor: "Picture Processing Unit (PPU)"
  resolution: "256×224 pixels (NTSC) / 256×239 pixels (PAL)"
  colors: "32,768 colors available, 256 on-screen simultaneously"
  display_modes:
    - "Mode 0: 4 background layers, 4 colors per tile"
    - "Mode 1: 3 background layers, 16/4 colors per tile"
    - "Mode 2: 2 background layers with per-line scrolling"
    - "Mode 3: 1 background layer, 256 colors direct color"
    - "Mode 4: 2 background layers with per-tile scrolling"
    - "Mode 5: 2 background layers, hi-res 512×224"
    - "Mode 6: 1 background layer, hi-res 512×224"
    - "Mode 7: Single rotating/scaling background layer"
  sprites:
    count: 128
    size: "8×8 to 64×64 pixels"
    colors_per_sprite: 16
  hardware_scrolling: true
  raster_interrupts: true
audio:
  chip: "Sony SPC700 + DSP"
  channels: 8
  features:
    - "8 independent audio channels"
    - "16-bit stereo audio output"
    - "ADPCM sample compression"
    - "Hardware echo/reverb effects"
    - "Pitch modulation"
    - "Noise generation"
  sample_playback: true
  synthesis_types: ["PCM", "ADPCM"]
storage:
  - "ROM cartridges with optional co-processors"
  - "Battery-backed SRAM for saves"
  - "Special chips (Super FX, DSP, SA-1, etc.)"
io_ports:
  - "2 × controller ports"
  - "Expansion port (bottom)"
  - "RF output"
  - "Composite video output"
  - "S-Video output (later models)"
  - "Multi-AV output"
price_at_launch:
  global: "$199.99 USD (1991)"
  countries:
    - country: "Japan"
      price: "25000"
      currency: "JPY"
    - country: "United States"
      price: "199.99"
      currency: "USD"
    - country: "United Kingdom"
      price: "149.99"
      currency: "GBP"
release_date:
  global: 1990-11-21
  countries:
    - country: "Japan"
      date: 1990-11-21
    - country: "United States"
      date: 1991-08-23
    - country: "United Kingdom"
      date: 1992-04-11
discontinued: 2003-09-25
units_sold: "49.1 million"
country_of_origin: "Japan"
operating_system: "None (direct hardware programming)"
emulated: true
emulators:
  - name: "Snes9x"
    platform: "Multi-platform"
    accuracy: "high"
  - name: "bsnes/higan"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "ZSNES"
    platform: "Multi-platform"
    accuracy: "good"
  - name: "RetroArch"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
variants:
  - name: "Super Famicom"
    release_date:
      global: 1990-11-21
    discontinued: 2003-09-25
    differences: "Original Japanese model with colorful design, different cartridge shape"
    model_number: "SHVC-001"
  - name: "Super Nintendo Entertainment System"
    release_date:
      global: 1991-08-23
    discontinued: 1999-01-01
    differences: "North American model with purple accent colors, lockout chip"
    model_number: "SNS-001"
  - name: "Super Famicom Jr."
    release_date:
      global: 1998-03-27
    discontinued: 2003-09-25
    differences: "Compact redesigned model, removed expansion port, S-Video output"
    model_number: "SHVC-101"
  - name: "New-Style Super NES"
    release_date:
      global: 1997-10-01
    discontinued: 1999-01-01
    differences: "Compact North American model matching Super Famicom Jr. design"
    model_number: "SNS-101"
notable_software:
  - name: "Super Mario World"
    type: "Platform Game"
    year: 1990
    developer: "Nintendo EAD"
    publisher: "Nintendo"
  - name: "The Legend of Zelda: A Link to the Past"
    type: "Action-Adventure"
    year: 1991
    developer: "Nintendo EAD"
    publisher: "Nintendo"
  - name: "Super Metroid"
    type: "Action-Adventure"
    year: 1994
    developer: "Nintendo R&D1"
    publisher: "Nintendo"
  - name: "Chrono Trigger"
    type: "RPG"
    year: 1995
    developer: "Square"
    publisher: "Square"
  - name: "Star Fox"
    type: "3D Shooter"
    year: 1993
    developer: "Nintendo EAD/Argonaut Software"
    publisher: "Nintendo"
historical_significance: "The SNES represented the peak of 2D gaming technology with Mode 7 graphics, superior audio, and groundbreaking games. It established many franchises that remain Nintendo's core properties today and demonstrated how technical excellence combined with exceptional software could maintain market leadership."
description: "Nintendo's 16-bit masterpiece featuring Mode 7 graphics and the 65C816 processor."
image: "/images/systems/super-nintendo.jpg"
order: 16
---

The **Super Nintendo Entertainment System (SNES)**, known as the Super Famicom in Japan, was Nintendo's answer to the growing competition in the 16-bit era. Released in 1990 in Japan and 1991 in North America, it featured advanced graphics capabilities, superior audio, and some of the greatest games ever created.

Built around the **Ricoh 5A22**, a customized version of the **WDC 65C816** processor (a 16-bit enhancement of the classic 6502), the SNES delivered computational power while maintaining familiar programming concepts for developers experienced with the NES.

## Key Features

- **65C816 Processor** - 16-bit enhancement of the 6502 with expanded addressing modes
- **Mode 7 Graphics** - Pseudo-3D rotating and scaling backgrounds
- **Advanced Sound System** - 8-channel PCM audio with hardware effects  
- **Multiple Background Layers** - Up to 4 simultaneous scrolling backgrounds
- **Enhanced Color Palette** - 32,768 colors with 256 displayable simultaneously
- **Cartridge Enhancement Chips** - Super FX, DSP chips, and other co-processors
- **Improved Controller** - Shoulder buttons and more face buttons for complex games

## Revolutionary Graphics Technology

The SNES introduced several graphical innovations that defined 16-bit gaming:

- **Mode 7 graphics** for rotating and scaling effects, creating pseudo-3D environments
- **Multiple background layers** with independent scrolling for rich parallax effects
- **Per-line scrolling** for advanced raster effects and pseudo-3D floors/ceilings
- **Large sprite support** with 128 sprites and sizes up to 64×64 pixels
- **Advanced palette effects** including color math and transparency
- **HDMA (Horizontal-blank DMA)** for mid-screen graphics changes

## Audio Excellence

The SNES featured the most advanced audio system of its generation:

- **Sony SPC700** sound processor with dedicated 64KB RAM
- **8 simultaneous channels** of high-quality PCM audio
- **Hardware effects** including echo, reverb, and pitch modulation
- **ADPCM compression** allowing longer samples in limited memory
- **Dynamic sample streaming** for CD-quality music

## Enhancement Chips

The SNES's greatest innovation was its support for enhancement chips in cartridges:

- **Super FX chip** - Real-time 3D polygon graphics (Star Fox, Yoshi's Island)
- **DSP chips** - Mathematical co-processors for advanced calculations
- **SA-1 chip** - Additional 65C816 processor for complex games
- **S-DD1 chip** - Real-time decompression for larger graphics sets

## Cultural Impact

The SNES established many of Nintendo's most important franchises and created some of gaming's greatest masterpieces. Games like Super Mario World, The Legend of Zelda: A Link to the Past, and Super Metroid defined what 16-bit gaming could achieve.

The system's technical capabilities enabled entirely new genres and gameplay mechanics, from the pseudo-3D racing of F-Zero to the atmospheric exploration of Super Metroid.

## Why Learn SNES Programming Today?

Programming the SNES teaches advanced retro development concepts:

- **65C816 Assembly** - Enhanced 6502 with 16-bit capabilities and advanced addressing modes
- **Advanced Graphics Programming** - Mode 7, HDMA, and multi-layer background management
- **Audio Programming** - PCM sample streaming and hardware effect utilization
- **Memory Management** - Bank switching, DMA operations, and efficient resource usage
- **Enhancement Chip Programming** - Interfacing with co-processors like Super FX
- **Performance Optimization** - Maximizing the complex PPU's capabilities

The SNES represents the absolute pinnacle of 2D gaming technology. Its sophisticated hardware architecture provides excellent preparation for understanding modern graphics programming concepts while working within the elegant constraints of 16-bit design.

Learning SNES development offers insights into how creative engineering solutions can push hardware beyond its apparent limitations, lessons that remain valuable in modern software development.