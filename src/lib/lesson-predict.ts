/**
 * Predict, then reveal (the approved lesson concept's .pair.predict).
 *
 * Where a lesson asks a question and the very next thing is a capture of
 * the answer, the capture stays covered until the reader asks to see it or
 * opens the explanation. That is the order the unit specification asks for:
 * a short check "before revealing a result". A question is a Question
 * component, or a plain <details> whose summary ends in a question mark.
 *
 * The cover sits on the screen; it never tints or filters the capture
 * (family-visual-identity.md §7), and while it is there the capture is
 * hidden from assistive technology too, so its description does not give
 * the answer away. The reveal is a screen's reveal, which §6 allows; under
 * reduced motion it is instant. Without JavaScript nothing is covered.
 */
function isQuestion(el: Element | null): el is HTMLElement {
  if (!el) return false;
  if (el.matches('[data-question]')) return true;
  if (el.tagName !== 'DETAILS') return false;
  return /\?\s*$/.test(el.querySelector('summary')?.textContent ?? '');
}

export function initPredictions(root: ParentNode = document) {
  for (const figure of root.querySelectorAll<HTMLElement>('.unit-content > .figure-capture:not([data-predict])')) {
    const question = figure.previousElementSibling;
    if (!isQuestion(question)) continue;
    const screen = figure.querySelector<HTMLElement>('[data-h-screen]');
    if (!screen) continue;
    figure.dataset.predict = 'covered';
    const hidden = [...screen.querySelectorAll('img')];
    hidden.forEach((img) => img.setAttribute('aria-hidden', 'true'));

    const cover = document.createElement('div');
    cover.className = 'predict-cover';
    const note = document.createElement('p');
    note.textContent = 'Make your prediction, then reveal the result.';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'predict-reveal';
    button.textContent = 'Show the result';
    cover.append(note, button);
    screen.append(cover);

    const details = question.matches('details') ? question as HTMLDetailsElement : question.querySelector('details');
    const reveal = () => {
      if (figure.dataset.predict !== 'covered') return;
      figure.dataset.predict = 'revealed';
      hidden.forEach((img) => { if (!img.classList.contains('h-screen-bloom')) img.removeAttribute('aria-hidden'); });
      const gone = () => cover.remove();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) gone();
      else { cover.addEventListener('transitionend', gone, { once: true }); setTimeout(gone, 900); }
    };
    button.addEventListener('click', () => {
      reveal();
      if (details && !details.open) details.open = true;
      // Keep focus somewhere sensible once the button is gone.
      details?.querySelector('summary')?.focus();
    });
    details?.addEventListener('toggle', () => { if (details.open) reveal(); });
  }
}
