/**
 * Sound for the lesson runners: the Sound toggle's stored choice, and the
 * audio output a running Spectrum feeds.
 *
 * Follows the site player (public/emulators/player.js): the emulator is told
 * the AudioContext's own sample rate and resamples to it, each frame's samples
 * go to an AudioWorklet as a transferred Float32Array, and the worklet keeps a
 * short bounded queue (audio-ring.ts). Sound is output only. Nothing here
 * feeds back into the machine, so its timing is the same with sound on or off.
 */
import workletUrl from './lesson-audio-worklet.ts?worker&url';
import { readSoundPreference, writeSoundPreference } from './sound-preference';


/**
 * Output level. The beeper is a full-scale square wave, which is harsh at full
 * volume; a quarter keeps it at a comfortable level beside other audio.
 */
export const SOUND_GAIN = 0.25;

/** How long the worklet may take to load before sound is given up. */
const START_TIMEOUT_MS = 5000;

const CHANGE_EVENT = 'code198x:lesson-sound';

/** Where a running machine sends its samples. */
export interface AudioSink {
  readonly sampleRate: number;
  /** Whether the machine is running. Sound stops while it is not. */
  active: boolean;
  /** Takes ownership of the samples: their buffer is transferred. */
  push(samples: Float32Array): void;
}

/**
 * One panel's audio output.
 *
 * Construct it inside the click or change handler that asked for sound, before
 * any await, so the browser counts the AudioContext as started by the reader.
 */
export class LessonAudio implements AudioSink {
  readonly ready: Promise<void>;
  #context: AudioContext;
  #node: AudioWorkletNode | null = null;
  #active = false;
  #closed = false;

  constructor() {
    this.#context = new AudioContext();
    // Asked for now, while the reader's gesture still counts.
    this.#context.resume().catch(() => {});
    this.ready = this.#connect();
    this.ready.catch(() => this.close());
    document.addEventListener('visibilitychange', this.#apply);
  }

  get sampleRate(): number {
    return this.#context.sampleRate;
  }

  get active(): boolean {
    return this.#active;
  }

  set active(value: boolean) {
    if (value === this.#active) return;
    this.#active = value;
    this.#apply();
  }

  push(samples: Float32Array) {
    if (!this.#node || !this.#active || document.hidden || samples.length === 0) return;
    this.#node.port.postMessage(samples, [samples.buffer]);
  }

  /** Releases the audio device. The object is finished with afterwards. */
  close() {
    if (this.#closed) return;
    this.#closed = true;
    document.removeEventListener('visibilitychange', this.#apply);
    this.#node?.disconnect();
    this.#node = null;
    this.#context.close().catch(() => {});
  }

  async #connect() {
    let timer = 0;
    const timeout = new Promise<never>((_, reject) => {
      timer = window.setTimeout(() => reject(new Error('Sound took too long to start.')), START_TIMEOUT_MS);
    });
    try {
      await Promise.race([this.#context.audioWorklet.addModule(workletUrl), timeout]);
    } finally {
      clearTimeout(timer);
    }
    if (this.#closed) throw new Error('Sound was turned off.');
    const node = new AudioWorkletNode(this.#context, 'lesson-audio', {
      numberOfInputs: 0,
      outputChannelCount: [2],
    });
    const gain = this.#context.createGain();
    gain.gain.value = SOUND_GAIN;
    node.connect(gain).connect(this.#context.destination);
    this.#node = node;
    this.#apply();
  }

  /** Plays only while the machine runs and the page is visible. */
  #apply = () => {
    if (this.#closed) return;
    if (this.#active && !document.hidden) {
      this.#context.resume().catch(() => {});
    } else {
      // Queued sound belongs to the moment it was made; do not play it late.
      this.#node?.port.postMessage('clear');
      this.#context.suspend().catch(() => {});
    }
  };
}

export interface SoundHooks {
  /** Whether the panel has a machine that should take the sound now. */
  running(): boolean;
  /** Connects the panel's machine to `sink`, or silences it with null. */
  attach(sink: AudioSink | null): void;
  /** Tells the reader sound could not start; the machine runs on muted. */
  unavailable(message: string): void;
}

/**
 * A runner panel's Sound checkbox and the output behind it.
 *
 * Shows the viewer's stored choice, stores changes, and keeps every Sound
 * toggle on the page in step. The output is created only when a machine needs
 * it, inside the click that starts the machine or ticks the box.
 */
export class SoundControl {
  #input: HTMLInputElement;
  #hooks: SoundHooks;
  #audio: LessonAudio | null = null;

  constructor(input: HTMLInputElement, hooks: SoundHooks) {
    this.#input = input;
    this.#hooks = hooks;
    input.checked = readSoundPreference();
    input.addEventListener('change', this.#changed);
    document.addEventListener(CHANGE_EVENT, this.#followed);
  }

  /** The live output, or null while sound is off. */
  get sink(): AudioSink | null {
    return this.#audio;
  }

  /**
   * Opens the output if Sound is ticked. Call it first thing in the click
   * that starts a machine, before any await.
   */
  prepare(): AudioSink | null {
    return this.#input.checked ? this.#open() : null;
  }

  /** Detaches the toggle and releases the audio device. */
  dispose() {
    this.#input.removeEventListener('change', this.#changed);
    document.removeEventListener(CHANGE_EVENT, this.#followed);
    this.#close();
  }

  #open(): LessonAudio | null {
    if (this.#audio) return this.#audio;
    let audio: LessonAudio;
    try {
      audio = new LessonAudio();
    } catch {
      this.#fail();
      return null;
    }
    this.#audio = audio;
    audio.ready.catch(() => {
      if (this.#audio !== audio) return;
      this.#audio = null;
      this.#hooks.attach(null);
      this.#fail();
    });
    return audio;
  }

  #close() {
    const audio = this.#audio;
    this.#audio = null;
    if (!audio) return;
    this.#hooks.attach(null);
    audio.close();
  }

  #fail() {
    this.#input.checked = false;
    this.#hooks.unavailable('Sound is unavailable; the machine is running muted.');
  }

  #apply(on: boolean) {
    if (!on) this.#close();
    else if (this.#hooks.running()) this.#hooks.attach(this.#open());
  }

  #changed = () => {
    const on = this.#input.checked;
    writeSoundPreference(on);
    document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { on, source: this.#input } }));
    this.#apply(on);
  };

  #followed = (event: Event) => {
    const { on, source } = (event as CustomEvent<{ on: boolean; source: HTMLInputElement }>).detail;
    if (source === this.#input || this.#input.checked === on) return;
    this.#input.checked = on;
    this.#apply(on);
  };
}
