---
title: "Program Flow Control Structures"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 20
description: "Master advanced program flow patterns by combining conditionals, loops, and subroutines. Build state machines, event handlers, and complex control systems."
learning_objectives:
  - "Combine conditionals, loops, and subroutines effectively"
  - "Build state machines for complex program control"
  - "Create event-driven programming patterns"
  - "Master jump tables and dispatch systems"
  - "Design maintainable control flow architectures"
concepts:
  - "State machine implementation"
  - "Event-driven programming"
  - "Jump table dispatch systems"
  - "Control flow patterns and architectures"
  - "Complex conditional structures"
estimated_duration: "55-65 minutes"
difficulty: "hard"
code_examples: true
practical_exercise: true
order: 20
---

# Lesson 20: Program Flow Control Structures

You've mastered individual control elements - conditionals, loops, and subroutines. Now you'll learn to combine them into sophisticated control structures for your Spectrum Saga adventure game. These patterns will handle complex game logic, puzzle states, and player interactions that make adventure games engaging.

## State Machine Fundamentals

### What is a State Machine?

A state machine is a control structure where:

- The program exists in one of several defined **states**
- **Events** or conditions trigger transitions between states
- Each state has specific behaviors and responses
- The current state determines how the program responds to inputs

```text
; Simple state machine structure
CurrentState: DB 0      ; 0=idle, 1=active, 2=paused

StateMachine:
    LD A, (CurrentState)
    ; Jump to appropriate state handler
    OR A
    JP Z, IdleState
    DEC A
    JP Z, ActiveState
    ; Must be paused state
    JP PausedState
```

### Game State Machine Example

```text
; Game states
GAME_MENU       EQU 0
GAME_PLAYING    EQU 1
GAME_PAUSED     EQU 2
GAME_OVER       EQU 3

GameState: DB GAME_MENU

UpdateGame:
    LD A, (GameState)
    ; Use jump table for efficient dispatch
    SLA A               ; Multiply by 2 (addresses are 2 bytes)
    LD HL, StateTable
    LD C, A
    LD B, 0
    ADD HL, BC          ; Point to state handler address
    LD A, (HL)          ; Get low byte
    INC HL
    LD H, (HL)          ; Get high byte
    LD L, A             ; HL = handler address
    JP (HL)             ; Jump to state handler

StateTable:
    DW MenuState        ; State 0
    DW PlayingState     ; State 1
    DW PausedState      ; State 2
    DW GameOverState    ; State 3
```

**Basic State Machine:**

```assembly
; Simple state machine demonstration
; States: 0=Init, 1=Running, 2=Waiting, 3=Done

CurrentState: DB 0
StateCounter: DB 0

; Main state machine dispatcher
RunStateMachine:
    LD A, (CurrentState)
    OR A
    JP Z, InitState
    DEC A
    JP Z, RunningState
    DEC A
    JP Z, WaitingState
    JP DoneState        ; Must be state 3

; State 0: Initialization
InitState:
    LD A, 10            ; Initialize counter
    LD (StateCounter), A

    ; Transition to Running state
    LD A, 1
    LD (CurrentState), A
    LD B, 100           ; Return init complete code
    RET

; State 1: Running (counting down)
RunningState:
    LD A, (StateCounter)
    DEC A               ; Decrement counter
    LD (StateCounter), A

    OR A                ; Check if zero
    JR NZ, StillRunning

    ; Counter reached zero - transition to Waiting
    LD A, 2
    LD (CurrentState), A
    LD B, 200           ; Return running complete code
    RET

StillRunning:
    LD B, 201           ; Return still running code
    RET

; State 2: Waiting (simple delay)
WaitingState:
    ; Simple wait simulation - could check for input here
    CALL SimulateWait

    ; Transition to Done state
    LD A, 3
    LD (CurrentState), A
    LD B, 300           ; Return waiting complete code
    RET

; State 3: Done (could restart or exit)
DoneState:
    ; Reset to initial state for demonstration
    LD A, 0
    LD (CurrentState), A
    LD B, 400           ; Return done code
    RET

SimulateWait:
    ; Simple delay routine
    LD A, 50
WaitLoop:
    DEC A
    JR NZ, WaitLoop
    RET

; Call RunStateMachine repeatedly to see state transitions
; B register will contain different codes showing current state
```

## Event-Driven Programming

### Event Queue System

```text
; Event queue for handling multiple events
EventQueue:
    DB 10               ; Queue size
    DB 0                ; Head pointer
    DB 0                ; Tail pointer
    DB 0                ; Count
    DS 10               ; Event data

; Add event to queue
; Input: A = event type
AddEvent:
    PUSH HL
    LD HL, EventQueue + 3   ; Point to count
    LD B, (HL)              ; Get current count
    LD A, (EventQueue)      ; Get queue size
    CP B                    ; Check if full
    JR Z, QueueFull         ; Skip if full

    ; Add event to tail
    LD HL, EventQueue + 2   ; Point to tail
    LD C, (HL)              ; Get tail position
    LD HL, EventQueue + 4   ; Point to data area
    LD B, 0
    ADD HL, BC              ; Point to tail position
    LD (HL), A              ; Store event

    ; Update tail pointer
    LD HL, EventQueue + 2
    INC (HL)                ; Increment tail
    LD A, (HL)
    CP 10                   ; Check wraparound
    JR C, NoWrapTail
    LD (HL), 0              ; Wrap to start
NoWrapTail:

    ; Update count
    LD HL, EventQueue + 3
    INC (HL)                ; Increment count

QueueFull:
    POP HL
    RET
```

### Event Processing Loop

```text
; Main event processing loop
ProcessEvents:
    CALL CheckKeyboard      ; Generate keyboard events
    CALL CheckTimer         ; Generate timer events
    CALL CheckCollisions    ; Generate collision events

    ; Process all queued events
EventLoop:
    CALL GetNextEvent       ; Get event from queue
    JR C, NoMoreEvents      ; Exit if no events

    ; Dispatch event based on type
    OR A
    JP Z, HandleKeyEvent
    DEC A
    JP Z, HandleTimerEvent
    DEC A
    JP Z, HandleCollisionEvent

    JR EventLoop            ; Continue processing

NoMoreEvents:
    RET
```

**Event-Driven System:**

```assembly
; Simple event-driven system demonstration

; Event types
EVENT_NONE      EQU 0
EVENT_KEYPRESS  EQU 1
EVENT_TIMER     EQU 2
EVENT_COLLISION EQU 3

; Simple event queue (circular buffer)
EventQueue:     DS 8    ; 8 event slots
QueueHead:      DB 0    ; Head position
QueueTail:      DB 0    ; Tail position
QueueCount:     DB 0    ; Number of events

TimerCounter:   DB 0    ; For generating timer events

; Add event to queue
; Input: A = event type
EnqueueEvent:
    PUSH BC
    PUSH HL

    ; Check if queue is full
    LD B, A             ; Save event
    LD A, (QueueCount)
    CP 8                ; Queue size
    JR Z, QueueFull     ; Skip if full

    ; Add event to tail position
    LD A, (QueueTail)
    LD HL, EventQueue
    LD C, A
    ADD HL, BC          ; Point to tail position
    LD (HL), B          ; Store event

    ; Update tail pointer (with wraparound)
    INC A
    AND 7               ; Wrap at 8 (0-7)
    LD (QueueTail), A

    ; Update count
    LD HL, QueueCount
    INC (HL)

QueueFull:
    POP HL
    POP BC
    RET

; Get next event from queue
; Output: A = event type, Carry = 0 if event available
DequeueEvent:
    PUSH BC
    PUSH HL

    ; Check if queue is empty
    LD A, (QueueCount)
    OR A
    JR Z, QueueEmpty

    ; Get event from head position
    LD A, (QueueHead)
    LD HL, EventQueue
    LD C, A
    ADD HL, BC          ; Point to head position
    LD B, (HL)          ; Get event

    ; Update head pointer (with wraparound)
    INC A
    AND 7               ; Wrap at 8
    LD (QueueHead), A

    ; Update count
    LD HL, QueueCount
    DEC (HL)

    LD A, B             ; Return event
    OR A                ; Clear carry (event available)
    POP HL
    POP BC
    RET

QueueEmpty:
    SCF                 ; Set carry (no event)
    POP HL
    POP BC
    RET

; Generate some events for demonstration
GenerateEvents:
    ; Generate timer event every 16 calls
    LD A, (TimerCounter)
    INC A
    LD (TimerCounter), A
    AND 15              ; Every 16 counts
    JR NZ, NoTimer

    LD A, EVENT_TIMER
    CALL EnqueueEvent

NoTimer:
    ; Simulate random keypress event
    LD A, (TimerCounter)
    AND 31              ; Every 32 counts
    JR NZ, NoKey

    LD A, EVENT_KEYPRESS
    CALL EnqueueEvent

NoKey:
    RET

; Process all events in queue
ProcessEventQueue:
    ; Generate new events
    CALL GenerateEvents

    ; Process existing events
EventProcessLoop:
    CALL DequeueEvent
    JR C, NoMoreEvents  ; Exit if no events

    ; Handle different event types
    CP EVENT_KEYPRESS
    JR Z, HandleKeypress
    CP EVENT_TIMER
    JR Z, HandleTimer
    CP EVENT_COLLISION
    JR Z, HandleCollision

    ; Unknown event - ignore
    JR EventProcessLoop

HandleKeypress:
    LD B, 100           ; Keypress handled code
    JR EventProcessLoop

HandleTimer:
    LD B, 200           ; Timer handled code
    JR EventProcessLoop

HandleCollision:
    LD B, 300           ; Collision handled code
    JR EventProcessLoop

NoMoreEvents:
    RET

; Call ProcessEventQueue repeatedly to see event handling
; B register will show codes for different events processed
```

## Jump Table Dispatch Systems

### Basic Jump Table

```text
; Jump table for fast function dispatch
CommandTable:
    DW Command0         ; Function 0
    DW Command1         ; Function 1
    DW Command2         ; Function 2
    DW Command3         ; Function 3

; Dispatch function based on command number
; Input: A = command number (0-3)
DispatchCommand:
    ; Bounds checking
    CP 4
    JR NC, InvalidCommand

    ; Calculate table offset
    SLA A               ; Multiply by 2 (addresses are 2 bytes)
    LD HL, CommandTable
    LD C, A
    LD B, 0
    ADD HL, BC          ; Point to function address

    ; Get function address and call it
    LD A, (HL)          ; Low byte
    INC HL
    LD H, (HL)          ; High byte
    LD L, A             ; HL = function address
    JP (HL)             ; Jump to function

InvalidCommand:
    ; Handle invalid command
    RET
```

### Multi-Level Dispatch

```text
; Two-level dispatch system
; Level 1: Category (0-3)
; Level 2: Function within category (0-7)

CategoryTable:
    DW GraphicsCommands     ; Category 0
    DW SoundCommands        ; Category 1
    DW InputCommands        ; Category 2
    DW SystemCommands       ; Category 3

; Dispatch with category and function
; Input: A = category, B = function
DispatchCategoryFunction:
    ; Validate category
    CP 4
    JR NC, InvalidCategory

    ; Get category table address
    SLA A
    LD HL, CategoryTable
    LD C, A
    LD B, 0
    ADD HL, BC
    LD A, (HL)
    INC HL
    LD H, (HL)
    LD L, A             ; HL = category table address

    ; Validate function number
    LD A, B
    CP 8                ; Max 8 functions per category
    JR NC, InvalidFunction

    ; Get function address from category table
    SLA A
    LD C, A
    LD B, 0
    ADD HL, BC
    LD A, (HL)
    INC HL
    LD H, (HL)
    LD L, A             ; HL = function address
    JP (HL)

InvalidCategory:
InvalidFunction:
    RET
```

**Jump Table Dispatch:**

```assembly
; Jump table dispatch system demonstration

; Function table
FunctionTable:
    DW Function0        ; Index 0
    DW Function1        ; Index 1
    DW Function2        ; Index 2
    DW Function3        ; Index 3
    DW Function4        ; Index 4

; Execute function by index
; Input: A = function index (0-4)
ExecuteFunction:
    ; Bounds check
    CP 5                ; Check if index < 5
    JR NC, InvalidIndex

    ; Calculate table offset
    SLA A               ; × 2 (addresses are 2 bytes)
    LD HL, FunctionTable
    LD C, A : LD B, 0
    ADD HL, BC          ; Point to function address

    ; Get and call function
    LD E, (HL)          ; Low byte of address
    INC HL
    LD D, (HL)          ; High byte of address
    EX DE, HL           ; HL = function address
    JP (HL)             ; Jump to function

InvalidIndex:
    LD A, 255           ; Error code
    RET

; Sample functions
Function0:
    LD A, 10            ; Return value 10
    RET

Function1:
    LD A, 20            ; Return value 20
    RET

Function2:
    LD A, 30            ; Return value 30
    RET

Function3:
    LD A, 40            ; Return value 40
    RET

Function4:
    LD A, 50            ; Return value 50
    RET

; Advanced: Computed function calls
; Parameter table for functions
ParameterTable:
    DB 1, 2             ; Parameters for Function0
    DB 3, 4             ; Parameters for Function1
    DB 5, 6             ; Parameters for Function2
    DB 7, 8             ; Parameters for Function3
    DB 9, 10            ; Parameters for Function4

; Execute function with parameters
; Input: A = function index
ExecuteWithParams:
    PUSH AF             ; Save function index

    ; Get parameters for this function
    SLA A               ; × 2 (2 parameters per function)
    LD HL, ParameterTable
    LD C, A : LD B, 0
    ADD HL, BC          ; Point to parameters
    LD B, (HL)          ; First parameter
    INC HL
    LD C, (HL)          ; Second parameter

    ; Now call the function
    POP AF              ; Restore function index
    CALL ExecuteFunction ; Call function

    ; A contains function result
    ; B and C contain the parameters that were passed
    RET

; Menu system using jump tables
MenuOption: DB 0        ; Current menu selection

MenuCommands:
    DW StartGame        ; Option 0
    DW LoadGame         ; Option 1
    DW SaveGame         ; Option 2
    DW Settings         ; Option 3
    DW ExitGame         ; Option 4

ExecuteMenuOption:
    LD A, (MenuOption)
    CP 5                ; 5 menu options
    JR NC, InvalidOption

    SLA A
    LD HL, MenuCommands
    LD C, A : LD B, 0
    ADD HL, BC
    LD E, (HL)
    INC HL
    LD D, (HL)
    EX DE, HL
    JP (HL)

InvalidOption:
    LD A, 255
    RET

; Menu functions
StartGame:  LD A, 1 : RET
LoadGame:   LD A, 2 : RET
SaveGame:   LD A, 3 : RET
Settings:   LD A, 4 : RET
ExitGame:   LD A, 5 : RET

; Test the system:
; LD A, 2 : CALL ExecuteFunction -> returns 30
; LD A, 1 : CALL ExecuteWithParams -> returns 20, B=3, C=4
```

## Complex Conditional Structures

### Multi-Way Branching

```text
; Complex decision tree
EvaluateGameSituation:
    ; Check player health
    LD A, (PlayerHealth)
    CP 25               ; Low health threshold
    JR C, LowHealthBranch

    ; Good health - check enemies
    LD A, (EnemyCount)
    OR A
    JR Z, NoEnemiesBranch

    ; Enemies present - check power level
    LD A, (PowerLevel)
    CP 50
    JR C, LowPowerBranch

    ; High power, enemies present, good health
    JP AdvancedCombat

LowHealthBranch:
    ; Low health - check for health items
    LD A, (HealthItems)
    OR A
    JP Z, RetreatStrategy
    JP HealingStrategy

NoEnemiesBranch:
    ; No enemies - check objectives
    LD A, (ObjectivesComplete)
    CP 100
    JP Z, VictoryState
    JP ExplorationMode

LowPowerBranch:
    ; Low power - defensive strategy
    JP DefensiveMode
```

### Nested State Machines

```text
; Game with multiple state machines
; Main game state + AI state + UI state

MainGameState:  DB 0    ; 0=menu, 1=playing, 2=paused
AIState:        DB 0    ; 0=patrol, 1=chase, 2=attack
UIState:        DB 0    ; 0=normal, 1=inventory, 2=dialog

UpdateAllStates:
    CALL UpdateMainGame
    CALL UpdateAI
    CALL UpdateUI
    RET

UpdateMainGame:
    LD A, (MainGameState)
    ; Handle main game state transitions
    RET

UpdateAI:
    ; Only update AI if game is playing
    LD A, (MainGameState)
    CP 1                ; Playing state
    RET NZ              ; Return if not playing

    LD A, (AIState)
    ; Handle AI state transitions
    RET

UpdateUI:
    LD A, (UIState)
    ; Handle UI state transitions
    RET
```

## Control Flow Optimization

### Minimize Jump Distance

```text
; GOOD: Most common cases first, short jumps
ProcessInput:
    LD A, (InputType)
    CP MOVE_INPUT       ; Most common
    JR Z, HandleMove    ; Short jump

    CP FIRE_INPUT       ; Second most common
    JR Z, HandleFire    ; Short jump

    CP MENU_INPUT       ; Less common
    JP Z, HandleMenu    ; Long jump OK

    ; Rare inputs
    JP HandleSpecialInput
```

### Early Exit Patterns

```text
; GOOD: Early exit reduces nesting
ValidateInput:
    ; Quick rejection tests first
    LD A, (InputValue)
    OR A
    RET Z               ; Return immediately if zero

    CP 100
    JR NC, InvalidInput ; Return immediately if too large

    ; Expensive validation only if needed
    CALL ComplexValidation
    RET

InvalidInput:
    SCF                 ; Set error flag
    RET
```

### State Machine Optimization

```text
; Optimized state machine with computed jumps
OptimizedStateMachine:
    LD A, (CurrentState)
    ; Direct computed jump (fastest)
    LD HL, StateHandlers
    SLA A               ; × 2 for word addresses
    LD C, A
    LD B, 0
    ADD HL, BC
    LD A, (HL)
    INC HL
    LD H, (HL)
    LD L, A
    JP (HL)             ; Direct jump - no conditional tests

StateHandlers:
    DW State0Handler
    DW State1Handler
    DW State2Handler
    DW State3Handler
```

**Complex Control Flow Example:**

```assembly
; Complex game control system demonstration

; Game entity states
ENTITY_IDLE     EQU 0
ENTITY_MOVING   EQU 1
ENTITY_ATTACKING EQU 2
ENTITY_DEAD     EQU 3

; Entity structure: State, X, Y, Health, Type
Entity1:    DB ENTITY_IDLE, 50, 30, 100, 1
Entity2:    DB ENTITY_MOVING, 100, 60, 80, 2
Entity3:    DB ENTITY_ATTACKING, 150, 90, 60, 1

; Entity behavior dispatch table
EntityBehaviors:
    DW IdleBehavior     ; State 0
    DW MovingBehavior   ; State 1
    DW AttackBehavior   ; State 2
    DW DeadBehavior     ; State 3

; Update entity based on its current state
; Input: IX = pointer to entity structure
UpdateEntity:
    LD A, (IX+0)        ; Get entity state

    ; Bounds check
    CP 4
    JR NC, InvalidState

    ; Dispatch to appropriate behavior
    SLA A               ; × 2 for address table
    LD HL, EntityBehaviors
    LD C, A : LD B, 0
    ADD HL, BC          ; Point to behavior address
    LD E, (HL)          ; Get address low byte
    INC HL
    LD D, (HL)          ; Get address high byte
    EX DE, HL           ; HL = behavior address
    JP (HL)             ; Execute behavior

InvalidState:
    ; Reset to idle if invalid state
    LD (IX+0), ENTITY_IDLE
    RET

; Entity behaviors
IdleBehavior:
    ; Check if should start moving (simple AI)
    LD A, (IX+3)        ; Get health
    CP 50               ; If health < 50, start moving to find health
    JR C, StartMoving

    ; Random chance to start moving
    CALL GetRandomNumber ; Returns 0-255 in A
    AND 31              ; 1 in 32 chance
    JR Z, StartMoving

    RET                 ; Stay idle

StartMoving:
    LD (IX+0), ENTITY_MOVING
    RET

MovingBehavior:
    ; Move entity (simple movement)
    INC (IX+1)          ; Move right

    ; Check if should stop moving
    LD A, (IX+1)        ; Get X position
    CP 200              ; If reached edge
    JR C, KeepMoving

    ; Reached edge - go back to idle
    LD (IX+0), ENTITY_IDLE
    RET

KeepMoving:
    ; Random chance to start attacking
    CALL GetRandomNumber
    AND 15              ; 1 in 16 chance
    JR Z, StartAttacking
    RET

StartAttacking:
    LD (IX+0), ENTITY_ATTACKING
    RET

AttackBehavior:
    ; Attack behavior (reduce own health for demo)
    DEC (IX+3)          ; Reduce health

    ; Check if should die
    LD A, (IX+3)
    OR A
    JR Z, StartDying

    ; Check if should stop attacking
    CALL GetRandomNumber
    AND 7               ; 1 in 8 chance
    JR Z, StopAttacking
    RET

StartDying:
    LD (IX+0), ENTITY_DEAD
    RET

StopAttacking:
    LD (IX+0), ENTITY_IDLE
    RET

DeadBehavior:
    ; Dead entities don't do anything
    RET

; Simple random number generator
RandomSeed: DB 1

GetRandomNumber:
    LD A, (RandomSeed)
    ; Simple linear congruential generator
    RLA                 ; × 2
    RLA                 ; × 4
    RLA                 ; × 8
    XOR (RandomSeed)    ; Add some chaos
    ADD A, 17           ; Add constant
    LD (RandomSeed), A
    RET

; Update all entities
UpdateAllEntities:
    LD IX, Entity1
    CALL UpdateEntity

    LD IX, Entity2
    CALL UpdateEntity

    LD IX, Entity3
    CALL UpdateEntity
    RET

; Call UpdateAllEntities repeatedly to see entities
; change states and behave according to their AI
```

## Advanced Flow Control Patterns

### Cooperative Multitasking

```text
; Simple cooperative multitasking system
TaskList:
    DW Task1, Task2, Task3, Task4   ; Task functions
    DB 1, 1, 1, 1                   ; Task active flags

CurrentTask: DB 0
TaskCount:   EQU 4

RunTasks:
    LD B, TaskCount
    LD A, (CurrentTask)

TaskLoop:
    ; Check if current task is active
    LD HL, TaskList + (TaskCount * 2)   ; Point to flags
    LD C, A
    ADD HL, BC
    LD C, (HL)          ; Get active flag
    LD A, C
    OR A
    JR Z, NextTask      ; Skip if inactive

    ; Run current task
    LD HL, TaskList
    LD A, (CurrentTask)
    SLA A               ; × 2 for addresses
    LD C, A
    ADD HL, BC
    LD C, (HL)
    INC HL
    LD H, (HL)
    LD L, C             ; HL = task address
    CALL CallTask       ; Run task

NextTask:
    LD A, (CurrentTask)
    INC A
    CP TaskCount
    JR C, NoWrap
    LD A, 0             ; Wrap to first task
NoWrap:
    LD (CurrentTask), A
    DJNZ TaskLoop
    RET

CallTask:
    ; Call task and handle return
    CALL CallHL         ; Call function at HL
    RET

CallHL:
    JP (HL)
```

### Hierarchical State Machines

```text
; Parent state machine
ParentState: DB 0
ChildState:  DB 0

UpdateHierarchicalState:
    ; Update parent state first
    LD A, (ParentState)
    CALL UpdateParentState

    ; Update child state based on parent
    LD A, (ParentState)
    OR A
    JP Z, UpdateMenuChild
    DEC A
    JP Z, UpdateGameChild
    JP UpdatePauseChild

UpdateParentState:
    ; Parent state logic
    RET

UpdateMenuChild:
    ; Child state machine for menu
    LD A, (ChildState)
    ; Handle menu sub-states
    RET

UpdateGameChild:
    ; Child state machine for game
    LD A, (ChildState)
    ; Handle game sub-states
    RET

UpdatePauseChild:
    ; Child state machine for pause
    LD A, (ChildState)
    ; Handle pause sub-states
    RET
```

## Practice Exercise

Create a comprehensive control flow system that demonstrates:

1. A multi-state game system with state transitions
2. Event-driven input handling
3. Jump table dispatch for different game modes
4. Nested decision structures for AI behavior
5. Performance-optimized control flow

**Practice Exercise - Complete Control System:**

```assembly
; Comprehensive game control system

; Game modes
MODE_MENU       EQU 0
MODE_PLAYING    EQU 1
MODE_INVENTORY  EQU 2
MODE_PAUSED     EQU 3

; AI behaviors
AI_PATROL       EQU 0
AI_CHASE        EQU 1
AI_FLEE         EQU 2

; Game state
GameMode:       DB MODE_MENU
PlayerHealth:   DB 100
EnemyDistance:  DB 50
PlayerWeapon:   DB 1

; Mode dispatch table
ModeHandlers:
    DW HandleMenu       ; Mode 0
    DW HandlePlaying    ; Mode 1
    DW HandleInventory  ; Mode 2
    DW HandlePaused     ; Mode 3

; Main game update function
UpdateGame:
    LD A, (GameMode)
    CP 4                ; Bounds check
    JR NC, InvalidMode

    ; Dispatch to mode handler
    SLA A               ; × 2 for addresses
    LD HL, ModeHandlers
    LD C, A : LD B, 0
    ADD HL, BC
    LD E, (HL)
    INC HL
    LD D, (HL)
    EX DE, HL
    JP (HL)             ; Jump to mode handler

InvalidMode:
    LD A, MODE_MENU     ; Reset to menu
    LD (GameMode), A
    RET

; Mode handlers
HandleMenu:
    ; Simple menu state machine
    ; Check for start game input (simulated)
    CALL SimulateMenuInput
    OR A
    JR Z, MenuStay

    ; Start game
    LD A, MODE_PLAYING
    LD (GameMode), A
    LD B, 100           ; Menu->Game transition code
    RET

MenuStay:
    LD B, 101           ; Still in menu code
    RET

HandlePlaying:
    ; Complex game state with multiple conditions

    ; Check player health first (critical)
    LD A, (PlayerHealth)
    CP 20               ; Critical health
    JR C, CriticalHealth

    ; Check enemy distance
    LD A, (EnemyDistance)
    CP 10               ; Very close
    JR C, EnemyVeryClose
    CP 30               ; Moderate distance
    JR C, EnemyClose

    ; Enemy far - normal gameplay
    CALL NormalGameplay
    LD B, 200           ; Normal gameplay code
    RET

CriticalHealth:
    ; Player in danger - check for escape options
    LD A, (EnemyDistance)
    CP 20
    JR C, FleeImmediate

    ; Try to heal
    CALL AttemptHealing
    LD B, 201           ; Healing attempt code
    RET

FleeImmediate:
    CALL FleeFromEnemy
    LD B, 202           ; Fleeing code
    RET

EnemyVeryClose:
    ; Close combat - check weapon
    LD A, (PlayerWeapon)
    CP 3                ; Good weapon
    JR NC, AttackEnemy

    ; Weak weapon - defensive
    CALL DefensiveAction
    LD B, 203           ; Defensive code
    RET

AttackEnemy:
    CALL CombatAction
    LD B, 204           ; Combat code
    RET

EnemyClose:
    ; Moderate threat - tactical decision
    LD A, (PlayerHealth)
    CP 50
    JR C, TacticalRetreat

    CALL TacticalAdvance
    LD B, 205           ; Tactical advance code
    RET

TacticalRetreat:
    CALL TacticalRetreat
    LD B, 206           ; Tactical retreat code
    RET

HandleInventory:
    ; Inventory management
    CALL ProcessInventory
    LD B, 300           ; Inventory mode code
    RET

HandlePaused:
    ; Pause state
    CALL ProcessPause
    LD B, 400           ; Pause mode code
    RET

; Action implementations (simplified)
SimulateMenuInput:
    ; Simulate menu input
    CALL GetRandomValue
    AND 31              ; 1 in 32 chance
    RET

NormalGameplay:
    ; Normal game processing
    RET

AttemptHealing:
    ; Try to heal player
    LD A, (PlayerHealth)
    ADD A, 10
    CP 100
    JR C, HealOK
    LD A, 100           ; Cap at 100
HealOK:
    LD (PlayerHealth), A
    RET

FleeFromEnemy:
    ; Increase distance from enemy
    LD A, (EnemyDistance)
    ADD A, 5
    LD (EnemyDistance), A
    RET

DefensiveAction:
    ; Defensive behavior
    RET

CombatAction:
    ; Attack enemy
    LD A, (EnemyDistance)
    SUB 3               ; Enemy gets closer during combat
    JR NC, CombatOK
    LD A, 0
CombatOK:
    LD (EnemyDistance), A
    RET

TacticalAdvance:
    ; Move closer tactically
    LD A, (EnemyDistance)
    SUB 2
    JR NC, AdvanceOK
    LD A, 0
AdvanceOK:
    LD (EnemyDistance), A
    RET

TacticalRetreat:
    ; Move away tactically
    LD A, (EnemyDistance)
    ADD A, 3
    LD (EnemyDistance), A
    RET

ProcessInventory:
    ; Inventory processing
    RET

ProcessPause:
    ; Pause processing
    RET

; Random value generator
RandomValue: DB 1

GetRandomValue:
    LD A, (RandomValue)
    RLA : RLA : RLA     ; × 8
    XOR (RandomValue)
    ADD A, 23
    LD (RandomValue), A
    RET

; Call UpdateGame repeatedly to see complex state management
; B register shows different codes for various game situations
; Try modifying PlayerHealth, EnemyDistance, PlayerWeapon to see
; different behavior paths taken
```

## What You've Learned

In this advanced lesson, you've mastered:

- Building sophisticated state machines for complex program control
- Creating event-driven programming systems with queues and handlers
- Implementing jump table dispatch systems for efficient function calling
- Designing complex conditional structures and decision trees
- Combining all control flow elements into cohesive system architectures
- Understanding performance optimization techniques for control flow
- Building maintainable and extensible control systems

## Looking Ahead

Next, you'll learn about **simple algorithms and problem solving** - applying your control flow mastery to solve common programming problems like sorting, searching, and optimization using efficient algorithmic approaches!

## Fun Fact

The control flow patterns you've learned are the foundation of all modern software architecture! State machines are used in everything from network protocols to user interfaces, event-driven programming powers web browsers and operating systems, and jump table dispatch is how virtual function calls work in object-oriented languages. The Z80's efficient jump instructions and stack management made it possible to implement these sophisticated patterns in limited memory, proving that good software architecture isn't about having unlimited resources - it's about organizing code clearly and efficiently. Many of these patterns were first developed on 8-bit systems like the ZX Spectrum and remain virtually unchanged in modern software development!
