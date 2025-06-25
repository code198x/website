---
title: "Section 1 Integration Project"
system: "commodore-amiga"
phase_number: 1
tier_number: 1
lesson_number: 8
description: "Integrate all Section 1 skills in a comprehensive Amiga data processing system. Build a complete application using 68000 registers, addressing, arithmetic, and control flow."
learning_objectives:
  - "Integrate 68000 registers and memory management techniques"
  - "Apply addressing modes and data manipulation skills"
  - "Combine arithmetic, logical, and bit manipulation operations"
  - "Implement sophisticated program flow control"
  - "Build a complete, working Amiga application"
concepts:
  - "Comprehensive 68000 programming integration"
  - "Data structure design and manipulation"
  - "Algorithm implementation using 68000 capabilities"
  - "Performance optimization and code organization"
  - "Real-world Amiga programming patterns"
estimated_duration: "90-120 minutes"
difficulty: "medium"
code_examples: true
practical_exercise: true
order: 8
---

# Lesson 8: Section 1 Integration Project

Congratulations on completing the fundamentals of 68000 assembly programming! You've learned about registers, addressing modes, arithmetic operations, bit manipulation, and program flow control. Now it's time to integrate all these skills into a comprehensive project that demonstrates the power and elegance of 68000 programming on the Amiga.

## Section 1 Skills Review

Over the past 7 lessons, you've mastered the essential foundations of 68000 programming:

### Lesson 1: 68000 Introduction
- Understanding the 68000's 32-bit architecture and capabilities
- Recognising the processor's advantages over 8-bit systems
- Learning about the Amiga's sophisticated hardware platform

### Lesson 2: Registers and Memory
- Working with 8 data registers (D0-D7) and 8 address registers (A0-A7)
- Managing byte (.B), word (.W), and long (.L) data sizes
- Using the powerful MOVE instruction for data transfer

### Lesson 3: Addressing Modes
- Leveraging 14 sophisticated addressing modes
- Using indirect addressing with automatic increment/decrement
- Implementing indexed and displaced addressing for structures

### Lesson 4: Status Register and Condition Codes
- Understanding the comprehensive condition code system
- Using conditional branches for intelligent program control
- Implementing compare and test operations

### Lesson 5: Arithmetic Operations
- Performing addition, subtraction with multiple data sizes
- Using native multiplication and division instructions
- Implementing multi-precision arithmetic with extend flag

### Lesson 6: Bit Manipulation
- Applying logical operations (AND, OR, EOR, NOT)
- Using bit test and modify instructions (BTST, BSET, BCLR, BCHG)
- Implementing shift and rotate operations for data manipulation

### Lesson 7: Program Flow Control
- Creating conditional branches with comprehensive Bcc instructions
- Building efficient loops using DBRA and other techniques
- Implementing subroutines and jump tables for structured programming

## Project Overview: Amiga Data Analysis System

Your integration project will be a comprehensive **Data Analysis System** that processes multiple types of data using all the 68000 techniques you've learned. This system will:

1. **Process Employee Records** - Demonstrate structure manipulation and data organisation
2. **Perform Statistical Analysis** - Use arithmetic operations for mathematical calculations
3. **Generate Reports** - Apply bit manipulation for formatting and display
4. **Sort and Search Data** - Implement algorithms using addressing modes and flow control
5. **Validate Data Integrity** - Use condition codes for error checking and validation

This project showcases real-world programming patterns that were commonly used in professional Amiga software development.

**Complete Amiga Data Analysis System:**

```assembly
; Section 1 Integration Project: Amiga Data Analysis System
; Demonstrates comprehensive 68000 programming techniques
; Integrates all skills from lessons 1-7

; === SYSTEM ENTRY POINT ===
DataAnalysisSystem:
    ; Initialize the analysis system
    JSR     InitializeSystem
    
    ; Load and validate employee data
    JSR     LoadEmployeeData
    
    ; Perform data analysis operations
    JSR     AnalyzeEmployeeData
    
    ; Sort employees by salary
    JSR     SortEmployeesBySalary
    
    ; Search for specific employees
    JSR     SearchEmployeeDatabase
    
    ; Generate statistical reports
    JSR     GenerateStatisticalReports
    
    ; Calculate payroll information
    JSR     CalculatePayrollData
    
    ; Generate formatted output
    JSR     GenerateFormattedReports
    
    ; Validate data integrity
    JSR     ValidateDataIntegrity
    
    ; System shutdown
    JSR     ShutdownSystem
    
    RTS

; === SYSTEM INITIALIZATION ===
InitializeSystem:
    ; Clear all data registers for clean start
    MOVEQ   #0, D0
    MOVEQ   #0, D1
    MOVEQ   #0, D2
    MOVEQ   #0, D3
    MOVEQ   #0, D4
    MOVEQ   #0, D5
    MOVEQ   #0, D6
    MOVEQ   #0, D7
    
    ; Set up address registers for data processing
    MOVE.L  #EmployeeDatabase, A0    ; Employee data base
    MOVE.L  #StatisticsBuffer, A1    ; Statistics storage
    MOVE.L  #ReportBuffer, A2        ; Report generation area
    MOVE.L  #WorkingMemory, A3       ; Temporary calculations
    MOVE.L  #SortedIndices, A4       ; Sorted index array
    MOVE.L  #ValidationResults, A5   ; Validation storage
    
    ; Initialize system counters and flags
    CLR.L   TotalEmployees
    CLR.L   ProcessingErrors
    CLR.L   SystemFlags
    
    ; Set system status
    BSET    #SYS_INITIALIZED, SystemFlags
    
    RTS

; === EMPLOYEE DATA LOADING ===
LoadEmployeeData:
    ; Load employee records using sophisticated addressing
    MOVE.L  #EmployeeRawData, A6     ; Source data
    MOVE.L  A0, A7                  ; Destination (employee database)
    MOVE.L  #0, D7                  ; Employee counter
    
LoadEmployeeLoop:
    ; Check for end of data marker
    CMP.L   #END_OF_DATA, (A6)
    BEQ     LoadEmployeeComplete
    
    ; Load employee ID using postincrement addressing
    MOVE.L  (A6)+, EMP_ID(A7)       ; Employee ID
    
    ; Load salary using word operations
    MOVE.W  (A6)+, EMP_SALARY(A7)   ; Annual salary (word)
    
    ; Load department using byte operations
    MOVE.B  (A6)+, EMP_DEPT(A7)     ; Department code (byte)
    
    ; Load years of service
    MOVE.B  (A6)+, EMP_YEARS(A7)    ; Years of service
    
    ; Load performance rating (0-100)
    MOVE.B  (A6)+, EMP_RATING(A7)   ; Performance rating
    
    ; Load employee flags (bit-packed data)
    MOVE.B  (A6)+, EMP_FLAGS(A7)    ; Status flags
    
    ; Validate loaded data using bit operations
    JSR     ValidateEmployeeRecord
    
    ; Advance to next employee record
    LEA     EMP_RECORD_SIZE(A7), A7
    ADDQ.L  #1, D7                  ; Increment employee count
    
    ; Check maximum employees limit
    CMP.L   #MAX_EMPLOYEES, D7
    BLT     LoadEmployeeLoop        ; Continue if under limit
    
LoadEmployeeComplete:
    MOVE.L  D7, TotalEmployees      ; Store total count
    RTS

; === DATA ANALYSIS OPERATIONS ===
AnalyzeEmployeeData:
    ; Perform comprehensive analysis using arithmetic operations
    MOVE.L  A0, A6                  ; Employee database pointer
    MOVE.L  TotalEmployees, D7      ; Employee count
    SUBQ.L  #1, D7                  ; Adjust for DBRA
    
    ; Initialize analysis variables
    CLR.L   TotalSalarySum          ; Sum of all salaries
    CLR.L   HighestSalary           ; Maximum salary found
    CLR.L   LowestSalary            ; Minimum salary found
    MOVE.L  #$FFFF, LowestSalary    ; Initialize to maximum value
    CLR.L   DepartmentCounts        ; Clear department counters
    CLR.L   AverageYearsService     ; Average years calculation
    CLR.L   PerformanceSum          ; Performance rating sum
    
AnalysisLoop:
    ; Load employee salary for processing
    MOVE.W  EMP_SALARY(A6), D0      ; Load salary (word)
    EXT.L   D0                      ; Extend to long for calculations
    
    ; Add to total salary sum using arithmetic operations
    ADD.L   D0, TotalSalarySum      ; Running total
    
    ; Check for highest salary using comparison
    CMP.L   HighestSalary, D0       ; Compare with current highest
    BLE     CheckLowestSalary       ; Branch if not higher
    MOVE.L  D0, HighestSalary       ; Update highest salary
    
CheckLowestSalary:
    ; Check for lowest salary
    CMP.L   LowestSalary, D0        ; Compare with current lowest
    BGE     ProcessDepartment       ; Branch if not lower
    MOVE.L  D0, LowestSalary        ; Update lowest salary
    
ProcessDepartment:
    ; Count employees by department using bit manipulation
    MOVE.B  EMP_DEPT(A6), D1        ; Load department code
    AND.L   #$0F, D1                ; Mask to valid range (0-15)
    
    ; Increment department counter using indexed addressing
    LEA     DepartmentCounts, A5    ; Department counter array
    LSL.L   #2, D1                  ; Multiply by 4 (long size)
    ADDQ.L  #1, 0(A5,D1.L)          ; Increment specific department
    
    ; Process years of service
    MOVE.B  EMP_YEARS(A6), D2       ; Load years of service
    AND.L   #$FF, D2                ; Clear upper bits
    ADD.L   D2, AverageYearsService ; Add to running total
    
    ; Process performance rating
    MOVE.B  EMP_RATING(A6), D3      ; Load performance rating
    AND.L   #$FF, D3                ; Clear upper bits
    ADD.L   D3, PerformanceSum      ; Add to performance total
    
    ; Check employee status flags using bit testing
    MOVE.B  EMP_FLAGS(A6), D4       ; Load status flags
    BTST    #EMP_ACTIVE, D4         ; Test if employee is active
    BEQ     SkipActiveAnalysis      ; Skip if not active
    
    ; Process active employee specific analysis
    BTST    #EMP_FULLTIME, D4       ; Test if full-time
    BEQ     AnalyzePartTime         ; Branch if part-time
    
    ; Full-time employee processing
    ADDQ.L  #1, FullTimeCount       ; Increment full-time counter
    BRA     NextAnalysisEmployee
    
AnalyzePartTime:
    ; Part-time employee processing
    ADDQ.L  #1, PartTimeCount       ; Increment part-time counter
    BRA     NextAnalysisEmployee
    
SkipActiveAnalysis:
    ; Inactive employee processing
    ADDQ.L  #1, InactiveCount       ; Increment inactive counter
    
NextAnalysisEmployee:
    ; Move to next employee record
    LEA     EMP_RECORD_SIZE(A6), A6
    DBRA    D7, AnalysisLoop        ; Continue for all employees
    
    ; Calculate final averages using division
    MOVE.L  TotalEmployees, D0      ; Total employee count
    BEQ     AnalysisComplete        ; Skip if no employees
    
    ; Calculate average salary
    MOVE.L  TotalSalarySum, D1      ; Total salary sum
    DIVU.W  D0, D1                  ; Divide by employee count
    MOVE.W  D1, AverageSalary       ; Store average salary
    
    ; Calculate average years of service
    MOVE.L  AverageYearsService, D2 ; Years service sum
    DIVU.W  D0, D2                  ; Divide by employee count
    MOVE.B  D2, AverageYears        ; Store average years
    
    ; Calculate average performance rating
    MOVE.L  PerformanceSum, D3      ; Performance sum
    DIVU.W  D0, D3                  ; Divide by employee count
    MOVE.B  D3, AveragePerformance  ; Store average performance
    
AnalysisComplete:
    RTS

; === EMPLOYEE SORTING ALGORITHM ===
SortEmployeesBySalary:
    ; Implement bubble sort using addressing modes and flow control
    MOVE.L  TotalEmployees, D6      ; Outer loop counter
    SUBQ.L  #1, D6                  ; Adjust for comparison
    BLE     SortComplete            ; Skip if 0 or 1 employees
    
SortOuterLoop:
    MOVE.L  #0, D5                  ; Swap flag (0 = no swaps)
    MOVE.L  A0, A6                  ; Reset to database start
    MOVE.L  TotalEmployees, D7      ; Inner loop counter
    SUB.L   D6, D7                  ; Adjust for outer loop
    SUBQ.L  #1, D7                  ; Adjust for DBRA
    
SortInnerLoop:
    ; Compare adjacent employee salaries
    MOVE.W  EMP_SALARY(A6), D0      ; Current employee salary
    MOVE.W  EMP_SALARY+EMP_RECORD_SIZE(A6), D1 ; Next employee salary
    
    ; Use signed comparison for salary values
    CMP.W   D1, D0                  ; Compare salaries
    BLE     NoSwapNeeded            ; Branch if in correct order
    
    ; Swap employee records using register operations
    JSR     SwapEmployeeRecords     ; Swap current and next records
    MOVE.L  #1, D5                  ; Set swap flag
    
NoSwapNeeded:
    ; Move to next comparison pair
    LEA     EMP_RECORD_SIZE(A6), A6 ; Advance to next employee
    DBRA    D7, SortInnerLoop       ; Continue inner loop
    
    ; Check if any swaps occurred
    TST.L   D5                      ; Test swap flag
    BEQ     SortComplete            ; Exit if no swaps (sorted)
    
    DBRA    D6, SortOuterLoop       ; Continue outer loop
    
SortComplete:
    ; Set sorted flag using bit operations
    BSET    #DATA_SORTED, SystemFlags
    RTS

; === RECORD SWAPPING SUBROUTINE ===
SwapEmployeeRecords:
    ; Swap two adjacent employee records efficiently
    ; Input: A6 points to first record
    MOVEM.L D0-D3, -(A7)            ; Save registers
    
    ; Swap using long operations for efficiency
    MOVE.L  EMP_ID(A6), D0          ; Load first record ID
    MOVE.L  EMP_ID+EMP_RECORD_SIZE(A6), D1 ; Load second record ID
    MOVE.L  D1, EMP_ID(A6)          ; Store second ID in first position
    MOVE.L  D0, EMP_ID+EMP_RECORD_SIZE(A6) ; Store first ID in second position
    
    ; Swap salary and other word/byte fields
    MOVE.L  EMP_SALARY(A6), D2      ; Load first record salary+dept+years+rating
    MOVE.L  EMP_SALARY+EMP_RECORD_SIZE(A6), D3 ; Load second record fields
    MOVE.L  D3, EMP_SALARY(A6)      ; Store to first record
    MOVE.L  D2, EMP_SALARY+EMP_RECORD_SIZE(A6) ; Store to second record
    
    MOVEM.L (A7)+, D0-D3            ; Restore registers
    RTS

; === DATABASE SEARCH OPERATIONS ===
SearchEmployeeDatabase:
    ; Implement binary search for employee ID (requires sorted data)
    ; Linear search for other criteria
    
    ; Search for employee with specific ID
    MOVE.L  #SEARCH_EMPLOYEE_ID, D6 ; ID to search for
    JSR     BinarySearchByID        ; Perform binary search
    MOVE.L  D0, SearchResultID      ; Store search result
    
    ; Search for employees in specific department
    MOVE.B  #SEARCH_DEPARTMENT, D6  ; Department to search for
    JSR     LinearSearchByDepartment ; Perform linear search
    MOVE.L  D0, SearchResultDept    ; Store department search result
    
    ; Search for high-performance employees
    MOVE.B  #MIN_PERFORMANCE_RATING, D6 ; Minimum rating threshold
    JSR     SearchHighPerformers    ; Find high performers
    MOVE.L  D0, HighPerformerCount  ; Store count
    
    RTS

; === BINARY SEARCH IMPLEMENTATION ===
BinarySearchByID:
    ; Binary search for employee ID (assumes sorted by ID)
    ; Input: D6 = employee ID to find
    ; Output: D0 = index if found, -1 if not found
    
    MOVE.L  #0, D0                  ; Low index
    MOVE.L  TotalEmployees, D1      ; High index
    SUBQ.L  #1, D1                  ; Adjust for 0-based indexing
    
BinarySearchLoop:
    CMP.L   D1, D0                  ; Compare low with high
    BGT     BinarySearchNotFound    ; Exit if low > high
    
    ; Calculate middle index
    MOVE.L  D0, D2                  ; Copy low
    ADD.L   D1, D2                  ; Add high
    LSR.L   #1, D2                  ; Divide by 2 (middle)
    
    ; Calculate employee record address
    MOVE.L  D2, D3                  ; Copy middle index
    MULU.W  #EMP_RECORD_SIZE, D3    ; Multiply by record size
    LEA     0(A0,D3.L), A6          ; Calculate record address
    
    ; Compare with target ID
    MOVE.L  EMP_ID(A6), D4          ; Load employee ID
    CMP.L   D6, D4                  ; Compare with search target
    BEQ     BinarySearchFound       ; Found exact match
    BLT     BinarySearchUpper       ; Search upper half
    
    ; Search lower half
    MOVE.L  D2, D1                  ; Set high = middle - 1
    SUBQ.L  #1, D1
    BRA     BinarySearchLoop
    
BinarySearchUpper:
    ; Search upper half
    MOVE.L  D2, D0                  ; Set low = middle + 1
    ADDQ.L  #1, D0
    BRA     BinarySearchLoop
    
BinarySearchFound:
    MOVE.L  D2, D0                  ; Return found index
    RTS
    
BinarySearchNotFound:
    MOVEQ   #-1, D0                 ; Return not found
    RTS

; === LINEAR SEARCH IMPLEMENTATION ===
LinearSearchByDepartment:
    ; Linear search for employees in specific department
    ; Input: D6 = department code
    ; Output: D0 = count of employees found
    
    MOVE.L  A0, A6                  ; Employee database pointer
    MOVE.L  TotalEmployees, D7      ; Employee count
    SUBQ.L  #1, D7                  ; Adjust for DBRA
    MOVE.L  #0, D0                  ; Found counter
    
LinearSearchLoop:
    ; Check employee department
    MOVE.B  EMP_DEPT(A6), D1        ; Load department code
    CMP.B   D6, D1                  ; Compare with search target
    BNE     LinearSearchNext        ; Skip if not matching
    
    ; Found matching employee
    ADDQ.L  #1, D0                  ; Increment found counter
    
    ; Store employee index for reporting
    MOVE.L  TotalEmployees, D2      ; Calculate current index
    SUB.L   D7, D2                  ; Current position
    SUBQ.L  #1, D2                  ; Adjust for 0-based
    
    ; Could store index in results array here
    
LinearSearchNext:
    LEA     EMP_RECORD_SIZE(A6), A6 ; Move to next employee
    DBRA    D7, LinearSearchLoop    ; Continue search
    
    RTS

; === HIGH PERFORMER SEARCH ===
SearchHighPerformers:
    ; Search for employees with high performance ratings
    ; Input: D6 = minimum performance rating
    ; Output: D0 = count of high performers
    
    MOVE.L  A0, A6                  ; Employee database pointer
    MOVE.L  TotalEmployees, D7      ; Employee count
    SUBQ.L  #1, D7                  ; Adjust for DBRA
    MOVE.L  #0, D0                  ; High performer counter
    
HighPerformerLoop:
    ; Check performance rating
    MOVE.B  EMP_RATING(A6), D1      ; Load performance rating
    CMP.B   D6, D1                  ; Compare with threshold
    BLT     HighPerformerNext       ; Skip if below threshold
    
    ; Check if employee is active using bit testing
    MOVE.B  EMP_FLAGS(A6), D2       ; Load employee flags
    BTST    #EMP_ACTIVE, D2         ; Test active flag
    BEQ     HighPerformerNext       ; Skip if not active
    
    ; Found high performer
    ADDQ.L  #1, D0                  ; Increment counter
    
HighPerformerNext:
    LEA     EMP_RECORD_SIZE(A6), A6 ; Move to next employee
    DBRA    D7, HighPerformerLoop   ; Continue search
    
    RTS

; === STATISTICAL REPORT GENERATION ===
GenerateStatisticalReports:
    ; Generate comprehensive statistical reports
    MOVE.L  A1, A6                  ; Statistics buffer pointer
    
    ; Store basic statistics using efficient data movement
    MOVE.L  TotalEmployees, (A6)+   ; Total employee count
    MOVE.L  TotalSalarySum, (A6)+   ; Total salary sum
    MOVE.W  AverageSalary, (A6)+    ; Average salary
    MOVE.L  HighestSalary, (A6)+    ; Highest salary
    MOVE.L  LowestSalary, (A6)+     ; Lowest salary
    
    ; Store department statistics
    MOVE.L  #15, D7                 ; Department counter (0-15)
    LEA     DepartmentCounts, A5    ; Department count array
    
DepartmentStatsLoop:
    MOVE.L  (A5)+, (A6)+            ; Copy department count
    DBRA    D7, DepartmentStatsLoop ; Continue for all departments
    
    ; Store employee classification counts
    MOVE.L  FullTimeCount, (A6)+    ; Full-time employees
    MOVE.L  PartTimeCount, (A6)+    ; Part-time employees
    MOVE.L  InactiveCount, (A6)+    ; Inactive employees
    
    ; Calculate and store percentages using arithmetic
    MOVE.L  TotalEmployees, D0      ; Total for percentage calculations
    BEQ     StatsComplete           ; Skip if no employees
    
    ; Calculate full-time percentage
    MOVE.L  FullTimeCount, D1       ; Full-time count
    MULU.W  #100, D1                ; Multiply by 100
    DIVU.W  D0, D1                  ; Divide by total
    MOVE.W  D1, (A6)+               ; Store percentage
    
    ; Calculate part-time percentage
    MOVE.L  PartTimeCount, D2       ; Part-time count
    MULU.W  #100, D2                ; Multiply by 100
    DIVU.W  D0, D2                  ; Divide by total
    MOVE.W  D2, (A6)+               ; Store percentage
    
StatsComplete:
    ; Set statistics generated flag
    BSET    #STATS_GENERATED, SystemFlags
    RTS

; === PAYROLL CALCULATIONS ===
CalculatePayrollData:
    ; Calculate comprehensive payroll information
    MOVE.L  A0, A6                  ; Employee database pointer
    MOVE.L  TotalEmployees, D7      ; Employee count
    SUBQ.L  #1, D7                  ; Adjust for DBRA
    
    ; Initialize payroll totals
    CLR.L   TotalGrossPay           ; Total gross payroll
    CLR.L   TotalTaxWithheld        ; Total tax withholdings
    CLR.L   TotalNetPay             ; Total net pay
    CLR.L   TotalBonus              ; Total bonus payments
    
PayrollLoop:
    ; Check if employee is active
    MOVE.B  EMP_FLAGS(A6), D0       ; Load employee flags
    BTST    #EMP_ACTIVE, D0         ; Test active flag
    BEQ     NextPayrollEmployee     ; Skip if not active
    
    ; Calculate gross pay based on salary and employment type
    MOVE.W  EMP_SALARY(A6), D1      ; Load annual salary
    EXT.L   D1                      ; Extend to long
    
    ; Check if full-time or part-time
    BTST    #EMP_FULLTIME, D0       ; Test full-time flag
    BNE     CalculateFullTimePay    ; Branch if full-time
    
    ; Part-time calculation (assume 50% of full-time)
    LSR.L   #1, D1                  ; Divide by 2
    BRA     CalculateTaxes
    
CalculateFullTimePay:
    ; Full-time gets full salary
    ; D1 already contains full salary
    
CalculateTaxes:
    ; Add to gross pay total
    ADD.L   D1, TotalGrossPay       ; Add to total gross
    
    ; Calculate tax withholding (simplified 20% rate)
    MOVE.L  D1, D2                  ; Copy gross pay
    MULU.W  #20, D2                 ; Multiply by 20
    DIVU.W  #100, D2                ; Divide by 100 (20%)
    ADD.L   D2, TotalTaxWithheld    ; Add to total tax
    
    ; Calculate net pay
    SUB.L   D2, D1                  ; Subtract tax from gross
    ADD.L   D1, TotalNetPay         ; Add to total net
    
    ; Calculate performance bonus
    MOVE.B  EMP_RATING(A6), D3      ; Load performance rating
    CMP.B   #BONUS_THRESHOLD, D3    ; Compare with bonus threshold
    BLT     NextPayrollEmployee     ; Skip bonus if below threshold
    
    ; Calculate bonus (5% of salary for high performers)
    MOVE.W  EMP_SALARY(A6), D4      ; Load salary again
    EXT.L   D4                      ; Extend to long
    MULU.W  #5, D4                  ; Multiply by 5
    DIVU.W  #100, D4                ; Divide by 100 (5%)
    ADD.L   D4, TotalBonus          ; Add to total bonus
    
NextPayrollEmployee:
    LEA     EMP_RECORD_SIZE(A6), A6 ; Move to next employee
    DBRA    D7, PayrollLoop         ; Continue for all employees
    
    ; Set payroll calculated flag
    BSET    #PAYROLL_CALCULATED, SystemFlags
    RTS

; === FORMATTED REPORT GENERATION ===
GenerateFormattedReports:
    ; Generate human-readable reports using bit manipulation for formatting
    MOVE.L  A2, A6                  ; Report buffer pointer
    
    ; Generate header using character manipulation
    LEA     ReportHeader, A5        ; Report header string
    JSR     CopyStringToBuffer      ; Copy header to buffer
    
    ; Generate employee summary section
    LEA     EmployeeSummaryHeader, A5 ; Summary header
    JSR     CopyStringToBuffer      ; Copy to buffer
    
    ; Format total employees count
    MOVE.L  TotalEmployees, D0      ; Load employee count
    JSR     FormatNumberToBuffer    ; Convert to formatted string
    
    ; Format average salary
    MOVE.W  AverageSalary, D0       ; Load average salary
    EXT.L   D0                      ; Extend to long
    JSR     FormatCurrencyToBuffer  ; Convert to currency format
    
    ; Generate department breakdown
    LEA     DepartmentHeader, A5    ; Department header
    JSR     CopyStringToBuffer      ; Copy to buffer
    
    MOVE.L  #15, D7                 ; Department counter
    LEA     DepartmentCounts, A5    ; Department counts
    
DepartmentReportLoop:
    MOVE.L  (A5)+, D0               ; Load department count
    JSR     FormatNumberToBuffer    ; Format count
    DBRA    D7, DepartmentReportLoop ; Continue for all departments
    
    ; Generate payroll summary
    LEA     PayrollHeader, A5       ; Payroll header
    JSR     CopyStringToBuffer      ; Copy to buffer
    
    MOVE.L  TotalGrossPay, D0       ; Load gross pay total
    JSR     FormatCurrencyToBuffer  ; Format as currency
    
    MOVE.L  TotalNetPay, D0         ; Load net pay total
    JSR     FormatCurrencyToBuffer  ; Format as currency
    
    ; Set report generated flag
    BSET    #REPORTS_GENERATED, SystemFlags
    RTS

; === STRING AND NUMBER FORMATTING SUBROUTINES ===
CopyStringToBuffer:
    ; Copy null-terminated string to report buffer
    ; Input: A5 = source string, A6 = destination buffer
    
CopyStringLoop:
    MOVE.B  (A5)+, D0               ; Load character
    BEQ     CopyStringDone          ; Exit if null terminator
    MOVE.B  D0, (A6)+               ; Store character
    BRA     CopyStringLoop          ; Continue copying
    
CopyStringDone:
    MOVE.B  #$0A, (A6)+             ; Add newline
    RTS

FormatNumberToBuffer:
    ; Convert number to decimal string representation
    ; Input: D0 = number to format, A6 = destination buffer
    ; This is a simplified implementation
    
    MOVE.L  #10, D1                 ; Division base
    MOVE.L  A6, A5                  ; Save buffer start
    
    ; Handle zero special case
    TST.L   D0                      ; Test if zero
    BNE     FormatNumberConvert     ; Branch if non-zero
    MOVE.B  #'0', (A6)+             ; Store '0'
    MOVE.B  #' ', (A6)+             ; Add space
    RTS
    
FormatNumberConvert:
    ; Convert digits (simplified for demonstration)
    ; Real implementation would use division to extract digits
    MOVE.B  #'*', (A6)+             ; Placeholder for formatted number
    MOVE.B  #'*', (A6)+             ; (Real implementation would format properly)
    MOVE.B  #' ', (A6)+             ; Add space
    RTS

FormatCurrencyToBuffer:
    ; Format number as currency with currency symbol
    ; Input: D0 = amount, A6 = destination buffer
    
    MOVE.B  #'£', (A6)+             ; Add currency symbol
    JSR     FormatNumberToBuffer    ; Format the number
    RTS

; === DATA INTEGRITY VALIDATION ===
ValidateDataIntegrity:
    ; Comprehensive data validation using bit operations and comparisons
    MOVE.L  A0, A6                  ; Employee database pointer
    MOVE.L  TotalEmployees, D7      ; Employee count
    SUBQ.L  #1, D7                  ; Adjust for DBRA
    MOVE.L  #0, D6                  ; Error counter
    
ValidationLoop:
    ; Validate employee ID (must be non-zero)
    TST.L   EMP_ID(A6)              ; Test employee ID
    BNE     ValidateSalary          ; Continue if valid
    ADDQ.L  #1, D6                  ; Increment error count
    
ValidateSalary:
    ; Validate salary range
    MOVE.W  EMP_SALARY(A6), D0      ; Load salary
    CMP.W   #MIN_SALARY, D0         ; Check minimum
    BLT     SalaryError             ; Branch if too low
    CMP.W   #MAX_SALARY, D0         ; Check maximum
    BLE     ValidateDepartment      ; Continue if valid
    
SalaryError:
    ADDQ.L  #1, D6                  ; Increment error count
    
ValidateDepartment:
    ; Validate department code
    MOVE.B  EMP_DEPT(A6), D1        ; Load department
    CMP.B   #MAX_DEPARTMENT, D1     ; Check valid range
    BLE     ValidateRating          ; Continue if valid
    ADDQ.L  #1, D6                  ; Increment error count
    
ValidateRating:
    ; Validate performance rating (0-100)
    MOVE.B  EMP_RATING(A6), D2      ; Load rating
    CMP.B   #100, D2                ; Check maximum
    BLE     ValidateFlags           ; Continue if valid
    ADDQ.L  #1, D6                  ; Increment error count
    
ValidateFlags:
    ; Validate flag consistency
    MOVE.B  EMP_FLAGS(A6), D3       ; Load flags
    BTST    #EMP_ACTIVE, D3         ; Test active flag
    BEQ     ValidationNext          ; Skip if inactive
    
    ; Active employee must have valid department
    TST.B   EMP_DEPT(A6)            ; Test department
    BNE     ValidationNext          ; Continue if valid
    ADDQ.L  #1, D6                  ; Increment error count
    
ValidationNext:
    LEA     EMP_RECORD_SIZE(A6), A6 ; Move to next employee
    DBRA    D7, ValidationLoop      ; Continue validation
    
    ; Store validation results
    MOVE.L  D6, ProcessingErrors    ; Store error count
    
    ; Set validation complete flag
    BSET    #VALIDATION_COMPLETE, SystemFlags
    RTS

; === INDIVIDUAL RECORD VALIDATION ===
ValidateEmployeeRecord:
    ; Validate individual employee record during loading
    ; Input: A7 = employee record address
    ; Uses bit operations for flag checking
    
    ; Check for required fields
    TST.L   EMP_ID(A7)              ; Employee ID must be non-zero
    BEQ     RecordValidationError   ; Error if zero
    
    ; Validate salary is reasonable
    MOVE.W  EMP_SALARY(A7), D0      ; Load salary
    CMP.W   #MIN_SALARY, D0         ; Check minimum salary
    BLT     RecordValidationError   ; Error if too low
    
    ; Validate years of service
    MOVE.B  EMP_YEARS(A7), D1       ; Load years
    CMP.B   #MAX_YEARS_SERVICE, D1  ; Check reasonable maximum
    BGT     RecordValidationError   ; Error if excessive
    
    ; Record is valid
    RTS
    
RecordValidationError:
    ; Handle validation error
    ADDQ.L  #1, ProcessingErrors    ; Increment error count
    RTS

; === SYSTEM SHUTDOWN ===
ShutdownSystem:
    ; Clean shutdown with status reporting
    
    ; Check if all operations completed successfully
    BTST    #VALIDATION_COMPLETE, SystemFlags
    BEQ     ShutdownError           ; Error if validation incomplete
    
    BTST    #STATS_GENERATED, SystemFlags
    BEQ     ShutdownError           ; Error if stats not generated
    
    BTST    #REPORTS_GENERATED, SystemFlags
    BEQ     ShutdownError           ; Error if reports not generated
    
    ; Successful shutdown
    BSET    #SYSTEM_SHUTDOWN_OK, SystemFlags
    RTS
    
ShutdownError:
    ; Error during shutdown
    BSET    #SYSTEM_SHUTDOWN_ERROR, SystemFlags
    RTS

; === CONSTANTS AND DEFINITIONS ===

; Employee record structure offsets
EMP_ID              EQU     0       ; Employee ID (long)
EMP_SALARY          EQU     4       ; Annual salary (word)
EMP_DEPT            EQU     6       ; Department code (byte)
EMP_YEARS           EQU     7       ; Years of service (byte)
EMP_RATING          EQU     8       ; Performance rating (byte)
EMP_FLAGS           EQU     9       ; Status flags (byte)
EMP_RECORD_SIZE     EQU     10      ; Total record size

; Employee flag bits
EMP_ACTIVE          EQU     0       ; Active employee
EMP_FULLTIME        EQU     1       ; Full-time employee
EMP_SUPERVISOR      EQU     2       ; Supervisor role
EMP_UNION           EQU     3       ; Union member

; System flag bits
SYS_INITIALIZED     EQU     0       ; System initialized
DATA_SORTED         EQU     1       ; Data is sorted
STATS_GENERATED     EQU     2       ; Statistics generated
PAYROLL_CALCULATED  EQU     3       ; Payroll calculated
REPORTS_GENERATED   EQU     4       ; Reports generated
VALIDATION_COMPLETE EQU     5       ; Validation complete
SYSTEM_SHUTDOWN_OK  EQU     6       ; Clean shutdown
SYSTEM_SHUTDOWN_ERROR EQU   7       ; Shutdown error

; System limits and constants
MAX_EMPLOYEES       EQU     100     ; Maximum employees
END_OF_DATA         EQU     $FFFFFFFF ; End of data marker
MIN_SALARY          EQU     20000   ; Minimum salary
MAX_SALARY          EQU     100000  ; Maximum salary
MAX_DEPARTMENT      EQU     15      ; Maximum department code
MAX_YEARS_SERVICE   EQU     50      ; Maximum years service
BONUS_THRESHOLD     EQU     85      ; Performance rating for bonus
SEARCH_EMPLOYEE_ID  EQU     12345   ; Employee ID to search for
SEARCH_DEPARTMENT   EQU     5       ; Department to search for
MIN_PERFORMANCE_RATING EQU  80      ; Minimum high performer rating

; === DATA AREAS ===

; Employee database storage
EmployeeDatabase:   DS.B    MAX_EMPLOYEES*EMP_RECORD_SIZE

; Sample employee data for loading
EmployeeRawData:
    DC.L    12345           ; Employee ID
    DC.W    45000           ; Salary
    DC.B    3               ; Department
    DC.B    5               ; Years service
    DC.B    88              ; Performance rating
    DC.B    %00000011       ; Flags (active, full-time)
    
    DC.L    12346           ; Employee ID
    DC.W    52000           ; Salary
    DC.B    2               ; Department
    DC.B    8               ; Years service
    DC.B    92              ; Performance rating
    DC.B    %00000111       ; Flags (active, full-time, supervisor)
    
    DC.L    12347           ; Employee ID
    DC.W    38000           ; Salary
    DC.B    1               ; Department
    DC.B    3               ; Years service
    DC.B    75              ; Performance rating
    DC.B    %00000001       ; Flags (active, part-time)
    
    DC.L    12348           ; Employee ID
    DC.W    48000           ; Salary
    DC.B    4               ; Department
    DC.B    6               ; Years service
    DC.B    85              ; Performance rating
    DC.B    %00000011       ; Flags (active, full-time)
    
    DC.L    12349           ; Employee ID
    DC.W    41000           ; Salary
    DC.B    2               ; Department
    DC.B    4               ; Years service
    DC.B    79              ; Performance rating
    DC.B    %00000001       ; Flags (active, part-time)
    
    DC.L    END_OF_DATA     ; End marker

; Analysis results storage
TotalEmployees:     DC.L    0
TotalSalarySum:     DC.L    0
AverageSalary:      DC.W    0
HighestSalary:      DC.L    0
LowestSalary:       DC.L    0
FullTimeCount:      DC.L    0
PartTimeCount:      DC.L    0
InactiveCount:      DC.L    0
AverageYears:       DC.B    0
AveragePerformance: DC.B    0

; Department counting (16 departments max)
DepartmentCounts:   DS.L    16

; Search results
SearchResultID:     DC.L    0
SearchResultDept:   DC.L    0
HighPerformerCount: DC.L    0

; Payroll totals
TotalGrossPay:      DC.L    0
TotalTaxWithheld:   DC.L    0
TotalNetPay:        DC.L    0
TotalBonus:         DC.L    0

; System status
SystemFlags:        DC.L    0
ProcessingErrors:   DC.L    0

; Working memory areas
StatisticsBuffer:   DS.B    1024    ; Statistics storage
ReportBuffer:       DS.B    2048    ; Report generation
WorkingMemory:      DS.B    512     ; Temporary calculations
SortedIndices:      DS.L    MAX_EMPLOYEES ; Sorted index array
ValidationResults:  DS.B    256     ; Validation storage

; Report text strings
ReportHeader:       DC.B    'EMPLOYEE DATA ANALYSIS REPORT',0
EmployeeSummaryHeader: DC.B 'EMPLOYEE SUMMARY:',0
DepartmentHeader:   DC.B    'DEPARTMENT BREAKDOWN:',0
PayrollHeader:      DC.B    'PAYROLL SUMMARY:',0

; Challenge exercises for further development:
; 1. Add employee performance trend analysis
; 2. Implement department budget calculations
; 3. Create employee scheduling optimization
; 4. Add multi-criteria sorting capabilities
; 5. Implement data export to different formats
```

## Project Analysis and Skills Integration

This comprehensive project demonstrates how all Section 1 skills work together in a real-world application:

### 68000 Register Management
- **Data registers** used for calculations, counters, and temporary storage
- **Address registers** for pointer management and structure access
- **Efficient register usage** minimising memory access overhead

### Addressing Mode Mastery
- **Postincrement addressing** for sequential data processing
- **Displaced addressing** for structure member access
- **Indexed addressing** for array operations and table lookups

### Arithmetic Integration
- **Multi-precision calculations** for financial data
- **Division operations** for averages and percentages
- **Comparison operations** for data validation and sorting

### Bit Manipulation Applications
- **Flag management** using BSET, BCLR, and BTST
- **Data validation** through bit pattern checking
- **Status tracking** with sophisticated flag systems

### Program Flow Excellence
- **Structured loops** using DBRA for data processing
- **Conditional branching** for decision logic
- **Subroutine organization** for modular design

## What You've Accomplished

By completing this integration project, you've demonstrated:

1. **Professional Programming Skills** - Writing production-quality 68000 assembly code
2. **System Architecture** - Designing modular, maintainable software systems
3. **Data Management** - Implementing comprehensive data processing pipelines
4. **Algorithm Implementation** - Creating efficient sorting and searching algorithms
5. **Real-World Application** - Building software that solves practical business problems

## Section 1 Completion

Congratulations! You've successfully completed **Section 1: Data Manipulation Fundamentals** of Amiga Phase 1 Tier 1. You now have a solid foundation in:

- 68000 processor architecture and capabilities
- Register and memory management techniques
- Sophisticated addressing mode applications
- Comprehensive arithmetic and logical operations
- Advanced bit manipulation and control flow

## Looking Ahead to Section 2

In Section 2: **Memory and Hardware**, you'll learn:

- **Advanced Memory Management** - Sophisticated memory allocation and optimization
- **Amiga Custom Chips** - Programming the advanced graphics and audio hardware
- **Hardware Registers** - Direct hardware control and system programming
- **DMA Operations** - High-performance data transfer techniques
- **System Integration** - Building applications that leverage Amiga's unique capabilities

You're now ready to explore the advanced features that make the Amiga truly special!

## Fun Fact

The programming techniques you've learned in this project were commonly used in professional Amiga software development during the platform's golden era. The 68000's sophisticated instruction set and the Amiga's advanced architecture enabled developers to create remarkably capable applications with relatively compact code. Many classic Amiga programs used similar data processing patterns, structured programming approaches, and bit manipulation techniques. The combination of the 68000's power and the Amiga's innovative hardware made it possible to achieve performance that seemed impossible on other home computers of the era!