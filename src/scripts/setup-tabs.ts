/** Enhance each OS selector once, including after Astro client navigation. */
export function initialiseSetupTabs() {
  document.querySelectorAll<HTMLElement>('[data-setup-tabs]').forEach(group => {
    if (group.dataset.ready) return;
    group.dataset.ready = 'true';
    const tabs = [...group.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...group.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    const select = (selected: HTMLButtonElement) => {
      tabs.forEach(tab => {
        const active = tab === selected;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => {
        const active = panel.id === selected.getAttribute('aria-controls');
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', event => {
        let next: number;
        switch (event.key) {
          case 'ArrowRight': next = (index + 1) % tabs.length; break;
          case 'ArrowLeft': next = (index + tabs.length - 1) % tabs.length; break;
          case 'Home': next = 0; break;
          case 'End': next = tabs.length - 1; break;
          default: return;
        }
        event.preventDefault();
        select(tabs[next]);
        tabs[next].focus();
      });
    });
    if (tabs[0]) select(tabs[0]);
  });
}

initialiseSetupTabs();
document.addEventListener('astro:page-load', initialiseSetupTabs);
