---
name: Commodore KERNAL
status: available
tags: ["firmware", "commodore", "6502", "operating-system", "api"]
description: The KERNAL ROM provides essential system services and hardware abstraction for Commodore 8-bit computers
type: kernel
year: 1977
version: Multiple versions
developer: Commodore
platforms: ["Commodore PET", "VIC-20", "Commodore 64", "Commodore 128"]
architecture: ["6502"]
minimumRequirements:
  cpu: "6502"
  ram: 4KB
  storage: N/A
features:
  - Hardware abstraction layer
  - File I/O operations
  - Screen and keyboard handling
  - Serial bus communication
  - Timer and interrupt services
  - Memory management
gui: false
multitasking: false
multiuser: false
networking: false
versions:
  - version: "PET KERNAL"
    year: 1977
    changes: ["Original implementation for PET computers"]
  - version: "VIC-20 KERNAL"
    year: 1980
    changes: ["Adapted for VIC-20 hardware", "Color support added"]
  - version: "C64 KERNAL"
    year: 1982
    changes: ["Optimized for C64", "Enhanced I/O routines", "Sprite support"]
  - version: "C128 KERNAL"
    year: 1985
    changes: ["Extended for C128 features", "80-column support", "Enhanced memory management"]
relatedEntries:
  hardware:
    - name: Commodore 64
      slug: commodore-64
      available: true
    - name: VIC-20
      slug: vic-20
      available: false
  programming-languages:
    - name: 6502 Assembly
      slug: 6502-assembly
      available: true
---

# Commodore KERNAL

## The Foundation of Commodore Computing

The KERNAL (Kernel Address, Real-time, Non-specific Operations) is the essential firmware component that forms the foundation of all Commodore 8-bit computers. Located in ROM, it provides a stable API for hardware access and system services.

## Core Functions

### Hardware Abstraction
The KERNAL shields programmers from hardware differences between Commodore models:
- Screen output routines work across PET, VIC-20, and C64
- Keyboard scanning handled uniformly
- Serial bus communication standardized
- Timer services abstracted

### File Operations
KERNAL provides comprehensive file I/O:
- OPEN, CLOSE, CHRIN, CHROUT for character I/O
- Support for multiple devices (disk, tape, printer)
- Sequential and relative file access
- Error handling and status reporting

### Memory Map Location
- **C64**: $E000-$FFFF (8KB ROM)
- **VIC-20**: $E000-$FFFF (8KB ROM)
- **C128**: $E000-$FFFF with bank switching

## Key Entry Points

### Essential Routines
- `$FFD2` CHROUT - Output character to current device
- `$FFCF` CHRIN - Input character from current device
- `$FFC0` OPEN - Open logical file
- `$FFC3` CLOSE - Close logical file
- `$FFBA` SETLFS - Set logical file parameters
- `$FFBD` SETNAM - Set filename

### System Services
- `$FF81` CINT - Initialize screen
- `$FF84` IOINIT - Initialize I/O devices
- `$FF87` RAMTAS - RAM test and initialization
- `$FF8A` RESTOR - Restore default I/O vectors
- `$FF8D` VECTOR - Manage I/O vectors

## Programming with KERNAL

### BASIC Integration
Commodore BASIC uses KERNAL extensively:
```basic
PRINT "HELLO"    ; Uses CHROUT internally
INPUT A$         ; Uses CHRIN for input
LOAD "PROGRAM"   ; Uses file operations
SAVE "DATA",8    ; Saves to device 8 (disk)
```

### Assembly Language Access
Direct KERNAL calls from assembly:
```assembly
LDA #$41        ; Load 'A'
JSR $FFD2       ; Call CHROUT to print
```

### Custom I/O Vectors
The KERNAL allows redirecting I/O:
- Input vector at $0324
- Output vector at $0326
- Enables custom drivers and filters

## Historical Evolution

### PET Era (1977-1980)
- Original monochrome text-only implementation
- Basic file operations
- IEEE-488 bus support

### VIC-20 Enhancements (1980)
- Color output support added
- Joystick handling
- Improved cassette routines

### C64 Optimizations (1982)
- Enhanced for VIC-II graphics chip
- Improved serial bus timing
- Better error handling

### C128 Extensions (1985)
- 80-column display support
- Enhanced memory management
- CP/M compatibility layer

## Technical Innovations

### Device Independence
Programs work identically whether output goes to:
- Screen (device 3)
- Printer (device 4/5)
- Disk file (device 8)
- Serial device

### Interrupt Integration
KERNAL manages system interrupts:
- Keyboard scanning every 1/60th second
- Software timers
- Serial bus timing
- Cursor blinking

### Vector System
Allows software to hook into system operations:
- Custom character sets
- Alternative input methods
- Debugging tools
- Copy protection schemes

## Modern Relevance

### Emulation Accuracy
Understanding KERNAL is crucial for:
- Cycle-accurate emulation
- Hardware compatibility
- Software preservation
- Cross-development tools

### Educational Value
The KERNAL demonstrates:
- Clean API design principles
- Hardware abstraction concepts
- Interrupt-driven programming
- Memory-mapped I/O techniques

### Historical Significance
The KERNAL represented advanced thinking for its time:
- Device-independent I/O
- Modular design
- Stable API across hardware generations
- Efficient use of limited ROM space

## Legacy Impact

The Commodore KERNAL influenced modern computing concepts:
- Hardware abstraction layers
- Device driver models
- System call interfaces
- Firmware design principles

Its clean, consistent design allowed software to remain compatible across multiple Commodore systems, a remarkable achievement for the 8-bit era. Today's operating systems still use many of the same fundamental concepts pioneered by the KERNAL.