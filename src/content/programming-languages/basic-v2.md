---
name: Commodore BASIC V2
status: available
tags: ["basic", "interpreter", "commodore", "beginner", "education"]
description: The built-in BASIC interpreter that introduced millions to programming on Commodore 8-bit computers
type: interpreted
year: 1977
designer: Microsoft
developer: Microsoft (licensed by Commodore)
paradigm: ["procedural", "line-oriented"]
typingDiscipline: ["dynamic", "weak"]
platforms: ["Commodore PET", "VIC-20", "Commodore 64"]
fileExtensions: [".bas", ".prg"]
implementations:
  - name: "ROM BASIC"
    type: interpreter
    platform: "Commodore computers"
    year: 1977
features:
  - Line-based programming
  - Immediate mode execution
  - Integrated editor
  - Built-in commands
  - Variable types (numeric, string)
  - Simple graphics commands (VIC-20/C64)
  - Sound generation (VIC-20/C64)
  - File operations
helloWorld: '10 PRINT "HELLO WORLD"'
notableProjects:
  - Educational software
  - Simple games
  - Utility programs
  - Learning tools
versions:
  - version: "BASIC 1.0"
    year: 1977
    changes: ["Original PET implementation", "Mathematical functions", "String handling"]
  - version: "BASIC 2.0"
    year: 1979
    changes:
      [
        "Enhanced for VIC-20 and C64",
        "Graphics support",
        "Sound commands",
        "Improved error handling",
      ]
  - version: "BASIC 3.5"
    year: 1984
    changes: ["Plus/4 and C16 version", "Structured programming", "Advanced graphics"]
  - version: "BASIC 7.0"
    year: 1985
    changes: ["C128 version", "Structured programming", "Sprite commands", "80-column support"]
influencedBy: ["Dartmouth BASIC", "Microsoft BASIC"]
influenced: ["GW-BASIC", "QBasic", "Modern BASIC dialects"]
relatedEntries:
  hardware:
    - name: Commodore 64
      slug: commodore-64
      available: true
  operating-systems:
    - name: Commodore KERNAL
      slug: commodore-kernal
      available: true
---

# Commodore BASIC V2

## The Gateway to Programming

Commodore BASIC V2 was the first programming language encountered by millions of computer users in the 1980s. Built into every Commodore 8-bit computer from the PET to the C64, it served as both an operating system interface and a gentle introduction to programming concepts.

## Language Characteristics

### Line-Oriented Programming

BASIC V2 used numbered lines for program structure:

```basic
10 PRINT "WHAT IS YOUR NAME?"
20 INPUT N$
30 PRINT "HELLO "; N$
40 GOTO 10
```

### Immediate Mode

Commands could be executed immediately without line numbers:

```basic
PRINT 2+2          REM Prints 4 immediately
FOR I=1 TO 10: PRINT I: NEXT    REM Loop executes now
```

## Core Commands

### Program Flow

- `GOTO` - Unconditional jump
- `GOSUB`/`RETURN` - Subroutine calls
- `IF...THEN` - Conditional execution
- `FOR...NEXT` - Loop structures
- `ON...GOTO` - Computed branches

### Variables and Data

- `LET A=5` - Variable assignment (LET optional)
- `DIM A(10)` - Array declaration
- `READ`/`DATA` - Data statements
- `INPUT` - User input
- `GET` - Single character input

### File Operations

- `LOAD "PROGRAM"` - Load program from disk/tape
- `SAVE "PROGRAM"` - Save current program
- `OPEN 1,8,15` - Open file for I/O
- `PRINT#1,"DATA"` - Write to file
- `INPUT#1,A$` - Read from file
- `CLOSE 1` - Close file

## Platform-Specific Features

### VIC-20 Enhancements

Graphics and sound capabilities:

```basic
POKE 36878,15      REM Set volume
POKE 36876,200     REM Set frequency
POKE 36869,255     REM Set screen color
```

### C64 Graphics and Sound

More sophisticated multimedia:

```basic
POKE 53280,0       REM Black border
POKE 53281,1       REM White background
POKE 54296,15      REM Full volume
```

## Memory Management

### Program Storage

- **C64**: Programs stored from $0801-$9FFF
- **Available RAM**: ~38KB for BASIC programs
- **Variable space**: Follows program code
- **String space**: Top of memory downward

### Memory Peek/Poke

Direct memory access:

```basic
POKE 1024,1        REM Write to screen memory
A = PEEK(1024)     REM Read from memory
```

## Programming Techniques

### Simple Games

Classic programming exercises:

```basic
100 REM GUESS THE NUMBER
110 N = INT(RND(1)*100)+1
120 INPUT "GUESS"; G
130 IF G=N THEN PRINT "CORRECT!": END
140 IF G<N THEN PRINT "TOO LOW"
150 IF G>N THEN PRINT "TOO HIGH"
160 GOTO 120
```

### Screen Manipulation

Text graphics and animation:

```basic
10 FOR I=1024 TO 2023
20 POKE I,42          REM Fill screen with asterisks
30 NEXT I
```

## Limitations and Workarounds

### Missing Features

BASIC V2 lacked many modern conveniences:

- No dedicated graphics commands
- Limited sound support
- No structured programming constructs
- Slow execution speed
- No error line numbers

### Common Solutions

Programmers developed techniques:

```basic
REM Use variables for commonly used values
10 SC=1024: BC=53280: VOL=54296
20 POKE BC,0: POKE VOL,15
```

## Educational Impact

### Learning Programming Concepts

BASIC V2 taught fundamental programming:

- Variables and data types
- Program flow control
- Input/output operations
- Problem decomposition
- Debugging skills

### Accessibility

Features that made programming approachable:

- English-like commands
- Immediate feedback
- Built-in help (LIST, RUN, STOP)
- Forgiving error handling
- Visual program structure

## Performance Characteristics

### Execution Speed

BASIC V2 was interpreted, making it slow:

- Line number lookup on GOTO/GOSUB
- Variable name parsing each use
- Tokenization overhead
- No optimization

### Memory Usage

Efficient use of limited RAM:

- Tokenized storage (keywords as single bytes)
- Compact variable storage
- Shared string space
- Dynamic memory allocation

## Advanced Techniques

### Machine Language Integration

Calling assembly routines:

```basic
10 POKE 49152,169: POKE 49153,65    REM LDA #65
20 POKE 49154,32: POKE 49155,210    REM JSR $FFD2
30 POKE 49156,255: POKE 49157,96    REM RTS
40 SYS 49152                        REM Call routine
```

### Custom Functions

Using DEF FN:

```basic
10 DEF FN SQ(X) = X*X
20 PRINT FN SQ(5)    REM Prints 25
```

## Historical Context

### Origins

- Based on Microsoft BASIC-80
- Licensed from Microsoft by Commodore
- Adapted for 6502 processor
- Integrated with KERNAL ROM

### Market Impact

- Standardized home computer programming
- Created common programming experience
- Enabled software sharing between systems
- Established BASIC as beginner language

## Modern Relevance

### Educational Value

BASIC V2 remains valuable for teaching:

- Programming fundamentals
- Computer architecture understanding
- Historical computing context
- Problem-solving skills

### Preservation

Important for:

- Software archaeology
- Emulation accuracy
- Historical documentation
- Educational research

### Modern Implementations

Contemporary BASIC interpreters maintain V2 compatibility:

- CBM prg Studio
- BASIC 10Liner contests
- Retro programming exercises
- Educational tools

## Legacy and Influence

### Language Evolution

BASIC V2 influenced later versions:

- GW-BASIC adopted similar syntax
- QBasic maintained compatibility
- Modern BASIC dialects preserve core concepts
- Educational programming languages borrowed ideas

### Cultural Impact

Beyond technical influence:

- Democratized programming
- Created generation of programmers
- Established home computing culture
- Influenced computer education

## Conclusion

Commodore BASIC V2, despite its limitations, served as the perfect introduction to programming for millions of users. Its simplicity, immediate feedback, and integration with the operating system created an environment where programming felt natural and accessible.

While modern languages offer more features and better performance, BASIC V2's educational approach and gentle learning curve remain relevant today. It represents a time when programming was an expected part of computer ownership, not a specialized skill, making it a fascinating study in both computer science and social history.
