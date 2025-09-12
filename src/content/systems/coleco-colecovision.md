---
name: "ColecoVision"
full_name: "Coleco ColecoVision"
manufacturer: "Coleco Industries"
model_number: "2405"
alternative_names: ["Coleco Vision"]

# Hardware specifications
cpu: "Z80A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Zilog Z80A"
  addressing_modes: ["Immediate", "Register", "Indexed", "Indirect", "Relative"]
  registers: "A, B, C, D, E, H, L, IX, IY, SP, PC"

clock_speed: "3.58 MHz"
ram: "1KB"
ram_details:
  user_available: "1KB"
  video_ram: "16KB"
  expansion_options: ["Expansion Module"]

rom: "8KB BIOS"
rom_contents: ["BIOS", "OS7 operating system"]

# Graphics capabilities
video:
  processor: "TMS9918A"
  resolution: "256×192"
  colors: "16 colors"
  display_modes: ["Graphics I", "Graphics II", "Multicolor", "Text"]
  sprites:
    count: 32
    size: "8×8 or 16×16"
    colors_per_sprite: 1
  hardware_scrolling: false
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "SN76489A"
  channels: 4
  features: ["3 square waves", "1 noise", "Volume control"]
  sample_playback: false
  synthesis_types: ["Square wave", "Noise"]

# Storage and I/O
storage: ["ROM cartridge"]
storage_details:
  built_in: ["None"]
  expansion: ["Cartridge slot", "Expansion port"]
  typical_capacity:
    cartridge: "8KB-32KB"

io_ports: ["Controller ports", "Expansion port", "Cartridge slot"]
expansion_options: ["Atari 2600 adapter", "Steering wheel", "Roller controller"]

# Commercial information
release_date:
  global: 1982-08-01T00:00:00Z

country_of_origin: "United States"
operating_system: "OS7"
programming_languages: ["Z80 Assembly"]

# Target market and positioning
target_market: ["Home gaming", "Arcade enthusiasts"]
market_positioning: "Arcade-quality gaming at home"
competition: ["Atari 2600", "Atari 5200", "Intellivision"]

# Educational relevance
learning_advantages: ["Z80 programming", "TMS9918A graphics", "Arcade conversions"]
common_beginner_projects: ["Sprite demos", "Arcade clones", "Sound effects"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "CoolCV"
    platform: "Windows, macOS, Linux"
    accuracy: "high"
  - name: "BlueMSX"
    platform: "Windows"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The console that delivered true arcade experiences at home, with near-perfect ports of Donkey Kong and Zaxxon."
image: "/images/systems/colecovision.jpg"

# Platform Classification
medal_tier: "silver"
total_lessons: 0
total_games: 1
estimated_duration: "2-3 months"
cpu_architecture: "Z80"
difficulty_level: "intermediate"
status: "planned"
order: 17
---

# ColecoVision

*Coming Soon*

The ColecoVision delivered on a simple promise: arcade games at home that actually looked like arcade games. With its Z80 processor and TMS9918A graphics chip, it brought Donkey Kong, Zaxxon, and other arcade hits home with stunning accuracy.

## Why Learn ColecoVision Programming?

The ColecoVision's combination of Z80 processor and TMS9918A graphics chip (same as MSX and TI-99/4A) makes it perfect for learning arcade-style game development with professional hardware.

## What Makes the ColecoVision Special

- **Arcade Quality**: Near-perfect arcade ports in 1982
- **Donkey Kong Pack-In**: Nintendo's killer app on Coleco hardware
- **Professional Hardware**: Same chips as business computers
- **Expansion Module**: Played Atari 2600 games too

## Curriculum Highlights

*Currently in development*

When launched, the focused ColecoVision curriculum will include:
- Z80 assembly for gaming
- TMS9918A sprite and tile graphics
- SN76489A sound programming
- Arcade game techniques
- Complete arcade-style game project

## The ColecoVision Legacy

The ColecoVision proved that consumers would pay more for quality. Its success showed that arcade-perfect ports mattered more than large game libraries. The Adam computer expansion nearly killed Coleco, but the ColecoVision's gaming legacy endures.

Check back soon for the complete ColecoVision curriculum!