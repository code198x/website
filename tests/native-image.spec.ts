import { test, expect } from '@playwright/test';
import { renderNativeImage } from '../src/lib/native-image.ts';

test('a browser decodes our PNG to the pixels the core produced', async ({ page }) => {
  const image = await renderNativeImage({
    src: 'sinclair-zx-spectrum/assembly/gloaming/loading-screen/gloaming.scr',
    codeSamplesPath: process.env.CODE_SAMPLES_PATH!,
    format: 'scr',
  });

  expect(image.width).toBe(256);
  expect(image.height).toBe(192);

  // The comparison itself runs inside the page. `image.rgba` is 196,608 bytes
  // (256×192×4) — passing it in once as a plain array and diffing it against
  // the canvas's own ImageData in-browser means only that one array crosses
  // the evaluate boundary, plus a small result object back. Returning both
  // full buffers and diffing out here would serialise the same data twice.
  const result = await page.evaluate(
    async ({ dataUri, ours, width, height }) => {
      const img = new Image();
      img.src = dataUri;
      await img.decode();

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d')!;
      context.drawImage(img, 0, 0);

      const browser = context.getImageData(0, 0, img.width, img.height).data;

      let diffCount = 0;
      let first: { x: number; y: number; ours: number[]; browser: number[] } | null = null;

      for (let i = 0; i < ours.length; i++) {
        if (ours[i] !== browser[i]) {
          diffCount++;
          if (!first) {
            const pixelIndex = Math.floor(i / 4);
            const x = pixelIndex % width;
            const y = Math.floor(pixelIndex / width);
            const base = pixelIndex * 4;
            first = {
              x,
              y,
              ours: [ours[base], ours[base + 1], ours[base + 2], ours[base + 3]],
              browser: [browser[base], browser[base + 1], browser[base + 2], browser[base + 3]],
            };
          }
        }
      }

      return {
        width: img.width,
        height: img.height,
        byteCount: browser.length,
        diffCount,
        first,
      };
    },
    { dataUri: image.dataUri, ours: Array.from(image.rgba), width: image.width, height: image.height },
  );

  expect(result.width).toBe(256);
  expect(result.height).toBe(192);
  expect(result.byteCount).toBe(image.rgba.length);

  if (result.diffCount > 0) {
    const { x, y, ours, browser } = result.first!;
    throw new Error(
      `${result.diffCount} of ${result.byteCount} bytes differ between the core's pixels and ` +
        `what the browser decoded from our PNG. First mismatch at (${x},${y}): ` +
        `ours rgba(${ours.join(',')}) vs browser rgba(${browser.join(',')}) — ` +
        `the encoder or the decode is wrong, not this test.`,
    );
  }
});
