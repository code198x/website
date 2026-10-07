/** Reset within one directory; the owner clears its own facets and updates results. */
export function bindDirectoryReset(
  root: HTMLElement,
  query: HTMLInputElement,
  resetFilters: () => void,
  { escape = false }: { escape?: boolean } = {},
) {
  const reset = () => {
    query.value = '';
    resetFilters();
    query.focus();
  };
  root.querySelectorAll<HTMLButtonElement>('[data-clear], [data-reset]').forEach(button => {
    button.addEventListener('click', reset);
  });
  if (escape) query.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      reset();
    }
  });
}
