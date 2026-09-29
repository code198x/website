/**
 * Plays a lesson emulator's samples on the audio thread.
 *
 * Bundled on its own by Vite (`?worker&url` in lesson-audio.ts) so it can share
 * the tested queue in audio-ring.ts. The page posts each frame's interleaved
 * stereo samples, or 'clear' to forget what is queued.
 */
import { SampleRing } from './audio-ring';

// The audio thread's globals, which the DOM library does not declare.
declare const sampleRate: number;
declare function registerProcessor(name: string, processor: unknown): void;
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
}

class LessonAudioProcessor extends AudioWorkletProcessor {
  #ring = new SampleRing(sampleRate, 2);

  constructor() {
    super();
    this.port.onmessage = ({ data }) => {
      if (data === 'clear') this.#ring.clear();
      else if (data instanceof Float32Array) this.#ring.push(data);
    };
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][]) {
    this.#ring.pull(outputs[0]);
    return true;
  }
}

registerProcessor('lesson-audio', LessonAudioProcessor);
