---
name: "Thomson TO7/TO8"
slug: "thomson-to7"
manufacturer: "Thomson"
release_year: 1982
medal_tier: "silver"
total_lessons: 1024
total_games: 15
estimated_duration: "6-12 weeks"
cpu: "Motorola 6809E"
cpu_speed: "1 MHz"
memory: "24KB-128KB RAM"
ram: "24KB to 128KB"
display: "320×200 16 colors, 640×200 2 colors"
sound: "1-bit beeper"
storage: ["Cassette", "3.5\" floppy"]
input: "Keyboard, light pen, joystick"
notable_games:
  - "Sapiens"
  - "Arcadia"
  - "L'Aigle d'Or"
  - "Sram"
  - "Le Diamant de l'île Maudite"
  - "Défense"
  - "Torpedo"
  - "Galactic Attack"
  - "Tennis"
  - "Space Tunnel"
  - "Atomic"
  - "Reversi"
  - "Jeu de Dames"
  - "Bataille Navale"
  - "Othello"
historical_significance: "The Thomson computers dominated French education in the 1980s, used in over 100,000 schools through the 'Plan Informatique pour Tous' initiative. They represented France's attempt at technological independence in computing."
why_learn: "Thomson systems offer insight into alternative computer architectures and the unique French approach to educational computing. The 6809 processor and light pen interface provide fascinating contrasts to more common 8-bit systems."
unique_features:
  - "Light pen interface for direct screen interaction"
  - "6809E processor with advanced addressing modes"
  - "French-specific character set and QWERTY keyboard"
  - "Educational software ecosystem"
  - "Unique memory mapping system"
  - "TO8 compatibility with CPC disk format"
description: "The Thomson TO7 and TO8 were France's answer to the home computer revolution, designed specifically for education and backed by government mandate. These machines featured the sophisticated Motorola 6809E processor and pioneered light pen interaction, creating a unique computing experience that differed significantly from their Anglo-American counterparts. Learning Thomson development reveals alternative approaches to 8-bit computing and the fascinating world of French educational software."
release_date:
  global: 1982-09-01
country_of_origin: "France"
image: "/systems/thomson-to7.jpg"
order: 15
---

# Thomson TO7/TO8: France's Educational Computing Pioneer

The Thomson TO7 and TO8 represent one of computing history's most interesting "what if" scenarios - a nationally-mandated educational computer that dominated French schools but remained largely unknown elsewhere. These machines showcase alternative approaches to 8-bit computing and offer unique insights into educational software design.

## Technical Architecture

### Motorola 6809E Processor
The heart of Thomson computers was the sophisticated 6809E, running at 1MHz:
- 16-bit arithmetic capabilities in an 8-bit package
- Advanced addressing modes including position-independent code
- Two stack pointers and two index registers
- More orthogonal instruction set than the 6502 or Z80
- Natural support for structured programming languages

### Memory Organization
Thomson systems used a unique memory mapping approach:
- **TO7**: 24KB RAM (expandable to 48KB)
- **TO8**: 64KB RAM standard, expandable to 128KB
- Banked memory system with ROM overlays
- Video memory separate from main RAM
- Light pen interface mapped to specific addresses

### Graphics and Display
The Thomson's display system was ahead of its time:
- **Mode 40**: 320×200 with 16 colors from 4096-color palette
- **Mode 80**: 640×200 with 2 colors
- Hardware sprites for smooth animation
- Light pen support for direct screen interaction
- Efficient video memory organization

## The Light Pen Revolution

Thomson computers were among the first home systems to feature integrated light pen support:

### Hardware Interface
```assembly
; Light pen coordinate reading
LDA   LIGHTX      ; Read X coordinate
LDB   LIGHTY      ; Read Y coordinate
STD   POSITION    ; Store combined coordinates
```

### Educational Applications
The light pen transformed how users interacted with educational software:
- Direct object manipulation on screen
- Drawing and painting programs
- Interactive geometry lessons
- Point-and-click adventure games

## French Educational Ecosystem

### Plan Informatique pour Tous
The French government's ambitious 1985 plan:
- 100,000+ Thomson computers in schools
- Comprehensive teacher training programs
- Standardized educational software
- French-language programming environments

### Educational Software Design
Thomson educational games pioneered several concepts:
- **Contextualized Learning**: Games embedded historical and cultural content
- **Adaptive Difficulty**: Software that adjusted to student progress
- **Collaborative Features**: Multi-student interaction modes
- **Assessment Integration**: Built-in progress tracking

## Notable Games and Software

### Sapiens
A groundbreaking strategy game about human evolution:
- Complex simulation of prehistoric societies
- Educational content about anthropology
- Innovative use of light pen for unit control
- Multiple difficulty levels for different ages

### L'Aigle d'Or (The Golden Eagle)
Adventure game showcasing Thomson's capabilities:
- Full-screen graphics with 16 colors
- Light pen interaction for object manipulation
- Educational elements about French history
- Text parser in French language

### Arcadia
Platform adventure demonstrating smooth scrolling:
- Hardware sprite utilization
- Multi-screen exploration
- Physics-based jumping mechanics
- Colorful graphics showcasing the palette

## Programming Environment

### BASIC Dialect
Thomson BASIC included unique features:
```basic
10 CONSOLE ,,,,1    ' Enable light pen
20 PEN X,Y          ' Get pen coordinates
30 IF PEN(0) THEN GOSUB 1000  ' Pen pressed?
40 GOTO 20

1000 ' Light pen handling routine
1010 PRINT "Touched at ";X;",";Y
1020 RETURN
```

### Assembly Language
6809 assembly offered sophisticated programming:
```assembly
; Thomson-specific video mode setting
        LDA   #$01        ; Mode 40 (320×200, 16 colors)
        STA   VIDEOMODE   ; Set video mode register
        
; Light pen interrupt handler
PENINT  LDD   LIGHTPEN    ; Read pen coordinates
        STD   PENPOS      ; Store position
        RTI               ; Return from interrupt
```

## Hardware Variants

### TO7 (1982)
The original model:
- 24KB RAM standard
- Cassette storage only
- Basic light pen support
- Educational focus

### TO7/70 (1984)
Enhanced version:
- 48KB RAM
- Disk drive support
- Improved graphics
- Better compatibility

### TO8 (1986)
The advanced model:
- 64KB RAM standard
- 3.5" disk drive
- Enhanced graphics modes
- CP/M compatibility option
- Better build quality

### TO8D (1987)
Professional variant:
- Built-in disk drive
- 128KB RAM
- Network capabilities
- Business software support

## Development Techniques

### Efficient Graphics Programming
Thomson's unique video architecture required specific techniques:

```assembly
; Fast screen clearing using 6809 features
CLRSCREEN
        LDX   #SCREEN     ; Point to video memory
        LDD   #$0000      ; Clear value
        LDY   #4000       ; Screen size in words
CLRLOOP STD   ,X++        ; Store and increment (6809 feature)
        LEAY  -1,Y        ; Decrement counter
        BNE   CLRLOOP     ; Continue if not done
        RTS
```

### Light Pen Programming Patterns
```assembly
; Light pen menu system
CHECKMENU
        LDA   PENSTAT     ; Check pen status
        BMI   NOPRESS     ; Branch if not pressed
        
        LDD   PENPOS      ; Get pen coordinates
        CMPD  #MENU1      ; Check menu item 1
        BEQ   ITEM1
        CMPD  #MENU2      ; Check menu item 2
        BEQ   ITEM2
        ; ... more menu items
        
NOPRESS RTS
```

## Cultural Impact

### Educational Philosophy
Thomson computers embodied a distinctly French approach to educational computing:
- **Structured Learning**: Careful progression through concepts
- **Cultural Integration**: French history and literature in games
- **Collaborative Computing**: Multi-user educational experiences
- **Assessment Focus**: Built-in progress tracking and reporting

### Software Localization
Thomson software demonstrated early localization techniques:
- French-specific character sets
- Cultural references and context
- Educational content aligned with French curriculum
- User interface design for French users

## Legacy and Influence

### Technical Contributions
- Pioneered light pen interfaces in home computers
- Demonstrated alternative processor architectures (6809)
- Advanced educational software design patterns
- Showed possibilities of government-supported computing initiatives

### Modern Relevance
Thomson concepts that remain relevant:
- **Direct Manipulation Interfaces**: Precursor to touch interfaces
- **Educational Game Design**: Balancing fun with learning objectives
- **Adaptive Software**: Programs that respond to user skill level
- **Collaborative Computing**: Multi-user educational experiences

## Learning Thomson Development

### Why It Matters
1. **Alternative Architecture**: Experience 6809's advanced features
2. **Interface Innovation**: Understand light pen programming
3. **Educational Design**: Learn from sophisticated teaching software
4. **Cultural Computing**: Explore non-English computing traditions
5. **Government Tech Policy**: Case study in national computing initiatives

### Skills You'll Develop
- 6809 assembly language programming
- Light pen interface design
- Educational software development
- Graphics optimization techniques
- Multi-user application design
- French computing culture appreciation

### From Simple to Sophisticated
Thomson development teaches progression from basic concepts to advanced implementations:
- Start with simple BASIC programs
- Progress to light pen interaction
- Master 6809 assembly language
- Create educational games
- Develop multi-user applications
- Understand cultural computing contexts

The Thomson TO7/TO8 offers a fascinating glimpse into alternative computing history and the sophisticated educational software that flourished in 1980s France. Learning these systems provides unique insights into both technical innovation and the cultural aspects of computing development.