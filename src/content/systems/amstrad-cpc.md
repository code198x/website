---
name: "CPC"
full_name: "Amstrad CPC"
manufacturer: "Amstrad"
model_number: "CPC464/6128"
alternative_names: ["Colour Personal Computer", "Schneider CPC"]

# Hardware specifications
cpu: "Z80A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Zilog Z80"
  addressing_modes: ["Immediate", "Register", "Indexed", "Indirect", "Relative"]
  registers: "A, B, C, D, E, H, L, IX, IY, SP, PC"

clock_speed: "4 MHz"
ram: "64KB-128KB"
ram_details:
  user_available: "42KB (464) or 61KB (6128)"
  video_ram: "16KB"
  expansion_options: ["RAM expansion to 512KB"]

rom: "32KB"
rom_contents: ["Locomotive BASIC", "Firmware"]

# Graphics capabilities
video:
  processor: "6845 CRTC + Gate Array"
  resolution: "640×200"
  colors: "27 colors"
  display_modes:
    ["Mode 0: 160×200 16 colors", "Mode 1: 320×200 4 colors", "Mode 2: 640×200 2 colors"]
  sprites:
    count: 0
    size: "Software sprites only"
    colors_per_sprite: 0
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "AY-3-8912"
  channels: 3
  features: ["Square waves", "Noise", "Envelope control"]
  sample_playback: false
  synthesis_types: ["PSG"]

# Storage and I/O
storage: ["Cassette", '3" floppy disk']
storage_details:
  built_in: ["Cassette (464)", '3" floppy (6128)']
  expansion: ["External disk drive"]
  typical_capacity:
    cassette: "Variable"
    floppy: "180KB"

io_ports: ["Expansion", "Printer", "Joystick", "Stereo sound"]
expansion_options: ["Disk drive", "RAM expansion", "ROM box"]

# Commercial information
release_date:
  global: 1984-04-01T00:00:00Z

country_of_origin: "United Kingdom"
operating_system: "AMSDOS"
programming_languages: ["Z80 Assembly", "Locomotive BASIC"]

# Target market and positioning
target_market: ["Home users", "Gaming", "Education"]
market_positioning: "Complete computer with monitor"
competition: ["ZX Spectrum", "Commodore 64", "BBC Micro"]

# Educational relevance
learning_advantages: ["Z80 programming", "Gate Array tricks", "Hardware scrolling"]
common_beginner_projects: ["Mode mixing", "Raster effects", "Overscan"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "WinAPE"
    platform: "Windows"
    accuracy: "cycle_accurate"
  - name: "RetroVirtualMachine"
    platform: "Windows, macOS, Linux"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The all-in-one computer that brought affordable color computing to Europe with a built-in monitor."

# Platform Classification
medal_tier: "silver"
total_lessons: 256
total_games: 2
estimated_duration: "4-6 months"
cpu_architecture: "Z80"
difficulty_level: "intermediate"
status: "planned"
order: 20
---

# Amstrad CPC

_Coming Soon_

The Amstrad CPC brought affordable computing to Europe with an all-in-one design that included a built-in monitor. Popular in the UK, France, and Spain, it competed directly with the Spectrum and C64 with colorful graphics and impressive sound.

## Why Learn CPC Programming?

The CPC's Gate Array and CRTC combination offers unique opportunities for visual effects. Its clean Z80 implementation and powerful BASIC make it an excellent platform for learning both high and low-level programming.

## What Makes the CPC Special

- **All-in-One**: Computer and monitor in one package
- **Gate Array**: Unique approach to graphics
- **27 Colors**: More than Spectrum or C64
- **European Heritage**: Huge demoscene following

## Curriculum Highlights

_Currently in development_

When launched, the CPC curriculum will include:

- Z80 assembly programming
- Gate Array and CRTC tricks
- Hardware scrolling and overscan
- AY chip music programming
- 2 complete projects

## The CPC Legacy

The CPC proved that late entrants could succeed with the right approach. Its all-in-one design and reasonable price made it popular in European homes and schools. The French demoscene particularly embraced it, creating stunning visual effects.

Check back soon for the complete Amstrad CPC curriculum!
