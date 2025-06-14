/**
 * JSSpeccy 3 Integration for Code Like It's 198x
 * ZX Spectrum Emulator with Assembly Code Execution
 */

// Global JSSpeccy configuration
const JSSPECCY_CONFIG = {
  autoStart: false,
  zoom: 2,
  openUrl: null,
  machine: 'spectrum48', // Default to 48K Spectrum
  tapeAutoLoadMode: 'default'
};

// Initialize JSSpeccy emulator
async function initJSSpeccyEmulator(containerElement, options = {}) {
  try {
    console.log('Initializing JSSpeccy emulator...');
    
    // Clear container
    containerElement.innerHTML = '';
    
    // Load JSSpeccy library if not already loaded
    if (typeof JSSpeccy === 'undefined') {
      await loadJSSpeccyLibrary();
    }
    
    // Create emulator configuration
    const config = {
      ...JSSPECCY_CONFIG,
      ...options
    };
    
    // Initialize JSSpeccy
    const emulator = JSSpeccy(containerElement, config);
    
    console.log('JSSpeccy emulator initialized successfully');
    
    // Return emulator API
    return {
      instance: emulator,
      
      // Load and run assembly code
      loadAndRunAssembly: async (assemblyCode) => {
        try {
          console.log('Loading assembly code:', assemblyCode);
          
          // Convert assembly to Z80 machine code
          const machineCode = await assembleZ80Code(assemblyCode);
          
          // Load machine code into emulator
          await loadMachineCode(emulator, machineCode);
          
          // Start execution
          emulator.start();
          
          return true;
        } catch (error) {
          console.error('Error loading assembly code:', error);
          return false;
        }
      },
      
      // Load a program (TAP/TZX file or raw data)
      loadProgram: async (data) => {
        try {
          if (typeof data === 'string') {
            // Assembly code
            return await emulator.loadAndRunAssembly(data);
          } else {
            // Binary data
            await emulator.openFileBlob(data);
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
          registers: getZ80Registers(emulator),
          memory: getMemoryState(emulator),
          running: emulator.isRunning()
        };
      },
      
      // Step through execution
      step: () => {
        emulator.step();
      },
      
      // Set breakpoint
      setBreakpoint: (address) => {
        // JSSpeccy API for breakpoints (if available)
        if (emulator.setBreakpoint) {
          emulator.setBreakpoint(address);
        }
      }
    };
    
  } catch (error) {
    console.error('Failed to initialize JSSpeccy emulator:', error);
    throw error;
  }
}

// Load JSSpeccy library
async function loadJSSpeccyLibrary() {
  return new Promise((resolve, reject) => {
    // Check if we need to load from CDN or local files
    const script = document.createElement('script');
    
    // Try to load from npm CDN first
    script.src = 'https://unpkg.com/jsspeccy@3/dist/jsspeccy.js';
    script.onload = () => {
      console.log('JSSpeccy library loaded from CDN');
      resolve();
    };
    
    script.onerror = () => {
      console.warn('Failed to load JSSpeccy from CDN, trying local fallback...');
      // Try local fallback (you would need to download JSSpeccy files)
      script.src = '/js/emulators/jsspeccy-local.js';
      script.onload = resolve;
      script.onerror = () => {
        reject(new Error('Failed to load JSSpeccy library'));
      };
    };
    
    document.head.appendChild(script);
  });
}

// Simple Z80 assembler (basic implementation)
async function assembleZ80Code(assemblyCode) {
  console.log('Assembling Z80 code...');
  
  // This is a simplified assembler - in a real implementation,
  // you'd use a proper Z80 assembler like z80asm or pasmo
  const lines = assemblyCode.trim().split('\n');
  const machineCode = [];
  let address = 0x8000; // Start at 32768 (common starting point)
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(';')) continue;
    
    // Basic instruction encoding (simplified)
    const instruction = parseZ80Instruction(trimmed);
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

// Parse basic Z80 instructions (simplified implementation)
function parseZ80Instruction(instruction) {
  const upper = instruction.toUpperCase();
  
  // Basic instruction set (this would be much more comprehensive in a real assembler)
  const instructions = {
    'NOP': { bytes: [0x00] },
    'HALT': { bytes: [0x76] },
    'RET': { bytes: [0xC9] },
    'LD A,0': { bytes: [0x3E, 0x00] },
    'LD A,1': { bytes: [0x3E, 0x01] },
    'LD A,2': { bytes: [0x3E, 0x02] },
    'LD A,255': { bytes: [0x3E, 0xFF] },
    'OUT (254),A': { bytes: [0xD3, 0xFE] }, // Border color
    'JP 32768': { bytes: [0xC3, 0x00, 0x80] },
    'CALL 32768': { bytes: [0xCD, 0x00, 0x80] }
  };
  
  // Look for exact matches first
  if (instructions[upper]) {
    return instructions[upper];
  }
  
  // Pattern matching for parameterized instructions
  const patterns = [
    {
      pattern: /^LD A,(\d+)$/,
      encode: (match) => [0x3E, parseInt(match[1]) & 0xFF]
    },
    {
      pattern: /^OUT \((\d+)\),A$/,
      encode: (match) => [0xD3, parseInt(match[1]) & 0xFF]
    },
    {
      pattern: /^JP (\d+)$/,
      encode: (match) => {
        const addr = parseInt(match[1]);
        return [0xC3, addr & 0xFF, (addr >> 8) & 0xFF];
      }
    }
  ];
  
  for (const { pattern, encode } of patterns) {
    const match = upper.match(pattern);
    if (match) {
      return { bytes: encode(match) };
    }
  }
  
  console.warn('Unknown instruction:', instruction);
  return null;
}

// Load machine code into JSSpeccy
async function loadMachineCode(emulator, machineCode) {
  try {
    // Create a simple TAP file format for loading
    const tapData = createTAPFile(machineCode);
    
    // Load as a blob
    const blob = new Blob([tapData], { type: 'application/octet-stream' });
    await emulator.openFileBlob(blob);
    
    console.log('Machine code loaded successfully');
  } catch (error) {
    console.error('Error loading machine code:', error);
    throw error;
  }
}

// Create a simple TAP file format
function createTAPFile(machineCode) {
  // TAP file format: [length][flag][data][checksum]
  const headerLength = 17;
  const dataLength = machineCode.length;
  
  const tapFile = new Uint8Array(headerLength + 2 + dataLength + 2);
  let offset = 0;
  
  // Header block
  tapFile[offset++] = headerLength & 0xFF;
  tapFile[offset++] = (headerLength >> 8) & 0xFF;
  tapFile[offset++] = 0x00; // Header flag
  
  // Header data (simplified)
  tapFile[offset++] = 0x03; // Code block
  for (let i = 0; i < 10; i++) {
    tapFile[offset++] = 0x20; // Filename (spaces)
  }
  tapFile[offset++] = dataLength & 0xFF;
  tapFile[offset++] = (dataLength >> 8) & 0xFF;
  tapFile[offset++] = 0x00; // Start address low
  tapFile[offset++] = 0x80; // Start address high (32768)
  tapFile[offset++] = dataLength & 0xFF;
  tapFile[offset++] = (dataLength >> 8) & 0xFF;
  
  // Header checksum
  let checksum = 0x00;
  for (let i = 2; i < offset; i++) {
    checksum ^= tapFile[i];
  }
  tapFile[offset++] = checksum;
  
  // Data block
  tapFile[offset++] = dataLength & 0xFF;
  tapFile[offset++] = (dataLength >> 8) & 0xFF;
  tapFile[offset++] = 0xFF; // Data flag
  
  // Copy machine code
  for (let i = 0; i < machineCode.bytes.length; i++) {
    tapFile[offset++] = machineCode.bytes[i];
  }
  
  // Data checksum
  checksum = 0xFF;
  for (let i = 0; i < machineCode.bytes.length; i++) {
    checksum ^= machineCode.bytes[i];
  }
  tapFile[offset++] = checksum;
  
  return tapFile;
}

// Get Z80 register state (if available through JSSpeccy API)
function getZ80Registers(emulator) {
  // This would depend on JSSpeccy's debugging API
  // For now, return placeholder values
  return {
    A: 0x00,
    B: 0x00,
    C: 0x00,
    D: 0x00,
    E: 0x00,
    H: 0x00,
    L: 0x00,
    PC: 0x8000,
    SP: 0xFFFF,
    F: 0x00
  };
}

// Get memory state for debugging
function getMemoryState(emulator) {
  // This would access JSSpeccy's memory API
  return {
    // Memory ranges would be exposed here
    screen: new Uint8Array(6912), // Screen memory
    ram: new Uint8Array(49152)    // Main RAM
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initJSSpeccyEmulator };
} else {
  window.initJSSpeccyEmulator = initJSSpeccyEmulator;
}