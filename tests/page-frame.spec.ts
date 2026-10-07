import {test, expect} from '@playwright/test';

for (const width of [390, 1440, 1920]) for (const theme of ['light', 'dark']) {
  test(`shared page frames preserve spacing at ${width}px in ${theme}`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
    const measure = async () => page.evaluate(() => {
      const frame=document.querySelector<HTMLElement>('[data-page-frame]:not(.masthead-frame)')!;
      const heading=frame.querySelector('h1')!.getBoundingClientRect();
      const crumb=document.querySelector('.breadcrumbs ol')!.getBoundingClientRect();
      const box=frame.getBoundingClientRect();const style=getComputedStyle(frame);
      const mast=document.querySelector('.site-mast');
      const mastBox=mast?.getBoundingClientRect();
      const label=mast?.querySelector('.page-masthead-label');
      const band=mastBox && label ? {left:mastBox.left,width:mastBox.width,label:label.getBoundingClientRect().left+parseFloat(getComputedStyle(label).paddingLeft)} : null;
      return {band,heading:heading.x,crumb:crumb.x,width:box.width,left:box.left,right:innerWidth-box.right,padding:parseFloat(style.paddingLeft),opening:parseFloat(style.paddingTop),ending:parseFloat(style.paddingBottom),overflow:document.documentElement.scrollWidth-innerWidth};
    });
    for (const route of ['/systems/', '/foundations/', '/about/']) {
      await page.goto(route);await page.evaluate(()=>document.fonts.ready);
      await expect(page.locator('[data-page-frame]:not(.masthead-frame)')).toHaveCount(1);
      const direct=await measure();
      expect(Math.abs(direct.heading-direct.crumb),route).toBeLessThan(1);
      expect(Math.abs(direct.left-direct.right),route).toBeLessThan(1);
      expect(direct.width).toBeLessThanOrEqual(1264);
      expect(direct.padding).toBeGreaterThanOrEqual(16);
      expect(direct.ending).toBeGreaterThanOrEqual(64);
      expect(direct.overflow).toBeLessThanOrEqual(1);
      if(route==='/about/') {
        expect(direct.opening).toBeGreaterThanOrEqual(40);
        expect(direct.band).not.toBeNull();
        expect(direct.band!.left).toBeCloseTo(direct.left,1);
        expect(direct.band!.width).toBeCloseTo(direct.width,1);
        expect(direct.band!.label).toBeCloseTo(direct.heading,1);
      }
      if(route==='/systems/') {
        // Passing Astro's scope attributes through the frame must retain the
        // approved page typography as well as its geometry.
        const title=page.locator('#live-h');
        await expect(title).toHaveCSS('font-style','italic');
        await expect(title).toHaveCSS('font-weight','900');
      }
      // Follow the real header link through Astro navigation, not another goto.
      await page.goto('/');
      const toggle=page.locator('.site-header .nav-toggle');
      const mobile=await toggle.isVisible();
      if(mobile)await toggle.click();
      await page.locator(`${mobile?'#site-menu':'.site-header .nav-links'} a[href="${route.slice(0,-1)}"]`).click();
      await expect(page).toHaveURL(new RegExp(route.replace(/\/$/,'')+'/?$'));
      await expect(page.locator('[data-page-frame]:not(.masthead-frame)')).toHaveCount(1);
      await page.evaluate(()=>document.fonts.ready);
      expect(await measure(),`${route}: navigation must preserve the direct-load frame`).toEqual(direct);
    }
  });
}

// Full-width page families retain their approved band until their body migrates.
test('legacy full-width bands retain their frame', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/teaching/');
  const band=await page.locator('.site-mast').boundingBox();
  expect(band).not.toBeNull();
  expect(band!.x).toBe(0);
  expect(band!.width).toBe(1440);
});
