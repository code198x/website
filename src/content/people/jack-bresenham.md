---
name: "Jack Bresenham"
birth_date: 1937-01-01
nationality: "American"
occupation: ["Computer scientist", "Algorithm developer", "Graphics pioneer"]
notable_contributions:
  - "Developer of Bresenham's line algorithm (1962)"
  - "Pioneer in computer graphics and digital plotting"
  - "Fundamental contributions to raster graphics"
companies_worked_for: ["IBM"]
legacy: "Bresenham's line algorithm remains one of the most widely used algorithms in computer graphics, implemented in virtually every graphics system for efficient line drawing on pixel-based displays."
---

**Jack Bresenham** is an American computer scientist best known for developing the Bresenham line algorithm in 1962 whilst working at IBM. This algorithm revolutionised computer graphics by providing an efficient method for drawing lines on raster displays and digital plotters.

## The Bresenham Line Algorithm

In 1962, whilst working at IBM, Bresenham developed an algorithm for drawing lines on CalComp digital plotters. The algorithm was designed to determine which pixels should be illuminated to form a close approximation to a straight line between two points.

### Key Innovation

The Bresenham algorithm's brilliance lies in its use of integer arithmetic only, avoiding expensive floating-point calculations:

- **Efficiency**: Uses only addition, subtraction, and bit shifting
- **Accuracy**: Produces visually smooth lines with minimal error
- **Speed**: Fast enough for real-time graphics applications
- **Simplicity**: Easy to implement and understand

### Applications

The algorithm found immediate applications in:
- **Digital plotters** - Original use case at IBM
- **Computer graphics** - Line drawing in graphics systems
- **Game development** - Fast line rendering in real-time applications
- **CAD systems** - Technical drawing and design software

## Impact on Computing

Bresenham's work laid the foundation for modern computer graphics:

### Graphics Programming
The algorithm became a standard component of graphics libraries and hardware implementations, appearing in everything from simple microcomputer graphics to sophisticated workstation systems.

### Educational Value
The algorithm is widely taught in computer science courses as an example of efficient algorithm design and the importance of integer arithmetic in performance-critical applications.

### Hardware Implementation
Many graphics chips implement Bresenham's algorithm in hardware for maximum performance, including the graphics systems found in vintage computers like the Commodore 64 and Amiga.

## Relevance to Vintage Computing

In the context of 1980s computing, Bresenham's algorithm was crucial for systems with limited processing power:

### 8-bit Systems
Computers like the Commodore 64 and ZX Spectrum used Bresenham-style algorithms for efficient graphics operations, allowing impressive visual effects despite their limited hardware.

### Assembly Programming
The algorithm's integer-only nature made it ideal for implementation in 6502, Z80, and 68000 assembly language, where floating-point operations were either unavailable or extremely slow.

### Real-time Graphics
The efficiency of Bresenham's algorithm enabled real-time graphics in games and applications that would otherwise be impossible on vintage hardware.

## Legacy

Jack Bresenham's line algorithm remains as relevant today as it was in 1962:

- **Universal Implementation**: Found in virtually every graphics system
- **Performance Standard**: Still one of the fastest line-drawing algorithms
- **Educational Tool**: Teaches fundamental concepts of computer graphics
- **Historical Significance**: Enabled the development of practical computer graphics

The algorithm's enduring success demonstrates how elegant mathematical solutions can have lasting impact across decades of technological advancement.