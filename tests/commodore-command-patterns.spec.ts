import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const routes = [['commodore-64','basic'],['commodore-pet','basic'],['commodore-pet','assembly'],['commodore-vic-20','basic'],['commodore-vic-20','assembly']];
for (const [machine,track] of routes) test(`${machine} ${track} command contract, source and captures`, async ({page,request}) => {
  await page.goto(`/patterns/${machine}/${track}/framework/command-loop/`);
  const prose=page.locator('main');
  await expect(prose.getByRole('heading',{name:/Wait for a command/})).toBeVisible();
  const source=path.join(process.env.CODE_SAMPLES_PATH || '../code-samples',machine,`patterns/${track}/framework/command-loop`);
  const files=track==='basic'?['caller.bas','routines.bas','customise.bas','mistakes/reset-each-command.bas']:['demo.asm','caller.inc','routines.inc','presentation.inc','customise.inc','mistakes/reset-each-command.inc'];
  const listings=prose.locator('.lesson-listing[data-code]');
  await expect(listings).toHaveCount(files.length);
  for(let i=0;i<files.length;i++)expect(await listings.nth(i).getAttribute('data-code')).toBe(fs.readFileSync(path.join(source,files[i]),'utf8'));
  for(const [name,native] of [['working','working'],['step-three','step-three'],['reset-mistake','wrong-reset']]){
    const url=`/images/${machine}/patterns/${track}-command-loop/${name}.png`;
    const response=await request.get(url);expect(response.status()).toBe(200);
    expect(Buffer.compare(await response.body(),fs.readFileSync(path.join(source,'verification/reusable',`${native}-second.png`)))).toBe(0);
    await expect(prose.locator(`img[src="${url}"]`)).toHaveCount(1);
  }
  await expect(prose.getByRole('heading',{name:/Common mistake/})).toBeVisible();
  await expect(prose.getByRole('heading',{name:'Make it your own'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('comparison exposes all five Commodore language routes',async({page})=>{
  await page.goto('/patterns/cross-platform/framework/game-loop-choices/');
  for(const [machine,track] of routes)await expect(page.locator(`main a[href="/patterns/${machine}/${track}/framework/command-loop/"]`)).toHaveCount(1);
});
