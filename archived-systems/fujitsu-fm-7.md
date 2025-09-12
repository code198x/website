---
name: "FM-7"
slug: "fujitsu-fm-7"
full_name: "Fujitsu FM-7 (Fujitsu Micro 7)"
manufacturer: "Fujitsu"
model_number: "FM-7, FM-77, FM77AV"
alternative_names: ["Fujitsu Micro 7", "FM77AV"]
medal_tier: "silver"
total_lessons: 1024
total_games: 15
estimated_duration: "6-12 weeks"
cpu_architecture: "6809"
difficulty_level: "intermediate"
architecture_family: "6809"
prerequisite_platforms: ["dragon-32"]
recommended_next: ["pc-88", "x68000"]

cpu: "Motorola MC6809"
cpu_details:
  architecture: "8-bit"
  instruction_set: "6809"
  addressing_modes: ["Immediate", "Direct", "Extended", "Indexed", "Relative", "Inherent"]
  registers: "Two 8-bit accumulators (A, B), can be combined as 16-bit (D); X, Y, U, S pointer registers; DP direct page register; CC condition codes"
clock_speed: "1.2 MHz (FM-7), 2.0 MHz (FM-77AV)"

ram: "64 KB (FM-7), 128-512 KB (FM77AV)"
ram_details:
  user_available: "~48 KB (FM-7), varies by model (FM77AV)"
  video_ram: "48 KB dedicated VRAM (3 planes × 16 KB)"
  expansion_options: ["Memory expansion cards up to 512 KB"]

rom: "48 KB"
rom_contents: ["F-BASIC interpreter", "System monitor", "I/O routines", "Font ROM"]

video:
  processor: "Custom graphics subsystem"
  resolution: "640×200 pixels (8 colors), 320×200 pixels (4096 colors)"
  colors: "4096 colors (12-bit palette) on FM77AV, 8 colors on FM-7"
  display_modes:
    - "Text mode (80×25, 40×25, 80×20)"
    - "Graphics 640×200 (8 colors from palette)"
    - "Graphics 320×200 (4096 colors, FM77AV)"
    - "Mixed text/graphics modes"
    - "Multiple graphics planes"
  sprites:
    count: 0
    size: "Software sprites only"
  hardware_scrolling: true
  raster_interrupts: false

audio:
  chip: "Motorola MC6840 (FM-7), YM2203 OPN (FM77AV)"
  channels: 3
  features:
    - "PSG sound synthesis (FM-7)"
    - "FM synthesis + PSG (FM77AV)"
    - "Envelope control"
    - "Noise generation"
    - "Music programming capabilities"
  sample_playback: false
  synthesis_types: ["PSG", "FM synthesis"]

storage:
  - "Compact Cassette tape"
  - "5.25\" floppy disk"
  - "3.5\" floppy disk (later models)"
  - "Bubble memory (some models)"
storage_details:
  built_in: ["Cassette interface"]
  expansion: ["Floppy disk drives", "Bubble memory units"]
  typical_capacity:
    cassette: "~100 KB per side"
    floppy: "320 KB (5.25\"), 720 KB (3.5\")"

io_ports:
  - "2 × Joystick ports"
  - "Printer port (Centronics)"
  - "Serial port (RS-232C)"
  - "Cassette interface"
  - "Expansion slots"
  - "Light pen interface"

expansion_options:
  - "Memory expansion cards"
  - "Floppy disk controller"
  - "Modem cards"
  - "Sound enhancement cards"
  - "Graphics expansion cards"

price_at_launch:
  global: "126,000 JPY (FM-7)"
  countries:
    - country: "Japan"
      price: "126000"
      currency: "JPY"

release_date:
  global: 1982-11-01
  countries:
    - country: "Japan"
      date: 1982-11-01

discontinued: 1989-01-01
production_run: "1982-1989"
units_sold: "~400,000 units (total FM series)"

country_of_origin: "Japan"
operating_system: "F-BASIC (built-in interpreter)"
programming_languages: ["F-BASIC", "6809 Assembly", "COBOL", "PASCAL"]

target_market: ["Business users", "Education", "Home users", "Graphics professionals"]
market_positioning: "High-end Japanese business computer with advanced graphics"
competition: ["PC-8801", "MSX", "Sharp X1", "NEC PC-98"]

variants:
  - name: "FM-7"
    model_number: "FM-7"
    release_date:
      global: 1982-11-01
    differences: "Original model with 8-color graphics, MC6809 at 1.2 MHz"
    significance: "Foundation model that established the FM series"
  - name: "FM-77"
    model_number: "FM-77"
    release_date:
      global: 1984-05-01
    differences: "Enhanced model with improved I/O, bubble memory option"
    significance: "Business-focused enhancement with better expansion"
  - name: "FM77AV"
    model_number: "FM77AV"
    release_date:
      global: 1985-10-01
    differences: "Major upgrade: 4096 colors, FM sound synthesis, faster CPU"
    significance: "Multimedia powerhouse with advanced audio/visual capabilities"
  - name: "FM77AV40"
    model_number: "FM77AV40"
    release_date:
      global: 1986-11-01
    differences: "40-column display variant of FM77AV for TV use"
    significance: "Consumer-oriented version for home use"

notable_software:
  - name: "Hydlide"
    type: "Game"
    year: 1984
    developer: "T&E Soft"
    publisher: "T&E Soft"
    significance: "Pioneering action RPG, later ported worldwide"
  - name: "Ys"
    type: "Game"
    year: 1987
    developer: "Nihon Falcom"
    publisher: "Nihon Falcom"
    significance: "Classic action RPG series began on FM-7/77"
  - name: "Dragon Slayer"
    type: "Game"
    year: 1984
    developer: "Nihon Falcom"
    publisher: "Nihon Falcom"
  - name: "BASIC Master Jr."
    type: "Programming Environment"
    year: 1983
    developer: "Fujitsu"
    publisher: "Fujitsu"
  - name: "Multi-Plan"
    type: "Application"
    year: 1983
    developer: "Microsoft"
    publisher: "ASCII Corporation"

software_library_size:
  commercial_games: "~800"
  applications: "~300"
  total_titles: "~1100"

development_tools: ["F-BASIC interpreter", "6809 Assemblers", "COBOL compiler", "Pascal compiler", "Graphics libraries"]
programming_characteristics:
  - "Powerful 6809 processor with clean instruction set"
  - "Advanced graphics programming with multiple planes"
  - "High-resolution color graphics capabilities"
  - "Sophisticated I/O handling"
  - "Business-oriented programming features"
hardware_quirks:
  - "Three separate graphics planes for complex layered graphics"
  - "Unique Japanese character set support"
  - "High-resolution graphics requiring careful memory management"
  - "Complex color palette system on FM77AV models"

historical_significance: "The FM-7 series represented Fujitsu's successful entry into the personal computer market, establishing advanced graphics and business capabilities that influenced Japanese computer development. It was particularly important in business and educational markets."

cultural_impact: "The FM-7 helped establish Japan as a major force in personal computing and demonstrated how Japanese manufacturers could create systems optimized for local market needs while maintaining international technical competitiveness."

innovation_highlights:
  - "High-resolution color graphics ahead of its time"
  - "Multiple graphics planes for layered visual effects"
  - "Advanced sound synthesis on FM77AV models"
  - "Business-oriented design with professional capabilities"
  - "Sophisticated expansion architecture"

industry_influence: "The FM-7's graphics capabilities and business focus influenced later Japanese computer designs and demonstrated the viability of targeting professional and educational markets alongside home users."

educational_value:
  programming_concepts:
    - "Advanced 6809 assembly programming"
    - "Multi-plane graphics programming"
    - "High-resolution color graphics"
    - "Business application development"
    - "Sound synthesis programming"
  hardware_concepts:
    - "Complex graphics architecture"
    - "Memory-mapped I/O systems"
    - "Multi-plane video systems"
    - "Color palette management"
    - "Expansion bus architecture"
  historical_lessons:
    - "Japanese computer market development"
    - "Business vs. consumer computer design"
    - "Graphics technology evolution"
    - "Regional market adaptation"
  why_study_this_system: "The FM-7 offers insight into Japanese computer design philosophy and advanced graphics programming techniques that were ahead of their time."

learning_advantages:
  - "Advanced graphics programming techniques"
  - "6809 processor mastery"
  - "Multi-layered visual system programming"
  - "Business application development skills"
  - "Understanding of Japanese computing culture"

common_beginner_projects:
  - "Multi-plane graphics demonstrations"
  - "High-resolution color artwork programs"
  - "Business calculator applications"
  - "Music composition programs"

emulated: true
emulators:
  - name: "XM7"
    platform: "Windows"
    accuracy: "high"
    notes: "Dedicated FM-7 series emulator"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "high"
    notes: "Good support for FM-7 series"
  - name: "Takeda"
    platform: "Multi-platform"
    accuracy: "good"
    notes: "Cross-platform FM-7 emulation"

preservation_status: "good"
hardware_availability: "rare"

technical_documentation:
  - title: "FM-7 Technical Reference Manual"
    type: "hardware_reference"
  - title: "F-BASIC Programming Guide"
    type: "programming_guide"
  - title: "FM77AV Graphics Programming"
    type: "programming_guide"

description: "Fujitsu's sophisticated Japanese computer featuring advanced multi-plane graphics, business capabilities, and the powerful 6809 processor."
image: "/images/systems/fm-7.jpg"

order: 33
---

# FM-7: Fujitsu's Graphics Pioneer

The **Fujitsu FM-7** series represented Japan's bold entry into advanced personal computing, offering sophisticated graphics capabilities and business-oriented features that were years ahead of their international competition. Built around the powerful Motorola 6809 processor from 1982-1989, the FM-7 family demonstrated how Japanese manufacturers could create technically superior systems tailored for both business and creative applications.

## Advanced Graphics Architecture

The FM-7's graphics system was revolutionary for its time, featuring **multiple independent graphics planes** that could be layered and manipulated separately:

### Multi-Plane Graphics System
- **Three graphics planes** (Red, Green, Blue) could be combined or used independently
- **640×200 resolution** with 8 simultaneous colors from a larger palette
- **320×200 resolution** with 4096 colors on FM77AV models
- **Hardware scrolling** and plane manipulation capabilities

### Programming the Graphics Planes
```assembly
; Example: Set up multi-plane graphics
        LDA #$07        ; Enable all three planes
        STA $FD0F       ; Graphics plane control register
        
        LDA #$C0        ; Set high-resolution mode
        STA $FD12       ; Display mode register
        
        ; Draw to red plane
        LDA #$01
        STA $FD0F       ; Select red plane only
        JSR DRAW_SPRITE
        
        ; Draw to green plane  
        LDA #$02
        STA $FD0F       ; Select green plane
        JSR DRAW_BACKGROUND
```

This multi-plane system allowed for:
- **Layered graphics effects** impossible on single-plane systems
- **Efficient animation** by moving planes independently
- **Complex visual compositions** with separate foreground/background elements
- **Smooth scrolling** of individual layers

## The 6809 Powerhouse

Like the Dragon 32/64, the FM-7 was built around the **Motorola MC6809**, but Fujitsu optimized the entire system to take advantage of this processor's capabilities:

### Enhanced Performance
- **1.2 MHz operation** (2.0 MHz on FM77AV) with zero-wait-state memory
- **Efficient graphics operations** using 16-bit arithmetic
- **Advanced I/O handling** with sophisticated interrupt systems
- **Business-class reliability** with robust error handling

### Programming Advantages
The 6809's architecture was ideal for the FM-7's advanced features:
```assembly
; Efficient multi-plane manipulation
PLANE_COPY:
        LDX #SOURCE_DATA    ; Source in X register
        LDY #VRAM_BASE      ; Destination in Y
        LDD #BYTES_TO_COPY  ; Count in D accumulator
COPY_LOOP:
        LDA ,X+             ; Load and post-increment X
        STA ,Y+             ; Store and post-increment Y  
        SUBD #1             ; Decrement 16-bit counter
        BNE COPY_LOOP       ; Continue until zero
        RTS
```

## F-BASIC: Professional Programming Environment

The FM-7's **F-BASIC** interpreter was significantly more sophisticated than typical home computer BASIC dialects:

### Advanced Graphics Commands
```basic
100 SCREEN 3        ' High-resolution graphics mode
110 PSET (320,100,7) ' Plot pixel with color
120 LINE (0,0)-(639,199),4  ' Draw diagonal line
130 CIRCLE (320,100),50,2   ' Draw circle
140 PAINT (320,100),1,2     ' Fill with color
150 GET (300,90)-(340,110),A$  ' Capture screen area
160 PUT (400,90),A$,PSET       ' Place captured area
```

### Business Features
- **Professional I/O operations** for business applications
- **Database manipulation** commands
- **Advanced string handling** for data processing
- **Financial calculation** functions
- **Report generation** capabilities

## Sound Evolution: From Simple to Sophisticated

The FM-7 series showed remarkable audio evolution:

### FM-7 Audio (1982)
- **MC6840 timer-based sound** - simple but effective
- **Three-channel PSG-style synthesis**
- **Programmable envelopes** and waveforms

### FM77AV Audio (1985)  
- **YM2203 OPN chip** - true FM synthesis
- **6 FM channels** plus 3 PSG channels
- **Advanced music programming** capabilities
- **Professional music composition** tools

```basic
' FM77AV music programming example
PLAY "T120 O4 CDE FGA"     ' Simple melody
FMSETUP 0,1,2,3,4,5        ' Configure FM channels
FMPLAY 0,"C4"              ' Play FM note on channel 0
```

## Japanese Computing Culture

The FM-7 reflected uniquely Japanese approaches to computer design:

### Business Integration
- **Professional appearance** suitable for office environments
- **Reliable operation** with business-grade components
- **Extensive expansion options** for growing business needs
- **Integration with Japanese business practices**

### Educational Focus
- **School computer labs** throughout Japan
- **Programming education** integrated with curriculum
- **Technical training** for students and professionals
- **Regional software development** community

### Creative Applications
The FM-7's graphics capabilities made it popular for:
- **Computer art and design** projects
- **Animation and multimedia** (early examples)
- **Music composition** and sound design
- **Game development** with sophisticated visuals

## Game Development Excellence

The FM-7 hosted several legendary game series that later became internationally famous:

### Hydlide (1984)
- **Action RPG pioneer** that influenced the genre
- **Real-time combat** in an RPG framework
- **Non-linear exploration** and character growth
- Demonstrated the FM-7's capability for complex games

### Ys Series (1987)
- **Nihon Falcom's masterpiece** series
- **Advanced music and graphics** showcase
- **Smooth scrolling action** utilizing hardware capabilities  
- **Epic storytelling** combined with technical excellence

### Dragon Slayer Series
- **Early computer RPGs** that established many conventions
- **Complex character development** systems
- **Innovative gameplay mechanics** for the era

## Technical Programming Challenges

Programming the FM-7 required mastering several advanced concepts:

### Multi-Plane Graphics Management
```assembly
; Animate by cycling through planes
ANIMATE_SPRITE:
        LDA FRAME_COUNT
        ANDA #$07       ; Cycle through 8 frames
        TAB             ; Use as plane selector
        LDA PLANE_TABLE,B
        STA $FD0F       ; Select appropriate plane
        JSR DRAW_FRAME
        RTS

PLANE_TABLE:
        FCB $01,$02,$04,$03,$05,$06,$07,$01
```

### High-Resolution Graphics Optimization
- **Memory bandwidth management** for smooth animation
- **Plane coordination** for layered effects
- **Color palette optimization** for maximum visual impact
- **Scrolling algorithms** that utilized hardware features efficiently

### Sound Programming
- **Timer-based music** on original FM-7
- **FM synthesis programming** on FM77AV models  
- **Audio-visual synchronization** for games and applications
- **Music data compression** techniques

## Business Applications Development

The FM-7 excelled at business software development:

### Database Applications
```basic
' Simple inventory management
10 DIM ITEM$(100),QTY(100),PRICE(100)
20 FOR I=1 TO RECORDS
30   INPUT "Item:",ITEM$(I)
40   INPUT "Quantity:",QTY(I)
50   INPUT "Price:",PRICE(I)
60 NEXT I
70 GOSUB SORT_DATABASE
80 GOSUB PRINT_REPORT
```

### Financial Software
- **Spreadsheet applications** with graphics capabilities
- **Accounting systems** designed for Japanese business practices
- **Statistical analysis** tools with visual output
- **Report generation** with mixed text and graphics

## Legacy and Modern Relevance

### Technical Influence
The FM-7's innovations influenced:
- **Multi-plane graphics** systems in later computers
- **Business computer design** philosophy in Japan
- **Sound synthesis integration** in personal computers
- **Educational computing** approaches

### Programming Lessons
Modern developers studying the FM-7 learn:
- **Multi-layer graphics programming** concepts applicable to modern game engines
- **6809 assembly language** skills transferable to embedded systems
- **Business application development** principles
- **Sound synthesis programming** relevant to modern audio software

## The Code198x FM-7 Experience

Our **1,024-lesson Silver curriculum** explores the FM-7's capabilities across **6-12 weeks**:

### Weeks 1-2: Foundation (256 lessons)
- 6809 assembly language and F-BASIC programming
- Multi-plane graphics system understanding
- Sound programming on both FM-7 and FM77AV models
- Japanese computing culture and business applications

### Weeks 3-8: Advanced Programming (512 lessons)
- Complex graphics effects using multiple planes
- Music and sound synthesis programming
- Business application development
- Game programming utilizing advanced features

### Weeks 9-12: Mastery Projects (256 lessons)
- **15 complete applications** including games and business software
- Advanced graphics demonstrations
- Music composition and sound design projects
- Understanding FM-7's place in Japanese computing history

## Why Study the FM-7 Today?

The FM-7 offers unique educational value:

1. **Advanced Graphics Programming** - Multi-plane systems concepts applicable to modern game development
2. **Japanese Computing Culture** - Understanding how different markets drive different technical solutions
3. **6809 Mastery** - The most sophisticated 8-bit processor used in real applications
4. **Business Applications** - Professional software development in constrained environments
5. **Historical Perspective** - How technical excellence competes with market positioning

## Cultural Bridge

The FM-7 serves as a bridge between Eastern and Western computing philosophies:
- **Technical sophistication** meeting business practicality
- **Graphics innovation** serving both creative and professional needs
- **Educational focus** preparing students for technology careers
- **Regional adaptation** while maintaining international technical standards

The Fujitsu FM-7 proved that innovation could come from anywhere, and that understanding local market needs while pushing technical boundaries could create something truly special. It stands as a testament to Japanese engineering excellence and the global nature of computing innovation in the 1980s.