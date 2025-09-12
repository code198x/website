---
name: "Atari ST"
full_name: "Atari ST"
manufacturer: "Atari Corporation"
model_number: "520ST/1040ST"
alternative_names: ["Sixteen/Thirty-two", "Jackintosh"]

# Hardware specifications
cpu: "68000"
cpu_details:
  architecture: "16/32-bit"
  instruction_set: "Motorola 68000"
  addressing_modes: ["Register Direct", "Address Register Indirect", "Immediate", "Absolute", "PC Relative"]
  registers: "8 data registers (D0-D7), 8 address registers (A0-A7)"

clock_speed: "8 MHz"
ram: "512KB-4MB"
ram_details:
  user_available: "512KB-4MB"
  video_ram: "Shared with system RAM"
  expansion_options: ["RAM upgrades to 4MB"]

rom: "192KB TOS"
rom_contents: ["TOS", "GEM Desktop"]

# Graphics capabilities
video:
  processor: "Shifter"
  resolution: "320×200 to 640×400"
  colors: "512 color palette"
  display_modes: ["Low res 320×200 16 colors", "Medium res 640×200 4 colors", "High res 640×400 mono"]
  sprites:
    count: 0
    size: "Software sprites only"
    colors_per_sprite: 0
  hardware_scrolling: false
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "YM2149"
  channels: 3
  features: ["Square waves", "Noise", "Envelope control", "Built-in MIDI"]
  sample_playback: true
  synthesis_types: ["PSG", "DMA sound (STe)"]

# Storage and I/O
storage: ["3.5\" floppy", "Hard disk"]
storage_details:
  built_in: ["3.5\" floppy drive"]
  expansion: ["Hard disk", "External floppy"]
  typical_capacity:
    floppy: "720KB-1.44MB"

io_ports: ["MIDI In/Out", "Serial", "Parallel", "Floppy", "Cartridge", "Mouse/Joystick"]
expansion_options: ["RAM expansion", "Hard disk", "Laser printer"]

# Commercial information
release_date:
  global: 1985-06-01T00:00:00Z

country_of_origin: "United States"
operating_system: "TOS/GEM"
programming_languages: ["68000 Assembly", "C", "GFA BASIC"]

# Target market and positioning
target_market: ["Musicians", "Desktop publishing", "Gaming", "Business"]
market_positioning: "Power without the price"
competition: ["Commodore Amiga", "Apple Macintosh", "IBM PC"]

# Educational relevance
learning_advantages: ["68000 programming", "MIDI music", "GEM programming"]
common_beginner_projects: ["GEM applications", "MIDI sequencers", "Demo effects"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "Hatari"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"
  - name: "STeem"
    platform: "Windows, Linux"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The musician's computer that brought 16-bit power and built-in MIDI to the masses."
image: "/images/systems/atari-st.jpg"

# Platform Classification
medal_tier: "silver"
total_lessons: 256
total_games: 2
estimated_duration: "4-6 months"
cpu_architecture: "68000"
difficulty_level: "intermediate"
status: "planned"
order: 18
---

# Atari ST

*Coming Soon*

The Atari ST was Jack Tramiel's revenge on Commodore. With a 68000 processor, built-in MIDI ports, and an aggressive price, it became the computer of choice for musicians and desktop publishers who couldn't afford a Mac.

## Why Learn Atari ST Programming?

The ST offers clean 68000 programming without the complexity of the Amiga's custom chips. Its GEM desktop environment and MIDI capabilities make it perfect for learning GUI and music programming.

## What Makes the Atari ST Special

- **Built-in MIDI**: Every ST had MIDI ports standard
- **GEM Desktop**: Graphical interface from day one
- **68000 at 8MHz**: Faster than the original Mac
- **Tramiel's Vision**: "Power without the price"

## Curriculum Highlights

*Currently in development*

When launched, the Atari ST curriculum will include:
- 68000 assembly programming
- GEM application development
- MIDI programming and sequencing
- Demo effects and raster tricks
- 2 complete projects

## The ST Legacy

The Atari ST dominated European music studios throughout the late 80s and early 90s. Cubase, Notator, and other legendary sequencers were born on the ST. Its influence on electronic music production cannot be overstated.

Check back soon for the complete Atari ST curriculum!