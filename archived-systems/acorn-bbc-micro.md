---
name: "BBC Micro"
slug: "acorn-bbc-micro"
manufacturer: "Acorn Computers"
model_number: "BBC Model B"
medal_tier: "platinum"
total_lessons: 4096
total_games: 35
estimated_duration: "6-12 months"
cpu_architecture: "6502"
difficulty_level: "intermediate"
architecture_family: "6502"
prerequisite_platforms: []
recommended_next: ["acorn-electron", "acorn-archimedes", "commodore-64"]
cpu: "MOS Technology 6502A"
clock_speed: "2 MHz"
ram: "32 KB (Model B), 128 KB (Master)"
rom: "32 KB (OS, BASIC, DFS)"
video:
  processor: "Motorola 6845 CRTC with custom ULA"
  resolution: "Up to 640×256 pixels"
  colors: "8 colors (16 with flashing)"
  display_modes:
    - "Mode 0: 640×256, 2 colors, 20KB"
    - "Mode 1: 320×256, 4 colors, 20KB"
    - "Mode 2: 160×256, 16 colors, 20KB"
    - "Mode 3: 80×25 text, 2 colors, 16KB"
    - "Mode 4: 320×256, 2 colors, 10KB"
    - "Mode 5: 160×256, 4 colors, 10KB"
    - "Mode 6: 40×25 text, 2 colors, 8KB"
    - "Mode 7: 40×25 teletext, 1KB"
audio:
  chip: "Texas Instruments SN76489"
  channels: 4
  features:
    - "3 tone generators"
    - "1 noise generator"
    - "16 volume levels per channel"
    - "ENVELOPE command for complex sounds"
storage:
  - "Cassette tape (1200 baud)"
  - "5.25\" floppy disk (100-800KB)"
  - "ROM cartridges"
  - "Econet network file server"
io_ports:
  - "RGB video output"
  - "Composite video output"
  - "RS423 serial port"
  - "Parallel printer port"
  - "User port (GPIO)"
  - "1 MHz bus expansion"
  - "Tube interface (second processor)"
  - "Analogue port (joysticks)"
  - "Econet port (networking)"
price_at_launch:
  global: "£399 (Model B, 1981)"
  countries:
    - country: "United Kingdom"
      price: "399"
      currency: "GBP"
release_date:
  global: 1981-12-01
  countries:
    - country: "United Kingdom"
      date: 1981-12-01
discontinued: 1994-01-01
units_sold: "1.5 million"
country_of_origin: "United Kingdom"
operating_system: "Acorn MOS"
emulated: true
emulators:
  - name: "BeebEm"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "B2"
    platform: "Multi-platform"
    accuracy: "high"
  - name: "JSBeeb"
    platform: "Web browser"
    accuracy: "cycle_accurate"
  - name: "B-em"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
variants:
  - name: "BBC Model A"
    model_number: "BBC Model A"
    release_date:
      global: 1981-12-01
    differences: "16KB RAM, fewer interfaces, upgradeable to Model B"
  - name: "BBC Model B+"
    model_number: "BBC Model B+"
    release_date:
      global: 1985-01-01
    differences: "64KB RAM, improved DFS, additional ROM sockets"
  - name: "BBC Master 128"
    model_number: "BBC Master"
    release_date:
      global: 1986-02-01
    differences: "128KB RAM, improved BASIC, numeric keypad"
notable_software:
  - name: "Elite"
    type: "Game"
    year: 1984
    developer: "David Braben and Ian Bell"
    publisher: "Acornsoft"
  - name: "Repton"
    type: "Game"
    year: 1985
    developer: "Tim Tyler"
    publisher: "Superior Software"
  - name: "Granny's Garden"
    type: "Educational"
    year: 1983
    developer: "4Mation"
    publisher: "4Mation"
  - name: "Revs"
    type: "Game"
    year: 1985
    developer: "Geoff Crammond"
    publisher: "Acornsoft"
historical_significance: "The BBC Micro was the cornerstone of computer education in the UK throughout the 1980s. Part of the BBC Computer Literacy Project, it taught a generation of British children to program and established the UK's strong position in software development. Its advanced features and expansion capabilities made it equally popular with hobbyists and professionals."
description: "Britain's educational champion that taught a nation to code and pioneered networked computing in schools."
image: "/images/systems/bbc-micro.jpg"
order: 8
---

# BBC Micro: The Computer Literacy Revolution

The **BBC Micro** wasn't just a computer—it was a national mission. Born from the BBC's Computer Literacy Project, it aimed to ensure Britain wouldn't be left behind in the computer revolution. The result was one of the most advanced and influential 8-bit computers ever made.

## Engineering Excellence

Acorn packed incredible features into the BBC Micro:
- **2 MHz 6502** - Twice the speed of most competitors
- **Multiple display modes** - From 640×256 graphics to Teletext
- **Built-in networking** - Econet connected entire schools
- **Tube interface** - Add a second processor (Z80, 6502, ARM!)
- **Structured BASIC** - With procedures and inline assembly
- **Professional keyboard** - Full-travel keys with function keys

## BBC BASIC: The Gold Standard

BBC BASIC set the bar for 8-bit programming languages:

### Advanced Features
```basic
DEF PROCdrawBox(x%, y%, width%, height%)
LOCAL i%
MOVE x%, y%
FOR i% = 1 TO 2
  DRAW x%+width%, y%
  DRAW x%+width%, y%+height%
  DRAW x%, y%+height%
  DRAW x%, y%
NEXT i%
ENDPROC
```

Procedures, local variables, and structured programming—revolutionary for 1981.

### Inline Assembly
```basic
DIM code% 100
FOR pass% = 0 TO 2 STEP 2
P% = code%
[OPT pass%
.start
  LDA #65
  JSR &FFEE
  RTS
]
NEXT
CALL start
```

Mix BASIC and assembly seamlessly—perfect for learning.

## Graphics Modes: Power and Flexibility

The BBC offered eight graphics modes, each with different trade-offs:

### Mode 2: The Sweet Spot
- **160×256 pixels**
- **16 logical colors** (8 steady + 8 flashing)
- **20KB screen memory**
- Perfect for colorful games

### Mode 7: Teletext Magic
- **40×25 characters**
- **Only 1KB RAM** - left 31KB free for programs!
- **Colorful text** and simple graphics
- **Broadcast-quality** display

### Hardware Scrolling
Unique among 8-bit micros, the BBC could scroll smoothly:
```basic
*FX 19  : REM Wait for vertical sync
?&FE00=&0C : ?&FE01=&30  : REM Set CRTC start address
```

Change the start address for instant hardware scrolling—no CPU overhead!

## Sound System: Sophistication

The BBC's sound system was remarkably advanced:

### ENVELOPE Command
```basic
ENVELOPE 1,1,-1,1,-1,100,20,100,-1,0,0,-100,100,100
SOUND 1,-15,100,20
```

Define complex ADSR envelopes for realistic instrument sounds.

### Speech Synthesis
With the Speech ROM:
```basic
*SPEAK "HELLO WORLD"
```

The BBC could talk—mind-blowing in 1981!

## Expansion Philosophy

The BBC Micro was designed to grow:

### The Tube
Connect second processors for incredible power:
- **6502 Second Processor** - 3MHz 6502 with 64KB RAM
- **Z80 Second Processor** - Run CP/M software
- **32016 Second Processor** - 32-bit processing in 1985!
- **ARM Evaluation System** - Where ARM was born

### Sideways ROM
16KB ROM banks could contain:
- Languages (FORTH, LISP, Pascal)
- Word processors (View, WordWise)
- Utilities (Disc Doctor, Toolkit)
- Games (Elite required a ROM!)

## Educational Impact

The BBC Micro transformed UK education:

### Computer Literacy Project
- **TV series** teaching programming to millions
- **Standardized hardware** in every school
- **Networked classrooms** via Econet
- **Teacher training** programs nationwide

### Software Excellence
Educational software set new standards:
- **Granny's Garden** - Adventure learning
- **Podd** - Creative play
- **L** - Logo for children
- **Music 500** - Professional music composition

## Games That Defined a Generation

### Elite (1984)
The BBC Micro's killer app:
- **3D wireframe graphics** at acceptable speeds
- **Eight galaxies** with 256 planets each
- **Trading, combat, and exploration**
- Proved 8-bit computers could handle complex 3D

### Repton Series
Platform puzzle perfection:
- **Smooth scrolling** using hardware features
- **Physics simulation** (rocks, eggs, falling)
- **Level editor** included
- Spawned numerous sequels

## Programming Techniques

### Mode Splitting
Change graphics modes mid-screen:
```assembly
.irq_handler
  LDA #&02 : STA &FE00  ; Select CRTC register 2
  LDA #&23 : STA &FE01  ; Horizontal position
  ; Wait for specific scanline
  ; Switch to different mode
```

### Color Cycling
Instant animation through palette changes:
```basic
FOR I%=0 TO 7
  VDU 19,I%,I%+1,0,0,0
  *FX 19
NEXT
```

## The Acorn Legacy

The BBC Micro's influence extends far beyond the 1980s:
- **ARM processors** - Developed for the BBC's successor
- **Raspberry Pi** - Spiritual successor for modern education
- **UK games industry** - Many developers started on BBC Micros
- **Network computing** - Econet pioneered classroom networking

## Why Master the BBC Micro?

The BBC teaches advanced concepts clearly:

1. **Structured Programming** - Procedures and local variables in BASIC
2. **Hardware Control** - Direct CRTC and VIA programming
3. **Networking** - Econet was revolutionary for its time
4. **Expansion Architecture** - Understanding buses and interfaces
5. **Mixed Language Development** - BASIC and assembly together

## The Code198x Platinum Curriculum

Our 4,096-lesson program covers everything:

### Deep Dive Topics
- Master all 8 graphics modes and their trade-offs
- Program the 6845 CRTC for advanced effects
- Understand the 6522 VIA for I/O operations
- Create networked multiplayer games via Econet
- Explore second processors and the Tube
- Build 35 games showcasing every BBC feature
- Develop educational software using BBC techniques

The BBC Micro represents the pinnacle of 8-bit educational computing—powerful enough for professionals, accessible enough for children, and expandable enough to remain relevant for over a decade. It didn't just teach programming; it created a generation of programmers who would go on to shape the modern tech industry.