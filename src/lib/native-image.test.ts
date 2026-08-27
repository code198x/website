import { test } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import {
  displaySize,
  resolveSource,
  renderNativeImage,
  MAX_PNG_BYTES,
} from './native-image.ts';

test('a square pixel displays at its mode size', () => {
  // ZX Spectrum standard: 256×192 mode pixels, 1:1.
  assert.deepEqual(displaySize(256, 192, 1, 1), { width: 256, height: 192 });
});

test('a double-wide pixel displays twice as wide', () => {
  // C64 multicolour bitmap: 160×200 mode pixels at 2:1 is 320×200 on screen.
  // Getting this wrong draws the picture at half its real width.
  assert.deepEqual(displaySize(160, 200, 2, 1), { width: 320, height: 200 });
});

test('a source resolves under the code-samples checkout', () => {
  assert.equal(
    resolveSource('sinclair-zx-spectrum/assembly/gloaming/loading-screen/gloaming.scr', '/tmp/cs'),
    '/tmp/cs/sinclair-zx-spectrum/assembly/gloaming/loading-screen/gloaming.scr',
  );
});

test('a source cannot escape the code-samples checkout', () => {
  assert.throws(
    () => resolveSource('../../../etc/passwd', '/tmp/cs'),
    /outside/,
    'a traversing path must be refused, not resolved',
  );
});

test('the PNG budget is stated, not implied', () => {
  assert.equal(MAX_PNG_BYTES, 96 * 1024);
});

/** A 6912-byte SCREEN$: clear bitmap, attribute 0x28 = PAPER cyan, INK black. */
function screen(attribute = 0x28): Uint8Array {
  const bytes = new Uint8Array(6912);
  bytes.fill(attribute, 6144);
  return bytes;
}

/** A Koala file: load address 0x6000, then 10,001 bytes. Certain by probe. */
function koala(): Uint8Array {
  const bytes = new Uint8Array(10_003);
  bytes[0] = 0x00;
  bytes[1] = 0x60;
  return bytes;
}

/**
 * An Art Studio file: load address 0x2000, length within the 9,002..=9,009
 * window `play198x-core`'s probe accepts (bitmap + screen RAM, plus up to a
 * 7-byte trailing pad). Probable, never Certain — a $2000 load address and a
 * length in a small range are both far too common to be decisive.
 */
function artStudio(): Uint8Array {
  const bytes = new Uint8Array(9009);
  bytes[0] = 0x00;
  bytes[1] = 0x20;
  return bytes;
}

async function fixture(name: string, bytes: Uint8Array): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'native-image-'));
  await writeFile(path.join(dir, name), bytes);
  return dir;
}

test('a SCREEN$ renders to an inline PNG at its mode size', async () => {
  // A SCREEN$ is identified by length alone, so it is only ever Probable —
  // the format must be declared, or the next test's rejection fires instead.
  const dir = await fixture('a.scr', screen());
  const result = await renderNativeImage({ src: 'a.scr', codeSamplesPath: dir, format: 'scr' });

  assert.equal(result.width, 256);
  assert.equal(result.height, 192);
  assert.match(result.dataUri, /^data:image\/png;base64,/);
});

test('a SCREEN$ without a declared format is refused, and the message says what to write', async () => {
  const dir = await fixture('a.scr', screen());
  await assert.rejects(
    renderNativeImage({ src: 'a.scr', codeSamplesPath: dir }),
    (err: Error) => /probable|declare/i.test(err.message) && err.message.includes('format="scr"'),
    'the error must tell the author the exact attribute to add',
  );
});

test('a missing file names the file', async () => {
  const dir = await fixture('a.scr', screen());
  await assert.rejects(
    renderNativeImage({ src: 'absent.scr', codeSamplesPath: dir }),
    /absent\.scr/,
  );
});

test('bytes nothing recognises are refused by name', async () => {
  const dir = await fixture('a.scr', new Uint8Array([1, 2, 3]));
  await assert.rejects(
    renderNativeImage({ src: 'a.scr', codeSamplesPath: dir }),
    /a\.scr/,
  );
});

test('a module is not an image, and says so', async () => {
  // 1084 bytes of zeros then "M.K." is a ProTracker module's signature position.
  const mod = new Uint8Array(1084 + 4);
  mod.set([0x4d, 0x2e, 0x4b, 0x2e], 1080);
  const dir = await fixture('a.mod', mod);
  await assert.rejects(
    renderNativeImage({ src: 'a.mod', codeSamplesPath: dir }),
    /not an image|protracker/i,
  );
});

test('a weak identification must be declared by the author', async () => {
  // Art Studio has no magic number: probing it returns Probable, and a wrong
  // call shows a wrong-looking picture rather than raising an error. The author
  // has to say so, so a misprobe cannot ship quietly.
  const dir = await fixture('a.art', artStudio());
  await assert.rejects(
    renderNativeImage({ src: 'a.art', codeSamplesPath: dir }),
    /probable|declare/i,
  );
});

test('a declared format that contradicts a certain probe is a failure', async () => {
  const dir = await fixture('a.koa', koala());
  await assert.rejects(
    renderNativeImage({ src: 'a.koa', codeSamplesPath: dir, format: 'scr' }),
    /koala/i,
    'the message must name what the bytes certainly are',
  );
});
