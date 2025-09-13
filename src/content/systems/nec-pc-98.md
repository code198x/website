---
name: "PC-9801"
full_name: "NEC PC-9801"
slug: "nec-pc-98"
manufacturer: "NEC Corporation"
model_number: "PC-9801"
alternative_names: ["PC-98", "PC-9801 series"]

# Hardware specifications
cpu: "Intel 8086 (5MHz) / later models up to Pentium"
cpu_details:
  architecture: "16-bit"
  instruction_set: "x86"
  addressing_modes: ["Register", "Immediate", "Direct", "Indirect", "Indexed"]
  registers: "General-purpose: AX, BX, CX, DX; Index: SI, DI; Pointer: SP, BP; Segment: CS, DS, ES, SS"

clock_speed: "5 MHz (8086) to 133 MHz (Pentium)"
ram: "128KB to 32MB (model dependent)"
ram_details:
  user_available: "Varies by model (128KB base to 32MB)"
  video_ram: "512KB VRAM (typical)"
  expansion_options: ["Memory expansion cards", "EMS/XMS support"]

rom: "BIOS and system ROM"
rom_contents: ["PC-98 BIOS", "N88-BASIC", "Character ROM", "Font ROM"]

# Graphics capabilities
video:
  processor: "Custom graphics chips (GDC μPD7220)"
  resolution: "640x400 (16 colors), higher resolutions on later models"
  colors: "16 colors from 4096 palette"
  display_modes: ["Text mode (80×25/80×20)", "Graphics mode (640×400)", "High-resolution modes"]
  hardware_scrolling: true
  raster_interrupts: true

# Audio capabilities
audio:
  chip: "Beep + YM2203/YM2608 FM (26 voices)"
  channels: 15
  features: ["FM synthesis", "SSG", "ADPCM", "CD audio"]
  sample_playback: true
  synthesis_types: ["FM", "PSG", "ADPCM"]

# Storage and I/O
storage: ['5.25" floppy disk', '3.5" floppy disk', "Hard disk", "CD-ROM"]
storage_details:
  built_in: ["Two floppy drives (typical)"]
  expansion: ["SCSI hard drives", "CD-ROM drives"]
  typical_capacity:
    floppy: "720KB to 1.44MB"

io_ports: ["Serial ports", "Parallel port", "Mouse port", "Joystick ports"]
expansion_options: ["C-Bus expansion slots", "Memory cards", "Sound cards"]

# Commercial information
price_at_launch:
  global: "¥298,000 JPY (1982)"

release_date:
  global: 1982-10-01T00:00:00Z

discontinued: 2000-01-01T00:00:00Z
production_run: "1982-2000"
country_of_origin: "Japan"

# Software ecosystem
notable_software:
  - name: "Touhou series (PC-98 era)"
    type: "Bullet Hell Shooter"
    year: 1996
    developer: "ZUN"
    publisher: "ZUN"
    significance: "Legendary bullet-hell shooter series"
  - name: "Policenauts"
    type: "Adventure"
    year: 1994
    developer: "Konami"
    publisher: "Konami"
    significance: "Kojima's space detective thriller"
  - name: "YU-NO"
    type: "Visual Novel"
    year: 1996
    developer: "ELF"
    publisher: "ELF"
    significance: "Time-travel narrative masterpiece"
  - name: "Rance series"
    type: "RPG"
    year: 1989
    developer: "AliceSoft"
    publisher: "AliceSoft"
    significance: "Long-running RPG series"

# Media
description: "The NEC PC-9801, launched in 1982, was the foundation of Japan's PC gaming culture for over two decades, dominating the Japanese market and producing some of the most innovative games ever made."

# Platform Classification
medal_tier: "gold"
total_lessons: 256
total_games: 20
estimated_duration: "2-4 months"
cpu_architecture: "x86"
difficulty_level: "advanced"
status: "planned"
architecture_family: "x86"
recommended_next: ["ibm-pc", "sharp-x68000"]

# Metadata
order: 27
---

# NEC PC-9801: Japan's PC Gaming Powerhouse

_Planned System - 256 Lessons_

The NEC PC-9801, launched in 1982, wasn't just a computer—it was the foundation of Japan's PC gaming culture for over two decades. While the rest of the world moved through various PC standards, Japan remained loyal to the PC-98 family, creating a unique ecosystem that produced some of the most innovative and influential games ever made.

## The Japanese PC Gaming Empire

The PC-98 achieved something remarkable: it dominated a national market so completely that Japanese PC gaming evolved in almost complete isolation from the West. This created a unique gaming culture characterized by:

- **Visual novels**: The PC-98 perfected this uniquely Japanese art form
- **Adult gaming**: A mature market that pushed creative boundaries
- **Indie doujin culture**: Amateur developers creating commercial-quality games
- **Technical innovation**: Squeezing incredible performance from modest hardware

## Why PC-98 Programming Matters

Learning PC-98 development teaches you:

### x86 Assembly Mastery

- **8086 through Pentium**: Experience the evolution of x86 architecture
- **Real mode programming**: Understand how PCs actually worked
- **Memory management**: Segmented memory, EMS, and XMS techniques
- **Hardware interface**: Direct port I/O and interrupt handling

### Advanced Graphics Programming

- **High-resolution displays**: 640x400 and higher resolutions
- **Palette management**: Working with 16 colors from 4096
- **Sprite systems**: Hardware and software sprite techniques
- **Animation**: Smooth animation in high-resolution modes

### Sound Programming Excellence

- **FM synthesis mastery**: The YM2608 OPNA chip with 15 FM + 3 SSG channels
- **CD audio integration**: Early multimedia programming
- **Sound effects**: Advanced synthesis techniques
- **Music composition**: Understanding how game music evolved

## What You'll Master

Your PC-98 journey spans 256 lessons across 2 phases, covering the essential techniques that made this platform legendary:

### Phase 1: x86 Foundations & Graphics (128 lessons)

- 8086 instruction set and programming model
- Segmented memory management
- Japanese text encoding (Shift-JIS)
- High-resolution sprite programming
- Advanced palette techniques

### Phase 2: Sound & Game Systems (128 lessons)

- FM synthesis programming
- CD-ROM audio integration
- Visual novel engines
- RPG battle systems
- Shooting game frameworks

## Cultural Impact

The PC-98's influence on Japanese gaming culture cannot be overstated:

- **Market Dominance**: Over 60% market share in Japan for nearly 20 years
- **Developer Training Ground**: Most famous Japanese PC developers started here
- **Genre Evolution**: Visual novels, bullet-hell shooters, and life sims perfected
- **Technical Standards**: Established Japanese PC gaming conventions

## Why This Platform Matters Today

Modern indie developers often draw inspiration from PC-98 games:

- **Pixel art mastery**: The high-resolution aesthetic influences modern games
- **Sound design**: FM synthesis techniques still used in chiptune music
- **Narrative structure**: Visual novel conventions established here
- **Technical creativity**: Optimization techniques applicable to any platform

**Ready to master the platform that defined Japanese PC gaming?** The PC-98 offers 256 lessons in technical excellence, artistic vision, and cultural understanding that will transform your approach to game development.
