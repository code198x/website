---
title: "File Operations and Persistence"
system: "zx-spectrum"
phase_number: 1
tier_number: 1
lesson_number: 30
description: "Master file operations for saving and loading artwork. Implement custom file formats, compression techniques, and build a complete persistence system for your adventure game."
learning_objectives:
  - "Implement save and load functionality"
  - "Design custom file formats"
  - "Create data compression techniques"
  - "Handle file operations efficiently"
  - "Build robust error handling"
concepts:
  - "ZX Spectrum file system operations"
  - "Custom binary file formats"
  - "Data compression algorithms"
  - "File header structures"
  - "Error handling and validation"
estimated_duration: "50-60 minutes"
difficulty: "hard"
code_examples: true
practical_exercise: true
order: 30
---

# Lesson 30: File Operations and Persistence

Transform your adventure progress into lasting digital memories! The ability to save and load game states is essential for any serious adventure game. We'll master the ZX Spectrum's file system, create efficient file formats, and build a robust persistence system for our Spectrum Saga.

## Understanding ZX Spectrum File Operations

### Basic File System Concepts

The ZX Spectrum uses tape-based storage with a simple file structure:

```text
; ZX Spectrum file header (17 bytes)
FileHeader:
    FileType:       DB 0    ; 0=Program, 1=Array, 2=String, 3=Screen
    FileName:       DS 10   ; Filename (padded with spaces)
    DataLength:     DW 0    ; Length of data
    StartAddress:   DW 0    ; Start address (for programs)
    Unused:         DW 0    ; Unused parameter
    
; File types
TYPE_PROGRAM:   EQU 0
TYPE_ARRAY:     EQU 1
TYPE_STRING:    EQU 2
TYPE_SCREEN:    EQU 3
TYPE_CODE:      EQU 3   ; Machine code (same as screen)
```

### SAVE and LOAD Operations

```text
; Save screen to tape
; Uses ROM routines for tape operations
SaveScreen:
    ; Set up header
    LD A, TYPE_SCREEN
    LD (FileHeader), A
    
    ; Set filename
    LD HL, ScreenName
    LD DE, FileHeader + 1
    LD BC, 10
    LDIR
    
    ; Set data length
    LD HL, 6912         ; Screen + attributes
    LD (FileHeader + 11), HL
    
    ; Set start address
    LD HL, 16384
    LD (FileHeader + 13), HL
    
    ; Save header
    LD A, 0             ; Header flag
    LD DE, FileHeader
    LD BC, 17
    CALL 1218           ; ROM save routine
    
    ; Save data
    LD A, 255           ; Data flag
    LD DE, 16384        ; Screen memory
    LD BC, 6912         ; Screen + attributes
    CALL 1218           ; ROM save routine
    RET

ScreenName: DB "PICTURE   "
```

## Custom File Format Design

### Designing a Game Save Format

**Custom File Format Implementation:**

```assembly
; Custom paint file format for ZX Spectrum
; Implements save/load for artwork with metadata

; File format specification:
; Bytes 0-3:   Magic number 'PXPT' (PixelPainT)
; Bytes 4-5:   Version (16-bit)
; Bytes 6-7:   Width (16-bit)
; Bytes 8-9:   Height (16-bit)
; Bytes 10-11: Compression type (0=none, 1=RLE)
; Bytes 12-15: Data offset
; Bytes 16+:   Image data

; Magic number and constants
MAGIC_NUMBER:   EQU 0x5450      ; 'TP' (reversed)
FILE_VERSION:   EQU 0x0001
NO_COMPRESSION: EQU 0
RLE_COMPRESSION: EQU 1

; File header structure
FileHeader:
    Magic:          DW MAGIC_NUMBER
    MagicHi:        DW 0x5850      ; 'XP'
    Version:        DW FILE_VERSION
    Width:          DW 256         ; Image width
    Height:         DW 192         ; Image height
    Compression:    DW NO_COMPRESSION
    DataOffset:     DW 16          ; Header size
    Reserved:       DW 0

; Current file info
CurrentFile:
    FileName:       DS 10
    FileOpen:       DB 0
    FileSize:       DW 0

; Create new paint file
; Input: HL = filename (10 chars)
CreatePaintFile:
    ; Copy filename
    LD DE, CurrentFile
    LD BC, 10
    LDIR
    
    ; Set file open flag
    LD A, 1
    LD (FileOpen), A
    
    ; Initialize header
    LD HL, FileHeader
    LD DE, Magic
    LD BC, 16
    LDIR
    
    ; Set current dimensions
    LD HL, 256
    LD (Width), HL
    LD HL, 192
    LD (Height), HL
    
    RET

; Save current screen to file
SavePaintFile:
    ; Check if file is open
    LD A, (FileOpen)
    OR A
    RET Z               ; No file open
    
    ; Prepare for save
    CALL PrepareFileData
    
    ; Save header first
    LD A, TYPE_CODE
    LD HL, CurrentFile
    LD DE, FileHeader
    LD BC, 16
    CALL SaveBlock
    
    ; Save screen data
    LD A, TYPE_CODE
    LD HL, CurrentFile
    LD DE, 16384        ; Screen memory
    LD BC, 6144         ; Display file only
    CALL SaveBlock
    
    ; Save attributes
    LD A, TYPE_CODE
    LD HL, CurrentFile
    LD DE, 22528        ; Attribute memory
    LD BC, 768          ; Attribute size
    CALL SaveBlock
    
    RET

; Save a block of data
; Input: A = type, HL = filename, DE = data, BC = size
SaveBlock:
    ; Set up tape save parameters
    PUSH AF
    PUSH HL
    PUSH DE
    PUSH BC
    
    ; Create temporary header
    LD HL, TempHeader
    LD A, TYPE_CODE
    LD (HL), A
    INC HL
    
    ; Copy filename
    POP BC
    PUSH BC
    POP BC              ; Restore BC
    POP DE
    PUSH DE
    POP HL
    PUSH HL
    LD DE, TempHeader + 1
    LD BC, 10
    LDIR
    
    ; Set data length
    POP BC
    PUSH BC
    LD (TempHeader + 11), BC
    
    ; Set start address
    POP DE
    PUSH DE
    LD (TempHeader + 13), DE
    
    ; Simulate save operation
    ; (In real system would call ROM tape routines)
    CALL SimulateSave
    
    POP BC
    POP DE
    POP HL
    POP AF
    RET

; Load paint file
; Input: HL = filename
LoadPaintFile:
    ; Copy filename
    LD DE, CurrentFile
    LD BC, 10
    LDIR
    
    ; Load header
    CALL LoadFileHeader
    
    ; Verify magic number
    LD HL, FileHeader
    LD A, (HL)
    CP MAGIC_NUMBER & 255
    JR NZ, LoadError
    INC HL
    LD A, (HL)
    CP MAGIC_NUMBER >> 8
    JR NZ, LoadError
    
    ; Load screen data
    LD DE, 16384
    LD BC, 6144
    CALL LoadBlock
    
    ; Load attributes
    LD DE, 22528
    LD BC, 768
    CALL LoadBlock
    
    ; Set file open flag
    LD A, 1
    LD (FileOpen), A
    
    ; Return success
    LD A, 0
    RET

LoadError:
    ; Return error code
    LD A, 1
    RET

; Load file header
LoadFileHeader:
    ; Simulate header load
    ; In real system: CALL ROM load routines
    
    ; For demo, copy default header
    LD HL, DefaultHeader
    LD DE, FileHeader
    LD BC, 16
    LDIR
    RET

; Load data block
; Input: DE = destination, BC = size
LoadBlock:
    ; Simulate data loading
    ; For demo, just clear the area
    PUSH DE
    PUSH BC
    
LoadBlockLoop:
    LD A, 0
    LD (DE), A
    INC DE
    DEC BC
    LD A, B
    OR C
    JR NZ, LoadBlockLoop
    
    POP BC
    POP DE
    RET

; Prepare file data (compress if needed)
PrepareFileData:
    ; Check compression type
    LD A, (Compression)
    OR A
    RET Z               ; No compression
    
    ; Apply RLE compression
    CALL ApplyRLECompression
    RET

; Storage
TempHeader:     DS 17
DefaultHeader:  DW MAGIC_NUMBER, 0x5850, FILE_VERSION
                DW 256, 192, NO_COMPRESSION, 16, 0

; File operation demo
FileDemo:
    ; Create new file
    LD HL, TestFileName
    CALL CreatePaintFile
    
    ; Draw test pattern in screen memory
    CALL DrawTestPattern
    
    ; Save the file
    CALL SavePaintFile
    
    ; Clear screen
    CALL ClearScreen
    
    ; Load the file back
    LD HL, TestFileName
    CALL LoadPaintFile
    
    ; Check if load was successful
    OR A
    JR Z, LoadSuccess
    
    ; Load failed
    LD B, 1             ; Error code
    RET
    
LoadSuccess:
    LD B, 255           ; Success
    RET

TestFileName:   DB "TESTPIC   "

; Draw test pattern
DrawTestPattern:
    LD HL, 16384
    LD B, 192
    
PatternLoop:
    LD A, B
    AND 7
    LD C, A
    LD A, 255
    
PatternShift:
    OR A
    JR Z, PatternDone
    RRA
    DEC C
    JR NZ, PatternShift
    
PatternDone:
    LD (HL), A
    INC HL
    DJNZ PatternLoop
    RET

; Clear screen
ClearScreen:
    LD HL, 16384
    LD DE, 16385
    LD BC, 6143
    LD (HL), 0
    LDIR
    RET

; Simulate save/load for demo
SimulateSave:
    ; In real implementation, would use:
    ; CALL 1218  ; ROM save routine
    ; For demo, just indicate success
    RET
```

## Data Compression

### Run-Length Encoding (RLE)

```text
; RLE compression for graphics data
; Efficient for images with repeated patterns

; Compress data using RLE
; Input: HL = source, DE = destination, BC = source length
; Output: BC = compressed length
CompressRLE:
    LD (CompressSource), HL
    LD (CompressDest), DE
    LD (SourceLength), BC
    
    LD HL, 0
    LD (CompressedSize), HL
    
    LD HL, (CompressSource)
    LD DE, (CompressDest)
    
CompressLoop:
    ; Check remaining length
    LD BC, (SourceLength)
    LD A, B
    OR C
    JP Z, CompressDone
    
    ; Get current byte
    LD A, (HL)
    LD B, A             ; Save value
    LD C, 1             ; Count = 1
    INC HL
    
    ; Count consecutive bytes
CountLoop:
    ; Check if more data
    PUSH HL
    LD HL, (SourceLength)
    DEC HL
    LD (SourceLength), HL
    LD A, H
    OR L
    POP HL
    JR Z, WriteRun
    
    ; Check if same value
    LD A, (HL)
    CP B
    JR NZ, WriteRun
    
    ; Same value - increment count
    INC C
    INC HL
    
    ; Check max run length (255)
    LD A, C
    CP 255
    JR Z, WriteRun
    JR CountLoop
    
WriteRun:
    ; Write count and value
    LD A, C
    LD (DE), A          ; Count
    INC DE
    LD A, B
    LD (DE), A          ; Value
    INC DE
    
    ; Update compressed size
    LD HL, (CompressedSize)
    INC HL
    INC HL
    LD (CompressedSize), HL
    
    JR CompressLoop
    
CompressDone:
    LD BC, (CompressedSize)
    RET

; Decompress RLE data
; Input: HL = compressed data, DE = destination
DecompressRLE:
    LD (DecompressSource), HL
    LD (DecompressDest), DE
    
    LD HL, (DecompressSource)
    LD DE, (DecompressDest)
    
DecompressLoop:
    ; Get count (0 = end marker)
    LD A, (HL)
    OR A
    RET Z               ; End of data
    
    LD B, A             ; Count
    INC HL
    
    ; Get value
    LD A, (HL)
    INC HL
    
    ; Write repeated value
WriteLoop:
    LD (DE), A
    INC DE
    DJNZ WriteLoop
    
    JR DecompressLoop

; Storage for compression
CompressSource:     DW 0
CompressDest:       DW 0
SourceLength:       DW 0
CompressedSize:     DW 0
DecompressSource:   DW 0
DecompressDest:     DW 0
```

### Dictionary-Based Compression

**Advanced Compression Implementation:**

```assembly
; Dictionary-based compression for better ratios
; Uses common pattern dictionary

; Dictionary compression
MAX_DICT_ENTRIES:   EQU 32
PATTERN_SIZE:       EQU 4

; Dictionary structure
Dictionary:         DS MAX_DICT_ENTRIES * PATTERN_SIZE
DictEntries:        DB 0

; Build dictionary from image data
; Input: HL = image data, BC = size
BuildDictionary:
    ; Clear dictionary
    LD HL, Dictionary
    LD DE, Dictionary + 1
    LD BC, MAX_DICT_ENTRIES * PATTERN_SIZE - 1
    LD (HL), 0
    LDIR
    
    XOR A
    LD (DictEntries), A
    
    ; Scan for common patterns
    LD HL, (ImageData)
    LD BC, (ImageSize)
    
ScanLoop:
    ; Check remaining data
    LD A, B
    OR C
    RET Z
    
    ; Check if pattern exists
    CALL FindPattern
    JR NC, PatternExists
    
    ; Add new pattern if space
    CALL AddPattern
    
PatternExists:
    ; Move to next position
    INC HL
    DEC BC
    JR ScanLoop

; Find pattern in dictionary
; Input: HL = pattern address
; Output: Carry clear if found, A = index
FindPattern:
    LD DE, Dictionary
    LD A, (DictEntries)
    LD B, A
    OR A
    SCF
    RET Z               ; Empty dictionary
    
    LD C, 0             ; Index counter
    
FindLoop:
    PUSH BC
    PUSH DE
    PUSH HL
    
    ; Compare pattern
    LD B, PATTERN_SIZE
CompareLoop:
    LD A, (HL)
    CP (DE)
    JR NZ, NoMatch
    INC HL
    INC DE
    DJNZ CompareLoop
    
    ; Pattern matches
    POP HL
    POP DE
    POP BC
    LD A, C             ; Return index
    OR A                ; Clear carry
    RET
    
NoMatch:
    POP HL
    POP DE
    POP BC
    
    ; Next dictionary entry
    LD A, PATTERN_SIZE
    ADD E
    LD E, A
    JR NC, NoCarry
    INC D
NoCarry:
    INC C
    DJNZ FindLoop
    
    SCF                 ; Pattern not found
    RET

; Add pattern to dictionary
; Input: HL = pattern address
AddPattern:
    LD A, (DictEntries)
    CP MAX_DICT_ENTRIES
    RET NC              ; Dictionary full
    
    ; Calculate dictionary position
    LD B, 0
    LD C, A
    PUSH HL
    LD HL, Dictionary
    LD A, PATTERN_SIZE
    
CalcOffset:
    ADD C
    JR NC, NoOverflow
    LD A, 255           ; Prevent overflow
    JR DoneCalc
NoOverflow:
    DEC B
    JR NZ, CalcOffset
DoneCalc:
    LD C, A
    ADD HL, BC
    LD DE, HL
    POP HL
    
    ; Copy pattern
    LD BC, PATTERN_SIZE
    LDIR
    
    ; Increment entry count
    LD HL, DictEntries
    INC (HL)
    RET

; Compress using dictionary
; Input: HL = source, DE = destination, BC = size
CompressDict:
    LD (CompressSource), HL
    LD (CompressDest), DE
    LD (SourceLength), BC
    
    ; Build dictionary first
    CALL BuildDictionary
    
    ; Compress data
    LD HL, (CompressSource)
    LD DE, (CompressDest)
    LD BC, (SourceLength)
    
CompressDictLoop:
    ; Check remaining data
    LD A, B
    OR C
    JP Z, CompressDictDone
    
    ; Try to find pattern
    CALL FindPattern
    JR C, SingleByte
    
    ; Found pattern - encode as index
    LD (DE), A          ; Dictionary index
    INC DE
    
    ; Skip pattern bytes
    LD A, PATTERN_SIZE
    SUB 1               ; -1 because we'll inc HL below
    
SkipBytes:
    INC HL
    DEC BC
    DEC A
    JR NZ, SkipBytes
    JR NextByte
    
SingleByte:
    ; Single byte - mark as literal
    LD A, 255           ; Literal marker
    LD (DE), A
    INC DE
    LD A, (HL)          ; Actual byte
    LD (DE), A
    INC DE
    
NextByte:
    INC HL
    DEC BC
    JR CompressDictLoop
    
CompressDictDone:
    ; Write end marker
    XOR A
    LD (DE), A
    RET

; Decompress dictionary data
; Input: HL = compressed data, DE = destination
DecompressDict:
    PUSH DE
    
    ; First, restore dictionary (would be saved with file)
    ; For demo, use current dictionary
    
    POP DE
    
DecompressDictLoop:
    LD A, (HL)
    INC HL
    
    ; Check for end marker
    OR A
    RET Z
    
    ; Check for literal marker
    CP 255
    JR Z, DecompressLiteral
    
    ; Dictionary index - expand pattern
    PUSH HL
    CALL ExpandPattern
    POP HL
    JR DecompressDictLoop
    
DecompressLiteral:
    ; Copy literal byte
    LD A, (HL)
    INC HL
    LD (DE), A
    INC DE
    JR DecompressDictLoop

; Expand pattern from dictionary
; Input: A = pattern index, DE = destination
ExpandPattern:
    ; Calculate pattern address
    LD HL, Dictionary
    LD B, 0
    LD C, A
    LD A, PATTERN_SIZE
    
CalcPattern:
    ADD C
    JR NC, PatternOK
    LD A, 255
    JR PatternDone
PatternOK:
    DEC B
    JR NZ, CalcPattern
PatternDone:
    LD C, A
    ADD HL, BC
    
    ; Copy pattern
    LD BC, PATTERN_SIZE
    LDIR
    RET

; Test compression
TestCompression:
    ; Create test data
    LD HL, TestData
    LD (ImageData), HL
    LD HL, 64
    LD (ImageSize), HL
    
    ; Test RLE compression
    LD HL, TestData
    LD DE, CompressedData
    LD BC, 64
    CALL CompressRLE
    
    ; Store compressed size
    LD (RLESize), BC
    
    ; Test dictionary compression
    LD HL, TestData
    LD DE, DictCompressed
    LD BC, 64
    CALL CompressDict
    
    ; Decompress and verify
    LD HL, CompressedData
    LD DE, DecompressedData
    CALL DecompressRLE
    
    ; Return size difference
    LD HL, (RLESize)
    LD B, H
    LD C, L
    RET

; Test data with patterns
TestData:
    DB 255, 255, 255, 255   ; Repeated pattern
    DB 170, 170, 170, 170
    DB 255, 255, 255, 255
    DB 85, 85, 85, 85
    DB 255, 255, 255, 255
    DB 170, 170, 170, 170
    DB 255, 255, 255, 255
    DB 85, 85, 85, 85
    ; ... repeat pattern
    DS 32, 255              ; Fill rest with 255

; Storage
ImageData:          DW 0
ImageSize:          DW 0
CompressedData:     DS 128
DictCompressed:     DS 128
DecompressedData:   DS 128
RLESize:           DW 0
```

## Error Handling and Validation

### File Integrity Checking

```text
; Checksum calculation for file integrity
CalculateChecksum:
    ; Input: HL = data, BC = length
    ; Output: DE = checksum
    LD DE, 0            ; Initialize checksum
    
ChecksumLoop:
    LD A, (HL)
    ADD E
    LD E, A
    JR NC, NoCarry
    INC D
NoCarry:
    INC HL
    DEC BC
    LD A, B
    OR C
    JR NZ, ChecksumLoop
    RET

; Verify file integrity
VerifyFile:
    ; Calculate checksum of loaded data
    LD HL, 16384        ; Screen data
    LD BC, 6912         ; Total size
    CALL CalculateChecksum
    
    ; Compare with stored checksum
    LD HL, (StoredChecksum)
    OR A
    SBC HL, DE
    RET Z               ; Checksums match
    
    ; File corrupted
    SCF
    RET

StoredChecksum: DW 0
```

### Recovery Mechanisms

```text
; Auto-save functionality
AutoSave:
    ; Check if auto-save is enabled
    LD A, (AutoSaveEnabled)
    OR A
    RET Z
    
    ; Check timer
    LD HL, (AutoSaveTimer)
    DEC HL
    LD (AutoSaveTimer), HL
    LD A, H
    OR L
    RET NZ              ; Not time yet
    
    ; Reset timer
    LD HL, AUTO_SAVE_INTERVAL
    LD (AutoSaveTimer), HL
    
    ; Save backup file
    LD HL, BackupFileName
    CALL CreatePaintFile
    CALL SavePaintFile
    RET

; Recover from backup
RecoverBackup:
    ; Try to load backup file
    LD HL, BackupFileName
    CALL LoadPaintFile
    OR A
    RET Z               ; Recovery successful
    
    ; Backup failed - clear screen
    CALL ClearScreen
    SCF                 ; Signal recovery failed
    RET

AUTO_SAVE_INTERVAL: EQU 1000
AutoSaveEnabled:    DB 1
AutoSaveTimer:      DW AUTO_SAVE_INTERVAL
BackupFileName:     DB "BACKUP    "
```

## File Format Optimization

### Metadata and Thumbnails

**Advanced File Format:**

```assembly
; Advanced file format with metadata and thumbnails
; Extended format for professional adventure game

; Extended file header (32 bytes)
ExtFileHeader:
    Magic:          DB 'P','X','P','T'    ; Magic signature
    Version:        DW 0x0002            ; Version 2
    HeaderSize:     DW 32                ; Header size
    ImageWidth:     DW 256               ; Image dimensions
    ImageHeight:    DW 192
    BitsPerPixel:   DB 1                 ; Monochrome
    Compression:    DB 0                 ; Compression type
    Checksum:       DW 0                 ; Data checksum
    Timestamp:      DD 0                 ; Creation time
    ThumbnailOffset: DW 0                ; Thumbnail position
    ThumbnailSize:  DW 0                 ; Thumbnail size
    MetadataOffset: DW 0                 ; Metadata position
    MetadataSize:   DW 0                 ; Metadata size
    Reserved:       DS 8                 ; Future use

; Metadata structure
Metadata:
    Title:          DS 20               ; Image title
    Author:         DS 16               ; Creator name
    Description:    DS 64               ; Description
    Keywords:       DS 32               ; Search keywords
    ToolsUsed:      DB 0                ; Drawing tools flags
    TimeSpent:      DW 0                ; Minutes spent
    EditCount:      DW 0                ; Number of edits
    LastModified:   DD 0                ; Last edit time

; Create thumbnail (16x12 version of main image)
CreateThumbnail:
    ; Source: 256x192 screen
    ; Target: 16x12 thumbnail
    LD HL, 16384        ; Source screen
    LD DE, ThumbnailData ; Destination
    
    ; Sample every 16th pixel horizontally, 16th line vertically
    LD B, 12            ; Thumbnail height
    
ThumbYLoop:
    PUSH BC
    
    ; Calculate source line
    LD A, 12
    SUB B               ; Current thumbnail row
    LD C, A
    LD B, 0
    ADD HL, HL          ; × 2
    ADD HL, HL          ; × 4
    ADD HL, HL          ; × 8
    ADD HL, HL          ; × 16 (multiply by 16)
    
    ; Add to base address
    PUSH HL
    LD HL, 16384
    ADD HL, BC
    
    ; Sample 16 pixels horizontally
    LD B, 16            ; Thumbnail width in bits
    LD C, 0             ; Accumulator
    LD D, 0             ; Bit counter
    
ThumbXLoop:
    ; Sample pixel (simplified - just read every 16th byte)
    LD A, (HL)
    AND 128             ; Test leftmost pixel
    JR Z, PixelOff
    
    ; Set bit in thumbnail
    SCF
    RL C
    JR NextThumbPixel
    
PixelOff:
    OR A
    RL C
    
NextThumbPixel:
    ; Advance source by 16 pixels (2 bytes)
    INC HL
    INC HL
    
    ; Next thumbnail pixel
    INC D
    LD A, D
    CP 8
    JR NZ, SameByte
    
    ; Store completed byte
    LD A, C
    LD (DE), A
    INC DE
    LD C, 0
    LD D, 0
    
SameByte:
    DJNZ ThumbXLoop
    
    ; Store final byte if needed
    LD A, D
    OR A
    JR Z, NextThumbRow
    LD A, C
    LD (DE), A
    INC DE
    
NextThumbRow:
    POP HL
    POP BC
    DJNZ ThumbYLoop
    
    ; Store thumbnail size
    LD HL, 24           ; 16x12 = 192 bits = 24 bytes
    LD (ThumbnailSize), HL
    RET

; Save extended format file
SaveExtendedFile:
    ; Update header fields
    CALL UpdateTimestamp
    
    ; Calculate data checksum
    LD HL, 16384
    LD BC, 6912
    CALL CalculateChecksum
    LD (ExtFileHeader + 14), DE
    
    ; Create thumbnail
    CALL CreateThumbnail
    
    ; Set thumbnail offset
    LD HL, 32 + 6912    ; After header and main data
    LD (ThumbnailOffset), HL
    
    ; Prepare metadata
    CALL PrepareMetadata
    
    ; Set metadata offset  
    LD HL, (ThumbnailOffset)
    LD BC, (ThumbnailSize)
    ADD HL, BC
    LD (MetadataOffset), HL
    
    ; Save file components
    CALL SaveExtendedHeader
    CALL SaveMainData
    CALL SaveThumbnailData
    CALL SaveMetadataBlock
    
    RET

; Load extended format file
LoadExtendedFile:
    ; Load and verify header
    CALL LoadExtendedHeader
    CALL VerifyMagicNumber
    JR NZ, LoadExtError
    
    ; Load main image data
    CALL LoadMainData
    
    ; Verify checksum
    LD HL, 16384
    LD BC, 6912
    CALL CalculateChecksum
    LD HL, (ExtFileHeader + 14)
    OR A
    SBC HL, DE
    JR NZ, ChecksumError
    
    ; Load thumbnail (optional)
    LD A, (ThumbnailSize)
    OR A
    JR Z, SkipThumbnail
    CALL LoadThumbnailData
    
SkipThumbnail:
    ; Load metadata (optional)
    LD A, (MetadataSize)
    OR A
    JR Z, LoadExtSuccess
    CALL LoadMetadataBlock
    
LoadExtSuccess:
    XOR A               ; Success
    RET
    
LoadExtError:
ChecksumError:
    LD A, 1             ; Error
    RET

; Update timestamp
UpdateTimestamp:
    ; Get current time (simplified)
    ; In real system, would read RTC or use timer
    LD HL, (TimeCounter)
    INC HL
    LD (TimeCounter), HL
    LD (ExtFileHeader + 16), HL
    RET

; Prepare metadata
PrepareMetadata:
    ; Copy current metadata to save buffer
    LD HL, CurrentMetadata
    LD DE, Metadata
    LD BC, 128          ; Metadata size
    LDIR
    
    ; Update edit statistics
    LD HL, (EditCount)
    INC HL
    LD (EditCount), HL
    LD (Metadata + 118), HL
    
    ; Set metadata size
    LD HL, 128
    LD (MetadataSize), HL
    RET

; Verify magic number
VerifyMagicNumber:
    LD HL, ExtFileHeader
    LD A, (HL)
    CP 'P'
    RET NZ
    INC HL
    LD A, (HL)
    CP 'X'
    RET NZ
    INC HL
    LD A, (HL)
    CP 'P'
    RET NZ
    INC HL
    LD A, (HL)
    CP 'T'
    RET

; File operation stubs (would use ROM routines)
SaveExtendedHeader:
SaveMainData:
SaveThumbnailData:
SaveMetadataBlock:
LoadExtendedHeader:
LoadMainData:
LoadThumbnailData:
LoadMetadataBlock:
    ; Simulate file operations
    RET

; Storage
ThumbnailData:      DS 24
CurrentMetadata:    DS 128
TimeCounter:        DW 0
EditCount:         DW 0

; Demo extended file operations
ExtendedFileDemo:
    ; Set up metadata
    LD HL, SampleTitle
    LD DE, CurrentMetadata
    LD BC, 20
    LDIR
    
    ; Create test image
    CALL DrawTestPattern
    
    ; Save extended file
    CALL SaveExtendedFile
    
    ; Clear and reload
    CALL ClearScreen
    CALL LoadExtendedFile
    
    ; Check result
    OR A
    JR Z, ExtSuccess
    LD B, 1             ; Error
    RET
    
ExtSuccess:
    LD B, 255           ; Success
    RET

SampleTitle:    DB
```

## Performance Optimization

### Efficient File Operations

```text
; Optimize file I/O for speed
FastSave:
    ; Use larger buffer sizes
    ; Minimize system calls
    ; Batch operations
    
    ; Pre-allocate buffers
    LD HL, LARGE_BUFFER
    LD BC, 8192         ; 8K buffer
    
    ; Stream data in chunks
SaveChunk:
    ; Process 1K at a time
    CALL ProcessChunk
    ; Continue until done
    RET

; Memory-mapped file access
MapFile:
    ; Map file to memory address
    ; Allow direct memory access
    ; Faster than traditional I/O
    RET

LARGE_BUFFER: DS 8192
```

## Complete File System

**Complete File System Demo:**

```assembly
; Complete file system demonstration
; Shows save, load, compression, and error handling

; File manager state
FileManager:
    CurrentFile:    DS 10           ; Current filename
    FileCount:      DB 0            ; Number of files
    LastError:      DB 0            ; Last error code
    AutoSave:       DB 1            ; Auto-save enabled

; Error codes
ERR_NONE:           EQU 0
ERR_FILE_NOT_FOUND: EQU 1
ERR_DISK_FULL:      EQU 2
ERR_CORRUPT_FILE:   EQU 3
ERR_ACCESS_DENIED:  EQU 4

; Main file operations interface
; Input: A = operation, HL = filename
FileOperation:
    LD (LastError), A   ; Clear error
    XOR A
    
    OR A                ; Check operation
    JP Z, FileOp_Load
    DEC A
    JP Z, FileOp_Save
    DEC A
    JP Z, FileOp_Delete
    JP FileOp_List

FileOp_Load:
    CALL LoadPaintFile
    JR FileOp_Done

FileOp_Save:
    CALL SavePaintFile
    JR FileOp_Done

FileOp_Delete:
    CALL DeleteFile
    JR FileOp_Done

FileOp_List:
    CALL ListFiles

FileOp_Done:
    ; Return error status
    LD A, (LastError)
    RET

; Enhanced save with error checking
SavePaintFile:
    ; Check disk space (simulated)
    CALL CheckDiskSpace
    JR C, SaveError_DiskFull
    
    ; Backup existing file
    CALL BackupExistingFile
    
    ; Attempt save
    CALL PerformSave
    JR C, SaveError_WriteError
    
    ; Verify saved file
    CALL VerifyLastSave
    JR C, SaveError_VerifyFailed
    
    ; Success
    XOR A
    LD (LastError), A
    RET

SaveError_DiskFull:
    LD A, ERR_DISK_FULL
    LD (LastError), A
    SCF
    RET

SaveError_WriteError:
SaveError_VerifyFailed:
    LD A, ERR_ACCESS_DENIED
    LD (LastError), A
    SCF
    RET

; Enhanced load with recovery
LoadPaintFile:
    ; Try primary file
    CALL AttemptLoad
    JR NC, LoadSuccess
    
    ; Try backup file
    CALL LoadBackupFile
    JR NC, LoadSuccess
    
    ; Load failed
    LD A, ERR_FILE_NOT_FOUND
    LD (LastError), A
    SCF
    RET

LoadSuccess:
    XOR A
    LD (LastError), A
    RET

; File listing functionality
ListFiles:
    ; Simulate directory listing
    LD HL, FileList
    LD B, 5             ; 5 demo files
    
ListLoop:
    PUSH BC
    PUSH HL
    
    ; Display filename (would show on screen)
    CALL ShowFileName
    
    ; Next filename (10 chars each)
    POP HL
    LD BC, 10
    ADD HL, BC
    
    POP BC
    DJNZ ListLoop
    
    ; Update file count
    LD A, 5
    LD (FileCount), A
    RET

; Auto-save system
ProcessAutoSave:
    ; Check if enabled
    LD A, (AutoSave)
    OR A
    RET Z
    
    ; Check timer (would be called periodically)
    LD A, (AutoSaveTimer)
    DEC A
    LD (AutoSaveTimer), A
    RET NZ
    
    ; Time to auto-save
    LD A, 60            ; Reset timer (60 frames)
    LD (AutoSaveTimer), A
    
    ; Save backup
    LD HL, AutoSaveFile
    CALL SavePaintFile
    RET

; File recovery system
RecoverSession:
    ; Try to recover from crash
    LD HL, AutoSaveFile
    CALL LoadPaintFile
    JR NC, RecoverSuccess
    
    ; Try backup files
    LD HL, BackupFile1
    CALL LoadPaintFile
    JR NC, RecoverSuccess
    
    LD HL, BackupFile2
    CALL LoadPaintFile
    JR NC, RecoverSuccess
    
    ; No recovery possible
    CALL InitializeNewFile
    LD A, ERR_FILE_NOT_FOUND
    LD (LastError), A
    SCF
    RET

RecoverSuccess:
    XOR A
    LD (LastError), A
    RET

; Stub implementations
CheckDiskSpace:
BackupExistingFile:
PerformSave:
VerifyLastSave:
AttemptLoad:
LoadBackupFile:
ShowFileName:
InitializeNewFile:
    ; Simulate operations
    OR A                ; Clear carry (success)
    RET

DeleteFile:
    ; Simulate file deletion
    XOR A
    LD (LastError), A
    RET

; Demo file system
FileSystemDemo:
    ; Initialize file manager
    XOR A
    LD (FileCount), A
    LD (LastError), A
    
    ; Test save operation
    LD A, 1             ; Save operation
    LD HL, TestFile
    CALL FileOperation
    OR A
    JR NZ, DemoError
    
    ; Test load operation
    LD A, 0             ; Load operation
    LD HL, TestFile
    CALL FileOperation
    OR A
    JR NZ, DemoError
    
    ; Test file listing
    LD A, 3             ; List operation
    CALL FileOperation
    
    ; Test auto-save
    CALL ProcessAutoSave
    
    ; Test recovery
    CALL RecoverSession
    
    ; Success
    LD B, 255
    RET

DemoError:
    ; Return error code
    LD B, A
    RET

; File data
TestFile:       DB
```

## Key Takeaways

You've mastered file operations and persistence:

1. **File Formats**: Custom binary formats with headers and metadata
2. **Compression**: RLE and dictionary-based compression techniques
3. **Error Handling**: Robust error checking and recovery mechanisms
4. **Advanced Features**: Thumbnails, metadata, and auto-save systems
5. **Performance**: Optimized I/O operations and efficient file handling

## What's Next?

In the final lesson, we'll integrate everything into a complete Spectrum Saga application! You'll combine all the systems you've built into a professional adventure game that demonstrates the full power of Z80 assembly graphics programming.

## Fun Fact

The ZX Spectrum's tape-based file system was revolutionary for home computers in 1982. The clever header system allowed files to be automatically loaded to the correct memory address, eliminating manual setup. Many users became experts at adjusting tape deck volume levels to optimize loading reliability - it was both an art and a science! The distinctive loading sounds became iconic, with experienced users able to diagnose loading problems just by listening to the audio patterns. Some modern retro enthusiasts still prefer the nostalgic ritual of tape loading, complete with the anticipation and occasional loading errors that were part of the authentic 1980s computing experience!