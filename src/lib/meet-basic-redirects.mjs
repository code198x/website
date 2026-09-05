/** Existing numbered lessons retain their topic and fragment IDs as references. */
export function meetBasicRedirects() {
  return Object.fromEntries(Array.from({ length: 15 }, (_, i) => {
    const unit = `unit-${String(i + 1).padStart(2, '0')}`;
    const destination = `/systems/sinclair-zx-spectrum/basic/basic-reference/${unit}`;
    return [
      [`/systems/sinclair-zx-spectrum/basic/meet-basic/${unit}`, destination],
      [`/sinclair-zx-spectrum/basic/meet-basic/${unit}`, destination],
    ];
  }).flat());
}
