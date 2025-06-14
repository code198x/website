/**
 * vAmiga Integration for Code Like It's 198x
 * Commodore Amiga Emulator with 68000 Assembly Code Execution
 */

// Global vAmiga configuration
const VAMIGA_CONFIG = {
  autoStart: false,
  machine: 'A500', // Amiga 500
  chipRam: 512,    // 512KB Chip RAM
  slowRam: 512,    // 512KB Slow RAM
  kickstart: null  // Will be loaded if available
};

// Initialize vAmiga emulator
async function initVAmigaEmulator(containerElement, options = {}) {
  try {
    console.log('Initializing vAmiga emulator...');
    
    // Clear container
    containerElement.innerHTML = '';
    
    // Load vAmiga library if not already loaded
    if (typeof vAmiga === 'undefined') {
      await loadVAmigaLibrary();
    }
    
    // Create emulator configuration
    const config = {
      ...VAMIGA_CONFIG,
      ...options,
      element: containerElement
    };
    
    // Initialize vAmiga
    const emulator = new vAmiga(config);
    await emulator.init();
    
    console.log('vAmiga emulator initialized successfully');
    
    // Return emulator API
    return {
      instance: emulator,
      
      // Load and run 68000 assembly code
      loadAndRunAssembly: async (assemblyCode) => {
        try {
          console.log('Loading 68000 assembly code:', assemblyCode);
          
          // Convert assembly to 68000 machine code
          const machineCode = await assemble68000Code(assemblyCode);
          
          // Load machine code into Amiga memory
          await loadMachineCodeAmiga(emulator, machineCode);
          
          // Set program counter and start execution
          emulator.setProgramCounter(machineCode.startAddress);
          emulator.run();
          
          return true;
        } catch (error) {
          console.error('Error loading assembly code:', error);
          return false;
        }
      },
      
      // Load an Amiga executable
      loadProgram: async (data) => {
        try {
          if (typeof data === 'string') {
            // Assembly code
            return await this.loadAndRunAssembly(data);
          } else {
            // Binary executable
            await emulator.loadExecutable(data);
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
          registers: get68000Registers(emulator),
          memory: getAmigaMemoryState(emulator),
          running: emulator.isRunning()
        };
      },
      
      // Step through execution
      step: () => {
        emulator.step();
      },
      
      // Custom chip access
      custom: {
        writeRegister: (reg, value) => emulator.writeCustom(reg, value),
        readRegister: (reg) => emulator.readCustom(reg)
      },
      
      // CIA access
      cia: {
        writeRegister: (chip, reg, value) => emulator.writeCIA(chip, reg, value),
        readRegister: (chip, reg) => emulator.readCIA(chip, reg)
      }
    };
    
  } catch (error) {
    console.error('Failed to initialize vAmiga emulator:', error);
    // Fallback to simple Amiga emulator
    return await initSimpleAmigaEmulator(containerElement, options);
  }
}

// Load vAmiga library
async function loadVAmigaLibrary() {
  return new Promise((resolve, reject) => {
    const sources = [
      'https://vamigaweb.github.io/js/vamiga.js',
      '/js/emulators/vamiga-local.js'
    ];
    
    let currentSource = 0;
    
    function tryNextSource() {
      if (currentSource >= sources.length) {
        reject(new Error('Failed to load vAmiga library'));
        return;
      }
      
      const script = document.createElement('script');
      script.src = sources[currentSource];
      
      script.onload = () => {
        console.log('vAmiga library loaded from:', sources[currentSource]);
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

// Assemble 68000 code
async function assemble68000Code(assemblyCode) {
  console.log('Assembling 68000 code...');
  
  const lines = assemblyCode.trim().split('\n');
  const machineCode = [];
  let address = 0x1000; // Start at $1000 (common Amiga starting point)
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(';')) continue;
    
    const instruction = parse68000Instruction(trimmed);
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

// Parse 68000 instructions
function parse68000Instruction(instruction) {
  const upper = instruction.toUpperCase();
  
  // Basic 68000 instruction set
  const instructions = {
    'NOP': { bytes: [0x4E, 0x71] },
    'RTS': { bytes: [0x4E, 0x75] },
    'RTR': { bytes: [0x4E, 0x77] },
    'RTE': { bytes: [0x4E, 0x73] },
    'RESET': { bytes: [0x4E, 0x70] },
    'STOP #$2000': { bytes: [0x4E, 0x72, 0x20, 0x00] },
    'STOP #$2700': { bytes: [0x4E, 0x72, 0x27, 0x00] },
    'TRAPV': { bytes: [0x4E, 0x76] },
    'UNLK A6': { bytes: [0x4E, 0x5E] },
    'UNLK A7': { bytes: [0x4E, 0x5F] }
  };
  
  if (instructions[upper]) {
    return instructions[upper];
  }
  
  // Pattern matching for 68000 instructions
  const patterns = [
    // MOVE instructions
    {
      pattern: /^MOVE\.W #\$([0-9A-F]{1,4}),D([0-7])$/,
      encode: (match) => {
        const immediate = parseInt(match[1], 16);
        const reg = parseInt(match[2]);
        return [0x30, 0x3C + reg, (immediate >> 8) & 0xFF, immediate & 0xFF];
      }
    },
    {
      pattern: /^MOVE\.L #\$([0-9A-F]{1,8}),D([0-7])$/,
      encode: (match) => {
        const immediate = parseInt(match[1], 16);
        const reg = parseInt(match[2]);
        return [
          0x20, 0x3C + reg,
          (immediate >> 24) & 0xFF,
          (immediate >> 16) & 0xFF,
          (immediate >> 8) & 0xFF,
          immediate & 0xFF
        ];
      }
    },
    {
      pattern: /^MOVE\.W D([0-7]),D([0-7])$/,
      encode: (match) => {
        const src = parseInt(match[1]);
        const dst = parseInt(match[2]);
        return [0x30, 0x00 + (dst << 1) + src];
      }
    },
    {
      pattern: /^MOVE\.L D([0-7]),D([0-7])$/,
      encode: (match) => {
        const src = parseInt(match[1]);
        const dst = parseInt(match[2]);
        return [0x20, 0x00 + (dst << 1) + src];
      }
    },
    
    // MOVEQ instruction (quick move)
    {
      pattern: /^MOVEQ #\$([0-9A-F]{1,2}),D([0-7])$/,
      encode: (match) => {
        const immediate = parseInt(match[1], 16) & 0xFF;
        const reg = parseInt(match[2]);
        return [0x70 + reg, immediate];
      }
    },
    {
      pattern: /^MOVEQ #(-?\d+),D([0-7])$/,
      encode: (match) => {
        const immediate = parseInt(match[1]) & 0xFF;
        const reg = parseInt(match[2]);
        return [0x70 + reg, immediate];
      }
    },
    
    // LEA instruction
    {
      pattern: /^LEA \$([0-9A-F]{1,8}),A([0-7])$/,
      encode: (match) => {
        const address = parseInt(match[1], 16);
        const reg = parseInt(match[2]);
        return [
          0x41 + (reg << 1), 0xF9,
          (address >> 24) & 0xFF,
          (address >> 16) & 0xFF,
          (address >> 8) & 0xFF,
          address & 0xFF
        ];
      }
    },
    
    // JSR instruction
    {
      pattern: /^JSR \$([0-9A-F]{1,8})$/,
      encode: (match) => {
        const address = parseInt(match[1], 16);
        return [
          0x4E, 0xB9,
          (address >> 24) & 0xFF,
          (address >> 16) & 0xFF,
          (address >> 8) & 0xFF,
          address & 0xFF
        ];
      }
    },
    
    // JMP instruction
    {
      pattern: /^JMP \$([0-9A-F]{1,8})$/,
      encode: (match) => {
        const address = parseInt(match[1], 16);
        return [
          0x4E, 0xF9,
          (address >> 24) & 0xFF,
          (address >> 16) & 0xFF,
          (address >> 8) & 0xFF,
          address & 0xFF
        ];
      }
    },
    
    // ADD instructions
    {
      pattern: /^ADD\.W #\$([0-9A-F]{1,4}),D([0-7])$/,
      encode: (match) => {
        const immediate = parseInt(match[1], 16);
        const reg = parseInt(match[2]);
        return [0x06, 0x40 + reg, (immediate >> 8) & 0xFF, immediate & 0xFF];
      }
    },
    {
      pattern: /^ADD\.L #\$([0-9A-F]{1,8}),D([0-7])$/,
      encode: (match) => {
        const immediate = parseInt(match[1], 16);
        const reg = parseInt(match[2]);
        return [
          0x06, 0x80 + reg,
          (immediate >> 24) & 0xFF,
          (immediate >> 16) & 0xFF,
          (immediate >> 8) & 0xFF,
          immediate & 0xFF
        ];
      }
    }
  ];
  
  for (const { pattern, encode } of patterns) {
    const match = upper.match(pattern);
    if (match) {
      return { bytes: encode(match) };
    }
  }
  
  console.warn('Unknown 68000 instruction:', instruction);
  return null;
}

// Load machine code into Amiga memory
async function loadMachineCodeAmiga(emulator, machineCode) {
  try {
    // Write machine code to Amiga memory
    for (let i = 0; i < machineCode.bytes.length; i++) {
      emulator.writeMemory(machineCode.startAddress + i, machineCode.bytes[i]);
    }
    
    console.log(`68000 machine code loaded at $${machineCode.startAddress.toString(16).toUpperCase()}`);
  } catch (error) {
    console.error('Error loading machine code:', error);
    throw error;
  }
}

// Get 68000 register state
function get68000Registers(emulator) {
  try {
    return {
      D0: emulator.getDataRegister(0),
      D1: emulator.getDataRegister(1),
      D2: emulator.getDataRegister(2),
      D3: emulator.getDataRegister(3),
      D4: emulator.getDataRegister(4),
      D5: emulator.getDataRegister(5),
      D6: emulator.getDataRegister(6),
      D7: emulator.getDataRegister(7),
      A0: emulator.getAddressRegister(0),
      A1: emulator.getAddressRegister(1),
      A2: emulator.getAddressRegister(2),
      A3: emulator.getAddressRegister(3),
      A4: emulator.getAddressRegister(4),
      A5: emulator.getAddressRegister(5),
      A6: emulator.getAddressRegister(6),
      A7: emulator.getAddressRegister(7), // Stack pointer
      PC: emulator.getProgramCounter(),
      SR: emulator.getStatusRegister()
    };
  } catch (error) {
    // Fallback register state
    return {
      D0: 0x00000000, D1: 0x00000000, D2: 0x00000000, D3: 0x00000000,
      D4: 0x00000000, D5: 0x00000000, D6: 0x00000000, D7: 0x00000000,
      A0: 0x00000000, A1: 0x00000000, A2: 0x00000000, A3: 0x00000000,
      A4: 0x00000000, A5: 0x00000000, A6: 0x00000000, A7: 0x00080000,
      PC: 0x00001000, SR: 0x2700
    };
  }
}

// Get Amiga memory state
function getAmigaMemoryState(emulator) {
  try {
    return {
      chipRam: emulator.getChipRam(),
      slowRam: emulator.getSlowRam(),
      custom: emulator.getCustomRegisters(),
      cia: emulator.getCIARegisters()
    };
  } catch (error) {
    return {
      chipRam: new Uint8Array(524288), // 512KB
      slowRam: new Uint8Array(524288), // 512KB
      custom: new Uint8Array(512),
      cia: new Uint8Array(32)
    };
  }
}

// Simple Amiga emulator fallback
async function initSimpleAmigaEmulator(containerElement, options = {}) {
  console.log('Initializing simple Amiga emulator fallback...');
  
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 256;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.imageRendering = 'pixelated';
  containerElement.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Amiga Workbench colors
  const amigaColors = {
    blue: '#0055AA',
    orange: '#FF8800',
    white: '#FFFFFF',
    black: '#000055',
    gray: '#AAAAAA'
  };
  
  // Draw Workbench-style screen
  ctx.fillStyle = amigaColors.blue;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title bar
  ctx.fillStyle = amigaColors.orange;
  ctx.fillRect(0, 0, canvas.width, 20);
  
  ctx.fillStyle = amigaColors.white;
  ctx.font = '12px sans-serif';
  ctx.fillText('Workbench 1.3', 10, 15);
  
  // Window
  ctx.fillStyle = amigaColors.gray;
  ctx.fillRect(50, 50, 540, 150);
  ctx.strokeStyle = amigaColors.white;
  ctx.strokeRect(50, 50, 540, 150);
  
  ctx.fillStyle = amigaColors.black;
  ctx.font = '14px monospace';
  ctx.fillText('Commodore Amiga 500', 70, 80);
  ctx.fillText('68000 Assembly Demo', 70, 100);
  ctx.fillText('Kickstart 1.3', 70, 120);
  
  const state = {
    memory: new Uint8Array(1048576), // 1MB
    registers: {
      D0: 0, D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0, D7: 0,
      A0: 0, A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0, A7: 0x80000,
      PC: 0x1000, SR: 0x2700
    },
    running: false
  };
  
  return {
    instance: { canvas, ctx, state },
    
    loadAndRunAssembly: async (assemblyCode) => {
      try {
        const machineCode = await assemble68000Code(assemblyCode);
        
        for (let i = 0; i < machineCode.bytes.length; i++) {
          state.memory[machineCode.startAddress + i] = machineCode.bytes[i];
        }
        
        state.registers.PC = machineCode.startAddress;
        state.running = true;
        
        ctx.fillStyle = amigaColors.orange;
        ctx.fillText('68000 CODE LOADED', 70, 150);
        ctx.fillText(`START: $${machineCode.startAddress.toString(16).toUpperCase()}`, 70, 170);
        
        return true;
      } catch (error) {
        console.error('Error in simple Amiga emulator:', error);
        return false;
      }
    },
    
    reset: () => {
      state.memory.fill(0);
      state.registers = {
        D0: 0, D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0, D7: 0,
        A0: 0, A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0, A7: 0x80000,
        PC: 0x1000, SR: 0x2700
      };
      state.running = false;
      
      // Redraw screen
      ctx.fillStyle = amigaColors.blue;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = amigaColors.orange;
      ctx.fillRect(0, 0, canvas.width, 20);
      ctx.fillStyle = amigaColors.white;
      ctx.fillText('Workbench 1.3', 10, 15);
    },
    
    getState: () => state
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initVAmigaEmulator };
} else {
  window.initVAmigaEmulator = initVAmigaEmulator;
}