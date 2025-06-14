#!/usr/bin/env python3
"""
Convert C64 PRG files to TAP tape format
Simple implementation for educational purposes
"""

import sys
import struct
from pathlib import Path

def prg_to_tap(prg_path, tap_path):
    """Convert PRG file to TAP format"""
    
    print(f"Converting {prg_path} to {tap_path}")
    
    # Read PRG file
    with open(prg_path, 'rb') as f:
        prg_data = f.read()
    
    if len(prg_data) < 2:
        raise ValueError("Invalid PRG file - too short")
    
    # Extract load address (first 2 bytes, little endian)
    load_address = struct.unpack('<H', prg_data[:2])[0]
    program_data = prg_data[2:]
    
    print(f"Load address: ${load_address:04X}")
    print(f"Program size: {len(program_data)} bytes")
    
    # Create TAP header
    tap_signature = b'C64-TAPE-RAW'
    tap_version = 1
    
    # Create tape blocks
    blocks = []
    
    # Header block (simplified)
    header_data = bytearray(192)  # Standard C64 tape header size
    header_data[0] = 0x03  # File type (PRG)
    
    # Program name (pad to 16 chars)
    program_name = Path(prg_path).stem[:16].encode('ascii')
    header_data[1:1+len(program_name)] = program_name
    
    # Load and end addresses
    struct.pack_into('<H', header_data, 17, load_address)
    struct.pack_into('<H', header_data, 19, load_address + len(program_data))
    
    # Add header block
    header_checksum = sum(header_data) & 0xFF
    header_block = create_tap_block(0x00, header_data + bytes([header_checksum]))
    blocks.append(header_block)
    
    # Add data block
    data_checksum = sum(program_data) & 0xFF
    data_block = create_tap_block(0xFF, program_data + bytes([data_checksum]))
    blocks.append(data_block)
    
    # Write TAP file
    with open(tap_path, 'wb') as f:
        # TAP header
        f.write(tap_signature)
        f.write(struct.pack('<B', tap_version))
        f.write(b'\x00' * 3)  # Reserved
        
        # Calculate total data size
        total_size = sum(len(block) for block in blocks)
        f.write(struct.pack('<L', total_size))
        
        # Write blocks
        for block in blocks:
            f.write(block)
    
    print(f"✅ TAP file created successfully")

def create_tap_block(block_type, data):
    """Create a TAP block with proper timing"""
    
    # Simplified TAP block creation
    # In reality, TAP files contain detailed timing information
    
    block = bytearray()
    
    # Add sync bytes
    block.extend([0x89] * 2)  # Sync pattern
    
    # Add block marker
    block.append(block_type)
    
    # Add data
    block.extend(data)
    
    # Convert to TAP pulses (simplified)
    tap_block = bytearray()
    
    for byte in block:
        # Convert each byte to TAP pulses
        # This is highly simplified - real TAP files need precise timing
        for bit in range(8):
            if byte & (1 << bit):
                # Bit 1: medium pulse, short pause
                tap_block.extend([0x30, 0x42])
            else:
                # Bit 0: short pulse, medium pause  
                tap_block.extend([0x1F, 0x35])
    
    return tap_block

def main():
    if len(sys.argv) != 3:
        print("Usage: prg2tap.py <input.prg> <output.tap>")
        sys.exit(1)
    
    prg_path = sys.argv[1]
    tap_path = sys.argv[2]
    
    try:
        prg_to_tap(prg_path, tap_path)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()