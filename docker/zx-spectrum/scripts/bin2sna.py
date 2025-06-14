#!/usr/bin/env python3
"""
Convert Z80 binary to ZX Spectrum SNA snapshot format
Creates SNA files that can be loaded directly into emulators
"""

import sys
import struct
from pathlib import Path

def bin_to_sna(bin_path, sna_path, load_address=32768):
    """Convert binary file to SNA snapshot format"""
    
    print(f"Converting {bin_path} to {sna_path}")
    
    # Read binary file
    with open(bin_path, 'rb') as f:
        program_data = f.read()
    
    if len(program_data) == 0:
        raise ValueError("Binary file is empty")
    
    print(f"Load address: {load_address}")
    print(f"Program size: {len(program_data)} bytes")
    
    # Create SNA snapshot
    sna_data = bytearray(49179)  # Standard SNA file size
    
    # Initialize with zeros
    sna_data[:] = [0] * 49179
    
    # SNA Header format (27 bytes):
    # 0: I register
    # 1-2: HL', DE', BC', AF' (little endian)
    # 9-10: HL, DE, BC, IY, IX (little endian)
    # 19: Interrupt register
    # 20: R register
    # 21-22: AF, SP (little endian)
    # 25: Interrupt mode (0, 1, or 2)
    # 26: Border color (0-7)
    
    # Set up Z80 registers for a basic state
    sna_data[0] = 63    # I register
    sna_data[19] = 0    # Interrupt register (disabled)
    sna_data[20] = 0    # R register
    sna_data[25] = 1    # Interrupt mode 1
    sna_data[26] = 7    # Border color (white)
    
    # Set SP to a safe location (23552 - just below screen memory)
    sp_value = 23552
    sna_data[23] = sp_value & 0xFF
    sna_data[24] = (sp_value >> 8) & 0xFF
    
    # Set PC on stack (SNA format stores PC on stack)
    pc_value = load_address
    stack_pos = sp_value - 16384  # Convert to SNA memory offset
    if stack_pos >= 0 and stack_pos < 49152:
        sna_data[27 + stack_pos] = pc_value & 0xFF
        sna_data[27 + stack_pos + 1] = (pc_value >> 8) & 0xFF
    
    # Copy program data to SNA memory
    memory_offset = load_address - 16384  # ZX Spectrum memory starts at 16384
    if memory_offset >= 0 and memory_offset + len(program_data) <= 49152:
        for i, byte in enumerate(program_data):
            if memory_offset + i < 49152:
                sna_data[27 + memory_offset + i] = byte
    else:
        print(f"⚠️  Warning: Program data at {load_address} may not fit in SNA memory map")
        # Copy what we can
        for i, byte in enumerate(program_data):
            mem_pos = memory_offset + i
            if mem_pos >= 0 and mem_pos < 49152:
                sna_data[27 + mem_pos] = byte
    
    # Write SNA file
    with open(sna_path, 'wb') as f:
        f.write(sna_data)
    
    print(f"✅ SNA snapshot created successfully")
    print(f"Memory size: 49152 bytes")
    print(f"Total SNA size: {len(sna_data)} bytes")
    print(f"Program loaded at: {load_address}")
    print(f"Stack pointer: {sp_value}")

def main():
    if len(sys.argv) < 3:
        print("Usage: bin2sna.py <input.bin> <output.sna> [load_address]")
        print("Default load address: 32768")
        sys.exit(1)
    
    bin_path = sys.argv[1]
    sna_path = sys.argv[2]
    load_address = int(sys.argv[3]) if len(sys.argv) > 3 else 32768
    
    try:
        bin_to_sna(bin_path, sna_path, load_address)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()