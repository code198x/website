---
name: "FM-7"
full_name: "Fujitsu FM-7 (Fujitsu Micro 7)"
manufacturer: "Fujitsu"
model_number: "FM-7"
alternative_names: ["Fujitsu Micro 7", "FM-77", "FM77AV", "FM77AV40"]

# Hardware specifications
cpu: "6809"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Motorola 6809"
  addressing_modes: ["Immediate", "Direct", "Extended", "Indexed", "Relative", "Inherent"]
  registers: "A, B (combinable as D), X, Y, U, S, DP, CC"

clock_speed: "1.2-2.0 MHz"
ram: "64KB-512KB"
ram_details:
  user_available: "~48KB (FM-7), varies by model"
  video_ram: "48KB dedicated (3 planes × 16KB)"
  expansion_options: ["Memory expansion cards up to 512KB"]

rom: "48KB"
rom_contents: ["F-BASIC interpreter", "System monitor", "I/O routines", "Font ROM"]

# Graphics capabilities
video:
  processor: "Custom graphics subsystem"
  resolution: "640×200 / 320×200"
  colors: "8 colors / 4096 colors"
  display_modes: ["Text 80×25/40×25", "Graphics 640×200 (8 colors)", "Graphics 320×200 (4096 colors)", "Mixed text/graphics"]
  sprites:
    count: 0
    size: "Software sprites"
    colors_per_sprite: 0
  hardware_scrolling: true
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "MC6840 / YM2203 OPN"
  channels: 3
  features: ["PSG sound synthesis", "FM synthesis (FM77AV)", "Envelope control", "Noise generation", "Music programming"]
  sample_playback: false
  synthesis_types: ["PSG", "FM synthesis"]

# Storage and I/O
storage: ["Cassette tape", "5.25\" floppy", "3.5\" floppy", "Bubble memory"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Floppy disk drives", "Bubble memory units"]
  typical_capacity:
    cassette: "~100KB per side"
    floppy: "320KB (5.25\"), 720KB (3.5\")"

io_ports: ["2 joystick ports", "Printer port", "Serial port", "Cassette interface", "Expansion slots", "Light pen"]
expansion_options: ["Memory expansion", "Floppy controllers", "Modem cards", "Sound cards", "Graphics cards"]

# Commercial information
release_date:
  global: 1982-11-01T00:00:00Z

country_of_origin: "Japan"
operating_system: "F-BASIC"
programming_languages: ["F-BASIC", "6809 Assembly", "COBOL", "Pascal"]

# Target market and positioning
target_market: ["Business users", "Education", "Graphics professionals", "Japanese market"]
market_positioning: "High-end Japanese business computer with advanced graphics"
competition: ["PC-8801", "MSX", "Sharp X1", "NEC PC-98"]

# Educational relevance
learning_advantages: ["Advanced multi-plane graphics", "6809 processor mastery", "Japanese computing culture", "Business application development"]
common_beginner_projects: ["Multi-plane graphics demos", "High-resolution artwork", "Business calculators", "Music composition"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "XM7"
    platform: "Windows"
    accuracy: "high"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "high"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "Fujitsu's sophisticated Japanese computer featuring advanced multi-plane graphics, business capabilities, and the powerful 6809 processor."
image: "/images/systems/fm-7.jpg"

# Platform Classification
medal_tier: "silver"
total_lessons: 1024
total_games: 15
estimated_duration: "6-12 weeks"
cpu_architecture: "6809"
difficulty_level: "intermediate"
status: "planned"
order: 33
---

# Fujitsu FM-7

*Coming Soon*

The Fujitsu FM-7 series represented Japan's bold entry into advanced personal computing, offering sophisticated multi-plane graphics capabilities and business-oriented features that were years ahead of international competition. Built around the powerful 6809 processor, it demonstrated Japanese engineering excellence.

## Why Learn FM-7 Programming?

The FM-7's unique multi-plane graphics system and advanced 6809 architecture offer programming challenges found nowhere else. Its sophisticated graphics capabilities, business focus, and Japanese design philosophy provide insights into alternative approaches to personal computing.

## What Makes the FM-7 Special

- **Multi-Plane Graphics**: Three independent graphics planes for complex layered effects
- **High Resolution**: 640×200 with 8 colors, 320×200 with 4096 colors (FM77AV)
- **6809 Power**: Advanced processor with efficient instruction set
- **Business Focus**: Professional capabilities and reliability
- **Japanese Engineering**: Sophisticated design optimized for local market needs

## Curriculum Highlights

*Currently in development*

When launched, the FM-7 curriculum will include:
- Advanced 6809 assembly and F-BASIC programming
- Multi-plane graphics programming and layered visual effects
- Sound synthesis from PSG to FM synthesis (FM77AV)
- Business application development techniques
- Complete multimedia applications showcasing all capabilities

## Japanese Computing Legacy

The FM-7 proved that Japanese manufacturers could create technically superior systems tailored for both business and creative applications, influencing later Japanese computer designs and establishing sophisticated graphics programming standards.

Check back soon for the complete FM-7 curriculum!