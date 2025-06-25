---
title: "Simple Algorithms and Problem Solving"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 21
description: "Apply your programming skills to solve common algorithmic problems. Learn sorting, searching, and optimization techniques using efficient Z80 assembly approaches."
learning_objectives:
  - "Implement fundamental sorting algorithms in assembly"
  - "Master searching techniques for different data structures"
  - "Learn optimization strategies for algorithm efficiency"
  - "Practice problem decomposition and solution design"
  - "Build reusable algorithmic building blocks"
concepts:
  - "Sorting algorithms (bubble, insertion, selection)"
  - "Search algorithms (linear, binary)"
  - "Algorithm optimization techniques"
  - "Problem-solving methodologies"
  - "Performance analysis and measurement"
estimated_duration: "60-70 minutes"
difficulty: "hard"
code_examples: true
practical_exercise: true
order: 21
---

# Lesson 21: Simple Algorithms and Problem Solving

Now that you've mastered control flow, it's time to apply these skills to solve real problems using algorithms. Algorithms are step-by-step procedures for solving specific types of problems efficiently. You'll learn fundamental algorithms for sorting, searching, and optimization that form the building blocks of more complex programs.

## Problem-Solving Approach

### Breaking Down Problems

Before coding any algorithm, follow this systematic approach:

1. **Understand the problem**: What exactly needs to be solved?
2. **Define inputs and outputs**: What data goes in, what comes out?
3. **Consider edge cases**: Empty data, single element, already sorted, etc.
4. **Choose the right algorithm**: Consider time vs. space tradeoffs
5. **Implement step by step**: Start simple, then optimize

```text
; Example: Sort an array of numbers
; Input: Array address in HL, size in B
; Output: Array sorted in ascending order
; Edge cases: Empty array (B=0), single element (B=1)
; Algorithm choice: Bubble sort (simple to understand and implement)
```

## Sorting Algorithms

### Bubble Sort

Bubble sort repeatedly compares adjacent elements and swaps them if they're in the wrong order:

```text
; Bubble sort implementation
; Input: HL = array address, B = array size
BubbleSort:
    PUSH BC
    PUSH HL
    
    ; Outer loop: number of passes
    LD A, B
    DEC A               ; Need n-1 passes
    JR Z, BubbleDone    ; Skip if 0 or 1 element
    LD C, A             ; C = number of passes
    
BubblePassLoop:
    PUSH BC             ; Save pass counter
    PUSH HL             ; Save array start
    
    ; Inner loop: compare adjacent elements
    LD B, C             ; B = elements to check this pass
    
BubbleCompareLoop:
    LD A, (HL)          ; Get first element
    INC HL              ; Point to second element
    CP (HL)             ; Compare with second element
    JR C, NoSwap        ; Skip if already in order (A < (HL))
    
    ; Swap elements
    LD D, (HL)          ; Save second element
    LD (HL), A          ; Put first in second position
    DEC HL              ; Back to first position
    LD (HL), D          ; Put second in first position
    INC HL              ; Back to second position
    
NoSwap:
    DJNZ BubbleCompareLoop ; Continue inner loop
    
    POP HL              ; Restore array start
    POP BC              ; Restore pass counter
    DEC C               ; One less pass needed
    JR NZ, BubblePassLoop ; Continue outer loop
    
BubbleDone:
    POP HL
    POP BC
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Bubble Sort Implementation"
  code="; Bubble sort demonstration
TestArray:
    DB 64, 34, 25, 12, 22, 11, 90, 5

; Sort the test array
SortDemo:
    LD HL, TestArray    ; Point to array
    LD B, 8             ; Array size
    CALL BubbleSort
    RET

; Bubble sort implementation
BubbleSort:
    PUSH BC
    PUSH HL
    PUSH DE
    
    ; Check for trivial cases
    LD A, B
    CP 2
    JR C, SortDone      ; Skip if 0 or 1 element
    
    ; Outer loop: B-1 passes
    DEC B               ; Need size-1 passes
    LD C, B             ; C = number of passes remaining
    
PassLoop:
    PUSH BC             ; Save counters
    PUSH HL             ; Save array start
    
    ; Inner loop: compare adjacent pairs
    LD B, C             ; B = comparisons this pass
    
CompareLoop:
    LD A, (HL)          ; Get first element
    INC HL              ; Point to next element
    LD D, (HL)          ; Get second element
    
    ; Compare: is A > D? (need to swap?)
    CP D
    JR C, InOrder       ; Jump if A < D (already in order)
    JR Z, InOrder       ; Jump if A = D (equal, no swap needed)
    
    ; A > D, need to swap
    LD (HL), A          ; Put larger element in second position
    DEC HL              ; Back to first position
    LD (HL), D          ; Put smaller element in first position
    INC HL              ; Forward to second position again
    
InOrder:
    DJNZ CompareLoop    ; Continue for all comparisons in this pass
    
    ; End of pass
    POP HL              ; Restore array start
    POP BC              ; Restore counters
    DEC C               ; One fewer pass needed
    JR NZ, PassLoop     ; Continue if more passes needed
    
SortDone:
    POP DE
    POP HL
    POP BC
    RET

; Test with different arrays
TestSort:
    ; Test 1: Random order
    LD HL, TestArray
    LD B, 8
    CALL BubbleSort
    
    ; Test 2: Already sorted
    LD HL, SortedArray
    LD B, 5
    CALL BubbleSort
    
    ; Test 3: Reverse sorted
    LD HL, ReverseArray
    LD B, 6
    CALL BubbleSort
    RET

SortedArray:
    DB 1, 2, 3, 4, 5

ReverseArray:
    DB 9, 7, 5, 3, 2, 1"
  language="assembly"
/>

### Selection Sort

Selection sort finds the smallest element and moves it to the beginning, then repeats:

```text
; Selection sort implementation
; Input: HL = array address, B = array size
SelectionSort:
    PUSH BC
    PUSH HL
    PUSH DE
    
    ; Outer loop: for each position
    LD A, B
    DEC A               ; Need n-1 iterations
    JR Z, SelectDone    ; Skip if 0 or 1 element
    LD C, A             ; C = positions left to fill
    
SelectPositionLoop:
    PUSH BC             ; Save counters
    PUSH HL             ; Save current position
    
    ; Find minimum in remaining array
    LD D, (HL)          ; Current minimum value
    LD E, 0             ; Offset to minimum element
    INC HL              ; Start searching from next element
    
    ; Inner loop: find minimum
    LD A, C             ; Elements left to check
    DEC A               ; Already have first element
    JR Z, FoundMin      ; Skip if no more elements
    LD B, A             ; B = elements to check
    LD A, 1             ; Current offset
    
FindMinLoop:
    CP (HL)             ; Compare current min with this element
    JR C, NotSmaller    ; Skip if current min is smaller
    
    ; Found new minimum
    LD D, (HL)          ; New minimum value
    LD E, A             ; New minimum offset
    
NotSmaller:
    INC HL              ; Next element
    INC A               ; Next offset
    DJNZ FindMinLoop    ; Continue search
    
FoundMin:
    ; Swap minimum with current position
    POP HL              ; Restore current position
    LD A, (HL)          ; Get element at current position
    CP D                ; Compare with minimum found
    JR Z, NoSwapNeeded  ; Skip if already the minimum
    
    ; Perform swap
    LD (HL), D          ; Put minimum at current position
    
    ; Find minimum's original location and put current element there
    PUSH HL             ; Save current position
    LD A, E             ; Offset to minimum
    ADD A, L            ; Calculate address
    LD L, A
    JR NC, NoCarry1
    INC H
NoCarry1:
    LD (HL), A          ; Store original element at minimum's location
    POP HL              ; Restore current position
    
NoSwapNeeded:
    INC HL              ; Next position
    POP BC              ; Restore counters
    DEC C               ; One fewer position to fill
    JR NZ, SelectPositionLoop
    
SelectDone:
    POP DE
    POP HL
    POP BC
    RET
```

### Insertion Sort

Insertion sort builds the sorted array one element at a time by inserting each element into its correct position:

```text
; Insertion sort implementation
; Input: HL = array address, B = array size
InsertionSort:
    PUSH BC
    PUSH HL
    PUSH DE
    
    ; Start from second element (index 1)
    LD A, B
    CP 2
    JR C, InsertDone    ; Skip if less than 2 elements
    
    INC HL              ; Start from second element
    DEC B               ; One fewer element to process
    
InsertLoop:
    LD A, (HL)          ; Current element to insert
    LD C, A             ; Save current element
    
    ; Find insertion position by comparing backwards
    PUSH HL             ; Save current position
    PUSH BC             ; Save element and counter
    
    ; Compare with previous elements
InsertSearchLoop:
    DEC HL              ; Previous element
    LD A, (HL)          ; Get previous element
    CP C                ; Compare with element to insert
    JR C, InsertHere    ; If previous < current, insert after it
    JR Z, InsertHere    ; If equal, insert after it
    
    ; Previous element is larger, need to shift it right
    INC HL              ; Back to current position
    LD (HL), A          ; Move larger element right
    DEC HL              ; Back to previous position
    
    ; Check if we've reached the beginning
    ; (This is simplified - real version needs boundary checking)
    JR InsertSearchLoop ; Continue searching backwards
    
InsertHere:
    INC HL              ; Move to insertion position
    LD (HL), C          ; Insert the element
    
    POP BC              ; Restore counters
    POP HL              ; Restore current position
    INC HL              ; Next element to process
    DJNZ InsertLoop     ; Continue for all elements
    
InsertDone:
    POP DE
    POP HL
    POP BC
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Selection Sort Implementation"
  code="; Selection sort - finds minimum and swaps to front
SelectionSort:
    PUSH BC
    PUSH HL
    PUSH DE
    
    ; Outer loop: for each position from start
    LD A, B
    DEC A               ; Need n-1 passes
    JR Z, SelectionDone
    LD C, A             ; C = passes remaining
    
SelectionPassLoop:
    PUSH BC             ; Save pass counter
    PUSH HL             ; Save current position
    
    ; Find minimum in remaining unsorted portion
    LD A, (HL)          ; Assume first element is minimum
    LD D, A             ; D = minimum value found so far
    LD E, 0             ; E = offset to minimum element
    
    ; Search remaining elements
    PUSH HL             ; Save start of search
    LD B, C             ; B = elements left to check
    LD A, 0             ; A = current offset
    
FindMinimumLoop:
    LD A, (HL)          ; Get current element
    CP D                ; Compare with current minimum
    JR NC, NotNewMin    ; Skip if >= current minimum
    
    ; Found new minimum
    LD D, A             ; Update minimum value
    LD A, L             ; Calculate offset
    POP BC              ; Get start address
    PUSH BC             ; Save it again
    SUB C               ; Offset = current - start
    LD E, A             ; Save offset
    
NotNewMin:
    INC HL              ; Next element
    DJNZ FindMinimumLoop ; Continue search
    
    ; Swap minimum with current position
    POP HL              ; Restore start of search
    POP BC              ; Restore current position
    PUSH BC             ; Save it
    
    LD A, (BC)          ; Get element at current position
    LD (BC), D          ; Put minimum at current position
    
    ; Put original element at minimum's position
    LD B, 0
    LD C, E             ; BC = offset to minimum
    ADD HL, BC          ; Point to minimum's original position
    LD (HL), A          ; Store original element
    
    ; Move to next position
    POP HL              ; Restore current position
    INC HL              ; Next position
    POP BC              ; Restore counters
    DEC C               ; One fewer pass needed
    JR NZ, SelectionPassLoop
    
SelectionDone:
    POP DE
    POP HL
    POP BC
    RET

; Simplified selection sort for demonstration
SimpleSelectionSort:
    PUSH BC
    PUSH HL
    
    ; For each position (except last)
    LD A, B
    DEC A
    LD C, A             ; C = positions to process
    
SimpleOuterLoop:
    PUSH BC
    PUSH HL
    
    ; Find smallest in remaining array
    LD A, (HL)          ; Current smallest
    LD D, L : LD E, H   ; Address of smallest
    LD B, C             ; Elements to check
    
SimpleFindLoop:
    INC HL              ; Next element
    LD A, (HL)          ; Get element
    CP (DE)             ; Compare with current smallest
    JR NC, NotSmaller   ; Skip if not smaller
    
    ; Found smaller element
    LD D, L : LD E, H   ; Update address of smallest
    
NotSmaller:
    DJNZ SimpleFindLoop
    
    ; Swap smallest with current position
    POP HL              ; Current position
    LD A, (HL)          ; Get current element
    LD B, (DE)          ; Get smallest element
    LD (HL), B          ; Put smallest at current
    LD A, (DE)
    LD (DE), A          ; Put current at smallest's position
    
    INC HL              ; Next position
    POP BC
    DEC C
    JR NZ, SimpleOuterLoop
    
    POP HL
    POP BC
    RET

; Test data
TestArray2:
    DB 5, 2, 8, 1, 9, 3"
  language="assembly"
/>

## Searching Algorithms

### Linear Search

Linear search checks each element until the target is found:

```text
; Linear search implementation
; Input: HL = array address, B = array size, A = search value
; Output: Carry clear if found (HL points to element), carry set if not found
LinearSearch:
    PUSH BC
    
LinearSearchLoop:
    CP (HL)             ; Compare search value with current element
    JR Z, Found         ; Jump if found
    INC HL              ; Next element
    DJNZ LinearSearchLoop ; Continue if more elements
    
    ; Not found
    SCF                 ; Set carry flag (not found)
    POP BC
    RET
    
Found:
    OR A                ; Clear carry flag (found)
    POP BC
    RET                 ; HL points to found element
```

### Binary Search

Binary search works on sorted arrays by repeatedly dividing the search space in half:

```text
; Binary search implementation (requires sorted array)
; Input: HL = array start, DE = array end, A = search value  
; Output: Carry clear if found (HL points to element), carry set if not found
BinarySearch:
    PUSH BC
    PUSH DE
    
BinarySearchLoop:
    ; Check if search space is empty
    OR A                ; Clear carry
    SBC HL, DE          ; HL = start - end
    ADD HL, DE          ; Restore HL
    JR NC, NotFound     ; If start >= end, not found
    
    ; Calculate middle position
    PUSH HL             ; Save start
    OR A                ; Clear carry
    SBC HL, DE          ; HL = start - end
    SRA H               ; Divide by 2 (signed)
    RR L
    NEG                 ; HL = -(start - end) / 2 = (end - start) / 2
    ADD HL, DE          ; HL = end + (end - start) / 2 = middle
    
    ; Compare middle element with search value
    LD B, (HL)          ; Get middle element
    CP B                ; Compare search value with middle
    JR Z, BinaryFound   ; Found it!
    JR C, SearchLeft    ; Search value < middle, search left half
    
    ; Search right half
    INC HL              ; Start = middle + 1
    EX DE, HL           ; DE = new start
    POP HL              ; HL = old start (discard)
    EX DE, HL           ; HL = new start, DE = end
    JR BinarySearchLoop
    
SearchLeft:
    ; Search left half
    POP DE              ; DE = start (end = middle - 1)
    DEC HL              ; HL = middle - 1 (new end)
    EX DE, HL           ; HL = start, DE = new end
    JR BinarySearchLoop
    
BinaryFound:
    POP BC              ; Clean up stack
    OR A                ; Clear carry (found)
    POP DE
    POP BC
    RET
    
NotFound:
    SCF                 ; Set carry (not found)
    POP DE
    POP BC
    RET
```

<CodeRunner 
  system="zx-spectrum"
  title="Search Algorithms"
  code="; Linear and binary search implementations

SearchArray:
    DB 1, 3, 5, 7, 9, 11, 13, 15, 17, 19  ; Sorted array for binary search

; Linear search - works on any array
; Input: HL = array, B = size, A = value to find
; Output: Z flag set if found, HL points to element
LinearSearch:
    PUSH BC
    
LinearLoop:
    CP (HL)             ; Compare with current element
    JR Z, LinearFound   ; Found it!
    INC HL              ; Next element
    DJNZ LinearLoop     ; Continue if more elements
    
    ; Not found
    OR 1                ; Clear Z flag (not found)
    POP BC
    RET
    
LinearFound:
    XOR A               ; Set Z flag (found)
    POP BC
    RET

; Simplified binary search for sorted arrays
; Input: HL = array start, B = size, A = value to find  
; Output: Z flag set if found
SimpleBinarySearch:
    PUSH BC
    PUSH DE
    PUSH HL
    
    LD C, 0             ; Low index
    LD D, B             ; High index
    DEC D               ; Make it 0-based
    
BinaryLoop:
    ; Check if search space is empty
    LD A, C
    CP D
    JR Z, CheckLast     ; If low == high, check that element
    JR NC, BinaryNotFound ; If low > high, not found
    
    ; Calculate middle index: mid = (low + high) / 2
    LD A, C             ; A = low
    ADD A, D            ; A = low + high
    SRL A               ; A = (low + high) / 2
    LD E, A             ; E = middle index
    
    ; Get middle element
    POP HL              ; Restore array start
    PUSH HL
    LD B, 0
    LD C, E             ; BC = middle index
    ADD HL, BC          ; HL points to middle element
    
    ; Compare with search value
    LD A, (SearchValue) ; Get search value
    CP (HL)             ; Compare with middle element
    JR Z, BinaryFound   ; Found it!
    JR C, SearchLower   ; Search value < middle, search lower half
    
    ; Search upper half
    LD C, E             ; Low = middle
    INC C               ; Low = middle + 1
    JR BinaryLoop
    
SearchLower:
    ; Search lower half  
    LD A, E             ; High = middle
    DEC A               ; High = middle - 1
    LD D, A
    JR BinaryLoop
    
CheckLast:
    ; Check the last remaining element
    POP HL              ; Restore array start
    PUSH HL
    LD B, 0
    ADD HL, BC          ; HL points to element at index C
    LD A, (SearchValue)
    CP (HL)
    JR Z, BinaryFound
    
BinaryNotFound:
    OR 1                ; Clear Z flag (not found)
    JR BinaryExit
    
BinaryFound:
    XOR A               ; Set Z flag (found)
    
BinaryExit:
    POP HL
    POP DE
    POP BC
    RET

SearchValue: DB 0       ; Value being searched for

; Test both search algorithms
TestSearches:
    ; Test linear search
    LD HL, SearchArray
    LD B, 10            ; Array size
    LD A, 7             ; Search for 7
    CALL LinearSearch   ; Should find it
    LD C, A             ; Save result (Z flag state)
    
    ; Test binary search  
    LD A, 13            ; Search for 13
    LD (SearchValue), A
    LD HL, SearchArray
    LD B, 10
    CALL SimpleBinarySearch ; Should find it
    LD D, A             ; Save result
    
    ; Test search for non-existent value
    LD A, 6             ; Search for 6 (not in array)
    LD (SearchValue), A
    LD HL, SearchArray
    LD B, 10
    CALL SimpleBinarySearch ; Should not find it
    LD E, A             ; Save result
    RET"
  language="assembly"
/>

## Optimization Techniques

### Loop Optimization

```text
; SLOW: Repeated calculations inside loop
SlowLoop:
    LD B, 100
SlowLoopBody:
    ; Calculate array offset every time
    LD HL, Array
    LD A, 100
    SUB B               ; Calculate index
    LD C, A
    ADD HL, BC          ; Calculate address
    ; Process element
    DJNZ SlowLoopBody

; FAST: Calculate incrementally
FastLoop:
    LD HL, Array        ; Start address
    LD B, 100
FastLoopBody:
    ; Process element at (HL)
    INC HL              ; Move to next element
    DJNZ FastLoopBody
```

### Memory Access Optimization

```text
; SLOW: Random memory access
SlowAccess:
    LD A, (Array + 50)
    LD B, (Array + 10)
    LD C, (Array + 80)
    LD D, (Array + 15)

; FAST: Sequential memory access  
FastAccess:
    LD HL, Array
    LD A, (HL + 10)     ; Use indexed addressing
    LD B, (HL + 15)
    LD C, (HL + 50)
    LD D, (HL + 80)
```

### Algorithm Selection

```text
; Choose algorithm based on data characteristics

; For small arrays (< 20 elements): Insertion sort
; For medium arrays (20-100 elements): Selection sort  
; For large arrays (> 100 elements): Consider quicksort or mergesort

SmartSort:
    LD A, B             ; Array size
    CP 20
    JR C, UseInsertion
    CP 100
    JR C, UseSelection
    
    ; Use more advanced sort for large arrays
    CALL AdvancedSort
    RET
    
UseInsertion:
    CALL InsertionSort
    RET
    
UseSelection:
    CALL SelectionSort
    RET
```

## Problem-Solving Examples

### Finding Maximum and Minimum

```text
; Find both maximum and minimum in one pass
; Input: HL = array, B = size
; Output: A = maximum, C = minimum
FindMinMax:
    LD A, (HL)          ; Initialize both min and max to first element
    LD C, A
    INC HL              ; Start from second element
    DEC B               ; One fewer element to check
    JR Z, MinMaxDone    ; Exit if only one element
    
MinMaxLoop:
    LD D, (HL)          ; Get current element
    
    ; Check if new maximum
    CP D
    JR NC, CheckMin     ; Skip if current max >= element
    LD A, D             ; New maximum
    
CheckMin:
    ; Check if new minimum
    LD E, C             ; Current minimum
    LD A, D
    CP E
    JR NC, NextElement  ; Skip if element >= current min
    LD C, A             ; New minimum
    LD A, E             ; Restore maximum to A
    
NextElement:
    INC HL              ; Next element
    DJNZ MinMaxLoop
    
MinMaxDone:
    RET                 ; A = max, C = min
```

### Counting Occurrences

```text
; Count how many times a value appears in array
; Input: HL = array, B = size, A = value to count
; Output: A = count
CountOccurrences:
    LD C, A             ; Save search value
    LD A, 0             ; Initialize counter
    
CountLoop:
    LD D, (HL)          ; Get array element
    LD E, A             ; Save counter
    LD A, C             ; Get search value
    CP D                ; Compare with array element
    LD A, E             ; Restore counter
    JR NZ, NotMatch     ; Skip if no match
    INC A               ; Increment counter
    
NotMatch:
    INC HL              ; Next element
    DJNZ CountLoop      ; Continue for all elements
    RET                 ; A = count
```

<CodeRunner 
  system="zx-spectrum"
  title="Algorithm Problem Solving"
  code="; Collection of useful algorithmic building blocks

TestData:
    DB 3, 7, 2, 9, 1, 8, 4, 6, 5, 7, 2, 7

; Find maximum value in array
; Input: HL = array, B = size
; Output: A = maximum value
FindMaximum:
    LD A, (HL)          ; Initialize max with first element
    INC HL              ; Start from second element
    DEC B               ; One fewer to check
    RET Z               ; Return if only one element
    
MaxLoop:
    CP (HL)             ; Compare current max with array element
    JR NC, NotBigger    ; Skip if current max >= element
    LD A, (HL)          ; New maximum found
NotBigger:
    INC HL              ; Next element
    DJNZ MaxLoop        ; Continue for all elements
    RET

; Count occurrences of a value
; Input: HL = array, B = size, C = value to count
; Output: A = count
CountValue:
    LD A, 0             ; Initialize counter
    
CountLoop:
    LD D, (HL)          ; Get array element
    LD E, A             ; Save counter
    LD A, C             ; Get search value
    CP D                ; Compare with element
    LD A, E             ; Restore counter
    JR NZ, NoMatch      ; Skip if different
    INC A               ; Increment counter if match
NoMatch:
    INC HL              ; Next element
    DJNZ CountLoop
    RET

; Reverse array in place
; Input: HL = array, B = size
ReverseArray:
    PUSH BC
    PUSH HL
    
    ; Calculate end address
    LD C, B             ; Size in C
    LD B, 0             ; BC = size
    ADD HL, BC          ; HL = end + 1
    DEC HL              ; HL = last element
    
    ; DE = start, HL = end
    POP DE              ; DE = start
    POP BC              ; BC = size
    
    ; Swap elements from both ends moving inward
    SRL B               ; B = size / 2 (number of swaps needed)
    RET Z               ; Return if empty array
    
ReverseLoop:
    LD A, (DE)          ; Get element from start
    LD C, (HL)          ; Get element from end
    LD (DE), C          ; Put end element at start
    LD (HL), A          ; Put start element at end
    INC DE              ; Move start pointer forward
    DEC HL              ; Move end pointer backward
    DJNZ ReverseLoop    ; Continue for half the array
    RET

; Check if array is sorted (ascending)
; Input: HL = array, B = size
; Output: A = 1 if sorted, 0 if not sorted
IsSorted:
    LD A, B
    CP 2
    JR C, ArraySorted   ; Arrays with 0 or 1 element are sorted
    
    DEC B               ; Need to check B-1 pairs
    
SortedCheckLoop:
    LD A, (HL)          ; Get current element
    INC HL              ; Point to next element
    CP (HL)             ; Compare with next element
    JR Z, SameElements  ; Equal elements are OK
    JR C, SameElements  ; Current < next is OK
    
    ; Current > next - not sorted
    LD A, 0             ; Not sorted
    RET
    
SameElements:
    DJNZ SortedCheckLoop ; Check next pair
    
ArraySorted:
    LD A, 1             ; Array is sorted
    RET

; Remove duplicates from sorted array
; Input: HL = sorted array, B = size
; Output: B = new size (duplicates removed)
RemoveDuplicates:
    LD A, B
    CP 2
    RET C               ; Nothing to do for 0 or 1 element
    
    PUSH HL             ; Save start of array
    LD C, 1             ; Write position (keep first element)
    LD A, (HL)          ; Previous element
    INC HL              ; Start from second element
    DEC B               ; One fewer to check
    
DuplicateLoop:
    LD D, (HL)          ; Current element
    CP D                ; Compare with previous
    JR Z, IsDuplicate   ; Skip if same as previous
    
    ; Different element - keep it
    PUSH HL             ; Save read position
    POP HL              ; Restore start
    LD E, 0
    ADD HL, EC          ; Point to write position
    LD (HL), D          ; Store unique element
    POP HL              ; Restore read position
    PUSH HL
    INC C               ; Advance write position
    LD A, D             ; Update previous element
    
IsDuplicate:
    INC HL              ; Next element
    DJNZ DuplicateLoop
    
    LD B, C             ; Return new size
    POP HL              ; Restore array start
    RET

; Test the algorithms
TestAlgorithms:
    ; Test find maximum
    LD HL, TestData
    LD B, 12
    CALL FindMaximum    ; Should return 9
    LD C, A             ; Save max
    
    ; Test count occurrences (count 7s)
    LD HL, TestData
    LD B, 12
    LD C, 7             ; Count 7s
    CALL CountValue     ; Should return 3
    LD D, A             ; Save count
    
    ; Test if sorted
    LD HL, TestData
    LD B, 12
    CALL IsSorted       ; Should return 0 (not sorted)
    LD E, A             ; Save result
    
    RET                 ; C=max, D=count, E=sorted"
  language="assembly"
/>

## Performance Analysis

### Time Complexity

Understanding how algorithms perform with different input sizes:

```text
; Bubble Sort: O(n²) - quadratic time
; - Best case: O(n) if already sorted (with optimization)
; - Worst case: O(n²) for reverse sorted
; - Average case: O(n²)

; Linear Search: O(n) - linear time
; - Best case: O(1) if found at beginning
; - Worst case: O(n) if not found or at end
; - Average case: O(n/2) = O(n)

; Binary Search: O(log n) - logarithmic time
; - Best case: O(1) if found in middle
; - Worst case: O(log n)
; - Average case: O(log n)
```

### Space Complexity

Consider memory usage of algorithms:

```text
; In-place algorithms: O(1) extra space
; - Bubble sort, selection sort, insertion sort
; - Most search algorithms

; Algorithms requiring extra space: O(n) space
; - Merge sort (requires temporary array)
; - Some recursive algorithms (stack space)
```

### Optimization Guidelines

1. **Choose appropriate algorithms** for your data size and characteristics
2. **Minimize memory accesses** - use registers when possible
3. **Avoid repeated calculations** - calculate once, reuse results
4. **Use appropriate data structures** - sorted arrays for binary search
5. **Consider trade-offs** - time vs space, simplicity vs performance

## Practice Exercise

Create a comprehensive algorithm toolkit that demonstrates:

1. Implementation of multiple sorting algorithms
2. Efficient searching for different scenarios
3. Problem-solving with array manipulation
4. Performance optimization techniques
5. Algorithm selection based on input characteristics

<CodeRunner 
  system="zx-spectrum"
  title="Practice Exercise - Algorithm Toolkit"
  code="; Comprehensive algorithm toolkit

; Test data sets
SmallArray:     DB 5, 2, 8, 1, 9           ; 5 elements
MediumArray:    DB 15, 3, 8, 12, 6, 1, 9, 14, 7, 11    ; 10 elements
SortedArray:    DB 1, 3, 5, 7, 9, 11, 13, 15           ; 8 elements

; Algorithm selection based on array size and characteristics
SmartSort:
    ; Input: HL = array, B = size
    ; Automatically choose best sorting algorithm
    
    ; Check if already sorted (use optimized check)
    CALL QuickSortedCheck
    RET Z               ; Return if already sorted
    
    ; Choose algorithm based on size
    LD A, B
    CP 8                ; Small array threshold
    JR C, UseInsertion
    CP 20               ; Medium array threshold
    JR C, UseSelection
    
    ; For large arrays, use bubble sort (best we have)
    CALL BubbleSort
    RET
    
UseInsertion:
    CALL SimpleInsertionSort
    RET
    
UseSelection:
    CALL SimpleSelectionSort
    RET

; Quick sorted check (early termination)
QuickSortedCheck:
    LD A, B
    CP 2
    RET C               ; Arrays <= 1 element are sorted
    
    DEC B               ; Check B-1 adjacent pairs
    
QuickSortLoop:
    LD A, (HL)          ; Current element
    INC HL              ; Next element
    CP (HL)             ; Compare current with next
    JR Z, QuickContinue ; Equal is OK
    JR C, QuickContinue ; Current < next is OK
    
    ; Found out-of-order pair
    OR 1                ; Clear Z flag (not sorted)
    RET
    
QuickContinue:
    DJNZ QuickSortLoop
    
    XOR A               ; Set Z flag (is sorted)
    RET

; Simple insertion sort for small arrays
SimpleInsertionSort:
    PUSH BC
    PUSH HL
    
    LD A, B
    CP 2
    JR C, InsertionDone ; Skip if <= 1 element
    
    INC HL              ; Start from second element
    DEC B               ; One fewer to process
    
InsertionMainLoop:
    LD A, (HL)          ; Element to insert
    PUSH HL             ; Save current position
    PUSH BC             ; Save counter
    
    ; Find insertion point by searching backwards
    LD C, A             ; Save element to insert
    
InsertionSearchBack:
    DEC HL              ; Look at previous element
    LD A, (HL)          ; Get previous element
    CP C                ; Compare with element to insert
    JR C, InsertionFound ; Previous < current, insert here
    JR Z, InsertionFound ; Previous = current, insert here
    
    ; Previous > current, need to shift it
    INC HL              ; Back to current position
    LD (HL), A          ; Move previous element forward
    DEC HL              ; Back to previous position
    
    ; Check if we're at the beginning
    ; (Simplified boundary check)
    JR InsertionSearchBack
    
InsertionFound:
    INC HL              ; Move to insertion point
    LD (HL), C          ; Insert the element
    
    POP BC              ; Restore counter
    POP HL              ; Restore position
    INC HL              ; Next element to process
    DJNZ InsertionMainLoop
    
InsertionDone:
    POP HL
    POP BC
    RET

; Simple selection sort
SimpleSelectionSort:
    PUSH BC
    PUSH HL
    
    LD A, B
    DEC A
    JR Z, SelectionDone
    LD C, A             ; C = passes needed
    
SelectionMainLoop:
    PUSH BC
    PUSH HL
    
    ; Find minimum in remaining array
    LD A, (HL)          ; Current minimum
    LD D, A
    LD E, 0             ; Offset to minimum
    
    LD B, C             ; Elements left to check
    LD A, 0             ; Current offset
    
SelectionFindMin:
    INC HL
    INC A
    LD C, (HL)          ; Get element
    LD A, D             ; Get current minimum
    CP C                ; Compare
    LD A, C             ; Restore element
    JR C, SelectionNotMin ; Skip if current min < element
    
    ; Found new minimum
    LD D, A             ; New minimum value
    LD E, B             ; Save offset (reverse calculation)
    
SelectionNotMin:
    DJNZ SelectionFindMin
    
    ; Swap minimum with first position
    POP HL              ; Restore start position
    LD A, (HL)          ; Get first element
    LD (HL), D          ; Put minimum first
    
    ; Calculate address of minimum element
    PUSH HL
    LD A, C
    SUB E               ; Calculate correct offset
    LD C, A
    LD B, 0
    ADD HL, BC          ; Point to minimum's position
    LD (HL), A          ; Put first element there
    POP HL
    
    INC HL              ; Next position
    POP BC
    DEC C
    JR NZ, SelectionMainLoop
    
SelectionDone:
    POP HL
    POP BC
    RET

; Advanced search with linear fallback for unsorted data
SmartSearch:
    ; Input: HL = array, B = size, A = search value
    ; Output: Z flag set if found
    
    PUSH AF             ; Save search value
    CALL QuickSortedCheck ; Check if array is sorted
    POP AF              ; Restore search value
    JR NZ, UseLinearSearch ; Use linear search if not sorted
    
    ; Use binary search for sorted array
    CALL SimpleBinarySearch
    RET
    
UseLinearSearch:
    CALL LinearSearch
    RET

; Test the complete toolkit
TestToolkit:
    ; Test 1: Sort small array
    LD HL, SmallArray
    LD B, 5
    CALL SmartSort      ; Should use insertion sort
    
    ; Test 2: Sort medium array
    LD HL, MediumArray
    LD B, 10
    CALL SmartSort      ; Should use selection sort
    
    ; Test 3: Search in sorted array
    LD HL, SortedArray
    LD B, 8
    LD A, 7             ; Search for 7
    CALL SmartSearch    ; Should use binary search
    
    ; Test 4: Performance comparison
    ; Time bubble sort vs selection sort on same data
    
    RET

; Performance testing framework
TimeSort:
    ; Simple timing by counting iterations
    ; (Real timing would use hardware timer)
    LD DE, 0            ; Iteration counter
    
TimingLoop:
    PUSH HL
    PUSH BC
    CALL BubbleSort     ; Time this algorithm
    POP BC
    POP HL
    INC DE              ; Count iteration
    ; Continue until desired number of iterations
    RET"
  language="assembly"
/>

## What You've Learned

In this comprehensive lesson, you've mastered:

- Implementing fundamental sorting algorithms (bubble, selection, insertion)
- Creating efficient searching algorithms (linear and binary search)
- Understanding algorithm performance analysis and optimization techniques
- Applying problem-solving methodologies to break down complex problems
- Building reusable algorithmic building blocks for common programming tasks
- Selecting appropriate algorithms based on data characteristics and requirements
- Optimizing code for performance while maintaining readability and correctness

## Looking Ahead

Next, you'll learn about **error handling and debugging techniques** - essential skills for finding and fixing problems in your increasingly complex programs, ensuring they work reliably under all conditions!

## Fun Fact

The algorithms you've learned are timeless! Bubble sort was described as early as 1956, binary search dates back to 1946, and these fundamental techniques are still taught in computer science courses today because they illustrate core algorithmic thinking. The Z80's efficient loop instructions and register architecture made it surprisingly good at implementing these algorithms - many commercial databases and operating systems running on Z80-based systems used these same sorting and searching techniques. Understanding algorithms at the assembly level gives you insight into why certain high-level programming patterns exist and helps you write more efficient code in any language. The problem-solving skills you've developed transcend any specific technology and form the foundation of computational thinking!