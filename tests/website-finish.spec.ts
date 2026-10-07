import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes=['/press/','/colophon/','/contribute/','/teaching/','/about/','/systems/by-region/','/family/asm198x/','/family/emu198x/','/family/build198x/','/family/cat198x/','/field-notes/the-sheep-that-slid-off-the-hay-bale/','/from-the-metal/the-stack/','/experiments/bright-spark/wrong-note/','/timeline/','/timeline/1980s/','/timeline/1920s/'];
for(const route of routes) for(const theme of ['light','dark']) {
 test(`reading and discovery: ${route} (${theme})`,async({page})=>{
  await page.addInitScript(theme=>localStorage.setItem('theme',theme),theme);
  const response=await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toHaveCount(1);
  await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(report.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
 });
}

test('colophon includes the lettering actually used in the logo and reachable licences',async({page,request})=>{
 await page.goto('/colophon/');
 for(const font of ['Oxanium Extra Bold','Caveat Bold']) {
  const item=page.locator('.item').filter({hasText:font});
  await expect(item).toBeVisible();
  const response=await request.get((await item.getByRole('link',{name:'Licence'}).getAttribute('href'))!);
  expect(response.ok()).toBe(true);expect(await response.text()).toContain('SIL OPEN FONT LICENSE');
 }
});
