/**
 * Educational CPU Simulator
 * A simplified 6502-like processor for teaching concepts
 * No ROMs, no copyrighted code - just pure educational logic
 */

export interface CPUState {
  // Registers
  A: number;     // Accumulator
  X: number;     // X index
  Y: number;     // Y index  
  SP: number;    // Stack pointer
  PC: number;    // Program counter
  
  // Status flags
  N: boolean;    // Negative
  V: boolean;    // Overflow
  Z: boolean;    // Zero
  C: boolean;    // Carry
  
  // System state
  cycles: number;
  memory: Uint8Array;
  halted: boolean;
}

export interface Instruction {
  opcode: number;
  mnemonic: string;
  addressing: string;
  bytes: number;
  cycles: number;
  execute: (cpu: CPUState) => void;
}

export class EducationalCPU {
  private state: CPUState;
  private instructions: Map<number, Instruction>;
  private trace: Array<{
    pc: number;
    opcode: number;
    mnemonic: string;
    state: Partial<CPUState>;
    memory?: { address: number; value: number };
  }> = [];
  
  constructor() {
    this.state = {
      A: 0,
      X: 0, 
      Y: 0,
      SP: 0xFF,
      PC: 0x0000,
      N: false,
      V: false,
      Z: false,
      C: false,
      cycles: 0,
      memory: new Uint8Array(65536),
      halted: false
    };
    
    this.instructions = new Map();
    this.setupInstructions();
  }
  
  private setupInstructions() {
    // Educational subset of 6502 instructions
    // These are simplified for teaching - not cycle-accurate
    
    // LDA Immediate
    this.instructions.set(0xA9, {
      opcode: 0xA9,
      mnemonic: 'LDA',
      addressing: 'immediate',
      bytes: 2,
      cycles: 2,
      execute: (cpu) => {
        cpu.A = this.readByte(cpu.PC + 1);
        this.setNZ(cpu.A);
        cpu.PC += 2;
      }
    });
    
    // STA Absolute
    this.instructions.set(0x8D, {
      opcode: 0x8D,
      mnemonic: 'STA',
      addressing: 'absolute',
      bytes: 3,
      cycles: 4,
      execute: (cpu) => {
        const addr = this.readWord(cpu.PC + 1);
        this.writeByte(addr, cpu.A);
        cpu.PC += 3;
      }
    });
    
    // LDX Immediate
    this.instructions.set(0xA2, {
      opcode: 0xA2,
      mnemonic: 'LDX',
      addressing: 'immediate',
      bytes: 2,
      cycles: 2,
      execute: (cpu) => {
        cpu.X = this.readByte(cpu.PC + 1);
        this.setNZ(cpu.X);
        cpu.PC += 2;
      }
    });
    
    // INX
    this.instructions.set(0xE8, {
      opcode: 0xE8,
      mnemonic: 'INX',
      addressing: 'implied',
      bytes: 1,
      cycles: 2,
      execute: (cpu) => {
        cpu.X = (cpu.X + 1) & 0xFF;
        this.setNZ(cpu.X);
        cpu.PC += 1;
      }
    });
    
    // DEX
    this.instructions.set(0xCA, {
      opcode: 0xCA,
      mnemonic: 'DEX',
      addressing: 'implied',
      bytes: 1,
      cycles: 2,
      execute: (cpu) => {
        cpu.X = (cpu.X - 1) & 0xFF;
        this.setNZ(cpu.X);
        cpu.PC += 1;
      }
    });
    
    // JMP Absolute
    this.instructions.set(0x4C, {
      opcode: 0x4C,
      mnemonic: 'JMP',
      addressing: 'absolute',
      bytes: 3,
      cycles: 3,
      execute: (cpu) => {
        cpu.PC = this.readWord(cpu.PC + 1);
      }
    });
    
    // BNE Relative
    this.instructions.set(0xD0, {
      opcode: 0xD0,
      mnemonic: 'BNE',
      addressing: 'relative',
      bytes: 2,
      cycles: 2,
      execute: (cpu) => {
        const offset = this.readByte(cpu.PC + 1);
        cpu.PC += 2;
        if (!cpu.Z) {
          // Branch taken
          cpu.PC += (offset < 128 ? offset : offset - 256);
          cpu.cycles += 1; // Extra cycle for branch taken
        }
      }
    });
    
    // NOP
    this.instructions.set(0xEA, {
      opcode: 0xEA,
      mnemonic: 'NOP',
      addressing: 'implied',
      bytes: 1,
      cycles: 2,
      execute: (cpu) => {
        cpu.PC += 1;
      }
    });
    
    // RTS (simplified)
    this.instructions.set(0x60, {
      opcode: 0x60,
      mnemonic: 'RTS',
      addressing: 'implied',
      bytes: 1,
      cycles: 6,
      execute: (cpu) => {
        // Simplified - just halt for now
        cpu.halted = true;
      }
    });
  }
  
  // Helper methods
  private readByte(address: number): number {
    return this.state.memory[address & 0xFFFF];
  }
  
  private readWord(address: number): number {
    const lo = this.readByte(address);
    const hi = this.readByte(address + 1);
    return lo | (hi << 8);
  }
  
  private writeByte(address: number, value: number): void {
    this.state.memory[address & 0xFFFF] = value & 0xFF;
    
    // Track memory writes for visualization
    this.trace[this.trace.length - 1].memory = {
      address: address & 0xFFFF,
      value: value & 0xFF
    };
  }
  
  private setNZ(value: number): void {
    this.state.N = (value & 0x80) !== 0;
    this.state.Z = value === 0;
  }
  
  // Public methods
  loadProgram(program: number[], startAddress: number = 0xC000): void {
    for (let i = 0; i < program.length; i++) {
      this.state.memory[startAddress + i] = program[i];
    }
    this.state.PC = startAddress;
  }
  
  step(): boolean {
    if (this.state.halted) return false;
    
    const opcode = this.readByte(this.state.PC);
    const instruction = this.instructions.get(opcode);
    
    if (!instruction) {
      console.warn(`Unknown opcode: $${opcode.toString(16).toUpperCase()}`);
      this.state.halted = true;
      return false;
    }
    
    // Record trace entry
    const traceEntry = {
      pc: this.state.PC,
      opcode,
      mnemonic: instruction.mnemonic,
      state: {
        A: this.state.A,
        X: this.state.X,
        Y: this.state.Y,
        PC: this.state.PC,
        N: this.state.N,
        Z: this.state.Z,
        C: this.state.C,
        cycles: this.state.cycles
      },
      memory: undefined as any
    };
    this.trace.push(traceEntry);
    
    // Execute instruction
    instruction.execute(this.state);
    this.state.cycles += instruction.cycles;
    
    return true;
  }
  
  run(maxCycles: number = 1000): void {
    while (this.state.cycles < maxCycles && !this.state.halted) {
      if (!this.step()) break;
    }
  }
  
  reset(): void {
    this.state.A = 0;
    this.state.X = 0;
    this.state.Y = 0;
    this.state.SP = 0xFF;
    this.state.PC = 0xC000;
    this.state.N = false;
    this.state.V = false;
    this.state.Z = false;
    this.state.C = false;
    this.state.cycles = 0;
    this.state.halted = false;
    this.trace = [];
  }
  
  getState(): CPUState {
    return { ...this.state };
  }
  
  getTrace(): typeof this.trace {
    return [...this.trace];
  }
  
  // Educational helpers
  disassemble(address: number, lines: number = 10): string[] {
    const result: string[] = [];
    let addr = address;
    
    for (let i = 0; i < lines && addr < 0xFFFF; i++) {
      const opcode = this.readByte(addr);
      const instruction = this.instructions.get(opcode);
      
      if (instruction) {
        let line = `$${addr.toString(16).toUpperCase().padStart(4, '0')}: `;
        
        // Add hex bytes
        for (let j = 0; j < instruction.bytes; j++) {
          line += `${this.readByte(addr + j).toString(16).toUpperCase().padStart(2, '0')} `;
        }
        line = line.padEnd(20);
        
        // Add mnemonic
        line += instruction.mnemonic;
        
        // Add operand
        if (instruction.bytes === 2) {
          const operand = this.readByte(addr + 1);
          if (instruction.addressing === 'immediate') {
            line += ` #$${operand.toString(16).toUpperCase().padStart(2, '0')}`;
          } else if (instruction.addressing === 'relative') {
            const target = addr + 2 + (operand < 128 ? operand : operand - 256);
            line += ` $${target.toString(16).toUpperCase().padStart(4, '0')}`;
          }
        } else if (instruction.bytes === 3) {
          const operand = this.readWord(addr + 1);
          line += ` $${operand.toString(16).toUpperCase().padStart(4, '0')}`;
        }
        
        result.push(line);
        addr += instruction.bytes;
      } else {
        result.push(`$${addr.toString(16).toUpperCase().padStart(4, '0')}: ${
          this.readByte(addr).toString(16).toUpperCase().padStart(2, '0')
        }              .byte $${this.readByte(addr).toString(16).toUpperCase().padStart(2, '0')}`);
        addr += 1;
      }
    }
    
    return result;
  }
}

// Example program: Change border color
export const EXAMPLE_PROGRAMS = {
  borderColor: {
    name: "Change Border Color",
    description: "Sets the C64 border to blue",
    program: [
      0xA9, 0x06,       // LDA #$06
      0x8D, 0x20, 0xD0, // STA $D020
      0x60              // RTS
    ],
    expectedTrace: [
      { instruction: "LDA #$06", effect: "A = $06" },
      { instruction: "STA $D020", effect: "Border color = blue" },
      { instruction: "RTS", effect: "Return to caller" }
    ]
  },
  
  simpleLoop: {
    name: "Simple Loop",
    description: "Counts X from 0 to 10",
    program: [
      0xA2, 0x00,       // LDX #$00
      0xE8,             // INX (loop start)
      0xE0, 0x0A,       // CPX #$0A
      0xD0, 0xFC,       // BNE loop
      0x60              // RTS
    ]
  }
};