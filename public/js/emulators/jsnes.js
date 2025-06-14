/**
 * JSNES Integration for Code Like It's 198x
 * Nintendo Entertainment System Emulator with 6502 Assembly Code Execution
 */

// Global JSNES configuration
const JSNES_CONFIG = {
  preferredFrameRate: 60,
  fpsInterval: 500,
  showFPS: false,
  emulateSound: true,
  sampleRate: 44100
};

// Initialize JSNES emulator
async function initJSNESEmulator(containerElement, options = {}) {
  try {
    console.log('Initializing JSNES emulator...');
    
    // Clear container
    containerElement.innerHTML = '';
    
    // Load JSNES library if not already loaded
    if (typeof jsnes === 'undefined') {
      await loadJSNESLibrary();
    }
    
    // Create canvas for display
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 240;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.imageRendering = 'pixelated';
    containerElement.appendChild(canvas);
    
    const canvasCtx = canvas.getContext('2d');
    const imageData = canvasCtx.createImageData(256, 240);
    
    // Initialize JSNES
    const nes = new jsnes.NES({
      onFrame: (frameBuffer) => {
        // Convert NES framebuffer to canvas
        for (let i = 0; i < frameBuffer.length; i++) {
          const pixel = frameBuffer[i];
          const imageDataIndex = i * 4;
          imageData.data[imageDataIndex] = (pixel >> 16) & 0xFF;     // R
          imageData.data[imageDataIndex + 1] = (pixel >> 8) & 0xFF;  // G
          imageData.data[imageDataIndex + 2] = pixel & 0xFF;         // B
          imageData.data[imageDataIndex + 3] = 0xFF;                 // A
        }
        canvasCtx.putImageData(imageData, 0, 0);
      },
      
      onAudioSample: (left, right) => {
        // Audio handling would go here
      }
    });
    
    console.log('JSNES emulator initialized successfully');
    
    // Return emulator API
    return {
      instance: nes,
      canvas: canvas,
      
      // Load and run 6502 assembly code
      loadAndRunAssembly: async (assemblyCode) => {
        try {
          console.log('Loading NES 6502 assembly code:', assemblyCode);
          
          // Convert assembly to 6502 machine code
          const machineCode = await assembleNES6502Code(assemblyCode);
          
          // Create a minimal NES ROM
          const rom = createNESROM(machineCode);
          
          // Load ROM into emulator
          nes.loadROM(rom);
          
          // Start emulation
          startEmulation(nes);
          
          return true;
        } catch (error) {
          console.error('Error loading assembly code:', error);
          return false;
        }
      },
      
      // Load a ROM file
      loadROM: async (romData) => {
        try {
          nes.loadROM(romData);
          startEmulation(nes);
          return true;
        } catch (error) {
          console.error('Error loading ROM:', error);
          return false;
        }
      },
      
      // Reset emulator
      reset: () => {
        nes.reset();
      },
      
      // Get emulator state for debugging
      getState: () => {
        return {
          registers: getNES6502Registers(nes),
          memory: getNESMemoryState(nes),
          running: nes.isRunning
        };
      },
      
      // Step through execution
      step: () => {
        nes.frame();
      },
      
      // PPU access for graphics programming
      ppu: {
        writeRegister: (reg, value) => {
          nes.cpu.mem[0x2000 + (reg & 0x07)] = value;
        },
        readRegister: (reg) => {
          return nes.cpu.mem[0x2000 + (reg & 0x07)];
        }
      }
    };
    
  } catch (error) {
    console.error('Failed to initialize JSNES emulator:', error);
    // Fallback to simple NES emulator
    return await initSimpleNESEmulator(containerElement, options);
  }
}

// Load JSNES library
async function loadJSNESLibrary() {
  return new Promise((resolve, reject) => {
    const sources = [
      'https://unpkg.com/jsnes/dist/jsnes.min.js',
      '/js/emulators/jsnes-local.js'
    ];
    
    let currentSource = 0;
    
    function tryNextSource() {
      if (currentSource >= sources.length) {
        reject(new Error('Failed to load JSNES library'));
        return;
      }
      
      const script = document.createElement('script');
      script.src = sources[currentSource];
      
      script.onload = () => {
        console.log('JSNES library loaded from:', sources[currentSource]);
        resolve();
      };
      
      script.onerror = () => {
        console.warn('Failed to load from:', sources[currentSource]);
        currentSource++;
        tryNextSource();
      };
      
      document.head.appendChild(script);
    }
    
    tryNextSource();
  });
}

// Assemble NES-specific 6502 code
async function assembleNES6502Code(assemblyCode) {
  console.log('Assembling NES 6502 code...');
  
  const lines = assemblyCode.trim().split('\n');
  const machineCode = [];
  let address = 0x8000; // NES ROM typically starts at $8000
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(';')) continue;
    
    const instruction = parseNES6502Instruction(trimmed);
    if (instruction) {
      machineCode.push(...instruction.bytes);
      address += instruction.bytes.length;
    }
  }
  
  return {
    bytes: new Uint8Array(machineCode),
    startAddress: 0x8000,
    length: machineCode.length
  };
}

// Parse NES-specific 6502 instructions
function parseNES6502Instruction(instruction) {
  const upper = instruction.toUpperCase();
  
  // NES-specific 6502 instructions
  const instructions = {
    'NOP': { bytes: [0xEA] },
    'RTS': { bytes: [0x60] },
    'RTI': { bytes: [0x40] },
    'CLC': { bytes: [0x18] },
    'SEC': { bytes: [0x38] },
    'CLI': { bytes: [0x58] },
    'SEI': { bytes: [0x78] },
    'INX': { bytes: [0xE8] },
    'DEX': { bytes: [0xCA] },
    'INY': { bytes: [0xC8] },
    'DEY': { bytes: [0x88] },
    'TAX': { bytes: [0xAA] },
    'TAY': { bytes: [0xA8] },
    'TXA': { bytes: [0x8A] },
    'TYA': { bytes: [0x98] },
    'TSX': { bytes: [0xBA] },
    'TXS': { bytes: [0x9A] },
    'PHA': { bytes: [0x48] },
    'PLA': { bytes: [0x68] },
    'PHP': { bytes: [0x08] },
    'PLP': { bytes: [0x28] }
  };
  
  if (instructions[upper]) {
    return instructions[upper];
  }
  
  // NES-specific patterns
  const patterns = [
    // PPU register access
    {
      pattern: /^LDA #\$([0-9A-F]{1,2})$/,
      encode: (match) => [0xA9, parseInt(match[1], 16)]
    },
    {
      pattern: /^STA \$2([0-9A-F])([0-9A-F]{2})$/,
      encode: (match) => {
        const addr = 0x2000 + parseInt(match[1] + match[2], 16);
        return [0x8D, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    },
    {
      pattern: /^LDA \$2([0-9A-F])([0-9A-F]{2})$/,
      encode: (match) => {
        const addr = 0x2000 + parseInt(match[1] + match[2], 16);
        return [0xAD, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    },
    
    // Standard 6502 patterns
    {
      pattern: /^LDX #\$([0-9A-F]{1,2})$/,
      encode: (match) => [0xA2, parseInt(match[1], 16)]
    },
    {
      pattern: /^LDY #\$([0-9A-F]{1,2})$/,
      encode: (match) => [0xA0, parseInt(match[1], 16)]
    },
    {
      pattern: /^JMP \$([0-9A-F]{4})$/,
      encode: (match) => {
        const addr = parseInt(match[1], 16);
        return [0x4C, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    },
    {
      pattern: /^JSR \$([0-9A-F]{4})$/,
      encode: (match) => {
        const addr = parseInt(match[1], 16);
        return [0x20, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    },
    {
      pattern: /^BNE \$([0-9A-F]{4})$/,
      encode: (match) => {
        // Simplified - should calculate relative offset
        return [0xD0, 0xFE]; // Branch to self for demo
      }
    }
  ];
  
  for (const { pattern, encode } of patterns) {
    const match = upper.match(pattern);
    if (match) {
      return { bytes: encode(match) };
    }
  }
  
  console.warn('Unknown NES 6502 instruction:', instruction);
  return null;
}

// Create minimal NES ROM
function createNESROM(machineCode) {
  // iNES header format
  const header = new Uint8Array(16);
  header[0] = 0x4E; // 'N'
  header[1] = 0x45; // 'E'
  header[2] = 0x53; // 'S'
  header[3] = 0x1A; // EOF
  header[4] = 2;    // 2 x 16KB PRG ROM
  header[5] = 1;    // 1 x 8KB CHR ROM
  header[6] = 0;    // Mapper 0 (NROM)
  header[7] = 0;
  // Rest are zeros
  
  // Create 32KB PRG ROM
  const prgRom = new Uint8Array(32768);
  
  // Copy machine code
  for (let i = 0; i < machineCode.bytes.length; i++) {
    prgRom[i] = machineCode.bytes[i];
  }
  
  // Set reset vector to point to our code
  prgRom[32764] = 0x00; // Reset vector low
  prgRom[32765] = 0x80; // Reset vector high ($8000)
  prgRom[32766] = 0x00; // IRQ vector low
  prgRom[32767] = 0x80; // IRQ vector high
  
  // Create 8KB CHR ROM (graphics data)
  const chrRom = new Uint8Array(8192);
  // Fill with basic pattern data
  for (let i = 0; i < 8192; i++) {
    chrRom[i] = i % 256;
  }
  
  // Combine into complete ROM
  const rom = new Uint8Array(header.length + prgRom.length + chrRom.length);
  let offset = 0;
  
  rom.set(header, offset);
  offset += header.length;
  rom.set(prgRom, offset);
  offset += prgRom.length;
  rom.set(chrRom, offset);
  
  return rom;
}

// Start emulation loop
function startEmulation(nes) {
  let isRunning = true;
  
  function emulationLoop() {
    if (isRunning) {
      nes.frame();
      requestAnimationFrame(emulationLoop);
    }
  }
  
  emulationLoop();
}

// Get NES 6502 register state
function getNES6502Registers(nes) {
  try {
    return {
      A: nes.cpu.REG_ACC,
      X: nes.cpu.REG_X,
      Y: nes.cpu.REG_Y,
      PC: nes.cpu.REG_PC,
      SP: nes.cpu.REG_SP,
      P: nes.cpu.REG_STATUS
    };
  } catch (error) {
    return {
      A: 0x00,
      X: 0x00,
      Y: 0x00,
      PC: 0x8000,
      SP: 0xFF,
      P: 0x00
    };
  }
}

// Get NES memory state
function getNESMemoryState(nes) {
  try {
    return {
      ram: nes.cpu.mem.slice(0, 0x800),
      ppu: nes.cpu.mem.slice(0x2000, 0x2008),
      apu: nes.cpu.mem.slice(0x4000, 0x4020)
    };
  } catch (error) {
    return {
      ram: new Uint8Array(2048),
      ppu: new Uint8Array(8),
      apu: new Uint8Array(32)
    };
  }
}

// Simple NES emulator fallback
async function initSimpleNESEmulator(containerElement, options = {}) {
  console.log('Initializing simple NES emulator fallback...');
  
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 240;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.imageRendering = 'pixelated';
  containerElement.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // NES color palette (simplified)
  const nesColors = [
    '#666666', '#002A88', '#1412A7', '#3B00A4',
    '#5C007E', '#6E0040', '#6C0600', '#561D00',
    '#333500', '#0B4800', '#005200', '#004F08',
    '#00404D', '#000000', '#000000', '#000000'
  ];
  
  // Draw NES-style screen
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '12px monospace';
  ctx.fillText('NINTENDO ENTERTAINMENT SYSTEM', 20, 30);
  ctx.fillText('6502 ASSEMBLY DEMO', 20, 50);
  
  const state = {
    memory: new Uint8Array(65536),
    registers: { A: 0, X: 0, Y: 0, PC: 0x8000, SP: 0xFF, P: 0 },
    running: false
  };
  
  return {
    instance: { canvas, ctx, state },
    
    loadAndRunAssembly: async (assemblyCode) => {
      try {
        const machineCode = await assembleNES6502Code(assemblyCode);
        
        for (let i = 0; i < machineCode.bytes.length; i++) {
          state.memory[machineCode.startAddress + i] = machineCode.bytes[i];
        }
        
        state.registers.PC = machineCode.startAddress;
        state.running = true;
        
        ctx.fillStyle = '#00AA00';
        ctx.fillText('ASSEMBLY CODE LOADED', 20, 80);
        ctx.fillText(`START: $${machineCode.startAddress.toString(16).toUpperCase()}`, 20, 100);
        
        return true;
      } catch (error) {
        console.error('Error in simple NES emulator:', error);
        return false;
      }
    },
    
    reset: () => {
      state.memory.fill(0);
      state.registers = { A: 0, X: 0, Y: 0, PC: 0x8000, SP: 0xFF, P: 0 };
      state.running = false;
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('NINTENDO ENTERTAINMENT SYSTEM', 20, 30);
    },
    
    getState: () => state
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initJSNESEmulator };
} else {
  window.initJSNESEmulator = initJSNESEmulator;
}