# C64 Example: Hello World

This example demonstrates basic text output on the Commodore 64.

## What You'll Learn

- Using KERNAL ROM routines for text output
- Understanding PETSCII character encoding
- Direct screen memory access at $0400
- Color RAM manipulation at $D800

## Building and Running

```bash
# Build the program
make build-c64 PROJECT=examples/commodore-64/01-hello-world/hello

# The output will be in:
# examples/commodore-64/01-hello-world/build/hello.prg

# To run in VICE emulator:
# x64 examples/commodore-64/01-hello-world/build/hello.prg
```

## Code Highlights

### KERNAL CHROUT Routine
The C64 KERNAL provides a character output routine at $FFD2:
```asm
lda #65         ; ASCII 'A'
jsr $FFD2       ; Print it
```

### Direct Screen Memory
The C64 screen starts at $0400 (1024 decimal):
```asm
lda #1          ; Screen code for 'A'
sta $0400       ; Top-left corner
```

### Color RAM
Each screen position has a corresponding color byte at $D800:
```asm
lda #7          ; Yellow
sta $D800       ; Color for top-left
```

## Screen Codes vs PETSCII

- PETSCII: Used by KERNAL routines (A=$41)
- Screen codes: Used in screen memory (A=$01)
- They differ! Use KERNAL for text, direct memory for graphics.

## Next Steps

Try modifying the example to:
1. Change the text color
2. Position text elsewhere on screen
3. Create a scrolling message