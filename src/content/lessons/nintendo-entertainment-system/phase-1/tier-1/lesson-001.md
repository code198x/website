---
title: "Creating Your First Game World"
system: "nintendo-entertainment-system"
phase_number: 1
tier_number: 1
lesson_number: 1
description: "Welcome to Underground Assault! Create your first game world with an animated starfield background using authentic 6502 assembly programming."
learning_objectives:
  - "Understand NES PPU nametables and pattern tables"
  - "Learn 6502 assembly structure and syntax"
  - "Master the NES display system and timing"
  - "Create animated background effects using palette cycling"
  - "Set up the foundation for your first complete game"
concepts:
  - "PPU registers ($2000-$2007)"
  - "Nametables and pattern tables"
  - "6502 registers and instructions"
  - "NMI interrupt for timing"
  - "Palette manipulation"
  - "60Hz frame synchronization"
difficulty: "beginner"
estimated_duration: "45-60 minutes"
code_examples: true
practical_exercise: true
external_resources:
  - title: "NES Dev Wiki"
    url: "https://www.nesdev.org/wiki/Main_Page"
    type: "reference"
  - title: "6502 Instruction Reference"
    url: "https://www.nesdev.org/obelisk-6502-guide/reference.html"
    type: "reference"
order: 1
---

# Lesson 1: Creating Your First Game World

Welcome to **Underground Assault**! You're about to create your first complete retro game using authentic 6502 assembly language. This isn't just theory - by the end of this lesson, you'll have stars twinkling on your screen and the foundation of a real arcade game.

## What You'll Build Today

- **Animated starfield background** - Stars that twinkle and change color
- **Game world foundation** - The underground cavern environment for your game
- **Your first 6502 assembly program** - Real code that runs on the NES

## The Big Picture

Every great game starts with its world. In **Underground Assault**, you're piloting through deep underground caverns filled with enemy craft and dangerous obstacles. Today we create that environment - a dynamic starfield that makes players feel like they're navigating through a vast subterranean space.

## Understanding the NES Display

The NES has a sophisticated display system centered around the PPU (Picture Processing Unit):

### Display Architecture

```
Pattern Tables:  CHR-ROM holds tile graphics (8x8 pixels each)
Nametables:     Screen tile arrangement (32x30 tiles)
Palettes:       Color information (4 background + 4 sprite palettes)
OAM:            Sprite data (64 sprites max)
```

- **256×240 pixels** display resolution (NTSC)
- **Background** composed of 8×8 pixel tiles
- **Sprites** can be 8×8 or 8×16 pixels
- **60Hz refresh rate** (NTSC) with NMI on vblank

### PPU Registers

The CPU communicates with the PPU through memory-mapped registers:

```
$2000 - PPUCTRL   (PPU control)
$2001 - PPUMASK   (PPU mask)
$2002 - PPUSTATUS (PPU status)
$2005 - PPUSCROLL (Scroll position)
$2006 - PPUADDR   (PPU address)
$2007 - PPUDATA   (PPU data)
```

## Your First Assembly Program

Let's start with the basic structure every NES program needs:

```asm6502
; underground-assault-01.s
; Create animated starfield for Underground Assault

;----------------------------------------------------------------
; iNES Header
;----------------------------------------------------------------
.segment "HEADER"
  .byte "NES", $1A      ; iNES header identifier
  .byte 2               ; 2x 16KB PRG code
  .byte 1               ; 1x  8KB CHR data
  .byte $01             ; Mapper 0, vertical mirroring

;----------------------------------------------------------------
; Variables (Zero Page)
;----------------------------------------------------------------
.segment "ZEROPAGE"
frameCount:     .res 1  ; Frame counter for animation
colorIndex:     .res 1  ; Current star color index
nmiFlag:        .res 1  ; NMI occurred flag

;----------------------------------------------------------------
; Program Start
;----------------------------------------------------------------
.segment "CODE"

.proc RESET
  sei             ; Disable IRQs
  cld             ; Disable decimal mode
  ldx #$40
  stx $4017       ; Disable APU frame IRQ
  ldx #$FF
  txs             ; Set up stack
  inx             ; Now X = 0
  stx PPUCTRL     ; Disable NMI
  stx PPUMASK     ; Disable rendering
  
  ; Wait for PPU warmup (2 frames)
  bit PPUSTATUS
vblankwait1:
  bit PPUSTATUS
  bpl vblankwait1
  
  ; Clear all RAM
  lda #$00
clearmem:
  sta $0000, x
  sta $0100, x
  sta $0300, x
  sta $0400, x
  sta $0500, x
  sta $0600, x
  sta $0700, x
  lda #$FE
  sta $0200, x    ; Move sprites off screen
  lda #$00
  inx
  bne clearmem
  
  ; Second vblank wait
vblankwait2:
  bit PPUSTATUS
  bpl vblankwait2
  
  ; Now PPU is ready!
.endproc
```

### Understanding the Code

**iNES Header**: Tells emulators how to configure the "cartridge" - 32KB PRG-ROM, 8KB CHR-ROM, using mapper 0 (simplest configuration).

**Zero Page Variables**: The 6502's zero page ($00-$FF) provides fast access to frequently used variables.

**RESET Vector**: The CPU jumps here when powered on. We initialize the system to a known state.

**PPU Warmup**: The PPU needs time to stabilize after power-on - we wait for 2 vblanks.

## Setting Up the Display

Now let's configure palettes and create our starfield:

```asm6502
  ; Load palettes
  lda PPUSTATUS    ; Read PPU status to reset the high/low latch
  lda #$3F
  sta PPUADDR      ; Write the high byte of $3F00 address
  lda #$00
  sta PPUADDR      ; Write the low byte of $3F00 address
  
  ldx #$00
LoadPalettesLoop:
  lda palette, x
  sta PPUDATA
  inx
  cpx #$20
  bne LoadPalettesLoop

  ; Load initial starfield to nametable
  jsr LoadStarfield
  
  ; Enable rendering
  lda #%10010000   ; Enable NMI, sprites from Pattern 0, BG from Pattern 1
  sta PPUCTRL
  
  lda #%00011110   ; Enable sprites and background
  sta PPUMASK
```

### The Palette

The NES can display 64 colors total, but only 25 at once:

```asm6502
palette:
  ; Background palette
  .byte $0F,$30,$30,$30  ; BG palette 0 (black, whites)
  .byte $0F,$0F,$0F,$0F  ; BG palette 1
  .byte $0F,$0F,$0F,$0F  ; BG palette 2
  .byte $0F,$0F,$0F,$0F  ; BG palette 3
  
  ; Sprite palette (not used yet)
  .byte $0F,$30,$30,$30  ; Sprite palette 0
  .byte $0F,$0F,$0F,$0F  ; Sprite palette 1
  .byte $0F,$0F,$0F,$0F  ; Sprite palette 2
  .byte $0F,$0F,$0F,$0F  ; Sprite palette 3
```

## Creating the Starfield

We'll place star tiles across the nametable:

```asm6502
.proc LoadStarfield
  lda PPUSTATUS    ; Reset the latch
  lda #$20
  sta PPUADDR      ; $2000 = first nametable
  lda #$00
  sta PPUADDR
  
  ; Fill background with tile 0 (black)
  ldx #$00
  ldy #$00
FillBackground:
  lda #$00         ; Tile 0 = black
  sta PPUDATA
  inx
  cpx #$00
  bne FillBackground
  iny
  cpy #$04         ; 4 * 256 = 1024 tiles
  bne FillBackground
  
  ; Place individual stars
  ; Star 1 at row 5, column 8
  lda PPUSTATUS
  lda #$20
  sta PPUADDR
  lda #$A8         ; $20A8 = row 5, col 8
  sta PPUADDR
  lda #$01         ; Tile 1 = star
  sta PPUDATA
  
  ; Continue for more stars...
  ; (See complete code for all 10 stars)
  
  rts
.endproc
```

## Animation with NMI

The NES generates an NMI (Non-Maskable Interrupt) at the start of each vblank period - perfect for animation timing:

```asm6502
; Main loop
Forever:
  ; Wait for NMI
  lda #$00
  sta nmiFlag
WaitForNMI:
  lda nmiFlag
  beq WaitForNMI
  
  ; Update animation
  jsr UpdateAnimation
  
  jmp Forever

; Animation update
.proc UpdateAnimation
  ; Increment frame counter
  inc frameCount
  lda frameCount
  and #$0F         ; Every 16 frames
  bne Done
  
  ; Change star colors by updating palette
  inc colorIndex
  lda colorIndex
  and #$03         ; Keep in range 0-3
  sta colorIndex
  
Done:
  rts
.endproc
```

## The NMI Handler

This runs automatically 60 times per second:

```asm6502
.proc NMI
  pha              ; Save registers
  txa
  pha
  tya
  pha
  
  ; Update palette based on colorIndex
  lda PPUSTATUS    ; Reset latch
  lda #$3F
  sta PPUADDR      ; Palette address
  lda #$01
  sta PPUADDR      ; BG palette 0, color 1
  
  ; Select color based on index
  ldx colorIndex
  lda starColors, x
  sta PPUDATA
  
  ; Reset scroll (important!)
  lda #$00
  sta PPUSCROLL
  sta PPUSCROLL
  
  ; Set NMI flag
  lda #$01
  sta nmiFlag
  
  pla              ; Restore registers
  tay
  pla
  tax
  pla
  rti
.endproc

; Star color sequence
starColors:
  .byte $30, $20, $11, $21  ; White, Light gray, Light blue, Light purple
```

## Pattern Table Graphics

The CHR-ROM contains our tile graphics:

```asm6502
.segment "CHARS"

  ; Tile 0 - Empty (black)
  .byte $00,$00,$00,$00,$00,$00,$00,$00
  .byte $00,$00,$00,$00,$00,$00,$00,$00

  ; Tile 1 - Small star
  .byte %00000000
  .byte %00000000
  .byte %00010000
  .byte %00111000
  .byte %00111000
  .byte %00010000
  .byte %00000000
  .byte %00000000
  ; Bit plane 2 (adds detail)
  .byte %00000000
  .byte %00010000
  .byte %00101000
  .byte %01000100
  .byte %01000100
  .byte %00101000
  .byte %00010000
  .byte %00000000
```

Each tile is 8×8 pixels, with 2 bits per pixel (allowing 4 colors per tile from one palette).

## Building and Running

### Download the Complete Code

All source code for this lesson is available in the **code-samples repository**:

📁 **[Download Lesson 1 Code](https://github.com/code198x/code-samples/tree/main/nintendo-entertainment-system/phase-1/tier-1/lesson-001)**

### Building the Program

1. **Clone or download** the code from the repository above
2. **Assemble and link**:
   ```bash
   ca65 underground-assault-01.s -o underground-assault-01.o
   ld65 -C nes.cfg -o underground-assault-01.nes underground-assault-01.o
   ```
3. **Run** in emulator: Load the generated NES file

**Or use the included Makefile:**
```bash
make            # Build the ROM
make run        # Build and run in emulator
make clean      # Clean build files
```

## Testing Your Code

Your program should:
- Display a black background
- Show 10 star tiles placed across the screen
- Animate star colors smoothly at 60Hz
- Cycle through: white → light gray → light blue → light purple

## What You've Learned

**6502 Assembly Basics**:
- Program structure with segments
- Essential instructions: LDA, STA, INC, AND, CMP, JSR, RTS
- Using NMI for frame timing

**NES Graphics**:
- PPU registers and communication
- Nametables for background layout
- Pattern tables for tile graphics
- Palette manipulation during vblank

**Game Development**:
- Proper NES initialization sequence
- Frame-based animation at 60Hz
- Creating visual effects with palette cycling

## Your Challenge

Enhance the starfield:
1. **Add more stars** - Fill the screen with 20-30 stars
2. **Different star patterns** - Create 2-3 different star tile designs
3. **Parallax effect** - Make some stars blink at different rates

## Next Lesson Preview

In **Lesson 2**, we'll add your **player ship** to this starfield. You'll learn about sprite rendering, controller input, and smooth movement - bringing your underground world to life!

You now have your first NES game world running in authentic 6502 assembly. Those twinkling stars aren't just pretty - they're the foundation of **Underground Assault**.

Welcome to NES game development! 🚀