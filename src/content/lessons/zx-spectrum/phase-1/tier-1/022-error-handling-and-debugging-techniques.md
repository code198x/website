---
title: "Error Handling and Debugging Techniques"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 22
description: "Master essential debugging skills and error handling strategies for assembly programming. Learn to find, fix, and prevent bugs in complex Z80 programs."
learning_objectives:
  - "Understand common types of programming errors in assembly"
  - "Learn systematic debugging approaches and techniques"
  - "Master error detection and prevention strategies"
  - "Practice defensive programming techniques"
  - "Build robust error handling into programs"
concepts:
  - "Types of errors (syntax, logic, runtime)"
  - "Debugging methodologies and tools"
  - "Error detection and validation"
  - "Defensive programming practices"
  - "Testing and verification strategies"
estimated_duration: "50-60 minutes"
difficulty: "advanced"
code_examples: true
practical_exercise: true
order: 22
---

# Lesson 22: Error Handling and Debugging Techniques

As your programs become more complex, finding and fixing bugs becomes increasingly important. Assembly language debugging requires systematic approaches and careful error handling. This lesson teaches you professional debugging techniques and defensive programming practices that will make your code more reliable and maintainable.

## Understanding Types of Errors

### Syntax Errors

These are caught by the assembler and prevent your program from assembling:

```text
; SYNTAX ERRORS - Won't assemble
LD A,           ; Missing operand
JP              ; Missing address
LD (HL) A       ; Missing comma
DJNZ LoopStart  ; Label not defined yet
INC (IX+256)    ; Displacement too large (-128 to +127)
```

### Logic Errors

The program assembles and runs, but doesn't do what you intended:

```text
; LOGIC ERROR - Infinite loop
LD B, 10
Loop:
    ; Process something
    DEC A           ; BUG: Should be DEC B
    JR NZ, Loop     ; Will loop forever if A != 0

; LOGIC ERROR - Wrong comparison
LD A, PlayerHealth
CP 0                ; Check if health is zero
JR Z, PlayerAlive   ; BUG: Should be JR NZ, PlayerAlive

; LOGIC ERROR - Off-by-one error
LD HL, Array
LD B, 10            ; Array has 10 elements (0-9)
Loop:
    LD A, (HL)
    INC HL
    DJNZ Loop       ; BUG: Will access 11th element
```

### Runtime Errors

These cause crashes, incorrect behavior, or data corruption:

```text
; RUNTIME ERROR - Stack overflow
InfiniteRecursion:
    CALL InfiniteRecursion  ; No base case - will overflow stack

; RUNTIME ERROR - Memory corruption
LD HL, $0000        ; ROM area
LD (HL), $FF        ; BUG: Can't write to ROM

; RUNTIME ERROR - Uninitialized variables
LD A, (Counter)     ; BUG: Counter never initialized
ADD A, 1
LD (Counter), A
```

<CodeRunner 
  system="zx-spectrum"
  title="Common Error Examples"
  code="; Demonstration of common programming errors and fixes

; ERROR EXAMPLE 1: Uninitialized variable
BadCounter: DS 1    ; Uninitialized storage

; BAD: Using uninitialized variable
BadIncrement:
    LD A, (BadCounter)  ; Contains random garbage
    INC A               ; Adding 1 to garbage
    LD (BadCounter), A
    RET

; GOOD: Initialize before use
GoodCounter: DB 0   ; Initialized to 0

GoodIncrement:
    LD A, (GoodCounter)
    INC A
    LD (GoodCounter), A
    RET

; ERROR EXAMPLE 2: Buffer overflow
Buffer: DS 10       ; 10-byte buffer

; BAD: No bounds checking
BadCopyString:
    LD HL, LongString   ; Source (20 characters)
    LD DE, Buffer       ; Destination (10 bytes)
    LD BC, 20           ; BUG: Copying 20 bytes to 10-byte buffer
    LDIR                ; Will overwrite memory after buffer
    RET

; GOOD: Bounds checking
GoodCopyString:
    LD HL, LongString
    LD DE, Buffer
    LD BC, 10           ; Copy only what fits
    LDIR                ; Safe copy
    RET

; ERROR EXAMPLE 3: Wrong loop counter
Array: DB 1, 2, 3, 4, 5

; BAD: Using wrong register for loop
BadLoop:
    LD HL, Array
    LD B, 5             ; B = loop counter
    LD A, 0             ; A = sum accumulator
    
BadLoopBody:
    ADD A, (HL)
    INC HL
    DEC A               ; BUG: Decrementing A instead of B
    JR NZ, BadLoopBody  ; Will loop wrong number of times
    RET

; GOOD: Correct loop counter
GoodLoop:
    LD HL, Array
    LD B, 5             ; B = loop counter
    LD A, 0             ; A = sum accumulator
    
GoodLoopBody:
    ADD A, (HL)
    INC HL
    DJNZ GoodLoopBody   ; Correctly decrements B
    RET

; ERROR EXAMPLE 4: Stack imbalance
; BAD: Unbalanced stack operations
BadStackFunction:
    PUSH BC
    PUSH DE
    ; Do some work
    LD A, (SomeCondition)
    OR A
    RET Z               ; BUG: Returns without POPing
    
    POP DE              ; Only pops one register
    RET                 ; BUG: Stack still has BC on it

; GOOD: Balanced stack operations
GoodStackFunction:
    PUSH BC
    PUSH DE
    ; Do some work
    LD A, (SomeCondition)
    OR A
    JR Z, CleanupAndExit ; Jump to cleanup instead of direct return
    
    ; Normal exit path
    POP DE
    POP BC
    RET
    
CleanupAndExit:
    POP DE              ; Clean up stack
    POP BC
    RET                 ; Now safe to return

SomeCondition: DB 0
LongString: DB "This string is too long for the buffer!", 0"
  language="assembly"
/>

## Systematic Debugging Approach

### The Debugging Process

1. **Reproduce the problem** consistently
2. **Isolate the problem** to smallest possible code section
3. **Form a hypothesis** about what's wrong
4. **Test the hypothesis** with targeted changes
5. **Fix the root cause**, not just symptoms
6. **Verify the fix** doesn't break anything else

### Debugging Strategies

#### Binary Search Debugging

```text
; If a large program isn't working, use binary search to isolate the problem

MainProgram:
    CALL InitializeData     ; Add test point here
    ; TEST: Does program work up to this point?
    
    CALL ProcessInput       ; Add test point here
    ; TEST: Does input processing work correctly?
    
    CALL UpdateGameLogic    ; Add test point here  
    ; TEST: Is game logic updating properly?
    
    CALL RenderScreen       ; Add test point here
    ; TEST: Is rendering working?
    
    RET

; Add temporary debug output at each test point
DebugPoint1:
    LD A, 1
    LD (DebugMarker), A
    RET

DebugMarker: DB 0
```

#### Trace Debugging

```text
; Add trace points to track program flow
TraceBuffer: DS 100     ; Buffer for trace data
TraceIndex:  DB 0       ; Current trace position

; Macro for adding trace points
TRACE_POINT MACRO value
    PUSH AF
    LD A, value
    CALL AddTrace
    POP AF
ENDM

AddTrace:
    PUSH HL
    LD HL, TraceIndex
    LD B, (HL)          ; Get current index
    LD HL, TraceBuffer
    LD C, B
    ADD HL, BC          ; Point to current position
    LD (HL), A          ; Store trace value
    
    ; Update index
    LD HL, TraceIndex
    INC (HL)
    LD A, (HL)
    CP 100              ; Check for buffer overflow
    JR C, TraceOK
    LD (HL), 0          ; Wrap around
TraceOK:
    POP HL
    RET

; Use trace points in your code
ProcessData:
    TRACE_POINT 10      ; Entry point
    
    ; Some processing
    LD A, (InputValue)
    TRACE_POINT 11      ; After input read
    
    CP 50
    JR C, LowValue
    TRACE_POINT 12      ; High value path
    JR ProcessDone
    
LowValue:
    TRACE_POINT 13      ; Low value path
    
ProcessDone:
    TRACE_POINT 14      ; Exit point
    RET

InputValue: DB 0
```

<CodeRunner 
  system="zx-spectrum"
  title="Debug Tracing System"
  code="; Simple debug tracing system for tracking program flow

; Debug trace buffer
TraceBuffer:    DS 20   ; Store last 20 trace points
TracePos:       DB 0    ; Current position in buffer
TraceCount:     DB 0    ; Total traces recorded

; Add trace point
; Input: A = trace point ID
AddTracePoint:
    PUSH BC
    PUSH HL
    
    ; Store trace point
    LD HL, TracePos
    LD B, (HL)          ; Get current position
    LD HL, TraceBuffer
    LD C, B
    ADD HL, BC          ; Point to storage location
    LD (HL), A          ; Store trace ID
    
    ; Update position (circular buffer)
    LD HL, TracePos
    INC (HL)            ; Move to next position
    LD A, (HL)
    CP 20               ; Check if at end
    JR C, PosOK
    LD (HL), 0          ; Wrap to beginning
PosOK:
    
    ; Update count (max 20)
    LD HL, TraceCount
    LD A, (HL)
    CP 20               ; Already at max?
    JR Z, CountMax
    INC (HL)            ; Increment count
CountMax:
    
    POP HL
    POP BC
    RET

; Function with trace points for debugging
BuggyFunction:
    LD A, 1             ; Entry trace
    CALL AddTracePoint
    
    LD A, (TestValue)
    LD A, 2             ; After value read
    CALL AddTracePoint
    
    CP 50
    JR C, LowPath
    
    ; High value path
    LD A, 3             ; High path trace
    CALL AddTracePoint
    
    ; Simulate some processing
    LD B, 10
HighLoop:
    LD A, 4             ; Loop trace
    CALL AddTracePoint
    DJNZ HighLoop
    
    JR FunctionEnd
    
LowPath:
    LD A, 5             ; Low path trace
    CALL AddTracePoint
    
    ; Simulate different processing
    LD B, 3
LowLoop:
    LD A, 6             ; Different loop trace
    CALL AddTracePoint
    DJNZ LowLoop
    
FunctionEnd:
    LD A, 7             ; Exit trace
    CALL AddTracePoint
    RET

; Test function with different values
TestDebugging:
    ; Test case 1: High value
    LD A, 75
    LD (TestValue), A
    CALL BuggyFunction
    
    ; Test case 2: Low value
    LD A, 25
    LD (TestValue), A
    CALL BuggyFunction
    
    ; Now TraceBuffer contains execution trace
    ; Examine trace to see which path was taken
    RET

; Examine trace results
ExamineTrace:
    LD HL, TraceBuffer
    LD A, (TraceCount)
    LD B, A             ; B = number of traces to show
    OR A
    RET Z               ; Return if no traces
    
ExamineLoop:
    LD A, (HL)          ; Get trace point
    ; In real system, you'd display this
    ; For now, just store in result area
    LD (TraceResult), A
    INC HL
    DJNZ ExamineLoop
    RET

TestValue:      DB 0
TraceResult:    DB 0"
  language="assembly"
/>

## Error Detection and Validation

### Input Validation

```text
; Always validate input parameters
; Input: A = value to validate (must be 1-100)
; Output: Carry flag set if invalid
ValidateInput:
    ; Check lower bound
    CP 1
    JR C, InvalidInput  ; Less than 1
    
    ; Check upper bound  
    CP 101
    JR NC, InvalidInput ; Greater than 100
    
    ; Valid input
    OR A                ; Clear carry flag
    RET
    
InvalidInput:
    SCF                 ; Set carry flag
    RET

; Function that uses validation
SafeFunction:
    CALL ValidateInput
    JR C, HandleError   ; Jump if invalid input
    
    ; Input is valid - proceed normally
    ; ... normal processing ...
    RET
    
HandleError:
    ; Handle invalid input appropriately
    LD A, 255           ; Error code
    RET
```

### Bounds Checking

```text
; Safe array access with bounds checking
; Input: HL = array, B = array size, A = index
; Output: A = element value, Carry set if out of bounds
SafeArrayAccess:
    ; Check if index is within bounds
    CP B                ; Compare index with array size
    JR NC, OutOfBounds  ; Index >= size is invalid
    
    ; Calculate array element address
    LD C, A             ; Index in C
    LD A, 0             ; Clear A for calculation
    ADD HL, BC          ; HL points to element
    LD A, (HL)          ; Get element value
    
    OR A                ; Clear carry (success)
    RET
    
OutOfBounds:
    SCF                 ; Set carry (error)
    LD A, 0             ; Return default value
    RET
```

### Memory Protection

```text
; Safe memory operations
; Input: HL = destination, DE = source, BC = count
; Only copies if destination is in safe area
SafeMemoryCopy:
    ; Check if destination is in safe RAM area
    LD A, H
    CP $60              ; Below $6000?
    JR C, UnsafeArea
    CP $80              ; Above $8000?
    JR NC, UnsafeArea
    
    ; Safe area - perform copy
    LDIR
    OR A                ; Clear carry (success)
    RET
    
UnsafeArea:
    SCF                 ; Set carry (error)
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Error Detection and Validation"
  code="; Comprehensive error detection and validation system

; Safe array access with bounds checking
SafeArray:      DB 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
ArraySize:      EQU 10

; Safe array read with validation
; Input: A = index (0-based)
; Output: A = value, Z flag clear if error
SafeArrayRead:
    ; Validate index
    CP ArraySize        ; Compare with array size
    JR NC, ArrayError   ; Jump if index >= size
    
    ; Index is valid
    LD HL, SafeArray
    LD C, A             ; Index in C
    LD B, 0             ; BC = index
    ADD HL, BC          ; Point to element
    LD A, (HL)          ; Get value
    
    OR 1                ; Clear Z flag (success, A != 0)
    RET
    
ArrayError:
    LD A, 0             ; Return 0 for invalid index
    XOR A               ; Set Z flag (error indicator)
    RET

; Safe memory area checker
; Input: HL = address to check
; Output: A = 1 if safe, 0 if unsafe
CheckMemorySafety:
    LD A, H             ; Get high byte of address
    
    ; Check if in ROM area ($0000-$3FFF) - read-only
    CP $40
    JR C, ReadOnlyArea
    
    ; Check if in screen area ($4000-$57FF) - special handling
    CP $58
    JR C, ScreenArea
    
    ; Check if in attribute area ($5800-$5AFF) - special handling
    CP $5B
    JR C, AttributeArea
    
    ; Check if in safe RAM area ($5B00-$7FFF)
    CP $80
    JR C, SafeRAM
    
    ; Above $8000 - potentially unsafe (stack, system area)
    LD A, 0             ; Unsafe
    RET
    
ReadOnlyArea:
    LD A, 0             ; Unsafe for writing
    RET
    
ScreenArea:
    LD A, 1             ; Safe for screen operations
    RET
    
AttributeArea:
    LD A, 1             ; Safe for attribute operations
    RET
    
SafeRAM:
    LD A, 1             ; Safe for general use
    RET

; Defensive programming example: protected function
; Input: A = operation code (1-3), B = parameter
; Output: A = result, Carry set if error
ProtectedOperation:
    ; Validate operation code
    CP 1
    JR C, InvalidOp     ; Less than 1
    CP 4
    JR NC, InvalidOp    ; Greater than 3
    
    ; Valid operation - dispatch
    DEC A               ; Convert to 0-based
    SLA A               ; × 2 for word table
    LD HL, OperationTable
    LD C, A
    ADD HL, BC          ; Point to operation address
    LD A, (HL)
    INC HL
    LD H, (HL)
    LD L, A             ; HL = operation address
    
    ; Call operation with parameter validation
    LD A, B             ; Get parameter
    JP (HL)             ; Jump to operation
    
InvalidOp:
    SCF                 ; Set error flag
    LD A, 255           ; Error code
    RET

; Operation dispatch table
OperationTable:
    DW Operation1
    DW Operation2
    DW Operation3

; Individual operations with parameter validation
Operation1:
    ; Validate parameter (must be 0-100)
    CP 101
    JR NC, Param1Error
    
    ; Valid parameter - double it
    SLA A               ; × 2
    OR A                ; Clear carry (success)
    RET
    
Param1Error:
    SCF
    LD A, 254           ; Parameter error code
    RET

Operation2:
    ; Validate parameter (must be even)
    AND 1               ; Check low bit
    JR NZ, Param2Error  ; Error if odd
    
    ; Valid parameter - halve it
    LD A, B
    SRL A               ; ÷ 2
    OR A                ; Clear carry
    RET
    
Param2Error:
    SCF
    LD A, 253           ; Parameter error code
    RET

Operation3:
    ; Validate parameter (must be non-zero)
    LD A, B
    OR A
    JR Z, Param3Error
    
    ; Valid parameter - increment it
    INC A
    OR A                ; Clear carry
    RET
    
Param3Error:
    SCF
    LD A, 252           ; Parameter error code
    RET

; Test the validation systems
TestValidation:
    ; Test 1: Safe array access
    LD A, 5             ; Valid index
    CALL SafeArrayRead  ; Should return 60
    LD C, A             ; Save result
    
    LD A, 15            ; Invalid index
    CALL SafeArrayRead  ; Should return 0 with error
    LD D, A             ; Save result
    
    ; Test 2: Memory safety check
    LD HL, $6000        ; Safe RAM address
    CALL CheckMemorySafety ; Should return 1
    LD E, A             ; Save result
    
    ; Test 3: Protected operation
    LD A, 2             ; Valid operation
    LD B, 10            ; Valid parameter for operation 2 (even)
    CALL ProtectedOperation ; Should succeed
    LD H, A             ; Save result
    
    ; Results: C=60, D=0, E=1, H=5 (10÷2)"
  language="assembly"
/>

## Defensive Programming Techniques

### Parameter Validation

```text
; Always validate parameters at function entry
SafeStringLength:
    ; Input: HL = string pointer
    ; Output: A = length, Carry set if error
    
    ; Validate pointer is not null (not $0000)
    LD A, H
    OR L
    JR Z, NullPointer
    
    ; Validate pointer is in valid memory range
    LD A, H
    CP $40              ; Must be >= $4000
    JR C, InvalidPointer
    
    ; Calculate string length with maximum limit
    LD B, 0             ; Length counter
    LD DE, 255          ; Maximum length to prevent infinite loop
    
LengthLoop:
    LD A, (HL)          ; Get character
    OR A                ; Check for terminator
    JR Z, LengthFound   ; Found end
    
    INC HL              ; Next character
    INC B               ; Increment length
    DEC DE              ; Decrement safety counter
    LD A, D
    OR E
    JR NZ, LengthLoop   ; Continue if safety counter not zero
    
    ; String too long
    SCF                 ; Set error flag
    LD A, 255           ; Error: string too long
    RET
    
LengthFound:
    LD A, B             ; Return length
    OR A                ; Clear carry (success)
    RET
    
NullPointer:
InvalidPointer:
    SCF                 ; Set error flag
    LD A, 0             ; Error code
    RET
```

### State Validation

```text
; Validate program state before critical operations
GameState: DB 0         ; 0=menu, 1=playing, 2=paused

SafeGameOperation:
    ; Only allow this operation during gameplay
    LD A, (GameState)
    CP 1                ; Check if in playing state
    JR NZ, InvalidState
    
    ; Check if player is alive
    LD A, (PlayerHealth)
    OR A
    JR Z, PlayerDead
    
    ; State is valid - proceed with operation
    ; ... operation code ...
    OR A                ; Clear carry (success)
    RET
    
InvalidState:
PlayerDead:
    SCF                 ; Set error flag
    RET

PlayerHealth: DB 100
```

### Resource Management

```text
; Track resource allocation and deallocation
ResourceCount: DB 0
MaxResources:  EQU 10

AllocateResource:
    ; Check if resources available
    LD A, (ResourceCount)
    CP MaxResources
    JR NC, NoResources
    
    ; Allocate resource
    INC A
    LD (ResourceCount), A
    
    ; Return resource ID (current count)
    OR A                ; Clear carry (success)
    RET
    
NoResources:
    SCF                 ; Set error flag
    LD A, 0             ; No resource allocated
    RET

FreeResource:
    ; Input: A = resource ID
    ; Validate resource is in use
    LD B, A             ; Save resource ID
    LD A, (ResourceCount)
    OR A
    JR Z, NoResourcesAllocated
    
    ; Free resource (simplified - just decrement count)
    DEC A
    LD (ResourceCount), A
    OR A                ; Clear carry (success)
    RET
    
NoResourcesAllocated:
    SCF                 ; Set error flag
    RET
```

## Testing Strategies

### Unit Testing

```text
; Simple unit testing framework
TestResults: DS 10      ; Store test results
TestCount:   DB 0       ; Number of tests run

; Run a single test
; Input: HL = test function address, A = expected result
RunTest:
    PUSH AF             ; Save expected result
    
    ; Call test function
    CALL CallHL         ; Call function at HL
    
    ; Compare result with expected
    POP BC              ; B = expected result
    CP B                ; Compare actual with expected
    JR Z, TestPassed
    
    ; Test failed
    LD A, 0             ; Failed
    JR RecordResult
    
TestPassed:
    LD A, 1             ; Passed
    
RecordResult:
    ; Store result
    LD HL, TestResults
    LD B, (TestCount)
    LD C, B
    ADD HL, BC
    LD (HL), A
    
    ; Increment test count
    LD HL, TestCount
    INC (HL)
    RET

CallHL:
    JP (HL)

; Example test functions
TestAddition:
    LD A, 5
    ADD A, 3            ; Should return 8
    RET

TestSubtraction:
    LD A, 10
    SUB 4               ; Should return 6
    RET

; Run all tests
RunAllTests:
    LD HL, TestAddition
    LD A, 8             ; Expected result
    CALL RunTest
    
    LD HL, TestSubtraction
    LD A, 6             ; Expected result
    CALL RunTest
    
    RET
```

### Integration Testing

```text
; Test multiple components working together
TestGameSystem:
    ; Initialize game state
    CALL InitializeGame
    
    ; Test player movement
    LD A, 1             ; Move right command
    CALL ProcessPlayerInput
    LD A, (PlayerX)
    CP 51               ; Should be 51 (50 + 1)
    JR NZ, MovementTestFailed
    
    ; Test collision detection
    LD A, 100           ; Move to collision position
    LD (PlayerX), A
    CALL CheckCollisions
    LD A, (CollisionFlag)
    OR A
    JR Z, CollisionTestFailed
    
    ; All tests passed
    LD A, 1
    RET
    
MovementTestFailed:
CollisionTestFailed:
    LD A, 0
    RET

PlayerX: DB 50
CollisionFlag: DB 0

InitializeGame:
    LD A, 50
    LD (PlayerX), A
    LD A, 0
    LD (CollisionFlag), A
    RET

ProcessPlayerInput:
    ; Simplified player input processing
    ADD A, (PlayerX)
    LD (PlayerX), A
    RET

CheckCollisions:
    ; Simplified collision detection
    LD A, (PlayerX)
    CP 100
    JR NZ, NoCollision
    LD A, 1
    LD (CollisionFlag), A
    RET
NoCollision:
    LD A, 0
    LD (CollisionFlag), A
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Testing and Validation Framework"
  code="; Complete testing and validation framework

; Test result storage
TestResults:    DS 20   ; Results for up to 20 tests
TestsRun:       DB 0    ; Number of tests executed
TestsPassed:    DB 0    ; Number of tests that passed

; Assert macro simulation
; Compare actual result with expected and record
AssertEqual:
    ; Input: A = actual result, B = expected result
    CP B                ; Compare actual with expected
    JR Z, AssertPassed
    
    ; Test failed
    CALL RecordFailure
    RET
    
AssertPassed:
    CALL RecordSuccess
    RET

RecordSuccess:
    ; Record a passed test
    LD HL, TestsRun
    LD A, (HL)
    LD HL, TestResults
    LD C, A
    LD B, 0
    ADD HL, BC          ; Point to result slot
    LD (HL), 1          ; Mark as passed
    
    ; Update counters
    LD HL, TestsRun
    INC (HL)
    LD HL, TestsPassed
    INC (HL)
    RET

RecordFailure:
    ; Record a failed test
    LD HL, TestsRun
    LD A, (HL)
    LD HL, TestResults
    LD C, A
    LD B, 0
    ADD HL, BC          ; Point to result slot
    LD (HL), 0          ; Mark as failed
    
    ; Update counter
    LD HL, TestsRun
    INC (HL)
    RET

; Test functions for validation
TestMath:
    ; Test 1: Addition
    LD A, 5
    ADD A, 3
    LD B, 8             ; Expected result
    CALL AssertEqual
    
    ; Test 2: Subtraction
    LD A, 10
    SUB 4
    LD B, 6             ; Expected result
    CALL AssertEqual
    
    ; Test 3: Multiplication (using addition)
    LD A, 0
    LD C, 4             ; Multiply 3 × 4
    LD D, 3
MultiplyLoop:
    ADD A, D
    DEC C
    JR NZ, MultiplyLoop
    LD B, 12            ; Expected result
    CALL AssertEqual
    RET

; Test array operations
TestArrayOps:
    ; Test 1: Array bounds checking
    LD A, 5             ; Valid index
    CALL SafeArrayAccess
    JR C, BoundsTest1Fail ; Should not fail
    LD B, 60            ; Expected value at index 5
    CALL AssertEqual
    JR BoundsTest1Done
    
BoundsTest1Fail:
    LD A, 0             ; Actual: failed
    LD B, 1             ; Expected: success
    CALL AssertEqual
    
BoundsTest1Done:
    ; Test 2: Array bounds checking with invalid index
    LD A, 15            ; Invalid index
    CALL SafeArrayAccess
    JR C, BoundsTest2Pass ; Should fail
    LD A, 0             ; Actual: success (wrong)
    LD B, 1             ; Expected: failure
    CALL AssertEqual
    JR TestArrayDone
    
BoundsTest2Pass:
    LD A, 1             ; Actual: failed (correct)
    LD B, 1             ; Expected: failure
    CALL AssertEqual
    
TestArrayDone:
    RET

; Safe array access for testing
TestArray:      DB 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
TestArraySize:  EQU 10

SafeArrayAccess:
    ; Input: A = index
    ; Output: A = value, Carry set if error
    CP TestArraySize
    JR NC, ArrayError
    
    LD HL, TestArray
    LD C, A
    LD B, 0
    ADD HL, BC
    LD A, (HL)
    OR A                ; Clear carry
    RET
    
ArrayError:
    SCF                 ; Set carry
    LD A, 0
    RET

; Test error handling
TestErrorHandling:
    ; Test 1: Null pointer detection
    LD HL, $0000        ; Null pointer
    CALL ValidatePointer
    JR C, NullTest1Pass ; Should fail
    LD A, 0             ; Actual: success (wrong)
    LD B, 1             ; Expected: failure  
    CALL AssertEqual
    JR NullTest1Done
    
NullTest1Pass:
    LD A, 1             ; Actual: failed (correct)
    LD B, 1             ; Expected: failure
    CALL AssertEqual
    
NullTest1Done:
    ; Test 2: Valid pointer
    LD HL, $6000        ; Valid pointer
    CALL ValidatePointer
    JR C, ValidTest2Fail ; Should not fail
    LD A, 1             ; Actual: success
    LD B, 1             ; Expected: success
    CALL AssertEqual
    JR TestErrorDone
    
ValidTest2Fail:
    LD A, 0             ; Actual: failed (wrong)
    LD B, 1             ; Expected: success
    CALL AssertEqual
    
TestErrorDone:
    RET

ValidatePointer:
    ; Input: HL = pointer to validate
    ; Output: Carry set if invalid
    LD A, H
    OR L
    JR Z, InvalidPtr    ; Null pointer
    
    LD A, H
    CP $40              ; Must be >= $4000
    JR C, InvalidPtr
    
    OR A                ; Clear carry (valid)
    RET
    
InvalidPtr:
    SCF                 ; Set carry (invalid)
    RET

; Run complete test suite
RunTestSuite:
    ; Initialize test counters
    LD A, 0
    LD (TestsRun), A
    LD (TestsPassed), A
    
    ; Run all test categories
    CALL TestMath
    CALL TestArrayOps
    CALL TestErrorHandling
    
    ; Calculate results
    LD A, (TestsPassed)
    LD B, A             ; B = passed
    LD A, (TestsRun)
    SUB B               ; A = failed
    LD C, A             ; C = failed
    
    ; Results now in: B = passed, C = failed
    RET"
  language="assembly"
/>

## Common Debugging Patterns

### Memory Dump Analysis

```text
; Dump memory contents for analysis
; Input: HL = start address, B = number of bytes
DumpMemory:
    PUSH BC
    PUSH HL
    
DumpLoop:
    LD A, (HL)          ; Get byte
    ; In real system, display in hex format
    ; For now, store in dump buffer
    CALL StoreDumpByte
    INC HL              ; Next byte
    DJNZ DumpLoop       ; Continue for all bytes
    
    POP HL
    POP BC
    RET

StoreDumpByte:
    ; Store byte for later analysis
    ; Real implementation would format and display
    RET
```

### Stack Analysis

```text
; Check stack integrity
CheckStackIntegrity:
    ; Compare current SP with expected range
    LD HL, $8000        ; Expected stack top
    LD DE, 100          ; Maximum stack usage
    OR A
    SBC HL, DE          ; HL = minimum expected SP
    
    LD DE, 0            ; Get current SP
    ADD HL, SP          ; Compare current SP with minimum
    JR C, StackOverflow ; SP below minimum = overflow
    
    ; Stack OK
    OR A                ; Clear carry
    RET
    
StackOverflow:
    SCF                 ; Set carry (error)
    RET
```

### Performance Monitoring

```text
; Simple performance counter
PerformanceCounter: DW 0

StartPerformanceTimer:
    ; Reset counter (simplified)
    LD HL, 0
    LD (PerformanceCounter), HL
    RET

StopPerformanceTimer:
    ; In real system, read hardware timer
    ; For demonstration, just increment counter
    LD HL, (PerformanceCounter)
    INC HL
    LD (PerformanceCounter), HL
    RET

; Use around code sections to measure performance
MeasuredFunction:
    CALL StartPerformanceTimer
    
    ; Code to measure
    LD B, 100
TestLoop:
    NOP                 ; Placeholder operations
    NOP
    DJNZ TestLoop
    
    CALL StopPerformanceTimer
    ; Performance result in PerformanceCounter
    RET
```

## Practice Exercise

Create a comprehensive debugging and error handling system that demonstrates:

1. Parameter validation and bounds checking
2. Error detection and reporting mechanisms
3. Defensive programming techniques
4. Testing framework with multiple test cases
5. Debug tracing and analysis tools

<CodeRunner 
  system="zx-spectrum"
  title="Practice Exercise - Complete Debug System"
  code="; Comprehensive debugging and error handling system

; Error codes
ERROR_NONE          EQU 0
ERROR_NULL_POINTER  EQU 1
ERROR_OUT_OF_BOUNDS EQU 2
ERROR_INVALID_PARAM EQU 3
ERROR_OVERFLOW      EQU 4

; System state
LastError:          DB ERROR_NONE
DebugLevel:         DB 1        ; 0=none, 1=errors, 2=warnings, 3=info

; Debug message buffer
DebugBuffer:        DS 50
DebugPos:           DB 0

; Safe string operations with comprehensive error checking
SafeStringCopy:
    ; Input: HL = source, DE = dest, BC = max bytes
    ; Output: A = bytes copied, LastError set if error
    
    ; Validate pointers
    LD A, H
    OR L
    JR Z, StringCopyError1  ; Null source
    
    LD A, D
    OR E
    JR Z, StringCopyError1  ; Null destination
    
    ; Validate count
    LD A, B
    OR C
    JR Z, StringCopyError2  ; Zero count
    
    ; Perform safe copy with bounds checking
    LD A, 0                 ; Bytes copied counter
    
StringCopyLoop:
    ; Check if we've hit maximum
    LD A, B
    OR C
    JR Z, StringCopyDone    ; Hit limit
    
    ; Copy one byte
    LD A, (HL)              ; Get source byte
    LD (DE), A              ; Store to destination
    
    ; Check for string terminator
    OR A
    JR Z, StringCopyDone    ; Found terminator
    
    ; Update pointers and counters
    INC HL                  ; Next source
    INC DE                  ; Next destination
    DEC BC                  ; Decrement count
    
    ; Update bytes copied (simplified)
    JR StringCopyLoop
    
StringCopyDone:
    LD A, ERROR_NONE
    LD (LastError), A
    LD A, 1                 ; Return success
    RET
    
StringCopyError1:
    LD A, ERROR_NULL_POINTER
    LD (LastError), A
    LD A, 0                 ; Return failure
    RET
    
StringCopyError2:
    LD A, ERROR_INVALID_PARAM
    LD (LastError), A
    LD A, 0                 ; Return failure
    RET

; Safe arithmetic with overflow detection
SafeAdd:
    ; Input: A = first operand, B = second operand
    ; Output: A = result, LastError set if overflow
    
    ADD A, B                ; Perform addition
    JR C, AddOverflow       ; Jump if carry (overflow)
    
    ; No overflow
    LD B, ERROR_NONE
    LD (LastError), B
    RET
    
AddOverflow:
    LD B, ERROR_OVERFLOW
    LD (LastError), B
    LD A, 255               ; Return maximum value
    RET

; Debug logging system
LogDebugMessage:
    ; Input: A = debug level, B = message code
    LD C, A                 ; Save debug level
    LD A, (DebugLevel)      ; Get system debug level
    CP C                    ; Compare with message level
    RET C                   ; Don't log if message level > system level
    
    ; Log the message
    LD A, (DebugPos)
    CP 45                   ; Check buffer space
    JR NC, DebugBufferFull
    
    ; Store message in buffer
    LD HL, DebugBuffer
    LD C, A                 ; Position
    ADD HL, BC              ; Point to storage location
    LD (HL), B              ; Store message code
    
    ; Update position
    LD HL, DebugPos
    INC (HL)
    RET
    
DebugBufferFull:
    ; Buffer full - reset position (circular buffer)
    LD A, 0
    LD (DebugPos), A
    RET

; Comprehensive function with full error handling
RobustCalculation:
    ; Input: A = x, B = y
    ; Calculate (x + y) * 2 with full error checking
    
    ; Log function entry
    PUSH AF
    LD A, 3                 ; Info level
    LD B, 100               ; Entry message code
    CALL LogDebugMessage
    POP AF
    
    ; Validate inputs
    CP 128                  ; Check if x > 127 (would overflow when doubled)
    JR NC, CalcParamError
    
    LD C, A                 ; Save x
    LD A, B
    CP 128                  ; Check if y > 127
    JR NC, CalcParamError
    LD A, C                 ; Restore x
    
    ; Perform addition with overflow check
    CALL SafeAdd
    LD C, A                 ; Save result
    LD A, (LastError)
    CP ERROR_NONE
    JR NZ, CalcAddError
    
    ; Double the result (multiply by 2)
    LD A, C
    CALL SafeAdd            ; Add to itself
    LD C, A                 ; Save final result
    LD A, (LastError)
    CP ERROR_NONE
    JR NZ, CalcMulError
    
    ; Success
    LD A, 3                 ; Info level
    LD B, 101               ; Success message code
    CALL LogDebugMessage
    
    LD A, C                 ; Return result
    LD B, ERROR_NONE
    LD (LastError), B
    RET
    
CalcParamError:
    LD A, 1                 ; Error level
    LD B, 201               ; Parameter error message
    CALL LogDebugMessage
    
    LD A, ERROR_INVALID_PARAM
    LD (LastError), A
    LD A, 0                 ; Return 0
    RET
    
CalcAddError:
CalcMulError:
    LD A, 1                 ; Error level
    LD B, 202               ; Calculation error message
    CALL LogDebugMessage
    
    ; Error already in LastError
    LD A, 0                 ; Return 0
    RET

; Test suite for the robust system
TestRobustSystem:
    ; Test 1: Valid calculation
    LD A, 10                ; x = 10
    LD B, 5                 ; y = 5
    CALL RobustCalculation  ; Should return 30: (10+5)*2
    CP 30
    JR Z, Test1Pass
    
    ; Test failed
    LD A, 1                 ; Error level
    LD B, 250               ; Test failure message
    CALL LogDebugMessage
    JR Test1Done
    
Test1Pass:
    LD A, 3                 ; Info level
    LD B, 251               ; Test success message
    CALL LogDebugMessage
    
Test1Done:
    ; Test 2: Overflow condition
    LD A, 100               ; x = 100
    LD B, 100               ; y = 100
    CALL RobustCalculation  ; Should detect overflow
    
    LD A, (LastError)
    CP ERROR_OVERFLOW
    JR Z, Test2Pass
    
    ; Test failed
    LD A, 1                 ; Error level
    LD B, 252               ; Test failure message
    CALL LogDebugMessage
    JR Test2Done
    
Test2Pass:
    LD A, 3                 ; Info level
    LD B, 253               ; Test success message
    CALL LogDebugMessage
    
Test2Done:
    ; Test 3: Parameter validation
    LD A, 150               ; x = 150 (too large)
    LD B, 10                ; y = 10
    CALL RobustCalculation  ; Should detect parameter error
    
    LD A, (LastError)
    CP ERROR_INVALID_PARAM
    JR Z, Test3Pass
    
    ; Test failed
    LD A, 1                 ; Error level
    LD B, 254               ; Test failure message
    CALL LogDebugMessage
    RET
    
Test3Pass:
    LD A, 3                 ; Info level
    LD B, 255               ; Test success message
    CALL LogDebugMessage
    RET

; Initialize debug system and run tests
InitAndTest:
    ; Set debug level to capture all messages
    LD A, 3
    LD (DebugLevel), A
    
    ; Clear debug buffer
    LD A, 0
    LD (DebugPos), A
    LD (LastError), A
    
    ; Run comprehensive tests
    CALL TestRobustSystem
    
    ; Debug buffer now contains execution trace
    ; LastError contains final error state
    RET"
  language="assembly"
/>

## What You've Learned

In this comprehensive lesson, you've mastered:

- Understanding different types of programming errors and their causes
- Implementing systematic debugging approaches and methodologies
- Creating comprehensive error detection and validation systems
- Building defensive programming techniques into your code
- Developing testing frameworks and validation strategies
- Using trace debugging and performance monitoring techniques
- Designing robust error handling and recovery mechanisms

## Looking Ahead

Next, you'll learn about **status flags and comparisons** - understanding how the Z80's flag system works in detail and mastering advanced comparison and conditional techniques for sophisticated program logic!

## Fun Fact

The debugging techniques you've learned trace back to the earliest days of computing, when programmers had to debug programs by examining memory dumps and manually tracing execution with lights and switches! The Z80's rich flag system and stack architecture made it much easier to implement sophisticated error handling compared to simpler processors. Many of the defensive programming patterns you've learned - parameter validation, bounds checking, and systematic testing - were first developed on systems like the ZX Spectrum where memory was precious and bugs could crash the entire system. These same principles are now fundamental to modern software engineering, from embedded systems to web applications. The assembly-level understanding of error handling you've gained provides insight into how high-level exception handling systems work under the hood!