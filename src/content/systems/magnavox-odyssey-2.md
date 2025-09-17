---
name: "Magnavox Odyssey²"
full_name: "Magnavox Odyssey²"
manufacturer: "Magnavox"
model_number: "7000"
alternative_names: ["Philips Videopac G7000", "Philips Videopac+ G7400"]

# Hardware specifications
cpu: "8048"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Intel 8048"
  addressing_modes: ["Register", "Immediate", "Indirect"]
  registers: "Accumulator, Program Counter, Stack Pointer, R0-R7"

clock_speed: "1.79 MHz"
ram: "192 bytes"
ram_details:
  user_available: "64 bytes CPU internal"
  video_ram: "128 bytes"
  expansion_options: ["None"]

rom: "1KB"
rom_contents: ["System ROM", "Boot routines"]

# Graphics capabilities
video:
  processor: "Intel 8244"
  resolution: "160×200 / 160×192"
  colors: "8 fixed colors"
  display_modes: ["Character graphics 9×8", "4 movable sprites", "12 fixed sprites", "Grid overlay"]
  sprites:
    count: 4
    size: "8×8 pixels"
    colors_per_sprite: 1
  hardware_scrolling: false
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "Intel 8244 (integrated)"
  channels: 1
  features: ["24 selectable tones", "White noise", "Electronic beeps"]
  sample_playback: false
  synthesis_types: ["Square wave", "Noise"]

# Storage and I/O
storage: ["ROM cartridge", "BASIC programming cartridge"]
storage_details:
  built_in: ["Cartridge slot"]
  expansion: ["Voice synthesis add-on"]
  typical_capacity:
    cartridge: "2KB-8KB"

io_ports: ["2 joystick/keypad controllers", "Full alphanumeric keyboard", "Cartridge slot"]
expansion_options: ["Voice synthesis module", "Additional controllers"]

# Commercial information
release_date:
  global: 1978-09-01T00:00:00Z

country_of_origin: "United States"
operating_system: "None (cartridge-based)"
programming_languages: ["8048 Assembly", "BASIC (with cartridge)"]

# Target market and positioning
target_market: ["Education", "Home gaming", "Programming education"]
market_positioning: "Educational computer video game system"
competition: ["Atari 2600", "Intellivision", "Channel F"]

# Educational relevance
learning_advantages:
  [
    "Extreme memory constraints",
    "Character-based graphics",
    "Educational software design",
    "8048 microcontroller programming",
  ]
common_beginner_projects:
  [
    "Educational games",
    "Text-based applications",
    "Character graphics demos",
    "Keyboard input programs",
  ]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "O2EM"
    platform: "Multi-platform"
    accuracy: "high"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The first console with a built-in keyboard—education meets entertainment in 1978."

# Platform Classification
medal_tier: "bronze"
total_lessons: 512
total_games: 8
estimated_duration: "2-4 weeks"
cpu_architecture: "8048"
difficulty_level: "intermediate"
status: "vault"
order: 39
---

# Magnavox Odyssey²

_Coming Soon_

The Magnavox Odyssey² broke new ground in 1978 as the first home console featuring a built-in keyboard and emphasizing educational computing alongside traditional gaming. Despite severe memory constraints (just 64 bytes of RAM), it pioneered the concept of "smart" consoles that could teach as well as entertain.

## Why Learn Odyssey² Programming?

The Odyssey²'s extreme constraints teach fundamental optimization principles still relevant today. With only 64 bytes of RAM and character-based graphics, every programming decision matters. Its educational focus and keyboard integration offer insights into early attempts at combining learning with interactive entertainment.

## What Makes the Odyssey² Special

- **Built-in Keyboard**: First console with full alphanumeric keyboard
- **Educational Focus**: Learning programs alongside traditional games
- **Character Graphics**: Unique programming model using 8×8 character cells
- **Interactive Overlays**: Physical overlays combined with digital sprites
- **Programming Capability**: BASIC interpreter cartridge for learning to code

## Curriculum Highlights

_Currently in development_

When launched, the Odyssey² curriculum will include:

- Intel 8048 assembly programming in ultra-constrained environment
- Character-based graphics and sprite manipulation techniques
- Educational software design and interactive learning principles
- Keyboard input programming and text processing
- Complete educational games demonstrating system capabilities

## Educational Gaming Pioneer

The Odyssey² established that consoles could be serious educational tools, influencing later keyboard-equipped systems and proving that gamification of learning was not only possible but commercially viable in the home market.

Check back soon for the complete Odyssey² curriculum!
