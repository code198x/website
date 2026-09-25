/**
 * Loads the browser player's embed script, however many stages or run
 * panels on the page ask for it — once the custom element is defined, every
 * later call resolves immediately.
 *
 * A `<script type="module">` tag, not a dynamic `import()`: Vite's dev
 * server refuses to serve a runtime `import()` of a file under `public/`
 * ("Cannot import non-asset file ... which is inside /public"), which broke
 * Play/Run under `astro dev` while working fine against the built site. A
 * plain script request is just an ordinary asset fetch in both.
 */
const EMBED_SRC = '/emulators/embed.js';
const LOAD_TIMEOUT_MS = 15_000;

let loading: Promise<void> | undefined;

export function loadPlayer(): Promise<void> {
  if (customElements.get('emu198x-player')) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const settle = (fn: () => void) => {
      loading = undefined;
      fn();
    };

    const timer = setTimeout(
      () => settle(() => reject(new Error('Timed out loading the player.'))),
      LOAD_TIMEOUT_MS,
    );

    customElements.whenDefined('emu198x-player').then(() => {
      clearTimeout(timer);
      settle(resolve);
    });

    // Reuse an in-flight (or already-inserted) request instead of asking
    // twice — two stages on the same page, or a stage and a run panel, can
    // both call this before the first one settles.
    let script = document.querySelector<HTMLScriptElement>(`script[type="module"][src="${EMBED_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.type = 'module';
      script.src = EMBED_SRC;
      document.head.appendChild(script);
    }
    script.addEventListener(
      'error',
      () => {
        clearTimeout(timer);
        settle(() => reject(new Error("The player couldn't load.")));
      },
      { once: true },
    );
  });

  return loading;
}
