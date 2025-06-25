---
title: "Spectrum Saga Prototype and Tier 1 Review"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 32
description: "Create your first Spectrum Saga prototype while reviewing all Tier 1 concepts. Build a basic adventure game framework using Z80 assembly and prepare for advanced graphics programming in Tier 2."
learning_objectives:
  - "Integrate all Phase 1 Z80 programming concepts into complete applications"
  - "Learn professional Z80 development patterns and best practices"
  - "Practice complex Z80 system programming combining multiple subsystems"
  - "Build comprehensive understanding of ZX Spectrum architecture"
  - "Prepare for Tier 2 advanced Z80 programming techniques"
concepts:
  - "Complete Z80 system integration and architecture"
  - "Professional Z80 development methodologies"
  - "Complex Z80 application development patterns"
  - "Z80 performance optimisation and debugging"
  - "Advanced Z80 programming foundations"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 32
---

# Lesson 32: Phase 1 Integration and Tier Review

Congratulations! You've reached the culmination of Phase 1. Today you'll integrate everything you've learned about Z80 assembly programming, ZX Spectrum graphics, and system control into sophisticated applications that demonstrate your foundational competency in ZX Spectrum development.

## Phase 1 Achievement Review

Over the past 32 lessons, you've built a comprehensive foundation in ZX Spectrum assembly programming:

### Memory and CPU Mastery (Lessons 1-16)
- **Z80 Assembly Language**: Complete instruction set and addressing modes
- **Memory Management**: Memory mapping, stack operations, and efficient techniques
- **Program Control**: Subroutines, branching, and interrupt handling  
- **Data Manipulation**: All arithmetic, logical, and bit operations
- **Professional Patterns**: Optimisation, debugging, and code organisation

### Graphics and Visual Programming (Lessons 17-24)
- **ZX Spectrum Display**: Complete understanding of the unique screen system
- **Character and Colour Graphics**: Screen layout, attributes, and visual effects
- **Border Control**: ULA programming and visual enhancement
- **Advanced Graphics**: Pixel manipulation and efficient drawing routines

### Professional Development Skills (Lessons 25-31)
- **Code Organisation**: Modular Z80 programming and maintainable code
- **Optimisation**: Memory efficiency and performance techniques for limited hardware
- **Error Handling**: Robust Z80 programming and systematic problem-solving
- **Documentation**: Professional coding standards and practices
- **Project Planning**: System architecture and development methodologies
- **Complete Applications**: Integrated Z80 systems with multiple subsystems

## Integrated Z80 Programming Concepts

### System-Level Z80 Architecture

Professional ZX Spectrum programming requires understanding how all subsystems work together:

```text
; Complete Z80 system initialization routine
SystemInit:
    ; 1. Initialize Z80 CPU and registers
    DI                  ; Disable interrupts during init
    LD SP, $FFFF        ; Set stack to top of memory
    
    ; 2. Initialize ZX Spectrum display
    CALL InitDisplay
    
    ; 3. Setup memory management
    CALL InitMemory
    
    ; 4. Install interrupt handlers
    CALL SetupInterrupts
    
    ; 5. Initialize application state
    CALL InitApplication
    
    EI                  ; Re-enable interrupts
    RET

; Display subsystem initialization
InitDisplay:
    ; Clear screen memory
    LD HL, $4000        ; Screen memory start
    LD DE, $4001
    LD BC, $17FF        ; 6144 bytes (screen + attributes - 1)
    LD (HL), $00        ; Clear first byte
    LDIR                ; Clear entire display
    
    ; Set default attributes
    LD HL, $5800        ; Attribute memory start
    LD DE, $5801
    LD BC, $02FF        ; 768 bytes - 1
    LD (HL), %00000111  ; Black on white
    LDIR                ; Fill attributes
    
    ; Set border colour
    LD A, $00           ; Black border
    OUT ($FE), A
    
    RET
```

### Z80 Interrupt-Driven Programming

Professional ZX Spectrum applications use interrupts effectively:

```text
; Custom interrupt handler for ZX Spectrum
CustomINT:
    ; Save Z80 state
    PUSH AF
    PUSH BC
    PUSH DE
    PUSH HL
    EXX
    PUSH BC
    PUSH DE
    PUSH HL
    
    ; Update system counters
    LD HL, (FrameCounter)
    INC HL
    LD (FrameCounter), HL
    
    ; Handle animation updates
    CALL UpdateAnimations
    
    ; Handle sound updates
    CALL UpdateBeeper
    
    ; Check for user input
    CALL ScanKeyboard
    
    ; Restore Z80 state
    POP HL
    POP DE
    POP BC
    EXX
    POP HL
    POP DE
    POP BC
    POP AF
    
    EI                  ; Re-enable interrupts
    RET

UpdateAnimations:
    ; Sprite animation using Z80 efficiency
    LD HL, (SpriteX)
    LD A, L
    ADD A, $02          ; Move sprite right
    LD L, A
    CP $F0              ; Check right boundary
    JR C, StoreX
    LD L, $10           ; Reset to left
StoreX:
    LD (SpriteX), HL
    
    ; Update display position
    CALL DrawSprite
    RET
```

**Complete Z80 System Integration Demo:**

```assembly
; Integrated demonstration combining all Phase 1 Z80 concepts
; Multi-subsystem application with graphics, sound, and animation

CompleteDemo:
    CALL SystemSetup
    CALL MainLoop
    RET

SystemSetup:
    ; Initialize all Z80 subsystems
    DI                  ; Disable interrupts
    LD SP, $FFFF        ; Set stack pointer
    
    CALL InitDisplay
    CALL InitSound
    CALL InitVariables
    
    EI                  ; Re-enable interrupts
    RET

InitDisplay:
    ; Setup ZX Spectrum display
    LD HL, $4000        ; Screen start
    LD DE, $4001
    LD BC, $17FF
    LD (HL), $00
    LDIR                ; Clear screen
    
    ; Set colours
    LD HL, $5800        ; Attributes
    LD DE, $5801
    LD BC, $02FF
    LD (HL), %01000111  ; Red on white
    LDIR
    
    RET

InitSound:
    ; Initialize beeper system
    LD A, $00
    LD (SoundDuration), A
    LD (SoundPitch), A
    RET

InitVariables:
    ; Initialize game variables
    LD HL, $8000
    LD (SpriteX), HL
    LD HL, $5000
    LD (SpriteY), HL
    LD A, $00
    LD (AnimFrame), A
    LD (SoundCounter), A
    RET

MainLoop:
    ; Update animation
    CALL UpdateAnimation
    
    ; Update graphics
    CALL UpdateGraphics
    
    ; Update sound
    CALL UpdateSound
    
    ; Synchronization delay
    CALL SyncDelay
    
    JR MainLoop

UpdateAnimation:
    ; Z80 sprite animation
    LD A, (AnimFrame)
    INC A
    AND $0F             ; Keep in range 0-15
    LD (AnimFrame), A
    
    ; Update sprite position
    LD HL, (SpriteX)
    INC HL
    LD A, H
    CP $A0              ; Check boundary
    JR C, StoreSpriteX
    LD HL, $1000        ; Reset position
StoreSpriteX:
    LD (SpriteX), HL
    
    RET

UpdateGraphics:
    ; Draw animated sprite
    LD HL, (SpriteX)    ; Get X position
    LD DE, (SpriteY)    ; Get Y position
    
    ; Calculate screen address
    CALL CalcScreenAddr
    
    ; Get animation frame
    LD A, (AnimFrame)
    AND $03             ; 4-frame cycle
    ADD A, $41          ; Convert to character (A-D)
    
    ; Draw character at position
    LD (HL), A
    
    RET

CalcScreenAddr:
    ; Convert coordinates to screen address
    ; Input: HL = X, DE = Y
    ; Output: HL = screen address
    
    ; Simplified calculation for demo
    LD A, D             ; Get Y high byte
    AND $07             ; Keep in screen range
    ADD A, $40          ; Add screen base
    LD H, A             ; Store screen high byte
    
    LD A, E             ; Get Y low byte
    AND $F8             ; Align to character boundary
    OR L                ; Add X position
    LD L, A             ; Store screen low byte
    
    RET

UpdateSound:
    ; Simple beeper music
    LD A, (SoundCounter)
    INC A
    LD (SoundCounter), A
    
    AND $1F             ; Every 32 frames
    JR NZ, SoundEnd
    
    ; Play beep
    LD A, $10           ; Pitch
    LD B, $08           ; Duration
    CALL BeepNote
    
SoundEnd:
    RET

BeepNote:
    ; Simple beeper routine
    ; Input: A = pitch, B = duration
BeepLoop:
    OUT ($FE), A        ; Output to ULA
    XOR $08             ; Toggle speaker bit
    
    PUSH BC
    LD C, A             ; Delay based on pitch
BeepDelay:
    DEC C
    JR NZ, BeepDelay
    POP BC
    
    DJNZ BeepLoop       ; Repeat for duration
    
    ; Turn off speaker
    XOR A
    OUT ($FE), A
    
    RET

SyncDelay:
    ; Frame synchronization
    LD B, $40
DelayLoop:
    DJNZ DelayLoop
    RET

; Variables
SpriteX:        DW $8000
SpriteY:        DW $5000
AnimFrame:      DB $00
SoundCounter:   DB $00
SoundDuration:  DB $00
SoundPitch:     DB $00

; Execute the complete demonstration
CALL CompleteDemo
```

## Advanced Z80 Integration Patterns

### Memory-Efficient Z80 Programming

```text
; Z80 memory management for constrained systems
MemoryManager:
    ; Use Z80's 16-bit registers efficiently
    LD HL, DataBuffer   ; Point to data area
    LD DE, TempBuffer   ; Destination
    LD BC, DataSize     ; Size to copy
    LDIR                ; Block copy (Z80 advantage)
    
    ; Z80 register pairs for efficiency
    EXX                 ; Switch to alternate registers
    LD HL, SecondBuffer ; Use alternate HL
    EXX                 ; Switch back
    
    RET

; Z80 string processing optimisation
FastStringCopy:
    ; Input: HL = source, DE = destination
    ; Z80 optimised string copy
StringLoop:
    LD A, (HL)          ; Load character
    LD (DE), A          ; Store character
    OR A                ; Check for zero terminator
    RET Z               ; Return if end of string
    
    INC HL              ; Next source
    INC DE              ; Next destination
    JR StringLoop       ; Continue (Z80 relative jump)
```

### ZX Spectrum Resource Management

```text
; Screen memory management system
ScreenManager:
    ; Calculate screen thirds for efficiency
    LD A, (YPosition)   ; Get Y coordinate
    AND $C0             ; Get screen third
    RRA                 ; Divide by 64
    RRA
    RRA
    RRA
    RRA
    RRA                 ; Now A = 0, 1, or 2
    
    LD HL, ScreenBases  ; Table of screen base addresses
    ADD A, A            ; Double for word table
    LD E, A
    LD D, $00
    ADD HL, DE          ; Index into table
    
    LD E, (HL)          ; Get base address
    INC HL
    LD D, (HL)
    
    ; DE now contains correct screen third base
    RET

ScreenBases:
    DW $4000            ; Top third
    DW $4800            ; Middle third  
    DW $5000            ; Bottom third
```

## Ready for Tier 2: Variables and Simple Programs

Phase 1 Tier 1 has established your **foundational understanding** of ZX Spectrum assembly programming. You're now perfectly prepared for **Tier 2**, which will build directly on everything you've learned:

### **What Tier 2 Will Add to Your Skills**

**Building Interactive Z80 Programs:**
- **Z80 Memory Management** - Learn efficient data storage and variable handling
- **Interactive Programming** - Create programs that respond intelligently to user input
- **Z80 Mathematical Operations** - Implement calculations and data processing
- **Assembly Program Structure** - Organise complex Z80 programs professionally

### **Tier 2 Learning Progression**
- **Lessons 1-8**: Understanding Assembly Memory Management - Z80 data storage techniques
- **Lessons 9-16**: Z80 Assembly Mathematical Operations - Calculations and processing
- **Lessons 17-24**: Interactive Assembly Programs - User input and response systems
- **Lessons 25-32**: Assembly Program Structure - Professional Z80 program organisation

### **Your Foundation is Perfect for Advanced Concepts**

The skills you've mastered in Tier 1 provide exactly what you need for Tier 2:
- ✅ **Complete Z80 knowledge** - Ready for advanced memory management
- ✅ **Professional development practices** - Essential for interactive programs
- ✅ **System programming experience** - Critical for responsive applications
- ✅ **ZX Spectrum expertise** - Necessary for efficient hardware utilisation
- ✅ **Assembly foundations** - Perfect preparation for complex program structures

### **The Natural Progression**

Your progression from Tier 1 to Tier 2 is seamless:
- **From basic Z80 assembly** → **Advanced memory techniques**
- **From simple programs** → **Interactive applications**
- **From hardware basics** → **Sophisticated program structures**
- **From individual concepts** → **Integrated programming systems**

**Tier 2 will feel like a natural evolution of your existing Z80 skills, not a difficult jump!**

## What You've Accomplished

In Phase 1 Tier 1, you've mastered the essential foundation of ZX Spectrum programming:

- **32 comprehensive lessons** covering all fundamental aspects of Z80 development
- **Complete understanding** of Z80 assembly language and ZX Spectrum architecture
- **Professional programming practices** that apply to modern development
- **Integrated system programming** combining CPU, graphics, and hardware control
- **Real-world application development** using industry-standard Z80 patterns

## Professional Competency Assessment

You have now completed comprehensive training in foundational ZX Spectrum assembly programming. You can confidently:

### Technical Competencies
- **Write efficient Z80 assembly code** using all instructions and addressing modes
- **Manage memory effectively** within ZX Spectrum's constrained environment
- **Control program flow** with Z80 subroutines, branching, and interrupt handling
- **Program the ZX Spectrum display** for graphics, text, and visual effects
- **Control hardware directly** through ULA programming and I/O operations
- **Integrate multiple subsystems** into complete, professional applications
- **Debug and optimise Z80 code** using systematic approaches and best practices

### Professional Skills
- **Plan and organise complex Z80 projects** using systematic development approaches
- **Write maintainable, documented Z80 code** following professional standards
- **Apply performance optimisation techniques** essential for limited hardware
- **Understand system architecture** and how Z80 components interact
- **Build complete applications** that demonstrate real-world programming capability

## Fun Fact

The Z80 assembly programming skills you've developed represent the same foundational knowledge that professional ZX Spectrum developers used to create legendary games, utilities, and demos in the 1980s. The memory optimisation techniques, efficient programming patterns, and hardware control approaches you've learned are timeless principles that apply to all levels of embedded and system programming. You've not just learned retro programming; you've mastered the fundamental disciplines that underlie efficient software development. The systematic thinking, resource optimisation, and hardware integration skills you've developed will serve you well in any programming context, whether you're working on microcontrollers, embedded systems, or modern applications requiring maximum efficiency.

Congratulations on completing Phase 1 Tier 1 of your Code Like It's 198x journey with the legendary ZX Spectrum!