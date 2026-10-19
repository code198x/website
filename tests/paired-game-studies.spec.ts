import {expect,test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for(const [slug,figures,sources] of [['monty-mole',4,7],['elite',5,20],['manic-miner',4,9],['lemmings',5,12],['boulder-dash',4,9],['mule',9,13],['pac-man',5,16],['simcity',6,17]] as const){
 test(`${slug} preserves evidence, navigation and readable responsive figures`,async({page})=>{
  await page.goto(`/vault/studies/${slug}/`);
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('.article-opening .breadcrumbs')).toHaveCount(0);
  await expect.poll(async()=>(await page.locator('.breadcrumbs').boundingBox())!.y+(await page.locator('.breadcrumbs').boundingBox())!.height).toBeLessThanOrEqual((await page.locator('.article-opening').boundingBox())!.y+1);
  const opening=await page.locator('.article-opening').boundingBox();
  const frame=await page.locator('main').boundingBox();
  expect(opening!.x).toBeCloseTo(frame!.x,1);expect(opening!.width).toBeCloseTo(frame!.width,1);
  for(const a of await page.locator('.study-contents a, .feature-prose a[href^="#source-"]').all())await expect(page.locator((await a.getAttribute('href'))!)).toHaveCount(1);
  await expect(page.locator('.feature-prose span[id^="source-"]')).toHaveCount(sources);
  await expect(page.locator('.article-figure')).toHaveCount(figures);
  for(const image of await page.locator('.article-figure img').all()){
   await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(i=>(i as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
   const pixels=await image.locator('..').locator('..').getAttribute('data-pixels');
   if(pixels)expect((await image.boundingBox())!.width).toBeLessThanOrEqual(512);
  }
  const diagram=page.locator('.article-figure picture img');await expect(diagram).toHaveCount(slug==='mule'?3:slug==='monty-mole'||slug==='elite'?1:2);
  for(const image of await diagram.all()){
   expect(await image.evaluate(i=>(i as HTMLImageElement).currentSrc.endsWith('-phone.svg'))).toBe(page.viewportSize()!.width<=760);
   const diagramBox=await image.boundingBox();const pictureBox=await image.locator('..').boundingBox();
   expect(diagramBox!.width).toBeCloseTo(pictureBox!.width,1);
  }
  const prose=(await page.locator('.feature-prose>p').allTextContents()).join(' ').replace(/\s+/g,' ');
  await expect(page.locator('.article-pullquote')).toHaveCount(2);
  for(const quote of await page.locator('.article-pullquote').all()){
   await expect(quote).toHaveAttribute('aria-hidden','true');expect(prose).toContain(await quote.locator('p').innerText());
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
 });
}
