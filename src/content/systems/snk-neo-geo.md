---
name: "Neo Geo"
full_name: "SNK Neo Geo AES/MVS"
manufacturer: "SNK"
model_number: "NEO-AES"
alternative_names: ["Neo Geo AES", "MVS", "Neo Geo MVS"]

# Hardware specifications
cpu: "68000"
cpu_details:
  architecture: "16/32-bit"
  instruction_set: "Motorola 68000"
  addressing_modes: ["Register Direct", "Address Register Indirect", "Immediate", "Absolute", "PC Relative"]
  registers: "8 data registers (D0-D7), 8 address registers (A0-A7)"

clock_speed: "12 MHz"
ram: "64KB + 84KB"
ram_details:
  user_available: "64KB main"
  video_ram: "84KB video"
  expansion_options: ["Memory card"]

rom: "Cartridge ROM"
rom_contents: ["Game ROM up to 330 megabits"]

# Graphics capabilities
video:
  processor: "Custom chipset"
  resolution: "320×224"
  colors: "65,536 colors"
  display_modes: ["Fix layer", "Sprite layer"]
  sprites:
    count: 380
    size: "16×16 to 16×512"
    colors_per_sprite: 15
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "YM2610"
  channels: 15
  features: ["4 FM channels", "3 PSG channels", "7 ADPCM channels", "1 ADPCM-B channel"]
  sample_playback: true
  synthesis_types: ["FM", "PSG", "ADPCM"]

# Storage and I/O
storage: ["ROM cartridge", "Memory card"]
storage_details:
  built_in: ["None"]
  expansion: ["Memory card for saves"]
  typical_capacity:
    cartridge: "Up to 330 megabits"

io_ports: ["Controller ports", "Memory card", "Headphone"]
expansion_options: ["Memory card", "Link cable"]

# Commercial information
release_date:
  global: 1990-04-26T00:00:00Z

country_of_origin: "Japan"
operating_system: "None"
programming_languages: ["68000 Assembly"]

# Target market and positioning
target_market: ["Arcade enthusiasts", "High-end gaming"]
market_positioning: "Arcade perfection at home"
competition: ["SNES", "Genesis", "TurboGrafx-16"]

# Educational relevance
learning_advantages: ["Arcade hardware programming", "Sprite management", "68000 optimization"]
common_beginner_projects: ["Fighting game mechanics", "Sprite scaling", "Multi-layer graphics"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "FinalBurn Neo"
    platform: "Multi-platform"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "rare"

# Media
description: "The $650 console that was literally an arcade machine in your home, with perfect ports and massive sprites."
image: "/images/systems/neo-geo.jpg"

# Platform Classification
medal_tier: "gold"
total_lessons: 128
total_games: 1
estimated_duration: "3-4 months"
cpu_architecture: "68000"
difficulty_level: "advanced"
status: "planned"
order: 25
---

# Neo Geo

*Coming Soon*

The Neo Geo was SNK's audacious gamble: sell actual arcade hardware to consumers for $650. No ports, no compromises - the exact same games that ran in arcades. It created a legend that endures today.

## Why Learn Neo Geo Programming?

The Neo Geo represents arcade programming at its peak. With massive sprites, multiple background layers, and incredible audio capabilities, it teaches techniques for managing complex 2D graphics systems that influenced game development for decades.

## What Makes the Neo Geo Special

- **330 Megabit Cartridges**: Largest games of the era
- **380 Sprites**: More than any other system
- **Arcade Perfect**: Not ports - the actual arcade games
- **$200 Games**: The ultimate collector's items

## Curriculum Highlights

*Currently in development*

When launched, the Neo Geo curriculum will include:
- 68000 assembly for arcade hardware
- Sprite and fix layer management
- YM2610 sound programming
- Memory card save systems
- Complete fighting game mechanics

## The Neo Geo Legacy

The Neo Geo proved there was a market for premium gaming. Its influence on fighting games cannot be overstated - King of Fighters, Fatal Fury, and Samurai Shodown defined genres. The hardware's longevity (14 years of support) remains unmatched.

Check back soon for the complete Neo Geo curriculum!