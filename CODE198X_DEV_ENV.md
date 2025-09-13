# Code Like It's 198x - Development Environment

**Professional retro development toolchain for vintage computer programming**

This development environment provides authentic cross-compilation tools for:

- 🟤 **Commodore 64** (6502 Assembly)
- 🔴 **ZX Spectrum** (Z80 Assembly)
- 🎮 **Nintendo Entertainment System** (6502 Assembly)
- 🔵 **Commodore Amiga** (68000 Assembly)

## What You Get

✅ **Professional assemblers** (CA65, ACME, VASM, SjASMPlus)
✅ **Real output formats** (PRG, D64, TAP, NES, ADF)
✅ **Modern development workflow** (Docker, Make, VS Code)
✅ **Zero configuration** - just run and compile
✅ **Same tools** used by modern homebrew developers

## Quick Start

### 1. Prerequisites

- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/downloads)
- **Text Editor** - [VS Code recommended](https://code.visualstudio.com/)

### 2. Get the Development Environment

```bash
# Download the development environment
# (Will be available as a GitHub repository)
git clone https://github.com/stevehill/code198x-dev-env.git
cd code198x-dev-env

# Start the development containers
docker-compose pull
docker-compose up -d

# Verify everything is working
make test-all
```

### 3. Your First Program

```bash
# Create a new C64 program
make new-c64 NAME=hello

# Edit the source file
# Edit: projects/c64/hello/hello.asm

# Compile it
make build-c64 PROJECT=hello

# Output: projects/c64/hello/build/hello.prg
```

### 4. Load into Emulator

- **Install VICE C64 Emulator**: https://vice-emu.sourceforge.io/
- **Load your PRG file**: File → Autostart Disk/Tape Image
- **Run your program**: `RUN` or `SYS 2049`

## Development Workflow

### Project Structure

```
projects/
├── c64/
│   ├── hello/
│   │   ├── hello.asm      # Your assembly source
│   │   ├── Makefile       # Build configuration
│   │   └── build/         # Compiled outputs
│   └── advanced/
└── spectrum/
    ├── border/
    └── graphics/
```

### Compilation Commands

```bash
# Commodore 64
make build-c64 PROJECT=myprogram        # → PRG file
make build-c64-disk PROJECT=myprogram   # → D64 disk image
make build-c64-tape PROJECT=myprogram   # → TAP tape image

# ZX Spectrum
make build-spectrum PROJECT=myprogram   # → TAP file
make build-spectrum-tzx PROJECT=myprogram # → TZX file

# Nintendo Entertainment System
make build-nes PROJECT=myprogram        # → NES ROM

# Commodore Amiga
make build-amiga PROJECT=myprogram      # → Executable
make build-amiga-disk PROJECT=myprogram # → ADF disk
```

### Advanced Features

```bash
# Clean builds
make clean-c64 PROJECT=myprogram

# Debug builds with symbols
make debug-c64 PROJECT=myprogram

# Multi-file projects
make build-c64-multifile PROJECT=bigprogram

# Custom assembler options
make build-c64 PROJECT=myprogram ASSEMBLER=acme
```

## Emulator Setup Guides

### VICE (Commodore 64)

1. **Download**: https://vice-emu.sourceforge.io/
2. **Install** and run `x64sc` (accurate C64 emulator)
3. **Load PRG**: File → Autostart Disk/Tape Image → Select your .prg file
4. **Run**: Type `RUN` and press Enter

### Fuse (ZX Spectrum)

1. **Download**: http://fuse-emulator.sourceforge.net/
2. **Load TAP**: File → Open → Select your .tap file
3. **Run**: Press Enter (usually auto-loads)

### FCEUX (NES)

1. **Download**: https://fceux.com/
2. **Load ROM**: File → Open ROM → Select your .nes file
3. **Play**: ROM starts automatically

### WinUAE (Amiga)

1. **Download**: https://www.winuae.net/
2. **Load ADF**: DF0: → Select your .adf file
3. **Boot**: Click Reset or Power

## Example Projects Included

### Commodore 64

- **hello** - Display text on screen
- **colors** - Change border and background colors
- **sprite** - Basic sprite movement
- **music** - SID chip sound example
- **scrolltext** - Classic demo effect

### ZX Spectrum

- **border** - Change border colors
- **beeper** - Make sounds with the beeper
- **graphics** - Draw to the screen
- **loading** - Tape loading effects

### Nintendo Entertainment System

- **hello** - Basic NES ROM structure
- **controller** - Read joypad input
- **sprites** - Display and move sprites
- **background** - Set background graphics

### Commodore Amiga

- **workbench** - Basic executable
- **copper** - Hardware programming
- **blitter** - Graphics acceleration
- **paula** - Audio programming

## Troubleshooting

### Docker Issues

```bash
# Restart containers
docker-compose down
docker-compose up -d

# Rebuild containers
docker-compose build --no-cache

# Check container status
docker-compose ps
```

### Compilation Errors

```bash
# View detailed build logs
make build-c64 PROJECT=myprogram VERBOSE=1

# Test individual assemblers
docker run --rm code198x/c64-compiler ca65 --version
```

### File Permissions (Linux/Mac)

```bash
# Fix ownership of generated files
sudo chown -R $USER:$USER projects/
```

## VS Code Integration

### Recommended Extensions

- **Assembly (6502)** - Syntax highlighting for 6502 assembly
- **Z80 Assembly** - Syntax highlighting for Z80 assembly
- **Docker** - Container management
- **Makefile Tools** - Makefile support

### Dev Container Setup

The environment includes VS Code dev container configuration:

```bash
# Open in VS Code with dev container
code .
# VS Code will prompt to "Reopen in Container"
```

## Learning Path

### Beginner (Start Here)

1. **Follow the website lessons** at https://code198x.stevehill.xyz
2. **Complete example projects** in order
3. **Experiment with modifications**
4. **Learn emulator basics**

### Intermediate

1. **Create original programs** from scratch
2. **Combine multiple systems** in projects
3. **Study professional game source code**
4. **Join retro development communities**

### Advanced

1. **Optimize for size and speed**
2. **Create development tools**
3. **Contribute to emulator projects**
4. **Release homebrew games**

## Getting Help

- **Website**: https://code198x.stevehill.xyz
- **Course Lessons**: Follow the structured lessons on the website
- **Example Projects**: Study the included example code
- **Emulator Documentation**: Check individual emulator websites for help

## Contributing

Development environment improvements and example projects welcome!

## License

This development environment is open source under the MIT License.
Individual assemblers and tools may have their own licenses.

---

**Happy Retro Coding!** 🕹️✨
