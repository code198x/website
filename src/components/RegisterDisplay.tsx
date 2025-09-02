import { useState, useEffect } from 'react';
import './RegisterDisplay.css';

interface RegisterState {
  A: number;    // Accumulator
  X: number;    // X index
  Y: number;    // Y index
  SP: number;   // Stack pointer
  PC: number;   // Program counter
  // Status flags
  N: boolean;   // Negative
  V: boolean;   // Overflow
  B: boolean;   // Break
  D: boolean;   // Decimal
  I: boolean;   // Interrupt disable
  Z: boolean;   // Zero
  C: boolean;   // Carry
}

interface Props {
  registers: RegisterState;
  previousRegisters?: RegisterState;
  platform: 'c64' | 'nes' | 'atari800' | 'apple2';
}

export default function RegisterDisplay({ registers, previousRegisters, platform }: Props) {
  const [highlightChanges, setHighlightChanges] = useState(true);
  
  // Check if a register changed
  const hasChanged = (reg: keyof RegisterState): boolean => {
    if (!previousRegisters || !highlightChanges) return false;
    return registers[reg] !== previousRegisters[reg];
  };
  
  // Format hex values
  const hex8 = (n: number) => n.toString(16).toUpperCase().padStart(2, '0');
  const hex16 = (n: number) => n.toString(16).toUpperCase().padStart(4, '0');
  
  // Get status register as byte
  const getStatusByte = (): number => {
    return (
      (registers.N ? 0x80 : 0) |
      (registers.V ? 0x40 : 0) |
      0x20 | // Unused, always 1
      (registers.B ? 0x10 : 0) |
      (registers.D ? 0x08 : 0) |
      (registers.I ? 0x04 : 0) |
      (registers.Z ? 0x02 : 0) |
      (registers.C ? 0x01 : 0)
    );
  };
  
  return (
    <div className="register-display bg-gray-900 p-4 rounded-lg font-mono">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-bold">CPU Registers</h3>
        <button
          onClick={() => setHighlightChanges(!highlightChanges)}
          className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
        >
          {highlightChanges ? 'Highlighting ON' : 'Highlighting OFF'}
        </button>
      </div>
      
      {/* Main Registers */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={`register-box ${hasChanged('A') ? 'changed' : ''}`}>
          <div className="text-gray-400 text-xs">A</div>
          <div className="text-white text-lg">${hex8(registers.A)}</div>
          <div className="text-gray-500 text-xs">{registers.A}</div>
        </div>
        
        <div className={`register-box ${hasChanged('X') ? 'changed' : ''}`}>
          <div className="text-gray-400 text-xs">X</div>
          <div className="text-white text-lg">${hex8(registers.X)}</div>
          <div className="text-gray-500 text-xs">{registers.X}</div>
        </div>
        
        <div className={`register-box ${hasChanged('Y') ? 'changed' : ''}`}>
          <div className="text-gray-400 text-xs">Y</div>
          <div className="text-white text-lg">${hex8(registers.Y)}</div>
          <div className="text-gray-500 text-xs">{registers.Y}</div>
        </div>
      </div>
      
      {/* Stack Pointer and Program Counter */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`register-box ${hasChanged('SP') ? 'changed' : ''}`}>
          <div className="text-gray-400 text-xs">SP</div>
          <div className="text-white text-lg">${hex8(registers.SP)}</div>
          <div className="text-gray-500 text-xs">$01{hex8(registers.SP)}</div>
        </div>
        
        <div className={`register-box ${hasChanged('PC') ? 'changed' : ''}`}>
          <div className="text-gray-400 text-xs">PC</div>
          <div className="text-white text-lg">${hex16(registers.PC)}</div>
          <div className="text-gray-500 text-xs">{registers.PC}</div>
        </div>
      </div>
      
      {/* Status Flags */}
      <div className="status-flags">
        <div className="text-gray-400 text-xs mb-2">Status Flags (P)</div>
        <div className="flex gap-2 mb-2">
          {['N', 'V', '-', 'B', 'D', 'I', 'Z', 'C'].map((flag, i) => {
            if (flag === '-') {
              return <div key={i} className="flag-box inactive">1</div>;
            }
            const isSet = registers[flag as keyof RegisterState];
            const changed = previousRegisters && 
              registers[flag as keyof RegisterState] !== previousRegisters[flag as keyof RegisterState];
            
            return (
              <div 
                key={flag}
                className={`flag-box ${isSet ? 'active' : ''} ${changed && highlightChanges ? 'changed' : ''}`}
                title={getFlagDescription(flag)}
              >
                {flag}
              </div>
            );
          })}
        </div>
        <div className="text-gray-500 text-xs">
          ${hex8(getStatusByte())} = %{getStatusByte().toString(2).padStart(8, '0')}
        </div>
      </div>
      
      {/* Instruction Hint */}
      <div className="mt-4 p-2 bg-gray-800 rounded">
        <div className="text-xs text-gray-400">
          Last Instruction Effect:
        </div>
        {previousRegisters && (
          <div className="text-xs text-green-400 mt-1">
            {describeChanges(registers, previousRegisters)}
          </div>
        )}
      </div>
    </div>
  );
}

function getFlagDescription(flag: string): string {
  const descriptions: Record<string, string> = {
    N: 'Negative - Set if bit 7 of result is 1',
    V: 'Overflow - Set on signed overflow',
    B: 'Break - Set by BRK instruction',
    D: 'Decimal - Binary/Decimal mode',
    I: 'Interrupt - IRQ disable',
    Z: 'Zero - Set if result is zero',
    C: 'Carry - Set on unsigned overflow'
  };
  return descriptions[flag] || '';
}

function describeChanges(current: RegisterState, previous: RegisterState): string {
  const changes: string[] = [];
  
  if (current.A !== previous.A) {
    changes.push(`A: $${previous.A.toString(16).toUpperCase()} → $${current.A.toString(16).toUpperCase()}`);
  }
  if (current.X !== previous.X) {
    changes.push(`X: $${previous.X.toString(16).toUpperCase()} → $${current.X.toString(16).toUpperCase()}`);
  }
  if (current.Y !== previous.Y) {
    changes.push(`Y: $${previous.Y.toString(16).toUpperCase()} → $${current.Y.toString(16).toUpperCase()}`);
  }
  if (current.PC !== previous.PC) {
    const jump = current.PC - previous.PC;
    if (jump === 1) changes.push('PC+1');
    else if (jump === 2) changes.push('PC+2');
    else if (jump === 3) changes.push('PC+3');
    else changes.push(`PC: ${jump > 0 ? '+' : ''}${jump}`);
  }
  
  return changes.join(', ') || 'No changes';
}