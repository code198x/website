---
name: "Microbee"
full_name: "Applied Technology Microbee"
manufacturer: "Applied Technology"
model_number: "32IC"
alternative_names: ["Microbee 16S", "Microbee 64P", "Microbee 128P", "Microbee 256TC"]

# Hardware specifications
cpu: "Z80A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Zilog Z80A"
  addressing_modes: ["Immediate", "Register", "Indexed", "Indirect", "Relative"]
  registers: "A, B, C, D, E, H, L, IX, IY, SP, PC"

clock_speed: "2 MHz"
ram: "32KB-128KB"
ram_details:
  user_available: "32KB base"
  video_ram: "Shared with system RAM"
  expansion_options: ["Memory expansion to 128KB"]

rom: "18KB"
rom_contents: ["MicroWorld BASIC", "System routines", "Character ROM"]

# Graphics capabilities
video:
  processor: "Motorola 6845 CRTC"
  resolution: "512×256"
  colors: "8 colors"
  display_modes:
    ["80×25 text", "64×16 chunky graphics", "512×256 high resolution", "Mixed text/graphics"]
  sprites:
    count: 0
    size: "Software only"
    colors_per_sprite: 0
  hardware_scrolling: true
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "Speaker + tone generator"
  channels: 1
  features:
    [
      "Square wave generation",
      "Programmable frequency",
      "Sound effects",
      "Cassette interface audio",
    ]
  sample_playback: false
  synthesis_types: ["Square wave"]

# Storage and I/O
storage: ["Cassette tape", '5.25" floppy', "ROM cartridge"]
storage_details:
  built_in: ["Cassette interface (1200 baud)"]
  expansion: ["Floppy disk drives"]
  typical_capacity:
    cassette: "Variable"
    floppy: "180KB-360KB"

io_ports:
  [
    "Full QWERTY keyboard",
    "Function keys F1-F12",
    "Numeric keypad",
    "Parallel printer",
    "Serial RS-232",
    "Light pen",
  ]
expansion_options: ["Floppy controllers", "Memory expansion", "Interface cards"]

# Commercial information
release_date:
  global: 1982-09-01T00:00:00Z

country_of_origin: "Australia"
operating_system: "MicroWorld BASIC + CP/M"
programming_languages: ["BASIC", "Logo", "Z80 Assembly", "CP/M applications"]

# Target market and positioning
target_market: ["Education", "Schools", "Home learning", "Australian/NZ markets"]
market_positioning: "Educational computer with professional features"
competition: ["Apple II", "Commodore 64", "BBC Micro"]

# Educational relevance
learning_advantages:
  [
    "Educational programming focus",
    "Multiple built-in languages",
    "Professional keyboard",
    "Australian computing history",
  ]
common_beginner_projects:
  ["Educational games", "BASIC programming", "Logo turtle graphics", "Database applications"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "ubee512"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "high"

preservation_status: "good"
hardware_availability: "rare"

# Media
description: "Australia's educational computer champion with professional features and strong BASIC programming focus."

# Platform Classification
medal_tier: "bronze"
total_lessons: 512
total_games: 8
estimated_duration: "2-4 weeks"
cpu_architecture: "Z80"
difficulty_level: "intermediate"
status: "planned"
order: 62
---

# Applied Technology Microbee

_Coming Soon_

The Microbee stands as Australia's most successful home computer, designed specifically for educational markets with professional-grade features and extensive programming capabilities. This Z80-based system demonstrated how regional manufacturers could create computers perfectly tailored to local educational needs.

## Why Learn Microbee Programming?

The Microbee's educational focus and multi-language environment (BASIC, Logo, Assembly) provide unique insights into educational computing design. Its professional keyboard, comprehensive documentation, and classroom-oriented features offer lessons in creating technology specifically for learning environments.

## What Makes the Microbee Special

- **Educational Design**: Built from ground up for schools and learning
- **Professional Keyboard**: Full QWERTY with function keys and numeric keypad
- **Multiple Languages**: BASIC, Logo, and Assembly in ROM
- **Australian Innovation**: Local design for regional educational needs
- **Comprehensive Documentation**: Professional manuals and educational resources

## Curriculum Highlights

_Currently in development_

When launched, the Microbee curriculum will include:

- Enhanced BASIC programming for educational applications
- Logo turtle graphics programming and visual learning concepts
- Z80 assembly language in educational context
- Educational software design principles and methodologies
- Complete educational applications showcasing multi-language integration

## Educational Computing Legacy

The Microbee introduced programming to thousands of Australian students, established computer labs in schools nationwide, and proved that regional manufacturers could compete successfully by focusing on specific market needs and building strong local communities.

Check back soon for the complete Microbee curriculum!
