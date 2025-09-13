---
title: "Copper Dreams Prototype and Tier 1 Review"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 32
description: "Create your first Copper Dreams prototype while reviewing all Tier 1 concepts. Build a basic multimedia demonstration using 68000 assembly and prepare for advanced custom chip programming in Tier 2."
learning_objectives:
  - "Integrate all Tier 1 68000 programming concepts into complete applications"
  - "Learn professional 68000 development patterns and best practices"
  - "Practice complex 68000 system programming combining multiple custom chips"
  - "Build comprehensive understanding of Amiga architecture"
  - "Prepare for Tier 2 advanced 68000 programming techniques"
concepts:
  - "Complete 68000 system integration and architecture"
  - "Professional 68000 development methodologies"
  - "Complex 68000 application development patterns"
  - "68000 performance optimisation and debugging"
  - "Advanced 68000 programming foundations"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 32
---

# Lesson 32: Copper Dreams Prototype and Tier 1 Review

Congratulations! You've completed Tier 1 of Phase 1. Today you'll create your first Copper Dreams prototype and review everything you've learned about 68000 assembly programming, Amiga custom chips, and multimedia system control. Your prototype demonstrates foundational competency in Amiga development and prepares you for the advanced techniques in Tier 2.

## Tier 1 Achievement Review

Over the past 32 lessons, you've built a comprehensive foundation in Amiga assembly programming:

### Memory and CPU Mastery (Lessons 1-16)

- **68000 Assembly Language**: Complete instruction set and addressing modes
- **Memory Management**: Chip/Fast RAM, stack operations, and advanced memory techniques
- **Program Control**: Subroutines, branching, and exception handling
- **Data Manipulation**: All arithmetic, logical, and bit operations with 68000 precision
- **Professional Patterns**: Optimisation, debugging, and modular code organisation

### Graphics and Custom Chip Programming (Lessons 17-24)

- **Amiga Custom Chips**: Complete understanding of the revolutionary graphics system
- **Blitter Programming**: Hardware-accelerated graphics and data movement
- **Copper Programming**: Precise timing and advanced visual effects
- **Paula Audio**: Professional sound synthesis and audio programming
- **CIA Control**: System timing, I/O, and hardware coordination

### Professional Development Skills (Lessons 25-31)

- **AmigaOS Integration**: System calls and operating system interaction
- **Code Organisation**: Modular 68000 programming and maintainable systems
- **Optimisation**: Memory efficiency and performance techniques for multimedia
- **Error Handling**: Robust 68000 programming and systematic problem-solving
- **Documentation**: Professional coding standards and practices
- **Project Planning**: System architecture and multimedia development methodologies
- **Complete Applications**: Integrated 68000 systems with multiple custom chips

## Integrated 68000 Programming Concepts

### System-Level 68000 Architecture

Professional Amiga programming requires understanding how all subsystems work together:

```text
; Complete 68000 system initialization routine
SystemInit:
    ; 1. Initialize 68000 CPU and supervisor mode
    MOVE.W  #$2700,SR      ; Disable all interrupts, supervisor mode

    ; 2. Initialize custom chip base
    LEA     $DFF000,A6     ; Base address for all custom chips

    ; 3. Initialize graphics subsystem
    BSR     InitGraphics

    ; 4. Initialize audio subsystem
    BSR     InitAudio

    ; 5. Setup memory management
    BSR     InitMemory

    ; 6. Install interrupt handlers
    BSR     SetupInterrupts

    ; 7. Initialize application state
    BSR     InitApplication

    MOVE.W  #$C000,SR      ; Re-enable interrupts, stay in supervisor
    RTS

; Graphics subsystem initialization
InitGraphics:
    ; Initialize bitplanes
    CLR.L   $100(A6)       ; Clear bitplane pointers
    CLR.L   $104(A6)
    CLR.L   $108(A6)
    CLR.L   $10C(A6)

    ; Setup display window
    MOVE.W  #$2C81,$8E(A6) ; DIWSTRT
    MOVE.W  #$2CC1,$90(A6) ; DIWSTOP
    MOVE.W  #$003C,$92(A6) ; DDFSTRT
    MOVE.W  #$00D4,$94(A6) ; DDFSTOP

    ; Setup initial display mode
    MOVE.W  #$1200,$100(A6) ; BPLCON0: 1 bitplane, colour enable
    MOVE.W  #$0000,$102(A6) ; BPLCON1: no scroll
    MOVE.W  #$0000,$104(A6) ; BPLCON2: standard priorities

    ; Initialize colour palette
    MOVE.W  #$0000,$180(A6) ; Colour 0: Black
    MOVE.W  #$0FFF,$182(A6) ; Colour 1: White

    ; Initialize blitter
    BTST    #14,$002(A6)    ; Wait for blitter ready
BlitWait:
    BTST    #14,$002(A6)
    BNE.S   BlitWait

    RTS
```

### 68000 Custom Chip Coordination

Professional Amiga applications coordinate multiple custom chips:

```text
; Advanced custom chip programming
MultimediaUpdate:
    ; Save registers (68000 calling convention)
    MOVEM.L D0-D7/A0-A6,-(SP)

    ; Update copper list
    BSR     UpdateCopper

    ; Update blitter operations
    BSR     UpdateBlitter

    ; Update Paula audio
    BSR     UpdateAudio

    ; Coordinate timing via CIA
    BSR     UpdateTiming

    ; Restore registers
    MOVEM.L (SP)+,D0-D7/A0-A6
    RTS

UpdateCopper:
    ; Dynamic copper list generation
    LEA     CopperList,A0
    LEA     $DFF000,A6

    ; Create raster effects
    MOVE.L  #$01800000,(A0)+ ; WAIT for line 24
    MOVE.L  #$01820F00,(A0)+ ; Set colour 1 to red

    MOVE.L  #$03200000,(A0)+ ; WAIT for line 50
    MOVE.L  #$018200F0,(A0)+ ; Set colour 1 to green

    MOVE.L  #$04B00000,(A0)+ ; WAIT for line 75
    MOVE.L  #$0182000F,(A0)+ ; Set colour 1 to blue

    MOVE.L  #$FFFFFFFE,(A0)+ ; End copper list

    ; Activate new copper list
    MOVE.L  #CopperList,$80(A6) ; COP1LC
    MOVE.W  #$8080,$96(A6)      ; COPJMP1

    RTS

UpdateBlitter:
    ; High-performance graphics using blitter
    LEA     $DFF000,A6

    ; Wait for blitter ready
BlitterWait:
    BTST    #14,$002(A6)
    BNE.S   BlitterWait

    ; Setup blitter for fill operation
    MOVE.L  #$FFFFFFFF,$044(A6) ; BLTAFWM/BLTALWM
    MOVE.W  #$09F0,$040(A6)     ; BLTCON0: A+D, fill mode
    MOVE.W  #$0000,$042(A6)     ; BLTCON1

    ; Set destination
    MOVE.L  #Bitplane1,$054(A6) ; BLTDPT
    MOVE.W  #$0000,$066(A6)     ; BLTDMOD

    ; Start blit (64x64 area)
    MOVE.W  #$0408,$058(A6)     ; BLTSIZE: 8 words x 64 lines

    RTS
```

**Complete 68000 System Integration Demo:**

```assembly
; Integrated demonstration combining all Phase 1 68000 concepts
; Multi-custom-chip application with graphics, audio, and coordination

CompleteDemo:
    BSR     SystemSetup
    BSR     MainLoop
    RTS

SystemSetup:
    ; Initialize all 68000 subsystems
    MOVE.W  #$2700,SR      ; Supervisor mode, interrupts off
    LEA     $DFF000,A6     ; Custom chip base

    BSR     InitDisplay
    BSR     InitBlitter
    BSR     InitAudio
    BSR     InitVariables

    MOVE.W  #$C000,SR      ; Re-enable interrupts
    RTS

InitDisplay:
    ; Setup Amiga display system
    ; Clear bitplane pointers
    CLR.L   $E0(A6)        ; BPL1PTH/L
    CLR.L   $E4(A6)        ; BPL2PTH/L

    ; Setup bitplane pointer
    MOVE.L  #Bitplane1,$E0(A6) ; Point to our bitplane

    ; Display window
    MOVE.W  #$2C81,$8E(A6) ; DIWSTRT
    MOVE.W  #$2CC1,$90(A6) ; DIWSTOP
    MOVE.W  #$003C,$92(A6) ; DDFSTRT
    MOVE.W  #$00D4,$94(A6) ; DDFSTOP

    ; Display mode: 1 bitplane
    MOVE.W  #$1200,$100(A6) ; BPLCON0

    ; Colours
    MOVE.W  #$0000,$180(A6) ; Black
    MOVE.W  #$0FFF,$182(A6) ; White

    RTS

InitBlitter:
    ; Initialize blitter system
    ; Wait for blitter ready
BlitWait1:
    BTST    #14,$002(A6)
    BNE.S   BlitWait1

    ; Clear our bitplane using blitter
    MOVE.L  #$01000000,$040(A6) ; BLTCON0/1: D only
    MOVE.L  #Bitplane1,$054(A6) ; BLTDPT
    MOVE.W  #$0000,$066(A6)     ; BLTDMOD
    MOVE.W  #$0000,$072(A6)     ; BLTDDAT
    MOVE.W  #$0A28,$058(A6)     ; BLTSIZE: 40 words x 256 lines

    RTS

InitAudio:
    ; Setup Paula audio system
    MOVE.W  #$000F,$096(A6)     ; DMACON: Audio DMA off
    MOVE.W  #$8001,$09A(A6)     ; INTENA: Enable audio interrupt

    ; Setup audio channel 0
    MOVE.L  #SampleData,$0A0(A6) ; AUD0LC
    MOVE.W  #$0100,$0A4(A6)      ; AUD0LEN
    MOVE.W  #$0040,$0A6(A6)      ; AUD0PER
    MOVE.W  #$0040,$0A8(A6)      ; AUD0VOL

    RTS

InitVariables:
    ; Initialize 68000 variables
    CLR.L   SpriteX
    CLR.L   SpriteY
    CLR.W   AnimFrame
    CLR.W   SoundCounter
    RTS

MainLoop:
    ; Update animation
    BSR     UpdateAnimation

    ; Update graphics
    BSR     UpdateGraphics

    ; Update audio
    BSR     UpdateAudio

    ; Synchronization
    BSR     WaitVBlank

    BRA     MainLoop

UpdateAnimation:
    ; 68000 sprite animation
    ADDQ.W  #1,AnimFrame
    ANDI.W  #$001F,AnimFrame    ; Keep in range 0-31

    ; Update sprite position using 68000 addressing
    LEA     SpriteX,A0
    MOVE.L  (A0),D0             ; Get current X position
    ADDQ.L  #2,D0               ; Move right
    CMP.L   #320,D0             ; Check boundary
    BLT.S   StoreX
    CLR.L   D0                  ; Reset to left
StoreX:
    MOVE.L  D0,(A0)             ; Store new X position

    RTS

UpdateGraphics:
    ; Draw sprite using 68000 efficiency
    LEA     $DFF000,A6

    ; Calculate screen position
    MOVE.L  SpriteX,D0          ; Get X position
    MOVE.L  SpriteY,D1          ; Get Y position

    ; Convert to bitplane address
    LSR.L   #3,D0               ; Divide X by 8 for byte offset
    MULU.W  #40,D1              ; Multiply Y by 40 (bytes per line)
    ADD.L   D1,D0               ; Combine offsets
    LEA     Bitplane1,A0
    ADD.L   D0,A0               ; A0 = screen address

    ; Draw simple sprite pattern
    MOVE.W  AnimFrame,D0
    ANDI.W  #$0003,D0           ; 4-frame animation
    ADDQ.W  #1,D0               ; Convert to bit pattern
    MOVE.B  D0,(A0)             ; Draw to screen

    RTS

UpdateAudio:
    ; Simple audio sequencer
    ADDQ.W  #1,SoundCounter
    ANDI.W  #$003F,SoundCounter ; 64-frame cycle
    BNE.S   AudioEnd

    ; Trigger sample playback
    LEA     $DFF000,A6
    MOVE.W  #$8201,$096(A6)     ; Enable audio channel 0 DMA

AudioEnd:
    RTS

WaitVBlank:
    ; Wait for vertical blank using 68000 efficiency
    LEA     $DFF000,A6
VBlankLoop:
    MOVE.W  $004(A6),D0         ; Read VPOSR
    ANDI.W  #$01FF,D0           ; Mask vertical position
    CMP.W   #$00C0,D0           ; Wait for line 192
    BLT.S   VBlankLoop

    RTS

; Data sections
Bitplane1:
    DS.B    8000               ; 320x200 bitplane

SampleData:
    DC.B    $7F,$00,$7F,$00,$7F,$00,$7F,$00  ; Simple square wave
    DC.B    $80,$FF,$80,$FF,$80,$FF,$80,$FF

; Variables
SpriteX:     DC.L    160
SpriteY:     DC.L    100
AnimFrame:   DC.W    0
SoundCounter: DC.W   0

; Copper list for effects
CopperList:
    DC.L    $01800000          ; WAIT for line 24
    DC.L    $01820F00          ; Red colour
    DC.L    $FFFFFFFE          ; End list

; Execute the complete demonstration
BSR     CompleteDemo
```

## Advanced 68000 Integration Patterns

### Memory-Efficient 68000 Programming

```text
; 68000 advanced memory management
MemoryManager:
    ; Use 68000's powerful addressing modes
    LEA     DataTable,A0       ; Base pointer
    MOVE.W  #255,D0            ; Counter

ProcessLoop:
    ; 68000 addressing mode efficiency
    MOVE.L  (A0)+,D1           ; Load and increment (68000 advantage)
    ADD.L   D1,D2              ; Accumulate
    DBF     D0,ProcessLoop     ; Decrement and branch (68000 specific)

    RTS

; 68000 string processing with addressing modes
FastStringOps:
    ; Input: A0 = source, A1 = destination
    ; 68000 optimised string operations
StringCopyLoop:
    MOVE.B  (A0)+,(A1)+        ; Copy byte and increment both
    BNE.S   StringCopyLoop     ; Continue until null terminator
    RTS
```

### Custom Chip Resource Management

```text
; Blitter resource management
BlitterManager:
    ; Queue blitter operations for efficiency
    LEA     BlitQueue,A0
    MOVE.W  QueueCount,D0
    BEQ.S   NoBlits            ; Nothing to process

ProcessBlits:
    ; Setup blitter from queue entry
    LEA     $DFF000,A6

    ; Wait for previous blit
BlitBusy:
    BTST    #14,$002(A6)
    BNE.S   BlitBusy

    ; Load blit parameters
    MOVE.L  (A0)+,$040(A6)     ; BLTCON0/1
    MOVE.L  (A0)+,$044(A6)     ; BLTAFWM/BLTALWM
    MOVE.L  (A0)+,$050(A6)     ; BLTAPT
    MOVE.L  (A0)+,$054(A6)     ; BLTDPT
    MOVE.W  (A0)+,$058(A6)     ; BLTSIZE (starts blit)

    SUBQ.W  #1,D0
    BNE.S   ProcessBlits

    CLR.W   QueueCount         ; Clear queue

NoBlits:
    RTS
```

## Ready for Tier 2: Variables and Advanced Data

Phase 1 Tier 1 has established your **foundational understanding** of Amiga assembly programming. You're now perfectly prepared for **Tier 2**, which will build directly on everything you've learned:

### **What Tier 2 Will Add to Your Graphics Studio**

**Building Advanced Data Systems:**

- **68000 Memory Management** - Efficient allocation and organisation for graphics applications
- **Advanced Data Structures** - Complex data handling for sophisticated graphics tools
- **Chip RAM vs Fast RAM** - Optimal memory usage for multimedia applications
- **Professional Data Organisation** - Scalable systems for graphics and colour management

### **Tier 2 Learning Progression**

- **Lessons 1-8**: 68000 Assembly Memory Management - Advanced allocation and data organisation
- **Lessons 9-16**: Hardware Memory Management - Chip/Fast RAM optimisation strategies
- **Lessons 17-24**: Advanced Assembly Data Structures - Complex data organisation techniques
- **Lessons 25-32**: Assembly Graphics Studio Data Systems - Complete graphics application data management

### **Your Foundation is Perfect for Advanced Concepts**

The skills you've mastered in Tier 1 provide exactly what you need for Tier 2:

- ✅ **Complete 68000 knowledge** - Ready for advanced memory management
- ✅ **Professional development practices** - Essential for complex data systems
- ✅ **Custom chip programming experience** - Critical for graphics data coordination
- ✅ **System integration skills** - Necessary for multimedia data management
- ✅ **Graphics Studio foundation** - Your project is ready for sophisticated data enhancements

### **The Natural Progression**

Your progression from Tier 1 to Tier 2 is seamless:

- **From basic 68000 assembly** → **Advanced memory techniques**
- **From simple programs** → **Data-driven graphics applications**
- **From hardware basics** → **Sophisticated data structures**
- **From individual concepts** → **Integrated data management systems**

**Tier 2 will feel like a natural evolution of your existing 68000 skills, not a difficult jump!**

## What You've Accomplished

In Phase 1 Tier 1, you've mastered the essential foundation of Amiga programming:

- **32 comprehensive lessons** covering all fundamental aspects of 68000 development
- **Complete understanding** of 68000 assembly language and Amiga architecture
- **Professional programming practices** that apply to modern development
- **Integrated system programming** combining CPU, custom chips, and multimedia
- **Real-world application development** using industry-standard 68000 patterns

## Professional Competency Assessment

You have now completed comprehensive training in foundational Amiga assembly programming. You can confidently:

### Technical Competencies

- **Write efficient 68000 assembly code** using all instructions and addressing modes
- **Manage memory effectively** using Chip RAM and Fast RAM appropriately
- **Control program flow** with 68000 subroutines, branching, and exception handling
- **Program Amiga custom chips** for graphics, audio, and advanced multimedia effects
- **Coordinate multiple subsystems** through efficient hardware programming
- **Integrate complex applications** that leverage the full Amiga architecture
- **Debug and optimise 68000 code** using systematic approaches and best practices

### Professional Skills

- **Plan and organise complex 68000 projects** using systematic development approaches
- **Write maintainable, documented 68000 code** following professional standards
- **Apply performance optimisation techniques** for multimedia applications
- **Understand advanced computer architecture** and how 68000 systems interact
- **Build sophisticated applications** that demonstrate real-world programming capability

## Fun Fact

The 68000 assembly programming skills you've developed represent the same foundational knowledge that professional Amiga developers used to create groundbreaking multimedia applications, games, and demos in the late 1980s and early 1990s. The custom chip programming techniques, memory management patterns, and multimedia coordination approaches you've learned are sophisticated principles that influenced modern graphics programming, real-time systems, and multimedia frameworks. You've not just learned retro programming; you've mastered advanced architectural concepts that apply to modern GPUs, real-time systems, and multimedia programming. The systematic thinking, hardware coordination, and multimedia integration skills you've developed will serve you well in any advanced programming context, whether you're working on graphics programming, embedded systems, real-time applications, or modern multimedia software.

Congratulations on completing Phase 1 Tier 1 of your Code Like It's 198x journey with the revolutionary Commodore Amiga!
