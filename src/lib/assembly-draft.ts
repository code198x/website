/** Local recovery for the source and every editable companion, as one draft. */
interface Draft {
  version: 1;
  revision: string;
  source: string;
  files: Record<string, string>;
}

export function parseAssemblyDraft(raw: string): Draft | null {
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || typeof value.revision !== 'string' ||
        typeof value.source !== 'string' || !value.files || Array.isArray(value.files) ||
        typeof value.files !== 'object' ||
        !Object.values(value.files).every(file => typeof file === 'string')) return null;
    return value;
  } catch { return null; }
}

const unsavedChecks = new Set<() => boolean>();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', event => {
    if (![...unsavedChecks].some(check => check())) return;
    event.preventDefault();
    event.returnValue = '';
  });
  document.addEventListener('astro:before-preparation', event => {
    if ([...unsavedChecks].some(check => check())) {
      // Astro falls back to full navigation when preparation is prevented.
      // That invokes the native beforeunload guard; preventing this event
      // alone does not cancel navigation.
      event.preventDefault();
    }
  });
}

export function installAssemblyDraft(
  root: HTMLElement,
  download: (content: string, name: string) => void,
): () => void {
  const source = root.querySelector<HTMLTextAreaElement>('.sandbox-source')!;
  const companions = [...root.querySelectorAll<HTMLTextAreaElement>('.sandbox-companion')];
  const editors = [source, ...companions];
  const revision = root.dataset.draftRevision!;
  // The stable editor key finds an older starter's draft; its revision is
  // checked separately so a changed lesson cannot silently apply old code.
  const key = `code198x:assembly-draft:v1:${location.pathname.replace(/\/$/, '')}:${root.dataset.draftId}`;
  const current = (): Draft => ({
    version: 1, revision, source: source.value,
    files: Object.fromEntries(companions.map(editor => [editor.dataset.filename!, editor.value])),
  });
  const original = JSON.stringify({
    version: 1, revision, source: source.defaultValue,
    files: Object.fromEntries(companions.map(editor => [editor.dataset.filename!, editor.defaultValue])),
  });
  const status = root.querySelector<HTMLElement>('.sandbox-draft-status')!;
  const choices = root.querySelector<HTMLElement>('.sandbox-draft-choices')!;
  const restore = root.querySelector<HTMLButtonElement>('.sandbox-draft-restore')!;
  const discard = root.querySelector<HTMLButtonElement>('.sandbox-draft-discard')!;
  const exportDraft = root.querySelector<HTMLButtonElement>('.sandbox-draft-download')!;
  const run = root.querySelector<HTMLButtonElement>('.sandbox-run')!;
  const revert = root.querySelector<HTMLButtonElement>('.sandbox-revert')!;
  let pending: string | null = null;
  let stored = true;
  let lastStored: string | null = null;
  const dirty = () => JSON.stringify(current()) !== original;
  const needsGuard = () => dirty() && !stored;
  unsavedChecks.add(needsGuard);

  function lock(locked: boolean) {
    editors.forEach(editor => { editor.readOnly = locked; });
    run.disabled = locked;
    revert.disabled = locked;
    choices.hidden = !locked;
  }

  function persist() {
    if (pending !== null) return;
    const value = JSON.stringify(current());
    try {
      // Another tab must not be overwritten without the reader noticing.
      const existing = localStorage.getItem(key);
      if (existing !== lastStored) throw Error('Draft changed in another tab');
      if (dirty()) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
      lastStored = dirty() ? value : null;
      stored = true;
      status.textContent = dirty()
        ? 'Draft saved in this browser. Download source for a copy you can keep.'
        : 'Edits are saved in this browser. Keep a downloaded copy of work you want to keep.';
    } catch {
      stored = false;
      status.textContent = 'These edits could not be saved. Download your source and companion files before leaving.';
    }
  }

  lock(false);
  try {
    pending = localStorage.getItem(key);
    lastStored = pending;
    if (pending !== null) {
      const draft = parseAssemblyDraft(pending);
      const sameFiles = draft && JSON.stringify(Object.keys(draft.files).sort()) ===
        JSON.stringify(Object.keys(current().files).sort());
      restore.disabled = !draft || !sameFiles;
      status.textContent = !draft
        ? 'This saved draft could not be read. Download it before discarding it.'
        : !sameFiles
          ? 'The lesson’s companion files have changed. Download your saved draft before discarding it and using the new starter.'
          : draft.revision !== revision
            ? 'The starting source has changed since your draft. Restore your edits, download them, or discard them to use the new starter.'
            : 'A saved draft is available. Restore your edits, download them, or discard them to use the starting source.';
      lock(true);
    }
  } catch {
    stored = false;
    status.textContent = 'This browser cannot save drafts. Download your source and companion files before leaving.';
  }

  function restoreDraft() {
    const draft = pending === null ? null : parseAssemblyDraft(pending);
    if (!draft || restore.disabled) return;
    source.value = draft.source;
    companions.forEach(editor => { editor.value = draft.files[editor.dataset.filename!]; });
    pending = null;
    lock(false);
    editors.forEach(editor => editor.dispatchEvent(new Event('input', { bubbles: true })));
  }

  function discardDraft() {
    // This explicit choice is the only operation allowed to replace an
    // unreadable or older draft. Removing it may fail in a restricted browser.
    pending = null;
    try { localStorage.removeItem(key); lastStored = null; }
    catch { stored = false; }
    lock(false);
    persist();
  }

  function downloadDraft() {
    download(pending ?? JSON.stringify(current(), null, 2), 'assembly-draft.json');
  }

  editors.forEach(editor => editor.addEventListener('input', persist));
  restore.addEventListener('click', restoreDraft);
  discard.addEventListener('click', discardDraft);
  exportDraft.addEventListener('click', downloadDraft);
  if (pending === null && dirty()) persist();
  return () => {
    unsavedChecks.delete(needsGuard);
    editors.forEach(editor => editor.removeEventListener('input', persist));
    restore.removeEventListener('click', restoreDraft);
    discard.removeEventListener('click', discardDraft);
    exportDraft.removeEventListener('click', downloadDraft);
  };
}
