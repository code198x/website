---
name: "Bandai WonderSwan"
full_name: "Bandai WonderSwan"
manufacturer: "Bandai"
model_number: "WSC-001"
alternative_names: ["WonderSwan Color", "SwanCrystal"]

# Hardware specifications
cpu: "V30MZ"
cpu_details:
  architecture: "16-bit"
  instruction_set: "NEC V30MZ (x86 compatible)"
  addressing_modes: ["Register", "Immediate", "Memory", "Indexed"]
  registers: "AX, BX, CX, DX, SI, DI, BP, SP, CS, DS, ES, SS"

clock_speed: "3.072 MHz"
ram: "16KB-64KB"
ram_details:
  user_available: "16KB internal"
  video_ram: "Shared with system RAM"
  expansion_options: ["Cartridge RAM"]

rom: "Boot ROM"
rom_contents: ["System ROM", "BIOS functions"]

# Graphics capabilities
video:
  processor: "Custom LCD controller"
  resolution: "224×144"
  colors: "4 shades / 241 colors"
  display_modes:
    ["224×144 main display", "Tile-based 40×28", "Hardware sprites", "Dual background layers"]
  sprites:
    count: 128
    size: "8×8 to 64×64 pixels"
    colors_per_sprite: 16
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "Custom sound unit"
  channels: 4
  features:
    ["Wave sample playback", "Noise generation", "Stereo output", "Volume control", "Pan control"]
  sample_playback: true
  synthesis_types: ["Wave samples", "Noise"]

# Storage and I/O
storage: ["ROM cartridge", "Cartridge RAM", "EEPROM"]
storage_details:
  built_in: ["Cartridge slot"]
  expansion: ["Save data backup"]
  typical_capacity:
    cartridge: "512KB-16MB"

io_ports: ["8-way D-pad", "4 action buttons", "Start button", "Sound button", "External connector"]
expansion_options: ["Communication cable", "External devices"]

# Commercial information
release_date:
  global: 1999-03-04T00:00:00Z

country_of_origin: "Japan"
operating_system: "None (direct hardware programming)"
programming_languages: ["x86 Assembly", "C (with development kit)"]

# Target market and positioning
target_market: ["Handheld gaming", "Portable entertainment", "Japanese market"]
market_positioning: "Nintendo Game Boy alternative with superior battery life"
competition: ["Game Boy Color", "Neo Geo Pocket", "Atari Lynx"]

# Educational relevance
learning_advantages:
  [
    "x86 handheld programming",
    "Dual-orientation design",
    "Power-efficient coding",
    "Unique hardware features",
  ]
common_beginner_projects:
  ["Orientation-aware games", "Battery-efficient apps", "Sprite animations", "Audio programming"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "Mednafen"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "OpenEmu"
    platform: "macOS"
    accuracy: "high"
  - name: "BizHawk"
    platform: "Windows"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "Gunpei Yokoi's final handheld masterpiece with innovative vertical/horizontal play modes and x86 architecture."

# Platform Classification
medal_tier: "bronze"
total_lessons: 512
total_games: 8
estimated_duration: "2-4 weeks"
cpu_architecture: "x86"
difficulty_level: "intermediate"
status: "planned"
order: 64
---

# Bandai WonderSwan

_Coming Soon_

The Bandai WonderSwan represents Gunpei Yokoi's final handheld design, featuring innovative dual-orientation gameplay, remarkable battery life, and the unique combination of x86 architecture in a portable gaming system. Despite modest specifications, it achieved technical excellence through brilliant engineering.

## Why Learn WonderSwan Programming?

The WonderSwan's unique features offer programming challenges found nowhere else: x86 assembly on battery-powered hardware, dual-orientation interface design, and optimization for 40+ hour battery life. It demonstrates how innovative design can overcome hardware limitations.

## What Makes the WonderSwan Special

- **Dual Orientation**: Vertical and horizontal play modes with automatic screen rotation
- **x86 Architecture**: PC-compatible instruction set in handheld format
- **Exceptional Battery Life**: 40+ hours on single AA battery (monochrome version)
- **Flexible Controls**: Button layout optimized for both orientations
- **Gunpei Yokoi Design**: Final creation from Game Boy's legendary designer

## Curriculum Highlights

_Currently in development_

When launched, the WonderSwan curriculum will include:

- x86 assembly programming on constrained hardware
- Dual-orientation interface and game design
- Power-efficient programming techniques for maximum battery life
- Advanced sprite animation and graphics optimization
- Complete dual-mode game showcasing orientation flexibility

## Gunpei Yokoi's Legacy

The WonderSwan embodied Yokoi's "lateral thinking with withered technology" philosophy, using mature x86 architecture innovatively to create a handheld that competed effectively with more powerful systems through superior design and incredible battery efficiency.

Check back soon for the complete WonderSwan curriculum!
