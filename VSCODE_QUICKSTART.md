# 🚀 VS Code Quick Start Guide

Get up and running with the Code Like It's 198x development environment in VS Code.

## ⚡ 30-Second Setup

```bash
# 1. Clone the repository
git clone https://github.com/code198x/dev-environment.git
cd dev-environment

# 2. Open in VS Code
code code198x.code-workspace

# 3. When prompted, click "Reopen in Container"
# 4. When prompted, click "Install Recommended Extensions"
# 5. Start coding retro assembly! 🕹️
```

## 🎯 First Steps

### **Create Your First Project**

1. Press `Ctrl+Shift+P` (Command Palette)
2. Type "Tasks: Run Task"
3. Select "🟤 Create New C64 Project"
4. Enter a project name like "hello"

### **Build and Run**

1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "🟤 Build C64 PRG"
4. Enter your project path: `hello/hello`
5. Press `F5` to launch in emulator

## 🛠️ Development Workflow

### **Command Palette (`Ctrl+Shift+P`)**

Your main tool for everything:

- **Build commands** - Compile your assembly
- **Create projects** - New program templates
- **Open shells** - System-specific environments
- **Debug tools** - Diagnose build issues

### **Quick Tasks (`F1`)**

Fast access to build tasks:

- F1 → Build commands appear at top
- Arrow keys to select
- Enter to run

### **File Explorer**

- **Nested files** - Build outputs group under source
- **Multi-root workspace** - Each system gets its own folder
- **Examples** - Browse sample code for all systems

## 🕹️ System-Specific Development

### **🟤 Commodore 64**

```
Projects: 🟤 Commodore 64/your-project/
Examples: 📚 Examples/commodore-64/
Commands: 🟤 Build C64 PRG/Disk/Tape
Shell:    🟤 Open C64 Development Shell
```

**Quick Start:**

1. Type `c64-header` + Tab for program template
2. Add your code between `start:` and `rts`
3. Build with `🟤 Build C64 PRG`
4. Run with VICE emulator

### **🌈 ZX Spectrum**

```
Projects: 🌈 ZX Spectrum/your-project/
Examples: 📚 Examples/zx-spectrum/
Commands: 🌈 Build Spectrum TAP/TZX
Shell:    🌈 Open Spectrum Development Shell
```

**Quick Start:**

1. Type `spectrum-header` + Tab for program template
2. Use Z80 assembly instructions
3. Build with `🌈 Build Spectrum TAP`
4. Run with Fuse emulator

### **🎮 Nintendo Entertainment System**

```
Projects: 🎮 Nintendo Entertainment System/your-project/
Examples: 📚 Examples/nintendo-entertainment-system/
Commands: 🎮 Build NES ROM
Shell:    🎮 Open NES Development Shell
```

**Quick Start:**

1. Type `nes-header` + Tab for ROM template
2. Set up PPU, sprites, and graphics
3. Build with `🎮 Build NES ROM`
4. Run with FCEux emulator

### **🟦 Commodore Amiga**

```
Projects: 🟦 Commodore Amiga/your-project/
Examples: 📚 Examples/commodore-amiga/
Commands: 🟦 Build Amiga Executable/ADF
Shell:    🟦 Open Amiga Development Shell
```

**Quick Start:**

1. Type `amiga-header` + Tab for program template
2. Use 68000 assembly with OS calls
3. Build with `🟦 Build Amiga Executable`
4. Run with FS-UAE emulator

## 📝 Code Snippets

Type these prefixes and press `Tab` for instant code:

### **Universal**

- `asm-comment` - Function header with documentation
- `asm-loop` - Basic loop structure
- `asm-data` - Data declaration block

### **System-Specific**

- `c64-sprite` - C64 sprite setup
- `spectrum-border` - ZX Spectrum border color
- `nes-vblank` - NES vertical blank wait
- `amiga-library` - Amiga library opening

## 🔧 Build System

### **Make Commands**

The integrated build system uses Make:

- `make setup` - Initialize environment
- `make new-c64 NAME=hello` - Create C64 project
- `make build-c64 PROJECT=hello` - Build C64 program
- `make test-all` - Test all compilers

### **Build Outputs**

Each build creates:

- **Binary** - .prg, .tap, .nes, etc.
- **Listing** - .lst assembly listing
- **Symbols** - .sym symbol table
- **Report** - .json build information

### **Error Handling**

Build errors appear directly in VS Code:

- **Red squiggles** - Syntax errors
- **Problems panel** - All issues listed
- **Click to jump** - Go directly to error line

## 🎮 Emulator Integration

### **Running Programs**

1. Build your program first
2. Press `F5` or use Debug menu
3. Select emulator launcher
4. Follow setup instructions

### **Supported Emulators**

- **C64:** VICE (x64)
- **Spectrum:** Fuse, ZEsarUX
- **NES:** FCEux, Nestopia, Mesen
- **Amiga:** FS-UAE, WinUAE

### **Online Alternatives**

- **C64:** https://c64online.com
- **Spectrum:** https://torinak.com/qaop
- **NES:** https://jsnes.org
- **Amiga:** Various browser-based UAE

## 📚 Learning Resources

### **Examples Progression**

Each system includes 4 examples:

1. **Hello World** - Basic I/O and setup
2. **Graphics/Colors** - Visual effects
3. **Sprites/Animation** - Moving objects
4. **Advanced Features** - Hardware-specific

### **Documentation**

- **Inline comments** - Every line explained
- **README files** - Concept overviews
- **CLAUDE.md** - Project documentation
- **.vscode/README.md** - VS Code specific help

## ⌨️ Keyboard Shortcuts

### **Essential**

- `Ctrl+Shift+P` - Command palette (most important!)
- `F1` - Quick task runner
- `F5` - Run/Debug
- `Ctrl+`` - Toggle terminal

### **Navigation**

- `Ctrl+P` - Quick file open
- `Ctrl+Shift+O` - Go to symbol/label
- `F12` - Go to definition
- `Alt+Left/Right` - Navigate back/forward

### **Editing**

- `Alt+Click` - Multiple cursors
- `Ctrl+D` - Select next occurrence
- `Shift+Alt+Down` - Duplicate line
- `Ctrl+/` - Toggle comment

## 🚨 Troubleshooting

### **Container Issues**

**Problem:** "Reopen in Container" doesn't work
**Solution:**

1. Ensure Docker Desktop is running
2. Check Docker has enough RAM (4GB+)
3. Try: `Ctrl+Shift+P` → "Remote-Containers: Rebuild Container"

**Problem:** Extensions not installing
**Solution:**

1. Wait for container to fully start (check bottom-left corner)
2. Install manually from Extensions tab
3. Reload VS Code if needed

### **Build Issues**

**Problem:** "Command not found" errors
**Solution:**

1. Run "🔧 Debug Assembly Build Process"
2. Check that Docker containers are built
3. Try: `make setup` in terminal

**Problem:** No syntax highlighting
**Solution:**

1. Install "x86 and x86_64 Assembly" extension
2. Check file has .asm or .s extension
3. Right-click file → "Change Language Mode" → "Assembly"

### **Performance**

**Problem:** Slow startup
**Solution:**

1. Allocate more RAM to Docker (8GB recommended)
2. Use SSD storage
3. Close other resource-intensive applications

## 💡 Pro Tips

1. **Keep Command Palette handy** - `Ctrl+Shift+P` is your best friend
2. **Use the workspace file** - Open `code198x.code-workspace`, not the folder
3. **Study examples first** - Each system has progressive difficulty
4. **Build frequently** - Catch errors early
5. **Use snippets** - Type prefix + Tab for boilerplate code
6. **Check build reports** - JSON files contain useful compilation info
7. **Learn emulator controls** - Each has different keyboard mappings
8. **Join the community** - Share your retro creations!

## 🎉 Ready to Code!

You now have a professional retro development environment with:

- ✅ 4 authentic assemblers (CA65, SjASMPlus, VASM, NESASM)
- ✅ 16+ example programs
- ✅ Full VS Code integration
- ✅ Emulator launchers
- ✅ Modern tooling for vintage platforms

**Start with an example:**

1. Browse `📚 Examples/commodore-64/01-hello-world/`
2. Read the README
3. Build with `🟤 Build C64 PRG`
4. Run with `F5`

Welcome to retro assembly programming! 🕹️✨
