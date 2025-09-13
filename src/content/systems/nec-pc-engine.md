---
name: "NEC PC Engine"
full_name: "NEC PC Engine / TurboGrafx-16"
manufacturer: "NEC / Hudson Soft"
model_number: "PC-KD"
alternative_names: ["TurboGrafx-16", "CoreGrafx", "Turbo Duo"]

# Hardware specifications
cpu: "65C02"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Hudson HuC6280 (65C02 variant)"
  addressing_modes: ["6502 modes plus extensions"]
  registers: "A, X, Y, S, P, plus memory mapper"

clock_speed: "7.16 MHz"
ram: "8KB + 64KB"
ram_details:
  user_available: "8KB main"
  video_ram: "64KB"
  expansion_options: ["System Card RAM", "Arcade Card"]

rom: "HuCard ROM"
rom_contents: ["Game ROM up to 20Mbit"]

# Graphics capabilities
video:
  processor: "HuC6270 VDC"
  resolution: "256×224 to 512×224"
  colors: "512 colors"
  display_modes: ["Multiple resolutions", "Hardware sprites", "Background layers"]
  sprites:
    count: 64
    size: "16×16 to 32×32"
    colors_per_sprite: 15
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "HuC6280"
  channels: 6
  features: ["6 PSG channels", "Sample playback", "Stereo output"]
  sample_playback: true
  synthesis_types: ["PSG", "Sample-based"]

# Storage and I/O
storage: ["HuCard", "CD-ROM²"]
storage_details:
  built_in: ["HuCard slot"]
  expansion: ["CD-ROM² drive", "Super System Card"]
  typical_capacity:
    hucard: "Up to 20Mbit"
    cdrom: "650MB"

io_ports: ["Controller port", "Expansion port", "A/V output"]
expansion_options: ["CD-ROM² system", "Arcade Card", "6-button pad"]

# Commercial information
release_date:
  global: 1987-10-30T00:00:00Z

country_of_origin: "Japan"
operating_system: "None / System Card"
programming_languages: ["HuC6280 Assembly", "HuC"]

# Target market and positioning
target_market: ["Gaming", "CD-ROM multimedia"]
market_positioning: "16-bit performance with 8-bit price"
competition: ["Famicom", "Mega Drive", "Super Famicom"]

# Educational relevance
learning_advantages: ["Enhanced 6502", "Sprite programming", "CD-ROM integration"]
common_beginner_projects: ["Sprite shooters", "CD audio games", "HuCard homebrew"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "Mednafen"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"
  - name: "Magic Engine"
    platform: "Windows, macOS"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The console that pioneered affordable CD-ROM gaming and brought arcade-perfect shooters home."

# Platform Classification
medal_tier: "silver"
total_lessons: 128
total_games: 1
estimated_duration: "3-4 months"
cpu_architecture: "65C02"
difficulty_level: "intermediate"
status: "planned"
order: 51
---

# PC Engine / TurboGrafx-16

_Coming Soon_

The PC Engine was NEC and Hudson's innovative approach to console gaming - an 8-bit processor with 16-bit graphics performance, pioneering CD-ROM gaming, and home to some of the best shoot-em-ups ever created.

## Why Learn PC Engine Programming?

The PC Engine's HuC6280 processor extends the familiar 6502 with memory mapping and built-in sound, while its advanced VDC offers sophisticated sprite and tile capabilities. It's perfect for learning enhanced 6502 programming.

## What Makes the PC Engine Special

- **Tiny but Mighty**: Smallest console of its generation
- **CD-ROM Pioneer**: First affordable CD gaming system
- **Shooter Paradise**: Home to legendary shmups
- **Color Advantage**: 512 colors vs competitors' 64

## Curriculum Highlights

_Currently in development_

When launched, the PC Engine curriculum will include:

- HuC6280 assembly (enhanced 6502)
- VDC graphics and sprite programming
- CD-ROM system programming
- Audio synthesis and CD-DA
- Complete shoot-em-up project

## The PC Engine Legacy

The PC Engine proved that innovation could compete with raw power. Its CD-ROM system influenced all future consoles, and its incredible shooter library remains unmatched. In Japan, it outsold the Mega Drive and nearly matched the Famicom.

Check back soon for the complete PC Engine curriculum!
