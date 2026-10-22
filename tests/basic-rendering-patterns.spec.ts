import {test, expect} from '@playwright/test';

const routes = [
  '/patterns/acorn-electron/basic/rendering/text-region/',
  '/patterns/amstrad-cpc/basic/rendering/pixel-box/',
  '/patterns/bbc-micro/basic/rendering/tile-map/',
  '/patterns/sinclair-zx-spectrum/basic/rendering/pixel-box/',
];

test('BASIC captures stay inside the reading column beside the contents', async ({page}, testInfo) => {
  test.setTimeout(120_000);
  const widths = testInfo.project.name === 'desktop' ? [1440,1200,1024,901] : [900,768,390,320];
  for (const width of widths) {
    await page.setViewportSize({width,height:1000});
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('.code-error')).toHaveCount(0);
      const captures = page.locator('.pattern-prose img[src*="basic-rendering"]');
      expect(await captures.count()).toBeGreaterThanOrEqual(2);
      for (const capture of await captures.all()) {
        await capture.scrollIntoViewIfNeeded();
        await capture.evaluate((image: HTMLImageElement) => image.decode());
        const bounds = await capture.evaluate((image: HTMLImageElement) => {
          const rect=image.getBoundingClientRect();
          const article=image.closest('article')!.getBoundingClientRect();
          return {left:rect.left,right:rect.right,width:rect.width,articleLeft:article.left,articleRight:article.right};
        });
        expect(bounds.width).toBeGreaterThan(0);
        expect(bounds.left).toBeGreaterThanOrEqual(bounds.articleLeft-1);
        expect(bounds.right).toBeLessThanOrEqual(bounds.articleRight+1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test('a reduced BASIC capture still opens its complete frame', async ({page}) => {
  await page.goto(routes[0]);
  const capture=page.locator('.pattern-prose img').first();
  await capture.scrollIntoViewIfNeeded();
  await capture.evaluate((image: HTMLImageElement) => image.decode());
  const original=await capture.evaluate((image: HTMLImageElement) => image.src);
  await capture.click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute('src',original);
  await dialog.locator('img').evaluate((image: HTMLImageElement) => image.decode());
  expect(await dialog.locator('img').evaluate((image: HTMLImageElement) => [image.naturalWidth,image.naturalHeight])).toEqual(await capture.evaluate((image: HTMLImageElement) => [image.naturalWidth,image.naturalHeight]));
  await expect(dialog.getByRole('button',{name:'Close',exact:true})).toBeVisible();
  await dialog.getByRole('button',{name:'Close',exact:true}).click();
  await expect(dialog).toHaveCount(0);
});
