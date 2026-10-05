interface Choice { id: string; title: string; source: string }
export function initialiseLessonMachines() {
  document.querySelectorAll<HTMLElement>('[data-lesson-machine-panel]:not([data-machine-ready])').forEach(machine => {
    machine.dataset.machineReady = 'true';
    const home = machine.parentElement!;
    const away = home.querySelector<HTMLElement>('.lesson-machine-away')!;
    const editor = machine.querySelector<HTMLTextAreaElement>('.sandbox-source');
    const close = machine.querySelector<HTMLButtonElement>('.lesson-machine-close')!;
    const title = machine.querySelector<HTMLElement>('.lesson-machine-title')!;
    const choices: Choice[] = JSON.parse(machine.querySelector('[data-machine-choices]')!.textContent!);
    const saved = new Map(choices.map(choice => [choice.id, choice.source]));
    let active = choices[0]?.id, opener: HTMLButtonElement | undefined, generation = 0;
    const events = new AbortController();
    const { signal } = events;
    for (const type of ['wheel', 'touchstart', 'keydown']) window.addEventListener(type, () => generation++, { passive: true, signal });
    function preserve(anchor: HTMLElement, change: () => void) {
      const top = anchor.getBoundingClientRect().top, current = ++generation;
      change();
      const restore = () => { if (generation === current && anchor.isConnected) window.scrollBy({ top: anchor.getBoundingClientRect().top - top, behavior: 'instant' }); };
      restore(); requestAnimationFrame(() => { restore(); requestAnimationFrame(restore); });
      setTimeout(restore, 100); setTimeout(restore, 250);
    }
    const poster = machine.querySelector<HTMLImageElement>('[data-machine-poster]');
    const screen = machine.querySelector('.sandbox-machine');
    if (poster && screen) screen.append(poster);
    machine.querySelector('.sandbox-run')?.addEventListener('click', () => { if (poster) poster.hidden = true; }, { signal });
    editor?.addEventListener('input', () => { if (active) saved.set(active, editor.value); }, { signal });
    machine.querySelector('.sandbox-revert')?.addEventListener('click', () => {
      const choice = choices.find(choice => choice.id === active);
      if (choice && editor) queueMicrotask(() => { editor.value = choice.source; saved.set(choice.id, choice.source); editor.dispatchEvent(new Event('input', { bubbles: true })); });
    }, { signal });
    for (const button of document.querySelectorAll<HTMLButtonElement>('[data-lesson-machine]')) {
      if (button.dataset.lessonMachine !== machine.id) continue;
      button.addEventListener('click', () => {
        // Swapping the source resizes the editor, which may sit above the
        // button, so measure before it: Safari has no scroll anchoring to hide the shift.
        preserve(button, () => {
          const choice = choices.find(choice => choice.id === button.dataset.sourceChoice);
          if (choice && editor) {
            if (active) saved.set(active, editor.value);
            active = choice.id; editor.value = saved.get(active)!;
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            title.textContent = choice.title;
            const status = machine.querySelector<HTMLElement>('.sandbox-status');
            if (status) status.textContent = `Selected ${choice.title}. Press Assemble and run to apply this source.`;
          }
          opener?.setAttribute('aria-expanded', 'false'); opener = button;
          button.parentElement!.after(machine); machine.classList.add('is-away'); document.body.classList.add('machine-docked'); away.hidden = false; close.hidden = false; button.setAttribute('aria-expanded', 'true');
        });
        close.focus({ preventScroll: true });
      }, { signal });
    }
    close.addEventListener('click', () => {
      if (!opener) return;
      const anchor = opener;
      preserve(anchor, () => { home.append(machine); machine.classList.remove('is-away'); document.body.classList.remove('machine-docked'); away.hidden = true; close.hidden = true; anchor.setAttribute('aria-expanded', 'false'); });
      anchor.focus({ preventScroll: true });
    }, { signal });
    machine.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !(event.target instanceof HTMLCanvasElement) && !(event.target instanceof HTMLTextAreaElement) && !close.hidden) { event.preventDefault(); close.click(); }
    }, { signal });
    document.addEventListener('astro:before-swap', () => { events.abort(); document.body.classList.remove('machine-docked'); }, { once: true, signal });
  });
}
