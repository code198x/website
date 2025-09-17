---
name: "Vectrex"
full_name: "GCE Vectrex"
manufacturer: "General Consumer Electronics"
model_number: "HP3000"
alternative_names: ["Vector Graphics Console"]

# Hardware specifications
cpu: "6809"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Motorola 6809"
  addressing_modes: ["Immediate", "Direct", "Extended", "Indexed", "Relative"]
  registers: "A, B (D combined), X, Y, U, S, DP, CC"

clock_speed: "1.5 MHz"
ram: "1KB"
ram_details:
  user_available: "1KB"
  video_ram: "None (vector display)"
  expansion_options: ["Cartridge RAM"]

rom: "8KB"
rom_contents: ["BIOS", "Mine Storm game", "Vector routines"]

# Graphics capabilities
video:
  processor: "Vector generator"
  resolution: "Vector (no pixels)"
  colors: "Monochrome"
  display_modes: ["Vector graphics", "Vector text"]
  sprites:
    count: 0
    size: "N/A"
    colors_per_sprite: 0
  hardware_scrolling: false
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "AY-3-8912"
  channels: 3
  features: ["Square waves", "Noise", "Envelope control"]
  sample_playback: false
  synthesis_types: ["PSG synthesis"]

# Storage and I/O
storage: ["ROM cartridge"]
storage_details:
  built_in: ["Built-in Mine Storm game"]
  expansion: ["Cartridge slot"]
  typical_capacity:
    cartridge: "4KB-32KB"

io_ports: ["Controller ports", "Cartridge slot", "Light pen port"]
expansion_options: ["3D Imager", "Light pen", "Analog controller"]

# Commercial information
release_date:
  global: 1982-11-01T00:00:00Z

country_of_origin: "United States"
operating_system: "None"
programming_languages: ["6809 Assembly"]

# Target market and positioning
target_market: ["Home gaming", "Arcade enthusiasts"]
market_positioning: "Arcade vector graphics at home"
competition: ["Atari 2600", "ColecoVision", "Intellivision"]

# Educational relevance
learning_advantages: ["Vector graphics programming", "6809 architecture", "Unique display system"]
common_beginner_projects: ["Vector drawing", "Line animations", "Simple vector games"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "ParaJVE"
    platform: "Java (multi-platform)"
    accuracy: "high"
  - name: "MESS/MAME"
    platform: "Multi-platform"
    accuracy: "high"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "The only home console with a true vector display, bringing the crisp lines of Asteroids and Tempest home."

# Platform Classification
medal_tier: "silver"
total_lessons: 0
total_games: 1
estimated_duration: "2-3 months"
cpu_architecture: "6809"
difficulty_level: "advanced"
status: "vault"
order: 16
---

# Vectrex

_Coming Soon_

The Vectrex was utterly unique: the only home gaming system with a true vector display. While others drew pixels, the Vectrex drew pure lines of light, creating impossibly crisp graphics that still look futuristic today.

## Why Learn Vectrex Programming?

Vector graphics programming is fundamentally different from pixel-based systems. The Vectrex teaches mathematical approaches to graphics, coordinate systems, and the elegance of vector mathematics.

## What Makes the Vectrex Special

- **Vector Display**: True vectors, not pixels
- **Built-in Monitor**: Self-contained gaming system
- **6809 Processor**: Most advanced 8-bit CPU
- **Arcade Perfect**: Identical to vector arcade technology

## Curriculum Highlights

_Currently in development_

When launched, the focused Vectrex curriculum will include:

- 6809 assembly programming
- Vector graphics mathematics
- Coordinate transformations
- Sound synthesis with AY-3-8912
- Complete vector game project

## The Vectrex Legacy

The Vectrex proved that different could be better. Though commercial failure ended its run, it remains beloved for its unique visuals and innovative approach. Modern developers still create new Vectrex games, drawn to its distinctive aesthetic.

Check back soon for the complete Vectrex curriculum!
