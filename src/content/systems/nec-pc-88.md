---
name: "PC-8801"
full_name: "NEC PC-8801"
slug: "nec-pc-88"
manufacturer: "NEC Corporation"
model_number: "PC-8801"
alternative_names: ["PC-88", "PC-8801 series"]

# Hardware specifications
cpu: "Zilog Z80A"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Z80"
  addressing_modes: ["Register", "Immediate", "Direct", "Indirect", "Indexed", "Relative"]
  registers: "8 general-purpose registers (A, B, C, D, E, H, L), Index registers (IX, IY), Stack pointer (SP)"

clock_speed: "4 MHz"
ram: "64KB (expandable to 512KB)"
ram_details:
  user_available: "64KB base system"
  video_ram: "48KB VRAM"
  expansion_options: ["Memory expansion to 512KB"]

rom: "32KB ROM"
rom_contents: ["N88-BASIC", "System ROM", "Character ROM", "Font ROM"]

# Graphics capabilities
video:
  processor: "Custom graphics controller"
  resolution: "640x200 (8 colors), 640x400 (monochrome)"
  colors: "8 colors"
  display_modes:
    ["Text mode (80×25/80×20)", "Graphics mode (640×200)", "High-resolution mono (640×400)"]
  hardware_scrolling: true
  raster_interrupts: false

# Audio capabilities
audio:
  chip: "Beep + AY-3-8910 PSG (FM optional)"
  channels: 3
  features: ["PSG sound", "Beeper", "FM synthesis (optional)"]
  sample_playback: false
  synthesis_types: ["PSG", "FM"]

# Storage and I/O
storage: ['5.25" floppy disk', "Cassette tape"]
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Floppy disk drives"]
  typical_capacity:
    cassette: "Up to 500KB"
    floppy: "320KB to 720KB"

io_ports: ["Serial port", "Parallel port", "Joystick ports", "Expansion bus"]
expansion_options: ["Expansion slots", "Memory cards", "Sound cards"]

# Commercial information
price_at_launch:
  global: "¥168,000 JPY (1981)"

release_date:
  global: 1981-09-01T00:00:00Z

discontinued: 1989-01-01T00:00:00Z
production_run: "1981-1989"
country_of_origin: "Japan"

# Software ecosystem
notable_software:
  - name: "Hydlide"
    type: "Action RPG"
    year: 1984
    developer: "T&E Soft"
    publisher: "T&E Soft"
    significance: "First action-RPG, inspired Zelda"
  - name: "The Black Onyx"
    type: "RPG"
    year: 1984
    developer: "Bullet-Proof Software"
    publisher: "Bullet-Proof Software"
    significance: "First true JRPG with party-based combat"
  - name: "Dragon Slayer"
    type: "RPG"
    year: 1984
    developer: "Falcom"
    publisher: "Falcom"
    significance: "Early dungeon crawler by Falcom"
  - name: "Snatcher"
    type: "Adventure"
    year: 1988
    developer: "Konami"
    publisher: "Konami"
    significance: "Hideo Kojima's cyberpunk masterpiece"
  - name: "Xanadu"
    type: "Action RPG"
    year: 1985
    developer: "Falcom"
    publisher: "Falcom"
    significance: "Action-RPG masterpiece with incredible depth"

# Media
description: "The NEC PC-8801, launched in 1981, stands as one of the most influential computers in Japanese gaming history. This Z80-based machine became the platform where many legendary game developers cut their teeth, creating genres and franchises that would define Japanese gaming for decades to come."

# Platform Classification
medal_tier: "gold"
total_lessons: 0
total_games: 15
estimated_duration: "1-3 months"
cpu_architecture: "Z80"
difficulty_level: "intermediate"
status: "planned"
architecture_family: "Z80"
recommended_next: ["nec-pc-98", "msx", "amstrad-cpc"]

# Metadata
order: 28
---

# NEC PC-8801: The Birthplace of Japanese Gaming

_Planned System - 128 Lessons_

The NEC PC-8801, launched in 1981, stands as one of the most influential computers in Japanese gaming history. This Z80-based machine became the platform where many legendary game developers cut their teeth, creating genres and franchises that would define Japanese gaming for decades to come.

## Why the PC-88 Matters

The PC-88 was where Japanese computer gaming truly began. While Western computers focused on business applications, the PC-88 embraced gaming from the start, becoming the birthplace of:

- **Japanese RPGs**: The first true JRPGs were born here
- **Visual novels**: The foundation of this uniquely Japanese genre
- **Adventure games**: Rich storytelling traditions that continue today
- **Indie development**: Many famous developers started as PC-88 hobbyists

## Technical Excellence

### Z80 Mastery

- **4MHz Z80A processor**: Learn assembly on the same chip that powered countless classics
- **Bank-switched memory**: Master complex memory management techniques
- **Hardware sprites**: Early sprite-based graphics programming
- **Sound synthesis**: From simple beeps to complex PSG programming

### Graphics Innovation

- **High-resolution modes**: 640x400 monochrome for detailed artwork
- **Color graphics**: 640x200 with 8 colors from a larger palette
- **Text modes**: Support for Japanese characters (JIS encoding)
- **Hardware scrolling**: Smooth scrolling techniques for action games

## Gaming Legends Born Here

The PC-88 hosted the early works of gaming legends:

- **Yuji Horii**: Created the first JRPGs that evolved into Dragon Quest
- **Yoshio Kiya**: Pioneered the action-RPG with Hydlide
- **Hideo Kojima**: Released early adventure games before Metal Gear
- **Falcom**: Established as Japan's premier RPG developer

## What You'll Learn

Your PC-88 journey spans 128 lessons across 2 phases:

### Phase 1: Z80 Foundations (64 lessons)

Master the Z80 processor that powered Japanese gaming's golden age:

- Z80 instruction set and architecture
- Memory banking and management
- Japanese character encoding
- Basic graphics programming

### Phase 2: Game Development (64 lessons)

Create the visual and audio experiences that defined PC-88 games:

- Pixel-perfect sprite graphics
- Tile-based backgrounds
- PSG sound synthesis and music
- Adventure game engines
- Turn-based RPG systems

## Historical Impact

The PC-88's influence extends far beyond its sales numbers:

- **Genre Creation**: JRPGs, visual novels, and many adventure game conventions
- **Development Culture**: Established Japan's unique approach to game development
- **Technical Innovation**: Pushed 8-bit hardware to create experiences rivaling 16-bit systems
- **Community Building**: Fostered a thriving community of indie developers

## Notable Software Library

### RPGs That Changed Everything

- **Hydlide (1984)**: The first action-RPG, inspiring Zelda
- **The Black Onyx (1984)**: First true JRPG with party-based combat
- **Dragon Slayer series**: Early dungeon crawlers by Falcom
- **Xanadu (1985)**: Action-RPG masterpiece with incredible depth

### Adventure Classics

- **Snatcher (1988)**: Hideo Kojima's cyberpunk masterpiece
- **Mystery House**: Japanese adventure gaming begins
- **Early visual novels**: Foundation of a uniquely Japanese genre

## Learning Journey

Starting with Z80 assembly basics, you'll progress through increasingly complex projects that mirror the evolution of Japanese gaming. Each phase builds upon the last, teaching not just programming techniques but the creative thinking that made PC-88 games legendary.

From simple text adventures to complex RPGs, you'll experience the range of what made the PC-88 special. By the end, you'll understand not just how to program the hardware, but why Japanese gaming developed its unique character.

**Ready to discover where Japanese gaming truly began?** The PC-88 awaits, with 128 lessons that will transform you into a master of retro Japanese game development.
