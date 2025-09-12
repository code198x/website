---
name: "Microbee"
slug: "microbee-systems-microbee"
manufacturer: "Applied Technology"
model_number: "32IC"
medal_tier: "bronze"
total_lessons: 512
total_games: 8
estimated_duration: "2-4 weeks"
cpu_architecture: "Z80"
difficulty_level: "intermediate"
architecture_family: "8-bit"
prerequisite_platforms: ["zx-spectrum"]
recommended_next: ["commodore-64", "apple-ii"]
cpu: "Zilog Z80A"
clock_speed: "2 MHz"
ram: "32 KB base (expandable to 128 KB)"
rom: "16 KB system ROM + 2 KB character ROM"
video:
  processor: "Motorola 6845 CRTC"
  resolution: "80×25 text, 512×256 graphics"
  colors: "8 colors (3-bit)"
  display_modes:
    - "80×25 text mode"
    - "64×16 chunky graphics"
    - "512×256 high resolution"
    - "Mixed text/graphics modes"
audio:
  chip: "Speaker + tone generator"
  channels: 1
  features:
    - "Square wave generation"
    - "Programmable frequency"
    - "Simple sound effects"
    - "Cassette interface audio"
storage:
  - "Cassette tape (1200 baud)"
  - "5.25\" floppy disk (optional)"
  - "ROM cartridges"
io_ports:
  - "Full QWERTY keyboard"
  - "Function keys F1-F12"
  - "Numeric keypad"
  - "Parallel printer port"
  - "Serial RS-232 port"
  - "Light pen interface"
price_at_launch:
  global: "$999 AUD (1982)"
  countries:
    - country: "Australia"
      price: "999"
      currency: "AUD"
    - country: "New Zealand"
      price: "1299"
      currency: "NZD"
release_date:
  global: 1982-09-01
  countries:
    - country: "Australia"
      date: 1982-09-01
    - country: "New Zealand"
      date: 1983-01-01
discontinued: 1991-01-01
units_sold: "120,000"
country_of_origin: "Australia"
operating_system: "MicroWorld BASIC + CP/M"
emulated: true
emulators:
  - name: "ubee512"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "high"
  - name: "MicroBee Emulator"
    platform: "Windows"
    accuracy: "good"
variants:
  - name: "Microbee 16 Standard"
    model_number: "16S"
    release_date:
      global: 1982-09-01
    differences: "16KB RAM, basic model"
  - name: "Microbee 32 IC"
    model_number: "32IC"
    release_date:
      global: 1983-03-01
    differences: "32KB RAM, integrated circuits"
  - name: "Microbee 64 Premium"
    model_number: "64P"
    release_date:
      global: 1984-01-01
    differences: "64KB RAM, premium features"
  - name: "Microbee 128 Professional"
    model_number: "128P"
    release_date:
      global: 1985-01-01
    differences: "128KB RAM, professional features"
  - name: "Microbee 256TC"
    model_number: "256TC"
    release_date:
      global: 1987-01-01
    differences: "256KB RAM, telecomputer features"
notable_software:
  - name: "Hoards of the Deep Realm"
    type: "Game"
    year: 1984
    developer: "Dreamtime Software"
    publisher: "Applied Technology"
  - name: "Microbee Logo"
    type: "Educational"
    year: 1983
    developer: "Applied Technology"
    publisher: "Applied Technology"
  - name: "Touch Typing Tutor"
    type: "Educational"
    year: 1983
    developer: "Applied Technology"
    publisher: "Applied Technology"
  - name: "The Artist"
    type: "Graphics"
    year: 1984
    developer: "Applied Technology"
    publisher: "Applied Technology"
  - name: "Database 3000"
    type: "Productivity"
    year: 1985
    developer: "Applied Technology"
    publisher: "Applied Technology"
  - name: "Meteor Mission"
    type: "Game"
    year: 1983
    developer: "Independent"
    publisher: "Applied Technology"
  - name: "MicroWorld Word Processor"
    type: "Productivity"
    year: 1983
    developer: "Applied Technology"
    publisher: "Applied Technology"
  - name: "Adventure in Humongous Cave"
    type: "Game"
    year: 1984
    developer: "Independent"
    publisher: "Applied Technology"
historical_significance: "The Microbee was Australia's most successful home computer, designed specifically for educational markets with professional keyboard, built-in programming languages, and extensive documentation. It pioneered educational computing in Australia/New Zealand and demonstrated how regional manufacturers could create computers tailored to local educational needs."
description: "Australia's educational computer champion with professional features and strong BASIC programming focus."
image: "/images/systems/microbee.jpg"
order: 62
---

# Microbee: Australia's Educational Computing Pioneer

The **Microbee** stands as Australia's most successful home computer, designed from the ground up to serve educational markets with professional-grade features and extensive programming capabilities. Created by Applied Technology in Sydney, this Z80-based system demonstrated how regional manufacturers could develop computers specifically tailored to local educational needs and market conditions.

## Australian Innovation

The Microbee emerged from Australia's unique computing landscape:
- **Educational focus** - designed for schools and learning environments
- **Professional keyboard** - full QWERTY with function keys and numeric keypad
- **Local manufacturing** - Australian-designed and assembled
- **Regional software** - titles developed specifically for Australian/New Zealand markets
- **Strong documentation** - comprehensive manuals and educational materials

This local approach created a computer perfectly suited to Australian educational requirements.

## Educational Philosophy

Applied Technology positioned the Microbee as a serious educational tool:
- **Programming emphasis** - multiple built-in languages (BASIC, Logo, Assembly)
- **Professional documentation** - detailed technical manuals
- **Teacher support** - extensive educational resources
- **Classroom durability** - robust construction for school environments
- **Expandability** - growth path from basic to professional configurations

The system was designed to grow with students from elementary programming to advanced computing concepts.

## Technical Architecture

### Z80A Processing Power
The Microbee used proven, reliable architecture:
- **2 MHz Z80A CPU** - standard 8-bit processor with extensive software support
- **32 KB base RAM** - expandable to 128 KB in premium models
- **16 KB system ROM** - containing BASIC interpreter and system routines
- **2 KB character ROM** - custom character set for text display

### Motorola 6845 Video Controller
Professional video capabilities unusual for home computers:
- **80×25 text display** - matching professional terminals
- **512×256 high resolution** - detailed graphics capabilities
- **Mixed text/graphics** - combining modes on single screen
- **Hardware scrolling** - smooth text movement
- **8-color palette** - sufficient for educational graphics

### Comprehensive I/O System
Extensive connectivity for educational environments:
- **Full QWERTY keyboard** - professional typing experience
- **Function keys F1-F12** - programmable shortcuts
- **Numeric keypad** - mathematical input convenience
- **Parallel printer port** - hardcopy output
- **Serial RS-232 port** - terminal communication
- **Light pen support** - interactive graphics input

## Programming Environment

### MicroWorld BASIC
The Microbee featured an enhanced BASIC interpreter:
```basic
10 REM Microbee educational program
20 CLS : PRINT "Learning Programming"
30 FOR I = 1 TO 10
40   PRINT I; " squared is "; I * I
50 NEXT I
60 INPUT "Press ENTER to continue"; A$
```

Enhanced commands included:
- **Graphics primitives** - LINE, CIRCLE, PLOT commands
- **Sound generation** - SOUND and PLAY statements  
- **File operations** - SAVE, LOAD, CATALOG commands
- **Machine language interface** - USR and PEEK/POKE for assembly integration

### Logo Programming Language
Many Microbees included Logo for educational programming:
```logo
TO SQUARE :SIZE
  REPEAT 4 [FORWARD :SIZE RIGHT 90]
END

TO FLOWER :SIZE
  REPEAT 8 [SQUARE :SIZE RIGHT 45]
END
```

Logo provided:
- **Turtle graphics** - intuitive programming for children
- **Procedural programming** - learning function definition
- **Mathematical concepts** - geometry through programming
- **Creative expression** - artistic programming projects

### Assembly Language Development
The system supported professional assembly programming:
```assembly
; Microbee Z80 assembly example
ORG 0900H
START:  LD HL, MESSAGE
        LD C, 09H       ; DOS print string function
        CALL 0005H      ; Call BDOS
        RET

MESSAGE: DB 'Hello from Microbee!$'
```

## Educational Software Ecosystem

### Learning Programs
The Microbee featured extensive educational software:
**Touch Typing Tutor** - Professional keyboard skills training
**Microbee Logo** - Child-friendly programming environment
**Mathematics Tutor** - Arithmetic and algebra practice
**Spelling Bee** - Vocabulary and spelling improvement

### Creative Applications
**The Artist** - Graphics creation and editing program
**Music Composer** - Simple music creation tools
**Story Writer** - Word processing for creative writing
**Database 3000** - Introduction to data management concepts

### Games with Educational Value
**Adventure in Humongous Cave** - Text adventure promoting reading
**Meteor Mission** - Action game with mathematical elements
**Hoards of the Deep Realm** - Strategy game encouraging problem-solving

## Why Study Microbee Development?

### Educational Programming Concepts
The Microbee teaches fundamental educational computing:
- **BASIC programming pedagogy** - structured learning progression
- **Logo turtle graphics** - visual programming concepts
- **Mixed-mode programming** - combining high-level and assembly languages
- **Educational software design** - creating engaging learning experiences

### Professional Development Practices
The system introduced professional concepts:
- **Structured programming** - proper code organization
- **Documentation standards** - comprehensive technical writing
- **User interface design** - creating intuitive educational interfaces
- **Cross-platform development** - portable programming techniques

### Regional Computing History
Understanding the Microbee reveals:
- **Local market adaptation** - designing for specific regional needs
- **Educational technology evolution** - early computer-assisted learning
- **Small-scale manufacturing** - regional electronics production
- **Community-driven software development** - local programming communities

## The Bronze Tier Curriculum

Our 512-lesson Bronze curriculum emphasizes educational programming:

### Phase 1: Educational Foundations (256 lessons)
- Z80 assembly language in educational context
- Enhanced BASIC programming techniques
- Logo turtle graphics programming
- Educational software design principles

### Phase 2: Advanced Applications (256 lessons)
- Mixed-mode programming projects
- Custom educational game development
- Database and productivity applications
- Performance optimization for 2 MHz processing

You'll create 8 educational projects ranging from simple learning games to complex interactive tutorials, exploring the Microbee's role as a teaching tool.

## Australian Computing Context

### Educational Computing Pioneer
The Microbee influenced Australian computing education:
- **School computer labs** - many Australian schools standardized on Microbees
- **Teacher training programs** - extensive professional development
- **Local software industry** - Australian developers created specialized software
- **Computing literacy** - introduced programming to thousands of students

### Market Competition
The Microbee competed successfully against international systems:
- **Apple II** - more expensive, less educational focus
- **Commodore 64** - gaming-oriented, less professional
- **IBM PC** - prohibitively expensive for schools
- **BBC Micro** - similar educational focus but UK-oriented

### Long-term Impact
The Microbee's influence on Australian computing:
- **Programming education** - established BASIC and Logo as teaching languages
- **Computer literacy** - trained a generation of Australian programmers
- **Local industry** - supported Australian software development
- **Educational methodology** - computer-assisted learning techniques

## Technical Innovation

The Microbee pioneered several features for educational computing:
- **Integrated programming environments** - multiple languages in ROM
- **Professional keyboards** - proper typing experience for schools
- **Comprehensive documentation** - technical manuals rivaling professional systems
- **Expandable architecture** - growth path from basic to advanced configurations

## Manufacturing and Distribution

Applied Technology created an impressive local operation:
- **Australian design team** - local engineers and programmers
- **Sydney assembly** - manufactured in Australia with some imported components
- **Educational partnerships** - direct relationships with schools and education departments
- **Dealer network** - comprehensive distribution across Australia and New Zealand

## The "WOW" Moment

When you create your first comprehensive educational program—perhaps an interactive mathematics tutor that combines BASIC programming logic, Logo turtle graphics for visual demonstration, and assembly language routines for smooth animation—you'll understand the Microbee's educational power. The seamless integration of multiple programming languages in a single system was genuinely impressive for educational computing in the 1980s.

Learning Microbee development provides insight into educational software design, multi-language programming environments, and the importance of local adaptation in computer design. It's a fascinating study in how regional manufacturers could compete successfully against international giants by focusing on specific market needs and building strong local communities around their products.