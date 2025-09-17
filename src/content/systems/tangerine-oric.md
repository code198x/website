---
name: "Oric Atmos"
full_name: "Oric Atmos"
manufacturer: "Tangerine/Oric"
model_number: "Atmos"
alternative_names: ["Oric-1", "Oric"]

# Hardware specifications
cpu: "6502A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "MOS 6502A"
  addressing_modes: ["Immediate", "Zero Page", "Absolute", "Indexed", "Indirect"]
  registers: "A, X, Y, S, P"

clock_speed: "1 MHz"
ram: "48KB"
ram_details:
  user_available: "37KB"
  video_ram: "Shared"
  expansion_options: ["Microdisc"]

rom: "16KB"
rom_contents: ["Oric Extended BASIC"]

# Graphics capabilities
video:
  processor: "ULA"
  resolution: "240×200"
  colors: "8 colors"
  display_modes: ["TEXT", "LORES", "HIRES"]
  sprites:
    count: 0
    size: "Software only"
    colors_per_sprite: 0
  hardware_scrolling: false
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "AY-3-8912"
  channels: 3
  features: ["Square waves", "Noise", "Envelope"]
  sample_playback: false
  synthesis_types: ["PSG"]

# Storage and I/O
storage: ["Cassette", "Microdisc"]
storage_details:
  built_in: ["Cassette"]
  expansion: ["Microdisc drive"]
  typical_capacity:
    floppy: "180KB"

io_ports: ["Expansion", "Printer", "Cassette"]
expansion_options: ["Microdisc", "Printer interface"]

# Commercial information
release_date:
  global: 1984-01-01T00:00:00Z

country_of_origin: "United Kingdom"
operating_system: "Oric DOS"
programming_languages: ["6502 Assembly", "Oric BASIC"]

# Target market and positioning
target_market: ["Home users", "Education", "France"]
market_positioning: "The French alternative"
competition: ["ZX Spectrum", "Commodore 64", "Amstrad CPC"]

# Educational relevance
learning_advantages: ["6502 programming", "AY sound chip", "Serial attributes"]
common_beginner_projects: ["HIRES graphics", "AY music", "Games"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "Oricutron"
    platform: "Windows, macOS, Linux"
    accuracy: "high"
  - name: "Euphoric"
    platform: "Windows"
    accuracy: "good"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "The British computer that conquered France with colorful graphics and distinctive serial attributes system."

# Platform Classification
medal_tier: "bronze"
total_lessons: 0
total_games: 1
estimated_duration: "2-3 months"
cpu_architecture: "6502"
difficulty_level: "intermediate"
status: "vault"
order: 24
---

# Oric Atmos

_Coming Soon_

The Oric Atmos was the refined version of the Oric-1, fixing its predecessor's keyboard issues and adding a better BASIC. While it struggled in the UK against the Spectrum, it found massive success in France, where it became a cultural phenomenon.

## Why Learn Oric Programming?

The Oric's unique serial attributes system for color graphics and its AY sound chip offer a different approach to 6502 programming. Its strong French demoscene produced impressive technical achievements.

## What Makes the Oric Special

- **Serial Attributes**: Unique color system via control codes
- **French Connection**: Huge success in France
- **AY-3-8912**: Same sound chip as Spectrum/CPC
- **HIRES Mode**: Impressive 240×200 graphics

## Curriculum Highlights

_Currently in development_

When launched, the introductory Oric curriculum will include:

- 6502 assembly basics
- Serial attributes and HIRES graphics
- AY-3-8912 sound programming
- Complete game project

## The Oric Legacy

The Oric proved that regional preferences matter in computing. Its success in France, where it outsold the Spectrum, showed that local marketing and support could overcome technical limitations. The French Oric scene remains vibrant today.

Check back soon for the complete Oric curriculum!
