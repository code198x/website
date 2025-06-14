#!/usr/bin/env python3
"""
Create CHR-ROM data from pattern definitions
Helps students create tile/sprite graphics for NES games
"""

import sys
from pathlib import Path

def create_chr_rom(output_path, pattern_count=512):
    """Create a blank CHR-ROM file with specified number of 8x8 patterns"""
    
    print(f"Creating CHR-ROM with {pattern_count} patterns")
    
    # Each pattern is 16 bytes (8x8 pixels, 2 bits per pixel)
    chr_size = pattern_count * 16
    
    # Create blank CHR data
    chr_data = bytearray(chr_size)
    
    # Add some example patterns
    # Pattern 0: Solid block
    for i in range(8):
        chr_data[i] = 0xFF  # Plane 0
        chr_data[i + 8] = 0xFF  # Plane 1
    
    # Pattern 1: Checkerboard
    for i in range(8):
        if i % 2 == 0:
            chr_data[16 + i] = 0xAA  # Plane 0
            chr_data[16 + i + 8] = 0x55  # Plane 1
        else:
            chr_data[16 + i] = 0x55  # Plane 0
            chr_data[16 + i + 8] = 0xAA  # Plane 1
    
    # Pattern 2: Horizontal lines
    for i in range(8):
        if i % 2 == 0:
            chr_data[32 + i] = 0xFF  # Plane 0
            chr_data[32 + i + 8] = 0x00  # Plane 1
        else:
            chr_data[32 + i] = 0x00  # Plane 0
            chr_data[32 + i + 8] = 0x00  # Plane 1
    
    # Pattern 3: Vertical lines
    for i in range(8):
        chr_data[48 + i] = 0xAA  # Plane 0
        chr_data[48 + i + 8] = 0x00  # Plane 1
    
    # Pattern 4: Simple smiley face
    smiley = [
        0b00111100,  # ..####..
        0b01000010,  # .#....#.
        0b10100101,  # #.#..#.#
        0b10000001,  # #......#
        0b10100101,  # #.#..#.#
        0b10011001,  # #..##..#
        0b01000010,  # .#....#.
        0b00111100,  # ..####..
    ]
    for i, byte_val in enumerate(smiley):
        chr_data[64 + i] = byte_val  # Plane 0
        chr_data[64 + i + 8] = 0x00  # Plane 1 (single color)
    
    # Write CHR file
    with open(output_path, 'wb') as f:
        f.write(chr_data)
    
    print(f"✅ CHR-ROM created: {output_path}")
    print(f"Size: {len(chr_data)} bytes")
    print(f"Patterns: {pattern_count}")
    print("Example patterns included:")
    print("  Pattern 0: Solid block")
    print("  Pattern 1: Checkerboard")
    print("  Pattern 2: Horizontal lines")
    print("  Pattern 3: Vertical lines")
    print("  Pattern 4: Smiley face")

def main():
    if len(sys.argv) < 2:
        print("Usage: create_chr.py <output.chr> [pattern_count]")
        print("Default pattern count: 512 (8KB CHR-ROM)")
        sys.exit(1)
    
    output_path = sys.argv[1]
    pattern_count = int(sys.argv[2]) if len(sys.argv) > 2 else 512
    
    if pattern_count < 1 or pattern_count > 512:
        print("❌ Error: Pattern count must be between 1 and 512")
        sys.exit(1)
    
    try:
        create_chr_rom(output_path, pattern_count)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()