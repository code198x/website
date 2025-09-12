---
name: "IBM PC"
full_name: "IBM Personal Computer"
manufacturer: "IBM"
model_number: "5150"
alternative_names: ["IBM 5150", "PC", "PC-DOS"]

# Hardware specifications
cpu: "8088"
cpu_details:
  architecture: "16-bit"
  instruction_set: "Intel 8088 (x86)"
  addressing_modes: ["Register", "Immediate", "Direct", "Indexed", "Based", "Based-Indexed"]
  registers: "AX, BX, CX, DX, SI, DI, BP, SP, CS, DS, ES, SS"

clock_speed: "4.77 MHz"
ram: "16KB-640KB"
ram_details:
  user_available: "16KB-640KB"
  video_ram: "16KB CGA"
  expansion_options: ["Expansion cards"]

rom: "40KB"
rom_contents: ["BIOS", "BASIC"]

# Graphics capabilities
video:
  processor: "CGA/MDA"
  resolution: "640×200"
  colors: "16 colors"
  display_modes: ["Text 80×25", "CGA 320×200×4", "640×200×2"]
  sprites:
    count: 0
    size: "Software only"
    colors_per_sprite: 0
  hardware_scrolling: false
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "PC Speaker"
  channels: 1
  features: ["Beeper", "1-bit audio"]
  sample_playback: false
  synthesis_types: ["Square wave"]

# Storage and I/O
storage: ["5.25\" floppy", "Hard disk"]
storage_details:
  built_in: ["None standard"]
  expansion: ["Floppy controller", "Hard disk controller"]
  typical_capacity:
    floppy: "360KB"
    hard_disk: "10MB"

io_ports: ["Serial", "Parallel", "Keyboard", "Expansion slots"]
expansion_options: ["ISA cards", "Graphics cards", "Sound cards", "Memory"]

# Commercial information
release_date:
  global: 1981-08-12T00:00:00Z

country_of_origin: "United States"
operating_system: "PC-DOS / MS-DOS"
programming_languages: ["8086 Assembly", "BASIC", "C", "Pascal"]

# Target market and positioning
target_market: ["Business", "Professional", "Enterprise"]
market_positioning: "The serious business computer"
competition: ["Apple II", "CP/M systems", "DEC Rainbow"]

# Educational relevance
learning_advantages: ["x86 architecture foundation", "DOS programming", "Hardware interrupts"]
common_beginner_projects: ["DOS utilities", "TSR programs", "Mode 13h graphics"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "DOSBox"
    platform: "Multi-platform"
    accuracy: "high"
  - name: "86Box"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The business computer that established the PC standard and created the modern computing industry."
image: "/images/systems/ibm-pc.jpg"

# Platform Classification
medal_tier: "gold"
total_lessons: 256
total_games: 2
estimated_duration: "4-6 months"
cpu_architecture: "x86"
difficulty_level: "intermediate"
status: "planned"
order: 26
---

# IBM PC

*Coming Soon*

The IBM PC didn't just enter the computer market - it defined it. IBM's decision to use off-the-shelf parts and publish the specifications created the PC-compatible industry that dominates computing today.

## Why Learn IBM PC Programming?

The IBM PC established x86 as the dominant architecture. Understanding DOS, BIOS, interrupts, and early PC hardware provides fundamental knowledge about how modern computers evolved.

## What Makes the IBM PC Special

- **Open Architecture**: Published specs enabled clones
- **Industry Standard**: Created PC compatibility
- **x86 Foundation**: Started the processor lineage in use today
- **Business Focus**: Legitimized personal computers

## Curriculum Highlights

*Currently in development*

When launched, the IBM PC curriculum will include:
- 8086/8088 assembly programming
- DOS interrupt programming
- CGA graphics and Mode 13h
- PC speaker and AdLib sound
- 2 complete DOS applications

## The PC Legacy

The IBM PC's open architecture accidentally created the modern computer industry. While IBM eventually lost control of the standard they created, the PC architecture became the foundation for virtually all modern desktop and laptop computers.

Check back soon for the complete IBM PC curriculum!