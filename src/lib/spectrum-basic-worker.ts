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
  configureAudio(rate: number, channels: number, capacity: number): void;
  setAudioEnabled(enabled: boolean): void;
  audioDrain(): Float32Array;
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
/** The page's AudioContext rate while Sound is on, otherwise null. */
let audioRate: number | null = null;
/** Sound is output only: turning it on or off never changes the frames run. */
function applyAudio() {
  if (!machine) return;
  if (audioRate) {
    machine.configureAudio(audioRate, 2, audioRate / 2);
    machine.setAudioEnabled(true);
    machine.audioDrain();
  } else machine.setAudioEnabled(false);
}
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
      // runBasic types RUN and runs the first moments of the program before
      // any frame reaches the page. Sound starts with the first frame shown,
      // like the picture, rather than replaying that stretch late.
      applyAudio();
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
      // Transferred, not copied, like the pixels: one frame of sound each tick.
      const audio = audioRate ? machine.audioDrain() : undefined;
      const transfer: Transferable[] = audio ? [pixels.buffer, audio.buffer] : [pixels.buffer];
      self.postMessage({type: 'frame', pixels, audio, size: Array.from(machine.frameSize()), loading, text}, transfer);
    } else if (data.type === 'keys' && machine && !loading) {
      for (const code of data.codes) {
        if (data.down) { held.add(code); machine.keyDown(code); }
        else { held.delete(code); machine.keyUp(code); }
      }
    } else if (data.type === 'tap' && machine && !loading) {
      taps.push(data.codes);
    } else if (data.type === 'audio') {
      audioRate = typeof data.rate === 'number' && data.rate > 0 ? data.rate : null;
      applyAudio();
    } else if (data.type === 'release') release();
  } catch (error) {
    self.postMessage({type: 'error', message: String(error)});
    release(); machine?.free(); machine = null;
  }
};
