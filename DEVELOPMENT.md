# Code Like It's 198x - Development Environment Setup

This document describes how to set up the complete development environment for Code Like It's 198x, including all the retro development tools needed for each platform.

## Quick Start with VS Code Dev Containers

The easiest way to get started is using VS Code with Dev Containers:

1. **Prerequisites**:
   - [VS Code](https://code.visualstudio.com/)
   - [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Setup**:
   ```bash
   git clone https://github.com/code198x/website
   cd website
   code .
   ```

3. **Open in Container**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Select "Dev Containers: Reopen in Container"
   - Wait for container to build (first time only)

4. **Start Developing**:
   - All tools are pre-installed and ready to use
   - Type `tool-info` to see what's available

## Manual Installation

If you prefer to install tools manually on your system:

### Common Requirements

All platforms need:
- **Git** - Version control
- **Make** - Build automation
- **Python 3** - For tooling scripts

### Commodore 64

**Assembler**: ACME or CC65
```bash
# Install ACME
wget https://github.com/meonwax/acme/archive/refs/heads/main.zip
unzip main.zip && cd acme-main && make && sudo cp acme /usr/local/bin/

# OR install CC65
wget https://github.com/cc65/cc65/archive/refs/tags/V2.19.tar.gz
tar xzf V2.19.tar.gz && cd cc65-2.19
make PREFIX=/usr/local && sudo make PREFIX=/usr/local install
```

**Emulator**: VICE
```bash
# macOS
brew install vice

# Ubuntu/Debian
sudo apt-get install vice

# Windows
# Download from https://vice-emu.sourceforge.io/
```

### ZX Spectrum

**Assembler**: SjASMPlus
```bash
wget https://github.com/z00m128/sjasmplus/archive/refs/heads/master.zip
unzip master.zip && cd sjasmplus-master && make
sudo cp sjasmplus /usr/local/bin/
```

**Emulator**: Fuse
```bash
# macOS
brew install fuse-emulator

# Ubuntu/Debian
sudo apt-get install fuse-emulator

# Windows
# Download from http://fuse-emulator.sourceforge.net/
```

### Nintendo Entertainment System

**Assembler**: CA65 (from CC65)
```bash
# Install CC65 (includes ca65 and ld65)
wget https://github.com/cc65/cc65/archive/refs/tags/V2.19.tar.gz
tar xzf V2.19.tar.gz && cd cc65-2.19
make PREFIX=/usr/local && sudo make PREFIX=/usr/local install
```

**Emulator**: FCEUX
```bash
# macOS
brew install fceux

# Ubuntu/Debian
sudo apt-get install fceux

# Windows
# Download from https://fceux.com/
```

### Commodore Amiga

**Assembler**: VASM
```bash
wget http://sun.hasenbraten.de/vasm/release/vasm.tar.gz
tar xzf vasm.tar.gz && cd vasm
make CPU=m68k SYNTAX=mot
sudo cp vasm68k_mot /usr/local/bin/
sudo cp vobjdump /usr/local/bin/
```

**ADF Tools**: amitools
```bash
pip3 install amitools
```

**Emulator**: FS-UAE
```bash
# macOS
brew install fs-uae

# Ubuntu/Debian
sudo apt-get install fs-uae

# Windows
# Download from https://fs-uae.net/
```

## Development Workflow

### Building Projects

Each platform has standardized build commands:

```bash
# Commodore 64
build-c64 cosmic-harvester.asm

# ZX Spectrum  
build-spectrum quantum-shatter.asm

# NES
build-nes underground-assault.s

# Amiga
build-amiga turbo-horizon.s
make-adf turbo-horizon
```

### Project Structure

```
code-samples/
├── commodore-64/
│   └── phase-1/tier-1/lesson-001/
├── zx-spectrum/
│   └── phase-1/tier-1/lesson-001/
├── nintendo-entertainment-system/
│   └── phase-1/tier-1/lesson-001/
└── commodore-amiga/
    └── phase-1/tier-1/lesson-001/
```

### Testing

Each lesson includes:
- **Source code** - The main assembly program
- **Makefile** - Build automation
- **README.md** - Platform-specific instructions
- **Build outputs** - ROM files, disk images, etc.

## VS Code Extensions

The dev container includes these helpful extensions:

- **Assembly Language Support** - Syntax highlighting
- **Hex Editor** - View binary files
- **Makefile Tools** - Build integration
- **Git Lens** - Enhanced Git support
- **Spell Checker** - Documentation quality

## Troubleshooting

### Common Issues

1. **"Command not found"**:
   - Check PATH includes `/usr/local/bin`
   - Verify tool installation: `which <tool-name>`

2. **"Permission denied"**:
   - Make scripts executable: `chmod +x script.sh`
   - Check file ownership

3. **Build failures**:
   - Verify source file syntax
   - Check include paths
   - Review error messages carefully

### Getting Help

- **Discord**: [Code Like It's 198x Community](https://discord.gg/code198x)
- **GitHub Issues**: [Report bugs and request features](https://github.com/code198x/website/issues)
- **Documentation**: [Full lesson documentation](https://www.codelikeits198x.com/docs)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.