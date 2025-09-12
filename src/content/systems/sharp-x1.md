---
name: "X1"
full_name: "Sharp X1"
manufacturer: "Sharp Corporation"
model_number: "CZ-800C"
alternative_names: ["X1 series"]

# Hardware specifications
cpu: "Z80A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Zilog Z80A"
  addressing_modes: ["Immediate", "Register", "Indexed", "Indirect", "Relative"]
  registers: "A, B, C, D, E, H, L, IX, IY, SP, PC"

clock_speed: "4 MHz"
ram: "64KB"
ram_details:
  user_available: "48KB"
  video_ram: "48KB VRAM"
  expansion_options: ["Memory expansion cards"]

rom: "8KB + cartridge"
rom_contents: ["IPL ROM", "Character generator"]

# Graphics capabilities
video:
  processor: "Custom graphics system"
  resolution: "640×200"
  colors: "8 colors"
  display_modes: ["Text", "Graphics", "Mixed modes"]
  sprites:
    count: 0
    size: "Software sprites"
    colors_per_sprite: 0
  hardware_scrolling: true
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "AY-3-8910"
  channels: 3
  features: ["Square waves", "Noise", "Envelope control"]
  sample_playback: false
  synthesis_types: ["PSG"]

# Storage and I/O
storage: ["Cassette", "Floppy disk", "Cartridge"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["5.25\" floppy drive"]
  typical_capacity:
    cassette: "Variable"
    cartridge: "Up to 64KB"

io_ports: ["Cassette", "Parallel", "Serial", "Expansion"]
expansion_options: ["Z80 card", "Memory cards", "Disk interface"]

# Commercial information
release_date:
  global: 1982-10-01T00:00:00Z

country_of_origin: "Japan"
operating_system: "Sharp BASIC / CP/M"
programming_languages: ["Z80 Assembly", "Sharp BASIC", "C"]

# Target market and positioning
target_market: ["Home users", "Hobbyists", "Small business"]
market_positioning: "High-resolution home computer"
competition: ["PC-8801", "FM-7", "MSX"]

# Educational relevance
learning_advantages: ["Z80 programming", "High-res graphics", "Expansion system"]
common_beginner_projects: ["Graphics demos", "Games", "Utilities"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "XM7"
    platform: "Windows"
    accuracy: "high"
  - name: "X1EMU"
    platform: "Windows"
    accuracy: "good"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "Sharp's high-resolution Japanese home computer with an innovative expansion system."
image: "/images/systems/sharp-x1.jpg"

# Platform Classification
medal_tier: "bronze"
total_lessons: 0
total_games: 1
estimated_duration: "2-3 months"
cpu_architecture: "Z80"
difficulty_level: "intermediate"
status: "planned"
order: 55
---

# Sharp X1

*Coming Soon*

The Sharp X1 was one of Japan's most successful home computers, known for its high-resolution graphics and innovative expansion system. Popular with hobbyists and small businesses, it carved out a significant niche in the Japanese market.

## Why Learn X1 Programming?

The X1's clean Z80 architecture and high-resolution graphics make it excellent for learning structured programming. Its expansion system and software library showcase Japanese computing culture of the 1980s.

## What Makes the X1 Special

- **640×200 Resolution**: High resolution for its time
- **Expansion System**: Modular cards for different functions
- **Japanese Software**: Large library of uniquely Japanese games
- **Long Lifespan**: Popular from 1982 to the early 1990s

## Curriculum Highlights

*Currently in development*

When launched, the X1 curriculum will include:
- Z80 assembly programming
- High-resolution graphics programming
- AY sound chip programming
- Japanese text handling
- Complete retro game project

## The X1 Legacy

The X1 proved that regional computers could succeed with the right features. Its high-resolution display and expansion system influenced later Japanese computers, and its software library showcased the creativity of Japanese developers.

Check back soon for the complete X1 curriculum!