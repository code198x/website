---
name: "ZX Spectrum"
slug: "sinclair-zx-spectrum"
full_name: "Sinclair ZX Spectrum"
manufacturer: "Sinclair Research"
model_number: "ZX Spectrum"
alternative_names: ["Speccy", "Spectrum"]

# Hardware specifications
cpu: "Z80"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Z80"
  addressing_modes: ["Immediate", "Direct", "Indexed", "Register", "Implied"]
  registers: "8-bit: A, B, C, D, E, H, L, F; 16-bit: BC, DE, HL, SP, PC, IX, IY"

clock_speed: "3.5 MHz"
ram: "16KB / 48KB / 128KB"
ram_details:
  user_available: "16KB (16K model) / 41.5KB (48K model)"
  video_ram: "6.75KB (shared with system RAM)"
  expansion_options: ["Interface 1", "Memory expansions"]

rom: "16KB"
rom_contents: ["Sinclair BASIC", "System routines", "Character set"]

# Graphics capabilities
video:
  processor: "ULA (Uncommitted Logic Array)"
  resolution: "256×192 pixels"
  colors: "8 colors (2 brightness levels)"
  display_modes: ["Bitmap with attribute overlay"]
  sprites:
    count: 0
    size: "Software sprites only"
    colors_per_sprite: 2
  hardware_scrolling: false
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "Beeper (1-bit audio)"
  channels: 1
  features: ["Simple tones", "Click sounds"]
  sample_playback: false
  synthesis_types: ["Pulse wave"]

# Storage and I/O
storage: ["Cassette tape", "Microdrive", "Floppy disk (third-party)"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Microdrive", "Disk interfaces"]
  typical_capacity:
    cassette: "100KB per side"
    floppy: "180KB-800KB"

io_ports: ["Expansion port", "Cassette ports", "RF output", "Composite video"]
expansion_options: ["Interface 1", "Interface 2", "Various third-party expansions"]

# Commercial information
release_date:
  global: 1982-04-23T00:00:00Z

country_of_origin: "United Kingdom"
operating_system: "Sinclair BASIC"
programming_languages: ["BASIC", "Z80 Assembly"]

# Target market and positioning
target_market: ["Home users", "Education", "Gaming", "Programming hobbyists"]
market_positioning: "Affordable home computer for the masses"
competition: ["Commodore 64", "BBC Micro", "Amstrad CPC"]

# Educational relevance
learning_advantages: ["Simple architecture", "Well-documented", "Large community"]
common_beginner_projects: ["Games", "Graphics demos", "Sound experiments"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "Fuse"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"
  - name: "ZX Spin"
    platform: "Windows"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The computer that brought affordable computing to British homes and launched a thousand bedroom programmers."

# Platform Classification
medal_tier: "platinum"
total_lessons: 4096
total_games: 32
estimated_duration: "12-18 months"
cpu_architecture: "Z80"
difficulty_level: "intermediate"

status: "planned"
order: 2
---

# ZX Spectrum

_Coming Soon_

The ZX Spectrum revolutionized home computing in the UK and Europe, creating a generation of bedroom programmers who would go on to found the British games industry. With its distinctive rubber keyboard, affordable price, and surprising capabilities, the Spectrum proved that great games don't need expensive hardware.

## Why Learn Spectrum Programming?

The Z80 processor offers a different assembly experience from the 6502, with a rich instruction set and unique architectural features. The Spectrum's attribute-based graphics system and beeper sound create interesting technical challenges that inspire creative solutions.

## What Makes the Spectrum Special

- **Attribute System**: Unique color limitation (2 colors per 8×8 block) that defined a visual generation
- **Z80 Architecture**: More registers and addressing modes than 6502
- **Bedroom Coder Heritage**: Where legendary developers like Ultimate Play the Game started
- **European Gaming**: Different design philosophy from American games

## Curriculum Highlights

_Currently in development_

When launched, the Spectrum curriculum will include:

- Z80 assembly fundamentals
- Attribute clash management and creative graphics
- Beeper music and sound effects
- Classic Spectrum game recreation
- 16 complete games across multiple genres

## The Spectrum Community

The Spectrum scene remains incredibly active with new games, demos, and hardware released regularly. The platform's limitations continue to inspire creative programming solutions and distinctive artistic styles.

Check back soon for the complete ZX Spectrum curriculum!
