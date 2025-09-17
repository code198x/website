---
name: 6502 Assembly Language
status: available
tags: ["assembly", "6502", "low-level", "retro", "programming"]
description: The assembly language for the legendary MOS 6502 processor that powered the computing revolution of the 1980s
type: assembly
year: 1975
designer: Chuck Peddle
developer: MOS Technology
paradigm: ["imperative", "low-level", "structured"]
typingDiscipline: ["untyped", "static"]
platforms: ["Commodore 64", "Apple II", "Atari 2600", "NES", "BBC Micro", "Atari 8-bit"]
fileExtensions: [".asm", ".s", ".a65"]
implementations:
  - name: "ACME"
    type: assembler
    platform: "Cross-platform"
    year: 1998
  - name: "ca65"
    type: assembler
    platform: "cc65 toolchain"
    year: 1998
  - name: "DASM"
    type: assembler
    platform: "Cross-platform"
    year: 1988
  - name: "Turbo Macro Pro"
    type: assembler
    platform: "Commodore 64"
    year: 1989
features:
  - Direct hardware control
  - Precise timing control
  - Memory-mapped I/O
  - Interrupt handling
  - Zero-page optimization
  - Indexed addressing modes
  - Subroutine support
  - Macro capabilities
helloWorld: |
  LDA #$48    ; Load 'H'
  JSR $FFD2   ; Print character
  LDA #$45    ; Load 'E'
  JSR $FFD2   ; Print character
  ; ... continue for "HELLO"
notableProjects:
  - Commodore 64 games
  - Apple II software
  - NES/Famicom games
  - Atari 2600 cartridges
  - System utilities
  - Demoscene productions
influencedBy: ["6800 Assembly", "PDP-11 Assembly"]
influenced: ["65C02 Assembly", "65816 Assembly", "Modern assembly languages"]
relatedEntries:
  hardware:
    - name: Commodore 64
      slug: commodore-64
      available: true
  programming-languages:
    - name: Commodore BASIC V2
      slug: basic-v2
      available: true
---

# 6502 Assembly Language

## The Language of the Revolution

6502 Assembly Language is the native instruction set for the MOS Technology 6502 processor, the chip that powered the personal computer revolution. From the Apple II to the Commodore 64 to the Nintendo Entertainment System, 6502 assembly was the language of choice for programmers who needed maximum performance and hardware control.

## Processor Architecture

### Registers

The 6502 has a minimal but efficient register set:

- **A (Accumulator)**: Primary data register for arithmetic and logic
- **X, Y**: Index registers for addressing and counting
- **SP (Stack Pointer)**: Points to current stack location ($0100-$01FF)
- **PC (Program Counter)**: Current instruction address
- **P (Processor Status)**: Flags register (N, V, B, D, I, Z, C)

### Memory Organization

- **Zero Page**: $0000-$00FF (fast access, special addressing)
- **Stack**: $0100-$01FF (hardware stack for subroutines)
- **General RAM**: $0200+ (varies by system)
- **I/O Area**: Memory-mapped hardware registers
- **ROM**: System firmware and cartridge code

## Addressing Modes

### Immediate

Load constant values:

```assembly
LDA #$42        ; Load hex 42 into accumulator
LDX #100        ; Load decimal 100 into X
```

### Zero Page

Fast access to first 256 bytes:

```assembly
LDA $80         ; Load from zero page address $80
STA $81         ; Store to zero page address $81
```

### Absolute

Full 16-bit addressing:

```assembly
LDA $2000       ; Load from address $2000
JMP $C000       ; Jump to address $C000
```

### Indexed Addressing

Using X or Y registers as offsets:

```assembly
LDA $2000,X     ; Load from $2000 + X
STA $3000,Y     ; Store to $3000 + Y
```

### Indirect Addressing

Pointer-based memory access:

```assembly
JMP ($2000)     ; Jump to address stored at $2000
LDA ($80),Y     ; Load from address at $80/$81 + Y
```

## Core Instructions

### Data Movement

```assembly
LDA #$42        ; Load accumulator with immediate value
LDX $80         ; Load X from zero page
LDY $2000       ; Load Y from absolute address
STA $81         ; Store accumulator to zero page
STX $2001       ; Store X to absolute address
STY $82         ; Store Y to zero page
TAX             ; Transfer A to X
TAY             ; Transfer A to Y
TXA             ; Transfer X to A
```

### Arithmetic and Logic

```assembly
ADC #$10        ; Add with carry
SBC #$05        ; Subtract with carry
AND #$0F        ; Bitwise AND
ORA #$80        ; Bitwise OR
EOR #$FF        ; Exclusive OR
ASL             ; Arithmetic shift left
LSR             ; Logical shift right
ROL             ; Rotate left through carry
ROR             ; Rotate right through carry
```

### Comparison and Testing

```assembly
CMP #$42        ; Compare accumulator with value
CPX $80         ; Compare X with zero page
CPY $2000       ; Compare Y with absolute
BIT $81         ; Test bits (affects N, V, Z flags)
```

### Program Flow

```assembly
JMP $2000       ; Unconditional jump
JSR $C000       ; Jump to subroutine
RTS             ; Return from subroutine
BEQ label       ; Branch if equal (Z=1)
BNE label       ; Branch if not equal (Z=0)
BCC label       ; Branch if carry clear
BCS label       ; Branch if carry set
BMI label       ; Branch if minus (N=1)
BPL label       ; Branch if plus (N=0)
```

## Programming Techniques

### Zero Page Optimization

Using zero page for frequently accessed variables:

```assembly
player_x = $80      ; Define zero page variable
player_y = $81
enemy_x  = $82

LDA player_x        ; Fast zero page access
CMP enemy_x         ; Compare positions
BEQ collision       ; Branch if equal
```

### Stack Operations

Managing the hardware stack:

```assembly
LDA #$42
PHA             ; Push accumulator to stack
LDA #$24
PHA             ; Push another value
PLA             ; Pull last value (gets $24)
PLA             ; Pull first value (gets $42)
```

### Subroutines

Modular programming with JSR/RTS:

```assembly
main:
    JSR init_screen
    JSR game_loop
    RTS

init_screen:
    LDA #$20
    STA $D020       ; Set border color
    RTS

game_loop:
    JSR read_input
    JSR update_sprites
    JSR check_collisions
    JMP game_loop
```

## Hardware Programming

### Memory-Mapped I/O

Direct hardware control through memory addresses:

```assembly
; Commodore 64 examples
LDA #$00
STA $D020       ; Black border
LDA #$01
STA $D021       ; White background
LDA #$0F
STA $D418       ; Full SID volume
```

### Interrupt Handling

Custom interrupt routines:

```assembly
; Set up custom IRQ
SEI             ; Disable interrupts
LDA #<irq_handler
STA $0314       ; IRQ vector low byte
LDA #>irq_handler
STA $0315       ; IRQ vector high byte
CLI             ; Enable interrupts

irq_handler:
    ; Save registers
    PHA
    TXA
    PHA
    TYA
    PHA

    ; Do interrupt work
    INC $D020       ; Flash border

    ; Restore registers
    PLA
    TAY
    PLA
    TAX
    PLA
    RTI             ; Return from interrupt
```

### Sprite Programming (C64)

Hardware sprite control:

```assembly
; Enable sprite 0
LDA #$01
STA $D015       ; Sprite enable register

; Set sprite position
LDA #100
STA $D000       ; Sprite 0 X position
LDA #150
STA $D001       ; Sprite 0 Y position

; Set sprite data pointer
LDA #192        ; Sprite data at $3000
STA $07F8       ; Sprite 0 data pointer
```

## Advanced Concepts

### Timing-Critical Code

Precise cycle counting for raster effects:

```assembly
wait_raster:
    LDA $D012       ; Current raster line
    CMP #$80        ; Wait for line 128
    BNE wait_raster ; Loop until reached

    ; Now we're synchronized to raster line 128
    NOP             ; 2 cycles
    NOP             ; 2 cycles
    LDA #$02        ; 2 cycles
    STA $D020       ; 4 cycles - border changes here
```

### Self-Modifying Code

Programs that modify themselves:

```assembly
    LDA #$EA        ; NOP instruction
    STA skip_code   ; Modify the instruction

skip_code:
    LDA #$42        ; This becomes NOP if modified
```

### Bank Switching

Managing more memory than addressable:

```assembly
; C64 example - switching BASIC ROM out
LDA $01         ; Current memory configuration
AND #$FE        ; Clear bit 0
STA $01         ; BASIC ROM now switched out
```

## System-Specific Features

### Commodore 64

```assembly
; Screen memory at $0400
LDA #$01        ; White character
STA $0400       ; Top-left corner

; Color RAM at $D800
LDA #$02        ; Red color
STA $D800       ; Color for top-left character
```

### Apple II

```assembly
; Text mode screen at $0400
LDA #$C8        ; 'H' with high bit set
STA $0400       ; Display on screen

; Switch to graphics mode
STA $C050       ; Graphics mode
STA $C057       ; Hi-res mode
```

### Nintendo NES

```assembly
; PPU control
LDA #$90        ; Enable NMI, use $1000 for sprites
STA $2000       ; PPU control register

; Set scroll position
LDA #$00
STA $2005       ; Scroll X
STA $2005       ; Scroll Y
```

## Development Tools

### Cross-Assemblers

Modern tools for 6502 development:

- **ACME**: Flexible macro assembler
- **ca65**: Part of cc65 C compiler suite
- **DASM**: Originally for Atari 2600
- **64tass**: Advanced assembler with modern features

### Native Development

Historical on-system development:

- **Turbo Macro Pro**: C64 native assembler
- **Merlin**: Apple II assembler
- **MAC/65**: Atari 8-bit assembler

## Educational Value

### Fundamental Concepts

6502 assembly teaches:

- Computer architecture basics
- Memory management principles
- Interrupt-driven programming
- Hardware/software interaction
- Optimization techniques

### Historical Significance

Understanding 6502 provides insight into:

- Evolution of computer architecture
- Constraints-driven design
- Performance optimization techniques
- Hardware abstraction development

## Modern Relevance

### Retro Development

Active community creating new software:

- Homebrew games for classic systems
- Demoscene productions
- Educational tools
- Hardware expansions

### Emulation and Preservation

Critical for:

- Accurate emulator development
- Software preservation projects
- Historical documentation
- Educational research

### Embedded Systems

6502 variants still used in:

- Microcontrollers
- Industrial automation
- Educational systems
- Hobbyist projects

## Performance Characteristics

### Advantages

- Simple, orthogonal instruction set
- Efficient zero page addressing
- Fast interrupt handling
- Compact code generation
- Predictable timing

### Limitations

- No multiply/divide instructions
- Limited registers
- No stack-relative addressing
- 64KB address space limit
- No memory protection

## Conclusion

6502 Assembly Language represents the perfect balance between simplicity and power. Its clean design and logical addressing modes made it accessible to programmers while still providing the control needed for sophisticated software.

Learning 6502 assembly provides deep insights into computer architecture, performance optimization, and the elegant solutions possible with limited resources. It remains one of the best assembly languages for understanding fundamental computing concepts, making it invaluable for both historical study and modern education.

The language's influence extends far beyond its original platforms, establishing patterns and principles still found in modern processors and development tools. For anyone interested in understanding how computers really work, 6502 assembly provides an excellent starting point.
