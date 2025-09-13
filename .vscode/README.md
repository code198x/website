# VS Code Integration for Code Like It's 198x

This directory contains VS Code configuration for the ultimate retro assembly development experience.

## 🚀 Quick Start

1. **Open in VS Code:**

   ```bash
   code code198x.code-workspace
   ```

2. **Install Recommended Extensions:**
   VS Code will prompt you to install recommended extensions. Click "Install All" for the best experience.

3. **Reopen in Container:**
   VS Code will detect the dev container and ask to reopen. Click "Reopen in Container" for the full environment.

## 🛠️ Features

### **Build System Integration**

- **Command Palette:** `Ctrl+Shift+P` → Search for build commands
- **Quick Tasks:** `Ctrl+Shift+P` → "Tasks: Run Task"
- **Keyboard Shortcuts:** `F1` for task menu

### **Available Commands**

- `🟤 Build C64 PRG` - Compile C64 assembly to .prg
- `🌈 Build Spectrum TAP` - Compile ZX Spectrum to .tap
- `🎮 Build NES ROM` - Compile NES assembly to .nes ROM
- `🟦 Build Amiga Executable` - Compile Amiga 68000 assembly

### **Project Creation**

- `🟤 Create New C64 Project`
- `🌈 Create New Spectrum Project`
- `🎮 Create New NES Project`
- `🟦 Create New Amiga Project`

### **Development Shells**

Quick access to system-specific development environments:

- `🟤 Open C64 Development Shell`
- `🌈 Open Spectrum Development Shell`
- `🎮 Open NES Development Shell`
- `🟦 Open Amiga Development Shell`

## 📁 File Organization

### **File Nesting**

Related files are automatically nested under source files:

```
hello.asm
├── hello.prg          # Compiled program
├── hello.lst          # Assembly listing
├── hello.sym          # Symbol table
└── hello.report.json  # Build report
```

### **Workspace Structure**

- **🕹️ Code Like It's 198x** - Main project
- **🟤 Commodore 64** - C64 projects
- **🌈 ZX Spectrum** - Spectrum projects
- **🎮 Nintendo Entertainment System** - NES projects
- **🟦 Commodore Amiga** - Amiga projects
- **📚 Examples** - Example code for all systems

## ⌨️ Assembly Development

### **Syntax Highlighting**

All assembly files (.asm, .s) get proper syntax highlighting optimized for:

- 6502 assembly (C64, NES)
- Z80 assembly (ZX Spectrum)
- 68000 assembly (Amiga)

### **Code Snippets**

Type these prefixes and press `Tab`:

#### Commodore 64

- `c64-header` - Program header with BASIC stub
- `c64-print` - KERNAL text output routine
- `c64-sprite` - Sprite initialization

#### ZX Spectrum

- `spectrum-header` - Program header
- `spectrum-pixel` - Screen address calculation
- `spectrum-border` - Border color change

#### NES

- `nes-header` - iNES ROM header
- `nes-ppu` - PPU palette loading
- `nes-vblank` - Wait for vertical blank

#### Amiga

- `amiga-header` - OS-compliant program header
- `amiga-library` - Library opening pattern
- `amiga-blit` - Blitter setup

#### General

- `asm-comment` - Comment header block
- `asm-loop` - Basic loop structure
- `asm-data` - Data declaration

### **Problem Detection**

Build errors are automatically highlighted in the editor with:

- **Line numbers** - Jump directly to errors
- **Error descriptions** - Understand what went wrong
- **Quick fixes** - Suggested solutions when available

## 🎮 Running Programs

### **Launch Configurations**

Use `F5` or Debug menu to run programs:

- **🟤 Run C64 Program in VICE**
- **🌈 Run Spectrum Program in Fuse**
- **🎮 Run NES ROM in Emulator**
- **🟦 Run Amiga Program in UAE**

### **Emulator Integration**

The launcher scripts provide:

- **Installation instructions** for emulators
- **Command examples** for running programs
- **Format information** for each file type
- **Quick setup guides** for first-time users

## 🔧 Customization

### **Settings**

Key settings optimized for assembly development:

- **Tab size:** 8 spaces for assembly alignment
- **Font:** Fira Code with ligatures
- **Rulers:** 40 and 80 character guides
- **File associations:** All retro formats recognized

### **Extensions**

Recommended extensions:

- **Assembly Language Support** - Syntax highlighting
- **Hex Editor** - View binary files
- **Makefile Tools** - Build system integration
- **Git Lens** - Enhanced Git features
- **Spell Checker** - Catch typos in comments

### **Themes**

Optimized for retro development:

- **GitHub Dark** - Clean, focused appearance
- **VS Code Icons** - File type recognition

## 📖 Learning Resources

### **Examples**

Each system includes progressive examples:

1. **Hello World** - Basic output
2. **Graphics/Colors** - Visual effects
3. **Sprites/Sound** - Advanced features
4. **Hardware-specific** - Unique capabilities

### **Documentation**

- **Inline comments** - Every example explained
- **README files** - Concept explanations
- **Build reports** - JSON output with details
- **CLAUDE.md** - Project documentation

## 🚨 Troubleshooting

### **Container Issues**

1. **"Reopen in Container" doesn't work:**
   - Ensure Docker is running
   - Check Docker Desktop settings
   - Try: `Ctrl+Shift+P` → "Remote-Containers: Rebuild Container"

2. **Extensions not loading:**
   - Wait for container to fully start
   - Check extension recommendations
   - Manually install from Extensions tab

3. **Build tasks not appearing:**
   - Ensure workspace is opened (not just folder)
   - Check tasks.json syntax
   - Reload VS Code

### **Assembly Issues**

1. **Syntax highlighting missing:**
   - Install "x86 and x86_64 Assembly" extension
   - Check file associations in settings.json
   - Restart VS Code

2. **Build errors:**
   - Run "🔧 Debug Assembly Build Process"
   - Check Docker containers are running
   - Verify file paths and project structure

### **Performance**

1. **Slow container startup:**
   - Allocate more RAM to Docker
   - Use SSD storage
   - Close unnecessary programs

2. **File watching issues:**
   - Exclude build directories from search
   - Adjust file watcher limits
   - Use .dockerignore for large files

## 💡 Tips & Tricks

### **Keyboard Shortcuts**

- `Ctrl+Shift+P` - Command palette (most important!)
- `Ctrl+`` - Toggle terminal
- `F1` - Task runner
- `F5` - Run/Debug
- `Ctrl+Shift+E` - Explorer
- `Ctrl+Shift+G` - Source control

### **Productivity**

1. **Multi-cursor editing:** `Alt+Click` for multiple cursors
2. **Quick file switching:** `Ctrl+P` then type filename
3. **Symbol search:** `Ctrl+Shift+O` to jump to labels
4. **Find references:** `F12` on assembly labels
5. **Breadcrumb navigation:** Click on file path segments

### **Assembly Development**

1. **Use snippets** - Type prefix + Tab for boilerplate
2. **Check build reports** - JSON files contain useful info
3. **Watch terminal output** - Build progress and errors
4. **Test frequently** - Build early and often
5. **Study examples** - Progressive complexity in each system

---

_Happy retro coding! 🕹️_
