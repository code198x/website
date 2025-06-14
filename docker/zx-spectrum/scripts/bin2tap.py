#!/usr/bin/env python3
"""
Convert Z80 binary to ZX Spectrum TAP format
Creates standard TAP files loadable by ZX Spectrum emulators
"""

import sys
import struct
from pathlib import Path

def bin_to_tap(bin_path, tap_path, program_name="PROGRAM"):
    """Convert binary file to TAP format"""
    
    print(f"Converting {bin_path} to {tap_path}")
    
    # Read binary file
    with open(bin_path, 'rb') as f:
        program_data = f.read()
    
    if len(program_data) == 0:
        raise ValueError("Binary file is empty")
    
    # Default load address for ZX Spectrum programs
    load_address = 32768  # 0x8000
    
    print(f"Program name: {program_name}")
    print(f"Load address: {load_address}")
    print(f"Program size: {len(program_data)} bytes")
    
    # Prepare program name (10 characters max, padded with spaces)
    name_bytes = program_name[:10].ljust(10).encode('ascii')
    
    # Create TAP file
    tap_data = bytearray()
    
    # Header block
    header_data = bytearray()
    header_data.append(0x00)  # Header flag
    header_data.append(0x03)  # Code block type
    header_data.extend(name_bytes)  # Program name (10 bytes)
    header_data.extend(struct.pack('<H', len(program_data)))  # Data length
    header_data.extend(struct.pack('<H', load_address))  # Start address
    header_data.extend(struct.pack('<H', 0x8000))  # Unused parameter
    
    # Calculate header checksum
    header_checksum = 0
    for byte in header_data:
        header_checksum ^= byte
    header_data.append(header_checksum)
    
    # Add header block to TAP (length + data)
    tap_data.extend(struct.pack('<H', len(header_data)))
    tap_data.extend(header_data)
    
    # Data block
    data_block = bytearray()
    data_block.append(0xFF)  # Data flag
    data_block.extend(program_data)  # Program data
    
    # Calculate data checksum
    data_checksum = 0
    for byte in data_block:
        data_checksum ^= byte
    data_block.append(data_checksum)
    
    # Add data block to TAP (length + data)
    tap_data.extend(struct.pack('<H', len(data_block)))
    tap_data.extend(data_block)
    
    # Write TAP file
    with open(tap_path, 'wb') as f:
        f.write(tap_data)
    
    print(f"✅ TAP file created successfully")
    print(f"Header block: {len(header_data)} bytes")
    print(f"Data block: {len(data_block)} bytes")
    print(f"Total TAP size: {len(tap_data)} bytes")

def main():
    if len(sys.argv) < 3:
        print("Usage: bin2tap.py <input.bin> <output.tap> [program_name]")
        sys.exit(1)
    
    bin_path = sys.argv[1]
    tap_path = sys.argv[2]
    program_name = sys.argv[3] if len(sys.argv) > 3 else "PROGRAM"
    
    try:
        bin_to_tap(bin_path, tap_path, program_name)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()