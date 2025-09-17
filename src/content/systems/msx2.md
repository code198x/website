---
name: "MSX2"
full_name: "MSX2 Home Computer Standard"
manufacturer: "Various (Microsoft/ASCII standard)"
model_number: "MSX2"
alternative_names: ["MSX-2"]

# Hardware specifications
cpu: "Z80A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Zilog Z80A"
  addressing_modes: ["Immediate", "Register", "Indexed", "Indirect", "Relative"]
  registers: "A, B, C, D, E, H, L, IX, IY, SP, PC"

clock_speed: "3.58 MHz"
ram: "64KB-512KB"
ram_details:
  user_available: "64KB base"
  video_ram: "128KB dedicated VRAM"
  expansion_options: ["Memory mappers up to 512KB"]

rom: "32KB"
rom_contents: ["MSX2 BASIC", "MSX-DOS", "System BIOS"]

# Graphics capabilities
video:
  processor: "Yamaha V9938 VDP"
  resolution: "512×212"
  colors: "512 colors"
  display_modes:
    ["Screen 5: 256×212×16", "Screen 6: 512×212×4", "Screen 7: 512×212×16", "Screen 8: 256×212×256"]
  sprites:
    count: 32
    size: "8×8 to 16×16 pixels"
    colors_per_sprite: 16
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "AY-3-8910 + YM2413 OPLL"
  channels: 12
  features:
    [
      "3-channel PSG",
      "9-channel FM synthesis",
      "15 preset instruments",
      "Custom instruments",
      "Rhythm section",
    ]
  sample_playback: false
  synthesis_types: ["PSG", "FM synthesis"]

# Storage and I/O
storage: ['3.5" floppy disk', "Cartridge", "Cassette tape"]
storage_details:
  built_in: ["Cartridge slots", "Cassette interface"]
  expansion: ["Floppy disk drives"]
  typical_capacity:
    floppy: "720KB"
    cartridge: "32KB-1MB"

io_ports:
  ["Joystick ports", "Cartridge slots", "Printer port", "Cassette interface", "Expansion slots"]
expansion_options: ["Memory mappers", "Disk interfaces", "Sound cards", "Network interfaces"]

# Commercial information
release_date:
  global: 1985-10-01T00:00:00Z

country_of_origin: "Japan"
operating_system: "MSX-BASIC 2.0 + MSX-DOS"
programming_languages: ["Z80 Assembly", "MSX-BASIC", "C", "Pascal"]

# Target market and positioning
target_market: ["International home computing", "Gaming", "Professional applications", "Education"]
market_positioning: "International standard home computer with advanced capabilities"
competition: ["Commodore Amiga", "Atari ST", "Apple IIgs"]

# Educational relevance
learning_advantages:
  [
    "International hardware standard",
    "Advanced sprite programming",
    "FM synthesis audio",
    "Professional graphics capabilities",
  ]
common_beginner_projects:
  [
    "Sprite-based games",
    "Hardware scrolling demos",
    "FM music composition",
    "Cross-manufacturer software",
  ]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "openMSX"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "blueMSX"
    platform: "Windows"
    accuracy: "high"
  - name: "fMSX"
    platform: "Multi-platform"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The enhanced MSX standard that brought professional graphics and sound to home computing while maintaining international compatibility."

# Platform Classification
medal_tier: "gold"
total_lessons: 2048
total_games: 25
estimated_duration: "3-6 months"
cpu_architecture: "Z80"
difficulty_level: "advanced"
status: "vault"
order: 25
---

# MSX2

_Coming Soon_

The MSX2 represented the evolution of Microsoft's MSX standard into a truly professional home computer platform. Built around the powerful Yamaha V9938 video display processor and enhanced with FM synthesis sound, it delivered advanced graphics and audio capabilities while maintaining cross-manufacturer compatibility.

## Why Learn MSX2 Programming?

MSX2 programming combines Z80A mastery with advanced hardware capabilities in an international standard environment. The V9938 VDP's 32 sprites, hardware scrolling, and YM2413 FM synthesis provide professional-level programming challenges while teaching standardized development principles.

## What Makes MSX2 Special

- **International Standard**: Compatible hardware across dozens of manufacturers worldwide
- **Yamaha V9938 VDP**: Professional-quality sprites, scrolling, and graphics modes
- **FM Synthesis Audio**: YM2413 OPLL with 9 channels and preset instruments
- **Advanced Memory System**: Enhanced memory mapping and expansion capabilities
- **Global Software Market**: Universal cartridges working across all manufacturers

## Curriculum Highlights

_Currently in development_

When launched, the MSX2 curriculum will include:

- Advanced Z80A assembly with V9938 VDP programming
- Professional sprite animation and hardware scrolling techniques
- YM2413 FM synthesis programming and music composition
- Cross-manufacturer software development principles
- Complete international-standard applications showcasing all capabilities

## International Standard Legacy

The MSX2 proved that hardware standardization could drive innovation rather than limit it, creating compatible systems across multiple manufacturers while enabling advanced graphics, sound, and software development that reached global markets.

Check back soon for the complete MSX2 curriculum!
