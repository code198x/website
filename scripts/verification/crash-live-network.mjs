import {chromium,webkit,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const [base='https://code198x.com',out='docs/plans/crash-live-acceptance/network']=process.argv.slice(2);
await mkdir(out,{recursive:true});
const results=[];
for(const engine of [chromium,webkit]) {
 const browser=await engine.launch();
 try {
  const page=await browser.newPage();page.setDefaultTimeout(20000);
  let attempts=0,releaseDownload;
  const released=new Promise(resolve=>{releaseDownload=resolve});
  await page.route('**/emu198x_spectrum_web_bg*.wasm',async route=>{
   attempts++;
   if(attempts===1)await route.abort('failed');
   else {await released;await route.continue();}
  });
  await page.goto(base+'/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/');
  const root=page.locator('.basic-playground'),source=root.locator('textarea'),run=root.locator('.listing-run');
  await source.fill('10 PRINT "RECOVERED"');await run.click();
  await expect(root.locator('.listing-error')).toContainText('Check your connection');
  assert.equal(attempts,1);await expect(run).toBeEnabled();
  await run.click();await expect(root.locator('.listing-status')).toContainText('Preparing');
  await source.fill('10 PRINT "EDIT DURING DOWNLOAD"');await expect(source).toHaveValue('10 PRINT "EDIT DURING DOWNLOAD"');
  await expect(root.locator('dialog')).not.toBeVisible();
  releaseDownload();
  await expect(root.locator('.machine-transcript pre')).toContainText('RECOVERED',{timeout:60000});
  assert.equal(attempts,2);await root.locator('.edit-basic').click();
  await expect(source).toHaveValue('10 PRINT "EDIT DURING DOWNLOAD"');
  await run.click();await expect(root.locator('.machine-transcript pre')).toContainText('EDIT DURING DOWNLOAD',{timeout:60000});
  results.push({engine:engine.name(),version:browser.version(),attempts,retryWithoutReload:true,editsSurviveDelayedDownload:true});
 }catch(error){results.push({engine:engine.name(),failure:String(error)});}
 finally{await browser.close();}
}
await writeFile(out+'/results.json',JSON.stringify({base,results},null,2)+'\n');console.log(results);
if(results.some(r=>r.failure))process.exitCode=1;
