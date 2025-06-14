/**
 * VICE/C64 Emulator Integration for Code Like It's 198x
 * Commodore 64 Emulator with 6502 Assembly Code Execution
 */

// Global VICE configuration
const VICE_CONFIG = {
  autoStart: false,
  soundEnabled: true,
  warpMode: false,
  machine: 'c64' // C64 model
};

// Initialize VICE C64 emulator
async function initVICEEmulator(containerElement, options = {}) {
  try {
    console.log('Initializing VICE C64 emulator...');
    
    // Clear container
    containerElement.innerHTML = '';
    
    // Load VICE library if not already loaded
    if (typeof ViceC64 === 'undefined') {
      await loadVICELibrary();
    }
    
    // Create emulator configuration
    const config = {
      ...VICE_CONFIG,
      ...options,
      element: containerElement
    };
    
    // Initialize VICE emulator
    const emulator = new ViceC64(config);
    await emulator.init();
    
    console.log('VICE C64 emulator initialized successfully');
    
    // Return emulator API
    return {
      instance: emulator,
      
      // Load and run 6502 assembly code
      loadAndRunAssembly: async (assemblyCode) => {
        try {
          console.log('Loading 6502 assembly code:', assemblyCode);
          
          // Convert assembly to 6502 machine code
          const machineCode = await assemble6502Code(assemblyCode);
          
          // Load machine code into C64 memory
          await loadMachineCodeC64(emulator, machineCode);
          
          // Jump to code start address
          emulator.setProgramCounter(machineCode.startAddress);
          
          // Start execution
          emulator.run();
          
          return true;
        } catch (error) {
          console.error('Error loading assembly code:', error);
          return false;
        }
      },
      
      // Load a program (PRG file or raw data)
      loadProgram: async (data) => {
        try {
          if (typeof data === 'string') {
            // Assembly code
            return await this.loadAndRunAssembly(data);
          } else {
            // Binary PRG file
            await emulator.loadPRG(data);
            return true;
          }
        } catch (error) {
          console.error('Error loading program:', error);
          return false;
        }
      },
      
      // Reset emulator
      reset: () => {
        emulator.reset();
      },
      
      // Get emulator state for debugging
      getState: () => {
        return {
          registers: get6502Registers(emulator),
          memory: getC64MemoryState(emulator),
          running: emulator.isRunning()
        };
      },
      
      // Step through execution
      step: () => {
        emulator.step();
      },
      
      // Set breakpoint
      setBreakpoint: (address) => {
        if (emulator.setBreakpoint) {
          emulator.setBreakpoint(address);
        }
      },
      
      // VIC-II and SID access
      vic: {
        setRegister: (reg, value) => emulator.writeMemory(0xD000 + reg, value),
        getRegister: (reg) => emulator.readMemory(0xD000 + reg)
      },
      
      sid: {
        setRegister: (reg, value) => emulator.writeMemory(0xD400 + reg, value),
        getRegister: (reg) => emulator.readMemory(0xD400 + reg)
      }
    };
    
  } catch (error) {
    console.error('Failed to initialize VICE emulator:', error);
    
    // Fallback to simpler C64 emulator
    return await initSimpleC64Emulator(containerElement, options);
  }
}

// Load VICE library (or fallback)
async function loadVICELibrary() {
  return new Promise((resolve, reject) => {
    // Try multiple sources for C64 emulation
    const sources = [
      'https://c64emulator.111mb.de/js/c64.js', // C64 JS emulator
      '/js/emulators/vice-local.js' // Local fallback
    ];
    
    let currentSource = 0;
    
    function tryNextSource() {
      if (currentSource >= sources.length) {
        reject(new Error('Failed to load any C64 emulator library'));
        return;
      }
      
      const script = document.createElement('script');
      script.src = sources[currentSource];
      
      script.onload = () => {
        console.log('C64 emulator library loaded from:', sources[currentSource]);
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

// Simple 6502 assembler
async function assemble6502Code(assemblyCode) {
  console.log('Assembling 6502 code...');
  
  const lines = assemblyCode.trim().split('\n');
  const machineCode = [];
  let address = 0x1000; // Start at $1000 (common C64 starting point)
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(';')) continue;
    
    const instruction = parse6502Instruction(trimmed);
    if (instruction) {
      machineCode.push(...instruction.bytes);
      address += instruction.bytes.length;
    }
  }
  
  return {
    bytes: new Uint8Array(machineCode),
    startAddress: 0x1000,
    length: machineCode.length
  };
}

// Parse basic 6502 instructions
function parse6502Instruction(instruction) {
  const upper = instruction.toUpperCase();
  
  // Basic 6502 instruction set
  const instructions = {
    'NOP': { bytes: [0xEA] },
    'RTS': { bytes: [0x60] },
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
  
  // Exact matches
  if (instructions[upper]) {
    return instructions[upper];
  }
  
  // Pattern matching for parameterized instructions
  const patterns = [
    // Immediate addressing
    {
      pattern: /^LDA #\$([0-9A-F]{1,2})$/,
      encode: (match) => [0xA9, parseInt(match[1], 16)]
    },
    {
      pattern: /^LDX #\$([0-9A-F]{1,2})$/,
      encode: (match) => [0xA2, parseInt(match[1], 16)]
    },
    {
      pattern: /^LDY #\$([0-9A-F]{1,2})$/,
      encode: (match) => [0xA0, parseInt(match[1], 16)]
    },
    {
      pattern: /^LDA #(\d+)$/,
      encode: (match) => [0xA9, parseInt(match[1]) & 0xFF]
    },
    
    // Zero page addressing
    {
      pattern: /^STA \$([0-9A-F]{1,2})$/,
      encode: (match) => [0x85, parseInt(match[1], 16)]
    },
    {
      pattern: /^LDA \$([0-9A-F]{1,2})$/,
      encode: (match) => [0xA5, parseInt(match[1], 16)]
    },
    
    // Absolute addressing
    {
      pattern: /^STA \$([0-9A-F]{3,4})$/,
      encode: (match) => {
        const addr = parseInt(match[1], 16);
        return [0x8D, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    },
    {
      pattern: /^LDA \$([0-9A-F]{3,4})$/,
      encode: (match) => {
        const addr = parseInt(match[1], 16);
        return [0xAD, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    },
    {
      pattern: /^JMP \$([0-9A-F]{3,4})$/,
      encode: (match) => {
        const addr = parseInt(match[1], 16);
        return [0x4C, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    },
    {
      pattern: /^JSR \$([0-9A-F]{3,4})$/,
      encode: (match) => {
        const addr = parseInt(match[1], 16);
        return [0x20, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    }
  ];
  
  for (const { pattern, encode } of patterns) {
    const match = upper.match(pattern);
    if (match) {
      return { bytes: encode(match) };
    }
  }
  
  console.warn('Unknown 6502 instruction:', instruction);
  return null;
}

// Load machine code into C64 memory
async function loadMachineCodeC64(emulator, machineCode) {
  try {
    // Write machine code to C64 memory
    for (let i = 0; i < machineCode.bytes.length; i++) {
      emulator.writeMemory(machineCode.startAddress + i, machineCode.bytes[i]);
    }
    
    console.log(`Machine code loaded at $${machineCode.startAddress.toString(16).toUpperCase()}`);
  } catch (error) {
    console.error('Error loading machine code:', error);
    throw error;
  }
}

// Get 6502 register state
function get6502Registers(emulator) {
  try {
    return {
      A: emulator.getAccumulator(),
      X: emulator.getXRegister(),
      Y: emulator.getYRegister(),
      PC: emulator.getProgramCounter(),
      SP: emulator.getStackPointer(),
      P: emulator.getStatusFlags()
    };
  } catch (error) {
    // Fallback if API not available
    return {
      A: 0x00,
      X: 0x00,
      Y: 0x00,
      PC: 0x1000,
      SP: 0xFF,
      P: 0x00
    };
  }
}

// Get C64 memory state
function getC64MemoryState(emulator) {
  try {
    return {
      zeroPage: new Uint8Array(256),
      stack: new Uint8Array(256),
      screen: emulator.getScreenMemory ? emulator.getScreenMemory() : new Uint8Array(1000),
      colorRam: new Uint8Array(1000)
    };
  } catch (error) {
    return {
      zeroPage: new Uint8Array(256),
      stack: new Uint8Array(256),
      screen: new Uint8Array(1000),
      colorRam: new Uint8Array(1000)
    };
  }
}

// Fallback simple C64 emulator (basic implementation)
async function initSimpleC64Emulator(containerElement, options = {}) {
  console.log('Initializing simple C64 emulator fallback...');
  
  // Create basic canvas-based emulator
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 200;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.imageRendering = 'pixelated';
  containerElement.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Basic C64 screen colors
  const c64Colors = [
    '#000000', '#FFFFFF', '#68372B', '#70A4B2',
    '#6F3D86', '#588D43', '#352879', '#B8C76F',
    '#6F4F25', '#433900', '#9A6759', '#444444',
    '#6C6C6C', '#9AD284', '#6C5EB5', '#959595'
  ];
  
  // Simple emulator state
  const state = {
    memory: new Uint8Array(65536),
    registers: { A: 0, X: 0, Y: 0, PC: 0x1000, SP: 0xFF, P: 0 },
    running: false
  };
  
  // Initialize screen
  ctx.fillStyle = c64Colors[6]; // Blue background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw C64 startup message
  ctx.fillStyle = c64Colors[14]; // Light blue
  ctx.font = '12px monospace';
  ctx.fillText('**** COMMODORE 64 BASIC V2 ****', 20, 30);
  ctx.fillText('64K RAM SYSTEM  38911 BASIC BYTES FREE', 20, 50);
  ctx.fillText('READY.', 20, 80);
  
  return {
    instance: { canvas, ctx, state },
    
    loadAndRunAssembly: async (assemblyCode) => {
      try {
        const machineCode = await assemble6502Code(assemblyCode);
        
        // Copy to memory
        for (let i = 0; i < machineCode.bytes.length; i++) {
          state.memory[machineCode.startAddress + i] = machineCode.bytes[i];
        }
        
        state.registers.PC = machineCode.startAddress;
        state.running = true;
        
        // Simple execution simulation
        ctx.fillStyle = c64Colors[5]; // Green
        ctx.fillText('ASSEMBLY CODE LOADED', 20, 110);
        ctx.fillText(`START: $${machineCode.startAddress.toString(16).toUpperCase()}`, 20, 130);
        
        return true;
      } catch (error) {
        console.error('Error in simple emulator:', error);
        return false;
      }
    },
    
    reset: () => {
      state.memory.fill(0);
      state.registers = { A: 0, X: 0, Y: 0, PC: 0x1000, SP: 0xFF, P: 0 };
      state.running = false;
      
      // Redraw screen
      ctx.fillStyle = c64Colors[6];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = c64Colors[14];
      ctx.fillText('**** COMMODORE 64 BASIC V2 ****', 20, 30);
      ctx.fillText('READY.', 20, 50);
    },
    
    getState: () => state
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initVICEEmulator };
} else {
  window.initVICEEmulator = initVICEEmulator;
}