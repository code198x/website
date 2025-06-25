---
name: "ZX Spectrum"
slug: "zx-spectrum"
manufacturer: "Sinclair Research"
cpu: "Zilog Z80"
clock_speed: "3.5 MHz"
ram: "16 KB or 48 KB (later models up to 128 KB)"
rom: "16 KB (BASIC interpreter and operating system)"
video:
  resolution: "256×192 pixels"
  colors: "8 colors (plus bright variants = 15 total)"
  display_modes:
    - "Text mode (32×24 characters)"
    - "Bitmap graphics with colour attributes (8×8 pixel blocks)"
audio:
  chip: "Built-in beeper"
  channels: 1
  features:
    - "Square wave generation"
    - "Software-controlled frequency and duration"
storage:
  - "Compact Cassette (audio tape)"
  - "ZX Microdrive (later models)"
  - "3\" floppy disk (with +3 model)"
io_ports:
  - "Membrane keyboard (rubber keys on early models)"
  - "Kempston joystick interface"
  - "Audio in/out (for cassette loading)"
  - "RF output to TV"
  - "RGB output (later models)"
price_at_launch:
  global: "£125 (16K) / £175 (48K) (1982)"
  countries:
    - country: "United Kingdom"
      price: "125"
      currency: "GBP"
release_date:
  global: 1982-04-23
discontinued: 1992-01-01
units_sold: "5+ million"
country_of_origin: "United Kingdom"
operating_system: "Sinclair BASIC"
emulated: true
emulators:
  - name: "Fuse"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "ZEsarUX"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "SpectEmu"
    platform: "macOS"
    accuracy: "high"
  - name: "Retro Virtual Machine"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
variants:
  - name: "ZX Spectrum 16K"
    release_date:
      global: 1982-04-23
    discontinued: 1984-01-01
    differences: "Original model with 16 KB RAM and rubber keyboard"
  - name: "ZX Spectrum 48K"
    release_date:
      global: 1982-04-23
    discontinued: 1987-01-01
    differences: "Expanded RAM version, became the most popular model"
  - name: "ZX Spectrum+"
    release_date:
      global: 1984-06-01
    discontinued: 1986-01-01
    differences: "Improved keyboard with proper keys, same internals as 48K"
  - name: "ZX Spectrum 128"
    release_date:
      global: 1985-09-01
    discontinued: 1987-01-01
    differences: "128KB RAM, improved sound chip (AY-3-8912), built-in tape deck"
historical_significance: "The ZX Spectrum sparked the British games industry and inspired a generation of bedroom coders. Its unique colour system and affordable price made it hugely popular in the UK and Europe."
description: "Britain's most popular home computer, bringing affordable colour computing to millions with its distinctive rubber keyboard."
image: "/images/systems/zx-spectrum.jpg"
order: 2
---

The **ZX Spectrum** was one of the most iconic and influential home computers of the 1980s, particularly in the UK and Europe. Released in April 1982 by Sinclair Research, it offered colour graphics, sound, and a full BASIC interpreter at an incredibly affordable price point.

The Spectrum—affectionately known as the "Speccy"—was instrumental in sparking the British games industry and inspiring a generation of bedroom coders. Its unique **attribute-based colour system** created the distinctive "Spectrum look" that became synonymous with 1980s gaming.

## Key Features

- **Z80 Processor** - The popular 8-bit CPU used in many computers and game consoles
- **Affordable Color Graphics** - 15 colors (8 basic + bright variants)
- **Compact Design** - Small, lightweight, and TV-friendly
- **Massive Software Library** - Over 24,000 titles released
- **Built-in BASIC** - Sinclair BASIC with unique keyword entry system

## The Attribute System

The Spectrum's most distinctive feature was its colour attribute system. Each 8×8 pixel character cell could only display two colors—one foreground and one background—leading to the famous "attribute clash" when graphics didn't align to the 8×8 grid. This limitation became a creative constraint that defined the Spectrum's visual aesthetic.

## Cultural Impact

The ZX Spectrum was more than a computer—it was a cultural phenomenon that defined a generation. Its low cost made it accessible to families across the UK, and its simple BASIC interpreter made programming approachable for young enthusiasts.

Many of today's leading game developers, including the founders of Rare, Codemasters, and countless indie studios, got their start on the Spectrum. The machine's limitations forced creativity and optimisation skills that remain valuable today.

## Why Learn Spectrum Programming Today?

Programming the ZX Spectrum teaches essential skills:

- **Resource constraints** - Working with limited memory and processing power
- **Creative problem solving** - Achieving great results within tight limitations
- **Assembly optimisation** - Making the most of the Z80 processor
- **Graphics programming** - Understanding attribute-based colour systems
- **Sound synthesis** - Creating music and effects with minimal hardware
- **Retro game development** - Learning the foundations of classic game design

The Spectrum's elegant simplicity makes it an perfect platform for understanding the fundamentals of computer graphics, sound, and game programming.