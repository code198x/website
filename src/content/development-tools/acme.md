---
name: "ACME Cross-Assembler"
description: "Powerful and flexible 6502/65816 cross-assembler with macro support"
type: "assembler"
year: 1998
developer: "Marco Baye"
platforms: ["Windows", "Linux", "macOS", "AmigaOS", "RISC OS"]
targetPlatforms: ["Commodore 64", "Commodore 128", "VIC-20", "Atari 8-bit", "Apple II", "NES"]
languages: ["6502 Assembly", "65C02 Assembly", "65816 Assembly"]
outputFormats: ["PRG", "BIN", "CBM", "Object files"]
license: "GPL"
features:
  [
    "Macro support with parameters",
    "Conditional assembly",
    "Local labels and zones",
    "Mathematical expressions",
    "Include files and binary data",
    "Multiple output formats",
    "Pseudo-opcodes for 65C02 and 65816",
    "Anonymous labels",
  ]
versions: [{ version: "0.97", year: 2021, changes: ["Bug fixes", "Improved error messages"] }]
tags: ["6502", "assembler", "cross-development", "commodore-64", "retro-development"]
---

# ACME Cross-Assembler

ACME (short for "ACME Crossassembler for Multiple Environments") is one of the most popular modern cross-assemblers for 6502 development. Created by Marco Baye, it has become the assembler of choice for many Commodore 64 developers due to its powerful macro system and clean syntax.

## Why ACME?

ACME strikes an excellent balance between power and simplicity. Unlike some older assemblers, ACME uses a modern directive syntax with `!` prefixes that makes code more readable. Its zone system for local labels keeps large projects organized, while its mathematical expression evaluator allows for complex compile-time calculations.

## Key Features

### Macro System

ACME's macro system is particularly powerful, supporting parameters and local labels:

```asm
!macro set_border_color .color {
    lda #.color
    sta $d020
}

+set_border_color 5  ; Use macro with + prefix
```

### Flexible Syntax

ACME accepts multiple number formats and has excellent expression evaluation:

```asm
    lda #%00111100     ; Binary
    ldx #$3c           ; Hexadecimal
    ldy #60            ; Decimal
    sta $d020 + 1      ; Expressions
```

### Zone System

Local labels are managed through zones, preventing naming conflicts:

```asm
!zone main {
    .loop:
        dex
        bne .loop      ; Local to this zone
}
```

## Modern Development

ACME integrates well with modern development workflows:

- Works with make/build systems
- Generates symbol files for debugging
- Supports project organization across multiple files
- Fast compilation even for large projects

## Legacy and Impact

While ACME wasn't around during the 8-bit era's heyday, it has become instrumental in the modern retro development scene. Many of today's impressive Commodore 64 demos and games are assembled with ACME, proving that tool evolution continues even for vintage platforms.

The assembler's clean design has influenced other modern cross-development tools, showing that there's still room for innovation in retro computing tools.
