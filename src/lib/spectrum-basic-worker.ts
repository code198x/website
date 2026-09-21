/** BASIC trial: conversion and the real Spectrum both stay off the UI thread. */
import init, * as bindings from '@emu198x/zx-spectrum';

type Machine = {
  runBasic(source: string): void;
  tick(elapsed: number): void;
  query(path: string): string;
  keyDown(code: string): boolean;
  keyUp(code: string): boolean;
  frameRgba(): Uint8Array;
  frameSize(): Uint32Array;
  free(): void;
};
const api = bindings as unknown as {
  basicTape(source: string, name: string): Uint8Array;
  Spectrum: { createHeadlessBundled(): Machine };
};
let machine: Machine | null = null;
let ready: Promise<unknown> | null = null;
let held = new Set<string>();
let taps: string[][] = [];
let activeTap: string[] = [];
let tapTicks = 0;
let ticks = 0;
let loading = true;
function release() {
  for (const code of held) machine?.keyUp(code);
  for (const code of activeTap) machine?.keyUp(code);
  held.clear(); taps = []; activeTap = []; tapTicks = 0;
}
self.onmessage = async ({data}) => {
  try {
    if (data.type === 'build') {
      await (ready ??= init());
      if (typeof api.basicTape !== 'function') throw Error('This local trial needs the BASIC-enabled emulator package.');
      if (!data.run) {
        self.postMessage({type: 'tape', bytes: api.basicTape(data.source, data.name)});
        return;
      }
      machine?.free();
      machine = api.Spectrum.createHeadlessBundled();
      self.postMessage({type: 'status', message: 'Starting Spectrum…'});
      machine.runBasic(data.source);
      loading = false;
      self.postMessage({type: 'ready'});
    } else if (data.type === 'tick' && machine) {
      if (tapTicks > 0) {
        if (--tapTicks === 0 && activeTap.length) {
          activeTap.forEach(code => machine!.keyUp(code)); activeTap = []; tapTicks = 3;
        }
      } else if (taps.length) {
        activeTap = taps.shift()!;
        activeTap.forEach(code => machine!.keyDown(code)); tapTicks = 3;
      }
      machine.tick(data.elapsed);
      const pixels = machine.frameRgba();
      const text = ++ticks % 6 === 0 ? JSON.parse(machine.query('screen.text.lines')) : undefined;
      self.postMessage({type: 'frame', pixels, size: Array.from(machine.frameSize()), loading, text}, [pixels.buffer]);
    } else if (data.type === 'keys' && machine && !loading) {
      for (const code of data.codes) {
        if (data.down) { held.add(code); machine.keyDown(code); }
        else { held.delete(code); machine.keyUp(code); }
      }
    } else if (data.type === 'tap' && machine && !loading) {
      taps.push(data.codes);
    } else if (data.type === 'release') release();
  } catch (error) {
    self.postMessage({type: 'error', message: String(error)});
    release(); machine?.free(); machine = null;
  }
};
