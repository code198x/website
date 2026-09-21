/** Verify the local browser package directly, independently of lesson UI. */
import {chromium} from '@playwright/test';
const base=process.argv[2] ?? 'http://127.0.0.1:1989';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage();
 await page.goto(base);
 const result=await page.evaluate(async()=>{
  const api=await import('/emu198x_spectrum_web.js');await api.default();
  const checks=[];
  const test=(label,run,expected)=>{
   const m=api.Spectrum.createHeadlessBundled();
   try {
    if (m.readMemory(65535, 1).length !== 1) throw Error('Last memory byte not readable');
    for (const [address, length] of [[65535, 2], [65536, 0], [0, 65537]]) {
      let rejected = false;
      try { m.readMemory(address, length); } catch { rejected = true; }
      if (!rejected) throw Error('Out-of-range memory read accepted');
    }
    const start=performance.now();run(m);const elapsed=performance.now()-start;
    for(let i=0;i<50;i++)m.tick(20);
    const text=JSON.parse(m.query('screen.text.lines')).join('\n');
    if(!text.includes(expected))throw Error(label+': '+text);
    if(JSON.parse(m.query('tape.loaded'))||JSON.parse(m.query('tape.playing')))throw Error('Tape used');
    checks.push({label,milliseconds:Math.round(elapsed),tapeLoaded:false,text});
   }finally{m.free()}
  };
  test('BASIC direct RUN',m=>m.runBasic('10 PRINT "DIRECT BASIC"'),'DIRECT BASIC');
  test('BASIC ROM syntax report',m=>m.runBasic('10 PRONT 2'),'Nonsense');
  // LD A,2; CALL $1601 (open upper screen channel); LD A,"A";
  // RST $10 (ROM print); RET to the ROM USR caller.
  test('assembly ROM printing and return',m=>m.runCode(new Uint8Array([0x3e,2,0xcd,1,0x16,0x3e,65,0xd7,0xc9]),32768,32768),'0 OK');
  if(!checks[2].text.includes('A'))throw Error('ROM print missing');
  return checks;
 });
 console.log(JSON.stringify(result,null,2));
}finally{await browser.close()}
