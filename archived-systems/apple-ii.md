---
name: "Apple II"
slug: "apple-ii"
manufacturer: "Apple Computer"
model_number: "A2S1"
medal_tier: "platinum"
total_lessons: 4096
total_games: 35
estimated_duration: "6-12 months"
cpu_architecture: "6502"
difficulty_level: "beginner"
architecture_family: "6502"
prerequisite_platforms: []
recommended_next: ["commodore-64", "apple-iigs", "atari-800"]
cpu: "MOS Technology 6502"
clock_speed: "1.023 MHz"
ram: "4 KB minimum, typically 48 KB"
rom: "12 KB (Integer BASIC, Monitor, Sweet16)"
video:
  processor: "Wozniak's custom logic"
  resolution: "280×192 (high-res), 40×48 (low-res)"
  colors: "6 colors in high-res, 16 in low-res"
  display_modes:
    - "Text: 40×24 characters"
    - "Low-res graphics: 40×48, 16 colors"
    - "High-res graphics: 280×192, 6 colors"
    - "Mixed text and graphics modes"
audio:
  chip: "Built-in speaker"
  channels: 1
  features:
    - "Click speaker (1-bit audio)"
    - "Software-controlled frequency"
    - "Mockingboard card for enhanced audio"
storage:
  - "Cassette tape interface"
  - "Disk II floppy drive (140 KB)"
  - "Hard drives (via expansion cards)"
io_ports:
  - "8 expansion slots"
  - "Cassette in/out ports"
  - "Game port (analog joysticks)"
  - "Composite video output"
price_at_launch:
  global: "$1,298 USD (1977)"
  countries:
    - country: "United States"
      price: "1298"
      currency: "USD"
release_date:
  global: 1977-06-10
  countries:
    - country: "United States"
      date: 1977-06-10
discontinued: 1979-06-01
units_sold: "750,000-1 million (Apple II line: 5-6 million total)"
country_of_origin: "United States"
operating_system: "Apple DOS, later ProDOS"
emulated: true
emulators:
  - name: "AppleWin"
    platform: "Windows"
    accuracy: "cycle_accurate"
  - name: "OpenEmulator"
    platform: "macOS"
    accuracy: "cycle_accurate"
  - name: "Virtual ]["
    platform: "Multi-platform"
    accuracy: "high"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
variants:
  - name: "Apple II Plus"
    model_number: "A2S2"
    release_date:
      global: 1979-06-01
    differences: "Applesoft BASIC in ROM, 48KB standard"
  - name: "Apple IIe"
    model_number: "A2S2e"
    release_date:
      global: 1983-01-01
    differences: "Enhanced with lowercase, 64KB RAM, 80-column text"
  - name: "Apple IIc"
    model_number: "A2S4"
    release_date:
      global: 1984-04-24
    differences: "Compact portable version with built-in disk drive"
  - name: "Apple IIGS"
    model_number: "A2S6"
    release_date:
      global: 1986-09-15
    differences: "16-bit 65C816 CPU, enhanced graphics and sound"
notable_software:
  - name: "VisiCalc"
    type: "Application"
    year: 1979
    developer: "Software Arts"
    publisher: "Personal Software"
  - name: "Oregon Trail"
    type: "Game"
    year: 1978
    developer: "MECC"
    publisher: "MECC"
  - name: "Castle Wolfenstein"
    type: "Game"
    year: 1981
    developer: "Muse Software"
    publisher: "Muse Software"
  - name: "Wizardry"
    type: "Game"
    year: 1981
    developer: "Sir-Tech"
    publisher: "Sir-Tech"
  - name: "Prince of Persia"
    type: "Game"
    year: 1989
    developer: "Jordan Mechner"
    publisher: "Broderbund"
historical_significance: "The Apple II was the first mass-produced microcomputer with color graphics and the machine that established Apple Computer. It dominated American schools for over a decade, introduced countless students to programming, and proved that personal computers could be a serious business tool with VisiCalc, the first killer app."
description: "The computer that launched Apple and revolutionized education, business, and home computing in America."
image: "/images/systems/apple-ii.jpg"
order: 7
---

# Apple II: The Computer That Changed Everything

The **Apple II** wasn't the first personal computer, but it was the first one that mattered. Designed almost entirely by Steve Wozniak, it combined elegant engineering, expandability, and color graphics in a way that made computers accessible to normal people—not just electronics hobbyists.

## Wozniak's Masterpiece

Every aspect of the Apple II reflected Woz's genius for elegant, minimal design:

### Color from Simplicity
Instead of expensive color generation hardware, Woz exploited NTSC television timing:
- Pixels at specific positions created different colors
- Adjacent pixels blended to create more colors
- "Artifact colors" gave 6 colors in high-res from a monochrome signal
- Total parts count: incredibly minimal

### The Disk II Revolution
The Disk II floppy drive showcased similar brilliance:
- **8 chips** vs 50+ in other drives
- **$595** vs $1,000+ for competitors
- **Software-based** controller (used main CPU)
- **140KB** capacity (35 tracks, 16 sectors)

This made mass storage affordable and transformed the Apple II from toy to tool.

## Architecture: Expandability First

### The Magic of Slots
Eight expansion slots made the Apple II infinitely extensible:
- **Slot 0**: Language cards (RAM expansion)
- **Slot 1-2**: Serial/parallel cards
- **Slot 3**: 80-column cards
- **Slot 4-5**: Mouse, Z80 cards
- **Slot 6**: Disk controller (standard)
- **Slot 7**: RGB cards, accelerators

This open architecture spawned an entire industry of third-party hardware.

### Memory Map Innovation
```
$0000-$00FF - Zero page (fast access)
$0100-$01FF - Stack
$0200-$03FF - Input buffer, vectors
$0400-$07FF - Text/Lo-res page 1
$0800-$0BFF - Text/Lo-res page 2
$0C00-$1FFF - Free RAM
$2000-$3FFF - Hi-res page 1
$4000-$5FFF - Hi-res page 2
$6000-$BFFF - Program space
$C000-$CFFF - I/O space (slots)
$D000-$FFFF - ROM (BASIC, Monitor)
```

### Soft Switches: Hardware Through Software
Memory-mapped I/O locations controlled hardware:
- `$C050` - Graphics mode
- `$C051` - Text mode
- `$C054` - Page 1
- `$C055` - Page 2
- `$C030` - Click speaker

Reading or writing these addresses triggered hardware changes—brilliantly simple.

## Graphics: The Color Revolution

### Low-Resolution Mode (40×48)
- **16 colors** from a 4-bit palette
- **Block graphics** perfect for games
- **Fast** to update (only 1KB of RAM)
- **Mixed mode** with 4 lines of text

### High-Resolution Mode (280×192)
- **6 colors** through NTSC artifacting
- **Black, white, green, purple, orange, blue**
- **7 pixels per byte** (high bit for palette shift)
- **Complex** color rules based on even/odd positions

### Shape Tables
Apple's unique vector graphics system:
- Compact storage for shapes
- Rotation and scaling built-in
- Used in many classic games
- Predated sprite hardware

## Programming Culture

The Apple II created modern programming culture:

### BASIC for Everyone
```basic
10 GR : REM SWITCH TO GRAPHICS
20 FOR I = 0 TO 39
30   COLOR = INT(RND(1) * 16)
40   VLIN 0,47 AT I
50 NEXT I
```

Every Apple II user could program immediately.

### Assembly for Power
The built-in Monitor let you enter machine code directly:
```
*300:A9 00 AA 20 EF FF E8 8A 4C 00 03
*300G
```

This accessibility created a generation of assembly programmers.

### The Demoscene Begins
Apple II programmers pioneered techniques still used today:
- **Page flipping** for smooth animation
- **Cycle counting** for precise timing
- **Self-modifying code** for speed
- **Compression** algorithms for fitting games on disks

## Educational Dominance

The Apple II owned American education:
- **Apple donated** thousands to schools
- **MECC** created educational software
- **Logo** taught programming concepts
- **Print Shop** made every classroom a publisher

An entire generation learned computing on Apple IIs.

## Business Revolution

VisiCalc, the first spreadsheet, made the Apple II essential for business:
- **$99** software selling **$2,000** computers
- Accountants and analysts bought Apple IIs just for VisiCalc
- Proved software could drive hardware sales
- Created the productivity software industry

## Why Learn Apple II Today?

The Apple II teaches fundamental concepts clearly:

1. **Pure 6502 Assembly** - No complex chipsets to obscure the CPU
2. **Memory-Mapped I/O** - Direct hardware control through memory
3. **Expansion Architecture** - How to design extensible systems
4. **Creative Constraints** - Making beauty from limitations
5. **Historical Importance** - Understanding computing's foundations

## The Code198x Approach

Our 4,096-lesson Platinum curriculum explores everything:

### Complete Coverage
- Start with Applesoft BASIC and shape tables
- Master 6502 assembly and the Monitor
- Understand Woz's video generation tricks
- Program the Disk II at the sector level
- Create 35 games using every graphics mode
- Explore expansion cards and peripherals
- Build a mini-DOS from scratch

The Apple II represents a perfect moment in computing history—powerful enough to be useful, simple enough to understand completely, and open enough to inspire endless creativity. It's not just a computer; it's a masterclass in engineering elegance and the machine that proved personal computers could change the world.