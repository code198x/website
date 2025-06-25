---
title: "Custom Chip Introduction and Registers"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 12
description: "Discover the revolutionary custom chips that make the Amiga extraordinary - Agnus, Denise, and Paula. Learn to access their registers and understand the hardware architecture that powers advanced graphics and sound."
learning_objectives:
  - "Understand the three main custom chips: Agnus, Denise, and Paula"
  - "Learn the memory-mapped register architecture at $DFF000"
  - "Access custom chip registers using 68000 assembly"
  - "Understand basic DMA (Direct Memory Access) concepts"
  - "Write your first custom chip control programs"
concepts:
  - "Agnus - Memory and DMA controller"
  - "Denise - Video display processor"
  - "Paula - Audio and I/O controller"
  - "Memory-mapped I/O at $DFF000"
  - "DMA channels and control registers"
estimated_duration: "45-60 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 12
---

# Lesson 12: Custom Chip Introduction and Registers

Welcome to the heart of what makes the Amiga revolutionary! Today you'll meet the three custom chips that give the Amiga its extraordinary multimedia capabilities: **Agnus**, **Denise**, and **Paula**. These aren't just support chips - they're sophisticated processors that work alongside the 68000 to create magic.

## Why Custom Chips Made the Amiga Special

While other computers relied on the main processor for everything, the Amiga distributed work across specialized chips:

- **Parallel Processing**: Graphics, sound, and memory operations happen simultaneously
- **Hardware Acceleration**: Complex operations done by dedicated hardware
- **DMA (Direct Memory Access)**: Custom chips access memory without CPU intervention
- **Advanced Features**: Capabilities impossible with software alone
- **Professional Performance**: Workstation-class features in a home computer

## Meet the Custom Chip Family

### Agnus - The Memory Controller and DMA Master
- **Full Name**: Address Generator Unit (AGU)
- **Primary Role**: Memory addressing and DMA coordination
- **Key Features**: Bitplane DMA, Blitter (graphics coprocessor), Copper (display list processor)
- **Memory Control**: Manages all memory access timing and arbitration

### Denise - The Video Display Processor
- **Full Name**: Display Enable (DE)
- **Primary Role**: Video signal generation and pixel processing
- **Key Features**: Sprite processing, collision detection, color palette management
- **Display Magic**: Converts digital data into analog video signals

### Paula - The Audio and I/O Controller
- **Full Name**: Ports, Audio, UART, and Logic (PAUL)
- **Primary Role**: Sound generation and peripheral interface
- **Key Features**: 4-channel stereo audio, serial/parallel ports, interrupt control
- **Audio Power**: Hardware sample playback and mixing

## The Custom Chip Register Map

All custom chips are controlled through memory-mapped registers starting at **$DFF000**:

```text
$DFF000 - $DFF1FF: Custom chip registers
Each register is 16 bits (word-sized)
Accessed like regular memory using 68000 addressing
```

Let's explore the key register addresses:

**Accessing Custom Chip Registers:**

```assembly
; Setup custom chip base address
MOVE.L #$00DFF000, A0      ; A0 points to custom chip registers

; Read some basic status registers
MOVE.W $01E(A0), D0        ; INTREQR - Interrupt requests
MOVE.W $002(A0), D1        ; VPOSR - Vertical position  
MOVE.W $004(A0), D2        ; VHPOSR - Horizontal position
MOVE.W $016(A0), D3        ; POTINP - Joystick/mouse input
```

## Important Control Registers

### DMACON ($096) - DMA Control
This register enables/disables DMA channels:

```text
Bit 15: SET/CLR (1=set bits, 0=clear bits)
Bit 9:  BLTPRI (Blitter priority)
Bit 8:  DMAEN (Master DMA enable)
Bit 7:  BPLEN (Bitplane DMA)
Bit 6:  COPEN (Copper DMA)
Bit 5:  BLTEN (Blitter DMA)
Bit 4:  SPREN (Sprite DMA)
Bit 3:  DSKEN (Disk DMA)
Bit 2:  AUD3EN (Audio channel 3)
Bit 1:  AUD2EN (Audio channel 2)
Bit 0:  AUD1EN (Audio channel 1)
```

**DMA Control Examples:**

```assembly
; Setup custom chip base
MOVE.L #$00DFF000, A0

; Enable master DMA and specific channels
MOVE.W #$8380, $096(A0)    ; Enable master DMA, bitplanes, sprites
; Bit pattern: 1000 0011 1000 0000
; SET bit (15) = 1, DMAEN (8) = 1, BPLEN (7) = 1, SPREN (4) = 1

; Disable all DMA except audio  
MOVE.W #$0007, $096(A0)    ; Clear all except audio channels
; SET bit (15) = 0 (clear), keeps only audio bits 0-2
```

### INTENA ($09A) - Interrupt Enable
Controls which interrupts are enabled:

**Interrupt Control:**

```assembly
; Setup custom chip base
MOVE.L #$00DFF000, A0

; Enable vertical blank interrupt
MOVE.W #$8020, $09A(A0)    ; SET bit + VERTB interrupt
; Bit 15 = 1 (SET), Bit 5 = 1 (VERTB)

; Enable multiple interrupts
MOVE.W #$C000, $09A(A0)    ; Enable master interrupt + all
; Bit 15 = 1 (SET), Bit 14 = 1 (INTEN master enable)
```

## Graphics Control Registers

### BPLCON0 ($100) - Bitplane Control 0
Controls basic display parameters:

```text
Bits 15-12: Unused
Bits 11-8:  Number of bitplanes (0-6)
Bit 7:      Genlock video enable
Bit 6:      Interlace enable
Bit 5:      External sync
Bit 4:      Dual playfield
Bit 3:      Color enable
Bit 2:      Composite enable
Bit 1:      Hires enable
Bit 0:      Hold and modify (HAM)
```

**Basic Display Setup:**

```assembly
; Setup custom chip base
MOVE.L #$00DFF000, A0

; Setup a basic 4-bitplane, 16-color display
MOVE.W #$4200, $100(A0)    ; BPLCON0: 4 bitplanes, color enable
; Bits: 0100 0010 0000 0000
; Bits 11-8 = 0100 (4 bitplanes)
; Bit 3 = 1 (color enable)

; Setup high resolution, 2 bitplanes  
MOVE.W #$2202, $100(A0)    ; BPLCON0: 2 bitplanes, hires, color
; Bits: 0010 0010 0000 0010
; Bits 11-8 = 0010 (2 bitplanes)  
; Bit 3 = 1 (color), Bit 1 = 1 (hires)
```

## Audio Control Registers

Paula provides four independent audio channels. Each channel has several registers:

### Audio Channel 0 Registers (others similar)
- **AUD0LC ($0A0)**: Location (sample data pointer)
- **AUD0LEN ($0A4)**: Length (sample length in words)
- **AUD0PER ($0A6)**: Period (playback rate)
- **AUD0VOL ($0A8)**: Volume (0-64)

**Basic Audio Channel Setup:**

```assembly
; Setup custom chip base
MOVE.L #$00DFF000, A0

; Setup audio channel 0 for sample playback
MOVE.L #$00080000, $0A0(A0)  ; AUD0LC - Sample data address
MOVE.W #256, $0A4(A0)        ; AUD0LEN - 256 words (512 bytes)
MOVE.W #124, $0A6(A0)        ; AUD0PER - Period (affects pitch)  
MOVE.W #64, $0A8(A0)         ; AUD0VOL - Maximum volume

; Enable audio DMA for channel 0
MOVE.W #$8201, $096(A0)      ; Enable master DMA + audio channel 0
```

## Reading Hardware Status

Many registers can be read to get hardware status:

**Reading Hardware Status:**

```assembly
; Setup custom chip base
MOVE.L #$00DFF000, A0

; Read current display position
MOVE.W $004(A0), D0          ; VHPOSR - Vertical/horizontal position
MOVE.W D0, D1
LSR.W #8, D0                 ; D0 = vertical position (bits 15-8)
AND.W #$00FF, D1             ; D1 = horizontal position (bits 7-0)

; Read interrupt status
MOVE.W $01E(A0), D2          ; INTREQR - Active interrupts
MOVE.W $01C(A0), D3          ; INTENAR - Enabled interrupts

; Read joystick/mouse input
MOVE.W $00A(A0), D4          ; JOY0DAT - Joystick 0 data
MOVE.W $00C(A0), D5          ; JOY1DAT - Joystick 1 data
```

## DMA Concepts and Control

Direct Memory Access (DMA) allows custom chips to access memory without CPU intervention:

### Benefits of DMA:
- **CPU Freedom**: 68000 can run programs while chips handle graphics/sound
- **Higher Bandwidth**: Multiple data streams simultaneously
- **Real-time Performance**: Guaranteed timing for audio/video
- **Advanced Features**: Hardware can perform complex operations independently

**DMA Channel Management:**

```assembly
; Setup custom chip base
MOVE.L #$00DFF000, A0

; Disable all DMA first (safety)
MOVE.W #$0400, $096(A0)      ; Clear all DMA enables

; Enable only what we need
MOVE.W #$8080, $096(A0)      ; Master DMA enable only
MOVE.W #$8100, $096(A0)      ; Add bitplane DMA  
MOVE.W #$8010, $096(A0)      ; Add sprite DMA
MOVE.W #$8040, $096(A0)      ; Add copper DMA

; Full setup: Master + Bitplane + Sprite + Copper
MOVE.W #$81D0, $096(A0)      ; All graphics DMA enabled
```

## Color Palette Registers

The Amiga's color system uses dedicated registers:

- **COLOR00-COLOR31 ($180-$1BE)**: 32 color palette entries
- Each color is 12-bit RGB (4 bits each for R, G, B)

**Setting Color Palette:**

```assembly
; Setup custom chip base
MOVE.L #$00DFF000, A0

; Set background color (COLOR00)
MOVE.W #$0000, $180(A0)      ; Black background

; Set some basic colors
MOVE.W #$0FFF, $182(A0)      ; COLOR01 - White
MOVE.W #$0F00, $184(A0)      ; COLOR02 - Red  
MOVE.W #$00F0, $186(A0)      ; COLOR03 - Green
MOVE.W #$000F, $188(A0)      ; COLOR04 - Blue
MOVE.W #$0FF0, $18A(A0)      ; COLOR05 - Yellow
MOVE.W #$0F0F, $18C(A0)      ; COLOR06 - Magenta
MOVE.W #$00FF, $18E(A0)      ; COLOR07 - Cyan
```

## Sprite Control Registers

Hardware sprites have dedicated registers for each of the 8 sprites:

**Basic Sprite Setup:**

```assembly
; Setup custom chip base
MOVE.L #$00DFF000, A0

; Setup sprite 0
MOVE.L #$00081000, $120(A0)  ; SPR0PT - Sprite 0 data pointer
MOVE.W #$5050, $140(A0)      ; SPR0POS - Position (V=$50, H=$50)
MOVE.W #$A0A0, $142(A0)      ; SPR0CTL - Control word

; Enable sprite DMA
MOVE.W #$8010, $096(A0)      ; Enable sprite DMA
```

## Copper - The Display List Processor

The Copper is a programmable coprocessor that can modify registers based on beam position:

**Simple Copper Program:**

```assembly
; Setup custom chip base  
MOVE.L #$00DFF000, A0

; Point copper to our program
MOVE.L #COPPER_LIST, $080(A0)  ; COP1LC - Copper list address

; Enable copper DMA
MOVE.W #$8040, $096(A0)        ; Enable copper DMA

BRA SKIP_COPPER_DATA

COPPER_LIST:
    ; Wait for vertical position $20
    DC.W $2001, $FFFE          ; WAIT $20,$01
    ; Change background color to red
    DC.W $0180, $0F00          ; MOVE $0F00 to COLOR00
    ; Wait for vertical position $50
    DC.W $5001, $FFFE          ; WAIT $50,$01  
    ; Change background color to blue
    DC.W $0180, $000F          ; MOVE $000F to COLOR00
    ; End copper program
    DC.W $FFFF, $FFFE          ; END

SKIP_COPPER_DATA:
```

## Practice Exercise: System Status Display

Create a program that reads and displays various hardware status values:

**Practice: Hardware Status Monitor:**

```assembly
; Hardware status monitoring program
MOVE.L #$00DFF000, A0        ; Custom chip base

; Read comprehensive system status
MOVE.W $01E(A0), D0          ; INTREQR - Interrupt requests
MOVE.W $01C(A0), D1          ; INTENAR - Interrupt enables  
MOVE.W $002(A0), D2          ; VPOSR - Beam position
MOVE.W $004(A0), D3          ; VHPOSR - Full beam position
MOVE.W $016(A0), D4          ; POTINP - Analog inputs
MOVE.W $00A(A0), D5          ; JOY0DAT - Joystick 0
MOVE.W $096(A0), D6          ; DMACON read (current DMA status)

; Extract beam position components
MOVE.W D3, D7                ; Copy VHPOSR
LSR.W #8, D7                 ; D7 = vertical position
AND.W #$00FF, D3             ; D3 = horizontal position

; Simple analysis: check if in vertical blank
CMP.W #$FF, D7               ; Is vertical position at bottom?
BCC SYSTEM_IN_VBLANK         ; Branch if in vertical blank area

; Not in vertical blank
MOVE.W #$0000, $180(A0)      ; Set background black
BRA STATUS_DONE

SYSTEM_IN_VBLANK:
; In vertical blank - set background red  
MOVE.W #$0F00, $180(A0)      ; Set background red

STATUS_DONE:
; Status values are now in D0-D7 for analysis
```

## Understanding Register Timing

Custom chip registers have specific timing requirements:

### Write Timing
- Most registers take effect immediately
- Some require specific beam positions
- DMA registers may need synchronization

### Read Timing  
- Status registers reflect current hardware state
- Some registers are write-only
- Position registers change continuously

## Memory-Mapped I/O Advantages

The Amiga's memory-mapped approach provides several benefits:

**Unified Access**: Same instructions work for memory and hardware
**Flexible Addressing**: All 68000 addressing modes work with registers
**Efficient Programming**: Direct register manipulation without special I/O instructions
**System Integration**: Hardware registers integrate seamlessly with memory management

## What You've Learned

In this foundational lesson, you've discovered:

- The three custom chips: Agnus (memory/DMA), Denise (video), Paula (audio/I/O)
- Memory-mapped register architecture at $DFF000
- Key control registers: DMACON, INTENA, BPLCON0
- DMA concepts and channel management
- Basic audio, video, and sprite register access
- Hardware status monitoring techniques
- Copper display list programming basics

## Best Practices for Custom Chip Programming

1. **Always setup base address** ($DFF000) in an address register
2. **Understand register types** - read-only, write-only, or read/write
3. **Use proper timing** - some operations need specific synchronization
4. **Enable DMA carefully** - only enable channels you're actually using
5. **Save/restore registers** when your program doesn't own the system
6. **Check hardware status** before making assumptions about system state

## Looking Ahead

In the next lesson, you'll explore the Amiga's memory mapping in detail and learn how to work with different memory areas for graphics, sound, and system functions. You'll understand how the custom chips interact with memory and how to organize your data for maximum performance!

## Fun Fact

The Amiga's custom chips were so advanced that they contained more transistors than the 68000 CPU itself! Agnus alone had over 20,000 transistors (compared to the 68000's 68,000), but it was optimized for specific tasks like memory management and graphics operations. This parallel processing approach - having specialized processors for different tasks - was revolutionary for home computers and wouldn't become common in PC systems until the arrival of dedicated graphics cards in the 1990s. The Amiga had sophisticated GPU-like capabilities a decade before the term "GPU" was even coined!