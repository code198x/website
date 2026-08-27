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

  const pixel = await page.evaluate(async (dataUri) => {
    const img = new Image();
    img.src = dataUri;
    await img.decode();

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(img, 0, 0);

    return {
      width: img.width,
      height: img.height,
      topLeft: [...context.getImageData(0, 0, 1, 1).data],
    };
  }, image.dataUri);

  expect(pixel.width).toBe(256);
  expect(pixel.height).toBe(192);
  expect(pixel.topLeft[3]).toBe(255); // opaque, as every one of these formats is
});
