#!/usr/bin/env python3
"""
Create Amiga ADF disk image with executable
Creates a bootable or non-bootable ADF with the compiled program
"""

import sys
import struct
import os
from pathlib import Path

# ADF constants
ADF_SIZE = 901120  # Standard DD disk (880KB)
SECTOR_SIZE = 512
SECTORS_PER_TRACK = 11
TRACKS_PER_SIDE = 80
SIDES = 2
ROOT_BLOCK = 880  # Middle of the disk

def calculate_checksum(data):
    """Calculate Amiga block checksum"""
    checksum = 0
    for i in range(0, len(data), 4):
        if i == 20:  # Skip checksum field itself
            continue
        value = struct.unpack('>I', data[i:i+4])[0]
        checksum += value
        if checksum > 0xFFFFFFFF:
            checksum = (checksum & 0xFFFFFFFF) + 1
    return (~checksum) & 0xFFFFFFFF

def create_empty_adf():
    """Create empty ADF disk image"""
    return bytearray(ADF_SIZE)

def write_bootblock(adf_data, bootable=False):
    """Write boot block to ADF"""
    boot_block = bytearray(1024)  # 2 sectors
    
    if bootable:
        # DOS signature for bootable disk
        boot_block[0:3] = b'DOS'
        boot_block[3] = 0  # Flags
        
        # Simple boot code that does nothing
        # moveq #0,d0 ; rts
        boot_code = bytes([0x70, 0x00, 0x4E, 0x75])
        boot_block[12:12+len(boot_code)] = boot_code
    else:
        # Non-bootable disk signature
        boot_block[0:3] = b'DOS'
        boot_block[3] = 1  # Non-bootable flag
    
    # Calculate and set boot block checksum
    for i in range(4, 1024):
        boot_block[i] = 0
    
    # Simple checksum for boot block
    checksum = 0
    for i in range(0, 1024, 4):
        if i >= 4:  # Skip DOS header
            value = struct.unpack('>I', boot_block[i:i+4])[0]
            checksum += value
    
    if bootable:
        boot_block[4:8] = struct.pack('>I', (~checksum) & 0xFFFFFFFF)
    
    adf_data[0:1024] = boot_block

def write_root_block(adf_data, disk_name="Workbench"):
    """Write root directory block"""
    root_block_data = bytearray(SECTOR_SIZE)
    
    # Block type (2 = T_HEADER)
    root_block_data[0:4] = struct.pack('>I', 2)
    
    # Header key (self-pointer)
    root_block_data[4:8] = struct.pack('>I', ROOT_BLOCK)
    
    # High seq (always 0 for root)
    root_block_data[8:12] = struct.pack('>I', 0)
    
    # Hash table size
    root_block_data[12:16] = struct.pack('>I', 72)
    
    # First data (0 for directory)
    root_block_data[16:20] = struct.pack('>I', 0)
    
    # Checksum (calculated later)
    root_block_data[20:24] = struct.pack('>I', 0)
    
    # Hash table (72 entries)
    for i in range(72):
        root_block_data[24 + i*4:24 + (i+1)*4] = struct.pack('>I', 0)
    
    # Bitmap flag
    root_block_data[312:316] = struct.pack('>I', 0xFFFFFFFF)
    
    # Bitmap pages (for now, we'll use a simple bitmap)
    root_block_data[316:320] = struct.pack('>I', 881)  # Bitmap block
    
    # Bitmap extension
    root_block_data[320:324] = struct.pack('>I', 0)
    
    # Days since 1978-01-01
    days = 0  # We'll use epoch
    root_block_data[420:424] = struct.pack('>I', days)
    
    # Minutes since midnight
    root_block_data[424:428] = struct.pack('>I', 0)
    
    # Ticks (1/50 sec)
    root_block_data[428:432] = struct.pack('>I', 0)
    
    # Name length and name
    name_bytes = disk_name.encode('latin-1')[:30]
    root_block_data[432] = len(name_bytes)
    root_block_data[433:433+len(name_bytes)] = name_bytes
    
    # Creation date (same as modification)
    root_block_data[476:480] = struct.pack('>I', days)
    root_block_data[480:484] = struct.pack('>I', 0)
    root_block_data[484:488] = struct.pack('>I', 0)
    
    # Next link
    root_block_data[496:500] = struct.pack('>I', 0)
    
    # Parent dir (0 for root)
    root_block_data[500:504] = struct.pack('>I', 0)
    
    # Extension
    root_block_data[504:508] = struct.pack('>I', 0)
    
    # Sec type (1 = ST_ROOT)
    root_block_data[508:512] = struct.pack('>I', 1)
    
    # Calculate checksum
    checksum = calculate_checksum(root_block_data)
    root_block_data[20:24] = struct.pack('>I', checksum)
    
    # Write root block
    offset = ROOT_BLOCK * SECTOR_SIZE
    adf_data[offset:offset+SECTOR_SIZE] = root_block_data

def write_bitmap_block(adf_data):
    """Write bitmap block showing which blocks are free"""
    bitmap_block = bytearray(SECTOR_SIZE)
    
    # Mark all blocks as free initially (1 = free, 0 = used)
    for i in range(SECTOR_SIZE//4):
        bitmap_block[i*4:(i+1)*4] = struct.pack('>I', 0xFFFFFFFF)
    
    # Mark used blocks
    # Boot blocks (0-1)
    bitmap_block[0] &= 0x3F  # Clear bits for blocks 0-1
    
    # Root block (880)
    block_word = 880 // 32
    block_bit = 880 % 32
    mask = ~(1 << (31 - block_bit))
    current = struct.unpack('>I', bitmap_block[block_word*4:(block_word+1)*4])[0]
    bitmap_block[block_word*4:(block_word+1)*4] = struct.pack('>I', current & mask)
    
    # Bitmap block itself (881)
    block_word = 881 // 32
    block_bit = 881 % 32
    mask = ~(1 << (31 - block_bit))
    current = struct.unpack('>I', bitmap_block[block_word*4:(block_word+1)*4])[0]
    bitmap_block[block_word*4:(block_word+1)*4] = struct.pack('>I', current & mask)
    
    # Write bitmap block
    offset = 881 * SECTOR_SIZE
    adf_data[offset:offset+SECTOR_SIZE] = bitmap_block

def add_file_to_adf(adf_data, exe_path, amiga_name):
    """Add executable file to ADF (simplified version)"""
    # For now, we'll just note that the file should be added
    # A full implementation would need to:
    # 1. Find free blocks
    # 2. Create file header block
    # 3. Write file data blocks
    # 4. Update directory hash table
    # 5. Update bitmap
    
    print(f"Note: File '{amiga_name}' would be added to ADF")
    print("For a fully functional ADF, use UAE or similar tools to copy files")

def create_adf(exe_path, adf_path, amiga_name, bootable=False):
    """Create ADF disk image with executable"""
    
    print(f"Creating ADF disk image: {adf_path}")
    
    # Create empty ADF
    adf_data = create_empty_adf()
    
    # Write boot block
    write_bootblock(adf_data, bootable)
    
    # Write root block
    write_root_block(adf_data, "Code198x")
    
    # Write bitmap
    write_bitmap_block(adf_data)
    
    # Add executable (simplified)
    if os.path.exists(exe_path):
        add_file_to_adf(adf_data, exe_path, amiga_name)
    
    # Write ADF file
    with open(adf_path, 'wb') as f:
        f.write(adf_data)
    
    print(f"✅ ADF disk image created: {adf_path}")
    print(f"Size: {len(adf_data)} bytes")
    print(f"Type: {'Bootable' if bootable else 'Non-bootable'} disk")
    print("")
    print("To use this disk:")
    print("1. Insert in DF0: in an Amiga emulator")
    print("2. Use a tool like UAE to copy your executable to the disk")
    print("3. Or use 'transdisk' or similar to write to real floppy")

def main():
    if len(sys.argv) < 3:
        print("Usage: create_adf.py <executable> <output.adf> [amiga_name] [--bootable]")
        sys.exit(1)
    
    exe_path = sys.argv[1]
    adf_path = sys.argv[2]
    amiga_name = sys.argv[3] if len(sys.argv) > 3 else Path(exe_path).stem
    bootable = "--bootable" in sys.argv
    
    try:
        create_adf(exe_path, adf_path, amiga_name, bootable)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()