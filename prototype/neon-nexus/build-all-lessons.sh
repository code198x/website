#!/bin/bash
# Build all lesson files

echo "Building all Neon Nexus lessons..."

cd lessons

for i in {01..32}; do
    if [ -f "lesson-$i.s" ]; then
        echo "Building lesson $i..."
        acme -f cbm -o "lesson-$i.prg" "lesson-$i.s"
        if [ $? -eq 0 ]; then
            echo "  ✓ Lesson $i built successfully"
        else
            echo "  ✗ Lesson $i failed to build"
        fi
    else
        echo "  - Lesson $i not found (not created yet)"
    fi
done

echo "Build complete!"
echo "To test: x64sc lesson-XX.prg"