---
name: "Thomson TO7/TO8"
full_name: "Thomson TO7/TO8 Educational Computer"
manufacturer: "Thomson"
model_number: "TO7"
alternative_names: ["TO7/70", "TO8", "TO8D"]

# Hardware specifications
cpu: "6809E"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Motorola 6809E"
  addressing_modes: ["Immediate", "Direct", "Extended", "Indexed", "Relative", "Inherent"]
  registers: "A, B (combinable as D), X, Y, U, S, DP, CC"

clock_speed: "1 MHz"
ram: "24KB-128KB"
ram_details:
  user_available: "24KB (TO7), 64KB (TO8)"
  video_ram: "Separate video memory"
  expansion_options: ["Memory expansion to 128KB"]

rom: "16KB"
rom_contents: ["Thomson BASIC", "System routines", "Character ROM"]

# Graphics capabilities
video:
  processor: "Custom video controller"
  resolution: "640×200 / 320×200"
  colors: "16 colors from 4096-color palette"
  display_modes:
    ["Mode 40: 320×200 16 colors", "Mode 80: 640×200 2 colors", "Text modes", "Mixed graphics/text"]
  sprites:
    count: 16
    size: "Hardware sprites"
    colors_per_sprite: 16
  hardware_scrolling: true
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "1-bit beeper"
  channels: 1
  features: ["Square wave generation", "Simple sound effects", "Cassette interface audio"]
  sample_playback: false
  synthesis_types: ["Square wave"]

# Storage and I/O
storage: ["Cassette tape", '3.5" floppy disk']
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Floppy disk drives"]
  typical_capacity:
    cassette: "Variable"
    floppy: "320KB-720KB"

io_ports: ["Keyboard", "Light pen interface", "Joystick ports", "Printer port", "Expansion slots"]
expansion_options: ["Disk interfaces", "Memory expansion", "Network interfaces"]

# Commercial information
release_date:
  global: 1982-09-01T00:00:00Z

country_of_origin: "France"
operating_system: "Thomson BASIC"
programming_languages: ["Thomson BASIC", "6809 Assembly", "Logo"]

# Target market and positioning
target_market: ["French education", "Schools", "Government initiative", "Home learning"]
market_positioning: "National educational computer standard for France"
competition: ["Amstrad CPC", "Apple II", "Commodore 64"]

# Educational relevance
learning_advantages:
  [
    "6809E processor mastery",
    "Light pen programming",
    "French educational computing",
    "Alternative architecture exploration",
  ]
common_beginner_projects:
  ["Educational games", "Light pen applications", "Graphics demos", "Interactive tutorials"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "DCMOTO"
    platform: "Windows"
    accuracy: "high"
  - name: "THEODORE"
    platform: "Multi-platform"
    accuracy: "high"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "France's national educational computer featuring the 6809E processor and pioneering light pen interface."

# Platform Classification
medal_tier: "silver"
total_lessons: 1024
total_games: 15
estimated_duration: "6-12 weeks"
cpu_architecture: "6809"
difficulty_level: "intermediate"
status: "planned"
order: 15
---

# Thomson TO7/TO8

_Coming Soon_

The Thomson TO7 and TO8 represent one of computing history's most interesting "what if" scenarios - a nationally-mandated educational computer that dominated French schools but remained largely unknown elsewhere. These machines featured the sophisticated 6809E processor and pioneered light pen interaction.

## Why Learn Thomson Programming?

Thomson systems offer insight into alternative computer architectures and the unique French approach to educational computing. The 6809E processor's advanced addressing modes and the integrated light pen interface provide fascinating contrasts to more common 8-bit systems and early direct manipulation concepts.

## What Makes Thomson Special

- **6809E Processor**: Sophisticated processor with advanced addressing modes
- **Light Pen Interface**: Pioneering direct screen interaction system
- **French Educational Focus**: Designed specifically for educational environments
- **Government Backing**: Over 100,000 units deployed in French schools
- **Alternative Architecture**: Different approach to 8-bit computing design

## Curriculum Highlights

_Currently in development_

When launched, the Thomson curriculum will include:

- Advanced 6809E assembly programming with unique addressing modes
- Light pen programming and early direct manipulation interfaces
- French educational software design principles
- Graphics programming with 16-color palette capabilities
- Complete educational applications showcasing government-backed computing

## French Computing Legacy

The Thomson computers proved that government-backed educational computing initiatives could succeed, creating a unique French computing culture and demonstrating alternative approaches to educational technology deployment that influenced later educational computing strategies.

Check back soon for the complete Thomson curriculum!
