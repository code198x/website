---
name: "Enterprise"
full_name: "Enterprise 64/128"
manufacturer: "Enterprise Computers"
model_number: "64/128"
alternative_names: ["Elan Enterprise", "Enterprise 64", "Enterprise 128"]

# Hardware specifications
cpu: "Z80"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Zilog Z80"
  addressing_modes: ["Immediate", "Register", "Indexed", "Indirect", "Relative"]
  registers: "A, B, C, D, E, H, L, IX, IY, SP, PC"

clock_speed: "4 MHz"
ram: "64KB/128KB"
ram_details:
  user_available: "64KB or 128KB"
  video_ram: "Shared with system RAM"
  expansion_options: ["Memory expansion"]

rom: "32KB"
rom_contents: ["EXOS", "BASIC", "EXDOS"]

# Graphics capabilities
video:
  processor: "Nick chip"
  resolution: "256×192 to 640×256"
  colors: "256 colors"
  display_modes: ["Multiple graphics modes", "Text modes"]
  sprites:
    count: 0
    size: "Software sprites"
    colors_per_sprite: 0
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "Dave chip"
  channels: 4
  features: ["Square waves", "Noise", "Envelope control", "Sound effects"]
  sample_playback: false
  synthesis_types: ["Square wave", "Noise"]

# Storage and I/O
storage: ["Cassette", "Floppy disk", "Cartridge"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Floppy disk interface"]
  typical_capacity:
    cassette: "Variable"

io_ports: ["Cartridge slot", "Expansion port", "Serial", "Joystick"]
expansion_options: ["Disk interface", "Network interface", "ROM cartridges"]

# Commercial information
release_date:
  global: 1985-09-01T00:00:00Z

country_of_origin: "United Kingdom"
operating_system: "EXOS"
programming_languages: ["Z80 Assembly", "Enterprise BASIC"]

# Target market and positioning
target_market: ["Home users", "Gaming", "Business"]
market_positioning: "The machine Sinclair should have made"
competition: ["Amstrad CPC", "ZX Spectrum", "Commodore 64"]

# Educational relevance
learning_advantages: ["Advanced graphics", "Unique architecture", "Custom chips"]
common_beginner_projects: ["Graphics demos", "Games", "System utilities"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "ep128emu"
    platform: "Windows, Linux"
    accuracy: "cycle_accurate"
  - name: "EnterpriseForever"
    platform: "Windows"
    accuracy: "high"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "The technically superior computer that arrived too late to challenge the established UK market."
image: "/images/systems/enterprise.jpg"

# Platform Classification
medal_tier: "bronze"
total_lessons: 0
total_games: 1
estimated_duration: "2-3 months"
cpu_architecture: "Z80"
difficulty_level: "intermediate"
status: "planned"
order: 56
---

# Enterprise 64/128

*Coming Soon*

The Enterprise was designed as "the machine Sinclair should have made" - a technically superior computer with advanced graphics, sound, and expandability. Despite impressive capabilities, it arrived too late to make an impact in the established UK market.

## Why Learn Enterprise Programming?

The Enterprise's Nick and Dave custom chips offer unique programming challenges not found elsewhere. Its advanced graphics modes and sophisticated operating system (EXOS) provide insights into what 8-bit computing could have achieved.

## What Makes the Enterprise Special

- **Nick Graphics**: Advanced video processor with multiple modes
- **Dave Sound**: Sophisticated 4-channel audio with effects
- **256 Colors**: More than any contemporary 8-bit machine
- **EXOS Operating System**: Advanced multitasking capabilities

## Curriculum Highlights

*Currently in development*

When launched, the Enterprise curriculum will include:
- Z80 assembly with custom chip programming
- Nick graphics processor techniques
- Dave sound chip programming  
- EXOS system programming
- Complete demo project showcasing capabilities

## The Enterprise Legacy

The Enterprise proved that technical excellence alone doesn't guarantee success. Its advanced features influenced later systems, and its devoted community continues to push its capabilities. It remains a "what if" in computing history.

Check back soon for the complete Enterprise curriculum!