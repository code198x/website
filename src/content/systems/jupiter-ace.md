---
name: "Jupiter ACE"
full_name: "Jupiter Cantab ACE"
manufacturer: "Jupiter Cantab"
model_number: "Jupiter ACE"
alternative_names: ["ACE"]

# Hardware specifications
cpu: "Z80A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Zilog Z80A"
  addressing_modes: ["Immediate", "Register", "Indexed", "Indirect", "Relative"]
  registers: "A, B, C, D, E, H, L, IX, IY, SP, PC"

clock_speed: "3.25 MHz"
ram: "3KB"
ram_details:
  user_available: "1KB"
  video_ram: "2KB"
  expansion_options: ["16KB RAM expansion pack"]

rom: "8KB"
rom_contents: ["ACE FORTH", "System routines"]

# Graphics capabilities
video:
  processor: "Z80A direct video generation"
  resolution: "256×192"
  colors: "Monochrome (black and white)"
  display_modes:
    ["Character mode 32×24", "High-resolution graphics 256×192", "User-defined characters"]
  sprites:
    count: 0
    size: "Software only"
    colors_per_sprite: 0
  hardware_scrolling: false
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "Built-in beeper"
  channels: 1
  features: ["Square wave generation", "Variable frequency", "Click and beep sounds"]
  sample_playback: false
  synthesis_types: ["Square wave"]

# Storage and I/O
storage: ["Cassette tape", "RAM expansion"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["16KB RAM pack"]
  typical_capacity:
    cassette: "FORTH dictionary storage"

io_ports: ["40-key membrane keyboard", "Cassette interface", "Composite video", "Expansion port"]
expansion_options: ["RAM expansion", "Interface cards"]

# Commercial information
release_date:
  global: 1982-09-01T00:00:00Z

country_of_origin: "United Kingdom"
operating_system: "ACE FORTH (ROM-based)"
programming_languages: ["FORTH", "Z80 Assembly"]

# Target market and positioning
target_market: ["Home users", "Programming enthusiasts", "Education"]
market_positioning: "Alternative to BASIC programming"
competition: ["ZX Spectrum", "Commodore 64", "BBC Micro"]

# Educational relevance
learning_advantages:
  [
    "Stack-based programming",
    "FORTH language concepts",
    "Minimal memory programming",
    "Alternative computing paradigms",
  ]
common_beginner_projects:
  [
    "Stack manipulation programs",
    "FORTH word definitions",
    "Graphics applications",
    "Memory-efficient utilities",
  ]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "EightyOne"
    platform: "Windows"
    accuracy: "high"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"

preservation_status: "excellent"
hardware_availability: "rare"

# Media
description: "The only home computer that spoke FORTH—stack-based computing for the masses."

# Platform Classification
medal_tier: "bronze"
total_lessons: 512
total_games: 8
estimated_duration: "2-4 weeks"
cpu_architecture: "Z80"
difficulty_level: "advanced"
status: "planned"
order: 42
---

# Jupiter ACE

_Coming Soon_

The Jupiter ACE stands alone in computing history as the only home computer to use FORTH as its primary programming language. Created by the designers of the ZX80 and ZX81, it introduced stack-based computing, postfix notation, and extensible programming concepts to home users decades before they became mainstream.

## Why Learn Jupiter ACE Programming?

FORTH programming on the ACE teaches advanced concepts crucial in modern computing: stack-based computing (used in JVM, PostScript), postfix notation, threaded code interpretation, and extensible language design. Programming in just 1KB of RAM demands ultimate efficiency and algorithmic optimization.

## What Makes the Jupiter ACE Special

- **FORTH Language**: Only home computer using FORTH instead of BASIC
- **Stack-Based Computing**: Revolutionary programming paradigm for home users
- **Postfix Notation**: Reverse Polish notation and expression evaluation
- **Extensible System**: Users could define new language commands
- **Minimal Hardware**: Achieving remarkable functionality with 1KB user RAM

## Curriculum Highlights

_Currently in development_

When launched, the ACE curriculum will include:

- Stack-based programming fundamentals and postfix notation
- FORTH word definition and dictionary manipulation
- Extreme memory optimization techniques for 1KB programming
- Real-time graphics with character redefinition
- Complete interactive applications demonstrating FORTH's power

## The FORTH Revolution Legacy

Despite commercial failure, the Jupiter ACE introduced thousands to programming concepts that wouldn't become mainstream for decades. FORTH principles appear in modern PostScript printers, embedded controllers, virtual machines, and stack-based languages.

Check back soon for the complete Jupiter ACE curriculum!
