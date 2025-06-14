#!/bin/bash
# Commodore Amiga 68000 Assembly Compilation Script
# Supports VASM assembler and generates Amiga executables

set -e

# Configuration
SOURCE_FILE="$1"
OUTPUT_NAME="${2:-program}"
ASSEMBLER="${3:-vasm}"  # vasm (only one for now, but extensible)
FORMAT="${4:-exe}"      # exe, adf

echo "🟦 Amiga Compilation Starting..."
echo "Source: $SOURCE_FILE"
echo "Output: $OUTPUT_NAME"
echo "Assembler: $ASSEMBLER"
echo "Format: $FORMAT"

# Validate input
if [ ! -f "/workspace/projects/commodore-amiga/$SOURCE_FILE" ]; then
    echo "❌ Error: Source file not found: $SOURCE_FILE"
    exit 1
fi

# Create build directory
BUILD_DIR="/workspace/projects/commodore-amiga/$(dirname $SOURCE_FILE)/build"
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

case $ASSEMBLER in
    "vasm")
        echo "🔧 Using VASM assembler..."
        
        # Assemble with VASM
        # -Fhunkexe: Create Amiga hunk executable format
        # -kick1hunks: Compatible with Kickstart 1.x
        # -nosym: No symbols in output
        vasm68k_mot -Fhunkexe -kick1hunks -nosym \
                    -o "$OUTPUT_NAME" \
                    "/workspace/projects/commodore-amiga/$SOURCE_FILE"
        
        echo "✅ VASM compilation successful"
        ;;
        
    *)
        echo "❌ Error: Unknown assembler: $ASSEMBLER"
        echo "Supported assemblers: vasm"
        exit 1
        ;;
esac

# Check if executable was created
if [ ! -f "$OUTPUT_NAME" ]; then
    echo "❌ Error: No executable generated"
    exit 1
fi

# Generate output based on format
case $FORMAT in
    "exe")
        echo "📦 Amiga executable ready"
        # Executable already exists, nothing more to do
        ;;
        
    "adf")
        echo "💾 Creating ADF disk image..."
        # Create ADF disk image with the executable
        python3 /workspace/scripts/create_adf.py "$OUTPUT_NAME" "$OUTPUT_NAME.adf" "$OUTPUT_NAME"
        ;;
        
    *)
        echo "❌ Error: Unknown format: $FORMAT"
        echo "Supported formats: exe, adf"
        exit 1
        ;;
esac

# Get executable size for report
EXE_SIZE=$(stat -c%s "$OUTPUT_NAME" 2>/dev/null || echo "0")

# Analyze executable with vobjdump
HUNK_INFO=""
if which vobjdump >/dev/null 2>&1; then
    HUNK_INFO=$(vobjdump -h "$OUTPUT_NAME" 2>/dev/null || echo "No hunk info available")
fi

# Generate compilation report
cat > "$OUTPUT_NAME.report.json" << EOF
{
    "system": "commodore-amiga",
    "source_file": "$SOURCE_FILE",
    "output_name": "$OUTPUT_NAME",
    "assembler": "$ASSEMBLER",
    "format": "$FORMAT",
    "timestamp": "$(date -Iseconds)",
    "executable_size_bytes": $EXE_SIZE,
    "target": "68000",
    "success": true
}
EOF

# Generate listing file
if [ -f "$OUTPUT_NAME.lst" ]; then
    echo "📋 Listing file generated: $OUTPUT_NAME.lst"
fi

echo "🎉 Compilation complete!"
echo "Output files:"
ls -la "$OUTPUT_NAME"*
echo ""
echo "To run on an Amiga:"
echo "1. Copy $OUTPUT_NAME to an Amiga or emulator"
echo "2. Open CLI/Shell"
echo "3. Type: $OUTPUT_NAME"