import {test, expect} from '@playwright/test';

for (const width of [390, 1440, 1920]) {
  test(`shared page frames preserve spacing at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:900});
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


// Inventory the built result, rather than guessing which route patterns exist.
// Unknown unframed documents fail here and during npm run build.
import {execFileSync} from 'node:child_process';
const families: Record<string, string[]> = JSON.parse(execFileSync('python3', ['scripts/check-page-frames.py', '--json'], {encoding: 'utf8'}));
for (const routes of Object.values(families)) for (const width of [390, 1440, 1920]) {
  const route = routes[0] === '/404.html' ? '/not-a-real-page/' : routes[0];
  test(`one outer frame: ${route} at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 950});
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const box = (element: Element) => {
        const bounds = element.getBoundingClientRect();
        return {name: element.className || element.tagName, x: bounds.x, width: bounds.width, inset: parseFloat(getComputedStyle(element).paddingLeft)};
      };
      const main = document.querySelector('main#main-content')!;
      return {
        frames: [...document.querySelectorAll('[data-site-frame]')].filter(element => element.getBoundingClientRect().width).map(box),
        roots: [...main.children].filter(element => element.getBoundingClientRect().width && !['STYLE', 'SCRIPT'].includes(element.tagName)).map(box),
        bands: [...main.querySelectorAll('.page-masthead,.system-magazine-mast,.module-magazine-mast,.article-context-band,.lesson-mast')].map(box),
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    expect(geometry.frames.length).toBeGreaterThanOrEqual(3);
    expect(geometry.roots.length).toBeGreaterThan(0);
    const frameWidth = Math.min(width, 1264);
    const left = (width - frameWidth) / 2;
    for (const frame of [...geometry.frames, ...geometry.roots, ...geometry.bands]) {
      expect(frame.width, `${route}: ${frame.name} width`).toBeCloseTo(frameWidth, 0);
      expect(frame.x, `${route}: ${frame.name} left edge`).toBeCloseTo(left, 0);
    }
    const gutter = geometry.frames.find(frame => frame.name.includes('site-bar'))!.inset;
    for (const root of geometry.roots.filter(root => !root.name.includes('masthead-frame'))) {
      expect(root.inset, `${route}: ${root.name} gutter`).toBeCloseTo(gutter, 1);
    }
    for (const frame of geometry.frames.filter(frame => /breadcrumbs-inner|footer-container/.test(frame.name))) {
      expect(frame.inset, `${route}: ${frame.name} gutter`).toBeCloseTo(gutter, 1);
    }
    expect(geometry.overflow, route).toBeLessThanOrEqual(1);
  });
}

test('movement playground remains interactive inside the shared frame', async ({page}) => {
  await page.goto('/experiments/game-feel/');
  const frame = page.frameLocator('[data-playground]');
  await expect(frame.locator('#status')).toContainText('Ready');
  await frame.getByRole('button', {name: 'Run comparison'}).click();
  await expect(frame.locator('#status')).not.toContainText('Ready');
  await frame.getByRole('button', {name: 'Reset', exact: true}).click();
  const before = (await page.locator('[data-playground]').boundingBox())!.height;
  await frame.getByText('Inspect one update', {exact: true}).click();
  await expect.poll(async () => (await page.locator('[data-playground]').boundingBox())!.height).toBeGreaterThan(before);
  await frame.getByRole('link', {name: 'Explore Game Feel'}).click();
  await expect(page).toHaveURL(/\/craft\/game-feel\/$/);
});
