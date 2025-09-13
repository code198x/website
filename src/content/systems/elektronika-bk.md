---
name: "Elektronika BK"
full_name: "NPO Scientific Center Elektronika BK"
manufacturer: "NPO Scientific Center"
model_number: "BK-0010"
alternative_names: ["BK-0011", "BK-0010-01", "BK-0011M"]

# Hardware specifications
cpu: "KR580VM80A"
cpu_details:
  architecture: "16-bit"
  instruction_set: "PDP-11 compatible"
  addressing_modes: ["Register", "Immediate", "Absolute", "Relative", "Indexed", "Indirect"]
  registers: "R0, R1, R2, R3, R4, R5, SP, PC"

clock_speed: "3 MHz"
ram: "16KB-128KB"
ram_details:
  user_available: "16KB standard"
  video_ram: "Shared with system RAM"
  expansion_options: ["Memory expansion to 128KB"]

rom: "32KB"
rom_contents: ["RT-11SJ OS", "BASIC interpreter", "FOCAL", "System utilities"]

# Graphics capabilities
video:
  processor: "Custom video controller"
  resolution: "512×256"
  colors: "Monochrome (green phosphor)"
  display_modes:
    ["512×256 bitmap", "64×32 character text", "Mixed graphics/text", "Hardware scrolling"]
  sprites:
    count: 0
    size: "Software only"
    colors_per_sprite: 0
  hardware_scrolling: true
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "Covox-compatible DAC"
  channels: 1
  features:
    [
      "8-bit digital audio",
      "Software sound generation",
      "Covox Sound Master support",
      "Cassette interface",
    ]
  sample_playback: true
  synthesis_types: ["Software synthesis", "Digital samples"]

# Storage and I/O
storage: ["Cassette tape", "ROM cartridge", "Floppy disk"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ['5.25" floppy disk (BK-0011)']
  typical_capacity:
    cassette: "Variable"

io_ports:
  ["Soviet keyboard", "Joystick ports", "Cassette interface", "Printer port", "Expansion slots"]
expansion_options: ["Floppy disk interface", "Memory cards", "I/O cards"]

# Commercial information
release_date:
  global: 1985-01-01T00:00:00Z

country_of_origin: "Soviet Union"
operating_system: "RT-11SJ"
programming_languages: ["PDP-11 Assembly", "BASIC", "FOCAL", "Turbo Pascal"]

# Target market and positioning
target_market: ["Education", "Home users", "Technical training", "Programming education"]
market_positioning: "Minicomputer power for the masses"
competition: ["Western home computers (limited availability)", "Other Soviet computers"]

# Educational relevance
learning_advantages:
  [
    "16-bit minicomputer architecture",
    "PDP-11 instruction set",
    "Operating system programming",
    "Soviet computing history",
  ]
common_beginner_projects:
  [
    "Assembly language programs",
    "Graphics applications",
    "Educational software",
    "System utilities",
  ]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "BK Back to Life"
    platform: "Windows"
    accuracy: "high"
  - name: "BKDE"
    platform: "DOS/Windows"
    accuracy: "high"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "The Soviet home computer based on PDP-11 architecture that brought minicomputer power to the masses."

# Platform Classification
medal_tier: "bronze"
total_lessons: 512
total_games: 8
estimated_duration: "2-4 weeks"
cpu_architecture: "PDP-11"
difficulty_level: "advanced"
status: "planned"
order: 63
---

# Elektronika BK

_Coming Soon_

The Elektronika BK series represents one of the most fascinating chapters in computing history—the Soviet Union's successful adaptation of Digital Equipment Corporation's PDP-11 minicomputer architecture into an affordable home computer. This system brought genuine 16-bit minicomputer power to Soviet households.

## Why Learn BK Programming?

The BK's PDP-11 architecture offers unique programming challenges not found in typical home computers. Its sophisticated instruction set, memory management, and RT-11SJ operating system provide insights into minicomputer programming and Soviet computing philosophy.

## What Makes the BK Special

- **PDP-11 Architecture**: Full minicomputer instruction set in home computer
- **16-bit Processing**: Advanced architecture compared to 8-bit contemporaries
- **RT-11SJ Operating System**: Simplified version of DEC's minicomputer OS
- **Soviet Engineering**: Complete domestic production behind Iron Curtain
- **Educational Focus**: Designed to teach programming and computer science

## Curriculum Highlights

_Currently in development_

When launched, the BK curriculum will include:

- PDP-11 assembly language programming fundamentals
- RT-11SJ operating system interaction and system calls
- Memory management and bank switching techniques
- Graphics programming and bitmap manipulation
- Complete system utility showcasing minicomputer capabilities

## Soviet Computing Legacy

The BK proved that sophisticated computer architecture could be successfully adapted and manufactured independently, introducing thousands of Soviet citizens to programming and establishing a unique computing culture that influenced an entire generation of Eastern European programmers.

Check back soon for the complete BK curriculum!
