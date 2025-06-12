---
title: "Error Handling and Debugging Basics"
system: "commodore-64"
phase_number: 1
tier_number: 1
lesson_number: 28
description: "Learn systematic debugging and error handling techniques for assembly programming. Learn to identify, isolate, and fix bugs efficiently while building robust error-resistant programs."
learning_objectives:
  - "Understand common assembly programming errors and their causes"
  - "Learn systematic debugging techniques and problem isolation"
  - "Learn error detection and prevention strategies"
  - "Practice debugging tools and memory inspection techniques"
  - "Build robust programs with comprehensive error handling"
concepts:
  - "Common assembly programming errors and debugging patterns"
  - "Systematic debugging methodology and problem isolation"
  - "Memory inspection and program state analysis"
  - "Error detection and prevention techniques"
  - "Professional debugging and testing practices"
estimated_duration: "30-45 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 28
---

# Lesson 28: Error Handling and Debugging Basics

Welcome to systematic debugging! Today you'll learn to identify, isolate, and fix bugs in assembly programs efficiently. These essential skills transform frustrating debugging sessions into methodical problem-solving exercises.

## Common Assembly Programming Errors

**Assembly debugging** requires understanding typical error patterns:

- **Logic Errors**: Incorrect program flow or calculations
- **Memory Errors**: Wrong addressing or data corruption
- **Register Errors**: Incorrect register usage or preservation
- **Stack Errors**: Unbalanced stack operations
- **Timing Errors**: Race conditions and synchronization issues

Think of debugging as **detective work** - systematically gathering evidence to identify the root cause of problems.

### Logic and Flow Errors

```text
; Common logic error examples and fixes

; ERROR: Infinite loop due to wrong comparison
BadLoop:
    LDX #$10
LoopStart:
    ; Process data
    LDA DataArray,X
    JSR ProcessByte
    
    ; WRONG: This will never reach zero
    INX                 ; Should be DEX
    BNE LoopStart      ; Will loop forever
    RTS

; FIXED: Correct loop structure
GoodLoop:
    LDX #$10
LoopStart:
    ; Process data
    LDA DataArray,X
    JSR ProcessByte
    
    ; CORRECT: Decrement toward zero
    DEX
    BPL LoopStart      ; Loop while positive/zero
    RTS

; ERROR: Wrong branch condition
BadConditional:
    LDA PlayerHealth
    CMP #$00
    BNE PlayerAlive    ; WRONG: Should be BEQ for "equal to zero"
    
    ; Dead player code
    JSR HandlePlayerDeath
    RTS
    
PlayerAlive:
    ; Alive player code
    JSR UpdatePlayer
    RTS

; FIXED: Correct branch logic
GoodConditional:
    LDA PlayerHealth
    CMP #$00
    BEQ PlayerDead     ; CORRECT: Branch if equal to zero
    
    ; Alive player code
    JSR UpdatePlayer
    RTS
    
PlayerDead:
    ; Dead player code
    JSR HandlePlayerDeath
    RTS

; ERROR: Flag misunderstanding
BadFlagCheck:
    LDA #$80
    CMP #$7F
    BCC ValueTooLow    ; WRONG: $80 > $7F, but this treats as signed
    
    ; Handle high value
    RTS

ValueTooLow:
    ; This will execute incorrectly
    RTS

; FIXED: Understand signed vs unsigned comparisons
GoodFlagCheck:
    LDA #$80
    CMP #$7F
    BCS ValueHighEnough  ; CORRECT: For unsigned comparison
    
    ; Handle low value
    RTS

ValueHighEnough:
    ; Handle high value
    RTS
```

### Memory and Addressing Errors

```text
; Memory access and addressing mistakes

; ERROR: Wrong addressing mode
BadAddressing:
    LDA #DataArray     ; WRONG: Loads address, not data
    STA Result         ; Stores address instead of data value
    RTS

; FIXED: Correct addressing
GoodAddressing:
    LDA DataArray      ; CORRECT: Loads data from address
    STA Result         ; Stores actual data value
    RTS

; ERROR: Index out of bounds
BadIndexing:
    LDX #$10           ; Index 16
    LDA DataArray,X    ; WRONG: If array is only 16 bytes (0-15)
    RTS                ; Accessing undefined memory

; FIXED: Proper bounds checking
GoodIndexing:
    LDX #$10
    CPX #ArraySize     ; Check bounds first
    BCS IndexError     ; Branch if index >= size
    
    LDA DataArray,X    ; Safe to access
    RTS

IndexError:
    ; Handle error condition
    LDA #$FF           ; Error value
    RTS

; ERROR: Pointer corruption
BadPointer:
    LDA #<DataArray
    STA $FB
    LDA #>DataArray
    STA $FC            ; Setup pointer
    
    LDY #$00
    LDA ($FB),Y        ; Read data
    
    ; WRONG: Accidentally modify pointer
    INC $FB            ; Corrupts pointer low byte
    LDA ($FB),Y        ; Now reading wrong location
    RTS

; FIXED: Preserve pointers or use temporary copies
GoodPointer:
    LDA #<DataArray
    STA $FB
    LDA #>DataArray
    STA $FC            ; Setup pointer
    
    LDY #$00
    LDA ($FB),Y        ; Read first byte
    
    ; CORRECT: Use index instead of modifying pointer
    INY
    LDA ($FB),Y        ; Read second byte
    RTS

DataArray: .byte $01, $02, $03, $04, $05
ArraySize = 5
Result: .byte 0
```

<CodeRunner 
  system="commodore-64"
  title="Common Error Detection Demo"
  code="; Demonstrate common programming errors and detection
; Shows how to identify and fix typical assembly mistakes

ErrorDetectionDemo:
    JSR DemoLogicErrors
    JSR DemoMemoryErrors
    JSR DemoRegisterErrors
    RTS

DemoLogicErrors:
    ; Demonstrate logic error detection
    
    ; Test 1: Check loop bounds
    JSR TestLoopBounds
    
    ; Test 2: Check conditional logic
    JSR TestConditionals
    
    ; Test 3: Check flag handling
    JSR TestFlags
    
    RTS

TestLoopBounds:
    ; Test proper loop termination
    LDX #$05        ; Start counter
    LDA #$00        ; Clear accumulator
    
BoundsTestLoop:
    ; Add index to accumulator
    STX $90         ; Save X
    TXA
    CLC
    ADC $90         ; Add saved X (demonstrates register preservation)
    
    ; Check for termination
    DEX
    BPL BoundsTestLoop  ; Continue while positive
    
    ; Store result for verification
    STA LoopResult
    
    RTS

TestConditionals:
    ; Test conditional branching logic
    LDA #$50        ; Test value
    STA TestValue
    
    ; Test greater than
    CMP #$40
    BCC NotGreater  ; Branch if less than
    
    ; Greater than or equal
    LDA #$01
    STA ConditionResult
    JMP ConditionalEnd
    
NotGreater:
    ; Less than
    LDA #$00
    STA ConditionResult
    
ConditionalEnd:
    RTS

TestFlags:
    ; Test flag register behavior
    LDA #$FF        ; Load maximum value
    CLC             ; Clear carry
    ADC #$01        ; Add 1 (should set carry and zero flags)
    
    ; Check if overflow occurred correctly
    BCS OverflowDetected
    
    ; No overflow (error condition)
    LDA #$FF
    STA FlagResult
    JMP FlagEnd
    
OverflowDetected:
    ; Overflow detected correctly
    LDA #$00        ; Should be zero after $FF + $01
    STA FlagResult
    
FlagEnd:
    RTS

DemoMemoryErrors:
    ; Demonstrate memory error detection
    
    ; Test 1: Array bounds checking
    JSR TestArrayBounds
    
    ; Test 2: Pointer validation
    JSR TestPointers
    
    ; Test 3: Data integrity
    JSR TestDataIntegrity
    
    RTS

TestArrayBounds:
    ; Demonstrate safe array access
    LDX #$00        ; Array index
    
ArrayAccessLoop:
    ; Check bounds before access
    CPX #TestArraySize
    BCS ArrayAccessDone  ; Exit if index >= size
    
    ; Safe to access array
    LDA TestArray,X
    STA $80,X       ; Copy to workspace
    
    INX
    JMP ArrayAccessLoop
    
ArrayAccessDone:
    ; Set success indicator
    LDA #$01
    STA ArrayResult
    RTS

TestPointers:
    ; Demonstrate pointer validation and safe usage
    
    ; Setup pointer to test array
    LDA #<TestArray
    STA $FB         ; Pointer low
    LDA #>TestArray
    STA $FC         ; Pointer high
    
    ; Validate pointer (basic check)
    LDA $FB
    ORA $FC         ; Check if pointer is non-zero
    BEQ PointerError
    
    ; Use pointer safely
    LDY #$00
    LDA ($FB),Y     ; Read first element
    STA PointerResult
    
    CLC             ; Success
    RTS
    
PointerError:
    ; Handle null pointer
    LDA #$FF
    STA PointerResult
    SEC             ; Error
    RTS

TestDataIntegrity:
    ; Demonstrate data validation
    LDA TestArray   ; Get first element
    
    ; Validate data is in expected range
    CMP #$10        ; Minimum valid value
    BCC DataError
    CMP #$F0        ; Maximum valid value
    BCS DataError
    
    ; Data is valid
    STA IntegrityResult
    CLC
    RTS
    
DataError:
    ; Data out of range
    LDA #$00
    STA IntegrityResult
    SEC
    RTS

DemoRegisterErrors:
    ; Demonstrate register preservation and usage errors
    
    ; Test 1: Register preservation
    JSR TestRegisterPreservation
    
    ; Test 2: Register state tracking
    JSR TestRegisterStates
    
    RTS

TestRegisterPreservation:
    ; Show importance of preserving registers
    LDA #$42        ; Important value in A
    LDX #$24        ; Important value in X
    LDY #$84        ; Important value in Y
    
    ; Call subroutine that should preserve registers
    JSR PreservingSubroutine
    
    ; Verify registers are preserved
    CMP #$42
    BNE RegPreserveError
    CPX #$24
    BNE RegPreserveError
    CPY #$84
    BNE RegPreserveError
    
    ; Success
    LDA #$01
    STA PreserveResult
    RTS
    
RegPreserveError:
    ; Register preservation failed
    LDA #$00
    STA PreserveResult
    RTS

PreservingSubroutine:
    ; Properly preserve registers
    PHA             ; Save A
    TXA
    PHA             ; Save X
    TYA
    PHA             ; Save Y
    
    ; Do some work that modifies registers
    LDA #$00
    LDX #$00
    LDY #$00
    
    ; Restore registers in reverse order
    PLA
    TAY             ; Restore Y
    PLA
    TAX             ; Restore X
    PLA             ; Restore A
    
    RTS

TestRegisterStates:
    ; Demonstrate tracking register states
    
    ; Clear all flags for consistent starting state
    CLD             ; Clear decimal mode
    CLC             ; Clear carry
    CLV             ; Clear overflow
    
    ; Perform operation that affects flags
    LDA #$7F
    ADC #$01        ; Should set overflow flag
    
    ; Check if overflow occurred as expected
    BVS OverflowOK
    
    ; Overflow flag not set (unexpected)
    LDA #$00
    STA StateResult
    RTS
    
OverflowOK:
    ; Overflow flag set correctly
    LDA #$01
    STA StateResult
    RTS

; Test data
TestArray:      .byte $20, $40, $60, $80, $A0
TestArraySize = 5

; Result storage
LoopResult:      .byte 0
ConditionResult: .byte 0
FlagResult:      .byte 0
ArrayResult:     .byte 0
PointerResult:   .byte 0
IntegrityResult: .byte 0
PreserveResult:  .byte 0
StateResult:     .byte 0
TestValue:       .byte 0

; Run the error detection demonstration
JSR ErrorDetectionDemo"
  language="assembly"
/>

## Systematic Debugging Methodology

### Step-by-Step Debugging Process

```text
; Systematic debugging approach

DebuggingMethodology:
    ; 1. Reproduce the problem consistently
    ; 2. Isolate the problem area
    ; 3. Add diagnostic code
    ; 4. Test hypotheses systematically
    ; 5. Fix and verify

; Step 1: Problem reproduction
ReproduceProblem:
    ; Create minimal test case that shows the bug
    ; Document exact steps to trigger the problem
    ; Ensure problem occurs consistently
    RTS

; Step 2: Problem isolation using binary search
IsolateProblem:
    ; Divide program into sections
    ; Test each section independently
    ; Use status indicators to track execution
    
    LDA #$01
    STA Section1Status  ; Mark section 1 entry
    JSR Section1Code
    LDA #$02
    STA Section1Status  ; Mark section 1 exit
    
    LDA #$01
    STA Section2Status  ; Mark section 2 entry
    JSR Section2Code
    LDA #$02
    STA Section2Status  ; Mark section 2 exit
    
    ; Check which section failed
    JSR AnalyzeStatuses
    
    RTS

; Step 3: Add diagnostic instrumentation
AddDiagnostics:
    ; Insert checkpoints to track program state
    ; Use unused memory locations as debug variables
    ; Add markers for critical operations
    
    DebugCounter = $C0      ; Debug counter location
    DebugState = $C1        ; Current state marker
    DebugError = $C2        ; Error condition flag
    
    ; Example: Track loop iterations
    INC DebugCounter        ; Count executions
    LDA DebugCounter
    CMP #$FF               ; Check for runaway loop
    BEQ RunawayLoop
    
    ; Continue normal execution
    RTS

RunawayLoop:
    ; Runaway loop detected
    LDA #$FF
    STA DebugError
    RTS

Section1Code:
Section2Code:
    RTS

Section1Status: .byte 0
Section2Status: .byte 0

AnalyzeStatuses:
    ; Check section completion status
    ; Identify where execution stopped
    RTS
```

### Memory Inspection Techniques

```text
; Memory debugging and inspection tools

MemoryInspection:
    ; Create tools to examine memory contents
    ; Verify data integrity and corruption
    ; Track memory allocation and usage

DumpMemoryRange:
    ; Input: Start address in $FB/$FC, length in A
    STA DumpLength
    LDY #$00
    
DumpLoop:
    LDA ($FB),Y         ; Read memory byte
    JSR DisplayHexByte  ; Show in hex format
    
    ; Add space between bytes
    LDA #$20            ; Space character
    JSR $FFD2           ; CHROUT
    
    ; Next byte
    INY
    DEC DumpLength
    BNE DumpLoop
    
    ; Add newline
    LDA #$0D            ; Carriage return
    JSR $FFD2
    
    RTS

DisplayHexByte:
    ; Display byte in A as hex
    PHA                 ; Save original value
    
    ; Display high nibble
    LSR
    LSR
    LSR
    LSR                 ; Shift high nibble down
    JSR DisplayHexNibble
    
    ; Display low nibble
    PLA                 ; Restore original
    AND #$0F            ; Keep low nibble
    JSR DisplayHexNibble
    
    RTS

DisplayHexNibble:
    ; Display nibble (0-15) as hex digit
    CMP #$0A
    BCC DisplayDigit
    
    ; A-F
    CLC
    ADC #$37            ; Convert to ASCII A-F
    JMP ShowChar
    
DisplayDigit:
    ; 0-9
    CLC
    ADC #$30            ; Convert to ASCII 0-9
    
ShowChar:
    JSR $FFD2           ; CHROUT
    RTS

ChecksumMemory:
    ; Calculate checksum for memory integrity
    ; Input: Start in $FB/$FC, length in A
    STA CheckLength
    LDA #$00
    STA Checksum        ; Clear checksum
    
    LDY #$00
ChecksumLoop:
    LDA ($FB),Y
    CLC
    ADC Checksum        ; Add to running total
    STA Checksum
    
    INY
    DEC CheckLength
    BNE ChecksumLoop
    
    ; Return checksum in A
    LDA Checksum
    RTS

CompareMemory:
    ; Compare two memory regions
    ; Input: Addr1 in $FB/$FC, Addr2 in $FD/$FE, length in A
    STA CompareLength
    LDY #$00
    
CompareLoop:
    LDA ($FB),Y         ; Read from first region
    CMP ($FD),Y         ; Compare with second region
    BNE MemoryDifference
    
    INY
    DEC CompareLength
    BNE CompareLoop
    
    ; Memory regions are identical
    CLC
    RTS

MemoryDifference:
    ; Memory regions differ at offset Y
    SEC
    RTS

DumpLength:     .byte 0
Checksum:       .byte 0
CheckLength:    .byte 0
CompareLength:  .byte 0
```

<CodeRunner 
  system="commodore-64"
  title="Memory Inspection and Debugging Tools"
  code="; Memory inspection and debugging tools demonstration
; Shows techniques for examining program state and data

MemoryDebuggingDemo:
    JSR SetupDebugData
    JSR DemoMemoryInspection
    JSR DemoDataValidation
    JSR DemoStateTracking
    RTS

SetupDebugData:
    ; Create test data for debugging demonstrations
    
    ; Fill test array with pattern
    LDX #$00
    LDA #$10
TestDataLoop:
    STA TestData,X
    CLC
    ADC #$10            ; Increment by 16
    INX
    CPX #$08            ; 8 bytes
    BNE TestDataLoop
    
    ; Setup debug tracking variables
    LDA #$00
    STA DebugPhase      ; Current debug phase
    STA ErrorCount      ; Number of errors found
    STA ExecutionCount  ; Execution counter
    
    RTS

DemoMemoryInspection:
    ; Demonstrate memory examination techniques
    
    ; Phase 1: Inspect test data
    LDA #$01
    STA DebugPhase
    
    ; Examine our test array
    JSR InspectTestArray
    
    ; Phase 2: Check data integrity
    LDA #$02
    STA DebugPhase
    
    JSR ValidateTestData
    
    RTS

InspectTestArray:
    ; Examine test array contents
    LDX #$00
    
InspectLoop:
    LDA TestData,X      ; Get array element
    STA CurrentByte     ; Store for analysis
    
    ; Validate this byte
    CMP #$10            ; First element should be $10
    BCC InvalidData     ; Less than expected minimum
    CMP #$80            ; Last element should be $70
    BCS InvalidData     ; Greater than expected maximum
    
    ; Data appears valid for this element
    JMP NextElement
    
InvalidData:
    ; Found invalid data
    INC ErrorCount
    STX ErrorLocation   ; Record where error found
    
NextElement:
    INX
    CPX #$08            ; Check all 8 elements
    BNE InspectLoop
    
    RTS

ValidateTestData:
    ; Perform comprehensive data validation
    
    ; Test 1: Check array bounds
    LDX #$08            ; Try to access beyond array
    LDA TestData,X      ; This accesses undefined memory
    ; In real debugging, this would be caught by bounds checking
    
    ; Test 2: Verify data pattern
    LDX #$00
    LDA #$10            ; Expected first value
    
PatternCheck:
    CMP TestData,X      ; Check if matches expected pattern
    BNE PatternError
    
    ; Calculate next expected value
    CLC
    ADC #$10            ; Each element increases by $10
    
    INX
    CPX #$08
    BNE PatternCheck
    
    ; Pattern is correct
    LDA #$01
    STA PatternResult
    RTS
    
PatternError:
    ; Pattern validation failed
    LDA #$00
    STA PatternResult
    STX PatternErrorLocation
    INC ErrorCount
    RTS

DemoDataValidation:
    ; Demonstrate data validation techniques
    
    ; Test data integrity using checksums
    JSR CalculateDataChecksum
    
    ; Compare with expected checksum
    LDA DataChecksum
    CMP #$C0            ; Expected checksum for our test pattern
    BEQ ChecksumOK
    
    ; Checksum mismatch - data corruption detected
    INC ErrorCount
    LDA #$FF
    STA ChecksumResult
    RTS
    
ChecksumOK:
    LDA #$00
    STA ChecksumResult
    RTS

CalculateDataChecksum:
    ; Calculate simple checksum of test data
    LDA #$00
    STA DataChecksum    ; Clear checksum
    
    LDX #$00
ChecksumLoop:
    LDA TestData,X
    CLC
    ADC DataChecksum    ; Add to running total
    STA DataChecksum
    
    INX
    CPX #$08
    BNE ChecksumLoop
    
    RTS

DemoStateTracking:
    ; Demonstrate program state tracking
    
    ; Track execution through multiple phases
    LDA #$00
    STA ExecutionPhase
    
    ; Phase A
    INC ExecutionPhase  ; Mark phase entry
    JSR TrackableOperation1
    INC ExecutionCount  ; Count executions
    
    ; Phase B  
    INC ExecutionPhase  ; Mark phase entry
    JSR TrackableOperation2
    INC ExecutionCount  ; Count executions
    
    ; Phase C
    INC ExecutionPhase  ; Mark phase entry
    JSR TrackableOperation3
    INC ExecutionCount  ; Count executions
    
    ; Verify all phases completed
    LDA ExecutionPhase
    CMP #$03            ; Should be 3 after all phases
    BEQ AllPhasesComplete
    
    ; Execution tracking error
    INC ErrorCount
    
AllPhasesComplete:
    RTS

TrackableOperation1:
    ; Simulated operation with state tracking
    LDA #$A1            ; Operation signature
    STA Operation1Result
    RTS

TrackableOperation2:
    ; Simulated operation with state tracking
    LDA #$B2            ; Operation signature
    STA Operation2Result
    
    ; Simulate potential error condition
    LDA ExecutionCount
    CMP #$02            ; If this is second execution
    BEQ SimulateError
    RTS
    
SimulateError:
    ; Demonstrate error detection
    INC ErrorCount
    LDA #$FF
    STA Operation2Result
    RTS

TrackableOperation3:
    ; Simulated operation with state tracking
    LDA #$C3            ; Operation signature
    STA Operation3Result
    RTS

; Test data and variables
TestData:           .res 8      ; Test array
CurrentByte:        .byte 0     ; Currently examined byte
ErrorLocation:      .byte 0     ; Where error was found
PatternErrorLocation: .byte 0   ; Where pattern error occurred
DataChecksum:       .byte 0     ; Calculated checksum
ChecksumResult:     .byte 0     ; Checksum validation result
PatternResult:      .byte 0     ; Pattern validation result

; Debug tracking variables
DebugPhase:         .byte 0     ; Current debug phase
ErrorCount:         .byte 0     ; Total errors found
ExecutionCount:     .byte 0     ; Number of operations executed
ExecutionPhase:     .byte 0     ; Current execution phase

Operation1Result:   .byte 0     ; Results from tracked operations
Operation2Result:   .byte 0
Operation3Result:   .byte 0

; Run the memory debugging demonstration
JSR MemoryDebuggingDemo"
  language="assembly"
/>

## Error Detection and Prevention

### Defensive Programming Techniques

```text
; Defensive programming patterns for error prevention

DefensiveProgramming:
    ; Always validate inputs
    ; Check bounds and ranges
    ; Verify preconditions
    ; Handle edge cases explicitly

ValidateInput:
    ; Input validation example
    ; Input: Value in A, valid range $10-$F0
    CMP #$10
    BCC InputTooLow
    CMP #$F0
    BCS InputTooHigh
    
    ; Input is valid
    CLC
    RTS

InputTooLow:
    ; Handle low input
    LDA #$10            ; Clamp to minimum
    SEC
    RTS

InputTooHigh:
    ; Handle high input
    LDA #$F0            ; Clamp to maximum
    SEC
    RTS

SafeArrayAccess:
    ; Safe array access with bounds checking
    ; Input: Index in X, array base in $FB/$FC
    CPX #MaxArraySize
    BCS ArrayIndexError
    
    ; Safe to access
    LDA ($FB),X
    CLC
    RTS

ArrayIndexError:
    ; Index out of bounds
    LDA #$00            ; Return safe default
    SEC
    RTS

SafeDivision:
    ; Division with zero check
    ; Input: Dividend in A, divisor in X
    CPX #$00
    BEQ DivisionByZero
    
    ; Perform division (simplified)
    ; Real implementation would do actual division
    RTS

DivisionByZero:
    ; Handle division by zero
    LDA #$FF            ; Error indicator
    SEC
    RTS

StackBalanceCheck:
    ; Verify stack operations are balanced
    TSX                 ; Get current stack pointer
    STX StackBefore     ; Save initial stack state
    
    ; Perform operations that use stack
    JSR StackUsingOperation
    
    ; Verify stack is balanced
    TSX
    CPX StackBefore
    BEQ StackBalanced
    
    ; Stack imbalance detected
    LDA #$FF
    STA StackError
    RTS

StackBalanced:
    LDA #$00
    STA StackError
    RTS

StackUsingOperation:
    ; Example operation that must balance stack usage
    PHA                 ; Push A
    TXA
    PHA                 ; Push X
    
    ; Do some work
    LDA #$42
    LDX #$24
    
    ; Restore in reverse order
    PLA
    TAX                 ; Restore X
    PLA                 ; Restore A
    RTS

MaxArraySize = $10
StackBefore: .byte 0
StackError: .byte 0
```

### Assertion and Testing Framework

```text
; Simple assertion and testing system

AssertionFramework:
    ; Implement basic assertions for testing
    TestCount = $D0         ; Number of tests run
    FailCount = $D1         ; Number of failures
    
InitTesting:
    LDA #$00
    STA TestCount
    STA FailCount
    RTS

Assert:
    ; Input: Expected value in A, actual value in X
    ; Sets carry if assertion fails
    INC TestCount
    
    CMP X               ; Compare expected with actual (conceptual)
    BEQ AssertPass
    
    ; Assertion failed
    INC FailCount
    SEC
    RTS

AssertPass:
    ; Assertion passed
    CLC
    RTS

TestSuite:
    ; Example test suite
    JSR InitTesting
    
    ; Test 1: Basic arithmetic
    LDA #$05            ; Expected result
    LDX #$05            ; Actual result (2+3)
    JSR Assert
    BCS Test1Failed
    
    ; Test 2: Memory operations
    LDA #$42            ; Expected value
    LDX TestData        ; Actual value from memory
    JSR Assert
    BCS Test2Failed
    
    ; Test 3: Range validation
    LDA #$01            ; Expected: in range
    LDX #$01            ; Actual: validation result
    JSR Assert
    BCS Test3Failed
    
    ; All tests completed
    JSR ReportResults
    RTS

Test1Failed:
Test2Failed:
Test3Failed:
    ; Individual test failure handling
    RTS

ReportResults:
    ; Display test results
    ; In real implementation, would show pass/fail counts
    RTS

TestData: .byte $42
```

<CodeRunner 
  system="commodore-64"
  title="Error Prevention and Testing Framework"
  code="; Error prevention and testing framework demonstration
; Shows defensive programming and systematic testing

ErrorPreventionDemo:
    JSR InitializeFramework
    JSR DemoDefensiveProgramming
    JSR DemoTestingFramework
    JSR ReportFrameworkResults
    RTS

InitializeFramework:
    ; Setup error prevention and testing system
    LDA #$00
    STA TestsPassed     ; Number of tests passed
    STA TestsFailed     ; Number of tests failed
    STA TotalErrors     ; Total errors detected
    STA ValidationCount ; Number of validations performed
    
    RTS

DemoDefensiveProgramming:
    ; Demonstrate defensive programming techniques
    
    ; Test 1: Input validation
    JSR TestInputValidation
    
    ; Test 2: Bounds checking
    JSR TestBoundsChecking
    
    ; Test 3: Error condition handling
    JSR TestErrorHandling
    
    RTS

TestInputValidation:
    ; Test input validation with various values
    
    ; Valid input test
    LDA #$50            ; Valid input (in range $10-$F0)
    JSR ValidateInputRange
    BCS InvalidInput1
    
    INC TestsPassed
    JMP InputTest2
    
InvalidInput1:
    INC TestsFailed
    INC TotalErrors
    
InputTest2:
    ; Invalid input test (too low)
    LDA #$05            ; Invalid input (below $10)
    JSR ValidateInputRange
    BCC UnexpectedValid1 ; Should have failed
    
    ; Correctly detected invalid input
    INC TestsPassed
    JMP InputTest3
    
UnexpectedValid1:
    INC TestsFailed
    INC TotalErrors
    
InputTest3:
    ; Invalid input test (too high)
    LDA #$FF            ; Invalid input (above $F0)
    JSR ValidateInputRange
    BCC UnexpectedValid2 ; Should have failed
    
    ; Correctly detected invalid input
    INC TestsPassed
    RTS
    
UnexpectedValid2:
    INC TestsFailed
    INC TotalErrors
    RTS

ValidateInputRange:
    ; Validate input is in range $10-$F0
    ; Input: Value in A
    ; Output: Carry clear = valid, set = invalid
    
    INC ValidationCount
    
    CMP #$10
    BCC ValidationFailed    ; Below minimum
    CMP #$F0
    BCS ValidationFailed    ; Above maximum
    
    ; Input is valid
    CLC
    RTS
    
ValidationFailed:
    SEC
    RTS

TestBoundsChecking:
    ; Test array bounds checking
    
    ; Valid index test
    LDX #$03            ; Valid index (0-7 range)
    JSR SafeArrayAccess
    BCS BoundsError1
    
    INC TestsPassed
    JMP BoundsTest2
    
BoundsError1:
    INC TestsFailed
    INC TotalErrors
    
BoundsTest2:
    ; Invalid index test
    LDX #$10            ; Invalid index (beyond array)
    JSR SafeArrayAccess
    BCC UnexpectedAccess ; Should have failed
    
    ; Correctly detected bounds error
    INC TestsPassed
    RTS
    
UnexpectedAccess:
    INC TestsFailed
    INC TotalErrors
    RTS

SafeArrayAccess:
    ; Safe array access with bounds checking
    ; Input: Index in X
    ; Output: Carry clear = success, set = bounds error
    
    CPX #$08            ; Array size is 8 (indices 0-7)
    BCS BoundsViolation
    
    ; Safe to access array
    LDA SafeTestArray,X
    STA LastArrayValue
    CLC
    RTS
    
BoundsViolation:
    ; Index out of bounds
    LDA #$FF            ; Error indicator
    STA LastArrayValue
    SEC
    RTS

TestErrorHandling:
    ; Test error condition handling
    
    ; Test division by zero handling
    LDA #$10            ; Dividend
    LDX #$00            ; Divisor (zero)
    JSR SafeDivision
    BCC UnexpectedSuccess ; Should have detected error
    
    ; Correctly handled division by zero
    INC TestsPassed
    
    ; Test normal division
    LDA #$10            ; Dividend
    LDX #$02            ; Divisor (non-zero)
    JSR SafeDivision
    BCS UnexpectedError  ; Should have succeeded
    
    ; Division completed successfully
    INC TestsPassed
    RTS
    
UnexpectedSuccess:
UnexpectedError:
    INC TestsFailed
    INC TotalErrors
    RTS

SafeDivision:
    ; Safe division with zero checking
    ; Input: Dividend in A, divisor in X
    ; Output: Carry clear = success, set = error
    
    CPX #$00
    BEQ DivideByZeroError
    
    ; Perform division (simplified - just return dividend/2)
    LSR                 ; Divide by 2 for demonstration
    STA DivisionResult
    CLC
    RTS
    
DivideByZeroError:
    LDA #$FF            ; Error value
    STA DivisionResult
    SEC
    RTS

DemoTestingFramework:
    ; Demonstrate systematic testing framework
    
    ; Test arithmetic operations
    JSR TestArithmetic
    
    ; Test memory operations
    JSR TestMemoryOperations
    
    ; Test control flow
    JSR TestControlFlow
    
    RTS

TestArithmetic:
    ; Test basic arithmetic operations
    
    ; Test addition
    LDA #$10
    CLC
    ADC #$20
    CMP #$30            ; Expected result
    BEQ AdditionOK
    
    INC TestsFailed
    INC TotalErrors
    JMP TestSubtraction
    
AdditionOK:
    INC TestsPassed
    
TestSubtraction:
    ; Test subtraction
    LDA #$50
    SEC
    SBC #$20
    CMP #$30            ; Expected result
    BEQ SubtractionOK
    
    INC TestsFailed
    INC TotalErrors
    RTS
    
SubtractionOK:
    INC TestsPassed
    RTS

TestMemoryOperations:
    ; Test memory read/write operations
    
    ; Test memory write/read
    LDA #$42
    STA TestMemoryLocation
    LDA TestMemoryLocation
    CMP #$42
    BEQ MemoryOK
    
    INC TestsFailed
    INC TotalErrors
    RTS
    
MemoryOK:
    INC TestsPassed
    RTS

TestControlFlow:
    ; Test branching and control flow
    
    ; Test conditional branch
    LDA #$80
    CMP #$40
    BCS BranchTaken     ; Should branch (carry set)
    
    ; Branch not taken (error)
    INC TestsFailed
    INC TotalErrors
    RTS
    
BranchTaken:
    ; Branch taken correctly
    INC TestsPassed
    RTS

ReportFrameworkResults:
    ; Display testing results (simplified)
    ; In real implementation, would show detailed results
    
    ; Check if any tests failed
    LDA TestsFailed
    BEQ AllTestsPassed
    
    ; Some tests failed
    LDA #$FF
    STA OverallResult
    RTS
    
AllTestsPassed:
    ; All tests passed
    LDA #$00
    STA OverallResult
    RTS

; Test data
SafeTestArray:      .byte $10, $20, $30, $40, $50, $60, $70, $80
TestMemoryLocation: .byte 0
LastArrayValue:     .byte 0
DivisionResult:     .byte 0

; Framework variables
TestsPassed:        .byte 0
TestsFailed:        .byte 0
TotalErrors:        .byte 0
ValidationCount:    .byte 0
OverallResult:      .byte 0

; Run the error prevention demonstration
JSR ErrorPreventionDemo"
  language="assembly"
/>

## Debugging Tools and Techniques

### Simple Debugging Tools

```text
; Basic debugging utilities for assembly programs

DebuggingTools:
    ; Memory dump utility
    ; Register state display
    ; Execution tracing
    ; Breakpoint simulation

MemoryDump:
    ; Dump memory range in hex format
    ; Input: Start address in $FB/$FC, length in A
    STA DumpBytes
    LDA #$00
    STA ByteCounter
    
DumpLine:
    ; Print address
    LDA $FC             ; High byte of address
    JSR PrintHexByte
    LDA $FB             ; Low byte of address
    JSR PrintHexByte
    LDA #':'
    JSR $FFD2
    LDA #' '
    JSR $FFD2
    
    ; Print 8 bytes per line
    LDY #$00
    
DumpBytes:
    LDA ($FB),Y
    JSR PrintHexByte
    LDA #' '
    JSR $FFD2
    
    INY
    INC ByteCounter
    LDA ByteCounter
    CMP DumpBytes
    BEQ DumpComplete
    
    TYA
    AND #$07            ; 8 bytes per line
    BNE DumpBytes
    
    ; New line
    LDA #$0D
    JSR $FFD2
    
    ; Update address for next line
    TYA
    CLC
    ADC $FB
    STA $FB
    BCC DumpLine
    INC $FC
    JMP DumpLine
    
DumpComplete:
    RTS

PrintHexByte:
    ; Print byte in A as hex
    PHA
    LSR
    LSR
    LSR
    LSR
    JSR PrintHexNibble
    PLA
    AND #$0F
    JSR PrintHexNibble
    RTS

PrintHexNibble:
    ; Print nibble (0-15) as hex digit
    CMP #$0A
    BCC PrintDigit
    CLC
    ADC #$37            ; A-F
    JMP PrintChar
PrintDigit:
    CLC
    ADC #$30            ; 0-9
PrintChar:
    JSR $FFD2
    RTS

RegisterSnapshot:
    ; Save complete CPU state for debugging
    STA SavedA
    STX SavedX
    STY SavedY
    
    PHP                 ; Push processor status
    PLA                 ; Pull it to A
    STA SavedStatus
    
    TSX                 ; Get stack pointer
    STX SavedStack
    
    RTS

DisplayRegisters:
    ; Display saved register state
    ; (Implementation would format and display all saved registers)
    RTS

TraceExecution:
    ; Simple execution tracer
    LDX TraceIndex
    LDA CurrentPC       ; Would need to be set by caller
    STA TraceBuffer,X
    INX
    STX TraceIndex
    
    ; Wrap around if buffer full
    CPX #TraceBufferSize
    BNE TraceEnd
    LDX #$00
    STX TraceIndex
    
TraceEnd:
    RTS

SimulateBreakpoint:
    ; Simulate breakpoint at specific address
    ; Input: Target address in $FD/$FE, current PC in $FB/$FC
    LDA $FB
    CMP $FD
    BNE NoBreakpoint
    LDA $FC
    CMP $FE
    BNE NoBreakpoint
    
    ; Breakpoint hit
    JSR RegisterSnapshot
    JSR DisplayRegisters
    
    ; Wait for user input or continue
    JSR $FFE4           ; GETIN
    CMP #$00
    BEQ SimulateBreakpoint  ; Wait for keypress
    
NoBreakpoint:
    RTS

; Debug data storage
SavedA:         .byte 0
SavedX:         .byte 0
SavedY:         .byte 0
SavedStatus:    .byte 0
SavedStack:     .byte 0
CurrentPC:      .byte 0
DumpBytes:      .byte 0
ByteCounter:    .byte 0

TraceIndex:     .byte 0
TraceBuffer:    .res 32
TraceBufferSize = 32
```

### Error Recovery Strategies

```text
; Error recovery and graceful degradation

ErrorRecovery:
    ; Implement recovery strategies for different error types
    ; Graceful degradation when possible
    ; Safe fallback operations

RecoverFromError:
    ; Input: Error code in A
    CMP #ERROR_MEMORY
    BEQ RecoverMemoryError
    CMP #ERROR_INPUT
    BEQ RecoverInputError
    CMP #ERROR_TIMEOUT
    BEQ RecoverTimeoutError
    
    ; Unknown error - use generic recovery
    JMP GenericRecovery

RecoverMemoryError:
    ; Memory error recovery
    ; Clear potentially corrupted data
    JSR ClearWorkspace
    
    ; Reinitialize data structures
    JSR InitializeData
    
    ; Set safe defaults
    JSR SetDefaults
    
    CLC                 ; Recovery successful
    RTS

RecoverInputError:
    ; Input error recovery
    ; Clear input buffers
    JSR FlushInputBuffers
    
    ; Reset input state
    JSR ResetInputState
    
    ; Prompt for new input
    JSR PromptRetry
    
    CLC
    RTS

RecoverTimeoutError:
    ; Timeout error recovery
    ; Reset timing systems
    JSR ResetTimers
    
    ; Restore last known good state
    JSR RestoreLastState
    
    CLC
    RTS

GenericRecovery:
    ; Generic error recovery
    ; Reset to minimal working state
    JSR EmergencyReset
    
    ; Log error for analysis
    JSR LogError
    
    ; Continue with reduced functionality
    SEC                 ; Indicate degraded mode
    RTS

; Error constants
ERROR_MEMORY = $01
ERROR_INPUT = $02
ERROR_TIMEOUT = $03

; Recovery subroutines
ClearWorkspace:
FlushInputBuffers:
ResetInputState:
PromptRetry:
ResetTimers:
RestoreLastState:
EmergencyReset:
LogError:
InitializeData:
SetDefaults:
    RTS
```

## Practice Exercise

Create a comprehensive debugging system that demonstrates:

1. Error detection and classification
2. Memory inspection and validation
3. Systematic problem isolation
4. Defensive programming techniques
5. Error recovery and graceful degradation

<CodeRunner 
  system="commodore-64"
  title="Practice Exercise - Comprehensive Debugging System"
  code="; Complete debugging system demonstration
; Comprehensive error handling and debugging framework

ComprehensiveDebuggingDemo:
    JSR InitializeDebuggingSystem
    JSR RunDebuggingTests
    JSR AnalyzeResults
    JSR DisplayDebugReport
    RTS

InitializeDebuggingSystem:
    ; Setup complete debugging framework
    
    ; Clear all counters and flags
    LDA #$00
    STA ErrorsDetected
    STA TestsExecuted
    STA RecoveryAttempts
    STA SystemStatus
    
    ; Initialize debug buffers
    JSR ClearDebugBuffers
    
    ; Setup error tracking
    JSR InitializeErrorTracking
    
    ; Enable debug mode
    LDA #$01
    STA DebugMode
    
    RTS

ClearDebugBuffers:
    ; Clear all debugging data structures
    LDX #$00
    LDA #$00
    
ClearLoop:
    STA DebugBuffer,X
    STA ErrorLog,X
    STA StateHistory,X
    INX
    CPX #$20            ; Clear 32 bytes of each buffer
    BNE ClearLoop
    
    RTS

InitializeErrorTracking:
    ; Setup error classification and tracking
    LDA #$00
    STA LogicErrors
    STA MemoryErrors
    STA InputErrors
    STA SystemErrors
    
    RTS

RunDebuggingTests:
    ; Execute comprehensive test suite with error injection
    
    ; Test 1: Logic error detection
    JSR TestLogicErrorDetection
    
    ; Test 2: Memory error detection
    JSR TestMemoryErrorDetection
    
    ; Test 3: Input validation
    JSR TestInputValidation
    
    ; Test 4: System state tracking
    JSR TestSystemStateTracking
    
    ; Test 5: Error recovery
    JSR TestErrorRecovery
    
    RTS

TestLogicErrorDetection:
    ; Test detection of logic errors
    INC TestsExecuted
    
    ; Simulate logic error: infinite loop detection
    LDA #$00
    STA LoopCounter
    
    ; Monitored loop with runaway detection
    LDX #$10
LogicTestLoop:
    INC LoopCounter
    
    ; Check for runaway condition
    LDA LoopCounter
    CMP #$FF            ; Runaway threshold
    BEQ RunawayDetected
    
    ; Normal loop operation
    DEX
    BPL LogicTestLoop
    
    ; Loop completed normally
    LDA #$00
    STA LogicErrorStatus
    RTS
    
RunawayDetected:
    ; Runaway loop detected
    INC LogicErrors
    INC ErrorsDetected
    LDA #$01
    STA LogicErrorStatus
    JSR LogError
    RTS

TestMemoryErrorDetection:
    ; Test memory integrity checking
    INC TestsExecuted
    
    ; Setup test data with known pattern
    JSR SetupTestPattern
    
    ; Calculate initial checksum
    JSR CalculateMemoryChecksum
    STA OriginalChecksum
    
    ; Simulate memory corruption
    LDA #$FF
    STA TestMemory+5    ; Corrupt one byte
    
    ; Verify checksum detects corruption
    JSR CalculateMemoryChecksum
    CMP OriginalChecksum
    BEQ MemoryTestFailed
    
    ; Corruption detected successfully
    LDA #$00
    STA MemoryErrorStatus
    RTS
    
MemoryTestFailed:
    ; Failed to detect memory corruption
    INC MemoryErrors
    INC ErrorsDetected
    LDA #$01
    STA MemoryErrorStatus
    JSR LogError
    RTS

SetupTestPattern:
    ; Create known test pattern in memory
    LDX #$00
    LDA #$AA
    
PatternLoop:
    STA TestMemory,X
    EOR #$FF            ; Alternate pattern
    INX
    CPX #$10            ; 16 bytes
    BNE PatternLoop
    
    RTS

CalculateMemoryChecksum:
    ; Calculate simple checksum of test memory
    LDA #$00
    STA MemoryChecksum
    
    LDX #$00
ChecksumLoop:
    LDA TestMemory,X
    CLC
    ADC MemoryChecksum
    STA MemoryChecksum
    
    INX
    CPX #$10
    BNE ChecksumLoop
    
    LDA MemoryChecksum
    RTS

TestInputValidation:
    ; Test input validation and bounds checking
    INC TestsExecuted
    
    ; Test valid input
    LDA #$50            ; Valid value
    JSR ValidateInput
    BCS InputTest1Failed
    
    ; Test invalid input (too low)
    LDA #$05            ; Invalid value
    JSR ValidateInput
    BCC InputTest2Failed
    
    ; Test invalid input (too high)
    LDA #$FF            ; Invalid value
    JSR ValidateInput
    BCC InputTest3Failed
    
    ; All input tests passed
    LDA #$00
    STA InputErrorStatus
    RTS
    
InputTest1Failed:
InputTest2Failed:
InputTest3Failed:
    ; Input validation failed
    INC InputErrors
    INC ErrorsDetected
    LDA #$01
    STA InputErrorStatus
    JSR LogError
    RTS

ValidateInput:
    ; Validate input range ($10-$F0)
    ; Input: Value in A
    ; Output: Carry clear = valid, set = invalid
    
    CMP #$10
    BCC InputInvalid
    CMP #$F0
    BCS InputInvalid
    
    CLC                 ; Valid
    RTS
    
InputInvalid:
    SEC                 ; Invalid
    RTS

TestSystemStateTracking:
    ; Test system state monitoring
    INC TestsExecuted
    
    ; Record initial state
    JSR RecordSystemState
    
    ; Perform state-changing operations
    JSR StateChangingOperation1
    JSR RecordSystemState
    
    JSR StateChangingOperation2
    JSR RecordSystemState
    
    JSR StateChangingOperation3
    JSR RecordSystemState
    
    ; Verify state transitions are tracked
    JSR VerifyStateHistory
    
    RTS

RecordSystemState:
    ; Record current system state
    LDX StateHistoryIndex
    
    ; Record key system values
    LDA SystemStatus
    STA StateHistory,X
    INX
    
    LDA ErrorsDetected
    STA StateHistory,X
    INX
    
    STX StateHistoryIndex
    
    RTS

StateChangingOperation1:
    ; Simulate operation that changes system state
    INC SystemStatus
    RTS

StateChangingOperation2:
    ; Simulate another state change
    LDA SystemStatus
    CLC
    ADC #$10
    STA SystemStatus
    RTS

StateChangingOperation3:
    ; Simulate final state change
    LDA SystemStatus
    EOR #$55
    STA SystemStatus
    RTS

VerifyStateHistory:
    ; Verify state history was recorded correctly
    LDA StateHistoryIndex
    CMP #$08            ; Should have 8 entries (4 operations × 2 values)
    BEQ StateTrackingOK
    
    ; State tracking failed
    INC SystemErrors
    INC ErrorsDetected
    LDA #$01
    STA StateErrorStatus
    JSR LogError
    RTS
    
StateTrackingOK:
    LDA #$00
    STA StateErrorStatus
    RTS

TestErrorRecovery:
    ; Test error recovery mechanisms
    INC TestsExecuted
    
    ; Simulate error condition
    LDA #$01            ; Error type: memory error
    JSR SimulateError
    
    ; Attempt recovery
    JSR AttemptRecovery
    BCS RecoveryFailed
    
    ; Recovery successful
    LDA #$00
    STA RecoveryStatus
    RTS
    
RecoveryFailed:
    ; Recovery attempt failed
    INC RecoveryAttempts
    LDA #$01
    STA RecoveryStatus
    JSR LogError
    RTS

SimulateError:
    ; Simulate various error conditions
    ; Input: Error type in A
    STA CurrentErrorType
    
    ; Set error flag
    LDA #$FF
    STA ErrorFlag
    
    RTS

AttemptRecovery:
    ; Attempt to recover from current error
    INC RecoveryAttempts
    
    LDA CurrentErrorType
    CMP #$01            ; Memory error
    BEQ RecoverMemoryError
    
    ; Generic recovery
    JSR GenericErrorRecovery
    RTS
    
RecoverMemoryError:
    ; Specific memory error recovery
    JSR ResetMemoryState
    
    ; Clear error flag
    LDA #$00
    STA ErrorFlag
    
    CLC                 ; Recovery successful
    RTS

GenericErrorRecovery:
    ; Generic error recovery procedure
    JSR ResetSystemState
    
    ; Clear error flag
    LDA #$00
    STA ErrorFlag
    
    CLC                 ; Recovery successful
    RTS

ResetMemoryState:
    ; Reset memory to known good state
    JSR SetupTestPattern
    RTS

ResetSystemState:
    ; Reset system to safe state
    LDA #$00
    STA SystemStatus
    RTS

LogError:
    ; Log error to error buffer
    LDX ErrorLogIndex
    
    ; Store error type and location
    LDA CurrentErrorType
    STA ErrorLog,X
    INX
    
    LDA TestsExecuted
    STA ErrorLog,X
    INX
    
    STX ErrorLogIndex
    
    RTS

AnalyzeResults:
    ; Analyze test results and error patterns
    
    ; Calculate error rate
    LDA ErrorsDetected
    STA ErrorRate       ; Simplified - would be percentage in real system
    
    ; Determine overall system health
    LDA ErrorsDetected
    CMP #$05            ; Error threshold
    BCS SystemUnhealthy
    
    ; System is healthy
    LDA #$00
    STA OverallHealth
    RTS
    
SystemUnhealthy:
    ; System has too many errors
    LDA #$01
    STA OverallHealth
    RTS

DisplayDebugReport:
    ; Display comprehensive debug report
    ; (In real implementation, would format and display results)
    
    ; Set indicator that report is ready
    LDA #$01
    STA ReportReady
    
    RTS

; Data areas
TestMemory:         .res 16     ; Test memory area
DebugBuffer:        .res 32     ; Debug data buffer
ErrorLog:           .res 32     ; Error log buffer
StateHistory:       .res 32     ; System state history

; Counters and status
ErrorsDetected:     .byte 0     ; Total errors found
TestsExecuted:      .byte 0     ; Number of tests run
RecoveryAttempts:   .byte 0     ; Recovery attempts made
SystemStatus:       .byte 0     ; Current system status

; Error type counters
LogicErrors:        .byte 0
MemoryErrors:       .byte 0
InputErrors:        .byte 0
SystemErrors:       .byte 0

; Test results
LogicErrorStatus:   .byte 0
MemoryErrorStatus:  .byte 0
InputErrorStatus:   .byte 0
StateErrorStatus:   .byte 0
RecoveryStatus:     .byte 0

; Debug system state
DebugMode:          .byte 0
LoopCounter:        .byte 0
OriginalChecksum:   .byte 0
MemoryChecksum:     .byte 0
StateHistoryIndex:  .byte 0
ErrorLogIndex:      .byte 0
CurrentErrorType:   .byte 0
ErrorFlag:          .byte 0
ErrorRate:          .byte 0
OverallHealth:      .byte 0
ReportReady:        .byte 0

; Run the comprehensive debugging demonstration
JSR ComprehensiveDebuggingDemo"
  language="assembly"
/>

## Debugging Best Practices

### 1. Systematic Approach
```text
; Use methodical debugging process:
; 1. Reproduce the problem
; 2. Isolate the issue
; 3. Form hypothesis
; 4. Test hypothesis
; 5. Fix and verify
```

### 2. Defensive Programming
```text
; Always validate inputs
; Check array bounds
; Verify preconditions
; Handle edge cases
; Use assertions
```

### 3. Code Organization
```text
; Write self-documenting code
; Use meaningful labels
; Add diagnostic output
; Keep functions small
; Minimize side effects
```

### 4. Testing Strategy
```text
; Test edge cases
; Verify error conditions
; Use systematic test suites
; Document test cases
; Automate where possible
```

## What You've Learned

In this lesson, you've mastered essential debugging skills:

- **Error Recognition**: Understanding common assembly programming errors and their patterns
- **Systematic Debugging**: Methodical approaches to problem isolation and resolution
- **Memory Inspection**: Techniques for examining program state and data integrity
- **Error Prevention**: Defensive programming and input validation strategies
- **Testing Framework**: Systematic testing and error detection systems
- **Recovery Strategies**: Graceful error handling and system recovery techniques

## Looking Ahead

In the next lesson, you'll learn **code documentation and maintainability** - how to write code that others (including future you) can understand, modify, and maintain effectively.

## Fun Fact

The debugging techniques you've learned are the foundation of all professional software development! The systematic debugging methodology, defensive programming patterns, and error handling strategies you've mastered are used in everything from spacecraft software to mobile apps. The memory inspection and state tracking techniques are the basis for modern debuggers like GDB, Visual Studio debugger, and Xcode. You've learned the timeless principles of software quality assurance that ensure reliable, maintainable code in any programming environment!

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content":"Review existing lesson structure and content organisation","status":"completed","priority":"high","id":"1"},{"content":"Examine current lesson templates and formatting","status":"completed","priority":"high","id":"2"},{"content":"Identify which system/tier to start writing lessons for","status":"completed","priority":"high","id":"3"},{"content":"Rewrite C64 lesson 1 to teach 6502 assembly fundamentals","status":"completed","priority":"high","id":"4"},{"content":"Create lesson 2: Store instructions and memory operations","status":"completed","priority":"high","id":"5"},{"content":"Create lesson 3: Understanding addressing modes","status":"completed","priority":"high","id":"6"},{"content":"Create lesson 4: Status register and flags","status":"completed","priority":"high","id":"7"},{"content":"Create lesson 5: Arithmetic operations (ADC/SBC)","status":"completed","priority":"high","id":"8"},{"content":"Create lesson 6: Increment and decrement operations","status":"completed","priority":"high","id":"9"},{"content":"Create lesson 7: Logical operations (AND/OR/XOR)","status":"completed","priority":"high","id":"10"},{"content":"Create lesson 8: Basic data manipulation and review","status":"completed","priority":"high","id":"11"},{"content":"Create lesson 9: Indexed addressing modes","status":"completed","priority":"high","id":"22"},{"content":"Create lesson 10: Indirect addressing and pointers","status":"completed","priority":"high","id":"23"},{"content":"Create lesson 11: Stack operations and memory management","status":"completed","priority":"high","id":"24"},{"content":"Create lesson 12: Subroutines and JSR/RTS","status":"completed","priority":"high","id":"25"},{"content":"Create lesson 13: Branching and program flow control","status":"completed","priority":"high","id":"26"},{"content":"Create lesson 14: Advanced memory techniques and optimisation","status":"completed","priority":"high","id":"27"},{"content":"Create lesson 15: Interrupts and system programming","status":"completed","priority":"high","id":"28"},{"content":"Create lesson 16: Memory and addressing section review","status":"completed","priority":"high","id":"29"},{"content":"Plan C64 Tier 1 lessons 17-32 structure and sections","status":"completed","priority":"high","id":"30"},{"content":"Create lesson 17: Introduction to VIC-II graphics chip","status":"completed","priority":"high","id":"31"},{"content":"Create lesson 18: Screen modes and character sets","status":"completed","priority":"high","id":"32"},{"content":"Create lesson 19: Sprites and hardware graphics","status":"completed","priority":"high","id":"33"},{"content":"Create lesson 20: Color and bitmap graphics","status":"completed","priority":"high","id":"34"},{"content":"Create lesson 21: Introduction to SID sound chip","status":"completed","priority":"high","id":"35"},{"content":"Create lesson 22: Sound synthesis and waveforms","status":"completed","priority":"high","id":"36"},{"content":"Create lesson 23: Music and advanced audio programming","status":"completed","priority":"high","id":"37"},{"content":"Create lesson 32: Phase 1 integration and tier review","status":"completed","priority":"high","id":"40"},{"content":"Create lesson 24: I/O and hardware control section review","status":"pending","priority":"high","id":"38"},{"content":"Create lesson 25: File operations and data management","status":"completed","priority":"high","id":"41"},{"content":"Create lesson 26: Program organisation and structure","status":"completed","priority":"high","id":"42"},{"content":"Create lesson 27: Basic optimisation and efficiency","status":"completed","priority":"high","id":"43"},{"content":"Create lesson 28: Error handling and debugging basics","status":"completed","priority":"high","id":"44"},{"content":"Create lesson 29: Code documentation and maintainability","status":"in_progress","priority":"high","id":"45"},{"content":"Create lesson 30: Project planning and development","status":"pending","priority":"high","id":"46"},{"content":"Create lesson 31: Building complete applications","status":"pending","priority":"high","id":"47"},{"content":"Plan visual enhancement phase for completed lessons","status":"pending","priority":"medium","id":"39"}]