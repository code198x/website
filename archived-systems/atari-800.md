---
name: "Atari 800"
slug: "atari-800"
manufacturer: "Atari, Inc."
model_number: "800/800XL/130XE"
medal_tier: "gold"
total_lessons: 2048
total_games: 25
estimated_duration: "3-6 months"
cpu_architecture: "6502"
difficulty_level: "intermediate"
architecture_family: "6502"
prerequisite_platforms: ["atari-2600"]
recommended_next: ["atari-st", "apple-ii"]
cpu: "MOS Technology 6502C"
clock_speed: "1.79 MHz"
ram: "8-48 KB base, expandable to 64 KB (800), 64-128 KB (800XL/130XE)"
rom: "10 KB (OS + BASIC), expandable with cartridges"
video:
  processor: "ANTIC + GTIA custom chips"
  resolution: "320×192 pixels (maximum), various text and graphics modes"
  colors: "128 colors (GTIA), 16 colors on-screen simultaneously"
  display_modes:
    - "Text modes: 40×24, 20×24, 20×12 characters"
    - "Graphics modes: 320×192 (2 colors), 160×192 (4 colors)"
    - "Multi-color modes: 80×192 (16 colors), 80×48 (16 colors)"
    - "Player/Missile Graphics (hardware sprites)"
    - "Display List-driven graphics with mixed modes"
  sprites:
    count: 5
    size: "8 pixels wide, variable height"
    colors_per_sprite: 4
  hardware_scrolling: true
  raster_interrupts: true
audio:
  chip: "POKEY"
  channels: 4
  features:
    - "4 square wave channels"
    - "Noise generation"
    - "High-pass filter"
    - "Frequency and volume control"
    - "Two-tone mode (combining channels)"
    - "Keyboard scanning and serial I/O"
  synthesis_types: ["Square Wave", "Noise"]
storage:
  - "Program cartridges (8-16 KB typically)"
  - "Cassette tapes (600 baud)"
  - "Floppy disks (90 KB single density, 180 KB double density)"
  - "Hard drives (later third-party solutions)"
io_ports:
  - "4 × joystick/paddle ports"
  - "2 × cartridge slots (800 only)"
  - "Serial I/O port (850 interface)"
  - "Parallel printer port"
  - "Monitor output (5-pin DIN)"
  - "TV output (RF)"
  - "Cassette recorder interface"
expansion_options:
  - "Memory expansion modules"
  - "850 Serial/Parallel Interface"
  - "Disk drives and controllers"
  - "Modems and network interfaces"
price_at_launch:
  global: "$999 USD (1979)"
  countries:
    - country: "United States"
      price: "999"
      currency: "USD"
    - country: "United Kingdom"
      price: "799"
      currency: "GBP"
release_date:
  global: 1979-11-01
  countries:
    - country: "United States"
      date: 1979-11-01
    - country: "United Kingdom"
      date: 1981-03-01
discontinued: 1992-01-01
units_sold: "4+ million (entire 8-bit line)"
country_of_origin: "United States"
operating_system: "Atari DOS 2.0/2.5/3.0, MyDOS, SpartaDOS"
emulated: true
emulators:
  - name: "Altirra"
    platform: "Windows"
    accuracy: "cycle_accurate"
  - name: "Atari800"
    platform: "Multi-platform"
    accuracy: "high"
  - name: "A8DS"
    platform: "Nintendo DS"
    accuracy: "good"
  - name: "RetroArch"
    platform: "Multi-platform"
    accuracy: "high"
variants:
  - name: "Atari 400"
    release_date:
      global: 1979-11-01
    discontinued: 1982-01-01
    differences: "Budget model with membrane keyboard, 8-16 KB RAM, single cartridge slot"
    model_number: "CX40"
  - name: "Atari 800"
    release_date:
      global: 1979-11-01
    discontinued: 1982-01-01
    differences: "Premium model with full keyboard, 8-48 KB RAM, dual cartridge slots, expansion capability"
    model_number: "CX80"
  - name: "Atari 1200XL"
    release_date:
      global: 1982-11-01
    discontinued: 1983-07-01
    differences: "Redesigned with 64 KB RAM, improved keyboard, compatibility issues with some software"
    model_number: "CX1200"
  - name: "Atari 800XL"
    release_date:
      global: 1983-08-01
    discontinued: 1987-01-01
    differences: "Most popular model, 64 KB RAM, improved OS, better compatibility"
    model_number: "CX800XL"
  - name: "Atari 130XE"
    release_date:
      global: 1985-01-01
    discontinued: 1992-01-01
    differences: "128 KB RAM with bank switching, enhanced graphics capabilities"
    model_number: "CX130XE"
  - name: "Atari XEGS"
    release_date:
      global: 1987-01-01
    discontinued: 1992-01-01
    differences: "Game console version with detachable keyboard, light gun support"
    model_number: "CX2600XE"
notable_software:
  - name: "Star Raiders"
    type: "Space Combat Simulation"
    year: 1980
    developer: "Doug Neubauer"
    publisher: "Atari"
  - name: "M.U.L.E."
    type: "Strategy Game"
    year: 1983
    developer: "Ozark Softscape"
    publisher: "Electronic Arts"
  - name: "Rescue on Fractalus!"
    type: "Action Game"
    year: 1985
    developer: "Lucasfilm Games"
    publisher: "Atari"
  - name: "Alternate Reality"
    type: "RPG"
    year: 1985
    developer: "Paradise Programming"
    publisher: "Datasoft"
  - name: "International Karate"
    type: "Fighting Game"
    year: 1986
    developer: "System 3"
    publisher: "System 3"
historical_significance: "The Atari 8-bit computers introduced custom chips for graphics and sound that were years ahead of their competition. ANTIC, GTIA, and POKEY established the template for specialized multimedia processors and influenced the design of later Atari systems including the ST."
description: "Advanced 6502 system with revolutionary custom chips for graphics (ANTIC/GTIA) and sound (POKEY)."
image: "/images/systems/atari-800.jpg"
order: 17
---

The **Atari 800** was a revolutionary computer system that introduced custom multimedia chips years before they became common in other computers. Released in 1979, it featured the powerful combination of a **MOS 6502C** processor with three custom chips: **ANTIC** for graphics, **GTIA** for colors, and **POKEY** for sound and I/O.

This combination created a system capable of advanced graphics and sound effects that wouldn't be matched by other home computers until the mid-1980s. The Atari 8-bit line established many concepts that would later be perfected in systems like the Commodore 64 and Amiga.

## Key Features

- **Custom Graphics Chips** - ANTIC and GTIA provided hardware-accelerated graphics
- **Advanced Sound** - POKEY chip delivered 4-channel audio with filtering capabilities
- **Display List Architecture** - Programming graphics through command lists
- **Player/Missile Graphics** - Hardware sprites for smooth animation
- **Mixed Graphics Modes** - Different resolutions and color depths on the same screen
- **Modular Design** - Expandable architecture with cartridge slots and peripheral ports
- **Professional Keyboard** - Full-travel keys superior to most competitors

## Revolutionary Custom Chips

The Atari 800's three custom chips were groundbreaking for their time:

### ANTIC (Alpha-Numeric Television Interface Controller)
- **Display List Processor** - Programmable graphics controller
- **Mixed-mode displays** - Text and graphics modes on the same screen
- **Hardware scrolling** - Smooth scrolling in all directions
- **Display List Interrupts** - Precise timing control for advanced effects

### GTIA (George's Television Interface Adaptor)
- **128-color palette** - More colors than any competitor
- **Player/Missile Graphics** - 5 hardware sprites with collision detection
- **Priority control** - Sprites can appear behind or in front of backgrounds
- **Special graphics modes** - Including 16-color modes for detailed artwork

### POKEY (Pot Keyboard Integrated Circuit)
- **4-channel audio** - Independent frequency and volume control
- **Noise generation** - For percussion and sound effects
- **High-pass filter** - Audio filtering capabilities
- **I/O functions** - Keyboard scanning, joystick reading, serial communication

## Programming Innovation

The Atari 8-bit computers introduced several programming concepts that influenced later systems:

- **Display Lists** - Describing graphics through data structures rather than direct programming
- **Vertical Blank Interrupts** - Synchronizing program execution with screen refresh
- **Memory-mapped hardware** - Direct manipulation of graphics and sound through memory addresses
- **Bank switching** - Accessing more memory than the 6502's 64KB address space
- **Coarse/Fine scrolling** - Combining hardware and software techniques for smooth motion

## Software Excellence

The Atari 8-bit line had an exceptional software library that showcased its advanced capabilities:

- **Star Raiders** - The first true 3D space combat game
- **Eastern Front (1941)** - Revolutionary real-time strategy gameplay
- **M.U.L.E.** - Multiplayer economic strategy that's still played today
- **Rescue on Fractalus!** - Advanced 3D graphics from Lucasfilm Games
- **Alternate Reality** - Immersive RPG with digitized sound

## Cultural Impact

The Atari 8-bit computers demonstrated that home computers could deliver arcade-quality graphics and sound. They established Atari as a serious computer manufacturer and influenced the design philosophy behind later successful systems.

The system's advanced capabilities attracted serious programmers and game developers, creating a community that pushed the hardware to its absolute limits and beyond.

## Why Learn Atari 8-bit Programming Today?

Programming the Atari 8-bit computers teaches advanced hardware concepts:

- **6502 Assembly** - Classic processor in an enhanced system context
- **Custom Chip Programming** - Direct manipulation of specialized graphics and sound hardware
- **Display List Programming** - Understanding modern GPU concepts through retro hardware
- **Advanced Graphics Techniques** - Player/missile graphics, scrolling, and mixed-mode displays
- **Audio Programming** - Multi-channel sound synthesis and filtering
- **Interrupt-driven Programming** - Real-time system programming concepts
- **Memory Management** - Bank switching and memory-mapped I/O

The Atari 8-bit computers represent a perfect balance between the simplicity of earlier systems and the complexity of later machines. They provide an excellent foundation for understanding how custom silicon can enhance a basic processor architecture, lessons that remain relevant in modern embedded systems and game development.