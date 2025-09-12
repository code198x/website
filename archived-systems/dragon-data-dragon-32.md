---
name: "Dragon 32/64"
slug: "dragon-data-dragon-32"
full_name: "Dragon Data Dragon 32/64"
manufacturer: "Dragon Data Ltd."
model_number: "Dragon 32, Dragon 64"
alternative_names: ["Dragon", "Welsh Dragon"]
medal_tier: "silver"
total_lessons: 1024
total_games: 15
estimated_duration: "6-12 weeks"
cpu_architecture: "6809"
difficulty_level: "intermediate"
architecture_family: "6809"
prerequisite_platforms: ["tandy-coco3"]
recommended_next: ["vectrex", "msx"]

cpu: "Motorola MC6809E"
cpu_details:
  architecture: "8-bit"
  instruction_set: "6809"
  addressing_modes: ["Immediate", "Direct", "Extended", "Indexed", "Relative", "Inherent"]
  registers: "Two 8-bit accumulators (A, B), can be combined as 16-bit (D); X, Y, U, S pointer registers; DP direct page register; CC condition codes"
clock_speed: "0.895 MHz"

ram: "32 KB (Dragon 32), 64 KB (Dragon 64)"
ram_details:
  user_available: "~23 KB (Dragon 32), ~55 KB (Dragon 64)"
  video_ram: "6 KB shared system RAM"
  expansion_options: ["Memory expansion cartridge"]

rom: "16 KB"
rom_contents: ["Extended Color BASIC", "Dragon DOS", "Character generator ROM"]

video:
  processor: "Motorola MC6847 VDG (Video Display Generator)"
  resolution: "256×192 pixels (graphics), 32×16 characters (text)"
  colors: "8 colors from fixed palette (black, green, yellow, blue, red, buff, cyan, magenta, orange)"
  display_modes:
    - "Text mode (32×16 characters)"
    - "Semi-graphics modes (64×32, 64×48, 64×64, 64×96, 64×192)"
    - "Graphics modes (128×64, 128×96, 128×192, 256×192)"
    - "RG (Resolution Graphics) mode 256×192 with 4 colors"
  sprites:
    count: 0
    size: "No hardware sprites"
  hardware_scrolling: false
  raster_interrupts: false

audio:
  chip: "Single-bit sound port"
  channels: 1
  features:
    - "1-bit sound output"
    - "Software-generated tones"
    - "Cassette relay control"
  sample_playback: false
  synthesis_types: ["Simple tone generation"]

storage:
  - "Compact Cassette tape"
  - "5.25\" floppy disk (with Dragon DOS)"
  - "ROM cartridges"
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Floppy disk controller", "ROM cartridge slot"]
  typical_capacity:
    cassette: "~32 KB per side"
    floppy: "180 KB (single-sided)"
    cartridge: "4-16 KB ROM"

io_ports:
  - "Joystick port (6-pin DIN)"
  - "Cassette interface (DIN connector)"
  - "Cartridge slot"
  - "Serial port (RS-232)"
  - "Parallel printer port (Centronics)"
  - "Expansion bus"

expansion_options:
  - "64K RAM upgrade (Dragon 32 → 64)"
  - "Floppy disk controller"
  - "Multi-slot expansion unit"
  - "Modem interface"

price_at_launch:
  global: "£199 (Dragon 32), £299 (Dragon 64)"
  countries:
    - country: "United Kingdom"
      price: "199"
      currency: "GBP"
    - country: "United States"
      price: "199"
      currency: "USD"

release_date:
  global: 1982-08-01
  countries:
    - country: "United Kingdom"
      date: 1982-08-01
    - country: "Wales"
      date: 1982-08-01
    - country: "United States"
      date: 1983-01-01

discontinued: 1984-06-01
production_run: "1982-1984"
units_sold: "~200,000 units"
market_share:
  peak_year: 1983
  percentage: "~15%"
  region: "United Kingdom"

country_of_origin: "United Kingdom (Wales)"
operating_system: "Extended Color BASIC"
programming_languages: ["Extended Color BASIC", "6809 Assembly", "Logo", "Pascal"]

target_market: ["Home users", "Education", "Small business"]
market_positioning: "British alternative to American computers"
competition: ["BBC Micro", "Commodore 64", "Sinclair ZX Spectrum"]

variants:
  - name: "Dragon 32"
    model_number: "Dragon 32"
    release_date:
      global: 1982-08-01
    differences: "32 KB RAM, basic model"
    significance: "Original model, most common variant"
  - name: "Dragon 64"
    model_number: "Dragon 64"
    release_date:
      global: 1983-03-01
    differences: "64 KB RAM, improved keyboard"
    significance: "Enhanced model with double the RAM"
  - name: "Dragon 200-E"
    model_number: "Dragon 200-E"
    release_date:
      global: 1985-01-01
    differences: "Spanish market, built-in disk drive"
    significance: "Final Dragon model, Spanish market only"

notable_software:
  - name: "Dungeons of Daggorath"
    type: "Game"
    year: 1983
    developer: "DynaMicro"
    publisher: "DynaMicro"
    significance: "First real-time 3D dungeon crawler on 8-bit"
  - name: "Pitfall II: Lost Caverns"
    type: "Game"
    year: 1985
    developer: "Activision"
    publisher: "Activision"
  - name: "Football Manager"
    type: "Game"
    year: 1983
    developer: "Kevin Toms"
    publisher: "Addictive Games"
  - name: "Extended Color BASIC"
    type: "Programming Language"
    year: 1982
    developer: "Microsoft"
    publisher: "Dragon Data"

software_library_size:
  commercial_games: "~500"
  applications: "~200"
  total_titles: "~700"

development_tools: ["Extended Color BASIC interpreter", "6809 Assemblers", "Debug monitors", "Disk BASIC"]
programming_characteristics:
  - "Powerful 6809 processor with excellent instruction set"
  - "Extended Color BASIC with graphics and sound commands"
  - "Direct memory access for advanced programming"
  - "Efficient 16-bit operations"
hardware_quirks:
  - "MC6847 VDG shared video/system memory"
  - "Limited color palette compared to competitors"
  - "Single-bit audio output only"
  - "Joystick port uses unusual 6-pin DIN connector"

historical_significance: "The Dragon 32/64 represented Welsh pride in technology and was one of the few successful non-American 8-bit computers. Built around the advanced 6809 processor, it offered superior programming capabilities but struggled against better-marketed competitors like the BBC Micro and Commodore 64."

cultural_impact: "The Dragon became a symbol of Welsh technological ambition and showed that small countries could compete in the global computer market. Despite commercial failure, it influenced a generation of Welsh programmers and engineers."

innovation_highlights:
  - "One of the first home computers built around the 6809 processor"
  - "Extended Color BASIC with advanced graphics commands"
  - "Modular expansion system"
  - "Strong educational focus"

industry_influence: "The Dragon's commercial failure provided lessons about the importance of marketing and software library in the home computer market, influences later adopted by more successful platforms."

educational_value:
  programming_concepts:
    - "6809 assembly language programming"
    - "Extended BASIC programming"
    - "Graphics and sound programming"
    - "Memory management"
  hardware_concepts:
    - "MC6847 Video Display Generator"
    - "6809 CPU architecture"
    - "Memory mapping"
    - "I/O port programming"
  historical_lessons:
    - "Regional computing industry development"
    - "Marketing importance in tech success"
    - "Processor architecture advantages vs market reality"
  why_study_this_system: "The Dragon offers insight into an advanced but commercially unsuccessful system, teaching both technical excellence and business realities of the 1980s computer market."

learning_advantages:
  - "Excellent 6809 instruction set for learning assembly"
  - "Clear separation of graphics and system memory"
  - "Extended BASIC ideal for structured programming"
  - "Historical significance as Welsh computing achievement"

common_beginner_projects:
  - "Graphics mode manipulation programs"
  - "Simple games using BASIC graphics commands"
  - "Sound generation experiments"
  - "Cassette tape programs"

emulated: true
emulators:
  - name: "XRoar"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
    notes: "Best Dragon emulator, highly accurate"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "high"
    notes: "Excellent compatibility"
  - name: "CoCo3 emulators"
    platform: "Various"
    accuracy: "good"
    notes: "Some compatibility due to similar hardware"

preservation_status: "good"
hardware_availability: "available"

technical_documentation:
  - title: "Dragon 32/64 Technical Reference Manual"
    type: "hardware_reference"
    url: "http://archive.worldofdragon.org/archive/manuals/"
  - title: "Extended Color BASIC Manual"
    type: "programming_guide"
  - title: "6809 Assembly Language Programming"
    type: "programming_guide"

description: "Welsh-built 6809 computer that combined advanced processor architecture with distinctive regional identity in the competitive 8-bit market."
image: "/images/systems/dragon-32.jpg"

order: 31
---

# Dragon 32/64: Welsh Computing Ambition

The **Dragon 32/64** was Wales' bold entry into the home computer revolution, representing national pride in technology and engineering excellence. Built by Dragon Data Ltd. in Wales from 1982-1984, it showcased the advanced Motorola 6809 processor in an elegant design that challenged the dominance of American and Japanese computers.

## The 6809 Advantage

While most competitors used the 6502 or Z80, Dragon chose the **Motorola MC6809E**—arguably the most sophisticated 8-bit processor ever designed. The 6809 offered:

- **Two 8-bit accumulators** (A and B) that could combine into a 16-bit accumulator (D)
- **Multiple index registers** (X, Y) with full 16-bit arithmetic
- **Advanced addressing modes** including program counter relative
- **Efficient code generation** with fewer bytes per instruction
- **Superior interrupt handling** with hardware stack management

This processor choice made the Dragon technically superior for programming, with cleaner assembly code and more efficient BASIC interpreter performance.

## MC6847 Graphics Excellence

The **MC6847 Video Display Generator** provided sophisticated graphics capabilities:

### Graphics Modes
- **256×192 high resolution** with 2 colors
- **128×192 medium resolution** with 4 colors  
- **Semi-graphics modes** for text/graphics combination
- **RG (Resolution Graphics)** mode for detailed artwork

### Color Palette
The Dragon's 8-color palette was carefully chosen for clarity:
- Black, Green, Yellow, Blue, Red, Buff (cream), Cyan, Magenta

Each graphics mode offered different color combinations, with the RG mode providing 4 simultaneous colors from the full palette.

## Extended Color BASIC

Dragon's **Extended Color BASIC** was among the most sophisticated BASIC interpreters available:

```basic
' Advanced graphics commands
PMODE 4,1: PCLS 1
PSET (128,96,2): PRESET (64,48,3)
CIRCLE (128,96),50,4
LINE (0,0)-(255,191),1,B
```

The BASIC included:
- **Graphics primitives** - PSET, PRESET, LINE, CIRCLE
- **Sound commands** - SOUND for tone generation
- **String handling** - Advanced string manipulation
- **File operations** - Cassette and disk I/O
- **Memory management** - Direct memory access commands

## Cultural and Regional Significance

### Welsh Computing Identity
The Dragon represented more than just another home computer—it was a symbol of Welsh technological capability and independence. Dragon Data's Swansea factory employed local workers and challenged the assumption that advanced computers could only come from Silicon Valley or Japan.

### Educational Impact
The Dragon found strong adoption in Welsh schools and throughout the UK education system. Its Extended BASIC and excellent documentation made it ideal for teaching programming concepts, while the 6809's clean architecture provided an excellent introduction to assembly language.

### Community Spirit
The Dragon community was notably close-knit and supportive. User groups formed across Wales and the UK, sharing programs, techniques, and hardware modifications. This community spirit helped sustain the platform well beyond its commercial life.

## Technical Challenges and Solutions

### Memory Architecture
The Dragon used a unified memory model where video RAM shared space with system RAM. This created interesting programming challenges:

- **Video memory location** could be moved in software
- **Memory contention** during screen updates affected CPU performance  
- **Clever programming** could minimize display/CPU conflicts

### Hardware Limitations
Despite its advanced processor, the Dragon had constraints:

- **Single-bit audio** limited sound capabilities compared to dedicated sound chips
- **No hardware sprites** meant software sprite systems
- **Limited expansion** without the expensive expansion unit
- **Compatibility issues** with the similar but not identical TRS-80 Color Computer

## Programming the Dragon Today

Modern Dragon programming offers unique educational value:

### Assembly Language Excellence
The 6809's clean instruction set makes it ideal for learning assembly:
- **Orthogonal instructions** - consistent operation across addressing modes
- **Efficient stack operations** - hardware-managed system and user stacks
- **Clean syntax** - more readable than 6502 or Z80 assembly

### Graphics Programming
The MC6847's video modes provide excellent graphics programming lessons:
- **Mode switching** - understanding different graphics capabilities
- **Memory mapping** - video RAM organization and access
- **Color management** - working within palette constraints
- **Animation techniques** - software sprite systems

### Historical Computing Perspective
Programming the Dragon provides insight into:
- **Regional computing industries** - how local companies competed globally
- **Technical vs. commercial success** - superior technology doesn't guarantee market victory
- **Community-driven platforms** - how enthusiast communities sustain technologies

## The Code198x Dragon Experience

Our **1,024-lesson Silver curriculum** explores the Dragon's unique capabilities across **6-12 weeks** of intensive study:

### Weeks 1-2: Foundation (256 lessons)
- 6809 processor architecture and programming
- Extended Color BASIC mastery
- MC6847 graphics modes and programming
- Sound generation and cassette operations

### Weeks 3-8: Advanced Programming (512 lessons)
- Assembly language game development
- Graphics optimization techniques  
- Memory management strategies
- Hardware interfacing projects

### Weeks 9-12: Mastery Projects (256 lessons)
- **15 complete games** showcasing Dragon capabilities
- Advanced graphics demonstrations
- Educational software development
- Hardware expansion projects

## Legacy and Learning Value

The Dragon 32/64 teaches essential lessons about technology, business, and regional pride:

1. **Technical Excellence** - The 6809 was genuinely superior to competitor processors
2. **Market Reality** - Superior technology needs marketing and software support
3. **Regional Innovation** - Small countries/regions can create world-class technology
4. **Community Value** - Enthusiast communities can sustain platforms beyond commercial viability
5. **Educational Impact** - Good educational tools outlast their commercial popularity

## Why Study the Dragon Today?

The Dragon offers unique insights for modern developers and computer enthusiasts:

- **Clean Architecture** - The 6809/MC6847 combination is elegant and educational
- **Historical Perspective** - Understanding how regional computing industries developed
- **Programming Fundamentals** - Excellent platform for learning assembly language
- **Design Philosophy** - Studying how technical decisions affect market success
- **Community Dynamics** - How enthusiast communities form and sustain technologies

The Dragon 32/64 wasn't just Wales' computer—it was a testament to the idea that good engineering, educational focus, and regional pride could create something special in the competitive world of 1980s computing.

While it didn't achieve commercial success like the Commodore 64 or BBC Micro, the Dragon succeeded in demonstrating Welsh technical capability and providing an excellent educational platform that influenced thousands of programmers. Today, it stands as both a technical achievement and a cultural artifact of the remarkable diversity of the 8-bit era.