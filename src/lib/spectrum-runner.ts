/**
 * Drives a browser Spectrum for a page component.
 *
 * The machine, its pacing loop, and its keyboard live here rather than in a
 * component's script, because two components now run one — the read-only embed
 * that shows a unit's outcome, and the sandbox that runs what the reader just
 * assembled. A second copy of the loop is a second place for the pacing to go
 * wrong, and pacing is the part that is silently wrong when it is wrong: a
 * machine running 20% fast still looks like a Spectrum.
 */
import init, { Spectrum } from '@emu198x/zx-spectrum';

/** One wasm instantiation per page, however many machines are on it. */
let ready: Promise<unknown> | null = null;
const wasmReady = () => (ready ??= init());

/**
 * Frames to wait for the boot prompt before giving up on a tape.
 *
 * A cold 48K reaches it in under a hundred; the +2A and +3 take longer to draw
 * their loader menu. Generous because the cost of being wrong is a lesson that
 * never loads, and waiting costs nothing when the machine arrives sooner.
 */
const BOOT_FRAMES = 400;

export type MediaKind = 'tape' | 'snapshot';

export class SpectrumRunner {
  #spectrum: Spectrum;
  #canvas: HTMLCanvasElement;
  #frame = 0;
  #last = 0;
  #wanted = false;
  #visible = true;
  #disposed = false;
  #onError: (message: string) => void;

  private constructor(
    spectrum: Spectrum,
    canvas: HTMLCanvasElement,
    onError: (message: string) => void,
  ) {
    this.#spectrum = spectrum;
    this.#canvas = canvas;
    this.#onError = onError;
    this.#attachKeys();
  }

  /** Builds a 48K on the ROM inside the package. Nothing is fetched for it. */
  static async create(
    canvas: HTMLCanvasElement,
    onError: (message: string) => void,
  ): Promise<SpectrumRunner> {
    await wasmReady();
    const spectrum = await Spectrum.createBundled(canvas);
    return new SpectrumRunner(spectrum, canvas, onError);
  }

  /**
   * Loads a program and, for a tape, drives the ROM to load it.
   *
   * Mounting a tape is not loading it: the machine has to boot, be told
   * `LOAD ""`, and have the transport started. The emulator does that through
   * the real ROM, so the firmware initialises the machine on the way and the
   * program can call ROM routines afterwards.
   */
  load(bytes: Uint8Array, kind: MediaKind, format?: string) {
    if (kind === 'snapshot') {
      this.#spectrum.loadSnapshot(bytes, format ?? 'sna');
      return;
    }
    this.#spectrum.load('tape-1', 'tape', bytes);
    this.#spectrum.autoload(BOOT_FRAMES);
  }

  /** Whether the reader has asked for the machine to run. */
  set wanted(value: boolean) {
    this.#wanted = value;
    this.#sync();
  }

  get wanted(): boolean {
    return this.#wanted;
  }

  /** Whether the machine is on screen. A page may hold several. */
  set visible(value: boolean) {
    this.#visible = value;
    this.#sync();
  }

  stop() {
    if (this.#frame !== 0) cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  /**
   * Stops the machine for good and releases it.
   *
   * A page that assembles repeatedly builds a machine per attempt, and a
   * wasm object is not collected by dropping the last reference to it — each
   * abandoned Spectrum keeps its 48K and its framebuffers until it is freed.
   */
  dispose() {
    this.#disposed = true;
    this.stop();
    this.#spectrum.free();
  }

  #sync() {
    if (this.#disposed) return;
    if (this.#wanted && this.#visible) {
      if (this.#frame === 0) {
        this.#last = performance.now();
        this.#frame = requestAnimationFrame(this.#tick);
      }
    } else {
      this.stop();
    }
  }

  // Elapsed real time, not one frame per callback: the Spectrum runs at
  // 50.08 Hz and the display usually does not. While a tape plays the machine
  // runs ahead of the clock, so a load takes about a second rather than the
  // seventeen it takes on the bench.
  #tick = (now: number) => {
    // Checked on the way in, because stop() can land while a tick is already
    // executing: cancelAnimationFrame kills the *pending* callback, and this
    // one would then reschedule itself on the way out and resurrect a machine
    // its owner has finished with. A page that assembles six times would be
    // running six Spectrums, each slower than the last.
    if (this.#disposed || !this.#wanted || !this.#visible) {
      this.#frame = 0;
      return;
    }
    try {
      this.#spectrum.tick(now - this.#last);
    } catch (error) {
      this.#onError(`The machine stopped: ${error}`);
      this.stop();
      return;
    }
    this.#last = now;
    this.#frame = requestAnimationFrame(this.#tick);
  };

  // Keys reach the machine only while the screen has focus, so a reader
  // scrolling with the arrow keys does not drive the Spectrum.
  #attachKeys() {
    this.#canvas.addEventListener('keydown', (event) => {
      if (this.#spectrum.keyDown(event.code)) event.preventDefault();
    });
    this.#canvas.addEventListener('keyup', (event) => {
      if (this.#spectrum.keyUp(event.code)) event.preventDefault();
    });
  }
}
