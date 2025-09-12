---
name: "Apple II"
full_name: "Apple II"
manufacturer: "Apple Computer"
model_number: "A2S1"
alternative_names: ["Apple ][", "Apple //"]

# Hardware specifications
cpu: "6502"
cpu_details:
  architecture: "8-bit"
  instruction_set: "MOS Technology 6502"
  addressing_modes: ["Immediate", "Zero Page", "Absolute", "Indexed", "Indirect"]
  registers: "A (Accumulator), X, Y (Index), S (Stack), P (Status)"

clock_speed: "1.023 MHz"
ram: "48KB"
ram_details:
  user_available: "48KB typical"
  video_ram: "Shared with system RAM"
  expansion_options: ["Up to 64KB", "128KB with Language Card"]

rom: "12KB"
rom_contents: ["Integer BASIC", "Monitor", "Sweet16"]

# Graphics capabilities
video:
  processor: "Wozniak's custom logic"
  resolution: "280×192 high-res"
  colors: "6 colors"
  display_modes: ["Text 40×24", "Low-res 40×48", "High-res 280×192"]
  sprites:
    count: 0
    size: "N/A"
    colors_per_sprite: 0
  hardware_scrolling: false
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "Built-in speaker"
  channels: 1
  features: ["Click speaker", "Software-controlled"]
  sample_playback: false
  synthesis_types: ["1-bit audio"]

# Storage and I/O
storage: ["Cassette tape", "Disk II floppy"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Disk II (140KB)", "Hard drives"]
  typical_capacity:
    cassette: "Variable"
    floppy: "140KB"

io_ports: ["8 expansion slots", "Game port", "Cassette ports"]
expansion_options: ["Disk controller", "80-column card", "Z80 SoftCard"]

# Commercial information
release_date:
  global: 1977-06-10T00:00:00Z

country_of_origin: "United States"
operating_system: "Apple DOS"
programming_languages: ["6502 Assembly", "Integer BASIC", "Applesoft BASIC"]

# Target market and positioning
target_market: ["Home users", "Education", "Business"]
market_positioning: "The computer for the rest of us"
competition: ["TRS-80", "Commodore PET", "Atari 800"]

# Educational relevance
learning_advantages: ["Simple architecture", "Well-documented", "Historical importance"]
common_beginner_projects: ["Graphics demos", "Simple games", "Sound experiments"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "AppleWin"
    platform: "Windows"
    accuracy: "cycle_accurate"
  - name: "OpenEmulator"
    platform: "macOS"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The computer that launched the personal computer revolution and made computing accessible to everyone."
image: "/images/systems/apple-ii.jpg"

# Platform Classification
medal_tier: "gold"
total_lessons: 512
total_games: 4
estimated_duration: "6-9 months"
cpu_architecture: "6502"
difficulty_level: "beginner"
status: "planned"
order: 10
---

# Apple II

*Coming Soon*

The Apple II wasn't just a computer - it was the spark that ignited the personal computer revolution. Steve Wozniak's elegant design brought color graphics, sound, and expandability to the masses, while VisiCalc turned it into the first must-have business machine.

## Why Learn Apple II Programming?

The Apple II's clean 6502 architecture and Wozniak's clever tricks (like artifact color) make it an ideal platform for understanding fundamental computing concepts. Its influence on the industry cannot be overstated.

## What Makes the Apple II Special

- **Wozniak's Genius**: Elegant hacks that defined efficient design
- **Open Architecture**: 8 expansion slots encouraged innovation
- **Color Graphics**: First affordable color computer
- **VisiCalc**: The killer app that sold computers to businesses

## Curriculum Highlights

*Currently in development*

When launched, the Apple II curriculum will include:
- 6502 assembly fundamentals
- Wozniak's graphics tricks and artifact color
- Disk II programming and copy protection
- Sound generation through the click speaker
- 4 complete projects showcasing Apple II capabilities

## The Apple II Legacy

The Apple II taught us that computers could be both powerful and approachable. Its open architecture and extensive documentation created a generation of programmers who went on to build the modern tech industry.

Check back soon for the complete Apple II curriculum!