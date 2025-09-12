---
name: "Amiga"
full_name: "Commodore Amiga"
manufacturer: "Commodore"
model_number: "Various (A500, A1000, A2000, A1200, A4000)"
alternative_names: ["Amiga", "Commodore Amiga"]

# Hardware specifications
cpu: "68000"
cpu_details:
  architecture: "16/32-bit"
  instruction_set: "Motorola 68000"
  addressing_modes: ["Register Direct", "Address Register Indirect", "Immediate", "Absolute", "PC Relative"]
  registers: "8 data registers (D0-D7), 8 address registers (A0-A7)"

clock_speed: "7.16 MHz (NTSC) / 7.09 MHz (PAL)"
ram: "512KB (expandable)"
ram_details:
  user_available: "512KB standard"
  video_ram: "Chip RAM shared"
  expansion_options: ["Memory expansions up to 8MB"]

rom: "256KB Kickstart ROM"
rom_contents: ["Operating system", "Libraries", "Workbench"]

# Graphics capabilities
video:
  processor: "Agnus/Denise custom chips"
  resolution: "320×200 to 640×400"
  colors: "4096 color palette"
  display_modes: ["Multiple resolutions", "HAM mode", "Dual playfield"]
  sprites:
    count: 8
    size: "16 pixels wide, arbitrary height"
    colors_per_sprite: 3
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "Paula"
  channels: 4
  features: ["8-bit PCM", "Hardware mixing", "Stereo output"]
  sample_playback: true
  synthesis_types: ["PCM samples"]

# Storage and I/O
storage: ["3.5\" floppy disk", "Hard drive (optional)"]
storage_details:
  built_in: ["3.5\" DD floppy drive"]
  expansion: ["Hard drives", "Additional floppy drives"]
  typical_capacity:
    floppy: "880KB"

io_ports: ["Serial", "Parallel", "Floppy", "RGB video", "Composite", "Audio", "Joystick/Mouse"]
expansion_options: ["Side expansion", "Trapdoor expansion", "Accelerator cards"]

# Commercial information
release_date:
  global: 1987-04-01T00:00:00Z

country_of_origin: "United States"
operating_system: "AmigaOS/Workbench"
programming_languages: ["68000 Assembly", "C", "AmigaBASIC"]

# Target market and positioning
target_market: ["Creative professionals", "Gaming", "Home users"]
market_positioning: "Multimedia computer ahead of its time"
competition: ["Atari ST", "IBM PC", "Apple Macintosh"]

# Educational relevance
learning_advantages: ["Custom chips", "Multitasking OS", "Advanced graphics"]
common_beginner_projects: ["Demos", "Games", "Graphics applications"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "WinUAE"
    platform: "Windows"
    accuracy: "cycle_accurate"
  - name: "FS-UAE"
    platform: "Windows, macOS, Linux"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The multimedia powerhouse that brought arcade-quality graphics and CD-quality sound to home computers."
image: "/images/systems/amiga.jpg"

# Platform Classification
medal_tier: "platinum"
total_lessons: 4096
total_games: 32
estimated_duration: "18-24 months"
cpu_architecture: "68000"
difficulty_level: "advanced"

status: "planned"
order: 4
---

# Commodore Amiga

*Coming Soon*

The Amiga was a quantum leap in home computer technology. With custom chips for graphics and sound, preemptive multitasking, and capabilities that wouldn't become standard on PCs for years, the Amiga was the ultimate creative machine of its era.

## Why Learn Amiga Programming?

The 68000 processor and custom chip architecture offer a completely different programming paradigm from 8-bit systems. The Amiga's Copper, Blitter, and Paula chips enable effects that seemed impossible, teaching advanced concepts in parallel processing and hardware acceleration.

## What Makes the Amiga Special

- **Custom Chips**: Copper (coprocessor), Blitter (graphics), Paula (audio)
- **68000 Power**: True 16/32-bit programming with advanced addressing
- **Multitasking OS**: Preemptive multitasking years before Windows
- **Demo Scene Heritage**: The platform where the demo scene reached artistic heights

## Curriculum Highlights

*Currently in development*

When launched, the Amiga curriculum will include:
- 68000 assembly programming
- Custom chip programming (Copper, Blitter, Paula)
- AmigaOS system programming
- Advanced graphics and audio techniques
- 32 complete projects showcasing Amiga's unique capabilities

## The Amiga Revolution

The Amiga introduced concepts that wouldn't reach mainstream computing for years: hardware acceleration, dedicated audio processing, and true multitasking. Learning Amiga programming provides insights into modern GPU programming and parallel processing.

Check back soon for the complete Amiga curriculum!