/**
 * Where the lesson run strip puts its capture, and whether the run panel
 * docks beside the prose. One measured rule for every machine, so a wide
 * frame (Amiga 768px) behaves correctly without a per-machine table.
 */
export const STRIP_BESIDE_MAX = 416;
export const MIN_PROSE = 600;
export const FULLSCREEN_BELOW = 768;

export function stripLayout(captureWidth: number): 'beside' | 'above' {
  return captureWidth <= STRIP_BESIDE_MAX ? 'beside' : 'above';
}

export function panelMode(o: {
  viewportWidth: number;
  containerWidth: number;
  panelWidth: number;
  gap: number;
}): 'docked' | 'overlay' | 'fullscreen' {
  if (o.viewportWidth < FULLSCREEN_BELOW) return 'fullscreen';
  return o.containerWidth - o.panelWidth - o.gap >= MIN_PROSE ? 'docked' : 'overlay';
}
