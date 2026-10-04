/**
 * Behaviour for the lesson listings in styles/lesson.css.
 *
 * - A listing is a focusable, named region only while it scrolls, as the
 *   kit's Listing is: a tab stop that scrolls nothing is noise. The markup
 *   ships focusable, so without JavaScript every listing can still be
 *   scrolled from the keyboard.
 * - While focused, Left, Right, Home and End scroll it. WebKit does not
 *   scroll a focused overflow box by itself.
 * - Copy puts the listing's source on the clipboard and says so.
 * - Listings that share a name on one page are numbered ("Shell, listing 2
 *   of 3"): landmark regions need distinct names to be told apart.
 *
 * Idempotent per element, and run again on every soft navigation.
 */
const STEP = 40;
const keys: Record<string, (el: HTMLElement) => number> = {
  ArrowRight: (el) => el.scrollLeft + STEP,
  ArrowLeft: (el) => el.scrollLeft - STEP,
  Home: () => 0,
  End: (el) => el.scrollWidth,
};

let observer: ResizeObserver | undefined;

function fit(el: HTMLElement) {
  if (el.scrollWidth > el.clientWidth + 1) {
    el.tabIndex = 0;
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', el.dataset.label || 'Listing');
  } else {
    el.removeAttribute('tabindex');
    el.removeAttribute('role');
    el.removeAttribute('aria-label');
  }
}

/** Number listings that share a name across the whole page. The first name
 * seen is kept in data-ll-name, so running again on a soft navigation or
 * after more listings appear renumbers rather than appending twice. */
function numberSharedNames() {
  const groups = new Map<string, HTMLElement[]>();
  for (const el of document.querySelectorAll<HTMLElement>('[data-ll-scroll]')) {
    const name = (el.dataset.llName ??= el.dataset.label || 'Listing');
    const group = groups.get(name);
    if (group) group.push(el);
    else groups.set(name, [el]);
  }
  for (const [name, group] of groups) {
    group.forEach((el, index) => {
      el.dataset.label = group.length > 1 ? `${name} ${index + 1} of ${group.length}` : name;
      if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.dataset.label);
    });
  }
}

export function initListings(root: ParentNode = document) {
  numberSharedNames();
  observer ??= new ResizeObserver((entries) => {
    for (const e of entries) {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-ll-scroll]');
      if (el) fit(el);
    }
  });
  for (const el of root.querySelectorAll<HTMLElement>('[data-ll-scroll]:not([data-ll-ready])')) {
    el.dataset.llReady = '';
    el.addEventListener('keydown', (e) => {
      const to = keys[e.key];
      if (!to || e.target !== el || !el.hasAttribute('tabindex') || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      el.scrollLeft = to(el);
    });
    fit(el);
    observer.observe(el);
    const code = el.querySelector('code');
    if (code) observer.observe(code);
  }
  for (const button of root.querySelectorAll<HTMLButtonElement>('.ll-copy:not([data-ll-ready])')) {
    button.dataset.llReady = '';
    button.hidden = false;
    const label = button.querySelector('.ll-copy-label');
    button.addEventListener('click', async () => {
      const source = button.closest<HTMLElement>('[data-code]')?.dataset.code;
      if (source == null) return;
      try {
        await navigator.clipboard.writeText(source);
        if (label) label.textContent = 'Copied';
        setTimeout(() => { if (label) label.textContent = 'Copy'; }, 2000);
      } catch {
        if (label) label.textContent = 'Copy failed';
      }
    });
  }
}
