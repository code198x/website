---
title: "Interrupts and System Programming"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 15
description: "Learn interrupt handling and system-level programming on the C64. Learn to work with hardware interrupts, timer events, and the KERNAL operating system for professional system programming."
learning_objectives:
  - "Understand interrupt concepts and hardware interrupt sources"
  - "Learn interrupt service routines (ISRs) and the RTI instruction"
  - "Learn to work with the C64 KERNAL operating system"
  - "Practice timer interrupts and real-time programming"
  - "Build system-level programs that interact with hardware"
concepts:
  - "Hardware interrupts (IRQ, NMI)"
  - "Interrupt service routines (ISR)"
  - "RTI (Return from Interrupt) instruction"
  - "C64 KERNAL system calls"
  - "Timer interrupts and real-time programming"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 15
---

# Lesson 15: Interrupts and System Programming

Welcome to system-level programming! Today you'll learn about **interrupts** - the mechanism that lets your program respond to external events and work cooperatively with the operating system. This is where assembly programming becomes truly powerful and professional.

## What Are Interrupts?

**Interrupts** are signals that temporarily suspend your program to handle urgent events:

- **Hardware events**: Timer ticks, keyboard presses, disk operations
- **System events**: Operating system calls, error conditions
- **Real-time response**: Handle time-critical events immediately
- **Cooperative multitasking**: Share CPU time with other processes

Think of interrupts like a phone call - when it rings, you pause what you're doing, answer the call, then return to your original task.

## The 6502 Interrupt System

The 6502 processor supports two types of interrupts:

### IRQ (Interrupt Request) - Maskable Interrupt

- **Source**: CIA timers, raster interrupts, serial port, etc.
- **Maskable**: Can be disabled with SEI instruction
- **Vector**: $FFFE/$FFFF contains handler address
- **Usage**: Regular system events, timing, I/O

### NMI (Non-Maskable Interrupt) - Critical Interrupt  

- **Source**: RESTORE key, critical hardware events
- **Non-maskable**: Cannot be disabled (always responds)
- **Vector**: $FFFA/$FFFB contains handler address  
- **Usage**: Emergency situations, debugging, reset conditions

```text
; Interrupt vectors in memory
; $FFFA/$FFFB: NMI vector (Non-Maskable Interrupt)
; $FFFC/$FFFD: RESET vector (System startup)
; $FFFE/$FFFF: IRQ vector (Interrupt Request)
```

## How Interrupts Work

When an interrupt occurs, the 6502 automatically:

1. **Finishes current instruction**
2. **Pushes return address** (PC) onto stack
3. **Pushes status register** onto stack  
4. **Sets Interrupt flag** (disables further IRQs)
5. **Jumps to interrupt handler** (via vector)

Your interrupt handler must:
1. **Handle the interrupt** (process the event)
2. **Restore registers** (if modified)
3. **Execute RTI** (Return from Interrupt)

```text
; What happens during interrupt:
; 1. Hardware pushes PC high byte to stack
; 2. Hardware pushes PC low byte to stack  
; 3. Hardware pushes status register to stack
; 4. Hardware sets I flag (SEI equivalent)
; 5. Hardware loads PC from interrupt vector
; 6. Your interrupt handler executes
; 7. RTI restores everything and returns
```

## The RTI Instruction

**RTI** (Return from Interrupt) is special - it restores everything automatically:

**Syntax**: `RTI`
**Effect**: 
1. Pulls status register from stack (restores all flags)
2. Pulls return address from stack
3. Jumps back to interrupted program

```text
MyInterruptHandler:
    ; Save registers
    PHA             ; Save A
    TXA
    PHA             ; Save X
    TYA  
    PHA             ; Save Y
    
    ; Handle the interrupt
    LDA $DC0D       ; Read CIA1 interrupt register
    ; Process interrupt...
    
    ; Restore registers
    PLA
    TAY             ; Restore Y
    PLA
    TAX             ; Restore X
    PLA             ; Restore A
    
    RTI             ; Return from interrupt
```

**Basic Interrupt Handler Structure:**

```assembly
; Interrupt handler template
InterruptHandler:
    ; Always save registers first
    PHA             ; Save A register
    TXA
    PHA             ; Save X register
    TYA
    PHA             ; Save Y register
    
    ; Interrupt processing goes here
    INC $D020       ; Example: Change border colour
    
    ; Clear interrupt source (important!)
    LDA $DC0D       ; Acknowledge CIA1 interrupt
    
    ; Restore registers in reverse order
    PLA
    TAY             ; Restore Y
    PLA  
    TAX             ; Restore X
    PLA             ; Restore A
    
    RTI             ; Return from interrupt
```

## Setting Up Custom Interrupts

To install your own interrupt handler:

```text
; Disable interrupts while changing vectors
SEI             ; Set interrupt flag (disable IRQs)

; Save original vector
LDA $0314       ; KERNAL IRQ vector low
STA SavedIRQLow
LDA $0315       ; KERNAL IRQ vector high  
STA SavedIRQHigh

; Install new handler
LDA #<MyHandler ; Low byte of handler address
STA $0314
LDA #>MyHandler ; High byte of handler address
STA $0315

; Re-enable interrupts
CLI             ; Clear interrupt flag (enable IRQs)
```

**Installing Custom Interrupt Handler:**

```assembly
; Install custom interrupt handler
; First disable interrupts
SEI             ; Disable interrupts

; Save original KERNAL IRQ vector
LDA $0314       ; KERNAL IRQ low byte
STA $90         ; Save in zero page
LDA $0315       ; KERNAL IRQ high byte
STA $91         ; Save in zero page

; Install our handler (simulate address)
LDA #$00        ; Low byte of our handler
STA $0314       ; Set new IRQ vector low
LDA #$C0        ; High byte of our handler  
STA $0315       ; Set new IRQ vector high

; Re-enable interrupts
CLI             ; Enable interrupts

; Restore original vector later
SEI             ; Disable interrupts
LDA $90         ; Original low byte
STA $0314       ; Restore IRQ vector
LDA $91         ; Original high byte
STA $0315       ; Restore IRQ vector
CLI             ; Re-enable interrupts
```

## CIA Timer Interrupts

The **CIA** (Complex Interface Adapter) chips provide precise timing:

### CIA1 ($DC00-$DCFF) - User Interface
- **Timer A**: Programmable interval timer
- **Timer B**: Secondary timer, can chain with Timer A
- **Keyboard scanning**: Key press detection
- **Joystick ports**: Controller input

### CIA2 ($DD00-$DDFF) - System Interface  
- **Timer A/B**: Additional timers
- **Serial port**: Communication
- **Memory banking**: Switch ROM/RAM

```text
; Setup CIA1 Timer A for regular interrupts
LDA #$7F        ; Disable all CIA1 interrupts
STA $DC0D       ; CIA1 interrupt control

LDA #$01        ; Enable Timer A interrupt
STA $DC0D       ; CIA1 interrupt control

; Set timer value (1/60th second at 1MHz)
LDA #$25        ; Low byte of timer value
STA $DC04       ; Timer A low
LDA #$40        ; High byte of timer value  
STA $DC05       ; Timer A high

; Start timer
LDA #$11        ; Start Timer A, continuous mode
STA $DC0E       ; Timer A control
```

**CIA Timer Setup:**

```assembly
; Setup CIA1 Timer A for periodic interrupts
; Configure timer for 1/60th second intervals

; Disable all CIA interrupts first
LDA #$7F        ; Bit 7 clear = disable, bits 0-6 = interrupt sources
STA $DC0D       ; CIA1 interrupt control register

; Set timer value (approximate 60Hz)
LDA #$25        ; Timer low byte
STA $DC04       ; CIA1 Timer A low
LDA #$40        ; Timer high byte
STA $DC05       ; CIA1 Timer A high

; Enable Timer A interrupt
LDA #$81        ; Bit 7 set = enable, bit 0 = Timer A
STA $DC0D       ; CIA1 interrupt control

; Start timer in continuous mode
LDA #$11        ; Continuous mode, start timer
STA $DC0E       ; CIA1 Timer A control
```

## Real-Time Programming with Interrupts

Create programs that respond to real-time events:

```text
; Global variables for interrupt communication
FrameCounter    = $80   ; Counts interrupt occurrences
UpdateFlag      = $81   ; Signals main program to update

TimerInterrupt:
    PHA                 ; Save registers
    TXA
    PHA
    TYA
    PHA
    
    ; Update frame counter
    INC FrameCounter    ; Increment every interrupt
    
    ; Set update flag for main program
    LDA #$01
    STA UpdateFlag      ; Signal update needed
    
    ; Clear interrupt source
    LDA $DC0D           ; Acknowledge CIA1 interrupt
    
    ; Restore registers
    PLA
    TAY
    PLA
    TAX
    PLA
    
    RTI                 ; Return from interrupt
    
; Main program loop
MainLoop:
    LDA UpdateFlag      ; Check if update needed
    BEQ MainLoop        ; Wait for interrupt signal
    
    ; Reset flag
    LDA #$00
    STA UpdateFlag
    
    ; Update display based on frame counter
    LDA FrameCounter
    AND #$0F            ; Keep low 4 bits
    STA $D020           ; Change border colour
    
    JMP MainLoop        ; Continue
```

**Real-Time Programming Example:**

```assembly
; Real-time programming with interrupt communication
; Setup communication variables
LDA #$00
STA $80         ; Frame counter
STA $81         ; Update flag

MainLoop:
    ; Check for interrupt signal
    LDA $81         ; Load update flag
    BEQ MainLoop    ; Wait if no update needed
    
    ; Process update
    LDA #$00        ; Clear update flag
    STA $81
    
    ; Update display based on timing
    LDA $80         ; Load frame counter
    AND #$07        ; Keep low 3 bits (0-7)
    STA $D020       ; Set border colour
    
    ; Increment frame counter (simulating interrupt)
    INC $80         ; Increment counter
    
    ; Simulate interrupt setting flag
    LDA #$01
    STA $81         ; Set update flag
    
    JMP MainLoop    ; Continue loop
```

## KERNAL System Calls

The **KERNAL** is the C64's operating system. Access it through jump table:

### Important KERNAL Routines

| Address | Name | Function |
|---------|------|----------|
| **$FFD2** | CHROUT | Output character to screen |
| **$FFCF** | CHRIN | Input character from keyboard |
| **$FFC6** | CHKOUT | Open output channel |
| **$FFC9** | CHKIN | Open input channel |
| **$FFE4** | GETIN | Get character from input |

```text
; Use KERNAL to output character
LDA #$48        ; 'H'
JSR $FFD2       ; KERNAL CHROUT routine

; Use KERNAL to get keyboard input
JSR $FFE4       ; KERNAL GETIN routine
; A register contains key pressed (or 0 if none)
```

**KERNAL System Calls:**

```assembly
; Using KERNAL operating system routines
; Output characters using KERNAL

LDA #$48        ; Load 'H'
JSR $FFD2       ; Call KERNAL CHROUT (print character)

LDA #$45        ; Load 'E'  
JSR $FFD2       ; Call KERNAL CHROUT

LDA #$4C        ; Load 'L'
JSR $FFD2       ; Call KERNAL CHROUT

LDA #$4C        ; Load 'L'
JSR $FFD2       ; Call KERNAL CHROUT

LDA #$4F        ; Load 'O'
JSR $FFD2       ; Call KERNAL CHROUT

; KERNAL handles screen positioning, scrolling, etc.
```

## Interrupt-Driven Input/Output

Handle keyboard input through interrupts:

```text
; Keyboard interrupt handler
KeyboardISR:
    PHA                 ; Save registers
    TXA
    PHA
    TYA
    PHA
    
    ; Scan keyboard
    JSR $EA87           ; KERNAL keyboard scan routine
    JSR $FFE4           ; KERNAL get character
    BEQ NoKey           ; Branch if no key pressed
    
    ; Process key press
    STA LastKey         ; Store key for main program
    LDA #$01
    STA KeyFlag         ; Signal key available
    
NoKey:
    ; Clear interrupt source
    LDA $DC0D           ; Acknowledge CIA1
    
    ; Restore registers
    PLA
    TAY
    PLA
    TAX
    PLA
    
    RTI
```

## System Programming Best Practices

### Critical Sections

**Critical sections** are code that must not be interrupted:

```text
; Critical section - must complete atomically
SEI                 ; Disable interrupts
; Critical code here - update shared data
LDA SharedCounter
ADC #$01
STA SharedCounter
CLI                 ; Re-enable interrupts
```

### Register Preservation

Always save/restore registers in interrupt handlers:

```text
InterruptHandler:
    ; Save ALL registers that might be used
    PHA             ; Save A
    TXA
    PHA             ; Save X  
    TYA
    PHA             ; Save Y
    
    ; Your interrupt code here
    
    ; Restore in REVERSE order
    PLA
    TAY             ; Restore Y
    PLA
    TAX             ; Restore X
    PLA             ; Restore A
    
    RTI             ; Return from interrupt
```

### Interrupt Latency

Keep interrupt handlers **fast**:

```text
; Good: Fast interrupt handler
FastISR:
    PHA
    INC $D020       ; Quick operation
    LDA $DC0D       ; Clear interrupt
    PLA
    RTI

; Bad: Slow interrupt handler  
SlowISR:
    PHA
    ; ... lots of complex processing ...
    ; This delays other interrupts!
    PLA
    RTI
```

**Interrupt Handler Best Practices:**

```assembly
; Demonstrate proper interrupt handler design
FastInterruptHandler:
    ; Minimal register saving
    PHA             ; Save only A if that's all we use
    
    ; Fast, essential processing only
    LDA $80         ; Load counter
    CLC
    ADC #$01        ; Increment
    AND #$0F        ; Keep in range 0-15
    STA $80         ; Store back
    STA $D020       ; Update border colour
    
    ; Clear interrupt source (essential!)
    LDA $DC0D       ; Acknowledge CIA1 interrupt
    
    ; Restore and return quickly
    PLA             ; Restore A
    RTI             ; Return from interrupt

; Initialize counter
LDA #$00
STA $80         ; Start counter at 0
```

## Building a Complete Interrupt System

Here's a complete example of professional interrupt handling:

```text
; Complete interrupt system example
.org $C000          ; Load in RAM area

; Variables
OldIRQLow   = $90   ; Save original IRQ vector
OldIRQHigh  = $91
TickCounter = $92   ; Counts timer ticks
SecondCounter = $93 ; Counts seconds

InitSystem:
    ; Disable interrupts during setup
    SEI
    
    ; Save original IRQ vector
    LDA $0314
    STA OldIRQLow
    LDA $0315  
    STA OldIRQHigh
    
    ; Install our handler
    LDA #<MyIRQHandler
    STA $0314
    LDA #>MyIRQHandler
    STA $0315
    
    ; Initialize variables
    LDA #$00
    STA TickCounter
    STA SecondCounter
    
    ; Setup CIA1 Timer A for 60Hz
    LDA #$7F
    STA $DC0D       ; Disable CIA1 interrupts
    
    LDA #$25        ; Timer value for ~60Hz
    STA $DC04       ; Timer A low
    LDA #$40
    STA $DC05       ; Timer A high
    
    LDA #$81        ; Enable Timer A interrupt
    STA $DC0D
    
    LDA #$11        ; Start timer, continuous
    STA $DC0E
    
    ; Re-enable interrupts
    CLI
    RTS

MyIRQHandler:
    ; Save registers
    PHA
    TXA
    PHA
    TYA
    PHA
    
    ; Count ticks
    INC TickCounter
    LDA TickCounter
    CMP #60         ; 60 ticks = 1 second
    BNE NotSecond
    
    ; One second elapsed
    LDA #$00
    STA TickCounter ; Reset tick counter
    INC SecondCounter ; Increment second counter
    
    ; Update display every second
    LDA SecondCounter
    AND #$0F        ; Keep in range 0-15
    STA $D020       ; Change border colour
    
NotSecond:
    ; Clear interrupt source
    LDA $DC0D       ; Acknowledge CIA1
    
    ; Restore registers
    PLA
    TAY
    PLA
    TAX
    PLA
    
    RTI

RestoreSystem:
    ; Restore original IRQ vector
    SEI
    LDA OldIRQLow
    STA $0314
    LDA OldIRQHigh
    STA $0315
    CLI
    RTS
```

## Practice Exercise

Create an interrupt-driven digital clock system that:

1. Uses CIA Timer A for precise timing
2. Maintains hours, minutes, and seconds
3. Updates the display once per second
4. Demonstrates proper interrupt handling techniques

**Practice Exercise - Interrupt-Driven Clock:**

```assembly
; Interrupt-driven clock system
; Variables for time keeping
Hours    = $80      ; 0-23
Minutes  = $81      ; 0-59  
Seconds  = $82      ; 0-59
Ticks    = $83      ; 0-59 (60Hz counter)

InitClock:
    ; Initialize time to 12:00:00
    LDA #$0C        ; 12 hours
    STA Hours
    LDA #$00        ; 0 minutes
    STA Minutes  
    LDA #$00        ; 0 seconds
    STA Seconds
    LDA #$00        ; 0 ticks
    STA Ticks
    RTS

ClockInterrupt:
    ; Save registers
    PHA
    TXA
    PHA
    TYA
    PHA
    
    ; Increment tick counter
    INC Ticks
    LDA Ticks
    CMP #$3C        ; 60 ticks = 1 second
    BNE ClockDone
    
    ; One second elapsed
    LDA #$00
    STA Ticks       ; Reset ticks
    
    ; Increment seconds
    INC Seconds
    LDA Seconds
    CMP #$3C        ; 60 seconds = 1 minute
    BNE UpdateDisplay
    
    ; One minute elapsed
    LDA #$00
    STA Seconds     ; Reset seconds
    
    ; Increment minutes
    INC Minutes
    LDA Minutes
    CMP #$3C        ; 60 minutes = 1 hour
    BNE UpdateDisplay
    
    ; One hour elapsed
    LDA #$00
    STA Minutes     ; Reset minutes
    
    ; Increment hours (24-hour format)
    INC Hours
    LDA Hours
    CMP #$18        ; 24 hours = new day
    BNE UpdateDisplay
    LDA #$00
    STA Hours       ; Reset to 00:00:00
    
UpdateDisplay:
    ; Display current time (simplified)
    LDA Hours
    STA $0400       ; Display hours
    LDA Minutes
    STA $0401       ; Display minutes
    LDA Seconds
    STA $0402       ; Display seconds
    
ClockDone:
    ; Simulate clearing interrupt source
    LDA $DC0D       ; Would clear CIA1 interrupt
    
    ; Restore registers
    PLA
    TAY
    PLA
    TAX
    PLA
    
    RTI

; Initialize and run one tick
JSR InitClock
JSR ClockInterrupt
```

## Interrupt Sources on the C64

### Hardware Interrupt Sources
- **CIA1 Timer A/B**: Programmable timers
- **CIA2 Timer A/B**: Additional timers  
- **Raster interrupt**: Video beam position
- **Serial port**: Data communication
- **Keyboard**: Key press events

### Software Interrupt Sources
- **BRK instruction**: Software interrupt
- **System calls**: KERNAL routines
- **Error conditions**: Illegal operations

## What You've Learned

In this lesson, you've mastered:

- Interrupt concepts and the 6502 interrupt system
- IRQ and NMI interrupt types and their uses
- Writing interrupt service routines with proper register handling
- RTI instruction for returning from interrupts
- CIA timer programming for precise timing
- KERNAL system calls for operating system integration
- Real-time programming techniques with interrupt communication
- Professional interrupt handling best practices

## Looking Ahead

In the next lesson, you'll complete the Memory and Addressing section with a comprehensive review that ties together everything you've learned from lessons 9-16. You'll see how all these concepts work together to create sophisticated, professional-quality programs.

## Fun Fact

The interrupt system you've just learned is the foundation of **every modern operating system**! When you click a mouse, press a key, or receive a network packet on your computer, the exact same principles apply: hardware generates an interrupt, the CPU saves its state, jumps to a handler routine, processes the event, and returns to the previous task. The cooperative multitasking, real-time response, and system integration you've mastered are the core concepts that make modern computing possible. You've just learned the fundamental mechanism that powers everything from embedded systems to supercomputers!