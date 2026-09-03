/**
 * The logic behind `NativeImage.astro`, kept out of the component so every
 * failure it can produce is testable without rendering a page.
 */
import { readFile, realpath } from 'node:fs/promises';
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

/**
 * Verify the geometry a decode handed back is usable before anything
 * downstream trusts it.
 *
 * `native-image.ts` reaches `play198x-web` through a `require()` cast, and a
 * cast checks nothing at runtime. If the decoder ever renamed
 * `pixel_aspect_w`, the cast would read back `undefined`, `displaySize` would
 * compute `NaN`, and the build would emit `<img width="NaN" height="NaN">`
 * successfully — "pixel_aspect is never ignored" failing silently instead of
 * failing loudly and naming the file.
 */
export function assertUsableGeometry(
  geometry: { width: number; height: number; pixel_aspect_w: number; pixel_aspect_h: number },
  src: string,
): void {
  for (const [name, value] of [
    ['width', geometry.width],
    ['height', geometry.height],
    ['pixel_aspect_w', geometry.pixel_aspect_w],
    ['pixel_aspect_h', geometry.pixel_aspect_h],
  ] as const) {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(
        `\`${src}\` decoded with an unusable ${name} (${value}) — play198x-web's ` +
          `DecodedImage shape has drifted from what this build expects`,
      );
    }
  }
}

/** Mode pixels to display pixels, honouring the mode's pixel shape. */
export function displaySize(
  width: number,
  height: number,
  aspectW: number,
  aspectH: number,
): { width: number; height: number } {
  return { width: width * aspectW, height: height * aspectH };
}

/**
 * Resolve `src` inside the code-samples checkout, refusing anything outside
 * it. Purely lexical — `path.resolve` never touches the filesystem — so this
 * catches a `../` typo with a clear message, but not a symlink: a link inside
 * the checkout pointing outside it resolves lexically under `root` and would
 * pass this check. Use `resolveSourceOnDisk` for the syscall-backed guard
 * that also closes that hole.
 */
export function resolveSource(src: string, codeSamplesPath: string): string {
  const root = path.resolve(codeSamplesPath);
  const resolved = path.resolve(root, src);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error(`\`${src}\` resolves outside the code-samples checkout`);
  }
  return resolved;
}

/**
 * Resolve `src` inside the code-samples checkout, verified against the
 * filesystem: a symlink inside the checkout whose target lies outside it is
 * refused, not just a lexically escaping path. Runs `resolveSource`'s cheap
 * lexical check first — it gives the clearer message for the common typo
 * case — then resolves symlinks with `fs.realpath` and checks the *real*
 * path against the *real* root, so neither side can be misled by a link.
 *
 * A target that does not exist (a missing file, or a dangling symlink) is
 * left for the caller's own `readFile` to report — duplicating that failure
 * here would just be a second, differently-worded error for the same cause.
 */
export async function resolveSourceOnDisk(src: string, codeSamplesPath: string): Promise<string> {
  const lexical = resolveSource(src, codeSamplesPath);
  const root = await realpath(path.resolve(codeSamplesPath)).catch(
    () => path.resolve(codeSamplesPath),
  );

  let real: string;
  try {
    real = await realpath(lexical);
  } catch {
    return lexical;
  }

  if (real !== root && !real.startsWith(root + path.sep)) {
    throw new Error(`\`${src}\` resolves outside the code-samples checkout via a symlink`);
  }
  return lexical;
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
  /** Releases the wasm-side struct. `wasm_bindgen` generates this on every class it exports. */
  free(): void;
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
): Promise<{ dataUri: string; width: number; height: number; rgba: Uint8Array }> {
  const { src, codeSamplesPath, format: declared } = options;
  const file = await resolveSourceOnDisk(src, codeSamplesPath);

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
  // Checked regardless of confidence: a Probable mismatch is exactly as
  // dangerous as a Certain one — it would hand the wrong decoder to
  // `decode_image` below, which either throws a message with no file name
  // attached, or worse, decodes bytes it was never meant to read.
  if (declared && declared !== probed.format) {
    throw new Error(
      `\`${src}\` probes as ${probed.format} (${probed.confidence}), but ` +
        `format="${declared}" was declared — decode would use the wrong decoder`,
    );
  }

  let image: DecodedImage;
  try {
    image = load().decode_image(bytes, declared ?? probed.format);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`\`${src}\` failed to decode as ${declared ?? probed.format}: ${message}`);
  }

  // `image` crossed the wasm boundary as a cast, not a checked type — a cast
  // verifies nothing at runtime. Read every field we depend on exactly once
  // (each read of `rgba` clones 192 KiB across the boundary) and free the
  // wasm-side struct before validating or using the copies.
  const { width, height, pixel_aspect_w: aspectW, pixel_aspect_h: aspectH } = image;
  const rgba = image.rgba;
  image.free();

  assertUsableGeometry({ width, height, pixel_aspect_w: aspectW, pixel_aspect_h: aspectH }, src);

  let png: Uint8Array;
  try {
    png = encodePng(rgba, width, height);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`\`${src}\` failed to encode as PNG: ${message}`);
  }

  if (png.length > MAX_PNG_BYTES) {
    throw new Error(
      `\`${src}\` encodes to ${png.length} bytes, past the ${MAX_PNG_BYTES}-byte ` +
        `inline budget — it wants an emitted asset file, which this build does not do yet`,
    );
  }

  const size = displaySize(width, height, aspectW, aspectH);
  return {
    dataUri: `data:image/png;base64,${Buffer.from(png).toString('base64')}`,
    // The core's own pixels, before PNG encoding — kept on the return value
    // so a caller (the browser-decode test) can compare an independent
    // decode of the PNG against the source of truth it was encoded from,
    // rather than only checking that the PNG container round-trips.
    rgba,
    ...size,
  };
}
