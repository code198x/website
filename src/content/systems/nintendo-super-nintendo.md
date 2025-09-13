---
name: "Nintendo SNES"
full_name: "Super Nintendo Entertainment System"
manufacturer: "Nintendo"
model_number: "SNS-001"
alternative_names: ["Super Famicom", "SFC"]

# Hardware specifications
cpu: "65C816"
cpu_details:
  architecture: "8/16-bit"
  instruction_set: "WDC 65C816"
  addressing_modes: ["6502 modes plus 16-bit extensions"]
  registers: "16-bit accumulator, 16-bit index registers"

clock_speed: "3.58 MHz"
ram: "128KB"
ram_details:
  user_available: "128KB main RAM"
  video_ram: "64KB VRAM"
  expansion_options: ["Cartridge RAM/chips"]

rom: "Game cartridge"
rom_contents: ["Game code and data"]

# Graphics capabilities
video:
  processor: "PPU (dual chips)"
  resolution: "256×224"
  colors: "32,768 colors"
  display_modes: ["Mode 7 rotation/scaling", "Multiple background layers"]
  sprites:
    count: 128
    size: "8×8 to 64×64"
    colors_per_sprite: 15
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "S-SMP/S-DSP"
  channels: 8
  features: ["16-bit samples", "Echo", "Filters"]
  sample_playback: true
  synthesis_types: ["Sample-based"]

# Storage and I/O
storage: ["ROM cartridge"]
storage_details:
  built_in: ["None"]
  expansion: ["Cartridge slot"]
  typical_capacity:
    cartridge: "256KB-6MB"

io_ports: ["Controller ports", "Expansion port"]
expansion_options: ["Super FX chip", "SA-1 chip", "Various enhancement chips"]

# Commercial information
release_date:
  global: 1990-11-21T00:00:00Z

country_of_origin: "Japan"
operating_system: "None"
programming_languages: ["65816 Assembly"]

# Target market and positioning
target_market: ["Gaming"]
market_positioning: "16-bit gaming evolution"
competition: ["Sega Genesis", "TurboGrafx-16"]

# Educational relevance
learning_advantages: ["65816 programming", "Mode 7 effects", "Enhancement chips"]
common_beginner_projects: ["Mode 7 demos", "Sprite effects", "Sample playback"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "bsnes/higan"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"
  - name: "Snes9x"
    platform: "Multi-platform"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "common"

# Media
description: "Nintendo's 16-bit masterpiece that defined a generation with Mode 7 graphics and CD-quality sound."

# Platform Classification
medal_tier: "gold"
total_lessons: 512
total_games: 4
estimated_duration: "6-9 months"
cpu_architecture: "65816"
difficulty_level: "advanced"
status: "planned"
order: 21
---

# Super Nintendo

_Coming Soon_

The Super Nintendo brought Nintendo into the 16-bit era with stunning graphics, incredible sound, and a library of games that many consider the best ever assembled. Its Mode 7 graphics and enhancement chips pushed 2D gaming to its limits.

## Why Learn SNES Programming?

The SNES's 65816 processor extends the 6502 with 16-bit operations, making it a natural progression from NES or C64. Its sophisticated PPU and sound system teach advanced console development techniques.

## What Makes the SNES Special

- **Mode 7**: Revolutionary rotation and scaling effects
- **Enhancement Chips**: Super FX, SA-1, and more
- **Sound Excellence**: Sample-based audio with effects
- **The Library**: Home to many greatest games ever made

## Curriculum Highlights

_Currently in development_

When launched, the SNES curriculum will include:

- 65816 assembly programming
- PPU programming and Mode 7
- S-SMP/S-DSP audio system
- Enhancement chip utilization
- 4 complete projects

## The SNES Legacy

The SNES represented the pinnacle of 2D gaming. Its technical capabilities and legendary game library set standards that still influence game design today. Many consider it the greatest game console ever created.

Check back soon for the complete SNES curriculum!
