# ROM Files for Emulators

This directory contains ROM files required for certain emulators to function properly.

## Directory Structure

```
/public/roms/
├── c64/           # Commodore 64 ROM files
├── nes/           # Nintendo Entertainment System ROM files  
├── amiga/         # Commodore Amiga ROM files
└── README.md      # This file
```

## Required ROM Files

### Commodore 64 (`/public/roms/c64/`)

For full C64 emulation, you need:

- **basic** - Commodore 64 BASIC ROM (8KB)
- **kernal** - Commodore 64 KERNAL ROM (8KB) 
- **chargen** - Character generator ROM (4KB)

**Legal Note**: These ROM files are copyrighted by Commodore. You must own a Commodore 64 to legally use these ROM files. They are not included in this repository.

### Nintendo Entertainment System (`/public/roms/nes/`)

NES emulation can work without ROM files as our implementation creates minimal ROM images programmatically. However, for enhanced compatibility, you may add:

- NTSC timing ROM files (optional)

### Commodore Amiga (`/public/roms/amiga/`)

For Amiga emulation, you may need:

- **kick13.rom** - Kickstart 1.3 ROM (256KB)
- **kick20.rom** - Kickstart 2.0 ROM (512KB)
- **kick31.rom** - Kickstart 3.1 ROM (512KB)

**Legal Note**: Kickstart ROM files are copyrighted by Commodore/Amiga Technologies. You must own an Amiga computer to legally use these ROM files.

**Alternative**: The emulators can use the free AROS ROM replacement which provides similar functionality.

## ZX Spectrum

JSSpeccy does not require separate ROM files as they are included in the emulator distribution.

## How to Add ROM Files

1. **Obtain Legal ROM Files**: Ensure you have legal access to the ROM files (own the original hardware)

2. **Copy to Correct Directory**: Place ROM files in the appropriate subdirectory

3. **Verify File Names**: Ensure ROM files have the correct names as expected by the emulators

4. **Test Emulation**: Visit `/demo-emulators` to test emulator functionality

## Emulator Fallbacks

All emulators include fallback implementations that work without ROM files:

- **C64**: Simple canvas-based emulator with basic 6502 instruction support
- **ZX Spectrum**: Full JSSpeccy implementation (ROM included)
- **NES**: Canvas-based emulator with minimal 6502 and PPU simulation
- **Amiga**: Canvas-based emulator with basic 68000 instruction support

## Testing Without ROM Files

You can test the educational components immediately:

1. **Assembly Code Execution**: Basic instruction simulation works without ROMs
2. **Visual Concepts**: All visualization components work independently  
3. **Interactive Examples**: Code editing and explanation features work
4. **Debugging Tools**: Register state and memory visualization work

## Development Notes

### Adding New ROM Support

To add support for additional ROM files:

1. Update the emulator configuration in `/public/js/emulators/[system].js`
2. Add ROM file detection logic
3. Implement fallback behavior when ROMs are unavailable
4. Update this README file

### Testing Emulator Integration

```bash
# Start development server
npm run dev

# Visit emulator demo page
# http://localhost:4321/demo-emulators

# Test individual lesson pages with emulators
# http://localhost:4321/lessons/commodore-64/phase-1/tier-1/lesson-001
```

## Security Notes

- ROM files are served statically and cached by browsers
- No ROM files are included in version control
- Users must provide their own legally-obtained ROM files
- The application works without ROM files using fallback emulators

## Troubleshooting

### Emulator Not Loading
1. Check browser console for JavaScript errors
2. Verify ROM files are in correct locations
3. Ensure ROM files have correct names and sizes
4. Try the fallback emulator (should always work)

### Performance Issues
1. WebAssembly emulators require modern browsers
2. Large ROM files may take time to load initially
3. Consider browser caching for repeated visits

### Browser Compatibility
- **Chrome/Edge**: Full WebAssembly support
- **Firefox**: Full support (some restrictions on shared memory)
- **Safari**: Good support, may have some limitations
- **Mobile**: Canvas fallbacks work well on mobile devices

## Legal Compliance

This project respects intellectual property rights:

- No copyrighted ROM files are distributed
- Users must obtain ROM files through legal means
- Educational use falls under fair use in many jurisdictions
- Emulation is legal when using legally-obtained ROM files

For questions about ROM file legality, consult legal counsel familiar with intellectual property law in your jurisdiction.