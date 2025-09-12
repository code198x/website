---
name: "Elektronika BK"
slug: "elektronika-bk"
manufacturer: "NPO Scientific Center"
model_number: "BK-0010"
medal_tier: "bronze"
total_lessons: 512
total_games: 8
estimated_duration: "2-4 weeks"
cpu_architecture: "PDP-11"
difficulty_level: "advanced"
architecture_family: "16-bit minicomputer"
prerequisite_platforms: ["commodore-64"]
recommended_next: ["atari-st", "commodore-amiga"]
cpu: "KR580VM80A (PDP-11 compatible)"
clock_speed: "3 MHz"
ram: "16 KB base (expandable to 128 KB)"
rom: "32 KB system ROM"
video:
  processor: "Custom video controller"
  resolution: "512×256 pixels"
  colors: "Monochrome (green phosphor)"
  display_modes:
    - "512×256 bitmap graphics"
    - "64×32 character text"
    - "Mixed graphics/text modes"
    - "Hardware scrolling"
audio:
  chip: "Covox-compatible DAC"
  channels: 1
  features:
    - "8-bit digital audio"
    - "Software-generated sound"
    - "Covox Sound Master support"
    - "Cassette interface audio"
storage:
  - "Cassette tape interface"
  - "ROM cartridges"
  - "5.25\" floppy disk (BK-0011 variant)"
io_ports:
  - "Soviet-standard keyboard"
  - "Joystick ports (Atari-compatible)"
  - "Cassette recorder interface"
  - "Printer port"
  - "Expansion slots"
price_at_launch:
  global: "650 rubles (1985)"
  countries:
    - country: "Soviet Union"
      price: "650"
      currency: "RUB"
    - country: "Eastern Bloc"
      price: "800"
      currency: "RUB"
release_date:
  global: 1985-01-01
  countries:
    - country: "Soviet Union"
      date: 1985-01-01
    - country: "Eastern European countries"
      date: 1986-01-01
discontinued: 1992-01-01
units_sold: "200,000"
country_of_origin: "Soviet Union"
operating_system: "RT-11SJ + BASIC + Focal"
emulated: true
emulators:
  - name: "BK Back to Life"
    platform: "Windows"
    accuracy: "high"
  - name: "BKDE"
    platform: "DOS/Windows"
    accuracy: "high"
  - name: "BK-0011 Emulator"
    platform: "Multi-platform"
    accuracy: "good"
variants:
  - name: "BK-0010"
    model_number: "BK-0010"
    release_date:
      global: 1985-01-01
    differences: "Original model with cassette storage"
  - name: "BK-0011"
    model_number: "BK-0011"
    release_date:
      global: 1987-01-01
    differences: "Floppy disk support, improved graphics"
  - name: "BK-0010-01"
    model_number: "BK-0010-01"
    release_date:
      global: 1986-01-01
    differences: "Enhanced keyboard, better construction"
  - name: "BK-0011M"
    model_number: "BK-0011M"
    release_date:
      global: 1990-01-01
    differences: "Color graphics support, 128 KB RAM"
notable_software:
  - name: "Digger"
    type: "Game"
    year: 1986
    developer: "Soviet programmers"
    publisher: "Various"
  - name: "Sokoban"
    type: "Game"
    year: 1987
    developer: "Soviet adaptation"
    publisher: "Various"
  - name: "Turbo Pascal"
    type: "Development"
    year: 1988
    developer: "Soviet adaptation"
    publisher: "Various"
  - name: "Korvet-BASIC"
    type: "Language"
    year: 1985
    developer: "NPO Scientific Center"
    publisher: "NPO Scientific Center"
  - name: "Tank Battle"
    type: "Game"
    year: 1986
    developer: "Independent"
    publisher: "Various"
  - name: "Tetris BK"
    type: "Game"
    year: 1988
    developer: "Soviet programmers"
    publisher: "Various"
  - name: "Word Processor BK"
    type: "Productivity"
    year: 1987
    developer: "NPO Scientific Center"
    publisher: "NPO Scientific Center"
  - name: "Math Tutor"
    type: "Educational"
    year: 1986
    developer: "Soviet educators"
    publisher: "Various"
historical_significance: "The Elektronika BK series brought PDP-11 minicomputer architecture to Soviet homes, representing the USSR's most successful attempt at mass-produced personal computing. Based on Digital Equipment Corporation's proven 16-bit architecture, it introduced thousands of Soviet citizens to programming and demonstrated how Eastern Bloc countries adapted Western technology for local production."
description: "The Soviet home computer based on PDP-11 architecture that brought minicomputer power to the masses."
image: "/images/systems/elektronika-bk.jpg"
order: 63
---

# Elektronika BK: Soviet Computing Revolution

The **Elektronika BK** series represents one of the most fascinating chapters in computing history—the Soviet Union's successful adaptation of Digital Equipment Corporation's PDP-11 minicomputer architecture into an affordable home computer. Released in 1985, this system brought genuine 16-bit minicomputer power to Soviet households, introducing an entire generation to programming and advanced computing concepts.

## PDP-11 Heritage

The BK's foundation was DEC's revolutionary PDP-11 architecture:
- **16-bit word size** - more advanced than most contemporary home computers
- **Orthogonal instruction set** - consistent, powerful programming model
- **Memory-mapped I/O** - unified address space for memory and devices
- **8 general-purpose registers** - flexible register architecture
- **Minicomputer reliability** - industrial-strength design adapted for home use

This wasn't a simple 8-bit system like most home computers—it was a genuine minicomputer scaled for personal use.

## Soviet Engineering Achievement

### Reverse Engineering Marvel
The BK represented impressive Soviet engineering:
- **Complete PDP-11 compatibility** - could run actual minicomputer software
- **Local manufacturing** - produced entirely within the Soviet Union
- **Component substitution** - Soviet-made equivalents of Western chips
- **Cost optimization** - minicomputer power at home computer prices

### KR580VM80A Processor
The heart of the system was a Soviet-designed CPU:
- **PDP-11 instruction set** - full compatibility with DEC systems
- **3 MHz clock speed** - faster than many Western home computers
- **16-bit architecture** - true 16-bit processing throughout
- **Industrial design** - built for reliability in harsh Soviet conditions

## Technical Architecture

### Memory System
The BK featured advanced memory management:
- **16 KB base RAM** - expandable to 128 KB
- **32 KB system ROM** - containing RT-11SJ operating system
- **Memory mapping** - sophisticated address space management
- **Bank switching** - accessing more memory than address space allowed

### Graphics Capabilities
Despite monochrome display, graphics were sophisticated:
- **512×256 resolution** - high resolution for the era
- **Bitmap graphics** - direct pixel manipulation
- **Hardware scrolling** - smooth screen movement
- **Mixed graphics/text** - combining modes seamlessly

### Operating System
The BK ran a modified version of DEC's RT-11:
- **RT-11SJ** - simplified version of the minicomputer OS
- **Command-line interface** - Unix-like system interaction
- **File system** - hierarchical directory structure
- **Multitasking support** - limited concurrent operations

## Programming Environment

### Multiple Languages
The BK supported several programming languages:

**BASIC Interpreter**
```basic
10 REM Elektronika BK program
20 FOR I = 1 TO 100
30   PRINT I, SQR(I)
40 NEXT I
50 END
```

**PDP-11 Assembly Language**
```assembly
; PDP-11 assembly for BK
START:  MOV #177777, R0  ; Load address
        CLR (R0)         ; Clear memory location
        MOV #100, R1     ; Loop counter
LOOP:   INC (R0)         ; Increment value
        DEC R1           ; Decrement counter
        BNE LOOP         ; Branch if not equal
        HALT             ; Stop execution
```

**FOCAL Programming Language**
```focal
01.10 TYPE "ELEKTRONIKA BK CALCULATION"
01.20 ASK "ENTER NUMBER", N
01.30 SET A = FSQT(N)
01.40 TYPE "SQUARE ROOT =", A
01.50 QUIT
```

### Development Tools
The system included professional development capabilities:
- **Assembler** - native PDP-11 assembly language support
- **Debugger** - step-through debugging and breakpoints
- **Editor** - text editing for program development
- **Linker** - combining multiple program modules

## Soviet Software Ecosystem

### Educational Focus
The BK was positioned as an educational tool:
**Math Tutor** - Mathematical instruction programs
**Programming Courses** - Computer science education
**Technical Documentation** - Comprehensive programming manuals
**School Integration** - curriculum support for computing education

### Gaming Culture
Despite limited commercial games, a vibrant gaming scene emerged:
**Tetris BK** - Soviet version of the famous puzzle game
**Tank Battle** - Military-themed strategy game
**Digger** - Arcade-style action game
**Sokoban** - Puzzle game perfectly suited to the BK

### Productivity Applications
Professional software emerged from the community:
**Word Processor BK** - Text editing and formatting
**Database programs** - Simple data management
**Mathematical software** - Engineering calculations
**Graphics programs** - Technical drawing applications

## Why Study BK Development?

### Minicomputer Architecture
The BK teaches advanced computer architecture concepts:
- **16-bit programming** - working with wider data paths
- **Memory mapping** - sophisticated address space management
- **Interrupt handling** - real-time system programming
- **Hardware interfaces** - direct hardware manipulation

### Operating System Programming
RT-11SJ provides insight into:
- **System calls** - interface between programs and OS
- **Device drivers** - hardware abstraction layers
- **File systems** - organizing and accessing stored data
- **Memory management** - efficient use of limited RAM

### Historical Computing Perspectives
Understanding the BK reveals:
- **Technology transfer** - adaptation of Western designs
- **Socialist computing** - different approaches to personal computing
- **Resource constraints** - optimization under material limitations
- **Community development** - grassroots software creation

## The Bronze Tier Curriculum

Our 512-lesson Bronze curriculum explores minicomputer programming:

### Phase 1: PDP-11 Foundations (256 lessons)
- PDP-11 assembly language fundamentals
- RT-11SJ operating system interaction
- Memory management and bank switching
- Basic graphics and I/O programming

### Phase 2: Advanced System Programming (256 lessons)
- Interrupt-driven programming
- Hardware interface development
- Advanced graphics techniques
- Performance optimization strategies

You'll create 8 projects ranging from simple utilities to complex applications, exploring the full capabilities of minicomputer architecture in a home computer context.

## Cultural and Historical Context

### Soviet Computing Philosophy
The BK reflected Soviet approaches to technology:
- **Education emphasis** - computers as learning tools
- **Community sharing** - software freely exchanged
- **Technical excellence** - sophisticated engineering within constraints
- **Self-reliance** - complete domestic production

### Iron Curtain Innovation
The BK demonstrated Eastern Bloc technical capabilities:
- **Independent development** - successful reverse engineering
- **Local adaptation** - modifications for Soviet conditions
- **Mass production** - scaling minicomputer technology
- **Educational integration** - systematic computer literacy programs

## Technical Innovations

### PDP-11 Optimization
The BK improved on the original PDP-11 design:
- **Cost reduction** - minicomputer features at personal computer prices
- **Power efficiency** - suitable for home use
- **Reliability improvements** - better component selection
- **Local manufacturing** - adaptation to Soviet production capabilities

### Graphics System
Despite monochrome display, the graphics were sophisticated:
- **High resolution** - 512×256 pixels
- **Fast bitmap operations** - efficient graphics routines
- **Hardware scrolling** - smooth screen updates
- **Mixed modes** - text and graphics integration

## Legacy and Influence

### Soviet Computing Impact
The BK influenced Soviet computing development:
- **Programming education** - trained thousands of programmers
- **Software industry** - established local development communities
- **Technical knowledge** - transferred minicomputer concepts
- **Cultural impact** - computing became part of Soviet technical culture

### Post-Soviet Development
BK programmers contributed to:
- **Game industry** - several famous game developers started on BK
- **System software** - operating system and utility development
- **Educational software** - computer-assisted learning programs
- **Technical innovation** - hardware and software engineering advances

## Manufacturing Achievement

The BK represented impressive Soviet manufacturing:
- **Complete domestic production** - all components made in USSR
- **Quality control** - reliable operation under harsh conditions
- **Scale manufacturing** - 200,000 units produced
- **Technology transfer** - minicomputer knowledge dissemination

## The "WOW" Moment

When you first run a PDP-11 program written for a million-dollar minicomputer on a home computer costing 650 rubles—perhaps a sophisticated scientific calculation or a complex text processing application—you'll understand the BK's revolutionary significance. The seamless execution of genuine minicomputer software in a Soviet living room was genuinely remarkable for 1985.

Learning BK development provides insight into minicomputer architecture, operating system programming, and the fascinating intersection of Cold War politics and computing technology. It's a unique study in how advanced Western computing concepts could be successfully adapted and implemented behind the Iron Curtain, creating a distinctive Soviet computing culture that influenced an entire generation of programmers.