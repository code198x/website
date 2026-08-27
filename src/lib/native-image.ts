/**
 * The logic behind `NativeImage.astro`, kept out of the component so every
 * failure it can produce is testable without rendering a page.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { encodePng } from './png.ts';

/**
 * The largest PNG that may be inlined as a data URI.
 *
 * A Spectrum SCREEN$ and a C64 bitmap encode to a few kilobytes, and a 320×256
 * Amiga ILBM stays well inside this. A hi-res interlaced HAM ILBM will exceed
 * it — and that is this budget working: such a picture should not be inlined
 * into every reader's HTML, and the build should say so by name rather than
 * quietly shipping a third of a megabyte of base64.
 */
export const MAX_PNG_BYTES = 96 * 1024;

/** Mode pixels to display pixels, honouring the mode's pixel shape. */
export function displaySize(
  width: number,
  height: number,
  aspectW: number,
  aspectH: number,
): { width: number; height: number } {
  return { width: width * aspectW, height: height * aspectH };
}

/** Resolve `src` inside the code-samples checkout, refusing anything outside it. */
export function resolveSource(src: string, codeSamplesPath: string): string {
  const root = path.resolve(codeSamplesPath);
  const resolved = path.resolve(root, src);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error(`\`${src}\` resolves outside the code-samples checkout`);
  }
  return resolved;
}

const require_ = createRequire(import.meta.url);

interface Probed {
  format: string;
  confidence: string;
}

interface DecodedImage {
  width: number;
  height: number;
  rgba: Uint8Array;
  pixel_aspect_w: number;
  pixel_aspect_h: number;
}

interface Wasm {
  probe(bytes: Uint8Array): Probed | undefined;
  decode_image(bytes: Uint8Array, format: string): DecodedImage;
}

let wasm: Wasm | null = null;

function load(): Wasm {
  if (wasm) return wasm;
  const dir = process.env.PLAY198X_WASM_PATH;
  if (!dir) {
    throw new Error(
      'PLAY198X_WASM_PATH is unset: run scripts/build-wasm.mjs before building the site',
    );
  }
  wasm = require_(path.join(dir, 'play198x_web.js')) as Wasm;
  return wasm;
}

/** Formats this component will render. Anything else is not an image. */
const IMAGE_FORMATS = new Set(['scr', 'koala', 'art-studio', 'ilbm']);

export interface NativeImageOptions {
  src: string;
  codeSamplesPath: string;
  /** Required when probing is not `certain`. */
  format?: string;
}

export async function renderNativeImage(
  options: NativeImageOptions,
): Promise<{ dataUri: string; width: number; height: number }> {
  const { src, codeSamplesPath, format: declared } = options;
  const file = resolveSource(src, codeSamplesPath);

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await readFile(file));
  } catch {
    throw new Error(`\`${src}\` is not in the code-samples checkout at ${codeSamplesPath}`);
  }

  const probed = load().probe(bytes);
  if (!probed) {
    throw new Error(`\`${src}\` is not a format this build recognises`);
  }
  if (!IMAGE_FORMATS.has(probed.format)) {
    throw new Error(`\`${src}\` is a ${probed.format}, which is not an image`);
  }

  if (probed.confidence !== 'certain' && !declared) {
    throw new Error(
      `\`${src}\` probes as ${probed.format} only probably — nothing downstream ` +
        `can catch a miss, so declare it: format="${probed.format}"`,
    );
  }
  if (declared && probed.confidence === 'certain' && declared !== probed.format) {
    throw new Error(
      `\`${src}\` is certainly a ${probed.format}, but format="${declared}" was declared`,
    );
  }

  const image = load().decode_image(bytes, declared ?? probed.format);
  const png = encodePng(image.rgba, image.width, image.height);

  if (png.length > MAX_PNG_BYTES) {
    throw new Error(
      `\`${src}\` encodes to ${png.length} bytes, past the ${MAX_PNG_BYTES}-byte ` +
        `inline budget — it wants an emitted asset file, which this build does not do yet`,
    );
  }

  const size = displaySize(image.width, image.height, image.pixel_aspect_w, image.pixel_aspect_h);
  return {
    dataUri: `data:image/png;base64,${Buffer.from(png).toString('base64')}`,
    ...size,
  };
}
