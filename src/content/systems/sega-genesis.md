---
name: "Sega Genesis / Mega Drive"
full_name: "Sega Genesis / Mega Drive"
manufacturer: "Sega"
model_number: "MK-1601"
alternative_names: ["Mega Drive", "Genesis"]

# Hardware specifications
cpu: "68000"
cpu_details:
  architecture: "16/32-bit"
  instruction_set: "Motorola 68000"
  addressing_modes:
    ["Register Direct", "Address Register Indirect", "Immediate", "Absolute", "PC Relative"]
  registers: "8 data registers (D0-D7), 8 address registers (A0-A7)"

clock_speed: "7.6 MHz"
ram: "64KB"
ram_details:
  user_available: "64KB main RAM"
  video_ram: "64KB VRAM"
  expansion_options: ["Sega CD RAM expansion"]

rom: "Game cartridge"
rom_contents: ["Game code and data"]

# Graphics capabilities
video:
  processor: "VDP (Video Display Processor)"
  resolution: "320×224"
  colors: "512 color palette, 61 on-screen"
  display_modes: ["2 scrolling planes", "Window plane", "80 sprites"]
  sprites:
    count: 80
    size: "8×8 to 32×32"
    colors_per_sprite: 15
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "YM2612 + SN76489"
  channels: 10
  features: ["6 FM channels", "4 PSG channels", "PCM sample playback"]
  sample_playback: true
  synthesis_types: ["FM synthesis", "PSG", "PCM"]

# Storage and I/O
storage: ["ROM cartridge"]
storage_details:
  built_in: ["None"]
  expansion: ["Cartridge slot", "Expansion port"]
  typical_capacity:
    cartridge: "512KB-4MB"

io_ports: ["Controller ports", "Expansion port", "Headphone jack"]
expansion_options: ["Sega CD", "32X", "Power Base Converter"]

# Commercial information
release_date:
  global: 1988-10-29T00:00:00Z

country_of_origin: "Japan"
operating_system: "None"
programming_languages: ["68000 Assembly"]

# Target market and positioning
target_market: ["Gaming", "Arcade ports"]
market_positioning: "16-bit arcade power at home"
competition: ["Super Nintendo", "TurboGrafx-16"]

# Educational relevance
learning_advantages: ["68000 programming", "VDP techniques", "FM synthesis"]
common_beginner_projects: ["Sprite demos", "FM music", "Scrolling games"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "BlastEm"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"
  - name: "Kega Fusion"
    platform: "Windows, macOS, Linux"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "common"

# Media
description: "Sega's 16-bit powerhouse that brought arcade-quality gaming home with blast processing."

# Platform Classification
medal_tier: "gold"
total_lessons: 512
total_games: 4
estimated_duration: "6-9 months"
cpu_architecture: "68000"
difficulty_level: "intermediate"
status: "planned"
order: 14
---

# Sega Genesis / Mega Drive

_Coming Soon_

The Genesis brought "blast processing" and arcade-perfect ports to the 16-bit console wars. With its 68000 processor and Yamaha FM synthesis chip, it delivered experiences that defined a generation of gaming.

## Why Learn Genesis Programming?

The Genesis offers a perfect introduction to 68000 assembly and professional game console development. Its VDP and sound architecture teach concepts still relevant in modern game development.

## What Makes the Genesis Special

- **68000 Power**: Same CPU family as Amiga and early Macs
- **FM Synthesis**: Yamaha YM2612 created that distinctive sound
- **Arcade Heritage**: Sega's arcade expertise in a home console
- **Blast Processing**: Marketing term, but genuinely fast

## Curriculum Highlights

_Currently in development_

When launched, the Genesis curriculum will include:

- 68000 assembly programming
- VDP graphics and sprite management
- YM2612 FM synthesis programming
- DMA and advanced techniques
- 4 complete projects showcasing Genesis capabilities

## The Genesis Legacy

The Genesis proved that aggressive marketing and technical excellence could challenge Nintendo's dominance. Its influence extends from Sonic's speed to the distinctive sound of 90s gaming.

Check back soon for the complete Genesis curriculum!
