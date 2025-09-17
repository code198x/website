---
name: "Apple IIgs"
full_name: "Apple IIgs"
manufacturer: "Apple Computer"
model_number: "A2S6000"
alternative_names: ["IIgs", "Apple //gs"]

# Hardware specifications
cpu: "65C816"
cpu_details:
  architecture: "8/16-bit"
  instruction_set: "WDC 65C816"
  addressing_modes: ["6502 modes plus 16-bit extensions"]
  registers: "16-bit accumulator, 16-bit index registers"

clock_speed: "2.8 MHz"
ram: "256KB-8MB"
ram_details:
  user_available: "256KB standard"
  video_ram: "Shared with system RAM"
  expansion_options: ["Up to 8MB"]

rom: "256KB"
rom_contents: ["ROM 01 or ROM 03", "Toolbox"]

# Graphics capabilities
video:
  processor: "VGC"
  resolution: "640×200"
  colors: "4,096 colors"
  display_modes: ["320×200×256", "640×200×16", "Apple II modes"]
  sprites:
    count: 0
    size: "Software sprites only"
    colors_per_sprite: 0
  hardware_scrolling: false
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "Ensoniq 5503 DOC"
  channels: 32
  features: ["32 oscillators", "Wavetable synthesis", "Stereo"]
  sample_playback: true
  synthesis_types: ["Wavetable", "Sample playback"]

# Storage and I/O
storage: ['3.5" floppy', '5.25" floppy', "Hard disk"]
storage_details:
  built_in: ['3.5" 800KB floppy']
  expansion: ['5.25" floppy', "SCSI hard disk"]
  typical_capacity:
    floppy35: "800KB"
    floppy525: "140KB"

io_ports: ["ADB", "Serial", "SCSI", "Composite", "RGB"]
expansion_options: ["Memory cards", "Accelerators", "SCSI cards"]

# Commercial information
release_date:
  global: 1986-09-15T00:00:00Z

country_of_origin: "United States"
operating_system: "ProDOS 16 / GS/OS"
programming_languages: ["65816 Assembly", "ORCA/M", "ORCA/C", "AppleSoft BASIC"]

# Target market and positioning
target_market: ["Education", "Home users", "Apple II enthusiasts"]
market_positioning: "The Apple II forever"
competition: ["Amiga", "Atari ST", "IBM PC"]

# Educational relevance
learning_advantages: ["65816 programming", "Ensoniq sound", "GUI development"]
common_beginner_projects: ["Super hi-res graphics", "Wavetable music", "Desktop applications"]

# Modern preservation and emulation
emulated: true
emulators:
  - name: "KEGS"
    platform: "Windows, macOS, Linux"
    accuracy: "cycle_accurate"
  - name: "GSplus"
    platform: "Windows, macOS, Linux"
    accuracy: "high"

preservation_status: "excellent"
hardware_availability: "available"

# Media
description: "The 16-bit Apple II that brought stunning graphics and sound while maintaining perfect backward compatibility."

# Platform Classification
medal_tier: "silver"
total_lessons: 256
total_games: 2
estimated_duration: "4-6 months"
cpu_architecture: "65816"
difficulty_level: "intermediate"
status: "vault"
order: 23
---

# Apple IIgs

_Coming Soon_

The Apple IIgs was Apple's love letter to the Apple II community - a 16-bit powerhouse that maintained perfect backward compatibility while adding stunning graphics and revolutionary sound. Though Apple deliberately limited it to avoid competing with the Macintosh, the IIgs remains beloved.

## Why Learn IIgs Programming?

The 65816 processor bridges 8-bit and 16-bit programming, making it perfect for those moving from 6502 systems. The Ensoniq sound chip and Super Hi-Res graphics offer capabilities that rival the Amiga and ST.

## What Makes the IIgs Special

- **65816 Power**: 16-bit extension of the beloved 6502
- **Ensoniq Sound**: 32-voice wavetable synthesis
- **Super Hi-Res**: 4,096 colors from a palette of 4,096
- **Apple II Forever**: 100% backward compatible

## Curriculum Highlights

_Currently in development_

When launched, the IIgs curriculum will include:

- 65816 assembly with 16-bit operations
- VGC graphics and palette cycling
- Ensoniq DOC programming
- GS/OS and Toolbox programming
- 2 complete projects

## The IIgs Legacy

The IIgs proved that the Apple II architecture could evolve into the 16-bit era. Despite Apple's neglect in favor of the Macintosh, a devoted community kept it alive with incredible software that pushed its limits. It remains the ultimate Apple II.

Check back soon for the complete Apple IIgs curriculum!
