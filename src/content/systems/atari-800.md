---
name: "Atari 800"
full_name: "Atari 800/XL/XE"
manufacturer: "Atari Inc."
model_number: "800/800XL/130XE"
alternative_names: ["Atari 8-bit", "Atari XL", "Atari XE"]

# Hardware specifications
cpu: "6502C"
cpu_details:
  architecture: "8-bit"
  instruction_set: "MOS Technology 6502C"
  addressing_modes: ["Immediate", "Zero Page", "Absolute", "Indexed", "Indirect"]
  registers: "A (Accumulator), X, Y (Index), S (Stack), P (Status)"

clock_speed: "1.79 MHz"
ram: "64KB"
ram_details:
  user_available: "48KB typical"
  video_ram: "Screen RAM in main memory"
  expansion_options: ["Up to 128KB (130XE)", "Extended banks"]

rom: "16KB"
rom_contents: ["OS ROM", "BASIC ROM"]

# Graphics capabilities
video:
  processor: "ANTIC + GTIA"
  resolution: "320×192 maximum"
  colors: "256 colors"
  display_modes: ["Display List driven", "Mixed modes", "Player/Missile graphics"]
  sprites:
    count: 5
    size: "8 pixels wide"
    colors_per_sprite: 3
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "POKEY"
  channels: 4
  features: ["Square waves", "Noise", "High-pass filter", "Serial I/O"]
  sample_playback: false
  synthesis_types: ["Square wave", "Noise"]

# Storage and I/O
storage: ["Cartridge", "Cassette", "Floppy disk"]
storage_details:
  built_in: ["Cartridge slot", "SIO port"]
  expansion: ["Disk drive", "Cassette"]
  typical_capacity:
    cartridge: "8KB-16KB"
    floppy: "90KB-180KB"

io_ports: ["SIO", "Cartridge", "Joystick ports", "Expansion"]
expansion_options: ["RAM expansion", "80-column card", "Various peripherals"]

# Commercial information
release_date:
  global: 1979-11-01T00:00:00Z

country_of_origin: "United States"
operating_system: "Atari DOS"
programming_languages: ["6502 Assembly", "Atari BASIC"]

# Target market and positioning
target_market: ["Home computing", "Gaming", "Education"]
market_positioning: "Advanced home computer with custom chips"
competition: ["Commodore 64", "Apple II", "TI-99/4A"]

# Educational relevance
learning_advantages: ["Custom chip programming", "Display Lists", "Advanced graphics"]
common_beginner_projects: ["Display List experiments", "Player/Missile graphics", "POKEY music"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "Altirra"
    platform: "Windows"
    accuracy: "cycle_accurate"
  - name: "Atari800"
    platform: "Windows, macOS, Linux"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The 8-bit computer with custom chips that delivered arcade-quality graphics and sound years ahead of its time."

# Platform Classification
medal_tier: "silver"
total_lessons: 512
total_games: 4
estimated_duration: "6-9 months"
cpu_architecture: "6502"
difficulty_level: "intermediate"
status: "planned"
order: 15
---

# Atari 800

_Coming Soon_

The Atari 800 was a technological marvel in 1979, featuring custom chips (ANTIC, GTIA, POKEY) that gave it graphics and sound capabilities years ahead of the competition. Its Display List architecture influenced future graphics systems.

## Why Learn Atari 800 Programming?

The Atari 800's custom chips teach advanced concepts in hardware acceleration and display processing. Its Display List system is a precursor to modern GPU command buffers, making it surprisingly relevant today.

## What Makes the Atari 800 Special

- **Custom Chips**: ANTIC, GTIA, and POKEY defined advanced graphics
- **Display Lists**: Hardware-driven display mode switching
- **Player/Missile Graphics**: Hardware sprites before they were common
- **256 Colors in 1979**: When competitors had 16

## Curriculum Highlights

_Currently in development_

When launched, the Atari 800 curriculum will include:

- 6502 assembly with custom chip integration
- ANTIC Display List programming
- GTIA graphics modes and effects
- POKEY sound and music programming
- 4 complete projects showcasing the custom chips

## The Atari 800 Legacy

The Atari 800 proved that custom hardware could deliver revolutionary capabilities. Its influence extends from the Amiga's custom chips to modern GPU architectures. Jay Miner, who designed the Atari 800's chips, went on to create the Amiga.

Check back soon for the complete Atari 800 curriculum!
