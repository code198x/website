/**
 * Captures are evidence: they render at a whole multiple of their native
 * pixels, never a fraction. Stages size themselves from a capture's native
 * width, read here from its PNG header.
 */
const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

export function pngSize(bytes: Uint8Array): { width: number; height: number } {
  if (bytes.length < 24 || SIGNATURE.some((b, i) => bytes[i] !== b)) {
    throw new Error('not a PNG');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}
