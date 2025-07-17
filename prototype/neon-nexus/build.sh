#!/bin/bash
# Build script for Neon Nexus prototype

echo "Building Neon Nexus..."
acme -f cbm -o neon-nexus.prg neon-nexus-complete.s

if [ $? -eq 0 ]; then
    echo "Build successful! Generated neon-nexus.prg"
    echo "To run: x64sc neon-nexus.prg"
    echo "Then type: RUN"
else
    echo "Build failed!"
    exit 1
fi