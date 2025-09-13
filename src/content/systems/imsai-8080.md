---
name: "IMSAI 8080"
full_name: "IMSAI 8080"
manufacturer: "IMSAI Manufacturing Corporation"
model_number: "8080"
alternative_names: ["IMSAI"]

# Hardware specifications
cpu: "Intel 8080"
cpu_details:
  architecture: "8-bit"
  instruction_set: "Intel 8080"
  addressing_modes: ["Register", "Immediate", "Direct", "Register Indirect"]
  registers: "Accumulator (A), 6 general registers (B,C,D,E,H,L), Stack pointer (SP), Program counter (PC)"

clock_speed: "2 MHz"
ram: "256 bytes to 64KB (typical starter kits had 4-8KB)"
ram_details:
  user_available: "Varies by configuration"
  expansion_options: ["S-100 bus memory cards"]

# Graphics capabilities
video:
  resolution: "N/A (lights only)"
  colors: "N/A"

# Storage and I/O
storage: ["Paper tape", "Cassette tape", "Floppy disk"]
storage_details:
  built_in: ["Front panel switches"]
  expansion: ["Cassette interface", "Floppy disk controllers"]

io_ports: ["S-100 bus expansion slots", "Front panel LEDs and switches"]
expansion_options: ["S-100 bus cards", "Serial interfaces", "Parallel interfaces"]

# Commercial information
price_at_launch:
  global: "$439 USD (1975, kit form)"

release_date:
  global: 1975-01-01T00:00:00Z

discontinued: 1978-01-01T00:00:00Z
production_run: "1975-1978"
country_of_origin: "United States"
operating_system: "CP/M"

# Software ecosystem
notable_software:
  - name: "CP/M"
    type: "Operating System"
    year: 1976
    developer: "Digital Research"
    publisher: "Digital Research"
    significance: "Dominant OS before MS-DOS"
  - name: "IMSAI BASIC"
    type: "Programming Language"
    year: 1975
    developer: "IMSAI"
    publisher: "IMSAI"
    significance: "Early BASIC interpreter"

# Emulation support
emulated: true
emulators:
  - name: "simh"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"
  - name: "IMSAI Guy"
    platform: "Windows"
    accuracy: "high"
  - name: "MAME"
    platform: "Multi-platform"
    accuracy: "cycle_accurate"

# Media
description: "The IMSAI 8080 was one of the first widely available microcomputers and gained popularity as a refined alternative to the MITS Altair 8800. It used the Intel 8080 processor and the S-100 bus architecture, offering a flexible platform for hobbyists and early software developers."

# Platform Classification
medal_tier: "bronze"
total_lessons: 0
total_games: 0
estimated_duration: "N/A"
cpu_architecture: "8080"
difficulty_level: "expert"
status: "vault"

# External resources
external_links:
  - title: "IMSAI 8080 - Computer History Museum"
    url: "https://computerhistory.org/collections/catalog/102646197"
  - title: "IMSAI Users Group"
    url: "https://imsai.net/"

# Metadata
order: 29
---

# IMSAI 8080

_Historical Reference Only_

The **IMSAI 8080** was one of the first widely available microcomputers and gained popularity as a refined alternative to the MITS Altair 8800. It used the Intel 8080 processor and the S-100 bus architecture, offering a flexible platform for hobbyists and early software developers.

## Historical Significance

The IMSAI 8080 represents a crucial moment in personal computing history:

- **Microcomputer Evolution**: One of the first commercially successful alternatives to the Altair 8800
- **S-100 Bus Standard**: Helped establish the S-100 bus as an industry standard for expansion
- **Pop Culture Icon**: The distinctive front panel became iconic, featured in films like _WarGames_ (1983)
- **CP/M Platform**: One of the earliest machines to run CP/M, the dominant OS before MS-DOS

## Technical Innovation

- **Intel 8080 Processor**: 2MHz 8-bit processor that powered the early microcomputer revolution
- **S-100 Bus**: Flexible expansion system that became an industry standard
- **Front Panel Interface**: Direct memory manipulation through switches and LEDs
- **Modular Design**: Expandable system architecture for various applications

## Did You Know?

- The front panel of the IMSAI 8080 became iconic, often featured in films like _WarGames_ (1983)
- It was one of the earliest machines to run CP/M, the dominant OS before MS-DOS
- The S-100 bus standard it used became the backbone for many hobbyist systems of the era
- Many early software companies developed their first products on IMSAI systems

## Legacy

While the IMSAI 8080 is too primitive for practical modern game development education, it represents a crucial stepping stone in computing history. Its influence on early personal computing standards and its role in establishing the microcomputer industry makes it an important reference point for understanding the evolution of computing platforms.

## Related Systems

- [Altair 8800](/systems/mits-altair-8800)
- [Apple I](/systems/apple-i)
- [Commodore PET](/systems/commodore-pet)
