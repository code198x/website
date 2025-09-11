---
name: "Commodore 64"
slug: "commodore-64"
manufacturer: "Commodore Business Machines (CBM)"
model_number: "C64"
medal_tier: "platinum"
total_lessons: 4096
total_games: 35
estimated_duration: "6-12 months"
cpu_architecture: "6502"
difficulty_level: "beginner"
architecture_family: "6502"
recommended_next: ["apple-ii", "nintendo-entertainment-system", "atari-800"]
cpu: "MOS Technology 6510 (based on 6502)"
clock_speed: "0.985 MHz (PAL) / 1.023 MHz (NTSC)"
ram: "64 KB"
rom: "20 KB (including BASIC 2.0, KERNAL, and character ROM)"
video:
  processor: "VIC-II (Video Interface Chip II)"
  resolution: "320×200 pixels (high-resolution mode), 160×200 pixels (multicolor mode)"
  colors: "16 colors"
  display_modes:
    - "Text mode (40×25 characters)"
    - "High-resolution bitmap (320×200, 2 colors per 8×8 pixel block)"
    - "Multicolor bitmap (160×200, 4 colors per 4×8 pixel block)"
    - "Extended background colour (40×25 text with 4 background colors)"
    - "Sprite graphics (hardware-accelerated movable object blocks)"
audio:
  chip: "SID (Sound Interface Device) 6581/8580"
  channels: 3
  features:
    - "4 waveforms (triangle, sawtooth, pulse, noise)"
    - "ADSR (Attack, Decay, Sustain, Release) envelope generator"
    - "Programmable filters (low-pass, band-pass, high-pass)"
    - "Ring modulation"
    - "Oscillator synchronization"
storage:
  - "Datasette (cassette tape, 50 KB capacity at 300 baud)"
  - "5.25\" floppy disk drive (Commodore 1541, 170 KB capacity)"
  - "Later: 3.5\" floppy disk drives (1581, 800 KB capacity)"
io_ports:
  - "2 × CIA 6526 controller ports (joystick/paddle/mouse)"
  - "Serial port (Commodore IEC bus for peripherals)"
  - "Cartridge port (ROM expansion)"
  - "User port (parallel I/O)"
  - "RF output"
  - "Composite video"
  - "Audio output"
price_at_launch:
  global: "$595 USD (1982)"
  countries:
    - country: "United States"
      price: "595"
      currency: "USD"
    - country: "United Kingdom"  
      price: "399"
      currency: "GBP"
release_date:
  global: 1982-08-01
  countries:
    - country: "United States"
      date: 1982-08-01
    - country: "United Kingdom"
      date: 1982-10-01
discontinued: 1994-04-01
units_sold: "12.5-17 million"
country_of_origin: "United States"
operating_system: "Built-in KERNAL and BASIC interpreter"
emulated: true
emulators:
  - name: "VICE"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "CCS64"
    platform: "Windows"
    accuracy: "high"
  - name: "Frodo"
    platform: "Multi-platform"
    accuracy: "good"
  - name: "C64 Forever"
    platform: "Windows"
    accuracy: "high"
historical_significance: "The C64 is the highest-selling single computer model of all time, introducing millions to computing and gaming. Its SID chip revolutionized computer audio, and its accessible BASIC programming language inspired a generation of programmers."
description: "The world's best-selling single computer model, featuring the legendary SID sound chip and versatile graphics capabilities."
image: "/images/systems/commodore-64.jpg"
order: 1
---

The **Commodore 64** was the most successful home computer of all time, with sales between 12.5 and 17 million units worldwide. Released in August 1982, it dominated the home computing market throughout the 1980s with its powerful graphics and sound capabilities, affordable price point, and extensive software library.

The C64's **MOS Technology 6510** processor, running at approximately 1 MHz, was paired with custom chips that gave it capabilities far beyond its modest specifications. The **VIC-II** graphics chip provided colorful sprites and bitmap graphics, while the legendary **SID** sound chip delivered three-channel audio with features that wouldn't be seen in consumer PCs for years to come.

## Key Features

- **64 KB of RAM** - More memory than most computers of its era
- **Advanced Graphics** - 16 colors, sprites, and multiple display modes
- **Revolutionary Sound** - The SID chip became legendary among musicians and game developers
- **Extensive Software Library** - Over 10,000 commercial titles released
- **Built-in BASIC** - Commodore BASIC 2.0 for learning programming

## Cultural Impact

The Commodore 64 was more than just a computer—it was a cultural phenomenon. It introduced an entire generation to computing, gaming, and programming. Many of today's software developers got their start typing BASIC programs from magazines into their C64s.

The machine's combination of affordability and capability made it accessible to middle-class families worldwide, democratizing access to computing technology in a way that had never been possible before.

## Why Learn C64 Programming Today?

Programming the Commodore 64 teaches fundamental concepts that remain relevant in modern software development:

- **Memory management** - Working within tight constraints
- **Performance optimisation** - Making every byte and cycle count  
- **Hardware interaction** - Direct programming of chips and registers
- **Assembly language** - Understanding how computers work at the lowest level
- **Creative problem solving** - Achieving impressive results with limited resources

The skills you learn programming the C64 will make you a better programmer on any platform.