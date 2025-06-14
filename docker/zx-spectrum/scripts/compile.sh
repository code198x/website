#!/bin/bash
# ZX Spectrum Z80 Assembly Compilation Script
# Supports multiple assemblers and output formats

set -e

# Configuration
SOURCE_FILE="$1"
OUTPUT_NAME="${2:-program}"
ASSEMBLER="${3:-sjasmplus}"  # sjasmplus, pasmo, z80asm
FORMAT="${4:-tap}"           # tap, tzx, sna, bin

echo "🔴 ZX Spectrum Compilation Starting..."
echo "Source: $SOURCE_FILE"
echo "Output: $OUTPUT_NAME"
echo "Assembler: $ASSEMBLER"
echo "Format: $FORMAT"

# Validate input
if [ ! -f "/workspace/projects/zx-spectrum/$SOURCE_FILE" ]; then
    echo "❌ Error: Source file not found: $SOURCE_FILE"
    exit 1
fi

# Create build directory
BUILD_DIR="/workspace/projects/zx-spectrum/$(dirname $SOURCE_FILE)/build"
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

case $ASSEMBLER in
    "sjasmplus")
        echo "🔧 Using SjASMPlus assembler..."
        
        # Assemble with SjASMPlus
        sjasmplus "/workspace/projects/zx-spectrum/$SOURCE_FILE" \
                  --lst="$OUTPUT_NAME.lst" \
                  --sym="$OUTPUT_NAME.sym"
        
        # SjASMPlus creates output.bin by default, rename it
        if [ -f "output.bin" ]; then
            mv output.bin "$OUTPUT_NAME.bin"
        fi
        
        echo "✅ SjASMPlus compilation successful"
        ;;
        
    "pasmo")
        echo "🔧 Using Pasmo assembler..."
        
        # Assemble with Pasmo
        pasmo "/workspace/projects/zx-spectrum/$SOURCE_FILE" \
              "$OUTPUT_NAME.bin" \
              "$OUTPUT_NAME.lst"
        
        echo "✅ Pasmo compilation successful"
        ;;
        
    "z80asm")
        echo "🔧 Using Z80ASM assembler..."
        
        # Assemble with Z80ASM
        z80asm -o "$OUTPUT_NAME.bin" \
               -l "$OUTPUT_NAME.lst" \
               "/workspace/projects/zx-spectrum/$SOURCE_FILE"
        
        echo "✅ Z80ASM compilation successful"
        ;;
        
    *)
        echo "❌ Error: Unknown assembler: $ASSEMBLER"
        echo "Supported assemblers: sjasmplus, pasmo, z80asm"
        exit 1
        ;;
esac

# Check if binary was created
if [ ! -f "$OUTPUT_NAME.bin" ]; then
    echo "❌ Error: No binary output generated"
    exit 1
fi

# Generate output based on format
case $FORMAT in
    "bin")
        echo "📦 Creating BIN file..."
        # Binary already exists, just copy it
        cp "$OUTPUT_NAME.bin" "$OUTPUT_NAME.bin"
        ;;
        
    "tap")
        echo "📼 Creating TAP file..."
        # Create TAP file from binary
        python3 /workspace/scripts/bin2tap.py "$OUTPUT_NAME.bin" "$OUTPUT_NAME.tap" "$OUTPUT_NAME"
        ;;
        
    "tzx")
        echo "📼 Creating TZX file..."
        # Create TZX file (enhanced tape format)
        python3 /workspace/scripts/bin2tzx.py "$OUTPUT_NAME.bin" "$OUTPUT_NAME.tzx" "$OUTPUT_NAME"
        ;;
        
    "sna")
        echo "💾 Creating SNA snapshot..."
        # Create SNA snapshot file
        python3 /workspace/scripts/bin2sna.py "$OUTPUT_NAME.bin" "$OUTPUT_NAME.sna"
        ;;
        
    *)
        echo "❌ Error: Unknown format: $FORMAT"
        echo "Supported formats: bin, tap, tzx, sna"
        exit 1
        ;;
esac

# Get binary size for report
BINARY_SIZE=$(stat -c%s "$OUTPUT_NAME.bin" 2>/dev/null || echo "0")

# Generate compilation report
cat > "$OUTPUT_NAME.report.json" << EOF
{
    "system": "zx-spectrum",
    "source_file": "$SOURCE_FILE",
    "output_name": "$OUTPUT_NAME",
    "assembler": "$ASSEMBLER",
    "format": "$FORMAT",
    "timestamp": "$(date -Iseconds)",
    "binary_size_bytes": $BINARY_SIZE,
    "load_address": "32768",
    "success": true
}
EOF

# Copy listing file if it exists
if [ -f "$OUTPUT_NAME.lst" ]; then
    echo "📋 Listing file generated: $OUTPUT_NAME.lst"
fi

# Copy symbol file if it exists
if [ -f "$OUTPUT_NAME.sym" ]; then
    echo "🔍 Symbol file generated: $OUTPUT_NAME.sym"
fi

echo "🎉 Compilation complete!"
echo "Output files:"
ls -la "$OUTPUT_NAME".*