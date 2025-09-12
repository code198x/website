---
name: "MSX"
full_name: "MSX Standard"
manufacturer: "ASCII/Microsoft"
model_number: "Various"
alternative_names: ["MSX1", "MSX Standard"]

# Hardware specifications
cpu: "Z80A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Zilog Z80"
  addressing_modes: ["Immediate", "Register", "Indexed", "Indirect", "Relative"]
  registers: "A, B, C, D, E, H, L, IX, IY, SP, PC"

clock_speed: "3.58 MHz"
ram: "32KB-64KB"
ram_details:
  user_available: "32KB typical"
  video_ram: "16KB"
  expansion_options: ["Memory mapper", "Up to 512KB"]

rom: "32KB BIOS"
rom_contents: ["MSX BASIC", "BIOS routines"]

# Graphics capabilities
video:
  processor: "TMS9918"
  resolution: "256×192"
  colors: "16 colors"
  display_modes: ["Text", "Graphics I", "Graphics II", "Multicolor"]
  sprites:
    count: 32
    size: "8×8 or 16×16"
    colors_per_sprite: 1
  hardware_scrolling: false
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "AY-3-8910 PSG"
  channels: 3
  features: ["Square waves", "Noise", "Envelope control"]
  sample_playback: false
  synthesis_types: ["PSG synthesis"]

# Storage and I/O
storage: ["Cassette tape", "Cartridge", "Floppy disk"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Disk drive", "Cartridge slot"]
  typical_capacity:
    cassette: "Variable"
    cartridge: "8KB-512KB"
    floppy: "360KB-720KB"

io_ports: ["Cartridge slots", "Joystick ports", "Cassette", "Printer"]
expansion_options: ["Disk interface", "RS-232", "MIDI"]

# Commercial information
release_date:
  global: 1983-06-27T00:00:00Z

country_of_origin: "Japan"
operating_system: "MSX-DOS"
programming_languages: ["Z80 Assembly", "MSX BASIC"]

# Target market and positioning
target_market: ["Home computing", "Gaming", "Education"]
market_positioning: "Universal home computer standard"
competition: ["Commodore 64", "ZX Spectrum", "NEC PC-8801"]

# Educational relevance
learning_advantages: ["Standard architecture", "Japanese gaming roots", "Z80 programming"]
common_beginner_projects: ["Sprite demos", "PSG music", "Simple games"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "openMSX"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"
  - name: "BlueMSX"
    platform: "Windows"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The Japanese standard that united manufacturers and launched legendary game franchises like Metal Gear and Bomberman."
image: "/images/systems/msx.jpg"

# Platform Classification
medal_tier: "silver"
total_lessons: 512
total_games: 4
estimated_duration: "6-9 months"
cpu_architecture: "Z80"
difficulty_level: "intermediate"
status: "planned"
order: 12
---

# MSX

*Coming Soon*

The MSX wasn't just a computer - it was a vision of unified computing. Created by ASCII and Microsoft, this Japanese standard brought together Sony, Panasonic, Yamaha, and others to create a compatible ecosystem that launched gaming legends.

## Why Learn MSX Programming?

The MSX combines Z80 power with standardized hardware, making it perfect for learning structured game development. Its influence on Japanese gaming culture and the birth of franchises like Metal Gear make it historically essential.

## What Makes the MSX Special

- **Unified Standard**: Multiple manufacturers, one architecture
- **Gaming Heritage**: Birthplace of Konami and Hudson classics
- **Z80 Excellence**: Clean, powerful processor architecture
- **Japanese Computing**: Window into Japan's digital revolution

## Curriculum Highlights

*Currently in development*

When launched, the MSX curriculum will include:
- Z80 assembly programming
- TMS9918 graphics and sprites
- AY-3-8910 sound programming
- MSX-DOS and BIOS calls
- 4 complete projects including arcade-style games

## The MSX Legacy

The MSX proved that standards could unite an industry. While it never conquered America, it defined computing in Japan, Brazil, and Europe, creating a generation of programmers who would shape gaming's future.

Check back soon for the complete MSX curriculum!