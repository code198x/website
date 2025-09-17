---
name: "NES"
full_name: "Nintendo Entertainment System"
manufacturer: "Nintendo"
model_number: "NES-001"
alternative_names: ["Famicom", "Family Computer"]

# Hardware specifications
cpu: "6502"
cpu_details:
  architecture: "8-bit"
  instruction_set: "6502 variant (Ricoh 2A03)"
  addressing_modes: ["Immediate", "Zero Page", "Absolute", "Indexed", "Indirect"]
  registers: "A (Accumulator), X, Y (Index), S (Stack), P (Status)"

clock_speed: "1.79 MHz (NTSC) / 1.66 MHz (PAL)"
ram: "2KB"
ram_details:
  user_available: "2KB system RAM"
  video_ram: "2KB (separate)"
  expansion_options: ["Cartridge RAM/ROM"]

rom: "None (cartridge-based)"
rom_contents: ["Loaded from cartridge"]

# Graphics capabilities
video:
  processor: "PPU (Picture Processing Unit)"
  resolution: "256×240 pixels"
  colors: "54 colors from palette"
  display_modes: ["Tiled backgrounds", "Sprites"]
  sprites:
    count: 64
    size: "8×8 or 8×16 pixels"
    colors_per_sprite: 3
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "APU (Audio Processing Unit)"
  channels: 5
  features: ["2 pulse waves", "1 triangle wave", "1 noise", "1 DPCM"]
  sample_playback: true
  synthesis_types: ["Pulse", "Triangle", "Noise", "Delta PCM"]

# Storage and I/O
storage: ["Cartridge ROM", "Battery-backed RAM (some cartridges)"]
storage_details:
  built_in: ["Cartridge slot"]
  expansion: ["Famicom Disk System (Japan only)"]
  typical_capacity:
    cartridge: "8KB-1MB+"

io_ports: ["Controller ports", "Expansion port", "RF/Composite output"]
expansion_options: ["Light gun", "R.O.B.", "Various peripherals"]

# Commercial information
release_date:
  global: 1985-10-18T00:00:00Z

country_of_origin: "Japan"
operating_system: "None (cartridge-based)"
programming_languages: ["6502 Assembly"]

# Target market and positioning
target_market: ["Home gaming", "Family entertainment"]
market_positioning: "Premium home video game console"
competition: ["Sega Master System", "Atari 7800"]

# Educational relevance
learning_advantages: ["Constrained environment", "Tile-based graphics", "Pattern tables"]
common_beginner_projects: ["Simple games", "Graphics demos", "Sound tests"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "Mesen"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"
  - name: "FCEUX"
    platform: "Windows, macOS, Linux"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "common"

# Media
description: "The console that saved video gaming in North America and established Nintendo as a household name."

# Platform Classification
medal_tier: "platinum"
total_lessons: 4096
total_games: 32
estimated_duration: "12-18 months"
cpu_architecture: "6502"
difficulty_level: "intermediate"

status: "planned"
order: 3
---

# Nintendo Entertainment System

_Coming Soon_

The NES didn't just save the video game industry after the 1983 crash - it redefined what home gaming could be. With its powerful PPU, sophisticated scrolling capabilities, and innovative mapper chips, the NES became the canvas for some of gaming's most iconic experiences.

## Why Learn NES Programming?

The NES uses a 6502 variant similar to the C64, but with a completely different architecture focused on gaming. Its tile-based graphics, pattern tables, and powerful PPU offer unique programming challenges that teach fundamental game development concepts still relevant today.

## What Makes the NES Special

- **PPU Power**: Hardware scrolling, sprites, and background layers
- **Mapper Chips**: Extend capabilities through cartridge hardware
- **Tile-Based Graphics**: Efficient pattern and palette management
- **Gaming Focus**: Pure gaming machine without computer overhead

## Curriculum Highlights

_Currently in development_

When launched, the NES curriculum will include:

- 6502 assembly for the Ricoh 2A03
- PPU programming and graphics techniques
- APU sound and music programming
- Mapper utilization and bank switching
- 16 complete games from simple to advanced

## The NES Legacy

NES development teaches constraint-based design at its finest. Working with 2KB of RAM and limited sprites forces elegant solutions that modern developers rarely need to consider. These skills translate directly to embedded systems and performance-critical code.

Check back soon for the complete NES curriculum!
