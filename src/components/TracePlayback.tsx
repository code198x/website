import { useState, useEffect, useRef } from 'react';
import { EducationalCPU, EXAMPLE_PROGRAMS } from '../lib/educational-cpu';

interface Props {
  program?: number[];
  startAddress?: number;
  autoPlay?: boolean;
  speed?: number; // ms between steps
}

export default function TracePlayback({ 
  program = EXAMPLE_PROGRAMS.borderColor.program,
  startAddress = 0xC000,
  autoPlay = false,
  speed = 500
}: Props) {
  const [cpu] = useState(() => new EducationalCPU());
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [trace, setTrace] = useState<any[]>([]);
  const [disassembly, setDisassembly] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  // Initialize CPU with program
  useEffect(() => {
    cpu.reset();
    cpu.loadProgram(program, startAddress);
    setDisassembly(cpu.disassemble(startAddress, 20));
    setTrace([]);
    setCurrentStep(0);
  }, [program, startAddress]);
  
  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        step();
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, currentStep]);
  
  const step = () => {
    const success = cpu.step();
    if (success) {
      const newTrace = cpu.getTrace();
      setTrace(newTrace);
      setCurrentStep(newTrace.length - 1);
    } else {
      setIsPlaying(false);
    }
  };
  
  const reset = () => {
    cpu.reset();
    cpu.loadProgram(program, startAddress);
    setTrace([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const currentState = cpu.getState();
  const currentPC = currentState.PC;
  
  return (
    <div className="trace-playback bg-slate-900 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-bold">CPU Trace Playback</h3>
        <div className="flex gap-2">
          <button
            onClick={togglePlay}
            className="px-3 py-1 bg-green-700 text-white rounded text-sm hover:bg-green-600"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={step}
            disabled={isPlaying || currentState.halted}
            className="px-3 py-1 bg-blue-700 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            Step →
          </button>
          <button
            onClick={reset}
            className="px-3 py-1 bg-red-700 text-white rounded text-sm hover:bg-red-600"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Disassembly View */}
        <div className="disassembly">
          <h4 className="text-slate-400 text-sm mb-2">Program</h4>
          <div className="bg-slate-800 rounded p-2 h-64 overflow-y-auto font-mono text-xs">
            {disassembly.map((line, i) => {
              const addr = parseInt(line.substring(1, 5), 16);
              const isCurrentLine = addr === currentPC;
              const hasBeenExecuted = trace.some(t => t.pc === addr);
              
              return (
                <div
                  key={i}
                  className={`py-0.5 px-1 ${
                    isCurrentLine ? 'bg-yellow-900 text-yellow-300' :
                    hasBeenExecuted ? 'text-green-400' : 'text-slate-500'
                  }`}
                >
                  {isCurrentLine && '→ '}
                  {line}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Trace History */}
        <div className="trace-history">
          <h4 className="text-slate-400 text-sm mb-2">Execution Trace</h4>
          <div className="bg-slate-800 rounded p-2 h-64 overflow-y-auto">
            {trace.length === 0 ? (
              <div className="text-slate-600 text-xs">
                Press "Step" or "Play" to begin execution
              </div>
            ) : (
              trace.map((entry, i) => (
                <div
                  key={i}
                  className={`mb-2 p-2 rounded text-xs ${
                    i === currentStep ? 'bg-slate-700' : ''
                  }`}
                >
                  <div className="text-green-400 font-mono">
                    ${entry.pc.toString(16).toUpperCase().padStart(4, '0')}: {entry.mnemonic}
                  </div>
                  <div className="text-slate-400 mt-1">
                    A=${entry.state.A.toString(16).toUpperCase().padStart(2, '0')} 
                    X=${entry.state.X.toString(16).toUpperCase().padStart(2, '0')} 
                    Y=${entry.state.Y.toString(16).toUpperCase().padStart(2, '0')} 
                    {entry.state.N ? 'N' : '-'}
                    {entry.state.Z ? 'Z' : '-'}
                    {entry.state.C ? 'C' : '-'}
                  </div>
                  {entry.memory && (
                    <div className="text-yellow-400 mt-1">
                      Wrote ${entry.memory.value.toString(16).toUpperCase().padStart(2, '0')} 
                      to ${entry.memory.address.toString(16).toUpperCase().padStart(4, '0')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Current State Summary */}
      <div className="mt-4 p-3 bg-slate-800 rounded">
        <h4 className="text-slate-400 text-sm mb-2">Current State</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          <div className="text-slate-300">
            PC: <span className="text-white">${currentState.PC.toString(16).toUpperCase().padStart(4, '0')}</span>
          </div>
          <div className="text-slate-300">
            A: <span className="text-white">${currentState.A.toString(16).toUpperCase().padStart(2, '0')}</span>
          </div>
          <div className="text-slate-300">
            X: <span className="text-white">${currentState.X.toString(16).toUpperCase().padStart(2, '0')}</span>
          </div>
          <div className="text-slate-300">
            Y: <span className="text-white">${currentState.Y.toString(16).toUpperCase().padStart(2, '0')}</span>
          </div>
          <div className="text-slate-300">
            SP: <span className="text-white">${currentState.SP.toString(16).toUpperCase().padStart(2, '0')}</span>
          </div>
          <div className="text-slate-300">
            Cycles: <span className="text-white">{currentState.cycles}</span>
          </div>
          <div className="text-slate-300">
            Flags: <span className="text-white">
              {currentState.N ? 'N' : '-'}
              {currentState.V ? 'V' : '-'}
              {currentState.Z ? 'Z' : '-'}
              {currentState.C ? 'C' : '-'}
            </span>
          </div>
          <div className="text-slate-300">
            Status: <span className={currentState.halted ? 'text-red-400' : 'text-green-400'}>
              {currentState.halted ? 'HALTED' : 'RUNNING'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Educational Note */}
      <div className="mt-4 p-3 bg-blue-900 rounded">
        <div className="text-xs text-blue-200">
          <strong>Learning Note:</strong> This is a simplified educational CPU. 
          It demonstrates core concepts without requiring system ROMs or copyrighted code. 
          Real 6502 processors have more instructions and complex timing, but the principles are the same!
        </div>
      </div>
    </div>
  );
}