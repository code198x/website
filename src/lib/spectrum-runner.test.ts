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
