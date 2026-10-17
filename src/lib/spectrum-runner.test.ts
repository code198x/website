import {afterEach, expect, it, vi} from 'vitest';

const api = vi.hoisted(() => ({init: vi.fn(), create: vi.fn()}));
vi.mock('@emu198x/zx-spectrum', () => ({default: api.init, Spectrum: {createBundled: api.create}}));
afterEach(() => {vi.unstubAllGlobals(); vi.resetAllMocks(); vi.resetModules();});

it('retries a failed WASM download and shares a successful initialization', async () => {
  api.init.mockRejectedValueOnce(new Error('download failed')).mockResolvedValue(undefined);
  const machines = Array.from({length: 2}, () => ({free: vi.fn()}));
  api.create.mockResolvedValueOnce(machines[0]).mockResolvedValueOnce(machines[1]);
  vi.stubGlobal('window', new EventTarget());
  const {SpectrumRunner} = await import('./spectrum-runner');
  const canvas = new EventTarget() as HTMLCanvasElement;
  await expect(SpectrumRunner.create(canvas, vi.fn())).rejects.toThrow('download failed');
  const runners = await Promise.all([SpectrumRunner.create(canvas, vi.fn()), SpectrumRunner.create(canvas, vi.fn())]);
  expect(api.init).toHaveBeenCalledTimes(2);
  expect(api.create).toHaveBeenCalledTimes(2);
  runners.forEach(runner => runner.dispose());
  machines.forEach(machine => expect(machine.free).toHaveBeenCalledOnce());
});

/** A machine whose tape a test drives, sitting in the ROM editor once the tape stops. */
function tapeMachine() {
  const tape = {playing: true, progress: 0.1};
  const answers: Record<string, () => unknown> = {
    'tape.loaded': () => true,
    'tape.playing': () => tape.playing,
    'tape.progress': () => tape.progress,
    'cpu.pc': () => 0x10b0,
    'cpu.halted': () => false,
    'cpu.iff1': () => true,
    'boot.detected': () => true,
  };
  const machine = {
    free: vi.fn(), load: vi.fn(), autoload: vi.fn(), tick: vi.fn(), audioDrain: vi.fn(),
    query: (path: string) => JSON.stringify(answers[path]()),
    transport: vi.fn((_slot: string, playing: boolean) => {tape.playing = playing;}),
  };
  return {machine, tape};
}

async function tapeRunner(machine: unknown) {
  api.init.mockResolvedValue(undefined);
  api.create.mockResolvedValue(machine);
  let frame: FrameRequestCallback | null = null;
  vi.stubGlobal('window', new EventTarget());
  vi.stubGlobal('performance', {now: () => 0});
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {frame = callback; return 1;});
  vi.stubGlobal('cancelAnimationFrame', () => {frame = null;});
  const {SpectrumRunner} = await import('./spectrum-runner');
  const runner = await SpectrumRunner.create(new EventTarget() as HTMLCanvasElement, vi.fn());
  const onVerdict = vi.fn();
  runner.load(new Uint8Array(), 'tape');
  runner.watch({origin: 0x8000, length: 16}, onVerdict);
  runner.visible = true;
  runner.wanted = true;
  /** Runs `checks` of the runner's half-second checks. */
  const run = (checks: number) => {for (let i = 0; i < checks * 25; i++) frame?.(i * 20);};
  return {runner, onVerdict, run};
}

it('waits while the reader has stopped the tape partway, then judges after it finishes', async () => {
  const {machine, tape} = tapeMachine();
  const {runner, onVerdict, run} = await tapeRunner(machine);
  run(2);
  runner.setTapePlaying(false);
  expect(machine.transport).toHaveBeenLastCalledWith('tape-1', false);
  run(10);
  expect(onVerdict).not.toHaveBeenCalled();

  runner.setTapePlaying(true);
  run(2);
  tape.playing = false;
  tape.progress = 1;
  run(4);
  expect(onVerdict).toHaveBeenCalledOnce();
  runner.dispose();
});

it('judges as soon as a tape that ran out by itself has stopped', async () => {
  const {machine, tape} = tapeMachine();
  const {runner, onVerdict, run} = await tapeRunner(machine);
  run(2);
  tape.playing = false;
  tape.progress = 1;
  run(4);
  expect(onVerdict).toHaveBeenCalledOnce();
  runner.dispose();
});

it('reports a build without tape transport rather than failing silently', async () => {
  const {machine} = tapeMachine();
  const {transport: _, ...older} = machine;
  const {runner} = await tapeRunner(older);
  expect(runner.hasTapeControls).toBe(false);
  expect(() => runner.setTapePlaying(false)).toThrow('Tape controls are unavailable');
  runner.dispose();
});
