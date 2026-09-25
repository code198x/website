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
 *
 * A failed or timed-out attempt removes its own <script> and bumps a
 * module-level counter, so the next attempt asks for `embed.js?attempt=2`
 * (then `?attempt=3`, ...) rather than the plain URL — a browser caches a
 * failed module fetch in its module map keyed by URL, so a second <script>
 * with the exact same `src` never re-fetches, however cleanly the failed one
 * is removed first. `embed.js` carries that query on to `player.js` itself
 * (`hostUrl.search = new URL(import.meta.url).search`), so the whole chain
 * re-fetches consistently on retry.
 */
const EMBED_PATH = '/emulators/embed.js';
const LOAD_TIMEOUT_MS = 15_000;

let loading: Promise<void> | undefined;
let nextAttempt = 1;

export function loadPlayer(): Promise<void> {
  if (customElements.get('emu198x-player')) return Promise.resolve();
  if (loading) return loading;

  const attempt = nextAttempt;
  const src = attempt === 1 ? EMBED_PATH : `${EMBED_PATH}?attempt=${attempt}`;

  loading = new Promise<void>((resolve, reject) => {
    const settle = (fn: () => void) => {
      loading = undefined;
      fn();
    };

    // Reuse an in-flight (or already-inserted) first attempt instead of
    // asking twice — two stages on the same page, or a stage and a run
    // panel, can both call this before the first one settles. A retry after
    // a failure always gets its own fresh element and URL: the failed one
    // was removed by `fail` below, so nothing to find or reuse.
    let script = attempt === 1
      ? document.querySelector<HTMLScriptElement>(`script[type="module"][src="${EMBED_PATH}"]`)
      : null;

    const fail = (message: string) => {
      clearTimeout(timer);
      script?.remove();
      nextAttempt = attempt + 1;
      settle(() => reject(new Error(message)));
    };

    const timer = setTimeout(() => fail('Timed out loading the player.'), LOAD_TIMEOUT_MS);

    // Resolves the first time the element is ever defined — even if that's
    // a later attempt's script finishing after this one already timed out.
    // resolve() on an already-settled promise is a no-op, and embed.js
    // itself guards `customElements.define` behind
    // `if (!customElements.get(...))`, so a slow, superseded script can't
    // double-define the element or throw.
    customElements.whenDefined('emu198x-player').then(() => {
      clearTimeout(timer);
      settle(resolve);
    });

    if (!script) {
      script = document.createElement('script');
      script.type = 'module';
      script.src = src;
      document.head.appendChild(script);
    }
    script.addEventListener('error', () => fail("The player couldn't load."), { once: true });
  });

  return loading;
}
