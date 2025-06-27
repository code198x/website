#!/bin/bash
# Robust C64 assembly build script

if [ -z "$1" ]; then
    echo "Usage: $0 filename (without .s extension)"
    exit 1
fi

FILENAME="$1"

echo "Building $FILENAME for C64..."

# Step 1: Assemble
echo "Assembling $FILENAME.s..."
ca65 -o "$FILENAME.o" "$FILENAME.s"
if [ $? -ne 0 ]; then
    echo "Assembly failed!"
    exit 1
fi

# Step 2: Link with config
echo "Linking..."
ld65 -C simple.cfg -o "$FILENAME.prg" "$FILENAME.o"
if [ $? -ne 0 ]; then
    echo "Linking failed!"
    exit 1
fi

echo "Success! Created $FILENAME.prg"
echo ""
echo "To run in VICE:"
echo "  x64sc $FILENAME.prg"
echo "  Then type: SYS 49152"