#!/bin/bash
# NES 6502 Assembly Compilation Script
# Supports multiple assemblers and generates NES ROM files

set -e

# Configuration
SOURCE_FILE="$1"
OUTPUT_NAME="${2:-program}"
ASSEMBLER="${3:-ca65}"  # ca65, nesasm, asm6
FORMAT="${4:-nes}"      # nes (always NES ROM format)

echo "🎮 NES Compilation Starting..."
echo "Source: $SOURCE_FILE"
echo "Output: $OUTPUT_NAME"
echo "Assembler: $ASSEMBLER"
echo "Format: $FORMAT"

# Validate input
if [ ! -f "/workspace/projects/nintendo-entertainment-system/$SOURCE_FILE" ]; then
    echo "❌ Error: Source file not found: $SOURCE_FILE"
    exit 1
fi

# Create build directory
BUILD_DIR="/workspace/projects/nintendo-entertainment-system/$(dirname $SOURCE_FILE)/build"
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

case $ASSEMBLER in
    "ca65")
        echo "🔧 Using CA65 assembler..."
        
        # First, check if we need a linker config
        LINKER_CONFIG="/workspace/scripts/nes.cfg"
        if [ ! -f "$LINKER_CONFIG" ]; then
            # Create a basic NES linker configuration
            cat > "$LINKER_CONFIG" << 'EOF'
MEMORY {
    ZP:     start = $00,    size = $100,  type = rw, file = "";
    OAM:    start = $200,   size = $100,  type = rw, file = "";
    RAM:    start = $300,   size = $500,  type = rw, file = "";
    HDR:    start = $0,     size = $10,   type = ro, file = %O, fill = yes;
    PRG:    start = $8000,  size = $8000, type = ro, file = %O, fill = yes;
    CHR:    start = $0,     size = $2000, type = ro, file = %O, fill = yes;
}

SEGMENTS {
    HEADER:   load = HDR, type = ro;
    CODE:     load = PRG, type = ro, define = yes;
    RODATA:   load = PRG, type = ro, define = yes;
    DATA:     load = PRG, run = RAM, type = rw, define = yes;
    BSS:      load = RAM, type = bss, define = yes;
    VECTORS:  load = PRG, type = ro, start = $FFFA;
    CHARS:    load = CHR, type = ro;
    ZEROPAGE: load = ZP,  type = zp;
}
EOF
        fi
        
        # Assemble with CA65
        ca65 -o "$OUTPUT_NAME.o" "/workspace/projects/nintendo-entertainment-system/$SOURCE_FILE"
        
        # Link with LD65
        ld65 -o "$OUTPUT_NAME.nes" -C "$LINKER_CONFIG" "$OUTPUT_NAME.o"
        
        # Clean up object file
        rm -f "$OUTPUT_NAME.o"
        
        echo "✅ CA65 compilation successful"
        ;;
        
    "nesasm")
        echo "🔧 Using NESASM3 assembler..."
        
        # NESASM creates .nes directly
        nesasm -o "$OUTPUT_NAME.nes" "/workspace/projects/nintendo-entertainment-system/$SOURCE_FILE"
        
        echo "✅ NESASM3 compilation successful"
        ;;
        
    "asm6")
        echo "🔧 Using ASM6 assembler..."
        
        # ASM6 creates .nes directly
        asm6 -o "$OUTPUT_NAME.nes" "/workspace/projects/nintendo-entertainment-system/$SOURCE_FILE"
        
        echo "✅ ASM6 compilation successful"
        ;;
        
    *)
        echo "❌ Error: Unknown assembler: $ASSEMBLER"
        echo "Supported assemblers: ca65, nesasm, asm6"
        exit 1
        ;;
esac

# Check if ROM was created
if [ ! -f "$OUTPUT_NAME.nes" ]; then
    echo "❌ Error: No NES ROM generated"
    exit 1
fi

# Get ROM size for report
ROM_SIZE=$(stat -c%s "$OUTPUT_NAME.nes" 2>/dev/null || echo "0")

# Analyze ROM header
PRG_BANKS=0
CHR_BANKS=0
MAPPER=0

if [ -f "$OUTPUT_NAME.nes" ]; then
    # Read iNES header (16 bytes)
    HEADER=$(od -An -tx1 -N16 "$OUTPUT_NAME.nes" | tr -d ' \n')
    if [[ ${HEADER:0:8} == "4e45531a" ]]; then  # "NES\x1a"
        PRG_BANKS=$((16#${HEADER:8:2}))
        CHR_BANKS=$((16#${HEADER:10:2}))
        MAPPER=$(( (16#${HEADER:12:2} >> 4) | (16#${HEADER:14:2} & 0xF0) ))
    fi
fi

# Generate compilation report
cat > "$OUTPUT_NAME.report.json" << EOF
{
    "system": "nintendo-entertainment-system",
    "source_file": "$SOURCE_FILE",
    "output_name": "$OUTPUT_NAME",
    "assembler": "$ASSEMBLER",
    "format": "$FORMAT",
    "timestamp": "$(date -Iseconds)",
    "rom_size_bytes": $ROM_SIZE,
    "prg_banks": $PRG_BANKS,
    "chr_banks": $CHR_BANKS,
    "mapper": $MAPPER,
    "success": true
}
EOF

echo "🎉 Compilation complete!"
echo "Output file: $OUTPUT_NAME.nes"
echo "ROM size: $ROM_SIZE bytes"
echo "PRG banks: $PRG_BANKS ($(($PRG_BANKS * 16))KB)"
echo "CHR banks: $CHR_BANKS ($(($CHR_BANKS * 8))KB)"
echo "Mapper: $MAPPER"