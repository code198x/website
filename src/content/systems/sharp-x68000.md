---
name: "Sharp X68000"
full_name: "Sharp X68000"
manufacturer: "Sharp Corporation"
model_number: "CZ-600C"
alternative_names: ["X68k", "Personal Workstation"]

# Hardware specifications
cpu: "68000"
cpu_details:
  architecture: "16/32-bit"
  instruction_set: "Motorola 68000"
  addressing_modes:
    ["Register Direct", "Address Register Indirect", "Immediate", "Absolute", "PC Relative"]
  registers: "8 data registers (D0-D7), 8 address registers (A0-A7)"

clock_speed: "10 MHz"
ram: "1MB-4MB"
ram_details:
  user_available: "1MB standard"
  video_ram: "512KB VRAM"
  expansion_options: ["Up to 12MB"]

rom: "1MB ROM"
rom_contents: ["IPL", "Human68k"]

# Graphics capabilities
video:
  processor: "Custom graphics chips"
  resolution: "512×512 to 1024×1024"
  colors: "65,536 colors"
  display_modes: ["Multiple resolutions", "Sprite support", "Hardware scrolling"]
  sprites:
    count: 128
    size: "16×16"
    colors_per_sprite: 15
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "YM2151 + OKI MSM6258"
  channels: 8
  features: ["FM synthesis", "ADPCM", "Stereo"]
  sample_playback: true
  synthesis_types: ["FM", "ADPCM"]

# Storage and I/O
storage: ['5.25" floppy', "Hard disk", "SASI"]
storage_details:
  built_in: ['Two 5.25" floppy drives']
  expansion: ["SASI/SCSI hard disk"]
  typical_capacity:
    floppy: "1.2MB"

io_ports: ["MIDI", "RS-232C", "Expansion slots", "Mouse", "Joystick"]
expansion_options: ["RAM expansion", "MIDI board", "SCSI"]

# Commercial information
release_date:
  global: 1987-03-01T00:00:00Z

country_of_origin: "Japan"
operating_system: "Human68k"
programming_languages: ["68000 Assembly", "C", "X-BASIC"]

# Target market and positioning
target_market: ["Hobbyists", "Game developers", "Musicians"]
market_positioning: "Personal workstation"
competition: ["FM Towns", "PC-9801", "Amiga"]

# Educational relevance
learning_advantages: ["Arcade-perfect hardware", "Japanese gaming heritage", "68000 programming"]
common_beginner_projects: ["Arcade ports", "Demo effects", "FM music"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "XM6 Pro-68k"
    platform: "Windows"
    accuracy: "high"
  - name: "WinX68k"
    platform: "Windows"
    accuracy: "good"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "Japan's legendary hobbyist computer with arcade-perfect graphics and the birthplace of Street Fighter II."

# Platform Classification
medal_tier: "gold"
total_lessons: 256
total_games: 2
estimated_duration: "4-6 months"
cpu_architecture: "68000"
difficulty_level: "advanced"
status: "planned"
order: 19
---

# Sharp X68000

_Coming Soon_

The Sharp X68000 was Japan's ultimate home computer - a no-compromise machine with arcade-quality graphics, professional sound, and a price tag to match. Capcom developed Street Fighter II on the X68000, and many arcade games had pixel-perfect ports.

## Why Learn X68000 Programming?

The X68000 represents the pinnacle of 68000-based home computing. Its powerful sprite hardware and FM synthesis chip offer insights into Japanese game development techniques that influenced the entire industry.

## What Makes the X68000 Special

- **Arcade at Home**: Actual arcade hardware specs
- **68000 at 10MHz**: Faster than Amiga or ST
- **Sprite Power**: 128 hardware sprites
- **Japanese Gaming**: Where legendary games were born

## Curriculum Highlights

_Currently in development_

When launched, the X68000 curriculum will include:

- 68000 assembly optimization
- Sprite and background programming
- YM2151 FM synthesis
- Arcade-perfect conversions
- 2 complete projects

## The X68000 Legacy

Though it never left Japan, the X68000's influence on gaming is immeasurable. Games developed on it defined genres, and its technical capabilities pushed developers to create experiences that wouldn't be matched elsewhere for years.

Check back soon for the complete X68000 curriculum!
