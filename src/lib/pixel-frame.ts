/**
 * Captures are evidence: they render at a whole multiple of their native
 * pixels, never a fraction. These rules are shared by PixelFrame (CSS
 * container queries) and the lesson panel (measured at runtime).
 */
const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

export function pngSize(bytes: Uint8Array): { width: number; height: number } {
  if (bytes.length < 24 || SIGNATURE.some((b, i) => bytes[i] !== b)) {
    throw new Error('not a PNG');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

export function integerScale(nativeWidth: number, containerWidth: number, ceiling: number): number {
  return Math.max(1, Math.min(ceiling, Math.floor(containerWidth / nativeWidth)));
}
