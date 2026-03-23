/**
 * <emu198x-player> — Web component that embeds a running emulator.
 *
 * Usage in MDX:
 *   <emu198x-player system="sinclair-zx-spectrum" src="/code-samples/spectrum/starfield.sna"></emu198x-player>
 *
 * Attributes:
 *   system   — system identifier (e.g. "sinclair-zx-spectrum")
 *   src      — URL to the binary file (.sna, .z80, .prg, .nes, etc.)
 *   width    — display width in CSS pixels (default: 640)
 *   height   — display height in CSS pixels (default: 480)
 *   autoplay — start running immediately (default: false)
 *   controls — show control bar (default: true)
 */

const WASM_BASE = '/emulator/pkg';

// Map system IDs to WASM module paths and constructor names
const SYSTEM_MAP = {
  'sinclair-zx-spectrum': {
    module: 'emu_sinclair_zx_spectrum_wasm',
    constructor: 'SpectrumEmulator',
    needsRom: false, // ROM is embedded
  },
  // Future systems can be added here
};

class Emu198xPlayer extends HTMLElement {
  constructor() {
    super();
    this.emu = null;
    this.wasm = null;
    this.running = false;
    this.audioCtx = null;
    this.frameId = null;
  }

  connectedCallback() {
    const system = this.getAttribute('system') || 'sinclair-zx-spectrum';
    const src = this.getAttribute('src');
    const width = parseInt(this.getAttribute('width') || '640', 10);
    const height = parseInt(this.getAttribute('height') || '480', 10);
    const autoplay = this.hasAttribute('autoplay');
    const showControls = this.getAttribute('controls') !== 'false';

    // Shadow DOM for style isolation
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: ${width}px;
          margin: 1.5rem 0;
        }
        .container {
          background: #1a1a2e;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #333;
        }
        canvas {
          display: block;
          width: 100%;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          cursor: none;
        }
        .controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #252540;
          border-top: 1px solid #333;
        }
        .controls button {
          background: #333355;
          color: #e0e0e0;
          border: 1px solid #555;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          font-family: inherit;
        }
        .controls button:hover {
          background: #444466;
        }
        .controls button.active {
          background: #4fc3f7;
          color: #000;
        }
        .status {
          margin-left: auto;
          color: #888;
          font-size: 0.75rem;
          font-family: var(--font-family-mono, monospace);
        }
        .overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.7);
          cursor: pointer;
        }
        .overlay-text {
          color: #4fc3f7;
          font-size: 1.2rem;
          font-family: inherit;
        }
        .canvas-wrap {
          position: relative;
        }
      </style>
      <div class="container">
        <div class="canvas-wrap">
          <canvas></canvas>
          ${!autoplay ? '<div class="overlay"><span class="overlay-text">Click to start</span></div>' : ''}
        </div>
        ${showControls ? `
        <div class="controls">
          <button class="btn-play">${autoplay ? 'Pause' : 'Play'}</button>
          <button class="btn-reset">Reset</button>
          <button class="btn-fullscreen">Fullscreen</button>
          <span class="status">Loading...</span>
        </div>
        ` : ''}
      </div>
    `;

    this.canvas = shadow.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.statusEl = shadow.querySelector('.status');
    this.overlay = shadow.querySelector('.overlay');

    // Controls
    const playBtn = shadow.querySelector('.btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }
    const resetBtn = shadow.querySelector('.btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetEmulator());
    }
    const fullscreenBtn = shadow.querySelector('.btn-fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.canvas.requestFullscreen?.() || this.canvas.webkitRequestFullscreen?.();
      });
    }

    // Click overlay to start
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.overlay.remove();
        this.overlay = null;
        this.start();
      });
    }

    // Keyboard — track held DOM keys and recompute Spectrum state
    const container = shadow.querySelector('.container');
    container.tabIndex = 0;
    container.style.outline = 'none';
    this.heldKeys = new Set();

    container.addEventListener('keydown', (e) => {
      if (!this.emu) return;
      e.preventDefault();
      e.stopPropagation();
      this.heldKeys.add(e.code);
      this.syncKeys();
    });
    container.addEventListener('keyup', (e) => {
      if (!this.emu) return;
      e.preventDefault();
      e.stopPropagation();
      this.heldKeys.delete(e.code);
      this.syncKeys();
    });

    // Release everything on any focus loss
    const releaseAll = () => {
      this.heldKeys.clear();
      if (this.emu && this.emu.release_all) {
        this.emu.release_all();
      }
    };
    container.addEventListener('blur', releaseAll);
    window.addEventListener('blur', releaseAll);
    // Also catch visibility change (mobile tab switch, screen lock)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) releaseAll();
    });

    // Click canvas for audio + focus
    container.addEventListener('click', () => {
      container.focus();
      this.initAudio();
    });

    // Load
    this.systemId = system;
    this.binarySrc = src;
    this.init(system, src, autoplay);
  }

  async init(system, src, autoplay) {
    const config = SYSTEM_MAP[system];
    if (!config) {
      this.setStatus(`Unknown system: ${system}`);
      return;
    }

    try {
      // Dynamic import of the WASM module
      const modulePath = `${WASM_BASE}/${config.module}.js`;
      const mod = await import(modulePath);
      this.wasm = await mod.default();

      // Create emulator
      this.emu = new mod[config.constructor]();
      this.canvas.width = this.emu.width();
      this.canvas.height = this.emu.height();

      // Load binary if provided
      if (src) {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Failed to load ${src}: ${response.status}`);
        const data = new Uint8Array(await response.arrayBuffer());
        const ext = src.split('.').pop().toLowerCase();
        this.emu.load_file(data, ext);
      }

      this.setStatus('Ready');

      if (autoplay) {
        this.start();
      }
    } catch (err) {
      this.setStatus(`Error: ${err.message}`);
      console.error('emu198x-player:', err);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.initAudio();
    this.setStatus('Running');
    this.updatePlayButton(true);
    this.frame();
  }

  stop() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.setStatus('Paused');
    this.updatePlayButton(false);
  }

  togglePlay() {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  }

  resetEmulator() {
    if (this.emu) {
      this.emu.reset();
      // Reload binary if we had one
      if (this.binarySrc) {
        fetch(this.binarySrc)
          .then(r => r.arrayBuffer())
          .then(buf => {
            const data = new Uint8Array(buf);
            const ext = this.binarySrc.split('.').pop().toLowerCase();
            this.emu.load_file(data, ext);
          });
      }
    }
  }

  frame() {
    if (!this.running || !this.emu) return;

    this.emu.run_frame();

    // Render
    const w = this.emu.width();
    const h = this.emu.height();
    const ptr = this.emu.framebuffer_rgba_ptr();
    const rgba = new Uint8ClampedArray(this.wasm.memory.buffer, ptr, w * h * 4);
    const imageData = new ImageData(rgba, w, h);
    this.ctx.putImageData(imageData, 0, 0);

    this.frameId = requestAnimationFrame(() => this.frame());
  }

  initAudio() {
    if (this.audioCtx) return;
    try {
      this.audioCtx = new AudioContext({ sampleRate: 48000 });
      const scriptNode = this.audioCtx.createScriptProcessor(2048, 0, 1);
      scriptNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        if (!this.emu) { output.fill(0); return; }
        const len = this.emu.audio_buffer_len();
        if (len === 0) { output.fill(0); return; }
        const ptr = this.emu.audio_buffer_ptr();
        const samples = new Float32Array(this.wasm.memory.buffer, ptr, len);
        for (let i = 0; i < output.length; i++) {
          output[i] = i < samples.length ? samples[i] : 0;
        }
      };
      scriptNode.connect(this.audioCtx.destination);
    } catch (e) {
      // Audio not available — that's fine
    }
  }

  /**
   * Recompute the full Spectrum key state from the set of held DOM keys.
   * This avoids stuck keys from multi-key combos (e.g. arrow = Shift+digit).
   */
  syncKeys() {
    if (!this.emu) return;
    // Release everything first
    this.emu.release_all();
    // Re-press all keys that map from currently held DOM keys
    for (const code of this.heldKeys) {
      this.emu.key_down(code);
    }
  }

  setStatus(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }

  updatePlayButton(playing) {
    const btn = this.shadowRoot?.querySelector('.btn-play');
    if (btn) btn.textContent = playing ? 'Pause' : 'Play';
  }

  disconnectedCallback() {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}

customElements.define('emu198x-player', Emu198xPlayer);
