#!/bin/bash
# Setup script for Code Like It's 198x development environment
# This script creates useful aliases and tools for retro development

echo "🕹️  Setting up Code Like It's 198x development environment..."

# Create helpful build scripts
cat > /workspace/bin/build-c64 << 'EOF'
#!/bin/bash
# Build Commodore 64 program
if [ -z "$1" ]; then
    echo "Usage: build-c64 <source.asm>"
    exit 1
fi

acme -f cbm -o "${1%.*}.prg" "$1"
echo "Built ${1%.*}.prg"
EOF

cat > /workspace/bin/build-spectrum << 'EOF'
#!/bin/bash
# Build ZX Spectrum program
if [ -z "$1" ]; then
    echo "Usage: build-spectrum <source.asm>"
    exit 1
fi

sjasmplus "$1"
echo "Built ${1%.*}.tap"
EOF

cat > /workspace/bin/build-nes << 'EOF'
#!/bin/bash
# Build NES program
if [ -z "$1" ]; then
    echo "Usage: build-nes <source.s> [config.cfg]"
    exit 1
fi

CONFIG=${2:-nes.cfg}
OBJ="${1%.*}.o"
ROM="${1%.*}.nes"

ca65 "$1" -o "$OBJ" && \
ld65 -C "$CONFIG" -o "$ROM" "$OBJ" && \
echo "Built $ROM"
EOF

cat > /workspace/bin/build-amiga << 'EOF'
#!/bin/bash
# Build Amiga program
if [ -z "$1" ]; then
    echo "Usage: build-amiga <source.s>"
    exit 1
fi

vasmm68k_mot -Fhunkexe -nosym -kick1hunks -o "${1%.*}" "$1"
echo "Built ${1%.*}"
EOF

cat > /workspace/bin/make-adf << 'EOF'
#!/bin/bash
# Create ADF disk image
if [ -z "$1" ]; then
    echo "Usage: make-adf <executable> [disk-name]"
    exit 1
fi

EXE="$1"
DISK_NAME="${2:-GameDisk}"
ADF="${EXE%.*}.adf"

# Create and format ADF
xdftool "$ADF" format "$DISK_NAME"

# Create startup-sequence
xdftool "$ADF" makedir s
echo "$EXE" > startup-sequence
xdftool "$ADF" write startup-sequence s/startup-sequence
rm startup-sequence

# Add executable
xdftool "$ADF" write "$EXE"

echo "Created $ADF"
xdftool "$ADF" list
EOF

# Make all scripts executable
chmod +x /workspace/bin/*

# Create useful aliases
cat >> /home/developer/.bashrc << 'EOF'

# Code Like It's 198x aliases
alias build-c64='/workspace/bin/build-c64'
alias build-spectrum='/workspace/bin/build-spectrum'
alias build-nes='/workspace/bin/build-nes'
alias build-amiga='/workspace/bin/build-amiga'
alias make-adf='/workspace/bin/make-adf'

# Navigation aliases
alias projects='cd /workspace/projects'
alias examples='cd /workspace/examples'

# Tool version info
alias tool-info='echo "🕹️  Installed Tools:"; echo ""; ca65 -V 2>&1 | head -1; acme --version 2>&1 | head -1; sjasmplus --version 2>&1 | head -1; vasmm68k_mot -V 2>&1 | head -1; xdftool --version 2>&1 | head -1'
EOF

echo "✅ Development environment setup complete!"
echo ""
echo "Available commands:"
echo "  build-c64      - Build Commodore 64 programs"
echo "  build-spectrum - Build ZX Spectrum programs"  
echo "  build-nes      - Build NES programs"
echo "  build-amiga    - Build Amiga programs"
echo "  make-adf       - Create Amiga ADF disk images"
echo "  tool-info      - Show installed tool versions"
echo ""
echo "Happy coding! 🚀"