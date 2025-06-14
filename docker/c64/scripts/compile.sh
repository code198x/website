#!/bin/bash
# Commodore 64 Assembly Compilation Script
# Supports multiple assemblers and output formats

set -e

# Configuration
SOURCE_FILE="$1"
OUTPUT_NAME="${2:-program}"
ASSEMBLER="${3:-ca65}"  # ca65, acme
FORMAT="${4:-prg}"      # prg, d64, tap

echo "🟤 Commodore 64 Compilation Starting..."
echo "Source: $SOURCE_FILE"
echo "Output: $OUTPUT_NAME"
echo "Assembler: $ASSEMBLER"
echo "Format: $FORMAT"

# Validate input
if [ ! -f "/workspace/src/$SOURCE_FILE" ]; then
    echo "❌ Error: Source file not found: $SOURCE_FILE"
    exit 1
fi

cd /workspace/build

case $ASSEMBLER in
    "ca65")
        echo "🔧 Using CA65 assembler..."
        
        # Assemble with CA65
        ca65 "/workspace/src/$SOURCE_FILE" -o "$OUTPUT_NAME.o" -l "$OUTPUT_NAME.lst"
        
        # Link with LD65
        ld65 "$OUTPUT_NAME.o" -C c64-asm.cfg -o "$OUTPUT_NAME.prg"
        
        echo "✅ CA65 compilation successful"
        ;;
        
    "acme")
        echo "🔧 Using ACME assembler..."
        
        # Assemble with ACME
        acme -f cbm -o "$OUTPUT_NAME.prg" "/workspace/src/$SOURCE_FILE"
        
        echo "✅ ACME compilation successful"
        ;;
        
    *)
        echo "❌ Error: Unknown assembler: $ASSEMBLER"
        echo "Supported assemblers: ca65, acme"
        exit 1
        ;;
esac

# Generate output based on format
case $FORMAT in
    "prg")
        echo "📦 Creating PRG file..."
        cp "$OUTPUT_NAME.prg" "/output/$OUTPUT_NAME.prg"
        ;;
        
    "d64")
        echo "💾 Creating D64 disk image..."
        c1541 -format "code198x,00" d64 "/output/$OUTPUT_NAME.d64"
        c1541 -attach "/output/$OUTPUT_NAME.d64" -write "$OUTPUT_NAME.prg" "$OUTPUT_NAME"
        ;;
        
    "tap")
        echo "📼 Creating TAP tape image..."
        # Convert PRG to TAP format (basic implementation)
        python3 /workspace/scripts/prg2tap.py "$OUTPUT_NAME.prg" "/output/$OUTPUT_NAME.tap"
        ;;
        
    *)
        echo "❌ Error: Unknown format: $FORMAT"
        echo "Supported formats: prg, d64, tap"
        exit 1
        ;;
esac

# Generate compilation report
cat > "/output/$OUTPUT_NAME.report.json" << EOF
{
    "system": "commodore-64",
    "source_file": "$SOURCE_FILE",
    "output_name": "$OUTPUT_NAME",
    "assembler": "$ASSEMBLER",
    "format": "$FORMAT",
    "timestamp": "$(date -Iseconds)",
    "size_bytes": $(stat -c%s "/output/$OUTPUT_NAME.$FORMAT"),
    "success": true
}
EOF

# Copy listing file if it exists
if [ -f "$OUTPUT_NAME.lst" ]; then
    cp "$OUTPUT_NAME.lst" "/output/$OUTPUT_NAME.lst"
fi

echo "🎉 Compilation complete!"
echo "Output files generated in /output/"
ls -la /output/$OUTPUT_NAME.*