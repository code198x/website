# Lesson 1: Hello, Neon World!

## Opening Hook

Every journey begins with a single step. Every game begins with a single pixel. Today, you join the ranks of bedroom coders who transformed the computing world in the 1980s, armed with nothing but a Commodore 64 and determination.

This isn't just "Hello World" - this is your initiation into assembly language, where you command the machine directly. No interpreters, no compilers standing between you and raw silicon. Let's light up that screen!

## Code Walkthrough

### The BASIC Loader

Every C64 program needs a way to start. We use a tiny BASIC program:

```assembly
*= $0801                ; Start at BASIC area

; BASIC stub: 10 SYS 2080
!word next_line         ; Pointer to next BASIC line
!word 10                ; Line number
!byte $9e               ; SYS token
!text "2080"            ; Our machine code address
!byte 0                 ; End of BASIC line
next_line:
!word 0                 ; End of BASIC program
```

This creates: `10 SYS 2080` - when RUN, it jumps to our code at $0820 (2080 decimal).

### Setting Up Our Code

Now for the real programming:

```assembly
*= $0820                ; Our code starts here

main:
    ; Set border color to red
    lda #$02            ; Color code for red
    sta $d020           ; Border color register
    
    ; Set background color to black
    lda #$00            ; Color code for black
    sta $d021           ; Background color register
```

Three instructions, and we've already changed what you see! The `lda` loads a value, `sta` stores it.

### Writing to Screen Memory

The C64 screen is a grid of 40×25 characters, starting at memory location $0400:

```assembly
    ; Display a star in the center
    lda #$2a            ; PETSCII code for asterisk
    sta $0400+500       ; Middle of screen (row 12, col 20)
    
    ; Make it white
    lda #$01            ; Color code for white
    sta $d800+500       ; Color RAM same position
```

### The Infinite Loop

Programs must keep running:

```assembly
    ; Infinite loop - program never ends
loop:
    jmp loop            ; Jump to itself forever
```

Without this, the C64 would crash back to BASIC!

## Interactive Elements

### Experiment 1: Color Changes
Try different color values:
```assembly
lda #$07    ; Yellow
lda #$0e    ; Light blue  
lda #$05    ; Green
```
The C64 has 16 colors (0-15). What's your favorite?

### Experiment 2: Different Characters
Change the displayed character:
```assembly
lda #$01    ; 'A'
lda #$20    ; Space
lda #$51    ; Ball character
lda #$5e    ; Arrow
```

### Experiment 3: Multiple Characters
Display your initials:
```assembly
lda #$0a        ; 'J'
sta $0400+499
lda #$04        ; 'D'  
sta $0400+500
lda #$05        ; 'E'
sta $0400+501
```

## Deep Dive: Memory Map

Understanding C64 memory is crucial:

```
$0000-$00FF: Zero page (fast access)
$0400-$07FF: Screen memory (1000 bytes)
$0801-$9FFF: BASIC area (where we load)
$D000-$DFFF: I/O area (VIC, SID, CIA)
$D020: Border color
$D021: Background color
$D800-$DBE7: Color RAM
```

Every memory location has a purpose. Learning them is like learning the streets of your hometown.

### The VIC-II Chip

The Video Interface Controller II (VIC-II) is the C64's graphics chip:
- Handles all screen display
- 16 colors
- 40×25 text mode (what we're using)
- 320×200 bitmap mode
- 8 hardware sprites

Registers we used:
- `$D020`: Border color (the thick frame)
- `$D021`: Background color (behind characters)

## Challenge Extensions

1. **Rainbow Border**: Cycle through all 16 colors
   ```assembly
   loop:
       inc $d020       ; Increment border color
       jmp loop        ; Creates seizure-inducing effect!
   ```

2. **Screen Fill**: Fill entire screen with a character
   ```assembly
   ldx #0
   fill_loop:
       lda #$2a
       sta $0400,x
       sta $0500,x
       sta $0600,x
       sta $0700,x
       inx
       bne fill_loop
   ```

3. **Color Bars**: Create colored stripes

4. **Message**: Display "HELLO" centered on screen

## Common Pitfalls

- **Wrong Memory Address**: $D020 vs $0D20 - hex is tricky!
- **PETSCII vs ASCII**: Character codes are different
- **No Infinite Loop**: Program crashes without it
- **Color Mismatch**: Border and background same color = invisible border

## Historical Context

In 1982, this was revolutionary. Previous computers required BASIC for everything. The C64 let you touch the metal directly. Games like Impossible Mission and The Last Ninja started exactly like this - one pixel at a time.

Famous first programs:
- **Jeff Minter**: Started with color cycling
- **Andrew Braybrook**: Drew a single sprite
- **Archer Maclean**: Made a dot bounce

Your star joins this legacy!

## Next Steps

A static star is just the beginning. What if it could move? What if you could control it? What if it left a trail of light behind it?

In lesson 2, we'll make that star dance across the screen. Get ready to enter the world of animation!