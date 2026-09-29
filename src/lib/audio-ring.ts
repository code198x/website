/**
 * The bounded sample queue between a lesson's emulator and the speakers.
 *
 * The emulator produces sound in bursts, one frame's worth at a time, while
 * the audio thread asks for it in small steady blocks. This queue sits
 * between them. It holds a quarter of a second at most and drops the oldest
 * samples when a burst would overfill it, so a slow tab or a fast-loading tape
 * can never pile up seconds of delay between the screen and the sound. After
 * it runs dry it waits for a short cushion before playing again, so one late
 * frame is a gap rather than a stutter of single samples.
 *
 * The same shape as the site player's worklet (public/emulators/audio.js):
 * interleaved stereo, a 250 ms cap and an 80 ms cushion. It lives here, apart
 * from the worklet, so it can be tested without an audio thread.
 */

/** Longest queue, in seconds. Anything older is dropped. */
export const MAX_SECONDS = 0.25;
/** Queue needed before playback starts or restarts, in seconds. */
export const CUSHION_SECONDS = 0.08;

export class SampleRing {
  readonly channels: number;
  /** Capacity in samples, all channels counted. Always whole frames. */
  readonly capacity: number;
  /** Samples needed before playback starts. */
  readonly cushion: number;
  #ring: Float32Array;
  #read = 0;
  #length = 0;
  #playing = false;
  #dropped = 0;

  constructor(sampleRate: number, channels = 2) {
    this.channels = channels;
    this.capacity = Math.ceil(sampleRate * MAX_SECONDS) * channels;
    this.cushion = Math.ceil(sampleRate * CUSHION_SECONDS) * channels;
    this.#ring = new Float32Array(this.capacity);
  }

  /** Samples waiting to play, all channels counted. */
  get length(): number {
    return this.#length;
  }

  /** Samples discarded so far because the queue was full. */
  get dropped(): number {
    return this.#dropped;
  }

  get playing(): boolean {
    return this.#playing;
  }

  clear() {
    this.#read = 0;
    this.#length = 0;
    this.#playing = false;
  }

  /**
   * Queues interleaved samples, discarding the oldest when full.
   *
   * A partial frame at the end is ignored, so the channels never swap.
   */
  push(samples: ArrayLike<number>) {
    const whole = samples.length - (samples.length % this.channels);
    // Only the newest `capacity` samples of a burst can survive.
    const start = Math.max(0, whole - this.capacity);
    this.#dropped += start;
    const incoming = whole - start;
    const overflow = this.#length + incoming - this.capacity;
    if (overflow > 0) {
      this.#read = (this.#read + overflow) % this.capacity;
      this.#length -= overflow;
      this.#dropped += overflow;
    }
    let write = (this.#read + this.#length) % this.capacity;
    for (let i = start; i < whole; i++) {
      this.#ring[write] = samples[i];
      write = write + 1 === this.capacity ? 0 : write + 1;
    }
    this.#length += incoming;
  }

  /**
   * Fills one block of planar output, one array per channel.
   *
   * Plays silence until the cushion has built up, and again from the moment
   * the queue runs dry.
   */
  pull(outputs: Float32Array[]) {
    const frames = outputs[0]?.length ?? 0;
    if (!this.#playing && this.#length >= this.cushion) this.#playing = true;
    for (let i = 0; i < frames; i++) {
      if (this.#playing && this.#length >= this.channels) {
        for (let c = 0; c < this.channels; c++) {
          const sample = this.#ring[this.#read];
          this.#read = this.#read + 1 === this.capacity ? 0 : this.#read + 1;
          const output = outputs[c];
          if (output) output[i] = sample;
        }
        this.#length -= this.channels;
      } else {
        this.#playing = false;
        for (const output of outputs) output[i] = 0;
      }
    }
  }
}
