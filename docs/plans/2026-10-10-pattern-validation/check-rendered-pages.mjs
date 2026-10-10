import { chromium, devices } from 'playwright';
import { strict as assert } from 'node:assert';
const browser = await chromium.launch();
const rows=[];
try {
 for (const [name,options] of [['desktop',{viewport:{width:1440,height:900}}],['mobile',devices['Pixel 7']]]) {
  const context=await browser.newContext(options);
  for (const slug of ['commodore-64/assembly/rendering/hardware-sprites','nintendo-nes/assembly/audio/square-wave']) {
   const page=await context.newPage();
   const errors=[]; page.on('pageerror',error=>errors.push(error.message));
   const response=await page.goto(`${process.env.PATTERN_BASE_URL ?? "http://localhost:4408"}/patterns/${slug}/`);
   assert.equal(response.status(),200);
   const text=await page.locator('.pattern-prose').innerText();
   assert(text.includes('Code status: assembled and emulator-executed.'));
   const code=await page.locator('.pattern-prose pre').allTextContents();
   if(slug.startsWith('commodore')) {
    assert(code.some(s=>s.includes('sprite0_show:')&&s.includes('sta $d010')));
    assert(code.some(s=>s.includes('sprite_shape:')&&s.includes('!for row, 1, 9')));
    assert(code.some(s=>s.includes('DEMO_X = 160')&&s.includes('copy_registers:')));
    assert(text.includes('sprite DMA takes bus time from the CPU'));
   } else {
    assert(code.some(s=>s.includes('pulse1_tone:')));
    assert(text.includes('WAV header’s playback rate'));
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.deepEqual(errors,[]);
   const target=`/private/tmp/198x-pattern-${slug.startsWith('commodore')?'c64':'nes'}-${name}.png`;
   await page.screenshot({path:target,fullPage:true});
   rows.push({name,slug,code_blocks:code.length,status:response.status(),errors,screenshot:target});
   await page.close();
  }
  await context.close();
 }
 console.log(JSON.stringify(rows,null,2));
} finally {await browser.close();}
